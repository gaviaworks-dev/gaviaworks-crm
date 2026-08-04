# Dersler

> Her hata → buraya bir kural. Bir daha olmaz.

| # | Hata | Çıkan kural | Tarih |
|---|------|-------------|-------|
| L-01 | Çakışan media query'de özgüllük kazandı, menü mobilde görünür kaldı | Kırılım aralıkları çakışmasın: `(min-width:981px) and (max-width:1180px)` | 2026-08-03 |
| L-02 | `--menu-w:0` olunca gizleme hesabı sıfırlandı | Daraltılabilir ölçüde `--x-full` sabit referansı tut, hesabı onunla yap | 2026-08-03 |
| L-03 | Her kolonda sıralama ikonu → başlık gürültüsü | Gösterge yalnız aktif sıralamada ikon, diğerlerinde hover'da soluk işaret | 2026-08-03 |
| L-04 | Persona çipinde ad/rol üst üste bindi | İki satırlı etiketlerde alt öğelere `display:block` | 2026-08-03 |
| L-05 | Mimari kazanım iddiası sorgulandı | İddia ölçülerek raporlanır; tahmin sapması olduğu gibi yazılır | 2026-08-03 |
| L-06 | Subagent kendi QA'sını yazarken orkestratörün `scratchpad/qa.js`'ini ezdi | Subagent sözleşmesine "scratchpad dahil hiçbir ortak dosyaya yazma" maddesi eklendi; QA script'i orkestratöre ait | 2026-08-03 |
| L-07 | QA yalnız tam yetkili rolle koşuldu; 403 ekranında sayfa script'i null üzerinde patlıyordu | Her ekran **en az bir kısıtlı rolle** de test edilir; `gv:ready` yalnız yetki kapısı açıkken tetiklenir | 2026-08-03 |
| L-08 | Rapor ekranları üç canonical veri çelişkisi ortaya çıkardı (kart sayacı ↔ işlem verisi) | Türetilebilir sayaç veriye **yazılmaz**, veriden hesaplanır; yazılıysa her wave sonunda taranır (`canon.js`) | 2026-08-03 |
| L-09 | Rail tutamağının görünen boyutu = yakalama alanı olunca imleç tam üstüne gelmeden tepki vermiyordu | Küçük tutamaklarda **görünen biçim ile yakalama alanı ayrılır**: dış öğe görünmez ve geniş, iç öğe görünen ve küçük. Yakalama alanı yalnız **boşluk oluklarına** taşar, hiçbir etkileşimli öğeyi örtmez — bu ölçülerek doğrulanır (`elementFromPoint` ile altındaki öğe sorgulanır) | 2026-08-04 |
| L-10 | Yüzeye yapışık bir öğeye kendi rengini vermek dikiş yaratır | Bir öğe komşu yüzeyin **uzantısı** gibi görünecekse rengi o yüzeyin token'ından alır ve yüzeyin kenarlığını **örtecek kadar** içeri taşar. Yüzey duruma göre değişiyorsa (menü açık/kapalı) renk kuralı da her durum için yazılır | 2026-08-04 |
| L-11 | Aç/kapa butonu sınıf varlığına göre karar veriyordu; 981–1180 px aralığında varsayılan kapalı olduğu için ilk tıklama boşa gidiyordu | Aç/kapa mantığı **sınıf varlığına değil, o kırılımdaki gerçek duruma** bakar (`matchMedia` + kırılıma özgü sınıf). `aria-expanded` bu durumdan türetilir ve `resize`'da yeniden senkronlanır | 2026-08-04 |

---

## L-01 · Media query aralıkları çakışmamalı
**Olay:** `@media (max-width:1180px)` içindeki `body:not(.gv-menu-on) .gv-menu` kuralı,
`@media (max-width:980px)` içindeki daha düşük özgüllüklü `.gv-menu` kuralını ezdi.
390px'de menü ekranın solunda 74px görünür kaldı ve içeriği kesti.
**Kök neden:** İki media query de aynı anda geçerliydi; kazananı **özgüllük** belirledi,
dosya sırası değil.
**Kural:** Kırılım aralıkları çakışmayacak şekilde yazılır. Bir kırılımda ezilen kuralı
sonraki kırılımda geri almak için özgüllük yarışına girilmez.

## L-02 · Daraltılabilir ölçüde "full" referansı tut
**Olay:** `body.gv-menu-off{ --menu-w:0 }` sonrası `translateX(calc(var(--menu-w) * -1))`
sıfır çıktı; menü gizlenmedi, yalnız genişliği sıfırlandı ve çocukları taştı.
**Kural:** İki token tutulur: `--menu-w-full` (sabit referans) ve `--menu-w` (güncel).
Gizleme/geri alma hesapları **her zaman full** üzerinden yapılır.

## L-03 · Sürekli görünen sıralama ikonu gürültü yaratır
13 kolonlu tabloda her başlığa ikon basmak okunabilirliği bozdu.
Gösterge yalnız aktif sıralamada ikon, diğerlerinde hover'da soluk işaret.

## L-04 · İki satırlı etiketlerde `display:block`
Persona çipinde `.gv-me-name` / `.gv-me-role` inline olduğu için üst üste bindi.
Satırlaşmayı `<br>` veya boşluğa bırakma.

**Tekrarladı (login.css):** giriş ekranı rol kartlarında `.lg-role-name` /
`.lg-role-title` aynı sebeple bitişik yazıldı — "Kerem AydınŞirket Sahibi".
**Genişletilmiş kural:** ad+açıklama kalıbı kuran her bileşende **hem sarmalayıcıya
hem iki alt öğeye** `display:block` verilir. Yeni bir "isim üstte, açıklama altta"
bloğu yazıldığında bu kontrol edilmeden commit edilmez.
Etkilenen sınıf çiftleri: `.gv-me-name/.gv-me-role` · `.lg-role-name/.lg-role-title` ·
`.cell-main/.cell-sub` (bunlar zaten block) · `.gv-user-name/.gv-user-sub`.

## L-05 · İddia ölçülerek doğrulanır
"Ortak liste bileşeni ekran maliyetini düşürecek" iddiası soruldu.
Referans liste ekranı **1134 satır**, aynı işi yapan ve daha fazla özelliği olan
`app-lead.html` **168 satır** — 6,7 kat. Tahmin 120–160 idi, sapma olduğu gibi raporlandı.
**Kural:** Mimari iddialar tahminle değil karşılaştırmalı ölçümle raporlanır.


## L-07 · Yetki kapısı arkasında sayfa script'i çalışmamalı
**Olay:** `app-ayar-yetki.html` `stajyer` rolüyle açıldığında `Cannot read properties of null
(reading 'addEventListener')` verdi. Shell 403 markup'ını basıp `.gv-page` içeriğini siliyor,
ama `gv:ready` yine tetikleniyordu; sayfa kendi mount düğümünü arayınca `null` buluyordu.
`GV.list` mount yoksa sessizce `null` döndüğü için liste ekranları bu hatayı gizlemişti —
elle markup kuran ekranlarda ortaya çıktı.
**Kök neden:** QA yalnız tam yetkili rolle (`sahip`) koşuluyordu.
**Kural:** (a) `gv:ready` yalnız yetki kapısı **açıkken** tetiklenir, kapalıyken `gv:denied` gider.
(b) Her ekran QA'sinde **en az bir kısıtlı rol** çalıştırılır. Toplu tarama: `scratchpad/gate.js`
(tüm ekranlar × 5 rol, konsol hatası + 403 sayımı).

## L-08 · Türetilebilir sayaç veriye yazılmaz
**Olay:** Rapor ekranları üç ayrı canonical çelişki buldu: müşteri kartındaki `bekleyenTahsilat`
açık fatura toplamıyla, `aktifProje` proje kayıtlarıyla, yönlendiren kartındaki `hakedis/odenen`
komisyon kayıtlarıyla uyuşmuyordu. Hepsi elle yazılmış "özet" alanlardı.
**Kural:** Bir sayı başka bir koleksiyondan hesaplanabiliyorsa veriye **yazılmaz**. Zorunlu olarak
yazılıyorsa (ömür boyu sayaçlar gibi) tanımı `assumptions.md`'ye geçer ve her wave sonunda
tarama script'iyle doğrulanır. **Yeni ekran eski veriyi sorguladığında çelişki çıkarsa, ekran
değil veri düzeltilir.**

## L-09 · Görünen biçim ile yakalama alanı ayrı katmanlardır
**Olay:** Sol rail'in daralt/genişlet tutamağı 20×48 px'ti ve yakalama alanı da o kadardı.
Referans projede imleç kenar şeridine yaklaşınca tutamak tepki verirken bizde tam üstüne
gelmek gerekiyordu.
**Kök neden:** Tutamak tek bir öğeydi — görünen pastil aynı zamanda hedef alandı.
**Kural:** Küçük tutamaklarda iki katman kurulur: dış öğe **görünmez ve geniş** yakalama bandı
(gerçek `<button>`, hover/odak onda tetiklenir), iç öğe **görünen ve küçük** grip.
Bandın taşma payı yalnız **boşluk oluklarına** girer: içeride menü kaydırma alanının iç
boşluğunu (`--sp-5`), dışarıda `--page-pad` oluğunu aşmaz. Bu iddia gözle değil ölçülerek
doğrulanır: bandın her noktasında `elementFromPoint` ile altındaki öğe sorgulanır, altında
`a/button/input/select/textarea` çıkarsa band küçültülür.

## L-10 · Uzantı gibi görünecek öğe komşusunun token rengini alır
**Olay:** Tutamak `--paper` zeminli, `--line-2` kenarlıklı, gölgeliydi; koyu sidebar'ın
üstünde yüzen ayrı bir nesne gibi duruyordu ve arkasındaki vurguyla üst üste biniyordu.
**Kural:** Bir öğe komşu yüzeyin uzantısı gibi görünecekse (a) rengini o yüzeyin token'ından
alır, (b) yüzeyin kenarlığını örtecek kadar (`--sp-2`) içeri taşar, (c) kendi kenarlığı ve
gölgesi olmaz, (d) yalnız dışa bakan kenarı yuvarlanır. Komşu yüzey duruma göre değişiyorsa
(menü açıkken `--brand-night`, kapalıyken rail `--brand-abyss`) renk kuralı **her durum için**
ayrı yazılır — kırılım içindeki kural da unutulmaz.
**Referans kullanımı:** referanstan yalnız biçim, oran ve davranış alınır; renk, tipografi ve
gölge bu projenin `tokens.css`'inden gelir.

## L-11 · Aç/kapa mantığı sınıfa değil gerçek duruma bakar
**Olay:** Tutamak `classList.toggle('gv-menu-off')` ile karar veriyordu. 981–1180 px aralığında
menü varsayılan kapalıdır ve gövdede **hiçbir sınıf yoktur**; ilk tıklama `gv-menu-off` ekleyip
zaten kapalı olan menüyü "kapatıyor", yani boşa gidiyordu.
**Kural:** Kırılıma göre varsayılanı değişen her aç/kapa, önce `matchMedia` ile hangi kırılımda
olduğunu sorar ve o kırılımın belirleyici sınıfına bakar. `aria-expanded` bu türetilmiş
durumdan yazılır ve `resize` olayında yeniden senkronlanır.
