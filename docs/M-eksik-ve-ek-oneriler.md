# M. Eksik ve Ek Öneriler — GaviaWorks CRM

> **Neyden türetildi:** `tasks/ui-debt.md` borç defteri (29 UID + 27 VB) · `tasks/plan.md`
> açık ve kısmen maddeleri · diğer on bir doküman çıktısının "boşluklar" bölümleri ·
> `PROMPT.md` §26-M'nin isteği. Ölçüm tarihi 2026-08-05 (9. oturum).
>
> **İki bölüm birbirinden ayrıdır ve karıştırılmamalıdır:**
> **Bölüm A — EKSİK:** PROMPT.md'nin **istediği** ama bugün sistemde **olmayan** şeyler.
> Bunlar öneri değil, kapatılması gereken kapsam açığıdır.
> **Bölüm B — EK ÖNERİ:** PROMPT.md'de **hiç istenmemiş**, ama bir yazılım şirketinin
> operasyonunu kolaylaştıracağı için önerilen şeyler. Bunlar kapsam genişletmesidir,
> karar Beyar'ındır.

---

# BÖLÜM A — EKSİKLER (istenmiş, yapılmamış)

## A1. Kapsam açıkları — ekran ya da koleksiyon hiç yok

| # | Eksik | PROMPT.md nerede istiyor | Bugünkü durum |
|---|---|---|---|
| 1 | **Personel işe giriş / işten ayrılış** | §14; menü haritası bölüm 8'de "İşe Giriş/Çıkış" yazılı | Ekran **yok**, menü kaydı **yok**, koleksiyon **yok**. İş akışı listesindeki 22 akıştan biri hiç kurulmadı |
| 2 | **Görev kontrol listesi (checklist)** | §12 "kontrol listesi" | `DB.subtasks` ve `DB.taskDeps` var, **checklist koleksiyonu yok** |
| 3 | **Zaman kaydı zamanlayıcısı (start/stop)** | §14 | Yalnız manuel giriş var |
| 4 | **Doküman versiyon geçmişi ve dijital onay zinciri** | §19 | `app-dokuman-detay` sekmesi var, **koleksiyonu yok**; ekran bunu dürüstçe bildiriyor |
| 5 | **Zimmet süreci: tutanak · dijital onay · fotoğraf · hasar** | §15 (12 adımlı süreç) | Zimmet/iade listesi var, bu **dört adım veride yok** |
| 6 | **Siparişte eksik/kısmi teslim ve iade alanı** | §17 | `teslimKontrol` üç değer taşıyor ama liste ikiye indiriyor (UID-24); eksik teslim miktarı alanı **yok** |
| 7 | **Eğitimde yetkinlik/kazanım ekseni** | §14 "Eğitim ve Yetkinlik" | `DB.trainings` eğitimi tutuyor, **kazanılan yetkinlik alanı yok** |
| 8 | **Görev listesinde takvim görünümü** | §12 (4 görünüm isteniyor) | 3 görünüm var (tablo/kart/kanban); görevler yalnız `app-ajanda`'da takvim ekseninde |
| 9 | **Ön analizin 10 çıktısı** | §10 | Ön analiz listesi, detayı ve formu var; **10 çıktı üretilmedi** |
| 10 | **Bildirim merkezi bileşeni** | §21 | Ayrı ekran (`app-panel-bildirimler`) var; üst bardaki zil düz bir bağlantı — **açılır panel, okundu işaretleme yordamı yok** |
| 11 | **Menü haritasında yazılı olup kodda olmayan kalemler** | plan.md C bölümü | Fırsatlar · Modüller · Kanban · Gantt · Klasörler · Riskli Müşteriler · Tamamlananlar — plan.md'de var, `shell.js` menüsünde **yok**. Ya menü kalemi açılmalı ya plan tablosu düzeltilmeli |

## A2. Otomasyon açıkları

`DB.automations` **22 kural** taşıyor; `PROMPT.md` §21 **17 bildirim tipi için kural
istiyor ve karşılığı yok**. En dikkat çekici olanlar:

- **Proje modülünde sıfır otomasyon kuralı** — geciken proje, sağlık düşüşü, milestone
  yaklaşması için tetikleyici yok.
- **Satın alma modülünde sıfır kural** — onay bekleyen talep için bildirim kaydı **var**,
  onu üreten kural **yok**.
- **Lisans/garanti yenilemesi** ve **izin talebi** için de aynı durum: bildirim var, kural yok.
- **Güncellenmeyen görev uyarısı** (§12) tamamen eksik.
- **Çelişki:** teklif geçerlilik eşiği otomasyon kuralında **5 gün**, tercih ekranında **3 gün**.

> **Ayrıca — otomasyonlar bugün ÇALIŞMIYOR.** Arka planda motor, cron ya da olay
> dinleyicisi yok; kurallar veri olarak duruyor ve ayar ekranında aç/kapa yapılıyor
> ama durum bellekte kalıyor. 22 kuralın 19'u için ekran "kuru çalıştırma" yapıp
> eşleşen kayıt sayısını gösterebiliyor — bu dürüst bir çözüm ama yürütme değil.

## A3. Kalite açıkları — çalışıyor görünüp çalışmayanlar

Bunlar kapsam eksiği değil, **hata**dır. Tamamı ölçülmüştür ve `ui-debt.md`'de kayıtlıdır.

| # | Hata | Ölçüm | Neden tehlikeli |
|---|---|---|---|
| 1 | 🔴 **Sahte toplu işlem başarı mesajı** (UID-27) | **79 aksiyon / 47 ekran** | Kullanıcı onay veriyor, yeşil "N kayıt işlendi" görüyor, **veri değişmiyor**. CLAUDE.md'nin "sahte buton yasak" kuralının en büyük ihlali |
| 2 | **Maskeleme kardeş ekranlarda ayrışıyor** (UID-28) | `app-dokuman` **sıfır** yetki çağrısı yaparken kardeşleri maskeliyor | Gizli belge adı merkez listede açık görünüyor. Ayrıca `app-arac-yakit` tutarı maskeleyip birim fiyatı açık basıyor — maskelenen sayı **geri hesaplanabiliyor** |
| 3 | **KPI'da maskeleme kavramı yok** (UID-11) | 3+ ekran | Finans yetkisi olmayan rol "₺0" görüyor — maskeleme değil, **yanlış bilgi** |
| 4 | **Rapor çıktısında yetki kapısı yok** (UID-25) | **73 rapor** | 27 rolün 13'ü görmemesi gereken çıktı butonunu görüyor |
| 5 | **Toplu işlemde yetki kapısı yok** (UID-13) | 3+ ekran | Yetkisiz rol butonu görüyor, basınca reddediliyor |
| 6 | **Satır kapsamı uygulanmıyor** (UID-05) | 65+ liste ekranı | `app-destek-paket` müşteri rolüyle **6 müşterinin** bakım paketini birden gösteriyor |
| 7 | **`app-gorev`'de "Tümü" sekmesi yok** (UID-12) | dış bağlantı veren 6 ekran | Bağlantı çalışıyor ama **eksik sonuç** veriyor — sessiz veri kaybı |
| 8 | **Yönlendiren bağlantısı yanlış eksende süzüyor** (UID-21) | `app-referans` satır aksiyonu | Kişinin getirdikleri yerine **türündeki tüm adaylar** geliyor |
| 9 | **Fatura ↔ tahsilat mutasyonları birbirini kapatmıyor** (VB-06) | 4 ekran | Fatura "Ödendi" olunca tahsilat açık kalıyor — **ekran kendi içinde çelişiyor** |
| 10 | **Detay tabloları ≤760px'de kayboluyor** (UID-14) | 4 detay ekranı | Mobilde sekme tamamen boş |
| 11 | **Mobilde satır aksiyonu yok** (UID-02) | tüm liste ekranları | 390px'de arşivden geri alma, hatırlatma gönderme gibi işlemler **hiç erişilemiyor** |
| 12 | **Rapor ekranlarında mobil kapsam yarım** | görev 16/19 · filo 15/19 · proje 8/12 raporda `mobile()` yok | Bu raporlar mobilde boş kalıyor |
| 13 | **13 ekran shell iskeletini elle yazıyor** (UID-15) | ölçüldü: **13**, defterde 4 yazıyordu | `GV.pageHead` bu 13 ekranda **hiç çalışmıyor** |
| 14 | **Altı yetim proje kodu** (VB-27) | `DB.surveys[].ilgili` 10 koddan 6'sı hedefsiz | `canon.js`'te ekseni yok, bu yüzden görünmedi |

## A4. Mimari açık — ortak katman tek bir dev bileşen

**UID-26:** Kolon yönetimi, gelişmiş filtre, çıktı alma, toplu işlem barı ve kanban
görünümü — beşi de `GV.list` kapanışının **içinde** tanımlı ve dışarıdan çağrılamıyor.
Sonuç: liste olmayan bir ekran (detay sekmesi, rapor kartı, matris) bu yeteneklerin
hiçbirini kullanamıyor. Defterdeki üç ayrı madde bunun **belirtisi**:
UID-06 (aynı sayfada ikinci liste kurulamıyor — `app-egitim` matrisi elle yazmak zorunda kaldı) ·
UID-07 (seçili kapsam dışa aktarılamıyor) · UID-17 (dokuz ekran kendi `dl()` yardımcısını yazıyor).

Bu, "ortak bileşen zorunluluğu" kuralının **ters yönde** ihlalidir: tekrarlı kod
yazılmadı ama her şey tek bir bileşene yığıldı, o yüzden yeniden kullanılamıyor.

---

# BÖLÜM B — EK ÖNERİLER (istenmemiş, önerilen)

> Aşağıdakilerin **hiçbiri** PROMPT.md kapsamında değildir ve hiçbiri bugün yapılmamıştır.
> Kapsam genişletmesi olduğu için karar Beyar'ındır. Her öneri, bir yazılım şirketinin
> gerçek operasyonundaki bir boşluğa karşılık gelecek şekilde ve **bu projenin mevcut
> veri modeline oturacak biçimde** yazılmıştır.

## B1. Öncelikli üç öneri

### Ö-1 · Teklif → sözleşme dönüştürme aksiyonu
**Neden:** Zincirin en kritik geçişi bugün **elle** yapılıyor. `app-teklif-detay.html`'de
"Sözleşmeye dönüştür" yolu yok, `app-sozlesme-form.html`'e `?teklif=` ön doldurma yok.
VB-19'un (KDV çift uygulaması) kök nedeni tam olarak buydu: aktarım elle yapıldığı için
biri brütü kopyaladı ve hata beş oturum boyunca sessiz kaldı.
**Öneri:** Tek aksiyonla teklifin **netini** taşıyan sözleşme taslağı üretilsin; taksit
planı teklif kalemlerinden önerilsin. Bu bir "ek özellik" değil, **hata önleyici** bir akış.
**Maliyet:** düşük — iki ekran, bir mutasyon. **Önerilen öncelik: yüksek.**

### Ö-2 · Kaynak planlama takvimi (kim, ne zaman, hangi projede)
**Neden:** Kapasite ekranı **bugünkü** doluluğu gösteriyor; ileriye dönük plan yok.
Bir yazılım şirketinin en pahalı hatası, satılan işin ne zaman yapılacağının bilinmemesidir.
**Öneri:** Personel × hafta ızgarası; sprint ve milestone tarihleriyle beslenir, aşırı
yükleme kırmızıyla işaretlenir. Veri modeli hazır: `DB.capacity` · `DB.sprints` ·
`DB.milestones` · `DB.timelogs` zaten var.
**Maliyet:** orta. **Önerilen öncelik: yüksek.**

### Ö-3 · Tahmini ↔ gerçekleşen süre geri beslemesi
**Neden:** `DB.tasks` hem tahmini hem gerçekleşen süreyi tutuyor ve görev raporlarında
karşılaştırılıyor — ama bu bilgi **yeni tahminlere geri dönmüyor**. Şirketin tahmin
isabeti ölçülüyor, kullanılmıyor.
**Öneri:** Görev türü ve personel bazında geçmiş sapma katsayısı; yeni görev/teklif
tahmininde "benzer işlerde %35 aşım oldu" uyarısı. Ön analiz `isgucu` alanı da bundan beslenir.
**Maliyet:** düşük (veri zaten var). **Önerilen öncelik: yüksek.**

## B2. Operasyonel öneriler

| # | Öneri | Hangi boşluğu kapatır | Maliyet |
|---|---|---|---|
| Ö-4 | **Müşteri sağlık skoru** — destek talebi yoğunluğu, SLA ihlali, geciken tahsilat, memnuniyet puanı ve son iletişim tarihinden türetilen tek gösterge | `DB.customers[].risk` bugün **elle yazılı** bir alan; türetilebilir olduğu hâlde saklanıyor (ders L-08 ihlali) | düşük |
| Ö-5 | **Yenileme takvimi (tek ekran)** — sözleşme, bakım paketi, lisans, sigorta, kasko, muayene ve doküman süresi tek yerde | Bugün altı ayrı ekranda altı ayrı eşik takibi var; hiçbiri diğerini görmüyor | düşük |
| Ö-6 | **Onboarding / offboarding kontrol listesi** — A1'deki 1. eksiğin genişletilmiş hâli: zimmet, hesap açma, eğitim ataması, ekipman iadesi tek akışta | Bugün işe giriş/çıkış hiç yok; zimmet ve eğitim ayrı ayrı yönetiliyor | orta |
| Ö-7 | **Teklif şablonu ve hizmet kataloğu** — `DB.services` var ama teklif kalemi elle yazılıyor | Fiyat tutarlılığı; aynı hizmetin iki teklifte farklı fiyatlanması | düşük |
| Ö-8 | **Zaman kaydı → fatura köprüsü** — faturalanabilir saatlerin doğrudan faturaya taşınması | `DB.timelogs` faturalanabilirlik taşıyor ama faturaya bağlanmıyor; T&M işler elle hesaplanıyor | orta |
| Ö-9 | **Müşteri portalı (salt okunur)** — talep açma, teslim onaylama, fatura görüntüleme | Müşteri rolü bugün aynı uygulamada kısıtlı görünüm alıyor; dış kullanıcıya iç uygulamayı açmak risk | yüksek |
| Ö-10 | **Global arama (tüm modüller)** — üst bardaki arama bugün ekran içi | 141 ekranda kayıt aramak için doğru ekranı bilmek gerekiyor | orta |
| Ö-11 | **Kayıtlı görünüm paylaşımı** — bugün `localStorage`'da, yalnız o tarayıcıda | Ekip aynı filtreyi paylaşamıyor | düşük |

## B3. Teknik borç niteliğindeki öneriler

> ⚠️ **Aşağıda geçen `DB.approvalFlows` ve `DB.budgets` bugün VAR OLAN koleksiyonlar
> DEĞİLDİR** — bu bölümün önerdiği, henüz açılmamış koleksiyonlardır. Adlar
> `ui-debt.md` VB-10 ve VB-11 kayıtlarıyla aynı tutulmuştur ki karar verildiğinde
> iki defter çelişmesin. Gerçek koleksiyon listesi `docs/G-veri-modeli.md`'dedir.

| # | Öneri | Gerekçe |
|---|---|---|
| Ö-12 | **`DB.approvalFlows` koleksiyonu** (VB-10) | Onay eşikleri bugün `app-ayar-onay.html` içinde sayfa-yerel sabit + `localStorage`; `app-satinalma-form.html` tabloyu **kopyalamak zorunda kaldı**. Aynı gerçek iki yerde yaşıyor |
| Ö-13 | **`DB.budgets` koleksiyonu** (VB-11) | `butceKodu` serbest string; yeni bütçe kodu forma girilemiyor, bütçe kalemi bazında harcama hiçbir ekranda okunamıyor |
| Ö-14 | **Eksik sözlük koleksiyonları** (VB-14 · VB-17 · VB-22) | Altı eksenin sözlüğü yok: iletişim kanalı · süre birimi · proje durum/sağlık/faz · hata durumu · tekrarlanabilirlik · test sonucu. Formlar kümeleri liste süzgecinden türetmek zorunda kalıyor; veride tek değer varsa select **tek seçenekli** kalıyor |
| Ö-15 | **`arsiv` / `aktif` sözleşmesinin tüm koleksiyonlarda eşitlenmesi** (VB-20 · VB-22) | Aynı ekseni iki alan anlatıyor ve çelişebiliyor; `DB.sprints`'in 6 kaydının 6'sında `aktif` alanı **hiç yok** ama bileşen onu okuyor |
| Ö-16 | **Yetki tarayıcısı** — "aynı koleksiyonu gösteren iki ekran aynı alanı farklı mı maskeliyor" | UID-28'i bulan ölçüm bugün elle yapıldı; eksen yazılmazsa tekrar kaçar |
| Ö-17 | **Toplu işlem tarayıcısı** — "her `bulk[]` maddesinin `run`'ı var mı" | UID-27 beş oturum boyunca görünmedi çünkü hiçbir tarama bunu sormuyordu |

---

## Kapanış — üç şey aynı sebepten kaçtı

Bu belgedeki en ciddi üç bulgu (UID-27 sahte toplu işlem · VB-19 KDV çift uygulaması ·
VB-27 yetim proje kodları) birbiriyle ilgisiz görünüyor ama **aynı sınıftan**:

> **Ölçüm ekseni olmayan hata görünmez.**

Üçü de konsol hatası vermiyordu, üçü de ekranı bozmuyordu, üçü de "TEMİZ" raporlarının
içinden geçti. Bulunmalarının sebebi yeni bir ekran ya da doküman **eski veriyi
sorgulaması** oldu — projenin `lessons.md` defterindeki L-08'in tam olarak söylediği şey.

Bu yüzden Bölüm B'deki Ö-16 ve Ö-17 önerileri, listedeki diğer özelliklerden **daha
önceliklidir**: yeni özellik eklemek yeni hata sınıfı doğurur, ve o sınıfın tarayıcısı
yazılmadıysa hata sessizce yaşar. Bu projede işleyen kalite mekanizması budur ve
sürdürülmesi önerilir.
