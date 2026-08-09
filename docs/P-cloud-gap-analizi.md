# P — Cloud Şartnamesi Boşluk Analizi

**Tarih:** 9 Ağustos 2026 · **Kaynak şartname:** `tasks/cloud-talimati.md` · **Madde envanteri:** `tasks/cloud-envanter.md` (519 madde)
**Yöntem:** Sekiz iş paketi, iki dalga, salt okuma. Her madde için mevcut karşılık dosya+satır kanıtıyla ölçüldü. Demo verisi işlevsellik sayılmadı; karşılığı olmayan madde "YOK" yazıldı.

## Dört sayı

| | Sayı | Oran |
|---|---:|---:|
| **VAR** — tam karşılanıyor | **28** | %5,4 |
| **KISMEN** — kısmen var, eksikleri sayılı | **258** | %49,7 |
| **YOK** — karşılığı yok | **233** | %44,9 |
| **BACKEND GEREKTİRİR** — sunucu/kalıcı veri olmadan anlamsız | **153** | %29,5 |
| KARARLIK — belirsiz iş kuralı, açık soru olarak kaydedildi | 50 | %9,6 |

VAR + KISMEN + YOK = 519. "BACKEND GEREKTİRİR" ve "KARARLIK" sınıf etiketleridir, durum sayısıyla çakışmaz.

## Alan alan özet

| Alan | Madde | VAR | KISMEN | YOK | BACKEND | KARARLIK |
|---|---:|---:|---:|---:|---:|---:|
| 1 — Satış ve CRM (lead, ön analiz, teklif, müşteri) | 40 | 0 | 22 | 18 | 8 | 5 |
| 2 — Sözleşme, ödeme planı, proje yürütme | 52 | 0 | 34 | 18 | 12 | 12 |
| 3 — Kalite, değişiklik, teslimat, destek | 36 | 3 | 17 | 16 | 4 | 9 |
| 4 — Satın alma, tedarikçi, fatura, tahsilat | 39 | 1 | 21 | 17 | 5 | 1 |
| 5 — İK, zaman, kapasite, varlıklar | 43 | 2 | 23 | 18 | 19 | 6 |
| 6a — Geçiş motoru, onay motoru, yetki, audit, mimari | 99 | 5 | 56 | 38 | 23 | 6 |
| 6b — Form standardı, doküman/toplantı/sohbet/otomasyon, entegrasyon, faz | 71 | 10 | 33 | 28 | 28 | 3 |
| 7 — Raporlama standardı, Notlarım, veri kalitesi, envanter | 139 | 7 | 52 | 80 | 54 | 8 |
| **TOPLAM** | **519** | **28** | **258** | **233** | **153** | **50** |

Bu sayılar dosyanın kendi madde satırlarından üretilmiştir; `awk` ile yeniden ölçülebilir.

## Kesitler arası bulgular

Sekiz bağımsız ölçüm aynı üç deseni ayrı ayrı buldu:

1. **"Uyar ama engelleme" duruşu sistemik.** Ekranlar tutarsızlığı doğru tespit edip rozetliyor, ama kapıyı kapatmıyor: kritik hata açıkken teslim onayı geçiyor ([20.2.5]), kapanış listesi tamamlanmadan proje kapanıyor ([20.2.7]), taslak teklifden sözleşme açılıyor ([8.1.1]), taslak talepten sipariş açılıyor ([10.3.1]). `assets/js/domain.js:865-867` bunu **yazılı bir tasarım kararı** olarak savunuyor — yani şartnameyle tek madde değil, bir duruş çatışıyor.

2. **Türetilmesi gereken değerler elle tutuluyor.** [2.0.1]'in doğrudan ihlalleri: fatura "Ödendi" üç ayrı yerden elle işaretleniyor ([10.4.6]); onay adımı `ops.js:333` `onayAdim/onayToplam` elle sayacı ([6.3.10]); müşteri risk skoru `app-musteri-form.html:330` elle select ([7.4.4]); `DB.capacity` elle yazılı statik tablo ([11.2.4]); fatura `Gecikti` durumu elle seçiliyor ([10.4.3]).

3. **Tarih bilinci hiçbir hesapta yok.** `Hr.icMaliyet` tarih parametresi almıyor, bugünkü maaş geçmiş zaman kayıtlarına uygulanıyor ([10.5.2], [11.2.3]); SLA düz duvar saati farkı alıyor, tatil ve mesai takvimi yok ([9.5.3]); izin takvim günü sayıyor, iş günü bilmiyor ([11.1.3]). Üçü de aynı eksik parçaya — `BusinessCalendar/SLAService` ve oran snapshot'ına — dayanıyor.

Buna karşılık üç şey beklenenden olgun: **yetki kabuğu** (`shell.js:350-413` `Perm`, 27 rol × 11 eksen tek kaynaktan, `guard()` doğrudan adres kapısı, `tasks/qa/gate.js` rol×ekran taraması), **ortak form motoru** (36/36 form `GV.form`, ikinci motor yok) ve **ortak rapor kabuğu** (8/8 rapor `GV.report`). Bunlar sıfırdan yazılacak değil, tamamlanacak parçalar.

---
## Alan 1 — Satış ve CRM (lead, ön analiz, teklif, müşteri)

**Sayılar:** VAR 0 · KISMEN 22 · YOK 18 · BACKEND GEREKTİRİR 7 · KARARLIK 5 (toplam 40 madde)

| Madde | Konu | Durum | Kanıt | Sınıf | Çakışma |
|---|---|---|---|---|---|
| [1.0.1] | Tam ürün adı her yerde | YOK | karşılığı yok; en yakın `index.html:8` | PROTOTİPTE | VAR — `index.html:7` ürünü "Gavia Works CRM, ERP ve operasyon yönetim sistemi" diye tanımlıyor |
| [1.0.2] | Kısa ad "GaviaWorks" | KISMEN | `index.html:8`, 142 sayfada `<title>… — GaviaWorks CRM` | PROTOTİPTE | VAR — görünen markada iki kelime: `index.html:22`, `assets/js/shell.js:498`, `index.html:33` |
| [1.0.3] | Kategori tanımı | YOK | karşılığı yok | PROTOTİPTE | VAR — `index.html:7` "CRM, ERP ve operasyon yönetim sistemi" |
| [1.0.4] | "Tam ERP" iddiası yasağı | YOK | `index.html:7` | PROTOTİPTE | VAR — meta açıklama doğrudan ERP diyor; `app-proje-form.html:783` yorumunda da karışıklık |
| [1.0.5] | Uçtan uca zincir | KISMEN | `crm.js:335`, `crm.js:392`, `app-sozlesme-form.html:508`, `app-odemeplani.html:36`, `app-proje-form.html:134` | PROTOTİPTE | VAR — veri bağı var, geçiş eylemleri yok |
| [1.0.6] | Geçişte kaynak/sürüm/tarihçe korunur | KISMEN | `app-lead-detay.html:559-561`, `app-teklif-detay.html:155-157` | BACKEND | VAR — sürüm korunmuyor; `DB.analyses`'te `versiyon` alanı yok |
| [1.0.7] | Aynı bilgi elle yazdırılmaz | KISMEN | `app-onanaliz-form.html:288`, `app-proje-form.html:125,134` | PROTOTİPTE | VAR — `app-onanaliz-detay.html:1035` `?analiz=` gönderiyor ama `app-teklif-form.html:37-39` yalnız `id` okuyor, parametre sessizce düşüyor |
| [7.1.1] | Lead'de "Teklif Oluştur" ön doldurulmuş forma | YOK | `app-lead-detay.html:111` `href="app-teklif.html"` | PROTOTİPTE | VAR — şartnamenin birebir yasakladığı davranış (`:381,:426` de aynı) |
| [7.1.2] | Dönüşüm Qualified/Won ister | KISMEN | `app-lead-detay.html:115` (yalnız `Kaybedildi` hariç) | KARARLIK | VAR — 15 aşamanın 14'ünden serbest, gerekçe kaydı yok |
| [7.1.3] | Mükerrer müşteri/kişi arama | YOK | karşılığı yok; `app-lead-detay.html:587-605` doğrudan açıyor, `:593` `vergiNo:null` | PROTOTİPTE | VAR — hiç kontrol yok; en yakın `app-musteri-yetkili-form.html:155-165` (yalnız ad) |
| [7.1.4] | Dönüşüm geçmiş/kaynak/dosya korur | KISMEN | `app-lead-detay.html:589-598` | PROTOTİPTE | VAR — `notlar`, `etiketler`, `GV.upload` dosyaları, `DB.interactions` taşınmıyor; "kampanya" alanı hiç yok |
| [7.1.5] | Sihirbazdan sözleşme/plan/proje taslağı | YOK | karşılığı yok | PROTOTİPTE | - |
| [7.1.6] | Dönüşüm atomik + idempotent | KISMEN | `app-lead-detay.html:587` `if(!yeniMus)`, `:599` | BACKEND | VAR — `:583-586` yorumu bağın tek yönlü olduğunu itiraf ediyor; proje bağı yok, transaction yok |
| [7.2.1] | Ön analiz 5 durumu | KISMEN | `app-onanaliz-form.html:135` (3 durum) | PROTOTİPTE | VAR — `Taslak`/`Teknik İnceleme` yok; durum serbest select (`:481`), sıra zorlanmıyor |
| [7.2.2] | Yan sonuçlar İade/Ret/İptal | YOK | karşılığı yok | PROTOTİPTE | - |
| [7.2.3] | Teklif yalnız onaylı ön analizden | KISMEN | `app-onanaliz.html:137` | PROTOTİPTE | **VAR ve kritik** — üç ekran çelişiyor: `app-onanaliz.html:137` engelliyor ama `:140` sadece toast; `app-onanaliz-detay.html:298-300` gerçek kayıt üretiyor, kontrol yok; `app-teklif-form.html:391-393` ön analizi opsiyonel yapıyor |
| [7.2.4] | Ön analiz yapılandırılmış kalemler | KISMEN | `crm.js:335-348`, `app-onanaliz-form.html:377-470` | KARARLIK | VAR — kalem bazlı rol/efor/birim maliyet tablosu yok; bağımlılık ve kabul kriteri alanı yok (`crm.js:326` itiraf ediyor) |
| [7.2.5] | Revizyon yeni sürüm; teklif kaynak sürümü saklar | YOK | karşılığı yok — `DB.analyses` sürümsüz | PROTOTİPTE | VAR — `app-onanaliz-form.html:230-236` uyarı veriyor ama sürüm kilidi yok |
| [7.3.1] | Teklif 7 durumu | KISMEN | `app-teklif-form.html:103-104` | KARARLIK | VAR — `İç Onay`/`Onaylandı`/`Gönderildi` yok; iç onay ayrı alan (`:105`) olarak paralel yaşıyor |
| [7.3.2] | Yan terminaller | KISMEN | `app-teklif-form.html:104`, `app-teklif.html:70` | PROTOTİPTE | VAR — `İptal Edildi` yok; `Süresi Doldu` durum değil yalnız filtre |
| [7.3.3] | 9 eylem | KISMEN | `app-teklif-detay.html:533`, `:555`, `:142` | PROTOTİPTE | VAR — 9 eylemin 3'ü var; müşteri kabul/ret yalnız form alanı, onay olayı üretmiyor |
| [7.3.4] | Revizyon eski sürümü kilitler | YOK | `app-teklif-detay.html:151` aynı kaydı yerinde değiştiriyor | PROTOTİPTE | **VAR ve kodda itiraf edilmiş** — `app-teklif-detay.html:358-361`: "teklif sürümlerinin ayrı kayıtları yok" |
| [7.3.5] | Tek kabul edilen sürüm; süresi dolan otomatik | KISMEN | `app-teklif-detay.html:103`, `:170`, `app-teklif.html:70` | BACKEND | VAR — otomatik geçiş/bildirim yok; aynı müşteride birden çok teklif `Kazanıldı` olabilir |
| [7.3.6] | "Kazanıldı" → dönüşüm sihirbazı | YOK | karşılığı yok (`app-teklif-detay.html:130-160`) | PROTOTİPTE | VAR — `Kazanıldı` yalnız elle seçilen durum, alt kayıt doğurmaz |
| [7.3.7] | "Kaybedildi" gerekçe/rakip zorunlu | KISMEN | `app-lead-form.html:202-207`, `crm.js:59` | KARARLIK | VAR — teklifte hiç gerekçe yok (`app-teklif-form.html:454` serbest); `rakip` alanı modelde yok |
| [7.4.1] | Kişi formunda yalnız aktif müşteri | YOK | `app-musteri-yetkili-form.html:97-99` tüm müşteriler | PROTOTİPTE | **VAR ve doğrudan zıt** — `:143` hint'i "pasif firmaya yetkili eklenebilir" diyor |
| [7.4.2] | Müşteri birleştirme aracı | YOK | karşılığı yok | BACKEND | - |
| [7.4.3] | Birleşik aktivite zaman çizelgesi | KISMEN | `app-musteri-detay.html:127-143` (15 sekme) | PROTOTİPTE | VAR — birleşik değil; `:67` `acts` yalnız `a.kayit === kod`, bağlı kayıt olayları toplanmıyor |
| [7.4.4] | Sağlık skoru türetilir | YOK | `crm.js:124` statik `risk`, `app-musteri-form.html:330` elle select, `crm.js:127` statik memnuniyet | KARARLIK | VAR — [2.0.1] "türetilmiş değer elle değiştirilemez" ilkesine aykırı |
| [7.4.5] | Kanal tercihi / açık rıza sürümü | YOK | karşılığı yok (`crm.js:219`, `crm.js:122-128`) | BACKEND | - |
| [7.4.6] | Müşteri portalı kapsamı | KISMEN | `shell.js:259`, `shell.js:206-225`, `app-destek-detay.html:96` | BACKEND | VAR — teklif/sözleşme/teslimat onayı ve fatura yok (`shell.js:259`'da `finans`/`satis` yok) |
| [7.4.7] | Entity alanları bağlama göre filtrelenir | KISMEN | `app-musteri-iletisim-form.html:199-217`, `app-toplanti-form.html:504-514` | PROTOTİPTE | VAR — iletişim kaydında teklif/sözleşme/destek/proje bağı hiç yok |
| [20.1.1] | Lead oluştur + ön analiz başlat | KISMEN | `app-lead-form.html:26`, `app-onanaliz-form.html:35,288` | PROTOTİPTE | VAR — lead detayında "Ön Analiz Başlat" eylemi yok; `:368` yalnız listeye gönderiyor, çalışan `?lead=` ön doldurması hiç tetiklenmiyor |
| [20.1.2] | Onay tamamlanmadan teklifi engelle | KISMEN | `app-onanaliz.html:137` | PROTOTİPTE | **VAR — senaryoyu düşürür**; engel yalnız sahte eylemde, gerçek kayıt üreten yol engelsiz |
| [20.1.3] | Onaylı analizden teklif revizyonu + müşteri kabulü | KISMEN | `app-onanaliz-detay.html:264-272`, `app-teklif-detay.html:151`, `app-teklif-form.html:471-474` | PROTOTİPTE | VAR — revizyon yeni sürüm üretmiyor; müşteri kabulü olay değil form alanı |
| [20.1.4] | Mükerrer müşteriyi tespit + mevcut kayda bağla | YOK | karşılığı yok | PROTOTİPTE | VAR — aynı firma iki lead'den iki ayrı `MUS-` üretir |
| [20.1.5] | Kazanılan tekliften sözleşme + plan taslağı | YOK | karşılığı yok | PROTOTİPTE | VAR — `app-sozlesme-form.html:516` yalnız `Kaybedildi`'yi eliyor, taslak teklifden bile sözleşme açılabiliyor |
| [20.1.6] | İmza + plan kontrolünden sonra aktivasyon | YOK | karşılığı yok (`app-sozlesme-detay.html:212` yalnız "Yenile") | BACKEND | VAR — imza (`:310`) ve plan varlığı hiçbir kontrolde kullanılmıyor |
| [20.1.7] | Proje Sihirbazı ile alt kayıtlar | YOK | `app-proje-form.html:412` "alt kayıtlar bu formda açılmaz" | PROTOTİPTE | VAR — form kendi yorumunda itiraf ediyor |
| [20.1.8] | Tekrar çalıştırmada yinelenen kayıt yok | KISMEN | `app-lead-detay.html:587`, `:599` | BACKEND | VAR — koruma yalnız bellek nesnesine dayanıyor, `idempotency_key` yok |

**Özet.** 40 maddenin hiçbiri tam karşılanmıyor. Veri modeli zinciri yabancı anahtarlarla gerçekten kurulmuş ve bazı form doğrulamaları olgun (`app-toplanti-form.html:504-514`, `app-sozlesme-form.html:512-523`), ama süreci ileri taşıyan geçişlerin çoğu ya elle değiştirilen bir `select` ya da hiç yok. En kritik üç boşluk: (1) teklif sürümlemesi sahte — `app-teklif-detay.html:151` aynı kaydı yerinde değiştirip sayacı artırıyor, kod bunu `:358-361`'de itiraf ediyor, [7.3.4]/[7.2.5]/[20.1.3] ve [2.0.5] birlikte düşüyor; (2) mükerrer müşteri tespiti ve birleştirme hiç yok ([7.1.3], [7.4.2], [20.1.4]); (3) "Kazanıldı" sonrası hiçbir şey olmuyor — teklif→sözleşme→plan→proje sihirbaz zinciri boş, Senaryo A'nın 8 adımının 5'i yürütülemez. En tehlikeli çakışma [7.2.3]/[20.1.2]: kapı üç ekranda üç farklı davranıyor ve kullanıcıyı yanıltıyor.
## Alan 2 — Sözleşme, ödeme planı, proje yürütme

**Sayılar:** VAR 0 · KISMEN 35 · YOK 17 · BACKEND GEREKTİRİR 12 · KARARLIK 12 (toplam 52 madde)

| Madde | Konu | Durum | Kanıt | Sınıf | Çakışma |
|---|---|---|---|---|---|
| [5.0.1] | Referans kabuk + form-grid | KISMEN | `app-proje-form.html:742` (GV.form), `app-personel-form.html:705` aynı motor, `ui.js:1708-1790` | PROTOTİPTE | VAR — şartname 8 **sekme** istiyor; GV.form sekme desteklemiyor (`ui.js:1782` yalnız `sections`). Form 9 düz bölüm |
| [5.0.2] | Sekme Kaynak & Proje Türü | KISMEN | `app-proje-form.html:505-509`, sözlük `work.js:71-72` | KARARLIK | Sözlükte **AR-GE yok**, şartnamede olmayan `Diğer` var |
| [5.0.3] | Sekme Müşteri & Sözleşme | KISMEN | müşteri `:544`, sözleşme `:511`, küme `:163-169`, validate `:528-531` | PROTOTİPTE | Kabul edilmiş **teklif** alanı yok; **sözleşme sürümü** yok; canlı filtre yok (yalnız kaydederken doğrulama) |
| [5.0.4] | Sekme Kapsam & Modüller | YOK | karşılığı yok (`work.js:173-182`); modüller salt-okunur (`:391`) | PROTOTİPTE | Amaç/kapsam içi-dışı/teslimat/varsayım/bağımlılık/başarı kriteri hiçbiri yok |
| [5.0.5] | Sekme Plan & Milestone | KISMEN | yalnız tarihler `:600-620` | PROTOTİPTE | Milestone girişi, bağımlılık, kabul koşulu, ödeme tetikleyicisi, sprint şablonu yok |
| [5.0.6] | Sekme Ekip & Roller | KISMEN | `:578,581,584` + ekip kutuları `:590-596` | PROTOTİPTE | Müşteri tarafı sorumluları, RACI, planlanan kapasite yok |
| [5.0.7] | Sekme Bütçe & Maliyet | KISMEN | `:652-676` (finans yetkisine bağlı) | PROTOTİPTE | Para birimi (`doviz` alanı yok), hedef marj, fiyatlandırma modeli, saat maliyeti politikası, bütçe uyarısı yok |
| [5.0.8] | Sekme Dosyalar & İletişim | KISMEN | `:683-697` (repo/canlı/test/tasarım/sunucu) | PROTOTİPTE | Başlangıç belgeleri, klasör, kanal, toplantı ritmi, erişim kapsamı yok |
| [5.0.9] | Sekme Kontrol & Oluştur | YOK | `kaydet()` doğrudan yazıyor `:894-965` | PROTOTİPTE | Ön kontrol adımı diye bir şey yok |
| [5.0.10] | Sağ panel canlı önizleme | YOK | tek blok sözleşme özeti `:760-790` | PROTOTİPTE | GV.form sağ panel üretmiyor |
| [5.1.1] | Yalnız imzalı/aktif sözleşmeden | KISMEN | küme `:163-169`, müşteri uyum `:528-531` | BACKEND | **VAR — sözleşme durumu filtresi yok**; `Gecikti`/`İptal` sözleşme seçilebiliyor. Sözlükte `İmza` değeri hiç yok |
| [5.1.2] | Satış öncesi faturalandırılmaz | KISMEN | `work.js:71`, gerekçe `:153-161` | KARARLIK | Faturalama engeli, `project_type` alanı, ayrı maliyet merkezi yok |
| [5.1.3] | İç/bakım/AR-GE'de sözleşme zorunlu değil | KISMEN | `:511-514`, `:544-551` | PROTOTİPTE | Sponsor ve bütçe sahibi alanı yok; AR-GE türü yok |
| [5.1.4] | Baseline kopyası + kilitli sürüm | YOK | karşılığı yok | BACKEND | Kapsam projeye kopyalanmıyor; sürüm kilidi kavramı hiç yok |
| [5.1.5] | Proje şablonu | YOK | `kaydet()` yalnız `DB.projects.unshift` `:944-960`; `docs/H-is-akislari.md:223-225` "otomatik üretilmiyor" | PROTOTİPTE | - |
| [5.1.6] | Transaction / Kurulum Hatası / telafi kuyruğu | YOK | tek istemci push `:945-946` | BACKEND | - |
| [5.1.7] | Sözleşme çok projeye bölünürse pay | YOK | karşılığı yok | KARARLIK | **VAR — doğrudan çelişki**: mevcut kod 1:1 dayatıyor (`:163-165`, `:527-529`, `app-sozlesme-form.html:544-548`) |
| [5.1.8] | Proje kodu sunucuda benzersiz | KISMEN | kod istemcide `:822-829`; geri bağ `app-sozlesme-detay.html:265,408-417` | BACKEND | Eşzamanlı kayıtta çakışır |
| [5.2.1] | 8 durumlu yaşam döngüsü | KISMEN | `work.js:56-57`; durum serbest select `:621-623` | KARARLIK | `Başlatma Onayı`/`Kapanış` yok; ad farkları. **Projede geçiş tablosu hiç yok** |
| [5.2.2] | Yan terminaller | KISMEN | `work.js:57`; arşiv ayrı bayrak `:726-733`, `domain.js:566-570` | PROTOTİPTE | Arşivleme geçiş motorundan değil form validate'inden geçiyor |
| [5.2.3] | "Aktif" ön koşulları | YOK | durum serbest seçilebiliyor `:621` | PROTOTİPTE | pm/tarih zorunluluğu var ama duruma bağlı değil |
| [5.2.4] | "Beklemede" gerekçe/dönüş tarihi | YOK | `Askıda` değerinin zorunlu alanı yok | PROTOTİPTE | - |
| [5.2.5] | "Teslim" için kritik hata/test kontrolü | YOK | karşılığı yok | PROTOTİPTE | Benzer kontroller yalnız kapanışta (`domain.js:871-940`), orada da hata/test maddesi yok |
| [5.2.6] | Kapanış kontrol listesi | KISMEN | `domain.js:871-940` (8 madde), `:944-970`, ekran `app-proje-detay.html:1319-1370` | PROTOTİPTE | **Zaman çizelgesi onayı maddesi yok**; kapanış engellenmiyor, gerekçeyle geçiliyor |
| [5.2.7] | Tamamlanmamış proje arşivlenemez | KISMEN | `:729-733`, `domain.js:566-570` | PROTOTİPTE | İptalde açık görev/rezervasyon/bütçe/faturalama kapatılması yok |
| [8.1.1] | Yalnız aynı müşterinin kabul edilmiş teklifi | KISMEN | küme filtresiz `app-sozlesme-form.html:214-217`; validate `:512-521` | PROTOTİPTE | **VAR** — UI müşteriye göre filtrelemiyor; validate yalnız `Kaybedildi`yi reddediyor → `Taslak` teklif seçilebiliyor |
| [8.1.2] | 8 durumlu sözleşme akışı | YOK | `app-sozlesme-form.html:202` `['Aktif','Tamamlandı','Gecikti','İptal']`, serbest select `:645-653` | KARARLIK | 8 durumun 2'si var; şartnamede olmayan `Gecikti` var. Geçiş tablosu yok |
| [8.1.3] | Feshedildi / İptal Edildi | KISMEN | `İptal` var | PROTOTİPTE | `Feshedildi` yok; ekran itiraf ediyor `:450-455` |
| [8.1.4] | İmza hash'i/imzalayan/sağlayıcı/değişmezlik | YOK | yalnız `imzaTarihi` `:589`; kapsam dışı notu `:450-455` | BACKEND | Depoda hiçbir yerde hash/imzalayan alanı yok |
| [8.1.5] | Değişiklik zeyil/revizyon doğursun | YOK | karşılığı yok | BACKEND | **VAR — doğrudan çelişki**: form kapsam/fiyat/tarih metnini mevcut kayıt üzerinde eziyor (`:567-640`, `:973`); yenileme aynı kaydın `bitis`ini uzatıyor (`domain.js:755-766`) |
| [8.1.6] | Aktivasyon için imza + plan doğrulaması | YOK | tek validate bitiş tarihi `:648-652` | BACKEND | `Aktif` serbest seçiliyor; taksit dengesizliği yalnız uyarı |
| [8.1.7] | Farklı müşteri bağı UI+API engeli | KISMEN | teklif uyumu `:519-520`, proje uyumu `:539-540` | BACKEND | Ödeme planı sözleşme formunda hiç seçilmiyor → o eksende engel de yok |
| [8.2.1] | Plan için 6 ekran | KISMEN | **yalnız liste** `app-odemeplani.html:118,124`; `shell.js:802` | PROTOTİPTE | **6 ekranın 1'i var.** `app-odemeplani-form.html`/`-detay.html` repoda yok; taksit hiçbir ekrandan oluşturulamıyor |
| [8.2.2] | Plan içeriği alanları | KISMEN | `work.js:358-384` | PROTOTİPTE | Yüzde, para birimi, faturalama politikası, vergi, tolerans yok; teslim tetikleyicisi yok |
| [8.2.3] | Toplam uyuşmadan aktifleşmez | KISMEN | denge ölçümü + uyarı `app-sozlesme-form.html:775-800`, `app-sozlesme-detay.html:356-378` | PROTOTİPTE | Planın "aktif" durumu kavramı yok → kilit de yok |
| [8.2.4] | Tarih/tutar değişikliği zeyil/onay | YOK | karşılığı yok | BACKEND | Taksitler zaten düzenlenemiyor |
| [8.2.5] | Fatura plan kalemine bağlanır, yineleme engellenir | KISMEN | `misc.js:74-122`; zincir `app-odemeplani.html:37,52-56`; kes `:297-322` | BACKEND | Yineleme engeli yalnız UI görünürlüğü (`:298`); `idempotency_key` yok |
| [8.3.1] | Milestone + Sprint 8 ekran | KISMEN | Milestone **yalnız liste** `app-proje-milestone.html:81,90`, düzenleme yok `:231-240`. Sprint liste + form | PROTOTİPTE | **8 ekranın 3'ü var.** `app-proje-milestone-form.html`, `-detay.html`, `app-proje-sprint-detay.html` repoda yok |
| [8.3.2] | Milestone alanları | KISMEN | `work.js:422-461` | PROTOTİPTE | Planlanan/gerçek tarih ayrımı, bağımlılık, kabul kriteri, müşteri kabulü, risk, bağlı görev yok |
| [8.3.3] | Sprint alanları | KISMEN | `work.js:468-470`; form `app-proje-sprint-form.html:386-465` | PROTOTİPTE | Hedef, kapasite, backlog, committed, carry-over, demo, retrospektif, velocity, release bağı yok |
| [8.3.4] | Sprint kapanışı carry-over; geçmiş değişmez | YOK | toplu kapatma yalnız durum yazıyor `app-proje-sprint.html:207-215` | BACKEND | Kapanmış sprint formdan serbestçe düzenlenebiliyor |
| [8.4.1] | Kanonik görev akışı | KISMEN | sözlük `work.js:19-20`, geçiş tablosu `:102-113`, tek mutasyon `domain.js:242-285`, form kilidi `app-gorev-form.html:798-845` | KARARLIK | **`Kabul Edildi` durumu yok** — `Atandı → Devam ediyor` doğrudan. Fazladan `Revizede` ve `Arşivlendi` var |
| [8.4.2] | Ara durumlar | KISMEN | ikinci eksen `work.js:22-26` `DB.taskWaitReasons`, yordam `domain.js:365-395` | KARARLIK | **Bilinçli model farkı**: kod üçünü ayrı "bekleme nedeni" eksenine taşımış (`work.js:11-18`) |
| [8.4.3] | Revizyon + İptal terminal | KISMEN | `Revizede` `work.js:107`, sayaç `domain.js:267` | KARARLIK | Revizyon `Revizede`ye düşüyor. **`İptal edildi` terminal değil** — `Arşivlendi`ye çıkışı var |
| [8.4.4] | Atanan kabul/ret; ret nedeni zorunlu | YOK | `Atandı` çıkışları `work.js:104` | PROTOTİPTE | Ret yolu görevde hiç yok (yalnız departman talebinde) |
| [8.4.5] | Tek/çoklu sorumluluk + önerilen-gerçek | KISMEN | `sorumlu`+`yardimci`+`izleyiciler` `work.js:486` | KARARLIK | "önerilen" vs "gerçek" ayrımı yok; talepteki öneri göreve taşınmıyor |
| [8.4.6] | Bağımlılık engeli + döngü reddi | KISMEN | veri `work.js:804-808`, form `app-gorev-form.html:1093-1200` | PROTOTİPTE | **`GV.task.transition` bağımlılığa hiç bakmıyor**; döngü kontrolü yok |
| [8.4.7] | Checklist/süre/etiket/öncelik/SLA + bağlar | KISMEN | checklist `work.js:763-790`, süreler `:667-671`, bağlar `:537-575` | PROTOTİPTE | **SLA alanı yok.** Görevde milestone/test/hata/değişiklik bağı yok |
| [8.4.8] | Duraklatma sebep + aralık | KISMEN | `domain.js:365-395`, form `:735-745` | KARARLIK | Bekleme **aralığı** saklanmıyor; SLA duraklatma politikası hiç yok |
| [8.4.9] | Departman talebi 6 adım | KISMEN | `app-istalebi-form.html:103-104`, red gerekçesi `:603-612` | KARARLIK | 6 durumun çoğu yok; akış iki ayrı elle seçilen eksene bölünmüş |
| [8.4.10] | Kabul edilen talep idempotent görev üretir | KISMEN | `app-istalebi-detay.html:220-268`, çift yönlü bağ `:259-260` | BACKEND | **Otomatik değil** — kullanıcı butonu; idempotency yalnız UI koşulu |
| [8.4.11] | Talep-görev tek gerçeklik | YOK | talep durumu serbest select `app-istalebi-form.html:563-572`; `transition` talebe dokunmuyor | KARARLIK | **En ağır çakışma** — görev tamamlanınca talep açık kalıyor |

**Özet.** 52 maddenin hiçbiri tam karşılanmıyor. Olgunluk çok dengesiz: görev modülü gerçek bir geçiş tablosu (`work.js:102-113`), tek mutasyon noktası (`domain.js:242`) ve form seviyesinde geçiş kilidiyle şartnameye en yakın parça; sözleşme ve ödeme planı neredeyse tamamen düz CRUD. En kritik üç boşluk: (1) ödeme planı için 6 ekranın yalnız listesi var, taksit hiçbir ekrandan oluşturulup düzenlenemiyor — sözleşme→tahsilat zincirinin ortası veri girişine kapalı; (2) sözleşme durum sözlüğü 8 adım yerine 4 değer taşıyor, imza/hash/zeyil kavramı hiç yok, [8.1.2]–[8.1.6] topluca boşta; (3) milestone için yeni/düzenle/detay, sprint için detay ekranı yok. En tehlikeli çakışma [8.4.11] + [8.1.5] ikilisi: talep ve görev durumu iki ayrı elle güncellenen gerçeklik, sözleşmede ise kapsam/fiyat değişikliği imzalı belgeyi doğrudan eziyor ve yenileme mevcut kaydın bitişini uzatıyor — ikisi de [2.0.5] sürüm-kilit ilkesinin tersi. Ayrıca [5.1.7] için mevcut kod şartnamenin tam tersini dayatıyor: bir sözleşme ikinci projeye bağlanamıyor.
## Alan 3 — Kalite, değişiklik, teslimat, destek

**Sayılar:** VAR 3 · KISMEN 17 · YOK 16 · BACKEND GEREKTİRİR 4 · KARARLIK 7 (toplam 36 madde)

| Madde | Konu | Durum | Kanıt | Sınıf | Çakışma |
|---|---|---|---|---|---|
| [9.1.1] | 10 test varlığı | KISMEN | `work.js:897` (yalnız `DB.tests`=koşum), `work.js:855` (`DB.bugs`); Plan/Senaryo/Adım/Kanıt/Yeniden Test/Build/Ortam karşılığı yok | BACKEND | VAR — `DB.tests` senaryoyu **sayı** olarak tutuyor (`work.js:900-921`); `app-proje-test-detay.html:405` "başarısız senaryoların hangileri olduğu okunamaz" diyor. Sayaç modeli varlık modeliyle çelişiyor |
| [9.1.2] | Senaryo alanları | YOK | `app-proje-test-form.html:357-486` yalnız ad/proje/tür/sorumlu/durum/tarih/sprint/3 sayı | PROTOTİPTE | Senaryo varlığı yok, alanların asılacağı kayıt yok |
| [9.1.3] | Sonuç `Passed/Failed/Blocked/Not Run` | YOK | `work.js:80` `DB.testResults=['Başarılı','Kısmi','Başarısız']`; `app-proje-test-form.html:108` koşum durumu ayrı | PROTOTİPTE | VAR iki yönlü — (a) `DB.testResults` **hiçbir ekranda kullanılmıyor**, ölü sözlük; (b) `Blocked`/`Not Run` yok, `Kısmi` fazla |
| [9.1.4] | Failed→hata otomatik bağ | YOK | `app-proje-hata-form.html:35-38` yalnız `?id=` okur; test detayı hata oluşturma sunmuyor | PROTOTİPTE | VAR — `app-proje-test-detay.html:517` "başarısız senaryo var ama hata yok" uyarıyor, hata açacak yol vermiyor |
| [9.2.1] | Hata 7 durumu | KISMEN | `work.js:78` `DB.bugStatuses=['Açık','Devam ediyor','Kapandı']` (3/7) | PROTOTİPTE | VAR — `app-proje-hata-detay.html:237,:255` `b.durum`u doğrudan yazıyor; hata geçiş tablosu yok |
| [9.2.2] | Yan sonuçlar | YOK | `work.js:78`; `Yeniden Açıldı` yalnız ticket sözlüğünde (`ops.js:510`) | PROTOTİPTE | - |
| [9.2.3] | Yapılandırılmış repro/build/kök neden/kanıt | KISMEN | Var: `ortam` (`app-proje-hata-form.html:508`), `tekrarlanabilir` (:513), `siddet`/`oncelik`. Yok: `app-proje-hata-detay.html:635,662` | BACKEND | **VAR — kodun gerekçesi maddeyle zıt**: `app-proje-hata-form.html:506` "'beklenen/gerçekleşen' alanı yoktur; ayrıntı bağlı görevin açıklamasında tutulur" |
| [9.2.4] | Hata ↔ test/destek/görev/sprint/release | KISMEN | `work.js:855-880`, `app-proje-hata-form.html:524,539,550,563`; release/deployment karşılığı yok | PROTOTİPTE | Release/deployment kavramı hiç yok |
| [9.3.1] | Değişiklik create/edit/detail | **VAR** | `app-proje-degisiklik.html`, `-form.html` (750), `-detay.html` (822) | PROTOTİPTE | - |
| [9.3.2] | 9 adımlı akış | KISMEN | `app-proje-degisiklik-form.html:104` (4/9) | PROTOTİPTE | VAR — durum kümesi ekranda tanımlı, `DB.*` sözlüğünde değil; tek-kaynak kuralına aykırı |
| [9.3.3] | Yan sonuçlar | KISMEN | `Reddedildi` var; `İptal Edildi` karşılığı yok | PROTOTİPTE | - |
| [9.3.4] | Etki analizi 8 ekseni | KISMEN | `kapsamIci` (:479), `etkiSure` (:511), `etkiMaliyet` (:521), sözleşme projeksiyonu (`-detay.html:690-708`); takvim/risk/test/bakım yok | PROTOTİPTE | Sözleşme etkisi hesaplanıyor ama yazılmıyor |
| [9.3.5] | Kapsam dışı → teklif/zeyil + plan revizyonu | YOK | `app-proje-degisiklik-detay.html:711-716`, `:70`; onay yordamı `:176-189` yalnız durum yazıyor | KARARLIK | VAR — ekran "ek teklif ve zeyilnameyle yürür" (`:228`) diyor ama hiçbir kayıt üretmiyor |
| [9.3.6] | Onaysızken uygulama görevi başlatılamaz | YOK | `domain.js:242` yalnız `DB.taskTransitions`e bakıyor; kapı yok | KARARLIK | VAR — `DB.tasks` ile `DB.changeRequests` arasında **hiç bağ alanı yok** |
| [9.3.7] | Baseline/bütçe/tarihçe yeni sürüm | YOK | `baseline`/`surumNo` karşılığı yok; `-detay.html:176-189` projeye dokunmuyor | PROTOTİPTE | Proje `butce` tek değerli (`work.js:176`), eski değeri koruyacak yer yok |
| [9.4.1] | Teslimat create/edit/detail + kabul | **VAR** | `app-proje-teslim.html`, `-form.html` (748), `-detay.html` (956); kabul `app-proje-teslim.html:243-247` | PROTOTİPTE | VAR (küçük) — kabul eylemi listede, detayda yok |
| [9.4.2] | Teslimat akışı | KISMEN | `app-proje-teslim-form.html:95-96` (3+3 değer); Taslak/İç Kontrol/Gönderildi/Kısmi/Kapandı yok | PROTOTİPTE | VAR — `domain.js:143-147` revizyonda durumu **geri** `Planlandı`ya düşürüyor; teslimin gönderildiği bilgisi siliniyor |
| [9.4.3] | Geri Çekildi | YOK | karşılığı yok | PROTOTİPTE | - |
| [9.4.4] | Kalem bazlı kabul/ret | YOK | `work.js:923-952` kalem yok; `deliveryItems` karşılığı yok | PROTOTİPTE | VAR — kabul ekseni teslim bütününde tek `d.musteriOnay` (`domain.js:136-138`) |
| [9.4.5] | Kabul kanıtı + kabul edilen sürüm | KISMEN | `onayTarihi`,`not` (`work.js:925-927`); kabul eden kişi ve kanıt yok | BACKEND | VAR — kabul edilen sürüm **teslim adından regex'le** çıkarılıyor (`app-proje-teslim-detay.html:134-137`); ad değişirse sürüm sessizce değişir |
| [9.4.6] | Kısmi kabul → milestone/fatura tetikler | YOK | `domain.js:127-155` yalnız onay alanları yazar; `-detay.html:181-213` zinciri yalnız doğruluyor | KARARLIK | VAR — eksik veriyi hata gibi gösterip kapatacak yolu sunmuyor |
| [9.4.7] | Ret/revizyon görev-hata üretir | YOK | `domain.js:141-148` yalnız `onayTarihi=null` ve `not` | PROTOTİPTE | - |
| [9.5.1] | Destek akışı | KISMEN | `ops.js:509-510` (7 değer); `Triage` yok, "Müşteri Onayı" akış adımı değil ayrı alan | PROTOTİPTE | VAR — ticket için geçiş motoru yok, durum serbest dropdown (`app-destek-form.html:215`); Yeni'den doğrudan Kapatıldı'ya atlanabiliyor |
| [9.5.2] | Bekleme durumları + gerekçeli reopen | KISMEN | `Müşteri bekleniyor` var; `Yeniden Açıldı` sözlükte var ama **hiçbir ekranda kullanılmıyor**; `Üçüncü Taraf` yok | PROTOTİPTE | VAR — `Yeniden Açıldı` ölü sözlük değeri |
| [9.5.3] | SLA takvim/tatil/saat dilimi | KISMEN | Gerçek hesap `app-destek-detay.html:138-176`, matris `ops.js:646-666`; **takvim yok** — `calismaSaati` yalnız etiket (`:826`, `app-destek-sla.html:169`) | PROTOTİPTE | **VAR ve tehlikeli** — `app-destek-detay.html:47-51` düz duvar saati farkı alıyor; "Mesai içi" talep hafta sonu ihlale düşer. Politika alanı hesabı yönlendiriyormuş gibi görünüp yönlendirmiyor |
| [9.5.4] | "Müşteri bekleniyor" SLA'yı durdurur | YOK | `:155-170` durumdan bağımsız; bekleme aralığı alanı yok (`ops.js:527-582`) | KARARLIK | VAR — DST-2026-120 `Müşteri bekleniyor` + `İhlal edildi` (`ops.js:551-556`). Görevde duraklatma VAR (`domain.js:367`), destekte yok |
| [9.5.5] | Bakım hakkı düşümü | KISMEN | Kota alanları `ops.js:617-644`, yenileme `domain.js:752`; **düşme yok** — `app-destek-form.html:178-179` "kullanilan/kalan alanlarına DOKUNMAZ" | KARARLIK | VAR — `app-destek-paket-form.html:687,857` negatif kalanı yasaklıyor; şartname politikanın *tanımlanmasını* istiyor, kod yasak olarak sabitlemiş |
| [9.5.6] | Bilgi bankası/hazır yanıt/portal/CSAT | KISMEN | Var: CSAT (`ops.js:669+`), portal (`login.js:110-137`, `shell.js:206-225`), eskalasyon (`app-destek-sla.html:56-60`). Yok: bilgi bankası, hazır yanıt, e-posta zinciri, ekler | BACKEND | `docs/H-is-akislari.md:737` kabul ediyor: "talep gövdesi ayrı tutulmuyor". Portal yalnız okuma |
| [9.5.7] | Incident/problem/change ayrımı + postmortem | YOK | Kategoriler `app-destek-form.html:205-207`; postmortem karşılığı yok | PROTOTİPTE | VAR — "Geliştirme talebi" destek ile change'i aynı kayıt tipinde taşıyor (`ops.js:543`), sonra elle bağlanıyor |
| [20.2.1] | Şablondan milestone/sprint/görev üret | YOK | `app-proje-form.html:412` "alt kayıtlar bu formda açılmaz" | PROTOTİPTE | Senaryo B'nin ilk adımı hiç başlatılamıyor |
| [20.2.2] | Görev atama–kabul–kontrol–onay akışı | **VAR** | `work.js:102-113` `DB.taskTransitions` (yetki+zorunlu alan+bildirim), `domain.js:242` `Task.transition`, onay adımı türetiliyor `domain.js:184` | PROTOTİPTE | - |
| [20.2.3] | Testten hata → düzelt → yeniden test | KISMEN | Düzeltme görevi bağı var; "testten hata oluştur" ve "yeniden test" yok | PROTOTİPTE | Zincirin üç halkasından ikisi kopuk |
| [20.2.4] | Etki analizi + müşteri/ticari onay + zeyil | KISMEN | Onay/red yordamı `app-proje-degisiklik-detay.html:176-208`, tek `DB.approvals` kaydı | KARARLIK | VAR — tek onay kaydı üç ayrı onay makamını temsil ediyor, hangisi verildi okunamıyor |
| [20.2.5] | Kritik hata açıkken teslimi engelle | YOK | `app-proje-teslim-detay.html:533-538` yalnız `GV.notice`; `domain.js:130-137` kontrol yok | KARARLIK | VAR — "riske atar" diyor ama **hiç engellemiyor** |
| [20.2.6] | Kısmi kabulde izinli fatura tetikleyicisi | YOK | Kalem yok + tetikleyici yok | KARARLIK | Senaryo B'nin tek finansal adımı; iki ön koşulu da eksik |
| [20.2.7] | Kapanış listesi bitmeden projeyi tamamlamayı engelle | KISMEN | 8 maddelik kontrol `domain.js:871-940`, ekran `app-proje-detay.html:1328-1345`; `Proje.kapat` `:943-970` gerekçe ister, **engellemez** (`:951-953`) | KARARLIK | **En açık niyet çakışması** — `domain.js:865-867` yazılı karar: "Kapanış ENGELLENMEZ… doküman 'kilitle' demiyor." Şartname tam tersini emrediyor. Ayrıca `olculdu:false` maddeler kapanışı hiç zorlamıyor |

**Özet.** Ekran ve raporlama katmanı olgun, iş kuralı katmanı sığ. Beş modülün de liste/form/detay üçlüsü tam (12.500+ satır) ve detay ekranları tutarsızlıkları dürüstçe rozetliyor — ama **tespit ediyor, yürütmüyor**: kritik hata uyarısı teslimi durdurmuyor, "fatura kesilmemiş" doğrulaması faturayı kesmiyor, "başarısız senaryo var ama hata yok" uyarısı hata açacak düğme sunmuyor. En kritik üç boşluk: (1) test varlık modeli tümüyle sayaç — Senaryo/Adım/Kanıt/Build/Ortam yok, §9.1 tamamı ve [20.2.3] zinciri kurulamıyor; (2) SLA hesabı takvimsiz — `calismaSaati` yalnız etiket, hesap düz duvar saati farkı alıyor, tatil verisi yok, "müşteri bekleniyor" süreyi durdurmuyor; (3) onay→sonuç zinciri hiç yazılmıyor — değişiklik onayı zeyil/plan/baseline üretmiyor, teslim kabulü fatura tetiklemiyor, destek eforu kotadan düşmüyor. En tehlikeli çakışma `domain.js:865-867`: kod proje kapanışının kilitlenmemesini **yazılı tasarım kararı** olarak savunuyor ve [20.2.7] ile karşı karşıya geliyor; aynı "uyar ama engelleme" duruşu teslimde ([20.2.5]) ve bakım kotasında da tekrarlıyor — tek madde değil, sistemik duruş.
## Alan 4 — Satın alma, tedarikçi, fatura, tahsilat

**Sayılar:** VAR 1 · KISMEN 21 · YOK 17 · BACKEND GEREKTİRİR 4 · KARARLIK 1 (toplam 39 madde)

| Madde | Konu | Durum | Kanıt | Sınıf | Çakışma |
|---|---|---|---|---|---|
| [10.1.1] | Taslak doğar + "Onaya Gönder" | KISMEN | Taslak `app-satinalma-form.html:532`; "Onaya Gönder" eylemi **karşılığı yok** | PROTOTİPTE | **VAR** — talep `Taslak` doğuyor ama `Onay bekliyor`a geçiren hiçbir eylem yok; `app-satinalma.html:111` onaylamayı "durum ≠ Onay bekliyor" diye reddediyor → taslak talep kilitli kalıyor |
| [10.1.2] | Taslakta düzenlenir, sonra kilitli; geri çekme/revizyon | KISMEN | Kilit `app-satinalma-form.html:99`,`:108`; geri çekme/revizyon karşılığı yok | PROTOTİPTE | - |
| [10.1.3] | 8 adımlı akış | KISMEN | `app-satinalma.html:76` 5 değer; kanban `:85` | PROTOTİPTE | VAR — `:118` son onayda durumu doğrudan `'Sipariş verildi'` yapıyor, `Onaylandı` ve `RFQ` adımları atlanıyor |
| [10.1.4] | Yan sonuçlar İade/Ret/İptal | KISMEN | Yalnız `İptal` sözlükte, üreten eylem yok | PROTOTİPTE | VAR — `app-panel-onaylar.html:177` onay kaydını `Reddedildi` yapıyor ama bağlı `DB.purchases` durumu `Onay bekliyor` kalıyor → iki kayıt çelişiyor |
| [10.1.5] | Tutar/kategori/proje/aciliyet/bütçeye göre zincir | KISMEN | `app-satinalma-form.html:163-179` `kosulGecer`; `:168` `sure` koşulu sabit `false` | PROTOTİPTE | VAR — `oncelik` veride var (`ops.js:328`) ama zincir seçiminde kullanılmıyor; `butceKodu` serbest metin |
| [10.1.6] | Aynı onaycı yinelenmez, SoD | YOK | karşılığı yok; `app-satinalma.html:111-125` onaylayan=talep eden kontrolü yapmıyor | PROTOTİPTE | VAR — `ops.js:370` zincirinde aynı kişi iki adımda tekrarlanabilir |
| [10.1.7] | Ret/iade nedeni + sürüm | KISMEN | Gerekçe yalnız `app-panel-onaylar.html:170-177`; sürüm alanı yok | PROTOTİPTE | VAR — gerekçe `DB.approvals`'a bile yazılmıyor; `rNot` değeri hiçbir yere kaydedilmiyor (`:177`) |
| [10.2.1] | RFQ zinciri | KISMEN | Karşılaştırma gerçek `app-satinalma-teklif.html:95,:218-231,:147`; `DB.rfq` karşılığı yok, ticari değerlendirme ve seçim onayı yok | PROTOTİPTE | VAR — seçim `:220-224` doğrudan `q.tercih` bayrağını değiştiriyor; onay adımı, aktivite kaydı ve kilit yok |
| [10.2.2] | Para birimi/vergi/navlun normalizasyonu | YOK | `ops.js:385` alanlarında `doviz`/`vergi`/`navlun`/`gecerlilik` yok; `:38` ham fiyat sıralıyor | PROTOTİPTE | VAR — "en düşük fiyat" kararı normalize edilmemiş net fiyattan; ödeme koşulu (Peşin/60 gün) fiyata yansımıyor |
| [10.2.3] | Seçilmeyen en düşük fiyat gerekçesi | KISMEN | Sapma gösterimi var `:174-186`,`:292`; seçim anında gerekçe istenmiyor `:218-231` | PROTOTİPTE | VAR — `:182` demo gerekçe metnini basıyor; yeni seçimde eski gerekçe eşleşmeden kalıyor |
| [10.2.4] | Tedarikçi onboarding | KISMEN | `ops.js:285`, `app-tedarikci-form.html:364-379`; eksikler formun itirafında `:323-327` (IBAN, sözleşme, vergi levhası, kara liste yok) | PROTOTİPTE | - |
| [10.2.5] | Banka değişikliği çift kontrol + audit | YOK | Banka/IBAN alanı hiç yok (`app-tedarikci-form.html:323`) | BACKEND | - |
| [10.3.1] | PO yalnız onaylı talep + seçili tekliften | KISMEN | Ön doldurma `app-siparis-form.html:189,:352-364`; `onayTamam()` `:145-150` var ama yalnız bilgi amaçlı | PROTOTİPTE | **VAR — kapı yok**: `:228-236` talepleri yalnız "siparişi yok mu" diye süzüyor; `Taslak` talepten bile sipariş açılabiliyor |
| [10.3.2] | Satır bazında kısmi teslim/backorder/ret/iade | KISMEN | Veri satır bazlı `ops.js:449`,`ops.js:476`; görüntüleme `app-siparis-detay.html:640-676`; **giriş yok**, tek eylem `:202` | PROTOTİPTE | **VAR** — `:224` `kalemler.forEach(l => l.teslimAlinan = l.miktar)` eksik kalemleri sorgusuz TAM sayıyor; ayrı "mal/hizmet kabulü" varlığı yok |
| [10.3.3] | PO–Kabul–Fatura üçlü eşleştirme | YOK | `ops.js:418-432` `DB.orders[].fatura` serbest metin; `DB.supplierInvoices` karşılığı yok | BACKEND | VAR — ödeme onayı ekseni hiç yok; `DB.invoices` yalnız müşteri faturası, tedarikçi borcu sistemde yok |
| [10.3.4] | Ekipman → demirbaş taslağı | YOK | `ops.js:413` bağ `DB.assets[].siparis` tarafında ve elle; `app-siparis-detay.html:783-806` yalnız listeliyor | PROTOTİPTE | - |
| [10.3.5] | Araç → filo kaydı | YOK | `ops.js:434-435`; `:759-781` yalnız listeliyor | PROTOTİPTE | - |
| [10.3.6] | Lisans/abonelik kaydı | YOK | Lisans koleksiyonu karşılığı yok; `SAT-2026-015` (Figma 8 koltuk, `ops.js:335`) yalnız talep | PROTOTİPTE | `GV.yenileme` sözleşme ekseninde, tedarikçi lisansını kapsamıyor |
| [10.3.7] | Sarf → stok hareketi | YOK | Stok koleksiyonu karşılığı yok; `SIP-2026-009` hiçbir stok kaydı doğurmuyor | PROTOTİPTE | - |
| [10.3.8] | Hizmet → kabul + proje/gider dağıtımı | YOK | `domain.js:801-804` açıkça reddetmiş: "projeye bağlı ayrı gider koleksiyonu bilerek AÇILMADI" | PROTOTİPTE | VAR — `Proje.maliyet` (`domain.js:832`) satın almayı `tahminiMaliyet` üzerinden alıyor, gerçekleşen tutardan değil |
| [10.4.1] | Fatura alanları (seri, UUID, kalem, kur) | KISMEN | `misc.js:72-127`; eksikler formun itirafında `app-fatura-form.html:458-462`, `app-fatura-detay.html:356` | PROTOTİPTE | VAR — faturanın kendi `doviz`/`kur` alanı yok, `app-fatura-form.html:120-123` sözleşmeden türetiyor; sorumlu alanı yok |
| [10.4.2] | 6 durumlu fatura akışı | KISMEN | `app-fatura-form.html:225` `['Ödenmedi','Gecikti','Ödendi']`; `app-fatura.html:105` aynı | PROTOTİPTE | VAR — **`Kısmi Ödendi` yok**, kısmi tahsilat modellenemiyor; `:219-221` boşluğu kabul ediyor |
| [10.4.3] | Vadesi Geçti süreçsel; İptal/İade/dekont | KISMEN | `Gecikti` var ama **elle seçilen**: `app-fatura-form.html:621-628` kullanıcıyı "Gecikti yap" diye zorluyor | PROTOTİPTE | VAR — `Gecikti` vade+tahsis toplamından türemeli; `:196-199` tutarsızlığı sayıyor ama düzeltmiyor |
| [10.4.4] | Tahsilat formu + çoklu fatura tahsisi | YOK | **`app-tahsilat-form.html` dosyası yok**; `app-tahsilat.html:38` "Yeni" düğmesi `app-fatura-form.html`e gidiyor; itiraf `app-tahsilat-detay.html:352-356`; `misc.js:128` `DB.payments[].fatura` **tekil**, `docs/G-veri-modeli.md:423` "birebir" | PROTOTİPTE | VAR — tahsilat para hareketi değil "gecikme takibi" kaydı; fazla/eksik ödeme, iade, chargeback yok |
| [10.4.5] | Ödeme kanonik; fatura durumu tahsisten türer | YOK | `domain.js:51-69` `settleInvoice` faturayı kapatıp tahsilatı ona uyduruyor (`:61-64`); `domain.js:73-90` `settlePayment` tersini yapıyor (`:83`) | PROTOTİPTE | **VAR — ağır çakışma**: çift yönlü ayna; hangi uçtan tetiklenirse o kanonik oluyor |
| [10.4.6] | Elle "ödendi" işaretleme yasağı | YOK | Üç ayrı yerde tersi: `app-fatura-detay.html:214` (`:186 odendiIsaretle`), `app-fatura.html:125`, `app-fatura-form.html:621` + `:603` elle `odemeTarihi` | PROTOTİPTE | **VAR — şartnamenin en doğrudan ihlali.** Ayrıca `app-tahsilat-detay.html:238` "Tahsil edildi işaretle" tutar girişi olmadan faturayı kapatıyor |
| [10.4.7] | Banka hareketi tekilliği + mutabakat | YOK | `mutabakat`/`dekont`/`valör`/`chargeback` finans ekranlarında karşılığı yok | BACKEND | - |
| [10.5.1] | Proje maliyeti formülü | KISMEN | Tek hizmet `domain.js:811`; onaylı zaman `:816-817`, satın alma `:831-833`; amortisman/tedarikçi hizmeti yok, `diger:0` sabit `:845` | PROTOTİPTE | VAR — satın alma `tahminiMaliyet` (TAHMİN) üzerinden ve `durum==='Teslim alındı'` süzgeciyle; gerçekleşen `DB.orders[].tutar` kullanılmıyor |
| [10.5.2] | Tarihsel oran / oran snapshot'ı | YOK | `domain.js:614-628 Hr.icMaliyet(kod)` — **tarih parametresi yok**; `domain.js:824` her zaman kaydına bugünkü oranı çarpıyor | PROTOTİPTE | **VAR — doğrudan ihlal.** 2025 zaman kayıtları 2026 maaşıyla değerleniyor; maaş değişince geçmiş proje kârlılıkları geriye dönük değişiyor |
| [10.5.3] | Tek hesaplama hizmeti | **VAR** | `domain.js:811`; çağıranlar `dashboard.js:370`, `app-panel-yonetici.html:177,489`, `app-butce.html:44`, `app-proje-detay.html:120`, `app-rapor-proje.html:79`, `app-rapor-finans.html:288`, `app-rapor-referans.html:237` | PROTOTİPTE | - (eski `gerceklesenMaliyet` alanı kaldırılmış) |
| [10.5.4] | Tam ERP bileşenleri | YOK | Sekizin sekizi de karşılığı yok | BACKEND | - |
| [10.5.5] | "Tam ERP" iddiası yasağı | KISMEN | `index.html:7`, `docs/B-yonetici-ozeti.md:1` | KARARLIK | VAR — sekiz bileşenin sıfırı varken ürün adında "ERP" geçiyor |
| [20.3.1] | Taslak kaydet + onaya gönder | KISMEN | Taslak çalışıyor `app-satinalma-form.html:531-544`; onaya gönderme yok | PROTOTİPTE | Senaryo ikinci yarısında tıkanıyor |
| [20.3.2] | Ret/iadede gerekçe + yeni sürüm | KISMEN | Gerekçe yalnız genel kuyrukta; detayda ret eylemi yok (`app-satinalma-detay.html:168-174`) | PROTOTİPTE | Gerekçe kaydedilmiyor, talep durumu güncellenmiyor |
| [20.3.3] | RFQ normalize → seçim onayı → PO | KISMEN | Karşılaştırma+seçim çalışıyor; normalizasyon ve seçim onayı yok | PROTOTİPTE | Seçim onaydan geçmeden PO açılabiliyor |
| [20.3.4] | Kısmi teslim ve kabul | KISMEN | Görüntülenebilir ama girilemez; kabul varlığı yok | PROTOTİPTE | `app-siparis-detay.html:224` eksikleri sessizce tam sayıyor |
| [20.3.5] | Üçlü eşleştirme doğrulaması | YOK | Doğrulanacak varlık yok | BACKEND | - |
| [20.3.6] | Ekipman kabulünden demirbaş + zimmet çakışma engeli | KISMEN | **Zimmet çakışma engeli GERÇEK**: `app-zimmet-form.html:118`,`:163`,`:222-227`; demirbaş taslağı üretimi yok | PROTOTİPTE | Senaryonun ilk yarısı yürütülemiyor |
| [20.3.7] | Çoklu tahsis + otomatik türeme | YOK | Şema düzeyinde imkânsız (`misc.js:128` tekil alan); çift yönlü ayna var | PROTOTİPTE | Senaryonun her iki yarısı da modelle çelişiyor |

**Özet.** İki uçta çok farklı olgunluk: satın alma **talep → teklif karşılaştırma → sipariş → teslim** hattı görsel olarak zengin ve veri modeli disiplinli (satır bazlı sipariş kalemleri, iade kaydı, teklif karşılaştırma paneli gerçek), ama **para tarafı — tedarikçi borcu, tahsilat hareketi, üçlü eşleştirme — neredeyse tamamen yok**. Ekranların çoğu kendi boşluğunu dürüstçe yazıyor (`app-tedarikci-form.html:323`, `app-fatura-form.html:458`, `app-tahsilat-detay.html:352`, `domain.js:801`), yani boşluklar gizlenmiş değil, kabul edilmiş. En kritik üç boşluk: (1) **tahsilat formu hiç yok** — `app-tahsilat-form.html` mevcut değil, tahsilat bir para hareketi değil "gecikme takibi" kaydı, `DB.payments[].fatura` tekil olduğu için çoklu tahsis şema düzeyinde imkânsız; (2) **tedarikçi faturası ayrı varlık değil** — `DB.orders[].fatura` serbest metin bir numara, dolayısıyla üçlü eşleştirme, ödeme onayı ve borç hesapları yok ([10.3.3], [10.5.4], [20.3.5] birlikte düşüyor); (3) **satın alma talebi onaya gönderilemiyor** — akışın ilk düğümü kilitli. En tehlikeli çakışma: fatura "ödendi" durumunun üç ayrı yerden elle işaretlenmesi ve `settleInvoice`/`settlePayment` çift yönlü aynası. İkincisi: `Hr.icMaliyet` tarih almadığı için bugünkü maaşın geçmiş zaman kayıtlarına uygulanması.

**Hesaplama tekrarı bulgusu.** Proje maliyeti TEK yerde (`domain.js:811`) — [10.5.3] için tam uyum, [2.0.11] ile çakışma yok. Ama **fatura bakiyesi / tahsilat toplamı 6 ayrı yerde 6 ayrı formülle** hesaplanıyor: `domain.js:113` (brüt açık toplam) · `app-fatura.html:36` · `app-fatura-detay.html:90-92` (`tahsilBrut`/`acikBrut`) · `app-fatura-form.html:785` · `app-tahsilat-detay.html:104-108` · `app-butce.html:80-82`. İkisi net, ikisi brüt eksende; ortak bir `GV.fin.balance(fatura)` yordamı yok. Bu [2.0.11]'in doğrudan ihlali.
## Alan 5 — İK, zaman, kapasite, varlıklar

**Sayılar:** VAR 2 · KISMEN 23 · YOK 18 · BACKEND GEREKTİRİR 19 · KARARLIK 6 (toplam 43 madde)

| Madde | Konu | Durum | Kanıt | Sınıf | Çakışma |
|---|---|---|---|---|---|
| [4.0.1] | Sekme "Kişisel" | KISMEN | `app-personel-form.html:434-476` "Kimlik" **bölümü** (sekme değil); profil fotoğrafı yok `:314-316`; eğitim tek satır serbest metin `:470` | PROTOTİPTE | VAR — form sekmesiz; `GV.form` (`ui.js:1708`) sekme desteklemiyor, yalnız `sections` alıyor |
| [4.0.2] | Sekme "İletişim" + sürümlü KVKK rızası | KISMEN | `:621-655` (eposta, tel, acilKisi); adres, kişisel iletişim, tercih, rıza kaydı karşılığı yok | BACKEND | - |
| [4.0.3] | Sekme "Görev & Departman" | KISMEN | Var: `:484,487,496,535,539,565`. Yok: şirket/şube, ekip, çalışma takvimi, kapasite (`org.js:196-205`); personel no formda yok | PROTOTİPTE | Şartname "ekip"i ayrı kavram sayıyor; repoda `ekip` yalnız proje alanı |
| [4.0.4] | Sekme "SGK / Maaş" | KISMEN | `:592-619` yalnız `maas` + `saatlikUcret`, `canMaas` kapısı `:102`; para birimi/periyot/SGK/IBAN/şifreleme yok | BACKEND | VAR — şartname "şifreli, maskeli" diyor; veri düz metin (`org.js:202`) |
| [4.0.5] | Sekme "Evrak" | YOK | `:316-317` "Doküman koleksiyonunda personel bağı olmadığı için belgeler kalemi forma konulmadı"; `misc.js:262-266` `DB.documents`'te `personel` alanı yok | BACKEND | - |
| [4.0.6] | Sekme "Zimmet" + taslak zimmet | YOK | `:311-321` "Zimmet bu formdan yazılmaz"; `app-zimmet-form.html:185` `['Aktif','İade edildi']` | BACKEND | VAR — zimmet kaydedilir kaydedilmez envanter "Zimmetli" oluyor (`:765-769`), personel onayı beklenmiyor |
| [4.0.7] | Sekme "İzin / Avans / Rapor" | KISMEN | Düzenlemede özet `:323-350`, yeni kayıtta boş durum `:395-405`; **avans kavramı repoda hiç yok** | KARARLIK | - |
| [4.0.8] | Sağ yan panel | YOK | `grep -c form-grid app-personel-form.html` → **0**; sayfa üst üste `gv-card` yığını `:411-427` | PROTOTİPTE | **VAR** — referans ilan edilen formda yan panel yok, ama türevi sayılması gereken `app-izin-form.html:304` `gv-grid-aside` ile sağ sütunu zaten kurmuş |
| [4.1.1] | Personel no sunucuda üretilir | YOK | `:836-843` `yeniKod()` istemcide `DB.employees` taranarak | BACKEND | - |
| [4.1.2] | Kimlik/e-posta normalize + mükerrer + birleştirme | KISMEN | E-posta dup `:628-633`, telefon dup + `sade()` `:638-643`; T.C./vergi kimlik alanı yok; birleştirme akışı yok | BACKEND | - |
| [4.1.3] | Departman/ekip/pozisyon/proje üyeliği ayrı | KISMEN | dep `:487`, pozisyon serbest metin `:484`, rol `:509`; **ekip org kavramı yok** (`DB.teams` yok) | PROTOTİPTE | - |
| [4.1.4] | Durum yaşam döngüsünden türer | YOK | `:678-698` tek `aktif` switch (Aktif/Pasif); Taslak/Onboarding/İzinli/Offboarding/Ayrıldı yok | PROTOTİPTE | **VAR — doğrudan çelişki**: durum türetilmiyor, iki değerli serbest anahtar |
| [4.1.5] | Onboarding şablonu otomatik iş üretir | YOK | `hr.js:491-520` elle yazılı 3 kayıt; şablon koleksiyonu yok; `:932-981` süreç kaydı üretmiyor | PROTOTİPTE | - |
| [4.1.6] | Kullanıcı hesabı ayrı eylem · davet · MFA | YOK | Kullanıcı = personel kaydı; `app-ayar-kullanici.html:329-334` yalnız rol değiştir/pasife al | BACKEND | - |
| [4.1.7] | Yönetici/takvim/kapasite/izin bölgesi zorunlu | KISMEN | `izinBakiye` zorunlu `:575`; yönetici **opsiyonel** `:496-497`; takvim/kapasite/bölge alanı yok; `doluluk:0` doğuyor `:963-964` | KARARLIK | Kapasite beslenmiyor: `:400-402` "kapasite planına eklenene kadar yük hesabı yapılmaz" |
| [4.1.8] | Hassas alanlar maskeli | KISMEN | Maskeli: `app-personel.html:118-122`, `-detay.html:114-116`, `app-rapor-personel.html:62,437-439`. **Maskesiz**: kan grubu `-detay.html:222`, doğum, acil kişi `:275` | BACKEND | VAR — şartname kan grubu/acil durumu hassas sayıyor, kod açık basıyor |
| [4.1.9] | Merkezi özel alan tanımı | YOK | karşılığı yok | BACKEND | - |
| [4.1.10] | Kayıt sonucu transaction | YOK | `:959-975` yalnız `DB.employees.unshift` + aktivite + departman sayacı | BACKEND | - |
| [4.2.1] | Yetkisiz rol maaşı hiçbir kanaldan göremez | KISMEN | DOM: bölüm basılmıyor `:590-592`; export maskeli `app-personel.html:122`, `ui.js:1547`; rapor maskeli | BACKEND | **VAR** — tüm maaşlar tarayıcıya düz yükleniyor (`org.js:202` `maas:185000`); maskeleme yalnız görsel, devtools'tan okunur |
| [4.2.2] | Çift tıklama tek kayıt | YOK | `:996-997` düğme kilitlenmiyor, `:932` her çağrıda yeni kod üretip unshift ediyor | BACKEND | - |
| [4.2.3] | Zorunlu evrak eksikken "Aktif" olamaz | YOK | Evrak kavramı yok; `:963-964` yeni kayıt `aktif:true` doğuyor | PROTOTİPTE | **VAR** — kod maddeyi tersine çeviriyor: varsayılan Aktif |
| [4.2.4] | Pasif departman seçilemez, geçmişte okunur | **VAR** | `:156-162` `depSecenek()` `d.aktif !== false \|\| (duzenle && d.kod === kayit.dep)` | PROTOTİPTE | - |
| [4.2.5] | Başarısızlıkta alt kayıt yarım oluşmaz | YOK | Alt kayıt hiç üretilmediği için test uygulanamıyor | BACKEND | - |
| [4.2.6] | Aktif demirbaş ikinciye atanamaz | KISMEN | **Kural gerçek**: `app-zimmet-form.html:118-124`, `:163-172`, `:447-465`, `:222-228`; çakışma sayacı `:150-161` | PROTOTİPTE | "Taslak çakışması" gösterilemiyor — taslak zimmet durumu yok |
| [11.1.1] | Talep eden onaycı/durum/ret seçemez | KISMEN | Durum & ret `canOnay` kapısında `app-izin-form.html:451-479` | PROTOTİPTE | **VAR — doğrudan çelişki**: `:436-437` "Onay makamı herkese basılır (talebi açan makamı seçer)"; tek kısıt "kendisi olamaz" `:447` |
| [11.1.2] | Onaycı organizasyondan türetilir | KISMEN | Yöneticiden öndolgu `:207`, tazeleme `:679-690`; serbest değiştirilebilir; izin politikası koleksiyonu yok | PROTOTİPTE | - |
| [11.1.3] | İş günü/tatil/yarım gün/rezervasyon/iade/kapasite | KISMEN | Var: takvim günü `:358-361,385-394`, çakışma `:368-378`, vekil `:412-427`, onayda düşüm `:781-800`. Yok: iş günü, resmî tatil (`app-ayar-sirket.html:82-83` "veri modelinde YOK … varsayımdır"), yarım gün, rezervasyon, ret/iptalde iade, kapasiteye yansıma | KARARLIK | **VAR** — şartname iş günü istiyor, kod takvim günü sayıyor ve hafta sonu/tatili bilmiyor |
| [11.1.4] | Negatif bakiye politika + ek onayla | YOK | `app-izin-detay.html:229-230` `dusen = Math.min(e.izinBakiye, l.gun); e.izinBakiye -= dusen;` | KARARLIK | **VAR ve tehlikeli** — 5 günlük izin 2 gün bakiyeyle onaylanınca yalnız 2 gün düşüyor, eksik 3 gün **hiçbir yere yazılmıyor**. Uyarı var (`app-izin-form.html:588-592` "Kayıt engellenmez") ama kayıt sessizce yanlış |
| [11.2.1] | Satır bazında onay/ret/iade | KISMEN | Satır onayı `domain.js:479-492`, ekran `app-zaman.html:109-113`, toplu `:115-133`; satır **reddi** ve **iadesi** yok | PROTOTİPTE | VAR — kod satırı haftalık deftere tabi kılıyor (`domain.js:410-417,486-488` bu kararı açıkça yazıyor) |
| [11.2.2] | Dönem kilidi + yetkili yeniden açma | KISMEN | Kilit fiilen var `app-zaman-onay.html:293`; audit `domain.js:470-473`. **Yeniden açma yolu hiç yok** | BACKEND | Kilit tersine çevrilemez: onaylı hafta düzeltilemiyor |
| [11.2.3] | Fazla mesai/faturalanabilirlik/oran snapshot/müşteri onayı | KISMEN | Var: `hr.js:41` `faturalanabilir`,`proje`,`gorev`,`aciklama`,`musteri`; fazla mesai yalnız hafta düzeyinde `hr.js:394-395`. **Oran snapshot yok** — `domain.js:614-630` her çağrıda hesaplıyor; müşteri onayı yok | KARARLIK | **VAR** — onaylı geçmiş saatler bugünkü maaşla yeniden fiyatlanıyor (Alan 4'teki [10.5.2] bulgusuyla aynı kök) |
| [11.2.4] | Kapasite hesaplanır | YOK | `hr.js:471-482` `DB.capacity` **elle yazılı statik** (16 personelin 10'unda kayıt); `app-kapasite.html:33` doğrudan basıyor | PROTOTİPTE | **VAR** — `izin` sütunu izin talepleriyle bağlı değil; `DB.leaves` onaylandığında güncellenmiyor |
| [11.2.5] | Tek kapasite hizmeti | KISMEN | Aynı koleksiyon 12 ekranda doğrudan okunuyor; `GV.kapasite` gibi servis yok | PROTOTİPTE | **VAR** — doluluk iki eksende: `DB.capacity[].doluluk` ve `DB.employees[].doluluk`; `app-personel-form.html:357` fallback yapıyor |
| [11.3.1] | Onboarding şablon/bağımlılık/SLA | KISMEN | Checklist + adım sorumlusu `hr.js:491-520`; UI `app-personel-giris.html:99-131`. Şablon, bağımlılık, SLA yok; adımlar salt metin | PROTOTİPTE | - |
| [11.3.2] | Offboarding kapanış koşulları | YOK | `grep -c "tur:'Çıkış'" hr.js` → **0** (yalnız 3 "Giriş" kaydı) | PROTOTİPTE | **VAR** — personel `aktif:false` yapılırken **aktif zimmeti** kontrol edilmiyor; `:686-697` yalnız yöneticilik ve astları kontrol ediyor |
| [11.4.1] | Tek aktif zimmet + DB kısıtı + kilit | KISMEN | UI kuralı gerçek `app-zimmet-form.html:118-124,163-172,447-465`; DB kısıtı/kilit yok | BACKEND | - |
| [11.4.2] | Kabul/ret/e-imza + iade süreçleri | KISMEN | Var: `personelOnay` `:489-503`, hasar notu `:533-543`, `iadeKontrol`/`eksik` `ops.js:95-100`, hurda `app-demirbas-form.html:175`. Yok: **ret**, e-imza, fotoğraf, transfer akışı | BACKEND | **VAR** — `app-zimmet.html:117-120` "Dijital onay" aksiyonu **herhangi bir yetkili** kullanıcının `personelOnay='Onaylandı'` yapmasına izin veriyor; oturum sahibinin o personel olduğu doğrulanmıyor |
| [11.4.3] | Lisans/abonelik kaydı | YOK | Yalnız demirbaş kategorisi `ops.js:56-63`; `app-demirbas-form.html:538` birebir: "Ayrı lisans anahtarı, koltuk sayısı veya otomatik yenileme alanı yoktur" | KARARLIK | Şartname [3.3.1] ayrı create/edit ekranı sayıyor; ayrı varlık yok |
| [11.4.4] | Filo alt sayfaları | **VAR** | `app-arac-detay.html:222-232` (10 sekme); sürücü `:299,322`, km `:306-312`; ayrı sayfalar da mevcut | PROTOTİPTE | Ceza kaza sekmesine katlanmış, ayrı alt sayfası yok |
| [20.4.1] | Yetkiye göre hassas sekme | KISMEN | Yetki kapısı gerçek `:102,590-619`, gerekçe basılıyor `:298-308`; ancak **sekme yok**, bölüm var | BACKEND | Senaryo "sekme" üzerinden yazılmış |
| [20.4.2] | Mükerrer kimlik + eksik belge tespiti | KISMEN | E-posta `:628-633`, telefon `:638-643`; kimlik alanı ve belge modülü yok | BACKEND | - |
| [20.4.3] | Tek transaction | YOK | `:959-981` yalnız iki koleksiyon | BACKEND | - |
| [20.4.4] | Zimmet kabulüyle envanter güncellenir | YOK | Envanter zimmet **kaydedilirken** güncelleniyor: `app-zimmet-form.html:759-794` yalnız `durum==='Aktif'`e bakıyor, `personelOnay`a **bakmıyor**; `app-zimmet.html:117-120` onay `DB.assets`e hiç dokunmuyor | PROTOTİPTE | **VAR — ters yönlü çelişki**: envanter onaydan önce güncelleniyor, onay envanteri hiç değiştirmiyor. `ops.js:118-119` ZMT-2026-007 `personelOnay:'Bekliyor'` olduğu hâlde demirbaş "Zimmetli" |

**Özet.** İki hızlı ilerlemiş bir alan: operasyonel listeler (kapasite, zimmet, filo, işe giriş, timesheet onayı) yüzeyde eksiksiz görünürken veri modeli ve durum makineleri neredeyse hiç yok — 43 maddenin yalnız 2'si tam. Şartnamenin "referans tasarım" ilan ettiği `app-personel-form.html` saydığı 7 sekmenin **hiçbirine** sahip değil: sekme motoru yok, Evrak ve Zimmet sekmeleri hiç yok, sağ yan panel yok — üstelik türevi sayılması gereken `app-izin-form.html` sağ sütunu zaten kurmuş, yani referans kendi türevinden geride. En kritik üç boşluk: (1) personel yaşam döngüsü yok, tek `aktif` boolean'ı var, onboarding/offboarding kapıları uygulanamıyor, offboarding kaydı veride sıfır; (2) kapasite tamamen elle yazılı statik tablo, izin/tatil/tahsisten beslenmiyor, doluluk iki ayrı alanda; (3) lisans/abonelik ayrı varlık değil. En tehlikeli çakışma izin bakiyesindeki `Math.min(e.izinBakiye, l.gun)` clamp'i: bakiyeyi aşan onaylı izin sessizce eksik düşülüyor, fark hiçbir kayda geçmiyor — bordroya giden bir sayıyı bozuyor. İkinci sırada zimmet ekseni: envanter personel onayından **önce** güncelleniyor, "Dijital onay" ise envantere hiç dokunmuyor ve onaylayanın kimliği doğrulanmıyor.
## Alan 6a — Ortak altyapı: geçiş motoru, onay motoru, yetki, audit, mimari

**Sayılar:** VAR 5 · KISMEN 56 · YOK 38 · BACKEND GEREKTİRİR 23 · KARARLIK 6 (toplam 99 madde)

| Madde | Konu | Durum | Kanıt | Sınıf | Çakışma |
|---|---|---|---|---|---|
| [0.0.1] | Önce mevcut kod analizi | **VAR** | `docs/B–O-*.md` 14 doküman; `docs/I-api-teknik-servisler.md:1-40`; `tasks/qa/canon.js` 1522 satır | PROTOTİPTE | - |
| [0.0.2] | Eksik algoritma/geçiş/onay tamamlanır | KISMEN | Yalnız görev `work.js:102-113` + `domain.js:242`; 28 formda serbest `durum` select | PROTOTİPTE | - |
| [0.0.3] | Prototip değil üretim sistemi | YOK | `CLAUDE.md:11` "SADECE ARAYÜZ. Backend, veritabanı, gerçek API yok" | BACKEND | **VAR** — proje sözleşmesi maddeyi doğrudan reddediyor |
| [0.0.4] | Önce ortak altyapı, sonra modül | KISMEN | `ui.js` (GV.list/form/modal) + `shell.js`; transition/approval altyapısı yok | PROTOTİPTE | - |
| [2.0.1] | Tek yetkili kaynak | KISMEN | `domain.js:49-96` `Fin.tahsilEt`; `domain.js:512+` `Proje.maliyet` | PROTOTİPTE | **VAR** — fatura 3 yerden elle "Ödendi"; `ops.js:333` `onayAdim/onayToplam` elle sayaç |
| [2.0.2] | Sunucu tarafı yeniden doğrulama | YOK | karşılığı yok — tüm kontrol `GV.perm` istemcide | BACKEND | `app-ayar-yetki.html:105` matris tarayıcıda yazıyor |
| [2.0.3] | Atomik dönüşüm | KISMEN | `app-lead-detay.html:567-600`; teklif→sözleşme, sözleşme→proje yok | PROTOTİPTE | Transaction yok — yarım kayıt mümkün |
| [2.0.4] | İdempotency key / source_entity | YOK | yalnız yorumlarda (`app-proje-test-form.html:516`), veri alanı yok | BACKEND | - |
| [2.0.5] | Sürüm ve kilit | YOK | `app-teklif-detay.html:65` "revizyon geçmişi" = aynı müşterinin başka teklifleri; sürüm alanı yok | PROTOTİPTE | **VAR** — onaylanmış teklif/sözleşme formdan serbest düzenlenebiliyor |
| [2.0.6] | Gerekçe + neden kodu | KISMEN | `domain.js:457-472`, `domain.js:944-953`, `app-panel-onaylar.html:175` | PROTOTİPTE | Neden KODU hiç yok; görev geçişinde gerekçe opsiyonel |
| [2.0.7] | Append-only denetim izi | KISMEN | `domain.js:36-47` `log()` → `DB.activities`; `misc.js:588` `DB.logs` 7 statik kayıt | BACKEND | **VAR** — iki ayrı defter senkron değil; cihaz/istek kimliği yok; append-only garantisi yok |
| [2.0.8] | Rol ayrılığı / SoD | KISMEN | `domain.js:220` kontrolEden≠onaylayan (yalnız görev) | KARARLIK | - |
| [2.0.9] | FK + ilişki tipi + kaynak sürümü | KISMEN | Kod bazlı FK her yerde; `tasks/qa/canon.js` doğruluyor | PROTOTİPTE | İlişki tipi ve kaynak sürüm alanı yok |
| [2.0.10] | Arşiv ≠ silme | KISMEN | `app-ayar-arsiv.html:40` `SAKLAMA=365` sabit, `:185-260` geri yükleme | KARARLIK | `legal_hold` yok; rapor kapsam seçimi yok |
| [2.0.11] | Ortak hesaplama hizmetleri | KISMEN | `domain.js:651-654,783-786` → 8 servis (`GV.fin/delivery/task/zaman/destek/proje/hr/yenileme`) | PROTOTİPTE | **VAR** — fatura bakiyesi 6 formül; SLA `app-destek-form.html:169` ile `app-destek-detay.html:791` ayrı hesap |
| [2.0.12] | Demo bağımsızlığı | YOK | **26 sayfada** "prototip" metni kullanıcıya görünür: `app-ayar-sirket.html:256`, `app-ayar-profil.html:193`, `app-satinalma-form.html:375` ("DB.purchases kaydında dosya alanı yok") | PROTOTİPTE | **VAR** — üretim arayüzünde `DB.*` koleksiyon adı ve mock açıklaması basılıyor |
| [6.1.1] | Serbest status güncellemesi yasak | KISMEN | Tek motor `domain.js:242`; 28 formda serbest select | PROTOTİPTE | **VAR** — 12 modülden 1'i motora bağlı |
| [6.1.2] | Kaynak/hedef durum | KISMEN | `work.js:102-113` `next:[...]` — yalnız görev | PROTOTİPTE | - |
| [6.1.3] | Roller/izinler | KISMEN | `work.js:103` `yetki:['sorumlu','pm']`; `domain.js:190-200` | PROTOTİPTE | - |
| [6.1.4] | Önkoşul/engelleyici | KISMEN | `zorunlu:['teslimEdilenCikti']`; `domain.js:250-257` | PROTOTİPTE | Bağlı kayıt engeli (açık hata, ödenmemiş fatura) yok |
| [6.1.5] | Gerekçe/neden kodu/ek/e-imza | YOK | `domain.js:242` `not` opsiyonel; ek dosya ve e-imza karşılığı yok | KARARLIK | - |
| [6.1.6] | Domain olayları + bağlı kayıtlar | KISMEN | `domain.js:265-278` yan etkiler tek yerde | PROTOTİPTE | Olay tipi/abone yok; yan etkiler if zinciri |
| [6.1.7] | SLA/takvim/bütçe/finans etkisi | YOK | karşılığı yok | PROTOTİPTE | - |
| [6.1.8] | Bildirim alıcıları | KISMEN | `work.js:103` `bildirim:['sorumlu']` tanımlı, `domain.js:282` taşınıyor | PROTOTİPTE | **VAR** — hiçbir çağıran `DB.notifications`'a yazmıyor; tanım ölü |
| [6.1.9] | Geri alınabilirlik/terminal | KISMEN | `work.js:113` `next:[]`; `domain.js:298-318` `arsivGeriAl` | PROTOTİPTE | `terminal`/`geriAlinabilir` açık alan değil, çıkarım |
| [6.1.10] | Yalnız transition endpoint | YOK | karşılığı yok | BACKEND | - |
| [6.1.11] | `transition_event` + tekrar yan etkisi yok | YOK | karşılığı yok | BACKEND | - |
| [6.2.1] | 8 eylem için ORTAK modal | YOK | Her sayfa kendi `GV.modal`'ını kuruyor: `app-izin-detay.html:251`, `app-panel-onaylar.html:170-177`, `app-proje-degisiklik-detay.html:520`, `app-zaman-onay.html:119` | PROTOTİPTE | `GV.modal` (`ui.js:307`) ham kabuk; ortak eylem sözleşmesi yok |
| [6.2.2] | Hedef eylem ve sonucu | KISMEN | `app-panel-onaylar.html:169` | PROTOTİPTE | - |
| [6.2.3] | Neden kodu + açıklama | KISMEN | `:174-176` serbest metin + zorunluluk | PROTOTİPTE | Neden KODU sözlüğü yok |
| [6.2.4] | Ek dosya/kanıt | YOK | `GV.upload` (`ui.js:2245`) var ama onay modallarında kullanılmıyor | PROTOTİPTE | - |
| [6.2.5] | Sonraki onaycı / delege | YOK | karşılığı yok | PROTOTİPTE | - |
| [6.2.6] | Etkilenecek bağlı kayıt özeti | YOK | karşılığı yok | PROTOTİPTE | - |
| [6.2.7] | Geri dönülemez uyarısı | KISMEN | `app-ayar-arsiv.html:255-258`; `GV.confirm tone:'danger'` | PROTOTİPTE | Standart değil, sayfaya özgü |
| [6.2.8] | Success state + audit bağlantısı | KISMEN | `ui.js:382` `GV.result` | PROTOTİPTE | Audit kaydına link hiçbir yerde yok |
| [6.3.1] | Onay tanımı sürümlenir | YOK | `app-ayar-onay.html:155` `AKIS` **sayfa içi sabit dizi**, sürüm alanı yok | PROTOTİPTE | **VAR** — tanım `DB`'de değil ekranda yaşıyor, başka modül okuyamaz |
| [6.3.2] | Sürüm örneğe sabitlenir | YOK | karşılığı yok | PROTOTİPTE | - |
| [6.3.3] | Sıralı/paralel/çoğunluk/koşullu | KISMEN | `app-ayar-onay.html:169-181` sıralı + `kosul` + `esik` | PROTOTİPTE | Paralel/çoğunluk/tümü yok |
| [6.3.4] | Onaycı türleri | KISMEN | `:113-138` rol havuzu, `makamKisi` yönetici + PM çözümü | PROTOTİPTE | Doğrudan kullanıcı, departman, dinamik alan yok |
| [6.3.5] | Vekâlet/süre aşımı/eskalasyon | KISMEN | `:170` `sla:1`, `vekil:'…'` serbest metin, `:1245` açıklama | PROTOTİPTE | **VAR** — `vekil` çalıştırılabilir kural değil, açıklama cümlesi; eskalasyon üretilmiyor |
| [6.3.6] | Kendi kendini onaylama politikası | KISMEN | `domain.js:220` yalnız görevde | KARARLIK | - |
| [6.3.7] | Görevler ayrılığı / çıkar çatışması | YOK | karşılığı yok | PROTOTİPTE | - |
| [6.3.8] | Ret/iade/revizyon/geri çekme/sürüm farkı | YOK | `app-ayar-onay.html` yalnız ileri zinciri modelliyor | PROTOTİPTE | - |
| [6.3.9] | Merkezi Onay Kutum + aynı geçmiş | KISMEN | `app-panel-onaylar.html:84` `DB.approvals`; `app-ayar-onay.html:186+` kaynaktan türetiyor | PROTOTİPTE | **VAR** — iki ayrı defter; `work.js:976` elle yazılı 10 kayıt |
| [6.3.10] | Bekleyen sayı türetilir | YOK | `ops.js:333` `onayAdim:2,onayToplam:3` elle; `dashboard.js:655` doğrudan basıyor | PROTOTİPTE | **VAR** — `shell.js:461` menü rozeti elle defterden sayıyor; `app-ayar-onay.html:187-192` zincirden sayıp yoksa sayaca düşüyor → iki kaynak |
| [6.4.1] | Satır/alan/tenant kapsamı | KISMEN | `org.js:147` `permMatrix` 11 eksen; `ui.js:643-675` `afterScope`; `shell.js:409` `Perm.mask`; `org.js:23` `tenant:'gaviaworks'` | KARARLIK | `proje` kapsamı süzemiyor (`ui.js:640` itiraf ediyor); satır kapsamı 137 ekranın 14'ünde; alan maskesi 3 ekranda |
| [6.4.2] | Tüm yüzeyler aynı politika servisi | KISMEN | `GV.perm` tek kaynak; export `ui.js:1505-1507`; `guard()` `shell.js:719-736` | PROTOTİPTE | Sohbet, bildirim, entegrasyon `GV.perm.scope` okumuyor; `docs/D-…:160-168` açığı kabul ediyor |
| [6.4.3] | İzin değişikliği audit + regresyon | KISMEN | `app-ayar-yetki.html:541`, `app-ayar-rol.html:110`; `tasks/qa/gate.js` ekran×rol | PROTOTİPTE | **VAR** — log sahte kod üretiyor (`'LOG-'+(88300+DB.logs.length)`), oturum bitince kayboluyor |
| [18.0.1] | Arşiv ortak alanları | YOK | Veride yalnız `arsiv:true`/`aktif:false`; `app-ayar-arsiv.html:166-169` `arsivTarihi`/`arsivleyen` **türetiyor** | PROTOTİPTE | **VAR** — arşiv ekranı olmayan alanı varmış gibi sunuyor |
| [18.0.2] | Geri yükleme çakışma kontrolü | KISMEN | `:219-256` bağ kontrolü | PROTOTİPTE | Benzersiz anahtar çakışması kontrolü yok |
| [18.0.3] | Bağlı kayıt arşiv politikası | KISMEN | `:227-232` koleksiyon başına engel, 9 koleksiyon | KARARLIK | Entity × politika matrisi yok |
| [18.0.4] | Hard delete yasağı | KISMEN | `:36` kalıcı silme yalnız `sahip`/`sistem` | PROTOTİPTE | Kayıt türüne göre koruma yok — fatura da silinebilir |
| [19.0.1] | Mevcut yığında kal | **VAR** | `CLAUDE.md:41-46` buildless vanilla JS; ihlal yok | PROTOTİPTE | - |
| [19.0.2] | Yeni framework gerekçeyle | **VAR** | `package-lock` yok, `node_modules` yalnız Playwright QA | PROTOTİPTE | - |
| [19.0.3] | `TransitionService` | KISMEN | `domain.js:242` — tek entity | PROTOTİPTE | Görev dışı hiçbir entity kullanamıyor |
| [19.0.4] | `ApprovalService` | YOK | ekran içi; `GV.*` altında onay servisi yok | PROTOTİPTE | - |
| [19.0.5] | `Relationship/EventService` | KISMEN | `domain.js:36-47` `log()` tek olay yazıcı | PROTOTİPTE | İlişki servisi yok; olaya abone olunamıyor |
| [19.0.6] | `AuthorizationPolicyService` | KISMEN | `shell.js:350-413` `Perm` | PROTOTİPTE | Satır/alan kapsamı çağıranlara bırakılmış |
| [19.0.7] | `AuditService` | KISMEN | `domain.js:36` `log()`; `DB.logs` ayrı | PROTOTİPTE | İki defter, tek servis yok |
| [19.0.8] | `BusinessCalendar/SLAService` | YOK | SLA iki ayrı yerde; iş günü takvimi yok | PROTOTİPTE | - |
| [19.0.9] | `FinanceCalculationService` | KISMEN | `domain.js:49-96` `GV.fin`; `:812-843` | PROTOTİPTE | Bakiye formülü servis dışında da yaşıyor |
| [19.0.10] | `ReportRegistry/ExportService` | KISMEN | `ui.js:2347` `GV.report`, `:1475-1586` ortak export | PROTOTİPTE | Rapor kaydı `localStorage` (`gv.rp.*`), registry yok |
| [19.0.11] | `IntegrationJob/ErrorQueueService` | YOK | `app-ayar-entegrasyon.html` statik ekran | BACKEND | - |
| [19.0.12] | `DataQualityService` | KISMEN | `tasks/qa/canon.js` 1522 satır tarayıcı — **repo dışı Node scripti** | PROTOTİPTE | Üründe çalışan servis değil, geliştirici aracı |
| [19.0.13] | `PersonalNotesService` | YOK | karşılığı yok | PROTOTİPTE | - |
| [19.0.14] | DB migration ileri/geri | YOK | karşılığı yok | BACKEND | - |
| [19.0.15] | FK/index/optimistic lock/transaction | YOK | karşılığı yok | BACKEND | - |
| [19.0.16] | Kuyruk retry + idempotency + DLQ | YOK | karşılığı yok | BACKEND | - |
| [19.1.1] | Liste endpoint kapsamı | YOK | istemci `GV.list` (`ui.js:545`) tümünü bellekte yapıyor | BACKEND | - |
| [19.1.2] | Validation alan + kod + mesaj | KISMEN | `ui.js:1929` `GV.form` alan bazlı hata (istemci) | BACKEND | Hata KODU yok |
| [19.1.3] | Transition endpoint | YOK | karşılığı yok | BACKEND | - |
| [19.1.4] | Dönüşüm endpoint'i kimlik döner | YOK | `app-lead-detay.html:597` kodu istemcide üretiyor | BACKEND | - |
| [19.1.5] | Outbox deseni | YOK | karşılığı yok | BACKEND | - |
| [19.1.6] | Webhook/queue idempotent | YOK | karşılığı yok | BACKEND | - |
| [19.1.7] | Serialization'da maskeleme | KISMEN | `shell.js:409` `Perm.mask` — render anında, 3 ekranda | BACKEND | **VAR** — veri tarayıcıda tam yüklü, maskeleme kozmetik |
| [19.1.8] | Kişisel not namespace + owner scope | YOK | karşılığı yok | BACKEND | - |
| [19.2.1] | Domain unit testleri | KISMEN | `tasks/qa/canon.js`, `dep.js` | PROTOTİPTE | `domain.js` fonksiyonlarının unit testi yok |
| [19.2.2] | API entegrasyon testleri | YOK | karşılığı yok | BACKEND | - |
| [19.2.3] | E2E akışları | KISMEN | `tasks/qa/act.js`, `tabs.js`, `portal.js` | PROTOTİPTE | Uçtan uca senaryo değil, ekran taraması |
| [19.2.4] | Görsel/regresyon | KISMEN | `tasks/qa/qa.js` 1440/768/390; `swtest.js`; `ctl.js` | PROTOTİPTE | Baseline karşılaştırma yok, çıktılar gitignored |
| [19.2.5] | Güvenlik negatif testleri | KISMEN | `tasks/qa/portal.js`; `gate.js` 5 rol × tüm ekran | PROTOTİPTE | IDOR/export/alan izolasyonu testi yok |
| [19.2.6] | Yük testleri | YOK | karşılığı yok | BACKEND | - |
| [23.0.1] | UI standarda uygun | KISMEN | `ui.js:1708` `GV.form`, `:2347` `GV.report`; `tasks/qa/ctl.js` denetliyor | PROTOTİPTE | `tasks/ui-debt.md` bilinen sapmaları kaydediyor |
| [23.0.2] | İş kuralı sunucuda | YOK | karşılığı yok | BACKEND | - |
| [23.0.3] | Atomik + idempotent | YOK | `domain.js:262-278` sıralı mutasyon, rollback yok | BACKEND | - |
| [23.0.4] | Kaynak–hedef + audit izi | KISMEN | `log()` yazan yordamlar; `tasks/qa/bag.js` | PROTOTİPTE | Form ekranlarındaki mutasyonlar log yazmıyor |
| [23.0.5] | Yetkiler test edilmiş | KISMEN | `tasks/qa/gate.js`, `xport.js` | PROTOTİPTE | Satır/alan izolasyonu negatif testi yok |
| [23.0.6] | Hata/boş/yükleniyor/yetkisiz durumları | **VAR** | `ui.js:448` `GV.empty`, `:517` `GV.errorState`, `:527` `GV.skeleton`, `shell.js:734` 403 | PROTOTİPTE | - |
| [23.0.7] | Mobil/klavye/erişilebilirlik | KISMEN | `ui.js` 46 + `shell.js` 23 `aria-*`; 3 breakpoint QA | PROTOTİPTE | Modal/drawer'da odak yönetimi denetlenmemiş |
| [23.0.8] | Migration + geri dönüş planı | YOK | karşılığı yok | BACKEND | - |
| [23.0.9] | Testler geçer | KISMEN | `tasks/qa/*` 22 script, CI yok, çıktılar gitignored | PROTOTİPTE | Otomatik koşum/eşik yok, elle `node canon.js` |
| [23.0.10] | Demo/sabit kullanıcıya özel kod yok | KISMEN | — | PROTOTİPTE | **VAR** — `shell.js:337` `buildSession(emp \|\| 'EMP-001')`, `app-ayar-arsiv.html:32` aynı düşüş; 26 sayfada demo açıklaması |
| [23.0.11] | Rapor + export aynı kaynak | KISMEN | `ui.js:1506` export `kaynak()` üzerinden | PROTOTİPTE | Rapor sayfaları KPI'ları kendi hesaplıyor |
| [23.0.12] | Kişisel not owner-only | YOK | karşılığı yok | PROTOTİPTE | - |
| [24.0.1] | Kapsam bağlayıcı | KISMEN | `tasks/cloud-envanter.md` çıkarıldı | PROTOTİPTE | **VAR** — `CLAUDE.md:19` `PROMPT.md`'yi "tek doğru kaynak" ilan ediyor → iki bağlayıcı belge |
| [24.0.2] | Mevcut kodda karşılık + çakışma işareti | **VAR** | `docs/I-…` kapsam ayrımı; `docs/D-…:160` bilinen açık | PROTOTİPTE | - |
| [24.0.3] | P0'dan fazlandırılmış plan | KISMEN | `docs/L-yol-haritasi.md:43-54`; `tasks/plan.md` | PROTOTİPTE | Cloud şartnamesi için P0 planı yok (bu tur üretiyor) |
| [24.0.4] | Sessiz varsayım yok, ADR | KISMEN | `tasks/assumptions.md`, `tasks/lessons.md` | PROTOTİPTE | **VAR** — `CLAUDE.md:24` "soru sorulmaz" otonom modu maddeyle gerilimde |
| [24.0.5] | Üç değişmez temel | KISMEN | Form referansı ve `GV.report` var | PROTOTİPTE | Owner-only kişisel not modeli tamamen yok |

**Özet.** İki uçlu olgunluk: **yetki ve kabuk katmanı şaşırtıcı derecede olgun**, **geçiş ve onay katmanı neredeyse tamamen eksik**. `shell.js:350-413` gerçek bir politika nesnesi (`Perm.role/modul/sec/item/can/scope/mask`) sunuyor, 27 rol × 11 eksen `org.js:147`'den tek kaynaktan besleniyor, menü gizleme ile doğrudan adres kapısı (`guard`) aynı tablodan geliyor ve `tasks/qa/gate.js` bunu rol×ekran matrisi olarak tarıyor — [6.4.1]/[6.4.3]'ün ciddi bir çekirdeği. Buna karşılık geçiş motoru tek entity'de yaşıyor: 11 modül durumu 28 form ekranındaki serbest `<select>` ile yazıyor. En kritik üç boşluk: (1) **onay motoru yok** — `app-ayar-onay.html` 1333 satırlık bir *anlatım* ekranı, `AKIS` dizisi sayfanın içinde yaşıyor, `DB`'ye çıkmıyor, `vekil` çalıştırılabilir kural değil serbest cümle; (2) **ortak eylem penceresi yok** — sekiz eylemin her biri her sayfada sıfırdan kuruluyor, neden kodu/ek dosya/sonraki onaycı/etkilenen kayıt özeti/audit linki hiçbirinde yok; (3) **denetim izi iki defterli ve sahte** — `DB.activities` ile `DB.logs` birbirini görmüyor, ikisi de sayfa yenilenince siliniyor. En tehlikeli çakışma `app-panel-onaylar.html:168-171`: "Onayla" düğmesi yalnız `DB.approvals` satırının durumunu değiştiriyor, kaynak kayda (SAT-*/IZN-*) hiç dokunmuyor, adım ilerletmiyor, log yazmıyor — kullanıcı onayladığını sanıyor, talep hâlâ "Onay bekliyor" duruyor. İkizi `ops.js:333` elle sayacı ve `shell.js:461` rozetinin bu deftere bakması: [2.0.1] + [6.3.10]'un üçlü ihlali.

**Servis sınırı karşılığı: 11 servisin 0'ı tam, 6'sı kısmi, 5'i yok.** `GV.fin`, `GV.task.transition`, `GV.perm`, `log()`, `GV.report`+export, `canon.js` gerçek bir servis düşüncesinin başlangıcı; ama hiçbiri servis *sınırı* değil — çağıran ekranlar kuralı atlayabiliyor (28 form bunu yapıyor). `ApprovalService`, `SLAService`, `IntegrationJob`, `PersonalNotes`, `Relationship` karşılıksız. Kabaca istenen servis yüzeyinin **%30'u, zorlayıcılık olmadan**.
## Alan 6b — Form standardı, doküman/toplantı/sohbet/otomasyon, entegrasyon, faz ve teslim

**Sayılar:** VAR 9 · KISMEN 33 · YOK 29 · BACKEND GEREKTİRİR 28 · KARARLIK 3 (toplam 71 madde)

| Madde | Konu | Durum | Kanıt | Sınıf | Çakışma |
|---|---|---|---|---|---|
| [3.0.1] | Referans form görsel dili | KISMEN | `ui.js:1708-1935` tek motor; referans dosya repoda YOK (harici `gaviacrm/v2`); sekme+sağ panel anatomisi taşınmamış | KARARLIK | Referans birebir doğrulanamıyor |
| [3.0.2] | Yeni form dili icat edilmez | **VAR** | 36/36 `app-*-form.html` `GV.form()` çağırıyor; ikinci motor yok | PROTOTİPTE | - |
| [3.0.3] | Ortak CSS/Manrope/bileşenler | KISMEN | `tokens.css`,`shell.css`,`ui.css` 36/36 formda; ama `.gv-tabs` (`ui.css:897-917`) formların **0**'ında | PROTOTİPTE | Ortak sekme bileşeni var, formlar kullanmıyor |
| [3.1.1] | Uygulama kabuğu | **VAR** | `shell.js:955-967`; 36/36 form yüklüyor | PROTOTİPTE | - |
| [3.1.2] | Breadcrumb "Detay > Düzenle" | KISMEN | `shell.js:621-643` link üretiyor; edit modunda `app-personel-form.html:58` zincir **Liste > Düzenle**, "Detay" adımı yok | PROTOTİPTE | - |
| [3.1.3] | `gv-page-head` | **VAR** | `shell.js:983-1001`; `app-personel-form.html:74` | PROTOTİPTE | - |
| [3.1.4] | `form-grid` + sağ bağlam paneli | YOK | `form-grid`/`form-side` sınıfı repoda yok; `.gv-grid-aside` (`ui.css:102`) 36 formdan **yalnız `app-izin-form.html`**'de; kalan 35 tek sütun | PROTOTİPTE | - |
| [3.1.5] | Ana kart içinde `gv-tabs` | YOK | `ui.js:1782` yalnız `(cfg.sections\|\|[]).forEach` — sekme kavramı yok; `.gv-tabs` 28 **detay** ekranında, **0** formda | PROTOTİPTE | **Sistemik** — 33 ekran standardının çekirdeği motorda yok |
| [3.1.6] | `fg-section` ikon+başlık+ayırıcı | KISMEN | `ui.js:1783-1786` + `ui.css:663-669` başlık/desc/ayırıcı var; **ikon alanı yok** (`s.icon` okunmuyor) | PROTOTİPTE | - |
| [3.1.7] | 2 sütun / mobil tek sütun | **VAR** | `ui.css:671-675` 12'lik ızgara + `@media 900/640px`; `ui.js:1769` | PROTOTİPTE | - |
| [3.1.8] | Koşullu alan; gizli değer gönderilmez | **VAR** | `ui.js:1826-1846` `syncShowIf`, `:1900` gizli alan boş döner, `:1853` doğrulanmaz | PROTOTİPTE | 36 formdan yalnız 1'i `showIf` kullanıyor — desen kullanılmıyor |
| [3.1.9] | Tekrarlanabilir satır/blok | YOK | `GV.form`'da satır tekrarı yok (`ui.js:1714-1776`); yalnız `app-teklif-form.html:760-790` kendi kalem modalını el yordamıyla kuruyor | PROTOTİPTE | Standart olması gereken desen tek ekranda özel kod |
| [3.1.10] | Dosya alanı tür/sürüm/durum | KISMEN | `ui.js:1750-1755` + `:1797-1820` drag/drop + ad + boyut + kaldır; **tür/sürüm/durum/görüntüle/değiştir yok**; 36 formdan 3'ü kullanıyor | PROTOTİPTE | - |
| [3.1.11] | Türetilen alanlar salt okunur + yardım | YOK | `ui.js:1714-1776`'da `readonly`/`derived` tipi yok | PROTOTİPTE | - |
| [3.1.12] | Alan altı hata + sekme bazlı özet | KISMEN | `ui.js:1848-1892` alan altı `.f-err`, `.form-err-summary`, ilk hataya `focus()` var; sekme bazlı özet yok | PROTOTİPTE | [3.1.5] boşluğunun türevi |
| [3.1.13] | Ortak `form-foot` + sihirbaz | KISMEN | 32 form `.gc-foot`, 3 form `.gv-form-actions`, `app-satinalma-form.html` **hiç footer'sız** (`:262`); `form-foot` sınıfı yok; sihirbaz/Taslak Kaydet hiçbir formda yok | PROTOTİPTE | **Üç ayrı footer kabı — "ortak" değil** |
| [3.1.14] | Kaydedilmemiş değişiklik + çift kayıt engeli | KISMEN | `ui.js:1908-1917` `beforeunload` + `GV.on` var; **çift submit engeli yok** (`:1927-1932` butonu disable etmiyor) | PROTOTİPTE | - |
| [3.1.15] | Sağ panel CANLI özet | YOK | Sağ panel yok; canlı özet yalnız `app-teklif-form.html:597-598` ve kart içinde; `app-personel-form.html:359` "Kayıt Özeti" statik | PROTOTİPTE | - |
| [3.1.16] | Kayıt sonrası detaya git + alt kayıt bağları | YOK | 34 formun tamamı **listeye** dönüyor: `app-personel-form.html:979-980`, `app-proje-form.html:966-967` | PROTOTİPTE | **VAR — kodda açık karşı-karar**: `/* location.reload() YASAK — normal akış listeye dönmektir. */` |
| [3.2.1] | Sekme klavye + role/aria | YOK | `GV.tabs` (`ui.js:1673-1703`) role=tab, aria-selected, ArrowLeft/Right **var ama yalnız detay ekranlarında**; form motoru bu bileşeni hiç çağırmıyor | PROTOTİPTE | - |
| [3.2.2] | Zorunluluk yalnız renkle anlatılmaz | **VAR** | `ui.js:1722` `<span class="req">*</span>`, `:1774` `.f-err` ikon+metin, `ui.css:782-806` | PROTOTİPTE | - |
| [3.2.3] | API'ye kanonik veri | KISMEN | `ui.js:1762` date→ISO, `:1756-1760` money/percent kanonik; **tel serbest metin** (`:1868` yalnız hane sayıyor); API yok | BACKEND | - |
| [3.2.4] | Aranabilir seçim; pasif gelmez | KISMEN | 36/36 form `aktif !== false` süzüyor ve mevcut değeri geri ekliyor; ama **aranabilir bileşen yok** — `ui.js:1729-1736` native `<select>` | PROTOTİPTE | - |
| [3.2.5] | Rolsüz kullanıcı hassas alanı alamaz | KISMEN | 36/36 form `GV.perm.can(...)` kapısı; `app-personel-form.html:102,590` ücret bölümü hiç basılmıyor — doğru desen; tamamı istemci tarafı | BACKEND | - |
| [3.2.6] | Taslak/otomatik kaydetme | YOK | `GV.form`'da yok; `localStorage` yalnız liste kolonu için | BACKEND | - |
| [3.2.7] | Create/edit ortak şema | **VAR** | 36/36 form tek `sections` şemasını `duzenle` bayrağıyla paylaşıyor | PROTOTİPTE | - |
| [3.3.1] | 33 create/edit ekranı aynı kabuk | KISMEN | 33 tipin **23'ünün** formu var, **10'u yok**; var olanların hiçbiri [3.1.4]/[3.1.5]/[3.1.15]/[3.1.16]'yı karşılamıyor | KARARLIK | "Test Planı/Test Senaryosu" tek form mu iki mi belirsiz |
| [12.1.1] | `entity_type + entity_id + document_type` | YOK | `misc.js:262-300`: `musteri`,`proje`,`arac` **ayrı kolonlar**; `tur` serbest string | PROTOTİPTE | [2.0.9] "bağ serbest metinle kurulmaz" ile de çelişiyor |
| [12.1.2] | Doküman metadata (9 eksen) | KISMEN | VAR: `DB.documentVersions` (`misc.js:327`), `DB.documentApprovals` (`:369`), `gizlilik`, `sonKullanma`. YOK: imza, saklama, hukuki bekletme, virüs, OCR, arşiv metadata | BACKEND | 9 ekseninden 4'ü var |
| [12.1.3] | İmzalı sürüm değiştirilemez | YOK | `app-dokuman-detay.html:257` yeni sürüm notu serbest; kilit yok | BACKEND | - |
| [12.1.4] | Dosya erişimi satır yetkisini aşamaz | KISMEN | `:590-596` erişim yalnız `gizlilik` + rol matrisinden türüyor; ekranın metni "doküman kaydı kendi paylaşım listesini tutmuyor" diyor | BACKEND | Bağlı kaydın satır yetkisine bakılmıyor |
| [12.2.1] | Toplantı alanları | KISMEN | VAR: `disKatilimci`,`gundem`,`notlar` (`misc.js:183-200`), karar+`sorumlu`+`termin` (`:255-258`). YOK: davet/RSVP, yinelenme, tutanak **onayı** | PROTOTİPTE | - |
| [12.2.2] | Karar→görev; görev bitince aksiyon olayla güncellenir | KISMEN | İleri yön çalışıyor: `app-toplanti-karar.html:111-134`, `app-toplanti-detay.html:126-151` gerçek `DB.tasks` + `d.gorev` FK. **Ters yön yok** | PROTOTİPTE | Karar durumu elle değiştiriliyor (`:266`) |
| [12.2.3] | Seri+örnek modeli, TZ, çakışma | YOK | `misc.js:186` `tarih:'2026-08-06T10:00'` naif yerel string | PROTOTİPTE | - |
| [12.3.1] | Mesaj→görev kaynak bağı | KISMEN | `app-sohbet.html:476` `m.gorev = kod` (ileri FK var); ama görev→mesaj bağı **serbest metin** `:464`; mesajdan hata açma yok | PROTOTİPTE | [2.0.9] ihlali |
| [12.3.2] | Kanal üyeliği kapsamı | KISMEN | `misc.js:402-424` kanalda `proje`/`dep` var; ama üyelik **sayı**: `uyeler:16`; `app-sohbet.html:253-254,660` eksiği itiraf ediyor | PROTOTİPTE | - |
| [12.3.3] | Dosya/mention/arşiv/eDiscovery/silme audit | KISMEN | VAR: dosya modalı, kanal arşivi, `@`/`#` ipucu metni `:291`. YOK: mention çözümü/bildirimi, eDiscovery, silme audit | BACKEND | **Placeholder mention vaat ediyor, karşılığı yok** |
| [12.4.1] | Otomasyon kural editörü (12 alt yetenek) | YOK | `app-ayar-otomasyon.html`: liste + salt okunur drawer `:215-253` + aç/kapat `:210`; ekranın metni `:227` "**çalışma günlüğü tutulmuyor**"; Yeni Kural butonu yok | KARARLIK | **12 alt yetenekten 0'ı var** |
| [12.4.2] | Kural idempotent | YOK | `idempot`/`dead-letter`/`replay` repoda hiç geçmiyor; `misc.js:501-570` yalnız açıklayıcı metin | BACKEND | - |
| [12.4.3] | Otomasyon yetkiyi aşmaz | YOK | `misc.js:501-570` `kullanici:'Sorumlu, yönetici'` serbest metin | BACKEND | - |
| [13.0.1] | Entegrasyon detay/ayar **sayfası** | KISMEN | `app-ayar-entegrasyon.html:167-253` yalnız `GV.drawer`; ayrı sayfa yok | PROTOTİPTE | Şartname "liste kartı yetmez" derken drawer da sayfa değil |
| [13.0.2] | OAuth / credential vault | KISMEN | `:186-189,224-228` anahtar yalnız `apiAnahtar = true` boolean, geri okunmuyor — doğru niyet; OAuth ve vault yok | BACKEND | - |
| [13.0.3] | Alan/kimlik eşleme | YOK | karşılığı yok | PROTOTİPTE | - |
| [13.0.4] | İlk/artımlı senkron, zamanlama | KISMEN | `:48` `SIKLIK` + `:262-280` manuel test; ilk vs artımlı ayrımı ve gerçek zamanlama yok | BACKEND | Test yalnız `sonSenkron` tarihini yazıyor `:277` |
| [13.0.5] | Sync job/run log | YOK | yalnız `sonSenkron` tek tarih `:206` | BACKEND | - |
| [13.0.6] | Hata kuyruğu / retry / DLQ | YOK | yalnız "Hata bildirimi alacak kişi" `:196-199` | BACKEND | - |
| [13.0.7] | Webhook imza / replay / idempotency | YOK | `siklik:'Anlık (webhook)'` `:48,53` yalnız etiket | BACKEND | **Etiket var olmayan yeteneği vaat ediyor** |
| [13.0.8] | API anahtarı scope/rate limit/rotasyon | YOK | karşılığı yok | BACKEND | - |
| [13.0.9] | Sağlık/son hata/gecikme/devre kesici | KISMEN | `:353,391` `durum` + `sonSenkron`; son hata, gecikme, devre kesici yok | BACKEND | - |
| [13.0.10] | GitHub/GitLab bağı | YOK | `misc.js:575` yalnız `aciklama:'Depo ve PR bağlantıları proje kartına yansır'` | BACKEND | **Açıklama metni var olmayan bağı anlatıyor** |
| [13.0.11] | Muhasebe entegrasyonu | YOK | `misc.js:580-581` yalnız kart satırı | BACKEND | - |
| [13.0.12] | Takvim entegrasyonu | YOK | `misc.js:577` "iki yönlü senkronize edilir" metni; `DB.meetings`'te TZ/yinelenme yok | BACKEND | **Metin iki yönlü senkron vaat ediyor, veri modeli yok** |
| [13.0.13] | **P0** Entegrasyon Hata Kuyruğu sayfası | YOK | Böyle bir HTML dosyası yok; "hata kuyruğu"/"dead-letter" repoda hiç geçmiyor | PROTOTİPTE | P0 madde tamamen açık |
| [21.0.1] | Faz 0 — envanter + güvenlik ağı | KISMEN | VAR: `tasks/cloud-envanter.md`, `docs/C-`,`E-`,`G-`, `tasks/qa/` 21 script. YOK: rol/durum/duplicate envanteri tek belgede değil; `package.json`/CI yok | PROTOTİPTE | - |
| [21.0.2] | Faz 1 — P0 ortak çekirdek | YOK | `domain.js` yalnız birkaç iş kuralı yordamı; transition/approval/idempotency/outbox motoru yok | BACKEND | - |
| [21.0.3] | Faz 2 — CreateEditPage bileşeni | YOK | Reusable CreateEditPage yok | PROTOTİPTE | - |
| [21.0.4] | Faz 3 — uçtan uca zincirler | KISMEN | `domain.js` + `tasks/components.md:344-434` bazı zincirler; satın alma→kabul→tedarikçi faturası zinciri yok | BACKEND | - |
| [21.0.5] | Faz 4 — ReportLayout + Notlarım | KISMEN | `GV.report` VAR (`ui.js:2347`), export VAR; **Notlarım modülü YOK** | PROTOTİPTE | - |
| [21.0.6] | Faz 5 — portal/bilgi bankası/API/lisans/release | YOK | Hiçbiri repoda yok | BACKEND | - |
| [22.0.1] | Önce analiz + iş paketleri | KISMEN | Kültür kurulu: `tasks/plan.md` (295/295), `tasks/revize-plan.md` (138/138), `docs/A–O` 15 rapor. Bu şartname için analiz/iş paketi henüz yok (bu tur üretiyor) | PROTOTİPTE | - |
| [22.0.2] | Paket: sorun + etkilenen sayfa/entity | **VAR** | `tasks/plan.md:621-704` her madde "sorun → ölçülen sayı → etkilenen ekran" formatında | PROTOTİPTE | - |
| [22.0.3] | Paket: hedef davranış + kurallar | KISMEN | `tasks/components.md:344-434` domain yordam sözleşmeleri; standart başlık değil | PROTOTİPTE | - |
| [22.0.4] | Paket: değişecek dosya/endpoint | KISMEN | Dosya/bileşen adları yazılı; **endpoint yok** | PROTOTİPTE | - |
| [22.0.5] | Paket: migration ve veri düzeltme | YOK | Migration kavramı yok; veri `assets/data/*.js` içinde elle düzenleniyor | BACKEND | - |
| [22.0.6] | Paket: yetki ve audit etkisi | KISMEN | Yetki etkisi yazılıyor (`tasks/plan.md:668,670`); audit etkisi başlığı yok | BACKEND | - |
| [22.0.7] | Paket: otomatik test + kabul senaryosu | KISMEN | `tasks/qa/*.js` 21 tarama (`canon.js` 4.517 kontrol, `gate.js` 710 sayfa) VAR; unit/integration yok | BACKEND | - |
| [22.0.8] | Paket: geri dönüş / feature flag | YOK | repoda yok | BACKEND | - |
| [22.0.9] | Paket: ekran görüntüsü / demo kanıtı | **VAR** | `docs/screenshots/` **870 PNG**; `tasks/qa/qa.js:3-10` 3 kırılımda otomatik | PROTOTİPTE | - |
| [22.0.10] | Faz sonu lint/typecheck/unit/E2E/a11y | KISMEN | E2E/görsel var; a11y kısmen. **YOK**: `package.json`, eslint, tsconfig, unit/integration çatısı, CI | BACKEND | - |
| [22.0.11] | Başarısız test açıkça raporlanır | **VAR** | `tasks/revize-plan.md:25-31` her script tek tek koşuldu, `xport.js` "bilinen ve bilinçli kısmi" diye işaretli | PROTOTİPTE | - |
| [22.0.12] | Veri korunur, alan anlamı migration'sız değişmez | KISMEN | Disiplin var (`tasks/plan.md:692,695` alan adı değişiklikleri belgelenmiş); kalıcı veri/migration olmadığı için garanti edilemez | BACKEND | - |

**Özet.** İki uçlu olgunluk: **ortak form motoru gerçekten tek ve disiplinli** (36/36 form `GV.form`, tek token seti, `showIf` sözleşmesi bileşende, hata sunumu tek yerde, 870 ekran görüntüsü, 21 Playwright script) — ama **şartnamenin istediği kabuk anatomisi motorda hiç yok**, entegrasyon/otomasyon katmanı neredeyse boş. En kritik üç boşluk: (1) **[3.1.5] sekme desteği yok** — `ui.js:1782` yalnız düz `sections` döngüsü; `.gv-tabs` 28 detay ekranında var ama formların sıfırında, ve bu tek boşluk [3.1.6], [3.1.12], [3.2.1] maddelerini de birlikte düşürüyor; (2) **[3.1.4]+[3.1.15] sağ bağlam paneli yok** — 36 formdan 35'i tek sütun; (3) **§13'ün 13 maddesinden 9'u tam YOK**, P0 işaretli [13.0.13] Entegrasyon Hata Kuyruğu dahil. En tehlikeli çakışma **[3.1.16]**: 34 formun tamamı kaydettikten sonra listeye dönüyor ve bu kodda yorum satırı olarak *kurallaştırılmış* (`/* normal akış listeye dönmektir */`) — şartnamenin maddesiyle kod içinde yazılı bir karşı-karar duruyor, değiştirmek 34 dosyaya dokunmayı gerektiriyor. İkinci tehlikeli sınıf: **var olmayan yeteneği anlatan metinler** — `misc.js:575` "Depo ve PR bağlantıları proje kartına yansır", `misc.js:577` "Toplantılar iki yönlü senkronize edilir", `app-ayar-entegrasyon.html:48` `'Anlık (webhook)'`; üçünün de veri modeli karşılığı yok.

**[3.3.1] sayımı — 33 tipin 23'ünün formu VAR, 10'u YOK.**
Eksik 10: Ödeme Planı · Milestone · RFQ · Tedarikçi Faturası · Tahsilat/Ödeme · Lisans/Abonelik · Doküman · Otomasyon Kuralı · Entegrasyon Ayarı · Kişisel Not.
Var olan 23: Personel, Proje, Lead, Ön Analiz, Teklif, Müşteri/Kişi (3 form), Sözleşme, Sprint, Görev, Departman Talebi, Test Senaryosu, Hata, Değişiklik Talebi, Teslimat, Destek Kaydı, Satın Alma Talebi, Satın Alma Siparişi, Tedarikçi, Fatura, Demirbaş, Zimmet, Araç, Toplantı.
(Repodaki 36 form dosyasının kalan 13'ü — 6 filo alt formu, destek paketi, performans, komisyon, izin, referans, müşteri yetkilisi/iletişimi — 33'lük listede adı geçmeyen ek ekranlar.)
## Alan 7 — Raporlama standardı, Notlarım, veri kalitesi, P0/P1/P2 envanteri

**Sayılar:** VAR 7 · KISMEN 52 · YOK 80 · BACKEND GEREKTİRİR 53 · KARARLIK 8 (toplam 139 madde)

### §14 — Raporlama standardı (48 madde)

| Madde | Konu | Durum | Kanıt | Sınıf | Çakışma |
|---|---|---|---|---|---|
| [14.0.1] | Tek ReportLayout + registry | KISMEN | `ui.js:2347` `GV.report`; **8/8 sayfa kullanıyor** (`tasks/components.md:249-274`); registry yok | PROTOTİPTE | Bileşen var, "rapor kayıt şeması" hiç yok |
| [14.0.2] | Rapor başına ayrı yaklaşım geliştirilmez | KISMEN | Kabuk ortak; kolon/format yardımcıları kopya: `app-rapor-finans.html:94-190` vs `app-rapor-musteri.html:39-59` vs `app-rapor-personel.html:91` | PROTOTİPTE | **VAR** — 7 sayfa kendi `colMoney/mny/num/bos` setini yazıyor |
| [14.0.3] | Anatomi/format sabit | KISMEN | Tek render yolu `ui.js:2489-2530`; format sapıyor | PROTOTİPTE | Biçimlendirme standardı fiilen tutmuyor |
| [14.1.1] | Breadcrumb | **VAR** | `shell.js:620-643` `renderCrumb`, `:965` | PROTOTİPTE | Seçili alt rapor (`?r=`) crumb'a yansımıyor |
| [14.1.2] | Eyebrow "Raporlama" | KISMEN | `shell.js:989`; metin `'Raporlar'` (`app-rapor-finans.html:43`) | PROTOTİPTE | Şartname "Raporlama", kod "Raporlar" |
| [14.1.3] | Başlık + tek cümle amaç | **VAR** | `ui.js:2493-2494`; `app-rapor-finans.html:667` | PROTOTİPTE | - |
| [14.1.4] | Güncellik/kapsam/sahip/formül sürümü | KISMEN | `app-rapor-finans.html:44` referans tarih; sahip ve `formula_version` yok | PROTOTİPTE | - |
| [14.1.5] | Üst eylem çubuğu (7 eylem) | KISMEN | `ui.js:2451-2456` temizle/kayıtlı/kaydet; sütun+export `ui.js:829,1479` | PROTOTİPTE | "Karşılaştır" ve "Yenile" yok |
| [14.1.6] | Ortak filtre alanı | KISMEN | `ui.js:2430-2452`; `app-rapor-finans.html:569-578` | PROTOTİPTE | **Tarih ARALIĞI yok** (tek "tarihten itibaren"); şirket/şube, para birimi yok |
| [14.1.7] | 3-6 KPI + dönem karş. + "Nasıl hesaplandı?" | KISMEN | `ui.js:2464-2479`; her raporda 4 KPI; `meta` yalnız **40/~420 KPI'da** (personel 0, finans 19) | PROTOTİPTE | Dönem karşılaştırması ve "Nasıl hesaplandı?" düğmesi yok |
| [14.1.8] | Grafik yalnız karar değeri varsa | KISMEN | `ui.js:2481-2491`; **105/105 raporda `charts:function` var** | KARARLIK | **VAR** — grafik fiilen zorunlu, "sırf görsel" filtresi yok |
| [14.1.9] | Ayrıntı tablosu | **VAR** | `ui.js:2508-2515`; sticky thead `ui.css:436`; sayfalama `ui.js:1039-1054`; sıralama `:1182-1188`; kolon yön. `:1402-1432`; arama `:845` | PROTOTİPTE | - |
| [14.1.10] | Metodoloji/formül paneli | YOK | karşılığı yok (yalnız `desc` cümlesi) | PROTOTİPTE | - |
| [14.1.11] | Alt bilgi + PDF sayfa X/Y | YOK | `ui.js:1565` çıktıda yalnız "Gavia Works · tarih · N kayıt" | PROTOTİPTE | - |
| [14.2.1] | Metin sola + kısaltma + tam metin | KISMEN | `ui.css:439`; `app-rapor-finans.html:85` `kisaAd`; `title="` sayısı **0** | PROTOTİPTE | Kısaltılan metne tam erişim yok |
| [14.2.2] | Ad/kod sola, sabit ilk kolon, kopyalanabilir | KISMEN | `app-rapor-finans.html:165` `linkCell`; `ui.js:1411` `locked` yalnız gizlemeyi engelliyor; `data-copy` **0** | PROTOTİPTE | Sabitleme + kopyalama yok |
| [14.2.3] | Sayı/yüzde sağa + ortak ayırıcı | **VAR** | `ui.css:473` `.gtable .num{text-align:right}`; `ui.js:82` tr-TR | PROTOTİPTE | - |
| [14.2.4] | Para sağa + ISO + kur kaynağı | KISMEN | `ui.css:484` `.cell-money`; `ui.js:82-86` `Fmt.money` yalnız `₺` | KARARLIK | ISO kod ve kur kaynağı yok |
| [14.2.5] | Tarih/saat **ortalanır** + saat dilimi | YOK | 7 rapor sayfasında `cellClass:'center'`/`u-center` **0**; `colDate` hizasız (`app-rapor-finans.html:147-155`) | PROTOTİPTE | **VAR** — tarihler sola hizalı |
| [14.2.6] | Durum/etiket **ortalanır** + ortak rozet | KISMEN | Ortak rozet `ui.js:220` `GV.badge`; ortalama kuralı yok | PROTOTİPTE | **VAR** — durum sola hizalı |
| [14.2.7] | Eylemler sağda, sabit son kolon | KISMEN | `ui.css:467` `.col-acts`; rapor tablolarında aksiyon kolonu yok, sabitleme yok | PROTOTİPTE | - |
| [14.2.8] | Kolon sabitleme + senkron kaydırma | YOK | `.is-sticky1` `ui.css:396-402` **tanımlı ama rapor sayfalarında 0 kullanım** | PROTOTİPTE | - |
| [14.2.9] | Satır/boşluk/rozet tüm raporlarda aynı | **VAR** | Tek CSS kaynağı `ui.css:434-473`, `.rp-filters` `:1290-1297` | PROTOTİPTE | - |
| [14.2.10] | Mobilde kart görünümü | KISMEN | `ui.js:921-934` `cfg.mobile`; `app-rapor-finans.html:170` `mRow` — tüm raporlarda tanımlı değil | PROTOTİPTE | `mobile` yoksa tablo mobilde kayıyor |
| [14.3.1] | URL state + geri/ileri | KISMEN | `ui.js:2354-2372` `?r=`+`rf_*`; `:2371` `replaceState`; `:2510` `urlSync=false` | PROTOTİPTE | Geri/ileri korunmuyor; tablo state URL'de yok |
| [14.3.2] | Kayıtlı görünüm (kişisel + ekip) | KISMEN | `ui.js:2374-2416` localStorage `gv.rp.*`; kolon görünümü `:1405-1432` | BACKEND | Ekip görünümü ve yetki yok; tarayıcıya bağlı |
| [14.3.3] | Drill-down + güvenlik kapsamı | KISMEN | `app-rapor-finans.html:165-167` kaynak kayda link | PROTOTİPTE | Toplamdan detaya kırılım yok; kapsam istemcide |
| [14.3.4] | Boş/yükleniyor/kısmi/eskimiş/hata | KISMEN | `ui.js:1101` skeleton, `:1105` errorState, `:1117` empty | PROTOTİPTE | "Kısmi veri" ve "güncel değil" durumu yok |
| [14.3.5] | Para birimleri kuralsız toplanmaz | YOK | `ui.js:82-86` tek para birimi; kur tarihi/kaynağı/orijinal değer yok | KARARLIK | - |
| [14.4.1] | PDF/XLSX/CSV/Yazdır | KISMEN | `ui.js:1479` dört biçim; `:1575-1583` "xlsx" aslında **TSV `.xls`**; `:1555-1571` "pdf" **yazdırma penceresi** | PROTOTİPTE | **VAR** — XLSX ve PDF sahte etiket |
| [14.4.2] | Export filtre/kolon/sıralama/kapsam taşır | KISMEN | `ui.js:1543` `visibleCols()`; `:1486-1492` kapsam seçimi | BACKEND | Sıralama taşınmıyor; "Tüm kayıtlar" ek izin istemiyor; formül sürümü yok |
| [14.4.3] | Büyük export arka plan job | YOK | `ui.js:1580-1585` senkron Blob indirme | BACKEND | - |
| [14.4.4] | PDF A4/başlık tekrarı/sayfa no/filigran | YOK | `ui.js:1556-1571` sabit basit HTML, `@page` yok | BACKEND | - |
| [14.4.5] | XLSX hücre tipleri/dondurma/Rapor Bilgisi | YOK | `ui.js:1575-1583` TSV | BACKEND | **VAR** — "Excel" seçeneği bu şartı hiç sağlamıyor |
| [14.4.6] | CSV UTF-8 + formül enjeksiyonu | KISMEN | `ui.js:1580` BOM, `:1577` tırnaklama | PROTOTİPTE | **VAR** — `=`/`+`/`-`/`@` ilk karakter koruması yok |
| [14.4.7] | Yazdırma CSS'i | KISMEN | `shell.css:409-413` nav/buton gizliyor | PROTOTİPTE | Sayfa kırılması ve `thead` tekrarı yönetilmiyor |
| [14.4.8] | Export audit + filigran + süreli link | YOK | yalnız yetki kapısı `ui.js:829` `canExport()` | BACKEND | - |
| [14.5.1] | Registry şeması (13 alan) | YOK | `report_id`/`formula_version` grep: **0** (yalnız `tasks/*.md`) | PROTOTİPTE | - |
| [14.5.2] | Raporların registry'ye geçişi | YOK | katalog elle `app-rapor.html:57-118` `CATS` | PROTOTİPTE | Katalog ile ekran sayıları geçmişte sapmış (`app-rapor.html:38-52`) |
| [14.5.3] | Kopya metrik sorguları kaldırılır | YOK | `app-rapor-finans.html:280` "app-butce.html ile birebir aynı formüller", `:454`, `:1999` "formül app-destek-paket.html ile birebir aynıdır" | PROTOTİPTE | **VAR** — kopya hesap kodda kalmış ve belgelenmiş |
| [14.5.4] | Rapor/export yetkisi sunucuda | YOK | tüm yetki istemcide `shell.js:355-402` | BACKEND | - |
| [14.5.5] | Kişisel notlar rapora girmez | YOK | Notlarım modülü yok; uygulanan kural yok | BACKEND | - |
| [14.6.1] | Ekran/PDF/XLSX/CSV aynı küme | KISMEN | `tasks/qa/xport.js:1-25` ekran-vs-çıktı kolon karşılaştırıcısı | PROTOTİPTE | Toplam satırları (`tfoot`) çıktıya girmiyor |
| [14.6.2] | Görülmeyen satır/alan export'ta yok | KISMEN | `ui.js:1547` `colMasked` çıktıyı boşaltıyor; `:1522` yetki kapısı | BACKEND | Satır kapsamı istemcide |
| [14.6.3] | PDF başlık kesilmez/tekrar/sayfa no | YOK | `ui.js:1556-1571` | BACKEND | - |
| [14.6.4] | Para/yüzde/tarih/durum hizası aynı | KISMEN | para+yüzde tutarlı; tarih/durum hiç hizalanmıyor | PROTOTİPTE | **VAR** — [14.2.5]/[14.2.6] burada da düşüyor |
| [14.6.5] | Formül sürümü çıktı metadata'sında kalır | YOK | karşılığı yok | BACKEND | - |
| [14.6.6] | 100 bin+ satır arka planda | YOK | `ui.js:1580` senkron | BACKEND | - |

### §15 — Notlarım (38 madde)

**Modül kodda hiç yok**: dosya, menü girdisi, veri koleksiyonu, "Çalışma Alanım" dizgesi — hepsi sıfır (`shell.js:141-153` bölümlerde yok). 38 maddenin tamamı YOK. Sınıf ayrımı: 16'sı prototipte kurulabilir UI işi, 17'si sunucu tarafı gizlilik sözleşmesi, 5'i kararlık.

| Madde | Konu | Durum | Kanıt | Sınıf |
|---|---|---|---|---|
| [15.0.1] | Menüde Notlarım sayfası | YOK | `shell.js:141-153` bölümlerde yok | PROTOTİPTE |
| [15.0.2] | Amaç: yalnız sahibine özel | YOK | karşılığı yok | PROTOTİPTE |
| [15.0.3] | Başlık standardı | YOK | karşılığı yok | PROTOTİPTE |
| [15.1.1] | Görünümler (Tümü/Açık/Bugün/…) | YOK | karşılığı yok | PROTOTİPTE |
| [15.1.2] | Arama/etiket/kategori/öncelik | YOK | karşılığı yok | PROTOTİPTE |
| [15.1.3] | Liste/kart alanları | YOK | karşılığı yok | PROTOTİPTE |
| [15.1.4] | Checkbox + `completed_at` | YOK | karşılığı yok | PROTOTİPTE |
| [15.1.5] | Geri al/sabitle/arşivle/yumuşak sil | YOK | karşılığı yok | PROTOTİPTE |
| [15.1.6] | Boş durum + geciken uyarısı + hatırlatma | YOK | karşılığı yok | BACKEND |
| [15.1.7] | Klavye kısayolları + erişilebilirlik | YOK | karşılığı yok | PROTOTİPTE |
| [15.2.1] | Personel formu referans düzeni | YOK | karşılığı yok | PROTOTİPTE |
| [15.2.2] | Bölüm "Not" | YOK | karşılığı yok | PROTOTİPTE |
| [15.2.3] | Bölüm "Kontrol Listesi" | YOK | karşılığı yok | PROTOTİPTE |
| [15.2.4] | Bölüm "Plan" | YOK | karşılığı yok | PROTOTİPTE |
| [15.2.5] | Bölüm "Özet" | YOK | karşılığı yok | PROTOTİPTE |
| [15.2.6] | "Notu Kaydet" / "Vazgeç" | YOK | karşılığı yok | PROTOTİPTE |
| [15.2.7] | Taslak otomatik kaydetme güvenliği | YOK | karşılığı yok | KARARLIK |
| [15.3.1] | `personal_notes` şeması | YOK | `assets/data/*.js` içinde koleksiyon yok | BACKEND |
| [15.3.2] | `personal_note_checklist_items` | YOK | karşılığı yok | BACKEND |
| [15.3.3] | Etiket tablosu | YOK | karşılığı yok | BACKEND |
| [15.3.4] | Transaction + otomatik tamamlama politikası | YOK | karşılığı yok | KARARLIK |
| [15.4.1] | Sunucuda `owner_user_id` kapsamı | YOK | karşılığı yok | BACKEND |
| [15.4.2] | `owner_user_id` body'den alınmaz | YOK | karşılığı yok | BACKEND |
| [15.4.3] | Başkasının ID'sinde 404 | YOK | karşılığı yok | BACKEND |
| [15.4.4] | Yönetici/superadmin okuyamaz | YOK | `shell.js:355` rol matrisi not kapsamı tanımıyor | BACKEND |
| [15.4.5] | İçerik arama/rapor/export/AI'ya girmez | YOK | karşılığı yok | BACKEND |
| [15.4.6] | Audit yalnız metadata | YOK | karşılığı yok | BACKEND |
| [15.4.7] | Hatırlatma yalnız sahibine | YOK | karşılığı yok | BACKEND |
| [15.4.8] | Log/analytics not metnini yakalamaz | YOK | karşılığı yok | BACKEND |
| [15.4.9] | Dinlenirken/aktarımda şifreleme | YOK | karşılığı yok | KARARLIK |
| [15.4.10] | Yedekleme/saklama + geri alma süresi | YOK | karşılığı yok | KARARLIK |
| [15.4.11] | Notu kurumsal göreve dönüştürme | YOK | karşılığı yok | KARARLIK |
| [15.5.1] | B kullanıcısı hiçbir kanalda görmez | YOK | karşılığı yok | BACKEND |
| [15.5.2] | Superadmin gövdeyi okuyamaz | YOK | karşılığı yok | BACKEND |
| [15.5.3] | Sahte `owner_user_id` reddedilir | YOK | karşılığı yok | BACKEND |
| [15.5.4] | `checked_at`/`completed_at` tutarlılığı | YOK | karşılığı yok | BACKEND |
| [15.5.5] | Not metni audit/log/aramada yok | YOK | karşılığı yok | BACKEND |
| [15.5.6] | Hatırlatma bir kez, retry yinelemez | YOK | karşılığı yok | BACKEND |

### §16 — P0/P1/P2 envanteri (31 madde)

| Madde | Konu | Durum | Kanıt | Sınıf |
|---|---|---|---|---|
| [16.1.1] | Ortak workflow eylem modalı | KISMEN | `ui.js:307` modal, `:364` confirm, `:382` result, `:391` drawer — genel amaçlı; `GV.action` grep: 0 | PROTOTİPTE |
| [16.1.2] | Geçiş + sürümlenmiş onay motoru | KISMEN | `domain.js:242` (yalnız görev), `:129` `approve`; `app-ayar-onay.html` kural ekranı | BACKEND |
| [16.1.3] | Veri Kalitesi & Sistem Sağlığı sayfası | YOK | grep tüm repoda 0 | PROTOTİPTE |
| [16.1.4] | Entegrasyon hata kuyruğu/replay | YOK | `app-ayar-entegrasyon.html` içinde replay/dead-letter 0 | PROTOTİPTE |
| [16.1.5] | Satır/alan/rapor/export yetki + regresyon | KISMEN | `shell.js:355-402`, `ui.js:39` `colMasked`, `tasks/qa/gate.js` | BACKEND |
| [16.1.6] | Finansal kanonik kaynak | KISMEN | `domain.js:49-93`, `:614` | BACKEND |
| [16.1.7] | İş takvimi/SLA motoru | KISMEN | `app-destek-sla.html` var; iş günü/takvim yordamı yok | BACKEND |
| [16.1.8] | Notlarım negatif yetki testleri | YOK | `tasks/qa/` içinde not testi yok | BACKEND |
| [16.2.1] | Milestone CRUD/detail | KISMEN | `app-proje-milestone.html:81,90` yalnız liste | PROTOTİPTE |
| [16.2.2] | Sprint CRUD/detail | KISMEN | liste + form var; detay yok | PROTOTİPTE |
| [16.2.3] | Test planı/senaryo/çalıştırma/sonuç | KISMEN | `app-proje-test*` üçlü var; senaryo kütüphanesi ve plan ayrı değil | PROTOTİPTE |
| [16.2.4] | Değişiklik talebi CRUD/approval | **VAR** | `app-proje-degisiklik.html`, `-form`, `-detay` | PROTOTİPTE |
| [16.2.5] | Teslimat create + müşteri kabul | KISMEN | üçlü var; müşteri kabul ekranı yok | PROTOTİPTE |
| [16.2.6] | Tahsilat formu + dağıtım | KISMEN | liste + detay var; **form yok**, "dağıt/tahsis" grep 0 | PROTOTİPTE |
| [16.2.7] | Ödeme planı CRUD/detail/revision | KISMEN | `app-odemeplani.html:118,124` yalnız liste | PROTOTİPTE |
| [16.2.8] | Tedarikçi faturası / borç hesapları | YOK | `app-fatura-form.html` içinde "tedarikçi" 0 | PROTOTİPTE |
| [16.2.9] | RFQ + teknik/ticari değerlendirme | KISMEN | `app-satinalma-teklif.html` var; ayrı değerlendirme matrisi yok | PROTOTİPTE |
| [16.2.10] | Release/deployment yönetimi | YOK | dosya yok | PROTOTİPTE |
| [16.2.11] | Bilgi bankası | YOK | dosya yok | PROTOTİPTE |
| [16.2.12] | Müşteri portalı | YOK | dosya yok | BACKEND |
| [16.2.13] | Otomasyon kural editörü + geçmiş | KISMEN | `app-ayar-otomasyon.html:54-78,176` liste; editör yok | PROTOTİPTE |
| [16.2.14] | Entegrasyon detay/ayar/senk logları | KISMEN | `app-ayar-entegrasyon.html:97,135-137`; ayrı sayfa ve log ekranı yok | PROTOTİPTE |
| [16.2.15] | Onboarding/offboarding + zimmet kabulü | KISMEN | `app-personel-giris.html` var; `app-zimmet.html` içinde "kabul" 0 | PROTOTİPTE |
| [16.2.16] | Tek tip ReportLayout + migrasyon | KISMEN | `ui.js:2347`; 8/8 sayfa kullanıyor | PROTOTİPTE |
| [16.2.17] | Notlarım ekranları | YOK | dosya yok | PROTOTİPTE |
| [16.3.1] | Ürün/hizmet kataloğu + fiyatlandırma | KISMEN | `app-destek-paket.html:88`; genel katalog yok | PROTOTİPTE |
| [16.3.2] | Lisans/abonelik yönetimi | KISMEN | demirbaş içinde lisans türü; abonelik döngüsü yok | PROTOTİPTE |
| [16.3.3] | Tedarikçi portalı | YOK | dosya yok | BACKEND |
| [16.3.4] | API anahtarı + webhook yönetimi | KISMEN | `app-ayar-entegrasyon.html:48,53` sıklık alanı; anahtar yönetimi yok | BACKEND |
| [16.3.5] | Zamanlanmış rapor dağıtımı + ekip görünümleri | YOK | `ui.js:2374-2416` yalnız yerel kayıt | BACKEND |
| [16.3.6] | Sağlık skoru/tahminleme/kapasite senaryosu | KISMEN | `app-rapor-musteri.html:223,237` risk + LTV; tahminleme yok | PROTOTİPTE |

### §17 — Veri Kalitesi ve Sistem Sağlığı (13 madde)

Sayfa tümüyle yok. Tek kırıntı: üç formda elle yazılmış mükerrer uyarısı.

| Madde | Konu | Durum | Kanıt | Sınıf |
|---|---|---|---|---|
| [17.0.1] | Ayrı yönetim sayfası + zamanlı/talep üzerine | YOK | karşılığı yok | PROTOTİPTE |
| [17.0.2] | Yetim/kaynaksız kayıt | YOK | karşılığı yok | BACKEND |
| [17.0.3] | Mükerrer müşteri/kişi/fatura/ödeme/proje | KISMEN | Form içi tekil uyarılar: `app-tedarikci-form.html:361`, `app-toplanti-form.html:420`, `app-arac-yakit-form.html:904` | BACKEND |
| [17.0.4] | Müşteri–teklif–sözleşme–proje bağ tutarlılığı | YOK | karşılığı yok | BACKEND |
| [17.0.5] | Durum ile olay geçmişi uyuşmazlığı | YOK | karşılığı yok | BACKEND |
| [17.0.6] | Elle/mükerrer onay sayacı | YOK | karşılığı yok | BACKEND |
| [17.0.7] | Başarısız entegrasyon + dead-letter | YOK | karşılığı yok | BACKEND |
| [17.0.8] | Eksik ilişki/imza/belge/kabul/tahsis | YOK | karşılığı yok | BACKEND |
| [17.0.9] | Süresi dolmuş ama aktif sözleşme/lisans | YOK | Rapor olarak var (`app-rapor-finans.html:2148`), kontrol olarak yok | BACKEND |
| [17.0.10] | Çoklu aktif zimmet / çakışan kapasite | YOK | karşılığı yok | BACKEND |
| [17.0.11] | Eskimiş rol/izin önbelleği | YOK | karşılığı yok | BACKEND |
| [17.0.12] | Bulgu meta (önem, kural, sorumlu, audit) | YOK | karşılığı yok | PROTOTİPTE |
| [17.0.13] | Otomatik düzeltme geri alınabilir/yetkili | YOK | karşılığı yok | BACKEND |

### §20.4.5–20.4.7 ve §20.5 — Kabul senaryoları (9 madde)

| Madde | Konu | Durum | Kanıt | Sınıf | Çakışma |
|---|---|---|---|---|---|
| [20.4.5] | Kullanıcı A not/checklist oluşturup tikler | YOK | modül yok | PROTOTİPTE | - |
| [20.4.6] | B ve superadmin erişemez | YOK | modül yok | BACKEND | - |
| [20.4.7] | Not metni audit/log/arama/rapora girmez | YOK | modül yok | BACKEND | - |
| [20.5.1] | Satış/proje/finans aynı ReportLayout | **VAR** | `app-rapor-finans.html:566`, `app-rapor-proje.html:583`, `app-rapor-musteri.html:202` → hepsi `GV.report` | PROTOTİPTE | - |
| [20.5.2] | Aynı tarih/müşteri/proje filtreleri | KISMEN | `app-rapor-finans.html:569-578` vs `-proje.html:586-600` vs `-musteri.html:204-214` | PROTOTİPTE | Filtre anahtarları sayfa başına farklı; sayfalar arası taşınmıyor |
| [20.5.3] | Kolon/hizalama/KPI açıklaması/drill-down ortak | KISMEN | KPI `meta` dağılımı: personel 0, finans 19, filo 1 | PROTOTİPTE | **VAR** — açıklama ve tarih/durum hizası ortak değil |
| [20.5.4] | PDF/XLSX/CSV/yazdır çıktısı | KISMEN | `ui.js:1479-1483` | PROTOTİPTE | XLSX/PDF gerçek biçim değil |
| [20.5.5] | Kayıt/toplam/filtre/formül sürümü aynı | KISMEN | `ui.js:1486-1492` kapsam; toplam ve formül sürümü çıktıda yok | BACKEND | - |
| [20.5.6] | Yetkisiz alan çıktıda yok + not rapora girmez | KISMEN | `ui.js:1547` maskeli hücre çıktıya girmiyor | BACKEND | Not modülü yok; satır kapsamı sunucuda değil |

**Özet.** Ortak rapor kabuğu şartnamenin ima ettiği kadar eksik değil: `ui.js:2347-2537` içinde ~190 satırlık gerçek bir `GV.report(config)` bileşeni var ve 8 rapor sayfasının **hepsi** onu kullanıyor; sol rapor navigasyonu, filtre şeridi, KPI ızgarası, grafik kartları ve `GV.list` tablosu tek yerden basılıyor, `?r=`+`rf_*` derin bağlantısı çalışıyor. Yani [14.0.1]'in "tek bileşen" yarısı VAR, "rapor kayıt şeması" yarısı hiç yok. **Kopya kod kabukta değil, kabuğun üstünde**: 7 sayfa toplam ~3.060 satırlık prelude yazıyor ve içinde `colMoney/colNum/colPct/colDate/colDurum/colKisi/mny/num/sub/faint/linkCell/mRow/tbl/bos` kolon+format fabrikaları her sayfada yeniden tanımlanıyor (finans'ta `app-rapor-finans.html:76-190` = 115 satır) — kabaca **800–1.000 satır silinebilir kopya**, `ui.js`'ye taşınacak ~250 satır ortak API karşılığında. Ölçülebilir tek format ihlali: para ve sayı doğru sağa hizalı, ama şartnamenin ortalanmasını istediği tarih ([14.2.5]) ve durum ([14.2.6]) 7 sayfanın hiçbirinde ortalanmıyor — `cellClass:'center'` sayısı sıfır. Export dört seçenek gösteriyor, **ikisi sahte**: "Excel" tab ayraçlı `.xls` metin dosyası, "PDF" yazdırma penceresi. §15 Notlarım kodda hiç yok, §17 Veri Kalitesi sayfası da yok. **Hüküm: ReportLayout'a geçiş sıfırdan bileşen yazmak değil, mevcut `GV.report`'u tamamlamaktır.**
