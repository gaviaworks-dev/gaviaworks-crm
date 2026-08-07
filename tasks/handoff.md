# Handoff — GaviaWorks CRM

## 🔵 AÇIK TUR — REVİZE TURU (13. oturum, 2026-08-07'de başladı)

İlk kapsam (`plan.md`, 295/295) **kapandı ve kapalı kalıyor**. Beyar 2026-08-07'de
**ayrı bir revize turu** açtı; bu tur kendi defterinde yürür:

| Dosya | Rolü |
|---|---|
| `tasks/revize-talimati.md` | **Bu turun tek doğruluk kaynağı** — Beyar'ın 20 maddelik talimatı, dört faz |
| `tasks/revize-plan.md` | Bu turun defteri — 20 maddenin **ölçülmüş** durumu, karar kayıtları, yapılacaklar |

**`plan.md`'ye dokunulmaz.** O defter 295/295 ile kapandı; revize turunun maddeleri
oraya eklenmez, yüzdesi bozulmaz.

**Turun durumu (13. oturum sonu, 2026-08-07):**

| Adım | Durum |
|---|---|
| Adım 0 — talimatı repoya al | ✅ `tasks/revize-talimati.md` |
| Adım 1 — ölç + defter yaz | ✅ 20 maddenin 20'si ölçüldü · `tasks/revize-plan.md` |
| **FAZ 1 · R01** görev durumlarını sadeleştir | ✅ **TAMAM** |
| **FAZ 1 · R02** görev geçiş algoritması | ✅ **TAMAM** (iki küçük kuyruk maddesi açık, plana yazıldı) |
| **FAZ 1 · R03** timesheet → gerçekleşen süre | 🟡 **görev düzeyi tamam**, proje düzeyi açık |
| **FAZ 1 · R04** timesheet + gider → gerçek maliyet | ⬜ açık |
| FAZ 2 · 3 · 4 | ⬜ açık — ölçümleri plana yazılı, uygulama başlamadı |

**Tarama:** `canon.js` **2.929 kontrol · TEMİZ** (turun başında 2.588 · 24 eksen →
şimdi **26 eksen**). Yeni: **25** görev durumu/geçiş/bekleme · **26** zaman defteri
↔ görev emeği. İkisi de kasıtlı bozulmuş bir kopyayla sınandı (L-24/L-27),
scratchpad'de, repo dosyasına dokunulmadan.

### Sıradaki oturum ne yapacak — sırayla

**1. R03'ün proje ucu.** Alt uç (görev ↔ defter) kapandı; üst uç açık.
   - `GV.zaman.onayla(timesheetKod)` → `domain.js`. **Bugün haftalık timesheet
     onaylanınca alttaki `DB.timelogs[].onay` DEĞİŞMİYOR** (`app-zaman-onay.html:136`
     yalnız `t.durum` yazıyor). Yani "onaylı zaman kaydı" iki farklı şey demek.
     Tek onay ekseni kurulacak.
   - `GV.proje.sure(kod)` → `{ planlanan, gerceklesen, faturalanabilir }`.
   - Proje kartında üç değer (`app-proje.html:55` `kpis[]` — **yeni kart açılmaz**).
   - `app-proje-detay.html:568` `faturalanabilirSaat` **tüm** kayıtları topluyor,
     onaylı eksene çekilecek. `app-rapor-proje.html:702` açıklaması da düzelecek.
   - `harcananSure` formdan kalkacak (`app-proje-form.html:559-560`); alan **kalır**,
     beyan olarak — gerekçe **V-44**, canon eksen 26c `beyan ≥ defter` diyor.

**2. R04.** `DB.employees[].icMaliyetSaat` (16/16) — ⚠️ `saatlikUcret`i doldurma:
   `app-personel-form.html:146` `maas > 0` **XOR** `saatlikUcret > 0` kuralını
   uyguluyor, kırarsın. Ayrı eksen aç. Katsayı `DB.company`'de yazılı sabit olsun.
   Sonra `GV.proje.maliyet()` ve canon ekseni.

**3. FAZ 2**'ye geç (R05 → R06 → R07 → R08 → R09 → R10).

### Bu turda öğrenilen, tekrar etmemesi gereken üç şey

1. **`domain.js` yedi ekranın hiçbirinde yüklü değildi.** `GV.task`/`GV.fin`
   çağıran bir ekran `<script src="assets/js/domain.js">` taşımak zorunda —
   yoksa tıklama anında patlar, **açılışta değil**, yani açılışa bakan QA görmez.
   Yeni ekran `GV.*` domain yordamı çağıracaksa **önce script etiketi**.
   (L-12'nin `GV.*` tarafındaki ikizi. Denetim tek satır:
   `for f in app-*.html; do grep -q "GV\.\(fin\|delivery\|task\)\." $f && ! grep -q domain.js $f && echo $f; done`)
2. **`GV.badge` ton haritası düz bir isim alanıdır.** Bir görev durumunu silerken
   aynı adı kullanan **her koleksiyon** aranır. `Revize bekliyor`'u sildim, haftalık
   timesheet reddi o değere düşüyordu ve rozet griye indi. Geri kondu.
3. **Ekran metni ile menü etiketi ayrı yerlerde yaşıyor.** Liste sekmesi
   "Kontroldekiler" olunca `shell.js:70` "Kontrol Bekleyenler" kaldı.

### Ölçüm kaynağı

> ⚠️ **`docs/G-veri-modeli.md` BAYAT** — tek commit'te yazıldı, sonra veri büyüdü.
> `projects n=8` diyor, gerçek **14**; `tasks n=25` → **26**; `activities n=8` →
> **200**; `timelogs n=45` → **53**. **Ölçüm kaynağı canlı veridir** (→ L-30).

> ⚠️ **V2-03 ("`musteri` kapsamı backend ister") ölçümle yanlışlandı.** `GV.list`
> `musteri` kapsamını zaten uyguluyor (`ui.js:600`); eksik olan `permMatrix.musteri.gor`
> değeri (bugün `'kendi'`, `'musteri'` olmalı) ve `buildSession`'daki müşteri alanı —
> ikisi de arayüz tarafı. R13'te kapatılacak (gerekçe `revize-plan.md` §G-2).

> ⚠️ **`docs/G-veri-modeli.md` BAYAT** — tek commit'te yazıldı, sonra veri büyüdü.
> `projects n=8` diyor, gerçek **14**; `tasks n=25` diyor, gerçek **26**;
> `activities n=8` diyor, gerçek **192**. **Ölçüm kaynağı canlı veridir.**

> ⚠️ **V2-03 ("`musteri` kapsamı backend ister") ölçümle yanlışlandı.** `GV.list`
> `musteri` kapsamını zaten uyguluyor (`ui.js:600`); eksik olan `permMatrix.musteri.gor`
> değeri ve `buildSession`'daki müşteri alanı — ikisi de arayüz tarafı.
> Bu turda kapatılacak (gerekçe `revize-plan.md` §G-2).

---

## İlk kapsamın kapanış kaydı

**Güncelleme:** 2026-08-06, **12. oturum sonu** · dal `main` · çalışma ağacı temiz, her şey push edildi.

| | |
|---|---|
| **plan.md** | **295 / 295 madde tamam (%100)** · 0 kısmen · 0 açık · 2 kapsam dışı |
| **Ekran** | 142 (26 detay · 36 form · 1 giriş) |
| **Tarama** | 19 eksenin 19'u temiz · 142 ekran · 710 rol yüklemesi · 2.588 canonical kontrol |
| **Kapanış raporu** | `docs/N-kapanis-raporu.md` — güncel, 12. oturum verileriyle |

> Bu bölüm **ilk kapsamın** kapanış belgesidir: projenin nasıl koşulacağını,
> tarama setinin nasıl çalıştırılacağını ve nerede durduğunu anlatır.
> Revize turunda da geçerlidir — aşağıdaki bütün kurallar aynen uygulanır.

---

## 1. Nasıl koşulur

Build yok, npm yok, bağımlılık yok. Repo kökünde bir statik sunucu yeter:

```bash
cd ~/Developer/Projects/gaviaworks-crm
python3 -m http.server 8791
# tarayıcı: http://127.0.0.1:8791/
```

`index.html` giriş ekranıdır; rol/persona seçilir ve shell açılır.
Doğrudan bir ekrana gitmek için adres çubuğuna rol verilebilir:

```
http://127.0.0.1:8791/app-gorev.html?role=sahip
http://127.0.0.1:8791/app-gorev-detay.html?id=GRV-2026-101&role=sahip
```

**Canlı:** <https://gaviaworks-dev.github.io/gaviaworks-crm/>
"push = live" **varsayılmaz**, `curl` ile doğrulanır.

**Rol anahtarları:** `sahip` · `gm` · `operasyon` · `depmudur` · `satismudur` ·
`satistemsilci` · `musteritemsilci` · `analist` · `pm` · `takimlideri` ·
`tasarimci` · `frontend` · `backend` · `mobil` · `ai` · `qa` · `devops` ·
`destek` · `ik` · `muhasebe` · `satinalma` · `idari` · `freelancer` ·
`diskaynak` · `stajyer` · `musterikullanici` · `sistem`
(tam liste `assets/data/org.js` → `DB.roles`).

---

## 2. Tarama seti nasıl çalıştırılır

19 script `tasks/qa/` içinde **repoda izleniyor**. Yeniden yazma — kopyala.

```bash
SP=<scratchpad>                       # geçici çalışma dizini
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

**Süre:** `act.js` ~5 dk · `qa.js` ~4 dk · `ctl.js` ~4 dk · `gate.js` ~3 dk
(dördü paralel koşarsa toplam ~5 dk; tek tek ~16 dk).

### Koşarken üç kural — üçü de acıyla öğrenildi

1. **Repo dosyası DEĞİŞTİRME.** 11. oturumda bir `mut.js` koşumu eşzamanlı
   düzenlemeye denk geldi ve "2 ekran sorunlu" dedi; düzeltmeden sonraki temiz
   koşum 62/62 çıktı.
2. **Uzun taramayı `nohup <script> &` ile MÜSTAKİL başlat.** `{ ...; } > dosya &`
   bloğu iki kez yarıda öldü ve yalnız ilk başlığı yazdı.
3. **Bekleme kurarken `pgrep -f "node qa.js"` KULLANMA** — bekleyici kabuğun kendi
   komut satırı desene uyar, döngü hiç bitmez. **`pgrep -x node`** kullan.

### Son koşumun sonucu (12. oturum · hepsi temiz)

| Eksen | Ölçülen | Eksen | Ölçülen |
|---|---|---|---|
| `rec.js` | 62/62 hedef | `pers.js` | 18 vaka · 6/6 kayıt |
| `canon.js` | **2.588 kontrol** | `ctl.js` | 2.449 çift · 200 panel |
| `dbref.js` | 142 ekran | `grip-qa.js` | tüm ölçümler |
| `links.js` | 143 BUILT · kuyruk 0 | `swtest.js` | 40×24 px |
| `esc.js` | 142 ekran · 62/62 | `act.js` | **210 aksiyon** · yalan 0 · ölü 0 |
| `tabs.js` | 26 ekran · **224 tıklama** | `qa.js` | 142 ekran × 3 kırılım |
| `mut.js` | 62/62 kayıt | `gate.js` | **710 sayfa yüklemesi** |
| `listen.js` | 62/62 kayıt | `xport.js` | 634 kolon · 6.654 hücre · ⚠ aşağıya bak |
| `akt.js` | 26/26 · 183 hareket | `denetim.js` | tek seferlik (11. oturum) |

### `xport.js` "EKSİK" der — bu bir hata DEĞİLDİR

**Tamamen taşımayan kolon 0.** 18 kolon "kısmi": ekranda dolu, çıktıda boş **60
hücre (%0,9)**. Onsekizi de aynı sınıf: veri alanı boş/`null` iken ekranın
**yer tutucu metin** basması (`Zimmetsiz` · `Süresiz` · `Proje dışı` ·
`İade edilmedi` · `Vekil yok` · `Risk kaydı yok`). Ekran için doğru olan cümle
yazmak, CSV/Excel için doğru olan **boş hücre** yazmaktır; bilgi kaybı yoktur.
Script bu sınıfı ayırt edemediği için damgayı basıyor ve **bilinçle
yumuşatılmadı** — aracı kendi bulgusunu susturacak şekilde esnetmek ölçüme olan
güveni bozar (L-17 · L-26 · L-29). Tam açıklama: `docs/N-kapanis-raporu.md` §3.

---

## 3. V2 listeleri nerede

| Nerede | Ne var |
|---|---|
| **`tasks/plan.md` SONU** | İki başlık: **"V2 — BACKEND GEREKTİRİR"** (her biri için gereken tek cümle) ve **"KAPSAM DIŞI — KARAR KAYDI"** (kararın nerede yazılı olduğu) |
| **`tasks/ui-debt.md` satır 1909+** | `# V2 — DONDURULMUŞ KAPSAM DIŞI` başlığı altında **V2-01 … V2-06**, tam gerekçeleriyle |
| **`docs/N-kapanis-raporu.md` §4** | İkisinin okunabilir özeti |

**Altı V2 kaydı:**

| V2 | Konu | Neden kapanmadı |
|---|---|---|
| V2-01 | `GV.list` yordamlarının bağımsız bileşene ayrıştırılması | Belirtileri başka yollarla kapandı; kalan değer mimari saflık — **kapsam dışı kararı** |
| V2-02 | "Hizalama ve optik denge" | Göz kararı, otomatik eksene bağlanamadı — **kapsam dışı kararı** |
| V2-03 | `musteri` satır kapsamı | `GV.session` personelden kuruluyor, müşteri kimliği oturumda yok — **backend** |
| V2-04 | Yetkinlik kuralının tarama ekseni | Kapsam donduğu için eksen yazılmadı; kural V2-04'te yazılı |
| V2-05 | İşten ayrılış (offboarding) kaydı | Veride ayrılmış personel yok; uydurmak olmayan bir ayrılışı göstermek olurdu (L-13) — **veri** |
| V2-06 | Zimmet **teslim fotoğrafları** (§15'in 12. adımı) | Dosya yükleme uç noktası, nesne depolama, kalıcı dosya URL'i — **backend** |

---

## 4. Defterler nerede

| Dosya | İçerik |
|---|---|
| `PROMPT.md` | **Tek doğru kaynak** — 29 bölüm. Baştan sona okunmaz, ihtiyaç duyulan bölüm açılır |
| `tasks/plan.md` | Kapsam listesi · **295/295** · sonunda V2 ve kapsam dışı başlıkları |
| `tasks/ui-debt.md` | Borç defteri · sonunda **V2 — DONDURULMUŞ KAPSAM DIŞI** (satır 1909+) |
| `tasks/lessons.md` | **29 ders** (L-01 … L-29) |
| `tasks/components.md` | Ortak bileşen sözlüğü — **tek doğru kaynak** |
| `tasks/assumptions.md` | 41 varsayım, gerekçeleriyle (V-01 … V-41) |
| `tasks/qa/` | **19 tarama script'i** — repoda izleniyor, yeniden yazma, kopyala |
| `tasks/form-brief.md` · `tasks/detay-brief.md` | Form ve detay ekranı sözleşmeleri |
| `docs/A … M` | 13 doküman çıktısı (§26) |
| `docs/N-kapanis-raporu.md` | **Kapanış raporu — güncel** |

---

## 5. Yeni bir oturum başlarsa — değişmez kurallar

- **Ortak katmanda çöz, ekranda değil** (`ui.js` · `ui.css` · `shell.js` ·
  `tokens.css` · `domain.js`). Nokta yaması yasak (L-05).
- **Olmayan veriyi uydurma** (L-13). Yoksa ekran bunu **söyler**.
- **Türetilebilen değeri saklama** (L-08). İkinci kopya er geç kaynağıyla çelişir.
- **Kendi ölçüm aracına da güvenme** (L-17 · L-24 · L-26 · L-29). Yeni bir eksen
  koşturulmadan önce en az bir **olumlu** ve bir **olumsuz** vakayla sınanır;
  olumsuz vaka repoya değil scratchpad'deki kopyaya uygulanır.
- **Kapsam dondu.** Yeni tarama ekseni yazılmaz, `plan.md`'ye yeni madde eklenmez.
  Yeni bulgu `ui-debt.md` sonundaki V2 başlığına yazılır, yüzdeye katılmaz.
  Kapsamı yeniden açmak **bilinçli bir karar** olmalıdır — 12. oturuma kadar
  yüzdenin dört tur %81'de takılı kalmasının sebebi bu değildi, tersine: kapsam
  dondurulduğu için bitiş çizgisi gelebildi.
- **Git:** doğrudan `main` · dosyalar tek tek isimle stage edilir ·
  `git add -A` **yasak** · `--no-verify` **yasak** · Conventional Commits, İngilizce,
  kişi ismi yok · ayrı concern = ayrı commit.
- **İnşaat terminolojisi yasak** (şantiye · taşeron · hakediş · saha).
  Tam metin taraması şu an **0 sonuç**, öyle kalmalı.

**Commit sonu:**
```
Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_011mHnmKsGuQJkAgDtka3LnF
```
