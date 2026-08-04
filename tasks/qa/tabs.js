/* tabs.js — detay ekranlarının HER sekmesini tek tek tıklar, konsol hatası arar.
   Kullanım: node tabs.js "app-x.html,app-y.html" [rol1,rol2]
   Açılış QA'si sekme içi hatayı göremez (lessons L-12 sınıfı). */
const { chromium } = require('playwright');
const BASE = 'http://127.0.0.1:8791/';

(async () => {
  const files = (process.argv[2] || '').split(',').map(s => s.trim()).filter(Boolean);
  const roles = (process.argv[3] || 'sahip,stajyer').split(',').map(s => s.trim()).filter(Boolean);
  const browser = await chromium.launch();
  let bad = 0, tabsTotal = 0;

  for (const f of files) {
    for (const role of roles) {
      const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
      const page = await ctx.newPage();
      const errs = [];
      page.on('console', m => { if (m.type() === 'error') errs.push(m.text()); });
      page.on('pageerror', e => errs.push('pageerror: ' + e.message));
      page.on('requestfailed', r => errs.push('req: ' + r.url()));
      await page.goto(BASE + f + (f.indexOf('?') === -1 ? '?' : '&') + 'role=' + role, { waitUntil: 'networkidle' });
      await page.waitForTimeout(300);

      const denied = await page.evaluate(() => !!document.querySelector('.gv-403, [data-403]') ||
        /403|yetkiniz yok|erişim/i.test((document.querySelector('.gv-page') || {}).textContent || ''));

      const tabs = await page.$$('[role="tab"], .gv-tabs button, .gv-tabs a');
      for (let i = 0; i < tabs.length; i++) {
        try { await tabs[i].click({ timeout: 2000 }); } catch (e) { errs.push('click#' + i + ': ' + e.message); }
        await page.waitForTimeout(120);
        tabsTotal++;
      }
      // aktif panelde görünür içerik var mı
      const emptyPanel = await page.evaluate(() => {
        const p = document.querySelector('[role="tabpanel"]:not([hidden]), .gv-tabpanel:not([hidden])');
        return p ? p.textContent.trim().length < 5 : null;
      });
      if (emptyPanel) errs.push('aktif sekme paneli boş');

      const tag = f + ' [' + role + ']';
      if (errs.length) { bad++; console.log('HATA ' + tag + ' (' + tabs.length + ' sekme)'); errs.slice(0, 6).forEach(e => console.log('   ' + e)); }
      else console.log('ok   ' + tag + ' — ' + tabs.length + ' sekme' + (denied ? ' (403)' : ''));
      await ctx.close();
    }
  }
  await browser.close();
  console.log(bad ? '\nHATALI: ' + bad : '\nTEMİZ — ' + tabsTotal + ' sekme tıklaması, hata yok');
  process.exit(bad ? 1 : 0);
})();
