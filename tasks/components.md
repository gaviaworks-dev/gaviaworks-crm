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
| Rol motoru | `GV.shell.role()` / `setRole()` | `sessionStorage`, URL yalnız ilk seçim |
| Yetki kapısı | `GV.perm.can(action, scope)` | sayfa açılışında da çalışır, 403 durumu basar |
| Bildirim merkezi | `GV.notify` | panel + sayaç + okundu |
| Sayfa başlığı üreticisi | `GV.pageHead({eyebrow,title,sub,actions:[{label,icon,cls,href,run}]})` | her ekranın ilk çağrısı; breadcrumb'ı da besler |
| Sayfa iskeleti | `buildSkeleton()` (shell.js, otomatik) | rail+menü+üstbar+main; sayfa yalnızca config yazar |
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

## 3. Detay Bileşeni — `GV.detail(config)`

```js
GV.detail({ record, header:{code,title,status,actions}, tabs:[{key,label,render}],
            aside:[{label,value}], activity:true })
```
- Sekmeli yapı (müşteri 15, proje 22 sekme) · sol içerik + sağ özet paneli
- Sekme URL hash'inde tutulur (`#tab=projeler`)
- Alt kısımda aktivite timeline'ı

---

## 4. Form Bileşeni — `GV.form(config)`

```js
GV.form({ sections:[{title, fields:[{key,label,type,required,hint,validate,cols}]}],
          record, onSubmit, submitLabel })
```
- Alan tipleri: text, textarea, select, multiselect, date, daterange, number, money,
  percent, switch, radio, checkbox, file, user, customer, project, tags, richtext
- Doğrulama: zorunlu, tip, aralık, tarih mantığı (bitiş ≥ başlangıç), çapraz alan
- Hata özeti + alan altı mesaj + ilk hatalı alana odak
- Kaydetmeden çıkışta uyarı

---

## 5. Durum Etiketi — `GV.badge(kind, value)`

Semantik renkler accent'ten **bağımsız**. `.gv-badge` + ton sınıfı:
`.is-ok` `.is-warn` `.is-danger` `.is-info` `.is-neutral` `.is-accent`

Kayıtlı sözlükler: görev durumu (19), satış aşaması (15), proje durumu, destek durumu,
izin durumu, satın alma onay durumu, araç durumu, öncelik (4), SLA durumu.

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
| Kolon yöneticisi | `GV.cols(table)` | göster/gizle · sırala · genişlik · kayıtlı görünüm |
| Filtre drawer | `GV.filters(config)` | alan tipli gelişmiş filtre + aktif filtre çipleri |
| Çıktı | `GV.export(config)` | kapsam seçimi (tümü/filtreli/seçili) + format |
| Tarih aralığı | `GV.dateRange(el)` | bugün/bu hafta/bu ay/çeyrek/özel |
| Toplu işlem barı | `GV.bulk(config)` | seçili kayıt sayısı + aksiyonlar |
| KPI kartı | `.gv-kpi` | ikon + sayı + etiket + trend + ton |
| İlerleme | `.gv-progress` | proje/görev ilerleme, bütçe kullanımı |
| Kullanıcı çipi | `.gv-user` | avatar (baş harf) + ad + rol |
| Yardım | `GV.help(key)` | alan/ekran açıklaması |
| Yazdırma başlığı | `.gv-print-head` | çıktı ekranları |
| Kanban | `GV.kanban(config)` | kolon = durum, sürükle-bırak |
| Takvim | `.gv-cal` ızgarası (`.gv-cal-dow`, `.gv-cal-day[.is-out|.is-today]`, `.gv-cal-num`, `.gv-cal-ev[.is-ok\|warn\|danger\|accent\|purple\|neutral]`) | ay = 7×6; hafta = `.gv-cal.is-week` (tek satır, uzun hücre); gün = `GV.activity` timeline'ı. Örnek: `app-ajanda.html` |
| Sohbet | `.gv-chatwrap` (`.gv-chatlist` > `.gv-chan`, `.gv-chatmain` > `.gv-chat-head` > `.gv-chat-title`/`.gv-chat-acts`, `.gv-chat-body` > `.gv-msg[.is-me]`, `.gv-msg-react`, `.gv-chat-foot`) | ≤900px'de `body.chat-list-open` kanal listesini açar — geri butonunu sayfa bağlar. Örnek: `app-sohbet.html` |
| Gantt | `GV.gantt(config)` | milestone + görev çubukları |

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
| `DB.supportPackages` | `ops.js` | Kota aritmetiği sabit: `kullanilan + kalan = aylikSaat × dönem ayı`. `kalan`, o müşterinin taleplerindeki `kalanDestek` ile **birebir aynı**. `sozlesme` → `DB.contracts`, `yenileme` / `yenilemeTarihi` yenileme işareti |
| `DB.surveys` | `ops.js` | Bir müşterinin **yanıtlanmış** anketlerinin `puan` ortalaması = `DB.customers[].memnuniyet` (arşivli anketler dahil). `tur:'Destek talebi'` anketin puanı = `DB.tickets[].memnuniyet`. `durum:'Bekliyor'` → `puan`/`tavsiye` null, ortalamaya girmez. `tavsiye` 0-10 NPS: 9-10 destekleyici · 7-8 nötr · 0-6 kötüleyici |
| `DB.decisions` | `misc.js` | Yalnız `durum:'Tamamlandı'` toplantılara bağlanır. `gorev` doluysa `DB.tasks`'ta karşılığı vardır |

---

## 10. QA Script'leri (scratchpad — orkestratöre ait)

| Script | Ne yapar | Beklenen |
|---|---|---|
| `qa.js "a.html,b.html" [rol]` | 1440/768/390 · konsol hatası · yatay taşma · sayfaya özel `<style>` · `href="#"` | `TEMİZ — hata yok, taşma yok` |
| `canon.js` | 7 canonical eksen: müşteri kartı ↔ işlem · fatura ↔ tahsilat · komisyon ↔ yönlendiren · SLA politikası ↔ talep · bakım paketi ↔ talep · anket ↔ müşteri/talep · `slaDurum` ↔ hesap | `TEMİZ — N kontrol` |
| `dbref.js` | Her ekranın okuduğu `DB.<koleksiyon>` ↔ yüklediği veri dosyası (lessons L-12) | `TEMİZ — N ekran` |
| `links.js` | Kırık hedef · BUILT'te olmayan ekran · hayalet BUILT kaydı · yetim ekran. Üretilmemiş hedefleri **kuyruk** olarak listeler, hata saymaz | `TEMİZ` + kuyruk listesi |
| `gate.js [roller]` | Tüm ekranlar × roller: konsol hatası, 403 sayımı, boş sayfa | `TEMİZ` |
| `grip-qa.js` | Rail tutamağı: geometri, yüzey rengi, hover yakalama noktaları, odak, içerik örtme | `TEMİZ — tüm ölçümler geçti` |

> `canon2.js` / `canon3.js` / `ref.js` **artık yok** — üçü de `canon.js` içinde birleşti.
> Eski `qa-links.js` kendi hardcode ettiği 8 sayfalık listeye göre karar veriyordu ve
> yayındaki her ekranı "kırık" sayıyordu; yerini `links.js` aldı.
