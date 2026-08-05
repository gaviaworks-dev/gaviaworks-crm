# Handoff — GaviaWorks CRM

> Sıfırdan gelen bir Claude'un **hiçbir şey sormadan** devam etmesi için yazıldı.
> Sırayla oku: bu dosya → `tasks/ui-debt.md` → `tasks/lessons.md` → `tasks/plan.md` → `tasks/components.md`.
> **PROMPT.md'yi baştan sona OKUMA** — yalnız ihtiyaç duyduğun bölümü aç.
>
> **İLK İŞ:** QA kurulumu (bölüm 3). Script'ler `tasks/qa/` altında **repoda izleniyor** — yeniden
> yazma, kopyala. Kurulumdan sonra **`node rec.js`** koş: tarama hedeflerini o üretir (ders **L-19**).
> **`tasks/form-brief.md`** = form ekranı sözleşmesi · **`tasks/detay-brief.md`** = detay ekranı sözleşmesi.

**Güncelleme:** 2026-08-05, **10. oturum** · **141 ekran** · 26 detay · 36 form
**plan.md:** **236 / 292 madde (%81)** · 23 kısmen · 33 açık
**BLOK 3 (UI/UX kalite geçişi) İLERLİYOR** — 10. oturumda **18 borç kaydı** kapandı.
**KAPANIŞ TARAMASI KOŞULDU:** 14 eksen, hepsi temiz → `docs/N-kapanis-raporu.md`.

---

## 0. 10. OTURUMDA NE OLDU

### Kapanan borçlar (14)

| Kod | Ne çözüldü | Ölçüm |
|---|---|---|
| **UID-07** | Seçili kapsamı dışa aktarma — `exportRows` + `bulk[].export` | 53 ekran devre dışıdan çalışır oldu · 51 çıktı aksiyonu dosya üretiyor |
| **UID-30** | Ekranın kendi `run` gövdesi yalan söylüyordu | **10 yalan → 0** (defterdeki 28 sayısı aracın kendi hatasıydı) |
| **UID-08 + UID-09** | Kontrol–etiket boşluğu + native kontroller | 2.422 çiftte bitişik **0** · native select **0/732** · native kutu **0/4.154** |
| **UID-11 + UID-25 + UID-28** | KPI maskeleme · çıktı yetki kapısı · kardeş ekran ayrışması | 28 `canFinans ? x : 0` ve 9 elle kapı silindi |
| **UID-12 + UID-21** | Dış bağlantılar sessizce yanlış küme döndürüyordu | `app-gorev`'e "Tümü" sekmesi · `referans` süzgeci · 3 hiç okunmayan parametre |
| **UID-24 · UID-29** | Üç değerin ikiye düşmesi · sabit ay | — |
| **VB-06 + VB-23 + VB-25** | Aynı işlem ekrandan ekrana ayrışıyordu | yeni `assets/js/domain.js` · bekleyen tahsilat 285.000 → 0 ölçüldü |
| **VB-27 · VB-29** | Yetim anket kodları · hatırlatma veri ekseni | 6 geçmiş proje yazıldı · `DB.reminders` + duyuru `okuyanlar` açıldı |
| **VB-09** | Yasak inşaat terimi "saha" | defterde 1 kayıt vardı, **5 yerde** bulundu → tam metin taraması 0 |
| **VB-14 · VB-17 · VB-22** | Sekiz eksenin sözlüğü yoktu | form seçenekleri 1–2 → 4–5 |

### Bu oturumun EN ÖNEMLİ dersi — **L-26**

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

## 1. KALAN İŞ — SIRAYLA

### A. Yalan söyleyen davranış kalmadı
`act.js` 141 ekran / 207 aksiyon: **🔴 yalan 0 · ⚫ ölü 0**. Bu eksen **her turda** koşulur;
sayı artarsa regresyon. İki ölçüm boşluğu bilinçli olarak açıkta ve raporlanıyor:
**19 aksiyonun "doldur → kaydet" ikinci adımı** ve **2 ulaşılamayan toplu işlem**
(`app-pipeline` kanban görünümünde, `app-zaman` boş varsayılan sekmede seçilebilir satır yok).

### B. Sıradaki blok — TUTARLILIK (bağ ve kimlik)

| Sıra | Madde | Not |
|---|---|---|
| 1 | **VB-28** | §22'nin üç eksik bağı: `customers.lead` · `tasks.kanal` · `vehicles.siparis`; `tasks.destek` 0/25 ve `changeRequests.destek` 0/4 **boş** (L-22: alan açmak bağ yazmak değildir) |
| 3 | **UID-16** | `DB.activities` yalnız 4 kod önekini taşıyor; `TKL-*` `EMP-*` `ARC-*` `REF-*` `YTK-*` için tek satır yok → detay ekranlarının aktivite sekmesi boş |
| 4 | **VB-12 · VB-13** | Kişi kimliği ekseni: `tickets.acan` / `interactions.kontak` ADLA bağlanıyor · `referrers` ≡ `contacts` çifti |
| 5 | **VB-04 + VB-16** | Alan adı rename turu: `hakedis`/`hakedisTarihi` → kazanç ekseni (**111 kullanım**, 7 ekran + `crm.js` + `canon.js`) · `analyses.maliyet` → `tahminiBedel`. VB-09 (terim) bu turdan **ayrıldı ve kapandı** — metin değişikliği hiçbir tarama eksenine dokunmuyordu, gerekçe ui-debt'te |
| 6 | **VB-10 · VB-11 · VB-15 · VB-18 · VB-20 · VB-24 · VB-26** | Onay akışı tablosu · bütçe kodu koleksiyonu · belge bağları · komisyon şema tekdüzeliği · proje eksen çakışması · doluluk kopyası · rapor katalog anahtarları |

### C. Sonra — YAPISAL ve KOZMETİK

`UID-26` (`GV.list` kilidi — `openCols`/`openFilters`/`renderBulk`/`renderKanban` hâlâ içeride;
`doExport` bu oturumda çıkarıldı) · `UID-05` (satır kapsamı `scopeField`) · `UID-15` (13 ekran
elle shell iskeleti) · `UID-17` (`GV.dl`) · `UID-02` (mobil satır aksiyonu) · `UID-03` (`.gv-thumb`) ·
`UID-04` (`GV.upload.onFile`) · `UID-06` (`countTarget`) · `UID-10` (drawer başlık ayrımı) ·
`UID-14` (detay tablosu ≤760px) · `UID-18` (`.cell-wrap`) · `UID-19` (`tfoot`) · `UID-22` (yerel ton haritası) ·
`UID-23` (43 ekranda `GV.empty` çift escape) · `VB-21` (eyebrow ekseni).

---

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
