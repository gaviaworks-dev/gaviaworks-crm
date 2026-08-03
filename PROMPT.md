# YAZILIM ŞİRKETİ CRM, ERP VE OPERASYON YÖNETİM SİSTEMİ

## Claude Analiz, Arayüz Tasarımı ve Geliştirme Promptu

Sen; yazılım şirketleri, dijital ajanslar, CRM, ERP, özel yazılım geliştirme süreçleri, proje yönetimi, satış, müşteri ilişkileri, insan kaynakları, iş süreçleri otomasyonu, satın alma, demirbaş, araç ve filo yönetimi, finansal takip, raporlama, kullanıcı deneyimi ve kurumsal yazılım mimarisi konularında yüksek tecrübeye sahip uzman bir yapay zekâsın.

Görevin, bir yazılım şirketinin günlük operasyonlarının tamamını tek merkezden yönetmesini sağlayacak kapsamlı bir CRM, ERP ve operasyon yönetim sistemi oluşturmaktır.

Sistem yalnızca müşteri kaydı tutan klasik bir CRM olmamalıdır. Aşağıdaki süreçleri birbirine bağlı şekilde yönetmelidir:

- Potansiyel müşteri ve referans takibi
- Satış fırsatları
- Müşteri görüşmeleri
- Ön analiz
- Teklif ve sözleşme
- Proje yönetimi
- Departmanlar arası iş süreçleri
- Görev yönetimi
- Personel ve insan kaynakları
- Zaman ve kapasite takibi
- Satın alma
- Tedarikçi yönetimi
- Demirbaş ve zimmet
- Araç ve filo yönetimi
- Destek ve bakım
- Doküman yönetimi
- Ajanda ve toplantılar
- Şirket içi sohbet
- Finansal ve operasyonel takip
- Yönetici raporları
- Müşteri raporları
- Personel raporları
- Proje, görev ve departman raporları

Hazırlanacak sistem hem şirketin kendi operasyonlarında kullanılabilecek hem de ilerleyen dönemde farklı yazılım şirketlerine lisanslanabilecek modüler bir SaaS ürününe dönüşebilecek yapıda ele alınmalıdır.

---

## 1. ÖNEMLİ REFERANS: GAVIA CRM ARAYÜZ YAPISI

Daha önce hazırlanan Gavia CRM sistemini, bu yeni yazılım şirketi CRM projesinin arayüz, sayfa düzeni, kullanıcı deneyimi ve ortak bileşen sistemi için temel referans olarak kullan.

Referans proje:

Gavia CRM:

- https://gaviaworks-dev.github.io/gaviacrm/v2/

Mevcut proje içerisinde farklı veya daha güncel bir Gavia CRM bağlantısı, tasarımı, ekran görüntüsü ya da kaynak kod bulunuyorsa öncelikle onu incele.

#### Referansı Kullanma Biçimi

Gavia CRM’de bulunan aşağıdaki arayüz yaklaşımını koru:

- Sol menü yapısı
- Üst navigasyon alanı
- Rol bazlı dashboard düzeni
- Günlük özet alanları
- Bildirim merkezi
- Bekleyen onaylar
- Kart yapıları
- Tablo tasarımları
- Sekmeli liste sayfaları
- Detay sayfalarının sekmeli yapısı
- Form düzenleri
- Durum etiketleri
- Filtreleme yapısı
- Kolon yönetimi
- Arşiv ve pasif kayıt gösterimi
- Çıktı alma sistemi
- Modal ve sağ panel kullanımı
- Aktivite geçmişi
- Kullanıcı ve rol seçimi
- Kurumsal, sade ve modern tasarım dili

Ancak Gavia CRM’deki inşaat sektörüne özgü içerikleri doğrudan kopyalama.

Aşağıdaki gibi sektörel dönüşümler yap:

- Şantiye → Proje, müşteri projesi veya çalışma alanı
- Saha personeli → Yazılım, tasarım, satış veya operasyon personeli
- Saha bildirimi → Proje bildirimi, hata, revizyon veya destek kaydı
- Hakediş → Proje ödeme planı, fatura aşaması veya milestone ödemesi
- Taşeron → Dış kaynak ekip, freelancer veya çözüm ortağı
- Makine ve ekipman → Demirbaş, teknoloji ekipmanı ve araç
- Şantiye raporu → Proje, müşteri veya departman raporu
- İş programı → Proje planı, sprint, milestone ve görev takvimi

Gavia CRM yalnızca görsel referans olarak değil, ortak bileşen mantığı ve sayfa standardı açısından da örnek alınmalıdır.

Yeni sistemin kendi sektörüne uygun bilgi mimarisi kurulmalı; Gavia CRM’in ekranları isim değiştirilerek kopyalanmamalıdır.

---

## 2. ÇALIŞMA YÖNTEMİ

- Çalışmaya doğrudan rastgele ekranlar oluşturarak başlama.

Aşağıdaki sırayı takip et:

- Mevcut Gavia CRM yapısını incele.
- Tekrar kullanılabilecek arayüz bileşenlerini belirle.
- Yazılım şirketinin işleyişini analiz et.
- Kullanıcı rollerini ve departmanları belirle.
- Operasyonel sorunları çıkar.
- Manuel yürütülen süreçleri tespit et.
- Otomasyona uygun süreçleri belirle.
- Ana modülleri ve alt modülleri oluştur.
- Modüller arasındaki veri ilişkilerini kur.
- Menü ve sayfa haritasını hazırla.

Her sayfanın işlevini, alanlarını ve aksiyonlarını belirle.

- İş akışlarını ve onay mekanizmalarını oluştur.
- Dashboard ve rapor sistemini tasarla.
- Teknik veri modelini oluştur.
- API, güvenlik ve yetkilendirme ihtiyaçlarını belirle.
- Sistemi geliştirme fazlarına ayır.

Arayüzü Gavia CRM tasarım sistemine uygun şekilde geliştir.

Eksik veya tutarsız noktaları tespit ederek makul çözümler üret.

- Oluşturulan ekranların birbirleriyle çalışmasını sağla.

Son aşamada geliştirme kontrol listesi ve kabul kriterlerini çıkar.

Eksik bilgi bulunması durumunda çalışmayı durdurma. Yazılım şirketlerinin gerçek çalışma süreçlerine uygun makul varsayımlar kullan ve varsayımları açıkça belirt.

---

## 3. PROJE BİLGİLERİ

- Şirket Adı: [Gavia Works]
- Şirket Ölçeği: 5–7 kişilik mikro ölçekli yazılım, yapay zekâ ve dijital danışmanlık şirketi

Faaliyet Alanı:

Özel yazılım geliştirme, kurumsal web sitesi ve web tabanlı uygulamalar, mobil uygulamalar, yapay zekâ çözümleri, iş süreçleri otomasyonu, CRM/ERP sistemleri, SaaS projeleri, API ve üçüncü taraf sistem entegrasyonları, e-ticaret altyapıları ve dijital danışmanlık hizmetleri.

Teknik çalışmalar; frontend, backend ve full-stack yazılım geliştirme süreçlerini kapsamaktadır.

Kullanıcı Sayısı:

İlk aşamada şirket içerisindeki 5–7 personel tarafından kullanılacaktır. Müşteri destek panelinin devreye alınmasıyla birlikte sisteme sınırlı yetkilere sahip müşteri kullanıcıları da eklenebilecektir.

Departmanlar ve Organizasyon Yapısı:

Şirketin mevcut ölçeği nedeniyle departmanlar kesin sınırlarla ayrılmış birimler yerine rol ve sorumluluk grupları şeklinde planlanmalıdır. Bir personel birden fazla departmanda görev alabilir.

- Yönetim ve Operasyon
- Genel şirket yönetimi
- İş ve proje süreçlerinin takibi
- Personel görevlendirmeleri
- İş önceliklerinin belirlenmesi
- Müşteri ve proje onayları
- Genel performans ve süreç raporları
- Yazılım Geliştirme
- Frontend geliştirme
- Backend geliştirme
- Full-stack geliştirme
- Mobil uygulama geliştirme
- API ve sistem entegrasyonları
- Test, hata düzeltme ve canlıya alma süreçleri
- Kaynak kod ve versiyon takibi
- Yapay Zekâ ve Otomasyon
- Yapay zekâ destekli özelliklerin geliştirilmesi
- İş süreçleri otomasyonları
- Yapay zekâ servislerinin projelere entegrasyonu
- Prompt ve yapay zekâ akışlarının hazırlanması
- Veri işleme ve akıllı raporlama çalışmaları
- Tasarım ve İnteraktif Medya
- UI/UX tasarımı
- Web ve mobil arayüz tasarımı
- Grafik tasarım
- Sosyal medya ve reklam tasarımları
- İnteraktif içerik üretimi
- Prototip ve sunum hazırlama
- Müşteri İlişkileri ve Destek
- Müşteri taleplerinin alınması
- Destek kayıtlarının oluşturulması
- Revize taleplerinin ilgili personele aktarılması
- Müşteri geri bildirimlerinin takibi
- Teslimat ve müşteri onay süreçleri
- Destek kayıtlarının sonuçlandırılması
- Satış ve Dijital Danışmanlık
- Potansiyel müşteri takibi
- İhtiyaç analizi
- Teklif hazırlama
- Proje kapsamının oluşturulması
- Dijital proje danışmanlığı
- Satış sonrası müşteri ilişkileri
- Finans ve İdari İşler
- Teklif, sözleşme ve ödeme takibi
- Gelir ve gider kayıtları
- Fatura süreçleri
- Personel ve operasyon giderleri
- Tahsilat takibi
- Proje bazlı maliyet takibi

Mevcut CRM Bağlantısı:

Aktif olarak kullanılan merkezi ve bütünleşik bir CRM sistemi bulunmamaktadır. Müşteri iletişimleri, talepler ve proje süreçleri ağırlıklı olarak WhatsApp, telefon, e-posta ve kişisel notlar üzerinden takip edilmektedir. Bu nedenle iletişim ve iş geçmişi tek merkezde toplanamamaktadır.

Kaynak Kod veya Proje Dosyaları:

Kaynak kodlar, tasarım dosyaları, müşteri dokümanları ve proje içerikleri proje bazlı olarak farklı ortamlarda tutulmaktadır. Sistem geliştirilirken GitHub/GitLab, bulut depolama alanları ve mevcut proje dosyalarıyla bağlantı kurulabilecek bir doküman ve bağlantı altyapısı oluşturulmalıdır.

Her proje içerisinde aşağıdaki alanlar bulunmalıdır:

- Kaynak kod deposu bağlantısı
- Canlı proje bağlantısı
- Test ortamı bağlantısı
- Tasarım dosyası bağlantısı
- Doküman ve sözleşmeler
- Sunucu ve alan adı bilgileri
- Kullanılan üçüncü taraf servisler
- Teknik sorumlu
- Müşteri sorumlusu
- Son güncelleme tarihi

Kullanılan Teknoloji:

Teknoloji altyapısı projeye göre değişiklik gösterebilir. Genel olarak aşağıdaki teknolojiler ve çalışma alanları kullanılmaktadır:

- Frontend teknolojileri
- Backend teknolojileri
- Full-stack web geliştirme
- Mobil uygulama teknolojileri
- Veritabanı sistemleri
- REST API ve üçüncü taraf servis entegrasyonları
- Git tabanlı versiyon kontrol sistemleri
- Bulut sunucu ve hosting sistemleri
- Yapay zekâ servisleri ve API’leri
- Otomasyon sistemleri
- Tasarım ve prototipleme araçları

Sistem içerisinde proje bazlı teknoloji envanteri tutulmalıdır. Kullanılan yazılım dili, framework, veritabanı, sunucu, entegrasyon ve servis bilgileri proje kartına eklenebilmelidir.

Mevcut Sorunlar:

- İşlerin merkezi bir sistem üzerinden takip edilememesi
- Görevlerin WhatsApp, telefon ve sözlü iletişim üzerinden verilmesi
- Verilen görevlerin unutulması veya kaçırılması
- Görevlerin hangi personelde olduğunun net olarak görülememesi
- İşlerin başlangıç ve teslim tarihlerinin düzenli takip edilememesi
- Geciken işler için otomatik uyarı sisteminin bulunmaması
- Personelin günlük ve haftalık iş yükünün görülememesi
- Bir işin hangi aşamada olduğunun yönetim tarafından anlık takip edilememesi
- Müşteri taleplerinin farklı iletişim kanallarında dağınık kalması
- Müşteri sorunları için merkezi bir destek panelinin bulunmaması
- Müşteriden gelen revize taleplerinin kayıt altına alınamaması
- Müşteriyle yapılan görüşmelerin geçmişinin kaybolması
- Proje dosyalarının ve bağlantılarının farklı alanlarda tutulması
- Proje bazlı yapılan işlerin, harcanan sürenin ve maliyetin ölçülememesi
- Personel sorumluluklarının ve performansının sağlıklı değerlendirilememesi
- Tekliften teslimata kadar olan müşteri sürecinin bütünleşik şekilde yönetilememesi
- Tamamlanan, bekleyen, geciken ve onay bekleyen işlerin tek ekranda görülememesi
- Yönetim için günlük, haftalık ve aylık raporların otomatik hazırlanamaması

Öncelikli Modüller:

### 1. Müşteri Yönetimi

- Müşteri kartları
- Firma ve yetkili bilgileri
- İletişim geçmişi
- Müşteriye bağlı projeler
- Teklif ve sözleşmeler
- Müşteri notları
- Müşteri sorumlusu
- Müşteri durumları
- Aktif ve pasif müşteri ayrımı

### 2. Proje ve İş Takip Modülü

- Proje oluşturma
- Projeye müşteri bağlama
- Proje yöneticisi belirleme
- Proje ekibi oluşturma
- İş ve görev ekleme
- Başlangıç ve teslim tarihleri
- Öncelik seviyeleri
- İş durumları
- Alt görevler
- Kontrol listeleri
- Dosya ve bağlantı ekleme
- Yorum ve işlem geçmişi
- Proje ilerleme yüzdesi
- Geciken işler
- Onay bekleyen işler

### 3. Görevlendirme ve Personel İş Takibi

- Personele görev atama
- Bir göreve birden fazla personel ekleme
- Görev sorumlusu ve takipçisi belirleme
- Departman bazlı görev havuzları
- Bana verilen işler
- Verdiğim işler
- Takip ettiğim işler
- Onayımı bekleyen işler
- Geciken görevler
- Günlük ve haftalık görev görünümü
- Personel iş yükü
- Personel müsaitlik durumu
- Görev teslim ve kontrol sistemi

### 4. Müşteri Destek Paneli

- Müşteri destek kaydı oluşturma
- Destek talebi kategorileri
- Hata, revize, geliştirme ve bilgi talebi ayrımı
- Öncelik ve aciliyet seviyesi
- Destek kaydını personele atama
- Durum takibi
- Müşteriyle yazışma alanı
- Dosya, ekran görüntüsü ve video yükleme
- Çözüm süresi takibi
- Bekleyen ve geciken talepler
- Müşteri onayı
- Destek kaydını kapatma
- Destek geçmişi ve raporları

### 5. Bildirim ve Hatırlatma Sistemi

- Görev atama bildirimi
- Yaklaşan teslim tarihi uyarısı
- Geciken görev bildirimi
- Müşteri mesajı bildirimi
- Destek talebi bildirimi
- Onay bekleyen işlem bildirimi
- Günlük iş özeti
- Haftalık iş özeti
- E-posta ve uygulama içi bildirim
- İlerleyen aşamada WhatsApp bildirim entegrasyonu

### 6. Yönetim Paneli ve Raporlama

- Aktif müşteri sayısı
- Aktif proje sayısı
- Devam eden işler
- Geciken işler
- Tamamlanan işler
- Onay bekleyen işler
- Açık destek kayıtları
- Personel iş yükleri
- Proje ilerleme oranları
- Günlük, haftalık ve aylık performans
- Müşteri ve proje bazlı raporlar

### 7. Dosya ve Doküman Yönetimi

- Proje dosyaları
- Teklif ve sözleşmeler
- Tasarım dosyaları
- Teknik dokümanlar
- Kaynak kod bağlantıları
- Sunucu ve alan adı bilgileri
- Müşteriden alınan dosyalar
- Dosya sürüm ve güncelleme geçmişi

---

## 4. DEPARTMANLAR

Sistemde aşağıdaki departmanları değerlendir:

- Yönetim
- Satış ve iş geliştirme
- Müşteri ilişkileri
- İş analizi
- Proje yönetimi
- UI/UX tasarım
- Front-end geliştirme
- Back-end geliştirme
- Mobil uygulama geliştirme
- Yapay zekâ ve veri
- Test ve kalite
- DevOps ve sistem yönetimi
- Teknik destek
- İnsan kaynakları
- Muhasebe ve finans
- Satın alma
- İdari işler
- Pazarlama
- İçerik üretimi
- Dış kaynak ekipler
- Freelancer ve çözüm ortakları

Departmanlar sistem yöneticisi tarafından eklenebilir, düzenlenebilir, pasife alınabilir ve organizasyon şemasına bağlanabilir olmalıdır.

---

## 5. KULLANICI ROLLERİ VE YETKİLENDİRME

En az aşağıdaki kullanıcı rollerini değerlendir:

- Şirket sahibi
- Genel müdür
- Operasyon yöneticisi
- Departman yöneticisi
- Satış yöneticisi
- Satış temsilcisi
- Müşteri temsilcisi
- İş analisti
- Proje yöneticisi
- Takım lideri
- UI/UX tasarımcı
- Front-end geliştirici
- Back-end geliştirici
- Mobil geliştirici
- Yapay zekâ geliştiricisi
- Test ve kalite uzmanı
- DevOps personeli
- Teknik destek personeli
- İnsan kaynakları
- Muhasebe
- Satın alma sorumlusu
- İdari işler sorumlusu
- Freelancer
- Dış kaynak ekip
- Stajyer
- Müşteri kullanıcısı
- Sistem yöneticisi

Her rol için aşağıdaki yetkileri ayrı ayrı tanımla:

- Modül görüntüleme
- Kayıt listeleme
- Kayıt detayı görüntüleme
- Kayıt ekleme
- Kayıt düzenleme
- Kayıt silme
- Arşivleme
- Pasife alma
- Onaylama
- Reddetme
- Görev atama
- Dosya yükleme
- Dosya indirme
- Finansal bilgi görüntüleme
- Maaş bilgisi görüntüleme
- Personel raporu görüntüleme
- Müşteri raporu görüntüleme
- Dışa aktarma
- Log kayıtlarına erişme
- Departman verilerine erişme
- Proje bazlı erişim
- Kayıt bazlı erişim
- Şirket bazlı erişim
- Yetkilendirme yalnızca menü gizleme şeklinde yapılmamalıdır.

Aşağıdaki seviyelerde gerçek erişim kontrolü kurulmalıdır:

- Rol bazlı yetki
- Kullanıcı bazlı özel yetki
- Departman bazlı erişim
- Proje bazlı erişim
- Müşteri bazlı erişim
- Kayıt bazlı erişim
- Alan bazlı erişim
- Çoklu şirket ve tenant bazlı erişim

---

## 6. ORTAK ARAYÜZ VE LİSTE SAYFASI STANDARDI

Gavia CRM’de bulunan İş Takibi ve Görevlerim sayfalarının kullanım mantığını bütün liste ekranlarında ortak standart olarak kullan.

#### Liste Sayfası Üst Alanı

Sol tarafta:

- Sayfa başlığı
- Kısa açıklama
- Toplam kayıt bilgisi
- Hızlı arama alanı

Sağ tarafta sabit olarak:

- Gelişmiş Filtre
- Kolonlar
- Arşivlenenleri Göster veya Pasifleri Göster
- Çıktı Al
- Sayfaya göre ana ekleme butonu

Örnek:

- Yeni Müşteri
- Yeni Görev
- Yeni Proje
- Yeni Personel
- Yeni Araç
- Yeni Satın Alma Talebi

#### İkinci Satır

Arama ve aksiyon alanlarının altında kategori veya durum sekmeleri bulunmalıdır.

Örnek görev sekmeleri:

- İş Havuzu
- Bana Verilenler
- Verdiğim İşler
- Departman İşleri
- Onay Bekleyenler
- Gecikenler
- Tamamlananlar

Örnek müşteri sekmeleri:

- Tüm Müşteriler
- Aktif Müşteriler
- Potansiyel Müşteriler
- Riskli Müşteriler
- Pasif Müşteriler

Örnek araç sekmeleri:

- Tüm Araçlar
- Aktif Araçlar
- Personele Tahsisli
- Ortak Kullanım
- Serviste
- Pasif Araçlar

#### Ortak Liste Özellikleri

Bütün liste ekranlarında mümkün olduğunca şunları kullan:

- Hızlı arama
- Gelişmiş filtre
- Kayıtlı filtreler
- Kayıtlı görünümler
- Kolon seçimi
- Kolon sıralama
- Kolon genişliği değiştirme
- Sıralama
- Sayfalama
- Toplu seçim
- Toplu işlem
- Aktif ve pasif kayıtlar
- Arşivlenenleri göster
- Excel çıktısı
- CSV çıktısı
- PDF çıktısı
- Yazdırma
- Filtreleri temizleme
- Filtre sonucunu kaydetme
- Kullanıcıya özel görünüm
- Kart görünümü
- Tablo görünümü
- Kanban görünümü
- Mobil uyumlu liste görünümü
- Filtre değiştirildiğinde sayfalama ilk sayfaya dönmelidir.

Sayfa, filtre ve sıralama bilgileri mümkün olduğunca URL üzerinde korunmalıdır.

Liste yapısı yüksek kayıt sayısında çalışabilecek şekilde sunucu taraflı sayfalama ve filtrelemeye uygun tasarlanmalıdır.

---

## 7. DASHBOARD VE GÜNLÜK ÖZET

Ana panel bütün kullanıcılar için aynı olmamalıdır.

Her kullanıcı rolüne göre kişiselleştirilmiş dashboard oluştur.

#### Şirket Sahibi Dashboard

- Toplam müşteri
- Yeni müşteri adayları
- Referansla gelen müşteriler
- Satış pipeline
- Bekleyen teklifler
- Aylık satış tahmini
- Aktif projeler
- Geciken projeler
- Geciken görevler
- Riskli müşteriler
- Geciken tahsilatlar
- Personel kapasitesi
- Departman iş yükleri
- Satın alma onayları
- Araç ve demirbaş uyarıları
- Sigorta ve kasko yenilemeleri
- Günlük yönetici özeti

#### Satış Dashboard

- Yeni müşteri adayları
- Bugünkü görüşmeler
- Sonraki aksiyonlar
- Referansla gelen talepler
- Teklif bekleyen müşteriler
- Uzun süredir işlem yapılmayan fırsatlar
- Kazanılan satışlar
- Kaybedilen satışlar
- Satış hedefi
- Tahmini ciro
- Referans dönüşüm oranı

#### Proje Yöneticisi Dashboard

- Aktif projeler
- Yaklaşan teslimler
- Geciken görevler
- Engellenen görevler
- Kontrol bekleyen işler
- Müşteriden bilgi bekleyen işler
- Departmanlar arası talepler
- Personel iş yükleri
- Bütçe sapmaları
- Süre sapmaları
- Proje riskleri

#### Personel Dashboard

- Bana verilen görevler
- Bugünkü görevler
- Geciken görevler
- Yaklaşan işler
- Kontrol bekleyen teslimler
- Okunmamış mesajlar
- Departman duyuruları
- Toplantılar
- Zaman kayıtları
- İzin durumu
- Zimmetler
- Kişisel performans özeti

#### İnsan Kaynakları Dashboard

- Aktif personeller
- İzin talepleri
- Eksik belgeler
- Yaklaşan işe girişler
- İşten çıkış süreçleri
- Performans dönemleri
- Eğitim planları
- Personel kapasitesi
- Zimmet iade kontrolleri

#### Satın Alma ve İdari İşler Dashboard

- Yeni satın alma talepleri
- Onay bekleyen talepler
- Teklif bekleyen satın almalar
- Geciken siparişler
- Zimmet bekleyen ekipmanlar
- Bakımı yaklaşan araçlar
- Muayenesi yaklaşan araçlar
- Sigorta ve kasko yenilemeleri
- Garanti bitişleri
- Lisans yenilemeleri

---

## 8. CRM, MÜŞTERİ ADAYI VE SATIŞ YÖNETİMİ

### 8.1. Müşteri Adayları

Her müşteri adayı için:

- Lead numarası
- Firma adı
- Yetkili kişi
- Telefon
- E-posta
- Sektör
- Firma büyüklüğü
- İlgilendiği hizmet
- Talep özeti
- Talep tarihi
- Müşteri kaynağı
- Yönlendiren kişi
- Yönlendiren firma
- Satış sorumlusu
- Tahmini bütçe
- Tahmini kapanış tarihi
- Öncelik
- Lead puanı
- Sıcaklık seviyesi
- Son iletişim tarihi
- Sonraki aksiyon
- Sonraki aksiyon tarihi
- Görüşme notları
- Dosyalar
- Etiketler
- Kaybedilme nedeni
- Aktivite geçmişi

### 8.2. Satış Pipeline

Aşağıdaki satış aşamalarını değerlendir:

- Yeni talep
- İlk iletişim
- Ön görüşme
- İhtiyaç analizi
- Teknik değerlendirme
- Ön analiz hazırlanıyor
- Fiyatlandırma
- Teklif hazırlanıyor
- Teklif iletildi
- Müşteri değerlendirmesinde
- Revize teklif
- Sözleşme aşaması
- Kazanıldı
- Kaybedildi
- Beklemeye alındı

Her aşama için:

- Zorunlu alanlar
- Sorumlu kullanıcı
- Beklenen işlem
- Beklenen belge
- Onay mekanizması
- Otomatik görev
- Hatırlatma
- Maksimum bekleme süresi
- Gecikme uyarısı
- Sonraki aşamaya geçiş kuralı
- oluştur.

### 8.3. Müşteri Kartı

Müşteri detay sayfasını sekmeli olarak tasarla:

- Genel Bilgiler
- Yetkililer
- İletişim Geçmişi
- Satış Fırsatları
- Teklifler
- Sözleşmeler
- Projeler
- Görevler
- Toplantılar
- Destek Talepleri
- Faturalar
- Tahsilatlar
- Dosyalar
- Raporlar
- Aktivite Geçmişi

---

## 9. REFERANS VE YÖNLENDİREN KİŞİ YÖNETİMİ

Yeni müşteri kaynaklarında referans sistemini ayrı ve ölçülebilir bir yapı olarak oluştur.

#### Referans Türleri

- Mevcut müşteri
- Eski müşteri
- Personel
- Şirket ortağı
- İş ortağı
- Danışman
- Freelancer
- Tedarikçi
- Harici kişi
- Kurumsal firma
- Etkinlik
- Dijital reklam
- Organik arama
- Sosyal medya
- Web formu
- Telefon
- E-posta

#### Yönlendiren Kişi Kartı

- Kişi veya firma adı
- Referans türü
- Bağlı olduğu firma
- Pozisyon
- Telefon
- E-posta
- Şirket içi sorumlu
- Yönlendirdiği müşteri adayları
- Kazanılan müşteriler
- Kaybedilen fırsatlar
- Oluşturduğu toplam ciro
- Dönüşüm oranı
- Son yönlendirme tarihi
- Komisyon modeli
- Komisyon oranı
- Sabit referans bedeli
- Hak ediş durumu
- Ödeme durumu
- Görüşme notları
- Belgeler
- Aktivite geçmişi

#### Referans İş Akışı

- Yönlendiren kişinin eklenmesi
- Müşteri adayının referansla ilişkilendirilmesi
- Satış sorumlusunun atanması
- Görüşme ve ihtiyaç analizi
- Teklif hazırlanması
- Satışın kazanılması veya kaybedilmesi
- Referans hakkedişinin hesaplanması
- Yönetici onayı
- Ödeme süreci
- Referans performansının raporlanması

Referans kaydı müşteri, proje, teklif, sözleşme, ciro ve komisyon kayıtlarıyla ilişkilendirilmelidir.

---

## 10. ÖN ANALİZ VE TEKLİF YÖNETİMİ

#### Ön Analiz

Her müşteri talebinde aşağıdaki bilgiler değerlendirilsin:

- Projenin amacı
- Hedef kullanıcılar
- Kullanıcı rolleri
- Ana modüller
- Alt modüller
- Web ihtiyacı
- Mobil uygulama ihtiyacı
- Yönetim paneli
- Müşteri paneli
- Entegrasyonlar
- Yapay zekâ özellikleri
- Ödeme altyapısı
- Abonelik sistemi
- Çoklu dil
- Çoklu şirket
- Raporlama
- Bildirim sistemi
- Güvenlik
- KVKK
- Sunucu ve altyapı
- Tahmini ekip
- Tahmini iş gücü
- Tahmini süre
- Riskler
- Belirsiz gereksinimler
- Müşteriden beklenen bilgiler
- Kapsama dahil işler
- Kapsam dışı işler

Ön analiz sonucunda sistem şu çıktıları oluşturabilmelidir:

- Proje kapsam dokümanı
- Modül listesi
- Sayfa listesi
- Kullanıcı rol listesi
- Teknik gereksinimler
- İş gücü tahmini
- Zaman planı
- Maliyet tahmini
- Risk raporu
- Teklif taslağı

#### Teklif Yönetimi

- Teklif numarası
- Müşteri
- İlgili satış fırsatı
- Teklif tarihi
- Geçerlilik tarihi
- Hizmet kalemleri
- Modül bazlı fiyat
- Saat bazlı fiyat
- Paket fiyat
- Lisans bedeli
- Sunucu bedeli
- Bakım bedeli
- Üçüncü taraf maliyetleri
- İndirim
- Vergi
- Döviz
- Ödeme planı
- Teslim planı
- Garanti
- Destek koşulları
- Teklif versiyonları
- Revizyon geçmişi
- İç onay
- Müşteri onayı
- PDF çıktısı
- Dijital onay
- E-imza

---

## 11. PROJE YÖNETİMİ

Her proje detayında aşağıdaki sekmeleri oluştur:

- Genel Bakış
- Proje Ekibi
- Modüller
- Milestone
- Sprintler
- Görevler
- İş Yükü
- Takvim
- Gantt
- Kanban
- Zaman Kayıtları
- Toplantılar
- Dosyalar
- Revizyonlar
- Değişiklik Talepleri
- Testler
- Hatalar
- Teslimler
- Bütçe
- Maliyetler
- Raporlar
- Aktivite Geçmişi

Her proje için:

- Proje kodu
- Müşteri
- Proje adı
- Proje yöneticisi
- Proje ekibi
- Başlangıç tarihi
- Planlanan bitiş
- Gerçekleşen bitiş
- Proje durumu
- İlerleme oranı
- Sözleşme tutarı
- Proje bütçesi
- Gerçekleşen maliyet
- Tahmini süre
- Harcanan süre
- Proje riskleri
- Kritik işler
- Gecikme nedenleri
- Müşteri onayları
- Proje sağlık durumu
- bulunmalıdır.

---

## 12. GELİŞMİŞ GÖREV VE İŞ TAKİP SİSTEMİ

Görev sistemi projenin en önemli modüllerinden biridir.

Gavia CRM’deki İş Havuzu, Bana Verilenler ve Verdiğim İşler yapısını örnek al.

#### Görev Sekmeleri

- İş Havuzu
- Bana Verilenler
- Verdiğim İşler
- Departman İşleri
- Proje İşleri
- Atama Bekleyenler
- Kabul Bekleyenler
- Onay Bekleyenler
- Kontrol Bekleyenler
- Gecikenler
- Engellenenler
- Tamamlananlar
- Arşivlenenler

#### Görev Türleri

- Genel görev
- Müşteri görevi
- Proje görevi
- Satış görevi
- Ön analiz görevi
- Tasarım görevi
- Yazılım geliştirme görevi
- Test görevi
- Hata
- Revizyon
- Destek talebi
- Satın alma görevi
- Personel görevi
- Demirbaş görevi
- Araç görevi
- Toplantı aksiyonu
- Onay görevi
- Tekrarlayan görev

#### Görev Kartı

- Görev numarası
- Başlık
- Ayrıntılı açıklama
- Görev amacı
- Görev türü
- Müşteri
- Proje
- Modül
- İş paketi
- Sprint
- Departman
- Görevi oluşturan kişi
- Görevi veren kişi
- Ana sorumlu
- Yardımcı sorumlular
- İzleyiciler
- Kontrol eden
- Onaylayan
- Öncelik
- Etki seviyesi
- Aciliyet
- Durum
- Başlangıç tarihi
- Termin tarihi
- Tamamlanma tarihi
- Tahmini süre
- Gerçekleşen süre
- Faturalandırılabilir süre
- Kontrol listesi
- Alt görevler
- Üst görev
- Bağımlı görevler
- Engelleyen görevler
- Etiketler
- Dosyalar
- Görseller
- Yorumlar
- Kabul kriterleri
- Beklenen çıktı
- Teslim edilen çıktı
- Tamamlanma kanıtı
- Revizyon sayısı
- Yeniden açılma sayısı
- Kalite kontrol sonucu
- Müşteri onayı
- Yönetici onayı
- Riskler
- Engeller
- Gecikme nedeni
- Aktivite geçmişi

#### Görev Durumları

- Taslak
- Havuzda
- Atama bekliyor
- Atandı
- Kabul bekliyor
- Planlandı
- Başlanmadı
- Devam ediyor
- Bilgi bekliyor
- Müşteri bekleniyor
- Departman bekleniyor
- Engellendi
- Kontrol bekliyor
- Revize bekliyor
- Revizede
- Onay bekliyor
- Tamamlandı
- İptal edildi
- Arşivlendi

Her durum geçişi için yetki, zorunlu alan ve bildirim kuralları oluştur.

#### Görev Otomasyonları

- Atama bildirimi
- Görev kabul hatırlatması
- Termin yaklaşma bildirimi
- Gecikme bildirimi
- Yönetici eskalasyonu
- Bağımlı görev tamamlanınca sonraki görevi başlatma
- Kontrol sürecini otomatik başlatma
- Revizyon görevi oluşturma
- Tekrarlayan görev oluşturma
- Güncellenmeyen görev uyarısı
- Aşırı iş yükü uyarısı
- Sohbetten görev oluşturma
- Toplantıdan görev oluşturma
- Müşteri talebinden görev oluşturma
- Destek talebinden geliştirme görevi oluşturma

Görev performansı yalnızca görev sayısına göre ölçülmemelidir.

Şunlar birlikte değerlendirilmelidir:

- Görev zorluğu
- İşin kapsamı
- Tahmini süre
- Gerçekleşen süre
- Kalite
- Revizyon sayısı
- Gecikme nedeni
- Dış bağımlılıklar
- Müşteri beklemeleri
- Kapsam değişiklikleri
- Teknik riskler

---

## 13. DEPARTMANLAR ARASI SOHBET VE İŞ BİRLİĞİ

CRM içerisinde merkezi bir sohbet ve iş birliği modülü oluştur.

#### Sohbet Türleri

- Birebir sohbet
- Departman içi kanal
- Departmanlar arası kanal
- Proje kanalı
- Müşteri iç ekip kanalı
- Görev sohbeti
- Satış fırsatı sohbeti
- Satın alma sohbeti
- Araç veya demirbaş sohbeti
- Şirket duyuruları
- Geçici çalışma grupları

#### Sohbet Özellikleri

- Yazılı mesaj
- Dosya
- Görsel
- Video
- Ses kaydı
- Bağlantı
- Personel etiketleme
- Departman etiketleme
- Mesaja yanıt
- Mesaj düzenleme
- Mesaj sabitleme
- Kaydetme
- Emoji ve tepki
- Okundu bilgisi
- Arama
- Filtre
- Arşiv
- Sessize alma
- Yetkilendirme
- Aktivite geçmişi

#### Sohbetten Görev Oluşturma

- Bir mesaj tek işlemle göreve dönüştürülebilmelidir.

Oluşturulan görevde:

- Mesaj bağlantısı
- Görev başlığı
- Açıklama
- Talep eden kişi
- Sorumlu kişi
- Departman
- Müşteri
- Proje
- Öncelik
- Termin
- Beklenen çıktı
- Kabul kriteri
- Dosyalar
- İzleyiciler
- Onaylayacak kişi
- bulunmalıdır.

Görev tamamlandığında sohbet içerisinde otomatik durum mesajı yayınlanmalıdır.

#### Departmanlar Arası İş Talebi

- Departmanlar birbirlerine yapılandırılmış talep gönderebilmelidir.

Örnekler:

- Satıştan teknik ekibe ön analiz talebi
- Proje yönetiminden tasarıma ekran talebi
- Yazılımdan test ekibine test talebi
- Teknik destekten yazılıma hata çözüm talebi
- Personelden satın almaya ekipman talebi
- Muhasebeden satışa eksik bilgi talebi

Her talepte:

- Talep eden departman
- Talep edilen departman
- Talep eden kişi
- Sorumlu
- Talep türü
- Müşteri
- Proje
- Açıklama
- Öncelik
- Termin
- Beklenen çıktı
- Kabul kriterleri
- Dosyalar
- Durum
- Onay
- Tamamlanma tarihi
- bulunmalıdır.

---

## 14. PERSONEL VE İNSAN KAYNAKLARI

#### Personel Kartı

- Personel numarası
- Ad ve soyad
- Fotoğraf
- Departman
- Pozisyon
- Yönetici
- Çalışma türü
- İşe giriş tarihi
- Sözleşme türü
- İletişim bilgileri
- Acil durum kişisi
- Eğitim bilgileri
- Yetkinlikler
- Teknolojiler
- Sertifikalar
- Maaş bilgisi
- İzin bakiyesi
- Zimmetler
- Araç zimmeti
- Belgeler
- Performans kayıtları
- Aktif projeler
- İş yükü
- Çalışma geçmişi

#### İzin Yönetimi

- Yıllık izin
- Mazeret izni
- Hastalık izni
- Ücretsiz izin
- Saatlik izin
- Uzaktan çalışma
- İzin bakiyesi
- Vekil personel
- Onay akışı
- Departman takvimi
- Çakışma kontrolü
- Otomatik bildirim

#### Zaman ve Kapasite Yönetimi

- Görev bazlı süre
- Proje bazlı süre
- Müşteri bazlı süre
- Faturalandırılabilir süre
- Faturalandırılamayan süre
- Manuel zaman girişi
- Zamanlayıcı
- Günlük çalışma özeti
- Haftalık timesheet
- Yönetici onayı
- Fazla mesai
- Eksik çalışma
- Personel doluluk oranı
- Departman kapasitesi
- Gelecek dönem müsaitliği

#### Performans Yönetimi

- Hedef belirleme
- Öz değerlendirme
- Yönetici değerlendirmesi
- Proje yöneticisi değerlendirmesi
- Görev kalite sonuçları
- Zamanında teslim oranı
- Revizyon oranı
- Problem çözme
- Teknik gelişim
- Ekip çalışması
- Departmanlar arası iletişim
- Müşteri geri bildirimi
- Eğitim ihtiyacı
- Gelişim planı

Performans sistemi otomatik karar vermemelidir. Veriler yöneticiye karar desteği sağlamalıdır.

---

## 15. DEMİRBAŞ, VARLIK VE ZİMMET YÖNETİMİ

- Demirbaş sistemi yalnızca ofis ekipmanlarıyla sınırlandırılmamalıdır.

#### Varlık Kategorileri

- Bilgisayar
- Monitör
- Telefon
- Tablet
- Klavye
- Mouse
- Kulaklık
- Kamera
- Mikrofon
- Sunucu
- Ağ ekipmanı
- Yazıcı
- Ofis mobilyası
- Yazılım lisansı
- Kurumsal abonelik
- Otomobil
- Ticari araç
- Motosiklet
- Kiralık araç
- Diğer varlıklar

#### Demirbaş Kartı

- Demirbaş kodu
- Barkod
- QR kod
- Kategori
- Alt kategori
- Marka
- Model
- Seri numarası
- Teknik özellikler
- Satın alma tarihi
- Satın alma fiyatı
- Tedarikçi
- Fatura
- Garanti başlangıcı
- Garanti bitişi
- Lokasyon
- Departman
- Durum
- Zimmetli personel
- Zimmet tarihi
- İade tarihi
- Bakım kayıtları
- Arıza kayıtları
- Servis geçmişi
- Hasar kayıtları
- Belgeler
- Fotoğraflar
- Aktivite geçmişi

#### Zimmet Süreci

- Personel seçimi
- Demirbaş seçimi
- Teslim tarihi
- Teslim tutanağı
- Dijital personel onayı
- Teslim fotoğrafları
- İade işlemi
- İade kontrolü
- Hasar kaydı
- Eksik ekipman kaydı
- İşten ayrılış kontrolü
- Zimmet geçmişi

---

## 16. ARAÇ VE FİLO YÖNETİMİ

Araçları genel demirbaş formu içerisinde yüzeysel şekilde yönetme.

Araçlar için özel modül ve detay ekranı oluştur.

#### Araç Kimlik Bilgileri

- Araç kodu
- Plaka
- Marka
- Model
- Model yılı
- Araç tipi
- Yakıt türü
- Vites
- Motor hacmi
- Motor numarası
- Şasi numarası
- Renk
- Ruhsat bilgileri
- Satın alınan araç
- Kiralık araç
- Finansal kiralama
- Ortak kullanım aracı
- Personele tahsisli araç
- Departmana tahsisli araç
- Projeye tahsisli araç

#### Satın Alma ve Kiralama

- Satın alma tarihi
- Satın alma bedeli
- Satıcı
- Fatura
- Kredi bilgileri
- Kiralama firması
- Sözleşme başlangıcı
- Sözleşme bitişi
- Aylık kira
- Kilometre sınırı
- Depozito
- İade koşulları
- Sözleşme belgesi

#### Araç Zimmeti

- Ana sürücü
- Yedek sürücü
- Departman
- Proje
- Zimmet başlangıcı
- Zimmet bitişi
- Teslim kilometresi
- İade kilometresi
- Teslim tutanağı
- Teslim fotoğrafları
- Araçta bulunan ekipmanlar
- Hasar bilgisi
- Personel onayı
- Bakım
- Güncel kilometre
- Son bakım tarihi
- Son bakım kilometresi
- Sonraki bakım tarihi
- Sonraki bakım kilometresi
- Yağ değişimi
- Filtre değişimi
- Fren kontrolü
- Akü kontrolü
- Lastik değişimi
- Ağır bakım
- Servis
- Bakım maliyeti
- Fatura
- Değiştirilen parçalar
- Serviste kalma süresi
- Muayene
- Son muayene tarihi
- Geçerlilik tarihi
- Sonraki muayene tarihi
- Muayene sonucu
- Muayene raporu
- Kusur bilgileri
- Tekrar muayene tarihi

Bildirimler:

- 60 gün kaldı
- 30 gün kaldı
- 15 gün kaldı
- 7 gün kaldı
- Süresi doldu
- Trafik Sigortası
- Sigorta şirketi
- Poliçe numarası
- Başlangıç tarihi
- Bitiş tarihi
- Prim
- Teminat
- Acente
- Poliçe belgesi
- Yenileme durumu
- Ödeme durumu
- Kasko
- Kasko şirketi
- Poliçe numarası
- Başlangıç tarihi
- Bitiş tarihi
- Kasko bedeli
- Teminat
- Muafiyet
- İkame araç hakkı
- Mini onarım
- Hasarsızlık oranı
- Poliçe belgesi
- Yenileme teklifi
- Ödeme planı

#### Yakıt ve Şarj

- Tarih
- İstasyon
- Litre
- Birim fiyat
- Toplam tutar
- Kilometre
- Sürücü
- Fiş veya fatura
- Ortalama tüketim
- Aylık tüketim
- Kilometre başına maliyet
- Elektrikli araç şarj kaydı
- Şarj miktarı
- Şarj maliyeti

#### Araç Giderleri

- Yakıt
- Bakım
- Onarım
- Lastik
- Sigorta
- Kasko
- Muayene
- Otopark
- HGS
- Köprü ve otoyol
- Kira
- Kredi
- Vergi
- Ceza
- Çekici
- Araç yıkama
- İkame araç
- Diğer giderler

#### Kaza, Hasar ve Ceza

- Kaza tarihi
- Konum
- Sürücü
- Karşı araç
- Kusur oranı
- Tutanak
- Fotoğraflar
- Ekspertiz
- Sigorta dosya numarası
- Onarım servisi
- Onarım maliyeti
- Trafik cezası
- Ceza tutarı
- Son ödeme tarihi
- Ödeme durumu
- Ceza belgesi

Araçların aylık, yıllık ve kilometre başına toplam maliyeti hesaplanmalıdır.

---

## 17. SATIN ALMA VE TEDARİKÇİ YÖNETİMİ

#### Satın Alma Talebi

- Talep numarası
- Talep eden kişi
- Departman
- Proje
- Ürün veya hizmet
- Kategori
- Açıklama
- Teknik özellikler
- Miktar
- Tahmini maliyet
- İhtiyaç tarihi
- Öncelik
- Gerekçe
- Bütçe kodu
- Dosyalar

#### Onay Akışı

Talep tutarı ve kategoriye göre:

- Departman yöneticisi
- Proje yöneticisi
- Satın alma
- Muhasebe
- Genel müdür
- Şirket sahibi
- onayları tanımlanabilmelidir.

#### Teklif Toplama

- Tedarikçiler
- Teklif belgeleri
- Fiyat karşılaştırması
- Teslim süresi
- Garanti
- Ödeme koşulları
- Teknik uygunluk
- Tedarikçi puanı
- Tercih gerekçesi

#### Sipariş ve Teslimat

- Sipariş numarası
- Tedarikçi
- Ürünler
- Miktar
- Birim fiyat
- Vergi
- Toplam
- Döviz
- Teslim tarihi
- Ödeme planı
- Fatura
- İrsaliye
- Teslim kontrolü
- Eksik teslim
- İade
- Demirbaşa aktarma
- Personele zimmetleme

Satın alınan araç filo modülüne, ekipman ise demirbaş modülüne otomatik aktarılabilmelidir.

---

## 18. DESTEK VE BAKIM YÖNETİMİ

- Destek talebi
- Hata bildirimi
- Geliştirme talebi
- Kullanım sorusu
- Öncelik
- Etki seviyesi
- SLA
- Sorumlu personel
- Müdahale süresi
- Çözüm süresi
- Müşteri yanıtı
- Bekleyen bilgi
- Çözüm açıklaması
- Harcanan süre
- Ücretli veya ücretsiz
- Bakım paketi
- Kalan destek süresi
- Memnuniyet puanı

Destek talebi:

- Göreve
- Hata kaydına
- Yeni geliştirme talebine
- Değişiklik talebine
- Ek teklife
- dönüştürülebilmelidir.

---

## 19. TOPLANTI, AJANDA VE DOKÜMAN YÖNETİMİ

- Ajanda
- Günlük görünüm
- Haftalık görünüm
- Aylık görünüm
- Toplantılar
- Görevler
- Hatırlatmalar
- Proje teslimleri
- Teklif tarihleri
- Sigorta ve kasko tarihleri
- Muayene tarihleri
- Personel izinleri
- Toplantılar
- Müşteri toplantısı
- Proje toplantısı
- Satış görüşmesi
- Departman toplantısı
- Personel görüşmesi
- Satın alma görüşmesi
- Katılımcılar
- Gündem
- Notlar
- Kararlar
- Aksiyonlar
- Sorumlular
- Terminler
- Dosyalar
- Toplantı kararları tek işlemle göreve dönüştürülebilmelidir.
- Dokümanlar
- Teklifler
- Sözleşmeler
- Gizlilik sözleşmeleri
- Proje analizleri
- Teknik dokümanlar
- Tasarım dosyaları
- Test raporları
- Teslim belgeleri
- Faturalar
- Personel belgeleri
- Zimmet formları
- Araç belgeleri
- Poliçeler
- Ruhsat
- Muayene raporları
- Satın alma belgeleri

Dokümanlarda:

- Klasörleme
- Etiketleme
- Versiyonlama
- Yetkilendirme
- Ön izleme
- İndirme
- Dijital onay
- Son kullanım tarihi
- Yenileme bildirimi
- Aktivite geçmişi
- bulunmalıdır.

---

## 20. RAPORLAMA MERKEZİ

Raporlar ayrı ve merkezi bir modülde toplanmalıdır.

Her raporda mümkün olduğunca:

- Tarih filtresi
- Şirket filtresi
- Departman filtresi
- Personel filtresi
- Müşteri filtresi
- Proje filtresi
- Durum filtresi
- Grafikler
- Özet kartları
- Detay tablo
- Kolon ayarları
- Excel
- CSV
- PDF
- Yazdırma
- Kayıtlı rapor
- Yetkilendirme
- bulunmalıdır.

### 20.1. Müşteri Raporları

- Müşteri genel raporu
- İletişim raporu
- Teklif raporu
- Satış dönüşüm raporu
- Proje raporu
- Destek raporu
- Finans raporu
- Tahsilat raporu
- Kârlılık raporu
- Memnuniyet raporu
- Risk raporu
- Müşteri yaşam boyu değeri
- Çapraz satış fırsatları
- Yenileme fırsatları

Müşteri raporunda:

- Toplam sözleşme
- Toplam fatura
- Toplam tahsilat
- Bekleyen tahsilat
- Toplam maliyet
- Kârlılık
- Aktif projeler
- Geciken projeler
- Açık görevler
- Destek talepleri
- Revizyonlar
- Son iletişim
- Sonraki aksiyon
- Memnuniyet
- Risk seviyesi
- gösterilmelidir.

### 20.2. Personel Raporları

- Personel genel raporu
- Görev raporu
- İş yükü raporu
- Zaman raporu
- Kapasite raporu
- Proje katkı raporu
- Performans raporu
- İzin raporu
- Eğitim raporu
- Zimmet raporu
- Araç kullanım raporu
- Fazla mesai raporu
- Eksik çalışma raporu
- Personel performansı yalnızca görev adediyle değerlendirilmemelidir.

### 20.3. Görev Raporları

- Açık görevler
- Geciken görevler
- Engellenen görevler
- Atanmamış görevler
- Kabul bekleyen görevler
- Kontrol bekleyen görevler
- Revizedeki görevler
- Tamamlanan görevler
- Departman bazlı görevler
- Proje bazlı görevler
- Müşteri bazlı görevler
- Tahmini ve gerçekleşen süre
- Zamanında tamamlama oranı
- Revizyon oranı
- Yeniden açılma oranı
- Görev kalite sonuçları
- Departmanlar arası talepler
- Sohbetten oluşan görevler
- Toplantıdan oluşan görevler

### 20.4. Referans Raporları

- Referans kaynakları
- Yönlendiren kişi performansı
- Referans dönüşüm oranı
- Referansla oluşan ciro
- Referansla oluşan kâr
- Ödenen komisyonlar
- Bekleyen komisyonlar
- Personel referansları
- Müşteri referansları
- Referans kaynaklı müşteri devamlılığı

### 20.5. Araç ve Filo Raporları

- Aktif araçlar
- Personele tahsisli araçlar
- Ortak kullanım araçları
- Servisteki araçlar
- Bakımı yaklaşan araçlar
- Bakımı geciken araçlar
- Muayenesi yaklaşan araçlar
- Sigortası yaklaşan araçlar
- Kaskosu yaklaşan araçlar
- Yakıt tüketimi
- Araç giderleri
- Kilometre başına maliyet
- Personel bazlı kullanım
- Departman bazlı kullanım
- Proje bazlı kullanım
- Kaza ve hasar
- Trafik cezaları
- Kiralama sözleşmeleri
- Satın alma ve kiralama karşılaştırması

### 20.6. Satış ve Finans Raporları

- Lead kaynakları
- Satış dönüşüm oranı
- Teklif başarı oranı
- Kazanılan satışlar
- Kaybedilen satışlar
- Satış temsilcisi performansı
- Ortalama satış süresi
- Tahmini satış geliri
- Proje bütçeleri
- Proje maliyetleri
- Müşteri kârlılığı
- Hizmet kârlılığı
- Tahsilatlar
- Geciken ödemeler
- Aylık gelir tahmini
- Nakit akış tahmini

---

## 21. BİLDİRİM VE OTOMASYON SİSTEMİ

Aşağıdaki durumlar için bildirim ve otomasyon oluştur:

- Yeni müşteri adayı
- Yeni referans
- Yaklaşan görüşme
- Uzun süredir işlem yapılmayan müşteri
- Teklif geçerlilik süresi
- Teklif onayı
- Proje başlangıcı
- Yaklaşan teslim
- Geciken proje
- Yeni görev
- Görev kabulü
- Görev gecikmesi
- Kontrol bekleyen görev
- Departmanlar arası talep
- Sohbette etiketlenme
- İzin talebi
- Eksik zaman kaydı
- Satın alma onayı
- Geciken sipariş
- Garanti bitişi
- Lisans yenileme
- Araç bakım tarihi
- Araç bakım kilometresi
- Muayene tarihi
- Trafik sigortası
- Kasko
- Kiralama sözleşmesi
- Trafik cezası
- Geciken tahsilat
- SLA ihlali
- Sözleşme yenilemesi

Bildirim kanalları:

- Sistem içi
- E-posta
- Mobil bildirim
- SMS
- WhatsApp
- Slack
- Microsoft Teams
- Kullanıcılar bildirim tercihlerini belirleyebilmelidir.

---

## 22. MODÜLLER ARASINDAKİ VERİ İLİŞKİLERİ

Aynı bilgi farklı modüllere tekrar tekrar girilmemelidir.

Aşağıdaki bağlantıları kur:

- Referans → Müşteri adayı
- Müşteri adayı → Satış fırsatı
- Satış fırsatı → Ön analiz
- Ön analiz → Teklif
- Teklif → Sözleşme
- Kazanılan satış → Müşteri
- Kazanılan satış → Proje
- Proje → Modül
- Proje → Sprint
- Proje → Görev
- Proje → Zaman kaydı
- Proje → Ekip
- Proje → Dosya
- Proje → Toplantı
- Sohbet mesajı → Görev
- Toplantı kararı → Görev
- Destek talebi → Görev veya hata
- Görev → Personel zaman kaydı
- Personel → Departman
- Personel → Proje
- Personel → Zimmet
- Personel → Araç
- Satın alma → Demirbaş
- Satın alma → Araç
- Araç → Bakım
- Araç → Sigorta
- Araç → Kasko
- Araç → Muayene
- Araç → Yakıt
- Araç → Gider
- Araç → Personel
- Müşteri → Proje
- Müşteri → Fatura
- Müşteri → Tahsilat
- Müşteri → Destek
- Referans → Komisyon
- Referans → Ciro

---

## 23. TEKNİK MİMARİ VE GÜVENLİK

Sistemi yalnızca statik ekranlardan oluşan bir prototip olarak değerlendirme.

- Kalıcı ve geliştirilebilir ürün mimarisi oluştur.

#### Teknik Gereksinimler

- Modüler mimari
- Ortak bileşen sistemi
- API tabanlı yapı
- İlişkisel veri modeli
- Sunucu taraflı filtreleme
- Sunucu taraflı sayfalama
- Veri doğrulama
- Transaction yönetimi
- Dosya yönetimi
- Aktivite kayıtları
- Bildirim servisi
- Raporlama servisi
- Arka plan görevleri
- Entegrasyon katmanı
- Çoklu şirket desteği
- Tenant yapısı
- Rol bazlı erişim
- Satır bazlı erişim
- Alan bazlı erişim
- Mobil uyumluluk
- Güvenlik
- Güvenli oturum yönetimi
- İki aşamalı doğrulama
- Şifre politikası
- IP kısıtlaması
- Hassas alanların maskelenmesi
- KVKK uyumu
- Veri saklama politikası
- Dosya erişim yetkileri
- Log kayıtları
- Eski ve yeni değerlerin kaydı
- Silinen kayıtların geri alınması
- Yedekleme
- Felaket kurtarma
- API güvenliği
- Rate limit
- Dosya tipi ve boyut kontrolü
- Zararlı dosya kontrolü

Rol veya kullanıcı bilgisi yalnızca URL parametresine güvenerek belirlenmemelidir. Yetkiler gerçek kullanıcı oturumundan ve sunucu tarafındaki yetki kayıtlarından türetilmelidir.

---

## 24. YAPAY ZEKÂ DESTEKLİ ÖZELLİKLER

Aşağıdaki yapay zekâ özelliklerini değerlendir:

- Müşteri talebinden ön analiz çıkarma
- Toplantı notlarını özetleme
- Toplantıdan görev çıkarma
- Sohbetten aksiyon çıkarma
- Teklif taslağı hazırlama
- Proje kapsamı oluşturma
- E-posta taslağı oluşturma
- Proje gecikme riski
- Müşteri kaybetme riski
- İş yükü optimizasyonu
- Personel atama önerisi
- Benzer proje maliyet karşılaştırması
- Destek taleplerini sınıflandırma
- Hata önceliklendirme
- Günlük yönetici özeti
- Haftalık operasyon özeti
- Doküman içerisinde arama
- Rapor açıklama ve yorumlama
- Satış fırsatı önerileri

Yapay zekâ kritik kararları tek başına vermemelidir. İnsan onayı gerektiren noktaları belirt.

---

## 25. FAZLANDIRMA

### Faz 1 – Temel Operasyon

- Kullanıcı ve yetkilendirme
- Dashboard
- Bildirimler
- Müşteri adayları
- Müşteriler
- Referans kaynağı
- Satış pipeline
- Ön analiz
- Teklif
- Projeler
- Gelişmiş görev yönetimi
- Departmanlar arası iş talebi
- Temel sohbet
- Personel kartları
- İzin
- Zaman kaydı
- Temel demirbaş
- Temel araç kartı
- Dokümanlar
- Temel raporlar

### Faz 2 – Operasyonel Gelişim

- Sözleşmeler
- Müşteri portalı
- Sprint ve gelişmiş proje yönetimi
- Sohbetten görev oluşturma
- Gelişmiş personel yönetimi
- Performans
- Eğitim ve yetkinlik
- Satın alma
- Tedarikçiler
- Zimmet
- Araç bakım
- Muayene
- Trafik sigortası
- Kasko
- Yakıt ve giderler
- Destek ve bakım
- Gelişmiş müşteri raporları
- Gelişmiş personel raporları

### Faz 3 – Finans, Entegrasyon ve Yapay Zekâ

- Proje kârlılığı
- Müşteri kârlılığı
- Finansal tahminler
- Muhasebe entegrasyonu
- GitHub ve GitLab
- Takvim entegrasyonları
- Slack ve Teams
- E-imza
- Yapay zekâ özellikleri
- Gelişmiş filo analitiği
- Kapasite tahmini
- Otomatik yönetici raporları
- Çoklu şirket
- SaaS lisanslama
- Paket ve abonelik yönetimi

Fazları teknik bağımlılıklara, operasyonel faydaya ve geliştirme maliyetine göre yeniden değerlendir.

---

## 26. CLAUDE’DAN BEKLENEN ÇIKTI

Çalışmayı aşağıdaki sırayla oluştur:

### A. Mevcut Gavia CRM İncelemesi

- Korunacak arayüz yapıları
- Tekrar kullanılacak bileşenler
- Değiştirilecek sektör içerikleri
- Yeni oluşturulması gereken bileşenler
- Tespit edilen arayüz tutarsızlıkları
- Mobil uyumluluk sorunları

### B. Yönetici Özeti

- Projenin amacı
- Şirketin çözülecek temel sorunları
- Beklenen operasyonel fayda
- Beklenen ticari fayda
- Sistemin kapsamı

### C. Modül Haritası

Aşağıdaki kolonlarla tablo halinde çıkar:

| Ana Modül | Alt Modül | Amaç | Kullanıcılar | Temel Özellikler | İlişkili Modüller | Öncelik |
|---|---|---|---|---|---|---|

### D. Kullanıcı Rolleri ve Yetki Matrisi

Aşağıdaki kolonlarla tablo halinde çıkar:

| Rol | Görüntüleme | Ekleme | Düzenleme | Silme | Onay | Rapor | Finans | Personel Verisi |
|---|---|---|---|---|---|---|---|---|

### E. Menü ve Sayfa Haritası

Ana menüleri, alt menüleri ve sayfalar arası bağlantıları çıkar.

### F. Sayfa Analizleri

Her sayfa için:

- Sayfa adı
- Amaç
- Kullanıcılar
- Üst özet kartları
- Sekmeler
- Arama
- Filtreler
- Tablo kolonları
- Form alanları
- Detay sekmeleri
- İşlem butonları
- Toplu işlemler
- Bildirimler
- Yetkilendirme
- Boş durum ekranı
- Hata durumu
- Mobil görünüm
- Kabul kriterleri

### G. Veri Modeli

Her ana kayıt için:

- Tablo veya entity adı
- Alanlar
- Veri türleri
- Zorunlu alanlar
- İlişkiler
- Durum değerleri
- Arşivleme mantığı
- Log kayıtları
- Yetki kapsamı

### H. İş Akışları

Aşağıdaki süreçleri adım adım açıkla:

- Referansla müşteri kazanımı
- Lead’den müşteriye dönüşüm
- Ön analiz
- Teklif ve sözleşme
- Proje başlatma
- Görev atama
- Görev kabulü
- Görev kontrolü
- Revizyon
- Sohbetten görev oluşturma
- Departmanlar arası iş talebi
- İzin talebi
- Satın alma talebi
- Demirbaş zimmeti
- Araç zimmeti
- Araç bakımı
- Sigorta yenilemesi
- Kasko yenilemesi
- Muayene
- Kaza ve hasar
- Destek talebi
- Personel işten ayrılışı

### I. API ve Teknik Servisler

Her ana modül için gerekli:

- Listeleme
- Detay
- Ekleme
- Güncelleme
- Arşivleme
- Silme
- Filtreleme
- Toplu işlem
- Onay
- Raporlama
- Dosya
- Aktivite geçmişi
- API ihtiyaçlarını listele.

### J. Otomasyonlar

Aşağıdaki kolonlarla tablo halinde çıkar:

| Otomasyon | Tetikleyici | Yapılacak İşlem | Kullanıcılar | Bildirim | Fayda |
|---|---|---|---|---|---|

### K. Raporlar

Her rapor için:

- Amaç
- Kullanıcı
- Veri kaynakları
- Filtreler
- KPI’lar
- Grafikler
- Tablo kolonları
- Dışa aktarma
- Yetkilendirme

### L. Geliştirme Yol Haritası

- Fazlar
- Sprintler
- Öncelikler
- Teknik bağımlılıklar
- Riskler
- Başarı kriterleri
- Test senaryoları

### M. Eksik ve Ek Öneriler

Verilen kapsamda bulunmayan fakat yazılım şirketi operasyonlarını kolaylaştıracak özellikleri ayrıca öner.

---

## 27. UYGULAMA VE GELİŞTİRME TALİMATLARI

Mevcut bir kod tabanı verilmişse:

- Önce klasör ve dosya yapısını incele.
- Kullanılan teknoloji ve bileşenleri belirle.
- Çalışan yapıları bozma.
- Tekrar kullanılabilir bileşenleri koru.

Benzer ekranlar için ayrı ve tekrarlı kod yazma.

- Ortak liste bileşeni oluştur.
- Ortak form bileşenleri oluştur.
- Ortak durum etiketi sistemi oluştur.
- Ortak filtre ve kolon sistemi oluştur.
- Ortak dosya yükleme sistemi oluştur.
- Ortak aktivite geçmişi bileşeni oluştur.
- Ortak onay akışı bileşeni oluştur.
- Ortak bildirim yapısı oluştur.
- Responsive tasarımı koru.
- Mevcut tasarım dilinden kopma.

İnşaat sektörüne özgü alanları yazılım şirketine uyarlamadan bırakma.

- Sahte buton veya çalışmayan aksiyon bırakma.
- Oluşturulan ekranlar arasında gerçek navigasyon kur.
- Form doğrulamalarını oluştur.

Boş durum, yüklenme ve hata durumlarını tasarla.

Her geliştirme sonrasında:

- Değiştirilen dosyaları belirt.
- Eklenen bileşenleri listele.
- Oluşturulan ekranları belirt.
- Tamamlanan iş akışlarını açıkla.
- Eksik kalan teknik noktaları dürüstçe yaz.
- Test edilmesi gereken alanları listele.

---

## 28. KABUL KRİTERLERİ

Çalışma aşağıdaki kriterleri karşılamalıdır:

Gavia CRM arayüz diliyle görsel olarak uyumlu olmalı.

- Yazılım şirketinin işleyişine özel olmalı.
- İnşaat sektörüne ait gereksiz terminoloji içermemeli.
- Bütün ana modüller birbirine bağlı çalışmalı.
- Görev sistemi ayrıntılı olmalı.
- Referans ve yönlendiren kişi takibi bulunmalı.

Departmanlar arası sohbet ve iş talebi bulunmalı.

- Sohbetten görev oluşturulabilmeli.
- Müşteri ve personel raporları detaylı olmalı.
- Araçlar özel filo modülünde yönetilmeli.

Bakım, muayene, trafik sigortası ve kasko takip edilmelidir.

- Liste ekranları ortak standart kullanmalıdır.

Arama, filtre, kolon ve çıktı sistemi tutarlı olmalıdır.

- Yetkilendirme yalnızca arayüz seviyesinde kalmamalıdır.
- Aktivite ve değişiklik geçmişi tutulmalıdır.
- Masaüstü ve mobil kullanım desteklenmelidir.

Sistem çoklu şirket ve SaaS yapısına hazırlanabilmelidir.

- Raporlar gerçek operasyonel kararları desteklemelidir.

Kullanıcıların aynı bilgiyi tekrar tekrar girmesi engellenmelidir.

Oluşturulan ekranlar yalnızca görsel prototip olarak kalmamalı, iş süreçleriyle ilişkilendirilmelidir.

---

## 29. ÇALIŞMA KURALLARI

- Yüzeysel ve genel öneriler verme.
- Modülleri yalnızca isim olarak listeleme.
- Her özelliğin nasıl çalışacağını açıkla.

Aynı içeriği farklı modüllerde gereksiz şekilde tekrar etme.

Gereksiz ekran ve karmaşık kullanıcı akışlarından kaçın.

- Kullanıcıların günlük çalışma hızını önceliklendir.
- Yönetici ve personel deneyimini ayrı değerlendir.
- Hassas veriler için özel yetkilendirme oluştur.

Kritik işlemlerde onay ve log mekanizması kullan.

- Raporları yalnızca grafiklerden ibaret bırakma.
- Performansı yalnızca görev adediyle ölçme.

Araçları basit demirbaş kaydı olarak ele alma.

- Referansları yalnızca açıklama alanında tutma.
- Sohbeti iş süreçlerinden bağımsız bırakma.

Her sayfada boş durum, yüklenme durumu ve hata durumunu düşün.

Bütün liste sayfalarında ortak arayüz standardını koru.

Çıktıyı yazılım ekibinin doğrudan tasarım, geliştirme ve test sürecinde kullanabileceği ayrıntıda hazırla.

- Eksik bilgiler nedeniyle çalışmayı durdurma.

Makul varsayımlar yap ve varsayımları açıkça belirt.

Önce analiz et, ardından bilgi mimarisini oluştur, sonra arayüz ve geliştirme adımlarına geç.