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
const BASE = 'http://127.0.0.1:8791/';

(async () => {
  const files = (process.argv[2] || '').split(',').map(s => s.trim()).filter(Boolean);
  const role = process.argv[3] || 'sahip';
  const browser = await chromium.launch();
  let bad = 0;

  for (const f of files) {
    const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    const page = await ctx.newPage();
    const errs = [];
    page.on('pageerror', e => errs.push('pageerror: ' + e.message));
    page.on('console', m => { if (m.type() === 'error') errs.push(m.text()); });

    await page.goto(BASE + f + '?role=' + role, { waitUntil: 'networkidle' });
    await page.waitForTimeout(350);

    const before = await page.evaluate(() => ({
      len: document.body.innerHTML.length,
      heads: document.querySelectorAll('.gv-page-head').length,
      apps: document.querySelectorAll('.gv-app').length,
      hasRefresh: typeof (window.GV || {}).refresh === 'function',
    }));

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

    const probs = [];
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
  console.log(bad ? '\nSORUN — ' + bad + ' ekran' : '\nTEMİZ — ' + files.length + ' ekran, GV.refresh idempotent');
  process.exit(bad ? 1 : 0);
})();
