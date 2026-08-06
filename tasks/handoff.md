# Handoff — GaviaWorks CRM

> Sıfırdan gelen bir Claude'un **hiçbir şey sormadan** devam etmesi için yazıldı.
> Sırayla oku: bu dosya → `tasks/ui-debt.md` → `tasks/lessons.md` → `tasks/plan.md` → `tasks/components.md`.
> **PROMPT.md'yi baştan sona OKUMA** — yalnız ihtiyaç duyduğun bölümü aç.
>
> **İLK İŞ:** QA kurulumu (bölüm 3). Script'ler `tasks/qa/` altında **repoda izleniyor** — yeniden
> yazma, kopyala. Kurulumdan sonra **`node rec.js`** koş: tarama hedeflerini o üretir (ders **L-19**).
> **`tasks/form-brief.md`** = form ekranı sözleşmesi · **`tasks/detay-brief.md`** = detay ekranı sözleşmesi.

**Güncelleme:** 2026-08-06, **11. oturum** · **142 ekran** · 26 detay · 36 form
**plan.md:** **276 / 297 madde (%92)** · 21 kısmen · **0 açık**
## 0. DURUM — KAPSAM TAMAM

`plan.md`'de **açık madde kalmadı** (0). Kalan 21 madde `[~]` **kısmen**dir ve
her birinin yanında neyin yapıldığı, neyin neden yapılmadığı **ölçüsüyle** yazılıdır.

**KAPSAM DONDURULDU (11. oturum).** Sebep: her yeni ölçüm ekseni yeni borç buluyor,
borç deftere giriyor, payda büyüyordu — dört oturumdur yüzde %81'de sabit kalmasının
sebebi buydu. Bugünden itibaren:
- **Yeni tarama ekseni yazılmaz.** Kalıcı set **19 script** (`tasks/qa/`).
- **`plan.md`'ye yeni madde eklenmez.** Payda **297**'de dondu.
- Yeni bulgu `ui-debt.md` sonundaki **“V2 — DONDURULMUŞ KAPSAM DIŞI”** başlığına yazılır;
  yüzdeye katılmaz. Şu an orada **5 kayıt** var (V2-01..V2-05).

### 11. oturumda kapananlar

| Kod | Ne çözüldü | Ölçüm |
|---|---|---|
| **VB-28** | §22 bağ kapsamı — üç "eksik" bağın **ikisi zaten vardı**, ters yönde | `canon.js` eksen **21**: 14 bağın 14'ü ≥1 kayıtta dolu · `bag.js` 12 vaka |
| **UID-16** | Aktivite kapsamı — defter 5 önek diyordu, ölçülen **22** | `DB.activities` **8 → 192**, aktivitesi olan detay ekranı **4/26 → 26/26** |
| **VB-12 · VB-13** | Kişi kimliği — defter 2 alan sayıyordu, ölçülen **3** | 192+7+7 değer koda çevrildi · `GV.session.ad`→`.emp` **154 yazım / 62 dosya** · ad kaskadı silindi |
| **VB-04 · VB-16** | Alan adı rename — envanter **145 kullanım / 9 dosya** (defterde 111) | `hakedis`→`komisyonToplam` · `hakedisTarihi`→`kazanimTarihi` · `maliyet`→`tahminiBedel`; yasak terim taraması **0** |
| **UID-02·03·04·05·06·10·13·14·15·17·19·29** | Bileşen katmanı kümesi | aşağıdaki tabloda |
| **UID-26** | `GV.list` kilidi | **kısmen** — dönüş yüzeyine alındı, bağımsız bileşen V2-01 |
| **Kapsam B (10 madde)** | Sistem geneli denetimler | 142 ekran ölçümü, aşağıda |
| **3 özellik boşluğu** | Zamanlayıcı · yetkinlik ekseni · işe giriş/çıkış | üçü de üretildi ve ölçüldü |

### Bu oturumun dersi — **borç kaydının KENDİSİ yanlış yere bakabilir**

L-26 ölçüm aracının yanılabileceğini söylüyordu. Bu oturum bir adım ötesini gösterdi:
**dört borç kaydı da kendi kapsamını yanlış ölçmüştü** ve hepsi aynı yönde —
gerçek her seferinde defterdekinden **büyük** çıktı:

| Borç | Defterde | Ölçülen |
|---|---|---|
| UID-16 aktivite öneki | 5 | **22** |
| UID-17 yerel `dl()` | 9 ekran | **60 ekran** |
| VB-04 rename kullanımı | 111 | **145** |
| VB-12 kişi alanı | 2 | **3** (biri 192 kayıtlık) |
| VB-28 eksik bağ | 3 | **1** (ikisi ters yönde zaten vardı) |

> **Kural:** bir borç kapatılmadan önce kapsamı **yeniden ölçülür**; defterdeki sayı
> tahmindir. VB-28 tersini de gösterdi: bağ "yok" denmeden önce **iki yönde de** aranır.

### Ölçüm aracı üç kez kendi hatasını gösterdi

1. `pers.js` ilk sürümü `innerText` okuyordu → sekme tıklamasından sonra yalnız son panel
   görünür kaldığı için **ekranda var olan adı "yok"** gösterdi.
2. Aynı script "kod sayfada geçmesin" derken fazla katıydı — bu projede her kayıt kendi
   kodunu `.cell-sub`/`.cell-code` ile gösterir. Kural **birincil ad konumuna** daraltıldı.
3. Kapsam B denetimi **8.188 odaksız öğe** raporladı; programatik `.focus()`
   `:focus-visible`'ı tetiklemiyor — ihlallerin tamamı sahteydi. Odak halkası
   `shell.css`'te global tanımlı.

> Üçü de L-26'nın tekrarı: **araç sınanmadan güvenilmez.** Bu oturumda açılan her eksen
> koşturulmadan önce en az bir olumlu ve bir olumsuz vakayla denendi.

---

## 0b. 10. OTURUMDA NE OLDU

### Kapanan borçlar (18 kayıt)

| Kod | Ne çözüldü | Ölçüm |
|---|---|---|
| **UID-07** | Seçili kapsamı dışa aktarma — `exportRows` + `bulk[].export` | 53 ekran devre dışıdan çalışır oldu · 51 çıktı aksiyonu dosya üretiyor |
| **UID-30** | Ekranın kendi `run` gövdesi yalan söylüyordu | **10 yalan → 0** (defterdeki 28 sayısı aracın kendi hatasıydı) |
| **UID-08 + UID-09** | Kontrol–etiket boşluğu + native kontroller | 2.422 çiftte bitişik **0** · native select **0/734** · native kutu **0/4.179** |
| **UID-11 + UID-25 + UID-28** | KPI maskeleme · çıktı yetki kapısı · kardeş ekran ayrışması | 28 `canFinans ? x : 0` ve 9 elle kapı silindi |
| **UID-12 + UID-21** | Dış bağlantılar sessizce yanlış küme döndürüyordu | `app-gorev`'e "Tümü" sekmesi · `referans` süzgeci · 3 hiç okunmayan parametre |
| **UID-24 · UID-29** | Üç değerin ikiye düşmesi · sabit ay | — |
| **VB-06 + VB-23 + VB-25** | Aynı işlem ekrandan ekrana ayrışıyordu | yeni `assets/js/domain.js` · bekleyen tahsilat 285.000 → 0 ölçüldü |
| **VB-27 · VB-29** | Yetim anket kodları · hatırlatma veri ekseni | 6 geçmiş proje yazıldı · `DB.reminders` + duyuru `okuyanlar` açıldı |
| **VB-09** | Yasak inşaat terimi "saha" | defterde 1 kayıt vardı, **5 yerde** bulundu → tam metin taraması 0 |
| **VB-14 · VB-17 · VB-22** | Sekiz eksenin sözlüğü yoktu | form seçenekleri 1–2 → 4–5 |

### Bu oturumun EN ÖNEMLİ dersi — **L-26 ve L-27**

`act.js` UID-30'u **28 aksiyon / 21 ekran** diye ölçmüştü. Aracın kendisi **beş** yerde
yanılıyordu; düzeltilince gerçek sayı **10 yalan / 5 ekran**, ölü **0** çıktı:

1. Çıktı modalını **onay modalı** sandı (ikisi de `is-sm` + iki aksiyon; ama çıktı modalı
   **girdi sorar**) → 51 sağlıklı çıktı aksiyonunu "yalan" gösteriyordu.
2. **Girdi soran** modalı kendi onaylıyordu → ekran haklı olarak reddediyor, araç suçu
   aksiyona yazıyordu (19 aksiyon).
3. **Görünmeyen** toplu işlem butonuna tıklıyordu (bar gizliyken tıklama sessizce düşer).
4. Satır aksiyonunu **yalnız ilk satırda** deniyordu; ön koşul tutmayınca "ölü" sayıyordu.
   Ayrıca `'info'` tonlu dürüst reddi red saymıyordu (13 aksiyon).
5. Çok satır denemesi eklenince **yalan maskelenmeye** başladı → kural: *bir satırda
   yalan söyleyen aksiyon, başka satırda dürüst davransa bile ihlaldir.*

> **L-25 borcun EKSİK sayılabileceğini söylüyordu; L-26 FAZLA da sayılabileceğini gösterdi.**
> Ortak kural: sayının **nasıl ölçüldüğü** deftere yazılır, araç sınanmadan koşturulmaz.

**L-27 — araç kendi düzeneğini kuramazsa DURUR.** Kapanış taramasında `xport.js`
"TEMİZ — **0 kolonun** tamamı temiz" dedi: UID-07 çözümü `ui.js` dönüş bloğuna
`exportRows` ekleyince yamanın çapası kaymıştı, script hiçbir liste bulamadan 141 ekran
gezdi ve **hata vermedi**. Artık çapa kaybolursa `throw`, sıfır ölçüm `GEÇERSİZ` +
`exit 2`. Yakalayan şey raporun içindeki **sayının kendisiydi** — bu yüzden her tarama
raporunda ekran/kayıt/birim sayısı ayrı ayrı yazılır (L-19).

### Yeni ortak katman parçaları

| Dosya / API | Ne için |
|---|---|
| `assets/js/domain.js` — `GV.fin` · `GV.delivery` | İş kuralı yordamları; `ui.js` alana kördür (components.md §6b) |
| `ui.js` → `exportRows` · `bulk[].export` | UID-07 |
| `ui.js` → `kpis[].perm/mask` · `columns[].perm/mask(row)` · `disaAktar` kapısı | UID-11 / 25 / 28 |
| `ui.css` → kontrol–etiket taban kuralı + native kontrol standardı | UID-08 / 09 |
| `DB.reminders` · `DB.announcements[].okuyanlar` | VB-29 · UID-30 |

### Yeni tarama eksenleri (kalıcı sette)

| Script | Sorduğu soru |
|---|---|
| `xport.js` | "Çıktı ekrandaki bilgiyi taşıyor mu?" — `ui.js`'i bellekte yamalayıp her `GV.list` kolonunun EKRAN ve ÇIKTI değerini karşılaştırır |
| `ctl.js` | "Kontrol ile etiketi arasında boşluk var mı, kontroller tasarım sisteminde mi?" — filtre paneli · kolon yöneticisi · çıktı modalını da **açar** |
| `canon.js` eksen **19 · 20** | Hatırlatma/duyuru okuma bağları · anket `ilgili` kaydı ve teslim-anket tarih sırası |

---

## 1. KALAN İŞ — KAPSAM DIŞI

`plan.md`'de **açık madde yok**. Sıradaki oturumun işi, kapsam açılırsa,
`ui-debt.md` sonundaki **V2** başlığındaki beş kayıttır:

| Kayıt | Ne | Neden bu oturumda yapılmadı |
|---|---|---|
| **V2-01** | `GV.list` yordamlarının bağımsız bileşene ayrıştırılması | Dördü de liste `state`i üzerinde çalışıyor; belirtileri başka yollarla kapandı, kalan değer mimari saflık |
| **V2-02** | "Hizalama ve optik denge" | Göz kararı; otomatik eksene bağlanamadı — sahte yeşile yazılmadı |
| **V2-03** | `musteri` satır kapsamı | `GV.session` personelden kuruluyor, müşteri kimliği oturumda yok |
| **V2-04** | Yetkinlik kuralının tarama ekseni | Kapsam donduğu için eksen yazılmadı; kural V2'de yazılı |
| **V2-05** | İşe çıkış (offboarding) kaydı | Veride ayrılmış personel yok; uydurmak olmayan bir ayrılışı göstermek olurdu (L-13) |

**Ayrıca 21 `[~]` madde** var; her birinin yanında ne yapıldığı ve neyin neden
açık kaldığı ölçüsüyle yazılı. Bunlar "yarım iş" değil, **kapsamı bilinçle
daraltılmış** maddelerdir.

## 2. YÖNTEM — DEĞİŞMEZ KURALLAR

- **Orkestratör ortak katmanın tek sahibi:** `assets/**` · `tasks/**` · `docs/**` · `BUILT` ·
  QA · commit · push. **Ajan commit atmaz, plan.md yazmaz.**
- **Dalga tavanı DÖRT ajan** (L-20). Tek bekleme kur, topla; yoklama döngüsü yasak.
- **Ajan raporundaki her iddia ölçülerek doğrulanır** — ve **kendi ölçüm aracın da
  sınanmadan güvenilmez** (L-17 · L-24 · **L-26**). Yeni bir hüküm yazarken sor:
  *"bu hüküm hangi SAĞLIKLI davranışı ihlal gösterir?"*
- **Tarama koşarken repo dosyası DEĞİŞTİRME.** 10. oturumda `qa.js` tam tarama sırasında
  `ui.js` düzenlendi ve tarama yarım kalan koda bakıp `kpiMasked is not defined` raporladı;
  tarama baştan koşuldu.
- **Ayrı concern = ayrı commit.** Commit öncesi `git diff --cached --name-only` doğrulanır.
  `git add -A` yasak, `--no-verify` yasak.
- **Her madde bitince `plan.md` aynı turn içinde işaretlenir**, ilerleme `grep -c '^- \[x\]'`
  ile yeniden sayılır (elle yazılmaz).

---

## 3. QA KOMUTLARI

```bash
SP=<scratchpad>
cd $SP && npm init -y && npm i playwright@1.62.1     # chromium zaten kurulu olabilir
mkdir -p $SP/qa-run && cp <repo>/tasks/qa/*.js $SP/qa-run/
ln -sfn $SP/node_modules $SP/qa-run/node_modules

cd <repo> && nohup python3 -c "
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
ThreadingHTTPServer(('127.0.0.1',8791), SimpleHTTPRequestHandler).serve_forever()" &

cd $SP/qa-run
node rec.js                          # ÖNCE BU — qa-targets.json (62 hedef)
node canon.js · node dbref.js · node links.js        # playwright GEREKMEZ
node esc.js · node tabs.js · node mut.js · node listen.js
node swtest.js · node grip-qa.js · node xport.js · node ctl.js · node act.js
node qa.js "$(ls <repo>/app-*.html | xargs -n1 basename | tr '\n' ',')"
node gate.js                         # 141 ekran × 5 rol, ~10 dk
```

> **Süre uyarısı:** `act.js` ~25 dk, `gate.js` ~10 dk, `qa.js` ~20 dk, `ctl.js` ~12 dk.
> Hepsi tek turda koşacaksa **arka planda** başlat, `tail -f` ile izle; 10 dakikalık
> komut zaman aşımına takılır.

> **L-19:** Her tarama raporunda **taranan ekran** ve **yüklenen kayıt** sayısı ayrı yazılır.
> 141'in altında tarayan script varsa sebebi yazılır (L-24).

**Commit sonu:**
```
Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_011mHnmKsGuQJkAgDtka3LnF
```

---

## 4. DERSLER — `tasks/lessons.md` (L-01..L-26)

En sık ihlal edilen: **L-12** (okunan koleksiyonun dosyası yüklü olmalı — 10. oturumda
`domain.js` yüzünden iki finans ekranına `work.js` eklendi) · **L-13** (bağ yazılır) ·
**L-15** (`GV.refresh`) · **L-19** (tarama hedefi kayıtla doğrulanır) · **L-22** (alan açmak
bağ yazmak değildir) · **L-23** (bileşen başarı varsaymaz) · **L-24 / L-26** (araç sınanmadan
güvenilmez, borç eksik de fazla da sayılabilir).

> **Beş ikizin ortak kökü:** *ölçüm ekseni olmayan hata görünmez.*
> **Altıncı ikiz (10. oturum):** *ölçüm ekseni yanlış kurulmuşsa hata OLMAYAN yerde görünür.*
