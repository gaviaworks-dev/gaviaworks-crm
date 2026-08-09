#!/usr/bin/env node
/* notes-isolation.js — NOTLARIM NEGATİF YETKİ AĞI (şartname [15.5.1]–[15.5.6] · P1-09)
 *
 * Bu eksen **modülden ÖNCE** yazıldı ve bu bilinçlidir: şartname test ağını P0
 * sayıyor ([16.1.8]). Modül yokken eksen "MODÜL YOK" der ve **yeşil sayılmaz**
 * ([22.0.11] — kısmi tamamlanma açıkça kısmi yazılır).
 *
 * Sorduğu tek soru: **"Sahibi dışında hiç kimse bir kişisel notun içeriğine
 * ulaşabiliyor mu?"** — kullanıcı, yönetici, log, arama, rapor, export, bildirim.
 *
 * Altı senaryo:
 *   N1 [15.5.1] B kullanıcısı, A'nın not ID'siyle listede/detayda içeriği göremez
 *   N2 [15.5.2] superadmin (`sahip` · `sistem`) de göremez — rol matrisinden BAĞIMSIZ
 *   N3 [15.5.1] genel arama A'nın not metnini bulmaz (B ve superadmin oturumunda)
 *   N4 [15.5.5] not metni audit defterinde (`DB.activities` · `DB.logs`) geçmez
 *   N5 [15.5.5] not metni rapor/registry/export yüzeyinde geçmez
 *   N6 [15.5.3] sahiplik oturumdan atanır — veriden gelen `owner` ezilemez
 *
 * ⚠️ PROTOTİP SINIRI — bu eksen bir GÜVENLİK KANITI DEĞİLDİR.
 * Veri tarayıcıya tam yükleniyor; owner süzgeci istemcidedir. Yani "ekranda
 * görünmüyor" ile "erişilemiyor" aynı şey değildir ([15.4.1]–[15.4.3] backend
 * payı). Eksen ARAYÜZ SÖZLEŞMESİNİ ölçer: modül kendi kuralını uyguluyor mu.
 * Gerçek izolasyon sunucu tarafı `owner_user_id` kapsamı gelmeden sağlanamaz ve
 * bu, modül canlıya çıkmadan kapatılması zorunlu bir açıktır
 * (`docs/Q-cloud-turu-kapanis.md` §4).
 *
 * Kullanım: node tasks/qa/notes-isolation.js
 * Sunucu:   python3 -m http.server 8791 --bind 127.0.0.1
 */
const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');
const LIB = require('./qa-lib');

const BASE = process.env.GV_BASE || 'http://127.0.0.1:8791/';
const ROOT = LIB.repoRoot();

const LISTE = 'app-notlarim.html';
const FORM  = 'app-not-form.html';

/* Sahibi A olan bir notun kodu ve içindeki AYIRT EDİCİ metin. Veriden okunur,
   elle yazılmaz (L-19): eksen kendi hedefini uydurursa "bulamadım" der ve
   sahte yeşil verir. */
function hedefNot(){
  const p = path.join(ROOT, 'assets/data/notes.js');
  if (!fs.existsSync(p)) return null;
  const sandbox = {};
  sandbox.window = sandbox;
  try { require('vm').runInNewContext(fs.readFileSync(p, 'utf8'), sandbox); }
  catch(e){ return { hata:'notes.js çalıştırılamadı: ' + e.message }; }
  const list = (sandbox.DB || {}).personalNotes || [];
  if (!list.length) return { hata:'DB.personalNotes boş' };
  /* İçeriği en uzun olan not seçilir: arama ve log taramasında en çok iz bırakan. */
  const n = list.slice().sort((a,b) => String(b.body||'').length - String(a.body||'').length)[0];
  const sahip = n.owner || n.owner_user_id;
  const baska = list.filter(x => (x.owner || x.owner_user_id) !== sahip)[0];
  return {
    kod: n.kod || n.id, sahip: sahip,
    metin: String(n.body || '').slice(0, 40).trim(),
    /* Alan adı `baslik` — `title` şartnamedeki karşılığı, VERİDE yok.
       İlk yazımda `n.title` okunuyordu ve başlık hiç aranmıyordu: eksen
       sızıntının yarısına kör kalmıştı (L-29 — araç neye baktığını da ölçer). */
    baslik: String(n.baslik || n.title || '').trim(),
    baskaSahip: baska ? (baska.owner || baska.owner_user_id) : null,
    toplam: list.length
  };
}

/* Oturumu kurup sayfayı açar. ⚠️ Alan adı `rol`, `role` DEĞİL (handoff §0). */
async function ac(ctx, hedef, rol, emp){
  const page = await ctx.newPage();
  await page.addInitScript(([rol, emp]) => {
    try { sessionStorage.setItem('gv.session', JSON.stringify({ rol:rol, emp:emp })); } catch(e){}
  }, [rol, emp]);
  await page.goto(BASE + hedef, { waitUntil:'domcontentloaded' }).catch(()=>{});
  await page.waitForTimeout(450);
  /* SAYFA GERÇEKTEN YÜKLENDİ Mİ (ders L-19). İlk koşumda sunucu ölmüştü ve
     eksen bunu "özellik yok" diye raporladı: `GV.notes.olustur yok`,
     `arama kutusu bulunamadı`. Yüklenmemiş sayfada yapılan ölçüm ne geçer ne
     kalır — GEÇERSİZDİR ve öyle söylenir. */
  page.__yuklendi = await page.evaluate(() => !!document.querySelector('.gv-app')).catch(() => false);
  return page;
}

/* Sayfanın GÖRÜNEN metni — `<script>` düğümleri atılır (ders L-29: innerText
   gizli sekmeyi kaçırır, ham textContent script gövdesini içeri alır). */
const GORUNEN = `(function(){
  var k = document.body.cloneNode(true);
  Array.prototype.forEach.call(k.querySelectorAll('script,style'), function(n){ n.remove(); });
  return k.textContent || '';
})()`;

(async () => {
  const bulgular = [];
  const atlanan = [];
  const gecersiz = [];
  const gecen = [];

  const modulVar = fs.existsSync(path.join(ROOT, LISTE));
  const hedef = hedefNot();

  if (!modulVar || !hedef || hedef.hata){
    console.log('NOTLARIM İZOLASYON AĞI — [15.5.1]–[15.5.6]');
    console.log('  ekran ' + LISTE + ': ' + (modulVar ? 'var' : 'YOK'));
    console.log('  veri  assets/data/notes.js: ' + (hedef ? (hedef.hata || 'var · ' + hedef.toplam + ' not') : 'YOK'));
    console.log('\nMODÜL YOK — altı senaryonun hiçbiri koşulamadı.');
    console.log('Bu sonuç YEŞİL DEĞİLDİR ([22.0.11]): eksen yazıldı, modül gelince koşacak.');
    process.exit(1);
  }

  const browser = await chromium.launch();
  const ctx = await browser.newContext({ viewport:{ width:1440, height:900 } });

  /* Kimler denenecek: hepsi hedef notun SAHİBİ OLMAYAN kimlikler.
     ⚠️ İlk yazımda superadmin satırları `emp:'EMP-001'` sabitiyle koşuyordu ve
     hedef not "gövdesi en uzun" diye seçildiği için çoğu zaman EMP-001'e ait
     çıkıyordu: eksen, sahibinin kendi notunu görmesini SIZINTI sayıyordu.
     İki ajan bağımsız olarak aynı yanlış pozitifi bildirdi. Kimlik artık
     hedeften TÜRETİLİR; sahibiyle çakışırsa vaka atlanır, sessizce geçmez
     (L-26: araç ölçemediğini ne yeşile ne kırmızıya yazar). */
  const digerEmp = hedef.baskaSahip;
  if (!digerEmp){
    console.log('GEÇERSİZ — veride ikinci bir not sahibi yok, yabancı kimlik kurulamıyor');
    process.exit(2);
  }
  const yabanci = [
    { rol:'sahip',  emp:digerEmp, ad:'sahip (superadmin)' },
    { rol:'sistem', emp:digerEmp, ad:'sistem (superadmin)' },
    { rol:'ik',     emp:digerEmp, ad:'başka kullanıcı' }
  ];

  const arananlar = [hedef.metin, hedef.baslik].filter(x => x && x.length > 6);
  if (!arananlar.length){
    console.log('GEÇERSİZ — hedef notun içeriği çok kısa, sızıntı aranamaz');
    await browser.close(); process.exit(2);
  }
  const sizdiMi = (metin) => arananlar.filter(a => metin.indexOf(a) !== -1);

  /* ---- N1 · N2 — liste ve detay ---- */
  for (const y of yabanci){
    for (const hedefUrl of [LISTE, LISTE + '?id=' + encodeURIComponent(hedef.kod),
                            FORM + '?id=' + encodeURIComponent(hedef.kod)]){
      const page = await ac(ctx, hedefUrl, y.rol, y.emp);
      const eksen = y.rol === 'ik' ? 'N1' : 'N2';
      if (!page.__yuklendi){
        gecersiz.push(eksen + ' [' + y.ad + '] ' + hedefUrl + ' — sayfa yüklenmedi, ölçüm GEÇERSİZ');
        await page.close(); continue;
      }
      const metin = await page.evaluate(GORUNEN).catch(()=>'');
      const s = sizdiMi(metin);
      if (s.length) bulgular.push(eksen + ' [' + y.ad + '] ' + hedefUrl + ' → içerik göründü: "' + s[0] + '"');
      else gecen.push(eksen + ' ' + y.ad + ' · ' + hedefUrl);
      await page.close();
    }
  }

  /* ---- N3 — genel arama ---- */
  for (const y of yabanci){
    const page = await ac(ctx, 'app-panel.html', y.rol, y.emp);
    const sonuc = await page.evaluate((q) => {
      /* Genel arama yüzeyi: shell'in arama kutusu. Yoksa ölçüm ATLANIR,
         "geçti" sayılmaz (L-26: ölçemediğini sessizce yeşile yazma). */
      var el = document.querySelector('#gvGlobalSearch, [data-search], input[type=search]');
      if(!el) return { yok:true };
      el.value = q;
      el.dispatchEvent(new Event('input', { bubbles:true }));
      return new Promise(function(res){
        setTimeout(function(){
          var k = document.body.cloneNode(true);
          Array.prototype.forEach.call(k.querySelectorAll('script,style'), function(n){ n.remove(); });
          res({ metin:k.textContent || '' });
        }, 350);
      });
    }, arananlar[0]).catch(() => ({ hata:true }));

    if (sonuc && sonuc.yok) atlanan.push('N3 [' + y.ad + '] genel arama kutusu bulunamadı — ölçülemedi');
    else if (sonuc && sonuc.hata) atlanan.push('N3 [' + y.ad + '] arama denenemedi');
    else {
      const s = sizdiMi(sonuc.metin || '');
      if (s.length) bulgular.push('N3 [' + y.ad + '] genel arama not içeriğini buldu: "' + s[0] + '"');
      else gecen.push('N3 ' + y.ad);
    }
    await page.close();
  }

  /* ---- N4 · N5 — audit defteri, rapor defteri, export yüzeyi (statik) ---- */
  const veriDosyalari = fs.readdirSync(path.join(ROOT, 'assets/data'))
    .filter(f => /\.js$/.test(f) && f !== 'notes.js');
  for (const f of veriDosyalari){
    const src = fs.readFileSync(path.join(ROOT, 'assets/data', f), 'utf8');
    const s = arananlar.filter(a => src.indexOf(a) !== -1);
    if (s.length) bulgular.push('N4/N5 not metni ' + f + ' içinde geçiyor: "' + s[0] + '"');
  }
  gecen.push('N4/N5 ' + veriDosyalari.length + ' veri dosyası tarandı');

  /* Not metni çalışma zamanında audit defterine düşüyor mu — modül ekranında
     bir not kaydedip `DB.activities`'e bakmak gerekir; bu eksen ekranı
     otomatik doldurmaz, o yüzden defterin BAŞLANGIÇ hâli ölçülür ve
     "değişmedi" iddiası edilmez. */
  {
    const page = await ac(ctx, LISTE, 'sahip', 'EMP-001');
    const izler = await page.evaluate((qs) => {
      var out = [];
      function tara(ad, list){
        (list || []).forEach(function(x){
          var s = JSON.stringify(x);
          qs.forEach(function(q){ if(s.indexOf(q) !== -1) out.push(ad); });
        });
      }
      if(window.DB){ tara('DB.activities', DB.activities); tara('DB.logs', DB.logs);
                     tara('DB.reportRegistry', DB.reportRegistry); }
      return out;
    }, arananlar).catch(() => null);
    if (izler == null) atlanan.push('N4 audit defteri okunamadı');
    else if (izler.length) bulgular.push('N4 not metni ' + [...new Set(izler)].join(' · ') + ' içinde');
    else gecen.push('N4 audit/log/registry defterlerinde iz yok');
    await page.close();
  }

  /* ---- N6 — sahiplik oturumdan atanır ---- */
  {
    const page = await ac(ctx, FORM, 'ik', hedef.baskaSahip || 'EMP-002');
    const r = await page.evaluate(() => {
      if(!window.GV || !GV.notes || typeof GV.notes.olustur !== 'function') return { yok:true };
      try {
        var n = GV.notes.olustur({ title:'eksen', body:'eksen', owner:'EMP-001', owner_user_id:'EMP-001' });
        return { owner:(n && (n.owner || n.owner_user_id)) || null, oturum:(GV.session||{}).emp || null };
      } catch(e){ return { hata:String(e.message || e) }; }
    }).catch(() => ({ hata:'değerlendirilemedi' }));
    if (r && r.yok) atlanan.push('N6 GV.notes.olustur yok — sahiplik kuralı ölçülemedi');
    else if (r && r.hata) atlanan.push('N6 ' + r.hata);
    else if (r.owner !== r.oturum) bulgular.push('N6 sahiplik veriden geldi: owner=' + r.owner + ' · oturum=' + r.oturum);
    else gecen.push('N6 sahiplik oturumdan atandı (' + r.owner + ')');
    await page.close();
  }

  await browser.close();

  console.log('NOTLARIM İZOLASYON AĞI — [15.5.1]–[15.5.6]');
  console.log('hedef not: ' + hedef.kod + ' · sahibi ' + hedef.sahip + ' · toplam ' + hedef.toplam + ' not');
  console.log('denenen kimlik: ' + yabanci.length + ' · aranan dizge: ' + arananlar.length);
  console.log('geçen kontrol: ' + gecen.length);
  if (gecersiz.length){
    console.log('\n=== GEÇERSİZ ÖLÇÜM (sayfa yüklenmedi) ===');
    gecersiz.forEach(a => console.log('  ! ' + a));
  }
  if (atlanan.length){
    console.log('\n=== ÖLÇÜLEMEYEN (yeşil DEĞİL, ayrı sayaçta) ===');
    atlanan.forEach(a => console.log('  ? ' + a));
  }
  if (bulgular.length){
    console.log('\n=== SIZINTI ===');
    bulgular.forEach(b => console.log('  ✘ ' + b));
    console.log('\nEKSİK — ' + bulgular.length + ' sızıntı');
    process.exit(1);
  }
  if (gecersiz.length){
    console.log('\nGEÇERSİZ — ' + gecersiz.length + ' vaka yüklenmemiş sayfada ölçüldü; sunucuyu kontrol edip yeniden koş');
    process.exit(2);
  }
  if (atlanan.length){
    console.log('\nKISMİ — sızıntı yok ama ' + atlanan.length + ' kontrol ölçülemedi');
    process.exit(1);
  }
  console.log('\nTEMİZ — altı senaryonun altısında da içerik sahibi dışına sızmadı');
  console.log('⚠️ Bu bir GÜVENLİK KANITI DEĞİLDİR: owner süzgeci istemcide, veri tarayıcıda tam yüklü.');
  process.exit(0);
})();
