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

---

## UID-11 · Finans yetkisi yokken KPI "₺0" gösteriyor, maskeli göstermiyor

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

## UID-15 · Dört detay ekranı shell iskeletini elle kopyalıyor

**Nerede:** `app-gorev-detay.html` · `app-musteri-detay.html` · `app-lead-detay.html` ·
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

## VB-05 · Destek talebi → görev / hata / değişiklik bağ alanı veride yok

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

## VB-07 · Sipariş → demirbaş aktarım bağı veride yok

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

## VB-08 · Kalite zincirinin hiçbir halkasında yazılı bağ yok

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
