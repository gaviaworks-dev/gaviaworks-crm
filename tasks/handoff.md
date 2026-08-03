# Handoff — GaviaWorks CRM

> Bu dosya, **sıfırdan gelen bir Claude'un hiçbir şey sormadan** işe devam
> edebilmesi için yazıldı. Sırayla oku: bu dosya → `tasks/plan.md` → `tasks/components.md`.
> `PROMPT.md` mutlak kaynaktır; `CLAUDE.md` proje kurallarıdır.

**Güncelleme:** 2026-08-03 · 36 ekran canlıda · 53 commit · çalışma ağacı temiz.

---

## 1. ŞU AN TAM OLARAK NEREDE KALINDI

| | |
|---|---|
| Repo | `gaviaworks-dev/gaviaworks-crm` (public, remote doğrulandı) |
| Canlı | `https://gaviaworks-dev.github.io/gaviaworks-crm/` |
| Son commit | `bbf74e9 chore(shell): register notification and approval screens` |
| Yarım kalan ekran | **YOK** — son iki ekran (bildirimler, onaylar) bitti, QA'den geçti, push edildi |
| Aktif branch | `main` (doğrudan main'e çalışılıyor) |

### Yayında olan 36 ekran
```
index                       giriş + rol/persona seçici (form doğrulamalı)
app-panel                   7 rol varyantlı dashboard (dashboard.js)
app-panel-bildirimler       bildirim merkezi
app-panel-onaylar           bekleyen onay kuyruğu

app-lead · app-pipeline · app-referans · app-komisyon · app-onanaliz · app-teklif
app-musteri · app-musteri-yetkili · app-musteri-iletisim
app-proje
app-gorev · app-gorev-detay · app-istalebi
app-destek
app-personel · app-izin · app-zaman · app-kapasite · app-performans
app-demirbas · app-zimmet
app-arac · app-arac-bakim · app-arac-muayene · app-arac-sigorta ·
app-arac-yakit · app-arac-gider · app-arac-kaza
app-satinalma · app-tedarikci · app-siparis
app-dokuman · app-toplanti
```

### Doğrulanmış durum
- Her ekran 1440 / 768 / 390 px'de test edildi: **konsol hatası yok, yatay taşma yok**
- **Kırık link yok** — yayında olmayan hedefler otomatik `data-wip`
- 7 rol varyantı (sahip, satis, pm, personel, ik, satinalma, musteri) render ediyor
- Rail bölüm sayısı role göre değişiyor (sahip 15 → stajyer 4)

---

## 2. ORTAK KATMANIN MEVCUT DURUMU

### `assets/css/tokens.css` — TAM
Renk (marka/accent/nötr/semantik), spacing (`--sp-0..17`), radius, shadow,
tipografi (`--fs-2xs..5xl`, `--fw-*`, `--lh-*`, `--ls-*`), motion, layout
(`--rail-w`, `--menu-w-full`, `--side-w-full`, `--top-h`, `--drawer-w`, `--modal-w`),
z-index, kontrol yükseklikleri, odak halkaları.
**Kural:** aşağı katmanlarda hardcode renk/boşluk/yarıçap/gölge/tipografi **yok**.

### `assets/css/shell.css` — TAM
Rail + bölüm menüsü + üst bar + içerik + breadcrumb + sayfa başlığı + overlay.
Kırılımlar: `(min-width:981px) and (max-width:1180px)` / `(max-width:980px)` /
`(max-width:640px)` — **çakışmıyor** (lessons L-01).

### `assets/css/ui.css` — ~1150 satır, 22 bölüm — TAM
buton ailesi · kart + ızgaralar · KPI · durum rozeti/öncelik/etiket/kullanıcı çipi ·
liste üst alanı (`.gv-listhead`, `.lh-row`, `.lh-acts`, `.lh-achips`, `.lh-tabs`, chipbar) ·
tablo (`.gtable`) + mobil kart listesi (`.gv-cardlist`) + kart görünümü (`.gv-cards`) ·
sayfalama · toplu işlem barı · boş/yüklenme(skeleton)/hata durumu · form primitifleri ·
dosya yükleme · sekmeler · detay sayfası (`.gv-rec-head`, `.gv-dl`, `.gv-summary`) ·
aktivite timeline · yorum akışı · onay zinciri · ilerleme · modal/drawer/popover/toast ·
kanban · **takvim (`.gv-cal`)** · **gantt (`.gv-gantt`)** · grafikler + rapor iskeleti
(`.rp-filters`, `.rp-acts`) · **sohbet (`.gv-chatwrap`, `.gv-msg`)** · yardımcı sınıflar · `[data-wip]`.

> Takvim, gantt ve sohbet CSS'i **yazıldı ama henüz kullanan ekran yok** — hazır bekliyor.

### `assets/js/ui.js` — bileşen motoru — TAM
```
GV.fmt        date/dateShort/dateLong/dt/num/money/moneyK/pct/hours/days/rel/initials
GV.badge · GV.pri · GV.user · GV.dateCell · GV.progress · GV.tone
GV.toast · GV.modal · GV.confirm · GV.result · GV.drawer
GV.empty · GV.errorState · GV.skeleton
GV.list(cfg)  ← PROMPT.md §6'nın TAMAMI tek yerde
GV.tabs(sel)  ← detay sayfası sekmeleri (hash senkronlu, klavye ok tuşu)
GV.form(cfg)  ← alan tipleri + doğrulama + hata özeti + dosya yükleme
GV.activity · GV.chain · GV.chipbar
GV.chart.bar / line / donut / legend / spark   ← inline SVG, dış kütüphane yok
```
`GV.list` kapsadıkları: hızlı arama · gelişmiş filtre drawer'ı · aktif filtre çipleri ·
kolon göster/gizle/sırala + kayıtlı görünüm (localStorage) · sekme + canlı sayaç ·
sıralama · sayfalama (+ sayfa boyutu) · toplu seçim/işlem · arşiv toggle ·
Excel/CSV/PDF/yazdır · tablo/kart/kanban görünüm · boş-yüklenme-hata durumu ·
URL senkronu (`?t=&q=&p=&s=&d=&v=&arsiv=&f_*`) · mobil kart listesi (aynı veriden).

### `assets/js/shell.js` — shell motoru — TAM
`SECTIONS` (15 rail bölümü + menü kalemleri) · `RAIL_ORDER` · `SEC_BY_ROLE` (28 rol) ·
oturum (`sessionStorage`, URL `?role=` yalnız ilk seçimde) · `GV.perm` (can/scope/sec/item/mask) ·
`counters()` (sayaçlar mock veriden türetilir, sabit sayı yok) · rail/menü/üstbar/breadcrumb
render · menü aç-kapa · **yetki kapısı → 403 ekranı** · `BUILT` registry + `markWip()` +
MutationObserver · `buildSkeleton()` · `GV.pageHead()` · SVG sprite enjeksiyonu.

### `assets/js/dashboard.js`
7 rol varyantı: `sahip · satis · pm · personel · ik · satinalma · musteri`.

### `assets/data/*.js` — canonical mock veri
`org` (16 personel, 21 departman, 28 rol, yetki matrisi) · `crm` (lead, müşteri, yetkili,
referans, komisyon, ön analiz, teklif, teklif kalemi, iletişim) · `work` (proje, modül,
milestone, sprint, 25 görev, alt görev, bağımlılık, iş talebi, hata, test, teslim,
değişiklik talebi, onay kuyruğu, aktivite) · `ops` (demirbaş, zimmet, araç + bakım/muayene/
poliçe/yakıt/gider/kaza/ceza, tedarikçi, satın alma + onay zinciri, sipariş, destek, bakım paketi) ·
`hr` (izin, zaman kaydı, timesheet, performans, eğitim, kapasite) ·
`misc` (sözleşme, fatura, tahsilat, toplantı, karar, doküman, sohbet kanalı/mesaj,
bildirim, duyuru, 22 otomasyon kuralı, entegrasyon, log).

### `tasks/components.md` — GÜNCEL Mİ?
**Kısmen.** Sözlük doğru ve geçerli, ancak şu üç ekleme henüz işlenmedi:
1. `GV.pageHead(cfg)` — sayfa başlığı üreticisi (shell.js'te)
2. `buildSkeleton()` — sayfa iskeletinin shell tarafından kurulması
3. `BUILT` / `GV.markWip()` — yayında olmayan bağlantı işaretleme
**Yapılacak:** bu üçünü `components.md`'ye ekle.

---

## 3. YENİ EKRAN EKLEME — ADIM ADIM

### 3.1 Ekranı üret
Üretici: `<scratchpad>/gen.py` (yoksa aşağıdaki şablonu elle kur).
Sayfa **yalnızca** config içerir; rail/menü/üstbar iskeletini `shell.js` kurar.

```html
<!DOCTYPE html><html lang="tr"><head>
<meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex"><title>X — GaviaWorks CRM</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&display=swap" rel="stylesheet">
<link rel="stylesheet" href="assets/css/tokens.css">
<link rel="stylesheet" href="assets/css/shell.css">
<link rel="stylesheet" href="assets/css/ui.css">
</head>
<body data-sec="BÖLÜM" data-screen="EKRAN">
<div id="liste"></div>
<script src="assets/data/org.js"></script>
<!-- gereken diğer veri dosyaları -->
<script src="assets/js/shell.js"></script>
<script src="assets/js/ui.js"></script>
<script>
document.addEventListener('gv:ready', function(){
  var F = GV.fmt, esc = GV.esc;
  GV.pageHead({ eyebrow:'...', title:'...', actions:[{ label:'...', icon:'i-plus', cls:'btn-acc', href:'...' }] });
  GV.list({ mount:'#liste', id:'x', key:'kod', source:function(){ return DB.xxx; },
    exportName:'x', exportTitle:'X Listesi', pageSize:25,
    search:{ placeholder:'...', fields:[...] }, defaultSort:'kod',
    kpis:[...], tabs:[...], columns:[...], filters:[...],
    rowClass:..., mobile:function(r){...}, card:function(r){...},
    rowActions:[...], bulk:[...], emptyState:{...} });
});
</script></body></html>
```

`gen.py` kullanımı:
```bash
python3 gen.py '{"file":"app-x.html","title":"X","sec":"varlik","screen":"x","data":["org","ops"]}' body.js
```
Bu, dosyayı üretir **ve** `shell.js` içindeki `BUILT` dizisine ekler.

### 3.2 `shell.js` kayıtları — ÜÇ YER
1. **`BUILT` dizisi** (bölüm 7b) → dosya adını ekle.
   Eklenmezse ekrana giden tüm linkler `data-wip` kalır (kırık link çıkmaz ama ekran erişilemez).
2. **`SECTIONS.<bölüm>.menu`** → menü kalemi:
   `{ ic:'i-x', lbl:'Etiket', href:'app-x.html', screen:'x', cnt:'sayacAnahtari', tone:'danger', roles:['sahip'] }`
   - `screen` değeri, sayfanın `body[data-screen]` değeriyle **aynı olmalı** (menü vurgusu buna bağlı).
   - `cnt` → `counters()` içindeki anahtar; yeni sayaç gerekiyorsa `counters()`'a ekle.
   - `roles` → yalnız bu roller görsün (opsiyonel).
   - Grup başlığı: `{ seclbl:'Grup Adı' }`.
3. **`SEC_BY_ROLE`** → yeni bir rail bölümü açıldıysa, hangi rollerin göreceğini ekle.

### 3.3 Yetki
- Aksiyon yetkisi: `GV.perm.can('ekle'|'duzenle'|'sil'|'onay'|'disaAktar'|'finans'|'maas'|'log')`
- Kapsam: `GV.perm.scope('gor')` → `'tum'|'departman'|'proje'|'kendi'|'yok'`
- Hassas alan maskeleme: yetki yoksa `<span class="cell-mask">••••••</span>` bas
  (örnek: `app-personel.html` maaş kolonu, `app-musteri.html` ciro kolonu).
- Bölüm erişimi yoksa `shell.js` sayfayı otomatik 403 ekranına çevirir.

### 3.4 `data-wip` dönüşümü
Yeni ekran `BUILT`'e eklendiği anda, o ekrana giden **tüm** linkler
(menü, dashboard, liste satır aksiyonları) otomatik gerçek `href` olur.
Elle bir şey değiştirmeye gerek yok. Tersi de doğru: `BUILT`'te olmayan hedef
otomatik `data-wip` olur, tıklanınca açıklayıcı toast çıkar.

---

## 4. QA KOMUTLARI VE DOĞRULAMA AKIŞI

```bash
# 1) Sunucu (bir kez)
cd /Users/gaviaworks/Developer/Projects/gaviaworks-crm
python3 -m http.server 8791 &

# 2) Ekran QA — 1440/768/390 + konsol hatası + yatay taşma + screenshot
cd <scratchpad> && node qa.js "app-x.html|x,app-y.html|y"
#   → "TEMİZ — hata yok, taşma yok" bekleniyor

# 3) Rol taraması — 7 rol, dashboard + rail + menü sayıları
node qa-roles.js

# 4) Link bütünlüğü — kırık link var mı
node qa-links.js
#   → "Kırık bağlantı yok" bekleniyor
#   NOT: qa-links.js içindeki `pages` dizisini güncel ekran listesiyle eşitle

# 5) Canlı doğrulama (push sonrası ~1–2 dk)
curl -s -o /dev/null -w "%{http_code}\n" https://gaviaworks-dev.github.io/gaviaworks-crm/app-x.html
```
Screenshot'lar `docs/screenshots/` (gitignored). Playwright scratchpad'de kurulu
(`npm i playwright@1.62.1`); scratchpad silinmişse yeniden kur.

**Commit disiplini:** `git add -A` **yasak** — dosya adıyla tek tek stage.
Conventional Commits, İngilizce, ayrı concern ayrı commit. Commit sonu:
```
Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_01AFZ22KYDzKSD4GXaoq6gpi
```

---

## 5. BİLİNEN TUZAKLAR (`tasks/lessons.md` özeti)

| # | Tuzak | Kural |
|---|---|---|
| **L-01** | İki media query aynı anda geçerliyken kazananı **özgüllük** belirledi; menü mobilde 74px görünür kaldı | Kırılım aralıkları çakışmasın: `(min-width:981px) and (max-width:1180px)`. Ezilen kuralı geri almak için özgüllük yarışına girme |
| **L-02** | `--menu-w:0` olunca `translateX(calc(var(--menu-w)*-1))` sıfırlandı, gizleme çalışmadı | Daraltılabilir ölçüde iki token tut: `--x-full` (sabit referans) + `--x` (güncel). Gizleme hesabı **her zaman full** üzerinden |
| **L-03** | Sıralanabilir her kolona ikon basmak 13 kolonlu tabloyu okunmaz yaptı | Sıralama göstergesi yalnız **aktif sıralamada** ikon; diğerlerinde hover'da soluk `::after` |
| **L-04** | "İsim üstte, açıklama altta" bloklarında span'ler yan yana aktı — *iki kez oldu* (`.gv-me-*`, `.lg-role-*`) | Sarmalayıcıya **ve** iki alt öğeye `display:block`. Yeni böyle bir blok yazınca commit öncesi kontrol et |
| **L-05** | Mimari kazanım iddiası sorgulandı | İddiayı **ölç**: referans liste ekranı 1134 satır → `app-lead.html` 168 satır. Tahmin tutmazsa sapmayı olduğu gibi yaz |

**Ek tuzaklar (kod içinde çözülmüş, farkında ol):**
- `body[data-screen]` ile listenin ilk sekmesi **uyumlu olmalı**; `?t=` parametreli
  sayfalarda (`app-gorev.html`) `data-screen` inline script'le URL'den türetiliyor.
- Modal/drawer markup'ı `.gv-page` **içine** basılmaz (stacking context) — `GV.modal`
  zaten `document.body`'ye basıyor, elle markup yazma.
- Sayfaya özel `<style>` bloğu **yasak**; eksik kural `ui.css`'e eklenir ve
  `components.md`'ye işlenir. (`<script>` serbest — sayfa config'i orada.)
- Veri uydurma yok: yeni ekran için gereken alan `assets/data/*.js`'e eklenir,
  canonical kod (`MUS-2024-001`, `GRV-2026-101`) korunur.
- `gh` aktif hesabı `By4r` olabilir; push öncesi `gh auth switch --user gaviaworks-dev`.

---

## 6. BUNDAN SONRAKİ ÇALIŞMA MODELİ

**Ekran üretimi subagent ile yapılacak. Orkestratör bu kuralları uygular:**

### Rol dağılımı
- **Orkestratör (ana Claude):** ortak katmanın **tek sahibi**.
  `assets/css/*`, `assets/js/shell.js`, `assets/js/ui.js`, `assets/js/dashboard.js`,
  `assets/data/*.js`, `tasks/*` dosyalarına **yalnızca orkestratör** yazar.
  `BUILT` kaydı, `SECTIONS` menü kaydı, `SEC_BY_ROLE` yetkisi, QA, commit ve push
  orkestratörün işidir.
- **Subagent:** **tek bir HTML ekranı** yazar. Başka hiçbir dosyaya dokunmaz.

### Subagent sözleşmesi (prompt'a birebir koy)
1. Sana verilen **tek** dosyayı yaz: `app-<ad>.html`. Başka dosya oluşturma/değiştirme.
2. `assets/` altındaki **hiçbir** dosyaya dokunma. `tasks/` altına yazma.
   Scratchpad'deki ortak QA script'leri (`qa.js`, `qa-links.js`) **orkestratöre aittir** —
   subagent kendi QA script'ini yazmaz, oraya yazmaz (lessons L-06).
3. Sayfa şablonu bölüm 3.1'deki gibi olacak; iskeleti `shell.js` kurar,
   sen yalnız `GV.pageHead(...)` + `GV.list({...})` (veya detay ekranıysa
   `GV.tabs` + panel markup'ı) yazacaksın.
4. Sayfaya özel `<style>` **yazma**. Gereken bir CSS kuralı yoksa **uydurma** —
   raporunda "eksik bileşen: …" diye bildir.
5. Gereken bir veri alanı yoksa **uydurma** — raporunda "eksik veri alanı: …" diye bildir.
6. **Commit atma, push etme, git komutu çalıştırma.**
7. Raporun şu üç başlıktan oluşsun: (a) üretilen dosya, (b) eksik bileşen/veri
   listesi, (c) dikkat edilmesi gereken varsayımlar.

### Eşzamanlılık
- **Aynı anda en fazla 3 subagent.** Her biri farklı ekran dosyası yazar.
- Subagentler bittiğinde orkestratör sırayla: `BUILT` + `SECTIONS` kaydı → QA
  (`node qa.js`) → düzeltme → dosya dosya stage → commit → push → `plan.md` işaretle.
- Eksik bileşen raporu geldiyse **önce orkestratör** `ui.css`/`ui.js`'i günceller,
  `components.md`'ye işler, sonra ekranı yeniden QA eder.

---

## 7. SIRADAKİ İŞ

`tasks/plan.md` bitiş tanımıdır. Kalan başlıklar:

**Yakın sıradakiler (veri hazır, hızlı):**
`app-dokuman-sure` · `app-toplanti-karar` · `app-ajanda` (`.gv-cal` hazır) ·
`app-sohbet` (`.gv-chatwrap` hazır) · `app-sozlesme` · `app-fatura` · `app-tahsilat` ·
`app-butce` · `app-proje-milestone/sprint/test/hata/degisiklik/teslim` ·
`app-destek-sla/paket/memnuniyet` · `app-zaman-onay` · `app-egitim` ·
`app-satinalma-teklif` · `app-panel-ozet` · `app-panel-duyurular` · `app-panel-yonetici`

**Detay ekranları:** kalıp `app-gorev-detay.html` (8 sekme + yan panel + aktivite +
onay zinciri + gerçekten çalışan aksiyonlar). Öncelik: müşteri (15 sekme), proje (22 sekme),
lead, teklif, personel, araç, satın alma, destek.

**Form ekranları:** `GV.form({sections:[{title, fields:[...]}]})` — doğrulama,
hata özeti, dosya yükleme hazır. Her liste ekranının `-form.html` karşılığı gerekiyor.

### ⚠ plan.md'de bölünmesi gereken iki wave
**Wave 11 (Raporlama Merkezi)** ve **Wave 12 (Bildirim/Otomasyon/Ayarlar)** şu an
plan.md'de tek satırlık maddeler hâlinde; bu hâliyle subagent'a verilemez.
**Önce bu iki wave'i ekran bazında alt maddelere böl**, sonra üretime başla:

- **Wave 11 →** `app-rapor` (merkez) + `app-rapor-musteri` (14 rapor) +
  `app-rapor-personel` (13) + `app-rapor-gorev` (19) + `app-rapor-referans` (10) +
  `app-rapor-filo` (19) + `app-rapor-finans` (16) + `app-rapor-proje`.
  Her rapor ekranı için ayrı madde aç: KPI seti, grafik tipi, tablo kolonları, filtreler.
- **Wave 12 →** `app-ayar-sirket` · `app-ayar-departman` · `app-ayar-kullanici` ·
  `app-ayar-rol` · `app-ayar-yetki` (matris) · `app-ayar-onay` · `app-ayar-bildirim` ·
  `app-ayar-otomasyon` (22 kural) · `app-ayar-entegrasyon` · `app-ayar-log` ·
  `app-ayar-arsiv` · `app-ayar-profil`. Her biri ayrı madde.

Kapanış raporu **yalnızca plan.md'deki tüm maddeler işaretlendiğinde** verilir.
