/* =====================================================================
   GAVIAWORKS CRM — OPERASYON VERİSİ
   Demirbaş · Zimmet · Araç ve filo (bakım/muayene/sigorta/kasko/yakıt/
   gider/kaza/ceza) · Satın alma · Tedarikçi · Sipariş · Destek talepleri
   ===================================================================== */
window.DB = window.DB || {};

DB.assetCategories = ['Bilgisayar','Monitör','Telefon','Tablet','Klavye','Mouse','Kulaklık','Kamera',
  'Mikrofon','Sunucu','Ağ ekipmanı','Yazıcı','Ofis mobilyası','Yazılım lisansı','Kurumsal abonelik',
  'Otomobil','Ticari araç','Motosiklet','Kiralık araç','Diğer'];

/* ---- Demirbaşlar (PROMPT.md §15) --------------------------------------- */
DB.assets = [
  { kod:'DMB-2024-001', kategori:'Bilgisayar', altKategori:'Dizüstü', marka:'Apple', model:'MacBook Pro 14 M3', seri:'C02X1234ABCD',
    ozellik:'M3 Pro · 18 GB RAM · 512 GB SSD', alisTarihi:'2024-01-18', alisFiyati:82000, tedarikci:'TDR-002',
    garantiBas:'2024-01-18', garantiBit:'2027-01-18', lokasyon:'Ofis · Ankara', dep:'DEP-08',
    durum:'Zimmetli', zimmetli:'EMP-005', zimmetTarihi:'2024-01-22', iadeTarihi:null, barkod:'GW-DMB-0001', aktif:true },
  { kod:'DMB-2024-002', kategori:'Bilgisayar', altKategori:'Dizüstü', marka:'Apple', model:'MacBook Air 15 M2', seri:'C02X5678EFGH',
    ozellik:'M2 · 16 GB RAM · 512 GB SSD', alisTarihi:'2024-03-05', alisFiyati:61000, tedarikci:'TDR-002',
    garantiBas:'2024-03-05', garantiBit:'2027-03-05', lokasyon:'Ofis · Ankara', dep:'DEP-06',
    durum:'Zimmetli', zimmetli:'EMP-004', zimmetTarihi:'2024-03-08', iadeTarihi:null, barkod:'GW-DMB-0002', aktif:true },
  { kod:'DMB-2024-003', kategori:'Bilgisayar', altKategori:'Masaüstü', marka:'Dell', model:'OptiPlex 7010', seri:'DL7010X991',
    ozellik:'i7 · 32 GB RAM · 1 TB SSD', alisTarihi:'2024-06-11', alisFiyati:47000, tedarikci:'TDR-001',
    garantiBas:'2024-06-11', garantiBit:'2027-06-11', lokasyon:'Ofis · Ankara', dep:'DEP-07',
    durum:'Zimmetli', zimmetli:'EMP-006', zimmetTarihi:'2024-06-14', iadeTarihi:null, barkod:'GW-DMB-0003', aktif:true },
  { kod:'DMB-2025-004', kategori:'Monitör', altKategori:'27 inç', marka:'LG', model:'27UP850', seri:'LG27UP1234',
    ozellik:'4K · USB-C 90W', alisTarihi:'2025-02-20', alisFiyati:18500, tedarikci:'TDR-001',
    garantiBas:'2025-02-20', garantiBit:'2027-02-20', lokasyon:'Ofis · Ankara', dep:'DEP-07',
    durum:'Zimmetli', zimmetli:'EMP-006', zimmetTarihi:'2025-02-24', iadeTarihi:null, barkod:'GW-DMB-0004', aktif:true },
  { kod:'DMB-2025-005', kategori:'Monitör', altKategori:'27 inç', marka:'Dell', model:'U2723QE', seri:'DLU27X8877',
    ozellik:'4K · USB-C hub', alisTarihi:'2025-02-20', alisFiyati:21000, tedarikci:'TDR-001',
    garantiBas:'2025-02-20', garantiBit:'2027-02-20', lokasyon:'Depo · Ankara', dep:'DEP-17',
    durum:'Depoda', zimmetli:null, zimmetTarihi:null, iadeTarihi:'2026-05-14', barkod:'GW-DMB-0005', aktif:true },
  { kod:'DMB-2025-006', kategori:'Telefon', altKategori:'Test cihazı', marka:'Apple', model:'iPhone 15', seri:'IP15XZ4471',
    ozellik:'128 GB · iOS 18', alisTarihi:'2025-04-02', alisFiyati:54000, tedarikci:'TDR-002',
    garantiBas:'2025-04-02', garantiBit:'2027-04-02', lokasyon:'Ofis · Ankara', dep:'DEP-09',
    durum:'Zimmetli', zimmetli:'EMP-008', zimmetTarihi:'2025-04-05', iadeTarihi:null, barkod:'GW-DMB-0006', aktif:true },
  { kod:'DMB-2025-007', kategori:'Telefon', altKategori:'Test cihazı', marka:'Samsung', model:'Galaxy S24', seri:'SGS24AA1029',
    ozellik:'256 GB · Android 14', alisTarihi:'2025-04-02', alisFiyati:41000, tedarikci:'TDR-002',
    garantiBas:'2025-04-02', garantiBit:'2027-04-02', lokasyon:'Ofis · Ankara', dep:'DEP-11',
    durum:'Zimmetli', zimmetli:'EMP-009', zimmetTarihi:'2025-04-05', iadeTarihi:null, barkod:'GW-DMB-0007', aktif:true },
  { kod:'DMB-2025-008', kategori:'Sunucu', altKategori:'NAS', marka:'Synology', model:'DS923+', seri:'SYN923X445',
    ozellik:'4 yuva · 32 TB', alisTarihi:'2025-08-14', alisFiyati:68000, tedarikci:'TDR-001',
    garantiBas:'2025-08-14', garantiBit:'2028-08-14', lokasyon:'Ofis · Sistem odası', dep:'DEP-12',
    durum:'Aktif', zimmetli:null, zimmetTarihi:null, iadeTarihi:null, barkod:'GW-DMB-0008', aktif:true },
  { kod:'DMB-2025-009', kategori:'Yazılım lisansı', altKategori:'Tasarım', marka:'Figma', model:'Organization', seri:'FIG-ORG-2025',
    ozellik:'8 düzenleyici koltuk', alisTarihi:'2025-09-01', alisFiyati:42000, tedarikci:'TDR-003',
    garantiBas:'2025-09-01', garantiBit:'2026-08-31', lokasyon:'Bulut', dep:'DEP-06',
    durum:'Aktif', zimmetli:null, zimmetTarihi:null, iadeTarihi:null, barkod:'GW-DMB-0009', aktif:true },
  { kod:'DMB-2025-010', kategori:'Kurumsal abonelik', altKategori:'Bulut', marka:'AWS', model:'Kurumsal hesap', seri:'AWS-GW-01',
    ozellik:'Aylık ortalama 34.000 ₺', alisTarihi:'2025-01-01', alisFiyati:0, tedarikci:'TDR-004',
    garantiBas:'2025-01-01', garantiBit:'2026-12-31', lokasyon:'Bulut', dep:'DEP-12',
    durum:'Aktif', zimmetli:null, zimmetTarihi:null, iadeTarihi:null, barkod:'GW-DMB-0010', aktif:true },
  { kod:'DMB-2023-011', kategori:'Bilgisayar', altKategori:'Dizüstü', marka:'Lenovo', model:'ThinkPad T14', seri:'LNT14X2210',
    ozellik:'i5 · 16 GB RAM', alisTarihi:'2023-02-10', alisFiyati:38000, tedarikci:'TDR-001',
    garantiBas:'2023-02-10', garantiBit:'2026-02-10', lokasyon:'Depo · Ankara', dep:'DEP-17',
    durum:'Hurda', zimmetli:null, zimmetTarihi:null, iadeTarihi:'2026-03-20', barkod:'GW-DMB-0011', aktif:false, arsiv:true },
  { kod:'DMB-2026-012', kategori:'Kulaklık', altKategori:'Kablosuz', marka:'Sony', model:'WH-1000XM5', seri:'SNY1000X77',
    ozellik:'Gürültü engelleme', alisTarihi:'2026-01-15', alisFiyati:14500, tedarikci:'TDR-002',
    garantiBas:'2026-01-15', garantiBit:'2028-01-15', lokasyon:'Ofis · Ankara', dep:'DEP-10',
    durum:'Zimmetli', zimmetli:'EMP-007', zimmetTarihi:'2026-01-18', iadeTarihi:null, barkod:'GW-DMB-0012', aktif:true }
];

/* ---- Zimmet kayıtları --------------------------------------------------- */
DB.assignments = [
  { kod:'ZMT-2024-001', demirbas:'DMB-2024-001', personel:'EMP-005', teslimTarihi:'2024-01-22', iadeTarihi:null,
    durum:'Aktif', tutanak:'zimmet-2024-001.pdf', personelOnay:'Onaylandı', onayTarihi:'2024-01-22', hasar:null, aktif:true },
  { kod:'ZMT-2024-002', demirbas:'DMB-2024-002', personel:'EMP-004', teslimTarihi:'2024-03-08', iadeTarihi:null,
    durum:'Aktif', tutanak:'zimmet-2024-002.pdf', personelOnay:'Onaylandı', onayTarihi:'2024-03-08', hasar:null, aktif:true },
  { kod:'ZMT-2024-003', demirbas:'DMB-2024-003', personel:'EMP-006', teslimTarihi:'2024-06-14', iadeTarihi:null,
    durum:'Aktif', tutanak:'zimmet-2024-003.pdf', personelOnay:'Onaylandı', onayTarihi:'2024-06-14', hasar:null, aktif:true },
  { kod:'ZMT-2025-004', demirbas:'DMB-2025-006', personel:'EMP-008', teslimTarihi:'2025-04-05', iadeTarihi:null,
    durum:'Aktif', tutanak:'zimmet-2025-004.pdf', personelOnay:'Onaylandı', onayTarihi:'2025-04-05', hasar:null, aktif:true },
  { kod:'ZMT-2025-005', demirbas:'DMB-2025-005', personel:'EMP-016', teslimTarihi:'2025-11-03', iadeTarihi:'2026-05-14',
    durum:'İade edildi', tutanak:'zimmet-2025-005.pdf', personelOnay:'Onaylandı', onayTarihi:'2025-11-03',
    hasar:'Ekran çerçevesinde çizik', aktif:true },
  { kod:'ZMT-2026-006', demirbas:'DMB-2026-012', personel:'EMP-007', teslimTarihi:'2026-01-18', iadeTarihi:null,
    durum:'Aktif', tutanak:'zimmet-2026-006.pdf', personelOnay:'Onaylandı', onayTarihi:'2026-01-18', hasar:null, aktif:true },
  { kod:'ZMT-2026-007', demirbas:'DMB-2025-004', personel:'EMP-006', teslimTarihi:'2025-02-24', iadeTarihi:null,
    durum:'Aktif', tutanak:'zimmet-2026-007.pdf', personelOnay:'Bekliyor', onayTarihi:null, hasar:null, aktif:true }
];

/* ---- Araçlar (PROMPT.md §16 — ayrı filo modülü) ------------------------- */
DB.vehicles = [
  { kod:'ARC-001', plaka:'06 GW 1907', marka:'Volkswagen', model:'Passat 1.5 TSI', modelYili:2023, tip:'Otomobil',
    yakit:'Benzin', vites:'Otomatik', motorHacmi:1498, motorNo:'DPC123456', sasi:'WVWZZZ3CZPE123456', renk:'Gri',
    mulkiyet:'Satın alınan', alisTarihi:'2023-05-12', alisBedeli:1450000, satici:'VW Plaza Ankara',
    kullanim:'Personele tahsisli', anaSurucu:'EMP-001', yedekSurucu:'EMP-002', dep:'DEP-01', proje:null,
    durum:'Aktif', guncelKm:68400, sonBakimTarihi:'2026-04-18', sonBakimKm:60000,
    sonrakiBakimTarihi:'2026-10-18', sonrakiBakimKm:75000, aktif:true },
  { kod:'ARC-002', plaka:'06 GW 2201', marka:'Renault', model:'Clio 1.0 TCe', modelYili:2024, tip:'Otomobil',
    yakit:'Benzin', vites:'Manuel', motorHacmi:999, motorNo:'H4D456789', sasi:'VF15RJL0X71234567', renk:'Beyaz',
    mulkiyet:'Kiralık', alisTarihi:null, alisBedeli:null, satici:null,
    kiralamaFirmasi:'Filo Kiralama A.Ş.', sozlesmeBas:'2024-09-01', sozlesmeBit:'2027-08-31',
    aylikKira:24500, kmSiniri:30000, depozito:35000,
    kullanim:'Ortak kullanım', anaSurucu:null, yedekSurucu:null, dep:'DEP-17', proje:null,
    durum:'Aktif', guncelKm:41200, sonBakimTarihi:'2026-06-02', sonBakimKm:38000,
    sonrakiBakimTarihi:'2026-08-15', sonrakiBakimKm:48000, aktif:true },
  { kod:'ARC-003', plaka:'06 GW 3388', marka:'Ford', model:'Transit Courier', modelYili:2022, tip:'Ticari araç',
    yakit:'Dizel', vites:'Manuel', motorHacmi:1499, motorNo:'XVCA778812', sasi:'WF0WXXTTGWNU12345', renk:'Beyaz',
    mulkiyet:'Satın alınan', alisTarihi:'2022-11-08', alisBedeli:780000, satici:'Ford Otosan Bayi',
    kullanim:'Ortak kullanım', anaSurucu:null, yedekSurucu:null, dep:'DEP-17', proje:null,
    durum:'Serviste', guncelKm:112800, sonBakimTarihi:'2026-07-28', sonBakimKm:110000,
    sonrakiBakimTarihi:'2027-01-28', sonrakiBakimKm:125000, aktif:true },
  { kod:'ARC-004', plaka:'06 GW 5544', marka:'Toyota', model:'Corolla Hybrid', modelYili:2025, tip:'Otomobil',
    yakit:'Hibrit', vites:'Otomatik', motorHacmi:1798, motorNo:'2ZRFXE9911', sasi:'SB1KZ3JE60E123456', renk:'Lacivert',
    mulkiyet:'Satın alınan', alisTarihi:'2025-03-20', alisBedeli:1680000, satici:'Toyota Plaza',
    kullanim:'Personele tahsisli', anaSurucu:'EMP-002', yedekSurucu:'EMP-014', dep:'DEP-02', proje:null,
    durum:'Aktif', guncelKm:29600, sonBakimTarihi:'2026-03-11', sonBakimKm:20000,
    sonrakiBakimTarihi:'2026-09-11', sonrakiBakimKm:40000, aktif:true }
];

/* ---- Araç bakım kayıtları ---------------------------------------------- */
DB.maintenance = [
  { kod:'BKM-2026-021', arac:'ARC-002', tur:'Periyodik bakım', planTarihi:'2026-08-15', planKm:48000,
    gercekTarihi:null, servis:'Renault Yetkili Servis', maliyet:null, durum:'Yaklaşıyor', kalanGun:12,
    islemler:['Yağ değişimi','Filtre değişimi','Fren kontrolü'], aktif:true },
  { kod:'BKM-2026-020', arac:'ARC-003', tur:'Ağır bakım', planTarihi:'2026-07-28', planKm:110000,
    gercekTarihi:'2026-07-28', servis:'Ford Yetkili Servis', maliyet:34800, durum:'Serviste', kalanGun:-6,
    islemler:['Triger seti','Debriyaj','Fren balatası'], aktif:true },
  { kod:'BKM-2026-019', arac:'ARC-001', tur:'Periyodik bakım', planTarihi:'2026-10-18', planKm:75000,
    gercekTarihi:null, servis:'VW Yetkili Servis', maliyet:null, durum:'Planlandı', kalanGun:76,
    islemler:['Yağ değişimi','Filtre değişimi'], aktif:true },
  { kod:'BKM-2026-018', arac:'ARC-004', tur:'Periyodik bakım', planTarihi:'2026-09-11', planKm:40000,
    gercekTarihi:null, servis:'Toyota Plaza', maliyet:null, durum:'Planlandı', kalanGun:39,
    islemler:['Yağ değişimi','Akü kontrolü'], aktif:true },
  { kod:'BKM-2026-017', arac:'ARC-001', tur:'Periyodik bakım', planTarihi:'2026-04-18', planKm:60000,
    gercekTarihi:'2026-04-18', servis:'VW Yetkili Servis', maliyet:12400, durum:'Tamam', kalanGun:-107,
    islemler:['Yağ değişimi','Lastik değişimi'], aktif:true }
];

/* ---- Muayene ------------------------------------------------------------ */
DB.inspections = [
  { kod:'MYN-2026-004', arac:'ARC-001', sonTarih:'2024-08-28', gecerlilik:'2026-08-28', sonrakiTarih:'2026-08-28',
    sonuc:'Geçti', kusur:null, istasyon:'TÜVTÜRK Ankara', kalanGun:25, durum:'Yaklaşıyor', aktif:true },
  { kod:'MYN-2026-005', arac:'ARC-003', sonTarih:'2025-11-14', gecerlilik:'2026-11-14', sonrakiTarih:'2026-11-14',
    sonuc:'Geçti', kusur:'Hafif kusur — far ayarı', istasyon:'TÜVTÜRK Ankara', kalanGun:103, durum:'Planlandı', aktif:true },
  { kod:'MYN-2026-006', arac:'ARC-002', sonTarih:'2026-03-02', gecerlilik:'2028-03-02', sonrakiTarih:'2028-03-02',
    sonuc:'Geçti', kusur:null, istasyon:'TÜVTÜRK Ankara', kalanGun:577, durum:'Planlandı', aktif:true },
  { kod:'MYN-2026-007', arac:'ARC-004', sonTarih:'2025-03-20', gecerlilik:'2028-03-20', sonrakiTarih:'2028-03-20',
    sonuc:'Geçti', kusur:null, istasyon:'TÜVTÜRK Ankara', kalanGun:595, durum:'Planlandı', aktif:true }
];

/* ---- Sigorta ve kasko poliçeleri --------------------------------------- */
DB.policies = [
  { kod:'PLC-2026-011', arac:'ARC-001', tur:'Trafik Sigortası', sirket:'Anadolu Sigorta', police:'TRF-8891023',
    baslangic:'2025-09-05', bitis:'2026-09-05', prim:8400, teminat:'Zorunlu limitler', acente:'Sezer Sigorta',
    kalanGun:33, yenileme:'Bekliyor', odeme:'Ödendi', aktif:true },
  { kod:'PLC-2026-012', arac:'ARC-001', tur:'Kasko', sirket:'Allianz', police:'KSK-4471928',
    baslangic:'2025-09-05', bitis:'2026-09-05', prim:42000, kaskoBedeli:1350000, teminat:'Genişletilmiş',
    muafiyet:'%2', ikameArac:true, miniOnarim:true, hasarsizlik:'%50', acente:'Sezer Sigorta',
    kalanGun:33, yenileme:'Teklif alındı', odeme:'Ödendi', aktif:true },
  { kod:'PLC-2026-013', arac:'ARC-004', tur:'Trafik Sigortası', sirket:'Axa', police:'TRF-2298471',
    baslangic:'2026-03-20', bitis:'2027-03-20', prim:9100, teminat:'Zorunlu limitler', acente:'Sezer Sigorta',
    kalanGun:229, yenileme:'—', odeme:'Ödendi', aktif:true },
  { kod:'PLC-2026-014', arac:'ARC-004', tur:'Kasko', sirket:'Axa', police:'KSK-2298472',
    baslangic:'2026-03-20', bitis:'2027-03-20', prim:51000, kaskoBedeli:1620000, teminat:'Genişletilmiş',
    muafiyet:'%2', ikameArac:true, miniOnarim:true, hasarsizlik:'%30', acente:'Sezer Sigorta',
    kalanGun:229, yenileme:'—', odeme:'Ödendi', aktif:true },
  { kod:'PLC-2026-015', arac:'ARC-003', tur:'Trafik Sigortası', sirket:'Anadolu Sigorta', police:'TRF-7712004',
    baslangic:'2025-08-20', bitis:'2026-08-20', prim:11200, teminat:'Zorunlu limitler', acente:'Sezer Sigorta',
    kalanGun:17, yenileme:'Bekliyor', odeme:'Ödendi', aktif:true },
  { kod:'PLC-2026-016', arac:'ARC-002', tur:'Kasko', sirket:'Kiralama firması', police:'FLT-KSK-0221',
    baslangic:'2024-09-01', bitis:'2027-08-31', prim:0, kaskoBedeli:0, teminat:'Kiralama sözleşmesine dahil',
    muafiyet:'—', ikameArac:true, miniOnarim:false, hasarsizlik:'—', acente:'Filo Kiralama A.Ş.',
    kalanGun:393, yenileme:'—', odeme:'Sözleşmeye dahil', aktif:true }
];

/* ---- Yakıt kayıtları ---------------------------------------------------- */
DB.fuelLogs = [
  { kod:'YKT-2026-088', arac:'ARC-001', tarih:'2026-07-30', istasyon:'Shell Çankaya', litre:52.4, birimFiyat:48.9,
    tutar:2562, km:68120, surucu:'EMP-001', aktif:true },
  { kod:'YKT-2026-089', arac:'ARC-004', tarih:'2026-07-29', istasyon:'Opet Kızılay', litre:38.2, birimFiyat:48.5,
    tutar:1853, km:29380, surucu:'EMP-002', aktif:true },
  { kod:'YKT-2026-090', arac:'ARC-002', tarih:'2026-07-28', istasyon:'BP Bahçelievler', litre:41.0, birimFiyat:48.7,
    tutar:1997, km:41010, surucu:'EMP-014', aktif:true },
  { kod:'YKT-2026-091', arac:'ARC-003', tarih:'2026-07-24', istasyon:'Petrol Ofisi', litre:63.5, birimFiyat:46.2,
    tutar:2934, km:112400, surucu:'EMP-012', aktif:true },
  { kod:'YKT-2026-092', arac:'ARC-001', tarih:'2026-07-18', istasyon:'Shell Çankaya', litre:49.8, birimFiyat:48.4,
    tutar:2410, km:67380, surucu:'EMP-001', aktif:true }
];

/* ---- Araç giderleri ----------------------------------------------------- */
DB.vehicleExpenses = [
  { kod:'AGD-2026-051', arac:'ARC-003', tur:'Bakım', tarih:'2026-07-28', tutar:34800, aciklama:'Ağır bakım', belge:'FTR-SRV-8812', aktif:true },
  { kod:'AGD-2026-052', arac:'ARC-001', tur:'Yakıt', tarih:'2026-07-30', tutar:2562, aciklama:'Shell Çankaya', belge:'FIS-88123', aktif:true },
  { kod:'AGD-2026-053', arac:'ARC-001', tur:'HGS', tarih:'2026-07-15', tutar:640, aciklama:'Otoyol geçişi', belge:'HGS-0715', aktif:true },
  { kod:'AGD-2026-054', arac:'ARC-002', tur:'Kira', tarih:'2026-08-01', tutar:24500, aciklama:'Ağustos kirası', belge:'FTR-FLT-0801', aktif:true },
  { kod:'AGD-2026-055', arac:'ARC-004', tur:'Ceza', tarih:'2026-06-18', tutar:2167, aciklama:'Hız limiti aşımı', belge:'CEZ-2026-004', aktif:true },
  { kod:'AGD-2026-056', arac:'ARC-001', tur:'Sigorta', tarih:'2025-09-05', tutar:8400, aciklama:'Trafik sigortası primi', belge:'TRF-8891023', aktif:true },
  { kod:'AGD-2026-057', arac:'ARC-001', tur:'Kasko', tarih:'2025-09-05', tutar:42000, aciklama:'Kasko primi', belge:'KSK-4471928', aktif:true },
  { kod:'AGD-2026-058', arac:'ARC-003', tur:'Lastik', tarih:'2026-02-11', tutar:18600, aciklama:'4 adet kış lastiği', belge:'FTR-LST-221', aktif:true }
];

/* ---- Kaza, hasar ve cezalar --------------------------------------------- */
DB.accidents = [
  { kod:'KZA-2026-002', arac:'ARC-003', tarih:'2026-05-22', konum:'Eskişehir Yolu, Ankara', surucu:'EMP-012',
    karsiArac:'34 ABC 123', kusurOrani:0, tutanak:'kaza-tutanak-2026-002.pdf', ekspertiz:'Yapıldı',
    sigortaDosya:'AS-2026-99120', onarimServis:'Ford Yetkili Servis', onarimMaliyet:0, durum:'Kapandı',
    aciklama:'Karşı taraf tam kusurlu, hasar sigortadan karşılandı.', aktif:true }
];

DB.fines = [
  { kod:'CEZ-2026-004', arac:'ARC-004', tarih:'2026-06-18', surucu:'EMP-002', tur:'Hız limiti aşımı',
    tutar:2167, sonOdeme:'2026-07-18', durum:'Ödendi', belge:'ceza-2026-004.pdf', aktif:true },
  { kod:'CEZ-2026-005', arac:'ARC-001', tarih:'2026-07-26', surucu:'EMP-001', tur:'Park ihlali',
    tutar:1350, sonOdeme:'2026-08-25', durum:'Ödenmedi', belge:'ceza-2026-005.pdf', aktif:true }
];

/* ---- Tedarikçiler -------------------------------------------------------- */
DB.suppliers = [
  { kod:'TDR-001', unvan:'Teknomarket Bilişim Ltd.', kategori:'Donanım', yetkili:'Cem Aksu', tel:'+90 312 000 00 60',
    eposta:'satis@teknomarket.com', vergiNo:'1102938475', adres:'Ostim, Ankara', puan:4.4, siparisSayisi:14,
    toplamTutar:485000, odemeVadesi:'30 gün', durum:'Aktif', aktif:true },
  { kod:'TDR-002', unvan:'Apple Yetkili Satıcı — Bilgi A.Ş.', kategori:'Donanım', yetkili:'Deniz Ergün', tel:'+90 312 000 00 61',
    eposta:'kurumsal@bilgias.com', vergiNo:'2203948576', adres:'Çankaya, Ankara', puan:4.8, siparisSayisi:9,
    toplamTutar:392000, odemeVadesi:'Peşin', durum:'Aktif', aktif:true },
  { kod:'TDR-003', unvan:'Figma Inc.', kategori:'Yazılım lisansı', yetkili:'—', tel:'—',
    eposta:'billing@figma.com', vergiNo:'—', adres:'ABD', puan:4.6, siparisSayisi:3,
    toplamTutar:126000, odemeVadesi:'Peşin', durum:'Aktif', aktif:true },
  { kod:'TDR-004', unvan:'Amazon Web Services EMEA', kategori:'Bulut hizmeti', yetkili:'—', tel:'—',
    eposta:'aws-billing@amazon.com', vergiNo:'—', adres:'Lüksemburg', puan:4.3, siparisSayisi:19,
    toplamTutar:742000, odemeVadesi:'Aylık', durum:'Aktif', aktif:true },
  { kod:'TDR-005', unvan:'Ofis Dünyası Mobilya', kategori:'Ofis mobilyası', yetkili:'Hülya Tan', tel:'+90 312 000 00 62',
    eposta:'info@ofisdunyasi.com', vergiNo:'3304857692', adres:'Siteler, Ankara', puan:3.6, siparisSayisi:5,
    toplamTutar:96000, odemeVadesi:'60 gün', durum:'Aktif', aktif:true },
  { kod:'TDR-006', unvan:'Filo Kiralama A.Ş.', kategori:'Araç kiralama', yetkili:'Serkan Uçar', tel:'+90 312 000 00 63',
    eposta:'kurumsal@filokiralama.com', vergiNo:'4405968713', adres:'Balgat, Ankara', puan:4.1, siparisSayisi:2,
    toplamTutar:882000, odemeVadesi:'Aylık', durum:'Aktif', aktif:true }
];

/* ---- Satın alma talepleri (PROMPT.md §17) ------------------------------- */
DB.purchases = [
  { kod:'SAT-2026-014', talepEden:'EMP-010', dep:'DEP-12', proje:null, urun:'Geliştirici dizüstü bilgisayar',
    kategori:'Bilgisayar', aciklama:'Yeni geliştirici ve yedek cihaz ihtiyacı', ozellik:'M3 Pro · 18 GB · 512 GB',
    miktar:2, tahminiMaliyet:186000, ihtiyacTarihi:'2026-08-20', oncelik:'Yüksek',
    gerekce:'Mevcut cihazlar 3 yaşını doldurdu, derleme süreleri arttı', butceKodu:'BTC-DONANIM-2026',
    durum:'Onay bekliyor', olusturma:'2026-07-30', onayAdim:2, onayToplam:3, aktif:true },
  { kod:'SAT-2026-015', talepEden:'EMP-004', dep:'DEP-06', proje:null, urun:'Figma Organization lisans yenileme',
    kategori:'Yazılım lisansı', aciklama:'Yıllık lisans 31 Ağustos\'ta doluyor', ozellik:'8 düzenleyici koltuk',
    miktar:1, tahminiMaliyet:42000, ihtiyacTarihi:'2026-08-25', oncelik:'Yüksek',
    gerekce:'Tasarım ekibinin ana aracı', butceKodu:'BTC-YAZILIM-2026',
    durum:'Onay bekliyor', olusturma:'2026-08-01', onayAdim:1, onayToplam:2, aktif:true },
  { kod:'SAT-2026-016', talepEden:'EMP-006', dep:'DEP-07', proje:null, urun:'27 inç 4K monitör',
    kategori:'Monitör', aciklama:'Çift ekran çalışma ihtiyacı', ozellik:'27 inç · 4K · USB-C',
    miktar:1, tahminiMaliyet:21000, ihtiyacTarihi:'2026-08-22', oncelik:'Düşük',
    gerekce:'Verimlilik', butceKodu:'BTC-DONANIM-2026',
    durum:'Taslak', olusturma:'2026-07-29', onayAdim:0, onayToplam:2, aktif:true },
  { kod:'SAT-2026-013', talepEden:'EMP-011', dep:'DEP-17', proje:null, urun:'Ofis sarf malzemesi',
    kategori:'Diğer', aciklama:'Aylık kırtasiye ve temizlik', ozellik:'—',
    miktar:1, tahminiMaliyet:8400, ihtiyacTarihi:'2026-08-10', oncelik:'Düşük',
    gerekce:'Rutin ihtiyaç', butceKodu:'BTC-IDARI-2026',
    durum:'Sipariş verildi', olusturma:'2026-07-25', onayAdim:2, onayToplam:2, aktif:true },
  { kod:'SAT-2026-012', talepEden:'EMP-011', dep:'DEP-17', proje:null, urun:'Ergonomik ofis sandalyesi',
    kategori:'Ofis mobilyası', aciklama:'3 adet yenileme', ozellik:'Bel destekli, ayarlanabilir',
    miktar:3, tahminiMaliyet:28500, ihtiyacTarihi:'2026-08-05', oncelik:'Düşük',
    gerekce:'Mevcut sandalyeler yıprandı', butceKodu:'BTC-IDARI-2026',
    durum:'Teslim alındı', olusturma:'2026-07-14', onayAdim:2, onayToplam:2, aktif:true },
  { kod:'SAT-2026-011', talepEden:'EMP-010', dep:'DEP-12', proje:'PRJ-2026-002', urun:'OpenAI API kredi paketi',
    kategori:'Kurumsal abonelik', aciklama:'Anka Finans projesi için model kullanımı', ozellik:'—',
    miktar:1, tahminiMaliyet:64000, ihtiyacTarihi:'2026-07-20', oncelik:'Yüksek',
    gerekce:'Proje bağımlılığı', butceKodu:'BTC-PRJ-002',
    durum:'Teslim alındı', olusturma:'2026-07-10', onayAdim:2, onayToplam:2, aktif:true }
];

/* ---- Satın alma onay zincirleri ---------------------------------------- */
DB.purchaseApprovals = [
  { talep:'SAT-2026-014', sira:1, rol:'Departman Yöneticisi', kisi:'EMP-005', durum:'Onaylandı', tarih:'2026-07-30T14:20', not:'Gerekli' },
  { talep:'SAT-2026-014', sira:2, rol:'Muhasebe', kisi:'EMP-012', durum:'Bekliyor', tarih:null, not:null },
  { talep:'SAT-2026-014', sira:3, rol:'Şirket Sahibi', kisi:'EMP-001', durum:'Bekliyor', tarih:null, not:null },
  { talep:'SAT-2026-015', sira:1, rol:'Muhasebe', kisi:'EMP-012', durum:'Bekliyor', tarih:null, not:null },
  { talep:'SAT-2026-015', sira:2, rol:'Şirket Sahibi', kisi:'EMP-001', durum:'Bekliyor', tarih:null, not:null }
];

/* ---- Tedarikçi teklifleri ----------------------------------------------- */
DB.supplierQuotes = [
  { talep:'SAT-2026-014', tedarikci:'TDR-002', fiyat:186000, teslimSuresi:'5 iş günü', garanti:'3 yıl',
    odeme:'Peşin', teknikUygun:true, puan:4.8, tercih:true, gerekce:'En hızlı teslim, yetkili servis' },
  { talep:'SAT-2026-014', tedarikci:'TDR-001', fiyat:179000, teslimSuresi:'12 iş günü', garanti:'2 yıl',
    odeme:'30 gün', teknikUygun:true, puan:4.4, tercih:false, gerekce:'Daha ucuz ama teslim uzun' }
];

/* ---- Siparişler ---------------------------------------------------------- */
DB.orders = [
  { kod:'SIP-2026-009', talep:'SAT-2026-013', tedarikci:'TDR-005', tarih:'2026-07-26', teslimTarihi:'2026-08-08',
    tutar:8400, vergi:1680, toplam:10080, doviz:'TRY', durum:'Sipariş verildi', fatura:null, irsaliye:null,
    teslimKontrol:null, aktif:true },
  { kod:'SIP-2026-008', talep:'SAT-2026-012', tedarikci:'TDR-005', tarih:'2026-07-16', teslimTarihi:'2026-07-30',
    tutar:28500, vergi:5700, toplam:34200, doviz:'TRY', durum:'Teslim alındı', fatura:'FTR-TDR-1188',
    irsaliye:'IRS-4471', teslimKontrol:'Tam', aktif:true },
  { kod:'SIP-2026-007', talep:'SAT-2026-011', tedarikci:'TDR-004', tarih:'2026-07-12', teslimTarihi:'2026-07-12',
    tutar:64000, vergi:12800, toplam:76800, doviz:'TRY', durum:'Teslim alındı', fatura:'FTR-AWS-0712',
    irsaliye:'—', teslimKontrol:'Tam', aktif:true }
];

/* ---- Destek talepleri (PROMPT.md §18) ----------------------------------- */
DB.tickets = [
  { kod:'DST-2026-118', musteri:'MUS-2026-010', musteriAd:'Trakya Otomotiv Servis', proje:'PRJ-2026-006',
    baslik:'Randevu formunda tarih seçici mobilde açılmıyor', kategori:'Hata', oncelik:'Kritik', etki:'Yüksek',
    sla:'4 saat', sorumlu:'EMP-013', acan:'Yusuf Balaban', acilis:'2026-07-30T09:12',
    ilkYanit:'2026-07-30T09:48', mudahaleSuresi:36, cozumSuresi:null, durum:'Devam ediyor',
    harcananSure:3.5, ucretli:false, bakimPaketi:'Standart', kalanDestek:12, memnuniyet:null,
    slaDurum:'Risk altında', aktif:true },
  { kod:'DST-2026-119', musteri:'MUS-2024-002', musteriAd:'Vitalis Sağlık Grubu', proje:'PRJ-2026-001',
    baslik:'Test ortamında bildirimler gelmiyor', kategori:'Hata', oncelik:'Yüksek', etki:'Orta',
    sla:'8 saat', sorumlu:'EMP-013', acan:'Volkan Ateş', acilis:'2026-07-31T14:20',
    ilkYanit:'2026-07-31T15:05', mudahaleSuresi:45, cozumSuresi:null, durum:'Devam ediyor',
    harcananSure:2, ucretli:false, bakimPaketi:'Kurumsal', kalanDestek:38, memnuniyet:null,
    slaDurum:'Zamanında', aktif:true },
  { kod:'DST-2026-120', musteri:'MUS-2024-001', musteriAd:'Deniz Lojistik A.Ş.', proje:'PRJ-2025-008',
    baslik:'Sevkiyat raporuna araç filtresi eklenmesi', kategori:'Geliştirme talebi', oncelik:'Orta', etki:'Düşük',
    sla:'3 gün', sorumlu:'EMP-013', acan:'Sibel Yurtsever', acilis:'2026-07-29T11:00',
    ilkYanit:'2026-07-29T13:30', mudahaleSuresi:150, cozumSuresi:null, durum:'Müşteri bekleniyor',
    harcananSure:1, ucretli:true, bakimPaketi:'Kurumsal', kalanDestek:26, memnuniyet:null,
    slaDurum:'Zamanında', aktif:true },
  { kod:'DST-2026-121', musteri:'MUS-2026-009', musteriAd:'Öz Gıda Üretim A.Ş.', proje:'PRJ-2026-004',
    baslik:'Fire raporu Excel çıktısı nasıl alınır?', kategori:'Kullanım sorusu', oncelik:'Düşük', etki:'Düşük',
    sla:'2 gün', sorumlu:'EMP-013', acan:'Fadime Çetin', acilis:'2026-07-28T10:15',
    ilkYanit:'2026-07-28T10:40', mudahaleSuresi:25, cozumSuresi:65, durum:'Çözüldü',
    harcananSure:1, ucretli:false, bakimPaketi:'Standart', kalanDestek:18, memnuniyet:5,
    slaDurum:'Zamanında', aktif:true },
  { kod:'DST-2026-122', musteri:'MUS-2025-005', musteriAd:'Marmara Enerji Sistemleri', proje:'PRJ-2026-003',
    baslik:'İş emri listesinde tarih filtresi çalışmıyor', kategori:'Hata', oncelik:'Orta', etki:'Orta',
    sla:'8 saat', sorumlu:'EMP-013', acan:'Gülay Şen', acilis:'2026-07-18T09:00',
    ilkYanit:'2026-07-18T09:22', mudahaleSuresi:22, cozumSuresi:8640, durum:'Kapandı',
    harcananSure:6, ucretli:false, bakimPaketi:'Kurumsal', kalanDestek:44, memnuniyet:4,
    slaDurum:'Zamanında', aktif:true },
  { kod:'DST-2026-123', musteri:'MUS-2026-007', musteriAd:'Nova Turizm Yatırımları', proje:'PRJ-2026-005',
    baslik:'Demo ortamına erişim talebi', kategori:'Bilgi talebi', oncelik:'Düşük', etki:'Düşük',
    sla:'2 gün', sorumlu:'EMP-013', acan:'Barış Ekinci', acilis:'2026-08-01T16:40',
    ilkYanit:null, mudahaleSuresi:null, cozumSuresi:null, durum:'Açık',
    harcananSure:0, ucretli:false, bakimPaketi:'—', kalanDestek:0, memnuniyet:null,
    slaDurum:'Risk altında', aktif:true },
  { kod:'DST-2026-117', musteri:'MUS-2025-003', musteriAd:'Anadolu Perakende Ticaret Ltd.', proje:null,
    baslik:'Fatura kopyası talebi', kategori:'Bilgi talebi', oncelik:'Düşük', etki:'Düşük',
    sla:'2 gün', sorumlu:'EMP-012', acan:'Cengiz Solmaz', acilis:'2026-06-20T13:00',
    ilkYanit:'2026-06-20T14:10', mudahaleSuresi:70, cozumSuresi:130, durum:'Kapandı',
    harcananSure:0.5, ucretli:false, bakimPaketi:'—', kalanDestek:0, memnuniyet:3,
    slaDurum:'Zamanında', aktif:true }
];

DB.supportPackages = [
  { kod:'BKP-001', musteri:'MUS-2024-001', ad:'Kurumsal Bakım', baslangic:'2026-01-01', bitis:'2026-12-31',
    aylikSaat:8, kullanilan:34, kalan:62, tutar:180000, durum:'Aktif', aktif:true },
  { kod:'BKP-002', musteri:'MUS-2024-002', ad:'Kurumsal Bakım', baslangic:'2026-03-01', bitis:'2027-02-28',
    aylikSaat:6, kullanilan:34, kalan:38, tutar:144000, durum:'Aktif', aktif:true },
  { kod:'BKP-003', musteri:'MUS-2025-005', ad:'Kurumsal Bakım', baslangic:'2025-10-01', bitis:'2027-09-30',
    aylikSaat:10, kullanilan:196, kalan:44, tutar:420000, durum:'Aktif', aktif:true },
  { kod:'BKP-004', musteri:'MUS-2026-009', ad:'Standart Bakım', baslangic:'2026-07-24', bitis:'2027-01-23',
    aylikSaat:4, kullanilan:6, kalan:18, tutar:48000, durum:'Aktif', aktif:true },
  { kod:'BKP-005', musteri:'MUS-2026-010', ad:'Standart Bakım', baslangic:'2026-06-26', bitis:'2026-12-25',
    aylikSaat:4, kullanilan:12, kalan:12, tutar:42000, durum:'Aktif', aktif:true }
];
