# GAVIA CRM — ARAYÜZ VE SİSTEM REVİZE TALİMATI

> Kaynak: `Gavia CRM Arayüz ve Sistem Revize Talimatı.docx`
> (Beyar / 7 Ağustos 2026). `textutil` ile düz metne çevrilip biçimi
> korunarak buraya alındı. **Bu turun tek doğruluk kaynağı bu dosyadır.**

## Proje

Gavia CRM — Yazılım, yapay zekâ ve dijital danışmanlık şirketleri için
geliştirilen CRM / ERP / şirket içi yönetim sistemi.

## Temel Amaç

Mevcut Gavia CRM arayüzünü ve genel sistem mimarisini bozmadan, mevcut
sayfalar ve modüller üzerinde gerekli operasyonel revizeleri gerçekleştir.

Bu çalışma yeni bir CRM tasarlama çalışması değildir.

Ana hedef:

- Mevcut tasarımı korumak
- Mevcut menü yapısını mümkün olduğunca korumak
- Gereksiz yeni sayfa oluşturmamak
- Var olan modülleri birbirine daha doğru bağlamak
- Kullanıcı işlemlerini sadeleştirmek
- Veri tekrarlarını azaltmak
- İş akışlarını netleştirmek
- Yönetim açısından daha güvenilir veriler üretmek

olmalıdır.

---

## GENEL REVİZE KURALLARI

### 1. Mevcut tasarım dili korunacak

Aşağıdaki yapılar değiştirilmeyecek:

- Ana menü tasarımı
- Sidebar yapısı
- Header yapısı
- Kart tasarımları
- Tab yapıları
- Liste tasarımları
- Buton dili
- Form tasarımları
- Modal tasarımları
- Dashboard genel tasarım dili
- Renk sistemi
- Tipografi
- Responsive yapı

Revizeler mevcut sistem tasarımına adapte edilmelidir.

### 2. Gereksiz yeni menü oluşturulmayacak

Mümkün olan bütün geliştirmeler mevcut:

- detay sayfaları,
- tablar,
- kartlar,
- dropdownlar,
- filtreler,
- aksiyon butonları

üzerinden gerçekleştirilmelidir.

Yeni ana menü yalnızca gerçekten zorunlu olduğunda oluşturulmalıdır.

---

## REVİZE 01 — GÖREV DURUM YAPISINI SADELEŞTİR

**Öncelik: KRİTİK**

Mevcut görev sisteminde çok fazla durum bulunmaktadır.
Bu durum kullanıcı tarafında karmaşaya neden olmamalıdır.

### Ana Görev Durumları

Görev yaşam döngüsünü aşağıdaki temel yapı üzerinden standardize et:

`Havuzda → Atandı → Devam Ediyor → Kontrolde → Revizede → Onay Bekliyor → Tamamlandı`

Ek durumlar:

- Engellendi
- İptal Edildi
- Arşivlendi

### Bekleme Durumları

Aşağıdaki durumları ana görev statüsünden çıkar:

- Bilgi Bekliyor
- Müşteri Bekleniyor
- Departman Bekleniyor

Bunları **Bekleme Nedeni** alanına taşı.

Örnek:

> Durum: Devam Ediyor · Bekleme Nedeni: Müşteri Yanıtı Bekleniyor

Bekleme nedeni seçenekleri:

- Müşteri
- Departman
- Bilgi
- Dosya
- Teknik Karar
- Yönetici Onayı
- Diğer

Görev liste ekranının tasarımını değiştirme.
Mevcut durum badge yapısını kullan.

---

## REVİZE 02 — GÖREV GEÇİŞLERİNİ KONTROLLÜ HALE GETİR

**Öncelik: KRİTİK**

Kullanıcı görev durumunu rastgele değiştirememelidir.

Temel akış:

`Havuzda → Atandı → Devam Ediyor → Kontrolde`

Kontrol sonucunda: **Onayla** veya **Revizeye Gönder**

Revize: `Revizede → Kontrolde`

Onay gerekiyorsa: `Kontrolde → Onay Bekliyor → Tamamlandı`

Onay gerekmiyorsa: `Kontrolde → Tamamlandı`

Görev detayında kullanıcının yapabileceği bir sonraki işlem mümkün olduğunca
aksiyon butonları ile gösterilsin.

Örnek:

- Çalışmaya Başla
- Kontrole Gönder
- Revizeye Gönder
- Onayla
- Tamamla
- İptal Et

Kullanıcıya uzun statü dropdownları göstererek süreci karmaşıklaştırma.

---

## REVİZE 03 — PROJEDE HARCANAN SÜREYİ TIMESHEET'TEN OTOMATİK GETİR

**Öncelik: KRİTİK**

Proje kartındaki **Harcanan Süre / Gerçekleşen Süre** manuel veri olmamalıdır.
Bu değer sistemdeki onaylanmış zaman kayıtlarından otomatik hesaplanmalıdır.

### Yapı

**Planlanan Süre** — Proje planı veya görev tahminlerinden oluşabilir.

**Gerçekleşen Süre** — Onaylanmış Timesheet kayıtlarından otomatik gelsin.

**Faturalandırılabilir Süre** — Billable olarak işaretlenen onaylı zaman
kayıtlarından hesaplansın.

Proje ekranında üç değer göster:

- Planlanan
- Gerçekleşen
- Faturalandırılabilir

Mevcut proje kartı tasarımını bozma.
Bu bilgiler mevcut KPI/kart alanlarında gösterilebilir.

---

## REVİZE 04 — PROJE MALİYETİNİ OTOMATİK HESAPLA

**Öncelik: KRİTİK**

Proje içerisindeki **Gerçekleşen Maliyet** sadece manuel girilen tek bir
rakam olmamalıdır. Aşağıdaki kaynaklardan oluşmalıdır:

**Personel Maliyeti** — Onaylanmış çalışma süresi × personelin sistemde
tanımlı iç maliyet değeri.

**Dış Kaynak** — Projeye bağlı freelancer / ajans / dış hizmet maliyeti.

**Satın Alma** — Projeye bağlanmış satın alma kayıtları.

**Diğer Proje Giderleri** — Projeye ilişkilendirilmiş diğer giderler.

### Proje Finans Kartı

Mevcut tasarım içinde:

Proje Geliri · Personel Maliyeti · Dış Kaynak · Satın Alma / Gider ·
Toplam Maliyet · Brüt Kâr · Kârlılık %

göster.

Yeni bir finans modülü oluşturma.
Mevcut proje detayındaki finans/bütçe alanını geliştir.

---

## REVİZE 05 — PROJE DURUMU VE PROJE FAZINI AYIR

**Öncelik: YÜKSEK**

Proje içerisindeki **Durum** ile **Faz** aynı kavram olmamalıdır.

### Proje Durumu

Önerilen temel yapı:

- Planlama
- Aktif
- Kontrol / Test
- Teslim Sürecinde
- Askıda
- Tamamlandı
- İptal Edildi

### Proje Fazı

Projeye göre değişebilir. Örnek:

- Faz 1 / Faz 2 / Faz 3

veya:

- Analiz / Tasarım / Geliştirme / Test

Buradaki fazlar proje yapısına göre kullanılabilir.
**Tamamlandı, proje fazı olarak kullanılmamalıdır.**

---

## REVİZE 06 — MILESTONE VE ÖDEME PLANINI AYIR

**Öncelik: YÜKSEK**

Proje milestone ile ödeme taksitleri aynı kayıt gibi davranmamalıdır.

### Proje Milestone

Örnek:

- Analiz Tamamlandı
- Tasarım Onaylandı
- MVP Tamamlandı
- Beta Yayını
- Canlıya Alma

Milestone alanları:

- Başlık
- Tarih
- Sorumlu
- Durum
- Açıklama
- İlgili teslimat

### Ödeme Planı

Örnek:

- %30 Başlangıç
- %30 Tasarım Onayı
- %40 Teslim

İstenirse ödeme kaydında **İlgili Milestone** seçilebilir.
Ancak milestone ile ödeme aynı nesne olmamalıdır.

Mevcut proje detay ekranında mümkünse ayrı tab/kart kullan.

---

## REVİZE 07 — PROJE KAPANIŞ AKIŞI EKLE

**Öncelik: YÜKSEK**

Yeni bir ana menü oluşturma.
Proje detay ekranına **Projeyi Kapat** aksiyonu ekle.

Kapatma işlemi öncesinde sistem aşağıdaki kontrolleri göstersin:

### Proje Kapanış Kontrolü

- Açık görev var mı?
- Kontrolde görev var mı?
- Açık revizyon var mı?
- Teslimatlar tamamlandı mı?
- Müşteri onayı alındı mı?
- Eksik doküman var mı?
- Açık finansal işlem var mı?
- Bakım/destek hizmeti başlayacak mı?

Kullanıcıya sade bir checklist göster.
Sonrasında **Projeyi Kapat** işlemi yapılabilsin.

---

## REVİZE 08 — PROJE KAPANIŞINDAN DESTEK / BAKIMA GEÇİŞ

**Öncelik: YÜKSEK**

Proje kapanırken sistem kullanıcıya şu soruyu sorsun:

> Bu proje için bakım veya destek hizmeti başlatılacak mı?

Seçenekler:

- Hayır
- Mevcut bakım paketine bağla
- Yeni bakım paketi oluştur

Bakım başlangıç tarihi ve sözleşme ilişkisi oluşturulabilsin.

Ama bu ekran proje kapatma modalı içerisinde veya mevcut bakım alanları
kullanılarak çözülmelidir. Yeni ayrı operasyon ekranı oluşturma.

---

## REVİZE 09 — DESTEK / TICKET DETAYINI GELİŞTİR

**Öncelik: YÜKSEK**

Mevcut ticket modülü korunacak. Ticket detayına aşağıdaki alanları ekle:

### Talep Bilgileri

- Talep Konusu
- Talep Açıklaması
- Müşteri
- Proje
- Kategori
- Öncelik
- Talebin Geldiği Kanal

Kanal:

- Müşteri Portalı
- E-posta
- Telefon
- WhatsApp
- Toplantı
- Manuel
- Diğer

### Çözüm Bilgileri

- Çözüm Açıklaması
- Çözüm Tarihi
- Çözen Personel
- Müşteri Onayı
- Kapanış Tarihi

### Ticket Durumları

Sade tutulmalı:

- Yeni
- Atandı
- Çalışılıyor
- Müşteri Bekleniyor
- Çözüldü
- Kapatıldı

İhtiyaç halinde **Yeniden Açıldı** kullanılabilir.

SLA yapısını koru.

---

## REVİZE 10 — TICKET'TAN DOĞRU AKIŞI BAŞLAT

**Öncelik: YÜKSEK**

Her ticket otomatik olarak görev olmamalıdır.

Ticket detay ekranında **İşleme Dönüştür** aksiyonu ekle.

Seçenekler:

**Göreve Dönüştür** — Bug veya mevcut kapsam dahilindeki teknik işlerde.

**Revizyon / Change Request Oluştur** — Mevcut projenin kapsam
değişikliklerinde.

**Satış Fırsatı Oluştur** — Müşterinin yeni proje veya yeni özellik
talebinde.

Böylece `Destek → Operasyon` ve `Destek → Yeni Satış` ilişkileri kurulmuş
olur.

---

## REVİZE 11 — PROJE OLUŞTURURKEN PROJE KAYNAĞINI BELİRLE

**Öncelik: YÜKSEK**

Proje oluşturma formuna **Proje Kaynağı** alanı ekle.

Seçenekler:

- Müşteri Sözleşmesi
- İç Proje
- Satış Öncesi / PoC
- Bakım / Destek
- Diğer

### Müşteri Sözleşmesi seçilirse

Sözleşme seçimi zorunlu olsun.
Seçilen sözleşmeden mümkün olduğunca:

- Müşteri
- Proje adı
- Sözleşme tutarı
- Başlangıç / bitiş
- Hizmet kapsamı
- Ödeme planı

gibi mevcut bilgiler otomatik getirilsin.

Mevcut manuel proje oluşturma özelliğini kaldırma.

---

## REVİZE 12 — SÖZLEŞME SORUMLUSU EKLE

**Öncelik: YÜKSEK**

Sözleşme detayına **Sözleşme Sorumlusu** alanı ekle.

Bu kişi:

- imza sürecini,
- sözleşme bitişini,
- yenilemeyi,
- fiyat revizyonunu,
- bakım yenilemesini

takip eden operasyonel sorumlu olsun.

Varsayılan değer:

- Account Manager veya
- Proje Yöneticisi

olabilir. Kullanıcı gerektiğinde değiştirebilsin.

---

## REVİZE 13 — MÜŞTERİ PORTALINI MEVCUT YAPI ÜZERİNDEN GELİŞTİR

**Öncelik: YÜKSEK**

Müşteri için ayrı ve karmaşık bir ERP ekranı oluşturma.
Mevcut müşteri rolünü geliştir.
Müşteri yalnızca kendi şirketine ait bilgileri görmelidir.

### Müşteri Portalı

**Dashboard**

- Aktif projeler
- Bekleyen onaylar
- Son teslimatlar
- Açık destek talepleri
- Yaklaşan toplantılar

**Projelerim** — Müşteri:

- proje durumunu,
- milestone'ları,
- teslimatları,
- müşteri onayı bekleyen kayıtları

görebilsin.

**Destek**

- Yeni destek talebi
- Açık talepler
- Çözülen talepler

**Dokümanlar**

- Teklif
- Sözleşme
- Proje dokümanı
- Teslim dosyası

**Finans** — Yetki verilmişse:

- Faturalar
- Ödeme durumu

gösterilebilir.

### Kesinlikle Gösterilmemesi Gerekenler

- İç personel maliyetleri
- İç proje kârlılığı
- Personel timesheet detayları
- İç görev yorumları
- Yönetici notları
- İç finansal bilgiler

---

## REVİZE 14 — SATIŞ PIPELINE ARAYÜZÜNÜ SADELEŞTİR

**Öncelik: ORTA**

Mevcut detaylı satış aşamalarını sistemden kaldırma.
Ancak ana Pipeline / Kanban ekranında çok fazla kolon gösterilmesini engelle.

Aşamaları görsel olarak ana gruplara ayır:

1. Yeni / Kalifikasyon
2. Analiz
3. Teklif
4. Pazarlık
5. Sözleşme
6. Sonuç

Kart veya detay ekranında gerçek alt aşama gösterilmeye devam edebilir.
Ama ana satış ekranı ilk bakışta okunabilir olmalıdır.

---

## REVİZE 15 — DEPARTMAN VE UZMANLIK YAPISINI SADELEŞTİR

**Öncelik: ORTA**

Şirket küçük veya orta ölçekli olduğu için her teknik uzmanlığı ayrı
departman yapmak zorunlu olmamalıdır.

### Önerilen Departman Yapısı

- Yönetim & Operasyon
- Satış & Müşteri
- Proje / Ürün
- Yazılım
- Yapay Zekâ & Data
- Tasarım
- Destek
- Finans / Kurumsal

### Uzmanlık / Rol

Yazılım altında:

- Frontend
- Backend
- Full-stack
- Mobile
- DevOps
- QA

AI altında:

- AI Development
- Automation
- Machine Learning
- AI Integration
- Prompt / Agent

gibi uzmanlıklar tutulabilir.

Mevcut departman verilerini silme.
Yapıyı yeni modele uyarlanabilir hale getir.

---

## REVİZE 16 — FREELANCER / DIŞ KAYNAĞI DEPARTMAN OLARAK KULLANMA

**Öncelik: ORTA**

Freelancer ve dış kaynak çalışanları departman değil **Çalışma Tipi**
olarak tanımla.

Seçenekler:

- Kadrolu
- Freelancer
- Ajans
- Danışman
- Dış Kaynak

Personelin yine gerçek departmanı ve uzmanlığı bulunabilir.

---

## REVİZE 17 — TEKRARLAYAN HİZMETLERİ MEVCUT BAKIM PAKETİ ÜZERİNDEN GENİŞLET

**Öncelik: ORTA**

Yeni bir abonelik modülü oluşturma.
Mevcut bakım / periyodik hizmet yapısını **Hizmet Paketi / Abonelik**
mantığında genişlet.

Paket tipi:

- Bakım
- Teknik Destek
- SaaS
- Hosting
- AI Kullanım Paketi
- API Kullanım Paketi
- Danışmanlık
- Saat Paketi
- Lisans
- Diğer

Alanlar:

- Müşteri
- Hizmet
- Başlangıç
- Bitiş
- Periyot
- Tutar
- Yenileme tarihi
- Sorumlu
- Durum

Mevcut sözleşme ve yenileme sistemini kullan.

---

## REVİZE 18 — FİLO VE DÜŞÜK KULLANIMLI MODÜLLERİ OPSİYONEL HALE GETİR

**Öncelik: DÜŞÜK**

Araç / filo modülünü kaldırma.
Ancak şirketin aracı yoksa gereksiz menü kalabalığı yaratmamalıdır.

Firma ayarlarına **Aktif Modüller** alanı eklenebilir.

Örnek:

> ☑ Satış ☑ Projeler ☑ Destek ☑ Personel ☑ Finans ☑ Satın Alma
> ☑ Demirbaş ☐ Filo

Modül kapatıldığında veri silinmemeli.
Sadece ilgili menü kullanıcıdan gizlenmelidir.

---

## REVİZE 19 — ARAÇ SAYFALARINI GEREKSİZ YERE ÇOĞALTMA

**Öncelik: DÜŞÜK**

Araç sayısı düşük şirketlerde:

- Muayene
- Sigorta
- Kasko
- Bakım
- Yakıt
- Ceza
- Gider

ayrı ana menüler olmamalıdır.

Mevcut **Araç Detay** ekranında tab yapısı kullanılabilir:

Genel · Evraklar · Bakım · Sigorta & Muayene · Yakıt · Giderler ·
Hareket Geçmişi

Merkezi listeler yalnızca gerçekten ihtiyaç olduğunda kullanılmalıdır.

---

## REVİZE 20 — RAPORLAMA EKRANINI BÜYÜTME, GRUPLA

**Öncelik: ORTA**

Her metrik için yeni rapor sayfası oluşturma.
Mevcut rapor yapısını ana kategorilere ayır:

**Satış** — Pipeline · Lead Kaynakları · Teklif Kazanma Oranı

**Proje** — Proje Sağlığı · Planlanan / Gerçekleşen · Proje Kârlılığı

**İnsan Kaynağı** — Kapasite · İş Yükü · Proje Dağılımı

**Finans** — Gelir · Gider · Tahsilat · Bekleyen Ödeme · Tekrarlayan Gelir

**Destek** — Açık Ticket · SLA · Çözüm Süresi

**Sözleşmeler** — Yaklaşan Bitişler · Yenilemeler

Rapor ekranında ilk açılışta bütün raporları kullanıcıya aynı anda gösterme.

---

## ARAYÜZ İÇİN GENEL UYGULAMA PRENSİBİ

Her liste ekranında aynı kullanıcı alışkanlığı korunmalıdır.

Gerekliyse:

- Arama
- Hızlı filtre
- Durum
- Sorumlu
- Müşteri
- Proje
- Tarih
- Kolonlar
- Arşiv

bulunabilir.

Ancak her listeye bütün filtreleri ekleme.
Örneğin bir sözleşme ekranına teknik departman filtresi eklemek gibi
gereksiz filtrelerden kaçın.

---

## DETAY SAYFASI STANDARDI

Müşteri, proje, sözleşme, personel, ticket ve benzeri ana detay ekranlarında
mümkün olduğunca aynı bilgi hiyerarşisini kullan.

**Üst Bilgi**

- Kayıt adı
- Durum
- Sorumlu
- Kritik bilgi
- Ana aksiyon

**Özet** — En önemli KPI ve bilgiler.

**Sekmeler** — İlgili alt kayıtlar.

**Hareket Geçmişi**

- Kim?
- Ne yaptı?
- Ne zaman?
- Eski değer
- Yeni değer

kritik işlemlerde görülebilmelidir.

---

## DASHBOARD İÇİN REVİZE PRENSİBİ

Dashboard'a yeni dekoratif grafikler ekleme.
Yönetici ilk açılışta şu sorulara cevap alabilmelidir:

- Bugün ne gecikiyor?
- Hangi proje riskte?
- Hangi teklif cevap bekliyor?
- Hangi tahsilat gecikti?
- Hangi ticket SLA riski taşıyor?
- Hangi sözleşme veya abonelik yenilenecek?
- Personel kapasitesinde sorun var mı?

Mevcut dashboard kartları bu amaçla düzenlenmelidir.

---

## BİLDİRİM PRENSİBİ

Her işlem için bildirim oluşturma.
Aşağıdaki olayları önceliklendir:

- Yeni görev atandı
- Görev gecikti
- Kritik deadline yaklaştı
- Teklif onay bekliyor
- Teklif müşteri cevabı bekliyor
- Sözleşme bitiyor
- Abonelik yenileniyor
- Tahsilat gecikti
- Ticket SLA riski oluştu
- Müşteri onayı bekleniyor
- İzin / avans onay bekliyor
- Araç muayene/sigorta tarihi yaklaşıyor

Bildirim merkezi bilgi kirliliğine dönüşmemelidir.

---

## YAPILMAMASI GEREKENLER

Bu revize sırasında:

- Tasarımı baştan oluşturma.
- Sidebar'ı değiştirme.
- Renk sistemini değiştirme.
- Yeni UI framework kullanma.
- Mevcut komponentleri gereksiz yeniden tasarlama.
- Yeni ana modüller ekleyerek sistemi büyütme.
- Backend mimarisi geliştirme önerisi yapma.
- API tasarımı yapma.
- Demo verileri gerçek veri kabul etme.
- Çalışan mevcut modülleri kaldırma.
- Aynı özelliği iki farklı yerde yeniden oluşturma.
- Gereksiz form alanları ekleme.
- Kullanıcıyı daha fazla tıklamaya zorlama.

---

## UYGULAMA ÖNCELİĞİ

Revizeleri aşağıdaki sırayla uygula.

### FAZ 1 — KRİTİK

- Görev durumlarını sadeleştir. *(R01)*
- Görev geçiş algoritmasını düzenle. *(R02)*
- Timesheet → Proje Gerçekleşen Süre bağlantısını kur. *(R03)*
- Timesheet / gider → Proje Gerçek Maliyeti bağlantısını düzenle. *(R04)*

### FAZ 2 — OPERASYON

- Proje Durum / Faz ayrımını yap. *(R05)*
- Milestone / Ödeme ayrımını yap. *(R06)*
- Proje kapanış kontrolünü ekle. *(R07)*
- Proje → Bakım / Destek geçişini oluştur. *(R08)*
- Ticket detaylarını tamamla. *(R09)*
- Ticket → Görev / Change Request / Fırsat bağlantısını ekle. *(R10)*

### FAZ 3 — TİCARİ VE MÜŞTERİ

- Proje kaynağını ekle. *(R11)*
- Sözleşme sorumlusunu ekle. *(R12)*
- Müşteri portalını geliştir. *(R13)*
- Bakım paketini Hizmet Paketi / Abonelik mantığına genişlet. *(R17)*

### FAZ 4 — SADELEŞTİRME

- Pipeline görünümünü grupla. *(R14)*
- Departman / uzmanlık yapısını sadeleştir. *(R15)*
- Freelancer / dış kaynak yapısını düzenle. *(R16)*
- Opsiyonel modül kullanımını oluştur. *(R18)*
- Araç sayfalarını detay tablarında sadeleştir. *(R19)*
- Raporları ana kategoriler altında grupla. *(R20)*

---

## SON HEDEF

Revizyon tamamlandığında kullanıcı yeni bir sistem kullanıyormuş hissine
kapılmamalıdır. Gavia CRM'in mevcut tasarımı ve kullanım alışkanlığı
korunmalı; ancak sistemin arka plandaki operasyon mantığı daha doğru hale
gelmelidir.

Özellikle aşağıdaki zincirler kesintisiz çalışmalıdır:

1. `Lead → Fırsat → Teklif → Sözleşme → Proje`
2. `Proje → Görev → Timesheet → Maliyet → Kârlılık`
3. `Proje → Teslim → Müşteri Onayı → Kapanış → Bakım / Destek`
4. `Müşteri → Ticket → Görev / Revizyon / Yeni Fırsat`
5. `Personel → Görev → Çalışma Süresi → Kapasite → Proje Maliyeti`

**Ana prensip:** Yeni özellik eklemekten önce mevcut özellikleri birbirine
doğru bağla.

**İkinci prensip:** Mevcut arayüzü değiştirme; arayüzün içerisinde daha
doğru operasyonel akış oluştur.

**Üçüncü prensip:** Her yeni alan veya buton, kullanıcının gerçek bir
operasyonel problemini çözmüyorsa ekleme.

Revize sonucunda sistem; daha büyük değil, daha sade, daha bağlantılı, daha
güvenilir ve günlük kullanıma daha uygun hale gelmelidir.
