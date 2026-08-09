# Cloud Turu — Karar Kaydı (ADR)

`tasks/cloud-acik-sorular.md` içindeki ⛔ işaretli 17 blokaj sorusu bu dosyada karara bağlandı.
Sessiz varsayım yapılmadı: her karar soru, seçilen cevap, gerekçe ve geri alma yoluyla yazıldı.

**Karar ilkesi.** Finansal sonuç ve kişisel veri gruplarında şüphede kalınan yerde **daha kısıtlayıcı, daha az veri açan, daha kolay geri alınabilir** seçenek alındı. Sözlük ve akış kararlarında şartname bağlayıcı kabul edildi.

**🔸 Teyit gerekli** işareti: karar uygulandı ve geri alınabilir, ama ticari/hukuki sonucu olduğu için Yasin Bey'in onayına sunulmalı.

---

## ADR-01 · Proje durum sözlüğü şartnameye taşınır
**Soru (AS-1.1 · [5.2.1]).** `work.js:56` sözlüğünde `Başlatma Onayı` ve `Kapanış` yok; `Askıda ≠ Beklemede`, `Kontrol / Test ≠ Test/Kabul`, `Teslim Sürecinde ≠ Teslim`.
**Karar.** Şartnamenin 8 durumuna birebir geçilir. Taşıma haritası: `Planlama→Plan`, `Askıda→Beklemede`, `Kontrol / Test→Test/Kabul`, `Teslim Sürecinde→Teslim`; `Başlatma Onayı` ve `Kapanış` eklenir. `Aktif`, `Tamamlandı`, `İptal Edildi` değişmez.
**Gerekçe.** Geçiş motoru tek kanonik sözlük ister; yarı hizalama kalıcı belirsizlik üretir. Şartname [5.2.1] bağlayıcı ve adlar zaten Türkçe — çeviri kaybı yok. Taşınan her kayıt `DB.activities`'e eski→yeni ile yazılır (L-13 kuralı).
**Geri alma.** Sözlük taşıması tek commit; `git revert`. Eski adlar `DB.projectStatusLegacy` haritasında saklanır, ekranlar eski değeri okuyabilir.

## ADR-02 · Sözleşmede `Gecikti` durum olmaktan çıkar, türetilir
**Soru (AS-1.2 · [8.1.2]).** `app-sozlesme-form.html:202` yalnız 4 değer taşıyor; şartnamenin 8 adımının 6'sı yok, buna karşılık şartnamede olmayan `Gecikti` var.
**Karar.** Şartnamenin 8 durumu kurulur. `Gecikti` **silinir** ve `bitis < DB.today && durum === 'Aktif'` koşulundan türetilen bir rozete dönüşür.
**Gerekçe.** Gecikme bir olgu değil, tarihten okunan bir sonuç. Saklanan alan olarak tutmak [2.0.1]'in "türetilmiş değerler elle değiştirilemesin" ilkesini ihlal ediyor ve bugün fiilen ihlal ediyor da — kayıt gecikmiş olduğu hâlde `Aktif` kalabiliyor ya da tersi.
**Geri alma.** Rozet türetimi `GV.contract.gecikti()` tek yordamda; sözlüğe geri eklemek tek satır.

## ADR-03 · Departman talebinin durumu görev olayından türetilir
**Soru (AS-1.8 · [8.4.11]).** Görev tamamlanınca talep açık kalıyor; `GV.task.transition` talebe hiç dokunmuyor.
**Karar.** Göreve dönüşmüş talepte `durum` alanı **salt okunur** olur ve yalnız görev geçiş olayından güncellenir. Göreve dönüşmemiş talep elle yönetilmeye devam eder.
**Gerekçe.** [2.0.1] iki elle güncellenen gerçekliği yasaklıyor. Alanı tamamen kaldırmak (seçenek b) dönüşmemiş talepleri yönetilemez bırakırdı; salt-okunur yapmak hem kuralı uygular hem mevcut ekranları kırmaz.
**Geri alma.** `GV.flags.requestStatusDerived`; kapalıyken alan yeniden yazılabilir olur.

## ADR-04 · Proje kapanışı kilitlenir, istisna yönetici gerekçesiyle
**Soru (AS-1.14 · [20.2.7]).** `domain.js:865-867` kapanışın kilitlenmemesini yazılı bir tasarım kararı olarak savunuyor; şartname tersini emrediyor.
**Karar.** Kapanış **engellenir**. Ölçülebilen ve geçmeyen madde varsa `Proje.kapat` reddeder. Yalnız `sahip` ve `gm` rolleri gerekçe + neden kodu ile geçebilir; istisna auditlenir. **Ölçülemeyen** maddeler (`olculdu:false` — ör. hiç teslim kaydı olmayan proje) kilit saymaz ama yönetici gerekçesi ister.
**Gerekçe.** Şartname bağlayıcı ve [5.2.6] kapanış listesini sayıyor. Ölçülemeyen maddeyi kilit saymak, kaydı hiç olmayan eski projeleri kapatılamaz hâle getirirdi — veri yokluğunu ihlal saymak yanlış olur; ama sessizce geçirmek de bugünkü hata. Orta yol: gerekçe iste.
**Geri alma.** `domain.js:865-867` yorumu yeni kararla değiştirilir; eski davranış `GV.flags.projectCloseGate=false` ile geri gelir.

## ADR-05 · Kritik hata açıkken teslim onayı engellenir
**Soru (AS-1.15 · [20.2.5]).** `app-proje-teslim-detay.html:533` "riske atar" diyor ama hiç engellemiyor.
**Karar.** `GV.delivery.approve` açık kritik hata varsa **reddeder**. `sahip`/`gm` gerekçe + neden kodu ile geçebilir; istisna auditlenir ve teslim kaydında görünür.
**Gerekçe.** Şartname [5.2.5] hem engeli hem yönetici istisnasını açıkça yazıyor — bu, kendi metninde tanımlı bir kapı. Uyarı basıp geçirmek müşteriye karşı yanlış beyandır.
**Geri alma.** `GV.flags.deliveryBugGate`.

## ADR-06 · Bakiyeyi aşan izin onayı engellenir 🔸
**Soru (AS-2.1 · [11.1.4]).** `app-izin-detay.html:229` `Math.min(e.izinBakiye, l.gun)` — bakiyeyi aşan onaylı izin sessizce eksik düşülüyor, fark hiçbir kayda geçmiyor.
**Karar.** Bakiye yetmiyorsa **onay engellenir**. Talep taslak olarak durabilir; kullanıcı ya gün sayısını düşürür ya izni açıkça `Ücretsiz izin` türüne çevirir. Negatif bakiye üretilmez.
**Gerekçe.** Bu grupta muhafazakâr taraf, veriyi sessizce bozmayan taraftır. Bugünkü clamp bordroya giden bir sayıyı yanlışlıyor ve fark hiçbir yere yazılmıyor — üç seçenek arasında en az veri bozan, en kolay geri alınabilir olan engellemektir. Negatife izin vermek (seçenek a) ek onay akışı gerektirir ve bu turda onay motoru yeni kuruluyor; otomatik ücretsiz izne bölmek (seçenek b) kullanıcının niyetini varsayar.
**🔸 Teyit gerekli.** İK politikası olarak avans izin (negatif bakiye) kullanılıyorsa karar (a)'ya çevrilmeli.
**Geri alma.** `GV.flags.leaveBalanceGate`; kapalıyken eski clamp yerine **negatif bakiye** yazılır — eski sessiz kayıp hiçbir hâlde geri gelmez.

## ADR-07 · Maliyet oranı satır onayında dondurulur
**Soru (AS-2.2 · [11.2.3] · [10.5.2]).** `Hr.icMaliyet` tarih parametresi almıyor; `domain.js:824` her zaman kaydına bugünkü oranı çarpıyor. Maaş değişince geçmiş proje kârlılıkları geriye dönük değişiyor.
**Karar.** `Hr.icMaliyet(kod, tarih)` imzası açılır. Zaman kaydı **satır onayında** `oranSnapshot` alanına o günkü saat maliyetini yazar; maliyet hesabı önce snapshot'a bakar, yoksa kayıt tarihine göre hesaplar, o da yoksa bugüne düşer ve bunu işaretler.
**Gerekçe.** Şartname [10.5.2] "bugünkü personel maliyetini geçmiş zamanlara uygulama, oran anlık görüntüsü veya geçerlilik aralığı kullan" diyor. Onay anı doğru dondurma noktası: onaylanmamış kayıt zaten maliyete girmiyor. Alan eklemeli olduğu için geriye uyumlu.
**Geri alma.** `oranSnapshot` yoksa eski davranışa düşülür — alan eklemek hiçbir mevcut hesabı kırmaz.

## ADR-08 · Kısmi kabul fatura tetiklemez 🔸
**Soru (AS-2.3 · [9.4.6] · [20.2.6]).** Teslim kaleminin bedeli veride yok; kısmi kabulün taksite yansıma oranı hesaplanamıyor.
**Karar.** Politika: **kısmi kabul fatura/milestone tetiklemez.** Yalnız tam kabul tetikler. Kalem bazlı `bedel` alanı şemaya eklenir ama fatura tetiklemesi için kullanılmaz; ileride politika açılırsa hazır olur.
**Gerekçe.** Şartname [9.4.6] tetiklemeyi zaten "politika izin veriyorsa" koşuluna bağlamış — yani politikanın hayır demesi uyumlu bir cevaptır. Kalem bedeli olmayan veriden fatura tutarı türetmek uydurma olurdu (kalem sayısı oranıyla bölmek, farklı büyüklükteki kalemleri eşit sayar). Finansal grupta en az risk açan seçenek.
**🔸 Teyit gerekli.** Müşteri sözleşmelerinde kısmi hakediş varsa politika açılmalı ve kalem bedelleri doldurulmalı.
**Geri alma.** `DB.deliveryPolicy.kismiKabulFatura = false` tek bayrak.

## ADR-09 · Değişiklik onayı zeyil ve plan revizyonunu TASLAK olarak üretir
**Soru (AS-2.4 · [9.3.5]).** `app-proje-degisiklik-detay.html:228` "ek teklif ve zeyilnameyle yürür" diyor ama hiçbir kayıt üretmiyor.
**Karar.** Kapsam dışı değişiklik onaylandığında **taslak** zeyil ve **taslak** ödeme planı revizyonu otomatik üretilir, ikisi de kendi onay zincirine düşer. Onaylanmadan hiçbir finansal etkileri olmaz.
**Gerekçe.** Taslak üretmenin finansal sonucu yok — sözleşme tutarı ve taksitler ancak zeyil onaylanınca değişir. Kullanıcıya söylenen ile sistemin yaptığı arasındaki boşluğu kapatıyor ve hiçbir tutarı sessizce değiştirmiyor. "Kullanıcı tetiklesin" (seçenek b) aynı boşluğu bırakırdı: kimse tetiklemezse proje bütçesi ile sözleşme ayrışır.
**Geri alma.** `GV.flags.changeAmendmentDraft`.

## ADR-10 · Bakım kotası kapanışta düşer, aşım onaya bağlanır
**Soru (AS-2.5 · [9.5.5]).** `app-destek-form.html:178` "bu form paketin `kullanilan`/`kalan` alanlarına DOKUNMAZ"; `app-destek-paket-form.html:857` negatif kalanı yasak olarak sabitlemiş.
**Karar.** Talep `Kapandı` durumuna geçtiğinde `harcananSure` kotadan düşer. `ucretli:true` talepler düşmez (ayrı faturalanır). Kotayı aşan düşüm **engellenir**; `sahip`/`gm` "Aşım Onayı" ile geçebilir, o zaman bakiye negatife düşer ve auditlenir.
**Gerekçe.** Şartname [9.5.5] hem "yalnız onaylı/faturalandırılabilir kullanımdan düşsün" hem "aşım onayı, negatif bakiye politikası tanımlansın" diyor — yani negatif yasak değil, onaya bağlı. Bugünkü mutlak yasak politikayı tanımlamak yerine yok sayıyor. Düşümün kapanışta olması, yarım kalan işin kotayı yemesini önler.
**Geri alma.** `GV.flags.quotaDeduction`; kapalıyken kota alanları bugünkü gibi elle kalır.

## ADR-11 · "Müşteri bekleniyor" SLA'yı durdurur, "Üçüncü Taraf" durdurmaz 🔸
**Soru (AS-3.1 · [9.5.4]).** SLA hesabı durumdan bağımsız; bekleme aralığı saklanmıyor. DST-2026-120 `Müşteri bekleniyor` iken `İhlal edildi` yazılı.
**Karar.** `DB.slaPolicies`'e kategori bazlı `beklemeDurdurur` bayrağı eklenir. Varsayılan: `Müşteri bekleniyor` → durdurur; `Üçüncü Taraf Bekleniyor` → **durdurmaz**. Bekleme aralıkları her hâlde `beklemeAraliklari[]` olarak saklanır.
**Gerekçe.** Müşteri kaynaklı bekleme müşterinin kendi gecikmesidir; SLA'yı işletmek haksız olur. Üçüncü taraf gecikmesi ise tedarikçi seçimi bizim sorumluluğumuzdadır — durdurmamak müşteriye karşı muhafazakâr taraftır. Aralıkların her hâlde saklanması, politika sonradan değişse bile geçmişin yeniden hesaplanabilmesini sağlar.
**🔸 Teyit gerekli.** Müşteri sözleşmelerindeki SLA maddeleri bu iki varsayılanı doğrulamalı.
**Geri alma.** Bayrak veri; politikayı değiştirmek tek alan.

## ADR-12 · İzin iş günü üzerinden hesaplanır, tatil takvimi kalıcı veri olur
**Soru (AS-3.2 · [11.1.3]).** Kod takvim günü sayıyor; `app-ayar-sirket.html:82` "Tatil listesi veri modelinde YOK … varsayımdır".
**Karar.** `DB.holidays` kalıcı koleksiyon açılır (resmî tatiller + şirket tatilleri, kaynağı kayıtta yazılı). İzin süresi **iş günü** üzerinden hesaplanır; hafta sonu ve tatil düşülmez. Yarım gün ve saatlik izin bu turda eklenmez, alan hazır bırakılır.
**Gerekçe.** Şartname [11.1.3] iş gününü açıkça sayıyor. Takvim günü saymak, cuma–pazartesi arası 4 günlük izni 4 gün bakiyeden düşüyor — çalışanın aleyhine ve yanlış. Saat bazlı tek eksene geçmek (seçenek b) tüm mevcut izin kayıtlarının yeniden hesaplanmasını gerektirirdi.
**Geri alma.** `GV.calendar` servisi bayraklı; `GV.flags.businessCalendar=false` eski takvim günü hesabına döner.

## ADR-13 · Kişisel not içeriği genel arama ve rapor yüzeyine hiç girmez
**Soru (AS-4.1 · [15.4.9]).** Şartname alan düzeyi şifrelemeyi "mümkünse" diyor; karar arama kabiliyetini belirliyor.
**Karar.** Prototip payında: notlar ayrı `DB.personalNotes` koleksiyonunda tutulur, **genel aramaya, rapora, export'a, aktivite akışına ve audit payload'ına hiç girmez**; arama yalnız Notlarım sayfası içinde ve yalnız oturum sahibinin kayıtlarında çalışır. Backend payında alan düzeyi şifreleme **zorunlu** kaydedilir.
**Gerekçe.** Kişisel veri grubunda muhafazakâr taraf, veriyi en az yüzeye açan taraftır. Buildless prototipte gerçek şifreleme yapılamaz; yapılabilir olan şey, notu paylaşılan hiçbir yüzeye bağlamamaktır. Bunu şimdi doğru kurmak, backend geldiğinde şifrelemeyi eklemeyi kolaylaştırır.
**Geri alma.** Modül ayrı dosyalarda; kaldırmak menü girdisi + iki dosya.

## ADR-14 · Silinen not 7 gün geri alınabilir
**Soru (AS-4.2 · [15.4.10]).** Geri alma süresi tanımsız.
**Karar.** Yumuşak silme + **7 gün** geri alma. Süre kullanıcıya sayfada açıkça yazılır. 7 gün sonra kalıcı silme.
**Gerekçe.** Kişisel veri grubunda kısa saklama muhafazakâr taraftır: veriyi gereğinden uzun tutmak sızıntı yüzeyini büyütür. 7 gün, yanlışlıkla silmeyi kurtarmaya yeter, arşiv niyeti taşımaz — kalıcı saklamak isteyen kullanıcı arşiv görünümünü kullanır (arşiv silinmez).
**Geri alma.** `DB.notesPolicy.geriAlmaGun = 7` tek sayı.

## ADR-15 · Tek tenant, şube ekseni açılmaz, proje kapsamı oturuma taşınır
**Soru (AS-5.1 · [6.4.1]).** `org.js:23` tek tenant; şube kavramı yok; `proje` kapsamı süzemiyor ve `ui.js:640` bunu itiraf ediyor.
**Karar.** Tek tenant korunur, şube ekseni **açılmaz**. `proje` kapsamı oturuma `GV.session.projeler[]` eklenerek çözülür ve `GV.list` satır kapsamı tüm liste ekranlarına yayılır.
**Gerekçe.** Çok kiracılılık veri modelini baştan değiştirir ve bir ürün kararıdır, teknik boşluk değil. Bugün ölçülen gerçek açık `proje` kapsamının süzmemesi — o kapatılabilir ve şartnamenin [6.4.1] listesindeki eksenlerin çalışan kısmını tamamlar. Şube alanını "ileriye dönük şema" diye açmak (seçenek c) kullanılmayan alan üretirdi.
**Geri alma.** `GV.flags.projectScope`.

## ADR-16 · Ürün adından "ERP" kaldırılır 🔸
**Soru (AS-6.1 · [10.5.5] · [1.0.4]).** `index.html:7` ve `docs/B-yonetici-ozeti.md:1` ürünü "CRM / ERP / Operasyon Yönetim Sistemi" diye adlandırıyor; [10.5.4]'ün saydığı sekiz ERP bileşeninin sıfırı mevcut.
**Karar.** Kullanıcıya görünen tüm metinlerde "ERP" ibaresi kaldırılır. Ürün adı şartname [1.0.1]'in verdiği tam ada geçirilir: **"GaviaWorks – Yazılım ve Yapay Zekâ Şirketleri İçin CRM, Proje ve Operasyon Yönetim Platformu"**, kısa ad **GaviaWorks**. Marka yazımı `Gavia Works` → `GaviaWorks` olarak birleştirilir.
**Gerekçe.** Şartname [1.0.4] bunu doğrudan yasaklıyor ve gerekçesi ticari: ERP beklentisiyle satılan bir sistem muhasebe uyumu taahhüdü doğurur. Sekiz bileşenin sıfırı varken iddiayı sürdürmek müşteriye karşı yanlış beyandır. Metin değişikliği, en kolay geri alınabilir düzeltmedir.
**🔸 Teyit gerekli.** Ticari konumlandırma kararı; mevcut tekliflerde "ERP" geçiyorsa uyumlanmalı.
**Geri alma.** Metin commit'i; `git revert`.

## ADR-17 · Form standardının kaynağı şartname metnidir, dış dosya değil
**Soru (AS-6.2 · [3.0.1]).** Şartname `crm-personel-form.html`'i bağlayıcı görsel referans ilan ediyor ama dosya bu repoda yok — harici `gaviacrm/v2` altında.
**Karar.** Bağlayıcı kaynak **şartnamenin [3.1.1]–[3.1.16] ve [3.2.1]–[3.2.7] madde metnidir**. Dış dosya repoya kopyalanmaz. `CreateEditPage` bu maddelerden üretilir ve mevcut `tokens.css`/`ui.css` görsel dili korunur.
**Gerekçe.** Şartname anatominin 23 maddesini zaten tam yazmış — ölçülebilir ve denetlenebilir bir sözleşme. Dış repodan dosya kopyalamak marka/token kirlenmesi riski taşır (`CLAUDE.md` bunu yasaklıyor) ve iki kaynak arasında yeni bir belirsizlik açar. Ayrıca ölçüm gösterdi ki mevcut `GV.form` motoru sağlam; eksik olan sekme ve sağ panel — ikisi de madde metninden kurulabilir.
**Geri alma.** Karar belge düzeyinde; uygulama `GV.form`'a eklemeli olduğu için sekme/sağ panel vermeyen form eski davranışta kalır.

## ADR-18 · Sekmeli kabuğun kapsamı bölüm sayısıyla belirlenir
**Soru (AS-6.3 · [3.1.4]).** `CreateEditPage` standardı şartnamenin saydığı 33 form tipini mi kapsıyor, repodaki tüm create/edit ekranlarını (ölçülen: **38**) mı?
**Karar.** Kapsam **repodaki 38 formun tamamıdır**, ama **sekme zorunlu değildir**: sekmeli kabuğa yalnız **4 ve daha çok bölümü olan** form taşınır. Üç ve daha az bölümlü formda `cfg.tabs` verilmez ve form düz düzeninde kalır. Kayıt sonrası detaya yönlendirme (P2-02) ise **istisnasız 38 formun tamamında** uygulanır.
**Gerekçe.** İki bölümlük bir formu üç sekmeye bölmek okunabilirliği düşürür ve şartname [3.1.4]'ün amacı olan "uzun formu gezinilebilir kılmak" hedefine ters düşer. Motor `tabs` verilmeyen formu zaten eski düzeninde bıraktığı için bu bir eksiklik değil, bilinçli bir yoldur — ve ölçüm ekseni (`tasks/qa/aftersave.js`) sekme sayısına değil yönlendirme sözleşmesine bakar, yani karar ölçümü bozmaz. 33 vs 38 sorusu böylece kapsamı daraltmadan çözülür: şartnamenin saymadığı 5 form da standardın yönlendirme yarısını alır.
**Geri alma.** Form başına `tabs` yapılandırması eklemek/çıkarmak tek satırlık iştir; karar geriye dönük uygulanabilir.

## ADR-19 · Kayıt sonrası hedefi ortak yordam seçer, form değil
**Soru (P2-02 · [3.1.16]).** 34 formda `/* location.reload() YASAK — normal akış listeye dönmektir. */` yorumu kayıt sonrası davranışı **listeye dönüş** olarak kurallaştırmıştı; şartname [3.1.16] detaya gidilmesini istiyor.
**Karar.** Yorumun `location.reload()` yasağı **yerinde kalır** (ders L-15 hâlâ geçerli). "Listeye dönmek normaldir" hükmü **tersine çevrilir**: hedefi `GV.afterSave` seçer — detay ekranı `BUILT`'te ve dosya adı ekseninde yetki varsa `detay?id=KOD`, yoksa liste. Karar 38 formda tek yordamda toplanır; hiçbir form kendi hedef mantığını yazmaz.
**Gerekçe.** Kural 38 ayrı `kaydet()` sonunda yaşarsa "detay var mı · yetki var mı" sorusuna 38 ayrı cevap verilir ve biri diğerinden sessizce ayrılır (L-23'ün aynı sınıfı). Detay ekranı olmayan 12 form için listeye dönüş **istisna olarak korunur** ve şeritte kullanıcıya dürüstçe söylenir.
**Ölçüm.** `tasks/qa/aftersave.js` (6 eksen, `--selftest` ile bozuk kopyada sınandı).
**Geri alma.** `GV.afterSave` gövdesinde `detay` yolunu kapatmak tek satırdır; formlar değişmeden eski davranışa döner.

---

## Sayım

| | |
|---|---:|
| Karara bağlanan blokaj sorusu | 19 |
| 🔸 Yasin Bey'in teyidini bekleyen | 5 (ADR-06, 08, 11, 16 ve dolaylı olarak 02) |
| Bayrakla geri alınabilir | 12 |
| Yalnız commit revert ile geri alınabilir | 7 |

⚠️ işaretli 30 soru, ilgili iş paketine gelindiğinde aynı biçimde karara bağlanıp bu dosyaya eklenir.
