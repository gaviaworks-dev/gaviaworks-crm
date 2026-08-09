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

/* Kaynak adres ve repo kökü ENV'den geçersiz kılınabilir (ders L-35: script
   neye baktığını içine gömmez). L-39 sınaması bozulmuş bir KOPYAYI ayrı portta
   sunup bu ekseni ona koşturur; repo değişmeden hükmün bulgu ürettiği kanıtlanır. */
const BASE = process.env.GV_BASE || 'http://127.0.0.1:8791/';
const ROLE = 'sahip';
const url = (t) => BASE + t + (t.indexOf('?') === -1 ? '?' : '&') + 'role=' + ROLE;

/* ---- ui.js yaması: GV.list dönüşüne __probe ekle (yalnız bellekte) ---- */
const UI_SRC = fs.readFileSync(path.join(LIB.repoRoot(), 'assets/js/ui.js'), 'utf8');
/* Dönüş bloğu TEK parça olarak yakalanır — üye eklendikçe çapa kaymasın diye
   regex kullanılır. ⚠️ L-24: ilk sürüm iki ayrı metin çapası kullanıyordu;
   `ui.js` dönüşüne `exportRows` eklenince ikinci çapa tutmadı ve script hata
   VERMEDEN 141 ekran tarayıp "0 kolon, temiz" dedi. Çapa kaybolursa ARAÇ DURUR. */
const RET = /(    return \{\n      state:state,\n      refresh:render,)([\s\S]*?\n    \};)/;
const m = UI_SRC.match(RET);
if (!m) throw new Error('xport: ui.js içinde GV.list dönüş bloğu bulunamadı — yama kurulamıyor');

const PROBE = `    var __gvApi = {
      __probe:function(){
        var cols = visibleCols();
        var rows = source();
        return {
          id: cfg.id || cfg.mount || '?',
          rows: rows.length,
          cols: cols.map(function(c){
            var out = { key:c.key, label:c.label, exportable:c.exportable !== false,
                        hasRender:!!c.render, hasExportValue:!!c.exportValue,
                        n:0, ekranDolu:0, ciktiDolu:0, bosCikan:0, ornek:'', metinler:[] };
            rows.forEach(function(r,i){
              var scr = '', exp = '';
              try { scr = c.render ? String(c.render(r,i)) : (r[c.key] == null ? '' : String(r[c.key])); } catch(e){ scr = ''; }
              /* ÜRÜNÜ ÖLÇ, KOPYASINI DEĞİL. Bu satır eskiden çıktı kuralını
                 kendi içinde tekrarlıyordu; kural ürün tarafında bozulduğunda
                 eksen yine TEMİZ diyordu. Artık liste örneğinin dönüş
                 yüzeyindeki exportCell çağrılır. Yoksa ARAÇ DURUR (L-27). */
              try { exp = exportCell(c, r, i); } catch(e){ exp = null; }
              /* UYARI: bu blok bir JS ŞABLON DİZESİ içinde yaşıyor. Ters bölü +
                 s tek yazılırsa Node kaçışı yer, tarayıcıya s+ deseni gider ve
                 ölçüm metninden HARF SİLER (Zimmetsiz -> Zimmet iz). Ters bölü
                 ÇİFT yazılır. Şablon dizesinin içine ters tırnak da konmaz:
                 dizeyi oracıkta kapatır (L-37'nin şablon tarafındaki ikizi). */
              scr = scr.replace(/<[^>]*>/g,' ').replace(/&nbsp;/g,' ').replace(/\\s+/g,' ').trim();
              exp = exp == null ? '' : String(exp).replace(/<[^>]*>/g,' ').replace(/\\s+/g,' ').trim();
              if(scr === '\u2014') scr = '';
              if(exp === '\u2014') exp = '';
              out.n++;
              if(scr) out.ekranDolu++;
              if(exp) out.ciktiDolu++;
              if(scr && !exp){
                out.bosCikan++;
                if(!out.ornek) out.ornek = scr.slice(0,40);
                /* Ekranda g\u00f6r\u00fcnen metinlerin K\u00dcMES\u0130 tutulur: h\u00fck\u00fcm a\u015fa\u011f\u0131da
                   "hep ayn\u0131 c\u00fcmle mi, kayda g\u00f6re de\u011fi\u015fiyor mu" diye sorar. */
                if(out.metinler.indexOf(scr) === -1 && out.metinler.length < 8) out.metinler.push(scr);
              }
            });
            return out;
          })
        };
      },
      state:state,
      refresh:render,`;

const PATCHED = UI_SRC.replace(RET, PROBE + '$2' + `
    (window.__gvLists = window.__gvLists || []).push(__gvApi);
    return __gvApi;`);
if (PATCHED.indexOf('__gvLists') === -1) throw new Error('xport: yama uygulanmadı — ölçüm geçersiz olurdu');
/* Ölçüm sözleşmesi: probe ürünün `exportCell`ini çağırır. Yordam yoksa ölçüm
   sessizce yanlış yere bakardı — araç susmaz, DURUR (L-27). */
if (UI_SRC.indexOf('function exportCell(') === -1)
  throw new Error('xport: ui.js içinde exportCell yordamı yok — çıktı değeri ürün tarafından okunamıyor');

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

    const bad = [], partial = [], tutucu = [];
    let n = 0, y = 0, kayit = 0;
    for (const p of probes) {
      kayit += p.rows;
      for (const c of p.cols) {
        if (!c.exportable) continue;
        kolonTop++;
        n += c.n;
        if (!c.bosCikan) continue;
        /* ── HÜKMÜN DARALTILMASI (ders L-26 · L-28) ───────────────────────
           İlk sürüm "ekranda dolu, çıktıda boş" olan HER hücreyi ihlal saydı
           ve 22 ekranı kirli gösterdi. Ölçüldüğünde 24 kolonun 24'ü de aynı
           sınıf çıktı: ekran, DEĞERİN YOKLUĞUNU anlatan sabit bir cümle
           basıyor ("Zimmetsiz" · "Vekil yok" · "Süresiz" · "Proje dışı").
           Boş hücre bunun dosyadaki doğru karşılığıdır — şartname [14.6.1]
           aynı KAYIT KÜMESİNİ ve TOPLAMLARI istiyor, aynı yer tutucu
           cümlesini değil; üstelik "Zimmetsiz" yazmak sayısal kolonu metne
           çevirip süzmeyi bozardı.

           Ayırt edici mekanik hüküm: çıktısı boş kalan satırların EKRAN
           METNİ hep aynıysa bu bir yer tutucudur (yokluğun tek bir dili
           vardır). Kayda göre DEĞİŞİYORSA ekran gerçek bir veri gösteriyor
           ve çıktı onu kaybediyor demektir — ihlal budur.
           Daraltmanın kendisi de sınandı (L-39): `ui.js`'in ekran-metni
           yedeği bozulmuş bir KOPYADA koşturulunca, kayda göre değişen sekiz
           kolon daraltmadan SONRA da bulgu olarak döndü. Yani hüküm
           zayıflatılmadı, yalnız yer tutucu sınıfı ayrıldı. */
        const yerTutucu = c.metinler.length === 1;
        if (yerTutucu) { tutucu.push(c); continue; }
        y += c.bosCikan;
        if (c.bosCikan === c.ekranDolu && c.ekranDolu > 0) bad.push(c);
        else partial.push(c);
      }
    }
    hucreTop += n; hucreYalan += y;
    screens.push({ t, kayit, listCount: probes.length, hucre: n, yalan: y, bad, partial, tutucu });
  }

  await browser.close();

  const kirli = screens.filter(s => s.bad.length || s.partial.length);
  if (kirli.length) {
    console.log('\n=== ÇIKTI TAŞIMAYAN KOLONLAR ===');
    for (const s of kirli.sort((a, b) => b.bad.length - a.bad.length)) {
      console.log(`\n${s.t}  (${s.kayit} kayıt)`);
      for (const c of s.bad)
        console.log(`  🔴 ${c.key.padEnd(18)} "${c.label}" — ekranda ${c.ekranDolu}/${c.n} dolu, çıktıda 0 · ${c.metinler.length} farklı metin · örn: ${c.ornek}`);
      for (const c of s.partial)
        console.log(`  ⚠  ${c.key.padEnd(18)} "${c.label}" — ${c.bosCikan}/${c.n} kayıtta çıktı boş · ${c.metinler.length} farklı metin · örn: ${c.metinler.slice(0,3).join(' / ')}`);
    }
  }

  /* Yer tutucular AYRI SAYAÇTA raporlanır — sessizce yeşile yazılmaz (L-26). */
  const tutucuTop = screens.reduce((a, s) => a + s.tutucu.length, 0);
  if (tutucuTop) {
    console.log('\n=== BOŞ-DURUM YER TUTUCULARI (ihlal değil, ayrı sayaçta) ===');
    for (const s of screens.filter(x => x.tutucu.length))
      for (const c of s.tutucu)
        console.log(`  ·  ${s.t} → ${c.key} "${c.label}" — ${c.bosCikan}/${c.n} kayıtta ekran "${c.metinler[0]}" diyor, dosyada hücre boş`);
  }

  console.log('\n=== ÖZET ===');
  console.log(`Taranan ekran: ${list.length} · GV.list kuran ekran: ${listli} · yüklenen kayıt: ${screens.reduce((a, s) => a + s.kayit, 0)}`);
  console.log(`Boş-durum yer tutucusu (ihlal değil): ${tutucuTop} kolon`);
  /* Sıfır liste ya da sıfır kolon = ölçüm YAPILMADI demektir, "temiz" demek değil (L-24). */
  if (!listli || !kolonTop) {
    console.log('\nGEÇERSİZ — hiçbir GV.list örneği ölçülemedi; yama ya da hedef listesi bozuk');
    process.exit(2);
  }
  console.log(`Çıktıya giren kolon: ${kolonTop} · ölçülen hücre: ${hucreTop}`);
  console.log(`Ekranda dolu ama çıktıda boş hücre: ${hucreYalan} (%${(hucreYalan / (hucreTop || 1) * 100).toFixed(1)})`);
  console.log(`Tamamen taşımayan kolon: ${screens.reduce((a, s) => a + s.bad.length, 0)} · kısmi: ${screens.reduce((a, s) => a + s.partial.length, 0)}`);
  console.log(kirli.length
    ? `\nEKSİK — ${kirli.length} ekranda kolon tanımı çıktıyı beslemiyor`
    : `\nTEMİZ — ${kolonTop} kolonun tamamı çıktıya değer taşıyor`);
  process.exit(0);
})();
