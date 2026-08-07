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
  const komisyonToplam = k.reduce((s, x) => s + x.tutar, 0);
  const odenen = k.filter(x => x.durum === 'Ödendi').reduce((s, x) => s + x.tutar, 0);
  say(komisyonToplam === r.komisyonToplam, r.kod + ' komisyonToplam kart=' + money(r.komisyonToplam) + ' komisyon=' + money(komisyonToplam));
  say(odenen === r.odenen, r.kod + ' odenen kart=' + money(r.odenen) + ' komisyon=' + money(odenen));
  say(r.bekleyen === r.komisyonToplam - r.odenen, r.kod + ' bekleyen ≠ komisyonToplam - odenen');
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
  say(r.komisyonToplam === top, r.kod + ' komisyonToplam=' + r.komisyonToplam + ' ≠ Σ komisyon=' + top);
  say(r.odenen === od,  r.kod + ' odenen=' + r.odenen + ' ≠ Σ ödenmiş komisyon=' + od);
  say(r.bekleyen === top - od, r.kod + ' bekleyen=' + r.bekleyen + ' ≠ ' + (top - od));
});

/* ---- 15. Modüller arası bağ alanları (VB-05 / VB-07 / VB-08) --------------
   L-13: bağ tahmin edilmez, veride YAZILIDIR — o hâlde gösterdiği kayıt gerçekten
   var olmalı, tekil olması gereken bağ ikiye bölünmemeli ve sayım tutarlı olmalı. */
head('15) Modüller arası yazılı bağlar');

const has = (arr, kod) => arr.some(x => x.kod === kod);
/* bağ hedefi gerçekten var mı */
const ref = (kayitlar, alan, hedef, ad) => kayitlar.forEach(r => {
  if (r[alan] == null) return;
  say(has(hedef, r[alan]), r.kod + '.' + alan + '=' + r[alan] + ' → ' + ad + ' içinde yok');
});

/* 15a. destek dönüşümü — doğan kayıt gerçek bir talebi gösterir */
ref(DB.tasks,          'destek', DB.tickets, 'DB.tickets');
ref(DB.bugs,           'destek', DB.tickets, 'DB.tickets');
ref(DB.changeRequests, 'destek', DB.tickets, 'DB.tickets');

/* 15b. hata ↔ görev tek yönlü: `DB.tasks[].hata` ayna alanı DOĞMAMALI (L-13) */
say(DB.tasks.every(t => !('hata' in t)),
    'DB.tasks[].hata ayna alanı doğmuş — hata bağı yalnız DB.bugs[].gorev tarafında tutulur');
ref(DB.bugs, 'gorev', DB.tasks, 'DB.tasks');
/* hata bağı olan görevin etkisi şiddet eşlemesine uyar (components.md §9) */
const ETKI = { 'Kritik':'Çok yüksek', 'Yüksek':'Yüksek', 'Orta':'Orta', 'Düşük':'Düşük' };
DB.bugs.filter(b => b.gorev).forEach(b => {
  const g = DB.tasks.filter(t => t.kod === b.gorev)[0];
  if (!g) return;
  say(g.etki === ETKI[b.siddet],
      b.kod + ' şiddet=' + b.siddet + ' → ' + b.gorev + ' etki=' + g.etki +
      ', beklenen ' + ETKI[b.siddet]);
});

/* 15c. kalite zinciri — test / sprint / modül bağları */
ref(DB.bugs,  'test',   DB.tests,   'DB.tests');
ref(DB.bugs,  'sprint', DB.sprints, 'DB.sprints');
ref(DB.tests, 'sprint', DB.sprints, 'DB.sprints');
ref(DB.deliveries, 'test', DB.tests, 'DB.tests');
/* bir hata en fazla BİR koşuma bağlanır — `test` tekil alan olduğu için yapısal olarak
   garanti; asıl kontrol: bir koşuma bağlı hata sayısı `basarisiz`i AŞAMAZ */
DB.tests.forEach(t => {
  const n = DB.bugs.filter(b => b.test === t.kod).length;
  say(n <= t.basarisiz,
      t.kod + ' bağlı hata=' + n + ' > basarisiz=' + t.basarisiz);
});
/* bağ verilen sprint/modül bağın sahibiyle AYNI projede olmalı */
const sprintProje = k => (DB.sprints.filter(s => s.kod === k)[0] || {}).proje;
const modulProje  = k => (DB.projectModules.filter(m => m.kod === k)[0] || {}).proje;
DB.bugs.filter(b => b.sprint).forEach(b => say(sprintProje(b.sprint) === b.proje,
  b.kod + ' sprint=' + b.sprint + ' başka projenin sprinti'));
DB.bugs.filter(b => b.test).forEach(b => {
  const t = DB.tests.filter(x => x.kod === b.test)[0];
  say(t && t.proje === b.proje, b.kod + ' test=' + b.test + ' başka projenin koşumu');
});
[[DB.tests, 'koşum'], [DB.deliveries, 'teslim']].forEach(([arr, ad]) => {
  arr.forEach(r => (r.moduller || []).forEach(m => {
    say(has(DB.projectModules, m), r.kod + ' (' + ad + ') modül=' + m + ' → DB.projectModules içinde yok');
    say(modulProje(m) === r.proje, r.kod + ' (' + ad + ') modül=' + m + ' başka projenin modülü');
  }));
  say(arr.every(r => Array.isArray(r.moduller)), ad + ' kayıtlarında moduller dizi değil');
});

/* 15d. sipariş → demirbaş aktarımı */
ref(DB.assets, 'siparis', DB.orders, 'DB.orders');
DB.orders.forEach(o => {
  const grup = DB.assets.filter(a => a.siparis === o.kod);
  if (!grup.length) return;
  say(o.durum === 'Teslim alındı',
      o.kod + ' demirbaş doğurmuş ama durumu "' + o.durum + '" — yalnız teslim alınan sipariş demirbaş doğurur');
  const net = grup.reduce((a, x) => a + (x.alisFiyati || 0), 0);
  say(net === o.tutar,
      o.kod + ' Σ demirbaş alisFiyati=' + money(net) + ' ≠ sipariş neti=' + money(o.tutar));
  say(grup.every(a => a.tedarikci === o.tedarikci),
      o.kod + ' demirbaş grubunda siparişten farklı tedarikçi var');
});

/* ---- 16. Satın alma onay sayacı ekseni (ops.js DB.purchases başlığı) ------
   `onayAdim` = BULUNULAN adım sırası (1 tabanlı), onaylanan adım sayısı değil.
   Taslak → 0 · süreçte → onaylanan+1 · tamamlandı → onayToplam. */
head('16) Satın alma onay sayacı');
DB.purchases.forEach(p => {
  const ad = DB.purchaseApprovals.filter(a => a.talep === p.kod);
  const onayli = ad.filter(a => a.durum === 'Onaylandı').length;
  if (p.durum === 'Taslak') {
    say(p.onayAdim === 0, p.kod + ' Taslak ama onayAdim=' + p.onayAdim + ' (0 olmalı)');
  } else if (ad.length) {
    say(p.onayAdim === onayli + 1,
        p.kod + ' onayAdim=' + p.onayAdim + ' ≠ onaylanan(' + onayli + ')+1');
    say(ad.length === p.onayToplam,
        p.kod + ' zincir kaydı=' + ad.length + ' ≠ onayToplam=' + p.onayToplam);
  } else {
    say(p.onayAdim === p.onayToplam,
        p.kod + ' adım dökümü yok (süreç bitmiş sayılır) ama onayAdim=' + p.onayAdim +
        ' ≠ onayToplam=' + p.onayToplam);
  }
  say(p.onayAdim <= p.onayToplam, p.kod + ' onayAdim=' + p.onayAdim + ' > onayToplam=' + p.onayToplam);
});

/* ---- 17. Kaynak türü sözlüğe bağlıdır ve yönlendirenle çelişmez -----------
   `kaynak` DAİMA `DB.refTypes` kümesindendir. Sözlükte olmayan bir değer filtreyi
   sessizce boşa düşürür: 6. oturumda 9 kayıt `'Referans'` taşıyordu ve iki liste
   ekranının kaynak filtresi bu kayıtları HİÇ eşleştiremiyordu (ekran değil veri
   düzeltildi, L-08). Yönlendireni yazılı kayıtta `kaynak` o yönlendirenin türüdür. */
head('17) Kaynak türü ↔ refTypes ↔ yönlendiren');
[[DB.leads, 'lead'], [DB.customers, 'müşteri']].forEach(([arr, ad]) => {
  arr.forEach(r => {
    if (r.kaynak) say(DB.refTypes.indexOf(r.kaynak) !== -1,
      r.kod + ' (' + ad + ') kaynak="' + r.kaynak + '" → DB.refTypes içinde yok');
    if (!r.referans) return;
    const y = DB.referrers.filter(x => x.kod === r.referans)[0];
    say(!!y, r.kod + ' referans=' + r.referans + ' → DB.referrers içinde yok');
    if (y) say(r.kaynak === y.tur,
      r.kod + ' kaynak="' + r.kaynak + '" ≠ yönlendiren ' + y.kod + ' türü "' + y.tur + '"');
  });
});


/* ---- 18. Teklif → sözleşme aktarımı KDV'yi İKİ KEZ uygulamaz ---------------
   VB-19. `DB.contracts[].tutar` **NET** eksendedir (components.md §9b) ve teklifi
   yazılı bir sözleşmede teklifin **netine** eşit olmalıdır — brütüne değil.
   8. oturumda ölçüldü: teklifi yazılı 3 sözleşmenin **3'ünde de** `tutar`, teklifin
   BRÜTÜNE eşitti (600.000 / 354.000 / 1.104.000), yani KDV zincirde ikinci kez
   uygulanıyordu. Zincirin geri kalanı bu yanlış çapaya göre tutarlı olduğu için
   (Σ taksit = tutar, fatura = taksit, tahsilat = fatura brütü, ciro = Σ tutar)
   eksen 9/10/11 bunu GÖREMİYORDU — bu yüzden ayrı eksen olarak yazıldı. */
head('18) Teklif → sözleşme neti (VB-19)');
DB.contracts.forEach(c => {
  if (!c.teklif) return;
  const q = DB.quotes.filter(x => x.kod === c.teklif)[0];
  say(!!q, c.kod + ' teklif=' + c.teklif + ' → DB.quotes içinde yok');
  if (!q) return;
  const net = (q.araToplam || 0) - (q.indirim || 0);
  const brut = q.toplam;
  say(c.tutar === net,
    c.kod + ' tutar=' + c.tutar + ' ≠ ' + q.kod + ' neti ' + net +
    (c.tutar === brut ? ' — teklifin BRÜTÜ alınmış, KDV iki kez uygulanıyor (VB-19)' : ''));
});

/* ---------- 19. Hatırlatma ve duyuru okuma eksenleri (VB-29 · UID-30) ----------
   İki yeni veri ekseni. Kural (L-23 · VB-19 dersi): eksen yazılmadan madde
   kapatılmaz — buradaki kontrol olmazsa hatırlatma kaydı yetim kalabilir ve
   kimse fark etmez. `okuyanlar` da aynı sınıf: kişi kodu gerçek olmalı. */
head('19) Hatırlatma kaydı ↔ hedef kayıt · duyuru okuyanları');
const KOD_HAVUZ = [].concat(
  DB.documents.map(x => x.kod), DB.invoices.map(x => x.kod), DB.payments.map(x => x.kod),
  DB.contracts.map(x => x.kod), DB.tickets.map(x => x.kod), DB.policies.map(x => x.kod),
  DB.maintenance.map(x => x.kod), DB.inspections.map(x => x.kod));
const KISI_HAVUZ = [].concat(DB.employees.map(e => e.kod), DB.customers.map(c => c.kod));
(DB.reminders || []).forEach(r => {
  say(KOD_HAVUZ.indexOf(r.kayit) !== -1, r.kod + ' kayit=' + r.kayit + ' → hiçbir koleksiyonda yok');
  say(DB.employees.some(e => e.kod === r.gonderen), r.kod + ' gonderen=' + r.gonderen + ' → personel değil');
  say(KISI_HAVUZ.indexOf(r.alici) !== -1, r.kod + ' alici=' + r.alici + ' → personel ya da müşteri değil');
  say(!!r.tarih && !!r.kanal && !!r.durum, r.kod + ' tarih/kanal/durum eksik');
});
say((DB.reminders || []).length > 0, 'DB.reminders boş — hatırlatma ekseni yazılı ama dolu değil (L-22)');
DB.announcements.forEach(a => {
  say(Array.isArray(a.okuyanlar), a.kod + ' okuyanlar dizisi yok');
  (a.okuyanlar || []).forEach(k => {
    say(DB.employees.some(e => e.kod === k), a.kod + ' okuyan=' + k + ' → personel değil');
  });
});
say(DB.announcements.some(a => (a.okuyanlar || []).length > 0),
    'Hiçbir duyuruda okuyan yok — okuma ekseni açık ama boş (L-22)');

/* ---------- 20. Anket ilgili kaydı (VB-27) ----------
   `DB.surveys[].ilgili` altı ankette VAR OLMAYAN proje kodu taşıyordu ve
   601+ kontrol "temiz" derken bunu görmedi: eksen 15 yalnız yazılı BAĞ
   alanlarına bakıyordu, `ilgili` o listede yoktu. Ekseni olmayan hata
   görünmez (VB-19 dersi). */
head('20) Anket ilgili kaydı (VB-27)');
const ILGILI_HAVUZ = [].concat(
  DB.projects.map(p => p.kod), DB.tickets.map(t => t.kod),
  DB.customers.map(c => c.kod), DB.contracts.map(c => c.kod),
  (DB.supportPackages || []).map(b => b.kod));
DB.surveys.forEach(a => {
  if (!a.ilgili) return;
  say(ILGILI_HAVUZ.indexOf(a.ilgili) !== -1,
      a.kod + ' ilgili=' + a.ilgili + ' → hiçbir koleksiyonda yok');
});
/* Proje teslimi anketi, teslim edilen projeden SONRA yapılır */
DB.surveys.filter(a => /^PRJ-/.test(a.ilgili || '')).forEach(a => {
  const p = DB.projects.filter(x => x.kod === a.ilgili)[0];
  if (!p || !p.gercekBitis) return;
  say(a.tarih >= p.gercekBitis,
      a.kod + ' anket tarihi ' + a.tarih + ' < proje teslimi ' + p.gercekBitis);
});

/* ---------- 21. §22 BAĞ KAPSAMI — "alan açmak bağ yazmak değildir" (VB-28 · L-22) ----------
   Eksen 15 "bağ verilen kod gerçekten var mı" diye soruyor; **boş alan her zaman
   geçiyor**. VB-05 tam bu yüzden "kapandı" sayılmıştı: `DB.tasks[].destek` şemada
   vardı ama 0/25 kayıtta doluydu. Bu eksen tersini sorar: **bağ VERİLMİŞ mi.**
   Her satır için en az bir kaydın gerçekten değer taşıması beklenir; taşımıyorsa
   madde kapalı sayılamaz. Sayı da raporlanır ki defterdeki iddia ölçülebilsin. */
head('21) §22 bağ kapsamı — her bağ en az bir kayıtta DOLU (L-22)');
const BAGLAR = [
  ['destek → görev',        DB.tasks,          'destek'],
  ['destek → hata',         DB.bugs,           'destek'],
  ['destek → değişiklik',   DB.changeRequests, 'destek'],
  ['hata → görev',          DB.bugs,           'gorev'],
  ['hata → koşum',          DB.bugs,           'test'],
  ['hata → sprint',         DB.bugs,           'sprint'],
  ['koşum → sprint',        DB.tests,          'sprint'],
  ['teslim → kabul koşumu', DB.deliveries,     'test'],
  ['teslim → taksit',       DB.deliveries,     'milestone'],
  ['sipariş → demirbaş',    DB.assets,         'siparis'],
  ['sipariş → araç',        DB.vehicles,       'siparis'],
  ['aday → müşteri',        DB.leads,          'musteri'],
  ['sohbet mesajı → görev', DB.messages,       'gorev'],
  ['sözleşme → teklif',     DB.contracts,      'teklif']
];
BAGLAR.forEach(([ad, arr, alan]) => {
  const dolu = arr.filter(r => r[alan] != null && r[alan] !== '' &&
                              !(Array.isArray(r[alan]) && !r[alan].length)).length;
  say(dolu > 0, ad + ' (' + alan + ') — ' + arr.length + ' kaydın HİÇBİRİNDE dolu değil (L-22)');
  console.log('  · ' + ad.padEnd(24) + alan.padEnd(12) + dolu + ' / ' + arr.length);
});

/* 21b. sipariş → araç bütünlüğü (§22 madde 24). Demirbaş tarafının (15d) ikizi. */
ref(DB.vehicles, 'siparis', DB.orders, 'DB.orders');
DB.vehicles.filter(v => v.siparis).forEach(v => {
  const o = DB.orders.filter(x => x.kod === v.siparis)[0];
  if (!o) return;
  say(o.durum === 'Teslim alındı',
      v.kod + ' siparişi ' + o.kod + ' durumu "' + o.durum + '" — yalnız teslim alınan sipariş araç doğurur');
  say(v.alisBedeli === o.tutar,
      v.kod + ' alisBedeli=' + money(v.alisBedeli) + ' ≠ sipariş neti=' + money(o.tutar));
  say(v.mulkiyet === 'Satın alınan',
      v.kod + ' siparişi var ama mülkiyeti "' + v.mulkiyet + '" — kiralık araç sipariş doğurmaz');
  say(v.alisTarihi >= o.tarih,
      v.kod + ' alisTarihi=' + v.alisTarihi + ' < sipariş tarihi ' + o.tarih);
});

/* 21c. sohbet mesajı → görev (§22 madde 15) ve aday → müşteri (§22 madde 6).
   İkisi de bağı KAYNAK kayıtta tutar; hedefte ayna alan doğmamalıdır (§9d). */
ref(DB.messages, 'gorev',   DB.tasks,     'DB.tasks');
ref(DB.leads,    'musteri', DB.customers, 'DB.customers');
say(!DB.tasks.some(t => 'kanal' in t || 'mesaj' in t),
    'DB.tasks[].kanal/mesaj ayna alanı doğmuş — bağ DB.messages[].gorev üzerindedir (§9d)');
say(!DB.customers.some(c => 'lead' in c),
    'DB.customers[].lead ayna alanı doğmuş — bağ DB.leads[].musteri üzerindedir (§9d)');
/* Kazanılan aday müşteri kaydı gösteriyorsa, o müşteri adayın talebinden SONRA açılmış olmalı */
DB.leads.filter(l => l.asama === 'Kazanıldı' && l.musteri).forEach(l => {
  const c = DB.customers.filter(x => x.kod === l.musteri)[0];
  if (!c) return;
  say(c.ilkKayit >= l.talepTarihi,
      l.kod + ' kazanıldı → ' + c.kod + ' ama müşteri kaydı (' + c.ilkKayit +
      ') adayın talebinden (' + l.talepTarihi + ') ÖNCE açılmış');
});

/* ---------- 22. AKTİVİTE KAPSAMI — her detay ekranı için en az bir kayıt (UID-16) ----------
   `DB.activities` 8 kayıt ve 4 kod öneki taşıyordu; 26 detay ekranının **22'sinde**
   "Aktivite Geçmişi" sekmesi HER kayıtta boş durum basıyordu. Ekran doğru davranıyordu,
   eksik olan veriydi — ama bunu gösteren bir eksen yoktu, bu yüzden borç defterinde
   yalnız beş önek (TKL · EMP · ARC · REF · YTK) yazılıydı; gerçek sayı 22'ydi (L-25).
   Aşağıdaki koleksiyon listesi **26 detay ekranının okuduğu koleksiyonlardır**;
   yeni bir detay ekranı üretilirse buraya da eklenir. */
head('22) Aktivite kapsamı — her detay ekranı koleksiyonu (UID-16)');
const DETAY_KOLL = [
  ['vehicles','app-arac-detay'], ['assets','app-demirbas-detay'], ['tickets','app-destek-detay'],
  ['documents','app-dokuman-detay'], ['invoices','app-fatura-detay'], ['tasks','app-gorev-detay'],
  ['deptRequests','app-istalebi-detay'], ['leaves','app-izin-detay'], ['commissions','app-komisyon-detay'],
  ['leads','app-lead-detay'], ['customers','app-musteri-detay'], ['analyses','app-onanaliz-detay'],
  ['employees','app-personel-detay'], ['changeRequests','app-proje-degisiklik-detay'],
  ['projects','app-proje-detay'], ['bugs','app-proje-hata-detay'], ['deliveries','app-proje-teslim-detay'],
  ['tests','app-proje-test-detay'], ['referrers','app-referans-detay'], ['purchases','app-satinalma-detay'],
  ['orders','app-siparis-detay'], ['contracts','app-sozlesme-detay'], ['payments','app-tahsilat-detay'],
  ['suppliers','app-tedarikci-detay'], ['quotes','app-teklif-detay'], ['meetings','app-toplanti-detay']
];
const AKT_KAYIT = {};
DB.activities.forEach(a => { AKT_KAYIT[a.kayit] = (AKT_KAYIT[a.kayit] || 0) + 1; });
let kapsanan = 0;
DETAY_KOLL.forEach(([koll, ekran]) => {
  const arr = DB[koll] || [];
  say(arr.length > 0, koll + ' koleksiyonu yok ya da boş (' + ekran + ')');
  const n = arr.filter(r => AKT_KAYIT[r.kod]).length;
  if (n) kapsanan++;
  say(n > 0, ekran + ' → DB.' + koll + ' (' + arr.length + ' kayıt) hiçbirinde aktivite YOK — ' +
      'sekme her kayıtta boş durum basar (UID-16 · L-22)');
  console.log('  · ' + ekran.padEnd(30) + koll.padEnd(16) +
              String(n) + ' / ' + arr.length + ' kayıtta aktivite');
});
console.log('  → aktivitesi olan detay ekranı: ' + kapsanan + ' / ' + DETAY_KOLL.length);

/* 22b. Aktivite kaydının kendi bütünlüğü. `kisi` artık **KOD** taşır (VB-12,
   11. oturumda çevrildi): `EMP-*` personel, `YTK-*` müşteri yetkilisi. Ad
   `GV.activity` içinde çözülür. Buradaki kontrol, ad tutan bir kaydın geri
   sızmasını engeller — kod olmayan bir `kisi` değeri İHLALDİR. */
const TUM_KOD = {};
Object.keys(DB).forEach(k => {
  if (Array.isArray(DB[k])) DB[k].forEach(r => { if (r && r.kod) TUM_KOD[r.kod] = k; });
});
const EMP_AD = DB.employees.map(e => e.ad);
const TON = ['ok', 'warn', 'danger', 'info', 'accent', 'neutral'];
DB.activities.forEach(a => {
  say(!!TUM_KOD[a.kayit], 'aktivite kayit=' + a.kayit + ' → hiçbir koleksiyonda yok');
  say(/^(EMP|YTK)-/.test(a.kisi || ''),
      'aktivite (' + a.kayit + ') kisi="' + a.kisi + '" → KOD değil (VB-12: ad tutulmaz)');
  if (/^EMP-/.test(a.kisi || '')) say(has(DB.employees, a.kisi),
      'aktivite (' + a.kayit + ') kisi=' + a.kisi + ' → DB.employees içinde yok');
  if (/^YTK-/.test(a.kisi || '')) say(has(DB.contacts, a.kisi),
      'aktivite (' + a.kayit + ') kisi=' + a.kisi + ' → DB.contacts içinde yok');
  say(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(a.tarih),
      'aktivite (' + a.kayit + ') tarih="' + a.tarih + '" biçimi YYYY-MM-DDTHH:MM değil');
  say(a.tarih.slice(0, 10) <= DB.today,
      'aktivite (' + a.kayit + ') tarihi ' + a.tarih.slice(0, 10) + ' > DB.today (' + DB.today + ')');
  say(TON.indexOf(a.tone) !== -1, 'aktivite (' + a.kayit + ') tone="' + a.tone + '" sözlükte yok');
  say(/^i-[a-z-]+$/.test(a.icon || ''), 'aktivite (' + a.kayit + ') icon="' + a.icon + '" geçersiz');
  say(!!a.metin, 'aktivite (' + a.kayit + ') metin boş');
});
/* Aynı kaydın aktiviteleri aynı dakikada iki kez olamaz (sıralama belirsizleşir) */
const AKT_ANAHTAR = {};
DB.activities.forEach(a => {
  const k = a.kayit + '|' + a.tarih;
  say(!AKT_ANAHTAR[k], 'aktivite çakışması: ' + a.kayit + ' için ' + a.tarih + ' iki kez yazılmış');
  AKT_ANAHTAR[k] = 1;
});

/* ---------- 23. KİŞİ VE TARİH TUTARLILIĞI — UID-16 turunda ölçülen iki çelişki ----------
   İkisi de "veriyi yakından okuyan" bir iş sırasında ortaya çıktı: aktivite kaydı
   yazmak için kaydın yaşam döngüsüne bakmak gerekti ve iki yerde tarih mantığının
   tutmadığı görüldü. Eksen yazılmadan düzeltme kabul edilmez (VB-19 dersi). */
head('23) Zimmet ve yönlendirme tarih mantığı');
/* 23a. Bir personele, İŞE GİRMEDEN ÖNCE demirbaş zimmetlenemez.
   Ölçülmüştü: ZMT-2025-005 monitörü 2025-11-03'te EMP-016'ya veriyordu,
   oysa EMP-016'nın `girisTarihi` 2026-06-15 — zimmet de iade de personel
   şirkete katılmadan önceydi. Kayıt tenure'ü örtüşen EMP-015'e çekildi. */
DB.assignments.forEach(z => {
  const e = DB.employees.filter(x => x.kod === z.personel)[0];
  say(!!e, z.kod + ' personel=' + z.personel + ' → DB.employees içinde yok');
  if (!e) return;
  say(z.teslimTarihi >= e.girisTarihi,
      z.kod + ' teslim ' + z.teslimTarihi + ' < ' + e.kod + ' işe giriş ' + e.girisTarihi);
  if (z.iadeTarihi) say(z.iadeTarihi >= z.teslimTarihi,
      z.kod + ' iade ' + z.iadeTarihi + ' < teslim ' + z.teslimTarihi);
  say(has(DB.assets, z.demirbas), z.kod + ' demirbas=' + z.demirbas + ' → DB.assets içinde yok');
});
/* 23b. `sonYonlendirme` SAKLANAN bir türevdir (L-08): yönlendirenin en son
   getirdiği adayın talep tarihinden ESKİ olamaz. Ölçülmüştü: 8 yönlendirenin
   3'ünde kart tarihi modellenmiş adaydan geriydi (REF-001 · REF-006 · REF-008).
   `yonlendirme` ömür boyu sayaçtır ve sistem öncesi yönlendirmeleri de kapsar,
   bu yüzden modellenen aday sayısından KÜÇÜK olamaz ama büyük olabilir. */
DB.referrers.forEach(r => {
  const ls = DB.leads.filter(l => l.referans === r.kod);
  say(r.yonlendirme >= ls.length,
      r.kod + ' yonlendirme sayacı=' + r.yonlendirme + ' < modellenmiş aday=' + ls.length);
  if (!ls.length) return;
  const enSon = ls.map(l => l.talepTarihi).sort().pop();
  say(r.sonYonlendirme >= enSon,
      r.kod + ' sonYonlendirme=' + r.sonYonlendirme + ' < en son aday talebi ' + enSon +
      ' — saklanan türev eskimiş (L-08)');
});

/* ---------- 24. KİŞİ KİMLİĞİ KODLA KURULUR (VB-12 · VB-13) ----------
   Üç alan kişiyi ADLA tutuyordu; ad değişince bağ sessizce kopuyordu ve
   `app-musteri-yetkili-form` bunu bir "ad kaskadı" ile idare etmek zorunda
   kalmıştı. Üçü de `YTK-*` / `EMP-*` koduna çevrildi, kaskad silindi.
   Bu eksen ADIN geri sızmasını engeller: kod kalıbına uymayan değer İHLALDİR. */
head('24) Kişi kimliği — ad değil KOD (VB-12 · VB-13)');
DB.tickets.forEach(t => {
  say(/^YTK-/.test(t.acan || ''),
      t.kod + ' acan="' + t.acan + '" → YTK kodu değil (ad tutuluyor, VB-12)');
  const c = DB.contacts.filter(x => x.kod === t.acan)[0];
  say(!!c, t.kod + ' acan=' + t.acan + ' → DB.contacts içinde yok');
  if (c) say(c.musteri === t.musteri,
      t.kod + ' talebi ' + t.musteri + ' müşterisinin, açan yetkili ' + c.kod +
      ' ise ' + c.musteri + ' müşterisinin — yetkili başka firmadan');
});
DB.interactions.forEach(i => {
  if (i.kontak) {
    say(/^YTK-/.test(i.kontak), i.kod + ' kontak="' + i.kontak + '" → YTK kodu değil');
    const c = DB.contacts.filter(x => x.kod === i.kontak)[0];
    say(!!c, i.kod + ' kontak=' + i.kontak + ' → DB.contacts içinde yok');
    if (c && i.musteri) say(c.musteri === i.musteri,
        i.kod + ' görüşmesi ' + i.musteri + ' ile, muhatap ' + c.kod + ' ise ' + c.musteri + ' yetkilisi');
  } else {
    /* kontak boşsa görüşme bir ADAYla yapılmıştır; ad adayın kendi alanından okunur */
    say(!!i.lead, i.kod + ' kontak boş ama lead de yok — muhatap hiçbir yerden okunamaz');
    const l = DB.leads.filter(x => x.kod === i.lead)[0];
    say(!!l && !!l.yetkili, i.kod + ' aday görüşmesi ama ' + i.lead + ' kaydında yetkili adı yok');
  }
});
/* 24b. VB-13 — yönlendiren aynı zamanda bir müşteri yetkilisiyse bağ YAZILIDIR ve
   iki kayıttaki iletişim bilgisi BİREBİR aynıdır. Aynı kişi iki koleksiyonda
   tutulduğu için biri güncellenince diğeri sessizce eskiyordu. */
DB.referrers.forEach(r => {
  say('kontak' in r, r.kod + ' kontak anahtarı yok — şema kayıttan kayda değişiyor (VB-18 sınıfı)');
  if (!r.kontak) return;
  const c = DB.contacts.filter(x => x.kod === r.kontak)[0];
  say(!!c, r.kod + ' kontak=' + r.kontak + ' → DB.contacts içinde yok');
  if (!c) return;
  ['ad', 'tel', 'eposta', 'pozisyon'].forEach(f => say(r[f] === c[f],
    r.kod + '.' + f + '="' + r[f] + '" ≠ ' + c.kod + '.' + f + '="' + c[f] + '" — aynı kişi, iki farklı değer (VB-13)'));
});
/* Bağ yazılmamış yönlendirenlerde AYNI kişi ikinci kez tutulmamalı: telefon ya da
   e-posta bir yetkiliyle birebir aynıysa bağ yazılmamış demektir, sessiz kopya kalır. */
DB.referrers.filter(r => !r.kontak).forEach(r => {
  const c = DB.contacts.filter(x => (r.tel && x.tel === r.tel) || (r.eposta && x.eposta === r.eposta))[0];
  say(!c, r.kod + ' bağsız ama ' + (c ? c.kod : '') + ' ile aynı iletişim bilgisini taşıyor — kontak yazılmalı (VB-13)');
});

/* ---------- 25. GÖREV DURUMU VE BEKLEME EKSENİ (REVİZE 01 · REVİZE 02) ----------
   Sözlük 19 değerliydi, 8'i hiçbir kayıtta geçmiyordu ve üçü aslında bekleme
   nedeniydi. Sadeleştirme 10 değere indirdi. Bu eksen üç şeyi bir daha
   bozulamaz hâle getirir:
   (a) her görev durumu sözlükten çıkar — ekranda elle yazılan bir değer
       sessizce veriye giremez;
   (b) geçiş tablosu sözlükle BİREBİR örtüşür — kuralsız durum, hedefi
       sözlükte olmayan geçiş kalmaz (`Kontrol bekliyor`ın `ciktiLink` zorunlu
       alanı gibi HİÇ UYGULANAMAYAN kural bir daha yazılamaz: zorunlu alan
       adı gerçek bir görev alanı olmalı);
   (c) bekleme nedeni AYRI eksende durur ve sözlükten çıkar — L-22 gereği
       en az bir kayıtta gerçekten dolu olmalı, yoksa "alan açmak bağ yazmak
       değildir" hatası tekrarlanır. */
head('25) Görev durumu · geçiş tablosu · bekleme ekseni (REVİZE 01/02)');
{
  const S = DB.taskStatuses, T = DB.taskTransitions, W = DB.taskWaitReasons;
  say(S.length === 10, 'DB.taskStatuses ' + S.length + ' değer — hedef 10');
  say(new Set(S).size === S.length, 'DB.taskStatuses tekrar eden değer taşıyor');
  say(Array.isArray(W) && W.length > 0, 'DB.taskWaitReasons sözlüğü yok');

  /* 25a. Her görevin durumu sözlükten */
  DB.tasks.forEach(t => say(S.indexOf(t.durum) !== -1,
    t.kod + ' durum="' + t.durum + '" DB.taskStatuses içinde yok'));

  /* 25b. Geçiş tablosu sözlükle birebir — kuralsız durum ve sözlük dışı hedef yok */
  S.forEach(d => say(!!T[d], '"' + d + '" durumu için geçiş kuralı yok — o durumdaki görev sıkışır'));
  Object.keys(T).forEach(d => {
    say(S.indexOf(d) !== -1, 'taskTransitions["' + d + '"] sözlükte olmayan bir durum');
    T[d].next.forEach(h => say(S.indexOf(h) !== -1,
      '"' + d + '" → "' + h + '" hedefi sözlükte yok'));
  });

  /* 25c. Zorunlu alan adı GERÇEK bir görev alanı olmalı.
     `ciktiLink` beş oturum boyunca zorunlu yazılıydı ve hiçbir görevde böyle
     bir alan yoktu — kural hiç uygulanamadı, kimse fark etmedi. */
  const alanlar = new Set();
  DB.tasks.forEach(t => Object.keys(t).forEach(k => alanlar.add(k)));
  Object.keys(T).forEach(d => (T[d].zorunlu || []).forEach(a => say(alanlar.has(a),
    '"' + d + '" zorunlu alanı "' + a + '" hiçbir görev kaydında yok — kural uygulanamaz')));

  /* 25d. Her durumdan çıkış var (Arşivlendi son duraktır) */
  S.filter(d => d !== 'Arşivlendi').forEach(d =>
    say(T[d] && T[d].next.length > 0, '"' + d + '" durumundan çıkış yok — görev orada kilitlenir'));

  /* 25e. Bekleme nedeni ayrı eksende, sözlükten, en az bir kayıtta DOLU (L-22) */
  const bekleyen = DB.tasks.filter(t => t.beklemeNedeni != null);
  say(bekleyen.length > 0,
    'beklemeNedeni 26 kaydın HİÇBİRİNDE dolu değil — alan açmak bağ yazmak değildir (L-22)');
  bekleyen.forEach(t => say(W.indexOf(t.beklemeNedeni) !== -1,
    t.kod + ' beklemeNedeni="' + t.beklemeNedeni + '" sözlükte yok'));
  console.log('  · beklemeNedeni dolu: ' + bekleyen.length + ' / ' + DB.tasks.length +
              '  (' + bekleyen.map(t => t.kod + ':' + t.beklemeNedeni).join(' · ') + ')');

  /* 25f. Bekleme bir DURUM olarak geri sızmasın — eski üç değer sözlüğe dönemez */
  ['Bilgi bekliyor', 'Müşteri bekleniyor', 'Departman bekleniyor'].forEach(v =>
    say(S.indexOf(v) === -1,
      '"' + v + '" görev durumu olarak geri gelmiş — bu bir BEKLEME NEDENİ, durum değil (REVİZE 01)'));

  /* 25h. Onay adımı TÜRETİLİR (V-43): kontrol eden ile onaylayan aynı kişiyse
     ayrı bir onay adımı yoktur — o hâlde görev `Onay bekliyor`da DURAMAZ,
     çünkü beklediği onay hiç gelmeyecektir. GRV-2026-113 tam bu durumdaydı:
     ekran iki adımlık zincir basıyor, kayıt üçüncü adımı bekliyordu. */
  DB.tasks.filter(t => t.durum === 'Onay bekliyor').forEach(t => say(
    t.onaylayan !== t.kontrolEden,
    t.kod + ' "Onay bekliyor" ama kontrolEden = onaylayan (' + t.onaylayan +
    ') — beklediği onay adımı yok (V-43)'));

  /* 25g. Tamamlanmış görev %100, tamamlanmamış görevde tamamlanma tarihi yok */
  DB.tasks.forEach(t => {
    if (t.durum === 'Tamamlandı') say(t.ilerleme === 100,
      t.kod + ' tamamlandı ama ilerleme=' + t.ilerleme);
    if (t.tamamlanma) say(['Tamamlandı', 'Arşivlendi'].indexOf(t.durum) !== -1,
      t.kod + ' tamamlanma tarihi var ama durum="' + t.durum + '"');
  });
}

/* ---------- 26. ZAMAN DEFTERİ ↔ GÖREV EMEĞİ (REVİZE 03) ----------
   `DB.tasks[].gercekSure` ile o görevin zaman kayıtları AYNI olguyu anlatır;
   ikisi ayrı yazılınca ayrışırlar (L-08). Ölçüldüğünde 26 görevin 16'sında
   ayrışmıştı: sekizinde defter daha yüksekti (bir göreve birden çok kişi
   kaydediyor), sekizinde görev saat iddia ediyordu ama defterde **tek satır
   yoktu**. Defter kazandı; kaydı olmayan sekiz görev için kayıt görevin
   kendisinden türetildi (kaynak `aciklama`'da yazılı).

   NOT — proje düzeyinde bu eşitlik KURULAMAZ ve kurulmadı (V-44): projelerin
   beyan ettiği 9.125 saatin ~8.900'ünü hiçbir kayıt desteklemiyor. Orada
   kural eşitlik değil, `beyan ≥ defter`tir. Görev düzeyinde eşitlik
   kurulabildi çünkü kaynak kayıt vardı. */
head('26) Zaman defteri ↔ görev emeği (REVİZE 03)');
{
  const sum = a => a.reduce((s, x) => s + x, 0);
  DB.tasks.forEach(t => {
    const ls = DB.timelogs.filter(l => l.gorev === t.kod);
    const tl = sum(ls.map(l => l.sure));
    say(Math.abs(tl - (t.gercekSure || 0)) < 0.01,
      t.kod + ' gercekSure=' + t.gercekSure + ' ≠ zaman defteri toplamı=' + tl +
      ' (' + ls.length + ' kayıt) — aynı olgu iki yerde ayrı yazılmış (L-08)');
  });

  /* 26a. Defterin her satırı çözülür ve görev/proje/müşteri üçlüsü görevle uyumlu */
  DB.timelogs.filter(l => l.gorev).forEach(l => {
    const t = DB.tasks.filter(x => x.kod === l.gorev)[0];
    say(!!t, l.kod + ' gorev=' + l.gorev + ' → DB.tasks içinde yok');
    if (!t) return;
    say(l.proje === t.proje,
      l.kod + ' proje=' + l.proje + ' ama görevin projesi ' + t.proje);
    say(l.musteri === t.musteri,
      l.kod + ' musteri=' + l.musteri + ' ama görevin müşterisi ' + t.musteri);
  });

  /* 26b. Onaylı ⊆ tüm · faturalanabilir onaylı ⊆ onaylı — R03'ün üç değeri
     birbirini kapsamalı, yoksa proje kartındaki üçlü çelişir */
  const tum  = sum(DB.timelogs.map(l => l.sure));
  const onay = sum(DB.timelogs.filter(l => l.onay === 'Onaylandı').map(l => l.sure));
  const fat  = sum(DB.timelogs.filter(l => l.onay === 'Onaylandı' && l.faturalanabilir).map(l => l.sure));
  say(fat <= onay, 'faturalandırılabilir (' + fat + ') > onaylı (' + onay + ')');
  say(onay <= tum, 'onaylı (' + onay + ') > tüm kayıtlar (' + tum + ')');
  const r2 = n => Math.round(n * 100) / 100;
  console.log('  · defter: tüm ' + r2(tum) + ' sa · onaylı ' + r2(onay) + ' sa · onaylı+faturalanabilir ' + r2(fat) + ' sa');

  /* 26c. `harcananSure` alanı KALDIRILDI (REVİZE 03 proje ucu). Eski eksen
     `beyan >= defter` diyordu; beyanın kendisi elle yazılmış bir sayıydı ve
     9.125 saatin ~8.900'ünü hiçbir kayıt desteklemiyordu. Alan geri gelirse
     türetme sessizce ikinci bir deftere döner — eksen bunu engeller. */
  DB.projects.forEach(p => {
    say(!('harcananSure' in p),
      p.kod + ' harcananSure alanı geri gelmiş — gerçekleşen süre türetilir, saklanmaz (L-08 · V-45)');
  });
}

/* ---------- 27. Proje süre zinciri · tek onay ekseni (REVİZE 03 proje ucu) ----------
   Üç ayrı kırılganlık burada kilitleniyor:
   a) "onaylı saat" iki farklı şeydi — haftalık timesheet ile satır onayı
      birbirinden habersizdi (`GV.zaman` tek eksene indirdi).
   b) Proje "gerçekleşen süresi" elle yazılıydı; artık ONAYLI zaman
      kayıtlarından türetiliyor.
   c) Türetilmiş defter satırları modül ilerlemesinden geliyor; toplamları
      kaynağını TAM karşılamalı — aşarsa çift sayım, kalırsa eksik türetme. */
head('27) Proje süre zinciri · tek onay ekseni (REVİZE 03)');
{
  const sum = a => a.reduce((s, x) => s + x, 0);
  const yuvarla = n => Math.round(n * 100) / 100;

  /* 27a. Proje bazında üç değer iç içe: faturalanabilir ⊆ onaylı ⊆ tüm */
  DB.projects.forEach(p => {
    const ls = DB.timelogs.filter(l => l.proje === p.kod);
    const on = ls.filter(l => l.onay === 'Onaylandı');
    const tum = yuvarla(sum(ls.map(l => l.sure)));
    const ger = yuvarla(sum(on.map(l => l.sure)));
    const fat = yuvarla(sum(on.filter(l => l.faturalanabilir).map(l => l.sure)));
    say(fat <= ger, p.kod + ' faturalandırılabilir (' + fat + ') > gerçekleşen (' + ger + ')');
    say(ger <= tum, p.kod + ' gerçekleşen (' + ger + ') > defterdeki tüm saat (' + tum + ')');
  });

  /* 27b. Haftalık timesheet ↔ kapsadığı satırlar — bildirim ve kırılım aynı
     şeyi söylemeli, ONAY da tek eksende olmalı */
  const kapsanan = new Set();
  DB.timesheets.forEach(ts => {
    const ls = DB.timelogs.filter(l =>
      l.personel === ts.personel && l.tarih >= ts.baslangic && l.tarih <= ts.bitis);
    ls.forEach(l => kapsanan.add(l.kod));
    const tum = yuvarla(sum(ls.map(l => l.sure)));
    const fat = yuvarla(sum(ls.filter(l => l.faturalanabilir).map(l => l.sure)));
    say(tum === ts.toplam,
      ts.kod + ' toplam=' + ts.toplam + ' ≠ haftaya düşen satır toplamı=' + tum);
    say(fat === ts.faturalanabilir,
      ts.kod + ' faturalanabilir=' + ts.faturalanabilir + ' ≠ satır toplamı=' + fat);
    ls.forEach(l => {
      if (ts.durum === 'Onaylandı')
        say(l.onay === 'Onaylandı',
          l.kod + ' haftası (' + ts.kod + ') onaylı ama satır onayı "' + l.onay + '" — tek onay ekseni (REVİZE 03)');
      else
        say(l.onay !== 'Onaylandı',
          l.kod + ' satırı onaylı ama haftası (' + ts.kod + ') "' + ts.durum + '" — tek onay ekseni (REVİZE 03)');
    });
  });

  /* 27c. Haftalık defterin KAPSAMADIĞI onaylı satır, defterin başlangıcından
     ÖNCE olmalı. Türetilmiş toplu aktarımlara verilen onay izni budur; izin
     bugüne taşınamaz, yoksa timesheet'i atlayan bir onay yolu açılır. */
  const defterBas = DB.timesheets.map(t => t.baslangic).sort()[0];
  DB.timelogs.filter(l => l.onay === 'Onaylandı' && !kapsanan.has(l.kod)).forEach(l => {
    say(l.tarih < defterBas,
      l.kod + ' (' + l.tarih + ') kapsayan timesheet olmadan onaylı ve haftalık defterin ' +
      'başlangıcından (' + defterBas + ') sonra — onay haftalık defterden geçmeli');
  });

  /* 27d. Modül ekseni: modülün defterdeki toplam emeği = round(efor × ilerleme%).
     Satır ya doğrudan `modul` taşır ya da görevi üzerinden modüle bağlanır. */
  DB.projectModules.forEach(m => {
    const hedef = Math.round(m.efor * m.ilerleme / 100);
    const gorevler = DB.tasks.filter(t => t.modul === m.kod).map(t => t.kod);
    const top = yuvarla(sum(DB.timelogs
      .filter(l => l.modul === m.kod || gorevler.indexOf(l.gorev) !== -1)
      .map(l => l.sure)));
    say(top === hedef,
      m.kod + ' defter toplamı=' + top + ' ≠ efor×ilerleme=' + hedef +
      ' (' + m.efor + ' sa × %' + m.ilerleme + ') — çift sayım ya da eksik türetme');
  });

  /* 27e. `modul` YALNIZ görevsiz satırda yazılır; görevlinin modülü görevinden
     çözülür ve ikinci kez yazılmaz (L-08). Yazılıysa gerçek ve aynı projede. */
  DB.timelogs.filter(l => l.modul).forEach(l => {
    say(!l.gorev, l.kod + ' hem gorev hem modul taşıyor — modül görevden çözülür, ikinci kez yazılmaz (L-08)');
    const m = DB.projectModules.filter(x => x.kod === l.modul)[0];
    say(!!m, l.kod + ' modul=' + l.modul + ' → DB.projectModules içinde yok');
    if (m) {
      say(m.proje === l.proje, l.kod + ' proje=' + l.proje + ' ama modülün projesi ' + m.proje);
      say(m.sorumlu === l.personel,
        l.kod + ' personel=' + l.personel + ' ama modülün sorumlusu ' + m.sorumlu);
    }
  });

  const turetilen = DB.timelogs.filter(l => l.modul).length;
  console.log('  · defter ' + DB.timelogs.length + ' satır · ' + turetilen +
    ' tanesi modül ilerlemesinden türetilmiş · haftalık defter ' + defterBas + "'de başlıyor");
}

/* ---------- 28. Proje maliyet zinciri (REVİZE 04) ----------
   `gerceklesenMaliyet` 14 kayıtta elle yazılı tek bir rakamdı ve hangi
   kalemden oluştuğu hiçbir yerde yazılı değildi. Alan kaldırıldı; dört kalem
   ayrı ayrı türetiliyor. Bu eksen üç şeyi kilitler: alan geri gelmesin ·
   iç maliyetin iki girdisi yazılı sabit kalsın · maliyeti hesaplanacak her
   personelin bir ücret ekseni olsun. */
head('28) Proje maliyet zinciri (REVİZE 04)');
{
  const C = DB.company;
  say(typeof C.isverenMaliyetKatsayisi === 'number' && C.isverenMaliyetKatsayisi >= 1,
    'DB.company.isverenMaliyetKatsayisi yazılı sabit değil — hesap sessizce değişir (VB-19)');
  say(typeof C.aylikCalismaSaati === 'number' && C.aylikCalismaSaati > 0,
    'DB.company.aylikCalismaSaati yazılı sabit değil (VB-19)');

  DB.projects.forEach(p => {
    say(!('gerceklesenMaliyet' in p),
      p.kod + ' gerceklesenMaliyet alanı geri gelmiş — maliyet türetilir, saklanmaz (L-08)');
  });

  /* 28a. `maas` XOR `saatlikUcret` — iç maliyet türetmesi bu sözleşmeye dayanır
     ve `app-personel-form.html:146` onu zaten uyguluyor. Bozulursa türetme ya
     iki kez sayar ya hiç sayamaz. */
  DB.employees.forEach(e => {
    const m = (e.maas || 0) > 0, u = (e.saatlikUcret || 0) > 0;
    say(m !== u, e.kod + ' maas(' + (e.maas || 0) + ') XOR saatlikUcret(' +
      (e.saatlikUcret || 0) + ') bozuldu — iç maliyet türetilemez');
    say(!('icMaliyetSaat' in e),
      e.kod + ' icMaliyetSaat alanı açılmış — iç maliyet iki var olan alandan TÜRETİLİR, saklanmaz (L-08 · V-46)');
  });

  /* 28b. Projeli onaylı zaman kaydı olan her personelin maliyet ekseni olmalı —
     yoksa o saatler maliyete hiç girmez ve toplam sessizce eksik kalır (L-22). */
  const ucretsiz = new Set();
  DB.timelogs.filter(l => l.proje && l.onay === 'Onaylandı').forEach(l => {
    const e = DB.employees.filter(x => x.kod === l.personel)[0];
    if (!e || ((e.maas || 0) <= 0 && (e.saatlikUcret || 0) <= 0)) ucretsiz.add(l.personel);
  });
  say(ucretsiz.size === 0,
    'projeli onaylı zaman kaydı olan şu personelin ücret ekseni yok: ' + [...ucretsiz].join(', '));

  /* 28c. Projeye bağlı satın alma gerçekten o projeye ait olmalı */
  DB.purchases.filter(x => x.proje).forEach(x => {
    say(DB.projects.some(p => p.kod === x.proje),
      x.kod + ' proje=' + x.proje + ' → DB.projects içinde yok');
  });

  const sum = a => a.reduce((s, x) => s + x, 0);
  const say2 = (kod) => {
    const on = DB.timelogs.filter(l => l.proje === kod && l.onay === 'Onaylandı');
    return sum(on.map(l => l.sure * (
      (DB.employees.filter(e => e.kod === l.personel)[0] || {}).saatlikUcret > 0
        ? DB.employees.filter(e => e.kod === l.personel)[0].saatlikUcret
        : Math.round((DB.employees.filter(e => e.kod === l.personel)[0] || {}).maas *
            C.isverenMaliyetKatsayisi / C.aylikCalismaSaati))));
  };
  const olculen = DB.projects.filter(p => say2(p.kod) > 0).length;
  console.log('  · iç maliyet ekseni: ' + DB.employees.length + ' personelin ' +
    DB.employees.filter(e => (e.maas || 0) > 0).length + "'i maaş, " +
    DB.employees.filter(e => (e.saatlikUcret || 0) > 0).length + "'i saat ücreti · " +
    'personel maliyeti ölçülebilen proje: ' + olculen + ' / ' + DB.projects.length);
}

console.log('\n' + (bad === 0
  ? 'TEMİZ — ' + checks + ' kontrol, canonical çelişki yok'
  : 'ÇELİŞKİ — ' + bad + ' / ' + checks + ' kontrol başarısız'));
process.exit(bad ? 1 : 0);
