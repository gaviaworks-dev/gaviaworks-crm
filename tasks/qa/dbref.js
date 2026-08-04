/* Her ekranın kullandığı DB.<koleksiyon> referanslarını, o ekranın YÜKLEDİĞİ
   veri dosyalarıyla karşılaştırır. Yüklenmeyen dosyadan okuma = çalışma anında
   "Cannot read properties of undefined" — sayfa açılışında değil, etkileşimde patlar,
   bu yüzden qa.js bunu yakalayamaz. */
const fs = require('fs'), path = require('path'), vm = require('vm');
const ROOT = '/Users/gaviaworks/Developer/Projects/gaviaworks-crm';
const DATA = path.join(ROOT, 'assets/data');

// Hangi koleksiyon hangi dosyada tanımlı?
const owner = {};
for (const f of fs.readdirSync(DATA).filter(f => f.endsWith('.js'))) {
  const src = fs.readFileSync(path.join(DATA, f), 'utf8');
  for (const m of src.matchAll(/^DB\.([A-Za-z0-9_]+)\s*=/gm)) owner[m[1]] = f;
}

// ui.js / shell.js da DB'ye dokunuyor olabilir — onlar her sayfada yüklü, muaf.
const ALWAYS = new Set(['today']);

let bad = 0, scanned = 0;
for (const file of fs.readdirSync(ROOT).filter(f => /^app-.*\.html$/.test(f)).sort()) {
  const src = fs.readFileSync(path.join(ROOT, file), 'utf8');
  const loaded = new Set([...src.matchAll(/assets\/data\/([a-z0-9_]+\.js)/g)].map(m => m[1]));
  const used = new Set([...src.matchAll(/\bDB\.([A-Za-z0-9_]+)/g)].map(m => m[1]));
  scanned++;
  const missing = [];
  for (const c of used) {
    if (ALWAYS.has(c)) continue;
    const own = owner[c];
    if (!own) { missing.push(c + ' (hiçbir veri dosyasında tanımlı değil)'); continue; }
    if (!loaded.has(own)) missing.push(c + ' → ' + own + ' yüklenmiyor');
  }
  if (missing.length) {
    bad++;
    console.log('✘ ' + file);
    console.log('   yüklü: ' + [...loaded].join(', '));
    missing.forEach(m => console.log('   eksik: ' + m));
  }
}
console.log('\n' + (bad === 0
  ? 'TEMİZ — ' + scanned + ' ekran, yüklenmeyen veri dosyasından okuma yok'
  : 'EKSİK VERİ DOSYASI — ' + bad + ' / ' + scanned + ' ekran'));
process.exit(bad ? 1 : 0);
