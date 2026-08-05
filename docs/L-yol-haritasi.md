# L — Geliştirme Yol Haritası

> **Neyden türetildi:** 2026-08-05, 8. oturum kapanışı. Kaynaklar: `tasks/plan.md`
> (**195/274 madde tamam · 32 kısmen · 47 açık**), `tasks/ui-debt.md`
> (**42 açık kayıt** — 24 UID + 18 VB; ayrıca yalnız plan.md'de duran VB-04 ile 43),
> `tasks/lessons.md` (L-01…L-20), `tasks/components.md` (bileşen sözlüğü + QA tablosu) ve
> PROMPT.md §25 (fazlandırma) + §26-L (bu dokümanın istenen yedi ekseni).
> Hiçbir faz hayalî değildir: aşağıdaki her satır yukarıdaki dört defterde **kayıtlı** bir
> açık maddeye karşılık gelir. Saat/gün tahmini **verilmemiştir** — büyüklük yalnız madde
> sayısı ve dokunulan ortak katman dosyasıyla ölçülür (ders **L-05**).

---

## 0. Bugünkü durum — tek bakışta

| Eksen | Sayı | Not |
|---|---|---|
| plan.md tamam | 195 / 274 | %71 |
| plan.md kısmen (`[~]`) | 32 | çoğu "form bekliyor" notunu taşıyor ama **formlar 8. oturumda üretildi** — defter bu yönüyle eskimiş, aşağıda düzeltildi |
| plan.md açık (`[ ]`) | 47 | 20'si borç defteri maddesi, 10'u sistem geneli denetim, 6'sı doküman çıktısı, 5'i kapanış taraması, 6'sı kapsam boşluğu |
| ui-debt açık | 42 | 24 UID (arayüz/bileşen) + 18 VB (veri) |
| ui-debt kapalı | 5 | UID-01 · VB-05 · VB-07 · VB-08 · VB-19 (VB-01/02/03 daha önce components.md §9b/9c'ye taşınarak kapandı) |
| Üretilen ekran | ~108 | `gate.js` 105 ekran × 5 rol temiz; `esc.js` 108 ekran taradı |
| Canonical eksen | 18 eksen / 607 kontrol | `tasks/qa/canon.js` |
| Ortak bileşen | `GV.list` · `GV.form` · `GV.report` · `GV.tabs` · `GV.badge` · `GV.chain` · `GV.activity` + ~30 yardımcı | `components.md` |

**Defterdeki eskimeler (bu doküman yazılırken ölçüldü, düzeltilmedi — `tasks/` yazma yetkisi yok):**

| Nerede | Defter ne diyor | Gerçek |
|---|---|---|
| plan.md Wave 2/4/5/6/7/8/9 `[~]` maddeleri | "form bekliyor" | 36 form ekranının 36'sı `[x]` — bu `[~]`'lerin form bacağı kapandı |
| plan.md Wave 3 satır 124 | `[ ]` Müşteri formu + Yetkili formu + İletişim kaydı formu | üçü de Wave 12b'de `[x]` |
| plan.md F bölümü "Proje başlatma" | "proje açılış formu yok" | `app-proje-form.html` `[x]`; kalan eksik **tek işlemle zincir tetikleme** |
| plan.md Wave 11 / VB-26 | proje raporu sayısı 8 | ekranda **12** rapor var (VB-26 ölçtü) |

Bu eskimeler yol haritasının kapsamını **daraltmaz**: aşağıda her `[~]` maddenin
**form dışı kalan bacağı** kapsama alınmıştır.

---

## 1. FAZLAR

### 1.1 PROMPT.md §25 fazlandırması ile bugünkü durumun karşılaştırması

PROMPT.md §25 üç faz tanımlar. Aşağıdaki tablo, o fazların **bugünkü gerçek karşılığını**
dürüstçe verir. "Ekran var" demek, arayüzün kurulu olduğu anlamına gelir — bu proje
**yalnız arayüz** kapsamındadır (CLAUDE.md), backend/entegrasyon iddiası yoktur.

| §25 Faz | Kalem | Bugün | Sapma / not |
|---|---|---|---|
| **Faz 1** | Kullanıcı ve yetkilendirme | ✅ | 27 rol · 20 yetki ekseni · 403 kapısı · alan maskeleme. **Satır kapsamı eksik (UID-05)** |
| Faz 1 | Dashboard | ✅ | 7 varyant (6 + müşteri paneli) |
| Faz 1 | Bildirimler | ✅ | merkez + 31 tip × 7 kanal tercih matrisi |
| Faz 1 | Müşteri adayları · Müşteriler · Referans kaynağı | ✅ | liste + detay + form |
| Faz 1 | Satış pipeline · Ön analiz · Teklif | ✅ / `[~]` | pipeline 15 aşama ✅; **ön analizin 10 çıktısı üretilmedi** |
| Faz 1 | Projeler · Gelişmiş görev yönetimi | ✅ / `[~]` | 22 sekmeli proje detayı ✅; **görev takvim görünümü yok** |
| Faz 1 | Departmanlar arası iş talebi · Temel sohbet | ✅ | |
| Faz 1 | Personel kartları · İzin · Zaman kaydı | ✅ / `[~]` | **zaman kaydı start/stop zamanlayıcısı yok** |
| Faz 1 | Temel demirbaş · Temel araç kartı · Dokümanlar | ✅ | |
| Faz 1 | Temel raporlar | ✅ | 8 rapor ekranı / 103 rapor — Faz 1 beklentisinin **üstünde** |
| **Faz 2** | Sözleşmeler · Satın alma · Tedarikçiler · Zimmet | ✅ / `[~]` | **zimmetin tutanak/dijital onay/fotoğraf/hasar adımları veride yok** |
| Faz 2 | Müşteri portalı | ⚠️ kısmi | Ayrı portal yok; "Müşteri kullanıcısı (kısıtlı) paneli" 7. dashboard varyantı olarak kuruldu — **bilinçli sapma** |
| Faz 2 | Sprint ve gelişmiş proje yönetimi | ✅ | sprint · kanban · gantt · milestone · teslim · test · hata · değişiklik |
| Faz 2 | Sohbetten görev oluşturma | ✅ | 16 alanlı devir |
| Faz 2 | Gelişmiş personel yönetimi · Performans · Eğitim | ✅ / `[~]` | **`DB.trainings` yetkinlik/kazanım alanı yok** · **işe giriş/çıkış ekranı ve koleksiyonu yok** |
| Faz 2 | Araç bakım · Muayene · Sigorta · Kasko · Yakıt · Giderler | ✅ | 8 ekranlık ayrı filo modülü |
| Faz 2 | Destek ve bakım | ✅ | talep · SLA · paket · memnuniyet |
| Faz 2 | Gelişmiş müşteri/personel raporları | ✅ | 14 + 13 rapor |
| **Faz 3** | Proje/müşteri kârlılığı · Finansal tahminler | ✅ | `app-rapor-finans` 16 rapor (kârlılık, nakit akış, aylık gelir tahmini) |
| Faz 3 | Muhasebe · GitHub/GitLab · Takvim · Slack/Teams · E-imza · AI | ⚠️ yalnız ayar ekranı | `app-ayar-entegrasyon.html` bağlantı durumu + maskeli anahtar + test bağlantısı. **Gerçek entegrasyon yok ve olmayacak** (proje kapsamı: sadece arayüz). E-imza tarafında **doküman onay zinciri koleksiyonu da yok** |
| Faz 3 | Gelişmiş filo analitiği | ✅ | `app-rapor-filo` 19 rapor |
| Faz 3 | Kapasite tahmini | ✅ | `app-kapasite` + kapasite raporu |
| Faz 3 | Otomatik yönetici raporları | ⚠️ kısmi | `app-panel-yonetici` + kayıtlı rapor var; **zamanlanmış/otomatik gönderim arayüzü yok** — `app-ayar-bildirim`'deki "özet sıklığı" en yakın karşılık |
| Faz 3 | Çoklu şirket | ✅ | `app-ayar-sirket` tenant listesi |
| Faz 3 | SaaS lisanslama · Paket ve abonelik yönetimi | ❌ | **Üretilmedi.** `app-destek-paket` bakım paketidir, SaaS aboneliği değil. Bu iki kalem plan.md'de de madde olarak **yok** — kapsam boşluğu, M dokümanının konusu |

**Genel sapma değerlendirmesi (dürüst okuma):**

1. §25'in **Faz 1 ve Faz 2'si büyük ölçüde bitti**; Faz 3'ün rapor/analitik bacağı da bitti.
   Yani proje §25'in fazlandırmasını **ekran ekseninde geçti**, ama **kalite ekseninde**
   geride: 42 açık borç kaydı, 47 açık plan maddesi.
2. §25 bir **modül sırası** verir, bir **kalite sırası** vermez. Bugünkü gerçek kuyruk
   modül değil, **ortak katman borcu**. Bu yüzden aşağıdaki fazlandırma §25'i
   *devam ettirmez*, onun üstüne **Faz 4–9 olarak kalite ve kapanış fazları** kurar.
3. §25'te olmayıp bugün var olan iş: **rapor merkezi 103 rapor**, **36 form ekranı**,
   **borç defteri disiplini**, **QA harness'ı (13 script)**. Bunlar plana sonradan girdi.
4. §25'te olup bugün olmayan tek gerçek kalem: **SaaS lisanslama + abonelik yönetimi**
   ve **ayrı müşteri portalı**. İkisi de bilinçli olarak kapsam dışında bırakıldı; M
   dokümanına öneri olarak taşınmalıdır.

---

### 1.2 Tamamlanmış fazlar (nereden gelindi — kısa)

| Faz | Kapsam | Çıktı |
|---|---|---|
| **F-0 Altyapı** | tokens/shell/ui CSS · shell.js · ui.js · 6 veri dosyası · yetki çözümleyici | 8/8 madde `[x]`; sıfır hardcode değer, sıfır CDN |
| **F-1 Dashboard** | 7 dashboard varyantı + günlük özet, onaylar, bildirim, duyuru, yönetici paneli | Wave 1 TAMAM |
| **F-2 Modül ekranları** | Wave 2–12: satış, müşteri, proje, görev, İK, filo, satın alma, destek, sohbet, toplantı, doküman, finans, rapor, ayar | ~70 liste/detay ekranı |
| **F-3 Rapor merkezi** | `GV.report` + 8 rapor ekranı + 103 rapor | Wave 11 TAMAM |
| **F-4 Form bloğu** | 36 form ekranı + `duyuru-detay` kararı | Wave 12b TAMAM (8. oturum) |
| **F-5 Veri bağı turu** | VB-05 / VB-07 / VB-08 tek turda; VB-19 (KDV çifte uygulama) | `canon.js` 445 → 607 kontrol |

Bu beş fazın ortak dersi defterlere yazıldı: **çözüm ekranda değil ortak katmanda yapılır**
ve **her iddia ölçülerek raporlanır** (L-05, L-08, L-13).

---

### 1.3 Kalan fazlar

Sıralama ölçütü, bölüm 3'teki öncelik ölçütüyle **aynıdır**: kullanıcıya görünen sessiz
yanlışlık en önde, kozmetik en arkada. Bu, plan.md'nin "önce tüm ekranlar, sonra UI/UX
kalite geçişi" sırasından bir **bilinçli sapmadır** ve gerekçesi şudur: ekran üretimi
fiilen bitti (kalan 6 kapsam boşluğu hariç), ama **veri yanlışlığı bugün ekranda görünüyor**
ve her yeni ekran onu kopyalıyor. Kozmetik denetimleri (Kapsam B) plan.md'deki yerinde,
en sonda bırakıldı.

---

#### FAZ 4 — Sessiz Yanlışlığın Kapatılması

**Amaç:** Kullanıcının ekranda **doğru sandığı ama yanlış olan** bilgiyi kaynağında bitirmek.
Bu fazdaki her maddenin ortak özelliği: sahte buton değil, **sessiz yanlış sonuç** — bu
yüzden daha tehlikeli (ui-debt UID-12 ve UID-21 kayıtlarının kendi ifadesi).

**Kapsam (11 kayıt):**

| Kod | Kusur | Bugünkü görünen yanlış |
|---|---|---|
| VB-06 + VB-25 | Fatura ↔ tahsilat mutasyonları birbirini kapatmıyor; `odemeDurum` ayna alan | Fatura "Ödendi" işaretlendikten sonra tahsilat sekmesi hâlâ açık alacak gösteriyor — ekran kendi içinde çelişiyor |
| VB-23 | Teslim onayı üç ekranda üç farklı yürütülüyor | Aynı işlem liste ve detayda farklı sonuç bırakıyor; mobil satırda `Revizyon istendi` yeşil "Müşteri onayladı" çıkıyor |
| UID-24 | `teslimKontrol` üç değeri listede ikiye iniyor | `İade` ile `Eksik` listede ayırt edilemiyor, oysa `İade` siparişi `İptal`e çekiyor |
| UID-11 | Finans yetkisi yokken KPI `₺0` | "Bekleyen taksit tutarı ₺0" — maskeleme değil **yanlış bilgi** (ölçüldü: `app-proje-milestone`, `qa` rolü, 20 hücre maskeli ama KPI 0) |
| UID-05 | `GV.perm.scope('gor')` liste ekranlarında uygulanmıyor | `app-destek-paket` `musteri` rolüyle 6 müşterinin paketini birden gösteriyor |
| UID-25 | Rapor çıktısı 73 raporda yetki kapısız | 13 rol `disaAktar` yetkisi olmadan çıktı butonu görüyor ve basabiliyor |
| UID-13 | `bulk[]`'te `show`/yetki kapısı yok | Yetki isteyen toplu işlem her rolde basılıyor; kapı `run` içinde |
| UID-12 | `app-gorev.html`'de "Tümü" sekmesi yok | Dış filtreli link sprintin tamamlanmış görevlerini gizliyor |
| UID-21 | `app-referans.html` yanlış eksende süzüyor | Yönlendirenin **türüne** göre süzüyor, kişisine göre değil |
| VB-16 | `DB.analyses[].maliyet` adı ekseni yanlış anlatıyor | Bugün ekranlar etikette doğru yazıyor; **ad** hâlâ yanıltıcı |

**Çıkış kriteri:**
- `GV.fin.settleInvoice/settlePayment` ve `GV.delivery.approve` **tek yerde** tanımlı, dört
  finans + üç teslim ekranı onları çağırıyor; ekranlarda ikinci mutasyon yolu kalmadı.
- `canon.js`'e üç yeni eksen girdi: (a) fatura `Ödendi` ise bağlı tahsilat da `Ödendi`,
  (b) taksitin `odemeDurum`'u bağlı faturasının durumuyla aynı, (c) teslim onayı ile
  `durum` alanı tutarlı. Tarama **temiz**.
- Yeni `perm.js` senaryosu (bölüm 7): yetkisiz rolde çıktı şeridi ve yetkisiz toplu işlem
  **hiç basılmıyor**; ölçüm 5 rol × 8 rapor ekranı + 10 liste ekranı.
- Yeni `mask.js` senaryosu: para KPI'ı olan her ekranda finansız rol `••••••` görüyor, `₺0`
  **hiçbir ekranda** çıkmıyor.
- `app-gorev.html` ve `app-referans.html` dış bağlantıları tam küme döndürüyor (ölçüm:
  `SPR-2026-020` bağlantısı, sprintin tamamlanmış görevleri dahil).

---

#### FAZ 5 — Veri Ekseni ve Sözlük Turu

**Amaç:** Ekranların küme, sözlük ve eşik tablosu **türetmesini** bitirmek. Bugün üç form
ekranı kümelerini liste süzgeçlerinden çıkarmak zorunda kaldı; bir form onay eşik tablosunu
**kopyaladı**. Aynı gerçek iki yerde yaşadığı sürece biri sessizce eskir (ders **L-08**).

**Kapsam (11 kayıt + 4 plan maddesi):**

| Kod | İş |
|---|---|
| VB-04 + VB-09 + VB-16 | Alan/kayıt adı rename turu: `hakedis`/`hakedisTarihi` → komisyon ekseni · `MOD-009 "Saha ekip yönetimi"` → yazılım terminolojisi · `DB.analyses[].maliyet` → `tahminiBedel` |
| VB-14 + VB-17 + VB-22 | Sözlük turu: `DB.interactionTypes` · `DB.timeUnits` · `DB.projectStatuses` · `DB.healthLevels` · `DB.projectPhases` · `DB.bugStatuses` · `DB.reproLevels` · `DB.testResults` (+ UID-24'ün `teslimKontrol` kümesi) |
| VB-20 (+ VB-22 eki) | `aktif` / `arsiv` tek eksene indirilir ve **tüm koleksiyonlarda** eşitlenir (`DB.sprints`'in 6 kaydında alan hiç yok) · `faz` alanındaki `Tamamlandı` durum ekseninden çıkarılır · iki sözleşmesiz projenin (`PRJ-2026-007`, `PRJ-2025-008`) bedeli ya sözleşmelendirilir ya kaldırılır |
| VB-18 | `DB.commissions` şema tekdüzeliği: `arsiv` altı kayda da yazılır, `onay` alanındaki `'—'` sentinel'i sözlük değerine çevrilir |
| VB-24 | `doluluk` tek kaynağa iner (`DB.capacity`), `DB.employees[].doluluk` ve `DB.company.calisanSayisi` türetilir |
| VB-12 + VB-13 | Kişi kimliği turu: `DB.tickets[].yetkili` · `DB.interactions[].kontakKod` (`YTK-*`) · `DB.referrers[].kontak` · ekrandaki ad kaskadı silinir |
| VB-10 | `DB.approvalFlows` koleksiyonu (akış türü × eşik × makam); ayar ekranı ve `app-satinalma-form` aynı kaynaktan okur |
| VB-11 | `DB.budgets` koleksiyonu (kod · ad · yıl · limit · sahip departman) |
| VB-15 | `DB.documents[].referans` / `.yetkili` bağ alanı |
| VB-26 | Rapor katalog `key`'leri ekran tanımlarından türetilir (finansta 9, projede 8 girdi eşleşmiyor); proje rapor sayısı defterlerde 12'ye düzeltilir |
| UID-16 | `DB.activities` kod öneki kapsamı: `TKL-*` `EMP-*` `ARC-*` `REF-*` `YTK-*` `SAT-*` `SZL-*` `FTR-*` `DST-*` |
| plan E | `checklist_item` koleksiyonu · `DB.trainings` yetkinlik/kazanım alanı · sipariş eksik/kısmi teslim + iade alanı · doküman versiyon geçmişi + onay zinciri koleksiyonu |

**Çıkış kriteri:**
- Hiçbir ekran/form kendi sözlüğünü türetmiyor; `grep` ile ekran dosyalarında elle yazılmış
  değer kümesi kalmadı.
- `canon.js` yeni eksenlerle temiz: sözlük üyeliği · yetkili bağı · onay eşiği ↔ `onayToplam` ·
  kapasite ↔ doluluk · katalog `key` ↔ ekran raporu · her detay kod öneki için ≥1 aktivite.
- `dbref.js` temiz — yeni koleksiyonları okuyan her ekran ilgili veri dosyasını yüklüyor
  (ders **L-12**; sözlük turunun en olası regresyonu tam olarak budur).
- Yasak terminoloji taraması: `hakedis` · `saha` · `santiye` · `taseron` tam metin araması
  `assets/` ve `*.html` altında **sıfır** sonuç.

---

#### FAZ 6 — Erişilemeyen İşlev ve Kapsam Boşlukları

**Amaç:** Var olan ama kullanıcıya **ulaşmayan** işlevi açmak; plan.md'de menüde yazılı olup
üretilmemiş son ekranları kapatmak.

**Kapsam (7 borç + 6 kapsam maddesi):**

| Kod / madde | İş |
|---|---|
| UID-02 + UID-14 | Mobil aksiyon şeridi `GV.list` içinde **tek yerde** üretilip hem tablo satırına hem karta basılır; detay sekmesi tablolarının ≤760px kararı verilir (`.gv-tablewrap` gizlemek yerine yatay kaydırır, gizleme yalnız `GV.list`'in ürettiği tabloya özgü sınıfla) |
| UID-07 | `GV.list` dönüşüne `exportRows(rows, format)`; toplu işlemdeki "seçilenleri dışa aktar" gerçekten çalışır |
| UID-06 | `countTarget` + sayacın mount kökü içinde aranması; `app-egitim.html` matrisi ikinci `GV.list` örneğine çevrilir |
| UID-20 | `GV.list` `rowActions`'a "Düzenle" (`perm:'duzenle'`, `show(row)`) + detay `GV.pageHead` aksiyonuna "Düzenle" — **36 form bittiği için artık bloke değil**, tek turda |
| UID-03 + UID-04 | `.gv-thumb` (`is-sm/md/lg`) + `GV.upload` `onFile(file, meta)`; inline `background-size` kullanan yerler çevrilir; VB-15 ile birlikte belge alanı gerçekten kalıcılaşır |
| VB-11 sonrası | Satın alma formunda bütçe kodu **seçilebilir** hale gelir (dört sabit kod yerine koleksiyon) |
| plan F | **Personel işe giriş / işten ayrılış** — ekran + `DB.onboarding` koleksiyonu + menü kaydı (`SEC_BY_ROLE`) + `BUILT` |
| plan Wave 5 | **Görev takvim görünümü** — `views:['table','kanban','card','calendar']`; `.gv-cal` ızgarası zaten var (`app-ajanda.html` kalıbı) |
| plan Wave 6 | **Zaman kaydı start/stop zamanlayıcısı** — `app-zaman.html` üstünde çalışan sayaç + `DB.timelogs` mutasyonu |
| plan Wave 2 | **Ön analizin 10 çıktısı** — `app-onanaliz-detay.html` çıktı şeridi |
| plan Wave 5 | **Kontrol listesi** — `checklist_item` (Faz 5'te açılır) görev detayı ve formunda kullanılır |
| plan Wave 7 | **Zimmet süreci eksik adımları** — tutanak, dijital onay, fotoğraf, hasar; `app-zimmet-form.html` ve araç zimmet sekmesi bunları tüketir |
| plan F | **Proje başlatma zinciri** — sözleşme detayından tek işlemle proje + milestone üretimi |

**Çıkış kriteri:**
- `links.js` kuyruğu **boş** (üretilmemiş hedef kalmadı) ve `data-wip` sayısı **sıfır**.
- 390px'de her liste ekranında satır aksiyonu erişilebilir; her detay sekmesi tablosu
  görünür (yeni `mobile.js` senaryosu, bölüm 7).
- Her form ekranına düzenleme modundan (`?id=`) bağlantı var; `links.js` bunu ayrı sayar.

---

#### FAZ 7 — Tekrarlı Kod ve Bakım Borcu

**Amaç:** Aynı kararın N yerde ayrı ayrı verilmesini bitirmek. Bu fazın her maddesinin
kanıtı ölçülmüş bir **ayrışma**dır (L-14: dokuz `dl()` yardımcısından biri escape ediyordu
ve ham HTML bastı).

**Kapsam (7 kayıt):**

| Kod | Ölçülen tekrar | Çözüm |
|---|---|---|
| UID-17 | 9 ekran kendi `dl(pairs)` yardımcısını yazıyor | `GV.dl(pairs, opts)` — `dt` işaretleme, `dd` escape'li, boş değer tek yerde `.is-empty` + `—` |
| UID-23 | 43 ekran `GV.empty({desc})`'i çift escape ediyor | Sözleşme components.md'ye yazılır (`title`/`desc` düz metin, `action` HTML); 43 ekrandaki ön-escape tek süpürmede kaldırılır |
| UID-15 | 4 detay ekranı shell iskeletini elle kopyalıyor | `.gv-app` bloğu silinir, `<div id="rec">` + `GV.pageHead`; kopyalanan `.gv-divider`'daki eksik `aria-controls` de böyle kapanır |
| UID-18 | `.cell-wrap` `min-width`'i 1440px'de bile taşma yaratıyor | Kolon sayısına duyarlı genişlik ya da `.cell-wrap.is-tight` |
| UID-19 | Toplam satırı için ortak sınıf yok | `.gtable tfoot` + `tr.is-total`; `.gv-summary` ile idare eden yerler çevrilir |
| UID-22 | `app-proje.html` yerel ton haritası yazıyor | `GV.badge(v)`'ye düşülür; aynı deseni kuran başka ekran taranır |
| VB-21 | Aynı bölümün eyebrow'u üç ekranda üç farklı | `GV.pageHead` `eyebrow` verilmediğinde `SECTIONS[sec].eyebrow`'a düşer |

**Çıkış kriteri:**
- Ekran dosyalarında yerel `function dl(` **sıfır**, yerel `is-ok`/`is-warn` ton haritası
  **sıfır**, elle yazılmış `.gv-app` **sıfır** (yeni `dup.js` senaryosu, bölüm 7).
- `esc.js` HTML **varlığı** araması eklenmiş hâliyle 108 ekranda temiz.
- UID-15'in dört ekranı 1440/768/390'da yeniden ölçülmüş (nokta yaması yasağı, plan.md kural 4).

---

#### FAZ 8 — UI ve UX Kalite Geçişi (plan.md Kapsam B)

**Amaç:** plan.md'nin kendi tanımıyla: *ekran ekran yama değil, ortak katmanda kök nedenden
çözüm*. Yöntemin dört kuralı plan.md satır 508–514'te yazılı ve **değiştirilmez**:
referanstan yalnız biçim/oran/yerleşim/davranış alınır; renk-tipografi-gölge `tokens.css`'ten
gelir; çözüm ortak katmanda yapılır; nokta yaması yasak.

**Kapsam (10 madde):**

| # | Madde | Bağlı borç |
|---|---|---|
| 1 | Boşluk sistemi denetimi — tek ölçek, hardcode piksel taraması | — |
| 2 | Kontrol + etiket kalıbı için **tek taban kural** | **UID-08** (kusurun 4. tekrarı: persona çipi · giriş rol kartı · radio grubu · checkbox listesi; L-04 ile aynı aile) |
| 3 | Native kontrollerin (select/tarih/checkbox/radio/dosya) tasarım sistemine alınması | **UID-09** |
| 4 | Hizalama ve optik denge — kart iç boşluğu, satır yoğunluğu, ikon boyutu, başlık hiyerarşisi | UID-18/UID-19 sonrası |
| 5 | Odak ve hover durumları, klavyeyle gezilebilirlik, görünür odak halkası | — |
| 6 | Renk kontrastı WCAG AA taraması (özellikle durum etiketleri ve ikincil metin) | `GV.badge` 6 ton |
| 7 | Tıklama alanları ≥ 44 px | UID-02 mobil aksiyonu buna tabidir |
| 8 | Modal / yan panel / açılır menüde tek davranış standardı (başlık ayrımı, kaydırma gölgesi, kapatma, odak hapsi, Escape) | **UID-10** (+ para birimi eki, filtre sayacı) |
| 9 | Boş / yüklenme / hata durumlarının tüm ekranlarda aynı dille kurulması | UID-23 sözleşmesiyle birlikte |
| 10 | Sol rail ve üst nav'ın referanstaki shell **davranışıyla** karşılaştırılması | UID-01 kapandı, kalan davranış eksenleri |

**Çıkış kriteri:** Her madde için ölçüm raporu — hardcode değer sayısı, kontrast oranı,
tıklama alanı yüksekliği, odak halkası varlığı; hepsi 1440/768/390'da. Ölçülmeyen madde
kapanmış sayılmaz (L-05).

---

#### FAZ 9 — Kapanış

**Amaç:** plan.md Wave 13 + kalan doküman çıktıları.

| Madde | İş |
|---|---|
| Wave 13.1 | Tüm `data-wip` bağlantıların gerçek `href`'e çevrilmesi (Faz 6 bitince kuyruk boşalır) |
| Wave 13.2 | Modüller arası veri ilişkisi doğrulaması — **PROMPT.md §22'nin 38 bağlantısı** tek tek `canon.js` eksenine bağlanır |
| Wave 13.3 | Canonical veri tutarlılığı taraması (aynı kayıt no = aynı değer) |
| Wave 13.4 | 1440 / 768 / 390 px tam QA taraması — 13 script'in tamamı |
| Wave 13.5 | Kapanış raporu |
| Doküman B | Yönetici özeti |
| Doküman F | Sayfa analizleri |
| Doküman G | Veri modeli — **Faz 5'ten sonra yazılır**, önce yazılırsa doğduğu gün eskir |
| Doküman I | API ve teknik servisler |
| Doküman J | Otomasyonlar (tablo) — `DB.automations` 22 kural |
| Doküman M | Eksik ve ek öneriler — SaaS lisanslama, abonelik, ayrı müşteri portalı buraya |

**Çıkış kriteri:** 274/274 madde `[x]`; borç defterinde açık kayıt yok; 13 QA script'i temiz
ve her raporda **taranan ekran** ile **gerçekten yüklenen kayıt** sayısı ayrı yazılı (L-19).

---

## 2. SPRINTLER

Sprint = tek bir ortak katman kararının uçtan uca uygulanabildiği en küçük paket.
Büyüklük **madde sayısı** ve **dokunulan ortak katman dosyası** ile verilir; saat/gün
tahmini bilinçli olarak yoktur.

| # | Sprint | Faz | Hedef | Maddeler | Dokunulan ortak katman | Bitiş tanımı |
|---|---|---|---|---|---|---|
| **S-01** | Finans mutasyon kapanışı | 4 | Fatura ↔ tahsilat tek yordamda kapanır | VB-06, VB-25 (2) | `ui.js` (`GV.fin.*`) · `misc.js` · `canon.js` | 4 finans ekranı aynı yordamı çağırıyor; `odemeDurum` türetiliyor ya da yordam içinde yazılıyor; canon 2 yeni eksen temiz |
| **S-02** | Teslim ve sipariş onay ekseni | 4 | Aynı işlem her ekranda aynı sonuç | VB-23, UID-24 (2) | `ui.js` (`GV.delivery.approve`) · `work.js` · `ops.js` | 3 teslim ekranı tek yordam + tek yetki ekseni; `teslimKontrol` üç değeri listede görünür; `Eksik`/`İade` ton sözlüğünde |
| **S-03** | KPI maskeleme | 4 | `₺0` yanlış bilgisi biter | UID-11 (1) | `ui.js` (`GV.list`/`GV.report` `kpis[].mask`) | Para KPI'ı olan tüm ekranlarda finansız rol `••••••`; ekranlardaki `canFinans ? x : 0` deseni sıfır |
| **S-04** | Yetki kapısı bileşende | 4 | Yetkisiz aksiyon hiç basılmaz | UID-13, UID-25 (2) | `ui.js` (`bulk[].show`/`perm`, `export` kapısı) | 73 raporun çıktı şeridi `disaAktar`'a bağlı; toplu işlem barında yetkisiz madde yok; iki ekrandaki elle kapı silindi |
| **S-05** | Satır kapsamı | 4 | `scope('gor')` liste ekranlarında çalışır | UID-05 (1) | `ui.js` (`GV.list` `scopeField`) · `shell.js` | `scopeField` bildiren ekranlar rol kapsamına göre süzüyor; süzgeç çipi görünüyor; bildirmeyen ekranda davranış değişmiyor |
| **S-06** | Filtre ekseni ve "Tümü" sekmesi | 4 | Dış link tam küme döndürür | UID-12, UID-21 (2) | `app-gorev.html` · `app-lead.html` · `app-musteri.html` · `app-referans.html` (+ `search.extra`) | `?f_sprint=` bağlantısı tamamlanmış görevleri de getiriyor; `f_referans` anahtarı çalışıyor; kural components.md'ye yazıldı |
| **S-07** | Rename turu | 5 | Yanıltıcı alan adları biter | VB-04, VB-09, VB-16 (3) | `crm.js` · `work.js` · `canon.js` + 5 ekran | Yasak terim taraması sıfır; `tahminiBedel` ve komisyon adı her yerde; canon temiz |
| **S-08** | Sözlük turu | 5 | Ekran küme türetmez | VB-14, VB-17, VB-22 (3) | `crm.js` · `work.js` · `ui.js` (TONE) | 8+ sözlük koleksiyonu açık; 3 form ve ilgili liste süzgeçleri aynı kaynaktan; `dbref.js` temiz |
| **S-09** | Şema tekdüzeliği | 5 | Aynı koleksiyonda aynı anahtar kümesi | VB-18, VB-20 (+VB-22 eki) (2) | `crm.js` · `work.js` · `ui.js` (`GV.list` arşiv kuralı) · `components.md` | `aktif`/`arsiv` sözleşmesi yazılı ve tüm koleksiyonlarda eşit; `faz` alanında durum değeri yok; sözleşmesiz bedel kalmadı |
| **S-10** | Kişi kimliği ve tekrarlı kayıt | 5 | Bağ kodla kurulur, kişi tek kez tutulur | VB-12, VB-13, VB-24 (3) | `crm.js` · `ops.js` · `hr.js` · `canon.js` | `YTK-*` bağları yazılı; ad kaskadı silindi; `doluluk` tek kaynakta; canon 3 yeni eksen |
| **S-11** | Yapılandırma koleksiyonları | 5 | Eşik ve bütçe verisi tek kaynakta | VB-10, VB-11, VB-15 (3) | `misc.js` · `ops.js` · `app-ayar-onay.html` · `app-satinalma-form.html` | `DB.approvalFlows` · `DB.budgets` · `documents[].referans` açık; form kopya tablo taşımıyor |
| **S-12** | Aktivite kapsamı | 5 | Aktivite sekmesi dolu | UID-16 (1) | `work.js` (`DB.activities`) · `canon.js` | 9 kod öneki için ≥1 kayıt; canon "her detay öneki için aktivite" ekseni temiz; 26 detay ekranında sekme dolu |
| **S-13** | Rapor katalog hizalaması | 5 | Katalog `key`'i ekrana denk gelir | VB-26 (1) | `app-rapor.html` · `canon.js` | 17 sapan girdi eşleşiyor; `deep:true` yapılabilir; proje rapor sayısı 12 olarak yazılı |
| **S-14** | Mobil erişilebilirlik | 6 | 390px'de işlev kaybı yok | UID-02, UID-14 (2) | `ui.js` (`GV.list` aksiyon şeridi) · `ui.css` (`.gv-tablewrap`) | Tüm liste ekranlarında mobil satır aksiyonu var (≥44px); detay sekmesi tabloları mobilde görünüyor; `is-mobilescroll` istisnası kalktı |
| **S-15** | Liste API tamamlama | 6 | Bileşen sözleşmesindeki boşluklar kapanır | UID-06, UID-07, UID-20 (3) | `ui.js` (`countTarget`, `exportRows`, `rowActions` Düzenle) · `shell.js` | İkinci `GV.list` örneği kurulabiliyor; toplu çıktı gerçekten dosya üretiyor; her forma düzenleme bağlantısı var |
| **S-16** | Yükleme ve görsel | 6 | Dosya ve görsel bileşende çözülür | UID-03, UID-04 (2) | `ui.css` (`.gv-thumb`) · `ui.js` (`GV.upload.onFile`) | Inline `background-size` sıfır; önizleme bileşenden geliyor; VB-15 ile belge alanı kalıcı |
| **S-17** | Kapsam tamamlama — ekranlar | 6 | Menüde yazılı her ekran var | işe giriş/çıkış · görev takvimi · zaman zamanlayıcısı · ön analiz 10 çıktı · zimmet adımları · proje başlatma zinciri · kontrol listesi (7) | `hr.js` · `work.js` · `shell.js` (`SECTIONS`, `BUILT`) | `links.js` kuyruğu boş; `data-wip` sıfır; yeni ekranlar `gate.js`'ten 5 rolle geçiyor |
| **S-18** | Tekilleştirme turu | 7 | Aynı karar tek yerde | UID-15, UID-17, UID-23 (3) | `ui.js` (`GV.dl`) · `shell.js` (`buildSkeleton`) · 4+9+43 ekran | Yerel `dl()` sıfır, elle `.gv-app` sıfır, ön-escape sıfır; `esc.js` genişletilmiş hâliyle temiz |
| **S-19** | Tablo ve rozet sadeleştirme | 7 | Tablo/rozet kararları ortak katmanda | UID-18, UID-19, UID-22, VB-21 (4) | `ui.css` (`.cell-wrap`, `.gtable tfoot`) · `ui.js` (TONE) · `shell.js` (`pageHead` eyebrow) | 1440px'de gereksiz yatay kaydırma yok; toplam satırı tek sınıfla; yerel ton haritası sıfır; eyebrow bölüm kaydından |
| **S-20** | Form kontrolü taban kuralı | 8 | UID-08'in kök nedeni kapanır | UID-08, UID-09, Kapsam B #1–3 (5) | `tokens.css` · `ui.css` | Kontrol+etiket boşluğu tek kuralda; native kontroller tasarım sisteminde; hardcode piksel taraması sıfır |
| **S-21** | Overlay ve etkileşim standardı | 8 | Modal/drawer tek davranış | UID-10, Kapsam B #5, #7, #8 (4) | `ui.css` · `ui.js` (`GV.modal`, `GV.drawer`) | Başlık ayrımı + kaydırma gölgesi + odak hapsi + Escape her overlay'de; tıklama alanları ≥44px; odak halkası görünür |
| **S-22** | Görsel denetim | 8 | Kontrast ve optik denge ölçülür | Kapsam B #4, #6, #9, #10 (4) | `tokens.css` · `ui.css` · `shell.css` | WCAG AA raporu; boş/yüklenme/hata dili tek; rail+nav davranış karşılaştırması ölçülmüş |
| **S-23** | Kapanış taraması | 9 | Wave 13 | 5 madde | — (yalnız `tasks/qa/*`) | 13 script temiz; §22'nin 38 bağlantısı canon eksenine bağlı; kapanış raporu yazılı |
| **S-24** | Doküman çıktıları | 9 | B · F · G · I · J · M | 6 madde | `docs/` | Altı doküman yazılı; G, S-08…S-13 sonrasında yazıldı |

**Toplam:** 24 sprint · **9 faz** (5'i tamamlanmış F-0…F-5 özeti + 6 kalan faz: Faz 4–9).
Sprint başına ortalama 2,6 madde; en büyük paket S-18 (üç madde ama **56 ekran dosyası**).

**Dalga kuralı (L-20):** S-18 gibi çok dosyalı sprintler ajanlara bölünürken **aynı anda en
fazla dört ajan** açılır ve dalga bitmeden yenisi başlamaz. Tek turda yapılması zorunlu
kümeler (bölüm 4) **bölünmez** — bölünürse tarama yarım durumu ölçer.

---

## 3. ÖNCELİKLER

**Ölçüt (yüksekten alçağa):**

| Sınıf | Tanım | Neden bu sırada |
|---|---|---|
| **P1** | Kullanıcıya görünen **sessiz yanlışlık** | Kullanıcı ekrana güvenir; yanlış sayıyı yanlış olduğunu bilmeden kullanır. Sahte butondan tehlikelidir (ui-debt UID-12/UID-21'in kendi ifadesi) |
| **P2** | **Erişilemeyen işlev** — var ama ulaşılamıyor | İşlev yazıldı, maliyeti ödendi, kullanıcıya varmıyor |
| **P3** | **Tekrarlı kod / bakım borcu** | Bugün etkisi yok; her yeni ekranda maliyet üretir ve er geç P1 doğurur (L-14 böyle doğdu) |
| **P4** | **Kozmetik** | Görünen kusur, yanlış bilgi değil |

### 3.1 P1 — Sessiz yanlışlık (10 kayıt)

| Kod | Gerekçe |
|---|---|
| **VB-06 + VB-25** | Fatura ödendikten sonra tahsilat açık alacak gösteriyor. Kullanıcı gerçek bir finans riski görüyor, oysa yok. Ekran **kendi içinde** çelişiyor |
| **VB-23** | Aynı onay işlemi liste ve detayda farklı veri bırakıyor; hangisinin doğru olduğu kullanıcıya görünmüyor. Ayrıca mobilde `Revizyon istendi` **yeşil "onayladı"** çıkıyor — bugün veride o değer yok, hata **gizli** |
| **UID-11** | "Bekleyen taksit tutarı ₺0" bir maskeleme değil, **yanlış bilgi**. Ölçüldü: aynı ekranda 20 hücre maskeliyken KPI 0 diyor |
| **UID-05** | Yetki sızıntısı: `musteri` rolü 6 müşterinin bakım paketini birden görüyor. Maskeleme çalışıyor ama **satır kapsamı yok** |
| **UID-25** | 13 rol `disaAktar` yetkisi olmadan 73 raporun çıktısını alabiliyor. **ui-debt bunu UID-13 ile aynı sınıfa ("ölü buton") koyuyor; katılmıyorum** — ölü buton P2'dir, ama burada buton **çalışıyor** ve veri dışarı çıkıyor; bu P1'dir |
| **UID-12** | Dış filtreli link sprintin tamamlanmış görevlerini gizliyor: sessiz veri kaybı |
| **UID-21** | Yönlendirenin türüne göre süzüyor; kullanıcı "bu kişinin getirdiği adaylar" sanıyor |
| **UID-24** | `İade` ile `Eksik` listede aynı görünüyor, oysa `İade` siparişi `İptal`e çekiyor |
| **VB-09** | Yasak inşaat terimi (`MOD-009 "Saha ekip yönetimi"`) **ekranda modül adı olarak görünüyor**. **ui-debt bunu veri borcu (VB) sayıyor; ben P1'e alıyorum** — kabul kriteri ihlali ve kullanıcıya görünüyor |
| **VB-20** (faz bacağı) | `faz` alanında `Tamamlandı` değeri var; ekran bunu **faz** olarak basıyor. Durum ekseninin faz kolonunda görünmesi yanlış bilgidir |

### 3.2 P2 — Erişilemeyen işlev (13 kayıt)

| Kod | Gerekçe |
|---|---|
| UID-02 | 390px'de satır aksiyonları **hiç** yok — arşivde "geri al", tahsilatta "hatırlatma" mobilde erişilemiyor |
| UID-14 | Detay sekmesi tabloları mobilde tamamen boş |
| UID-07 | Toplu işlemdeki "çıktı al" yalnız toast basıyor — **sahte buton sınırında**, en az 3 ekranda |
| UID-13 | Yetki isteyen toplu işlem her rolde basılıyor; kullanıcı basana kadar yapamayacağını bilmiyor |
| UID-16 | 26 detay ekranının aktivite sekmesi **her kayıtta** boş; kabul kriteri karşılanmıyor |
| UID-20 | Formların düzenleme modu (`?id=`) hiçbir yerden erişilemiyor — yazılmış işlevin yarısı ölü |
| UID-06 | Bir ekranda iki liste kurulamıyor; `app-egitim` bu yüzden elle matris yazdı |
| VB-11 | Yeni bütçe kodu forma girilemiyor; bütçe kalemi bazında harcama hiçbir ekranda okunamıyor |
| VB-15 | Yönlendiren belge alanı **yalnız görsel**; kaydederken siliniyor |
| VB-17 | `sureBirim` tek seçenekli select — kullanıcı gerçek seçim yapamıyor |
| VB-22 | Veride kullanılmayan değer (`Askıda`) forma hiç girmiyor |
| plan Wave 5/6/2/7 | Görev takvim görünümü · zaman zamanlayıcısı · ön analiz 10 çıktısı · zimmet tutanak/onay/fotoğraf adımları |
| plan F | İşe giriş/çıkış ekranı **hiç yok** ama menü haritasında (bölüm 8) yazılı |

### 3.3 P3 — Tekrarlı kod / bakım borcu (14 kayıt)

| Kod | Gerekçe |
|---|---|
| UID-17 | 9 yerde aynı yardımcı; kararlar **ayrıştı** ve biri canlıya ham HTML bastı (L-14) |
| UID-23 | 43 ekranda çift escape. **Bugünkü etki sıfır** (kodlarda özel karakter yok) — bu yüzden P1 değil P3; ama ilk `&` içeren kodda **P1'e döner** |
| UID-15 | 20 satır shell markup'ı dört yerde; kopya `aria-controls` niteliğini taşımıyor (a11y açığı ortak katmanda kapandı, kopyada yaşıyor) |
| UID-03, UID-04 | Bileşen boşluğu ekranı inline stile ve iç işleyişe sızmaya zorluyor |
| UID-22 | Yerel ton haritası — sözlükte olan değer için yanlış kullanım |
| VB-04, VB-16 | Yanıltıcı alan adı. **Bugün ekranlar etikette doğru eksen yazıyor**, bu yüzden P1 değil; ad düzeltilmezse ilk yeni ekran yanlış hesaplar |
| VB-10 | Onay eşik tablosu iki yerde. Ölçüldü: **bugün 6/6 doğru**; borç, doğruluğun kopyaya bağlı olması |
| VB-12, VB-13 | Kişi kimliği ad üzerinden; bugün kaskadla idare ediliyor. "Aynı bilgi tekrar girilmiyor" kriterini ihlal ediyor |
| VB-18 | Şema kayıttan kayda değişiyor; `'—'` sentinel'i components.md kuralına aykırı |
| VB-24 | `doluluk` iki koleksiyonda; bugün 10/10 eşit, yarın biri eskir (L-08) |
| VB-26 | Katalog `key` sapması **bugün görünmüyor** (`deep:false`); `deep:true` yapıldığı an 17 kart yanlış gider |
| plan G | Altı doküman çıktısı (B, F, G, I, J, M) |

### 3.4 P4 — Kozmetik (6 kayıt)

| Kod | Gerekçe |
|---|---|
| UID-08 | Kontrol–etiket boşluğu. Okunabilirliği bozuyor ama yanlış bilgi vermiyor. **Kusurun 4. tekrarı olduğu için P4'ün en üstünde** — kök neden ortak katmanda yok |
| UID-09 | Native kontroller yamalı duruyor |
| UID-10 | Panel başlığı ile içerik arasında ayrım yok (+ para birimi eki, filtre sayacı) |
| UID-18 | 1440px'de gereksiz yatay kaydırma |
| UID-19 | Toplam satırı ayırt edilmiyor |
| VB-21 | Eyebrow üç ekranda üç farklı — kullanıcı bölüm değiştirdiğini sanıyor (gezinme kafası karışıklığı, veri yanlışı değil) |

### 3.5 ui-debt.md sınıflandırmasıyla çeliştiğim noktalar

| Kayıt | Defterin konumu | Bu dokümanın konumu | Gerekçe |
|---|---|---|---|
| **UID-25** | UID-13 ile "aynı sınıf: ölü buton" | **P1**, UID-13 ise P2 | UID-13'te buton çalışmıyor (toast der); UID-25'te buton **çalışıyor** ve yetkisiz rol veri dışa aktarıyor. İkisi aynı çözümü paylaşır ama aynı riski paylaşmaz |
| **VB-09** | Veri borcu (VB), VB-04 ile aynı tur | **P1**, tur ortaklığı korunur | Terim **ekranda görünen modül adı**; VB-04 ise yalnız alan adı (kullanıcı görmez). Aynı turda yapılırlar ama aciliyetleri farklı |
| **UID-23** | "Nokta yaması yok — 43'ü birden" (yüksek vurgu) | **P3** | Defter kendi de "bugünkü etki sıfır, hata gizli" diyor. 43 ekran dokunma maliyeti yüksek, kazanç bugün sıfır — P1 işlerden sonra yapılmalı |
| **VB-10** | "Kapanış fazında" (öncelik verilmemiş) | **P3** | Ölçüm 6/6 doğru diyor; risk gelecekte. Aynı fazda ama S-11'de, P1 sprintlerinden sonra |
| **UID-05** | UID listesinde sıradan sıra | **P1** | Yetki sızıntısıdır; 65+ ekranı etkiler ve kabul kriteri maddesidir |

---

## 4. TEKNİK BAĞIMLILIKLAR

### 4.1 Tek turda yapılması zorunlu kümeler

Kural (plan.md FAZ kural 3–4 + components.md §9d): **çözüm ortak katmanda yapılır** ve
**nokta yaması yasaktır**. Aşağıdaki kümeler bölünürse tarama script'i **yarım durumu**
ölçer ve yanlış "temiz" verir (bu tam olarak L-13'ün ve L-19'un ders konusudur).

| Küme | Maddeler | Neden bölünemez | Ortak dosya |
|---|---|---|---|
| **K1** Finans kapanışı | VB-06 + VB-25 | `odemeDurum` ayna alanı ancak `settleInvoice` yordamı içinde tutarlı kalır; ayrı yapılırsa canon iki kez yanılır | `ui.js` · `misc.js` · `canon.js` |
| **K2** Teslim onayı | VB-23 + UID-24 (+ sipariş iade alanı) | Tek mutasyon yordamı + üçüncü sözlük değerinin listede basılması aynı karardır | `ui.js` · `work.js` · `ops.js` |
| **K3** Yetki kapısı | UID-13 + UID-25 | Aynı sözleşme adı (`show`/`perm`) hem `bulk[]` hem `export` için; iki isim öğrenilmesin (defterin kendi kuralı) | `ui.js` |
| **K4** Filtre ekseni | UID-12 + UID-21 | İkisi de "dış link yanlış küme döndürüyor"; genel kural (**dış filtreli link alan ekranda 'Tümü' sekmesi zorunlu**) tek seferde yazılır | 4 ekran + `components.md` |
| **K5** Rename turu | VB-04 + VB-09 + VB-16 | Üçü de `canon.js` eksenine **ve** ekran metnine dokunur; parça parça yapılırsa tarama iki kez yanılır (VB-09'un kendi notu) | `crm.js` · `work.js` · `canon.js` |
| **K6** Sözlük turu | VB-14 + VB-17 + VB-22 (+ VB-20 `faz` bacağı) | Üçü de "eksen var, sözlüğü yok" sınıfı; süzgeç–form–`GV.badge` üçlüsü aynı kaynağa aynı anda bağlanır | `crm.js` · `work.js` · `ui.js` |
| **K7** Kişi kimliği | VB-12 + VB-13 | İkisi de kişi kayıt kimliği; biri koda çevrilip diğeri metinde kalırsa `canon.js` ekseni kurulamaz | `crm.js` · `ops.js` |
| **K8** Arşiv sözleşmesi | VB-20 (`aktif`/`arsiv`) + VB-22 eki (`DB.sprints`) | Sözleşme **tüm** koleksiyonlarda aynı anda eşitlenir, yoksa `GV.list` bir koleksiyonda doğru bir koleksiyonda yanlış davranır | tüm `assets/data/*.js` · `ui.js` |
| **K9** Belge ve yükleme | UID-03 + UID-04 + VB-15 | `.gv-thumb` önizlemeyi taşır, `onFile` dosyayı verir, `documents[].referans` kalıcılığı sağlar — üçü olmadan belge alanı yine "yalnız görsel" kalır | `ui.css` · `ui.js` · `misc.js` |
| **K10** Mobil | UID-02 + UID-14 | Aksiyon şeridi ve detay tablosu kararı aynı mobil kart üreticisini paylaşacak; ayrı yapılırsa ikinci markup doğar (components.md yasağı) | `ui.js` · `ui.css` |
| **K11** İskelet | UID-15 (4 ekran) | Dördü tek turda; biri elle iskelet tutarsa `buildSkeleton` erken dönüşü sürer | `shell.js` + 4 ekran |
| **K12** `dl()` | UID-17 (9 ekran) | Dokuzu tek turda; kalan bir yerel `dl()` escape kararını yeniden ayrıştırır | `ui.js` + 9 ekran |
| **K13** Escape sözleşmesi | UID-23 (43 ekran) | 43'ü birden; yarım kalırsa bileşen escape ederken bazı ekranlar ön-escape yapmaya devam eder | `ui.js` + 43 ekran + `esc.js` |
| **K14** Form taban kuralı | UID-08 + UID-09 | UID-08 UID-09'un kök nedeni; native kontrol tasarım sistemine girmeden boşluk kuralı tek başına yeterli olmaz | `tokens.css` · `ui.css` |
| **K15** Düzenleme bağlantısı | UID-20 (tüm liste + detay ekranları) | Parça parça eklemek `links.js` kuyruğunu yanıltır (defterin kendi kuralı). **36 form bittiği için ön koşul artık sağlandı** | `ui.js` · `shell.js` |
| **K16** Aktivite kapsamı | UID-16 (9 kod öneki) | Parça parça eklemek canonical taramayı yanıltır (defterin kendi kuralı) | `work.js` · `canon.js` |

### 4.2 Sıra bağımlılıkları (X, Y'den önce)

| Önce | Sonra | Neden |
|---|---|---|
| K6 (sözlük turu) | UID-24 kolon düzeltmesi | `teslimKontrol` kümesi sözlüğe alınmadan kolon üç değeri sözlükten basamaz |
| K6 (sözlük turu) | VB-26 (katalog) | Sözlük turu yeni koleksiyon ekler; katalog `key` denetimi sonrasında yapılırsa iki kez koşulmaz |
| K1 (finans kapanışı) | Wave 13.2 (§22'nin 38 bağlantısı) | Bağlantı doğrulaması mutasyonun kapattığı zinciri de ölçer |
| K5 (rename) | Doküman G (veri modeli) | Alan adları değişmeden yazılan veri modeli doğduğu gün eskir |
| K6 + K7 + K16 | Doküman G | Aynı gerekçe: sözlükler ve bağlar oturmadan model yazılamaz |
| S-04 (UID-13/25) | S-05 (UID-05) | İkisi de `GV.list` yetki yüzeyine dokunur; kapı sözleşmesi önce oturur, kapsam süzgeci sonra eklenir |
| S-03 (UID-11 mask) | S-05 (UID-05 scope) | Maskeleme sözleşmesi (`kpis[].mask`) kapsam süzgecinin KPI'ları yeniden hesaplamasından önce yerinde olmalı |
| K10 (mobil) | Kapsam B #7 (44px tıklama alanı) | Mobil aksiyon şeridi doğmadan tıklama alanı ölçülemez |
| S-17 (kalan ekranlar) | Wave 13.1 (`data-wip` → `href`) | Kuyruk boşalmadan dönüşüm yapılamaz |
| K12 + K13 (dl + escape) | `esc.js` genişletmesi | Genişletilmiş tarayıcı, tekilleştirilmiş bileşen üzerinde koşulmalı |
| Tüm Faz 4–8 | S-23 (kapanış taraması) | Kapanış taraması son hâli ölçer |
| S-23 | S-24 doküman B (yönetici özeti) | Özet, ölçülmüş sonucu anlatır (L-05) |

### 4.3 Bağımlılık grafiği (metin gösterimi)

```
K5 rename ──┐
K6 sözlük ──┼──> K8 arşiv sözleşmesi ──> S-13 (VB-26) ──> Doküman G
K7 kimlik ──┤
K16 aktivite┘

S-03 mask ──> S-04 yetki kapısı (K3) ──> S-05 kapsam (UID-05) ──> gate.js + perm.js tam tarama
K1 finans ──> K2 teslim ──> Wave 13.2 (38 bağlantı)
K4 filtre ──(bağımsız, erken yapılabilir)
K9 belge ──> S-17 (zimmet fotoğraf adımı)
K10 mobil ──> Kapsam B #7
K11 + K12 + K13 ──> esc.js genişletmesi ──> S-23
K15 düzenleme bağlantısı ──(ön koşul: 36 form ✅ sağlandı)──> links.js kuyruk sayımı
S-17 ekranlar ──> Wave 13.1 data-wip ──> S-23 ──> S-24
```

---

## 5. RİSKLER

Her risk `tasks/lessons.md`'deki bir dersten türetilmiştir. "Bugünkü karşı önlem" sütunu
yalnız **gerçekten var olan** script ve kuralları listeler.

### R-1 · Sahte yeşil ölçüm (L-17, L-19)

| | |
|---|---|
| **Belirti** | Tarama script'i "TEMİZ" der ama ölçtüğü şey **boş durum ekranıdır**. 5. oturumda "25 detay ekranı `tabs.js`'ten geçti" cümlesi bu yüzden yanıltıcıydı; düzeltmeden sonra aynı ekran 2 sekme yerine **6 sekme** raporladı |
| **Karşı önlem** | `tasks/qa/rec.js` hedefi **veriden türetir** ve kaydın gerçekten yüklendiğini ölçer (`.gv-rec-code` metni = kod), `qa-targets.json`'a yazar; `qa-lib.js` `recCheck()` ile her taramada doğrular; her rapor **taranan ekran** ve **yüklenen kayıt** sayısını ayrı verir |
| **Kalan açık taraf** | (a) `rec.js` yalnız `?id=` alan ekranları doğruluyor — **liste ekranının 0 kayıtla taranması** hâlâ yakalanmıyor. (b) `canon.js` veriyi okur, ekranı hiç açmaz: veri doğruyken ekranın yanlış gösterdiği durum (UID-11'in tam olarak bu sınıf) canon'a görünmez. (c) `gate.js` 27 rolün yalnız **5'iyle** koşuluyor |
| **Faz 4–9 için kural** | Yeni eklenen her `canon.js` ekseni, **sonucu önceden bilinen bir kayıtla** bir kez sınanır ("bu eksen bugün 3 ihlal görmeli — 3 gördü mü?"). Ekseni yazıp ilk koşuda temiz çıkması **kanıt değildir** |

### R-2 · Nokta yamasının borcu yayması (L-05, L-14, L-15)

| | |
|---|---|
| **Belirti** | Bir kusur kalıp ekranda doğar, onu örnek alan her yeni ekrana kopyalanır. Ölçülmüş yayılmalar: `location.reload` **9 ekran / 15 çağrı** · yerel `dl()` **9 ekran** · `GV.empty` ön-escape **43 ekran** · elle shell iskeleti **4 ekran** · `canFinans ? x : 0` **3+ ekran** · yetkisiz toplu işlem **3 ekran** |
| **Karşı önlem** | `components.md` tek doğru kaynak + "sayfaya özel `<style>` yasak" + plan.md FAZ kural 3–4 ("çözüm ortak katmanda, nokta yaması yasak") + `ui-debt.md`'nin "aynı turda" notları |
| **Kalan açık taraf** | **Hiçbir script "bu ekran kendi yardımcısını yazıyor mu" diye taramıyor.** Yayılma bugün ancak yeni bir ekran yazılırken **elle** fark ediliyor. Bölüm 7'de `dup.js` önerildi |
| **Faz 4–9 için kural** | Bir kusur ikinci kez görüldüğünde ekranda düzeltilmez — ortak katmana taşınır ve **kalan tüm örnekleri aynı turda** çevrilir |

### R-3 · Ajan stall'ı ve yarım kalan tur (L-20)

| | |
|---|---|
| **Belirti** | 8. oturumda 13 ajan aynı anda açıldı, **8'i `Response stalled mid-stream` ile düştü ve sekizinin sekizi de diske tek satır yazmadı** — kesinti `Write` çağrısından hemen önceydi |
| **Karşı önlem** | Dalga tavanı **dört ajan**; dalga bitmeden yenisi açılmaz. Stall ile düşen ajandan **çıktı beklenmez**, yarım dosya aranmaz; envanter `ls` + satır sayısı + kapanış etiketiyle **ölçülerek** yapılır |
| **Kalan açık taraf** | Bu yol haritasının **tek turda yapılması zorunlu** kümeleri (bölüm 4.1: K11 4 ekran, K12 9 ekran, K13 43 ekran) doğaları gereği çok dosyalıdır. Bir ajan 43 ekranın 20'sini çevirip düşerse borç **bölünmüş** kalır ve `esc.js` yarım durumu "temiz" görebilir |
| **Faz 4–9 için kural** | Çok dosyalı tekilleştirme turları ajan eline **elle düzenleme** olarak değil, **idempotent bir dönüştürme script'i** olarak verilir; script yarım koşarsa yeniden koşulabilir. Tur sonunda ölçüm: "kaç dosyada eski desen kaldı" — sıfır değilse tur **bitmemiştir** |

### R-4 · Veri ile ekranın ayrışması (L-08, L-13)

| | |
|---|---|
| **Belirti** | Türetilebilir sayaç veriye yazılmış ve zamanla eskimiş; ya da bağ alanı tekil olması gerekirken çift kayıt almış. Ölçülmüş örnekler: `bekleyenTahsilat` / `aktifProje` / `hakedis` çelişkileri · iki fatura tek milestone'a bağlıydı · `odeme` alanı kimi kayıtta net kimi kayıtta brüt |
| **Karşı önlem** | `canon.js` **18 eksen / 607 kontrol**, her wave sonunda; components.md §9b (para konvansiyonu) ve §9d (bağ alanı sözleşmesi) yazılı; kural: **ekran değil veri düzeltilir** |
| **Kalan açık taraf** | Bugün hâlâ **saklanan türev** olan üç alan var ve **hiçbirinin canon ekseni yok**: `DB.milestones[].odemeDurum` (VB-25) · `DB.employees[].doluluk` (VB-24) · `DB.company.calisanSayisi`. Ayrıca `DB.projects` `aktif`/`arsiv` çelişkisi yalnız `GV.list` içinde çözülüyor — veri tarafında kural yok |
| **Faz 4–9 için kural** | Faz 5'te açılan **her** koleksiyon için canon ekseni **aynı turda** yazılır. Eksensiz açılan koleksiyon, altı oturum sonra VB-19 gibi sessiz bir hataya dönüşür (VB-19 tam olarak "bu eksen yoktu, o yüzden beş oturum görünmedi") |

### R-5 · Dinleyici birikmesi ve overlay'in yerinde kalması (L-16, L-18)

| | |
|---|---|
| **Belirti** | `GV.refresh()` sonrası `document` üzerindeki net dinleyici artıyor; üç tazeleme sonrası tek tıklamada **3 modal** açıldı. Overlay tarafında: `.page-main` dışına basılan açık drawer kapanmıyor, net dinleyici **7 → 10** çıkıyor ve panelde **eski veri** ekranda kalıyor |
| **Karşı önlem** | `GV.refresh()` mount düğümünü taze kopyayla değiştirir · `document`/`window` dinleyicileri `GV.on(el,type,fn,key)` ile bağlanır · overlay bileşeni kapatıcısını düğüme asar (`__gvClose`) · `tasks/qa/listen.js` **net** (add − remove) dinleyiciyi sayar · `tasks/qa/mut.js` iki kez `GV.refresh()` tetikleyip çoğalma/boşalma ölçer |
| **Kalan açık taraf** | `listen.js` yalnız `document` üzerindeki dinleyiciyi sayıyor; `window` ve mount dışı kalıcı düğümler ölçülmüyor. Ölçüm **29 hedefte** yapıldı (26 detay + 3 form) — **36 form ekranının 33'ü hiç taranmadı**, oysa `GV.form` `beforeunload`'ı `cfg.id` anahtarıyla bağlıyor ve aynı sayfada iki form varsa anahtar çakışması riski var |
| **Faz 4–9 için kural** | Faz 4'te doğacak `GV.fin.*` ve `GV.delivery.approve` yordamları mutasyondan sonra `GV.refresh()` çağıracak — bu **yeni bir dinleyici yüzeyi** demektir. Her yeni ortak yordam `listen.js` + `mut.js` ile aynı turda ölçülür |

### R-6 · Etkileşimde patlayan ekran (L-12) — sözlük turunun asıl riski

| | |
|---|---|
| **Belirti** | Ekran `DB.priorities` okuyor ama veri dosyasını yüklemiyor; hata **sayfa açılışında değil**, gelişmiş filtre açılınca patlıyor. Aynı hata **5 ekranda** vardı ve ekran aylardır yayındaydı |
| **Karşı önlem** | `tasks/qa/dbref.js` — koleksiyon → dosya sahipliğini `assets/data/*.js`'ten çıkarır, her ekranın yüklediğiyle karşılaştırır. `tasks/qa/tabs.js` her sekmeyi tek tek tıklar |
| **Kalan açık taraf** | `dbref.js` **statik** tarayıcıdır: `DB.x` metnini arar. Faz 5'te 8+ yeni sözlük koleksiyonu açılacak ve bunları okuyan her ekranın `<script>` listesi güncellenecek — bu **L-12'nin tekrarlaması için ideal koşuldur**. Ayrıca gelişmiş filtre dışındaki etkileşimler (toplu işlem, satır aksiyonu, modal) hâlâ otomatik tetiklenmiyor |
| **Faz 4–9 için kural** | Sözlük turu (S-08) bittiğinde `dbref.js` **koşulmadan** sprint kapanmaz; ayrıca her yeni sözlüğü okuyan ekranda gelişmiş filtre bir kez açılır |

### R-7 · Ölçülmemiş iddia (L-05)

| | |
|---|---|
| **Belirti** | "Bu değişiklik ekran maliyetini düşürecek" gibi mimari iddiaların ölçülmeden raporlanması. Tek gerçek ölçüm yapıldı: referans liste ekranı **1134 satır**, `app-lead.html` **168 satır** (6,7 kat); tahmin 120–160 idi, **sapma olduğu gibi yazıldı** |
| **Karşı önlem** | Kural defterde yazılı: iddia ölçülerek raporlanır, tahmin sapması gizlenmez |
| **Kalan açık taraf** | Bu yol haritasının kendi büyüklük tahminleri **madde sayısı** ve **dosya sayısı** ile verildi; kasıtlı olarak saat/gün yok. Yine de "S-18 en büyük paket" gibi ifadeler **tahmindir** ve sprint bitiminde gerçek dosya sayısıyla karşılaştırılmalıdır |

---

## 6. BAŞARI KRİTERLERİ

Kaynak: `tasks/plan.md` **H. KABUL KRİTERLERİ** (PROMPT.md §28) — 14 madde.
Durum sütunu plan.md'nin bugünkü işaretidir.

| # | Kriter | Bugün | Kapanması için gereken somut iş | Ölçüm yöntemi |
|---|---|---|---|---|
| 1 | GaviaCRM arayüz diliyle görsel uyum | `[~]` | Faz 8'in 10 maddesi; özellikle Kapsam B #10 (rail + üst nav **davranış** karşılaştırması) ve #4 (optik denge) | `grip-qa.js` (tutamak, bugün temiz) + Faz 8'de üretilecek karşılaştırma raporu: geometri/oran/etkileşim eksenleri, 1440/768/390. **Renk karşılaştırılmaz** (kural gereği token'dan gelir) |
| 2 | Yazılım şirketine özgü — inşaat terminolojisi sıfır | `[~]` | **K5 rename turu**: `hakedis`/`hakedisTarihi` alan adı (VB-04) + `MOD-009 "Saha ekip yönetimi"` (VB-09) | Tam metin taraması: `hakedis` · `saha` · `santiye` · `taseron` · `sahantiye` — `assets/**` ve `*.html` altında **0 sonuç**. Bugün görünen etiketlerde 0, **alan adlarında değil** |
| 3 | Bütün ana modüller birbirine bağlı | `[~]` | Wave 13.2: **PROMPT.md §22'nin 38 bağlantısı** tek tek doğrulanır; VB-06/VB-12/VB-13/VB-15 bağ alanları kapanır | `canon.js` eksen 15'in genişletilmiş hâli: 38 bağlantının her biri için ≥1 kontrol; rapor "38/38 bağlantı doğrulandı" der |
| 4 | Görev sistemi ayrıntılı | `[x]` | — (19 durum · 18 tür · 13 sekme · alt görev · bağımlılık · onay zinciri) | `tabs.js app-gorev-detay.html` 8 sekme + `canon.js` görev eksenleri |
| 5 | Referans & yönlendiren kişi takibi | `[x]` | — (17 tür · yönlendiren kartı · komisyon zinciri) | `canon.js` eksen 3, 14, 17 |
| 6 | Departmanlar arası sohbet + iş talebi + sohbetten görev | `[x]` | — | `app-sohbet.html` devir akışı `DB.tasks` kaydı üretiyor; `app-istalebi-detay` göreve dönüşüm |
| 7 | Müşteri ve personel raporları detaylı | `[x]` | — (14 + 13 rapor) | `app-rapor.html` katalogu (VB-26 kapandıktan sonra `key` eşleşmesi de ölçülür) |
| 8 | Araçlar özel filo modülünde | `[x]` | — (8 ekranlık ayrı modül) | `links.js` yetim ekran taraması |
| 9 | Liste ekranları ortak standart | `[x]` | — (tümü `GV.list`) | Kaynak taraması: `GV.list(` çağrısı olmayan liste ekranı **0** |
| 10 | Yetkilendirme arayüz seviyesinde kalmıyor | `[~]` | **UID-05** (satır kapsamı) + **UID-13/UID-25** (aksiyon ve çıktı kapısı bileşende) | Yeni `perm.js`: her rol için (a) görünen satır sayısı `scope('gor')` ile tutarlı, (b) yetkisiz toplu işlem/çıktı butonu **hiç basılmıyor**. Ölçüm 5 rol × 20 ekran |
| 11 | Aktivite ve değişiklik geçmişi | `[~]` | **UID-16**: `DB.activities` 9 kod önekine genişletilir | `canon.js` yeni ekseni: "detay ekranı kod öneki başına ≥1 aktivite"; `tabs.js` aktivite sekmesinde boş panel **0** |
| 12 | Masaüstü + mobil (1440/768/390) | `[~]` | **UID-02** (mobil satır aksiyonu) + **UID-14** (detay tablosu) + Faz 8 #7 (44px) | Yeni `mobile.js` (390px): her liste ekranında satır aksiyonu düğümü **var** ve yüksekliği **≥44px**; her detay sekmesinde görünür içerik **var**. Konsol/taşma bugün üç kırılımda temiz (`qa.js`) |
| 13 | Çoklu şirket / SaaS'a hazır yapı | `[x]` | — (tenant listesi + şirket bazlı kapsam). **Not:** §25 Faz 3'ün "SaaS lisanslama / abonelik yönetimi" kalemi bu kriterin **dışındadır** ve üretilmedi | `app-ayar-sirket.html` tenant listesi + `GV.perm` tenant ekseni |
| 14 | Aynı bilgi tekrar girilmiyor | `[~]` | **VB-13** (`referrers` ↔ `contacts` aynı kişi) + **VB-24** (`doluluk` iki yerde) + **VB-10** (eşik tablosu kopyası) + **VB-12** (bağ metinle) | `canon.js` yeni eksenleri: bağlı yönlendiren ↔ yetkili iletişim bilgisi birebir · kapasite kaydı olan personelin doluluğu kapasiteyle aynı · `onayToplam` akış tablosundan hesaplananla aynı. **Formlar üretildiği için kriter artık uçtan uca ölçülebilir** — plan.md'nin "formlar üretilmeden ölçülemez" notu eskidi |

**Özet:** 14 kriterin **8'i kapalı**, **6'sı kısmen**. Altısının tamamı Faz 4–8 kapsamındadır;
hiçbiri yeni bir modül gerektirmiyor — hepsi **ortak katman ve veri** işidir.

---

## 7. TEST SENARYOLARI

### 7.1 Mevcut harness — ne ölçüyor, ne ölçmüyor

Kaynak: `tasks/qa/` (13 script) + `components.md` §10. Script'ler **koşulmadı**, yalnız
başlıkları ve ölçüm sözleşmeleri okundu.

| Script | Ölçtüğü | Ölçmediği (bu yol haritası açısından) |
|---|---|---|
| `qa.js` | konsol hatası · yatay taşma · sayfaya özel `<style>` · `href="#"`, 3 kırılımda | Etkileşim sonrası hata; görünen içeriğin doğruluğu |
| `canon.js` | 18 veri ekseni / 607 kontrol | Ekranın veriyi **nasıl gösterdiği** (UID-11 sınıfı); türev alanlar `odemeDurum`/`doluluk` |
| `dbref.js` | ekran ↔ veri dosyası uyumu (L-12) | Çalışma anındaki dinamik okuma |
| `links.js` | kırık hedef · BUILT · yetim ekran · üretilmemiş hedef kuyruğu | Bağlantının **doğru kümeyi** getirip getirmediği (UID-12/UID-21) |
| `gate.js` | ekran × rol: konsol · 403 · boş sayfa | Yetkili rolde **hangi satırların** göründüğü (UID-05); aksiyon/çıktı butonu varlığı (UID-13/25) |
| `tabs.js` | detay ekranının her sekmesi (223 tıklama, 26/26 kayıt) | Sekme içeriğinin dolu olup olmadığı yalnız "boş aktif panel" düzeyinde |
| `listen.js` | 3× `GV.refresh()` sonrası net dinleyici artışı | `window` dinleyicileri; 33 form ekranı |
| `mut.js` | `GV.refresh()` idempotanlığı (başlık çoğalmıyor, DOM boşalmıyor) | Mutasyonun **çift kayıtta** kapanması (VB-06) |
| `esc.js` | etiket düğümünde ham HTML **etiketi** | HTML **varlığı** (`&amp;`, `&lt;`) — UID-23 tam olarak bu boşlukta |
| `rec.js` | tarama hedefi üretimi + kayıt yüklendi doğrulaması | Liste ekranının 0 kayıtla taranması |
| `qa-lib.js` | ortak `expand()` + `recCheck()` | — |
| `grip-qa.js` | rail tutamağı geometri/renk/hover/odak/örtme | Diğer küçük tutamaklar |
| `swtest.js` | `.f-switch` / radyo doğrulama regresyonu | Diğer native kontroller (UID-09) |

### 7.2 Kapanış maddesi → regresyonu kilitleyen script

| Madde | Kilitleyen script | Kilitlenen regresyon |
|---|---|---|
| VB-06 + VB-25 | `canon.js` (yeni eksen 19–20) | Fatura `Ödendi` ise bağlı tahsilat da `Ödendi`; taksitin `odemeDurum`'u faturasıyla aynı |
| VB-23 | `canon.js` (yeni eksen) + `mut.js` | Teslim onayı sonrası `durum` ve `musteriOnay` tutarlı; iki ekran aynı sonucu bırakıyor |
| K5 rename | `canon.js` + tam metin taraması | Yasak terim ve yanıltıcı alan adı geri gelmiyor |
| K6 sözlük | `canon.js` (sözlük üyeliği) + `dbref.js` | Sözlük dışı değer veriye yazılamıyor; sözlüğü okuyan ekran dosyayı yüklüyor |
| K7 kimlik | `canon.js` (yeni eksen) | Yetkili bağı gerçek `DB.contacts` kaydını gösteriyor; yönlendiren ↔ yetkili iletişim bilgisi birebir |
| UID-16 | `canon.js` + `tabs.js` | Her detay kod öneki için ≥1 aktivite; aktivite sekmesi boş panel basmıyor |
| UID-15 | `mut.js` + `qa.js` | `GV.pageHead` çalışıyor (elle iskelet yok); başlık çoğalmıyor |
| UID-17 | `esc.js` | `dt` tarafı escape edilmiyor, `dd` tarafı ediliyor |
| UID-23 | `esc.js` **genişletilmiş** (yeni: HTML varlığı araması) | Çift escape geri gelmiyor |
| Yeni ortak yordamlar (`GV.fin`, `GV.delivery`, `GV.dl`) | `listen.js` + `mut.js` | Yordam `GV.refresh()` çağırdığında dinleyici birikmiyor |
| S-17 yeni ekranlar | `gate.js` + `links.js` + `dbref.js` | Yeni ekran 5 rolde temiz; kuyruk boş; veri dosyası yüklü |

### 7.3 Bugün ölçülmeyen eksenler için ÖNERİLEN yeni senaryolar

Her senaryo somuttur: **hedef ekran · adım · beklenen sonuç**. Script adları önerilmiştir;
hepsi `tasks/qa/` altında yaşamalı ve `qa-lib.js`'in `expand()`/`recCheck()` katmanını
kullanmalıdır (L-17/L-19).

---

**T-1 · `perm.js` — `bulk[].show` ve çıktı yetki kapısı** *(UID-13, UID-25)*

| | |
|---|---|
| Hedef | `app-proje-teslim.html` · `app-proje-test.html` · `app-proje-hata.html` · 8 rapor ekranı |
| Adım | Ekranı sırayla `sahip` · `qa` · `stajyer` · `musteri` · `frontend` rolüyle aç → listede ilk 2 satırı seç → toplu işlem barındaki madde etiketlerini oku; rapor ekranında `.rp-acts` içindeki çıktı butonlarını say |
| Beklenen | Rolün `GV.perm.can('onay'\|'duzenle'\|'sil')` sonucu false olan toplu işlem barda **hiç yok**; `can('disaAktar')` false olan rolde çıktı şeridi **hiç basılmamış** (bugün: 13 rol × 73 rapor butonu görüyor) |
| Neden yeni | `gate.js` yalnız 403 ve konsol bakıyor; buton **varlığını** hiçbir script saymıyor |

---

**T-2 · `mask.js` — KPI maskeleme** *(UID-11)*

| | |
|---|---|
| Hedef | `app-proje-milestone.html` · `app-sozlesme.html` · `app-butce.html` · `app-fatura.html` · `app-tahsilat.html` · `app-rapor-finans.html` |
| Adım | Her ekranı `qa` (finans yetkisi yok) rolüyle aç → `.kpi-card .kpi-num` metinlerini oku → aynı ekranı `sahip` ile aç ve karşılaştır |
| Beklenen | Yetkisiz rolde para KPI'ı `••••••`; **`₺0` hiçbir yerde yok** ve `.kpi-meta` gizli. Yetkili rolde gerçek sayı. Bugünkü ölçülmüş ihlal: `app-proje-milestone` "Bekleyen taksit tutarı ₺0" |
| Neden yeni | `canon.js` veriye bakar, KPI metnine bakmaz |

---

**T-3 · `scope.js` — satır kapsamı** *(UID-05)*

| | |
|---|---|
| Hedef | `app-destek-paket.html` (ölçülmüş örnek) + `scopeField` bildiren her liste ekranı |
| Adım | `musteri` rolüyle aç → `[data-listcount]` sayısını oku → aynı ekranı `sahip` ile aç |
| Beklenen | `musteri` rolünde yalnız kendi müşterisinin kayıtları; sayı `sahip` rolününkinden **küçük**; liste üstünde "Yalnız kendi kayıtlarınız" çipi görünür. Bugünkü ihlal: 6 müşterinin paketi birden görünüyor |
| Neden yeni | Satır kapsamını ölçen hiçbir script yok |

---

**T-4 · `mobile.js` — 390px işlev kaybı** *(UID-02, UID-14, Kapsam B #7)*

| | |
|---|---|
| Hedef | Tüm liste ekranları + `app-musteri-detay.html` (15 sekme) · `app-proje-detay.html` (22 sekme) · `app-gorev-detay.html` · `app-lead-detay.html` |
| Adım | 390px'de aç → liste ekranında ilk `.gv-mrow` içindeki aksiyon düğümünü ara ve `getBoundingClientRect().height` ölç → detay ekranında her sekmeyi tıklayıp aktif panelin görünür yüksekliğini ölç |
| Beklenen | Her mobil kartta ≥1 aksiyon, yüksekliği **≥44px**; her detay sekmesinde görünür içerik yüksekliği **> 0** (bugün `.gv-tablewrap` `display:none` yüzünden 0) |
| Neden yeni | `qa.js` 390px'de yalnız taşma ve konsol ölçüyor, **işlev varlığını** ölçmüyor |

---

**T-5 · `esc.js` genişletmesi — HTML varlığı** *(UID-23)*

| | |
|---|---|
| Hedef | `GV.empty` çağıran 43 ekran |
| Adım | Ekranı boş sonuç verecek bir filtreyle aç (örn. `?q=zzzzz`) → `.gv-empty` içindeki `textContent`'te `&amp;` · `&lt;` · `&gt;` · `&#39;` ara |
| Beklenen | HTML varlığı metni **0**. Bugün etki sıfır (kodlarda özel karakter yok) — bu yüzden test, düzeltmeden **önce** bilerek özel karakterli bir kayıt kodu enjekte edilerek sınanmalı: "1 ihlal görmeliyim, gördüm mü?" (L-17 kuralı) |
| Neden yeni | Mevcut `esc.js` HTML **etiketi** arıyor, **varlığı** aramıyor |

---

**T-6 · `fin.js` — mutasyon çiftinin kapanması** *(VB-06, VB-25, VB-23)*

| | |
|---|---|
| Hedef | `app-fatura-detay.html?id=FTR-2026-024` · `app-tahsilat.html` · `app-proje-teslim.html` + `app-proje-teslim-detay.html` |
| Adım | Faturayı "Ödendi işaretle" → `GV.refresh()` sonrası **aynı sekmede** `DB.payments` içindeki bağlı kaydın durumunu oku → `app-tahsilat.html`'i açıp aynı kaydı listede kontrol et. Teslim için: liste ekranından onayla, sonra detay ekranını aç |
| Beklenen | Fatura `Ödendi` → bağlı tahsilat `Ödendi` **ve** taksitin `odemeDurum`'u da güncel. Teslim onayı liste ve detayda **aynı** `durum` + `musteriOnay` bırakıyor. Bugünkü ihlal: dördü de tek koleksiyona dokunuyor |
| Neden yeni | `mut.js` yalnız `GV.refresh()`'in DOM'u bozmadığını ölçüyor, **mutasyonun ikinci koleksiyonu kapattığını** ölçmüyor |

---

**T-7 · `dup.js` — kaynak düzeyinde tekrar taraması** *(UID-15, UID-17, UID-22, UID-23, R-2)*

| | |
|---|---|
| Hedef | Tüm `*.html` ekran dosyaları (statik okuma, tarayıcı gerekmez) |
| Adım | Şu desenleri say: `function dl(` · `<div class="gv-app"` · `is-ok'\|is-warn'` yerel eşleme · `GV.empty({` içinde `esc(` · `canFinans ? ` · `location.reload` |
| Beklenen | Faz 7 sonrası **hepsi 0**. Bugünkü ölçülmüş sayılar: `dl(` **9** · elle `.gv-app` **4** · ön-escape **43** · `location.reload` mutasyon dışında **0** (L-15 kapandı) |
| Neden yeni | Yayılmayı (R-2) yakalayan **hiçbir** otomatik araç yok; bugün elle fark ediliyor |

---

**T-8 · `linkset.js` — dış bağlantının döndürdüğü küme** *(UID-12, UID-21)*

| | |
|---|---|
| Hedef | `app-gorev.html?f_sprint=SPR-2026-020` · `app-referans.html` satır aksiyonunun hedefi |
| Adım | Bağlantıyı aç → `[data-listcount]` oku → aynı filtreyi `?t=tumu` ile tekrarla → iki sayıyı karşılaştır; ayrıca kanban "Tamamlandı" kolonundaki kart sayısını oku |
| Beklenen | İki sayı **eşit** (sekme kümeyi daraltmıyor); kanban "Tamamlandı" kolonu sprintin tamamlanmış görevlerini gösteriyor. Yönlendiren bağlantısı `f_referans=REF-001` hedefine gidiyor ve dönen kayıtların **hepsinin** `referans` alanı `REF-001` |
| Neden yeni | `links.js` bağlantının **çalıştığını** ölçüyor, **doğru kümeyi** getirdiğini değil |

---

**T-9 · `form-qa.js` — 36 form ekranının doğrulama akışı** *(kabul kriteri 14, R-5)*

| | |
|---|---|
| Hedef | 36 form ekranı, hem yeni kayıt (`?` yok) hem düzenleme (`?id=KOD`, `rec.js`'ten) modunda |
| Adım | Zorunlu alanları boş bırakıp kaydet → `.form-err-summary` ve ilk `.f-err` düğümünü ara, odaklanan alanı oku → sonra alanları doldurup kaydet → `GV.refresh()` sonrası listeye dönüşü ve kaydın veride oluştuğunu ölç → 3× `GV.refresh()` sonrası `beforeunload` dinleyici sayısını ölç |
| Beklenen | Hata özeti + alan altı mesaj + **ilk hatalı alana odak**; kaydettikten sonra `location.reload` **yok**, kayıt veride var; dinleyici sayısı sabit |
| Neden yeni | `listen.js`/`mut.js` yalnız **3 form** hedefinde koşuldu; 33 form hiç taranmadı ve doğrulama akışı hiç ölçülmedi |

---

**T-10 · `a11y.js` — odak, kontrast, tıklama alanı** *(Faz 8 #5, #6, #7)*

| | |
|---|---|
| Hedef | Temsili 15 ekran (liste · detay · form · rapor · dashboard · sohbet), 3 kırılım |
| Adım | Tab ile gezinip odaklanan her düğümde görünür odak halkası (`outline`/`box-shadow`) var mı ölç → `.gv-badge` ve `.u-faint` metinlerinde hesaplanmış renk kontrast oranını hesapla → tüm `button`/`a` düğümlerinin yüksekliğini ölç |
| Beklenen | Odak halkası **her** odaklanabilir düğümde; kontrast **≥ 4.5:1** (AA, normal metin) ve `≥ 3:1` (büyük metin/ikon); tıklama alanı **≥44px** |
| Neden yeni | Faz 8'in üç maddesi bugün hiçbir script tarafından ölçülmüyor; `grip-qa.js` yalnız rail tutamağına bakıyor |

---

**T-11 · `catalog.js` — rapor katalog anahtarı** *(VB-26)*

| | |
|---|---|
| Hedef | `app-rapor.html` katalogu (99 girdi) ↔ 8 rapor ekranının `reports[].key` tanımları |
| Adım | Katalog girdilerinin `key`'lerini topla → her rapor ekranını açıp `GV.report` config'indeki `key`'leri topla → eşleşmeyenleri listele |
| Beklenen | Eşleşmeyen **0**. Bugünkü ihlal: finansta **9**, projede **8** girdi eşleşmiyor (toplam 17); `deep:false` olduğu için hata bugün görünmüyor |
| Neden yeni | `links.js` `deep:false` kartları hedefsiz sayıyor, `key` eşleşmesini bilmiyor |

---

### 7.4 Kapanış taramasının (S-23) kabul çıktısı

Kapanış raporu şu **iki sayıyı ayrı ayrı** vermeden geçerli sayılmaz (ders **L-19**):

```
Taranan ekran   : N
Yüklenen kayıt  : M          (detay/form hedeflerinde; M < hedef sayısı ise HATA)
```

Ve şu 13 + 11 = **24 script'in tamamı** temiz olmalıdır:

| Grup | Script |
|---|---|
| Mevcut (13) | `qa.js` · `canon.js` · `dbref.js` · `links.js` · `gate.js` · `tabs.js` · `listen.js` · `esc.js` · `mut.js` · `rec.js` · `qa-lib.js` · `grip-qa.js` · `swtest.js` |
| Önerilen (11) | `perm.js` · `mask.js` · `scope.js` · `mobile.js` · `fin.js` · `dup.js` · `linkset.js` · `form-qa.js` · `a11y.js` · `catalog.js` · `esc.js` genişletmesi (ayrı script değil, mevcut script'in yeni ekseni) |

**Uyarı (L-06):** Script'ler `tasks/qa/` altında izlenir ve koşulmadan önce ayrı bir
`scratchpad/qa-run/` dizinine kopyalanır. Orkestratör, subagentlerin yazdığı scratchpad
kökünden **hiçbir script çalıştırmaz** — bu hata iki kez tekrarladı.

---

## Kapanış notu

Bu yol haritası **79 açık plan maddesi** (47 açık + 32 kısmen) ve **43 açık borç kaydı**
(42 ui-debt + VB-04) üzerinden kuruldu; hiçbir faz, sprint ya da senaryo defterlerde
karşılığı olmayan bir işten türetilmedi. Üç şey bilinçli olarak **yapılmadı**:

1. **Saat/gün tahmini verilmedi.** Ölçüm yerine tahmin yazmak L-05'in yasakladığı şeydir.
2. **`tasks/` defterlerindeki eskimeler düzeltilmedi**, yalnız bölüm 0'da tablo hâlinde
   raporlandı — bu doküman `tasks/` altına yazmaz.
3. **Hayalî faz üretilmedi.** §25 Faz 3'ün "SaaS lisanslama" ve "abonelik yönetimi"
   kalemleri kapsam dışıdır ve buraya faz olarak değil, **doküman M'ye öneri** olarak
   taşınmıştır.
