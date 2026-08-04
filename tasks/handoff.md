# Handoff — GaviaWorks CRM

> Bu dosya, **sıfırdan gelen bir Claude'un hiçbir şey sormadan** işe devam
> edebilmesi için yazıldı. Sırayla oku: bu dosya → `tasks/plan.md` → `tasks/components.md`
> → `tasks/lessons.md` → `tasks/ui-debt.md`.
>
> **İLK İŞ:** QA script'lerini kur (bölüm 4). Script'ler `tasks/qa/` altında **repoda
> izleniyor** — yeniden yazma, kopyala.
> **`tasks/detay-brief.md`** = detay ekranı subagent sözleşmesi. Yeni detay ekranı
> yazdıracaksan ajana **önce bunu okut**; prompt'ta yalnız ekrana özel kapsamı ver.
> **`tasks/ui-debt.md`** = arayüz + veri borç defteri. Üretim sırasında görülen sorunlar
> oraya yazılır, **o an düzeltilmez**; hepsi `plan.md` sonundaki
> **FAZ: UI ve UX KALİTE GEÇİŞİ** içinde ortak katmanda çözülür.

**Güncelleme:** 2026-08-04 (5. oturum sonu) · **100 ekran** · **21 detay ekranı**
**Ölçü:** 100 ekran · 46.994 satır · ortak katman 8.166 satır (css+js+veri)

---

## 1. BU OTURUMDA (5.) NE YAPILDI

### Üretilen 18 detay ekranı
```
SATIŞ     app-teklif-detay (7 sekme) · app-referans-detay (6) · app-onanaliz-detay (7)
MÜŞTERİ   —
PROJE     (kuyrukta: hata/test/teslim/değişiklik detayları)
GÖREV     app-istalebi-detay (6)
DESTEK    app-destek-detay (6)
PERSONEL  app-personel-detay (11) · app-izin-detay (6)
VARLIK    app-arac-detay (10) · app-demirbas-detay (6)
SATINALMA app-satinalma-detay (6) · app-tedarikci-detay (5) · app-siparis-detay (7)
FİNANS    app-sozlesme-detay (7) · app-fatura-detay (6) · app-tahsilat-detay (6)
DOKÜMAN   app-dokuman-detay (7)
TOPLANTI  app-toplanti-detay (7)
```

### Ortak katmanda çözülen GERÇEK hatalar (hepsi ölçülerek doğrulandı)

**1. `location.reload()` mutasyonu siliyordu — 9 ekran, 15 çağrı (ders L-15).**
Mock veri bellekte; reload script'leri baştan koşup değişikliği siliyordu. Ölçüm:
`SAT-2026-014` onay öncesi `Onay bekliyor adim:2`, onay + reload sonrası **yine aynı**.
**Hata kalıp ekranlarda doğmuştu** (`app-gorev-detay` 4 · `app-musteri-detay` 1 ·
`app-lead-detay` 2) ve altı yeni ekrana kopyalanmıştı.
Çözüm: **`GV.refresh()`** (shell.js) — `gv:ready`'yi yeniden tetikler.
`GV.pageHead` yeniden çağrılabilir hâle getirildi (önceden yalnız `#gvPageHead` yer
tutucusunu arıyor, ikinci çağrıda sessizce hiçbir şey yapmıyordu).

**2. `GV.refresh` dinleyici biriktiriyordu (ders L-16).** 1'in çözümü yeni hata sınıfı
açtı: `mount`/`document`e bağlı delege dinleyiciler ölmüyordu. Ölçüm: üç tazeleme →
tek tıklamada **3 modal**. Çözüm: `GV.refresh` mount düğümünü taze kopyayla değiştirir;
kalıcı düğümler için **`GV.on(el,type,fn,key)`** eklendi.
Regresyon testi `tasks/qa/listen.js` — **net** dinleyici sayar (çağrı saymak yanıltır).

**3. Etiket escape hatası ham HTML bastı (ders L-14).** `app-teklif-detay`'ın `dl()`
yardımcısı `dt`'yi escape ediyordu; para ekseni işareti `<span class="u-faint">(KDV
hariç)</span>` **ekranda yazı olarak** görünüyordu, beş etikette. Konsol temiz olduğu
için `qa.js` göremedi. Tarayıcı yazıldı: `tasks/qa/esc.js`.

**4. `GV.badge` ölü sözlük anahtarı.** `'Onay bekliyor '` (sonda boşluk) hiç eşleşmiyordu.
Silindi; `'Planlandı'` tekrarı da kaldırıldı. Sözlüğe 14 değer eklendi (NPS grupları,
muayene sonucu, poliçe yenileme, zimmet iadesi, teklif değerlendirme, sipariş teslim).

**5. Canonical: yönlendiren kartı türetilenden küçüktü.** 4. oturumda `toplamCiro`
düzeltilince üç yönlendirenin `ciro` alanı bozulmuştu (REF-007 kartta 680.000, tek
müşterisi 1.104.000). Ömür boyu sayaç modellenenden küçük **olamaz**. Düzeltildi,
`canon.js`'e **eksen 14** eklendi (445 kontrol).

**6. Yasak inşaat terimi ekranlarda yaşıyordu.** "hakediş" 8 ekranın etiketlerinde,
rail menüsünde ve bir ön analiz kaydının **kendi metninde** duruyordu. Tüm **görünen
etiketler** "Komisyon kazancı / Kazanç tarihi"ne çevrildi. **Alan adları** (`hakedis`,
`hakedisTarihi`) VB-04 olarak duruyor — rename tek turda yapılacak, canon'a dokunur.

### Veri sözleşmelerine yazılan eksenler (ders L-13 gereği)
| Alan | Eksen | Nasıl belirlendi |
|---|---|---|
| `purchases.tahminiMaliyet` | NET | Doğan siparişin `tutar`ı ile birebir (3/3) |
| `supplierQuotes.fiyat` | NET | Talep ve sipariş ile aynı eksende |
| `orders.tutar/vergi/toplam` | net/KDV/BRÜT | `toplam = tutar + vergi` |
| `suppliers.toplamTutar` | **NET** | Brüt olsaydı /1,2 tam liraya inerdi; 6'nın 3'ünde inmiyor. TDR-003: 126.000/3 = 42.000 = `SAT-2026-015` neti |
| `customers.bekleyenTahsilat` | **BRÜT** | Açık tahsilatların brüt toplamı, 12/12 doğrulandı |
| `analyses.maliyet` | **NET, indirim ÖNCESİ satış fiyatı** | Teklifin `araToplam`ı ile 3/3 eşleşti; net 1/3, brüt 0/3. İç maliyet **değil** |
| `capacity.izin` | **GÜN** (kartın kalanı saat) | 10/10 kayıtta gelecek izin günlerinin toplamı. Başlık yorumu "saat" diyordu, yanlıştı |
| `leaves.cakisma` | **proje takvimi** çakışması | IZN-2026-033'te `true` ama departmanda başka kimse yok. Personel çakışması tarihlerden **hesaplanır** |

---

## 2. ORTAK KATMAN — 5. OTURUMDA DEĞİŞENLER

### `assets/js/shell.js`
- **`GV.refresh()`** — mutasyon sonrası yeniden çizim. `location.reload()` **yasak**.
- **`GV.on(el, type, fn, key)`** — kalıcı düğüme tekil dinleyici.
- `GV.pageHead` artık kendi bastığı `.gv-page-head` bloğunu da değiştirir.
- BUILT 84 → 101 kayıt.
- Rail menüsü: "Komisyon Hakedişleri" → "Komisyon Kazançları".

### `assets/js/ui.js`
- TONE sözlüğü 111 → 124 anahtar, tekrar yok, sondaki boşluklu anahtar yok.

### `tasks/components.md`
- **§3 yeniden yazıldı:** detay ekranı da `buildSkeleton()` kullanır. `<body>`'ye yalnız
  `<div id="rec"></div>` konur. Elle `.gv-app` yazan **dört eski ekran UID-15**.
- §1'e `GV.refresh` ve `GV.on` satırları.
- §9b'ye altı yeni para ekseni.
- §10'a dört yeni QA script'i.

### `tasks/detay-brief.md` — YENİ
Detay ekranı subagent sözleşmesi. Ajan prompt'unda **ilk iş bunu okut**; ekrana özel
kapsamı prompt'ta ver. Prompt boyunu üçte bire indirdi ve L-12/L-14/L-15/L-16
tuzaklarının tekrarını kesti.

---

## 3. YENİ EKRAN EKLEME

### Detay ekranı
1. Ajana `tasks/detay-brief.md`'yi okut + ekrana özel kapsamı ver.
2. Gelen dosyayı `shell.js` **`BUILT`** dizisine ekle (tek yer; menü/`SEC_BY_ROLE`
   kayıtları 15 bölümün tamamı için zaten yazılı).
3. Hassas ekransa `SCREEN_PERM`'e de yaz.
4. QA: `qa.js` → `tabs.js` → `esc.js` → `mut.js` → `listen.js` (bölüm 4).
5. Dosya dosya stage → commit → push → `plan.md` işaretle (**aynı turn içinde**).

### Şablon
```html
<body data-sec="BÖLÜM" data-screen="EKRAN">
<div id="rec"></div>
<script src="assets/data/...js"></script>   <!-- okunan HER koleksiyonun dosyası -->
<script src="assets/js/shell.js"></script>
<script src="assets/js/ui.js"></script>
<script>
document.addEventListener('gv:ready', function(){ /* GV.pageHead + markup + GV.tabs */ });
</script></body>
```
`SECTIONS` anahtarları: `panel · satis · musteri · proje · gorev · destek · sohbet ·
personel · varlik · satinalma · finans · dokuman · toplanti · rapor · ayarlar`
(**`proje`**, `projeler` değil — 4. oturumda üç ajanı birden yanılttı).

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
> script'ini scratchpad köküne `qa.js` adıyla yazıp orkestratörünkini ezdi ve QA sonucu
> geçersiz çıktı. Orkestratör scratchpad kökünden **hiçbir script çalıştırmaz.**

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
node listen.js "app-x.html"       # dinleyici birikiyor mu (L-16)
node canon.js                     # 14 canonical eksen → "TEMİZ — 445 kontrol"
node dbref.js                     # yüklenmeyen veri dosyası (L-12)
node links.js                     # kırık hedef + BUILT + üretilmemiş hedef kuyruğu
node gate.js                      # tüm ekranlar × 5 rol
node grip-qa.js                   # rail tutamağı (UID-01 regresyonu)

# Canlı doğrulama (push sonrası ~1-2 dk)
curl -s -o /dev/null -w "%{http_code}\n" https://gaviaworks-dev.github.io/gaviaworks-crm/app-x.html
```

**Commit:** `git add -A` **yasak**, dosya adıyla tek tek. Conventional Commits, İngilizce.
`gh auth switch --user gaviaworks-dev` gerekebilir. Commit sonu:
```
Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_01AFZ22KYDzKSD4GXaoq6gpi
```

---

## 5. SIRADAKİ İŞ

`node links.js` çıktısındaki "henüz üretilmemiş hedefler" **canlı kuyruktur** — elle
sayma. Bu oturum sonunda **42 hedef** bekliyordu (5. oturum başında 59'du).

### Kuyruk (öncelik sırasıyla)
1. **Kalan detay ekranları (4):** `proje-degisiklik-detay` · `proje-test-detay` ·
   `duyuru-detay` · (`proje-hata-detay` · `proje-teslim-detay` · `komisyon-detay`
   5. oturum sonunda ajanlardaydı — `links.js` ile teyit et, yoksa yeniden yazdır).
2. **Form ekranları — kuyruğun en kalabalık (~35) ve en şablonlaşabilir bölümü.**
   ✅ **`GV.form` GERÇEKTEN VAR** (`ui.js`) ve üç ekran onu çalışır hâlde kullanıyor:
   `app-ayar-profil.html` · `app-ayar-sirket.html` · `app-panel-duyurular.html`.
   Desen referansı olarak bunlardan birini ver.
   **Form ekranları için `tasks/detay-brief.md` gibi bir `form-brief.md` yaz** — detay
   brief'i prompt boyunu üçte bire indirdi ve tekrar eden hataları kesti, aynısı formda
   da gerekli. Formda ek olarak: kaydetmeden çıkışta uyarı · ilk hatalı alana odak ·
   mutasyon sonrası `GV.refresh()` **değil**, listeye dönüş.
3. **Wave 13 kapanış:** `data-wip` süpürmesi · §22'deki 38 modüller arası bağlantının
   doğrulanması · canonical tarama · 1440/768/390 tam tarama · kapanış raporu.
4. **FAZ: UI ve UX KALİTE GEÇİŞİ** — `ui-debt.md`'de **17 UID + 7 VB**.
   **Ekran üretimi bitmeden bu faza başlanmaz.**

### Açık borçlar — özeti (tamamı `tasks/ui-debt.md`'de)
| # | Konu |
|---|---|
| UID-02..14 | mobil satır aksiyonu · kare thumbnail · `GV.upload` File · `scope('gor')` · sayaç global · toplu çıktı · kontrol/etiket boşluğu · native kontroller · yan panel başlığı · KPI ₺0 · "Tümü" sekmesi · `bulk[].show` · detay tablosu ≤760px |
| **UID-15** | Dört eski detay ekranı shell iskeletini elle kopyalıyor (`aria-controls` düşüyor, `GV.pageHead` çalışmıyor) |
| **UID-16** | Detay ekranlarının aktivite sekmesi her kayıtta boş — `DB.activities` yalnız `GRV/LEAD/MUS/PRJ` önekleri taşıyor |
| **UID-17** | Dokuz detay ekranı kendi `dl(pairs)` yardımcısını yazıyor → `GV.dl()` ortak katmana |
| **VB-04** | `hakedis` alan adı rename'i (etiketler temizlendi, alanlar duruyor) |
| **VB-05** | Destek talebi → görev/hata/değişiklik bağ alanı yok |
| **VB-06** | Fatura ve tahsilat mutasyonları birbirini kapatmıyor |
| **VB-07** | Sipariş → demirbaş aktarım bağı yok |

---

## 6. ÇALIŞMA MODELİ

- **Orkestratör (ana Claude):** ortak katmanın **tek sahibi**. `assets/**`, `tasks/**`,
  `BUILT`, `SECTIONS`, `SEC_BY_ROLE`, QA, commit, push.
- **Subagent:** **tek bir HTML ekranı** yazar, başka hiçbir dosyaya dokunmaz.
  **Aynı anda en fazla 3.**
- Ajan raporlarındaki "eksik bileşen" / "veri çelişkisi" notları **ciddiye alınır** —
  bu oturumda **altı gerçek ortak katman hatası** ve **sekiz veri ekseni** bu yolla bulundu.
  Ama körü körüne de alınmaz: her iddia ölçülerek doğrulandı, biri (`toplamTutar` brüt mü)
  ancak ölçümle karara bağlandı.
- Arayüz sorunu görülürse **düzeltilmez**, `ui-debt.md`'ye yazılır.

## 7. BİLİNEN TUZAKLAR — `tasks/lessons.md` (L-01..L-16)
En sık ihlal edilen dördü: **L-12** (okunan koleksiyonun dosyası yüklü olmalı) ·
**L-14** (etiket escape) · **L-15** (`GV.refresh`, reload değil) · **L-16** (dinleyici
birikmesi). Dördü de `tasks/detay-brief.md`'de yazılı — ajana onu okutmak yeterli.

**Genel ders:** "konsol temiz" ile "ekran doğru" **aynı şey değildir**, ve
"toast çıktı" ile "işlem oldu" da değildir. İkisi de bu oturumda ayrı ayrı yanılttı.
