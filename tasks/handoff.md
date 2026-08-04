# Handoff — GaviaWorks CRM

> Bu dosya, **sıfırdan gelen bir Claude'un hiçbir şey sormadan** işe devam
> edebilmesi için yazıldı. Sırayla oku: bu dosya → `tasks/plan.md` → `tasks/components.md`
> → `tasks/lessons.md` → `tasks/ui-debt.md`.
>
> **İLK İŞ:** QA script'lerini kur (bölüm 4). Script'ler `tasks/qa/` altında **repoda
> izleniyor** — yeniden yazma, kopyala.
> **`tasks/detay-brief.md`** = detay ekranı subagent sözleşmesi.
> **`tasks/form-brief.md`** = **form ekranı** subagent sözleşmesi (6. oturumda yazıldı).
> Yeni ekran yazdıracaksan ajana **önce ilgili brief'i okut**; prompt'ta yalnız ekrana özel
> kapsamı ver.
> **`tasks/ui-debt.md`** = arayüz + veri borç defteri. Üretim sırasında görülen sorunlar
> oraya yazılır, **o an düzeltilmez**; hepsi `plan.md` sonundaki
> **FAZ: UI ve UX KALİTE GEÇİŞİ** içinde ortak katmanda çözülür.

**Güncelleme:** 2026-08-04 (6. oturum sonu) · **108 ekran** · 25 detay · **3 form ekranı**
**plan.md ilerleme:** başındaki tek satırda tutuluyor — işaretli / toplam madde.
**Son tam tarama (bu oturumda koşuldu):**
`gate.js` **525 sayfa yüklemesi (105 ekran × 5 rol)** — konsol hatası 0, boş sayfa 0,
kırık istek 0 (3 form ekranı eklendikten SONRA koşulmadı, 7. oturumun ilk işi) ·
`canon.js` **601 kontrol** temiz (445'ti; eksen 15, 16, 17 eklendi) ·
`dbref.js` **108 ekran** temiz · `links.js` temiz, **33 hedef kuyrukta** (hepsi form) ·
`esc.js` · `mut.js` · `listen.js` · `grip-qa.js` temiz · üç form ekranı canlıda (HTTP 200).

---

## 1. BU OTURUMDA (6.) NE YAPILDI

### İŞ 1 — plan.md gerçeğe hizalandı
Defter 27 madde işaretli görünüyordu, oysa 105 ekran canlıdaydı. Yayındaki ekranlar
madde madde karşılaştırıldı:
- **B. Roller** kapandı (27 rol `DB.roles`'ta, 20 yetki ekseni `DB.permMatrix`'te).
- Wave 2–8 maddeleri gerçek duruma çekildi; **`[~]` kısmen** işareti tutarlı kullanıldı.
- **E. Veri modeli** ve **F. İş akışları (22 akış)** madde madde işaretlendi.
- **H. Kabul kriterleri** dürüstçe işaretlendi — 8 tam, 6 kısmen, gerekçeleriyle.
- Dosyanın başına **tek satır ilerleme özeti** kondu.
- **FAZ: UI ve UX KALİTE GEÇİŞİ** bölümü genişletildi: ui-debt'teki **her madde**
  (UID-01..19 + VB-04/06) alt madde olarak yazıldı, sistem geneli denetimler ayrı
  başlığa alındı, yöntem **dört kurala** indirildi.
- **Wave 12b — FORM EKRANLARI** bölümü eklendi: 36 form hedefi ekran ekran madde.

### İŞ 2 — VB-05 / VB-07 / VB-08 tek turda kapandı
Üçü de aynı sınıftı: **bağ veride yazılı değildi, ekranlar tahminle kuruyordu.**
Ayrıntı `ui-debt.md` sonundaki "ÇÖZÜM KAYDI" bloğunda, gerekçeler `assumptions.md`
**V-28..V-33**'te.

| Açılan alan | Not |
|---|---|
| `DB.tasks[].destek` · `DB.bugs[].destek` · `DB.changeRequests[].destek` | Ad **`destek`** seçildi: `changeRequests.talep` zaten "talebi açan taraf" ekseniydi (V-28) |
| `DB.bugs[].test` · `.sprint` | `sprint` = hatanın **ele alındığı** sprint (V-32) |
| `DB.tests[].moduller` (**dizi**) · `.sprint` | Tekil `modul` yetmezdi: bir regresyon koşumu üç modülü tarıyor (V-31) |
| `DB.deliveries[].moduller` (**dizi**) · `.test` | Zincir artık test → hata → teslim → taksit olarak uçtan uca okunuyor |
| `DB.assets[].siparis` | `alisFiyati` **NET** ekseni de yazıldı |

**Açılmayan alan:** `DB.tasks[].hata` — ters yön (`DB.bugs[].gorev`) zaten yazılıydı.
İki yönlü bağ ayrışır; `canon.js` bu alanın **doğmadığını** kontrol eder (V-29).

**Yan bulgular:** şiddet→etki ihlali düzeltildi (`HTA-2026-071` Kritik iken `GRV-2026-101`
etkisi Yüksek'ti → Çok yüksek) · `SIP-2026-008` teslim alınmıştı ama envanter karşılığı yoktu,
üç demirbaş eklendi (`DMB-2026-013/014/015`, Σ net 28.500 = siparişin neti).

**Bağsız bırakılanlar uydurulmadı** — 9 kümenin gerekçesi V-30'da tablo hâlinde.

### Ortak katmanda çözülen GERÇEK hatalar (hepsi ölçülerek doğrulandı)

**1. QA harness'ı yanlış şeyi ölçüyordu (ders L-17).** Beş script hedef adrese
`'?role=' + role` ekliyordu; hedef zaten `?id=KOD` taşıdığı için adres `?id=KOD?role=sahip`
oluyor ve **kayıt bulunamıyordu**. Ölçüm: `app-destek-detay.html?id=DST-2026-118`
düzeltmeden önce **2 sekme**, sonra **6 sekme**. Yani 5. oturumun "25 detay ekranı
tabs.js'ten geçti" kaydı **boş durum ekranını** ölçmüştü. Düzeltildi.

**2. `GV.refresh()` açık yan paneli kapatmıyordu (ders L-18).** Overlay `.page-main`
dışına basılır, mount tazelenince ölmez. Ölçüm: bir tazeleme → `document` dinleyicisi
**7 → 10**. İki kat zarar: dinleyici birikmesi **ve** panelde eski verinin ekranda kalması.
Çözüm: `GV.refresh` açık `.gv-scrim`/`.gv-drawer` düğümlerini kapatır; `GV.modal`/`GV.drawer`
kapatıcısını düğüme asar (`__gvClose`).

**3. `GV.form` her çağrıda `window`'a yeni `beforeunload` bağlıyordu.** L-16 sınıfı.
`GV.on` ile tekil anahtara çevrildi (`cfg.id`). 36 form ekranı bu bileşene dayanacaktı.

**4. `components.md` §4 gerçeği anlatmıyordu.** `onSubmit`/`submitLabel` diye seçenek yok
(bileşen kaydet butonu basmaz); `multiselect`, `daterange`, `tags`, `user`, `customer`,
`project`, `richtext` tipleri **yok** — tanımsız tip sessizce `text` oluyor. Sözlük düzeltildi.

### İŞ 3 — form ekranları başladı
`tasks/form-brief.md` yazıldı (detay brief'inin form karşılığı). `duyuru-detay` kuyruktan
düşürüldü: duyurunun ayrı ekranı gerekmiyordu, `app-panel-duyurular.html`'e `?id=` derin
bağlantısı eklendi ve `app-ayar-log.html` hedefi ona çevrildi.

**Üretilen üç form ekranı** (`app-lead-form` · `app-musteri-form` · `app-satinalma-form`):
üçü de iki modlu (`?id=` düzenleme), yetki kapılı, `GV.refresh` ile biten, `qa.js` + `esc.js` +
`mut.js` + `listen.js` temiz. `BUILT`'e kaydedildi, kuyruk **36 → 33**.

**Ajan raporlarından çıkan ve ÖLÇÜLEREK doğrulanan üç veri bulgusu:**

**1. `kaynak` sözlüğe bağlı değildi — sessiz veri kaybı (assumptions V-34).**
İki ajan bağımsız bildirdi: 9 kayıt `kaynak:'Referans'` taşıyordu ama `'Referans'`
`DB.refTypes`'ta **yoktu**. `app-lead.html` ve `app-musteri.html` kaynak filtreleri
`options:DB.refTypes` kullandığı için **en kalabalık grubu hiç eşleştiremiyordu**.
Sözlüğe 18. tür eklenmedi (PROMPT.md §9 17 tür der); dokuzunun da `referans` bağı zaten
yazılıydı, `kaynak` yönlendirenin `tur`'una hizalandı. `'Referans'` bir tür değil,
**bağın kendisiydi**. `canon.js` **eksen 17** bunu artık her turda doğruluyor.

**2. `onayAdim` "çelişkisi" çelişki değildi — yazılı olmayan eksendi.**
Ajan "SAT-2026-015'te onayAdim=1 ama onaylanan adım 0" diye bildirdi. Ölçüldü:
`onayAdim` = **bulunulan adım sırası**, onaylanan adım sayısı DEĞİL. 6 talebin 6'sı bu
eksende tutarlı. Eksen `ops.js` başlığına yazıldı, `canon.js` **eksen 16** doğruluyor.
**Ders:** ajan raporu gerçek bir boşluğu gösterdi (eksen yazılı değildi) ama vardığı sonuç
yanlıştı — ikisi de ancak ölçünce ayrıldı.

**3. `MUS-2023-012.vergiNo = '6community'`** — bozuk dize, form doğrulaması yakaladı (V-35).

---

## 2. ORTAK KATMAN — 6. OTURUMDA DEĞİŞENLER

### `assets/js/shell.js`
- **`GV.refresh()`** artık açık modal / yan paneli de kapatır (L-18).

### `assets/js/ui.js`
- `GV.form` — `beforeunload` `GV.on` ile tekil anahtara bağlandı; dönüşe `isDirty()` ve `el` eklendi.
- `GV.modal` / `GV.drawer` — kapatıcı düğüme asılıyor (`el.__gvClose`).

### `assets/data/work.js` · `ops.js`
- Bağ alanları + koleksiyon başlıklarına **yazılı eksen sözleşmeleri** (bölüm 1, İŞ 2).
- `DB.assets` 12 → **15 kayıt**.

### `tasks/`
- **`form-brief.md` — YENİ.** Form ekranı subagent sözleşmesi.
- `components.md` — **§9d yeni**: modüller arası bağ alanı sözleşmesi + yön kuralı.
  §4 (`GV.form`) gerçeğe göre yeniden yazıldı. §9'a üç yeni koleksiyon sözleşmesi.
- `lessons.md` — **L-17** (QA aracı yanlış ölçüyordu) · **L-18** (overlay yeniden çizim).
- `assumptions.md` — **V-28..V-33**.
- `ui-debt.md` — VB-05/07/08 kapandı işaretlendi + çözüm kaydı · **VB-09 yeni**
  (`MOD-009` "Saha ekip yönetimi" yasak inşaat terimi taşıyor, VB-04 ile aynı turda).
- `tasks/qa/canon.js` — **eksen 15** (445 → 521 kontrol) · beş script'te adres düzeltmesi.

---

## 3. YENİ EKRAN EKLEME

### Form ekranı
1. Ajana **`tasks/form-brief.md`**'yi okut + ekrana özel kapsamı ver.
   **Aynı anda en fazla 3 ajan**, her biri tek dosya.
2. Gelen dosyayı `shell.js` **`BUILT`** dizisine ekle (tek yer).
3. Hassas ekransa `SCREEN_PERM`'e de yaz.
4. QA: `qa.js` → `esc.js` → `mut.js` → `listen.js` (form ekranında sekme yok, `tabs.js` gerekmez).
   Ayrıca **iki modu da** aç: `app-x-form.html` (yeni) ve `app-x-form.html?id=KOD` (düzenleme).
5. Dosya dosya stage → commit → push → `plan.md` işaretle (**aynı turn içinde**).

### Detay ekranı
Aynı akış, brief `tasks/detay-brief.md`, QA'ye `tabs.js` de girer.

### Şablon
```html
<body data-sec="BÖLÜM" data-screen="EKRAN">
<div id="rec"></div>
<script src="assets/data/...js"></script>   <!-- okunan HER koleksiyonun dosyası -->
<script src="assets/js/shell.js"></script>
<script src="assets/js/ui.js"></script>
<script>
document.addEventListener('gv:ready', function(){ /* GV.pageHead + markup */ });
</script></body>
```
`SECTIONS` anahtarları: `panel · satis · musteri · proje · gorev · destek · sohbet ·
personel · varlik · satinalma · finans · dokuman · toplanti · rapor · ayarlar`
(**`proje`**, `projeler` değil.)

---

## 4. QA KOMUTLARI

```bash
# Kurulum — script'ler repoda, YENİDEN YAZMA
SP=<scratchpad>
cd $SP && npm init -y && npm i playwright@1.62.1
mkdir -p $SP/qa-run && cp <repo>/tasks/qa/*.js $SP/qa-run/
ln -sfn $SP/node_modules $SP/qa-run/node_modules
```
> **`qa-run/` ayrı dizin, bilinçli** — ders **L-06 iki kez oldu**: subagent kendi geçici
> script'ini scratchpad köküne yazıp orkestratörünkini ezdi. Orkestratör scratchpad
> kökünden **hiçbir script çalıştırmaz.**

```bash
# Sunucu — TEK THREAD'Lİ python -m http.server KULLANMA
cd <repo> && python3 -c "
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
ThreadingHTTPServer(('127.0.0.1',8791), SimpleHTTPRequestHandler).serve_forever()" &

cd $SP/qa-run
node qa.js "app-x.html" [rol]     # 1440/768/390 · konsol · taşma · <style> · href="#"
node tabs.js "app-x.html" "sahip,ik,stajyer"   # HER sekmeyi tıklar (L-12 sınıfı)
node esc.js "app-x.html"          # etikette ham HTML (L-14) — konsol temizken de olur
node mut.js "app-x.html"          # 2× GV.refresh idempotent mi (L-15)
node listen.js "app-x.html"       # dinleyici birikiyor mu (L-16, L-18)
node canon.js                     # 15 canonical eksen → "TEMİZ — 521 kontrol"
node dbref.js                     # yüklenmeyen veri dosyası (L-12)
node links.js                     # kırık hedef + BUILT + üretilmemiş hedef kuyruğu
node gate.js                      # tüm ekranlar × 5 rol (~3 dk sürer, arka planda koş)
node grip-qa.js                   # rail tutamağı (UID-01 regresyonu)

# Canlı doğrulama (push sonrası ~1-2 dk)
curl -s -o /dev/null -w "%{http_code}\n" https://gaviaworks-dev.github.io/gaviaworks-crm/app-x.html
```

> **L-17 uyarısı:** Detay/form ekranını `?id=` ile tararken script'ler artık ayracı doğru
> seçiyor. Yine de yeni bir tarayıcı yazarsan **sonucu önceden bilinen bir kayıtla sına** —
> "6 sekme görmeliyim, 6 gördüm mü?" Aracın "TEMİZ" demesi doğru şeyi ölçtüğü anlamına gelmez.

**Commit:** `git add -A` **yasak**, dosya adıyla tek tek. Conventional Commits, İngilizce.
`gh auth switch --user gaviaworks-dev` gerekebilir. Commit sonu:
```
Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_01AFZ22KYDzKSD4GXaoq6gpi
```

---

## 5. SIRADAKİ İŞ

`node links.js` çıktısındaki "henüz üretilmemiş hedefler" **canlı kuyruktur** — elle sayma.
Bu oturum sonunda **form ekranları** dışında kuyrukta hedef kalmadı.

### Kuyruk (öncelik sırasıyla)
0. **İLK İŞ: `gate.js` tam süpürmesi.** Üç form ekranı `BUILT`'e eklendikten sonra tam
   tarama koşulmadı (~3 dk sürer, arka planda koş).
1. **Form ekranları — kuyruğun tamamı, 33 hedef.** `plan.md` **Wave 12b**'de ekran ekran madde hâlinde,
   kaynak liste ekranlarıyla birlikte yazılı. Sözleşme `tasks/form-brief.md`.
   Aynı anda en fazla 3 ajan; ortak katman, `BUILT` kaydı ve commit orkestratörde.
2. **Wave 13 kapanış:** `data-wip` süpürmesi · §22'deki 38 modüller arası bağlantının
   doğrulanması · canonical tarama · 1440/768/390 tam tarama · kapanış raporu.
3. **FAZ: UI ve UX KALİTE GEÇİŞİ** — `ui-debt.md`'de **18 açık UID + 3 açık VB**.
   **Ekran üretimi bitmeden bu faza başlanmaz.** plan.md sonundaki bölümde madde madde yazılı.

### Açık borçlar — özeti (tamamı `tasks/ui-debt.md`'de)
| # | Konu |
|---|---|
| UID-02..14 | mobil satır aksiyonu · kare thumbnail · `GV.upload` File · `scope('gor')` · sayaç global · toplu çıktı · kontrol/etiket boşluğu · native kontroller · yan panel başlığı · KPI ₺0 · "Tümü" sekmesi · `bulk[].show` · detay tablosu ≤760px |
| UID-15 | Dört eski detay ekranı shell iskeletini elle kopyalıyor |
| UID-16 | Detay ekranlarının aktivite sekmesi her kayıtta boş — `DB.activities` kod öneki kapsamı |
| UID-17 | Dokuz detay ekranı kendi `dl(pairs)` yardımcısını yazıyor → `GV.dl()` |
| UID-18 | `.cell-wrap` çok kolonlu tabloyu 1440px'de yatay kaydırmaya düşürüyor |
| UID-19 | Tablo toplam satırı için ortak sınıf yok |
| **VB-04** | `hakedis` alan adı rename'i (etiketler temizlendi, alanlar duruyor) |
| **VB-06** | Fatura ve tahsilat mutasyonları birbirini kapatmıyor |
| **VB-09** | `MOD-009` "Saha ekip yönetimi" — yasak inşaat terimi, VB-04 ile aynı turda |
| **VB-10** | Onay akışı yapılandırması hiçbir `DB.*` koleksiyonunda yok — `app-ayar-onay.html` ile form ekranı aynı eşik tablosunu **iki yerde** tutuyor |
| **VB-11** | `butceKodu` bir koleksiyona bağlı değil (`DB.budgets` yok) — yeni bütçe kodu forma girilemiyor |
| **UID-20** | Form ekranlarına **düzenleme modundan bağlantı yok**; iki modu da destekleyen form için ikinci mod erişilemez. Tüm formlar bitince tek turda bağlanacak |

---

## 6. ÇALIŞMA MODELİ

- **Orkestratör (ana Claude):** ortak katmanın **tek sahibi**. `assets/**`, `tasks/**`,
  `BUILT`, `SECTIONS`, `SEC_BY_ROLE`, QA, commit, push.
- **Subagent:** **tek bir HTML ekranı** yazar, başka hiçbir dosyaya dokunmaz. **Aynı anda en fazla 3.**
- Ajan raporlarındaki "eksik bileşen" / "veri çelişkisi" notları **ciddiye alınır** ama
  körü körüne alınmaz: her iddia **ölçülerek** doğrulanır.
- Arayüz sorunu görülürse **düzeltilmez**, `ui-debt.md`'ye yazılır.

## 7. BİLİNEN TUZAKLAR — `tasks/lessons.md` (L-01..L-18)
En sık ihlal edilen beşi: **L-12** (okunan koleksiyonun dosyası yüklü olmalı) ·
**L-13** (bağ yazılır, türetilmez) · **L-14** (etiket escape) · **L-15** (`GV.refresh`,
reload değil) · **L-16/L-18** (dinleyici birikmesi ve overlay). Hepsi brief dosyalarında yazılı.

**Genel ders — üç ikiz:**
"konsol temiz" ≠ "ekran doğru" (L-14) ·
"toast çıktı" ≠ "işlem oldu" (L-15) ·
**"test aracı TEMİZ dedi" ≠ "doğru şeyi ölçtü" (L-17).**
Üçü de ayrı ayrı yanılttı; üçü de ancak **beklenen sonucu önceden yazıp** karşılaştırınca çıktı.
