# K. Raporlar

> **Bu doküman neyden türetildi?**
> Başlık seti `PROMPT.md` **§26 bölüm K**'den (amaç · kullanıcı · veri kaynakları · filtreler ·
> KPI'lar · grafikler · tablo kolonları · dışa aktarma · yetkilendirme), kapsam `PROMPT.md` **§20
> Raporlama Merkezi**'nden gelir. Rapor tanımlarının **tamamı** çalışan ekranların
> `GV.report({ reports:[{ key, label, group, kpis, charts, table }] })` config'lerinden birebir
> okunmuştur: `app-rapor-musteri.html` · `app-rapor-personel.html` · `app-rapor-gorev.html` ·
> `app-rapor-referans.html` · `app-rapor-filo.html` · `app-rapor-finans.html` ·
> `app-rapor-proje.html`. Katalog karşılaştırması `app-rapor.html` içindeki `CATS` dizisinden,
> bileşen sözleşmesi `tasks/components.md` §5b'den, yetki karşılıkları `assets/js/shell.js`
> (`GV.perm`) ve `assets/data/org.js` (`DB.permMatrix`, `SEC_BY_ROLE`) üzerinden alınmıştır.
> Uydurma rapor eklenmemiştir; ekranda olmayan hiçbir rapor bu belgede yoktur.
>
> **Sayım:** 7 ekran · **103 kurulmuş rapor** (müşteri 14 · personel 13 · görev 19 · referans 10 ·
> filo 19 · finans 16 · **proje 12**). Görev tanımında verilen "proje 8" sayısı ekranla
> uyuşmuyor — ekranda 12 rapor var; 8 rakamı `app-rapor.html` katalogundaki proje girdisidir
> (bkz. §1).

---

## 0. Ortak iskelet — her rapor bunu miras alır

`tasks/components.md` §5b'deki `GV.report(config)` sözleşmesi tüm rapor ekranlarında aynıdır;
her raporda ayrıca yazmamak için burada bir kez tanımlanır.

| Katman | Davranış |
|---|---|
| **Yerleşim** | Sol rapor listesi `.gv-rp-nav` (gruplanmış), içerik `.gv-rp-body`. ≤980px'de sol liste yatay kaydırmalı şeride döner. |
| **Filtre şeridi** | `.rp-filters` + `.rp-acts`: **Filtreleri temizle · Kayıtlı raporlar · Raporu kaydet**. Filtreler ekran genelindedir, rapor başına değişmez. |
| **KPI** | `kpis:[{label,icon,tone,format,calc(rows,f),meta,metaTone}]` → `.kpi-grid > .kpi-card`. Her raporda **4 KPI** kartı vardır (istisnasız). |
| **Grafik** | `charts:function(rows,f)` → `.gv-charts > .gv-chartcard`. Motorlar: `GV.chart.bar` · `GV.chart.donut` · `GV.chart.line` · `GV.chart.legend`. `wide:true` kartı tam genişliğe alır. |
| **Detay tablo** | `table:` = `GV.list` config'i (mount/id/source/urlSync hariç). Arama, sekme, kolon yönetimi, sıralama, sayfalama, boş durum, mobil kart satırı oradan gelir. `archive:false`, sayfa boyu 10 (bazı kayıt raporlarında 15). |
| **Dışa aktarma** | `GV.list` çıktı bileşeni: **Excel (xlsx) · CSV · PDF · Yazdır**, kapsam seçimli (tümü / filtreli / seçili). Her raporun kendi `exportName` (dosya adı) ve `exportTitle` (çıktı başlığı) değeri vardır. |
| **Kayıtlı rapor** | `localStorage` → `gv.rp.<ekran-id>`; kayıt hem seçili raporu hem filtre değerlerini saklar, `app-rapor.html` merkezinden geri açılabilir. |
| **URL senkronu** | `?r=<rapor-key>&rf_<filtre>=<değer>` — rapor + filtre paylaşılabilir. |
| **Referans tarih** | Tüm gün/gecikme hesapları `DB.today` (2026-08-03) üzerinden; `new Date()` kullanılmaz. |

### 0.1. Yetki kısaltmaları

`GV.perm.can(...)` çağrılarının `DB.permMatrix` + `SEC_BY_ROLE` üzerinden çözülmüş rol karşılıkları:

| Kısaltma | Yetki anahtarı | Erişebilen roller |
|---|---|---|
| **R‑MÜŞ** | `musteriRapor` = `rapor≠yok` **ve** `musteri` bölümü | Şirket Sahibi · Genel Müdür · Sistem Yöneticisi · Operasyon Yöneticisi · Satış Yöneticisi · Satış Temsilcisi · Müşteri Temsilcisi · İş Analisti · Proje Yöneticisi · Teknik Destek · Muhasebe |
| **R‑PER** | `personelRapor` = `rapor≠yok` **ve** `personel≠yok` **ve** `personel` bölümü | Şirket Sahibi · Genel Müdür · Sistem Yöneticisi · Operasyon Yöneticisi · Departman Yöneticisi · Proje Yöneticisi · Takım Lideri · İnsan Kaynakları |
| **R‑FİN** | `finans` | Şirket Sahibi · Genel Müdür · Sistem Yöneticisi · Operasyon Yöneticisi · Satış Yöneticisi · Proje Yöneticisi · Muhasebe · Satın Alma Sorumlusu |
| **R‑MAAŞ** | `maas` | Şirket Sahibi · Genel Müdür · İnsan Kaynakları · Muhasebe |
| **R‑ÇIKTI** | `disaAktar` | Şirket Sahibi · Genel Müdür · Sistem Yöneticisi · Operasyon Yöneticisi · Departman Yöneticisi · Satış Yöneticisi · Satış Temsilcisi · İş Analisti · Proje Yöneticisi · Takım Lideri · İK · Muhasebe · Satın Alma · İdari İşler |
| **R‑RAPOR** | `rapor` bölümü menüde | Yukarıdakilerin birleşimi; Freelancer · Dış Kaynak · Stajyer · Müşteri Kullanıcısı **hariç** |

Ekran düzeyinde iki farklı yetki davranışı vardır:

1. **Kapı (gate)** — yetki yoksa ekranın tamamı `GV.empty({icon:'i-lock'})` kilit ekranıyla
   değiştirilir, hiçbir rapor basılmaz. Uygulayan ekranlar: personel (`personelRapor`),
   referans (`musteriRapor`), finans (`finans`).
2. **Maskeleme** — ekran açılır, yalnız para/ücret hücreleri `••••••` (`.cell-mask`) basılır.
   Uygulayan ekranlar: müşteri (`finans`), personel (`maas` + `finans`), referans (`finans`),
   filo (`finans`), proje (`finans`).

Ayrıca personel ve proje ekranları `GV.perm.scope('gor')` kapsamını uygular
(`tum | departman | proje | kendi`): personelde görülebilir personel listesi, projede görülebilir
proje listesi daraltılır — rapor satırları bu daraltılmış evren üzerinden üretilir.

### 0.2. Dışa aktarma yetkisi — dürüst not

`export:canExp` (yani `disaAktar` yetkisine bağlama) yalnız **müşteri** ve **finans** ekranlarında
uygulanmıştır. Personel, görev, referans, filo ve proje ekranlarında `export` bayrağı hiç
verilmediği için `GV.list` varsayılanı geçerlidir ve çıktı butonu `disaAktar` yetkisi olmayan
rollere de görünür. **Bu bir açıktır**; aşağıda ilgili raporların "Dışa aktarma" satırında
tek tek işaretlenmiştir.

---

## 1. Katalog ile kurulmuş ekranların farkı

`app-rapor.html` bir **rapor merkezi**dir: 7 kategori kartı, her kartta o kategorinin rapor
çipleri, arama, kayıtlı raporlar ve rol bazlı kilit rozetleri. Kataloğun `CATS` dizisinde
**99 rapor girdisi** vardır (sayfa başlığı bu toplamı yazar). Bunun **91'i** PROMPT.md §20'nin
altı rapor ailesinin tam listesidir; kalan **8'i** §20'de olmayan "Proje Raporları" başlığıdır.

| Kategori | Katalog girdisi | Kurulmuş ekran | Çip derin bağ (`deep`) | Durum |
|---|---|---|---|---|
| Müşteri Raporları | 14 | 14 | ✅ `?r=<key>` | Birebir — key ve etiket aynı |
| Personel Raporları | 13 | 13 | ✅ | Birebir |
| Görev Raporları | 19 | 19 | ✅ | Birebir |
| Referans Raporları | 10 | 10 | ✅ | Birebir |
| Filo Raporları | 19 | 19 | ✅ | Birebir |
| Satış ve Finans Raporları | 16 | 16 | ❌ `deep:false` | **Etiketler aynı, key'ler farklı** |
| Proje Raporları | 8 | **12** | ❌ `deep:false` | **Katalog listesi ekranla hiç örtüşmüyor** |
| **Toplam** | **99** | **103** | | |

**Katalogda olup ekranı olmayan rapor yoktur** — yedi kategorinin yedisinin de ekranı kuruludur.
Fark iki noktada, ikisi de bağlantı/eşleşme hatası:

**(a) Finans — 16/16 etiket eşleşiyor, 9 key tutmuyor.** Katalog `deep:false` olduğu için çip
zaten kategori sayfasına gidiyor ve hata görünmüyor; `deep:true` yapıldığı anda dokuz çip
"rapor bulunamadı"ya düşer.

| Katalog key | Ekran key | Etiket |
|---|---|---|
| `leadKaynak` | `leadkaynak` | Lead kaynakları |
| `teklifBasari` | `teklif` | Teklif başarı oranı |
| `satisSuresi` | `satissure` | Ortalama satış süresi |
| `tahminGelir` | `tahminigelir` | Tahmini satış geliri |
| `butce` | `projebutce` | Proje bütçeleri |
| `maliyet` | `projemaliyet` | Proje maliyetleri |
| `musteriKar` | `musterikar` | Müşteri kârlılığı |
| `hizmetKar` | `hizmetkar` | Hizmet kârlılığı |
| `aylikGelir` | `aylikgelir` | Aylık gelir tahmini |
| Eşleşenler | `donusum` · `kazanilan` · `kaybedilen` · `temsilci` · `tahsilat` · `geciken` · `nakit` | 7 rapor |

**(b) Proje — katalogdaki 8 girdinin hiçbiri ekranda bu adla yok.** Ekran 12 rapor kurmuş;
katalog hâlâ eski, ekran öncesi taslak listeyi taşıyor.

| Katalogdaki girdi (ekran karşılığı yok) | Ekrandaki gerçek rapor (katalogda yok) |
|---|---|
| `genel` Proje genel raporu | `saglik` Proje sağlığı |
| `durum` Proje durum raporu | `ilerleme` Proje ilerlemesi |
| `sprint` Sprint raporu | `modul` Modül ilerlemesi |
| `milestone` Milestone ve teslim raporu | `butce` Bütçe sapması |
| `butce` Proje bütçe ve maliyet raporu | `sure` Süre ve termin sapması |
| `kaynak` Kaynak kullanım raporu | `milestone` Milestone durumu |
| `gecikme` Geciken projeler raporu | `sprint` Sprint hızı (velocity) |
| `risk` Proje risk ve engel raporu | `test` Test sonuçları |
| | `hata` Hata durumu |
| | `teslim` Teslim performansı |
| | `degisiklik` Değişiklik talepleri |
| | `kaynak` Kaynak ve iş yükü |

Katalog `butce`, `sprint`, `milestone`, `kaynak` key'lerinde tesadüfen çakışıyor ama etiketler
farklı kapsamı anlatıyor (ör. katalog "Milestone ve teslim raporu" derken ekranda milestone ve
teslim **iki ayrı** rapordur).

**Yapılacak:** `app-rapor.html` içindeki `CATS` dizisinin finans ve proje bölümleri ekran
config'lerinden yeniden üretilmeli, ikisi de `deep:true` yapılmalı; toplam katalog sayısı
99 → 103 olur.

---

## 2. Müşteri Raporları — `app-rapor-musteri.html`

| | |
|---|---|
| **Ekran id** | `rapormusteri` · başlık "Müşteri Raporları" · 14 rapor |
| **Yetki kapısı** | Yok. Ekran R‑MÜŞ menüsünden açılır; para alanları `finans` ile maskelenir. |
| **Ortak filtreler (F‑MÜŞ)** | `tarih` Başlangıç tarihi (date) · `musteri` Müşteri (`DB.customers`) · `proje` Proje (`DB.projects`) · `durum` Müşteri durumu · `sorumlu` Sorumlu |
| **Veri dosyaları** | `org.js` · `crm.js` · `work.js` · `ops.js` · `hr.js` · `misc.js` |
| **Çıktı yetkisi** | `export:canExp` → tüm 14 raporda **`disaAktar` yetkisine bağlı** ✅ |

**M‑01 · Müşteri genel raporu** (`genel` · grup **Genel**)
- **Amaç** — Her müşteri için sözleşme, fatura, tahsilat, bekleyen tahsilat, maliyet, kârlılık, proje, görev, destek, revizyon, son iletişim, sonraki aksiyon, memnuniyet ve risk göstergelerini tek tabloda toplamak (PROMPT §20.1 zorunlu alan listesinin tamamı).
- **Kullanıcı** — R‑MÜŞ; para sütunları yalnız R‑FİN'e açık.
- **Veri kaynakları** — `DB.customers` → `custRow()` (proje, fatura, tahsilat, görev, destek, revizyon türetmeleri).
- **Filtreler** — F‑MÜŞ.
- **KPI** — Müşteri · Aktif müşteri · Toplam sözleşme · Bekleyen tahsilat.
- **Grafikler** — Fatura ve tahsilat karşılaştırması (bar, geniş) · Müşteri başına açık iş (bar, geniş) · Risk seviyesi dağılımı (donut).
- **Tablo kolonları** — Müşteri · Aktif projeler · Geciken projeler · Açık görevler · Destek talepleri · Revizyonlar · Son iletişim · Sonraki aksiyon · Memnuniyet · Risk seviyesi (+ gizli para kolonları).
- **Dışa aktarma** — `musteri-genel-rapor` / "Müşteri Genel Raporu" · xlsx · csv · pdf · yazdır.
- **Yetkilendirme** — R‑MÜŞ görür; `finans` yoksa tutarlar `••••••`; çıktı `disaAktar`.

**M‑02 · İletişim raporu** (`iletisim` · grup **Müşteri İlişkileri**)
- **Amaç** — Müşteri etkileşimlerinin kanal, kişi ve zaman dağılımı; planlanmış toplantılarla birlikte iletişim sıklığı.
- **Kullanıcı** — R‑MÜŞ (satış ve müşteri temsilcisi birincil).
- **Veri kaynakları** — `DB.interactions` + `DB.meetings` + `DB.empName`.
- **Filtreler** — F‑MÜŞ.
- **KPI** — Etkileşim · Görüşülen müşteri · Toplantı · Planlı toplantı.
- **Grafikler** — Aylık etkileşim sayısı (line, geniş) · Kanal dağılımı (donut).
- **Tablo kolonları** — Konu · Kanal · Tarih · Görüşen · Muhatap · Sonuç. **Sekmeler:** Tümü · Toplantı · Telefon · E‑posta.
- **Dışa aktarma** — `musteri-iletisim-rapor` · xlsx/csv/pdf/yazdır · `disaAktar`.
- **Yetkilendirme** — R‑MÜŞ.

**M‑03 · Memnuniyet raporu** (`memnuniyet` · grup **Müşteri İlişkileri**)
- **Amaç** — Müşteri memnuniyet puanı, destek talebi puan ortalaması ve memnuniyeti aşağı çeken sinyaller (revizyon, geciken proje, açık destek).
- **Kullanıcı** — R‑MÜŞ.
- **Veri kaynakları** — `DB.customers` (memnuniyet puanı olanlar).
- **Filtreler** — F‑MÜŞ.
- **KPI** — Ortalama memnuniyet · 4 ve üzeri · 3 altı müşteri · Destek puan ortalaması.
- **Grafikler** — Müşteri memnuniyet puanı (bar, geniş) · Memnuniyet segmentleri (donut).
- **Tablo kolonları** — Müşteri · Memnuniyet · Destek puanı · Destek talebi · Revizyon · Geciken proje · Son iletişim · Risk · Sorumlu.
- **Dışa aktarma** — `musteri-memnuniyet-rapor` · `disaAktar`.
- **Yetkilendirme** — R‑MÜŞ.

**M‑04 · Risk raporu** (`risk` · grup **Müşteri İlişkileri**)
- **Amaç** — Tahsilat gecikmesi, düşük memnuniyet, geciken proje, açık kritik destek ve iletişimsizlik sinyallerinden türetilen müşteri risk skoru.
- **Kullanıcı** — R‑MÜŞ; müşteri sorumlusu ve satış yönetimi.
- **Veri kaynakları** — `DB.customers` + türetilmiş sinyal listesi.
- **Filtreler** — F‑MÜŞ.
- **KPI** — Yüksek riskli müşteri · Gecikmiş tahsilatı olan · Memnuniyeti 3 altı · Geciken projesi olan.
- **Grafikler** — Müşteri risk skoru (bar, geniş) · Risk seviyesi dağılımı (donut).
- **Tablo kolonları** — Müşteri · Risk seviyesi · Risk skoru · Memnuniyet · Geciken proje · Açık destek · Sinyaller · Son iletişim · Sorumlu. **Sekmeler:** Tümü · Skor 3+ · Tahsilat riski · Sinyalsiz.
- **Dışa aktarma** — `musteri-risk-rapor` · `disaAktar`.
- **Yetkilendirme** — R‑MÜŞ.

**M‑05 · Teklif raporu** (`teklif` · grup **Satış ve Fırsat**)
- **Amaç** — Teklif tutarı, indirim, versiyon, iç ve müşteri onay durumu ile kazanma oranı.
- **Kullanıcı** — R‑MÜŞ; tutarlar için R‑FİN.
- **Veri kaynakları** — `DB.quotes` + `DB.empName`.
- **Filtreler** — F‑MÜŞ.
- **KPI** — Teklif · Toplam teklif tutarı · Kazanma oranı · Ortalama teklif.
- **Grafikler** — Teklif tutarları (bar, geniş) · Teklif kalem sayısı (bar, geniş) · Teklif durumu dağılımı (donut).
- **Tablo kolonları** — Teklif · Tarih · Geçerlilik · Versiyon · Kalem · İç onay · Müşteri onayı · Durum · Hazırlayan. **Sekmeler:** Tümü · Açık teklifler · Kazanılan · Kaybedilen.
- **Dışa aktarma** — `musteri-teklif-rapor` · `disaAktar`.
- **Yetkilendirme** — R‑MÜŞ + tutar maskeleme.

**M‑06 · Satış dönüşüm raporu** (`donusum` · grup **Satış ve Fırsat**)
- **Amaç** — Müşteri adaylarının aşama dağılımı, kaynak bazlı dönüşüm ve kazanma / kaybetme oranı.
- **Kullanıcı** — R‑MÜŞ; satış yönetimi.
- **Veri kaynakları** — `DB.leads` + `DB.pipelineStages` + `DB.empName`.
- **Filtreler** — F‑MÜŞ.
- **KPI** — Fırsat · Kazanıldı · Kaybedildi · Dönüşüm oranı.
- **Grafikler** — Aşama dağılımı (bar, geniş) · Kaynak dağılımı (donut).
- **Tablo kolonları** — Fırsat · Aşama · Skor · Sıcaklık · Kaynak · Talep · Kapanış tahmini · Müşteri · Kayıp nedeni · Sorumlu.
- **Dışa aktarma** — `musteri-donusum-rapor` · `disaAktar`.
- **Yetkilendirme** — R‑MÜŞ.

**M‑07 · Çapraz satış fırsatları** (`capraz` · grup **Satış ve Fırsat**)
- **Amaç** — Müşterinin bugüne kadar aldığı hizmetlerden yola çıkarak önerilebilecek hizmetler; bakım paketi olmayan ve tek hizmet alan müşteriler.
- **Kullanıcı** — R‑MÜŞ; satış.
- **Veri kaynakları** — `DB.customers` + `DB.projects` + `DB.supportPackages`.
- **Filtreler** — F‑MÜŞ (pasif müşteri hariç tutulur).
- **KPI** — Fırsat çıkan müşteri · Toplam öneri · Bakım paketi olmayan · Tek hizmet alan.
- **Grafikler** — Müşteri başına çapraz satış fırsatı (bar, geniş) · Önerilen hizmet dağılımı (donut).
- **Tablo kolonları** — Müşteri · Alınan hizmetler · Önerilen hizmetler · Fırsat · Bakım paketi · Memnuniyet · Son iletişim · Sorumlu.
- **Dışa aktarma** — `musteri-capraz-satis` · `disaAktar`.
- **Yetkilendirme** — R‑MÜŞ.

**M‑08 · Yenileme fırsatları** (`yenileme` · grup **Satış ve Fırsat**)
- **Amaç** — Bitiş veya yenileme tarihi yaklaşan sözleşmeler; kalan gün, bedel (KDV hariç) ve otomatik yenileme durumu.
- **Kullanıcı** — R‑MÜŞ; sözleşme bedeli için R‑FİN.
- **Veri kaynakları** — `DB.contracts` + `DB.supportPackages` (KPI).
- **Filtreler** — F‑MÜŞ.
- **KPI** — Sözleşme · 90 gün içinde · Yenileme bedeli (KDV hariç) · Aktif bakım paketi.
- **Grafikler** — Yenilemeye kalan gün (bar, geniş) · Yenileme kaydı (donut).
- **Tablo kolonları** — Sözleşme · Bitiş · Yenileme tarihi · Kalan gün · Yenileme · Durum · Ödeme planı. **Sekmeler:** Tümü · 90 gün içinde · Süresi geçmiş.
- **Dışa aktarma** — `musteri-yenileme-firsatlari` · `disaAktar`.
- **Yetkilendirme** — R‑MÜŞ + bedel maskeleme.

**M‑09 · Proje raporu** (`proje` · grup **Teslim ve Destek**)
- **Amaç** — Müşteri bazlı proje durumu, sağlık göstergesi, ilerleme, bütçe–maliyet dengesi ve gecikme nedenleri.
- **Kullanıcı** — R‑MÜŞ + proje yönetimi.
- **Veri kaynakları** — `DB.projects` + `DB.empName`.
- **Filtreler** — F‑MÜŞ.
- **KPI** — Proje · Devam eden · Geciken · Ortalama ilerleme.
- **Grafikler** — Sözleşme bedeli ve gerçekleşen maliyet (bar, geniş) · Proje ilerlemesi (bar, geniş) · Proje durumu dağılımı (donut).
- **Tablo kolonları** — Proje · Durum · Sağlık · İlerleme · Başlangıç · Planlanan bitiş · Proje yöneticisi · Gecikme nedeni. **Sekmeler:** Tümü · Devam eden · Geciken · Sağlık riskli.
- **Dışa aktarma** — `musteri-proje-rapor` · `disaAktar`.
- **Yetkilendirme** — R‑MÜŞ + bütçe/maliyet maskeleme.

**M‑10 · Destek raporu** (`destek` · grup **Teslim ve Destek**)
- **Amaç** — Destek talebi hacmi, kategori dağılımı, SLA uyumu, ilk yanıt süresi ve talep memnuniyeti.
- **Kullanıcı** — R‑MÜŞ; destek ekibi ve müşteri temsilcisi.
- **Veri kaynakları** — `DB.tickets` + `DB.empName`.
- **Filtreler** — F‑MÜŞ.
- **KPI** — Destek talebi · Açık talep · SLA riski · Ortalama ilk yanıt.
- **Grafikler** — Müşteri başına destek talebi (bar, geniş) · Kategori dağılımı (donut).
- **Tablo kolonları** — Talep · Kategori · Öncelik · Durum · SLA · SLA durumu · Açılış · İlk yanıt · Harcanan · Memnuniyet · Sorumlu. **Sekmeler:** Tümü · Açık · SLA riski · Kapanan.
- **Dışa aktarma** — `musteri-destek-rapor` · `disaAktar`.
- **Yetkilendirme** — R‑MÜŞ.

**M‑11 · Finans raporu** (`finans` · grup **Finans**)
- **Amaç** — Fatura hacmi, vade durumu, tahsil edilen ve açık bakiye; müşteri bazlı fatura–tahsilat karşılaştırması.
- **Kullanıcı** — R‑FİN (muhasebe birincil), R‑MÜŞ maskeli görür.
- **Veri kaynakları** — `DB.invoices`.
- **Filtreler** — F‑MÜŞ.
- **KPI** — Fatura · Toplam fatura · Tahsil edilen · Açık bakiye.
- **Grafikler** — Aylık fatura ve tahsilat (line, geniş) · Aylık fatura adedi (line, geniş) · Fatura durumu dağılımı (donut).
- **Tablo kolonları** — Fatura · Proje · Tarih · Vade · Gecikme · Durum · Ödeme tarihi. **Sekmeler:** Tümü · Açık · Geciken · Ödenen.
- **Dışa aktarma** — `musteri-finans-rapor` · `disaAktar`.
- **Yetkilendirme** — Tutarlar `finans` yetkisiyle açılır; yoksa `••••••`.

**M‑12 · Tahsilat raporu** (`tahsilat` · grup **Finans**)
- **Amaç** — Vade takibi, gecikme günü, son aksiyon ve tahsilat sorumlusu bazlı gecikme dağılımı.
- **Kullanıcı** — R‑FİN + müşteri sorumlusu.
- **Veri kaynakları** — `DB.payments` + `DB.empName`.
- **Filtreler** — F‑MÜŞ.
- **KPI** — Tahsilat kaydı · Gecikmiş tutar · Bekleyen tutar · En uzun gecikme.
- **Grafikler** — Gecikme günü (bar, geniş) · Tahsilat durumu (donut).
- **Tablo kolonları** — Tahsilat · Vade · Gecikme · Durum · Son aksiyon · Sorumlu. **Sekmeler:** Tümü · Geciken · Bekleyen · Tahsil edilen.
- **Dışa aktarma** — `musteri-tahsilat-rapor` · `disaAktar`.
- **Yetkilendirme** — Tutar maskeleme `finans`.

**M‑13 · Kârlılık raporu** (`karlilik` · grup **Finans**)
- **Amaç** — Proje geliri ile gerçekleşen maliyet farkından türeyen müşteri kârlılığı, marj yüzdesi ve efor sapması.
- **Kullanıcı** — R‑FİN; yönetim.
- **Veri kaynakları** — `DB.customers` → `custRow()` (geliri veya maliyeti olanlar).
- **Filtreler** — F‑MÜŞ.
- **KPI** — Proje geliri · Toplam maliyet · Kâr · Ortalama marj.
- **Grafikler** — Gelir ve maliyet (bar, geniş) · Efor sapması (bar, geniş) · Kâr marjı (bar).
- **Tablo kolonları** — Müşteri · Proje · Marj · Harcanan saat · Efor sapması · Memnuniyet · Risk.
- **Dışa aktarma** — `musteri-karlilik-rapor` · `disaAktar`.
- **Yetkilendirme** — `finans` olmadan tüm para sütunları maskeli.

**M‑14 · Müşteri yaşam boyu değeri** (`ltv` · grup **Finans**)
- **Amaç** — Müşterinin ilk kaydından bugüne toplam cirosu, müşteri yaşı ve aylık ortalama değeri.
- **Kullanıcı** — R‑FİN; yönetim ve satış stratejisi.
- **Veri kaynakları** — `DB.customers` → `custRow()` + `DB.today` ile yaş hesabı.
- **Filtreler** — F‑MÜŞ.
- **KPI** — Toplam yaşam boyu değer · Ortalama değer · Ortalama müşteri yaşı · 1M+ değerli müşteri.
- **Grafikler** — Müşteri yaşam boyu değeri (bar, geniş) · Müşteri yaşı (bar, geniş) · Değer segmentleri (donut).
- **Tablo kolonları** — Müşteri · Segment · İlk kayıt · Müşteri yaşı · Proje · Memnuniyet · Durum · Risk.
- **Dışa aktarma** — `musteri-yasam-boyu-deger` · `disaAktar`.
- **Yetkilendirme** — Bu rapor `canFin` bağımlılığını en yoğun kullanan rapordur; `finans` yoksa değer eksenleri tamamen maskelenir.

---

## 3. Personel Raporları — `app-rapor-personel.html`

| | |
|---|---|
| **Ekran id** | `raporpersonel` · 13 rapor |
| **Yetki kapısı** | ✅ `GV.perm.can('personelRapor')` — yoksa kilit ekranı, hiçbir rapor basılmaz. |
| **Ek maskeleme** | `maas` → ücret sütunları; `finans` → demirbaş değeri, eğitim maliyeti, yakıt/ceza tutarı. |
| **Kapsam** | `GV.perm.scope('gor')`: `kendi` → yalnız kullanıcı, `departman` → kendi departmanı, `tum`/`proje` → tümü. Personel ve departman filtre seçenekleri de bu kapsamla daralır. |
| **Ortak filtreler (F‑PER)** | `tarih` Başlangıç tarihi · `dep` Departman · `personel` Personel · `proje` Proje · `durum` Durum |
| **Veri dosyaları** | `org.js` · `crm.js` · `work.js` · `hr.js` · `ops.js` · `misc.js` |
| **Çıktı yetkisi** | ⚠️ `export` bayrağı verilmemiş — çıktı butonu `disaAktar` yetkisinden bağımsız görünür. |

**P‑01 · Personel genel raporu** (`genel` · grup **Genel**)
- **Amaç** — Kadro, görev yükü, çalışılan saat, kapasite kullanımı, proje sayısı ve izin bakiyesini tek tabloda toplamak.
- **Kullanıcı** — R‑PER; ücret sütunu yalnız R‑MAAŞ.
- **Veri kaynakları** — `DB.employees` (kapsam filtreli `EMPS`) + `DB.tasks` · `DB.timelogs` · `DB.capacity` · `DB.leaves` · `DB.trainings` türetmeleri.
- **Filtreler** — F‑PER.
- **KPI** — Personel · Açık görev · Geciken görev · Ortalama doluluk.
- **Grafikler** — Kişi bazlı kapasite kullanımı (bar, geniş) · Departman dağılımı (donut).
- **Tablo kolonları** — Personel · Departman · Rol · Giriş · Açık görev · Geciken · Tamamlanan · Zamanında · Çalışılan · Proje · Doluluk · İzin bakiye · Eğitim · **Ücret** · Durum.
- **Dışa aktarma** — `personel-genel-rapor` · xlsx/csv/pdf/yazdır ⚠️ yetki bağı yok.
- **Yetkilendirme** — `personelRapor` kapısı + `maas` maskesi (Ücret sütunu `••••••`).

**P‑02 · Görev raporu** (`gorev` · grup **Görev ve Katkı**)
- **Amaç** — Sorumlusu personel olan görevlerin durum, öncelik, termin ve süre kırılımı.
- **Kullanıcı** — R‑PER; departman yöneticisi ve takım lideri birincil.
- **Veri kaynakları** — `DB.tasks` (sorumlu kapsam filtreli).
- **Filtreler** — F‑PER.
- **KPI** — Görev · Açık · Geciken · Zamanında tamamlama.
- **Grafikler** — Kişi bazlı görev ve gecikme (bar, geniş) · Durum dağılımı (donut).
- **Tablo kolonları** — Görev · Sorumlu · Proje · Tür · Öncelik · Termin · Tahmini · Gerçek · Süre sapması · Revizyon · İlerleme · Durum.
- **Dışa aktarma** — `personel-gorev-rapor` ⚠️.
- **Yetkilendirme** — `personelRapor` kapısı + `gor` kapsamı.

**P‑03 · İş yükü raporu** (`isyuku` · grup **Görev ve Katkı**)
- **Amaç** — Kişi başına düşen açık görev, kalan tahmini efor ve haftalık kapasite karşılaştırması.
- **Kullanıcı** — R‑PER; kaynak planlaması yapan yönetici.
- **Veri kaynakları** — `EMPS` + `DB.tasks` (kalan efor) + `DB.capacity`.
- **Filtreler** — F‑PER.
- **KPI** — Açık görev · Kalan efor · Aşırı yüklü kişi · Müsait kapasite.
- **Grafikler** — Kalan efor ve müsait kapasite (bar, geniş) · Doluluk bandı (donut).
- **Tablo kolonları** — Personel · Departman · Açık görev · Kritik/Yüksek · Geciken · Engellenen · Kalan efor · Kapasite · Planlanan · Müsait · Doluluk.
- **Dışa aktarma** — `personel-isyuku-rapor` ⚠️.
- **Yetkilendirme** — `personelRapor` kapısı.

**P‑04 · Proje katkı raporu** (`katki` · grup **Görev ve Katkı**)
- **Amaç** — Personel × proje kırılımında görev sayısı, tamamlama oranı, harcanan ve faturalanabilir saat.
- **Kullanıcı** — R‑PER + proje yöneticisi.
- **Veri kaynakları** — `katkiSatirlari()` = `DB.tasks` + `DB.timelogs` + `DB.projects` birleşimi.
- **Filtreler** — F‑PER.
- **KPI** — Katkı kaydı · Toplam efor · Faturalanabilir · Görev.
- **Grafikler** — Proje bazlı efor (bar, geniş) · Kişi bazlı efor payı (donut).
- **Tablo kolonları** — Personel · Proje · Projedeki rol · Görev · Tamamlanan · Tamamlama · Harcanan · Faturalanabilir · Departman · Proje durumu.
- **Dışa aktarma** — `personel-projekatki-rapor` ⚠️.
- **Yetkilendirme** — `personelRapor` kapısı.

**P‑05 · Zaman raporu** (`zaman` · grup **Zaman ve Kapasite**)
- **Amaç** — Girilen zaman kayıtlarının kişi, gün, proje ve faturalanabilirlik kırılımı; onay durumu kayıt bazında.
- **Kullanıcı** — R‑PER; PM ve muhasebe (faturalanabilir saat).
- **Veri kaynakları** — `DB.timelogs`.
- **Filtreler** — F‑PER.
- **KPI** — Zaman kaydı · Toplam saat · Faturalanabilir · Onay bekleyen.
- **Grafikler** — Günlük çalışılan saat (line, geniş) · Kişi bazlı saat (bar).
- **Tablo kolonları** — Tarih · Personel · Görev · Proje · Açıklama · Süre · Faturalanabilir · Onay.
- **Dışa aktarma** — `personel-zaman-rapor` ⚠️.
- **Yetkilendirme** — `personelRapor` kapısı.

**P‑06 · Kapasite raporu** (`kapasite` · grup **Zaman ve Kapasite**)
- **Amaç** — Haftalık kapasite, planlanan efor, izin kaynaklı kayıp ve kalan müsait saat — planlama kararlarının girdisi.
- **Kullanıcı** — R‑PER; operasyon ve PM.
- **Veri kaynakları** — `DB.capacity` + `DB.leaves`.
- **Filtreler** — F‑PER.
- **KPI** — Toplam kapasite · Planlanan · Müsait · Ortalama doluluk.
- **Grafikler** — Planlanan efora karşı kapasite (bar, geniş) · Doluluk bandı (donut).
- **Tablo kolonları** — Personel · Departman · Kapasite · Planlanan · Müsait · İzin · İzin saati · Doluluk · Değerlendirme.
- **Dışa aktarma** — `personel-kapasite-rapor` ⚠️.
- **Yetkilendirme** — `personelRapor` kapısı.

**P‑07 · Fazla mesai raporu** (`mesai` · grup **Zaman ve Kapasite**)
- **Amaç** — Haftalık timesheet kayıtlarında kapasitenin üzerinde geçen saatler; süreklilik gösteren fazla mesainin tespiti.
- **Kullanıcı** — R‑PER + İK.
- **Veri kaynakları** — `DB.timesheets` (`fazla` bayraklı kayıtlar).
- **Filtreler** — F‑PER.
- **KPI** — Fazla mesai kaydı · Toplam fazla saat · Etkilenen personel · Onay bekleyen.
- **Grafikler** — Kişi bazlı fazla mesai (bar, geniş) · Onay durumu (donut).
- **Tablo kolonları** — Timesheet · Personel · Dönem · Toplam · Faturalanabilir · Fazla mesai · Fazla oranı · Onaylayan · Durum.
- **Dışa aktarma** — `personel-fazlamesai-rapor` ⚠️.
- **Yetkilendirme** — `personelRapor` kapısı.

**P‑08 · Eksik çalışma raporu** (`eksik` · grup **Zaman ve Kapasite**)
- **Amaç** — Haftalık kapasitenin altında kalan çalışma saatleri, aynı haftadaki onaylı izinlerle birlikte gösterilerek "açıklanmayan" eksiğin ayrıştırılması.
- **Kullanıcı** — R‑PER + İK.
- **Veri kaynakları** — `DB.timesheets` (`eksik` bayraklı) + `DB.leaves`.
- **Filtreler** — F‑PER.
- **KPI** — Eksik çalışma kaydı · Toplam eksik saat · İzinle açıklanan · Açıklanmayan.
- **Grafikler** — Eksik saat ve izin karşılığı (bar, geniş) · Onay durumu (donut).
- **Tablo kolonları** — Timesheet · Personel · Dönem · Çalışılan · Eksik · İzin saati · Açıklanmayan · Eksik oranı · Onaylayan · Durum.
- **Dışa aktarma** — `personel-eksikcalisma-rapor` ⚠️.
- **Yetkilendirme** — `personelRapor` kapısı.

**P‑09 · Performans raporu** (`performans` · grup **Performans ve Gelişim**)
- **Amaç** — Çok eksenli performans: zamanında teslim, revizyon oranı, kalite sonucu, müşteri geri bildirimi, kapasite kullanımı ve gelişim planı. PROMPT §20.2'nin "yalnız görev adediyle değerlendirilmemelidir" kuralının karşılığı.
- **Kullanıcı** — R‑PER; İK, departman yöneticisi, PM (üç ayrı değerlendirici ekseni).
- **Veri kaynakları** — `DB.performance` (öz / yönetici / PM puanları) + görev, kalite, kapasite türetmeleri.
- **Filtreler** — F‑PER.
- **KPI** — Değerlendirme · Ort. zamanında teslim · Ort. revizyon oranı · Ort. kalite puanı.
- **Grafikler** — Zamanında teslim ve revizyon oranı (bar, geniş) · Değerlendirici ekseni (line, geniş).
- **Tablo kolonları** — Personel · Dönem · Öz · Yönetici · PM · Ortalama · Zamanında · Revizyon · Görev · Kalite · Müşteri · Kapasite · Proje · Eğitim · Ekip · İletişim · Eğitim ihtiyacı · Gelişim planı · Durum (19 kolon).
- **Dışa aktarma** — `personel-performans-rapor` ⚠️.
- **Yetkilendirme** — `personelRapor` kapısı; ekranın en hassas raporu.

**P‑10 · Eğitim raporu** (`egitim` · grup **Performans ve Gelişim**)
- **Amaç** — Katılımcı bazında eğitim programları, süre, sertifika ve kişi başına düşen maliyet.
- **Kullanıcı** — R‑PER + İK; maliyet için R‑FİN.
- **Veri kaynakları** — `egitimSatirlari()` = `DB.trainings` × katılımcı.
- **Filtreler** — F‑PER.
- **KPI** — Katılım kaydı · Toplam saat · Sertifikalı · Toplam maliyet.
- **Grafikler** — Kişi bazlı eğitim saati (bar, geniş) · Eğitim türü dağılımı (donut).
- **Tablo kolonları** — Eğitim · Katılımcı · Tür · Sağlayıcı · Başlangıç · Bitiş · Süre · Kişi maliyeti · Sertifika · Durum.
- **Dışa aktarma** — `personel-egitim-rapor` ⚠️.
- **Yetkilendirme** — `personelRapor` kapısı + `finans` maskesi (kişi maliyeti).

**P‑11 · İzin raporu** (`izin` · grup **Özlük**)
- **Amaç** — İzin talepleri, kullanılan gün, kalan bakiye, vekil ataması ve çakışma durumu.
- **Kullanıcı** — R‑PER + İK.
- **Veri kaynakları** — `DB.leaves`.
- **Filtreler** — F‑PER.
- **KPI** — İzin talebi · Toplam gün · Onay bekleyen · Çakışmalı.
- **Grafikler** — Kişi bazlı izin ve bakiye (bar, geniş) · İzin türü dağılımı (donut).
- **Tablo kolonları** — İzin · Personel · Başlangıç · Bitiş · Gün · Kalan bakiye · Vekil · Gerekçe · Çakışma · Onaylayan · Durum.
- **Dışa aktarma** — `personel-izin-rapor` ⚠️.
- **Yetkilendirme** — `personelRapor` kapısı.

**P‑12 · Zimmet raporu** (`zimmet` · grup **Varlık ve Filo**)
- **Amaç** — Personele teslim edilen demirbaşlar, teslim/iade tarihleri, personel onayı ve hasar kayıtları.
- **Kullanıcı** — R‑PER + İdari İşler; değer sütunu R‑FİN.
- **Veri kaynakları** — `zimmetSatirlari()` = `DB.assignments` + `DB.assets`.
- **Filtreler** — F‑PER.
- **KPI** — Zimmet kaydı · Zimmetli personel · Toplam değer · Onay bekleyen.
- **Grafikler** — Kişi bazlı zimmet değeri (bar, geniş) · Kişi bazlı zimmet adedi (bar, geniş) · Kategori dağılımı (donut).
- **Tablo kolonları** — Zimmet · Personel · Demirbaş · Teslim · İade · Değer · Personel onayı · Hasar · Garanti bitiş · Durum.
- **Dışa aktarma** — `personel-zimmet-rapor` ⚠️.
- **Yetkilendirme** — `personelRapor` kapısı + `finans` maskesi (Değer).

**P‑13 · Araç kullanım raporu** (`arac` · grup **Varlık ve Filo**)
- **Amaç** — Sürücü bazında tahsisli araçlar, yakıt tüketimi, trafik cezaları ve kaza kayıtları.
- **Kullanıcı** — R‑PER + filo sorumlusu; tutarlar R‑FİN.
- **Veri kaynakları** — `surucuSatirlari()` = `DB.vehicles` + `DB.fuelLogs` + `DB.fines` + `DB.accidents`.
- **Filtreler** — F‑PER.
- **KPI** — Sürücü · Toplam litre · Yakıt tutarı · Ceza.
- **Grafikler** — Sürücü bazlı yakıt ve ceza tutarı (bar, geniş) · Sürücü bazlı yakıt tüketimi (bar, geniş) · Yakıt payı (donut).
- **Tablo kolonları** — Sürücü · Departman · Araç · Yakıt kaydı · Litre · Yakıt tutarı · Ort. litre · Ceza · Ceza tutarı · Kaza · Son yakıt · Araç durumu.
- **Dışa aktarma** — `personel-arackullanim-rapor` ⚠️.
- **Yetkilendirme** — `personelRapor` kapısı + `finans` maskesi (tutarlar). Filo ekranındaki F‑13 ile aynı olguyu **personel ekseninden** gösterir; canonical veri aynıdır.

---

## 4. Görev Raporları — `app-rapor-gorev.html`

| | |
|---|---|
| **Ekran id** | `raporgorev` · 19 rapor |
| **Yetki kapısı** | ❌ Yok — ekran `rapor` bölümüne erişimi olan her role açık (R‑RAPOR). Para alanı içermediği için maskeleme de yok. |
| **Ortak filtreler (F‑GÖR)** | `tarih` Tarihten itibaren · `dep` Departman (aktif) · `personel` Personel · `proje` Proje · `musteri` Müşteri · `durum` Durum (`DB.taskStatuses`) |
| **Ortak kaynak** | `base(f)` = `DB.tasks` üzerinde departman/personel(sorumlu·veren·yardımcı)/proje/müşteri/durum/tarih filtresi |
| **Ortak tablo iskeleti** | `tGorev(o)` — arama, `termin` varsayılan sıralama, ortak boş durum, mobil satır |
| **Çıktı yetkisi** | ⚠️ `export` bayrağı verilmemiş — `disaAktar` kontrolü yok. |

> Ortak kolon sözlüğü: `C.*` (görev satırı) ve `A.*` (kırılım satırı) fabrikaları. Aşağıdaki kolon adları bu fabrikalardan çözülmüştür.

**G‑01 · Açık görevler** (`acik` · grup **Durum**) — **Amaç:** Tamamlanmamış, iptal edilmemiş ve arşivlenmemiş tüm görevler; kalan efor ve termin baskısı. **Kullanıcı:** R‑RAPOR (yönetici, takım lideri, sorumlu). **Veri:** `base(f)` → açık durumlar. **Filtreler:** F‑GÖR. **KPI:** Açık görev · Geciken · Bu hafta terminli · Kalan efor. **Grafikler:** Departman bazlı açık görev (bar, geniş) · Durum dağılımı (donut). **Kolonlar:** Görev · Proje / Müşteri · Departman · Sorumlu · Termin · Öncelik · İlerleme · Tahmini / Gerçek · Durum. **Çıktı:** `gorev-rapor-acik` ⚠️. **Yetki:** kapı yok.

**G‑02 · Geciken görevler** (`geciken`) — **Amaç:** Termini geçmiş ve hâlâ açık görevler; gecikme günü ve etkilenen proje kırılımı. **Kullanıcı:** R‑RAPOR. **Veri:** `base(f)` → `geciken()`. **KPI:** Geciken görev · Ortalama gecikme · En uzun gecikme · Kritik öncelikli. **Grafik:** Görev bazlı gecikme (bar, geniş). **Kolonlar:** Görev · Proje / Müşteri · Departman · Sorumlu · Termin · Gecikme · Öncelik · İlerleme · Durum. **Çıktı:** `gorev-rapor-geciken` ⚠️.

**G‑03 · Engellenen görevler** (`engellenen`) — **Amaç:** Durumu "Engellendi" olan görevler; engel nedeni, bekleyen efor ve bloke edilen bağımlı görevler. **Veri:** `base(f)` + `DB.taskDeps`. **KPI:** Engellenen görev · Etkilenen proje · Bloke bağımlı görev · Bekleyen efor. **Grafik:** yok (KPI + tablo). **Kolonlar:** Görev · Engel nedeni · Proje / Müşteri · Sorumlu · Termin · Gecikme · Öncelik · Durum. **Çıktı:** `gorev-rapor-engellenen` ⚠️.

**G‑04 · Atanmamış görevler** (`atanmamis`) — **Amaç:** İş havuzunda bekleyen ya da sorumlusu belirlenmemiş görevler; dağıtılmayı bekleyen efor. **KPI:** Atanmamış görev · Termini geçmiş · Bekleyen efor · Kritik / Yüksek. **Grafik:** yok. **Kolonlar:** Görev · Proje / Müşteri · Departman · Görevi veren · Termin · Öncelik · Tahmini · Durum. **Çıktı:** `gorev-rapor-atanmamis` ⚠️.

**G‑05 · Kabul bekleyen görevler** (`kabul`) — **Amaç:** Atanmış fakat henüz kabul edilmemiş görevler — atama ile başlangıç arasındaki bekleme. **KPI:** Kabul bekleyen · 7 gün içinde terminli · Bekleyen efor · Farklı sorumlu. **Grafik:** yok. **Kolonlar:** Görev · Proje / Müşteri · Departman · Görevi veren · Sorumlu · Termin · Öncelik · Tahmini · Durum. **Çıktı:** `gorev-rapor-kabul` ⚠️.

**G‑06 · Kontrol bekleyen görevler** (`kontrol`) — **Amaç:** Sorumlusu bitirmiş, kontrol edenin incelemesini bekleyen görevler. **Veri:** `base(f)` + `DB.empName`. **KPI:** Kontrol bekleyen · Termini geçmiş · Onay bekleyen · Ortalama ilerleme. **Grafik:** Kontrol eden bazlı kuyruk (bar, geniş). **Kolonlar:** Görev · Proje / Müşteri · Sorumlu · Kontrol eden · Termin · Gecikme · İlerleme · Teslim edilen çıktı · Durum. **Çıktı:** `gorev-rapor-kontrol` ⚠️.

**G‑07 · Revizedeki görevler** (`revize`) — **Amaç:** Kontrolden dönmüş, revize bekleyen ya da revizede olan görevler; revizyon turu ve ek efor. **KPI:** Revizedeki görev · Toplam revizyon turu · En çok revizyon · Revizyondan gelen ek efor. **Grafikler:** Görev bazlı revizyon turu (bar, geniş) · Müşteri kırılımı (donut). **Kolonlar:** Görev · Revize notu · Proje / Müşteri · Sorumlu · Revizyon turu · Termin · Gecikme · Sapma · Durum. **Çıktı:** `gorev-rapor-revize` ⚠️.

**G‑08 · Tamamlanan görevler** (`tamamlanan`) — **Amaç:** Tamamlanma tarihi girilmiş görevler; zamanında kapanma, gerçekleşen efor ve teslim edilen çıktı. **KPI:** Tamamlanan görev · Zamanında kapanan · Zamanında oranı · Gerçekleşen efor. **Grafik:** yok. **Kolonlar:** Görev · Proje / Müşteri · Sorumlu · Termin · Tamamlanma · Termin aşımı · Tahmini / Gerçek · Sapma · Revizyon turu · Teslim edilen çıktı · Durum. **Çıktı:** `gorev-rapor-tamamlanan` ⚠️.

**G‑09 · Departman bazlı görevler** (`departman` · grup **Dağılım**) — **Amaç:** Her departmanın görev yükü, gecikmesi, efor sapması ve zamanında tamamlama oranı. **Veri:** `grupla(base(f), t.dep, DB.depName)`. **KPI:** Departman · Toplam görev · En yüklü departman · Geciken görev. **Grafikler:** Departman bazlı toplam görev (bar, geniş) · Açık görev dağılımı (donut). **Kolonlar:** Departman · Toplam görev · Açık · Geciken · Tamamlanan · Tahmini / Gerçek · Sapma · Revizyon turu · Zamanında %. **Çıktı:** `gorev-rapor-departman` ⚠️.

**G‑10 · Proje bazlı görevler** (`projeBazli`) — **Amaç:** Proje başına görev yükü, gecikme, efor sapması ve zamanında tamamlama oranı; iç işler ayrı satırda. **Veri:** `grupla(..., t.proje || 'İç iş')`. **KPI:** Proje · Toplam görev · Açık görev · Efor sapması. **Grafikler:** Proje bazlı görev adedi (bar, geniş) · Proje bazlı tahmini ve gerçekleşen süre (bar, geniş). **Kolonlar:** Proje · Proje durumu · Toplam görev · Açık · Geciken · Tamamlanan · Tahmini / Gerçek · Sapma · Zamanında %. **Çıktı:** `gorev-rapor-proje` ⚠️.

**G‑11 · Müşteri bazlı görevler** (`musteriBazli`) — **Amaç:** Müşteri başına görev yükü, revizyon turu ve termin performansı; müşteri bağı olmayan işler "İç iş" satırında. **KPI:** Müşteri · Müşteri görevi · Açık görev · Geciken görev. **Grafikler:** Müşteri bazlı görev adedi (bar, geniş) · Açık görev dağılımı (donut). **Kolonlar:** Müşteri · Toplam görev · Açık · Geciken · Tamamlanan · Revizyon turu · Tahmini / Gerçek · Zamanında %. **Çıktı:** `gorev-rapor-musteri` ⚠️.

**G‑12 · Tahmini ve gerçekleşen süre** (`sure` · grup **Verimlilik**) — **Amaç:** Görev bazında tahmin doğruluğu: planlanan efor, harcanan efor, sapma ve faturalanabilir süre. **KPI:** Tahmini efor · Gerçekleşen efor · Sapma · Faturalanabilir. **Grafik:** Departman bazlı efor (bar, geniş). **Sekmeler:** Tüm görevler · Tahmini aşanlar · Kapanmış görevler. **Kolonlar:** Görev · Proje / Müşteri · Departman · Sorumlu · Tahmini · Gerçekleşen · Sapma · Faturalanabilir · İlerleme · Durum. **Çıktı:** `gorev-rapor-sure` ⚠️.

**G‑13 · Zamanında tamamlama oranı** (`zamaninda`) — **Amaç:** Termin sonucu belli olan görevler üzerinden oran; tablo oranı düşüren görevleri gösterir. **KPI:** Zamanında tamamlama oranı · Sonucu belli görev · Zamanında kapanan · Termini aşan. **Grafik:** Departman bazlı termin performansı (bar). **Sekmeler:** Oranı düşürenler · Zamanında kapananlar · Sonucu belli tüm görevler. **Kolonlar:** Görev · Proje / Müşteri · Departman · Sorumlu · Termin · Tamamlanma · Termin aşımı · Termin sonucu · Durum. **Çıktı:** `gorev-rapor-zamaninda` ⚠️.

**G‑14 · Revizyon oranı** (`revizyonOrani`) — **Amaç:** En az bir revizyon turu almış görevlerin tüm görevlere oranı; revizyonun getirdiği ek efor. **KPI:** Revizyon oranı · Revizyon alan görev · Toplam revizyon turu · Revizyondan gelen ek efor. **Grafik:** Oranı yükselten görevler (bar). **Sekmeler:** Revizyon alanlar · Tüm görevler. **Kolonlar:** Görev · Proje / Müşteri · Departman · Sorumlu · Kontrol eden · Revizyon turu · Sapma · Termin · Durum. **Çıktı:** `gorev-rapor-revizyon` ⚠️.

**G‑15 · Yeniden açılma oranı** (`yenidenAcilma`) — **Amaç:** Kapandıktan sonra tekrar açılan görevlerin oranı — kontrol ve kabul kriterinin ne kadar tuttuğunun ölçüsü. **KPI:** Yeniden açılma oranı · Yeniden açılan görev · Toplam yeniden açılma · Etkilenen proje. **Grafik:** Oranı yükselten görevler (bar). **Sekmeler:** Yeniden açılanlar · Tüm görevler. **Kolonlar:** Görev · Proje / Müşteri · Departman · Sorumlu · Kontrol eden · Yeniden açılma · Revizyon turu · Termin aşımı · Durum. **Çıktı:** `gorev-rapor-yeniden-acilma` ⚠️.

**G‑16 · Görev kalite sonuçları** (`kalite`) — **Amaç:** Kontrol sürecine girmiş görevlerin kalite puanı. Puan 100'den başlar; revizyon −10, yeniden açılma −15, termin aşımı −15, %20 üzeri efor sapması −10. **KPI:** Ortalama kalite puanı · İlk seferde geçen · İlk seferde geçme oranı · Zayıf sonuçlu görev. **Grafikler:** Görev bazlı kalite puanı (bar, geniş) · Kalite sınıfı dağılımı (donut). **Kolonlar:** Görev · Proje / Müşteri · Sorumlu · Kontrol eden · Revizyon turu · Yeniden açılma · Termin aşımı · Sapma · Kalite puanı · Sonuç. **Çıktı:** `gorev-rapor-kalite` ⚠️.

**G‑17 · Departmanlar arası talepler** (`talep` · grup **Kaynak**) — **Amaç:** Bir departmanın diğerinden istediği işler; onay durumu, termin ve geciken talepler. **Veri:** `DB.deptRequests` + `DB.depName` + `DB.empName`. **KPI:** Talep · Açık talep · Geciken talep · Onay bekleyen. **Grafikler:** Talep edilen departman (bar, geniş) · Talep durumu (donut). **Kolonlar:** Talep · Talep akışı · Talep eden · Sorumlu · Proje / Müşteri · Termin · Öncelik · Onay · Durum. **Çıktı:** `gorev-rapor-departman-talep` ⚠️.

**G‑18 · Sohbetten oluşan görevler** (`sohbet`) — **Amaç:** Kanal mesajlarından doğan görevler; mesajda bağlanan veya metinde geçen görev kodları üzerinden eşleştirilir. **Veri:** `base(f)` + `DB.messages` / `DB.channels` indeksi (`SOHBET`). **KPI:** Sohbetten oluşan görev · Kaynak kanal · Açık görev · Geciken. **Grafik:** Kanal bazlı görev üretimi (bar, geniş). **Kolonlar:** Görev · Kaynak sohbet · Proje / Müşteri · Sorumlu · Termin · Öncelik · Durum. **Çıktı:** `gorev-rapor-sohbet` ⚠️.

**G‑19 · Toplantıdan oluşan görevler** (`toplanti`) — **Amaç:** Toplantı kararları ve aksiyonlarının göreve dönüşme oranı; göreve bağlanmayan kararlar takipsiz kalan işlerdir. **Veri:** `DB.decisions` + `DB.meetings` + `DB.tasks`. **KPI:** Toplantı kararı · Göreve dönüşen · Göreve dönüşme oranı · Geciken karar. **Grafikler:** Toplantı bazlı karar adedi (bar, geniş) · Göreve dönüşüm (donut). **Kolonlar:** Karar / Aksiyon · Toplantı · Sorumlu · Termin · Oluşan görev · Görev durumu · Karar durumu. **Çıktı:** `gorev-rapor-toplanti` ⚠️.

---

## 5. Referans Raporları — `app-rapor-referans.html`

| | |
|---|---|
| **Ekran id** | `raporreferans` · 10 rapor |
| **Yetki kapısı** | ✅ `GV.perm.can('musteriRapor')` — yoksa kilit ekranı. |
| **Ek maskeleme** | `finans` → ciro, kâr, komisyon tutarı ve oran alanları (`••••••` / `••••`). |
| **Ortak filtreler (F‑REF)** | `tarih` Tarihten itibaren · `referans` Yönlendiren kişi (`DB.referrers`) · `musteri` Müşteri · `tur` Referans türü (sistemde var olan türler) · `durum` Kaynak durumu (Aktif/Pasif) |
| **Ortak kaynaklar** | `baseRef(f)` = `DB.referrers` · `baseYon(f)` = yönlendirme kayıtları (`DB.leads` + `DB.customers` birleşimi) · `baseMus(f)` = referansı olan `DB.customers` · `baseKom(f)` = `DB.commissions` |
| **Çıktı yetkisi** | ⚠️ `export` bayrağı yok. |

**R‑01 · Referans kaynakları** (`kaynaklar` · grup **Kaynak ve Dönüşüm**) — **Amaç:** PROMPT §9'daki 17 referans türü içinden sistemde kayıtlı kaynaklar (kişi referansları + dijital kanallar); her kaynağın yönlendirme hacmi, kazanımı, açık fırsatı ve komisyon modeli. **Kullanıcı:** R‑MÜŞ; satış yönetimi. **Veri:** `baseRef(f)`. **Filtreler:** F‑REF. **KPI:** Referans kaynağı · Aktif kaynak · Toplam yönlendirme · Kazanılan müşteri. **Grafik:** Kaynak bazlı yönlendirme ve kazanım (bar). **Sekmeler:** Tüm kaynaklar · Kişi kaynakları · Dijital ve etkinlik kanalları. **Kolonlar:** Yönlendiren · Referans türü · Şirket içi sorumlu · Yönlendirme · Kazanılan · Kaybedilen · Açık fırsat · Dönüşüm oranı · Sistemdeki kayıt · Komisyon modeli · Son yönlendirme · Durum. **Çıktı:** `referans-rapor-kaynaklar` ⚠️. **Yetki:** `musteriRapor` kapısı.

**R‑02 · Yönlendiren kişi performansı** (`performans`) — **Amaç:** §9 yönlendiren kartındaki performans ölçüleri: yönlendirdiği aday, kazanılan müşteri, kaybedilen fırsat, oluşturduğu ciro, dönüşüm oranı ve komisyon modeli. **Veri:** `baseRef(f)` + `DB.commissions` (KOM kazanç kayıtları). **KPI:** Yönlendiren · Ortalama dönüşüm oranı · Oluşturduğu ciro · Komisyon kazancı. **Grafikler:** Yönlendiren bazlı ciro (bar) · Yönlendiren bazlı kazanım (bar) · Dönüşüm oranı (bar). **Sekmeler:** Tüm yönlendirenler · Müşteri kazandıranlar · Komisyonlu. **Kolonlar:** Yönlendiren · Referans türü · Şirket içi sorumlu · Yönlendirme · Kazanılan · Kaybedilen · Dönüşüm oranı · Komisyon modeli · Son yönlendirme · Durum. **Çıktı:** `referans-rapor-performans` ⚠️. **Yetki:** kapı + `finans` maskesi (ciro, komisyon).

**R‑03 · Referans dönüşüm oranı** (`donusum`) — **Amaç:** Yönlendirme kayıtları üzerinden kazanılan / kaybedilen / süreçte dağılımı; müşteriye dönüşen aday tek kayıt sayılır. **Veri:** `baseYon(f)`. **KPI:** Yönlendirilen kayıt · Kazanılan · Dönüşüm oranı · Kaybedilen. **Grafik:** Kaynak bazlı dönüşüm oranı (bar). **Sekmeler:** Tüm kayıtlar · Kazanılan · Süreçte · Kaybedilen. **Kolonlar:** Sistemdeki kayıt · Yönlendiren · Referans türü · Sektör · Şirket içi sorumlu · Yönlendirme tarihi · Aşama · Sonuç · Oluşan müşteri · Kayıp nedeni. **Çıktı:** `referans-rapor-donusum` ⚠️.

**R‑04 · Referansla oluşan ciro** (`ciro` · grup **Finans**) — **Amaç:** Bir referans kaynağına bağlı müşterilerin ürettiği ciro; sözleşme, fatura, tahsil edilen ve bekleyen tahsilat kırılımı. **Veri:** `baseMus(f)` (`DB.customers` + `DB.contracts` + `DB.invoices` + `DB.payments`). **KPI:** Referanslı müşteri · Referanslı ciro · Toplam ciro içindeki payı · Bekleyen tahsilat. **Grafikler (4):** Müşteri bazlı referanslı ciro · Kaynak bazlı ciro · Müşteri bazlı proje adedi · Kaynak bazlı müşteri adedi. **Sekmeler:** Tüm referanslı müşteriler · Ciro üretenler · Bekleyen tahsilatı olanlar. **Kolonlar:** Oluşan müşteri · Yönlendiren · Referans türü · Şirket içi sorumlu · İlk kayıt · Durum (+ maskelenebilir para kolonları). **Çıktı:** `referans-rapor-ciro` ⚠️. **Yetki:** kapı + `finans`.

**R‑05 · Referansla oluşan kâr** (`kar`) — **Amaç:** Referanslı müşterilerin proje geliri ile gerçekleşen maliyet farkından, ödenen ve bekleyen komisyon da düşülerek net kâr ve marj. **Veri:** `baseMus(f)` + `DB.commissions`. **KPI:** Proje geliri · Gerçekleşen maliyet · Komisyon gideri · Net kâr. **Grafikler:** Gelir ve toplam maliyet · Müşteri bazlı net kâr · Müşteri bazlı harcanan efor. **Sekmeler:** Tümü · Kârlı müşteriler · Komisyon ödenen. **Kolonlar:** Oluşan müşteri · Yönlendiren · Referans türü · Proje · Marj · Durum. **Çıktı:** `referans-rapor-kar` ⚠️. **Yetki:** kapı + `finans`.

**R‑06 · Ödenen komisyonlar** (`odenen`) — **Amaç:** Ödemesi tamamlanmış referans kazançları; kazanç tarihinden ödemeye geçen süre ve yönlendiren kırılımı. Alanlar Komisyon Kazançları ekranıyla birebir aynıdır. **Veri:** `baseKom(f)` → ödenenler. **KPI:** Ödenen kazanç · Ödenen tutar · Ortalama ödeme süresi · Ödeme yapılan yönlendiren. **Grafikler:** Yönlendiren bazlı ödenen komisyon · Yönlendiren bazlı ödenen kazanç. **Kolonlar:** Kazanç · Yönlendiren · Kazandırdığı müşteri · Ciro · Oran · Kazanç tutarı · Kazanç tarihi · Ödeme tarihi · Ödeme süresi · Onay · Durum. **Çıktı:** `referans-rapor-odenen-komisyon` ⚠️. **Yetki:** kapı + `finans`.

**R‑07 · Bekleyen komisyonlar** (`bekleyen`) — **Amaç:** Onay ya da ödeme bekleyen referans kazançları; bekleme süresi ve ödenen–bekleyen karşılaştırması. **Veri:** `baseKom(f)` → ödenmemişler. **KPI:** Bekleyen kazanç · Bekleyen tutar · Onay bekleyen · Ödemeye hazır. **Grafikler:** Ödenen ve bekleyen komisyon · Ödenen ve bekleyen kazanç. **Sekmeler:** Tüm bekleyenler · Onay bekleyen · Ödeme bekleyen. **Kolonlar:** Kazanç · Yönlendiren · Kazandırdığı müşteri · Ciro · Oran · Kazanç tutarı · Kazanç tarihi · Bekleme süresi · Onay · Durum. **Çıktı:** `referans-rapor-bekleyen-komisyon` ⚠️. **Yetki:** kapı + `finans`.

**R‑08 · Personel referansları** (`personel` · grup **Kırılım**) — **Amaç:** Şirket içinden gelen yönlendirmeler — türü "Personel" ve "Şirket ortağı" olan kaynakların getirdiği aday ve müşteri kayıtları. **Veri:** `baseYon(f)` → iç referans türleri. **KPI:** Personel kaynağı · Yönlendirilen kayıt · Kazanılan · Oluşan ciro. **Grafik:** Personel bazlı yönlendirme ve kazanım. **Kolonlar:** Sistemdeki kayıt · Yönlendiren · Sektör · Şirket içi sorumlu · Yönlendirme tarihi · Aşama · Sonuç · Oluşan müşteri. **Çıktı:** `referans-rapor-personel` ⚠️. **Yetki:** kapı + `finans` (ciro KPI'ı).

**R‑09 · Müşteri referansları** (`musteriRef`) — **Amaç:** Mevcut ve eski müşterilerin getirdiği yönlendirmeler — memnun müşterinin yeni iş üretme gücü. **Veri:** `baseYon(f)` → müşteri kaynaklı türler. **KPI:** Müşteri kaynağı · Yönlendirilen kayıt · Kazanılan · Oluşan ciro. **Grafik:** Müşteri kaynağı bazlı yönlendirme ve kazanım. **Sekmeler:** Tüm kayıtlar · Mevcut müşteriden · Eski müşteriden. **Kolonlar:** Sistemdeki kayıt · Yönlendiren · Referans türü · Sektör · Şirket içi sorumlu · Yönlendirme tarihi · Aşama · Sonuç · Oluşan müşteri. **Çıktı:** `referans-rapor-musteri-referansi` ⚠️. **Yetki:** kapı + `finans`.

**R‑10 · Referans kaynaklı müşteri devamlılığı** (`devamlilik`) — **Amaç:** Referansla kazanılan müşterilerin ilişki süresi, tekrar iş üretimi, son iletişim sessizliği, memnuniyeti ve hâlâ aktif olup olmadığı — referansın **kalıcı** müşteri getirip getirmediğini ölçer. **Veri:** `baseMus(f)`. **KPI:** Referans kaynaklı müşteri · Hâlâ aktif · Devamlılık oranı · Ortalama ilişki süresi. **Grafik:** Müşteri bazlı ilişki süresi. **Sekmeler:** Tümü · Devam eden · Tekrar iş verenler · Kopan ilişki. **Kolonlar:** Oluşan müşteri · Yönlendiren · Referans türü · Şirket içi sorumlu · İlk kayıt · İlişki süresi · Proje · Tekrar iş · Son iletişim · Memnuniyet · Risk · Durum. **Çıktı:** `referans-rapor-devamlilik` ⚠️. **Yetki:** yalnız kapı (para alanı yok).

---

## 6. Filo Raporları — `app-rapor-filo.html`

| | |
|---|---|
| **Ekran id** | `raporfilo` · 19 rapor |
| **Yetki kapısı** | ❌ Yok — R‑RAPOR görebilir. |
| **Maskeleme** | `finans` → tutar, prim, gider, kira, km başına maliyet alanları. |
| **Ortak filtreler (F‑FLO)** | `tarih` Tarihten itibaren · `arac` Araç (plaka + marka/model) · `personel` Sürücü / personel · `dep` Departman · `proje` Proje · `durum` Durum (Aktif/Serviste/Pasif/Planlandı/Yaklaşıyor/Tamam/Kapandı/Ödendi/Ödenmedi) |
| **Ortak kaynaklar** | `baseArac(f)` = `DB.vehicles` · `baseKayit(list, f, {tarih, surucu})` = araca bağlı kayıt koleksiyonları |
| **Yenileme eşikleri** | 60 / 30 / 15 / 7 gün — bakım, muayene, sigorta, kasko raporlarında ortak |
| **Çıktı yetkisi** | ⚠️ `export` bayrağı yok. |

**F‑01 · Aktif araçlar** (`aktif` · grup **Envanter**) — **Amaç:** Filoda kayıtlı ve kullanımda olan araçlar; mülkiyet, kullanım şekli, güncel kilometre ve yaklaşan yenileme yükümlülükleri. **Veri:** `baseArac(f)` → aktifler. **KPI:** Aktif araç · Serviste · Toplam kilometre · Filo edinme bedeli. **Grafik:** yok. **Sekmeler:** Kullanımda · Serviste · Tümü. **Kolonlar:** Araç · Tip / yakıt · Mülkiyet · Kullanım · Departman · Güncel km · Sonraki bakım · Muayene · Trafik sigortası · Toplam gider · Durum. **Çıktı:** `filo-rapor-aktif` ⚠️. **Yetki:** `finans` → edinme bedeli ve gider maskeli.

**F‑02 · Personele tahsisli araçlar** (`tahsisli`) — **Amaç:** Bir personele zimmetlenmiş araçlar; ana ve yedek sürücü, bağlı departman, kullanım kilometresi ve araç başına gider. **KPI:** Tahsisli araç · Farklı ana sürücü · Yedek sürücüsü olan · Ortalama kilometre. **Kolonlar:** Araç · Ana sürücü · Yedek sürücü · Departman · Tip / yakıt · Mülkiyet · Güncel km · Sonraki bakım · Muayene · Toplam gider · Durum. **Çıktı:** `filo-rapor-tahsisli` ⚠️.

**F‑03 · Ortak kullanım araçları** (`ortak`) — **Amaç:** Havuzda tutulan, sabit sürücüsü olmayan araçlar; kullanan personel yakıt kayıtlarından türetilir. **Veri:** `baseArac(f)` + `DB.fuelLogs`. **KPI:** Ortak araç · Kullanan personel · Toplam kilometre · Serviste. **Kolonlar:** Araç · Departman · Tip / yakıt · Mülkiyet · Güncel km · Kullanan personel · Sonraki bakım · Toplam gider · Durum. **Çıktı:** `filo-rapor-ortak` ⚠️.

**F‑04 · Servisteki araçlar** (`serviste`) — **Amaç:** Durumu "Serviste" olan araçlar; açık bakım kaydı, serviste geçen süre ve bakım maliyeti. **Veri:** `baseArac(f)` + `DB.maintenance`. **KPI:** Servisteki araç · Açık bakım kaydı · En uzun servis süresi · Servis maliyeti. **Kolonlar:** Araç · Tip / yakıt · Departman · Açık bakım kaydı · Serviste gün · Bakım maliyeti · Güncel km · Durum. **Çıktı:** `filo-rapor-serviste` ⚠️.

**F‑05 · Bakımı yaklaşan araçlar** (`bakimYaklasan` · grup **Yenileme**) — **Amaç:** Tamamlanmamış bakım planları; tarih eşiklerinin yanında **kilometre eşiği** de izlenir — planlanan bakım km'sine yaklaşan araç tarihten bağımsız servise çağrılır. **Veri:** `baseKayit(DB.maintenance, f, {tarih:'planTarihi'})`. **KPI:** Yaklaşan bakım · 60 gün içinde · 15 gün içinde · Bakım km eşiğine en yakın. **Grafik:** Planlanan bakım kilometresi ve güncel kilometre (bar, geniş). **Sekmeler:** 60 gün içinde · Tüm planlı bakımlar. **Kolonlar:** Bakım kaydı · Araç · Departman · Plan tarihi · Kalan gün · Yenileme eşiği · Plan km / güncel km · Servis · Planlanan işlemler · Durum. **Çıktı:** `filo-rapor-bakim-yaklasan` ⚠️.

**F‑06 · Bakımı geciken araçlar** (`bakimGeciken`) — **Amaç:** Plan tarihi geçmiş ya da planlanan bakım km'si aşılmış ve kapanmamış bakım kayıtları; servise girmiş ama tamamlanmamış işler de gecikme sayılır. **KPI:** Geciken bakım · Ortalama gecikme · Km eşiğini aşan araç · Serviste bekleyen. **Kolonlar:** Bakım kaydı · Araç · Departman · Plan tarihi · Servise giriş · Gecikme · Km aşımı · Servis · Bakım maliyeti · Durum. **Çıktı:** `filo-rapor-bakim-geciken` ⚠️.

**F‑07 · Muayenesi yaklaşan araçlar** (`muayene`) — **Amaç:** Muayene geçerlilik tarihleri; eşikler ve süresi dolanlar. Kusur kaydı olan araçlarda tekrar muayene takibi. **Veri:** `DB.inspections`. **KPI:** İzlenen muayene · 60 gün içinde · 30 gün içinde · Kusur kaydı olan. **Sekmeler:** 60 gün içinde · Süresi dolanlar · Tüm muayeneler. **Kolonlar:** Muayene kaydı · Araç · Departman · Son muayene · Geçerlilik / sonraki · Kalan gün · Yenileme eşiği · Sonuç · Kusur bilgisi · Durum. **Çıktı:** `filo-rapor-muayene` ⚠️.

**F‑08 · Sigortası yaklaşan araçlar** (`sigorta`) — **Amaç:** Zorunlu trafik sigortası poliçelerinin bitiş tarihleri; eşikler, yenileme ve ödeme durumu. **Veri:** `DB.policies` → tür "Trafik Sigortası". **KPI:** Trafik poliçesi · 60 gün içinde bitiyor · Yenilemesi bekleyen · Toplam prim. **Grafik:** Sigorta şirketi bazlı prim. **Sekmeler:** 60 gün içinde · Tüm trafik poliçeleri. **Kolonlar:** Poliçe · Araç · Departman · Sigorta şirketi · Başlangıç · Bitiş · Kalan gün · Yenileme eşiği · Prim · Teminat · Yenileme · Ödeme. **Çıktı:** `filo-rapor-sigorta` ⚠️. **Yetki:** prim `finans` ile maskeli.

**F‑09 · Kaskosu yaklaşan araçlar** (`kasko`) — **Amaç:** Kasko poliçelerinin bitişi; kasko bedeli, muafiyet, hasarsızlık oranı, ikame araç ve mini onarım hakları. **Veri:** `DB.policies` → tür "Kasko". **KPI:** Kasko poliçesi · 60 gün içinde bitiyor · Toplam kasko bedeli · Toplam prim. **Grafik:** Kasko bedeli ve prim (bar, geniş). **Sekmeler:** 60 gün içinde · Tüm kasko poliçeleri. **Kolonlar:** Poliçe · Araç · Kasko şirketi · Bitiş · Kalan gün · Yenileme eşiği · Kasko bedeli · Prim · Muafiyet · Hasarsızlık · Ek haklar · Yenileme · Ödeme. **Çıktı:** `filo-rapor-kasko` ⚠️. **Yetki:** R‑FİN (bedel ve prim maskeli).

**F‑10 · Yakıt tüketimi** (`yakit` · grup **Maliyet**) — **Amaç:** Yakıt ve şarj kayıtları; litre, birim fiyat, tutar, kilometre. Ortalama tüketim ardışık dolumların km farkından hesaplanır — tek kayıtlı araçta hesaplanamaz. **Veri:** `DB.fuelLogs`. **KPI:** Toplam litre · Toplam yakıt gideri · Ortalama birim fiyat · Dolum kaydı. **Grafik:** İstasyon bazlı yakıt gideri (geniş). **Kolonlar:** Yakıt kaydı · Araç · Tarih · Sürücü · Litre · Birim fiyat · Tutar · Kilometre · Ortalama tüketim · İstasyon. **Çıktı:** `filo-rapor-yakit` ⚠️. **Yetki:** tutar `finans`.

**F‑11 · Araç giderleri** (`gider`) — **Amaç:** Yakıt, bakım, onarım, lastik, sigorta, kasko, muayene, otopark, HGS, kira, vergi, ceza ve diğer gider kalemlerinin tamamı. **Veri:** `DB.vehicleExpenses`. **KPI:** Toplam gider · Gider kaydı · En yüksek gider kalemi · Araç başına ortalama. **Grafik:** Gider türü bazlı dağılım. **Kolonlar:** Gider kaydı · Araç · Departman · Tarih · Gider türü · Tutar · Açıklama · Belge. **Çıktı:** `filo-rapor-gider` ⚠️. **Yetki:** `finans`.

**F‑12 · Kilometre başına maliyet** (`kmMaliyet`) — **Amaç:** Araç başına kayıtlı gider toplamının güncel kilometreye bölünmesi. Satın alma bedeli ve kiralama taahhüdü **bu ölçüye dahil değildir** (bkz. F‑19). **KPI:** Filo km başına maliyet · Kayıtlı toplam gider · Toplam kilometre · En pahalı araç. **Grafik:** Gider bileşenleri (bar, geniş). **Kolonlar:** Araç · Güncel km · Kayıtlı gider · Yakıt gideri · Bakım ve onarım · Sigorta ve kira · Km başına maliyet · Aylık ortalama gider · Ortalama tüketim · Durum. **Çıktı:** `filo-rapor-km-maliyet` ⚠️. **Yetki:** `finans`.

**F‑13 · Personel bazlı kullanım** (`personelKullanim` · grup **Kullanım**) — **Amaç:** Ana/yedek sürücülük, yakıt kayıtları, trafik cezaları ve kaza kayıtlarının personel bazında toplanması. Kişi başına km verisi tutulmadığı için kullanım yoğunluğu yakıt kayıtlarından okunur (kabul edilmiş sınır). **Veri:** `personelOzet(f)`. **KPI:** Araç kullanan personel · Tahsisli araç · Toplam yakıt · Ceza ve kaza kaydı. **Kolonlar:** Personel · Departman · Ana sürücü · Yedek sürücü · Tahsisli araçlar · Yakıt kaydı · Litre · Yakıt gideri · Trafik cezası · Kaza kaydı. **Çıktı:** `filo-rapor-personel-kullanim` ⚠️. **Yetki:** `finans`.

**F‑14 · Departman bazlı kullanım** (`depKullanim`) — **Amaç:** Araçların bağlı olduğu departman kırılımı; araç adedi, toplam km, gider yükü ve km başına maliyet. **KPI:** Araçlı departman · Toplam araç · Toplam kilometre · Toplam gider. **Grafik:** Departman bazlı araç ve kilometre (bar, geniş). **Kolonlar:** Departman · Araç · Plakalar · Toplam km · Serviste · Yakıt · Toplam gider · Km başına maliyet · Ceza · Kaza. **Çıktı:** `filo-rapor-departman-kullanim` ⚠️. **Yetki:** `finans`.

**F‑15 · Proje bazlı kullanım** (`projeKullanim`) — **Amaç:** Projeye tahsis edilmiş araçlar. Projeye bağlanmamış araçlar "Tahsis edilmemiş" satırında toplanır — bu araçların maliyeti proje bütçesine yansıtılamaz. **KPI:** Projeye tahsisli araç · Araçlı proje · Tahsis edilmemiş araç · Toplam kilometre. **Kolonlar:** Proje · Proje durumu · Araç · Plakalar · Toplam km · Toplam gider · Km başına maliyet · Serviste. **Çıktı:** `filo-rapor-proje-kullanim` ⚠️. **Yetki:** `finans`.

**F‑16 · Kaza ve hasar** (`kaza` · grup **Olay**) — **Amaç:** Kaza tarihi, konum, sürücü, karşı araç, kusur oranı, ekspertiz, sigorta dosyası ve onarım maliyeti; açık ve kapanmış hasar dosyaları. **Veri:** `DB.accidents`. **KPI:** Kaza kaydı · Kusurlu kaza · Açık hasar dosyası · Onarım maliyeti. **Kolonlar:** Kaza kaydı · Araç · Kaza tarihi · Sürücü · Konum · Karşı araç · Kusur oranı · Ekspertiz · Sigorta dosyası · Onarım servisi · Onarım maliyeti · Dosya durumu. **Çıktı:** `filo-rapor-kaza` ⚠️. **Yetki:** onarım maliyeti `finans`.

**F‑17 · Trafik cezaları** (`ceza`) — **Amaç:** Araç ve sürücü bazında cezalar; tür, tutar, son ödeme tarihi ve ödeme durumu. Son ödeme tarihi geçmiş ödenmemiş cezalar gecikme işaretlenir. **Veri:** `DB.fines`. **KPI:** Trafik cezası · Ödenmemiş ceza · Toplam ceza tutarı · Son ödemesi geçen. **Grafik:** Sürücü bazlı ceza tutarı. **Sekmeler:** Ödenmemiş · Tüm cezalar. **Kolonlar:** Ceza kaydı · Araç · Departman · Ceza tarihi · Sürücü · Ceza türü · Ceza tutarı · Son ödeme · Gecikme · Ceza belgesi · Ödeme durumu. **Çıktı:** `filo-rapor-ceza` ⚠️. **Yetki:** tutar `finans`.

**F‑18 · Kiralama sözleşmeleri** (`kiralama` · grup **Mülkiyet**) — **Amaç:** Kiralık ve finansal kiralama araçlarının sözleşme koşulları; aylık kira, km sınırı kullanımı, depozito, sözleşme bitişine kalan süre. Km sınırı yıllık kabul edilip sözleşme yılı sayısıyla çarpılır. **KPI:** Kiralık araç · Aylık toplam kira · En yakın sözleşme bitişi · Km sınırı kullanımı. **Grafik:** Sözleşme kilometre sınırı ve güncel kilometre (bar, geniş). **Kolonlar:** Araç · Kiralama firması · Sözleşme başlangıcı · Sözleşme bitişi · Kalan gün · Aylık kira · Sözleşme taahhüdü · Km sınırı · Km kullanımı · Depozito · Durum. **Çıktı:** `filo-rapor-kiralama` ⚠️. **Yetki:** R‑FİN.

**F‑19 · Satın alma ve kiralama karşılaştırması** (`sahiplik`) — **Amaç:** Her araç için aylık edinme + işletme maliyeti karşılaştırması. Satın alınan araçta edinme bedeli sahiplik ayına yayılır, kiralıkta aylık kira edinme maliyeti sayılır; mükerrer sayımı önlemek için "Kira" gider kalemi işletme maliyetinden düşülür. **KPI:** Satın alınan araç · Kiralık araç · Satın alınan · aylık ortalama · Kiralık · aylık ortalama. **Grafikler:** Aylık edinme ve işletme maliyeti (bar, geniş) · Mülkiyet bazlı kilometre (bar, geniş). **Sekmeler:** Tüm araçlar · Satın alınan · Kiralık. **Kolonlar:** Araç · Mülkiyet · Edinme / sözleşme başlangıcı · Edinme bedeli / kira taahhüdü · Aylık edinme · Aylık işletme · Aylık toplam · Bugüne kadarki toplam · Güncel km · Km başına sahip olma · Durum. **Çıktı:** `filo-rapor-sahiplik` ⚠️. **Yetki:** R‑FİN.

---

## 7. Satış ve Finans Raporları — `app-rapor-finans.html`

| | |
|---|---|
| **Ekran id** | `raporfinans` · 16 rapor |
| **Yetki kapısı** | ✅ `GV.perm.can('finans')` — ekranın tamamı finans verisidir; yetkisiz rol kilit ekranı görür (§26‑D). |
| **Ortak filtreler (F‑FİN)** | `tarih` Tarihten itibaren · `musteri` Müşteri · `proje` Proje · `temsilci` Satış temsilcisi / sorumlu · `durum` Durum |
| **Ortak kaynaklar** | `baseLeads/leadRows` = `DB.leads` · `baseQuotes` = `DB.quotes` · `projectRows` = `DB.projects` · `paymentRows` = `DB.payments` · `baseInvoices` = `DB.invoices` · `baseCustomers` = `DB.customers` · `acikMilestones` = faturalanmamış `DB.milestones` |
| **KDV ekseni** | Gelir/maliyet/kâr **KDV hariç**; fatura ve tahsilat tutarları **KDV dahil**. Kolon başlıklarında açıkça yazılır. |
| **Çıktı yetkisi** | ✅ `export:canExp` — ortak tablo iskeletinde, tüm 16 rapor `disaAktar` yetkisine bağlı. |

**S‑01 · Lead kaynakları** (`leadkaynak` · grup **Satış Hunisi**) — **Amaç:** Müşteri adaylarının hangi kanaldan geldiği; kanal başına fırsat adedi, toplam fırsat değeri, kazanılan ciro ve dönüşüm oranı. Fırsat değeri teklif varsa teklifin genel toplamı, yoksa müşterinin beyan ettiği bütçedir. **Kullanıcı:** R‑FİN; satış yönetimi ve pazarlama. **Veri:** `baseLeads(f)` → kaynak kırılımı. **KPI:** Aktif kaynak · Toplam lead · Toplam fırsat değeri · Kazanılan ciro. **Grafikler:** Kaynak bazlı fırsat değeri ve kazanılan ciro (bar, geniş) · Lead adedi dağılımı (donut). **Kolonlar:** Kaynak · Lead adedi · Toplam fırsat değeri · Kazanılan · Kaybedilen · Açık fırsat · Dönüşüm · Kazanılan ciro · Kaybedilen değer · Ortalama puan · Son talep. **Çıktı:** `finans-rapor-lead-kaynak` · `disaAktar`. **Yetki:** `finans` kapısı.

**S‑02 · Satış dönüşüm oranı** (`donusum`) — **Amaç:** Sonuçlanmış fırsatlar üzerinden dönüşüm oranı (kazanılan ÷ kazanılan+kaybedilen); huni grafiği fırsatların hangi aşamada beklediğini gösterir. **Veri:** `leadRows` + `DB.pipelineStages`. **KPI:** Dönüşüm oranı · Kazanılan fırsat · Kaybedilen fırsat · Açık huni değeri. **Grafikler:** Satış hunisi — aşama bazlı fırsat adedi (bar, geniş) · Fırsat sonucu dağılımı (donut). **Sekmeler:** Tüm fırsatlar · Açık fırsatlar · Sonuçlananlar. **Kolonlar:** Fırsat · Kaynak · Sorumlu · Aşama · Olasılık · Fırsat değeri · Ağırlıklı gelir · Talep tarihi · Kapanış tahmini · Sonuç. **Çıktı:** `finans-rapor-donusum`.

**S‑03 · Teklif başarı oranı** (`teklif`) — **Amaç:** Müşteriye iletilmiş tekliflerin kazanma oranı, tutarlar, uygulanan indirim, iç onay ve müşteri onayı durumu. **Veri:** `baseQuotes(f)`. **KPI:** Teklif başarı oranı · Kazanılan teklif tutarı · Açık teklif tutarı · Ortalama teklif tutarı. **Grafikler:** Teklif tutarları (bar, geniş) · Teklif durumu dağılımı (donut). **Sekmeler:** Tüm teklifler · Süreçte olanlar · Kazanılanlar · Kaybedilenler. **Kolonlar:** Teklif · Müşteri · Hazırlayan · Teklif tarihi · Geçerlilik · Ara toplam · İndirim · Genel toplam · İç onay · Müşteri onayı · Sözleşme · Teklif durumu. **Çıktı:** `finans-rapor-teklif`.

**S‑04 · Kazanılan satışlar** (`kazanilan`) — **Amaç:** Sözleşmeye dönüşmüş fırsatlar; kazanılan tutar, imzaya kadar geçen satış süresi ve oluşan proje bağlantısı. Kazanma tarihi = sözleşme imza tarihi. **KPI:** Kazanılan satış · Toplam kazanılan ciro · Ortalama satış tutarı · Ortalama satış süresi. **Grafikler:** Kazanılan satış tutarları (bar, geniş) · Hizmet türü dağılımı (donut). **Kolonlar:** Kazanılan fırsat · Müşteri · Satış sorumlusu · Teklif · Sözleşme · Kazanılan tutar · Talep tarihi · Kazanma tarihi · Satış süresi · Kaynak. **Çıktı:** `finans-rapor-kazanilan`.

**S‑05 · Kaybedilen satışlar** (`kaybedilen`) — **Amaç:** Kaybedilen fırsatlar, kaçan fırsat değeri ve kayıp nedenleri; kayıp nedeni dağılımı satış argümanının nerede zayıf kaldığını gösterir. **KPI:** Kaybedilen fırsat · Kaçan fırsat değeri · Kayıp oranı · En sık kayıp nedeni. **Grafikler:** Kayıp nedeni dağılımı (bar, geniş) · Kaçan fırsat değeri (bar, geniş). **Kolonlar:** Kaybedilen fırsat · Kayıp nedeni · Kaynak · Satış sorumlusu · Teklif · Kaçan değer · Talep tarihi · Kayıp tarihi · Süreçte geçen · Lead puanı. **Çıktı:** `finans-rapor-kaybedilen`.

**S‑06 · Tahmini satış geliri** (`tahminigelir`) — **Amaç:** Açık fırsatların aşama olasılığıyla ağırlıklandırılmış gelir tahmini; olasılıklar PROMPT §8.2 satış aşaması tanımından, ağırlıklı gelir = fırsat değeri × aşama olasılığı. **KPI:** Açık fırsat · Toplam fırsat değeri · Ağırlıklı gelir tahmini · Bu ay kapanması beklenen. **Grafikler:** Fırsat değeri ve ağırlıklı gelir (bar, geniş) · Beklenen kapanış ayına göre gelir (line, geniş). **Sekmeler:** Tüm açık fırsatlar · Sıcak fırsatlar · Bu ay kapanacaklar. **Kolonlar:** Fırsat · Aşama · Olasılık · Fırsat değeri · Ağırlıklı gelir · Sorumlu · Kapanış tahmini · Sıcaklık · Lead puanı · Kaynak. **Çıktı:** `finans-rapor-tahmini-gelir`.

**S‑07 · Satış temsilcisi performansı** (`temsilci` · grup **Performans**) — **Amaç:** Temsilci başına fırsat yükü, kazanım, dönüşüm oranı, teklif üretimi, kazanılan ciro ve elde tutulan açık huni değeri. Performans yalnız adetle değil ciro ve dönüşümle birlikte okunur. **Veri:** `leadRows` + `baseQuotes` + `DB.emp` / `DB.roleName`. **KPI:** Satış temsilcisi · Toplam kazanılan ciro · En yüksek dönüşüm · Elde tutulan açık huni. **Grafikler:** Temsilci bazlı kazanılan ciro ve açık huni (bar, geniş) · Dönüşüm oranı (bar, geniş). **Kolonlar:** Temsilci · Fırsat · Kazanılan · Kaybedilen · Açık · Dönüşüm · Teklif · Teklif tutarı · Kazanılan ciro · Açık huni değeri · Ort. satış süresi. **Çıktı:** `finans-rapor-temsilci`.

**S‑08 · Ortalama satış süresi** (`satissure`) — **Amaç:** Talep tarihinden sonuç tarihine kadar geçen gün. Kazanımda sonuç tarihi sözleşme imzası, kayıpta son iletişim tarihidir; yalnız sonuçlanmış fırsatlar hesaba girer. **KPI:** Ortalama satış süresi · En kısa süre · En uzun süre · Kazanımda ortalama. **Grafikler:** Fırsat bazlı satış süresi (bar, geniş) · Hizmet türüne göre ortalama süre (bar, geniş). **Sekmeler:** Sonuçlanan tüm fırsatlar · Kazanılanlar · Kaybedilenler. **Kolonlar:** Fırsat · Kaynak · Sorumlu · Talep tarihi · Sonuç tarihi · Satış süresi · Fırsat değeri · Aşama · Sonuç. **Çıktı:** `finans-rapor-satis-suresi`.

**S‑09 · Proje bütçeleri** (`projebutce` · grup **Proje Finansı**) — **Amaç:** Sözleşme bedeli, onaylı bütçe, gerçekleşen maliyet ve kalan bütçe. Hesaplar `app-butce.html` ile birebir aynıdır: kalan = onaylı bütçe − gerçekleşen maliyet, kullanım = maliyet ÷ bütçe. Tüm tutarlar **KDV hariç**. **KPI:** Toplam onaylı bütçe · Toplam sözleşme bedeli · Bütçe kullanımı · Bütçesi aşan proje. **Grafikler:** Onaylı bütçe ve gerçekleşen maliyet (bar, geniş) · Sağlık durumuna göre bütçe dağılımı (donut). **Sekmeler:** Tüm projeler · Bütçesi aşanlar · Devam edenler. **Kolonlar:** Proje · Müşteri · Sözleşme bedeli (KDV hariç) · Onaylı bütçe · Gerçekleşen maliyet · Kalan bütçe · Kullanım · İlerleme · Sağlık · Proje durumu. **Çıktı:** `finans-rapor-proje-butce`.

**S‑10 · Proje maliyetleri** (`projemaliyet`) — **Amaç:** Gerçekleşen maliyetin efor ile ilişkisi: harcanan saat, saat başına maliyet, süre sapması ve bütçe aşım tutarı. Saat maliyeti = gerçekleşen maliyet ÷ harcanan saat. **KPI:** Toplam gerçekleşen maliyet · Ortalama saat maliyeti · Toplam bütçe aşımı · Harcanan efor. **Grafikler:** Proje bazlı gerçekleşen maliyet (bar, geniş) · Saat başına maliyet (bar, geniş). **Kolonlar:** Proje · Müşteri · Proje yöneticisi · Tahmini / Harcanan · Süre sapması · Gerçekleşen maliyet · Saat maliyeti · Onaylı bütçe · Bütçe aşımı · Sağlık. **Çıktı:** `finans-rapor-proje-maliyet`.

**S‑11 · Müşteri kârlılığı** (`musterikar`) — **Amaç:** Müşteri başına proje geliri (sözleşme bedeli), gerçekleşen maliyet, kâr ve marj; yanında faturalanan, tahsil edilen ve bekleyen tutarlar. Kâr = sözleşme bedeli − gerçekleşen maliyet. **KPI:** Toplam kâr · Ortalama marj · En kârlı müşteri · Bekleyen tahsilat. **Grafikler:** Müşteri bazlı gelir ve maliyet (bar, geniş) · Müşteri bazlı kâr marjı (bar, geniş). **Sekmeler:** Tüm müşteriler · Kâr üretenler · Bekleyen tahsilatı olanlar. **Kolonlar:** Müşteri · Proje · Proje geliri (KDV hariç) · Gerçekleşen maliyet · Kâr · Marj · Faturalanan (KDV dahil) · Tahsil edilen (KDV dahil) · Bekleyen tahsilat (KDV dahil) · Risk · Müşteri durumu. **Çıktı:** `finans-rapor-musteri-karlilik`. **Not:** Müşteri ekranındaki M‑13 ile aynı olguyu farklı eksende gösterir; canonical değerler aynı `custRow` mantığından gelir.

**S‑12 · Hizmet kârlılığı** (`hizmetkar`) — **Amaç:** Hizmet türü bazında gelir, maliyet, kâr ve marj — hangi hizmet kaleminin para kazandırdığını, hangisinin efor yakıp marjı düşürdüğünü gösterir. **Veri:** `projectRows` + `leadRows` hizmet kırılımı. **KPI:** Hizmet kalemi · Toplam kâr · En kârlı hizmet · Ortalama marj. **Grafikler:** Hizmet bazlı gelir ve maliyet (bar, geniş) · Kâr dağılımı (donut). **Kolonlar:** Hizmet · Proje · Gelir (KDV hariç) · Maliyet · Kâr · Marj · Saat başına kâr · Gelen talep · Açık talep değeri. **Çıktı:** `finans-rapor-hizmet-karlilik`.

**S‑13 · Tahsilatlar** (`tahsilat` · grup **Nakit**) — **Amaç:** Fatura bazlı tahsilat takibi: tahsil edilen, bekleyen ve geciken tutarlar. Değerler `app-tahsilat.html` ve `app-fatura.html` ile birebir aynı ve **KDV dahil** eksende. **KPI:** Tahsil edilen · Bekleyen tahsilat · Geciken tutar · Tahsilat oranı. **Grafikler:** Müşteri bazlı faturalanan ve tahsil edilen (bar, geniş) · Tahsilat durumuna göre tutar (donut). **Sekmeler:** Tüm kayıtlar · Bekleyenler · Gecikenler · Tahsil edilenler. **Kolonlar:** Tahsilat · Fatura · Müşteri · Proje · Tutar · Fatura tarihi · Vade · Gecikme · Tahsil tarihi · Sorumlu · Son aksiyon · Durum. **Çıktı:** `finans-rapor-tahsilat`.

**S‑14 · Geciken ödemeler** (`geciken`) — **Amaç:** Vadesi geçmiş ve tahsil edilmemiş tutarlar; gecikme günü, yaşlandırma kovası (1‑30 / 31‑60 / 60+ gün) ve son takip aksiyonu. **KPI:** Geciken kayıt · Geciken tutar · Ortalama gecikme · En uzun gecikme. **Grafikler:** Kayıt bazlı gecikme süresi (bar, geniş) · Yaşlandırma kovasına göre geciken tutar (bar, geniş). **Sekmeler:** Tüm gecikenler · 1‑30 gün · 31‑60 gün · 60+ gün. **Kolonlar:** Tahsilat · Fatura · Müşteri · Geciken tutar · Vade · Gecikme · Yaşlandırma · Takip sorumlusu · Son aksiyon · Proje · Durum. **Çıktı:** `finans-rapor-geciken-odeme`.

**S‑15 · Aylık gelir tahmini** (`aylikgelir`) — **Amaç:** Gerçekleşen faturalanan gelirle ileriye dönük tahminin ay ay karşılaştırması. Tahmin iki bileşenden oluşur: henüz faturalanmamış milestone ödemeleri + açık fırsatların olasılıkla ağırlıklandırılmış geliri. **Veri:** `baseInvoices` + `acikMilestones` + açık `leadRows`. **KPI:** Toplam faturalanan · Toplam tahsil edilen · Önümüzdeki 3 ay tahmini · Ortalama aylık gelir. **Grafikler:** Gerçekleşen gelir ve gelir tahmini (line, geniş) · Aylık faturalanan ve tahsil edilen (bar, geniş). **Kolonlar:** Dönem · Faturalanan gelir (KDV dahil) · Tahsil edilen (KDV dahil) · Milestone tahmini · Ağırlıklı pipeline · Toplam tahmin · Dönem tipi. **Çıktı:** `finans-rapor-aylik-gelir`.

**S‑16 · Nakit akış tahmini** (`nakit`) — **Amaç:** Kasaya giren ve girmesi beklenen nakdin ay ay projeksiyonu. Gerçekleşen giriş tahsil edilmiş ödemelerden; tahmini giriş bekleyen/geciken tahsilatlar, faturalanmamış milestone ödemeleri ve ağırlıklı pipeline gelirinden oluşur. Kümülatif sütun dönem sonu nakit pozisyonunu verir. **KPI:** Gerçekleşen nakit girişi · 30 gün içinde beklenen · Riskli (geciken) giriş · Dönem sonu nakit pozisyonu. **Grafikler:** Gerçekleşen ve tahmini nakit girişi (line, geniş) · Tahmini girişin kaynağı (bar, geniş). **Kolonlar:** Dönem · Gerçekleşen giriş · Bekleyen tahsilat · Faturalanmamış milestone · Ağırlıklı pipeline · Tahmini giriş · Dönem toplamı · Kümülatif pozisyon · Dönem tipi. **Çıktı:** `finans-rapor-nakit-akis`.

---

## 8. Proje Raporları — `app-rapor-proje.html`

| | |
|---|---|
| **Ekran id** | `raporproje` · **12 rapor** (katalogda 8 ve farklı isimlerle — bkz. §1) |
| **Yetki kapısı** | ❌ Yok — R‑RAPOR görebilir. |
| **Maskeleme + kapsam** | `finans` → bütçe / maliyet / kazanç tutarları; `GV.perm.scope('gor')` = `proje` \| `kendi` ise yalnız kullanıcının projeleri (`seeProje`) — filtre seçenekleri de daralır. |
| **Ortak filtreler (F‑PRJ)** | `tarih` Tarihten itibaren · `proje` Proje (kapsam filtreli) · `musteri` Müşteri · `pm` Proje yöneticisi · `durum` Proje durumu |
| **Ortak kaynaklar** | `baseProjects(f)` = `DB.projects` · `altKayit(f, list, dateFn)` = filtrelenen projelere bağlı alt kayıtlar |
| **Çıktı yetkisi** | ⚠️ `export` bayrağı yok. |

**J‑01 · Proje sağlığı** (`saglik` · grup **Proje Durumu**) — **Amaç:** Her projenin sağlık göstergesi ve türetilmiş sağlık puanı. Puan 100'den başlar; bütçe aşımı (en çok −30), süre sapması (−20), termin gecikmesi (−25), açık kritik hata (−15), geciken milestone (−10), kayıtlı risk maddeleri (−9) düşülür. **Kullanıcı:** PM, operasyon, yönetim (R‑RAPOR). **Veri:** `baseProjects(f)` + hata/milestone/risk türetmeleri. **KPI:** Proje · Riskli proje · Ortalama sağlık puanı · Kayıtlı risk maddesi. **Grafikler:** Proje bazlı sağlık puanı (bar, geniş) · Sağlık göstergesi dağılımı (donut). **Sekmeler:** Tüm projeler · Riskli ve dikkat · Termini aşanlar. **Kolonlar:** Proje · Müşteri · Proje yöneticisi · Sağlık · Sağlık puanı · Termin gecikmesi · Bütçe kullanımı · Açık kritik hata · Geciken milestone · Kayıtlı riskler · Proje durumu. **Çıktı:** `proje-rapor-saglik` ⚠️. **Yetki:** bütçe kullanımı `finans`; kapsam `gor`.

**J‑02 · Proje ilerlemesi** (`ilerleme`) — **Amaç:** Gerçekleşen ilerleme ile takvime göre beklenen ilerlemenin karşılaştırması; plan ilerlemesi başlangıç–planlanan bitiş arasında doğrusal varsayımla hesaplanır. **KPI:** Proje · Ortalama ilerleme · Planın gerisinde · Teslim edilen. **Grafikler:** Plan ilerlemesi ve gerçekleşen ilerleme (bar, geniş) · Plana göre sapma (bar, geniş). **Sekmeler:** Devam eden · Planın gerisinde · Tüm projeler. **Kolonlar:** Proje · Müşteri · Proje yöneticisi · Başlangıç · Planlanan bitiş · Kalan gün · Plan ilerlemesi · İlerleme · Plana göre fark · Açık görev · Proje durumu. **Çıktı:** `proje-rapor-ilerleme` ⚠️.

**J‑03 · Modül ilerlemesi** (`modul`) — **Amaç:** Projelerin modül kırılımı: modül bazında ilerleme, planlanan efor ve sorumlu — kapsamın hangi parçasında tıkanma olduğunu gösterir. **Veri:** `altKayit(f, DB.projectModules)`. **KPI:** Modül · Tamamlanan modül · Ortalama ilerleme · Planlanan efor. **Grafik:** Modül bazlı ilerleme (bar, geniş). **Kolonlar:** Modül · Proje / Müşteri · Sorumlu · Planlanan efor · Kalan efor · İlerleme · Durum. **Çıktı:** `proje-rapor-modul` ⚠️.

**J‑04 · Bütçe sapması** (`butce` · grup **Sapma**) — **Amaç:** Sözleşme bedeli, onaylı bütçe ve gerçekleşen maliyet karşılaştırması; bütçe kullanım oranı ve aşım tutarı. **KPI:** Onaylı bütçe · Gerçekleşen maliyet · Bütçesi aşan proje · Ortalama bütçe kullanımı. **Grafikler (4, hepsi geniş):** Onaylı bütçe ve gerçekleşen maliyet · Bütçe kullanım oranı · Tahmini ve harcanan süre · Bütçe kullanım oranı (ikinci eksen). **Sekmeler:** Tüm projeler · Bütçesi aşanlar · Devam edenler. **Kolonlar:** Proje · Müşteri · Sözleşme tutarı · Onaylı bütçe · Gerçekleşen maliyet · Kalan bütçe · Bütçe kullanımı · Bütçe sapması · Faturalanan · Proje durumu. **Çıktı:** `proje-rapor-butce` ⚠️. **Yetki:** R‑FİN (tutarlar maskeli).

**J‑05 · Süre ve termin sapması** (`sure`) — **Amaç:** Tahmini efor ile harcanan eforun karşılaştırması ve planlanan bitişe göre termin gecikmesi. Zaman kaydı sütunu onaylı/onaysız tüm girişleri toplar. **KPI:** Tahmini süre · Harcanan süre · Efor sapması · Termini aşan proje. **Grafikler:** Tahmini ve harcanan süre (bar, geniş) · Termin gecikmesi (bar, geniş). **Sekmeler:** Tüm projeler · Termini aşanlar · Eforu aşanlar. **Kolonlar:** Proje · Başlangıç · Planlanan bitiş · Gerçekleşen bitiş · Termin gecikmesi · Tahmini süre · Harcanan süre · Süre sapması · Sapma % · Zaman kaydı · Gecikme nedeni · Proje durumu. **Çıktı:** `proje-rapor-sure` ⚠️.

**J‑06 · Milestone durumu** (`milestone` · grup **Planlama**) — **Amaç:** Kilometre taşları: planlanan tarih, gecikme, ilerleme ve milestone'a bağlı taksit / fatura durumu. Taksit tutarları KDV hariçtir. **Veri:** `altKayit(f, DB.milestones)`. **KPI:** Milestone · Tamamlanan · Geciken · Bekleyen taksit (KDV hariç). **Grafikler:** Milestone taksit tutarları (bar, geniş) · Milestone ilerlemesi (bar, geniş) · Milestone durum dağılımı (donut). **Sekmeler:** Tüm milestone'lar · Gecikenler · Yaklaşanlar. **Kolonlar:** Milestone · Proje / Müşteri · Planlanan tarih · Gecikme · İlerleme · Kazanç tutarı · Ödeme durumu · Bağlı fatura · Durum. **Çıktı:** `proje-rapor-milestone` ⚠️. **Yetki:** R‑FİN (taksit tutarları).

**J‑07 · Sprint hızı (velocity)** (`sprint`) — **Amaç:** Sprint bazında planlanan ve tamamlanan efor; hız oranı = tamamlanan ÷ planlanan. Planlanan sprintler hızı düşürmemesi için ayrı sekmede toplanır. **Veri:** `altKayit(f, DB.sprints)`. **KPI:** Sprint · Planlanan efor · Tamamlanan efor · Ortalama hız. **Grafikler:** Sprint hızı seyri (line, geniş) · Sprint bazlı hız oranı (bar, geniş). **Sekmeler:** Tüm sprintler · Devam edenler · Tamamlananlar. **Kolonlar:** Sprint · Proje · Sprint aralığı · Görev · Planlanan · Tamamlanan · Kalan · Hız · Durum. **Çıktı:** `proje-rapor-sprint` ⚠️.

**J‑08 · Test sonuçları** (`test` · grup **Kalite**) — **Amaç:** Proje bazında koşulan test setleri: senaryo adedi, başarılı/başarısız senaryo ve başarı oranı. **Veri:** `altKayit(f, DB.tests)`. **KPI:** Test koşumu · Toplam senaryo · Başarı oranı · Başarısız senaryo. **Grafikler:** Başarılı ve başarısız senaryo (bar, geniş) · Test türü dağılımı (donut). **Sekmeler:** Tüm testler · Başarısız senaryosu olanlar · Planlananlar. **Kolonlar:** Test · Proje · Sorumlu · Tarih · Senaryo · Başarılı · Başarısız · Başarı oranı · Durum. **Çıktı:** `proje-rapor-test` ⚠️.

**J‑09 · Hata durumu** (`hata`) — **Amaç:** Projelerde açılan hatalar: şiddet, öncelik, bulan ve çözen kişi, açık hatanın yaşı ve kapananın çözüm süresi. **Veri:** `altKayit(f, DB.bugs)` + `DB.projectModules`. **KPI:** Hata · Açık hata · Kritik / Yüksek açık · Ortalama çözüm süresi. **Grafikler:** Proje bazlı açık hata (bar, geniş) · Şiddet dağılımı (donut). **Sekmeler:** Açık hatalar · Kritik ve yüksek · Tüm hatalar. **Kolonlar:** Hata · Proje / Modül · Şiddet · Öncelik · Bulan · Sorumlu · Bulunma · Yaş / Çözüm süresi · Bağlı görev · Durum. **Çıktı:** `proje-rapor-hata` ⚠️.

**J‑10 · Teslim performansı** (`teslim` · grup **Teslim ve Değişiklik**) — **Amaç:** Müşteriye yapılan teslimler: planlanan teslim tarihi, gecikme, müşteri onayı ve onayın kaç günde alındığı. **Veri:** `altKayit(f, DB.deliveries)`. **KPI:** Teslim · Müşteri onayı alınan · Zamanında teslim oranı · Geciken teslim. **Grafikler:** Müşteri onay süresi (bar, geniş) · Teslim durum dağılımı (donut). **Sekmeler:** Tüm teslimler · Gecikenler · Onay bekleyenler. **Kolonlar:** Teslim · Proje / Müşteri · Teslim tarihi · Gecikme · Teslim eden · Müşteri onayı · Onay süresi · Not · Durum. **Çıktı:** `proje-rapor-teslim` ⚠️.

**J‑11 · Değişiklik talepleri** (`degisiklik`) — **Amaç:** Kapsam değişikliği talepleri: talebin kaynağı, kapsam içi olup olmadığı, efor ve maliyet etkisi, verilen karar. **Veri:** `altKayit(f, DB.changeRequests)`. **KPI:** Değişiklik talebi · Onaylanan · Efor etkisi · Maliyet etkisi. **Grafikler:** Talep bazlı efor etkisi (bar, geniş) · Talep durum dağılımı (donut). **Sekmeler:** Tüm talepler · Karar bekleyenler · Kapsam dışı. **Kolonlar:** Değişiklik talebi · Proje / Müşteri · Talep eden taraf · Talep tarihi · Kapsam · Efor etkisi · Maliyet etkisi · Karar · Sorumlu · Durum. **Çıktı:** `proje-rapor-degisiklik` ⚠️. **Yetki:** maliyet etkisi `finans`.

**J‑12 · Kaynak ve iş yükü** (`kaynak` · grup **Kaynak**) — **Amaç:** Filtrelenen projelerde görev alan personelin yükü: kaç projede yer aldığı, açık ve geciken görev sayısı, projelere girdiği zaman kaydı ve haftalık kapasite doluluğu. **Veri:** `kaynakRows(f)` = `baseProjects` + `DB.tasks` + `DB.timelogs` + `DB.capacity`. **KPI:** Projede görevli personel · Açık görev · Geciken görev · Ortalama doluluk. **Grafikler:** Haftalık kapasite ve planlanan yük (bar, geniş) · Kişi bazlı açık görev (bar, geniş). **Kolonlar:** Personel · Departman · Proje · Toplam görev · Açık görev · Geciken · Zaman kaydı · Haftalık kapasite · Planlanan yük · İzin (gün) · Doluluk. **Çıktı:** `proje-rapor-kaynak` ⚠️. **Not:** Personel ekranındaki P‑03 İş Yükü raporuyla aynı ölçüleri **proje ekseninden** verir; ikisi de `DB.capacity` ve `DB.tasks`'tan türer.

---

## 9. Açık teknik noktalar (dürüst liste)

1. **Katalog senkronu** — `app-rapor.html` finans key'leri ve proje rapor listesi ekranlarla uyumsuz; ikisi de `deep:false`. Düzeltilmeden çip derin bağları açılamaz (§1).
2. **Çıktı yetkisi eksik** — 5 ekranda (personel, görev, referans, filo, proje) `export` bayrağı `disaAktar` yetkisine bağlanmamış; toplam **73 rapor** çıktı butonunu yetkisiz role de gösteriyor.
3. **Ekran düzeyi kapı eksikliği** — Görev, filo ve proje ekranlarında `GV.perm.can(...)` kapısı yok. Filo ve proje para maskelemesi yapıyor; görev ekranı para içermediği için sorun değil, ancak **filo ekranı** araç/sürücü verisini herhangi bir R‑RAPOR rolüne açıyor (`personelRapor` gibi bir kapı düşünülebilir).
4. **Kayıtlı rapor kapsamı** — Kayıtlı raporlar `localStorage`'da, tarayıcıya bağlı; rol değişince aynı kayıtlar görünmeye devam eder. PROMPT §20'nin "kayıtlı rapor" gereksinimi karşılanıyor ama sunucu tarafı yok (prototip sınırı).
5. **Kolon ayarları / zamanlanmış rapor** — Kolon yönetimi `GV.list`'ten geliyor ✅; PROMPT §20'de doğrudan istenmeyen ama §21 otomasyonlarında ima edilen **rapor zamanlama / e‑posta gönderimi** hiçbir ekranda yok.
6. **Test edilmesi gereken alanlar** — (a) `?r=` + `rf_*` URL geri yüklemesi 103 raporun tamamında; (b) 390px'de `.gv-rp-nav` yatay şerit davranışı; (c) `finans` yetkisi kapalı bir rolle filo/proje/müşteri ekranlarında maskelemenin **çıktıya** da yansıyıp yansımadığı (`exportValue` fonksiyonları `paraExp` kullanıyor, doğrulanmalı).
