# Revize Turu Kapanış Raporu

> **Tur:** Gavia CRM Arayüz ve Sistem Revize Turu (`tasks/revize-talimati.md`)
> **Başlangıç:** 2026-08-07, 13. oturum · **Kapanış:** 2026-08-07, 16. oturum
> **Defter:** `tasks/revize-plan.md` — **138 / 138 alt madde** (grep ile ölçüldü)
> **Kapsam:** yalnız arayüz. Backend, veritabanı, gerçek API yok.

Bu belge `docs/N-kapanis-raporu.md`'nin **yerine geçmez**; o, ilk kapsamın
(295/295) kapanış belgesidir. Bu tur ondan sonra açıldı ve kendi defterinde
yürüdü.

---

## 1. Ne istendi, ne yapıldı

Talimatın ana prensibi tek cümleydi: *"Yeni özellik eklemekten önce mevcut
özellikleri birbirine doğru bağla."* Turun başındaki ölçüm bu teşhisi doğruladı:
**20 maddenin 6'sı hiç yoktu, 13'ü kısmen vardı, 1'i neredeyse hazırdı** —
hiçbiri sıfırdan bir modül gerektirmiyordu.

| Faz | Madde | Durum |
|---|---|---|
| **FAZ 1 — Kritik** | R01 görev durumları · R02 geçiş algoritması · R03 timesheet → süre · R04 timesheet + gider → maliyet | ✅ 4/4 |
| **FAZ 2 — Operasyon** | R05 durum/faz · R06 milestone/ödeme · R07 kapanış kontrolü · R08 bakıma geçiş · R09 ticket detayı · R10 ticket → görev/CR/fırsat | ✅ 6/6 |
| **FAZ 3 — Ticari ve müşteri** | R11 proje kaynağı · R12 sözleşme sorumlusu · R13 müşteri portalı · R17 hizmet paketi | ✅ 4/4 |
| **FAZ 4 — Sadeleştirme** | R14 pipeline · R15 departman/uzmanlık · R16 çalışma tipi · R18 opsiyonel modüller · R19 araç sayfaları · R20 rapor gruplama | ✅ 6/6 |

**Talimatın beş zinciri** (SON HEDEF bölümü) baştan sona çalışıyor:

1. `Lead → Fırsat → Teklif → Sözleşme → Proje` — R11 sözleşmeden proje
   başlatmayı forma bağladı, `kaynak` alanı zincirin hangi ucundan gelindiğini
   yazıyor.
2. `Proje → Görev → Timesheet → Maliyet → Kârlılık` — R03/R04; iki elle yazılı
   sayaç (`harcananSure` · `gerceklesenMaliyet`) **kaldırıldı**, dört kalem
   ayrı ayrı türetiliyor.
3. `Proje → Teslim → Müşteri Onayı → Kapanış → Bakım/Destek` — R07/R08; kapanış
   sekiz kontrolü tek yordamda gösteriyor, son adımı bakım paketine bağlıyor.
4. `Müşteri → Ticket → Görev / Revizyon / Yeni Fırsat` — R10; tek modalda üç dal.
5. `Personel → Görev → Çalışma Süresi → Kapasite → Proje Maliyeti` — R16 dış
   kaynak eksenini `calismaTipi`ye taşıdı, `GV.hr.disKaynak` oradan okuyor.

---

## 2. Kapanışta tarama seti — tek tek koşuldu

Hepsi **tek tek** koşturuldu (eşzamanlı koşum 15. oturumda makineyi doyurmuş ve
iki taramayı öldürmüştü). Ölçülen birim her satırda ayrı yazılıdır: *"TEMİZ"*
tek başına kanıt değildir (L-19 · L-27).

| Script | Ölçülen | Sonuç |
|---|---|---|
| `rec.js` | 62 hedef / 62 ekran, her biri gerçek kayıtla | **TEMİZ** |
| `canon.js` | **4.517 kontrol · 37 eksen** | **TEMİZ** |
| `dbref.js` | 142 ekran | **TEMİZ** |
| `links.js` | BUILT ↔ disk ↔ bağlantı | **TEMİZ** |
| `dep.js` | 142 ekran · 35 çağıran ekran · **81 yordam çağrısı** | **TEMİZ** |
| `esc.js` | 142 ekran · 62/62 kayıt | **TEMİZ** |
| `tabs.js` | 26 ekran · 26/26 kayıt · **225 sekme tıklaması** | **TEMİZ** |
| `mut.js` | 62 ekran · 62/62 kayıt | **TEMİZ** |
| `listen.js` | 62 ekran · 62/62 kayıt | **TEMİZ** (bkz. §4 — regresyon yakalandı) |
| `akt.js` | 26 ekran · **184 hareket** · aktivite sekmesi olmayan 0 | **TEMİZ** |
| `bag.js` | 3 ekran · 12 vaka · 12/12 kayıt | **TEMİZ** |
| `pers.js` | 9 ekran · 18 vaka · 6/6 kayıt | **TEMİZ** |
| `swtest.js` | anahtar 40 × 24 px | **TEMİZ** |
| `grip-qa.js` | tutamak ölçümleri | **TEMİZ** |
| `ctl.js` | kontrol görünümü ve boşluk kuralı | **TEMİZ** |
| `xport.js` | tamamen taşımayan kolon **0** · kısmi 24 | **bilinçli** (§3) |
| `act.js` | **213 aksiyon** · yalan 0 · ölü 0 | **TEMİZ** |
| `gate.js` | **710 sayfa yüklemesi** (142 ekran × 5 rol) · konsol hatası 0 | **TEMİZ** |
| `qa.js` | **142 ekran × 3 kırılım** (1440/768/390) — 429 ekran görüntüsü yazıldı | **TEMİZ** |
| `portal.js` | **iki persona** · 142 ekran · açık 18 / 403 124 · 109+108 yabancı iz · **3.906 iz×ekran kontrolü** · doğrudan adres 2/2 kapalı | **TEMİZ** |

> ⚠️ **Bir `qa.js` koşumu GEÇERSİZ sayıldı ve tekrarlandı.** Süreç 11 dakika
> ayakta kaldı ama `%0,1` CPU, **sıfır TCP bağlantısı**, **hiç Playwright
> tarayıcısı yok** ve çıktı dosyası **0 bayt**tı: tarayıcı düşmüş, node boşta
> asılı kalmıştı. Öldürülüp 48+48+46'lık üç parça hâlinde yeniden koşuldu.
> Kanıt bu kez sayıyla ölçüldü: **429 yeni ekran görüntüsü = 143 × 3 kırılım**.
> *Ders: bekleme döngüsüne değil sürecin kendisine bakılır — CPU, bağlantı,
> çıktı dosyasının son değişiklik zamanı.*

---

## 3. `xport.js` "EKSİK" der — bu bir hata DEĞİLDİR

Tamamen taşımayan kolon **0**. 24 kolon "kısmi": ekranda dolu, çıktıda boş.
Yirmi dördü de aynı sınıf — veri alanı boş iken ekranın **yer tutucu cümle**
basması: `Zimmetsiz` · `Süresiz` · `Vekil yok` · `departman değil — çalışma
tipi` · `uzmanlık ekseni yok` · `Ölçülemiyor`. Ekran için doğru olan cümle
yazmak, CSV/Excel için doğru olan **boş hücre** yazmaktır; bilgi kaybı yoktur.
Araç bu sınıfı ayırt edemiyor ve damgası **bilinçle yumuşatılmadı**: kendi
bulgusunu susturacak şekilde esnetilen araç, ölçüme olan güveni bozar
(L-17 · L-26 · L-29).

---

## 4. Ölçüm setinin bu turda yakaladığı beş şey

Beşi de kod incelemesinden **önce** taramayla bulundu. Turun asıl kazancı
budur: hata sınıfı bulunduğunda eksen açıldı, eksen sonraki hatayı yakaladı.

1. **`canon.js` kendi veri kökünü sabit yolla tutuyordu (L-35).** REVİZE 05'in
   altı olumsuz vakasının **altısı da** yanlışlıkla "TEMİZ" döndü — script
   bozulmuş kopyayı değil gerçek repoyu okuyordu. Yani "bozulmuş kopyayla sına"
   protokolü o araçta **hiç çalışmamıştı**. Kök `qa-lib.repoRoot()`e bağlandı.
2. **`dep.js` yeni bir hata sınıfını ölçülebilir yaptı (L-34).** Ortak yordamın
   **içeriden** okuduğu koleksiyonlar da sözleşmenin parçasıdır. Bu turda
   `app-sozlesme-detay.html`'in `domain.js`'i **hiç yüklemediğini** yakaladı —
   `GV.yenileme` tıklama anında patlayacaktı, açılışta değil.
3. **`listen.js` bir regresyonu yayına çıkmadan yakaladı (L-36).** REVİZE 18'in
   modül anahtarı menüyü tazeliyor, tazeleme yordamı `wireNav()`i de çağırıyor
   ve o `document` ile `window`'a bağlanıyordu: `GV.refresh()` başına **+3 net
   dinleyici**, 30 detay ekranında. Hiçbir ekran hata vermiyordu.
4. **`portal.js` (bu turda açıldı) 124 sızıntı buldu.** `permMatrix.musteri.gor`
   beş oturumdur `'kendi'` yazıyordu; o bir **personel** eksenidir ve müşteri
   oturumunda karşılığı yoktur — yani `GV.list`in müşteri dalı hiç çalışmamış,
   ekranlar koleksiyonun tamamını basmıştı. Düzeltmeden sonra iki personayla
   **TEMİZ**.
5. **Bir ajan veri hatası buldu:** `DB.documents` genişletmesinde bir kayda
   `arac` anahtarı iki kez yazılmıştı (`arac:null, arac:'ARC-001'`). Sonuç
   doğruydu, ölü anahtar kalmıştı; aynı turda temizlendi.

---

## 5. Ortak katmana eklenenler

Bu tur ekrana değil **ortak katmana** yazdı; aynı kural bir daha 26 ekranda
tekrarlanmasın diye.

| API | Ne yapar | Hangi borcu kapattı |
|---|---|---|
| `GV.task.*` | Görev geçişinin **tek** mutasyon noktası | Geçiş tablosu beş oturumdur veride duruyordu, **uygulanmıyordu** |
| `GV.zaman.onayla/iade/onaylaKayit` | Haftalık onay ↔ satır onayı tek eksen | "Onaylı saat" iki farklı şey demekti; dört kayıt kendi haftasıyla çelişiyordu |
| `GV.proje.sure/maliyet` | Süre ve maliyeti **türetir** | İki elle yazılı sayaç kaldırıldı (9.125 saat · 14 kayıtlık tek rakam) |
| `GV.proje.acik/bitti/kapali/arsivli/geciken` | "Bu proje devam ediyor mu?" tek tanım | Aynı cümle **yedi ekranda** ayrı yazılıydı |
| `GV.proje.kapanisKontrol/kapat` · `bakim*` | Kapanış ve bakıma geçiş | — |
| `GV.destek.*` | "Açık talep" tek tanım | **On iki** yerde elle yazılıydı |
| `GV.yenileme.*` | Sözleşme + paket yenilemesi tek yordam | İki uygulama **farklı davranıyordu** (biri aktivite yazıyor, biri yazmıyordu) |
| `GV.hr.icMaliyet/disKaynak` | İç maliyet ve dış kaynak ekseni | Alan açılmadı, türetiliyor (L-08) |
| `GV.form` → `showIf` · işlev `required` | Koşullu alan ve koşullu zorunluluk | Hüküm ekranda değil bileşende |
| `GV.list` → yordam `scopeField` · kanban `groupOf` | Kapsam ve kolon eşlemesi | Kapsam alanı kayıtta doğrudan yazılı olmayabilir |
| `GV.guardRecord` | Detay ekranı kayıt sahipliği | Liste kapsamlıyken detayın ham `?id=` okuması kapsamın arka kapısıydı |
| `Perm.modul` + `SCREEN_DENY` | Modül anahtarı ve ekran yasak listesi | Menü gizlemesi ile adres kapısı **tek kaynaktan** |

---

## 6. Uydurulmayanlar — kayıt olarak

Turun en çok tekrarlanan kararı buydu: **kanıtı olmayan değer yazılmadı, ekran
sıfır basmak yerine durumu söyledi.** Tamamı `tasks/assumptions.md`'de
gerekçesiyle yazılı (**61 varsayım**).

| Ne | Neden yazılmadı |
|---|---|
| ~5.600 saatlik proje emeği (V-45) | Dokuz projenin ne modülü ne görevi var; `kapsam:false` döner, ekran *"defterde kayıt yok"* der |
| Altı arşivli projenin sözleşme kaydı (V-54) | Sözleşme defteri 2025-06'da başlıyor; altı sahte SZL numarası, tarihi ve ödeme planı doğardı |
| Kapanmış 7 projenin fazı (V-48) | Hangi fazda bittikleri türetilebilir bir bilgi değil |
| Proje türünün sözleşmeden ön dolgusu (V-56) | 7 sözleşme adının 7'si hizmet kataloğunun hiçbir değerini taşımıyor — eşleşme 0/7 |
| 24 aylık paketin periyodu (V-57) | Sözlükte karşılığı yok; `Yıllık` yazmak iki yıllık paketi yıllık göstermek olurdu |
| Altı paketin sözleşme bağı (V-58) | Tarih kesişimi bağ değildir; kesişen sözleşmelerin hepsi **geliştirme** sözleşmesi |
| Bir ruhsat belgesinin aracı (V-59) | Belgedeki plaka filodaki dört aracın hiçbirinin değil |
| Yedi personelin uzmanlığı (V-60) | O ana departmanlar için doküman uzmanlık listesi vermiyor; pozisyon zaten işi anlatıyor |
| Bakım paketi ↔ proje bağı (V-52) | Veride yazılı bağ yok; bağ kapanış akışında kullanıcı kurunca doğar |

---

## 7. Talimatın "YAPILMAMASI GEREKENLER" listesi — tek tek

| Yasak | Durum |
|---|---|
| Tasarımı baştan oluşturma | ✅ `tokens.css` ve bileşen dili değişmedi |
| Sidebar'ı değiştirme | ✅ yapı aynı; yalnız **altı filo alt maddesi** menüden kalktı (ekranlar duruyor) ve müşteri rolüne `proje` bölümü açıldı |
| Renk sistemini değiştirme | ✅ değişmedi |
| Yeni UI framework | ✅ yok — buildless, saf JS |
| Mevcut komponentleri yeniden tasarlama | ✅ yeni yetenekler var olan bileşenlere eklendi |
| Yeni ana modül ekleyerek büyütme | ✅ **yeni ana menü açılmadı**; `app-rapor-destek.html` bilerek AÇILMADI |
| Backend mimarisi / API tasarımı | ✅ yapılmadı |
| Demo veriyi gerçek veri kabul etme | ✅ her türetmenin kaynağı yazılı, kanıtsız değer yazılmadı |
| **Çalışan modülleri kaldırma** | ✅ **hiçbir ekran silinmedi.** R19'da altı ekran menüden kalktı, `BUILT`'te ve doğrudan adresle erişilebilir; R18'de modül kapatmak **veriyi silmiyor** |
| Aynı özelliği iki yerde kurma | ✅ yenileme akışı, kapsam tanımları ve durum eksenleri tek yordama indirildi |
| Gereksiz form alanı | ✅ `icMaliyetSaat` ve `cozumTarihi` **alan olarak açılmadı**, türetiliyor |
| Kullanıcıyı fazla tıklamaya zorlama | ✅ rapor dizininde arama sonuçları açık gelir; sözleşme seçimi beş alanı ön doldurur |

---

## 8. Sayılarla tur

| | |
|---|---|
| Alt madde | **138 / 138** |
| Ekran | **142** (değişmedi — tur ekran açmadı) |
| Canon ekseni | 24 → **37** |
| Canon kontrolü | 2.588 → **4.517** |
| Tarama script'i | 19 → **21** (`dep.js` · `portal.js`) |
| Varsayım kaydı | 41 → **61** |
| Ders | 29 → **31** (L-30 … L-36) |
| Commit | **32** (tur boyunca, hepsi `main`'e push edildi) |
| İnşaat terminolojisi | **0 sonuç** (şantiye · taşeron · hakediş) |

---

## 9. Bu turdan sonra ne kaldı

**V2'ye bağlı tek parça:** müşteriye fatura/ödeme görünürlüğü. Talimat
*"yetki verilmişse"* diyor; bu **kullanıcı bazlı** bir yetki kaydı ister,
prototipte yetki rol düzeyinde ve `finans` tek bayrak. Rolü `finans:true`
yapmak **tüm** müşterilere tüm finansı açardı — uydurma çözüm üretilmedi.

**Ölçülmüş ama bu turun konusu olmayan borç:** iç rollerin (`kendi` ·
`departman` · `proje` kapsamları) liste ekranlarında kapsam eşlemesi hâlâ yok.
Müşteri kapsamı bu turda kuruldu ve bilinçli olarak **yalnız müşteri
oturumunda** bildiriliyor; koşulsuz bildirilseydi 12 rolün ekranına bu tur
istenmemiş bir uyarı çubuğu girerdi. Kapatılması ayrı bir karardır.
