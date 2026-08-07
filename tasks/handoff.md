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

**Turun durumu (16. oturum sonu, 2026-08-07):**

| Adım | Durum |
|---|---|
| Adım 0 — talimatı repoya al | ✅ `tasks/revize-talimati.md` |
| Adım 1 — ölç + defter yaz | ✅ 20 maddenin 20'si ölçüldü · `tasks/revize-plan.md` |
| **FAZ 1 · R01** görev durumlarını sadeleştir | ✅ **TAMAM** (8/8 alt madde) |
| **FAZ 1 · R02** görev geçiş algoritması | ✅ **TAMAM** (7/7 + kuyruk 2/2) |
| **FAZ 1 · R03** timesheet → gerçekleşen süre | ✅ **TAMAM** (8/8 · görev **ve** proje ucu) |
| **FAZ 1 · R04** timesheet + gider → gerçek maliyet | ✅ **TAMAM** (9/9) |
| **FAZ 1** | ✅ **KAPANDI** |
| **FAZ 2 · R05** proje durumu / faz ayrımı | ✅ **TAMAM** (7/7 · VB-20 kapandı) |
| **FAZ 2 · R06** milestone / ödeme ayrımı | ✅ **TAMAM** (7/7) |
| **FAZ 2 · R07** proje kapanış kontrolü | ✅ **TAMAM** (7/7) |
| **FAZ 2 · R08** proje → bakım/destek geçişi | ✅ **TAMAM** (5/5) |
| **FAZ 2 · R09** ticket detayları | ✅ **TAMAM** (7/7) |
| **FAZ 2 · R10** ticket → görev / CR / fırsat | ✅ **TAMAM** (6/6) |
| **FAZ 2** | ✅ **KAPANDI** |
| **FAZ 3 · R11** proje kaynağı | ✅ **TAMAM** (7/7 · canon eksen 35) |
| **FAZ 3 · R12** sözleşme sorumlusu | ✅ **TAMAM** (6/6 · canon eksen 24c) |
| **FAZ 3 · R13** müşteri portalı | ✅ **TAMAM** (11/11 · yeni eksen `portal.js`) |
| **FAZ 3 · R17** hizmet paketi / abonelik | ✅ **TAMAM** (7/7 · canon eksen 36) |
| **FAZ 3** | ✅ **KAPANDI** |
| **Ölçüm ekseni: `tasks/qa/dep.js`** | ✅ yeni — L-34'ün (yordam ↔ koleksiyon bağımlılığı) tarama karşılığı |
| İşaretli alt madde | **105 / 138** |
| **Sıradaki: FAZ 4** — R14 · R15 · R16 · R18 · R19 · R20 | ⬜ açık (33 alt madde) |

> **İLERLEME ARTIK MEKANİK ÖLÇÜLÜYOR.** `revize-plan.md`'deki 138 alt maddenin
> kaçının bittiği damgadan değil kutudan okunur:
> ```bash
> echo "$(grep -c '^- \[x\]' tasks/revize-plan.md) / $(grep -c '^- \[[ x]\]' tasks/revize-plan.md)"
> ```
> Kutu **yapılan iş doğrulanarak** işaretlenir ve bir alt madde bitince **aynı
> turn içinde** işaretlenir. Damga ile kutu çelişirse **kutu doğrudur**.

**Tarama (15. oturum sonu · FAZ 2 kapanışı):** `canon.js` **4.027 kontrol ·
TEMİZ** — **34 eksen** (yeni: **29** proje durumu/fazı · **30** milestone ↔ ödeme
taksiti · **31** proje kapanış kontrolü · **32** proje → bakım paketi ·
**33** destek talebi şeması · **34** talepten doğan kayıtlar). Altısı da bilinçli
bozulmuş bir kopyayla, olumlu **ve dört-altı ayrı olumsuz** vakayla sınandı
(L-24 · L-26), scratchpad'de, repo dosyasına dokunmadan.

**Tam tarama seti (FAZ 2 kapanışında, tek tek koşuldu):** `dep.js` TEMİZ
(142 ekran · 34 çağıran ekran · 77 çağrı) · `dbref.js` TEMİZ (142 ekran) ·
`links.js` TEMİZ · `gate.js` TEMİZ (**710 sayfa yüklemesi**, konsol hatası 0) ·
`tabs.js` TEMİZ (**224 sekme tıklaması** · 26 ekran) · `act.js` TEMİZ
(**213 aksiyon** · yalan 0 · ölü 0) · `qa.js` TEMİZ (**142 ekran × 3 kırılım** —
1440/768/390, hata yok, taşma yok).

> ⚠️ **`qa.js` ~25 dakika sürüyor.** Süre kestirimi (handoff §2'de "~4 dk")
> bu makinede tutmuyor. Taramaları **art arda değil tek tek** koştur: dördü
> aynı anda koşunca boş bellek ~70 MB'a iniyor ve `tabs.js`/`act.js`
> TimeoutError'la ölüyor (aynı doygunluk Claude Code'un API bağlantısını da
> düşürdü). Uzun koşumu `nohup … > dosya &` ile müstakil başlat.

R07 ve R08'in akışları ayrıca **tarayıcıda tek seferlik** ölçüldü
(`r07.js` · `r08.js`, scratchpad): 8 checklist maddesi basılıyor · gerekçesiz
kapanış **reddediliyor** · gerekçeli kapanış durumu/tarihi/ilerlemeyi yazıyor ve
aktiviteye kişi KOD'u düşüyor · kapanmış projede buton **hiç basılmıyor** ·
bakım adımının üç dalı da çalışıyor, eksik alanda modal açık kalıp reddediyor.
`act.js` bu butonları göremez — hedef listesi `?id=` taşımayan ekranı açtığı için
kayıt yüklenmiyor ve "0 aksiyon" ölçüyor; **sıfır ölçüm temiz sayılmaz** (L-27).

**Önceki koşum (aynı oturum, R05 sonrası):** `canon.js` 3.591 kontrol · 29 eksen ·
`dep.js` **TEMİZ** (142 ekran · 27 çağıran ekran · 62 çağrı) · `dbref.js` **TEMİZ**
(142 ekran) · `links.js` **TEMİZ** · `gate.js` **TEMİZ** (142 ekran × 5 rol =
**710 sayfa yüklemesi**, konsol hatası 0 · 403 sayımı: sahip 0 · pm 57 ·
destek 88 · muhasebe 65 · stajyer 126) · `qa.js` **TEMİZ** (142 ekran × 3 kırılım).

> ⚠️ **`tabs.js` ve `act.js` KOŞMADI — sonuçları YOK.** Dördü art arda
> koşturulunca makinenin boş belleği ~70 MB'a indi; `qa.js` 4 dakika yerine
> ~25 dakika sürdü, `tabs.js` ve `act.js` `app-arac-detay.html`'de
> **TimeoutError** ile öldü. Bu bir ekran kusuru değil, koşum kusurudur —
> "temiz" sayılmadı. İkisi makine boştayken **tek tek** koşturulmalı.
> (Aynı doygunluk Claude Code'un API bağlantısını da düşürdü.)

**Önceki tur:** `canon.js` **3.469 kontrol · TEMİZ** (turun başında 2.588 · 24 eksen →
şimdi **28 eksen**). Yeni: **27** proje süre zinciri / tek onay ekseni ·
**28** proje maliyet zinciri. İkisi de bilinçli bozulmuş bir kopyayla, olumlu ve
**altı/yedi ayrı olumsuz** vakayla sınandı (L-24/L-27), scratchpad'de, repo
dosyasına dokunulmadan.

### 14. oturumda kapanan üç şey

**1. Tek onay ekseni.** "Onaylı saat" iki farklı şey demekti: `DB.timelogs[].onay`
(satır) ile `DB.timesheets[].durum` (hafta) birbirinden habersizdi ve **dört kayıt
kendi haftasıyla çelişiyordu**. `GV.zaman.onayla/iade/onaylaKayit` tek eksene
indirdi: haftalık defter **onay merciidir**; haftası onay bekleyen satır tek başına
onaylanamaz, yordam reddeder ve nereden onaylanacağını söyler.

**2. R03 proje ucu — 9.125 saatin kaderi.** `DB.projects[].harcananSure`
**kaldırıldı** (V-44'ün "beyan olarak kalsın" yarısı geri alındı → **V-45**).
Türetme kaynağı `DB.projectModules`: `round(efor × ilerleme/100)`. Çift sayım
`DB.tasks[].modul` bağıyla kesildi — defter 53 → **131 satır**, 308 → **2.369 saat**.
Canon eksen 27d her modül için `Σ defter = efor × ilerleme` eşitliğini kilitler.
**Türetilemeyen ~5.600 saat için tek bir kayıt bile üretilmedi**: dokuz projenin
ne modülü ne görevi var; `GV.proje.sure()` `kapsam:false` döndürüyor ve ekranlar
sıfır basmak yerine *"zaman defterinde bu projeye ait kayıt yok"* diyor.

**3. R04 maliyet.** `gerceklesenMaliyet` de kaldırıldı; `GV.proje.maliyet()` dört
kalemi ayrı türetiyor. **`icMaliyetSaat` alanı AÇILMADI** (→ **V-46**): içeriği
tamamen türetilebilir olduğu için `GV.hr.icMaliyet()` hesaplıyor, iki girdi
`DB.company`'de yazılı sabit. `maas` XOR `saatlikUcret` sözleşmesine dokunulmadı.
Dış kaynak kalemi **0 ₺** ve bu dürüst bir sıfırdır (→ **V-47**): hizmet
sözleşmeli tek personelin projeye bağlı zaman kaydı yok.

### 15. oturumda kapanan sekiz şey

**1. `dep.js` — L-34 artık ölçülüyor.** Üç tekrardan sonra (L-12 · L-32 · L-34)
el denetimi bırakıldı. Script sözleşmeyi **`components.md` §6b'den okur** (ikinci
kopya tutmaz), hedef listesini `qa-lib`ten alır, çağrıyı **yüklenen ortak js
dosyası üzerinden de** izler (`app-panel` → `dashboard.js` → `GV.proje.maliyet`).
Üç sınıf ihlal: veri dosyası yüklenmiyor · `domain.js` yüklenmiyor · yordamın
§6b'de satırı yok. İlk koşum **142 ekran · 24 çağıran ekran · 46 çağrı**;
tek ihlal `GV.delivery.kararlar`ın eksik sözleşme satırıydı, aynı turda kapandı.
Araç beş olumsuz vakayla sınandı ve **kendi ilk hükmünde yanıldı**: yorum
bloklarındaki yordam adlarını çağrı sayıyordu (üç sahte ihlal) — artık yorumdan
arınmış kaynağı okuyor.

**2. R05 — durum ile faz ayrıldı, VB-20 kapandı.** Sözlük 5 → 7 değer; faz
sözlüğünden `Tamamlandı` çıktı; 12 kayıt taşındı; `aktif` alanı projeden
kalktı (arşiv tek eksen); **kapanmış 7 projeye faz uydurulmadı** (V-48).
Yeni `DB.moduleStatuses` — proje durum sözlüğünden çıkan üç kelime **modül
ekseninde yaşıyor** (L-33). "Bu proje devam ediyor mu?" cümlesi yedi ekranda
ayrı ayrı yazılıydı; `GV.proje.acik/bitti/kapali/arsivli/geciken` olarak
`domain.js`'e alındı.

> ⚠️ **`canon.js` VERİ KÖKÜNÜ SABİT YOLLA TUTUYORDU → L-35.** Eksen 29'un altı
> olumsuz vakası da ilk denemede "TEMİZ" döndü, çünkü script bozulmuş kopyayı
> değil **gerçek repoyu** okuyordu. Yani "bozulmuş kopyayla sına" protokolü bu
> araçta hiç çalışmamıştı. Kök artık `qa-lib.repoRoot()`ten geliyor (`GV_REPO`
> ile geçersiz kılınabilir) ve altı vakanın altısı da yakalanıyor.

**3. R06 — milestone ile ödeme taksiti ayrıldı.** `DB.projectMilestones`
(**12 kayıt · 6 proje · para alanı YOK**) açıldı; `DB.milestones` ödeme defteri
olarak yerinde kaldı ve üstüne **isteğe bağlı** `milestone` FK'sı geldi (12/19).
İki ekran artık iki şey gösteriyor. Kayıtlar türetildi: 5'i teslimden, 7'si
tamamlanmış taksitten; `'Sözleşme peşinatı'` bilerek alınmadı (V-50).

**4. R07 — proje kapanış akışı.** `GV.proje.kapanisKontrol` sekiz maddeyi tek
yordamda döndürüyor, `GV.proje.kapat` kapatıyor. **`olculdu:false` "geçti"
değildir**: kontrol edilecek kayıt yoksa güvence de yok. Geçmeyen madde
kapanışı engellemiyor, **gerekçe** istiyor ve gerekçe aktiviteye giriyor.
`DB.company.zorunluProjeDokuman` açıldı — tanım olmadan "eksik doküman"
ölçülemez.

**5. R08 — kapanıştan bakıma geçiş.** Kapanış modalının son adımı üç dalı da
yürütüyor (Hayır · mevcut pakete bağla · yeni paket, **aynı modalda**).
`DB.supportPackages[].proje` 7/7 kayıtta tanımlı, **hiçbirinde dolu değil** —
veride yazılı bağ yok ve tarih yakınlığı bağ sayılmadı (V-52).

**6. R09 — destek talebi sözlüğü ve altı yeni alan.** `DB.ticketStatuses` ·
`DB.ticketClosedStatuses` · `DB.ticketChannels` açıldı; üç durum yeniden
adlandırıldı ve **12 tüketicinin 12'si** aynı turda taşındı (defter 9 diyordu —
L-28 örüntüsü). Altı alan 7/7 kayıtta tanımlı, kanıtı olanda dolu.
`cozumTarihi` **alan olarak açılmadı**, türetiliyor (L-08) ve eksen 33c alanın
doğmasını yasaklıyor. Kapalı durum listesi **veri katmanında** çünkü `shell.js`
`domain.js`'ten önce yükleniyor.

**7. R10 — talepten üç akış.** `İşleme Dönüştür` tek modalda görev · revizyon
(CR) · satış fırsatı. Mevcut görev akışı korundu. `DB.leads[].destek` 12/12
tanımlı (0 dolu — bağ akışta doğar), `DB.refTypes`'a `Destek talebi` eklendi.
Talepte karşılığı olmayan alanlar (CR süre/maliyet etkisi · fırsat bütçe/puan)
**kullanıcıdan alınıyor**, tahmin üretilmiyor.

**8. Ölçüm aracının kendi kusuru bulundu → L-35.** `canon.js` veri kökünü sabit
mutlak yolla tutuyordu; "bozulmuş kopyayla sına" protokolü o araçta **hiç
çalışmamıştı**. Kök `qa-lib.repoRoot()`e bağlandı.

### Sıradaki oturum ne yapacak

**FAZ 1 ve FAZ 2 KAPANDI.** Kalan **65 alt madde** iki fazda; sıra aşağıdaki
tablodadır ve `revize-plan.md`'deki madde sırasıyla birebir aynıdır.
**Her alt madde bitince aynı turn içinde işaretlenir**; ilerleme damgadan değil
kutudan okunur:

```bash
echo "$(grep -c '^- \[x\]' tasks/revize-plan.md) / $(grep -c '^- \[[ x]\]' tasks/revize-plan.md)"
```

#### FAZ 3 — TİCARİ VE MÜŞTERİ (sıra: R11 → R12 → R13)

| # | Madde | Kim | Turun başındaki ölçüm (plana yazılı) |
|---|---|---|---|
| **R11** | Proje kaynağı | **lead** | 🟡 yarısı hazır — `944a594` sözleşmeden proje başlatmayı kurmuş; `kaynak` alanı ve sözleşme seçici YOK |
| **R12** | Sözleşme sorumlusu | **lead** | ⬜ sözleşmede **hiç kişi alanı yok**; ekran bunu `GV.notice` ile itiraf ediyor |
| **R13** | Müşteri portalı | **AJANA VERİLEBİLİR** | 🔴 rol ve ekran var, **kapsam yok**; 6 ölçülmüş sızıntı |
| **R17** | Hizmet paketi / abonelik | **lead** | 🟡 9 alanın 5'i tam; `tip`/`periyot`/`sorumlu` yok |

> Dosyadaki satır sırası: R11 `revize-plan.md:1108` · R12 `:1150` · R13 `:1182` ·
> R17 `:1252`.

#### FAZ 4 — SADELEŞTİRME (sıra: R14 → R15 → R16 → R18 → R19 → R20)

> Dosyadaki satır sırası: R14 `:1310` · R15 `:1344` · R16 `:1406` ·
> R18 `:1439` · R19 `:1478` · R20 `:1522`.

| # | Madde | Kim | Turun başındaki ölçüm |
|---|---|---|---|
| **R14** | Pipeline gruplama | **AJAN (dalga)** | 🟡 13 kanban kolonunun **5'i boş**; `sira` bölüntüsü kalıbı aynı dosyada var |
| **R15** | Departman ve uzmanlık | **lead** | ⬜ 16 personel için **21 departman**; 7'si boş, 5'i uzmanlık, 2'si çalışma tipi |
| **R16** | Freelancer çalışma tipi | **lead** | 🟡 `calismaTuru` **mesai** ekseni; istihdam ilişkisi 4 alana dağılmış |
| **R18** | Opsiyonel modüller | **lead** | ⬜ modül anahtarı yok, **ama gizleme mekaniği hazır** (11 madde `roles:` ile gizli) |
| **R19** | Araç sayfaları | **AJAN (dalga)** | 🟢 **yedi alanın yedisi zaten araç detayında tab**; iş yalnız menüde |
| **R20** | Rapor gruplama | **AJAN (dalga)** | 🟡 gruplama kategori sayfalarında zaten var; ihlal yalnız `app-rapor.html`'de (99 çip tek ekranda) |

> **R17 (hizmet paketi / abonelik) FAZ 3'ün son maddesidir** — dosyada
> `revize-plan.md:1252`, R13'ten hemen sonra, FAZ 4 başlığından önce.
> 🟡 9 alanın 5'i tam; `tip`/`periyot`/`sorumlu` yok, abonelik kavramı repoda
> yok. **Lead'in** — `DB.supportPackages`'a dokunuyor ve R08 o koleksiyona
> `proje` FK'sı ile `DB.supportPackageTypes` sözlüğünü yeni ekledi.

#### Paralelleştirme tablosu (Beyar, 15. oturum · `revize-plan.md` §0'da da var)

| Faz | Lead (tek başına) | Ajana verilebilir | Gerekçe |
|---|---|---|---|
| FAZ 3 | R11 · R12 | **R13** | R11/R12 veri katmanına dokunuyor; R13'ün **kendi ekranları** var |
| FAZ 4 | R15 · R16 · R18 | **DÖRTLÜ DALGA: R14 · R19 · R20** | Üçü ayrı ekran kümesi, ortak katmana dokunmuyor; R15/R16/R18 **veri ve ayar ekranını paylaşıyor** |

**Ajan kuralı:** tek ekran yazar · ortak katmana (`ui.js` · `shell.js` ·
`domain.js` · `tokens.css` · `assets/data/*`) **dokunmaz** · `canon.js`'e eksen
**eklemez** · commit atmaz · defter yazmaz. Eksen ihtiyacını **lead'e rapor
eder**, ekseni lead yazar. Doğrulama ve commit lead'indir. En fazla **dört ajan**
(L-20). **Tarayıcı taramaları dalga bitince topluca koşar** — ajan başına değil,
ve **tek tek** (yukarıdaki süre uyarısı).

#### R11 için hazır not — ölçüm yapılmış, kod okunmuş

- `944a594` (2 dosya, +87/−5) **sözleşmeden proje başlatmayı zaten kurmuş**:
  `app-sozlesme-detay.html:206-215` sözleşmenin projesi varsa *Projeyi aç*,
  yoksa *Projeyi başlat* → `app-proje-form.html?sozlesme=<kod>`; form `?sozlesme=`
  okuyor (`:133`), **5 alan ön dolduruluyor** (`ad` · `musteri` · `baslangic` ·
  `planlananBitis` · `sozlesmeTutari`), üç bilgilendirme durumu var (`:409-437`),
  kaydederken tek yönlü bağ `kaynakSozlesme.proje = kod` yazılıyor (§9d).
- **Eksik olan iki şey:** `DB.projects[].kaynak` alanı ve formda **sözleşme
  seçici** (`key:'sozlesme'` → 0 sonuç; sözleşme yalnız URL'den gelebiliyor).
- `DB.projectSources` sözlüğü **R05'in `DB.projectStatuses` kalıbıyla** açılır:
  `Müşteri Sözleşmesi · İç Proje · Satış Öncesi / PoC · Bakım / Destek · Diğer`.
- **Uydurma yok:** sözleşmesi olan 6 proje → `Müşteri Sözleşmesi`; kalan 8'in
  kaynağı `sozlesmeTutari`/`musteri` ilişkisinden türetilir ve gerekçesi
  aktiviteye yazılır. `kaynak` müşteride ve adayda **var ama o SATIŞ kaynağı
  eksenidir** (`DB.refTypes`, artık 18 değer) — proje kaynağı değildir,
  karıştırılmaz.
- **Yeni canon ekseni 35** olur (29…34 dolu): *"`kaynak === 'Müşteri Sözleşmesi'`
  olan projenin `DB.contracts` içinde onu gösteren bir kaydı vardır"*. Bu eksen
  VB-20'nin **"sözleşmesiz sözleşme bedeli"** ek bulgusunu da kapatır:
  **PRJ-2026-007** (336.000) ve **PRJ-2025-008** (960.000) `sozlesmeTutari`
  taşıyor ama onları gösteren sözleşme kaydı **yok** — ikisine ya sözleşme
  yazılır ya bedelleri kalkar, karar aynı turda verilir.
- ⚠️ Eksen yazıldıktan sonra **bilinçli bozulmuş kopyayla sınanır** (L-24 · L-26)
  ve **bozmanın araca ulaştığı doğrulanır** (L-35): `GV_REPO=<kopya>` ver,
  en az bir vaka **başarısız olmalı**, yoksa düzenek kurulmamıştır.

#### R12 için hazır not

`DB.contracts`'te kişi tipinde **tek alan yok**; `app-sozlesme-detay.html:320-332`
bunu `GV.notice` ile itiraf ediyor ve dört kişiyi türetip **salt okunur** basıyor.
Değer uydurulmaz: bugün ekranın türettiği sıra korunur — `customers.sorumlu`
(12/12 dolu), proje varsa `projects.musteriSorumlu` tercih edilir.
`DB.projects[].pm` **14/14'ü EMP-003**, yani tek değerli eksen — sorumlu kaynağı
olarak kullanılmaz.

#### R13 için hazır not (ajana verilecek madde)

**V2-03 ölçümle yanlışlandı:** `GV.list` `musteri` kapsamını **zaten uyguluyor**
(`ui.js:600`). Eksik olan iki şey de arayüz tarafında: (1)
`DB.permMatrix.musteri.gor` bugün `'kendi'` (`org.js:112`), doğrusu `'musteri'`;
(2) `buildSession` (`shell.js:234`) yalnız `DB.employees`'ten kuruluyor, oturumda
`musteri` alanı yok. `DB.contacts` (14 müşteri yetkilisi) müşteri kimliğinin
gerçek kaynağıdır. ⚠️ **Bu iki düzeltme ORTAK KATMANDADIR — ajana verilmez,
lead yazar**; ajan yalnız portalın **kendi ekranlarını** yazar.

<details><summary>R09'un kapanmış uyarısı (kayıt olarak kalsın)</summary>

**R09 uyarısı — R05'in ikizi, aynı tuzak.** Ticket durum sözlüğü hiçbir `DB.*`'da
tanımlı değil: 3 yerde elle yazılı (`app-destek.html:92`, `:101`,
`app-destek-form.html:214`) ve "açık talep" tanımı **6 ayrı yerde daha** elle
türetiliyor (`shell.js` · `dashboard.js` · `app-musteri-detay` ×2 ·
`app-rapor-musteri` · `app-destek`). Üç değer yeniden adlandırılacak
(`Devam ediyor → Çalışılıyor` · `Kapandı → Kapatıldı` · `Açık → Yeni`) ve
**dokuz tüketicinin dokuzu aynı turda** taşınmalı — yarım bırakılırsa L-33'ün
hasarı doğar. Sözlükten çıkacak adı kullanan **her koleksiyon** aranır:
`Müşteri bekleniyor` görev ekseninde de var, `GV.badge` ton haritasından
silinmemeli. Yeni tonlar gerekecek: `Çalışılıyor` · `Kapatıldı` ·
`Yeniden Açıldı`. `cozumSuresi` SLA matematiğinin girdisidir — yeni alanlar
ona dokunmaz, `cozumTarihi` ondan **türetilir**, ikisi ayrı yazılmaz (L-08).

</details>

**FAZ 2'nin bıraktığı hazır zemin:** `GV.proje.acik/bitti/kapali/
arsivli/geciken` (durum ekseni tek yerde) · `GV.proje.kapanisKontrol/kapat` ·
`GV.proje.bakimPaketleri/bakimBagla/bakimAc` · `DB.projectMilestones` ·
`DB.milestoneStatuses` · `DB.moduleStatuses` · `DB.supportPackageTypes` ·
`DB.company.zorunluProjeDokuman` · `GV.destek.acik/kapali/kapaliDurumlar/
cozumTarihi` · `DB.ticketStatuses` · `DB.ticketClosedStatuses` ·
`DB.ticketChannels` · `DB.leads[].destek` · `DB.supportPackages[].proje`.

L-33 bu turda ikinci kez işe yaradı: proje durum sözlüğünden çıkan
`Planlama` · `Geliştirme` · `Test` kelimeleri **`DB.projectModules[].durum`
içinde yaşıyordu**; ton haritasından silinseler 15 modül rozeti griye
düşerdi. Bir durum adını silmeden önce o adı kullanan **her koleksiyon**
aranır (`grep "'<değer>'" assets/data/*.js`).

### Bu turda öğrenilen, tekrar etmemesi gereken dört şey

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
4. **Ortak yordamın veri bağımlılığı da sözleşmenin parçasıdır (L-34).**
   `GV.proje.maliyet` satın alma kalemini `DB.purchases`'tan okuyor; o koleksiyon
   `ops.js`'te. Dört ekran `domain.js` ve `hr.js`'i yüklüyordu ama `ops.js`'i
   yüklemiyordu ve kalem **hata vermeden sessizce 0** kalıyordu. L-12'nin ve
   L-32'nin üçüncü ikizi — ve en sinsisi: diğer ikisi **hata** üretir, bu
   **eksik sayı**. Yordamların veri bağımlılık tablosu artık
   `components.md` §6b'de yazılı. Denetim:
   ```bash
   for f in app-*.html; do grep -q "GV.proje.maliyet(" $f && ! grep -q data/ops.js $f && echo $f; done
   ```

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

**20 script** `tasks/qa/` içinde **repoda izleniyor**. Yeniden yazma — kopyala.
(19 + 15. oturumda eklenen **`dep.js`**.)

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
node canon.js; node dbref.js; node links.js; node dep.js   # playwright GEREKMEZ
node esc.js; node tabs.js; node mut.js; node listen.js
node akt.js; node bag.js; node pers.js
node swtest.js; node grip-qa.js; node ctl.js; node xport.js; node act.js
node qa.js "$(ls <repo>/app-*.html | xargs -n1 basename | tr '\n' ',')"
node gate.js
```

**Süre — 15. oturumda ölçüldü, eski kestirim TUTMUYOR:**

| Script | Defterdeki eski kestirim | **15. oturumda ölçülen** |
|---|---|---|
| `qa.js` (142 ekran × 3 kırılım) | ~4 dk | **~25 dk** |
| `gate.js` (710 sayfa yüklemesi) | ~3 dk | ~8 dk |
| `act.js` (213 aksiyon) | ~5 dk | ~6 dk |
| `tabs.js` (224 tıklama) | — | ~3 dk |
| `canon.js` · `dbref.js` · `links.js` · `dep.js` | — | **saniyeler** (playwright yok) |

> ⚠️ **DÖRDÜNÜ ART ARDA BAŞLATMA.** 15. oturumda `gate → qa → tabs → act`
> zinciri makinenin boş belleğini **~70 MB**'a indirdi; `qa.js` 25 dakika sürdü,
> `tabs.js` ve `act.js` `page.goto` **TimeoutError**'ıyla öldü ve aynı doygunluk
> **Claude Code'un API bağlantısını da düşürdü** ("unable to connect to API").
> Playwright taramaları **tek tek** koşulur; sırası gelen bitmeden sonraki
> başlatılmaz. Koşum bitince `pgrep -f Chromium | xargs -r kill` ile artıklar
> temizlenir.
>
> Kısa yol: değişen ekran azsa `qa.js`'e **hedef listesi ver**
> (`node qa.js "app-destek.html,app-destek-detay.html?id=DST-2026-122"`) —
> tam süpürme yalnız faz kapanışında gerekir.

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
