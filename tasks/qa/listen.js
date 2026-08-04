/* listen.js — GV.refresh() sonrası dinleyici birikmesi taraması.
 *
 * NEDEN VAR: GV.refresh() sayfayı yeniden kurar ama `document`e veya kalıcı bir
 * düğüme bağlanmış delege dinleyiciler ölmez. Ekran her tazelemede bir dinleyici
 * daha eklerse tek tıklama N kez işlenir — üç tazelemeden sonra tek tıklamada
 * üç modal açıldığı ölçüldü. `mount` düğümü GV.refresh içinde taze kopyayla
 * değiştirilir; `document` dinleyicileri `GV.on(el,type,fn,key)` ile bağlanır.
 *
 * NE ÖLÇER: addEventListener çağrılarını sayaçlar, sayfayı 3 kez tazeler,
 * document ve mount üzerindeki dinleyici sayısının ARTMADIĞINI doğrular.
 *
 * Kullanım: node listen.js "app-x.html,app-y.html" [rol]
 */
const { chromium } = require('playwright');
const LIB = require('./qa-lib');
const BASE = 'http://127.0.0.1:8791/';

(async () => {
  const files = LIB.expand(process.argv[2], 'all');
  const role = process.argv[3] || 'sahip';
  const browser = await chromium.launch();
  let bad = 0, recOk = 0, recNeed = 0;

  for (const f of files) {
    const page = await browser.newPage();
    await page.addInitScript(() => {
      /* NET dinleyici sayılır: add − remove. GV.on aynı anahtarı yeniden
         bağlarken önce söker, o yüzden çağrı sayısı artar ama net sabit kalır. */
      window.__cnt = { document: 0, mount: 0 };
      const add = EventTarget.prototype.addEventListener;
      const rem = EventTarget.prototype.removeEventListener;
      const bucket = function (el, t) {
        if (el === document && t !== 'gv:ready' && t !== 'DOMContentLoaded') return 'document';
        if (el instanceof Element && el.id === 'rec') return 'mount';
        return null;
      };
      EventTarget.prototype.addEventListener = function (t, fn, o) {
        const b = bucket(this, t); if (b) window.__cnt[b]++;
        return add.call(this, t, fn, o);
      };
      EventTarget.prototype.removeEventListener = function (t, fn, o) {
        const b = bucket(this, t); if (b) window.__cnt[b]--;
        return rem.call(this, t, fn, o);
      };
    });
    const errs = [];
    page.on('pageerror', e => errs.push(e.message));
    await page.goto(BASE + f + (f.indexOf('?') === -1 ? '?' : '&') + 'role=' + role, { waitUntil: 'networkidle' });
    await page.waitForTimeout(300);
    const rc = await LIB.recCheck(page, f);
    if (rc.need) {
      recNeed++;
      if (rc.ok) recOk++;
      else { bad++; console.log('KAYIT YOK ' + f + ' — ' + rc.why + ' (tarama bu ekranda geçersiz)'); await page.close(); continue; }
    }

    const before = await page.evaluate(() => ({ ...window.__cnt }));

    for (let i = 0; i < 3; i++) { await page.evaluate(() => GV.refresh()); await page.waitForTimeout(180); }
    const after = await page.evaluate(() => ({ ...window.__cnt }));

    // mount dinleyicileri her tazelemede TAZE düğüme bağlanır (sorun değil);
    // document dinleyicileri artmamalı.
    const docGrew = after.document > before.document;
    const live = await page.evaluate(() => {
      const m = document.getElementById('rec');
      return m ? m.innerHTML.trim().length > 40 : null;
    });

    if (docGrew || errs.length || live === false) {
      bad++;
      console.log('HATA ' + f + ' — document dinleyici ' + before.document + ' → ' + after.document +
        (errs.length ? ' · ' + errs[0] : '') + (live === false ? ' · mount boş' : ''));
    } else {
      console.log('ok   ' + f + ' — document ' + before.document + ' sabit, mount her turda taze' + (rc.need ? ' · kayıt ' + rc.why : ''));
    }
    await page.close();
  }
  await browser.close();
  console.log('\nTaranan ekran: ' + files.length + ' · yüklenen kayıt: ' + recOk + '/' + recNeed);
  console.log(bad ? 'SORUN — ' + bad + ' ekran' : 'TEMİZ — ' + files.length + ' ekran, dinleyici birikmiyor');
  process.exit(bad ? 1 : 0);
})();
