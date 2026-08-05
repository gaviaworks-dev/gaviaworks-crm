# Handoff — GaviaWorks CRM

> Sıfırdan gelen bir Claude'un **hiçbir şey sormadan** devam etmesi için yazıldı.
> Sırayla oku: bu dosya → `tasks/plan.md` → `tasks/components.md` → `tasks/lessons.md` → `tasks/ui-debt.md`.
> **PROMPT.md'yi baştan sona OKUMA** — yalnız ihtiyaç duyduğun bölümü aç.
>
> **İLK İŞ:** QA kurulumu (bölüm 3). Script'ler `tasks/qa/` altında **repoda izleniyor** — yeniden
> yazma, kopyala. Kurulumdan sonra **`node rec.js`** koş: tarama hedeflerini o üretir (ders **L-19**).
> **`tasks/form-brief.md`** = form ekranı sözleşmesi · **`tasks/detay-brief.md`** = detay ekranı sözleşmesi.
> **`tasks/ui-debt.md`** = arayüz + veri borç defteri.

**Güncelleme:** 2026-08-05, **9. oturum** · **141 ekran** · 26 detay · 36 form
**plan.md:** **218 / 283 madde (%77)** · 23 kısmen · 42 açık
**BLOK 2 KAPANDI** (gate.js dahil tüm taramalar temiz) · **BLOK 3 BAŞLADI — UID-27 çözüldü**
**DOKÜMAN BLOĞU KAPANDI — 13/13.** `docs/` altında A(→research.md) ve B'den M'ye tamamı hazır.

---

## 0. 9. OTURUMDA NE OLDU — ÖZET

**Blok 1 (doküman) bitti.** Yedi doküman üretildi: G · I · J · L (dalga 1, dört ajan) ·
F (dalga 2, dört ajan, 141 ekran modül grubuna bölündü) · B ve M (orkestratör yazdı).
Toplam ~7.900 satır. Ajanların **hiçbiri düşmedi** — dörtlü dalga kuralı (L-20) çalışıyor.

**Blok 2 (Wave 13 kapanış) kısmen bitti** — aşağıda 1.B'de durum var.

### Bu oturumda ölçülerek bulunan GERÇEK hatalar

Hepsi ajan raporlarının **doğrulanması** sırasında çıktı; hiçbiri ajan iddiası olarak
kabul edilmedi. Sırayla:

| Kod | Hata | Ölçüm |
|---|---|---|
| 🔴 **UID-27** | `GV.list` `run`'ı olmayan toplu işlemde **yeşil "N kayıt işlendi" sahte başarı mesajı** basıyor, veri değişmiyor | **79 aksiyon / 47 ekran** · kök neden `ui.js:951` tek satır |
| **UID-26** | Kolon/filtre/çıktı/toplu/kanban `GV.list` içine **kilitli**, dışarıdan çağrılamıyor | 5 yordam · UID-06/07/17'nin ortak kökü |
| **UID-28** | Maskeleme kardeş ekranlarda ayrışıyor | `app-dokuman` **0** yetki çağrısı · `app-arac-yakit` birim fiyattan tutar geri hesaplanıyor |
| **VB-27** | `DB.surveys[].ilgili` altı **yetim proje kodu** taşıyor | 10 PRJ kodunun 6'sı `DB.projects`'te yok |
| **VB-28** | §22'nin 37 bağından **3'ü hiç yok, 1'i şemada var ama boş** | `customers.lead` · `tasks.kanal` · `vehicles.siparis` YOK · `tasks.destek` **0/25** |
| **UID-29** | `app-arac-yakit` "Geçen Ay" sekmesi `'2026-07'` sabitine yazılmış | türetilmiyor |

### Defterlerde düzeltilen YANLIŞ kayıtlar (hepsi ölçümle)

1. **`components.md` sekiz hayalet `GV.*` adı taşıyordu** — `notify · cols · filters · export ·
   bulk · dateRange · help · kanban`. `GV.detail`/`GV.gantt` ile aynı sınıf. Gerçek yüzey
   ölçüldü: **38 üye** (`shell.js` 12 · `ui.js` 25 · **`dashboard.js` 1**). Üç yanlış imza da
   düzeltildi: `GV.badge(kind,value)`→**`(value,extra)`** · `GV.shell.role()/setRole()`→
   **`GV.perm.role()`/`GV.shell.setSession()`**.
   > ⚠️ **Kendi hatam da buradaydı:** ilk düzeltmede "37 üye" yazdım çünkü yalnız `ui.js` +
   > `shell.js` taradım. `GV.dashboard` **`dashboard.js`**'te. **`GV.*` taranırken
   > `assets/js/` altındaki TÜM dosyalar taranır.**
2. **`UID-15` "dört ekran" diyordu, gerçek 13.** `grep -l 'class="gv-app"'` ile sayıldı;
   yarısı liste ekranı. `GV.pageHead` bu **13 ekranda hiç çalışmıyor**.
3. **`plan.md`'nin 12 maddesi "form bekliyor" diyordu**, oysa form bloğu 8. oturumda 36/36
   kapanmıştı. Ayrıca başlık sayısı bir madde eksikti (yazan 195/274, gerçek 196/275).
   **Sayı artık `grep -c '^- \[x\]'` ile ölçülüyor, elle yazılmıyor.**
4. **§22 "38 bağlantı" değil 37.** (Sigorta ve Kasko ayrı madde yazılmış ama tek
   koleksiyonda `tur` ile ayrışıyor.)
5. **VB-05'in kapanışı fazla iddialıydı** — bkz. VB-28. **Alan açmak bağ yazmak değildir.**

---

## 1. KALAN İŞ — SIRAYLA

### A. Blok 1 — doküman ✅ KAPANDI (13/13)
`docs/`: `B-yonetici-ozeti` · `C-modul-haritasi` · `D-rol-yetki-matrisi` ·
`E-menu-sayfa-haritasi` · `F-sayfa-analizleri` (**4586 satır, 141/141 ekran**) ·
`G-veri-modeli` · `H-is-akislari` · `I-api-teknik-servisler` · `J-otomasyonlar` ·
`K-raporlar` · `L-yol-haritasi` · `M-eksik-ve-ek-oneriler`. A → `tasks/research.md`.

### B. Blok 2 — Wave 13 kapanış · **YARIM, BURADAN DEVAM ET**

| İş | Durum |
|---|---|
| `data-wip` süpürmesi | ✅ `links.js` **TEMİZ**, kuyrukta **0 hedef** |
| Canonical tarama | ✅ `canon.js` **TEMİZ — 607 kontrol** |
| `dbref.js` | ✅ **TEMİZ — 141 ekran** |
| `rec.js` hedef üretimi | ✅ **62/62 hedef gerçek kayıtla doğrulandı** |
| §22 bağ doğrulaması | ✅ ölçüldü → **33 kurulu · 3 yok · 1 yarım** (VB-28) |
| **1440/768/390 tam tarama** | ⏳ **arka planda koşuyordu, SONUCU OKU** — bkz. aşağıdaki not |
| **`gate.js` tam süpürmesi** | ✅ **TEMİZ** — 705 yükleme (141×5 rol), boş sayfa yok. 403: sahip 0 · pm 57 · muhasebe 64 · destek 87 · stajyer 125 |
| 1440/768/390 tam tarama | ✅ `qa.js` TEMİZ · `tabs.js` 223 tıklama (26/26 kayıt) · `esc.js` 141 ekran (62/62) · `mut.js` + `listen.js` 62 ekran (62/62) · `swtest` · `grip-qa` TEMİZ |
| **UID-20** (formlara düzenleme bağlantısı) | ❌ **YAPILMADI** — tüm formlar bitti, artık tek turda yapılabilir |
| Kapanış raporu | ❌ yazılmadı |

> **⚠️ TARAMA SONUCU NEREDE:** `qa.js` · `tabs.js` · `esc.js` · `mut.js` · `listen.js` ·
> `swtest.js` · `grip-qa.js` tek seferde arka planda koşturuldu, çıktı
> **`<scratchpad>/qa-run/sweep.log`**'a yazıldı. Scratchpad oturumla birlikte silinir —
> yeni oturumda **yeniden koş**, sonucu bu dosyaya işle. Koşarken `qa.js`'e ekran listesi
> ver: `ls app-*.html | tr '\n' ','`.

### C. Blok 3 — FAZ: UI ve UX KALİTE GEÇİŞİ · **ANA İŞ**

`ui-debt.md`: **29 UID + 28 VB**. Sıralama (9. oturumda ölçülen etkiye göre):

### ✅ UID-27 ÇÖZÜLDÜ (9. oturum) — devamı UID-30

**Yeni tarama ekseni: `tasks/qa/act.js`** — "bu buton gerçekten bir şey yapıyor mu?"
Hükümler: MUTASYON · YÖNLENDİRME · PANEL · DÜRÜST RED (sağlıklı) ·
🔴 YALAN · ⚫ ÖLÜ (ihlal). **Kalıcı tarama setinde, her turda koşulur.**

Gerçek sayı defterdekinin çok üstündeydi: **79 değil 129 ihlal / 65 ekran**
(94 yalan · 35 ölü). Düzeltme sonrası **28**. `ui.js`'teki yalan yedek kaldırıldı;
`run`suz aksiyon artık `disabled` + "bu sürümde yok" (gizlenmedi — gerekçe ui-debt'te).

**SIRADAKİ İŞ — UID-30:** kalan 28 ihlal farklı sınıf, `run` **var** ama gövdesi
yalan/ölü. Ekran ekran incelenir, toplu kök neden yok. Liste ui-debt.md'de tam.

**AÇIK KARAR — `disa` (53 ekran):** Beyar bunun bileşen yeteneği boşluğu olduğunu
söyledi ve fizibilite istedi. **Ölçülen:** `ui.js` `doExport(rows, fmt)` **zaten
generic** — `visibleCols()` + `c.exportValue ? c.exportValue(r) : r[c.key]` + HTML
soyma. Yani **yeni fonksiyon yazmaya gerek yok**; eksik olan tek şey onu *seçili
satırlarla* çağırabilmek (UID-07'nin `exportRows(rows, format)`'ı).
**Yapılamayan ölçüm:** "kaç ekranda kolon tanımı yetmiyor" sorusu **cevaplanmadı** —
statik analizim `source:` desenini 53 ekranın 53'ünde de okuyamadı, uydurma sayı
vermedim. **Bu ölçüm çalışma zamanında yapılmalı:** her ekranda `doExport` çağırıp
boş çıkan hücreleri say. Sonuç görülmeden `exportRows` yazılmayacak (Beyar'ın kararı).

**1. (eski kayıt) 🔴 UID-27 — sahte toplu işlem.**
Kullanıcı onay veriyor, yeşil "12 kayıt arşivlendi" mesajını görüyor, **hiçbir kayıt
arşivlenmiyor**. 79 aksiyon / 47 ekran. CLAUDE.md "sahte buton yasak" kuralının en büyük
ihlali. **UID-13 ile tek sözleşmede** çözülür:
- `ui.js:951`'deki `else GV.toast(...)` yedeği **kaldırılır** (bileşen yapmadığı işi yaptım demez)
- `bulk[]` maddesi `run` + `show`/`perm` taşımıyorsa **hiç basılmaz**
- 47 ekranın toplu işlemleri gözden geçirilir: istenen aksiyona `run` yazılır, istenmeyen silinir
- `tasks/qa/`'ya **yeni tarayıcı**: "her `bulk[]` maddesinin `run`'ı var mı"
> **Sıra uyarısı:** 2. adım tek başına uygulanırsa 40 ekranda toplu işlem barı boşalır.
> Üçü **aynı turda**.

**2. UID-26 — `GV.list` kilidi.** Beş yordam (`openCols` · `openFilters` · `doExport` ·
`renderBulk` · `renderKanban`) `GV.*` yüzeyine çıkarılır. Sıra: `doExport` (UID-07'yi de
kapatır) → `openCols` (UID-06) → `openFilters` → `renderBulk` (UID-13/27 ile) → `renderKanban`.

**3. Yetki ve maskeleme kümesi — tek tur:** UID-05 (satır kapsamı) · UID-11 (KPI maskeleme) ·
UID-25 (rapor çıktısı yetki kapısı, 73 rapor) · UID-28 (maskeleme ayrışması).

**4. Sözlük kümesi — tek tur:** VB-14 · VB-17 · VB-22 (altı eksenin `DB.*` sözlüğü yok).

**5. Bağ ve veri kümesi — tek tur:** VB-27 (yetim anket kodları) · VB-28 (üç eksik §22 bağı) ·
UID-16 (aktivite kapsamı) · VB-12/VB-13 (kişi kimliği ekseni).

**6. Taban kural kümesi:** UID-08 + UID-09 **birlikte** (kontrol–etiket boşluğu ve native
kontroller tek taban kuralla).

**7. Yapısal:** UID-15 (**13 ekran**, dört değil) · UID-17 (`GV.dl`) · UID-14 · UID-18 · UID-19.

**8. Ad ve terim:** VB-04 (`hakedis`→`komisyon`) + VB-09 (`MOD-009` "Saha" yasak terim) +
VB-16 (`analyses.maliyet`→`tahminiBedel`) — üçü aynı turda, `canon.js`'e dokunur.

---

## 2. YÖNTEM — DEĞİŞMEZ KURALLAR

- **Orkestratör ortak katmanın tek sahibi:** `assets/**` · `tasks/**` · `docs/**` · `BUILT` ·
  QA · commit · push. **Ajan commit atmaz, plan.md yazmaz.**
- **Dalga tavanı DÖRT ajan** (L-20). Beşinci açılmaz, dalga bitmeden yeni dalga başlamaz.
  9. oturumda iki dalga × dört ajan koşuldu, **düşen olmadı**.
- **Tek bekleme kur, topla.** Yoklama döngüsü yasak.
- **Ajana ortam keşfi yaptırma.** Prompt'a mutlaka yaz: "`node_modules` kontrolü,
  kütüphane araştırması, Playwright kurulumu, HTTP sunucu, QA koşma **yok**."
- **Ajana gerçek `GV.*` yüzeyini prompt'ta ver** (38 üye) — yoksa hayalet API dokümana sızar.
- **Ajan raporundaki her iddia ölçülerek doğrulanır.** 9. oturumda 8 ajan raporunun
  **hepsinde** doğru bulgu vardı, ama biri **benim ölçümümü** düzeltti (`GV.dashboard`) ve
  biri kendi sayısını eksik saydı (13 toplu işlem dedi, gerçek 79).
- **Ayrı concern = ayrı commit.** Commit öncesi `git diff --cached --name-only` ile
  staged listeyi **doğrula**. `git add -A` yasak, `--no-verify` yasak.
- **Her madde bitince `plan.md` aynı turn içinde işaretlenir**, ilerleme satırı `grep` ile
  yeniden sayılır.

---

## 3. QA KOMUTLARI

```bash
SP=<scratchpad>
cd $SP && npm init -y && npm i playwright@1.62.1
npx playwright install chromium
mkdir -p $SP/qa-run && cp <repo>/tasks/qa/*.js $SP/qa-run/
ln -sfn $SP/node_modules $SP/qa-run/node_modules

cd <repo> && nohup python3 -c "
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
ThreadingHTTPServer(('127.0.0.1',8791), SimpleHTTPRequestHandler).serve_forever()" &

cd $SP/qa-run
node rec.js                          # ÖNCE BU — qa-targets.json üretir (62 hedef)
node canon.js                        # 607 kontrol · playwright GEREKMEZ
node dbref.js · node links.js        # statik · playwright GEREKMEZ
node qa.js "$(ls <repo>/app-*.html | xargs -n1 basename | tr '\n' ',')"
node tabs.js · node esc.js · node mut.js · node listen.js
node swtest.js · node grip-qa.js
node gate.js > gate-out.txt          # 141 ekran × 5 rol, ~10 dk, ARKA PLANDA
```

> **L-19:** Her tarama raporunda **taranan ekran** ve **yüklenen kayıt** sayısı ayrı yazılır.
> Sıfır kayıtla taranan ekran varsa tarama **geçersizdir**, "TEMİZ" yazsa bile.

**Commit sonu:**
```
Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_011mHnmKsGuQJkAgDtka3LnF
```

---

## 4. DERSLER — `tasks/lessons.md` (L-01..L-20)

En sık ihlal edilen: **L-12** (okunan koleksiyonun dosyası yüklü olmalı) · **L-13** (bağ
yazılır, türetilmez) · **L-14** (etiket escape) · **L-15** (`GV.refresh`, reload değil) ·
**L-16/L-18** (dinleyici ve overlay) · **L-19** (tarama hedefi kayıtla doğrulanır) ·
**L-20** (dalga tavanı dört).

**Genel ders — beş ikiz.** Bu projedeki her büyük hata aynı sınıftan çıktı:
*"konsol temiz" ≠ "ekran doğru"* (L-14) · *"toast çıktı" ≠ "işlem oldu"* (L-15) ·
*"araç TEMİZ dedi" ≠ "doğru şeyi ölçtü"* (L-17) · *"doğru adresi kurdu" ≠ "doğru kaydı
yükledi"* (L-19) · **"alan açıldı" ≠ "bağ yazıldı" (9. oturum, VB-28).**

> **Hepsinin tek kökü:** *ölçüm ekseni olmayan hata görünmez.* UID-27 beş oturum boyunca
> sessizdi çünkü hiçbir tarama "buton gerçekten bir şey yapıyor mu" diye sormuyordu.
> **Yeni bir hata sınıfı bulunduğunda taramaya eksen eklenmeden madde kapatılmaz.**
