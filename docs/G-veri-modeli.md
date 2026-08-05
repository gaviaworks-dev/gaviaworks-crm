# G. Veri Modeli — GaviaWorks CRM

> **Neyden türetildi.** Bu belge `assets/data/crm.js` · `hr.js` · `misc.js` · `ops.js` · `org.js` ·
> `work.js` dosyalarının tamamının okunmasından ve mock verinin **ölçülmesinden** üretildi.
> Sözleşme metinleri `tasks/components.md` §9 (Destek ve Bakım Veri Sözleşmeleri), §9b (Finans Para
> Konvansiyonu), §9c (Tedarikçi Puan Eksenleri), §9d (Modüller Arası Bağ Alanı Sözleşmesi) ve
> `tasks/assumptions.md`'den alındı; eksen listesi `PROMPT.md` §26 bölüm G'nin (satır 2167–2179)
> istediği başlıklardır. **Ölçüm tarihi: 2026-08-05.** Verinin kendi zaman ekseni ayrıdır:
> `DB.today = '2026-08-03'` (assumptions V-07).
> Alan türleri ve doluluk oranları veriden sayılarak yazıldı; bir alan hakkında ölçülebilir bilgi
> yoksa "veride yok" denir, tahmin yürütülmez.

---

## 0. Envanter

| Yapı | Sayı | Not |
|---|---|---|
| Nesne dizisi koleksiyon (`DB.<ad>[]`) | **65** | Toplam **636** kayıt |
| Skaler sözlük dizisi (`DB.<ad>` = `[...]` metin) | 11 | `refTypes` `sectors` `services` `lostReasons` `taskStatuses` `taskTypes` `priorities` `impacts` `leaveTypes` `notificationChannels` `assetCategories` |
| Tekil nesne | 3 | `DB.company` · `DB.permMatrix` · `DB.taskTransitions` |
| Skaler | 1 | `DB.today` |
| Yardımcı fonksiyon | 10 | `emp` `empName` `dep` `depName` `roleName` (org.js) · `proj` `projName` `mod` `modName` `task` (work.js) |

Dosya bazında koleksiyon dağılımı:

| Dosya | Koleksiyon | Kayıt |
|---|---|---|
| `assets/data/org.js` | 3 | 64 |
| `assets/data/crm.js` | 10 | 93 |
| `assets/data/work.js` | 14 | 131 |
| `assets/data/hr.js` | 6 | 77 |
| `assets/data/misc.js` | 13 | 140 |
| `assets/data/ops.js` | 19 | 131 |

**Kod öneki → koleksiyon haritası** (kayıt numarasından koleksiyon okunur):

`EMP` employees · `DEP` departments · `MUS` customers · `YTK` contacts · `REF` referrers · `LEAD` leads · `ANL` analyses · `TKL` quotes · `ILT` interactions · `KOM` commissions · `PRJ` projects · `MOD` projectModules · `MS` milestones · `SPR` sprints · `GRV` tasks · `ALT` subtasks · `TLP` deptRequests · `HTA` bugs · `TST` tests · `TSL` deliveries · `DGS` changeRequests · `ONY` approvals · `IZN` leaves · `ZMN` timelogs · `TSH` timesheets · `PRF` performance · `EGT` trainings · `SZL` contracts · `FTR` invoices · `THS` payments · `TOP` meetings · `KRR` decisions · `DOK` documents · `KNL` channels · `MSG` messages · `BLD` notifications · `DUY` announcements · `OTO` automations · `ENT` integrations · `LOG` logs · `DMB` assets · `ZMT` assignments · `ARC` vehicles · `BKM` maintenance · `MYN` inspections · `PLC` policies · `YKT` fuelLogs · `AGD` vehicleExpenses · `KZA` accidents · `CEZ` fines · `TDR` suppliers · `SAT` purchases · `SIP` orders · `DST` tickets · `BKP` supportPackages · `SLA` slaPolicies · `ANK` surveys.

### Okuma kılavuzu

- **Tür**, o alanın tüm kayıtlardaki JavaScript türlerinin birleşimidir. `metin/null` = alan her kayıtta var ama bazılarında `null`. Tarih ve tarih-saat değerleri veride **metindir** (`'2026-08-03'`, `'2026-08-02T16:20'`) — Date nesnesi kullanılmaz.
- **Zorunlu**, "koleksiyonun her kaydında anahtar var ve değeri `null` değil" demektir.
- **Opsiyonel** iki biçimde geçer: (a) anahtar her kayıtta var ama bazılarında `null`, (b) anahtar bazı kayıtlarda **hiç yok** — bunlar `(n/N)` ile işaretlidir ve §Şema tekdüzeliği bölümünde toplu raporlanır.
- **İlişki yönü** `components.md` §9d kuralına tabidir: bağ **doğan/bağımlı** kaydın üstünde tutulur, hedefte ayna alan açılmaz.

---

## 1. Para Ekseni Tablosu (net / brüt)

> `components.md` §9b'den birebir. Ekleme yapılmadı.
> **Tek konvansiyon.** Aynı alanda iki eksen yaşayamaz (lessons L-13).
> Kaynak yorum: `misc.js` → `DB.contracts` başlığı.

| Alan | Eksen | Kural |
|---|---|---|
| `DB.contracts[].tutar` | **NET** (KDV hariç) | Sözleşme bedelinin tek eksenidir |
| `DB.contracts[].kdvOran` · `.kdv` | — | KDV yüzdesi ve hesaplanan tutar (tümü %20) |
| `DB.contracts[].toplam` | **BRÜT** | `tutar + kdv` — ekranda gösterilen bedel |
| `DB.milestones[].odeme` | **NET** | Taksitin net tutarı = bağlı faturanın `tutar`ı |
| `DB.milestones[].taksit` · `.sozlesme` | — | Ödeme planındaki sıra (1 tabanlı) + bağlı sözleşme |
| `DB.invoices[].tutar / .vergi / .toplam` | net / KDV / brüt | `toplam = tutar + vergi`; `tutar` = milestone `odeme` |
| `DB.payments[].tutar` | **BRÜT** | Faturanın `toplam`ı |
| `DB.projects[].sozlesmeTutari` | **NET** | Sözleşmenin `tutar`ı |
| `DB.maintenance[].maliyet` · `DB.policies[].prim` · `DB.vehicleExpenses[].tutar` · `DB.fuelLogs[].tutar` | **BRÜT** (KDV dahil) | Filo tarafında ödenen tutar ekseni — fatura brütü. Gider kaydı kaynak tutarı olduğu gibi taşır, net'e çevirmez. Etikette "(KDV dahil)" yazılır |
| `DB.employees[].maas` · `.saatlikUcret` | **BRÜT** | Çalışan brütü; işveren SGK payı dahil değildir. `saatlikUcret` yalnız o eksende çalışanda vardır (16 kaydın 1'i); orada `maas:0` "uygulanmaz" işaretidir |
| `DB.projects[].butce` · `.gerceklesenMaliyet` | **NET** | İç bütçe ve gerçekleşen maliyet — şirketin kendi gider ekseni. 8 projenin 8'inde `butce ≤ sozlesmeTutari`; `gerceklesenMaliyet` bütçeyi aşabilir |
| `DB.customers[].bekleyenTahsilat` | **BRÜT** | Açık (durumu `Ödendi` olmayan) tahsilatlarının toplamı |
| `DB.customers[].toplamCiro` | **NET** | Ömür boyu net ciro; DB'deki sözleşmelerinin `tutar` toplamından küçük olamaz |
| `DB.quotes[].araToplam` · `.indirim` · `.vergi` · `.toplam` | net / net / KDV / **BRÜT** | Zincir: `net = araToplam − indirim` → `vergi = net × vergiOran/100` → `toplam = net + vergi` |
| `DB.leads[].butce` | **NET** | Müşterinin beyan ettiği tahmini bütçe |
| `DB.supportPackages[].tutar` | **NET** | Paket bedeli |
| `DB.purchases[].tahminiMaliyet` | **NET** | Talebin tahmini bedeli; doğan siparişin `tutar`ı ile birebir |
| `DB.supplierQuotes[].fiyat` | **NET** | Teklif edilen bedel |
| `DB.orders[].tutar / .vergi / .toplam` | net / KDV / **BRÜT** | `toplam = tutar + vergi` |
| `DB.analyses[].maliyet` | **NET, indirim öncesi** | Alan adı yanıltıcı: iç maliyet değil, teklifin `araToplam`'ı. Ad **VB-16** ile düzeltilecek |
| `DB.referrers[].ciro` · `.sabitBedel` | **NET** | Ömür boyu net ciro; bağlı müşterilerin toplamından küçük olamaz |
| `DB.referrers[].hakedis` · `.odenen` · `.bekleyen` | **NET** | Komisyon kayıtlarından türetilir (`hakedis` adı **VB-04** ile değişecek) |
| `DB.suppliers[].toplamTutar` | **NET** | Ömür boyu iş hacmi |
| `DB.assets[].alisFiyati` | **NET** | Bir siparişten doğan demirbaş grubunun toplamı siparişin **netine** eşittir |
| `DB.changeRequests[].etkiMaliyet` | **NET** | Müşteriye yansıyan bedel; `projects.butce` ile aynı satırda toplanmaz |

### 1a. KDV ekseni — teklif → sözleşme aktarımı (VB-19)

Teklif kalemleri **NET**, `DB.contracts[].tutar` **NET**; `kdv` ve `toplam` bunlardan **türetilir**. `contract.tutar` teklifin **netine** eşittir (`araToplam − indirim`), teklifin brütüne **değil** — brütü almak KDV'yi zincirde ikinci kez uygular. Bunun tek doğru kaynağı `components.md` §9b'dir.

**Zincir:** Σ taksit (`DB.milestones[].odeme`) = sözleşme neti → `DB.invoices[].tutar` = taksit → `DB.payments[].tutar` = fatura brütü → `DB.customers[].toplamCiro` = Σ sözleşme neti.

Ölçüm (2026-08-05, bu belge için tekrarlandı):

| Kontrol | Sonuç |
|---|---|
| `contract.tutar === quote.araToplam − quote.indirim` | teklifi yazılı **3/3** sözleşme tutuyor (SZL-2026-021 500.000 · SZL-2026-020 295.000 · SZL-2025-018 920.000). Aynı sözleşmelerin brütü 600.000 / 354.000 / 1.104.000 — hiçbiri `tutar`a eşit değil |
| `Σ milestone.odeme === contract.tutar` | Projeli **6/6** sözleşmede birebir; `taksit` numaraları 1..N boşluksuz (19 taksit) |
| `invoice.tutar === milestone.odeme` | Milestone bağı olan **15/15** fatura |
| `invoice.tutar + invoice.vergi === invoice.toplam` | **17/17** |
| `payment.tutar === invoice.toplam` | **17/17** |
| `customer.toplamCiro === Σ contract.tutar` | 12 müşterinin **6'sında birebir**, 5'inde kart değeri büyük, **hiçbirinde küçük değil** (ömür boyu sayaç kuralı — §9b) |
| `customer.bekleyenTahsilat === Σ açık tahsilat brütü` | **12/12** |
| `Σ asset.alisFiyati === order.tutar` (net) | SIP-2026-008: 3 × 9.500 = 28.500 = siparişin neti (brüt 34.200 değil) |

**İstisna:** `SZL-2026-022` (Deniz Lojistik yıllık bakım) proje bazlı değildir, `DB.milestones`'ta taksiti yoktur; aylık fatura olarak yürür (`FTR-2026-031`, 15.000 net / 18.000 brüt). Bu bilinçlidir (assumptions V-25), Σ taksit = 0 ≠ 180.000 sapması **bu tek kayıt için** beklenen davranıştır.

---

## 2. Yetki Eksenleri

`DB.permMatrix` 27 rolün her biri için aynı 11 ekseni tutar. Kayıt tipleri bu eksenlere şöyle bağlanır:

| Eksen | Değerler | Ne kapsar |
|---|---|---|
| `gor` · `ekle` · `duzenle` · `sil` | `tum` · `departman` · `proje` · `kendi` · `yok` | Kayıt görünürlüğü ve mutasyon kapsamı |
| `onay` | boolean | Onay kuyruğu (`DB.approvals`), izin, satın alma, teklif iç onayı, görev onayı |
| `rapor` | `tum` · `departman` · `proje` · `kendi` · `yok` | Rapor ekranları |
| `finans` | boolean | Sözleşme, fatura, tahsilat, teklif tutarı, komisyon, satın alma bedeli, proje bütçesi |
| `maas` | boolean | `DB.employees[].maas` / `.saatlikUcret` |
| `personel` | `tum` · `departman` · `proje` · `yok` | Personel kartı, izin, timesheet, performans, eğitim |
| `log` | boolean | `DB.logs` |
| `disaAktar` | boolean | Liste bileşeninin Excel/CSV/PDF çıktısı |

İki eksen matriste **kolon olarak yoktur**, türetilir (assumptions V-13): `musteriRapor` = rapor yetkisi **ve** Müşteriler bölümüne erişim · `personelRapor` = rapor yetkisi **ve** personel verisi kapsamı **ve** Personel bölümüne erişim. Hassas alanlar (maaş, TCKN, IBAN) yetkisiz rolde `••••` maskelenir ve "görüntüle" aksiyonu aktivite log'una yazılır (V-12) — veride bunun tek örneği `LOG-88199` "Maaş bilgisi görüntüledi".

---

## 3. Organizasyon — `assets/data/org.js`

### `DB.today` · skaler
`'2026-08-03'`. Tüm gecikme/yaklaşma hesaplarının referans günü. Yetki: yok (herkes okur).

### `DB.company` · tekil nesne
Alanlar: `ad` · `unvan` · `vergiDairesi` · `vergiNo` · `kurulus` · `adres` · `telefon` · `eposta` · `web` · `calisanSayisi` (16) · `paket` (`'Kurumsal'`) · `tenant` (`'gaviaworks'`) — hepsi metin, `calisanSayisi` sayı. Durum alanı yok, arşiv yok, log yok. Yetki: `sistem` / `sahip` (ayarlar ekranı).

### `DB.departments` — Departmanlar · n=21 · anahtar `kod` (DEP-NN)
- **Alanlar:** `kod` metin · `ad` metin · `kisa` metin · `yonetici` metin · `aktif` boolean · `personel` sayı
- **Zorunlu:** 6 alanın 6'sı 21/21 dolu. Opsiyonel alan yok.
- **İlişkiler:** `yonetici` → `DB.employees` (tekil, 21/21 çözülüyor). Ters yön: `DB.employees[].dep`.
- **Durumlar:** yalnız `aktif` boolean; ayrı durum sözlüğü yok.
- **Arşiv:** `aktif:false` 1 kayıt (`DEP-19` İçerik Üretimi). `arsiv` anahtarı yok.
- **Log:** `DB.logs` / `DB.activities`'te DEP öneki geçmiyor — **veride yok**.
- **Yetki:** ayarlar ekranı (`sahip` · `genelmudur` · `sistem` · `ik`); `personel` ekseni.
- **Not:** `personel` alanı departmana atanmış personel sayısını değil, `DB.employees[].dep` sayımından bağımsız bir kart sayacını taşır (ör. DEP-01 `personel:1`, DEP-02 `personel:2`).

### `DB.roles` — Roller · n=27 · anahtar `key` (**`kod` yok**)
- **Alanlar:** `key` metin · `ad` metin · `dash` metin · `kademe` sayı (1–4)
- **Zorunlu:** 4/4 alan 27/27 dolu.
- **İlişkiler:** `key` ↔ `DB.permMatrix` anahtarları (27/27 birebir) · `DB.employees[].rol` ve `.roller`.
- **Durumlar:** `dash` = dashboard varyantı {sahip, pm, satis, personel, ik, satinalma, musteri} — **sözlüğü yok**, 6 varyant veriden okunur. `kademe` 1 yönetim · 2 orta · 3 uzman · 4 dış/kısıtlı.
- **Arşiv:** `aktif` anahtarı **yok** — rol pasifleştirilemez.
- **Log:** veride yok. **Yetki:** ayarlar/roller ekranı.

### `DB.permMatrix` · tekil nesne (27 rol anahtarı)
Her rol için: `gor` `ekle` `duzenle` `sil` (kapsam metni) · `onay` `finans` `maas` `log` `disaAktar` (boolean) · `rapor` `personel` (kapsam metni). Anahtar kümesi `DB.roles[].key` ile **birebir** (27/27). Arşiv yok, log yok. Yetki: yetki matrisi ekranı (`sahip` · `genelmudur` · `sistem`).

### `DB.employees` — Personel · n=16 · anahtar `kod` (EMP-NNN)
- **Alanlar:** `kod` · `ad` · `ini` · `rol` · `roller` dizi · `dep` · `depAd` · `pozisyon` · `yonetici` metin/null · `calismaTuru` · `sozlesme` · `girisTarihi` · `tel` · `eposta` · `dogum` · `acilKisi` · `egitim` · `yetkinlik` dizi · `teknoloji` dizi · `sertifika` dizi · `maas` sayı · `izinBakiye` sayı · `doluluk` sayı · `aktif` boolean · `lokasyon` · `kanGrubu` · **`saatlikUcret` sayı (1/16)**
- **Zorunlu:** 26 alan 16/16 dolu. **Opsiyonel:** `yonetici` 1 kayıtta null (EMP-001, kurucu) · `saatlikUcret` anahtarı yalnız EMP-015'te var.
- **İlişkiler:** `dep` → `DB.departments` (tekil 16/16) · `yonetici` → `DB.employees` (tekil 15/15) · `rol` / `roller` → `DB.roles[].key` (16/16 ve 24/24).
- **Durumlar:** `calismaTuru` {Tam zamanlı, Proje bazlı, Yarı zamanlı} — **sözlüğü yok** · `sozlesme` {Belirsiz süreli, Belirli süreli, Hizmet sözleşmesi, Staj sözleşmesi} — **sözlüğü yok**.
- **Arşiv:** `aktif` 16/16 `true` — çıkmış personel veride yok. `arsiv` anahtarı yok.
- **Log:** `DB.logs`'ta 1 kayıt (`LOG-88199`, kayit `EMP-005`, "Maaş bilgisi görüntüledi"). `DB.activities`'te EMP öneki yok.
- **Yetki:** `personel` ekseni (kapsam) · maaş alanları `maas` ekseni · rapor tarafı `personelRapor`.

---

## 4. Satış ve Müşteri — `assets/data/crm.js`

Bu dosyadaki 5 skaler sözlük: `DB.refTypes` (17) · `DB.sectors` (16) · `DB.services` (12) · `DB.lostReasons` (8) · ayrıca nesne dizisi olan `DB.pipelineStages` (15 aşama).

### `DB.pipelineStages` — Satış aşamaları · n=15 · anahtar `key` (**`kod` yok**)
- **Alanlar:** `key` · `sira` sayı · `olasilik` sayı · `maxGun` sayı · `sorumlu` metin · `beklenen` metin · `belge` metin · `onay` boolean · `otoGorev` metin — 9/9 alan 15/15 dolu.
- **İlişkiler:** `DB.leads[].asama` → `key` (12/12 kapsanıyor). `sorumlu` alanı **rol adı metnidir**, `DB.employees` bağı **değildir**.
- **Arşiv / log:** yok. **Yetki:** satış bölümü; ayar ekranı `satismudur` üstü.

### `DB.referrers` — Yönlendiren kişiler · n=8 · anahtar `kod` (REF-NNN)
- **Alanlar:** `kod` · `ad` · `tur` · `firma` · `pozisyon` · `tel` · `eposta` · `sorumlu` · `yonlendirme` sayı · `kazanilan` sayı · `kaybedilen` sayı · `ciro` sayı · `donusum` sayı · `sonYonlendirme` · `komisyonModeli` · `komisyonOrani` sayı · `sabitBedel` sayı · `hakedis` sayı · `odenen` sayı · `bekleyen` sayı · `durum` · `aktif` boolean · `not` — 23/23 alan 8/8 dolu.
- **Opsiyonel:** yok; tel/eposta/pozisyon boş yerine `'—'` sentinel'i taşır (REF-005/006/008).
- **İlişkiler:** `sorumlu` → `DB.employees` (tekil 8/8). Ters yön: `DB.customers[].referans`, `DB.leads[].referans`, `DB.commissions[].referans`.
- **Durumlar:** `durum` {Aktif, Pasif} — **sözlüğü yok** · `tur` ⊂ `DB.refTypes` (8/8) · `komisyonModeli` {Ciro yüzdesi, Sabit bedel, Yok} — **sözlüğü yok**.
- **Arşiv:** `aktif:false` 1 kayıt (REF-008, `durum:'Pasif'`). `arsiv` anahtarı yok.
- **Log:** veride yok.
- **Yetki:** satış bölümü; `hakedis`/`odenen`/`bekleyen` **`finans`** ekseni.
- **Ölçülen türetme:** `hakedis = Σ DB.commissions[referans].tutar` · `odenen = Σ durum 'Ödendi'` · `bekleyen = hakedis − odenen` → **8/8 birebir**. `yonlendirme` · `kazanilan` · `kaybedilen` · `ciro` **ömür boyu sayaçlardır**, CRM'deki bağlı kayıt sayısından küçük olamaz.

### `DB.customers` — Müşteriler · n=12 · anahtar `kod` (MUS-YYYY-NNN)
- **Alanlar:** `kod` · `unvan` · `kisa` · `sektor` · `buyukluk` · `durum` · `risk` · `sorumlu` · `kaynak` · `referans` metin/null · `tel` · `eposta` · `web` · `adres` · `vergiNo` · `vergiDairesi` · `ilkKayit` · `sonIletisim` · `sonrakiAksiyon` · `sonrakiTarih` metin/null · `projeSayisi` sayı · `aktifProje` sayı · `toplamCiro` sayı · `bekleyenTahsilat` sayı · `memnuniyet` sayı/null · `aktif` boolean · `etiketler` dizi · **`arsiv` boolean (1/12)**
- **Zorunlu:** 24 alan 12/12 dolu. **Opsiyonel:** `referans` null 1 (MUS-2023-012) · `sonrakiTarih` null 1 · `memnuniyet` null 1 (MUS-2026-008, henüz anketi yok) · `arsiv` anahtarı yalnız MUS-2023-012'de.
- **İlişkiler:** `sorumlu` → `DB.employees` (tekil 12/12) · `referans` → `DB.referrers` (tekil 11/12). Ters yön: contacts · leads · quotes · contracts · invoices · payments · projects · tickets · supportPackages · surveys · interactions · commissions.
- **Durumlar:** `durum` {Aktif, Pasif, Potansiyel, Riskli} — **sözlüğü yok** · `risk` {Düşük, Orta, Yüksek} — **sözlüğü yok**, `DB.priorities` ile aynı kelimeleri taşır ama **ayrı eksendir** (components.md §5 uyarısı: tone sözlüğüne konulamaz) · `buyukluk` {10-50, 50-100, 100-250, 250-500, 500+} — **sözlüğü yok** · `sektor` ⊂ `DB.sectors` (12/12) · `kaynak` ⊂ `DB.refTypes` (12/12; assumptions V-34).
- **Arşiv:** üç ayrı işaret var — `aktif:false` 2 kayıt (MUS-2025-006, MUS-2023-012) · `arsiv:true` 1 kayıt (MUS-2023-012) · `durum:'Pasif'` 2 kayıt. **Aktiflik ve arşiv aynı şey değildir:** MUS-2025-006 pasif ama arşivli değil.
- **Log:** `DB.activities` 1 kayıt (MUS-2026-010, "Risk seviyesi yükseltildi"). `DB.logs`'ta MUS yok.
- **Yetki:** `gor`/`ekle`/`duzenle` kapsamı + `musteriRapor` (V-13); `toplamCiro` ve `bekleyenTahsilat` **`finans`** ekseni.
- **Ölçülen türetme:** `bekleyenTahsilat` = açık tahsilatların brüt toplamı → **12/12** · `memnuniyet` = yanıtlanmış anketlerin puan ortalaması → **12/12** (arşivli anket dahil) · `toplamCiro` ömür boyu sayaç (bkz. §1a).

### `DB.contacts` — Müşteri yetkilileri · n=14 · anahtar `kod` (YTK-NNN)
- **Alanlar:** `kod` · `musteri` · `ad` · `pozisyon` · `tel` · `eposta` · `birincil` boolean · `karar` boolean · `aktif` boolean — 9/9 alan 14/14 dolu, opsiyonel alan yok.
- **İlişkiler:** `musteri` → `DB.customers` (tekil 14/14). Bir müşteri birden çok yetkili taşır. `DB.interactions[].kontak` ve `DB.surveys[].yanitlayan` bu kişilerin **adını metin olarak** tutar, `kod` bağı **değildir**.
- **Durumlar:** durum alanı yok; `birincil` / `karar` boolean işaretleri var.
- **Arşiv:** `aktif:false` 1 kayıt (YTK-014). `arsiv` anahtarı yok. **Log:** veride yok.
- **Yetki:** müşteri kaydıyla aynı kapsam.

### `DB.leads` — Müşteri adayları · n=12 · anahtar `kod` (LEAD-YYYY-NNN)
- **Alanlar:** `kod` · `firma` · `yetkili` · `tel` · `eposta` · `sektor` · `buyukluk` · `hizmet` · `ozet` · `talepTarihi` · `kaynak` · `referans` metin/null · `yonlendiren` · `sorumlu` · `butce` sayı · `kapanisTahmini` · `oncelik` · `puan` sayı · `sicaklik` · `sonIletisim` · `sonrakiAksiyon` · `sonrakiTarih` metin/null · `asama` · `musteri` metin/null · `kayipNedeni` metin/null · `aktif` boolean · `etiketler` dizi · `notlar`
- **Zorunlu:** 24 alan 12/12. **Opsiyonel:** `referans` null 2 · `sonrakiTarih` null 2 · `musteri` dolu 4/12 (müşteriye dönüşenler) · `kayipNedeni` dolu 1/12.
- **İlişkiler:** `sorumlu` → `DB.employees` (12/12) · `referans` → `DB.referrers` (10/12) · `musteri` → `DB.customers` (4/4). Ters yön: `DB.analyses[].lead`, `DB.quotes[].lead`, `DB.interactions[].lead`. `yonlendiren` yönlendirenin **adıdır**, bağ değildir (bağ `referans`).
- **Durumlar:** `asama` ⊂ `DB.pipelineStages[].key` (12/12) · `oncelik` ⊂ `DB.priorities` (Kritik hiç geçmiyor) · `sicaklik` {Sıcak, Ilık, Soğuk} — **sözlüğü yok** · `kaynak` ⊂ `DB.refTypes` · `kayipNedeni` ⊂ `DB.lostReasons` · `hizmet` ⊂ `DB.services` · `sektor` ⊂ `DB.sectors`.
- **Arşiv:** `aktif` 12/12 `true`; kaybedilen/beklemedeki adaylar da aktif. `arsiv` anahtarı yok — arşiv ekseni bu koleksiyonda **yok**, kapanış `asama` üzerinden okunur.
- **Log:** `DB.activities` 2 kayıt (LEAD-2026-001: aşama değişimi + teklif oluşturma).
- **Yetki:** satış kapsamı (`satistemsilci` `kendi`, `satismudur` `tum`) · `musteriRapor`.

### `DB.analyses` — Ön analizler · n=4 · anahtar `kod` (ANL-YYYY-NNN)
- **Alanlar (38):** `kod` · `lead` · `firma` · `hizmet` · `amac` · `hedefKullanici` · `rolSayisi`/`anaModul`/`altModul` sayı · `web`/`mobil`/`yonetimPaneli`/`musteriPaneli` boolean · `entegrasyon` dizi · `aiOzellik`/`odeme`/`abonelik`/`cokluDil`/`cokluSirket`/`raporlama`/`bildirim` boolean · `guvenlik` · `kvkk` boolean · `sunucu` · `ekip` sayı · `isgucu` sayı · `sure` sayı · `sureBirim` · `riskler`/`belirsiz`/`beklenen`/`kapsamIci`/`kapsamDisi` dizi · `hazirlayan` · `tarih` · `durum` · `maliyet` sayı · `aktif` boolean — **38/38 alan 4/4 dolu, opsiyonel yok.**
- **İlişkiler:** `lead` → `DB.leads` (tekil 4/4) · `hazirlayan` → `DB.employees` (4/4). Ters yön: `DB.quotes[].analiz` (3/8 teklifte dolu).
- **Durumlar:** `durum` {Onay bekliyor, Hazırlanıyor, Onaylandı} — **sözlüğü yok** · `hizmet` ⊂ `DB.services` · `sureBirim` yalnız `'hafta'` (4/4) — **sözlüğü yok**, form tek seçenekli select basar (VB-17).
- **Birim uyarıları:** `isgucu` **saat** ekseninde (420 · 360 · 260 · 190), birim alan adında yazılı değil. `maliyet` **NET, indirim öncesi** satış fiyatıdır (bkz. §1).
- **Arşiv:** `aktif` 4/4 true, `arsiv` anahtarı yok. **Log:** veride yok (yalnız `DB.approvals`'ta ONY-2026-056 ön analiz onayı olarak geçer).
- **Yetki:** `analist` / `pm` `proje` kapsamı; onayı `onay` ekseni.

### `DB.quotes` — Teklifler · n=8 · anahtar `kod` (TKL-YYYY-NNN)
- **Alanlar:** `kod` · `musteri` metin/null · `firma` · `lead` metin/null · `analiz` metin/null · `tarih` · `gecerlilik` · `versiyon` sayı · `hazirlayan` · `araToplam`/`indirim`/`vergiOran`/`vergi`/`toplam` sayı · `doviz` · `durum` · `icOnay` · `musteriOnay` · `kalemSayisi` sayı · `odemePlani` · `teslimSuresi` · `garanti` · `destek` · `aktif` boolean · **`arsiv` boolean (1/8)**
- **Zorunlu:** 21 alan 8/8. **Opsiyonel:** `musteri` dolu 5/8 · `lead` dolu 7/8 · `analiz` dolu 3/8 · `arsiv` anahtarı yalnız TKL-2025-007'de.
- **İlişkiler:** `musteri` → `DB.customers` (5/5) · `lead` → `DB.leads` (7/7) · `analiz` → `DB.analyses` (3/3) · `hazirlayan` → `DB.employees` (8/8). Ters yön: `DB.quoteItems[].teklif` · `DB.contracts[].teklif`.
- **Durumlar:** `durum` {Taslak, Teklif hazırlanıyor, İletildi, Müşteri değerlendirmesinde, Kazanıldı, Kaybedildi} — **sözlüğü yok** ve `DB.pipelineStages` ile **birebir örtüşmez**: `İletildi` ve `Taslak` aşama sözlüğünde yoktur (aşamada karşılıkları `Teklif iletildi` ve `Teklif hazırlanıyor`). Teklif durumu bağımsız bir eksendir · `icOnay` {Onaylandı, Bekliyor} · `musteriOnay` {Bekliyor, Onaylandı, Reddedildi, **`'—'`**} — ikisinin de sözlüğü yok; `musteriOnay` burada `'—'` sentinel'i kullanır (`DB.deliveries[].musteriOnay` kullanmaz — §9).
- **Arşiv:** `aktif` 8/8 true; `arsiv:true` 1 kayıt (TKL-2025-007).
- **Log:** `DB.logs` 1 kayıt (`LOG-88197` "Teklif oluşturdu", kayit TKL-2026-008). `DB.activities` 1 kayıt teklifi **lead üstünde** anar (LEAD-2026-001 → TKL-2026-014).
- **Yetki:** satış kapsamı + tutar alanları **`finans`**; iç onay `onay` ekseni.

### `DB.quoteItems` — Teklif kalemleri · n=6 · **`kod` yok** (bileşik anahtar `teklif` + `sira`)
- **Alanlar:** `teklif` · `sira` sayı · `kalem` · `tur` · `birim` · `miktar` sayı · `birimFiyat` sayı · `tutar` sayı — 8/8 alan 6/6 dolu.
- **İlişkiler:** `teklif` → `DB.quotes` (6/6). **Kapsam:** yalnız `TKL-2026-014` modellenmiş; diğer 7 teklifin kalemi veride yok — `kalemSayisi` alanı gerçek sayıyı taşır (6 = 6 kayıt).
- **Durumlar:** `tur` {Modül, Hizmet} · `birim` {Paket, Gün} — ikisinin de **sözlüğü yok**.
- **Para:** `tutar = miktar × birimFiyat`, **NET** (Σ 428.000 = teklifin `araToplam`'ı).
- **Arşiv / log:** yok. **Yetki:** teklifle aynı + `finans`.

### `DB.interactions` — İletişim geçmişi · n=8 · anahtar `kod` (ILT-NNN)
- **Alanlar:** `kod` · `musteri` metin/null · `lead` metin/null · `tur` · `tarih` (tarih-saat) · `kisi` · `kontak` · `konu` · `ozet` · `sonuc` — 8 alan 8/8; `musteri` dolu 6/8, `lead` dolu 2/8.
- **Kural (ölçüldü):** her kayıtta `musteri` **veya** `lead` doludur, ikisi birden asla dolu değil.
- **İlişkiler:** `musteri` → `DB.customers` (6/6) · `lead` → `DB.leads` (2/2) · `kisi` → `DB.employees` (8/8). `kontak` müşteri yetkilisinin **adıdır**, `DB.contacts` bağı değil.
- **Durumlar:** `tur` {Toplantı, Telefon, E-posta} — **sözlüğü yok**. `sonuc` serbest metindir, 8 kayıtta 8 farklı değer — küme değil.
- **Arşiv:** `aktif` anahtarı **yok**. **Log:** veride yok.
- **Yetki:** müşteri/lead kapsamıyla aynı.

### `DB.commissions` — Komisyon kazançları · n=6 · anahtar `kod` (KOM-YYYY-NNN)
- **Alanlar:** `kod` · `referans` · `kisi` · `musteri` · `firma` · `ciro` sayı · `oran` sayı · `tutar` sayı · `hakedisTarihi` metin/null · `durum` · `odemeTarihi` metin/null · `onay` · `aktif` boolean · **`arsiv` boolean (1/6)**
- **Opsiyonel:** `hakedisTarihi` null 1 · `odemeTarihi` null 3 · `arsiv` yalnız KOM-2025-006'da.
- **İlişkiler:** `referans` → `DB.referrers` (6/6) · `musteri` → `DB.customers` (6/6). `kisi` yönlendirenin adıdır, bağ değil.
- **Durumlar:** `durum` {Bekliyor, Onay bekliyor, Onaylandı, Ödendi} — **sözlüğü yok** · `onay` {Bekliyor, Onaylandı, `'—'`} — **sözlüğü yok**, sentinel kullanır.
- **Ad borcu:** `hakedis*` alan adları hâlâ inşaat terimi taşıyor (VB-04); ekran etiketi "Komisyon kazancı" / "Kazanç tarihi"dir, alan adı değil.
- **Arşiv:** `arsiv:true` 1 kayıt; `aktif` 6/6 true. **Log:** `DB.approvals`'ta ONY-2026-057.
- **Yetki:** **`finans`** ekseni; onayı `onay` ekseni.

---

## 5. Proje ve İş — `assets/data/work.js`

Skaler sözlükler: `DB.taskStatuses` (19) · `DB.taskTypes` (18) · `DB.priorities` (4) · `DB.impacts` (4). Ayrıca `DB.taskTransitions` tekil nesnesi 10 durum için `next` / `yetki` / `zorunlu` / `bildirim` kurallarını tutar (19 durumun 10'u için geçiş tanımlı; `Taslak` · `Atama bekliyor` · `Planlandı` · `Başlanmadı` · `Bilgi bekliyor` · `Müşteri bekleniyor` · `Departman bekleniyor` · `İptal edildi` · `Arşivlendi` için geçiş kaydı **veride yok**).

### `DB.projects` — Projeler · n=8 · anahtar `kod` (PRJ-YYYY-NNN)
- **Alanlar (34):** `kod` · `ad` · `musteri` · `musteriAd` · `pm` · `ekip` dizi · `durum` · `saglik` · `baslangic` · `planlananBitis` · `gercekBitis` metin/null · `ilerleme` sayı · `sozlesmeTutari`/`butce`/`gerceklesenMaliyet`/`tahminiSure`/`harcananSure` sayı · `tur` · `oncelik` · `faz` · `aktif` boolean · `repo` · `canli` · `test` · `tasarim` · `sunucu` · `teknoloji` dizi · `ucuncuTaraf` dizi · `teknikSorumlu` · `musteriSorumlu` · `riskler` dizi · `gecikmeNedeni` metin/null · `sonGuncelleme` · **`arsiv` boolean (1/8)**
- **Zorunlu:** 31 alan 8/8. **Opsiyonel:** `gercekBitis` null 6 (biten 2 proje dolu) · `gecikmeNedeni` null 5 · `arsiv` yalnız PRJ-2025-008'de. Boş dizi kullanan alanlar (`ucuncuTaraf` 1 kayıtta `[]`, `riskler` 2 kayıtta `[]`) null yerine boş dizi taşır.
- **İlişkiler:** `musteri` → `DB.customers` (8/8) · `pm`/`teknikSorumlu`/`musteriSorumlu` → `DB.employees` (8/8 her biri) · `ekip` → `DB.employees` (**dizi**, 23 üyelik, 23/23 çözülüyor). Ters yön: modules · milestones · sprints · tasks · bugs · tests · deliveries · changeRequests · contracts · invoices · tickets · meetings · documents · channels · timelogs. `musteriAd` alanı `customers.unvan`'ın **denormalize kopyasıdır** — bağ `musteri`dir.
- **Durumlar:** `durum` {Planlama, Geliştirme, Test, Teslim} — **sözlüğü yok** · `saglik` {İyi, Dikkat, Riskli} — **sözlüğü yok** · `faz` {Faz 1, Tamamlandı} — **sözlüğü yok** · `oncelik` ⊂ `DB.priorities` · `tur` ⊂ `DB.services`.
- **Arşiv:** `arsiv:true` 1 kayıt (PRJ-2025-008, `durum:'Teslim'`, `aktif:true`) — arşiv işareti `aktif` bayrağından bağımsızdır.
- **Log:** `DB.activities` 1 kayıt (PRJ-2026-006 sağlık değişimi) · `DB.logs` 1 kayıt (`LOG-88198`, aynı olay) — tek olay iki koleksiyonda birden yazılı.
- **Yetki:** `proje` kapsamı; `butce`/`gerceklesenMaliyet`/`sozlesmeTutari` **`finans`** ekseni.

### `DB.projectModules` — Proje modülleri · n=15 · anahtar `kod` (MOD-NNN)
- **Alanlar:** `kod` · `proje` · `ad` · `durum` · `ilerleme` sayı · `sorumlu` · `efor` sayı — 7/7 alan 15/15 dolu, opsiyonel yok.
- **İlişkiler:** `proje` → `DB.projects` (15/15) · `sorumlu` → `DB.employees` (15/15). Ters yön: `tasks.modul` · `bugs.modul` · `tests.moduller` (dizi) · `deliveries.moduller` (dizi).
- **Kapsam:** 8 projenin **5'inde** modül kırılımı var; PRJ-2026-004 / -007 / PRJ-2025-008 modülsüzdür — bu, teslim ve koşumların `moduller: []` taşımasının gerekçesidir (V-30, V-31).
- **Durumlar:** `durum` {Planlama, Geliştirme, Test, Tamamlandı} — **sözlüğü yok**; `projects.durum` ile aynı kelimeleri taşır ama `Teslim` yerine `Tamamlandı` kullanır.
- **Arşiv:** `aktif` anahtarı **yok**. **Log:** veride yok. **Yetki:** proje kapsamı.

### `DB.milestones` — Ödeme planı taksitleri · n=19 · anahtar `kod` (MS-NNN)
- **Alanlar:** `kod` · `proje` · `sozlesme` · `taksit` sayı · `ad` · `tarih` · `durum` · `odeme` sayı · `odemeDurum` · `ilerleme` sayı — 10/10 alan 19/19 dolu.
- **İlişkiler:** `proje` → `DB.projects` (19/19) · `sozlesme` → `DB.contracts` (19/19). Ters yön: `DB.invoices[].milestone` (15 fatura) · `DB.deliveries[].milestone` (5 teslim). Bir milestone'a **en fazla bir** fatura ve **en fazla bir** teslim bağlanır.
- **Durumlar:** `durum` {Planlandı, Yaklaşıyor, Tamamlandı, Gecikti} — **sözlüğü yok** · `odemeDurum` {Bekliyor, Ödendi} — **sözlüğü yok**.
- **Bütünlük (ölçüldü):** 6 sözleşmenin taksit seti tam; `Σ odeme = contract.tutar` 6/6; `taksit` numaraları 1..N boşluksuz. Kuruş artığı son taksite yazılır (SZL-2025-018: 5 × 153.333 + 153.335 = 920.000).
- **Arşiv:** `aktif` anahtarı **yok**. **Log:** veride yok.
- **Yetki:** **`finans`** ekseni + proje kapsamı.

### `DB.sprints` — Sprintler · n=6 · anahtar `kod` (SPR-YYYY-NNN)
- **Alanlar:** `kod` · `proje` · `ad` · `baslangic` · `bitis` · `durum` · `planlanan` sayı · `tamamlanan` sayı · `gorevSayisi` sayı — 9/9 alan 6/6 dolu.
- **Birim:** `planlanan` / `tamamlanan` **saat**.
- **İlişkiler:** `proje` → `DB.projects` (6/6). Ters yön: `tasks.sprint` (12 görev) · `bugs.sprint` (6 hata) · `tests.sprint` (3 koşum).
- **Durumlar:** `durum` {Planlandı, Devam ediyor, Tamamlandı} — **sözlüğü yok**.
- **Sayaç istisnası (V-27):** `gorevSayisi` sprintin **gerçek** görev sayısıdır (Σ 60); `DB.tasks` yalnız 25 temsili görev tutar (sprintlisi 12). Kural: `gorevSayisi ≥ bağlı kayıt sayısı`.
- **Arşiv:** `aktif` anahtarı **yok**. **Log:** veride yok. **Yetki:** proje kapsamı.

### `DB.tasks` — Görevler · n=25 · anahtar `kod` (GRV-YYYY-NNN)
- **Alanlar (41):** `kod` · `baslik` · `tur` · `proje` metin/null · `modul` metin/null · `sprint` metin/null · `musteri` metin/null · `dep` · `olusturan` · `veren` · `sorumlu` · `yardimci` dizi · `izleyiciler` dizi · `kontrolEden` · `onaylayan` · `oncelik` · `etki` · `aciliyet` · `destek` (**25/25 null**) · `durum` · `baslangic` metin/null · `termin` · `tamamlanma` metin/null · `tahminiSure`/`gercekSure`/`faturalanabilir`/`ilerleme`/`revizyon`/`yenidenAcilma` sayı · `aciklama` · `amac` · `kabulKriteri` · `beklenenCikti` · `etiketler` dizi · `aktif` boolean · **koşullu alanlar:** `engelNedeni` (1/25) · `revizeNot` (1/25) · `gecikmeNedeni` (1/25) · `tekrar` (1/25) · `teslimEdilenCikti` (4/25) · `arsiv` (1/25)
- **Zorunlu:** 30 alan 25/25 dolu. **Opsiyonel:** `proje` 15/25 · `modul` 11/25 · `sprint` 12/25 · `musteri` 17/25 · `baslangic` null 4 · `tamamlanma` dolu 4/25 · `destek` **hiç yazılı değil**.
- **Koşullu alanlar durum bağımlıdır:** `engelNedeni` yalnız `Engellendi` görevde, `revizeNot` yalnız `Revize bekliyor` görevde, `teslimEdilenCikti` yalnız çıktısı teslim edilmiş görevde, `tekrar` yalnız `Tekrarlayan görev` türünde. Bu, `DB.taskTransitions[].zorunlu` listesiyle uyumlu.
- **İlişkiler:** `dep` → `DB.departments` (25/25) · `olusturan`/`veren`/`sorumlu`/`kontrolEden`/`onaylayan` → `DB.employees` (25/25 her biri) · `yardimci` (dizi, 6 üyelik) ve `izleyiciler` (dizi, 21 üyelik) → `DB.employees` · `proje`/`modul`/`sprint`/`musteri` → ilgili koleksiyon (dolu olanların hepsi çözülüyor) · **`destek` → `DB.tickets`** (§9d bağı, veride 0/25 yazılı). Ters yön: `subtasks.ustGorev` · `taskDeps.gorev`/`.bagimli` · `bugs.gorev` · `decisions.gorev` · `messages.gorev` · `timelogs.gorev`. **`DB.tasks[].hata` diye bir ayna alan YOKTUR** ve doğmaması `canon.js` eksen 15'te taranır (V-29).
- **Durumlar:** `durum` ⊂ `DB.taskStatuses` — 19 değerin **11'i** veride geçiyor {Havuzda, Atandı, Kabul bekliyor, Planlandı, Devam ediyor, Engellendi, Kontrol bekliyor, Revize bekliyor, Onay bekliyor, Tamamlandı, Arşivlendi}; geçmeyen 8: Taslak, Atama bekliyor, Başlanmadı, Bilgi bekliyor, Müşteri bekleniyor, Departman bekleniyor, Revizede, İptal edildi · `tur` ⊂ `DB.taskTypes` — 18 türün **14'ü** geçiyor · `oncelik` ve `aciliyet` ⊂ `DB.priorities` · `etki` ⊂ `DB.impacts`.
- **Etki eşlemesi:** hatadan doğan görevin `etki`si hatanın `siddet`inden gelir — şiddet `Kritik` → etki `Çok yüksek`, diğer üçü birebir (§9).
- **Arşiv:** `arsiv:true` 1 kayıt (GRV-2026-124, `durum:'Arşivlendi'`, `aktif:true`). Yani arşiv hem bayrak hem durum değeri olarak temsil edilir.
- **Log:** `DB.activities` 4 kayıt — **hepsi GRV-2026-101 üstünde** (ilerleme, yeniden açılma, atama, oluşturma). `DB.logs` 1 kayıt (`LOG-88200`, aynı görev). 25 görevin 24'ünde log yok.
- **Yetki:** `gor`/`duzenle` kapsamı (`kendi` / `proje` / `departman` / `tum`); durum geçişleri `DB.taskTransitions[].yetki` listesine tabi (`sorumlu` · `pm` · `kontrolEden` · `onaylayan` gibi **rol değil ilişki** anahtarları da içerir); görev onayı `onay` ekseni.

### `DB.subtasks` — Alt görevler · n=9 · anahtar `kod` (ALT-NNN)
`kod` · `ustGorev` · `baslik` · `tamam` boolean · `sorumlu` — 5/5 alan 9/9 dolu. İlişki: `ustGorev` → `DB.tasks` (9/9, yalnız 3 göreve dağılmış) · `sorumlu` → `DB.employees` (9/9). Durum alanı yok (`tamam` boolean). Arşiv yok, log yok. Yetki: üst görevle aynı.

### `DB.taskDeps` — Görev bağımlılıkları · n=3 · **`kod` yok**
`gorev` · `bagimli` metin/null · `tur` — `bagimli` dolu 2/3. İlişki: iki alan da → `DB.tasks`. `tur` {Engelliyor, Bekliyor, `'—'`} — **sözlüğü yok**, sentinel kullanır ve `bagimli:null` olan kayıt `tur:'—'` taşır (bağımlılığı olmayan görevin kaydı). Arşiv yok, log yok. Yetki: görevle aynı.

### `DB.deptRequests` — Departmanlar arası iş talepleri · n=6 · anahtar `kod` (TLP-YYYY-NNN)
- **Alanlar:** `kod` · `talepEdenDep` · `talepEdilenDep` · `talepEden` · `sorumlu` · `tur` · `musteri` metin/null · `proje` metin/null · `baslik` · `aciklama` · `oncelik` · `termin` · `beklenenCikti` · `kabulKriteri` · `durum` · `onay` · `olusturma` · `tamamlanma` metin/null · `aktif` boolean — 16 alan 6/6; `musteri` 4/6, `proje` 3/6, `tamamlanma` 1/6.
- **İlişkiler:** iki departman alanı → `DB.departments` (6/6 her biri) · `talepEden`/`sorumlu` → `DB.employees` (6/6) · `musteri`/`proje` → ilgili koleksiyon. Göreve dönüşüm bağı **veride yok**: TLP-2026-043 ile GRV-2026-114 aynı işi anlatır ama yazılı bağ **yoktur** (§9d: metin benzerliği bağ değildir).
- **Durumlar:** `durum` {Bekliyor, Devam ediyor, Tamamlandı} · `onay` {Bekliyor, Onaylandı} · `tur` {Ön analiz talebi, Ekran tasarım talebi, Test talebi, Hata çözüm talebi, Ekipman talebi, Eksik bilgi talebi} — **üçünün de sözlüğü yok** · `oncelik` ⊂ `DB.priorities`.
- **Arşiv:** `aktif` 6/6 true, `arsiv` yok. **Log:** veride yok (yalnız BLD-9012 bildirimi).
- **Yetki:** `departman` kapsamı; onayı `onay` ekseni.

### `DB.bugs` — Hatalar · n=6 · anahtar `kod` (HTA-YYYY-NNN)
- **Alanlar:** `kod` · `proje` · `baslik` · `modul` · `siddet` · `oncelik` · `durum` · `bulan` · `sorumlu` · `bulunma` · `cozum` metin/null · `ortam` · `tekrarlanabilir` · `gorev` metin/null · `test` metin/null · `sprint` · `destek` metin/null · `aktif` boolean — 14 alan 6/6; `cozum` dolu 1/6 · `gorev` 1/6 · `test` 3/6 · `destek` 2/6.
- **İlişkiler (dördü de tekil, §9d):** `gorev` → `DB.tasks` — **hata↔görev bağının tek yönü** · `test` → `DB.tests` (bir hata en fazla bir koşuma) · `destek` → `DB.tickets` (DST-2026-118 → HTA-2026-074 · DST-2026-122 → HTA-2026-075) · `sprint` → `DB.sprints`, hatanın **ele alındığı** sprint (açıldığı değil — V-32). Ayrıca `proje` → projects, `modul` → projectModules, `bulan`/`sorumlu` → employees (6/6).
- **Durumlar:** `durum` {Açık, Devam ediyor, Kapandı} — **sözlüğü yok** · `siddet` **⊂ `DB.priorities`** (`DB.impacts` değil — §9) · `oncelik` ⊂ `DB.priorities` · `tekrarlanabilir` {Her zaman, Bazen} — **sözlüğü yok** · `ortam` 5 kayıtta 5 farklı serbest metin.
- **Arşiv:** `aktif` 6/6 true, `arsiv` yok. **Log:** veride yok (GRV-2026-101 aktivitesinde hatanın kodu **metin içinde** anılır, bağ olarak değil).
- **Yetki:** proje kapsamı.

### `DB.tests` — Test koşumları · n=5 · anahtar `kod` (TST-YYYY-NNN)
- **Alanlar:** `kod` · `proje` · `ad` · `tur` · `senaryo`/`basarili`/`basarisiz` sayı · `sorumlu` · `tarih` · `durum` · `moduller` **dizi** · `sprint` metin/null · `aktif` boolean — 12 alan 5/5; `sprint` dolu 3/5.
- **İlişkiler:** `proje` → projects (5/5) · `sorumlu` → employees (5/5) · `moduller` → `DB.projectModules` (**dizi**, 9 üyelik, 9/9 çözülüyor; 1 kayıtta boş dizi değil — 5 koşumun 5'i de dolu) · `sprint` → sprints (3/3; 2 koşumun tarihi hiçbir sprint aralığına düşmüyor, **en yakına yuvarlanmaz**).
- **Sayım ekseni:** `basarili + basarisiz = senaryo` — **5/5 kayıtta, durumdan bağımsız**. `Planlandı` koşumda üçü de 0. Bağlı hata sayısı ≤ `basarisiz` (eşit olmak zorunda değil).
- **Durumlar:** `durum` {Planlandı, Devam ediyor, Tamamlandı} · `tur` {Regresyon, Fonksiyonel, Performans, Duman, Kabul} — **ikisinin de sözlüğü yok**.
- **Arşiv:** yok. **Log:** veride yok. **Yetki:** proje kapsamı (`qa` rolü `proje`).

### `DB.deliveries` — Teslimler · n=5 · anahtar `kod` (TSL-YYYY-NNN)
- **Alanlar:** `kod` · `proje` · `milestone` · `ad` · `tarih` · `durum` · `teslimEden` · `musteriOnay` · `onayTarihi` metin/null · `not` · `moduller` **dizi** · `test` metin/null · `aktif` boolean — 11 alan 5/5; `onayTarihi` dolu 3/5 · `test` dolu 1/5 · `moduller` boş dizi 1/5.
- **İlişkiler:** `milestone` → `DB.milestones` (5/5, **veride yazılı tekil bağ**, tarih yakınlığından türetilmez) · `test` → `DB.tests` (kabul koşumu) · `moduller` → projectModules (dizi, 9 üyelik). `TSL-2026-032`'nin `moduller`ı boştur çünkü PRJ-2026-004'ün modül kırılımı yok.
- **Durumlar:** `durum` {Planlandı, Onaylandı, Gecikti} — **sözlüğü yok** · `musteriOnay` {Onaylandı, Bekliyor} (+ sözleşmede `Revizyon istendi` tanımlı, veride geçmiyor) — **sözlüğü yok**; burada `'—'` sentinel'i **kullanılmaz** (§9).
- **Arşiv:** yok. **Log:** veride yok. **Yetki:** proje kapsamı.

### `DB.changeRequests` — Değişiklik talepleri · n=4 · anahtar `kod` (DGS-YYYY-NNN)
- **Alanlar:** `kod` · `proje` · `baslik` · `talep` · `tarih` · `etkiSure` sayı · `etkiMaliyet` sayı · `durum` · `kapsamIci` boolean · `karar` · `sorumlu` · `destek` (**4/4 null**) · `aktif` boolean — 12 alan 4/4 dolu.
- **Ad çakışması uyarısı:** `talep` bu koleksiyonda **talebi açan taraftır** ({Müşteri} — 4/4; sözleşmede `'İç ekip'` de tanımlı ama veride geçmiyor), destek talebi kodu **değildir**. Destek bağı `destek` alanıdır (V-28) ve hiçbir kayıtta yazılı değil.
- **Birim/eksen:** `etkiSure` **saat**tir, gün değil. `etkiMaliyet` **NET**. **`etki` diye bir alan yoktur** — etki düzeyi süre/bedel sapmasından hesaplanır.
- **İlişkiler:** `proje` → projects (4/4) · `sorumlu` → employees (4/4) · `destek` → tickets (0/4).
- **Durumlar:** `durum` {Değerlendiriliyor, Onay bekliyor, Onaylandı, Reddedildi} — **sözlüğü yok**.
- **Arşiv:** yok. **Log:** `DB.approvals` ONY-2026-055 (DGS-2026-012). **Yetki:** proje kapsamı + `etkiMaliyet` **`finans`**; onayı `onay` ekseni.

### `DB.approvals` — Onay kuyruğu · n=12 · anahtar `kod` (ONY-YYYY-NNN)
- **Alanlar:** `kod` · `tur` · `kayit` · `baslik` · `talepEden` · `onaylayan` · `tutar` sayı/null · `tarih` · `durum` · `aciliyet` · `link` — 10 alan 12/12; `tutar` null 6/12 (parasal olmayan onaylar).
- **İlişki — çok biçimli (polimorfik):** `kayit` alanı `tur`a göre farklı koleksiyona bağlanır ve **12/12 çözülüyor**: purchases (3) · leaves (3) · quotes (1) · tasks (1) · changeRequests (1) · analyses (1) · commissions (1) · timesheets (1). `talepEden`/`onaylayan` → employees (12/12). `link` alanı hedef ekran URL'sini metin olarak taşır.
- **Durumlar:** `durum` {Bekliyor, Onaylandı} — **sözlüğü yok** (reddedilen onay veride yok) · `tur` 8 değer — **sözlüğü yok** · `aciliyet` ⊂ `DB.priorities`.
- **Arşiv:** `aktif` anahtarı **yok**. **Log:** veride yok. **Yetki:** **`onay`** ekseni; tutar alanı `finans`.

### `DB.activities` — Aktivite kayıtları · n=8 · **`kod` yok**
- **Alanlar:** `kayit` · `tarih` (tarih-saat) · `kisi` · `metin` · `eski` metin/null · `yeni` metin/null · `tone` · `icon` — 6 alan 8/8; `eski`/`yeni` null 1 kayıtta (oluşturma olayı).
- **`kisi` alanı personelin ADIDIR**, `EMP-*` kodu değil — `DB.logs[].kisi` ile **farklı eksende**.
- **Kapsam ölçümü:** 8 kaydın önekleri **GRV 4 · LEAD 2 · PRJ 1 · MUS 1**; toplam **4 farklı kayıt** (GRV-2026-101, LEAD-2026-001, PRJ-2026-006, MUS-2026-010). 65 koleksiyonun **4'ü** temsil ediliyor.
- **`tone`:** {accent, danger, info, neutral, ok} — **sözlüğü yok**, `GV.badge` ton sınıflarıyla aynı adları taşır. `icon` sprite anahtarıdır (`i-activity`, `i-refresh`, `i-user-check`, `i-plus`, `i-funnel`, `i-quote`, `i-alert`).
- **Arşiv:** yok. **Yetki:** kaydın kendi kapsamı (`log` ekseni **değil** — `log` `DB.logs` içindir).

---

## 6. İK ve Zaman — `assets/data/hr.js`

Skaler sözlük: `DB.leaveTypes` (6).

### `DB.leaves` — İzin talepleri · n=7 · anahtar `kod` (IZN-YYYY-NNN)
- **Alanlar:** `kod` · `personel` · `tur` · `baslangic` · `bitis` · `gun` sayı · `vekil` metin/null · `gerekce` · `durum` · `onaylayan` · `talepTarihi` · `onayTarihi` metin/null · `cakisma` boolean · `aktif` boolean · **`ret` metin (1/7)**
- **Opsiyonel:** `vekil` null 2 · `onayTarihi` null 2 (onay bekleyenler) · `ret` anahtarı yalnız reddedilen kayıtta (IZN-2026-033).
- **İlişkiler:** `personel`/`vekil`/`onaylayan` → `DB.employees` (7/7 · 5/5 · 7/7).
- **`cakisma` ekseni:** personel çakışmasını **değil**, proje takvimi çakışmasını işaretler. Departman içi personel çakışması `baslangic`/`bitis` kesişiminden **hesaplanır**, bu alandan okunmaz.
- **Durumlar:** `durum` {Onay bekliyor, Onaylandı, Reddedildi} — **sözlüğü yok** · `tur` ⊂ `DB.leaveTypes` (6 türün 4'ü geçiyor; Ücretsiz izin ve Saatlik izin veride yok).
- **Arşiv:** `aktif` 7/7 true, `arsiv` yok. **Log:** `DB.logs` 1 kayıt (`LOG-88196`, IZN-2026-038) · `DB.approvals` 3 kayıt.
- **Yetki:** `personel` ekseni + `onay`; kendi izni her rolde görünür (V-22 profil istisnası).

### `DB.timelogs` — Zaman kayıtları · n=45 · anahtar `kod` (ZMN-NNNN)
- **Alanlar:** `kod` · `personel` · `tarih` · `gorev` metin/null · `proje` metin/null · `musteri` metin/null · `sure` sayı (saat, 0,5 adımlı) · `faturalanabilir` boolean · `aciklama` · `onay` · `aktif` boolean — 8 alan 45/45; `gorev` 39/45 · `proje` 36/45 · `musteri` 38/45.
- **Kural (ölçüldü):** `faturalanabilir:false` olan 9 kaydın 9'unda `gorev`/`proje`/`musteri` üçlüsünün en az biri null (iç işler); faturalanabilir kayıtlarda üçü de dolu.
- **İlişkiler:** `personel` → employees (45/45) · `gorev` → tasks (39/39) · `proje` → projects (36/36) · `musteri` → customers (38/38).
- **Durumlar:** `onay` {Bekliyor, Onaylandı} — **sözlüğü yok**.
- **Arşiv:** `aktif` 45/45 true, `arsiv` yok. **Log:** veride yok.
- **Yetki:** `kendi` (personel) / `departman` / `proje`; onayı `onay` ekseni.

### `DB.timesheets` — Haftalık timesheet · n=6 · anahtar `kod` (TSH-YYYY-NNN)
- **Alanlar:** `kod` · `personel` · `hafta` (ISO `2026-W31`) · `baslangic` · `bitis` · `toplam` sayı · `faturalanabilir` sayı · `eksik` sayı · `fazla` sayı · `durum` · `onaylayan` · `aktif` boolean — 12/12 alan 6/6 dolu.
- **İlişkiler:** `personel`/`onaylayan` → employees (6/6). `DB.timelogs` ile bağ **kod üzerinden değil**, `personel` + tarih aralığı kesişiminden kurulur.
- **Ölçülen türetme:** `toplam` = o personelin o haftaki timelog `sure` toplamı → **6/6 birebir**; `faturalanabilir` = faturalanabilir kayıtların toplamı → **6/6 birebir**.
- **Durumlar:** `durum` {Onay bekliyor, Onaylandı} — **sözlüğü yok**.
- **Arşiv:** yok. **Log:** `DB.approvals` ONY-2026-058. **Yetki:** `personel` ekseni + `onay`.

### `DB.performance` — Performans değerlendirmeleri · n=5 · anahtar `kod` (PRF-YYYY-QN-NNN)
- **Alanlar:** `kod` · `personel` · `donem` · `durum` · 12 ölçüm alanı (`ozDegerlendirme`, `yoneticiDegerlendirme`, `pmDegerlendirme`, `zamanindaTeslim`, `revizyonOrani`, `gorevSayisi`, `kaliteSonucu`, `problemCozme`, `teknikGelisim`, `ekipCalismasi`, `iletisim`, `musteriGeriBildirim`) sayı/null · `egitimIhtiyaci` dizi · `gelisimPlani` · `aktif` boolean.
- **Opsiyonel:** 12 ölçüm alanının hepsi `durum:'Açık'` kayıtta (PRF-2026-Q3-005) **null**; `Tamamlandı` 4 kayıtta dolu. Yani nullability **durum bağımlıdır**.
- **İlişkiler:** `personel` → employees (5/5).
- **Durumlar:** `durum` {Açık, Tamamlandı} — **sözlüğü yok**. `donem` {2026-Q2, 2026-Q3} biçim sözleşmesi, sözlüğü yok. **Otomatik karar üretilmez** — karar desteği verisidir.
- **Arşiv:** yok. **Log:** veride yok. **Yetki:** `personel` ekseni + `personelRapor`; `maas` ekseni **değildir**.

### `DB.trainings` — Eğitim ve yetkinlik · n=4 · anahtar `kod` (EGT-YYYY-NNN)
`kod` · `ad` · `tur` · `saglayici` · `katilimci` **dizi** · `baslangic` · `bitis` · `sure` sayı (saat) · `maliyet` sayı · `durum` · `sertifika` boolean · `aktif` boolean — 12/12 alan 4/4 dolu. İlişki: `katilimci` → `DB.employees` (dizi, 7 üyelik, 7/7). Durumlar: `durum` {Planlandı, Tamamlandı} · `tur` {Online kurs, Atölye, Seminer} — **sözlükleri yok**. `maliyet` eksen etiketi veride **yazılı değil** (net/brüt ayrımı §9b'de bu alan için tanımsız). Arşiv yok, log yok. Yetki: `personel` ekseni; `maliyet` `finans`.

### `DB.capacity` — Haftalık kapasite · n=10 · **`kod` yok** (anahtar `personel`)
`personel` · `kapasite` sayı · `planlanan` sayı · `doluluk` sayı (%) · `izin` sayı — 5/5 alan 10/10. İlişki: `personel` → `DB.employees` (10/10; 16 personelin 10'u kapsanıyor — EMP-001/002/011/012/013/014 kapasite kaydı **yok**). **Birim uyarısı:** `kapasite` / `planlanan` **saat**, ama `izin` **GÜN**dür. Ölçüldü: `izin` = o personelin `DB.today`'den sonra biten, reddedilmemiş izinlerinin `gun` toplamı (10/10). Saat alanlarıyla toplanmaz. Durum alanı yok, arşiv yok, log yok. Yetki: `personel` ekseni.

---

## 7. Finans, İletişim ve Sistem — `assets/data/misc.js`

Skaler sözlük: `DB.notificationChannels` (7).

### `DB.contracts` — Sözleşmeler · n=7 · anahtar `kod` (SZL-YYYY-NNN)
- **Alanlar:** `kod` · `musteri` · `musteriAd` · `teklif` metin/null · `proje` metin/null · `ad` · `tutar`/`kdvOran`/`kdv`/`toplam` sayı · `doviz` · `imzaTarihi` · `baslangic` · `bitis` · `durum` · `odemePlani` · `garanti` · `yenileme` boolean · `aktif` boolean · **`yenilemeTarihi` metin (2/7)**
- **Opsiyonel:** `teklif` dolu 3/7 · `proje` dolu 6/7 (SZL-2026-022 bakım sözleşmesi projesiz) · `yenilemeTarihi` anahtarı yalnız `yenileme:true` olan 2 kayıtta — **koşullu alan**.
- **İlişkiler:** `musteri` → customers (7/7) · `teklif` → quotes (3/3) · `proje` → projects (6/6). Ters yön: `milestones.sozlesme` (19) · `invoices.sozlesme` (16) · `supportPackages.sozlesme` (1).
- **Durumlar:** `durum` {Aktif, Tamamlandı, Gecikti} — **sözlüğü yok** · `doviz` yalnız `'TRY'` (7/7).
- **Para:** `tutar` **NET**, `toplam` **BRÜT**; `kdvOran` 7/7 kayıtta 20.
- **Arşiv:** `aktif` 7/7 true, `arsiv` anahtarı **yok** — sözleşmede arşiv ekseni yok, kapanış `durum`dan okunur.
- **Log:** veride yok. **Yetki:** **`finans`** ekseni; müşteri kapsamı.

### `DB.invoices` — Faturalar · n=17 · anahtar `kod` (FTR-YYYY-NNN)
- **Alanlar:** `kod` · `musteri` · `musteriAd` · `sozlesme` metin/null · `proje` metin/null · `milestone` metin/null · `tarih` · `vade` · `tutar`/`vergi`/`toplam` sayı · `durum` · `odemeTarihi` metin/null · `aktif` boolean — 11 alan 17/17; `sozlesme` 16/17 · `proje` 15/17 · `milestone` 15/17 · `odemeTarihi` dolu 11/17.
- **Bağsız fatura:** `FTR-2026-018` (Anadolu Perakende, 237.500 net) üçünü de null taşır — sözleşmesiz/projesiz tek fatura. `FTR-2026-031` sözleşmeliyken taksitsizdir (aylık bakım).
- **İlişkiler:** `musteri` → customers (17/17) · `sozlesme` → contracts (16/16) · `proje` → projects (15/15) · `milestone` → milestones (15/15). Ters yön: `payments.fatura` (17/17).
- **Durumlar:** `durum` {Ödendi, Ödenmedi, Gecikti} — **sözlüğü yok**.
- **Para:** `tutar` net = milestone `odeme` · `toplam = tutar + vergi` brüt (17/17).
- **Arşiv:** `aktif` 17/17 true, `arsiv` yok. **Log:** veride yok.
- **Yetki:** **`finans`** ekseni.

### `DB.payments` — Tahsilatlar · n=17 · anahtar `kod` (THS-YYYY-NNN)
- **Alanlar:** `kod` · `fatura` · `musteri` · `musteriAd` · `tutar` sayı · `vade` · `gecikmeGun` sayı · `durum` · `sorumlu` · `sonAksiyon` · `sonAksiyonTarihi` · `aktif` boolean — 12/12 alan 17/17 dolu, opsiyonel yok.
- **İlişkiler:** `fatura` → invoices (17/17, **birebir** — her faturanın tam bir tahsilat kaydı var) · `musteri` → customers (17/17) · `sorumlu` → employees (17/17, hepsi EMP-012).
- **Durumlar:** `durum` {Bekliyor, Ödendi, Gecikti} — **sözlüğü yok**; fatura durumundan (`Ödenmedi`) **farklı kelime** kullanır, iki koleksiyon aynı sözlüğü paylaşmaz.
- **Para:** `tutar` = faturanın **brüt** `toplam`ı (17/17). `vade` = faturanın vadesi.
- **Arşiv:** yok. **Log:** veride yok. **Yetki:** **`finans`** ekseni.

### `DB.meetings` — Toplantılar · n=9 · anahtar `kod` (TOP-YYYY-NNN)
- **Alanlar:** `kod` · `ad` · `tur` · `musteri` metin/null · `proje` metin/null · `tarih` (tarih-saat) · `sure` sayı (dakika) · `yer` · `katilimci` dizi · `disKatilimci` dizi · `gundem` dizi · `durum` · `aktif` boolean · **`notlar` metin (5/9)**
- **Koşullu alan:** `notlar` anahtarı yalnız `durum:'Tamamlandı'` olan 5 kayıtta var — planlanan toplantıda anahtar **hiç yok**.
- **İlişkiler:** `katilimci` → employees (dizi, 38 üyelik, 38/38) · `musteri` → customers (5/5) · `proje` → projects (5/5). `disKatilimci` **serbest ad dizisidir**, `DB.contacts` bağı değildir. Ters yön: `decisions.toplanti` (12/12).
- **Durumlar:** `durum` {Planlandı, Tamamlandı} · `tur` {Müşteri toplantısı, Satış görüşmesi, Departman toplantısı, Proje toplantısı} — **ikisinin de sözlüğü yok**.
- **Arşiv:** yok. **Log:** veride yok. **Yetki:** katılımcı/proje kapsamı.

### `DB.decisions` — Toplantı kararları · n=12 · anahtar `kod` (KRR-YYYY-NNN)
`kod` · `toplanti` · `karar` · `sorumlu` · `termin` · `durum` · `gorev` metin/null · `aktif` boolean. İlişki: `toplanti` → meetings (12/12 — **yalnız `durum:'Tamamlandı'` toplantılara bağlı**, §9) · `sorumlu` → employees (12/12) · `gorev` → tasks (3/12 dolu, 3/3 çözülüyor). Durum: {Bekliyor, Devam ediyor, Tamamlandı, Gecikti} — **sözlüğü yok**. `gorev` bağı görev kaynağının türetilmesinde kullanılır (V-15: "toplantıdan oluşan görev"). Arşiv yok, log yok. Yetki: toplantı kapsamı.

### `DB.documents` — Dokümanlar · n=11 · anahtar `kod` (DOK-YYYY-NNN)
- **Alanlar:** `kod` · `ad` · `tur` · `klasor` · `musteri` metin/null · `proje` metin/null · `boyut` metin (`'2,4 MB'`) · `format` · `versiyon` sayı · `yukleyen` · `tarih` · `sonKullanma` metin/null · `kalanGun` sayı/null · `gizlilik` · `onay` · `aktif` boolean.
- **Opsiyonel:** `musteri` 5/11 · `proje` 3/11 · `sonKullanma`/`kalanGun` dolu 6/11 — ikisi **birlikte** null ya da birlikte dolu (11/11 tutarlı). `kalanGun` negatif olabilir (DOK-2025-210: −215, DOK-2026-211: −14 → süresi dolmuş belge).
- **İlişkiler:** `musteri` → customers (5/5) · `proje` → projects (3/3) · `yukleyen` → employees (11/11). Sözleşme/teklif/poliçe kaydına bağ **yoktur** — belge ile kaynak kayıt arasındaki ilişki yalnız `ad` metninde geçer, bu **bağ değildir** (§9d).
- **Durumlar:** `tur` 10 değer · `gizlilik` {Gizli, İç kullanım, Kişisel veri} · `onay` {Bekliyor, Onaylandı} — **üçünün de sözlüğü yok**. `format` 11/11 `'PDF'`.
- **Arşiv:** `aktif` 11/11 true, `arsiv` yok. **Log:** veride yok.
- **Yetki:** `gizlilik` alanı erişimi belirler; `Kişisel veri` → `personel` ekseni, `Gizli` → `sahip`/`genelmudur`/`finans`.

### `DB.channels` — Sohbet kanalları · n=7 · anahtar `kod` (KNL-NNN)
`kod` · `ad` · `tur` · `uyeler` sayı · `okunmamis` sayı · `sonMesaj` (tarih-saat) · `sonMesajKisi` · `sonMesajOzet` · `sessiz` boolean · `aktif` boolean · **`proje` (2/7)** · **`dep` (2/7)**. Koşullu alan: `proje` anahtarı yalnız `tur:'Proje kanalı'` kayıtlarda, `dep` yalnız `tur:'Departman içi kanal'` kayıtlarda. `sonMesajKisi` → employees (7/7). Durum: `tur` 5 değer — **sözlüğü yok**. Arşiv yok, log yok. Yetki: kanal üyeliği (veride üyelik listesi **yok**, yalnız `uyeler` sayısı var — üye kimlikleri **veride yok**).

### `DB.messages` — Mesajlar · n=6 · anahtar `kod` (MSG-NNNN)
`kanal` · `kod` · `kisi` · `tarih` · `metin` · `tepki` dizi · **`gorev` (1/6)**. İlişki: `kanal` → channels (6/6) · `kisi` → employees (6/6) · `gorev` → tasks (1/1) — sohbetten doğan görevin bağı (V-15). Durum alanı yok. Arşiv yok, log yok. Yetki: kanal erişimiyle aynı.

### `DB.notifications` — Bildirimler · n=12 · anahtar `kod` (BLD-NNNN)
`kod` · `tur` · `baslik` · `ozet` · `tarih` · `kisi` · `okundu` boolean · `tone` · `link` — 9/9 alan 12/12 dolu. `kisi` → employees (12/12) = bildirimin **alıcısı**. Kaynak kayda bağ alanı **yoktur**; hedef yalnız `link` metnindeki URL sorgu parametresinde (`?id=GRV-2026-101`) geçer — kod alanı olarak yazılı değil. Durum: `tur` 12 değer (PROMPT §21'in 31 tipinin 12'si) · `tone` {danger, warn, info, ok} — **ikisinin de sözlüğü yok**. Arşiv yok. Yetki: alıcı kendi bildirimini görür.

### `DB.announcements` — Duyurular · n=3 · anahtar `kod` (DUY-YYYY-NNN)
`kod` · `baslik` · `ozet` · `icerik` · `yazan` · `tarih` · `oncelik` · **`dep` (3/3 null)** · `aktif` boolean. `yazan` → employees (3/3). `dep` → `DB.departments` bağı **açık ama hiç yazılı değil** — üç duyuru da şirket geneli. `oncelik` ⊂ `DB.priorities` (Orta, Yüksek geçiyor). Arşiv yok. **Log:** `DB.logs` `LOG-88201` (DUY-2026-014). Yetki: yayınlama `sahip`/`ik`.

### `DB.automations` — Otomasyon kuralları · n=22 · anahtar `kod` (OTO-NNN)
`kod` · `ad` · `tetikleyici` · `islem` · `kullanici` · `kanal` **dizi** · `fayda` · `durum` · `aktif` boolean — 9/9 alan 22/22 dolu. `kanal` ⊂ `DB.notificationChannels` (28 üyelik, 28/28; 7 kanalın yalnız 2'si kullanılıyor: Sistem içi, E-posta). `kullanici` **rol/ilişki metnidir**, `DB.roles` bağı değildir. `durum` 22/22 `'Aktif'` — **sözlüğü yok**, tek değerli. Arşiv yok, log yok. Yetki: ayarlar/otomasyon (`sahip` · `genelmudur` · `sistem`).

### `DB.integrations` — Entegrasyonlar · n=10 · anahtar `kod` (ENT-NNN)
`kod` · `ad` · `kategori` · `durum` · `aciklama` · `aktif` boolean — 6/6 alan 10/10. Durum: {Bağlı, Bağlı değil, Planlandı} · `kategori` 6 değer — **ikisinin de sözlüğü yok**. İlişki yok. Arşiv yok, log yok. Yetki: ayarlar/entegrasyon.

### `DB.logs` — Sistem log kayıtları · n=7 · anahtar `kod` (LOG-NNNNN)
- **Alanlar:** `kod` · `tarih` (tarih-saat) · `kisi` · `islem` · `kayit` · `modul` · `ip` · `eski` metin/null · `yeni` metin/null — 7 alan 7/7; `eski` null 3 · `yeni` null 1.
- **`kisi` alanı `EMP-*` KODUDUR** (7/7 çözülüyor) — `DB.activities[].kisi` ad taşır, ikisi **farklı eksendir**.
- **Kapsam ölçümü:** 7 kaydın `kayit` önekleri **DUY 1 · GRV 1 · EMP 1 · PRJ 1 · TKL 1 · IZN 1 · SAT 1** — 7 farklı önek, her biri bir kez. `modul` alanı 7 farklı modül adı taşır {Duyurular, Görevler, Personel, Projeler, Teklifler, İzinler, Satın Alma} — **sözlüğü yok**. 65 koleksiyonun **7'si** log'da temsil ediliyor.
- **`islem`** 7 kayıtta 7 farklı serbest metin — küme değil, sözlüğü yok.
- **Arşiv:** `aktif` anahtarı **yok**. **Yetki:** **`log`** ekseni (`sahip` · `genelmudur` · `sistem` · `operasyon` · `devops` — 27 rolün 5'i).

---

## 8. Operasyon — `assets/data/ops.js`

Skaler sözlük: `DB.assetCategories` (20).

### `DB.assets` — Demirbaşlar · n=15 · anahtar `kod` (DMB-YYYY-NNN)
- **Alanlar:** `kod` · `kategori` · `altKategori` · `marka` · `model` · `seri` · `ozellik` · `alisTarihi` · `alisFiyati` sayı · `tedarikci` · `garantiBas` · `garantiBit` · `lokasyon` · `dep` · `durum` · `zimmetli` metin/null · `zimmetTarihi` metin/null · `iadeTarihi` metin/null · `barkod` · `siparis` metin/null · `aktif` boolean · **`arsiv` boolean (1/15)**
- **Opsiyonel:** `zimmetli` + `zimmetTarihi` dolu 9/15 (**birlikte**, 15/15 tutarlı) · `iadeTarihi` dolu 2/15 · `siparis` dolu 3/15 · `arsiv` yalnız DMB-2023-011'de.
- **İlişkiler:** `tedarikci` → suppliers (15/15) · `dep` → departments (15/15) · `zimmetli` → employees (9/9) · **`siparis` → `DB.orders`** (3/3) — demirbaş→sipariş bağının **tek yönü**; siparişte ayna alan yoktur (§9d). Ters yön: `assignments.demirbas`.
- **Durumlar:** `durum` {Aktif, Zimmetli, Depoda, Hurda} — **sözlüğü yok** · `kategori` ⊂ `DB.assetCategories` (20 kategorinin 8'i geçiyor).
- **Para:** `alisFiyati` **NET**; SIP-2026-008'in üç demirbaşı 3 × 9.500 = 28.500 = siparişin neti.
- **Arşiv:** `aktif:false` 1 + `arsiv:true` 1 (aynı kayıt, DMB-2023-011, `durum:'Hurda'`) — bu koleksiyonda üç işaret **aynı kayıtta** hizalı.
- **Log:** veride yok. **Yetki:** `idari` / `satinalma` `departman` kapsamı; `alisFiyati` `finans`.

### `DB.assignments` — Zimmet kayıtları · n=7 · anahtar `kod` (ZMT-YYYY-NNN)
`kod` · `demirbas` · `personel` · `teslimTarihi` · `iadeTarihi` metin/null · `durum` · `tutanak` · `personelOnay` · `onayTarihi` metin/null · `hasar` metin/null · `aktif` boolean. Opsiyonel: `iadeTarihi` 1/7 · `onayTarihi` 6/7 · `hasar` 1/7. İlişki: `demirbas` → assets (7/7) · `personel` → employees (7/7). Durum: {Aktif, İade edildi} · `personelOnay` {Onaylandı, Bekliyor} — **ikisinin de sözlüğü yok**. `tutanak` dosya adı metnidir, `DB.documents` bağı **değildir**. **Kapsam boşluğu:** 9 zimmetli demirbaş var ama 7 zimmet kaydı — DMB-2024-002 ve DMB-2026-013/014/015 gibi bazı zimmetlerin tutanağı modellenmemiş; zimmet gerçeği `assets.zimmetli` alanındadır. Arşiv yok, log yok. Yetki: `idari` kapsamı + kendi zimmeti.

### `DB.vehicles` — Araçlar · n=4 · anahtar `kod` (ARC-NNN)
- **Alanlar (28 ortak + 6 koşullu):** `kod` · `plaka` · `marka` · `model` · `modelYili` sayı · `tip` · `yakit` · `vites` · `motorHacmi` sayı · `motorNo` · `sasi` · `renk` · `mulkiyet` · `alisTarihi` metin/null · `alisBedeli` sayı/null · `satici` metin/null · `kullanim` · `anaSurucu` metin/null · `yedekSurucu` metin/null · `dep` · `proje` (**4/4 null**) · `durum` · `guncelKm` sayı · `sonBakimTarihi` · `sonBakimKm` sayı · `sonrakiBakimTarihi` · `sonrakiBakimKm` sayı · `aktif` boolean · **kiralamaya özgü (1/4):** `kiralamaFirmasi` · `sozlesmeBas` · `sozlesmeBit` · `aylikKira` · `kmSiniri` · `depozito`
- **Koşullu şema:** `mulkiyet:'Satın alınan'` kayıtlarda `alisTarihi`/`alisBedeli`/`satici` dolu ve kiralama alanları **hiç yok**; `mulkiyet:'Kiralık'` kayıtta tam tersi (üçü null, altı kiralama alanı var). Tek koleksiyonda **iki alt şema** yaşıyor.
- **İlişkiler:** `dep` → departments (4/4) · `anaSurucu`/`yedekSurucu` → employees (2/2 her biri) · `proje` → `DB.projects` bağı **açık ama 4/4 null**. Ters yön: maintenance · inspections · policies · fuelLogs · vehicleExpenses · accidents · fines.
- **Durumlar:** `durum` {Aktif, Serviste} · `mulkiyet` {Satın alınan, Kiralık} · `kullanim` {Personele tahsisli, Ortak kullanım} · `tip` {Otomobil, Ticari araç} · `yakit` {Benzin, Dizel, Hibrit} · `vites` {Otomatik, Manuel} — **altısının da sözlüğü yok**. `tip` değerleri `DB.assetCategories` içinde de geçer ama bağ kurulmaz.
- **Arşiv:** `aktif` 4/4 true, `arsiv` yok. **Log:** veride yok.
- **Yetki:** `idari` `departman` kapsamı; `alisBedeli`/`aylikKira` `finans`.

### `DB.maintenance` — Araç bakımı · n=5 · anahtar `kod` (BKM-YYYY-NNN)
`kod` · `arac` · `tur` · `planTarihi` · `planKm` sayı · `gercekTarihi` metin/null · `servis` · `maliyet` sayı/null · `durum` · `kalanGun` sayı · `islemler` dizi · `aktif` boolean. Opsiyonel: `gercekTarihi` ve `maliyet` dolu 2/5 — **birlikte** (yapılmış bakım). `kalanGun` negatif olabilir (−6, −107). İlişki: `arac` → vehicles (5/5). Durum: {Planlandı, Yaklaşıyor, Serviste, Tamam} · `tur` {Periyodik bakım, Ağır bakım} — **sözlükleri yok**. `maliyet` **BRÜT**. Arşiv yok, log yok. Yetki: `idari`; `maliyet` `finans`.

### `DB.inspections` — Muayene · n=4 · anahtar `kod` (MYN-YYYY-NNN)
`kod` · `arac` · `sonTarih` · `gecerlilik` · `sonrakiTarih` · `sonuc` · `kusur` metin/null · `istasyon` · `kalanGun` sayı · `durum` · `aktif` boolean. `kusur` dolu 1/4. İlişki: `arac` → vehicles (4/4). Durum: {Planlandı, Yaklaşıyor} · `sonuc` 4/4 `'Geçti'` (sözleşmede `Kaldı` da tanımlı, veride geçmiyor) — **sözlükleri yok**. `gecerlilik` ve `sonrakiTarih` 4/4 kayıtta **aynı değeri** taşır. Arşiv yok, log yok. Yetki: `idari`.

### `DB.policies` — Sigorta ve kasko poliçeleri · n=6 · anahtar `kod` (PLC-YYYY-NNN)
- **Alanlar (14 ortak + 5 koşullu):** `kod` · `arac` · `tur` · `sirket` · `police` · `baslangic` · `bitis` · `prim` sayı · `teminat` · `acente` · `kalanGun` sayı · `yenileme` · `odeme` · `aktif` boolean · **kaskoya özgü (3/6):** `kaskoBedeli` · `muafiyet` · `ikameArac` · `miniOnarim` · `hasarsizlik`
- **Koşullu şema:** beş ek alan yalnız `tur:'Kasko'` kayıtlarda var; `Trafik Sigortası` kayıtlarında anahtar **hiç yok**. İkinci bir alt şema örneği.
- İlişki: `arac` → vehicles (6/6). Durum: `tur` {Trafik Sigortası, Kasko} · `yenileme` {Bekliyor, Teklif alındı, `'—'`} · `odeme` {Ödendi, Sözleşmeye dahil} — **üçünün de sözlüğü yok**, `yenileme` sentinel kullanır (`DB.contracts[].yenileme` **boolean**dır — aynı ad, farklı tür, farklı koleksiyon).
- `prim` **BRÜT**. Arşiv yok, log yok. Yetki: `idari`; `prim` `finans`.

### `DB.fuelLogs` — Yakıt kayıtları · n=5 · anahtar `kod` (YKT-YYYY-NNN)
`kod` · `arac` · `tarih` · `istasyon` · `litre` sayı · `birimFiyat` sayı · `tutar` sayı · `km` sayı · `surucu` · `aktif` boolean — 10/10 alan 5/5. İlişki: `arac` → vehicles (5/5) · `surucu` → employees (5/5). Durum alanı **yok**. `tutar` **BRÜT** (`litre × birimFiyat` yuvarlanmış). Arşiv yok, log yok. Yetki: `idari` + `finans`.

### `DB.vehicleExpenses` — Araç giderleri · n=8 · anahtar `kod` (AGD-YYYY-NNN)
`kod` · `arac` · `tur` · `tarih` · `tutar` sayı · `aciklama` · `belge` · `aktif` boolean. İlişki: `arac` → vehicles (8/8). **`belge` bir bağ alanı değildir** — serbest belge numarasıdır (`FTR-SRV-8812`, `FIS-88123`, `HGS-0715`, `TRF-8891023`, `KSK-4471928`…); 8 değerin yalnız biri (`CEZ-2026-004`) gerçek bir `DB.fines` kodudur, o da tesadüfi eşleşme değil aynı ceza kaydıdır. `FTR-` önekli üç değer **`DB.invoices` kaydı DEĞİLDİR** (tedarikçi/servis fatura numarası). Durum: `tur` 8 değer {Bakım, Yakıt, HGS, Kira, Ceza, Sigorta, Kasko, Lastik} — **sözlüğü yok**. `tutar` **BRÜT** ve kaynak kaydın tutarını olduğu gibi taşır (3/8 birebir doğrulandı). Arşiv yok, log yok. Yetki: `idari` + `finans`.

### `DB.accidents` — Kaza ve hasar · n=1 · anahtar `kod` (KZA-YYYY-NNN)
`kod` · `arac` · `tarih` · `konum` · `surucu` · `karsiArac` · `kusurOrani` sayı · `tutanak` · `ekspertiz` · `sigortaDosya` · `onarimServis` · `onarimMaliyet` sayı · `durum` · `aciklama` · `aktif` boolean — 15/15 alan 1/1 dolu. İlişki: `arac` → vehicles · `surucu` → employees. Durum: `durum` `'Kapandı'` · `ekspertiz` `'Yapıldı'` — tek kayıt olduğu için **küme ölçülemez**. Arşiv yok, log yok. Yetki: `idari` + `finans`.

### `DB.fines` — Trafik cezaları · n=2 · anahtar `kod` (CEZ-YYYY-NNN)
`kod` · `arac` · `tarih` · `surucu` · `tur` · `tutar` sayı · `sonOdeme` · `durum` · `belge` · `aktif` boolean. İlişki: `arac` → vehicles (2/2) · `surucu` → employees (2/2). Durum: {Ödendi, Ödenmedi} · `tur` {Hız limiti aşımı, Park ihlali} — **sözlükleri yok**. `CEZ-2026-004` ayrıca `DB.vehicleExpenses` içinde gider olarak da yazılıdır (aynı tutar 2.167). Arşiv yok, log yok. Yetki: `idari` + `finans`.

### `DB.suppliers` — Tedarikçiler · n=6 · anahtar `kod` (TDR-NNN)
- **Alanlar:** `kod` · `unvan` · `kategori` · `yetkili` · `tel` · `eposta` · `vergiNo` · `adres` · `puan` sayı · `siparisSayisi` sayı · `toplamTutar` sayı · `odemeVadesi` · `durum` · `aktif` boolean — 14/14 alan 6/6 dolu; yurt dışı tedarikçilerde `yetkili`/`tel`/`vergiNo` `'—'` sentinel'i taşır.
- **İlişkiler:** ters yön `assets.tedarikci` (15) · `orders.tedarikci` (3) · `supplierQuotes.tedarikci` (9).
- **Puan ekseni (§9c):** `DB.suppliers[].puan` = **"Tedarikçi genel puanı"** (tüm sipariş geçmişi) · `DB.supplierQuotes[].puan` = **"Teklif puanı"** (yalnız o teklif). **İkisi aynı hücrede gösterilmez.** Aynı tedarikçinin iki teklifi farklı puan alabilir (TDR-001: 4,4 · 3,9 · 4,5 · 3,7).
- **Ömür boyu sayaç:** `toplamTutar` ve `siparisSayisi` türetilemez; 6 tedarikçinin 4'ünde hiç sipariş kaydı yokken kartta hacim yazılıdır. Kural: kart değeri sistemden hesaplanandan **küçük olamaz** (6/6 doğrulandı).
- **Durumlar:** `durum` 6/6 `'Aktif'` · `kategori` 5 değer · `odemeVadesi` 4 değer — **üçünün de sözlüğü yok**.
- **Arşiv:** `aktif` 6/6 true, `arsiv` yok. **Log:** veride yok. **Yetki:** `satinalma` + `finans`.

### `DB.purchases` — Satın alma talepleri · n=6 · anahtar `kod` (SAT-YYYY-NNN)
- **Alanlar:** `kod` · `talepEden` · `dep` · `proje` metin/null · `urun` · `kategori` · `aciklama` · `ozellik` · `miktar` sayı · `tahminiMaliyet` sayı · `ihtiyacTarihi` · `oncelik` · `gerekce` · `butceKodu` · `durum` · `olusturma` · `onayAdim` sayı · `onayToplam` sayı · `aktif` boolean — 18 alan 6/6; `proje` dolu 1/6.
- **`onayAdim` ekseni (V-23):** **bulunulan adım sırası** (1 tabanlı), onaylanan adım sayısı değildir. Taslak → 0 · süreçte → onaylanan + 1 · tamamlandı → `onayToplam`.
- **İlişkiler:** `talepEden` → employees (6/6) · `dep` → departments (6/6) · `proje` → projects (1/1). Ters yön: `purchaseApprovals.talep` (yalnız 2 açık talep) · `supplierQuotes.talep` (4 talep) · `orders.talep` (3 talep).
- **Durumlar:** `durum` {Taslak, Onay bekliyor, Sipariş verildi, Teslim alındı} — **sözlüğü yok** · `kategori` ⊂ `DB.assetCategories` · `oncelik` ⊂ `DB.priorities` (Yüksek/Düşük geçiyor).
- **Bilinen eksik (V-23):** kapanmış üç talebin (`SAT-2026-011/012/013`) onay zinciri `DB.purchaseApprovals`'ta **modellenmemiştir**; `onayAdim === onayToplam` bilgisi yeterlidir.
- **Arşiv:** yok. **Log:** `DB.logs` `LOG-88195` (SAT-2026-014) · `DB.approvals` 3 kayıt.
- **Yetki:** `satinalma` `departman` kapsamı + `onay` + `finans`.

### `DB.purchaseApprovals` — Onay zincirleri · n=5 · **`kod` yok** (bileşik `talep` + `sira`)
`talep` · `sira` sayı · `rol` · `kisi` · `durum` · `tarih` metin/null · `not` metin/null. `tarih` ve `not` dolu 1/5 (onaylanan adım). İlişki: `talep` → purchases (5/5, yalnız 2 talebe) · `kisi` → employees (5/5). `rol` **makam adıdır** (`'Departman Yöneticisi'`, `'Muhasebe'`, `'Şirket Sahibi'`), `DB.roles[].key` bağı **değildir** — 3 değer, sözlüğü yok. Durum: {Bekliyor, Onaylandı} — sözlüğü yok. Arşiv yok. Yetki: `onay` ekseni.

### `DB.supplierQuotes` — Tedarikçi teklifleri · n=9 · **`kod` yok** (bileşik `talep` + `tedarikci`)
`talep` · `tedarikci` · `fiyat` sayı · `teslimSuresi` · `garanti` · `odeme` · `teknikUygun` boolean · `puan` sayı · `tercih` boolean · `gerekce` — 10/10 alan 9/9 dolu. İlişki: `talep` → purchases (9/9) · `tedarikci` → suppliers (9/9). `fiyat` **NET**. `puan` = **"Teklif puanı"** (§9c). Durum alanı yok; `tercih` ve `teknikUygun` boolean işaretleri var — `SAT-2026-016` talebinde iki teklifin de `tercih:false` olması "henüz tercih yapılmadı" demektir. Arşiv yok, log yok. Yetki: `satinalma` + `finans`.

### `DB.orders` — Siparişler · n=3 · anahtar `kod` (SIP-YYYY-NNN)
- **Alanlar:** `kod` · `talep` · `tedarikci` · `tarih` · `teslimTarihi` · `tutar`/`vergi`/`toplam` sayı · `doviz` · `durum` · `fatura` metin/null · `irsaliye` metin/null · `teslimKontrol` metin/null · `aktif` boolean — 11 alan 3/3; üç null alan aynı kayıtta (henüz teslim alınmamış).
- **`teslimTarihi` çift anlamlıdır:** sipariş teslim alınmadıysa **planlanan**, `durum:'Teslim alındı'` ise **gerçekleşen** tarihtir; ekranda hangisi olduğu yazılır.
- **İlişkiler:** `talep` → purchases (3/3) · `tedarikci` → suppliers (3/3). Demirbaş bağı **tek yönlüdür ve `DB.assets[].siparis` tarafındadır** — siparişte ayna alan yok. **`fatura` alanı `DB.invoices` bağı DEĞİLDİR:** değerleri `FTR-TDR-1188` ve `FTR-AWS-0712`, yani tedarikçinin kestiği fatura numaralarıdır; `DB.invoices` müşteriye kesilen faturaları tutar. Aynı `FTR-` öneki iki ayrı eksende kullanılıyor — **ölçülen bulgu**.
- **Durumlar:** `durum` {Sipariş verildi, Teslim alındı} · `teslimKontrol` {Tam, null} — **ikisinin de sözlüğü yok**. `doviz` 3/3 `'TRY'`.
- **Arşiv:** yok. **Log:** veride yok. **Yetki:** `satinalma` + `finans`.

### `DB.tickets` — Destek talepleri · n=7 · anahtar `kod` (DST-YYYY-NNN)
- **Alanlar:** `kod` · `musteri` · `musteriAd` · `proje` metin/null · `baslik` · `kategori` · `oncelik` · `etki` · `sla` · `sorumlu` · `acan` · `acilis` (tarih-saat) · `ilkYanit` metin/null · `mudahaleSuresi` sayı/null (dakika) · `cozumSuresi` sayı/null (dakika) · `durum` · `harcananSure` sayı (saat) · `ucretli` boolean · `bakimPaketi` · `kalanDestek` sayı · `memnuniyet` sayı/null · `slaDurum` · `aktif` boolean — 20 alan 7/7; `proje` 6/7 · `ilkYanit`/`mudahaleSuresi` dolu 6/7 (**birlikte**) · `cozumSuresi` 3/7 · `memnuniyet` 2/7.
- **İlişkiler:** `musteri` → customers (7/7) · `proje` → projects (6/6) · `sorumlu` → employees (7/7). **Dönüşüm bağlarında talepte ayna alan YOKTUR** — bağ doğan kaydın üstündedir (§9d): `DB.tasks[].destek` (0 kayıt) · `DB.bugs[].destek` (2 kayıt: DST-2026-118 → HTA-2026-074, DST-2026-122 → HTA-2026-075) · `DB.changeRequests[].destek` (0 kayıt). `acan` müşteri yetkilisinin **adıdır**, `DB.contacts` bağı değildir.
- **Durumlar:** `durum` {Açık, Devam ediyor, Müşteri bekleniyor, Çözüldü, Kapandı} — **sözlüğü yok** · `slaDurum` {Zamanında, Risk altında, İhlal edildi} — **sözlüğü yok**, `GV.badge` sözlüğünde tonu var · `kategori` ⊂ `DB.slaPolicies[].kategori` (7/7) · `sla` ⊂ `DB.slaPolicies[].etiket` (7/7) · `oncelik` ⊂ `DB.priorities` · `etki` ⊂ `DB.impacts` · `bakimPaketi` {Standart, Kurumsal, `'—'`} — **sözlüğü yok**, sentinel kullanır.
- **`slaDurum` sözleşmesi (§9):** iki eksenin **kötüsünü** yansıtır (ilk yanıt ve çözüm); tüketim = geçen/hedef; ≥1 İhlal edildi · ≥0,75 Risk altında · altı Zamanında. Açık talepte geçen süre `DB.today` gününün başlangıcına göre ölçülür.
- **Arşiv:** `aktif` 7/7 true, `arsiv` yok. **Log:** veride yok (yalnız BLD-9004 bildirimi).
- **Yetki:** `destek` rolü `departman` kapsamı; müşteri kullanıcısı `kendi`.

### `DB.supportPackages` — Bakım paketleri · n=7 · anahtar `kod` (BKP-NNN)
- **Alanlar:** `kod` · `musteri` · `ad` · `baslangic` · `bitis` · `aylikSaat` sayı · `kullanilan` sayı · `kalan` sayı · `tutar` sayı · `durum` · `sozlesme` metin/null · `yenileme` boolean · `yenilemeTarihi` metin/null · `aktif` boolean — 12 alan 7/7; `sozlesme` dolu 1/7 · `yenilemeTarihi` dolu 2/7 (`yenileme:true` olanlar — **koşullu**).
- **İlişkiler:** `musteri` → customers (7/7) · `sozlesme` → contracts (1/1; 6 paketin sözleşmesi **veride yok**, bağsız bırakılmıştır).
- **Kota aritmetiği (§9, ölçüldü — 7/7 tutuyor):** `kullanilan + kalan = aylikSaat × dönem ayı`, dönem ayı **gün düzeltmeli**: `(yılFarkı × 12) + ayFarkı + (bitişGünü >= başlangıçGünü ? 1 : 0)`. Düzeltme atlanırsa 5'i sapar. `kalan`, o müşterinin taleplerindeki `kalanDestek` ile birebir aynıdır.
- **Durumlar:** `durum` {Aktif, Sona erdi} · `ad` {Kurumsal Bakım, Standart Bakım} — **ikisinin de sözlüğü yok**; `ad` fiilen bir paket türü ekseni ama sözlük koleksiyonu yok.
- **Para:** `tutar` **NET** (BKP-001 = SZL-2026-022.tutar = 180.000).
- **Arşiv:** `aktif` 7/7 true (sona ermiş paket dahil), `arsiv` yok. **Log:** veride yok.
- **Yetki:** `destek` + `finans` (tutar).

### `DB.slaPolicies` — SLA politikaları · n=7 · anahtar `kod` (SLA-NN)
`kod` · `kategori` · `oncelik` · `ilkYanit` sayı (**dakika**) · `cozum` sayı (**dakika**) · `etiket` · `calismaSaati` · `eskalasyon` · `aktif` boolean — 9/9 alan 7/7 dolu. Kategori × öncelik matrisidir. Eşleşme kuralı: `p.kategori === t.kategori && (p.oncelik === t.oncelik || p.oncelik === 'Tümü')` — 7 talebin 7'sinde tutar, fallback gerekmez. `DB.tickets[].sla` bu tablonun **`etiket`**'idir, `cozum` değil. `oncelik` ⊂ `DB.priorities` + `'Tümü'` özel değeri (sözlükte **yok**). `calismaSaati` {7/24, Mesai içi} — sözlüğü yok. İlişkisi yoktur (referans tablosu). Arşiv yok, log yok. Yetki: ayarlar/destek.

### `DB.surveys` — Memnuniyet anketleri · n=24 · anahtar `kod` (ANK-YYYY-NNN)
- **Alanlar:** `kod` · `musteri` · `tur` · `ilgili` metin/null · `tarih` · `kanal` · `yanitlayan` · `durum` · `puan` sayı/null · `tavsiye` sayı/null · `yorum` metin/null · `aktif` boolean · **`arsiv` boolean (1/24)**
- **Opsiyonel:** `ilgili` dolu 20/24 · `puan`/`tavsiye`/`yorum` **birlikte** null 3/24 (`durum:'Bekliyor'`) · `arsiv` yalnız ANK-2025-020'de.
- **İlişki — çok biçimli:** `ilgili`, `tur`a göre farklı koleksiyona bağlanır: `tur:'Destek talebi'` → `DB.tickets` (**6/6 çözülüyor**) · `tur:'Dönemsel'` → `DB.supportPackages` (**4/4**) · `tur:'Proje teslimi'` → `DB.projects` (**yalnız 4/10 çözülüyor**). `musteri` → customers (24/24). `yanitlayan` müşteri yetkilisinin adıdır, bağ değildir.
- **Ölçülen çelişki:** `ilgili` alanındaki 6 proje kodu (`PRJ-2024-011`, `PRJ-2025-009`, `PRJ-2025-010`, `PRJ-2025-012`, `PRJ-2026-008`, `PRJ-2023-014`) `DB.projects`'te **yoktur**. Bu, `customers.projeSayisi`'nin ömür boyu sayaç olmasıyla (V-17) tutarlıdır — tarihsel projeler modellenmemiştir — ama sonuç olarak **bağ hedefi çözülmeyen 6 anket** vardır. Ekran bu satırlarda proje adı basamaz; "arşivdeki proje" diye gösterilmesi ayrı bir karar gerektirir.
- **Durumlar:** `durum` {Yanıtlandı, Bekliyor} · `tur` {Proje teslimi, Dönemsel, Destek talebi} · `kanal` {E-posta anketi, Telefon, Yüz yüze} — **üçünün de sözlüğü yok**.
- **Sözleşme (§9):** yanıtlanmış anketlerin `puan` ortalaması = `DB.customers[].memnuniyet` (arşivli anket dahil) → **12/12 doğrulandı**. `tur:'Destek talebi'` anketin puanı = `DB.tickets[].memnuniyet`. `tavsiye` 0–10 NPS: 9-10 destekleyici · 7-8 nötr · 0-6 kötüleyici.
- **Arşiv:** `arsiv:true` 1 kayıt (ANK-2025-020, `aktif:true`). **Log:** veride yok.
- **Yetki:** müşteri kapsamı + `musteriRapor`.

---

## 9. Bağ Haritası

### 9a. Sözleşmeli bağlar — `components.md` §9d tablosu (birebir)

| Bağ | Alan | Ters yönde okuma |
|---|---|---|
| destek talebi → görev | `DB.tasks[].destek` | `DB.tasks.filter(t => t.destek === kod)` |
| destek talebi → hata | `DB.bugs[].destek` | `DB.bugs.filter(b => b.destek === kod)` |
| destek talebi → değişiklik | `DB.changeRequests[].destek` | ⚠️ `.talep` **başka eksendir** (talebi açan taraf) |
| hata → görev | `DB.bugs[].gorev` | `DB.bugs.filter(b => b.gorev === kod)` — görevde ayna alan **yok** |
| hata → test koşumu | `DB.bugs[].test` | bir hata **en fazla bir** koşuma bağlanır |
| hata → sprint | `DB.bugs[].sprint` | ele alındığı sprint (açıldığı değil) |
| koşum → modül / sprint | `DB.tests[].moduller` (dizi) · `.sprint` | |
| teslim → modül / kabul koşumu | `DB.deliveries[].moduller` (dizi) · `.test` | |
| teslim → taksit | `DB.deliveries[].milestone` | tekil |
| demirbaş → sipariş | `DB.assets[].siparis` | `DB.assets.filter(a => a.siparis === kod)` — siparişte ayna alan **yok** |

**Yön kuralı:** bağ **doğan/bağımlı** kaydın üstünde tutulur, hedefte ayna alan açılmaz. İki yönlü bağ zamanla ayrışır.

### 9b. Veriden ölçülen tüm bağ alanları

Aşağıdaki tablo yalnız **gerçek bağ alanlarını** listeler. Serbest metin içinde geçen kod görünümlü diziler (`tasks.aciklama`, `notifications.baslik`, `documents.ad`, `vehicleExpenses.belge`, `orders.fatura`) bağ **değildir** ve tabloya alınmadı.

| Kaynak koleksiyon | Alan | Hedef | Tekil/Çoklu | Doluluk | Çözülen |
|---|---|---|---|---|---|
| `departments` | `yonetici` | `employees` | tekil | 21/21 | 21/21 |
| `employees` | `dep` | `departments` | tekil | 16/16 | 16/16 |
| `employees` | `yonetici` | `employees` | tekil | 15/16 | 15/15 |
| `employees` | `rol` · `roller` | `roles[].key` | tekil · **dizi** | 16/16 · 16/16 | 16 · 24 |
| `referrers` | `sorumlu` | `employees` | tekil | 8/8 | 8/8 |
| `customers` | `sorumlu` | `employees` | tekil | 12/12 | 12/12 |
| `customers` | `referans` | `referrers` | tekil | 11/12 | 11/11 |
| `contacts` | `musteri` | `customers` | tekil | 14/14 | 14/14 |
| `leads` | `referans` · `sorumlu` · `musteri` | `referrers` · `employees` · `customers` | tekil | 10/12 · 12/12 · 4/12 | hepsi |
| `analyses` | `lead` · `hazirlayan` | `leads` · `employees` | tekil | 4/4 | 4/4 |
| `quotes` | `musteri` · `lead` · `analiz` · `hazirlayan` | customers · leads · analyses · employees | tekil | 5/8 · 7/8 · 3/8 · 8/8 | hepsi |
| `quoteItems` | `teklif` | `quotes` | tekil | 6/6 | 6/6 |
| `interactions` | `musteri` · `lead` · `kisi` | customers · leads · employees | tekil | 6/8 · 2/8 · 8/8 | hepsi |
| `commissions` | `referans` · `musteri` | referrers · customers | tekil | 6/6 | 6/6 |
| `projects` | `musteri` · `pm` · `teknikSorumlu` · `musteriSorumlu` | customers · employees | tekil | 8/8 | 8/8 |
| `projects` | `ekip` | `employees` | **dizi** | 8/8 | 23/23 |
| `projectModules` | `proje` · `sorumlu` | projects · employees | tekil | 15/15 | 15/15 |
| `milestones` | `proje` · `sozlesme` | projects · **contracts** | tekil | 19/19 | 19/19 |
| `sprints` | `proje` | `projects` | tekil | 6/6 | 6/6 |
| `tasks` | `proje` · `modul` · `sprint` · `musteri` · `dep` | projects · projectModules · sprints · customers · departments | tekil | 15 · 11 · 12 · 17 · 25 /25 | hepsi |
| `tasks` | `olusturan` · `veren` · `sorumlu` · `kontrolEden` · `onaylayan` | `employees` | tekil | 25/25 | 25/25 |
| `tasks` | `yardimci` · `izleyiciler` | `employees` | **dizi** | 6/25 · 19/25 | 6 · 21 |
| `tasks` | `destek` | `tickets` | tekil | **0/25** | — |
| `subtasks` | `ustGorev` · `sorumlu` | tasks · employees | tekil | 9/9 | 9/9 |
| `taskDeps` | `gorev` · `bagimli` | `tasks` | tekil | 3/3 · 2/3 | hepsi |
| `deptRequests` | `talepEdenDep` · `talepEdilenDep` | `departments` | tekil | 6/6 | 6/6 |
| `deptRequests` | `talepEden` · `sorumlu` · `musteri` · `proje` | employees · customers · projects | tekil | 6 · 6 · 4 · 3 /6 | hepsi |
| `bugs` | `proje` · `modul` · `bulan` · `sorumlu` · `sprint` | projects · projectModules · employees · sprints | tekil | 6/6 | 6/6 |
| `bugs` | `gorev` · `test` · `destek` | tasks · tests · **tickets** | tekil | 1/6 · 3/6 · 2/6 | hepsi |
| `tests` | `proje` · `sorumlu` · `sprint` | projects · employees · sprints | tekil | 5 · 5 · 3 /5 | hepsi |
| `tests` | `moduller` | `projectModules` | **dizi** | 5/5 | 9/9 |
| `deliveries` | `proje` · `milestone` · `teslimEden` · `test` | projects · milestones · employees · tests | tekil | 5 · 5 · 5 · 1 /5 | hepsi |
| `deliveries` | `moduller` | `projectModules` | **dizi** | 4/5 | 9/9 |
| `changeRequests` | `proje` · `sorumlu` · `destek` | projects · employees · tickets | tekil | 4 · 4 · **0** /4 | hepsi |
| `approvals` | `kayit` | **8 farklı koleksiyon** (`tur`a göre) | tekil, çok biçimli | 12/12 | 12/12 |
| `approvals` | `talepEden` · `onaylayan` | `employees` | tekil | 12/12 | 12/12 |
| `activities` | `kayit` | tasks · leads · projects · customers | tekil, çok biçimli | 8/8 | 8/8 |
| `leaves` | `personel` · `vekil` · `onaylayan` | `employees` | tekil | 7 · 5 · 7 /7 | hepsi |
| `timelogs` | `personel` · `gorev` · `proje` · `musteri` | employees · tasks · projects · customers | tekil | 45 · 39 · 36 · 38 /45 | hepsi |
| `timesheets` | `personel` · `onaylayan` | `employees` | tekil | 6/6 | 6/6 |
| `performance` | `personel` | `employees` | tekil | 5/5 | 5/5 |
| `trainings` | `katilimci` | `employees` | **dizi** | 4/4 | 7/7 |
| `capacity` | `personel` | `employees` | tekil | 10/10 | 10/10 |
| `contracts` | `musteri` · `teklif` · `proje` | customers · quotes · projects | tekil | 7 · 3 · 6 /7 | hepsi |
| `invoices` | `musteri` · `sozlesme` · `proje` · `milestone` | customers · contracts · projects · milestones | tekil | 17 · 16 · 15 · 15 /17 | hepsi |
| `payments` | `fatura` · `musteri` · `sorumlu` | invoices · customers · employees | tekil | 17/17 | 17/17 |
| `meetings` | `musteri` · `proje` | customers · projects | tekil | 5/9 | 5/5 |
| `meetings` | `katilimci` | `employees` | **dizi** | 9/9 | 38/38 |
| `decisions` | `toplanti` · `sorumlu` · `gorev` | meetings · employees · tasks | tekil | 12 · 12 · 3 /12 | hepsi |
| `documents` | `musteri` · `proje` · `yukleyen` | customers · projects · employees | tekil | 5 · 3 · 11 /11 | hepsi |
| `channels` | `sonMesajKisi` · `proje` · `dep` | employees · projects · departments | tekil | 7 · 2 · 2 /7 | hepsi |
| `messages` | `kanal` · `kisi` · `gorev` | channels · employees · tasks | tekil | 6 · 6 · 1 /6 | hepsi |
| `notifications` | `kisi` | `employees` (alıcı) | tekil | 12/12 | 12/12 |
| `announcements` | `yazan` · `dep` | employees · departments | tekil | 3/3 · **0/3** | 3/3 |
| `logs` | `kisi` · `kayit` | employees · **7 farklı koleksiyon** | tekil, çok biçimli | 7/7 | 7/7 |
| `assets` | `tedarikci` · `dep` · `zimmetli` · `siparis` | suppliers · departments · employees · **orders** | tekil | 15 · 15 · 9 · 3 /15 | hepsi |
| `assignments` | `demirbas` · `personel` | assets · employees | tekil | 7/7 | 7/7 |
| `vehicles` | `dep` · `anaSurucu` · `yedekSurucu` · `proje` | departments · employees · projects | tekil | 4 · 2 · 2 · **0** /4 | hepsi |
| `maintenance` · `inspections` · `policies` · `fuelLogs` · `vehicleExpenses` · `accidents` · `fines` | `arac` | `vehicles` | tekil | hepsi tam | hepsi |
| `fuelLogs` · `accidents` · `fines` | `surucu` | `employees` | tekil | tam | tam |
| `purchases` | `talepEden` · `dep` · `proje` | employees · departments · projects | tekil | 6 · 6 · 1 /6 | hepsi |
| `purchaseApprovals` | `talep` · `kisi` | purchases · employees | tekil | 5/5 | 5/5 |
| `supplierQuotes` | `talep` · `tedarikci` | purchases · suppliers | tekil | 9/9 | 9/9 |
| `orders` | `talep` · `tedarikci` | purchases · suppliers | tekil | 3/3 | 3/3 |
| `tickets` | `musteri` · `proje` · `sorumlu` | customers · projects · employees | tekil | 7 · 6 · 7 /7 | hepsi |
| `supportPackages` | `musteri` · `sozlesme` | customers · contracts | tekil | 7/7 · 1/7 | hepsi |
| `surveys` | `musteri` · `ilgili` | customers · **projects/supportPackages/tickets** | tekil, çok biçimli | 24/24 · 20/24 | 24/24 · **14/20** |

### 9c. Bilinçli olarak bağsız bırakılan kayıtlar (V-30)

`DST-2026-119` → hata · `DST-2026-120` → görev/değişiklik · `DST-2026-117` · `121` · `123` → hiçbiri · `HTA-2026-076` → test · `TST-2026-019` · `TST-2026-021` → hata · `TST-2026-020` · `TST-2026-022` → sprint · `SIP-2026-007` · `SIP-2026-009` → demirbaş · 2024–2025 demirbaşları → sipariş · `TSL-2026-032` → modül. Gerekçeleri `tasks/assumptions.md` V-30 tablosundadır; bu belge onları tekrar üretmez.

---

## 10. Arşivleme Mantığı

Proje genelinde **tek bir arşiv alanı yoktur**; üç ayrı işaret koleksiyondan koleksiyona değişerek kullanılır. Ölçülen durum:

| İşaret | Nerede | Ölçüm |
|---|---|---|
| `aktif` boolean | 65 koleksiyonun **48'inde** var, 17'sinde **hiç yok** | `false` olan yalnız **6 kayıt** / 5 koleksiyon: `DEP-19` · `REF-008` · `MUS-2025-006` · `MUS-2023-012` · `YTK-014` · `DMB-2023-011` |
| `arsiv` boolean | **7 koleksiyonda, her birinde tek kayıtta** — anahtar diğer kayıtlarda **hiç yok** | `MUS-2023-012` · `TKL-2025-007` · `KOM-2025-006` · `PRJ-2025-008` · `GRV-2026-124` · `DMB-2023-011` · `ANK-2025-020` |
| `durum` değeri | Koleksiyona özgü | `Arşivlendi` (tasks) · `Pasif` (customers, referrers) · `Sona erdi` (supportPackages) · `Hurda` (assets) · `Kapandı` (bugs, accidents) |

**`aktif` anahtarı hiç olmayan 17 koleksiyon:** `roles` · `pipelineStages` · `quoteItems` · `interactions` · `projectModules` · `milestones` · `sprints` · `subtasks` · `taskDeps` · `approvals` · `activities` · `capacity` · `messages` · `notifications` · `logs` · `purchaseApprovals` · `supplierQuotes`. Bunlar ya sözlük/referans tablosu ya da bir ana kaydın alt kaydıdır; pasifleştirme ana kayıt üzerinden yürür.

**İki işaret her zaman hizalı değildir** — ölçülen üç desen:

1. **Üçü de hizalı:** `DMB-2023-011` → `aktif:false` + `arsiv:true` + `durum:'Hurda'`.
2. **Yalnız `aktif:false`:** `MUS-2025-006` (`durum:'Pasif'`, `arsiv` anahtarı **yok**) · `DEP-19` · `REF-008` · `YTK-014`.
3. **Yalnız `arsiv:true`, kayıt hâlâ aktif:** `TKL-2025-007` · `KOM-2025-006` · `PRJ-2025-008` · `GRV-2026-124` · `ANK-2025-020` — hepsinde `aktif:true`. Arşiv burada "geçmiş dönem kaydı, listede varsayılan gizli" anlamındadır, pasiflik değil.

**Ekran davranışı:** liste bileşeni `archive:true` / `passive:true` toggle'larıyla ikisini **ayrı** sunar (`components.md` §2). Rapor ekranlarında arşiv gizlemesi **kapalıdır** (`archive:false`, assumptions V-21) — arşiv kayıtları rapora dahildir, aksi hâlde KPI ile tablo sayısı çelişir.

---

## 11. Log Kaydı — ölçüm

İki ayrı log koleksiyonu var ve **eksenleri farklıdır**:

| | `DB.logs` | `DB.activities` |
|---|---|---|
| Dosya | `misc.js` | `work.js` |
| Kayıt sayısı | 7 | 8 |
| Anahtar | `kod` (LOG-NNNNN) | **`kod` yok** |
| Aktör alanı | `kisi` = **`EMP-*` kodu** (7/7 çözülüyor) | `kisi` = **personel adı** (metin) |
| Hedef alanı | `kayit` + `modul` | `kayit` |
| Eski/yeni değer | `eski` · `yeni` (metin/null) | `eski` · `yeni` (metin/null) |
| Ek alanlar | `ip` (IP adresi), `islem` (serbest metin) | `tone`, `icon` (sunum alanları) |
| Amaç | Sistem denetim izi — `log` yetki eksenine tabi | Kayıt detay ekranındaki aktivite timeline'ı |

**Kod öneki dağılımı (ölçüldü):**

| Koleksiyon | Önek dağılımı | Kapsanan koleksiyon sayısı |
|---|---|---|
| `DB.logs[].kayit` | `DUY` 1 · `GRV` 1 · `EMP` 1 · `PRJ` 1 · `TKL` 1 · `IZN` 1 · `SAT` 1 | **7 / 65** |
| `DB.activities[].kayit` | `GRV` 4 · `LEAD` 2 · `PRJ` 1 · `MUS` 1 | **4 / 65** (yalnız 4 farklı kayıt: GRV-2026-101, LEAD-2026-001, PRJ-2026-006, MUS-2026-010) |

`DB.logs[].modul` alanı 7 kayıtta 7 farklı modül adı taşır (Duyurular · Görevler · Personel · Projeler · Teklifler · İzinler · Satın Alma) — **sözlüğü yoktur**, `DB.roles` ya da menü yapısıyla kod düzeyinde eşleşmez.

**Bir olay iki koleksiyonda birden yazılı olabilir:** PRJ-2026-006 sağlık değişimi hem `LOG-88198`'de hem `DB.activities`'te var; GRV-2026-101 ilerleme güncellemesi hem `LOG-88200`'de hem aktivitede var. Aynı olayın iki temsili farklı alan adları taşıyor (`eski:'İlerleme %45'` ↔ `eski:'%45'`) — **ölçülen tutarsızlık**, tek kaynak seçilmiş değil.

**Log kapsamı dışı:** 58 koleksiyonun hiçbir kaydı için log/aktivite yazılmamıştır. Prototipte log **temsili örnek** düzeyindedir; gerçek sistemde her mutasyonun log doğurması beklenir (otomasyon kuralları `DB.automations`'ta tanımlı ama log üretimi bir kural olarak yazılı değil).

---

## 12. Şema Tekdüzeliği Bulguları

Aynı koleksiyonun kayıtlarının **farklı anahtar kümesi** taşıdığı yerler. Bu bir bulgudur, kusur değil — birçoğu bilinçli koşullu alandır; hepsi ölçülerek yazıldı.

### 12a. Koşullu alan — durum/tür bağımlı, tutarlı

| Koleksiyon | Anahtar | Kaç kayıtta | Koşul |
|---|---|---|---|
| `tasks` | `engelNedeni` | 1/25 | yalnız `durum:'Engellendi'` |
| `tasks` | `revizeNot` | 1/25 | yalnız `durum:'Revize bekliyor'` |
| `tasks` | `gecikmeNedeni` | 1/25 | yalnız gecikmiş görevde |
| `tasks` | `tekrar` | 1/25 | yalnız `tur:'Tekrarlayan görev'` |
| `tasks` | `teslimEdilenCikti` | 4/25 | yalnız çıktısı teslim edilmiş görevde |
| `leaves` | `ret` | 1/7 | yalnız `durum:'Reddedildi'` |
| `meetings` | `notlar` | 5/9 | yalnız `durum:'Tamamlandı'` |
| `contracts` | `yenilemeTarihi` | 2/7 | yalnız `yenileme:true` |
| `channels` | `proje` | 2/7 | yalnız `tur:'Proje kanalı'` |
| `channels` | `dep` | 2/7 | yalnız `tur:'Departman içi kanal'` |
| `messages` | `gorev` | 1/6 | yalnız göreve dönüşmüş mesajda |
| `employees` | `saatlikUcret` | 1/16 | yalnız proje bazlı çalışanda (`maas:0`) |
| `vehicles` | `kiralamaFirmasi` · `sozlesmeBas` · `sozlesmeBit` · `aylikKira` · `kmSiniri` · `depozito` | 1/4 (altısı da) | yalnız `mulkiyet:'Kiralık'` |
| `policies` | `kaskoBedeli` · `muafiyet` · `ikameArac` · `miniOnarim` · `hasarsizlik` | 3/6 (beşi de) | yalnız `tur:'Kasko'` |

`vehicles` ve `policies` fiilen **iki alt şema** barındırır; form ve detay ekranı alan grubunu `mulkiyet` / `tur` değerine göre açıp kapatmak zorundadır.

### 12b. `arsiv` anahtarı — 7 koleksiyonda yalnız birer kayıtta

`customers` (1/12) · `quotes` (1/8) · `commissions` (1/6) · `projects` (1/8) · `tasks` (1/25) · `assets` (1/15) · `surveys` (1/24). Diğer kayıtlarda anahtar **hiç yoktur** (`false` değil, `undefined`). Kod `r.arsiv === true` kontrolü yapmalıdır; `!r.arsiv` de doğru çalışır ama `r.arsiv === false` **hiçbir kaydı yakalamaz**.

### 12c. Ölçülen çelişkiler ve tek yönlü sapmalar

| # | Bulgu | Ölçüm |
|---|---|---|
| 1 | `DB.surveys[].ilgili` içindeki 6 proje kodu `DB.projects`'te yok | 10 proje-teslimi anketinin yalnız 4'ü çözülüyor. Tarihsel projeler modellenmemiş (V-17 ömür boyu sayaç istisnasıyla tutarlı) ama bağ hedefi yok |
| 2 | `DB.orders[].fatura` `DB.invoices` kaydı değildir | Değerler `FTR-TDR-1188` · `FTR-AWS-0712` — tedarikçi fatura numarası. Aynı `FTR-` öneki iki ayrı eksende |
| 3 | `DB.vehicleExpenses[].belge` bağ alanı değildir | 8 değerin 7'si serbest belge numarası; yalnız `CEZ-2026-004` gerçek bir `DB.fines` kodu |
| 4 | `DB.quotes[].durum` `DB.pipelineStages` ile örtüşmez | `İletildi` ve `Taslak` aşama sözlüğünde yok. Teklif durumu bağımsız, sözlüksüz eksen |
| 5 | Sentinel `'—'` kullanımı tekdüze değil | Kullanan: `quotes.musteriOnay` · `commissions.onay` · `taskDeps.tur` · `policies.yenileme` · `tickets.bakimPaketi` · `referrers` iletişim alanları · `projects.repo/canli/test`. Kullanmayan (null tercih eden): `deliveries.musteriOnay` (§9 açık yasak) · `bugs.cozum` · `assets.zimmetli` |
| 6 | `yenileme` alanı iki ayrı türde | `DB.contracts[].yenileme` **boolean** · `DB.policies[].yenileme` **metin** ({Bekliyor, Teklif alındı, '—'}). Aynı ad, farklı eksen, farklı koleksiyon |
| 7 | `destek` bağ alanı açık ama iki koleksiyonda hiç yazılı değil | `DB.tasks[].destek` **0/25** · `DB.changeRequests[].destek` **0/4**. Gerekçe V-30'da yazılı (bilinçli) |
| 8 | `DB.announcements[].dep` ve `DB.vehicles[].proje` hiç yazılı değil | 3/3 ve 4/4 null |
| 9 | `kisi` alanı iki farklı eksen taşıyor | `DB.logs[].kisi` = `EMP-*` kodu · `DB.activities[].kisi` = personel **adı** · `DB.interactions[].kisi` = `EMP-*` kodu · `DB.messages[].kisi` = `EMP-*` kodu. Ad taşıyan tek yer aktivitelerdir |
| 10 | Aynı olay iki log koleksiyonunda farklı biçimde | PRJ-2026-006 ve GRV-2026-101 olayları hem `DB.logs` hem `DB.activities`'te; `eski`/`yeni` biçimleri farklı |
| 11 | `DB.assignments` zimmet gerçeğini eksik temsil ediyor | `DB.assets`'te 9 kayıt `durum:'Zimmetli'`, `DB.assignments`'ta 7 kayıt (biri iade edilmiş) — zimmet tutanağı 4 demirbaş için modellenmemiş |
| 12 | `DB.capacity` 16 personelin 10'unu kapsıyor | EMP-001/002/011/012/013/014 kapasite kaydı yok |
| 13 | `DB.quoteItems` 8 teklifin yalnız 1'ini kapsıyor | `kalemSayisi` alanı gerçek sayıyı taşır (43 kalem), veride 6 kayıt var |
| 14 | `DB.purchaseApprovals` kapanmış talepleri kapsamıyor | 6 talebin 2'si için zincir var; `SAT-2026-011/012/013` için adım dökümü yok (V-23'te açıkça kaydedilmiş) |
| 15 | `SZL-2026-022` için `Σ milestone.odeme = 0 ≠ tutar` | Bilinçli — aylık bakım sözleşmesi taksit tutmaz (V-25) |
| 16 | `DB.taskTransitions` 19 durumun 10'unu kapsıyor | 9 durum için geçiş kuralı veride yok |

### 12d. Ömür boyu sayaç istisnaları (L-08'in yazılı istisnaları)

Aşağıdaki alanlar sistemdeki kayıtlardan **türetilemez** — sistem öncesi geçmişi de kapsarlar. Kural her birinde aynı: **kart değeri, sistemden hesaplanandan küçük olamaz.**

| Alan | Ölçüm |
|---|---|
| `DB.customers[].projeSayisi` | `DB.projects` yalnız güncel projeleri tutar (V-17) |
| `DB.customers[].toplamCiro` | 12 müşterinin 6'sında Σ sözleşmeye eşit, 5'inde büyük, 0'ında küçük |
| `DB.referrers[].yonlendirme` · `.kazanilan` · `.kaybedilen` · `.ciro` | Σ `yonlendirme` 45, bağlı lead 10; `ciro` 8 kaydın 4'ünde büyük, 0'ında küçük |
| `DB.sprints[].gorevSayisi` | Σ 60, bağlı `DB.tasks` kaydı 12 (V-27) |
| `DB.suppliers[].toplamTutar` · `.siparisSayisi` | 6 tedarikçinin 4'ünde hiç sipariş kaydı yokken kartta hacim var (6/6 ≥ kuralı doğrulandı) |
| `DB.departments[].personel` | Departman kartı sayacı; `DB.employees[].dep` sayımından bağımsız |

---

## 13. Sözlüğü Olmayan Eksenler

**Sözlüğü olan (13 eksen):** `DB.refTypes` · `DB.sectors` · `DB.services` · `DB.lostReasons` · `DB.taskStatuses` · `DB.taskTypes` · `DB.priorities` · `DB.impacts` · `DB.leaveTypes` · `DB.notificationChannels` · `DB.assetCategories` · `DB.pipelineStages[].key` (satış aşaması) · `DB.slaPolicies[].etiket` + `.kategori` (SLA). Ayrıca `DB.roles[].key` rol eksenidir.

Ölçüm: bu sözlüklerin kapsadığı **tüm** alanlarda sapma yoktur (leads.asama 12/12 · tasks.durum 25/25 · tasks.tur 25/25 · bugs.siddet 6/6 · customers.kaynak 12/12 · assets.kategori 15/15 · employees.rol 16/16 · automations.kanal 28/28 · tickets.sla 7/7). Tek istisna `DB.quotes[].durum`'dur (bkz. §12c-4).

**Sözlük koleksiyonu bulunmayan durum/tür eksenleri** (değer kümesi yalnız veriden okunur):

| Modül | Alan → ölçülen küme |
|---|---|
| org | `employees.calismaTuru` {Tam zamanlı, Yarı zamanlı, Proje bazlı} · `employees.sozlesme` {Belirsiz süreli, Belirli süreli, Hizmet sözleşmesi, Staj sözleşmesi} · `roles.dash` {sahip, pm, satis, personel, ik, satinalma, musteri} · `roles.kademe` {1,2,3,4} |
| satış | `customers.durum` {Aktif, Pasif, Potansiyel, Riskli} · `customers.risk` {Düşük, Orta, Yüksek} · `customers.buyukluk` {10-50 … 500+} · `referrers.durum` {Aktif, Pasif} · `referrers.komisyonModeli` {Ciro yüzdesi, Sabit bedel, Yok} · `leads.sicaklik` {Sıcak, Ilık, Soğuk} · `analyses.durum` {Hazırlanıyor, Onay bekliyor, Onaylandı} · `analyses.sureBirim` {hafta} · `quotes.durum` (6) · `quotes.icOnay` {Onaylandı, Bekliyor} · `quotes.musteriOnay` {Bekliyor, Onaylandı, Reddedildi, —} · `quoteItems.tur` {Modül, Hizmet} · `quoteItems.birim` {Paket, Gün} · `interactions.tur` {Toplantı, Telefon, E-posta} · `commissions.durum` (4) · `commissions.onay` (3) |
| proje/iş | `projects.durum` {Planlama, Geliştirme, Test, Teslim} · `projects.saglik` {İyi, Dikkat, Riskli} · `projects.faz` {Faz 1, Tamamlandı} · `projectModules.durum` (4) · `milestones.durum` {Planlandı, Yaklaşıyor, Tamamlandı, Gecikti} · `milestones.odemeDurum` {Bekliyor, Ödendi} · `sprints.durum` (3) · `taskDeps.tur` {Engelliyor, Bekliyor, —} · `deptRequests.durum` (3) · `deptRequests.onay` (2) · `deptRequests.tur` (6) · `bugs.durum` {Açık, Devam ediyor, Kapandı} · `bugs.tekrarlanabilir` {Her zaman, Bazen} · `bugs.ortam` (serbest) · `tests.durum` (3) · `tests.tur` {Regresyon, Fonksiyonel, Performans, Duman, Kabul} · `deliveries.durum` (3) · `deliveries.musteriOnay` (2+1) · `changeRequests.durum` (4) · `changeRequests.talep` {Müşteri, (İç ekip)} · `approvals.durum` {Bekliyor, Onaylandı} · `approvals.tur` (8) · `activities.tone` (5) |
| İK | `leaves.durum` (3) · `timelogs.onay` {Bekliyor, Onaylandı} · `timesheets.durum` (2) · `performance.durum` {Açık, Tamamlandı} · `trainings.durum` (2) · `trainings.tur` {Online kurs, Atölye, Seminer} |
| finans/sistem | `contracts.durum` {Aktif, Tamamlandı, Gecikti} · `invoices.durum` {Ödendi, Ödenmedi, Gecikti} · `payments.durum` {Bekliyor, Ödendi, Gecikti} · `meetings.durum` (2) · `meetings.tur` (4) · `decisions.durum` (4) · `documents.tur` (10) · `documents.gizlilik` {Gizli, İç kullanım, Kişisel veri} · `documents.onay` (2) · `channels.tur` (5) · `notifications.tur` (12) · `notifications.tone` (4) · `automations.durum` {Aktif} · `integrations.durum` {Bağlı, Bağlı değil, Planlandı} · `integrations.kategori` (6) · `logs.modul` (7) · `logs.islem` (serbest) |
| operasyon | `assets.durum` {Aktif, Zimmetli, Depoda, Hurda} · `assignments.durum` {Aktif, İade edildi} · `assignments.personelOnay` (2) · `vehicles.durum` {Aktif, Serviste} · `vehicles.mulkiyet` · `vehicles.kullanim` · `vehicles.tip` · `vehicles.yakit` · `vehicles.vites` · `maintenance.durum` {Planlandı, Yaklaşıyor, Serviste, Tamam} · `maintenance.tur` (2) · `inspections.durum` (2) · `inspections.sonuc` {Geçti, (Kaldı)} · `policies.tur` {Trafik Sigortası, Kasko} · `policies.yenileme` (3) · `policies.odeme` (2) · `vehicleExpenses.tur` (8) · `accidents.durum` · `accidents.ekspertiz` · `fines.durum` {Ödendi, Ödenmedi} · `fines.tur` (2) · `suppliers.durum` {Aktif} · `suppliers.kategori` (5) · `suppliers.odemeVadesi` (4) · `purchases.durum` (4) · `purchaseApprovals.durum` (2) · `purchaseApprovals.rol` (3 makam adı) · `orders.durum` (2) · `orders.teslimKontrol` {Tam} · `tickets.durum` (5) · `tickets.slaDurum` {Zamanında, Risk altında, İhlal edildi} · `tickets.bakimPaketi` {Standart, Kurumsal, —} · `supportPackages.durum` {Aktif, Sona erdi} · `supportPackages.ad` {Kurumsal Bakım, Standart Bakım} · `slaPolicies.calismaSaati` {7/24, Mesai içi} · `surveys.durum` {Yanıtlandı, Bekliyor} · `surveys.tur` (3) · `surveys.kanal` (3) |

**Sonuç:** 13 eksen sözlüklü, **90'ın üzerinde** durum/tür ekseni sözlüksüzdür. Sözlüksüz eksenlerde form `select` seçenekleri ve liste filtresi **mevcut kayıtlardan türetilir**; bu, veride hiç geçmeyen geçerli bir değerin (ör. `deliveries.musteriOnay:'Revizyon istendi'`, `inspections.sonuc:'Kaldı'`, `changeRequests.talep:'İç ekip'`) seçenek listesinde **görünmemesine** yol açar. Sözleşmede tanımlı ama veride geçmeyen bu üç değer bilinen boşluktur.
