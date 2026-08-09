# brief-p2-form-gocu.md — Form Göçü Sözleşmesi (P2-01 · P2-02)

> **Bu dosya, form göçü yapan ajanın ilk ve tek okuduğu sözleşmedir.**
> Ortak katmanı (`assets/js/ui.js`, `shell.js`, `components.md`) **KEŞFETME** —
> ihtiyacın olan API'nin tamamı burada yazılı. Geçen turda ortak katmanı tek tek
> okuyan ajanlar başına ~300k token gitti ve hiçbiri buradakinden fazlasını
> bulmadı.
> Formun kendi dosyasını elbette baştan sona okursun; göç ettiğin şey odur.
> Taban kurallar (iskelet, yetki kapısı, kod üretimi, escape, dinleyici):
> `tasks/form-brief.md`. Çelişki olursa **bu dosya** üstündür.

---

## 0. Görevin — tek dosya, iki iş

Sana **bir tane** `app-*-form.html` verilir. O dosyada iki şey yaparsın:

1. **P2-01 — sekmeli kabuk.** Formun bölümlerini sekmelere ayır (`cfg.tabs`) ve
   uygun formlarda canlı sağ bağlam paneli kur (`cfg.aside`).
2. **P2-02 — kayıt sonrası detaya yönlendirme.** `kaydet()` sonundaki çıplak
   `location.href = 'app-liste.html'` düşüşünü `GV.afterSave(...)` çağrısına çevir.

**Başka hiçbir şeye dokunmazsın.** Alan eklemek, alan adı değiştirmek, iş kuralı
yazmak, veri düzeltmek **bu görevin dışındadır** — gördüğün kusuru raporuna yaz.

**Yasaklar (ihlal = iş geri döner):**
- `assets/**` altında hiçbir dosyayı değiştirme. CSS eksikse **rapor et**, sayfaya
  `<style>` bloğu yazma (components.md §8).
- `git` çalıştırma, commit atma, dal değiştirme.
- Yeni ortak bileşen yazma; eksikse rapor et.
- Yorumda `*` + `/` yan yana gelen desen yazma (ders **L-37**): `SAT-*/IZN-*`
  blok yorumunu oracıkta kapatır ve **sayfanın tamamı çöker**. Kayıt kodu deseni
  gerekiyorsa `SAT-…` yaz ya da düz sözcükle anlat.
- `location.reload()` yazma (ders L-15) — mock veri bellektedir, reload mutasyonu siler.

---

## 1. P2-01 — sekme sözleşmesi

`GV.form` motoru **hazır**; sen yalnız yapılandırma veriyorsun.

```js
var form = GV.form({
  mount:'#formMount',
  id:'personel',
  record: kayit || {},

  /* YENİ — sekme şeridi. Sırası ekrandaki sırasıdır. */
  tabs:[
    { key:'kisisel', label:'Kişisel',  icon:'i-user' },
    { key:'iletisim', label:'İletişim', icon:'i-phone' },
    { key:'gorev',   label:'Görev & Departman', icon:'i-briefcase' }
  ],

  /* Her bölüm hangi sekmeye ait olduğunu `tab` ile söyler. */
  sections:[
    { tab:'kisisel',  title:'Kimlik', icon:'i-user', fields:[ /* … */ ] },
    { tab:'iletisim', title:'İletişim bilgileri', fields:[ /* … */ ] }
  ],

  /* YENİ — canlı sağ bağlam paneli (opsiyonel, aşağıdaki kurala göre). */
  aside:function(v, api){ return GV.notice({ tone:'neutral', title:'…', text:'…' }); }
});
```

### Motorun kendiliğinden yaptıkları — sen yazmazsın

| Ne | Nasıl |
|---|---|
| Sekme şeridi markup'ı | `.gv-tabs` · `role="tablist"` · `aria-selected` · `tabindex` |
| Klavye gezinme | `ArrowLeft` / `ArrowRight` — detay ekranlarıyla **aynı** sözleşme |
| Sekme bazlı hata özeti | Hatalı alan gizli sekmedeyse özet **sekme adını** yazar |
| Sekme hata rozeti | `.gv-tab-err` sayıyı basar, sekmeye `has-err` gelir |
| İlk hatalı sekmeye geçiş | `validate()` odaklanmadan önce o sekmeye geçer |
| Sağ panelin canlı çizimi | Her `input`/`change` olayında `cfg.aside` yeniden çağrılır |

### Sert kurallar

1. **`tab` verilmeyen bölüm KAYBOLMAZ**, ilk panelin altına düşer. Bu bir güvenlik
   ağıdır, tasarım değil: **her bölüme `tab` ver.** Raporunda `tab`sız bölüm
   bıraktıysan bunu açıkça yaz.
2. **Sekme sayısı 3–7.** İkiden az sekme sekme değildir; yediden fazlası şerit taşırır.
3. **Bölüm sayısı 4'ten azsa sekme KURMA.** Düz form daha okunaktır ve
   `cfg.tabs` verilmeyen form eski davranışında kalır — bu bilinçli bir yoldur
   (ADR-18). Raporunda "N bölüm, sekme kurulmadı" diye yaz.
4. **Sekme adı ekranın dilindendir**, `key` ise ASCII ve kısa (`kisisel`, `sgk`,
   `evrak`). `key` adres çubuğuna yazılmaz, çakışması yeter ki olmasın.
5. **İkon zorunlu.** `icon` alanı `assets/img/icons.svg` içindeki bir addır. Emin
   olmadığın ikon adını **uydurma**; dosyada yoksa ikon hiç basılmaz ve şerit
   sessizce çirkinleşir. Güvenli ve dosyada **var olan** adlar:
   (aşağıdaki liste `assets/img/icons.svg` içinde **tek tek doğrulandı**):
   `i-user · i-users · i-user-check · i-phone · i-mail · i-briefcase · i-building ·
   i-calendar · i-calendar-check · i-clock · i-timer · i-wallet · i-receipt ·
   i-file · i-file-check · i-folder · i-paperclip · i-clipboard · i-clipboard-check ·
   i-check · i-check-circle · i-alert · i-alert-circle · i-info · i-lock · i-key ·
   i-settings · i-sliders · i-tasks · i-activity · i-package · i-truck · i-car ·
   i-fuel · i-wrench · i-shield · i-shield-check · i-percent · i-chart-bar ·
   i-chart-pie · i-tag · i-link · i-plus · i-edit · i-search · i-hourglass ·
   i-milestone · i-stamp · i-target · i-flag · i-layers · i-list · i-table ·
   i-support · i-bug · i-sprint · i-quote · i-award · i-graduation · i-code · i-git`
   ⚠️ `i-money`, `i-files`, `i-box`, `i-chart` **YOKTUR** — para için `i-wallet`,
   grafik için `i-chart-bar` kullan. Listenin dışına çıkacaksan önce
   `grep 'id="i-' assets/img/icons.svg` ile bak.
6. **Zorunlu alan tek sekmede toplanmaz.** Kullanıcı ilk sekmeyi doldurup
   "Kaydet"e bastığında üçüncü sekmedeki zorunlu alan hatası **özetle** görünür —
   motor bunu halleder. Ama sekmeleri kurarken **zorunlu alanların çoğunu ilk
   sekmeye** koy ki normal akış ilk sekmede bitsin.
7. **Yetkiye bağlı gizlenen bölüm, sekmesini de götürür.** Rolün göremeyeceği
   bölüm forma **hiç konmaz**; o sekmede başka bölüm kalmıyorsa **sekmeyi de
   listeye ekleme**. Boş panel basmak ölü kontrol bırakmaktır. Kalıp:
   ```js
   var tabs = [{ key:'kisisel', label:'Kişisel', icon:'i-user' }];
   if(canOzluk) tabs.push({ key:'sgk', label:'SGK & Maaş', icon:'i-money' });
   ```

### Sağ bağlam paneli (`aside`) — ne zaman

Kur, **eğer** formun girilen değerlerden **türeyen** ve kullanıcının kaydetmeden
önce görmesi gereken bir özeti varsa: hesaplanan toplam, kalan bakiye, çakışma
uyarısı, seçilen kaydın künyesi, kapı uyarısı.

Kurma, eğer yazacağın tek şey "zorunlu alanlar yıldızlıdır" gibi **sabit** bir
metinse — o `sub` başlığına aittir.

```js
aside:function(v){
  var m = v.musteri ? DB.customers.filter(function(x){ return x.kod === v.musteri; })[0] : null;
  return (m ? GV.notice({ tone:'neutral', icon:'i-building', title:m.unvan,
                          text:'Açık proje: ' + m.aktifProje }) : '') +
         GV.notice({ tone:'info', title:'Toplam',
                     text:F.money(Number(v.tutar||0) * 1.2) + ' (KDV dahil)' });
}
```

`aside` **string döndürür** (HTML). Her tuş vuruşunda çağrılır: içinde ağır döngü,
`DB` üzerinde tam tarama ya da dinleyici bağlama **yapma**. İçinden fırlayan hata
paneli çökertmez (motor yakalar) ama kullanıcıya "Özet çizilemedi" yazar — bu bir
kusurdur, raporuna geçer.

⚠️ Formun **zaten** kendi sağ sütununu kurmuş olması mümkündür (`gv-grid-aside`
markup'ını sayfa kendi yazmıştır — `app-izin-form.html` böyle). O zaman
`cfg.aside` **kurma**: iki sağ panel iç içe geçer. Mevcut sütunu olduğu gibi
bırak, raporunda "sayfa kendi sağ sütununu kuruyor, `cfg.aside` kullanılmadı" yaz.

---

## 2. P2-02 — kayıt sonrası yönlendirme

Bugün her form `kaydet()` sonunda şunu yapıyor:

```js
form.setDirty(false);
/* location.reload() YASAK (ders L-15) — normal akış listeye dönmektir. */
setTimeout(function(){ location.href = 'app-lead.html'; }, 700);
```

Yorumun **`location.reload()` yasağı** doğrudur ve kalır. **"normal akış listeye
dönmektir"** hükmü ise şartname [3.1.16] ile çelişiyor ve bu paket onu tersine
çeviriyor: kullanıcı kaydettiği kaydın **detayına** gitmeli.

### Yeni kalıp

```js
form.setDirty(false);
/* location.reload() YASAK (ders L-15). Hedefi GV.afterSave seçer: detay ekranı
   yayında ve yetki varsa detaya, yoksa listeye ([3.1.16]). */
GV.afterSave({
  kod:   duzenle ? kayit.kod : kod,      // KAYDIN KODU — aşağıdaki tuzağa bak
  yeni:  !duzenle,
  detay: 'app-lead-detay.html',          // varsa; yoksa bu alanı HİÇ yazma
  liste: 'app-lead.html',                // her zaman
  alt:   []                              // otomatik doğan alt kayıtların bağlantıları
});
```

`GV.afterSave` şunları **kendisi** yapar — sen yazmazsın:
- hedef detay ekranı `shell.js` `BUILT` listesinde mi diye bakar,
- kullanıcının o dosyaya yetkisi var mı diye bakar,
- ikisi de varsa `detay?id=KOD`'a, yoksa `liste`'ye gider,
- 700 ms bekler (toast okunsun diye),
- hedef sayfanın tepesine "**KOD oluşturuldu**" şeridini bir kez bastırır.

### Tuzak — `kod` düzenleme yolunda `undefined`'dır

Formların çoğunda `var kod = yeniKod();` **`else` bloğunun içinde** durur. `var`
işlev kapsamlıdır, yani if/else'ten sonra değişken **vardır** ama düzenleme
yolunda **değeri yoktur**. `kod:kod` yazarsan düzenlemede `?id=undefined` adresi
üretilir ve kullanıcı "kayıt bulunamadı" ekranına düşer.

Doğrusu: `duzenle ? kayit.kod : kod`. Formun kendi değişken adları farklıysa
(`hedefKod`, `c.kod`, `rec.kod`) **o dosyadaki gerçek adı kullan** — kalıbı körü
körüne kopyalama.

Formda birden çok çıkış noktası varsa (ör. "değişiklik yok" erken dönüşü)
**hepsini** çevir; tek bir çıplak `location.href` bırakma.

### `detay` alanını ne zaman yazarsın

Yalnız `app-<aynı taban>-detay.html` dosyası **gerçekten varsa**. Yoksa alanı hiç
yazma; `GV.afterSave` listeye döner ve şeritte bunu dürüstçe söyler. Prompt'unda
formun detay ekranının olup olmadığı yazılıdır; şüpheye düşersen `ls` ile bak.

### `alt` — otomatik doğan alt kayıtlar

Form kaydederken **başka** kayıtlar da üretiyorsa ([3.1.16] bunu istiyor) her biri
için bir bağlantı ver:

```js
alt:[{ label:'Ödeme planı: ' + planKod, href:'app-odemeplani-detay.html?id=' + planKod }]
```

Üretmiyorsa `alt` **verme**. Var olmayan alt kaydı listelemek uydurmadır.

---

## 3. Bitirmeden önce kendi işini ölç

Repo kökünde, **yalnız bu ikisi** (başka QA script'i koşturma, tarayıcı açma):

```bash
node tasks/qa/html-js.js        # senin dosyandaki inline script ayrışıyor mu (L-37)
node tasks/qa/aftersave.js      # yönlendirme sözleşmesi kuruldu mu
```

`html-js.js` **TEMİZ** dönmeli. `aftersave.js` senin dosyan için bulgu
**bırakmamalı** (başka formlar için bulgu basması normaldir — onlar başka
ajanlarda).

Bu ikisi geçmeden "bitti" deme.

---

## 4. Raporun

Kısa, ölçülmüş, dürüst. Şu altı başlık:

1. **Dosya · satır sayısı** (önce → sonra).
2. **Sekmeler:** kaç sekme, adları, hangi bölüm hangi sekmede. Sekme kurmadıysan
   **neden** (bölüm sayısı).
3. **Sağ panel:** kuruldu mu, ne gösteriyor; kurulmadıysa neden.
4. **Yönlendirme:** `detay` verildi mi, kod değişkeni ne oldu, kaç çıkış noktası
   çevrildi, `alt` bağlantısı var mı.
5. **İki ölçüm çıktısı** (`html-js.js` · `aftersave.js`) — kopyala yapıştır.
6. **Bildirdiklerin:** eksik ortak bileşen · eksik ikon · veri çelişkisi · bu
   formda gördüğün ama **dokunmadığın** kusur.

Ölçmediğin bir şeye "çalışıyor" deme (L-05). Yarım kalan işi bitmiş gösterme.
