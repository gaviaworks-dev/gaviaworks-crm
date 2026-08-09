# Cloud Şartnamesi — Madde Envanteri

Kaynak: `tasks/cloud-talimati.md` (GaviaWorks Cloud Tam Revizyon ve Uygulama Promptu, 9 Ağustos 2026).

Numaralama: `bölüm.altbölüm.madde`. Altbölümü olmayan bölümlerde altbölüm `0` yazılır.
Giriş ("Cloud/AI geliştiriciye ana görev") bölüm `0`, "Son talimat" bölüm `24` sayılmıştır.

Her madde satırı `- **[N.M.K]**` ile başlar; sayım:
`grep -c '^- \*\*\[' tasks/cloud-envanter.md`

---

## 0. Ana görev (giriş)

- **[0.0.1]** Mevcut kod tabanı, sayfa envanteri, veri modelleri, yönlendirmeler, roller/izinler, form bileşenleri, raporlar ve entegrasyon noktaları ÖNCE analiz edilir. Demo metni veya örnek sayı doğruluğu esas alınmaz.
- **[0.0.2]** Asıl hedef: eksik algoritmalar, kopuk modül ilişkileri, hatalı/eksik durum geçişleri, onay/ret/iptal/revizyon süreçleri, eksik müşteri–proje–görev bağları, eksik sayfa/fonksiyon ve entegrasyon altyapısı tamamlanır.
- **[0.0.3]** Uygulama ön yüz prototipi olarak değil; sunucu doğrulaması, kalıcı veri modeli, rol/satır/alan yetkisi, denetim izi, idempotent işlem ve otomatik testleri olan üretim sistemi olarak ele alınır.
- **[0.0.4]** Mevcut çalışan sayfalar gereksiz yere yeniden yazılmaz. Önce ortak altyapı kurulur, sonra modüller bu altyapıya geçirilir.

## 1. Ürün adı, kapsamı ve konumlandırma

- **[1.0.1]** Tam ad her yerde "GaviaWorks – Yazılım ve Yapay Zekâ Şirketleri İçin CRM, Proje ve Operasyon Yönetim Platformu" olarak kullanılır.
- **[1.0.2]** Kısa ürün adı "GaviaWorks".
- **[1.0.3]** Ürün kategorisi "CRM + proje/profesyonel hizmet yönetimi + şirket içi operasyon yönetimi".
- **[1.0.4]** Tedarikçi borçları, banka/kasa, genel muhasebe, vergi, bordro, e-belge ve finansal mutabakat tamamlanmadan ürün "tam ERP" olarak tanımlanmaz.
- **[1.0.5]** Ana uçtan uca süreç: Lead → Ön Analiz → Teklif → Müşteri → Sözleşme → Ödeme Planı → Proje → Milestone/Sprint/Görev/Kalite → Teslimat → Fatura/Tahsilat → Destek/Bakım.
- **[1.0.6]** Her geçiş kaynak kaydı, sürümü, müşteri bağı, sorumluyu, işlemi yapan kullanıcıyı ve tarihçeyi korur.
- **[1.0.7]** Aynı bilgi hedef modülde yeniden elle yazdırılmaz.

## 2. Değişmez uygulama ilkeleri

- **[2.0.1]** Tek yetkili kaynak: fatura durumu tahsilat tahsislerinden, proje maliyeti onaylı zaman/gider hareketlerinden, demirbaş durumu aktif zimmetten, onay adımı onay olaylarından türer. Türetilmiş değerler elle değiştirilemez.
- **[2.0.2]** Sunucu tarafı kural: arayüzde gizleme/devre dışı bırakma güvenlik sayılmaz; bütün iş kuralları API/servis katmanında yeniden doğrulanır.
- **[2.0.3]** Atomik dönüşüm: lead→müşteri, teklif→sözleşme, sözleşme→proje tek transaction; yarım kayıt oluşmaz.
- **[2.0.4]** İdempotency: aynı komut/olay/tıklama tekrarında ikinci kayıt oluşmaz. `idempotency_key`, `source_entity_type`, `source_entity_id` kullanılır.
- **[2.0.5]** Sürüm ve kilit: onaya gönderilen/imzalanan/kabul edilen/finansal sonuç doğuran sürüm değiştirilemez; değişiklik yeni revizyon oluşturur ve sürüm farkı gösterilir.
- **[2.0.6]** Gerekçe zorunluluğu: ret, iptal, geri çekme, revizyon talebi, yeniden açma, onay atlama ve yönetici istisnasında neden kodu + açıklama zorunlu.
- **[2.0.7]** Denetim izi: kim/ne zaman/hangi kayıt/önceki–yeni değer/cihaz-IP-istek kimliği append-only olay günlüğünde tutulur.
- **[2.0.8]** Rol ayrılığı: talep eden, onaylayan, ödemeyi oluşturan ve mutabakat yapan aynı kişi olmak zorunda değil; SoD politikası uygulanabilir.
- **[2.0.9]** Kaynak–hedef bağlantısı serbest metinle kurulmaz; yabancı anahtar, ilişki tipi ve kaynak sürümü saklanır.
- **[2.0.10]** Arşiv silme değildir: saklama/hukuki bekletme politikası, kontrollü geri yükleme ve raporlarda kapsam seçimi.
- **[2.0.11]** Ortak hesaplama hizmetleri: aynı KPI/maliyet/SLA/bakiye farklı sayfalarda ayrı formülle hesaplanmaz; UI, rapor ve export aynı domain servisini kullanır.
- **[2.0.12]** Demo bağımsızlığı: geliştirici notu, mock açıklaması veya demo veriye özel kural üretim arayüzünde görünmez.

## 3. Bağlayıcı yeni kayıt ve düzenleme sayfası standardı

- **[3.0.1]** Tüm create/edit sayfaları referans `crm-personel-form.html` görsel dilini ve yerleşim mantığını kullanır.
- **[3.0.2]** Yeni ve farklı bir form tasarım dili icat edilmez.
- **[3.0.3]** Mevcut `tokens.css`, `shell.css`, `ui.css`, Manrope, nötr yüzeyler, ince sınırlar, sınırlı vurgu rengi, ortak buton/kart/sekme/alan bileşenleri yeniden kullanılır.

### 3.1 Sayfa anatomisi

- **[3.1.1]** Mevcut uygulama kabuğu: sol rail, menü, üst arama, bildirim ve kullanıcı alanı.
- **[3.1.2]** Tıklanabilir breadcrumb: "Liste/Detay > Yeni Kayıt" veya "Detay > Düzenle".
- **[3.1.3]** `gv-page-head`: eyebrow, açık H1, sonucu anlatan tek satırlık alt açıklama.
- **[3.1.4]** `form-grid`: solda geniş ana form kartı, sağda bağlam/not/özet/doğrulama yan paneli.
- **[3.1.5]** Ana kart içinde bilgi yoğunluğuna göre yatay kaydırılabilir `gv-tabs`.
- **[3.1.6]** Her sekmede `fg-section`: ikon, bölüm başlığı, kısa açıklama, nötr ayırıcı.
- **[3.1.7]** Masaüstünde iki sütun, küçük ekranda tek sütun; uzun metin ve tablolar tam genişlik.
- **[3.1.8]** Seçime bağlı alanlar koşullu alt grupta açılır; gizlenen alanların geçersiz değerleri gönderilmez.
- **[3.1.9]** Çoğul veriler (eğitim, kalem, rol, milestone, zimmet) için tekrarlanabilir satır/blok ekle–kaldır deseni.
- **[3.1.10]** Dosya alanlarında sürükle-bırak/yükle bölgesi, dosya adı, türü, sürümü, durumu, görüntüle/değiştir/sil eylemleri.
- **[3.1.11]** Sistem tarafından türetilen alanlar salt okunur; neden değiştirilemediği kısa yardım metniyle açıklanır.
- **[3.1.12]** Zorunlu alan/format/iş kuralı hataları alan altında; gönderimde sekme bazlı hata özeti ve ilk hataya odaklanma.
- **[3.1.13]** Ana kart sonunda ortak `form-foot`: en az "Vazgeç" + bağlama uygun birincil eylem. Sihirbazlarda "Taslak Kaydet", "Önceki", "Sonraki", son adımda "Oluştur/Güncelle/Onaya Gönder".
- **[3.1.14]** Kaydedilmemiş değişiklikte sayfadan ayrılma uyarısı; aynı tıklamanın çift kayıt üretmesi engellenir.
- **[3.1.15]** Sağ panel kaynak kayıt, bağlantılı müşteri/sözleşme, zorunlu kontroller, oluşturulacak alt kayıtlar ve kısa kullanım notlarını CANLI özetler.
- **[3.1.16]** Kayıt sonrası toast tek başına yetmez: ana kaydın detayına gidilir ve otomatik üretilen alt kayıtların bağlantıları gösterilir.

### 3.2 Form davranışı ve erişilebilirlik

- **[3.2.1]** Sekmeler klavye ile gezilebilir; `role=tablist/tab/tabpanel`, `aria-selected`, görünür odak, doğru etiket ilişkileri.
- **[3.2.2]** Zorunluluk yalnız renkle anlatılmaz; hata/uyarı/başarılı/salt okunur durumlar metin veya ikonla da ayrışır.
- **[3.2.3]** Tarih, para, yüzde, telefon ve kimlik alanları yerel biçim gösterse bile API'ye kanonik veri gönderir.
- **[3.2.4]** Aranabilir seçim bileşenlerinde pasif kayıtlar varsayılan gelmez; mevcut bağ pasife alınmışsa geçmiş değer okunabilir kalır.
- **[3.2.5]** Rolü olmayan kullanıcı sekmenin HTML'ini veya hassas alan değerini API'den alamaz.
- **[3.2.6]** Taslak/otomatik kaydetme/geri yükleme varsa alan bazında son kaydetme durumu görünür.
- **[3.2.7]** Create ve edit modu ortak şema/bileşen kullanır; farklı kurallar açıkça ayrıştırılır.

### 3.3 Standardın uygulanacağı sayfalar

- **[3.3.1]** Şu create/edit ekranları aynı kabuğu kullanır: Personel, Proje, Lead, Ön Analiz, Teklif, Müşteri/Kişi, Sözleşme, Ödeme Planı, Milestone, Sprint, Görev, Departman Talebi, Test Planı/Test Senaryosu, Hata, Değişiklik Talebi, Teslimat, Destek Kaydı, Satın Alma Talebi, RFQ, Satın Alma Siparişi, Tedarikçi, Tedarikçi Faturası, Fatura, Tahsilat/Ödeme, Demirbaş, Zimmet, Araç, Lisans/Abonelik, Doküman, Toplantı, Otomasyon Kuralı, Entegrasyon Ayarı, Kişisel Not.

## 4. Personel ekleme sayfası revizyonu

- **[4.0.1]** Sekme "Kişisel": kimlik, profil fotoğrafı, temel bilgiler, eğitim, yalnız gerekli kişisel bilgiler.
- **[4.0.2]** Sekme "İletişim": kurumsal/kişisel iletişim, adres, acil durum kişisi. İletişim tercihleri ve KVKK/açık rıza kaydı AYRI ve SÜRÜMLÜ.
- **[4.0.3]** Sekme "Görev & Departman": personel no, şirket/şube, istihdam türü, pozisyon, departman, ekip, yönetici, çalışma takvimi, kapasite, başlangıç tarihi.
- **[4.0.4]** Sekme "SGK / Maaş": yalnız bordro/İK/yönetim kapsamı; ücret, para birimi, ödeme periyodu, SGK ve banka bilgileri şifreli, maskeli, alan bazlı yetkili.
- **[4.0.5]** Sekme "Evrak": belge türü, zorunluluk, sürüm, düzenlenme/son geçerlilik tarihi, onay durumu, dosya. Zorunlu kategoriler tamamlanmadan aktivasyon yapılmaz.
- **[4.0.6]** Sekme "Zimmet": mevcut uygun envanterden seçim; kesin zimmet yerine "teslim/onay bekleyen zimmet taslağı"; personelin teslim aldım onayı/e-imzası ile aktifleşir.
- **[4.0.7]** Sekme "İzin / Avans / Rapor": yeni kayıtta bilgi amaçlı boş durum; personel oluşmadan hareket yaratılmaz; kayıt sonrası ilgili modüllere bağlantı ve özet.
- **[4.0.8]** Sağ yan panel: "Kayıt Notları", tamamlanma yüzdesi, eksik zorunlu belgeler, çakışma/mükerrer uyarıları, oluşturulacak özlük dosyası–onboarding–hesap–kapasite kayıtları, rol görünürlüğü.

### 4.1 Personel veri ve algoritma kuralları

- **[4.1.1]** Personel numarası sunucuda benzersiz üretilir; istemciden gelene güvenilmez.
- **[4.1.2]** T.C./vergi kimlik, kurumsal e-posta, kişisel e-posta ve telefon normalize edilir ve mükerrer kontrolü yapılır; yetkili kullanıcı birleştirme/istisna akışına yönlendirilir.
- **[4.1.3]** Departman, ekip, görev/pozisyon ve proje üyeliği ayrı kavramlar olarak modellenir; tek alanla karıştırılmaz.
- **[4.1.4]** Personel durumu `Taslak → Onboarding → Aktif → İzinli/Pasif → Offboarding → Ayrıldı` yaşam döngüsünden türer; serbest açılır listeden son duruma atlanamaz.
- **[4.1.5]** Onboarding şablonu seçilince görevler, sorumlular, son tarihler, belge talepleri, hesap açma, eğitim ve ekipman hazırlığı otomatik oluşur.
- **[4.1.6]** Kullanıcı hesabı oluşturma isteğe bağlı ve ayrı yetkili eylem; davet, MFA ve ilk giriş durumu izlenebilir.
- **[4.1.7]** Yönetici, çalışma takvimi, haftalık kapasite ve izin bölgesi başlangıçta zorunlu; kapasite hesapları buradan beslenir.
- **[4.1.8]** Sağlık, kan grubu, acil durum, kimlik, banka ve maaş alanları hassas veri sınıfında; liste, arama, rapor ve export'ta varsayılan maskeli.
- **[4.1.9]** Özel alanlar merkezi özel alan tanımından gelir; alan tipi, zorunluluk, rol görünürlüğü ve sürüm korunur.
- **[4.1.10]** Kaydetme sonucu personel detayı, özlük dosyası, onboarding kontrol listesi, kapasite takvimi ve taslak zimmetler transaction içinde ilişkilendirilir.

### 4.2 Personel formu kabul testleri

- **[4.2.1]** Yetkisiz rol SGK/Maaş sekmesini ve değerlerini DOM, API, arama, rapor veya export üzerinden göremez.
- **[4.2.2]** Aynı personel için çift tıklama/tekrar istek tek kayıt üretir.
- **[4.2.3]** Zorunlu evrak eksikken personel taslak kaydolur ancak "Aktif" olamaz.
- **[4.2.4]** Pasif departman yeni kayıtta seçilemez; mevcut geçmiş kayıtta okunabilir kalır.
- **[4.2.5]** Personel kaydı başarısızsa özlük/onboarding/zimmet alt kayıtlarının hiçbiri yarım oluşmaz.
- **[4.2.6]** Aktif bir demirbaş ikinci personele atanamaz; taslak çakışması kullanıcıya açıkça gösterilir.

## 5. Proje ekleme sayfası revizyonu

- **[5.0.1]** Mevcut proje ekleme ekranı referans personel formundaki aynı kabuk ve form-grid düzeniyle yeniden oluşturulur.
- **[5.0.2]** Sekme "Kaynak & Proje Türü": sözleşmeli müşteri projesi, satış öncesi/P0, bakım/destek, iç proje, AR-GE; kaynak kayıt ve üretim kuralı açık.
- **[5.0.3]** Sekme "Müşteri & Sözleşme": müşteri, kabul edilmiş teklif, aktif/imzalı sözleşme, sözleşme sürümü; seçimler birbirine göre filtrelenir.
- **[5.0.4]** Sekme "Kapsam & Modüller": amaç, kapsam içi/dışı, teslimatlar, modüller, varsayımlar, bağımlılıklar, başarı kriterleri.
- **[5.0.5]** Sekme "Plan & Milestone": başlangıç/bitiş, proje takvimi, milestone'lar, bağımlılıklar, kabul koşulları, ödeme tetikleyicileri, sprint şablonu.
- **[5.0.6]** Sekme "Ekip & Roller": proje yöneticisi, teknik lider, ekip üyeleri, müşteri tarafı sorumluları, RACI/rol, planlanan kapasite.
- **[5.0.7]** Sekme "Bütçe & Maliyet": para birimi, sözleşme bütçesi, iç maliyet bütçesi, hedef marj, fiyatlandırma modeli, tarihsel saat maliyeti politikası, bütçe uyarıları.
- **[5.0.8]** Sekme "Dosyalar & İletişim": başlangıç belgeleri, klasör, kanal, toplantı ritmi, müşteri iletişim tercihleri, erişim kapsamı.
- **[5.0.9]** Sekme "Kontrol & Oluştur": kaynak uygunluğu, eksik zorunlu veri, ekip kapasitesi, tarih çakışması, bütçe, oluşturulacak alt kayıtlar, açık uyarı özeti.
- **[5.0.10]** Sağ panel: seçilen kaynak, müşteri/sözleşme, sözleşme toplamı, kabul edilen kapsam sürümü, şablon önizlemesi, kapasite uyarısı ve oluşturulacak milestone/sprint/görev/klasör/kanal kayıtları CANLI gösterilir.

### 5.1 Proje kaynak ve oluşturma kuralları

- **[5.1.1]** Sözleşmeli proje yalnız aynı müşteriye ait imzalı/aktif sözleşmeden oluşturulur; UI filtresi + sunucu doğrulaması zorunlu.
- **[5.1.2]** Satış öncesi çalışma müşteri projesi gibi faturalandırılmaz; `project_type=pre_sales` ve ayrı maliyet merkezi/limit.
- **[5.1.3]** İç proje, bakım ve AR-GE için sözleşme zorunluluğu uygulanmaz; sponsor, bütçe sahibi ve türe özel kurallar çalışır.
- **[5.1.4]** Kabul edilen teklif/sözleşme kapsamı proje baseline'ı olarak kopyalanır; kaynak sürümü kilitli referans olarak saklanır.
- **[5.1.5]** Proje şablonu rol yerleri, milestone, sprint yapısı, başlangıç görevleri, doküman klasörü, sohbet kanalı, toplantı ritmi ve rapor görünümü üretir.
- **[5.1.6]** Proje oluşturma bir transaction; kritik alt kayıt başarısızsa proje "yarım aktif" kalmaz — geri alınır veya "Kurulum Hatası" durumunda telafi kuyruğuna alınır.
- **[5.1.7]** Aynı sözleşme birden fazla projeye bölünüyorsa bütçe/kapsam paylaştırma zorunlu; toplam pay sözleşme limitini aşamaz.
- **[5.1.8]** Proje kodu sunucuda benzersiz üretilir; kaynağa dönüş bağlantısı sözleşme/teklif detayında da gösterilir.

### 5.2 Proje yaşam döngüsü

- **[5.2.1]** Yaşam döngüsü: `Plan → Başlatma Onayı → Aktif → Beklemede → Test/Kabul → Teslim → Kapanış → Tamamlandı`.
- **[5.2.2]** Yan terminaller: `İptal Edildi`, kurallı biçimde `Arşivlendi`.
- **[5.2.3]** "Aktif" için proje yöneticisi, baseline, başlangıç/bitiş, asgari ekip, müşteri/sponsor ve finansal kaynak doğrulanır.
- **[5.2.4]** "Beklemede" için neden, sorumlu, planlanan dönüş tarihi ve SLA/takvim etkisi kaydedilir.
- **[5.2.5]** "Teslim" için açık kritik hata, başarısız zorunlu test veya onaysız değişiklik bulunmaz; istisna yönetici gerekçesiyle kayıt altına alınır.
- **[5.2.6]** Kapanış kontrol listesi: açık kritik görev/hata yok, son teslim kabul edilmiş, zaman çizelgeleri onaylı, finansal mutabakat yapılmış, dokümanlar arşivlenmiş, destek/bakım devri tamamlanmış.
- **[5.2.7]** Tamamlanmamış proje arşivlenemez; iptalde açık görev, rezervasyon, bütçe ve faturalama etkisi kontrollü kapatılır.

## 6. Ortak iş akışı ve onay altyapısı

### 6.1 Merkezî durum geçiş motoru

- **[6.1.1]** Her modül kendi içinde serbest `status` güncellemesi YAPMAZ; ortak transition service kullanılır.
- **[6.1.2]** Transition sözleşmesi: kaynak durum ve hedef durum.
- **[6.1.3]** Transition sözleşmesi: eylemi gerçekleştirebilecek roller/izinler.
- **[6.1.4]** Transition sözleşmesi: zorunlu önkoşullar ve engelleyici kontroller.
- **[6.1.5]** Transition sözleşmesi: zorunlu gerekçe, neden kodu, yorum, ek ve e-imza.
- **[6.1.6]** Transition sözleşmesi: oluşacak domain olayları ve bağlı kayıtlar.
- **[6.1.7]** Transition sözleşmesi: SLA/takvim/bütçe/finans etkisi.
- **[6.1.8]** Transition sözleşmesi: bildirim alıcıları.
- **[6.1.9]** Transition sözleşmesi: geri alınabilirlik ve terminal durum bilgisi.
- **[6.1.10]** Geçişler yalnız `POST /entities/{id}/transitions` benzeri komut uç noktalarından yapılır; genel update endpoint'i durum alanını değiştiremez.
- **[6.1.11]** Geçiş sonucu `transition_event` oluşur; aynı istek kimliğiyle tekrarda ikinci kez yan etki üretmez.

### 6.2 Ortak eylem penceresi

- **[6.2.1]** Onayla, Reddet, İade Et, Revizyon İste, İptal Et, Geri Çek, Devret ve Yeniden Aç eylemleri için TÜM modüllerde ortak modal/drawer kullanılır.
- **[6.2.2]** Pencere içeriği: hedef eylem ve sonucu.
- **[6.2.3]** Pencere içeriği: zorunlu neden kodu ve açıklama.
- **[6.2.4]** Pencere içeriği: ek dosya/kanıt.
- **[6.2.5]** Pencere içeriği: sonraki onaycı veya delege.
- **[6.2.6]** Pencere içeriği: etkilenecek bağlı kayıtların özeti.
- **[6.2.7]** Pencere içeriği: geri döndürülemeyen sonuç uyarısı.
- **[6.2.8]** Pencere içeriği: onay sonrası tekil success state ve audit bağlantısı.

### 6.3 Sürümlenmiş onay motoru

- **[6.3.1]** Onay tanımı `Taslak → Yayında → Kullanımdan Kaldırıldı` olarak sürümlenir.
- **[6.3.2]** Süreç başlatıldığında o sürüm örneğe sabitlenir; şablon sonradan değişse bile çalışan zincir değişmez.
- **[6.3.3]** Motor: sıralı, paralel, çoğunluk, tümü ve tutar/risk/şirket/ürün türüne bağlı koşullu adımlar.
- **[6.3.4]** Motor: kullanıcı, rol, yönetici hiyerarşisi, proje rolü, departman ve dinamik alan tabanlı onaycı.
- **[6.3.5]** Motor: vekâlet, süre aşımı, hatırlatma ve eskalasyon.
- **[6.3.6]** Motor: kendi kendini onaylama ve aynı kişinin yinelenmesi politikası.
- **[6.3.7]** Motor: görevler ayrılığı ve çıkar çatışması kontrolü.
- **[6.3.8]** Motor: ret, iade, revizyon, iptal, geri çekme, yeniden gönderme ve sürüm farkı.
- **[6.3.9]** Motor: merkezi "Onay Kutum" ekranı ve modül detayından aynı olay geçmişi.
- **[6.3.10]** "Bekleyen onay sayısı" ve "mevcut adım" elle güncellenen sayaç olamaz; onay olaylarından türer.

### 6.4 Yetki ve denetim

- **[6.4.1]** Rol bazlı yetkinin yanında tenant/şirket/şube/departman/proje/müşteri/satır ve ALAN kapsamı uygulanır.
- **[6.4.2]** Liste, detay, arama, rapor, export, sohbet, bildirim ve entegrasyon aynı politika servisini kullanır.
- **[6.4.3]** İzin değişiklikleri audit edilir ve rol regresyon testleri bulunur.

## 7. Satış ve CRM süreçleri

### 7.1 Lead ve müşteriye dönüşüm

- **[7.1.1]** Lead detayındaki "Teklif Oluştur" eylemi liste sayfasına değil, lead bağlamıyla ÖN DOLDURULMUŞ teklif formuna gider.
- **[7.1.2]** Müşteriye dönüştürme sihirbazı lead'in `Qualified/Won` durumunda olmasını ister; yönetici istisnası gerekçeyle uygulanır.
- **[7.1.3]** Dönüşümden önce vergi no, unvan, e-posta, telefon ve alan adına göre mükerrer müşteri/kişi aranır; "mevcut müşteriye bağla", "birleştir" veya yetkili istisna sunulur.
- **[7.1.4]** Müşteri/kişi oluşturma-bağlama iletişim geçmişi, yönlendiren, kaynak, kampanya, sorumlu, notlar ve dosyaları korur.
- **[7.1.5]** İstenirse sözleşme taslağı, ödeme planı taslağı ve proje taslağı aynı sihirbazdan üretilir.
- **[7.1.6]** Dönüşüm atomik ve idempotent; lead üzerinde hedef müşteri/kişi/proje bağlantıları görünür.

### 7.2 Ön analiz

- **[7.2.1]** Durumlar: `Taslak → Hazırlanıyor → Teknik İnceleme → Onay Bekliyor → Onaylandı`.
- **[7.2.2]** Yan sonuçlar: `İade/Revizyon`, `Reddedildi`, `İptal Edildi`.
- **[7.2.3]** Teklif yalnız onaylı ön analizden veya yönetici gerekçeli istisnasıyla oluşturulur.
- **[7.2.4]** Ön analiz serbest metin değil: hizmet/modül kalemleri, roller, efor, birim maliyet, bağımlılık, risk, varsayım, kapsam dışı ve kabul kriterleri YAPILANDIRILMIŞ saklanır.
- **[7.2.5]** Her revizyon yeni sürüm oluşturur; teklif hangi ön analiz sürümünden doğduğunu saklar.

### 7.3 Teklif

- **[7.3.1]** Durumlar: `Taslak → İç Onay → Onaylandı → Gönderildi → Müşteri İncelemesi → Müzakere/Revizyon → Kazanıldı`.
- **[7.3.2]** Yan terminaller: `Kaybedildi`, `İptal Edildi`, `Süresi Doldu`.
- **[7.3.3]** Eylemler: onaya gönder, onayla, reddet, iade et, iptal et, geri çek, müşteriye gönder, müşteri kabul/ret, revizyon oluştur.
- **[7.3.4]** Yeni revizyon eski sürümü kilitler; fiyat, kapsam, süre ve koşul farkları karşılaştırılabilir.
- **[7.3.5]** Kabul edilen tek sürüm olur; geçerlilik tarihi dolan teklif otomatik "Süresi Doldu" adayına alınır ve kullanıcı bilgilendirilir.
- **[7.3.6]** "Kazanıldı" eylemi müşteri, sözleşme taslağı, ödeme planı taslağı ve proje taslağı oluşturma/bağlama sihirbazını açar.
- **[7.3.7]** "Kaybedildi" için yapılandırılmış neden, rakip, fiyat/kapsam geri bildirimi zorunlu; lead/fırsat ve açık takip işleri politikayla kapanır.

### 7.4 Müşteri ve kişi yönetimi

- **[7.4.1]** Kişi formunda yalnız aktif müşteriler varsayılan gelir; pasif müşteri için yetkili istisna gerekir.
- **[7.4.2]** Müşteri birleştirme aracı ilişkileri, finansal kayıtları, proje geçmişini ve audit izini kaybetmeden ana kayda taşır.
- **[7.4.3]** Müşteri detayında birleşik aktivite zaman çizelgesi: teklifler, sözleşmeler, projeler, toplantılar, destek, faturalar, ödemeler, belgeler.
- **[7.4.4]** Müşteri sağlık skoru yapılandırılmış kurallardan üretilir; geciken ödeme, açık kritik destek, proje sapması, yenileme ve memnuniyet sinyallerini açıklar.
- **[7.4.5]** İletişim kanalı tercihi, izin/ret ve açık rıza sürümü tutulur.
- **[7.4.6]** Müşteri portalı: teklif/sözleşme/teslimat onayı, destek kaydı, doküman ve fatura görüntüleme kapsamlarıyla eklenir.
- **[7.4.7]** Toplantı/iletişim kaydında ilgili varlık alanları bağlama göre filtrelenir; çelişen entity seçimleri aynı anda yapılamaz.

## 8. Sözleşme, ödeme planı ve proje yürütme

### 8.1 Sözleşme

- **[8.1.1]** Sözleşme formu yalnız aynı müşteriye ait kabul edilmiş/kazanılmış teklifleri seçebilir.
- **[8.1.2]** Durumlar: `Taslak → İç İnceleme → Müşteri İncelemesi → İmza → Aktif → Askıda → Yenileme/Zeyil → Tamamlandı`.
- **[8.1.3]** Yan terminaller: `Feshedildi`, `İptal Edildi`.
- **[8.1.4]** İmzalı belgenin hash'i, imzalayanlar, zaman, yöntem ve sağlayıcı kimliği saklanır; imzalı kopya değiştirilemez.
- **[8.1.5]** Kapsam, fiyat, tarih veya ödeme planı değişikliği eski belgeyi güncellemez; zeyil/revizyon oluşturur.
- **[8.1.6]** Aktivasyon için imza ve ödeme planı doğrulanır; sonrasında proje/hizmet/destek devir kayıtları oluşturulabilir.
- **[8.1.7]** Farklı müşteriye ait teklif veya ödeme planı bağlantısı hem UI hem API tarafında engellenir.

### 8.2 Ödeme planı

- **[8.2.1]** Ödeme planı için liste, yeni, düzenle, detay, revizyon ve onay ekranları eklenir.
- **[8.2.2]** Plan içeriği: sözleşme toplamı, yüzde/tutar, para birimi, vade, milestone/teslim tetikleyicisi, faturalama politikası, vergi, tolerans.
- **[8.2.3]** Toplamlar sözleşme tutarıyla uyuşmadan plan aktifleşmez.
- **[8.2.4]** Tarih veya tutar değişikliği zeyil/onay gerektirir.
- **[8.2.5]** Oluşan faturalar plan kalemine geri bağlanır; aynı kalemden yinelenen fatura engellenir.

### 8.3 Milestone ve sprint

- **[8.3.1]** Milestone ve Sprint için ayrı liste, yeni, düzenle ve detay ekranları eklenir.
- **[8.3.2]** Milestone alanları: sahip, planlanan/gerçek tarih, bağımlılıklar, teslimatlar, kabul kriterleri, müşteri kabulü, ödeme tetikleyicisi, risk, bağlı görevler.
- **[8.3.3]** Sprint alanları: hedef, süre, ekip kapasitesi, backlog, committed işler, carry-over, demo, retrospektif, velocity, release bağı.
- **[8.3.4]** Sprint kapanışında tamamlanmamış işler açık seçimle havuza/sonraki sprinte taşınır; geçmiş sprint değiştirilmez.

### 8.4 Görev ve departman talebi

- **[8.4.1]** Kanonik görev akışı: `Havuz → Atandı → Kabul Edildi → Devam Ediyor → Kontrol → Onay → Tamamlandı`.
- **[8.4.2]** Ara durumlar: `Beklemede`, `Blokeli`, `Müşteri Bekleniyor`.
- **[8.4.3]** Revizyon görevi yeni sürüm/yorumla "Devam Ediyor"a döndürür; `İptal Edildi` terminaldir.
- **[8.4.4]** Atanan kişi işi kabul/ret edebilir; ret nedeni zorunlu ve atayana dönüktür.
- **[8.4.5]** Aynı anda tek aktif sorumlu kuralı veya açık çoklu sorumluluk modeli seçilir; "önerilen" ve "gerçek" sorumlu ayrıştırılır.
- **[8.4.6]** Bağımlılık tamamlanmadan görev başlayamıyorsa geçiş engellenir; döngüsel bağımlılık reddedilir.
- **[8.4.7]** Checklist, süre tahmini, gerçekleşen süre, etiket, öncelik, SLA ve müşteri/proje/milestone/sprint/test/bug/değişiklik bağları tutulur.
- **[8.4.8]** Blokeli/müşteri bekleniyor durumunda takvim/SLA duraklatma politikası uygulanır; sebep ve aralık saklanır.
- **[8.4.9]** Departman talebi akışı: `Taslak → Gönderildi → İnceleme → Ek Bilgi/Revizyon → Kabul/Reddedildi/İptal → Göreve Dönüştürüldü`.
- **[8.4.10]** Kabul edilen talep otomatik ve idempotent görev oluşturur, alanları taşır, karşılıklı bağlantı kurar.
- **[8.4.11]** Talep ile görev durumu iki ayrı elle güncellenen gerçeklik olamaz; görev sonucu talep özetini OLAYLA günceller.

## 9. Kalite, değişiklik, teslimat ve destek

### 9.1 Test yönetimi

- **[9.1.1]** Test Planı, Test Senaryosu, Test Adımı, Test Çalıştırması, Sonuç, Kanıt, Hata, Yeniden Test, Sürüm/Build ve Ortam varlıkları eklenir.
- **[9.1.2]** Test senaryosu ön koşul, adımlar, beklenen sonuç, veri seti, önem ve otomasyon durumunu içerir.
- **[9.1.3]** Sonuç değerleri `Passed/Failed/Blocked/Not Run`.
- **[9.1.4]** Failed sonuçtan hata oluşturulduğunda kaynak test, build, ortam ve kanıt otomatik bağlanır.

### 9.2 Hata yönetimi

- **[9.2.1]** Durumlar: `Yeni → Triage → Atandı → Devam Ediyor → Düzeltildi → Yeniden Test → Kapandı`.
- **[9.2.2]** Yan sonuçlar: `Yeniden Açıldı`, `Reddedildi`, `Mükerrer`.
- **[9.2.3]** Yapılandırılmış yeniden üretme adımları, beklenen/gerçek sonuç, ortam, build, cihaz/tarayıcı, önem, öncelik, kök neden, düzeltme sürümü ve kanıt zorunlulukları olur.
- **[9.2.4]** Hata test, destek, görev, sprint, release ve deployment ile bağlanabilir.

### 9.3 Değişiklik talebi

- **[9.3.1]** Eksik create/edit/detail sayfaları eklenir.
- **[9.3.2]** Akış: `Taslak → Etki Analizi → İç Onay → Müşteri Onayı → Ticari Onay → Onaylandı → Uygulama → Teslim → Kapandı`.
- **[9.3.3]** Yan sonuçlar: `Reddedildi`, `İptal Edildi`.
- **[9.3.4]** Etki analizi kapsam, efor, maliyet, takvim, risk, test, sözleşme ve bakım etkisini içerir.
- **[9.3.5]** Kapsam dışı değişiklik kabul edilirse teklif/zeyil ve ödeme planı revizyonu oluşturulur.
- **[9.3.6]** Gerekli onaylar tamamlanmadan uygulama görevleri "başlatılamaz" olur.
- **[9.3.7]** Onay sonrası proje baseline, bütçe ve tarihçe yeni sürümle güncellenir; eski değerler korunur.

### 9.4 Teslimat ve müşteri kabulü

- **[9.4.1]** Eksik teslimat create/edit/detail ve kabul ekranları eklenir.
- **[9.4.2]** Akış: `Taslak → İç Kontrol → Müşteriye Gönderildi → Kabul/Kısmi Kabul/Ret → Revizyon → Kapandı`.
- **[9.4.3]** Yan eylem: `Geri Çekildi`.
- **[9.4.4]** Teslim kalemleri ayrı ayrı kabul/ret edilebilir.
- **[9.4.5]** Kabul eden kişi, tarih, yorum, imza/e-posta/portal kanıtı ve kabul edilen sürüm saklanır.
- **[9.4.6]** Kısmi kabul, yalnız kabul edilen kalemler için politika izin veriyorsa milestone/fatura tetikler.
- **[9.4.7]** Ret/revizyon görev ve hata oluşturabilir.

### 9.5 Destek ve bakım

- **[9.5.1]** Destek akışı: `Yeni → Triage → Atandı/Devam Ediyor → Çözüldü → Müşteri Onayı → Kapandı`.
- **[9.5.2]** Bekleme durumları `Müşteri Bekleniyor`, `Üçüncü Taraf Bekleniyor`; kapanan kayıt yetkili ve gerekçeli yeniden açılabilir.
- **[9.5.3]** SLA mesai takvimi, resmi tatil, saat dilimi, 7/24 veya iş saati, öncelik, yanıt/çözüm hedefi, bekleme aralıkları ve yeniden açmayı hesaba katar.
- **[9.5.4]** "Müşteri bekleniyor" yalnız politika izin veriyorsa SLA'yı durdurur; başlangıç/bitiş aralığı saklanır.
- **[9.5.5]** Bakım hakkı yalnız onaylı/faturalandırılabilir kullanımdan düşer; kategori, paket kapsamı, aşım onayı, negatif bakiye politikası ve yenileme tarihi tanımlanır.
- **[9.5.6]** Makale/SSS bilgi bankası, hazır yanıtlar, müşteri portalı, e-posta yanıt zinciri, ekler, CSAT ve eskalasyon eklenir.
- **[9.5.7]** Incident, problem ve change kavramları ayrıştırılır; büyük olayda etkilenen müşteriler ve postmortem tutulur.

## 10. Satın alma, tedarikçi, fatura ve tahsilat

### 10.1 Satın alma talebi ve onay

- **[10.1.1]** Form kaydı varsayılan `Taslak` oluşturur; ayrıca "Onaya Gönder" eylemi bulunur.
- **[10.1.2]** Talep taslakta düzenlenebilir, gönderildikten sonra kilitli; geri çekme veya revizyonla yeni sürüme döner.
- **[10.1.3]** Akış: `Taslak → Onaya Gönderildi → İnceleme → Onaylandı → RFQ/Satın Alma → Sipariş → Kısmi/Tam Teslim → Kapandı`.
- **[10.1.4]** Yan sonuçlar: `İade`, `Reddedildi`, `İptal Edildi`.
- **[10.1.5]** Tutar, kategori, proje, aciliyet ve bütçeye göre onay zinciri seçilir.
- **[10.1.6]** Aynı onaycı yinelenmez; kendi kendini onaylama/SoD politikası çalışır.
- **[10.1.7]** Ret/iade/iptal nedeni ve yeniden gönderimde sürüm farkı zorunludur.

### 10.2 RFQ ve tedarikçi değerlendirmesi

- **[10.2.1]** RFQ → Tedarikçi Teklifleri → Teknik Değerlendirme → Ticari Değerlendirme → Seçim → Onay → Satın Alma Siparişi zinciri kurulur.
- **[10.2.2]** Para birimi, vergi, navlun, ödeme/teslim koşulu ve geçerlilik normalize edilerek karşılaştırılır.
- **[10.2.3]** Seçilmeyen en düşük fiyat için gerekçe istenebilir.
- **[10.2.4]** Tedarikçi onboarding: şirket/vergi/KYB, banka, belgeler, risk, kara liste, sözleşme, kategori, performans, değerlendirme ve portal daveti.
- **[10.2.5]** Banka bilgisi değişikliği çift kontrol ve audit gerektirir.

### 10.3 Sipariş, kabul ve üçlü eşleştirme

- **[10.3.1]** Satın alma siparişi yalnız onaylı talep ve seçilmiş tedarikçi teklifinden doğar.
- **[10.3.2]** Kısmi teslim, backorder, ret, iade ve mal/hizmet kabulü SATIR bazında tutulur.
- **[10.3.3]** Tedarikçi faturası `PO – Kabul – Fatura` üçlü eşleştirmesinden geçmeden ödeme onayına gidemez; toleranslar politikayla tanımlanır.
- **[10.3.4]** Teslim kategorisi "Ekipman/demirbaş" → demirbaş taslağı, seri no ve kabul bilgisi üretir.
- **[10.3.5]** Teslim kategorisi "Araç" → filo kaydı ve belge/servis planı üretir.
- **[10.3.6]** Teslim kategorisi "Yazılım lisansı/abonelik" → lisans/abonelik kaydı, kullanıcı/koltuk ve yenileme üretir.
- **[10.3.7]** Teslim kategorisi "Sarf malzemesi" → stok hareketi üretir.
- **[10.3.8]** Teslim kategorisi "Hizmet" → hizmet kabulü ve proje/gider dağıtımı üretir.

### 10.4 Fatura ve tahsilat

- **[10.4.1]** Fatura seri/sıra, e-belge UUID, müşteri, sözleşme, proje, ödeme planı, kalemler, vergi, para birimi, kur, sorumlu ve açıklama içerir.
- **[10.4.2]** Durumlar: `Taslak → Onaylandı → Gönderildi/e-Fatura Gönderildi → Kabul/Ret → Kısmi Ödendi → Ödendi`.
- **[10.4.3]** Süreçsel durum `Vadesi Geçti`; yan işlemler `İptal`, `İade`, `Alacak/Borç Dekontu`.
- **[10.4.4]** Tahsilat/ödeme formu yöntem, banka/kasa hesabı, dekont, işlem tarihi, valör, para birimi/kur, müşteri/tedarikçi, çoklu fatura tahsisi, fazla/eksik ödeme, iade ve chargeback içerir.
- **[10.4.5]** Başarılı ödeme hareketi kanonik kaynaktır; faturanın ödenme durumu tahsis toplamından türer.
- **[10.4.6]** Kullanıcı faturayı ayrıca "ödendi" diye işaretleyemez.
- **[10.4.7]** Bankadan gelen aynı hareket referansı ikinci kez işlenmez; mutabakat durumu, eşleştiren kişi ve tarih saklanır.

### 10.5 Proje maliyeti ve ERP sınırı

- **[10.5.1]** Proje maliyeti tek hizmetten hesaplanır: onaylı zaman × ilgili tarihte geçerli maliyet oranı + projeye dağıtılmış satın alma/gider/tedarikçi hizmeti + isteğe bağlı amortisman/altyapı payı.
- **[10.5.2]** Bugünkü personel maliyeti geçmiş zamanlara uygulanmaz; oran anlık görüntüsü veya geçerlilik aralığı kullanılır.
- **[10.5.3]** Dashboard, proje detayı, rapor ve export aynı hesaplama hizmetini çağırır.
- **[10.5.4]** Tam ERP hedefleniyorsa tedarikçi faturaları/borç hesapları, masraf defteri, banka/kasa, kur değerleme, e-Fatura/e-Arşiv, muhasebe fişi, vergi ve mutabakat eklenir.
- **[10.5.5]** Bunlar yoksa pazarlama metinlerinde tam ERP iddiası kullanılmaz.

## 11. İnsan kaynakları, zaman, kapasite ve varlıklar

### 11.1 İzin

- **[11.1.1]** İzin talep eden kullanıcı onaycı, son durum veya ret alanını seçemez.
- **[11.1.2]** Onaycı organizasyon ve izin politikasından türetilir.
- **[11.1.3]** İş günü, resmi tatil, yarım gün, saatlik izin, bakiye rezervasyonu, onayda düşüm, ret/iptalde iade, çakışma, ekip kapasitesi, vekil ve iptal sonrası geri yükleme doğru hesaplanır.
- **[11.1.4]** Negatif bakiye yalnız izinli politika ve ek onayla mümkündür.

### 11.2 Zaman çizelgesi ve kapasite

- **[11.2.1]** Zaman çizelgesi SATIR bazında onay/ret/iade edilebilir.
- **[11.2.2]** Onaylı dönem kilitlenir; yeniden açma yetkili ve auditlidir.
- **[11.2.3]** Fazla mesai, faturalandırılabilirlik, proje/görev, açıklama, oran snapshot'ı ve müşteri onayı politikası bulunur.
- **[11.2.4]** Kapasite çalışma takvimi, tatil, izin, haftalık kapasite, proje tahsisi, destek nöbeti, yetkinlik ve tarih aralığından hesaplanır.
- **[11.2.5]** Personel, proje ve portföy görünümü aynı kapasite hizmetini kullanır.

### 11.3 Onboarding / offboarding

- **[11.3.1]** Şablon tabanlı checklist, bağımlılık, sorumlu, SLA, hesap/kimlik sağlama, eğitim, belge, ekipman ve erişim adımları kurulur.
- **[11.3.2]** Offboarding hesap kapatma, erişim iptali, zimmet iadesi, belge/iş devri, müşteri/proje sorumluluğu transferi ve son kontrol olmadan tamamlanmaz.

### 11.4 Demirbaş, lisans ve filo

- **[11.4.1]** Bir demirbaş için aynı anda en fazla bir aktif zimmet; veritabanı kısıtı ve transaction kilidi kullanılır.
- **[11.4.2]** Teslim alan kabul/ret veya e-imza yapabilir; iadede durum muayenesi, hasar/kayıp, fotoğraf, bakım, transfer ve hurda süreçleri bulunur.
- **[11.4.3]** Yazılım lisansı/abonelik sağlayıcı, ürün, koltuk, kullanıcı, anahtar/secret referansı, başlangıç, yenileme, maliyet, proje/gider dağıtımı ve iptal bildirim süresini içerir.
- **[11.4.4]** Filo detayında bakım, muayene, sigorta, yakıt, gider, ceza, belge, sürücü ataması, kaza ve kilometre alt sayfaları bulunur.

## 12. Doküman, toplantı, sohbet ve otomasyon

### 12.1 Doküman yönetimi

- **[12.1.1]** Dokümanlar `entity_type + entity_id + document_type` ile ilişkilendirilir.
- **[12.1.2]** Sürüm, onay, imza, sınıflandırma, saklama süresi, son geçerlilik, hukuki bekletme, virüs tarama, OCR/metin arama ve arşiv metadata'sı bulunur.
- **[12.1.3]** İmzalı veya kabul edilmiş sürüm değiştirilemez; yeni sürüm oluşturulur.
- **[12.1.4]** Dosya erişimi bağlı kaydın alan/satır yetkisini aşamaz.

### 12.2 Toplantı ve kararlar

- **[12.2.1]** Davet/RSVP, dış katılımcı, yinelenme, gündem, not/tutanak onayı, karar, karar sahibi ve son tarih eklenir.
- **[12.2.2]** Karar veya aksiyon görev oluşturabilir; görev tamamlanınca toplantı aksiyonu OLAYLA güncellenir.
- **[12.2.3]** Yinelenen toplantılar seri + örnek modeliyle çalışır; saat dilimi ve çakışma kontrolü olur.

### 12.3 Sohbet

- **[12.3.1]** Mesajdan görev/hata oluşturulduğunda kaynak mesaj bağlantısı saklanır.
- **[12.3.2]** Kanal üyeliği proje/müşteri/ekip kapsamına göre yönetilir.
- **[12.3.3]** Dosya erişimi, mention, bildirim, kanal arşivi, saklama/eDiscovery ve silinen mesaj audit politikası eklenir.

### 12.4 Otomasyon

- **[12.4.1]** Otomasyon modülüne "Yeni Kural", detay, düzenle, taslak/yayında sürümü, koşul oluşturucu, eylem sırası, test/simülasyon, çalıştırma geçmişi, hata, retry ve dead-letter kuyruğu eklenir.
- **[12.4.2]** Kural idempotent olur; aynı olayın ikinci kez yan etki üretmesi engellenir.
- **[12.4.3]** Otomasyon bir kullanıcının yetkisini aşmaz; sistem hesabı yetkileri açıkça tanımlanır.

## 13. Entegrasyon mimarisi

- **[13.0.1]** Entegrasyon liste kartları tek başına yeterli değildir; her entegrasyon için detay/ayar sayfası oluşturulur.
- **[13.0.2]** OAuth veya credential vault; secret değerleri istemciye/loga dönmez.
- **[13.0.3]** Alan/kimlik eşleme ve kaynak gerçekliği seçimi.
- **[13.0.4]** İlk senkronizasyon, artımlı senkronizasyon, zamanlama ve manuel çalıştırma.
- **[13.0.5]** Sync job/run log, satır bazlı sonuç ve özet metrikler.
- **[13.0.6]** Hata kuyruğu, sınıflandırma, retry, replay, dead-letter ve kullanıcıya çözüm önerisi.
- **[13.0.7]** Webhook imza doğrulama, tekrar saldırısı/zaman damgası ve idempotency.
- **[13.0.8]** API anahtarı, scope, rate limit, sona erme, rotasyon ve audit.
- **[13.0.9]** Sağlık, son başarı, son hata, gecikme ve devre kesici durumu.
- **[13.0.10]** GitHub/GitLab entegrasyonunda repository, branch, commit, pull/merge request, issue, pipeline, deployment ve release proje–görev–hata–sürümle bağlanabilir.
- **[13.0.11]** Muhasebe entegrasyonunda her alan için kaynak sistem, çift/tek yön kuralı, idempotent belge kimliği ve mutabakat tanımlanır.
- **[13.0.12]** Takvim entegrasyonunda saat dilimi, yinelenme, iptal ve çakışma desteklenir.
- **[13.0.13]** P0 olarak Entegrasyon Hata Kuyruğu sayfası eklenir: hata, etkilenen kayıt, deneme sayısı, son mesaj, güvenli payload özeti, önerilen çözüm ve tekrar çalıştırma sonucu.

## 14. Tek tip raporlama sayfası standardı

- **[14.0.1]** Tüm mevcut ve yeni raporlar tek `ReportLayout`/`ReportShell` bileşeni ve rapor kayıt şeması üzerinden çalışır.
- **[14.0.2]** Her rapor için ayrı hizalama, filtre, buton veya export yaklaşımı geliştirilmez.
- **[14.0.3]** Raporun alan/metrikleri değişebilir; sayfa anatomisi, etkileşim, biçimlendirme ve çıktı standardı aynı kalır.

### 14.1 Rapor sayfası anatomisi

- **[14.1.1]** Breadcrumb.
- **[14.1.2]** Eyebrow: "Raporlama".
- **[14.1.3]** Açık rapor başlığı ve tek cümlelik kullanım amacı.
- **[14.1.4]** Veri güncellik zamanı, veri kapsamı ve rapor sahibi/formül sürümü.
- **[14.1.5]** Üst eylem çubuğu: kayıtlı görünüm, filtre, sütun, karşılaştır, yenile, dışa aktar, yazdır.
- **[14.1.6]** Ortak filtre alanı: tarih aralığı, şirket/şube, müşteri, proje, departman, durum, sorumlu, para birimi ve rapora özel boyutlar.
- **[14.1.7]** 3–6 KPI kartı; her KPI için ad, değer, dönem karşılaştırması ve "Nasıl hesaplandı?" açıklaması.
- **[14.1.8]** Gerçek karar değeri varsa grafik alanı; sırf görsel olsun diye grafik eklenmez.
- **[14.1.9]** Ayrıntı tablosu: sabit başlık, sayfalama, sıralama, kolon seçimi, hızlı arama, drill-down ve satır detayına bağlantı.
- **[14.1.10]** Metodoloji/formül paneli: kaynak tablolar, filtre mantığı, para birimi/vergi, hariç tutulan kayıtlar, formül sürümü.
- **[14.1.11]** Alt bilgi: uygulanan filtreler, oluşturan kullanıcı, üretim zamanı, gizlilik sınıfı ve PDF'de sayfa X/Y.

### 14.2 Hizalama ve format kuralları

- **[14.2.1]** Metin/açıklama sola hizalı; uzun metin kontrollü kısaltma + tam metin erişimi.
- **[14.2.2]** Ad/kod/kimlik sola hizalı, mümkünse sabit ilk kolon; detaya tıklanabilir ve kopyalanabilir.
- **[14.2.3]** Sayı/yüzde sağa hizalı; ortak ondalık ve binlik ayırıcı politikası.
- **[14.2.4]** Para sağa hizalı; tutar + ISO para birimi, kur kaynağı açıklanır.
- **[14.2.5]** Tarih/saat ortalanır; yerel gösterim, saat dilimi belirtilir.
- **[14.2.6]** Durum/etiket ortalanır; ortak durum rozeti ve erişilebilir metin.
- **[14.2.7]** Eylemler sağda, sabit son kolon; yetkiye göre gösterilir.
- **[14.2.8]** Geniş tabloda ilk kimlik kolonları ve son eylem kolonu sabitlenebilir; yatay kaydırma başlıkla senkron çalışır.
- **[14.2.9]** Satır yüksekliği, boşluk, başlık, filtre etiketi ve durum rozeti tüm raporlarda aynıdır.
- **[14.2.10]** Mobilde kritik kolonlar kart görünümüne dönüşür; veri anlamı kaybolmaz.

### 14.3 Filtre, kayıtlı görünüm ve drill-down

- **[14.3.1]** Filtreler URL/query state ile paylaşılabilir ve geri/ileri gezinmeyle korunur.
- **[14.3.2]** Kullanıcı kişisel görünüm, yetkili kullanıcı ekip görünümü kaydedebilir; görünüm filtre, kolon, sıralama, gruplayıcı ve grafik seçimini saklar.
- **[14.3.3]** Rapor toplamından detay satırlarına ve kaynak kayda drill-down yapılabilir; drill-down aynı güvenlik kapsamını korur.
- **[14.3.4]** Boş, yükleniyor, kısmi veri, güncel değil ve hata durumları standart bileşenlerle açıkça gösterilir.
- **[14.3.5]** Para birimleri kuralsız toplanmaz; tek para birimine çevriliyorsa kur tarihi/kaynağı ve orijinal değer korunur.

### 14.4 Çıktı alma ve yazdırma

- **[14.4.1]** Her rapor yetkiye göre PDF, XLSX/Excel, CSV ve Yazdır seçeneklerini destekler.
- **[14.4.2]** Export ekranda aktif filtre, kolon, sıralama, kapsam ve formül sürümünü taşır; "tüm veri" ayrı izin ve açık seçim gerektirir.
- **[14.4.3]** Büyük export arka plan job olarak çalışır; tamamlanınca bildirim gelir, dosya süreli ve yetkili bağlantıyla indirilir.
- **[14.4.4]** PDF kolon sayısına göre A4 dikey/yatay seçer; başlık ve filtre özeti, tekrarlanan tablo başlığı, sayfa numarası, üretim zamanı ve gizlilik filigranı içerir; kolonlar kesilmez.
- **[14.4.5]** XLSX sayısal/tarih hücrelerini metne çevirmez; filtreli başlık, dondurulmuş satır ve ayrı "Rapor Bilgisi" sayfası bulunur.
- **[14.4.6]** CSV UTF-8 ve yerel uygulamalarla uyumlu; formül enjeksiyonuna karşı tehlikeli ilk karakterler güvenli ele alınır.
- **[14.4.7]** Yazdırma CSS'i navigasyon ve gereksiz butonları saklar, sayfa kırılmalarını ve başlık tekrarını yönetir.
- **[14.4.8]** Export girişimleri auditlenir; hassas raporda kullanıcı/tenant filigranı ve indirme süresi uygulanabilir.

### 14.5 Rapor kayıt şeması ve hesaplama

- **[14.5.1]** Her rapor registry kaydı `report_id`, `title`, `description`, `category`, `permissions`, `default_filters`, `available_dimensions`, `measures`, `drilldowns`, `export_types`, `freshness_policy`, `formula_version`, `data_classification` içerir.
- **[14.5.2]** Mevcut bütün raporlar bu registry'ye geçirilir.
- **[14.5.3]** Aynı metriği farklı raporlarda yeniden hesaplayan kopya sorgular kaldırılır.
- **[14.5.4]** Rapor sorgusu ve export satır/alan yetkisini SUNUCUDA uygular.
- **[14.5.5]** Kişisel notlar hiçbir kurumsal rapora veya genel export'a dahil edilmez.

### 14.6 Rapor kabul testleri

- **[14.6.1]** Aynı filtre/sıralama/kolonla ekran, PDF, XLSX ve CSV aynı kayıt kümesini ve toplamları verir.
- **[14.6.2]** Kullanıcı ekranda göremediği satır veya alanı export'tan alamaz.
- **[14.6.3]** PDF'de başlık ve kolonlar kesilmez; çok sayfalı tabloda kolon başlığı tekrar eder ve sayfa numarası görünür.
- **[14.6.4]** Para, yüzde, tarih ve durum hizalaması tüm raporlarda aynıdır.
- **[14.6.5]** Formül sürümü değişirse eski zamanlanmış/oluşturulmuş çıktının metadata'sında kullandığı sürüm kalır.
- **[14.6.6]** 100 bin+ satırlı export kullanıcı isteğini kilitlemeden arka planda tamamlanır ve tek yetkili dosya üretir.

## 15. Kullanıcıya özel "Notlarım" sayfası

- **[15.0.1]** Her kullanıcı için ana menüde veya "Çalışma Alanım" altında Notlarım sayfası oluşturulur.
- **[15.0.2]** Amaç: yalnız sahibinin görebildiği kişisel notlar ve tiklenebilir yapılacaklar; şirket görevleri, müşteri notları, yönetici raporları veya genel aramayla karıştırılmaz.
- **[15.0.3]** Başlık standardı: breadcrumb `Çalışma Alanım > Notlarım`, eyebrow `Kişisel Çalışma Alanı`, H1 `Notlarım`, alt açıklama `Yalnızca sizin görebildiğiniz kişisel notlar ve yapılacaklar.`

### 15.1 Liste ve kullanım deneyimi

- **[15.1.1]** Görünümler: Tümü, Açık, Bugün, Yaklaşan, Tamamlanan, Arşiv.
- **[15.1.2]** Arama, etiket, kategori, öncelik, tarih ve sıralama.
- **[15.1.3]** Liste/kart görünümünde başlık, kısa içerik, son tarih, etiket, öncelik ve tamamlanma durumu.
- **[15.1.4]** Not veya checklist maddesi yanındaki checkbox ile hızlı tamamlama; tamamlanan kayıt için `completed_at`.
- **[15.1.5]** Tamamlamayı geri alma, sabitleme, arşivleme, yumuşak silme ve kısa süreli geri al.
- **[15.1.6]** Boş durum, yaklaşan/geciken not uyarısı ve yalnız sahibine özel hatırlatma.
- **[15.1.7]** Klavye ile hızlı yeni not, kaydetme ve checkbox yönetimi; görünür odak ve erişilebilir etiketler.

### 15.2 Yeni not / düzenleme formu

- **[15.2.1]** Referans personel formuyla aynı page-head, form-grid, ana kart, yan panel ve form-foot kullanılır; bilgi yoğunluğu düşükse sekme zorunlu değildir.
- **[15.2.2]** Bölüm "Not": başlık ve zengin olmayan güvenli metin/açıklama.
- **[15.2.3]** Bölüm "Kontrol Listesi": sıralanabilir, eklenebilir, silinebilir, ayrı ayrı tiklenebilir maddeler.
- **[15.2.4]** Bölüm "Plan": son tarih/saat, hatırlatma, öncelik, etiket/kategori ve sabitleme.
- **[15.2.5]** Bölüm "Özet": görünürlük açıklaması, açık/tamamlanan madde sayısı ve kayıt durumu.
- **[15.2.6]** Birincil eylem "Notu Kaydet", ikincil eylem "Vazgeç".
- **[15.2.7]** Taslak otomatik kaydetme uygulanırsa yerel kopya sızıntısına karşı güvenli tasarlanır ve kaydetme durumu görünür.

### 15.3 Veri modeli

- **[15.3.1]** `personal_notes`: `id`, `tenant_id`, `owner_user_id` (istemciden alınmaz, oturumdan atanır, değiştirilemez), `title`, `body`/`body_ciphertext`, `status` (`open`/`done`/`archived`), `priority`, `category`, `color`, `is_pinned`, `due_at`, `reminder_at`, `sort_order`, `created_at`, `updated_at`, `completed_at`, `archived_at`, `deleted_at`.
- **[15.3.2]** `personal_note_checklist_items`: `id`, `note_id`, `owner_user_id`, `text`/`text_ciphertext`, `is_checked`, `checked_at`, `sort_order`, `created_at`, `updated_at`, `deleted_at`.
- **[15.3.3]** Etiketler ayrı tabloyla veya güvenli normalize edilmiş yapıyla tutulur.
- **[15.3.4]** Not ve checklist durumları transaction içinde güncellenir; son checkbox işaretlenince notun otomatik tamamlanması kullanıcı ayarı/politikasıdır.

### 15.4 Kesin gizlilik ve yetki kuralları

- **[15.4.1]** Her okuma, arama, oluşturma, güncelleme, silme ve hatırlatma sorgusu sunucuda `owner_user_id = session.user_id` kapsamı uygular.
- **[15.4.2]** `owner_user_id` request body'den kabul edilmez; oluştururken oturumdan atanır ve sonradan devredilemez.
- **[15.4.3]** Başka kullanıcıya ait ID ile read/update/delete isteği veri varlığını ifşa etmeyecek şekilde `404` döner.
- **[15.4.4]** Yönetici, ekip lideri, İK, müşteri, superadmin veya rapor rolü uygulama üzerinden not içeriğini okuyamaz; yalnız sahibin erişimi vardır.
- **[15.4.5]** Not başlığı/gövdesi şirket genel araması, rapor, export, yönetici paneli, sohbet, AI özetleme, aktivite akışı ve audit payload'ına girmez.
- **[15.4.6]** Audit yalnız olay metadata'sını tutar (kayıt kimliği, eylem, zaman, sahibin kendi kimliği); not içeriği veya checklist metni audit loga yazılmaz.
- **[15.4.7]** Bildirim ve hatırlatma yalnız sahibine gider; e-posta/push önizlemesi kullanıcı tercihine göre gövdeyi gizleyebilir.
- **[15.4.8]** Uygulama logları, hata izleme, analytics ve telemetry not metnini yakalamaz.
- **[15.4.9]** İçerik dinlenirken ve aktarımda şifrelenir; mümkünse alan düzeyinde tenant/kullanıcı anahtarlı şifreleme uygulanır.
- **[15.4.10]** Yedekleme ve saklama politikası bulunur; silinen notların geri alma süresi kullanıcıya açık gösterilir.
- **[15.4.11]** Notu kurumsal göreve dönüştürme varsayılan olarak eklenmez; eklenirse açık uyarı + onay alınır ve kaynak kişisel not bağlantısı diğer kullanıcılara ifşa edilmez.

### 15.5 Notlarım kabul testleri

- **[15.5.1]** A kullanıcısının not ID'sini bilen B kullanıcısı listede, detayda, aramada, API'de, export'ta ve bildirimde içeriği göremez.
- **[15.5.2]** Superadmin rolü standart uygulama/API yoluyla not gövdesini okuyamaz.
- **[15.5.3]** Request body'de farklı `owner_user_id` gönderilse bile kayıt oturum sahibine atanır veya istek reddedilir.
- **[15.5.4]** Checkbox işaretlenince `checked_at`, not tamamlanınca `completed_at` yazılır; geri alınca tutarlı temizlenir/geçmiş olayı oluşur.
- **[15.5.5]** Kişisel not metni audit, hata logu, analytics ve genel arama indeksinde yer almaz.
- **[15.5.6]** Hatırlatma yalnız sahibine bir kez gider; retry yinelenen bildirim üretmez.

## 16. Eksik sayfa ve özellik envanteri

### 16.1 P0 — canlıya çıkıştan önce

- **[16.1.1]** Ortak workflow eylem modalı/drawer'ı.
- **[16.1.2]** Merkezî durum geçiş motoru ve sürümlenmiş onay motoru.
- **[16.1.3]** Veri Kalitesi & Sistem Sağlığı sayfası.
- **[16.1.4]** Entegrasyon hata kuyruğu/replay ekranı.
- **[16.1.5]** Satır/alan/rapor/export yetki uygulaması ve regresyon testleri.
- **[16.1.6]** Finansal kanonik kaynak: ödeme tahsisi, fatura durumu ve proje maliyeti.
- **[16.1.7]** İş takvimi/SLA motoru.
- **[16.1.8]** Kişisel Notlarım gizlilik modelinin negatif yetki testleri.

### 16.2 P1 — ana süreci eksiksiz yapmak için

- **[16.2.1]** Milestone CRUD/detail.
- **[16.2.2]** Sprint CRUD/detail.
- **[16.2.3]** Test planı, senaryo, çalıştırma ve sonuç.
- **[16.2.4]** Değişiklik talebi create/edit/detail/approval.
- **[16.2.5]** Teslimat create ve müşteri kabul ekranı.
- **[16.2.6]** Tahsilat/ödeme formu ve dağıtım ekranı.
- **[16.2.7]** Ödeme planı CRUD/detail/revision.
- **[16.2.8]** Tedarikçi faturası / borç hesapları.
- **[16.2.9]** RFQ ve teknik/ticari değerlendirme.
- **[16.2.10]** Release/deployment yönetimi.
- **[16.2.11]** Bilgi bankası.
- **[16.2.12]** Müşteri portalı.
- **[16.2.13]** Otomasyon kural editörü ve çalışma geçmişi.
- **[16.2.14]** Entegrasyon detay/ayar/senkronizasyon logları.
- **[16.2.15]** Personel onboarding/offboarding ve zimmet kabulü.
- **[16.2.16]** Tek tip ReportLayout ve tüm raporların migrasyonu.
- **[16.2.17]** Notlarım liste/yeni/düzenle/hatırlatma ekranları.

### 16.3 P2 — ürünleşme ve ileri ölçek

- **[16.3.1]** Ürün/hizmet kataloğu ve fiyatlandırma kuralları.
- **[16.3.2]** Lisans/abonelik yönetimi.
- **[16.3.3]** Tedarikçi portalı.
- **[16.3.4]** API anahtarı ve webhook yönetimi.
- **[16.3.5]** Zamanlanmış rapor dağıtımı ve ekip kayıtlı görünümleri.
- **[16.3.6]** Gelişmiş müşteri sağlık skoru, tahminleme ve kapasite senaryosu.

## 17. Veri Kalitesi ve Sistem Sağlığı

- **[17.0.1]** P0 olarak ayrı bir yönetim sayfası oluşturulur; kontroller zamanlanmış ve talep üzerine çalışır.
- **[17.0.2]** Kontrol: kaynaksız/yetim bağlı kayıtlar.
- **[17.0.3]** Kontrol: mükerrer müşteri, kişi, fatura, ödeme, proje veya entegrasyon olayı.
- **[17.0.4]** Kontrol: uyuşmayan müşteri–teklif–sözleşme–proje bağları.
- **[17.0.5]** Kontrol: durum ile olay geçmişinin uyuşmaması.
- **[17.0.6]** Kontrol: elle tutulmuş veya mükerrer onay sayacı.
- **[17.0.7]** Kontrol: başarısız/uzun süren entegrasyon ve dead-letter kayıtları.
- **[17.0.8]** Kontrol: eksik zorunlu ilişki, imza, belge, kabul veya ödeme tahsisi.
- **[17.0.9]** Kontrol: süresi dolmuş fakat aktif görünen sözleşme/lisans/belge.
- **[17.0.10]** Kontrol: birden fazla aktif zimmet veya çakışan kapasite/tarih.
- **[17.0.11]** Kontrol: güncelliğini yitirmiş rol/izin önbelleği.
- **[17.0.12]** Her bulgu önem, etkilenen kayıt, tespit kuralı, ilk/son görülme, otomatik düzeltilebilirlik, sorumlu, durum ve çözüm auditini içerir.
- **[17.0.13]** Otomatik düzeltme geri alınabilir ve yetkili olur.

## 18. Arşivleme ve silme modeli

- **[18.0.1]** Ortak alanlar: `archived_at`, `archived_by`, `archive_reason`, `retention_until`, `legal_hold`, `deleted_at`.
- **[18.0.2]** Geri yüklemede benzersiz anahtar ve aktif bağ çakışması kontrol edilir.
- **[18.0.3]** Ana kaydın arşivlenmesinde bağlı kayıtlar körlemesine silinmez; entity türüne göre engelle / bağı koparma / yalnız görünümden çıkarma / birlikte arşivleme politikası tanımlanır.
- **[18.0.4]** Finansal, imzalı, kabul edilmiş ve audit kayıtları hard delete ile silinmez.

## 19. Uygulama mimarisi ve teknik teslimatlar

- **[19.0.1]** Önce mevcut teknoloji yığını tespit edilir ve onun içinde kalınır.
- **[19.0.2]** Yeni framework veya durum yönetimi kütüphanesi yalnız açık gerekçe ve migrasyon planıyla eklenir.
- **[19.0.3]** Servis sınırı: `TransitionService`.
- **[19.0.4]** Servis sınırı: `ApprovalService`.
- **[19.0.5]** Servis sınırı: `Relationship/EventService`.
- **[19.0.6]** Servis sınırı: `AuthorizationPolicyService`.
- **[19.0.7]** Servis sınırı: `AuditService`.
- **[19.0.8]** Servis sınırı: `BusinessCalendar/SLAService`.
- **[19.0.9]** Servis sınırı: `FinanceCalculationService`.
- **[19.0.10]** Servis sınırı: `ReportRegistry/ExportService`.
- **[19.0.11]** Servis sınırı: `IntegrationJob/ErrorQueueService`.
- **[19.0.12]** Servis sınırı: `DataQualityService`.
- **[19.0.13]** Servis sınırı: `PersonalNotesService`.
- **[19.0.14]** Veritabanı migration'ları ileri ve mümkünse geri dönüş planıyla hazırlanır.
- **[19.0.15]** Yabancı anahtar, benzersiz/partial index, optimistic locking/version ve transaction sınırları tanımlanır.
- **[19.0.16]** Kuyruk işleri retry + idempotency + dead-letter kullanır.

### 19.1 API ve olay gereksinimleri

- **[19.1.1]** Liste endpoint'leri sunucu tarafı filtre, sıralama, cursor/page ve satır kapsamı uygular.
- **[19.1.2]** Create/update komutları validation hatalarını alan + hata kodu + kullanıcı mesajı olarak döner.
- **[19.1.3]** Durum değiştirme genel update yerine transition endpoint'iyle yapılır.
- **[19.1.4]** Dönüşüm endpoint'leri hedef kayıt kimliklerini döner.
- **[19.1.5]** Domain olayları outbox deseniyle transaction'a bağlanır; entegrasyon başarısızlığı ana kaydı tutarsız bırakmaz.
- **[19.1.6]** Webhook ve queue tüketicileri idempotent olur.
- **[19.1.7]** Hassas alanlar response serialization aşamasında role göre maskelenir veya tamamen çıkarılır.
- **[19.1.8]** Kişisel not endpoint'leri ayrı namespace ve kesin owner scope kullanır.

### 19.2 Test katmanları

- **[19.2.1]** Domain unit testleri: durum geçişi, onay, bakiye, SLA, maliyet ve kaynak uygunluğu.
- **[19.2.2]** API entegrasyon testleri: transaction, idempotency, concurrency, yetki ve hata sözleşmesi.
- **[19.2.3]** E2E akışları: lead'den müşteri/proje; satın almadan kabul/fatura; projeden teslim/fatura/destek.
- **[19.2.4]** Görsel/regresyon: referans form anatomisi, responsive kırılımlar ve ortak rapor hizalaması.
- **[19.2.5]** Güvenlik negatif testleri: satır/alan/export/kişisel not izolasyonu, IDOR, secret/log sızıntısı.
- **[19.2.6]** Yük testleri: rapor sorgusu, büyük export, entegrasyon kuyruğu ve toplu bildirim.

## 20. Uçtan uca zorunlu kabul senaryoları

### 20.1 Senaryo A — satıştan projeye

- **[20.1.1]** Lead oluştur ve ön analiz başlat.
- **[20.1.2]** Teknik/ticari onay tamamlanmadan teklif oluşturmayı engelle.
- **[20.1.3]** Onaylı ön analizden teklif revizyonu üret ve müşteri kabulünü kaydet.
- **[20.1.4]** Lead dönüşümünde mükerrer müşteriyi tespit et ve mevcut kayda bağla.
- **[20.1.5]** Kazanılan tekliften aynı müşteriye ait sözleşme ve ödeme planı taslağı oluştur.
- **[20.1.6]** İmza + ödeme planı kontrolünden sonra sözleşmeyi aktive et.
- **[20.1.7]** Referans form standardındaki Proje Sihirbazı ile proje ve alt kayıtları oluştur.
- **[20.1.8]** Aynı dönüşüm komutunu tekrar çalıştır; yinelenen kayıt oluşmadığını doğrula.

### 20.2 Senaryo B — proje, kalite ve teslim

- **[20.2.1]** Milestone, sprint ve görevleri şablondan üret.
- **[20.2.2]** Görevi atama–kabul–çalışma–kontrol–onay akışından geçir.
- **[20.2.3]** Başarısız testten hata oluştur, düzelt ve yeniden test et.
- **[20.2.4]** Kapsam dışı değişiklik için etki analizi, müşteri/ticari onay ve zeyil oluştur.
- **[20.2.5]** Kritik hata açıkken teslimi engelle.
- **[20.2.6]** Kısmi müşteri kabulünde yalnız kabul edilen kalem için izinli fatura tetikleyicisini çalıştır.
- **[20.2.7]** Proje kapanış kontrol listesi tamamlanmadan projeyi tamamlamayı engelle.

### 20.3 Senaryo C — satın alma ve finans

- **[20.3.1]** Satın alma talebini taslak kaydet; ayrıca onaya gönder.
- **[20.3.2]** Ret/iadede gerekçe ve yeni sürüm zorunluluğunu doğrula.
- **[20.3.3]** RFQ tekliflerini normalize edip seçim onayından PO üret.
- **[20.3.4]** Kısmi teslim ve hizmet/mal kabulü yap.
- **[20.3.5]** PO–kabul–tedarikçi faturası üçlü eşleştirmesini doğrula.
- **[20.3.6]** Ekipman kabulünden demirbaş taslağı üret; aktif zimmet çakışmasını engelle.
- **[20.3.7]** Tahsilat hareketini çoklu faturaya dağıt; fatura durumlarının otomatik türediğini doğrula.

### 20.4 Senaryo D — personel ve özel not

- **[20.4.1]** Referans tasarımındaki sekmeli personel formunda yetkiye göre hassas sekmeleri göster.
- **[20.4.2]** Mükerrer kimlik/e-posta ve eksik belgeyi tespit et.
- **[20.4.3]** Personel, özlük, onboarding ve taslak zimmetleri tek transaction'da oluştur.
- **[20.4.4]** Personelin zimmeti kabul etmesiyle envanter durumunu güncelle.
- **[20.4.5]** Kullanıcı A kişisel not/checklist oluşturup tiklesin.
- **[20.4.6]** Kullanıcı B ve superadmin aynı not ID'sine erişmeye çalışsın; içerik hiçbir kanalda görünmesin.
- **[20.4.7]** Not metninin audit, log, arama ve rapora girmediğini doğrula.

### 20.5 Senaryo E — tek tip rapor ve çıktı

- **[20.5.1]** Bir satış, proje ve finans raporunu aynı ReportLayout ile aç.
- **[20.5.2]** Aynı tarih/müşteri/proje filtrelerini uygula.
- **[20.5.3]** Kolon, hizalama, KPI açıklaması ve drill-down davranışının ortak olduğunu doğrula.
- **[20.5.4]** PDF, XLSX, CSV ve yazdırma çıktısı al.
- **[20.5.5]** Kayıt kümesi, toplam, filtre ve formül sürümünün ekranla aynı olduğunu doğrula.
- **[20.5.6]** Yetkisiz alanın hiçbir çıktıda bulunmadığını ve kişisel notların rapora girmediğini doğrula.

## 21. Uygulama sırası

- **[21.0.1]** Faz 0 — envanter ve güvenlik ağı: sayfalar, rotalar, entity'ler, durum alanları, duplicate hesaplamalar, roller ve testler çıkarılır; mevcut davranış için smoke/E2E testleri eklenir; hangi demo kodunun üretim servisine dönüşeceği belirlenir.
- **[21.0.2]** Faz 1 — P0 ortak çekirdek: transition, approval, authorization, audit, relationship/event, idempotency/outbox, business calendar/SLA, data quality ve integration error queue altyapısı kurulur; ortak eylem modalı eklenir.
- **[21.0.3]** Faz 2 — tasarım standardı: referans personel formu reusable CreateEditPage bileşenlerine ayrılır; önce Personel ve Proje formları düzeltilir, ardından bütün yeni/düzenleme sayfalarına geçirilir; mevcut sayfalarda görsel kırılma regresyonu yapılır.
- **[21.0.4]** Faz 3 — uçtan uca iş akışları: satış→sözleşme→proje; proje→kalite→teslim→destek; satın alma→kabul→tedarikçi faturası; fatura→tahsilat zincirleri tamamlanır.
- **[21.0.5]** Faz 4 — raporlama ve kişisel çalışma alanı: ReportLayout, registry ve export service kurulur, tüm raporlar migrate edilir; ardından Notlarım modülü sıkı owner-only politika ve negatif testlerle eklenir.
- **[21.0.6]** Faz 5 — portallar ve ileri entegrasyon: müşteri/tedarikçi portalı, bilgi bankası, API/webhook yönetimi, lisans/abonelik, release/deployment ve ileri rapor dağıtımı tamamlanır.

## 22. Cloud/AI geliştiricinin teslim biçimi

- **[22.0.1]** Çalışma tek seferde kontrolsüz büyük bir değişiklik olarak uygulanmaz; ÖNCE analiz raporu ve uygulanabilir iş paketleri üretilir, ardından her faz çalışan kod, migration, test ve kısa teknik dokümantasyonla teslim edilir.
- **[22.0.2]** İş paketi başlığı: mevcut sorun ve etkilenen sayfa/entity.
- **[22.0.3]** İş paketi başlığı: hedef davranış ve durum/ilişki kuralları.
- **[22.0.4]** İş paketi başlığı: değiştirilecek dosyalar/bileşenler/endpoint'ler.
- **[22.0.5]** İş paketi başlığı: migration ve veri düzeltme ihtiyacı.
- **[22.0.6]** İş paketi başlığı: yetki ve audit etkisi.
- **[22.0.7]** İş paketi başlığı: otomatik testler ve kabul senaryosu.
- **[22.0.8]** İş paketi başlığı: geri dönüş/feature flag planı.
- **[22.0.9]** İş paketi başlığı: ekran görüntüsü veya kısa demo kanıtı.
- **[22.0.10]** Her faz sonunda lint/typecheck, unit, integration, E2E ve erişilebilirlik kontrolleri çalıştırılır.
- **[22.0.11]** Başarısız veya çalıştırılamayan test açıkça raporlanır; "tamamlandı" sayılmaz.
- **[22.0.12]** Mevcut kullanıcı verisi korunur, üretimdeki bağlantılar sessizce koparılmaz, veri migrasyonu olmadan alan anlamı değiştirilmez.

## 23. Definition of Done

- **[23.0.1]** UI referans form veya ortak rapor standardına uygundur.
- **[23.0.2]** İş kuralı sunucu tarafında uygulanır.
- **[23.0.3]** Durum geçişi/yan etkiler atomik ve idempotenttir.
- **[23.0.4]** Kaynak–hedef ilişkileri ve audit izi oluşur.
- **[23.0.5]** Rol, satır, alan, rapor ve export yetkileri test edilmiştir.
- **[23.0.6]** Hata, boş, yükleniyor ve yetkisiz durumları tasarlanmıştır.
- **[23.0.7]** Mobil/klavye/erişilebilirlik kontrolleri geçer.
- **[23.0.8]** Migration ve geri dönüş planı vardır.
- **[23.0.9]** Unit/integration/E2E testleri geçer.
- **[23.0.10]** Demo veriye veya tek bir sabit kullanıcıya özel kod yoktur.
- **[23.0.11]** Rapor sonucu ve export aynı hesaplama kaynağını kullanır.
- **[23.0.12]** Kişisel not içeriği sahibi dışında hiçbir kullanıcı, log, rapor, arama veya entegrasyon tarafından görülemez.

## 24. Son talimat

- **[24.0.1]** Yukarıdaki kapsam ürünün tamamı için bağlayıcı kabul edilir.
- **[24.0.2]** Önce mevcut kod tabanında karşılık bulunur; çakışan veya tekrarlanan uygulamalar işaretlenir.
- **[24.0.3]** P0'dan başlayarak fazlandırılmış uygulama planı çıkarılır.
- **[24.0.4]** Belirsiz iş kuralında sessiz varsayım yapılmaz; veri bütünlüğü, finansal sonuç, müşteri sözleşmesi, kişisel veri veya erişim kapsamını etkiliyorsa karar açık soru/ADR olarak kaydedilir.
- **[24.0.5]** Değişmez temeller: yeni kayıt sayfalarında personel formu referansı, raporlarda tek ReportLayout, kişisel notlarda owner-only güvenlik modeli.
