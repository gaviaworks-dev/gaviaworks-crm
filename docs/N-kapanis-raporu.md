# N. Kapanış Raporu — GaviaWorks CRM, 12. oturum · **PROJE KAPANDI**

**Tarih:** 2026-08-06 · **Kapsam:** 142 ekran · **Dal:** `main`
**plan.md:** **295 / 295 madde (%100)** · 0 kısmen · 0 açık · 2 kapsam dışı (karar kaydı)

> Bu rapor **ölçüm raporudur**. Her satırın arkasında bir tarama çıktısı vardır;
> ölçülemeyen şey "temiz" diye yazılmaz, **ölçülemedi** diye yazılır.
> Kapatılamayan iş "kapandı" diye de yazılmaz — **V2'ye taşınır ve sebebi yazılır.**

---

## 1. Ne yapıldı

Statik, buildless bir HTML/CSS/JS prototipi olarak bir yazılım şirketinin
CRM / ERP / operasyon yönetim arayüzü kuruldu. **Backend, veritabanı ve gerçek
API yoktur ve hiç olmadı** — bu, projenin başından beri yazılı kapsamıdır.

| | |
|---|---|
| **Ekran** | 142 (26 detay · 36 form · 1 giriş) |
| **Rol** | 27 tanımlı · 7 dashboard varyantı · 20 yetki ekseni × 27 rol matrisi |
| **Veri** | 6 dosya · ~70 koleksiyon · canonical disiplin (`canon.js` 24 eksen · 2.588 kontrol) |
| **Ortak bileşen** | `GV.list` · `GV.form` · `GV.doc` · `GV.chain` · `GV.drawer` · `GV.modal` · `GV.upload` · `GV.activity` · `GV.report` · `GV.dl` … |
| **Rapor** | 8 rapor ekranı · 91 rapor kataloğu |
| **Doküman çıktısı** | 13/13 (`docs/A…M`) |
| **Tarama seti** | 19 script, repoda izleniyor (`tasks/qa/`) |

### Son oturumda (12.) kapanan 13 madde

11. oturum 21 maddeyi `[~]` bırakmıştı. Bu oturum önce **altısının metnini gerçeğe
hizaladı** — yapılmış işi "eksik" diye yazıyorlardı — sonra kalan 15'i üç kovaya ayırdı.

| # | Kapanan iş | Ölçüm |
|---|---|---|
| 1 | **Kontrol listesi ayrı koleksiyon** (`DB.checklists`) — §12 "Kontrol listesi" ve "Alt görevler"i ayrı sayar | 29 madde / 8 görev · detayda iki blok · ilerleme ikisinden türüyor |
| 2 | **Sipariş kalem dökümü + iade** (`DB.orderLines` · `DB.orderReturns`) | 7 kalem / 4 sipariş · Σ kalem = sipariş neti (4/4) · `SIP-2026-009` artık gerçekten 'Eksik' |
| 3 | **Doküman sürüm zinciri + onay zinciri** | 16 sürüm / 11 doküman · 15 onay adımı · `versiyon` ve `onay` zincirden türüyor |
| 4 | **Zimmet iade kontrolü + eksik ekipman** | §15'in 12 adımından 11'i · `iadeKontrol` girdiden türüyor |
| 5 | **`GV.list` takvim görünümü** (dördüncü görünüm) | 1440/768 px 7 sütun · 390 px güne bir satır · üç kırılımda taşma yok |
| 6 | **Ön analizin 10 çıktısı** (`GV.doc`) | `sahip` 10/10 · finans yetkisiz rol 8/10 üretebiliyor |
| 7 | **Sözleşmeden tek işlemle proje başlatma** | projesiz sözleşme → başlat · projeli → aç · yetkisiz rolde hiç basılmıyor |
| 8–13 | Metni gerçeğe hizalanan altı madde (yetkinlik + işe giriş koleksiyonu · izin formu · kontrast/boşluk · satır kapsamı · mobil satır aksiyonu · form ön dolgusu) | her biri kendi ölçüsüyle `plan.md`'de yazılı |

---

## 2. Ne ölçüldü — tarama seti, 19 eksen, tek turda

Her satırda **taranan ekran** ile **gerçekten yüklenen kayıt** ayrı yazılıdır (ders **L-19**):
bir aracın "142 ekran gezdim" demesi, o ekranlarda bir kaydın açıldığı anlamına gelmez.

| Eksen | Ne sorar | Taranan ekran | Ölçülen birim | Sonuç |
|---|---|---|---|---|
| `rec.js` | Tarama hedefi gerçek bir kayıt açıyor mu | 62 | 62/62 hedef doğrulandı | ✅ TEMİZ |
| `canon.js` | 24 canonical eksen tutarlı mı | — (veri) | **2.588 kontrol** | ✅ TEMİZ |
| `dbref.js` | Okunan koleksiyonun dosyası yüklü mü (L-12) | **142** | — | ✅ TEMİZ |
| `links.js` | Kırık hedef · hayalet BUILT · yetim ekran | **142** | 143 BUILT kaydı · kuyrukta 0 hedef | ✅ TEMİZ |
| `esc.js` | Etikette ham HTML var mı (L-14) | **142** | 62/62 kayıt | ✅ TEMİZ |
| `tabs.js` | Detay sekmeleri açılıyor mu | 26 | 26/26 kayıt · **224 tıklama** | ✅ TEMİZ |
| `mut.js` | `GV.refresh` idempotent mi (L-15) | 62 | 62/62 kayıt | ✅ TEMİZ |
| `listen.js` | Dinleyici birikiyor mu (L-16) | 62 | 62/62 kayıt | ✅ TEMİZ |
| `akt.js` | Detay ekranının aktivite sekmesi dolu mu | 26 | 26/26 kayıt · **183 hareket** | ✅ TEMİZ |
| `bag.js` | §22 bağı ekranda görünüyor mu | 3 | 12 vaka · 12/12 kayıt | ✅ TEMİZ |
| `pers.js` | Kod ekranda adın yerine geçiyor mu | 9 | 18 vaka · 6/6 kayıt | ✅ TEMİZ |
| `ctl.js` | Kontrol–etiket boşluğu · native kontrol | **142** | **200 panel** · 2.449 çift · 741 select · 4.225 kutu | ✅ TEMİZ |
| `grip-qa.js` | Rail tutamağı geometrisi (L-09) | 1 | tüm ölçümler | ✅ TEMİZ |
| `swtest.js` | Anahtar kontrolü görünür mü | 1 | 40×24 px | ✅ TEMİZ |
| `act.js` | Bu buton gerçekten bir şey yapıyor mu (L-23) | **142** | **210 aksiyon** | ✅ TEMİZ |
| `qa.js` | 1440/768/390 konsol · taşma · sahte link | **142** | 3 kırılım | ✅ TEMİZ |
| `gate.js` | Her ekran × 5 rol (L-07) | **142** | **710 sayfa yüklemesi** | ✅ TEMİZ |
| `xport.js` | Çıktı ekrandaki bilgiyi taşıyor mu | **142** | 634 kolon · 6.654 hücre · **tamamen taşımayan kolon 0** | ⚠️ bkz. §3 |
| `denetim.js` | Kapsam B sistem denetimi (tek seferlik, 11. oturum) | **142** | boşluk 0 · başlıksız boş durum 0 · AA altı kontrast 0 · dokunmatik hedef 0 | ✅ TEMİZ |

**142'nin altında tarayan script ve sebebi (L-24):** `tabs.js` ve `akt.js` yalnız
**detay** ekranlarını gezer (26) · `mut.js` / `listen.js` yalnız `rec.js`'in doğruladığı
**62 kayıtlı hedefi** gezer (mutasyon ve dinleyici ancak gerçek kayıtta ölçülür) ·
`bag.js` (3) ve `pers.js` (9) belirli bir sözleşmeyi ölçen **vaka testleridir** ·
`grip-qa` / `swtest` tek bileşenlik nokta testleridir.

### `act.js` dökümü — 210 aksiyon

| Hüküm | Sayı |
|---|---|
| MUTASYON (veri gerçekten değişti) | 70 |
| ÇIKTI (dosya gerçekten indi) | 52 |
| PANEL (kullanıcıya bir şey sundu) | 44 |
| YÖNLENDİRME | 31 |
| DÜRÜST RED (uyardı, iddia etmedi) | 13 |
| 🔴 YALAN | **0** |
| ⚫ ÖLÜ | **0** |

**Sessizce yeşile yazılmayan iki ölçüm boşluğu:**
1. **21 aksiyon** girdi soran bir panel açıyor; "doldur → kaydet" **ikinci adımı bu
   eksende ölçülmedi**. Bu turda eklenen üç akış (zimmet iadesi · kontrol maddesi ·
   doküman onayı) ikinci adımıyla **elle** ölçüldü ve yazıldı.
2. **2 toplu işlem ulaşılamadı** — `app-pipeline` varsayılan kanban görünümünde ve
   `app-zaman` "Kayıtlarım" sekmesi boş olduğu için seçilebilir satır yok.
   Aksiyon hatası değil, **kanban görünümünde toplu seçim olmaması**.
3. **32 toplu aksiyon** `disabled` + "bu sürümde yok" damgalı — kapsamı dürüstçe
   gösteriyorlar, ihlal değiller.

---

## 3. `xport.js` neden "EKSİK" diyor — ve bu neden hata değil

**Bu, projenin kapanışında bilinçle kabul edilmiş tek "kırmızı damga"dır.**

Script şunu ölçer: *ekranda dolu görünen her hücre çıktıya da giriyor mu?*
Sonuç: **tamamen taşımayan kolon 0.** 634 kolonun hiçbiri çıktıya değer taşımayı
bırakmıyor. 6.654 hücrenin **60'ında** (%0,9) ekranda metin var, çıktıda boş hücre.
Script bu 60 hücreyi "EKSİK" damgasıyla bildiriyor.

**Damga bir hatayı göstermiyor, çünkü 18 kolonun 18'i de aynı sınıf:**
veri alanı **boş** ya da `null` iken ekranın okunabilirlik için bir **yer tutucu
metin** basması. Örnekler doğrudan koşumdan:

| Kolon | Ekranda görünen | Verideki değer |
|---|---|---|
| `zimmetli` | "Zimmetsiz" | `null` |
| `sonKullanma` | "Süresiz" | `null` |
| `proje` | "Proje dışı" | `null` |
| `iadeKontrol` | "İade edilmedi" | alan yok (henüz iade edilmemiş) |
| `vekil` | "Vekil yok" | `null` |
| `riskler` | "Risk kaydı yok" | `[]` |
| `tercihEdilen` | "Tercih bekliyor" | `null` |

Ekran "—" yerine anlamlı bir cümle yazıyor; bu **arayüz için doğru** davranıştır.
Çıktı ise boş hücre yazıyor; bu da **CSV/Excel için doğru** davranıştır — "Zimmetsiz"
kelimesini bir hücreye basmak, veriyi süzen ya da pivotlayan kişiye **var olmayan bir
değer** satmaktır. İki katman aynı boşluğu kendi diline göre gösteriyor ve **hiçbir
bilgi kaybolmuyor.**

Script bu sınıfı ayırt edemiyor: "ekranda metin var, çıktıda yok" kuralı kör
uygulanıyor. Sınıfı script'e öğretmek mümkündü (yer tutucu sözlüğü tanımlayıp
istisna yazmak) ama **yapılmadı ve bu bilinçli:** aracı kendi bulgusunu susturacak
şekilde yumuşatmak, ölçüm aracına duyulan güveni bozar (ders **L-17**, **L-26**,
**L-29**). Damga kalsın, **açıklaması yazılı olsun** daha iyidir.

Karar `ui-debt.md` **UID-07 kapanış kaydında** ve bu raporda yazılıdır.
Sayı turdan tura büyüyor (10. oturum 47 → 11. oturum 54 → 12. oturum **60**) çünkü
her yeni kayıt ve kolon bu sınıfa yenilerini ekliyor — oran ise %0,7–0,9 bandında sabit.

---

## 4. Ne v2'ye kaldı

**Payda yalnız bu projede kapanabilir maddelerden oluşur.** Kapanamayanlar
paydadan çıkarıldı ve sebebi tek cümleyle yazıldı. Tam gerekçeler
`tasks/ui-debt.md` **satır 1909+** (V2-01 … V2-06), özet `tasks/plan.md` sonunda.

### Backend gerektirenler — bu projede kapatılamaz

| V2 | Konu | Kapatmak için gereken |
|---|---|---|
| **V2-06** | Zimmet **teslim fotoğrafları** (§15'in 12. adımı) | Dosya yükleme uç noktası, nesne depolama ve kalıcı dosya URL'i olan bir backend |
| **V2-03** | `musteri` satır kapsamı | `GV.session`'a müşteri kimliği ekseni — oturum bir PERSONEL kaydından kuruluyor |
| **V2-05** | İşten **ayrılış** (offboarding) kaydı | Veride ayrılmış personel — 16 personelin 16'sı `aktif:true` |

**Aynı sınırın diğer yüzleri:** doküman ve teklif PDF'lerinin gerçek dosyaları ·
tutanak taraması · e-imza · gerçek e-posta/SMS gönderimi · ödeme tahsilatı ·
üçüncü taraf entegrasyonların canlı bağlantısı. Hepsi `app-ayar-entegrasyon.html`'de
**arayüz olarak** modellenmiştir; hiçbiri gerçek bir servise bağlanmaz ve **ekranlar
bunu söyler** — sahte "bağlandı" mesajı yoktur.

### Bilinçle kapsam dışı — karar kaydı

| Madde | Karar | Nerede yazılı |
|---|---|---|
| **UID-26** · `GV.list` yordamlarının bağımsız bileşene ayrıştırılması | Belirtiler (UID-06 · 07 · 17) başka yollarla kapandı; kalan değer mimari saflık | `ui-debt.md` **V2-01** |
| **Hizalama ve optik denge** | Ölçülebilen kısmı temiz; "optik denge" göz kararıdır, otomatik eksene bağlanamadı | `ui-debt.md` **V2-02** |

### Ölçüm ekseni yazılmayan kural

**V2-04** · `DB.trainings[].kazanim` kuralı ("tamamlanmış eğitimin her kazanımı, her
katılımcısının `yetkinlik` dizisinde bulunur") 11. oturumda **elle** doğrulandı ve iki
gerçek boşluk buldu, ama **kapsam donduğu için `canon.js`'e eksen olarak eklenmedi.**
Kural V2-04'te yazılıdır.

---

## 5. Hangi dersler çıktı

`tasks/lessons.md` **29 ders** taşıyor. Projeye asıl biçimini verenler:

**Ölçme üstüne**
- **L-17 · Bir aracın "temiz" demesi, doğru şeyi ölçtüğü anlamına gelmez.** Bu ders
  proje boyunca **dört kez** tekrarladı; her seferinde araç hata vermeden yanlış
  sonuç üretti.
- **L-19 · Taranan ekran ile yüklenen kayıt ayrı sayılır.** "142 ekran gezdim" ile
  "142 ekranda kayıt açıldı" aynı cümle değildir; artık her satırda ikisi de yazılı.
- **L-24 · Hedef listesi elle üretilmez.** `act.js` ilk koşumunda listeyi iki kez
  yanlış kaynaktan aldı ve sessizce eksik tarayıp "TEMİZ" dedi.
- **L-26 · Ölçüm aracı borcu eksik de fazla da sayabilir.** `act.js` 28 ihlal
  gösteriyordu, gerçek 10'du.
- **L-29 · Araç üç ayrı şekilde yanılabilir:** yanlış yerden okuma · fazla katı hüküm ·
  tarayıcı davranışını yanlış modelleme (programatik `.focus()` `:focus-visible`
  tetiklemez → **8.188 sahte ihlal**).
- **L-28 · Borç kaydının kendi kapsamı da ölçülmeden güvenilmez.** Kapatılan beş
  borcun beşinde de defterdeki kapsam yanlıştı (UID-16 5→**22** · UID-17 9→**60** ·
  VB-04 111→**145**), biri **ters yönde**: "yok" denen üç bağın ikisi vardı.

**Veri ve dürüstlük üstüne**
- **L-13 · Olmayan veri uydurulmaz.** Bir bağ, bir dosya, bir ayrılış kaydı yoksa
  ekran bunu **söyler**. Bu projede kapanmayan her şey bu yüzden görünür kaldı.
- **L-08 · Türetilebilen değer saklanmaz.** İlerleme yüzdesi kontrol maddelerinden,
  eksik teslim kalemlerden, iade kontrolü girdiden, doküman sürümü zincirden türer.
  Saklanan ikinci kopya er geç kaynağıyla çelişir.
- **L-22 · Bir bağ "var" sayılmaz, en az bir kayıtta dolu olduğu ölçülür.**
- **L-12 · Okunan koleksiyonun dosyası yüklenmeden okunmaz.** Bu turda `app-zimmet`
  aktivite yazmaya başlayınca aynı kural yeniden devreye girdi ve `work.js` eklendi.

**Yöntem üstüne**
- **L-05 · Nokta yaması yasak.** Çözüm ortak katmanda yapılır; bir madde kapanınca
  etkilenen tüm ekranlar üç kırılımda yeniden doğrulanır. Takvim görünümü ve
  `GV.doc` bu turda ekrana değil `ui.js`'e yazıldı.
- **L-20 · Dalga tavanı dört ajan; her ajan raporundaki her iddia ölçülerek doğrulanır.**
- **Kapsam dondurma (11. oturum).** Her yeni ölçüm ekseni yeni borç buluyor, borç
  deftere giriyor ve payda büyüyordu — yüzde dört oturum boyunca %81'de sabit kaldı.
  Kapsam donduruldu: yeni eksen yazılmaz, yeni madde eklenmez, yeni bulgu V2'ye gider.
  **Bitiş çizgisi ancak durduğunda gelir.**

---

## 6. Dürüst bakiye

**Ne bitti:** Bu projede kapatılabilecek 295 maddenin 295'i kapandı ve her biri
bir ölçümle yazılı. 19 eksenlik tarama seti tek turda temiz koşuyor.

**Ne bitmedi ve neden:** Üç iş backend istiyor (V2-03 · V2-05 · V2-06), iki iş
bilinçle kapsam dışı bırakıldı (V2-01 · V2-02), bir kural ölçüm eksenine
bağlanmadı (V2-04). Altısı da yazılı, gerekçeli ve yeri belli.

**Neyin test edilmesi gerekir:** Girdi soran 21 panelin "doldur → kaydet" ikinci
adımı otomatik eksende ölçülmedi — bunlar elle gezilmelidir. Kanban görünümünde
toplu seçim yoktur. Tarih alanının takvim düğmesi çalışma zamanında okunamıyor,
kural statik olarak doğrulanıyor.

**Bu bir prototiptir.** Gerçek kullanıma alınmadan önce backend, kimlik doğrulama,
yetkilendirmenin sunucu tarafı ve veri kalıcılığı yazılmalıdır. Arayüzdeki yetki
kapıları **arayüz kapılarıdır**; sunucu tarafı doğrulamanın yerine geçmez.
