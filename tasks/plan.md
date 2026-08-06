# plan.md — GaviaWorks CRM Kapsam Listesi ve Yol Haritası

**İLERLEME: 251 / 297 madde tamam (%84) · 19 kısmen · 27 açık** — 11. oturum, 2026-08-05
> Sayı `grep -c '^- \[x\]'` ile ölçüldü, elle yazılmadı. VB-28 kapandı (3 madde `[~]`→`[x]`),
> payda 292→294'e çıktı: `bag.js` kalıcı tarama ekseni ve VB-28'in kendi maddesi eklendi.
> Sayı 237'den 275'e çıktı: form ekranları kuyruğu (36 hedef + duyuru-detay) madde madde yazıldı.
>
> **Sayım düzeltmesi (9. oturum):** başlık bir tur boyunca **195 / 274** diyordu; işaret
> kutuları sayıldığında gerçek **196 / 275** çıktı — bir madde eksik sayılmış. Sayı artık
> `grep -c '^- \[x\]'` ile ölçülüyor, elle güncellenmiyor.
>
> **Toplam 275'ten 280'e çıktı:** 9. oturumda ölçülen beş yeni borç (UID-26..29 · VB-27)
> FAZ bölümüne madde olarak eklendi. Payda büyüdüğü için yüzde sabit kaldı — **bu doğrudur**,
> yeni iş bulmak ilerlemeyi geri almaz ama bitiş çizgisini uzatır.
>
> **9. oturumda kapanan 16 madde:** dört doküman (G · I · J · L) + **12 eskimiş kayıt**.
> O on ikisi hâlâ "form bekliyor" diyordu, oysa form bloğu 8. oturumda **36/36** kapanmıştı;
> defter ekranların gerisinde kalmıştı. `[~]`→`[x]` geçen 11 madde bu yüzden; görev formu
> `[ ]`→`[~]` oldu (form var, **kontrol listesi koleksiyonu** hâlâ veride yok).

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

> **Durum:** 27 rolün 27'si `assets/data/org.js` → `DB.roles` içinde tanımlı
> (`key · ad · dash · kademe`), 6 dashboard varyantı `dash` alanıyla eşleniyor,
> rol değiştirici tüm ekranlarda çalışıyor (`gate.js` 105 ekran × 5 rol temiz).

- [x] Şirket sahibi · Genel müdür · Operasyon yöneticisi · Departman yöneticisi
- [x] Satış yöneticisi · Satış temsilcisi · Müşteri temsilcisi · İş analisti
- [x] Proje yöneticisi · Takım lideri · UI/UX tasarımcı · Front-end geliştirici
- [x] Back-end geliştirici · Mobil geliştirici · Yapay zekâ geliştiricisi
- [x] Test ve kalite uzmanı · DevOps personeli · Teknik destek personeli
- [x] İnsan kaynakları · Muhasebe · Satın alma sorumlusu · İdari işler sorumlusu
- [x] Freelancer · Dış kaynak ekip · Stajyer · Müşteri kullanıcısı · Sistem yöneticisi
- [x] Yetki eksenleri `DB.permMatrix`'te (20 eksen × 27 rol) · `app-ayar-yetki.html` matrisi
- [~] Erişim seviyeleri: rol · kullanıcı · departman · proje · kayıt · alan · tenant çözümleyicide
      var; **`GV.perm.scope('gor')` liste ekranlarında satır kapsamına uygulanmıyor** (UID-05)

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
- [x] Günlük Özet · Bekleyen Onaylar · Bildirimler · Duyurular · Yönetici Paneli (ayrı ekranlar) — Wave 1 TAMAM

### Wave 2 — kısmen başlandı
- [x] `app-lead.html` — müşteri adayları listesi (8 sekme, 9 filtre, 13 kolon)
- [x] `app-lead-detay.html` — lead detayı (9 sekme, 28 alan, aşama geçmişi, müşteriye dönüştürme)
- [x] `app-teklif.html` — teklif listesi (8 sekme, geçerlilik + onay takibi, revize teklif akışı)
- [x] `app-gorev.html` — görev listesi (13 sekme, kanban/kart/tablo)
- [x] `app-gorev-detay.html` — görev detayı (8 sekme, durum geçişi, zaman kaydı, onay zinciri)
- [x] `app-musteri.html` — müşteri listesi (5 sekme, finans alanları yetkiye tabi)
- [x] `app-proje.html` — proje listesi (8 sekme, sağlık + bütçe/süre sapması)
- [x] `app-personel.html` — personel listesi (6 sekme, kapasite + maaş maskeleme)

### Wave 2 — Satış & CRM (§8, §9, §10)
- [x] Müşteri Adayları listesi (28 alan · §8.1) + detay + form
      → `app-lead.html` ✅ (8 sekme, 9 filtre, 13 kolon) · `app-lead-detay.html` ✅ (9 sekme) · `app-lead-form.html` ✅
- [x] Satış Pipeline — 15 aşamalı kanban (§8.2) + aşama kuralları (zorunlu alan, sorumlu, onay, otomatik görev, max bekleme, gecikme uyarısı)
      → `app-pipeline.html` (`DB.pipelineStages` 15 aşama, 10 kural ekseni drawer'da, max bekleme aşımı kolonu)
- [x] Satış Fırsatı detayı → fırsat `DB.leads` ekseninde modellendi; pipeline satır aksiyonu
      `app-lead-detay.html`'i açar (ayrı ekran üretilmedi, bilinçli)
- [x] Referans Kaynakları (17 tür · §9) + Yönlendiren Kişi kartı (21 alan) + detay + form
      → `app-referans.html` ✅ · `app-referans-detay.html` ✅ (6 sekme) · `app-referans-form.html` ✅
- [x] Referans komisyon akışı → `app-komisyon.html` · `app-komisyon-detay.html` (6 sekme, onay + ödeme mutasyonu) · yönlendiren detayının komisyon sekmesi (kart ↔ kayıt doğrulaması canon eksen 14)
- [~] Ön Analiz listesi (28 değerlendirme alanı · §10) + detay + form + 10 çıktı
      → `app-onanaliz.html` ✅ · `app-onanaliz-detay.html` ✅ (7 sekme, 28 alanın 28'i veride mevcut) · `app-onanaliz-form.html` ✅ · **10 çıktı bekliyor** (§10)
- [x] Teklifler listesi (25 alan · §10) + detay (kalemler, versiyon, revizyon) + form + PDF çıktı
      → `app-teklif.html` ✅ · `app-teklif-detay.html` ✅ (7 sekme) · `app-teklif-form.html` ✅ ·
      PDF `GV.list` `export` şeridinden

### Wave 3 — Müşteriler (§8.3)
- [x] Müşteri listesi (sekmeler: Tüm/Aktif/Potansiyel/Riskli/Pasif) → `app-musteri.html` (5 sekme)
- [x] `app-musteri-detay.html` — müşteri detayı, **15 sekme** (finans maskeleme, iletişim kaydı ekleme modalı)
- [x] Müşteri detayı — **15 sekme:** Genel Bilgiler · Yetkililer · İletişim Geçmişi · Satış Fırsatları · Teklifler · Sözleşmeler · Projeler · Görevler · Toplantılar · Destek Talepleri · Faturalar · Tahsilatlar · Dosyalar · Raporlar · Aktivite Geçmişi
- [x] Yetkili kişiler listesi → `app-musteri-yetkili.html` · İletişim geçmişi → `app-musteri-iletisim.html`
- [x] Müşteri formu + Yetkili formu + İletişim kaydı formu → `app-musteri-form.html` ✅ ·
      `app-musteri-yetkili-form.html` ✅ · `app-musteri-iletisim-form.html` ✅

### Wave 4 — Projeler (§11)
- [x] `app-proje-detay.html` — proje detayı, **22 sekme** (Gantt sekmesi `.gv-gantt` CSS'ini nihayet tüketti, teknik envanter, iş yükü, kanban)
- [x] `app-proje-milestone.html` — milestone listesi (taksit sırası, sözleşme→fatura→tahsilat zinciri, faturası kesilmemiş sekmesi, finans maskeleme)
- [x] `app-proje-sprint.html` — sprint listesi (hız/tamamlanma oranı, sprint görev kırılımı)
- [x] `app-proje-test.html` — test koşumları (senaryo/başarı oranı, projedeki açık hata bağı)
- [x] `app-proje-test-detay.html` — test koşumu detayı (6 sekme, sayım tutarlılık denetimi, aday hata listesi)
- [x] `app-proje-hata.html` — hata listesi (şiddet/öncelik, hatadan görev üretme, kanban)
- [x] `app-proje-hata-detay.html` — hata detayı (7 sekme, şiddet→etki eşlemesi, durum geçişi)
- [x] `app-proje-degisiklik.html` — değişiklik talepleri (süre/maliyet etkisi, onay akışı, ek teklif yolu)
- [x] `app-proje-degisiklik-detay.html` — değişiklik talebi detayı (7 sekme, etki analizi, sözleşme etkisi projeksiyonu)
- [x] `app-proje-teslim.html` — teslimler (müşteri onayı, teslim→taksit→fatura zinciri)
- [x] `app-proje-teslim-detay.html` — teslim detayı (6 sekme, altı kontrollük zincir doğrulaması)
- [x] Proje listesi + form (24 alan) → `app-proje.html` ✅ (8 sekme, sağlık + sapma) · `app-proje-form.html` ✅
- [x] Proje detayı — **22 sekme:** Genel Bakış · Proje Ekibi · Modüller · Milestone · Sprintler · Görevler · İş Yükü · Takvim · Gantt · Kanban · Zaman Kayıtları · Toplantılar · Dosyalar · Revizyonlar · Değişiklik Talepleri · Testler · Hatalar · Teslimler · Bütçe · Maliyetler · Raporlar · Aktivite Geçmişi
- [x] Teknik envanter alanları (repo, canlı, test, tasarım, sunucu, 3. taraf servisler — §3)
      → `app-proje-detay.html` teknik envanter sekmesi

### Wave 5 — Görevler (§12)
- [~] Görev listesi — 13 sekme, 4 görünüm (tablo/kart/kanban/takvim)
      → `app-gorev.html` ✅ 13 sekme · **3 görünüm** (`views:['table','kanban','card']`) —
      **takvim görünümü yok**, görevler yalnız `app-ajanda.html`'de takvim ekseninde görünüyor
- [x] Görev detayı — 50+ alanlı görev kartı → `app-gorev-detay.html` (8 sekme, durum geçişi,
      zaman kaydı, onay zinciri, alt görev, bağımlılık)
- [~] Görev formu + alt görev + kontrol listesi + bağımlılık
      → `app-gorev-form.html` ✅ · `DB.subtasks` ✅ · `DB.taskDeps` ✅ ·
      **kontrol listesi koleksiyonu veride yok**
- [x] 19 görev durumu + geçiş kuralları (yetki, zorunlu alan, bildirim) → `DB.taskStatuses` 19 kayıt
- [x] 18 görev türü → `DB.taskTypes` 18 kayıt
- [x] 15 görev otomasyonu (§12 — atama, kabul, termin, gecikme, eskalasyon, bağımlılık, kontrol, revizyon, tekrarlayan, iş yükü)
      → `DB.automations` 22 kural · `app-ayar-otomasyon.html`
- [x] Departmanlar arası iş talebi (§13) — liste + detay + form
      → `app-istalebi.html` ✅ · `app-istalebi-detay.html` ✅ (6 sekme, kabul akışı + göreve dönüşüm) · `app-istalebi-form.html` ✅

### Wave 6 — Personel & İK (§14)
- [x] Personel listesi + detay (23 alan) + form
      → `app-personel.html` ✅ · `app-personel-detay.html` ✅ (11 sekme) · `app-personel-form.html` ✅
- [x] İzin yönetimi (6 izin türü, bakiye, vekil, onay akışı, çakışma kontrolü, departman takvimi)
      → `app-izin.html` ✅ · `app-izin-detay.html` ✅ (6 sekme, çakışma tarihlerden hesaplanıyor) · `app-izin-form.html` ✅
- [x] `app-zaman.html` — zaman kayıtları (manuel giriş, faturalanabilirlik)
- [x] `app-zaman-onay.html` — haftalık timesheet onayı (kırılım drawer'ı, iade akışı, eksik/fazla mesai)
- [x] `app-kapasite.html` — kapasite ve doluluk
- [x] `app-performans.html` — performans yönetimi (karar desteği, otomatik karar yok)
- [x] `app-egitim.html` — eğitim ve yetkinlik (katılımcı kırılımı matrisi, maliyet maskeleme)
- [ ] Zaman kaydı zamanlayıcısı (start/stop)
- [ ] Yetkinlik ekseni — `DB.trainings`'te yetkinlik/kazanım alanı yok (VB kaydı gerekli)

### Wave 7 — Demirbaş & Filo (§15, §16)
- [x] Demirbaş listesi (19 kategori) + detay (28 alan) + form
      → `app-demirbas.html` ✅ · `app-demirbas-detay.html` ✅ (6 sekme) · `app-demirbas-form.html` ✅
- [~] Zimmet süreci (12 adım: seçim, tutanak, dijital onay, fotoğraf, iade, hasar, çıkış kontrolü)
      → `app-zimmet.html` ✅ (zimmet/iade listesi, `DB.assignments` 7 kayıt) ·
      **tutanak, dijital onay, fotoğraf ve hasar adımları veride yok** · zimmet formu bekliyor
- [x] Araç listesi + detay + form (**demirbaştan ayrı özel modül**)
      → `app-arac.html` ✅ · `app-arac-detay.html` ✅ (10 sekme) · `app-arac-form.html` ✅ + 6 filo formu
- [x] Araç: kimlik · satın alma/kiralama · zimmet · bakım · muayene · trafik sigortası · kasko · yakıt/şarj · giderler (18 kalem) · kaza/hasar/ceza
- [x] Yenileme bildirimleri: 60/30/15/7 gün + süresi doldu (`app-arac-detay` yenileme takvimi)
- [x] Araç maliyet hesabı (aylık / yıllık / km başına) — veriden türetiliyor, yazılı değil

### Wave 8 — Satın Alma & Tedarik (§17)
- [x] Satın alma talebi listesi + detay + form (14 alan)
      → `app-satinalma.html` ✅ · `app-satinalma-detay.html` ✅ (6 sekme) · `app-satinalma-form.html` ✅
- [x] Tutar/kategoriye göre çok aşamalı onay akışı (6 onay makamı) — `app-ayar-onay` + talep detayı `GV.chain`
- [x] `app-satinalma-teklif.html` — teklif toplama ve karşılaştırma (9 kriter, yan yana matris, tedarikçi seçimi)
- [~] Sipariş & teslimat (18 alan) + eksik teslim + iade
      → `app-siparis.html` ✅ · `app-siparis-detay.html` ✅ (7 sekme) · **eksik/kısmi teslim ve iade alanı veride yok**
- [x] Demirbaşa / araca otomatik aktarım → `DB.assets[].siparis` yazılı, `SIP-2026-008` üç demirbaş
      doğurdu, Σ net = siparişin neti (VB-07 kapandı)
- [x] Tedarikçi listesi + detay + puanlama → `app-tedarikci.html` · `app-tedarikci-detay.html` (5 sekme, iki puan ekseni ayrı)

### Wave 9 — Destek & Sohbet (§18, §13)
- [x] `app-destek.html` — destek talepleri listesi (18 alan, SLA, memnuniyet)
- [x] `app-destek-sla.html` — SLA takibi (politika matrisi drawer'ı, ilk yanıt/çözüm ekseni,
      eskalasyon akışı, sorumlu ataması)
- [x] `app-destek-paket.html` — bakım paketleri (kota tüketimi, yenileme takibi, sözleşme
      bağlantısı, finans maskeleme)
- [x] `app-destek-memnuniyet.html` — memnuniyet anketleri (puan dağılımı, NPS, yanıt oranı,
      düşük puan takibi)
- [x] Ortak katman: `DB.slaPolicies` · `DB.surveys` · `GV.badge` destek durumları
- [x] Destek talebi detay + form ekranı → `app-destek-detay.html` ✅ (6 sekme) · `app-destek-form.html` ✅
- [x] Destek → görev / hata / geliştirme / değişiklik / ek teklif dönüşümü
      → `DB.tasks[].destek` · `DB.bugs[].destek` · `DB.changeRequests[].destek` yazılı (VB-05 kapandı)
- [x] `app-sohbet.html` — sohbet modülü (11 kanal türü, kanal/mesaj arama, tepki, dosya paylaşımı, kanal bilgisi drawer'ı)
- [x] Sohbetten görev oluşturma (16 alanlı devir → `DB.tasks` + aktivite kaydı + kanala durum mesajı)

### Wave 10 — Toplantı, Ajanda, Doküman (§19)
- [x] `app-ajanda.html` — ajanda (gün/hafta/ay görünümü, 8 olay kaynağı, kaynak çipleri, olay drawer'ı, URL senkronu)
- [x] `app-toplanti.html` — toplantılar (6 tür)
- [x] `app-toplanti-karar.html` — kararlar ve aksiyonlar (termin, gecikme, göreve dönüşüm)
- [x] Toplantı kararından görev oluşturma (tek işlemle, gerçek `DB.tasks` kaydı)
- [x] `app-dokuman.html` — doküman merkezi
- [x] `app-dokuman-sure.html` — son kullanma ve yenileme takibi (gizlilik maskeleme)
- [x] `app-toplanti-detay.html` — toplantı detayı (7 sekme: gündem, katılımcılar, kararlar, notlar, dosyalar; karardan görev üretme)
- [~] Doküman versiyon geçmişi ve dijital onay akışı → `app-dokuman-detay.html` ✅ (7 sekme);
      **versiyon geçmişi ve onay zinciri koleksiyonları veride yok**, ekran bunu dürüstçe bildiriyor

### Wave 10b — Finans (menü §11 · PROMPT.md §10, §22)
- [x] `app-sozlesme.html` — sözleşmeler (6 sekme, 12 kolon, yenileme akışı, finans maskeleme)
- [x] `app-sozlesme-detay.html` — sözleşme detayı (7 sekme, Σ taksit doğrulaması, net/brüt ayrı eksende, yenileme penceresi)
- [x] `app-fatura.html` — faturalar (5 sekme, 11 kolon, vade/gecikme takibi, ödendi işaretleme)
- [x] `app-fatura-detay.html` — fatura detayı (6 sekme, net/KDV/brüt dökümü, taksit ↔ fatura doğrulaması)
- [x] `app-tahsilat.html` — tahsilatlar (5 sekme, gecikme günü, hatırlatma aksiyonu)
- [x] `app-tahsilat-detay.html` — tahsilat detayı (6 sekme, gecikme kademesi, müşterinin açık alacakları)
- [x] `app-butce.html` — proje bütçe ve maliyet (bütçe/maliyet karşılaştırma grafiği, aşım takibi, 14 kolon)
- [x] `app-odemeplani.html` — ödeme planları (milestone → sözleşme → fatura → tahsilat zinciri, faturası kesilmemiş taksit uyarısı)
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

### Wave 12b — FORM EKRANLARI (kuyruğun en kalabalık bloğu)

> **Kaynak:** `node links.js` "henüz üretilmemiş hedefler" kuyruğu — 36 form hedefi.
> Hepsi bir liste ya da detay ekranından `data-wip` olarak bağlanıyor; ekran doğunca
> `shell.js` `BUILT` dizisine eklenir ve bağlantı kendiliğinden gerçek `href`'e döner.
> **Sözleşme:** `tasks/form-brief.md` — her ajana ilk iş bu okutulur.

**Ortak sözleşme (her form ekranı için geçerli):** `GV.form({sections:[...]})` kullanılır,
yeni markup icat edilmez · hem **yeni kayıt** hem **düzenleme** modu, mod adres
parametresinden (`?id=`) gelir · zorunlu alan doğrulaması + alan bazlı hata mesajı +
kaydetmeden ayrılma uyarısı · yetki kapısı (yetkisiz rolde form açılmaz, 403) ·
kaydet sonrası `location.reload` **yasak**, `GV.refresh` ile biter ve listeye döner ·
dinleyiciler `GV.on` ile bağlanır (ders **L-16**) · sayfaya özel `<style>` yazılmaz.

#### Satış ve müşteri (8)
- [x] `app-lead-form.html` — müşteri adayı (28 alan · §8.1) ← `app-lead.html` · `app-lead-detay.html`
- [x] `app-musteri-form.html` — müşteri kartı ← `app-musteri.html` · `app-musteri-detay.html`
- [x] `app-musteri-yetkili-form.html` — müşteri yetkilisi ← `app-musteri-yetkili.html`
- [x] `app-musteri-iletisim-form.html` — iletişim kaydı ← `app-musteri-iletisim.html`
- [x] `app-referans-form.html` — yönlendiren kişi (21 alan · §9) ← `app-referans.html`
- [x] `app-komisyon-form.html` — referans komisyonu ← `app-komisyon.html`
- [x] `app-onanaliz-form.html` — ön analiz (28 değerlendirme alanı · §10) ← `app-onanaliz.html`
- [x] `app-teklif-form.html` — teklif + kalemler (25 alan · §10) ← `app-teklif.html`

#### Proje ve görev (7)
- [x] `app-proje-form.html` — proje (24 alan + teknik envanter) ← `app-proje.html`
- [x] `app-proje-sprint-form.html` — sprint ← `app-proje-sprint.html`
- [x] `app-proje-test-form.html` — test koşumu (kapsam modülleri + sprint) ← `app-proje-test.html`
- [x] `app-proje-hata-form.html` — hata kaydı (şiddet→etki eşlemesi) ← `app-proje-hata.html`
- [x] `app-proje-degisiklik-form.html` — değişiklik talebi (süre/maliyet etkisi) ← `app-proje-degisiklik.html`
- [x] `app-proje-teslim-form.html` — teslim (kapsam + taksit bağı) ← `app-proje-teslim.html`
- [x] `app-gorev-form.html` — görev (50+ alan, alt görev, bağımlılık) ← `app-gorev.html`

#### Destek ve iş talebi (3)
- [x] `app-destek-form.html` — destek talebi (18 alan, SLA) ← `app-destek.html`
- [x] `app-destek-paket-form.html` — bakım paketi ← `app-destek-paket.html`
- [x] `app-istalebi-form.html` — departmanlar arası iş talebi (§13) ← `app-istalebi.html`

#### Personel ve İK (3)
- [x] `app-personel-form.html` — personel (23 alan, maaş maskeleme) ← `app-personel.html`
- [x] `app-izin-form.html` — izin talebi (bakiye, vekil, çakışma) ← `app-izin.html`
- [x] `app-performans-form.html` — performans değerlendirme ← `app-performans.html`

#### Demirbaş ve filo (9)
- [x] `app-demirbas-form.html` — demirbaş (28 alan · §15) ← `app-demirbas.html`
- [x] `app-zimmet-form.html` — zimmet / iade tutanağı ← `app-zimmet.html`
- [x] `app-arac-form.html` — araç (§16 kimlik + satın alma/kiralama) ← `app-arac.html`
- [x] `app-arac-bakim-form.html` — araç bakım kaydı ← `app-arac-bakim.html`
- [x] `app-arac-muayene-form.html` — muayene kaydı ← `app-arac-muayene.html`
- [x] `app-arac-sigorta-form.html` — sigorta / kasko poliçesi ← `app-arac-sigorta.html`
- [x] `app-arac-yakit-form.html` — yakıt / şarj kaydı ← `app-arac-yakit.html`
- [x] `app-arac-gider-form.html` — araç gideri (18 kalem) ← `app-arac-gider.html`
- [x] `app-arac-kaza-form.html` — kaza / hasar / ceza ← `app-arac-kaza.html`

#### Satın alma ve finans (5)
- [x] `app-satinalma-form.html` — satın alma talebi (14 alan · §17) ← `app-satinalma.html`
- [x] `app-siparis-form.html` — sipariş (18 alan + teslim kontrolü) ← `app-siparis.html`
- [x] `app-tedarikci-form.html` — tedarikçi ← `app-tedarikci.html`
- [x] `app-sozlesme-form.html` — sözleşme (net/KDV/brüt ekseni) ← `app-sozlesme.html`
- [x] `app-fatura-form.html` — fatura ← `app-fatura.html`

#### Toplantı (1)
- [x] `app-toplanti-form.html` — toplantı (gündem + katılımcılar) ← `app-toplanti.html`

#### Kuyruktaki tek form olmayan hedef
- [x] `duyuru-detay` — `app-panel-duyurular.html` hem liste hem `GV.form` kullanıyor ve duyuruyu
      **sağ panelde** açıyor. Ayrı ekran gerekmez; `app-panel-duyurular.html`'e `?id=` derin
      bağlantısı eklenip `app-ayar-log.html`'deki hedef ona çevrilecek.

### Wave 13 — Kapanış
- [x] Tüm `data-wip` bağlantıların gerçek `href`'e çevrilmesi → `links.js` **TEMİZ**,
      kuyrukta **0 hedef**; 141 ekran · 142 BUILT kaydı · kırık/hayalet/yetim yok (9. oturum)
- [x] Modüller arası veri ilişkisi doğrulaması (§22 — **37** bağlantı, 38 değil) — **kapandı 11. oturum**
      → 9. oturumun "3 YOK · 1 yarım" kaydı ölçüldü: **üç "eksik" bağın ikisi zaten vardı**,
      ters yönde (`DB.leads[].musteri` 4/12 · `DB.messages[].gorev` 1/6). `customers.lead` ve
      `tasks.kanal` §9d'nin **yasakladığı ayna alanlar**dır, açılmadı (V-38). Gerçekten eksik olan
      `vehicles.siparis` yazıldı (`SAT-2025-010` → `SIP-2025-006` → ARC-004) · boş kalan
      `tasks.destek` ve `changeRequests.destek` gerçek kayıtla dolduruldu (`GRV-2026-126` ·
      `DGS-2026-016`). Eksen: `canon.js` **21** (706 kontrol) + `tasks/qa/bag.js` (12 vaka)
- [x] Canonical veri tutarlılığı taraması → `canon.js` **TEMİZ, 607 kontrol** (9. oturum)
- [x] 1440 / 768 / 390 px QA taraması — **10. oturum**: `qa.js` 141 ekran × 3 kırılım TEMİZ,
      `gate.js` 705 sayfa yüklemesi (141 × 5 rol) TEMİZ
- [x] Kapanış raporu → `docs/N-kapanis-raporu.md` (14 eksenlik tarama tablosu + dürüst bakiye)

---

## E. VERİ MODELİ (§26-G)

Her ana kayıt için: entity adı · alanlar · veri türleri · zorunlu alanlar · ilişkiler ·
durum değerleri · arşivleme mantığı · log kaydı · yetki kapsamı.

> **Ayrım:** aşağıdaki işaretler **çalışan veri katmanını** ölçer (`assets/data/*.js` —
> koleksiyon + alanlar + durum değerleri + ilişkiler, `canon.js` ile doğrulanıyor).
> Aynı modelin **yazılı dokümanı** ayrı bir çıktıdır ve `G. Veri modeli`'nde açık duruyor.

- [x] lead · opportunity (lead ekseninde) · customer · contact · referrer · commission
- [x] analysis · quote · quote_item · contract · invoice · payment
- [x] project · module · milestone · sprint · delivery · change_request · test · bug
- [~] task · subtask · task_dependency · dept_request ✅ · **checklist_item koleksiyonu yok**
- [~] employee · leave · timelog · timesheet · performance · training ✅ ·
      **`DB.trainings`'te yetkinlik/kazanım alanı yok** · **işe giriş/çıkış (onboarding/offboarding) koleksiyonu yok**
- [x] asset · assignment · vehicle · maintenance · inspection · insurance · casco · fuel · expense · accident · fine
- [~] purchase_request · approval · supplier_quote · order · supplier ✅ ·
      **siparişte eksik/kısmi teslim ve iade alanı yok**
- [x] ticket · sla · chat_channel · chat_message · meeting · decision
- [~] document · notification · automation · role · permission · activity_log ✅ ·
      **doküman versiyon geçmişi ve onay zinciri koleksiyonu yok** · `DB.activities` kapsamı **tam** (UID-16 kapandı)
- [x] Modüller arası bağ alanları veride **yazılı** (L-13): destek→görev/hata/değişiklik ·
      sipariş→demirbaş · test→hata→teslim→modül→sprint zincirleri (VB-05 / VB-07 / VB-08 kapandı,
      `canon.js` eksen 15 · 521 kontrol · components.md §9d)

---

## F. İŞ AKIŞLARI (§26-H — 22 akış)

- [x] **Referansla müşteri kazanımı** → `app-referans-detay` yönlendiren → lead → müşteri →
      komisyon zinciri (`app-komisyon-detay` onay + ödeme mutasyonu)
- [x] **Lead→müşteri dönüşümü** → `app-lead-detay.html` "Müşteriye dönüştür" (gerçek `DB.customers` kaydı)
- [x] **Ön analiz** → `app-onanaliz.html` + `app-onanaliz-detay.html` (28 değerlendirme alanı)
- [x] **Teklif ve sözleşme** → `app-teklif-detay` → `app-sozlesme-detay` → ödeme planı zinciri
- [~] **Proje başlatma** → sözleşme → proje → milestone zinciri ekranlarda kurulu;
      **proje açılış formu yok**, akış tek işlemle tetiklenemiyor
- [x] **Görev atama** → `app-gorev-detay.html` görev atama mutasyonu + `DB.activities` kaydı
- [x] **Görev kabulü** → görev durum geçişi (Havuzda → Kabul edildi), yetki kapılı
- [x] **Görev kontrolü** → "Kontrol Bekleyenler" sekmesi + detayda kontrol/onay zinciri
- [x] **Revizyon** → `app-gorev-detay.html` "Revize iste" mutasyonu
- [x] **Sohbetten görev oluşturma** → `app-sohbet.html` (16 alanlı devir → `DB.tasks` + kanal mesajı)
- [x] **Departmanlar arası iş talebi** → `app-istalebi-detay.html` kabul akışı + göreve dönüşüm
- [~] **İzin talebi** → `app-izin.html` + `app-izin-detay.html` onay akışı ve çakışma kontrolü ✅ ·
      **izin talep formu bekliyor** (akış yalnız var olan kayıt üzerinden ilerletilebiliyor)
- [x] **Satın alma talebi** → `app-satinalma-detay.html` tutar eşikli 6 makamlı `GV.chain` onayı
- [~] **Demirbaş zimmeti** → `app-zimmet.html` zimmet/iade ✅ · tutanak, dijital onay, fotoğraf adımları yok
- [~] **Araç zimmeti** → `app-arac-detay.html` zimmet sekmesi ✅ · aynı eksik adımlar
- [x] **Araç bakımı** → `app-arac-bakim.html` + araç detayında bakım kaydı ekleme mutasyonu
- [x] **Sigorta yenilemesi** → `app-arac-sigorta.html` + 60/30/15/7 gün yenileme takvimi
- [x] **Kasko yenilemesi** → aynı ekran, ayrı poliçe ekseni
- [x] **Muayene** → `app-arac-muayene.html` (sonuç Geçti/Kaldı, sonraki muayene tarihi)
- [x] **Kaza ve hasar** → `app-arac-kaza.html` (kaza/hasar/ceza tek ekranda, ayrı sekmeler)
- [x] **Destek talebi** → `app-destek-detay.html` (SLA, eskalasyon, göreve dönüştürme)
- [ ] **Personel işe giriş / işten ayrılış** → ekran, menü kaydı ve koleksiyon **yok**
      (PROMPT.md §14 "İşe Giriş/Çıkış" · menü haritası bölüm 8'de yazılı, üretilmedi)

---

## G. DOKÜMAN ÇIKTILARI (§26) — ✅ **13/13 TAMAM** (9. oturum)

- [x] A. GaviaCRM incelemesi → `research.md`
- [x] B. Yönetici özeti → `docs/B-yonetici-ozeti.md` (165 satır · 5 eksen + dürüst değerlendirme)
- [x] C. Modül haritası (tablo) → `docs/C-modul-haritasi.md`
- [x] D. Rol & yetki matrisi (tablo) → `docs/D-rol-yetki-matrisi.md`
- [x] E. Menü ve sayfa haritası → `docs/E-menu-sayfa-haritasi.md`
- [x] F. Sayfa analizleri → `docs/F-sayfa-analizleri.md` (4586 satır · **141 / 141 ekran** · 18 eksen)
- [x] G. Veri modeli → `docs/G-veri-modeli.md` (816 satır · 65 koleksiyon · 636 kayıt)
- [x] H. İş akışları → `docs/H-is-akislari.md`
- [x] I. API ve teknik servisler → `docs/I-api-teknik-servisler.md` (848 satır · 37 `GV.*` yüzeyi)
- [x] J. Otomasyonlar (tablo) → `docs/J-otomasyonlar.md` (575 satır · 22 kural · 31 bildirim tipi)
- [x] K. Raporlar → `docs/K-raporlar.md`
- [x] L. Geliştirme yol haritası → `docs/L-yol-haritasi.md` (786 satır · 9 faz · 24 sprint)
- [x] M. Eksik ve ek öneriler → `docs/M-eksik-ve-ek-oneriler.md` (166 satır · 25 eksik + 17 öneri)

---

## H. KABUL KRİTERLERİ (§28)

- [~] GaviaCRM arayüz diliyle görsel uyum → shell/rail/menü davranışı hizalandı (UID-01 kapandı);
      kalan hizalama, boşluk ve kontrast işleri **UI ve UX Kalite Geçişi** fazında
- [x] Yazılım şirketine özgü — inşaat terminolojisi **sıfır**: görünen etiketlerde de, **alan adlarında da**
      (VB-04 kapandı; tam metin taraması `hak ediş|hakedis` → **0 sonuç**)
- [x] Bütün ana modüller birbirine bağlı → §22'nin **37** bağının 37'si doğrulandı (VB-28 kapandı);
      `canon.js` eksen 21 her bağın en az bir kayıtta **dolu** olduğunu her turda ölçer (L-22)
- [x] Görev sistemi ayrıntılı → 19 durum · 18 tür · 13 sekme · alt görev · bağımlılık · onay zinciri
- [x] Referans & yönlendiren kişi takibi → 17 referans türü · yönlendiren kartı · komisyon zinciri
- [x] Departmanlar arası sohbet + iş talebi + sohbetten görev
- [x] Müşteri ve personel raporları detaylı → 14 + 13 rapor, 8 rapor ekranı
- [x] Araçlar özel filo modülünde (bakım/muayene/sigorta/kasko) → 8 ekranlık ayrı modül
- [x] Liste ekranları ortak standart → tüm liste ekranları `GV.list` (PROMPT.md §6 tek bileşende)
- [~] Yetkilendirme arayüz seviyesinde kalmıyor → 403 kapısı + alan maskeleme ✅;
      **satır kapsamı (`scope('gor')`) liste ekranlarında uygulanmıyor** (UID-05)
- [x] Aktivite ve değişiklik geçmişi → `GV.activity` + `app-ayar-log` eski→yeni değer ✅;
      `DB.activities` **26 detay ekranı koleksiyonunun 26'sını** kapsıyor (UID-16 kapandı),
      `canon.js` eksen 22 ve `akt.js` her turda ölçer
- [~] Masaüstü + mobil (1440/768/390) → üç kırılımda da konsol/taşma temiz ✅;
      mobilde satır aksiyonu yok (UID-02), detay tabloları ≤760px'de gizleniyor (UID-14)
- [x] Çoklu şirket / SaaS'a hazır yapı → `app-ayar-sirket.html` tenant listesi + şirket bazlı kapsam
- [~] Aynı bilgi tekrar girilmiyor → canonical veri disiplini `canon.js` ile 14 eksende doğrulanıyor;
      formlar üretilmeden bu kriter uçtan uca ölçülemez

---

## FAZ: UI ve UX KALİTE GEÇİŞİ

> **Ne zaman:** Tüm ekranlar bittikten sonra, **kapanış raporundan önce**.
> **Ekran üretimi bitmeden bu faza başlanmaz.**

**Amaç:** Ekran ekran yama değil, **ortak katmanda kök nedenden çözüm.**

**GENEL KURAL:** Referans projeden **biçim, oran, yerleşim ve etkileşim davranışı** alınır;
**renk, tipografi ve gölge değerleri ALINMAZ** — onlar bu projenin `tokens.css` dosyasından gelir.
Hiçbir çözümde hardcode renk kullanılmaz.

### Kapsam A — `tasks/ui-debt.md` borç defterinin tamamı

Borç defterindeki **her madde** buranın alt maddesidir; defter tek doğru kaynak, aşağıdaki
liste onun plan karşılığıdır. Çözüm ekranda değil **ortak katmanda** yapılır.

- [x] **UID-01** · Rail collapse tutamağı referans biçimine getirildi (çözüldü 2026-08-04, `grip-qa.js`)
- [ ] **UID-02** · Mobil kart listesinde satır aksiyonu yok → aksiyon şeridi `GV.list` içinde tek yerde üretilecek
- [ ] **UID-03** · Kare görsel sınıfı yok → `.gv-thumb` (`is-sm/is-md/is-lg`) bileşen katmanına
- [ ] **UID-04** · `GV.upload` `File` nesnesini geri vermiyor → `onFile(file, meta)` geri çağrısı
- [ ] **UID-05** · `GV.perm.scope('gor')` liste ekranlarında uygulanmıyor → `GV.list`'e `scopeField` sözleşmesi
- [ ] **UID-06** · `GV.list` kayıt sayacı global → `countTarget` + mount kökü içinde arama
- [x] **UID-07** · Toplu işlem "çıktı al" seçili kapsamı dışa aktaramıyor — **çözüldü 10. oturum**
      → önce fizibilite ölçüldü (`tasks/qa/xport.js`: 141 ekran · 68 liste · 623 kolon · 6.335 hücre;
      **tamamen taşımayan kolon 0**, %0,7 kısmi ve hepsi yer tutucu metin). Sonra `exportRows(list, fmt)`
      dönüş yüzeyine alındı + `bulk[].export:true` sözleşmesi; **53 ekran** devre dışıdan çalışır oldu
- [x] **UID-08** · Kontrol ile etiketi arasında boşluk yok — **çözüldü 10. oturum** (UID-09 ile tek turda)
      → kök neden `.field label{display:block}` özgüllükle `.f-check`/`.f-radio`'nun `gap`'ini
      eziyordu; kural artık kalıba bağlı (`:not(:has(input))` + `:where(label:has(> input))`).
      Ölçüm `tasks/qa/ctl.js`: 2.422 çiftte bitişik **0**, en dar boşluk **8 px**
- [x] **UID-09** · Native form kontrolleri tasarım sisteminde değil — **çözüldü 10. oturum**
      → `select` 0/732 native · kutu/radyo 0/4.154 native; tarih alanı bilinçli olarak
      native bırakıldı (assumptions **V-36**), yalnız takvim düğmesi standartlaştırıldı
- [ ] **UID-10** · Yan panelde başlık / kaydırılan içerik ayrımı yok (+ para birimi eki, filtre sayacı)
- [x] **UID-11** · Finans yetkisi yokken KPI "₺0" gösteriyor — **çözüldü 10. oturum**
      → `kpis[].perm` / `mask()` sözleşmesi; 17 ekranda 28 `canFinans ? x : 0` silindi
- [x] **UID-12** · `app-gorev.html` "Tümü" sekmesi — **çözüldü 10. oturum** (UID-21 ile aynı turda)
      → sekme eklendi, dış bağlantılar hizalandı, `search.extra` sprint/modül kodlarını katıyor;
      ayrıca `app-rapor-proje`'de hiç okunmayan üç `?proje=`/`?sprint=`/`?sorumlu=` parametresi bulundu
- [x] **UID-21** · `app-referans` yönlendiren bağlantısı yanlış eksende süzüyordu — **çözüldü**
      → `app-lead` ve `app-musteri`'ye `referans` süzgeci; REF-001 → 2 aday, REF-002 → 3 müşteri
- [ ] **UID-13** · `GV.list` toplu işlemlerinde `show` / yetki kapısı yok → `bulk[].show`
- [ ] **UID-14** · Detay sekmesi tabloları ≤760px'de kayboluyor → `.gv-tablewrap` kararı
- [ ] **UID-15** · Dört eski detay ekranı shell iskeletini elle kopyalıyor → dördü tek turda `buildSkeleton()`e
- [x] **UID-16** · Detay ekranlarının aktivite sekmesi boş — **çözüldü 11. oturum**
      → borç **beş önek** diyordu, ölçülen **22** (L-25): `DB.activities` 8 kayıt / 4 önekti,
      26 detay ekranının 22'sinde sekme her kayıtta boştu. **192 kayıt · 73 kayıt kodu** yazıldı,
      hepsi gerçek olaydan türetildi ve tek tek ölçüldü. Yan bulgu: iki canonical tarih çelişkisi
      (`referrers.sonYonlendirme` 3 kayıt · `ZMT-2025-005` zimmeti) düzeltildi.
      Eksenler: `canon.js` **22 · 22b · 23** + yeni `tasks/qa/akt.js`
- [x] **akt.js kalıcı tarama setinde** — `tasks/qa/akt.js`, her turda koşuluyor
- [ ] **UID-17** · Dokuz ekran kendi `dl(pairs)` yardımcısını yazıyor → `GV.dl(pairs, opts)`
- [ ] **UID-18** · `.cell-wrap` çok kolonlu tabloyu 1440px'de yatay kaydırmaya düşürüyor
- [ ] **UID-19** · Tablo toplam satırı için ortak sınıf yok → `.gtable tfoot` + `tr.is-total`
- [x] 🔴 **UID-27** · `GV.list` `run`'sız aksiyonda sahte başarı mesajı — **çözüldü 9. oturum**
      → gerçek sayı 79 değil **129 ihlal / 65 ekran**; yalan yedek kaldırıldı, `run`suz aksiyon
      `disabled` + "bu sürümde yok". İhlal **129 → 28**. Eksen: `tasks/qa/act.js`
- [x] **UID-30** · Ekranın kendi `run` gövdesi yalan söylüyor — gerçek sayı **10 yalan / 5 ekran**
      (28/21 kaydı aracın kendi dört yanlış hükmünden şişmişti, ders **L-26**). 10. oturumda
      **6'sı çözüldü** (`app-butce` revizyon+uyarı · `app-destek-sla` eskale ×2 ·
      `app-ayar-otomasyon` ac+dene). **Kalan 4** veri ekseni bekliyor: `hatirlat` ×2 (VB-29) ·
      `oku` ×2 (duyuru okuma ekseni yok) — **ikisi de aynı oturumda kapandı**, `act.js` 0 ihlal
- [x] **VB-29** · `hatirlat` veri ekseni — **çözüldü 10. oturum** → `DB.reminders` + duyuru
      `okuyanlar` ekseni; `canon.js` eksen 19 (645 kontrol temiz)
- [x] **act.js kalıcı tarama setinde** — `tasks/qa/act.js`, her turda koşuluyor
      (10. oturumda üç yanlış hüküm düzeltildi: çıktı modalını onay modalı sanıyordu ·
      girdi soran modalı kendi onaylıyordu · görünmeyen toplu işlem butonunu "ölü" sayıyordu)
- [x] **xport.js kalıcı tarama setinde** — `tasks/qa/xport.js`, her turda koşuluyor
- [x] **ctl.js kalıcı tarama setinde** — `tasks/qa/ctl.js`, her turda koşuluyor
- [ ] **UID-26** · Kolon/filtre/çıktı/toplu/kanban `GV.list` içine kilitli → `GV.*` yüzeyine alınacak
      (UID-06 · UID-07 · UID-17'nin ortak kökü)
- [x] **UID-28** · Maskeleme ayrışması — **çözüldü 10. oturum** → `columns[].perm` / `mask(row)`;
      `app-dokuman` gizli belge adı · filo birim fiyat/kasko/kira eksenleri hizalandı
- [x] **UID-25** · Rapor çıktısı yetki kapısı — **çözüldü 10. oturum** → `disaAktar` kapısı bileşende,
      9 ekrandaki elle yazılmış kapı silindi
- [ ] **UID-29** · `app-arac-yakit` "Geçen Ay" sekmesi sabit `'2026-07'` yazılmış
- [x] **VB-27** · `DB.surveys[].ilgili` yetim proje kodları — **çözüldü 10. oturum** → altı geçmiş
      proje veriye yazıldı (V-37), `canon.js` eksen 20 eklendi (672 kontrol temiz) ve eksen
      yazılır yazılmaz ikinci bir hata buldu (`ANK-2026-057` teslimden önce tarihliydi)
- [x] **VB-14 · VB-17 · VB-22** · "Eksen var, sözlüğü yok" — **çözüldü 10. oturum**
      → 8 sözlük veri katmanına alındı; üç form kümeleri türetmeyi bıraktı
- [x] **VB-09** · Yasak inşaat terimi "saha" — **çözüldü 10. oturum**, beş yerde bulundu
      (defterde tek kayıt vardı); tam metin taraması 0 sonuç
- [x] **VB-28** · §22 bağ kapsamı — **çözüldü 11. oturum** → üç "eksik" bağın **ikisi zaten vardı**
      (ters yönde, §9d gereği kaynak kayıtta); `vehicles.siparis` zinciri yazıldı, iki boş destek
      bağı gerçek kayıtla dolduruldu. Yeni eksenler: `canon.js` **21** ("bağ verilmiş mi" — L-22)
      ve `tasks/qa/bag.js` ("bağ ekranda görünüyor mu")
- [x] **bag.js kalıcı tarama setinde** — `tasks/qa/bag.js`, her turda koşuluyor
- [x] **VB-12 · VB-13** · Kişi kimliği ekseni — **çözüldü 11. oturum**
      → borç iki alan sayıyordu, ölçülen **üç**: `tickets.acan` · `interactions.kontak` ·
      **`activities.kisi`** (192 kayıt). Üçü de yerinde **koda çevrildi** (ayrı alan açmak
      aynı kişiyi iki yerde tutmak olurdu, V-40). `GV.session.ad` → `.emp` **154 yazım /
      62 dosya**; `esc(son.kisi)` ailesi 35 yer; ad kaskadı silindi. VB-13: `referrers.kontak`
      (REF-001≡YTK-001 · REF-004≡YTK-014). Eksenler: `canon.js` **24 · 24b** + `tasks/qa/pers.js`
- [x] **pers.js kalıcı tarama setinde** — `tasks/qa/pers.js`, her turda koşuluyor
- [x] **VB-04** · `hakedis` → **`komisyonToplam`** · `hakedisTarihi` → **`kazanimTarihi`** — **çözüldü 11. oturum**
      → envanter defterdeki 111 değil **145 kullanım / 9 dosya** çıktı; tek turda çevrildi.
      Yasak terim tam metin taraması **0** (İK bağlamındaki iki "hak ediş" metni de düzeltildi)
- [x] **VB-16** · `DB.analyses[].maliyet` → **`tahminiBedel`** — **çözüldü**, VB-04 ile aynı turda
      → yalnız analiz ekseni çevrildi; proje/bakım/eğitim `maliyet` alanlarına dokunulmadı.
      Alan adı düzelince eski "bu ad yanıltıcı" uyarı blokları da yeniden yazıldı
- [x] **VB-06 · VB-23 · VB-25** · Aynı işlem ekrandan ekrana ayrışıyordu — **çözüldü 10. oturum**
      → yeni ortak katman dosyası `assets/js/domain.js` (`GV.fin.settleInvoice/settlePayment` ·
      `GV.delivery.approve`); ölçüldü: fatura kapanınca tahsilat ve taksit de kapanıyor,
      müşterinin bekleyen tahsilatı 285.000 → 0
- [x] **UID-24** · `teslimKontrol` üç değeri listede ikiye iniyordu — **çözüldü**
- [x] **UID-29** · `app-arac-yakit` "Geçen Ay" sabit ayı — **çözüldü**, tüm ekranlar tarandı
- [x] **VB-19** · Teklif → sözleşme aktarımı KDV'yi iki kez uyguluyordu (çözüldü 2026-08-05, `canon.js` eksen 18)

### Kapsam B — sistem geneli denetimler

- [ ] **Boşluk sistemi denetimi:** tüm bileşenlerde tek bir boşluk ölçeği kullanılıyor mu,
      hardcode piksel kalmış mı
- [ ] Form kontrolü ile etiketi arasındaki boşluk için **tek taban kural** (UID-08'in kök nedeni;
      aynı kusur dört kez tekrarladı — persona çipi · giriş rol kartı · radio grubu · checkbox listesi)
- [ ] Tüm native kontrollerin (select, tarih, checkbox, radio, dosya) tasarım sistemine alınması (UID-09)
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

### Yöntem — dört kural

1. **Referanstan biçim ve davranış alınır** (geometri, oran, yerleşim, etkileşim).
2. **Renk, tipografi ve gölge `tokens.css`'ten gelir** — referanstan alınmaz, hardcode yazılmaz.
3. **Çözüm ortak katmanda yapılır** (`ui.css` · `ui.js` · `shell.js` · `tokens.css`), ekranda değil.
4. **Nokta yaması yasak.** Bir madde kapandığında etkilenen **tüm ekranlar** 1440, 768 ve
   390 px'de yeniden doğrulanır ve sonuç ölçüyle raporlanır (L-05).
