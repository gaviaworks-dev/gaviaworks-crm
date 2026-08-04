# Handoff — GaviaWorks CRM

> Bu dosya, **sıfırdan gelen bir Claude'un hiçbir şey sormadan** işe devam
> edebilmesi için yazıldı. Sırayla oku: bu dosya → `tasks/plan.md` → `tasks/components.md`.
>
> **İLK İŞ:** `tasks/qa/` altındaki tarama script'lerini scratchpad'e kopyala ve playwright
> kur (bölüm 4). Bu script'ler repoda **bilinçli olarak izleniyor** — scratchpad oturumlar
> arası siliniyor ve 3. oturumda hepsi kaybolmuştu, yeniden yazmak zaman aldı.
> `PROMPT.md` mutlak kaynaktır; `CLAUDE.md` proje kurallarıdır.
> **`tasks/ui-debt.md`** = arayüz borç defteri. Üretim sırasında görülen arayüz sorunları oraya
> yazılır, **o an düzeltilmez**; hepsi `plan.md` sonundaki **FAZ: UI ve UX KALİTE GEÇİŞİ** içinde
> ortak katmanda çözülür. Nokta yaması yasak. Ekran üretimi bitmeden bu faza başlanmaz.

**Güncelleme:** 2026-08-04 (3. oturum sonu) · **74 ekran canlıda** · **Wave 1, 9, 10, 11, 12 TAMAM.**

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
            app-ayar-sirket · app-ayar-onay (7 akış, 6 onay makamı) · app-ayar-arsiv   ← Wave 12 TAMAM
ANA PANEL   app-panel-ozet (günlük özet) · app-panel-duyurular · app-panel-yonetici   ← Wave 1 TAMAM
```
Son doğrulama: **65 ekran × 5 rol = 325 sayfa yüklemesi, konsol hatası 0**, kırık link yok.

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

### 3. oturumda yapılanlar

**UID-01 kapandı — rail collapse tutamağı ortak katmanda yeniden kuruldu.**
`.gv-divider` iki katman oldu: görünmez yakalama bandı (buton) + görünen grip (`span`).
Grip bitişik yüzeyin token rengini taşır, kenarlıksız-gölgesiz, yalnız dışa bakan kenarı
yuvarlak. `aria-expanded` + `aria-controls` eklendi; aç/kapa kararı artık sınıf varlığına
değil `matchMedia` ile gerçek duruma bakıyor — 981–1180 px'teki "ilk tıklama boşa gidiyor"
hatası da böyle düzeldi. Ölçüm: `scratchpad/grip-qa.js`. Canlıda doğrulandı.
Dersler: **L-09 · L-10 · L-11**.

**Bu oturumda üretilen ekranlar (9):**
`app-destek-sla` · `app-destek-paket` · `app-destek-memnuniyet` (Wave 9 TAMAM) ·
`app-toplanti-karar` · `app-dokuman-sure` (Wave 10 TAMAM) ·
`app-zaman-onay` · `app-egitim` · `app-satinalma-teklif` · `app-odemeplani`

**Ortak katmana eklenenler:**
- `DB.slaPolicies` — kategori × öncelik SLA matrisi (dakika hedefleri). `DB.tickets[].sla`
  artık bu tablonun türevi.
- `DB.surveys` — 24 memnuniyet anketi. Canonical: yanıtlanmış anketlerin müşteri bazlı
  puan ortalaması = `DB.customers[].memnuniyet`; destek anketinin puanı = talebin `memnuniyet`i.
- `DB.supportPackages` → `sozlesme` · `yenileme` · `yenilemeTarihi` alanları + 2 yeni paket
  (yenilemesi yaklaşan ve süresi dolmuş durumlarını gerçekten üreten kayıtlar).
- `DB.meetings` → 4 tamamlanmış geçmiş toplantı · `DB.decisions` → 9 yeni karar.
- `GV.badge` sözlüğüne destek ve bakım durumları (8 değer).
- **`GV.list` → `rowActions[].show(row)`** — satıra uymayan aksiyon hiç basılmaz
  (iki ajan aynı boşluğu bildirdi; `onRender`'da DOM'dan buton silme deseni artık gereksiz).
- `DB.timelogs` 2026-W31 haftası tamamlandı (14 → 45 kayıt): her timesheet'in `toplam` ve
  `faturalanabilir` alanı artık kendi satırlarının toplamına **birebir** eşit.
- `DB.supplierQuotes` 2 → 9 teklif (4 talebe yayılmış, biri teknik uygunsuz, biri tercihsiz).
- `DB.documents` süresi dolmuş 2 kayıt · `DB.milestones` başına net/brüt sözleşmesi yazıldı.

**Düzeltilen gerçek hatalar:**
1. **Etkileşimde patlayan latent bug — 5 ekran.** Ekran config'i `DB.priorities` /
   `DB.timelogs` / `DB.activities` okuyordu ama o koleksiyonun dosyası sayfada yüklü
   değildi. Gelişmiş filtre **açılınca** patlıyordu; açılış QA'si göremiyordu.
   Tarayıcı yazıldı: `scratchpad/dbref.js`. Ders **L-12**.
2. **Canonical:** `DST-2026-120` `kalanDestek` 26 ↔ paket kalanı 62 çelişkisi.
3. **Canonical:** 5 talepte `slaDurum` hesapla çelişiyordu; zaman damgaları gerçekçi
   hale getirildi ve `slaDurum` "iki eksenin kötüsü" kuralıyla yeniden yazıldı.
4. **Canonical:** `FTR-2026-024` yanlış milestone'a bağlıydı → iki fatura tek milestone'a
   düşüyor, tamamlanmış bir milestone "faturasız" görünüyordu. `DB.milestones[].odeme`
   beş kayıtta brüt dört kayıtta netti; net'e sabitlendi (ders **L-13**).
5. **Canonical:** timesheet'ler kendi zaman kayıtlarının toplamını tutmuyordu
   (42 saatin yalnız 11'i kayıtlıydı).
6. `app-toplanti.html` yeni görev kodunu dizi uzunluğundan türetiyordu (GRV-2026-325'e
   atlıyordu); gerçek maksimum+1'e çevrildi.

**QA script'leri yeniden kuruldu** (eskiler scratchpad silinince kaybolmuştu, ayrıca
`qa-links.js` hatalıydı — kendi hardcode ettiği 8 sayfalık listeye göre yayındaki her
ekranı "kırık" sayıyordu). Güncel set `components.md` §10'da.

**Yeni borç kayıtları:**
- **UID-05** — `GV.perm.scope('gor')` liste ekranlarında uygulanmıyor (65+ ekran;
  `GV.list` `scopeField` sözleşmesiyle çözülecek).
- **UID-06** — `GV.list` sayfa başlığı sayacı global (`[data-listcount]`); aynı sayfada
  ikinci liste örneği kurulamıyor, bu yüzden `app-egitim` matrisi elle yazıldı.
- **UID-07** — toplu işlem "çıktı al" seçili kapsamı dışa aktaramıyor, yalnız toast basıyor.

**Oturum sonu tam tarama (koşuldu, sonuç ölçüldü):**
`gate.js` 370 sayfa yüklemesi (74 ekran × 5 rol: sahip 74 açık · pm 44 · destek 24 ·
muhasebe 45 · stajyer 14) — konsol hatası 0, boş sayfa 0, kırık istek 0, boş sayfa 0.
Ek olarak `idari` rolüyle 74 ekran daha tarandı (36 açık / 38 → 403), yine temiz. `canon.js` 227 kontrol temiz.
`dbref.js` ve `links.js` temiz. Dört yeni ekranın hepsi canlıda (HTTP 200).

**Ölçü:** 74 ekran · 30.294 satır (ortalama 409 satır/ekran).
Ortak katman: `tokens.css` 199 · `shell.css` 414 · `ui.css` 1.237 · `shell.js` 855 ·
`ui.js` 1.897 satır. Ekran başına düşen satır, ortak bileşen katmanının taşıdığı yükün
ölçüsüdür — referans projede tek bir liste ekranı 1.134 satırdı (lessons L-05).


### VERİ BORCU — bilinçli olarak devredildi (3. oturum)

Bu iki çelişki **bulundu, ölçüldü, düzeltilmedi.** İkisi de kaynağı geniş bir alanı
(finans raporları, müşteri cirosu, sözleşme ekranları) etkiliyor; yarım düzeltme
yenilerini doğurur. Ayrı bir oturumda bilinçli olarak ele alınmalı.

**VB-01 · `DB.contracts[].tutar` bazı sözleşmelerde KDV dahil, bazılarında hariç.**
`app-odemeplani.html` sözleşmenin `odemePlani` metnini taksit tutarlarıyla karşılaştırınca
6 sözleşmenin 5'i tutmuyor:

| Sözleşme | Plan | `tutar` | Plandan pay | Milestone `odeme` |
|---|---|---|---|---|
| SZL-2026-021 | %50 · %50 | 600.000 | 300.000 | 300.000 ✓ |
| SZL-2026-019 | %30 · %30 · %40 | 880.000 | 264.000 | MS-001 264.000 ✓ · MS-002 176.000 ✗ |
| SZL-2025-018 | 6 eşit milestone | 1.104.000 | 184.000 | 163.333 ✗ |
| SZL-2026-023 | %30 · %30 · %40 | 420.000 | 126.000 | 70.000 ✗ |
| SZL-2026-024 | %50 · %50 | 185.000 | 92.500 | 77.083 ✗ |
| SZL-2026-020 | %40 · %30 · %30 | 354.000 | 106.200 | 88.500 ✗ |

Tutmayan dördünde eski `odeme` değeri faturanın **brüt** tutarına eşitti — yani o
sözleşmelerin `tutar`'ı KDV dahil yazılmış. `milestone.odeme` bu oturumda **net**'e
sabitlendi (fatura `tutar`'ıyla birebir, 7/7 doğrulandı) ama sözleşme tarafına
dokunulmadı. Düzeltmenin dokunacağı yerler: `DB.contracts[].tutar` · `DB.customers[].toplamCiro` ·
`app-sozlesme` · `app-butce` · `app-rapor-finans` · `app-rapor-proje`.
**Önce konvansiyon seçilmeli** (sözleşme bedeli net mi brüt mü), koleksiyonun başına
yazılmalı, sonra `canon.js`'e kontrol eklenmeli.

**VB-02 · `DB.milestones` sözleşmelerin tam taksit setini içermiyor.**
SZL-2025-018 "6 eşit milestone" diyor ama 2 milestone var; SZL-2026-020 ve -023
"3 taksit" diyor, 1'er milestone var. `app-odemeplani.html`'in "toplam plan tutarı"
KPI'ı bu yüzden sözleşme bedelleri toplamının altında kalıyor — ekran hatası değil,
veri kapsamı eksiği. VB-01 ile birlikte çözülmeli.

**VB-04 · "hakediş" inşaat terimi komisyon modülünde hâlâ yaşıyor — AÇIK.**
CLAUDE.md ve PROMPT.md §1 "hakediş" kelimesini yasaklıyor. Milestone bağlamındaki kullanımlar
(`app-rapor-proje.html`, `app-ajanda.html`) bu oturumda "taksit"e çevrildi. Ama komisyon modülü
baştan sona bu terim üzerine kurulu: `app-komisyon.html` (başlık, 8 etiket), `DB.commissions[].hakedisTarihi`,
`DB.referrers[].hakedis`, `app-rapor-referans.html`, `app-ayar-arsiv.html` (kolon sözlüğü + PARA regex'i),
`canon.js` eksen 3. Alan adı değişikliği olduğu için tarama script'ine de dokunur.
**Neden kapatılmadı:** kapsam genişletmesi olurdu ve yarım rename canonical taramayı kırar.
**Çözüm:** tek seferde `hakedis` → `kazanc` (veya `komisyonTarihi`) alan adı rename'i + etiketlerde
"Komisyon kazancı". `canon.js` eksen 3 aynı turda güncellenir.

**VB-03 · `DB.supplierQuotes[].puan` ile `DB.suppliers[].puan` farklı eksenler.**
Teklif puanı "bu teklife verilen değerlendirme", tedarikçi puanı "genel performans"
olarak yorumlandı ve `app-satinalma-teklif.html` ikisini ayrı gösteriyor. Bu yorum
doğruysa bir sorun yok; ama hiçbir yerde **yazılı değil**. `ops.js`'e yazılmalı.

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

Scratchpad silinmişse önce kur — **script'ler repoda, yeniden yazma:**
```bash
cd <scratchpad> && npm init -y && npm i playwright@1.62.1
cp /Users/gaviaworks/Developer/Projects/gaviaworks-crm/tasks/qa/*.js .
```
`tasks/qa/` içindekiler: `qa.js` · `canon.js` · `dbref.js` · `links.js` · `gate.js` · `grip-qa.js`.
Ekranların çoğu rol seçimi olmadan `index.html`'e yönlenir; tarayıcıda ekran açarken
**`?role=sahip`** parametresini kullan (ya da `sessionStorage.gv.session`'ı tohumla).

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

# 3) Canonical veri taraması — 7 eksen tek script'te (eski canon2/canon3/ref birleşti)
node canon.js                     # → "TEMİZ — N kontrol, canonical çelişki yok"

# 4) Yüklenmeyen veri dosyası taraması (lessons L-12 — açılış QA'si bunu göremez)
node dbref.js                     # → "TEMİZ — N ekran"

# 5) Bağlantı bütünlüğü — kırık hedef, eksik BUILT kaydı, hayalet kayıt, yetim ekran
node links.js                     # → "TEMİZ" + üretilmemiş hedef kuyruğu

# 6) Tüm ekranlar × roller — konsol hatası, 403 sayımı, boş sayfa
node gate.js                      # varsayılan sahip,pm,destek,muhasebe,stajyer

# 6b) Rail tutamağı ölçümü (UID-01 regresyon testi)
node grip-qa.js                   # → "TEMİZ — tüm ölçümler geçti"

# 7) Canlı doğrulama (push sonrası ~1-2 dk)
curl -s -o /dev/null -w "%{http_code}\n" https://gaviaworks-dev.github.io/gaviaworks-crm/app-x.html
```
Screenshot'lar `docs/screenshots/` (gitignored).
`<scratchpad>` = `/private/tmp/claude-501/-Users-gaviaworks-Developer-Projects-gaviaworks-crm/<oturum>/scratchpad`
Bu script'ler **orkestratöre aittir** — subagent oraya yazmaz (lessons L-06).
`rp2.js` / `perm.js` / `qa-login.js` / `qa-roles.js` bu oturumda yeniden kurulmadı;
gerekirse `gate.js` deseninden türetilir.
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
`node tasks/qa/links.js` çıktısındaki "henüz üretilmemiş hedefler" listesi **canlı kuyruktur** —
her zaman güncel, elle sayılmaz. Bu oturum sonunda 62 hedef bekliyordu.

1. **İK / satın alma kalanı:** `app-odemeplani`
2. **Proje alt ekranları:** `app-proje-milestone` · `-sprint` · `-test` · `-hata` ·
   `-degisiklik` · `-teslim`
3. **Detay ekranları** — kalıp `app-gorev-detay.html`. Öncelik: müşteri (15 sekme),
   proje (22 sekme), lead, teklif, personel, araç, satın alma, destek.
   **Gantt CSS'i (`.gv-gantt`) hâlâ kullanan ekran bekliyor** — proje detayının Gantt sekmesi.
4. **Form ekranları** — `GV.form({sections:[...]})` hazır; her liste ekranının `-form.html` karşılığı.
   Kuyruğun en kalabalık bölümü (30+ ekran), en şablonlaşabilir olanı da bu.
5. **Wave 13 kapanış:** `data-wip` süpürmesi · §22'deki 38 modüller arası bağlantının
   doğrulanması · canonical tarama · 1440/768/390 tam tarama · kapanış raporu.
6. **FAZ: UI ve UX KALİTE GEÇİŞİ** — `ui-debt.md`'deki UID-02 · UID-03 · UID-04 · UID-05.
   UID-01 kapandı. **Ekran üretimi bitmeden bu faza başlanmaz.**

### Bir sonraki oturuma özel uyarılar
- Rapor ekranı yazdıracaksan subagent'a `scratchpad/rp-example.html` **veya** yayındaki
  `app-rapor-gorev.html` dosyasını desen referansı olarak ver — `GV.report` sözleşmesi orada.
- Yeni ekran doğunca `shell.js` `BUILT` dizisine eklemeyi unutma; menü/`SEC_BY_ROLE` kayıtları
  **15 bölümün tamamı için zaten yazılı**, yalnız BUILT satırı eksik kalıyor.
- `app-rapor.html` katalogdaki rapor adlarını yayındaki rapor ekranlarından okuyarak listeler;
  yeni rapor eklenirse katalog da güncellenmeli.
- Subagent raporlarındaki "eksik bileşen" ve "veri çelişkisi" notları **ciddiye alınmalı** — bu
  oturumda dört gerçek canonical hata ve iki shell hatası bu yolla bulundu.
- **Arayüz sorunu görülürse düzeltme, `tasks/ui-debt.md`'ye yaz.** Hepsi ekran üretimi bittikten
  sonra `plan.md` sonundaki **FAZ: UI ve UX KALİTE GEÇİŞİ** içinde ortak katmanda çözülecek.
  Şu an defterde: UID-01 rail collapse çentiği · UID-02 mobil kartta satır aksiyonu yok ·
  UID-03 kare thumbnail sınıfı yok · UID-04 `GV.upload` File nesnesini vermiyor.
- **Subagent bağlantı hatasıyla düşerse dosyayı kontrol et:** çoğu zaman dosya diskte yarım kalır.
  `node -e` ile inline script'i parse et; yarımsa ajanı `SendMessage` ile "kaldığın yerden tamamla,
  baştan yazma" diye devam ettir (bu oturumda üç kez oldu, üçü de kurtarıldı).
- Yeni hassas ekran eklerken `shell.js` içinde **iki** yere yaz: `BUILT` **ve** `SCREEN_PERM`.

Kapanış raporu **yalnızca plan.md'deki tüm maddeler işaretlendiğinde** verilir.
