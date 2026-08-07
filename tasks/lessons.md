# Dersler

> Her hata → buraya bir kural. Bir daha olmaz.

| # | Hata | Çıkan kural | Tarih |
|---|------|-------------|-------|
| L-01 | Çakışan media query'de özgüllük kazandı, menü mobilde görünür kaldı | Kırılım aralıkları çakışmasın: `(min-width:981px) and (max-width:1180px)` | 2026-08-03 |
| L-02 | `--menu-w:0` olunca gizleme hesabı sıfırlandı | Daraltılabilir ölçüde `--x-full` sabit referansı tut, hesabı onunla yap | 2026-08-03 |
| L-03 | Her kolonda sıralama ikonu → başlık gürültüsü | Gösterge yalnız aktif sıralamada ikon, diğerlerinde hover'da soluk işaret | 2026-08-03 |
| L-04 | Persona çipinde ad/rol üst üste bindi | İki satırlı etiketlerde alt öğelere `display:block` | 2026-08-03 |
| L-05 | Mimari kazanım iddiası sorgulandı | İddia ölçülerek raporlanır; tahmin sapması olduğu gibi yazılır | 2026-08-03 |
| L-06 | Subagent kendi QA'sını yazarken orkestratörün `scratchpad/qa.js`'ini ezdi — **5. oturumda TEKRARLADI** | Yasak maddesi yetmedi. Kalıcı çözüm: script'ler `tasks/qa/`'da izlenir ve **ayrı bir `scratchpad/qa-run/` dizinine** kopyalanıp oradan koşulur; orkestratör subagentlerin yazdığı scratchpad kökünden hiçbir script çalıştırmaz | 2026-08-03 · 2026-08-04 |
| L-07 | QA yalnız tam yetkili rolle koşuldu; 403 ekranında sayfa script'i null üzerinde patlıyordu | Her ekran **en az bir kısıtlı rolle** de test edilir; `gv:ready` yalnız yetki kapısı açıkken tetiklenir | 2026-08-03 |
| L-08 | Rapor ekranları üç canonical veri çelişkisi ortaya çıkardı (kart sayacı ↔ işlem verisi) | Türetilebilir sayaç veriye **yazılmaz**, veriden hesaplanır; yazılıysa her wave sonunda taranır (`canon.js`) | 2026-08-03 |
| L-09 | Rail tutamağının görünen boyutu = yakalama alanı olunca imleç tam üstüne gelmeden tepki vermiyordu | Küçük tutamaklarda **görünen biçim ile yakalama alanı ayrılır**: dış öğe görünmez ve geniş, iç öğe görünen ve küçük. Yakalama alanı yalnız **boşluk oluklarına** taşar, hiçbir etkileşimli öğeyi örtmez — bu ölçülerek doğrulanır (`elementFromPoint` ile altındaki öğe sorgulanır) | 2026-08-04 |
| L-10 | Yüzeye yapışık bir öğeye kendi rengini vermek dikiş yaratır | Bir öğe komşu yüzeyin **uzantısı** gibi görünecekse rengi o yüzeyin token'ından alır ve yüzeyin kenarlığını **örtecek kadar** içeri taşar. Yüzey duruma göre değişiyorsa (menü açık/kapalı) renk kuralı da her durum için yazılır | 2026-08-04 |
| L-11 | Aç/kapa butonu sınıf varlığına göre karar veriyordu; 981–1180 px aralığında varsayılan kapalı olduğu için ilk tıklama boşa gidiyordu | Aç/kapa mantığı **sınıf varlığına değil, o kırılımdaki gerçek duruma** bakar (`matchMedia` + kırılıma özgü sınıf). `aria-expanded` bu durumdan türetilir ve `resize`'da yeniden senkronlanır | 2026-08-04 |
| L-12 | Ekran config'i `DB.priorities` okuyordu ama sayfa `work.js`'i yüklemiyordu; gelişmiş filtre **açılınca** patlıyordu, sayfa açılışında değil | Ekranın okuduğu her `DB.<koleksiyon>` için o koleksiyonun tanımlı olduğu veri dosyası sayfada yüklü olmalı. Sayfa açılışına bakan QA bunu göremez — statik tarayıcı her wave sonunda koşulur (`dbref.js`) | 2026-08-04 |
| L-18 | `GV.refresh()` `.page-main` dışına basılan açık yan paneli kapatmıyordu: dinleyici birikiyor (7→10) ve panelde eski veri ekranda kalıyordu | Yeniden çizim açık `.gv-scrim`/`.gv-drawer` düğümlerini kapatır; overlay üreten bileşen kapatıcısını düğüme asar (`__gvClose`). **Mount'u tazelemek ekranı tazelemek değildir** | 2026-08-04 |
| L-17 | Beş QA script'i `?id=KOD` olan hedefe `?role=` ekleyince adres bozuluyordu; detay ekranları "kayıt yok" durumunda ölçülmüş, sonuç yine de "TEMİZ" çıkmıştı | Araç hedefe parametre eklerken ayracı duruma göre seçer (`?` / `&`). Genel kural: **test aracının "temiz" demesi doğru şeyi ölçtüğü anlamına gelmez** — araç, sonucu önceden bilinen bir kayıtla bir kez sınanır | 2026-08-04 |
| L-19 | L-17'nin ayraç düzeltmesi yetmedi: `?id=` **hiç verilmezse** detay ekranı boş durumu (ya da sessizce ilk kaydı) basıyor, araç yine "TEMİZ" diyordu | Tarama hedefi **veriden türetilir ve kayıtla doğrulanır** (`rec.js` → `qa-targets.json`). Her tarama raporunda **taranan ekran** ve **gerçekten yüklenen kayıt** sayısı ayrı yazılır; sıfır kayıtla taranan ekran hata sayılır, geçiş sayılmaz | 2026-08-04 |
| L-20 | On üç ajan aynı anda açıldı; sekizi `response stalled mid-stream` ile düştü ve **sekizinin sekizi de diske tek satır yazmadı** — kesinti tam olarak `Write` çağrısından ÖNCE oldu | (a) Stall ile düşen ajandan **çıktı beklenmez**, yarım dosya aranmaz. L-06'nın "failed dese de dosya çoğu zaman bütündür" okuması **yalnız token limiti** kaynaklı düşüşler için geçerlidir, API stall'ı için değil. (b) Dalga genişliği stall riskini **doğrudan** artırır: tavan **dört ajan**. Beşincisi açılmaz, dalga bitmeden yenisi başlamaz | 2026-08-05 |
| L-24 | `act.js` hedef listesini iki kez yanlış kaynaktan aldı (`__dirname` → repo yolu; sonra HTTP kökü → `index.html`). İkisinde de **hata vermedi**, sessizce 62 ekran tarayıp "TEMİZ" dedi. Ayrıca aynı araç `GV.drawer`'ı panel saymadı ve 16 aksiyonu yanlışlıkla "ölü" gösterdi | Hedef listesi üretimi **tek ortak yardımcıda** yapılır (`qa-lib.allScreens()` → `shell.js` BUILT), boş dönerse **hata fırlatır**. Hiçbir script kendi listesini kurmaz, kendi repo yolunu sabitlemez. Yeni tarama aracı, **sonucu önceden bilinen** en az bir olumlu ve bir olumsuz vakayla sınanmadan koşturulmaz | 2026-08-05 |
| L-27 | `xport.js` yaması `ui.js`'in dönüş bloğuna iki METİN çapasıyla bağlanmıştı. UID-07 çözümü aynı bloğa `exportRows` ekleyince ikinci çapa tutmadı; script **hata vermeden** 141 ekran tarayıp **"0 kolon — TEMİZ"** dedi | **Bir tarama aracı kendi ölçüm düzeneğini kuramadığında DURUR.** Yama/çapa/hedef üretimi başarısızsa `throw`; sıfır ölçüm sonucu "temiz" değil **GEÇERSİZ** raporlanır (`exit 2`). Metin çapası kırılgandır — bloğun tamamını yakalayan bir kalıp (regex) kullanılır ki üye eklendikçe kaymasın. L-24'ün üçüncü tekrarı: **araç sessizce yanlış yere bakabilir** | 2026-08-05 |
| L-26 | `act.js` UID-30'u **28 aksiyon / 21 ekran** diye ölçmüştü; aracın kendisi dört yerde yanılıyordu (çıktı modalını onay modalı sanma · girdi soran modalı kendi onaylama · görünmeyen butona tıklama · satır aksiyonunu yalnız ilk satırda deneme). Düzeltilince gerçek sayı **10 yalan / 5 ekran**, ⚫ ölü **0** çıktı | **Ölçüm aracı borcu eksik de sayabilir, fazla da** (L-25'in tersi). Yeni bir hüküm eklenirken sorulacak soru: *"bu hüküm hangi sağlıklı davranışı ihlal gösterir?"* Araç bir aksiyonu ihlal sayarken **ölçemediği** bir yol varsa (ikinci adım, ön koşul, görünmezlik) onu **ayrı sayaçta** raporlar — sessizce ne yeşile ne kırmıza yazar. Ayrıca **ihlal maskelenemez**: bir satırda yalan söyleyen aksiyon başka satırda dürüst davranınca temiz sayılmaz | 2026-08-05 |
| L-25 | `ui-debt.md` UID-27'yi **79 aksiyon / 47 ekran** diye kaydetmişti; ölçüm ekseni kurulunca gerçek sayı **129 / 65** çıktı. Kayıt yalnız `bulk[]`e bakmıştı (satır aksiyonları ve kaydet düğmeleri kapsam dışı) ve statik regex iç içe nesneleri yanlış ayrıştırıyordu | **Ölçüm ekseni olmadan yazılan borç kaydı borcu EKSİK sayar.** Borç defterine sayı yazılırken sayının **nasıl ölçüldüğü** de yazılır; statik `grep`/regex ile sayılan bir borç "tahmin" olarak işaretlenir, çalışma zamanı ölçümü gelince **güncellenir**. Eksik sayılan borç, kapatma planını da eksik boyutlandırır | 2026-08-05 |
| L-21 | `components.md` beş oturum boyunca kodda karşılığı olmayan **sekiz `GV.*` adı** taşıdı; ekranlar sözlüğe güvenip var olmayan API'yi çağırmaya çalışabilirdi. Düzeltirken **ben de** eksik ölçtüm: yalnız `ui.js` + `shell.js` taradım, `GV.dashboard`'ı (`dashboard.js`) kaçırdım | Bir API sözlüğe yazılmadan önce adı kodda **görülmüş** olmalı; planlanan ama yazılmamış bileşen sözlüğe değil `ui-debt.md`'ye yazılır. Yüzey taranırken **`assets/js/` altındaki TÜM dosyalar** taranır, iki dosya varsayılmaz | 2026-08-05 |
| L-22 | `DB.tasks[].destek` alanı şemada **vardı** ve VB-05 "bağ yazıldı, kapandı" diye kapatılmıştı; ölçüldüğünde **0/25 kayıtta dolu** çıktı. `canon.js` bunu görmedi çünkü eksen "bağ verilen kod gerçekten var mı" diye soruyor, "bağ **verilmiş mi**" diye sormuyor — boş alan her zaman geçer | **Alan açmak bağ yazmak değildir** (L-13'ün bir adım ilerisi). Bir bağ maddesi kapatılırken alanın **kaç kayıtta dolu olduğu** yazılır; tarama eksenine "her bağ için en az bir kayıt gerçekten bağ taşır" kontrolü eklenir. Kapanmış madde ölçümle **geri açılabilir** | 2026-08-05 |
| L-23 | `GV.list` `run`'ı olmayan toplu işlemde **yeşil "N kayıt işlendi" başarı mesajı** basıyordu; 79 aksiyon / 47 ekran beş oturum boyunca sahte çalıştı. Hiçbir tarama yakalamadı: konsol temiz, `href` yok, mutasyon olmadığı için `mut.js` de temiz | Ortak bileşen, çağıranın **vermediği** bir yordamın yerine **başarı** varsayamaz. Eksik sözleşmede bileşen ya hiç basmaz ya da açıkça eksik olduğunu söyler — asla "oldu" demez. Genel: **bir hata sınıfı bulunduğunda taramaya ekseni eklenmeden madde kapatılmaz** | 2026-08-05 |
| L-28 | Beş borç kaydının beşi de kendi kapsamını **yanlış** ölçmüştü: UID-16 "5 önek" dedi, gerçek **22**; UID-17 "9 ekran" dedi, gerçek **60**; VB-04 "111 kullanım" dedi, gerçek **145**; VB-12 "2 alan" dedi, gerçek **3**; VB-28 "3 bağ yok" dedi, ikisi **ters yönde zaten vardı** | **Borç kaydındaki sayı TAHMİNDİR, kapatmadan önce yeniden ölçülür.** Dört sapmanın dördü aynı yönde (eksik) çıktı — statik okuma borcu küçük gösterir. VB-28 altıncı hatayı ekledi: bir bağ "yok" denmeden önce **iki yönde de** aranır, çünkü bağ hedefte değil KAYNAK kayıtta olabilir | 2026-08-06 |
| L-30 | Revize turunun ölçümüne `docs/G-veri-modeli.md` ile başlandı; doküman `projects n=8` · `tasks n=25` · `activities n=8` diyordu, **gerçek** sayılar 14 · 26 · 192'ydi. Doküman tek commit'te (`0c06702`) yazılmış, sonra veri büyümüştü ve **hiç güncellenmemişti** | **Üretilen doküman, ürettiği andan itibaren bayattır.** Ölçüm kaynağı **canlı veridir**; doküman yalnız yön gösterir. Bir dokümana sayı yazılıyorsa yanına **hangi commit'te ölçüldüğü** yazılır, yoksa okuyan onu bugünkü sanır. Bu, L-28'in ("borç kaydındaki sayı tahmindir") doküman tarafındaki ikizidir | 2026-08-07 |
| L-31 | `DB.taskTransitions['Kontrol bekliyor'].zorunlu = ['ciktiLink']` beş oturum boyunca yazılıydı. **Hiçbir görev kaydında `ciktiLink` diye bir alan yoktu** — yani kural hiç uygulanamadı. Kimse fark etmedi çünkü kuralı uygulayan bir yordam da yoktu: ekran zorunlu alanları yalnız **ipucu metni** olarak basıyordu | **Uygulanmayan kural, yanlış kuralın en sinsi hâlidir** — hata vermez, doğru görünür, ölçüme takılmaz. Bir kural veriye yazılırken (a) onu **uygulayan** bir yordam ve (b) kuralın kendi tutarlılığını sınayan bir **tarama ekseni** aynı turda yazılır. Alan adına atıf yapan her kural için "bu ad gerçek bir alan mı" sorusu ekseneleştirilir (`canon.js` eksen 25c). L-23'ün ikizi: bileşen "oldu" diyemez, veri de "kural var" diyemez | 2026-08-07 |
| L-32 | `GV.task` yazıldı, yedi ekrana bağlandı — sonra ajan fark etti ki **`domain.js` o ekranların hiçbirinde yüklü değildi**. `GV.task` `undefined` olurdu ve hata **tıklama anında** çıkardı, sayfa açılışında değil | **L-12'nin `GV.*` tarafındaki ikizi.** Ekranın okuduğu her `DB.<koleksiyon>` gibi, ekranın çağırdığı her `GV.<domain yordamı>` için de o dosya sayfada **yüklü olmalı**. Açılışa bakan QA bunu göremez — bağlanma anı ile çağrılma anı farklıdır. Denetim tek satır: `for f in app-*.html; do grep -q "GV\.\(fin\|delivery\|task\)\.[a-z]" $f && ! grep -q domain.js $f && echo $f; done`. Ortak katmana yeni yordam eklenince bu denetim koşulur | 2026-08-07 |
| L-33 | Görev sözlüğünden `Revize bekliyor` silinince `GV.badge` ton haritasından da silindi. Ama **haftalık timesheet reddedildiğinde** aynı değere düşüyordu (`app-zaman-onay.html`) ve o rozet sessizce **griye** indi — hata vermedi, yalnız yanlış göründü | **`TONE` haritası modüller arası DÜZ bir isim alanıdır.** Bir değeri silmeden önce o adı kullanan **her koleksiyon** aranır (`grep "'<değer>'" assets/data/*.js`), yalnız silinen eksen değil. Aynı ad iki eksende yaşayabilir; silmek birini kırar. `Taslak` · `Planlandı` · `Müşteri bekleniyor` tam bu yüzden görev sözlüğünden çıkarken haritada **kaldı** | 2026-08-07 |
| L-13 | Bir fatura yanlış milestone'a bağlıydı: iki fatura tek milestone'a düşüyor, tamamlanmış bir milestone faturasız görünüyordu. Ayrıca `odeme` alanı kimi kayıtta net kimi kayıtta brüt tutardı | Bir kaydı başka bir kayda bağlayan alan **tekil** olmalıysa bunu tarama script'i doğrular. Para alanlarında net/brüt ayrımı koleksiyonun başında **yazılı** olur; iki farklı konvansiyon aynı alanda yaşayamaz | 2026-08-04 |

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

## L-12 · Yüklenmeyen veri dosyasından okuma etkileşimde patlar
**Olay:** `app-destek.html` gelişmiş filtre tanımında `options:DB.priorities` kullanıyordu ama
sayfa `assets/data/work.js`'i yüklemiyordu. `DB.priorities` `undefined` olduğu için
"Gelişmiş Filtre" butonuna basılınca `Cannot read properties of undefined (reading 'map')`
fırlıyor ve drawer hiç açılmıyordu. Ekran aylardır yayındaydı.
**Kök neden:** Hata **sayfa açılışında değil, kullanıcı etkileşiminde** oluşuyor. `qa.js`
sayfayı açıp konsolu dinliyor; hiçbir butona basmadığı için bu sınıfı göremiyor.
**Tarama sonucu:** Aynı hata 5 ekranda vardı — `app-destek`, `app-satinalma`, `app-pipeline`,
`app-ayar-yetki`, `app-destek-sla`.
**Kural:** (a) Ekran hangi `DB.<koleksiyon>`'u okuyorsa o koleksiyonun tanımlı olduğu veri
dosyası `<script>` ile yüklenir. (b) Bu, ekranın markup'ından statik olarak taranabilir ve
her wave sonunda taranır (`scratchpad/dbref.js` — koleksiyon → dosya sahipliğini
`assets/data/*.js`'ten çıkarır, her ekranın yüklediğiyle karşılaştırır).
(c) Daha genel ders: **açılış QA'si yeterli değil.** Bir ekranın gelişmiş filtresi, satır
aksiyonu, toplu işlemi ve modalı en az bir kez tetiklenmeden "temiz" denmez.

## L-13 · Bağlantı alanı tekilse taranır, para alanı net mi brüt mü yazılır
**Olay:** `DB.invoices[].milestone` ile ödeme planı zinciri kurulurken iki fatura
(`FTR-2026-024` ve `FTR-2026-025`) aynı `MS-002`'ye bağlı çıktı. FTR-024'ün tarihi ve
tutarı aslında `MS-001`e aitti; sonuç olarak tamamlanmış bir milestone "faturası kesilmemiş"
görünüyordu — ekranda gerçek bir finans riski gibi okunacaktı.
İkinci hata: `DB.milestones[].odeme` beş kayıtta faturanın **brüt** (KDV dahil), dört kayıtta
**net** tutarıydı. Aynı alanda iki konvansiyon.
**Kural:** (a) Bir kaydı diğerine bağlayan alan mantıken tekilse (bir milestone = bir fatura)
bu **tarama script'inde doğrulanır**, yorumda "tekil olmalı" demek yetmez.
(b) Para alanının net mi brüt mü olduğu koleksiyonun başındaki yorumda **yazılı** olur;
yazılı değilse ilk yeni ekran iki farklı yorumla iki farklı sayı gösterir.
(c) Bu çelişkiyi bulan şey yine yeni bir ekranın eski veriyi sorgulamasıydı — L-08 tekrar
doğrulandı: **ekran değil veri düzeltilir.**

## L-14 · Etiket escape kararı ekran başına verilirse er geç ham HTML basılır
**Olay:** Her detay ekranı kendi `dl(pairs)` yardımcısını yazıyor ve `dt` metnini escape
edip etmemeye ayrı karar veriyor. `app-teklif-detay.html` escape ediyordu; para ekseni işareti
`<span class="u-faint">(KDV hariç)</span>` ekranda **ham metin olarak** göründü — beş para
etiketinin hepsinde. Ekran canlıya çıkmıştı.
**Neden yakalanmadı:** Konsol hatası yok, yatay taşma yok, `href="#"` yok — sayfa teknik olarak
sağlam. `qa.js` bu sınıfı **göremez**; hata yalnız *okunan metinde* var.
**Kural:** (a) Bir bileşen hem sabit işaretleme hem veri taşıyorsa, hangi tarafın escape
edildiği **bileşende** kararlaştırılır, ekranda değil — `dd`/değer tarafı escape'li, `dt`/etiket
tarafı sayfada yazılı sabit. (b) Bu sınıf statik okumayla değil **render sonrası metinde**
taranır: `tasks/qa/esc.js` etiket düğümlerinin `textContent`'inde HTML etiketi arar, her wave
sonunda koşulur. (c) Daha genel: **"konsol temiz" ile "ekran doğru" aynı şey değildir.**

## L-15 · Mock veri bellekte durduğu için sayfa yeniden yükleme mutasyonu siler
**Olay:** Veriyi değiştiren aksiyonlar (`Onayla` · `Ödendi işaretle` · `Görev ata` ·
`Bakım kaydı ekle` · `Aşama değiştir` · `Zaman kaydı ekle` · `Revize iste` ·
`İletişim kaydı ekle`) işi bitirince `setTimeout(location.reload, 700)` çağırıyordu.
Veri `assets/data/*.js` içinde **bellekte** tutuluyor; sayfa yeniden yüklenince o
script'ler baştan koşuyor ve **yapılan değişiklik siliniyor**. Kullanıcı toast'ı
görüyor, sonra ekran hiçbir şey olmamış gibi eski hâline dönüyor.
**Ölçüm:** `app-satinalma-detay.html` `SAT-2026-014` — onay öncesi `Onay bekliyor
adim:2`, onay + reload sonrası yine `Onay bekliyor adim:2`. `GV.refresh()` ile
`Sipariş verildi adim:3`.
**Yayılma:** Hata **kalıp ekranlarda** doğmuştu (`app-gorev-detay` 4 çağrı ·
`app-musteri-detay` 1 · `app-lead-detay` 2) ve onları örnek alan altı yeni detay
ekranına aynen kopyalandı — toplam **dokuz ekran, on beş çağrı**.
**Kural:** (a) Mock veriyi değiştiren hiçbir aksiyon `location.reload()` ile
bitmez; **`GV.refresh()`** ile biter (shell.js — `gv:ready`'yi yeniden tetikler,
ekran kendini güncel veriyle baştan kurar). (b) Bunun çalışması için sayfa kurulum
kodu **idempotent** olmalı: `GV.pageHead` artık kendi bastığı `.gv-page-head`
bloğunu da değiştirebiliyor (önceden yalnız `#gvPageHead` yer tutucusunu arıyordu ve
ikinci çağrıda sessizce hiçbir şey yapmıyordu). (c) `location.reload()` yalnız
**mutasyon içermeyen** yerlerde doğrudur — hata durumundaki "Tekrar dene" butonu
(`app-panel-yonetici.html`, `dashboard.js`) bilinçli istisnadır.
(d) Regresyon testi: `tasks/qa/mut.js` her ekranda `GV.refresh()`'i iki kez
tetikleyip başlığın/`.gv-app`'in çoğalmadığını ve içeriğin boşalmadığını ölçer.
(e) Daha genel: **toast "işlem oldu" demez.** Mutasyonun kalıcı olduğu ölçülerek
doğrulanır — L-14'ün "konsol temiz ≠ ekran doğru" kuralının veri tarafındaki ikizi.

## L-16 · Yerinde yeniden çizim, kalıcı düğümdeki dinleyicileri biriktirir
**Olay:** L-15'in çözümü (`GV.refresh()` = `gv:ready`'yi yeniden tetikle) yeni bir hata
doğurdu: ekranlar `mount.addEventListener('click', …)` veya
`document.addEventListener('click', …)` ile **delege** dinleyici bağlıyor. Bu düğümler
yeniden çizimde ölmediği için her tazelemede bir dinleyici daha birikiyordu.
**Ölçüm:** üç tazeleme sonrası tek tıklamada **3 modal** açıldı.
**Kural:** (a) `GV.refresh()` mount düğümünü (`#rec`) **taze bir kopyayla değiştirir** —
mount'a bağlı dinleyiciler böyle düşer, ekranın hiçbir şey yapması gerekmez.
(b) `document` / `window` gibi **değiştirilemeyen** düğüme bağlanan dinleyici
`GV.on(el, type, fn, key)` ile bağlanır; aynı `key` ikinci kez gelince önceki sökülür.
Aynı düğümde birden çok dinleyici varsa **her birine ayrı `key`** verilir, yoksa
birbirlerini söker (üç siteli `app-gorev-detay.html`'de bu tuzağa düşüldü ve düzeltildi).
(c) Ölçüm **net** dinleyici üzerinden yapılır: `addEventListener` çağrısını saymak
yanıltır, çünkü `GV.on` her turda önce söküp sonra bağlar. `tasks/qa/listen.js`
add − remove farkını sayar; 20 detay ekranında sabit kalması doğrulandı.
(d) Genel ders: **bir hatanın çözümü yeni bir hata sınıfı açabilir.** L-15'i kapatan
değişiklik ölçülmeden "tamam" denmedi — ölçüm bu ikinci hatayı ortaya çıkardı.


## L-17 · QA script'i hedefe kendi parametresini eklerken var olan sorguyu bozabilir
**Olay:** Beş QA script'i (`tabs.js` · `esc.js` · `mut.js` · `listen.js` · `gate.js`) hedef
adresi `BASE + f + '?role=' + role` diye kuruyordu. Detay ekranları `app-x-detay.html?id=KOD`
biçiminde çağrıldığı için adres `?id=KOD?role=sahip` oluyordu: ikinci `?` ayraç sayılmaz,
`id` parametresinin **değeri** `KOD?role=sahip` olarak okunuyordu. Kayıt bulunamıyor, sayfa
"kayıt yok" durumunu basıyor ve script bunu **temiz** sayıyordu.
**Ölçüm:** `app-destek-detay.html?id=DST-2026-118` düzeltmeden önce **2 sekme**, düzeltmeden
sonra **6 sekme** raporladı. Yani 25 detay ekranının sekme, escape, mutasyon ve dinleyici
testlerinin bir bölümü aslında **boş durum ekranını** ölçmüştü.
**Neden fark edilmedi:** Script hata vermiyordu — "TEMİZ" yazıyordu. 5. oturumun handoff
kaydındaki "25 detay ekranının hepsi tabs.js'ten geçti" cümlesi bu yüzden yanıltıcıydı.
**Kural:** (a) Bir araç hedef adrese parametre ekliyorsa ayracı **duruma göre** seçer:
`f.indexOf('?') === -1 ? '?' : '&'`. (b) Daha genel ve önemlisi: **bir test aracının "temiz"
demesi, doğru şeyi ölçtüğü anlamına gelmez.** Araç en az bir kez, sonucu **önceden bilinen**
bir kayıtla sınanır — "6 sekme görmeliyim, 6 gördüm mü?" Bu, L-14 ("konsol temiz ≠ ekran
doğru") ve L-15 ("toast çıktı ≠ işlem oldu") kuralının **araç tarafındaki üçüncü ikizidir**:
ölçüm aracının kendisi de ölçülmeden güvenilmez.

## L-18 · Yeniden çizim, `.page-main` dışındaki overlay'i kapatmazsa iki kat bozar
**Olay:** `app-panel-duyurular.html`'e `?id=` derin bağlantısı eklendi; sayfa açılışta duyuruyu
sağ panelde açıyor. `listen.js` ölçtü: her `GV.refresh()` sonrası `document` üzerindeki net
dinleyici **7 → 10** çıkıyordu.
**Kök neden:** `GV.modal` ve `GV.drawer` markup'ı — kural gereği — `.page-main` **dışına**
basılır (stacking context). `GV.refresh()` yalnız `#rec` mount düğümünü tazeliyordu, açık
overlay ise yerinde kalıyordu. Panel `close()` çağrılmadığı için `document`'e bağladığı
Escape/Tab dinleyicisi de sökülmüyordu; her tazeleme bir panel daha açıyordu.
**İki ayrı zarar:** (a) dinleyici birikmesi (L-16'nın overlay tarafındaki ikizi),
(b) daha sinsisi — panelde **eski veriyle çizilmiş** içerik ekranda kalıyor; kullanıcı mutasyon
işlemedi sanıyor. Bu, L-15'in ("toast çıktı ≠ işlem oldu") görünen ikizidir.
**Kural:** (a) `GV.refresh()` açık `.gv-scrim` / `.gv-drawer` düğümlerini kapatır.
(b) Overlay üreten her bileşen kapatıcısını düğüme asar (`el.__gvClose`) — dışarıdan
kapatılabilmesi bileşenin sözleşmesinin parçasıdır, çağıranın elindeki referansa bırakılmaz.
(c) Genel ders: **"mount'u tazeledim" ile "ekran tazelendi" aynı şey değildir.** Mount dışına
basan her şey (modal, drawer, toast, tooltip) yeniden çizim planına ayrıca yazılır.

## L-19 · Tarama hedefi kayıtla doğrulanmadan tarama geçerli sayılmaz
**Olay:** L-17'de beş script'in ayraç hatası düzeltildi (`?id=KOD?role=` → `&role=`).
Ama asıl boşluk kapanmamıştı: `tabs.js` / `esc.js` / `mut.js` / `listen.js` hedefe
**hiç `?id=` verilmeden** çağrılabiliyordu. O zaman detay ekranı ya "kayıt bulunamadı"
boş durumunu basıyor, ya da (`app-demirbas-detay` gibi ekranlarda) sessizce
`DB.<koleksiyon>[0]`'a düşüyordu. İki durumda da araç "TEMİZ" diyordu.
**Ölçüm (7. oturum, düzeltilmiş harness):** 26 detay ekranı gerçek kayıt koduyla tarandı —
`tabs.js` **223 sekme tıklaması**, 26/26 kayıt yüklendi. `mut.js` ve `listen.js` 29 hedefte
(26 detay + 3 form) 29/29 kayıt yükledi. `esc.js` 108 ekranın tamamını taradı, detay ve form
hedefleri `?id=` ile açıldı.
**Kural:** (a) Tarama hedefi elle yazılmaz — `rec.js` hedefi **veriden türetir**, kaydın
gerçekten yüklendiğini ölçer (`.gv-rec-code` metni = kod · formda başlık + dolu alan sayısı)
ve `qa-targets.json`'a yazar. (b) Her tarama raporu iki sayı verir: **taranan ekran** ve
**gerçekten yüklenen kayıt**. Sıfır kayıtla taranan ekran hata sayılır. (c) L-17'nin genel
dersinin bir adım ilerisi: aracın doğru adresi kurması yetmez, **doğru kaydı yüklediği de
ölçülür** — yoksa yeşil, ekranın değil boş durumun yeşilidir.


## L-20 · Stall ile düşen ajan dosya yazmaz — dalga tavanı dört
**Olay:** 8. oturumda hız için **on üç ajan aynı anda** açıldı (altı form + yedi doküman).
Beşi tamamlandı, **sekizi `API Error: Response stalled mid-stream` ile düştü.** Düşenlerin
son mesajı istisnasız aynıydı: *"Now I have everything I need. Writing the file."* —
yani kesinti **`Write` çağrısının hemen öncesinde** gerçekleşti.

**Ölçüm:** sekiz dosyanın sekizi de diskte **yok** (`ls` ile tek tek doğrulandı):
`app-arac-sigorta-form` · `app-arac-yakit-form` · `app-arac-gider-form` · `app-arac-kaza-form` ·
`app-destek-paket-form` · `app-performans-form` · `docs/G-veri-modeli.md` · `docs/J-otomasyonlar.md`.
Yani ~8 ajanlık okuma ve analiz işi **tamamen** boşa gitti; kurtarılacak yarım dosya yoktu.

**Kural:**
(a) **Stall ile düşen ajandan çıktı beklenmez.** L-06'nın "ajan failed dese de dosya çoğu zaman
diskte bütündür" okuması **yalnız token limiti / bağlam taşması** kaynaklı düşüşler için
geçerlidir. API stall'ında ajan genellikle **üretim anında** kesilir ve hiçbir şey yazmaz.
Yine de envanter **ölçülerek** yapılır (`ls` + satır sayısı + kapanış etiketi), varsayımla değil.
(b) **Dalga tavanı dört ajandır.** Genişlik stall olasılığını doğrudan artırıyor: üçerli
dalgalarda 24 ajanın 24'ü tamamlandı, on üçlü tek dalgada 13'ün 8'i düştü. Beşinci ajan
açılmaz, **dalga bitmeden yeni dalga başlatılmaz**.
(c) Bu bir hız–dayanıklılık takasıdır ve dayanıklılık kazanır: düşen ajanın maliyeti yalnız
kendi token'ı değil, **yeniden üretim için ikinci kez ödenen** token'dır.


## L-21 · API sözlüğü koddan doğrulanır, iki dosya varsayılmaz
**Olay:** `components.md` §6 `GV.cols` · `GV.filters` · `GV.export` · `GV.bulk` ·
`GV.dateRange` · `GV.help` · `GV.kanban` · `GV.notify` adlarını **çağrılabilir bileşen**
olarak listeliyordu. Kod tarandı: sekizinin sekizi de yok. Beşinin işlevi `GV.list`
kapanışının **içinde** yaşıyor (`openCols` · `openFilters` · `doExport` · `renderBulk` ·
`renderKanban`), üçünün kodda hiçbir karşılığı yok. `GV.detail`/`GV.gantt` ile aynı sınıf —
sözlük, **yapılmak istenen**i yapılmış gibi yazmıştı.
**İkinci hata (kendi ölçümümde):** düzeltirken "37 üye" yazdım çünkü yalnız `ui.js` ve
`shell.js` taradım. `GV.dashboard` **`assets/js/dashboard.js`**'te tanımlı ve
`app-panel.html` tarafından çağrılıyor. Gerçek sayı **38**.
**Kural:** (a) Sözlüğe bir API satırı yazmadan önce adı `assets/js/` altında **görülmüş**
olmalı. (b) Yüzey taranırken **dizindeki tüm dosyalar** taranır — "ortak katman = ui.js +
shell.js" varsayımı yanlıştır. (c) Planlanan ama yazılmamış bileşen sözlüğe değil
`ui-debt.md`'ye yazılır; sözlük **bugünü** anlatır, niyeti değil.

## L-22 · Alan açmak bağ yazmak değildir
**Olay:** VB-05 "destek → görev / hata / değişiklik dönüşümü **yazılı**, kapandı" diye
kapatılmıştı ve `plan.md` maddeyi `[x]` sayıyordu. 9. oturumda ölçüldü:
`DB.tasks[].destek` **0/25** · `DB.changeRequests[].destek` **0/4** · yalnız
`DB.bugs[].destek` 2/6 dolu. Yani üç eksenden ikisinde **alan var, değer yok**.
**Neden görünmedi:** `canon.js` eksen 15 "bağ verilen kod gerçekten var mı" diye soruyor.
Boş alanda kontrol edilecek değer olmadığı için **her zaman geçiyor** — sahte yeşil.
**Kural:** (a) Bir bağ maddesi kapatılırken alanın **kaç kayıtta dolu olduğu** ölçülüp
yazılır; "alan açıldı" cümlesi kapanış gerekçesi sayılmaz. (b) Tarama eksenine
"§22'nin her bağı için **en az bir kayıt gerçekten bağ taşır**" kontrolü eklenir.
(c) **Kapanmış madde ölçümle geri açılabilir** — defterdeki `✅` dokunulmaz değildir.
Bu L-13'ün ("bağ yazılır, türetilmez") bir adım ilerisidir: bağ yazılmalı **ve dolu olmalı**.

## L-23 · Bileşen, çağıranın vermediği yordamın yerine başarı varsayamaz
**Olay:** `assets/js/ui.js` toplu işlem yönlendiricisi şöyleydi:
```js
if(act.run) act.run(state.selected.slice());
else GV.toast(act.label + ' — ' + state.selected.length + ' kayıt işlendi', 'ok');
```
`run` verilmemişse bileşen **yeşil ton (`'ok'`) ile "N kayıt işlendi"** diyor, seçimi
temizliyor ve listeyi yeniden çiziyor — yani ekran da "bir şey oldu" gibi davranıyor.
Veri değişmiyor. **Ölçüm: 79 aksiyon, 47 ekran.** Bir kısmı `confirm` de gösteriyor:
kullanıcı "12 kaydı arşivlemek istediğinize emin misiniz?" onayını veriyor, başarı
mesajını alıyor, **hiçbir kayıt arşivlenmiyor**.
**Neden beş oturum yakalanmadı:** `qa.js` konsola bakıyor (hata yok) · `links.js` `href`'e
bakıyor (buton `href` taşımıyor) · `mut.js` `GV.refresh()` sonrası çoğalma arıyor
(mutasyon hiç olmadığı için temiz) · `esc.js` metin arıyor. **Hiçbir eksen "buton
gerçekten bir şey yapıyor mu" diye sormuyordu.**
**Kural:** (a) Ortak bileşen, çağıranın **vermediği** bir yordamın yerine **başarı**
varsayamaz. Eksik sözleşmede bileşen ya hiç basmaz ya da eksikliği açıkça söyler —
asla "oldu" demez. (b) Yedek (fallback) davranış yazarken sorulacak soru: *"bu yedek,
kullanıcıya olmayan bir şeyi olmuş gibi gösterir mi?"* (c) Genel ve en önemlisi:
**bir hata sınıfı bulunduğunda taramaya ekseni eklenmeden madde kapatılmaz** —
UID-27, VB-19 ve VB-28'in üçü de ekseni olmadığı için görünmedi.


## L-24 · Hedef listesi tek ortak yardımcıdan gelir
**Olay:** `act.js` iki kez yanlış kaynaktan hedef aldı. Önce `__dirname`'den repo yolu
türetti — script `scratchpad/qa-run/` içinden koşuyor, yol tutmadı, liste boş kaldı.
Sonra HTTP kökünü dizin listesi sandı — repoda `index.html` var, sunucu giriş ekranını
verdi. **İkisinde de araç hata vermedi**, sessizce 62 ekran tarayıp "TEMİZ" dedi;
oysa gerçek kapsam 141. Aynı araç ayrıca `GV.drawer`'ı (scrim basmadan açılıyor) panel
saymadı ve **16 aksiyonu yanlışlıkla "ölü"** gösterdi; `passConfirm` de herhangi bir
`[data-act="1"]`'e basıp drawer'ları kapatıyordu.
**Kök neden:** Dört script (`dbref` · `esc` · `gate` · `links`) repo yolunu **ayrı ayrı**
sabitlemişti; beşincisi kendi yolunu uydurdu. Kopya sayısı kadar sessizce yanlış yere
bakma riski vardı.
**Kural:** (a) Hedef listesi üretimi **yalnız `qa-lib.js`**'te yapılır
(`repoRoot()` · `allScreens()` → `shell.js` BUILT); boş dönerse **hata fırlatır**,
kısa liste döndürmez. (b) Hiçbir script kendi listesini kurmaz, kendi ROOT'unu yazmaz —
tek istisna `links.js`, çünkü işi zaten BUILT ile diski **karşılaştırmaktır**.
(c) Yeni bir tarama aracı, **sonucu önceden bilinen** en az bir olumlu (gerçekten
mutasyon yapan) ve bir olumsuz (yapmayan) vakayla sınanmadan tam koşuya sokulmaz.
Bu L-17'nin ("araç TEMİZ dedi ≠ doğru şeyi ölçtü") üçüncü ve dördüncü tekrarıdır.

## L-25 · Ölçüm ekseni olmadan yazılan borç kaydı borcu EKSİK sayar
**Olay:** `ui-debt.md` UID-27'yi **"79 aksiyon / 47 ekran"** diye kaydetmişti. Sayı
statik bir `grep`/regex ile çıkarılmıştı. `act.js` ekseni kurulunca gerçek sayı
**129 aksiyon / 65 ekran** çıktı — %63 daha fazla.
**İki ayrı eksiklik:** (a) kayıt yalnız `bulk[]`e bakıyordu; `rowActions[]` (26 ölü +
7 yalan) ve form kaydet düğmeleri hiç sayılmamıştı. (b) statik regex iç içe nesneleri
yanlış ayrıştırıyordu — `app-fatura.html`'de 2 saydı, çalışma zamanında 3 çıktı.
**Kural:** (a) Borç defterine bir sayı yazılırken **nasıl ölçüldüğü** de yazılır.
(b) Statik `grep`/regex ile çıkarılan sayı **"tahmin"** olarak işaretlenir; çalışma
zamanı ölçümü geldiğinde kayıt **güncellenir** ve eski sayı gerekçesiyle saklanır.
(c) Eksik sayılan borç yalnız rapor hatası değildir — **kapatma planını da eksik
boyutlandırır**; UID-27 "tek satırlık düzeltme" sanılıyordu, gerçekte ardında
28 aksiyonluk ikinci bir sınıf (UID-30) vardı.


## L-26 · Ölçüm aracı borcu fazla da sayabilir
**Olay:** UID-30 defterde **28 aksiyon / 21 ekran** yazıyordu; sayı `act.js`'in ilk
koşumundan gelmişti. 10. oturumda araç dört ayrı yerde yanlış hüküm verdiği ölçüldü:
1. **Çıktı modalını onay modalı sandı.** `GV.confirm` `is-sm` + iki aksiyondur; UID-07'nin
   çıktı modalı da öyle — ama **girdi sorar**. Araç "Çıktı Al"a basıyor, dosya iniyor,
   veri değişmiyor, toast yeşil → 🔴 YALAN. Gerçekte 51 aksiyon dosya üretiyordu.
2. **Girdi soran modalı kendi onayladı.** "km gir", "sorumlu seç", "iade gerekçesi"
   panelleri boş onaylanınca ekran haklı olarak reddediyordu; araç bunu aksiyonun
   suçu saydı. 19 aksiyon.
3. **Görünmeyen butona tıkladı.** Seçilebilir satır yoksa (boş sekme, kanban görünümü)
   toplu işlem barı gizlidir; Playwright tıklaması sessizce düşüyor → ⚫ ÖLÜ. 2 aksiyon.
4. **Satır aksiyonunu yalnız ilk satırda denedi.** İlk satır ön koşulu sağlamıyorsa
   ("bu kayıt zaten onaylı") yordam dürüstçe reddediyor; araç `'info'` tonunu dürüst
   red saymadığı için "ölü" yazıyordu. 13 aksiyon.
**Ölçüm:** düzeltmelerden sonra **10 yalan / 5 ekran**, ⚫ ölü **0**. Borç %180 fazla sayılmıştı.
**Kural:** (a) Yeni bir hüküm yazılırken sorulacak soru: *"bu hüküm hangi **sağlıklı**
davranışı ihlal gösterir?"* — L-24'ün "olumlu ve olumsuz vakayla sına" kuralının
tamamlayıcısı. (b) Araç **ölçemediği** yolu (modalın ikinci adımı, sağlanmayan ön koşul,
görünmeyen buton) sessizce yeşile ya da kırmızıya yazmaz; **ayrı sayaçta** raporlar.
(c) **İhlal maskelenemez:** bir satırda yalan söyleyen aksiyon, başka satırda dürüst
davrandı diye temiz sayılmaz — yalnız "ölü" hükmü daha iyi bir sonuçla gölgelenebilir.
(d) L-25 ile birlikte okunur: **ölçüm ekseni yoksa borç eksik, ölçüm aracı sınanmamışsa
borç fazla sayılır.** İkisinde de sayının **nasıl ölçüldüğü** deftere yazılır.


## L-27 · Ölçüm düzeneğini kuramayan araç susmaz, durur
**Olay:** `xport.js` `ui.js`'i bellekte yamalayıp `GV.list` örneklerini kaydediyordu.
Yama iki metin çapasına dayanıyordu; UID-07 çözümü dönüş bloğuna `exportRows` ekleyince
ikinci çapa tutmadı. Sonuç: `__gvLists` hiç doğmadı, script 141 ekranı gezdi, hiçbir
liste bulamadı ve **"TEMİZ — 0 kolonun tamamı çıktıya değer taşıyor"** yazdı. Kapanış
taramasında fark edildi; "0 kolon" ifadesi olmasa gözden kaçacaktı.
**Kural:** (a) Araç kendi düzeneğini kuramıyorsa **`throw`** eder — sessizce devam etmez.
(b) **Sıfır ölçüm "temiz" değildir**, `GEÇERSİZ` raporlanır ve süreç hata koduyla biter.
(c) Metin çapası yerine bloğun tamamını yakalayan kalıp kullanılır; sözleşme büyüdükçe
çapa kaymaz. (d) L-17 · L-24 · L-26 ile aynı aile: **araç da ölçülür.** Bu kez hatayı
yakalayan şey, raporun içindeki **sayının kendisiydi** — bu yüzden her tarama raporunda
kaç ekran, kaç kayıt, kaç birim ölçüldüğü ayrı ayrı yazılır (L-19).


## L-28 · Borç kaydının kendi kapsamı da ölçülmeden güvenilmez

**Olay:** 11. oturumda kapatılan beş borcun **beşinde de** defterdeki kapsam yanlıştı:

| Borç | Defterde | Ölçülen | Sapma |
|---|---|---|---|
| UID-16 aktivite kod öneki | 5 önek | **22** | 4,4× |
| UID-17 yerel `dl()` | 9 ekran | **60 ekran** | 6,7× |
| VB-04 rename kullanımı | 111 | **145** | 1,3× |
| VB-12 kişi kimliği alanı | 2 alan | **3** (biri 192 kayıt) | — |
| VB-28 eksik §22 bağı | 3 bağ yok | **1** (ikisi ters yönde vardı) | ters yön |

**İlk dördü aynı yönde:** gerçek her seferinde defterdekinden **büyük**. Sebep aynı —
sayı statik bir okumadan (`grep`, göz kararı) geliyordu ve ölçüm ekseni yoktu. Bu,
**L-25'in bir üst katıdır**: L-25 "ölçüm ekseni olmadan yazılan borç kaydı borcu eksik
sayar" diyordu; burada görülen, o eksikliğin **kapatma planını da yanlış boyutlandırdığı**.
UID-17 "dokuz ekranlık iş" sanılıyordu, altmış çıktı.

**Beşincisi ters yönde ve daha öğretici:** VB-28 üç bağın "veride hiç olmadığını"
söylüyordu. İkisi (`leads.musteri` · `messages.gorev`) **vardı** — ama kayıt onları
yalnız **hedef** koleksiyonda aramıştı. Oysa components.md §9d bağı *doğan/kaynak*
kayıtta tutar. Borcun istediği alanlar (`customers.lead` · `tasks.kanal`) tam olarak
§9d'nin **yasakladığı ayna alanlardı**; açılsalardı iki ekran kendi yazdığı bağla
çelişecekti.

**Kural:**
(a) Bir borç kapatılmadan önce **kapsamı yeniden ölçülür**; defterdeki sayı tahmindir
    ve kapanış kaydına *ölçülen* sayı, sapmasıyla birlikte yazılır.
(b) Bir bağ "yok" denmeden önce **iki yönde de** aranır — hedefte yoksa kaynakta olabilir.
(c) Sapma tek yönlü çıkıyorsa (hep eksik) bu bir örüntüdür, tek tek hata değil:
    statik okumayla sayılan her borç aynı riski taşır.

## L-29 · Ölçüm aracı üç ayrı şekilde kendi hatasını gösterdi

Aynı oturumda üç kez ölçüm aracı yanıldı ve üçü de farklı sınıftı:

1. **Yanlış yerden okuma:** `pers.js` `innerText` kullanıyordu; sekmelerin tamamı
   tıklandıktan sonra yalnız son panel görünür kaldığı için **ekranda gerçekten var
   olan bir adı "yok"** gösterdi. Düzeltme: gövde klonlanıp `<script>` düğümleri
   atılarak `textContent` okunuyor.
2. **Fazla katı hüküm:** aynı script "kod sayfada hiç geçmesin" diyordu; oysa bu
   projede her kayıt kendi kodunu `.cell-sub` / `.cell-code` ile **ikincil etiket**
   olarak gösterir. İki meşru gösterim ihlal sayıldı. Kural **birincil ad konumuna**
   daraltıldı (`.cell-main` · `.gv-tl-who` · sınıfsız `td`/`dd`).
3. **Tarayıcı davranışını yanlış modelleme:** kapsam denetimi **8.188 odaksız öğe**
   raporladı. Programatik `.focus()` `:focus-visible`'ı tetiklemez; ihlallerin tamamı
   sahteydi, odak halkası `shell.css`'te global tanımlıydı.

**Kural:** L-26'nın "araç sınanmadan güvenilmez" kuralı yalnız *hüküm mantığı* için
değil, **okuma yöntemi** ve **tarayıcı davranışı** için de geçerlidir. Yeni bir araç
üç soruyu birden geçmelidir: *doğru yerden mi okuyor · hüküm sağlıklı davranışı ihlal
sayıyor mu · ölçtüğü şey tarayıcıda gerçekten öyle mi çalışıyor.*
