/* Bağlantı bütünlüğü — TÜM ekranlar taranır.
   Kırık = href hedefi diskte yok. Ayrıca:
   - diskte var ama BUILT'te yok  → shell.js kaydı eksik (link data-wip'e düşer)
   - BUILT'te var ama diskte yok  → hayalet kayıt
   Statik tarama: her app-*.html'in markup'ı + sayfa script'indeki 'app-*.html' dizgileri.
   Menü/dashboard bağlantıları shell.js'ten ayrıca çıkarılır. */
const fs = require('fs'), path = require('path');
const LIB = require('./qa-lib');
const ROOT = LIB.repoRoot();          // tek kaynak (L-24)
/* links.js BİLEREK hem diski hem BUILT'i okur — işi ikisini karşılaştırmak. */

const onDisk = new Set(fs.readdirSync(ROOT).filter(f => /\.html$/.test(f)));
const shell = fs.readFileSync(path.join(ROOT, 'assets/js/shell.js'), 'utf8');

const builtBlock = shell.match(/var BUILT\s*=\s*\[([\s\S]*?)\]/);
if (!builtBlock) { console.log('✘ BUILT dizisi bulunamadı'); process.exit(1); }
const BUILT = new Set([...builtBlock[1].matchAll(/'([^']+\.html)'/g)].map(m => m[1]));

let bad = 0;
const hit = {};                         // hedef → onu işaret eden kaynaklar

function collect(src, from) {
  for (const m of src.matchAll(/(?:href=["']|['"])((?:app-|index)[A-Za-z0-9-]*\.html)/g)) {
    (hit[m[1]] = hit[m[1]] || new Set()).add(from);
  }
}
collect(shell, 'shell.js');
collect(fs.readFileSync(path.join(ROOT, 'assets/js/dashboard.js'), 'utf8'), 'dashboard.js');
const screens = fs.readdirSync(ROOT).filter(f => /^app-.*\.html$/.test(f)).sort();
for (const f of screens) collect(fs.readFileSync(path.join(ROOT, f), 'utf8'), f);

console.log('Taranan ekran: ' + screens.length + ' · BUILT kaydı: ' + BUILT.size +
            ' · benzersiz hedef: ' + Object.keys(hit).length);

/* Diskte olmayan hedef, BUILT'te de yoksa shell.js onu otomatik data-wip yapar —
   bu kırık link değil, üretilmemiş ekran kuyruğudur. Kırık sayılması için
   BUILT'te kayıtlı olup diskte olmaması gerekir (aşağıda 3. madde). */
console.log('\n1) Henüz üretilmemiş hedefler (otomatik data-wip — kuyruk, hata değil)');
{
  const wip = Object.entries(hit).filter(([t]) => !onDisk.has(t));
  console.log('  ' + wip.length + ' hedef bekliyor: ' +
    wip.map(([t]) => t.replace(/^app-|\.html$/g, '')).sort().join(' · '));
}

console.log('2) Diskte var ama BUILT\'te yok (link data-wip\'e düşer, ekran erişilemez)');
for (const t of Object.keys(hit)) {
  if (onDisk.has(t) && t !== 'index.html' && !BUILT.has(t)) {
    bad++; console.log('  ✘ ' + t);
  }
}

console.log('3) BUILT\'te var ama diskte yok (hayalet kayıt)');
for (const t of BUILT) if (!onDisk.has(t)) { bad++; console.log('  ✘ ' + t); }

console.log('4) Diskte var, BUILT\'te var, hiçbir yerden bağlantı yok (yetim ekran)');
for (const t of onDisk) {
  if (t !== 'index.html' && BUILT.has(t) && !hit[t]) { bad++; console.log('  ✘ ' + t); }
}

console.log('\n' + (bad === 0
  ? 'TEMİZ — kırık bağlantı, eksik BUILT kaydı, hayalet kayıt ve yetim ekran yok'
  : 'SORUN — ' + bad + ' kalem'));
process.exit(bad ? 1 : 0);
