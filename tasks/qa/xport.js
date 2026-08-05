/* xport.js — ÇIKTI (dışa aktarma) TARAYICISI · UID-07
 *
 * Sorduğu tek soru: **"Bu ekranın çıktısı ekrandaki bilgiyi taşıyor mu?"**
 *
 * Neden var: UID-07 kapatılmadan önce cevaplanması gereken yarım ölçüm.
 * `ui.js` → `doExport(rows, fmt)` zaten generic: `visibleCols()` + her hücre için
 * `c.exportValue ? c.exportValue(r) : r[c.key]` + HTML soyma. Ama tabloda görünen
 * değerin çoğu `c.render(r,i)` ile TÜRETİLİYOR; `render` var, `exportValue` yok ve
 * `r[c.key]` kayıtta hiç yoksa **hücre çıktıda boş çıkar**. Statik analiz bunu
 * göremez (render gövdesi çalışma zamanında çözülür), bu yüzden ölçüm burada
 * ÇALIŞMA ZAMANINDA yapılır.
 *
 * YÖNTEM:
 *   1. `assets/js/ui.js` route üzerinden yamalanır — `GV.list` dönüşüne salt-okunur
 *      `__probe()` eklenir ve örnek `window.__gvLists`'e kaydedilir. **Repo dosyası
 *      DEĞİŞMEZ**; yama yalnız tarayıcı belleğindedir.
 *   2. Her ekranda her `GV.list` örneği için `visibleCols()` ve `source()` alınır.
 *   3. Her kolon × her kayıt için iki değer hesaplanır:
 *        EKRAN   = c.render ? strip(c.render(r,i)) : r[c.key]
 *        ÇIKTI   = c.exportValue ? c.exportValue(r) : r[c.key]   (doExport ile birebir)
 *   4. Karşılaştırma:
 *        🔴 YALAN KOLON → ekranda dolu, çıktıda boş (tüm kayıtlarda)
 *        ⚠ KISMİ       → ekranda dolu, çıktıda boş (kayıtların bir kısmında)
 *        · BOŞ VERİ     → ikisi de boş (veri yok, kolon suçsuz)
 *        ✓ TAŞIYOR      → çıktı dolu
 *
 * NOT: `exportable:false` kolonu bilinçli olarak çıktı dışıdır, ihlal sayılmaz.
 *
 * Hedef listesi elle yazılmaz (L-19 · L-24): `qa-lib.fullTargets()`.
 *
 * Kullanım:  node xport.js  ·  node xport.js "app-lead.html"
 */
const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');
const LIB = require('./qa-lib');

const BASE = 'http://127.0.0.1:8791/';
const ROLE = 'sahip';
const url = (t) => BASE + t + (t.indexOf('?') === -1 ? '?' : '&') + 'role=' + ROLE;

/* ---- ui.js yaması: GV.list dönüşüne __probe ekle (yalnız bellekte) ---- */
const UI_SRC = fs.readFileSync(path.join(LIB.repoRoot(), 'assets/js/ui.js'), 'utf8');
const ANCHOR = `    return {
      state:state,
      refresh:render,`;
if (UI_SRC.indexOf(ANCHOR) === -1) throw new Error('xport: ui.js içinde GV.list dönüş bloğu bulunamadı — yama kurulamıyor');
const PATCHED = UI_SRC.replace(ANCHOR, `    var __gvApi = {
      __probe:function(){
        var cols = visibleCols();
        var rows = source();
        return {
          id: cfg.id || cfg.mount || '?',
          rows: rows.length,
          cols: cols.map(function(c){
            var out = { key:c.key, label:c.label, exportable:c.exportable !== false,
                        hasRender:!!c.render, hasExportValue:!!c.exportValue,
                        n:0, ekranDolu:0, ciktiDolu:0, yalan:0, ornek:'' };
            rows.forEach(function(r,i){
              var scr = '', exp = '';
              try { scr = c.render ? String(c.render(r,i)) : (r[c.key] == null ? '' : String(r[c.key])); } catch(e){ scr = ''; }
              try { exp = c.exportValue ? c.exportValue(r) : r[c.key]; } catch(e){ exp = null; }
              scr = scr.replace(/<[^>]*>/g,'').replace(/&nbsp;/g,' ').trim();
              exp = exp == null ? '' : String(exp).replace(/<[^>]*>/g,'').trim();
              if(scr === '—') scr = '';
              if(exp === '—') exp = '';
              out.n++;
              if(scr) out.ekranDolu++;
              if(exp) out.ciktiDolu++;
              if(scr && !exp){ out.yalan++; if(!out.ornek) out.ornek = scr.slice(0,40); }
            });
            return out;
          })
        };
      },
      state:state,
      refresh:render,`)
  .replace(`      setFilter:function(k, v){ state.filters[k] = v; reset(); render(); }
    };`, `      setFilter:function(k, v){ state.filters[k] = v; reset(); render(); }
    };
    (window.__gvLists = window.__gvLists || []).push(__gvApi);
    return __gvApi;`);

(async () => {
  const browser = await chromium.launch();
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  await ctx.route('**/assets/js/ui.js', (route) =>
    route.fulfill({ status: 200, contentType: 'application/javascript; charset=utf-8', body: PATCHED }));
  const page = await ctx.newPage();

  const list = LIB.fullTargets(process.argv[2]);
  console.log(`hedef: ${list.length} ekran`);

  const screens = [];
  let listli = 0, kolonTop = 0, hucreTop = 0, hucreYalan = 0;

  for (const t of list) {
    await page.goto(url(t), { waitUntil: 'domcontentloaded' }).catch(() => {});
    await page.waitForTimeout(520);
    let probes = [];
    try {
      probes = await page.evaluate(`(window.__gvLists || []).map(function(a){ return a.__probe(); })`);
    } catch (e) { probes = []; }
    if (!probes.length) continue;
    listli++;

    const bad = [], partial = [];
    let n = 0, y = 0, kayit = 0;
    for (const p of probes) {
      kayit += p.rows;
      for (const c of p.cols) {
        if (!c.exportable) continue;
        kolonTop++;
        n += c.n; y += c.yalan;
        if (c.n && c.yalan === c.ekranDolu && c.ekranDolu > 0) bad.push(c);
        else if (c.yalan > 0) partial.push(c);
      }
    }
    hucreTop += n; hucreYalan += y;
    screens.push({ t, kayit, listCount: probes.length, hucre: n, yalan: y, bad, partial });
  }

  await browser.close();

  const kirli = screens.filter(s => s.bad.length || s.partial.length);
  if (kirli.length) {
    console.log('\n=== ÇIKTI TAŞIMAYAN KOLONLAR ===');
    for (const s of kirli.sort((a, b) => b.bad.length - a.bad.length)) {
      console.log(`\n${s.t}  (${s.kayit} kayıt)`);
      for (const c of s.bad)
        console.log(`  🔴 ${c.key.padEnd(18)} "${c.label}" — ekranda ${c.ekranDolu}/${c.n} dolu, çıktıda 0 · örn: ${c.ornek}`);
      for (const c of s.partial)
        console.log(`  ⚠  ${c.key.padEnd(18)} "${c.label}" — ${c.yalan}/${c.n} kayıtta çıktı boş · örn: ${c.ornek}`);
    }
  }

  console.log('\n=== ÖZET ===');
  console.log(`Taranan ekran: ${list.length} · GV.list kuran ekran: ${listli} · yüklenen kayıt: ${screens.reduce((a, s) => a + s.kayit, 0)}`);
  console.log(`Çıktıya giren kolon: ${kolonTop} · ölçülen hücre: ${hucreTop}`);
  console.log(`Ekranda dolu ama çıktıda boş hücre: ${hucreYalan} (%${(hucreYalan / (hucreTop || 1) * 100).toFixed(1)})`);
  console.log(`Tamamen taşımayan kolon: ${screens.reduce((a, s) => a + s.bad.length, 0)} · kısmi: ${screens.reduce((a, s) => a + s.partial.length, 0)}`);
  console.log(kirli.length
    ? `\nEKSİK — ${kirli.length} ekranda kolon tanımı çıktıyı beslemiyor`
    : `\nTEMİZ — ${kolonTop} kolonun tamamı çıktıya değer taşıyor`);
  process.exit(0);
})();
