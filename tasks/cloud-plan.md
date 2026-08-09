# Cloud Şartnamesi — İş Paketleri

Kaynak: `tasks/cloud-talimati.md` · Ölçüm: `docs/P-cloud-gap-analizi.md` · Kararlar: `tasks/cloud-acik-sorular.md`

Sıra şartname §16'nın P0/P1/P2 önceliği ve §21'in Faz 0–5 sırasına göre kuruldu.
Her paket §22'nin istediği yedi başlığı taşır: **sorun · hedef davranış · değişecek dosyalar · veri düzeltme · yetki ve audit · kabul senaryosu · geri dönüş planı.**

**Bu dosya bir plandır, taahhüt değil.** Uygulama kararını Beyar verecek. ⛔ işaretli açık sorular kararlaşmadan ilgili paket başlamamalı.

## Kapsam sınırı — dürüst çerçeve

Şartname [0.0.3] uygulamanın "sunucu tarafı doğrulaması, kalıcı veri modeli, rol/satır/alan yetkisi, denetim izi, idempotent işlem ve otomatik testleri bulunan üretim sistemi" olmasını istiyor. `CLAUDE.md:11` ise projeyi "SADECE ARAYÜZ, backend/veritabanı/gerçek API yok" diye tanımlıyor. Bu doğrudan bir çelişki ve 519 maddenin **153'ü** (%29,5) bu yüzden BACKEND GEREKTİRİR sınıfında.

Plan bunu şöyle karşılıyor: her paket **prototip payı** ve **backend payı** olarak ikiye ayrıldı. Prototip payı bugünkü buildless yığında gerçekten yapılabilir ve ölçülebilir; backend payı sözleşmesel olarak kaydedildi ama bu turda kod üretmez. Bir paketin prototip payını bitirmek, o maddeleri "tamamlandı" saymaz — şartname [22.0.11] gereği kısmi tamamlanma açıkça kısmi yazılır.

---

## Uygulama durumu — canlı

Bu bölüm koşum sırasında güncellenir. Kaynak: `git log` + `node tasks/qa/flow.js`.

| Paket | Durum | Kanıt |
|---|---|---|
| P0-00 Faz 0 çıktıları | ✅ bitti | 5 belge · 519 madde ölçüldü |
| P1-01 Merkezî geçiş motoru | ✅ bitti | `GV.flow` · 14 varlık · `flow.js` 0 bulgu |
| P1-02 Ortak eylem penceresi | ✅ bitti | `GV.action` · 7 bileşen · boş gönderim reddediliyor |
| P1-03 Onay motoru | ✅ bitti | `GV.approval` · zincir 1/3→3/3 · kaynak kayıt geçiyor |
| P1-04 Yetki + tek audit defteri | ✅ bitti | `GV.audit` iki deftere yazıyor · 9 ekran taşındı |
| P1-05 Finansal kanonik kaynak | ✅ bitti | `DB.paymentAllocations` · tek `GV.fin.balance` |
| P1-06 İş takvimi / SLA | ✅ bitti | `GV.calendar` · `DB.holidays` · bekleme politikası |
| P1-07 Veri kalitesi sayfası | ✅ bitti | `app-veri-kalitesi.html` · 12 kontrol · 46 bulgu |
| P1-08 Entegrasyon hata kuyruğu | ⏳ kısmi | koleksiyon açıldı (boş, dürüst); ekran yok |
| P1-09 Notlarım test ağı | ⛔ başlanmadı | modül yazılmadan test yazılacak |
| P2-01 CreateEditPage | ⏳ motor bitti | sekme + sağ panel + `readonly`; 36 formun göçü yapılmadı |
| P2-02 Kayıt sonrası detay | ⛔ başlanmadı | 34 formun `kaydet()` sonu |
| P2-03 Demo temizliği | ✅ bitti | 59 ekran · kullanıcıya basılan geliştirici dili 0 |
| P3-01 Satış zinciri | ⏳ kısmi | teklif ekranları motora bağlandı; dönüşüm sihirbazı yok |
| P3-02 Sözleşme + plan + milestone | ⏳ kısmi | ödeme planı 3 ekran bitti; milestone/sprint ekranları yok |
| P3-03 Kalite zinciri | ⏳ kısmi | hata/teslim motora bağlandı; test varlıkları yok |
| P3-04 Satın alma zinciri | ⏳ kısmi | onaya gönderme + motor bağlandı; tedarikçi faturası yok |
| P3-05 Tahsilat formu | ✅ bitti | form + tahsis dağıtım ekranı |
| P3-06 İK zinciri | ⛔ başlanmadı | yaşam döngüsü, onboarding, zimmet kabulü |
| P3-07 Destek zinciri | ⏳ kısmi | motor + kota düşümü bağlandı; bilgi bankası yok |
| P4-01 ReportRegistry | ⛔ başlanmadı | — |
| P4-02 Export servisi | ⛔ başlanmadı | — |
| P4-03 Notlarım modülü | ⛔ başlanmadı | — |
| P5-01…P5-06 | ⛔ başlanmadı | büyük ölçüde backend |

**ADR:** 17 blokaj sorusu `tasks/cloud-kararlar.md` içinde karara bağlandı; 5'i 🔸 teyit bekliyor.

### Sıradaki altı paket — nereden başlanacağı

Ayrıntılı yol tarifi `tasks/handoff.md` §4'tedir. Özet ve sıra önerisi:

| # | Paket | Hazır motor | İlk dosya | Blokaj |
|---|---|---|---|---|
| **A** | Form göçü (`CreateEditPage`) | `GV.form` sekme + `aside` + `readonly` **hazır** | `app-personel-form.html` (7 sekme), sonra `app-proje-form.html` (8 sekme) | AS-6.3 |
| **B** | Satış dönüşüm sihirbazı | `GV.flow` quote/contract · `Gates.teklifOnAnaliz` · `Gates.sozlesmeAktif` · ödeme planı ekranları | `app-teklif-detay.html` "Kazanıldı" akışı | AS-1.3 · AS-5.2 · AS-3.5 |
| **C** | Test varlık modeli | — (yeni koleksiyonlar) | `assets/data/work.js` → `testPlans/testCases/testSteps/testRuns/builds/environments` | — |
| **D** | İK yaşam döngüsü | `GV.flow` (15. varlık aynı sözleşmeyle) · `GV.calendar` · `Gates.izinBakiye` | `assets/data/org.js` → `flowEntities.employee` | AS-1.10 · AS-1.11 · AS-1.12 |
| **E** | ReportRegistry + export | `GV.report` **hazır**, 8/8 rapor kullanıyor | `assets/js/ui.js` ortak kolon API'si | AS-2.10 · AS-2.11 · AS-6.6 |
| **F** | Notlarım | `GV.form` sekmeli kabuk (A'dan sonra) | `tasks/qa/notes-isolation.js` **önce** | AS-4.3 · AS-4.4 · AS-4.5 |

**A ve C diğerlerinin altyapısı.** F, A bittikten sonra başlamalı (sekmeli kabuğu kullanır) ve **testleri modülden önce** yazılır.

### Açık kalan ölçüm: `xport.js`

`node tasks/qa/xport.js` → **EKSİK — 22 ekranda kolon tanımı çıktıyı beslemiyor.**

Bu bulgu **bu turdan değildir**; önceki turda da "bilinen ve bilinçli kısmi" olarak kayıtlıydı (`tasks/revize-plan.md:27`). Kök nedeni şartnamenin §14.4 export standardının (P4-02) hiç yapılmamış olmasıdır: kolonların ortak bir `exportValue` sözleşmesi yok, her rapor kendi biçimlendirmesini yazıyor.

**Nokta yaması yapılmamalı.** E paketinde ortak kolon API'si kurulunca 22 ekran tek tek yamalanmadan kapanır.

---

# FAZ 0 — Envanter ve güvenlik ağı ([21.0.1])

## P0-00 · Faz 0 çıktılarının tamamlanması

**Sorun.** [21.0.1] sayfa/rota/entity/durum alanı/duplicate hesaplama/rol envanterini ve mevcut davranış için smoke/E2E ağını istiyor. Bu turda madde envanteri (`tasks/cloud-envanter.md`, 519 madde) ve boşluk ölçümü (`docs/P-cloud-gap-analizi.md`) üretildi; eksik kalan üç şey var: durum alanı envanteri tek belgede değil, duplicate hesaplama listesi dağınık, testler elle çalıştırılıyor (`package.json`/CI yok).

**Hedef davranış.** Üç ek envanter belgesi: (1) **durum sözlüğü envanteri** — her entity'nin durum alanı, sözlüğün nerede tanımlı olduğu, geçiş tablosu olup olmadığı; (2) **duplicate hesaplama envanteri** — aynı metriği birden çok yerde hesaplayan kod; ölçülen iki vaka: fatura bakiyesi 6 formül, SLA 2 formül; (3) **test koşum betiği** — `tasks/qa/*.js` 21 script'ini tek komutla çalıştıran ve geçti/kaldı özeti basan runner.

**Değişecek dosyalar.** Yeni: `docs/Q-durum-envanteri.md`, `docs/R-duplicate-hesaplama.md`, `tasks/qa/run-all.js`. Değişmez: uygulama kodu.

**Veri düzeltme.** Yok — salt okuma.

**Yetki ve audit.** Yok.

**Kabul senaryosu.** `node tasks/qa/run-all.js` 21 script'i sırayla çalıştırır, her biri için geçti/kaldı yazar, kalan varsa exit kodu ≠ 0 döner. Durum envanteri her `*-form.html`'deki `durum` select'ini kapsar (ölçülen: 28 ekran).

**Geri dönüş.** Yalnız yeni dosya; geri alma = dosyaları silmek.

**Bağımlılık.** Yok. Bu paket açık soru beklemeden başlayabilir.

---

# FAZ 1 — P0 ortak çekirdek ([21.0.2], §16.1)

Bu fazın altı paketi şartnamenin P0 listesini karşılıyor. **Sıra önemli**: P1-01 diğerlerinin altyapısı.

## P1-01 · Merkezî durum geçiş motoru ([6.1.1]–[6.1.11], [16.1.2], [19.0.3])

**Sorun.** Geçiş motoru tek entity'de yaşıyor: `work.js:102-113` `DB.taskTransitions` + `domain.js:242` `Task.transition` yalnız görev için çalışıyor. Kalan 11 modül (proje, sözleşme, teklif, fatura, hata, destek, satın alma, sipariş, izin, teslim, değişiklik) durumu **28 form ekranındaki serbest `<select>`** ile yazıyor. Sonuçları ölçüldü: ön analiz herhangi bir durumdan `Onaylandı`ya atlayabiliyor ([7.2.1]), destek `Yeni`den doğrudan `Kapatıldı`ya geçebiliyor ([9.5.1]), sözleşme `Aktif` serbest seçiliyor ([8.1.6]).

**Hedef davranış.** `GV.transition(entityType, kod, hedef, ek, not)` tek giriş noktası. Sözleşme `DB.transitions[entityType]` altında veri olarak durur ve şartname [6.1.2]–[6.1.9]'un dokuz alanını taşır: kaynak/hedef, yetki, önkoşul, zorunlu gerekçe+neden kodu+ek, üretilecek olaylar, SLA/bütçe etkisi, bildirim alıcıları, terminal/geri alınabilirlik. Form ekranlarındaki `durum` alanı **salt okunur** olur; değişiklik yalnız eylem penceresinden geçer.

**Değişecek dosyalar.** `assets/js/domain.js` (`Task.transition` genelleştirilir), `assets/data/work.js` (`taskTransitions` → `DB.transitions.task`), yeni sözlükler `crm.js`/`ops.js`/`misc.js` içinde; 28 `app-*-form.html`'de `durum` alanı `readonly`'ye çevrilir; ilgili detay ekranlarına eylem düğmeleri.

**Veri düzeltme.** Durum adı değişen sözlükler için taşıma haritası — **AS-1.1, AS-1.2, AS-1.3, AS-1.4, AS-1.6, AS-1.7, AS-1.9 kararlaşmadan yapılamaz.** Mevcut kayıtların durum değerleri yeni sözlüğe eşlenmeli ve eşlenemeyen kayıt raporlanmalı.

**Yetki ve audit.** Her geçiş `yetki:[roller]` üzerinden `GV.perm` ile kontrol edilir. Her başarılı geçiş `transition_event` üretir ve `log()` ile `DB.activities`'e yazar (P1-04 birleşik audit defterine bağlanır). Yetkisiz geçiş denemesi de loglanır.

**Kabul senaryosu.** (1) Serbest `durum` select'i olan ekran sayısı 28 → 0. (2) Sözlükte tanımsız bir hedefe geçiş `{ok:false}` döner. (3) Zorunlu gerekçesi olan geçiş gerekçesiz reddedilir. (4) Aynı geçiş iki kez çağrıldığında ikinci çağrı yan etki üretmez ([6.1.11] prototip payı: aynı hedefe zaten geçmiş kayıt no-op döner).

**Geri dönüş.** `GV.transition` bir bayrakla (`GV.flags.transitionEngine`) devre dışı bırakılabilir; kapalıyken formlar eski serbest select'e döner. Sözlük taşıması ayrı commit, `git revert` ile geri alınabilir.

**Backend payı (bu turda kod üretmez).** [6.1.10] `POST /entities/{id}/transitions` uç noktası, [6.1.11] gerçek `transition_event` tablosu ve istek kimliği bazlı idempotency, [19.1.3] genel update'in durum alanını değiştirememesi.

## P1-02 · Ortak eylem penceresi ([6.2.1]–[6.2.8], [16.1.1])

**Sorun.** Sekiz eylem (Onayla, Reddet, İade Et, Revizyon İste, İptal Et, Geri Çek, Devret, Yeniden Aç) her sayfada sıfırdan `GV.modal` ile kuruluyor — `app-izin-detay.html:251`, `app-panel-onaylar.html:170-177`, `app-proje-degisiklik-detay.html:520`, `app-zaman-onay.html:119` dördü de ayrı kod. Neden kodu sözlüğü, ek dosya, sonraki onaycı, etkilenen kayıt özeti ve audit bağlantısı hiçbirinde yok.

**Hedef davranış.** `GV.action(cfg)` tek bileşen: hedef eylem ve sonucu, zorunlu neden kodu (sözlükten) + açıklama, `GV.upload` ile ek, sonraki onaycı/delege seçimi, etkilenecek bağlı kayıtların özeti, geri döndürülemez uyarısı, işlem sonrası tekil success state + audit kaydına bağlantı. `GV.transition`'ı çağırır — P1-01'e bağımlı.

**Değişecek dosyalar.** `assets/js/ui.js` (yeni `GV.action`), `assets/css/ui.css`, yeni `DB.reasonCodes` sözlüğü (`misc.js`); modal kuran ~14 detay ekranı bu bileşene taşınır.

**Veri düzeltme.** Neden kodu sözlüğü sıfırdan tanımlanacak. Mevcut serbest metin gerekçeler (`app-panel-onaylar.html:177`'de zaten **hiçbir yere kaydedilmiyor**) `neden:'DIGER'` + açıklama olarak taşınır.

**Yetki ve audit.** Pencere yalnız `GV.perm` izin verdiği eylemleri gösterir. Her eylem gerekçe + neden kodu ile audit'e yazılır — şartname [2.0.6] bunu zorunlu kılıyor.

**Kabul senaryosu.** (1) Sekiz eylemin sekizi de tek bileşenden açılıyor. (2) Neden kodu zorunlu olan eylemde kod seçilmeden gönderilemiyor. (3) Gerekçe metni gerçekten kaydediliyor ve audit kaydında görünüyor (bugün kaydedilmiyor). (4) Geri döndürülemez eylemde uyarı gösteriliyor ve ikinci onay isteniyor.

**Geri dönüş.** Bileşen ayrı; ekranlar tek tek taşınır, her taşıma ayrı commit.

## P1-03 · Sürümlenmiş onay motoru ([6.3.1]–[6.3.10], [16.1.2], [19.0.4])

**Sorun.** `app-ayar-onay.html` 1333 satırlık bir **anlatım ekranı**: `AKIS` dizisi `:155`'te sayfanın içinde yaşıyor, `DB`'ye çıkmıyor, başka modül okuyamıyor. `vekil` alanı çalıştırılabilir kural değil serbest cümle. Sürüm, paralel/çoğunluk adım, ret-iade-revizyon dalları yok. En ağır sonuç: `app-panel-onaylar.html:168-171` "Onayla" düğmesi yalnız `DB.approvals` satırının durumunu değiştiriyor — kaynak kayda (SAT-*/IZN-*) hiç dokunmuyor, adım ilerletmiyor, log yazmıyor. **Kullanıcı onayladığını sanıyor, talep hâlâ "Onay bekliyor" duruyor.** İkizi `ops.js:333` `onayAdim:2, onayToplam:3` elle sayacı ve `shell.js:461` menü rozetinin bu elle deftere bakması.

**Hedef davranış.** `GV.approval` servisi. Onay tanımı `DB.approvalFlows` altında sürümlü veri (`Taslak → Yayında → Kullanımdan Kaldırıldı`); süreç başlatıldığında sürüm örneğe sabitlenir. Sıralı + paralel + çoğunluk adım tipleri; rol/yönetici hiyerarşisi/proje rolü/departman tabanlı onaycı; vekâlet ve süre aşımı çalıştırılabilir kural. `onayAdim`/`onayToplam` alanları **kaldırılır**, onay olaylarından türetilir ([6.3.10]). Onay tamamlandığında kaynak kaydın geçişi `GV.transition` ile tetiklenir.

**Değişecek dosyalar.** Yeni `assets/js/approval.js` veya `domain.js` içinde `GV.approval`; `misc.js`/`ops.js` yeni `DB.approvalFlows` + `DB.approvalEvents`; `app-ayar-onay.html` (ekran içi `AKIS` → veri); `app-panel-onaylar.html` (gerçek onay); `ops.js:333` sayaç alanları silinir; `dashboard.js:655`, `shell.js:461` türetilmiş sayıya geçer.

**Veri düzeltme.** `ops.js` içindeki `onayAdim`/`onayToplam` alanları silinir ve mevcut 10 `DB.approvals` kaydı olay kaydına dönüştürülür. **AS-2.12 (SoD) ve AS-2.13 (kendi kendini onaylama) kararlaşmadan yapılamaz.**

**Yetki ve audit.** Onaycı çözümü `GV.perm` ve organizasyon hiyerarşisinden gelir. Her onay/ret/iade olayı gerekçe + neden kodu ile append-only deftere yazılır. Vekâlet kullanımı ayrıca işaretlenir.

**Kabul senaryosu.** Şartname [20.3.1]–[20.3.2]: satın alma talebi taslak kaydedilir, onaya gönderilir, reddedilir; ret gerekçesi kaydedilir; **kaynak talebin durumu da değişir** (bugün değişmiyor). Ayrıca: elle tutulan onay sayacı repoda kalmadığı `grep onayAdim` ile doğrulanır (beklenen: 0 sonuç).

**Geri dönüş.** `GV.flags.approvalEngine`; kapalıyken `app-panel-onaylar.html` eski davranışa döner. Sayaç alanlarının silinmesi ayrı commit.

## P1-04 · Yetki, denetim izi ve tek defter ([2.0.7], [6.4.1]–[6.4.3], [19.0.6], [19.0.7], [16.1.5])

**Sorun.** İki ayrı denetim defteri var ve birbirini görmüyor: `domain.js:36-47` `log()` → `DB.activities` (append) ve ekranlarda elle yazılan `DB.logs` (`app-ayar-yetki.html:541`, `app-ayar-rol.html:110` — üstelik `'LOG-'+(88300+DB.logs.length)` ile sahte kod üretiyor). İkisi de sayfa yenilenince siliniyor. Form ekranlarındaki mutasyonlar hiç log yazmıyor. Yetki tarafında kabuk olgun (`shell.js:350-413` `Perm`, `org.js:147` 27 rol × 11 eksen) ama satır kapsamı 137 ekranın **14'ünde**, alan maskesi **3 ekranda**, ve `proje` kapsamı hiç süzemiyor — `ui.js:640` bunu itiraf ediyor.

**Hedef davranış.** Tek `GV.audit` servisi; `DB.logs` kaldırılır, her şey `DB.activities` şemasına taşınır ve şartname [2.0.7]'nin istediği alanları taşır: aktör, zaman, kayıt, önceki/yeni değer, istek kimliği. Form kaydetme yolları da audit yazar. Yetki tarafında: `proje` kapsamı oturuma proje kodu dizisi eklenerek çözülür, satır kapsamı `GV.list` üzerinden tüm liste ekranlarına yayılır.

**Değişecek dosyalar.** `assets/js/domain.js` (`log()` → `GV.audit`), `assets/js/shell.js` (`Perm.scope` proje ekseni, `buildSession` proje dizisi), `assets/js/ui.js` (`afterScope` genelleştirme), `misc.js` (`DB.logs` kaldırılır), `app-ayar-log.html`, yetki yazan 5 ayar ekranı, 36 form ekranının `kaydet()` yolu.

**Veri düzeltme.** `DB.logs`'un 7 statik kaydı `DB.activities` şemasına taşınır. `shell.js:337` `buildSession(emp || 'EMP-001')` sabit kullanıcıya düşüşü kaldırılır ([23.0.10]).

**Yetki ve audit.** Paketin kendisi bu ikisi. İzin değişikliği auditlenir ([6.4.3]) ve `tasks/qa/gate.js` rol regresyon taraması genişletilir.

**Kabul senaryosu.** (1) `grep -c "DB.logs" assets/ app-*.html` → 0. (2) Bir kayıt formdan güncellendiğinde `DB.activities`'te önceki/yeni değerli kayıt oluşuyor. (3) `proje` kapsamlı bir rol yalnız üyesi olduğu projelerin görevlerini listede görüyor. (4) `tasks/qa/gate.js` 5 rol × tüm ekran taraması kalansız geçiyor.

**Geri dönüş.** Audit birleştirme ayrı commit; `proje` kapsamı `GV.flags.projectScope` ile kapatılabilir.

**Backend payı.** [2.0.2] sunucu tarafı yeniden doğrulama, [19.1.7] serialization'da maskeleme (bugün veri tarayıcıya tam yükleniyor, maskeleme kozmetik — [4.2.1] bu yüzden gerçekten karşılanamıyor), [2.0.7] append-only kalıcı defter.

## P1-05 · Finansal kanonik kaynak ([2.0.1], [10.4.5], [10.4.6], [10.5.2], [16.1.6], [19.0.9])

**Sorun.** Üç ayrı ihlal iç içe:
1. **Fatura "Ödendi" elle işaretleniyor** — `app-fatura-detay.html:214`, `app-fatura.html:125`, `app-fatura-form.html:621` üç ayrı yerden, `odemeTarihi` de elle giriliyor (`:603`). `app-tahsilat-detay.html:238` "Tahsil edildi işaretle" hiçbir para hareketi yaratmadan faturayı kapatıyor.
2. **Çift yönlü ayna** — `domain.js:51-69` `settleInvoice` faturayı kapatıp tahsilatı ona uyduruyor; `domain.js:73-90` `settlePayment` tersini yapıyor. Hangi uçtan tetiklenirse o kanonik oluyor.
3. **Tarihsel oran yok** — `Hr.icMaliyet` (`domain.js:614-630`) tarih parametresi almıyor; `domain.js:824` her zaman kaydına bugünkü oranı çarpıyor. Maaş değişince geçmiş proje kârlılıkları geriye dönük değişiyor.

Ayrıca fatura bakiyesi **6 ayrı yerde 6 ayrı formülle** hesaplanıyor (`domain.js:113`, `app-fatura.html:36`, `app-fatura-detay.html:90-92`, `app-fatura-form.html:785`, `app-tahsilat-detay.html:104-108`, `app-butce.html:80-82`) — ikisi net, ikisi brüt eksende. Bu [2.0.11]'in ihlali.

**Hedef davranış.** Ödeme hareketi kanonik kaynak. `DB.paymentAllocations` ara koleksiyonu açılır (bugün `misc.js:128` `DB.payments[].fatura` **tekil**, çoklu tahsis şema düzeyinde imkânsız). `GV.fin.balance(fatura)` tek yordam; fatura durumu tahsis toplamından türer, elle işaretlenemez. `Hr.icMaliyet(kod, tarih)` imzası ve zaman kaydında oran snapshot'ı.

**Değişecek dosyalar.** `assets/js/domain.js` (`GV.fin` yeniden kurulur), `assets/data/misc.js` (`DB.paymentAllocations`), `assets/data/hr.js` (oran snapshot alanı), fatura/tahsilat/bütçe ekranları (6 hesap noktası tek yordama), `app-fatura-detay.html`/`app-fatura.html`/`app-fatura-form.html` (elle işaretleme kaldırılır).

**Veri düzeltme.** Mevcut 17 tekil ödeme→fatura bağı tahsis kaydına dönüştürülür. Zaman kayıtlarına geçmişe dönük oran snapshot'ı yazılır — **AS-2.2 kararlaşmadan yapılamaz.** Fatura durumları tahsis toplamından yeniden türetilir; uyuşmayan kayıtlar raporlanır (`app-fatura-form.html:196-199` bu tutarsızlığı bugün zaten sayıyor).

**Yetki ve audit.** Tahsis oluşturma/silme `finans` yetkisine bağlanır ve auditlenir. Elle durum değişikliği yolu kapatıldığı için audit yüzeyi daralır.

**Kabul senaryosu.** Şartname [20.3.7]: bir tahsilat hareketi çoklu faturaya dağıtılır, fatura durumları **otomatik türer**. Ayrıca: `grep -c "Ödendi işaretle"` → 0; `GV.fin.balance` dışında bakiye hesabı yapan kod kalmadığı doğrulanır; 2025 tarihli zaman kaydının maliyeti maaş değiştiğinde değişmiyor.

**Geri dönüş.** Tahsis koleksiyonu eklemek geriye uyumlu (tekil alan bir süre paralel tutulabilir). `GV.flags.allocationModel` ile eski yola dönülebilir. Oran snapshot'ı ayrı commit.

**Bağımlılık.** ⛔ AS-2.1, AS-2.2 kararlaşmalı.

## P1-06 · İş takvimi / SLA motoru ([9.5.3], [9.5.4], [11.1.3], [8.4.8], [16.1.7], [19.0.8])

**Sorun.** Tarih bilinci hiçbir hesapta yok. `app-destek-detay.html:47-51` `gecenDk()` **düz duvar saati** farkı alıyor — "Mesai içi" yazılı bir talep hafta sonu boyunca ihlale düşüyor; `calismaSaati` alanı (`:826`) yalnız etiket olarak basılıyor, hesabı yönlendirmiyor. Resmî tatil verisi kalıcı değil (`app-ayar-sirket.html:82-83` "Tatil listesi veri modelinde YOK … varsayımdır"). İzin takvim günü sayıyor (`app-izin-form.html:359-361`). "Müşteri bekleniyor" SLA'yı durdurmuyor ve bekleme aralığı saklanmıyor — DST-2026-120 kaydı `Müşteri bekleniyor` iken `İhlal edildi` yazılı. Görevde duraklatma yordamı var (`domain.js:367`), destekte yok: iki modül aynı olguyu farklı yönetiyor.

**Hedef davranış.** `GV.calendar` servisi: `DB.holidays` kalıcı takvim, mesai penceresi, `isGunu(a,b)`, `mesaiDakika(a,b)`, `duraklat(kayit, neden, baslangic)`. SLA, izin ve görev termini bu tek servisi çağırır. Bekleme aralıkları `beklemeAraliklari[]` olarak saklanır.

**Değişecek dosyalar.** Yeni `GV.calendar` (`domain.js`), `assets/data/org.js` (`DB.holidays`, mesai tanımı), `app-destek-detay.html`, `app-destek-sla.html`, `app-izin-form.html`, `app-izin-detay.html`, `app-gorev-detay.html`, `ops.js` (`DB.tickets` bekleme alanları).

**Veri düzeltme.** Mevcut SLA durumları yeniden hesaplanır; DST-2026-120 gibi çelişkili kayıtlar düzeltilir. İzin gün sayıları yeni tabana göre yeniden hesaplanır — **AS-3.2 kararlaşmadan yapılamaz.**

**Yetki ve audit.** Duraklatma başlatma/bitirme auditlenir. Takvim tanımını değiştirme `sahip`/`ik` yetkisine bağlanır ve auditlenir.

**Kabul senaryosu.** (1) Cuma 17:00'de açılan "Mesai içi" talebin SLA sayacı hafta sonu ilerlemiyor. (2) "Müşteri bekleniyor" süresi hedeften düşülüyor ve aralık kayıtta görünüyor. (3) Resmî tatile denk gelen izin günü bakiyeden düşülmüyor. (4) `Müşteri bekleniyor` + `İhlal edildi` çelişkisi taşıyan kayıt kalmıyor.

**Geri dönüş.** `GV.flags.businessCalendar`; kapalıyken eski duvar saati hesabına dönülür.

**Bağımlılık.** ⛔ AS-3.1, AS-3.2 kararlaşmalı.

## P1-07 · Veri Kalitesi ve Sistem Sağlığı sayfası ([17.0.1]–[17.0.13], [16.1.3], [19.0.12])

**Sorun.** Sayfa tümüyle yok. Tek kırıntı üç formda elle yazılmış mükerrer uyarısı (`app-tedarikci-form.html:361`, `app-toplanti-form.html:420`, `app-arac-yakit-form.html:904`). Buna karşılık `tasks/qa/canon.js` **1522 satırlık** gerçek bir veri tutarlılık tarayıcısı — ama repo dışı bir Node script'i, üründe çalışan servis değil.

**Hedef davranış.** `app-veri-kalitesi.html` + `GV.dq` servisi. `canon.js`'in kontrol mantığı tarayıcıda çalışan kurallara dönüştürülür ve şartnamenin saydığı 10 kontrol ([17.0.2]–[17.0.11]) eklenir. Her bulgu önem, etkilenen kayıt, tespit kuralı, ilk/son görülme, otomatik düzeltilebilirlik, sorumlu, durum ve çözüm auditini taşır.

**Değişecek dosyalar.** Yeni `app-veri-kalitesi.html`, yeni `assets/js/dq.js` (veya `domain.js` içinde `GV.dq`), `shell.js` menü girdisi, `tasks/qa/canon.js` (kural mantığı ortaklaştırılır).

**Veri düzeltme.** Sayfanın kendisi veri düzeltme aracı; otomatik düzeltmeler geri alınabilir ve yetkili olmalı ([17.0.13]).

**Yetki ve audit.** Sayfa `sahip`/`gm`/`sistem` rollerine açılır. Her otomatik düzeltme auditlenir ve geri alınabilir.

**Kabul senaryosu.** 10 kontrolün 10'u çalışıyor ve bu turda ölçülen bilinen tutarsızlıkları yakalıyor: DST-2026-120 (durum-SLA çelişkisi), ZMT-2026-007 (`personelOnay:'Bekliyor'` iken demirbaş "Zimmetli"), `onayAdim` elle sayaçları, `DB.approvals` ile kaynak kayıt durumu uyuşmazlığı.

**Geri dönüş.** Yeni sayfa; menüden kaldırmak yeterli.

## P1-08 · Entegrasyon hata kuyruğu ekranı ([13.0.13], [13.0.6], [16.1.4], [19.0.11])

**Sorun.** Şartname bunu **P0** ilan ediyor. Repoda karşılığı yok — "hata kuyruğu"/"dead-letter"/"replay" hiç geçmiyor. Entegrasyon yönetimi bir `GV.drawer` içinde uç nokta + API anahtarı + sıklık üçlüsünden ibaret (`app-ayar-entegrasyon.html:167-253`). Daha kötüsü, var olmayan yetenekleri anlatan metinler var: `misc.js:575` "Depo ve PR bağlantıları proje kartına yansır", `misc.js:577` "Toplantılar iki yönlü senkronize edilir", `:48` `'Anlık (webhook)'`.

**Hedef davranış.** `app-entegrasyon-hata.html`: hata, etkilenen kayıt, deneme sayısı, son mesaj, güvenli payload özeti, önerilen çözüm, tekrar çalıştırma sonucu. Prototip payında `DB.integrationErrors` mock koleksiyonu ve replay eyleminin UI akışı kurulur; backend payında gerçek kuyruk.

**Değişecek dosyalar.** Yeni `app-entegrasyon-hata.html`, `misc.js` (`DB.integrationErrors`), `shell.js` menü, `app-ayar-entegrasyon.html` (bağlantı).

**Veri düzeltme.** Var olmayan yeteneği anlatan üç metin ([2.0.12] ihlali) ya doğru hâline getirilir ya kaldırılır.

**Yetki ve audit.** Replay `sistem`/`sahip` yetkisine bağlanır ve auditlenir. Payload özeti secret sızdırmamalı ([13.0.2]).

**Kabul senaryosu.** Hata kaydı görüntülenebiliyor, replay denendiğinde sonuç kayda yazılıyor, aynı hata iki kez replay edildiğinde ikinci deneme ayrı kayıt üretiyor ama yan etki yinelenmiyor.

**Geri dönüş.** Yeni sayfa.

**Backend payı.** [13.0.5] sync job/run log, [13.0.7] webhook imza + replay koruması, [13.0.8] API anahtarı scope/rotasyon, [19.0.16] gerçek retry + DLQ.

## P1-09 · Notlarım negatif yetki test ağı ([16.1.8], [15.5.1]–[15.5.6])

Notlarım modülü Faz 4'te yazılıyor; ama şartname test ağını **P0** sayıyor. Bu paket testleri modülden **önce** yazar (kırmızı testler), modül gelince yeşile döner.

**Sorun.** `tasks/qa/` içinde kişisel not izolasyon testi yok; modül de yok.

**Hedef davranış.** `tasks/qa/notes-isolation.js`: A kullanıcısının not ID'siyle B ve superadmin olarak listede/detayda/aramada/export'ta erişim denenir; hiçbirinde içerik görünmemeli. Not metninin audit, log ve genel arama indeksinde bulunmadığı taranır.

**Değişecek dosyalar.** Yeni `tasks/qa/notes-isolation.js`, `tasks/qa/run-all.js` kaydı.

**Veri düzeltme / yetki / audit.** Yok — salt okuma testi.

**Kabul senaryosu.** Modül yokken test "modül yok" diye açıkça kalır (yeşil sayılmaz, [22.0.11]). Modül geldiğinde altı senaryonun altısı geçer.

**Geri dönüş.** Test dosyası.

---

# FAZ 2 — Tasarım standardı ([21.0.3], §3)

## P2-01 · `CreateEditPage` — sekme, sağ panel, form-foot ([3.1.4], [3.1.5], [3.1.6], [3.1.12], [3.1.13], [3.1.15], [3.2.1])

**Sorun.** Ortak form motoru gerçekten tek ve disiplinli — 36/36 form `GV.form`, ikinci motor yok. Ama şartnamenin istediği kabuk anatomisi motorda hiç yok: `ui.js:1782` yalnız düz `(cfg.sections||[]).forEach` — **sekme kavramı yok**. `.gv-tabs` (`ui.css:897-917`) 28 detay ekranında kullanılıyor ama formların **sıfırında**. Bu tek boşluk [3.1.6] (sekme ikonu), [3.1.12] (sekme bazlı hata özeti) ve [3.2.1] (sekme klavye erişilebilirliği) maddelerini birlikte düşürüyor. Sağ bağlam paneli de yok: `.gv-grid-aside` 36 formdan yalnız `app-izin-form.html`'de. Footer üç ayrı kapta: 32 form `.gc-foot`, 3 form `.gv-form-actions`, `app-satinalma-form.html` **hiç footer'sız**.

Şartnamenin "referans tasarım" ilan ettiği `app-personel-form.html` saydığı 7 sekmenin hiçbirine sahip değil ve `grep -c form-grid` → 0. Yani referans, kendi türevi sayılması gereken `app-izin-form.html`'den geride.

**Hedef davranış.** `GV.form`'a `tabs` desteği eklenir; `GV.tabs` (`ui.js:1673-1703` — role=tab, aria-selected, ArrowLeft/Right zaten çalışıyor) form motorundan çağrılır. `aside` yapılandırması sağ paneli üretir ve alan değişiminde canlı günceller. Tek `form-foot`. Ayrıca eksik alan tipleri: tekrarlanabilir satır ([3.1.9]), salt okunur türetilmiş alan ([3.1.11]), aranabilir seçim ([3.2.4]).

**Değişecek dosyalar.** `assets/js/ui.js` (`GV.form` genişletme), `assets/css/ui.css`; sonra sırayla `app-personel-form.html` ve `app-proje-form.html` (şartname [21.0.3] bu ikisini önce istiyor), ardından kalan formlar.

**Veri düzeltme.** Yok.

**Yetki ve audit.** Sekme bazlı yetki: rolü olmayan kullanıcının sekmesi hiç basılmaz — mevcut desen (`app-personel-form.html:102,590-619`) doğru, sekmeye taşınır.

**Kabul senaryosu.** [20.4.1]: sekmeli personel formunda yetkiye göre hassas sekme gösteriliyor/gizleniyor. `tasks/qa/ctl.js` form anatomisi denetimi sekme + sağ panel + tek footer'ı doğruluyor. Klavye ile sekme gezinme 3 kırılımda çalışıyor.

**Geri dönüş.** `tabs` yapılandırması opsiyonel — vermeyen form eski düz `sections` davranışında kalır. Form başına taşıma ayrı commit.

**Bağımlılık.** ⚠️ AS-6.2 (referans dosyanın repoya alınıp alınmayacağı), AS-6.3 (kapsam 33 mü 43 mü).

## P2-02 · Kayıt sonrası detaya yönlendirme ([3.1.16])

**Sorun.** 34 formun tamamı kaydettikten sonra **listeye** dönüyor ve bu kodda yorum satırı olarak kurallaştırılmış: `/* location.reload() YASAK — normal akış listeye dönmektir. */` (`app-personel-form.html:979`, `app-proje-form.html:966`). Şartname [3.1.16] tam tersini istiyor: ana kaydın detayına gidilsin ve otomatik üretilen alt kayıtların bağlantıları gösterilsin.

**Hedef davranış.** Kayıt sonrası detay sayfasına yönlendirme + oluşan alt kayıtların listesi. Detay sayfası olmayan entity'lerde listeye dönüş korunur ve bu istisna belgelenir.

**Değişecek dosyalar.** 34 `app-*-form.html`'in `kaydet()` sonu; `ui.js` içinde ortak `GV.form.afterSave` kancası.

**Veri düzeltme.** Yok.

**Yetki ve audit.** Kullanıcının detay sayfasını görme yetkisi yoksa listeye döner.

**Kabul senaryosu.** Yeni personel kaydedildiğinde detay sayfası açılıyor ve (P3 paketleri geldiğinde) oluşan özlük/onboarding/taslak zimmet bağlantıları görünüyor.

**Geri dönüş.** Ortak kanca; `GV.flags.afterSaveDetail` ile toplu geri alınabilir.

**Not.** Bu paket kodda yazılı bir karşı-kararı tersine çeviriyor. `tasks/lessons.md`'ye gerekçesiyle işlenmeli.

## P2-03 · Demo sızıntısının temizlenmesi ([2.0.12], [23.0.10])

**Sorun.** 26 sayfada geliştirici notu kullanıcıya görünür durumda: `app-ayar-sirket.html:256`, `app-ayar-profil.html:193`, `app-satinalma-form.html:375` ("DB.purchases kaydında dosya alanı yok"). Üretim arayüzünde `DB.*` koleksiyon adı ve mock açıklaması basılıyor. Ayrıca `shell.js:337` `buildSession(emp || 'EMP-001')` ve `app-ayar-arsiv.html:32` sabit kullanıcıya düşüyor.

**Hedef davranış.** Kullanıcıya görünen metinlerde `DB.*`, "prototip", "mock", "bu formdan yazılmaz" ifadeleri kalmaz. Bu bilgiler kod yorumuna veya `tasks/ui-debt.md`'ye taşınır. Sabit kullanıcı düşüşü kaldırılır.

**Değişecek dosyalar.** 26 ekran, `shell.js`, `app-ayar-arsiv.html`.

**Veri düzeltme.** Yok.

**Yetki ve audit.** Sabit kullanıcı düşüşünün kaldırılması oturum davranışını değiştirir — `tasks/qa/gate.js` ile doğrulanmalı.

**Kabul senaryosu.** `grep -rn "DB\.\w*" app-*.html | grep -v "<script"` kullanıcıya basılan metinde sonuç vermiyor. `grep -c "EMP-001'" assets/js/shell.js` → 0.

**Geri dönüş.** Metin değişikliği; commit başına geri alınabilir.

---

# FAZ 3 — Uçtan uca iş akışları ([21.0.4], §16.2 P1)

Bu fazın paketleri P1-01…P1-06 çekirdeğine bağımlı. Sıra şartname [1.0.5] zincirini takip ediyor.

## P3-01 · Satış zinciri: lead → ön analiz → teklif → müşteri ([7.1], [7.2], [7.3], [20.1])

**Sorun.** Senaryo A'nın 8 adımının 5'i mevcut kodla yürütülemiyor. Üç ağır bulgu: (1) **teklif sürümlemesi sahte** — `app-teklif-detay.html:151` aynı kaydı yerinde değiştirip sayacı artırıyor ve kod bunu `:358-361`'de itiraf ediyor: "teklif sürümlerinin ayrı kayıtları yok"; (2) **mükerrer müşteri kontrolü hiç yok** — `app-lead-detay.html:587-605` koşulsuz yeni `MUS-` üretiyor, aynı firma iki lead'den iki kayıt doğuruyor; (3) **"Kazanıldı" sonrası hiçbir şey olmuyor** — sözleşme/plan/proje taslağı üreten sihirbaz yok. Ayrıca "Teklif Oluştur" düğmesi lead bağlamıyla değil liste sayfasına gidiyor (`app-lead-detay.html:111` — şartnamenin [7.1.1]'de birebir yasakladığı davranış) ve ön analiz kapısı üç ekranda üç farklı davranıyor.

**Hedef davranış.** Teklif revizyonu **yeni kayıt** üretir, eski sürüm kilitlenir, fark karşılaştırılabilir. Dönüşüm öncesi vergi no/unvan/e-posta/telefon/alan adı ile mükerrer araması; "mevcut müşteriye bağla / birleştir / yetkili istisna" üçlüsü. "Kazanıldı" dönüşüm sihirbazı. Ön analiz kapısı tek yerde (`GV.transition` önkoşulu).

**Değişecek dosyalar.** `app-teklif-detay.html`, `app-teklif-form.html`, `app-lead-detay.html`, `app-onanaliz-detay.html`, `app-onanaliz.html`, `app-musteri-form.html`, `crm.js` (teklif sürüm alanları, ön analiz `versiyon`, müşteri `vergiNo`), yeni birleştirme akışı.

**Veri düzeltme.** Mevcut teklif `versiyon` sayacı gerçek sürüm kayıtlarına dönüştürülür. `vergiNo:null` olan müşteri kayıtları için alan açılır.

**Yetki ve audit.** Mükerrer istisnası ve müşteri birleştirme yönetici yetkisi + gerekçe ister ([2.0.6]). Birleştirme audit izini kaybetmeden taşımalı ([7.4.2]).

**Kabul senaryosu.** Şartname [20.1.1]–[20.1.8] sekiz adımı uçtan uca. Özellikle [20.1.8]: aynı dönüşüm komutu tekrar çalıştırıldığında ikinci müşteri oluşmuyor.

**Geri dönüş.** Sürümleme modeli geriye uyumlu (eski `versiyon` alanı bir süre paralel). Sihirbaz ayrı ekran, kaldırılabilir.

**Bağımlılık.** P1-01. ⚠️ AS-1.3, AS-2.8, AS-2.9, AS-3.5, AS-5.2.

## P3-02 · Sözleşme, ödeme planı, milestone, sprint ekranları ([8.1]–[8.3], [16.2.1], [16.2.2], [16.2.7])

**Sorun.** Ödeme planı için **6 ekranın 1'i** var (yalnız liste); taksit hiçbir ekrandan oluşturulup düzenlenemiyor — sözleşme→tahsilat zincirinin ortası veri girişine kapalı. Milestone için yeni/düzenle/detay yok, sprint için detay yok: **8 ekranın 3'ü var.** Sözleşmede imza hash'i/imzalayan/zeyil kavramı hiç yok; kapsam/fiyat değişikliği imzalı belgeyi doğrudan eziyor (`app-sozlesme-form.html:567-640`) ve yenileme mevcut kaydın bitişini uzatıyor (`domain.js:755-766`) — [2.0.5] sürüm-kilit ilkesinin tersi. Sözleşme formu teklifi müşteriye göre filtrelemiyor ve yalnız `Kaybedildi`yi eliyor, yani `Taslak` teklifden sözleşme açılabiliyor.

**Hedef davranış.** Eksik 5 ekran (`app-odemeplani-form.html`, `-detay.html`, `app-proje-milestone-form.html`, `-detay.html`, `app-proje-sprint-detay.html`). Sözleşme değişikliği zeyil/revizyon üretir, imzalı sürüm kilitlenir. Teklif seçimi müşteriye göre filtrelenir ve yalnız kabul edilmiş/kazanılmış teklifler gelir.

**Değişecek dosyalar.** 5 yeni ekran; `app-sozlesme-form.html`, `app-sozlesme-detay.html`, `domain.js` (`Yenileme.uzat` → zeyil üretimi), `work.js` (milestone/sprint alan genişletmesi), `shell.js` menü.

**Veri düzeltme.** Sözleşme durum sözlüğü taşıması (**AS-1.2**). Mevcut taksitlere plan kaydı bağlanır.

**Yetki ve audit.** Zeyil oluşturma ve imza kaydı auditlenir. İmzalı sürüm değiştirme girişimi reddedilir ve loglanır.

**Kabul senaryosu.** [20.1.5]–[20.1.6]: kazanılan tekliften sözleşme + ödeme planı taslağı oluşuyor; imza + plan kontrolünden sonra sözleşme aktive ediliyor; kontroller sağlanmadan aktivasyon reddediliyor.

**Geri dönüş.** Yeni ekranlar menüden kaldırılabilir; zeyil modeli `GV.flags.contractAmendment`.

**Bağımlılık.** P1-01, P1-03. ⛔ AS-1.2, AS-2.6.

## P3-03 · Kalite zinciri: test varlıkları, hata, değişiklik, teslimat ([9.1]–[9.4], [20.2])

**Sorun.** **Test varlık modeli tümüyle sayaç**: `DB.tests` senaryoyu sayı olarak tutuyor (`work.js:900-921`) ve `app-proje-test-detay.html:405` bunu itiraf ediyor: "başarısız senaryoların hangileri olduğu bu ekrandan okunamaz". Senaryo/Adım/Kanıt/Build/Ortam varlığı yok; `DB.testResults` tanımlı ama **hiçbir ekranda kullanılmıyor** (ölü sözlük) ve değerleri şartnameyle uyuşmuyor. Failed sonuçtan hata açacak yol yok — `app-proje-test-detay.html:517` "başarısız senaryo var ama bağlı hata kaydı yok" uyarısını basıyor ama hata açacak düğme sunmuyor. Hata kaydında yapılandırılmış repro/beklenen/gerçekleşen alanı yok ve `app-proje-hata-form.html:506` bunu tasarım kararı olarak savunuyor. Teslim kalemleri ayrı kabul edilemiyor; revizyon istendiğinde durum **geri** `Planlandı`ya düşüyor (`domain.js:143-147`) ve teslimin gönderildiği bilgisi siliniyor. Kabul edilen sürüm **teslim adından regex'le** çıkarılıyor (`app-proje-teslim-detay.html:134-137`).

**Hedef davranış.** Test Planı / Senaryo / Adım / Koşum / Sonuç / Kanıt / Build / Ortam ayrı varlıklar; sayaçlar türetilir. Failed → hata dönüşümü kaynak test/build/ortam/kanıtı otomatik bağlar. Hata kaydında yapılandırılmış alanlar. Teslim kalemi varlığı ve kalem bazlı kabul; kabul edilen sürüm saklanır (regex'ten çıkarılmaz).

**Değişecek dosyalar.** `work.js` (yeni koleksiyonlar), `app-proje-test*`, `app-proje-hata*`, `app-proje-teslim*`, `app-proje-degisiklik-detay.html`, `domain.js` (`Delivery.approve`).

**Veri düzeltme.** `DB.tests` sayaçlarından senaryo kaydı üretilemez (bilgi yok) — mevcut kayıtlar "senaryo detayı yok" olarak işaretlenir ve bu açıkça raporlanır. `DB.testResults` sözlüğü şartname değerlerine taşınır.

**Yetki ve audit.** Kabul kaydı (kişi, tarih, kanıt) auditlenir ve değiştirilemez.

**Kabul senaryosu.** [20.2.3]: başarısız testten hata oluşturuluyor, düzeltiliyor, yeniden test ediliyor. [20.2.5]: kritik hata açıkken teslim engelleniyor (**AS-1.15 kararına göre**). [20.2.6]: kısmi kabulde yalnız kabul edilen kalem fatura tetikliyor (**AS-2.3 kararına göre**).

**Geri dönüş.** Yeni koleksiyonlar geriye uyumlu; sayaç alanları bir süre paralel tutulur.

**Bağımlılık.** P1-01, P1-05. ⛔ AS-1.15, AS-2.3, AS-2.4. ⚠️ AS-1.13, AS-1.16.

## P3-04 · Satın alma zinciri: onaya gönderme, RFQ, satır bazlı kabul, tedarikçi faturası ([10.1]–[10.3], [16.2.8], [16.2.9], [20.3])

**Sorun.** **Akışın ilk düğümü kilitli**: talep `Taslak` doğuyor ama `Onay bekliyor`a geçiren hiçbir eylem yok, ve `app-satinalma.html:111` onaylamayı "durum ≠ Onay bekliyor" diye reddediyor. Onaydan sonra durum doğrudan `'Sipariş verildi'` yapılıyor, ara adımlar atlanıyor. Ret onay kaydını değiştiriyor ama bağlı `DB.purchases` durumu `Onay bekliyor` kalıyor — iki kayıt çelişiyor; ret gerekçesi (`rNot`) **hiçbir yere kaydedilmiyor**. Sipariş kapısı yok: `Taslak` talepten bile sipariş açılabiliyor. Satır bazlı kısmi teslim veride var ama **girilemiyor** — `app-siparis-detay.html:224` tek eylem eksik kalemleri sorgusuz TAM sayıyor. **Tedarikçi faturası ayrı varlık değil**: `DB.orders[].fatura` serbest metin bir numara; üçlü eşleştirme, ödeme onayı ve borç hesapları yok. Teklif karşılaştırması ham fiyat sıralıyor, para birimi/vergi/navlun/ödeme koşulu normalize edilmiyor.

**Hedef davranış.** "Onaya Gönder" eylemi; akışın 8 adımı; ret/iade gerekçesi kaydedilir ve kaynak kaydın durumunu da değiştirir. `DB.supplierInvoices` varlığı ve PO–Kabul–Fatura üçlü eşleştirmesi. Satır bazlı kabul girişi. RFQ tekliflerinde normalize karşılaştırma.

**Değişecek dosyalar.** `app-satinalma-form.html`, `app-satinalma.html`, `app-satinalma-detay.html`, `app-satinalma-teklif.html`, `app-siparis-form.html`, `app-siparis-detay.html`, yeni `app-tedarikci-fatura*.html`, `ops.js`.

**Veri düzeltme.** `DB.orders[].fatura` serbest metinleri `DB.supplierInvoices` kayıtlarına dönüştürülür; dönüştürülemeyenler raporlanır.

**Yetki ve audit.** SoD kontrolü (**AS-2.12**), aynı onaycının yinelenmemesi (**AS-2.13**), ret gerekçesinin auditlenmesi.

**Kabul senaryosu.** [20.3.1]–[20.3.5] beş adım uçtan uca; özellikle [20.3.5] üçlü eşleştirme doğrulaması.

**Geri dönüş.** Tedarikçi faturası yeni varlık; serbest metin alanı bir süre paralel.

**Bağımlılık.** P1-01, P1-03, P1-05. ⚠️ AS-2.12, AS-2.13.

## P3-05 · Tahsilat formu ve çoklu tahsis ekranı ([10.4.4], [16.2.6], [20.3.7])

**Sorun.** **`app-tahsilat-form.html` dosyası yok** — `app-tahsilat.html:38` "Yeni" düğmesi fatura formuna gidiyor. Tahsilat bir para hareketi değil, "gecikme takibi" kaydı; ödeme yöntemi, banka hesabı, dekont, valör, kur alanları yok (`app-tahsilat-detay.html:352-356` bunu itiraf ediyor). Çoklu fatura tahsisi şema düzeyinde imkânsız: `misc.js:128` `DB.payments[].fatura` tekil, `docs/G-veri-modeli.md:423` "birebir".

**Hedef davranış.** `app-tahsilat-form.html`: yöntem, banka/kasa hesabı, dekont, işlem tarihi, valör, para birimi/kur, karşı taraf, **çoklu fatura tahsis satırları**, fazla/eksik ödeme, iade. Ayrı tahsis dağıtım ekranı.

**Değişecek dosyalar.** Yeni `app-tahsilat-form.html`, `app-tahsilat.html`, `app-tahsilat-detay.html`, `misc.js`.

**Veri düzeltme.** P1-05'te açılan `DB.paymentAllocations` kullanılır; bu paket onun UI'ı.

**Yetki ve audit.** Tahsis oluşturma `finans` yetkisi + audit.

**Kabul senaryosu.** [20.3.7]: bir tahsilat çoklu faturaya dağıtılıyor, fatura durumları otomatik türüyor, elle işaretleme yolu yok.

**Geri dönüş.** Yeni ekran.

**Bağımlılık.** ⛔ P1-05 tamamlanmadan başlayamaz.

## P3-06 · İK zinciri: yaşam döngüsü, onboarding/offboarding, zimmet kabulü ([4.1.4], [4.1.5], [11.3], [11.4.2], [16.2.15], [20.4.4])

**Sorun.** Personel yaşam döngüsü yok — tek `aktif` boolean'ı var (`app-personel-form.html:678-698`), Taslak/Onboarding/İzinli/Offboarding/Ayrıldı hiç yok ve yeni kayıt doğrudan `aktif:true` doğuyor ([4.2.3] tersine çeviriyor). Offboarding kaydı veride **sıfır** (`grep -c "tur:'Çıkış'"` → 0); personel `aktif:false` yapılırken **aktif zimmeti kontrol edilmiyor**. Zimmet ekseninde ters yönlü bir çelişki var: envanter zimmet **kaydedilirken** güncelleniyor (`app-zimmet-form.html:759-794` yalnız `durum==='Aktif'`e bakıyor, `personelOnay`a bakmıyor) ve "Dijital onay" aksiyonu envantere **hiç dokunmuyor** — `ops.js:118-119` ZMT-2026-007 `personelOnay:'Bekliyor'` iken demirbaş "Zimmetli". Üstelik `app-zimmet.html:117-120` onayı **herhangi bir yetkili** kullanıcı verebiliyor, oturum sahibinin o personel olduğu doğrulanmıyor.

**Hedef davranış.** Personel durumu `GV.transition` ile yaşam döngüsünden türer. Onboarding şablonu görev/belge/hesap/ekipman üretir. Offboarding zimmet iadesi + erişim iptali + sorumluluk devri olmadan tamamlanmaz. Taslak zimmet durumu; envanter **personel onayıyla** güncellenir; onayı yalnız zimmet sahibi verebilir.

**Değişecek dosyalar.** `app-personel-form.html`, `app-personel-detay.html`, `app-personel-giris.html`, `app-zimmet-form.html`, `app-zimmet.html`, `org.js`, `hr.js`, `ops.js`, `domain.js` (`Hr.*`).

**Veri düzeltme.** ZMT-2026-007 gibi çelişkili kayıtlar düzeltilir (P1-07 bunları yakalar). `aktif` boolean'ı yaşam döngüsü durumuna taşınır.

**Yetki ve audit.** Zimmet onayı oturum sahibine kısıtlanır — bu bir **yetki açığının kapatılması**. Offboarding adımları auditlenir.

**Kabul senaryosu.** [20.4.3]: personel + özlük + onboarding + taslak zimmet tek işlemde oluşuyor (prototipte transaction taklidi + hata hâlinde geri alma). [20.4.4]: personel zimmeti kabul edince envanter güncelleniyor, kabul etmeden güncellenmiyor. [4.2.3]: zorunlu evrak eksikken personel taslak kalıyor, "Aktif" olamıyor.

**Geri dönüş.** Yaşam döngüsü `GV.flags.employeeLifecycle`.

**Bağımlılık.** P1-01, P1-04. ⚠️ AS-1.10, AS-1.11.

## P3-07 · Destek zinciri: geçiş motoru, kota düşümü, bilgi bankası ([9.5], [16.2.11])

**Sorun.** Destek için geçiş motoru yok — durum serbest dropdown (`app-destek-form.html:215`), `Yeni`den doğrudan `Kapatıldı`ya atlanabiliyor. `Yeniden Açıldı` sözlükte var ama **hiçbir ekranda kullanılmıyor** (ölü değer). Bakım hakkı düşmüyor: `app-destek-form.html:178-179` "bu form paketin `kullanilan`/`kalan` alanlarına DOKUNMAZ". Bilgi bankası, hazır yanıt, e-posta yanıt zinciri ve ekler yok; `docs/H-is-akislari.md:737` "talep gövdesi ayrı tutulmuyor" diyor. Incident/problem/change ayrımı veri modelinde değil, veri girişinde.

**Hedef davranış.** Destek `GV.transition`'a bağlanır; gerekçeli yeniden açma. Kota düşümü kararlaştırılan politikaya göre. Bilgi bankası ekranı ve hazır yanıtlar.

**Değişecek dosyalar.** `app-destek-form.html`, `app-destek-detay.html`, `app-destek-paket-form.html`, yeni `app-bilgi-bankasi.html`, `ops.js`, `shell.js` menü.

**Veri düzeltme.** Kota alanları politikaya göre yeniden hesaplanır.

**Yetki ve audit.** Yeniden açma yetkili + gerekçeli; kota aşım onayı auditlenir.

**Kabul senaryosu.** Destek akışının 6 adımı sırayla geçiliyor, atlama reddediliyor; kapanan kayıt gerekçeyle yeniden açılabiliyor; kapatılan talebin süresi kotadan düşüyor.

**Geri dönüş.** Bilgi bankası yeni ekran; kota düşümü `GV.flags.quotaDeduction`.

**Bağımlılık.** P1-01, P1-06. ⛔ AS-2.5, AS-3.1.

---

# FAZ 4 — Raporlama ve kişisel çalışma alanı ([21.0.5], §14, §15)

## P4-01 · ReportRegistry ve ortak kolon/format API'si ([14.0.1]–[14.5.5], [16.2.16], [20.5])

**Sorun.** Ortak rapor kabuğu şartnamenin ima ettiği kadar eksik değil: `ui.js:2347-2537` içinde ~190 satırlık gerçek bir `GV.report(config)` var ve **8 rapor sayfasının hepsi** onu kullanıyor. Yani [14.0.1]'in "tek bileşen" yarısı VAR, "rapor kayıt şeması" yarısı hiç yok — `report_id`/`formula_version` repoda yalnız görev metinlerinde geçiyor.

**Kopya kod kabukta değil, kabuğun üstünde**: 7 sayfa toplam ~3.060 satırlık prelude yazıyor ve içinde `colMoney/colNum/colPct/colDate/colDurum/colKisi/mny/num/sub/faint/linkCell/mRow/tbl/bos` kolon+format fabrikaları her sayfada yeniden tanımlanıyor (finans'ta `app-rapor-finans.html:76-190` = 115 satır). Kabaca **800–1.000 satır silinebilir kopya**, `ui.js`'ye taşınacak ~250 satır ortak API karşılığında. Ayrıca kod kendi kopyasını belgeliyor: `app-rapor-finans.html:280` "app-butce.html ile birebir aynı formüller", `:1999` "formül app-destek-paket.html ile birebir aynıdır".

Ölçülebilir tek format ihlali: para ve sayı doğru sağa hizalı, ama şartnamenin ortalanmasını istediği **tarih ([14.2.5]) ve durum ([14.2.6]) 7 sayfanın hiçbirinde ortalanmıyor** — `cellClass:'center'` sayısı sıfır. "Nasıl hesaplandı?" ([14.1.7]) yok; KPI `meta` yalnız ~40/420'de (personel raporunda 0).

**Hedef davranış.** `DB.reportRegistry` (105 rapor kaydı, 13 metadata alanı). `GV.report`'a ortak kolon fabrikaları eklenir; 7 sayfanın prelude'ları silinir. Metodoloji paneli + alt bilgi. Hizalama düzeltmesi. Kopya metrik sorguları tek domain servisine bağlanır.

**Değişecek dosyalar.** `assets/js/ui.js` (+~250 satır), 8 `app-rapor-*.html` (−~900 satır), `assets/css/ui.css`, `misc.js` (registry).

**Veri düzeltme.** Yok — hesaplama kaynağı değişiyor, veri değil. Ama `app-butce.html` ve `app-destek-paket.html` ile paylaşılan formüller `GV.fin`/`GV.destek`'e taşınırken sonuçlar birebir karşılaştırılmalı.

**Yetki ve audit.** Rapor `permissions` alanı registry'den gelir. Export girişimleri auditlenir ([14.4.8]).

**Kabul senaryosu.** Şartname [20.5.1]–[20.5.3]: satış, proje ve finans raporu aynı kabuktan açılıyor, aynı filtreler uygulanıyor, kolon/hizalama/KPI açıklaması/drill-down ortak. `cellClass:'center'` sayısı tarih ve durum kolonlarında 0'dan tam sayıya çıkıyor.

**Geri dönüş.** Sayfa başına taşıma ayrı commit; her sayfanın prelude'u tek commit'te silinir, `git revert` ile geri gelir.

**Bağımlılık.** ⚠️ AS-2.10, AS-2.11, AS-6.6.

## P4-02 · Gerçek export servisi ([14.4.1]–[14.4.8], [14.6.1]–[14.6.6])

**Sorun.** Export dört seçenek gösteriyor ama **ikisi sahte**: "Excel" tab ayraçlı `.xls` metin dosyası (`ui.js:1575-1583`), "PDF" yazdırma penceresi (`ui.js:1555-1571`). CSV'de BOM ve tırnaklama var ama **formül enjeksiyonu koruması yok** (`=`/`+`/`-`/`@` ilk karakter). PDF'de A4 yönü, tekrarlanan tablo başlığı, sayfa numarası ve filigran yok. Sıralama export'a taşınmıyor; "Tüm kayıtlar" seçimi ek izin istemiyor.

**Hedef davranış.** Prototip payı: CSV formül enjeksiyonu koruması, yazdırma CSS'i (sayfa kırılması + `thead` tekrarı), export'a sıralama ve formül sürümü metadata'sı, "Tüm kayıtlar" için ek onay. Backend payı: gerçek XLSX/PDF üretimi, arka plan job, süreli indirme bağlantısı.

**Değişecek dosyalar.** `assets/js/ui.js` (export bloğu), `assets/css/shell.css` (print CSS).

**Veri düzeltme.** Yok.

**Yetki ve audit.** "Tüm kayıtlar" ayrı izin; export girişimi auditlenir.

**Kabul senaryosu.** [14.6.1]: ekran ve CSV aynı kayıt kümesini ve toplamları veriyor. `=cmd` ile başlayan bir hücre CSV'de zararsızlaştırılıyor. Yazdırma çıktısında tablo başlığı her sayfada tekrar ediyor.

**Geri dönüş.** Export bloğu izole.

**Not.** XLSX ve PDF şartname anlamında gerçek biçim olmadan **"tamamlandı" sayılmaz** ([22.0.11]). Prototip payı bittiğinde bu açıkça kısmi yazılır.

## P4-03 · Notlarım modülü ([15.0]–[15.5], [16.2.17], [19.0.13], [20.4.5]–[20.4.7])

**Sorun.** Modül kodda **hiç yok**: dosya, menü girdisi, veri koleksiyonu, "Çalışma Alanım" dizgesi — hepsi sıfır. 38 maddenin tamamı YOK.

**Hedef davranış.** `app-notlarim.html` (liste: Tümü/Açık/Bugün/Yaklaşan/Tamamlanan/Arşiv) + `app-not-form.html` (Not / Kontrol Listesi / Plan / Özet bölümleri, P2-01'in `CreateEditPage` kabuğuyla). `DB.personalNotes` + `DB.personalNoteChecklistItems`. Prototipte owner filtresi oturum kullanıcısına bağlanır ve **kurumsal arama/rapor/export/audit yüzeylerinden dışlanır**.

**Değişecek dosyalar.** Yeni `app-notlarim.html`, `app-not-form.html`, yeni `assets/data/notes.js`, `shell.js` (menü + "Çalışma Alanım" bölümü), `ui.js` (genel arama dışlaması), `domain.js` (`GV.notes`).

**Veri düzeltme.** Yeni koleksiyon; mevcut veriye dokunmaz.

**Yetki ve audit.** **En sıkı yetki paketi.** Owner-only; `GV.perm` rol matrisinden bağımsız — superadmin dahil hiçbir rol okuyamaz. Audit yalnız olay metadata'sı tutar, not içeriği **hiçbir loga yazılmaz** ([15.4.6]).

**Kabul senaryosu.** P1-09'da yazılan `tasks/qa/notes-isolation.js` altı senaryosu yeşile döner: B kullanıcısı ve superadmin içeriği listede/detayda/aramada/export'ta/bildirimde göremiyor; not metni audit, log ve genel arama indeksinde yer almıyor.

**Geri dönüş.** Yeni modül; menüden kaldırmak yeterli.

**Bağımlılık.** P2-01 (form kabuğu), P1-09 (testler). ⛔ AS-4.1, AS-4.2. ⚠️ AS-4.3, AS-4.4.

**Backend payı (kritik).** [15.4.1]–[15.4.3] sunucu tarafı `owner_user_id` kapsamı, body'den kabul etmeme, başkasının ID'sinde 404. **Prototipte owner filtresi istemcide olduğu için gerçek izolasyon sağlanamaz** — bu, modül canlıya çıkmadan önce kapatılması zorunlu bir açık olarak kaydedilmeli.

---

# FAZ 5 — Portallar ve ileri entegrasyon ([21.0.6], §16.2–16.3 kalanı)

Bu fazın tamamı büyük ölçüde backend gerektiriyor. Prototip payı sınırlı.

## P5-01 · Müşteri portalı kapsam genişletmesi ([7.4.6], [16.2.12])
Bugün portal `shell.js:259` ile `panel/proje/destek/dokuman/ayarlar` ile sınırlı ve yalnız okuma. Şartname teklif/sözleşme/teslimat **onayı** ve fatura görüntülemesi istiyor. Prototip payı: kapsam genişletme + onay ekranları. Backend payı: gerçek dış kimlik doğrulama.

## P5-02 · Otomasyon kural editörü ([12.4.1]–[12.4.3], [16.2.13])
12 alt yetenekten 0'ı var; `app-ayar-otomasyon.html:227` "çalışma günlüğü tutulmuyor" diyor. **AS-6.4** motordan önce mi sonra mı sorusunu bekliyor.

## P5-03 · Entegrasyon detay/ayar sayfaları ve senkron logları ([13.0.1]–[13.0.12], [16.2.14])
9 maddesi tam YOK. Ayrıca [2.0.12] kapsamında: var olmayan yeteneği anlatan üç metin ya doğrulanmalı ya kaldırılmalı (P2-03'te ele alınıyor).

## P5-04 · Release/deployment yönetimi ([9.2.4], [16.2.10])
Kavram hiçbir yerde yok; hata↔release bağı bu olmadan kurulamıyor.

## P5-05 · Lisans/abonelik varlığı ([11.4.3], [16.3.2], [10.3.6])
**AS-1.12** ayrı varlık mı sorusunu bekliyor.

## P5-06 · Tedarikçi portalı, API anahtarı/webhook yönetimi, zamanlanmış rapor dağıtımı ([16.3.3]–[16.3.5])
Tamamı backend.

---

# Özet tablo

| Faz | Paket | Kapsadığı madde (yaklaşık) | Blokaj |
|---|---|---:|---|
| 0 | P0-00 Faz 0 çıktıları | 1 | — |
| 1 | P1-01 Geçiş motoru | 13 | AS-1.1…1.9 |
| 1 | P1-02 Ortak eylem penceresi | 9 | — |
| 1 | P1-03 Onay motoru | 13 | AS-2.12, 2.13 |
| 1 | P1-04 Yetki + tek audit defteri | 10 | AS-5.1 |
| 1 | P1-05 Finansal kanonik kaynak | 12 | **AS-2.1, 2.2** |
| 1 | P1-06 İş takvimi / SLA | 8 | **AS-3.1, 3.2** |
| 1 | P1-07 Veri kalitesi sayfası | 13 | — |
| 1 | P1-08 Entegrasyon hata kuyruğu | 4 | — |
| 1 | P1-09 Notlarım test ağı | 7 | — |
| 2 | P2-01 CreateEditPage | 12 | AS-6.2, 6.3 |
| 2 | P2-02 Kayıt sonrası detay | 1 | — |
| 2 | P2-03 Demo temizliği | 2 | — |
| 3 | P3-01 Satış zinciri | 26 | AS-1.3, 5.2 |
| 3 | P3-02 Sözleşme + plan + milestone | 24 | **AS-1.2, 2.6** |
| 3 | P3-03 Kalite zinciri | 30 | **AS-1.15, 2.3, 2.4** |
| 3 | P3-04 Satın alma zinciri | 27 | AS-2.12, 2.13 |
| 3 | P3-05 Tahsilat formu | 5 | P1-05 |
| 3 | P3-06 İK zinciri | 18 | AS-1.10, 1.11 |
| 3 | P3-07 Destek zinciri | 9 | **AS-2.5, 3.1** |
| 4 | P4-01 ReportRegistry | 30 | AS-2.10, 2.11, 6.6 |
| 4 | P4-02 Export servisi | 14 | — |
| 4 | P4-03 Notlarım modülü | 41 | **AS-4.1, 4.2** |
| 5 | P5-01…P5-06 | ~60 | AS-1.12, 6.4 |

Sayılar yaklaşıktır; bir madde birden çok pakete dokunabilir (ör. [2.0.1] hem P1-03 hem P1-05 kapsamında).

**Paket sayısı:** Faz 0–4'te §22'nin yedi başlığını tam taşıyan **23 paket**; Faz 5'in **6 başlığı** kasten özet düzeyinde bırakıldı — tamamı backend gerektiriyor ve prototip payı, önceki fazların kararları verilmeden yazılamaz.

**Blokaj özeti:** 23 tam paketin **11'i** ⛔ işaretli bir açık soru kararlaşmadan başlayamaz. Karar beklemeden başlanabilecek 8 paket: P0-00, P1-02, P1-07, P1-08, P1-09, P2-02, P2-03, P4-02.
