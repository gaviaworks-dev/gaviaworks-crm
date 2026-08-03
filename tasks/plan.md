# plan.md — GaviaWorks CRM Kapsam Listesi ve Yol Haritası

> **Bu liste işin bitiş tanımıdır.** Her madde işaretlenmeden iş bitmiş sayılmaz.
> Kaynak: PROMPT.md (29 bölüm) — hiçbir modül/alan/sekme/durum/rol/rapor atlanmadı.
> Durum: `[ ]` yapılmadı · `[~]` kısmen · `[x]` tamam

---

## A. ALTYAPI — ✅ TAMAM

- [x] `assets/css/tokens.css` — renk, spacing, radius, shadow, tipografi, z-index, layout ölçüleri (sıfır hardcode)
- [x] `assets/css/shell.css` — rail + menü + üst bar + içerik alanı + responsive (1440/768/390)
- [x] `assets/css/ui.css` — ortak bileşen katmanı (~1140 satır)
- [x] `assets/img/icons.svg` — inline SVG sprite (CDN bağımlılığı yok)
- [x] `assets/js/shell.js` — SECTIONS/SEC_BY_ROLE veri modeli, rail+menü render, rol değiştirme, yetki kapısı (403), breadcrumb, WIP bağlantı kaydı
- [x] `assets/js/ui.js` — ortak bileşen motoru (bkz. components.md)
- [x] `assets/data/*.js` — canonical mock veri, 6 dosya (aynı kayıt no = her ekranda aynı değer)
- [x] Yetki çözümleyici — `shell.js` içinde `GV.perm` (rol/departman/proje/kendi + alan bazlı maskeleme)

---

## B. ROLLER (PROMPT.md §5 — 27 rol)

Tamamı `ROLES` modelinde tanımlanacak; 6'sı için özel dashboard (§7), diğerleri en yakın
dashboard varyantını devralır.

- [ ] Şirket sahibi · Genel müdür · Operasyon yöneticisi · Departman yöneticisi
- [ ] Satış yöneticisi · Satış temsilcisi · Müşteri temsilcisi · İş analisti
- [ ] Proje yöneticisi · Takım lideri · UI/UX tasarımcı · Front-end geliştirici
- [ ] Back-end geliştirici · Mobil geliştirici · Yapay zekâ geliştiricisi
- [ ] Test ve kalite uzmanı · DevOps personeli · Teknik destek personeli
- [ ] İnsan kaynakları · Muhasebe · Satın alma sorumlusu · İdari işler sorumlusu
- [ ] Freelancer · Dış kaynak ekip · Stajyer · Müşteri kullanıcısı · Sistem yöneticisi

**Yetki eksenleri (§5):** modül görüntüleme, listeleme, detay, ekleme, düzenleme, silme,
arşivleme, pasife alma, onaylama, reddetme, görev atama, dosya yükleme/indirme,
finansal bilgi, maaş bilgisi, personel raporu, müşteri raporu, dışa aktarma, log erişimi,
departman/proje/kayıt/şirket bazlı erişim.

**Erişim seviyeleri:** rol · kullanıcı · departman · proje · müşteri · kayıt · alan · tenant.

---

## C. MENÜ HARİTASI (rail bölümleri)

| # | Bölüm | Alt menü |
|---|---|---|
| 1 | **Ana Panel** | Dashboard · Günlük Özet · Ajanda · Görevlerim · Bekleyen Onaylar · Bildirimler · Duyurular · Yönetici Paneli |
| 2 | **Satış & CRM** | Müşteri Adayları · Satış Pipeline · Fırsatlar · Referans Kaynakları · Yönlendiren Kişiler · Ön Analizler · Teklifler |
| 3 | **Müşteriler** | Müşteri Listesi · Yetkililer · İletişim Geçmişi · Riskli Müşteriler |
| 4 | **Projeler** | Proje Listesi · Modüller · Milestone · Sprintler · Kanban · Gantt · Teslimler · Değişiklik Talepleri · Testler · Hatalar |
| 5 | **Görevler** | İş Havuzu · Bana Verilenler · Verdiğim İşler · Departman İşleri · Onay Bekleyenler · Kontrol Bekleyenler · Gecikenler · Engellenenler · Tamamlananlar · Departmanlar Arası İş Talebi |
| 6 | **Destek & Bakım** | Destek Talepleri · SLA Takibi · Bakım Paketleri · Memnuniyet |
| 7 | **Sohbet** | Kanallar · Birebir · Proje Kanalları · Duyurular |
| 8 | **Personel & İK** | Personel · İzinler · Zaman Kayıtları · Timesheet Onayı · Kapasite · Performans · Eğitim & Yetkinlik · İşe Giriş/Çıkış |
| 9 | **Demirbaş & Filo** | Demirbaşlar · Zimmetler · Kategoriler · Araçlar · Bakım · Muayene · Sigorta · Kasko · Yakıt · Giderler · Kaza & Ceza |
| 10 | **Satın Alma** | Talepler · Onay Bekleyenler · Teklif Toplama · Siparişler · Teslimat · Tedarikçiler |
| 11 | **Finans** | Sözleşmeler · Faturalar · Tahsilatlar · Ödeme Planları · Proje Bütçe & Maliyet · Referans Komisyonları |
| 12 | **Dokümanlar** | Doküman Merkezi · Klasörler · Sözleşme & Teklif Arşivi · Süresi Dolanlar |
| 13 | **Toplantılar** | Toplantılar · Ajanda · Kararlar & Aksiyonlar |
| 14 | **Raporlar** | Müşteri · Personel · Görev · Referans · Filo · Satış & Finans · Proje raporları |
| 15 | **Ayarlar** | Şirket · Departmanlar · Kullanıcılar · Roller · Yetki Matrisi · Onay Akışları · Bildirim Tercihleri · Entegrasyonlar · Log Kayıtları · Arşiv · Profil |

---

## D. EKRAN KAPSAM LİSTESİ

### Wave 0 — Altyapı + Giriş ✅
- [x] `index.html` — giriş ekranı (form doğrulamalı) + rol/persona seçici
- [x] Yetki kapısı: yetkisiz ekranda 403 durumu (menü gizleme tek başına yetmez)
- [x] Boş durum / yüklenme (skeleton) / hata durumu bileşenleri
- [x] Yayında olmayan hedeflere giden bağlantıların `data-wip` işaretlenmesi (sıfır kırık link)

### Wave 1 — Dashboard'lar (§7) ✅
- [x] Şirket Sahibi Dashboard (16 KPI + 6 kart: toplam müşteri, yeni adaylar, referansla gelenler, pipeline, bekleyen teklifler, aylık satış tahmini, aktif/geciken projeler, geciken görevler, riskli müşteriler, geciken tahsilatlar, personel kapasitesi, departman iş yükleri, satın alma onayları, araç & demirbaş uyarıları, sigorta/kasko yenilemeleri, açık destek)
- [x] Satış Dashboard (12 KPI + pipeline hunisi + sonraki aksiyonlar + tıkanan fırsatlar)
- [x] Proje Yöneticisi Dashboard (12 KPI + proje sağlığı + engellenenler + milestone + riskler)
- [x] Personel Dashboard (12 KPI + görevlerim + zaman kayıtlarım + zimmetlerim + duyurular)
- [x] İnsan Kaynakları Dashboard (12 KPI + izin talepleri + doluluk + belge süresi + eğitim)
- [x] Satın Alma & İdari İşler Dashboard (12 KPI + onay kuyruğu + araç uyarıları + lisans/garanti)
- [x] Müşteri kullanıcısı (kısıtlı) paneli — 7. varyant
- [ ] Günlük Özet · Bekleyen Onaylar · Bildirimler · Duyurular · Yönetici Paneli (ayrı ekranlar)

### Wave 2 — kısmen başlandı
- [x] `app-lead.html` — müşteri adayları listesi (8 sekme, 9 filtre, 13 kolon)
- [x] `app-teklif.html` — teklif listesi (8 sekme, geçerlilik + onay takibi, revize teklif akışı)
- [x] `app-gorev.html` — görev listesi (13 sekme, kanban/kart/tablo)
- [x] `app-gorev-detay.html` — görev detayı (8 sekme, durum geçişi, zaman kaydı, onay zinciri)
- [x] `app-musteri.html` — müşteri listesi (5 sekme, finans alanları yetkiye tabi)
- [x] `app-proje.html` — proje listesi (8 sekme, sağlık + bütçe/süre sapması)
- [x] `app-personel.html` — personel listesi (6 sekme, kapasite + maaş maskeleme)

### Wave 2 — Satış & CRM (§8, §9, §10)
- [ ] Müşteri Adayları listesi (28 alan · §8.1) + detay + form
- [ ] Satış Pipeline — 15 aşamalı kanban (§8.2) + aşama kuralları (zorunlu alan, sorumlu, onay, otomatik görev, max bekleme, gecikme uyarısı)
- [ ] Satış Fırsatı detayı
- [ ] Referans Kaynakları (17 tür · §9) + Yönlendiren Kişi kartı (21 alan) + detay + form
- [ ] Referans hakkediş & komisyon akışı
- [ ] Ön Analiz listesi (28 değerlendirme alanı · §10) + detay + form + 10 çıktı
- [ ] Teklifler listesi (25 alan · §10) + detay (kalemler, versiyon, revizyon) + form + PDF çıktı

### Wave 3 — Müşteriler (§8.3)
- [ ] Müşteri listesi (sekmeler: Tüm/Aktif/Potansiyel/Riskli/Pasif)
- [ ] Müşteri detayı — **15 sekme:** Genel Bilgiler · Yetkililer · İletişim Geçmişi · Satış Fırsatları · Teklifler · Sözleşmeler · Projeler · Görevler · Toplantılar · Destek Talepleri · Faturalar · Tahsilatlar · Dosyalar · Raporlar · Aktivite Geçmişi
- [ ] Müşteri formu + Yetkili formu

### Wave 4 — Projeler (§11)
- [ ] Proje listesi + form (24 alan)
- [ ] Proje detayı — **22 sekme:** Genel Bakış · Proje Ekibi · Modüller · Milestone · Sprintler · Görevler · İş Yükü · Takvim · Gantt · Kanban · Zaman Kayıtları · Toplantılar · Dosyalar · Revizyonlar · Değişiklik Talepleri · Testler · Hatalar · Teslimler · Bütçe · Maliyetler · Raporlar · Aktivite Geçmişi
- [ ] Teknik envanter alanları (repo, canlı, test, tasarım, sunucu, 3. taraf servisler — §3)

### Wave 5 — Görevler (§12)
- [ ] Görev listesi — 13 sekme, 4 görünüm (tablo/kart/kanban/takvim)
- [ ] Görev detayı — 50+ alanlı görev kartı
- [ ] Görev formu + alt görev + kontrol listesi + bağımlılık
- [ ] 19 görev durumu + geçiş kuralları (yetki, zorunlu alan, bildirim)
- [ ] 18 görev türü
- [ ] 15 görev otomasyonu (§12 — atama, kabul, termin, gecikme, eskalasyon, bağımlılık, kontrol, revizyon, tekrarlayan, iş yükü)
- [ ] Departmanlar arası iş talebi (§13) — liste + detay + form

### Wave 6 — Personel & İK (§14)
- [ ] Personel listesi + detay (23 alan) + form
- [ ] İzin yönetimi (6 izin türü, bakiye, vekil, onay akışı, çakışma kontrolü, departman takvimi)
- [ ] Zaman kaydı & timesheet (zamanlayıcı, manuel giriş, haftalık timesheet, yönetici onayı, fazla mesai)
- [ ] Kapasite & doluluk
- [ ] Performans yönetimi (14 eksen — otomatik karar vermez, karar desteği)
- [ ] Eğitim & yetkinlik

### Wave 7 — Demirbaş & Filo (§15, §16)
- [ ] Demirbaş listesi (19 kategori) + detay (28 alan) + form
- [ ] Zimmet süreci (12 adım: seçim, tutanak, dijital onay, fotoğraf, iade, hasar, çıkış kontrolü)
- [ ] Araç listesi + detay + form (**demirbaştan ayrı özel modül**)
- [ ] Araç: kimlik · satın alma/kiralama · zimmet · bakım · muayene · trafik sigortası · kasko · yakıt/şarj · giderler (18 kalem) · kaza/hasar/ceza
- [ ] Yenileme bildirimleri: 60/30/15/7 gün + süresi doldu
- [ ] Araç maliyet hesabı (aylık / yıllık / km başına)

### Wave 8 — Satın Alma & Tedarik (§17)
- [ ] Satın alma talebi listesi + detay + form (14 alan)
- [ ] Tutar/kategoriye göre çok aşamalı onay akışı (6 onay makamı)
- [ ] Teklif toplama & karşılaştırma (9 kriter)
- [ ] Sipariş & teslimat (18 alan) + eksik teslim + iade
- [ ] Demirbaşa / araca otomatik aktarım
- [ ] Tedarikçi listesi + detay + puanlama

### Wave 9 — Destek & Sohbet (§18, §13)
- [ ] Destek talepleri listesi + detay + form (18 alan, SLA, memnuniyet)
- [ ] Destek → görev / hata / geliştirme / değişiklik / ek teklif dönüşümü
- [x] `app-sohbet.html` — sohbet modülü (11 kanal türü, kanal/mesaj arama, tepki, dosya paylaşımı, kanal bilgisi drawer'ı)
- [x] Sohbetten görev oluşturma (16 alanlı devir → `DB.tasks` + aktivite kaydı + kanala durum mesajı)

### Wave 10 — Toplantı, Ajanda, Doküman (§19)
- [x] `app-ajanda.html` — ajanda (gün/hafta/ay görünümü, 8 olay kaynağı, kaynak çipleri, olay drawer'ı, URL senkronu)
- [ ] Toplantılar (6 tür) + detay (gündem, notlar, kararlar, aksiyonlar)
- [ ] Toplantı kararından görev oluşturma
- [ ] Doküman merkezi (16 doküman türü) + klasörleme, etiket, versiyon, yetki, önizleme, dijital onay, son kullanma, yenileme bildirimi

### Wave 10b — Finans (menü §11 · PROMPT.md §10, §22)
- [x] `app-sozlesme.html` — sözleşmeler (6 sekme, 12 kolon, yenileme akışı, finans maskeleme)
- [x] `app-fatura.html` — faturalar (5 sekme, 11 kolon, vade/gecikme takibi, ödendi işaretleme)
- [x] `app-tahsilat.html` — tahsilatlar (5 sekme, gecikme günü, hatırlatma aksiyonu)
- [x] `app-butce.html` — proje bütçe ve maliyet (bütçe/maliyet karşılaştırma grafiği, aşım takibi, 14 kolon)
- [ ] `app-odemeplani.html` — ödeme planları (milestone bazlı taksit takibi)
- [x] Referans komisyonları → `app-komisyon.html` (Wave 2'de tamamlandı)

### Wave 11 — Raporlama Merkezi (§20)

**Ortak rapor iskeleti** (ui.css `.rp-filters` / `.rp-acts` + `GV.chart.*` hazır):
her rapor ekranı = rapor seçici (sol liste veya sekme) + `GV.report()` filtre şeridi
(tarih · departman · personel · müşteri · proje · durum) + KPI şeridi + grafik +
detay tablo (`GV.list`) + çıktı (Excel/CSV/PDF/Yazdır) + kayıtlı rapor.

- [x] `GV.report(cfg)` ortak bileşeni — rapor seçici + filtre şeridi + KPI + grafik kartları + detay tablo (GV.list) + kayıtlı rapor (localStorage) + URL senkronu (`?r=&rf_*`)
- [x] `app-rapor.html` — rapor merkezi: 8 kategori kartı, 91 rapor kataloğu, kayıtlı raporlar, son çalıştırılanlar, favoriler
- [x] `app-rapor-musteri.html` — 14 rapor: genel · iletişim · teklif · satış dönüşüm · proje · destek · finans · tahsilat · kârlılık · memnuniyet · risk · yaşam boyu değer · çapraz satış · yenileme fırsatı
- [x] `app-rapor-personel.html` — 13 rapor: genel · görev · iş yükü · zaman · kapasite · proje katkı · performans · izin · eğitim · zimmet · araç kullanım · fazla mesai · eksik çalışma
- [x] `app-rapor-gorev.html` — 19 rapor: açık · geciken · engellenen · atanmamış · kabul bekleyen · kontrol bekleyen · revizede · tamamlanan · departman · proje · müşteri bazlı · tahmini/gerçekleşen süre · zamanında tamamlama · revizyon oranı · yeniden açılma · kalite · departmanlar arası · sohbetten · toplantıdan
- [x] `app-rapor-referans.html` — 10 rapor: kaynaklar · yönlendiren performansı · dönüşüm oranı · ciro · kâr · ödenen komisyon · bekleyen komisyon · personel referansı · müşteri referansı · devamlılık
- [x] `app-rapor-filo.html` — 19 rapor: aktif · tahsisli · ortak · serviste · bakımı yaklaşan/geciken · muayene · sigorta · kasko yaklaşan · yakıt · giderler · km başına maliyet · personel/departman/proje bazlı kullanım · kaza & hasar · trafik cezası · kiralama sözleşmesi · satın alma-kiralama karşılaştırması
- [x] `app-rapor-finans.html` — 16 rapor: lead kaynakları · satış dönüşümü · teklif başarısı · kazanılan · kaybedilen · temsilci performansı · ortalama satış süresi · tahmini gelir · proje bütçesi · proje maliyeti · müşteri kârlılığı · hizmet kârlılığı · tahsilat · geciken ödeme · aylık gelir tahmini · nakit akış tahmini
- [x] `app-rapor-proje.html` — proje raporları: sağlık · ilerleme · bütçe/süre sapması · milestone · sprint hız · test & hata · teslim · kaynak dağılımı
- [x] Rapor yetkisi: `GV.perm.can('finans'|'maas'|'personelRapor'|'musteriRapor')` her rapor ekranında uygulanır
- [x] `Raporlar` rail bölümü menü kayıtları + `SEC_BY_ROLE` güncellemesi (orkestratör)

### Wave 12 — Bildirim, Otomasyon, Ayarlar (§21, §5, §23)

**Bildirim & otomasyon**
- [x] `app-panel-bildirimler.html` — bildirim merkezi (okundu/okunmadı, filtre)
- [x] `app-ayar-bildirim.html` — 31 bildirim tipi × 7 kanal (sistem içi · e-posta · mobil · SMS · WhatsApp · Slack · Teams) tercih matrisi + sessiz saat + özet sıklığı
- [x] `app-ayar-otomasyon.html` — 22 otomasyon kuralı listesi (tetikleyici → koşul → işlem → bildirim), aç/kapa, çalışma geçmişi, kural detay drawer'ı

**Ayarlar**
- [x] `app-ayar-sirket.html` — şirket profili, logo, vergi/adres/iletişim, çalışma takvimi, tatil günleri, para birimi, çoklu şirket (tenant) listesi
- [x] `app-ayar-departman.html` — 21 departman listesi + org şeması görünümü + yönetici/kadro/kapasite
- [x] `app-ayar-kullanici.html` — kullanıcı listesi (16 personel), rol ataması, durum, son giriş, davet/pasife alma
- [x] `app-ayar-rol.html` — 27 rol listesi, rol başına kullanıcı sayısı, rol kopyalama, rol detay drawer'ı
- [x] `app-ayar-yetki.html` — **yetki matrisi**: satır = modül, kolon = 20 yetki ekseni, hücre = rol bazlı toggle; kapsam seçimi (tüm/departman/proje/kendi), alan bazlı maskeleme
- [x] `app-ayar-onay.html` — onay akışları: satın alma (6 makam, tutar eşikli), izin, zaman kaydı, teklif, değişiklik talebi; adım ekle/sil/sırala
- [x] `app-ayar-entegrasyon.html` — muhasebe · GitHub/GitLab · e-imza · e-posta · takvim · Slack/Teams · WhatsApp · AI servisleri; bağlantı durumu, anahtar alanı (maskeli), test bağlantısı
- [x] `app-ayar-log.html` — log kayıtları: kim · ne zaman · hangi kayıt · **eski değer → yeni değer** · IP · modül filtresi
- [x] `app-ayar-arsiv.html` — arşivlenen kayıtlar (modül bazlı sekmeler), geri alma, kalıcı silme (onaylı)
- [x] `app-ayar-profil.html` — profil bilgileri, şifre, oturum cihazları, dil/tema/tarih biçimi, kişisel bildirim tercihi
- [x] `Ayarlar` rail bölümü menü kayıtları + `SEC_BY_ROLE` (yalnız sahip/sistem yöneticisi/İK kısmi) (orkestratör)

### Wave 13 — Kapanış
- [ ] Tüm `data-wip` bağlantıların gerçek `href`'e çevrilmesi
- [ ] Modüller arası veri ilişkisi doğrulaması (§22 — 38 bağlantı)
- [ ] Canonical veri tutarlılığı taraması (aynı kayıt no = aynı değer)
- [ ] 1440 / 768 / 390 px QA taraması
- [ ] Kapanış raporu

---

## E. VERİ MODELİ (§26-G)

Her ana kayıt için: entity adı · alanlar · veri türleri · zorunlu alanlar · ilişkiler ·
durum değerleri · arşivleme mantığı · log kaydı · yetki kapsamı.

- [ ] lead · opportunity · customer · contact · referrer · commission
- [ ] analysis · quote · quote_item · contract · invoice · payment
- [ ] project · module · milestone · sprint · delivery · change_request · test · bug
- [ ] task · subtask · checklist_item · task_dependency · dept_request
- [ ] employee · leave · timelog · timesheet · performance · training
- [ ] asset · assignment · vehicle · maintenance · inspection · insurance · casco · fuel · expense · accident · fine
- [ ] purchase_request · approval · supplier_quote · order · supplier
- [ ] ticket · sla · chat_channel · chat_message · meeting · decision
- [ ] document · notification · automation · role · permission · activity_log

---

## F. İŞ AKIŞLARI (§26-H — 22 akış)

- [ ] Referansla müşteri kazanımı · Lead→müşteri dönüşümü · Ön analiz · Teklif ve sözleşme
- [ ] Proje başlatma · Görev atama · Görev kabulü · Görev kontrolü · Revizyon
- [ ] Sohbetten görev oluşturma · Departmanlar arası iş talebi · İzin talebi
- [ ] Satın alma talebi · Demirbaş zimmeti · Araç zimmeti · Araç bakımı
- [ ] Sigorta yenilemesi · Kasko yenilemesi · Muayene · Kaza ve hasar
- [ ] Destek talebi · Personel işten ayrılışı

---

## G. DOKÜMAN ÇIKTILARI (§26)

- [x] A. GaviaCRM incelemesi → `research.md`
- [ ] B. Yönetici özeti
- [ ] C. Modül haritası (tablo)
- [ ] D. Rol & yetki matrisi (tablo)
- [ ] E. Menü ve sayfa haritası
- [ ] F. Sayfa analizleri
- [ ] G. Veri modeli
- [ ] H. İş akışları
- [ ] I. API ve teknik servisler
- [ ] J. Otomasyonlar (tablo)
- [ ] K. Raporlar
- [ ] L. Geliştirme yol haritası
- [ ] M. Eksik ve ek öneriler

---

## H. KABUL KRİTERLERİ (§28)

- [ ] GaviaCRM arayüz diliyle görsel uyum
- [ ] Yazılım şirketine özgü — inşaat terminolojisi sıfır
- [ ] Bütün ana modüller birbirine bağlı
- [ ] Görev sistemi ayrıntılı
- [ ] Referans & yönlendiren kişi takibi
- [ ] Departmanlar arası sohbet + iş talebi + sohbetten görev
- [ ] Müşteri ve personel raporları detaylı
- [ ] Araçlar özel filo modülünde (bakım/muayene/sigorta/kasko)
- [ ] Liste ekranları ortak standart
- [ ] Yetkilendirme arayüz seviyesinde kalmıyor
- [ ] Aktivite ve değişiklik geçmişi
- [ ] Masaüstü + mobil (1440/768/390)
- [ ] Çoklu şirket / SaaS'a hazır yapı
- [ ] Aynı bilgi tekrar girilmiyor

---

## FAZ: UI ve UX KALİTE GEÇİŞİ

> **Ne zaman:** Tüm ekranlar bittikten sonra, **kapanış raporundan önce**.
> **Ekran üretimi bitmeden bu faza başlanmaz.**

**Amaç:** Ekran ekran yama değil, **ortak katmanda kök nedenden çözüm.**

**GENEL KURAL:** Referans projeden **biçim, oran, yerleşim ve etkileşim davranışı** alınır;
**renk, tipografi ve gölge değerleri ALINMAZ** — onlar bu projenin `tokens.css` dosyasından gelir.
Hiçbir çözümde hardcode renk kullanılmaz.

### Kapsam
- [ ] `tasks/ui-debt.md`'deki tüm maddeler (UID-01 rail collapse çentiği dahil)
- [ ] **Boşluk sistemi denetimi:** tüm bileşenlerde tek bir boşluk ölçeği kullanılıyor mu,
      hardcode piksel kalmış mı
- [ ] Form kontrolü ile etiketi arasındaki boşluk için **tek taban kural**
- [ ] Tüm native kontrollerin (select, tarih, checkbox, radio, dosya) tasarım sistemine alınması
- [ ] **Hizalama ve optik denge:** kart içi iç boşluklar, tablo satır yoğunluğu, ikon boyut
      tutarlılığı, başlık hiyerarşisi
- [ ] **Odak ve hover durumları:** klavyeyle gezilebilirlik, görünür odak halkası
- [ ] **Renk kontrastı WCAG AA taraması**, özellikle durum etiketleri ve ikincil metinler
- [ ] **Tıklama alanları:** aksiyon ikonları ve tutamaklar en az 44 px yükseklikte erişilebilir
      alana sahip mi
- [ ] **Modal, yan panel ve açılır menülerde tek davranış standardı:** başlık ayrımı, kaydırma
      gölgesi, kapatma, odak hapsi, escape ile kapanma
- [ ] Boş durum, yüklenme ve hata durumlarının tüm ekranlarda **aynı dille** kurulması
- [ ] Sol rail ve üst nav'ın referanstaki shell **DAVRANIŞIYLA** karşılaştırılması —
      yine sadece davranış ve oran, renk değil

### Yöntem
Her madde **ortak katmanda** çözülür, sonra etkilenen **tüm ekranlar** 1440, 768 ve 390 px'de
yeniden doğrulanır. **Nokta yaması yasak.**
