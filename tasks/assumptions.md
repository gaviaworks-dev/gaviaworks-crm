# Varsayımlar

> Bu projede CC otonom çalışır. Eksik bilgide durmaz — yazılım şirketi
> operasyonlarına uygun makul varsayım yapar ve buraya yazar.
>
> Karar önceliği: **1) PROMPT.md → 2) CLAUDE.md → 3) Sektör best practice → 4) Varsayım.**
> Aşağıdaki maddeler 1-2-3'ün sessiz kaldığı yerlerde yapılmış varsayımlardır.

| # | Konu | Varsayım | Gerekçe | Tarih |
|---|------|----------|---------|-------|
| 1 | Kapsam | İlk aşamada sadece arayüz (buildless statik prototip) | Beyar kararı | 2026-08-03 |
| 2 | Kullanıcı | 5–7 iç personel + sonradan sınırlı yetkili müşteri kullanıcıları | PROMPT.md Bölüm 3 | 2026-08-03 |

---

## V-01 · gh hesabı devri
**Durum:** Kickoff "aktif gh hesabı zaten gaviaworks-dev" diyordu; gerçekte aktif hesap
**By4r** idi (`gh auth status` çıktısı).
**Karar:** `gh auth switch --user gaviaworks-dev` ile devredildi, repo doğru hesapta açıldı,
`git remote -v` ile doğrulandı.
**Gerekçe:** Kickoff'un açık niyeti repo'nun gaviaworks-dev'de olması.

## V-02 · Marka token'ları
**Durum:** PROMPT.md §28 "GaviaCRM arayüz diliyle görsel uyum" istiyor; CLAUDE.md
"brand token cross-contamination yasak" diyor.
**Karar:** Gavia Works kurumsal kimliği (koyu lacivert + mint) ortak marka olduğu için
renk ailesi paylaşılıyor, ancak `tokens.css` **sıfırdan bu proje için** yazıldı.
GaviaCRM'in inşaat bölüm renkleri ve sektörel token'ları kopyalanmadı; kendi ölçeğimiz
kuruldu (spacing skalası referansta hiç yoktu, hardcode edilmişti).
**Gerekçe:** İki kural ancak böyle aynı anda sağlanır.

## V-03 · İkon stratejisi
**Durum:** Referans Font Awesome CDN kullanıyor; PROMPT.md ikon kaynağı belirtmiyor.
**Karar:** Inline SVG sprite (`assets/img/icons.svg`), dış bağımlılık yok.
**Gerekçe:** Best practice — CDN düşerse arayüz ikonsuz kalır; statik prototipin
offline ve uzun ömürlü çalışması gerekir.

## V-04 · Rol taşıma ve yetki
**Durum:** PROMPT.md §23 "rol bilgisi yalnızca URL parametresine güvenilerek
belirlenmemelidir" diyor; ama bu backend'siz statik bir prototip.
**Karar:** Rol `sessionStorage`'daki oturum nesnesinde tutulur; URL yalnızca ilk seçimde
okunur. Yetki kontrolü menü gizlemeye ek olarak **sayfa açılışında** da çalışır,
yetkisiz ekranda 403 durumu basılır. Sunucu tarafı kontrolün nereye geleceği teknik
dokümanda belirtilir.
**Gerekçe:** Statik prototipte gerçek oturum güvenliği kurulamaz; PROMPT.md'nin niyeti
(yetki = sadece menü gizleme değil) mimari olarak karşılanır.

## V-05 · Şirket profili ve mock veri hacmi
**Durum:** PROMPT.md 5–7 kişilik şirket diyor, fakat 28 rol ve 21 departman tanımlıyor.
**Karar:** Mock veride **12 personel** kurulur; bir personel birden fazla departman/rol
taşır (PROMPT.md §3 "departmanlar rol ve sorumluluk grupları şeklinde" ifadesine uygun).
Roller sistemde eksiksiz tanımlı, personele atanmış roller alt küme.
**Gerekçe:** 5-7 kişiyle 28 rolün tamamı doldurulamaz; sistem SaaS'a lisanslanabilir
olacağı için rol seti tam, kadro gerçekçi tutuldu.

## V-06 · Para birimi ve biçim
**Karar:** Varsayılan ₺ (TRY); teklif ve satın almada USD/EUR alanı mevcut.
Tarih `GG.AA.YYYY`, sayı `tr-TR` biçimi, tablo sayıları `tabular-nums`.
**Gerekçe:** Şirket Türkiye merkezli; PROMPT.md döviz alanı istiyor ama varsayılan belirtmiyor.

## V-07 · Mock veri tarih ekseni
**Karar:** "Bugün" = **3 Ağustos 2026**. Geciken/yaklaşan/biten tüm kayıtlar bu eksene
göre üretilir, böylece gecikme ve yenileme uyarıları gerçekten tetiklenmiş görünür.
**Gerekçe:** Sabit tarihli mock veri zamanla anlamsızlaşır; tek referans tarih ekseni
canonical veri disiplinini korur.

## V-08 · Sayfa adlandırma
**Karar:** `app-<modul>.html` (liste) · `app-<modul>-detay.html` · `app-<modul>-form.html`.
Referansın `crm-*` öneki kullanılmadı.
**Gerekçe:** İki proje karıştırılmasın; dosya adından hangi repo olduğu anlaşılsın.

## V-09 · Sohbet, Gantt, takvim gerçekliği
**Karar:** Backend olmadığı için sohbet mesajları, gantt çubukları ve takvim olayları
mock veriden render edilir; yazılan mesaj oturum içinde listeye eklenir (kalıcı değil).
**Gerekçe:** "Sahte buton bırakma" kuralı — aksiyon gerçekten bir şey yapmalı; kalıcılık
statik prototipte mümkün değil.

## V-10 · Raporlarda grafik
**Karar:** Grafikler dış kütüphane olmadan inline SVG ile çizilir (bar, line, donut,
sparkline). Her raporda KPI + grafik + **detay tablo** üçlüsü birlikte bulunur.
**Gerekçe:** Buildless kural (npm bağımlılığı yok) + PROMPT.md §29 "raporları yalnızca
grafiklerden ibaret bırakma".

## V-11 · Fazlandırma sırası
**Karar:** PROMPT.md §25 Faz 1 sırası korunur; Faz 2 ve Faz 3'ün **arayüz tarafı** da
aynı wave planı içinde tamamlanır. Faz 3 entegrasyonları (muhasebe, GitHub, e-imza, AI)
arayüz + ayar ekranı olarak kurulur, gerçek bağlantı kurulmaz.
**Gerekçe:** Kapsam "sadece arayüz"; fazlar geliştirme sırasıdır, arayüz kapsamı değil.

## V-13 · Rapor yetkisi iki eksende türetilir
**Durum:** PROMPT.md §5 "personel raporu" ve "müşteri raporu"nu ayrı yetki ekseni sayıyor;
`DB.permMatrix` yalnız genel `rapor` kapsamını tutuyor (28 rol × yeni iki kolon eklemek
matrisi şişirecekti).
**Karar:** `GV.perm.can('musteriRapor')` = rapor yetkisi **ve** Müşteriler bölümüne erişim;
`can('personelRapor')` = rapor yetkisi **ve** personel verisi kapsamı **ve** Personel bölümüne erişim.
**Sonuç:** İK personel raporunu görür müşteri raporunu görmez; satış temsilcisinde tam tersi;
tasarımcı ikisini de görmez. **Gerekçe:** "raporlayabildiğin şey, görebildiğin veridir."

## V-14 · Görev kalite puanı türetilir
**Durum:** PROMPT.md §20.3 "görev kalite sonuçları" raporu istiyor; `DB.tasks`'ta kalite puanı alanı yok.
**Karar:** Puan = `100 − 10×revizyon − 15×yeniden açılma − 15 (termin aşımı) − 10 (efor sapması >%20)`,
0–100 aralığına kırpılır. Sınıflandırma: ≥85 İyi · 60–84 Kabul edilebilir · <60 Zayıf.
**Gerekçe:** Veri uydurmak yerine mevcut alanlardan türetmek canonical veri disiplinini bozmaz;
formül ekranda görünür, gerçek sistemde kalite kaydı ayrı alan olacaktır.

## V-15 · Görevin kaynağı ilişkiden türetilir
**Durum:** "Sohbetten oluşan görev" ve "toplantıdan oluşan görev" raporları isteniyor;
`DB.tasks` kaynak alanı tutmuyor.
**Karar:** Sohbet kaynağı `DB.messages[].gorev` üzerinden, toplantı kaynağı `DB.decisions[].gorev`
üzerinden ters ilişkiyle bulunur. **Gerekçe:** İlişki zaten canonical veride var; ikinci bir
"kaynak" alanı eklemek aynı bilgiyi iki yerde tutmak olurdu (PROMPT.md §22).

## V-16 · Zamanında tamamlama oranı kapanmamış gecikmeleri de sayar
**Karar:** Oran, "termin sonucu belli olan" görevler üzerinden hesaplanır: kapananlar (zamanında/geç)
**artı** hâlâ açık ama termini aşmış olanlar.
**Gerekçe:** Yalnız kapananlara bakınca mock veride oran %100 çıkıyor ve "oranı düşüren görevler"
tablosu boş kalıyordu — rapor gerçeği göstermiyordu.

## V-12 · KVKK / hassas alan maskeleme
**Karar:** Maaş, TCKN, IBAN gibi alanlar yetkisiz rollerde `••••` maskelenir; "görüntüle"
aksiyonu aktivite log'una yazılır (alan bazlı erişim — PROMPT.md §5).
**Gerekçe:** PROMPT.md hassas alan maskelemesi istiyor, uygulama biçimini belirtmiyor.

## V-17 · Müşteri kartı sayaçları işlem verisinden türetilir
**Durum:** `DB.customers` kartındaki `bekleyenTahsilat` ve `aktifProje` değerleri elle yazılmıştı ve
`DB.invoices` / `DB.payments` / `DB.projects` toplamlarıyla çelişiyordu (rapor ekranı çelişkiyi ortaya
çıkardı — ör. MUS-2024-002 kartta 320.000, açık faturalarda 211.200).
**Karar:** `bekleyenTahsilat` = ödenmemiş faturaların KDV dahil toplamı; `aktifProje` = `DB.projects`
içinde durumu `Teslim`/`İptal` olmayan proje sayısı. Kart değerleri bu tanıma göre düzeltildi;
faturası olup tahsilat kaydı bulunmayan `FTR-2026-031` için `THS-2026-047` eklendi.
**İstisna:** `projeSayisi` **ömür boyu** proje sayısıdır — `DB.projects` yalnız güncel projeleri tutar,
bu yüzden kart değeri veri sayımından büyük olabilir (tarihsel projeler modellenmedi).
**Gerekçe:** CLAUDE.md canonical veri disiplini — aynı kayıt no her ekranda aynı değeri göstermeli.

## V-18 · Filo maliyet ölçüleri
**Karar:** Km başına maliyet = kayıtlı gider toplamı ÷ güncel kilometre (edinme bedeli hariç);
sahip olma maliyeti ayrı ölçü olarak karşılaştırma raporunda durur. Satın alma/kiralama
karşılaştırmasında satın alma bedeli sahiplik ayına yayılır, kiralıkta aylık kira edinme
maliyeti sayılır ve mükerrer sayımı önlemek için "Kira" gider kalemi işletme maliyetinden düşülür.
`kmSiniri` **yıllık** kabul edilip sözleşme yılı sayısıyla çarpılır (formül kolonda görünür).
**Gerekçe:** PROMPT.md §16 "kilometre başına maliyet" istiyor ama tanımı vermiyor; iki maliyet
ekseni (edinme / işletme) karıştırılırsa rapor yanıltıcı olur.

## V-19 · "Bakımı geciken" tanımı
**Karar:** Plan tarihi geçmiş **veya** plan kilometresi aşılmış açık bakım kayıtları,
**artı** servise girmiş ama kapanmamış kayıtlar.
**Gerekçe:** Yalnız tarih eşiğine bakan katı tanımla mock veride rapor tamamen boş kalıyordu;
§16 bakımı hem tarih hem kilometre eşiğine bağlıyor.

## V-20 · Proje sağlık puanı türetilir
**Karar:** 100'den başlar; bütçe aşım yüzdesi (−30'a kadar), süre sapma yüzdesi (−20), termin gecikmesi
gün/2 (−25), açık kritik+yüksek hata ×5 (−15), geciken milestone ×5 (−10), kayıtlı risk ×3 (−9) düşülür.
Kayıttaki `saglik` alanı ayrı kolon olarak yanında durur — türetilen puan onu ezmez, yanına konur.
**Plan ilerlemesi** başlangıç→planlanan bitiş arasında doğrusal kabul edilir; "plana göre fark" =
gerçek ilerleme − plan ilerlemesi. **Gerekçe:** PROMPT.md §11 proje sağlığı istiyor, formülünü vermiyor;
tek bir elle yazılmış etiket yerine ölçülebilir bileşenler gösterilir.

## V-21 · Rapor ekranlarında arşiv gizlemesi kapalı
**Karar:** Rapor detay tablolarında `archive:false` — arşivlenmiş kayıtlar (ör. PRJ-2025-008,
GRV-2026-124) raporlara dahildir.
**Gerekçe:** Rapor geçmiş analizi yapar; arşivi gizlemek KPI ile tablo sayısını çelişkiye düşürüyordu.
Liste ekranlarında arşiv toggle'ı normal davranışını korur.

## V-22 · Ayarlar bölümü ekran ekran yetkilendirilir
**Durum:** `SEC_BY_ROLE` bölüm bazlıydı; Ayarlar tek parça olduğu için çoğu rol **kendi profiline**
ve bildirim tercihlerine erişemiyordu (profil ekranı bunu ortaya çıkardı).
**Karar:** `ayarlar` bölümü tüm rollere açıldı; `shell.js` içine `SCREEN_PERM` haritası eklendi.
Haritadaki ekranlar (şirket, departmanlar, kullanıcılar, roller, yetki matrisi, onay akışları,
otomasyon, entegrasyon, log, arşiv) yalnız belirtilen rollere açık; haritada olmayan ekran
(profil, bildirim tercihleri) bölüm erişimi olan herkese açık. Menü de aynı listeye göre süzülür.
**Gerekçe:** PROMPT.md §5 yetkiyi "modül görüntüleme" değil **kayıt ve ekran** düzeyinde tanımlıyor;
bölüm bazlı tek kapı bu ayrımı taşıyamıyordu.

## V-23 · `onayAdim` bulunulan adımdır, onay sayısı değil
**Durum:** Onay akışları ekranı `SAT-2026-014` (adım 2/3, zincirde 1 onay) ve `SAT-2026-015`
(adım 1/2, zincirde 0 onay) için çelişki bildirdi.
**Bulgu:** Çelişki yok — `onayAdim` **o an beklenen adımın sırasıdır** (`onaylanan + 1`), toplam
onay sayısı değil. İki kayıt da bu tanımla tutarlı.
**Gerçek eksik:** Kapanmış talepler (`SAT-2026-011/012/013` — Sipariş verildi / Teslim alındı)
`onayAdim:2/2` gösteriyor ama `DB.purchaseApprovals`'ta **hiç zincir kaydı yok**; onay geçmişi
yalnız açık talepler için modellenmiş.
**Karar:** Sayaç düzeltilmedi (doğru). Kapanmış taleplerin zincir geçmişi **eksik veri** olarak
kaydedildi; satın alma detay ekranı yazılırken `DB.purchaseApprovals`'a bu üç talebin tamamlanmış
adımları eklenecek. Ekran şu an takılma noktasını sayaçtan değil **gerçek zincirden** okuyor ve
farkı kullanıcıya bildiriyor.

## V-24 · Sözleşme bedeli KDV HARİÇ tutulur (VB-01 kapandı)
**Karar (Beyar tarafından verildi, tüm veriye uygulandı):**
`DB.contracts[].tutar` = sözleşme bedeli, **KDV hariç (net)** — tek eksen budur.
KDV ayrı alanda (`kdvOran`, `kdv`), ekranda gösterilen brüt bedel `toplam = tutar + kdv`.
Ödeme planı taksitleri (`DB.milestones[].odeme`) **net** tutardan türetilir.
**Türetme sonucu:** Yedi sözleşmenin `tutar` değeri **zaten net eksendeydi** — bozuk olan
taksit türetimiydi. `DB.projects[].sozlesmeTutari` her sözleşmede `tutar` ile birebir aynı
olduğu için proje tarafında sıfır sapma oluştu; sözleşme tutarlarına hiç dokunulmadı.
KDV oranı yedi sözleşmede de %20 varsayıldı (mevcut faturaların vergi/tutar oranı).
**Düzeltilenler:** taksit tutarları · dört fatura (FTR-2026-025/027/028/029/030) net'e
hizalandı · beş tahsilat brüt'e hizalandı · üç müşterinin `toplamCiro`su (Marmara 980.000 →
1.104.000 · Öz Gıda 295.000 → 354.000 · Anka 530.000 → 600.000) · beş müşterinin
`bekleyenTahsilat`ı. `canon.js` eksen 9/10/11 bunu her wave sonunda doğrular.

## V-25 · Ödeme planı tam set tutulur (VB-02 kapandı)
**Karar:** Projeli her sözleşmenin taksit setinin **tamamı** `DB.milestones`'ta bulunur;
`Σ odeme = sözleşme tutarı` ve `taksit` numaraları 1..N boşluksuzdur.
9 milestone → **19 milestone** (6 sözleşme). Tamamlanmış geçmiş taksitler için 8 fatura ve
9 tahsilat kaydı eklendi. **Ölçüm:** tamamlanmış 11 taksitin 11'inin de faturası kesilmiş
durumda — `app-odemeplani` ve `app-proje-milestone`'daki "faturası kesilmemiş taksit" sekmesi
şu an **0 kayıt** gösteriyor. Bu doğru sonuçtur (uyarı yanlış alarm vermiyor) ama o akışın
gerçek veriyle bir kez sınanabilmesi için ileride bilinçli bir boşluk kaydı eklenmelidir.
**İstisna:** `SZL-2026-022` (Deniz Lojistik yıllık bakım) proje bazlı değildir — taksitleri
milestone olarak değil **aylık fatura** olarak yürür, milestone tutmaz.

## V-26 · Teklif puanı ile tedarikçi puanı ayrı eksenlerdir (VB-03 kapandı)
**Karar:** `DB.supplierQuotes[].puan` = **teklif değerlendirme puanı** (yalnız o teklif: fiyat,
teslim, garanti, ödeme, teknik uygunluk). `DB.suppliers[].puan` = **tedarikçi genel performans
puanı** (tüm sipariş geçmişi: teslim zamanlaması, kalite, destek, ödeme uyumu).
Aynı tedarikçinin iki teklifi farklı teklif puanı alabilir. İkisi aynı hücrede gösterilmez.
Sözleşme `ops.js` → `DB.suppliers` başlığında ve `components.md` §9c'de yazılıdır.
Ekran etiketleri ayrıştırıldı: `app-satinalma-teklif.html` matrisinde iki ayrı satır,
`app-tedarikci.html` yalnız "Tedarikçi genel puanı".

## V-27 · `DB.sprints[].gorevSayisi` gerçek sayaçtır, modellenmiş görev sayısı değildir
**Durum:** Sprint ekranı çelişki bildirdi — `gorevSayisi` toplamı 60 ama `DB.tasks` içinde
`sprint` alanı dolu yalnız 12 görev var (toplam 25 görev kaydı).
**Karar:** Çelişki değil, **bilinçli kapsam istisnası.** `DB.tasks` prototipte tüm görev
evrenini değil 25 temsili görevi tutar; `gorevSayisi` sprintin gerçek görev sayısıdır.
`projeSayisi` ile aynı ailedendir (L-08'in yazılı istisnası).
**Kural:** `gorevSayisi >= o sprinte bağlı DB.tasks kaydı` — `canon.js` eksen 12 doğrular.
Ekranlar iki sayıyı aynı kolonda göstermez; modellenmiş kayıt "kayıtlı görev" diye ayrı
etiketlenir. Görev evreni genişletilirse bu istisna kalkar.

## V-28 · Destek dönüşüm bağının adı `destek`, `talep` değil (VB-05)
**Sorun:** `DB.changeRequests[].talep` alanı **zaten vardı** ve başka bir ekseni tutuyordu —
talebi açan taraf (`'Müşteri'` | `'İç ekip'`). Aynı ada destek talebi kodu yazmak, tek alanda
iki konvansiyon demek olurdu (ders L-13 doğrudan bunu yasaklıyor).
**Karar:** Destek talebi bağının adı projenin her yerinde **`destek`**tir:
`DB.tasks[].destek` · `DB.bugs[].destek` · `DB.changeRequests[].destek`. Bağ **doğan kaydın**
üstünde tutulur, talepte ayna alan yoktur; dönüşümler `X.filter(r => r.destek === kod)` ile okunur.

## V-29 · Hata ↔ görev bağı tek yönlüdür — `DB.tasks[].hata` açılmadı
**Durum:** `ui-debt.md` VB-05 "`DB.tasks[].hata` hiçbir kayıtta yazılı değil" diyordu; ölçüldü,
ters yön **zaten yazılıydı**: `DB.bugs[].gorev = 'GRV-2026-101'`.
**Karar:** Ayna alan **açılmadı**. İki yönlü bağ zamanla ayrışır ve hangisinin doğru olduğu
belirsizleşir; tek kaynak `DB.bugs[].gorev`'dir. `canon.js` eksen 15 `DB.tasks[].hata`
alanının **doğmadığını** ayrıca kontrol eder — kural yazıyla değil taramayla korunur.
**Yan düzeltme:** Bağ yazılı olduğu için şiddet→etki eşlemesi ihlali ölçülebilir hâle geldi ve
düzeltildi: `HTA-2026-071` şiddet `Kritik` iken `GRV-2026-101` etkisi `Yüksek`ti, `Çok yüksek` oldu.

## V-30 · Bağsız bırakılan kayıtlar — uydurulmadı, gerekçesi burada
**Kural:** Bağ alanı açıldı diye her kayda bir bağ yazılmaz. Aşağıdakiler **bilinçli olarak boş**:

| Kayıt | Neden bağsız |
|---|---|
| `DST-2026-119` → hata | "Test ortamında bildirimler gelmiyor" ile `HTA-2026-073` "Bildirim zamanı yanlış saat diliminde" **farklı belirtiler**; hata talepten iki gün **önce** ve başka bir kişi tarafından bulundu. Aynı olay olabilir ama kanıt yok |
| `DST-2026-120` → görev / değişiklik | Ücretli geliştirme talebi, durumu "Müşteri bekleniyor" — ek teklif onayı bekliyor. Karşılık gelen görev ya da değişiklik talebi henüz **doğmadı**; `PRJ-2025-008` için kayıt yok |
| `DST-2026-117` · `121` · `123` → hiçbiri | Bilgi talebi ve kullanım sorusu kategorileri kayıt doğurmaz |
| `HTA-2026-076` → test | `TST-2026-021` ile aynı gün ve aynı modül, ama koşumu **EMP-009** yaptı, hatayı **EMP-016** buldu. Tarih+modül yakınlığı bağ değildir |
| `TST-2026-019` · `TST-2026-021` → hata | İkisinin de başarısız senaryosu var (2 ve 3) ama karşılık gelen hata kaydı veride yok. Her düşen senaryo hata kaydı doğurmak zorunda değildir; sözleşme `bağlı hata ≤ basarisiz` |
| `TST-2026-020` · `TST-2026-022` → sprint | Koşum tarihleri (2026-07-26 ve 2026-08-20) **hiçbir** sprint aralığına düşmüyor. En yakın sprinte yuvarlamak tarihten türetme olurdu |
| `SIP-2026-007` · `SIP-2026-009` → demirbaş | Biri OpenAI API kredi paketi, diğeri ofis sarf malzemesi — ikisi de envanter kaydı doğurmaz. `DMB-2025-010` (AWS hesabı) aynı tedarikçiden ama **2025-01-01 alımı**, bu siparişten gelmiyor |
| 2024–2025 demirbaşları → sipariş | Sipariş kayıtları 2026'dan başlıyor; eski alımların sipariş karşılığı prototipte modellenmedi |
| `TSL-2026-032` → modül | `PRJ-2026-004`'ün modül kırılımı veride yok; kapsam boş dizi, proje ekseninde okunur |

## V-31 · Teslim ve koşum kapsamı `moduller` **dizisidir**, tekil `modul` değil
**Karar:** `ui-debt.md` VB-08 `DB.tests[].modul` (tekil) yazıyordu. Ölçüldü: `TST-2026-018`
mobil regresyon koşumu **üç modülü birden** tarıyor (açtığı üç hata MOD-001/002/003'te).
Tekil alan bu koşumu temsil edemezdi. Alan `moduller` **dizisi** olarak açıldı; aynı gerekçeyle
`DB.deliveries[].moduller` de dizidir. Boş dizi "kapsam bilinmiyor" değil, **"projenin modül
kırılımı yok, kapsam proje ekseninde"** demektir.

## V-32 · `DB.bugs[].sprint` = hatanın **ele alındığı** sprint
**Karar:** Alan iki türlü okunabilirdi (açıldığı sprint / düzeltildiği sprint). Tek eksen seçildi:
**ele alındığı** sprint. Kapanmış hatada düzeltmenin yapıldığı, açık hatada içinde bulunulan sprint.
Bu seçim `HTA-2026-075` ile zorunlu oldu: hata 2026-07-18'de bulundu, o tarih **hiçbir** sprint
aralığında değil; 2026-07-24'te `SPR-2026-020` içinde çözüldü. "Açıldığı sprint" ekseni bu kaydı
bağsız bırakırdı. Eksen `work.js` → `DB.bugs` başlığında yazılıdır.

## V-33 · Yeni demirbaş kayıtları — `SIP-2026-008` karşılığı (VB-07)
**Karar:** `SAT-2026-012` (3 adet ergonomik sandalye) → `SIP-2026-008` 2026-07-30'da "Tam"
teslim kontrolüyle kapanmıştı ama envanter karşılığı **yoktu**. Üç demirbaş eklendi:
`DMB-2026-013/014/015`, kategori "Ofis mobilyası", tedarikçi TDR-005.
**Para ekseni ölçüldü ve yazıldı:** `alisFiyati` **NET**tir — 3 × 9.500 = 28.500 = siparişin
`tutar` alanı (brüt 34.200 **değil**). `canon.js` eksen 15 bu toplamı her turda doğrular.
İkisi zimmetli (EMP-011, EMP-012), biri depoda — üç sandalyenin üçünü de zimmetlemek
zimmet sayısını gerçek dışı şişirirdi.

## V-34 · `kaynak` DAİMA `DB.refTypes` kümesindendir ve yönlendirenle çelişmez
**Olay:** İki form ajanı bağımsız olarak aynı çelişkiyi bildirdi ve ölçüldü: 9 kayıt
(3 lead + 6 müşteri) `kaynak:'Referans'` taşıyordu ama **`'Referans'` `DB.refTypes`'ta yoktu**.
Sonuç görünmez bir veri kaybıydı: `app-lead.html` ve `app-musteri.html` kaynak filtreleri
`options:DB.refTypes` kullandığı için **en kalabalık kaynak grubunu hiç eşleştiremiyordu**.
Kullanıcı filtreyi uyguluyor, "bu kaynaktan kayıt yok" sonucunu alıyordu — sahte buton değil,
sessiz eksik sonuç, bu yüzden daha tehlikeli (UID-12 ile aynı aile).
**Karar (L-08: ekran değil veri düzeltilir):** `refTypes`'a 18. tür **eklenmedi** — PROMPT.md §9
17 tür tanımlar. Dokuz kaydın da `referans` alanı zaten yazılıydı ve gösterdikleri yönlendirenin
`tur` değeri geçerliydi; `kaynak` o türe hizalandı (Personel · İş ortağı · Mevcut müşteri ·
Eski müşteri). Yani `'Referans'` bir tür değil, **bağın kendisiydi** — bağ alanı `referans`tır.
**İki ek kayıt:** `REF-006` ("Linkedin Kampanyası", `tur:'Dijital reklam'`) üç kayda bağlıydı;
biri `Dijital reklam`, ikisi `Sosyal medya` diyordu. LinkedIn iki eksende de okunabilir, ama
**yönlendirenin yazılı `tur`'u tek doğru kaynaktır** — iki kayıt ona hizalandı.
**Kural:** `canon.js` **eksen 17** her turda doğrular: `kaynak ∈ DB.refTypes` · `referans` yazılı
kayıtta `kaynak === referrer.tur`. Yeni kaynak türü gerekiyorsa **önce `DB.refTypes`'a** girer.

## V-35 · `MUS-2023-012.vergiNo` bozuk dizeydi
`'6community'` — 10/11 hane vergi numarası değil, bozuk veri. Müşteri formunun doğrulaması
yakaladı (kayıt düzeltilmeden kaydedilemiyordu). Kooperatif için geçerli biçimde 10 haneli
bir numaraya çevrildi (`5320148796`). Prototip verisi olduğu için numara temsilîdir.


## V-36 · Native tarih kontrolü KORUNUYOR, yerine özel bileşen yazılmıyor
**Karar (UID-09).** `select`, `checkbox` ve `radio` tasarım sistemine alındı
(`appearance:none` + token'lı kutu, köşe, odak halkası, işaret). **Tarih alanı
alınmadı** — yalnız takvim düğmesinin ölçüsü, tıklama alanı ve tonu standartlaştırıldı.
**Gerekçe:** `input[type=date]` klavyeyle erişilebilir, yerelleştirilmiş, ekran
okuyucuya tanıdık ve mobilde işletim sisteminin kendi seçicisini açar. Prototipte
bunun yerine JS ile takvim yazmak **çalışan bir kontrolü daha zayıf bir taklitle
değiştirmek** olurdu; `gg.aa.yyyy` yer tutucusu tarayıcının yerel biçimidir ve
CSS ile değiştirilemez. Borç defterindeki "tarih alanı yamalı duruyor" şikâyetinin
ölçülebilir kısmı (ikon boyutu ve tonu) kapatıldı, kalanı **bilinçli kabul**.
**Ölçüm notu:** takvim düğmesinin biçimi çalışma zamanında **okunamaz** —
`getComputedStyle(el,'::-webkit-calendar-picker-indicator')` Chromium'da elementin
kendi stilini döndürüyor (ölçüldü: `width` = input genişliği). Bu yüzden `ctl.js`
tarih alanlarını "native" saymaz; kuralın `ui.css`'te **yazılı olduğunu** statik
olarak doğrular ve görünüm bir kez ekran görüntüsüyle teyit edilir (L-17 tuzağı).


## V-37 · Altı yetim anket kodu için GEÇMİŞ PROJE yazıldı (VB-27)
**Seçenekler tartıldı:** (a) altı anketin `ilgili` alanını var olan projelere çekmek,
(b) altı projeyi geçmiş teslim olarak veriye yazmak.
**Seçilen: (b).** Gerekçe üç ölçüme dayanıyor:
1. **Müşterilerin `projeSayisi` ömür boyu sayacı bu projeleri zaten sayıyordu** —
   MUS-2024-001 kartında 3 proje yazılıyken veride 1 kayıt vardı; MUS-2025-003 ve
   MUS-2023-012'nin hiç projesi yoktu ama sayaç 2 ve 1 diyordu. Yani eksik olan
   anket değil **proje kaydıydı**.
2. **`toplamCiro` boşluğu yeterliydi:** her müşterinin ömür boyu net cirosu ile
   sistemdeki sözleşmelerinin toplamı arasında zaten fark vardı (2.000.000 · 600.000 ·
   760.000 · 340.000 · 120.000). Yazılan bedeller bu boşluğun içinde kalır.
3. Anketleri var olan projelere çekmek **tarihleri bozardı** — anketler 2025-04 ile
   2026-06 arasına yayılıyor, mevcut projelerin teslim tarihleri tutmuyordu.

**Yazılan altı kayıt** `arsiv:true` olduğu için aktif liste, KPI ve rapor toplamlarını
etkilemez. `sozlesmeTutari` yazılıdır ama **`DB.contracts`'ta karşılığı yoktur**: sistem
öncesi işlerdir, sözleşme modülü o dönemi kapsamıyordu. Bu, VB-20'nin "sözleşmesiz
sözleşme bedeli" kaydının bilinçli ve gerekçeli halidir.

**Yan düzeltmeler (ölçümle zorunlu oldu):** `MUS-2026-011` `projeSayisi` 1→2 ve
`toplamCiro` 500.000→690.000 (pilot proje bedeli); `REF-002` `ciro` 2.080.000→2.270.000
(yönlendirenin cirosu bağlı müşterilerinin toplamından küçük olamaz — `canon.js` eksen 14).

**Yeni eksen:** `canon.js` **eksen 20** — `DB.surveys[].ilgili` gerçekten var olan bir
kaydı gösterir **ve** proje teslimi anketi teslim tarihinden sonradır. İkinci kural
yazılır yazılmaz gerçek bir hata buldu: `ANK-2026-057` 2026-07-20 tarihliydi, oysa
`PRJ-2026-004` 2026-07-22'de teslim edilmişti — anket tarihi 2026-07-26'ya çekildi.


## V-38 · §22'nin üç "eksik" bağından İKİSİ zaten vardı — ters yönde (VB-28)

**Ölçüm (11. oturum, üç bağın üçü de veriye tek tek soruldu):**

| § | Bağ | 9. oturum kaydı | 11. oturumda ölçülen |
|---|---|---|---|
| 6 | Kazanılan satış → Müşteri | "`DB.customers`'ta `lead` alanı yok" | **`DB.leads[].musteri` 4/12 dolu** — bağ var |
| 15 | Sohbet mesajı → Görev | "`DB.tasks`'ta `kanal`/`mesaj` alanı yok" | **`DB.messages[].gorev` 1/6 dolu** — bağ var |
| 24 | Satın alma → Araç | "`DB.vehicles`'ta `siparis` alanı yok" | **doğru** — alan da yoktu, örtük eşleşme de |

**Karar: §6 ve §15 için alan AÇILMADI.** Gerekçe defterin kendi kuralı: components.md §9d
"bağ **doğan/bağımlı** kaydın üstünde tutulur, hedefte **ayna alan açılmaz**". `customers.lead`
ve `tasks.kanal` tam olarak o yasak ayna alanlardır — `DB.bugs[].gorev` varken
`DB.tasks[].hata`'nın bilinçle açılmaması (**V-29**) ile birebir aynı sınıf. İki ekran bu
kararı zaten uyguluyordu: `app-lead-detay.html` dönüşümde `l.musteri = kod` yazıyor ve
satır yorumunda "müşteride ayna alan açılmaz (§9d)" diyor; `app-sohbet.html` görev
üretirken `m.gorev = kod` yazıyor. Alan açmak bu iki ekranı da çelişkiye düşürürdü.

**Ayna alanın doğmadığı artık ÖLÇÜLÜYOR:** `canon.js` **eksen 21c** `DB.tasks`'ta
`kanal`/`mesaj`, `DB.customers`'ta `lead` anahtarının doğmadığını her turda kontrol eder.
Yani karar yoruma değil, tarama eksenine bağlandı.

**`DB.leads[].musteri` iki eksen taşır — ayrım yazıldı.** 4 kaydın 2'si gerçek dönüşüm
(`asama:'Kazanıldı'` → LEAD-2026-005 → MUS-2026-011 · LEAD-2026-008 → MUS-2026-009);
kalan 2'si **mevcut müşteriden doğan fırsat**tır (LEAD-2026-002 → MUS-2025-004 müşterisi
adaydan bir yıl önce açılmış). Alanın tanımı bu yüzden "adayın **ilişkili olduğu** müşteri
kaydı"dır, "adaydan doğan müşteri" değil. §22 madde 6'nın karşılığı `asama:'Kazanıldı'`
**ile birlikte** okunan `musteri` alanıdır; canon eksen 21c kazanılan adayın gösterdiği
müşterinin **adayın talebinden sonra** açıldığını doğrular.

## V-38b · Araçlarda `siparis:null` üç kayıtta bilinçlidir

`DB.vehicles[].siparis` açıldı ve **ARC-004**'te dolu: `SIP-2025-006` (Toyota Corolla
Hybrid, net 1.680.000 = aracın `alisBedeli`i). Zincir uçtan uca yazıldı — `TDR-007`
Toyota Plaza Ankara tedarikçisi · `SAT-2025-010` satın alma talebi (üç makamlı onay,
tamamlanmış) · `SIP-2025-006` sipariş. Kalan üç araçta alan **null** ve bu uydurulmadı
(L-13): ARC-001 (2023-05-12) ve ARC-003 (2022-11-08) satın alma modülünün veri
penceresinden (2025+) önce alındı; **ARC-002 kiralıktır**, satın alma siparişi hiç doğmaz.
Üç gerekçe de `ops.js` `DB.vehicles` başlığında ve `app-arac-detay.html` ekranında
**yazılı** — satıcı adı eşleşmesi bağ gibi sunulmuyor.

`canon.js` **eksen 21b** siparişi olan aracı doğrular: sipariş gerçekten var · durumu
`Teslim alındı` · `alisBedeli` = siparişin **neti** · mülkiyet `Satın alınan` ·
`alisTarihi` ≥ sipariş tarihi. Demirbaş tarafındaki eksen 15d'nin birebir ikizidir.

## V-39 · Boş kalan iki destek bağı GERÇEK kayıtla dolduruldu (VB-28 · L-22)

`DB.tasks[].destek` **0/25** ve `DB.changeRequests[].destek` **0/4** idi — VB-05'in
kapanışını fazla iddialı yapan boşluk. Mevcut kayıtlar tarandı: **hiçbir görev ya da
değişiklik talebi var olan bir talepten sonra açılmamıştı**, yani bağ yazılacak örtük
eşleşme yoktu. Uydurmak yerine (L-13) eksik olan **kayıt** yazıldı — VB-07'nin üç
demirbaş kaydı yazarak kapanmasıyla aynı yöntem:

| Yazılan kayıt | Kaynak talep | Neden bu talep |
|---|---|---|
| `GRV-2026-126` "Randevu formu tarih seçici mobil düzeltmesi" | `DST-2026-118` (Kritik, Devam ediyor) | Talep zaten `HTA-2026-074`'ü doğurmuştu; hatanın `gorev` alanı **null**du. Zincir artık uçtan uca: talep → hata → görev, görev de kaynağını `destek` alanında taşıyor |
| `DGS-2026-016` "Sevkiyat raporuna araç filtresi eklensin" | `DST-2026-120` ("Geliştirme talebi", `ucretli:true`) | Kapsam dışı ve ücretli bir geliştirme talebi; §18'in "destek → değişiklik / ek teklif" yolunun tam karşılığı. `karar:'Ek teklif gerekiyor'` |

`GRV-2026-126.etki` **Çok yüksek** yazıldı çünkü bağlı hatanın şiddeti `Kritik` —
components.md §9 şiddet→etki eşlemesi. Bu eşleme 6. oturumda `HTA-2026-071`/`GRV-2026-101`
çiftinde ihlal çıkmıştı; yeni kayıt kurala **doğarken** uyuyor.

**Eksen yazılmadan kapatılmadı (VB-19 dersi):** `canon.js` **eksen 21** §22'nin 14 bağını
tek tek sayar ve her birinin en az bir kayıtta dolu olduğunu doğrular; rapor kaç kayıtta
dolu olduğunu **ayrıca yazar** ki defterdeki iddia ölçülebilsin (L-25 · L-19).


## V-40 · Kişi kimliği alanları KODA çevrildi, ad ikinci kez yazılmadı (VB-12 · VB-13)

**Seçenekler tartıldı:** (a) borcun önerdiği gibi **yeni alan açmak**
(`tickets.yetkili` · `interactions.kontakKod`), eskisini ad olarak bırakmak;
(b) mevcut alanı **yerinde koda çevirmek**.

**Seçilen: (b).** Gerekçe: (a) aynı kişiyi iki alanda tutardı — VB-12'nin şikâyet
ettiği kusurun ta kendisi. Ad bir kez, `DB.contacts`'ta tutulur; gösterim
`DB.contactName(kod)` üzerinden yapılır. Alan sayısı artmadı, ayrışacak ikinci
kaynak doğmadı.

**`DB.interactions[].kontak` neden `null` olabiliyor:** görüşme bir **ADAYLA**
yapıldığında (`lead` dolu) muhatap henüz müşteri yetkilisi değildir ve
`DB.contacts`'ta karşılığı yoktur. İki seçenek vardı — adaylar için `YTK-*` kaydı
açmak ya da adı adayın kendi `yetkili` alanından okumak. **İkincisi seçildi:**
aday yetkilisi için `DB.contacts` kaydı açmak, `musteri` alanı boş bir yetkili
doğururdu ve "yetkili = müşterinin yetkilisi" tanımını bozardı. Ad zaten
`DB.leads[].yetkili`'de **bir kez** yazılı; ikinci kez yazmak L-13 ihlali olurdu.
Düşüş ortak katmanda: **`DB.interactionContact(i)`** — beş ekran aynı `if`'i
yazmasın diye.

**`DB.activities[].kisi` neden `EMP-*`:** aktiviteyi yazan taraf **personeldir**;
müşteri yetkilisi de yazabilsin diye `YTK-*` kalıbı da kabul edilir ve
`GV.activity` ikisini de çözer. Oturum yoksa alan **null** kalır — `domain.js`
eskiden `'Sistem'` yazıyordu; var olmayan bir personeli varmış gibi göstermek
canon eksen 22b'nin ihlalidir, uydurma ad yerine boş bırakmak doğrudur.

**Ad benzersizliği kuralı KALDI, gerekçesi değişti.** Eskiden bağ bütünlüğü için
zorunluydu (ad = bağ). Artık bağ kodla kurulu; kural yalnız **listede iki kişinin
karışmaması** için duruyor ve form metni bunu açıkça söylüyor.

## V-41 · `DB.referrers[].kontak` yalnız ÖLÇÜLEN iki çiftte dolu

8 yönlendirenin 2'sinde bağ yazıldı: **REF-001 ≡ YTK-001** · **REF-004 ≡ YTK-014**.
Ölçüt gevşek bir benzerlik değil, **dört alanın birebir aynı olması**: ad, telefon,
e-posta, pozisyon. Kalan 6'sında alan `null` ve bu uydurulmadı — REF-002 (Ayten Berk),
REF-003, REF-005, REF-006, REF-007, REF-008 hiçbir müşteri yetkilisiyle iletişim
bilgisi paylaşmıyor; bir kısmı zaten kişi değil (REF-008 "Teknoloji Zirvesi 2026"
bir **etkinlik**). Alan altı kayıtta da **açık** yazıldı (`kontak:null`) çünkü şema
kayıttan kayda değişemez (VB-18 dersi).

`canon.js` eksen **24b** iki yönlü kilitler: bağ varsa dört alan birebir aynı olmalı;
bağ **yoksa** aynı telefon ya da e-posta ikinci bir yerde geçmemeli — yani sessiz
kopya artık imkânsız.

---

# REVİZE TURU VARSAYIMLARI (13. oturum, 2026-08-07)

## V-42 · Görev durum sözlüğü 19'dan 10'a inerken dört kayıt nereye taşındı

REVİZE 01 hedef sözlüğü 7 ana + 3 ek = 10 değer veriyor. Kalkan dokuz değerin
sekizi veride **hiç kullanılmıyordu**; dördü kullanılıyordu ve taşındı:

| Kayıt | Eski | Yeni | Gerekçe |
|---|---|---|---|
| GRV-2026-102 | `Kontrol bekliyor` | `Kontrolde` | Yeniden adlandırma — doküman sözlüğü |
| GRV-2026-107 | `Revize bekliyor` | `Revizede` | İki değer aynı durumu anlatıyordu; hedef sözlükte `Revizede` var |
| GRV-2026-117 | `Kabul bekliyor` | `Atandı` | Kabul bir ara durum değil, atamanın parçası |
| GRV-2026-123 | `Planlandı` | `Atandı` | Sorumlusu ve termini olan görev atanmıştır |

Dördü de `DB.activities`'e **eski→yeni** ile yazıldı. Taşıma bir işlemdir;
sessizce yapılırsa kullanıcı kaydının neden değiştiğini göremez.

**`beklemeNedeni` iki kayıtta dolu, ikisi de yazılı kanıttan türetildi** —
uydurulmadı: GRV-2026-105'in `engelNedeni`'nde *"Müşteri Logo API test hesabını
hâlâ açmadı"*, GRV-2026-107'nin `revizeNot`'unda *"Kapsam dışı — ek teklif
gerekiyor"* yazıyordu. Kanıtı olmayan hiçbir göreve bekleme nedeni verilmedi;
"gecikmiş görev muhtemelen bekliyordur" gibi bir çıkarım yapılmadı.

## V-43 · Onay adımının gerekip gerekmediği SAKLANMAZ, türetilir

REVİZE 02 `Kontrolde → Onay Bekliyor → Tamamlandı` ile `Kontrolde → Tamamlandı`
arasında bir ayrım istiyor ama bu ayrımı taşıyan bir alan yoktu. Yeni bir
`onayGerekli` bayrağı **açılmadı** (L-08: türetilebilen saklanmaz). Kural:

> Kontrol eden ile onaylayan **aynı kişiyse** kontrol zaten onaydır — görev
> doğrudan `Tamamlandı`ya gider. **Farklıysa** araya `Onay bekliyor` girer.

Veride bugün 26 görevin **17'sinde aynı**, **9'unda farklı**. Yani ayrım zaten
veride yazılıydı, yalnız okunmuyordu. `GV.task.onayGerekli(t)` bunu okur.

## V-44 · `DB.projects[].harcananSure` türetilebilir DEĞİLDİR — ölçüldü

REVİZE 03 "gerçekleşen süre onaylanmış timesheet kayıtlarından otomatik gelsin"
diyor. Türetmenin **kaynağı ölçüldü ve yetmiyor**:

| Kaynak | Toplam saat |
|---|---|
| `DB.projects[].harcananSure` (bugün kayıtlı) | **9.125** |
| `DB.timelogs` — onaylı **ve** projeli | **53** |
| `DB.timelogs` — tümü | 247 |
| `DB.tasks[].gercekSure` | 138,5 |
| `Σ(modül efor × ilerleme%)` | 2.289 · yalnız **5 projede** |
| `DB.sprints[].tamamlanan` | 190 |

14 projenin **9'unda tek bir zaman kaydı yok**, **9'unda modül kırılımı yok**.
Yani 9.125 saatin yaklaşık **8.900'ünü** hiçbir kayıt desteklemiyor.

**Karar.** O saatleri üretmek, olmayan bir işi olmuş göstermek olurdu (L-13) ve
"her kayıt var olan gerçek bir olaydan türetilir" kuralını çiğnerdi. Bunun
yerine, deponun **kendi sanksiyonlu kalıbı** uygulanır — `DB.sprints[].gorevSayisi`
(V-27, canon eksen 12): sprint 60 gerçek görev sayar, `DB.tasks` 25 temsili görev
tutar ve eksen `sayaç ≥ modellenen` der.

> ⚠️ **BU KARARIN "beyan olarak kalsın" YARISI GERİ ALINDI — bkz. V-45.**
> Ölçümün kendisi (8.900 saatin dayanaksız olduğu) doğrulandı ve yerinde
> duruyor; alanın **beyan olarak saklanması** kararı 2026-08-07'de kaldırıldı.
> Gerekçe: beyanın kendisi demo verisiydi ve talimat "demo verisini gerçek veri
> kabul etme" diyor. Aşağıdaki 2. ve 3. maddeler artık geçerli değildir.


## V-45 · `harcananSure` kaldırıldı; defter modül ilerlemesinden türetildi

V-44 `harcananSure`'ü "ömür boyu beyan" olarak bırakmıştı ve `canon.js`
`beyan ≥ defter` diyordu. **Bu uzlaşma 2026-08-07'de kaldırıldı.** İki gerekçe:

1. Beyanın kendisi demo verisiydi — 9.125 saatin ~8.900'ü hiçbir kayda
   dayanmıyordu. Talimat "demo verilerini gerçek veri kabul etme" diyor;
   dayanaksız bir sayıyı "beyan" adıyla saklamak onu gerçek kabul etmektir.
2. `beyan ≥ defter` ekseni hiçbir şeyi korumuyordu: beyan defterin **30 katı**
   olduğu için kural her koşulda geçiyordu — sahte yeşil (L-22'nin sınıfı).

### Ne türetildi

Türetmenin kaynağı **`DB.projectModules`**. Modül var olan bir kayıttır ve
gerçek alanlar taşır: `efor` · `ilerleme` · `sorumlu`, artı projesinden gerçek
müşteri ve gerçek tarih penceresi. Tamamlanan emek = `round(efor × ilerleme/100)`.

**Çift sayım `DB.tasks[].modul` bağıyla kesildi:** bir modülün defterde zaten
yazılı saatleri (görevlerinden gelen kayıtlar) hedeften düşüldü. Sonuç,
`canon.js` eksen 27d'de kilitli bir eşitlik:

> her modül için — `Σ defter satırı = round(efor × ilerleme / 100)`

| | Öncesi | Sonrası |
|---|---:|---:|
| `DB.timelogs` satır | 53 | **131** (78 türetilmiş) |
| Defterdeki toplam saat | 308 | **2.369** |
| Onaylı saat | 65 | **2.137** |
| Defteri olan proje | 7 / 14 | 7 / 14 |

### Ne türetilMEDİ — ve neden

Yedi arşivli projenin ve PRJ-2026-004 / PRJ-2026-007'nin **ne modül kırılımı
ne de görev kaydı** var. Bu dokuz projenin eski beyanı toplam **~5.600 saat**;
bu saatler için **tek bir kayıt bile üretilmedi**. Türetmenin kaynağı yok;
kaynaksız üretim uydurmadır (L-13).

Ekran bunu **söyler**: `GV.proje.sure()` `kapsam:false` döndürür, proje kartı
ve detayı sayı basmak yerine *"Zaman defterinde bu projeye ait kayıt yok"*
der. **"0 saat çalışıldı" ile "defterde kayıt yok" aynı şey değildir** ve
sıfır basmak ikincisini birincisi gibi gösterirdi.

### Türetilmiş kaydın onay ekseni

78 kaydın hiçbirini bir timesheet kapsamıyor (haftalık defter 2026-07-27'de
başlıyor). Kapanmış döneme ait oldukları için `onay:'Onaylandı'` yazılıdır.
Bu izin **bugüne taşınamaz**: canon eksen 27c "kapsayan timesheet'i olmayan
onaylı kayıt haftalık defterin başlangıcından ÖNCE olmalı" der — yani
timesheet'i atlayan bir onay yolu açılamaz.

### Tarih ve bölüntü

Her modülün kalan emeği proje penceresinin **aylarına eşit bölündü**; gün
modül sırasından türetilir (4·11·18·25) ki aynı kişinin paralel modülleri tek
güne yığılmasın. Eşit bölme bir varsayımdır ve `aciklama` alanında açıkça
yazılıdır (*"2026-05 ayı payı"*); tek satıra yığmak ise işin bir günde
yapıldığını söylerdi — **bunun yanlış olduğunu biliyoruz**, eşit bölmenin
yanlış olduğunu bilmiyoruz.

### Dürüst kalan iki boşluk

1. **PRJ-2026-002 yoğun görünüyor:** proje 2026-06-24'te başlıyor ama modülleri
   328 saatlik tamamlanmış emek taşıyor — ay payı 148 saate çıkıyor. Bu
   **kaynak verinin kendi yoğunluğudur**, türetmenin değil; düzeltmek modülün
   `efor`/`ilerleme` değerini değiştirmek olurdu ve ölçüm kaynağına dokunmak
   sayıyı istediğimiz yere çekmek anlamına gelirdi.
2. **Dokuz projede gerçekleşen süre gösterilemiyor.** Gerçek bir kurulumda
   zaman defteri tüm projeleri kapsar; bu, veri hacmine bağlı bir sınırdır.

## V-46 · `icMaliyetSaat` alanı AÇILMADI — iç maliyet türetilir

`revize-plan.md`'nin R04 maddesi `DB.employees[].icMaliyetSaat` alanını 16/16
doldurmayı planlıyordu. **Uygulamada alan açılmadı.** Gerekçe, planın kendi
kuralı: alanın içeriği `maas × isverenMaliyetKatsayisi ÷ aylikCalismaSaati`
formülünden **tamamen türetilebilir**, yani L-08'in tarif ettiği "türetilebilir
sayaç" sınıfına girer. Aynı turda `harcananSure` ve `gerceklesenMaliyet` tam bu
gerekçeyle kaldırılırken bir sonraki commit'te yeni bir türetilebilir sayaç
saklamak kendi kararımızla çelişirdi.

Bunun yerine `GV.hr.icMaliyet(empKod)` yordamı türetir ve **formülü de döndürür**
(`{ saat, kaynak, formul }`) — ekran sayıyı basarken nereden geldiğini de
gösterebilir.

**Planın asıl endişesi korundu:** `app-personel-form.html:146` `maas > 0` **XOR**
`saatlikUcret > 0` kuralını uyguluyor ve bu sözleşmeye **hiç dokunulmadı**;
`saatlikUcret` yine yalnız o eksende çalışan tek kişide (EMP-015) dolu.
Hesabın iki girdisi `DB.company` altında **yazılı sabittir** (VB-19):

| Sabit | Değer | Neden yazılı |
|---|---:|---|
| `isverenMaliyetKatsayisi` | 1,225 | Brüt maaş üstüne işveren SGK + işsizlik payı |
| `aylikCalismaSaati` | 176 | 22 iş günü × 8 saat (çalışma düzeni: 5 gün, 8 saat) |

`canon.js` eksen 28 üçünü birden kilitler: sabitler yerinde mi · XOR bozuldu mu ·
`icMaliyetSaat` alanı sonradan açıldı mı.

## V-47 · Dört maliyet kaleminden ikisinin bu depoda karşılığı yok

REVİZE 04 dört kalem istiyor. Ölçüm:

| Kalem | Kaynak | Bu depodaki durum |
|---|---|---|
| **Personel** | Σ(onaylı saat × iç maliyet), kadrolu | ✅ 6 projede ölçülüyor |
| **Dış kaynak** | aynı hesap, hizmet sözleşmeli personel | ⚠️ **0 ₺ — kaynak var, kayıt yok** |
| **Satın alma** | `DB.purchases[proje==kod && durum=='Teslim alındı']` | ⚠️ **tek kayıt** (SAT-2026-011 · PRJ-2026-002 · 64.000 ₺) |
| **Diğer** | — | ❌ **KAYNAK YOK** |

**Dış kaynak neden 0:** hizmet sözleşmeli tek personel EMP-015 ve onun
**projeye bağlı tek zaman kaydı yok**; tek görevi (GRV-2026-117) henüz
başlamamış, `gercekSure:0`. Başlamamış bir görevden saat türetmek uydurma
olurdu (L-13). Eksen kuruldu ve çalışıyor; **değeri veri gelince dolar.**
Bu, L-22'nin tarif ettiği durumun dürüst hâlidir: bağ yazıldı, kayıt yok —
ve kapanış kaydında "kaç kayıtta dolu" yazılıyor.

**Satın alma neden tek kayıt:** `revize-plan.md` "gerçekten proje için alınmış
kayıtlarda `proje` doldurulsun" diyordu; yedi satın alma kaydı tek tek okundu ve
**yalnız biri proje kaynaklıydı** (`butceKodu:'BTC-PRJ-002'`, gerekçesi
"Anka Finans projesi için model kullanımı") — o da **zaten doluydu**. Kalan altısı
donanım, ofis sarfı, Figma lisansı, monitör ve araç: hiçbiri bir projeye ait
değil. Plan maddesi borcu fazla tahmin etmişti (L-28'in tersi yönü); doldurulacak
bir şey çıkmadı ve **hiçbiri zorlanarak bir projeye bağlanmadı.**

**"Diğer proje giderleri" neden hesaplanmıyor:** projeye bağlı başka bir gider
koleksiyonu bu depoda yok. `DB.projectExpenses` **bilerek açılmadı** — talimat
"yeni bir finans modülü oluşturma" diyor. `DB.vehicleExpenses` araca bağlıdır,
proje ekseni taşımaz. `GV.proje.maliyet` bu kalemi her zaman `0` döndürür ve
ekran bunun bir **ölçüm değil kaynak boşluğu** olduğunu yazıyla söyler —
"0 ₺ diğer gider" demek, ölçülmemiş bir kalemi sıfır ölçülmüş gibi gösterirdi.

**Kârlılık ölçülemeyen projede HESAPLANMAZ.** İlk yazımda maliyeti sıfır olan
proje kârlılığı **%100** çıkıyordu; bu, ölçülmemişi ölçülmüş göstermenin en
pahalı hâliydi. `GV.proje.maliyet` artık `brutKar` ve `karlilikYuzde` alanlarını
`null` döndürüyor ve ekran "ölçülemiyor" diyor.
---

## V-48 · Kapanmış 7 projenin fazı UYDURULMADI — `faz:null`

**Karar:** REVİZE 05 iki ekseni ayırırken `faz:'Tamamlandı'` taşıyan 7 kaydın
**durumu** `Tamamlandı`ya taşındı, **fazı boş bırakıldı** (`faz:null`).

**Neden boş:** o 7 projenin **ne modülü, ne görevi, ne sprinti, ne teslim kaydı
var** — hangi fazda bittikleri türetilebilir bir bilgi değil. Kalan 7 projenin
taşıdığı `Faz 1` değerini oraya kopyalamak, ölçülmemiş bir şeyi ölçülmüş
göstermek olurdu (L-13). Faz alanı **zorunlu olmaktan çıkarıldı**; ekranlar boş
fazı "—" basar, `canon.js` eksen 29d ise tersini kilitler: **kapanmış projede
faz olmamalıdır**, çünkü faz yürüyen işin nerede olduğunu söyler.

**Plandan sapma — 5 kaydın fazına DOKUNULMADI.** `revize-plan.md` R05'in dördüncü
alt maddesi "durum `Geliştirme`/`Test` olan 5 kaydın **fazı** `Geliştirme`/`Test`
olsun" diyordu. Uygulanmadı: o kayıtların `faz` alanında **gerçek bir beyan**
duruyor (`Faz 1`) ve durum kelimesinin faz ekseninde zaten bir karşılığı var —
`Geliştirme → Aktif`, `Test → Kontrol / Test`. Yani kelime doğru eksene taşınmak
için fazın üstüne yazılmak zorunda değildi. Beyan edilmiş veriyi türetilmiş
veriyle ezmek, R03/R04'te kaldırdığımız "elle yazılmış sayı" hatasının tersi
yönde aynı hatasıdır.

---

## V-49 · Proje kaydında `aktif` alanı KALDIRILDI — arşiv tek eksen

**Karar:** VB-20'nin ikinci yarısı proje ucunda kapandı. 14 kaydın 14'ünde
`aktif:true` yazıyordu, yani eksen **hiç kullanılmıyordu**; buna karşılık
`GV.list` `arsiv === true || aktif === false` diyerek ikisini de arşiv sayıyor
ve iki alanın **çelişmesi mümkündü**. Alan projeden kalktı, form anahtarı ve
"Kayıt durumu" anahtarı silindi, `canon.js` eksen 29f ikinci eksenin geri
doğmasını yasakladı.

**Kapsam:** yalnız `DB.projects`. `aktif` alanı 12 personelde, 21 departmanda,
12 müşteride ve 14 yetkilide **gerçekten kullanılıyor** (pasif kayıtlar var) —
oralarda eksen anlamlıdır ve dokunulmadı. `GV.list`'in kuralı da değişmedi.

---

## V-50 · Proje milestone'u koleksiyonu 12 kayıtla açıldı — peşinat taksiti alınmadı

**Karar:** REVİZE 06 `DB.projectMilestones`'ı **iki gerçek kaynaktan** türetti:
5 kayıt `DB.deliveries`ten (teslim olayı; `sorumlu` = teslim eden), 7 kayıt
**tamamlanmış** ödeme taksitinden (`durum:'Tamamlandı'`, adı bir proje olayını
anlatan; `sorumlu` = projenin PM'i). Her kaydın `aciklama` alanı kaynağını yazar
ve `canon.js` eksen 30b bunu **zorunlu** kılar — kaynağı yazılı olmayan kayıt
uydurulmuş kayıttır.

**`MS-018 'Sözleşme peşinatı'` bilerek dışarıda bırakıldı.** Tamamlanmış bir
taksit, ama adı bir **ödeme** olayını anlatıyor, proje olayını değil. Onu almak,
R06'nın ayırdığı iki ekseni koleksiyonun ilk kaydında yeniden karıştırmak olurdu.
Süzgeç adın kendisine bakıyor (`peşinat|peşin|ödeme|taksit|bakiye`) ve karar
veride yorumla yazılı.

**8 projede milestone YOK ve bu bir eksiklik değil, ölçümdür.** O projelerin ne
teslim kaydı ne tamamlanmış taksiti var; sekmeye "kayıt yok" yazmak, olmayan bir
kilometre taşı uydurmaktan doğrudur (L-13 · R03'ün `kapsam:false` deseni).

**Koleksiyon bölünmedi, ikinci koleksiyon açıldı.** `DB.milestones` 19 kayıtla
25+ ekranın, `GV.fin.settleInvoice` zincirinin ve üç canon ekseninin (10 · 13 ·
18) dayandığı **ödeme defteridir**; onu ikiye bölmek çalışan bir modülü
kaldırmak olurdu (talimatın sert sınırı). Bağ ödeme kaydında durur, milestone'da
ayna alan doğmaz (§9d).
