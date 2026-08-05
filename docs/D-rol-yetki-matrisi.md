# D. Kullanıcı Rolleri ve Yetki Matrisi

> **Bu doküman neyden türetildi?**
> Kolon şeması `PROMPT.md` §26 bölüm D'den (9 kolon), rol listesi ve yetki eksenleri
> `PROMPT.md` §5'ten alınmıştır. Hücre değerleri **elle yazılmamış**, `assets/data/org.js`
> içindeki `DB.roles` (27 rol) ve `DB.permMatrix` (27 rol satırı) kayıtlarından birebir
> okunmuştur. Uygulama mekanizmaları `assets/js/shell.js` içindeki `Perm` nesnesi
> (`GV.perm.can()` / `GV.perm.scope()` / `GV.perm.mask()` / `GV.perm.sec()`),
> `SEC_BY_ROLE` ve `SCREEN_PERM` haritalarından çıkarılmıştır.
> Kapsam etiketleri: **Tümü** = `tum` (tüm şirket) · **Departman** = `departman` ·
> **Proje** = `proje` · **Kendi** = `kendi` (yalnız kendi kayıtları) · **Yok** = `yok`.

---

## 1. Rol × Yetki Matrisi (PROMPT.md §26-D — 9 kolon)

| Rol | Görüntüleme | Ekleme | Düzenleme | Silme | Onay | Rapor | Finans | Personel Verisi |
|---|---|---|---|---|---|---|---|---|
| Şirket Sahibi (`sahip`) | Tümü | Tümü | Tümü | Tümü | Var | Tümü | Var | Tümü |
| Genel Müdür (`genelmudur`) | Tümü | Tümü | Tümü | Tümü | Var | Tümü | Var | Tümü |
| Operasyon Yöneticisi (`operasyon`) | Tümü | Tümü | Tümü | Yok | Var | Tümü | Var | Departman |
| Departman Yöneticisi (`depmudur`) | Departman | Departman | Departman | Yok | Var | Departman | Yok | Departman |
| Satış Yöneticisi (`satismudur`) | Tümü | Tümü | Tümü | Yok | Var | Tümü | Var | Departman |
| Satış Temsilcisi (`satistemsilci`) | Kendi | Kendi | Kendi | Yok | Yok | Kendi | Yok | Yok |
| Müşteri Temsilcisi (`musteritems`) | Departman | Departman | Kendi | Yok | Yok | Departman | Yok | Yok |
| İş Analisti (`analist`) | Proje | Proje | Proje | Yok | Yok | Proje | Yok | Yok |
| Proje Yöneticisi (`pm`) | Proje | Proje | Proje | Yok | Var | Proje | Var | Proje |
| Takım Lideri (`takimlideri`) | Departman | Departman | Departman | Yok | Var | Departman | Yok | Departman |
| UI/UX Tasarımcı (`tasarimci`) | Kendi | Kendi | Kendi | Yok | Yok | Kendi | Yok | Yok |
| Front-end Geliştirici (`frontend`) | Kendi | Kendi | Kendi | Yok | Yok | Kendi | Yok | Yok |
| Back-end Geliştirici (`backend`) | Kendi | Kendi | Kendi | Yok | Yok | Kendi | Yok | Yok |
| Mobil Geliştirici (`mobil`) | Kendi | Kendi | Kendi | Yok | Yok | Kendi | Yok | Yok |
| Yapay Zekâ Geliştiricisi (`ai`) | Kendi | Kendi | Kendi | Yok | Yok | Kendi | Yok | Yok |
| Test ve Kalite Uzmanı (`qa`) | Proje | Proje | Proje | Yok | Yok | Proje | Yok | Yok |
| DevOps Personeli (`devops`) | Proje | Proje | Proje | Yok | Yok | Proje | Yok | Yok |
| Teknik Destek Personeli (`destek`) | Departman | Departman | Departman | Yok | Yok | Departman | Yok | Yok |
| İnsan Kaynakları (`ik`) | Tümü | Departman | Departman | Yok | Var | Tümü | Yok | Tümü |
| Muhasebe (`muhasebe`) | Tümü | Departman | Departman | Yok | Var | Tümü | Var | Departman |
| Satın Alma Sorumlusu (`satinalma`) | Departman | Departman | Departman | Yok | Var | Departman | Var | Yok |
| İdari İşler Sorumlusu (`idari`) | Departman | Departman | Departman | Yok | Yok | Departman | Yok | Yok |
| Freelancer (`freelancer`) | Kendi | Yok | Kendi | Yok | Yok | Yok | Yok | Yok |
| Dış Kaynak Ekip (`diskaynak`) | Kendi | Yok | Kendi | Yok | Yok | Yok | Yok | Yok |
| Stajyer (`stajyer`) | Kendi | Yok | Kendi | Yok | Yok | Yok | Yok | Yok |
| Müşteri Kullanıcısı (`musteri`) | Kendi | Kendi | Yok | Yok | Var | Kendi | Yok | Yok |
| Sistem Yöneticisi (`sistem`) | Tümü | Tümü | Tümü | Tümü | Var | Tümü | Var | Tümü |

**27 rol · 27 satır.** Sıra `PROMPT.md` §5'teki rol sırasıdır; `DB.roles` de aynı sırayı
kullanır (tek fark: `sistem` her iki kaynakta da listenin sonundadır).

Okuma notları:

- **Müşteri Kullanıcısı**'nın `onay: true` olması yönetsel bir onay değildir; müşteri
  portalında teklif / iş kabul / fatura itiraz onayını temsil eder ve `SEC_BY_ROLE`
  ile yalnız `panel · destek · dokuman · ayarlar` bölümlerine sınırlanır.
- **Silme** yetkisi yalnız 3 rolde (`sahip`, `genelmudur`, `sistem`) vardır. Diğer roller
  için yıkıcı işlem yerine arşivleme / pasife alma akışı kullanılır.
- **Freelancer / Dış Kaynak / Stajyer** ekleyemez ama kendi kaydını düzenleyebilir
  (kendine atanmış görev güncellemesi); raporlara hiç erişemez.

---

## 2. `DB.permMatrix`'in Tüm Eksenleri — Rol × Eksen Özeti

`DB.permMatrix` her rol için **11 eksen** saklar. Bunlardan 6'sı kapsam değerli
(`tum|departman|proje|kendi|yok`), 5'i boolean. `app-ayar-yetki.html` bu 11 saklı eksenden
**19 boolean yetki ekseni** türetir (`AXES` dizisi) ve 6 kapsam eksenini ayrıca sunar —
`PROMPT.md` §5'teki yetki kalemlerinin ekran karşılığı budur.

> **Dürüst not:** Görevde "20 eksen" denmişti; kodda karşılığı olan sayılar
> **11 saklı eksen**, **19 türetilmiş boolean eksen** ve **6 kapsam ekseni**dir.
> 20 sayısının kaynağı `DB.permMatrix` değildir; aşağıdaki iki tablo koddaki
> gerçek eksenleri eksiksiz listeler.

### 2a. Saklı 11 eksen — kaç rolde hangi kapsam

| # | Eksen (`DB.permMatrix` anahtarı) | Tip | Tümü | Departman | Proje | Kendi | Yok | Yetkili rol sayısı |
|---|---|---|---:|---:|---:|---:|---:|---:|
| 1 | `gor` — Görüntüleme | kapsam | 7 | 6 | 4 | 10 | 0 | **27 / 27** |
| 2 | `ekle` — Ekleme | kapsam | 5 | 8 | 4 | 7 | 3 | **24 / 27** |
| 3 | `duzenle` — Düzenleme | kapsam | 5 | 7 | 4 | 10 | 1 | **26 / 27** |
| 4 | `sil` — Silme | kapsam | 3 | 0 | 0 | 0 | 24 | **3 / 27** |
| 5 | `rapor` — Raporlama | kapsam | 7 | 6 | 4 | 7 | 3 | **24 / 27** |
| 6 | `personel` — Personel verisi | kapsam | 4 | 5 | 1 | 0 | 17 | **10 / 27** |
| 7 | `onay` — Onaylama / reddetme | boolean | — | — | — | — | — | **12 / 27** |
| 8 | `finans` — Finansal bilgi | boolean | — | — | — | — | — | **8 / 27** |
| 9 | `maas` — Maaş bilgisi | boolean | — | — | — | — | — | **4 / 27** |
| 10 | `log` — Log kayıtlarına erişim | boolean | — | — | — | — | — | **5 / 27** |
| 11 | `disaAktar` — Dışa aktarma | boolean | — | — | — | — | — | **14 / 27** |

Boolean eksenlerde yetkili roller:

| Eksen | Yetkili roller |
|---|---|
| `onay` (12) | sahip · genelmudur · sistem · operasyon · depmudur · satismudur · pm · takimlideri · ik · muhasebe · satinalma · musteri |
| `finans` (8) | sahip · genelmudur · sistem · operasyon · satismudur · pm · muhasebe · satinalma |
| `maas` (4) | sahip · genelmudur · ik · muhasebe |
| `log` (5) | sahip · genelmudur · sistem · operasyon · devops |
| `disaAktar` (14) | sahip · genelmudur · sistem · operasyon · depmudur · satismudur · satistemsilci · analist · pm · takimlideri · ik · muhasebe · satinalma · idari |

Kapsam eksenlerinde rol dağılımı:

| Eksen | Tümü | Departman | Proje | Kendi | Yok |
|---|---|---|---|---|---|
| `gor` | sahip, genelmudur, sistem, operasyon, satismudur, ik, muhasebe | depmudur, musteritems, takimlideri, destek, satinalma, idari | analist, pm, qa, devops | satistemsilci, tasarimci, frontend, backend, mobil, ai, freelancer, diskaynak, stajyer, musteri | — |
| `ekle` | sahip, genelmudur, sistem, operasyon, satismudur | depmudur, musteritems, takimlideri, destek, ik, muhasebe, satinalma, idari | analist, pm, qa, devops | satistemsilci, tasarimci, frontend, backend, mobil, ai, musteri | freelancer, diskaynak, stajyer |
| `duzenle` | sahip, genelmudur, sistem, operasyon, satismudur | depmudur, takimlideri, destek, ik, muhasebe, satinalma, idari | analist, pm, qa, devops | satistemsilci, musteritems, tasarimci, frontend, backend, mobil, ai, freelancer, diskaynak, stajyer | musteri |
| `sil` | sahip, genelmudur, sistem | — | — | — | diğer 24 rol |
| `rapor` | sahip, genelmudur, sistem, operasyon, satismudur, ik, muhasebe | depmudur, musteritems, takimlideri, destek, satinalma, idari | analist, pm, qa, devops | satistemsilci, tasarimci, frontend, backend, mobil, ai, musteri | freelancer, diskaynak, stajyer |
| `personel` | sahip, genelmudur, sistem, ik | operasyon, depmudur, satismudur, takimlideri, muhasebe | pm | — | diğer 17 rol |

### 2b. Türetilmiş 19 boolean eksen (`app-ayar-yetki.html` → `AXES`)

Her eksenin `base(m)` fonksiyonu saklı matristen varsayılanı hesaplar; `secs` alanı ekseni
anlamlı kılan bölümleri sınırlar; bölüm kapalıysa (`SEC_BY_ROLE`) eksen de kapalıdır.
Aşağıdaki sayılar **bölüm süzgeci uygulanmadan önceki** rol sayılarıdır.

| # | Eksen | Türetme kuralı | Yetkili rol |
|---|---|---|---:|
| 1 | Görüntüleme (`gor`) | `gor !== 'yok'` | 27 |
| 2 | Listeleme (`liste`) | `gor !== 'yok'` | 27 |
| 3 | Kayıt detayı (`detay`) | `gor !== 'yok'` | 27 |
| 4 | Ekleme (`ekle`) | `ekle !== 'yok'` | 24 |
| 5 | Düzenleme (`duzenle`) | `duzenle !== 'yok'` | 26 |
| 6 | Silme (`sil`) | `sil !== 'yok'` | 3 |
| 7 | Arşivleme (`arsiv`) | `duzenle !== 'yok' && onay` | 11 |
| 8 | Pasife alma (`pasif`) | `duzenle ∉ {yok, kendi}` | 16 |
| 9 | Onaylama (`onay`) | `onay` | 12 |
| 10 | Reddetme (`ret`) | `onay` | 12 |
| 11 | Görev atama (`atama`) | `ekle ∉ {yok, kendi}` · yalnız panel/proje/görev/destek/satınalma/toplantı/personel | 17 |
| 12 | Dosya yükleme (`dosyaYukle`) | `ekle !== 'yok'` | 24 |
| 13 | Dosya indirme (`dosyaIndir`) | `gor !== 'yok'` | 27 |
| 14 | Finansal bilgi (`finans`) | `finans` · satış/müşteri/proje/varlık/satınalma/finans/rapor | 8 |
| 15 | Maaş bilgisi (`maas`) | `maas` · personel/rapor | 4 |
| 16 | Personel raporu (`personelRapor`) | `rapor !== 'yok' && personel !== 'yok'` · personel/rapor | 10 |
| 17 | Müşteri raporu (`musteriRapor`) | `rapor !== 'yok'` · satış/müşteri/destek/rapor | 24 |
| 18 | Dışa aktarma (`disaAktar`) | `disaAktar` | 14 |
| 19 | Log erişimi (`log`) | `log` · yalnız ayarlar | 5 |

`GV.perm.can()` bu türetmelerden ikisini (`musteriRapor`, `personelRapor`) doğrudan
uygular; kalanlar ekranlarda ilgili saklı eksen üzerinden sorulur.

---

## 3. Erişim Seviyeleri ve Uygulama Mekanizmaları

`PROMPT.md` §5: *"Yetkilendirme yalnızca menü gizleme şeklinde yapılmamalıdır."*
Aşağıda her seviyenin kodda hangi mekanizmayla karşılandığı yazılıdır.

| Seviye | Mekanizma | Nerede | Durum |
|---|---|---|---|
| **Rol bazlı yetki** | `DB.permMatrix[rol]` → `GV.perm.can(aksiyon)` / `GV.perm.scope(eksen)`; bölüm erişimi `SEC_BY_ROLE` → `GV.perm.sec()`; ekran erişimi `SCREEN_PERM` → `guard()` 403 ekranı | `assets/js/shell.js`, `assets/data/org.js` | Çalışıyor (114 ekran `can()` çağırıyor) |
| **Kullanıcı bazlı özel yetki** | Rol matrisi üzerine bölüm × eksen override: `permMatrix[rol].modul[bolum][eksen]`; oturum içinde `app-ayar-yetki.html` ve `app-ayar-kullanici.html` yazar | `app-ayar-yetki.html` → `cellVal()` / `setCell()` | Prototip düzeyinde çalışıyor (kalıcılık yok — statik prototip) |
| **Departman bazlı erişim** | `scope('gor'|'ekle'|'duzenle'|'rapor'|'personel') === 'departman'` → kayıt `dep` alanı oturumun `session.dep` değeriyle karşılaştırılır | `GV.perm.scope()` + ekran süzgeci | Kısmi — bkz. aşağıdaki açık |
| **Proje bazlı erişim** | `scope(...) === 'proje'` → kaydın proje kodu, kullanıcının atandığı projelerle eşleştirilir | `app-rapor-proje.html`, `app-panel-ozet.html` | Kısmi — yalnız 4 ekran uyguluyor |
| **Müşteri bazlı erişim** | `musteri` rolü `gor:'kendi'` + `SEC_BY_ROLE.musteri` = `panel · destek · dokuman · ayarlar`; müşteri portalı yalnız kendi kayıtlarını görmeli | `SEC_BY_ROLE` + `scope('gor')` | Bölüm kapsamı çalışıyor, satır kapsamı eksik (bkz. açık) |
| **Kayıt bazlı erişim** | `scope(...) === 'kendi'` → kaydın `sahip`/`atanan` alanı `session.emp` ile karşılaştırılır | `GV.perm.scope()` | Kısmi — bkz. açık |
| **Alan bazlı erişim** | `GV.perm.mask(value, 'finans'|'maas'|'log'|'disaAktar')` → yetkisiz rolde değer `••••••` olarak basılır; hassas alan envanteri `app-ayar-yetki.html` içinde listelenir | `assets/js/shell.js` → `Perm.mask()` | Çalışıyor (maaş, finansal tutar, log alanları) |
| **Çoklu şirket / tenant bazlı erişim** | Tek tenant sabiti: `DB.company.tenant = 'gaviaworks'`. Tüm veri tek tenant altında; çoklu tenant ayrımı prototipte modellenmedi | `assets/data/org.js` | Modellenmedi (tek tenant varsayımı) |

### Bilinen açık — `GV.perm.scope('gor')` satır kapsamına uygulanmıyor

`tasks/ui-debt.md` **UID-05**: `GV.perm.scope('gor')` doğru kapsam değerini
(`tum | departman | proje | kendi`) döndürüyor, ancak bu değeri satır süzgecine çeviren
ortak bir katman yok. `GV.list` kullanan **65+ liste ekranından yalnız dördü**
(`app-panel-ozet.html`, `app-rapor-personel.html`, `app-rapor-proje.html`,
`app-zaman-onay.html`) kapsamı okuyor; kalan liste ekranları kaynağın tamamını basıyor.

Ölçülen örnek: `app-destek-paket.html`, `musteri` rolüyle açıldığında 6 müşterinin bakım
paketini birden gösteriyor — **alan maskeleme çalışıyor, satır kapsamı çalışmıyor.**

Pratik sonucu: yukarıdaki tablonun **departman · proje · kayıt · müşteri** satırları
bugün *tam* değil. Kapsam kararı doğru üretiliyor, tüketilmiyor. Doğru çözüm 65 ekrana tek
tek süzgeç yazmak değil, `GV.list` veri kaynağına kapsam süzgecini ortak katmanda
uygulamaktır; UID-05 bu şekilde kayıtlı ve **açık** durumdadır.

---

## 4. Kaynak Dosyalar

| Dosya | İçerik |
|---|---|
| `PROMPT.md` §5 | 27 rol · yetki kalemleri · 8 erişim seviyesi |
| `PROMPT.md` §26-D | Bu dokümanın 9 kolonlu şeması |
| `assets/data/org.js` | `DB.roles` (27 rol) · `DB.permMatrix` (27 satır × 11 eksen) |
| `assets/js/shell.js` | `SEC_BY_ROLE` · `SCREEN_PERM` · `Perm.can/scope/sec/item/mask` · `guard()` 403 |
| `app-ayar-yetki.html` | 19 boolean eksen + 6 kapsam ekseni · bölüm × eksen matris editörü |
| `tasks/ui-debt.md` | UID-05 — kapsam süzgeci açığı |
