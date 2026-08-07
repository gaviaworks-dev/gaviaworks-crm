/* =====================================================================
   GAVIAWORKS CRM — ORGANİZASYON VERİSİ
   Departmanlar · Roller · Yetki matrisi · Personel
   Canonical: buradaki kod (EMP-xxx / DEP-xx / rol anahtarı) tüm ekranlarda aynıdır.
   Tarih ekseni: BUGÜN = 2026-08-03 (tasks/assumptions.md V-07)
   ===================================================================== */
window.DB = window.DB || {};

DB.today = '2026-08-03';

DB.company = {
  ad:'Gavia Works', unvan:'Gavia Works Yazılım ve Danışmanlık Ltd. Şti.',
  vergiDairesi:'Çankaya', vergiNo:'3720654891', kurulus:'2021-03-15',
  adres:'Mustafa Kemal Mah. Dumlupınar Blv. No:274, Çankaya / Ankara',
  telefon:'+90 312 000 00 00', eposta:'info@gaviaworks.com', web:'gaviaworks.com',
  calisanSayisi:16, paket:'Kurumsal', tenant:'gaviaworks',

  /* ---- İç maliyet sabitleri (REVİZE 04) --------------------------------
     Proje personel maliyeti = onaylı saat × personelin saatlik İÇ MALİYETİ.
     İç maliyet TÜRETİLİR, personel kaydında saklanmaz (L-08):
        maas > 0          → maas × isverenMaliyetKatsayisi / aylikCalismaSaati
        saatlikUcret > 0  → saatlikUcret (dışarıya fatura edilen tutar =
                            şirketin maliyeti)
     İkisi `app-personel-form.html:146`'daki **XOR** sözleşmesiyle korunur;
     iki alandan yalnız biri dolu olur ve o sözleşme bozulmadı.

     Katsayı ve aylık saat BURAYA YAZILI SABİTTİR (VB-19 dersi): hesabın
     girdisi koda gömülürse maliyet sessizce değişir ve kimse fark etmez.
     · isverenMaliyetKatsayisi — brüt maaş üstüne işveren SGK + işsizlik payı
     · aylikCalismaSaati — 22 iş günü × 8 saat (çalışma düzeni: 5 gün, 8 saat) */
  isverenMaliyetKatsayisi:1.225,
  aylikCalismaSaati:176,

  /* REVİZE 07 — proje kapanışında hangi dokümanın ZORUNLU olduğu.
     Bu tanım olmadan "eksik doküman var mı?" sorusu ÖLÇÜLEMEZ: eksikliğin
     kendisi ancak bir beklenti listesine göre tanımlanabilir. Liste
     `DB.documents[].tur` kümesinden seçildi — uydurma tür yazılmadı. */
  zorunluProjeDokuman:['Sözleşme','Teknik doküman','Test raporu'],

  /* ---- Aktif modüller (REVİZE 18) --------------------------------------
     Şirketin aracı yoksa yedi filo menüsü gereksiz kalabalıktır — ama
     **modül kapatmak veri silmek DEĞİLDİR** (talimat: "modül kapatıldığında
     veri silinmemeli, sadece ilgili menü kullanıcıdan gizlenmelidir").
     Kapalı modülün ekranı menüden düşer ve doğrudan adresle de açılmaz
     (`Perm.modul` → `guard`), dosyası ve kaydı yerinde kalır; anahtar geri
     açılınca her şey aynen döner.
     Sekiz anahtar dokümanın listesidir. Varsayılan HEPSİ AÇIK: bu depoda
     dört araç, 12 demirbaş ve gerçek satın alma kayıtları var — kapalı
     başlatmak var olan veriyi görünmez kılardı. */
  aktifModuller:{
    satis:true, proje:true, destek:true, personel:true,
    finans:true, satinalma:true, demirbas:true, filo:true
  }
};

/* ---- Departmanlar (PROMPT.md §4 — 21 departman) ---------------------- */
/* ---- Ana departman kümesi (REVİZE 15) ---------------------------------
   Şirket 16 kişilik; her teknik uzmanlığı ayrı departman yapmak 21 departman
   üretmişti ve **altısı boştu**. Doküman sekiz ana departman öneriyor.
   `DB.departments` SİLİNMEDİ (talimat: "mevcut departman verilerini silme") —
   her kayda `ustDepartman` geldi ve menü/süzgeç ana departmanı gösterebiliyor,
   detay alt kırılımı koruyor.
   İki kayıt istisnadır ve `ustDepartman:null` taşır: **DEP-20 Dış Kaynak
   Ekipler** ve **DEP-21 Freelancer ve Çözüm Ortakları** departman değil
   **çalışma tipidir** (REVİZE 16). İkisi de `aktif:false` yapıldı — silinmedi,
   kayıtları taşındı: tek kadrolu EMP-015 gerçek departmanına (DEP-06 Tasarım;
   yöneticisi zaten EMP-004, pozisyonu "Freelance Grafik Tasarımcı") gitti ve
   `calismaTipi:'Freelancer'` aldı. */
DB.departmentGroups = ['Yönetim & Operasyon','Satış & Müşteri','Proje / Ürün','Yazılım',
  'Yapay Zekâ & Data','Tasarım','Destek','Finans / Kurumsal'];

/* ---- Uzmanlık (REVİZE 15) --------------------------------------------
   Uzmanlık DEPARTMAN DEĞİLDİR: beş departman (Front-end · Back-end · Mobil ·
   Test · DevOps) aslında `Yazılım` altındaki birer uzmanlıktı. Küme ana
   departman ekseninde tanımlıdır; dokümanın Yazılım (6) ve Yapay Zekâ (5)
   listeleri birebir alınmış, Tasarım'ın iki değeri VERİDEKİ iki pozisyondan
   türetilmiştir (uydurma değer eklenmedi). Uzmanlık kümesi olmayan ana
   departmanlarda alan boş kalır — orada pozisyon zaten işi anlatıyor (V-60). */
DB.specialities = {
  'Yazılım':          ['Frontend','Backend','Full-stack','Mobile','DevOps','QA'],
  'Yapay Zekâ & Data':['AI Development','Automation','Machine Learning','AI Integration','Prompt / Agent'],
  'Tasarım':          ['UI/UX Tasarım','Grafik Tasarım']
};

DB.departments = [
  { kod:'DEP-01', ustDepartman:'Yönetim & Operasyon', ad:'Yönetim',                     kisa:'Yönetim',   yonetici:'EMP-001', aktif:true,  personel:1 },
  { kod:'DEP-02', ustDepartman:'Satış & Müşteri', ad:'Satış ve İş Geliştirme',      kisa:'Satış',     yonetici:'EMP-002', aktif:true,  personel:2 },
  { kod:'DEP-03', ustDepartman:'Satış & Müşteri', ad:'Müşteri İlişkileri',          kisa:'Müşteri İl.',yonetici:'EMP-013',aktif:true,  personel:0 },
  { kod:'DEP-04', ustDepartman:'Proje / Ürün', ad:'İş Analizi',                  kisa:'Analiz',    yonetici:'EMP-003', aktif:true,  personel:0 },
  { kod:'DEP-05', ustDepartman:'Proje / Ürün', ad:'Proje Yönetimi',              kisa:'Proje Y.',  yonetici:'EMP-003', aktif:true,  personel:1 },
  { kod:'DEP-06', ustDepartman:'Tasarım', ad:'UI/UX Tasarım',               kisa:'Tasarım',   yonetici:'EMP-004', aktif:true,  personel:2 },
  { kod:'DEP-07', ustDepartman:'Yazılım', ad:'Front-end Geliştirme',        kisa:'Front-end', yonetici:'EMP-006', aktif:true,  personel:2 },
  { kod:'DEP-08', ustDepartman:'Yazılım', ad:'Back-end Geliştirme',         kisa:'Back-end',  yonetici:'EMP-005', aktif:true,  personel:1 },
  { kod:'DEP-09', ustDepartman:'Yazılım', ad:'Mobil Uygulama Geliştirme',   kisa:'Mobil',     yonetici:'EMP-008', aktif:true,  personel:1 },
  { kod:'DEP-10', ustDepartman:'Yapay Zekâ & Data', ad:'Yapay Zekâ ve Veri',          kisa:'AI & Veri', yonetici:'EMP-007', aktif:true,  personel:1 },
  { kod:'DEP-11', ustDepartman:'Yazılım', ad:'Test ve Kalite',              kisa:'QA',        yonetici:'EMP-009', aktif:true,  personel:1 },
  { kod:'DEP-12', ustDepartman:'Yazılım', ad:'DevOps ve Sistem Yönetimi',   kisa:'DevOps',    yonetici:'EMP-010', aktif:true,  personel:1 },
  { kod:'DEP-13', ustDepartman:'Destek', ad:'Teknik Destek',               kisa:'Destek',    yonetici:'EMP-013', aktif:true,  personel:1 },
  { kod:'DEP-14', ustDepartman:'Finans / Kurumsal', ad:'İnsan Kaynakları',            kisa:'İK',        yonetici:'EMP-011', aktif:true,  personel:1 },
  { kod:'DEP-15', ustDepartman:'Finans / Kurumsal', ad:'Muhasebe ve Finans',          kisa:'Finans',    yonetici:'EMP-012', aktif:true,  personel:1 },
  { kod:'DEP-16', ustDepartman:'Finans / Kurumsal', ad:'Satın Alma',                  kisa:'Satın Alma',yonetici:'EMP-012', aktif:true,  personel:0 },
  { kod:'DEP-17', ustDepartman:'Yönetim & Operasyon', ad:'İdari İşler',                 kisa:'İdari',     yonetici:'EMP-011', aktif:true,  personel:0 },
  { kod:'DEP-18', ustDepartman:'Satış & Müşteri', ad:'Pazarlama',                   kisa:'Pazarlama', yonetici:'EMP-002', aktif:true,  personel:0 },
  { kod:'DEP-19', ustDepartman:'Satış & Müşteri', ad:'İçerik Üretimi',              kisa:'İçerik',    yonetici:'EMP-002', aktif:false, personel:0 },
  { kod:'DEP-20', ustDepartman:null, ad:'Dış Kaynak Ekipler',          kisa:'Dış Kaynak',yonetici:'EMP-003', aktif:false,  personel:0 },
  { kod:'DEP-21', ustDepartman:null, ad:'Freelancer ve Çözüm Ortakları',kisa:'Freelancer',yonetici:'EMP-003',aktif:false,  personel:0 }
];

/* ---- Roller (PROMPT.md §5 — 27 rol; §5 listesi sayıldığında 27 madde) ------
   dash : hangi dashboard varyantını kullanır (PROMPT.md §7 — 6 varyant)
   kademe: 1 yönetim · 2 orta kademe · 3 uzman · 4 dış/kısıtlı
------------------------------------------------------------------------ */
DB.roles = [
  { key:'sahip',        ad:'Şirket Sahibi',            dash:'sahip',    kademe:1 },
  { key:'genelmudur',   ad:'Genel Müdür',              dash:'sahip',    kademe:1 },
  { key:'operasyon',    ad:'Operasyon Yöneticisi',     dash:'pm',       kademe:1 },
  { key:'depmudur',     ad:'Departman Yöneticisi',     dash:'pm',       kademe:2 },
  { key:'satismudur',   ad:'Satış Yöneticisi',         dash:'satis',    kademe:2 },
  { key:'satistemsilci',ad:'Satış Temsilcisi',         dash:'satis',    kademe:3 },
  { key:'musteritems',  ad:'Müşteri Temsilcisi',       dash:'personel', kademe:3 },
  { key:'analist',      ad:'İş Analisti',              dash:'pm',       kademe:3 },
  { key:'pm',           ad:'Proje Yöneticisi',         dash:'pm',       kademe:2 },
  { key:'takimlideri',  ad:'Takım Lideri',             dash:'pm',       kademe:2 },
  { key:'tasarimci',    ad:'UI/UX Tasarımcı',          dash:'personel', kademe:3 },
  { key:'frontend',     ad:'Front-end Geliştirici',    dash:'personel', kademe:3 },
  { key:'backend',      ad:'Back-end Geliştirici',     dash:'personel', kademe:3 },
  { key:'mobil',        ad:'Mobil Geliştirici',        dash:'personel', kademe:3 },
  { key:'ai',           ad:'Yapay Zekâ Geliştiricisi', dash:'personel', kademe:3 },
  { key:'qa',           ad:'Test ve Kalite Uzmanı',    dash:'personel', kademe:3 },
  { key:'devops',       ad:'DevOps Personeli',         dash:'personel', kademe:3 },
  { key:'destek',       ad:'Teknik Destek Personeli',  dash:'personel', kademe:3 },
  { key:'ik',           ad:'İnsan Kaynakları',         dash:'ik',       kademe:2 },
  { key:'muhasebe',     ad:'Muhasebe',                 dash:'satinalma',kademe:2 },
  { key:'satinalma',    ad:'Satın Alma Sorumlusu',     dash:'satinalma',kademe:2 },
  { key:'idari',        ad:'İdari İşler Sorumlusu',    dash:'satinalma',kademe:2 },
  { key:'freelancer',   ad:'Freelancer',               dash:'personel', kademe:4 },
  { key:'diskaynak',    ad:'Dış Kaynak Ekip',          dash:'personel', kademe:4 },
  { key:'stajyer',      ad:'Stajyer',                  dash:'personel', kademe:4 },
  { key:'musteri',      ad:'Müşteri Kullanıcısı',      dash:'musteri',  kademe:4 },
  { key:'sistem',       ad:'Sistem Yöneticisi',        dash:'sahip',    kademe:1 }
];

/* ---- Yetki matrisi (PROMPT.md §5 / §26-D) ---------------------------
   Değerler: 'tum' | 'departman' | 'proje' | 'kendi' | 'yok'
   Onay/finans/maas/log alanları boolean.
------------------------------------------------------------------------ */
DB.permMatrix = {
  /* rol          gor        ekle       duzenle    sil        onay   rapor      finans maas  personelVeri log  disaAktar */
  sahip:        { gor:'tum', ekle:'tum', duzenle:'tum', sil:'tum', onay:true,  rapor:'tum', finans:true,  maas:true,  personel:'tum',       log:true,  disaAktar:true },
  genelmudur:   { gor:'tum', ekle:'tum', duzenle:'tum', sil:'tum', onay:true,  rapor:'tum', finans:true,  maas:true,  personel:'tum',       log:true,  disaAktar:true },
  sistem:       { gor:'tum', ekle:'tum', duzenle:'tum', sil:'tum', onay:true,  rapor:'tum', finans:true,  maas:false, personel:'tum',       log:true,  disaAktar:true },
  operasyon:    { gor:'tum', ekle:'tum', duzenle:'tum', sil:'yok', onay:true,  rapor:'tum', finans:true,  maas:false, personel:'departman', log:true,  disaAktar:true },
  depmudur:     { gor:'departman', ekle:'departman', duzenle:'departman', sil:'yok', onay:true, rapor:'departman', finans:false, maas:false, personel:'departman', log:false, disaAktar:true },
  satismudur:   { gor:'tum', ekle:'tum', duzenle:'tum', sil:'yok', onay:true,  rapor:'tum', finans:true,  maas:false, personel:'departman', log:false, disaAktar:true },
  satistemsilci:{ gor:'kendi', ekle:'kendi', duzenle:'kendi', sil:'yok', onay:false, rapor:'kendi', finans:false, maas:false, personel:'yok', log:false, disaAktar:true },
  musteritems:  { gor:'departman', ekle:'departman', duzenle:'kendi', sil:'yok', onay:false, rapor:'departman', finans:false, maas:false, personel:'yok', log:false, disaAktar:false },
  analist:      { gor:'proje', ekle:'proje', duzenle:'proje', sil:'yok', onay:false, rapor:'proje', finans:false, maas:false, personel:'yok', log:false, disaAktar:true },
  pm:           { gor:'proje', ekle:'proje', duzenle:'proje', sil:'yok', onay:true,  rapor:'proje', finans:true,  maas:false, personel:'proje', log:false, disaAktar:true },
  takimlideri:  { gor:'departman', ekle:'departman', duzenle:'departman', sil:'yok', onay:true, rapor:'departman', finans:false, maas:false, personel:'departman', log:false, disaAktar:true },
  tasarimci:    { gor:'kendi', ekle:'kendi', duzenle:'kendi', sil:'yok', onay:false, rapor:'kendi', finans:false, maas:false, personel:'yok', log:false, disaAktar:false },
  frontend:     { gor:'kendi', ekle:'kendi', duzenle:'kendi', sil:'yok', onay:false, rapor:'kendi', finans:false, maas:false, personel:'yok', log:false, disaAktar:false },
  backend:      { gor:'kendi', ekle:'kendi', duzenle:'kendi', sil:'yok', onay:false, rapor:'kendi', finans:false, maas:false, personel:'yok', log:false, disaAktar:false },
  mobil:        { gor:'kendi', ekle:'kendi', duzenle:'kendi', sil:'yok', onay:false, rapor:'kendi', finans:false, maas:false, personel:'yok', log:false, disaAktar:false },
  ai:           { gor:'kendi', ekle:'kendi', duzenle:'kendi', sil:'yok', onay:false, rapor:'kendi', finans:false, maas:false, personel:'yok', log:false, disaAktar:false },
  qa:           { gor:'proje', ekle:'proje', duzenle:'proje', sil:'yok', onay:false, rapor:'proje', finans:false, maas:false, personel:'yok', log:false, disaAktar:false },
  devops:       { gor:'proje', ekle:'proje', duzenle:'proje', sil:'yok', onay:false, rapor:'proje', finans:false, maas:false, personel:'yok', log:true,  disaAktar:false },
  destek:       { gor:'departman', ekle:'departman', duzenle:'departman', sil:'yok', onay:false, rapor:'departman', finans:false, maas:false, personel:'yok', log:false, disaAktar:false },
  ik:           { gor:'tum', ekle:'departman', duzenle:'departman', sil:'yok', onay:true, rapor:'tum', finans:false, maas:true, personel:'tum', log:false, disaAktar:true },
  muhasebe:     { gor:'tum', ekle:'departman', duzenle:'departman', sil:'yok', onay:true, rapor:'tum', finans:true, maas:true, personel:'departman', log:false, disaAktar:true },
  satinalma:    { gor:'departman', ekle:'departman', duzenle:'departman', sil:'yok', onay:true, rapor:'departman', finans:true, maas:false, personel:'yok', log:false, disaAktar:true },
  idari:        { gor:'departman', ekle:'departman', duzenle:'departman', sil:'yok', onay:false, rapor:'departman', finans:false, maas:false, personel:'yok', log:false, disaAktar:true },
  freelancer:   { gor:'kendi', ekle:'yok', duzenle:'kendi', sil:'yok', onay:false, rapor:'yok', finans:false, maas:false, personel:'yok', log:false, disaAktar:false },
  diskaynak:    { gor:'kendi', ekle:'yok', duzenle:'kendi', sil:'yok', onay:false, rapor:'yok', finans:false, maas:false, personel:'yok', log:false, disaAktar:false },
  stajyer:      { gor:'kendi', ekle:'yok', duzenle:'kendi', sil:'yok', onay:false, rapor:'yok', finans:false, maas:false, personel:'yok', log:false, disaAktar:false },
  /* REVİZE 13 — müşteri rolünün kapsamı `kendi` DEĞİL `musteri`dir.
     `kendi` bir PERSONEL ekseniydi (`GV.session.emp` ile eşleşir) ve müşteri
     oturumunda `emp` yoktur; sonuç: `GV.list`in `musteri` dalı (ui.js
     `afterScope`) beş oturum boyunca ÖLÜ KODDU ve ekranlar koleksiyonun
     tamamını basıyordu. `rapor` da aynı eksene çekildi. */
  musteri:      { gor:'musteri', ekle:'musteri', duzenle:'yok', sil:'yok', onay:true,  rapor:'musteri', finans:false, maas:false, personel:'yok', log:false, disaAktar:false }
};

/* ---- Personel (PROMPT.md §14 — personel kartı) ----------------------- */
/* ---- Çalışma tipi (REVİZE 16) ----------------------------------------
   Freelancer ve dış kaynak DEPARTMAN DEĞİL, **istihdam ilişkisidir**.
   ⚠️ Var olan `calismaTuru` alanı BAŞKA BİR EKSENDİR ve korunur: o MESAİ
   eksenidir (`Tam zamanlı · Yarı zamanlı · Proje bazlı`). Bir freelancer tam
   zamanlı da çalışabilir; iki ekseni tek alana sıkıştırmak VB-20'nin tam
   olarak düştüğü hatadır. Yeni alan yanına gelir, yerine geçmez.
   Değer TÜRETİLDİ: `sozlesme:'Hizmet sözleşmesi'` + DEP-21 → `Freelancer`
   (EMP-015); kalan 15 kayıt → `Kadrolu` (staj sözleşmesi de kadroludur —
   stajyer şirketin içindedir, dış kaynak değil).
   `GV.hr.disKaynak` artık bu eksenden okur; ekranlar kendi kuralını yazmaz. */
DB.workTypes = ['Kadrolu','Freelancer','Ajans','Danışman','Dış Kaynak'];

DB.employees = [
  { kod:'EMP-001', uzmanlik:null, calismaTipi:'Kadrolu', ad:'Kerem Aydın', ini:'KA', rol:'sahip', roller:['sahip','genelmudur'], dep:'DEP-01', depAd:'Yönetim',
    pozisyon:'Kurucu Ortak / Genel Müdür', yonetici:null, calismaTuru:'Tam zamanlı', sozlesme:'Belirsiz süreli',
    girisTarihi:'2021-03-15', tel:'+90 532 000 00 01', eposta:'kerem@gaviaworks.com', dogum:'1986-04-12',
    acilKisi:'Nuray Aydın · +90 532 000 10 01', egitim:'Bilgisayar Mühendisliği — ODTÜ',
    yetkinlik:['Strateji','Ürün Yönetimi','Satış'], teknoloji:['Node.js','PostgreSQL'], sertifika:['PMP'],
    maas:185000, izinBakiye:14, doluluk:64, aktif:true, lokasyon:'Ankara', kanGrubu:'A Rh+' },
  { kod:'EMP-002', uzmanlik:null, calismaTipi:'Kadrolu', ad:'Selin Dağdeviren', ini:'SD', rol:'satismudur', roller:['satismudur'], dep:'DEP-02', depAd:'Satış ve İş Geliştirme',
    pozisyon:'Satış ve İş Geliştirme Yöneticisi', yonetici:'EMP-001', calismaTuru:'Tam zamanlı', sozlesme:'Belirsiz süreli',
    girisTarihi:'2021-09-01', tel:'+90 532 000 00 02', eposta:'selin@gaviaworks.com', dogum:'1990-11-02',
    acilKisi:'Murat Dağdeviren · +90 532 000 10 02', egitim:'İşletme — Bilkent',
    yetkinlik:['Satış','Teklif Yönetimi','Müzakere'], teknoloji:['HubSpot'], sertifika:['SPIN Selling'],
    maas:112000, izinBakiye:9, doluluk:78, aktif:true, lokasyon:'Ankara', kanGrubu:'0 Rh+' },
  { kod:'EMP-003', uzmanlik:null, calismaTipi:'Kadrolu', ad:'Barış Yalçın', ini:'BY', rol:'pm', roller:['pm','analist','operasyon'], dep:'DEP-05', depAd:'Proje Yönetimi',
    pozisyon:'Proje Yöneticisi / İş Analisti', yonetici:'EMP-001', calismaTuru:'Tam zamanlı', sozlesme:'Belirsiz süreli',
    girisTarihi:'2021-06-14', tel:'+90 532 000 00 03', eposta:'baris@gaviaworks.com', dogum:'1988-07-21',
    acilKisi:'Elif Yalçın · +90 532 000 10 03', egitim:'Endüstri Mühendisliği — Hacettepe',
    yetkinlik:['Scrum','İş Analizi','Risk Yönetimi'], teknoloji:['Jira','Figma'], sertifika:['PSM I','PMI-ACP'],
    maas:124000, izinBakiye:6, doluluk:92, aktif:true, lokasyon:'Ankara', kanGrubu:'B Rh+' },
  { kod:'EMP-004', uzmanlik:'UI/UX Tasarım', calismaTipi:'Kadrolu', ad:'Ece Turan', ini:'ET', rol:'tasarimci', roller:['tasarimci','takimlideri'], dep:'DEP-06', depAd:'UI/UX Tasarım',
    pozisyon:'Kıdemli UI/UX Tasarımcı', yonetici:'EMP-003', calismaTuru:'Tam zamanlı', sozlesme:'Belirsiz süreli',
    girisTarihi:'2022-02-07', tel:'+90 532 000 00 04', eposta:'ece@gaviaworks.com', dogum:'1993-01-30',
    acilKisi:'Sinem Turan · +90 532 000 10 04', egitim:'Görsel İletişim Tasarımı — Bilkent',
    yetkinlik:['UI','UX Araştırma','Design System','Erişilebilirlik'], teknoloji:['Figma','Framer'], sertifika:['NN/g UX'],
    maas:96000, izinBakiye:11, doluluk:86, aktif:true, lokasyon:'Ankara', kanGrubu:'A Rh-' },
  { kod:'EMP-005', uzmanlik:'Backend', calismaTipi:'Kadrolu', ad:'Mert Özkan', ini:'MÖ', rol:'backend', roller:['backend','takimlideri'], dep:'DEP-08', depAd:'Back-end Geliştirme',
    pozisyon:'Kıdemli Back-end Geliştirici', yonetici:'EMP-003', calismaTuru:'Tam zamanlı', sozlesme:'Belirsiz süreli',
    girisTarihi:'2021-11-22', tel:'+90 532 000 00 05', eposta:'mert@gaviaworks.com', dogum:'1991-05-18',
    acilKisi:'Hakan Özkan · +90 532 000 10 05', egitim:'Bilgisayar Mühendisliği — Gazi',
    yetkinlik:['API Tasarımı','Mimari','Performans'], teknoloji:['Node.js','NestJS','PostgreSQL','Redis'], sertifika:['AWS SAA'],
    maas:118000, izinBakiye:4, doluluk:97, aktif:true, lokasyon:'Ankara', kanGrubu:'0 Rh-' },
  { kod:'EMP-006', uzmanlik:'Frontend', calismaTipi:'Kadrolu', ad:'Deniz Korkmaz', ini:'DK', rol:'frontend', roller:['frontend'], dep:'DEP-07', depAd:'Front-end Geliştirme',
    pozisyon:'Front-end Geliştirici', yonetici:'EMP-003', calismaTuru:'Tam zamanlı', sozlesme:'Belirsiz süreli',
    girisTarihi:'2022-08-15', tel:'+90 532 000 00 06', eposta:'deniz@gaviaworks.com', dogum:'1995-09-09',
    acilKisi:'Aylin Korkmaz · +90 532 000 10 06', egitim:'Yazılım Mühendisliği — Atılım',
    yetkinlik:['Erişilebilirlik','Performans'], teknoloji:['React','TypeScript','Vite'], sertifika:[],
    maas:88000, izinBakiye:13, doluluk:81, aktif:true, lokasyon:'Ankara', kanGrubu:'A Rh+' },
  { kod:'EMP-007', uzmanlik:'AI Development', calismaTipi:'Kadrolu', ad:'Zeynep Aksoy', ini:'ZA', rol:'ai', roller:['ai'], dep:'DEP-10', depAd:'Yapay Zekâ ve Veri',
    pozisyon:'Yapay Zekâ Geliştiricisi', yonetici:'EMP-003', calismaTuru:'Tam zamanlı', sozlesme:'Belirsiz süreli',
    girisTarihi:'2023-01-09', tel:'+90 532 000 00 07', eposta:'zeynep@gaviaworks.com', dogum:'1994-03-25',
    acilKisi:'Ceren Aksoy · +90 532 000 10 07', egitim:'Yapay Zekâ Yüksek Lisans — ODTÜ',
    yetkinlik:['LLM Entegrasyonu','RAG','Veri İşleme'], teknoloji:['Python','LangChain','pgvector'], sertifika:['TensorFlow Dev'],
    maas:108000, izinBakiye:8, doluluk:74, aktif:true, lokasyon:'Ankara', kanGrubu:'B Rh-' },
  { kod:'EMP-008', uzmanlik:'Mobile', calismaTipi:'Kadrolu', ad:'Onur Şahin', ini:'OŞ', rol:'mobil', roller:['mobil'], dep:'DEP-09', depAd:'Mobil Uygulama Geliştirme',
    pozisyon:'Mobil Uygulama Geliştirici', yonetici:'EMP-003', calismaTuru:'Tam zamanlı', sozlesme:'Belirsiz süreli',
    girisTarihi:'2022-11-01', tel:'+90 532 000 00 08', eposta:'onur@gaviaworks.com', dogum:'1992-12-14',
    acilKisi:'Merve Şahin · +90 532 000 10 08', egitim:'Bilgisayar Mühendisliği — Başkent',
    yetkinlik:['Mobil Mimari','Store Süreçleri'], teknoloji:['React Native','Swift','Kotlin'], sertifika:[],
    maas:94000, izinBakiye:10, doluluk:88, aktif:true, lokasyon:'Ankara', kanGrubu:'AB Rh+' },
  { kod:'EMP-009', uzmanlik:'QA', calismaTipi:'Kadrolu', ad:'Gamze Erdem', ini:'GE', rol:'qa', roller:['qa'], dep:'DEP-11', depAd:'Test ve Kalite',
    pozisyon:'Test ve Kalite Uzmanı', yonetici:'EMP-003', calismaTuru:'Tam zamanlı', sozlesme:'Belirsiz süreli',
    girisTarihi:'2023-04-17', tel:'+90 532 000 00 09', eposta:'gamze@gaviaworks.com', dogum:'1996-06-05',
    acilKisi:'Tarık Erdem · +90 532 000 10 09', egitim:'Yazılım Mühendisliği — TOBB',
    yetkinlik:['Test Otomasyonu','Regresyon'], teknoloji:['Playwright','Postman'], sertifika:['ISTQB Foundation'],
    maas:82000, izinBakiye:12, doluluk:69, aktif:true, lokasyon:'Ankara', kanGrubu:'0 Rh+' },
  { kod:'EMP-010', uzmanlik:'DevOps', calismaTipi:'Kadrolu', ad:'Tolga Bayrak', ini:'TB', rol:'devops', roller:['devops'], dep:'DEP-12', depAd:'DevOps ve Sistem Yönetimi',
    pozisyon:'DevOps Mühendisi', yonetici:'EMP-005', calismaTuru:'Tam zamanlı', sozlesme:'Belirsiz süreli',
    girisTarihi:'2023-07-03', tel:'+90 532 000 00 10', eposta:'tolga@gaviaworks.com', dogum:'1990-02-28',
    acilKisi:'Serap Bayrak · +90 532 000 10 10', egitim:'Elektrik-Elektronik Mühendisliği — Yıldız',
    yetkinlik:['CI/CD','İzleme','Güvenlik','AWS','Altyapı'], teknoloji:['Docker','Kubernetes','Terraform','GitHub Actions'], sertifika:['CKA'],
    maas:106000, izinBakiye:7, doluluk:71, aktif:true, lokasyon:'Uzaktan · İstanbul', kanGrubu:'A Rh+' },
  { kod:'EMP-011', uzmanlik:null, calismaTipi:'Kadrolu', ad:'Pınar Uçar', ini:'PU', rol:'ik', roller:['ik','idari'], dep:'DEP-14', depAd:'İnsan Kaynakları',
    pozisyon:'İK ve İdari İşler Sorumlusu', yonetici:'EMP-001', calismaTuru:'Tam zamanlı', sozlesme:'Belirsiz süreli',
    girisTarihi:'2022-05-16', tel:'+90 532 000 00 11', eposta:'pinar@gaviaworks.com', dogum:'1989-08-11',
    acilKisi:'Kaan Uçar · +90 532 000 10 11', egitim:'İnsan Kaynakları Yönetimi — Ankara Üni.',
    yetkinlik:['Bordro','İşe Alım','Özlük'], teknoloji:['Logo İK'], sertifika:['İSG Uzmanı C'],
    maas:86000, izinBakiye:15, doluluk:58, aktif:true, lokasyon:'Ankara', kanGrubu:'B Rh+' },
  { kod:'EMP-012', uzmanlik:null, calismaTipi:'Kadrolu', ad:'Serkan Yılmaz', ini:'SY', rol:'muhasebe', roller:['muhasebe','satinalma'], dep:'DEP-15', depAd:'Muhasebe ve Finans',
    pozisyon:'Mali İşler ve Satın Alma Sorumlusu', yonetici:'EMP-001', calismaTuru:'Tam zamanlı', sozlesme:'Belirsiz süreli',
    girisTarihi:'2021-10-11', tel:'+90 532 000 00 12', eposta:'serkan@gaviaworks.com', dogum:'1985-10-19',
    acilKisi:'Fatma Yılmaz · +90 532 000 10 12', egitim:'İşletme — Anadolu',
    yetkinlik:['Ön Muhasebe','Tahsilat','Tedarik'], teknoloji:['Logo Tiger','Paraşüt'], sertifika:['SMMM Stajyer'],
    maas:92000, izinBakiye:5, doluluk:66, aktif:true, lokasyon:'Ankara', kanGrubu:'0 Rh+' },
  { kod:'EMP-013', uzmanlik:null, calismaTipi:'Kadrolu', ad:'Ayşe Kaplan', ini:'AK', rol:'destek', roller:['destek','musteritems'], dep:'DEP-13', depAd:'Teknik Destek',
    pozisyon:'Müşteri İlişkileri ve Destek Uzmanı', yonetici:'EMP-002', calismaTuru:'Tam zamanlı', sozlesme:'Belirsiz süreli',
    girisTarihi:'2023-09-25', tel:'+90 532 000 00 13', eposta:'ayse@gaviaworks.com', dogum:'1997-04-08',
    acilKisi:'Hüseyin Kaplan · +90 532 000 10 13', egitim:'Yönetim Bilişim Sistemleri — Gazi',
    yetkinlik:['Destek Süreçleri','SLA','Müşteri İletişimi'], teknoloji:['Zendesk'], sertifika:[],
    maas:74000, izinBakiye:16, doluluk:83, aktif:true, lokasyon:'Ankara', kanGrubu:'A Rh+' },
  { kod:'EMP-014', uzmanlik:null, calismaTipi:'Kadrolu', ad:'Emre Bulut', ini:'EB', rol:'satistemsilci', roller:['satistemsilci'], dep:'DEP-02', depAd:'Satış ve İş Geliştirme',
    pozisyon:'Satış Temsilcisi', yonetici:'EMP-002', calismaTuru:'Tam zamanlı', sozlesme:'Belirli süreli',
    girisTarihi:'2025-02-03', tel:'+90 532 000 00 14', eposta:'emre@gaviaworks.com', dogum:'1998-11-27',
    acilKisi:'Derya Bulut · +90 532 000 10 14', egitim:'Pazarlama — Hacettepe',
    yetkinlik:['Lead Takibi','Demo Sunumu'], teknoloji:[], sertifika:[],
    maas:64000, izinBakiye:8, doluluk:72, aktif:true, lokasyon:'Ankara', kanGrubu:'B Rh+' },
  { kod:'EMP-015', uzmanlik:'Grafik Tasarım', calismaTipi:'Freelancer', ad:'Nihan Arslan', ini:'NA', rol:'freelancer', roller:['freelancer'], dep:'DEP-06', depAd:'UI/UX Tasarım',
    pozisyon:'Freelance Grafik Tasarımcı', yonetici:'EMP-004', calismaTuru:'Proje bazlı', sozlesme:'Hizmet sözleşmesi',
    girisTarihi:'2025-06-01', tel:'+90 532 000 00 15', eposta:'nihan@dis.gaviaworks.com', dogum:'1994-07-16',
    acilKisi:'—', egitim:'Grafik Tasarım — Marmara',
    yetkinlik:['Marka Kimliği','İllüstrasyon'], teknoloji:['Illustrator','After Effects'], sertifika:[],
    maas:0, saatlikUcret:1450, izinBakiye:0, doluluk:35, aktif:true, lokasyon:'Uzaktan · İzmir', kanGrubu:'—' },
  { kod:'EMP-016', uzmanlik:'Frontend', calismaTipi:'Kadrolu', ad:'Can Özdemir', ini:'CÖ', rol:'stajyer', roller:['stajyer'], dep:'DEP-07', depAd:'Front-end Geliştirme',
    pozisyon:'Front-end Stajyeri', yonetici:'EMP-006', calismaTuru:'Yarı zamanlı', sozlesme:'Staj sözleşmesi',
    girisTarihi:'2026-06-15', tel:'+90 532 000 00 16', eposta:'can@gaviaworks.com', dogum:'2003-02-19',
    acilKisi:'Neslihan Özdemir · +90 532 000 10 16', egitim:'Bilgisayar Mühendisliği (3. sınıf) — Hacettepe',
    yetkinlik:['HTML/CSS'], teknoloji:['JavaScript'], sertifika:[],
    maas:22000, izinBakiye:0, doluluk:44, aktif:true, lokasyon:'Ankara', kanGrubu:'0 Rh+' }
];

/* ---- Hızlı erişim yardımcıları -------------------------------------- */
DB.emp = function(kod){ return DB.employees.filter(function(e){ return e.kod === kod; })[0] || null; };
DB.empName = function(kod){ var e = DB.emp(kod); return e ? e.ad : '—'; };
DB.dep = function(kod){ return DB.departments.filter(function(d){ return d.kod === kod; })[0] || null; };
DB.depName = function(kod){ var d = DB.dep(kod); return d ? d.ad : '—'; };
DB.roleName = function(key){ var r = DB.roles.filter(function(x){ return x.key === key; })[0]; return r ? r.ad : key; };
