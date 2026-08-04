/* esc.js — "ham HTML etiket" taraması.
 *
 * NEDEN VAR: Detay ekranları kendi `dl(pairs)` yardımcısını yazıyor ve her biri
 * `dt` metnini escape edip etmemeye ayrı karar veriyor. `app-teklif-detay.html`
 * escape ediyordu; para ekseni işareti (<span class="u-faint">(KDV hariç)</span>)
 * ekranda **ham metin** olarak görünüyordu. Konsol hatası yok, taşma yok —
 * `qa.js` bu sınıfı göremez, çünkü sayfa teknik olarak sağlam.
 *
 * NE YAPAR: Etiket taşıyan düğümlerin textContent'inde HTML etiketi arar.
 * Bulursa o ekran hatalıdır: ya escape edilmemesi gereken bir yer escape edilmiş,
 * ya da veri içindeki metin yanlışlıkla markup olarak yazılmış.
 *
 * Kullanım: node esc.js ["a.html,b.html"] [rol]        (dosya verilmezse tüm app-*.html)
 */
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');
const LIB = require('./qa-lib');

const BASE = 'http://127.0.0.1:8791/';
const ROOT = '/Users/gaviaworks/Developer/Projects/gaviaworks-crm';
const SEL = 'dt,dd,th,td,.gv-summary-lbl,.gv-summary-val,.kpi-lbl,.kpi-num,.kpi-meta,' +
            'h1,h2,h3,.ph-eyebrow,.ph-sub,.gv-badge,.cell-main,.cell-sub,label,legend,option';
const TAG = /<(span|div|b|i|em|strong|br|a|small|p|ul|li|svg|button)\b/i;

(async () => {
  const arg = process.argv[2];
  const role = process.argv[3] || 'sahip';
  /* Hedef verilmezse: tüm app-*.html — ama detay/form ekranları rec.js'in
     doğruladığı `?id=KOD` hedefiyle değiştirilir, yoksa boş durum ölçülür (L-17). */
  const withId = {};
  LIB.loadTargets().forEach(t => { withId[t.file] = t.target; });
  const files = arg
    ? arg.split(',').map(s => s.trim()).filter(Boolean)
    : fs.readdirSync(ROOT).filter(f => /^app-.*\.html$/.test(f)).sort().map(f => withId[f] || f);

  const browser = await chromium.launch();
  let bad = 0, recOk = 0, recNeed = 0;
  for (const f of files) {
    const page = await browser.newPage();
    try {
      await page.goto(BASE + f + (f.indexOf('?') === -1 ? '?' : '&') + 'role=' + role, { waitUntil: 'networkidle' });
      await page.waitForTimeout(300);
      const rc = await LIB.recCheck(page, f);
      if (rc.need) { recNeed++; if (rc.ok) recOk++; }

      // sekmeli ekranlarda her paneli de tara
      const tabs = await page.$$('[role="tab"]');
      const hits = new Set();
      const scan = async () => {
        const r = await page.evaluate(s => Array.from(document.querySelectorAll(s))
          .map(n => n.textContent).filter(Boolean), SEL);
        r.forEach(t => { if (TAG.test(t)) hits.add(t.trim().slice(0, 90)); });
      };
      await scan();
      for (const t of tabs) {
        try { await t.click({ timeout: 1500 }); await page.waitForTimeout(90); await scan(); } catch (e) {}
      }
      if (rc.need && !rc.ok) {
        bad++;
        console.log('KAYIT YOK ' + f + ' — ' + rc.why + ' (tarama bu ekranda geçersiz)');
      } else if (hits.size) {
        bad++;
        console.log('HAM HTML  ' + f + '  (' + hits.size + ')');
        Array.from(hits).slice(0, 4).forEach(h => console.log('    ' + h));
      } else console.log('ok        ' + f + (rc.need ? '  · kayıt ' + rc.why : ''));
    } catch (e) {
      console.log('AÇILMADI  ' + f + ' — ' + e.message.split('\n')[0]);
      bad++;
    }
    await page.close();
  }
  await browser.close();
  console.log('\nTaranan ekran: ' + files.length + ' · yüklenen kayıt: ' + recOk + '/' + recNeed);
  console.log(bad ? 'SORUN — ' + bad + ' ekran' : 'TEMİZ — ' + files.length + ' ekran, ham HTML etiket yok');
  process.exit(bad ? 1 : 0);
})();
