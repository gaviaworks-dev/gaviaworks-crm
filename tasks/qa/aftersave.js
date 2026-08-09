#!/usr/bin/env node
/* aftersave.js — KAYIT SONRASI YÖNLENDİRME EKSENİ (şartname [3.1.16] · paket P2-02)
 *
 * Ne ölçer:
 *   E1  Her form ekranı kaydettikten sonra `GV.afterSave` çağırıyor mu?
 *   E2  Kaydetme yolunda ÇIPLAK `location.href = 'app-*.html'` kaldı mı?
 *       (ortak yordamı çağırıp yanında eski düşüşü de tutan form, kararı
 *        iki yerde veriyor demektir — biri diğerinden sessizce ayrılır)
 *   E3  `detay:` ile verilen dosya diskte VAR mı ve `shell.js` BUILT'inde mi?
 *   E4  Detay ekranı OLAN form `detay:` veriyor mu? (vermezse kullanıcı
 *       detayı olan bir kaydın listesine düşer — [3.1.16] tam bunu yasaklıyor)
 *   E5  Detay ekranı OLMAYAN form `detay:` vermiyor mu? (verirse yayında
 *       olmayan bir dosyaya işaret eder; `ekranAcilabilir` onu listeye
 *       düşürür ama kayıt yanlış niyeti belgeler)
 *   E6  `liste:` her formda var mı? (yedek hedef yoksa yönlendirme hiç olmaz)
 *
 * Neden STATİK: karar `kaydet()` içinde, kullanıcı gerçekten kaydettikten
 * sonra veriliyor. Çalışma zamanı ölçümü 38 formda geçerli veri girip
 * kaydetmeyi gerektirir ve mutasyon bırakır; bu eksen sözleşmenin KURULU
 * olduğunu ölçer, `mut.js`/`act.js` davranışı ölçer.
 *
 * L-39 gereği `--selftest` ile BOZULMUŞ kopyada sınanır: ekseni koşmadan
 * önce her hükmün kendi hata sınıfını gerçekten yakaladığı kanıtlanır.
 */
const fs = require('fs');
const path = require('path');
const { repoRoot, allScreens } = require('./qa-lib');

const ROOT = repoRoot();

/* Form ekranları — diskten değil, BUILT'ten (L-24: hedef listesi tek kaynak). */
function formScreens(built) {
  return built.filter(f => /-form\.html$/.test(f));
}

/* `kaydet()` gövdesi değil, TÜM inline script taranır: kaydetme yolu bazı
   formlarda yardımcı yordamlara bölünmüş (`kaydetVeCik`, `uygula`). Gövdeyi
   ayıklamaya çalışan bir kalıp o formlarda sessizce boş dönerdi (L-27). */
function scriptOf(src) {
  const out = [];
  const re = /<script(?![^>]*\ssrc=)[^>]*>([\s\S]*?)<\/script>/gi;
  let m;
  while ((m = re.exec(src))) out.push(m[1]);
  return out.join('\n');
}

/* Blok ve satır yorumlarını at — yorumda geçen `location.href` bulgu değildir. */
function stripComments(js) {
  return js.replace(/\/\*[\s\S]*?\*\//g, '').replace(/(^|[^:])\/\/[^\n]*/g, '$1');
}

function scan(root) {
  const built = allScreensOf(root);
  const forms = formScreens(built);
  if (!forms.length) throw new Error('aftersave: BUILT içinde form ekranı bulunamadı — ölçüm düzeneği kurulamadı');

  const bulgular = [];
  const olculen = { form: 0, afterSave: 0, detay: 0, liste: 0 };

  for (const f of forms) {
    const p = path.join(root, f);
    if (!fs.existsSync(p)) { bulgular.push({ f, e: 'E0', msg: 'BUILT kaydı var, dosya diskte yok' }); continue; }
    olculen.form++;
    const js = stripComments(scriptOf(fs.readFileSync(p, 'utf8')));

    const cagri = /GV\.afterSave\s*\(/.test(js);
    if (cagri) olculen.afterSave++;
    else bulgular.push({ f, e: 'E1', msg: 'GV.afterSave çağrılmıyor — kayıt sonrası hâlâ listeye dönülüyor' });

    /* E2 — çıplak düşüş. `location.href` ataması yalnız app-*.html hedefine
       bakılır; `index.html` (oturum düşüşü) ve dış bağlantı kapsam dışı.
       ⚠️ FORMUN KENDİ DOSYASI HARİÇ. `app-odemeplani-form.html` sözleşme
       seçilmeden açıldığında kendine `?sozlesme=…` ile yeniden giriyor; bu bir
       kaydetme çıkışı değil, bağlam seçimi. İlk hâlinde eksen bunu ihlal
       saydı ve **sağlıklı bir davranışı kırmızıya yazdı** (ders L-26: yeni bir
       hüküm yazarken sorulacak soru "bu hangi sağlıklı davranışı ihlal
       gösterir"). Kendine yönlendirme tanımı gereği kayıt sonrası iniş
       noktası olamaz — hüküm bu kadar daraltıldı, daha fazlası değil. */
    const ciplak = [...js.matchAll(/location\.href\s*=\s*['"](app-[\w-]+\.html)[^'"]*['"]/g)]
      .map(m => m[1]).filter(h => h !== f);
    if (ciplak.length) {
      bulgular.push({ f, e: 'E2', msg: 'kaydetme yolunda çıplak yönlendirme: ' + [...new Set(ciplak)].join(' · ') });
    }

    /* Anahtarın VARLIĞI ile değerinin DİZE SABİTİ olması ayrı ölçülür: hedefi
       bir değişkende tutan form (`liste:LISTE`) sözleşmeyi kurmuştur, yalnız
       dosya adı statik olarak doğrulanamaz. Eksen bunu ihlal saymaz —
       ölçemediğini sessizce kırmızıya yazmaz (L-26), doğrulamayı atlar. */
    const detayVarmi = /GV\.afterSave\s*\(\s*\{[\s\S]{0,600}?\bdetay\s*:/.test(js);
    const listeVarmi = /GV\.afterSave\s*\(\s*\{[\s\S]{0,600}?\bliste\s*:/.test(js);
    const detayM = /GV\.afterSave\s*\(\s*\{[\s\S]{0,600}?detay\s*:\s*['"]([\w-]+\.html)['"]/.exec(js);
    const listeM = /GV\.afterSave\s*\(\s*\{[\s\S]{0,600}?liste\s*:\s*['"]([\w-]+\.html)['"]/.exec(js);
    const beklenenDetay = f.replace(/-form\.html$/, '-detay.html');
    const detayVar = built.indexOf(beklenenDetay) !== -1 && fs.existsSync(path.join(root, beklenenDetay));

    if (detayVarmi) {
      olculen.detay++;
      if (detayM) {
        const hedef = detayM[1];
        if (!fs.existsSync(path.join(root, hedef))) bulgular.push({ f, e: 'E3', msg: 'detay hedefi diskte yok: ' + hedef });
        else if (built.indexOf(hedef) === -1) bulgular.push({ f, e: 'E3', msg: 'detay hedefi BUILT listesinde yok: ' + hedef });
        if (!detayVar) bulgular.push({ f, e: 'E5', msg: 'detay ekranı olmayan forma detay hedefi verilmiş: ' + hedef });
      }
    } else if (cagri && detayVar) {
      bulgular.push({ f, e: 'E4', msg: 'detay ekranı var (' + beklenenDetay + ') ama afterSave çağrısında detay verilmemiş' });
    }

    if (listeVarmi) olculen.liste++;
    else if (cagri) bulgular.push({ f, e: 'E6', msg: 'afterSave çağrısında liste hedefi yok — yedek yol kurulmamış' });
  }
  return { bulgular, olculen, forms };
}

/* allScreens() kökü qa-lib'ten okur; selftest bozuk KOPYADA koştuğu için
   kökü parametreleştiren bir sarmalayıcı gerekiyor (L-35: script kendi
   okuduğu kaynağı içine gömmez). */
function allScreensOf(root) {
  const src = fs.readFileSync(path.join(root, 'assets/js/shell.js'), 'utf8');
  const blk = src.match(/var BUILT\s*=\s*\[([\s\S]*?)\]/);
  if (!blk) throw new Error('aftersave: shell.js içinde BUILT dizisi yok');
  const files = [...blk[1].matchAll(/'(app-[\w-]+\.html)'/g)].map(m => m[1]);
  if (!files.length) throw new Error('aftersave: BUILT boş döndü');
  return [...new Set(files)];
}

/* ------------------------------------------------------------------ */
/* SELFTEST — bozulmuş kopyada her hükmün bulgu ürettiği kanıtlanır.    */
/* ------------------------------------------------------------------ */
function selftest() {
  const os = require('os');
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'gv-aftersave-'));
  const kopya = path.join(tmp, 'repo');
  fs.mkdirSync(path.join(kopya, 'assets/js'), { recursive: true });
  fs.copyFileSync(path.join(ROOT, 'assets/js/shell.js'), path.join(kopya, 'assets/js/shell.js'));

  const built = allScreensOf(ROOT);
  const forms = formScreens(built);
  /* Bozulacak vakalar — her biri farklı bir hüküm için. */
  const detaylı = forms.filter(f => built.indexOf(f.replace(/-form\.html$/, '-detay.html')) !== -1);
  const detaysız = forms.filter(f => built.indexOf(f.replace(/-form\.html$/, '-detay.html')) === -1);
  if (detaylı.length < 4 || !detaysız.length) throw new Error('aftersave selftest: yeterli vaka yok');

  /* Tüm ekranları kopyala (detay hedeflerinin varlığı ölçülüyor) */
  for (const f of built) {
    const s = path.join(ROOT, f);
    if (fs.existsSync(s)) fs.copyFileSync(s, path.join(kopya, f));
  }

  const yaz = (f, js) => fs.writeFileSync(path.join(kopya, f), '<body><script>' + js + '</script></body>');
  const beklenen = [];

  yaz(detaylı[0], 'function kaydet(){ location.href = "' + detaylı[0].replace('-form','') + '"; }');
  beklenen.push({ f: detaylı[0], e: 'E1' }, { f: detaylı[0], e: 'E2' });

  yaz(detaylı[1], 'GV.afterSave({ kod:k, detay:"app-hayalet-detay.html", liste:"app-x.html" });');
  beklenen.push({ f: detaylı[1], e: 'E3' });

  /* E5 — detay ekranı OLMAYAN forma detay hedefi verilmiş. Hedefin kendisi
     gerçek bir dosya (E3 tetiklenmesin), yanlış olan onu VERMİŞ olmak. */
  yaz(detaysız[0], 'GV.afterSave({ kod:k, detay:"' + detaylı[0].replace(/-form\.html$/, '-detay.html') + '", liste:"app-x.html" });');
  beklenen.push({ f: detaysız[0], e: 'E5' });

  yaz(detaylı[2], 'GV.afterSave({ kod:k, liste:"app-x.html" });');
  beklenen.push({ f: detaylı[2], e: 'E4' });

  yaz(detaylı[3], 'GV.afterSave({ kod:k, detay:"' + detaylı[3].replace(/-form\.html$/, '-detay.html') + '" });');
  beklenen.push({ f: detaylı[3], e: 'E6' });

  const r = scan(kopya);
  const bulundu = new Set(r.bulgular.map(b => b.f + '|' + b.e));
  let kalan = 0;
  console.log('SELFTEST — bozulmuş kopyada beklenen bulgular:');
  for (const b of beklenen) {
    const ok = bulundu.has(b.f + '|' + b.e);
    console.log('  ' + (ok ? '✔' : '✘') + ' ' + b.e + ' · ' + b.f);
    if (!ok) kalan++;
  }
  fs.rmSync(tmp, { recursive: true, force: true });
  if (kalan) { console.log('\nSELFTEST KALDI — ' + kalan + ' hüküm kendi hata sınıfını yakalamadı'); process.exit(2); }
  console.log('\nSELFTEST GEÇTİ — ' + beklenen.length + ' hükmün ' + beklenen.length + "'i bulgu üretti");
}

/* ------------------------------------------------------------------ */
if (process.argv.indexOf('--selftest') !== -1) { selftest(); process.exit(0); }

const r = scan(ROOT);
if (!r.olculen.form) { console.log('GEÇERSİZ — 0 form ölçüldü'); process.exit(2); }

console.log('kayıt sonrası yönlendirme ([3.1.16]) — ölçülen form: ' + r.olculen.form +
            ' · GV.afterSave çağıran: ' + r.olculen.afterSave +
            ' · detay hedefi veren: ' + r.olculen.detay +
            ' · liste hedefi veren: ' + r.olculen.liste);

if (!r.bulgular.length) {
  console.log('\nTEMİZ — ' + r.olculen.form + ' formun tamamı kaydettikten sonra ortak yordamdan geçiyor');
  process.exit(0);
}
const grup = {};
for (const b of r.bulgular) (grup[b.e] = grup[b.e] || []).push(b);
for (const e of Object.keys(grup).sort()) {
  console.log('\n' + e + ' — ' + grup[e].length + ' bulgu');
  for (const b of grup[e]) console.log('  · ' + b.f + ' — ' + b.msg);
}
console.log('\nEKSİK — ' + r.bulgular.length + ' bulgu / ' + r.olculen.form + ' form');
process.exit(1);
