/* flow.js — DURUM GEÇİŞ SÖZLEŞMESİ DENETİMİ (CLOUD TURU)
 *
 * `DB.transitions` + `DB.taskTransitions` sözleşmesinin veriyle tutarlı olup
 * olmadığını ölçer. Node ile çalışır, tarayıcı gerektirmez:
 *     node tasks/qa/flow.js
 *
 * BEŞ EKSEN:
 *   1. tablosuz-durum  — bir kaydın durumu geçiş tablosunda tanımlı mı?
 *   2. yetim-hedef     — tablonun `next` listesinde tabloda olmayan durum var mı?
 *   3. rol-anahtari    — `yetki`/`istisnaRol` gerçek bir `DB.roles[].key` mi,
 *                        yoksa tanınan bir İLİŞKİ anahtarı mı?
 *   4. zorunlu-alan    — `zorunlu` listesindeki alan koleksiyonun şemasında var mı?
 *   5. ulasilmaz-durum — tabloda tanımlı ama hiçbir `next`'ten gidilemeyen,
 *                        üstelik hiçbir kaydın da taşımadığı durum var mı?
 *
 * ⚠️ NEDEN GEREKLİ (L-17 · L-34): bu eksenlerin üçü ilk koşumda GERÇEK hata
 * yakaladı. Geçiş tabloları elle yazıldığında `'gm'` ve `'satis'` gibi var
 * olmayan rol anahtarları ve `tutar` gibi şemada bulunmayan zorunlu alanlar
 * yazılmıştı; sonuç sessizdi — ekran hata vermiyor, yalnız BÜTÜN geçiş
 * düğmeleri devre dışı kalıyordu. Bir kural, uygulanamadığında da "yazılı"
 * görünür; bu yüzden sözleşmenin kendisi ölçülür.
 *
 * ⚠️ EKSEN BOZULMUŞ KOPYADA SINANDI: `node tasks/qa/flow.js --selftest`
 * veriyi bilerek bozar ve beş eksenin beşinin de hata bulduğunu doğrular.
 * Sıfır bulgu, ancak eksen bozuk veride bulgu ürettiği kanıtlandıktan sonra
 * "temiz" sayılır.
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..', '..');
const ILISKI = ['sorumlu', 'kontrolEden', 'onaylayan', 'veren'];

function loadDB() {
  const g = { window: {} };
  g.window.DB = {};
  ['org', 'crm', 'work', 'hr', 'ops', 'misc'].forEach(f => {
    const src = fs.readFileSync(path.join(ROOT, 'assets/data', f + '.js'), 'utf8');
    const fn = new Function('window', 'DB', src + '\n;return window.DB;');
    g.window.DB = fn(g.window, g.window.DB) || g.window.DB;
  });
  return g.window.DB;
}

function denetle(DB) {
  const bulgular = [];
  const gecerliRol = new Set((DB.roles || []).map(r => r.key).concat(ILISKI));

  const tablolar = Object.assign({}, DB.transitions || {});
  if (DB.taskTransitions) tablolar.task = DB.taskTransitions;

  Object.keys(DB.flowEntities || {}).forEach(tur => {
    const ent = DB.flowEntities[tur];
    const tb = tablolar[tur];
    const rows = DB[ent.koleksiyon] || [];

    if (!tb) { bulgular.push(['tablosuz-varlik', tur, ent.koleksiyon + ' için geçiş tablosu yok']); return; }

    /* 1 — kayıtların durumu tabloda var mı */
    const gorulen = new Set();
    rows.forEach(r => {
      const v = r[ent.alan];
      gorulen.add(v);
      if (!tb[v]) bulgular.push(['tablosuz-durum', tur, r.kod + ' → "' + v + '"']);
    });

    /* şema alanları — bir kayıtta olmayan alan başka kayıtta olabilir */
    const alanlar = new Set();
    rows.forEach(r => Object.keys(r).forEach(k => alanlar.add(k)));

    Object.keys(tb).forEach(d => {
      const k = tb[d];
      /* 2 — hedef tabloda var mı */
      (k.next || []).forEach(h => {
        if (!tb[h]) bulgular.push(['yetim-hedef', tur, d + ' → "' + h + '" tabloda yok']);
      });
      /* 3 — rol anahtarı gerçek mi */
      (k.yetki || []).concat(k.istisnaRol || []).forEach(y => {
        if (!gecerliRol.has(y)) bulgular.push(['rol-anahtari', tur, d + ' → "' + y + '" ne rol ne ilişki']);
      });
      /* 4 — zorunlu alan şemada var mı */
      if (rows.length) (k.zorunlu || []).forEach(a => {
        if (!alanlar.has(a)) bulgular.push(['zorunlu-alan', tur, d + ' → "' + a + '" şemada yok']);
      });
    });

    /* 5 — hiçbir yerden gidilemeyen ve hiçbir kayıtta olmayan durum */
    const hedefler = new Set();
    Object.keys(tb).forEach(d => (tb[d].next || []).forEach(h => hedefler.add(h)));
    Object.keys(tb).forEach(d => {
      const baslangic = d === Object.keys(tb)[0];
      if (!hedefler.has(d) && !gorulen.has(d) && !baslangic)
        bulgular.push(['ulasilmaz-durum', tur, '"' + d + '" ne hedef ne kayıt']);
    });
  });

  return bulgular;
}

function rapor(DB, etiket) {
  const b = denetle(DB);
  const eksenler = {};
  b.forEach(([eksen]) => eksenler[eksen] = (eksenler[eksen] || 0) + 1);
  const varlik = Object.keys(DB.flowEntities || {}).length;
  const kayit = Object.keys(DB.flowEntities || {})
    .reduce((s, t) => s + ((DB[DB.flowEntities[t].koleksiyon] || []).length), 0);
  console.log(etiket + ':  varlık ' + varlik + ' · kayıt ' + kayit + ' · bulgu ' + b.length);
  if (b.length) {
    Object.keys(eksenler).forEach(e => console.log('   ' + e.padEnd(18) + eksenler[e]));
    b.slice(0, 25).forEach(([e, t, d]) => console.log('   ✗ [' + e + '] ' + t + ' · ' + d));
    if (b.length > 25) console.log('   … ve ' + (b.length - 25) + ' bulgu daha');
  }
  return b;
}

/* --- ÖZ SINAMA: eksen bozuk veride bulgu üretiyor mu? ------------------- */
function selftest() {
  const DB = loadDB();
  const temiz = denetle(DB);
  console.log('temiz veri  → bulgu ' + temiz.length);

  const boz = JSON.parse(JSON.stringify({
    flowEntities: DB.flowEntities, transitions: DB.transitions,
    roles: DB.roles, projects: DB.projects, quotes: DB.quotes
  }));
  boz.taskTransitions = null;
  /* 1 — kaydın durumunu tabloda olmayan bir değere çevir */
  boz.projects[0].durum = 'UYDURMA_DURUM';
  /* 2 — tabloya var olmayan bir hedef ekle */
  boz.transitions.project['Aktif'].next.push('OLMAYAN_HEDEF');
  /* 3 — var olmayan rol anahtarı */
  boz.transitions.quote['Taslak'].yetki.push('olmayan_rol');
  /* 4 — şemada olmayan zorunlu alan */
  boz.transitions.quote['Taslak'].zorunlu.push('olmayan_alan');
  /* 5 — ulaşılmaz durum */
  boz.transitions.project['ULASILMAZ'] = { next: [], yetki: [], zorunlu: [] };
  /* yalnız iki varlığı ölç */
  boz.flowEntities = { project: DB.flowEntities.project, quote: DB.flowEntities.quote };

  const bozuk = denetle(boz);
  const bulunan = new Set(bozuk.map(x => x[0]));
  const beklenen = ['tablosuz-durum', 'yetim-hedef', 'rol-anahtari', 'zorunlu-alan', 'ulasilmaz-durum'];
  console.log('bozuk veri  → bulgu ' + bozuk.length);
  let eksik = beklenen.filter(e => !bulunan.has(e));
  beklenen.forEach(e => console.log('   ' + (bulunan.has(e) ? 'YAKALADI ' : 'KAÇIRDI  ') + e));
  if (eksik.length) {
    console.log('\n✗ ÖZ SINAMA BAŞARISIZ — eksen ' + eksik.join(', ') + ' bozuk veriyi yakalamıyor.');
    console.log('  Bu eksenin "temiz" demesi bir kanıt değildir.');
    process.exit(1);
  }
  console.log('\nÖZ SINAMA GEÇTİ — beş eksenin beşi de bozuk kopyada bulgu üretti.');
  console.log('Temiz veride ' + temiz.length + ' bulgu' + (temiz.length ? ' VAR — düzeltilmeli.' : ' yok.'));
  process.exit(temiz.length ? 1 : 0);
}

if (process.argv.includes('--selftest')) selftest();
else {
  const b = rapor(loadDB(), 'geçiş sözleşmesi');
  process.exit(b.length ? 1 : 0);
}
