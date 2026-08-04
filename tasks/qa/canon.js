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

/* ---------- 8. Finans: milestone ↔ fatura ↔ tahsilat zinciri ---------- */
head('8) Milestone ↔ fatura ↔ tahsilat');
{
  const seen = {};
  DB.invoices.forEach(i => {
    if (!i.milestone) return;
    say(!seen[i.milestone], i.kod + ' ile ' + seen[i.milestone] + ' aynı milestone\'a bağlı (' + i.milestone + ')');
    seen[i.milestone] = i.kod;
  });
  DB.milestones.forEach(m => {
    const inv = DB.invoices.find(i => i.milestone === m.kod);
    const pay = inv ? DB.payments.find(p => p.fatura === inv.kod) : null;
    if (inv) say(inv.tutar === m.odeme,
      m.kod + ' odeme=' + money(m.odeme) + ' fatura net=' + money(inv.tutar));
    if (m.odemeDurum === 'Ödendi') say(!!pay && pay.durum === 'Ödendi',
      m.kod + " odemeDurum='Ödendi' ama tahsilat=" + (pay ? pay.durum : 'yok'));
  });
}

/* ---------- 9. Para konvansiyonu: net / KDV / brüt (VB-01) ---------- */
head('9) Para konvansiyonu — sözleşme net + KDV = brüt');
DB.contracts.forEach(c => {
  say(c.kdv === Math.round(c.tutar * c.kdvOran / 100),
      c.kod + ' kdv=' + money(c.kdv) + ' beklenen=' + money(Math.round(c.tutar * c.kdvOran / 100)));
  say(c.toplam === c.tutar + c.kdv,
      c.kod + ' toplam=' + money(c.toplam) + ' tutar+kdv=' + money(c.tutar + c.kdv));
});
DB.invoices.forEach(i => {
  say(i.toplam === i.tutar + i.vergi,
      i.kod + ' toplam=' + money(i.toplam) + ' tutar+vergi=' + money(i.tutar + i.vergi));
});

/* ---------- 10. Ödeme planı tam mı: Σ taksit = sözleşme neti (VB-02) ---------- */
head('10) Ödeme planı bütünlüğü — Σ milestone.odeme = sözleşme tutarı');
DB.contracts.filter(c => c.proje).forEach(c => {
  const ms = DB.milestones.filter(m => m.sozlesme === c.kod);
  say(ms.length > 0, c.kod + ' projeli sözleşmenin hiç taksiti yok');
  const top = ms.reduce((s, m) => s + m.odeme, 0);
  say(top === c.tutar,
      c.kod + ' Σ taksit=' + money(top) + ' sözleşme neti=' + money(c.tutar) +
      ' (' + ms.length + ' taksit)');
  const sira = ms.map(m => m.taksit).sort((a, b) => a - b);
  say(sira.every((n, k) => n === k + 1), c.kod + ' taksit sırası boşluklu: ' + sira.join(','));
});
DB.milestones.forEach(m => {
  const c = DB.contracts.find(c => c.kod === m.sozlesme);
  say(!!c, m.kod + ' sözleşmesi (' + m.sozlesme + ') yok');
  if (c) say(c.proje === m.proje, m.kod + ' projesi sözleşmenin projesi değil');
});

/* ---------- 11. Müşteri cirosu net eksende ve sözleşmelerini kapsar ---------- */
head('11) toplamCiro (net) ↔ sözleşmeler');
DB.customers.forEach(c => {
  const cs = DB.contracts.filter(x => x.musteri === c.kod);
  if (!cs.length) return;
  const net = cs.reduce((s, x) => s + x.tutar, 0);
  say(c.toplamCiro >= net,
      c.kod + ' toplamCiro=' + money(c.toplamCiro) + ' < sözleşme neti=' + money(net));
  // projeSayisi kadar sözleşmesi varsa ciro tam olarak onların toplamıdır (ömür boyu geçmiş yok)
  if (cs.length === c.projeSayisi) say(c.toplamCiro === net,
      c.kod + ' tüm projeleri DB\'de: toplamCiro=' + money(c.toplamCiro) + ' Σ sözleşme=' + money(net));
});

/* ---- 12. Sprint görev sayısı modellenmiş kayıtları kapsar (V-27) ---- */
head('12) Sprint gorevSayisi >= modellenmiş görev kaydı');
DB.sprints.forEach(s => {
  const n = DB.tasks.filter(t => t.sprint === s.kod).length;
  say(s.gorevSayisi >= n,
      s.kod + ' gorevSayisi=' + s.gorevSayisi + ' < DB.tasks kaydı=' + n);
});

/* ---- 13. Teslim ↔ milestone bağı (lessons L-13) ---- */
head('13) Teslim ↔ milestone');
{
  const seen = {};
  DB.deliveries.forEach(d => {
    say(!!d.milestone, d.kod + ' milestone bağı yok');
    if (!d.milestone) return;
    const m = DB.milestones.find(m => m.kod === d.milestone);
    say(!!m, d.kod + ' → ' + d.milestone + ' milestone kaydı yok');
    if (m) say(m.proje === d.proje, d.kod + ' projesi=' + d.proje + ' milestone projesi=' + m.proje);
    say(!seen[d.milestone], d.kod + ' ile ' + seen[d.milestone] + " aynı milestone'a bağlı");
    seen[d.milestone] = d.kod;
    say(['Onaylandı','Bekliyor','Revizyon istendi'].indexOf(d.musteriOnay) !== -1,
        d.kod + " musteriOnay='" + d.musteriOnay + "' geçerli durum değil");
  });
}

/* ---- 14. Yönlendiren kartı ömür boyu sayaçtır: modellenenden KÜÇÜK olamaz ----
   `DB.referrers` kartındaki ciro/yönlendirme/kazanılan sayaçları modellenmemiş
   geçmişi de kapsar (DB.customers yalnız güncel müşterileri tutar — projeSayisi ile
   aynı bilinçli istisna). Bu yüzden kart >= türetilen olmak ZORUNDA; küçük olması
   çelişkidir. 4. oturumda `toplamCiro` düzeltilince üç kayıtta bu bozulmuştu
   (REF-002 · REF-006 · REF-007), 5. oturumda türetilene hizalandı. */
head('14) Yönlendiren kartı >= türetilen');
DB.referrers.forEach(r => {
  const musteriler = DB.customers.filter(c => c.referans === r.kod);
  const leadler    = DB.leads.filter(l => l.referans === r.kod);
  const turCiro    = musteriler.reduce((a, c) => a + (c.toplamCiro || 0), 0);
  say(r.ciro >= turCiro,
      r.kod + ' ciro=' + r.ciro + ' < müşterilerinin toplamCiro toplamı=' + turCiro);
  say(r.yonlendirme >= leadler.length,
      r.kod + ' yonlendirme=' + r.yonlendirme + ' < DB.leads kaydı=' + leadler.length);
  say(r.kazanilan >= musteriler.length,
      r.kod + ' kazanilan=' + r.kazanilan + ' < DB.customers kaydı=' + musteriler.length);
  const koms = DB.commissions.filter(k => k.referans === r.kod);
  const top  = koms.reduce((a, k) => a + (k.tutar || 0), 0);
  const od   = koms.filter(k => k.durum === 'Ödendi').reduce((a, k) => a + (k.tutar || 0), 0);
  say(r.hakedis === top, r.kod + ' hakedis=' + r.hakedis + ' ≠ Σ komisyon=' + top);
  say(r.odenen === od,  r.kod + ' odenen=' + r.odenen + ' ≠ Σ ödenmiş komisyon=' + od);
  say(r.bekleyen === top - od, r.kod + ' bekleyen=' + r.bekleyen + ' ≠ ' + (top - od));
});

console.log('\n' + (bad === 0
  ? 'TEMİZ — ' + checks + ' kontrol, canonical çelişki yok'
  : 'ÇELİŞKİ — ' + bad + ' / ' + checks + ' kontrol başarısız'));
process.exit(bad ? 1 : 0);
