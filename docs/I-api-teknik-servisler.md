# I. API ve Teknik Servisler

> **Neyden türetildi.**
> Bölüm 1 **ölçülmüştür**: `assets/js/ui.js` (1943 satır) ve `assets/js/shell.js` (975 satır)
> baştan sona okunarak `window.GV.*` ve `window.DB.*` yüzeyi çıkarıldı; hiçbir ad
> tahminle yazılmadı. Koleksiyon adları ve alan başlıkları `assets/data/*.js` (altı dosya)
> üzerinden sayıldı. Bölüm 2–3 **türetilmiştir**: `PROMPT.md` §26-I'nin on iki ekseni,
> ölçülen istemci yüzeyine bakılarak backend karşılığına çevrildi. Bileşen sözleşmeleri
> `tasks/components.md`'den alındı; sözlükte yazılıp kodda bulunmayanlar §1.9'da ayrı listelenir.
> **Bu projede gerçek bir API yoktur** — Bölüm 2 ve 3 tasarım önerisidir, mevcut durum değildir.

---

## 0. Kapsam ayrımı

| Bölüm | Ne anlatır | Doğruluk düzeyi |
|---|---|---|
| **1** | Bugün tarayıcıda gerçekten var olan istemci API'si | Ölçülmüş — her ad kodda görüldü |
| **2** | Gerçek bir backend gerekseydi modül başına hangi uçlar olurdu | Türetilmiş öneri |
| **3** | Modüllerin ortak kullanacağı kesişen teknik servisler | Türetilmiş öneri |
| **4** | Prototipin bilinen API açıkları, `localStorage` kalıcılıkları | Ölçülmüş — dürüst envanter |

Mimari gerçeklik: **buildless statik prototip.** Veri `assets/data/*.js` içinde global
`window.DB` altında bellekte durur. Ağ üzerinden yapılan tek istek `shell.js`'teki
`fetch('assets/img/icons.svg')` — ikon sprite enjeksiyonu (`injectSprite`, shell.js:890).
Bunun dışında **hiçbir HTTP çağrısı yoktur.** Mutasyonlar diziyi yerinde değiştirir ve
`GV.refresh()` ile yeniden çizilir; `location.reload()` yapılırsa değişiklik silinir
(shell.js:838 yorumu, ders L-15).

---

# BÖLÜM 1 — Mevcut istemci API yüzeyi (ölçülmüş)

## 1.1 Genel çerçeve

| Konu | Ölçülen durum |
|---|---|
| Global nesneler | `window.GV` (37 üst düzey anahtar), `window.DB` (80 koleksiyon/sabit + 10 yardımcı) |
| Tanım yeri | `GV.*` yalnız iki dosyada: `assets/js/shell.js` (12 anahtar), `assets/js/ui.js` (25 anahtar) |
| Yükleme sırası | `shell.js` önce (`GV.esc` / `GV.ico` orada tanımlı; `ui.js` başında `GV.esc \|\| fallback` ile okunur — ui.js:10-11) |
| Başlatma | `injectSprite().then(boot)` — sprite geldikten sonra shell kurulur (shell.js:970) |
| Yayılan olaylar | `gv:ready` · `gv:denied` (shell.js:947, `GV.refresh` shell.js:871) · `gv:tab` (ui.js:1268) |
| Belge düzeyi delegasyon | `[data-wip]` click + keydown (ui.js:1920/1926) · `[data-help]` click (ui.js:1935) |
| Oturum deposu | `sessionStorage['gv.session']` |
| Kalıcılık deposu | `localStorage`: `gv.cols.<id>` · `gv.views.<id>` · `gv.rp.<id>` · `gv.menu.collapsed` |

---

## 1.2 Shell / rol / yetki ailesi

| API | İmza | Dönüş | Tanım | Nerede kullanılıyor |
|---|---|---|---|---|
| `GV.shell` | nesne | — | shell.js:951 | rol/oturum ve breadcrumb işlemleri |
| `GV.shell.sections` | `{key:{ic,eyebrow,title,menu[]}}` | 15 bölümlük menü modeli | shell.js:21 | rail + bölüm menüsü render'ı |
| `GV.shell.railOrder` | `string[]` (15) | bölüm sırası | shell.js:170 | `renderRail` |
| `GV.shell.secByRole` | `{rol:[bölüm]}` (25 rol) | rol → görülebilir bölümler | shell.js:193 | `Perm.sec` |
| `GV.shell.session()` | `()` | oturum nesnesi veya `null` | shell.js:955 | ekranlarda "ben kimim" |
| `GV.shell.setSession(empKod, roleKey)` | iki string | yeni oturum nesnesi \| `null` | shell.js:956 | `index.html` rol seçimi |
| `GV.shell.clear()` | `()` | — | shell.js:961 | çıkış |
| `GV.shell.counters()` | `()` | 17 anahtarlı sayaç nesnesi | shell.js:962 → `counters()` shell.js:313 | menü rozetleri |
| `GV.shell.crumb(text)` | string | — | shell.js:963 | detay ekranlarında kayıt kodunu breadcrumb'a basar |
| `GV.session` | nesne (boot'ta yazılır) | `{emp,ad,ini,dep,depAd,rol,rolAd,eposta,girildi}` | shell.js:920 | ekranlar |
| `GV.counters` | nesne (boot'ta yazılır) | sayaç anlık görüntüsü | shell.js:927 | panel ekranları |
| `GV.perm` | nesne | — | shell.js:308 | yetki kapısı ve aksiyon gizleme |
| `GV.perm.role()` | `()` | aktif rol anahtarı (varsayılan `'stajyer'`) | shell.js:272 | |
| `GV.perm.matrix()` | `()` | `DB.permMatrix[rol]` veya güvenli varsayılan | shell.js:273 | |
| `GV.perm.sec(key)` | bölüm anahtarı | boolean | shell.js:279 | rail filtreleme, `can('musteriRapor')` |
| `GV.perm.item(it)` | menü kalemi | boolean | shell.js:284 | menü kalemi kısıtı (`it.roles`) |
| `GV.perm.can(action)` | `'ekle'\|'duzenle'\|'sil'\|'onay'\|'rapor'\|'finans'\|'maas'\|'log'\|'disaAktar'\|'personel'\|'gor'\|'musteriRapor'\|'personelRapor'` | boolean | shell.js:293 | buton/aksiyon gösterimi |
| `GV.perm.scope(action)` | aynı eksen | `'tum'\|'departman'\|'proje'\|'kendi'\|'yok'` | shell.js:302 | kapsam daraltma |
| `GV.perm.mask(value, action?)` | değer + eksen (vars. `'maas'`) | değer veya `'••••••'` | shell.js:304 | KVKK alan maskeleme |
| `GV.pageHead(cfg)` | `{eyebrow,title,sub,actions:[{label,icon,cls,href,id,run}]}` | — (DOM yazar) | shell.js:809 | her ekranın ilk çağrısı |
| `GV.refresh()` | `()` | — | shell.js:843 | veriyi **değiştiren** her aksiyonun sonu |
| `GV.on(el, type, fn, key?)` | kalıcı düğüm + olay + işleyici + tekil anahtar | — | shell.js:878 | `document`/`window` dinleyici birikmesini önler (L-16) |
| `GV.built` | `string[]` (135 dosya adı) | yayındaki ekran kaydı | shell.js:724 | `isBuilt` kaynağı |
| `GV.isBuilt(href)` | href | boolean (`http/mailto/tel/#` daima `true`) | shell.js:726 | rail hedef seçimi |
| `GV.markWip(root?)` | kök düğüm | — | shell.js:735 | yayında olmayan `href`'i düşürür, `data-wip` basar |
| `GV.ico(name, cls?)` | sprite adı | `<svg class="ic…"><use href="#…"></svg>` | shell.js:344 | tüm bileşenler |
| `GV.esc(s)` | herhangi | HTML-escape edilmiş string | shell.js:349 | tüm bileşenler |

**Rol/kapsam modeli (ölçülen):** `DB.permMatrix` 25 rol × 11 eksen
(`gor · ekle · duzenle · sil · onay · rapor · finans · maas · personel · log · disaAktar`).
Kapsam alanları dört değer alır: `tum` · `departman` · `proje` · `kendi` (+ `yok`).
Ekran seviyesinde ayrıca `SCREEN_PERM` haritası vardır (shell.js:179, 11 ekran) ve
`guard()` (shell.js:553) 403 markup'ını basıp `gv:denied` yayar.

**`counters()` anahtarları (17):** `havuz · bana · geciken · onay · bildirim · lead · teklif ·
hata · istalebi · destek · mesaj · izin · bakim · police · satinalma · tahsilat · dokuman`.
Hepsi `DB` üzerinden **anlık hesaplanır**, sabit değildir.

---

## 1.3 Liste ve rapor ailesi

### `GV.list(cfg)` — ui.js:440

Tek bileşen PROMPT.md §6'nın tamamını karşılar. **Gerçekten okunan** config anahtarları:

| Anahtar | Tip | Ne yapar |
|---|---|---|
| `mount` | selector \| düğüm | zorunlu; yoksa `null` döner |
| `id` | string | `localStorage` anahtar öneki (`gv.cols.<id>`, `gv.views.<id>`); yoksa `location.pathname` |
| `source` | dizi \| `function()` | veri hattının girişi (ui.js:516) |
| `key` | string | satır kimliği alanı (seçim, `data-id`) |
| `columns[]` | `{key,label,width,sortable,visible,locked,render(r,i),cellClass,sortValue(r),exportable,exportValue(r)}` | |
| `tabs[]` | `{key,label,icon,filter(r)}` | sayaçlar `tabRows()` ile veriden türetilir |
| `filters[]` | `{key,label,type:'multi'\|'daterange'\|'text'\|(diğer→select),options,test(r,v)}` | |
| `kpis[]` | `{label,icon,tone,href,calc(base,all),format(v),meta(base),metaTone}` | |
| `views[]` | `['table','card','kanban']` | 1'den fazlaysa görünüm anahtarı basılır |
| `kanban` | `{groupBy,columns?,card(r)}` | |
| `card(r,i)` / `mobile(r,i)` | fonksiyon | kart görünümü / mobil satır |
| `bulk[]` | `{key,label,icon,tone,confirm,run(ids)}` | `confirm` içindeki `{n}` seçili sayıyla değişir |
| `rowActions[]` | `{key,label,icon,cls,href\|href(r),run(rec,render),show(r)}` | `show(r)` false → aksiyon **hiç basılmaz** |
| `rowClass(r)` | fonksiyon | satır sınıfı |
| `search` | `{fields[],placeholder,extra(r)}` | `extra` türetilmiş arama metni (kod → ad) |
| `pageSize` · `defaultSort` · `defaultDir` | 10 / — / `'asc'` | |
| `archive` | `false` ise arşiv toggle'ı hiç basılmaz | arşiv testi: `r.arsiv===true \|\| r.aktif===false \|\| r.durum==='Arşivlendi'` |
| `export` | `false` ise çıktı butonu basılmaz | **format dizisi değildir** — dört format sabittir |
| `exportName` · `exportTitle` | string | dosya adı / çıktı başlığı |
| `emptyState` | `GV.empty` config'i | |
| `urlSync` | `false` ise URL'e yazmaz | |
| `onRender(all, state)` | fonksiyon | her çizimden sonra |
| `delay` | ms (vars. 260) | skeleton→veri geçiş süresi (`load()`, ui.js:1195) |

**Dönüş:** `{ state, refresh(), setTab(k), setFilter(k,v) }` (ui.js:1206).

**Veri hattı (ui.js:585):** `afterSort(afterFilters(afterSearch(afterArchive(afterTab(source())))))`.
Sayfalama bu sonucun dilimidir. **Filtre/sekme/arama değişince `reset()`** sayfayı 1'e döndürür ve seçimi temizler (ui.js:861).

**URL sözleşmesi (ui.js:481/494):** `t` sekme · `q` arama · `p` sayfa · `s` sıralama alanı ·
`d` yön · `v` görünüm · `arsiv=1` · `f_<filtrekey>` (çoklu değer `|` ile birleşir,
daterange `başlangıç~bitiş`). Yazma `history.replaceState` ile yapılır.

**Alt yüzeyler (ayrı `GV.*` adı YOKTUR, hepsi `GV.list` içindedir):**

| Yetenek | İç fonksiyon | Not |
|---|---|---|
| Kolon yönetimi | `openCols(anchor)` ui.js:1043 | göster/gizle + yukarı/aşağı sıralama + görünüm kaydet; `localStorage` |
| Gelişmiş filtre | `openFilters()` ui.js:980 | `GV.drawer` içinde alan tipli form; filtre yoksa toast |
| Aktif filtre çipleri | `renderAchips()` ui.js:621 | `data-rmfilter` tek tek kaldırma + "Filtreleri Temizle" |
| Çıktı | `openExport(rows)` ui.js:1115 + `doExport(rows,fmt)` ui.js:1148 | kapsam: seçili/filtreli/tümü · format: `xlsx` `csv` `pdf` `print` |
| Toplu işlem barı | `renderBulk()` ui.js:798 | seçili sayaç + aksiyonlar + "Seçimi bırak" |
| Kanban | `renderKanban(rows)` ui.js:752 | kolon başlığı tonu `GV.tone(key)`'den; **sürükle-bırak yok** |
| Sayfalama | `renderPager(total)` ui.js:771 | 10/25/50/100; `…` sıkıştırma |
| Yüklenme/hata | `state.loading` / `state.error` | `GV.skeleton` ve `GV.errorState` |

**Ölçülen çıktı davranışı:** `xlsx` seçimi gerçek XLSX üretmez — sekme ayraçlı metin,
`application/vnd.ms-excel` MIME'ı ve `.xls` uzantısıyla Blob olarak indirilir (ui.js:1180-1189).
`pdf` de gerçek PDF üretmez; yeni pencereye HTML basıp `window.print()` çağırır ve
"yazdırma penceresinden PDF olarak kaydedebilirsiniz" toast'ı gösterir (ui.js:1160-1177).

### `GV.report(cfg)` — ui.js:1726

| Anahtar | Tip |
|---|---|
| `mount` · `id` | selector · `localStorage` anahtarı (`gv.rp.<id>`) |
| `filters[]` | `{key,label,type:'select'\|'date'\|(diğer→text),options,value,all,placeholder}` |
| `reports[]` | `{key,label,icon,group,title,desc,rows(f),kpis[],charts(rows,f),table}` |
| `reports[].kpis[]` | `{label,icon,tone,format,calc(rows,f),meta(rows),metaTone}` |
| `reports[].charts(rows,f)` | `[{title,sub,html,legend,wide}]` döndürür |
| `reports[].table` | `GV.list` config'i; `mount`/`id`/`source`/`urlSync` bileşen tarafından **ezilir** (ui.js:1880-1886) |

**Dönüş:** `{ render(), state }`. **URL:** `?r=<rapor>&rf_<filtre>=<değer>` (`syncUrl`, ui.js:1743).
**Kayıtlı rapor:** `saveCurrent()` ui.js:1756 → `localStorage['gv.rp.<id>']`; `openSaved()` ui.js:1775 drawer'la geri yükler.

### `GV.chart` — ui.js:1523, atama 1650

| Fonksiyon | İmza | Dönüş |
|---|---|---|
| `GV.chart.bar(data, opt)` | `data:[{label,value,value2?,tone?}]`, `opt:{width,height,padL,money,showValues,label}` | SVG string; veri yoksa `GV.empty(...)` |
| `GV.chart.line(series, labels, opt)` | `series:[{values[]}]`, `opt:{width,height,money,area,label}` | SVG string; boş seri/etiket → `GV.empty(...)` |
| `GV.chart.donut(data, opt)` | `data:[{label,value,color?}]`, `opt:{size,thickness,center,centerSub,label}` | SVG string |
| `GV.chart.legend(data)` | `[{label,value,color?}]` | `.gv-legend` HTML |
| `GV.chart.spark(values, opt)` | sayı dizisi | küçük çizgi SVG'si |

Grafikler **saf SVG string** üretir — hiçbir grafik kütüphanesi yoktur.

---

## 1.4 Form ailesi

### `GV.form(cfg)` — ui.js:1291

| Anahtar | Not |
|---|---|
| `mount` | zorunlu |
| `id` | `beforeunload` tekil anahtarı: `gvform.dirty.<id>` (ui.js:1463) |
| `record` | mevcut kayıt; boş nesne = yeni kayıt modu |
| `sections[]` | `{title,desc,fields[]}` |
| `fields[]` | `{key,label,type,required,hint,placeholder,cols,options,min,max,rows,currency,multiple,value,onLabel,checkLabel,validate(value,data)}` |

**Gerçekten uygulanan alan tipleri (ui.js:1303-1345):** `textarea` · `select` · `switch` ·
`checkbox` · `radio` · `file` · `money` · `percent` · ve son `else` dalında
`date` · `number` · `email` · `tel` · `url` · (tanınmayan her şey →) `text`.

**Yerleşik doğrulama (ui.js:1403):** `required` · e-posta regex · telefon ≥10 hane ·
url `http(s)://` · `min`/`max` sayı aralığı · alan bazlı `validate(value, data)`.
Radyo grubunda seçili değer `:checked` üzerinden okunur (ui.js:1413-1416).

**Dönüş nesnesi (ui.js:1470):**

| Üye | İmza | Davranış |
|---|---|---|
| `submit()` | `()` | Doğrular; hata varsa toast basıp `null` döner. Temizse `dirty=false` yapıp değer nesnesini döndürür |
| `validate()` | `()` | `[{key,msg}]` dizisi; özet kutusunu ve alan hatalarını basar, ilk hatalı alana odaklanır |
| `read()` | `()` | Doğrulamadan ham değerler nesnesi |
| `isDirty()` | `()` | boolean |
| `setDirty(v)` | boolean | kaydettikten sonra uyarıyı kapatmak için |
| `el` | düğüm | mount |

**Bileşen kaydet butonu basmaz.** Buton `GV.pageHead` aksiyonlarına ya da sayfaya konur.

### `GV.upload(cfg)` — ui.js:1658

`GV.upload({mount, title, hint, accept, multiple, maxMB=20, files:[{ad,boyut}], onChange(picked)})`
→ `{ files(), clear(), el }`. Sürükle-bırak + boyut kontrolü (aşarsa `GV.toast(...,'danger')`).
**Hiçbir yere yükleme yapmaz** — seçilen dosyalar `{ad, boyut}` olarak bellekte listelenir.
`GV.form` içindeki `type:'file'` alanı aynı görünümü kendi içinde ayrıca kurar (ui.js:1374).

---

## 1.5 Overlay ailesi

| API | İmza | Dönüş | Tanım |
|---|---|---|---|
| `GV.modal(cfg)` | `{title,text,body,icon,tone,size,actions:[{label,icon,cls,close,onClick(close,el)}]}` | `{close(), el}` | ui.js:249 |
| `GV.drawer(cfg)` | `{title,body,side:'left'?,actions[],onOpen(el,close)}` | `{close(), el}` | ui.js:330 |
| `GV.confirm(cfg)` | `{title,text,body,tone,okLabel,cancelLabel}` | **`Promise<boolean>`** | ui.js:303 |
| `GV.result(cfg)` | `{title,text,body,tone,actions}` | modal handle | ui.js:321 |
| `GV.toast(text, kind, ms)` | `kind:'ok'\|'danger'\|'warn'\|'info'`, `ms` vars. 3600 | — | ui.js:224 |

Ortak davranış: `document.body`'ye basılır (asla `.page-main` içine değil), `Escape` kapatır,
`trapTab` odak tuzağı kurar (ui.js:239), `body.style.overflow` kilitlenir, kapanışta önceki
odak geri verilir. Kapatıcı düğüme `__gvClose` olarak asılır ki `GV.refresh()` açık
overlay'i kapatabilsin (ui.js:299/376, shell.js:863).

`action.onClick` **`false` döndürürse overlay kapanmaz** (ui.js:292) — doğrulama başarısızsa
modalı açık tutmanın yolu budur.

---

## 1.6 Durum ve parça bileşenleri

| API | İmza | Dönüş | Tanım |
|---|---|---|---|
| `GV.empty(c)` | `{icon,title,desc,action}` | HTML string | ui.js:383 |
| `GV.notice(c)` | `{tone:'info'\|'ok'\|'warn'\|'danger'\|'neutral', title, text, icon, actions:[{label,href,cls}]}` | HTML string | ui.js:395 |
| `GV.errorState(c)` | `{title,desc}` | HTML string; içinde `[data-retry]` butonu | ui.js:412 |
| `GV.skeleton(type, n)` | `type:'card'\|(diğer→satır)`, `n` vars. 6 | HTML string | ui.js:422 |
| `GV.activity(items)` | `[{kisi,tarih,metin,eski,yeni,tone,icon}]` | timeline HTML; boşsa `GV.empty(...)` | ui.js:1488 |
| `GV.chain(steps)` | `[{rol,kisi,durum,tarih,not}]` | onay zinciri HTML | ui.js:1505 |
| `GV.tabs(root)` | selector \| düğüm | `{activate(key, push)}`; hash senkronlu, ok tuşu gezinme | ui.js:1256 |
| `GV.chipbar(root)` | kök düğüm | — (oklu kaydırma bağlar) | ui.js:1217, atama 1238 |
| `GV.badge(v, extra)` | değer + isteğe bağlı açık ton sınıfı | `<span class="badge is-…">` | ui.js:162 |
| `GV.tone(v)` | değer | `'ok'\|'warn'\|'danger'\|'info'\|'purple'\|'accent'\|'neutral'` | ui.js:157 |
| `GV.pri(v)` | öncelik metni | `<span class="pri is-…">` (TR harf normalizasyonlu) | ui.js:169 |
| `GV.user(kod, opt)` | personel kodu + `{ad,sm,nameOnly}` | avatar + ad çipi; `DB.emp` ile çözer | ui.js:179 |
| `GV.dateCell(iso, opt)` | ISO tarih + `{done}` | gecikme/yaklaşma tonlu tarih hücresi | ui.js:191 |
| `GV.progress(v, opt)` | 0–100 + `{tone}` | ilerleme çubuğu HTML'i | ui.js:202 |
| `GV.fmt` | biçimlendirme sözlüğü | — | ui.js:20, atama 90 |

**`GV.fmt` üyeleri (12):** `date` · `dateShort` · `dateLong` · `dt` · `num(n,dec)` ·
`money(n,cur)` · `moneyK` · `pct` · `hours` · `days(iso,today)` · `rel(iso)` · `initials(ad)`.
`days`/`rel` bugünü `DB.today` (`'2026-08-03'`) üzerinden alır — gerçek saat değil, **sabit veri ekseni**.

**`GV.tone` sözlüğü** 130'un üzerinde durum değeri taşır (ui.js:95-155): görev durumları (19),
satış aşamaları (15), destek/SLA, finans, filo, satın alma, NPS grupları, entegrasyon durumları.
Eksen çakışan değerler (`Yüksek`/`Orta`/`Düşük`) **kasıtlı olarak sözlükte değildir**;
oralarda `GV.badge(v,'is-danger')` biçiminde açık ton geçilir.

**Yardım:** ayrı bir `GV.*` fonksiyonu yoktur. `[data-help]` taşıyan her düğüme belge düzeyinde
tıklama dinleyicisi bağlıdır ve `data-help-title` + `data-help` içeriğiyle `GV.modal` açar (ui.js:1935).

---

## 1.7 Sözlükte yazıp kodda bulunmayan adlar (hayalet API)

`tasks/components.md` içinde API olarak yazılı ama `ui.js`/`shell.js`'te **tanımı olmayan** adlar:

| Sözlükteki ad | Sözlük yeri | Gerçek durum |
|---|---|---|
| `GV.notify` | components.md §1 "Bildirim merkezi" | **Yok.** Bildirim `DB.notifications` + `counters().bildirim` + `app-panel-bildirimler.html` ile yürür |
| `GV.cols(table)` | §6 | **Yok.** `GV.list` içindeki `openCols()` |
| `GV.filters(config)` | §6 | **Yok.** `GV.list` içindeki `openFilters()` |
| `GV.export(config)` | §6 | **Yok.** `GV.list` içindeki `openExport()`/`doExport()` |
| `GV.bulk(config)` | §6 | **Yok.** `GV.list` cfg'sindeki `bulk[]` + `renderBulk()` |
| `GV.dateRange(el)` | §6 | **Yok.** Karşılığı `filters[].type:'daterange'` |
| `GV.help(key)` | §6 | **Yok.** Karşılığı `[data-help]` delegasyonu |
| `GV.kanban(config)` | §6 | **Yok.** `GV.list` cfg'sindeki `kanban{}`; **sürükle-bırak da yok** |
| `GV.detail(config)` | §3 (zaten uyarıyla) | Yok — sözlük bunu doğru işaretliyor |
| `GV.gantt(config)` | §3 (zaten uyarıyla) | Yok — yalnız CSS |
| `GV.shell.role()` / `setRole()` | §1 | Adlar farklı: gerçekte `GV.perm.role()` ve `GV.shell.setSession(emp, rol)` |
| `GV.badge(kind, value)` | §5 | İmza ters: gerçekte `GV.badge(value, extra)` |
| `GV.errorState({...retry})` | §6 | `retry` config anahtarı okunmaz; buton `[data-retry]` olarak sabit basılır |
| `GV.list` cfg `passive:true` | §2 | Kodda **okunmaz**; aktif/pasif ayrımı `archive` hattında `r.aktif===false` ile yapılır |
| `GV.list` cfg `export:['xlsx',…]` | §2 | Dizi okunmaz; yalnız `export !== false` kontrolü var, dört format sabit |
| `GV.list` cfg `title:{eyebrow,h1,sub}` | §2 | Okunmaz; başlık `GV.pageHead` ile basılır |
| `filters[].type:'number'` | §2 | Özel dal yok; `multi`/`daterange`/`text` dışındaki her tip **select**'e düşer ve `options` bekler |

---

## 1.8 `DB.*` yardımcı fonksiyonları (ölçülmüş)

| Yardımcı | İmza | Dönüş | Dosya |
|---|---|---|---|
| `DB.emp(kod)` | `'EMP-008'` | personel nesnesi \| `null` | org.js:214 |
| `DB.empName(kod)` | | ad \| `'—'` | org.js:215 |
| `DB.dep(kod)` | `'DEP-09'` | departman nesnesi \| `null` | org.js:216 |
| `DB.depName(kod)` | | ad \| `'—'` | org.js:217 |
| `DB.roleName(key)` | `'pm'` | rol adı \| anahtarın kendisi | org.js:218 |
| `DB.proj(kod)` | `'PRJ-2026-001'` | proje nesnesi \| `null` | work.js:662 |
| `DB.projName(kod)` | | ad \| `'—'` | work.js:663 |
| `DB.mod(kod)` | `'MOD-002'` | modül nesnesi \| `null` | work.js:664 |
| `DB.modName(kod)` | | ad \| `'—'` | work.js:665 |
| `DB.task(kod)` | `'GRV-2026-101'` | görev nesnesi \| `null` | work.js:666 |

**Yoktur:** `DB.cust*`, `DB.custName`, `DB.ticket*`, `DB.quote*` gibi türevler. Müşteri/teklif/talep
çözümlemesi ekranlarda doğrudan `DB.<koleksiyon>.filter(...)` ile yapılır.

`DB.today = '2026-08-03'` (org.js:9) — tüm göreli tarih hesabının çapası.

---

## 1.9 `DB` koleksiyon envanteri (dosya bazında)

| Dosya | Koleksiyonlar |
|---|---|
| `org.js` | `company` · `departments` · `roles` · `permMatrix` · `employees` · `today` (+5 yardımcı) |
| `crm.js` | `sectors` · `services` · `refTypes` · `pipelineStages` · `lostReasons` · `customers` · `contacts` · `leads` · `referrers` · `commissions` · `analyses` · `quotes` · `quoteItems` · `interactions` |
| `work.js` | `taskStatuses` · `taskTypes` · `priorities` · `impacts` · `taskTransitions` · `projects` · `projectModules` · `milestones` · `sprints` · `tasks` · `subtasks` · `taskDeps` · `deptRequests` · `approvals` · `bugs` · `tests` · `deliveries` · `changeRequests` · `activities` (+5 yardımcı) |
| `ops.js` | `assetCategories` · `assets` · `assignments` · `vehicles` · `maintenance` · `inspections` · `policies` · `fuelLogs` · `vehicleExpenses` · `accidents` · `fines` · `suppliers` · `purchases` · `purchaseApprovals` · `supplierQuotes` · `orders` · `tickets` · `slaPolicies` · `supportPackages` · `surveys` |
| `hr.js` | `leaveTypes` · `leaves` · `timelogs` · `timesheets` · `capacity` · `performance` · `trainings` |
| `misc.js` | `contracts` · `invoices` · `payments` · `documents` · `meetings` · `decisions` · `channels` · `messages` · `notifications` · `notificationChannels` · `announcements` · `automations` · `integrations` · `logs` |

**Ortak alan kalıbı (ölçülen):** her kayıtta `kod` (birincil anahtar), çoğunda `aktif:boolean`
(pasif/arşiv ekseni), `durum` (badge ekseni), sorumluluk alanları personel koduna (`EMP-…`),
bağ alanları hedef kaydın koduna işaret eder. Aktivite kayıtları `DB.activities[].kayit`
üzerinden **herhangi bir kayıt koduna** bağlanır — tek ortak geçmiş tablosu.

---

# BÖLÜM 2 — Modül başına gereken backend servis yüzeyi

> Bu bölüm **öneridir.** Bugün hiçbiri yoktur; istemcideki karşılığı sütunu, o eksenin
> prototipte hangi çağrıyla taklit edildiğini gösterir.

## 2.0 Ortak sözleşme (her modülde geçerli)

| Konu | Öneri |
|---|---|
| Taban | `/api/v1/<kaynak>` · JSON · `Authorization: Bearer <jwt>` |
| Liste yanıtı | `{ data:[], page, size, total, facets:{} }` — `facets` sekme sayaçlarını besler (bugün `tabRows()` istemcide sayıyor) |
| Liste parametreleri | `?page&size&sort&dir&q&tab&arsiv&f_<alan>` — **bugünkü URL sözleşmesiyle birebir aynı** (ui.js:481) |
| Kimlik | Kaynak yolunda `kod` kullanılır (`GRV-2026-101`), sayısal id değil |
| Eşzamanlılık | `If-Match: <etag>` / `version` alanı — istemcide karşılığı yok |
| Yumuşak silme | `DELETE` yerine `PATCH {aktif:false}` varsayılan; gerçek `DELETE` yalnız `perm.can('sil')==='tum'` |
| Kapsam süzgeci | Her listeleme `GV.perm.scope('gor')` karşılığını **sunucuda** uygular: `tum` · `departman` (`dep`) · `proje` (`ekip`/`pm`) · `kendi` (`sorumlu`/`olusturan`) |
| Aktivite | Her mutasyon `POST /api/v1/activities` yazar (`{kayit,kisi,metin,eski,yeni,tone,icon}`) |
| Dosya | `POST /api/v1/files` (multipart) → `{id,ad,boyut,url}`; kayda `PATCH` ile bağlanır |
| Çıktı | `POST /api/v1/<kaynak>/export {scope,format,columns[],filters{}}` → dosya akışı |

---

## 2.1 Satış / CRM (`leads` · `pipeline` · `analyses` · `quotes` · `referrers` · `commissions`)

| Eksen | Uç nokta | İstek | Dönüş | Yetki | Bugünkü istemci karşılığı |
|---|---|---|---|---|---|
| Listeleme | `GET /leads` · `/quotes` · `/analyses` · `/referrers` · `/commissions` | `page,size,sort,dir,q,tab,f_asama,f_sorumlu,f_sicaklik,f_kaynak` | `{data,total,facets}` | `perm.sec('satis')` + `scope('gor')` | `GV.list({source:DB.leads})` · `app-lead.html` |
| Detay | `GET /leads/{kod}` | `expand=interactions,analyses,quotes,activities` | tek kayıt + bağlı koleksiyonlar | aynı | `app-lead-detay.html?id=` + `DB.leads.filter` |
| Ekleme | `POST /leads` · `POST /quotes` | form gövdesi (`firma,yetkili,sektor,hizmet,butce,sorumlu,kaynak,referans`) | oluşan kayıt + `kod` | `perm.can('ekle')` | `app-lead-form.html` → `GV.form(...).submit()` |
| Güncelleme | `PATCH /leads/{kod}` | değişen alanlar | güncel kayıt | `perm.can('duzenle')` + kapsam | aynı form, `record` dolu |
| Aşama değişimi | `POST /leads/{kod}/stage` | `{asama, not}` | kayıt + üretilen aktivite | `can('duzenle')` | `app-pipeline.html` kanban görünümü (**sürükle-bırak yok**) |
| Arşivleme | `PATCH /leads/{kod}` | `{aktif:false}` veya `{durum:'Arşivlendi'}` | kayıt | `can('duzenle')` | `afterArchive()` ui.js:523 |
| Silme | `DELETE /leads/{kod}` | — | `204` | `can('sil')` | `GV.confirm` + dizi mutasyonu + `GV.refresh()` |
| Filtreleme | listelemeyle aynı uç | `f_asama,f_sicaklik,f_oncelik,f_sorumlu,f_kaynak,f_tarih=a~b` | filtreli sayfa | aynı | `cfg.filters[]` + `afterFilters()` |
| Toplu işlem | `POST /leads/bulk` | `{ids[],action:'assign'\|'stage'\|'archive',payload}` | `{ok,failed[]}` | `can('duzenle')` | `cfg.bulk[]` + `renderBulk()` |
| Onay | `POST /quotes/{kod}/approve` · `/reject` | `{not}` | teklif + onay zinciri | `can('onay')` | `GV.chain(...)` · `DB.quotes[].icOnay` |
| Raporlama | `GET /reports/sales` | `r=huni\|kaynak\|donusum, rf_*` | KPI + seri + satırlar | `can('musteriRapor')` | `GV.report` · `app-rapor-finans.html` |
| Dosya | `POST /quotes/{kod}/files` | multipart | dosya kaydı | `can('duzenle')` | `GV.upload` / `type:'file'` — **hiçbir yere gitmez** |
| Aktivite geçmişi | `GET /leads/{kod}/activities` | `page,size` | timeline kayıtları | `scope('gor')` | `GV.activity(DB.activities.filter(a=>a.kayit===kod))` |

**Modüle özgü:** teklif → sözleşme aktarımında bedel **NET** taşınır
(`contract.tutar = quote.araToplam − quote.indirim`); brüt taşımak KDV'yi ikinci kez uygular
(components.md §9b, VB-19). Backend'de bu bir **servis kuralı** olmalı, istemci hesabı değil.

---

## 2.2 Müşteriler (`customers` · `contacts` · `interactions`)

| Eksen | Uç nokta | İstek | Dönüş | Yetki | Bugünkü istemci karşılığı |
|---|---|---|---|---|---|
| Listeleme | `GET /customers` | `q,tab,f_sektor,f_durum,f_risk,f_sorumlu` | `{data,total}` | `perm.sec('musteri')` + `scope('gor')` | `app-musteri.html` |
| Detay | `GET /customers/{kod}` | `expand=contacts,projects,contracts,invoices,tickets,surveys` | 360° kayıt | aynı | `app-musteri-detay.html` sekmeleri (`GV.tabs`) |
| Ekleme | `POST /customers` · `POST /contacts` | ünvan, sektör, vergi bilgileri, sorumlu | kayıt | `can('ekle')` | `app-musteri-form.html` · `app-musteri-yetkili-form.html` |
| Güncelleme | `PATCH /customers/{kod}` | değişen alanlar | kayıt | `can('duzenle')` | aynı form |
| Arşivleme | `PATCH /customers/{kod}` | `{aktif:false}` | kayıt | `can('duzenle')` | arşiv toggle |
| Silme | `DELETE /customers/{kod}` | — | `204` \| `409` (bağlı proje/sözleşme varsa) | `can('sil')` | yok — prototipte engel kontrolü yapılmıyor |
| Filtreleme | listeleme | `f_sektor,f_buyukluk,f_risk,f_kaynak` | filtreli sayfa | aynı | `cfg.filters[]` |
| Toplu işlem | `POST /customers/bulk` | `{ids[],action:'assign'\|'archive'\|'tag'}` | `{ok,failed[]}` | `can('duzenle')` | `cfg.bulk[]` |
| Onay | — (modülde onay ekseni yok) | — | — | — | — |
| Raporlama | `GET /reports/customers` | `r=ciro\|memnuniyet\|risk, rf_*` | KPI + seri | `can('musteriRapor')` | `app-rapor-musteri.html` |
| Dosya | `POST /customers/{kod}/files` | multipart | dosya kaydı | `can('duzenle')` | `DB.documents[].musteri` bağı |
| İletişim geçmişi | `GET /customers/{kod}/interactions` · `POST` | `{tur,tarih,kisi,ozet}` | kayıt listesi | `scope('gor')` | `app-musteri-iletisim.html` |
| Aktivite geçmişi | `GET /customers/{kod}/activities` | — | timeline | `scope('gor')` | `GV.activity` |

**Modüle özgü:** `toplamCiro` **NET**, `bekleyenTahsilat` **BRÜT**. İkisi de türetilmiş
alandır — backend'de yazılabilir alan değil, **hesaplanan projeksiyon** olmalıdır.

---

## 2.3 Projeler (`projects` · `projectModules` · `milestones` · `sprints` · `tests` · `bugs` · `changeRequests` · `deliveries`)

| Eksen | Uç nokta | İstek | Dönüş | Yetki | Bugünkü istemci karşılığı |
|---|---|---|---|---|---|
| Listeleme | `GET /projects` · `/projects/{kod}/sprints` · `/bugs` · `/tests` · `/deliveries` | `q,tab,f_durum,f_saglik,f_pm,f_musteri` | `{data,total}` | `perm.sec('proje')` + `scope('gor')`=`proje` | `app-proje.html` ve yedi alt ekran |
| Detay | `GET /projects/{kod}` | `expand=modules,milestones,sprints,team,tasks,bugs,deliveries,budget` | tam kayıt | aynı | `app-proje-detay.html` |
| Ekleme | `POST /projects` · `/sprints` · `/bugs` · `/tests` · `/deliveries` · `/change-requests` | modüle göre gövde | kayıt | `can('ekle')` | yedi ayrı `*-form.html` |
| Güncelleme | `PATCH /projects/{kod}` | ilerleme, sağlık, tarih, ekip | kayıt | `can('duzenle')` + PM olmak | aynı formlar |
| Arşivleme | `PATCH /projects/{kod}` | `{aktif:false}` | kayıt | `can('duzenle')` | arşiv toggle |
| Silme | `DELETE /projects/{kod}` | — | `409` bağlı görev/fatura varsa | `can('sil')` | yok |
| Filtreleme | listeleme | `f_durum,f_saglik,f_musteri,f_pm,f_tarih=a~b` | filtreli sayfa | aynı | `cfg.filters[]` |
| Toplu işlem | `POST /bugs/bulk` · `/deliveries/bulk` | `{ids[],action:'assign'\|'close'\|'sprint'}` | `{ok,failed[]}` | `can('duzenle')` | `cfg.bulk[]` |
| Onay | `POST /deliveries/{kod}/customer-approval` · `/change-requests/{kod}/decide` | `{karar,not}` | kayıt + zincir | `can('onay')` | `DB.deliveries[].musteriOnay` · `GV.chain` |
| Raporlama | `GET /reports/projects` | `r=ilerleme\|butce\|kalite\|teslim, rf_*` | KPI + seri + tablo | `can('rapor')` | `app-rapor-proje.html` |
| Dosya | `POST /deliveries/{kod}/files` | multipart | dosya kaydı | `can('duzenle')` | `DB.documents[].proje` |
| Aktivite geçmişi | `GET /projects/{kod}/activities` | — | timeline | `scope('gor')` | `GV.activity` |

**Modüle özgü:** bağ alanları **tek yönlüdür** (components.md §9d): `bugs[].gorev`, `bugs[].test`,
`deliveries[].milestone`, `assets[].siparis`. Backend ayna alan **açmamalı** — ters okuma
sorgu ile yapılır. Gantt görünümü için ayrı uç gerekmez; `milestones` + `tasks` yeterlidir
(istemcide `GV.gantt()` zaten yoktur, markup elle kurulur).

---

## 2.4 Görevler (`tasks` · `subtasks` · `taskDeps` · `deptRequests` · `taskTransitions`)

| Eksen | Uç nokta | İstek | Dönüş | Yetki | Bugünkü istemci karşılığı |
|---|---|---|---|---|---|
| Listeleme | `GET /tasks` | `tab=havuz\|bana\|verdigim\|departman\|onay\|kontrol\|geciken\|engel`, `f_durum,f_oncelik,f_proje,f_sorumlu` | `{data,total,facets}` | `perm.sec('gorev')` + `scope('gor')` | `app-gorev.html?t=…` — sekme URL'de |
| Detay | `GET /tasks/{kod}` | `expand=subtasks,deps,timelogs,activities,files,watchers` | tam kayıt | aynı | `app-gorev-detay.html` |
| Ekleme | `POST /tasks` · `POST /tasks/{kod}/subtasks` | başlık, tür, proje, modül, sprint, sorumlu, öncelik, etki, termin | kayıt | `can('ekle')` | `app-gorev-form.html` |
| Güncelleme | `PATCH /tasks/{kod}` | değişen alanlar | kayıt | `can('duzenle')` \| sorumlu olmak | aynı form |
| **Durum geçişi** | `POST /tasks/{kod}/transition` | `{to, zorunluAlanlar}` | kayıt + bildirim kuyruğu | `DB.taskTransitions[from].yetki` | `DB.taskTransitions` haritası — **istemcide yalnız veri, uygulayıcı yordam yok** |
| Arşivleme | `PATCH /tasks/{kod}` | `{durum:'Arşivlendi'}` | kayıt | `can('duzenle')` | `afterArchive()` bu durumu tanır |
| Silme | `DELETE /tasks/{kod}` | — | `204` | `can('sil')` | `GV.confirm` + mutasyon |
| Filtreleme | listeleme | `f_durum,f_tur,f_oncelik,f_etki,f_dep,f_termin=a~b` | filtreli sayfa | aynı | `cfg.filters[]` |
| Toplu işlem | `POST /tasks/bulk` | `{ids[],action:'assign'\|'transition'\|'sprint'\|'priority'}` | `{ok,failed[]}` | `can('duzenle')` | `cfg.bulk[]` |
| Onay | `POST /tasks/{kod}/approve` · `/review` | `{karar,not}` | kayıt + zincir | `can('onay')` | `Onay bekliyor` / `Kontrol bekliyor` sekmeleri |
| Raporlama | `GET /reports/tasks` | `r=yuk\|gecikme\|durum\|kisi, rf_*` | KPI + seri | `can('rapor')` | `app-rapor-gorev.html` |
| Dosya | `POST /tasks/{kod}/files` | multipart | dosya kaydı | `can('duzenle')` | `GV.upload` |
| Aktivite geçmişi | `GET /tasks/{kod}/activities` | — | timeline (eski→yeni) | `scope('gor')` | `DB.activities[].kayit === 'GRV-…'` |

**Modüle özgü:** `DB.taskTransitions` her durum için `next[]` · `yetki[]` · `zorunlu[]` · `bildirim[]`
tanımlar. Bu **bir durum makinesidir** ve sunucuda uygulanmalıdır; bugün istemcide yalnız
veri olarak durur, hiçbir yordam onu zorlamaz. Departman talepleri (`deptRequests`) ayrı
kaynaktır (`/dept-requests`) ve görev doğurabilir.

---

## 2.5 Destek ve bakım (`tickets` · `slaPolicies` · `supportPackages` · `surveys`)

| Eksen | Uç nokta | İstek | Dönüş | Yetki | Bugünkü istemci karşılığı |
|---|---|---|---|---|---|
| Listeleme | `GET /tickets` · `/support-packages` · `/surveys` | `q,tab=acik\|bende\|sla-riskli, f_kategori,f_oncelik,f_musteri` | `{data,total}` | `perm.sec('destek')` | `app-destek.html` · `app-destek-paket.html` |
| Detay | `GET /tickets/{kod}` | `expand=sla,messages,tasks,bugs,survey,activities` | tam kayıt | aynı | `app-destek-detay.html` |
| Ekleme | `POST /tickets` | müşteri, proje, kategori, öncelik, etki, başlık, açıklama | kayıt + **SLA hesaplanmış** | `can('ekle')` | `app-destek-form.html` |
| Güncelleme | `PATCH /tickets/{kod}` | durum, sorumlu, çözüm | kayıt | `can('duzenle')` | aynı form |
| Arşivleme | `PATCH /tickets/{kod}` | `{aktif:false}` | kayıt | `can('duzenle')` | arşiv toggle |
| Silme | `DELETE /tickets/{kod}` | — | `204` | `can('sil')` | yok |
| Filtreleme | listeleme | `f_kategori,f_oncelik,f_slaDurum,f_sorumlu,f_acilis=a~b` | filtreli sayfa | aynı | `cfg.filters[]` |
| Toplu işlem | `POST /tickets/bulk` | `{ids[],action:'assign'\|'close'\|'escalate'}` | `{ok,failed[]}` | `can('duzenle')` | `cfg.bulk[]` |
| Onay | `POST /tickets/{kod}/close` | `{cozum, musteriOnay}` | kayıt | `can('onay')` \| sorumlu | kapama aksiyonu |
| **SLA hesabı** | `GET /tickets/{kod}/sla` | — | `{ilkYanitHedef,cozumHedef,tuketim,durum}` | `scope('gor')` | **istemcide türetiliyor** — `slaDurum` iki eksenin kötüsü, ≥1 ihlal / ≥0,75 risk |
| **Kota** | `GET /support-packages/{kod}/quota` | — | `{aylikSaat,kullanilan,kalan,donemAy}` | `perm.sec('destek')` | gün düzeltmeli dönem-ay formülü **iki ekranda birebir tekrar yazılı** |
| Raporlama | `GET /reports/support` | `r=sla\|hacim\|memnuniyet\|nps, rf_*` | KPI + seri | `can('rapor')` | `app-destek-sla.html` · `app-destek-memnuniyet.html` |
| Dosya | `POST /tickets/{kod}/files` | multipart | dosya kaydı | `can('duzenle')` | `type:'file'` alanı |
| Aktivite geçmişi | `GET /tickets/{kod}/activities` | — | timeline | `scope('gor')` | `GV.activity` |

**Modüle özgü:** SLA politikası eşleşmesi `kategori === t.kategori && (oncelik === t.oncelik || oncelik === 'Tümü')`.
Bu, kota formülüyle birlikte **backend'e taşınması gereken iki hesaptır** — bugün ekran kodunda tekrarlanıyor.

---

## 2.6 Sohbet (`channels` · `messages`)

| Eksen | Uç nokta | İstek | Dönüş | Yetki | Bugünkü istemci karşılığı |
|---|---|---|---|---|---|
| Listeleme | `GET /channels` | `q,f_tur` | kanallar + `okunmamis` | `perm.sec('sohbet')` | `app-sohbet.html` `.gv-chatlist` |
| Detay | `GET /channels/{kod}/messages` | `before,limit` | mesaj sayfası | kanal üyeliği | `DB.messages.filter(m=>m.kanal===kod)` |
| Ekleme | `POST /channels` · `POST /channels/{kod}/messages` | `{metin,ekler[]}` | mesaj kaydı | üyelik | mesaj gönderme (bellekte) |
| Güncelleme | `PATCH /messages/{kod}` | `{metin}` \| `{tepki}` | mesaj | yazar olmak | tepki (`tepki[]`) |
| Arşivleme | `PATCH /channels/{kod}` | `{aktif:false}` | kanal | kanal sahibi | `aktif` alanı var |
| Silme | `DELETE /messages/{kod}` | — | `204` | yazar \| `can('sil')` | yok |
| Filtreleme | `GET /messages/search` | `q,kanal,kisi,tarih=a~b` | eşleşen mesajlar | üyelik | yok — mesaj araması **kurulmadı** |
| Toplu işlem | `POST /channels/{kod}/read` | `{tumMesajlar:true}` | `{okunmamis:0}` | üyelik | `okunmamis` alanı var, sıfırlayan yordam yok |
| Onay | — | — | — | — | — |
| Raporlama | — (modülde rapor ekseni yok) | — | — | — | — |
| Dosya | `POST /channels/{kod}/files` | multipart | ek | üyelik | yok |
| Aktivite geçmişi | — (mesaj akışının kendisi geçmiştir) | — | — | — | — |
| **Canlı akış** | `WSS /realtime?channels=…` | — | mesaj/tepki/okundu olayları | üyelik | **yok** — prototipte gerçek zamanlı hiçbir şey yok |

---

## 2.7 Personel ve İK (`employees` · `leaves` · `timelogs` · `timesheets` · `capacity` · `performance` · `trainings`)

| Eksen | Uç nokta | İstek | Dönüş | Yetki | Bugünkü istemci karşılığı |
|---|---|---|---|---|---|
| Listeleme | `GET /employees` · `/leaves` · `/timelogs` · `/trainings` | `q,tab,f_dep,f_pozisyon,f_calismaTuru` | `{data,total}` | `perm.can('personel')` + `scope('personel')` | `app-personel.html` ve altı ekran |
| Detay | `GET /employees/{kod}` | `expand=leaves,timesheets,performance,trainings,assets` | tam kayıt, **maaş maskeli** | `can('maas')` yoksa maskele | `app-personel-detay.html` |
| Ekleme | `POST /employees` · `/leaves` · `/timelogs` | modüle göre gövde | kayıt | `can('ekle')` + İK rolü | `app-personel-form.html` · `app-izin-form.html` |
| Güncelleme | `PATCH /employees/{kod}` | değişen alanlar | kayıt | `can('duzenle')` + `personel` kapsamı | aynı formlar |
| Arşivleme | `PATCH /employees/{kod}` | `{aktif:false, cikisTarihi}` | kayıt | `can('duzenle')` | `aktif` alanı |
| Silme | `DELETE /employees/{kod}` | — | `409` (bağlı görev/zimmet varsa) | `can('sil')` | yok |
| Filtreleme | listeleme | `f_dep,f_rol,f_lokasyon,f_calismaTuru,f_tarih=a~b` | filtreli sayfa | aynı | `cfg.filters[]` |
| Toplu işlem | `POST /leaves/bulk` · `/timesheets/bulk` | `{ids[],action:'approve'\|'reject'}` | `{ok,failed[]}` | `can('onay')` | `app-zaman-onay.html` |
| Onay | `POST /leaves/{kod}/decide` · `POST /timesheets/{kod}/approve` | `{karar,not}` | kayıt + zincir | `can('onay')` | `GV.chain` · `DB.approvals[tur:'İzin talebi']` |
| Raporlama | `GET /reports/hr` | `r=kapasite\|izin\|performans\|egitim, rf_*` | KPI + seri | `can('personelRapor')` | `app-rapor-personel.html` · `app-kapasite.html` |
| Dosya | `POST /employees/{kod}/files` | multipart | özlük dosyası | `can('personel')==='tum'` | yok |
| Aktivite geçmişi | `GET /employees/{kod}/activities` | — | timeline | `scope('personel')` | `GV.activity` |

**Modüle özgü:** `maas` ve `saatlikUcret` **BRÜT** çalışan ekseni. Alan maskeleme istemcide
`GV.perm.mask(value,'maas')` ile yapılıyor — bu **görsel maskedir, veri hâlâ istemcide.**
Backend'de maskeleme **yanıt seviyesinde** olmalı: yetkisi olmayana alan hiç gönderilmez.

---

## 2.8 Demirbaş ve filo (`assets` · `assignments` · `vehicles` · `maintenance` · `inspections` · `policies` · `fuelLogs` · `vehicleExpenses` · `accidents` · `fines`)

| Eksen | Uç nokta | İstek | Dönüş | Yetki | Bugünkü istemci karşılığı |
|---|---|---|---|---|---|
| Listeleme | `GET /assets` · `/vehicles` · `/maintenance` · `/policies` · `/fuel-logs` · `/vehicle-expenses` · `/accidents` | `q,tab,f_kategori,f_durum,f_dep` | `{data,total}` | `perm.sec('varlik')` | dokuz ekran (`app-demirbas` … `app-arac-kaza`) |
| Detay | `GET /vehicles/{kod}` | `expand=maintenance,inspections,policies,fuel,expenses,accidents,fines` | tam kayıt | aynı | `app-arac-detay.html` |
| Ekleme | `POST /assets` · `/vehicles` · `/maintenance` · … | modüle göre gövde | kayıt | `can('ekle')` | yedi `*-form.html` |
| Güncelleme | `PATCH /vehicles/{kod}` | km, durum, sürücü | kayıt | `can('duzenle')` | aynı formlar |
| **Zimmet** | `POST /assets/{kod}/assign` · `/return` | `{kisi,tarih,not}` \| `{iadeTarihi,durum}` | kayıt + zimmet satırı | `can('duzenle')` | `app-zimmet.html` · `DB.assignments` |
| Arşivleme | `PATCH /assets/{kod}` | `{aktif:false}` veya `{durum:'Hurda'}` | kayıt | `can('duzenle')` | arşiv toggle |
| Silme | `DELETE /assets/{kod}` | — | `204` | `can('sil')` | yok |
| Filtreleme | listeleme | `f_kategori,f_durum,f_lokasyon,f_dep,f_tarih=a~b` | filtreli sayfa | aynı | `cfg.filters[]` |
| Toplu işlem | `POST /assets/bulk` | `{ids[],action:'assign'\|'move'\|'archive'}` | `{ok,failed[]}` | `can('duzenle')` | `cfg.bulk[]` |
| Onay | — (bakım/sigorta harcaması satın almaya bağlanır) | — | — | — | — |
| **Hatırlatma** | `GET /fleet/reminders` | `gunOnce=60` | yaklaşan muayene/poliçe/bakım | `perm.sec('varlik')` | `counters().bakim` (`Yaklaşıyor\|Gecikti`) · `counters().police` (`kalanGun<=60`) |
| Raporlama | `GET /reports/fleet` | `r=maliyet\|yakit\|kullanim\|kaza, rf_*` | KPI + seri | `can('rapor')` | `app-rapor-filo.html` |
| Dosya | `POST /vehicles/{kod}/files` | multipart | ruhsat, poliçe PDF'i | `can('duzenle')` | yok |
| Aktivite geçmişi | `GET /vehicles/{kod}/activities` | — | timeline | `scope('gor')` | `GV.activity` |

**Modüle özgü:** filo tarafındaki para alanları (`maliyet`, `prim`, gider, yakıt) **BRÜT** eksendedir
ve kaynak tutarı olduğu gibi taşır. Bu, backend'de gider kaydını üretirken **dönüşüm yapılmaması**
gereken bir kuraldır.

---

## 2.9 Satın alma (`purchases` · `purchaseApprovals` · `supplierQuotes` · `orders` · `suppliers`)

| Eksen | Uç nokta | İstek | Dönüş | Yetki | Bugünkü istemci karşılığı |
|---|---|---|---|---|---|
| Listeleme | `GET /purchases` · `/supplier-quotes` · `/orders` · `/suppliers` | `q,tab=onay\|siparis, f_durum,f_kategori,f_dep` | `{data,total}` | `perm.sec('satinalma')` | dört ekran |
| Detay | `GET /purchases/{kod}` | `expand=approvals,quotes,order,files,activities` | tam kayıt | aynı | `app-satinalma-detay.html` |
| Ekleme | `POST /purchases` · `/orders` · `/suppliers` | ürün, miktar, tahmini maliyet, gerekçe, bütçe kodu | kayıt + **onay zinciri kurulmuş** | `can('ekle')` | `app-satinalma-form.html` |
| Güncelleme | `PATCH /purchases/{kod}` | değişen alanlar | kayıt | `can('duzenle')` | aynı form |
| Arşivleme | `PATCH /purchases/{kod}` | `{aktif:false}` | kayıt | `can('duzenle')` | arşiv toggle |
| Silme | `DELETE /purchases/{kod}` | — | `204` | `can('sil')` | yok |
| Filtreleme | listeleme | `f_durum,f_kategori,f_oncelik,f_dep,f_tarih=a~b` | filtreli sayfa | aynı | `cfg.filters[]` |
| Toplu işlem | `POST /purchases/bulk` | `{ids[],action:'approve'\|'reject'}` | `{ok,failed[]}` | `can('onay')` | `cfg.bulk[]` |
| **Onay** | `POST /purchases/{kod}/approvals/{sira}` | `{karar,not}` | kayıt + güncel zincir | `can('onay')` + adım rolü | `DB.purchaseApprovals` (`talep,sira,rol,kisi,durum,tarih,not`) + `GV.chain` |
| **Onay eşiği** | `GET /settings/approval-flows` | `tur=satinalma` | tutar eşikli adım tanımı | `SCREEN_PERM.onayakis` | **`localStorage['gv.onayakis']`** — `app-satinalma-form.html` oradan okur |
| Teklif karşılaştırma | `GET /purchases/{kod}/quotes/compare` | — | matris (fiyat, süre, garanti, puan) | `perm.sec('satinalma')` | `app-satinalma-teklif.html` |
| Raporlama | `GET /reports/procurement` | `r=harcama\|tedarikci\|sure, rf_*` | KPI + seri | `can('rapor')` | rapor merkezi |
| Dosya | `POST /purchases/{kod}/files` | multipart | proforma, teklif PDF'i | `can('duzenle')` | `type:'file'` |
| Aktivite geçmişi | `GET /purchases/{kod}/activities` | — | timeline | `scope('gor')` | `GV.activity` |

**Modüle özgü:** iki ayrı puan ekseni vardır ve karıştırılamaz —
`supplierQuotes[].puan` (**teklif puanı**) ve `suppliers[].puan` (**tedarikçi genel puanı**).
Backend'de bunlar ayrı alanlar olmalı; genel puan sipariş geçmişinden **türetilen** bir skordur.

---

## 2.10 Finans (`contracts` · `invoices` · `payments` · `milestones` · proje bütçesi)

| Eksen | Uç nokta | İstek | Dönüş | Yetki | Bugünkü istemci karşılığı |
|---|---|---|---|---|---|
| Listeleme | `GET /contracts` · `/invoices` · `/payments` · `/milestones` | `q,tab=acik\|geciken, f_durum,f_musteri,f_vade=a~b` | `{data,total}` | `perm.can('finans')` | beş ekran |
| Detay | `GET /contracts/{kod}` | `expand=milestones,invoices,payments,project,files` | tam kayıt | `can('finans')` | `app-sozlesme-detay.html` |
| Ekleme | `POST /contracts` · `/invoices` | tekliften türetme: `{teklif}` → net taşınır | kayıt + taksit seti | `can('ekle')` + `can('finans')` | `app-sozlesme-form.html` · `app-fatura-form.html` |
| Güncelleme | `PATCH /invoices/{kod}` | durum, ödeme tarihi | kayıt | `can('duzenle')` + `can('finans')` | aynı formlar |
| Arşivleme | `PATCH /contracts/{kod}` | `{aktif:false}` \| `{durum:'Feshedildi'}` | kayıt | `can('duzenle')` | arşiv toggle |
| Silme | `DELETE /invoices/{kod}` | — | `409` (tahsilatı varsa) | `can('sil')` | yok |
| Filtreleme | listeleme | `f_durum,f_musteri,f_vade=a~b,f_sorumlu` | filtreli sayfa | `can('finans')` | `cfg.filters[]` |
| Toplu işlem | `POST /payments/bulk` | `{ids[],action:'remind'\|'mark-paid'}` | `{ok,failed[]}` | `can('duzenle')` | `cfg.bulk[]` |
| Onay | `POST /contracts/{kod}/sign` · `/invoices/{kod}/approve` | `{karar,not}` | kayıt | `can('onay')` + `can('finans')` | `İmza bekliyor` durumu |
| **Tutar zinciri** | `GET /contracts/{kod}/chain` | — | `{net,kdv,brut,taksitler[],faturalar[],tahsilatlar[]}` | `can('finans')` | `canon.js` eksen 9/10/11/18 doğruluyor — **çalışma zamanı yordamı yok** |
| Raporlama | `GET /reports/finance` | `r=ciro\|tahsilat\|butce\|karlilik, rf_*` | KPI + seri | `can('finans')` + `can('rapor')` | `app-rapor-finans.html` · `app-butce.html` |
| Dosya | `POST /contracts/{kod}/files` | multipart | imzalı PDF | `can('finans')` | `DB.documents[tur:'Sözleşme']` |
| Aktivite geçmişi | `GET /contracts/{kod}/activities` | — | timeline | `can('finans')` | `GV.activity` |

**Modüle özgü:** net/brüt ekseni **servis sözleşmesinin parçası** olmalıdır.
`contract.tutar` NET · `contract.toplam` BRÜT · `milestone.odeme` NET · `invoice.tutar` NET ·
`invoice.toplam` BRÜT · `payment.tutar` **BRÜT**. Uç noktalar alan adında eksen belirtmeli
(`tutarNet` / `tutarBrut`) — bugünkü sessiz hata sınıfı (VB-19) tam buradan doğdu.

---

## 2.11 Dokümanlar (`documents`)

| Eksen | Uç nokta | İstek | Dönüş | Yetki | Bugünkü istemci karşılığı |
|---|---|---|---|---|---|
| Listeleme | `GET /documents` | `q,tab=tumu\|suresi-dolan, f_tur,f_klasor,f_gizlilik,f_musteri,f_proje` | `{data,total}` | `perm.sec('dokuman')` + `gizlilik` süzgeci | `app-dokuman.html` |
| Detay | `GET /documents/{kod}` | `expand=versions,activities` | kayıt + sürüm listesi | gizlilik düzeyi | `app-dokuman-detay.html` |
| **Ekleme (yükleme)** | `POST /documents` (multipart) | dosya + `{ad,tur,klasor,musteri,proje,gizlilik,sonKullanma}` | kayıt + `url` | `can('ekle')` | `GV.upload` — **dosya hiçbir yere gitmiyor** |
| Güncelleme | `PATCH /documents/{kod}` | meta alanlar | kayıt | `can('duzenle')` | yok (form ekranı üretilmemiş) |
| **Yeni sürüm** | `POST /documents/{kod}/versions` | dosya | `versiyon+1` | `can('duzenle')` | `versiyon` alanı var, artıran yordam yok |
| Arşivleme | `PATCH /documents/{kod}` | `{aktif:false}` | kayıt | `can('duzenle')` | arşiv toggle |
| Silme | `DELETE /documents/{kod}` | — | `204` | `can('sil')` | yok |
| Filtreleme | listeleme | `f_tur,f_gizlilik,f_format,f_sonKullanma=a~b` | filtreli sayfa | aynı | `cfg.filters[]` |
| Toplu işlem | `POST /documents/bulk` | `{ids[],action:'move'\|'archive'\|'share'}` | `{ok,failed[]}` | `can('duzenle')` | `cfg.bulk[]` |
| Onay | `POST /documents/{kod}/approve` | `{karar,not}` | kayıt | `can('onay')` | `DB.documents[].onay` alanı |
| **Süre takibi** | `GET /documents/expiring` | `gunOnce=30` | süresi dolan/yaklaşan | `perm.sec('dokuman')` | `counters().dokuman` (`kalanGun<=30`) · `app-dokuman-sure.html` |
| Raporlama | `GET /reports/documents` | `r=tur\|sure\|gizlilik` | KPI | `can('rapor')` | yok |
| **İndirme** | `GET /documents/{kod}/download` | — | imzalı geçici URL | gizlilik + `can('disaAktar')` | yok — `boyut`/`format` yalnız metin |
| Aktivite geçmişi | `GET /documents/{kod}/activities` | — | timeline | `scope('gor')` | `GV.activity` |

---

## 2.12 Toplantılar (`meetings` · `decisions`)

| Eksen | Uç nokta | İstek | Dönüş | Yetki | Bugünkü istemci karşılığı |
|---|---|---|---|---|---|
| Listeleme | `GET /meetings` · `/decisions` | `q,tab,f_tur,f_durum,f_musteri,f_tarih=a~b` | `{data,total}` | `perm.sec('toplanti')` | `app-toplanti.html` · `app-toplanti-karar.html` |
| Detay | `GET /meetings/{kod}` | `expand=decisions,participants,files,activities` | tam kayıt | katılımcı \| `scope('gor')` | `app-toplanti-detay.html` |
| Ekleme | `POST /meetings` | ad, tür, tarih, süre, yer, katılımcılar, gündem | kayıt + davet | `can('ekle')` | `app-toplanti-form.html` |
| Güncelleme | `PATCH /meetings/{kod}` | tarih, katılımcı, durum | kayıt + güncelleme daveti | `can('duzenle')` | aynı form |
| Arşivleme | `PATCH /meetings/{kod}` | `{aktif:false}` | kayıt | `can('duzenle')` | arşiv toggle |
| Silme | `DELETE /meetings/{kod}` | — | `204` + iptal daveti | `can('sil')` | yok |
| Filtreleme | listeleme | `f_tur,f_durum,f_proje,f_tarih=a~b` | filtreli sayfa | aynı | `cfg.filters[]` |
| Toplu işlem | `POST /meetings/bulk` | `{ids[],action:'cancel'\|'archive'}` | `{ok,failed[]}` | `can('duzenle')` | `cfg.bulk[]` |
| **Karar → görev** | `POST /decisions/{kod}/to-task` | `{sorumlu,termin}` | görev kaydı + bağ | `can('ekle')` | `DB.decisions[].gorev` bağı **veride yazılı**, üreten yordam yok |
| Onay | `POST /meetings/{kod}/minutes/approve` | `{karar}` | kayıt | `can('onay')` | yok |
| Raporlama | `GET /reports/meetings` | `r=hacim\|karar-kapanis` | KPI | `can('rapor')` | yok |
| Dosya | `POST /meetings/{kod}/files` | multipart | tutanak, sunum | `can('duzenle')` | yok |
| **Takvim** | `GET /calendar?from&to&kaynak=meetings,tasks,leaves` | tarih aralığı | birleşik olay listesi | ilgili bölüm yetkileri | `app-ajanda.html` — `.gv-cal` ızgarası, olaylar `DB`'den türetiliyor |

---

## 2.13 Raporlar (kesişen okuma modülü)

| Eksen | Uç nokta | İstek | Dönüş | Yetki | Bugünkü istemci karşılığı |
|---|---|---|---|---|---|
| Rapor kataloğu | `GET /reports` | — | `[{key,label,group,icon,filtreler[]}]` | `can('rapor')` | `GV.report({reports:[...]})` — katalog **sayfaya gömülü** |
| Rapor çalıştırma | `GET /reports/{key}` | `rf_*` filtre değerleri | `{kpis[],series[],rows[],total}` | `can('rapor')` + kapsam | `reports[].rows(f)` istemcide hesaplar |
| KPI | aynı uç | — | `kpis[]` | aynı | `kpis[].calc(rows,f)` |
| Grafik verisi | aynı uç | `grafik=bar\|line\|donut` | seri verisi (**SVG değil**) | aynı | `charts(rows,f)` → `GV.chart.*` SVG string üretir |
| Detay tablo | `GET /reports/{key}/rows` | `page,size,sort,dir` | sayfalı satırlar | aynı | `reports[].table` → `GV.list` |
| **Kayıtlı rapor** | `GET/POST/DELETE /saved-reports` | `{nm,key,f{}}` | kullanıcıya ait kayıt listesi | oturum sahibi | **`localStorage['gv.rp.<id>']`** — cihaz dışına çıkmaz |
| Çıktı | `POST /reports/{key}/export` | `{format,scope,filters}` | dosya akışı | `can('disaAktar')` | `doExport()` istemcide üretir |
| Zamanlanmış rapor | `POST /reports/{key}/schedule` | `{cron,alicilar[],format}` | zamanlama kaydı | `can('rapor')==='tum'` | **yok** |

Bugünkü sekiz rapor ekranı (`app-rapor*.html`) veriyi `DB`'den okuyup istemcide toplar.
Backend'e taşındığında **kapsam süzgeci sunucuda** uygulanmalı: `can('personelRapor')`
ve `can('musteriRapor')` (shell.js:294-296) bugün yalnız ekranı açıp kapatıyor, satırları süzmüyor.

---

## 2.14 Ayarlar ve yönetim (`company` · `departments` · `roles` · `permMatrix` · `automations` · `integrations` · `notificationChannels` · `logs`)

| Eksen | Uç nokta | İstek | Dönüş | Yetki | Bugünkü istemci karşılığı |
|---|---|---|---|---|---|
| Listeleme | `GET /settings/departments` · `/roles` · `/users` · `/automations` · `/integrations` · `/logs` | `q,f_*` | `{data,total}` | `SCREEN_PERM.<ekran>` | 13 ayar ekranı |
| Detay | `GET /settings/roles/{key}` | `expand=matrix,users` | rol + yetki matrisi | `SCREEN_PERM.roller` | `app-ayar-rol.html` |
| Ekleme | `POST /settings/departments` · `/roles` · `/users` | gövde | kayıt | `SCREEN_PERM` + `can('ekle')` | ekranlarda düzenleme var |
| Güncelleme | `PATCH /settings/company` · `/permissions` | değişen alanlar | kayıt | `SCREEN_PERM.sirket` / `.yetki` | **`localStorage['gv.sirket']`** |
| Arşivleme | `PATCH /settings/departments/{kod}` | `{aktif:false}` | kayıt | `SCREEN_PERM.departmanlar` | `app-ayar-arsiv.html` |
| Silme | `DELETE /settings/roles/{key}` | — | `409` (rolde kullanıcı varsa) | `SCREEN_PERM.roller` | yok |
| Filtreleme | `GET /logs` | `f_modul,f_kisi,f_islem,f_tarih=a~b` | filtreli sayfa | `can('log')` | `app-ayar-log.html` |
| Toplu işlem | `POST /settings/users/bulk` | `{ids[],action:'role'\|'disable'}` | `{ok,failed[]}` | `SCREEN_PERM.kullanicilar` | `cfg.bulk[]` |
| **Onay akışı tanımı** | `GET/PUT /settings/approval-flows` | `{tur,adimlar:[{sira,rol,esik}]}` | akış tanımı | `SCREEN_PERM.onayakis` | **`localStorage['gv.onayakis']`** |
| **Yetki matrisi** | `GET/PUT /settings/permissions` | 25 rol × 11 eksen | matris | `SCREEN_PERM.yetki` | `DB.permMatrix` — **salt okunur veri** |
| **Otomasyon** | `GET/POST/PATCH /automations` | `{ad,tetikleyici,islem,kullanici,kanal[],aktif}` | kural kaydı | `SCREEN_PERM.otomasyon` | `DB.automations` — **çalıştıran motor yok** |
| **Entegrasyon** | `POST /integrations/{kod}/connect` · `/test` | OAuth / token | `{durum:'Bağlı'\|'Hata'}` | `SCREEN_PERM.entegrasyon` | `DB.integrations[].durum` — statik metin |
| Bildirim tercihi | `GET/PUT /me/notification-preferences` | kanal × olay matrisi | tercih | oturum sahibi | **`localStorage['gv.notifpref']`** |
| Profil | `GET/PATCH /me` | ad, e-posta, dil, tema | kullanıcı | oturum sahibi | **`localStorage['gv.profil']`** |
| **Log yazımı** | `POST /logs` (iç servis) | `{kisi,islem,kayit,modul,ip,eski,yeni}` | — | sistem | `DB.logs` — el ile yazılan örnek kayıtlar |

---

# BÖLÜM 3 — Kesişen teknik servisler

## 3.1 Kimlik doğrulama ve oturum

| | |
|---|---|
| **Bugün istemcide** | Şifre, token, doğrulama **yok**. `index.html`'de personel/rol seçilir, `GV.shell.setSession(empKod, roleKey)` çağrılır, `buildSession()` (shell.js:233) `DB.emp(kod)`'dan bir nesne kurar ve `sessionStorage['gv.session']`'a yazar. `?role=` / `?emp=` yalnız **ilk** seçimde okunur, hemen oturuma yazılıp adres çubuğundan silinir (shell.js:245). Oturum yoksa `index.html`'e yönlendirilir (shell.js:912). Sekme kapanınca oturum biter. |
| **Backend'de gerekir** | `POST /auth/login` (e-posta + parola / SSO) → kısa ömürlü erişim + yenileme tokenı · `POST /auth/refresh` · `POST /auth/logout` · `GET /me` (oturum + etkin rol + kapsam) · `POST /auth/switch-role` (çok rollü kullanıcı — `DB.employees[].roller` **dizidir**, bu gerçek bir ihtiyaç) · MFA · oturum listesi ve uzaktan sonlandırma · parola sıfırlama. `GV.perm` çıktısı sunucudan gelmeli, istemcide hesaplanmamalı. |

## 3.2 Rol ve yetki çözümleme

| | |
|---|---|
| **Bugün istemcide** | Üç katman ölçüldü: (1) **bölüm erişimi** `SEC_BY_ROLE` (25 rol × 15 bölüm, shell.js:193); (2) **ekran erişimi** `SCREEN_PERM` (11 ekran, shell.js:179) — `guard()` 403 markup'ı basar ve `gv:denied` yayar; (3) **aksiyon + kapsam** `DB.permMatrix` (25 rol × 11 eksen) → `perm.can()` / `perm.scope()`. Alan maskeleme `perm.mask(value,'maas')` ile **görsel** yapılır. |
| **Backend'de gerekir** | `GET /me/permissions` → `{sections[],screens[],actions{},scopes{},maskedFields[]}`. **Kapsam sunucuda uygulanmalı:** `tum` süzgeçsiz · `departman` → `dep = me.dep` · `proje` → `me` ekipte veya pm · `kendi` → `sorumlu\|olusturan\|talepEden = me`. **Alan maskeleme yanıt seviyesinde:** yetkisi olmayana `maas`, `saatlikUcret`, `vergiNo` alanları **hiç gönderilmez** — bugünkü `••••••` istemci süsüdür, veri yine bellekte durur. Ayrıca her yazma ucunda ikinci kez yetki kontrolü (UI gizlemesi güvenlik değildir). |

## 3.3 Bildirim dağıtımı

| | |
|---|---|
| **Bugün istemcide** | `DB.notifications` (`kod,tur,baslik,ozet,tarih,kisi,okundu,tone,link`) statik kayıtlar. Okunmamış sayacı `counters().bildirim` ile hesaplanır ve zil ikonuna nokta basılır (shell.js:936). `DB.notificationChannels` **yedi kanal adı içeren düz bir dizidir**: `Sistem içi` · `E-posta` · `Mobil bildirim` · `SMS` · `WhatsApp` · `Slack` · `Microsoft Teams`. Hiçbiri bağlı değil. Tercihler `localStorage['gv.notifpref']`. **`GV.notify` diye bir API yoktur.** |
| **Backend'de gerekir** | Kanal başına ayrı sağlayıcı: **Sistem içi** → `GET /notifications`, `POST /notifications/{kod}/read`, `POST /notifications/read-all` + WebSocket/SSE push · **E-posta** → SMTP/sağlayıcı + şablon motoru + bounce takibi · **Mobil** → FCM/APNs cihaz kaydı (`POST /me/devices`) · **SMS/WhatsApp** → operatör API'si, şablon onayı, maliyet muhasebesi · **Slack/Teams** → webhook, kanal eşlemesi. Ortak: olay tipi kataloğu, kullanıcı tercih matrisi (olay × kanal), sessiz saat, toplu özet (digest), yeniden deneme kuyruğu, teslim durumu. |

## 3.4 Otomasyon motoru

| | |
|---|---|
| **Bugün istemcide** | `DB.automations` (`kod,ad,tetikleyici,islem,kullanici,kanal[],aktif`) — **yalnız veri.** Kuralları çalıştıran hiçbir yordam yok; `app-ayar-otomasyon.html` bunları listeler. `DB.taskTransitions[].bildirim[]` de aynı durumda: hangi geçişte kime haber verileceği yazılı, tetikleyen yok. |
| **Backend'de gerekir** | Olay veri yolu (kayıt oluştu/değişti/silindi + alan bazlı diff) · kural değerlendirici (`tetikleyici` → koşul → eylem) · eylem tipleri: bildirim gönder, görev üret, durum değiştir, atama yap, webhook çağır · **zamanlayıcı** (süre dolan doküman, yaklaşan muayene/poliçe, geciken termin, SLA eşiği — bugün `counters()` bunları yalnız **sayıyor**, hiçbiri tetiklenmiyor) · kural sürümleme, kuru çalıştırma, çalıştırma günlüğü, döngü koruması. |

## 3.5 Dosya depolama

| | |
|---|---|
| **Bugün istemcide** | `GV.upload` (ui.js:1658) ve `GV.form` `type:'file'` (ui.js:1328) sürükle-bırak arayüzü kurar, MB sınırını kontrol eder ve dosyayı **`{ad, boyut}` olarak listeler**. Byte'lar hiçbir yere gönderilmez, sayfa yenilenince kaybolur. `DB.documents` kayıtlarında `boyut:'2,4 MB'` ve `format:'PDF'` **metin alanıdır** — indirilebilir bir URL yoktur. |
| **Backend'de gerekir** | Nesne deposu (S3 uyumlu) · `POST /files` multipart veya imzalı doğrudan yükleme URL'i · virüs taraması · MIME doğrulama (uzantıya güvenilmez) · boyut kotası · `GET /files/{id}` imzalı kısa ömürlü indirme URL'i · sürümleme (`documents[].versiyon` bunu bekliyor) · gizlilik düzeyi zorlaması (`documents[].gizlilik`) · saklama/silme politikası · küçük resim üretimi. |

## 3.6 Dışa aktarma (Excel / CSV / PDF / yazdır)

| | |
|---|---|
| **Bugün istemcide** | `doExport(rows, fmt)` (ui.js:1148) tamamen istemcide çalışır. **CSV** gerçek (`,` ayraç, BOM'lu UTF-8, tırnak kaçışı). **"Excel"** gerçek XLSX değil — sekme ayraçlı metin, `.xls` uzantısı, `application/vnd.ms-excel` MIME'ı. **PDF** yok — yeni pencereye HTML basılıp `window.print()` çağrılır; kullanıcıya "yazdırma penceresinden PDF olarak kaydedin" denir. Kapsam seçimi (seçili/filtreli/tümü) gerçek. HTML etiketleri regex'le sıyrılır (`replace(/<[^>]*>/g,'')`). |
| **Backend'de gerekir** | `POST /<kaynak>/export {format,scope,columns[],filters{}}` → **iş kuyruğu** + hazır olunca indirme bağlantısı (büyük veri tarayıcıda toplanamaz) · gerçek XLSX (biçim, dondurulmuş başlık, sayı/tarih tipleri) · sunucu tarafı PDF (şirket antetli, sayfa numarası, `DB.company` bilgileri) · `can('disaAktar')` zorlaması + **dışa aktarma logu** (KVKK: kim neyi ne zaman indirdi). |

## 3.7 Arama

| | |
|---|---|
| **Bugün istemcide** | İki ayrı şey var. (1) **Liste içi arama**: `afterSearch()` (ui.js:530) — `cfg.search.fields` üzerinde `toLocaleLowerCase('tr')` ile alt dize araması + `search.extra(row)` ile türetilmiş metin (kod → ad çevirisi). 220 ms debounce. (2) **Global arama**: üst bardaki `#gvGlobalSearch` alanı `renderTop()`'ta basılıyor (shell.js:440) ama **hiçbir dinleyicisi yok** — yazı yazılır, hiçbir şey olmaz. Mesaj araması da yok. |
| **Backend'de gerekir** | `GET /search?q&types=&limit` → tip kırılımlı sonuç (müşteri, proje, görev, kişi, doküman, teklif) · Türkçe analiz (I/ı/İ/i, ş/s, ğ/g katlaması), önek + bulanık eşleşme · **yetki farkında indeks** (kullanıcının göremeyeceği kayıt sonuçta çıkmamalı) · son aramalar, kısayol atlama · liste içi arama listeleme ucunun `q` parametresine devredilir. |

## 3.8 Aktivite ve log yazımı

| | |
|---|---|
| **Bugün istemcide** | İki ayrı koleksiyon. `DB.activities` (`kayit,tarih,kisi,metin,eski,yeni,tone,icon`) — **kayıt bazlı iş geçmişi**, `GV.activity()` ile timeline olarak basılır. `DB.logs` (`kod,tarih,kisi,islem,kayit,modul,ip,eski,yeni`) — **sistem denetim izi**, `app-ayar-log.html`'de listelenir. İkisi de **elle yazılmış örnek kayıtlardır**; hiçbir aksiyon otomatik satır eklemez. |
| **Backend'de gerekir** | Her mutasyon ucundan otomatik yazım: aktör, kayıt, alan bazlı eski→yeni diff, IP, kullanıcı aracısı, korelasyon kimliği. Aktivite ve denetim izi **ayrı kalmalı** (biri iş anlatısı, diğeri uyum kaydı). Denetim izi **değiştirilemez** (append-only), saklama süresi tanımlı, `can('log')` ile korunur. Hassas alan değişimlerinde (maaş, yetki, vergi bilgisi) değer değil **değişti işareti** yazılır. |

## 3.9 Çoklu şirket (tenant) ayrımı

| | |
|---|---|
| **Bugün istemcide** | Tek şirket vardır: `DB.company`. `app-ayar-sirket.html` çoklu şirket listesi gösterir ama kayıtlar `localStorage['gv.sirket']`'te durur ve ekranın kendi ifadesiyle "kaynak: localStorage" olarak işaretlenir. **Verinin hiçbir yerinde `tenant`/`sirket` ayrım alanı yoktur** — 80 koleksiyonun hiçbirinde. |
| **Backend'de gerekir** | Ayrım stratejisi kararı: şema başına / satır başına `tenant_id` / veritabanı başına. Satır başına seçilirse **her tabloya `tenant_id` + her sorguya zorunlu süzgeç** (uygulama katmanında değil, satır düzeyi güvenlikle). Token'da tenant iddiası · tenant başına ayar, marka, kod serisi (`MUS-2024-001` sayaçları tenant başına) · tenant başına dosya izolasyonu · tenant değiştirme akışı · tenant arası veri sızmasına karşı test. Bu, **veri modeline sonradan eklenmesi en pahalı eksendir**; şimdiden alan açılması önerilir. |

## 3.10 Takvim ve tarih servisi

| | |
|---|---|
| **Bugün istemcide** | `DB.today = '2026-08-03'` **sabittir**; `Fmt.days(iso, today)` (ui.js:68) gerçek saati değil bunu çapa alır — mock verinin tutarlılığı buna bağlıdır. Biçimlendirme tamamen elle: `AY`/`AY_UZUN`/`GUN` dizileri (ui.js:16-18), `Intl` yalnız `toLocaleString('tr-TR')` sayı biçiminde kullanılıyor. Sıralama `localeCompare(…, 'tr')` ile. Ajanda ekranı `.gv-cal` ızgarasını `DB.meetings`/`DB.tasks`/`DB.leaves`'ten türetiyor. **İş günü hesabı, tatil takvimi, saat dilimi yok.** |
| **Backend'de gerekir** | Sunucu saati tek doğru kaynak (istemci saati doğrulanmaz) · ISO-8601 + UTC saklama, kullanıcı saat diliminde gösterim · **iş günü servisi**: resmî tatil takvimi + şirket çalışma düzeni (`gv.sirket`'te bugün yalnız tarayıcıda) — SLA, termin, izin gün sayımı bunu ister · tekrarlayan olay (RRULE) · `GET /calendar?from&to&kaynak=` birleşik olay akışı · takvim entegrasyonu (`DB.integrations` Google Calendar'ı "Bağlı" gösteriyor — **gerçekte bağlı değil**) · iCal dışa aktarma. |

---

# BÖLÜM 4 — Prototipin API açıkları (dürüst bölüm)

## 4.1 Sözleşmesi olup arkasında yordam olmayan yerler

| Yer | Ne vaat ediyor | Gerçekte ne oluyor |
|---|---|---|
| Üst bar global arama (`#gvGlobalSearch`, shell.js:440) | "Müşteri, proje, görev veya kişi ara" | **Hiçbir dinleyici bağlı değil.** Yazı yazılır, hiçbir şey olmaz |
| `GV.upload` / `type:'file'` | dosya yükleme | Yalnız `{ad, boyut}` listelenir; byte'lar hiçbir yere gitmez, yenilenince kaybolur |
| Çıktı → **Excel** | `.xls` indirir | Sekme ayraçlı düz metin; gerçek XLSX değil |
| Çıktı → **PDF** | PDF | Yazdırma penceresi; kullanıcıdan "PDF olarak kaydet" istenir |
| `DB.automations` | 30'un üzerinde otomasyon kuralı | Kuralları çalıştıran motor **yok** |
| `DB.taskTransitions` | durum makinesi (`next`, `yetki`, `zorunlu`, `bildirim`) | Uygulayan yordam **yok**; geçişler serbest |
| `DB.integrations[].durum:'Bağlı'` | GitHub / Google Calendar bağlı | Statik metin; hiçbir bağlantı yok |
| `DB.notificationChannels` | yedi bildirim kanalı | Düz string dizisi; hiçbiri bağlı değil |
| `counters()` (17 sayaç) | yaklaşan/geciken işleri sayar | Yalnız **sayar**; hiçbiri bildirim veya iş tetiklemez |
| `perm.mask(value)` | KVKK maskeleme | Görsel süs — veri istemci belleğinde tam hâliyle durur |
| `GV.errorState` "Tekrar dene" | hata kurtarma | Yalnız `state.error=false` + `load()`; gerçek bir yeniden istek yok |
| Skeleton gecikmesi (`cfg.delay`, vars. 260 ms) | ağ beklemesi | `setTimeout` ile **taklit edilen** yükleme |
| Kanban görünümü | sürükle-bırak (sözlükte yazıyor) | Yalnız kolonlu okuma; sürükleme **yok** |
| `documents[].versiyon` | sürüm yönetimi | Sayı alanı; artıran yordam yok |
| `channels[].okunmamis` | okunmamış sayacı | Sıfırlayan yordam yok |
| `decisions[].gorev` | karar → görev bağı | Bağ veride yazılı; üreten akış yok |
| `contracts` ↔ `invoices` ↔ `payments` zinciri | tutar bütünlüğü | Yalnız `tasks/qa/canon.js` **wave sonunda** doğrular; çalışma zamanı koruması yok |
| Rol seçimi (`index.html`) | oturum açma | Parola/token yok; herkes her rolü seçebilir |

## 4.2 `localStorage` / `sessionStorage` kalıcılıkları (ölçülmüş)

Aşağıdaki envanter, depoyu tarayarak **ölçülmüştür**; başka kalıcılık yoktur.

| Anahtar | Yazan yer | İçerik | Backend karşılığı olmalı |
|---|---|---|---|
| `gv.session` (**sessionStorage**) | `shell.js:230` `writeSession()` | `{emp,ad,ini,dep,depAd,rol,rolAd,eposta,girildi}` | `POST /auth/login` + token; sekme kapanınca silinmesi kasıtlı |
| `gv.menu.collapsed` | `shell.js:542` | `'0'`/`'1'` — bölüm menüsü daraltma | `PATCH /me/ui-prefs` (cihaz bazlı kalması da savunulabilir) |
| `gv.cols.<id>` | `ui.js:470` `saveCols()` | kolon sırası + görünürlük, liste başına | `PUT /me/list-views/{listId}/columns` |
| `gv.views.<id>` | `ui.js:1072` | **kayıtlı görünümler**: `[{ad, cols[]}]` | `POST /me/list-views` — bugün cihaz dışına çıkmaz, paylaşılamaz |
| `gv.rp.<id>` | `ui.js:1769` · `app-rapor.html:221` | **kayıtlı raporlar**: `[{nm,key,f{}}]` | `POST /saved-reports` — paylaşım ve zamanlama buna bağlanır |
| `gv.onayakis` | `app-ayar-onay.html:403` (okuma `app-satinalma-form.html:150`) | **onay akışı adım/eşik tanımı** | `PUT /settings/approval-flows` — **en kritik olan bu**: iş kuralı bir kullanıcının tarayıcısında duruyor ve satın alma formu oradan okuyor |
| `gv.sirket` | `app-ayar-sirket.html:147` | şirket bilgileri, çalışma düzeni, finans varsayılanları, **çoklu şirket listesi** | `PATCH /settings/company` + tenant kaydı |
| `gv.profil` | `app-ayar-profil.html:64` | kullanıcı tercihleri (dil, tema) | `PATCH /me` |
| `gv.notifpref` | `app-ayar-bildirim.html:217` | bildirim tercih matrisi (olay × kanal) | `PUT /me/notification-preferences` |

**Ölçüm notu:** dokuz anahtarın **üçü** (`gv.onayakis`, `gv.sirket`, `gv.notifpref`) aslında
**şirket düzeyinde iş kuralıdır**, kullanıcı tercihi değil. Tarayıcıda tutulmaları
prototip zorunluluğudur; backend'e geçişte bunlar **ilk taşınması gerekenlerdir** — çünkü
bir kullanıcının tarayıcı verisini silmesi bugün onay akışını sessizce varsayılana döndürür.
Kalan altısından `gv.cols.*` ve `gv.menu.collapsed` cihaz bazlı kalabilir; `gv.views.*`,
`gv.rp.*`, `gv.profil` ve `gv.session` kullanıcı hesabına bağlanmalıdır.

## 4.3 Mutasyon modelinin yapısal açığı

Prototipte "kaydetme" şu üç adımdır: (1) `form.submit()` ile değer nesnesi al,
(2) `DB.<koleksiyon>` dizisini **yerinde değiştir**, (3) `GV.refresh()` çağır.
Bunun üç sonucu ölçülmüştür ve kod yorumlarında yazılıdır:

- **`location.reload()` veriyi siler** — script'ler baştan koşar, mutasyon kaybolur (ders L-15,
  shell.js:838). Bu yüzden yenileme değil `GV.refresh()` kullanılır.
- **Dinleyici birikmesi** — `GV.refresh()` `#rec` mount düğümünü taze kopyayla değiştirir,
  yoksa her tazelemede bir dinleyici daha birikir ve tek tıklama N modal açardı (L-16, shell.js:846).
- **Açık overlay eski veriyi gösterir** — bu yüzden `GV.refresh()` açık modal/drawer'ı
  `__gvClose` ile kapatır (shell.js:863).

Gerçek bir backend'de bu üçü de ortadan kalkar; yerine **iyimser güncelleme + sunucu yanıtıyla
uzlaştırma + hata durumunda geri alma** gelir. Bugün hiçbir aksiyonun **başarısız olma ihtimali**
modellenmemiştir: `GV.errorState` bileşeni vardır ama onu tetikleyen gerçek bir hata yolu yoktur.

## 4.4 Doğrulamanın tek taraflılığı

`GV.form` doğrulaması (ui.js:1403) **yalnız istemcidedir** ve amacı kullanıcıya yardımdır.
Backend geldiğinde aynı kuralların sunucuda **yeniden** yazılması gerekir; ayrıca istemcide
hiç olmayan kontroller eklenmelidir: benzersizlik (vergi no, kod), referans bütünlüğü
(`musteri` gerçekten var mı), durum geçişi geçerliliği (`DB.taskTransitions`), tutar
bütünlüğü (net + KDV = brüt, Σ taksit = sözleşme neti), yetki kapsamı (kullanıcı bu
projeye görev açabilir mi), eşzamanlı düzenleme çakışması.

---

## Ek — Bölüm 1 özeti sayılarla

| Ölçüm | Değer |
|---|---|
| `GV.*` üst düzey anahtar | **37** (shell.js 12 · ui.js 25) |
| `GV.fmt` üyesi | 12 |
| `GV.chart` üyesi | 5 |
| `GV.perm` üyesi | 7 |
| `GV.shell` üyesi | 7 |
| `DB.*` koleksiyon/sabit | 80 |
| `DB.*` yardımcı fonksiyon | 10 |
| Sözlükte yazılı, kodda **olmayan** `GV.*` adı | 10 (`notify` `cols` `filters` `export` `bulk` `dateRange` `help` `kanban` `detail` `gantt`) |
| Yayılan özel olay | 3 (`gv:ready` · `gv:denied` · `gv:tab`) |
| `localStorage` anahtarı | 8 (+1 `sessionStorage`) |
| Gerçek ağ isteği | 1 (`fetch('assets/img/icons.svg')`) |
