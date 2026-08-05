# Handoff — GaviaWorks CRM

> Sıfırdan gelen bir Claude'un **hiçbir şey sormadan** devam etmesi için yazıldı.
> Sırayla oku: bu dosya → `tasks/plan.md` → `tasks/components.md` → `tasks/lessons.md` → `tasks/ui-debt.md`.
>
> **İLK İŞ:** QA kurulumu (bölüm 4). Script'ler `tasks/qa/` altında **repoda izleniyor** — yeniden
> yazma, kopyala. Kurulumdan sonra **`node rec.js`** koş: tarama hedeflerini o üretir (ders **L-19**).
> **`tasks/form-brief.md`** = form ekranı sözleşmesi · **`tasks/detay-brief.md`** = detay ekranı sözleşmesi.
> **`tasks/ui-debt.md`** = arayüz + veri borç defteri. Üretim sırasında görülen sorun oraya yazılır,
> **o an düzeltilmez** (istisna: ölçülmüş, kök nedeni ortak katmanda olan gerçek hata).

**Güncelleme:** 2026-08-05, 8. oturum sonu · **135 ekran** · 26 detay · **30 form ekranı**
**plan.md:** **187 / 274 madde (%68)** · 32 kısmen · 55 açık
**Form kuyruğu: 36 hedefin 30'u bitti, 6 kaldı** · **Doküman bloğu: 12'nin 3'ü bitti**

**Son taramalar (hepsi bu oturumda, DÜZELTİLMİŞ harness ile):**
**8. oturum kapanışında koşuldu:** `rec.js` **56/56 hedef** (her ekran gerçek kayıtla açıldı) ·
`esc.js` / `mut.js` / `listen.js` 7 hedef, **3/3 kayıt yüklendi**, üçü de temiz ·
`dbref.js` **135 ekran** · `links.js` temiz · `canon.js` **601 kontrol** temiz.
**Koşulmadı:** `gate.js` tam süpürmesi (135 ekran × 5 rol) — 8. oturumda zaman yetmedi,
9. oturumun ilk QA işi.

---

## 1. KALAN İŞ — SIRAYLA

### A. Form kuyruğu: 6 hedef kaldı
`node links.js` çıktısı **canlı kuyruktur**, elle sayma.

> **8. oturum notu — YARIM DOSYA YOK.** Bu altısı için ajan açıldı ve **sekizi de API
> hatasıyla düştü** (5 saatlik oturum tavanı). Hepsi tam olarak "şimdi dosyayı yazıyorum"
> anında, `Write` çağrısından **önce** kesildi — diske **hiçbir şey yazılmadı**, doğrulandı.
> Yani sıfırdan başlanacak, kurtarılacak yarım dosya aranmasın.

| Ekran | Kaynak liste | Ekrana özel kritik nokta |
|---|---|---|
| `app-arac-sigorta-form.html` | `app-arac-sigorta.html` | trafik + kasko **ayrı poliçe ekseni** (`tur` ayırır, tek kayıtta birleştirme); yenileme eşikleri 60/30/15/7 gün, `app-arac-detay.html` ile aynı |
| `app-arac-yakit-form.html` | `app-arac-yakit.html` | `tutar = litre × birimFiyat` (pompa fiyatı **KDV dahil**; `YKT-2026-088` 52,4 × 48,9 = 2.562 ile doğrulandı) · km monotonluğu |
| `app-arac-gider-form.html` | `app-arac-gider.html` | 18 gider kalemi liste süzgecinden · gider→bakım/poliçe **bağ alanı veride YOK**, uydurma |
| `app-arac-kaza-form.html` | `app-arac-kaza.html` | **iki ayrı koleksiyon**: `DB.accidents` + `DB.fines` — tek kayıtta birleştirme, kod öneki hangisi olduğunu söyler |
| `app-destek-paket-form.html` | `app-destek-paket.html` | **kota aritmetiği**: `kullanilan + kalan = aylikSaat × dönem ayı`, ayrıca `kalan` = müşterinin taleplerindeki `kalanDestek`. İkisi de türetilir, elle girdirilmez · `tutar` **NET** |
| `app-performans-form.html` | `app-performans.html` | karar desteği — **otomatik karar üretmez**; puan ölçeği veriden ölçülür, varsayılmaz |

**Filo para ekseni artık yazılı** (8. oturumda ölçüldü, components.md §9b): `maintenance.maliyet` ·
`policies.prim` · `vehicleExpenses.tutar` · `fuelLogs.tutar` hepsi **BRÜT (KDV dahil)** —
gider kaydı kaynak tutarı olduğu gibi taşıyor (8 kaydın 3'ü birebir eşleşti). Etikette
"(KDV dahil)" yazılır.

**Üretim yöntemi (7. oturumda oturdu, aynen uygula):**
1. **Aynı anda en fazla 3 ajan**, her biri tek dosya. Prompt'a şu üç maddeyi MUTLAKA yaz:
   - "**Playwright kurma, HTTP sunucu başlatma, `tasks/qa/` kopyalama**" — yoksa ajan başına
     10+ dakika QA kurulumuna gider, tam taramayı zaten orkestratör koşar.
   - "**Yorum satırlarında bile var olmayan bir `DB.<koleksiyon>` adı yazma**" — `dbref.js`
     yorumu da okuma sayıyor, iki ajan bu tuzağa düştü.
   - "**`GV.empty({desc})` ve `GV.notice` metinlerini ön-escape etme**" — bileşen zaten escape
     ediyor (UID-23).
2. **Ajanları başlat → TEK bekleme yap → topla.** Ara kontrol için shell açma. Bekleme kalıbı:
   `until [ -f a ] && [ -f b ] && [ -f c ]; do sleep 30; done; sleep 90`
3. Gelen dosyayı doğrula: satır sayısı · `<style>` 0 · `href="#"` 0 · `<body>` etiketi ·
   inline script `node --check`.
4. `shell.js` **`BUILT`** dizisine + `tasks/qa/rec.js` **MAP**'ine ekle.
5. QA: `node rec.js` → `qa.js` → `esc.js` → `mut.js` → `listen.js` → `dbref.js` → `links.js`.
   **Hedef kodunu tahmin etme**, `qa-targets.json`'dan al (bir kez yanlış tahmin edildi, harness
   yakaladı — L-19 çalışıyor).
6. Dosya dosya stage → commit → push → **`plan.md`'yi aynı turn içinde işaretle**
   (başlıktaki ilerleme satırı da güncellenir).

### B. Doküman çıktıları — 12'nin 3'ü bitti, **9 kaldı**
`plan.md` **G. DOKÜMAN ÇIKTILARI**: PROMPT.md **§26**'nın B'den M'ye 12 çıktısı.
Çıktı yeri **`docs/`** — klasör açıldı, `docs/*.md` **repoda izleniyor**
(`docs/screenshots/` ignore).

**Biten üç (8. oturum):**
`docs/C-modul-haritasi.md` (252 satır · 15 modül, 89 alt modül, 7 kolonlu tablo) ·
`docs/D-rol-yetki-matrisi.md` (187 satır · 27 rol × 9 kolon) ·
`docs/E-menu-sayfa-haritasi.md` (423 satır · 15 bölüm, 89 menü kalemi, 135 ekran, tip dağılımı).

**Kalan dokuz:** B yönetici özeti · F sayfa analizleri · **G veri modeli** · H iş akışları ·
I API ve teknik servisler · **J otomasyonlar** · K raporlar · L yol haritası ·
M eksik ve ek öneriler. (G ve J için ajan açıldı, ikisi de API hatasıyla düştü —
**dosya yazılmadı**, sıfırdan başlanacak.)

**Üç dokümanın ortaya çıkardığı ve doğrulanması gereken iki bulgu:**
1. **`DB.permMatrix` 11 eksen saklıyor**, `app-ayar-yetki.html` bunlardan **19 boolean eksen
   türetiyor** — plan.md ve PROMPT.md'nin "20 yetki ekseni" sayısının kodda karşılığı yok.
   D dokümanı bunu dürüstçe yazdı; sayının hangisinin doğru olduğu **karara bağlanmalı**.
2. **`plan.md` C bölümündeki menü haritası `shell.js`'teki gerçek menüden farklı** — plan'da
   Fırsatlar · Modüller · Kanban · Gantt · Klasörler · Riskli Müşteriler · Tamamlananlar var,
   kodda yok. C dokümanı **kodu esas aldı**; plan.md'nin menü tablosu güncellenmeli ya da
   eksik menü kalemleri açılmalı.

**Yöntem notu:** doküman ajanı ekran ajanından **çok daha ucuz ve hızlı** (3 doküman ~3,5 dk,
~55k token). Ekran işi tıkanırsa doküman bloğu paralel ilerletilebilir.

### C. Wave 13 kapanış
- Tüm `data-wip` bağlantıların gerçek `href`'e dönmesi (form kuyruğu bitince kendiliğinden).
- **UID-20**: form ekranlarına **düzenleme modundan bağlantı** — `GV.list` `rowActions`'a
  "Düzenle" + detay ekranlarının `GV.pageHead` aksiyonlarına "Düzenle". **Tüm formlar bitince
  tek turda**; parça parça yapmak `links.js` kuyruğunu yanıltır.
- PROMPT.md §22'deki **38 modüller arası bağlantının** doğrulanması.
- `gate.js` tam süpürmesi (132 ekran × 5 rol ≈ 660 yükleme, ~10 dk, arka planda koş;
  çıktıyı dosyaya yaz — `| tail` pipe'ı bitene kadar hiçbir şey yazmaz).
- 1440/768/390 tam tarama + kapanış raporu.

### D. FAZ: UI ve UX KALİTE GEÇİŞİ
**Ekran üretimi bitmeden başlanmaz.** `ui-debt.md`'de **21 açık UID + 14 açık VB**.
En büyük üçü:
- **VB-19** — teklif → sözleşme aktarımı **KDV'yi iki kez uyguluyor** (3/3 sistematik, iki ajan
  bağımsız doğruladı). Zincirin çapası olduğu için taksit–fatura–tahsilat–ciro ile **aynı turda**.
- **UID-23** — `GV.empty` `desc` **43 ekranda çift escape**. Tek süpürme + sözleşme yazımı.
- **VB-14/17/22** — altı eksenin sözlüğü yok (kanal · süre birimi · proje durum/sağlık/faz ·
  hata durumu · teslim kontrolü). Üçü aynı sınıf, tek turda.

---

## 2. BU OTURUMDA (7.) NE YAPILDI — ÖZET

### İŞ 1 — sahte yeşiller temizlendi (ders **L-19**)
L-17'nin ayraç düzeltmesi yetmemişti: dört tarayıcı hedefe **hiç `?id=` verilmeden**
çağrılabiliyordu; o zaman detay ekranı boş durumu (ya da sessizce ilk kaydı) basıyor, araç
yine "TEMİZ" diyordu. Kalıcı çözüm iki yeni dosya:
- **`tasks/qa/rec.js`** — her detay/form ekranı için veriden gerçek kayıt kodu seçer, kaydın
  yüklendiğini ölçer, `qa-targets.json`'a yazar.
- **`tasks/qa/qa-lib.js`** — dört tarayıcı hedefi oradan okur; `?id=` taşıyan hedefte kayıt
  yüklenmediyse **hata sayar**. Her rapor artık iki sayı verir: taranan ekran · yüklenen kayıt.

Düzeltilmiş harness ile yeniden koşulan taramaların hepsi temiz çıktı — ekranlarda hata yoktu,
**hatalı olan araçtı**.

### 8. OTURUM — kısa özet
**Blok 0:** `.gitignore`'daki `tasks/` satırı kaldırıldı. Dosyalar zaten tracked'di ama kural
yüzünden commit'li kopyalar 6. oturumda donmuştu (`plan.md` 157/274, `handoff.md` 108 ekran).
Sekiz defter güncellendi, üçü (`detay-brief` · `research` · `todo`) ilk kez repoya girdi.
**Klonlayan artık gerçek durumu görüyor.**

**Blok A:** üç filo formu (`arac` · `arac-bakim` · `arac-muayene`) üretildi ve taramadan geçti.
Altı form + iki doküman ajanı API hatasıyla düştü, **dosya yazmadılar**.

**Düzeltilen gerçek hata:** `app-arac-muayene.html` sonuç kolonu `Geçti`→"Onaylandı",
diğerini "Reddedildi" basıyordu; oysa kendi süzgeci `Geçti`/`Kaldı` sunuyor ve arama ham
değerde çalışıyordu — aynı kayıt kolonda başka, süzgeçte başka okunuyordu. Sözlük ikisini de
tonluyor, ham değere çevrildi.
**Ayrıca:** `app-arac-form.html` başlığı kayıt kodu yerine plakayı taşıyordu (form-brief §2
ihlali); `rec.js` bunu "kayıt yüklenmedi" diye yakaladı — L-19 harness'ı çalışıyor.

### 7. OTURUM — form ekranları: 3 → 27 (24 yeni ekran)
Satış/müşteri 8/8 · proje-görev 7/7 · destek-iş talebi 2/3 · personel 2/3 · demirbaş-filo 2/9 ·
satın alma-finans 5/5 · toplantı 1/1.

### Ortak katmanda düzeltilen GERÇEK hatalar (hepsi ölçülerek)
| Nerede | Hata |
|---|---|
| `ui.css` | **Anahtar (switch) görünmüyordu** — `.field label{display:block}` `.f-switch{inline-flex}`'i eziyordu, `.sw` genişliği **0**. Düzeltme sonrası 40×24 px. Regresyon: `tasks/qa/swtest.js` |
| `ui.js` | **`required` radyoda hiç çalışmıyordu** — doğrulama grubun ilk düğmesini okuyordu, `read()` doğru okuyordu; eşitlendi |
| `app-musteri-detay.html` | iletişim kodu dizi uzunluğundan · `sonIletisim` koşulsuz yazılıyordu (geçmişe dönük kayıt tarihi geri çekiyordu) · sözlükte olmayan `Mesaj` kanalı |
| `app-istalebi.html` | "Göreve dönüştür" kodu dizi uzunluğundan **ve** hiçbir bağ yazmıyordu |
| `app-izin.html` | bakiye düşümü clamp'siz — bakiye eksiye düşebiliyordu (detay ekranı clamp'liydi) |
| `app-proje-hata-detay.html` | yasak ayna alan `DB.tasks[].hata` yazıyordu (canon statik veride göremiyordu) |
| `app-proje-test-form.html` | arşivli projeye koşum açılabiliyordu |
| `ops.js` | SLA yorumu yanlış alanı gösteriyordu (`cozum` değil `etiket`) |
| `app-demirbas-detay.html` | yorum "sipariş alanı yok" diyordu, oysa VB-07'de yazılmıştı |

### Veriye yazılan eksenler (hepsi ölçülerek doğrulandı)
`DB.referrers` sayaçları ve `ciro` (NET, ömür boyu) · `DB.analyses[].maliyet` (teklifin indirim
öncesi neti — ad yanıltıcı, VB-16) · `isgucu` saat ekseni · `DB.tests` senaryo sayım eşitliği
(5/5, durumdan bağımsız) · `DB.suppliers` ömür boyu sayaçları (kart ≥ sistemden hesaplanan, 6/6) ·
`components.md` §9b'ye üç yeni satır (`projects.butce/gerceklesenMaliyet`, `employees.maas`,
`analyses.maliyet`, `referrers.ciro/hakedis`).

### Yeni borç kayıtları
**VB-12..25** (14 madde) ve **UID-21..24**. Tamamı `ui-debt.md`'de ölçümüyle yazılı.

---

## 3. QA KOMUTLARI

```bash
SP=<scratchpad>
cd $SP && npm init -y && npm i playwright@1.62.1
mkdir -p $SP/qa-run && cp <repo>/tasks/qa/*.js $SP/qa-run/
ln -sfn $SP/node_modules $SP/qa-run/node_modules

cd <repo> && python3 -c "
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
ThreadingHTTPServer(('127.0.0.1',8791), SimpleHTTPRequestHandler).serve_forever()" &

cd $SP/qa-run
node rec.js                       # ÖNCE BU — qa-targets.json üretir
node qa.js "app-x.html" [rol]     # 1440/768/390 · konsol · taşma · <style> · href="#"
node tabs.js                      # hedefsiz çağrı = qa-targets.json'daki 26 detay ekranı
node esc.js                       # 108+ ekran; detay/form hedefleri ?id= ile açılır
node mut.js · node listen.js      # hedefsiz çağrı = tüm doğrulanmış hedefler
node canon.js                     # 601 kontrol
node dbref.js · node links.js · node swtest.js · node grip-qa.js
node gate.js > gate-out.txt       # tüm ekranlar × 5 rol, ~10 dk, arka planda
```

> **L-19:** Her tarama raporunda **taranan ekran** ve **yüklenen kayıt** sayısı ayrı yazılır.
> Sıfır kayıtla taranan ekran varsa tarama **geçersizdir**, "TEMİZ" yazsa bile.

**Commit:** `git add -A` yasak, dosya adıyla tek tek. Conventional Commits, İngilizce. Sonu:
```
Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_01AFZ22KYDzKSD4GXaoq6gpi
```

---

## 4. ÇALIŞMA MODELİ

- **Orkestratör:** ortak katmanın tek sahibi — `assets/**`, `tasks/**`, `BUILT`, QA, commit, push.
- **Subagent:** tek HTML ekranı, başka dosya yok, git yok, QA kurulumu yok. **En fazla 3.**
- Ajan raporlarındaki iddialar **ölçülerek** doğrulanır. 7. oturumda 24 ajan raporu
  **dokuz gerçek hata** ve **beş yazılmamış eksen** ortaya çıkardı; bir iddiada da ajan haklı
  çıkıp prompt'u düzeltti (`app-komisyon-form` `data-sec`).
- Arayüz sorunu düzeltilmez, `ui-debt.md`'ye yazılır.
- **Bekleme disiplini:** ajanları başlat → tek bekleme → topla. Yoklama döngüsü yasak
  (6.–7. oturumda bu hata yapıldı, 30'dan fazla gereksiz shell ve büyük token kaybı).

## 5. DERSLER — `tasks/lessons.md` (L-01..L-19)
En sık ihlal edilen: **L-12** (okunan koleksiyonun dosyası yüklü olmalı) · **L-13** (bağ yazılır,
türetilmez) · **L-14** (etiket escape) · **L-15** (`GV.refresh`, reload değil) ·
**L-16/L-18** (dinleyici ve overlay) · **L-19** (tarama hedefi kayıtla doğrulanır).

**Genel ders — dört ikiz:**
"konsol temiz" ≠ "ekran doğru" (L-14) · "toast çıktı" ≠ "işlem oldu" (L-15) ·
"test aracı TEMİZ dedi" ≠ "doğru şeyi ölçtü" (L-17) ·
**"araç doğru adresi kurdu" ≠ "doğru kaydı yükledi" (L-19).**
