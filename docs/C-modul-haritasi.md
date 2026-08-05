# C. Modül Haritası

> **Türetildiği kaynaklar ve tarih**
> Bu doküman **4 Ağustos 2026** tarihinde, aşağıdaki dosyaların o günkü hâlinden
> türetilmiştir. Hiçbir modül, alt modül veya rol adı elle uydurulmamıştır.
>
> | Kolon | Kaynak |
> |---|---|
> | Ana Modül · Alt Modül | `assets/js/shell.js` → `SECTIONS` (15 bölüm, `RAIL_ORDER` sırası) |
> | Kullanıcılar | `assets/js/shell.js` → `SEC_BY_ROLE` (bölüm erişimi) + `SECTIONS[x].menu[].roles` / `SCREEN_PERM` (ekran erişimi) + `assets/data/org.js` → `DB.permMatrix`, `DB.roles` (rol adları ve kapsam) |
> | Temel Özellikler · İlişkili Modüller | `SECTIONS` menü kalemleri ve `tasks/plan.md` → "C. MENÜ HARİTASI" / "D. EKRAN KAPSAM LİSTESİ" |
> | Öncelik | `PROMPT.md` → §25 FAZLANDIRMA |
> | Ekran sayıları | `ls app-*.html` → **135 ekran** |
>
> Kolon şeması `PROMPT.md` §26 bölüm C'dedir (7 kolon) ve birebir uygulanmıştır.
>
> **Dürüstlük notu:** `SEC_BY_ROLE` bölüm seviyesinde çalışır; alt modül seviyesinde
> ek kısıt yalnız `SCREEN_PERM` içindeki 11 ekran için tanımlıdır. "Kullanıcılar"
> kolonundaki sayılar bölüm erişimi olan rol sayısıdır (27 rol üzerinden).
> §25'te adı geçmeyen alt modüller Öncelik kolonunda **⚠** ile işaretlenmiş,
> gerekçesi dipnotta yazılmıştır.

---

## Ana tablo — 15 modül

| Ana Modül | Alt Modül | Amaç | Kullanıcılar | Temel Özellikler | İlişkili Modüller | Öncelik |
|---|---|---|---|---|---|---|
| **1. Ana Panel** (`panel`) | Dashboard · Günlük Özet · Ajanda · Görevlerim · Bekleyen Onaylar · Bildirimler · Duyurular · Yönetici Paneli *(8)* | Role göre değişen tek giriş ekranı; günün işi, bekleyen onay ve bildirimin tek yerden görülmesi | **27/27 rol** — tüm roller. *Yönetici Paneli* `SCREEN_PERM.yonetici` ile 4 role kapalıdır: Şirket Sahibi · Genel Müdür · Sistem Yön. · Operasyon Yön. | 7 rol varyantlı KPI dashboard'u, onay kuyruğu sayacı, bildirim rozet sayacı, duyuru akışı, günlük ajanda | Görev · Onay akışları (Ayarlar) · Toplantı · tüm sayaç üreten modüller | **Faz 1** (§25 "Dashboard", "Bildirimler") |
| **2. Satış ve CRM** (`satis`) | Müşteri Adayları · Satış Pipeline · Yönlendiren Kişiler · Komisyon Kazançları · Ön Analizler · Teklifler *(6)* | Aday toplama, 15 aşamalı pipeline, referans/komisyon takibi, ön analizden teklife giden satış hattı | **7/27 rol** — Şirket Sahibi · Genel Müdür · Operasyon Yön. · Satış Yön. · Satış Temsilcisi · İş Analisti · Sistem Yön. *(Satış Temsilcisi `permMatrix.gor='kendi'` — yalnız kendi kayıtları)* | 15 aşamalı kanban + aşama kuralları, lead→müşteri dönüşümü, referans türü sözlüğü, komisyon onay ve ödeme akışı, teklif versiyon/revizyon | Müşteriler · Projeler · Finans (Sözleşme) · Raporlar (Referans, Satış) | **Faz 1** (§25 "Müşteri adayları", "Referans kaynağı", "Satış pipeline", "Ön analiz", "Teklif") |
| **3. Müşteri Yönetimi** (`musteri`) | Müşteriler · Yetkili Kişiler · İletişim Geçmişi *(3)* | Müşteri kartı, yetkili kişi ve tüm iletişim temaslarının tek kayıt altında toplanması | **11/27 rol** — Şirket Sahibi · Genel Müdür · Operasyon Yön. · Satış Yön. · Satış Temsilcisi · Müşteri Temsilcisi · İş Analisti · Proje Yön. · Teknik Destek · Muhasebe · Sistem Yön. *(finans alanları `permMatrix.finans` ile maskelenir)* | 5 sekmeli müşteri listesi (Tüm/Aktif/Potansiyel/Riskli/Pasif), yetkili kişi kartı, temas geçmişi timeline'ı, yetkiye tabi finans alanları | Satış · Projeler · Finans · Destek · Dokümanlar · Raporlar | **Faz 1** (§25 "Müşteriler") · müşteri portalı **Faz 2** |
| **4. Proje Yönetimi** (`proje`) | Projeler · Milestone · Sprintler · Testler · Hatalar · Değişiklik Talepleri · Teslimler *(7)* | Yazılım teslimat hattının uçtan uca yönetimi: kapsam, sprint, kalite ve teslim | **17/27 rol** — tüm geliştirme kadrosu dâhil; hariç olanlar: Satış Temsilcisi · Müşteri Temsilcisi · İnsan Kaynakları · Muhasebe · Satın Alma Sor. · İdari İşler · Freelancer · Dış Kaynak · Stajyer · Müşteri Kullanıcısı | Proje sağlığı + bütçe/süre sapması, milestone takibi, sprint tahtası, test senaryosu ve hata kaydı, değişiklik talebi onayı, teslim paketi | Görev · Müşteriler · Finans (Bütçe) · Destek · Personel (Kapasite) · Raporlar | Projeler **Faz 1** · Sprint ve gelişmiş proje yönetimi (test, hata, değişiklik, teslim) **Faz 2** |
| **5. Görev ve İş Takibi** (`gorev`) | İş Havuzu · Bana Verilenler · Verdiğim İşler · Departman İşleri · Onay Bekleyenler · Kontrol Bekleyenler · Gecikenler · Engellenenler · Departman Talepleri *(9)* | Görevin atanması, kabulü, kontrolü ve departmanlar arası iş talebi akışı | **26/27 rol** — Müşteri Kullanıcısı hariç herkes *(kademe 4 rolleri `permMatrix.gor='kendi'`, `ekle='yok'`)* | 13 sekmeli liste, kanban/kart/tablo görünüm anahtarı, durum geçişi, onay zinciri, zaman kaydı girişi, gecikme ve engel işaretleri, departmanlar arası talep | Projeler · Sohbet (sohbetten görev) · Personel (Zaman) · Ana Panel · Raporlar | **Faz 1** (§25 "Gelişmiş görev yönetimi", "Departmanlar arası iş talebi") · sohbetten görev oluşturma **Faz 2** |
| **6. Destek ve Bakım** (`destek`) | Destek Talepleri · SLA Takibi · Bakım Paketleri · Memnuniyet *(4)* | Teslim sonrası servis: talep, SLA süresi, bakım paketi ve müşteri memnuniyeti | **12/27 rol** — Şirket Sahibi · Genel Müdür · Operasyon Yön. · Departman Yön. · Müşteri Temsilcisi · Proje Yön. · Takım Lideri · QA · DevOps · Teknik Destek · **Müşteri Kullanıcısı** · Sistem Yön. | Talep kuyruğu ve sayaç, SLA süre aşımı uyarısı, bakım paketi kapsamı, memnuniyet puanı | Müşteriler · Projeler · Görev · Finans (Bakım faturası) · Raporlar | **Faz 2** (§25 "Destek ve bakım") |
| **7. Sohbet ve İş Birliği** (`sohbet`) | Kanallar *(1)* | Departman, proje ve birebir yazışmanın CRM içinde tutulması | **26/27 rol** — Müşteri Kullanıcısı hariç herkes | Kanal listesi, okunmamış mesaj sayacı, mesajdan görev üretimi hedefi | Görev · Projeler · Ana Panel (Bildirim) | Temel sohbet **Faz 1** · sohbetten görev oluşturma **Faz 2** |
| **8. Personel ve İK** (`personel`) | Personel · İzinler · Zaman Kayıtları · Timesheet Onayı · Kapasite · Performans · Eğitim ve Yetkinlik *(7)* | Personel kartı, izin, zaman kaydı, kapasite ve gelişim yönetimi | **9/27 rol** — Şirket Sahibi · Genel Müdür · Operasyon Yön. · Departman Yön. · Proje Yön. · Takım Lideri · İnsan Kaynakları · İdari İşler · Sistem Yön. *(maaş `permMatrix.maas` ile yalnız 4 role açık: Şirket Sahibi · Genel Müdür · İnsan Kaynakları · Muhasebe)* | Personel kartı ve kapasite, maaş maskeleme, izin talep/onay akışı, timesheet onayı, doluluk oranı, performans ve yetkinlik kaydı | Görev · Projeler · Demirbaş (Zimmet) · Dokümanlar · Raporlar | Personel kartları · İzin · Zaman kaydı **Faz 1** · gelişmiş personel yönetimi · Performans · Eğitim **Faz 2** · Kapasite (tahmin) **Faz 3** |
| **9. Demirbaş ve Filo** (`varlik`) | Demirbaşlar · Zimmetler · Araçlar · Bakım · Muayene · Sigorta ve Kasko · Yakıt · Giderler · Kaza ve Ceza *(9)* | Envanter ve araç filosunun kaydı, zimmeti, periyodik yükümlülükleri ve gideri | **9/27 rol** — Şirket Sahibi · Genel Müdür · Operasyon Yön. · DevOps · İnsan Kaynakları · Muhasebe · Satın Alma Sor. · İdari İşler · Sistem Yön. | Demirbaş kartı, zimmet teslim/iade, araç kartı, bakım ve muayene tarih uyarısı, poliçe yenileme sayacı, yakıt/gider kaydı, kaza ve ceza kaydı | Personel (Zimmet) · Satın Alma · Finans · Raporlar (Filo) | Temel demirbaş · temel araç kartı **Faz 1** · Zimmet · Bakım · Muayene · Trafik sigortası · Kasko · Yakıt ve giderler **Faz 2** · Kaza ve Ceza ⚠ · gelişmiş filo analitiği **Faz 3** |
| **10. Satın Alma** (`satinalma`) | Talepler · Onay Bekleyenler · Teklif Toplama · Siparişler · Tedarikçiler *(5)* | Talepten siparişe uzanan tedarik süreci ve tedarikçi kaydı | **7/27 rol** — Şirket Sahibi · Genel Müdür · Operasyon Yön. · Muhasebe · Satın Alma Sor. · İdari İşler · Sistem Yön. | Talep formu ve onay eşiği, çok kademeli onay kuyruğu, tedarikçiden teklif toplama ve karşılaştırma, sipariş ve teslim takibi, tedarikçi kartı | Finans (Fatura) · Demirbaş (Giriş) · Ayarlar (Onay akışı) · Raporlar | **Faz 2** (§25 "Satın alma", "Tedarikçiler") |
| **11. Finans ve Sözleşme** (`finans`) | Sözleşmeler · Faturalar · Tahsilatlar · Ödeme Planları · Proje Bütçe ve Maliyet *(5)* | Sözleşmeden tahsilata finansal döngü ve proje maliyet takibi | **8/27 rol** — Şirket Sahibi · Genel Müdür · Operasyon Yön. · Satış Yön. · Proje Yön. · Muhasebe · Satın Alma Sor. · Sistem Yön. *(tamamı `permMatrix.finans=true`)* | Sözleşme kartı ve süre takibi, fatura kesimi, geciken tahsilat uyarısı (danger sayaç), ödeme planı taksitleri, proje bütçe/gerçekleşen karşılaştırması | Müşteriler · Teklif · Projeler · Satın Alma · Raporlar (Satış ve Finans) | Sözleşmeler **Faz 2** · Faturalar · Tahsilatlar · Ödeme Planları ⚠ **Faz 2** · Proje Bütçe ve Maliyet **Faz 3** (§25 "Proje kârlılığı") |
| **12. Doküman Yönetimi** (`dokuman`) | Doküman Merkezi · Süresi Dolanlar *(2)* | Tüm modüllerin dosyalarının tek arşivde toplanması ve süre takibi | **27/27 rol** — tüm roller *(dosya indirme `permMatrix.disaAktar` ile sınırlanır)* | Klasörlü doküman merkezi, sürüm ve etiket, süresi dolan belge sayacı, modül kaydına bağlama | Müşteriler · Projeler · Personel · Finans · Demirbaş · Satın Alma | **Faz 1** (§25 "Dokümanlar") · E-imza **Faz 3** |
| **13. Toplantı ve Ajanda** (`toplanti`) | Toplantılar · Takvim · Kararlar ve Aksiyonlar *(3)* | Toplantı kaydı, ortak takvim ve toplantıdan çıkan aksiyonların takibi | **23/27 rol** — Freelancer · Dış Kaynak · Stajyer · Müşteri Kullanıcısı hariç herkes | Toplantı kartı ve katılımcı, takvim görünümü (Ana Panel ile ortak `app-ajanda.html`), karar ve aksiyon maddesi → görev bağlantısı | Görev · Projeler · Ana Panel · Sohbet | ⚠ §25'te bu modül adıyla yok — takvim entegrasyonları **Faz 3**; modülün kendisi Faz 2 kabul edildi |
| **14. Raporlama Merkezi** (`rapor`) | Rapor Merkezi · Müşteri · Personel · Görev · Referans · Filo · Satış ve Finans · Proje Raporları *(8)* | Tüm modüllerin verisinin rapor ve dışa aktarma katmanı | **11/27 rol** — Şirket Sahibi · Genel Müdür · Operasyon Yön. · Departman Yön. · Satış Yön. · Proje Yön. · Takım Lideri · İnsan Kaynakları · Muhasebe · Satın Alma Sor. · Sistem Yön. *(kapsam `permMatrix.rapor`: tum / departman / proje / kendi)* | Rapor merkezi, 7 rapor grubu, kapsam filtreli veri, dışa aktarma (`permMatrix.disaAktar`) | Kaynak veriyi üreten tüm modüller | Temel raporlar **Faz 1** · gelişmiş müşteri ve personel raporları **Faz 2** · filo analitiği · otomatik yönetici raporları **Faz 3** |
| **15. Ayarlar ve Yetkilendirme** (`ayarlar`) | Şirket Bilgileri · Departmanlar · Kullanıcılar · Roller · Yetki Matrisi · Onay Akışları · Bildirim Tercihleri · Otomasyonlar · Entegrasyonlar · Log Kayıtları · Profilim · Arşiv *(12)* | Sistem yapılandırması, 27 rol ve 20 eksenli yetki matrisi, onay akışı ve log | **27/27 rol bölüme erişir**, ancak 10 alt modül `SCREEN_PERM` ile kısıtlıdır (aşağıdaki alt tabloya bakınız). Herkese açık olan yalnız **Bildirim Tercihleri** ve **Profilim**'dir | 27 rol · 20 yetki ekseni matrisi, departman ağacı, onay akışı tasarımcısı, otomasyon kuralları, entegrasyon kartları, denetim logu, arşiv geri alma | Tüm modüller (yetki kapısı ve onay akışı) | Kullanıcı ve yetkilendirme **Faz 1** · Entegrasyonlar (muhasebe, GitHub/GitLab, takvim, Slack/Teams) **Faz 3** · Çoklu şirket · SaaS lisanslama **Faz 3** |

**Toplam: 15 ana modül · 89 alt modül · 135 ekran dosyası.**

---

## Alt modül kırılımı ve ekran karşılıkları

Aşağıdaki tablolar ana tablonun "Alt Modül" kolonunun açılımıdır. `screen` anahtarı
`shell.js` içindeki `SECTIONS[x].menu[].screen` değeridir; ekran sayısı o alt modüle
ait liste + detay + form dosyalarının toplamıdır.

### 1. Ana Panel — 8 alt modül · 6 ekran (+ Ajanda ortak)

| Alt Modül | Ekran | Erişim kısıtı | Faz |
|---|---|---|---|
| Dashboard | `app-panel.html` | — | 1 |
| Günlük Özet | `app-panel-ozet.html` | — | 1 ⚠ |
| Ajanda | `app-ajanda.html` | — (Toplantı modülüyle ortak) | 2 ⚠ |
| Görevlerim | `app-gorev.html?t=bana` | — | 1 |
| Bekleyen Onaylar | `app-panel-onaylar.html` | — | 1 |
| Bildirimler | `app-panel-bildirimler.html` | — | 1 |
| Duyurular | `app-panel-duyurular.html` | — | 1 ⚠ |
| Yönetici Paneli | `app-panel-yonetici.html` | `roles: sahip · genelmudur · sistem · operasyon` | 1 |

### 2. Satış ve CRM — 6 alt modül · 16 ekran

| Alt Modül | Ekran | Faz |
|---|---|---|
| Müşteri Adayları | `app-lead.html` · `-detay` · `-form` | 1 |
| Satış Pipeline | `app-pipeline.html` | 1 |
| Yönlendiren Kişiler | `app-referans.html` · `-detay` · `-form` | 1 |
| Komisyon Kazançları | `app-komisyon.html` · `-detay` · `-form` | 1 |
| Ön Analizler | `app-onanaliz.html` · `-detay` · `-form` | 1 |
| Teklifler | `app-teklif.html` · `-detay` · `-form` | 1 |

### 3. Müşteri Yönetimi — 3 alt modül · 7 ekran

| Alt Modül | Ekran | Faz |
|---|---|---|
| Müşteriler | `app-musteri.html` · `-detay` · `-form` | 1 |
| Yetkili Kişiler | `app-musteri-yetkili.html` · `-form` | 1 |
| İletişim Geçmişi | `app-musteri-iletisim.html` · `-form` | 1 |

### 4. Proje Yönetimi — 7 alt modül · 18 ekran

| Alt Modül | Ekran | Faz |
|---|---|---|
| Projeler | `app-proje.html` · `-detay` · `-form` | 1 |
| Milestone | `app-proje-milestone.html` | 1 |
| Sprintler | `app-proje-sprint.html` · `-form` | 2 |
| Testler | `app-proje-test.html` · `-detay` · `-form` | 2 |
| Hatalar | `app-proje-hata.html` · `-detay` · `-form` | 2 |
| Değişiklik Talepleri | `app-proje-degisiklik.html` · `-detay` · `-form` | 2 |
| Teslimler | `app-proje-teslim.html` · `-detay` · `-form` | 2 |

### 5. Görev ve İş Takibi — 9 alt modül · 6 ekran

Sekiz alt modül tek liste ekranının `?t=` sekmeleridir; bu bilinçli bir ortak
bileşen kararıdır (`app-gorev.html` 13 sekme).

| Alt Modül | Ekran | Faz |
|---|---|---|
| İş Havuzu | `app-gorev.html?t=havuz` | 1 |
| Bana Verilenler | `app-gorev.html?t=bana` | 1 |
| Verdiğim İşler | `app-gorev.html?t=verdigim` | 1 |
| Departman İşleri | `app-gorev.html?t=departman` | 1 |
| Onay Bekleyenler | `app-gorev.html?t=onay` | 1 |
| Kontrol Bekleyenler | `app-gorev.html?t=kontrol` | 1 |
| Gecikenler | `app-gorev.html?t=geciken` | 1 |
| Engellenenler | `app-gorev.html?t=engel` | 1 |
| Departman Talepleri | `app-istalebi.html` · `-detay` · `-form` | 1 |

### 6. Destek ve Bakım — 4 alt modül · 6 ekran

| Alt Modül | Ekran | Faz |
|---|---|---|
| Destek Talepleri | `app-destek.html` · `-detay` · `-form` | 2 |
| SLA Takibi | `app-destek-sla.html` | 2 |
| Bakım Paketleri | `app-destek-paket.html` | 2 |
| Memnuniyet | `app-destek-memnuniyet.html` | 2 |

### 7. Sohbet — 1 alt modül · 1 ekran

| Alt Modül | Ekran | Faz |
|---|---|---|
| Kanallar | `app-sohbet.html` | 1 |

### 8. Personel ve İK — 7 alt modül · 11 ekran

| Alt Modül | Ekran | Faz |
|---|---|---|
| Personel | `app-personel.html` · `-detay` · `-form` | 1 |
| İzinler | `app-izin.html` · `-detay` · `-form` | 1 |
| Zaman Kayıtları | `app-zaman.html` | 1 |
| Timesheet Onayı | `app-zaman-onay.html` | 1 |
| Kapasite | `app-kapasite.html` | 3 |
| Performans | `app-performans.html` | 2 |
| Eğitim ve Yetkinlik | `app-egitim.html` | 2 |

### 9. Demirbaş ve Filo — 9 alt modül · 17 ekran

| Alt Modül | Ekran | Faz |
|---|---|---|
| Demirbaşlar | `app-demirbas.html` · `-detay` · `-form` | 1 |
| Zimmetler | `app-zimmet.html` · `-form` | 2 |
| Araçlar | `app-arac.html` · `-detay` · `-form` | 1 |
| Bakım | `app-arac-bakim.html` · `-form` | 2 |
| Muayene | `app-arac-muayene.html` · `-form` | 2 |
| Sigorta ve Kasko | `app-arac-sigorta.html` | 2 |
| Yakıt | `app-arac-yakit.html` | 2 |
| Giderler | `app-arac-gider.html` | 2 |
| Kaza ve Ceza | `app-arac-kaza.html` | 2 ⚠ |

### 10. Satın Alma — 5 alt modül · 10 ekran

| Alt Modül | Ekran | Faz |
|---|---|---|
| Talepler | `app-satinalma.html` · `-detay` · `-form` | 2 |
| Onay Bekleyenler | `app-satinalma.html?t=onay` | 2 |
| Teklif Toplama | `app-satinalma-teklif.html` | 2 |
| Siparişler | `app-siparis.html` · `-detay` · `-form` | 2 |
| Tedarikçiler | `app-tedarikci.html` · `-detay` · `-form` | 2 |

### 11. Finans ve Sözleşme — 5 alt modül · 10 ekran

| Alt Modül | Ekran | Faz |
|---|---|---|
| Sözleşmeler | `app-sozlesme.html` · `-detay` · `-form` | 2 |
| Faturalar | `app-fatura.html` · `-detay` · `-form` | 2 ⚠ |
| Tahsilatlar | `app-tahsilat.html` · `-detay` | 2 ⚠ |
| Ödeme Planları | `app-odemeplani.html` | 2 ⚠ |
| Proje Bütçe ve Maliyet | `app-butce.html` | 3 |

### 12. Doküman Yönetimi — 2 alt modül · 3 ekran

| Alt Modül | Ekran | Faz |
|---|---|---|
| Doküman Merkezi | `app-dokuman.html` · `-detay` | 1 |
| Süresi Dolanlar | `app-dokuman-sure.html` | 1 |

### 13. Toplantı ve Ajanda — 3 alt modül · 5 ekran

| Alt Modül | Ekran | Faz |
|---|---|---|
| Toplantılar | `app-toplanti.html` · `-detay` · `-form` | 2 ⚠ |
| Takvim | `app-ajanda.html` | 2 ⚠ |
| Kararlar ve Aksiyonlar | `app-toplanti-karar.html` | 2 ⚠ |

### 14. Raporlama Merkezi — 8 alt modül · 8 ekran

| Alt Modül | Ekran | Faz |
|---|---|---|
| Rapor Merkezi | `app-rapor.html` | 1 |
| Müşteri Raporları | `app-rapor-musteri.html` | 1 → gelişmişi 2 |
| Personel Raporları | `app-rapor-personel.html` | 1 → gelişmişi 2 |
| Görev Raporları | `app-rapor-gorev.html` | 1 |
| Referans Raporları | `app-rapor-referans.html` | 1 |
| Filo Raporları | `app-rapor-filo.html` | 3 |
| Satış ve Finans | `app-rapor-finans.html` | 2 ⚠ (finansal tahminler kısmı 3) |
| Proje Raporları | `app-rapor-proje.html` | 2 ⚠ (proje kârlılığı kısmı 3) |

### 15. Ayarlar ve Yetkilendirme — 12 alt modül · 12 ekran

| Alt Modül | Ekran | Erişim kısıtı (`SCREEN_PERM`) | Faz |
|---|---|---|---|
| Şirket Bilgileri | `app-ayar-sirket.html` | sahip · genelmudur · sistem | 1 |
| Departmanlar | `app-ayar-departman.html` | sahip · genelmudur · sistem · operasyon · ik | 1 |
| Kullanıcılar | `app-ayar-kullanici.html` | sahip · genelmudur · sistem | 1 |
| Roller | `app-ayar-rol.html` | sahip · genelmudur · sistem | 1 |
| Yetki Matrisi | `app-ayar-yetki.html` | sahip · genelmudur · sistem | 1 |
| Onay Akışları | `app-ayar-onay.html` | sahip · genelmudur · sistem · operasyon | 1 |
| Bildirim Tercihleri | `app-ayar-bildirim.html` | **kısıt yok — 27 rol** | 1 |
| Otomasyonlar | `app-ayar-otomasyon.html` | sahip · genelmudur · sistem · operasyon | 2 ⚠ |
| Entegrasyonlar | `app-ayar-entegrasyon.html` | sahip · genelmudur · sistem · devops | 3 |
| Log Kayıtları | `app-ayar-log.html` | sahip · genelmudur · sistem · operasyon · devops | 1 |
| Profilim | `app-ayar-profil.html` | **kısıt yok — 27 rol** | 1 |
| Arşiv | `app-ayar-arsiv.html` | sahip · genelmudur · sistem · operasyon | 1 |

---

## ⚠ işaretli kalemler — §25'te doğrudan karşılığı olmayanlar

PROMPT.md §25 fazlandırma listesi 53 kalem içerir ve alt modül granülaritesinde
değildir. Aşağıdaki 15 alt modülün §25'te birebir adı geçmez; faz ataması en yakın
üst kalemden türetilmiştir ve **doğrulanması gereken varsayımdır**:

| Alt Modül | Atanan Faz | Dayanak |
|---|---|---|
| Günlük Özet · Duyurular | 1 | §25 "Dashboard" ve "Bildirimler" kapsamında sayıldı |
| Ajanda · Takvim · Toplantılar · Kararlar ve Aksiyonlar | 2 | §25'te modül olarak yok; yalnız "Takvim entegrasyonları" (Faz 3) var, o da entegrasyon tarafı |
| Kaza ve Ceza | 2 | §25 "Yakıt ve giderler" filo kalemleriyle birlikte |
| Faturalar · Tahsilatlar · Ödeme Planları | 2 | §25 "Sözleşmeler" (Faz 2) ile aynı finans döngüsü; "Muhasebe entegrasyonu" Faz 3 ayrı |
| Satış ve Finans Raporları · Proje Raporları | 2 | Temel raporlar Faz 1, tahmin ve kârlılık kısmı Faz 3 — arada kaldığı için 2 |
| Otomasyonlar | 2 | §25'te yok; "Yapay zekâ özellikleri" (Faz 3) ile karıştırılmaması için 2 |

Bunlar dışındaki tüm faz atamaları §25'teki kalem adıyla birebir eşleşir.

---

## Kaynak dosyalar

| Ne | Dosya |
|---|---|
| Bölüm ve menü modeli | `assets/js/shell.js` (satır 21–191: `SECTIONS`, `RAIL_ORDER`, `SCREEN_PERM`) |
| Rol → bölüm erişimi | `assets/js/shell.js` (satır 193–221: `SEC_BY_ROLE`) |
| 27 rol ve yetki matrisi | `assets/data/org.js` (satır 48–111: `DB.roles`, `DB.permMatrix`) |
| Kolon şeması | `PROMPT.md` §26-C |
| Fazlandırma | `PROMPT.md` §25 |
| Menü ve ekran kapsamı | `tasks/plan.md` bölüm C ve D |
