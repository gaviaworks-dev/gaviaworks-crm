# form-brief.md — Form Ekranı Sözleşmesi

> Bu dosya **her form ekranı ajanının ilk okuduğu şeydir**. Prompt'ta yalnız ekrana özel
> kapsam verilir; buradaki hiçbir kural prompt'ta tekrarlanmaz.
> Kardeşi: `tasks/detay-brief.md` (detay ekranları için).

---

## 0. Sen kimsin, neye dokunursun

**Tek bir HTML dosyası yazarsın. Başka hiçbir dosyaya dokunmazsın.**

- `assets/**` (css, js, data) · `tasks/**` · `shell.js` `BUILT` dizisi → **orkestratörün**.
- **Commit atmazsın**, `git` çalıştırmazsın.
- Eksik bir ortak bileşene ihtiyaç duyarsan **kendin yazmazsın** — raporunda bildirirsin.
  Sayfaya özel `<style>` bloğu **yasaktır** (components.md §8).
- Ekranını QA'den geçirmen beklenmez; orkestratör koşar. Ama konsolu temiz bırakırsın.

---

## 1. İskelet — birebir bu

```html
<!doctype html>
<html lang="tr">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Yeni Müşteri Adayı — GaviaWorks CRM</title>
<link rel="stylesheet" href="assets/css/tokens.css">
<link rel="stylesheet" href="assets/css/shell.css">
<link rel="stylesheet" href="assets/css/ui.css">
</head>
<body data-sec="satis" data-screen="lead">
<div id="rec"></div>

<script src="assets/data/org.js"></script>
<script src="assets/data/crm.js"></script>   <!-- okuduğun HER koleksiyonun dosyası (ders L-12) -->
<script src="assets/js/shell.js"></script>
<script src="assets/js/ui.js"></script>
<script>
document.addEventListener('gv:ready', function(){
  /* ... */
});
</script>
</body>
</html>
```

`data-sec` değerleri: `panel · satis · musteri · proje · gorev · destek · sohbet · personel ·
varlik · satinalma · finans · dokuman · toplanti · rapor · ayarlar`
(**`proje`**, `projeler` değil — bu üç ajanı birden yanıltmıştı.)

`data-screen` = formun **döndüğü liste ekranının** `screen` anahtarıdır. Menüde form için
ayrı kayıt yoktur; form açıkken sol menüde kaynak liste vurgulu kalır.

**`gv:ready` yalnız yetki kapısı açıkken tetiklenir** (ders L-07) — kapı kapalıysa
`gv:denied` gider ve senin kodun hiç çalışmaz. Bu yüzden `gv:ready` içinde mount düğümünün
var olduğunu varsayabilirsin.

---

## 2. İki mod: yeni kayıt ve düzenleme — adres parametresinden

```js
var qs   = new URLSearchParams(location.search);
var id   = qs.get('id');                       // varsa düzenleme, yoksa yeni kayıt
var kayit = id ? DB.leads.filter(function(x){ return x.kod === id; })[0] : null;
var duzenle = !!kayit;

/* Adreste id var ama kayıt yoksa: uydurma, boş forma da düşme. */
if(id && !kayit){
  document.getElementById('rec').innerHTML = GV.empty({
    icon:'i-search', title:'Kayıt bulunamadı',
    desc:id + ' kodlu müşteri adayı bulunamadı. Bağlantı eski olabilir.',
    action:'<a class="btn btn-acc" href="app-lead.html">Müşteri adayları listesine dön</a>' });
  return;
}
```

Başlık, buton yazısı ve breadcrumb **moda göre** değişir:

```js
GV.pageHead({
  eyebrow:'Satış ve CRM',
  title: duzenle ? kayit.kod + ' · Düzenle' : 'Yeni Müşteri Adayı',
  sub:   duzenle ? 'Kayıt üzerinde yapılan değişiklikler aktivite geçmişine yazılır.'
                 : 'Zorunlu alanlar yıldızla işaretlidir.',
  actions:[
    { label:'Vazgeç', cls:'btn-line', href:'app-lead.html' },
    { label: duzenle ? 'Değişiklikleri kaydet' : 'Kaydet', cls:'btn-acc', icon:'i-check', run:kaydet }
  ]
});
```

---

## 3. Yetki kapısı — form açılmadan önce

Yalnız menüyü gizlemek yetmez, **sayfa seviyesinde 403** basılır (PROMPT.md §5, ders L-07).

```js
var can = duzenle ? GV.perm.can('duzenle') : GV.perm.can('ekle');
if(!can){
  document.getElementById('rec').innerHTML = GV.errorState({
    title:'Bu işlem için yetkiniz yok',
    desc:(duzenle ? 'Kayıt düzenleme' : 'Kayıt ekleme') + ' yetkisi rolünüzde tanımlı değil. ' +
         'Kaydı görüntüleyebilir ama değiştiremezsiniz.' });
  return;                                 // GV.form HİÇ kurulmaz — boş form gösterilmez
}
```

Finans / maaş gibi **alan bazlı** kısıtlar da forma yansır: yetkisi olmayan role o alan
**hiç basılmaz** (devre dışı bırakılmaz — ölü kontrol bırakmak yasak).

```js
var canFinans = GV.perm.can('finans');
fields: [ /* ... */ ].concat(canFinans ? [{ key:'butce', label:'Tahmini bütçe (KDV hariç)', type:'money' }] : [])
```

---

## 4. `GV.form` — yeni markup icat etme

Sözleşmenin tamamı **`tasks/components.md` §4**'te. Özet:

```js
var form = GV.form({
  mount:'#formMount',
  id:'lead',                       // beforeunload anahtarı
  record: kayit || {},             // boş = yeni kayıt
  sections:[
    { title:'Kimlik', desc:'Adayın temel bilgileri.', fields:[
      { key:'firma', label:'Firma adı', type:'text', required:true, cols:6 },
      { key:'sektor', label:'Sektör', type:'select', options:DB.sectors, required:true, cols:6 },
      { key:'email', label:'E-posta', type:'email', cols:6 },
      { key:'butce', label:'Tahmini bütçe (KDV hariç)', type:'money', cols:6 },
      { key:'bitis', label:'Kapanış tahmini', type:'date', cols:6,
        validate:function(v, d){ return v && d.baslangic && v < d.baslangic
          ? 'Kapanış tarihi başlangıçtan önce olamaz.' : ''; } }
    ]}
  ]
});
```

**Çalışan tipler:** `text · textarea · select · radio · checkbox · switch · file · money ·
percent · date · number · email · tel · url`.
Tanımsız tip **sessizce `text` olur** — `multiselect`, `daterange`, `tags`, `user`,
`customer`, `project`, `richtext` **yoktur.** Çoklu seçim gerekiyorsa `checkbox` grubu ya da
`select` + çip listesi kurar, **eksik bileşeni raporlarsın**.

**Bileşen kaydet butonu basmaz.** Butonu sen `GV.pageHead` aksiyonlarına koyarsın.
`onSubmit` / `submitLabel` diye seçenek **yoktur**.

Para alanının hangi eksende olduğu **etikette yazılır**: "(KDV hariç)" / "(KDV dahil)".
Eksen listesi components.md §9b'de; uydurma, oradan bak.

---

## 5. Kaydet — mutasyon kuralları

```js
function kaydet(){
  var v = form.submit();          // null dönerse hata var; toast + odak bileşende halledildi
  if(!v) return;

  if(duzenle){
    /* Aktivite kaydı DEĞİŞEN alanlar için yazılır — eski → yeni değer (PROMPT.md §28). */
    Object.keys(v).forEach(function(k){
      if(String(kayit[k] == null ? '' : kayit[k]) === String(v[k])) return;
      DB.activities.unshift({ kayit:kayit.kod, tarih:simdi(), kisi:GV.session.ad,
        metin:'Alan güncellendi: ' + k, eski:kayit[k], yeni:v[k], tone:'accent', icon:'i-edit' });
      kayit[k] = v[k];
    });
    GV.toast(kayit.kod + ' güncellendi', 'ok');
  }else{
    var kod = yeniKod();                       // aşağıdaki kural
    DB.leads.unshift(Object.assign({ kod:kod, aktif:true }, v));
    DB.activities.unshift({ kayit:kod, tarih:simdi(), kisi:GV.session.ad,
      metin:'Kayıt oluşturuldu', eski:null, yeni:kod, tone:'ok', icon:'i-plus' });
    GV.toast(kod + ' oluşturuldu', 'ok');
  }
  form.setDirty(false);
  setTimeout(function(){ location.href = 'app-lead.html'; }, 700);   // listeye dön
}
```

### Beş sert kural

1. **`location.reload()` YASAK** (ders L-15). Mock veri bellektedir; reload script'leri
   baştan koşar ve mutasyonu **siler**. Aynı sayfada kalıp yeniden çizmen gerekiyorsa
   `GV.refresh()` kullan. Formda normal akış **listeye dönmektir**, o zaten yeni bir
   sayfa yüklemesidir ve veri o yüklemede sıfırlanır — prototipte beklenen davranış budur.
2. **Yeni kod dizi uzunluğundan üretilmez.** En yüksek mevcut numaradan +1:
   ```js
   function yeniKod(){
     var max = 0;
     DB.leads.forEach(function(x){ var m = /^LEAD-\d{4}-(\d+)$/.exec(x.kod || ''); if(m) max = Math.max(max, +m[1]); });
     return 'LEAD-' + String(DB.today).slice(0,4) + '-' + (max + 1);
   }
   ```
3. **Tarih `DB.today`'den gelir**, `new Date()` ile bugün alınmaz:
   `function simdi(){ return DB.today + 'T' + new Date().toTimeString().slice(0,5); }`
4. **Bağ alanı yazılır, türetilmez** (ders L-13). Form bir bağ kuruyorsa (destek→görev,
   sipariş→demirbaş, hata→sprint…) alan adı **components.md §9d**'deki sözleşmeden alınır.
   Bağın belirsiz olduğu yerde alan **boş bırakılır**, tahmin yazılmaz.
5. **Toast "işlem oldu" demez.** Kaydettiğin nesnenin gerçekten koleksiyona girdiğinden emin ol.

---

## 6. Dinleyiciler — ders L-16

`document` ya da `window` gibi **kalıcı** düğüme dinleyici bağlıyorsan **`GV.on`** kullan:

```js
GV.on(document, 'click', function(e){ /* ... */ }, 'leadform.click');
```

Aynı düğümde birden çok dinleyicin varsa **her birine ayrı anahtar** ver, yoksa birbirlerini
sökerler. `#rec` mount'unun **içindeki** düğümlere normal `addEventListener` yeterlidir —
`GV.refresh()` mount'u taze kopyayla değiştirir, o dinleyiciler kendiliğinden düşer.

---

## 7. Etiket ve escape — ders L-14

Değer tarafı **escape'li** basılır, sabit etiket işaretlemesi **escape edilmez**:

```js
function esc(s){ return String(s == null ? '' : s).replace(/[&<>"]/g, function(c){
  return ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;' })[c]; }); }
```

`GV.form` etiketleri **kendisi escape eder**, bu yüzden `label` alanına HTML koyma —
"(KDV hariç)" gibi eksen işaretini düz metin olarak yaz.

---

## 8. Zorunlu ek bölümler

Form ekranı yalnız alan listesi değildir. Şunlar da bulunur:

- **Bağlam kartı** — düzenleme modunda kaydın özeti (`.gv-summary` ya da `GV.dl` yoksa
  `.gv-dl` markup'ı): kod, durum, oluşturma tarihi, son değiştiren.
- **İlişkili kayıt uyarısı** — kayıt başka kayıtlara bağlıysa `GV.notice` ile bildir
  (örn. "Bu müşterinin 3 açık projesi var; pasife alınırsa projeler etkilenir").
- **Aktivite geçmişi** — düzenleme modunda `GV.activity(DB.activities.filter(...))`.
  Kayıt için hareket yoksa `GV.activity` zaten boş durumu basar.
- **Yeni kayıt modunda** bu üçü **yoktur**; yerine kısa bir `GV.notice` ile ne olacağı yazılır.

---

## 9. Responsive

`GV.form` ızgarası `cols` ile kurulur (12'lik). ≤760px'te tek kolona düşer — **sen ayrıca
media query yazmazsın**. Uzun form bölümleri `sections` ile ayrılır, tek dev blok yapılmaz.

Ekran 1440 / 768 / 390 px'te **yatay taşma yapmamalıdır**. `.gv-tablewrap` kullanıyorsan
≤760px'te gizlendiğini bil (UID-14) — form ekranında tablo kurmaktan kaçın.

---

## 10. Raporun — ne yazacaksın

Bitirince kısa ve **ölçülmüş** bir rapor döndür:

1. Dosya adı ve satır sayısı.
2. Kaç bölüm, kaç alan; hangileri zorunlu.
3. Hangi `DB.<koleksiyon>`'ları okudun ve hangi veri dosyalarını yükledin (L-12 kontrolü).
4. Yetki kapısı hangi izinle kuruldu; hangi alanlar yetkiye bağlı gizlendi.
5. **Eksik bileşen** — `ui.js`/`ui.css`'te olmadığı için idare etmek zorunda kaldığın her şey.
6. **Veri çelişkisi** — alan doldururken fark ettiğin canonical tutarsızlık.
   Bunları **düzeltme**, bildir. (Geçen oturumda bu yolla altı gerçek ortak katman hatası
   ve sekiz veri ekseni bulundu — raporun ciddiye alınıyor.)
7. Ölçmediğin bir şeyi "çalışıyor" diye yazma (ders L-05).
