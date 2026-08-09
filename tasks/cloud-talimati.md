# GaviaWorks Cloud Tam Revizyon ve Uygulama Promptu

## Kullanım amacı

Bu doküman, **GaviaWorks – Yazılım ve Yapay Zekâ Şirketleri İçin CRM, Proje ve Operasyon Yönetim Platformu** prototipinin üretime hazır bir ürüne dönüştürülmesi için Cloud/AI geliştiriciye verilecek tek parça ana uygulama promptudur. Aşağıdaki maddeler öneri değil, aksi açıkça belirtilmedikçe bağlayıcı ürün, tasarım, veri, yetki, iş akışı ve kabul kriteridir.

İncelenen ana prototip: https://gaviaworks-dev.github.io/gaviaworks-crm/index.html

Yeni kayıt ekranları için bağlayıcı görsel ve etkileşim referansı: https://gaviaworks-dev.github.io/gaviacrm/v2/crm-personel-form.html

İnceleme tarihi: 9 Ağustos 2026

## Cloud/AI geliştiriciye ana görev

Mevcut GaviaWorks kod tabanını, sayfa envanterini, veri modellerini, yönlendirmeleri, roller ve izinleri, form bileşenlerini, raporları ve entegrasyon noktalarını önce analiz et. Demo metinlerini veya örnek sayıların doğruluğunu esas alma. Asıl hedef; eksik algoritmaları, kopuk modül ilişkilerini, hatalı veya eksik durum geçişlerini, onay/ret/iptal/revizyon gerektiren süreçleri, eksik müşteri–proje–görev bağlarını, eksik sayfa ve fonksiyonları ve entegrasyon altyapısını tamamlamaktır.

Uygulamayı yalnız ön yüz prototipi olarak değil, sunucu tarafı doğrulaması, kalıcı veri modeli, rol/satır/alan bazlı yetki, denetim izi, idempotent işlem ve otomatik testleri bulunan üretim sistemi olarak ele al. Mevcut çalışan sayfaları gereksiz yere yeniden yazma. Önce ortak altyapıyı kur, sonra modülleri bu altyapıya geçir.

## 1. Ürün adı, kapsamı ve konumlandırması

Platformun tam adı her yerde şu şekilde kullanılmalıdır:

**GaviaWorks – Yazılım ve Yapay Zekâ Şirketleri İçin CRM, Proje ve Operasyon Yönetim Platformu**

Kısa ürün adı: **GaviaWorks**

Ürün kategorisi: **CRM + proje/profesyonel hizmet yönetimi + şirket içi operasyon yönetimi**

Mevcut kapsam, müşteri ilişkilerinden teslimat ve desteğe uzanan bir operasyon omurgası oluşturur. Ancak tedarikçi borçları, banka/kasa, genel muhasebe, vergi, bordro, e-belge ve finansal mutabakat tamamlanmadan ürünü “tam ERP” olarak tanımlama. Bu bileşenler sonradan eksiksiz eklenirse “ERP yetenekleri içeren bütünleşik iş yönetim platformu” konumlandırmasına geçilebilir.

Ana uçtan uca süreç şu olmalıdır:

**Lead → Ön Analiz → Teklif → Müşteri → Sözleşme → Ödeme Planı → Proje → Milestone/Sprint/Görev/Kalite → Teslimat → Fatura/Tahsilat → Destek/Bakım**

Her geçiş kaynak kaydı, sürümü, müşteri bağı, sorumluyu, işlemi yapan kullanıcıyı ve tarihçeyi korumalıdır. Aynı bilgi hedef modülde yeniden elle yazdırılmamalıdır.

## 2. Değişmez uygulama ilkeleri

1. **Tek yetkili kaynak:** Fatura durumu tahsilat tahsislerinden, proje maliyeti onaylı zaman/gider hareketlerinden, demirbaş durumu aktif zimmetten, onay adımı onay olaylarından türetilsin. Türetilmiş değerler elle değiştirilemesin.
2. **Sunucu tarafı kural:** Arayüzdeki gizleme veya devre dışı bırakma güvenlik sayılmasın. Bütün iş kuralları API/servis katmanında yeniden doğrulansın.
3. **Atomik dönüşüm:** Lead’i müşteriye, teklifi sözleşmeye veya sözleşmeyi projeye dönüştürme gibi işlemler tek transaction içinde tamamlansın; yarım kayıt oluşmasın.
4. **İdempotency:** Aynı komut, entegrasyon olayı veya kullanıcı tıklaması tekrarlandığında ikinci müşteri, proje, fatura ya da ödeme oluşmasın. `idempotency_key`, `source_entity_type` ve `source_entity_id` kullanılsın.
5. **Sürüm ve kilit:** Onaya gönderilen, imzalanan, kabul edilen veya finansal sonuç doğuran sürüm değiştirilemesin. Değişiklik yeni revizyon oluştursun ve sürüm farkı gösterilsin.
6. **Gerekçe zorunluluğu:** Ret, iptal, geri çekme, revizyon talebi, yeniden açma, onay atlama ve yönetici istisnasında neden kodu + açıklama zorunlu olsun.
7. **Denetim izi:** Kim, ne zaman, hangi kaydı, önceki ve yeni değerlerle, hangi cihaz/IP/istek kimliği üzerinden değiştirdi bilgisi append-only olay günlüğünde tutulsun.
8. **Rol ayrılığı:** Talep eden, onaylayan, ödemeyi oluşturan ve mutabakat yapan kişiler aynı olmak zorunda değildir. Görevler ayrılığı politikası uygulanabilsin.
9. **Kaynak–hedef bağlantısı:** Modüller arası ilişki yalnız serbest metinle kurulmasın; yabancı anahtar, ilişki tipi ve kaynak sürümü saklansın.
10. **Arşiv silme değildir:** Arşivlenen kayıt, saklama ve hukuki bekletme politikasına göre korunmalı, kontrollü geri yüklenebilmeli ve raporlarda kapsam seçimine göre gösterilmelidir.
11. **Ortak hesaplama hizmetleri:** Aynı KPI, maliyet, SLA veya bakiye farklı sayfalarda ayrı formüllerle hesaplanmasın. UI, rapor ve dışa aktarma aynı domain servisini kullansın.
12. **Demo bağımsızlığı:** Ekranlarda geliştirici notu, mock açıklaması veya demo veriye özel kural üretim arayüzünde görünmesin.

## 3. Bağlayıcı yeni kayıt ve düzenleme sayfası standardı

Tüm yeni kayıt ve düzenleme sayfaları, referans verilen `crm-personel-form.html` sayfasının görsel dilini ve yerleşim mantığını kullanmalıdır. Yeni ve farklı bir form tasarım dili icat etme. Mevcut `tokens.css`, `shell.css`, `ui.css`, Manrope yazı tipi, nötr yüzeyler, ince sınırlar, sınırlı vurgu rengi, ortak butonlar, kartlar, sekmeler ve alan bileşenleri yeniden kullanılmalıdır.

### 3.1 Sayfa anatomisi

Her create/edit ekranı aşağıdaki sırayı izlesin:

1. Mevcut uygulama kabuğu: sol rail, menü, üst arama, bildirim ve kullanıcı alanı.
2. Tıklanabilir breadcrumb: “Liste/Detay > Yeni Kayıt” veya “Detay > Düzenle”.
3. `gv-page-head`: küçük kategori/eyebrow, açık H1 ve sonucu anlatan tek satırlık alt açıklama.
4. `form-grid`: solda geniş ana form kartı, sağda bağlam/not/özet/doğrulama kartlarından oluşan yan panel.
5. Ana kart içinde, bilgi yoğunluğuna göre yatay kaydırılabilir `gv-tabs`.
6. Her sekmede `fg-section`: ikon, bölüm başlığı, gerektiğinde kısa açıklama ve nötr ayırıcı.
7. Masaüstünde iki sütun, küçük ekranda tek sütun alan düzeni; uzun metin ve tablolar tam genişlik.
8. Seçime bağlı alanlar koşullu alt grup içinde açılsın; gizlenen alanların geçersiz değerleri gönderilmesin.
9. Eğitim, kalem, rol, milestone, zimmet veya benzeri çoğul veriler için tekrarlanabilir satır/blok ekle–kaldır deseni kullanılsın.
10. Dosya alanlarında sürükle-bırak/yükle bölgesi, dosya adı, türü, sürümü, durumu, görüntüle/değiştir/sil eylemleri bulunsun.
11. Sistem tarafından türetilen alanlar salt okunur olsun ve neden değiştirilemediği kısa yardım metniyle açıklansın.
12. Zorunlu alan, format ve iş kuralı hataları alan altında gösterilsin; gönderimde ayrıca sekme bazlı hata özeti sunulsun ve ilk hataya odaklanılsın.
13. Ana kart sonunda ortak `form-foot` kullanılsın. En az “Vazgeç” ve bağlama uygun birincil eylem bulunsun. Uzun sihirbazlarda “Taslak Kaydet”, “Önceki”, “Sonraki” ve son adımda “Oluştur/Güncelle/Onaya Gönder” eylemleri aynı buton diliyle gösterilsin.
14. Kaydedilmemiş değişiklik varken sayfadan ayrılmada uyarı verilsin; aynı tıklamanın çift kayıt üretmesi engellensin.
15. Sağ panel; kaynak kayıt, bağlantılı müşteri/sözleşme, zorunlu kontroller, oluşturulacak alt kayıtlar ve kısa kullanım notlarını canlı özetlesin.
16. Kayıt sonrası başarı ekranı/toast tek başına yeterli değildir. Oluşan ana kaydın detayına gidilsin ve otomatik üretilen alt kayıtların bağlantıları gösterilsin.

### 3.2 Form davranışı ve erişilebilirlik

- Sekmeler klavye ile gezilebilir, `role=tablist/tab/tabpanel`, `aria-selected`, görünür odak ve doğru etiket ilişkileri içersin.
- Zorunluluk yalnız renk ile anlatılmasın. Hata, uyarı, başarılı ve salt okunur durumlar metin/ikon ile de ayrışsın.
- Tarih, para, yüzde, telefon ve kimlik alanları yerel biçim gösterse bile API’ye kanonik veri göndersin.
- Arama yapılabilen seçim bileşenlerinde pasif kayıtlar varsayılan olarak gelmesin; mevcut bağ pasife alınmışsa geçmiş değer okunabilir kalsın.
- Rolü olmayan kullanıcı sekmenin HTML’ini veya hassas alanın değerini API’den alamamalıdır.
- Taslak kaydetme, otomatik kaydetme veya form geri yükleme kullanılıyorsa alan bazında son kaydetme durumu görünmelidir.
- Aynı sayfanın create ve edit modu ortak şema/bileşen kullanmalı; farklı kuralları açık biçimde ayrıştırmalıdır.

### 3.3 Bu standardın uygulanacağı sayfalar

Personel, Proje, Lead, Ön Analiz, Teklif, Müşteri/Kişi, Sözleşme, Ödeme Planı, Milestone, Sprint, Görev, Departman Talebi, Test Planı/Test Senaryosu, Hata, Değişiklik Talebi, Teslimat, Destek Kaydı, Satın Alma Talebi, RFQ, Satın Alma Siparişi, Tedarikçi, Tedarikçi Faturası, Fatura, Tahsilat/Ödeme, Demirbaş, Zimmet, Araç, Lisans/Abonelik, Doküman, Toplantı, Otomasyon Kuralı, Entegrasyon Ayarı ve Kişisel Not create/edit ekranları aynı kabuğu kullanmalıdır.

## 4. Personel ekleme sayfası revizyonu

Referans sayfadaki sekmeler korunmalı ve üretim kurallarıyla tamamlanmalıdır:

1. **Kişisel:** Kimlik, profil fotoğrafı, temel bilgiler, eğitim ve yalnız gerekli kişisel bilgiler.
2. **İletişim:** Kurumsal/kişisel iletişim, adres ve acil durum kişisi. İletişim tercihleri ve KVKK/açık rıza kaydı ayrı ve sürümlü olsun.
3. **Görev & Departman:** Personel numarası, şirket/şube, istihdam türü, pozisyon, departman, ekip, yönetici, çalışma takvimi, kapasite ve başlangıç tarihi.
4. **SGK / Maaş:** Yalnız bordro/İK/yönetim kapsamı. Ücret, para birimi, ödeme periyodu, SGK ve banka bilgileri şifreli, maskeli ve alan bazlı yetkili olsun.
5. **Evrak:** Belge türü, zorunluluk, sürüm, düzenlenme/son geçerlilik tarihi, onay durumu ve dosya. İlk işe giriş için zorunlu kategoriler tamamlanmadan aktivasyon yapılmasın.
6. **Zimmet:** Mevcut uygun envanterden seçim yapılabilsin. Personel kaydı oluşurken kesin zimmet yerine “teslim/onay bekleyen zimmet taslağı” oluşturulsun; personelin teslim aldım onayı veya e-imzası ile aktifleşsin.
7. **İzin / Avans / Rapor:** Yeni personel kaydında bilgi amaçlı boş durum gösterilsin. Personel oluşmadan izin/avans/rapor hareketi yaratılmasın. Kayıt sonrasında ilgili modüllere bağlantı ve özet gösterilsin.

Sağ yan panelde “Kayıt Notları” ile birlikte tamamlanma yüzdesi, eksik zorunlu belgeler, çakışma/mükerrer uyarıları, oluşturulacak özlük dosyası–onboarding–hesap–kapasite kayıtları ve rol görünürlüğü gösterilsin.

### 4.1 Personel veri ve algoritma kuralları

- Personel numarası sunucu tarafından benzersiz üretilsin; istemciden gelen numaraya güvenilmesin.
- T.C. kimlik/vergi kimlik, kurumsal e-posta, kişisel e-posta ve telefon için normalizasyon ve mükerrer kontrolü yapılsın. Yetkili kullanıcı birleştirme/istisna akışına yönlendirilsin.
- Departman, ekip, görev/pozisyon ve proje üyeliği farklı kavramlar olarak modellenmeli; tek alanla karıştırılmamalıdır.
- Personel durumu `Taslak → Onboarding → Aktif → İzinli/Pasif → Offboarding → Ayrıldı` yaşam döngüsünden türesin. Kullanıcı serbest bir açılır listeden son duruma atlayamasın.
- Onboarding şablonu seçildiğinde görevler, sorumlular, son tarihler, belge talepleri, hesap açma, eğitim ve ekipman hazırlığı otomatik oluşturulsun.
- Kullanıcı hesabı oluşturma isteğe bağlı ve ayrı yetkili eylem olsun; davet, MFA ve ilk giriş durumu izlenebilsin.
- Yönetici, çalışma takvimi, haftalık kapasite ve izin bölgesi başlangıçta zorunlu olsun; kapasite hesapları buradan beslensin.
- Sağlık, kan grubu, acil durum, kimlik, banka ve maaş alanları hassas veri sınıfında olsun; liste, arama, rapor ve dışa aktarmada varsayılan olarak maskelensin.
- Özel alanlar merkezi özel alan tanımından gelsin; alan tipi, zorunluluk, rol görünürlüğü ve sürüm korunmalıdır.
- Kaydetme sonucu personel detayı, özlük dosyası, onboarding kontrol listesi, kapasite takvimi ve varsa taslak zimmetler transaction içinde ilişkilendirilsin.

### 4.2 Personel formu kabul testleri

- Yetkisiz rol SGK/Maaş sekmesini ve değerlerini DOM, API, arama, rapor veya export üzerinden göremez.
- Aynı personel için çift tıklama/tekrar istek tek kayıt üretir.
- Zorunlu evrak eksikken personel taslak kaydolur ancak “Aktif” olamaz.
- Pasif departman yeni kayıtta seçilemez; mevcut geçmiş kayıtta okunabilir kalır.
- Personel kaydı başarısız olursa özlük/onboarding/zimmet alt kayıtlarının hiçbiri yarım oluşmaz.
- Aktif bir demirbaş ikinci personele atanamaz; taslak çakışması kullanıcıya açıkça gösterilir.

## 5. Proje ekleme sayfası revizyonu

Mevcut proje ekleme ekranını referans personel formundaki aynı kabuk ve form-grid düzeniyle yeniden oluştur. Proje kaydı aşağıdaki sekmeleri içersin:

1. **Kaynak & Proje Türü:** Sözleşmeli müşteri projesi, satış öncesi/P0, bakım/destek, iç proje veya AR-GE türü. Kaynak kayıt ve üretim kuralı açık olsun.
2. **Müşteri & Sözleşme:** Müşteri, kabul edilmiş teklif, aktif/imzalı sözleşme ve ilgili sözleşme sürümü. Seçimler birbirine göre filtrelensin.
3. **Kapsam & Modüller:** Amaç, kapsam içi/kapsam dışı, teslimatlar, modüller, varsayımlar, bağımlılıklar ve başarı kriterleri.
4. **Plan & Milestone:** Başlangıç/bitiş, proje takvimi, milestone’lar, bağımlılıklar, kabul koşulları, ödeme tetikleyicileri ve gerekirse sprint şablonu.
5. **Ekip & Roller:** Proje yöneticisi, teknik lider, ekip üyeleri, müşteri tarafı sorumluları, RACI/rol ve planlanan kapasite.
6. **Bütçe & Maliyet:** Para birimi, sözleşme bütçesi, iç maliyet bütçesi, hedef marj, fiyatlandırma modeli, tarihsel saat maliyeti politikası ve bütçe uyarıları.
7. **Dosyalar & İletişim:** Başlangıç belgeleri, klasör, kanal, toplantı ritmi, müşteri iletişim tercihleri ve erişim kapsamı.
8. **Kontrol & Oluştur:** Kaynak uygunluğu, eksik zorunlu veri, ekip kapasitesi, tarih çakışması, bütçe, oluşturulacak alt kayıtlar ve açık uyarıların özeti.

Sağ panel seçilen kaynak, müşteri/sözleşme, sözleşme toplamı, kabul edilen kapsam sürümü, şablon önizlemesi, kapasite uyarısı ve oluşturulacak milestone/sprint/görev/klasör/kanal kayıtlarını canlı göstermelidir.

### 5.1 Proje kaynak ve oluşturma kuralları

- Sözleşmeli proje yalnız aynı müşteriye ait, imzalı/aktif sözleşmeden oluşturulabilsin. UI filtresi yanında sunucu tarafı doğrulaması zorunludur.
- Satış öncesi çalışma müşteri projesi gibi faturalandırılmasın; `project_type=pre_sales` ve ayrı maliyet merkezi/limit kullansın.
- İç proje, bakım ve AR-GE için sözleşme zorunluluğu uygulanmasın; bunun yerine sponsor, bütçe sahibi ve proje türüne özel kurallar çalışsın.
- Kabul edilen teklif/sözleşme kapsamı proje baseline’ı olarak kopyalanmalı ve kaynak sürümü kilitli referans halinde saklanmalıdır.
- Proje şablonu; rol yerleri, milestone’lar, sprint yapısı, başlangıç görevleri, doküman klasörü, sohbet kanalı, toplantı ritmi ve rapor görünümünü üretebilsin.
- Proje oluşturma bir transaction olsun. Kritik alt kayıt başarısızsa proje “yarım aktif” kalmasın; tüm işlem geri alınsın veya açıkça “Kurulum Hatası” durumunda telafi kuyruğuna alınsın.
- Aynı sözleşme birden fazla projeye bölünebiliyorsa bütçe/kapsam paylaştırma zorunlu olsun ve toplam pay sözleşme limitini aşamasın.
- Proje kodu sunucu tarafından benzersiz üretilsin. Kaynağa dönüş bağlantısı sözleşme/teklif detayında da gösterilsin.

### 5.2 Proje yaşam döngüsü

`Plan → Başlatma Onayı → Aktif → Beklemede → Test/Kabul → Teslim → Kapanış → Tamamlandı`

Yan terminaller: `İptal Edildi`, kurallı biçimde `Arşivlendi`.

- “Aktif” için proje yöneticisi, baseline, başlangıç/bitiş, asgari ekip, müşteri/sponsor ve finansal kaynak doğrulanmalıdır.
- “Beklemede” için neden, sorumlu, planlanan dönüş tarihi ve SLA/takvim etkisi kaydedilmelidir.
- “Teslim” durumuna geçmek için açık kritik hata, başarısız zorunlu test veya onaysız değişiklik bulunmamalıdır; istisna yönetici gerekçesiyle kayıt altına alınmalıdır.
- Kapanış kontrol listesi: açık kritik görev/hata yok, son teslim kabul edilmiş, zaman çizelgeleri onaylı, finansal mutabakat yapılmış, dokümanlar arşivlenmiş, destek/bakım devri tamamlanmış.
- Tamamlanmamış proje arşivlenemez. İptal durumunda açık görev, rezervasyon, bütçe ve faturalama etkisi kontrollü kapatılmalıdır.

## 6. Ortak iş akışı ve onay altyapısı

### 6.1 Merkezî durum geçiş motoru

Her modül kendi içinde serbest `status` güncellemesi yapmamalıdır. Ortak bir transition service aşağıdaki sözleşmeyle çalışmalıdır:

- Kaynak durum ve hedef durum.
- Eylemi gerçekleştirebilecek roller/izinler.
- Zorunlu önkoşullar ve engelleyici kontroller.
- Zorunlu gerekçe, neden kodu, yorum, ek ve e-imza.
- Oluşacak domain olayları ve bağlı kayıtlar.
- SLA/takvim/bütçe/finans etkisi.
- Bildirim alıcıları.
- Geri alınabilirlik ve terminal durum bilgisi.

Geçişler yalnız `POST /entities/{id}/transitions` benzeri komut uç noktalarından yapılmalı; genel update endpoint’i durum alanını değiştirememelidir. Geçiş sonucu `transition_event` oluşturulmalı ve aynı istek kimliğiyle tekrar çalıştırıldığında ikinci kez yan etki üretmemelidir.

### 6.2 Ortak eylem penceresi

Onayla, Reddet, İade Et, Revizyon İste, İptal Et, Geri Çek, Devret ve Yeniden Aç eylemleri için tüm modüllerde ortak modal/drawer kullanılmalıdır. İçerik bağlama göre yapılandırılsın:

- Hedef eylem ve sonucu.
- Zorunlu neden kodu ve açıklama.
- Ek dosya/kanıt.
- Sonraki onaycı veya delege.
- Etkilenecek bağlı kayıtların özeti.
- Geri döndürülemeyen sonuç uyarısı.
- Onay sonrası tekil success state ve audit bağlantısı.

### 6.3 Sürümlenmiş onay motoru

Onay tanımı `Taslak → Yayında → Kullanımdan Kaldırıldı` olarak sürümlensin. Bir süreç başlatıldığında o sürüm örneğe sabitlensin; yönetici daha sonra şablonu değiştirse bile çalışan zincir değişmesin.

Onay motoru şunları desteklesin:

- Sıralı, paralel, çoğunluk, tümü ve tutar/risk/şirket/ürün türüne bağlı koşullu adımlar.
- Kullanıcı, rol, yönetici hiyerarşisi, proje rolü, departman ve dinamik alan tabanlı onaycı.
- Vekâlet, süre aşımı, hatırlatma ve eskalasyon.
- Kendi kendini onaylama ve aynı kişinin yinelenmesi için politika.
- Görevler ayrılığı ve çıkar çatışması kontrolü.
- Ret, iade, revizyon, iptal, geri çekme, yeniden gönderme ve sürüm farkı.
- Merkezi “Onay Kutum” ekranı ve modül detayından aynı olay geçmişi.

“Bekleyen onay sayısı” veya “mevcut adım” ayrı elle güncellenen sayaç olmasın; onay olaylarından türetilsin.

### 6.4 Yetki ve denetim

Rol bazlı yetkinin yanında tenant/şirket/şube/departman/proje/müşteri/satır ve alan kapsamı uygulanmalıdır. Liste, detay, arama, rapor, export, sohbet, bildirim ve entegrasyon aynı politika servisini kullanmalıdır. İzin değişiklikleri audit edilmeli ve rol regresyon testleri bulunmalıdır.

## 7. Satış ve CRM süreçleri

### 7.1 Lead ve müşteriye dönüşüm

- Lead detayındaki “Teklif Oluştur” eylemi liste sayfasına değil, lead bağlamıyla ön doldurulmuş teklif formuna gitmelidir.
- Müşteriye dönüştürme sihirbazı lead’in `Qualified/Won` durumunda olmasını ister; yönetici istisnası gerekçe ile uygulanabilir.
- Dönüşümden önce vergi no, unvan, e-posta, telefon ve alan adına göre mükerrer müşteri/kişi aranmalı; “mevcut müşteriye bağla”, “birleştir” veya yetkili istisna sunulmalıdır.
- Müşteri ve kişi oluşturma/bağlama; iletişim geçmişi, yönlendiren, kaynak, kampanya, sorumlu, notlar ve dosyaları korumalıdır.
- İstenirse sözleşme taslağı, ödeme planı taslağı ve proje taslağı aynı sihirbazdan üretilebilmelidir.
- Dönüşüm atomik ve idempotent olmalı; lead üzerinde hedef müşteri/kişi/proje bağlantıları görünmelidir.

### 7.2 Ön analiz

Durumlar:

`Taslak → Hazırlanıyor → Teknik İnceleme → Onay Bekliyor → Onaylandı`

Yan sonuçlar: `İade/Revizyon`, `Reddedildi`, `İptal Edildi`.

Teklif yalnız onaylı ön analizden veya yönetici tarafından gerekçeli bir istisnayla oluşturulabilsin. Ön analiz serbest metinden ibaret olmasın; hizmet/modül kalemleri, roller, efor, birim maliyet, bağımlılık, risk, varsayım, kapsam dışı ve kabul kriterleri yapılandırılmış olarak saklansın. Her revizyon yeni sürüm oluştursun; teklif hangi ön analiz sürümünden doğduğunu saklasın.

### 7.3 Teklif

Durumlar:

`Taslak → İç Onay → Onaylandı → Gönderildi → Müşteri İncelemesi → Müzakere/Revizyon → Kazanıldı`

Yan terminaller: `Kaybedildi`, `İptal Edildi`, `Süresi Doldu`.

Eylemler: Onaya gönder, onayla, reddet, iade et, iptal et, geri çek, müşteriye gönder, müşteri kabul/ret, revizyon oluştur.

- Yeni revizyon eski sürümü kilitlesin; fiyat, kapsam, süre ve koşul farkları karşılaştırılabilsin.
- Kabul edilen tek sürüm olsun. Geçerlilik tarihi dolan teklif otomatik “Süresi Doldu” adayına alınsın ve kullanıcı bilgilendirilsin.
- “Kazanıldı” eylemi müşteri, sözleşme taslağı, ödeme planı taslağı ve proje taslağı oluşturma/bağlama sihirbazını açsın.
- “Kaybedildi” için yapılandırılmış neden, rakip, fiyat/kapsam geri bildirimi zorunlu olsun; lead/fırsat ve açık takip işleri politika ile kapansın.

### 7.4 Müşteri ve kişi yönetimi

- Kişi formunda yalnız aktif müşteriler varsayılan gelsin; pasif müşteri için yetkili istisna gereksin.
- Müşteri birleştirme aracı ilişkileri, finansal kayıtları, proje geçmişini ve audit izini kaybetmeden ana kayda taşısın.
- Müşteri detayında birleşik aktivite zaman çizelgesi; teklifler, sözleşmeler, projeler, toplantılar, destek, faturalar, ödemeler ve belgeler görülsün.
- Müşteri sağlık skoru yapılandırılmış kurallardan üretilsin; geciken ödeme, açık kritik destek, proje sapması, yenileme ve memnuniyet sinyallerini açıklayabilsin.
- İletişim kanalı tercihi, izin/ret ve açık rıza sürümü tutulmalıdır.
- Müşteri portalı teklif/sözleşme/teslimat onayı, destek kaydı, doküman ve fatura görüntüleme kapsamlarıyla eklenmelidir.
- Toplantı veya iletişim kaydında ilgili varlık alanları bağlama göre filtrelenmeli; birbiriyle çelişen entity seçimleri aynı anda yapılamamalıdır.

## 8. Sözleşme, ödeme planı ve proje yürütme

### 8.1 Sözleşme

Sözleşme formu yalnız aynı müşteriye ait kabul edilmiş/kazanılmış teklifleri seçebilsin. Durumlar:

`Taslak → İç İnceleme → Müşteri İncelemesi → İmza → Aktif → Askıda → Yenileme/Zeyil → Tamamlandı`

Yan terminaller: `Feshedildi`, `İptal Edildi`.

- İmzalı belgenin hash’i, imzalayanlar, zaman, yöntem ve sağlayıcı kimliği saklansın; imzalı kopya değiştirilemesin.
- Kapsam, fiyat, tarih veya ödeme planı değişikliği eski belgeyi güncellemesin; zeyil/revizyon oluştursun.
- Aktivasyon için imza ve ödeme planı doğrulansın; sonrasında proje/hizmet/destek devir kayıtları oluşturulabilsin.
- Farklı müşteriye ait teklif veya ödeme planı bağlantısı hem UI hem API tarafından engellensin.

### 8.2 Ödeme planı

Ödeme planı için liste, yeni, düzenle, detay, revizyon ve onay ekranları ekle. Plan; sözleşme toplamı, yüzde/tutar, para birimi, vade, milestone/teslim tetikleyicisi, faturalama politikası, vergi ve tolerans içersin. Toplamlar sözleşme tutarıyla uyuşmadan aktifleşmesin. Tarih veya tutar değişikliği zeyil/onay gerektirsin. Oluşan faturalar plan kalemine geri bağlansın; aynı kalemden yinelenen fatura engellensin.

### 8.3 Milestone ve sprint

Milestone ve Sprint için ayrı liste, yeni, düzenle ve detay ekranları ekle.

Milestone alanları: sahip, planlanan/gerçek tarih, bağımlılıklar, teslimatlar, kabul kriterleri, müşteri kabulü, ödeme tetikleyicisi, risk ve bağlı görevler.

Sprint alanları: hedef, süre, ekip kapasitesi, backlog, committed işler, carry-over, demo, retrospektif, velocity ve release bağı. Sprint kapanırken tamamlanmamış işler açık seçimle havuza/sonraki sprinte taşınsın; geçmiş sprint değiştirilmesin.

### 8.4 Görev ve departman talebi

Kanonik görev akışı:

`Havuz → Atandı → Kabul Edildi → Devam Ediyor → Kontrol → Onay → Tamamlandı`

Ara durumlar: `Beklemede`, `Blokeli`, `Müşteri Bekleniyor`.

Revizyon, görevi yeni sürüm/yorumla “Devam Ediyor” durumuna döndürür. `İptal Edildi` terminaldir.

- Atanan kişi işi kabul/ret edebilsin; ret nedeni zorunlu ve atayana dönük olsun.
- Aynı anda tek aktif sorumlu kuralı veya açıkça çoklu sorumluluk modeli seçilsin; “önerilen” ve “gerçek” sorumlu ayrıştırılsın.
- Bağımlılık tamamlanmadan görev başlayamıyorsa geçiş engellensin; döngüsel bağımlılık reddedilsin.
- Checklist, süre tahmini, gerçekleşen süre, etiket, öncelik, SLA, müşteri/proje/milestone/sprint/test/bug/değişiklik bağları tutulmalıdır.
- Blokeli veya müşteri bekleniyor durumunda takvim/SLA duraklatma politikası uygulanmalı ve sebep/aralık saklanmalıdır.

Departman talebi akışı:

`Taslak → Gönderildi → İnceleme → Ek Bilgi/Revizyon → Kabul/Reddedildi/İptal → Göreve Dönüştürüldü`

Kabul edilen talep otomatik ve idempotent biçimde görev oluşturmalı, alanları taşımalı ve karşılıklı bağlantı kurmalıdır. Talep ile görev durumu iki ayrı elle güncellenen gerçeklik olmamalıdır; görev sonucu talep özetini olayla güncellesin.

## 9. Kalite, değişiklik, teslimat ve destek

### 9.1 Test yönetimi

Test Planı, Test Senaryosu, Test Adımı, Test Çalıştırması, Sonuç, Kanıt, Hata, Yeniden Test, Sürüm/Build ve Ortam varlıklarını ekle. Test senaryosu ön koşul, adımlar, beklenen sonuç, veri seti, önem ve otomasyon durumunu içersin. Sonuç `Passed/Failed/Blocked/Not Run` olsun. Failed sonuçtan hata oluşturulduğunda kaynak test, build, ortam ve kanıt otomatik bağlansın.

### 9.2 Hata yönetimi

Durumlar:

`Yeni → Triage → Atandı → Devam Ediyor → Düzeltildi → Yeniden Test → Kapandı`

Yan sonuçlar: `Yeniden Açıldı`, `Reddedildi`, `Mükerrer`.

Yapılandırılmış yeniden üretme adımları, beklenen/gerçek sonuç, ortam, build, cihaz/tarayıcı, önem, öncelik, kök neden, düzeltme sürümü ve kanıt zorunlulukları olsun. Hata test, destek, görev, sprint, release ve deployment ile bağlanabilsin.

### 9.3 Değişiklik talebi

Eksik create/edit/detail sayfalarını ekle. Akış:

`Taslak → Etki Analizi → İç Onay → Müşteri Onayı → Ticari Onay → Onaylandı → Uygulama → Teslim → Kapandı`

Yan sonuçlar: `Reddedildi`, `İptal Edildi`.

- Etki analizi kapsam, efor, maliyet, takvim, risk, test, sözleşme ve bakım etkisini içersin.
- Kapsam dışı değişiklik kabul edilirse teklif/zeyil ve ödeme planı revizyonu oluşturulsun.
- Gerekli onaylar tamamlanmadan uygulama görevleri “başlatılamaz” olsun.
- Onay sonrası proje baseline, bütçe ve tarihçe yeni sürümle güncellensin; eski değerler korunmalıdır.

### 9.4 Teslimat ve müşteri kabulü

Eksik teslimat create/edit/detail ve kabul ekranlarını ekle. Akış:

`Taslak → İç Kontrol → Müşteriye Gönderildi → Kabul/Kısmi Kabul/Ret → Revizyon → Kapandı`

Yan eylem: `Geri Çekildi`.

Teslim kalemleri ayrı ayrı kabul/ret edilebilsin. Kabul eden kişi, tarih, yorum, imza/e-posta/portal kanıtı ve kabul edilen sürüm saklansın. Kısmi kabul, yalnız kabul edilen kalemler için politika izin veriyorsa milestone/fatura tetiklesin. Ret/revizyon görev ve hataları oluşturabilsin.

### 9.5 Destek ve bakım

Destek akışı:

`Yeni → Triage → Atandı/Devam Ediyor → Çözüldü → Müşteri Onayı → Kapandı`

Bekleme durumları: `Müşteri Bekleniyor`, `Üçüncü Taraf Bekleniyor`; kapanan kayıt yetkili ve gerekçeli biçimde yeniden açılabilsin.

- SLA mesai takvimi, resmi tatil, saat dilimi, 7/24 veya iş saati, öncelik, yanıt/çözüm hedefi, bekleme aralıkları ve yeniden açmayı hesaba katsın.
- “Müşteri bekleniyor” yalnız politika izin veriyorsa SLA’yı durdursun; başlangıç/bitiş aralığı saklansın.
- Bakım hakkı yalnız onaylı/faturalandırılabilir kullanımdan düşsün. Kategori, paket kapsamı, aşım onayı, negatif bakiye politikası ve yenileme tarihi tanımlansın.
- Makale/SSS bilgi bankası, hazır yanıtlar, müşteri portalı, e-posta yanıt zinciri, ekler, CSAT ve eskalasyon eklenmelidir.
- Incident, problem ve change kavramları ayrıştırılmalı; büyük olayda etkilenen müşteriler ve postmortem tutulmalıdır.

## 10. Satın alma, tedarikçi, fatura ve tahsilat

### 10.1 Satın alma talebi ve onay

Form kaydı varsayılan olarak `Taslak` oluşturmalı; ayrıca “Onaya Gönder” eylemi bulunmalıdır. Talep taslakta düzenlenebilir, gönderildikten sonra kilitli olmalı; geri çekme veya revizyonla yeni sürüme dönmelidir.

Akış:

`Taslak → Onaya Gönderildi → İnceleme → Onaylandı → RFQ/Satın Alma → Sipariş → Kısmi/Tam Teslim → Kapandı`

Yan sonuçlar: `İade`, `Reddedildi`, `İptal Edildi`.

Tutar, kategori, proje, aciliyet ve bütçeye göre onay zinciri seçilsin. Aynı onaycı yinelenmesin; kendi kendini onaylama/SoD politikası çalışsın. Ret/iade/iptal nedeni ve yeniden gönderimde sürüm farkı zorunlu olsun.

### 10.2 RFQ ve tedarikçi değerlendirmesi

RFQ → Tedarikçi Teklifleri → Teknik Değerlendirme → Ticari Değerlendirme → Seçim → Onay → Satın Alma Siparişi zinciri kurulsun. Para birimi, vergi, navlun, ödeme/teslim koşulu ve geçerlilik normalize edilerek karşılaştırılsın. Seçilmeyen en düşük fiyat için gerekçe istenebilsin.

Tedarikçi onboarding: şirket/vergi/KYB, banka, belgeler, risk, kara liste, sözleşme, kategori, performans, değerlendirme ve portal daveti. Banka bilgisi değişikliği çift kontrol ve audit gerektirsin.

### 10.3 Sipariş, kabul ve üçlü eşleştirme

Satın alma siparişi yalnız onaylı talep ve seçilmiş tedarikçi teklifinden doğsun. Kısmi teslim, backorder, ret, iade ve mal/hizmet kabulü satır bazında tutulmalıdır. Tedarikçi faturası `PO – Kabul – Fatura` üçlü eşleştirmesinden geçmeden ödeme onayına gidemesin; toleranslar politika ile tanımlansın.

Teslim kategorisi aşağıdaki alt kaydı oluşturabilsin:

| Kategori | Otomatik/önerilen hedef kayıt |
|---|---|
| Ekipman/demirbaş | Demirbaş taslağı, seri no ve kabul bilgisi |
| Araç | Filo kaydı ve belge/servis planı |
| Yazılım lisansı/abonelik | Lisans/abonelik kaydı, kullanıcı/koltuk ve yenileme |
| Sarf malzemesi | Stok hareketi |
| Hizmet | Hizmet kabulü ve proje/gider dağıtımı |

### 10.4 Fatura ve tahsilat

Fatura; seri/sıra, e-belge UUID, müşteri, sözleşme, proje, ödeme planı, kalemler, vergi, para birimi, kur, sorumlu ve açıklama içersin.

Durumlar:

`Taslak → Onaylandı → Gönderildi/e-Fatura Gönderildi → Kabul/Ret → Kısmi Ödendi → Ödendi`

Süreçsel durum: `Vadesi Geçti`. Yan işlemler: `İptal`, `İade`, `Alacak/Borç Dekontu`.

Tahsilat/ödeme formu; yöntem, banka/kasa hesabı, dekont, işlem tarihi, valör, para birimi/kur, müşteri/tedarikçi, çoklu fatura tahsisi, fazla/eksik ödeme, iade ve chargeback içersin. Başarılı ödeme hareketi kanonik kaynaktır; faturanın ödenme durumu tahsis toplamından türetilir. Kullanıcı faturayı ayrıca “ödendi” diye işaretleyememelidir.

Bankadan gelen aynı hareket referansı ikinci kez işlenmemeli; mutabakat durumu, eşleştiren kişi ve tarih saklanmalıdır.

### 10.5 Proje maliyeti ve ERP sınırı

Proje maliyeti tek hizmetten hesaplanmalıdır:

**Onaylı zaman × ilgili tarihte geçerli maliyet oranı + projeye dağıtılmış satın alma/gider/tedarikçi hizmeti + isteğe bağlı amortisman/altyapı payı**

Bugünkü personel maliyetini geçmiş zamanlara uygulama. Oran anlık görüntüsü veya geçerlilik aralığı kullan. Dashboard, proje detayı, rapor ve export aynı hesaplama hizmetini çağırmalıdır.

Tam ERP kapsamı hedefleniyorsa ayrıca tedarikçi faturaları/borç hesapları, masraf defteri, banka/kasa, kur değerleme, e-Fatura/e-Arşiv, muhasebe fişi, vergi ve mutabakat eklenmelidir. Bunlar yoksa pazarlama metinlerinde tam ERP iddiası kullanılmamalıdır.

## 11. İnsan kaynakları, zaman, kapasite ve varlıklar

### 11.1 İzin

İzin talep eden kullanıcı onaycı, son durum veya ret alanını seçemez. Onaycı organizasyon ve izin politikasından türetilmelidir. İş günü, resmi tatil, yarım gün, saatlik izin, bakiye rezervasyonu, onayda düşüm, ret/iptalde iade, çakışma, ekip kapasitesi, vekil ve iptal sonrası geri yükleme doğru hesaplanmalıdır. Negatif bakiye yalnız izinli politika ve ek onayla mümkün olsun.

### 11.2 Zaman çizelgesi ve kapasite

Zaman çizelgesi satır bazında onay/ret/iade edilebilsin. Onaylı dönem kilitlensin; yeniden açma yetkili ve auditli olsun. Fazla mesai, faturalandırılabilirlik, proje/görev, açıklama, oran snapshot’ı ve müşteri onayı politikası bulunsun.

Kapasite; çalışma takvimi, tatil, izin, haftalık kapasite, proje tahsisi, destek nöbeti, yetkinlik ve tarih aralığından hesaplanmalıdır. Personel, proje ve portföy görünümü aynı kapasite hizmetini kullanmalıdır.

### 11.3 Onboarding/offboarding

Şablon tabanlı checklist, bağımlılık, sorumlu, SLA, hesap/kimlik sağlama, eğitim, belge, ekipman ve erişim adımları kurulsun. Offboarding; hesap kapatma, erişim iptali, zimmet iadesi, belge/iş devri, müşteri/proje sorumluluğu transferi ve son kontrol olmadan tamamlanmasın.

### 11.4 Demirbaş, lisans ve filo

- Bir demirbaş için aynı anda en fazla bir aktif zimmet olsun; veritabanı kısıtı ve transaction kilidi kullanılsın.
- Teslim alan kabul/ret veya e-imza yapabilsin. İadede durum muayenesi, hasar/kayıp, fotoğraf, bakım, transfer ve hurda süreçleri bulunsun.
- Yazılım lisansı/abonelik; sağlayıcı, ürün, koltuk, kullanıcı, anahtar/secret referansı, başlangıç, yenileme, maliyet, proje/gider dağıtımı ve iptal bildirim süresini içersin.
- Filo detayında bakım, muayene, sigorta, yakıt, gider, ceza, belge, sürücü ataması, kaza ve kilometre alt sayfaları olmalıdır.

## 12. Doküman, toplantı, sohbet ve otomasyon

### 12.1 Doküman yönetimi

Dokümanlar `entity_type + entity_id + document_type` ile ilişkilendirilsin. Sürüm, onay, imza, sınıflandırma, saklama süresi, son geçerlilik, hukuki bekletme, virüs tarama, OCR/metin arama ve arşiv metadata’sı bulunsun. İmzalı veya kabul edilmiş sürüm değiştirilemesin; yeni sürüm oluşturulsun. Dosya erişimi bağlı kaydın alan/satır yetkisini aşamasın.

### 12.2 Toplantı ve kararlar

Davet/RSVP, dış katılımcı, yinelenme, gündem, not/tutanak onayı, karar, karar sahibi ve son tarih ekle. Karar veya aksiyon görev oluşturabilsin; görev tamamlanınca toplantı aksiyonu olayla güncellensin. Yinelenen toplantılar seri + örnek modeliyle çalışsın; saat dilimi ve çakışma kontrolü olsun.

### 12.3 Sohbet

Mesajdan görev/hata oluşturulduğunda kaynak mesaj bağlantısı saklansın. Kanal üyeliği proje/müşteri/ekip kapsamına göre yönetilsin. Dosya erişimi, mention, bildirim, kanal arşivi, saklama/eDiscovery ve silinen mesaj audit politikası eklenmelidir.

### 12.4 Otomasyon

Otomasyon modülüne “Yeni Kural”, detay, düzenle, taslak/yayında sürümü, koşul oluşturucu, eylem sırası, test/simülasyon, çalıştırma geçmişi, hata, retry ve dead-letter kuyruğu ekle. Kural idempotent olmalı; aynı olayın ikinci kez yan etki üretmesi engellenmelidir. Otomasyon bir kullanıcının yetkisini aşmamalı; sistem hesabı yetkileri açıkça tanımlanmalıdır.

## 13. Entegrasyon mimarisi

Entegrasyon liste kartları tek başına yeterli değildir. Her entegrasyon için detay/ayar sayfası ve aşağıdaki ortak altyapıyı oluştur:

- OAuth veya credential vault; secret değerleri istemciye/loga dönme.
- Alan/kimlik eşleme ve kaynak gerçekliği seçimi.
- İlk senkronizasyon, artımlı senkronizasyon, zamanlama ve manuel çalıştırma.
- Sync job/run log, satır bazlı sonuç ve özet metrikler.
- Hata kuyruğu, sınıflandırma, retry, replay, dead-letter ve kullanıcıya çözüm önerisi.
- Webhook imza doğrulama, tekrar saldırısı/zaman damgası ve idempotency.
- API anahtarı, scope, rate limit, sona erme, rotasyon ve audit.
- Sağlık, son başarı, son hata, gecikme ve devre kesici durumu.

GitHub/GitLab entegrasyonunda repository, branch, commit, pull/merge request, issue, pipeline, deployment ve release proje–görev–hata–sürümle bağlanabilsin. Muhasebe entegrasyonunda her alan için kaynak sistem, çift yön/tek yön kuralı, idempotent belge kimliği ve mutabakat tanımlansın. Takvim entegrasyonunda saat dilimi, yinelenme, iptal ve çakışma desteklensin.

P0 olarak bir **Entegrasyon Hata Kuyruğu** sayfası ekle. Kullanıcı hatayı, etkilenen kaydı, deneme sayısını, son mesajı, güvenli payload özetini, önerilen çözümü ve tekrar çalıştırma sonucunu görebilsin.

## 14. Tek tip raporlama sayfası standardı

Tüm mevcut ve yeni raporları tek bir yeniden kullanılabilir `ReportLayout`/`ReportShell` bileşeni ve rapor kayıt şeması üzerinden çalıştır. Her rapor için ayrı hizalama, filtre, buton veya export yaklaşımı geliştirme. Raporun alanları ve metrikleri değişebilir; sayfa anatomisi, etkileşim, biçimlendirme ve çıktı standardı aynı kalmalıdır.

### 14.1 Rapor sayfası anatomisi

1. Breadcrumb.
2. Eyebrow: “Raporlama”.
3. Açık rapor başlığı ve tek cümlelik kullanım amacı.
4. Veri güncellik zamanı, veri kapsamı ve rapor sahibi/formül sürümü.
5. Üst eylem çubuğu: kayıtlı görünüm, filtre, sütun, karşılaştır, yenile, dışa aktar ve yazdır.
6. Ortak filtre alanı: tarih aralığı, şirket/şube, müşteri, proje, departman, durum, sorumlu, para birimi ve rapora özel boyutlar.
7. İhtiyaca göre 3–6 KPI kartı. Her KPI için ad, değer, dönem karşılaştırması ve “Nasıl hesaplandı?” açıklaması.
8. Gerçek karar değeri varsa grafik alanı. Sırf görsel olsun diye grafik ekleme.
9. Ayrıntı tablosu: sabit başlık, sayfalama, sıralama, kolon seçimi, hızlı arama, drill-down ve satır detayına bağlantı.
10. Metodoloji/formül paneli: kaynak tablolar, filtre mantığı, para birimi/vergi, hariç tutulan kayıtlar ve formül sürümü.
11. Alt bilgi: uygulanan filtreler, oluşturan kullanıcı, üretim zamanı, gizlilik sınıfı ve PDF’de sayfa X/Y.

### 14.2 Hizalama ve format kuralları

| Veri tipi | Hizalama | Görünüm kuralı |
|---|---|---|
| Metin/açıklama | Sol | Uzun metin kontrollü kısaltma + tam metin erişimi |
| Ad/kod/kimlik | Sol, mümkünse sabit ilk kolon | Detaya tıklanabilir, kopyalanabilir |
| Sayı/yüzde | Sağ | Ortak ondalık ve binlik ayırıcı politikası |
| Para | Sağ | Tutar + ISO para birimi; kur kaynağı açıklanır |
| Tarih/saat | Orta | Yerel gösterim, saat dilimi belirtilir |
| Durum/etiket | Orta | Ortak durum rozeti ve erişilebilir metin |
| Eylemler | Sağ, sabit son kolon | Yetkiye göre gösterilir |

Geniş tabloda ilk kimlik kolonları ve son eylem kolonu sabitlenebilsin; yatay kaydırma başlıkla senkron çalışsın. Satır yüksekliği, boşluk, başlık, filtre etiketi ve durum rozeti tüm raporlarda aynı olsun. Mobilde kritik kolonlar kart görünümüne dönüşsün; veri anlamı kaybolmasın.

### 14.3 Filtre, kayıtlı görünüm ve drill-down

- Filtreler URL/query state ile paylaşılabilir ve geri/ileri gezinmeyle korunabilir olsun.
- Kullanıcı kişisel görünüm; yetkili kullanıcı ekip görünümü kaydedebilsin. Görünüm filtre, kolon, sıralama, gruplayıcı ve grafik seçimini saklasın.
- Rapor toplamından detay satırlarına ve kaynak kayda drill-down yapılabilsin; drill-down aynı güvenlik kapsamını korusun.
- Boş, yükleniyor, kısmi veri, güncel değil ve hata durumları standart bileşenlerle açıkça gösterilsin.
- Para birimleri kuralsız toplanmasın. Tek para birimine çevriliyorsa kur tarihi/kaynağı ve orijinal değer korunmalıdır.

### 14.4 Çıktı alma ve yazdırma

Her rapor yetkiye göre **PDF, XLSX/Excel, CSV ve Yazdır** seçeneklerini desteklesin.

- Export, ekranda aktif filtre, kolon, sıralama, kapsam ve formül sürümünü taşısın. “Tüm veri” ayrı izin ve açık seçim gerektirsin.
- Büyük export arka plan job olarak çalışsın; tamamlanınca kullanıcıya bildirim gelsin. Dosya süreli ve yetkili bağlantıyla indirilsin.
- PDF, kolon sayısına göre A4 dikey/yatay seçsin; başlık ve filtre özeti, tekrarlanan tablo başlığı, sayfa numarası, üretim zamanı ve gizlilik filigranı içersin. Kolonlar kesilmesin; okunamayacak kadar küçültülmesin.
- XLSX sayısal/tarih hücrelerini metne çevirmesin; filtreli başlık, dondurulmuş satır ve ayrı “Rapor Bilgisi” sayfası bulunsun.
- CSV UTF-8 ve yerel uygulamalarla uyumlu olsun; formül enjeksiyonuna karşı tehlikeli ilk karakterler güvenli biçimde ele alınsın.
- Yazdırma CSS’i navigasyon ve gereksiz butonları saklasın, sayfa kırılmalarını ve başlık tekrarını yönetsin.
- Export girişimleri auditlensin; hassas raporda kullanıcı/tenant filigranı ve indirme süresi uygulanabilsin.

### 14.5 Rapor kayıt şeması ve hesaplama

Her rapor registry kaydı en az şu metadata’yı içersin:

`report_id`, `title`, `description`, `category`, `permissions`, `default_filters`, `available_dimensions`, `measures`, `drilldowns`, `export_types`, `freshness_policy`, `formula_version`, `data_classification`.

Mevcut bütün raporları bu registry’ye geçir. Aynı metriği farklı raporlarda yeniden hesaplayan kopya sorguları kaldır. Rapor sorgusu ve export, satır/alan yetkisini sunucuda uygulasın. Kişisel notlar hiçbir kurumsal rapora veya genel exporta dahil edilmemelidir.

### 14.6 Rapor kabul testleri

- Aynı filtre/sıralama/kolonla ekran, PDF, XLSX ve CSV aynı kayıt kümesini ve toplamları verir.
- Kullanıcı ekranda göremediği satır veya alanı exporttan alamaz.
- PDF’de başlık ve kolonlar kesilmez; çok sayfalı tabloda kolon başlığı tekrar eder ve sayfa numarası görünür.
- Para, yüzde, tarih ve durum hizalaması tüm raporlarda aynıdır.
- Formül sürümü değişirse eski zamanlanmış/oluşturulmuş çıktının metadata’sında kullandığı sürüm kalır.
- 100 bin+ satırlı export kullanıcı isteğini kilitlemeden arka planda tamamlanır ve tek yetkili dosya üretir.

## 15. Kullanıcıya özel “Notlarım” sayfası

Her kullanıcı için ana menüde veya “Çalışma Alanım” altında **Notlarım** sayfası oluştur. Sayfanın amacı, kullanıcının yalnız kendisinin görebildiği kişisel notları ve tiklenebilir yapılacakları yönetmesidir. Bu içerikler şirket görevleri, müşteri notları, yönetici raporları veya genel aramayla karıştırılmamalıdır.

Sayfa başlığı standardı:

- Breadcrumb: `Çalışma Alanım > Notlarım`
- Eyebrow: `Kişisel Çalışma Alanı`
- H1: `Notlarım`
- Alt açıklama: `Yalnızca sizin görebildiğiniz kişisel notlar ve yapılacaklar.`

### 15.1 Liste ve kullanım deneyimi

- Görünümler: Tümü, Açık, Bugün, Yaklaşan, Tamamlanan, Arşiv.
- Arama, etiket, kategori, öncelik, tarih ve sıralama.
- Liste/kart görünümünde başlık, kısa içerik, son tarih, etiket, öncelik ve tamamlanma durumu.
- Notun veya checklist maddesinin yanındaki checkbox ile hızlı tamamlama; tamamlanan kayıt için `completed_at`.
- Tamamlamayı geri alma, sabitleme, arşivleme, yumuşak silme ve kısa süreli geri al.
- Boş durum, yaklaşan/geciken not uyarısı ve yalnız sahibine özel hatırlatma.
- Klavye ile hızlı yeni not, kaydetme ve checkbox yönetimi; görünür odak ve erişilebilir etiketler.

### 15.2 Yeni not/düzenleme formu

Referans personel formuyla aynı page-head, form-grid, ana kart, yan panel ve form-foot kullanılsın. Bilgi yoğunluğu düşükse sekme zorunlu değildir; aşağıdaki bölümler aynı kart içinde `fg-section` olarak gösterilebilir:

1. **Not:** Başlık ve zengin olmayan güvenli metin/açıklama.
2. **Kontrol Listesi:** Sıralanabilir, eklenebilir, silinebilir ve ayrı ayrı tiklenebilir maddeler.
3. **Plan:** Son tarih/saat, hatırlatma, öncelik, etiket/kategori ve sabitleme.
4. **Özet:** Görünürlük açıklaması, açık/tamamlanan madde sayısı ve kayıt durumu.

Birincil eylem “Notu Kaydet”, ikincil eylem “Vazgeç” olsun. Taslak otomatik kaydetme uygulanırsa yerel kopya sızıntısına karşı güvenli tasarlanmalı ve kaydetme durumu görünmelidir.

### 15.3 Veri modeli

`personal_notes`:

- `id`
- `tenant_id`
- `owner_user_id` — istemciden alınmaz, oturumdan atanır ve değiştirilemez
- `title`
- `body` veya tercihen `body_ciphertext`
- `status` — `open`, `done`, `archived`
- `priority`
- `category`, `color`, `is_pinned`
- `due_at`, `reminder_at`
- `sort_order`
- `created_at`, `updated_at`, `completed_at`, `archived_at`, `deleted_at`

`personal_note_checklist_items`:

- `id`, `note_id`, `owner_user_id`
- `text` veya `text_ciphertext`
- `is_checked`, `checked_at`, `sort_order`
- `created_at`, `updated_at`, `deleted_at`

Etiketler ayrı tabloyla veya güvenli normalize edilmiş yapı ile tutulabilir. Not ve checklist durumları transaction içinde güncellenmeli; son checkbox işaretlenince notun otomatik tamamlanması kullanıcı ayarı/politikası olmalıdır.

### 15.4 Kesin gizlilik ve yetki kuralları

- Her okuma, arama, oluşturma, güncelleme, silme ve hatırlatma sorgusu sunucuda `owner_user_id = session.user_id` kapsamı uygular.
- `owner_user_id` request body’den kabul edilmez. Oluştururken oturumdan atanır; sonradan devredilemez.
- Başka kullanıcıya ait ID ile read/update/delete isteği veri varlığını ifşa etmeyecek şekilde `404` döndürür.
- Yönetici, ekip lideri, İK, müşteri, superadmin veya rapor rolü uygulama üzerinden not içeriğini okuyamaz. Yalnız sahibin erişimi vardır.
- Not başlığı/gövdesi şirket genel araması, rapor, export, yönetici paneli, sohbet, AI özetleme, aktivite akışı ve audit payload’ına girmez.
- Audit yalnız olay metadata’sını tutabilir: kayıt kimliği, eylem, zaman ve sahibin kendi kimliği. Not içeriği veya checklist metni audit loga yazılmaz.
- Bildirim ve hatırlatma yalnız sahibine gider; e-posta/push önizlemesi kullanıcı tercihine göre gövdeyi gizleyebilmelidir.
- Uygulama logları, hata izleme, analytics ve telemetry not metnini yakalamamalıdır.
- İçerik dinlenirken ve aktarımda şifrelenmeli; mümkünse alan düzeyinde tenant/kullanıcı anahtarlı şifreleme uygulanmalıdır.
- Yedekleme ve saklama politikası bulunmalı; silinen notların geri alma süresi kullanıcıya açık gösterilmelidir.

Notu kurumsal göreve dönüştürme varsayılan olarak eklenmesin. İleride eklenirse kullanıcıya “kişisel içerik kurumsal kayda kopyalanacak ve görev yetkilileri görebilecek” uyarısı gösterilmeli, açık onay alınmalı ve kaynak kişisel not bağlantısı diğer kullanıcılara ifşa edilmemelidir.

### 15.5 Notlarım kabul testleri

- A kullanıcısının not ID’sini bilen B kullanıcısı listede, detayda, aramada, API’de, exportta ve bildirimde içeriği göremez.
- Superadmin rolü standart uygulama/API yoluyla not gövdesini okuyamaz.
- Request body’de farklı `owner_user_id` gönderilse bile kayıt oturum sahibine atanır veya istek reddedilir.
- Checkbox işaretlenince `checked_at`, not tamamlanınca `completed_at` yazılır; geri alınca tutarlı biçimde temizlenir/geçmiş olayı oluşur.
- Kişisel not metni audit, hata logu, analytics ve genel arama indeksinde yer almaz.
- Hatırlatma yalnız sahibine bir kez gider; retry yinelenen bildirim üretmez.

## 16. Eksik sayfa ve özellik envanteri

### P0 — canlıya çıkıştan önce

- Ortak workflow eylem modalı/drawer’ı.
- Merkezî durum geçiş motoru ve sürümlenmiş onay motoru.
- Veri Kalitesi & Sistem Sağlığı sayfası.
- Entegrasyon hata kuyruğu/replay ekranı.
- Satır/alan/rapor/export yetki uygulaması ve regresyon testleri.
- Finansal kanonik kaynak: ödeme tahsisi, fatura durumu ve proje maliyeti.
- İş takvimi/SLA motoru.
- Kişisel Notlarım gizlilik modelinin negatif yetki testleri.

### P1 — ana süreci eksiksiz yapmak için

- Milestone CRUD/detail.
- Sprint CRUD/detail.
- Test planı, senaryo, çalıştırma ve sonuç.
- Değişiklik talebi create/edit/detail/approval.
- Teslimat create ve müşteri kabul ekranı.
- Tahsilat/ödeme formu ve dağıtım ekranı.
- Ödeme planı CRUD/detail/revision.
- Tedarikçi faturası/borç hesapları.
- RFQ ve teknik/ticari değerlendirme.
- Release/deployment yönetimi.
- Bilgi bankası.
- Müşteri portalı.
- Otomasyon kural editörü ve çalışma geçmişi.
- Entegrasyon detay/ayar/senkronizasyon logları.
- Personel onboarding/offboarding ve zimmet kabulü.
- Tek tip ReportLayout ve tüm raporların migrasyonu.
- Notlarım liste/yeni/düzenle/hatırlatma ekranları.

### P2 — ürünleşme ve ileri ölçek

- Ürün/hizmet kataloğu ve fiyatlandırma kuralları.
- Lisans/abonelik yönetimi.
- Tedarikçi portalı.
- API anahtarı ve webhook yönetimi.
- Zamanlanmış rapor dağıtımı ve ekip kayıtlı görünümleri.
- Gelişmiş müşteri sağlık skoru, tahminleme ve kapasite senaryosu.

## 17. Veri Kalitesi ve Sistem Sağlığı

P0 olarak ayrı bir yönetim sayfası oluştur. En az aşağıdaki kontrolleri zamanlanmış ve talep üzerine çalıştır:

- Kaynaksız/yetim bağlı kayıtlar.
- Mükerrer müşteri, kişi, fatura, ödeme, proje veya entegrasyon olayı.
- Uyuşmayan müşteri–teklif–sözleşme–proje bağları.
- Durum ile olay geçmişinin uyuşmaması.
- Elle tutulmuş veya mükerrer onay sayacı.
- Başarısız/uzun süren entegrasyon ve dead-letter kayıtları.
- Eksik zorunlu ilişki, imza, belge, kabul veya ödeme tahsisi.
- Süresi dolmuş fakat aktif görünen sözleşme/lisans/belge.
- Birden fazla aktif zimmet veya çakışan kapasite/tarih.
- Güncelliğini yitirmiş rol/izin önbelleği.

Her bulgu önem, etkilenen kayıt, tespit kuralı, ilk/son görülme, otomatik düzeltilebilirlik, sorumlu, durum ve çözüm auditini içersin. Otomatik düzeltme geri alınabilir ve yetkili olmalıdır.

## 18. Arşivleme ve silme modeli

Ortak alanlar: `archived_at`, `archived_by`, `archive_reason`, `retention_until`, `legal_hold`, `deleted_at`. Geri yüklemede benzersiz anahtar ve aktif bağ çakışması kontrol edilsin. Ana kaydın arşivlenmesinde bağlı kayıtlar körlemesine silinmesin; entity türüne göre engelle, bağı koparma, yalnız görünümden çıkarma veya birlikte arşivleme politikası tanımlansın. Finansal, imzalı, kabul edilmiş ve audit kayıtları hard delete ile silinmesin.

## 19. Uygulama mimarisi ve teknik teslimatlar

Önce mevcut teknoloji yığınını tespit et ve onun içinde kal. Yeni framework veya durum yönetimi kütüphanesi yalnız açık gerekçe ve migrasyon planıyla eklenebilir. Uygulama aşağıdaki servis sınırlarını sağlamalıdır:

- `TransitionService`
- `ApprovalService`
- `Relationship/EventService`
- `AuthorizationPolicyService`
- `AuditService`
- `BusinessCalendar/SLAService`
- `FinanceCalculationService`
- `ReportRegistry/ExportService`
- `IntegrationJob/ErrorQueueService`
- `DataQualityService`
- `PersonalNotesService`

Veritabanı migration’ları ileri ve mümkünse geri dönüş planıyla hazırlanmalıdır. Yabancı anahtar, benzersiz/partial index, optimistic locking/version ve transaction sınırları tanımlanmalıdır. Kuyruk işleri retry + idempotency + dead-letter kullanmalıdır.

### 19.1 API ve olay gereksinimleri

- Liste endpoint’leri sunucu tarafı filtre, sıralama, cursor/page ve satır kapsamı uygulasın.
- Create/update komutları validation hatalarını alan + hata kodu + kullanıcı mesajı olarak dönsün.
- Durum değiştirme genel update yerine transition endpoint’iyle yapılsın.
- Dönüşüm endpoint’leri hedef kayıt kimliklerini dönsün.
- Domain olayları outbox deseniyle transaction’a bağlansın; entegrasyon başarısızlığı ana kaydı tutarsız bırakmasın.
- Webhook ve queue tüketicileri idempotent olsun.
- Hassas alanlar response serialization aşamasında role göre maskelensin veya tamamen çıkarılsın.
- Kişisel not endpoint’leri ayrı namespace ve kesin owner scope kullansın.

### 19.2 Test katmanları

1. Domain unit testleri: durum geçişi, onay, bakiye, SLA, maliyet ve kaynak uygunluğu.
2. API entegrasyon testleri: transaction, idempotency, concurrency, yetki ve hata sözleşmesi.
3. E2E akışları: lead’den müşteri/proje; satın almadan kabul/fatura; projeden teslim/fatura/destek.
4. Görsel/regresyon: referans form anatomisi, responsive kırılımlar ve ortak rapor hizalaması.
5. Güvenlik negatif testleri: satır/alan/export/kişisel not izolasyonu, IDOR, secret/log sızıntısı.
6. Yük testleri: rapor sorgusu, büyük export, entegrasyon kuyruğu ve toplu bildirim.

## 20. Uçtan uca zorunlu kabul senaryoları

### Senaryo A — satıştan projeye

1. Lead oluştur ve ön analiz başlat.
2. Teknik/ticari onay tamamlanmadan teklif oluşturmayı engelle.
3. Onaylı ön analizden teklif revizyonu üret ve müşteri kabulünü kaydet.
4. Lead dönüşümünde mükerrer müşteriyi tespit et ve mevcut kayda bağla.
5. Kazanılan tekliften aynı müşteriye ait sözleşme ve ödeme planı taslağı oluştur.
6. İmza + ödeme planı kontrolünden sonra sözleşmeyi aktive et.
7. Referans form standardındaki Proje Sihirbazı ile proje ve alt kayıtları oluştur.
8. Aynı dönüşüm komutunu tekrar çalıştır; yinelenen kayıt oluşmadığını doğrula.

### Senaryo B — proje, kalite ve teslim

1. Milestone, sprint ve görevleri şablondan üret.
2. Görevi atama–kabul–çalışma–kontrol–onay akışından geçir.
3. Başarısız testten hata oluştur, düzelt ve yeniden test et.
4. Kapsam dışı değişiklik için etki analizi, müşteri/ticari onay ve zeyil oluştur.
5. Kritik hata açıkken teslimi engelle.
6. Kısmi müşteri kabulünde yalnız kabul edilen kalem için izinli fatura tetikleyicisini çalıştır.
7. Proje kapanış kontrol listesi tamamlanmadan projeyi tamamlamayı engelle.

### Senaryo C — satın alma ve finans

1. Satın alma talebini taslak kaydet; ayrıca onaya gönder.
2. Ret/iadede gerekçe ve yeni sürüm zorunluluğunu doğrula.
3. RFQ tekliflerini normalize edip seçim onayından PO üret.
4. Kısmi teslim ve hizmet/mal kabulü yap.
5. PO–kabul–tedarikçi faturası üçlü eşleştirmesini doğrula.
6. Ekipman kabulünden demirbaş taslağı üret; aktif zimmet çakışmasını engelle.
7. Tahsilat hareketini çoklu faturaya dağıt; fatura durumlarının otomatik türediğini doğrula.

### Senaryo D — personel ve özel not

1. Referans tasarımındaki sekmeli personel formunda yetkiye göre hassas sekmeleri göster.
2. Mükerrer kimlik/e-posta ve eksik belgeyi tespit et.
3. Personel, özlük, onboarding ve taslak zimmetleri tek transaction’da oluştur.
4. Personelin zimmeti kabul etmesiyle envanter durumunu güncelle.
5. Kullanıcı A kişisel not/checklist oluşturup tiklesin.
6. Kullanıcı B ve superadmin aynı not ID’sine erişmeye çalışsın; içerik hiçbir kanalda görünmesin.
7. Not metninin audit, log, arama ve rapora girmediğini doğrula.

### Senaryo E — tek tip rapor ve çıktı

1. Bir satış, proje ve finans raporunu aynı ReportLayout ile aç.
2. Aynı tarih/müşteri/proje filtrelerini uygula.
3. Kolon, hizalama, KPI açıklaması ve drill-down davranışının ortak olduğunu doğrula.
4. PDF, XLSX, CSV ve yazdırma çıktısı al.
5. Kayıt kümesi, toplam, filtre ve formül sürümünün ekranla aynı olduğunu doğrula.
6. Yetkisiz alanın hiçbir çıktıda bulunmadığını ve kişisel notların rapora girmediğini doğrula.

## 21. Uygulama sırası

### Faz 0 — envanter ve güvenlik ağı

Sayfalar, rotalar, entity’ler, durum alanları, duplicate hesaplamalar, roller ve testleri çıkar. Mevcut davranış için smoke/E2E testleri ekle. Hangi demo kodunun üretim servisine dönüşeceğini belirle.

### Faz 1 — P0 ortak çekirdek

Transition, approval, authorization, audit, relationship/event, idempotency/outbox, business calendar/SLA, data quality ve integration error queue altyapısını kur. Ortak eylem modalını ekle.

### Faz 2 — tasarım standardı

Referans personel formunu reusable CreateEditPage bileşenlerine ayır. Önce Personel ve Proje formlarını düzelt; ardından bütün yeni/düzenleme sayfalarına geçir. Mevcut sayfalarda görsel kırılma regresyonu yap.

### Faz 3 — uçtan uca iş akışları

Satış → sözleşme → proje; proje → kalite → teslim → destek; satın alma → kabul → tedarikçi faturası; fatura → tahsilat zincirlerini tamamla.

### Faz 4 — raporlama ve kişisel çalışma alanı

ReportLayout, registry ve export service’i kur; tüm raporları migrate et. Ardından Notlarım modülünü sıkı owner-only politika ve negatif testlerle ekle.

### Faz 5 — portallar ve ileri entegrasyon

Müşteri/tedarikçi portalı, bilgi bankası, API/webhook yönetimi, lisans/abonelik, release/deployment ve ileri rapor dağıtımını tamamla.

## 22. Cloud/AI geliştiricinin teslim biçimi

Çalışmayı tek seferde kontrolsüz büyük bir değişiklik olarak uygulama. Önce analiz raporu ve uygulanabilir iş paketleri üret; ardından her fazı çalışan kod, migration, test ve kısa teknik dokümantasyonla teslim et.

Her iş paketi için şunları ver:

- Mevcut sorun ve etkilenen sayfa/entity.
- Hedef davranış ve durum/ilişki kuralları.
- Değiştirilecek dosyalar/bileşenler/endpoint’ler.
- Migration ve veri düzeltme ihtiyacı.
- Yetki ve audit etkisi.
- Otomatik testler ve kabul senaryosu.
- Geri dönüş/feature flag planı.
- Ekran görüntüsü veya kısa demo kanıtı.

Her faz sonunda lint/typecheck, unit, integration, E2E ve erişilebilirlik kontrollerini çalıştır. Başarısız veya çalıştırılamayan testi açıkça raporla; “tamamlandı” sayma. Mevcut kullanıcı verisini koru, üretimdeki bağlantıları sessizce koparma ve veri migrasyonu olmadan alan anlamını değiştirme.

## 23. Definition of Done

Bir revizyon ancak aşağıdaki koşullar birlikte sağlandığında tamamlanmış sayılır:

- UI referans form veya ortak rapor standardına uygundur.
- İş kuralı sunucu tarafında uygulanır.
- Durum geçişi/yan etkiler atomik ve idempotenttir.
- Kaynak–hedef ilişkileri ve audit izi oluşur.
- Rol, satır, alan, rapor ve export yetkileri test edilmiştir.
- Hata, boş, yükleniyor ve yetkisiz durumları tasarlanmıştır.
- Mobil/klavye/erişilebilirlik kontrolleri geçer.
- Migration ve geri dönüş planı vardır.
- Unit/integration/E2E testleri geçer.
- Demo veriye veya tek bir sabit kullanıcıya özel kod yoktur.
- Rapor sonucu ve export aynı hesaplama kaynağını kullanır.
- Kişisel not içeriği sahibi dışında hiçbir kullanıcı, log, rapor, arama veya entegrasyon tarafından görülemez.

## Son talimat

Yukarıdaki kapsamı ürünün tamamı için bağlayıcı kabul et. Önce mevcut kod tabanında karşılığını bul, çakışan veya tekrarlanan uygulamaları işaretle ve P0’dan başlayarak fazlandırılmış uygulama planı çıkar. Belirsiz bir iş kuralında sessiz varsayım yapma; veri bütünlüğü, finansal sonuç, müşteri sözleşmesi, kişisel veri veya erişim kapsamını etkiliyorsa kararı açık soru/ADR olarak kaydet. Görsel uyum için yeni kayıt sayfalarında verilen personel formu referansını; raporlar için tek ReportLayout’u; kişisel notlarda ise owner-only güvenlik modelini değişmez temel olarak uygula.
