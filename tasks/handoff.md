# Handoff — GaviaWorks CRM

> Sıfırdan gelen bir Claude'un **hiçbir şey sormadan** devam etmesi için yazıldı.
> Sırayla oku: bu dosya → `tasks/plan.md` → `tasks/components.md` → `tasks/lessons.md` → `tasks/ui-debt.md`.
>
> **İLK İŞ:** QA kurulumu (bölüm 4). Script'ler `tasks/qa/` altında **repoda izleniyor** — yeniden
> yazma, kopyala. Kurulumdan sonra **`node rec.js`** koş: tarama hedeflerini o üretir (ders **L-19**).
> **`tasks/form-brief.md`** = form ekranı sözleşmesi · **`tasks/detay-brief.md`** = detay ekranı sözleşmesi.
> **`tasks/ui-debt.md`** = arayüz + veri borç defteri. Üretim sırasında görülen sorun oraya yazılır,
> **o an düzeltilmez** (istisna: ölçülmüş, kök nedeni ortak katmanda olan gerçek hata).

**Güncelleme:** 2026-08-04, 7. oturum sonu · **132 ekran** · 26 detay · **27 form ekranı**
**plan.md:** **181 / 274 madde (%66)** · 32 kısmen · 61 açık
**Form kuyruğu: 36 hedefin 27'si bitti, 9 kaldı** (aşağıda liste)

**Son taramalar (hepsi bu oturumda, DÜZELTİLMİŞ harness ile):**
`gate.js` 540 yükleme (108×5 rol, form ekranları eklenmeden önce) · `rec.js` **53/53 hedef** ·
`tabs.js` 26 detay, 26/26 kayıt, 223 sekme · `esc.js` 108 ekran · `mut.js` / `listen.js` 44+ hedef ·
`canon.js` **601 kontrol** · `dbref.js` **132 ekran** · `links.js` temiz.

---

## 1. KALAN İŞ — SIRAYLA

### A. Form kuyruğu: 9 hedef (hepsi filo + iki tekil)
`node links.js` çıktısı **canlı kuyruktur**, elle sayma.

| Ekran | Kaynak liste | Not |
|---|---|---|
| `app-arac-form.html` | `app-arac.html` | §16 kimlik + satın alma/kiralama |
| `app-arac-bakim-form.html` | `app-arac-bakim.html` | |
| `app-arac-muayene-form.html` | `app-arac-muayene.html` | sonuç Geçti/Kaldı + sonraki muayene |
| `app-arac-sigorta-form.html` | `app-arac-sigorta.html` | trafik + kasko ayrı poliçe ekseni |
| `app-arac-yakit-form.html` | `app-arac-yakit.html` | |
| `app-arac-gider-form.html` | `app-arac-gider.html` | 18 gider kalemi |
| `app-arac-kaza-form.html` | `app-arac-kaza.html` | kaza / hasar / ceza tek ekran |
| `app-destek-paket-form.html` | `app-destek-paket.html` | **kota aritmetiği**: `kullanilan + kalan = aylikSaat × ay` bozulmayacak |
| `app-performans-form.html` | `app-performans.html` | otomatik karar YOK, karar desteği |

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

### B. Doküman çıktıları — **hiç ele alınmadı**
`plan.md` **G. DOKÜMAN ÇIKTILARI**: PROMPT.md **§26**'nın B'den M'ye 12 çıktısı.
Kolon şemaları §26'da yazılı (C modül haritası 7 kolon, D yetki matrisi 9 kolon,
J otomasyonlar 6 kolon). Kaynak: `plan.md` + `components.md` + `assets/data/*.js` —
**uydurulmaz, türetilir**. Çıktı yeri: **`docs/`** (yeni klasör, gitignored DEĞİL;
`docs/screenshots/` gitignored ama `docs/*.md` değil).
Sıra: B yönetici özeti · C modül haritası · D rol/yetki matrisi · E menü ve sayfa haritası ·
F sayfa analizleri · G veri modeli · H iş akışları · I API ve teknik servisler ·
J otomasyonlar · K raporlar · L yol haritası · M eksik ve ek öneriler.

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

### İŞ 2 — form ekranları: 3 → 27 (24 yeni ekran)
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
