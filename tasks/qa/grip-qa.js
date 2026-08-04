const { chromium } = require('playwright');

const URL = 'http://127.0.0.1:8791/app-panel-ozet.html?role=sahip';
const SIZES = [[1440, 900], [1024, 800], [768, 900], [390, 844]];

function d(n) { return Math.round(n * 10) / 10; }

(async () => {
  const b = await chromium.launch();
  let fail = 0;

  for (const [w, h] of SIZES) {
    const ctx = await b.newContext({ viewport: { width: w, height: h } });
    const p = await ctx.newPage();
    const errs = [];
    p.on('console', m => { if (m.type() === 'error') errs.push(m.text()); });
    p.on('pageerror', e => errs.push(String(e)));
    await p.goto(URL, { waitUntil: 'networkidle' });
    await p.waitForTimeout(500);

    console.log('\n================ ' + w + 'x' + h + ' ================');
    if (errs.length) { console.log('KONSOL HATASI: ' + errs.join(' | ')); fail++; }

    for (const state of ['expanded', 'collapsed']) {
      if (state === 'collapsed') {
        await p.evaluate(() => document.getElementById('gvDivider').click());
        await p.waitForTimeout(450);
      }

      const m = await p.evaluate(() => {
        const btn = document.getElementById('gvDivider');
        if (!btn) return { none: true };
        const cs = getComputedStyle(btn);
        if (cs.display === 'none') return { hidden: true };
        const grip = btn.querySelector('span');
        const gs = getComputedStyle(grip);
        const br = btn.getBoundingClientRect();
        const gr = grip.getBoundingClientRect();
        const menu = document.getElementById('gvMenu');
        const rail = document.getElementById('gvRail');
        const mr = menu.getBoundingClientRect();
        const rr = rail.getBoundingClientRect();
        // adjacent surface = whichever sidebar element's right edge the grip sits on
        const menuVisible = mr.left >= 0 && mr.width > 0;
        const edge = menuVisible ? mr.right : rr.right;
        const surface = menuVisible ? getComputedStyle(menu).backgroundColor
                                    : getComputedStyle(rail).backgroundColor;
        return {
          btn: { x: br.x, y: br.y, w: br.width, h: br.height },
          grip: { x: gr.x, y: gr.y, w: gr.width, h: gr.height },
          edge, surface,
          gripBg: gs.backgroundColor, gripBorder: gs.borderTopWidth + '/' + gs.borderRightWidth,
          radius: gs.borderRadius, shadow: gs.boxShadow,
          ariaExpanded: btn.getAttribute('aria-expanded'),
          ariaLabel: btn.getAttribute('aria-label'),
          ariaControls: btn.getAttribute('aria-controls'),
          tag: btn.tagName,
          menuVisible
        };
      });

      if (m.none) { console.log(state + ': TUTAMAK YOK'); fail++; continue; }
      if (m.hidden) { console.log(state + ': gizli (beklenen ≤980px)'); continue; }

      console.log('--- ' + state + ' ---');
      console.log('  tag=' + m.tag + '  aria-expanded=' + m.ariaExpanded + '  aria-controls=' + m.ariaControls);
      console.log('  label="' + m.ariaLabel + '"');
      console.log('  yakalama bandı: ' + d(m.btn.w) + 'x' + d(m.btn.h) + ' @x=' + d(m.btn.x));
      console.log('  grip: ' + d(m.grip.w) + 'x' + d(m.grip.h) + ' @x=' + d(m.grip.x) +
                  '  radius=' + m.radius + '  border=' + m.gripBorder + '  shadow=' + m.shadow);
      console.log('  kenar=' + d(m.edge) + '  bant içeri=' + d(m.edge - m.btn.x) +
                  'px dışarı=' + d(m.btn.x + m.btn.w - m.edge) + 'px');
      console.log('  grip bg=' + m.gripBg + '  bitişik yüzey=' + m.surface +
                  (m.gripBg === m.surface ? '  ✔ AYNI' : '  ✘ FARKLI'));

      // assertions
      if (m.btn.h < 120) { console.log('  ✘ bant yüksekliği < 120px'); fail++; }
      if (m.btn.w < 16) { console.log('  ✘ bant genişliği < 16px'); fail++; }
      if (m.grip.w < 24 || m.grip.h < 44) { console.log('  ✘ tıklama alanı < 24x44'); fail++; }
      if (m.gripBg !== m.surface) { console.log('  ✘ grip rengi bitişik yüzeyden farklı'); fail++; }
      if (m.gripBorder !== '0px/0px') { console.log('  ✘ grip kenarlıklı'); fail++; }
      if (m.shadow !== 'none') { console.log('  ✘ grip gölgeli'); fail++; }
      if (m.ariaExpanded !== (m.menuVisible ? 'true' : 'false')) {
        console.log('  ✘ aria-expanded gerçek durumu yansıtmıyor (menuVisible=' + m.menuVisible + ')'); fail++;
      }

      // ---- HOVER YAKALAMA ÖLÇÜMÜ: bandın farklı noktalarından tetikle ----
      const cy = m.btn.y + m.btn.h / 2;
      const pts = [
        ['bant sol kenarı (içeri)', m.btn.x + 1, cy],
        ['kenarın 8px içi', m.edge - 8, cy],
        ['tam kenar', m.edge + 1, cy],
        ['kenarın 12px dışı', m.edge + 12, cy],
        ['bant sağ kenarı', m.btn.x + m.btn.w - 1, cy],
        ['bant üst ucu', m.edge + 4, m.btn.y + 2],
        ['bant alt ucu', m.edge + 4, m.btn.y + m.btn.h - 2],
        ['BANT DIŞI (üstünde 40px)', m.edge + 4, m.btn.y - 40]
      ];
      for (const [name, x, y] of pts) {
        await p.mouse.move(x, y);
        await p.waitForTimeout(90);
        const r = await p.evaluate(() => {
          const btn = document.getElementById('gvDivider');
          const grip = btn.querySelector('span');
          return { hov: btn.matches(':hover'), bg: getComputedStyle(grip).backgroundColor,
                   col: getComputedStyle(grip).color };
        });
        const expectHover = !name.startsWith('BANT DIŞI');
        const ok = r.hov === expectHover;
        console.log('    hover@' + name.padEnd(26) + ' :hover=' + String(r.hov).padEnd(5) +
                    ' bg=' + r.bg.padEnd(20) + (ok ? ' ✔' : ' ✘'));
        if (!ok) fail++;
      }
      // reset
      await p.mouse.move(w - 5, h - 5);

      // ---- KLAVYE ----
      const kb = await p.evaluate(() => {
        const btn = document.getElementById('gvDivider');
        btn.focus();
        const grip = btn.querySelector('span');
        return { focused: document.activeElement === btn,
                 ring: getComputedStyle(grip).boxShadow };
      });
      console.log('    klavye: focus=' + kb.focused + ' odak halkası=' + kb.ring);
      if (!kb.focused || kb.ring === 'none') { console.log('  ✘ odak durumu yok'); fail++; }
      await p.evaluate(() => document.activeElement.blur());

      // ---- İÇERİK TIKLAMASI ENGELLENMİYOR MU ----
      const blocked = await p.evaluate(() => {
        const btn = document.getElementById('gvDivider');
        const br = btn.getBoundingClientRect();
        const bad = [];
        for (let y = br.y + 4; y < br.y + br.height; y += 8) {
          for (const x of [br.x + 2, br.x + br.width - 2]) {
            const el = document.elementFromPoint(x, y);
            if (el === btn || btn.contains(el)) {
              // find what is underneath
              btn.style.pointerEvents = 'none';
              const under = document.elementFromPoint(x, y);
              btn.style.pointerEvents = '';
              if (under && under.closest('a,button,input,select,textarea,[role="button"]')) {
                bad.push({ x: Math.round(x), y: Math.round(y),
                           under: under.tagName + '.' + under.className.toString().slice(0, 30) });
              }
            }
          }
        }
        return bad;
      });
      if (blocked.length) {
        console.log('  ✘ bant ' + blocked.length + ' noktada etkileşimli içeriği örtüyor: ' +
                    JSON.stringify(blocked.slice(0, 3)));
        fail++;
      } else {
        console.log('    bant hiçbir etkileşimli öğeyi örtmüyor ✔');
      }

      await p.screenshot({ path: '/Users/gaviaworks/Developer/Projects/gaviaworks-crm/docs/screenshots/grip-' + w + '-' + state + '.png',
                           clip: { x: Math.max(0, m.btn.x - 90), y: m.btn.y - 20,
                                   width: 200, height: m.btn.h + 40 } });
    }
    await ctx.close();
  }

  await b.close();
  console.log('\n=========================');
  console.log(fail === 0 ? 'TEMİZ — tüm ölçümler geçti' : 'BAŞARISIZ — ' + fail + ' kontrol');
  process.exit(fail === 0 ? 0 : 1);
})();
