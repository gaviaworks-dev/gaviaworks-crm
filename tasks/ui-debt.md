# ui-debt.md — Arayüz Borç Defteri

> Ekran üretimi sırasında fark edilen ama **o an düzeltilmeyen** arayüz sorunları.
> Hiçbiri nokta yamasıyla kapatılmaz — hepsi **plan.md → FAZ: UI ve UX KALİTE GEÇİŞİ**
> içinde, ortak katmanda kök nedenden çözülür.
>
> **Genel kural:** Referans projeden **biçim, oran, yerleşim ve etkileşim davranışı** alınır;
> **renk, tipografi ve gölge değerleri ALINMAZ** — onlar `assets/css/tokens.css`'ten gelir.
> Hiçbir çözümde hardcode renk kullanılmaz.

---

## ✅ UID-01 · Rail collapse çentiği referansa göre bozuk — ÇÖZÜLDÜ (2026-08-04)

**Çözüm:** Tutamak iki katmana ayrıldı — `.gv-divider` artık kenar boyunca uzanan görünmez
28×160 px yakalama bandı (gerçek `<button>`, `aria-expanded` + `aria-controls`), içindeki
`span` ise bitişik yüzeyin token rengini (`--brand-night` / daraltılmışken `--brand-abyss`)
taşıyan, kenarlıksız-gölgesiz, yalnız dışa bakan kenarı yuvarlak 24×56 px grip.

**Ölçüm (Playwright, 1440/1024/768/390, iki durum):** bant içeri 10 px / dışarı 18 px,
sekiz farklı noktadan hover tetiklendi, bant dışından tetiklenmedi; grip rengi bitişik
yüzeyle birebir aynı; menü kalemleri ve rail vurgusuyla kesişim yok; bant hiçbir etkileşimli
öğeyi örtmüyor. Yan etki olarak 981–1180 px aralığındaki "ilk tıklama boşa gidiyor" hatası
da düzeldi (tutamak artık sınıf değil gerçek durum üzerinden karar veriyor).

---

## UID-01 (özgün kayıt) · Rail collapse çentiği referansa göre bozuk

**Nerede:** Tüm ekranlarda sol rail ile içerik arasındaki daralt/genişlet tutamağı.

**Sorun:** Tutamak açık renkli, kenarlıklı ve yüzen bir pastil gibi duruyor; arkasındaki
vurgu çizgisiyle üst üste biniyor, sidebar ile arasında görünür bir dikiş oluşuyor.

**Referans:** `https://gaviaworks-dev.github.io/gaviacrm/v2/crm-panel-ajanda.html`
adresindeki tutamak.

**ÖNEMLİ AYRIM — referanstan SADECE biçim ve davranış alınacak, renk ALINMAYACAK:**

- **Alınacak olan:** geometri ve oturuş — tutamak sidebar yüzeyinin devamı gibi, tam yapışık,
  sadece dışa bakan kenarı yuvarlak, kenarlıksız, dikişsiz; ikon optik olarak ortalanmış;
  genişlik, yükseklik ve köşe yarıçapı oranları.
- **Alınmayacak olan:** referansın renk paleti. Renkler bu projenin kendi `tokens.css`
  değerlerinden gelecek, hardcode renk yazılmayacak. Tutamak, bitişik olduğu yüzeyin token
  rengini kullanacak ki uzantısı gibi görünsün; hover ve odak durumları da bu projenin
  token'larıyla kurulacak.

**Kök neden tahmini:** Tutamak sidebar bileşeninin parçası değil, ayrı konumlanmış bir öğe
olarak kurulmuş.

**Çözüm (kapanış fazında):** Tutamak sidebar yüzeyinin uzantısı olarak yeniden kurulacak,
tıklama alanı en az 24×44 px olacak, hover ve odak durumu olacak, içerikle çakışmayacak.

---

## UID-02 · Mobil kart listesinde satır aksiyonu yok

**Nerede:** `GV.list` mobil görünümü (`.gv-cardlist` / `.gv-mrow`) — **tüm liste ekranları**, ≤760px.

**Sorun:** `GV.list` masaüstü tablosunda `rowActions` basıyor ama mobil kart listesine basmıyor.
Sonuç: 390px'de satır aksiyonları **hiç erişilemiyor** — arşiv ekranında "geri al" ve "kalıcı sil",
tahsilatta "hatırlatma gönder", otomasyonda "kuralı çalıştır" gibi işlemler mobilde yok.

**Kök neden:** Mobil kart markup'ı `cfg.mobile(r)` çıktısıyla sınırlı; aksiyon şeridi yalnız
tablo satırında kuruluyor.

**Çözüm (kapanış fazında):** Aksiyon şeridi `GV.list` içinde **tek yerde** üretilip hem tablo
satırına hem mobil karta basılacak (ikinci markup yazılmayacak — components.md kuralı). Mobilde
aksiyonlar ya kart altında şerit ya da tek bir "…" menüsü olacak; tıklama alanı en az 44 px.
Referanstan yalnız yerleşim/davranış alınacak, renk projenin token'larından gelecek.

---

## UID-03 · Kare görsel (thumbnail) sınıfı bileşen katmanında yok

**Nerede:** Logo, profil fotoğrafı, ürün/varlık görseli gösteren her yer.

**Sorun:** `ui.css`'te kare görsel sınıfı yok. Mevcut tek avatar sınıfı `.gv-user-ava` **yuvarlak**.
`app-ayar-sirket.html` logo önizlemesini bu sınıfla kurmak zorunda kaldı ve `background-size:cover`
iki özelliği **inline** vermek durumunda kaldı.

**Kural hatırlatması (CLAUDE.md):** Kare görsel `img` ile değil, `div + background-image: cover/center`
ile kurulur.

**Çözüm (kapanış fazında):** `.gv-thumb` (kare, `background-size:cover; background-position:center`,
token'lı köşe yarıçapı, `is-sm/is-md/is-lg` boyutları) bileşen katmanına eklenecek ve inline stil
kullanan yerler ona çevrilecek. Boş durumda baş harf/ikon düşüşü de aynı sınıfta tanımlanacak.

---

## UID-04 · `GV.upload` dosyanın kendisini geri vermiyor

**Nerede:** `GV.upload({onChange})` — logo ve profil fotoğrafı önizlemesi gereken her ekran.

**Sorun:** `onChange` yalnız `{ad, boyut}` veriyor; gerçek `File` nesnesi dışarı çıkmıyor.
Önizleme yapmak isteyen ekran mount üzerine **capture fazlı `change` dinleyicisi** takmak
zorunda kalıyor (`app-ayar-sirket.html` bunu yaptı) — bileşenin iç işleyişine sızan bir çözüm.

**Çözüm (kapanış fazında):** `GV.upload`'a `onFile(file, meta)` geri çağrısı eklenecek ve
istenirse bileşen önizlemeyi kendisi basacak (`.gv-thumb` ile — bkz. UID-03).

---

## UID-05 · `GV.perm.scope('gor')` liste ekranlarında uygulanmıyor

**Nerede:** `GV.list` kullanan **tüm** liste ekranları (65+ ekran).

**Sorun:** `GV.perm.scope('gor')` `'tum' | 'departman' | 'proje' | 'kendi'` döndürüyor ama
ekranların yalnız üçü (`app-panel-ozet`, `app-rapor-personel`, `app-rapor-proje`) bunu okuyor.
Liste ekranları kaynağın **tamamını** basıyor. Ölçülen örnek: `app-destek-paket.html`
`musteri` rolüyle açıldığında 6 müşterinin bakım paketini birden gösteriyor —
maskeleme çalışıyor ama **satır kapsamı** yok.

**Kök neden:** Kapsam süzgeci ekran başına yazılması gereken bir şey olarak bırakılmış;
ortak katmanda karşılığı yok. 65 ekrana tek tek yazmak da zaten yanlış çözüm.

**Çözüm (kapanış fazında):** `GV.list`'e `scopeField` sözleşmesi eklenecek
(`{ musteri:'musteri', personel:'sorumlu', proje:'proje', dep:'dep' }` gibi bir eşleme).
`GV.list` kaynağı basmadan önce oturumdaki rolün `scope('gor')` değerine göre süzecek;
ekran yalnız hangi alanın hangi kapsama karşılık geldiğini bildirecek. Süzgeç uygulandığında
liste üstünde bilgilendirici bir çip görünecek ("Yalnız kendi kayıtlarınız").
`scopeField` vermeyen ekran için davranış değişmez — geçiş kırılmadan yapılabilir.

---

## UID-06 · `GV.list` sayfa başlığı sayacı global, ikinci liste örneğini engelliyor

**Nerede:** `GV.list` → kayıt sayacını `document.querySelector('[data-listcount]')` ile yazıyor.

**Sorun:** Sayaç mount kapsamına değil **belgeye** bağlı. Aynı sayfada iki `GV.list` örneği
kurulursa ikisi de aynı düğüme yazar; ikincisi birincinin sayısını ezer. Sonuç: bir ekranda
iki liste kurmak pratikte mümkün değil. `app-egitim.html` katılımcı kırılımını bu yüzden
ikinci liste olarak değil, elle kurulmuş bir matris olarak yazmak zorunda kaldı — yani
ortak bileşenin kapsamadığı bir yerde tekrar markup doğdu (components.md kuralına aykırı).

**Çözüm (kapanış fazında):** `GV.list`'e `countTarget` seçeneği eklenecek; verilmezse sayaç
bileşenin **kendi mount kökü içinde** aranacak, belge genelinde değil. Matris kuran ekranlar
ikinci `GV.list` örneğine çevrilecek.

---

## ✅ UID-07 · Toplu işlem "çıktı al" seçili kapsamı dışa aktaramıyor — ÇÖZÜLDÜ (2026-08-05, 10. oturum)

**Önce fizibilitenin cevaplanmayan yarısı ölçüldü** (9. oturumda statik analiz beceremedi):
yeni tarama ekseni **`tasks/qa/xport.js`** `ui.js`'i bellekte yamalayıp her `GV.list`
örneğinin `visibleCols()` + `source()` çiftini okuyor ve her hücre için iki değeri
karşılaştırıyor — EKRAN (`render`) ile ÇIKTI (`exportValue` ‖ `r[key]`, `doExport` ile birebir).

| Ölçüm | Sonuç |
|---|---|
| Taranan ekran | **141** · `GV.list` kuran **68** · yüklenen kayıt **706** |
| Çıktıya giren kolon | **623** · ölçülen hücre **6.335** |
| **Tamamen taşımayan kolon** | **0** |
| Ekranda dolu / çıktıda boş hücre | **47 (%0,7)**, 16 ekranda, hepsi **kısmi** |

**Kolon tanımı yetmeyen ekran yok.** 47 hücrenin 47'si aynı sınıf: veri alanı boş ya da `'—'`
iken ekranın **yer tutucu metin** basması (`Zimmetsiz` · `Süresiz` · `Proje dışı` ·
`Tercih bekliyor` · `Vekil yok`). Çıktı bilgi kaybetmiyor, yalnız yer tutucu yerine boş hücre
yazıyor — CSV/Excel için **doğru olan da budur**. Yani `exportRows` yazmanın önünde engel yoktu.

**Aracın kendi sınaması (L-24):** olumsuz vaka `app-lead.html` `yonlendiren` kolonu —
`LEAD-2026-006` `kaynak:'Organik arama'` ama `yonlendiren:'—'`; araç 12 kaydın 2'sinde
"ekranda dolu, çıktıda boş" dedi, veri elle doğrulandı. Olumlu vaka aynı ekranın `firma`
(`exportValue` yazılı) ve `butce` (alan kayıtta var) kolonları — temiz raporlandı.

**Çözüm — ortak katmanda, ekran başına `run` yazılmadan:**
1. `ui.js`'e **`exportRows(list, fmt)`** eklendi ve `GV.list` **dönüş yüzeyine** çıktı.
   Liste hem kayıt nesnesi hem kayıt anahtarı kabul ediyor; biçim verilmezse kullanıcıya
   soruyor; kapsam boşsa `warn` tonlu uyarı basıyor (**asla sessiz başarı demiyor**).
2. Biçim seçim markup'ı (`fmtField`) tek yerde üretiliyor — çıktı modalı ve seçili-kapsam
   modalı **aynı listeyi** kullanıyor, ikinci markup doğmadı.
3. **`bulk[].export:true`** sözleşmesi: bu maddenin yordamı bileşende. **53 ekranda**
   `{ key:'disa', … }` maddesine tek anahtar eklendi; 53 kez aynı `run` closure'ını yazmak
   "aynı mantık ikinci kez yazılmaz" kuralını çiğnerdi.
   *Karar gerekçesi:* alternatif, her ekranın `GV.list` dönüşünü değişkene alıp
   `run:function(ids){ L.exportRows(ids); }` yazmasıydı — 53 kopya, üstelik `L` henüz
   atanmadan config okunduğu için kırılgan closure sırası. Bileşen tarafı seçildi.
4. Seçim çıktı sonrası **korunuyor** (mutasyon değil; kullanıcı aynı seçimle ikinci biçimi
   de alabilir).

**Ölçülen sonuç:** `act.js` yeni hüküm **ÇIKTI** (dosya gerçekten indi) ile 141 ekranda
**51 çıktı aksiyonu** doğruladı; "bu sürümde yok" damgası **85 → 32** toplu aksiyona indi.

---

## UID-07 (özgün kayıt) · Toplu işlem "çıktı al" seçili kapsamı dışa aktaramıyor

**Nerede:** `GV.list` `bulk[].run(ids)` — tüm liste ekranları.

**Sorun:** `GV.list` dönüşü yalnız `state/refresh/setTab/setFilter` veriyor; seçili kayıtlarla
dışa aktarımı tetikleyen bir API yok. Bu yüzden her ekranın "seçilenleri dışa aktar" toplu
işlemi yalnız `GV.toast` basıyor — üst şeritteki Excel/CSV/PDF çıktısı çalışırken toplu
işlemdeki aynı isimli aksiyon çalışmıyor. Kullanıcı açısından bu **sahte buton** sınırına
yakın; en az üç ekranda aynı desen tekrarlandı.

**Çözüm (kapanış fazında):** `GV.list` dönüşüne `exportRows(rows, format)` eklenecek ve
toplu işlem bunu seçili kayıtlarla çağıracak. Ekranlarda tekrarlanan toast deseni silinecek.

---

## ✅ UID-08 + UID-09 · Kontrol–etiket boşluğu ve native kontroller — ÇÖZÜLDÜ (2026-08-05, 10. oturum)

> İkisi **tek taban kuralın iki yüzü** olduğu için birlikte kapatıldı (plan.md'nin
> öngördüğü sıra). Yeni ölçüm ekseni: **`tasks/qa/ctl.js`**.

### Ölçüm — borç GERÇEKTİ ve kök neden sanılan yerde değildi

`ui.css` `.f-check` ve `.f-radio` için **`display:flex; gap:var(--sp-5)` zaten yazıyordu**.
Buna rağmen çalışma zamanında ölçülen boşluk **0 px**'ti. Sebep:

```
.field label{ display:block; … }      /* 0,1,1 */
.f-check    { display:flex; gap:… }   /* 0,1,0  → KAYBEDİYOR */
```

Alan başlığı kuralı, kontrolü **saran** etiketi de yakalıyor ve `display:flex`'i eziyordu;
`gap` bir blok kutuda hiçbir işe yaramıyor. Aynı hata 5. oturumda **`.f-switch` için tek tek
yamanmıştı** (`ui.css`'te kendi yorumu duruyor) — kalan iki sınıf geride kaldı. Yani kusurun
dört kez tekrarlaması bir tesadüf değil, **nokta yamasının doğal sonucuydu**.

| Ölçüm (`ctl.js`, 141 ekran) | Önce | Sonra |
|---|---|---|
| Kontrol–etiket çifti | 2.422 | 2.422 |
| **Bitişik (< 6px)** | **97 → tümü 0 px** (3 ekranlık ön ölçümde) | **0** · en dar **8 px** |
| Native `select` | 4 / 25 (ön ölçüm) · tam taramada 732'nin bir bölümü | **0 / 732** |
| Native kutu / radyo | **4.154 / 4.154** | **0 / 4.154** |
| Açılan panel / modal | — | **197** (filtre · kolon · çıktı) |

> **Kapsam notu:** borç kaydı **Çıktı Al modalı** ve **Gelişmiş Filtre paneli** için
> yazılmıştı; ikisi de ancak tıklayınca doğuyor. `ctl.js` her liste ekranında üç paneli
> de açıp içini ölçer — açılışa bakan bir tarama bu borcu göremezdi (L-12 sınıfı).

### Çözüm — iki kural, sıfır ekran yaması

1. **Alan başlığı kuralı kalıba bağlandı:** `.field label:not(:has(input))`.
   Kontrolü saran etiket alan başlığı **değildir**; ayrım sınıf adına değil kalıba bakar.
2. **Kontrol + etiket taban kuralı:**
   `:where(label:has(> input[type=checkbox]), label:has(> input[type=radio]))` →
   `inline-flex` + `gap:var(--sp-5)`. `:where()` özgüllüğü sıfırladığı için `.f-check`,
   `.f-radio`, `.lh-toggle` kendi ölçüsünü serbestçe geçebiliyor; **yeni markup da
   kendiliğinden uyuyor**.
3. **Kontrol görünümü tür bazında:** `:where(input[type=checkbox], input[type=radio])`
   `appearance:none` + token'lı kutu / köşe / kenarlık / odak halkası; onay işareti
   **CSS `clip-path` ile çizildi** (ikon dosyası ya da renk hardcode'u yok),
   `:indeterminate` de kapsandı. `accent-color` yazan **dört sınıf başına kopya silindi**.
4. **`select` kuralı `.field` bağlamından çıkarıldı** — sayfalama boyutu, rapor filtre
   şeridi ve ayar ekranlarındaki `select`'ler native kalıyordu; artık hepsi aynı ok.
5. **Tarih alanı:** takvim düğmesinin ölçüsü/tonu standartlaştırıldı, native kontrol
   **korundu** — gerekçe `assumptions.md` **V-36**.

**Görsel doğrulama:** 1440 px'de filtre paneli, çıktı modalı, tablo seçim kutuları ve
tarih alanı ekran görüntüsüyle teyit edildi; radyo noktası ilk denemede kutuyu doldurup
**halka** görünümü verdiği için `--sp-5` → `--sp-3`'e çekildi (ölçüm olmadan fark edilmezdi).

---

## UID-08 (özgün kayıt) · Form kontrolü ile etiketi arasında boşluk yok

**Nerede:** Çıktı Al modalındaki radio grubu, Gelişmiş Filtre panelindeki checkbox listesi
ve aynı kalıbı kuran **tüm ekranlar**.

**Sorun:** `input` ile etiket metni bitişik; aralarında hiç boşluk yok.

**Kök neden:** Ortak katmanda kontrol ile etiketi arasında **taban boşluk kuralı yok**.
Bu kusurun **dördüncü tekrarı** — persona çipi · giriş rol kartı · radio grubu · checkbox
listesi. `lessons.md` **L-04** ile aynı aile: iki parçalı etiket kalıbının boşluk/akış
davranışı ortak katmanda tanımlı değil, her yerde yeniden doğuyor.

**Çözüm (kapanış fazında):** `ui.css`'te **tek taban kural** — kontrol + etiket kalıbı için
token'lı boşluk (ve dikey optik hizalama). **Ekran ekran yama YASAK.**

---

## UID-09 · Native form kontrolleri tasarım sistemine alınmamış

**Nerede:** `select`, tarih, `checkbox` ve `radio` alanları — form, filtre ve rapor şeritleri.

**Sorun:** `select` tarayıcının kendi okuyla; tarih alanları tarayıcının kendi takvim ikonu
ve `gg.aa.yyyy` yer tutucusuyla görünüyor. Özel stillenmiş bileşenlerin yanında **yamalı**
duruyor. Seçim kartlarında native `radio` ile kartın seçili görünümü **aynı bilgiyi iki kez**
anlatıyor.

**Çözüm (kapanış fazında):** Tüm form kontrolleri için **tek görünüm standardı**; renkler
`tokens.css`'ten. Seçim kartında bilgi tek kanaldan verilir.

---

## UID-10 · Yan panelde başlık ile kaydırılan içerik arasında ayrım yok

**Nerede:** Gelişmiş Filtre ve **yan panel (`GV.drawer`) kullanan tüm ekranlar**.

**Sorun:** Kaydırınca ilk satır başlığın altına girip kesiliyor — başlık ile gövde arasında
hiçbir ayrım yok.

**Çözüm (kapanış fazında):** Başlığa alt kenarlık **veya** kaydırma gölgesi; yan panel
bileşeninde **tek yerde**.

**Ek (aynı fazda):**
- Para alanlarında **birim eki yok**.
- **Filtre uygula** butonu seçili filtre sayısını göstermiyor.

---

## ✅ UID-11 + UID-25 + UID-28 · Maskeleme ve çıktı yetkisi — ÇÖZÜLDÜ (2026-08-05, 10. oturum)

Üçü de aynı sınıftı: **yetki kararı ekran başına bırakılmıştı**. Tek sözleşmeyle kapandı.

| Sözleşme | Nerede | Ne yapar |
|---|---|---|
| `kpis[].perm` · `kpis[].mask()` | `GV.list` + `GV.report` | Maskeliyken `.kpi-num.is-masked` + `••••••` basar, `meta` satırını gizler. **`calc` hiç çalışmaz** — hesap yapılmadığı için sızıntı da olmaz |
| `columns[].perm` · `columns[].mask(row)` | `GV.list` | Hücre `.cell-mask` basar **ve ÇIKTIYA girmez**. `mask` **satırı alır**: gizlilik seviyesi kayıttan kayda değişir |
| `disaAktar` kapısı | `GV.list` `renderHead` + `renderBulk` + `exportRows` | Yetkisiz rolde çıktı şeridi ve toplu "Dışa aktar" **hiç basılmaz**; `exportRows` ikinci savunma hattı olarak reddeder |

**Silinen ekran kodu:** 28 KPI'da `canFinans ? toplam : 0` (17 ekran) · 9 ekranda elle
yazılmış `export:!!GV.perm.can('disaAktar')` kapısı · 5 ekranda artık kullanılmayan
`canExp` değişkeni · dört sınıfta `accent-color` kopyası.

**Ölçüm (çalışma zamanı, rol karşılaştırmalı):**

| Ekran · rol | Önce | Sonra |
|---|---|---|
| `app-proje-milestone` · `qa` | "Bekleyen taksit ₺0" | `••••••` (maskeli KPI 1) |
| `app-musteri` · `destek` | "₺0" | `••••••` |
| `app-dokuman` · `destek` | gizli belge adları **açık** | 3 hücre maskeli — `app-dokuman-sure` ile aynı ölçüt |
| `app-arac-yakit` · `idari` | tutar maskeli, **birim fiyat açık** (geri hesaplanabiliyordu) | 10 hücre maskeli (5 satır × 2 kolon) |
| `app-arac-sigorta` · `idari` | prim maskeli, kasko bedeli açık | 6 hücre maskeli |
| `app-arac` · `idari` | gider maskeli, aylık kira açık | 4 hücre maskeli |
| Çıktı butonu · `qa`/`destek`/`idari` | basılıyordu | basılmıyor |

---

## UID-11 (özgün kayıt) · Finans yetkisi yokken KPI "₺0" gösteriyor, maskeli göstermiyor

**Nerede:** `GV.list` / `GV.report` KPI şeridi — para KPI'ı olan **tüm** ekranlar
(`app-sozlesme`, `app-proje-milestone`, `app-butce`, `app-fatura`, rapor ekranları…).

**Sorun:** Yerleşik desen `calc:function(a){ return canFinans ? toplam : 0; }`. Finans yetkisi
olmayan rol KPI'da **"₺0"** görüyor — tablo hücreleri doğru şekilde `••••••` maskeleniyor ama
KPI "sıfır para var" diye **yanlış bilgi** veriyor. Ölçüldü: `app-proje-milestone` `qa` rolüyle
20 hücre maskeli ama "Bekleyen taksit tutarı ₺0".

**Kök neden:** KPI'da maskeleme kavramı yok; her ekran yetkisizliği "0 döndür" diye çözüyor,
bu yüzden aynı yanlış üç ekranda birden doğdu.

**Çözüm (kapanış fazında):** `kpis[]`'e `mask:function(){ return !GV.perm.can('finans'); }`
(veya `perm:'finans'`) sözleşmesi eklenecek; maskeliyken `.kpi-num` sayı yerine `••••••` basacak
ve `meta` satırı gizlenecek. Ekranlardaki `canFinans ? x : 0` deseni silinecek. Nokta yaması yok.

---

## UID-12 · `app-gorev.html`'de "Tümü" sekmesi yok — dış bağlantılar kayıt gizliyor

**Nerede:** `app-gorev.html` sekme seti; ona link veren **tüm** ekranlar (sprint, hata, proje,
milestone, sohbet, toplantı).

**Sorun:** Varsayılan sekme `havuz`, ve tüm görevleri gösteren bir sekme yok. Dışarıdan
`app-gorev.html?f_sprint=SPR-2026-020` gibi bir bağlantıyla gelen kullanıcı, filtre doğru
uygulansa bile **sekmenin süzdüğü** alt kümeyi görüyor: sprintin tamamlanmış görevleri
görünmüyor, kanban'ın "Tamamlandı" kolonu boş kalıyor. Bağlantı çalışıyor ama **eksik sonuç**
veriyor — sahte buton değil, sessiz veri kaybı, bu yüzden daha tehlikeli.

**Ek bulgu:** `search.fields` içinde `sprint` yok ve `search.extra` tanımlı değil; bu yüzden
`?q=SPR-2026-020` **0 kayıt** döndürür. Link veren ekranlar `f_sprint` kullanmak zorunda kaldı.

**Çözüm (kapanış fazında):** `app-gorev.html`'e `tumu` sekmesi eklenecek ve dış bağlantıların
hedefi o olacak; ayrıca `search.extra` ile sprint/modül kodları arama metnine katılacak.
Genel kural olarak: **bir liste ekranına dışarıdan filtreli link veriliyorsa, o ekranda
filtreyi kısıtlamayan bir "Tümü" sekmesi bulunmalıdır.**

---

## UID-13 · `GV.list` toplu işlemlerinde `show` / yetki kapısı yok

**Nerede:** `GV.list` `bulk:[...]` — toplu işlem barı olan **tüm** liste ekranları.

**Sorun:** `rowActions[]` `show(row)` sözleşmesine sahip (satıra uymayan aksiyon hiç basılmaz),
ama `bulk[]` maddelerinin karşılığı **yok**. Sonuç: "Müşteri onayını işaretle", "Kapandı işaretle",
"Onayla" gibi yetki isteyen toplu işlemler **her rolde** basılıyor; yetki kontrolü ancak `run`
içinde çalışıp `GV.toast('yetkiniz yok')` diyor. Kullanıcı basana kadar yapamayacağını bilmiyor —
`rowActions` tarafında yasakladığımız "ölü buton" deseni, toplu işlem tarafında hâlâ yaşıyor.
En az üç ekranda aynı desen tekrarlandı (`app-proje-teslim`, `app-proje-test`, `app-proje-hata`).

**Çözüm (kapanış fazında):** `bulk[]`'e `show()` (ve/veya `perm:'onay'|'duzenle'|'sil'`) sözleşmesi
eklenecek; koşulu sağlamayan madde toplu işlem barına **hiç basılmayacak**. Ekranlardaki
`run` içi yetki toastları ikinci savunma hattı olarak kalacak ama birincil kapı bileşende olacak.
`rowActions[].show` ile aynı sözleşme adı kullanılacak — iki farklı isim öğrenilmesin.

---

## UID-14 · Detay ekranı sekme tabloları ≤760px'de kayboluyor

**Nerede:** `.gv-tablewrap` — `ui.css`'te **≤760px'de `display:none`**. Detay ekranlarının sekme
içi tabloları (`app-gorev-detay`, `app-musteri-detay` 15 sekme, `app-proje-detay` 22 sekme,
`app-lead-detay` 9 sekme) bu sarmalayıcıyı kullanıyor.

**Sorun:** Liste ekranlarında bu kural doğru — orada `.gv-cardlist` mobil ikizi var. Ama **detay
ekranlarında ikiz yok**; sekme mobilde tamamen boş kalıyor. `app-gorev-detay.html` bunu hiç
üretmiyor, yani mevcut kalıp ekran zaten kusurlu ve yeni detay ekranları kalıbı devraldı.
`app-musteri-detay` / `app-proje-detay` / `app-lead-detay` geçici olarak belgeli
`.gv-tablewrap.is-mobilescroll` istisnasını kullandı (tablo kendi içinde yatay kayıyor).

**Kök neden:** "Mobilde tablo gizlenir, yerine kart listesi gelir" kuralı **liste bileşenine**
göre yazılmış; detay ekranı bağlamında karşılığı olmadan uygulanıyor.

**Çözüm (kapanış fazında):** Detay sekmesi tabloları için ortak bir sarmalayıcı kararı verilecek —
ya `.gv-tablewrap` mobilde gizlemek yerine **varsayılan olarak yatay kaydırsın** (gizleme yalnız
`GV.list`'in ürettiği tabloya özgü bir sınıfla yapılsın), ya da detay sekmeleri için
`GV.list`'in mobil kart üreticisi yeniden kullanılabilir hale getirilsin. `is-mobilescroll`
istisnasını elle geçen ekranlar sonrasında sadeleştirilecek. **Nokta yaması yok.**

---

## UID-15 · ON ÜÇ ekran shell iskeletini elle kopyalıyor

> ### ⚠️ SAYI DÜZELTMESİ (9. oturum, F dokümanı üretilirken ölçüldü)
> Bu madde beş oturum boyunca **"dört detay ekranı"** diyordu. `grep -l 'class="gv-app"'`
> ile sayıldı: **13 ekran**, ve yarısı detay ekranı bile değil — **liste ekranları da**
> aynı kalıbı taşıyor:
>
> **Detay (6):** `app-gorev-detay` · `app-musteri-detay` · `app-lead-detay` ·
> `app-proje-detay` · `app-personel-detay` · `app-teklif.html`\*
> **Liste ve panel (7):** `app-gorev` · `app-lead` · `app-musteri` · `app-personel` ·
> `app-pipeline` · `app-proje` · `app-panel`
>
> \* `app-teklif.html` liste ekranıdır, buraya sınıflandırma kolaylığı için yazıldı.
>
> **Etkisi büyüdü:** `GV.pageHead` bu **13 ekranın hiçbirinde çalışmıyor** (`buildSkeleton()`
> `.gv-app` görünce erken dönüyor, `#gvPageHead` hiç doğmuyor). Yani sayfa başlığı,
> breadcrumb beslemesi ve `[data-listcount]` sayacı 13 ekranda **elle** kurulmuş durumda.
> Çözüm turu dört değil **on üç** ekranı kapsar; iş yükü tahmini üçe katlanmalı.

**Nerede (özgün kayıt):** `app-gorev-detay.html` · `app-musteri-detay.html` · `app-lead-detay.html` ·
`app-proje-detay.html` — dördü de `.gv-app` > rail/menü/divider/overlay/top/main markup'ını
kendi `<body>`'sine yazıyor.

**Sorun:** `buildSkeleton()` `.gv-app` gördüğünde erken dönüyor (bilinçli kaçış). Sonuç iki katlı:
1. **20 satır shell markup'ı dört yerde tekrarlanıyor** — CLAUDE.md "benzer ekranlar için tekrarlı
   kod yazılmaz" kuralının ihlali.
2. Kopyalanan `.gv-divider` **UID-01'in eklediği `aria-controls="gvMenu"` niteliğini taşımıyor**
   (ölçüldü: dördünde de 0). `aria-expanded` çalışma anında yazıldığı için kurtuluyor, `aria-controls`
   kurtulmuyor. Yani ortak katmanda kapatılan bir a11y açığı, kopyalanmış markup üzerinden yaşıyor.
3. `#gvPageHead` doğmadığı için bu ekranlarda **`GV.pageHead` sessizce hiçbir şey yapmıyor** —
   çağıran bir ekran hata almadan başlıksız kalır.

**Kök neden:** Detay ekranı kalıbı, `buildSkeleton()` yazılmadan önce kurulmuştu; sözlük de
"detay ekranı iskeletini kendi yazar" diye kayıtlıydı. 5. oturumda `app-teklif-detay.html`
iskelet yolunun detay ekranında da sorunsuz çalıştığını gösterdi; `app-arac-detay.html` bu yola
çevrildi ve `components.md` §3 düzeltildi.

**Çözüm (kapanış fazında):** Dört eski detay ekranından elle yazılmış `.gv-app` bloğu silinecek,
yerine `<div id="rec"></div>` kalacak; sayfa başlığı elle markup yerine `GV.pageHead(...)` ile
kurulacak. Sonra dördü 1440/768/390'da yeniden doğrulanacak. **Nokta yaması yok** — dördü tek turda.

---

## UID-16 · Detay ekranlarının aktivite sekmesi her kayıtta boş

**Nerede:** `DB.activities` — `app-teklif-detay` · `app-personel-detay` · `app-arac-detay`
(ve muhtemelen üretilecek 20 detay ekranının çoğu).

**Sorun:** `DB.activities[].kayit` yalnız `GRV-*`, `LEAD-*`, `MUS-*`, `PRJ-*` kodları taşıyor.
`TKL-*` · `EMP-*` · `ARC-*` için **hiç kayıt yok**, dolayısıyla üç yeni detay ekranının da
"Aktivite geçmişi" sekmesi **her kayıtta** boş durum basıyor. Ekran doğru davranıyor —
veri kapsamı eksik. PROMPT.md "aktivite ve değişiklik geçmişi" kabul kriteri (§28) bu hâliyle
karşılanmıyor.

**Ek ölçüm (7. oturum, form ekranları):** `REF-*` ve `YTK-*` önekleri için de `DB.activities`'te
**tek satır yok** — `app-referans-form`, `app-referans-detay` ve `app-musteri-yetkili-form`
düzenleme modunda her kayıtta boş durum basıyor. Kod öneki listesine bu ikisi de girer.

**Not:** Bu bir arayüz borcu değil **veri borcu**; buraya yazıldı çünkü etkisi arayüzde görünüyor
ve çözümü tek yerde (veri katmanı). Detay ekranı üretimi bittiğinde hangi kod öneklerinin
aktivite beklediği kesinleşecek, tek turda yazılacak — parça parça eklemek canonical taramayı
yanıltır.

**Çözüm:** `assets/data/work.js` → `DB.activities`'e teklif, personel, araç, talep, sözleşme,
fatura ve destek eksenlerinde gerçek hareket kaydı eklenecek; `canon.js`'e "her detay ekranı
kod öneki için en az bir aktivite" ekseni girecek.

---

## UID-17 · Her detay ekranı kendi `dl(pairs)` yardımcısını yeniden yazıyor

**Nerede:** `app-gorev-detay` · `app-musteri-detay` · `app-lead-detay` · `app-proje-detay` ·
`app-teklif-detay` · `app-personel-detay` · `app-arac-detay` · `app-satinalma-detay` ·
`app-sozlesme-detay` — dokuzu da `.gv-dl` markup'ını üreten yerel bir `dl()` fonksiyonu taşıyor.

**Sorun:** Aynı bileşen dokuz kez yazılınca **kararlar ayrışıyor**. Ölçülen ayrışma: `dt`
escape'i. `app-teklif-detay` escape ediyordu ve para ekseni işaretini ham metin olarak bastı
(ders **L-14**, düzeltildi); diğerleri etmiyordu. Boş değer sentineli (`—` / `.is-empty`),
iki sütunlu satır ve uzun metin kırpma davranışı da ekrandan ekrana farklı.

**Kök neden:** `.gv-dl` yalnız **CSS** olarak var; `components.md` §3 markup'ın elle kurulacağını
söylüyor. `GV.badge`, `GV.activity`, `GV.chain` gibi bir JS karşılığı yok — o yüzden her ekran
kendi üreticisini yazıyor. `GV.detail()`/`GV.gantt()`'ın hayalet çıkması da aynı boşluğun belirtisi.

**Çözüm (kapanış fazında):** `ui.js`'e **`GV.dl(pairs, opts)`** eklenecek: `dt` sayfada yazılı
işaretleme olarak geçer (escape edilmez), `dd` değer olarak escape'li basılır, boş değer tek
yerde `.is-empty` + `—` alır. Dokuz ekranın yerel `dl()` fonksiyonu silinip buna çevrilecek,
`components.md` §3'e işlenecek, `tasks/qa/esc.js` regresyon testi olarak kalacak.
**Nokta yaması yok** — dokuzu tek turda.

---

## ✅ VB-05 · Destek talebi → görev / hata / değişiklik bağ alanı — ÇÖZÜLDÜ (2026-08-04)

**Nerede:** `DB.tasks` · `DB.bugs` · `DB.changeRequests` — hiçbirinde `talep` (DST-*) alanı yok.

**Sorun:** PROMPT.md §18 "destek → görev / hata / geliştirme / değişiklik / ek teklif dönüşümü"
istiyor ve plan.md Wave 9'da madde olarak duruyor. `app-destek-detay.html` dönüşümü **üretebiliyor**
(görev yazıyor) ama **geri okuyamıyor**: 7 talebin hiçbirinde dönüşüm bulunamıyor, "Dönüşümler"
sekmesi her kayıtta boş. Ekran bunu `etiketler:['Destek talebi','DST-…']` ile idare ediyor —
bağ alanı değil, metin eşleşmesi.

**Ölçülen kanıt:** `DST-2026-118` ile `HTA-2026-074` aynı projede, aynı olayı anlatıyor
("Tarih seçici mobilde açılmıyor") — açıkça aynı kayıt, ama veride bağ yok. Uydurulmadı (L-08:
ekran değil veri düzeltilir, ama bağ **yazılı** olmalı — L-13).

**Ek bulgu (5. oturum) — hata → görev bağı da yok.** `DB.tasks[].hata` hiçbir kayıtta yazılı
değil. `GRV-2026-101` ("Tahlil sonuç ekranında PDF indirme hatası düzeltilecek", `tur:'Hata'`)
ile `HTA-2026-071` ("iOS PDF indirme sessizce başarısız", şiddet **Kritik**) açıkça aynı olay,
ama bağ yazılı olmadığı için **kurulmadı** (L-13: çıkarım bağ değildir). Bağ yazıldığında
components.md §9'un şiddet→etki eşlemesi de ihlal çıkacak: görevde `etki:'Yüksek'`, kural
`Çok yüksek` istiyor. **İkisi aynı turda düzeltilmeli** — önce bağ yazılır, sonra etki hizalanır,
sonra `canon.js`'e "hata bağı olan görevin etkisi şiddet eşlemesine uyar" ekseni eklenir.
`app-proje-hata-detay.html` bu ihlali gizlemiyor, ekranda raporluyor.

**Çözüm:** `DB.tasks[].talep` · `DB.tasks[].hata` · `DB.bugs[].talep` · `DB.changeRequests[].talep` alanları açılacak,
mevcut örtük eşleşmeler (en az bir tane ölçüldü) yazılacak, `canon.js`'e "talep bağı olan kayıt
gerçekten var olan bir talebi gösterir" ekseni eklenecek. UID-16 (aktivite kapsamı) ile aynı turda.

---

## VB-06 · Fatura ve tahsilat mutasyonları birbirini kapatmıyor

**Nerede:** `app-fatura.html` · `app-fatura-detay.html` (Ödendi işaretle) ·
`app-tahsilat.html` · `app-tahsilat-detay.html` (Tahsil edildi işaretle).

**Sorun:** Dört ekranda da mutasyon **tek koleksiyona** dokunuyor. Faturayı "Ödendi"
işaretlemek bağlı `DB.payments` kaydını kapatmıyor; tahsilatı kapatmak da faturayı
kapatmıyor. Sonuç: kullanıcı faturayı ödendi yaptıktan sonra tahsilat sekmesi hâlâ
açık alacak gösteriyor — **ekran kendi içinde çelişiyor**.

**Kök neden:** İki koleksiyonun zinciri veride kurulu (`payment.fatura`) ama mutasyon
tarafında karşılığı yok; her ekran kendi kaydını güncelliyor. Yeni detay ekranları
bunu liste ekranlarındaki mevcut desene sadık kalarak devraldı.

**Çözüm (kapanış fazında):** Fatura ↔ tahsilat kapanışı **tek yerde** tanımlanacak
(örn. `GV.fin.settleInvoice(kod)` / `settlePayment(kod)`), dört ekran da onu çağıracak;
`DB.customers[].bekleyenTahsilat` da aynı yordamda yeniden türetilecek (BRÜT eksende,
12 müşteride doğrulanmış bağ). `canon.js`'e "fatura Ödendi ise bağlı tahsilat da Ödendi"
ekseni eklenecek. **Nokta yaması yok** — dördü tek turda.

---

## ✅ VB-07 · Sipariş → demirbaş aktarım bağı — ÇÖZÜLDÜ (2026-08-04)

**Nerede:** `DB.assets` — sipariş bağı alanı (`siparis`) hiçbir kayıtta yok, yalnız
`tedarikci` var.

**Sorun:** PROMPT.md §17 "demirbaşa / araca otomatik aktarım" istiyor ve plan.md Wave 8'de
madde olarak duruyor. `app-siparis-detay.html`'in "Demirbaşa aktarım" sekmesi bu yüzden
üç siparişin üçünde de boş; ekran dürüst davranıp yalnız **tedarikçi eşleşmesini**
gösteriyor ve "bu sipariş bağı değildir" diye etiketliyor. Aynı boşluk `app-demirbas-detay`
"Satın alma" sekmesinde de görünüyor.

**Neden şimdi kapatılmadı:** Bağı yazmak yeni demirbaş kayıtları da gerektiriyor
(SIP-2026-008 ergonomik sandalyenin demirbaş karşılığı veride yok) — kapsam genişletmesi
olurdu ve yarım bağ canonical taramayı yanıltır (L-13).

**Çözüm:** `DB.assets[].siparis` alanı açılacak, mevcut üç siparişin demirbaş karşılıkları
yazılacak (gerekiyorsa kayıt eklenerek), `canon.js`'e "sipariş bağı olan demirbaş gerçekten
var olan bir siparişi gösterir + bir sipariş bir demirbaş grubuna bağlanır" ekseni girecek.
UID-16 (aktivite kapsamı) ve VB-05 (destek dönüşümü) ile aynı turda.

---

## UID-18 · `.cell-wrap` çok kolonlu tabloyu 1440px'de yatay kaydırmaya düşürüyor

**Nerede:** `ui.css` → `.cell-wrap` `min-width` dayatıyor. Etkilenen: çok kolonlu tablo
kuran **her** detay ekranı; ölçülen örnek `app-proje-teslim-detay.html` taksit–fatura
zinciri tablosu.

**Sorun:** İki metin kolonuna `.cell-wrap` verildiğinde tek başlarına ~416 px genişlik
alıyorlar; net/KDV/brüt kolonları taşıp tablo 1440 px'te bile yatay kaydırmaya düşüyor.
Ekran bunu `.cell-wrap`'i **hiç kullanmayarak** ve başlıklara `th-narrow` vererek çözdü —
yani ortak sınıf, kullanılması gereken yerde kullanılamıyor.

**Kök neden:** `.cell-wrap` tek başına bir hücrenin okunabilirliği için yazılmış; kolon
sayısıyla ölçeklenen bir genişlik bütçesi yok.

**Çözüm (kapanış fazında):** `.cell-wrap`'in `min-width`'i kolon sayısına duyarlı hâle
getirilecek (ya da `.cell-wrap.is-tight` gibi dar bir varyant tanımlanıp geniş tablolarda
o kullanılacak). Kararın ardından `.cell-wrap` kullanan tüm tablolar 1440/768/390'da
yeniden ölçülecek. **Nokta yaması yok.**

---

## ✅ VB-08 · Kalite zincirinin yazılı bağları — ÇÖZÜLDÜ (2026-08-04)

**Nerede:** `DB.tests` ↔ `DB.bugs` ↔ `DB.deliveries` ↔ `DB.projectModules` ↔ `DB.sprints`.

**Sorun:** Üç detay ekranı (`app-proje-test-detay` · `app-proje-hata-detay` ·
`app-proje-teslim-detay`) aynı boşluğu bağımsız olarak raporladı:
- `DB.tests` **modül ve sprint alanı taşımıyor** → kapsam yalnız proje ekseninde.
- `DB.tests[].hata` ve `DB.bugs[].test` **yok** → hangi koşumun hangi hatayı açtığı yazılı değil.
- `DB.bugs[].sprint` **yok** → sprint bağlı görevden veya tarihten türetiliyor.
- `DB.deliveries` **kapsam/modül bağı taşımıyor** → teslimin neyi kapsadığı okunamıyor.
- `DB.tests` **senaryo bazlı döküm tutmuyor** → hangi senaryonun düştüğü görünmüyor.

Üç ekran da bağ **uydurmadı** (L-13): aday listeleri "bağ değildir" diye etiketli ve
"güçlü aday" ölçütü (`basarisiz > 0` + tarih ±3 gün) üç ekranda **birebir aynı** tutuldu ki
iki ekran aynı çifte çelişen sinyal vermesin.

**Sonuç:** PROMPT.md §11'in kalite zinciri (test → hata → düzeltme → teslim) arayüzde
kurulu ama **veri tarafında kopuk**; ekranlar zinciri tarih yakınlığıyla tahmin ediyor.

**Çözüm:** `DB.tests[].modul` · `DB.tests[].sprint` · `DB.bugs[].test` · `DB.bugs[].sprint` ·
`DB.deliveries[].moduller` alanları açılacak, mevcut kayıtlara yazılacak, `canon.js`'e
"bağ verilen kod gerçekten var + bir hata en fazla bir koşuma bağlanır" ekseni eklenecek.
VB-05 (destek dönüşümü) ve VB-07 (sipariş → demirbaş) ile **aynı turda** — üçü de aynı
sınıf: modüller arası bağın veride yazılı olmaması.

---

## UID-19 · Tablo toplam satırı için ortak sınıf yok

**Nerede:** `ui.css` `.gtable` ailesi. Ölçülen örnek: `app-proje-degisiklik-detay.html`
sözleşme hesabı tablosunun iki toplam satırı.

**Sorun:** Ara toplam / genel toplam satırını gövde satırlarından ayıran bir sınıf yok
(`tr.is-total` ya da `tfoot` stili). Ekran uydurmadı — satırları sınıfsız bırakıp yalnız
`<b>` ile vurguladı. Aynı boşluk `app-teklif-detay.html`'de de çıkmıştı; orada kalem
toplamları `<tfoot>` yerine tablo altında `.gv-summary` olarak basıldı.

**Kök neden:** `.gtable` liste bileşeni için yazıldı; liste tablosunun toplam satırı yok,
detay ekranının hesap tablosunun var.

**Çözüm (kapanış fazında):** `.gtable tfoot` **ve** `tr.is-total` için tek bir kural —
üst kenarlık, ağırlık ve zemin token'lardan. Sonra `.gv-summary` ile idare eden yerler
(`app-teklif-detay` kalem toplamı) buna çevrilecek. **Nokta yaması yok.**

---

## Not — `DB.impacts` tonu sözlüğe EKLENMEZ

Değişiklik talebi ajanı "`Çok yüksek/Yüksek/Orta/Düşük` ton sözlüğünde yok, eklenmeli"
diye bildirdi. **Eklenmeyecek** — components.md §5'teki eksen çakışması kaydı bunu
açıkça yasaklıyor: aynı kelimeler öncelik, etki ve müşteri riski eksenlerinde geçiyor,
sözlüğe konursa riski yüksek müşteri ile önceliği yüksek görev aynı rengi alır.
Bu değerlerde `GV.badge(v,'is-danger')` ile **açık ton geçmek doğru kullanımdır**.
Kayıt buraya, aynı öneri tekrar gelirse hızlı reddedilebilsin diye düşüldü.

---

## ÇÖZÜM KAYDI · VB-05 / VB-07 / VB-08 — 6. oturum, tek turda kapandı

Üçü de aynı sınıftı: **modüller arası bağ veride yazılı değildi, ekranlar tahminle kuruyordu.**
Ders **L-13** gereği bağ alanları veriye açık alan olarak yazıldı; çözüm ekranda değil veri
katmanında yapıldı ve `canon.js`'e **eksen 15** olarak alındı (445 → **521 kontrol**, temiz).

### Açılan bağ alanları
| Alan | Yön | Not |
|---|---|---|
| `DB.tasks[].destek` · `DB.bugs[].destek` · `DB.changeRequests[].destek` | doğan kayıt → talep | Ad `talep` **olamazdı**: `changeRequests.talep` zaten "talebi açan taraf" ekseniydi (assumptions V-28) |
| `DB.bugs[].test` · `DB.bugs[].sprint` | hata → koşum / sprint | `sprint` = hatanın **ele alındığı** sprint (V-32) |
| `DB.tests[].moduller` · `DB.tests[].sprint` | koşum → kapsam | `moduller` **dizidir**, tekil `modul` değil (V-31) |
| `DB.deliveries[].moduller` · `DB.deliveries[].test` | teslim → kapsam / kabul koşumu | Zincir artık test → hata → teslim → taksit olarak uçtan uca okunuyor |
| `DB.assets[].siparis` | demirbaş → sipariş | Tek yön; siparişte ayna alan yok. `alisFiyati` **NET** ekseni yazıldı |

### Bilinçli olarak AÇILMAYAN alan
`DB.tasks[].hata` — ters yön (`DB.bugs[].gorev`) zaten yazılıydı. İki yönlü bağ ayrışır;
`canon.js` bu alanın **doğmadığını** ayrıca kontrol eder (assumptions V-29).

### Yan bulgular
- **Şiddet→etki ihlali düzeltildi:** bağ yazılı olunca ölçülebildi — `HTA-2026-071` şiddet
  `Kritik` iken `GRV-2026-101` etkisi `Yüksek`ti, `Çok yüksek` oldu (components.md §9 kuralı).
- **Üç yeni demirbaş kaydı:** `SIP-2026-008` teslim alınmıştı ama envanter karşılığı yoktu
  (`DMB-2026-013/014/015`, Σ net 28.500 = siparişin neti — assumptions V-33).
- **Bağsız bırakılan 9 küme uydurulmadı**, gerekçeleri assumptions **V-30**'da tablo hâlinde.

### Güncellenen ekranlar
`app-destek-detay` (dönüşüm etiket eşleşmesi → `destek` alanı; üretilen görev de alanı yazar) ·
`app-proje-hata-detay` (aday listeleri → yazılı kaynak koşum + kaynak talep) ·
`app-proje-test-detay` (aday hata / tarihe en yakın teslim → yazılı bağ; kapsam modülleri) ·
`app-proje-teslim-detay` (proje modül listesi → teslimin yazılı kapsamı + kabul koşumu) ·
`app-siparis-detay` · `app-demirbas-detay` (tedarikçi eşleşmesi → yazılı sipariş bağı).

---

## VB-09 · `MOD-009` adı yasak inşaat terimi taşıyor

**Nerede:** `assets/data/work.js` → `DB.projectModules`, `MOD-009` = **"Saha ekip yönetimi"**.

**Sorun:** CLAUDE.md ve PROMPT.md §1 "saha" terimini açıkça yasaklıyor. Terim `app-proje-detay`,
`app-proje-test-detay`, `app-proje-teslim-detay` ve proje raporlarında **modül adı olarak
ekranda görünüyor**.

**Neden şimdi düzeltilmedi:** VB-04 (`hakedis` → `komisyon` alan adı rename'i) ile **aynı sınıf**
ve aynı turda yapılmalı; ikisi de canonical taramaya ve ekran metinlerine dokunuyor, parça
parça yapılırsa tarama iki kez yanılır.

**Çözüm (VB-04 ile aynı turda):** Modül adı yazılım terminolojisine çevrilecek
("Mobil ekip yönetimi" / "Ekip operasyon yönetimi"); `DB.projectModules` dışında bu adı **metin
olarak** taşıyan yer var mı diye tam metin taraması yapılacak.

---

## VB-10 · Onay akışı yapılandırması hiçbir veri dosyasında yok

**Nerede:** Satın alma onay eşikleri (6 makam, tutar ve kategoriye göre) `app-ayar-onay.html`
içinde **sayfa-yerel sabit** + `localStorage('gv.onayakis')` olarak yaşıyor. `assets/data/*.js`
içinde karşılığı yok.

**Sorun:** `app-satinalma-form.html` girilen tutara göre onay zinciri önizlemesi basabilmek için
eşik tablosunu **kopyalamak zorunda kaldı**. Aynı gerçek iki yerde yaşıyor; biri değişince
diğeri sessizce yanlış zincir gösterir. İzin, zaman kaydı, teklif ve değişiklik talebi akışları
için de aynı boşluk var — bu dört akış da yalnız ayar ekranında tanımlı.

**Ölçüm:** Form ekranının kopyaladığı tabloyla hesaplanan adım sayısı, 6 aktif talebin 6'sında
`onayToplam` ile ve makam sırası `DB.purchaseApprovals` ile birebir tutuyor — **şu an** doğru.
Borç, doğruluğun kopyaya bağlı olması.

**Çözüm (kapanış fazında):** `DB.approvalFlows` koleksiyonu açılacak (akış türü × eşik × makam
sırası); `app-ayar-onay.html` ve form ekranları aynı kaynaktan okuyacak. `canon.js`'e
"bir talebin `onayToplam`'ı akış tablosundan hesaplananla aynıdır" ekseni girecek.

---

## VB-11 · `butceKodu` bir koleksiyona bağlı değil

**Nerede:** `DB.purchases[].butceKodu` yalnız serbest string. `DB.budgets` diye koleksiyon yok;
`app-butce.html` de proje bütçesini `DB.projects`'ten türetiyor, bütçe kodu ekseninden değil.

**Sorun:** `app-satinalma-form.html` select seçeneklerini veride **geçen** dört koddan türetmek
zorunda kaldı (`BTC-DONANIM-2026` · `BTC-IDARI-2026` · `BTC-PRJ-002` · `BTC-YAZILIM-2026`).
Kod uydurulmadı ama sonuç şu: **yeni bir bütçe kodu forma girilemiyor** ve bütçe kalemi bazında
harcama toplamı hiçbir ekranda okunamıyor.

**Çözüm (kapanış fazında):** `DB.budgets` açılacak (kod · ad · yıl · limit · sahip departman);
satın alma talebi ve `app-butce.html` aynı koleksiyondan beslenecek.

---

## UID-20 · Form ekranlarına düzenleme modundan bağlantı yok

**Nerede:** `app-lead.html` · `app-musteri.html` · `app-satinalma.html` ve detay ekranları.

**Sorun:** Liste ekranlarının "Yeni kayıt" butonu forma gidiyor, ama **düzenleme moduna**
(`app-x-form.html?id=KOD`) hiçbir yerden bağlantı yok. Form iki modu da destekliyor; ikinci mod
kullanıcı için erişilemez durumda. Kalan 33 form ekranı üretildikçe aynı boşluk her ekranda
tekrarlanacak.

**Kök neden:** Bağlantıyı kaynak liste/detay ekranı kurar, formu yazan ajan değil (ajan tek
dosyaya dokunur). Orkestratörün adımı olarak `handoff.md` bölüm 3'e yazılmalı.

**Çözüm:** `GV.list` `rowActions`'a "Düzenle" (`perm:'duzenle'`, `show(row)` ile arşivli/kilitli
kayıtta gizli) ve detay ekranlarının `GV.pageHead` aksiyonlarına "Düzenle" **tek turda**, tüm
form ekranları bittikten sonra eklenecek — parça parça eklemek `links.js` kuyruğunu yanıltır.

---

## VB-12 · Yetkili bağı kodla değil ADLA kuruluyor

**Nerede:** `DB.tickets[].acan` · `DB.interactions[].kontak` — ikisi de düz metin kişi adı tutuyor.
`app-destek-detay.html` bağı `yetkili.ad === ticket.acan` metin eşleşmesiyle kuruyor.

**Sorun:** components.md **§9d**'nin tek kuralına aykırı — bağ veride **kod** olarak yazılmalı.
Ad değişince bağ sessizce kopar. `app-musteri-yetkili-form.html` bunu idare etmek zorunda kaldı:
(a) ad benzersizliğini zorunlu kıldı, (b) ad değişince aynı firmadaki eşleşen satırları birlikte
güncelleyip aktiviteye ayrı satır yazdı. Ölçüldü: `Sibel Yurtsever` → `Sibel Yurtsever Kaya`
değişikliğinde `DST-2026-120` birlikte güncellendi. Firma değişiminde kaskad **bilinçli olarak
çalışmıyor** (eski kayıtlar eski firmaya ait).

**Çözüm (kapanış fazında):** `DB.tickets[].yetkili` ve `DB.interactions[].kontakKod` alanları
`YTK-*` koduyla açılacak, mevcut metin eşleşmeleri koda çevrilecek, `canon.js`'e "yetkili bağı
gerçekten var olan bir `DB.contacts` kaydını gösterir" ekseni girecek. Ekranlardaki ad kaskadı
o zaman silinecek. **VB-13 ile aynı turda** — ikisi de kişi kimliği ekseni.

---

## VB-13 · `DB.referrers` ile `DB.contacts` aynı kişiyi iki kez tutuyor

**Nerede:** `assets/data/crm.js`.

**Sorun:** `REF-001 Hakan Demirtaş` ≡ `YTK-001` (aynı telefon `+90 533 100 00 01`, aynı e-posta,
aynı pozisyon) · `REF-004 Serdar Kılıç` ≡ `YTK-014` (aynı telefon `…00 04`, aynı e-posta).
Telefon havuzu bile ortak (`+90 533 100 00 XX` serisi iki koleksiyona bölünmüş). Aralarında
bağ alanı yok; birinde ad ya da unvan değişirse diğeri sessizce eskir. PROMPT.md §28'in
"aynı bilgi tekrar girilmiyor" kabul kriteri bu hâliyle karşılanmıyor.

**Çözüm (kapanış fazında):** `DB.referrers[].kontak` alanı açılacak (yönlendiren aynı zamanda bir
müşteri yetkilisiyse `YTK-*` kodunu taşır); iki kayıt arasındaki ortak alanların hangisinin
kaynak olduğu `assumptions.md`'ye yazılacak. `canon.js`'e "bağlı yönlendiren ile yetkilinin
iletişim bilgileri birebir aynıdır" ekseni girecek. **VB-12 ile aynı turda.**

---

## VB-14 · İletişim kanalı ekseni üç yerde farklı, sözlüğü yok

**Nerede:** `DB.interactions[].tur` — karşılık gelen bir `DB.*` sözlüğü **yok**.

**Sorun:** Aynı eksen üç yerde farklı tanımlıydı: veride yalnız `Toplantı · Telefon · E-posta`
geçiyor · `app-musteri-iletisim.html` süzgeci `Ziyaret`i de sayıyor · `app-musteri-detay.html`
iletişim modalı ayrıca **`Mesaj`** sunuyordu — hiçbir kayıtta ve hiçbir sözlükte geçmeyen
beşinci değer. Sözlük olmadığı için her ekran kendi listesini yazıyor.

**Şimdi yapılan (nokta yaması değil, uydurulmuş değerin geri alınması):** modaldaki `Mesaj`
kaldırıldı, kanal listesi liste ekranının dört değerine hizalandı.

**Çözüm (kapanış fazında):** `DB.interactionTypes` sözlüğü açılacak (`refTypes` ile aynı desen);
liste süzgeci, iletişim formu ve müşteri detayı modalı aynı sözlükten beslenecek;
`canon.js`'e "`DB.interactions[].tur` sözlükte tanımlıdır" ekseni girecek — 6. oturumdaki
`kaynak` ↔ `refTypes` (eksen 17) ile birebir aynı sınıf.

---

## UID-21 · `app-referans.html` "yönlendirdiği adaylar" bağlantısı yanlış eksende süzüyor

**Nerede:** `app-referans.html` satır aksiyonu → `app-lead.html?t=tumu&f_kaynak=<tur>`.

**Sorun:** Bağlantı adayları yönlendirenin **türüne** göre süzüyor, kişisine göre değil.
REF-001 satırından gidildiğinde "Mevcut müşteri" kaynaklı **tüm** adaylar geliyor; o kişinin
getirdikleri değil. Gerçek bağ `DB.leads[].referans` alanında **yazılı**, ama ne `app-lead.html`
ne `app-musteri.html` süzgeçlerinde `referans` anahtarı var — ekran bu yüzden türe düşmüş.
Bağlantı çalışıyor ama **yanlış küme** döndürüyor: UID-12 ile aynı sınıf (sahte buton değil,
sessiz yanlış sonuç, bu yüzden daha tehlikeli).

**Çözüm (kapanış fazında, UID-12 ile aynı turda):** `app-lead.html` ve `app-musteri.html`
süzgeçlerine `referans` anahtarı eklenecek (seçenekler `DB.referrers`), bağlantılar
`?t=tumu&f_referans=REF-00X` hedefine çevrilecek. `app-referans-detay.html`'in
"Yönlendirdiği adaylar" sekmesi zaten yazılı bağı kullanıyor — ölçüt oradan alınacak.

---

## VB-15 · `DB.documents`'ta yönlendiren / yetkili bağ alanı yok

**Nerede:** `DB.documents` (misc.js).

**Sorun:** PROMPT.md §9 yönlendiren kartında "Belgeler" alanı istiyor (sözleşme, kimlik,
banka bilgisi). `DB.documents` yalnız müşteri ve sözleşme eksenlerinde bağ taşıyor;
`referans` alanı yok. `app-referans-form.html` bu yüzden belge alanını **yalnız görsel**
bırakmak zorunda kaldı ve kaydederken `belgeler` anahtarını siliyor — uydurma alan yazmıyor.
Aynı boşluk `GV.form`'un `type:'file'` alanının kalıcılaştırılamamasıyla birleşiyor (UID-04).

**Çözüm (kapanış fazında):** `DB.documents[].referans` (ve gerekiyorsa `.yetkili`) bağ alanı
açılacak; `canon.js`'e "belge bağı gerçekten var olan bir kaydı gösterir" ekseni girecek.
UID-04 (`GV.upload` `onFile`) ile aynı turda — biri veri, biri bileşen tarafı.

---

## VB-16 · `DB.analyses[].maliyet` alan adı ekseni yanlış anlatıyor

**Nerede:** `assets/data/crm.js` → `DB.analyses`.

**Sorun:** Ad "maliyet" diyor, **ölçülen eksen satış fiyatı**: teklife dönmüş üç analizin
üçünde de `maliyet` = `DB.quotes[].araToplam` (612.000 · 428.000 · 298.000 — indirim öncesi
NET). İndirim sonrası netle 2/3, brütle 0/3 tutuyor. Yani alan iç maliyet değil, teklifin
çıkış fiyatı. Bir ekran bunu "maliyet" sanıp kârlılık hesaplarsa **sonuç sessizce yanlış** olur.

**Şimdi yapılan:** Eksen `crm.js` başlığına ve components.md §9b'ye **yazıldı**; ekranlar
etikette "(KDV hariç — teklif ara toplamı ekseni)" diyor.

**Çözüm (VB-04 ile aynı turda):** Alan `tahminiBedel` olarak yeniden adlandırılacak —
`hakedis` rename'iyle aynı sınıf, aynı turda, `canon.js` ekseniyle birlikte.

---

## VB-17 · Süre birimi ve iş gücü birimi sözlüksüz

**Nerede:** `DB.analyses[].sureBirim` · `DB.analyses[].isgucu`.

**Sorun:** `sureBirim` için sözlük yok; dört kaydın dördü de `'hafta'` olduğu için
`app-onanaliz-form.html` **tek seçenekli** bir select basmak zorunda kaldı — kullanıcı
gerçek bir seçim yapamıyor. `isgucu` alanının birimi (saat mi adam-gün mü) ne alan adında
ne yorumda yazılıydı; ölçülen değerler (420 · 360 · 260 · 190) saat eksenine uyuyor ve bu
artık `crm.js` başlığında yazılı, ama **sözlük hâlâ yok**.

**Çözüm (kapanış fazında):** `DB.timeUnits = ['saat','gün','hafta','ay']` sözlüğü açılacak;
ön analiz formu, detay ekranı ve raporlar aynı sözlükten beslenecek.

---

## VB-18 · `DB.commissions` şema tekdüzeliği: `arsiv` anahtarı ve `'—'` sentinel'i

**Nerede:** `assets/data/crm.js` → `DB.commissions`.

**Sorun (ölçüldü, 6 kayıt):** (a) `arsiv` anahtarı yalnız `KOM-2025-006`'da var; kalan beşinde
`undefined`. Form kaydettiğinde açık `false` yazıyor, yani düzenlenen kayıtta anahtar doğuyor —
şema kayıttan kayda değişiyor. (b) `KOM-2026-005.onay = '—'` **gerçek bir değer** olarak
kullanılıyor; oysa components.md §9 `DB.deliveries[].musteriOnay` için "`'—'` sentinel'i
kullanılmaz" diyor. Aynı proje içinde iki karşıt konvansiyon.

**Çözüm (kapanış fazında):** `arsiv` altı kaydın altısına da yazılacak; `onay` için
`'—'` yerine `'Onay gerekmiyor'` gibi sözlük değeri seçilecek ve `GV.badge` tonuna alınacak.
`canon.js`'e "her komisyon kaydı aynı anahtar kümesini taşır" ekseni girecek.

---

## ✅ VB-19 · Teklif → sözleşme aktarımı KDV'yi iki kez uyguluyordu — ÇÖZÜLDÜ (2026-08-05)

**Çözüm:** 3 sözleşme teklifin netine çekildi ve zincir uçtan uca yeniden dengelendi
(11 taksit · 9 fatura · 9 tahsilat · 3 proje · 3 müşteri ciro/bekleyen tahsilat).
Eksen `components.md` §9b'ye yazıldı, `canon.js` **eksen 18** her turda doğruluyor
(607 kontrol temiz). Bağımsız çapa `toplamCiro` idi: 7 müşterinin 5'inde
`Σ contract.tutar`'a birebir eşit, `Σ(tutar/1,2)`'ye değil.

### Özgün kayıt

**Nerede:** `DB.contracts[].tutar` ↔ `DB.quotes[].toplam`.

**Ölçüm (teklifi yazılı 3 sözleşmenin 3'ü — sistematik, rastlantı değil):**

| Sözleşme | `contract.tutar` | Teklif | Teklif **neti** | Teklif **brütü** |
|---|---|---|---|---|
| SZL-2026-021 | 600.000 | TKL-2026-012 | 500.000 | **600.000** |
| SZL-2026-020 | 354.000 | TKL-2026-009 | 295.000 | **354.000** |
| SZL-2025-018 | 1.104.000 | TKL-2025-007 | 920.000 | **1.104.000** |

`contract.tutar` üçünde de teklifin **brütüne** eşit. components.md §9b `contract.tutar`'ı
**NET** olarak tanımlıyor ve sözleşme kendi içinde bu tanıma uyuyor (`tutar + kdv = toplam`),
bu yüzden `canon.js` eksen 9/10/11 çelişki görmüyor. Sonuç: teklifin KDV'si sözleşmede
**bir kez daha** uygulanıyor — SZL-2026-021 müşteriye 720.000 olarak görünüyor, oysa teklif
600.000 brütle iletilmişti.

**Neden şimdi düzeltilmedi:** `contract.tutar` zincirin çapası — `DB.milestones[].odeme`
toplamı, `DB.invoices[].tutar`, `DB.payments[].tutar` ve `DB.customers[].toplamCiro` hepsi
ona bağlı (§9b). Tek bir alanı düzeltmek zinciri kırar; üçü de aynı turda taşınmalı.

**Çözüm (kapanış fazında, tek turda):** Üç sözleşmenin `tutar`ı teklifin **netine** çekilecek,
`kdv`/`toplam` yeniden hesaplanacak, bağlı taksit–fatura–tahsilat–ciro zinciri aynı turda
yeniden dengelenecek; `canon.js`'e **"teklifi olan sözleşmenin `tutar`ı teklifin netine eşittir"**
ekseni girecek. Bu eksen bugün var olmadığı için hata beş oturum boyunca görünmedi.

---

## VB-20 · Proje kaydında iki eksen çakışması: `aktif`/`arsiv` ve `faz`/durum

**Nerede:** `assets/data/work.js` → `DB.projects`.

**Sorun (ölçüldü, 8 kayıt):**
1. **`aktif` ve `arsiv` aynı ekseni iki alanla anlatıyor.** `GV.list` `arsiv === true || aktif === false`
   diyerek ikisini de arşiv sayıyor. Yalnız `PRJ-2025-008`'de `arsiv:true` var ve o kayıtta `aktif`
   da `true` — yani iki alan **çelişebilir** ve hangisinin kazandığı yalnız liste bileşeninde yazılı.
   `app-proje-form.html` ikisini de ayrı anahtar olarak açmak zorunda kaldı, yoksa bir kaydı
   arşivden çıkarmak imkânsızdı.
2. **`faz` alanında iki eksen dolaşıyor:** değerler `Faz 1` ve **`Tamamlandı`**. "Tamamlandı" bir
   faz değil, bir **durum**. `durum` alanı zaten var.
3. **Sözlük yok:** proje `durum`, `saglik` ve `faz` kümeleri hiçbir `DB.*` koleksiyonunda tanımlı
   değil; form kümeyi liste ekranının süzgecinden ve mevcut kayıtlardan türetmek zorunda kaldı.
   (`Askıda` durumu süzgeçte ve `GV.badge` tonlarında var ama 0 kayıtta kullanılıyor.)

**Ek bulgu — sözleşmesiz sözleşme bedeli:** `PRJ-2026-007` (336.000) ve `PRJ-2025-008` (960.000)
`sozlesmeTutari` taşıyor ama `DB.contracts` içinde `proje` alanı onları gösteren kayıt **yok**.
Sözleşmesi olan 6 projenin 6'sında bedel sözleşmenin netiyle birebir.

**Çözüm (kapanış fazında):** `arsiv` tek arşiv ekseni olarak kalacak, `aktif` pasif/aktif ekseninde
netleştirilecek ve `GV.list` kuralı components.md'ye yazılacak · `faz` değerleri faz ekseninde
düzeltilecek · `DB.projectStatuses` / `DB.projectPhases` / `DB.healthLevels` sözlükleri açılacak ·
iki sözleşmesiz projeye ya sözleşme yazılacak ya bedelleri kaldırılacak.
`canon.js`'e "sözleşme bedeli olan projenin sözleşmesi vardır ve net eşittir" ekseni girecek.

---

## UID-22 · `app-proje.html` sağlık rozetinde gereksiz yerel ton haritası

**Nerede:** `app-proje.html` — sağlık kolonu.

**Sorun:** Ekran `İyi / Dikkat / Riskli` için kendi `is-ok / is-warn / is-danger` eşlemesini yazıyor;
oysa üç değer de artık `ui.js` TONE sözlüğünde tanımlı. components.md §5'e göre yerel ton haritası
yazmak, sözlükte olmayan değerler için **açık ton geçme** kuralının yanlış uygulanmasıdır.

**Çözüm (kapanış fazında):** Yerel harita silinip `GV.badge(v)` çağrısına düşülecek; aynı deseni
kuran başka ekran var mı diye `is-ok'` içeren yerel eşlemeler taranacak.

---

## VB-21 · Ekran başlığı (eyebrow) ekseni proje modülünde üç farklı değer taşıyor

**Nerede:** `app-proje-hata.html` → `eyebrow:'Projeler'` · `app-proje-hata-detay.html` →
`'Proje Yönetimi'` · `shell.js` `SECTIONS.proje.eyebrow` → **`'Teslimat'`**.

**Sorun:** Aynı bölümün üstbaşlığı üç ekranda üç farklı okunuyor; kullanıcı bölüm değiştirdiğini
sanıyor. Doğru kaynak `shell.js`'teki `SECTIONS` kaydıdır — `GV.pageHead` `eyebrow`'u ekrandan
aldığı için her ekran kendi metnini yazabiliyor.

**Çözüm (kapanış fazında):** `GV.pageHead` `eyebrow` verilmediğinde `SECTIONS[sec].eyebrow`'a
düşecek; ekranlardaki elle yazılmış eyebrow'lar taranıp bölüm kaydıyla çelişenler silinecek.

---

## VB-22 · Proje modülünde üç sözlük eksik

**Nerede:** `DB.projects[].durum` · `.saglik` · `.faz` · `DB.bugs[].durum` · `.tekrarlanabilir` ·
`DB.tests[].sonuc`.

**Sorun:** Hiçbirinin `DB.*` sözlüğü yok. Üç form ekranı (proje · hata · test koşumu) kümeleri
liste ekranlarının süzgeçlerinden ve mevcut kayıtlardan **türetmek zorunda kaldı**. Sonuç:
veride hiç kullanılmayan bir değer (örn. proje `Askıda`) forma girmiyor, veride tek değer varsa
select tek seçenekli kalıyor (VB-17 ile aynı sınıf).

**Çözüm (kapanış fazında):** `DB.projectStatuses` · `DB.healthLevels` · `DB.projectPhases` ·
`DB.bugStatuses` · `DB.reproLevels` · `DB.testResults` sözlükleri açılacak; liste süzgeçleri,
formlar ve `GV.badge` tonları aynı kaynaktan beslenecek. VB-14 ve VB-17 ile **aynı turda** —
üçü de "eksen var, sözlüğü yok" sınıfı.

**VB-20 eki — `aktif` ekseni koleksiyondan koleksiyona değişiyor.** `DB.sprints`'in **6 kaydının
6'sında `aktif` alanı hiç yok**, oysa `GV.list` `aktif === false`'u arşiv sayıyor ve sprint liste
ekranının toplu "Arşivle" işlemi bu alanı yazıyor. Yani bileşen bir alan bekliyor, veri onu
taşımıyor; yeni yazılan kayıtlarda alan doğuyor ve şema kayıttan kayda değişiyor. Aynı tur:
`aktif`/`arsiv` sözleşmesi components.md'ye yazılıp **tüm koleksiyonlarda** eşitlenecek.

---

## VB-23 · Teslim onayı üç ekranda üç farklı yürütülüyor

**Nerede:** `app-proje-teslim.html` (satır aksiyonu + toplu işlem) · `app-proje-teslim-detay.html`
(`onayAkisi`) · `app-proje-teslim-form.html`.

**Sorun (ajan raporundan, ekranlar okunarak doğrulandı):**
1. **Mutasyon ayrışması:** liste ekranı müşteri onayını işlerken yalnız `musteriOnay` +
   `onayTarihi` yazıyor; detay ekranı "teslim durumu ile müşteri onayı aynı eksende tutulur"
   diyerek `durum`'u da `Onaylandı` yapıyor. Aynı işlem iki ekranda iki farklı sonuç bırakıyor.
2. **Yetki ayrışması:** liste `can('onay')`, detay `can('duzenle')` soruyor.
3. **Gizli hata:** `app-proje-teslim.html` `mobile()` render'ı onayı ikili okuyor
   (`onayBekler(t) ? 'bekliyor' : 'onayladı'`); sözlükteki üçüncü değer **`Revizyon istendi`**
   mobil satırda yeşil "Müşteri onayladı" olarak çıkar. Veride o değer bugün yok — hata gizli.
4. Aynı ekranın `musteriOnay` süzgeci de yalnız `Onaylandı`/`Bekliyor` sunuyor;
   `Revizyon istendi` filtrelenemiyor.

**Çözüm (kapanış fazında):** Onay mutasyonu **tek yerde** tanımlanacak
(`GV.delivery.approve(kod, karar)` gibi), üç ekran da onu çağıracak; yetki ekseni tek olacak;
mobil render üçüncü değeri de basacak; süzgeç sözlüğün tamamını sunacak. VB-06 (fatura ↔ tahsilat
kapanışı) ile **aynı sınıf** — iki ekran aynı işlemi farklı yürütüyor.

---

## VB-24 · `doluluk` ekseni iki koleksiyonda birden yaşıyor

**Nerede:** `DB.employees[].doluluk` ↔ `DB.capacity[].doluluk`.

**Ölçüm:** 16 personelin 10'unda kapasite kaydı var ve **10/10 birebir eşit**; kalan 6'sında
(EMP-001/002/011/012/013/014) kapasite kaydı yok, yalnız personel kartındaki sayı duruyor.
Aynı sayı iki yerde tutulduğu için biri güncellenince diğeri sessizce eskir (L-08).
`app-personel-form.html` bu yüzden alanı **hiç düzenlemiyor**.

**Ek:** `DB.company.calisanSayisi` (16) bugün personel sayısına eşit ama **hiçbir ekran okumuyor**
ve hiçbir mutasyon güncellemiyor — yeni personel eklendiğinde sessizce eskiyecek üçüncü kopya.

**Çözüm (kapanış fazında):** Doluluk tek kaynağa indirilecek (`DB.capacity` tercih edilir,
kapasite planı ekseni orada); `DB.employees[].doluluk` ya kaldırılacak ya da türetilen okuma
hâline gelecek. `calisanSayisi` da türetilecek. `canon.js`'e "kapasite kaydı olan personelin
doluluğu kapasite kaydıyla aynıdır" ekseni girecek.

---

## UID-23 · `GV.empty` `desc` alanı 43 ekranda çift escape ediliyor

**Nerede:** `GV.empty({desc:…})` çağrılarının tamamı — **43 ekran** (grep ile sayıldı).

**Sorun:** Bileşen `desc`'i **kendisi escape ediyor** (`ui.js` → `'<p>' + esc(c.desc) + '</p>'`),
ama ekranlar da `esc(id)` ile ön-escape yapıyor. Sonuç çift escape: `&` içeren bir kayıt kodu
ekranda `&amp;` olarak **yazı hâlinde** görünür. Ders **L-14**'ün ikizi — orada escape
edilmemesi gereken yer escape edilmişti, burada iki kez ediliyor.

**Bugünkü etki sıfır** (kayıt kodları `LEAD-2026-001` biçiminde, özel karakter taşımıyor);
hata **gizli**, ilk özel karakterli kodda görünür olacak. `esc.js` bunu yakalamıyor çünkü
tarayıcı ham HTML **etiketi** arıyor, HTML **varlığı** (`&amp;`) aramıyor.

**Kök neden:** `components.md` §6 `GV.empty` satırında hangi tarafın escape ettiği yazılı değil;
ilk ekran ön-escape yazdı, kalan 42'si kopyaladı.

**Çözüm (kapanış fazında, tek turda):** Sözleşme components.md'ye yazılacak — **`title` ve `desc`
düz metin alır, bileşen escape eder; `action` HTML'dir, escape edilmez.** 43 ekrandaki
`esc(...)` ön-escape'i tek süpürmede kaldırılacak ve `esc.js`'e HTML varlığı (`&amp;` · `&lt;`)
araması eklenerek regresyon kilitlenecek. **Nokta yaması yok** — 43'ü birden.

---

## VB-25 · `DB.milestones[].odemeDurum` bağlı faturanın ayna alanı

**Nerede:** `DB.milestones[].odemeDurum` ↔ `DB.invoices[].durum` / `DB.payments[].durum`.

**Ölçüm:** Taksitli 15 faturanın **15'inde** taksitin `odemeDurum`'u bağlı faturanın tahsilat
durumuyla örtüşüyor — yani alan bağımsız bir eksen değil, **türetilmiş bir kopya**.
components.md §9d "bağ doğan kayıtta tutulur, hedefte ayna alan açılmaz" kuralına aykırı.
Fatura durumu `app-fatura-form.html` ya da `app-fatura.html`'den değiştiğinde taksit sessizce
ayrışır; form bu yüzden kaydetmeden önce `GV.confirm` ile uyarmak zorunda kaldı.

**Ek bulgu — iki sözlük, tek olgu:** fatura durumu (`Ödendi/Ödenmedi/Gecikti`) ile tahsilat
durumu (`Ödendi/Gecikti/Bekliyor`) aynı olguyu farklı kümelerle anlatıyor. Ayrıca `Gecikti`
`vade < DB.today`'den **türetilebilir** — saklanan türev (L-08).

**Çözüm (VB-06 ile aynı turda):** `odemeDurum` ya kaldırılıp taksit ekranları faturadan okuyacak,
ya da `GV.fin.settleInvoice()` yordamı içinde tek yerde güncellenecek; iki durum sözlüğü tek
kümede birleşecek; `Gecikti` türetilecek. `canon.js`'e "taksitin ödeme durumu bağlı faturasının
durumuyla aynıdır" ekseni girecek.

---

## UID-24 · `teslimKontrol` üç değeri listede ikiye iniyor

**Nerede:** `app-siparis.html` — teslim kontrolü kolonu ve teslim alma modali.

**Sorun:** Modal `Tam` / `Eksik` / `İade` yazıyor; kolon ise
`x.teslimKontrol === 'Tam' ? 'Tamam' : 'Kısmi'` diyor. Yani **`Eksik` ve `İade` listede
ayırt edilemiyor** — ikisi de "Kısmi" görünüyor, oysa `İade` seçildiğinde sipariş durumu
`İptal`e çekiliyor. Kullanıcı listeye bakıp iade edilmiş siparişi eksik teslimattan ayıramıyor.
Ayrıca `Eksik` ve `İade` `GV.badge` TONE sözlüğünde yok.

**Çözüm (kapanış fazında):** Kolon üç değeri de basacak; `Eksik`(warn) ve `İade`(danger)
ton sözlüğüne girecek; `teslimKontrol` kümesi VB-22'nin sözlük turunda koleksiyona alınacak.

---

## UID-25 (özgün kayıt · UID-11 ile birlikte ÇÖZÜLDÜ) · Rapor çıktısı 73 raporda yetki kapısız

**Nerede:** `app-rapor-gorev.html` · `app-rapor-filo.html` · `app-rapor-proje.html` ·
`app-rapor-personel.html` · `app-rapor-referans.html` — `GV.report` / `GV.list` `export`
seçeneği.

**Sorun (K dokümanı ölçtü):** `export` seçeneğinin `disaAktar` yetkisine bağlanması yalnız
**müşteri ve finans** rapor ekranlarında yapılmış. Kalan beş ekranda çıktı butonu **her role**
basılıyor — `disaAktar` yetkisi 27 rolün 14'ünde var, yani 13 rol görmemesi gereken bir
butonu görüyor. Toplam **73 rapor** bu durumda. UID-13 (toplu işlemde `show`/yetki kapısı yok)
ile aynı sınıf: yetki kontrolü bileşende değil, ekran başına bırakılmış.

**Çözüm (kapanış fazında):** `GV.report` ve `GV.list` `export` seçeneği `disaAktar` yetkisini
**bileşende** kontrol edecek; yetkisiz rolde çıktı şeridi hiç basılmayacak. İki ekrandaki
elle yazılmış kapı silinecek. Nokta yaması yok.

---

## VB-26 · Rapor kataloğu ile kurulmuş raporlar anahtar düzeyinde ayrışıyor

**Nerede:** `app-rapor.html` katalogu (99 girdi) ↔ sekiz rapor ekranındaki gerçek tanımlar
(103 rapor).

**Ölçüm (K dokümanı):** Katalogda olup ekranı olmayan rapor **yok** — fark iki yerde:
**finans** ekranının 16 etiketi tutuyor ama **9 `key` tutmuyor**; **proje** ekranının
**8 katalog girdisinin hiçbiri** ekrandaki 12 raporla eşleşmiyor. Katalog girdileri
`deep:false` olduğu için derin bağlantı kurulmuyor ve **hata bugün görünmüyor**;
`deep:true` yapıldığı anda 17 katalog kartı yanlış rapora ya da hiçbir yere gider.

**Ek:** proje rapor sayısı **12**, plan.md ve handoff'ta yazılı "8" değil.

**Çözüm (kapanış fazında):** Katalog anahtarları ekran tanımlarından **türetilecek** ya da
`canon.js`'e "her katalog `key`'i bir ekran raporunda karşılık bulur" ekseni eklenecek.
Proje rapor sayısı defterlerde 12'ye düzeltilecek.

---

## ✅ VB-27 · `DB.surveys[].ilgili` altı yetim proje kodu taşıyor — ÇÖZÜLDÜ (2026-08-05, 10. oturum)

**Karar: veri tamamlandı, anket değiştirilmedi.** Altı proje `DB.projects`'e geçmiş
teslim olarak yazıldı (`arsiv:true`, `durum:'Teslim'`), gerekçe `assumptions.md` **V-37**.
Belirleyici ölçüm: müşterilerin **`projeSayisi` ömür boyu sayacı bu projeleri zaten
sayıyordu** (MUS-2024-001 kartı 3 proje diyordu, veride 1 kayıt vardı) — yani eksik olan
anket değil proje kaydıydı.

**Yan düzeltmeler:** `MUS-2026-011` projeSayisi 1→2 · toplamCiro 500.000→690.000 ·
`REF-002` ciro 2.080.000→2.270.000 (eksen 14 zorladı).

**Yeni eksen — `canon.js` 20:** `ilgili` gerçek bir kaydı gösterir **ve** proje teslimi
anketi teslimden sonradır. İkinci kural yazılır yazılmaz **gerçek bir hata buldu**:
`ANK-2026-057` teslimden 2 gün ÖNCE tarihliydi. **672 kontrol temiz.**

---

## VB-27 (özgün kayıt) · `DB.surveys[].ilgili` altı yetim proje kodu taşıyor

**Nerede:** `assets/data/ops.js` → `DB.surveys`.

**Ölçüm (9. oturum, G dokümanı ajanı buldu, orkestratör bağımsız doğruladı):**
24 anketin 10'u `ilgili` alanında `PRJ-*` kodu taşıyor; bu 10 kodun **6'sı**
`DB.projects` içinde **yok**:
`PRJ-2024-011` · `PRJ-2025-009` · `PRJ-2025-010` · `PRJ-2025-012` · `PRJ-2026-008` · `PRJ-2023-014`.
Gerçek proje kümesi 8 kayıttır (`PRJ-2026-001..007` + `PRJ-2025-008`).
Yani proje teslimi anketlerinin yalnız **4'ü** çözülüyor, 6'sı boşluğa bakıyor.

**Neden bugün görünmüyor:** Anket ekranları `ilgili`yi çoğunlukla **metin olarak** basıyor,
`DB.projects`'te aramıyor. Arayan ilk ekran boş ad ya da `undefined` gösterecek.
`canon.js`'in **eksen 15**'i bağ hedeflerini doğruluyor ama `DB.surveys[].ilgili`
o eksende **kayıtlı değil** — bu yüzden 601+ kontrol temiz derken bu altısını görmedi.
VB-19'la aynı sınıf: **ekseni olmayan hata görünmez.**

**Ayrım — bu bir "bağ değil" savunması değil.** `ilgili` alanı `DST-*` ve `MUS-*`
kodlarında gerçek bağ olarak kullanılıyor; aynı alanda altı kod hedefsiz.
Yani sorun alanın tanımında değil, **verinin eksikliğinde**.

**Çözüm (kapanış fazında):** Ya altı proje kaydı `DB.projects`'e yazılacak (anketlerin
tarihleri 2023–2026 aralığına yayılıyor, geçmiş projeler olarak tutarlı), ya da altı anketin
`ilgili` alanı var olan projelere çekilecek. Hangisi seçilirse gerekçe `assumptions.md`'ye
yazılır. Ardından `canon.js`'e **"`DB.surveys[].ilgili` gerçekten var olan bir kaydı gösterir"**
ekseni girecek — eksen yazılmadan düzeltme kabul edilmez (VB-19 dersi).

---

## UID-26 · Kolon / filtre / çıktı / toplu işlem / kanban yalnız `GV.list` içinde yaşıyor

**Nerede:** `assets/js/ui.js` — `openCols()` · `openFilters()` · `doExport()` ·
`renderBulk()` · `renderKanban()`. Beşi de `GV.list` kapanışının **içinde** tanımlı.

**Ölçüm (9. oturum):** `components.md` §6 bunları beş yıldır `GV.cols(table)` ·
`GV.filters(config)` · `GV.export(config)` · `GV.bulk(config)` · `GV.kanban(config)` diye
**çağrılabilir bileşen** olarak listeliyordu. `ui.js` ve `shell.js` tarandı: gerçek
`GV.*` yüzeyi **37 üye** ve bu beşi orada **yok**. Ayrıca `GV.notify` · `GV.dateRange` ·
`GV.help` kodda **hiçbir yerde** tanımlı değil. Sözlük 9. oturumda düzeltildi.

**Asıl borç — sözlük hatası değil, mimari kısıt.** Bu beş yetenek `GV.list`'e
**kilitli**: liste olmayan bir ekran (detay sekmesi, rapor kartı, matris) kolon
yönetimi, gelişmiş filtre, çıktı ya da kanban kuramıyor. Borç defterindeki üç madde
bunun **belirtisi**: UID-06 (ikinci `GV.list` örneği kurulamıyor — `app-egitim.html`
matrisi elle yazmak zorunda kaldı) · UID-07 (seçili kapsam dışa aktarılamıyor) ·
UID-17 (dokuz ekran kendi `dl()` yardımcısını yazıyor). Hepsi aynı kök: **ortak katman
bileşen değil, tek bir dev bileşen.**

**Çözüm (kapanış fazında):** Beş yordam `GV.list` kapanışından çıkarılıp kendi
sözleşmesiyle `GV.*` yüzeyine alınacak; `GV.list` onları **çağıran** taraf olacak.
Sıra önemli — önce `doExport` (UID-07'yi de kapatır), sonra `openCols` (UID-06),
sonra `openFilters`, `renderBulk` (UID-13'ün `show` kapısıyla birlikte), en son
`renderKanban`. Her adımdan sonra `GV.list` kullanan **tüm** liste ekranları
1440/768/390'da yeniden doğrulanır. **Nokta yaması yok.**

**Ayrıca:** `GV.notify` sözlükte "panel + sayaç + okundu" diyordu; gerçekte üst bardaki
zil düz bir `<a href="app-panel-bildirimler.html">` bağlantısı — panel de, okundu
yordamı da yok. Bildirim merkezi bileşeni **hiç yazılmamış**; PROMPT.md §21'in
istediği "bildirim merkezi" bugün yalnız ayrı bir ekran olarak var.

---

## 🔴 UID-27 · `GV.list` `run`'ı olmayan toplu işlemde SAHTE BAŞARI mesajı basıyor

> **Defterdeki en yüksek öncelikli madde.** Ölü buton değil, **yalan söyleyen** buton.

**Nerede:** `assets/js/ui.js` → `wire()` içindeki toplu işlem yönlendiricisi (951–952. satır).

```js
if(act.run) act.run(state.selected.slice());
else GV.toast(act.label + ' — ' + state.selected.length + ' kayıt işlendi', 'ok');
```

**Sorun:** `bulk[]` maddesinin `run`'ı yoksa bileşen **yeşil ton (`'ok'`) ile
"N kayıt işlendi" diyor** ve hiçbir şey yapmıyor. Kullanıcıya işlem başarılı oldu
bilgisi veriliyor; seçim temizleniyor, liste yeniden çiziliyor — yani ekran da
"bir şey oldu" gibi davranıyor. Veri değişmiyor.

**Ölçüm — İKİ KEZ ÖLÇÜLDÜ, İLK SAYIM EKSİKTİ.**

| | İlk kayıt (statik grep) | Gerçek (`act.js` çalışma zamanı) |
|---|---|---|
| İhlal | **79** aksiyon / 47 ekran | **129** aksiyon / **65** ekran |
| 🔴 yalan (başarı basıp veri değiştirmeyen) | — | **94** (87 toplu · 7 satır) |
| ⚫ ölü (hiç geri bildirim vermeyen) | — | **35** (26 satır · 5 kaydet · 4 toplu) |
| Sağlıklı | — | 60 mutasyon · 33 yönlendirme · 9 panel · 10 dürüst red |

İlk sayım **iki yönden** eksikti: (a) yalnız `bulk[]`e bakıyordu, `rowActions[]` ve
form kaydet düğmeleri kapsam dışıydı; (b) statik regex iç içe nesneleri yanlış
ayrıştırıyordu (`app-fatura.html`'de 2 saydı, gerçekte 3 toplu işlem var).
**Ders L-25:** ölçüm ekseni olmadan yazılan borç kaydı borcu **eksik sayar**.

Tek başına en büyük kalem `disa` — **53 ekranda** "seçilenleri dışa aktar".

**Özgün kayıt:** 79 toplu işlem aksiyonu, 47 ekranda `run` taşımıyor. Bunların bir kısmı `confirm` metni de gösteriyor — kullanıcı
"12 kaydı arşivlemek istediğinize emin misiniz?" onayını veriyor, yeşil
"Arşivle — 12 kayıt işlendi" mesajını alıyor ve **hiçbir kayıt arşivlenmiyor**.

Tamamen sahte olan ekranlar (aksiyonlarının **hepsinde** `run` yok, 40 ekran):
`app-arac` · `app-arac-bakim` · `app-arac-gider` · `app-arac-kaza` · `app-arac-muayene` ·
`app-arac-sigorta` · `app-arac-yakit` · `app-demirbas` · `app-destek` ·
`app-destek-memnuniyet` · `app-dokuman` · `app-fatura` · `app-gorev` · `app-istalebi` ·
`app-izin` · `app-komisyon` · `app-lead` · `app-musteri` · `app-musteri-iletisim` ·
`app-musteri-yetkili` · `app-onanaliz` · `app-panel-bildirimler` · `app-panel-onaylar` ·
`app-performans` · `app-personel` · `app-pipeline` · `app-proje` · `app-referans` ·
`app-satinalma` · `app-satinalma-teklif` · `app-siparis` · `app-tedarikci` · `app-teklif` ·
`app-toplanti` · `app-zaman` · `app-zimmet`
Kısmen sahte (7 ekran): `app-butce` 1/3 · `app-destek-paket` 1/4 · `app-dokuman-sure` 1/4 ·
`app-proje-degisiklik` 1/6 · `app-proje-hata` 1/6 · `app-proje-milestone` 1/4 ·
`app-proje-sprint` 1/6 · `app-proje-teslim` 1/6 · `app-proje-test` 1/6 ·
`app-sozlesme` 1/6 · `app-tahsilat` 1/3

**Neden beş oturum boyunca görünmedi:** Hiçbir QA ekseni bunu ölçmüyor.
`qa.js` konsola bakıyor (hata yok) · `links.js` `href`'e bakıyor (buton `href` taşımıyor) ·
`mut.js` `GV.refresh()` sonrası çoğalma arıyor (mutasyon hiç olmadığı için temiz) ·
`esc.js` metin arıyor. Ders **L-15**'in ("toast çıktı ≠ işlem oldu") tam karşılığı,
ama bu kez hata **ekranda değil ortak bileşende** ve **varsayılan davranış** olarak.
CLAUDE.md'nin "sahte buton, çalışmayan aksiyon **yasak**" kuralının en büyük ihlali.

### ✅ ÇÖZÜM KAYDI — 9. oturum, ortak katmanda tek yerde

`ui.js`'teki yalan yedek (`else GV.toast(...'kayıt işlendi','ok')`) **kaldırıldı**;
aynı sert kural tek yerde hem `bulk[]` hem `rowActions[]` için kuruldu:
**`run` yoksa aksiyon `disabled` basılır ve "bu sürümde yok" der.**

**Neden gizlemedik (karar gerekçesi):** Üç seçenek değerlendirildi —
(a) gizle, (b) devre dışı göster, (c) dürüst uyarı. **(b) + (c) seçildi.**
Gizlemek 47 ekranın toplu işlem barını boşaltıp kapsamı olduğundan **küçük**
gösterirdi; ayrıca gizleme **UID-13'ün yetki için** öngördüğü davranıştır ve
"yetkin yok" ile "henüz yazılmadı" aynı şeymiş gibi görünürdü. Devre dışı + dürüst
etiket ikisini ayırır ve projenin `data-wip` geleneğiyle aynı mantıktadır.

**Ölçülen sonuç:** ihlal **129 → 28** (65 → 21 ekran). **85 toplu aksiyon** artık
dürüstçe devre dışı. Eksik-`run` yolundan gelen ihlal **sıfır**.

**KALAN 28 FARKLI SINIFTIR → UID-30.** Bunlarda `run` **var** ve çağrılıyor;
yalan söyleyen bileşen değil, ekranın **kendi `run` gövdesi**.

**Çözüm (özgün plan):**
1. `ui.js`'teki `else GV.toast(...)` yedeği **kaldırılacak** — bileşen asla yapmadığı
   bir işi yaptım demez.
2. `run` taşımayan `bulk[]` maddesi toplu işlem barına **hiç basılmayacak**
   (`rowActions[].show` felsefesiyle aynı; **UID-13** ile birlikte tek sözleşme:
   `bulk[]` maddesi `run` + `show`/`perm` taşır, yoksa görünmez).
3. Sonra 47 ekranın toplu işlemleri tek tek gözden geçirilecek: gerçekten istenen
   aksiyonlara `run` yazılacak, istenmeyenler config'ten silinecek.
4. `tasks/qa/` altına **yeni tarayıcı**: "her `bulk[]` maddesinin `run`'ı var mı" —
   eksen yazılmadan düzeltme kabul edilmez (VB-19 dersi).

**Sıra uyarısı:** 2. adım tek başına uygulanırsa 40 ekranda toplu işlem barı boşalır.
1, 2 ve 3 **aynı turda** yapılır; ardından `GV.list` kullanan tüm liste ekranları
1440/768/390'da yeniden doğrulanır. **Nokta yaması yok.**

---

## UID-28 (özgün kayıt · UID-11 ile birlikte ÇÖZÜLDÜ) · Maskeleme kararı kardeş ekranlar arasında ayrışıyor

**Nerede:** Aynı veriyi gösteren ekran kümeleri; `GV.perm.can(...)` çağrısı bazısında var, bazısında yok.

**Ölçüm (9. oturum, F dokümanı):**

| Küme | Maskeleyen | Maskelemeyen |
|---|---|---|
| Doküman gizliliği | `app-dokuman-sure` (1 çağrı) · `app-dokuman-detay` (5 çağrı) — `Gizli`/`Kişisel veri` belge adını `can('log')` ile maskeliyor | **`app-dokuman.html` — `perm.can` çağrısı SIFIR.** Merkez liste aynı kayıtları maskesiz basıyor |
| Filo para ekseni | — | `app-arac` aylık kira · `app-arac-sigorta` kasko bedeli · `app-arac-yakit` birim fiyat — `can('finans')` denetimi yok |

**En sinsi kısmı:** `app-arac-yakit.html` `tutar`ı maskelerken **birim fiyatı** açık basıyor;
`litre × birimFiyat = tutar` olduğu için maskelenen sayı **geri hesaplanabiliyor**.
Maskeleme burada güvenlik değil, dekor.

**Kök neden:** Maskeleme kararı ekran başına bırakılmış; ortak katmanda "bu alan bu yetkiye
tabidir" diye bir sözleşme yok. **UID-11** (KPI'da maskeleme kavramı yok) ve **UID-25**
(çıktı yetki kapısı ekran başına) ile **aynı sınıf** — üçü tek turda çözülür.

**Çözüm (kapanış fazında):** Alan → yetki eşlemesi **veri katmanında** ya da `GV.list`
`columns[]` sözleşmesinde tanımlanacak (`perm:'finans'` gibi), maskeleme bileşende
uygulanacak; türetilebilir alanlar (birim fiyat ↔ tutar) **birlikte** maskelenecek.
`canon.js`'e değil, yeni bir yetki tarayıcısına eksen olarak girecek:
"aynı koleksiyonu gösteren iki ekran aynı alanı farklı maskeliyor mu".

---

## UID-29 · `app-arac-yakit.html` "Geçen Ay" sekmesi sabit tarihe yazılmış

**Nerede:** `app-arac-yakit.html` sekme tanımı.

**Ölçüm:** `filter:function(x){ return String(x.tarih).slice(0,7) === '2026-07'; }`
— ay **sabit kodlanmış**, `DB.today`'den türetilmemiş. `DB.today` ilerlediğinde
sekme "geçen ay"ı değil sabit bir takvim ayını göstermeye devam eder; bugün doğru
görünüyor çünkü `DB.today` 2026-08 içinde.

**Sınıfı:** L-08'in ("türetilebilir değer yazılmaz") ekran tarafındaki ikizi.
Aynı deseni kuran başka sekme var mı diye `slice(0,7) ===` taraması yapılacak.

**Çözüm (kapanış fazında):** Ay `DB.today`'den türetilecek. Tarama sırasında
bulunacak benzer sabitlerle **aynı turda**.

---

## VB-28 · §22'nin 37 bağından üçü veride hiç yok, biri şemada var ama boş

**Ölçüm (9. oturum, Wave 13 kapanışı — 37 bağın 37'si tek tek veriye soruldu):**

> **Önce sayım düzeltmesi:** `plan.md` ve `handoff.md` **"38 bağlantı"** diyor.
> `PROMPT.md` §22 sayıldı: **37 madde**. (Araç → Sigorta ve Araç → Kasko ayrı madde
> yazılmış ama tek koleksiyonda `tur` alanıyla ayrışıyor — `Trafik Sigortası` / `Kasko`.)

**Sonuç: 33 bağ kurulu · 3 bağ YOK · 1 bağ yarım.**

### Kurulu olmayan üç bağ

| § | Bağ | Ölçüm |
|---|---|---|
| 6 | **Kazanılan satış → Müşteri** | `DB.customers`'ta **`lead` alanı yok**. Müşterinin hangi adaydan doğduğu yazılı değil; yalnız `kaynak` ve `referans` var — ikisi de kanal bilgisi, kayıt bağı değil. `app-lead-detay`'ın "Müşteriye dönüştür" aksiyonu gerçek `DB.customers` kaydı üretiyor ama **geldiği adayı işaretlemiyor** |
| 15 | **Sohbet mesajı → Görev** | `DB.tasks`'ta **`kanal` ya da `mesaj` alanı yok**. `app-sohbet.html` sohbetten görev üretiyor (16 alanlı devir) ama görev **hangi mesajdan doğduğunu taşımıyor**; geri izleme yok |
| 24 | **Satın alma → Araç** | `DB.vehicles`'ta **`siparis` alanı yok**. Demirbaş tarafında `DB.assets[].siparis` VB-07'de açıldı, **araç tarafı atlandı** — oysa §22 ikisini de istiyor |

### Yarım kalan bağ — VB-05'in kapanış kaydı DÜZELTİLMELİ

`ui-debt.md` VB-05 ve `plan.md` Wave 9 maddesi "destek → görev / hata / değişiklik
dönüşümü **yazılı**, VB-05 kapandı" diyor. Ölçüm:

| Alan | Şemada | Gerçekten dolu |
|---|---|---|
| `DB.tasks[].destek` | ✅ var | **0 / 25** |
| `DB.bugs[].destek` | ✅ var | 2 / 6 |
| `DB.changeRequests[].destek` | ✅ var | **0 / 4** |

Yani **alan açıldı, bağ yazılmadı** — üç eksenden yalnız biri (hata) gerçek değer taşıyor.
VB-05 kapanışı bu hâliyle **fazla iddialı**; doğrusu "hata ekseni kapandı, görev ve
değişiklik ekseni açık". Ders **L-13**'ün ("bağ yazılır, türetilmez") bir adım ilerisi:
**alan açmak bağ yazmak değildir.** Boş alan, `canon.js`'in bağ hedefi kontrolünden de
sessizce geçer — çünkü kontrol edilecek değer yoktur.

**Neden görünmedi:** `canon.js` eksen 15 "bağ verilen kod gerçekten var mı" diye soruyor,
"bağ **verilmiş mi**" diye sormuyor. Boş alan her zaman geçer.

**Çözüm (kapanış fazında):**
1. Üç eksik bağ alanı açılacak: `DB.customers[].lead` · `DB.tasks[].kanal` (ya da `.mesaj`) ·
   `DB.vehicles[].siparis`. Mevcut örtük eşleşmeler ölçülüp yazılacak; eşleşme yoksa
   **uydurulmayacak**, gerekçesi `assumptions.md`'ye geçecek (L-13).
2. `DB.tasks[].destek` ve `DB.changeRequests[].destek` için gerçek eşleşme aranacak;
   bulunmazsa VB-05'in kapanış metni düzeltilecek — **kapanmış madde geri açılabilir.**
3. `canon.js`'e yeni eksen: **"§22'nin her bağı için en az bir kayıt gerçekten bağ taşır"**.
   Bu eksen bugün olmadığı için üç eksik bağ ve bir boş alan dört oturum boyunca görünmedi.
4. `plan.md` ve `handoff.md`'deki "38 bağlantı" ifadesi **37**'ye düzeltilecek.


---

## ~~UID-30~~ · Ekranın kendi `run` gövdesi yalan söylüyor — **10 ihlal / 5 ekran** · 6'sı çözüldü (10. oturum)

> ### ⚠️ SAYI DÜZELTMESİ — BORCU BU KEZ ARAÇ ŞİŞİRDİ (L-25'in tersi)
> Bu madde **"28 aksiyon / 21 ekran"** diye kayıtlıydı. 10. oturumda `act.js`
> dört ayrı yanlış hüküm veriyordu; düzeltilince gerçek sayı **10 yalan / 5 ekran**
> çıktı ve **⚫ ÖLÜ sıfırlandı**. Yani borç, ölçüm aracının kendi hatalarıyla
> **%180 fazla** sayılmıştı. L-25 borcun eksik sayılabileceğini söylüyordu;
> bu kayıt **fazla da sayılabileceğini** gösteriyor. İkisinin ortak dersi aynı:
> **ölçüm aracı da ölçülmeden güvenilmez** (L-17 · L-24).
>
> | Aracın yanlış hükmü | Neden yanlıştı | Kaç kayıt düştü |
> |---|---|---|
> | Çıktı modalını **onay modalı** sandı | `GV.confirm` gibi `is-sm` + iki aksiyon; ama **girdi sorar**. Araç "Çıktı Al"a basıyor, dosya iniyor, veri değişmiyor → 🔴 YALAN | UID-07 sonrası 51 çıktı aksiyonu |
> | **Girdi soran** modalı kendi onaylıyordu | "km gir", "sorumlu seç" panelleri boş onaylanınca ekran haklı olarak reddediyordu | 19 aksiyon (artık PANEL, ikinci adım *ölçülmedi* diye ayrı sayılıyor) |
> | **Görünmeyen** toplu işlem butonuna tıklıyordu | Seçilebilir satır yoksa (boş sekme · kanban) bar gizli; tıklama sessizce düşüyor → ⚫ ÖLÜ | 2 aksiyon (`app-pipeline` · `app-zaman` `disa`) |
> | Satır aksiyonunu **yalnız ilk satırda** deniyordu | İlk satır ön koşulu sağlamıyorsa (zaten onaylı kayıt) yordam dürüstçe reddediyor, araç "ölü" sayıyordu. Ayrıca `'info'` tonlu red **dürüst red** sayılmıyordu | 13 aksiyon (`app-komisyon` · `app-satinalma` · `app-zimmet` · `app-istalebi` · `app-toplanti` · `app-demirbas` · 5 form kaydet …) |
>
> **Beşinci düzeltme — maskeleme yasağı:** çok satır denemesi eklendiğinde bir satırda
> **yalan** söyleyip başka satırda dürüstçe reddeden aksiyon "temiz" görünmeye başladı.
> Kural yazıldı: **🔴 YALAN maskelenemez**, yalnız ⚫ ÖLÜ daha iyi bir sonuçla gölgelenebilir.
> Bu kural olmasaydı `app-destek-sla` `eskale` sessizce temiz sayılacaktı.
>
> **Beş form kaydet düğmesi (`app-arac-form` · `-gider-` · `-kaza-` · `-sigorta-` ·
> `app-satinalma-form`) hatalı kayıttı:** elle ölçüldü — alan değiştirilip kaydedildiğinde
> beşi de kaydı yazıp listeye dönüyor. Ölü değiller; araç değişiklik yapmadan kaydettiği
> için "hiçbir şey olmadı" sanıyordu.

### ✅ Çözülen 6 (10. oturum)

| Ekran | Aksiyon | Ne yapıldı |
|---|---|---|
| `app-butce` | `revizyon` (toplu) | Gerçek **`DB.changeRequests`** kaydı açılıyor (`etkiMaliyet` = bütçe aşımı, `durum:'Onay bekliyor'`, `sorumlu` = proje yöneticisi) + aktivite kaydı. Açık talebi olan proje atlanıyor ve **söyleniyor** |
| `app-butce` | `uyari` (toplu) | Proje yöneticisine gerçek **`DB.notifications`** kaydı + aktivite. Yöneticisi olmayan proje atlanıyor ve söyleniyor |
| `app-destek-sla` | `eskale` (satır + toplu) | Sorumlunun **departman yöneticisine** bildirim + talebe aktivite kaydı. Hedef veriden çözülüyor (`DB.departments[].yonetici`), politika metnindeki makam adı **uydurulmuyor** (L-13). `misc.js` sayfaya eklendi (L-12) |
| `app-ayar-otomasyon` | `ac` / `kapat` (toplu) | **Gerçekten değişen** kural sayılıyor; hepsi zaten aktifse `'info'` tonuyla öyle deniyor |
| `app-ayar-otomasyon` | `dene` (satır) | Kuru çalıştırma tanımı gereği hiçbir şeyi değiştirmez; sonuç artık **panelde** gösteriliyor (tetikleyici · koşul · eşleşen kayıt · kural durumu), yeşil "oldu" mesajı yok |

### ⏳ Kalan 4 — ikisi de VERİ EKSENİ istiyor, tutarlılık turunda

| Ekran | Aksiyon | Engel |
|---|---|---|
| ~~`app-dokuman-sure`~~ | ~~`hatirlat`~~ | ✅ **ÇÖZÜLDÜ** — `DB.reminders` açıldı, aksiyon hem hatırlatma hem bildirim kaydı yazıyor |
| ~~`app-panel-duyurular`~~ | ~~`oku`~~ | ✅ **ÇÖZÜLDÜ** — `DB.announcements[].okuyanlar` açıldı, okuma kişi bazlı ve yazılı |

> **UID-30 KAPANDI.** `act.js` ölçümü: 141 ekran · 207 aksiyon · **🔴 yalan 0 · ⚫ ölü 0**.

---

## UID-30 (özgün kayıt) · Ekranın kendi `run` gövdesi yalan söylüyor — 28 aksiyon / 21 ekran

**UID-27'nin kardeşi ama farklı sınıf.** UID-27'de *bileşen* çağıranın vermediği
yordamın yerine başarı varsayıyordu; burada yordam **var**, çağrılıyor, ama içi
ya yalnız `GV.toast` basıyor ya da ölçülebilir hiçbir şey yapmıyor.

**Ölçüm (`act.js`, UID-27 düzeltmesinden SONRA):** 🔴 **13 yalan** · ⚫ **15 ölü**.

| Ekran | Aksiyon | Hüküm |
|---|---|---|
| `app-arac` | `km` (satır) | yalan |
| `app-ayar-otomasyon` | `dene` (satır) · `ac` (toplu) | yalan |
| `app-butce` | `revizyon` · `uyari` (toplu) | yalan |
| `app-destek-sla` | `ata` · `eskale` (satır) · `eskale` (toplu) | yalan |
| `app-destek` | `donustur` (satır) | yalan |
| `app-dokuman-sure` | `hatirlat` (satır + toplu) | yalan → **VB-29** |
| `app-panel-duyurular` | `oku` (satır + toplu) | yalan |
| `app-zimmet` | `onay` (satır) | ölü |
| `app-komisyon` | `onayla` (satır) | ölü |
| `app-satinalma` | `onayla` (satır) | ölü |
| `app-istalebi` | `kabul` (satır) | ölü |
| `app-toplanti-karar` | `durum` (satır) | ölü |
| `app-demirbas` | `zimmet` (satır) | ölü |
| `app-egitim` | `katilimci` (satır) | ölü |
| `app-satinalma-teklif` | `kars` (satır) | ölü |
| `app-destek-memnuniyet` | `takip` · `yorum` (satır) | ölü |
| `app-ayar-kullanici` | `rol` · `yetki` (satır) | ölü |
| `app-ayar-entegrasyon` | `ayar` · `kes` (satır) | ölü |
| `app-dokuman` | `onizle` (satır) | ölü |
| `app-zaman-onay` | `kirilim` (satır) | ölü |
| 5 form ekranı | `(kaydet)` | ölü |

**Çözüm (Blok 3, UID-27'nin devamı):** Her biri tek tek incelenir — gerçek mutasyon
yazılır ya da aksiyon config'ten silinir. **Toplu bir kök neden yoktur**, bu yüzden
UID-27 gibi tek satırla kapanmaz. `act.js` her turda sayıyı ölçer; **sayı artarsa
regresyon**, azalırsa ilerleme.

**Not — beş form kaydet düğmesi ayrı incelenmeli:** `app-arac-form` ·
`app-arac-gider-form` · `app-arac-kaza-form` · `app-arac-sigorta-form` ·
`app-satinalma-form`. Diğer 31 form kaydet düğmesi doğru çalışıyor (listeye
yönlendiriyor), bu beşi yönlendirmiyor da, veri de yazmıyor.

---

## ✅ VB-29 · `hatirlat` aksiyonunun veri ekseni YOK — ÇÖZÜLDÜ (2026-08-05, 10. oturum)

**Açılan eksen:** `DB.reminders` (`misc.js`) — `kod · kayit · tur · tarih · kanal ·
gonderen · alici · durum`. Üç gerçek kayıtla dolduruldu (L-22: **alan açmak bağ yazmak
değildir**, boş koleksiyon kapanış sayılmaz).

**`DB.notifications`'tan ayrımı yazıldı:** bildirim **alıcının kutusundaki** kayıttır
(okundu ekseni vardır); hatırlatma **kayda ilişkin gönderim olayıdır** (kim, ne zaman,
hangi kanaldan, hangi kayıt için). Aynı olay ikisini birden üretir — `app-dokuman-sure`
artık her ikisini de yazıyor.

**Aynı turda kapanan ikinci eksen — duyuru okuma (`oku`, UID-30).**
`app-panel-duyurular` okuma durumunu sayfa-yerel bir nesnede tutuyor ve **tarihten
türetiyordu** ("14 günden eski duyuru okunmuş sayılır"). İki kusur birdeydi: türetilmiş
değer durum gibi davranıyordu (L-08) **ve** "Okundu işaretle" hiçbir yere yazmadığı için
yeşil mesaj basıp veriyi değiştirmiyordu. Eksen `DB.announcements[].okuyanlar` olarak
açıldı (kişi bazlı), ekran oturum sahibinin kodunu okuyup yazıyor; yeni "Okuyan kişi"
kolonu duyurunun kaç kişiye ulaştığını gösteriyor.

**Tarama ekseni yazılmadan kapatılmadı** (VB-19 dersi): `canon.js` **eksen 19** —
hatırlatmanın `kayit`i gerçek bir kaydı, `gonderen`i gerçek bir personeli, `alici`sı
personel ya da müşteriyi gösterir; duyuru `okuyanlar` dizisindeki her kod gerçek
personeldir; iki koleksiyon da **boş olamaz**. **645 kontrol temiz.**
Araç önce **bozuk vakayla sınandı** (L-24): `kayit:'DOK-YOK-999'` ve `EMP-999`
yazıldığında ikisini de yakaladı, sonra geri alındı.

---

## VB-29 (özgün kayıt) · `hatirlat` aksiyonunun veri ekseni YOK

**Nerede:** `app-dokuman-sure.html` (satır + toplu) · `app-fatura.html` ·
`app-tahsilat.html` — "hatırlatma gönder" aksiyonu.

**Sorun:** Aksiyon bir **bildirim/hatırlatma kaydı** üretmeli ama `DB.notifications`
kullanıcıya gönderilen bildirimi tutuyor, "şu kayda şu tarihte hatırlatma gönderildi"
ekseni **hiçbir koleksiyonda yok**. Bu yüzden `run` yazılsa bile yazacağı yer yok;
bugün yalnız `GV.toast` basıyor (UID-30'da **yalan** sayıldı).

**UID-27'nin `disa` kaleminden farkı:** `disa` bir **bileşen yeteneği** boşluğu
(`doExport` zaten var, seçili kapsamla çağrılamıyor — UID-07). `hatirlat` ise bir
**veri ekseni** boşluğu; bileşen tarafında yapılacak bir şey yok.

**Çözüm (kapanış fazında):** `DB.reminders` koleksiyonu açılacak
(kayıt kodu · tür · gönderim tarihi · kanal · gönderen · durum) ya da
`DB.notifications`'a "hangi kayda ilişkin" bağ alanı eklenecek. Karar
`assumptions.md`'ye yazılacak. Ardından üç ekranın `run`'ı gerçek mutasyona
çevrilecek ve `canon.js`'e "hatırlatma kaydı gerçekten var olan bir kaydı gösterir"
ekseni girecek.
