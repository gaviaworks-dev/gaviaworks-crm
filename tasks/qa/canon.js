/* GaviaWorks CRM — birleşik canonical tarayıcı
   Önceki oturumun canon2 / canon3 / ref script'lerinin yerini alır, üstüne
   destek modülünün (SLA · bakım paketi · memnuniyet anketi) kontrollerini ekler.
   Kullanım: node canon.js */
const fs = require('fs'), vm = require('vm');
const R = '/Users/gaviaworks/Developer/Projects/gaviaworks-crm/assets/data/';
const ctx = {}; ctx.window = ctx; vm.createContext(ctx);
for (const f of ['org.js', 'crm.js', 'work.js', 'ops.js', 'hr.js', 'misc.js'])
  vm.runInContext(fs.readFileSync(R + f, 'utf8'), ctx, { filename: f });
const DB = ctx.window.DB;

let bad = 0, checks = 0;
const say = (ok, msg) => { checks++; if (!ok) { bad++; console.log('  ✘ ' + msg); } };
const head = t => console.log('\n' + t);
const money = n => (n || 0).toLocaleString('tr-TR');

/* ---------- 1. Müşteri kartı ↔ işlem verisi (eski canon2) ---------- */
head('1) Müşteri kartı ↔ işlem verisi');
DB.customers.forEach(c => {
  // Tahsil edilmiş kayıt durumu 'Ödendi'dir; bekleyen = onun dışındakiler.
  const bekleyen = DB.payments
    .filter(p => p.musteri === c.kod && p.durum !== 'Ödendi')
    .reduce((s, p) => s + p.tutar, 0);
  say(bekleyen === c.bekleyenTahsilat,
      c.kod + ' bekleyenTahsilat kart=' + money(c.bekleyenTahsilat) + ' tahsilat=' + money(bekleyen));

  // 'Teslim' aşaması bitmiş proje sayılır; projeSayisi ömür boyu sayaçtır (handoff §1.4).
  const aktif = DB.projects.filter(p => p.musteri === c.kod &&
    ['Teslim', 'Tamamlandı', 'İptal', 'Askıda'].indexOf(p.durum) === -1).length;
  say(aktif === c.aktifProje, c.kod + ' aktifProje kart=' + c.aktifProje + ' proje=' + aktif);
});

/* ---------- 2. Fatura ↔ tahsilat (eski canon3) ---------- */
head('2) Fatura ↔ tahsilat');
DB.invoices.filter(i => i.durum !== 'Ödendi' && i.durum !== 'İptal').forEach(i => {
  const p = DB.payments.find(p => p.fatura === i.kod);
  say(!!p, i.kod + ' ödenmemiş faturanın tahsilat kaydı yok');
  if (p) {
    say(p.tutar === i.toplam, i.kod + ' fatura toplam=' + money(i.toplam) + ' tahsilat=' + money(p.tutar));
    say(p.musteri === i.musteri, i.kod + ' müşteri eşleşmiyor');
    say(p.vade === i.vade, i.kod + ' vade fatura=' + i.vade + ' tahsilat=' + p.vade);
  }
});
DB.payments.forEach(p => {
  const i = DB.invoices.find(i => i.kod === p.fatura);
  say(!!i, p.kod + ' tahsilatının faturası (' + p.fatura + ') yok');
  if (i) say(i.musteriAd === p.musteriAd, p.kod + ' müşteri adı fatura ile uyuşmuyor');
});

/* ---------- 3. Komisyon ↔ yönlendiren (eski ref) ---------- */
head('3) Komisyon ↔ yönlendiren');
DB.referrers.forEach(r => {
  const k = DB.commissions.filter(k => k.referans === r.kod);
  const hakedis = k.reduce((s, x) => s + x.tutar, 0);
  const odenen = k.filter(x => x.durum === 'Ödendi').reduce((s, x) => s + x.tutar, 0);
  say(hakedis === r.hakedis, r.kod + ' hakedis kart=' + money(r.hakedis) + ' komisyon=' + money(hakedis));
  say(odenen === r.odenen, r.kod + ' odenen kart=' + money(r.odenen) + ' komisyon=' + money(odenen));
  say(r.bekleyen === r.hakedis - r.odenen, r.kod + ' bekleyen ≠ hakedis - odenen');
});
DB.commissions.forEach(k => {
  const c = DB.customers.find(c => c.kod === k.musteri);
  say(!!c, k.kod + ' müşterisi yok');
  if (c) {
    say(c.unvan === k.firma, k.kod + ' firma="' + k.firma + '" müşteri unvan="' + c.unvan + '"');
    say(c.referans === k.referans, k.kod + ' müşterinin referansı=' + c.referans + ' komisyon=' + k.referans);
  }
});

/* ---------- 4. Destek: SLA politikası ↔ talep ---------- */
head('4) SLA politikası ↔ destek talebi');
DB.tickets.forEach(t => {
  const p = DB.slaPolicies.find(p => p.kategori === t.kategori &&
    (p.oncelik === t.oncelik || p.oncelik === 'Tümü'));
  say(!!p, t.kod + ' (' + t.kategori + '/' + t.oncelik + ') için SLA politikası yok');
  if (p) say(p.etiket === t.sla, t.kod + ' sla="' + t.sla + '" politika="' + p.etiket + '"');
});

/* ---------- 5. Destek: bakım paketi ↔ talep ---------- */
head('5) Bakım paketi ↔ destek talebi');
DB.supportPackages.forEach(p => {
  const c = DB.customers.find(c => c.kod === p.musteri);
  say(!!c, p.kod + ' müşterisi yok');
});
DB.tickets.filter(t => t.bakimPaketi !== '—').forEach(t => {
  const p = DB.supportPackages.find(p => p.musteri === t.musteri);
  say(!!p, t.kod + ' paketli görünüyor ama müşterinin paketi yok');
  if (p) say(p.kalan === t.kalanDestek,
             t.kod + ' kalanDestek=' + t.kalanDestek + ' paket kalan=' + p.kalan);
});

/* ---------- 6. Memnuniyet anketi ↔ müşteri kartı ve talep ---------- */
head('6) Memnuniyet anketi ↔ müşteri kartı / destek talebi');
DB.customers.forEach(c => {
  const s = DB.surveys.filter(x => x.musteri === c.kod && x.durum === 'Yanıtlandı');
  if (!s.length) { say(c.memnuniyet == null, c.kod + ' anketsiz ama memnuniyet=' + c.memnuniyet); return; }
  const avg = s.reduce((a, x) => a + x.puan, 0) / s.length;
  say(Math.abs(avg - c.memnuniyet) < 1e-9,
      c.kod + ' memnuniyet kart=' + c.memnuniyet + ' anket ort=' + avg.toFixed(4));
});
DB.surveys.forEach(s => {
  say(!!DB.customers.find(c => c.kod === s.musteri), s.kod + ' müşteri kodu geçersiz');
  if (s.durum === 'Bekliyor') say(s.puan === null, s.kod + ' bekleyen ankette puan var');
  if (s.tur === 'Destek talebi' && s.ilgili) {
    const t = DB.tickets.find(t => t.kod === s.ilgili);
    say(!!t, s.kod + ' → ' + s.ilgili + ' talebi yok');
    if (t && s.puan !== null) say(t.memnuniyet === s.puan,
      s.kod + ' anket puanı=' + s.puan + ' talep memnuniyet=' + t.memnuniyet);
    if (t) say(t.musteri === s.musteri, s.kod + ' anket müşterisi talebin müşterisi değil');
  }
});

/* ---------- 7. Destek: slaDurum = iki eksenin kötüsü ---------- */
head('7) slaDurum ↔ SLA hedeflerinden hesaplanan durum');
{
  const now = new Date(DB.today + 'T00:00:00');
  const lvl = r => r >= 1 ? 'İhlal edildi' : r >= 0.75 ? 'Risk altında' : 'Zamanında';
  const rank = { 'Zamanında': 0, 'Risk altında': 1, 'İhlal edildi': 2 };
  DB.tickets.forEach(t => {
    const p = DB.slaPolicies.find(p => p.kategori === t.kategori &&
      (p.oncelik === t.oncelik || p.oncelik === 'Tümü'));
    if (!p) return;
    const gecen = t.cozumSuresi != null ? t.cozumSuresi
                : Math.round((now - new Date(t.acilis)) / 60000);
    say(gecen >= 0, t.kod + ' geçen süre negatif (açılış DB.today sonrası)');
    const yanit = t.mudahaleSuresi != null ? t.mudahaleSuresi : gecen;
    const a = lvl(yanit / p.ilkYanit), b = lvl(gecen / p.cozum);
    const kotu = rank[a] >= rank[b] ? a : b;
    say(kotu === t.slaDurum, t.kod + ' slaDurum kayıt="' + t.slaDurum + '" hesap="' + kotu + '"');
  });
}

console.log('\n' + (bad === 0
  ? 'TEMİZ — ' + checks + ' kontrol, canonical çelişki yok'
  : 'ÇELİŞKİ — ' + bad + ' / ' + checks + ' kontrol başarısız'));
process.exit(bad ? 1 : 0);
