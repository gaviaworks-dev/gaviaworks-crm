# brief-p4-rapor-gocu.md — Rapor Kolon API'si Göçü (P4-01)

> Bu dosya rapor sayfası göçü yapan ajanın **ilk ve tek** okuduğu sözleşmedir.
> `assets/js/ui.js`'i KEŞFETME — ihtiyacın olan API'nin tamamı burada yazılı.
> Geçen turda ortak katmanı tek tek okuyan ajanlar başına ~300k token gitti.

---

## 0. Görevin

Sana **bir tane** `app-rapor-*.html` verilir. O dosyanın başındaki **kopya
prelude**'ü silip ortak API'ye bağlarsın. Başka hiçbir şey yapmazsın.

**Ölçülen sorun:** 7 rapor sayfası toplam ~3.060 satır prelude yazıyor ve
`colMoney / colNum / colPct / colDate / colDurum / colKisi / mny / mnyTone /
mnySigned / num / sub / faint / gunCell / oranCell / linkCell / mRow / tbl / bos`
fabrikaları **her sayfada yeniden tanımlanıyor**. Aynı işi yapan 7 kopya, biri
diğerinden sessizce ayrılıyor (`app-rapor-finans.html:76-190` = 115 satır).

**Yasaklar (ihlal = iş geri döner):**
- `assets/**` altında hiçbir dosyayı değiştirme. Ortak API'de eksik gördüğünü
  **rapor et**, kendin ekleme, sayfaya `<style>` yazma.
- `git` çalıştırma, commit atma.
- Rapor **hesaplarına** dokunma. Bu bir kabuk göçüdür: filtre mantığı, KPI
  formülü, veri toplama, grafik verisi **olduğu gibi kalır**. Tek bir sayının
  bile değişmemesi gerekir.
- Yorumda `*` + `/` yan yana gelen desen yazma (ders **L-37**) — blok yorumu
  oracıkta kapanır ve sayfanın tamamı çöker.

---

## 1. Ortak API — `GV.cell` ve `GV.cols`

Hepsi `assets/js/ui.js` içinde, **146 sayfanın tamamında yüklü**. Sayfanın
yerel kopyasını sil, çağrıları bunlara çevir.

### Hücre biçimleyiciler — `GV.cell`

```js
GV.cell.mny(v)             // <span class="cell-money">1.250 ₺</span>
GV.cell.mny(v, {tone:'ok'})// ton: 'ok' | 'warn' | 'danger' | 'accent'
GV.cell.mny(v, {signed:1}) // negatifte kırmızı ve − işareti, pozitifte yeşil
GV.cell.num(v)             // <span class="u-num">1.250</span>
GV.cell.sub(t)             // <span class="cell-sub">…</span>   (ikinci satır)
GV.cell.faint(t)           // <span class="u-faint">…</span>    (soluk / boş değer)
GV.cell.gun(v, tone)       // "12 gün" · null → faint('—')
GV.cell.oran(v, esik)      // "%72" · eşiğe göre ok/warn/danger · null → faint('—')
GV.cell.link(href, kod, altHtml)   // <a class="cell-main">KOD</a> + alt satır
GV.cell.mrow(main, kod, metas, badges)  // mobil satır iskeleti
```

`GV.cell.mny` ve `GV.cell.num` **`null`ı sıfırdan ayırır**: ölçülemeyen bir
maliyet için "0 ₺" basmak, gideri olmayan bir kayıt göstermek olurdu (REVİZE 04).
`null` → soluk `—`. Bu davranışı bozma.

### Kolon fabrikaları — `GV.cols`

```js
GV.cols.money(key, label, opts)   // sağa hizalı · null-duyarlı
GV.cols.num(key, label, opts)
GV.cols.pct(key, label, opts)     // opts.bar → ilerleme çubuğu · opts.esik
GV.cols.date(key, label, opts)    // opts.plain → düz tarih · ORTALANIR [14.2.5]
GV.cols.durum(key, label, opts)   // GV.badge · ORTALANIR [14.2.6]
GV.cols.kisi(key, label, opts)    // GV.user · dışa aktarımda personelin ADI
GV.cols.kod(key, label, opts)     // opts.href(x) → bağlantılı kayıt kodu
```

Ortak `opts`: `visible` (varsayılan true) · `sub(x)` (ikinci satır HTML) ·
`tone(x)` · `cellClass` · `exportValue(x)` (aşağı bak).

**Her fabrika `exportValue`'yu kendisi kurar** — şartname [14.4.1]: ekranda
görünen değer dosyaya da girer. Elle `exportValue` yazman gerekmez; yazarsan
fabrikanınkini ezersin, yalnız gerçekten farklı bir değer gerekiyorsa yaz.

**Hizalama artık fabrikadan gelir** ([14.2.5] · [14.2.6]): para ve sayı sağa,
**tarih ve durum ortaya**. Ölçülen kusur şuydu: 7 sayfanın hiçbirinde tarih ve
durum ortalanmıyordu (`cellClass:'center'` sayısı **sıfır**). Elle `cellClass`
verip bunu geri bozma.

### Tablo iskeleti — `GV.cols.tbl` ve boş durum

```js
GV.cols.tbl({ key, pageSize, exportName, exportTitle, search, defaultSort,
              defaultDir, tabs, columns, mobile, emptyState })
GV.cols.bos(baslik, aciklama, ikon)     // emptyState nesnesi
```

---

## 2. Nasıl göç edilir

1. Dosyanın prelude'ünde **yerel olarak tanımlanmış** yardımcıları bul
   (`function colMoney` · `function mny` · `function tbl` …).
2. Her birinin gövdesini ortak API'ninkiyle **karşılaştır**. Birebir aynıysa
   yerel tanımı sil, çağrıları `GV.cols.*` / `GV.cell.*`'a çevir.
3. **Farklıysa silme.** Sayfaya özgü bir davranış olabilir (ek eşik, farklı
   ton kuralı, ekstra alt satır). O zaman: yerel yardımcıyı **koru**, adını
   sayfaya özgü bir adla bırak ve **raporunda farkı yaz**. Sessizce ortak
   API'ye çevirip davranışı değiştirmek, tek bir sayıyı bozar ve fark edilmez.
4. `sum` · `uniq` · `topN` · `pct` · `cus` · `pName` · `ayEt` gibi **veri**
   yardımcıları sayfaya aittir; onlara dokunma.

⚠️ **Değişmemesi gereken:** rapor sayısı, KPI değerleri, satır sayıları,
grafik verisi, filtre davranışı. Göç yalnız **nasıl çizildiğini** değiştirir.

---

## 3. Bitirmeden önce kendi işini ölç

Repo kökünde, **yalnız bunlar** (tarayıcı açma, başka QA script'i koşturma):

```bash
node tasks/qa/html-js.js        # senin dosyandaki inline script ayrışıyor mu (L-37)
node tasks/qa/dbref.js          # okuduğun her DB koleksiyonu sayfada yüklü mü (L-12)
```

İkisi de **TEMİZ** dönmeli.

Ayrıca **kendi göçünü sayıyla doğrula**: göçten önce ve sonra sayfadaki
`function col` / `function mny` / `function tbl` tanımlarını say ve satır
sayısını ölç. "Sildim" demek yetmez, kaç satır silindiği yazılır (L-05).

---

## 4. Raporun

1. **Dosya · satır sayısı** (önce → sonra · silinen net satır).
2. **Silinen yerel yardımcılar** — ad listesi.
3. **KORUNAN yerel yardımcılar** — ad + ortak API'den **hangi noktada
   ayrıldığı**. Bu en önemli maddedir; sessiz davranış değişikliği burada
   yakalanır.
4. **Hizalama** — kaç tarih ve kaç durum kolonu artık ortalanıyor.
5. **İki ölçüm çıktısı** (`html-js.js` · `dbref.js`) — kopyala yapıştır.
6. **Bildirdiklerin** — ortak API'de eksik gördüğün fabrika · veri çelişkisi ·
   bu sayfada gördüğün ama **dokunmadığın** kusur.

Ölçmediğin bir şeye "çalışıyor" deme. Yarım kalan işi bitmiş gösterme.

---

## 5. Bilinmesi gereken iki ad tuzağı

- **`GV.fmt` başka bir şeydir.** Zaten var ve *biçimlendirmedir*
  (`GV.fmt.date` · `GV.fmt.money` · `GV.fmt.num` — ham değeri metne çevirir).
  HTML üreten hücre yardımcıları **`GV.cell`** altındadır. Sayfalar bu ikisini
  çoğu zaman `F` ve yerel `mny` diye ayırmıştı; göçte karıştırma.
- **`GV.cols.tbl` `GV.list` yapılandırması döndürür**, tablo çizmez. Çizen
  yine `GV.report`'un içindeki `GV.list`'tir.
