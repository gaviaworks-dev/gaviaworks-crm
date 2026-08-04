/* mut.js — GV.refresh() regresyon testi.
 *
 * NEDEN VAR: Mock veri bellekte durur. `location.reload()` script'leri baştan koştuğu
 * için yapılan değişikliği SİLER — dokuz ekranda onay/ödeme/atama aksiyonu iz
 * bırakmıyordu (ders L-15). Bu tarayıcı, GV.refresh()'in (a) tanımlı olduğunu,
 * (b) çağrıldığında sayfayı hatasız yeniden kurduğunu, (c) sayfa başlığını
 * çoğaltmadığını ve (d) DOM'u boş bırakmadığını ölçer.
 *
 * Kullanım: node mut.js "app-x.html,app-y.html" [rol]
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
    const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    const page = await ctx.newPage();
    const errs = [];
    page.on('pageerror', e => errs.push('pageerror: ' + e.message));
    page.on('console', m => { if (m.type() === 'error') errs.push(m.text()); });

    await page.goto(BASE + f + (f.indexOf('?') === -1 ? '?' : '&') + 'role=' + role, { waitUntil: 'networkidle' });
    await page.waitForTimeout(350);

    const before = await page.evaluate(() => ({
      len: document.body.innerHTML.length,
      heads: document.querySelectorAll('.gv-page-head').length,
      apps: document.querySelectorAll('.gv-app').length,
      hasRefresh: typeof (window.GV || {}).refresh === 'function',
    }));

    const rc = await LIB.recCheck(page, f);
    if (rc.need) {
      recNeed++;
      if (rc.ok) recOk++;
      else { bad++; console.log('KAYIT YOK ' + f + ' — ' + rc.why + ' (tarama bu ekranda geçersiz)'); await ctx.close(); continue; }
    }

    if (!before.hasRefresh) {
      console.log('HATA ' + f + ' — GV.refresh tanımlı değil');
      bad++; await ctx.close(); continue;
    }

    // iki kez tetikle: idempotent mi
    await page.evaluate(() => GV.refresh());
    await page.waitForTimeout(250);
    await page.evaluate(() => GV.refresh());
    await page.waitForTimeout(350);

    const after = await page.evaluate(() => ({
      len: document.body.innerHTML.length,
      heads: document.querySelectorAll('.gv-page-head').length,
      apps: document.querySelectorAll('.gv-app').length,
      recEmpty: (() => { const r = document.getElementById('rec'); return r ? r.innerHTML.trim().length < 40 : null; })(),
    }));

    /* Tazeleme kaydı düşürmemeli — düşerse ekran refresh sonrası boş duruma iner */
    const rcAfter = await LIB.recCheck(page, f);

    const probs = [];
    if (rc.need && !rcAfter.ok) probs.push('2× refresh sonrası kayıt kayboldu (' + rcAfter.why + ')');
    if (after.heads > 1) probs.push('sayfa başlığı çoğaldı (' + after.heads + ')');
    if (after.apps > 1) probs.push('.gv-app çoğaldı (' + after.apps + ')');
    if (after.recEmpty === true) probs.push('#rec boşaldı');
    if (after.len < before.len * 0.5) probs.push('içerik yarıdan fazla küçüldü');
    if (errs.length) probs.push('konsol: ' + errs[0]);

    if (probs.length) { bad++; console.log('HATA ' + f + ' — ' + probs.join(' · ')); }
    else console.log('ok   ' + f + ' — 2× refresh temiz (başlık ' + after.heads + ', app ' + after.apps + ')');
    await ctx.close();
  }
  await browser.close();
  console.log('\nTaranan ekran: ' + files.length + ' · yüklenen kayıt: ' + recOk + '/' + recNeed);
  console.log(bad ? 'SORUN — ' + bad + ' ekran' : 'TEMİZ — ' + files.length + ' ekran, GV.refresh idempotent');
  process.exit(bad ? 1 : 0);
})();
