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

console.log('\n' + (bad === 0
  ? 'TEMİZ — ' + checks + ' kontrol, canonical çelişki yok'
  : 'ÇELİŞKİ — ' + bad + ' / ' + checks + ' kontrol başarısız'));
process.exit(bad ? 1 : 0);
