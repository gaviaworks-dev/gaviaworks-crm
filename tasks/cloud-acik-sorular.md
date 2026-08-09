# Cloud Şartnamesi — Açık Sorular (KARARLIK Maddeler)

Şartname son talimatı: *"Belirsiz bir iş kuralında sessiz varsayım yapma; veri bütünlüğü, finansal sonuç, müşteri sözleşmesi, kişisel veri veya erişim kapsamını etkiliyorsa kararı açık soru/ADR olarak kaydet."*

Boşluk analizinde **50 madde** KARARLIK sınıfına düştü. Hiçbiri için varsayım yapılmadı; her biri aşağıda soru olarak duruyor. Uygulama bu kararlar verilmeden başlamamalı — özellikle **AS-2 (finansal), AS-4 (kişisel veri)** grubu.

Kaynak: `docs/P-cloud-gap-analizi.md` · Şartname: `tasks/cloud-talimati.md`

**Öncelik okuması:** ⛔ = uygulama bu karar olmadan ilerleyemez · ⚠️ = ilgili iş paketi başlamadan gerekir · ○ = ürünleşme kararı, ertelenebilir

---

## AS-1 — Veri bütünlüğü ve durum sözlükleri (17 madde)

Bu grubun ortak kökü şu: şartnamenin verdiği durum adları ile kodda yaşayan sözlükler örtüşmüyor, ve bazı yerlerde kod bilinçli olarak farklı bir model seçmiş. Her biri için "şartnameye taşı" ile "mevcut modeli koru ve eşlemeyi belgele" seçenekleri var.

### ⛔ AS-1.1 · [5.2.1] Proje durum sözlüğü
`work.js:56-57` sözlüğünde `Başlatma Onayı` ve `Kapanış` yok; `Askıda` ≠ `Beklemede`, `Kontrol / Test` ≠ `Test/Kabul`, `Teslim Sürecinde` ≠ `Teslim`. Projede geçiş tablosu hiç yok.
**Soru:** Şartnamenin 8 durumuna birebir geçilecek mi, yoksa mevcut adlar korunup eşleme mi belgelenecek?
**Seçenekler:** (a) birebir geçiş + 14 kaydın taşıma haritası + aktivite yazımı · (b) mevcut adlar korunur, şartname eşlemesi belgelenir · (c) yalnız eksik iki durum eklenir, adlar korunur.

### ⛔ AS-1.2 · [8.1.2] Sözleşme durum sözlüğü ve `Gecikti`
`app-sozlesme-form.html:202` yalnız 4 değer taşıyor (`Aktif`, `Tamamlandı`, `Gecikti`, `İptal`); şartnamenin 8 adımının 6'sı yok, buna karşılık şartnamede olmayan `Gecikti` var.
**Soru:** Bitişi geçmiş aktif sözleşme hangi durumda tutulacak?
**Seçenekler:** (a) `Gecikti` silinir, gecikme türetilmiş rozet olur (bitiş < bugün) · (b) şartname dışı ek durum olarak korunur · (c) `Askıda`ya eşlenir. Not: `app-sozlesme-detay.html` kapanış/yenileme mantığı bu değeri okuyor.

### ⚠️ AS-1.3 · [7.3.1] Teklif durum sözlüğü ve `icOnay` alanı
`app-teklif-form.html:103-104` durumları satış pipeline aşamalarıyla isim paylaşıyor; iç onay `:105` ayrı bir alan olarak paralel yaşıyor, yani tek durum makinesi kurulmamış.
**Soru:** Teklif durumu ile lead aşaması ayrı iki eksen mi kalacak; `icOnay` durum makinesine eritilecek mi?
**Seçenekler:** (a) 7 durum birebir alınır, `icOnay` kaldırılır, lead aşaması teklif durumundan türetilir · (b) iki eksen ayrı kalır, teklif şartname adlarına geçer · (c) mevcut Türkçe adlar korunur, yalnız eksik 5 durum eklenir.

### ⚠️ AS-1.4 · [8.4.1] Görevde `Kabul Edildi` durumu
`work.js:104` `Atandı → Devam ediyor` doğrudan; kabul adımı yok.
**Soru:** Yeni durum mu eklenecek, yoksa kabul bir zaman damgası alanı mı olacak?
**Seçenekler:** (a) yeni durum + geçiş tablosuna iki satır · (b) `kabulTarihi`/`kabulEden` alanı, durum sayısı sabit · (c) yalnız ret akışı eklenir, kabul zımnen `Devam ediyor` ile olur.

### ⚠️ AS-1.5 · [8.4.2] Bekleme ekseninin modeli
Kod `Beklemede`/`Blokeli`/`Müşteri Bekleniyor` üçlüsünü durum ekseninden çıkarıp ayrı `DB.taskWaitReasons` eksenine taşımış ve gerekçesini `work.js:11-18`'de yazmış. Şartname üçünü de durum sanıyor.
**Soru:** Mevcut iki eksenli model korunacak mı?
**Seçenekler:** (a) korunur, şartname raporlaması eşleme ile yapılır · (b) üçü durum sözlüğüne geri alınır (`work.js:11-18` kararı geri çevrilir) · (c) hibrit: `Blokeli` durum, diğer ikisi bekleme nedeni.

### ⚠️ AS-1.6 · [8.4.3] Revizyonun hedefi ve `İptal edildi`nin terminalliği
Revizyon `Devam ediyor`a değil `Revizede`ye düşüyor; `İptal edildi` terminal değil, `Arşivlendi`ye çıkışı var (`work.js:111`).
**Seçenekler:** (a) `Revizede` kaldırılır, revizyon `Devam ediyor` + revizyon notu üretir · (b) `Revizede` korunur, eşleme belgelenir · (c) `İptal edildi` gerçek terminal yapılır, arşiv ayrı bayrağa taşınır.

### ⚠️ AS-1.7 · [8.4.9] Departman talebi durum ekseni
`app-istalebi-form.html:103-104` akışı `durum` + `onay` iki ayrı elle seçilen eksene bölmüş; şartnamenin 6 adımının çoğu yok.
**Seçenekler:** (a) tek eksen, mevcut 6 kayıt taşınır · (b) iki eksen korunur, eksik değerler her iki sözlüğe eklenir · (c) `onay` ekseni onay motoruna devredilir, talepte tek durum kalır.

### ⛔ AS-1.8 · [8.4.11] Talep durumunun tek yetkili kaynağı
Görev tamamlanınca talep açık kalıyor — `GV.task.transition` talebe hiç dokunmuyor. Şartname [2.0.1] bunu yasaklıyor.
**Seçenekler:** (a) göreve dönüşmüş talepte `durum` salt-okunur olur, olayla güncellenir · (b) talep durumu tamamen türetilir, alan kaldırılır · (c) elle kalır ama form uyumsuzluğu doğrular ve uyarır.

### ⚠️ AS-1.9 · [5.0.2] Proje kaynağı sözlüğü
`work.js:71-72`'de **AR-GE yok**, şartnamede olmayan `Diğer` var.
**Seçenekler:** (a) `Diğer` → `AR-GE` taşıması + 14 kaydın yeniden sınıflanması · (b) `AR-GE` eklenir, `Diğer` fallback kalır · (c) sözlük şartnameye indirgenir ve `Diğer` taşıyan kayıt kalmadığı doğrulanır.

### ⚠️ AS-1.10 · [4.1.7] Çalışma takvimi ve izin bölgesinin ekseni
Şartname personel bazında zorunlu kılıyor; repoda yalnız şirket düzeyinde ve yalnız ekran state'i olarak var (`app-ayar-sirket.html:133`), personel şemasında (`org.js:196-205`) karşılığı yok.
**Seçenekler:** (a) tek şirket takvimi, personelde yalnız istisna · (b) takvim varlığı + personelde zorunlu FK · (c) şube varlığı açılıp takvim şubeye bağlanır (şube kavramı da yok, yeni model).

### ⚠️ AS-1.11 · [4.0.7] Avans kavramının sahibi
Sekme adı "İzin / Avans / Rapor" ama repoda avans ne koleksiyon ne ekran olarak var.
**Seçenekler:** (a) İK altında ayrı `DB.advances` + onay akışı · (b) finans modülünde personel karşı taraflı ödeme kaydı · (c) kapsam dışı, sekme adı "İzin / Rapor"a çekilir.

### ⚠️ AS-1.12 · [11.4.3] Lisans/abonelik ayrı varlık mı
Repo bunu demirbaş kategorisi olarak modellemiş; `app-demirbas-form.html:538` eksikleri açıkça kabul ediyor. Şartname [3.3.1] ayrı create/edit ekranı sayıyor. Anahtar/secret ayrıca erişim kapsamı sorusu doğuruyor.
**Seçenekler:** (a) ayrı `DB.licenses` + koltuk tahsisi + yenileme takvimi, secret yalnız referans · (b) demirbaş kategorisi korunur, şemaya lisans alanları eklenir · (c) satın alma/gider modülüne taşınır, envanterde yalnız görünür kalır.

### ⚠️ AS-1.13 · [9.3.6] Onaysız değişiklikte görev kilidi ve bağın yeri
`DB.tasks` ile `DB.changeRequests` arasında **hiç bağ alanı yok**; kapı kurulmadan önce bağın kendisi açılmalı.
**Seçenekler:** (a) sert red (`Atandı → Devam ediyor` reddedilir) · (b) PM rolüne gerekçeli geçiş hakkı · (c) yalnız uyarı rozeti. **Alt soru:** bağ `DB.tasks[].degisiklik` mi, `DB.changeRequests[].gorevler` mi?

### ⛔ AS-1.14 · [20.2.7] Proje kapanış kilidi — şartname mi, yazılı tasarım kararı mı?
`domain.js:865-867` kapanışın kilitlenmemesini **yazılı bir karar** olarak savunuyor: *"Kapanış ENGELLENMEZ… Doküman 'kullanıcıya sade bir checklist göster' diyor, 'kapanışı kilitle' demiyor."* Şartname tam tersini emrediyor.
**Seçenekler:** (a) sert kilit · (b) sert kilit + yalnız `sahip`/`gm` rolüne gerekçeli istisna · (c) mevcut davranış korunur, şartname maddesi revize edilir. **Alt soru:** `olculdu:false` maddeler (hiç teslim kaydı olmayan proje) kilit sayılacak mı, muaf mı?

### ⛔ AS-1.15 · [20.2.5] Kritik hata açıkken teslim engeli
`app-proje-teslim-detay.html:533-538` "riske atar" diyor ama hiç engellemiyor.
**Seçenekler:** (a) sert red · (b) gerekçe zorunlu, aktiviteye yazılır (kapanış kalıbıyla aynı) · (c) mevcut `notice` korunur.

### ⚠️ AS-1.16 · [20.2.4] Tek onay kaydının üç makamı temsil etmesi
Değişiklik talebinde iç/müşteri/ticari onay tek `DB.approvals` kaydına düşüyor; hangisinin verildiği okunamıyor.
**Seçenekler:** (a) üç ayrı onay adımı, sürümlenmiş onay motoruna bağlanır · (b) tek kayıt + `makam` alanı · (c) mevcut hâl korunur, rapor eşlemesi belgelenir.

### ○ AS-1.17 · [2.0.10] Saklama süresi ve hukuki bekletme
`app-ayar-arsiv.html:40` `SAKLAMA = 365` prototip varsayımı, kaynağı yok; `legal_hold` kavramı hiç yok.
**Seçenekler:** (a) tek global 365 gün · (b) entity başına süre tablosu (fatura 10 yıl / özlük 10 yıl / destek 2 yıl) · (c) entity başına süre + `legal_hold` bayrağı ile süre dondurma.

---

## AS-2 — Finansal sonuç (13 madde)

⛔ **Bu grubun tamamı, uygulamaya başlamadan karar bekliyor.** Yanlış varsayım geçmiş kârlılıkları, müşteri faturalarını ve bordroyu bozar.

### ⛔ AS-2.1 · [11.1.4] Negatif izin bakiyesi — **en acil**
`app-izin-detay.html:229-230` `dusen = Math.min(e.izinBakiye, l.gun)` — bakiyeyi aşan onaylı izin **sessizce eksik düşülüyor**, fark hiçbir kayda geçmiyor. `app-izin-form.html:591-592` "Kayıt engellenmez" diyor ama sonucun nereye yazıldığı belli değil.
**Soru:** Bakiyeyi aşan onaylı izin ne olacak?
**Seçenekler:** (a) negatif bakiyeye izin ver + ek onay adımı · (b) aşan kısmı otomatik "Ücretsiz izin" satırına böl · (c) bakiye yetmediğinde onayı tamamen engelle.

### ⛔ AS-2.2 · [11.2.3] Oran snapshot'ı — [10.5.2] ile aynı kök
`Hr.icMaliyet` (`domain.js:614-630`) tarih parametresi almıyor; `domain.js:824` her zaman kaydına bugünkü oranı çarpıyor. Maaş değiştiği an geçmiş proje maliyetleri ve kârlılıkları geriye dönük değişiyor.
**Soru:** Onaylı zaman kaydının maliyet/fatura oranı ne zaman dondurulacak?
**Seçenekler:** (a) satır onayında oran snapshot'ı yaz · (b) timesheet onayında haftalık snapshot · (c) snapshot yok, oran her zaman güncel (mevcut — şartname [10.5.2] bunu yasaklıyor).
**Alt soru:** Müşteri onayı ayrı bir aşama olarak eklenecek mi?

### ⛔ AS-2.3 · [9.4.6] + [20.2.6] Kısmi kabulde fatura tetikleme oranı
Teslim kaleminin bedeli veride yok; kısmi kabulün taksite yansıma oranı hesaplanamıyor.
**Seçenekler:** (a) kalem bazlı bedel alanı eklenir, fatura kalem toplamından üretilir · (b) kabul edilen kalem sayısı / toplam kalem oranıyla taksit bölünür · (c) kısmi kabul fatura tetiklemez, yalnız tam kabul tetikler.

### ⛔ AS-2.4 · [9.3.5] Kapsam dışı değişiklikte zeyil ve plan revizyonu
`app-proje-degisiklik-detay.html:228` kullanıcıya "ek teklif ve sözleşme zeyilnamesiyle yürür" diyor ama hiçbir kayıt üretmiyor — verilen söz ile sistemin yaptığı iş ayrışıyor.
**Seçenekler:** (a) onayla birlikte zeyil taslağı + revize ödeme planı taslağı otomatik üretilir, ayrı onaya düşer · (b) yalnız "zeyil oluştur" aksiyonu sunulur, kullanıcı tetikler · (c) mevcut projeksiyon korunur (şartnameye aykırı).

### ⛔ AS-2.5 · [9.5.5] Bakım kotasından düşüm
`app-destek-form.html:178-179` "bu form paketin `kullanilan`/`kalan` alanlarına DOKUNMAZ". Ayrıca `app-destek-paket-form.html:687,857` negatif kalanı **yasak** olarak sabitlemiş; şartname politikanın *tanımlanmasını* istiyor.
**Seçenekler:** (a) talep `Kapatıldı` olunca `harcananSure` düşülür, `ucretli:true` düşülmez · (b) yalnız onaylı zaman kaydından düşülür · (c) negatife izin + aşım onayı akışı · (d) mevcut yasak korunur.

### ⚠️ AS-2.6 · [5.1.7] Bir sözleşmenin birden çok projeye bölünmesi
Mevcut kod şartnamenin **tam tersini** dayatıyor: sözleşme→proje 1:1 kilitli (`app-proje-form.html:163-165`, `:527-529`).
**Seçenekler:** (a) 1:1 korunur, bölme gerekiyorsa ayrı sözleşme açılır · (b) ara "sözleşme-proje payı" koleksiyonu + `Σ pay ≤ contract.tutar` kuralı · (c) `project.sozlesme` çoğul dizi olur (ayna alan riski).

### ⚠️ AS-2.7 · [5.1.2] Satış öncesi (pre-sales) çalışmanın finansal muamelesi
`project_type=pre_sales` alanı, faturalama engeli ve ayrı maliyet merkezi yok.
**Seçenekler:** (a) alan + fatura/teklif seçicilerinde sert engel · (b) yalnız uyarı + rapor ayrımı · (c) ayrı bütçe/maliyet merkezi koleksiyonu.

### ⚠️ AS-2.8 · [7.2.4] Ön analizde iç maliyet ekseni
`crm.js:326` "iç maliyet ekseni veride hiç yoktur, o yüzden kâr marjı hesaplanamaz". Bedel alanı zaten finans yetkisine kapalı (`app-onanaliz-form.html:269`).
**Seçenekler:** (a) yalnız satış fiyatı, iç maliyet girilmez · (b) iç maliyet tutulur, yalnız `finans` rolüne açılır, kâr marjı türetilir · (c) iç maliyet `hr.js` maliyet tablosundan otomatik türetilir, elle girilmez.

### ⚠️ AS-2.9 · [7.4.4] Müşteri sağlık skoru formülü
Bugün `risk` elle seçilen alan (`app-musteri-form.html:330`), `memnuniyet` statik veri — [2.0.1] ihlali. Şartname beş sinyal sayıyor ama ağırlık ve eşik vermiyor.
**Seçenekler:** (a) beş sinyal eşit ağırlıklı 0-100, override yok · (b) finansal %60 / operasyonel %40 · (c) tek skor yerine açıklamalı sinyal rozetleri · (d) skor türetilir, yönetici gerekçeyle geçersiz kılabilir, override auditlenir.

### ⚠️ AS-2.10 · [14.2.4] Para gösteriminde ISO kod ve kur kaynağı
`ui.js:82-86` `Fmt.money` yalnız `₺` basıyor.
**Seçenekler:** (a) tek para birimi (TRY) sabit, ISO kodu görünür · (b) çoklu, TCMB günlük kuru, kur tarihi hücrede · (c) çoklu, sözleşme kuru saklanır, rapor orijinal + çevrilmiş iki kolon.

### ⚠️ AS-2.11 · [14.3.5] Karışık para birimli rapor toplamı
**Seçenekler:** (a) toplam gösterilmez, para birimi başına alt toplam · (b) tek para birimine çevrilir, kur tarihi dipnotta · (c) çevirim yalnız kullanıcı açıkça seçerse.

### ⚠️ AS-2.12 · [2.0.8] SoD politikası kapsamı
16 kişilik bir şirkette tam görevler ayrılığı uygulanamayabilir. Kodda yalnız `domain.js:220` görev kontrolEden≠onaylayan var.
**Seçenekler:** (a) SoD kapalı, yalnız log · (b) talep eden ≠ onaylayan zorunlu, gerisi serbest · (c) tam matris (talep/onay/ödeme/mutabakat 4 ayrı kişi).

### ⚠️ AS-2.13 · [6.3.6] Kendi kendini onaylama ve aynı kişinin zincirde yinelenmesi
`app-ayar-onay.html:113` `rolTasiyan` ilk eşleşeni alıyor; aynı kişi iki makamı birden taşıyabiliyor, politika yazılı değil.
**Seçenekler:** (a) otomatik atla (16 kişide pratik) · (b) engelle ve vekile düşür · (c) izin ver ama audit'e "yinelenen onaycı" işareti bas.

---

## AS-3 — Müşteri sözleşmesi ve SLA (5 madde)

### ⛔ AS-3.1 · [9.5.4] "Müşteri bekleniyor" SLA'yı durdurur mu, hangi kapsamda?
Bugün `app-destek-detay.html:155-170` durumdan bağımsız hesap yapıyor; bekleme aralığı alanı yok. DST-2026-120 `Müşteri bekleniyor` iken `İhlal edildi` yazılı — geriye dönük veri düzeltmesi de bu karara bağlı.
**Seçenekler:** (a) `DB.slaPolicies`'e kategori bazlı `beklemeDurdurur` bayrağı · (b) `DB.supportPackages`'e paket bazlı bayrak · (c) şirket ayarında tek anahtar. Her durumda `DB.tickets`'e `beklemeAraliklari[]` gerekiyor.

### ⛔ AS-3.2 · [11.1.3] İzin gün hesabının tabanı
Kod takvim günü sayıyor (`app-izin-form.html:359-361`) ve tatil listesi kalıcı veri değil (`app-ayar-sirket.html:82-83` "veri modelinde YOK … varsayımdır").
**Seçenekler:** (a) iş günü + kalıcı resmî/şirket tatil takvimi · (b) saat bazlı tek eksen, gün gösterimi türetilir · (c) takvim günü korunur, iş günü yalnız raporda hesaplanır.

### ⚠️ AS-3.3 · [8.4.8] Görevde SLA/takvim duraklatma
Bekleme aralığı (başlangıç/bitiş) saklanmıyor; duraklatma politikası yok.
**Seçenekler:** (a) `beklemeBaslangic`/`beklemeBitis` çiftleri ayrı olay kaydında, SLA'dan düşülür · (b) süre saklanır ama düşülmez, yalnız raporlanır · (c) yalnız `Müşteri` nedeni durdurur.

### ⚠️ AS-3.4 · [6.1.5] E-imza kapsamı
Geçiş sözleşmesi e-imza istiyor; hangi geçişlerin gerektirdiği tanımsız, kodda hiç karşılığı yok.
**Seçenekler:** (a) yalnız sözleşme imzası + teslim kabulü · (b) + eşik üstü satın alma onayı · (c) kapsam dışı, ıslak imza taraması yeterli.

### ⚠️ AS-3.5 · [7.3.7] Kayıp tekliften sonra açık işlerin kapanma politikası
Teklif `Kaybedildi` olduğunda hiçbir yan etki yok; lead tarafında yalnız `kayipNedeni` zorunluluğu var.
**Seçenekler:** (a) hiçbiri otomatik kapanmaz, uyarı gösterilir · (b) lead otomatik `Kaybedildi`ye taşınır, açık görevler iptal edilir · (c) aynı lead'e bağlı başka açık teklif yoksa lead kapanır · (d) kapatma önerilir, kullanıcı onayı istenir.

---

## AS-4 — Kişisel veri (5 madde)

⛔ **Notlarım modülü yazılmadan önce bu beşi kararlaşmalı.** Şartname [15.4.*] owner-only modelini "değişmez temel" ilan ediyor; aşağıdakiler o temelin parametreleri.

### ⛔ AS-4.1 · [15.4.9] Not gövdesi alan düzeyinde şifrelenecek mi?
Şartname "mümkünse" diyor; karar arama ve sıralama kabiliyetini doğrudan belirliyor.
**Seçenekler:** (a) yalnız at-rest disk şifrelemesi, arama çalışır · (b) alan düzeyi şifreleme, arama yok · (c) alan düzeyi şifreleme + istemci tarafı arama indeksi.

### ⛔ AS-4.2 · [15.4.10] Silinen notun geri alma süresi
**Seçenekler:** (a) 30 gün, sonra hard delete · (b) 7 gün, sonra hard delete · (c) sınırsız arşiv, kullanıcı manuel siler.

### ⚠️ AS-4.3 · [15.4.11] Notu kurumsal göreve dönüştürme ilk sürümde olacak mı?
**Seçenekler:** (a) hiç eklenmez (şartnamenin varsayılanı) · (b) eklenir, uyarı+onay ile, kaynak not bağı hiç saklanmaz · (c) eklenir, bağ saklanır ama yalnız sahibine görünür.

### ⚠️ AS-4.4 · [15.2.7] Taslak otomatik kaydetme nerede saklanacak?
Yerel kopya sızıntısı riski taşıyor.
**Seçenekler:** (a) hiç uygulanmaz · (b) yalnız sunucuda, şifreli, oturuma bağlı · (c) localStorage'da ama oturum kapanınca temizlenir.

### ○ AS-4.5 · [15.3.4] Son checklist maddesi işaretlenince not otomatik tamamlansın mı?
**Seçenekler:** (a) kapalı, kullanıcı ayarıyla açılır · (b) açık, geri alınabilir · (c) tenant düzeyinde sabit politika.

---

## AS-5 — Erişim kapsamı (3 madde)

### ⛔ AS-5.1 · [6.4.1] Tenant/şube ekseni ve `proje` kapsamı
`org.js:23` `tenant:'gaviaworks'` tek değer; şube kavramı hiç yok; `proje` kapsamı süzemiyor ve `ui.js:640` bunu itiraf ediyor. Satır kapsamı 137 ekranın yalnız 14'ünde, alan maskesi 3 ekranda.
**Seçenekler:** (a) tek tenant, şube yok, `proje` kapsamı oturuma proje kodu dizisi eklenerek çözülür · (b) çok tenant + şube ekseni tam kurulur (veri modeli baştan değişir) · (c) tek tenant, şube alanı ileriye dönük şema olarak açılır.

### ⚠️ AS-5.2 · [7.1.2] Müşteriye dönüşüm için gereken lead durumu
Şartname `Qualified/Won` diyor; `crm.js:42-57` 15 aşamalı Türkçe sözlükte yalnız `Kazanıldı` terminal. Bugün 15 aşamanın 14'ünden dönüşüm serbest.
**Seçenekler:** (a) yalnız `Kazanıldı` · (b) `Sözleşme aşaması` (sıra 12) ve sonrası · (c) `İhtiyaç analizi` (sıra 4) ve sonrası · (d) sözlüğe `nitelikli:true/false` bayrağı eklenip dönüşüm ona bağlanır. **Alt soru:** yönetici istisnasını hangi rol kullanabilir?

### ⚠️ AS-5.3 · [8.4.5] Sorumluluk modeli
`sorumlu`+`yardimci`+`izleyiciler` var ama "önerilen" ile "gerçek" sorumlu ayrımı yok; talepteki öneri göreve taşınmıyor.
**Seçenekler:** (a) `onerilenSorumlu` + `sorumlu` iki alan · (b) tek sorumlu + `yardimci` mevcut hâliyle "tek aktif sorumlu modeli" olarak ilan edilir · (c) çoklu sorumlu dizisi + birincil işaret.

---

## AS-6 — Kapsam, konumlandırma ve tasarım kaynağı (7 madde)

### ⛔ AS-6.1 · [10.5.5] "ERP" iddiası
`index.html:7` ve `docs/B-yonetici-ozeti.md:1` ürünü "CRM / ERP / Operasyon Yönetim Sistemi" diye adlandırıyor. [10.5.4]'ün saydığı sekiz ERP bileşeninin **sıfırı** mevcut. Şartname [1.0.4] bunu doğrudan yasaklıyor.
**Kategori:** müşteri sözleşmesi — ERP beklentisiyle satılan bir sistem muhasebe uyumu taahhüdü doğurur.
**Seçenekler:** (a) "ERP" kaldırılır, ürün "CRM ve Operasyon Yönetimi" olarak konumlanır (iki dosyada metin) · (b) "ERP" kalır, kapsam dışı bileşenleri sayan açık sınır notu eklenir · (c) "ERP" kalır ve sekiz bileşen backend fazına sözleşmesel kapsam olarak yazılır.

### ⛔ AS-6.2 · [3.0.1] Bağlayıcı form referansı doğrulanamıyor
Şartname `crm-personel-form.html`'i bağlayıcı görsel referans ilan ediyor ama dosya bu repoda yok — harici `gaviaworks-dev/gaviacrm/v2` altında. Fark ölçülemiyor.
**Seçenekler:** (a) referans dosya repoya kopyalanır, birebir kıyas yapılır · (b) yalnız [3.1.*] madde metni bağlayıcı sayılır, görsel özgürlük kalır · (c) referans indirilip yeni `CreateEditPage` ondan üretilir, `GV.form` sarmalayıcıya dönüşür.

### ⚠️ AS-6.3 · [3.3.1] Standardın kapsamı 33 tip mi, tüm create/edit ekranları mı?
33 tipin 23'ünün formu var. Repoda 33'lük listede adı geçmeyen 13 form daha var (6 filo alt formu, izin, performans, komisyon, destek paketi, referans, müşteri yetkilisi/iletişimi).
**Seçenekler:** (a) yalnız 33 tip zorunlu, kalan 13 "en iyi çaba" · (b) tüm create/edit ekranları zorunlu (gerçek hedef 43+) · (c) 33 tip P0, kalanlar P1. **Alt soru:** "Test Planı/Test Senaryosu" tek form mu iki mi?

### ⚠️ AS-6.4 · [12.4.1] Otomasyon kural editörü motordan önce mi sonra mı?
`app-ayar-otomasyon.html` salt okunur; 12 alt yetenekten 0'ı var, ekranın kendi metni `:227` "çalışma günlüğü tutulmuyor" diyor.
**Seçenekler:** (a) önce UI iskeleti — [3.3.1] sayısını kapatır ama boş vaat riski taşır · (b) motor sonrası, Faz 1 ile birlikte · (c) `DB.automations`'a `kosul[]`/`eylem[]`/`calismaGecmisi[]` eklenip simülasyon prototipte gerçekten çalıştırılır.

### ⚠️ AS-6.5 · [18.0.3] Bağlı kayıt arşiv politikası
`app-ayar-arsiv.html:227-232` yalnız görev için arşiv öncesi durumu biliyor; 8 koleksiyonda "bilinmiyor" diyor. Entity × politika matrisi yok.
**Soru:** Müşteri arşivlendiğinde aktif projesi/faturası olan bağlı kayıtlar ne olacak?
**Seçenekler:** (a) engelle · (b) bağı koparma (FK bütünlüğü açısından yasak sayılmalı) · (c) yalnız görünümden çıkar · (d) birlikte arşivle. Entity başına ayrı seçilmeli.

### ○ AS-6.6 · [14.1.8] Rapor grafiği hangi durumda hak edilir?
Bugün 105/105 raporda grafik var; "sırf görsel olsun diye ekleme" ölçütü tanımsız.
**Seçenekler:** (a) zaman serisi veya ≥3 kategorili kırılım varsa · (b) rapor başına `chart:optional` bayrağı, varsayılan kapalı · (c) mevcut durum korunur, madde gevşetilir.

### ⚠️ AS-6.7 · [24.0.1] + [24.0.4] İki bağlayıcı belge ve otonom mod gerilimi
`CLAUDE.md:19` `PROMPT.md`'yi "tek doğru kaynak" ilan ediyor; bu tur `tasks/cloud-talimati.md`'yi tek doğruluk kaynağı yaptı. Ayrıca `CLAUDE.md:24` "Beyar'a soru sorulmaz, onay kapısı yoktur" diyor; şartname son talimatı belirsizlikte soru sorulmasını **emrediyor**.
**Seçenekler:** (a) `CLAUDE.md` güncellenir: cloud şartnamesi üstün kaynak, `PROMPT.md` tarihsel arşiv; otonom mod "kararlık maddeler hariç" diye daraltılır · (b) iki belge yan yana korunur, çakışmada cloud şartnamesi kazanır kuralı yazılır · (c) `PROMPT.md` kapsamı ayrı bir ürün sürümü sayılır.

---

## Sayım

| Kategori | Madde |
|---|---:|
| AS-1 Veri bütünlüğü ve durum sözlükleri | 17 |
| AS-2 Finansal sonuç | 13 |
| AS-3 Müşteri sözleşmesi ve SLA | 5 |
| AS-4 Kişisel veri | 5 |
| AS-5 Erişim kapsamı | 3 |
| AS-6 Kapsam, konumlandırma, tasarım kaynağı | 7 |
| **TOPLAM** | **50** |

⛔ işaretli, uygulama öncesi zorunlu karar: **15 madde**
