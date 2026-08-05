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

/* ---- hedefler: qa-lib'den. Bu script kendi listesini KURMAZ (ders L-24) ---- */
const url = (t) => BASE + t + (t.indexOf('?') === -1 ? '?' : '&') + 'role=' + ROLE;

/* ---- DB parmak izi: tüm dizi koleksiyonların içeriği ---- */
const FINGERPRINT = `(() => {
  if (typeof DB === 'undefined') return { db: '', url: location.href, overlay: 0 };
  const keys = Object.keys(DB).filter(k => Array.isArray(DB[k])).sort();
  let s = '';
  for (const k of keys) s += k + ':' + JSON.stringify(DB[k]) + '|';
  return { db: s, url: location.href, overlay: document.querySelectorAll('.gv-scrim').length };
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
  const ok = await page.$('.gv-scrim [data-act="1"]');
  if (!ok) return false;
  await ok.click().catch(() => {});
  await page.waitForTimeout(SETTLE);
  return true;
}

function verdict(before, after, toasts, confirmed) {
  /* Yönlendirme ÖNCE bakılır: sayfa gittiyse DB parmak izi yeni sayfanınkidir,
   * karşılaştırmak anlamsızdır. URL `page.url()`'den gelir — sayfa içi
   * `location.href` yönlendirme yarışında eski değeri döndürüyordu ve 32 form
   * kaydet düğmesi yanlışlıkla "ÖLÜ" sayılmıştı (L-17'nin dördüncü tekrarı). */
  if (before.nav !== after.nav) return { v: 'YÖNLENDİRME', bad: false };
  if (before.db !== after.db) return { v: 'MUTASYON', bad: false };
  // confirm modalı sayılmaz; ondan SONRA açık kalan overlay gerçek bir panel demektir
  if (after.overlay > before.overlay && !confirmed) return { v: 'PANEL', bad: false };
  const ok = toasts.some(t => t.tone === 'ok');
  const uyari = toasts.some(t => t.tone === 'warn' || t.tone === 'danger');
  if (ok) return { v: '🔴 YALAN', bad: true, why: 'başarı mesajı bastı, veri değişmedi' };
  if (uyari) return { v: 'DÜRÜST RED', bad: false };
  if (after.overlay > before.overlay) return { v: 'PANEL', bad: false };
  return { v: '⚫ ÖLÜ', bad: true, why: 'hiçbir geri bildirim yok, veri değişmedi' };
}

(async () => {
  const browser = await chromium.launch();
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  const list = LIB.fullTargets(process.argv[2]);
  console.log(`hedef: ${list.length} ekran`);

  const rows = [];
  let ihlal = 0, denenen = 0, ekran = 0, kayitli = 0;

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

    for (const key of bulks) {
      await ready(page, t);
      await page.evaluate(`(() => { const sa = document.querySelector('[data-selectall]'); if (sa) sa.click(); })()`);
      await page.waitForTimeout(120);
      const before = await fp(page);
      const btn = await page.$(`[data-bulk="${key}"]`);
      if (!btn) continue;
      denenen++;
      await btn.click().catch(() => {});
      await page.waitForTimeout(SETTLE);
      const confirmed = await passConfirm(page);
      const toasts = await toastsOf(page);
      const after = await fp(page);
      const r = verdict(before, after, toasts, confirmed);
      if (r.bad) ihlal++;
      rows.push({ t, tip: 'toplu', key, ...r });
    }

    /* --- 2) satır aksiyonları (yalnız ilk satır) --- */
    await ready(page, t);
    const racts = await page.evaluate(
      `Array.from(document.querySelectorAll('tr [data-rowact]')).slice(0, 12).map(b => b.dataset.rowact)`);
    const uniqR = [...new Set(racts)];
    for (const key of uniqR) {
      await ready(page, t);
      const before = await fp(page);
      const btn = await page.$(`tr [data-rowact="${key}"]`);
      if (!btn) continue;
      denenen++;
      await btn.click().catch(() => {});
      await page.waitForTimeout(SETTLE);
      const confirmed = await passConfirm(page);
      const toasts = await toastsOf(page);
      const after = await fp(page);
      const r = verdict(before, after, toasts, confirmed);
      if (r.bad) ihlal++;
      rows.push({ t, tip: 'satır', key, ...r });
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
        const confirmed = await passConfirm(page);
        const toasts = await toastsOf(page);
        const after = await fp(page);
        const r = verdict(before, after, toasts, confirmed);
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
      for (const r of byScreen[f]) console.log(`  ${r.v}  [${r.tip}] ${r.key} — ${r.why}`);
    }
  }

  const say = (v) => rows.filter(r => r.v === v).length;
  console.log('\n=== ÖZET ===');
  console.log(`Taranan ekran: ${ekran} · yüklenen kayıt: ${kayitli}`);
  console.log(`Tetiklenen aksiyon: ${denenen}`);
  console.log(`  MUTASYON ${say('MUTASYON')} · YÖNLENDİRME ${say('YÖNLENDİRME')} · PANEL ${say('PANEL')} · DÜRÜST RED ${say('DÜRÜST RED')}`);
  console.log(`  🔴 YALAN ${say('🔴 YALAN')} · ⚫ ÖLÜ ${say('⚫ ÖLÜ')}`);
  console.log(bad.length
    ? `\nİHLAL — ${bad.length} aksiyon, ${Object.keys(byScreen).length} ekran`
    : `\nTEMİZ — ${denenen} aksiyonun tamamı ölçülebilir bir sonuç üretti`);
  process.exit(bad.length ? 1 : 0);
})();
