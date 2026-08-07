# components.md — Ortak Bileşen Sözlüğü

> **Tek doğru kaynak.** Yeni ekran yazarken önce buraya bakılır; burada olan bir şey
> sayfaya yeniden yazılmaz. Sayfaya özel `<style>` bloğu **yasak** — eksik varsa
> bileşen katmanına eklenir ve buraya işlenir.

Namespace: CSS `.gv-*`, JS `window.GV.*`.

---

## 1. Shell (shell.css + shell.js)

| Bileşen | Sınıf / API | Not |
|---|---|---|
| Uygulama ızgarası | `.gv-app` | rail + menü + top + main |
| İkon rail | `.gv-rail` | modül anahtarı, `--rail-w` |
| Bölüm menüsü | `.gv-menu` | aktif modülün alt menüsü, `--menu-w`; `{seclbl}` grup başlığı, `cnt` rozeti |
| Menü daraltma | `.gv-divider` > `span` | **iki katman**: buton = görünmez yakalama bandı (`--sp-11` × `--sp-17`×2, kenarın içine `--sp-5` / dışına `--sp-11` taşar, yalnız boşluk oluklarına girer); `span` = görünen grip (`--sp-10`×`--sp-15`, bitişik yüzeyin token rengi — menü açıkken `--brand-night`, kapalıyken `--brand-abyss`; kenarlıksız, gölgesiz, yalnız dışa bakan kenarı `--r-md`). `aria-expanded` + `aria-controls`; durum `localStorage`. Aç/kapa kararı `matchMedia` ile kırılıma göre verilir (lessons L-09/L-10/L-11) |
| Üst bar | `.gv-top` | burger · global arama · bildirim · persona çipi |
| Mobil overlay | `.gv-overlay` | ≤980px |
| İçerik | `.gv-main` | |
| Breadcrumb | `.gv-crumb` | bölüm → ekran |
| Sayfa başlığı | `.gv-page-head` > `.ph-eyebrow` `h1` `.ph-sub` `.ph-actions` | |
| Rol motoru | **`GV.perm.role()`** okur · **`GV.shell.setSession()`** yazar | `sessionStorage`, URL yalnız ilk seçim. ⚠️ `GV.shell.role()` / `setRole()` **yoktur** — sözlükte beş oturum boyunca yanlış yazılıydı, 9. oturumda ölçüldü |
| Yetki çözümleyici | `GV.perm` = `{ role, matrix, sec, item, can, scope, mask }` | Yedi üye. `can(action, scope)` yetki kapısı, sayfa açılışında da çalışır ve 403 durumu basar; `scope(action)` `'tum'\|'departman'\|'proje'\|'kendi'`; `mask(...)` alan maskeleme |
| Bildirim sayacı | `GV.counters` (17 sayaç) | ⚠️ **`GV.notify` diye bir bileşen YOKTUR.** Üst bardaki zil düz bir `<a href="app-panel-bildirimler.html">` bağlantısıdır — panel, açılır liste ya da "okundu" yordamı **yok**. Okunmamış sayısı `GV.counters.bildirim`'den gelir |
| Sayfa başlığı üreticisi | `GV.pageHead({eyebrow,title,sub,actions:[{label,icon,cls,href,run}]})` | her ekranın ilk çağrısı; breadcrumb'ı da besler |
| Sayfa iskeleti | `buildSkeleton()` (shell.js, otomatik) | rail+menü+üstbar+main; sayfa yalnızca config yazar |
| Yeniden çizim | `GV.refresh()` | Mock veriyi **değiştiren** her aksiyonun sonu. `gv:ready`'yi yeniden tetikler; `location.reload()` veriyi silerdi (L-15). `#rec` mount düğümünü taze kopyayla değiştirir, böylece mount'a bağlı dinleyiciler birikmez (L-16) |
| Tekil dinleyici | `GV.on(el, type, fn, key)` | `document`/`window` gibi **kalıcı** düğüme dinleyici bağlarken. Aynı `key` ikinci kez gelince öncekini söker. Aynı düğümde birden çok dinleyici varsa **her birine ayrı key** |
| Yayın kaydı | `GV.built` (BUILT dizisi) · `GV.isBuilt(href)` · `GV.markWip(root)` | BUILT'te olmayan hedefin `href`'i düşürülür, `data-wip` basılır; MutationObserver sonradan basılan DOM'u da tarar |

---

## 2. Liste Bileşeni — `GV.list(config)`

PROMPT.md §6'nın tamamını **tek bileşende** karşılar. Her liste ekranı bunu kullanır.

```js
GV.list({
  mount:'#liste',
  source: DATA.tasks,            // canonical mock veri
  key:'kod',
  title:{ eyebrow, h1, sub },
  kpis:[{key,label,icon,tone,calc}],
  tabs:[{key,label,icon,filter}],          // sayaçlar veriden türetilir
  columns:[{key,label,width,sortable,visible,render,exportable}],
  filters:[{key,label,type:'select|multi|date|daterange|number|text',options}],
  views:['table','card','kanban'],
  kanban:{ groupBy:'durum' },
  bulk:[{key,label,icon,confirm,run,export}],
  rowActions:[{icon,label,href}],
  search:{ fields:[...], extra:function(r){ return DB.emp(r.kisi).ad; } },  // türetilmiş arama metni
  pageSize:10,
  archive:true, passive:true,
  export:['xlsx','csv','pdf','print'],
  emptyState:{icon,title,desc,action},
  urlSync:true
})
```

Kapsadığı özellikler (§6 kontrol listesi):
hızlı arama · gelişmiş filtre · kayıtlı filtreler · kayıtlı görünümler · kolon seçimi ·
kolon sıralama · kolon genişliği · sıralama · sayfalama · toplu seçim · toplu işlem ·
aktif/pasif · arşivlenenleri göster · Excel/CSV/PDF/yazdır · filtre temizle ·
filtre kaydet · kullanıcıya özel görünüm · kart/tablo/kanban görünümü · mobil liste.

**Kurallar:** filtre değişince sayfa 1'e döner · sayfa/filtre/sıralama URL'de tutulur ·
mobil kart görünümü **aynı veri kaynağından** üretilir (ikinci markup yazılmaz).

---

### `rowActions[]` sözleşmesi
`{ key, label, icon, cls, href, run, show }`
- `href` string ya da `function(row)` — döndürdüğü değer falsy ise aksiyon **buton** olarak basılır
  ve `run(row, ev)` çalışır.
- **`show(row)` → boolean** — false dönerse aksiyon o satırda **hiç basılmaz**. Devre dışı
  buton bırakmak yasak olduğu için, satıra uymayan aksiyon (zaten onaylanmış kaydı onaylama,
  sözleşmesi olmayan kayıtta "sözleşmeyi aç") bu yordamla elenir. `onRender` içinde DOM'dan
  buton silmek **artık gerekmez**.
- **`run` yoksa aksiyon `disabled` + "bu sürümde yok" basılır** (UID-27 · ders L-23).
  Bileşen, çağıranın vermediği yordamın yerine **başarı varsaymaz**.

### `bulk[]` sözleşmesi
`{ key, label, icon, tone, confirm, run, export }`
- `run(ids)` — seçili kayıt anahtarlarını alır. Yoksa madde `disabled` + "bu sürümde yok"
  basılır (`rowActions` ile **tek kural**, UID-27).
- **`export:true`** — "seçilenleri dışa aktar" maddesinin yordamı **bileşendedir**; ekran
  `run` yazmaz. Bileşen seçili kayıtları `exportRows` ile dışa aktarır, biçimi kullanıcıya
  sorar ve **seçimi korur** (çıktı yıkıcı bir işlem değildir). 53 ekran bu maddeyi kullanır;
  53 kez aynı `run` closure'ını yazmak components.md'nin "aynı mantık ikinci kez yazılmaz"
  kuralına aykırı olurdu (UID-07).

### `GV.list` dönüş yüzeyi
`{ state, refresh, setTab(k), setFilter(k,v), exportRows(rows, biçim?),
   openCols(), openFilters(), openExport(rows?), setView(v) }`
- **UID-26** — kolon yöneticisi, gelişmiş filtre, çıktı modalı ve görünüm anahtarı artık
  dışarıdan çağrılabilir; sözlük bunları beş oturum boyunca `GV.cols()` / `GV.filters()` /
  `GV.export()` / `GV.kanban()` diye **var olmayan bileşenler** olarak listelemişti.
  `openExport()` kayıt kümesi verilmezse ekrandaki süzülmüş kümeyi kullanır.
  Listeden **bağımsız** bileşenlere ayrıştırma bilinçli olarak yapılmadı — gerekçe
  `ui-debt.md` V2 (dördü de liste `state`i üzerinde çalışıyor; borcun gerekçe gösterdiği
  üç belirti UID-06 · UID-07 · UID-17 başka yollarla kapandı).
- **`exportRows`** (UID-07) — dizideki her öğe kayıt nesnesi **ya da** kayıt anahtarı olabilir;
  bulunamayan atılır, hiç kalmazsa `warn` tonlu uyarı basılır (asla sessiz "başarı" demez).
  `biçim` verilmezse (`xlsx|csv|pdf|print`) kullanıcıya sorulur.

## 3. Detay Ekranı — `GV.tabs(sel)` + kayıt markup'ı

> ⚠️ **`GV.detail(config)` diye bir bileşen YOKTUR.** Sözlükte uzun süre yazılıydı ama
> `ui.js`'te karşılığı hiç olmadı. Detay ekranları **elle markup + `GV.tabs`** ile kurulur.
> Kalıp: **`app-gorev-detay.html`** — yeni detay ekranı yazan buna bakar.

**İSKELET — 5. oturumda değişti.** Detay ekranı da **`buildSkeleton()` kullanır**: `<body>`'ye
yalnız `<div id="rec"></div>` konur, shell iskeletini `shell.js` kurar ve `GV.pageHead(...)`
normal çalışır. Kalıp: **`app-teklif-detay.html`**.

> Eski kayıt "detay ekranı shell markup'ını kendi yazar" diyordu; bu **tekrarlı kod** üretiyordu
> ve kopyalanan `.gv-divider` UID-01'in eklediği `aria-controls="gvMenu"` niteliğini taşımıyordu.
> `buildSkeleton()` `.gv-app` varsa erken döner — bu yüzden elle iskelet yazan sayfada
> `#gvPageHead` hiç doğmaz ve **`GV.pageHead` sessizce hiçbir şey yapmaz**. Elle iskelet yazan
> dört eski ekran **UID-15** olarak borç defterinde.

| Parça | Sınıf / API |
|---|---|
| Kayıt başlığı | `.gv-rec-head` > `.gv-rec-id` > `.gv-rec-code` + `GV.badge` + `GV.pri` |
| Alan listesi | `.gv-dl` > `div` > `dt` + `dd` (boşsa `dd.is-empty`) |
| Sağ özet paneli | `.gv-summary` > `.gv-summary-row` > `.gv-summary-lbl` + `.gv-summary-val` |
| Sekmeler | `GV.tabs('#recTabs')` — hash senkronlu (`#tab=projeler`), klavye ok tuşu |
| Aktivite | `GV.activity(items)` |
| Onay zinciri | `GV.chain(steps)` |
| Kayıt yok durumu | `GV.empty({...})` — `?id=` hatalıysa listeye dönüş aksiyonu |
| Breadcrumb | `GV.shell.crumb(kayitKodu)` |

**Gantt:** `GV.gantt(config)` **de yoktur** — yalnız CSS vardır. Markup elle kurulur:
`.gv-gantt` > `.gv-gantt-head` + `.gv-gantt-grid` > `.gv-gantt-row` > `.gv-gantt-lbl` +
`.gv-gantt-track` > `.gv-gantt-bar[.is-ok|.is-warn|.is-danger]`. Çubuk konumu/genişliği
yüzde olarak inline `style` ile verilir (tek istisna; renk yine token'dan gelir).

---

## 4. Form Bileşeni — `GV.form(config)`

```js
var form = GV.form({
  mount:'#formMount',
  id:'lead',                                   // beforeunload anahtarı — aynı sayfada iki form varsa şart
  record: kayit || {},                         // boş/atlanmış = yeni kayıt modu
  sections:[{ title, desc, fields:[
    { key, label, type, required, hint, placeholder, cols,   // cols: 12'lik ızgarada genişlik (varsayılan 6)
      options,                                               // select / radio: ['A','B'] ya da [{value,label}]
      min, max, rows, currency, multiple,
      validate:function(value, data){ return 'hata metni' || ''; } }   // çapraz alan doğrulaması
  ]}]
});
```

**⚠️ `onSubmit` ve `submitLabel` diye seçenek YOKTUR.** Bileşen kaydet butonu **basmaz** —
butonu sayfa `GV.pageHead` aksiyonlarına ya da form altına kendisi koyar ve dönüş nesnesini çağırır:

| Dönüş | Ne yapar |
|---|---|
| `form.submit()` | Doğrular; hata varsa `null` döner + toast basar + **ilk hatalı alana odaklanır**. Temizse `dirty`'yi düşürür ve **alan değerlerini nesne olarak** döndürür |
| `form.validate()` | Yalnız doğrular, hata dizisi döner |
| `form.read()` | Doğrulamadan ham değerleri okur |
| `form.isDirty()` | Kaydedilmemiş değişiklik var mı |
| `form.setDirty(false)` | Kaydettikten sonra uyarıyı kapatmak için |
| `form.el` | Mount düğümü |

**Gerçekten çalışan alan tipleri:** `text` · `textarea` · `select` · `radio` · `checkbox` ·
`switch` · `file` · `money` (₺ soneki) · `percent` (% soneki) · `date` · `number` · `email` ·
`tel` · `url`. **Tanımsız bir tip verilirse sessizce `text` olur** — `multiselect`, `daterange`,
`tags`, `user`, `customer`, `project`, `richtext` **yoktur**; çoklu seçim gerekiyorsa `select`
+ çip listesi ya da `checkbox` grubu kurulur ve eksik bileşen rapor edilir.

**Yerleşik doğrulama:** zorunlu alan · e-posta · telefon (≥10 hane) · url (http/https) ·
`min`/`max` sayı aralığı · alan bazlı `validate(value, data)`. Tarih mantığı (bitiş ≥ başlangıç)
**yerleşik değildir**, `validate` ile kurulur.

**Hata sunumu:** form üstünde özet kutusu (`.form-err-summary`) + alan altı mesaj (`.f-err`) +
ilk hatalı alana odak + özet kutusuna kaydırma. Hepsi bileşende, sayfada yeniden yazılmaz.

**Kaydetmeden çıkış uyarısı** `beforeunload` ile bileşende kurulur ve `GV.on` üzerinden
**tekil anahtarla** bağlanır (`cfg.id`) — `GV.refresh()` sonrası dinleyici birikmez (ders L-16).

---

## 4b. Form Kontrolü Taban Kuralları (UID-08 / UID-09 — kapandı)

> **Kural sınıfa değil KALIBA bağlıdır** — yeni markup yazarken hiçbir şey eklemek
> gerekmez, kontrol kendiliğinden tasarım sistemine uyar.

| Kalıp | Kural | Not |
|---|---|---|
| Alan başlığı | `.field label:not(:has(input))` · `.field .f-lbl` | Kontrolü **saran** etiket başlık değildir; `:not(:has(input))` bu ayrımı yapar. Eskiden `display:block` kontrol etiketlerini de yakalıyor ve `gap`'i eziyordu (ölçülen boşluk **0 px**) |
| Kontrol + etiket | `:where(label:has(> input[type=checkbox]), label:has(> input[type=radio]))` → `inline-flex` + `gap:var(--sp-5)` | `:where()` özgüllüğü **sıfırlar**: `.f-check` · `.f-radio` · `.lh-toggle` kendi ölçüsünü geçebilir |
| Onay kutusu / radyo | `:where(input[type=checkbox],input[type=radio])` → `appearance:none` + token'lı kutu, köşe, kenarlık, odak halkası; işaret CSS `clip-path` ile | `accent-color` yazan sınıf başına kopyalar **silindi**. `:indeterminate` de kapsanır |
| Açılır liste | `:where(select)` → tasarım sistemi oku | Kural `.field select`'ten çıkarıldı; sayfalama, rapor filtresi ve ayar ekranlarındaki select'ler de kapsamda |
| Tarih / ay / saat | Native kontrol **korunur**; yalnız takvim düğmesinin ölçüsü ve tonu standartlaşır | Gerekçe `assumptions.md` **V-36**. Biçimi çalışma zamanında okunamaz (Chromium pseudo-element stilini vermez) — `ctl.js` kuralın yazılı olduğunu statik doğrular |
| Anahtar | `.f-switch` — girdi görsel olarak gizlidir, `.sw` çizer | Taban kural onu etkilemez |

---

## 5. Durum Etiketi — `GV.badge(value, extra)`

> ⚠️ **İmza düzeltmesi (9. oturum, ölçüldü).** Başlık uzun süre `GV.badge(kind, value)`
> diye yazılıydı; gerçek imza **`GV.badge(value, extra)`** — birinci parametre gösterilecek
> **değer**, ikincisi opsiyonel **ton sınıfı**. Aşağıdaki `GV.badge(v,'is-danger')`
> örnekleri zaten doğruydu, yanlış olan başlıktı.

Semantik renkler accent'ten **bağımsız**. `.gv-badge` + ton sınıfı:
`.is-ok` `.is-warn` `.is-danger` `.is-info` `.is-neutral` `.is-accent`

Kayıtlı sözlükler: görev durumu (19), satış aşaması (15), proje durumu, destek durumu,
izin durumu, satın alma onay durumu, araç durumu, öncelik (4), SLA durumu.

**⚠️ Eksen çakışması — `Yüksek` / `Orta` / `Düşük` üç ayrı eksende geçer:**
öncelik (`DB.priorities`), etki (`DB.impacts`) ve **risk** (`DB.customers[].risk`).
Aynı kelime farklı anlam taşıdığı için bunlar TONE sözlüğüne **konulamaz** — konulsaydı
riski yüksek müşteri ile önceliği yüksek görev aynı rengi alırdı. Risk gibi eksen-belirsiz
değerlerde `GV.badge(v, 'is-danger')` biçiminde **açık ton geçmek doğru kullanımdır**,
yerel ton haritası yazmak değil. Örnek: `app-musteri.html` · `app-musteri-detay.html`.

**5. oturumda sözlüğe eklenenler** — bu değerlerde artık açık ton geçmeye gerek yok:
`Çözüm bekliyor`(warn) · NPS grupları `Destekleyici`(ok)/`Nötr`(warn)/`Kötüleyici`(danger) ·
muayene `Geçti`(ok)/`Kaldı`(danger) · poliçe `Teklif alındı`(info)/`Sözleşmeye dahil`(neutral) ·
zimmet `İade edildi`(neutral) · teklif `Teknik uygun`(ok)/`Teknik uygun değil`(danger)/
`Tercih edildi`(ok)/`Tercih bekliyor`(warn) · sipariş `Teslim bekleniyor`(warn)/`Tam`(ok).

**Destek ve bakım (§18) tonları** — `extra` geçmeye gerek yok, sözlükte tanımlı:
`Yanıtlandı`(ok) · `Yanıt bekliyor`(warn) · `Risk altında`(warn) · `İhlal edildi`(danger) ·
`Tutturuldu`(ok) · `Aşıldı`(danger) · `Sona erdi`(neutral) · `Yenilemesi yaklaşan`(warn).

---

## 5b. Rapor İskeleti — `GV.report(config)`

PROMPT.md §20'nin ortak iskeleti. Wave 11'in **sekiz** rapor ekranı bunu kullanır.

```js
GV.report({
  mount:'#rapor', id:'rapormusteri',
  filters:[{key,label,type:'select|date|text',options,value,all,placeholder}],
  reports:[{
    key, label, icon, group,          // sol listede gruplanır
    title, desc,                      // içerik başlığı
    rows:function(f){ return [...]; },            // filtre değerlerine göre kayıtlar
    kpis:[{label,icon,tone,format,calc(rows,f),meta,metaTone}],
    charts:function(rows,f){ return [{title,sub,html,legend,wide}]; },
    table:{ /* GV.list config — mount/id/source/urlSync hariç */ }
  }]
})
```

- Sol rapor listesi `.gv-rp-nav` (≤980px'de yatay kaydırmalı şeride döner), içerik `.gv-rp-body`.
- Filtre şeridi `.rp-filters` + `.rp-acts`: **Filtreleri temizle · Kayıtlı raporlar · Raporu kaydet**.
- Kayıtlı rapor `localStorage`'da (`gv.rp.<id>`); seçilince rapor + filtre birlikte geri yüklenir.
- Grafik kartı: `.gv-charts > .gv-chartcard > h3 + .gv-ch-sub + <svg class="gv-chart">`.
  `wide:true` kartı tam genişliğe alır. Grafikler `GV.chart.bar/line/donut/legend/spark`.
- Detay tablo `GV.list` ile basılır (çıktı, kolon yönetimi, sayfalama oradan gelir); `urlSync` kapalıdır.
- URL senkronu: `?r=<rapor>&rf_<filtre>=<değer>`.

---

## 6. Diğer Ortak Bileşenler

> ### ⚠️ GERÇEK `GV.*` YÜZEYİ — 38 üye (9. oturumda ölçüldü, **üç** dosya tarandı)
>
> **`domain.js` (2):** `fin` · `delivery` — 10. oturumda eklendi (bkz. §6b).
>
> **`shell.js` (12):** `built` · `counters` · `esc` · `ico` · `isBuilt` · `markWip` · `on` ·
> `pageHead` · `perm` · `refresh` · `session` · `shell`
> **`ui.js` (25):** `activity` · `badge` · `chain` · `chart` · `chipbar` · `confirm` ·
> `dateCell` · `drawer` · `empty` · `errorState` · `fmt` · `form` · `list` · `modal` ·
> `notice` · `pri` · `progress` · `report` · `result` · `skeleton` · `tabs` · `toast` ·
> `tone` · `upload` · `user`
> **`dashboard.js` (1):** `dashboard(mount)` — `app-panel.html` çağırır (`GV.dashboard('#dash')`).
>
> > **Kendi ölçümümün düzeltmesi.** Bu blok ilk yazıldığında "37 üye" diyordu çünkü yalnız
> > `ui.js` + `shell.js` tarandı. `GV.dashboard` **`assets/js/dashboard.js`** içinde tanımlı ve
> > gerçekten çağrılıyor. Ders: `GV.*` yüzeyi taranırken **`assets/js/` altındaki tüm dosyalar**
> > taranır — bugün dört dosya var (`shell.js` · `ui.js` · `dashboard.js` · `login.js`;
> > `login.js` `GV.*` üyesi tanımlamaz).
>
> **Bu listede olmayan bir `GV.*` adı ÇAĞRILMAZ.** Sözlük beş oturum boyunca kodda karşılığı
> olmayan **sekiz** ad taşıdı — `GV.notify` · `GV.cols` · `GV.filters` · `GV.export` ·
> `GV.bulk` · `GV.dateRange` · `GV.help` · `GV.kanban` — `GV.detail` ve `GV.gantt`'ın
> (§3) aynı sınıfı. Beşinin işlevi **`GV.list` içinde yaşıyor ve dışarıdan çağrılamıyor**,
> üçünün (`notify` · `dateRange` · `help`) kodda hiçbir karşılığı yok.
> Aşağıdaki tabloda her biri gerçek karşılığıyla düzeltildi.
>
> **Kural:** Bu sözlüğe bir API satırı yazmadan önce adı `ui.js` ya da `shell.js` içinde
> **görmüş olmak** gerekir. Planlanan ama yazılmamış bileşen buraya değil `ui-debt.md`'ye yazılır.

| Bileşen | API | Görev |
|---|---|---|
| Modal | `GV.modal({title,body,actions,size})` | `.page-main` **dışına** basılır |
| Sağ panel | `GV.drawer({title,body,actions,side})` | filtre, hızlı detay, sohbet |
| Onay | `GV.confirm({title,text,tone})` → Promise | yıkıcı işlemlerde zorunlu |
| Sonuç | `GV.result({tone,title,text,actions})` | işlem sonrası |
| Toast | `GV.toast(text, tone)` | kısa geri bildirim |
| Dosya yükleme | `GV.upload({mount,accept,multiple,maxMB,hint,files,onChange})` → `{files(),clear(),el}` | sürükle-bırak, boyut kontrolü, dosya listesi; `GV.form` içindeki `type:'file'` alanı da aynı görünümü kullanır |
| Alan listesi | **`GV.dl(pairs, opts)`** (UID-17) | `.gv-dl` üretir. `dt` ve `dd` **çağıranın işaretlemesidir**, bileşen escape ETMEZ (etiket birim eki taşıyabilir — L-14); boş değer tek yerde `.is-empty` + `—`. `skipEmpty:true` boş satırı hiç basmaz. 60 ekranın yerel `dl()` kopyası silindi |
| Aktivite timeline | `GV.activity(items)` | kim · ne zaman · eski → yeni değer |
| Onay akışı | `GV.chain(steps)` | çok aşamalı onay zinciri görselleştirmesi |
| Boş durum | `GV.empty({icon,title,desc,action})` | her listede zorunlu |
| Yüklenme | `GV.skeleton(type)` | tablo/kart/detay iskeleti |
| Hata durumu | `GV.errorState({title,desc,retry})` | |
| Satır içi uyarı | `GV.notice({tone,title,text,icon,actions})` → HTML | salt-okunur uyarısı, eksik entegrasyon, kapsam notu; tonlar `info` (varsayılan) `ok` `warn` `danger` `neutral` |
| Geniş matris | `.gv-tablewrap.is-sticky1 > .gtable` + `td.cell-sw` + `th.th-narrow` | ilk kolon kaydırmada sabit; **≤760px'de `.gv-tablewrap` gizlenir** — mobilde `.gv-cardlist`/`.gv-mrow` karşılığı üretilmeli |
| Anahtar | `.f-switch > input + span.sw` | matris hücresi ve ayar ekranları |
| Görünüm anahtarı | `.viewswitch` (**`.gv-` öneki yok**) | tablo / kart / kanban / takvim; `button[data-view]` |
| Chip şeridi | `GV.chipbar(el)` | taşınca oklu kaydırma |
| Kolon yöneticisi | `GV.list` dönüşü → **`api.openCols()`** (UID-26) | göster/gizle · sırala · genişlik · kayıtlı görünüm (`localStorage` `gv.cols.<id>`). ⚠️ Bağımsız `GV.cols()` **yoktur**; liste örneğinin dönüş yüzeyinden çağrılır |
| Filtre drawer | `GV.list` dönüşü → **`api.openFilters()`** (UID-26) | `cfg.filters[]`'ten kurulur, aktif filtre çipleri. ⚠️ Bağımsız `GV.filters()` **yoktur**; dönüş yüzeyinden çağrılır |
| Çıktı | **`GV.list` içi** — `doExport(rows, fmt)` · dışarıya `api.exportRows(rows, fmt)` | `cfg.export[]` formatları. ⚠️ `GV.export()` **yoktur** (bağımsız bileşen değil), ama seçili kapsam artık dışa aktarılabiliyor: dönüş yüzeyindeki `exportRows` + `bulk[].export` (UID-07 kapandı). Kolonun çıktıya ne taşıdığı `exportValue`'dan, yoksa `r[key]`'den gelir — `xport.js` her turda ölçer |
| Tarih aralığı | **hiç yok** | ⚠️ `GV.dateRange()` kodda **hiçbir yerde tanımlı değil**. Tarih aralığı bugün `filters[].type:'daterange'` ile `GV.list` içinde kurulur |
| Toplu işlem barı | **`GV.list` içi** — `renderBulk()` (ui.js) | `cfg.bulk[]`'ten kurulur. ⚠️ `GV.bulk()` **yoktur**; `bulk[]`'te `show`/yetki kapısı da yok (UID-13) |
| KPI kartı | `.kpi-grid > .kpi-card` (**`.gv-` öneki YOK**) | `.kpi-ico` + `.kpi-num` + `.kpi-lbl` + `.kpi-meta`; `GV.list`/`GV.report` `kpis:[]` config'inden basılır |
| İlerleme | `.gv-progress` | proje/görev ilerleme, bütçe kullanımı |
| Kullanıcı çipi | `.gv-user` | avatar (baş harf) + ad + rol |
| Yardım | **hiç yok** | ⚠️ `GV.help()` kodda **hiçbir yerde tanımlı değil**. Alan açıklaması bugün `GV.form` alanlarının `hint` anahtarıyla verilir |
| Yazdırma başlığı | `.gv-print-head` | çıktı ekranları |
| Kanban | **`GV.list` içi** — `renderKanban()` (ui.js) | `views:['kanban']` + `kanban:{groupBy}` ile açılır; `cfg.kanban` yoksa tabloya düşer. ⚠️ `GV.kanban()` **yoktur**, ayrı bileşen olarak çağrılamaz |
| Takvim | `.gv-cal` ızgarası (`.gv-cal-dow`, `.gv-cal-day[.is-out|.is-today]`, `.gv-cal-num`, `.gv-cal-ev[.is-ok\|warn\|danger\|accent\|purple\|neutral]`) | ay = 7×6; hafta = `.gv-cal.is-week` (tek satır, uzun hücre); gün = `GV.activity` timeline'ı. Örnek: `app-ajanda.html` |
| Sohbet | `.gv-chatwrap` (`.gv-chatlist` > `.gv-chan`, `.gv-chatmain` > `.gv-chat-head` > `.gv-chat-title`/`.gv-chat-acts`, `.gv-chat-body` > `.gv-msg[.is-me]`, `.gv-msg-react`, `.gv-chat-foot`) | ≤900px'de `body.chat-list-open` kanal listesini açar — geri butonunu sayfa bağlar. Örnek: `app-sohbet.html` |
| Gantt | `.gv-gantt` sınıf ailesi (**`GV.gantt()` JS'i YOK**, bkz. §3) | milestone + görev çubukları, markup elle kurulur |

---

## 6b. İş Kuralı Yordamları — `assets/js/domain.js` (VB-06 · VB-23 · VB-25)

> **Ne zaman buraya yazılır:** bir olgu **birden çok koleksiyona** dokunuyorsa ya da
> **birden çok ekrandan** yürütülüyorsa. `ui.js` alana kördür, `domain.js` GaviaWorks
> iş kuralını bilir. Yükleme sırası: veri → `shell.js` → `ui.js` → `domain.js`.

| API | Ne yapar | Neden ekranda değil |
|---|---|---|
| `GV.fin.settleInvoice(kod, tarih?)` | Faturayı kapatır **+ bağlı tahsilatı** kapatır **+ taksitin `odemeDurum`unu** senkronlar **+ müşterinin `bekleyenTahsilat`ını yeniden türetir** | Fatura ekranı yalnız faturayı, tahsilat ekranı yalnız tahsilatı kapatıyordu; kullanıcı faturayı ödedikten sonra tahsilat sekmesinde açık alacak görüyordu |
| `GV.fin.settlePayment(kod, tarih?)` | Aynı zincir, ters uçtan | — |
| `GV.fin.refreshCustomer(kod)` | `bekleyenTahsilat` türetir (L-08: sayaç yazılmaz, hesaplanır) | — |
| `GV.delivery.approve(kod, karar, tarih?, not?)` | `karar ∈ GV.delivery.kararlar` (`Onaylandı`/`Bekliyor`/`Revizyon istendi`); onay ile teslim durumunu **aynı eksende** tutar | Liste yalnız `musteriOnay` yazıyor, detay `durum`u da güncelliyordu; yetki ekseni liste tarafında `onay`, detay tarafında `duzenle`ydi |
| `GV.delivery.kararlar` | Karar sözlüğü | Süzgeçler ve mobil render bu listeden beslenir — üçüncü değer artık gizlenmiyor |
| `GV.task.transition(kod, hedef, ek?, not?)` | Görev durum geçişinin **tek** mutasyon noktası: hedefi `DB.taskTransitions[durum].next` içinde arar · yetkiyi doğrular · zorunlu alanları denetler · yan etkileri (`baslangic` · `revizyon` · `ilerleme` · `tamamlanma`) uygular · aktivite yazar | Tablo veride beş oturumdur duruyordu ama **uygulanmıyordu**: dokuz mutasyon yolunun yalnız ikisi ona bakıyordu, ikisi izin verilen rolleri yalnız **ipucu metni** olarak basıyordu, dördü kendi durumunu elle yazıyordu |
| `GV.task.nextSteps(kod)` | Bu görev + bu oturum için **yapılabilir** geçişler: `[{ hedef, etiket, tone, izin, eksik }]` | Ekran aksiyon butonu üretir; **uzun statü dropdown'ı basmaz** (REVİZE 02) |
| `GV.task.bekleme(kod, neden\|null, notu?)` | `beklemeNedeni` eksenini yazar/temizler; `neden ∈ DB.taskWaitReasons` | Bekleme bir DURUM değildir — görev "Devam ediyor" kalır, yalnız neyi beklediğini söyler (REVİZE 01) |
| `GV.task.onayGerekli(t)` | Ayrı onay adımı gerekli mi — **türetilir** (`onaylayan !== kontrolEden`) | Saklanmaz (L-08). Kontrol eden ile onaylayan aynı kişiyse kontrol zaten onaydır |
| `GV.task.yetkili(t, kural)` · `GV.task.eksikAlanlar(t, kural, ek?)` | Geçiş ön koşulları — ekran aynı mantığı ikinci kez yazmasın diye dışarı açık | Form ile detay ekranı farklı karar veremesin |
| `GV.zaman.onayla(kod, tarih?)` | Haftalık timesheet'i onaylar **ve kapsadığı her zaman kaydının `onay` alanını da** onaylar; kaç satırın onaylandığını döndürür (`{ satir, onaylanan, saat }`) | "Onaylı saat" iki farklı şey demekti: haftalık onay `DB.timesheets[].durum`u, satır onayı `DB.timelogs[].onay`ı yazıyordu ve ikisi birbirinden habersizdi. Dört kayıt kendi haftasıyla çelişiyordu (REVİZE 03) |
| `GV.zaman.iade(kod, gerekce)` | Timesheet'i iade eder **ve kapsadığı satırların onayını geri alır** | İade edilen haftanın satırları onaylı kalsaydı proje "gerçekleşen süre"si iade edilmiş emeği saymayı sürdürürdü |
| `GV.zaman.onaylaKayit(kod)` | Tek satır onayı. Kapsayan timesheet varsa **ona bağlıdır**: hafta onaylı değilse `{ ok:false, why:'haftalık onaya bağlı', timesheet, hafta }` döner | Yarım yol açık bırakmak iki eksenli hâle geri dönmek olurdu. Haftalık defterin kapsamadığı satır (bu veride 2026-07-27 öncesi) kendi başına onaylanabilir |
| `GV.zaman.timesheetOf(l)` · `GV.zaman.kayitlar(ts)` | Kapsam tanımı — hangi satır hangi haftaya düşer | Ekranda görünen kırılım ile onaylanan satırlar bir daha ayrışamaz; onay yordamı da aynı tanımı kullanır |
| `GV.proje.sure(kod)` | `{ planlanan, gerceklesen, faturalanabilir, tum, kayit, kapsam }` — `gerceklesen` = Σ **onaylı** zaman kaydı · `faturalanabilir` = Σ onaylı **ve** billable · `planlanan` = proje `tahminiSure`, yoksa Σ görev tahmini | `DB.projects[].harcananSure` elle yazılı bir sayıydı (14 kayıtta 9.125 saat, ~8.900'ü dayanaksız) ve **kaldırıldı**. Türetilebilen sayaç veriye yazılmaz (L-08) |

| `GV.proje.maliyet(kod)` | `{ personel, disKaynak, satinAlma, diger, toplam, gelir, brutKar, karlilikYuzde, kapsam, saat, maliyetsizPersonel }` — dört kalem ayrı ayrı türetilir | `DB.projects[].gerceklesenMaliyet` 14 kayıtta elle yazılı TEK bir rakamdı; hangi kalemden oluştuğu hiçbir yerde yazılı değildi ve proje detayı bunu iki sekmede "örtüşmeyebilir" uyarısıyla itiraf ediyordu. Alan **kaldırıldı** |
| `GV.proje.acik(p)` · `.bitti(p)` · `.kapali(p)` · `.arsivli(p)` · `.geciken(p)` | Proje durum ekseninin **tek tanımı**. `bitti` = işi teslim edilmiş (`durum ∈ teslimDurumlari` ‖ `gercekBitis` ‖ `%100`) · `kapali` = kaydı kapanmış (`Tamamlandı`/`İptal Edildi`) · `arsivli` = defterden çekilmiş · `acik` = `!bitti && !arsivli` · `geciken` = `acik && planlananBitis < DB.today`. Kod da kayıt da kabul eder | "Bu proje devam ediyor mu?" cümlesi **yedi ekranda** ayrı ayrı yazılıydı (`p.durum !== 'Teslim' && !p.arsiv`) ve REVİZE 05 durum sözlüğünü değiştirince yedisi birden **sessizce boş liste** üretirdi — sekmesi boşalan liste hata vermez (REVİZE 05) |
| `GV.proje.kapaliDurumlar` · `.teslimDurumlari` | `['Tamamlandı','İptal Edildi']` · `['Teslim Sürecinde','Tamamlandı']` | Form doğrulamaları ve rapor süzgeçleri kümeyi elle yazmasın diye dışarı açık |
| `GV.proje.kapanisKontrol(kod)` | Dokümanın sekiz kapanış kontrolü — `[{ anahtar, etiket, gecti, sayi, detay, href, olculdu }]`. **`olculdu:false` "geçti" DEĞİLDİR**: kontrol edilecek kayıt yoksa güvence de yoktur ve ekran onu ayrı tonla basar (L-13 · L-25) | Checklist ile kapanışın KENDİSİ aynı hesabı yapmak zorunda; ekranda yazılsaydı modal "tamam" derken yordam reddedebilirdi — REVİZE 02'de görev geçişinin başına gelen buydu |
| `GV.proje.kapat(kod, gerekce?, tarih?)` | `durum:'Tamamlandı'` + `gercekBitis` + `%100` + `faz:null` + aktivite. **Geçmeyen ölçülebilir madde varsa `gerekce` ZORUNLU** (`{ ok:false, why:'gerekçe', eksik:[…] }`); kapanış engellenmez, gerekçe istenir ve hareket geçmişine yazılır | Doküman "sade bir checklist göster" diyor, "kapanışı kilitle" demiyor. Gerekçe uydurulmaz — kullanıcıdan alınır |
| `GV.hr.icMaliyet(kod)` | `{ saat, kaynak, formul }` — `maas > 0` ise `maas × DB.company.isverenMaliyetKatsayisi ÷ DB.company.aylikCalismaSaati`, `saatlikUcret > 0` ise doğrudan o | Yeni alan **açılmadı** (V-46): içerik tamamen türetilebilir. `maas` XOR `saatlikUcret` sözleşmesi bozulmadı; iki girdi `DB.company`'de yazılı sabittir (VB-19) |
| `GV.hr.disKaynak(kod)` | İstihdam ilişkisi dış kaynak mı — `sozlesme === 'Hizmet sözleşmesi'` | R16 bu ekseni `calismaTipi` olarak resmîleştirecek; o zamana kadar **tek yer burasıdır**, ekranlar kendi kuralını yazmaz |

> **Yordamların veri bağımlılığı (L-34).** Çağıran ekran bunların hepsini
> `<script>` ile yüklemek zorundadır; eksikse yordam **hata vermez, eksik sayı
> üretir**:
>
> | Yordam | Okuduğu veri dosyaları |
> |---|---|
> | `GV.fin.*` | `crm.js` (`invoices` · `payments` · `customers`) · `work.js` (`milestones`) |
> | `GV.delivery.approve` | `work.js` (`deliveries`) |
> | `GV.delivery.kararlar` | — (sabit sözlük, hiçbir koleksiyon okumaz) |
> | `GV.task.*` | `work.js` (`tasks` · `taskTransitions` · `taskStatuses` · `taskWaitReasons` · `priorities` · `activities`) · `org.js` (`employees`) |
> | `GV.zaman.*` | `hr.js` (`timelogs` · `timesheets`) |
> | `GV.proje.sure` | `work.js` (`projects` · `tasks`) · `hr.js` (`timelogs`) |
> | `GV.proje.acik` · `GV.proje.bitti` · `GV.proje.kapali` · `GV.proje.arsivli` · `GV.proje.geciken` · `GV.proje.kayit` · `GV.proje.kapaliDurumlar` · `GV.proje.teslimDurumlari` | `work.js` (`projects`) |
> | `GV.proje.kapanisKontrol` · `GV.proje.kapat` | `work.js` (`projects` · `tasks` · `changeRequests` · `deliveries` · `milestones` · `activities`) · `crm.js` (`invoices`) · `misc.js` (`documents`) · `ops.js` (`supportPackages`) · `org.js` (`company`) |
> | `GV.proje.maliyet` | `work.js` (`projects`) · `hr.js` (`timelogs`) · `org.js` (`employees` · `company`) · **`ops.js` (`purchases`)** |
> | `GV.hr.*` | `org.js` (`employees` · `company`) |

> **`GV.proje.maliyet().kapsam` `sure()`dekinden BİR ADIM DAHA DARDIR:** maliyet
> için satır sayısı değil **ölçülen maliyet** gerekir. Onaylı saati de satın
> alması da olmayan projede `brutKar` ve `karlilikYuzde` **`null`** döner —
> ilk yazımda o projeler kârlılığı **%100** gösteriyordu, yani maliyeti sıfır
> sanmak kârı tavana yazıyordu. `diger` kalemi bu depoda her zaman `0`'dır ve
> bu bir **ölçüm değil kaynak boşluğudur** (V-47): projeye bağlı başka gider
> koleksiyonu yok, `DB.projectExpenses` bilerek açılmadı.

> **`GV.proje.sure().kapsam` yok sayılamaz.** `false` ise zaman defteri o
> projeyi **hiç kapsamıyor** demektir ve ekran **sıfır basmaz** — "0 saat
> çalışıldı" ile "defterde kayıt yok" aynı şey değildir (L-13). Bu depoda
> 14 projenin 7'sinde defter yok; hepsinde ekran bunu yazıyla söyler.
> Türetilmiş defter satırları `modul` alanı taşır ve `canon.js` eksen 27d
> `Σ satır = round(efor × ilerleme/100)` eşitliğini kilitler.

> **`yetki` listesi iki tür anahtar taşır ve ikisi ayrı çözülür.** `'pm'` bir
> **roldür** ("proje yöneticisi rolündeki herkes"); `'sorumlu'` · `'kontrolEden'` ·
> `'onaylayan'` · `'veren'` birer **ilişkidir** ("BU görevin sorumlusu"). Karıştırmak
> her geliştiriciyi her görevin sorumlusu yapardı.

> **Zorunlu alan adı gerçek bir alan olmalı.** `Kontrol bekliyor` kuralı beş oturum
> boyunca `ciktiLink` istiyordu; hiçbir görevde böyle bir alan yoktu, yani kural hiç
> uygulanamadı ve kimse fark etmedi. `canon.js` **eksen 25** artık bunu tarıyor.

**Dönüş sözleşmesi:** `{ ok:true, … }` ya da `{ ok:false, why:'yetki'|'kayıt yok'|'zaten kapalı'|'zorunlu'|… }`.
`why:'yetki'` ile birlikte `roller`, `why:'zorunlu'` ile birlikte `eksik` döner —
ekran kullanıcıya **neden olmadığını** söyleyebilsin diye.
Ekran `ok` değilse **başarı mesajı basmaz** (L-23). Yordam kendi aktivite kaydını yazar;
ekran ayrıca `DB.activities`'e yazmaz — iki kayıt doğardı.

**Uyarı (L-12):** yordam `DB.milestones` ve `DB.customers`'a dokunur; çağıran ekran
`work.js` ve `crm.js`'i **yüklemelidir**, yoksa zincir o ekranda sessizce yarım kalır.
`app-fatura` ve `app-tahsilat`'a `work.js` bu yüzden eklendi.

---

## 7. Zorunlu Durumlar

Her liste ve detay ekranı **üç durumu da** tanımlar:
- **Boş:** ikon + başlık + açıklama + birincil aksiyon
- **Yüklenme:** skeleton (spinner değil)
- **Hata:** açıklama + "Tekrar dene"

Ek: **yetkisiz (403)** durumu — menü gizlemeye ek olarak sayfa seviyesinde.

---

## 8. Yasaklar

- Sayfaya özel `<style>` bloğu
- `href="#"` veya çalışmayan buton — hedef yoksa `data-wip`
- Hardcode renk/spacing/radius/shadow — hepsi token
- Modal/drawer markup'ının `.page-main` içine konması
- Aynı liste mantığının ikinci kez yazılması

---

## 9. Destek ve Bakım Veri Sözleşmeleri (§18)

| Koleksiyon | Dosya | Sözleşme |
|---|---|---|
| `DB.slaPolicies` | `ops.js` | Kategori × öncelik matrisi. `ilkYanit` / `cozum` **dakika**, `etiket` gösterilen metin. Eşleşme: `p.kategori === t.kategori && (p.oncelik === t.oncelik \|\| p.oncelik === 'Tümü')` — 7 talebin 7'sinde tutar, fallback gerekmez. `DB.tickets[].sla` bu tablonun `etiket`'idir |
| `DB.tickets[].slaDurum` | `ops.js` | **İki eksenin kötüsü**: ilk yanıt ve çözüm. Tüketim = geçen / hedef; ≥1 `İhlal edildi` · ≥0,75 `Risk altında` · altı `Zamanında`. Açık talepte geçen süre `DB.today` gününün başlangıcına göre |
| `DB.supportPackages` | `ops.js` | Kota aritmetiği sabit: `kullanilan + kalan = aylikSaat × dönem ayı`. **"Dönem ayı" naif ay farkı DEĞİLDİR** — gün düzeltmeli sayımdır: `(yılFarkı × 12) + ayFarkı + (bitişGünü >= başlangıçGünü ? 1 : 0)`. Ölçüldü: bu formülle 7 paketin **7'si** tutuyor; gün düzeltmesi atlanırsa 5'i sapar (BKP-001 96 yerine 88 çıkar). Formül `app-destek-paket.html` ve `app-destek-paket-form.html`'de birebir aynı yazılıdır; üçüncü bir yerde yeniden yazılacaksa buradan alınır. `kalan`, o müşterinin taleplerindeki `kalanDestek` ile **birebir aynı**. `sozlesme` → `DB.contracts`, `yenileme` / `yenilemeTarihi` yenileme işareti |
| `DB.surveys` | `ops.js` | Bir müşterinin **yanıtlanmış** anketlerinin `puan` ortalaması = `DB.customers[].memnuniyet` (arşivli anketler dahil). `tur:'Destek talebi'` anketin puanı = `DB.tickets[].memnuniyet`. `durum:'Bekliyor'` → `puan`/`tavsiye` null, ortalamaya girmez. `tavsiye` 0-10 NPS: 9-10 destekleyici · 7-8 nötr · 0-6 kötüleyici |
| `DB.decisions` | `misc.js` | Yalnız `durum:'Tamamlandı'` toplantılara bağlanır. `gorev` doluysa `DB.tasks`'ta karşılığı vardır |
| `DB.bugs[].siddet` | `work.js` | **`DB.priorities` kümesidir** (`Kritik/Yüksek/Orta/Düşük`), `DB.impacts` (`Çok yüksek/…`) **değildir**. Hatadan görev üretilirken eşleme: şiddet `Kritik` → görev `etki` `Çok yüksek`, diğer üçü birebir |
| `DB.deliveries[].moduller` · `.test` | `work.js` | `moduller` **dizidir** (bir teslim çok modül kapsar); boş dizi = projenin modül kırılımı yok, kapsam proje ekseninde. `test` = teslimi kabule bağlayan koşum |
| `DB.tests[].moduller` · `.sprint` | `work.js` | Koşumun kapsadığı modüller (**dizi**) ve düştüğü sprint. `sprint` null = koşum tarihi hiçbir sprint aralığına girmiyor — en yakına yuvarlanmaz |
| `DB.bugs[].test` · `.sprint` · `.destek` · `.gorev` | `work.js` | Dördü de **tekil** bağ. `sprint` = hatanın **ele alındığı** sprint. `gorev` hata↔görev bağının **tek yönüdür** — `DB.tasks[].hata` ayna alanı **yoktur** ve doğmadığı `canon.js` eksen 15'te kontrol edilir |
| `DB.projectMilestones` | `work.js` | **REVİZE 06.** Proje OLAYI — `DB.milestones` (ödeme taksiti) ile aynı şey **değildir** ve para alanı **taşımaz**; `canon.js` eksen 30a bunu kilitler. Alanlar: `kod · proje · baslik · tarih · sorumlu · durum · teslimat · aciklama`. 12 kaydın 5'i `DB.deliveries`ten, 7'si tamamlanmış taksitten **türetildi**; kaynağı her kaydın `aciklama`sında yazılı (L-13). Adı bir ÖDEME olayını anlatan taksit (`MS-018 'Sözleşme peşinatı'`) bilerek alınmadı. 14 projenin 6'sında kayıt var, 8'inde **yok** ve ekran bunu yazıyla söyler |
| `DB.milestones[].milestone` | `work.js` | Taksitin **isteğe bağlı** proje milestone'u — dokümanın *"İstenirse ödeme kaydında İlgili Milestone seçilebilir"* cümlesinin karşılığı. Bağ **ödeme kaydında** durur, milestone'da ayna alan **yoktur** (§9d). 19 taksitin 12'sinde dolu; bir milestone'a en fazla **bir** taksit |
| `DB.deliveries[].milestone` | `work.js` | Teslimin karşılık geldiği taksit — **veride yazılı tekil bağ**, tarih yakınlığından türetilmez (L-13). Bir milestone'a en fazla bir teslim. `musteriOnay` durum değeridir: `Onaylandı` / `Bekliyor` / `Revizyon istendi`; `'—'` sentinel'i kullanılmaz |

---

## 9b. Finans Para Konvansiyonu (VB-01 / VB-02 — kapandı)

> **Tek konvansiyon.** Aynı alanda iki eksen yaşayamaz (lessons **L-13**).
> Kaynak yorum: `misc.js` → `DB.contracts` başlığı.

| Alan | Eksen | Kural |
|---|---|---|
| `DB.contracts[].tutar` | **NET** (KDV hariç) | Sözleşme bedelinin tek eksenidir |
| `DB.contracts[].kdvOran` · `.kdv` | — | KDV yüzdesi ve hesaplanan tutar (tümü %20) |
| `DB.contracts[].toplam` | **BRÜT** | `tutar + kdv` — **ekranda gösterilen** bedel |
| `DB.milestones[].odeme` | **NET** | Taksitin net tutarı = bağlı faturanın `tutar`ı |
| `DB.milestones[].taksit` · `.sozlesme` | — | Ödeme planındaki sıra (1 tabanlı) + bağlı sözleşme |
| `DB.invoices[].tutar / .vergi / .toplam` | net / KDV / brüt | `toplam = tutar + vergi`; `tutar` = milestone `odeme` |
| `DB.payments[].tutar` | **BRÜT** | Faturanın `toplam`ı |
| `DB.projects[].sozlesmeTutari` | **NET** | Sözleşmenin `tutar`ı |
| `DB.maintenance[].maliyet` · `DB.policies[].prim` · `DB.vehicleExpenses[].tutar` · `DB.fuelLogs[].tutar` | **BRÜT** (KDV dahil) | Filo tarafında **ödenen tutar** ekseni — fatura brütü. Ölçüldü: 8 gider kaydının 3'ü kaynak kaydın tutarıyla birebir aynı (`AGD-2026-051` 34.800 = `BKM-2026-020.maliyet` · `AGD-2026-056` 8.400 = `PLC-2026-011.prim` · `AGD-2026-057` 42.000 = `PLC-2026-012.prim`), yani gider kaydı kaynak tutarı **olduğu gibi** taşır, net'e çevirmez. Etikette "(KDV dahil)" yazılır |
| `DB.employees[].maas` · `.saatlikUcret` | **BRÜT** | Aylık maaş ve saatlik ücret çalışan brütüdür; işveren SGK payı **dahil değildir**. `app-personel-detay` "Aylık brüt maaş" ekseniyle aynı. `saatlikUcret` anahtarı yalnız o eksende çalışanda vardır (16 kaydın 1'i); orada `maas:0` "uygulanmaz" işaretidir |
| `DB.projects[].butce` · `.gerceklesenMaliyet` | **NET** | İç bütçe ve gerçekleşen maliyet — müşteriye kesilen bedel değil, şirketin kendi gider ekseni. 8 projenin 8'inde `butce ≤ sozlesmeTutari`; `gerceklesenMaliyet` bütçeyi aşabilir (PRJ-2026-006: 139.000 / 120.000). `app-proje-detay` ve `app-proje-form` "(KDV hariç)" etiketiyle basar |
| `DB.customers[].bekleyenTahsilat` | **BRÜT** | Açık (durumu `Ödendi` olmayan) tahsilatlarının toplamı. 12 müşterinin 12'sinde birebir doğrulandı |
| `DB.customers[].toplamCiro` | **NET** | Ömür boyu net ciro; DB'deki sözleşmelerinin `tutar` toplamından **küçük olamaz** |
| `DB.quotes[].araToplam` · `.indirim` · `.vergi` · `.toplam` | net / net / KDV / **BRÜT** | Zincir: `net = araToplam − indirim` → `vergi = net × vergiOran/100` → `toplam = net + vergi`. Doğrulandı, 3/3 teklifte tutar |
| `DB.leads[].butce` | **NET** | Müşterinin beyan ettiği tahmini bütçe. Tekliften türetilmez (beyan, ölçüm değil) ama proje genelindeki **tek eksen** kuralına uyar |
| `DB.supportPackages[].tutar` | **NET** | Paket bedeli. `BKP-001` = `SZL-2026-022.tutar` (180.000) ile birebir doğrulandı |
| `DB.purchases[].tahminiMaliyet` | **NET** | Talebin tahmini bedeli. Doğan siparişin `tutar`ı ile birebir (3/3 doğrulandı) |
| `DB.supplierQuotes[].fiyat` | **NET** | Teklif edilen bedel — talep ve sipariş ile aynı eksende |
| `DB.orders[].tutar / .vergi / .toplam` | net / KDV / **BRÜT** | `toplam = tutar + vergi` |
| `DB.analyses[].tahminiBedel` | **NET, indirim öncesi** | İç maliyet **değil**, teklifin `araToplam`'ı. Teklife dönmüş 3 analizin 3'ünde birebir; indirim sonrası netle 2/3, brütle 0/3. Ad VB-16'da `maliyet`ten çevrildi — eski ad bir ekranın kârlılık hesaplayıp sessizce yanlış sonuç vermesine açıktı. **İç maliyet ekseni veride yoktur** |
| `DB.referrers[].ciro` · `.sabitBedel` | **NET** | Yönlendirenin getirdiği **ömür boyu** net ciro; `DB.customers[].toplamCiro` ile aynı eksen. Bağlı müşterilerin toplamından **küçük olamaz** (sistem öncesi yönlendirmeler dahildir) — 8 kaydın 4'ünde birebir, 4'ünde büyük |
| `DB.referrers[].komisyonToplam` · `.odenen` · `.bekleyen` | **NET** | Komisyon kayıtlarından türetilir: `komisyonToplam = Σ DB.commissions[referans].tutar` · `odenen = Σ durum:'Ödendi'` · `bekleyen = komisyonToplam − odenen`. 8 kaydın 8'inde birebir doğrulandı. Ad VB-04'te `hakedis`ten çevrildi — **inşaat terimi yasağı** (CLAUDE.md · PROMPT §1). `DB.commissions[].kazanimTarihi` de aynı turda `hakedisTarihi`den çevrildi |
| `DB.suppliers[].toplamTutar` | **NET** | Ömür boyu iş hacmi. Ölçüldü: brüt olsaydı /1,2 tam liraya inerdi, 6 tedarikçinin 3'ünde inmiyor. TDR-003: 126.000 / 3 = 42.000 = `SAT-2026-015` net `tahminiMaliyet`i |

**TEKLİF → SÖZLEŞME AKTARIMI (VB-19, 8. oturumda ölçülüp düzeltildi):**
`DB.contracts[].tutar` teklifin **NETİNE** eşittir (`quote.araToplam − quote.indirim`),
**brütüne değil**. Brütü almak KDV'yi zincirde ikinci kez uygular.

Ölçüm: teklifi yazılı 3 sözleşmenin **3'ünde de** `tutar` teklifin brütünü taşıyordu
(600.000 / 354.000 / 1.104.000 — hepsi teklif netinin tam 1,2 katı). Hata **sessizdi**,
çünkü zincirin geri kalanı bu yanlış çapaya göre kendi içinde tutarlıydı:
Σ taksit = tutar · fatura = taksit · tahsilat = fatura brütü · ciro = Σ tutar.
Bu yüzden eksen 9/10/11 hiçbir çelişki görmüyordu. Bağımsız çapa `toplamCiro` oldu:
7 müşterinin 5'inde `Σ contract.tutar`'a **birebir** eşit, `Σ(tutar/1,2)`'ye değil —
yani `tutar` gerçekten NET eksenidir ve bozuk olan aktarımdı.

Düzeltmede zincirin tamamı yeniden dengelendi: 3 sözleşme · 11 taksit · 9 fatura ·
9 tahsilat · 3 proje `sozlesmeTutari` · 3 müşteri `toplamCiro`/`bekleyenTahsilat`.
Taksitler oranı korunarak yeniden dağıtıldı, kuruş artığı **son taksite** yazıldı
(SZL-2025-018: 5 × 153.333 + 153.335 = 920.000). `canon.js` **eksen 18** bunu her turda
doğrular.

**Ödeme planı bütünlüğü:** Projeli her sözleşmenin taksit seti `DB.milestones`'ta **tamdır** —
`Σ odeme = sözleşme tutarı` ve `taksit` numaraları 1..N boşluksuzdur (19 milestone / 6 sözleşme).
Proje bazlı olmayan sözleşme (SZL-2026-022, aylık bakım) milestone tutmaz, aylık fatura olarak yürür.

**Ekranda gösterim:** para alanı yazılırken hangi eksende olduğu **etikette** belirtilir
("Sözleşme bedeli (KDV hariç)" · "Genel toplam (KDV dahil)"). Net ve brüt aynı kolonda karışmaz.

`canon.js` eksen 9 (net+KDV=brüt), 10 (Σ taksit = sözleşme neti, taksit sırası) ve 11
(`toplamCiro` ↔ sözleşmeler) bunu her wave sonunda doğrular.

---

## 9c. Tedarikçi Puan Eksenleri (VB-03 — kapandı)

**İki ayrı eksendir, birbirinin yerine kullanılamaz.** Kaynak yorum: `ops.js` → `DB.suppliers` başlığı.

| Alan | Ne ölçer | Ekran etiketi |
|---|---|---|
| `DB.supplierQuotes[].puan` | **Yalnız o teklif**: fiyat, teslim süresi, garanti, ödeme koşulu, teknik uygunluk. Aynı tedarikçinin iki teklifi farklı puan alabilir | **"Teklif puanı"** |
| `DB.suppliers[].puan` | **Tedarikçinin tüm sipariş geçmişi**: teslim zamanlaması, kalite, satış sonrası destek, ödeme uyumu. Talepten bağımsız, yavaş değişir | **"Tedarikçi genel puanı"** |

İkisi aynı hücrede gösterilmez; aynı ekranda gösteriliyorsa **ayrı satır/kolon** olur.
Uygulandığı ekranlar: `app-satinalma-teklif.html` (karşılaştırma matrisinde iki ayrı satır) ·
`app-tedarikci.html` (yalnız genel puan).

---

## 10. QA Script'leri (scratchpad — orkestratöre ait)

| Script | Ne yapar | Beklenen |
|---|---|---|
| `qa.js "a.html,b.html" [rol]` | 1440/768/390 · konsol hatası · yatay taşma · sayfaya özel `<style>` · `href="#"` | `TEMİZ — hata yok, taşma yok` |
| `canon.js` | 7 canonical eksen: müşteri kartı ↔ işlem · fatura ↔ tahsilat · komisyon ↔ yönlendiren · SLA politikası ↔ talep · bakım paketi ↔ talep · anket ↔ müşteri/talep · `slaDurum` ↔ hesap | `TEMİZ — N kontrol` |
| `dbref.js` | Her ekranın okuduğu `DB.<koleksiyon>` ↔ yüklediği veri dosyası (lessons L-12) | `TEMİZ — N ekran` |
| `dep.js` | **"Yordamın İÇERİDEN okuduğu koleksiyon bu ekranda yüklü mü?"** (L-34) — sözleşme §6b tablosundan **okunur**, elle yazılmaz; çağrı kaynağı ekranın markup'ı **ve yüklediği ortak js dosyasıdır** (`app-panel` → `dashboard.js` → `GV.proje.maliyet`). `dbref.js` bunu göremez: koleksiyon adı ekranda değil yordamın içinde geçer. İhlalin üç sınıfı: veri dosyası yüklenmiyor · `domain.js` yüklenmiyor · yordamın §6b'de satırı yok | `TEMİZ — N ekran, M çağrı` |
| `links.js` | Kırık hedef · BUILT'te olmayan ekran · hayalet BUILT kaydı · yetim ekran. Üretilmemiş hedefleri **kuyruk** olarak listeler, hata saymaz | `TEMİZ` + kuyruk listesi |
| `gate.js [roller]` | Tüm ekranlar × roller: konsol hatası, 403 sayımı, boş sayfa | `TEMİZ` |
| `tabs.js "a.html" [roller]` | Detay ekranının **her sekmesini** tek tek tıklar, konsol hatası + boş aktif panel arar (L-12 sınıfı: açılış QA'si sekme içini göremez) | `TEMİZ — N sekme tıklaması` |
| `listen.js "a.html" [rol]` | 3× `GV.refresh()` sonrası `document` üzerindeki **net** dinleyici sayısının artmadığını ölçer (L-16). Çağrı değil net sayılır — `GV.on` her turda söküp bağlar | `TEMİZ — N ekran` |
| `esc.js ["a.html"] [rol]` | Etiket düğümlerinde **ham HTML metni** arar — escape edilmemesi gereken yer escape edilmişse `<span …>` ekranda yazı olarak görünür. Konsol hatası vermez, `qa.js` göremez | `TEMİZ — N ekran` |
| `grip-qa.js` | Rail tutamağı: geometri, yüzey rengi, hover yakalama noktaları, odak, içerik örtme | `TEMİZ — tüm ölçümler geçti` |
| `act.js` | **"Bu buton gerçekten bir şey yapıyor mu?"** Her toplu işlem / satır aksiyonu / form kaydet tetiklenir, DB parmak izi karşılaştırılır. Hüküm: MUTASYON · YÖNLENDİRME · PANEL · ÇIKTI · DÜRÜST RED (sağlıklı) · 🔴 YALAN · ⚫ ÖLÜ (ihlal). Ölçülemeyenler ayrı sayılır: girdi soran panelin ikinci adımı, ulaşılamayan toplu işlem (L-23) | `TEMİZ` + ihlal sayısı |
| `ctl.js` | **"Kontrol ile etiketi arasında boşluk var mı, kontroller tasarım sisteminde mi?"** Her ekranda filtre paneli · kolon yöneticisi · çıktı modalı da açılır; kontrol ile etiket metninin **gerçek piksel aralığı** Range ile ölçülür (UID-08/09) | `TEMİZ` |
| `pers.js` | **"Kişi alanı ekranda AD gösteriyor mu, KOD değil?"** `canon.js` eksen 24 veride kodun yazılı olduğunu ölçer; bu script kodun ekrana **sızmadığını**. İhlal, kodun **birincil ad konumunda** durmasıdır (`.cell-main` · `.gv-tl-who` · sınıfsız `td`/`dd`); `.cell-sub` / `.cell-code` ikincil etiketi **meşrudur** | `TEMİZ — N vaka` |
| `akt.js` | **"Detay ekranının Aktivite sekmesi gerçekten DOLU mu?"** `canon.js` eksen 22 veriyi ölçer (koleksiyonun en az bir kaydında aktivite var mı), `akt.js` kaydı `?id=` ile açıp sekmeyi tıklar ve `.gv-tl-item` sayar. **İkisi aynı şeyi ölçmez:** `app-proje-hata-detay` bağlı görevin hareketlerini de bastığı için `DB.bugs` boşken bile timeline gösterebilir — canon koleksiyonun kendi kapsamını, `akt.js` kullanıcının gördüğünü ölçer | `TEMİZ — N ekran` |
| `bag.js` | **"§22 bağı EKRANDA görünüyor mu?"** `canon.js` bağın veride yazılı olduğunu ölçer; bu script kullanıcıya **ulaştığını** ölçer — ikisi ayrı sorudur (görev detayı üç kaynağın hiçbirini basmıyordu). Her hüküm bir olumlu + bir olumsuz vakayla kurulur (L-24) | `TEMİZ — N vaka` |
| `xport.js` | **"Çıktı ekrandaki bilgiyi taşıyor mu?"** `ui.js` bellekte yamalanıp her `GV.list` örneğinin kolonları ve kayıtları okunur; her hücrenin EKRAN değeri (`render`) ile ÇIKTI değeri (`exportValue` ‖ `r[key]`) karşılaştırılır (UID-07) | `TEMİZ — N kolon` |

> `canon2.js` / `canon3.js` / `ref.js` **artık yok** — üçü de `canon.js` içinde birleşti.
> Eski `qa-links.js` kendi hardcode ettiği 8 sayfalık listeye göre karar veriyordu ve
> yayındaki her ekranı "kırık" sayıyordu; yerini `links.js` aldı.

---

## 9d. Modüller Arası Bağ Alanı Sözleşmesi (VB-05 / VB-07 / VB-08 — kapandı)

> **Tek kural (ders L-13):** Bir kaydı başka bir kayda bağlayan bilgi **veride yazılı olur**.
> Tarih yakınlığı, tedarikçi eşleşmesi, kategori benzerliği ve etiket metni **bağ değildir**.
> Bağı olmayan kayıt **bağsız bırakılır** ve gerekçesi `assumptions.md`'ye yazılır.

**KİŞİ KURALI (VB-12 · VB-13 — 11. oturum):** Bir kişiyi gösteren alan **kod** taşır,
**ad değil**. Ad tek yerde tutulur (`DB.employees` · `DB.contacts`) ve gösterimde
`DB.empName` / `DB.contactName` ile çözülür. Ad üzerinden kurulan bağ, ad değişince
sessizce kopar; bu yüzden `app-musteri-yetkili-form` bir "ad kaskadı" yazmak zorunda
kalmıştı — kaskad çevrimle birlikte **silindi**.

**Yön kuralı:** Bağ **doğan / bağımlı** kaydın üstünde tutulur, hedefte ayna alan **açılmaz**.
İki yönlü bağ zamanla ayrışır ve hangisinin doğru olduğu belirsizleşir.

| Bağ | Alan | Ters yönde okuma |
|---|---|---|
| destek talebi → görev | `DB.tasks[].destek` | `DB.tasks.filter(t => t.destek === kod)` |
| destek talebi → hata | `DB.bugs[].destek` | `DB.bugs.filter(b => b.destek === kod)` |
| destek talebi → değişiklik | `DB.changeRequests[].destek` | ⚠️ `.talep` **başka eksendir** (talebi açan taraf) |
| hata → görev | `DB.bugs[].gorev` | `DB.bugs.filter(b => b.gorev === kod)` — görevde ayna alan **yok** |
| hata → test koşumu | `DB.bugs[].test` | `DB.bugs.filter(b => b.test === kod)` — bir hata **en fazla bir** koşuma bağlanır |
| hata → sprint | `DB.bugs[].sprint` | ele alındığı sprint (açıldığı değil) |
| koşum → modül / sprint | `DB.tests[].moduller` (dizi) · `.sprint` | |
| teslim → modül / kabul koşumu | `DB.deliveries[].moduller` (dizi) · `.test` | |
| teslim → taksit | `DB.deliveries[].milestone` | tekil |
| ödeme taksiti → proje milestone'u | `DB.milestones[].milestone` | `DB.milestones.filter(m => m.milestone === kod)` — milestone'da ayna alan **yok**, en fazla bir taksit (canon eksen 30c/30d) |
| proje milestone'u → teslim | `DB.projectMilestones[].teslimat` | tekil; teslim **aynı projede** olmalı (eksen 30b) |
| talebi açan yetkili | `DB.tickets[].acan` | **`YTK-*` KODU** (VB-12). Yetkili talebin müşterisine ait olmalı — canon eksen 24 |
| görüşülen yetkili | `DB.interactions[].kontak` | **`YTK-*` KODU**; ADAY görüşmesinde **null** ve ad `DB.leads[].yetkili`'den okunur. Gösterim: `DB.interactionContact(i)` |
| aktiviteyi yazan kişi | `DB.activities[].kisi` | **`EMP-*`** (ya da `YTK-*`) KODU. `GV.activity` adı çözer; oturum yoksa **null**, uydurma ad yazılmaz |
| yönlendiren → müşteri yetkilisi | `DB.referrers[].kontak` | Aynı kişiyse `YTK-*`. Bağ varsa ad/tel/e-posta/pozisyon **birebir** aynı; bağ yoksa aynı iletişim bilgisi ikinci kez geçemez (VB-13, eksen 24b) |
| demirbaş → sipariş | `DB.assets[].siparis` | `DB.assets.filter(a => a.siparis === kod)` — siparişte ayna alan **yok** |
| araç → sipariş | `DB.vehicles[].siparis` | `DB.vehicles.filter(v => v.siparis === kod)` — demirbaş tarafının ikizi, siparişte ayna alan **yok**. Siparişin **neti** aracın `alisBedeli`ne eşittir (canon eksen 21b). Kiralık araçta alan **daima null** |
| aday → müşteri | `DB.leads[].musteri` | ⚠️ Alan "adayın **ilişkili olduğu** müşteri kaydı"dır. §22 madde 6 ("kazanılan satış → müşteri") karşılığı `asama:'Kazanıldı'` **ile birlikte** okunur; mevcut müşteriden doğan fırsatta da dolu olur. `DB.customers[].lead` ayna alanı **açılmaz** (V-38) |
| sohbet mesajı → görev | `DB.messages[].gorev` | `DB.messages.filter(m => m.gorev === kod)` — `DB.bugs[].gorev` ile aynı desen; `DB.tasks[].kanal`/`.mesaj` ayna alanı **açılmaz** (V-38) |

**Ekranda gösterim kuralı:** Bağ varsa `tone:'ok'` bir `GV.notice` ile "bağ veride yazılı"
denir ve kaynak kayıt adıyla gösterilir. Bağ yoksa aynı projenin kayıtları **bağlam listesi**
olarak gösterilebilir ama **"bağ değildir"** diye açıkça etiketlenir ve satır rozeti
`Aynı proje` olur — `Aday` / `Güçlü aday` gibi bir eşleşme iması **kullanılmaz**.

**Eksen 15 yetmez — eksen 21 de koşar (VB-28 · L-22).** Eksen 15 "bağ **hedefi** gerçekten
var mı" diye sorar; **boş alan her zaman geçer**. Eksen 21 tersini sorar: "bağ **verilmiş
mi**" — §22'nin 14 bağının her biri en az bir kayıtta dolu olmalı, ve doluluk sayısı
raporda **ayrıca yazılır** (L-19 · L-25). Ayrıca eksen 21c yasak **ayna alanların
doğmadığını** ölçer: `DB.tasks[].kanal`/`.mesaj` ve `DB.customers[].lead`.
Bağın **ekranda göründüğü** ayrı bir sorudur ve `tasks/qa/bag.js` ile ölçülür.

`canon.js` **eksen 15** her turda doğrular: bağ hedefi gerçekten var mı · bağ verilen
sprint/modül/koşum **aynı projede** mi · bir koşuma bağlı hata sayısı `basarisiz`i aşıyor mu ·
bir siparişin demirbaş grubunun Σ `alisFiyati`'ı siparişin **netine** eşit mi ·
`DB.tasks[].hata` ayna alanı doğmuş mu.
