# Handoff — GaviaWorks CRM

> Sıfırdan gelen bir Claude'un **hiçbir şey sormadan** devam etmesi için yazıldı.
> Sırayla oku: bu dosya → `tasks/plan.md` → `tasks/ui-debt.md` → `tasks/lessons.md` → `tasks/components.md`.
> **PROMPT.md'yi baştan sona OKUMA** — yalnız ihtiyaç duyduğun bölümü aç.

**Güncelleme:** 2026-08-06, **11. oturum sonu** · **142 ekran** · 26 detay · 36 form · dal `main`
**plan.md:** **276 / 297 madde tamam (%92)** · **21 kısmen** · **0 açık**
**Çalışma ağacı temiz, her şey push edilmiş.**

---

## 1. TEK KALAN İŞ — 21 `[~]` maddenin üç kovaya ayrılması

`plan.md`'de **açık madde yok**. Kalan 21 madde `[~]` (kısmen) işaretli ve hepsinin
yanında ne yapıldığı yazılı. Sıradaki oturumun **tek işi** bunları üç kovaya ayırmak:

| Kova | Ne demek | Ne yapılır |
|---|---|---|
| **(A) Prototipte kapanabilir** | Eksik olan küçük bir şey | KAPAT, ölç, `[x]` işaretle |
| **(B) Backend gerektirir** | Gerçek e-posta, dosya yükleme, oturum, ödeme, entegrasyon | `plan.md` **paydasından çıkar**, dosya sonunda **"V2 — BACKEND GEREKTİRİR"** başlığına taşı; her biri için neyin gerektiğini tek cümleyle yaz |
| **(C) Bilinçle kapsam dışı** | Karar zaten verilmiş (ayna alan yasağı gibi) | **"KAPSAM DIŞI — karar kaydı"** olarak işaretle, gerekçenin nerede yazılı olduğunu göster |

> **Kova kararını TAHMİNLE VERME** — her madde için ilgili ekrana ya da veriye bak.
> **Şüphedeysen (A) değil (B) seç**; yalan kapatmaktansa dürüst ertelemek iyidir.
> Sonra `plan.md`'yi yeniden hesapla: payda yalnız bu projede kapanabilir maddelerden
> oluşsun, başlık satırı gerçek sonucu göstersin.

### 21 maddenin tam listesi — sonraki oturum aramasın

`plan.md` satır numaralarıyla. Dosya değiştikçe kayar; tazelemek için:
`grep -n '^- \[~\]' tasks/plan.md`

| # | Satır | Bölüm | Madde | İlk bakış |
|---|---|---|---|---|
| 1 | 57 | B. ROLLER | Erişim seviyeleri — `scope('gor')` satır kapsamı | (A/C) UID-05 kapandı; `kendi`+`departman` çalışıyor, `musteri` kapsamı → V2-03 |
| 2 | 129 | Wave 2 | Ön analiz **10 çıktı** bekliyor (§10) | (?) çıktı `GV.list export` şeridinden geliyor; "10 ayrı rapor" ayrı iş |
| 3 | 161 | Wave 5 | Görev listesi **takvim görünümü yok** (3/4) | (A) `views:['calendar']` yok; takvim ekseni `app-ajanda`'da var |
| 4 | 166 | Wave 5 | Görev formu — **kontrol listesi koleksiyonu yok** | (A) `DB.subtasks` var, ayrı `checklist_item` yok |
| 5 | 200 | Wave 7 | Zimmet — **tutanak · dijital onay · fotoğraf · hasar** adımları yok | (B) dijital onay ve fotoğraf yükleme backend ister |
| 6 | 214 | Wave 8 | Sipariş — **eksik/kısmi teslim ve iade alanı yok** | (A) veri alanı işi |
| 7 | 243 | Wave 10 | Doküman **versiyon geçmişi + onay zinciri koleksiyonu yok** | (B) versiyonlama gerçek dosya deposu ister |
| 8 | 394 | E. VERİ MODELİ | `checklist_item` koleksiyonu yok | 4 ile aynı |
| 9 | 395 | E. VERİ MODELİ | `trainings` yetkinlik · işe giriş/çıkış koleksiyonu | **METİN ESKİMİŞ** — ikisi de 11. oturumda yapıldı |
| 10 | 398 | E. VERİ MODELİ | siparişte eksik/kısmi teslim ve iade alanı yok | 6 ile aynı |
| 11 | 401 | E. VERİ MODELİ | doküman versiyon geçmişi + onay zinciri | 7 ile aynı |
| 12 | 416 | F. İŞ AKIŞLARI | **Proje açılış formu yok** | (A) form ekranı işi |
| 13 | 424 | F. İŞ AKIŞLARI | "İzin talep formu bekliyor" | **METİN ESKİMİŞ?** `app-izin-form.html` var, doğrula |
| 14 | 427 | F. İŞ AKIŞLARI | Demirbaş zimmeti — tutanak/dijital onay/fotoğraf | 5 ile aynı (B) |
| 15 | 428 | F. İŞ AKIŞLARI | Araç zimmeti — aynı eksik adımlar | 5 ile aynı (B) |
| 16 | 464 | H. KABUL | Görsel uyum — "kalan hizalama/boşluk/kontrast" | **METİN ESKİMİŞ** — kontrast ve boşluk 11. oturumda ölçülüp kapandı |
| 17 | 476 | H. KABUL | "satır kapsamı uygulanmıyor" | **METİN ESKİMİŞ** — UID-05 kapandı |
| 18 | 481 | H. KABUL | "mobilde satır aksiyonu yok · detay tablosu gizli" | **METİN ESKİMİŞ** — UID-02 ve UID-14 kapandı |
| 19 | 484 | H. KABUL | "formlar üretilmeden ölçülemez" | **METİN ESKİMİŞ** — 36 form üretildi |
| 20 | 582 | FAZ Kapsam A | **UID-26** `GV.list` kilidi | (C) gerekçe V2-01'de yazılı |
| 21 | 635 | FAZ Kapsam B | **Hizalama ve optik denge** | (C) göz kararı → V2-02 |

> ### ⚠️ ÖNCE METNİ GERÇEĞE HİZALA
> **Altı maddenin metni eskimiş (9 · 13 · 16 · 17 · 18 · 19).** 11. oturumda kapatılan
> işler bu satırlara işlenmedi. Kova ayırmadan önce metni düzelt, sonra karar ver —
> yoksa kapanmış işi yeniden yapmaya kalkarsın. Aynı şey 9. oturumda da olmuştu:
> defter 12 madde boyunca ekranların gerisinde kalmıştı.

---

## 2. SON DOĞRULAMA — tarama seti, tek turda (11. oturum sonu)

19 script koşuldu. Her satırda taranan ekran ve gerçekten yüklenen kayıt ayrı
yazılıdır (ders **L-19**).

| Eksen | Ne sorar | Taranan ekran | Ölçülen birim | Sonuç |
|---|---|---|---|---|
| `rec.js` | Tarama hedefi gerçek bir kayıt açıyor mu | 62 | 62/62 hedef doğrulandı | ✅ TEMİZ |
| `canon.js` | 24 canonical eksen tutarlı mı | — (veri) | **2.588 kontrol** | ✅ TEMİZ |
| `dbref.js` | Okunan koleksiyonun dosyası yüklü mü (L-12) | **142** | — | ✅ TEMİZ |
| `links.js` | Kırık hedef · hayalet BUILT · yetim ekran | **142** | 143 BUILT kaydı | ✅ TEMİZ |
| `esc.js` | Etikette ham HTML var mı (L-14) | **142** | 62/62 kayıt | ✅ TEMİZ |
| `tabs.js` | Detay sekmeleri açılıyor mu | 26 | 26/26 kayıt · **223 tıklama** | ✅ TEMİZ |
| `mut.js` | `GV.refresh` idempotent mi (L-15) | 62 | 62/62 kayıt | ✅ TEMİZ |
| `listen.js` | Dinleyici birikiyor mu (L-16) | 62 | 62/62 kayıt | ✅ TEMİZ |
| `akt.js` | Detay ekranının aktivite sekmesi dolu mu | 26 | 26/26 kayıt · **183 hareket** | ✅ TEMİZ |
| `bag.js` | §22 bağı ekranda görünüyor mu | 3 | 12 vaka · 12/12 kayıt | ✅ TEMİZ |
| `pers.js` | Kod ekranda adın yerine geçiyor mu | 9 | 18 vaka · 6/6 kayıt | ✅ TEMİZ |
| `ctl.js` | Kontrol–etiket boşluğu · native kontrol | **142** | panel · çift · select · 203 tarih alanı | ✅ TEMİZ |
| `grip-qa.js` | Rail tutamağı geometrisi (L-09) | 1 | tüm ölçümler | ✅ TEMİZ |
| `swtest.js` | Anahtar kontrolü görünür mü | 1 | 40×24 px | ✅ TEMİZ |
| `act.js` | Bu buton gerçekten bir şey yapıyor mu (L-23) | **142** | **209 aksiyon** | ✅ TEMİZ |
| `qa.js` | 1440/768/390 konsol · taşma · sahte link | **142** | 3 kırılım | ✅ TEMİZ |
| `gate.js` | Her ekran × 5 rol (L-07) | **142** | **710 sayfa yüklemesi** | ✅ TEMİZ |
| `xport.js` | Çıktı ekrandaki bilgiyi taşıyor mu | **142** | **tamamen taşımayan kolon 0** · 17 kısmi / 16 ekran · 54 hücre (%0,8) | ⚠️ aşağıya bak |
| `denetim.js` | Kapsam B sistem denetimi (**tek seferlik**, scratchpad) | **142** | boşluk 0 · başlıksız boş durum 0 · AA altı kontrast 0 · dokunmatik hedef 0 | ✅ TEMİZ |

**142'nin altında tarayan script ve sebebi (L-24):** `tabs.js` ve `akt.js` yalnız
**detay** ekranlarını gezer (26) · `mut.js` / `listen.js` yalnız `rec.js`'in doğruladığı
**62 kayıtlı hedefi** gezer (mutasyon ve dinleyici ancak gerçek kayıtta ölçülür) ·
`bag.js` (3) ve `pers.js` (9) belirli bir sözleşmeyi ölçen **vaka testleridir** ·
`grip-qa` / `swtest` tek bileşenlik nokta testleridir.

### `xport.js` neden "EKSİK" diyor — ve bu neden hata değil

**Tamamen taşımayan kolon 0.** 17 kolon "kısmi": ekranda dolu, çıktıda boş **54 hücre
(%0,8)**. 10. oturumda bu sınıfın tamamı tek tek incelenmişti (o zaman 47 hücre) ve
**hepsi aynı çıkmıştı**: veri alanı boş ya da `'—'` iken ekranın **yer tutucu metin**
basması (`Zimmetsiz` · `Süresiz` · `Proje dışı` · `Tercih bekliyor` · `Vekil yok`).
Çıktı bilgi kaybetmiyor, yalnız yer tutucu yerine boş hücre yazıyor — **CSV/Excel için
doğru olan da budur.** Sayı 47 → 54'e çıktı çünkü 11. oturumda yeni kayıtlar ve bir yeni
ekran eklendi. Script bu sınıfı ayırt edemediği için "EKSİK" damgası basıyor; karar
`ui-debt.md` **UID-07 kapanış kaydında** yazılı. Sıradaki oturum ya kabul eder ya
sınıfı script'e öğretir.

### Tarama nasıl koşulur

```bash
SP=<scratchpad>
cd $SP && npm init -y && npm i playwright@1.62.1
mkdir -p $SP/qa-run && cp <repo>/tasks/qa/*.js $SP/qa-run/
ln -sfn $SP/node_modules $SP/qa-run/node_modules

cd <repo> && nohup python3 -c "
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
ThreadingHTTPServer(('127.0.0.1',8791), SimpleHTTPRequestHandler).serve_forever()" &

cd $SP/qa-run
node rec.js                    # ÖNCE BU — qa-targets.json (62 hedef) · L-19
node canon.js; node dbref.js; node links.js          # playwright GEREKMEZ
node esc.js; node tabs.js; node mut.js; node listen.js
node akt.js; node bag.js; node pers.js
node swtest.js; node grip-qa.js; node ctl.js; node xport.js; node act.js
node qa.js "$(ls <repo>/app-*.html | xargs -n1 basename | tr '\n' ',')"
node gate.js
```

**Süre:** `act.js` ~25 dk · `qa.js` ~20 dk · `ctl.js` ~12 dk · `gate.js` ~10 dk.

> **Uzun taramayı `nohup <script> &` ile MÜSTAKİL başlat.** Bu oturumda iki kez
> `{ ...; } > dosya &` bloğu yarıda öldü ve yalnız ilk başlığı yazdı.
> **Bekleme kurarken `pgrep -f "node qa.js"` KULLANMA** — bekleyici kabuğun kendi
> komut satırı desene uyuyor, döngü hiç bitmiyor. `pgrep -x node` kullan.
> **Tarama koşarken repo dosyası DEĞİŞTİRME**: bu oturumda bir `mut.js` koşumu
> eşzamanlı düzenlemeye denk geldi ve "2 ekran sorunlu" dedi; düzeltmeden sonraki
> temiz koşum 62 ekranın 62'sinde temiz çıktı.

---

## 3. 11. OTURUMDA NE YAPILDI

### Kapanan borç kayıtları

| Kod | Ne çözüldü | Ölçüm |
|---|---|---|
| **VB-28** | §22 bağ kapsamı | `canon.js` eksen **21**: 14 bağın 14'ü ≥1 kayıtta dolu · `bag.js` 12 vaka |
| **UID-16** | Detay ekranı aktivite kapsamı | `DB.activities` **8 → 192 kayıt**, 4 → **73 kayıt kodu**; aktivitesi olan detay ekranı **4/26 → 26/26** |
| **VB-12 · VB-13** | Kişi kimliği ekseni | 3 alan koda çevrildi · `GV.session.ad`→`.emp` **154 yazım / 62 dosya** · ad kaskadı silindi · `referrers.kontak` açıldı |
| **VB-04 · VB-16** | Alan adı rename | **145 kullanım / 9 dosya**; `hakedis`→`komisyonToplam` · `hakedisTarihi`→`kazanimTarihi` · `maliyet`→`tahminiBedel`; yasak terim taraması **0** |
| **UID-02** | Mobil satır aksiyonu | 390 px'te 4 ekranda 36 kart · 108 buton · 44 px altı **0** |
| **UID-03** | `.gv-thumb` kare görsel | logo önizlemesi inline stilden kurtuldu (80×80, cover/center) |
| **UID-04** | `GV.upload` `onFile` + `preview` | ekrandaki capture fazlı dinleyici silindi |
| **UID-05** | `GV.list` `scopeField` | `app-gorev` `frontend` **5/25** · `depmudur` **0/25** · `sahip` 25 |
| **UID-06** | `countTarget` | ikinci liste örneği sayacı ezmiyor |
| **UID-10** | Yan panel ayrımı + para birimi + filtre sayacı | "Uygula (1)" canlı sayaç ölçüldü |
| **UID-13** | `bulk[].show` / `perm` | `app-proje-teslim`: `sahip` 4 madde, `qa` **2** |
| **UID-14** | Detay tablosu ≤760px | 4 ekranda 35 tablonun 35'i görünür; liste ekranlarında hâlâ gizli |
| **UID-15** | Elle shell iskeleti | **13/13** ekranda `aria-controls="gvMenu"` geri geldi |
| **UID-17** | `GV.dl` | **60 ekranın** yerel `dl()` kopyası silindi; 62 hedefte 1.878 `dt` |
| **UID-19** | `.gtable tfoot` / `tr.is-total` | ortak kural yazıldı |
| **UID-26** | `GV.list` kilidi | **kısmen** — dönüş yüzeyine alındı; bağımsız bileşen V2-01 |
| **Kapsam B (10 madde)** | Sistem geneli denetimler | AA altı kontrast **279 metinde 0** · dokunmatik **245 hedefte 0** |
| **3 özellik boşluğu** | Zamanlayıcı · yetkinlik ekseni · işe giriş/çıkış | üçü de üretildi ve ölçüldü |

### Üretilen yeni parçalar

| Dosya / API | Ne için |
|---|---|
| `DB.contact` · `DB.contactName` · `DB.referrer` · `DB.interactionContact` (`crm.js`) | Kişi kimliği çözümü tek yerde (VB-12) |
| `DB.onboarding` (`hr.js`) + `app-personel-giris.html` + menü kaydı | İşe giriş/çıkış — ilerleme ve durum **adımlardan türetilir** |
| `DB.trainings[].kazanim` | Yetkinlik ekseni; `DB.employees[].yetkinlik` ile aynı sözlük |
| `GV.dl(pairs, opts)` | Alan listesi (UID-17) |
| `GV.list` → `scopeField` · `countTarget` · `bulk[].show/perm` · `openCols/openFilters/openExport/setView` | UID-05 · 06 · 13 · 26 |
| `GV.upload` → `onFile(file, meta)` · `preview` | UID-04 |
| `GV.drawer` → `onMount(gövde, panel)` | UID-10 filtre sayacı |
| `.gv-thumb` · `.gtable tfoot`/`tr.is-total` · `.gv-mrow-acts` · `.gv-scopebar` · `.gv-checklist` | UID-03 · 19 · 02 · 05 |
| `--ok-ink` · `--warn-ink` · `--danger-ink` … · koyulaştırılan `--muted` / `--faint` | WCAG AA |
| `tasks/qa/akt.js` · `bag.js` · `pers.js` | Yeni kalıcı eksenler (set **19 script** oldu) |

### Yazılan dersler — `tasks/lessons.md`

- **L-28 · Borç kaydının kendi kapsamı da ölçülmeden güvenilmez.** Kapatılan beş borcun
  **beşinde de** defterdeki kapsam yanlıştı; ilk dördü aynı yönde (eksik) —
  UID-16 5→**22** · UID-17 9→**60** · VB-04 111→**145** · VB-12 2→**3**. Beşincisi ters
  yöndeydi: VB-28'in "yok" dediği üç bağın **ikisi vardı**, ama kayıt onları yalnız
  *hedef* koleksiyonda aramıştı. → *Bir bağ "yok" denmeden önce iki yönde de aranır.*
- **L-29 · Ölçüm aracı üç ayrı şekilde yanılabilir:** yanlış yerden okuma (`innerText`
  gizli paneli görmez) · fazla katı hüküm (meşru kod gösterimini ihlal sayma) ·
  tarayıcı davranışını yanlış modelleme (programatik `.focus()` `:focus-visible`
  tetiklemez → **8.188 sahte ihlal**).

### Kapsam dondurma kararı

11. oturumda kapsam **donduruldu**: her yeni ölçüm ekseni yeni borç buluyor, borç deftere
giriyor ve payda büyüyordu — dört oturum boyunca %81'de sabit kalmasının sebebi buydu.

- **Yeni tarama ekseni yazılmaz** (set 19 script'te dondu).
- **`plan.md`'ye yeni madde eklenmez** (payda 297'de dondu).
- Yeni bulgu `ui-debt.md`'nin **sonundaki** `# V2 — DONDURULMUŞ KAPSAM DIŞI` başlığına
  yazılır, yüzdeye katılmaz. **Şu an orada 5 kayıt var: V2-01 … V2-05**
  (dosyanın **1909. satırından** itibaren).

| V2 | Konu | Neden ertelendi |
|---|---|---|
| V2-01 | `GV.list` yordamlarının bağımsız bileşene ayrıştırılması | Dördü de liste `state`i üzerinde çalışıyor; belirtileri başka yollarla kapandı |
| V2-02 | "Hizalama ve optik denge" | Göz kararı, otomatik eksene bağlanamadı |
| V2-03 | `musteri` satır kapsamı | `GV.session` personelden kuruluyor, müşteri kimliği oturumda yok |
| V2-04 | Yetkinlik kuralının tarama ekseni | Kapsam donduğu için eksen yazılmadı; kural V2-04'te yazılı |
| V2-05 | İşe çıkış (offboarding) kaydı | Veride ayrılmış personel yok; uydurmak olmayan bir ayrılışı göstermek olurdu (L-13) |

---

## 4. YÖNTEM — DEĞİŞMEZ KURALLAR

- **Orkestratör ortak katmanın tek sahibi:** `assets/**` · `tasks/**` · `docs/**` ·
  QA · commit · push. **Ajan commit atmaz, plan.md yazmaz.**
- **Dalga tavanı DÖRT ajan** (L-20). Tek bekleme kur, topla; yoklama döngüsü yasak.
- **Ajan raporundaki her iddia ölçülerek doğrulanır** — bu oturumda dört ajanın ürettiği
  176 aktivite kaydının 176'sı tek tek denetlendi (kod gerçek mi · kişi gerçek mi ·
  tarih yaşam döngüsüne uyuyor mu · yasak terim var mı).
- **Kendi ölçüm aracına da güvenme** (L-17 · L-24 · L-26 · **L-29**). Bu oturumda açılan
  her eksen, koşturulmadan önce en az bir **olumlu** ve bir **olumsuz** vakayla sınandı;
  olumsuz vakalar repo'ya değil `scratchpad`'deki kopyaya uygulandı.
- **Tarama koşarken repo dosyası DEĞİŞTİRME.**
- **Ayrı concern = ayrı commit.** Commit öncesi `git diff --cached --name-only` doğrulanır.
  `git add -A` yasak, `--no-verify` yasak.
- **Her madde bitince `plan.md` aynı turn içinde işaretlenir**, ilerleme
  `grep -c '^- \[x\]'` ile yeniden **sayılır** (elle yazılmaz).

**Commit sonu:**
```
Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_011mHnmKsGuQJkAgDtka3LnF
```

---

## 5. DEFTERLER NEREDE

| Dosya | İçerik |
|---|---|
| `tasks/plan.md` | Kapsam listesi ve ilerleme — **işin bitiş tanımı** |
| `tasks/ui-debt.md` | Borç defteri · sonunda **V2 — DONDURULMUŞ KAPSAM DIŞI** (satır 1909+) |
| `tasks/lessons.md` | **29 ders** (L-01 … L-29) |
| `tasks/components.md` | Ortak bileşen sözlüğü — **tek doğru kaynak** |
| `tasks/assumptions.md` | 41 varsayım, gerekçeleriyle (V-01 … V-41) |
| `tasks/qa/` | **19 tarama script'i** — repoda izleniyor, yeniden yazma, kopyala |
| `tasks/form-brief.md` · `tasks/detay-brief.md` | Form ve detay ekranı sözleşmeleri |
| `docs/N-kapanis-raporu.md` | Kapanış raporu — **10. oturum verileriyle, GÜNCELLENMEDİ** |

> **`docs/N-kapanis-raporu.md` eskimiştir:** 141 ekran / 14 eksen / 672 canon kontrolü
> yazıyor; bugünkü gerçek **142 ekran / 19 eksen / 2.588 kontrol**. Kova ayrımı bitince
> bu raporun yenilenmesi gerekiyor — yukarıdaki **bölüm 2** tablosu doğrudan kullanılabilir.
