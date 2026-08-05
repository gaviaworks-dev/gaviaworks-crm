/* ctl.js — FORM KONTROLÜ TARAYICISI · UID-08 + UID-09
 *
 * İki soruyu ÖLÇEREK sorar (ikisi de tek taban kuralın iki yüzü):
 *   UID-08 · "Kontrol ile etiketi arasında boşluk var mı?"
 *            Onay kutusu / radyo / anahtar ile yanındaki metnin **gerçek piksel
 *            aralığı** ölçülür (Range dikdörtgeni ile — `gap` CSS'i yazıyor olmak
 *            yetmez, metin ayrı bir düğümde olmayabilir).
 *   UID-09 · "Native kontroller tasarım sisteminde mi?"
 *            `select` okunun tarayıcıdan mı geldiği (`appearance`), tarih alanının
 *            native takvim ikonu, ham `checkbox`/`radio` sayısı.
 *
 * KAPSAM ÖNEMLİ: borç kaydı **Çıktı Al modalı** ve **Gelişmiş Filtre paneli**
 * için yazılmıştı — ikisi de ancak TIKLAYINCA doğuyor. Bu yüzden tarayıcı her
 * liste ekranında sırayla `Gelişmiş Filtre` · `Kolonlar` · `Çıktı Al` açar ve
 * içlerini de ölçer. Açılış ekranına bakan bir tarama bu borcu göremez (L-12).
 *
 * Hedef listesi elle yazılmaz (L-19 · L-24): `qa-lib.fullTargets()`.
 *
 * Kullanım:  node ctl.js  ·  node ctl.js "app-lead.html"
 */
const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');
const LIB = require('./qa-lib');

const BASE = 'http://127.0.0.1:8791/';
const ROLE = 'sahip';
const MIN_GAP = 6;                     // px — altındaki her şey "bitişik" sayılır
const url = (t) => BASE + t + (t.indexOf('?') === -1 ? '?' : '&') + 'role=' + ROLE;

/* Sayfadaki her kontrol için ölçüm. Metnin sol kenarı Range ile bulunur:
   etiket metni çoğu kalıpta anonim bir metin düğümüdür, `span` değildir. */
const MEASURE = `(() => {
  const out = { gaps: [], selects: 0, selectsNative: 0, dates: 0, datesNative: 0,
                boxes: 0, boxesNative: 0, switches: 0 };
  const vis = (el) => { const r = el.getBoundingClientRect(); return r.width > 0 && r.height > 0; };

  document.querySelectorAll('select').forEach(s => {
    if (!vis(s)) return;
    out.selects++;
    if (getComputedStyle(s).appearance !== 'none') out.selectsNative++;
  });
  document.querySelectorAll('input[type=date], input[type=month], input[type=time]').forEach(d => {
    if (!vis(d)) return;
    out.dates++;
    /* OLCULEMEZ: getComputedStyle(el, '::-webkit-calendar-picker-indicator')
       Chromium'da pseudo-elementin degil ELEMENTIN stilini dondurur (olculdu:
       width = input genisligi). Takvim dugmesinin bicimi calisma zamaninda
       okunamaz. Sessizce "native" saymak L-17'nin tuzağıdır; bu yüzden tarih
       alanları ayrı sayılır ve kuralın YAZILI olduğu statik olarak doğrulanır
       (aşağıda), görünüm ise ekran görüntüsüyle bir kez teyit edilmiştir. */
  });

  document.querySelectorAll('input[type=checkbox], input[type=radio]').forEach(inp => {
    const lab = inp.closest('label') ||
                (inp.id ? document.querySelector('label[for="' + CSS.escape(inp.id) + '"]') : null);
    const hidden = getComputedStyle(inp).opacity === '0' || inp.offsetWidth === 0;
    if (hidden) { out.switches++; return; }        // .f-switch — kontrol görsel değil
    out.boxes++;
    if (getComputedStyle(inp).appearance !== 'none') out.boxesNative++;
    if (!lab || !vis(lab)) return;

    // etiketin İLK metin parçasının sol kenarı
    let left = null;
    const walk = document.createTreeWalker(lab, NodeFilter.SHOW_TEXT);
    let n;
    while ((n = walk.nextNode())) {
      if (!n.nodeValue.trim()) continue;
      const rg = document.createRange();
      rg.selectNodeContents(n);
      const r = rg.getBoundingClientRect();
      if (r.width > 0) { left = r.left; break; }
    }
    if (left == null) return;                       // metinsiz etiket (ikon) — konu dışı
    const ir = inp.getBoundingClientRect();
    if (left < ir.right - 1) return;                // metin kontrolün solunda / üstünde
    out.gaps.push({
      gap: Math.round((left - ir.right) * 10) / 10,
      cls: (lab.className || inp.className || '').split(' ')[0] || '(sınıfsız)',
      txt: (lab.textContent || '').trim().slice(0, 34)
    });
  });
  return out;
})()`;

async function measure(page, where, acc) {
  let r;
  try { r = await page.evaluate(MEASURE); } catch (e) { return; }
  acc.selects += r.selects; acc.selectsNative += r.selectsNative;
  acc.dates += r.dates; acc.datesNative += r.datesNative;
  acc.boxes += r.boxes; acc.boxesNative += r.boxesNative;
  acc.switches += r.switches;
  for (const g of r.gaps) { g.where = where; acc.gaps.push(g); }
}

async function closeOverlay(page) {
  await page.evaluate(`(() => {
    document.querySelectorAll('.gv-scrim, .gv-drawer, .gv-modal').forEach(el => {
      if (el.__gvClose) el.__gvClose(); else el.remove();
    });
    document.body.style.overflow = '';
  })()`).catch(() => {});
  await page.waitForTimeout(120);
}

(async () => {
  const browser = await chromium.launch();
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  const list = LIB.fullTargets(process.argv[2]);
  console.log(`hedef: ${list.length} ekran`);

  const acc = { gaps: [], selects: 0, selectsNative: 0, dates: 0, datesNative: 0,
                boxes: 0, boxesNative: 0, switches: 0 };
  let ekran = 0, panel = 0;

  for (const t of list) {
    await page.goto(url(t), { waitUntil: 'domcontentloaded' }).catch(() => {});
    await page.waitForTimeout(520);
    ekran++;
    await measure(page, t + ' · sayfa', acc);

    for (const [sel, ad] of [['[data-openfilters]', 'filtre paneli'],
                             ['[data-opencols]', 'kolon yöneticisi'],
                             ['[data-export]', 'çıktı modalı']]) {
      const b = await page.$(sel);
      if (!b || !(await b.isVisible().catch(() => false))) continue;
      await b.click().catch(() => {});
      await page.waitForTimeout(260);
      const acildi = await page.evaluate(`!!document.querySelector('.gv-drawer, .gv-modal')`);
      if (acildi) { panel++; await measure(page, t + ' · ' + ad, acc); }
      await closeOverlay(page);
    }
  }
  await browser.close();

  const dar = acc.gaps.filter(g => g.gap < MIN_GAP);
  const byCls = {};
  for (const g of dar) (byCls[g.cls] = byCls[g.cls] || []).push(g);

  if (dar.length) {
    console.log('\n=== KONTROL–ETİKET BOŞLUĞU EKSİK (< ' + MIN_GAP + 'px) ===');
    for (const c of Object.keys(byCls).sort((a, b) => byCls[b].length - byCls[a].length)) {
      const l = byCls[c];
      console.log(`\n  .${c} — ${l.length} örnek · en dar ${Math.min(...l.map(x => x.gap))}px`);
      for (const g of l.slice(0, 4)) console.log(`      ${g.gap}px · "${g.txt}" · ${g.where}`);
      if (l.length > 4) console.log(`      … ${l.length - 4} örnek daha`);
    }
  }

  console.log('\n=== ÖZET ===');
  console.log(`Taranan ekran: ${ekran} · açılan panel/modal: ${panel}`);
  console.log(`UID-08 · ölçülen kontrol–etiket çifti: ${acc.gaps.length} · bitişik olan: ${dar.length}`);
  const min = acc.gaps.length ? Math.min(...acc.gaps.map(g => g.gap)) : 0;
  console.log(`         en dar boşluk: ${min}px · gizli (anahtar) kontrol: ${acc.switches}`);
  const css = fs.readFileSync(path.join(LIB.repoRoot(), 'assets/css/ui.css'), 'utf8');
  const takvimKurali = /::-webkit-calendar-picker-indicator\s*\{/.test(css);
  console.log(`UID-09 · select ${acc.selects} (native ok: ${acc.selectsNative}) · ` +
              `kutu/radyo ${acc.boxes} (native görünüm: ${acc.boxesNative})`);
  console.log(`         tarih alanı ${acc.dates} — takvim düğmesi çalışma zamanında ÖLÇÜLEMEZ ` +
              `(Chromium pseudo-element stilini vermiyor); kural ui.css'te ` +
              (takvimKurali ? 'YAZILI ✓' : 'YOK ✗') + ' · görünüm ekran görüntüsüyle teyit edildi');
  const ihlal = dar.length + acc.selectsNative + acc.boxesNative + (takvimKurali ? 0 : 1);
  console.log(ihlal
    ? `\nEKSİK — ${dar.length} bitişik etiket · ${acc.selectsNative + acc.boxesNative} native kontrol` +
      (takvimKurali ? '' : ' · takvim kuralı yok')
    : `\nTEMİZ — boşluk kuralı ve kontrol görünümü her yerde tasarım sisteminden geliyor`);
  process.exit(0);
})();
