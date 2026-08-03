# Handoff — GaviaWorks CRM

> Bu dosya, **sıfırdan gelen bir Claude'un hiçbir şey sormadan** işe devam
> edebilmesi için yazıldı. Sırayla oku: bu dosya → `tasks/plan.md` → `tasks/components.md`.
> `PROMPT.md` mutlak kaynaktır; `CLAUDE.md` proje kurallarıdır.
> **`tasks/ui-debt.md`** = arayüz borç defteri. Üretim sırasında görülen arayüz sorunları oraya
> yazılır, **o an düzeltilmez**; hepsi `plan.md` sonundaki **FAZ: UI ve UX KALİTE GEÇİŞİ** içinde
> ortak katmanda çözülür. Nokta yaması yasak. Ekran üretimi bitmeden bu faza başlanmaz.

**Güncelleme:** 2026-08-04 (2. oturum sonu) · **59 ekran canlıda** · Wave 11 tamam · Wave 12 %75.

---

## 1. ŞU AN TAM OLARAK NEREDE KALINDI

| | |
|---|---|
| Repo | `gaviaworks-dev/gaviaworks-crm` (public) · Canlı: `https://gaviaworks-dev.github.io/gaviaworks-crm/` |
| Aktif branch | `main` (doğrudan main'e çalışılıyor) |
| Yarım kalan ekran | **YOK** — üretimdeki her ekran QA'den geçip commit edilir |

### 2. oturumda eklenenler (23 ekran)
```
FİNANS      app-sozlesme · app-fatura · app-tahsilat · app-butce
İŞ BİRLİĞİ  app-sohbet (sohbetten görev oluşturma, 16 alanlı devir)
AJANDA      app-ajanda (ay/hafta/gün, 8 olay kaynağı)
RAPOR       app-rapor (merkez, 99 rapor kataloğu) · app-rapor-musteri (14) ·
            app-rapor-personel (13) · app-rapor-gorev (19) · app-rapor-referans (10) ·
            app-rapor-filo (19) · app-rapor-finans (16) · app-rapor-proje (12)   ← Wave 11 TAMAM
AYARLAR     app-ayar-yetki (27 rol × 15 modül × 19 eksen) · app-ayar-otomasyon (22 kural,
            kuru çalıştırma) · app-ayar-bildirim (31 tip × 7 kanal) · app-ayar-log (append-only) ·
            app-ayar-kullanici · app-ayar-entegrasyon · app-ayar-rol · app-ayar-departman ·
            app-ayar-profil
```
**Wave 12'de kalan 3 ekran** (bu oturumda üretime verildi, sonucu doğrulanmadıysa önce onu bitir):
`app-ayar-sirket` · `app-ayar-onay` · `app-ayar-arsiv`.

### Ortak katmana 2. oturumda eklenenler
- **`GV.report(cfg)`** — Wave 11'in tamamının dayandığı rapor iskeleti (components.md §5b).
- **`GV.upload(cfg)`** — form dışında da çalışan bağımsız dosya yükleme alanı.
- **`GV.pageHead`** aksiyonlarında `run(ev, btn)` desteği (href'siz aksiyon artık sahte buton değil).
- **`GV.perm.can('musteriRapor' | 'personelRapor')`** — türetilmiş rapor yetki eksenleri (assumptions V-13).
- **`SCREEN_PERM` (shell.js)** — ekran seviyesinde yetki kapısı. Ayarlar bölümü artık **tüm rollere**
  açık (herkes kendi profilini yönetir), yönetim ekranları bu haritayla kapatılır ve menüde gizlenir
  (assumptions V-22). Yeni bir hassas ekran eklerken bu haritaya da yaz.
- **`gv:ready` yalnız yetki kapısı açıkken tetiklenir**; kapalıyken `gv:denied` gider (lessons L-07).
- **`GV.notice({tone,title,text,actions})`** — satır içi bilgi/uyarı bloğu.
- **`GV.list` → `search.extra(row)`** — kayıtta kod tutulup ekranda ad gösterilen alanlar için
  türetilmiş arama metni.
- `GV.chart.bar` → `value2` ile karşılaştırma çubuğu + `money:true` ekseni; `bar/line/donut` boş veride
  kendiliğinden boş durum basar (artık çökmez).
- `GV.badge(v,'is-ok')` açık ton geçersen sözlüğü ezer; sözlüğe proje sağlığı ve finans durumları eklendi.
- `GV.list` aktif filtre çipleri artık ham kod yerine seçenek etiketini basar.
- CSS: `.gv-rp-*` (rapor düzeni) · `.gv-charts/.gv-chartcard` · `.gv-cal.is-week` + `is-purple/is-neutral`
  olay tonları · `.gv-chat-title/.gv-chat-acts/.gv-msg-react` · `.gv-tablewrap.is-sticky1` (geniş matris) ·
  `.cell-sw` · `.th-narrow` · `[hidden]` · `select[multiple]` yükseklik düzeltmesi · `.gv-file-body` (L-04).

### Canonical veri düzeltmeleri (2. oturum)
Rapor ekranları üç çelişki ortaya çıkardı, **kaynağında** düzeltildi:
1. Müşteri kartındaki `bekleyenTahsilat` / `aktifProje` işlem verisiyle uyuşmuyordu → yeniden türetildi,
   faturası olup tahsilatı olmayan `FTR-2026-031` için `THS-2026-047` eklendi (assumptions V-17).
2. `KOM-2026-004` ve `KOM-2025-006` müşteri kartındakinden farklı yönlendireni gösteriyordu → müşteri
   kaydı komisyona hizalandı, yönlendiren kartı tutarları `DB.commissions`'tan türetildi.
3. Departman kartındaki `personel` sayısı kadro kayıtlarıyla uyuşmuyordu (8 departman) → türetildi.
4. `projeSayisi` **ömür boyu** sayaçtır (DB.projects yalnız güncel projeleri tutar) — bilinçli istisna.

**Tarama script'leri her wave sonunda koşulur:** `canon2.js` (müşteri kartı ↔ işlem verisi) ·
`canon3.js` (fatura ↔ tahsilat) · `ref.js` (komisyon ↔ yönlendiren) · `gate.js` (tüm ekranlar × 5 rol).

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

> Takvim `app-ajanda.html`'de, sohbet `app-sohbet.html`'de kullanılıyor. **Gantt (`.gv-gantt`) hâlâ
> kullanan ekran bekliyor** — proje detayının Gantt sekmesinde kullanılacak.

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
`SECTIONS` (15 rail bölümü + menü kalemleri) · `RAIL_ORDER` · `SEC_BY_ROLE` (27 rol) ·
oturum (`sessionStorage`, URL `?role=` yalnız ilk seçimde) · `GV.perm` (can/scope/sec/item/mask) ·
`counters()` (sayaçlar mock veriden türetilir, sabit sayı yok) · rail/menü/üstbar/breadcrumb
render · menü aç-kapa · **yetki kapısı → 403 ekranı** · `BUILT` registry + `markWip()` +
MutationObserver · `buildSkeleton()` · `GV.pageHead()` · SVG sprite enjeksiyonu.

### `assets/js/dashboard.js`
7 rol varyantı: `sahip · satis · pm · personel · ik · satinalma · musteri`.

### `assets/data/*.js` — canonical mock veri
`org` (16 personel, 21 departman, 27 rol, yetki matrisi) · `crm` (lead, müşteri, yetkili,
referans, komisyon, ön analiz, teklif, teklif kalemi, iletişim) · `work` (proje, modül,
milestone, sprint, 25 görev, alt görev, bağımlılık, iş talebi, hata, test, teslim,
değişiklik talebi, onay kuyruğu, aktivite) · `ops` (demirbaş, zimmet, araç + bakım/muayene/
poliçe/yakıt/gider/kaza/ceza, tedarikçi, satın alma + onay zinciri, sipariş, destek, bakım paketi) ·
`hr` (izin, zaman kaydı, timesheet, performans, eğitim, kapasite) ·
`misc` (sözleşme, fatura, tahsilat, toplantı, karar, doküman, sohbet kanalı/mesaj,
bildirim, duyuru, 22 otomasyon kuralı, entegrasyon, log).

### `tasks/components.md` — GÜNCEL
`GV.pageHead` · `buildSkeleton()` · `BUILT`/`GV.markWip()` · `GV.report` (§5b) · `GV.upload` ·
takvim ve sohbet sınıfları işlendi. **Dikkat:** görünüm anahtarının gerçek sınıfı `.viewswitch`
(`.gv-` öneki YOK) — sözlük düzeltildi.

---

## 3. YENİ EKRAN EKLEME — ADIM ADIM

### 3.1 Ekranı üret
`gen.py` **artık kullanılmıyor** — ekranlar subagent'lara tek tek yazdırılıyor (bölüm 6).
Şablon aşağıdadır; sayfa yalnızca config içerir.
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

Scratchpad silinmişse önce kur:
```bash
cd <scratchpad> && npm init -y && npm i playwright@1.62.1
```

```bash
# 1) Sunucu — TEK THREAD'Lİ python -m http.server KULLANMA.
#    Tek thread'li sunucu çoklu sayfa taramasında kilitleniyor (qa-links takılıyor).
cd /Users/gaviaworks/Developer/Projects/gaviaworks-crm
python3 -c "
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
ThreadingHTTPServer(('127.0.0.1',8791), SimpleHTTPRequestHandler).serve_forever()
" &

# 2) Ekran QA — 1440/768/390 · konsol hatası · yatay taşma · sayfaya özel <style> ·
#    href="#" · screenshot
cd <scratchpad> && node qa.js "app-x.html,app-y.html" [rol]
#   → "TEMİZ — hata yok, taşma yok" bekleniyor

# 3) Rapor ekranı QA — her raporun KPI+grafik+tablo ürettiğini doğrular
node rp2.js app-rapor-x.html

# 4) Link bütünlüğü
node qa-links.js        # → "Kırık bağlantı yok (N ekran tarandı)"

# 5) Yetki taraması — rol başına can()/scope() değerleri
node perm.js

# 6) Canonical veri taraması — müşteri kartı ↔ işlem verisi
node canon2.js ; node canon3.js ; node ref.js

# 7) Canlı doğrulama (push sonrası ~1-2 dk)
curl -s -o /dev/null -w "%{http_code}\n" https://gaviaworks-dev.github.io/gaviaworks-crm/app-x.html
```
Screenshot'lar `docs/screenshots/` (gitignored).
`<scratchpad>` = `/private/tmp/claude-501/-Users-gaviaworks-Developer-Projects-gaviaworks-crm/<oturum>/scratchpad`
Bu script'ler **orkestratöre aittir** — subagent oraya yazmaz (lessons L-06).
`scratchpad/rp-example.html` = `GV.report` kullanımının çalışan örneği; rapor ekranı yazacak
subagent'a desen referansı olarak verilir.

**Commit disiplini:** `git add -A` **yasak** — dosya adıyla tek tek stage.
`tasks/` gitignored ama `tasks/handoff.md` bilinçli olarak `git add -f` ile izleniyor
(yeni oturum repodan okuyabilsin diye).
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

`tasks/plan.md` bitiş tanımıdır. **Wave 11 ve Wave 12 artık ekran bazında alt maddelere bölünmüş
durumda** — subagent'a doğrudan verilebilir.

### Sıradaki kuyruk (öncelik sırasıyla)
1. **Wave 12 — Ayarlar (kalan 9 ekran):** `app-ayar-sirket` · `app-ayar-departman` ·
   `app-ayar-kullanici` · `app-ayar-rol` · `app-ayar-onay` · `app-ayar-bildirim` (31 tip × 7 kanal
   matrisi) · `app-ayar-entegrasyon` · `app-ayar-log` · `app-ayar-arsiv` · `app-ayar-profil`
2. **Wave 1 kalanı:** `app-panel-ozet` · `app-panel-duyurular` · `app-panel-yonetici`
3. **Wave 9 kalanı:** `app-destek-sla` · `app-destek-paket` · `app-destek-memnuniyet`
4. **Wave 10 kalanı:** `app-dokuman-sure` · `app-toplanti-karar`
5. **İK/satın alma kalanı:** `app-zaman-onay` · `app-egitim` · `app-satinalma-teklif` · `app-odemeplani`
6. **Proje alt ekranları:** `app-proje-milestone` · `-sprint` · `-test` · `-hata` · `-degisiklik` · `-teslim`
7. **Detay ekranları** — kalıp `app-gorev-detay.html`. Öncelik: müşteri (15 sekme), proje (22 sekme),
   lead, teklif, personel, araç, satın alma, destek. **Gantt CSS'i (`.gv-gantt`) burada kullanılacak.**
8. **Form ekranları** — `GV.form({sections:[...]})` hazır; her liste ekranının `-form.html` karşılığı.
9. **Wave 13 kapanış:** `data-wip` süpürmesi · §22'deki 38 modüller arası bağlantının doğrulanması ·
   canonical tarama · 1440/768/390 tam tarama · kapanış raporu.

### Bir sonraki oturuma özel uyarılar
- Rapor ekranı yazdıracaksan subagent'a `scratchpad/rp-example.html` **veya** yayındaki
  `app-rapor-gorev.html` dosyasını desen referansı olarak ver — `GV.report` sözleşmesi orada.
- Yeni ekran doğunca `shell.js` `BUILT` dizisine eklemeyi unutma; menü/`SEC_BY_ROLE` kayıtları
  **15 bölümün tamamı için zaten yazılı**, yalnız BUILT satırı eksik kalıyor.
- `app-rapor.html` katalogdaki rapor adlarını yayındaki rapor ekranlarından okuyarak listeler;
  yeni rapor eklenirse katalog da güncellenmeli.
- Subagent raporlarındaki "eksik bileşen" ve "veri çelişkisi" notları **ciddiye alınmalı** — bu
  oturumda üç gerçek canonical hata bu yolla bulundu.

Kapanış raporu **yalnızca plan.md'deki tüm maddeler işaretlendiğinde** verilir.
