/* dep.js — ORTAK YORDAMIN VERİ BAĞIMLILIĞI (ders L-34)
 *
 * Ölçtüğü soru: *"Bu ekran `GV.*` yordamını çağırıyor; yordamın İÇERİDEN okuduğu
 * koleksiyonlar bu ekranda gerçekten yüklü mü?"*
 *
 * Neden ayrı bir eksen — L-12 · L-32 · L-34 üçlüsü:
 *   L-12 ekranın KENDİ markup'ında geçen `DB.<koleksiyon>`u ölçer  → `dbref.js`
 *   L-32 ekranın çağırdığı `GV.*` için `domain.js` yüklü mü        → burada
 *   L-34 yordamın İÇERİDEN okuduğu koleksiyonlar                   → burada
 *
 * L-34 üçünün en sinsisi: `DB.purchases` `undefined` olduğunda yordam
 * `(DB.purchases || [])` ile boş diziye düşer, HATA FIRLATMAZ — ekran açılır,
 * konsol temizdir, sayı **sessizce yanlıştır**. `dbref.js` göremez çünkü
 * koleksiyon adı ekranın markup'ında hiç geçmez, yordamın içinde geçer.
 * `qa.js` / `gate.js` göremez çünkü konsola hiçbir şey düşmez.
 *
 * SÖZLEŞMENİN KAYNAĞI ELLE YAZILMAZ: bağımlılık tablosu `tasks/components.md`
 * §6b'den OKUNUR. Tablo değişince tarama kendiliğinden takip eder; ikinci bir
 * kopya tutmak (L-08) er geç kaynağıyla çelişirdi.
 *
 * Hedef listesi `qa-lib.allScreens()`ten gelir — hiçbir script kendi listesini
 * kurmaz (L-24).
 *
 * Ölçüm sıfır çıkarsa TEMİZ demez, GEÇERSİZ deyip hata koduyla biter (L-27).
 *
 * Kullanım: node dep.js
 */
const fs = require('fs'), path = require('path');
const LIB = require('./qa-lib');
const ROOT = LIB.repoRoot();

/* Yorum satırındaki yordam adı ÇAĞRI DEĞİLDİR (L-26: "bu hüküm hangi SAĞLIKLI
   davranışı ihlal gösterir?"). `app-proje-form.html` R03/R04 kararlarını
   `/* … *​/` bloklarında anlatıyor ve iki yordamın adını geçiriyor; ham metin
   taraması bunu çağrı sanıp üç sahte ihlal üretmişti. Yorumdan arınmış kaynak
   hem çağrıların hem de `<script src>` yüklemelerinin tek okuma yüzeyidir —
   yoruma alınmış bir script etiketi de gerçekten yüklenmez. */
function stripComments(src) {
  return src
    .replace(/\/\*[\s\S]*?\*\//g, ' ')      // /* blok */
    .replace(/<!--[\s\S]*?-->/g, ' ')       // <!-- html -->
    .replace(/^[ \t]*\/\/.*$/gm, ' ');      // satır başındaki // — URL'lere dokunmaz
}

/* ---------- 1. Sözleşme: components.md §6b bağımlılık tablosu ---------- */

const CMP = path.join(ROOT, 'tasks/components.md');
if (!fs.existsSync(CMP)) throw new Error('dep: tasks/components.md bulunamadı');
const cmpSrc = fs.readFileSync(CMP, 'utf8').split('\n');

const hdr = cmpSrc.findIndex(l => /\|\s*Yordam\s*\|\s*Okuduğu veri dosyaları\s*\|/.test(l));
if (hdr === -1) throw new Error('dep: components.md §6b bağımlılık tablosu bulunamadı');

/* [{ desen, re, dosyalar:Set }] — desen ya tam ad (`GV.proje.sure`) ya da
   yıldızlı isim alanı (`GV.task.*`). */
const CONTRACT = [];
for (let i = hdr + 1; i < cmpSrc.length; i++) {
  const l = cmpSrc[i];
  if (!/^>?\s*\|/.test(l)) break;                       // tablo bitti
  if (/^>?\s*\|[\s|:-]+\|\s*$/.test(l)) continue;       // ayraç satırı
  const m = /^>?\s*\|\s*`([^`]+)`\s*\|([\s\S]*)$/.exec(l);
  if (!m) continue;
  const desen = m[1].trim();
  const dosyalar = [...m[2].matchAll(/`([a-z0-9_]+\.js)`/g)].map(x => x[1]);
  /* Bağımlılığı OLMAYAN yordam da tabloya yazılır (`—`): "veri okumaz" ile
     "tabloya yazılmadı" ayrı şeylerdir ve ikincisi ölçülemeyen bir boşluktur.
     Satırı olmayan yordam ihlal sayılır, sessizce geçmez. */
  if (!dosyalar.length && !/—/.test(m[2])) continue;
  const esc = desen.replace(/\./g, '\\.');
  const re = desen.endsWith('.*')
    ? new RegExp(esc.replace(/\\\.\*$/, '\\.[A-Za-z]'))  // GV.task.<herhangi>
    : new RegExp(esc + '\\b');
  CONTRACT.push({ desen, re, dosyalar: new Set(dosyalar) });
}
if (CONTRACT.length < 5)
  throw new Error('dep: bağımlılık tablosundan yalnız ' + CONTRACT.length +
                  ' satır okunabildi — düzenek kurulamadı (L-27)');

/* ---------- 2. Yordam isim alanları — domain.js'ten TÜRETİLİR ----------
   Elle yazılsaydı yeni bir isim alanı (`GV.satis` gibi) sessizce taranmadan
   kalırdı. Tablo satırı olmayan bir çağrı ihlaldir; bunu ölçebilmek için
   "hangi çağrılar domain yordamıdır" sorusunun cevabı kaynaktan gelir. */
const domainSrc = fs.readFileSync(path.join(ROOT, 'assets/js/domain.js'), 'utf8');
const NS = [...domainSrc.matchAll(/^\s*GV\.([A-Za-z]+)\s*=\s*[A-Z]/gm)].map(m => m[1]);
if (!NS.length) throw new Error('dep: domain.js içinde GV.<isimAlanı> ataması bulunamadı');
const CALL_RE = new RegExp('GV\\.(' + NS.join('|') + ')\\.([A-Za-z0-9_]+)', 'g');

/* ---------- 3. Çağrı kaynakları ----------
   Ekranın kendi markup'ı YETMEZ: yüklediği ortak js dosyası da yordam çağırıyor
   olabilir (`dashboard.js` → `GV.proje.maliyet`). O zaman bağımlılık ekrana
   geçer. `domain.js` hariç tutulur — yordamların birbirini çağırması zaten
   tablonun kendi satırında yazılıdır, her ekrana yaymak sahte ihlal üretirdi. */
const SHARED = {};
for (const f of fs.readdirSync(path.join(ROOT, 'assets/js')).filter(f => f.endsWith('.js'))) {
  if (f === 'domain.js') continue;
  SHARED[f] = stripComments(fs.readFileSync(path.join(ROOT, 'assets/js', f), 'utf8'));
}

function callsOf(src, nereden, out) {
  for (const m of src.matchAll(CALL_RE)) {
    const ad = 'GV.' + m[1] + '.' + m[2];
    if (!out.has(ad)) out.set(ad, new Set());
    out.get(ad).add(nereden);
  }
}

/* ---------- 4. Tarama ---------- */

let ihlalEkran = 0, cagriYeri = 0, ekranSayisi = 0, cagiranEkran = 0;
let eksikVeri = 0, eksikDomain = 0, tablodaYok = 0;
const tablosuz = new Map();

for (const file of LIB.allScreens()) {
  const src = stripComments(fs.readFileSync(path.join(ROOT, file), 'utf8'));
  ekranSayisi++;

  const cagrilar = new Map();                   // 'GV.proje.sure' → Set(kaynak)
  callsOf(src, file, cagrilar);
  for (const [js, jsSrc] of Object.entries(SHARED))
    if (src.includes('assets/js/' + js)) callsOf(jsSrc, js, cagrilar);

  if (!cagrilar.size) continue;
  cagiranEkran++;
  cagriYeri += cagrilar.size;

  const yuklu = new Set([...src.matchAll(/assets\/data\/([a-z0-9_]+\.js)/g)].map(m => m[1]));
  const domainYuklu = /assets\/js\/domain\.js/.test(src);

  const gerekli = new Map();                    // dosya → Set(gerekçe yordam)
  const kapsamsiz = [];
  for (const [ad, kaynaklar] of cagrilar) {
    const satir = CONTRACT.filter(c => c.re.test(ad));
    if (!satir.length) {
      kapsamsiz.push(ad);
      if (!tablosuz.has(ad)) tablosuz.set(ad, new Set());
      [...kaynaklar].forEach(k => tablosuz.get(ad).add(k === file ? file : file + ' → ' + k));
      continue;
    }
    for (const c of satir) for (const d of c.dosyalar) {
      if (!gerekli.has(d)) gerekli.set(d, new Set());
      gerekli.get(d).add(ad);
    }
  }

  const sorun = [];
  if (!domainYuklu) {
    eksikDomain++;
    sorun.push('assets/js/domain.js YÜKLENMİYOR — ' + [...cagrilar.keys()].join(', ') +
               ' çağrılıyor (L-32: tıklama anında patlar, açılışta değil)');
  }
  for (const [d, nedenler] of gerekli) {
    if (yuklu.has(d)) continue;
    eksikVeri++;
    sorun.push('assets/data/' + d + ' YÜKLENMİYOR — ' + [...nedenler].join(' · ') +
               ' bu dosyayı okuyor (L-34: hata yok, EKSİK SAYI)');
  }
  for (const ad of kapsamsiz) {
    tablodaYok++;
    sorun.push(ad + ' components.md §6b tablosunda YOK — bağımlılığı ölçülemiyor');
  }

  if (sorun.length) {
    ihlalEkran++;
    console.log('✘ ' + file);
    console.log('   çağırdığı yordam: ' + [...cagrilar.keys()].join(', '));
    console.log('   yüklü veri: ' + ([...yuklu].join(', ') || '(hiç)'));
    sorun.forEach(s => console.log('   ✘ ' + s));
  }
}

/* ---------- 5. Rapor (L-19: kaç ekran, kaç çağrı, kaç birim) ---------- */

console.log('\n— ölçüm —');
console.log('sözleşme satırı (components.md §6b): ' + CONTRACT.length +
            ' · isim alanı: ' + NS.map(n => 'GV.' + n).join(', '));
console.log('taranan ekran: ' + ekranSayisi + ' · yordam çağıran ekran: ' + cagiranEkran +
            ' · ekran×yordam çifti: ' + cagriYeri);

if (!cagriYeri) {
  console.log('\nGEÇERSİZ — hiçbir ekranda yordam çağrısı bulunamadı, düzenek kurulamadı (L-27)');
  process.exit(2);
}
if (tablosuz.size) {
  console.log('\nTabloda karşılığı olmayan yordamlar:');
  for (const [ad, yerler] of tablosuz) console.log('  ' + ad + ' → ' + [...yerler].join(', '));
}
console.log('\n' + (ihlalEkran === 0
  ? 'TEMİZ — ' + cagiranEkran + ' ekranın ' + cagriYeri +
    ' yordam çağrısının tamamı bağımlı olduğu veri dosyalarını yüklüyor'
  : 'EKSİK BAĞIMLILIK — ' + ihlalEkran + ' / ' + cagiranEkran + ' ekran' +
    '  (veri dosyası ' + eksikVeri + ' · domain.js ' + eksikDomain +
    ' · tablo dışı yordam ' + tablodaYok + ')'));
process.exit(ihlalEkran ? 1 : 0);
