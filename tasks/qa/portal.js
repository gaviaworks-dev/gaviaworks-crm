/* portal.js — MÜŞTERİ PORTALI SIZINTI TARAMASI (REVİZE 13)
 * ─────────────────────────────────────────────────────────────────────────
 * Soru tek: **müşteri oturumu açan biri, başka bir müşterinin kaydını
 * herhangi bir ekranda görebiliyor mu?**
 *
 * Neden ayrı bir eksen: `gate.js` konsol hatası ve 403 sayar, `qa.js` taşma
 * ve kırılım ölçer, `canon.js` veriye bakar — hiçbiri "ekranda YABANCI bir
 * müşterinin adı yazıyor mu" diye sormuyor. Bu sınıf tam olarak sessizdir:
 * ekran açılır, konsol temizdir, sayı vardır ve YANLIŞ KİŞİYE aittir.
 * `DB.permMatrix.musteri.gor` beş oturum boyunca `'kendi'` yazıyordu; o
 * personel eksenidir ve müşteri oturumunda karşılığı yoktur, yani `GV.list`in
 * müşteri dalı hiç çalışmadı ve ekranlar koleksiyonun tamamını bastı.
 *
 * Ölçüm yöntemi:
 *   1. Veri okunur (kök `qa-lib.repoRoot()`ten — L-35: araç kendi kaynağını
 *      gömmez, `GV_REPO` ile bozulmuş kopyaya çevrilebilir).
 *   2. Oturumun müşterisi seçilir (giriş ekranının varsayılanı: ilk aktif
 *      `DB.contacts` kaydı).
 *   3. YABANCI İZ kümesi kurulur: başka müşterilerin kodu · unvanı · kısa adı ·
 *      proje kodu ve adı · talep kodu · sözleşme kodu · fatura kodu · paket
 *      kodu · yetkili adı. Kendi müşterisinin izleri kümeye GİRMEZ.
 *   4. Her ekran `?role=musteri` ile açılır, `.gv-page` metni okunur ve
 *      yabancı iz aranır. 403 basan ekran temizdir (zaten kapalı).
 *   5. Ayrıca DOĞRUDAN ADRES kapısı sınanır: yabancı bir talebin / projenin
 *      detayı `?id=` ile açılır — kayıt sahipliği kontrolü yoksa sızar.
 *
 * Sıfır ölçüm TEMİZ SAYILMAZ (L-19 · L-27): taranan ekran, ölçülen iz ve
 * gerçekten yüklenen kayıt sayısı ayrı ayrı raporlanır; düzenek kurulamazsa
 * script `throw` eder ve hata koduyla biter.
 *
 * Kullanım: node portal.js [ekran1,ekran2,...]
 */
const { chromium } = require('playwright');
const fs = require('fs'), vm = require('vm'), path = require('path');
const LIB = require('./qa-lib');
const ROOT = LIB.repoRoot();
const B = LIB.BASE || 'http://127.0.0.1:8791/';

/* ---------- 1. Veri ---------- */
const ctx = {}; ctx.window = ctx; vm.createContext(ctx);
for (const f of ['org.js', 'crm.js', 'work.js', 'ops.js', 'hr.js', 'misc.js'])
  vm.runInContext(fs.readFileSync(path.join(ROOT, 'assets/data', f), 'utf8'), ctx, { filename: f });
const DB = ctx.window.DB;
if (!DB || !DB.contacts || !DB.customers) throw new Error('portal.js: veri okunamadı — düzenek kurulmadı');

/* ---------- 2. Oturumun müşterisi ---------- */
/* shell.js `buildMusteriSession` argümansız çağrıldığında ilk AKTİF yetkiliyi
   seçer; tarama da aynı kişiyi kullanır ki ölçtüğü oturum gerçek oturum olsun. */
/* İkinci persona ile de koşturulabilir: `GV_KONTAK=YTK-003 node portal.js`.
   Varsayılan oturumun (ilk aktif yetkili) kayıt hacmi düşükse "temiz" sonucu
   yalnız verinin ince olmasından gelebilir — L-19'un "sıfır ölçüm temiz
   sayılmaz" kuralı bu tarama için de geçerlidir; bu yüzden aşağıda ekranlarda
   GERÇEKTEN basılan satır sayısı da raporlanır. */
const kontak = process.env.GV_KONTAK
  ? DB.contacts.filter(c => c.kod === process.env.GV_KONTAK)[0]
  : DB.contacts.filter(c => c.aktif !== false)[0];
if (!kontak) throw new Error('portal.js: aktif müşteri yetkilisi yok — oturum kurulamaz');
const BENIM = kontak.musteri;
const benimMusteri = DB.customers.filter(c => c.kod === BENIM)[0];
if (!benimMusteri) throw new Error('portal.js: oturumun müşterisi çözülemedi: ' + BENIM);

/* ---------- 3. Yabancı iz kümesi ---------- */
const benimProje = DB.projects.filter(p => p.musteri === BENIM).map(p => p.kod);
const izler = [];                                   // { iz, kaynak }
const ekle = (iz, kaynak) => {
  const v = String(iz || '').trim();
  if (v.length < 4) return;                         // kısa metin yanlış eşleşir
  if (!izler.some(x => x.iz === v)) izler.push({ iz: v, kaynak });
};

DB.customers.filter(c => c.kod !== BENIM).forEach(c => {
  ekle(c.kod, 'müşteri kodu');
  ekle(c.unvan, 'müşteri unvanı');
  ekle(c.kisa, 'müşteri kısa adı');
});
DB.projects.filter(p => p.musteri !== BENIM).forEach(p => {
  ekle(p.kod, 'proje kodu'); ekle(p.ad, 'proje adı');
});
DB.tickets.filter(t => t.musteri !== BENIM).forEach(t => ekle(t.kod, 'talep kodu'));
(DB.contracts || []).filter(c => c.musteri !== BENIM).forEach(c => {
  ekle(c.kod, 'sözleşme kodu'); ekle(c.ad, 'sözleşme adı');
});
(DB.invoices || []).filter(i => i.musteri !== BENIM).forEach(i => ekle(i.kod, 'fatura kodu'));
(DB.supportPackages || []).filter(p => p.musteri !== BENIM).forEach(p => ekle(p.kod, 'destek paketi kodu'));
DB.contacts.filter(c => c.musteri !== BENIM).forEach(c => ekle(c.ad, 'müşteri yetkilisi adı'));
if (!izler.length) throw new Error('portal.js: yabancı iz kümesi boş — ölçüm anlamsız olurdu');

/* ---------- 4. Hedefler ---------- */
const screens = process.argv[2] ? process.argv[2].split(',').map(s => s.trim()).filter(Boolean)
                                : LIB.allScreens();
if (!screens.length) throw new Error('portal.js: hedef listesi boş');

/* Doğrudan adres kapısı: YABANCI bir kaydın detayı. */
const yabanciTalep = DB.tickets.filter(t => t.musteri !== BENIM)[0];
const yabanciProje = DB.projects.filter(p => p.musteri !== BENIM)[0];
const dogrudan = [];
if (yabanciTalep) dogrudan.push({ url: 'app-destek-detay.html?id=' + yabanciTalep.kod, kayit: yabanciTalep.kod });
if (yabanciProje) dogrudan.push({ url: 'app-proje-detay.html?id=' + yabanciProje.kod, kayit: yabanciProje.kod });
if (!dogrudan.length) throw new Error('portal.js: yabancı detay hedefi kurulamadı');

(async () => {
  const br = await chromium.launch();
  const c = await br.newContext({ viewport: { width: 1440, height: 950 } });
  const p = await c.newPage();
  const sorun = [];
  let taranan = 0, kapali = 0, acik = 0, olculenIz = 0, konsol = 0, satir = 0, kayitli = 0;
  let cur = '';
  p.on('console', m => { if (m.type() === 'error') { konsol++; sorun.push(`${cur} console: ${m.text().slice(0, 140)}`); } });
  p.on('pageerror', e => { konsol++; sorun.push(`${cur} pageerror: ${String(e).slice(0, 140)}`); });

  /* Oturumu bir kez kur — sonraki gezinmelerde sessionStorage taşır. */
  await p.goto(B + 'app-panel.html?' + (process.env.GV_KONTAK ? 'emp=' + process.env.GV_KONTAK : 'role=musteri'),
    { waitUntil: 'networkidle', timeout: 30000 });
  const oturum = await p.evaluate(() => { try { return JSON.parse(sessionStorage.getItem('gv.session') || 'null'); } catch (e) { return null; } });
  if (!oturum || !oturum.musteri) throw new Error('portal.js: müşteri oturumu kurulamadı — ölçüm GEÇERSİZ');
  if (oturum.emp) throw new Error('portal.js: müşteri oturumu personele düşmüş (emp=' + oturum.emp + ') — ölçüm GEÇERSİZ');
  if (oturum.musteri !== BENIM)
    throw new Error('portal.js: tarayıcıdaki müşteri (' + oturum.musteri + ') veriden seçilenle (' + BENIM + ') uyuşmuyor');

  async function tara(url, etiket) {
    cur = url;
    await p.goto(B + url, { waitUntil: 'networkidle', timeout: 30000 });
    await p.waitForTimeout(260);
    const r = await p.evaluate(() => {
      const page = document.querySelector('.gv-page') || document.body;
      /* Görünen metin okunur; `<script>` düğümleri atılır ki veri dosyasındaki
         diziler metin sanılmasın (L-29'un "doğru yerden oku" dersi). */
      const klon = page.cloneNode(true);
      klon.querySelectorAll('script,style').forEach(n => n.remove());
      return {
        text: (klon.textContent || '').replace(/\s+/g, ' '),
        is403: !!document.querySelector('.gv-state.is-danger'),
        /* Kaç satır GERÇEKTEN basıldı — "temiz" sonucunun boş ekrandan mı
           yoksa doğru süzgeçten mi geldiğini ayırt eden sayı (L-19). */
        satir: document.querySelectorAll('.gtable tbody tr, .gv-kcard, .gv-mrow').length,
        kayit: !!document.querySelector('.gv-rec-code')
      };
    });
    taranan++;
    if (r.is403) { kapali++; return; }
    acik++;
    satir += r.satir;
    if (r.kayit) kayitli++;
    const bulunan = izler.filter(x => r.text.indexOf(x.iz) !== -1);
    olculenIz += izler.length;
    bulunan.forEach(x => sorun.push(`${etiket} SIZINTI · ${x.kaynak}: "${x.iz}"`));
  }

  /* Ekranlar oturum KURULDUKTAN sonra rolsüz açılır: `?role=` her açılışta
     oturumu yeniden kurar ve `GV_KONTAK` personası kaybolurdu. */
  for (const f of screens) await tara(f, f);

  /* Doğrudan adres kapısı — yabancı kaydın detayı açılmamalı. */
  let dogrudanAcik = 0;
  for (const d of dogrudan) {
    cur = d.url;
    await p.goto(B + d.url, { waitUntil: 'networkidle', timeout: 30000 });
    await p.waitForTimeout(260);
    const gorunur = await p.evaluate(kod => {
      const page = document.querySelector('.gv-page') || document.body;
      const klon = page.cloneNode(true);
      klon.querySelectorAll('script,style').forEach(n => n.remove());
      const t = (klon.textContent || '').replace(/\s+/g, ' ');
      const rec = document.querySelector('.gv-rec-code');
      return { kayitBasildi: !!(rec && rec.textContent.indexOf(kod) !== -1), uzunluk: t.length };
    }, d.kayit);
    if (gorunur.kayitBasildi) {
      dogrudanAcik++;
      sorun.push(`DOĞRUDAN ADRES · ${d.url} — yabancı kaydın detayı basıldı (sahiplik kapısı yok)`);
    }
  }

  await br.close();

  console.log('\n=== MÜŞTERİ PORTALI SIZINTI TARAMASI ===');
  console.log('oturum        : ' + oturum.ad + ' (' + oturum.kontak + ') · ' + benimMusteri.unvan + ' (' + BENIM + ')');
  console.log('kendi projesi : ' + (benimProje.length ? benimProje.join(', ') : 'yok'));
  console.log('taranan ekran : ' + taranan + '  (açık ' + acik + ' · 403 ' + kapali + ')');
  console.log('yabancı iz    : ' + izler.length + ' ayrı iz · ' + olculenIz + ' iz×ekran kontrolü');
  console.log('basılan içerik: ' + satir + ' satır/kart · kayıt yüklenen detay ekranı ' + kayitli);
  console.log('doğrudan adres: ' + dogrudan.length + ' yabancı kayıt denendi · açılan ' + dogrudanAcik);
  console.log('konsol hatası : ' + konsol);

  if (acik === 0) { console.log('\nGEÇERSİZ — müşteriye açık tek ekran ölçülemedi (sıfır ölçüm temiz sayılmaz)'); process.exit(2); }
  if (!sorun.length) { console.log('\nTEMİZ — müşteri oturumunda yabancı müşteri izi yok'); process.exit(0); }
  console.log('\nSIZINTI — ' + sorun.length + ' bulgu:');
  sorun.forEach(s => console.log('  ✘ ' + s));
  process.exit(1);
})().catch(e => { console.error('\nGEÇERSİZ — ' + e.message); process.exit(2); });
