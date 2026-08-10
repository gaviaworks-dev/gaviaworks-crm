# Handoff — Prototip Kapsamı turu sonrası

**Dal:** `main` · **Çalışma ağacı:** temiz · **Canlı:** `https://gaviaworks-dev.github.io/gaviaworks-crm/`
**Kapanış raporu:** `docs/R-prototip-kapsami-kapanis.md`

> **"Cloud" adı bir deşifre hatasıdır.** Ses kaydında **"Claude"** denmiş, metne "Cloud" geçmiş. Kapsam bulut altyapısı değil **üretime hazırlıktır**. Dosya adları bilerek değiştirilmedi; ayrıntı `tasks/cloud-talimati.md` başındaki nottadır.

---

## 0. İlk 10 dakika

```bash
cat docs/R-prototip-kapsami-kapanis.md   # bu turun kapanışı — en hızlı özet
cat tasks/cloud-plan.md                   # canlı durum tablosu (paket paket)

python3 -m http.server 8791 --bind 127.0.0.1 &   # tarayıcı taramaları buna bağlı
```

**Tarama seti — 24 eksen, hepsi TEMİZ.** Tek tek koşulur, koşarken repo değişmez:

```
flow canon dep dbref aftersave html-js bag akt ctl links swtest
xport reg notes-isolation qa esc mut listen tabs gate act pers portal formtab
```

Öz sınaması olan eksenler: `flow --selftest` · `aftersave --selftest` ·
`html-js --selftest`. `formtab` · `xport` · `reg` · `notes-isolation` için
`GV_BASE` + `GV_REPO` ile bozulmuş kopya koşumu yapılır (yöntem kapanış §4).

**Oturum kurmak için** (tarayıcı testlerinde şart):
```js
sessionStorage.setItem('gv.session', JSON.stringify({ rol:'sahip', emp:'EMP-001' }))
```
⚠️ Alan adı **`rol`**, `role` değil.

---

## 1. Ortak katmanın yüzeyi

`assets/js/domain.js` ve `assets/js/ui.js`, 148 sayfada yüklü.

```
GV.flow      gec · adimlar · kural · kayit · denetle          (15 varlık)
GV.gates     projeAktif · projeTeslim · projeKapanis · sozlesmeAktif ·
             teklifOnAnaliz · teslimKritikHata · izinBakiye · destekKota ·
             personelEvrak · personelZimmet                   ← BU TUR +2
GV.approval  karar · adim · zincir · bekleyen · tazeleSayaclar
GV.fin       tahsilEt · tahsisEt · balance · odemeDurum · gecikti · durumTazele
GV.calendar  isGunu · mesaiDakika · gecenDakika · beklemeBaslat · beklemeBitir
GV.hr        icMaliyet(kod,tarih) · kayitOrani
GV.destek    paketOf · kotaDusum · kapaliDurumlar
GV.audit     yaz · oku · denetle
GV.action    ortak eylem penceresi
GV.form      ({mount,sections,tabs,aside}) — sekme + sağ panel + readonly
GV.sales     mukerrer · musteriUret · kazanildi               ← BU TUR
GV.notes     benim · bul · gorunum · olustur · guncelle · madde ·
             maddeEkle · sil · geriAl · ara · sahip           ← BU TUR
GV.test      sayac · kosumlar · sonuclar · hataBaglami ·
             hatasizBasarisiz · senaryolar · adimlar          ← BU TUR
GV.afterSave kayıt sonrası yönlendirme ([3.1.16])             ← BU TUR
GV.cell      mny · num · sub · faint · gun · oran · link · mrow  ← BU TUR
GV.cols      money · num · pct · date · durum · kisi · kod · tbl · bos ← BU TUR
GV.htmlText  HTML → düz metin (çıktı katmanının tabanı)       ← BU TUR
```

**Veri:** `assets/data/notes.js` (kişisel, ayrı dosya — ADR-21) ·
`assets/data/reports.js` (105 rapor kaydı, **üretilir**) ·
`DB.formulaVersion` (org.js) · test varlıkları (work.js) ·
`DB.flowEntities.employee` + `DB.transitions.employee` (org.js).

---

## 2. Bu turda öğrenilen iki şey

**L-40 — bir kural N dosyada yaşıyorsa ortak katmana aittir.** Karar tek
yordamda toplanır; çağıran **veri** verir, **hüküm** vermez.

**L-41 — bir CSS sınıfı tek bileşenin mülkü değildir.** Ölçüm ekseni kapsamını
bileşenin kök düğümüyle sınırlar, sınıf adıyla değil.

Ayrıca: bu tur ürün kadar **ölçüm katmanında** kusur çıkardı (kapanış §4). Yeni
bir eksen yazarken ya da mevcut birini değiştirirken **bozulmuş kopyada bulgu
ürettiğini kanıtlamadan koşturma** (L-39).

---

## 3. Sıradaki iş — ölçülmüş, tahmin değil

### Öncelik 1 — yarım kalan üç madde
1. **Teklif sürümleme** (P3-01'in üçüncüsü): revizyon **yeni kayıt** üretmeli,
   eski sürüm kilitlenmeli, fark karşılaştırılabilmeli. Bugün
   `app-teklif-detay.html` aynı kaydı yerinde değiştirip sayacı artırıyor ve
   bunu ekranda itiraf ediyor. `GV.sales` deseni örnek alınabilir.
2. **İK ekran tarafı** (P3-06): veri ve iki kapı hazır, ama `durum` alanı
   **hiçbir ekranda okunmuyor** ve `aktif` boolean'ı paralel duruyor.
   `app-personel-form.html` · `app-personel-detay.html` · `app-personel.html`
   duruma geçirilmeli; sonra `aktif` kaldırılır.
   Ayrıca: şablondan onboarding süreci doğuran yordam yok (`DB.onboardingTemplates`
   veri olarak hazır, bileşim kuralı `hr.js` yorumunda tarif edilmiş).
3. **Zimmet kabulü çelişkisi** ([20.4.4]): `app-zimmet-form.html` envanteri
   tutanak **kaydedilirken** güncelliyor (`personelOnay`a bakmıyor);
   `app-zimmet.html` "Dijital onay" ise envantere **hiç dokunmuyor** ve
   onaylayanın o personel olduğunu doğrulamıyor.

### Öncelik 2 — kurulmuş ama beslenmemiş model
4. **Test verisi**: model tam (9 varlık), veri kısmi — 1 plan, 1 koşum,
   5 senaryo. Yeni koşumlar `senaryoDetayi` olmadan yazılırsa sayaç türetilir.
   ⚠️ Eski beş kaydın senaryosu **uydurulmadı ve uydurulmamalı** (L-13).

### Öncelik 3 — hiç başlanmamış prototip payı
5. P1-08 entegrasyon hata kuyruğu **ekranı** (koleksiyon boş ve bilerek boş).
6. P3-02 milestone/sprint ekranları · P3-04 tedarikçi faturası + RFQ
   normalizasyonu · P3-07 bilgi bankası.

### Dokunulmayacak
**Backend gerektiren 164 madde** — ayrı ürün kararı. Bunların içinde
**Notlarım gerçek izolasyonu** ve **gerçek XLSX/PDF** var; ikisi de kapanış
raporunda açıkça kısmi yazıldı.

---

## 4. Kurallar — ihlal etme

- **`git add -A` yasak.** Dosyalar tek tek isimle stage edilir.
- **Ajan işi commit edilmemişken `git checkout` atma** (L-39 turu).
- **Yorumda `*` + `/` yan yana yazma** (L-37) — blok yorumu kapanır, sayfa çöker.
  Aynısı **JS şablon dizesi** içinde ters tırnak için geçerli (`xport.js` yorumu).
- **Şablon dizesi içinde ters bölü ÇİFT yazılır** — tek yazılırsa Node kaçışı
  yer ve tarayıcıya bozuk desen gider (`xport.js`'te harf sildi).
- **Veri dosyasında koleksiyon sınırını satır aralığıyla bul** (L-38), parantez
  sayma. Sonra koleksiyon başına sayıyı **yeniden ölç**.
- **Yeni ölçüm ekseni bozuk kopyada sınanmadan koşmaz** (L-39).
- **Uydurma yok.** Karşılığı olmayan veri "yok" diye yazılır; ölçülemeyen
  kontrol "geçti" sayılmaz; sıfır ölçüm temiz değildir.
- **Ajana önce brief okut.** Hazır briefler: `tasks/form-brief.md` ·
  `tasks/detay-brief.md` · `tasks/brief-p2-form-gocu.md` ·
  `tasks/brief-p4-rapor-gocu.md`. Yoksa önce yaz — ortak katmanı ajana
  keşfettirmek ajan başına ~300k token demek.
- **Dalga tavanı dört ajan** (L-20).

---

## 5. Yasin Bey'in teyidini bekleyen kararlar

`tasks/cloud-kararlar.md` içinde 🔸 ile işaretli **beş** karar duruyor
(ADR-06 · 08 · 11 · 16 ve dolaylı olarak 02). Bu turda eklenen dört karar
(ADR-18 · 19 · 20 · 21) teyit beklemiyor ama geri alınabilir.
