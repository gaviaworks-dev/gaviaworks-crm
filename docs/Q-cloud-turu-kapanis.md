# Q. Cloud Turu — Kapanış Raporu

> **Ad hakkında — deşifre hatası.** Bu turun ve bu dosyanın adındaki "Cloud"
> bir **deşifre hatasıdır**: ses kaydında **"Claude"** denmiş, metne "Cloud"
> olarak geçmiş. Kapsam **bulut altyapısı değildir** — ne bulut mimarisi, ne
> dağıtım, ne barındırma. Kasıt **üretime hazırlık**: prototipin sunucu
> doğrulaması, kalıcı veri modeli, satır/alan yetkisi, denetim izi ve otomatik
> testleri olan bir ürüne dönüştürülmesi.
>
> Dosya adları **bilerek değiştirilmedi**: `tasks/cloud-*.md`, `docs/P-cloud-*`,
> `docs/Q-cloud-*` adlarıyla commit geçmişinde, plan referanslarında ve
> `handoff.md` içinde geçiyor. Adı düzeltmek bu bağların hepsini kırardı;
> yanlış olan ad değil, adın çağrıştırdığı kapsamdır ve bu not onu kapatır.

**Kaynak şartname:** `tasks/cloud-talimati.md` (23 bölüm · 519 madde)
**Ölçüm:** `docs/P-cloud-gap-analizi.md` · **Kararlar:** `tasks/cloud-kararlar.md`
**Plan:** `tasks/cloud-plan.md` · **Açık sorular:** `tasks/cloud-acik-sorular.md`

Bu tur iki aşamada yürüdü: önce şartnamenin tamamı ölçüldü (Faz 0), sonra 17 blokaj sorusu karara bağlanıp uygulama yapıldı. Kod yazılmadan önce hiçbir belirsizlikte sessiz varsayım yapılmadı.

---

## 1. Sayılar

| | |
|---|---:|
| Commit | 38 |
| Değişen dosya | 152 |
| Eklenen / silinen satır | +13.400 / −1.870 |
| Ekran (önce → sonra) | 142 → 146 |
| Yeni ekran | 4 |
| Yeni ortak servis | 7 |
| Karara bağlanan blokaj sorusu | 17 |
| Yeni ölçüm ekseni | 1 (`tasks/qa/flow.js`, 6 eksen) |
| Güncellenen ölçüm ekseni | 2 (`canon.js` · `dep.js` sözleşmesi) |

---

## 2. Ne yapıldı

### 2.1 Üç öncelikli kırık

**Onay katmanı yalan söylüyordu.** Onay kuyruğundaki "Onayla" düğmesi yalnız kendi satırının durumunu değiştiriyor; kaynak kayda (satın alma · izin · teklif) dokunmuyor, zincirde adım ilerletmiyor, denetim izine yazmıyordu. Kullanıcı onayladığını sanıyor, talep hâlâ bekliyordu.

`GV.approval.karar()` üç işi tek işlemde yapıyor: kuyruk kaydı + zincir adımı + kaynak kaydın geçişi. Kaynak geçemezse onay da geri alınıyor — yarım sonuç bırakılmıyor. `onayAdim`/`onayToplam` elle sayaçları türetilmiş görünüme çevrildi; eksik 11 zincir satırı sayaç ve yayındaki akış tanımından türetildi, **onaycı kimliği uydurulmadı** (`kisi:null`).

**Kanıt:** SAT-2026-014 zinciri 1/3 → 2/3 → 3/3 ilerledi, talep `Onaya Gönderildi → Onaylandı` geçti, üç aktivite yazıldı.

**Finansal kanonik kaynak tersti.** Fatura üç ayrı ekrandan elle "Ödendi" işaretlenebiliyordu; `settleInvoice` faturayı kapatıp tahsilatı ona uyduruyor, `settlePayment` tersini yapıyordu; bakiye altı yerde altı formülle hesaplanıyordu.

Yön tek yöne çevrildi: **para hareketi → tahsis → fatura durumu**. `DB.paymentAllocations` defteri açıldı, tek `GV.fin.balance` altı kopyanın yerine geçti. Test sırasında kendi kurgumda bir kusur çıktı — henüz tahsil edilmemiş bir alacak faturayı kapatabiliyordu; nakit olayını (`tahsilEdildi` + yöntem/hesap/dekont/valör) ayrı alana çıkardım. Gecikme de ayrı türetilmiş eksene alındı, çünkü "Vadesi Geçti" kısmi ödeme bilgisini yutuyordu.

**Kanıt:** nakit olayı → kısmi tahsis (`Kısmi Ödendi`, 95.000/285.000) → tekrar tahsis reddi → tam tahsis (`Ödendi`) → tahsis kaldırma (`Ödenmedi`).

**Tarih bilinci yoktu.** `Hr.icMaliyet` tarih almıyordu; her zaman kaydına bugünkü oran çarpılıyordu, yani bir maaş zammı kapanmış projelerin kârlılığını geriye dönük değiştiriyordu. SLA düz duvar saati farkı alıyor, izin takvim günü sayıyordu.

`icMaliyet(kod, tarih)` üç kademeli çözüldü: satır onayında donan snapshot → tarihli maaş kaydı → bugünkü oran + `guvenilir:false`. `GV.calendar` iş günü, mesai penceresi, resmî tatil takvimi ve bekleme politikasını getirdi.

**Kanıt:** EMP-009'un maaşı iki katına çıkarıldı, proje personel maliyeti 406.059'da sabit kaldı.

### 2.2 Duruş değişikliği

Kod baştan **"uyar ama engelleme"** felsefesiyle yazılmıştı ve `domain.js` bunu yazılı bir karar olarak savunuyordu. Şartname tersini emrediyor. Beş kapı kapatıldı: proje kapanışı · teslim onayı · sözleşme aktivasyonu · izin bakiyesi · bakım kotası. İstisna yolu tek: `sahip`/`genelmudur` + neden kodu + açıklama, aktiviteye `YÖNETİCİ İSTİSNASI` olarak yazılıyor. Eski gerekçe yorumları yeni kararla değiştirildi, sözleşme `tasks/components.md`'ye yazıldı.

### 2.3 Ortak katman

| Servis | İş |
|---|---|
| `GV.flow` | 14 varlık, tek geçiş sözleşmesi; 28 ekrandaki serbest durum seçici kalktı |
| `GV.gates` | 8 engelleyici kapı |
| `GV.approval` | Sürümlü onay motoru, türetilmiş sayaç |
| `GV.fin` | Tahsis defteri, tek bakiye yordamı, nakit olayı |
| `GV.calendar` | İş günü · mesai · tatil · SLA bekleme |
| `GV.audit` | İki defter tek servise bağlandı |
| `GV.action` | Sekiz iş akışı eyleminin tek penceresi |
| `GV.form` | Sekme · canlı sağ panel · sekme bazlı hata özeti · `readonly` |

Domain katmanı 35 sayfadan **146 sayfanın tamamına** taşındı.

### 2.4 Yeni ekranlar

`app-tahsilat-form.html` · `app-veri-kalitesi.html` · `app-odemeplani-form.html` · `app-odemeplani-detay.html`

Veri kalitesi sayfası şartnamenin on kontrolünü artı geçiş sözleşmesi ve maliyet güvenilirliğini koşturuyor: **46 gerçek bulgu**. İki kontrol ölçülemiyor ve bunu açıkça söylüyor.

---

## 3. Tarama sonuçları

Tümü repo değişmezken, tek tek koşuldu.

| Tarama | Kapsam | Sonuç |
|---|---|---|
| `flow.js` | 14 varlık · 123 kayıt · 6 eksen | **TEMİZ** — 0 bulgu |
| `flow.js --selftest` | bozuk kopya | **GEÇTİ** — 5 eksenin 5'i yakaladı |
| `canon.js` | 4.522 kontrol | **TEMİZ** |
| `gate.js` | 146 ekran × 5 rol = 730 yükleme | **TEMİZ** |
| `act.js` | 218 aksiyon | **TEMİZ** |
| `rec.js` | 62 hedef | **TEMİZ** |
| `dep.js` | 57 ekran · 156 yordam çağrısı | **TEMİZ** |
| `dbref.js` | 146 ekran | **TEMİZ** |
| `tabs.js` | 226 sekme tıklaması | **TEMİZ** |
| `listen.js` | 62 ekran | **TEMİZ** |
| `mut.js` | 62 ekran | **TEMİZ** |
| `akt.js` | 184 hareket | **TEMİZ** |
| `esc.js` · `pers.js` · `links.js` · `ctl.js` · `bag.js` · `portal.js` · `grip-qa.js` · `swtest.js` | — | **TEMİZ** |
| Sayfa dumanı (oturumlu) | 146 ekran | **0 JS hatası** |
| `xport.js` | 22 ekran | **EKSİK — açık** |

**`xport.js` bu turdan değildir.** Önceki turda da "bilinçli kısmi" olarak kayıtlıydı (`tasks/revize-plan.md:27`) ve şartnamenin §14.4 export paketi (P4-02) bu turda yapılmadı. Kapatılmış gibi gösterilmiyor.

---

## 4. Backend'e kalan

Şartnamenin **164 maddesi** sunucu/kalıcı veri olmadan anlamsız ve bu turda kasten yapılmadı. Başlıklar:

- **Sunucu tarafı kural** ([2.0.2]) — bütün yetki bugün istemcide; maskeleme kozmetik, veri tarayıcıya tam yükleniyor.
- **İdempotency · transaction · outbox** ([2.0.3], [2.0.4], [19.1.5]) — prototipte taklit edilebilir, garanti edilemez.
- **Transition endpoint'i** ([6.1.10], [6.1.11]) — motor var, uç nokta yok.
- **Kalıcı denetim izi** ([2.0.7]) — `GV.audit` tek yüzey, ama defter sayfa yenilenince siliniyor.
- **Tedarikçi faturası · borç hesapları · banka/kasa · e-belge · muhasebe fişi · vergi · mutabakat** ([10.5.4]) — sekizinin sıfırı var; **ADR-16** ürün adından "ERP"yi bu yüzden kaldırdı.
- **Notlarım owner-only izolasyonu** ([15.4.*]) — prototipte owner filtresi istemcide olur, gerçek izolasyon sağlanamaz. Modül yazılmadan bu kaydedildi.
- **Gerçek entegrasyon kuyruğu** ([13.0.5]–[13.0.8]) — koleksiyon boş açıldı, koşum yok.
- **Gerçek XLSX/PDF üretimi, arka plan export job** ([14.4.3]–[14.4.5]).

---

## 5. Prototipte yapılabilir olup yapılmayanlar

> **GÜNCELLEME — sonraki tur.** Aşağıdaki tablo bu turun (Cloud) sonundaki
> durumu gösterir ve **tarihsel kayıt olarak olduğu gibi bırakıldı**.
> Bir sonraki tur bu altı paketi ele aldı; güncel durum
> **`docs/R-prototip-kapsami-kapanis.md`** ve `tasks/cloud-plan.md`
> durum tablosundadır. Kısaca: A ve F kapandı, B kapandı, C · D · E kısmi;
> `xport.js` ekseni kapandı.

Dürüstlük gereği: bu tur "prototipte yapılabilen her şeyi" bitirmedi.

| Paket | Durum |
|---|---|
| P1-08 Entegrasyon hata kuyruğu **ekranı** | koleksiyon açıldı, ekran yok |
| P1-09 Notlarım negatif test ağı | yazılmadı |
| P2-01 CreateEditPage **göçü** | motor hazır, 36 formun 0'ı sekmeye taşındı |
| P2-02 Kayıt sonrası detaya yönlendirme | 34 form hâlâ listeye dönüyor |
| P3-01 Satış dönüşüm sihirbazı | teklif→sözleşme→proje zinciri yok |
| P3-03 Test varlık modeli | sayaç modeli duruyor; Senaryo/Adım/Kanıt/Build/Ortam yok |
| P3-04 Tedarikçi faturası · RFQ değerlendirme | yok |
| P3-06 İK yaşam döngüsü · onboarding · zimmet kabulü | yok |
| P4-01 ReportRegistry · P4-02 Export | yok |
| P4-03 Notlarım modülü | yok |
| P5-01…06 | yok |

`tasks/cloud-plan.md` içindeki durum tablosu bunu paket paket izliyor.

---

## 6. Yasin Bey'in teyidini bekleyen kararlar

Beşi ticari/hukuki sonuç doğuruyor; karar uygulandı ve geri alınabilir, ama onaya sunulmalı.

| ADR | Konu | Neden teyit |
|---|---|---|
| **ADR-06** | Bakiyeyi aşan izin onayı **engelleniyor** | İK politikası avans izin (negatif bakiye) kullanıyorsa karar (a)'ya çevrilmeli |
| **ADR-08** | **Kısmi kabul fatura tetiklemiyor** | Müşteri sözleşmelerinde kısmi hakediş varsa politika açılmalı ve kalem bedelleri doldurulmalı |
| **ADR-11** | Müşteri beklemesi SLA'yı **durduruyor**, üçüncü taraf **durdurmuyor** | Sözleşmelerdeki SLA maddeleri bu iki varsayılanı doğrulamalı |
| **ADR-16** | Ürün adından **"ERP" kaldırıldı** | Ticari konumlandırma; mevcut tekliflerde "ERP" geçiyorsa uyumlanmalı |
| **ADR-02** | Sözleşmede `Gecikti` durum olmaktan çıktı, türetiliyor | Raporlamada gecikme tanımı değişti |

⚠️ işaretli **30 soru** hâlâ açık (`tasks/cloud-acik-sorular.md`); ilgili iş paketine gelindiğinde aynı biçimde karara bağlanacak.

---

## 7. Bu turda öğrenilenler

`tasks/lessons.md` L-37 · L-38 · L-39 olarak kaydedildi. Üçü de **kendi ölçüm hatalarımdan** çıktı:

- **L-37** — Kod yorumunda `SAT-*/IZN-*` yazmak `*/` ile blok yorumunu erken kapatıyor; sayfa çöküyor ama oturum yokken login'e yönlendiği için belirti hatayı gizliyor.
- **L-38** — Veri dosyasında koleksiyon sınırını parantez sayarak bulmak, Türkçe yorumlardaki kesme işareti (`UID-24'ten`) yüzünden taşıyor. Sınır satır aralığıyla bulunur; değişiklikten sonra koleksiyon başına sayı yeniden ölçülür.
- **L-39** — Bir aracın "temiz" demesi doğru şeyi ölçtüğü anlamına gelmez. Sözdizimi kontrolüm kabuk tırnak hatası yüzünden hiçbir dosyayı ayrıştırmadan "16/16 temiz" bastı. Yeni eksen bozulmuş kopyada bulgu ürettiği kanıtlanmadan koşmaz.

Ayrıca kayda değer: ajanlar ortak katmanda **altı gerçek kusur** buldu — olmayan rol anahtarları, şemada olmayan zorunlu alanlar, `GV.destek.paketOf` eksikliği, giriş/çıkış gerekçe karışıklığı, `kapanisKontrol`'ün ölü dizgi araması ve `sozlesmeAktif`'in yanlış koleksiyonu okuması. Altısı da sessizdi: hata vermiyor, yalnız yanlış sonuç üretiyorlardı. Bu yüzden `flow.js`'e **kodu okuyan** altıncı eksen eklendi.

Bir de kayıp yaşandı ve dürüstçe kaydedilmeli: ajanın commit edilmemiş işi varken attığım `git checkout` iki dosyadaki değişikliği sildi. Kayıp ölçüldü ve ajanın raporundaki satır referanslarından geri yazıldı.

---

## 8. Canlı

Her paket sonunda commit ve push yapıldı; yarım iş push edilmedi. Son durum `main` dalında, GitHub Pages üzerinde yayında.
