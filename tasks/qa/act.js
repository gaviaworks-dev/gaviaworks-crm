/* act.js — AKSİYON TARAYICISI (ders L-23)
 *
 * Sorduğu tek soru: **"Bu buton gerçekten bir şey yapıyor mu?"**
 *
 * Neden var: UID-27 beş oturum boyunca sessiz kaldı. `GV.list`, `run` yordamı
 * olmayan bir toplu işlemde yeşil "N kayıt işlendi" başarı mesajı basıp hiçbir
 * şey yapmıyordu. Mevcut taramaların hiçbiri bunu göremezdi:
 *   qa.js     → konsola bakar, hata yok
 *   links.js  → href'e bakar, buton href taşımıyor
 *   mut.js    → GV.refresh() sonrası çoğalma arar, mutasyon hiç olmadığı için temiz
 *   esc.js    → metin arar
 * Yani eksen yoktu. Bu dosya o ekseni kurar (L-23).
 *
 * YÖNTEM — her aksiyon için:
 *   1. Ekranı taze yükle, `gv:ready` bekle.
 *   2. DB'nin tam parmak izini al (tüm dizi koleksiyonların JSON'u + URL).
 *   3. Aksiyonu tetikle (gerekirse GV.confirm modalını onayla).
 *   4. Parmak izini yeniden al ve karşılaştır.
 *
 * HÜKÜM:
 *   MUTASYON   → veri değişti                                  ✅
 *   YÖNLENDİRME→ adres değişti (başka ekrana gitti)             ✅
 *   PANEL      → modal/drawer açıldı (kullanıcıya bir şey sundu) ✅
 *   ÇIKTI      → çıktı modalı onaylandı ve DOSYA indirildi         ✅
 *   DÜRÜST RED → veri değişmedi ama warn/danger tonda uyarı bastı ✅
 *   🔴 YALAN   → veri değişmedi AMA **başarı (ok) mesajı** bastı  İHLAL
 *   ⚫ ÖLÜ     → veri değişmedi, hiçbir geri bildirim yok         İHLAL
 *
 * "YALAN" hükmü "ÖLÜ"den ağırdır: ölü buton kullanıcıyı yanıltmaz, yalan buton
 * yanıltır. CLAUDE.md'nin "sahte buton, çalışmayan aksiyon yasak" kuralı ikisini
 * de kapsar.
 *
 * KAPSAM: toplu işlemler (`[data-bulk]`) · satır aksiyonları (`[data-rowact]`) ·
 * form kaydet düğmeleri. `href` taşıyan aksiyon `<a>` olarak basıldığı için
 * kapsam dışıdır — onu `links.js` doğrular.
 *
 * HEDEF LİSTESİ ELLE YAZILMAZ (dersler L-19 · L-24): `qa-lib.fullTargets()`
 * kullanılır — `rec.js`'in veriden doğruladığı `qa-targets.json` + `shell.js`
 * `BUILT` dizisi. Bu script kendi listesini KURMAZ.
 *
 * Kullanım:
 *   node act.js                 # tüm ekranlar
 *   node act.js "app-lead.html" # tek ekran
 */
const { chromium } = require('playwright');
const LIB = require('./qa-lib');

const BASE = 'http://127.0.0.1:8791/';
const ROLE = 'sahip';                       // tam yetkili — yetki kapısı bu taramanın konusu değil
const SETTLE = 260;                          // aksiyon sonrası bekleme (ms)
const ROW_TRIES = 5;                         // satır aksiyonu kaç satırda denenir (ön koşul tuzağı)

/* ---- hedefler: qa-lib'den. Bu script kendi listesini KURMAZ (ders L-24) ---- */
const url = (t) => BASE + t + (t.indexOf('?') === -1 ? '?' : '&') + 'role=' + ROLE;

/* ---- DB parmak izi: tüm dizi koleksiyonların içeriği ---- */
const FINGERPRINT = `(() => {
  if (typeof DB === 'undefined') return { db: '', url: location.href, overlay: 0 };
  const keys = Object.keys(DB).filter(k => Array.isArray(DB[k])).sort();
  let s = '';
  for (const k of keys) s += k + ':' + JSON.stringify(DB[k]) + '|';
  // scrim + drawer + modal: GV.drawer scrim BASMADAN açılabiliyor ve yalnız
  // scrim sayan ölçüm, panel açan aksiyonu yanlışlıkla 'ÖLÜ' sayıyordu.
  return { db: s, url: location.href,
           overlay: document.querySelectorAll('.gv-scrim, .gv-drawer, .gv-modal').length };
})()`;

const TOASTS = `Array.from(document.querySelectorAll('.gv-toast')).map(e => ({
  tone: (e.className.match(/is-(\\w+)/) || [])[1] || '',
  text: (e.querySelector('span') || {}).textContent || ''
}))`;

/* Yönlendirme sırasında evaluate patlayabilir; güvenli sarmalayıcı. */
async function fp(page) {
  let r = { db: '', overlay: 0 };
  try { r = await page.evaluate(FINGERPRINT); } catch (e) { /* gezinme yarışı */ }
  return { db: r.db, overlay: r.overlay, nav: page.url().split('?')[0] };
}
async function toastsOf(page) {
  try { return await page.evaluate(TOASTS); } catch (e) { return []; }
}

async function ready(page, t) {
  await page.goto(url(t), { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(420);
  // 403 kapısı veya boş sayfa → aksiyon taraması anlamsız
  return await page.evaluate(`!!document.querySelector('[data-bulk],[data-rowact],button,.gv-page')`);
}

/* Confirm modalı açıldıysa Onayla'ya bas (data-act="1"). */
async function passConfirm(page) {
  /* YALNIZ gerçek onay modalı: `GV.confirm` `size:'sm'` + tam iki aksiyon üretir.
     Önceden herhangi bir `[data-act="1"]`'e basılıyordu; drawer'ın kendi aksiyon
     butonuna basıp paneli kapatıyor ve aksiyonu 'ÖLÜ' gösteriyordu.
     İkinci düzeltme (10. oturum): çıktı modalı da `is-sm` + iki aksiyondur ama
     **form kontrolü taşır**; onay modalı hiçbir zaman girdi sormaz. */
  const isConfirm = await page.evaluate(
    `(() => { const m = document.querySelector('.gv-modal.is-sm');
       return !!(m && m.querySelectorAll('[data-act]').length === 2
                   && !m.querySelector('input, select, textarea')); })()`);
  if (!isConfirm) return false;
  const ok = await page.$('.gv-modal.is-sm [data-act="1"]');
  if (!ok) return false;
  await ok.click().catch(() => {});
  await page.waitForTimeout(SETTLE);
  return true;
}

/* Girdi soran modal/panel açık mı? Öyleyse aksiyonun İKİNCİ adımı (doldur → kaydet)
   bu araçla ölçülmez; buton sağlıklıdır ama zincirin devamı ölçüsüz kalır.
   Sessizce yeşil sayılmaz — ayrı sayaçta raporlanır (L-19 ruhu). */
async function formModalOpen(page) {
  return await page.evaluate(
    `!!document.querySelector('.gv-modal input, .gv-modal select, .gv-modal textarea, .gv-drawer input, .gv-drawer select, .gv-drawer textarea')`);
}

/* Çıktı modalı açıldıysa CSV seçip "Çıktı Al"a bas — gerçekten dosya üretiyor mu
   ölçülsün diye. (UID-07: seçili kapsamı dışa aktarma bileşene alındı; çıktı bir
   MUTASYON değildir ama ölü de değildir — kendi hükmü vardır.) */
async function passExport(page) {
  const isExport = await page.evaluate(
    `!!document.querySelector('.gv-modal [name=expfmt]')`);
  if (!isExport) return false;
  await page.evaluate(`(() => {
    const r = document.querySelector('.gv-modal [name=expfmt][value="csv"]');
    if (r) r.checked = true;
  })()`);
  const ok = await page.$('.gv-modal [data-act="1"]');
  if (!ok) return false;
  await ok.click().catch(() => {});
  await page.waitForTimeout(SETTLE);
  return true;
}

/* Hüküm sıralaması — bir satır aksiyonunun EN İYİ sonucu esastır. */
const ORDER = ['⚫ ÖLÜ', '🔴 YALAN', 'DÜRÜST RED', 'PANEL', 'ÇIKTI', 'YÖNLENDİRME', 'MUTASYON'];
const RANK = (r) => ORDER.indexOf(r.v);

function verdict(before, after, toasts, confirmed, exported, formish) {
  /* ÇIKTI: dosya indirildi ya da yazdırma penceresi açıldı. Veri değişmez,
     ama kullanıcıya gerçek bir çıktı verilir — yalan da ölü de değildir. */
  if (exported) return exported.file
    ? { v: 'ÇIKTI', bad: false }
    : { v: '🔴 YALAN', bad: true, why: 'çıktı modalı onaylandı ama dosya üretilmedi' };
  /* Yönlendirme ÖNCE bakılır: sayfa gittiyse DB parmak izi yeni sayfanınkidir,
   * karşılaştırmak anlamsızdır. URL `page.url()`'den gelir — sayfa içi
   * `location.href` yönlendirme yarışında eski değeri döndürüyordu ve 32 form
   * kaydet düğmesi yanlışlıkla "ÖLÜ" sayılmıştı (L-17'nin dördüncü tekrarı). */
  if (before.nav !== after.nav) return { v: 'YÖNLENDİRME', bad: false };
  if (before.db !== after.db) return { v: 'MUTASYON', bad: false };
  // confirm modalı sayılmaz; ondan SONRA açık kalan overlay gerçek bir panel demektir
  if (after.overlay > before.overlay && !confirmed) return { v: 'PANEL', bad: false, form: !!formish };
  const ok = toasts.some(t => t.tone === 'ok');
  /* 'info' tonu da dürüst bir reddir ("bu kayıt zaten onaylı") — 'ok' değildir,
     bir şey olduğunu iddia etmez. Metni saklanır ki gözle doğrulanabilsin. */
  const uyari = toasts.filter(t => ['warn', 'danger', 'info'].indexOf(t.tone) !== -1)[0];
  if (ok) return { v: '🔴 YALAN', bad: true, why: 'başarı mesajı bastı, veri değişmedi' };
  if (uyari) return { v: 'DÜRÜST RED', bad: false, why: uyari.tone + ': ' + uyari.text.slice(0, 70) };
  if (after.overlay > before.overlay) return { v: 'PANEL', bad: false, form: !!formish };
  return { v: '⚫ ÖLÜ', bad: true, why: 'hiçbir geri bildirim yok, veri değişmedi' };
}

(async () => {
  const browser = await chromium.launch();
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  /* İndirilen dosya sayacı — "çıktı gerçekten üretildi mi" ölçümü (UID-07) */
  let dl = 0;
  page.on('download', async (d) => { dl++; try { await d.delete(); } catch (e) {} });
  const list = LIB.fullTargets(process.argv[2]);
  console.log(`hedef: ${list.length} ekran`);

  const rows = [];
  let ihlal = 0, denenen = 0, ekran = 0, kayitli = 0, todoB = 0, todoR = 0;

  for (const t of list) {
    const alive = await ready(page, t);
    if (!alive) continue;
    ekran++;
    if (t.indexOf('?id=') !== -1) {
      const loaded = await page.evaluate(
        `!!(document.querySelector('.gv-rec-code') || document.querySelectorAll('input,select,textarea').length > 3)`);
      if (loaded) kayitli++;
    }

    /* --- 1) toplu işlemler --- */
    const bulks = await page.evaluate(`(() => {
      const sa = document.querySelector('[data-selectall]'); if (sa) { sa.click(); }
      return Array.from(document.querySelectorAll('[data-bulk]')).map(b => b.dataset.bulk);
    })()`);
    /* UID-27 sonrası: `run`suz aksiyon `disabled` + "bu sürümde yok" olarak basılır.
       Bu DÜRÜST bir durumdur, ihlal değil — ama sayılır ki görünmez kalmasın. */
    todoB += await page.evaluate(`document.querySelectorAll('[data-bulk-todo]').length`);
    todoR += await page.evaluate(`document.querySelectorAll('[data-rowact-todo]').length ? 1 : 0`);

    for (const key of bulks) {
      await ready(page, t);
      await page.evaluate(`(() => { const sa = document.querySelector('[data-selectall]'); if (sa) sa.click(); })()`);
      await page.waitForTimeout(120);
      const before = await fp(page);
      const btn = await page.$(`[data-bulk="${key}"]`);
      if (!btn) continue;
      /* Buton görünmüyorsa (seçilebilir satır yok: boş sekme ya da kanban görünümü)
         tıklama sessizce başarısız olur ve aksiyon yanlışlıkla "ÖLÜ" sayılırdı.
         Ulaşılamayan aksiyon ihlal değildir ama görünmez de kalmaz. */
      if (!(await btn.isVisible().catch(() => false))) {
        rows.push({ t, tip: 'toplu', key, v: 'ULAŞILMADI', bad: false, unreach: true });
        continue;
      }
      denenen++;
      await btn.click().catch(() => {});
      await page.waitForTimeout(SETTLE);
      const dl0 = dl;
      const didExp = await passExport(page);
      if (didExp) await page.waitForTimeout(SETTLE);
      const formish = didExp ? false : await formModalOpen(page);
      const confirmed = didExp ? false : await passConfirm(page);
      const toasts = await toastsOf(page);
      const after = await fp(page);
      const r = verdict(before, after, toasts, confirmed, didExp ? { file: dl > dl0 } : null, formish);
      if (r.bad) ihlal++;
      rows.push({ t, tip: 'toplu', key, ...r });
    }

    /* --- 2) satır aksiyonları --- ÇOK SATIR DENENİR.
       Tek satır denemek yanıltıyordu: ilk satır aksiyonun ön koşulunu sağlamıyorsa
       (zaten onaylı kayıt, onay aşamasında olmayan talep) yordam dürüstçe reddediyor,
       araç bunu "aksiyon çalışmıyor" sanıyordu. Aksiyon, satırlardan **herhangi
       birinde** gerçek bir sonuç üretiyorsa çalışıyordur. */
    await ready(page, t);
    const racts = await page.evaluate(
      `Array.from(document.querySelectorAll('tr [data-rowact]')).slice(0, 12).map(b => b.dataset.rowact)`);
    const uniqR = [...new Set(racts)];
    for (const key of uniqR) {
      let best = null, tried = 0;
      for (let i = 0; i < ROW_TRIES; i++) {
        await ready(page, t);
        const n = await page.evaluate(`document.querySelectorAll('tr [data-rowact="${key}"]').length`);
        if (i >= n) break;
        const before = await fp(page);
        const btn = (await page.$$(`tr [data-rowact="${key}"]`))[i];
        if (!btn) break;
        tried++;
        await btn.click().catch(() => {});
        await page.waitForTimeout(SETTLE);
        const dl0 = dl;
        const didExp = await passExport(page);
        if (didExp) await page.waitForTimeout(SETTLE);
        const formish = didExp ? false : await formModalOpen(page);
        const confirmed = didExp ? false : await passConfirm(page);
        const toasts = await toastsOf(page);
        const after = await fp(page);
        const r = verdict(before, after, toasts, confirmed, didExp ? { file: dl > dl0 } : null, formish);
        r.satir = i + 1;
        /* YALAN maskelenemez: bir satırda yalan söyleyen aksiyon, başka bir satırda
           dürüstçe reddetse bile ihlaldir. Yalnız ⚫ ÖLÜ daha iyi bir sonuçla
           gölgelenebilir (o satırda ön koşul tutmamıştır). */
        if (r.v === '🔴 YALAN') { best = r; break; }
        if (!best || RANK(r) > RANK(best)) best = r;
        if (best.v === 'MUTASYON' || best.v === 'YÖNLENDİRME' || best.v === 'ÇIKTI') break;
      }
      if (!tried || !best) continue;
      denenen++;
      if (best.bad) ihlal++;
      rows.push({ t, tip: 'satır', key, ...best });
    }

    /* --- 3) form kaydet --- */
    if (/-form\.html/.test(t)) {
      await ready(page, t);
      const before = await fp(page);
      const hit = await page.evaluate(`(() => {
        const b = Array.from(document.querySelectorAll('button, a.btn'))
          .filter(e => /kaydet|güncelle|oluştur/i.test(e.textContent || ''))[0];
        if (!b) return false; b.click(); return true;
      })()`);
      if (hit) {
        denenen++;
        // form-brief: kaydet sonrası GV.refresh + listeye dönüş; yönlendirmeye zaman tanı
        await page.waitForTimeout(1500);
        const dl0 = dl;
        const didExp = await passExport(page);
        if (didExp) await page.waitForTimeout(SETTLE);
        const formish = didExp ? false : await formModalOpen(page);
      const confirmed = didExp ? false : await passConfirm(page);
        const toasts = await toastsOf(page);
        const after = await fp(page);
        const r = verdict(before, after, toasts, confirmed, didExp ? { file: dl > dl0 } : null, formish);
        if (r.bad) ihlal++;
        rows.push({ t, tip: 'kaydet', key: '(kaydet)', ...r });
      }
    }
  }

  await browser.close();

  const bad = rows.filter(r => r.bad);
  const byScreen = {};
  for (const r of bad) (byScreen[r.t] = byScreen[r.t] || []).push(r);

  if (bad.length) {
    console.log('\n=== İHLALLER ===');
    for (const f of Object.keys(byScreen).sort()) {
      console.log('\n' + f);
      for (const r of byScreen[f]) console.log(`  ${r.v}  [${r.tip}] ${r.key}${r.satir ? ' (' + r.satir + '. satır)' : ''} — ${r.why}`);
    }
  }

  const say = (v) => rows.filter(r => r.v === v).length;
  console.log('\n=== ÖZET ===');
  console.log(`Taranan ekran: ${ekran} · yüklenen kayıt: ${kayitli}`);
  console.log(`Tetiklenen aksiyon: ${denenen}`);
  console.log(`Devre dışı ("bu sürümde yok"): ${todoB} toplu · ${todoR} ekranda satır aksiyonu — dürüst, ihlal değil`);
  console.log(`  MUTASYON ${say('MUTASYON')} · YÖNLENDİRME ${say('YÖNLENDİRME')} · PANEL ${say('PANEL')} · ÇIKTI ${say('ÇIKTI')} · DÜRÜST RED ${say('DÜRÜST RED')}`);
  const formPanels = rows.filter(r => r.form);
  console.log(`  🔴 YALAN ${say('🔴 YALAN')} · ⚫ ÖLÜ ${say('⚫ ÖLÜ')}`);
  const unreach = rows.filter(r => r.unreach);
  if (unreach.length) {
    console.log(`  Ulaşılamayan aksiyon: ${unreach.length} — toplu işlem barı açılamadı ` +
                `(seçilebilir satır yok: boş sekme ya da kanban görünümü)`);
    for (const r of unreach) console.log(`      ${r.t}: ${r.key}`);
  }
  console.log(`  Girdi soran panel açan aksiyon: ${formPanels.length} — buton sağlıklı, ` +
              `ama "doldur → kaydet" adımı bu eksende ÖLÇÜLMEDİ`);
  if (formPanels.length) {
    const byS = {};
    for (const r of formPanels) (byS[r.t] = byS[r.t] || []).push(`${r.key}[${r.tip}]`);
    for (const f of Object.keys(byS).sort()) console.log(`      ${f}: ${byS[f].join(' · ')}`);
  }
  console.log(bad.length
    ? `\nİHLAL — ${bad.length} aksiyon, ${Object.keys(byScreen).length} ekran`
    : `\nTEMİZ — ${denenen} aksiyonun tamamı ölçülebilir bir sonuç üretti`);
  process.exit(bad.length ? 1 : 0);
})();
