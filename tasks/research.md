# research.md — GaviaCRM v2 Referans İncelemesi

> Kaynak: `https://gaviaworks-dev.github.io/gaviacrm/v2/`
> İnceleme: Playwright headless, 1440 / 768 / 390 px + ham kaynak kod indirmesi.
> Amaç: **görsel dil + ortak bileşen mantığı + sayfa standardı** çıkarmak.
> İnşaat içeriği KOPYALANMAZ (PROMPT.md Bölüm 1 dönüşüm tablosu uygulanır).

---

## 1. Referansın Genel Mimarisi

| | |
|---|---|
| Tip | Buildless statik çok sayfalı (MPA) prototip — her ekran ayrı `.html` |
| Toplam ekran | **249** benzersiz sayfa (`crm-dizin.html` ekran dizininden sayıldı) |
| Giriş | `index.html` = **rol seçici landing** (persona kartları) → `crm-panel.html?role=<rol>` |
| CSS | `assets/css/tokens.css` (59 satır) + `shell.css` (306) + `ui.css` (989) |
| JS | `assets/js/shell.js` (1856) + `assets/js/ui.js` (2580) |
| Dış bağımlılık | Manrope (Google Fonts) + Font Awesome 6.5.2 (CDN) |
| Durum yönetimi | `localStorage` (kolon tercihleri, kayıtlı görünümler, filtreler) |
| Rol taşıma | `?role=` query param + `body[data-sec]` + `body[data-screen]` |

**Dosya adlandırma kalıbı** — her modül üç ekrana açılıyor:
`crm-<modul>.html` (liste) · `crm-<modul>-detay.html` (sekmeli detay) · `crm-<modul>-form.html` (ekle/düzenle)
Ek kalıplar: `-dashboard.html`, `-cikti.html` (yazdırma), `-onay-gecmisi.html`, `-arsiv.html`.

**Bu projeye taşınacak karar:** aynı MPA + üçlü ekran kalıbı korunur. Gerçek `href` navigasyonu
sağlar, GitHub Pages'te sorunsuz çalışır, derin link verilebilir.

---

## 2. Shell Yapısı (korunacak)

```
.gv-app
├── aside.gv-rail      → 76px, en koyu lacivert (--gv-deep), sadece ikon; bölüm anahtarı
├── nav.gv-menu        → 264px, koyu lacivert (--gv-night), aktif bölümün alt menüsü
├── .gv-divider        → menüyü daralt/genişlet tutamacı
├── .gv-overlay        → mobil menü arka planı
├── header.gv-top      → 64px; burger + global arama + dil + bildirim + persona çipi
└── main.gv-main       → açık zemin (--bg) içerik alanı
```

Ölçüler token'da: `--rail-w:76px` · `--menu-w:264px` · `--side-w:340px` · `--top-h:64px`.

**İki katmanlı menü mantığı (en değerli fikir):** sol rail modülü seçer, ikinci kolon
o modülün alt menüsünü gösterir. 20+ modüllü bir sistemde tek uzun akordeon menüden
çok daha hızlı. **Aynen alınacak.**

Menü modeli `shell.js` içinde veri olarak duruyor:

```js
SECTIONS = { panel:{ ic, eyebrow, title, menu:[ {ic,lbl,href,screen,cnt}, {seclbl:'Grup'} ] }, ... }
RAIL_ORDER = ['panel','santiye','gorev',...]
ROLES = { sahip:{ name, role, ini, secs:[...], scr:{ sec:[screen,...] }, land } }
```

- `secs` → rolün göreceği rail bölümleri
- `scr` → bölüm içinde görebileceği ekranlar (ekran bazlı kısıt)
- `{seclbl:'...'}` → menü içi grup başlığı
- `cnt` → menü kalemindeki rozet sayısı (rol çözüldükten sonra hesaplanan değerle eziliyor)

**Bu projeye taşınacak karar:** aynı veri-güdümlü menü modeli, fakat yazılım şirketi
bilgi mimarisiyle ve `perm` (yetki) alanı eklenerek. Yetki sadece menü gizleme değil,
sayfa seviyesinde de kontrol edilecek (PROMPT.md §5 ve §23).

---

## 3. Liste Sayfası Standardı (birebir alınacak — PROMPT.md §6)

Referanstaki dikey sıra:

1. **`.gv-page-head`** — `.ph-eyebrow` (modül adı) + `h1` + `.ph-sub` (toplam kayıt · aktif sekme) + `.ph-actions` (ana ekleme butonu)
2. **`.kpi-grid`** — 4 adet `.kpi-card` (ikon + sayı + etiket, semantik renk varyantları)
3. **`.gv-card`** içinde:
   - **`.gv-listhead > .lh-row`** — solda `.lh-search`, sağda `.lh-acts`:
     `Gelişmiş Filtre` · `Kolonlar` · `Arşivlenenleri Göster` (checkbox toggle) · `Dışa Aktar`
   - **`.lh-achips`** — aktif filtre çipleri + `Filtreleri Temizle` (filtre yokken `hidden`)
   - **`.lh-tabs > .gv-chipbar`** — durum sekmeleri, her birinde `.ch-cnt` sayaç,
     taşınca `.cb-arrow` ok butonlarıyla yatay kaydırma
   - **`table.gtable[data-paginate]`** — checkbox kolonu + `th[data-col]` (kolon yönetimi anahtarı) + satır sonu ikon aksiyonları

**Mobil (≤640px):** tablo `display:none`, yerine `.gr-mobile-list` kart listesi devreye
giriyor; aynı satır kümesinden `data-idx` ile eşleşerek üretiliyor. Liste aksiyonları
ikon-only'ye düşüyor (`.lh-lbl` gizleniyor).

**Zayıf nokta (bizde düzeltilecek):** referansta mobil kart listesi **sayfaya özel CSS ve
elle yazılmış ikinci bir markup** olarak duruyor (`crm-gorev.html` içinde 20 satır CSS +
ayrı DOM). Bu tekrar demek. Bizde tablo ve kart görünümü **tek veri kaynağından**
ortak liste bileşeni tarafından render edilecek.

---

## 4. ui.js Bileşen Kataloğu (fikir olarak alınacak)

| Bileşen | Görev | Bizde karşılığı |
|---|---|---|
| `gvFilterDrawer` | Sağdan açılan gelişmiş filtre; alan tipleri (select/çoklu/tarih/sayı aralığı) | ✔ alınacak, config-driven |
| `gvFilterPanel` | Markup tabanlı eski filtre paneli | ✖ tek motorda birleştirilecek |
| `gvCols` | Kolon göster/gizle + sırala + kayıtlı görünüm (localStorage) | ✔ + kolon genişliği eklenecek |
| `gvChipBar` | Kaydırmalı sekme şeridi + ok butonları | ✔ |
| `gvBulk` | Seçili kayıt aksiyon barı | ✔ |
| `gvExport` | Excel/CSV/PDF/Yazdır akış modalı, "tümü/filtreli" kapsam seçimi | ✔ |
| `gvConfirm` / `gvResult` / `gvToast` | Onay modalı, sonuç modalı, toast | ✔ |
| `gvHelp` | Alan/ekran açıklaması modalı | ✔ |
| `gvCount` | Kayıt sayısı özeti | ✔ liste bileşenine gömülü |
| `gvDateRange` | Hazır aralıklar (bugün/bu hafta/bu ay/özel) | ✔ |
| `gvChain` | Onay zinciri görselleştirmesi | ✔ |
| pagination | `data-paginate="10"` ile tablo sayfalama | ✔ + URL senkronu |
| `wireScrollHints` | Yatay taşmada kenar gölgesi | ✔ |

`ui.css` bölüm başlıkları bileşen sözlüğünü doğruluyor: buton ailesi, panel kartı, KPI,
durum rozeti, filtre barı, `.gtable` primitifi, ilerleme çubuğu, toggle, form primitifleri,
aktivite/feed listesi, boş durum, onay zinciri, modal, toast, rapor iskeleti (`.rp-*`),
çıktı başlığı (`.pr-*`).

---

## 5. Tasarım Dili — Token Analizi

Referans `tokens.css` üç katman kuruyor:

- **Marka (koyu katman):** `--gv-deep:#020837`, `--gv-night:#141533`, `--gv-mint:#3FD5AD`
- **Light içerik türevleri:** `--bg:#F4F6F9`, `--paper:#FFF`, `--ink:#111528`, `--muted:#69708A`, `--line:#E4E7EE`
- **Semantik (accent'ten bağımsız):** `--ok:#2E9E6B`, `--warn:#A97908`, `--danger:#D14343`, `--info:#3B6FD4` + `-tint` eşleri

Yarıçap `--r-sm/md/lg/pill`, gölge `--sh-sm/md/lg`, `--ease`, tipografi Manrope.

**Kritik ayrım — accent ile semantik ayrılmış.** Durum rozetleri marka rengine bağlı
değil; bölüm rengi değişse bile "geciken" hep kırmızı kalıyor. **Bu disiplin aynen alınacak.**

**Bizim tokens.css'imiz sıfırdan yazılacak.** Gavia Works kurumsal kimliği (koyu lacivert +
mint) ortak, ancak dosya bu projeye ait olacak: inşaat bölüm renkleri taşınmayacak,
spacing ve tipografi skalası eksiksiz tanımlanacak (referansta spacing token'ı **yok** —
`padding:14px 18px` gibi sabitler CSS içine gömülü). CLAUDE.md "sıfır hardcode değer"
şartı bunu zorunlu kılıyor.

---

## 6. Detay Sayfası Yapısı

`crm-gorev-detay.html` (1461 satır) kalıbı:
- Breadcrumb + kayıt kodu + durum rozeti + sağda aksiyon butonları
- Sekme şeridi (Genel / Kontrol Listesi / Dosyalar / Yorumlar / Aktivite ...)
- İki kolon: solda ana içerik, sağda özet/meta paneli
- En altta **aktivite geçmişi timeline'ı** (kim, ne zaman, eski değer → yeni değer)

**Bizde:** detay sekmeleri PROMPT.md'de modül modül tanımlı (müşteri §8.3 — 15 sekme,
proje §11 — 22 sekme). Ortak `detail` bileşeni sekmeleri config'ten kuracak.

---

## 7. Tespit Edilen Sorunlar (bizde tekrarlanmayacak)

1. **Sayfaya özel CSS şişkinliği** — `crm-gorev.html` içinde 60+ satır `<style>`.
   Ortak bileşene ait olması gereken kurallar sayfaya kaçmış. → Bizde sayfa içi `<style>` yok.
2. **Mobil kart görünümü ikinci kez elle yazılıyor** — tek kaynaktan render edilmeli.
3. **Spacing token'ı yok** — `14px 18px`, `7px 12px` gibi değerler hardcode.
4. **İki ayrı filtre motoru** (`gvFilterPanel` + `gvFilterDrawer`) yan yana duruyor.
5. **`cnt` sayaçları statik beyan edilip sonradan eziliyor** — kod içi yorumlar bu
   çelişkiyi itiraf ediyor. Bizde sayaçlar **tek kaynaktan (mock veri) türetilecek**.
6. **Rol yalnızca `?role=` parametresinden okunuyor** — PROMPT.md §23 bunu açıkça
   sakıncalı buluyor. Bizde rol oturumda (`sessionStorage`) tutulacak, URL yalnızca
   başlangıç seçimi olacak; yetki kontrolü sayfa seviyesinde de çalışacak.
7. **Font Awesome CDN bağımlılığı** — CDN düşerse tüm ikonlar kaybolur. Bizde ikonlar
   inline SVG sprite olarak projede tutulacak (dış bağımlılık yok, offline çalışır).

---

## 8. Sektörel Dönüşüm Tablosu (PROMPT.md §1 → uygulama)

| GaviaCRM (inşaat) | GaviaWorks CRM (yazılım) |
|---|---|
| Şantiye | Proje / müşteri projesi |
| Saha personeli | Yazılım, tasarım, satış, operasyon personeli |
| Saha bildirimi | Hata kaydı, revizyon talebi, destek kaydı |
| Hakediş | Milestone ödemesi / fatura aşaması / ödeme planı |
| Taşeron | Dış kaynak ekip, freelancer, çözüm ortağı |
| Makine ve ekipman | Demirbaş, teknoloji ekipmanı, araç |
| Şantiye raporu | Proje / müşteri / departman raporu |
| İş programı | Proje planı, sprint, milestone, görev takvimi |
| Puantaj | Zaman kaydı (timesheet) |
| İSG tutanağı | — (karşılığı yok, taşınmaz) |
| Kasa / Pluxee / yemekhane | — (taşınmaz; yerine proje bütçe & maliyet) |
| Mizan / cari | Müşteri finansal özeti, tahsilat takibi |

**Taşınmayacak modüller:** şantiye, İSG, puantaj kasası, yemekhane, Pluxee,
kredi kartı harcama, taşeron puantajı, mizan.
**Yeni kurulacak modüller:** müşteri adayı & pipeline, referans/yönlendiren kişi,
ön analiz, teklif, sprint & milestone, departmanlar arası iş talebi, sohbet,
destek & SLA, zaman kaydı, raporlama merkezi.

---

## 9. Referanstan Alınan Kararların Özeti

**Korunacak:** iki katmanlı rail+menü shell'i · rol bazlı `SECTIONS/ROLES` veri modeli ·
liste sayfası dikey sırası · chip sekme şeridi + sayaç · kolon yönetimi + kayıtlı görünüm ·
sağ drawer filtre · KPI kart grid'i · semantik/accent ayrımı · aktivite timeline'ı ·
üçlü ekran kalıbı (liste/detay/form) · çıktı akışı modalı · onay zinciri bileşeni.

**Değiştirilecek:** ikonlar inline SVG · spacing token'lanacak · mobil kart görünümü
ortak bileşenden · tek filtre motoru · sayaçlar mock veriden türetilecek ·
rol oturumdan okunacak · sayfa içi `<style>` yasak.

**Ölçülen mobil davranış:** 390px'de yatay taşma yok (`bodyScrollW == innerW`),
burger + overlay menü, KPI 2 kolon, liste aksiyonları ikon-only, chipbar oklu kaydırma.
Bu davranışlar bizde de hedef.
