# Handoff — Cloud Turu sonrası

**Dal:** `main` · **Çalışma ağacı:** temiz · **Canlı:** `https://gaviaworks-dev.github.io/gaviaworks-crm/` (doğrulandı, 200)
**Son commit:** `docs: write the closing report for the cloud round`

> **"Cloud" adı bir deşifre hatasıdır.** Ses kaydında **"Claude"** denmiş, metne "Cloud" geçmiş. Kapsam bulut altyapısı değil, **üretime hazırlıktır**. Dosya adları bilerek değiştirilmedi (commit geçmişi ve çapraz referanslar kırılmasın diye); ayrıntı `tasks/cloud-talimati.md` başındaki nottadır.

---

## 0. İlk 10 dakika — ne okunacak, ne koşulacak

```bash
# 1. Neredeyiz
cat docs/Q-cloud-turu-kapanis.md          # kapanış raporu — en hızlı özet
cat tasks/cloud-plan.md                    # canlı durum tablosu (paket paket)

# 2. Ölçüm — hepsi TEMİZ dönmeli (xport.js hariç, aşağıda açıklandı)
python3 -m http.server 8791 --bind 127.0.0.1 &   # tarayıcı taramaları buna bağlı
node tasks/qa/flow.js                      # geçiş sözleşmesi · 0 bulgu olmalı
node tasks/qa/flow.js --selftest           # eksenin kendisi bozuk kopyada sınanır
node tasks/qa/canon.js                     # 4.522 kontrol
node tasks/qa/dep.js                       # yordam ↔ veri bağımlılığı
node tasks/qa/dbref.js                     # yüklenmeyen veri dosyasından okuma
```

Playwright kurulu (`node_modules/`, gitignored). Yeniden kurmak gerekirse:
`npm install playwright@latest --no-save && npx playwright install chromium`

**Oturum kurmak için** (tarayıcı testlerinde şart, yoksa sayfa login'e döner):
```js
sessionStorage.setItem('gv.session', JSON.stringify({ rol:'sahip', emp:'EMP-001' }))
```
⚠️ Alan adı **`rol`**, `role` değil. Roller: `sahip · genelmudur · operasyon · depmudur · satismudur · satistemsilci · pm · takimlideri · muhasebe · ik · destek · musteri · stajyer` (tam liste `DB.roles`).

---

## 1. Defterler

| Dosya | İçerik |
|---|---|
| `tasks/cloud-talimati.md` | Şartname — tek doğruluk kaynağı (23 bölüm, 519 madde) |
| `tasks/cloud-envanter.md` | 519 madde, `[N.M.K]` numaralı |
| `docs/P-cloud-gap-analizi.md` | Madde madde ölçüm + dört sayı |
| `tasks/cloud-kararlar.md` | **17 ADR** — verilen kararlar, gerekçe, geri alma yolu |
| `tasks/cloud-acik-sorular.md` | **30 açık soru** (⚠️), ilgili pakete gelince karara bağlanacak |
| `tasks/cloud-plan.md` | 23 iş paketi + **canlı durum tablosu** |
| `docs/Q-cloud-turu-kapanis.md` | Kapanış raporu, tarama tablosu, backend'e kalanlar |
| `tasks/components.md` | Bileşen sözlüğü + **motor sözleşmeleri** (§ CLOUD TURU) |
| `tasks/lessons.md` | **L-37 · L-38 · L-39** bu turda eklendi |

---

## 2. Ortak katmanın yüzeyi — hazır motorlar

Hepsi `assets/js/domain.js` ve `assets/js/ui.js` içinde; **146 sayfanın tamamında yüklü**.

```
GV.flow      gec(tur,kod,hedef,ek,opts) · adimlar(tur,kod) · kural · kayit · denetle
GV.gates     projeAktif · projeTeslim · projeKapanis · sozlesmeAktif ·
             teklifOnAnaliz · teslimKritikHata · izinBakiye · destekKota
GV.approval  karar(onayKod,karar,{neden,not}) · adim · zincir · bekleyen · tazeleSayaclar
GV.fin       tahsilEt · tahsisEt · tahsisKaldir · balance · odemeDurum ·
             gecikti · gecikmeGun · durumTazele · tazeleHepsi
GV.calendar  isGunu · mesaiDakika · gecenDakika · beklemeBaslat · beklemeBitir
GV.hr        icMaliyet(kod,tarih) · kayitOrani(zamanKaydi)
GV.destek    paketOf · kotaDusum · kapaliDurumlar
GV.audit     yaz({kayit,metin|islem,eski,yeni,modul,ip}) · oku(kayitKod,limit) · denetle
GV.action    ({eylem,kayit,sonuc,gerekce,nedenTuru,ek,onaycilar,etkilenen,geriDonusYok,run})
GV.flowHata  (r) → geçiş sonucunu kullanıcı diline çevirir
GV.form      ({mount,sections,tabs,aside}) — sekme + sağ panel + readonly destekli
```

**Veri sözleşmeleri (`assets/data/org.js`):** `flowEntities` (14 varlık) · `transitions` · `statusMigration` · `reasonCodes` · `approvalTypes` · `approvalFlows` · `holidays` · `workCalendar` · `slaWaitPolicy` · `salaryHistory`
**Diğer:** `paymentAllocations` (misc.js) · `integrationErrors` (misc.js, **boş ve bilerek boş**)

---

## 3. DURUŞ — bunu bilerek sürdür

Kod eskiden **"uyar ama engelleme"** felsefesiyle yazılmıştı; `domain.js` bunu yazılı bir karar olarak savunuyordu. Şartname tersini emrediyor ve **beş kapı artık reddediyor**: proje kapanışı · teslim onayı · sözleşme aktivasyonu · izin bakiyesi · bakım kotası.

İstisna yolu **tektir**: `sahip`/`genelmudur` + neden kodu + açıklama. Aktiviteye `YÖNETİCİ İSTİSNASI` önekiyle yazılır.

Yeni ekran yazarken bu dili sürdür. Kalıp:
```js
var r = GV.flow.gec('project', kod, 'Tamamlandı', null, { not:aciklama });
if(!r.ok){
  if(r.why === 'kapi' && r.istisnaMumkun){ /* istisna penceresi aç */ }
  GV.toast(GV.flowHata(r), 'danger'); return;
}
```

---

## 4. PROTOTİPTE YAPILABİLİR OLUP YAPILMAYAN ALTI PAKET

Sıra önerisi: **A → B → C → D → E → F**. A ve C diğerlerinin altyapısı.

### A · Form göçü — `CreateEditPage` (P2-01 göçü)

**Durum:** Motor **hazır**, göç **yapılmadı**. 36 formun 0'ı sekmeye taşındı.

**Hazır olan:** `GV.form` artık `tabs` ve `aside` alıyor, `readonly` uyguluyor, sekme bazlı hata özeti basıyor (hatalı alan gizli sekmedeyse özet sekme adını yazar, rozet sayıyı gösterir, odak o sekmeye geçer). ARIA sözleşmesi `GV.tabs` ile aynı. CSS'te `.gv-tab-err` ve `.gv-aside` tanımlı.

**Nereden başla:** `app-personel-form.html` — şartname [3.1.x] onu referans ilan ediyor ve **7 sekme** sayıyor: Kişisel · İletişim · Görev & Departman · SGK/Maaş · Evrak · Zimmet · İzin/Avans/Rapor. Ardından `app-proje-form.html` (8 sekme, [5.0.2]–[5.0.9]). Şartname [21.0.3] bu ikisini önce istiyor.

**API:**
```js
GV.form({
  mount:'#rec', record:kayit,
  tabs:[{ key:'kisisel', label:'Kişisel', icon:'i-user' }, …],
  sections:[{ tab:'kisisel', title:'Kimlik', icon:'i-user', fields:[…] }, …],
  aside:function(v, api){ return GV.notice({…}); }   // her alan değişiminde yeniden çizilir
});
```
`tabs` verilmeyen form eski düz düzeninde kalır — **göç tek tek yapılır**, hepsini birden değiştirmek gerekmiyor.

**Dikkat:** Sekmesi belirtilmemiş bölüm kaybolmaz, ilk panelin altına düşer. `app-personel-form.html`'de `grep -c form-grid` bugün **0**; sağ panel yok ama türevi sayılan `app-izin-form.html:304` `gv-grid-aside` ile zaten kurmuş — oradaki deseni örnek al.

**Açık soru:** AS-6.3 — standardın kapsamı 33 tip mi, repodaki tüm create/edit ekranları mı (`tasks/cloud-acik-sorular.md`).

---

### B · Satış dönüşüm sihirbazı (P3-01 kalanı)

**Durum:** Teklif ekranları motora bağlandı; **dönüşüm zinciri yok**.

**Eksik olan üç şey:**
1. **"Kazanıldı" sonrası hiçbir şey olmuyor** ([7.3.6]). Sihirbaz müşteri + sözleşme taslağı + ödeme planı taslağı + proje taslağı üretmeli.
2. **Mükerrer müşteri kontrolü yok** ([7.1.3], [20.1.4]). `app-lead-detay.html:587-605` koşulsuz yeni `MUS-` üretiyor; vergi no/unvan/e-posta/telefon/alan adı ile arama ve "mevcut müşteriye bağla / birleştir / yetkili istisna" üçlüsü gerekiyor.
3. **Teklif sürümlemesi sahte** ([7.3.4]). `app-teklif-detay.html:151` aynı kaydı yerinde değiştirip sayacı artırıyor; kod bunu `:358-361`'de itiraf ediyor. Revizyon **yeni kayıt** üretmeli, eski sürüm kilitlenmeli.

**Hazır olan:** `GV.flow.gec('quote', …)` ve `GV.flow.gec('contract', …)` çalışıyor. `GV.gates.teklifOnAnaliz` teklifin onaylı ön analizden doğmasını zorluyor. `GV.gates.sozlesmeAktif` imza + ödeme planı dengesini şart koşuyor ve **ödeme planı ekranları artık var** (aşağıda).

**Nereden başla:** `app-teklif-detay.html`'e "Kazanıldı" akışını ekle, `GV.action` penceresiyle onay al, sonra sırayla `DB.customers` → `DB.contracts` (Taslak) → `DB.milestones` (plan taslağı) → `DB.projects` (Taslak) üret ve hepsini `GV.audit.yaz` ile kayda geçir. Prototipte transaction taklidi: hata olursa üretilen kayıtları geri al ve **yarım bırakma**.

**Açık sorular:** AS-1.3 (teklif durum sözlüğü + `icOnay`), AS-5.2 (dönüşüm için gereken lead durumu), AS-3.5 (kayıp teklifte açık işlerin kapanma politikası).

---

### C · Test varlık modeli (P3-03 kalanı)

**Durum:** Test tarafı **tümüyle sayaç**. `DB.tests` senaryoyu sayı olarak tutuyor (`work.js:900-921`) ve `app-proje-test-detay.html:405` bunu itiraf ediyor: *"başarısız senaryoların hangileri olduğu bu ekrandan okunamaz."*

**Eksik varlıklar** ([9.1.1]): Test Planı · Test Senaryosu · Test Adımı · Test Çalıştırması · Sonuç · Kanıt · Yeniden Test · Sürüm/Build · Ortam. Ayrıca Release/Deployment hiç yok ([9.2.4], [16.2.10]).

**Nereden başla:** Önce **veri**: `work.js` içine `DB.testPlans` · `DB.testCases` · `DB.testSteps` · `DB.testRuns` · `DB.testResults2`(kanıt) · `DB.builds` · `DB.environments`. `DB.tests`'teki üç sayı (`senaryo`/`basarili`/`basarisiz`) **türetilmiş** hâle getirilir, elle yazılan alan olmaktan çıkar.

⚠️ **Mevcut 5 `DB.tests` kaydından senaryo üretilemez** — hangi senaryonun geçtiği veride yok. Uydurma: "senaryo detayı yok" diye işaretle ve raporla (L-13).

`DB.testResults` sözlüğü bu turda şartnameye hizalandı (`Başarılı · Başarısız · Engellendi · Koşulmadı`) ve **hiçbir ekranda kullanılmıyordu** — yeni model onu kullanmalı.

**Sonra zincir** ([9.1.4]): Failed sonuçtan hata oluşturma kaynak test/build/ortam/kanıtı otomatik bağlamalı. Bugün `app-proje-test-detay.html:517` "başarısız senaryo var ama hata yok" uyarısını basıyor ama **hata açacak düğme sunmuyor**.

---

### D · İK yaşam döngüsü (P3-06)

**Durum:** Personel durumu tek `aktif` boolean'ı (`app-personel-form.html:678-698`). Şartname [4.1.4] `Taslak → Onboarding → Aktif → İzinli/Pasif → Offboarding → Ayrıldı` istiyor. Offboarding kaydı veride **sıfır** (`grep -c "tur:'Çıkış'" hr.js` → 0).

**Üç iş:**
1. **Yaşam döngüsü:** `employee` varlığını `DB.flowEntities` + `DB.transitions`'a ekle. `aktif` boolean'ı duruma taşınır. `GV.flow` kalıbı hazır — 14 varlıkta çalışıyor, 15.'si aynı sözleşmeyle eklenir.
2. **Onboarding şablonu** ([4.1.5], [11.3.1]): `DB.onboarding` bugün elle yazılı 3 kayıt; şablon koleksiyonu yok. Şablon seçilince görev/belge/hesap/eğitim/ekipman otomatik doğmalı.
3. **Zimmet kabulü** ([20.4.4]) — **ters yönlü çelişki var ve düzeltilmedi:** `app-zimmet-form.html:759-794` envanteri zimmet **kaydedilirken** güncelliyor (`personelOnay`a bakmıyor), `app-zimmet.html:117-120` "Dijital onay" ise envantere **hiç dokunmuyor** ve onaylayanın o personel olduğunu doğrulamıyor. `ops.js:118-119` ZMT-2026-007 kaydı `personelOnay:'Bekliyor'` iken demirbaş "Zimmetli" — `app-veri-kalitesi.html` bunu K9'da bulgu olarak basıyor.

**Hazır olan:** Tek aktif zimmet kuralı gerçek (`app-zimmet-form.html:118-124, 163-172, 447-465`). `GV.calendar.isGunu` izin hesabı için hazır. `Gates.izinBakiye` bakiyeyi aşan onayı engelliyor.

**Açık sorular:** AS-1.10 (çalışma takvimi/izin bölgesinin ekseni), AS-1.11 (avans kavramının sahibi), AS-1.12 (lisans/abonelik ayrı varlık mı).

---

### E · ReportRegistry ve export (P4-01 · P4-02)

**Durum:** Ortak rapor kabuğu **var ve iyi durumda** — `ui.js:2365` `GV.report(config)`, 8 rapor sayfasının **hepsi** kullanıyor. Eksik olan **registry** ve **format standardı**.

**Dört iş:**
1. **Registry** ([14.5.1]): `DB.reportRegistry` — her rapor için `report_id · title · description · category · permissions · default_filters · available_dimensions · measures · drilldowns · export_types · freshness_policy · formula_version · data_classification`. Bugün `report_id`/`formula_version` repoda yalnız görev metinlerinde geçiyor.
2. **Kopya kolon fabrikaları** ([14.0.2]): 7 rapor sayfası toplam ~3.060 satır prelude yazıyor ve `colMoney/colNum/colPct/colDate/colDurum/colKisi/mny/num/sub/faint/linkCell/mRow/tbl/bos` her sayfada yeniden tanımlanıyor (finans'ta `app-rapor-finans.html:76-190` = 115 satır). **~800–1.000 satır silinebilir**, karşılığında `ui.js`'ye ~250 satır ortak API.
3. **Hizalama** ([14.2.5], [14.2.6]): tarih ve durum kolonları **7 sayfanın hiçbirinde ortalanmıyor** — `cellClass:'center'` sayısı sıfır. Para ve sayı doğru sağa hizalı.
4. **Export** ([14.4.1]–[14.4.8]): dört seçenek görünüyor, **ikisi sahte** — "Excel" tab ayraçlı `.xls` metin (`ui.js:1575-1583`), "PDF" yazdırma penceresi (`ui.js:1555-1571`). CSV'de BOM ve tırnaklama var ama **formül enjeksiyonu koruması yok** (`=`/`+`/`-`/`@` ilk karakter). Prototipte yapılabilir olanlar: CSV koruması, yazdırma CSS'i (sayfa kırılması + `thead` tekrarı), export'a sıralama ve formül sürümü metadata'sı, "Tüm kayıtlar" için ek onay.

**Açık sorular:** AS-2.10 (ISO para kodu + kur kaynağı), AS-2.11 (karışık para birimli toplam), AS-6.6 (grafik hangi durumda hak edilir — bugün 105/105 raporda grafik var).

---

### F · Notlarım modülü (P4-03)

**Durum:** Modül kodda **hiç yok** — dosya, menü girdisi, veri koleksiyonu, "Çalışma Alanım" dizgesi, hepsi sıfır. Şartname §15'in **38 maddesinin tamamı** açık.

**Sıra — testler önce (P1-09):**
1. `tasks/qa/notes-isolation.js` yaz. Şartname [15.5.1]–[15.5.6] altı senaryo veriyor: B kullanıcısı ve superadmin A'nın not ID'siyle listede/detayda/aramada/export'ta/bildirimde içeriği görememeli; not metni audit, log ve genel arama indeksinde bulunmamalı. **Modül yokken test "modül yok" diye açıkça kalır — yeşil sayılmaz** ([22.0.11]).
2. Veri: `DB.personalNotes` + `DB.personalNoteChecklistItems` (şema `tasks/cloud-envanter.md` [15.3.1]/[15.3.2]).
3. Ekran: `app-notlarim.html` (görünümler: Tümü · Açık · Bugün · Yaklaşan · Tamamlanan · Arşiv) + `app-not-form.html` (Not · Kontrol Listesi · Plan · Özet bölümleri, **A paketindeki sekmeli kabukla**).
4. Menü: `shell.js` — "Çalışma Alanım" bölümü altına.

**Kararlar verilmiş (ADR-13 · ADR-14):** notlar genel arama/rapor/export/aktivite akışı/audit payload'ına **hiç girmez**; arama yalnız Notlarım içinde ve yalnız sahibinin kayıtlarında. Yumuşak silme **7 gün** geri alınabilir, süre kullanıcıya yazılır.

⚠️ **Prototipte gerçek izolasyon sağlanamaz** — owner filtresi istemcide olur. Bu, modül canlıya çıkmadan kapatılması zorunlu bir açık olarak `docs/Q-cloud-turu-kapanis.md` §4'te kayıtlı. Modülü yazarken bu sınırı ekranda **söyleme**, kod yorumunda ve raporda tut.

**Açık sorular:** AS-4.3 (notu kurumsal göreve dönüştürme ilk sürümde var mı), AS-4.4 (taslak otomatik kaydetme nerede saklanır), AS-4.5 (son checklist maddesinde otomatik tamamlama).

---

## 5. `xport.js` neden açık kaldı

`node tasks/qa/xport.js` → **EKSİK — 22 ekranda kolon tanımı çıktıyı beslemiyor**

**Bu turdan değildir.** Önceki turda da "bilinen ve bilinçli kısmi" olarak kayıtlıydı (`tasks/revize-plan.md:27`). Kapatılmış gibi gösterilmedi.

**Neden açık:** Eksen, listedeki kolon tanımlarının dışa aktarma çıktısını beslemesini bekliyor. 22 ekranda kolonun `exportValue` karşılığı yok ya da render'ı HTML döndürdüğü için çıktıya ham etiket gitmesin diye atlanıyor. Bu, şartnamenin **§14.4 export standardının** (P4-02) parçası: [14.4.2] "export ekranda aktif filtre, kolon, sıralama, kapsam ve formül sürümünü taşısın", [14.6.1] "ekran, PDF, XLSX ve CSV aynı kayıt kümesini ve toplamları versin".

**Kapatmak için:** E paketinin 4. maddesiyle birlikte ele alınmalı — ortak kolon API'si kurulunca her kolon `exportValue` sözleşmesini otomatik taşır ve 22 ekran tek tek yamalanmadan kapanır. **Nokta yaması yapma**; kök neden ortak API'nin olmamasıdır.

---

## 6. Bilinen açık bulgular

`app-veri-kalitesi.html` şu an **46 gerçek bulgu** basıyor (Kritik 0 · Yüksek 17 · Orta 19 · Düşük 10). Öne çıkanlar:

| Bulgu | Nerede |
|---|---|
| ZMT-2026-007 aktif zimmet ama `personelOnay:'Bekliyor'` | D paketi çözer |
| 8 projede sözleşme kaydı yok | veri boşluğu, uydurulmadı |
| SZL-2026-022 planı yok → aktivasyon kapısı haklı reddediyor | B/plan paketi |
| DST-2026-118/120/122 olay geçmişi sözlükle konuşmuyor | taşımadan kalan iz |
| 8 projede maliyet hiç ölçülemedi | zaman kaydı yok, "0" yazılmadı |

İki kontrol **ölçülemiyor** ve bunu açıkça söylüyor: K6 (entegrasyon koşum kaydı yok) · K12 kısmi.

---

## 7. Kurallar — ihlal etme

- **`git add -A` yasak.** Dosyalar tek tek isimle stage edilir.
- **Ajan işi commit edilmemişken `git checkout` atma.** Bu turda attım, iki dosyadaki işi sildim; kaybı ölçüp geri yazmak zorunda kaldım.
- **Yorumda `SAT-*` gibi desen yazma** (L-37) — `*/` blok yorumunu kapatır, sayfa çöker ve oturum yokken belirti login ekranı olduğu için gizlenir.
- **Veri dosyasında koleksiyon değiştirirken satır aralığı kullan** (L-38), parantez sayma — Türkçe yorumlardaki kesme işareti taşırır. Değişiklikten sonra koleksiyon başına sayıyı **yeniden ölç**.
- **Yeni ölçüm ekseni bozuk kopyada sınanmadan koşmaz** (L-39). `tasks/qa/flow.js --selftest` bunun uygulanmış hâli.
- **HTML'de `node --check` çalışmaz.** Inline `<script>` bloklarını çıkarıp ayrı ayrıştır; bu turda kullandığım yardımcı scratchpad'deydi, kalıcı istenirse `tasks/qa/` altına alınmalı.
- **Uydurma yok.** Karşılığı olmayan veri "yok" diye yazılır; ölçülemeyen kontrol "geçti" sayılmaz.

---

## 8. Yasin Bey'in teyidini bekleyen beş karar

`tasks/cloud-kararlar.md` içinde 🔸 ile işaretli. Karar **uygulandı ve geri alınabilir**, ama onaya sunulmalı:

**ADR-06** bakiyeyi aşan izin onayı engelleniyor (avans izin politikası varsa değişmeli) · **ADR-08** kısmi kabul fatura tetiklemiyor · **ADR-11** müşteri beklemesi SLA'yı durduruyor, üçüncü taraf durdurmuyor · **ADR-16** ürün adından "ERP" kaldırıldı · **ADR-02** sözleşmede `Gecikti` türetiliyor.
