# filo-form-brief.md — Filo Form Ekranları Ek Sözleşmesi

> **Bu dosya `tasks/form-brief.md`'nin EKİDİR, yerine geçmez.** Önce form-brief okunur,
> sonra bu. Yalnız filo (araç) modülüne özgü kuralları ve **ölçülmüş** veri eksenlerini
> taşır — ajanın bunları yeniden keşfetmesi gerekmez, hepsi burada yazılı.
>
> Kalıp ekran: **`app-arac-form.html`** (yayında, 1332 satır). Desen oradan alınır;
> `components.md` birkaç kez var olmayan API belgeledi — **gerçek dosyayı esas al**.

---

## 1. Filo para ekseni — TEK EKSEN, KDV DAHİL

`components.md` §9b'ye 8. oturumda yazıldı. Filo tarafındaki **bütün** tutarlar
**BRÜT (KDV dahil)** — ödenen tutar eksenidir:

| Alan | Eksen |
|---|---|
| `DB.maintenance[].maliyet` | BRÜT |
| `DB.policies[].prim` | BRÜT |
| `DB.vehicleExpenses[].tutar` | BRÜT |
| `DB.fuelLogs[].tutar` | BRÜT (pompa fiyatı zaten KDV dahildir) |
| `DB.accidents[].onarimMaliyet` · `DB.fines[].tutar` | BRÜT |

**Ölçüm:** 8 gider kaydının 3'ü kaynak kaydın tutarını **olduğu gibi** taşıyor —
`AGD-2026-051` 34.800 = `BKM-2026-020.maliyet` · `AGD-2026-056` 8.400 = `PLC-2026-011.prim` ·
`AGD-2026-057` 42.000 = `PLC-2026-012.prim`. Gider kaydı net'e çevirmiyor.

**Etikette "(KDV dahil)" yazılır.** Para alanı `GV.perm.can('finans')` yoksa forma
**hiç basılmaz** (devre dışı bırakma yok); düzenlemede kayıttaki tutara **dokunulmaz**
(`degerleriOku` içinde anahtar `v`'den düşürülür).

---

## 2. Koleksiyon alan listeleri — ölçüldü, aramaya gerek yok

```
DB.vehicles (4)        kod plaka marka model modelYili tip renk yakit vites motorHacmi motorNo
                       sasi mulkiyet alisTarihi alisBedeli satici kiralamaFirmasi sozlesmeBas
                       sozlesmeBit aylikKira kmSiniri depozito kullanim dep anaSurucu
                       yedekSurucu proje durum guncelKm sonBakimTarihi sonBakimKm
                       sonrakiBakimTarihi sonrakiBakimKm aktif

DB.policies (6)        kod arac tur sirket police baslangic bitis prim teminat acente
                       kalanGun yenileme odeme aktif
                       tur = 'Trafik Sigortası' | 'Kasko'
                       ⚠ KASKOYA ÖZEL İKİ ALAN: `kaskoBedeli` · `hasarsizlik` — yalnız
                       kasko kayıtlarında var (6 poliçenin 3'ünde). Alan listesi ilk
                       kayıttan çıkarıldığı için ilk sürümde eksikti; `tur`'a göre
                       değişen alan kümesi olan TEK filo koleksiyonu budur.
                       `app-arac-sigorta.html` ikisini `visible:false` kolon olarak
                       taşıyor, `app-arac-form.html` `kasko.kaskoBedeli` okuyor.

DB.fuelLogs (5)        kod arac tarih istasyon litre birimFiyat tutar km surucu aktif

DB.vehicleExpenses (8) kod arac tur tarih tutar aciklama belge aktif
                       tur = Bakım | Yakıt | HGS | Kira | Ceza | Sigorta | Kasko | Lastik

DB.accidents (1)       kod arac tarih konum surucu karsiArac kusurOrani tutanak ekspertiz
                       sigortaDosya onarimServis onarimMaliyet durum aciklama aktif

DB.fines (2)           kod arac tarih surucu tur tutar sonOdeme durum belge aktif
                       tur = 'Hız limiti aşımı' | 'Park ihlali'
```

---

## 3. Ekrana özel sert kurallar

### Sigorta / kasko — `DB.policies`
**Trafik sigortası ve kasko AYRI POLİÇE EKSENİDİR.** `tur` alanı ikisini ayırır; bir kayıtta
birleştirilmez, aynı araç ikisini birden taşıyabilir ve bunlar **iki ayrı kayıttır**.
Yenileme uyarı eşikleri **60 / 30 / 15 / 7 gün** — `app-arac-detay.html` yenileme takviminde
kurulu, **ikinci bir eşik seti icat edilmez**.

### Yakıt — `DB.fuelLogs`
**`tutar = litre × birimFiyat`** — türetilir, elle girdirilmez (L-08).
Ölçüm: `YKT-2026-088` 52,4 × 48,9 = 2.562 ✓ · `YKT-2026-089` 38,2 × 48,5 = 1.853 ✓ ·
`YKT-2026-090` 41 × 48,7 = 1.997 ✓ (yuvarlama tam liraya).
**Kilometre monotonluğu:** aynı aracın daha eski yakıt kaydının km'sinden küçük olamaz,
aracın `guncelKm`'sini aşamaz. Ortalama tüketim türetilir, girdirilmez.

### Gider — `DB.vehicleExpenses`
Gider türü kümesi **liste ekranının süzgecinden** alınır (18 kalem; veride 8 tür kullanılıyor).
Gider bir bakımdan ya da poliçeden doğuyorsa **bağ alanı veride YOKTUR** — uydurulmaz,
`GV.notice` ile kapsam notu olarak bildirilir (aynı tutarın iki yerde durduğu ölçüldü).

### Kaza / ceza — `DB.accidents` + `DB.fines`
**İKİ AYRI KOLEKSİYONDUR, tek kayıtta birleştirilmez.** Hangisinin düzenlendiği kod
önekinden anlaşılır (`KZA-*` kaza, `CEZ-*` ceza); yeni kayıtta kullanıcıya kayıt türü
seçtirilir ve seçime göre **alan kümesi değişir**. Kaza kaydının poliçe bağı veride
`sigortaDosya` metnidir — kod bağı **değildir**, öyle davranılmaz.

---

## 4. Ortak noktalar (form-brief'in filo karşılığı)

- `data-sec` ve `data-screen` **kaynak liste ekranının `<body>` etiketinden** alınır.
- `?arac=ARC-...` ile araç ön doldurma **her filo formunda** desteklenir.
- Araç **demirbaştan ayrı modüldür** — `DB.assets` okunmaz, demirbaş bağı uydurulmaz.
- `kalanGun` üç koleksiyonda (`maintenance` · `inspections` · `policies`) **veriye gömülü
  türevdir** ve `DB.today`'e göre hesaplanmıştır. Forma girdirilmez; gösterilecekse
  **yeniden hesaplanır**, kayıttaki değere güvenilmez.
- Başlıkta **kayıt kodu** durur (`kayit.kod + ' · Düzenle'`) — plaka alt satıra yazılır.
  8. oturumda araç formu plakayı başlığa koydu, `rec.js` bunu "kayıt yüklenmedi" diye
  yakaladı (ders L-19).
- Aktivite satırı **kaydın kendi koduyla** yazılır (`kayit: PLC-...`). Not: araç kartı
  aktiviteleri `kayit === ARC-...` süzdüğü için bu satırlar araç kartında görünmez —
  bilinen ve kabul edilmiş davranış, ortak katman kararı beklemede.
