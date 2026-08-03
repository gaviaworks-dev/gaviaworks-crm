# ui-debt.md — Arayüz Borç Defteri

> Ekran üretimi sırasında fark edilen ama **o an düzeltilmeyen** arayüz sorunları.
> Hiçbiri nokta yamasıyla kapatılmaz — hepsi **plan.md → FAZ: UI ve UX KALİTE GEÇİŞİ**
> içinde, ortak katmanda kök nedenden çözülür.
>
> **Genel kural:** Referans projeden **biçim, oran, yerleşim ve etkileşim davranışı** alınır;
> **renk, tipografi ve gölge değerleri ALINMAZ** — onlar `assets/css/tokens.css`'ten gelir.
> Hiçbir çözümde hardcode renk kullanılmaz.

---

## UID-01 · Rail collapse çentiği referansa göre bozuk

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
