/* Anahtar (switch) ve radyo doğrulama regresyonu — ui.css / ui.js düzeltmesinin ölçümü. */
const { chromium } = require('playwright');
const BASE = 'http://127.0.0.1:8791/';
(async () => {
  const br = await chromium.launch();
  const p = await br.newPage();
  await p.goto(BASE + 'app-proje-hata-form.html?role=sahip', { waitUntil: 'networkidle' });
  await p.waitForTimeout(400);
  const r = await p.evaluate(() => {
    const sw = document.querySelector('.f-switch .sw');
    const lbl = document.querySelector('label.f-switch');
    return {
      swVar: !!sw,
      swW: sw ? Math.round(sw.getBoundingClientRect().width) : -1,
      swH: sw ? Math.round(sw.getBoundingClientRect().height) : -1,
      lblDisplay: lbl ? getComputedStyle(lbl).display : '-',
    };
  });
  console.log('switch → görünür:', r.swVar, '| genişlik:', r.swW, 'px · yükseklik:', r.swH,
              'px · label display:', r.lblDisplay);
  const ok = r.swW > 20 && r.swH > 8 && r.lblDisplay === 'inline-flex';
  console.log(ok ? 'TEMİZ — anahtar görünür boyutta' : 'SORUN — anahtar hâlâ sıfır genişlikte');
  await br.close();
  process.exit(ok ? 0 : 1);
})();
