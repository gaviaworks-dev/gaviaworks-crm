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

## VB-19 · Teklif → sözleşme aktarımı para eksenini kaydırıyor (KDV iki kez)

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
