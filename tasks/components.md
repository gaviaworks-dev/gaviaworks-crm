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
  bulk:[{key,label,icon,confirm}],
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
| Kolon yöneticisi | **`GV.list` içi** — `openCols()` (ui.js) | göster/gizle · sırala · genişlik · kayıtlı görünüm (`localStorage` `gv.cols.<id>`). ⚠️ `GV.cols()` **yoktur**, dışarıdan çağrılamaz |
| Filtre drawer | **`GV.list` içi** — `openFilters()` (ui.js) | `cfg.filters[]`'ten kurulur, aktif filtre çipleri. ⚠️ `GV.filters()` **yoktur** |
| Çıktı | **`GV.list` içi** — `doExport(rows, fmt)` (ui.js) | `cfg.export[]` formatları. ⚠️ `GV.export()` **yoktur**; seçili kapsamı dışa aktarma da yok (UID-07) |
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
| `DB.analyses[].maliyet` | **NET, indirim öncesi** | Alan adı yanıltıcı: iç maliyet değil, **teklifin `araToplam`'ı**. Teklife dönmüş 3 analizin 3'ünde birebir; indirim sonrası netle 2/3, brütle 0/3. Ad **VB-16** ile düzeltilecek |
| `DB.referrers[].ciro` · `.sabitBedel` | **NET** | Yönlendirenin getirdiği **ömür boyu** net ciro; `DB.customers[].toplamCiro` ile aynı eksen. Bağlı müşterilerin toplamından **küçük olamaz** (sistem öncesi yönlendirmeler dahildir) — 8 kaydın 4'ünde birebir, 4'ünde büyük |
| `DB.referrers[].hakedis` · `.odenen` · `.bekleyen` | **NET** | Komisyon kayıtlarından türetilir: `hakedis = Σ DB.commissions[referans].tutar` · `odenen = Σ durum:'Ödendi'` · `bekleyen = hakedis − odenen`. 8 kaydın 8'inde birebir doğrulandı. (`hakedis` alan adı **VB-04** ile yeniden adlandırılacak) |
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
| `links.js` | Kırık hedef · BUILT'te olmayan ekran · hayalet BUILT kaydı · yetim ekran. Üretilmemiş hedefleri **kuyruk** olarak listeler, hata saymaz | `TEMİZ` + kuyruk listesi |
| `gate.js [roller]` | Tüm ekranlar × roller: konsol hatası, 403 sayımı, boş sayfa | `TEMİZ` |
| `tabs.js "a.html" [roller]` | Detay ekranının **her sekmesini** tek tek tıklar, konsol hatası + boş aktif panel arar (L-12 sınıfı: açılış QA'si sekme içini göremez) | `TEMİZ — N sekme tıklaması` |
| `listen.js "a.html" [rol]` | 3× `GV.refresh()` sonrası `document` üzerindeki **net** dinleyici sayısının artmadığını ölçer (L-16). Çağrı değil net sayılır — `GV.on` her turda söküp bağlar | `TEMİZ — N ekran` |
| `esc.js ["a.html"] [rol]` | Etiket düğümlerinde **ham HTML metni** arar — escape edilmemesi gereken yer escape edilmişse `<span …>` ekranda yazı olarak görünür. Konsol hatası vermez, `qa.js` göremez | `TEMİZ — N ekran` |
| `grip-qa.js` | Rail tutamağı: geometri, yüzey rengi, hover yakalama noktaları, odak, içerik örtme | `TEMİZ — tüm ölçümler geçti` |

> `canon2.js` / `canon3.js` / `ref.js` **artık yok** — üçü de `canon.js` içinde birleşti.
> Eski `qa-links.js` kendi hardcode ettiği 8 sayfalık listeye göre karar veriyordu ve
> yayındaki her ekranı "kırık" sayıyordu; yerini `links.js` aldı.

---

## 9d. Modüller Arası Bağ Alanı Sözleşmesi (VB-05 / VB-07 / VB-08 — kapandı)

> **Tek kural (ders L-13):** Bir kaydı başka bir kayda bağlayan bilgi **veride yazılı olur**.
> Tarih yakınlığı, tedarikçi eşleşmesi, kategori benzerliği ve etiket metni **bağ değildir**.
> Bağı olmayan kayıt **bağsız bırakılır** ve gerekçesi `assumptions.md`'ye yazılır.

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
| demirbaş → sipariş | `DB.assets[].siparis` | `DB.assets.filter(a => a.siparis === kod)` — siparişte ayna alan **yok** |

**Ekranda gösterim kuralı:** Bağ varsa `tone:'ok'` bir `GV.notice` ile "bağ veride yazılı"
denir ve kaynak kayıt adıyla gösterilir. Bağ yoksa aynı projenin kayıtları **bağlam listesi**
olarak gösterilebilir ama **"bağ değildir"** diye açıkça etiketlenir ve satır rozeti
`Aynı proje` olur — `Aday` / `Güçlü aday` gibi bir eşleşme iması **kullanılmaz**.

`canon.js` **eksen 15** her turda doğrular: bağ hedefi gerçekten var mı · bağ verilen
sprint/modül/koşum **aynı projede** mi · bir koşuma bağlı hata sayısı `basarisiz`i aşıyor mu ·
bir siparişin demirbaş grubunun Σ `alisFiyati`'ı siparişin **netine** eşit mi ·
`DB.tasks[].hata` ayna alanı doğmuş mu.
