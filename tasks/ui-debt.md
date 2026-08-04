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

## UID-07 · Toplu işlem "çıktı al" seçili kapsamı dışa aktaramıyor

**Nerede:** `GV.list` `bulk[].run(ids)` — tüm liste ekranları.

**Sorun:** `GV.list` dönüşü yalnız `state/refresh/setTab/setFilter` veriyor; seçili kayıtlarla
dışa aktarımı tetikleyen bir API yok. Bu yüzden her ekranın "seçilenleri dışa aktar" toplu
işlemi yalnız `GV.toast` basıyor — üst şeritteki Excel/CSV/PDF çıktısı çalışırken toplu
işlemdeki aynı isimli aksiyon çalışmıyor. Kullanıcı açısından bu **sahte buton** sınırına
yakın; en az üç ekranda aynı desen tekrarlandı.

**Çözüm (kapanış fazında):** `GV.list` dönüşüne `exportRows(rows, format)` eklenecek ve
toplu işlem bunu seçili kayıtlarla çağıracak. Ekranlarda tekrarlanan toast deseni silinecek.

---

## UID-08 · Form kontrolü ile etiketi arasında boşluk yok

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
