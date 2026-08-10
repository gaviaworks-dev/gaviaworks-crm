# R. Prototip Kapsamı — Kapanış Raporu

> Bu tur, `docs/Q-cloud-turu-kapanis.md` §5'te "prototipte yapılabilir olup
> yapılmayan" diye sayılan **altı paketi** ele aldı. Kapsam sınırı değişmedi:
> backend gerektiren 164 madde bu turda da açık ve onlara dokunulmadı.

**Dal:** `main` · **Canlı:** `https://gaviaworks-dev.github.io/gaviaworks-crm/`

---

## 1. Sayılar

| | |
|---|---:|
| Commit | 37 |
| Değişen dosya | 73 |
| Eklenen / silinen satır | +9.627 / −1.846 |
| Ekran (önce → sonra) | 146 → 148 |
| Yeni ekran | 2 (`app-notlarim` · `app-not-form`) |
| Yeni veri dosyası | 2 (`notes.js` · `reports.js`) |
| Yeni ortak servis | 3 (`GV.sales` · `GV.notes` · `GV.test`) |
| Yeni ortak API ailesi | 3 (`GV.afterSave` · `GV.cell` · `GV.cols`) |
| Yeni geçiş varlığı | 1 (`employee` — 14 → 15) |
| Yeni kapı | 2 (`personelEvrak` · `personelZimmet`) |
| Yeni ölçüm ekseni | 5 (`aftersave` · `html-js` · `formtab` · `reg` · `notes-isolation`) |
| Düzeltilen ölçüm ekseni | 2 (`xport` · `dep`) |
| Yeni ADR | 4 (ADR-18…21) |
| Yeni ders | 2 (L-40 · L-41) |

---

## 2. Tarama seti — 24 eksen, tek tek koşuldu

Hepsi **temiz** (exit=0). Sıfır bulgu, sıfır ölçüm hatası.

| Eksen | Sonuç | Ölçek |
|---|---|---|
| `flow` | geçiş sözleşmesi · bulgu 0 | 15 varlık · 139 kayıt |
| `flow --selftest` | 5 eksenin 5'i bozuk kopyada bulgu üretti | — |
| `canon` | canonical çelişki yok | 4.522 kontrol |
| `dep` | yordam ↔ veri bağımlılığı tam | 61 ekran · 182 çağrı |
| `dbref` | yüklenmeyen dosyadan okuma yok | 148 ekran |
| `aftersave` | 39/39 form ortak yordamdan geçiyor | 39 form |
| `html-js` | inline script ayrıştı | 150 blok |
| `bag` | modüller arası bağ | 3 ekran · 12/12 kayıt |
| `akt` | aktivite sekmesi dolu | detay ekranları |
| `ctl` | boşluk ve kontrol tasarım sisteminden | 148 ekran · 205 panel |
| `links` | kırık bağ / hayalet kayıt yok | BUILT ↔ disk |
| `swtest` | anahtar görünür boyutta | — |
| `xport` | **652 kolonun tamamı çıktıya değer taşıyor** | 148 ekran · 71 liste · 868 kayıt |
| `reg` | defter ↔ ekran örtüşüyor | 105 rapor · 12 zorunlu alan |
| `notes-isolation` | 6 senaryonun 6'sı temiz | 3 kimlik · 15 kontrol |
| `qa` | konsol hatası ve taşma yok | 148 ekran × 3 kırılım |
| `esc` | ham HTML etiket yok | 148 ekran · 62/62 kayıt |
| `mut` | `GV.refresh` idempotent | 62 ekran |
| `listen` | dinleyici birikmiyor | 62 ekran |
| `tabs` | detay sekmeleri | 26 ekran · 227 tıklama |
| `gate` | 5 rolde konsol/boş sayfa yok | **740 sayfa yüklemesi** |
| `act` | 227 aksiyonun tamamı sonuç üretti | 148 ekran |
| `pers` | kod sızmıyor, ad görünüyor | — |
| `portal` | müşteri oturumunda yabancı iz yok | — |
| `formtab` | **64 sekmeli formun sözleşmesi tam** | 279 panel · 279 tıklama |

`xport.js` bu turda **kapandı**. Önceki iki turda "bilinen ve bilinçli kısmi"
olarak kayıtlıydı.

---

## 3. Paket paket ne yapıldı

### A · P2-01 form göçü — ✅ 38/38
`GV.form`'un sekme motoru hazırdı, **göç yapılmamıştı**. 36 form sekmeli kabuğa
taşındı; 2'si (`arac-gider` · `arac-yakit`) ADR-18 gereği bilerek düz bırakıldı.

Motorda **gerçek bir kusur** bulundu: sekmesi belirtilmemiş bölümü ilk panele
düşüren güvenlik ağı `html.replace('</div>', …)` ile kuruluydu ve bölümü hata
özeti kutusunun **içine** basıyordu. Kural yazılıydı, hiç çalışmamıştı (L-31
sınıfı). Kök nedenden düzeltildi ve `formtab.js` T3 eksenine bağlandı.

### B · P2-02 kayıt sonrası detay — ✅ 39/39
34 formda `/* … normal akış listeye dönmektir. */` yorumu iki hükmü tek cümleye
yapıştırmıştı: `location.reload()` yasağı (doğru, L-15) ve "listeye dön"
(şartname [3.1.16] ile çelişik). İkincisi ADR-19 ile tersine çevrildi.

Hedefi artık **yordam seçer**: detay ekranı `BUILT`'te ve dosya adı ekseninde
yetki varsa `detay?id=KOD`, yoksa liste. 26 form detaya, 12 form listeye gidiyor
ve şerit bunu kullanıcıya dürüstçe söylüyor. Alt kayıt bağlantıları iskeletteki
tek kullanımlık `#gvFlash` şeridine düşüyor — 26 detay ekranı tek tek
yamalanmadı. **Ders L-40** buradan çıktı.

### C · P3-01 dönüşüm sihirbazı — ⏳ ikisi bitti, biri açık
`GV.sales` kuruldu: beş eksenli mükerrer araması (vergi no *kesin*,
unvan/e-posta/telefon/alan adı *işaret*), üç yollu karar penceresi, ve
"Kazanıldı" zinciri (müşteri → sözleşme taslağı → bedeli tam bölen ödeme planı →
proje taslağı). Zincir **idempotent** (ölçüldü: ikinci koşumda müşteri 13→13) ve
hata hâlinde ürettiği her kaydı geri alıyor.

Ajan raporları serviste iki gerçek kusur buldu: `DB.quotes` KDV oranını
`vergiOran`, `DB.contracts` `kdvOran` diyor — sessizce %20'ye düşüyordu ve
bugünkü verinin tamamı %20 olduğu için **kusur veri sayesinde görünmüyordu**;
proje alan adları şemayla uyuşmuyordu. İkisi de düzeltildi.

**Yapılmadı:** teklif sürümleme. Revizyon hâlâ aynı kaydı yerinde değiştirip
sayacı artırıyor; ayrı sürüm kaydı üretmiyor ve eski sürüm kilitlenmiyor.
Ekran bunu `app-teklif-detay.html` içinde kullanıcıya zaten söylüyor.

### D · P3-03 test modeli · P3-06 İK — ⏳ model kuruldu, ekran kısmi
**Test:** 9 varlık açıldı (`testPlans` · `testCases` · `testSteps` · `testRuns` ·
`testCaseResults` · `testEvidence` · `builds` · `environments` + türetilen
sayaç). `GV.test.sayac()` sayacı artık **türetiyor** ve dönüşü her zaman
`turetilmis` bayrağı taşıyor.

⚠️ **Eski beş koşum için senaryo UYDURULMADI** (L-13). TST-2026-018 "62 senaryo,
3 başarısız" diyor ama hangi üçü olduğu veride yok. O beş kayıt
`senaryoDetayi:false` ile işaretlendi; sayaçları korunuyor ve ekran "bu koşumun
senaryo dökümü yok" diyor. Model **ileriye** doğru çalışıyor, geçmişi yeniden
yazmıyor. Veri tarafı bu yüzden kısmi: 1 plan, 1 koşum, 5 senaryo.

**İK:** `employee` 15. geçiş varlığı olarak eklendi (Taslak → Onboarding → Aktif
→ İzinli/Pasif → Offboarding → Ayrıldı). İki kapı **uygulanıyor**:
`personelEvrak` (zorunlu onboarding adımı eksikken Aktif olunamaz) ve
`personelZimmet` (aktif zimmet varken Ayrıldı olunamaz — ölçüldü, EMP-005'te
doğru gerekçeyle reddediyor). Onboarding şablonları mevcut üç süreçten
**türetildi**, onlara dayatılmadı; ilk gerçek çıkış kaydı açıldı (önce 0'dı).

**Yapılmadı:** ekran tarafı. `durum` alanı hiçbir ekranda okunmuyor, `aktif`
boolean'ı paralel duruyor; şablondan süreç doğuran yordam yok; zimmet kabulü
çelişkisi (envanter tutanak kaydedilirken güncelleniyor) açık.

### E · P4-01 registry · P4-02 export — ⏳ eksen kapandı, biçim backend
**`xport.js` kapandı** ama kök neden defterdekinden farklı çıktı (L-28). Defter
"22 ekranda `exportValue` yok" diyordu; ölçüldüğünde tamamen boş kolon **sıfır**,
kısmi **24** çıktı ve 24'ün 24'ü tek sınıftı: kolonun ekranda gösterdiği değer
`render`'dan türüyor, çıktı `r[c.key]`'e bakıyordu. Çözüm 22 nokta yaması değil,
`exportCell`'de tek satırlık sözleşme oldu.

**Eksenin kendisinde iki kusur bulundu:** (a) yokluğu anlatan yer tutucuları
("Zimmetsiz" · "Vekil yok") ihlal sayıyordu — artık ayrı sayaçta; (b) çıktı
kuralını **kendi içinde kopyalıyordu** ve kural üründe bozulduğunda yine "TEMİZ"
diyordu — artık ürünün `exportCell`'ini çağırıyor. İkisi de bozulmuş kopyada
sınandı.

7 rapor sayfasının kopya prelude'ü ortak `GV.cell`/`GV.cols` fabrikalarına
taşındı (**−1.298 satır**); tarih ve durum kolonları artık ortalanıyor (göç
öncesi `cellClass:'center'` sayısı **sıfırdı**). `DB.reportRegistry` 105 kayıt
olarak **ekranlardan üretildi** ve `reg.js` defter↔ekran ayrışmasını dört
hükümle denetliyor.

**Yapılmadı:** XLSX ve PDF hâlâ gerçek biçim değil ("Excel" tab ayraçlı `.xls`
metin, "PDF" yazdırma penceresi). Bu backend payıdır ve şartname anlamında
"tamamlandı" sayılmaz ([22.0.11]).

### F · P4-03 Notlarım · P1-09 test ağı — ✅
Negatif yetki ağı **modülden önce** yazıldı ve modül yokken "MODÜL YOK, yeşil
değildir" diyerek kırmızı kaldı ([22.0.11]).

Gizlilik modeli iki karara oturdu. **ADR-20:** erişim kapısı rol matrisinde değil
**sahiplikte** — `sahip` ve `sistem` dahil kimse başkasının notunu göremez, ve
başkasının ID'sinde "yetkin yok" değil **"yok"** denir (hata mesajı bile kaydın
varlığını sızdırmamalı). **ADR-21:** kişisel koleksiyon **kendi veri
dosyasında** — kurumsal ekranlar `notes.js`'i yüklemez, yani sızıntı yolu
fiziksel olarak kapalı. Denetim defterine tek satır yazılmıyor; bu yokluk
bilinçli ve kodda gerekçesiyle yazılı.

Ağın kendisinde iki ajan bağımsız olarak **gerçek bir kusur** buldu: N2 ekseni
hedefin *kendi sahibiyle* koşuyordu, yani modül doğru çalışsa bile sızıntı
basacaktı. Ayrıca sunucu ölünce "özellik yok" diyordu; artık "GEÇERSİZ" diyor.
Düzeltilmiş ağ bozulmuş kopyada **7 sızıntı** yakaladı, gerçek kodda 6/6 temiz.

---

## 4. Ölçüm araçlarında bulunan kusurlar

Bu tur, üründen çok **ölçüm katmanında** kusur çıkardı. Hepsi L-17/L-24/L-26/
L-27 ailesinden: *araç sessizce yanlış yere bakabilir.*

| Araç | Kusur | Sonucu |
|---|---|---|
| `xport.js` | çıktı kuralını kendi içinde kopyalıyordu | kural üründe bozulunca yine "TEMİZ" diyordu |
| `xport.js` | yer tutucu cümleleri ihlal sayıyordu | 24 sağlıklı kolon kırmızıydı |
| `xport.js` | `\s` şablon dizesinde kaçmıyordu | ölçüm metninden **harf siliyordu** ("Zimmetsiz" → "Zimmet iz") |
| `dep.js` | isim alanı deseni `= [A-Z]` arıyordu | IIFE ile kurulan `GV.notes` ve `GV.sales` **hiç görünmüyordu** |
| `dep.js` | sözleşme satırında imzalı adı okuyamıyordu | tablo satırı yazılsa da tanınmıyordu |
| `formtab.js` | `.gv-form-sec` sınıfını belge genelinde sayıyordu | sayfanın kendi kartlarını "panel dışı bölüm" sanıyordu (**L-41**) |
| `notes-isolation.js` | superadmin vakasını notun sahibiyle koşuyordu | modül doğru çalışsa bile sızıntı basardı |
| `notes-isolation.js` | ölü sunucuyu "özellik yok" sayıyordu | geçersiz ölçümü eksik özellik gibi raporluyordu |

`dep.js` düzeltildikten sonra kapsam **57 → 61 ekran, 157 → 182 çağrı** çıktı.

---

## 5. Prototipte yapılabilir olup HÂLÂ yapılmayanlar

Dürüstlük gereği:

| Madde | Durum |
|---|---|
| Teklif sürümleme (revizyon = yeni kayıt, eski kilitli) | P3-01'in üçüncü maddesi — **yapılmadı** |
| İK ekran tarafı (`durum` okuma, `aktif` ekseninin kaldırılması) | **yapılmadı** — veri ve kapı hazır |
| Onboarding şablonundan süreç doğuran yordam | **yapılmadı** — şablon veri olarak var |
| Zimmet kabulü çelişkisi (envanter tutanak kaydında güncelleniyor) | **açık** |
| Test verisi (1 plan · 1 koşum · 5 senaryo) | model tam, **veri kısmi** |
| P1-08 entegrasyon hata kuyruğu **ekranı** | koleksiyon boş ve bilerek boş, ekran yok |
| P3-02 milestone/sprint ekranları · P3-04 tedarikçi faturası · P3-07 bilgi bankası | **yapılmadı** |

## 6. Backend gerektiren ve bu turda dokunulmayanlar

- **Notlarım gerçek izolasyonu** ([15.4.1]–[15.4.3]) — owner süzgeci istemcide.
  Modül canlıya çıkmadan kapatılması **zorunlu** bir açık.
- **XLSX ve PDF gerçek biçim** ([14.4.1]) — bugünküler taklit.
- Sunucu tarafı doğrulama, kalıcı append-only denetim defteri, idempotent işlem,
  gerçek kuyruk/retry — 164 madde, ayrı ürün kararı.

---

## 7. Bu turun iki dersi

**L-40 — bir kural N dosyada yaşıyorsa o kural ortak katmana aittir.**
"Kaydettikten sonra nereye gidilir" 38 ayrı `kaydet()` sonunda yaşıyordu ve
henüz tersine çevrilmeden **dört ayrı lehçeye** ayrılmıştı. Karar tek yordamda
toplanınca kuralı tersine çevirmek 38 dosyalık değil tek gövdelik iş oldu.

**L-41 — bir CSS sınıfı tek bileşenin mülkü değildir.**
Bileşenin ürettiği düğümleri ölçen eksen kapsamını o bileşenin **kök düğümüyle**
sınırlar, sınıf adıyla değil.
