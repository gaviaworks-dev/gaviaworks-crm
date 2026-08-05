# E. Menü ve Sayfa Haritası

> **Bu belge neyden türetildi?**
> `PROMPT.md` §26 bölüm E ("Ana menüleri, alt menüleri ve sayfalar arası bağlantıları çıkar")
> talebine karşılık, üç kaynaktan **birebir okunarak** üretildi:
> 1. `assets/js/shell.js` → `SECTIONS` (15 rail bölümü ve menü kalemleri, `screen` anahtarları,
>    rozet sayaçları `cnt`, kalem bazlı `roles` kısıtı),
> 2. `assets/js/shell.js` → `BUILT` dizisi (yayındaki ekranların **tek doğru listesi**;
>    `isBuilt()` bu listeye bakar, listede olmayan hedef `data-wip` olarak işaretlenir),
> 3. `assets/js/shell.js` → `SEC_BY_ROLE` + `SCREEN_PERM` (rol → bölüm ve rol → ekran erişimi),
> 4. Dosya sistemi envanteri (`ls app-*.html`).
>
> Sayımların tamamı bu kaynaklardan **sayılarak** çıkarıldı, tahmin edilmedi.
> Doğrulama: `BUILT` içindeki 135 `app-*.html` kaydı ile diskteki 135 dosya **birebir örtüşür**
> — ne fazla dosya ne eksik kayıt var.

---

## 1. Özet Sayılar

| Ölçüt | Değer |
|---|---|
| Rail bölümü (`RAIL_ORDER`) | **15** |
| Menü kalemi (ayraç `seclbl` hariç) | **89** |
| Menüden erişilen farklı ekran dosyası | **79** |
| Yayındaki toplam ekran (`BUILT`, `index.html` hariç) | **135** |
| Menüde kaydı olmayan yayındaki ekran | **56** (26 detay + 30 form) |
| Tanımlı rol (`SEC_BY_ROLE`) | **27** |
| Ekran seviyesinde kısıtlı ekran (`SCREEN_PERM`) | **11** |

### Ekran tipolojisi dağılımı (135 ekran)

| Tip | Türetme kuralı | Adet |
|---|---|---|
| Liste | Yukarıdaki kalıpların hiçbirine uymayan kök ekran | **53** |
| Form | `*-form.html` | **30** |
| Detay | `*-detay.html` | **26** |
| Ayar | `app-ayar-*.html` | **12** |
| Rapor | `app-rapor*.html` | **8** |
| Panel | `app-panel*.html` | **6** |

> Not (dürüstlük kaydı): "Liste" kovası dosya adı kalıbından türetildiği için, davranışı liste
> olmayan 7 **çalışma yüzeyi** ekranını da içerir: `app-pipeline.html` (kanban),
> `app-sohbet.html` (mesajlaşma), `app-ajanda.html` (takvim), `app-kapasite.html`,
> `app-butce.html`, `app-performans.html`, `app-egitim.html`. Bunlar liste standardını
> tamamen değil, kısmen uygular.

---

## 2. Rail Bölümleri → Menü Kalemleri → Hedef Ekran

Kolon açıklamaları: **Screen** = `SECTIONS[...].menu[].screen` (aktif kalem işaretleme anahtarı).
**Rozet** = `cnt` sayaç anahtarı. **Tip** = ekran tipolojisi.

### 2.1 `panel` — Ana Panel · *Genel Bakış* (8 kalem)

| Menü Kalemi | Hedef | Screen | Tip | Rozet / Kısıt |
|---|---|---|---|---|
| Dashboard | `app-panel.html` | `panel` | panel | — |
| *Gündem* | — | — | ayraç | — |
| Günlük Özet | `app-panel-ozet.html` | `ozet` | panel | — |
| Ajanda | `app-ajanda.html` | `ajanda` | liste (takvim) | — |
| Görevlerim | `app-gorev.html?t=bana` | `gorevlerim` | liste (sekme) | — |
| Bekleyen Onaylar | `app-panel-onaylar.html` | `onaylar` | panel | `cnt: onay` |
| Bildirimler | `app-panel-bildirimler.html` | `bildirimler` | panel | `cnt: bildirim` |
| Duyurular | `app-panel-duyurular.html` | `duyurular` | panel | — |
| *Analiz* | — | — | ayraç | — |
| Yönetici Paneli | `app-panel-yonetici.html` | `yonetici` | panel | roller: sahip, genelmudur, sistem, operasyon |

### 2.2 `satis` — Satış ve CRM · *Satış* (6 kalem)

| Menü Kalemi | Hedef | Screen | Tip | Rozet |
|---|---|---|---|---|
| Müşteri Adayları | `app-lead.html` | `lead` | liste | `cnt: lead` |
| Satış Pipeline | `app-pipeline.html` | `pipeline` | liste (kanban) | — |
| *Referans* | — | — | ayraç | — |
| Yönlendiren Kişiler | `app-referans.html` | `referans` | liste | — |
| Komisyon Kazançları | `app-komisyon.html` | `komisyon` | liste | — |
| *Süreç* | — | — | ayraç | — |
| Ön Analizler | `app-onanaliz.html` | `onanaliz` | liste | — |
| Teklifler | `app-teklif.html` | `teklif` | liste | `cnt: teklif` |

### 2.3 `musteri` — Müşteri Yönetimi · *Müşteri* (3 kalem)

| Menü Kalemi | Hedef | Screen | Tip |
|---|---|---|---|
| Müşteriler | `app-musteri.html` | `musteri` | liste |
| Yetkili Kişiler | `app-musteri-yetkili.html` | `yetkili` | liste |
| İletişim Geçmişi | `app-musteri-iletisim.html` | `iletisim` | liste |

### 2.4 `proje` — Proje Yönetimi · *Teslimat* (7 kalem)

| Menü Kalemi | Hedef | Screen | Tip | Rozet |
|---|---|---|---|---|
| Projeler | `app-proje.html` | `proje` | liste | — |
| Milestone | `app-proje-milestone.html` | `milestone` | liste | — |
| Sprintler | `app-proje-sprint.html` | `sprint` | liste | — |
| *Kalite* | — | — | ayraç | — |
| Testler | `app-proje-test.html` | `test` | liste | — |
| Hatalar | `app-proje-hata.html` | `hata` | liste | `cnt: hata` |
| Değişiklik Talepleri | `app-proje-degisiklik.html` | `degisiklik` | liste | — |
| Teslimler | `app-proje-teslim.html` | `teslim` | liste | — |

### 2.5 `gorev` — Görev ve İş Takibi · *İş Takibi* (9 kalem)

Sekiz kalem **tek ekranın** (`app-gorev.html`) `?t=` sekme parametresine gider; dokuzuncusu ayrı modüldür.

| Menü Kalemi | Hedef | Screen | Tip | Rozet / Ton |
|---|---|---|---|---|
| İş Havuzu | `app-gorev.html?t=havuz` | `havuz` | liste | `cnt: havuz` |
| Bana Verilenler | `app-gorev.html?t=bana` | `bana` | liste | `cnt: bana` |
| Verdiğim İşler | `app-gorev.html?t=verdigim` | `verdigim` | liste | — |
| Departman İşleri | `app-gorev.html?t=departman` | `departman` | liste | — |
| *Bekleyenler* | — | — | ayraç | — |
| Onay Bekleyenler | `app-gorev.html?t=onay` | `onay` | liste | — |
| Kontrol Bekleyenler | `app-gorev.html?t=kontrol` | `kontrol` | liste | — |
| Gecikenler | `app-gorev.html?t=geciken` | `geciken` | liste | `cnt: geciken`, `tone: danger` |
| Engellenenler | `app-gorev.html?t=engel` | `engel` | liste | — |
| *İş Birliği* | — | — | ayraç | — |
| Departman Talepleri | `app-istalebi.html` | `istalebi` | liste | `cnt: istalebi` |

### 2.6 `destek` — Destek ve Bakım · *Servis* (4 kalem)

| Menü Kalemi | Hedef | Screen | Tip | Rozet |
|---|---|---|---|---|
| Destek Talepleri | `app-destek.html` | `destek` | liste | `cnt: destek` |
| SLA Takibi | `app-destek-sla.html` | `sla` | liste | — |
| Bakım Paketleri | `app-destek-paket.html` | `paket` | liste | — |
| Memnuniyet | `app-destek-memnuniyet.html` | `memnuniyet` | liste | — |

### 2.7 `sohbet` — Sohbet ve İş Birliği · *İletişim* (1 kalem)

| Menü Kalemi | Hedef | Screen | Tip | Rozet |
|---|---|---|---|---|
| Kanallar | `app-sohbet.html` | `sohbet` | liste (mesajlaşma) | `cnt: mesaj` |

### 2.8 `personel` — Personel ve İK · *İnsan Kaynakları* (7 kalem)

| Menü Kalemi | Hedef | Screen | Tip | Rozet |
|---|---|---|---|---|
| Personel | `app-personel.html` | `personel` | liste | — |
| İzinler | `app-izin.html` | `izin` | liste | `cnt: izin` |
| *Zaman* | — | — | ayraç | — |
| Zaman Kayıtları | `app-zaman.html` | `zaman` | liste | — |
| Timesheet Onayı | `app-zaman-onay.html` | `timesheet` | liste | — |
| Kapasite | `app-kapasite.html` | `kapasite` | liste (analiz) | — |
| *Gelişim* | — | — | ayraç | — |
| Performans | `app-performans.html` | `performans` | liste (analiz) | — |
| Eğitim ve Yetkinlik | `app-egitim.html` | `egitim` | liste | — |

### 2.9 `varlik` — Demirbaş ve Filo · *Envanter* (9 kalem)

| Menü Kalemi | Hedef | Screen | Tip | Rozet |
|---|---|---|---|---|
| Demirbaşlar | `app-demirbas.html` | `demirbas` | liste | — |
| Zimmetler | `app-zimmet.html` | `zimmet` | liste | — |
| *Araç ve Filo* | — | — | ayraç | — |
| Araçlar | `app-arac.html` | `arac` | liste | — |
| Bakım | `app-arac-bakim.html` | `bakim` | liste | `cnt: bakim` |
| Muayene | `app-arac-muayene.html` | `muayene` | liste | — |
| Sigorta ve Kasko | `app-arac-sigorta.html` | `sigorta` | liste | `cnt: police` |
| Yakıt | `app-arac-yakit.html` | `yakit` | liste | — |
| Giderler | `app-arac-gider.html` | `gider` | liste | — |
| Kaza ve Ceza | `app-arac-kaza.html` | `kaza` | liste | — |

### 2.10 `satinalma` — Satın Alma · *Tedarik* (5 kalem)

| Menü Kalemi | Hedef | Screen | Tip | Rozet |
|---|---|---|---|---|
| Talepler | `app-satinalma.html` | `talep` | liste | `cnt: satinalma` |
| Onay Bekleyenler | `app-satinalma.html?t=onay` | `salmaonay` | liste (sekme) | — |
| Teklif Toplama | `app-satinalma-teklif.html` | `salmateklif` | liste | — |
| Siparişler | `app-siparis.html` | `siparis` | liste | — |
| Tedarikçiler | `app-tedarikci.html` | `tedarikci` | liste | — |

### 2.11 `finans` — Finans ve Sözleşme · *Finans* (5 kalem)

| Menü Kalemi | Hedef | Screen | Tip | Rozet / Ton |
|---|---|---|---|---|
| Sözleşmeler | `app-sozlesme.html` | `sozlesme` | liste | — |
| Faturalar | `app-fatura.html` | `fatura` | liste | — |
| Tahsilatlar | `app-tahsilat.html` | `tahsilat` | liste | `cnt: tahsilat`, `tone: danger` |
| Ödeme Planları | `app-odemeplani.html` | `odemeplani` | liste | — |
| Proje Bütçe ve Maliyet | `app-butce.html` | `butce` | liste (analiz) | — |

### 2.12 `dokuman` — Doküman Yönetimi · *Arşiv* (2 kalem)

| Menü Kalemi | Hedef | Screen | Tip | Rozet |
|---|---|---|---|---|
| Doküman Merkezi | `app-dokuman.html` | `dokuman` | liste | — |
| Süresi Dolanlar | `app-dokuman-sure.html` | `doksure` | liste | `cnt: dokuman` |

### 2.13 `toplanti` — Toplantı ve Ajanda · *Ajanda* (3 kalem)

| Menü Kalemi | Hedef | Screen | Tip |
|---|---|---|---|
| Toplantılar | `app-toplanti.html` | `toplanti` | liste |
| Takvim | `app-ajanda.html` | `takvim` | liste (takvim) |
| Kararlar ve Aksiyonlar | `app-toplanti-karar.html` | `karar` | liste |

> `app-ajanda.html` iki bölümden birden hedeflenir (`panel/ajanda` ve `toplanti/takvim`) —
> aynı ekran, iki farklı `screen` anahtarı.

### 2.14 `rapor` — Raporlama Merkezi · *Analiz* (8 kalem)

| Menü Kalemi | Hedef | Screen | Tip |
|---|---|---|---|
| Rapor Merkezi | `app-rapor.html` | `rapor` | rapor |
| *Rapor Grupları* | — | — | ayraç |
| Müşteri Raporları | `app-rapor-musteri.html` | `rapormusteri` | rapor |
| Personel Raporları | `app-rapor-personel.html` | `raporpersonel` | rapor |
| Görev Raporları | `app-rapor-gorev.html` | `raporgorev` | rapor |
| Referans Raporları | `app-rapor-referans.html` | `raporreferans` | rapor |
| Filo Raporları | `app-rapor-filo.html` | `raporfilo` | rapor |
| Satış ve Finans | `app-rapor-finans.html` | `raporfinans` | rapor |
| Proje Raporları | `app-rapor-proje.html` | `raporproje` | rapor |

### 2.15 `ayarlar` — Ayarlar ve Yetkilendirme · *Sistem* (12 kalem)

Bölüm **her role** açıktır (herkes profilini ve bildirim tercihini yönetir); yönetim
ekranları kalem bazlı `roles` ve `SCREEN_PERM` ile kapatılır.

| Menü Kalemi | Hedef | Screen | Tip | Rol kısıtı |
|---|---|---|---|---|
| Şirket Bilgileri | `app-ayar-sirket.html` | `sirket` | ayar | sahip, genelmudur, sistem |
| Departmanlar | `app-ayar-departman.html` | `departmanlar` | ayar | + operasyon, ik |
| *Erişim* | — | — | ayraç | — |
| Kullanıcılar | `app-ayar-kullanici.html` | `kullanicilar` | ayar | sahip, genelmudur, sistem |
| Roller | `app-ayar-rol.html` | `roller` | ayar | sahip, genelmudur, sistem |
| Yetki Matrisi | `app-ayar-yetki.html` | `yetki` | ayar | sahip, genelmudur, sistem |
| Onay Akışları | `app-ayar-onay.html` | `onayakis` | ayar | + operasyon |
| *Sistem* | — | — | ayraç | — |
| Bildirim Tercihleri | `app-ayar-bildirim.html` | `bildirimtercih` | ayar | **kısıtsız** |
| Otomasyonlar | `app-ayar-otomasyon.html` | `otomasyon` | ayar | + operasyon |
| Entegrasyonlar | `app-ayar-entegrasyon.html` | `entegrasyon` | ayar | + devops |
| Log Kayıtları | `app-ayar-log.html` | `log` | ayar | + operasyon, devops |
| Profilim | `app-ayar-profil.html` | `profil` | ayar | **kısıtsız** |
| Arşiv | `app-ayar-arsiv.html` | `arsiv` | ayar | + operasyon |

---

## 3. Sayfalar Arası Akış — Liste → Detay → Form Üçlüsü

Aşağıdaki tablo `BUILT` dizisinden **sayılarak** çıkarıldı: her liste kökü için
`<kök>-detay.html` ve `<kök>-form.html` kayıtlarının varlığı kontrol edildi.

| Durum | Adet | Yorum |
|---|---|---|
| **Tam üçlü** (L + D + F) | **24** | Uçtan uca gezinilebilir modüller |
| **Yalnız L + D** (form eksik) | **2** | Detaya inilir, kayıt yaratılamaz |
| **Yalnız L + F** (detay eksik) | **6** | Kayıt yaratılır, ayrı detay ekranı yok |
| **Yalnız L** | **21** | Tek yüzeyli ekranlar |
| **Toplam liste kökü** | **53** | |

Sağlama: 24 + 2 = 26 detay ekranı ✔ · 24 + 6 = 30 form ekranı ✔

### 3.1 Tam üçlü — 24 modül

| Modül | Liste | Detay | Form |
|---|---|---|---|
| Müşteri adayı | `app-lead.html` | `app-lead-detay.html` | `app-lead-form.html` |
| Yönlendiren kişi | `app-referans.html` | `app-referans-detay.html` | `app-referans-form.html` |
| Komisyon | `app-komisyon.html` | `app-komisyon-detay.html` | `app-komisyon-form.html` |
| Ön analiz | `app-onanaliz.html` | `app-onanaliz-detay.html` | `app-onanaliz-form.html` |
| Teklif | `app-teklif.html` | `app-teklif-detay.html` | `app-teklif-form.html` |
| Müşteri | `app-musteri.html` | `app-musteri-detay.html` | `app-musteri-form.html` |
| Proje | `app-proje.html` | `app-proje-detay.html` | `app-proje-form.html` |
| Test | `app-proje-test.html` | `app-proje-test-detay.html` | `app-proje-test-form.html` |
| Hata | `app-proje-hata.html` | `app-proje-hata-detay.html` | `app-proje-hata-form.html` |
| Değişiklik talebi | `app-proje-degisiklik.html` | `app-proje-degisiklik-detay.html` | `app-proje-degisiklik-form.html` |
| Teslim | `app-proje-teslim.html` | `app-proje-teslim-detay.html` | `app-proje-teslim-form.html` |
| Görev | `app-gorev.html` | `app-gorev-detay.html` | `app-gorev-form.html` |
| Departman talebi | `app-istalebi.html` | `app-istalebi-detay.html` | `app-istalebi-form.html` |
| Destek talebi | `app-destek.html` | `app-destek-detay.html` | `app-destek-form.html` |
| Personel | `app-personel.html` | `app-personel-detay.html` | `app-personel-form.html` |
| İzin | `app-izin.html` | `app-izin-detay.html` | `app-izin-form.html` |
| Demirbaş | `app-demirbas.html` | `app-demirbas-detay.html` | `app-demirbas-form.html` |
| Araç | `app-arac.html` | `app-arac-detay.html` | `app-arac-form.html` |
| Satın alma talebi | `app-satinalma.html` | `app-satinalma-detay.html` | `app-satinalma-form.html` |
| Sipariş | `app-siparis.html` | `app-siparis-detay.html` | `app-siparis-form.html` |
| Tedarikçi | `app-tedarikci.html` | `app-tedarikci-detay.html` | `app-tedarikci-form.html` |
| Sözleşme | `app-sozlesme.html` | `app-sozlesme-detay.html` | `app-sozlesme-form.html` |
| Fatura | `app-fatura.html` | `app-fatura-detay.html` | `app-fatura-form.html` |
| Toplantı | `app-toplanti.html` | `app-toplanti-detay.html` | `app-toplanti-form.html` |

### 3.2 Form eksik (L + D) — 2 modül

| Modül | Liste | Detay | Eksik |
|---|---|---|---|
| Doküman | `app-dokuman.html` | `app-dokuman-detay.html` | `app-dokuman-form.html` yok |
| Tahsilat | `app-tahsilat.html` | `app-tahsilat-detay.html` | `app-tahsilat-form.html` yok |

### 3.3 Detay eksik (L + F) — 6 modül

Bu ekranlar satır düzeyinde ayrı bir detay sayfası tutmaz; kayıt açma/düzenleme
doğrudan formdan yapılır.

| Modül | Liste | Form | Eksik |
|---|---|---|---|
| Yetkili kişi | `app-musteri-yetkili.html` | `app-musteri-yetkili-form.html` | detay yok |
| İletişim kaydı | `app-musteri-iletisim.html` | `app-musteri-iletisim-form.html` | detay yok |
| Sprint | `app-proje-sprint.html` | `app-proje-sprint-form.html` | detay yok |
| Zimmet | `app-zimmet.html` | `app-zimmet-form.html` | detay yok |
| Araç bakım | `app-arac-bakim.html` | `app-arac-bakim-form.html` | detay yok |
| Araç muayene | `app-arac-muayene.html` | `app-arac-muayene-form.html` | detay yok |

### 3.4 Yalnız liste — 21 ekran

Ne detay ne form ekranı var. Bir kısmı doğası gereği tek yüzeyli (kanban, takvim, sohbet,
analiz), bir kısmı ise gerçek bir üçlü boşluğudur.

| Ekran | Bölüm | Değerlendirme |
|---|---|---|
| `app-pipeline.html` | satis | Kanban — kartlar `app-lead-detay.html`'e gider, kendi detayı gerekmez |
| `app-proje-milestone.html` | proje | **Üçlü boşluğu** — detay ve form eksik |
| `app-destek-sla.html` | destek | İzleme ekranı — kayıtlar `app-destek-detay.html`'e gider |
| `app-destek-paket.html` | destek | **Üçlü boşluğu** — paket tanımı formu eksik |
| `app-destek-memnuniyet.html` | destek | Salt okunur anket sonucu |
| `app-sohbet.html` | sohbet | Mesajlaşma yüzeyi — liste standardı dışı |
| `app-zaman.html` | personel | **Üçlü boşluğu** — zaman kaydı formu eksik |
| `app-zaman-onay.html` | personel | Onay kuyruğu — `app-zaman.html` üzerinden çalışır |
| `app-kapasite.html` | personel | Analiz yüzeyi |
| `app-performans.html` | personel | Analiz yüzeyi |
| `app-egitim.html` | personel | **Üçlü boşluğu** — eğitim/yetkinlik formu eksik |
| `app-arac-sigorta.html` | varlik | **Üçlü boşluğu** — poliçe formu eksik (bakım/muayene formu var) |
| `app-arac-yakit.html` | varlik | **Üçlü boşluğu** — yakıt fişi formu eksik |
| `app-arac-gider.html` | varlik | **Üçlü boşluğu** — gider formu eksik |
| `app-arac-kaza.html` | varlik | **Üçlü boşluğu** — kaza/ceza formu eksik |
| `app-satinalma-teklif.html` | satinalma | Teklif toplama — `app-satinalma-detay.html`'e bağlı |
| `app-odemeplani.html` | finans | **Üçlü boşluğu** — plan formu eksik |
| `app-butce.html` | finans | Analiz yüzeyi — `app-proje-detay.html`'e bağlı |
| `app-dokuman-sure.html` | dokuman | Filtreli görünüm — `app-dokuman-detay.html`'e gider |
| `app-ajanda.html` | panel + toplanti | Takvim yüzeyi — `app-toplanti-detay.html`'e gider |
| `app-toplanti-karar.html` | toplanti | Aksiyon listesi — `app-toplanti-detay.html`'e gider |

**Kapatılması gereken gerçek boşluklar (11 adet):** milestone (D+F), destek paketi (F),
zaman kaydı (F), eğitim (F), sigorta poliçesi (F), yakıt (F), araç gideri (F), kaza (F),
ödeme planı (F), doküman (F), tahsilat (F).

### 3.5 Modül dışı gezinme bağları

Menüden değil, ekran içi bağlantılardan kurulan çapraz akışlar (canonical data disiplini gereği
aynı kayıt her yerde aynı hedefe gider):

- `app-lead-detay.html` → `app-onanaliz-detay.html` → `app-teklif-detay.html` →
  `app-sozlesme-detay.html` → `app-proje-detay.html` (satıştan teslimata ana hat)
- `app-referans-detay.html` → `app-komisyon-detay.html` (yönlendiren → hakediş)
- `app-musteri-detay.html` → yetkili · iletişim · teklif · sözleşme · fatura · destek · proje
- `app-proje-detay.html` → sprint · milestone · test · hata · değişiklik · teslim · bütçe · görev
- `app-gorev-detay.html` ↔ `app-sohbet.html` (sohbetten görev oluşturma)
- `app-destek-detay.html` → `app-destek-sla.html` · `app-gorev-detay.html`
- `app-arac-detay.html` → bakım · muayene · sigorta · yakıt · gider · kaza
- `app-satinalma-detay.html` → `app-satinalma-teklif.html` → `app-siparis-detay.html` →
  `app-fatura-detay.html`
- `app-personel-detay.html` → izin · zaman · performans · eğitim · zimmet · araç

---

## 4. Menüde Görünmeyen Ama Yayında Olan Ekranlar (56)

Bunlar `BUILT` içindedir, dolayısıyla `isBuilt()` doğrular ve bağlantıları gerçek `href`
olarak çalışır — fakat `SECTIONS` içinde **kendi menü kaydı yoktur**. Erişim, kaynak liste
ekranından (satır tıklama, "Yeni" butonu, detay içi aksiyon) sağlanır ve aktif menü
işaretlemesi kaynak listenin `screen` anahtarını taşır.

### 4.1 Detay ekranları (26)

`app-lead-detay` · `app-referans-detay` · `app-komisyon-detay` · `app-onanaliz-detay` ·
`app-teklif-detay` · `app-musteri-detay` · `app-proje-detay` · `app-proje-test-detay` ·
`app-proje-hata-detay` · `app-proje-degisiklik-detay` · `app-proje-teslim-detay` ·
`app-gorev-detay` · `app-istalebi-detay` · `app-destek-detay` · `app-personel-detay` ·
`app-izin-detay` · `app-demirbas-detay` · `app-arac-detay` · `app-satinalma-detay` ·
`app-siparis-detay` · `app-tedarikci-detay` · `app-sozlesme-detay` · `app-fatura-detay` ·
`app-tahsilat-detay` · `app-dokuman-detay` · `app-toplanti-detay`

### 4.2 Form ekranları (30)

`app-lead-form` · `app-musteri-form` · `app-musteri-yetkili-form` ·
`app-musteri-iletisim-form` · `app-referans-form` · `app-komisyon-form` ·
`app-onanaliz-form` · `app-teklif-form` · `app-proje-form` · `app-proje-sprint-form` ·
`app-proje-test-form` · `app-proje-hata-form` · `app-proje-teslim-form` ·
`app-proje-degisiklik-form` · `app-gorev-form` · `app-istalebi-form` · `app-destek-form` ·
`app-personel-form` · `app-izin-form` · `app-demirbas-form` · `app-zimmet-form` ·
`app-arac-form` · `app-arac-bakim-form` · `app-arac-muayene-form` · `app-satinalma-form` ·
`app-siparis-form` · `app-tedarikci-form` · `app-sozlesme-form` · `app-fatura-form` ·
`app-toplanti-form`

> Form ekranları `BUILT` içinde "Wave 12b" yorum bloğu altında toplu olarak kayıtlıdır.

---

## 5. Rol → Bölüm Erişimi (`SEC_BY_ROLE`)

27 rol tanımlıdır. `panel`, `sohbet`, `dokuman` ve `ayarlar` bölümleri fiilen her rolde
açıktır (`musteri` rolü hariç: onda `sohbet` yoktur). `gorev` bölümü `musteri` rolü dışında
tüm rollerde açıktır.

| Rol | Erişilen bölüm sayısı | Kapalı bölümler |
|---|---|---|
| `sahip`, `genelmudur`, `sistem` | 15 | — |
| `operasyon` | 15 | — |
| `pm` | 12 | satis, sohbet dışı: satinalma, varlik |
| `satismudur` | 11 | destek, personel, varlik, satinalma |
| `muhasebe` | 11 | satis, proje, destek, personel |
| `satinalma` | 11 | satis, musteri, proje, destek, personel |
| `depmudur` | 10 | satis, musteri, varlik, satinalma, finans |
| `takimlideri` | 10 | satis, musteri, varlik, satinalma, finans |
| `idari` | 10 | satis, musteri, proje, destek, finans, rapor |
| `ik` | 10 | satis, musteri, proje, destek, satinalma, finans |
| `analist` | 9 | destek, personel, varlik, satinalma, finans, rapor |
| `destek` | 9 | satis, personel, varlik, satinalma, finans, rapor |
| `satistemsilci` | 8 | proje, destek, personel, varlik, satinalma, finans, rapor |
| `musteritems` | 8 | satis, proje, personel, varlik, satinalma, finans, rapor |
| `devops` | 9 | satis, musteri, personel, satinalma, finans, rapor |
| `qa` | 8 | satis, musteri, personel, varlik, satinalma, finans, rapor |
| `tasarimci`, `frontend`, `backend`, `mobil`, `ai` | 7 | satis, musteri, destek, personel, varlik, satinalma, finans, rapor |
| `freelancer`, `diskaynak`, `stajyer` | 5 | panel, gorev, sohbet, dokuman, ayarlar dışı hepsi |
| `musteri` | 4 | panel, destek, dokuman, ayarlar dışı hepsi |

Bölüm erişimi tek başına yeterli değildir: `SCREEN_PERM` 11 ekranı ayrıca kısıtlar
(`sirket`, `departmanlar`, `kullanicilar`, `roller`, `yetki`, `onayakis`, `otomasyon`,
`entegrasyon`, `log`, `arsiv`, `yonetici`). Haritada yer almayan bir ekran, bölüm erişimi
olan herkese açıktır.
