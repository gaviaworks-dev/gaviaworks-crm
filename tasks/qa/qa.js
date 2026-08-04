const { chromium } = require('playwright');
const B = 'http://localhost:8791/';
const S = '/Users/gaviaworks/Developer/Projects/gaviaworks-crm/docs/screenshots/';

// argv: pages comma separated "file|tag"
const pages = (process.argv[2] || 'index.html|login,app-lead.html|lead').split(',').map(s => {
  const [f, t] = s.split('|');
  return [f, t || f.replace(/\W/g, '')];
});
const widths = [[1440, 'd'], [768, 't'], [390, 'm']];

(async () => {
  const br = await chromium.launch();
  const errors = [];
  for (const [w, tag] of widths) {
    const c = await br.newContext({ viewport: { width: w, height: w === 390 ? 844 : 950 } });
    const p = await c.newPage();
    p.on('console', m => { if (m.type() === 'error') errors.push(`[${tag}] console: ${m.text().slice(0, 200)}`); });
    p.on('pageerror', e => errors.push(`[${tag}] pageerror: ${String(e).slice(0, 200)}`));
    p.on('requestfailed', r => errors.push(`[${tag}] 404/fail: ${r.url().replace(B, '')}`));

    for (const [file, name] of pages) {
      try {
        await p.goto(B + file, { waitUntil: 'networkidle', timeout: 30000 });
        // seed session for app pages
        if (file !== 'index.html') {
          await p.evaluate(() => {
            if (!sessionStorage.getItem('gv.session'))
              sessionStorage.setItem('gv.session', JSON.stringify({ emp: 'EMP-001', ad: 'Kerem Aydın', ini: 'KA', dep: 'DEP-01', depAd: 'Yönetim', rol: 'sahip', rolAd: 'Şirket Sahibi', eposta: 'kerem@gaviaworks.com' }));
          });
          await p.goto(B + file, { waitUntil: 'networkidle', timeout: 30000 });
        }
        await p.waitForTimeout(1000);
        await p.screenshot({ path: S + name + '-' + tag + '.png', fullPage: false });
        // horizontal overflow check
        const of = await p.evaluate(() => ({ sw: document.documentElement.scrollWidth, iw: window.innerWidth }));
        if (of.sw > of.iw + 2) errors.push(`[${tag}] ${file} YATAY TAŞMA: ${of.sw} > ${of.iw}`);
      } catch (e) {
        errors.push(`[${tag}] ${file} THROW: ${String(e).slice(0, 160)}`);
      }
    }
    await c.close();
  }
  await br.close();
  console.log(errors.length ? 'SORUNLAR:\n' + [...new Set(errors)].join('\n') : 'TEMİZ — hata yok, taşma yok');
})();
