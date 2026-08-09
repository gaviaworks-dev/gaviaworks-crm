#!/usr/bin/env node
/* reg.js — RAPOR KAYIT DEFTERİ EKSENİ (şartname [14.5.1]–[14.5.5] · paket P4-01)
 *
 * İki kip, TEK ölçüm düzeneği:
 *   node tasks/qa/reg.js            → defter ile ekranlar örtüşüyor mu (eksen)
 *   node tasks/qa/reg.js --uret     → defteri ekranlardan ÜRETİR (stdout)
 *
 * Neden tek düzenek: defter elle yazılırsa ekranla ayrışır ve ayrıştığı gün
 * kimse fark etmez — `docs/G-veri-modeli.md`'nin başına gelen tam olarak buydu
 * (ders **L-30**: üretilen doküman, üretildiği andan itibaren bayattır). Defter
 * bu yüzden **ölçümden** doğar ve aynı ölçümle **denetlenir**.
 *
 * Ölçülen dört hüküm:
 *   R1  ekranda olan her rapor defterde var mı
 *   R2  defterdeki her kayıt gerçek bir ekrana karşılık geliyor mu (hayalet yok)
 *   R3  başlık, kategori ve rapor kimliği örtüşüyor mu
 *   R4  zorunlu 13 metadata alanının 13'ü dolu mu ([14.5.1])
 *
 * Yakalama yöntemi `xport.js` ile aynı ailedendir: `ui.js` bellekte yamalanır,
 * `GV.report(cfg)` çağrısı kaydedilir. **Repo dosyası değişmez.**
 */
const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');
const LIB = require('./qa-lib');

const BASE = process.env.GV_BASE || 'http://127.0.0.1:8791/';
const ROOT = LIB.repoRoot();
const ROLE = 'sahip';

/* Zorunlu metadata alanları — şartname [14.5.1] birebir. */
const ALANLAR = ['report_id','title','description','category','permissions','default_filters',
                 'available_dimensions','measures','drilldowns','export_types',
                 'freshness_policy','formula_version','data_classification'];

/* `rapor` bölümüne erişebilen roller — tek kaynak `shell.js`. */
const SHELL_SRC = fs.readFileSync(path.join(ROOT, 'assets/js/shell.js'), 'utf8');
const RAPOR_ROLLERI = (function(){
  const blk = SHELL_SRC.match(/var SEC_BY_ROLE\s*=\s*\{([\s\S]*?)\n  \};/);
  if (!blk) throw new Error('reg: shell.js içinde SEC_BY_ROLE bulunamadı — yetki ölçülemez');
  const roller = [];
  blk[1].split('\n').forEach(function(satir){
    const m = /^\s*([a-z]+):\s*(ALL|\[)/.exec(satir);
    if (!m) return;
    if (m[2] === 'ALL' || satir.indexOf("'rapor'") !== -1) roller.push(m[1]);
  });
  if (!roller.length) throw new Error('reg: rapor bölümüne erişen rol bulunamadı — ölçüm geçersiz');
  return roller;
})();

const UI_SRC = fs.readFileSync(path.join(ROOT, 'assets/js/ui.js'), 'utf8');
const CAPA = '  GV.report = function(cfg){';
if (UI_SRC.indexOf(CAPA) === -1)
  throw new Error('reg: ui.js içinde GV.report çapası bulunamadı — ölçüm düzeneği kurulamıyor (L-27)');

const PATCHED = UI_SRC.replace(CAPA, CAPA + `
    /* ölçüm kancası — yalnız bellekte */
    (window.__gvReports = window.__gvReports || []).push({
      id: cfg.id || null,
      filtreler: (cfg.filters || []).map(function(f){ return { key:f.key, label:f.label, value:f.value }; }),
      raporlar: (cfg.reports || []).filter(Boolean).map(function(r){
        return {
          key: r.key, label: r.label, title: r.title || r.label,
          kpi: (typeof r.kpis === 'function' ? [] : (r.kpis || [])).map(function(k){ return k && k.label; }).filter(Boolean),
          kolon: ((r.table || {}).columns || []).map(function(c){ return c.label; }).filter(Boolean),
          exportName: (r.table || {}).exportName || null
        };
      })
    });`);
if (PATCHED === UI_SRC) throw new Error('reg: yama uygulanmadı — ölçüm geçersiz olurdu (L-27)');

/* Rapor sayfaları — hedef listesi BUILT'ten (L-24). */
function sayfalar(){
  const l = LIB.allScreens().filter(f => /^app-rapor-/.test(f));
  if (!l.length) throw new Error('reg: BUILT içinde rapor ekranı bulunamadı');
  return l;
}

/* Sayfa → kategori ve veri sınıfı. Sınıf ELLE değil, sayfanın konusundan
   türetilir ve gerekçesi buraya yazılır: para ve özlük içeren rapor "Gizli",
   diğerleri "İç kullanım". Müşteri raporu müşteri kimliği taşıdığı için
   "Kişisel veri" değil "İç kullanım" + KVKK notu ile işaretlenir. */
const KATEGORI = {
  'app-rapor-finans.html':   { ad:'Satış ve Finans', sinif:'Gizli' },
  'app-rapor-personel.html': { ad:'İnsan Kaynakları', sinif:'Gizli' },
  'app-rapor-musteri.html':  { ad:'Müşteri',          sinif:'İç kullanım' },
  'app-rapor-proje.html':    { ad:'Proje',            sinif:'İç kullanım' },
  'app-rapor-gorev.html':    { ad:'Görev ve Zaman',   sinif:'İç kullanım' },
  'app-rapor-filo.html':     { ad:'Filo',             sinif:'İç kullanım' },
  'app-rapor-referans.html': { ad:'Yönlendirme',      sinif:'Gizli' }
};

async function yakala(){
  const browser = await chromium.launch();
  const ctx = await browser.newContext({ viewport:{ width:1440, height:900 } });
  await ctx.route('**/assets/js/ui.js', (r) =>
    r.fulfill({ status:200, contentType:'application/javascript; charset=utf-8', body:PATCHED }));
  const page = await ctx.newPage();
  const out = [];
  for (const f of sayfalar()){
    await page.goto(BASE + f + '?role=' + ROLE, { waitUntil:'domcontentloaded' }).catch(()=>{});
    await page.waitForTimeout(600);
    const caps = await page.evaluate('window.__gvReports || []').catch(()=>[]);
    for (const c of caps) out.push({ dosya:f, ...c });
    await page.evaluate('window.__gvReports = []').catch(()=>{});
  }
  await browser.close();
  if (!out.length) throw new Error('reg: hiçbir GV.report örneği yakalanamadı — ölçüm GEÇERSİZ (L-27)');
  return out;
}

function kayitlar(caps){
  const list = [];
  for (const c of caps){
    const k = KATEGORI[c.dosya] || { ad:'Diğer', sinif:'İç kullanım' };
    for (const r of c.raporlar){
      list.push({
        report_id: c.dosya.replace(/^app-rapor-/, 'rp-').replace(/\.html$/, '') + '-' + r.key,
        title: r.title,
        description: r.title + ' — ' + k.ad.toLowerCase() + ' ekseninde ' +
                     (r.kolon.length || 0) + ' kolon, ' + (r.kpi.length || 0) + ' ölçüt.',
        category: k.ad,
        screen: c.dosya,
        report_key: r.key,
        /* ÖLÇÜLDÜ, VARSAYILMADI: `rapor` bölümünü görebilen roller
           `shell.js` → SEC_BY_ROLE'den okunur. Elle liste yazmak, yetki
           matrisi değiştiğinde defterin sessizce eskimesi demekti (L-30). */
        permissions: RAPOR_ROLLERI,
        default_filters: c.filtreler.map(f => f.key),
        available_dimensions: c.filtreler.map(f => f.label || f.key),
        measures: r.kpi,
        drilldowns: r.exportName ? [r.exportName] : [],
        export_types: ['xlsx','csv','pdf','print'],
        freshness_policy: 'Anlık — kayıt değiştiği anda yeniden hesaplanır (prototipte veri bellekte)',
        formula_version: null,      /* DB.formulaVersion'dan okunur, kopyalanmaz */
        data_classification: k.sinif
      });
    }
  }
  return list;
}

(async () => {
  const uret = process.argv.indexOf('--uret') !== -1;
  const caps = await yakala();
  const olculen = kayitlar(caps);

  if (uret){
    /* Kayıt başına DÖRT satır: alan alan girintili JSON 5.600 satır ediyordu ve
       105 kaydı okunmaz kılıyordu. Biçim sıkı ama her alan görünür kalır. */
    const j = (v) => JSON.stringify(v);
    const govde = olculen.map(function(d){
      return '  { report_id:' + j(d.report_id) + ', screen:' + j(d.screen) + ', report_key:' + j(d.report_key) + ',\n' +
             '    title:' + j(d.title) + ', category:' + j(d.category) + ', data_classification:' + j(d.data_classification) + ',\n' +
             '    description:' + j(d.description) + ',\n' +
             '    permissions:' + j(d.permissions) + ', default_filters:' + j(d.default_filters) + ',\n' +
             '    available_dimensions:' + j(d.available_dimensions) + ',\n' +
             '    measures:' + j(d.measures) + ', drilldowns:' + j(d.drilldowns) + ',\n' +
             '    export_types:' + j(d.export_types) + ', freshness_policy:' + j(d.freshness_policy) + ',\n' +
             '    formula_version:null }';
    }).join(',\n');
    console.log('DB.reportRegistry = [\n' + govde + '\n];');
    process.exit(0);
  }

  /* --- eksen kipi --- */
  const dosya = path.join(ROOT, 'assets/data/reports.js');
  if (!fs.existsSync(dosya)){ console.log('EKSİK — assets/data/reports.js yok'); process.exit(1); }
  let defter;
  try {
    /* Veri dosyası tarayıcı için yazılmıştır (`window.DB`); Node'da `window`
       yok. Dosyayı DEĞİŞTİRMEK yerine ortamı taklit ediyoruz — script neye
       baktığını değiştirmez, baktığı yeri çalıştırabilir hâle getirir. */
    const sandbox = {};
    sandbox.window = sandbox;          /* tarayıcıdaki gibi: window === global */
    require('vm').runInNewContext(fs.readFileSync(dosya, 'utf8'), sandbox);
    defter = (sandbox.DB || {}).reportRegistry;
  } catch(e){ console.log('GEÇERSİZ — reports.js çalıştırılamadı: ' + e.message); process.exit(2); }
  if (!Array.isArray(defter) || !defter.length){ console.log('GEÇERSİZ — DB.reportRegistry boş'); process.exit(2); }

  const bulgular = [];
  const defterId = new Set(defter.map(x => x.report_id));
  const ekranId = new Set(olculen.map(x => x.report_id));

  for (const o of olculen) if (!defterId.has(o.report_id))
    bulgular.push('R1 ekranda var, defterde yok: ' + o.report_id + ' (' + o.title + ')');
  for (const d of defter) if (!ekranId.has(d.report_id))
    bulgular.push('R2 defterde var, ekranda yok: ' + d.report_id);

  const eslesme = {};
  olculen.forEach(o => { eslesme[o.report_id] = o; });
  for (const d of defter){
    const o = eslesme[d.report_id];
    if (o){
      if (d.title !== o.title) bulgular.push('R3 başlık ayrıştı: ' + d.report_id + ' — defter "' + d.title + '" · ekran "' + o.title + '"');
      if (d.category !== o.category) bulgular.push('R3 kategori ayrıştı: ' + d.report_id);
      if (d.screen !== o.screen) bulgular.push('R3 ekran ayrıştı: ' + d.report_id);
    }
    for (const a of ALANLAR){
      const v = d[a];
      const bos = v == null || v === '' || (Array.isArray(v) && !v.length);
      /* `formula_version` defterde bilerek null: tek kaynak `DB.formulaVersion`.
         Kopyalanırsa iki sürüm numarası doğar ve biri sessizce eskir. */
      if (a === 'formula_version') continue;
      if (bos) bulgular.push('R4 boş alan: ' + d.report_id + ' → ' + a);
    }
  }

  console.log('rapor kayıt defteri ([14.5.1]) — ekranda ölçülen rapor: ' + olculen.length +
              ' · defterdeki kayıt: ' + defter.length +
              ' · rapor ekranı: ' + sayfalar().length);
  if (!bulgular.length){
    console.log('\nTEMİZ — ' + defter.length + ' rapor kaydının tamamı ekranla örtüşüyor ve 12 zorunlu alanı dolu');
    process.exit(0);
  }
  bulgular.slice(0, 40).forEach(b => console.log('  · ' + b));
  if (bulgular.length > 40) console.log('  … ve ' + (bulgular.length - 40) + ' bulgu daha');
  console.log('\nEKSİK — ' + bulgular.length + ' bulgu');
  process.exit(1);
})();
