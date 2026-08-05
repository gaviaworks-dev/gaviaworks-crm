# B. Yönetici Özeti — GaviaWorks CRM / ERP / Operasyon Yönetim Sistemi

> **Neyden türetildi:** Bu belge diğer on bir çıktının (A · C · D · E · F · G · H · I · J · K · L)
> üzerine yazılmıştır; içindeki her sayı o belgelerde ölçülerek elde edilmiştir, tahmin yoktur.
> Ek kaynak: `assets/data/*.js` canonical mock veri, `tasks/plan.md` kapsam listesi,
> `tasks/ui-debt.md` borç defteri. Ölçüm tarihi 2026-08-05 (9. oturum).
>
> **Kapsam uyarısı — bu bir ARAYÜZ PROTOTİPİDİR.** Backend, veritabanı ve gerçek API yoktur.
> Veri tarayıcı belleğinde `assets/data/*.js` içinde durur; sayfa yenilendiğinde değişiklikler
> silinir. Aşağıdaki "fayda" bölümleri sistemin **hedeflediği** değeri anlatır, bugün
> ölçülmüş bir işletme kazancını değil.

---

## 1. Projenin amacı

Gavia Works'ün satış öncesinden tahsilata kadar uzanan tüm operasyonunu **tek bir ekran
dilinde** toplayan, rol tabanlı bir yönetim sistemi kurmak.

Bugün bu operasyon parçalı araçlarla yürüyor: müşteri adayı bir yerde, teklif başka yerde,
proje ve görev üçüncü bir yerde, fatura ve tahsilat dördüncü yerde tutuluyor. Aradaki bağ
insan hafızasında ve e-postada yaşıyor. Sistemin amacı bu bağı **veriye yazmak** — bir teklif
hangi ön analizden doğdu, hangi sözleşmeye dönüştü, o sözleşme hangi taksitlere bölündü,
hangi teslime bağlandı, hangi fatura kesildi, tahsil edildi mi — hepsi tek zincirde okunabilsin.

Bu proje o sistemin **arayüz katmanını** uçtan uca kurar: 141 ekran, gerçek veriyle,
gerçek yetki kurallarıyla, çalışan akışlarla. Backend yazıldığında üzerine oturacağı
sözleşme bu prototiple tanımlanmış olur.

---

## 2. Şirketin çözülecek temel sorunları

Aşağıdaki sorunlar `PROMPT.md`'nin tarif ettiği ihtiyaçtan ve prototipin veri modelinden
çıkarılmıştır; her birinin sistemdeki karşılığı ölçülebilir bir ekran ya da zincirdir.

| # | Sorun | Sistemdeki karşılığı |
|---|---|---|
| 1 | **Satış hunisi görünmüyor** — hangi aday hangi aşamada, ne kadar bekledi, neden tıkandı | 15 aşamalı pipeline + aşama başına max bekleme ve gecikme uyarısı (`app-pipeline`) |
| 2 | **Referansla gelen iş takip edilemiyor** — kim getirdi, ne kadar ciro yaptı, komisyonu ödendi mi | 17 referans türü · yönlendiren kartı · komisyon zinciri (`app-referans` → `app-komisyon`) |
| 3 | **Teklif ile sözleşme arasındaki bağ kopuk** — teklif neyi vaat etti, sözleşme neyi bağladı | Teklif → sözleşme → taksit → fatura → tahsilat zinciri veride **yazılı bağ** olarak |
| 4 | **İş yükü dağılımı bilinmiyor** — kim ne kadar dolu, kim boşta, kim geciktiriyor | Kapasite ve doluluk ekranı + 19 durumlu görev sistemi + departman iş yükü |
| 5 | **Görev sistemi zayıf** — atama, kabul, kontrol, revizyon adımları takip edilmiyor | 19 durum · 18 tür · onay zinciri · alt görev · bağımlılık · 13 sekmeli görev listesi |
| 6 | **Destek talebi SLA'sı ölçülmüyor** | Kategori × öncelik SLA matrisi, ilk yanıt ve çözüm ekseninde tüketim hesabı |
| 7 | **Proje kârlılığı geç anlaşılıyor** | Bütçe ↔ gerçekleşen maliyet karşılaştırması, sözleşme bedeliyle birlikte |
| 8 | **Tahsilat gecikmesi geç fark ediliyor** | Vade takibi, gecikme kademesi, geciken tahsilat KPI'ı ve hatırlatma aksiyonu |
| 9 | **Demirbaş ve araç maliyeti dağınık** | Ayrı filo modülü: bakım · muayene · sigorta · kasko · yakıt · 18 kalem gider · kaza/ceza |
| 10 | **Yetki denetimi gerçek değil** — herkes her şeyi görüyor | 27 rol × yetki matrisi, sayfa düzeyinde 403 kapısı, alan bazlı maskeleme |
| 11 | **Aynı bilgi tekrar tekrar giriliyor** | Canonical veri disiplini — aynı kayıt no her ekranda aynı değeri gösterir, tarama ile doğrulanır |
| 12 | **Kurumsal hafıza yok** — kim ne zaman neyi değiştirdi | Aktivite geçmişi + log kaydı (eski değer → yeni değer) |

---

## 3. Sistemin kapsamı

### Ölçülmüş büyüklük

| Eksen | Sayı |
|---|---|
| Ekran | **141** (liste · **26** detay · **36** form · 8 rapor · 7 panel · ayarlar) |
| Ana modül | **15** rail bölümü, **89** alt menü kalemi |
| Rol | **27** rol, **7** dashboard varyantı |
| Veri koleksiyonu | **76** dizi + sözlük, toplam **767** kayıt |
| İş akışı | **22** akış, adım adım belgelenmiş |
| Rapor | **103** rapor, 8 rapor ekranında |
| Otomasyon kuralı | **22** kural · **31** bildirim tipi × 7 kanal |
| Ortak bileşen yüzeyi | **38** `GV.*` üyesi (`shell.js` 12 · `ui.js` 25 · `dashboard.js` 1) |

### Modül kapsamı

Satış ve CRM · Müşteriler · Projeler · Görevler · Destek ve Bakım · Sohbet ·
Personel ve İK · Demirbaş ve Filo · Satın Alma · Finans · Dokümanlar · Toplantılar ·
Raporlar · Ayarlar ve Yetkilendirme.

### Kapsam DIŞI olan

- **Backend, veritabanı, gerçek API.** Prototip buildless HTML/CSS/JS'tir.
- **Kimlik doğrulama.** Giriş ekranı bir persona seçicidir, gerçek oturum açma değildir.
- **Ödeme altyapısı, e-fatura entegrasyonu, e-imza.** Ayar ekranında yeri var, bağlantısı yok.
- **SaaS abonelik ve lisans yönetimi.** Çoklu şirket (tenant) listesi var, faturalama yok.
- **Ayrı müşteri portalı.** Müşteri rolü aynı uygulamada kısıtlı görünüm alır.

---

## 4. Beklenen operasyonel fayda

| Fayda | Nasıl doğar | Bugün prototipte ölçülebilen |
|---|---|---|
| **Tek kaynaktan gerçek** | Aynı kayıt her ekranda aynı değerle görünür; sayaçlar veriden türetilir | `canon.js` **18 eksende** her turda doğruluyor; türetilebilir sayacın veriye yazılması yasak (ders L-08) |
| **Zincirin uçtan uca okunması** | Modüller arası bağ veriye **yazılır**, tarih yakınlığından tahmin edilmez | Bağ alanı sözleşmesi `components.md` §9d'de; teklif→sözleşme→taksit→fatura→tahsilat zinciri kapalı |
| **Gecikmenin erken görünmesi** | Termin, vade, SLA, poliçe yenilemesi eşik bazlı uyarı üretir | Yenileme eşikleri 60/30/15/7 gün; SLA tüketimi ≥0,75 "risk altında" |
| **Yetkinin arayüzde bitmemesi** | Menü gizleme yetmez; sayfa düzeyinde 403, alan düzeyinde maskeleme | 403 kapısı ve maskeleme kurulu — **satır kapsamı henüz değil** (UID-05) |
| **Onayın izlenebilir olması** | Çok aşamalı onay zinciri görselleştirilir | Satın almada tutar eşikli 6 makamlı zincir çalışıyor |
| **Mobilde kullanılabilirlik** | Her liste mobil kart ikizi üretir | 1440/768/390'da konsol ve taşma temiz — **mobil satır aksiyonu eksik** (UID-02) |

---

## 5. Beklenen ticari fayda

Bu bölüm **niyet beyanıdır**; prototip üzerinden ölçülmüş bir gelir etkisi yoktur ve
uydurulmamıştır. Sistemin hangi mekanizmayla ticari değer üretmesinin beklendiği yazılmıştır.

1. **Kayıp fırsatın azalması.** Pipeline'da max bekleme aşımı görünür olduğunda, unutulan
   aday sayısı düşer. Ölçüm yöntemi: aşama başına ortalama bekleme süresi ve "tıkanan
   fırsat" sayısı — ikisi de bugün raporlanabiliyor.
2. **Referans kanalının büyümesi.** Yönlendiren başına getirilen ciro ve ödenen komisyon
   görünür olunca, kanalın hangi kişiler üzerinden işlediği ölçülebilir hâle gelir.
3. **Tahsilat süresinin kısalması.** Vade ve gecikme kademesi bir KPI olarak yönetim
   panelinde durduğunda takip erkene çeker.
4. **Proje kârlılığının korunması.** Bütçe ↔ gerçekleşen maliyet sapması proje süresince
   izlenebilir; bugün 8 projenin 1'inde gerçekleşen maliyet bütçeyi aşmış durumda
   (PRJ-2026-006: 139.000 / 120.000) ve bu **ekranda görünüyor**.
5. **Bakım ve destek gelirinin düzenlenmesi.** Bakım paketi kota tüketimi ölçüldüğünde,
   kotayı aşan müşteri ek satış fırsatına dönüşür.
6. **SaaS'a hazırlık.** Çoklu şirket (tenant) ekseni veri modelinde ve ayar ekranında
   kurulu; ürünün başka şirketlere satılması için altyapı engeli yok.

---

## 6. Bugünkü durum ve dürüst değerlendirme

### Ne bitti

Ekran üretimi **tamamlandı**: 141 ekranın 141'i yayında, 36 form ekranının 36'sı çalışıyor,
26 detay ekranı gerçek kayıtla açılıyor. On iki doküman çıktısının on ikisi yazıldı.
Canonical veri disiplini 18 eksende otomatik doğrulanıyor.

### Ne bitmedi

`tasks/plan.md` ölçümüne göre **213 / 280 madde (%76)**; 22 kısmen, 45 açık.
Kalan işin ağırlığı **kalite geçişinde**: `tasks/ui-debt.md`'de 29 arayüz borcu (UID) ve
27 veri borcu (VB) kayıtlı.

### Yönetimin bilmesi gereken üç şey

1. **En büyük tek açık: sahte toplu işlem (UID-27).** `GV.list` bileşeni, `run` yordamı
   olmayan bir toplu işlemde **yeşil "N kayıt işlendi" başarı mesajı basıyor ve hiçbir şey
   yapmıyor.** Ölçüldü: **79 aksiyon, 47 ekran.** Kullanıcı onayı veriyor, başarı mesajını
   görüyor, veri değişmiyor. Kök neden ortak bileşende ve tek satırda; düzeltme 47 ekranın
   toplu işlem tanımlarının gözden geçirilmesini gerektiriyor. Bu, prototipin
   **canlıya çıkmadan önce kapatılması zorunlu** tek maddesidir.

2. **Prototipin ölçeği şirketin beyan edilen ölçeğiyle uyuşmuyor.** `CLAUDE.md` Gavia
   Works'ü **5–7 kişilik** bir şirket olarak tanımlıyor; veri modeli **16 personel ve
   21 departman** kurguluyor. 16 kişiye 21 departman gerçekçi değil. Bu bir hata değil
   bir **karar sorusudur**: sistem bugünkü Gavia Works için mi tasarlanıyor, yoksa
   büyüdüğünde ulaşacağı ölçek için mi? İkincisiyse departman sayısı makul; birincisiyse
   veri modeli sadeleşmeli. Karara bağlanması gerekiyor.

3. **Kalan iş madde sayısından ağır.** %76 ekran ağırlıklı bir orandır. Kalan 45 açık
   maddenin çoğu ortak katmanda kök nedenden çözüm gerektiriyor ve her düzeltmeden sonra
   etkilenen tüm ekranların üç kırılımda yeniden doğrulanması gerekiyor — örneğin UID-26
   (kolon/filtre/çıktı/toplu işlem/kanban'ın `GV.list` içine kilitli olması) tek başına
   dört ayrı borç maddesinin ortak köküdür ve `GV.list` kullanan 65+ ekranı etkiler.

### Neden bu hatalar geç bulundu

Hepsi aynı sınıftan: **ölçüm ekseni olmayan hata görünmez.** Teklif→sözleşme KDV
çift uygulaması (VB-19) beş oturum boyunca sessizdi çünkü zincirin geri kalanı yanlış
çapaya göre tutarlıydı; sahte toplu işlem (UID-27) görünmedi çünkü hiçbir tarama
"buton gerçekten bir şey yapıyor mu" diye sormuyordu. Projenin `tasks/lessons.md`
defterindeki 20 dersin dördü doğrudan bu konuda: *konsol temiz ≠ ekran doğru* ·
*toast çıktı ≠ işlem oldu* · *araç "temiz" dedi ≠ doğru şeyi ölçtü* ·
*doğru adresi kurdu ≠ doğru kaydı yükledi*. Her yeni hata sınıfı için taramaya bir
eksen eklenmesi bu projenin çalışan kalite mekanizmasıdır ve sürdürülmelidir.
