/* Tüm ekranlar × roller — konsol hatası, 403 sayımı, boş sayfa tespiti.
   Kullanım: node gate.js [rol1,rol2,...]   (varsayılan 5 temsili rol) */
const { chromium } = require('playwright');
const fs = require('fs');
const ROOT = '/Users/gaviaworks/Developer/Projects/gaviaworks-crm';
const B = 'http://127.0.0.1:8791/';
const ROLES = (process.argv[2] || 'sahip,pm,destek,muhasebe,stajyer').split(',');
const screens = fs.readdirSync(ROOT).filter(f => /^app-.*\.html$/.test(f)).sort();

(async () => {
  const br = await chromium.launch();
  const problems = [];
  const grid = {};
  for (const role of ROLES) {
    const ctx = await br.newContext({ viewport: { width: 1440, height: 950 } });
    const p = await ctx.newPage();
    let cur = '';
    p.on('console', m => { if (m.type() === 'error') problems.push(`[${role}] ${cur} console: ${m.text().slice(0, 140)}`); });
    p.on('pageerror', e => problems.push(`[${role}] ${cur} pageerror: ${String(e).slice(0, 140)}`));
    p.on('requestfailed', r => {
      const u = r.url().replace(B, '');
      if (!/favicon/.test(u)) problems.push(`[${role}] ${cur} istek başarısız: ${u}`);
    });

    let ok = 0, denied = 0, empty = 0;
    for (const f of screens) {
      cur = f;
      try {
        await p.goto(B + f + (f.indexOf('?') === -1 ? '?' : '&') + 'role=' + role, { waitUntil: 'networkidle', timeout: 25000 });
        await p.waitForTimeout(220);
        const r = await p.evaluate(() => {
          const page = document.querySelector('.gv-page');
          const is403 = !!document.querySelector('.gv-state.is-danger');
          const text = page ? page.innerText.trim().length : 0;
          return { is403, text, hasHead: !!document.querySelector('.gv-page-head, .gv-rec-head') };
        });
        if (r.is403) denied++;
        else if (r.text < 80 || !r.hasHead) { empty++; problems.push(`[${role}] ${f} BOŞ sayfa (metin ${r.text}, başlık ${r.hasHead})`); }
        else ok++;
      } catch (e) {
        problems.push(`[${role}] ${f} yüklenemedi: ${String(e).slice(0, 100)}`);
      }
    }
    grid[role] = { ok, denied, empty };
    console.log(`${role.padEnd(10)} açık:${String(ok).padStart(3)}  403:${String(denied).padStart(3)}  boş:${String(empty).padStart(3)}`);
    await ctx.close();
  }
  await br.close();

  console.log('\nToplam sayfa yüklemesi: ' + (screens.length * ROLES.length) +
              ' (' + screens.length + ' ekran × ' + ROLES.length + ' rol)');
  if (problems.length) {
    console.log('\nSORUN — ' + problems.length + ' kalem:');
    [...new Set(problems)].slice(0, 60).forEach(x => console.log('  ✘ ' + x));
  } else {
    console.log('\nTEMİZ — konsol hatası yok, boş sayfa yok, kırık istek yok');
  }
  process.exit(problems.length ? 1 : 0);
})();
