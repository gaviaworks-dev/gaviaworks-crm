# H. İŞ AKIŞLARI

> **Bu belge neyden türetildi?**
> Üç kaynaktan, üçü de bu depodaki gerçek dosyalar:
> 1. `PROMPT.md` §26 bölüm H — 22 akışın resmî listesi ve sırası.
> 2. `tasks/plan.md` → “F. İŞ AKIŞLARI (§26-H — 22 akış)” — her akışın hangi ekranda kurulu
>    olduğu ve `[x] / [~] / [ ]` işaretleri.
> 3. `assets/js/shell.js` → `BUILT` dizisi — akışın geçtiği ekranın **yayında olup olmadığı**.
>
> Adımlar uydurulmadı: her aksiyon adı, buton etiketi, koleksiyon adı ve yetki kodu ilgili
> `app-*.html` dosyasından okunarak yazıldı. `plan.md`’deki notlar **`BUILT` listesine karşı
> yeniden doğrulandı**; 7. ve 8. oturumda üretilen form ekranları nedeniyle eskiyen üç not
> (proje açılış formu, izin talep formu, zimmet oluşturma formu) burada güncellendi ve
> ilgili akışların gerçek kalan eksiği yazıldı.
>
> **Kapsam uyarısı:** Proje statik prototiptir. “Veri mutasyonu” = sayfa ömrü boyunca
> `assets/data/*.js` içindeki `DB.*` dizilerinde yapılan bellek içi değişiklik. Kalıcılık,
> backend ve gerçek onay altyapısı yoktur.

**Özet tablo**

| # | Akış | Durum | Ana ekran |
|---|---|---|---|
| 1 | Referansla müşteri kazanımı | Tam | `app-referans-detay.html` → `app-komisyon-detay.html` |
| 2 | Lead’den müşteriye dönüşüm | Kısmi | `app-lead-detay.html` |
| 3 | Ön analiz | Tam | `app-onanaliz.html` / `app-onanaliz-detay.html` |
| 4 | Teklif ve sözleşme | Kısmi | `app-teklif-detay.html` → `app-sozlesme-detay.html` |
| 5 | Proje başlatma | Kısmi | `app-proje-form.html` / `app-proje-detay.html` |
| 6 | Görev atama | Tam | `app-gorev.html` / `app-gorev-detay.html` |
| 7 | Görev kabulü | Tam | `app-gorev.html` / `app-gorev-detay.html` |
| 8 | Görev kontrolü | Tam | `app-gorev-detay.html` |
| 9 | Revizyon | Tam | `app-gorev-detay.html` |
| 10 | Sohbetten görev oluşturma | Tam | `app-sohbet.html` |
| 11 | Departmanlar arası iş talebi | Tam | `app-istalebi-detay.html` |
| 12 | İzin talebi | Tam | `app-izin-form.html` → `app-izin-detay.html` |
| 13 | Satın alma talebi | Tam | `app-satinalma-form.html` → `app-satinalma-detay.html` |
| 14 | Demirbaş zimmeti | Kısmi | `app-zimmet.html` / `app-zimmet-form.html` |
| 15 | Araç zimmeti | Kısmi | `app-arac-detay.html` (Zimmet sekmesi) |
| 16 | Araç bakımı | Tam | `app-arac-bakim.html` / `app-arac-bakim-form.html` |
| 17 | Sigorta yenilemesi | Kısmi | `app-arac-sigorta.html` |
| 18 | Kasko yenilemesi | Kısmi | `app-arac-sigorta.html` |
| 19 | Muayene | Kısmi | `app-arac-muayene.html` / `app-arac-muayene-form.html` |
| 20 | Kaza ve hasar | Kısmi | `app-arac-kaza.html` |
| 21 | Destek talebi | Tam | `app-destek-detay.html` |
| 22 | Personel işten ayrılışı | Açık | **ekran yok** |

**Sayı:** 12 tam · 9 kısmi · 1 açık.

---

## 1 · Referansla Müşteri Kazanımı

**Durum:** Tam · `plan.md` `[x]`

**Tetikleyici:** Bir yönlendiren kişi (`DB.referrers`) yeni bir iş fırsatı işaret eder.

**Adımlar**

1. **`app-referans.html`** — yönlendiren listesi. `GV.list` standardı; 17 referans türü
   `DB.refTypes` sözlüğünden gelir. Yeni yönlendiren → **`app-referans-form.html`**.
2. **`app-referans-detay.html`** — yönlendiren kartı. Sekmeler: bu kaynaktan gelen müşteri
   adayları, kazanılmış müşteriler, komisyon kayıtları. Kartta yazılı komisyon toplamı ile
   `DB.commissions` kayıtlarından türetilen toplam **karşılaştırılır**; tutmazsa
   “Kartta komisyon var, kaydı yok” / “Üç alan veri modelinde yok” uyarısı basılır.
3. Yönlendirmeden doğan aday **`app-lead-form.html`** ile açılır, `DB.leads[].kaynak`
   alanı referans türü sözlüğüne bağlanır (6. oturumda kapatılan doğrulama).
4. Aday kazanıldığında komisyon kaydı **`app-komisyon-form.html`** ile açılır; form
   `?referans=REF-xxx&musteri=MUS-xxx` adres parametreleriyle ön doldurulur.
5. **`app-komisyon-detay.html`** — “Komisyon kazancını onayla” → `GV.chain` onay bileşeni →
   ardından **“Ödendi olarak işaretle”**. Kazanç tutarı dayanak ciro ve orandan yeniden
   hesaplanır; tutmazsa “Komisyon hesabı tutmuyor” uyarısı çıkar.

**Yetki:** `ekle` / `duzenle` (yönlendiren ve komisyon kaydı) · `finans` (tüm tutar
alanları; yoksa “Tutarlar gizli”) · onay ve ödeme adımı finans yetkisi + onay makamı.

**Veri mutasyonu:** `DB.referrers`, `DB.leads`, `DB.commissions` (`unshift`),
komisyon durumu (`Onay bekliyor → Onaylandı → Ödendi`), `DB.activities` (`GV.activity`).

**Sonuç:** Yönlendiren → aday → müşteri → komisyon zinciri uçtan uca izlenebilir; komisyon
raporu **`app-rapor-referans.html`** aynı kayıtları toplar.

**Bilinen eksik:** Yönlendiren kartından tek tıkla aday açan aksiyon yok — `app-lead-form.html`
`?referans=` ön doldurmasını okumuyor (`?id=` dışında parametre almıyor), bağ formda elle kurulur.

---

## 2 · Lead’den Müşteriye Dönüşüm

**Durum:** Kısmi · `plan.md` `[x]` işaretli, **doğrulamada kısmi çıktı**

**Tetikleyici:** Müşteri adayı pipeline’da “Kazanıldı” noktasına gelir.

**Adımlar**

1. **`app-lead.html`** — aday listesi; **`app-lead-form.html`** ile yeni aday.
2. **`app-pipeline.html`** — aşama kanbanı (`DB.pipelineStages`); sürükleme yerine
   detaydaki “Aşamayı güncelle” aksiyonu esastır.
3. **`app-lead-detay.html`** — “Aşama Değiştir” yan paneli ile aşama ilerletilir.
4. Aynı ekranda **“Müşteriye dönüştür”** butonu → `GV.confirm` → `GV.result` sonuç ekranı,
   “Müşteri listesine git” / “Adayda kal” seçenekleriyle.
5. Devam: **`app-musteri-form.html`** ile müşteri kartı, **`app-musteri-yetkili-form.html`**
   ile yetkili kişi, **`app-musteri-iletisim-form.html`** ile görüşme kaydı.

**Yetki:** `ekle` / `duzenle` · tutar alanları `finans`.

**Veri mutasyonu:** `l.asama = 'Kazanıldı'` + `DB.activities.unshift(...)`
(eski→yeni değer ile).

**Sonuç:** Aday “Kazanıldı” aşamasına geçer, kayıt geçmişine dönüşüm satırı düşer.

**Bilinen eksik:** Dönüşüm **`DB.customers` içine gerçek bir müşteri kaydı yazmıyor** —
yalnız adayın aşamasını değiştirip aktivite kaydı düşüyor, kullanıcı müşteri listesine
yönlendiriliyor ve kartı orada elle açıyor. `plan.md`’deki “gerçek `DB.customers` kaydı”
notu bu ekranda karşılığını bulmuyor. Ayrıca aday→müşteri alan taşıması (firma, sektör,
yetkili, kaynak) otomatik değil.

---

## 3 · Ön Analiz

**Durum:** Tam · `plan.md` `[x]`

**Tetikleyici:** Nitelikli bir aday için teknik/ticari fizibilite istenir.

**Adımlar**

1. **`app-onanaliz.html`** — analiz listesi; “Yeni analiz” → **`app-onanaliz-form.html`**
   (`?lead=LEAD-xxx` ile adaydan ön doldurulabilir).
2. Formda 28 değerlendirme alanı doldurulur: kapsam, iş gücü, süre, teknoloji, risk,
   bağımlılık, tahmini bütçe.
3. **`app-onanaliz-detay.html`** — analiz kartı; adaya, üretilen teklife ve satış sürecine
   bağ verir. Fizibilite skoru veride yazılı değilse **uydurulmaz**, “Analiz kaydında hazır
   skor alanı yok” notu basılır.
4. Aynı ekranda **“Teklif oluştur”** yan paneli → “Teklifi oluştur” → hangi değerlerle
   doğduğu (“Teklif hangi değerlerle doğuyor”) kullanıcıya gösterilerek teklif üretilir.

**Yetki:** `ekle` / `duzenle` · tutar ve iş gücü maliyeti `finans` (yoksa “İndirim alanı
kapalı” / “Tutarlar gizli”).

**Veri mutasyonu:** `DB.analyses` (form), `DB.quotes.unshift(...)` (teklif üretimi),
`DB.activities.unshift(...)`.

**Sonuç:** Analizden doğan teklif `DB.quotes` içinde gerçek kayıt olarak yaşar, iki kayıt
karşılıklı bağlıdır.

**Bilinen eksik:** Analiz onay adımı yok (“Onay kaydı yok” notu ekranda dürüstçe yazılı).

---

## 4 · Teklif ve Sözleşme

**Durum:** Kısmi · `plan.md` `[x]`, **teklif→sözleşme geçişi tek aksiyonla yapılamıyor**

**Tetikleyici:** Ön analiz tamamlanır veya müşteri doğrudan teklif ister.

**Adımlar**

1. **`app-teklif-form.html`** — teklif kalemleri, ara toplam, KDV, geçerlilik.
   (Ön analizden doğuyorsa 3. akışın 4. adımı ile.)
2. **`app-teklif-detay.html`** — kalem toplamı teklif kartındaki ara toplama karşı
   doğrulanır (“Kalem toplamı ara toplamla eşleşmiyor” / “Kalem sayısı uyuşmuyor”).
3. **“İç onayı ver”** → `GV.chain`. Kural **`app-ayar-onay.html`** içindeki
   `teklif` (“Teklif İç Onayı”) akışında merkezî olarak tanımlıdır.
4. **“Teklifi müşteriye ilet”** (buton: “İlet”) → teklif durumu iletildi olur;
   **“PDF çıktısı”** ve **“Revize teklif oluştur”** ayrı aksiyonlardır.
5. Sözleşme **`app-sozlesme-form.html`** ile açılır; bağ **sözleşme kaydının `teklif`
   alanında** tutulur (teklifte ayna alan açılmaz).
6. **`app-sozlesme-detay.html`** — taksit seti, ödeme planı (**`app-odemeplani.html`**),
   fatura ve tahsilat sekmeleri, “Sözleşmeyi yenile” aksiyonu, bitişe 30/7 gün kala
   kademeli uyarı. Taksit numaraları ve taksit toplamı sözleşme tutarına karşı doğrulanır.

**Yetki:** `ekle` / `duzenle` · her tutar alanı `finans` · iç onay ve sözleşme onayı
`app-ayar-onay.html`’deki makam zincirine bağlı.

**Veri mutasyonu:** `DB.quotes`, `DB.quoteItems`, `DB.contracts`, `DB.payments`
(ödeme planı), `DB.activities`.

**Sonuç:** Teklif → iç onay → müşteriye iletim → sözleşme → ödeme planı zinciri kurulu.

**Bilinen eksik:**
- Teklif detayında **“sözleşmeye dönüştür” aksiyonu yok**; `app-sozlesme-form.html`
  `?teklif=` ön doldurmasını okumuyor (yalnız `?id=`). Sözleşme–teklif bağı formda elle kurulur.
- Teklif revizyon geçmişi ayrı kayıtta tutulmuyor (ekranda “Revizyon geçmişi ayrı
  tutulmuyor” notu var).
- Sözleşme kartında sorumlu alanı yok.

---

## 5 · Proje Başlatma

**Durum:** Kısmi · `plan.md` `[~]` — **not güncellendi:** proje açılış formu artık **var**
(`app-proje-form.html`, `BUILT` içinde), kalan eksik başka.

**Tetikleyici:** Sözleşme imzalanır, işin yürütmesi açılır.

**Adımlar**

1. **`app-proje.html`** → “Yeni Proje” → **`app-proje-form.html`**
   (`?musteri=MUS-xxx` ile müşteriden ön doldurulur; `?id=` ile düzenleme).
2. Formda proje adı, müşteri, sorumlu PM, takvim, **sözleşme bedeli (KDV hariç)**, onaylı
   bütçe ve gerçekleşen maliyet girilir. Form, girilen sözleşme bedelini bağlı sözleşmenin
   net tutarına karşı **canlı doğrular** ve fark varsa uyarır.
3. **`app-proje-detay.html`** — proje kartı: bütçe/maliyet, modül ilerleme, sprint yükü,
   hata şiddet grafikleri; sözleşme ve teslim bağları.
4. Kilometre taşları **`app-proje-milestone.html`**, sprintler **`app-proje-sprint.html`** +
   **`app-proje-sprint-form.html`** ile kurulur.
5. Ekip yükü **`app-kapasite.html`** üzerinden kontrol edilir.

**Yetki:** `ekle` / `duzenle` · sözleşme bedeli, bütçe ve maliyet alanları `finans`
(yoksa forma basılmaz, detayda “Finansal tutarlar gizlendi”).

**Veri mutasyonu:** `DB.projects.unshift(...)`, `DB.activities.unshift(...)`;
milestone/sprint kayıtları kendi formlarından.

**Sonuç:** Sözleşmesi olan iş, takvimi ve bütçesi tanımlı bir projeye dönüşür.

**Bilinen eksik:**
- **Sözleşmeden tek aksiyonla proje başlatılamıyor.** `app-sozlesme-detay.html` yalnız var
  olan projeye bağ verir; “Proje başlat” butonu yok, `app-proje-form.html` `?sozlesme=`
  parametresi okumuyor.
- Proje kaydedildiğinde **`DB.contracts[].proje` alanına geri yazım yapılmıyor** — bağ
  sözleşme kaydında tutulduğu için yeni proje sözleşmeye kendiliğinden bağlanmıyor.
- Proje açılışında ekip ataması, milestone iskeleti ve kickoff toplantısı otomatik
  üretilmiyor; üçü de ayrı ekranlardan elle kurulur.

---

## 6 · Görev Atama

**Durum:** Tam · `plan.md` `[x]`

**Tetikleyici:** Projede, destek talebinde, iş talebinde veya sohbette bir iş doğar.

**Adımlar**

1. **`app-gorev-form.html`** — 18 görev türü, öncelik, termin, tahmini süre, sorumlu,
   alt görev ve bağımlılık girişi (`?proje=`, `?sprint=`, `?hata=` ön doldurma destekli).
2. **`app-gorev.html`** — 13 sekme; atama için ilgili olanlar: **“İş Havuzu”**,
   **“Atama Bekleyenler”**, **“Verdiğim İşler”**, **“Departman İşleri”**.
3. Satır aksiyonu **“Sorumlu ata”** ve **“Öncelik değiştir”**; toplu işlem olarak da çalışır.
4. **`app-gorev-detay.html`** — atama sonrası kart: kontrol listesi, bağımlılıklar,
   alt görevler, zaman kayıtları (“Zaman Kaydı Ekle”).

**Yetki:** `ekle` / `duzenle` · atama yetkisi rol kademesine bağlı
(`DB.roles[].kademe`; 1–2 kademe atar, 3–4 kademe havuzdan üstlenir).

**Veri mutasyonu:** `DB.tasks.unshift(...)`, `DB.subtasks.push(...)`,
`DB.taskDeps.push(...)`, `DB.timelogs.unshift(...)`, `DB.activities.unshift(...)`.

**Sonuç:** Görev sorumlusu ve termini belli, izlenebilir bir kayda dönüşür.

**Bilinen eksik:** Mobil (≤760px) kart görünümünde satır aksiyon şeridi yok — atama
mobilde detaydan yapılır (`ui-debt.md` UID-02).

---

## 7 · Görev Kabulü

**Durum:** Tam · `plan.md` `[x]`

**Tetikleyici:** Görev havuza düşer ya da bir personele atanır.

**Adımlar**

1. **`app-gorev.html`** → **“İş Havuzu”** veya **“Kabul Bekleyenler”** sekmesi.
2. Havuzdaki iş için satır aksiyonu **“Üzerime al”**; atanmış iş için
   **`app-gorev-detay.html`** → “Durum Değiştir” → “Durumu güncelle”.
3. Durum geçişleri serbest değil: `DB.taskStatuses` (19 durum) ve `DB.taskTransitions`
   sözlüğüne göre yalnız izinli geçişler açılır.
4. Kabul sonrası görev “Bana Verilenler” sekmesine düşer, ilerleme yüzdesi ve zaman
   kaydı girilmeye başlanır.

**Yetki:** Kabul aksiyonu yetki kapılı — yalnız görev sorumlusu veya havuzun bağlı olduğu
departmanın personeli; `duzenle` yetkisi olmayanda buton görünmez.

**Veri mutasyonu:** `DB.tasks[].durum` (Havuzda → Kabul edildi), `DB.tasks[].sorumlu`,
`DB.activities.unshift(...)` (eski→yeni durum).

**Sonuç:** İş sahiplenilir, havuzdan çıkar, sorumlunun yüküne yazılır (`app-kapasite.html`).

**Bilinen eksik:** Kabul reddi (“üzerime almam, geri havuza”) için ayrı gerekçeli aksiyon yok.

---

## 8 · Görev Kontrolü

**Durum:** Tam · `plan.md` `[x]`

**Tetikleyici:** Sorumlu görevi “Kontrole hazır” durumuna taşır.

**Adımlar**

1. **`app-gorev.html`** → **“Kontrol Bekleyenler”** ve **“Onay Bekleyenler”** sekmeleri
   kontrolörün kuyruğudur.
2. **`app-gorev-detay.html`** → kontrol listesi maddeleri işaretlenir.
3. **“Görevi onayla”** → `GV.chain` onay zinciri. Kural **`app-ayar-onay.html`** içinde
   `gorevkontrol` (“Görev Kontrolü”) akışı olarak merkezî tanımlıdır.
4. Onaylanan görev “Tamamlananlar” sekmesine düşer; onaylanmayan iş 9. akışa (Revizyon) girer.

**Yetki:** Kontrol/onay yalnız görevi veren, takım lideri veya proje yöneticisinde;
yetkisiz kullanıcıda aksiyon kapalı, merkezî kuyruk **`app-panel-onaylar.html`**’de görünür.

**Veri mutasyonu:** `DB.tasks[].durum`, kontrol listesi maddeleri,
`DB.activities.unshift(...)`.

**Sonuç:** İş kalite kapısından geçer; onay kaydı görev geçmişinde eski→yeni değerle durur.

**Bilinen eksik:** Kontrol listesi maddeleri kayıt bazlı tutulmuyor — kontrol listesi
olmayan görevlerde “Kontrol listesi yok” boş durumu basılır.

---

## 9 · Revizyon

**Durum:** Tam · `plan.md` `[x]`

**Tetikleyici:** Kontrolör işi yetersiz bulur.

**Adımlar**

1. **`app-gorev-detay.html`** → **“Revize iste”** aksiyonu.
2. Açılan “Revize İste” panelinde **revizyon gerekçesi zorunlu** metin alanı doldurulur.
3. Görev “Revizyon” durumuna döner ve **`app-gorev.html`** → “Revizyon” sekmesinde listelenir;
   sorumlunun kuyruğuna geri düşer.
4. Sorumlu düzeltip tekrar kontrole gönderir → 8. akış baştan işler.

**Yetki:** Yalnız kontrol/onay yetkisi olan rol; gerekçe boş bırakılamaz.

**Veri mutasyonu:** `DB.tasks[].durum = Revizyon`, revizyon gerekçesi,
`DB.activities.unshift(...)`.

**Sonuç:** Gerekçeli geri gönderim; revizyon sayısı görev kartında izlenir.

**Bilinen eksik:** Revizyon turları ayrı kayıt olarak sayılmıyor (kaçıncı revizyon olduğu
yalnız aktivite geçmişinden okunabiliyor).

---

## 10 · Sohbetten Görev Oluşturma

**Durum:** Tam · `plan.md` `[x]`

**Tetikleyici:** Departman kanalında konuşulan bir konu işe dönüşür.

**Adımlar**

1. **`app-sohbet.html`** — kanal listesi (`DB.channels`), mesaj akışı (`DB.messages`),
   “Yeni Kanal”, “Paylaş” (dosya), tepki ekleme.
2. Bir mesaj üzerinden **“Mesajdan Görev Oluştur”** paneli açılır.
3. Panelde **16 alan** doldurulur: başlık, açıklama (mesaj gövdesinden devralınır), tür,
   öncelik, sorumlu, departman, proje, sprint, termin, tahmini süre vb.
4. **“Görevi oluştur”** → görev doğar **ve** kanala “şu görev oluşturuldu” mesajı düşer,
   böylece bağ sohbette görünür kalır.

**Yetki:** Kanal üyeliği + `ekle` yetkisi.

**Veri mutasyonu:** `DB.tasks.unshift(...)`, `DB.messages.push(...)` (kanal bildirim
mesajı), `DB.activities.unshift(...)`; yeni kanalda `DB.channels.unshift(...)`.

**Sonuç:** Konuşma kaybolmaz, izlenebilir göreve dönüşür; görev ile kaynak mesaj birbirine bağlıdır.

**Bilinen eksik:** Mesaja iliştirilen dosya göreve ek olarak taşınmıyor
(`GV.upload` `File` nesnesini geri vermiyor — `ui-debt.md` UID-04).

---

## 11 · Departmanlar Arası İş Talebi

**Durum:** Tam · `plan.md` `[x]`

**Tetikleyici:** Bir departman başka bir departmandan iş ister.

**Adımlar**

1. **`app-istalebi.html`** → “Yeni talep” → **`app-istalebi-form.html`**
   (hedef departman, konu, öncelik, termin, proje bağı).
2. **`app-istalebi-detay.html`** — hedef departman yöneticisinin karar ekranı. Ekran,
   hedef departmanın **mevcut yükünü** (açık iş, gecikmiş iş) karar öncesi gösterir.
3. Karar: **“Talebi kabul et”** veya **“Talebi reddet”** (red kararı onay ekseninde tutulur).
   Yetkisiz kullanıcıda “Kabul kararı yetkisi yok” uyarısı basılır.
4. Kabul sonrası **“Talebi göreve dönüştür”** → “Görev oluştur” → görev doğar,
   **talep göreve bağlı kalır**; “Üretilen görevi aç” ile geçilir.
5. Onay kuyruğu merkezî olarak **`app-panel-onaylar.html`** ve **`app-ayar-onay.html`**’de izlenir.

**Yetki:** `onay` (kabul/red kararı — hedef departman yöneticisi) · `ekle` (talep açma) ·
`duzenle`.

**Veri mutasyonu:** `DB.deptRequests[].durum` (Kabul edildi / Reddedildi / Tamamlandı),
`DB.tasks.unshift(...)`, `GV.chain` onay adımı, `DB.activities.unshift(...)`.

**Sonuç:** Departmanlar arası iş, sözlü değil kayıtlı ve terminli bir göreve dönüşür.

**Bilinen eksik:** Talep–görev bağı tek yönlü kurulu; görev tamamlandığında talep otomatik
kapanmıyor, talep durumu elle “Tamamlandı”ya çekilir.

---

## 12 · İzin Talebi

**Durum:** Tam · `plan.md` `[~]` — **not güncellendi:** izin talep formu artık **var**
(`app-izin-form.html`, `BUILT` içinde); akış artık uçtan uca tetiklenebiliyor.

**Tetikleyici:** Personel izin ister.

**Adımlar**

1. **`app-izin.html`** → **“İzin Talebi Oluştur”** → **`app-izin-form.html`**.
2. Formda: personel, izin türü (`DB.leaveTypes`), gerekçe (zorunlu), başlangıç/bitiş,
   gün sayısı, talep tarihi, **vekil personel**, proje takvimi çakışma işareti.
   Form kalan bakiyeyi ve takvim aralığı ile gün sayısı uyumunu canlı doğrular.
3. **`app-izin-detay.html`** — onay makamının ekranı. Karar öncesi otomatik kontroller:
   kalan bakiye yetiyor mu, departman içinde çakışan izin var mı, vekil aynı tarihlerde
   izinli mi, vekil farklı departmanda mı, izin aralığına açık görev düşüyor mu.
4. **“İzin talebini onayla”** / **“Reddet”** → `GV.chain`. Zincir **`app-ayar-onay.html`**
   `izin` akışında tanımlı: **Departman Yöneticisi (her talep) → İK (3 gün ve üzeri) →
   Genel Müdür (10 gün ve üzeri)**; her adımın SLA’sı ve vekil makamı yazılı.
5. Onay sonrası kapasite etkisi **`app-kapasite.html`**’de görünür.

**Yetki:** `ekle` (talep) · `onay` (karar; “Onay yetkiniz yok” kapısı) · `duzenle`.

**Veri mutasyonu:** `DB.leaves.unshift(...)` (form), `DB.leaves[].durum` +
`onayTarihi` + `ret` gerekçesi, `DB.activities.unshift(...)`.

**Sonuç:** Bakiye, vekil ve çakışma kontrolünden geçmiş, makam zinciriyle onaylanmış izin kaydı.

**Bilinen eksik:** Onaylanan izin `izinBakiye` alanından otomatik düşülmüyor; yıllık hak
alanı veride yok, gerektiğinde türetiliyor (ekranda “Yıllık hak alanı veride yok —
türetildi” notu ile dürüstçe belirtiliyor).

---

## 13 · Satın Alma Talebi

**Durum:** Tam · `plan.md` `[x]`

**Tetikleyici:** Bir departman ürün/hizmet ihtiyacı bildirir.

**Adımlar**

1. **`app-satinalma.html`** → **`app-satinalma-form.html`** (ürün, kategori, adet,
   tahmini maliyet, gerekçe, proje bağı, ihtiyaç tarihi). Form onay akışını
   `?akis=` ile açıklar ve **hangi makamların devreye gireceğini girilen tutara göre
   anında gösterir**.
2. **`app-satinalma-detay.html`** — talep kartı + `GV.chain` onay zinciri.
   Kural **`app-ayar-onay.html`** `satinalma` akışında, **6 makam** ve eşikleriyle:

   | Sıra | Makam | Koşul | SLA |
   |---|---|---|---|
   | 1 | Departman Yöneticisi | 100.000 ₺ ve üzeri | 1 gün |
   | 2 | Proje Yöneticisi | projeye bağlı **ve** 100.000 ₺ ve üzeri | 1 gün |
   | 3 | Satın Alma Sorumlusu | 250.000 ₺ ve üzeri | 2 gün |
   | 4 | Muhasebe | her talep | 2 gün |
   | 5 | Genel Müdür | 500.000 ₺ ve üzeri | 3 gün |
   | 6 | Şirket Sahibi | her talep (devredilemez) | 3 gün |

3. Her adımda **“Onayla”**; yetkisiz kullanıcıda “Onay yetkiniz yok”.
4. Teklif toplama **`app-satinalma-teklif.html`** (“Teklif karşılaştır”), tedarikçi
   **`app-tedarikci-detay.html`**.
5. Onay tamamlanınca sipariş **`app-siparis-form.html`** (`?talep=SAT-xxx` ön doldurmalı) →
   **`app-siparis-detay.html`** → teslim alınan ürün demirbaşa (**`app-demirbas-form.html`**)
   ve gerekiyorsa zimmete (14. akış) girer.

**Yetki:** `ekle` / `duzenle` · onay adımları rol bazlı (`GV.perm.role`) ·
tutarlar `finans` (“Tutarlar gizli”).

**Veri mutasyonu:** `DB.purchases.unshift(...)`, `DB.purchaseApprovals` adımları,
`DB.orders`, `DB.assets`, `DB.activities.unshift(...)`.

**Sonuç:** Tutar eşiğine göre doğru makamlardan geçmiş, siparişe ve demirbaşa bağlanan talep.

**Bilinen eksik:** Teslimat kalem dökümü tutulmuyor (ekranda “Teslimat kalem dökümü
tutulmuyor” notu var).

---

## 14 · Demirbaş Zimmeti

**Durum:** Kısmi · `plan.md` `[~]` — **not kısmen güncellendi:** zimmet oluşturma formu
(`app-zimmet-form.html`) ve **dijital onay adımı** artık var; eksik olanlar aşağıda.

**Tetikleyici:** Bir ekipman personele teslim edilir veya iade alınır.

**Adımlar**

1. **`app-demirbas.html`** / **`app-demirbas-detay.html`** — ekipman envanteri
   (`DB.assets`, `DB.assetCategories`).
2. **`app-zimmet.html`** → **“Yeni Zimmet”** → **`app-zimmet-form.html`**
   (`?demirbas=DMB-xxx` ile ekipmandan ön doldurulur): personel, teslim tarihi,
   zimmet durumu, hasar/eksik notu.
3. **`app-zimmet.html`** sekmeleri: Tümü · **Aktif Zimmetler** · **İmza Bekleyenler** ·
   **İade Edilenler** · **Hasarlı İadeler**.
4. Satır aksiyonu **“Teslim tutanağı”** → yazdırılabilir tutanak dökümü
   (personel, demirbaş, teslim/iade tarihi, dijital onay durumu, hasar kaydı).
5. Satır aksiyonu **“Personel onayını al”** → “Dijital onay” doğrulaması →
   `personelOnay = 'Onaylandı'`.
6. İade: kayda iade tarihi ve hasar notu işlenir, kayıt “İade Edilenler” /
   “Hasarlı İadeler” sekmesine düşer.

**Yetki:** `ekle` / `duzenle` · alış bedeli / amortisman alanları `finans`.

**Veri mutasyonu:** `DB.assignments.unshift(...)` (form), `personelOnay`, iade tarihi,
hasar notu, `DB.activities.unshift(...)`.

**Sonuç:** Hangi ekipmanın kimde olduğu, imzalanıp imzalanmadığı ve hasar durumu izlenir.

**Bilinen eksik** (form ekranının kendi uyarısında da dürüstçe yazılı):
- **Tutanak arkasında gerçek bir belge yok** — `tutanak` alanı zimmet numarasından türetilen
  bir metin; tutanak kolonundaki bağ `data-wip="Zimmet tutanağı"` olarak işaretli, PDF veya
  `DB.documents` kaydı üretilmiyor.
- **Teslim fotoğrafı ve hasar dosyası eki yok**; hasar tek satır serbest metin, kalem bazlı
  hasar ve onarım maliyeti tutulmuyor.
- Dijital onayda **imza sertifikası, IP, cihaz ve denetim izi tutulmuyor**.
- PROMPT.md §15’teki **QR kod okutma** adımının veri karşılığı yok.

---

## 15 · Araç Zimmeti

**Durum:** Kısmi · `plan.md` `[~]`

**Tetikleyici:** Bir araç personele tahsis edilir.

**Adımlar**

1. **`app-arac.html`** / **`app-arac-detay.html`** — araç kartı; tahsis bilgisi araç
   kartındaki **ana sürücü** alanında tutulur (**`app-arac-form.html`** ile girilir).
2. **`app-arac-detay.html` → “Zimmet” sekmesi** — bu araç için yazılmış zimmet kayıtları
   listelenir: zimmet no, personel, teslim, iade, personel onayı, hasar notu, durum.
   Kayıt yoksa “Zimmet tutanağı yok” boş durumu, aracın kime tahsisli olduğunu yazarak
   **`app-zimmet.html`**’e yönlendirir.
3. Tutanak ve dijital onay adımları 14. akışla **aynı ekranda** (`app-zimmet.html`) yürür;
   `DB.assignments` kaydı `arac` alanıyla da yakalanır.

**Yetki:** `ekle` / `duzenle` · araç alış bedeli, gider ve prim alanları `finans`.

**Veri mutasyonu:** `DB.vehicles[].anaSurucu` (araç kartı), `DB.assignments`
(araç alanlı kayıt yazılırsa), `DB.activities`.

**Sonuç:** Aracın kimde olduğu araç kartından, imzalı tutanak varsa zimmet modülünden okunur.

**Bilinen eksik:**
- **Araca özel zimmet formu ve “aracı zimmetle” aksiyonu yok.** `app-zimmet-form.html`
  yalnız `?demirbas=` ön doldurmasını biliyor; araç tahsisi bu formdan yapılmıyor
  (form ekranı bunu açıkça yazıyor).
- Mevcut mock veride `DB.assignments` içinde **araç kayıtlı zimmet yok** — sekme pratikte
  boş durumla açılıyor.
- 14. akıştaki tüm eksikler burada da geçerli: tutanak belgesi, teslim fotoğrafı,
  km/yakıt teslim tespiti, anahtar–ruhsat teslim kalemleri yok.

---

## 16 · Araç Bakımı

**Durum:** Tam · `plan.md` `[x]`

**Tetikleyici:** Periyodik bakım tarihi/kilometresi yaklaşır ya da arıza çıkar.

**Adımlar**

1. **`app-arac-bakim.html`** — sekmeler: Tümü · **Yaklaşanlar** · **Açık Bakımlar** ·
   **Serviste** · **Tamamlananlar**. Sonraki bakım tarihi/km’si araç kartından hesaplanır.
2. **“Bakım Planla”** → **`app-arac-bakim-form.html`** (araç, bakım türü, planlanan tarih,
   bakım km’si, servis, yapılacak işlemler, tahmini maliyet).
3. Satır aksiyonu **“Bakımı tamamla”** → gerçekleşen tarih ve maliyet girilir.
4. Alternatif giriş: **`app-arac-detay.html` → “Bakım Kaydı Ekle”** (araç kartından doğrudan).
5. Maliyet **`app-arac-gider.html`** ve **`app-rapor-filo.html`**’ye akar.

**Yetki:** `ekle` / `duzenle` · maliyet alanları `finans` (“Tutarlar gizli”).

**Veri mutasyonu:** `DB.maintenance` (durum → `Tamam`, `gercekTarihi`, `maliyet`),
**`DB.vehicleExpenses.unshift(...)`** — tamamlanan bakım filo gider kaydı doğurur.

**Sonuç:** Bakım planı → servis → tamamlama → gider kaydı zinciri kapanır; araç kartındaki
sonraki bakım eşiği güncellenir.

**Bilinen eksik:** Servis/tedarikçi kaydı `DB.suppliers` ile bağlı değil, servis adı düz metin.

---

## 17 · Sigorta Yenilemesi

**Durum:** Kısmi · `plan.md` `[x]` — **doğrulamada kısmi çıktı**

**Tetikleyici:** Trafik sigortası poliçesinin bitişine 60 gün kalır.

**Adımlar**

1. **`app-arac-sigorta.html`** — sekmeler: Tüm Poliçeler · **Trafik Sigortası** · **Kasko** ·
   **60 Gün İçinde** · **30 Gün İçinde** · **Yenileme Bekleyen**. Kademeli uyarı eşikleri
   **60/30/15/7 gün**.
2. Satır aksiyonu **“Yenileme başlat”** — bitişe **60 günden fazla varsa çalışmaz**
   (“Yenileme süreci bitişe 60 gün kala başlatılır” uyarısı). Onaylanırsa poliçenin
   yenileme durumu **“Teklif alındı”**ya çeker.
3. Yeni poliçe kaydı **“Poliçe Ekle”** ile açılmalıdır.
4. Prim tutarı **`app-arac-gider.html`** ve **`app-rapor-filo.html`**’ye yansır.

**Yetki:** `duzenle` · prim, teminat ve kasko bedeli `finans`.

**Veri mutasyonu:** `DB.policies[].yenileme = 'Teklif alındı'`.

**Sonuç:** Bitişi yaklaşan poliçeler kademeli uyarı üretir, yenileme süreci işaretlenir.

**Bilinen eksik:**
- **“Poliçe Ekle” hedefi `app-arac-sigorta-form.html` yayında değil** (`BUILT` içinde yok);
  bağ `shell.js` `markWip()` tarafından otomatik WIP’e çevriliyor. Yeni poliçe kaydı
  açılamıyor, yenileme zinciri **yeni poliçeyle kapanamıyor**.
- “Yenileme başlat” onay metninde “acenteden teklif istenecek ve **görev oluşturulacak**”
  denmesine rağmen **`DB.tasks` kaydı üretilmiyor**; yalnız poliçe alanı güncelleniyor.
- Acente/tedarikçi kaydı ve teklif karşılaştırma adımı yok.

---

## 18 · Kasko Yenilemesi

**Durum:** Kısmi · `plan.md` `[x]` — 17. akışla **aynı ekran, ayrı poliçe ekseni**

**Tetikleyici:** Kasko poliçesinin bitişine 60 gün kalır.

**Adımlar**

1. **`app-arac-sigorta.html` → “Kasko” sekmesi** — kasko poliçeleri ayrı eksende listelenir;
   trafik sigortasından farklı olarak **kasko bedeli**, **teminat kapsamı** ve
   **hasarsızlık indirimi** kolonları taşınır.
2. Uyarı eşikleri, “Yenileme başlat” aksiyonu ve yenileme durumu 17. akışla birebir aynıdır.
3. Kaza/hasar kaydı (20. akış) hasarsızlık kademesini etkiler — bağ **veride yazılı değil**,
   ekranda ayrı sütun olarak izlenir.

**Yetki:** 17. akışla aynı.

**Veri mutasyonu:** `DB.policies[].yenileme` (tür = Kasko olan kayıtlar).

**Sonuç:** Kasko ve trafik poliçeleri tek ekranda, ayrı sekmelerde, ayrı kolon setiyle izlenir.

**Bilinen eksik:** 17. akıştaki üç eksik aynen geçerli (poliçe ekleme formu yayında değil,
görev doğmuyor, acente kaydı yok). Ek olarak **hasar kaydı → hasarsızlık kademesi**
otomatik ilişkisi kurulmuyor.

---

## 19 · Muayene

**Durum:** Kısmi · `plan.md` `[x]` — **randevu adımı sahte**

**Tetikleyici:** Araç muayene geçerliliğinin bitişine 60 gün kalır.

**Adımlar**

1. **`app-arac-muayene.html`** — sekmeler: Tüm Araçlar · **60 Gün İçinde** ·
   **30 Gün İçinde** · **Süresi Dolanlar** · **Kusurlu Geçenler**.
   Uyarı eşikleri **60/30/15/7 gün**.
2. Satır aksiyonu **“Randevu görevi oluştur”** — muayene randevusunun idari işlere
   atanması amaçlanır.
3. **“Muayene Kaydet”** → **`app-arac-muayene-form.html`** (`?arac=` ön doldurmalı):
   muayene istasyonu, muayene tarihi, **sonuç (Geçti / Kaldı)**, kusur bilgisi,
   **sonraki muayene tarihi**.
4. Sonuç araç kartına yansır: **`app-arac-detay.html` → “Muayene” sekmesi**,
   “Muayene geçerliliği” ve “Sonraki muayene” satırları.

**Yetki:** `ekle` / `duzenle` · muayene ücreti `finans`.

**Veri mutasyonu:** `DB.inspections` (form kaydı), araç kartındaki geçerlilik tarihi.

**Sonuç:** Muayene geçerliliği kademeli uyarı üretir; sonuç ve sonraki tarih kayda geçer.

**Bilinen eksik:** **“Randevu görevi oluştur” gerçek görev üretmiyor** — onay sonrası yalnız
“Görev oluşturuldu ve atandı” bildirimi basıyor, `DB.tasks` kaydı doğmuyor. CLAUDE.md’deki
“sahte buton yasak” kuralına aykırı; ya `DB.tasks.unshift` ile gerçekleştirilmeli ya da
`data-wip` yapılmalı.

---

## 20 · Kaza ve Hasar

**Durum:** Kısmi · `plan.md` `[x]` — **kayıt açma formu yayında değil**

**Tetikleyici:** Kaza olur, araçta hasar oluşur veya trafik cezası gelir.

**Adımlar**

1. **`app-arac-kaza.html`** — üç kayıt türü tek listede, ayrı sekmelerde:
   **Tüm Kayıtlar** · **Kaza** · **Trafik Cezaları** · **Kapananlar**.
   Kolonlar: olay tarihi, araç, sürücü, konum, kusur oranı, tutar, durum, belge.
2. Yeni kayıt **“Kayıt Ekle”** ile açılmalıdır.
3. Satır aksiyonu **“Ödendi işaretle”** — yalnız trafik cezalarında çalışır; zaten ödenmiş
   cezada bilgi mesajı basar, aksi halde `DB.fines` kaydının durumunu `Ödendi` yapar.
4. Kayıtlar araç kartına düşer: **`app-arac-detay.html`** kaza ve ceza bölümleri;
   maliyetler **`app-arac-gider.html`** ve **`app-rapor-filo.html`**’ye akar.

**Yetki:** `duzenle` · tutar alanları `finans`.

**Veri mutasyonu:** `DB.fines[].durum = 'Ödendi'`; kaza kayıtları `DB.accidents`.

**Sonuç:** Kaza, hasar ve ceza tek ekranda izlenir, ceza ödemesi kapatılabilir.

**Bilinen eksik:**
- **“Kayıt Ekle” hedefi `app-arac-kaza-form.html` yayında değil** (`BUILT` içinde yok) —
  bağ otomatik WIP’e düşüyor; yeni kaza/hasar/ceza kaydı arayüzden açılamıyor.
- **Belge önizleme `data-wip`** — tutanak, ekspertiz raporu ve fotoğraf eki yok.
- Hasar → onarım → sigorta tazminat tahsilatı zinciri kurulu değil; kasko poliçesiyle
  (18. akış) veri bağı yok.

---

## 21 · Destek Talebi

**Durum:** Tam · `plan.md` `[x]`

**Tetikleyici:** Müşteri hata bildirir veya destek ister.

**Adımlar**

1. **`app-destek.html`** → **`app-destek-form.html`** (`?musteri=MUS-xxx` ön doldurmalı):
   konu, öncelik, kategori, bakım paketi, kanal.
2. **SLA ataması:** **`app-destek-sla.html`** politikaları (`DB.slaPolicies`) ile talebin
   önceliğine göre yanıt/çözüm süresi belirlenir. **`app-destek-detay.html`** kayıtlı SLA
   durumunu hesapla karşılaştırır (“Kayıtlı SLA durumu hesapla uyuşmuyor”,
   “SLA etiketi politikayla eşleşmiyor” uyarıları).
3. **Kota kontrolü:** **`app-destek-paket.html`** bakım paketi kalan destek hakkını izler;
   detayda talep kartındaki kalan hak paket kaydına karşı doğrulanır.
4. **Eskalasyon:** SLA aşımında talep üst kademeye taşınır, merkezî kuyrukta görünür.
5. **“Göreve dönüştür”** → “Talebi Göreve Dönüştür” paneli → “Görev Oluştur”.
   Üretilen görev talebe **`destek` alanıyla** bağlanır; “Görevi aç” / “Dönüşümleri gör”
   ile geçilir.
6. **Kapanış ve memnuniyet:** **`app-destek-memnuniyet.html`** anketi (`DB.surveys`);
   anket puanı talep kartındaki memnuniyet değerine karşı doğrulanır.

**Yetki:** `ekle` / `duzenle` · destek paketi tutarları ve kota bedeli `finans`.

**Veri mutasyonu:** `DB.tickets` (form ve durum), **`DB.tasks.unshift(...)`**
(göreve dönüştürme), `DB.activities.unshift(...)`.

**Sonuç:** Talep → SLA → görev → çözüm → memnuniyet anketi zinciri kapanır.

**Bilinen eksik:** Talep gövdesi (yazışma/mesaj geçmişi) ayrı tutulmuyor — ekranda
“Talep gövdesi ayrı tutulmuyor” notu ile dürüstçe yazılı.

---

## 22 · Personel İşten Ayrılışı

**Durum:** **Açık** · `plan.md` `[ ]` — ekran, menü kaydı ve koleksiyon **yok**

**Tetikleyici:** Personel istifa eder veya iş sözleşmesi sonlandırılır.

**Bugün ne var?**

- **İşe giriş tarafı karşılanıyor:** **`app-personel-form.html`** (`BUILT` içinde) kimlik,
  organizasyon, çalışma ve özlük, iletişim, ücret ve yetkinlik bölümleriyle **yeni personel
  kaydı açar**; `DB.employees.unshift(...)` gerçek mutasyon yapar. `girisTarihi` alanı
  personel kaydında mevcuttur.
- **`app-personel-detay.html`** personel kartı, **`app-rapor-personel.html`** İK raporları
  yayında.
- Personelin kayıt durumu yalnız `aktif` anahtarıyla (aktif/pasif) yönetilebiliyor.

**Neyin eksik olduğu**

- **Ekran yok:** PROMPT.md §14’teki “İşe Giriş / Çıkış” ekranı üretilmedi; ayrılış süreci
  için hiçbir `app-*.html` dosyası yok.
- **Menü kaydı yok:** `assets/js/shell.js` menü haritasında “İşe Giriş / Çıkış” girdisi
  bulunmuyor (PROMPT.md bölüm 8’de yazılı olmasına rağmen).
- **Koleksiyon yok:** `DB.employees` kaydında **`cikisTarihi`, ayrılış nedeni, ihbar süresi,
  çıkış mülakatı ve kıdem tazminatı alanları yok**; ayrılış sürecini tutacak ayrı bir
  `DB.*` koleksiyonu da tanımlı değil.
- **Bağlı adımlar kurulamıyor:** ayrılışta yürümesi gereken alt adımların hiçbirinin veri
  ya da ekran karşılığı yok —
  (a) açık zimmetlerin toplu iadesi (`app-zimmet.html` üzerinde “işten ayrılış zimmet
  kontrol listesi” adımı yok, `app-zimmet-form.html` bunu açıkça belirtiyor),
  (b) araç tahsisinin kaldırılması,
  (c) kullanıcı hesabının kapatılması (**`app-ayar-kullanici.html`** ile bağ yok),
  (d) açık görevlerin devri,
  (e) kalan izin bakiyesinin mahsubu,
  (f) çıkış mülakatı ve teslim tutanağı.

**Yapılması gereken (öneri):** `app-personel-cikis.html` (veya `app-personel-form.html`
içinde ayrı bir “Ayrılış” bölümü) + `DB.employees` alan genişletmesi + menü kaydı +
zimmet/araç/görev/hesap kapanış kontrol listesi.

---

## Akışlar Arası Bağlar (özet)

```
Yönlendiren ──► Aday ──► Müşteri ──► Ön analiz ──► Teklif ──► Sözleşme ──► Proje
    │                                                   │           │         │
    └──► Komisyon (onay + ödeme)                        │           └──► Ödeme planı
                                                        └──► Fatura ──► Tahsilat

Proje ──► Milestone ──► Sprint ──► Görev ──► Kontrol ──► Revizyon ──► Teslim
                                    ▲   ▲        ▲
      Sohbet mesajı ────────────────┘   │        │
      İş talebi (departmanlar arası) ───┘        │
      Destek talebi ─────────────────────────────┘

Satın alma talebi ──► Onay zinciri (6 makam) ──► Sipariş ──► Demirbaş ──► Zimmet
Araç ──► Bakım / Muayene / Sigorta / Kasko / Kaza ──► Filo gideri ──► Filo raporu
İzin talebi ──► Onay zinciri (3 makam) ──► Kapasite
```

## Genel Notlar

- **Merkezî onay motoru:** `app-ayar-onay.html` yedi akışın kuralını tek yerde tutar —
  `satinalma`, `izin`, `timesheet`, `teklif`, `degisiklik`, `gorevkontrol`, `sozlesme`.
  Eşikler mock veriden geri türetilmiştir; eşik değiştirilince uyum satırı farkı gösterir.
  **Komisyon onayı bu listede yok** — onay adımı yalnız `app-komisyon-detay.html` içinde yaşıyor.
- **Onay kuyruğu:** kullanıcıya düşen tüm onaylar `app-panel-onaylar.html`’de toplanır.
- **Aktivite geçmişi:** her mutasyon `GV.activity` / `DB.activities.unshift` ile eski→yeni
  değer yazar; ancak `DB.activities` yalnız dört kod önekini taşıdığı için detay
  ekranlarının çoğunda sekme boş görünür (`ui-debt.md` UID-16).
- **Yayında olmayan hedefler:** `shell.js` `markWip()` `BUILT` dışındaki her bağı otomatik
  olarak `data-wip`’e çevirir. Bu belgede tespit edilen iki yayında olmayan hedef:
  **`app-arac-sigorta-form.html`** ve **`app-arac-kaza-form.html`**.
