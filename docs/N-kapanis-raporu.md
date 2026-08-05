# N. Kapanış Raporu — Kalite Geçişi, 10. Oturum

**Tarih:** 2026-08-05 · **Kapsam:** 141 ekran · **Dal:** `main`
**plan.md:** 234 / 292 madde (%80) · 23 kısmen · 35 açık

> Bu rapor **ölçüm raporudur**. Her satırın arkasında bir tarama çıktısı vardır;
> ölçülemeyen şey "temiz" diye yazılmaz, **ölçülemedi** diye yazılır.

---

## 1. Tarama seti — 14 eksen, tek turda

| Eksen | Ne sorar | Taranan ekran | Yüklenen kayıt / ölçülen birim | Sonuç |
|---|---|---|---|---|
| `rec.js` | Tarama hedefi gerçek bir kayıt açıyor mu | 62 | 62 hedef | ✅ TEMİZ |
| `canon.js` | 20 canonical eksen tutarlı mı | — (veri) | **672 kontrol** | ✅ TEMİZ |
| `dbref.js` | Okunan koleksiyonun dosyası yüklü mü | **141** | — | ✅ TEMİZ |
| `links.js` | Kırık hedef · hayalet BUILT · yetim ekran | **141** | 142 BUILT kaydı | ✅ TEMİZ |
| `esc.js` | Etikette ham HTML var mı | **141** | 62/62 kayıt | ✅ TEMİZ |
| `tabs.js` | Detay sekmeleri açılıyor mu | 26 | 26/26 kayıt · **223 tıklama** | ✅ TEMİZ |
| `mut.js` | `GV.refresh` idempotent mi | 62 | 62/62 kayıt | ✅ TEMİZ |
| `listen.js` | Dinleyici birikiyor mu | 62 | 62/62 kayıt | ✅ TEMİZ |
| `swtest.js` | Anahtar kontrolü görünür mü | 1 | 40×24 px | ✅ TEMİZ |
| `grip-qa.js` | Rail tutamağı geometrisi | 1 | tüm ölçümler | ✅ TEMİZ |
| **`xport.js`** | Çıktı ekrandaki bilgiyi taşıyor mu | **141** | 68 liste · 730 kayıt · **623 kolon / 6.551 hücre** | ⚠️ 16 ekranda **kısmi** (aşağıda) |
| **`ctl.js`** | Kontrol–etiket boşluğu · native kontrol | **141** | **197 panel** · 2.422 çift · 734 select · 4.179 kutu | ✅ TEMİZ |
| **`act.js`** | Bu buton gerçekten bir şey yapıyor mu | **141** | 62 kayıt · **207 aksiyon** | ✅ TEMİZ |
| `qa.js` | 1440/768/390 konsol · taşma · sahte link | **141** | 3 kırılım | ✅ TEMİZ |
| `gate.js` | Her ekran × 5 rol | **141** | **705 sayfa yüklemesi** | ✅ TEMİZ |

**141'in altında tarayan üç script ve sebebi (L-24):** `tabs.js` yalnız **detay**
ekranlarını gezer (26) · `mut.js` ve `listen.js` yalnız `rec.js`'in doğruladığı
**62 kayıtlı hedefi** gezer (mutasyon ve dinleyici ancak gerçek kayıtta ölçülür) ·
`swtest`/`grip-qa` tek bir bileşeni ölçen nokta testleridir.

### `act.js` dökümü — 207 aksiyon

| Hüküm | Sayı |
|---|---|
| MUTASYON (veri değişti) | 61 |
| YÖNLENDİRME | 33 |
| PANEL (kullanıcıya bir şey sundu) | 42 |
| **ÇIKTI** (dosya gerçekten indi) | 51 |
| DÜRÜST RED (uyardı, iddia etmedi) | 10 |
| 🔴 YALAN | **0** |
| ⚫ ÖLÜ | **0** |

**Sessizce yeşile yazılmayan iki boşluk:**
1. **19 aksiyon** girdi soran bir panel açıyor; "doldur → kaydet" **ikinci adımı bu
   eksende ölçülmedi** (km girişi, sorumlu seçimi, iade gerekçesi gibi).
2. **2 toplu işlem ulaşılamadı** — `app-pipeline` varsayılan kanban görünümünde ve
   `app-zaman` "Kayıtlarım" sekmesi boş olduğu için seçilebilir satır yok.
   Bu bir aksiyon hatası değil, **kanban görünümünde toplu seçim olmaması** (UID-26'ya bağlı).
3. **32 toplu aksiyon** hâlâ `disabled` + "bu sürümde yok" damgalı — kapsamı dürüstçe
   gösteriyorlar, ihlal değiller.

### `xport.js` dökümü — neden "kısmi"

623 kolonun **hiçbiri** çıktıya değer taşımayı tamamen bırakmıyor. 6.551 hücrenin
**53'ünde** (%0,8) ekranda metin var, çıktıda boş: hepsi aynı sınıf — veri alanı boş
ya da `'—'` iken ekranın **yer tutucu metin** basması (`Zimmetsiz` · `Süresiz` ·
`Proje dışı` · `Tercih bekliyor` · `Vekil yok`). CSV/Excel için boş hücre **doğru
davranıştır**; kayıt bilgi kaybı değildir. Bu yüzden madde açık bırakılmadı.

---

## 2. Bu oturumda kapanan borçlar (18 kayıt)

| Kod | Özet | Kanıt |
|---|---|---|
| **UID-07** | Seçili kapsamı dışa aktarma — `exportRows` + `bulk[].export` | 53 ekran çalışır oldu · 51 çıktı aksiyonu dosya üretiyor |
| **UID-30** | Ekranın kendi `run` gövdesi yalan söylüyordu | 10 yalan → **0** |
| **UID-08 + UID-09** | Kontrol–etiket boşluğu ve native kontroller | bitişik **0/2.422** · native select **0/734** · native kutu **0/4.179** |
| **UID-11 + UID-25 + UID-28** | KPI maskeleme · çıktı yetki kapısı · kardeş ekran ayrışması | 28 `canFinans ? x : 0` + 9 elle kapı silindi; `app-arac-yakit` birim fiyatı artık geri hesaplanamıyor |
| **UID-12 + UID-21** | Dış bağlantı sessizce yanlış küme döndürüyordu | "Tümü" sekmesi · `referans` süzgeci · hiç okunmayan 3 parametre |
| **UID-24 · UID-29** | Üç değerin ikiye düşmesi · sabit ay | tüm ekranlarda `slice(0,7)` taraması yapıldı |
| **VB-06 + VB-23 + VB-25** | Aynı işlem ekrandan ekrana ayrışıyordu | yeni `assets/js/domain.js`; bekleyen tahsilat 285.000 → 0 |
| **VB-27 · VB-29** | Yetim anket kodları · hatırlatma ekseni | 6 geçmiş proje · `DB.reminders` · `okuyanlar`; canon eksen 19 ve 20 |
| **VB-09 · VB-14 · VB-17 · VB-22** | Yasak terim · sekiz eksenin sözlüğü | "saha" 5 yerde bulundu → 0; form seçenekleri 1 → 4/5 |

---

## 3. Ortak katmanda ne değişti

| Katman | Ekleme |
|---|---|
| **`assets/js/domain.js` (YENİ)** | `GV.fin.settleInvoice/settlePayment/refreshCustomer` · `GV.delivery.approve/kararlar` — bir olgu birden çok koleksiyona dokunuyorsa mutasyon burada |
| `assets/js/ui.js` | `exportRows` · `bulk[].export` · `kpis[].perm/mask` · `columns[].perm/mask(row)` · `disaAktar` kapısı · üç yeni ton |
| `assets/css/ui.css` | Kontrol–etiket **taban kuralı** (kalıba bağlı, sınıfa değil) · checkbox/radio/select/tarih standardı · `.kpi-num.is-masked` |
| `assets/data/*.js` | `DB.reminders` · `announcements[].okuyanlar` · 8 sözlük · 6 geçmiş proje |
| `tasks/qa/` | **`xport.js`** ve **`ctl.js`** yeni eksen · `act.js` beş hüküm düzeltmesi · `canon.js` eksen 19–20 |

---

## 4. Dürüst bakiye — açık kalanlar

**Ölçüm boşlukları (yukarıda sayıldı):** modal ikinci adımı (19 aksiyon) · kanban/boş
sekmede ulaşılamayan toplu işlem (2) · tarih kontrolünün biçimi çalışma zamanında
okunamıyor (201 alan, kural statik doğrulanıyor).

**Sıradaki blok — tutarlılık:** VB-28 (§22'nin üç eksik bağı + iki boş alan) ·
UID-16 (aktivite kapsamı) · VB-12/VB-13 (kişi kimliği) · VB-04 + VB-16 (alan adı
rename turu, 111 kullanım) · VB-10/11/15/18/20/24/26.

**Sonra — yapısal ve kozmetik:** UID-26 (`GV.list` kilidi; `doExport` çıkarıldı, dört
yordam içeride) · UID-05 (satır kapsamı) · UID-15 (13 ekran elle iskelet) · UID-17
(`GV.dl`) · UID-02/03/04/06/10/14/18/19/22/23 · VB-21.

**Bu oturumun dersi (L-26 + L-27):** ölçüm aracı borcu **eksik de fazla da** sayabilir.
`act.js` UID-30'u 28 gösteriyordu, gerçek 10'du; `xport.js` ise kendi yaması kaydığında
**hata vermeden "0 kolon — temiz"** dedi. İki kural yazıldı: yeni bir hüküm eklenirken
*"bu hüküm hangi sağlıklı davranışı ihlal gösterir?"* diye sorulur, ve **düzeneğini
kuramayan araç susmaz, durur** (`exit 2`).
