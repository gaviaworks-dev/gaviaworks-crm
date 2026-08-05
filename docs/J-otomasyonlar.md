# §26 — Bölüm J: Otomasyonlar

> **Neyden türetildi**
> Bu belge dört kaynaktan üretildi: (1) `assets/data/misc.js` içindeki `DB.automations` (22 kural),
> `DB.notifications` (12 kayıt) ve `DB.notificationChannels` (7 kanal); (2) `app-ayar-otomasyon.html` —
> 22 kuralı basan ekran ve kuralın kategori/koşul/tetikleyici-türü/son-çalışma alanlarını türeten
> fonksiyonlar ile kuru çalıştırma (`DENEME`) haritası; (3) `app-ayar-bildirim.html` — 31 bildirim tipi ×
> 7 kanal tercih matrisi, sessiz saat ve özet sıklığı modeli; (4) `app-panel-bildirimler.html` — bildirim
> merkezi. Kapsam ölçütü olarak `PROMPT.md` §21 (31 bildirim tipi + 7 kanal) ve §12 "Görev Otomasyonları"
> (15 madde) kullanıldı; kolon şeması §26-J'den alındı.
> Zaman ekseni: `DB.today = '2026-08-03'` (`assets/data/org.js:9`). Bu belgede geçen tüm gün/eşik
> hesapları bu eksene göredir.

---

## 0. Özet

| Ölçüt | Değer | Kaynak |
|---|---|---|
| Tanımlı otomasyon kuralı | **22** (`OTO-001` … `OTO-022`) | `DB.automations` |
| Aktif kural | 22 / 22 (`aktif:true`, `durum:'Aktif'`) | `DB.automations` |
| Bildirim tipi (tercih matrisi) | **31** | `app-ayar-bildirim.html` → `TYPES[]` |
| Bildirim kanalı | **7** | `DB.notificationChannels` |
| Gerçek bildirim kaydı | **12** (`BLD-9001` … `BLD-9012`) | `DB.notifications` |
| Kuralların kullandığı kanal | 2 (`Sistem içi`, `E-posta`) — diğer 5 kanal hiçbir kuralda geçmiyor | `DB.automations[].kanal` |
| §21'in 31 tipinden otomasyon kuralı olan | 14 tip (tam) + 3 tip (kısmi) | karşılaştırma → Bölüm 5 |
| Tespit edilen boşluk | **21** (17 bildirim tipi + 3 §12 görev otomasyonu + 1 eşik çelişkisi) | Bölüm 5 |

---

## 1. Ana Tablo — 22 Otomasyon Kuralı

Kolonlar §26-J şemasındadır; §26-J'de olmayan **Koşul** kolonu, ekranın `kosul()` fonksiyonunun
tetikleyici metninden çıkardığı eşiktir (uydurulmuş bir veri alanı değildir — `DB.automations` içinde
`kosul` diye bir alan yoktur).

**Kullanıcılar kolonu nasıl türetildi:** doğrudan `DB.automations[].kullanici` alanından alındı.
Bu alan serbest metindir (`'Sorumlu, yönetici'` gibi) ve `DB.roles` anahtarlarına birebir eşlenmez;
ekran bu metni virgülden bölüp (`hedefler()`) çip olarak basar ve "Hedef rol" filtresini bu listeden
kurar. Metin karşılığı olmayan hiçbir rol eklenmedi.

**Bildirim kolonu nasıl türetildi:** kanal listesi `DB.automations[].kanal` dizisinden birebir alındı.
Tip eşleşmesi, kural adının/işleminin `app-ayar-bildirim.html` içindeki 31 tip adıyla **metin olarak
örtüştüğü** durumlarda yazıldı; örtüşmeyenlere `—` konuldu (Bölüm 5'te boşluk olarak sayıldı).

| # | Otomasyon | Tetikleyici | Koşul | Yapılacak İşlem | Kullanıcılar | Bildirim | Fayda |
|---|---|---|---|---|---|---|---|
| OTO-001 | Görev atama bildirimi | Görev sorumlusu atandığında | Koşulsuz — olay anında | Sorumluya sistem içi + e-posta bildirimi gönder | Sorumlu | Sistem içi · E-posta → tip: **Yeni görev** | Görev kaçırma riskini ortadan kaldırır |
| OTO-002 | Görev kabul hatırlatması | Atamadan 24 saat sonra kabul edilmemişse | 24 saat | Sorumluya hatırlatma, 48 saatte yöneticiye eskalasyon | Sorumlu, yönetici | Sistem içi → tip: **Görev kabulü** (kısmi — tip "kabul edildiğinde"yi, kural "kabul edilmediğinde"yi anlatır) | Sahipsiz görev kalmaz |
| OTO-003 | Termin yaklaşma uyarısı | Termine 2 gün kala | 2 gün | Sorumlu ve izleyicilere bildirim | Sorumlu, izleyiciler | Sistem içi · E-posta → tip: — (§21'de görev termini için tip yok; "Yaklaşan teslim" proje tipidir) | Gecikmeleri önler |
| OTO-004 | Gecikme eskalasyonu | Termin geçtiğinde | Süre doldu | Görevi veren ve proje yöneticisine bildirim, görev listede kırmızı işaretlenir | Veren, PM | Sistem içi · E-posta → tip: **Görev gecikmesi** (`BLD-9001`) | Gecikme görünür olur |
| OTO-005 | Bağımlı görev başlatma | Öncül görev tamamlandığında | Koşulsuz — olay anında | Bağımlı görevi "Planlandı" durumuna al ve sorumluya bildir | Bağımlı görev sorumlusu | Sistem içi → tip: — | Zincirleme işler beklemede kalmaz |
| OTO-006 | Kontrol süreci başlatma | Görev "Kontrol bekliyor" olduğunda | Koşulsuz — olay anında | Kontrol eden kişiye görev ata ve bildir | Kontrol eden | Sistem içi → tip: **Kontrol bekleyen görev** | Kalite kontrolü atlanmaz |
| OTO-007 | Revizyon görevi oluşturma | Kontrol reddedildiğinde | Koşulsuz — olay anında | Revizyon görevi aç, revizyon sayacını artır | Sorumlu | Sistem içi → tip: — | Revizyon geçmişi ölçülebilir olur |
| OTO-008 | Tekrarlayan görev üretimi | Tanımlı periyot geldiğinde | Tanımlı periyot | Yeni görev kopyası oluştur ve ata | Sorumlu | Sistem içi → tip: — (yeni görev bildirimi OTO-001 üzerinden dolaylı) | Rutin işler unutulmaz |
| OTO-009 | Aşırı iş yükü uyarısı | Personel doluluğu %95 üstüne çıktığında | %95 | Yöneticiye uyarı, yeni atama önerisi | Yönetici, PM | Sistem içi → tip: — | Tükenmişlik ve gecikme önlenir |
| OTO-010 | Sohbetten görev oluşturma | Mesaj göreve dönüştürüldüğünde | Koşulsuz — olay anında | Mesaj bağlantısıyla görev aç, kanalda durum mesajı yayınla | Kanal üyeleri | Sistem içi → tip: — ("Sohbette etiketlenme" farklı bir olaydır) | Sohbette kaybolan işler kayıt altına alınır |
| OTO-011 | Toplantı kararından görev | Toplantı kararı aksiyona çevrildiğinde | Koşulsuz — olay anında | Sorumlu ve terminle görev oluştur | Karar sorumlusu | Sistem içi → tip: — | Toplantı kararları takip edilir |
| OTO-012 | Destek talebinden geliştirme görevi | Destek kaydı "Geliştirme" olarak sınıflandığında | Koşulsuz — olay anında | İlgili projede geliştirme görevi aç | PM | Sistem içi → tip: — | Müşteri talepleri backlog'a düşer |
| OTO-013 | Teklif geçerlilik uyarısı | Geçerlilik bitişine 5 gün kala | 5 gün | Satış sorumlusuna hatırlatma | Satış sorumlusu | Sistem içi · E-posta → tip: **Teklif geçerlilik süresi** (eşik çelişkisi: tercih ekranı "3 gün kala" yazıyor) | Fırsat kaybı önlenir |
| OTO-014 | İşlem yapılmayan fırsat uyarısı | Aşamada maksimum bekleme süresi aşıldığında | Süre doldu | Satış sorumlusu ve yöneticisine uyarı | Satış | Sistem içi → tip: **Uzun süredir işlem yapılmayan müşteri** | Pipeline tıkanması görünür olur |
| OTO-015 | Araç bakım/muayene/poliçe uyarısı | 60 / 30 / 15 / 7 gün kala ve süre dolduğunda | 60 / 30 / 15 / 7 gün | İdari işler sorumlusuna kademeli bildirim | İdari işler | Sistem içi · E-posta → tip: **Araç bakım tarihi**, **Muayene tarihi** (`BLD-9006`), **Trafik sigortası** (`BLD-9007`), **Kasko** | Yasal yükümlülük kaçırılmaz |
| OTO-016 | Geciken tahsilat hatırlatması | Vade geçtiğinde ve her 7 günde bir | 7 günde bir | Muhasebeye görev, müşteri sorumlusuna bildirim | Muhasebe, satış | Sistem içi · E-posta → tip: **Geciken tahsilat** (`BLD-9005`) | Nakit akışı korunur |
| OTO-017 | SLA ihlali uyarısı | SLA süresinin %75'i dolduğunda | %75 | Destek sorumlusu ve yöneticisine uyarı | Destek | Sistem içi → tip: **SLA ihlali** (`BLD-9004` — tür adı "SLA ihlali riski") | SLA ihlali önlenir |
| OTO-018 | Eksik zaman kaydı uyarısı | Haftalık 40 saatin altında kayıt varsa (Cuma 17:00) | 40 saat | Personele hatırlatma | Personel | Sistem içi → tip: **Eksik zaman kaydı** | Timesheet eksiksiz kapanır |
| OTO-019 | Günlük yönetici özeti | Her gün 08:00 | Plan saati 08:00 | Geciken işler, onaylar, riskli müşteriler özetini gönder | Yönetim | E-posta → tip: — (özet gönderimi, tekil olay tipi değil) | Yönetim tek bakışta durumu görür |
| OTO-020 | Haftalık operasyon özeti | Her Pazartesi 08:00 | Plan saati 08:00 | Proje ilerlemesi, kapasite ve finans özeti gönder | Yönetim | E-posta → tip: — (özet gönderimi) | Haftalık planlama beslenir |
| OTO-021 | Garanti bitiş uyarısı | Demirbaş garantisi bitişine 30 gün kala | 30 gün | İdari işlere bildirim | İdari işler | Sistem içi → tip: **Garanti bitişi** | Garanti hakkı kaybedilmez |
| OTO-022 | Zimmet iade kontrolü | Personel çıkış süreci başlatıldığında | Koşulsuz — olay anında | Tüm zimmetler için iade görevi aç | İK, idari işler | Sistem içi → tip: — | Ekipman kaybı önlenir |

### 1b. Kullanıcı etiketleri ↔ `DB.roles` eşlemesi

`DB.automations[].kullanici` içinde geçen **13 farklı etiket** ve `DB.roles` karşılıkları.
Karşılığı olmayanlar "kayıt-içi rol" (kaydın kendi alanından çözülen kişi) olduğu için `DB.roles`'ta yer almaz.

| Etiket | Geçtiği kurallar | `DB.roles` karşılığı |
|---|---|---|
| Sorumlu | OTO-001, 002, 003, 007, 008 | — (kayıt-içi: `tasks[].sorumlu`) |
| Yönetici | OTO-002, 009 | `depmudur` / `operasyon` |
| İzleyiciler | OTO-003 | — (kayıt-içi izleyici listesi) |
| Veren | OTO-004 | — (kayıt-içi: görevi açan) |
| PM | OTO-004, 009, 012 | `pm` |
| Bağımlı görev sorumlusu | OTO-005 | — (kayıt-içi) |
| Kontrol eden | OTO-006 | — (kayıt-içi) |
| Kanal üyeleri | OTO-010 | — (kayıt-içi: `DB.channels` üyeleri) |
| Karar sorumlusu | OTO-011 | — (kayıt-içi: `DB.decisions[].sorumlu`) |
| Satış sorumlusu / Satış | OTO-013, 014, 016 | `satistemsilci` + `satismudur` |
| İdari işler | OTO-015, 021, 022 | `idari` |
| Muhasebe | OTO-016 | `muhasebe` |
| Destek | OTO-017 | `destek` |
| Personel | OTO-018 | tüm `kademe:3–4` roller |
| Yönetim | OTO-019, 020 | `sahip`, `genelmudur`, `operasyon` |
| İK | OTO-022 | `ik` |

---

## 2. Otomasyon Kategorileri

### 2a. Ekranın kendi kategori ekseni (`KAT` haritası, `app-ayar-otomasyon.html:40-47`)

Bu, ekranın sekmelerini ve "Kategori" filtresini besleyen **tek gerçek** kategori kaynağıdır.

| Kategori | Kural sayısı | Kurallar | Dokunulan koleksiyonlar |
|---|---|---|---|
| Görev | **11** | OTO-001 … OTO-011 | `DB.tasks`, `DB.taskDeps`, `DB.capacity`, `DB.decisions` |
| Destek | **2** | OTO-012, OTO-017 | `DB.tickets` |
| Satış | **2** | OTO-013, OTO-014 | `DB.quotes`, `DB.leads` |
| İK | **2** | OTO-018, OTO-022 | `DB.timesheets`, `DB.assignments` |
| Yönetim | **2** | OTO-019, OTO-020 | — (koleksiyon hedefi yok; özet gönderimi) |
| Filo | **1** | OTO-015 | `DB.maintenance`, `DB.inspections`, `DB.policies` |
| Finans | **1** | OTO-016 | `DB.invoices` |
| Varlık | **1** | OTO-021 | `DB.assets` |
| **Toplam** | **22** | | **14 farklı koleksiyon** |

### 2b. Görev talebindeki modül ekseni ile karşılaştırma

| İstenen modül ekseni | Karşılık gelen kural sayısı | Kurallar | Not |
|---|---|---|---|
| Görev | 11 | OTO-001 … OTO-011 | Kategorinin yarısından fazlası burada yoğunlaşmış |
| Satış | 2 | OTO-013, OTO-014 | |
| Proje | **0** | — | **Boşluk.** Proje başlangıcı / yaklaşan teslim / geciken proje için kural yok (bkz. Bölüm 5) |
| Destek / SLA | 2 | OTO-012, OTO-017 | |
| Finans / tahsilat | 1 | OTO-016 | Sözleşme yenileme kuralı yok |
| Filo / demirbaş | 2 | OTO-015 (filo), OTO-021 (demirbaş) | Ekran bunları iki ayrı kategoriye (`Filo`, `Varlık`) koyar |
| İK | 2 | OTO-018, OTO-022 | |
| Satın alma | **0** | — | **Boşluk.** Satın alma onayı / geciken sipariş için kural yok |
| (eksende olmayan) Yönetim | 2 | OTO-019, OTO-020 | Zamanlanmış özet gönderimleri |

### 2c. Kural → hedef koleksiyon matrisi

Kaynak: `app-ayar-otomasyon.html` içindeki `DENEME` haritası. "Kuru çalıştırma" bu koleksiyonu
gerçekten filtreleyip eşleşen kayıt sayısını üretir.

| Kural | Hedef koleksiyon(lar) | Eşleşme ölçütü |
|---|---|---|
| OTO-001 | `DB.tasks` | `sorumlu` dolu **ve** `durum ∈ {Atandı, Kabul bekliyor}` |
| OTO-002 | `DB.tasks` | `durum === 'Kabul bekliyor'` |
| OTO-003 | `DB.tasks` | `0 ≤ termin−bugün ≤ 2` ve durum bitmiş değil |
| OTO-004 | `DB.tasks` | `termin < bugün` ve durum bitmiş değil |
| OTO-005 | `DB.taskDeps` + `DB.tasks` | öncül görevin `durum === 'Tamamlandı'` |
| OTO-006 | `DB.tasks` | `durum === 'Kontrol bekliyor'` |
| OTO-007 | `DB.tasks` | `durum ∈ {Revize bekliyor, Revizede}` |
| OTO-008 | `DB.tasks` | `tur === 'Tekrarlayan görev'` |
| OTO-009 | `DB.capacity` | `doluluk >= 95` |
| OTO-010 | — | **sayılamıyor**: "Sohbet mesajlarında görev bağlantısı alanı tutulmuyor" |
| OTO-011 | `DB.decisions` | `gorev` alanı dolu |
| OTO-012 | `DB.tickets` | `kategori === 'Geliştirme talebi'` |
| OTO-013 | `DB.quotes` | `0 ≤ gecerlilik−bugün ≤ 5` ve durum kapanmamış |
| OTO-014 | `DB.leads` | `sonIletisim ≤ bugün−14` ve aşama kapanmamış |
| OTO-015 | `DB.maintenance` + `DB.inspections` + `DB.policies` | `kalanGun ≤ 60` |
| OTO-016 | `DB.invoices` | `vade < bugün` ve `durum !== 'Ödendi'` |
| OTO-017 | `DB.tickets` | `slaDurum !== 'Zamanında'` |
| OTO-018 | `DB.timesheets` | `eksik > 0` **veya** `toplam < 40` |
| OTO-019 | — | **sayılamıyor**: günün tamamına bakan özet |
| OTO-020 | — | **sayılamıyor**: haftanın tamamına bakan özet |
| OTO-021 | `DB.assets` | `0 ≤ garantiBit−bugün ≤ 30` |
| OTO-022 | `DB.assignments` | `durum === 'Aktif'` ve `iadeTarihi` boş |

3 kural (OTO-010, 019, 020) için hedef koleksiyon tanımlı değildir; ekran bunlar için sayı üretmez,
`not` metnini gösterir.

---

## 3. Bildirim Sistemi

### 3a. 31 bildirim tipi

Kaynak: `app-ayar-bildirim.html` → `TYPES[]`. Liste `PROMPT.md` §21'deki 31 maddeyle **birebir aynı
ve aynı sırada**. Tipler 8 gruba ayrılmıştır.

| # | Grup | Bildirim tipi | Ton | Kritik | Tetiklenme notu (ekrandan) | `DB.notifications` eşleşmesi |
|---|---|---|---|---|---|---|
| 1 | Satış | Yeni müşteri adayı | ok | — | Yeni aday kaydı açıldığında | `BLD-9009` |
| 2 | Satış | Yeni referans | ok | — | Referans kaydı geldiğinde | — |
| 3 | Satış | Yaklaşan görüşme | info | — | Görüşmeye 1 saat kala | — |
| 4 | Satış | Uzun süredir işlem yapılmayan müşteri | warn | — | Aşamada bekleme süresi aşıldığında | — |
| 5 | Satış | Teklif geçerlilik süresi | warn | — | Geçerlilik bitişine 3 gün kala | — |
| 6 | Satış | Teklif onayı | ok | ✔ | Müşteri teklifi onayladığında | — |
| 7 | Projeler | Proje başlangıcı | info | — | Proje başlatıldığında | — |
| 8 | Projeler | Yaklaşan teslim | warn | — | Teslime 3 gün kala | — |
| 9 | Projeler | Geciken proje | danger | ✔ | Planlanan bitiş geçtiğinde | `BLD-9011` |
| 10 | Görevler | Yeni görev | info | — | Size görev atandığında | — |
| 11 | Görevler | Görev kabulü | info | — | Atadığınız görev kabul edildiğinde | — |
| 12 | Görevler | Görev gecikmesi | danger | ✔ | Termin geçtiğinde | `BLD-9001` |
| 13 | Görevler | Kontrol bekleyen görev | warn | — | Kontrolünüzü bekleyen teslim olduğunda | — |
| 14 | Görevler | Departmanlar arası talep | info | — | Departmanınıza iş talebi düştüğünde | `BLD-9012` |
| 15 | Görevler | Sohbette etiketlenme | info | — | Bir kanalda @ ile anıldığınızda | `BLD-9003` |
| 16 | İnsan Kaynakları | İzin talebi | info | — | Onayınıza izin talebi geldiğinde | `BLD-9010` |
| 17 | İnsan Kaynakları | Eksik zaman kaydı | warn | — | Haftalık zaman kaydı eksik kaldığında | — |
| 18 | Satın Alma | Satın alma onayı | warn | ✔ | Onayınızı bekleyen satın alma talebi | `BLD-9002` (tür adı: "Onay bekleyen işlem") |
| 19 | Satın Alma | Geciken sipariş | danger | ✔ | Termin geçtiği hâlde teslim alınmadığında | — |
| 20 | Satın Alma | Garanti bitişi | warn | — | Demirbaş garantisine 30 gün kala | — |
| 21 | Satın Alma | Lisans yenileme | warn | — | Lisans bitişine 30 gün kala | `BLD-9008` |
| 22 | Araç ve Filo | Araç bakım tarihi | warn | — | Periyodik bakım tarihine 15 gün kala | — |
| 23 | Araç ve Filo | Araç bakım kilometresi | warn | — | Bakım kilometresine 1.000 km kala | — |
| 24 | Araç ve Filo | Muayene tarihi | warn | ✔ | Muayene bitişine 60/30/15/7 gün kala | `BLD-9006` |
| 25 | Araç ve Filo | Trafik sigortası | warn | ✔ | Poliçe bitişine 30/15/7 gün kala | `BLD-9007` |
| 26 | Araç ve Filo | Kasko | warn | ✔ | Kasko poliçesi bitişine 30/15/7 gün kala | — |
| 27 | Araç ve Filo | Kiralama sözleşmesi | info | — | Kiralama sözleşmesi bitişine 30 gün kala | — |
| 28 | Araç ve Filo | Trafik cezası | danger | — | Araca ceza işlendiğinde | — |
| 29 | Finans | Geciken tahsilat | danger | ✔ | Vade geçtiğinde ve her 7 günde bir | `BLD-9005` |
| 30 | Finans | Sözleşme yenilemesi | warn | — | Sözleşme bitişine 45 gün kala | — |
| 31 | Destek | SLA ihlali | danger | ✔ | SLA süresinin %75'i dolduğunda | `BLD-9004` (tür adı: "SLA ihlali riski") |

Grup dağılımı: Satış 6 · Projeler 3 · Görevler 6 · İnsan Kaynakları 2 · Satın Alma 4 · Araç ve Filo 7 ·
Finans 2 · Destek 1 = **31**.
Ton dağılımı: `danger` 6 · `warn` 14 · `info` 8 · `ok` 3.
Varsayılan **kritik** işaretli tip: **10** (tablodaki ✔ sütunu).

### 3b. 7 kanal ve bağlılık durumu

Kanal listesi `DB.notificationChannels`'tan; bağlılık durumu `DB.integrations`'tan okunur.
Entegrasyonu bağlı olmayan kanalın matris anahtarları `disabled` basılır ve tercih yüklense bile
`false`'a zorlanır (`loadPref()` içinde `if(!c.bagli){ ST.m[t.k][c.k] = false; return; }`).

| # | Kanal | Kaynak | Durum | Anahtarlar | Açıklama (ekrandan) |
|---|---|---|---|---|---|
| 1 | Sistem içi | Yerleşik | Bağlı | Aktif | Uygulama içi bildirim merkezi ve üst bardaki zil rozeti |
| 2 | E-posta | Yerleşik | Bağlı | Aktif | Kurumsal e-posta adresinize gönderilir |
| 3 | Mobil bildirim | Yerleşik | Bağlı | Aktif | Mobil uygulamaya anlık bildirim (push) olarak düşer |
| 4 | SMS | Yerleşik | Bağlı | Aktif | Maliyeti olduğu için yalnız kritik tiplerde önerilir |
| 5 | WhatsApp | `ENT-010` WhatsApp Business | **Planlandı** | Pasif | WhatsApp Business hattı üzerinden mesaj |
| 6 | Slack | `ENT-004` Slack | **Bağlı değil** | Pasif | Bildirim seçtiğiniz Slack kanalına düşer |
| 7 | Microsoft Teams | `ENT-005` Microsoft Teams | **Bağlı değil** | Pasif | Bildirim Microsoft Teams kanalına düşer |

Sonuç: kullanılabilir kanal sayısı **4 / 7**. Matris toplam hücre sayısı `31 × 4 = 124`
(bağlı olmayan 3 kanalın `31 × 3 = 93` hücresi sayıma girmez).

### 3c. Varsayılan kanal tercihleri

`defaults()` fonksiyonunun kuralı:

| Kanal | Varsayılan açılma kuralı | Açık tip sayısı |
|---|---|---|
| Sistem içi | Her tip için açık | **31 / 31** |
| E-posta | `ton ∈ {danger, warn}` **veya** tip `Yeni müşteri adayı` / `Teklif onayı` | **22 / 31** (6 danger + 14 warn + 2 istisna) |
| Mobil bildirim | Yalnız `kritik:true` tipler | **10 / 31** |
| SMS | Hiçbir tip (maliyet gerekçesi) | **0 / 31** |
| WhatsApp · Slack · Teams | Entegrasyon bağlı değil → zorla kapalı | **0 / 31** her biri |

Varsayılanda **63 / 124** hücre açıktır.

Toplu değiştirme yolları: kolon başlığındaki sayaç düğmesi (`data-tog="col"`) bir kanalı 31 tipte
açar/kapatır; satır sonundaki düğme (`data-tog="row"`) bir tip için bağlı 4 kanalı; grup satırındaki
düğme (`data-tog="grp"`) grubun tüm tiplerini değiştirir. SMS ve WhatsApp toplu açılırken
"bu kanalın mesaj başına maliyeti vardır" uyarısı basılır.

### 3d. Sessiz saat davranışı

| Ayar | Varsayılan | Davranış |
|---|---|---|
| Sessiz saatleri uygula | Açık | Kapatılırsa her bildirim geldiği anda iletilir |
| Başlangıç | `19:00` | |
| Bitiş | `08:30` | Bitiş başlangıçtan küçükse aralık gece yarısını aşar (`a > b ? m>=a \|\| m<b : m>=a && m<b`) |
| Hafta sonu | Açık | Cumartesi ve pazar **tüm gün** sessiz sayılır |
| Kritik istisnası | 10 tip | `sessiz = inQuiet(tarih) && !kritik` — kritik tipler sessiz saati ve hafta sonunu aşar |

Önemli davranış notu: sessiz saatte bildirim **bastırılmaz**, ertelenir. Önizlemede
"Sessiz saate denk gelip ertelenen" satırında sayılır. Başlangıç ve bitiş eşitse (`a === b`) aralık
hiç uygulanmaz ve ekran uyarı toast'u basar.

### 3e. Özet sıklığı

| Seçenek | Anahtar | Davranış | Yan ayarlar |
|---|---|---|---|
| Anlık | `anlik` | Olay gerçekleştiği anda iletilir | (saat ve gün alanları pasif) |
| Günlük özet | `gunluk` | Gün içindeki bildirimler tek e-postada toplanır → kanal başına **benzersiz gün sayısı** kadar mesaj | Özet saati (varsayılan `08:30`) |
| Haftalık özet | `haftalik` | Hafta boyunca birikenler tek mesajda → kanal başına **en fazla 1** mesaj | Özet saati + gün (varsayılan `Pazartesi`) |

Kural: **Sistem içi kanal özet sıklığından muaftır** — her zaman tek tek düşer
(`p.ulasan = (ST.f === 'anlik' || c.k === 'sistem') ? p.gonderim : …`). Özet yalnız dış kanalları toplar.

Tercihler `localStorage` anahtarı **`gv.notifpref`** altında `{v:1, m, kr, q, f, s, g, tarih, kisi}`
şemasıyla saklanır. Kaydetme, `DB.logs`'a "Bildirim tercihlerini güncelledi" satırı ekler.
Tercih kişiseldir; `duzenle` yetkisi olan rol başkasının tercihini **bu ekrandan değil**, personel
kaydından yönetir (ekran bunu metinle belirtir, ilgili akış bu ekranda yoktur).

### 3f. `DB.notifications` — gerçek bildirim kayıtları

**12 kayıt**, 12 farklı tür (her türden tam 1 kayıt). Tarih aralığı `2026-07-29` … `2026-08-03`.

| Kod | Tür | Ton | Okundu | Tarih | İlgili kişi | Hedef ekran |
|---|---|---|---|---|---|---|
| BLD-9001 | Görev gecikmesi | danger | ✗ | 2026-08-02 09:00 | EMP-008 | `app-gorev-detay.html?id=GRV-2026-101` |
| BLD-9002 | Onay bekleyen işlem | warn | ✗ | 2026-08-02 08:30 | EMP-001 | `app-satinalma-detay.html?id=SAT-2026-014` |
| BLD-9003 | Sohbette etiketlenme | info | ✗ | 2026-08-03 08:40 | EMP-009 | `app-sohbet.html?k=KNL-002` |
| BLD-9004 | SLA ihlali riski | danger | ✗ | 2026-08-02 13:15 | EMP-013 | `app-destek-detay.html?id=DST-2026-118` |
| BLD-9005 | Geciken tahsilat | danger | ✗ | 2026-08-01 10:00 | EMP-012 | `app-tahsilat.html` |
| BLD-9006 | Muayene tarihi | warn | ✗ | 2026-08-01 08:00 | EMP-011 | `app-arac-muayene.html` |
| BLD-9007 | Trafik sigortası | warn | ✗ | 2026-08-01 08:00 | EMP-011 | `app-arac-sigorta.html` |
| BLD-9008 | Lisans yenileme | warn | ✔ | 2026-08-01 08:00 | EMP-012 | `app-demirbas-detay.html?id=DMB-2025-009` |
| BLD-9009 | Yeni müşteri adayı | ok | ✔ | 2026-08-02 09:20 | EMP-002 | `app-lead-detay.html?id=LEAD-2026-011` |
| BLD-9010 | İzin talebi | info | ✗ | 2026-07-31 16:40 | EMP-003 | `app-izin-detay.html?id=IZN-2026-038` |
| BLD-9011 | Geciken proje | danger | ✔ | 2026-07-29 09:00 | EMP-003 | `app-proje-detay.html?id=PRJ-2026-006` |
| BLD-9012 | Departmanlar arası talep | info | ✗ | 2026-08-01 11:10 | EMP-004 | `app-istalebi-detay.html?id=TLP-2026-042` |

**Tiplere göre dağılım**

| Ölçüt | Dağılım |
|---|---|
| Tür sayısı | 12 farklı tür × 1 kayıt = 12 |
| Ton | `danger` 4 · `warn` 4 · `info` 3 · `ok` 1 |
| Okundu | Okunmamış **9** · Okunmuş **3** (`BLD-9008`, `BLD-9009`, `BLD-9011`) |
| Tarihe göre | 07-29: 1 · 07-31: 1 · 08-01: 4 · 08-02: 4 · 08-03: 1 |
| Modül ekseni | Görev 1 · Satın alma 1 · Sohbet 1 · Destek 1 · Finans 1 · Filo 2 · Demirbaş 1 · Satış 1 · İK 1 · Proje 1 · Departman talebi 1 |

**Kapsam gerçeği:** 31 tipin yalnız **12'si** (`%39`) `DB.notifications`'ta bir kayda sahiptir.
Kalan **19 tip** için mock veride hiç olay üretilmemiştir; tercih ekranının önizlemesi bu 19 tip için
her zaman 0 katkı verir ve bunu kullanıcıya metinle söyler.

### 3g. Önizleme motoru — varsayılan tercihlerle sonuç

`preview()` son 7 günün (`DB.today` ve öncesi 6 gün → `2026-07-28` … `2026-08-03`) gerçek kayıtlarını
alır; 12 kaydın tamamı bu pencereye düşer. Varsayılan matris + varsayılan sessiz saat + `anlik` özet
sıklığıyla hesaplanan değerler:

| Satır | Değer |
|---|---|
| Son 7 günde oluşan olay | 12 |
| Tercihlerle eşleşen olay | 12 (eşlenemeyen tür yok) |
| Toplam gönderim (tip × kanal) | 28 |
| Anında iletilecek | 23 |
| Sessiz saate denk gelip ertelenen | 5 |
| Özet sıklığı sonrası ulaşan | 28 (`anlik` seçili olduğu için gönderim = ulaşan) |

Kanal kırılımı: Sistem içi 12 · E-posta 9 · Mobil bildirim 7 · SMS 0 · WhatsApp/Slack/Teams "Bağlı değil".

Ertelenen 5 gönderim şu üç kayıttan gelir — üçü de hafta sonuna (`2026-08-01` Cumartesi,
`2026-08-02` Pazar) denk gelen **kritik olmayan** tiplerdir:
`BLD-9008` Lisans yenileme (2 kanal), `BLD-9009` Yeni müşteri adayı (2 kanal),
`BLD-9012` Departmanlar arası talep (1 kanal).

### 3h. Bildirim merkezi (`app-panel-bildirimler.html`)

`GV.list` üzerinde kurulu, kaynak `DB.notifications`, sayfa boyutu 25, arşiv kapalı.

| Öğe | İçerik |
|---|---|
| KPI | Okunmamış · Kritik uyarı (`tone === 'danger'`) · Bugün · Toplam bildirim |
| Sekmeler | Okunmamış · Kritik · Görev · Onay · Araç ve Filo · Finans · Tümü |
| Kolonlar | Bildirim (başlık + özet + "Yeni" rozeti) · Bildirim türü · İlgili kişi · Tarih · Durum |
| Filtreler | Bildirim türü (`multi`, seçenekler kayıtların `tur` alanından türetilir) · İlgili kişi · Tarih aralığı |
| Satır aksiyonu | "Kayda git" (`x.link`) · "Okundu işaretle" (`x.okundu` alanını çevirir) |
| Toplu işlem | Okundu işaretle · Dışa aktar |
| Üst aksiyon | "Tümünü Okundu İşaretle" (onaylı) · "Bildirim Tercihleri" |

Sekme filtreleri **tür adı üzerinde regex** ile çalışır (örn. filo sekmesi
`/[Mm]uayene|[Ss]igorta|[Kk]asko|[Bb]akım/`), tip anahtarı üzerinden değil. Yani yeni bir tür adı
eklenirse sekmeye düşmesi regex'in güncellenmesine bağlıdır.

---

## 4. Tetikleyici Envanteri

Ekranın `tur()` fonksiyonu tetikleyici metnini dört sınıfa ayırır. Sıralama önceliklidir:
`%` varsa **Oran eşikli**, yoksa `her gün|her pazartesi|periyot|HH:MM` varsa **Zamanlanmış**,
yoksa `kala|sonra|geçtiğinde|aşıldığında|dolduğunda|altında` varsa **Zaman eşikli**, hiçbiri yoksa
**Olay tabanlı**.

| Tür | Kural sayısı | Kurallar |
|---|---|---|
| Olay tabanlı | **8** | OTO-001, 005, 006, 007, 010, 011, 012, 022 |
| Zaman eşikli | **8** | OTO-002, 003, 004, 013, 014, 015, 016, 021 |
| Zamanlanmış | **4** | OTO-008, 018, 019, 020 |
| Oran eşikli | **2** | OTO-009, 017 |

### 4a. Olay tabanlı tetikleyiciler (koşulsuz — olay anında)

| Kural | Olay | Hangi kayıt üzerinde |
|---|---|---|
| OTO-001 | Görev sorumlusu atandığında | `DB.tasks` — sorumlu alanı yazıldığında |
| OTO-005 | Öncül görev tamamlandığında | `DB.tasks` durum geçişi + `DB.taskDeps` |
| OTO-006 | Görev "Kontrol bekliyor" olduğunda | `DB.tasks` durum geçişi |
| OTO-007 | Kontrol reddedildiğinde | `DB.tasks` durum geçişi (revize) |
| OTO-010 | Mesaj göreve dönüştürüldüğünde | `DB.messages` → `DB.tasks` |
| OTO-011 | Toplantı kararı aksiyona çevrildiğinde | `DB.decisions` → `DB.tasks` |
| OTO-012 | Destek kaydı "Geliştirme" olarak sınıflandığında | `DB.tickets.kategori` |
| OTO-022 | Personel çıkış süreci başlatıldığında | `DB.employees` durum değişimi → `DB.assignments` |

### 4b. Zaman eşikli tetikleyiciler

| Kural | Eşik(ler) | Yön | Tekrar |
|---|---|---|---|
| OTO-002 | **24 saat** (+ **48 saat** eskalasyon) | Olaydan **sonra** | Tek + tek eskalasyon |
| OTO-003 | **2 gün** | Termin **öncesi** | Tek |
| OTO-004 | Eşik yok — "Süre doldu" | Termin **sonrası** | Tek |
| OTO-013 | **5 gün** | Geçerlilik bitişi **öncesi** | Tek |
| OTO-014 | Eşik metinde sayı ile yazılmamış ("maksimum bekleme süresi"); kuru çalıştırma **14 gün** kullanır | Bekleme **sonrası** | Tek |
| OTO-015 | **60 / 30 / 15 / 7 gün** + süre dolduğunda | Bitiş **öncesi** (kademeli) | 4 kademe + 1 |
| OTO-016 | Vade sonrası + **her 7 günde bir** | Vade **sonrası** | **Yinelemeli** |
| OTO-021 | **30 gün** | Garanti bitişi **öncesi** | Tek |

OTO-014 eşik uyuşmazlığı not edilmelidir: kural metninde sayısal eşik yok, ekranın `DENEME`
fonksiyonu ise `sonIletisim ≤ bugün − 14` kullanır. Bu 14 gün ekranda kodlanmıştır, `DB.automations`
verisinde yazmaz.

### 4c. Oran eşikli tetikleyiciler

| Kural | Eşik | Ölçülen |
|---|---|---|
| OTO-009 | **%95** | `DB.capacity[].doluluk` — personel doluluk oranı |
| OTO-017 | **%75** | SLA süresinin tüketilen oranı (`DB.tickets[].slaDurum` üzerinden yaklaşıklanır) |

### 4d. Zamanlanmış tetikleyiciler ve son çalışma

`sonCalisma()` yalnız plan saati **belli** zamanlanmış kurallar için değer üretir; olay tetiklemeli
kurallarda çalışma günlüğü verisi olmadığı için `null` döner ve ekran "Olay tetiklemeli" yazar.

| Kural | Plan | Hesaplanan son çalışma (`DB.today = 2026-08-03`, Pazartesi) |
|---|---|---|
| OTO-008 | "Tanımlı periyot geldiğinde" — saat yok | **Üretilmez** ("Olay tetiklemeli" gösterilir) |
| OTO-018 | Cuma 17:00 | `2026-07-31T17:00` (bir önceki Cuma) |
| OTO-019 | Her gün 08:00 | `2026-08-03T08:00` |
| OTO-020 | Her Pazartesi 08:00 | `2026-08-03T08:00` |

19 kural için "Son çalışma" kolonu boş kalır. Bu, veri eksiği değil bilinçli tercihtir: ekran yorumunda
"olay tetiklemeli kurallarda çalışma günlüğü verisi olmadığı için değer üretilmez" yazılıdır.

### 4e. Bildirim tipi tarafındaki eşikler (tercih ekranından)

Bu eşikler `DB.automations`'ta değil, `app-ayar-bildirim.html` içindeki tip açıklamalarında yazar.
Bir kural karşılığı olan tiplerde iki taraf **her zaman uyuşmaz**.

| Bildirim tipi | Tercih ekranındaki eşik | Kural eşiği | Uyum |
|---|---|---|---|
| Yaklaşan görüşme | 1 saat kala | — (kural yok) | — |
| Teklif geçerlilik süresi | **3 gün** kala | OTO-013 → **5 gün** | ✗ **Çelişki** |
| Yaklaşan teslim | 3 gün kala | — (kural yok) | — |
| Garanti bitişi | 30 gün kala | OTO-021 → 30 gün | ✔ |
| Lisans yenileme | 30 gün kala | — (kural yok) | — |
| Araç bakım tarihi | **15 gün** kala | OTO-015 → 60/30/15/7 gün | Kısmi (15, kademelerden biri) |
| Araç bakım kilometresi | 1.000 km kala | — (km eşiği hiçbir kuralda yok) | ✗ |
| Muayene tarihi | 60/30/15/7 gün kala | OTO-015 → 60/30/15/7 gün | ✔ |
| Trafik sigortası | **30/15/7** gün kala | OTO-015 → 60/30/15/7 gün | Kısmi (60 kademesi tipte yok) |
| Kasko | **30/15/7** gün kala | OTO-015 → 60/30/15/7 gün | Kısmi |
| Kiralama sözleşmesi | 30 gün kala | — (kural yok) | — |
| Geciken tahsilat | Vade sonrası + her 7 günde bir | OTO-016 → aynı | ✔ |
| Sözleşme yenilemesi | 45 gün kala | — (kural yok) | — |
| SLA ihlali | %75 dolduğunda | OTO-017 → %75 | ✔ |

---

## 5. BOŞLUKLAR

Bu bölüm dürüstlük bölümüdür: `PROMPT.md` §21 ve §12'nin istediği ama `DB.automations`'ta
**karşılığı olmayan** otomasyonlar. Hiçbiri uydurulmadı; eksik olan "eksik" yazıldı.

### 5a. §21'de bildirim tipi var, otomasyon kuralı yok (17 tip)

| # | §21 tipi | PROMPT.md ne istiyor | Veride ne var | Ne eksik |
|---|---|---|---|---|
| 1 | Yeni müşteri adayı | Yeni aday kaydında bildirim + otomasyon | `DB.leads` dolu, tip tanımlı, `BLD-9009` kaydı var | **`DB.automations`'ta kural yok** — bildirim örnek kayıt olarak duruyor, üreten kural tanımsız |
| 2 | Yeni referans | Referans geldiğinde bildirim | `DB.referrers` + `DB.refTypes` var, tip tanımlı | Kural yok, örnek bildirim kaydı da yok |
| 3 | Yaklaşan görüşme | Görüşmeye 1 saat kala | `DB.interactions` + `DB.meetings` var, tip tanımlı | Kural yok. Tek **saat eşikli** tip; hiçbir kural saat çözünürlüğünde çalışmıyor |
| 4 | Teklif onayı | Müşteri teklifi onayladığında | `DB.quotes` var, tip kritik işaretli | Kural yok. OTO-013 yalnız geçerlilik süresini izler, onay olayını değil |
| 5 | Proje başlangıcı | Proje başlatıldığında | `DB.projects` var, tip tanımlı | Kural yok. **Proje modülünde hiç otomasyon kuralı yok** |
| 6 | Yaklaşan teslim | Teslime 3 gün kala | `DB.projects` + `DB.milestones` var | Kural yok |
| 7 | Geciken proje | Planlanan bitiş geçtiğinde | `DB.projects` var, tip kritik, `BLD-9011` kaydı var | **Kural yok** — bildirim var, onu üretecek otomasyon tanımsız |
| 8 | Departmanlar arası talep | Departmana talep düştüğünde | `DB.deptRequests` (TLP-…) var, `BLD-9012` kaydı var | Kural yok |
| 9 | Sohbette etiketlenme | Kanalda @ ile anıldığında | `DB.channels` + `DB.messages` var, `BLD-9003` kaydı var | Kural yok. OTO-010 *mesajdan görev üretimini* kapsar, etiketlenme bildirimini değil |
| 10 | İzin talebi | Onaya izin talebi geldiğinde | `DB.leaves` + `DB.leaveTypes` var, `BLD-9010` kaydı var | Kural yok |
| 11 | Satın alma onayı | Onay bekleyen satın alma | `DB.purchases` + `DB.purchaseApprovals` var, `BLD-9002` kaydı var | Kural yok. **Satın alma modülünde hiç kural yok** |
| 12 | Geciken sipariş | Termin geçtiği hâlde teslim alınmadığında | `DB.orders` (`teslimTarihi`, `durum`) + `DB.deliveries` var | Kural yok |
| 13 | Lisans yenileme | Lisans bitişine 30 gün kala | `DB.assets` içinde `Yazılım lisansı` kategorisi (`DMB-2025-009` Figma) var, `BLD-9008` kaydı var | Kural yok. OTO-021 **garanti** bitişini izler, lisans bitişini değil |
| 14 | Araç bakım kilometresi | Bakım km'sine 1.000 km kala | `DB.maintenance` + `DB.vehicles` km alanları var | Kural yok. OTO-015 yalnız **gün** eşiklidir; km eşiği hiçbir kuralda yok |
| 15 | Kiralama sözleşmesi | Bitişe 30 gün kala | `DB.vehicles` kiralama alanları var | Kural yok |
| 16 | Trafik cezası | Araca ceza işlendiğinde | `DB.fines` (`CEZ-2026-004`, `CEZ-2026-005`) var | Kural yok |
| 17 | Sözleşme yenilemesi | Bitişe 45 gün kala | `DB.contracts` var | Kural yok. **Finans modülünde tek kural OTO-016 (tahsilat)** |

### 5b. §12 "Görev Otomasyonları" karşılaştırması (15 madde)

| §12 maddesi | Karşılık | Durum |
|---|---|---|
| Atama bildirimi | OTO-001 | ✔ |
| Görev kabul hatırlatması | OTO-002 | ✔ |
| Termin yaklaşma bildirimi | OTO-003 | ✔ |
| Gecikme bildirimi | OTO-004 | ✔ |
| Yönetici eskalasyonu | OTO-002 (48 saat) + OTO-004 içine gömülü | **Kısmi** — bağımsız bir eskalasyon kuralı, eskalasyon kademesi ve eskalasyon süresi ayarı yok |
| Bağımlı görev tamamlanınca sonraki görevi başlatma | OTO-005 | ✔ |
| Kontrol sürecini otomatik başlatma | OTO-006 | ✔ |
| Revizyon görevi oluşturma | OTO-007 | ✔ |
| Tekrarlayan görev oluşturma | OTO-008 | ✔ |
| **Güncellenmeyen görev uyarısı** | — | **Eksik.** `DB.automations`'ta hiçbir kural görevin son güncelleme tarihine bakmıyor |
| Aşırı iş yükü uyarısı | OTO-009 | ✔ |
| Sohbetten görev oluşturma | OTO-010 | ✔ |
| Toplantıdan görev oluşturma | OTO-011 | ✔ |
| **Müşteri talebinden görev oluşturma** | OTO-012 (destek talebinden) | **Eksik/kısmi.** Destek kaydından geliştirme görevi var; müşteri talebinden (`DB.deptRequests` / müşteri kanalı) görev üretimi yok |
| Destek talebinden geliştirme görevi oluşturma | OTO-012 | ✔ |

§12 karşılama oranı: **12 / 15 tam**, 2 kısmi, 1 tam eksik.

### 5c. Veri modeli boşlukları (alan düzeyinde)

| Boşluk | PROMPT.md ne istiyor | Veride ne var | Ne eksik |
|---|---|---|---|
| Kural kategorisi | Kuralların modüle göre gruplanması | `DB.automations` kayıtlarında `kategori` alanı **yok** | Kategori ekranda `KAT` sabitiyle koda gömülü. Veri tarafına taşınmalı |
| Kural koşulu | §26-J'de ayrı koşul kavramı | `kosul` alanı **yok** | Koşul, tetikleyici metninden regex ile çıkarılıyor |
| Çalışma geçmişi | "Çalışma geçmişi" beklentisi | `DB.automations`'ta `sonCalisma` / çalışma günlüğü alanı **yok**, ayrı bir çalışma log koleksiyonu da yok | 19 kural için son çalışma hiç gösterilemiyor. `DB.logs` otomasyon çalışmalarını içermiyor |
| Kanal genişliği | 7 kanal | Kurallar yalnız `Sistem içi` ve `E-posta` kullanıyor | Mobil / SMS / WhatsApp / Slack / Teams hiçbir kuralın `kanal` dizisinde geçmiyor |
| Alıcı çözümlemesi | "Kullanıcılar" kolonu | `kullanici` serbest metin | `DB.roles` anahtarına bağlı değil; rol bazlı yetki ile çapraz kontrol yapılamıyor |
| Eşik ayarlanabilirliği | Kural bazlı eşik yönetimi | Eşikler tetikleyici cümlesinin içine gömülü | Eşiği düzenleyecek bir alan ya da form yok; ekran yalnız aç/kapat sunuyor |
| Tetikleyici ↔ tip bağı | Kural hangi bildirim tipini üretiyor | Kuralda `tip` alanı **yok** | Bölüm 1'deki eşleşme metin benzerliğiyle kuruldu, veriyle değil |
| Mesajdan görev bağı | §22: "Sohbet mesajı → Görev" | `DB.messages` içinde görev bağlantı alanı yok | OTO-010 kuru çalıştırılamıyor (ekranın kendi notu) |

### 5d. Bildirim tercihi tarafındaki boşluklar

| Boşluk | Ne eksik |
|---|---|
| Başkasının tercihini yönetme | Ekran "personel kaydından yönetin" diyor; ilgili akış bu ekranda yok, personel detayında bir "Bildirim tercihleri" bölümü bu belgede doğrulanmadı |
| Kanal başına özet ayrı ayarı | Özet sıklığı **tüm dış kanallar için tek** — kanal bazlı sıklık yok |
| Sessiz saat istisnası | Kritik dışında istisna yok (örn. "yalnız yöneticiler" ya da "belirli müşteri") |
| Tercih kalıcılığı | Yalnız `localStorage` (`gv.notifpref`); kullanıcı/rol bazlı sunucu tarafı yok — statik prototip gerçeği |
| 19 tipin örnek verisi | 31 tipin 12'si için kayıt var; kalan 19 tip önizlemeye 0 katkı veriyor |

**Toplam boşluk: 17 (§21 tipi) + 3 (§12) + 1 (teklif geçerlilik eşik çelişkisi) = 21 ana boşluk**,
ayrıca 8 veri modeli + 5 tercih ekranı alt boşluğu.

---

## 6. Yürütme Gerçeği — Otomasyonlar Gerçekten Çalışıyor mu?

Kısa cevap: **Hayır, arka planda çalışan bir motor yok. Ama kural listesi ölü veri de değil —
talep üzerine gerçek veri üzerinde değerlendirilebiliyor.**

### 6a. Ne çalışmıyor

| Beklenti | Gerçek |
|---|---|
| Zamanlayıcı / cron | **Yok.** `setInterval`, `setTimeout` ile kurulmuş bir tetikleyici döngüsü yok. `OTO-019` "Her gün 08:00" hiçbir zaman kendiliğinden koşmaz |
| Olay dinleyicisi | **Yok.** Bir görev ekranında sorumlu değiştiğinde OTO-001 devreye girmez; kayıt değişimini dinleyen ortak bir olay yolu (event bus) yok |
| Bildirim üretimi | **Yok.** Hiçbir kural `DB.notifications`'a kayıt eklemez. 12 bildirim kaydı elle yazılmış sabit veridir |
| Kayıt oluşturma | **Yok.** "Revizyon görevi aç", "iade görevi aç", "geliştirme görevi aç" gibi işlemlerin hiçbiri `DB.tasks`'e yazmaz |
| Gerçek gönderim | **Yok.** E-posta / SMS / push gönderimi yok; kanal alanları yalnız etiket |
| Kalıcılık | Aç/kapat değişikliği `DB.automations` dizisini **bellekte** günceller; sayfa yenilenince kaybolur. `localStorage`'a yazılmaz (bildirim tercihinin aksine) |

### 6b. Ne çalışıyor

| Yetenek | Nasıl |
|---|---|
| Kural aç/kapat | Satır anahtarı, satır aksiyonu (onaylı) ve toplu işlem — üçü de `setAktif()` ile `aktif` + `durum` alanlarını değiştirir, liste tazelenir, toast basılır |
| Yetki kontrolü | `GV.perm.can('duzenle')` false ise anahtarlar `disabled`, toplu işlem menüsü hiç kurulmaz, üstte salt-okunur kartı basılır. Kuru çalıştırma yetkisiz rolde de açıktır |
| **Kuru çalıştırma (gerçek hesap)** | `DENEME` haritasındaki 19 kural, hedef koleksiyonu `DB.today` eksenli **gerçekten filtreler** ve eşleşen kayıt sayısını döndürür. Örn. OTO-016 `DB.invoices` içinde vadesi geçmiş ve ödenmemiş faturaları sayar |
| Tekil kuru çalıştırma | Satır aksiyonu "Şimdi çalıştır (deneme)" → onay → toast: "`OTO-016` kuru çalıştırıldı — Faturalar içinde N kayıt eşleşti". Kayıt değiştirmez, bildirim göndermez (metinde açıkça yazar) |
| Toplu kuru çalıştırma | "Tümünü Dene" düğmesi aktif kuralların tümünü koşturup `GV.modal` içinde kural × eşleşen kayıt özeti basar |
| KPI'lar | "Aktif kuralların eşlediği kayıt" KPI'ı 19 kuralın canlı toplamıdır — sabit sayı değil |
| Kural detay drawer'ı | `GV.chain()` ile 4 adımlı zincir (Tetikleyici → Koşul → İşlem → Bildirim) + `gv-dl` künye + kuru çalıştırma hedefi ve anlık eşleşme sayısı |
| Bildirim önizlemesi | `app-ayar-bildirim.html` son 7 günün **gerçek** `DB.notifications` kayıtlarını matris + sessiz saat + özet sıklığı kurallarından geçirir; sayılar tercih değiştikçe anında yeniden hesaplanır |

### 6c. Ekranın kendi dürüstlük notları

Kod içinde üç yerde açıkça "uydurma veri yazılmaz" disiplini uygulanmış:

1. `app-ayar-otomasyon.html:33-37` — "DB.automations'ta kategori / koşul / son çalışma alanı YOK.
   Aşağıdaki üç fonksiyon bu üç sütunu kuralın kendi metninden türetir; uydurma veri yazılmaz."
2. `OTO-010` için `not:'Sohbet mesajlarında görev bağlantısı alanı tutulmuyor — eşleşme sayılamıyor.'`
   — sayı üretmek yerine nedeni söylüyor.
3. `app-ayar-bildirim.html` önizleme metni — "Aşağıdaki sayılar tahmin değil" + "kalan N tip önizlemeye
   0 katkı verir çünkü mock veride o tipte olay üretilmemiştir."

### 6d. Sonuç

Otomasyon katmanı bu prototipte **"tanım + değerlendirme" seviyesindedir, "yürütme" seviyesinde
değildir**. Kurallar veri olarak eksiksiz tanımlıdır, ekran onları gerçek koleksiyonlar üzerinde
sayabilir ve kullanıcı açıp kapatabilir; ancak hiçbir kural kendiliğinden tetiklenmez, kayıt
oluşturmaz ve bildirim üretmez. Bir sonraki adımın gerçek karşılığı `PROMPT.md` §23'teki
**"Arka plan görevleri"** ve **"Bildirim servisi"** maddeleridir — ikisi de bu statik prototipin
kapsamı dışındadır ve bu belgede simüle edilmemiştir.

### 6e. Kullanılan ortak bileşenler

`GV.pageHead` · `GV.list` (KPI + sekme + arama + filtre + kolon + toplu işlem + satır aksiyonu +
sayfalama + çıktı + mobil kart) · `GV.drawer` · `GV.modal` · `GV.confirm` · `GV.toast` · `GV.badge` ·
`GV.chain` · `GV.user` · `.f-switch` anahtarı · `.gv-tablewrap.is-sticky1` geniş matris +
`.gv-cardlist` mobil ikizi · `.kpi-grid` · `emptyState`.
Yeni bileşen üretilmemiştir; üç ekran da mevcut sözlükle kurulmuştur.
