/* =====================================================================
   GAVIAWORKS CRM — PROJE VE İŞ VERİSİ
   Projeler · Modüller · Milestone · Sprint · Görevler · Alt görevler ·
   Departmanlar arası iş talepleri · Hatalar · Testler · Teslimler ·
   Değişiklik talepleri · Onaylar · Aktivite kayıtları
   ===================================================================== */
window.DB = window.DB || {};

/* ---- Görev sözlükleri (PROMPT.md §12) -------------------------------- */
DB.taskStatuses = ['Taslak','Havuzda','Atama bekliyor','Atandı','Kabul bekliyor','Planlandı',
  'Başlanmadı','Devam ediyor','Bilgi bekliyor','Müşteri bekleniyor','Departman bekleniyor',
  'Engellendi','Kontrol bekliyor','Revize bekliyor','Revizede','Onay bekliyor','Tamamlandı',
  'İptal edildi','Arşivlendi'];

DB.taskTypes = ['Genel görev','Müşteri görevi','Proje görevi','Satış görevi','Ön analiz görevi',
  'Tasarım görevi','Yazılım geliştirme görevi','Test görevi','Hata','Revizyon','Destek talebi',
  'Satın alma görevi','Personel görevi','Demirbaş görevi','Araç görevi','Toplantı aksiyonu',
  'Onay görevi','Tekrarlayan görev'];

DB.priorities = ['Kritik','Yüksek','Orta','Düşük'];
DB.impacts = ['Çok yüksek','Yüksek','Orta','Düşük'];

/* ---- Proje · hata · test sözlükleri (VB-22) ----------------------------
   Altı eksenin `DB.*` karşılığı yoktu; üç form ekranı kümeleri liste
   ekranlarının süzgecinden ve mevcut kayıtlardan TÜRETMEK zorunda kalmıştı.
   Sonuç: veride hiç kullanılmayan değer forma girmiyor (proje 'Askıda'),
   tek değerli eksende select tek seçenekli kalıyordu (VB-17 ile aynı sınıf).
   Kümeler ekranlarda zaten yazılı olan değerlerden alındı — uydurulmadı. */
DB.projectStatuses = ['Planlama','Geliştirme','Test','Teslim','Askıda'];
DB.healthLevels    = ['İyi','Dikkat','Riskli'];
/* ⚠️ 'Tamamlandı' bir FAZ DEĞİL, bir durumdur (VB-20). Bugün 9 projede `faz`
   alanında duruyor; sözlük gerçeği anlatsın diye listelendi ve VB-20 turunda
   `durum` eksenine taşınacak. Sözlük bugünü yazar, niyeti değil (L-21). */
DB.projectPhases   = ['Faz 1','Faz 2','Faz 3','Tamamlandı'];
DB.bugStatuses     = ['Açık','Devam ediyor','Kapandı'];
DB.reproLevels     = ['Her zaman','Bazen','Nadiren','Tekrarlanamadı'];
DB.testResults     = ['Başarılı','Kısmi','Başarısız'];

/* Durum geçiş kuralları — yetki + zorunlu alan + bildirim */
DB.taskTransitions = {
  'Havuzda':        { next:['Atandı','İptal edildi'],                       yetki:['pm','takimlideri','depmudur','sahip','operasyon'], zorunlu:['sorumlu'],       bildirim:['sorumlu'] },
  'Atandı':         { next:['Kabul bekliyor','Devam ediyor','Engellendi'],   yetki:['sorumlu','pm'],                                    zorunlu:[],                bildirim:['veren'] },
  'Kabul bekliyor': { next:['Devam ediyor','Havuzda'],                       yetki:['sorumlu'],                                         zorunlu:[],                bildirim:['veren'] },
  'Devam ediyor':   { next:['Kontrol bekliyor','Engellendi','Bilgi bekliyor','Müşteri bekleniyor'], yetki:['sorumlu'],                  zorunlu:['gercekSure'],    bildirim:['veren','kontrol'] },
  'Kontrol bekliyor':{ next:['Revize bekliyor','Onay bekliyor','Tamamlandı'], yetki:['kontrolEden','pm'],                               zorunlu:['ciktiLink'],     bildirim:['sorumlu'] },
  'Revize bekliyor':{ next:['Revizede'],                                     yetki:['sorumlu'],                                         zorunlu:['revizeNot'],     bildirim:['sorumlu'] },
  'Revizede':       { next:['Kontrol bekliyor'],                             yetki:['sorumlu'],                                         zorunlu:[],                bildirim:['kontrol'] },
  'Onay bekliyor':  { next:['Tamamlandı','Revize bekliyor'],                 yetki:['onaylayan','pm','sahip'],                          zorunlu:[],                bildirim:['sorumlu','veren'] },
  'Engellendi':     { next:['Devam ediyor','İptal edildi'],                  yetki:['sorumlu','pm'],                                    zorunlu:['engelNedeni'],   bildirim:['veren','pm'] },
  'Tamamlandı':     { next:['Arşivlendi','Revize bekliyor'],                 yetki:['pm','sahip'],                                      zorunlu:[],                bildirim:['veren','izleyiciler'] }
};

/* ---- Projeler (PROMPT.md §11) ----------------------------------------- */
DB.projects = [
  { kod:'PRJ-2026-001', ad:'Vitalis Hasta Randevu Mobil Uygulaması', musteri:'MUS-2024-002', musteriAd:'Vitalis Sağlık Grubu',
    pm:'EMP-003', ekip:['EMP-004','EMP-008','EMP-005','EMP-009'], durum:'Test', saglik:'Riskli',
    baslangic:'2026-03-02', planlananBitis:'2026-08-14', gercekBitis:null, ilerleme:82,
    sozlesmeTutari:880000, butce:540000, gerceklesenMaliyet:498000, tahminiSure:1240, harcananSure:1156,
    tur:'Mobil Uygulama', oncelik:'Yüksek', faz:'Faz 1', aktif:true,
    repo:'github.com/gaviaworks/vitalis-mobile', canli:'—', test:'test.vitalis-app.com',
    tasarim:'figma.com/vitalis', sunucu:'AWS eu-central-1', teknoloji:['React Native','NestJS','PostgreSQL'],
    ucuncuTaraf:['Twilio SMS','Firebase Push'], teknikSorumlu:'EMP-005', musteriSorumlu:'EMP-013',
    riskler:['App Store onay süresi belirsiz','Test ortamı verisi eksik'],
    gecikmeNedeni:'Müşteri içerik onayı 9 gün gecikti', sonGuncelleme:'2026-08-02' },
  { kod:'PRJ-2026-002', ad:'Anka Finans AI Kredi Skorlama Paneli', musteri:'MUS-2026-011', musteriAd:'Anka Finans Teknolojileri',
    pm:'EMP-003', ekip:['EMP-007','EMP-005','EMP-006'], durum:'Geliştirme', saglik:'İyi',
    baslangic:'2026-06-24', planlananBitis:'2026-09-04', gercekBitis:null, ilerleme:48,
    sozlesmeTutari:500000, butce:380000, gerceklesenMaliyet:171000, tahminiSure:820, harcananSure:392,
    tur:'Yapay Zekâ Çözümü', oncelik:'Yüksek', faz:'Faz 1', aktif:true,
    repo:'github.com/gaviaworks/anka-scoring', canli:'—', test:'staging.anka-score.com',
    tasarim:'figma.com/anka', sunucu:'Müşteri VPC', teknoloji:['Python','FastAPI','React','pgvector'],
    ucuncuTaraf:['OpenAI API','Findeks servisi'], teknikSorumlu:'EMP-007', musteriSorumlu:'EMP-002',
    riskler:['Model doğruluğu regülasyon eşiğinin üstünde tutulmalı'],
    gecikmeNedeni:null, sonGuncelleme:'2026-08-02' },
  { kod:'PRJ-2026-003', ad:'Marmara Enerji Mobil Operasyon ERP — Faz 1', musteri:'MUS-2025-005', musteriAd:'Marmara Enerji Sistemleri',
    pm:'EMP-003', ekip:['EMP-005','EMP-006','EMP-004','EMP-009','EMP-010'], durum:'Geliştirme', saglik:'Dikkat',
    baslangic:'2025-09-15', planlananBitis:'2026-09-30', gercekBitis:null, ilerleme:64,
    sozlesmeTutari:920000, butce:720000, gerceklesenMaliyet:512000, tahminiSure:2100, harcananSure:1388,
    tur:'CRM / ERP', oncelik:'Yüksek', faz:'Faz 1', aktif:true,
    repo:'github.com/gaviaworks/marmara-erp', canli:'erp.marmaraenerji.com', test:'test-erp.marmaraenerji.com',
    tasarim:'figma.com/marmara-erp', sunucu:'Müşteri on-premise', teknoloji:['Node.js','React','PostgreSQL','Redis'],
    ucuncuTaraf:['Logo ERP','e-Fatura'], teknikSorumlu:'EMP-005', musteriSorumlu:'EMP-002',
    riskler:['Kapsam büyümesi','Logo entegrasyon dokümantasyonu yetersiz'],
    gecikmeNedeni:'Faz 2 kapsam tartışması Faz 1 testini yavaşlattı', sonGuncelleme:'2026-08-01' },
  { kod:'PRJ-2026-004', ad:'Öz Gıda Üretim Takip ve Fire Raporlama', musteri:'MUS-2026-009', musteriAd:'Öz Gıda Üretim A.Ş.',
    pm:'EMP-003', ekip:['EMP-006','EMP-005'], durum:'Teslim', saglik:'İyi',
    baslangic:'2026-05-18', planlananBitis:'2026-07-24', gercekBitis:'2026-07-22', ilerleme:100,
    sozlesmeTutari:295000, butce:210000, gerceklesenMaliyet:194000, tahminiSure:460, harcananSure:428,
    tur:'Süreç Otomasyonu', oncelik:'Orta', faz:'Faz 1', aktif:true,
    repo:'github.com/gaviaworks/ozgida-uretim', canli:'uretim.ozgida.com.tr', test:'—',
    tasarim:'figma.com/ozgida', sunucu:'Gavia yönetimli VPS', teknoloji:['Node.js','Vue','MySQL'],
    ucuncuTaraf:[], teknikSorumlu:'EMP-005', musteriSorumlu:'EMP-002',
    riskler:[], gecikmeNedeni:null, sonGuncelleme:'2026-07-25' },
  { kod:'PRJ-2026-005', ad:'Nova Turizm Rezervasyon Portalı', musteri:'MUS-2026-007', musteriAd:'Nova Turizm Yatırımları',
    pm:'EMP-003', ekip:['EMP-004','EMP-006','EMP-016'], durum:'Geliştirme', saglik:'İyi',
    baslangic:'2026-06-08', planlananBitis:'2026-09-18', gercekBitis:null, ilerleme:37,
    sozlesmeTutari:420000, butce:260000, gerceklesenMaliyet:98000, tahminiSure:600, harcananSure:224,
    tur:'Web Uygulaması', oncelik:'Orta', faz:'Faz 1', aktif:true,
    repo:'github.com/gaviaworks/nova-rezervasyon', canli:'—', test:'demo.novaturizm.com',
    tasarim:'figma.com/nova', sunucu:'Gavia yönetimli VPS', teknoloji:['Next.js','PostgreSQL'],
    ucuncuTaraf:['iyzico','Google Maps'], teknikSorumlu:'EMP-006', musteriSorumlu:'EMP-014',
    riskler:['Ödeme sağlayıcı entegrasyon testi bekliyor'], gecikmeNedeni:null, sonGuncelleme:'2026-07-31' },
  { kod:'PRJ-2026-006', ad:'Trakya Otomotiv Servis Randevu Sistemi', musteri:'MUS-2026-010', musteriAd:'Trakya Otomotiv Servis',
    pm:'EMP-003', ekip:['EMP-006','EMP-009'], durum:'Geliştirme', saglik:'Riskli',
    baslangic:'2026-03-16', planlananBitis:'2026-06-26', gercekBitis:null, ilerleme:71,
    sozlesmeTutari:185000, butce:120000, gerceklesenMaliyet:139000, tahminiSure:280, harcananSure:326,
    tur:'Web Uygulaması', oncelik:'Kritik', faz:'Faz 1', aktif:true,
    repo:'github.com/gaviaworks/trakya-randevu', canli:'—', test:'test.trakyaotomotiv.com',
    tasarim:'figma.com/trakya', sunucu:'Gavia yönetimli VPS', teknoloji:['Laravel','Vue','MySQL'],
    ucuncuTaraf:['Netgsm SMS'], teknikSorumlu:'EMP-006', musteriSorumlu:'EMP-013',
    riskler:['Bütçe %16 aşıldı','Müşteri memnuniyeti düşük','7 revizyon turu'],
    gecikmeNedeni:'Kapsam dışı revizyon talepleri kabul edildi', sonGuncelleme:'2026-07-29' },
  { kod:'PRJ-2026-007', ad:'Ege Eğitim Veli Portalı', musteri:'MUS-2025-004', musteriAd:'Ege Eğitim Kurumları',
    pm:'EMP-003', ekip:['EMP-006','EMP-004'], durum:'Planlama', saglik:'İyi',
    baslangic:'2026-08-18', planlananBitis:'2026-10-16', gercekBitis:null, ilerleme:6,
    sozlesmeTutari:336000, butce:200000, gerceklesenMaliyet:12000, tahminiSure:420, harcananSure:26,
    tur:'Web Uygulaması', oncelik:'Orta', faz:'Faz 1', aktif:true,
    repo:'—', canli:'—', test:'—', tasarim:'figma.com/ege-veli', sunucu:'Mevcut okul sunucusu',
    teknoloji:['Next.js','PostgreSQL'], ucuncuTaraf:['Netgsm SMS'],
    teknikSorumlu:'EMP-006', musteriSorumlu:'EMP-002',
    riskler:['Mevcut okul yönetim sisteminin API desteği sınırlı'], gecikmeNedeni:null, sonGuncelleme:'2026-08-01' },
  { kod:'PRJ-2025-008', ad:'Deniz Lojistik Sevkiyat Takip Paneli', musteri:'MUS-2024-001', musteriAd:'Deniz Lojistik A.Ş.',
    pm:'EMP-003', ekip:['EMP-005','EMP-006'], durum:'Teslim', saglik:'İyi',
    baslangic:'2025-02-10', planlananBitis:'2025-07-30', gercekBitis:'2025-07-28', ilerleme:100,
    sozlesmeTutari:960000, butce:600000, gerceklesenMaliyet:571000, tahminiSure:1400, harcananSure:1352,
    tur:'Web Uygulaması', oncelik:'Yüksek', faz:'Tamamlandı', aktif:true, arsiv:true,
    repo:'github.com/gaviaworks/deniz-sevkiyat', canli:'panel.denizlojistik.com', test:'—',
    tasarim:'figma.com/deniz', sunucu:'Müşteri bulut', teknoloji:['Node.js','React','PostgreSQL'],
    ucuncuTaraf:['Google Maps','e-İrsaliye'], teknikSorumlu:'EMP-005', musteriSorumlu:'EMP-002',
    riskler:[], gecikmeNedeni:null, sonGuncelleme:'2025-08-04' },

  /* ---- Sistem öncesi teslim edilen projeler (VB-27) ---------------------
     `DB.surveys[].ilgili` altı anket için var olmayan proje kodu taşıyordu;
     anketler 2025-2026 aralığına yayılmış "Proje teslimi" anketleriydi ve
     müşterilerin `projeSayisi` ömür boyu sayacı da bu projeleri zaten
     sayıyordu (örn. MUS-2024-001 → 3 proje, veride 1 kayıt vardı).
     Karar (assumptions V-37): anketler değil VERİ tamamlandı — altı proje
     geçmiş teslim olarak yazıldı, hepsi `arsiv:true` olduğu için aktif
     listeleri ve KPI'ları etkilemez. `sozlesmeTutari` her müşterinin
     `toplamCiro` boşluğunun içinde kalır; sözleşme kaydı sistemde yoktur
     (sistem öncesi iş), bu yüzden `DB.contracts`'ta karşılığı aranmaz. */
  { kod:'PRJ-2024-011', ad:'Deniz Lojistik Araç Takip Entegrasyonu', musteri:'MUS-2024-001',
    musteriAd:'Deniz Lojistik A.Ş.', pm:'EMP-003', ekip:['EMP-005','EMP-006'],
    durum:'Teslim', saglik:'İyi',
    baslangic:'2024-08-05', planlananBitis:'2025-10-17', gercekBitis:'2025-10-31', ilerleme:100,
    sozlesmeTutari:620000, butce:400000, gerceklesenMaliyet:388000, tahminiSure:940, harcananSure:962,
    tur:'Entegrasyon', oncelik:'Orta', faz:'Tamamlandı', aktif:true, arsiv:true,
    repo:'github.com/gaviaworks/deniz-arac-takip', canli:'—', test:'—',
    tasarim:'—', sunucu:'Müşteri bulut', teknoloji:['Node.js','PostgreSQL'],
    ucuncuTaraf:['Arvento'], teknikSorumlu:'EMP-005', musteriSorumlu:'EMP-002',
    riskler:[], gecikmeNedeni:null, sonGuncelleme:'2025-11-03' },

  { kod:'PRJ-2025-009', ad:'Vitalis Laboratuvar Sonuç Portalı', musteri:'MUS-2024-002',
    musteriAd:'Vitalis Sağlık Grubu', pm:'EMP-003', ekip:['EMP-004','EMP-009'],
    durum:'Teslim', saglik:'İyi',
    baslangic:'2025-06-02', planlananBitis:'2026-03-27', gercekBitis:'2026-04-03', ilerleme:100,
    sozlesmeTutari:420000, butce:280000, gerceklesenMaliyet:268000, tahminiSure:720, harcananSure:735,
    tur:'Web Uygulaması', oncelik:'Orta', faz:'Tamamlandı', aktif:true, arsiv:true,
    repo:'github.com/gaviaworks/vitalis-lab', canli:'lab.vitalis.com.tr', test:'—',
    tasarim:'figma.com/vitalis-lab', sunucu:'Müşteri bulut', teknoloji:['React','Node.js'],
    ucuncuTaraf:['HL7 arayüzü'], teknikSorumlu:'EMP-004', musteriSorumlu:'EMP-002',
    riskler:[], gecikmeNedeni:null, sonGuncelleme:'2026-04-06' },

  { kod:'PRJ-2025-010', ad:'Anadolu Perakende Stok Sayım Uygulaması', musteri:'MUS-2025-003',
    musteriAd:'Anadolu Perakende Ticaret Ltd.', pm:'EMP-003', ekip:['EMP-006','EMP-009'],
    durum:'Teslim', saglik:'Dikkat',
    baslangic:'2025-04-14', planlananBitis:'2025-11-14', gercekBitis:'2025-11-28', ilerleme:100,
    sozlesmeTutari:480000, butce:320000, gerceklesenMaliyet:341000, tahminiSure:820, harcananSure:889,
    tur:'Mobil Uygulama', oncelik:'Orta', faz:'Tamamlandı', aktif:true, arsiv:true,
    repo:'github.com/gaviaworks/anadolu-stok', canli:'—', test:'—',
    tasarim:'figma.com/anadolu-stok', sunucu:'Şirket bulut', teknoloji:['React Native','Node.js'],
    ucuncuTaraf:['Barkod SDK'], teknikSorumlu:'EMP-006', musteriSorumlu:'EMP-013',
    riskler:[], gecikmeNedeni:'Devreye alma sonrası kullanıcı eğitimi planlanandan uzun sürdü',
    sonGuncelleme:'2025-12-08' },

  { kod:'PRJ-2025-012', ad:'Kılıç Tekstil Üretim Takip Paneli', musteri:'MUS-2025-006',
    musteriAd:'Kılıç Tekstil San. Tic.', pm:'EMP-003', ekip:['EMP-005'],
    durum:'Teslim', saglik:'İyi',
    baslangic:'2025-07-07', planlananBitis:'2026-01-23', gercekBitis:'2026-01-30', ilerleme:100,
    sozlesmeTutari:340000, butce:220000, gerceklesenMaliyet:214000, tahminiSure:610, harcananSure:604,
    tur:'Web Uygulaması', oncelik:'Orta', faz:'Tamamlandı', aktif:true, arsiv:true,
    repo:'github.com/gaviaworks/kilic-uretim', canli:'panel.kilictekstil.com', test:'—',
    tasarim:'—', sunucu:'Müşteri sunucusu', teknoloji:['Vue','Node.js','MySQL'],
    ucuncuTaraf:[], teknikSorumlu:'EMP-005', musteriSorumlu:'EMP-002',
    riskler:[], gecikmeNedeni:null, sonGuncelleme:'2026-02-02' },

  { kod:'PRJ-2026-008', ad:'Anka Finans Risk Raporlama Pilotu', musteri:'MUS-2026-011',
    musteriAd:'Anka Finans Teknolojileri', pm:'EMP-003', ekip:['EMP-007'],
    durum:'Teslim', saglik:'İyi',
    baslangic:'2026-02-16', planlananBitis:'2026-05-22', gercekBitis:'2026-05-29', ilerleme:100,
    sozlesmeTutari:190000, butce:130000, gerceklesenMaliyet:124000, tahminiSure:340, harcananSure:352,
    tur:'Veri ve Raporlama', oncelik:'Orta', faz:'Tamamlandı', aktif:true, arsiv:true,
    repo:'github.com/gaviaworks/anka-risk-pilot', canli:'—', test:'—',
    tasarim:'—', sunucu:'Müşteri bulut', teknoloji:['Python','PostgreSQL'],
    ucuncuTaraf:[], teknikSorumlu:'EMP-007', musteriSorumlu:'EMP-014',
    riskler:[], gecikmeNedeni:null, sonGuncelleme:'2026-06-01' },

  { kod:'PRJ-2023-014', ad:'Karadeniz Tarım Ürün Alım Kayıt Sistemi', musteri:'MUS-2023-012',
    musteriAd:'Karadeniz Tarım Kooperatifi', pm:'EMP-003', ekip:['EMP-006'],
    durum:'Teslim', saglik:'İyi',
    baslangic:'2023-11-06', planlananBitis:'2025-03-31', gercekBitis:'2025-04-18', ilerleme:100,
    sozlesmeTutari:120000, butce:82000, gerceklesenMaliyet:79000, tahminiSure:280, harcananSure:291,
    tur:'Web Uygulaması', oncelik:'Düşük', faz:'Tamamlandı', aktif:true, arsiv:true,
    repo:'github.com/gaviaworks/karadeniz-alim', canli:'—', test:'—',
    tasarim:'—', sunucu:'Şirket bulut', teknoloji:['PHP','MySQL'],
    ucuncuTaraf:[], teknikSorumlu:'EMP-006', musteriSorumlu:'EMP-002',
    riskler:[], gecikmeNedeni:null, sonGuncelleme:'2025-04-22' }
];

/* ---- Proje modülleri --------------------------------------------------- */
DB.projectModules = [
  { kod:'MOD-001', proje:'PRJ-2026-001', ad:'Randevu oluşturma akışı', durum:'Tamamlandı', ilerleme:100, sorumlu:'EMP-008', efor:180 },
  { kod:'MOD-002', proje:'PRJ-2026-001', ad:'Tahlil sonuç görüntüleme', durum:'Test', ilerleme:88, sorumlu:'EMP-008', efor:220 },
  { kod:'MOD-003', proje:'PRJ-2026-001', ad:'Bildirim ve hatırlatma', durum:'Test', ilerleme:75, sorumlu:'EMP-005', efor:140 },
  { kod:'MOD-004', proje:'PRJ-2026-001', ad:'Yönetim paneli', durum:'Geliştirme', ilerleme:62, sorumlu:'EMP-006', efor:260 },
  { kod:'MOD-005', proje:'PRJ-2026-002', ad:'Veri hazırlama hattı', durum:'Tamamlandı', ilerleme:100, sorumlu:'EMP-007', efor:160 },
  { kod:'MOD-006', proje:'PRJ-2026-002', ad:'Skorlama modeli', durum:'Geliştirme', ilerleme:70, sorumlu:'EMP-007', efor:240 },
  { kod:'MOD-007', proje:'PRJ-2026-002', ad:'Başvuru inceleme paneli', durum:'Geliştirme', ilerleme:35, sorumlu:'EMP-006', efor:200 },
  { kod:'MOD-008', proje:'PRJ-2026-002', ad:'Karar raporlama', durum:'Planlama', ilerleme:0, sorumlu:'EMP-005', efor:120 },
  { kod:'MOD-009', proje:'PRJ-2026-003', ad:'Mobil ekip yönetimi', durum:'Tamamlandı', ilerleme:100, sorumlu:'EMP-005', efor:340 },
  { kod:'MOD-010', proje:'PRJ-2026-003', ad:'İş emri takibi', durum:'Test', ilerleme:92, sorumlu:'EMP-006', efor:420 },
  { kod:'MOD-011', proje:'PRJ-2026-003', ad:'Logo ERP entegrasyonu', durum:'Geliştirme', ilerleme:44, sorumlu:'EMP-005', efor:380 },
  { kod:'MOD-012', proje:'PRJ-2026-003', ad:'Rapor merkezi', durum:'Planlama', ilerleme:10, sorumlu:'EMP-006', efor:300 },
  { kod:'MOD-013', proje:'PRJ-2026-005', ad:'Rezervasyon motoru', durum:'Geliştirme', ilerleme:52, sorumlu:'EMP-006', efor:280 },
  { kod:'MOD-014', proje:'PRJ-2026-005', ad:'Ödeme entegrasyonu', durum:'Planlama', ilerleme:12, sorumlu:'EMP-006', efor:160 },
  { kod:'MOD-015', proje:'PRJ-2026-006', ad:'Servis randevu takvimi', durum:'Test', ilerleme:90, sorumlu:'EMP-006', efor:180 }
];

/* ---- Milestone --------------------------------------------------------- */
/* Milestone = sözleşmenin ödeme planındaki taksit.
   Canonical (para konvansiyonu: misc.js → DB.contracts başlığı):
   · `odeme`   = taksitin **NET** tutarı (KDV hariç) = bağlı faturanın `tutar`ı.
   · Bir sözleşmenin taksitlerinin `odeme` toplamı = sözleşmenin `tutar`ı (net) —
     TAM SET burada tutulur, eksik taksit bırakılmaz.
   · `taksit`  = ödeme planındaki sıra (1 tabanlı) · `sozlesme` = bağlı sözleşme.
   · Bir milestone'a en fazla BİR fatura bağlanır; `odemeDurum` o faturanın
     tahsilat kaydındaki durumu yansıtır.
   SZL-2026-022 (aylık bakım) proje bazlı değildir — taksitleri milestone olarak
   değil, aylık fatura olarak yürür. */
DB.milestones = [
  /* PRJ-2026-001 · SZL-2026-019 · %30 · %30 · %40 → 264.000 + 264.000 + 352.000 = 880.000 */
  { kod:'MS-001', proje:'PRJ-2026-001', sozlesme:'SZL-2026-019', taksit:1, ad:'Beta sürüm teslimi', tarih:'2026-07-10', durum:'Tamamlandı', odeme:264000, odemeDurum:'Ödendi', ilerleme:100 },
  { kod:'MS-002', proje:'PRJ-2026-001', sozlesme:'SZL-2026-019', taksit:2, ad:'Store yayın onayı', tarih:'2026-08-14', durum:'Yaklaşıyor', odeme:264000, odemeDurum:'Bekliyor', ilerleme:82 },
  { kod:'MS-019', proje:'PRJ-2026-001', sozlesme:'SZL-2026-019', taksit:3, ad:'Yayın sonrası kabul ve devir', tarih:'2026-08-28', durum:'Planlandı', odeme:352000, odemeDurum:'Bekliyor', ilerleme:0 },
  /* PRJ-2026-002 · SZL-2026-021 · %50 peşin · %50 teslimde → 300.000 + 300.000 = 600.000 */
  { kod:'MS-003', proje:'PRJ-2026-002', sozlesme:'SZL-2026-021', taksit:1, ad:'POC kabul', tarih:'2026-07-25', durum:'Tamamlandı', odeme:250000, odemeDurum:'Ödendi', ilerleme:100 },
  { kod:'MS-004', proje:'PRJ-2026-002', sozlesme:'SZL-2026-021', taksit:2, ad:'Canlıya alma', tarih:'2026-09-04', durum:'Planlandı', odeme:250000, odemeDurum:'Bekliyor', ilerleme:48 },
  /* PRJ-2026-003 · SZL-2025-018 · 6 eşit milestone → 184.000 × 6 = 1.104.000 */
  { kod:'MS-010', proje:'PRJ-2026-003', sozlesme:'SZL-2025-018', taksit:1, ad:'Analiz ve altyapı kurulumu', tarih:'2025-11-28', durum:'Tamamlandı', odeme:153333, odemeDurum:'Ödendi', ilerleme:100 },
  { kod:'MS-011', proje:'PRJ-2026-003', sozlesme:'SZL-2025-018', taksit:2, ad:'Çekirdek modül teslimi', tarih:'2026-01-30', durum:'Tamamlandı', odeme:153333, odemeDurum:'Ödendi', ilerleme:100 },
  { kod:'MS-012', proje:'PRJ-2026-003', sozlesme:'SZL-2025-018', taksit:3, ad:'Mobil ekip uygulaması', tarih:'2026-03-27', durum:'Tamamlandı', odeme:153333, odemeDurum:'Ödendi', ilerleme:100 },
  { kod:'MS-013', proje:'PRJ-2026-003', sozlesme:'SZL-2025-018', taksit:4, ad:'Logo ERP entegrasyonu', tarih:'2026-05-29', durum:'Tamamlandı', odeme:153333, odemeDurum:'Ödendi', ilerleme:100 },
  { kod:'MS-005', proje:'PRJ-2026-003', sozlesme:'SZL-2025-018', taksit:5, ad:'Faz 1 modül teslimi', tarih:'2026-08-29', durum:'Yaklaşıyor', odeme:153333, odemeDurum:'Bekliyor', ilerleme:64 },
  { kod:'MS-006', proje:'PRJ-2026-003', sozlesme:'SZL-2025-018', taksit:6, ad:'Entegrasyon testi ve Faz 1 kapanışı', tarih:'2026-09-30', durum:'Planlandı', odeme:153335, odemeDurum:'Bekliyor', ilerleme:20 },
  /* PRJ-2026-004 · SZL-2026-020 · %40 · %30 · %30 → 141.600 + 106.200 + 106.200 = 354.000 */
  { kod:'MS-014', proje:'PRJ-2026-004', sozlesme:'SZL-2026-020', taksit:1, ad:'Analiz ve prototip onayı', tarih:'2026-06-05', durum:'Tamamlandı', odeme:118000, odemeDurum:'Ödendi', ilerleme:100 },
  { kod:'MS-015', proje:'PRJ-2026-004', sozlesme:'SZL-2026-020', taksit:2, ad:'Üretim takip modülü teslimi', tarih:'2026-06-30', durum:'Tamamlandı', odeme:88500, odemeDurum:'Ödendi', ilerleme:100 },
  { kod:'MS-009', proje:'PRJ-2026-004', sozlesme:'SZL-2026-020', taksit:3, ad:'Nihai teslim', tarih:'2026-07-24', durum:'Tamamlandı', odeme:88500, odemeDurum:'Bekliyor', ilerleme:100 },
  /* PRJ-2026-005 · SZL-2026-023 · %30 · %30 · %40 → 126.000 + 126.000 + 168.000 = 420.000 */
  { kod:'MS-016', proje:'PRJ-2026-005', sozlesme:'SZL-2026-023', taksit:1, ad:'Kapsam ve tasarım onayı', tarih:'2026-06-26', durum:'Tamamlandı', odeme:126000, odemeDurum:'Ödendi', ilerleme:100 },
  { kod:'MS-007', proje:'PRJ-2026-005', sozlesme:'SZL-2026-023', taksit:2, ad:'Rezervasyon motoru demo', tarih:'2026-08-22', durum:'Yaklaşıyor', odeme:126000, odemeDurum:'Bekliyor', ilerleme:52 },
  { kod:'MS-017', proje:'PRJ-2026-005', sozlesme:'SZL-2026-023', taksit:3, ad:'Portalın canlıya alınması', tarih:'2026-09-18', durum:'Planlandı', odeme:168000, odemeDurum:'Bekliyor', ilerleme:0 },
  /* PRJ-2026-006 · SZL-2026-024 · %50 peşin · %50 teslimde → 92.500 + 92.500 = 185.000 */
  { kod:'MS-018', proje:'PRJ-2026-006', sozlesme:'SZL-2026-024', taksit:1, ad:'Sözleşme peşinatı', tarih:'2026-03-16', durum:'Tamamlandı', odeme:92500, odemeDurum:'Ödendi', ilerleme:100 },
  { kod:'MS-008', proje:'PRJ-2026-006', sozlesme:'SZL-2026-024', taksit:2, ad:'Canlıya alma', tarih:'2026-06-26', durum:'Gecikti', odeme:92500, odemeDurum:'Bekliyor', ilerleme:71 }
];

/* ---- Sprintler --------------------------------------------------------- */
/* `planlanan` / `tamamlanan` SAAT cinsindendir.
   `gorevSayisi` = sprintin GERÇEK görev sayısıdır. `DB.tasks` prototipte yalnız
   25 temsili görev tutar (sprintli olan 12'si), yani sprintin tüm görevleri modellenmiş
   değildir — `projeSayisi` gibi bilinçli bir "ömür boyu / gerçek sayaç" istisnasıdır
   (lessons L-08 istisnası, assumptions V-27).
   KURAL: `gorevSayisi` >= o sprinte bağlı `DB.tasks` kaydı sayısı. Ekranlar bu iki sayıyı
   aynı kolonda göstermez; modellenmiş kayıt sayısı "kayıtlı görev" diye ayrı etiketlenir. */
DB.sprints = [
  { kod:'SPR-2026-018', proje:'PRJ-2026-001', ad:'Sprint 18 — Test düzeltmeleri', baslangic:'2026-07-27', bitis:'2026-08-09', durum:'Devam ediyor', planlanan:64, tamamlanan:41, gorevSayisi:11 },
  { kod:'SPR-2026-019', proje:'PRJ-2026-002', ad:'Sprint 6 — Skorlama modeli', baslangic:'2026-07-27', bitis:'2026-08-09', durum:'Devam ediyor', planlanan:72, tamamlanan:38, gorevSayisi:9 },
  { kod:'SPR-2026-020', proje:'PRJ-2026-003', ad:'Sprint 22 — Logo entegrasyonu', baslangic:'2026-07-20', bitis:'2026-08-02', durum:'Tamamlandı', planlanan:80, tamamlanan:68, gorevSayisi:14 },
  { kod:'SPR-2026-021', proje:'PRJ-2026-003', ad:'Sprint 23 — Rapor merkezi', baslangic:'2026-08-03', bitis:'2026-08-16', durum:'Planlandı', planlanan:76, tamamlanan:0, gorevSayisi:12 },
  { kod:'SPR-2026-022', proje:'PRJ-2026-005', ad:'Sprint 4 — Rezervasyon akışı', baslangic:'2026-07-27', bitis:'2026-08-09', durum:'Devam ediyor', planlanan:56, tamamlanan:29, gorevSayisi:8 },
  { kod:'SPR-2026-023', proje:'PRJ-2026-006', ad:'Sprint 9 — Revizyon turu', baslangic:'2026-07-27', bitis:'2026-08-09', durum:'Devam ediyor', planlanan:40, tamamlanan:14, gorevSayisi:6 }
];

/* ---- Görevler (PROMPT.md §12) ------------------------------------------ */
/* BAĞ ALANI (lessons L-13): `destek` = görevi doğuran destek talebi (DST-*).
   PROMPT.md §18 "destek → görev" dönüşümünün veri karşılığıdır; `app-destek-detay.html`
   göreve dönüştürme mutasyonu bu alanı yazar. null = görev destek talebinden doğmadı.
   Hata bağı burada DEĞİL, `DB.bugs[].gorev` tarafında tutulur — tek yön, ayna alan yok.
   `etki` ekseni: hatadan doğan görevin etkisi hatanın şiddetinden gelir
   (şiddet 'Kritik' → etki 'Çok yüksek', diğer üçü birebir — components.md §9). */
DB.tasks = [
  { kod:'GRV-2026-101', baslik:'Tahlil sonuç ekranında PDF indirme hatası düzeltilecek', tur:'Hata',
    proje:'PRJ-2026-001', modul:'MOD-002', sprint:'SPR-2026-018', musteri:'MUS-2024-002', dep:'DEP-09',
    olusturan:'EMP-009', veren:'EMP-003', sorumlu:'EMP-008', yardimci:['EMP-005'], izleyiciler:['EMP-003','EMP-013'],
    kontrolEden:'EMP-009', onaylayan:'EMP-003', oncelik:'Kritik', etki:'Çok yüksek', aciliyet:'Yüksek', destek:null,
    durum:'Devam ediyor', baslangic:'2026-07-30', termin:'2026-08-01', tamamlanma:null,
    tahminiSure:8, gercekSure:6.5, faturalanabilir:6.5, ilerleme:70, revizyon:0, yenidenAcilma:1,
    aciklama:'iOS 17 cihazlarda PDF indirme akışı sessizce başarısız oluyor. Android etkilenmiyor.',
    amac:'Store yayın onayı öncesi kritik hata giderilmeli',
    kabulKriteri:'iOS 16/17/18 cihazlarda PDF indirilebilmeli, hata log kaydı temiz olmalı',
    beklenenCikti:'Düzeltme PR + test raporu', etiketler:['iOS','Kritik','Store engeli'], aktif:true },
  { kod:'GRV-2026-102', baslik:'App Store yayın notları ve ekran görüntüleri hazırlanacak', tur:'Proje görevi',
    proje:'PRJ-2026-001', modul:null, sprint:'SPR-2026-018', musteri:'MUS-2024-002', dep:'DEP-06',
    olusturan:'EMP-003', veren:'EMP-003', sorumlu:'EMP-004', yardimci:[], izleyiciler:['EMP-008'],
    kontrolEden:'EMP-003', onaylayan:'EMP-003', oncelik:'Yüksek', etki:'Orta', aciliyet:'Yüksek', destek:null,
    durum:'Kontrol bekliyor', baslangic:'2026-07-29', termin:'2026-08-02', tamamlanma:null,
    tahminiSure:6, gercekSure:5, faturalanabilir:5, ilerleme:100, revizyon:1, yenidenAcilma:0,
    aciklama:'6.7" ve 6.1" ekran görüntüleri, TR ve EN yayın notları.',
    amac:'Store başvurusunun eksiksiz gönderilmesi', kabulKriteri:'Apple ölçü şartlarına uygun 8 görsel',
    beklenenCikti:'Figma dosyası + dışa aktarılmış PNG seti', etiketler:['Store','Tasarım'], aktif:true },
  { kod:'GRV-2026-103', baslik:'Skorlama modeli doğruluk raporu çıkarılacak', tur:'Yazılım geliştirme görevi',
    proje:'PRJ-2026-002', modul:'MOD-006', sprint:'SPR-2026-019', musteri:'MUS-2026-011', dep:'DEP-10',
    olusturan:'EMP-003', veren:'EMP-003', sorumlu:'EMP-007', yardimci:[], izleyiciler:['EMP-002'],
    kontrolEden:'EMP-003', onaylayan:'EMP-001', oncelik:'Yüksek', etki:'Yüksek', aciliyet:'Orta', destek:null,
    durum:'Devam ediyor', baslangic:'2026-07-28', termin:'2026-08-07', tamamlanma:null,
    tahminiSure:16, gercekSure:9, faturalanabilir:9, ilerleme:55, revizyon:0, yenidenAcilma:0,
    aciklama:'Test kümesi üzerinde precision/recall ve karışıklık matrisi.',
    amac:'Regülasyon eşiğinin sağlandığının belgelenmesi', kabulKriteri:'Doğruluk ≥ %85, rapor PDF',
    beklenenCikti:'Doğruluk raporu', etiketler:['AI','Rapor'], aktif:true },
  { kod:'GRV-2026-104', baslik:'Başvuru inceleme paneli liste ekranı', tur:'Yazılım geliştirme görevi',
    proje:'PRJ-2026-002', modul:'MOD-007', sprint:'SPR-2026-019', musteri:'MUS-2026-011', dep:'DEP-07',
    olusturan:'EMP-003', veren:'EMP-003', sorumlu:'EMP-006', yardimci:['EMP-016'], izleyiciler:[],
    kontrolEden:'EMP-005', onaylayan:'EMP-003', oncelik:'Orta', etki:'Orta', aciliyet:'Orta', destek:null,
    durum:'Devam ediyor', baslangic:'2026-07-31', termin:'2026-08-08', tamamlanma:null,
    tahminiSure:20, gercekSure:7, faturalanabilir:7, ilerleme:40, revizyon:0, yenidenAcilma:0,
    aciklama:'Filtre, sayfalama ve skor bazlı sıralama içeren başvuru listesi.',
    amac:'Kredi uzmanının başvuruları hızlı taraması', kabulKriteri:'1000 kayıtta 300ms altı render',
    beklenenCikti:'React bileşeni + Storybook', etiketler:['Frontend'], aktif:true },
  { kod:'GRV-2026-105', baslik:'Logo ERP stok senkronizasyon servisi', tur:'Yazılım geliştirme görevi',
    proje:'PRJ-2026-003', modul:'MOD-011', sprint:'SPR-2026-021', musteri:'MUS-2025-005', dep:'DEP-08',
    olusturan:'EMP-003', veren:'EMP-003', sorumlu:'EMP-005', yardimci:[], izleyiciler:['EMP-010'],
    kontrolEden:'EMP-003', onaylayan:'EMP-003', oncelik:'Yüksek', etki:'Yüksek', aciliyet:'Orta', destek:null,
    durum:'Engellendi', baslangic:'2026-07-22', termin:'2026-08-05', tamamlanma:null,
    tahminiSure:24, gercekSure:11, faturalanabilir:11, ilerleme:45, revizyon:0, yenidenAcilma:0,
    aciklama:'Logo tarafındaki stok hareketlerinin 15 dakikada bir çekilmesi.',
    amac:'Stok verisinin tek kaynaktan yönetilmesi', kabulKriteri:'Fark raporu sıfır olmalı',
    beklenenCikti:'Servis + izleme paneli', engelNedeni:'Müşteri Logo API test hesabını hâlâ açmadı',
    etiketler:['Entegrasyon','Engelli'], aktif:true },
  { kod:'GRV-2026-106', baslik:'Rapor merkezi ekran tasarımları', tur:'Tasarım görevi',
    proje:'PRJ-2026-003', modul:'MOD-012', sprint:'SPR-2026-021', musteri:'MUS-2025-005', dep:'DEP-06',
    olusturan:'EMP-003', veren:'EMP-003', sorumlu:'EMP-004', yardimci:['EMP-015'], izleyiciler:[],
    kontrolEden:'EMP-003', onaylayan:'EMP-003', oncelik:'Orta', etki:'Orta', aciliyet:'Düşük', destek:null,
    durum:'Atandı', baslangic:'2026-08-03', termin:'2026-08-16', tamamlanma:null,
    tahminiSure:28, gercekSure:0, faturalanabilir:0, ilerleme:0, revizyon:0, yenidenAcilma:0,
    aciklama:'8 rapor ekranı için tasarım ve etkileşim akışları.',
    amac:'Faz 1 rapor modülünün geliştirmeye hazır hale gelmesi', kabulKriteri:'Tüm ekranlar 1440/768/390',
    beklenenCikti:'Figma dosyası', etiketler:['Tasarım'], aktif:true },
  { kod:'GRV-2026-107', baslik:'Trakya randevu ekranı 8. revizyon talebi', tur:'Revizyon',
    proje:'PRJ-2026-006', modul:'MOD-015', sprint:'SPR-2026-023', musteri:'MUS-2026-010', dep:'DEP-07',
    olusturan:'EMP-013', veren:'EMP-003', sorumlu:'EMP-006', yardimci:[], izleyiciler:['EMP-001','EMP-002'],
    kontrolEden:'EMP-003', onaylayan:'EMP-001', oncelik:'Kritik', etki:'Yüksek', aciliyet:'Yüksek', destek:null,
    durum:'Revize bekliyor', baslangic:'2026-07-25', termin:'2026-07-30', tamamlanma:null,
    tahminiSure:12, gercekSure:18, faturalanabilir:0, ilerleme:60, revizyon:7, yenidenAcilma:3,
    aciklama:'Müşteri randevu adımlarının sırasını yeniden değiştirmek istiyor.',
    amac:'Müşteri onayının alınması', kabulKriteri:'Müşteri yazılı onayı',
    beklenenCikti:'Güncellenmiş akış', revizeNot:'Kapsam dışı — ek teklif gerekiyor',
    gecikmeNedeni:'Kapsam dışı revizyon zinciri', etiketler:['Revizyon','Kapsam dışı','Eskalasyon'], aktif:true },
  { kod:'GRV-2026-108', baslik:'Nova rezervasyon takvimi bileşeni', tur:'Yazılım geliştirme görevi',
    proje:'PRJ-2026-005', modul:'MOD-013', sprint:'SPR-2026-022', musteri:'MUS-2026-007', dep:'DEP-07',
    olusturan:'EMP-003', veren:'EMP-003', sorumlu:'EMP-006', yardimci:['EMP-016'], izleyiciler:[],
    kontrolEden:'EMP-009', onaylayan:'EMP-003', oncelik:'Orta', etki:'Orta', aciliyet:'Orta', destek:null,
    durum:'Devam ediyor', baslangic:'2026-07-29', termin:'2026-08-09', tamamlanma:null,
    tahminiSure:22, gercekSure:12, faturalanabilir:12, ilerleme:50, revizyon:0, yenidenAcilma:0,
    aciklama:'Müsaitlik takvimi, çoklu oda seçimi ve fiyat gösterimi.',
    amac:'Rezervasyon akışının tamamlanması', kabulKriteri:'Mobilde dokunmatik kaydırma çalışmalı',
    beklenenCikti:'Bileşen + testler', etiketler:['Frontend'], aktif:true },
  { kod:'GRV-2026-109', baslik:'Ege Eğitim veli portalı bilgi mimarisi', tur:'Ön analiz görevi',
    proje:'PRJ-2026-007', modul:null, sprint:null, musteri:'MUS-2025-004', dep:'DEP-04',
    olusturan:'EMP-002', veren:'EMP-003', sorumlu:'EMP-003', yardimci:[], izleyiciler:['EMP-004'],
    kontrolEden:'EMP-001', onaylayan:'EMP-001', oncelik:'Orta', etki:'Orta', aciliyet:'Orta', destek:null,
    durum:'Devam ediyor', baslangic:'2026-08-01', termin:'2026-08-12', tamamlanma:null,
    tahminiSure:14, gercekSure:3, faturalanabilir:3, ilerleme:22, revizyon:0, yenidenAcilma:0,
    aciklama:'Veli, öğretmen ve idare rolleri için sayfa haritası.',
    amac:'Geliştirme öncesi kapsamın netleşmesi', kabulKriteri:'Onaylı sayfa haritası',
    beklenenCikti:'Bilgi mimarisi dokümanı', etiketler:['Analiz'], aktif:true },
  { kod:'GRV-2026-110', baslik:'Aylık sunucu maliyet raporu hazırlanacak', tur:'Tekrarlayan görev',
    proje:null, modul:null, sprint:null, musteri:null, dep:'DEP-12',
    olusturan:'EMP-001', veren:'EMP-001', sorumlu:'EMP-010', yardimci:[], izleyiciler:['EMP-012'],
    kontrolEden:'EMP-012', onaylayan:'EMP-001', oncelik:'Düşük', etki:'Düşük', aciliyet:'Düşük', destek:null,
    durum:'Devam ediyor', baslangic:'2026-08-01', termin:'2026-08-05', tamamlanma:null,
    tahminiSure:4, gercekSure:1, faturalanabilir:0, ilerleme:25, revizyon:0, yenidenAcilma:0,
    aciklama:'Tüm projelerin bulut maliyetleri proje bazında ayrıştırılacak.',
    amac:'Proje kârlılığının doğru hesaplanması', kabulKriteri:'Proje bazlı dağıtım tablosu',
    beklenenCikti:'Excel raporu', tekrar:'Aylık', etiketler:['DevOps','Tekrarlayan'], aktif:true },
  { kod:'GRV-2026-111', baslik:'Yeni geliştirici için ekipman zimmet hazırlığı', tur:'Demirbaş görevi',
    proje:null, modul:null, sprint:null, musteri:null, dep:'DEP-17',
    olusturan:'EMP-011', veren:'EMP-011', sorumlu:'EMP-012', yardimci:[], izleyiciler:['EMP-010'],
    kontrolEden:'EMP-011', onaylayan:'EMP-011', oncelik:'Orta', etki:'Orta', aciliyet:'Orta', destek:null,
    durum:'Havuzda', baslangic:null, termin:'2026-08-18', tamamlanma:null,
    tahminiSure:5, gercekSure:0, faturalanabilir:0, ilerleme:0, revizyon:0, yenidenAcilma:0,
    aciklama:'Dizüstü, monitör, klavye ve lisans hazırlığı.',
    amac:'İşe giriş gününde ekipmanın hazır olması', kabulKriteri:'İmzalı zimmet tutanağı',
    beklenenCikti:'Zimmet kaydı', etiketler:['İK','Zimmet'], aktif:true },
  { kod:'GRV-2026-112', baslik:'Anadolu Perakende geciken tahsilat takibi', tur:'Müşteri görevi',
    proje:null, modul:null, sprint:null, musteri:'MUS-2025-003', dep:'DEP-15',
    olusturan:'EMP-001', veren:'EMP-001', sorumlu:'EMP-012', yardimci:[], izleyiciler:['EMP-002'],
    kontrolEden:'EMP-001', onaylayan:'EMP-001', oncelik:'Kritik', etki:'Yüksek', aciliyet:'Yüksek', destek:null,
    durum:'Devam ediyor', baslangic:'2026-07-20', termin:'2026-07-31', tamamlanma:null,
    tahminiSure:6, gercekSure:4, faturalanabilir:0, ilerleme:60, revizyon:0, yenidenAcilma:0,
    aciklama:'FTR-2026-018 numaralı fatura 41 gündür ödenmedi.',
    amac:'Tahsilatın yapılması', kabulKriteri:'Ödeme planı yazılı teyidi',
    beklenenCikti:'Ödeme planı', etiketler:['Tahsilat','Riskli müşteri'], aktif:true },
  { kod:'GRV-2026-113', baslik:'Vitalis mobil regresyon test seti', tur:'Test görevi',
    proje:'PRJ-2026-001', modul:'MOD-002', sprint:'SPR-2026-018', musteri:'MUS-2024-002', dep:'DEP-11',
    olusturan:'EMP-003', veren:'EMP-003', sorumlu:'EMP-009', yardimci:[], izleyiciler:['EMP-008'],
    kontrolEden:'EMP-003', onaylayan:'EMP-003', oncelik:'Yüksek', etki:'Yüksek', aciliyet:'Yüksek', destek:null,
    durum:'Onay bekliyor', baslangic:'2026-07-26', termin:'2026-08-03', tamamlanma:null,
    tahminiSure:18, gercekSure:17, faturalanabilir:17, ilerleme:100, revizyon:0, yenidenAcilma:0,
    aciklama:'62 senaryoluk regresyon seti koşuldu, 3 hata bulundu.',
    amac:'Yayın öncesi kalite güvencesi', kabulKriteri:'Kritik hata sıfır olmalı',
    beklenenCikti:'Test raporu', teslimEdilenCikti:'test-raporu-v18.pdf', etiketler:['QA'], aktif:true },
  { kod:'GRV-2026-114', baslik:'Marmara Faz 1 kabul testi senaryoları', tur:'Test görevi',
    proje:'PRJ-2026-003', modul:'MOD-010', sprint:'SPR-2026-021', musteri:'MUS-2025-005', dep:'DEP-11',
    olusturan:'EMP-003', veren:'EMP-003', sorumlu:'EMP-009', yardimci:[], izleyiciler:['EMP-005'],
    kontrolEden:'EMP-003', onaylayan:'EMP-003', oncelik:'Orta', etki:'Orta', aciliyet:'Orta', destek:null,
    durum:'Havuzda', baslangic:null, termin:'2026-08-20', tamamlanma:null,
    tahminiSure:20, gercekSure:0, faturalanabilir:0, ilerleme:0, revizyon:0, yenidenAcilma:0,
    aciklama:'Müşteri kabul testi için senaryo seti hazırlanacak.',
    amac:'Kabul testinin sorunsuz geçmesi', kabulKriteri:'Tüm ana akışlar kapsanmalı',
    beklenenCikti:'Senaryo dokümanı', etiketler:['QA'], aktif:true },
  { kod:'GRV-2026-115', baslik:'Ofis yedekleme politikası gözden geçirilecek', tur:'Genel görev',
    proje:null, modul:null, sprint:null, musteri:null, dep:'DEP-12',
    olusturan:'EMP-010', veren:'EMP-001', sorumlu:'EMP-010', yardimci:[], izleyiciler:['EMP-001'],
    kontrolEden:'EMP-001', onaylayan:'EMP-001', oncelik:'Düşük', etki:'Orta', aciliyet:'Düşük', destek:null,
    durum:'Havuzda', baslangic:null, termin:'2026-08-28', tamamlanma:null,
    tahminiSure:8, gercekSure:0, faturalanabilir:0, ilerleme:0, revizyon:0, yenidenAcilma:0,
    aciklama:'Müşteri verisi barındıran sistemlerin yedekleme sıklığı gözden geçirilecek.',
    amac:'KVKK uyumu', kabulKriteri:'Yazılı politika dokümanı', beklenenCikti:'Politika dokümanı',
    etiketler:['Güvenlik','KVKK'], aktif:true },
  { kod:'GRV-2026-116', baslik:'Zirve Market teknik değerlendirme notu', tur:'Satış görevi',
    proje:null, modul:null, sprint:null, musteri:null, dep:'DEP-04',
    olusturan:'EMP-014', veren:'EMP-002', sorumlu:'EMP-003', yardimci:['EMP-008'], izleyiciler:['EMP-014'],
    kontrolEden:'EMP-002', onaylayan:'EMP-002', oncelik:'Yüksek', etki:'Yüksek', aciliyet:'Yüksek', destek:null,
    durum:'Devam ediyor', baslangic:'2026-08-01', termin:'2026-08-04', tamamlanma:null,
    tahminiSure:6, gercekSure:2, faturalanabilir:0, ilerleme:35, revizyon:0, yenidenAcilma:0,
    aciklama:'POS entegrasyonunun teknik yapılabilirliği değerlendirilecek.',
    amac:'Teklif öncesi risk tespiti', kabulKriteri:'Yazılı fizibilite notu',
    beklenenCikti:'Teknik not', etiketler:['Satış','Ön analiz'], aktif:true },
  { kod:'GRV-2026-117', baslik:'Kurumsal site blog bölümü içerik güncellemesi', tur:'Genel görev',
    proje:null, modul:null, sprint:null, musteri:null, dep:'DEP-18',
    olusturan:'EMP-002', veren:'EMP-002', sorumlu:'EMP-015', yardimci:[], izleyiciler:[],
    kontrolEden:'EMP-002', onaylayan:'EMP-002', oncelik:'Düşük', etki:'Düşük', aciliyet:'Düşük', destek:null,
    durum:'Kabul bekliyor', baslangic:null, termin:'2026-08-15', tamamlanma:null,
    tahminiSure:10, gercekSure:0, faturalanabilir:0, ilerleme:0, revizyon:0, yenidenAcilma:0,
    aciklama:'4 yeni vaka çalışması görseli ve düzeni.',
    amac:'Web sitesi dönüşüm oranının artırılması', kabulKriteri:'4 görsel + düzen',
    beklenenCikti:'Görsel seti', etiketler:['Pazarlama','Freelancer'], aktif:true },
  { kod:'GRV-2026-118', baslik:'Vitalis push bildirim şablonları', tur:'Yazılım geliştirme görevi',
    proje:'PRJ-2026-001', modul:'MOD-003', sprint:'SPR-2026-018', musteri:'MUS-2024-002', dep:'DEP-08',
    olusturan:'EMP-003', veren:'EMP-003', sorumlu:'EMP-005', yardimci:[], izleyiciler:['EMP-008'],
    kontrolEden:'EMP-009', onaylayan:'EMP-003', oncelik:'Orta', etki:'Orta', aciliyet:'Orta', destek:null,
    durum:'Tamamlandı', baslangic:'2026-07-20', termin:'2026-07-28', tamamlanma:'2026-07-27',
    tahminiSure:10, gercekSure:9, faturalanabilir:9, ilerleme:100, revizyon:1, yenidenAcilma:0,
    aciklama:'Randevu hatırlatma ve sonuç bildirimi şablonları.',
    amac:'Bildirim modülünün tamamlanması', kabulKriteri:'TR/EN şablonlar test edildi',
    beklenenCikti:'Şablon seti', teslimEdilenCikti:'push-templates PR #142', etiketler:['Backend'], aktif:true },
  { kod:'GRV-2026-119', baslik:'Öz Gıda devreye alma sonrası kontrol', tur:'Proje görevi',
    proje:'PRJ-2026-004', modul:null, sprint:null, musteri:'MUS-2026-009', dep:'DEP-12',
    olusturan:'EMP-003', veren:'EMP-003', sorumlu:'EMP-010', yardimci:[], izleyiciler:['EMP-005'],
    kontrolEden:'EMP-003', onaylayan:'EMP-003', oncelik:'Orta', etki:'Orta', aciliyet:'Düşük', destek:null,
    durum:'Tamamlandı', baslangic:'2026-07-22', termin:'2026-07-26', tamamlanma:'2026-07-25',
    tahminiSure:6, gercekSure:5, faturalanabilir:5, ilerleme:100, revizyon:0, yenidenAcilma:0,
    aciklama:'Canlı ortam izleme, yedekleme ve uyarı kurulumları.',
    amac:'Sorunsuz canlı geçiş', kabulKriteri:'İzleme panosu aktif',
    beklenenCikti:'Kurulum notu', teslimEdilenCikti:'runbook-ozgida.md', etiketler:['DevOps'], aktif:true },
  { kod:'GRV-2026-120', baslik:'Deniz Lojistik bakım paketi yenileme teklifi', tur:'Satış görevi',
    proje:null, modul:null, sprint:null, musteri:'MUS-2024-001', dep:'DEP-02',
    olusturan:'EMP-002', veren:'EMP-001', sorumlu:'EMP-002', yardimci:[], izleyiciler:['EMP-001'],
    kontrolEden:'EMP-001', onaylayan:'EMP-001', oncelik:'Yüksek', etki:'Yüksek', aciliyet:'Orta', destek:null,
    durum:'Devam ediyor', baslangic:'2026-07-31', termin:'2026-08-12', tamamlanma:null,
    tahminiSure:8, gercekSure:2, faturalanabilir:0, ilerleme:20, revizyon:0, yenidenAcilma:0,
    aciklama:'Mevcut paketin kapsamı genişletilerek yenileme teklifi hazırlanacak.',
    amac:'Yıllık tekrarlayan gelirin korunması', kabulKriteri:'Onaylı teklif',
    beklenenCikti:'Teklif dokümanı', etiketler:['Satış','Yenileme'], aktif:true },
  { kod:'GRV-2026-121', baslik:'Marmara iş emri ekranı erişilebilirlik düzeltmeleri', tur:'Revizyon',
    proje:'PRJ-2026-003', modul:'MOD-010', sprint:'SPR-2026-020', musteri:'MUS-2025-005', dep:'DEP-07',
    olusturan:'EMP-009', veren:'EMP-003', sorumlu:'EMP-006', yardimci:[], izleyiciler:[],
    kontrolEden:'EMP-009', onaylayan:'EMP-003', oncelik:'Orta', etki:'Orta', aciliyet:'Orta', destek:null,
    durum:'Tamamlandı', baslangic:'2026-07-21', termin:'2026-07-29', tamamlanma:'2026-07-28',
    tahminiSure:12, gercekSure:13, faturalanabilir:13, ilerleme:100, revizyon:1, yenidenAcilma:0,
    aciklama:'Klavye navigasyonu ve kontrast düzeltmeleri.',
    amac:'WCAG AA uyumu', kabulKriteri:'Axe taramasında kritik bulgu sıfır',
    beklenenCikti:'Düzeltme PR', teslimEdilenCikti:'PR #318', etiketler:['Erişilebilirlik'], aktif:true },
  { kod:'GRV-2026-122', baslik:'Araç muayene randevusu alınacak — 34 GW 1907', tur:'Araç görevi',
    proje:null, modul:null, sprint:null, musteri:null, dep:'DEP-17',
    olusturan:'EMP-011', veren:'EMP-011', sorumlu:'EMP-012', yardimci:[], izleyiciler:['EMP-001'],
    kontrolEden:'EMP-011', onaylayan:'EMP-011', oncelik:'Yüksek', etki:'Orta', aciliyet:'Yüksek', destek:null,
    durum:'Atandı', baslangic:'2026-08-03', termin:'2026-08-10', tamamlanma:null,
    tahminiSure:2, gercekSure:0, faturalanabilir:0, ilerleme:0, revizyon:0, yenidenAcilma:0,
    aciklama:'Muayene geçerlilik tarihi 28 Ağustos, randevu alınmalı.',
    amac:'Yasal yükümlülük', kabulKriteri:'Randevu teyidi', beklenenCikti:'Randevu kaydı',
    etiketler:['Filo','Yasal'], aktif:true },
  { kod:'GRV-2026-123', baslik:'Q3 personel performans dönemi açılışı', tur:'Personel görevi',
    proje:null, modul:null, sprint:null, musteri:null, dep:'DEP-14',
    olusturan:'EMP-011', veren:'EMP-001', sorumlu:'EMP-011', yardimci:[], izleyiciler:['EMP-001'],
    kontrolEden:'EMP-001', onaylayan:'EMP-001', oncelik:'Orta', etki:'Orta', aciliyet:'Orta', destek:null,
    durum:'Planlandı', baslangic:'2026-08-10', termin:'2026-08-24', tamamlanma:null,
    tahminiSure:12, gercekSure:0, faturalanabilir:0, ilerleme:0, revizyon:0, yenidenAcilma:0,
    aciklama:'Hedef belirleme ve öz değerlendirme formlarının açılması.',
    amac:'Performans döneminin zamanında başlaması', kabulKriteri:'Tüm personel formu açık',
    beklenenCikti:'Açık performans dönemi', etiketler:['İK'], aktif:true },
  { kod:'GRV-2026-124', baslik:'Eski proje arşiv temizliği', tur:'Genel görev',
    proje:null, modul:null, sprint:null, musteri:null, dep:'DEP-12',
    olusturan:'EMP-010', veren:'EMP-010', sorumlu:'EMP-010', yardimci:[], izleyiciler:[],
    kontrolEden:'EMP-001', onaylayan:'EMP-001', oncelik:'Düşük', etki:'Düşük', aciliyet:'Düşük', destek:null,
    durum:'Arşivlendi', baslangic:'2026-01-12', termin:'2026-02-28', tamamlanma:'2026-02-26',
    tahminiSure:10, gercekSure:9, faturalanabilir:0, ilerleme:100, revizyon:0, yenidenAcilma:0,
    aciklama:'2023 öncesi proje dosyaları soğuk depolamaya taşındı.',
    amac:'Depolama maliyeti', kabulKriteri:'—', beklenenCikti:'—', arsiv:true,
    etiketler:['Arşiv'], aktif:true },
  { kod:'GRV-2026-125', baslik:'Trakya Otomotiv müşteri memnuniyet eskalasyonu', tur:'Müşteri görevi',
    proje:'PRJ-2026-006', modul:null, sprint:null, musteri:'MUS-2026-010', dep:'DEP-03',
    olusturan:'EMP-013', veren:'EMP-001', sorumlu:'EMP-002', yardimci:['EMP-003'], izleyiciler:['EMP-001'],
    kontrolEden:'EMP-001', onaylayan:'EMP-001', oncelik:'Kritik', etki:'Çok yüksek', aciliyet:'Yüksek', destek:null,
    durum:'Devam ediyor', baslangic:'2026-07-28', termin:'2026-08-04', tamamlanma:null,
    tahminiSure:6, gercekSure:3, faturalanabilir:0, ilerleme:45, revizyon:0, yenidenAcilma:0,
    aciklama:'Memnuniyet puanı 2,4. Kapsam ve beklenti yeniden hizalanacak.',
    amac:'Müşteri kaybının önlenmesi', kabulKriteri:'Yazılı mutabakat',
    beklenenCikti:'Mutabakat notu', etiketler:['Eskalasyon','Riskli müşteri'], aktif:true },
  /* Destek talebinden doğan görev (§18 · §22 madde 16). Zincir uçtan uca yazılı:
     DST-2026-118 → HTA-2026-074 (`bugs.destek`) → GRV-2026-126 (`bugs.gorev`),
     görev de kaynağını `destek` alanında taşır. `etki` **Çok yüksek** çünkü bağlı
     hatanın şiddeti `Kritik` (components.md §9 şiddet→etki eşlemesi). */
  { kod:'GRV-2026-126', baslik:'Randevu formu tarih seçici mobil düzeltmesi', tur:'Hata',
    proje:'PRJ-2026-006', modul:'MOD-015', sprint:'SPR-2026-023', musteri:'MUS-2026-010', dep:'DEP-07',
    olusturan:'EMP-013', veren:'EMP-003', sorumlu:'EMP-006', yardimci:[], izleyiciler:['EMP-013','EMP-003'],
    kontrolEden:'EMP-009', onaylayan:'EMP-003', oncelik:'Kritik', etki:'Çok yüksek', aciliyet:'Yüksek',
    destek:'DST-2026-118',
    durum:'Devam ediyor', baslangic:'2026-08-03', termin:'2026-08-05', tamamlanma:null,
    tahminiSure:6, gercekSure:2, faturalanabilir:0, ilerleme:30, revizyon:0, yenidenAcilma:0,
    aciklama:'Safari iOS üzerinde randevu formundaki tarih seçici açılmıyor. Destek talebinden doğdu.',
    amac:'Kritik destek talebinin kapatılması', kabulKriteri:'iOS Safari ve Chrome üzerinde tarih seçici açılmalı',
    beklenenCikti:'Düzeltme PR + müşteri doğrulaması',
    etiketler:['Destek kaynaklı','Mobil','Kritik'], aktif:true }
];

/* ---- Alt görevler ve kontrol listeleri --------------------------------- */
DB.subtasks = [
  { kod:'ALT-001', ustGorev:'GRV-2026-101', baslik:'iOS 17 cihazda hata yeniden üretildi', tamam:true, sorumlu:'EMP-008' },
  { kod:'ALT-002', ustGorev:'GRV-2026-101', baslik:'Dosya izinleri incelendi', tamam:true, sorumlu:'EMP-008' },
  { kod:'ALT-003', ustGorev:'GRV-2026-101', baslik:'Düzeltme uygulandı', tamam:false, sorumlu:'EMP-008' },
  { kod:'ALT-004', ustGorev:'GRV-2026-101', baslik:'3 cihazda doğrulandı', tamam:false, sorumlu:'EMP-009' },
  { kod:'ALT-005', ustGorev:'GRV-2026-103', baslik:'Test kümesi hazırlandı', tamam:true, sorumlu:'EMP-007' },
  { kod:'ALT-006', ustGorev:'GRV-2026-103', baslik:'Metrikler hesaplandı', tamam:true, sorumlu:'EMP-007' },
  { kod:'ALT-007', ustGorev:'GRV-2026-103', baslik:'Rapor yazıldı', tamam:false, sorumlu:'EMP-007' },
  { kod:'ALT-008', ustGorev:'GRV-2026-105', baslik:'API sözleşmesi çıkarıldı', tamam:true, sorumlu:'EMP-005' },
  { kod:'ALT-009', ustGorev:'GRV-2026-105', baslik:'Test hesabı bekleniyor', tamam:false, sorumlu:'EMP-005' }
];

/* ---- Görev bağımlılıkları ---------------------------------------------- */
DB.taskDeps = [
  { gorev:'GRV-2026-102', bagimli:'GRV-2026-101', tur:'Engelliyor' },
  { gorev:'GRV-2026-104', bagimli:'GRV-2026-103', tur:'Bekliyor' },
  { gorev:'GRV-2026-112', bagimli:null, tur:'—' }
];

/* ---- Departmanlar arası iş talepleri (PROMPT.md §13) -------------------- */
DB.deptRequests = [
  { kod:'TLP-2026-041', talepEdenDep:'DEP-02', talepEdilenDep:'DEP-04', talepEden:'EMP-014', sorumlu:'EMP-003',
    tur:'Ön analiz talebi', musteri:null, proje:null, baslik:'Zirve Market POS entegrasyon fizibilitesi',
    aciklama:'Mevcut POS sağlayıcısının API kısıtları değerlendirilsin.', oncelik:'Yüksek',
    termin:'2026-08-04', beklenenCikti:'Yazılı fizibilite notu', kabulKriteri:'Risk ve efor tahmini içermeli',
    durum:'Devam ediyor', onay:'Onaylandı', olusturma:'2026-07-31', tamamlanma:null, aktif:true },
  { kod:'TLP-2026-042', talepEdenDep:'DEP-05', talepEdilenDep:'DEP-06', talepEden:'EMP-003', sorumlu:'EMP-004',
    tur:'Ekran tasarım talebi', musteri:'MUS-2025-005', proje:'PRJ-2026-003',
    baslik:'Rapor merkezi 8 ekran tasarımı', aciklama:'Faz 1 rapor modülü ekranları.', oncelik:'Orta',
    termin:'2026-08-16', beklenenCikti:'Figma dosyası', kabulKriteri:'3 kırılımda tasarım',
    durum:'Bekliyor', onay:'Onaylandı', olusturma:'2026-08-01', tamamlanma:null, aktif:true },
  { kod:'TLP-2026-043', talepEdenDep:'DEP-08', talepEdilenDep:'DEP-11', talepEden:'EMP-005', sorumlu:'EMP-009',
    tur:'Test talebi', musteri:'MUS-2025-005', proje:'PRJ-2026-003',
    baslik:'Faz 1 kabul testi senaryoları', aciklama:'Müşteri kabul testi öncesi senaryo seti.', oncelik:'Orta',
    termin:'2026-08-20', beklenenCikti:'Senaryo dokümanı', kabulKriteri:'Ana akışların tamamı',
    durum:'Bekliyor', onay:'Bekliyor', olusturma:'2026-08-02', tamamlanma:null, aktif:true },
  { kod:'TLP-2026-044', talepEdenDep:'DEP-13', talepEdilenDep:'DEP-07', talepEden:'EMP-013', sorumlu:'EMP-006',
    tur:'Hata çözüm talebi', musteri:'MUS-2026-010', proje:'PRJ-2026-006',
    baslik:'Randevu formunda tarih seçici mobilde açılmıyor', aciklama:'Müşteri destek kaydından geldi.',
    oncelik:'Kritik', termin:'2026-08-05', beklenenCikti:'Düzeltme', kabulKriteri:'iOS ve Android doğrulama',
    durum:'Devam ediyor', onay:'Onaylandı', olusturma:'2026-07-30', tamamlanma:null, aktif:true },
  { kod:'TLP-2026-045', talepEdenDep:'DEP-07', talepEdilenDep:'DEP-16', talepEden:'EMP-006', sorumlu:'EMP-012',
    tur:'Ekipman talebi', musteri:null, proje:null, baslik:'Test için ikinci monitör',
    aciklama:'Çift ekran çalışma ihtiyacı.', oncelik:'Düşük', termin:'2026-08-22',
    beklenenCikti:'Zimmetli monitör', kabulKriteri:'27 inç, USB-C',
    durum:'Bekliyor', onay:'Bekliyor', olusturma:'2026-07-29', tamamlanma:null, aktif:true },
  { kod:'TLP-2026-040', talepEdenDep:'DEP-15', talepEdilenDep:'DEP-02', talepEden:'EMP-012', sorumlu:'EMP-002',
    tur:'Eksik bilgi talebi', musteri:'MUS-2025-003', proje:null,
    baslik:'Anadolu Perakende fatura adresi güncellenmeli', aciklama:'e-Fatura reddedildi.',
    oncelik:'Yüksek', termin:'2026-07-28', beklenenCikti:'Güncel adres', kabulKriteri:'Yazılı teyit',
    durum:'Tamamlandı', onay:'Onaylandı', olusturma:'2026-07-24', tamamlanma:'2026-07-27', aktif:true }
];

/* ---- Hatalar ----------------------------------------------------------- */
/* BAĞ ALANLARI (lessons L-13 — bağ tahmin edilmez, burada YAZILIDIR):
   `gorev`  = hatayı düzelten görev. **Hata ↔ görev bağının tek yönü budur**;
              `DB.tasks[].hata` diye bir ayna alan YOKTUR (iki yönlü bağ ayrışır).
              Bağ yazılıysa görevin `etki` değeri şiddet eşlemesine uyar:
              şiddet 'Kritik' → etki 'Çok yüksek', diğer üçü birebir (components.md §9).
   `test`   = hatayı ortaya çıkaran test koşumu. Bir hata **en fazla bir** koşuma bağlanır.
              null = hata bir koşumdan değil, başka bir kanaldan (destek, kullanıcı) geldi.
   `destek` = hatayı doğuran destek talebi (DST-*). PROMPT.md §18 destek → hata dönüşümü.
   `sprint` = hatanın **ele alındığı** sprint (açıldığı değil). Kapanmış hatada düzeltmenin
              yapıldığı sprint, açık hatada içinde bulunulan sprint. */
DB.bugs = [
  { kod:'HTA-2026-071', proje:'PRJ-2026-001', baslik:'iOS PDF indirme sessizce başarısız', modul:'MOD-002',
    siddet:'Kritik', oncelik:'Kritik', durum:'Devam ediyor', bulan:'EMP-009', sorumlu:'EMP-008',
    bulunma:'2026-07-30', cozum:null, ortam:'iOS 17.4', tekrarlanabilir:'Her zaman', gorev:'GRV-2026-101',
    test:'TST-2026-018', sprint:'SPR-2026-018', destek:null, aktif:true },
  { kod:'HTA-2026-072', proje:'PRJ-2026-001', baslik:'Randevu listesi 50+ kayıtta yavaşlıyor', modul:'MOD-001',
    siddet:'Orta', oncelik:'Orta', durum:'Açık', bulan:'EMP-009', sorumlu:'EMP-008',
    bulunma:'2026-07-30', cozum:null, ortam:'Android 14', tekrarlanabilir:'Bazen', gorev:null,
    test:'TST-2026-018', sprint:'SPR-2026-018', destek:null, aktif:true },
  { kod:'HTA-2026-073', proje:'PRJ-2026-001', baslik:'Bildirim zamanı yanlış saat diliminde', modul:'MOD-003',
    siddet:'Yüksek', oncelik:'Yüksek', durum:'Açık', bulan:'EMP-009', sorumlu:'EMP-005',
    bulunma:'2026-07-31', cozum:null, ortam:'Tümü', tekrarlanabilir:'Her zaman', gorev:null,
    test:'TST-2026-018', sprint:'SPR-2026-018', destek:null, aktif:true },
  { kod:'HTA-2026-074', proje:'PRJ-2026-006', baslik:'Tarih seçici mobilde açılmıyor', modul:'MOD-015',
    siddet:'Kritik', oncelik:'Kritik', durum:'Devam ediyor', bulan:'EMP-013', sorumlu:'EMP-006',
    bulunma:'2026-07-30', cozum:null, ortam:'Safari iOS', tekrarlanabilir:'Her zaman', gorev:'GRV-2026-126',
    test:null, sprint:'SPR-2026-023', destek:'DST-2026-118', aktif:true },
  { kod:'HTA-2026-075', proje:'PRJ-2026-003', baslik:'İş emri filtresi tarih aralığını yok sayıyor', modul:'MOD-010',
    siddet:'Orta', oncelik:'Orta', durum:'Kapandı', bulan:'EMP-009', sorumlu:'EMP-006',
    bulunma:'2026-07-18', cozum:'2026-07-24', ortam:'Web', tekrarlanabilir:'Her zaman', gorev:null,
    test:null, sprint:'SPR-2026-020', destek:'DST-2026-122', aktif:true },
  { kod:'HTA-2026-076', proje:'PRJ-2026-005', baslik:'Takvimde geçmiş tarihler seçilebiliyor', modul:'MOD-013',
    siddet:'Düşük', oncelik:'Düşük', durum:'Açık', bulan:'EMP-016', sorumlu:'EMP-006',
    bulunma:'2026-08-01', cozum:null, ortam:'Web', tekrarlanabilir:'Her zaman', gorev:null,
    test:null, sprint:'SPR-2026-022', destek:null, aktif:true }
];

/* ---- Testler ----------------------------------------------------------- */
/* KAPSAM ALANLARI (lessons L-13):
   `moduller` = koşumun kapsadığı proje modülleri (**dizi** — bir koşum birden çok modülü
                tarayabilir). Boş dizi = projenin modül kırılımı veride yok, kapsam proje ekseninde.
   `sprint`   = koşumun düştüğü sprint. null = koşum tarihi hiçbir sprint aralığına girmiyor
                (veride o dönemin sprinti yok) — tarih yakınlığıyla UYDURULMAZ.
   `basarisiz` ile bağlı hata sayısı **eşit olmak zorunda değildir**: her düşen senaryo
   ayrı bir hata kaydı doğurmaz. Kural yalnız şudur: bağlı hata sayısı ≤ `basarisiz`.

   SENARYO SAYIM EKSENİ (5 koşumun 5'inde ölçüldü, durumdan bağımsız):
   `basarili + basarisiz = senaryo` — HER durumda geçerlidir, yalnız `Tamamlandı`da değil.
   `Planlandı` koşumda üçü de 0'dır (henüz senaryo yazılmamıştır), `Devam ediyor` koşumda
   koşulmuş senaryolar sayılır ve toplam o ana kadarki senaryo sayısıdır.
   `app-proje-test-detay.html` bu eşitliği her kayıtta "Sayım tutmuyor" rozetiyle denetler;
   form ekranı da aynı kuralı uygular — iki ekran ayrışmaz. */
DB.tests = [
  { kod:'TST-2026-018', proje:'PRJ-2026-001', ad:'Mobil regresyon — Sprint 18', tur:'Regresyon', senaryo:62,
    basarili:59, basarisiz:3, sorumlu:'EMP-009', tarih:'2026-07-31', durum:'Tamamlandı',
    moduller:['MOD-001','MOD-002','MOD-003'], sprint:'SPR-2026-018', aktif:true },
  { kod:'TST-2026-019', proje:'PRJ-2026-003', ad:'İş emri modülü fonksiyonel test', tur:'Fonksiyonel', senaryo:44,
    basarili:42, basarisiz:2, sorumlu:'EMP-009', tarih:'2026-07-28', durum:'Tamamlandı',
    moduller:['MOD-010'], sprint:'SPR-2026-020', aktif:true },
  { kod:'TST-2026-020', proje:'PRJ-2026-002', ad:'Skorlama API yük testi', tur:'Performans', senaryo:12,
    basarili:12, basarisiz:0, sorumlu:'EMP-010', tarih:'2026-07-26', durum:'Tamamlandı',
    moduller:['MOD-006'], sprint:null, aktif:true },
  { kod:'TST-2026-021', proje:'PRJ-2026-005', ad:'Rezervasyon akışı duman testi', tur:'Duman', senaryo:18,
    basarili:15, basarisiz:3, sorumlu:'EMP-009', tarih:'2026-08-01', durum:'Devam ediyor',
    moduller:['MOD-013'], sprint:'SPR-2026-022', aktif:true },
  { kod:'TST-2026-022', proje:'PRJ-2026-003', ad:'Faz 1 kabul testi', tur:'Kabul', senaryo:0,
    basarili:0, basarisiz:0, sorumlu:'EMP-009', tarih:'2026-08-20', durum:'Planlandı',
    moduller:['MOD-009','MOD-010','MOD-011'], sprint:null, aktif:true }
];

/* ---- Teslimler --------------------------------------------------------- */
/* `milestone` = teslimin karşılık geldiği ödeme planı taksiti (tekil bağ, lessons L-13).
   Türetme/tarih yakınlığı ile TAHMİN EDİLMEZ, burada yazılıdır.
   `musteriOnay` durum değeridir: 'Onaylandı' | 'Bekliyor' | 'Revizyon istendi'.
   Sentinel '—' kullanılmaz.
   `moduller` = teslimin kapsadığı proje modülleri (**dizi**). Boş dizi = projenin modül
   kırılımı veride yok (PRJ-2026-004), teslim proje ekseninde okunur.
   `test` = teslimi kabule bağlayan test koşumu; null = teslim bir kabul koşumuna bağlı değil. */
DB.deliveries = [
  { kod:'TSL-2026-031', proje:'PRJ-2026-001', milestone:'MS-001', ad:'Beta sürüm (v0.9)', tarih:'2026-07-10', durum:'Onaylandı',
    teslimEden:'EMP-003', musteriOnay:'Onaylandı', onayTarihi:'2026-07-14', not:'Test cihazlarına dağıtıldı',
    moduller:['MOD-001','MOD-002','MOD-003'], test:null, aktif:true },
  { kod:'TSL-2026-032', proje:'PRJ-2026-004', milestone:'MS-009', ad:'Üretim takip v1.0 canlı', tarih:'2026-07-22', durum:'Onaylandı',
    teslimEden:'EMP-003', musteriOnay:'Onaylandı', onayTarihi:'2026-07-25', not:'Sorunsuz geçiş',
    moduller:[], test:null, aktif:true },
  { kod:'TSL-2026-033', proje:'PRJ-2026-002', milestone:'MS-003', ad:'POC sonuç paketi', tarih:'2026-07-25', durum:'Onaylandı',
    teslimEden:'EMP-007', musteriOnay:'Onaylandı', onayTarihi:'2026-07-29', not:'Doğruluk %87',
    moduller:['MOD-005','MOD-006'], test:null, aktif:true },
  { kod:'TSL-2026-034', proje:'PRJ-2026-003', milestone:'MS-005', ad:'Faz 1 modül paketi', tarih:'2026-08-29', durum:'Planlandı',
    teslimEden:'EMP-003', musteriOnay:'Bekliyor', onayTarihi:null, not:'Kabul testi sonrası',
    moduller:['MOD-009','MOD-010','MOD-011'], test:'TST-2026-022', aktif:true },
  { kod:'TSL-2026-035', proje:'PRJ-2026-006', milestone:'MS-008', ad:'Randevu sistemi canlı', tarih:'2026-06-26', durum:'Gecikti',
    teslimEden:'EMP-003', musteriOnay:'Bekliyor', onayTarihi:null, not:'Revizyon turu devam ediyor',
    moduller:['MOD-015'], test:null, aktif:true }
];

/* ---- Değişiklik talepleri ---------------------------------------------- */
/* EKSEN UYARISI:
   `etkiSure` **SAAT**tir, gün değil (`app-proje-degisiklik.html` `F.hours` ile basar,
   filtresi "8 saatten fazla" der). Gün karşılığı gösterilecekse **türetilmiş** olduğu
   yazılır — dönüşüm 8 sa/gün varsayımıdır, veride yazılı değil.
   `etkiMaliyet` **NET** (KDV hariç), müşteriye yansıyan bedel — sözleşme netiyle
   (`contracts.tutar`) aynı eksende. `projects.butce` / `.gerceklesenMaliyet` **iç maliyet**
   eksenidir, bu alanla aynı satırda toplanmaz.
   `etki` diye bir alan **YOKTUR** — etki düzeyi süre/bedel sapmasından hesaplanır.
   AD ÇAKIŞMASI UYARISI: `talep` bu koleksiyonda **talebi açan taraf**tır
   ('Müşteri' | 'İç ekip'), destek talebi kodu DEĞİLDİR. Destek talebi bağı için
   projenin her yerinde olduğu gibi **`destek`** alanı kullanılır (DST-*).
   `destek` null = değişiklik talebi bir destek talebinden doğmadı. */
DB.changeRequests = [
  { kod:'DGS-2026-012', proje:'PRJ-2026-006', baslik:'Randevu adımlarının sırası değiştirilsin',
    talep:'Müşteri', tarih:'2026-07-25', etkiSure:12, etkiMaliyet:38000, durum:'Onay bekliyor',
    kapsamIci:false, karar:'Ek teklif gerekiyor', sorumlu:'EMP-003', destek:null, aktif:true },
  { kod:'DGS-2026-013', proje:'PRJ-2026-003', baslik:'Rapor merkezine 3 yeni rapor eklensin',
    talep:'Müşteri', tarih:'2026-07-18', etkiSure:60, etkiMaliyet:145000, durum:'Onaylandı',
    kapsamIci:false, karar:'Faz 2 kapsamına alındı', sorumlu:'EMP-003', destek:null, aktif:true },
  { kod:'DGS-2026-014', proje:'PRJ-2026-001', baslik:'Bildirim sesleri özelleştirilsin',
    talep:'Müşteri', tarih:'2026-07-12', etkiSure:6, etkiMaliyet:0, durum:'Reddedildi',
    kapsamIci:false, karar:'Store yayını sonrası değerlendirilecek', sorumlu:'EMP-003', destek:null, aktif:true },
  { kod:'DGS-2026-015', proje:'PRJ-2026-005', baslik:'Ödeme sağlayıcı iyzico yerine PayTR olsun',
    talep:'Müşteri', tarih:'2026-07-28', etkiSure:16, etkiMaliyet:22000, durum:'Değerlendiriliyor',
    kapsamIci:false, karar:'—', sorumlu:'EMP-003', destek:null, aktif:true },
  /* Destek talebinden doğan değişiklik talebi (§18 · §22 madde 17).
     DST-2026-120 kapsam dışı ve ücretli bir "Geliştirme talebi"ydi; değerlendirme
     ek teklif yoluna girdi. `etkiMaliyet` NET eksende (KDV hariç). */
  { kod:'DGS-2026-016', proje:'PRJ-2025-008', baslik:'Sevkiyat raporuna araç filtresi eklensin',
    talep:'Müşteri', tarih:'2026-07-30', etkiSure:10, etkiMaliyet:18000, durum:'Onay bekliyor',
    kapsamIci:false, karar:'Ek teklif gerekiyor', sorumlu:'EMP-003', destek:'DST-2026-120', aktif:true }
];

/* ---- Onay kuyruğu (tüm modüllerden) ------------------------------------ */
DB.approvals = [
  { kod:'ONY-2026-051', tur:'Satın alma talebi', kayit:'SAT-2026-014', baslik:'2 adet geliştirici dizüstü bilgisayar',
    talepEden:'EMP-010', onaylayan:'EMP-001', tutar:186000, tarih:'2026-07-30', durum:'Bekliyor',
    aciliyet:'Yüksek', link:'app-satinalma-detay.html?id=SAT-2026-014' },
  { kod:'ONY-2026-052', tur:'İzin talebi', kayit:'IZN-2026-038', baslik:'Yıllık izin — 10-14 Ağustos',
    talepEden:'EMP-006', onaylayan:'EMP-003', tutar:null, tarih:'2026-07-31', durum:'Bekliyor',
    aciliyet:'Orta', link:'app-izin-detay.html?id=IZN-2026-038' },
  { kod:'ONY-2026-053', tur:'Teklif iç onayı', kayit:'TKL-2026-013', baslik:'Poyraz İnşaat ERP teklifi',
    talepEden:'EMP-002', onaylayan:'EMP-001', tutar:734400, tarih:'2026-07-30', durum:'Bekliyor',
    aciliyet:'Yüksek', link:'app-teklif-detay.html?id=TKL-2026-013' },
  { kod:'ONY-2026-054', tur:'Görev onayı', kayit:'GRV-2026-113', baslik:'Vitalis regresyon test raporu',
    talepEden:'EMP-009', onaylayan:'EMP-003', tutar:null, tarih:'2026-08-02', durum:'Bekliyor',
    aciliyet:'Yüksek', link:'app-gorev-detay.html?id=GRV-2026-113' },
  { kod:'ONY-2026-055', tur:'Değişiklik talebi', kayit:'DGS-2026-012', baslik:'Trakya randevu adım sırası',
    talepEden:'EMP-003', onaylayan:'EMP-001', tutar:38000, tarih:'2026-07-26', durum:'Bekliyor',
    aciliyet:'Kritik', link:'app-proje-degisiklik.html?id=DGS-2026-012' },
  { kod:'ONY-2026-056', tur:'Ön analiz onayı', kayit:'ANL-2026-001', baslik:'Poyraz İnşaat ön analizi',
    talepEden:'EMP-003', onaylayan:'EMP-001', tutar:null, tarih:'2026-07-21', durum:'Bekliyor',
    aciliyet:'Orta', link:'app-onanaliz-detay.html?id=ANL-2026-001' },
  { kod:'ONY-2026-057', tur:'Komisyon kazancı', kayit:'KOM-2026-003', baslik:'Murat Sezer — Marmara Enerji komisyonu',
    talepEden:'EMP-012', onaylayan:'EMP-001', tutar:47600, tarih:'2026-07-09', durum:'Bekliyor',
    aciliyet:'Orta', link:'app-komisyon-detay.html?id=KOM-2026-003' },
  { kod:'ONY-2026-058', tur:'Timesheet onayı', kayit:'TSH-2026-030', baslik:'30. hafta zaman kayıtları — 6 personel',
    talepEden:'EMP-011', onaylayan:'EMP-003', tutar:null, tarih:'2026-08-01', durum:'Bekliyor',
    aciliyet:'Orta', link:'app-zaman-onay.html' },
  { kod:'ONY-2026-059', tur:'Satın alma talebi', kayit:'SAT-2026-015', baslik:'Figma yıllık lisans yenileme',
    talepEden:'EMP-004', onaylayan:'EMP-012', tutar:42000, tarih:'2026-08-01', durum:'Bekliyor',
    aciliyet:'Orta', link:'app-satinalma-detay.html?id=SAT-2026-015' },
  { kod:'ONY-2026-060', tur:'İzin talebi', kayit:'IZN-2026-039', baslik:'Mazeret izni — 5 Ağustos',
    talepEden:'EMP-016', onaylayan:'EMP-006', tutar:null, tarih:'2026-08-02', durum:'Bekliyor',
    aciliyet:'Düşük', link:'app-izin-detay.html?id=IZN-2026-039' },
  { kod:'ONY-2026-048', tur:'Satın alma talebi', kayit:'SAT-2026-012', baslik:'Ofis sandalyesi 3 adet',
    talepEden:'EMP-011', onaylayan:'EMP-001', tutar:28500, tarih:'2026-07-14', durum:'Onaylandı',
    aciliyet:'Düşük', link:'app-satinalma-detay.html?id=SAT-2026-012' },
  { kod:'ONY-2026-049', tur:'İzin talebi', kayit:'IZN-2026-035', baslik:'Yıllık izin — 20-24 Temmuz',
    talepEden:'EMP-009', onaylayan:'EMP-003', tutar:null, tarih:'2026-07-10', durum:'Onaylandı',
    aciliyet:'Orta', link:'app-izin-detay.html?id=IZN-2026-035' }
];

/* ---- Aktivite kayıtları (log — eski/yeni değer) ------------------------ */
DB.activities = [
  { kayit:'GRV-2026-101', tarih:'2026-08-02T16:20', kisi:'Onur Şahin', metin:'İlerleme güncellendi', eski:'%45', yeni:'%70', tone:'accent', icon:'i-activity' },
  { kayit:'GRV-2026-101', tarih:'2026-08-01T09:05', kisi:'Gamze Erdem', metin:'Hata yeniden açıldı — düzeltme doğrulanamadı', eski:'Kontrol bekliyor', yeni:'Devam ediyor', tone:'danger', icon:'i-refresh' },
  { kayit:'GRV-2026-101', tarih:'2026-07-30T11:40', kisi:'Barış Yalçın', metin:'Görev atandı', eski:'Havuzda', yeni:'Atandı', tone:'info', icon:'i-user-check' },
  { kayit:'GRV-2026-101', tarih:'2026-07-30T11:38', kisi:'Gamze Erdem', metin:'Görev oluşturuldu (HTA-2026-071 hatasından)', eski:null, yeni:null, tone:'neutral', icon:'i-plus' },
  { kayit:'LEAD-2026-001', tarih:'2026-07-27T17:10', kisi:'Emre Bulut', metin:'Aşama değiştirildi', eski:'Teklif hazırlanıyor', yeni:'Teklif iletildi', tone:'ok', icon:'i-funnel' },
  { kayit:'LEAD-2026-001', tarih:'2026-07-22T10:00', kisi:'Selin Dağdeviren', metin:'Teklif TKL-2026-014 oluşturuldu', eski:null, yeni:null, tone:'accent', icon:'i-quote' },
  { kayit:'PRJ-2026-006', tarih:'2026-07-29T14:15', kisi:'Barış Yalçın', metin:'Proje sağlık durumu değişti', eski:'Dikkat', yeni:'Riskli', tone:'danger', icon:'i-alert' },
  { kayit:'MUS-2026-010', tarih:'2026-05-30T16:50', kisi:'Ayşe Kaplan', metin:'Risk seviyesi yükseltildi', eski:'Orta', yeni:'Yüksek', tone:'danger', icon:'i-alert' }
];

/* ---- Arama yardımcıları (org.js'teki DB.emp / DB.empName ile aynı desen) ---- */
DB.proj     = function(kod){ return DB.projects.filter(function(p){ return p.kod === kod; })[0] || null; };
DB.projName = function(kod){ var p = DB.proj(kod); return p ? p.ad : '—'; };
DB.mod      = function(kod){ return DB.projectModules.filter(function(m){ return m.kod === kod; })[0] || null; };
DB.modName  = function(kod){ var m = DB.mod(kod); return m ? m.ad : '—'; };
DB.task     = function(kod){ return DB.tasks.filter(function(t){ return t.kod === kod; })[0] || null; };
