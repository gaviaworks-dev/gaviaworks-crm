# Revize Planı — Gavia CRM Arayüz ve Sistem Revize Turu

> **Bu defter `plan.md` DEĞİLDİR.** `plan.md` 295/295 ile kapandı ve o dürüstlük
> bozulmaz — bu tur kendi defterinde yürür.
> Tek doğruluk kaynağı: [`tasks/revize-talimati.md`](revize-talimati.md).
> Tur başlangıcı: **2026-08-07**, 13. oturum.

## İlerleme — mekanik ölçüm

İlerleme **başlıktaki damgadan değil, alt madde kutularından** okunur:

```bash
echo "$(grep -c '^- \[x\]' tasks/revize-plan.md) / $(grep -c '^- \[[ x]\]' tasks/revize-plan.md)"
```

| Ölçüm | Değer |
|---|---|
| Alt madde | **138** |
| İşaretli | **41** — R01 8/8 · R02 7/7 + kuyruk 2/2 · R03 8/8 · R04 9/9 · **R05 7/7** |
| Kalan | 97 (FAZ 2'nin kalanı · FAZ 3 · 4) |

> Kutu **yapılan iş doğrulanarak** işaretlenir, hatırlanarak değil. Bir alt madde
> bitince **aynı turn içinde** işaretlenir — sonraki oturuma bırakılmaz.
> `plan.md`'nin 295/295 defteri bu disiplinle tutulmuştu.

---

## 0. Turun kuralları

Talimatın sert sınırları (pazarlık dışı):

- Tasarım baştan kurulmaz. Sidebar · renk · tipografi · komponent dili değişmez.
- Yeni ana menü açılmaz. Geliştirme **mevcut detay sayfası, tab, kart, dropdown,
  filtre ve aksiyon butonu** üzerinden yapılır.
- Backend mimarisi / API tasarımı yapılmaz.
- Çalışan mevcut modül **kaldırılmaz**.
- Aynı özellik iki yerde yeniden kurulmaz.
- Gereksiz form alanı eklenmez, kullanıcı fazla tıklamaya zorlanmaz.

Bu turun kendi çalışma kuralları:

- **Ölçmeden yazılmaz.** Her madde `DURUM` satırıyla açılır: ✅ var · 🟡 kısmen ·
  ⬜ yok — ve rakamla desteklenir.
- **Ortak katmanda kök nedenden çözüm** (`ui.js` · `shell.js` · `domain.js` ·
  `ui.css` · `tokens.css`). Nokta yaması yasak.
- **Türetilebilen değer saklanmaz** (L-08). Türetilen tutar **yazılı sözleşme
  ister** (VB-19 dersi) — sözleşme `components.md`'ye, tarama ekseni
  `tasks/qa/canon.js`'e yazılır.
- **Olmayan veri uydurulmaz** (L-13). Üretilen her kayıt **var olan gerçek bir
  kayıttan türetilir** ve kaynağı `aciklama` alanında yazılır.
- Aynı anda en fazla **dört ajan** (L-20). Ajan tek ekran yazar, commit atmaz;
  ortak katman lead'indir.
- Ayrı concern = ayrı commit. Staged dosya doğrulanır, push edilir.
- **Alt madde bitince aynı turn içinde işaretlenir.** İlerleme damgadan değil
  kutudan okunur (yukarıdaki grep). Damga (`✅`/`🟡`) yalnız kutuların özetidir;
  ikisi çeliştiğinde **kutu doğrudur**.

### Turun başındaki ölçüm tabanı

| | |
|---|---|
| `canon.js` | **TEMİZ — 2.588 kontrol**, 24 eksen (2026-08-07 koşumu) |
| Ekran | 142 |
| Koleksiyon | 84 dizi + skaler sözlükler |

> ⚠️ **`docs/G-veri-modeli.md` BAYAT.** Tek commit'te (`0c06702`) yazıldı ve
> sonra veri büyüdü. Doküman `projects n=8` · `tasks n=25` · `activities n=8`
> diyor; **gerçek** sayılar `projects=14` · `tasks=26` · `activities=192` ·
> `changeRequests=5` · `checklists=29`. **Bu turda ölçüm kaynağı canlı veridir,
> doküman değildir.** (→ L-30 adayı)

### Ölçüm tablosu — 20 maddenin bugünkü durumu

| # | Revize | Faz | Durum | Tek cümlelik ölçüm |
|---|---|---|---|---|
| R01 | Görev durumlarını sadeleştir | 1 | **✅ TAMAM** | sözlük 19 → 10; bekleme ayrı eksene çıktı; canon eksen 25 |
| R02 | Görev geçiş algoritması | 1 | **✅ TAMAM** | tablo artık uygulanıyor; dropdown yerine aksiyon butonu; `GV.task` tek mutasyon noktası |
| R03 | Timesheet → gerçekleşen süre | 1 | **✅ TAMAM** | `harcananSure` kaldırıldı; defter 53 → 131 satır (modül ilerlemesinden türetildi); canon eksen 26 + 27 |
| R04 | Timesheet + gider → gerçek maliyet | 1 | **✅ TAMAM** | `gerceklesenMaliyet` kaldırıldı; dört kalem `GV.proje.maliyet`'te türetiliyor; canon eksen 28 |
| R05 | Proje durumu / faz ayrımı | 2 | **✅ TAMAM** | sözlük 5 → 7 · faz sözlüğünden `Tamamlandı` çıktı · 12 kayıt taşındı · canon eksen 29 |
| R06 | Milestone / ödeme ayrımı | 2 | ⬜ | tek koleksiyon (`DB.milestones`), 10 alanın 4'ü ödeme; `sorumlu`/`aciklama`/`teslimat` yok |
| R07 | Proje kapanış kontrolü | 2 | ⬜ | kapanış aksiyonu yok; ekran **hiç mutasyon yapmıyor**; 8 kontrolün 5'i ölçülebilir |
| R08 | Proje → bakım geçişi | 2 | ⬜ | proje ↔ paket bağı **iki yönde de yok**; hiçbir projenin paketi yok |
| R09 | Ticket detayları | 2 | 🟡 | 12 alanın **7'si yok**; durum sözlüğü hiçbir `DB.*`'da tanımlı değil, 3 yerde elle yazılı |
| R10 | Ticket → görev / CR / fırsat | 2 | 🟡 | görev dönüşümü **çalışıyor**; CR bağı var ama aksiyon yok; fırsat hiç yok |
| R11 | Proje kaynağı | 3 | 🟡 | `944a594` sözleşmeden proje başlatmayı kurmuş; `kaynak` alanı ve sözleşme seçici yok |
| R12 | Sözleşme sorumlusu | 3 | ⬜ | sözleşmede **hiç kişi alanı yok**; ekran bunu bir notice ile itiraf ediyor |
| R13 | Müşteri portalı | 3 | 🔴 | oturumda müşteri kimliği yok → `EMP-001`'e düşüyor; **6 ölçülmüş sızıntı** |
| R14 | Pipeline gruplama | 4 | 🟡 | 13 kanban kolonunun **5'i boş**; `sira` bölüntüsü kalıbı aynı dosyada zaten var |
| R15 | Departman ve uzmanlık | 4 | ⬜ | 16 personel için **21 departman**; 7'si boş, 5'i uzmanlık, 2'si çalışma tipi |
| R16 | Freelancer çalışma tipi | 4 | 🟡 | `calismaTuru` **mesai** ekseni; istihdam ilişkisi 4 alana dağılmış |
| R17 | Hizmet paketi / abonelik | 3 | 🟡 | 9 alanın 5'i tam; `tip`/`periyot`/`sorumlu` yok; abonelik kavramı repoda yok |
| R18 | Opsiyonel modüller | 4 | ⬜ | modül anahtarı yok; **ama gizleme mekaniği hazır** (11 madde `roles:` ile gizli) |
| R19 | Araç sayfaları | 4 | 🟢 | **yedi alanın yedisi zaten araç detayında tab**; iş yalnız menüde |
| R20 | Rapor gruplama | 4 | 🟡 | gruplama kategori sayfalarında **zaten var**; ihlal yalnız `app-rapor.html`'de (99 çip tek ekranda) |

**Özet:** 20 maddenin **6'sı hiç yok**, **13'ü kısmen var**, **1'i neredeyse hazır**.
Hiçbiri sıfırdan bir modül gerektirmiyor — talimatın *"yeni özellik eklemekten önce
mevcut özellikleri birbirine doğru bağla"* teşhisi ölçümle doğrulandı.

---

## 1. Üç gerilimin kararı

Talimat ile mevcut işin çeliştiği üç yer; kararlar burada, bir kez veriliyor.

### G-1 · REVİZE 18/19 "sadeleştir" ↔ "çalışan modülü kaldırma"

**Karar: ekran SİLİNMEZ.** Araç detayında tab yapısına toplanır; merkezî listeler
firma ayarlarındaki **Aktif Modüller** anahtarıyla *menüden gizlenir*. Dosya ve
veri yerinde kalır, doğrudan adresle erişilebilir olmayı sürdürür. Sadeleşen
şey **menü**dür, sistem değil.

### G-2 · REVİZE 13 müşteri portalı ↔ V2'ye bağlı parçalar

Kapanış turunda **V2-03** açılmıştı: *"`musteri` satır kapsamı uygulanamıyor —
`GV.session` personelden kuruluyor, müşteri kimliği oturumda yazılı değil"* ve
gerekçesi **"backend"** diye işaretlenmişti.

**Bu ölçüm bu turda kısmen yanlışlandı.** `GV.list` içindeki `afterScope()`
`musteri` kapsamını **zaten uyguluyor** (`assets/js/ui.js:600` — `k === 'musteri'
? me.musteri : null`). Eksik olan **iki şey**, ikisi de arayüz tarafında:

1. `DB.permMatrix.musteri.gor` bugün **`'kendi'`** (`org.js:112`) — yani
   `GV.perm.scope('gor')` hiçbir zaman `'musteri'` döndürmüyor ve ui.js:600'ün
   `musteri` dalı **ölü kod**. Doğru değer `'musteri'`.
2. `buildSession` (`shell.js:234`) yalnız `DB.employees`'ten kuruluyor; oturumda
   `musteri` alanı yok.

İkisi de veri + ortak katman düzeltmesidir, backend değil. `DB.contacts`
(14 müşteri yetkilisi) müşteri kimliğinin gerçek kaynağıdır. Dolayısıyla
**V2-03 bu turda kapatılabilir** ve R13'ün çekirdeği uydurma çözüm gerektirmez.

R13'ün gerçekten V2'ye bağlı kalan parçaları madde 13'te tek tek işaretlenir.

### G-3 · REVİZE 03/04 timesheet → maliyet zinciri `canon.js` eksenlerine dokunuyor

**Karar:** R03 ve R04'ün türettiği her değer için `canon.js`'e **yeni eksen**
eklenir (25 · 26 · 27), `components.md`'ye **yazılı sözleşme** girer. Türetme
`assets/js/domain.js`'te tek yordamda durur; ekran yalnız çağırır.

---

# FAZ 1 — KRİTİK

> **FAZ 1 KAPANDI — R01 ✅ · R02 ✅ (+ kuyruk) · R03 ✅ · R04 ✅ (2026-08-07).**
> Kapanışta `canon.js` **3.469 kontrol · TEMİZ** (turun başında 2.588 · 24 eksen
> → şimdi **28 eksen**). Yeni eksenler: **25** görev durumu/geçiş/bekleme ·
> **26** zaman defteri ↔ görev emeği · **27** proje süre zinciri ve tek onay
> ekseni · **28** proje maliyet zinciri. Dördü de kasıtlı bozulmuş bir kopyayla,
> olumlu **ve** birden çok olumsuz vakayla sınandı (L-24/L-27 gereği),
> scratchpad'de, repo dosyasına dokunmadan.
>
> Tarayıcı doğrulaması: **18 ekran × 4 rol = 72 yükleme, konsol hatası 0**;
> proje detayında 22 sekmenin tamamı tıklandı. Zaman defteri kapsamayan projede
> hiçbir ekranda `₺0` sızıntısı yok.

## R01 · Görev durum yapısını sadeleştir · ✅ TAMAM

**KAPANDI (2026-08-07)** — sözlük 19 → **10**; bekleme ayrı eksene çıktı.

Yapılanlar: `DB.taskStatuses` 10 değer · `DB.taskWaitReasons` (7) ·
`DB.tasks[].beklemeNedeni` + `beklemeNotu` · dört kayıt taşındı ve altı aktivite
kaydı yazıldı (V-42) · ton haritası sadeleşti, **başka modüllerin kullandığı üç ad
korundu** (`Taslak` teklif/satın alma · `Planlandı` taksit/sprint/teslim/eğitim ·
`Müşteri bekleniyor` destek talebi) · liste chip'leri, kanban kolonları, form,
rapor ve ayar ekranları yeni sözlüğe bağlandı · `shell.js` sayacı ve iki dashboard
sayacı düzeltildi — ikisi de **kaldırılan durumları saydığı için hep sıfırdı**.

Ölçüm izi (turun başındaki durum, kayıt olarak kalsın):

| | |
|---|---|
| Sözlük | 19 değer, **8'i hiçbir kayıtta geçmiyor** |
| Taşınan kayıt | 4 (`Kontrol bekliyor`→`Kontrolde` · `Revize bekliyor`→`Revizede` · `Kabul bekliyor`/`Planlandı`→`Atandı`) |
| `beklemeNedeni` | turun başında **yok** · şimdi 2/26 kayıtta dolu, ikisi de yazılı kanıttan türetildi |

<details><summary>Turun başındaki tam ölçüm</summary>

**DURUM (ölçüm anı): 🟡 kısmen — sözlük 19 değerli, veride 11'i geçiyor, `beklemeNedeni` alanı YOK**

Ölçüm (canlı veri, 2026-08-07):

| | |
|---|---|
| `DB.taskStatuses` | **19 değer** (`assets/data/work.js:10`) |
| Veride geçen | **11 değer / 26 görev** |
| Dağılım | Devam ediyor 11 · Havuzda 3 · Tamamlandı 3 · Atandı 2 · Kontrol bekliyor 1 · Engellendi 1 · Revize bekliyor 1 · Onay bekliyor 1 · Kabul bekliyor 1 · Planlandı 1 · Arşivlendi 1 |
| Bekleme durumları | `Bilgi bekliyor` · `Müşteri bekleniyor` · `Departman bekleniyor` sözlükte **var**, veride **0/26 kayıtta** |
| `beklemeNedeni` alanı | **yok** (grep: `bekleme` → 0 sonuç `DB.tasks` üzerinde) |
| Hedef sözlük | 7 ana + 3 ek = **10 değer** |

Sözlükten çıkacak 9 değer ve gerekçesi:

| Değer | Veride | Karar |
|---|---|---|
| `Taslak` | 0 | çıkar — kayıt yoksa durum da yok |
| `Atama bekliyor` | 0 | çıkar — `Havuzda` ile aynı şey |
| `Kabul bekliyor` | 1 | **`Atandı`ya taşı** — kayıt taşınır, veri kaybı yok |
| `Planlandı` | 1 | **`Atandı`ya taşı** |
| `Başlanmadı` | 0 | çıkar — `Atandı` ile aynı şey |
| `Bilgi bekliyor` | 0 | **`beklemeNedeni:'Bilgi'`e taşı** |
| `Müşteri bekleniyor` | 0 | **`beklemeNedeni:'Müşteri'`e taşı** |
| `Departman bekleniyor` | 0 | **`beklemeNedeni:'Departman'`e taşı** |
| `Revize bekliyor` | 1 | **`Revizede`ye taşı** — hedef sözlükte `Revizede` var |

**Yapılacaklar**

- [x] `DB.taskStatuses` → 10 değer: `Havuzda · Atandı · Devam ediyor · Kontrolde ·
      Revizede · Onay bekliyor · Tamamlandı · Engellendi · İptal edildi · Arşivlendi`
- [x] `DB.taskWaitReasons` sözlüğü aç: `Müşteri · Departman · Bilgi · Dosya ·
      Teknik Karar · Yönetici Onayı · Diğer`
- [x] `DB.tasks[].beklemeNedeni` alanı (null'lanabilir) + `beklemeNotu`
- [x] Taşınan 3 kaydın durumu güncellensin, **aktivite kaydı yazılsın** (uydurma yok:
      taşıma gerçek bir işlem, `DB.activities`'e eski→yeni ile girer)
- [x] `Kontrol bekliyor` → `Kontrolde` yeniden adlandırma (1 kayıt + sözlük + tonlar)
- [x] `GV.badge` ton haritasında yeni sözlüğün karşılığı olsun, kalkan değerler çıksın
- [x] Liste ekranı **tasarımı değişmez**; sekme ve süzgeç kümesi yeni sözlükten beslenir
- [x] Görev detayı ve listesinde bekleme nedeni **badge'in yanında ikincil çip** olarak
      görünsün (yeni satır/alan açılmaz)

**Dokunulacak dosyalar:** `assets/data/work.js` · `assets/js/ui.js` (ton haritası) ·
`app-gorev.html` · `app-gorev-detay.html` · `app-gorev-form.html`

</details>

---

## R02 · Görev geçişlerini kontrollü hale getir · ✅ TAMAM

**KAPANDI (2026-08-07)** — tablo artık **uygulanıyor**; dropdown kalktı.

Yapılanlar: `GV.task` (`domain.js`) — `transition` · `nextSteps` · `bekleme` ·
`arsivGeriAl` · `onayGerekli` · `yetkili` · `eksikAlanlar` · geçiş tablosu
10 duruma göre yeniden yazıldı, aksiyon etiketleri (`etiket`/`tone`/
`DB.taskActionLabels`) eklendi · görev detayında **dropdown yerine aksiyon
butonları**, yetkisiz adım gerekçesiyle pasif, eksik zorunlu alan küçük modalla
soruluyor · `btnOnayla`/`btnRevize`, liste satır aksiyonu, toplu arşiv, hata
detayı ve onay kuyruğu **hepsi tek yordamdan** geçiyor · form artık kural yoksa
**reddediyor** (eskiden sessizce geçiriyordu).

Yol boyunca çıkan ve kapatılan beş şey:

1. **`domain.js` bu ekranların hiçbirinde yüklü değildi** — `GV.task` `undefined`
   olurdu. 7 ekrana `<script>` eklendi. (L-12'nin ikizi: `GV.*` için de geçerli.)
2. **`ciktiLink`** zorunlu alanı hiçbir görevde yoktu — kural beş oturumdur
   uygulanamıyordu. → `teslimEdilenCikti`, ve **canon 25c** artık her zorunlu alan
   adının gerçek bir alan olmasını istiyor. (→ **L-31**)
3. **Onay adımı** için alan açılmadı; `onaylayan !== kontrolEden` diye türetildi
   (17 görevde aynı, 9'unda farklı — ayrım zaten verideydi, okunmuyordu). **V-43**
4. **GRV-2026-113** kendi durumuyla çelişiyordu (`Onay bekliyor` ama tek kişi);
   onaylayan gerçek bir kalıptan düzeltildi, **canon 25h** bunu kilitledi.
5. **Arşivden geri alma** geçiş tablosunun tersi DEĞİL: `Arşivlendi` bilerek son
   duraktır (iki durumdan gelinir, çıkış kenarı iptal edilmiş görevi tamamlanmış
   diye diriltirdi) ve ileri yordam gerçek bitiş tarihini ezerdi. Ayrı yordam
   aktivite kaydından okur, kayıt yoksa **yarım uygulamaz, reddeder**.

<details><summary>Turun başındaki tam ölçüm</summary>

**DURUM (ölçüm anı): 🟡 kısmen — geçiş tablosu VAR, uygulanmıyor; mutasyon ekranda, dropdown hâlâ orada**

Ölçüm:

| Bulgu | Yer |
|---|---|
| `DB.taskTransitions` **var** — 10 durum için `next` / `yetki` / `zorunlu` / `bildirim` | `assets/data/work.js:40` |
| Görev detayı geçişi **dropdown modalı** ile yapıyor | `app-gorev-detay.html:357-380` |
| `rule.yetki` yalnız **ipucu metni** olarak basılıyor — **uygulanmıyor** | `app-gorev-detay.html:365` |
| `rule.zorunlu` yalnız **ipucu metni** — **uygulanmıyor** | `app-gorev-detay.html:364` |
| `btnOnayla` doğrudan `durum='Tamamlandı'` yazıyor, geçiş tablosunu **atlıyor** | `app-gorev-detay.html:416` |
| `btnRevize` doğrudan `durum='Revize bekliyor'` yazıyor | `app-gorev-detay.html:425` |
| Mutasyon **ekranda** yazılı, `domain.js`'te değil | — |
| `taskTransitions` okuyan ekran sayısı | **2** (`app-gorev-detay` · `app-gorev-form`) |
| Zaman kaydı modalı hem timelog yazıyor hem `t.gercekSure`'ü artırıyor — **çift defter** (L-08) | `app-gorev-detay.html:404-406` |

Doküman **açıkça** diyor: *"Kullanıcıya uzun statü dropdownları göstererek süreci
karmaşıklaştırma."* Bugünkü tek geçiş yolu dropdown'dur.

**Yapılacaklar**

- [x] `GV.task.transition(kod, hedef, ctx)` — `assets/js/domain.js`'e yeni yordam.
      Geçiş tablosunu **uygular**: hedef `next` içinde değilse reddeder · `yetki`
      ilişkisini oturumdan doğrular (`sorumlu`/`kontrolEden`/`onaylayan`/`pm` **rol
      değil ilişki** anahtarlarıdır) · `zorunlu` alanları kontrol eder · aktivite yazar
- [x] `GV.task.nextSteps(gorev)` — o kayıt + o oturum için **yapılabilir** geçişlerin
      listesi. Aksiyon butonları buradan üretilir.
- [x] `DB.taskTransitions` yeni 10 değerli sözlüğe göre yeniden yazılsın; `Revizede`
      ve `Kontrolde` akışı dokümandaki gibi kurulsun:
      `Havuzda → Atandı → Devam ediyor → Kontrolde` · `Kontrolde → Revizede |
      Onay bekliyor | Tamamlandı` · `Revizede → Kontrolde`
- [x] Görev detayında **dropdown kalksın**, yerine mevcut buton diline uygun
      aksiyon butonları: `Çalışmaya Başla · Kontrole Gönder · Revizeye Gönder ·
      Onayla · Tamamla · İptal Et`
- [x] `btnOnayla` / `btnRevize` de aynı yordamdan geçsin — üç yol, tek mutasyon
- [x] Zaman kaydı modalı `t.gercekSure`'ü **artırmasın** (R03 onu türetiyor)
- [x] `components.md` §6b'ye `GV.task.*` sözleşmesi

**Dokunulacak dosyalar:** `assets/js/domain.js` · `assets/data/work.js` ·
`app-gorev-detay.html` · `app-gorev.html` (toplu işlem) · `tasks/components.md`

</details>

**Açık kalan iki küçük madde (R02'nin kuyruğu, FAZ 1 içinde kapanır):**

- [x] `app-gorev.html` toplu işlem `ata` ve `oncelik`'in `run`'ı yok. Sahte
      başarı basmıyorlar (UID-27 düzeltmesinden sonra `ui.js` `run`'sız toplu
      işlemi **pasif** basıyor), ama karar gerekiyor: `ata` havuzdaki görevde
      `Havuzda → Atandı` **geçişidir**, diğerlerinde düz alan yazımı — ikisini
      tek butona toplamak REVİZE 02'nin kapattığı ikinci mutasyon yolunu geri
      açardı. Ya `GV.task` üzerinden iki yolu ayıran bir toplu işlem yazılır ya
      da madde kaldırılır.
- [x] `app-ayar-arsiv.html` arşivden geri alma artık `GV.task.arsivGeriAl`
      yordamına bağlanabilir (ekran yazıldığında yordam henüz yoktu; ekran
      kendi türetmesini yapıyor ve **doğru davranıyor**, ama iki yerde iki
      türetme var — tek yordama indirilecek).

---

## R03 · Projede harcanan süreyi timesheet'ten otomatik getir · ✅ TAMAM

**KAPANDI (2026-08-07, 14. oturum)** — 8/8 alt madde · görev **ve** proje ucu.
`DB.projects[].harcananSure` kaldırıldı, üç değer `GV.proje.sure`'de türetiliyor;
zaman defteri 53 → **131 satır** (modül ilerlemesinden türetildi, kaynağı
`aciklama`'da yazılı); haftalık onay ile satır onayı **tek eksene** indi
(`GV.zaman.onayla/iade/onaylaKayit`). Türetilemeyen ~5.600 saat için tek bir
kayıt bile üretilmedi: `kapsam:false` dönen 7 projede ekran sıfır basmaz,
"defterde kayıt yok" der. Kilit: `canon.js` eksen **26** ve **27**.

<details><summary>Turun ortasındaki ara durum kaydı</summary>

**DURUM (ara kayıt): 🟡 hazırlığı yapıldı — görev düzeyi kapandı, proje düzeyi sıradaki iş**

> **2026-08-07'de yapılan hazırlık.** R03'ün asıl işi proje düzeyinde ama zincirin
> alt ucu (görev ↔ zaman defteri) önce düzeltildi, çünkü proje türetmesi onun
> üstüne kurulacak:
> - `DB.tasks[].gercekSure` **26/26 kayıtta** zaman defteriyle birebir eşitlendi
>   (öncesinde **16 kayıtta ayrışıyordu**). Defteri olmayan 8 görev için kayıt
>   görevin kendisinden türetildi, kaynağı `aciklama`'da yazılı — 61 saat, 8 kayıt,
>   uydurma yok. Defter 45 → **53 satır**.
> - `canon.js` **eksen 26** bu eşitliği ve üç değerin iç içeliğini
>   (`faturalanabilir ⊆ onaylı ⊆ tüm`) kilitledi; proje düzeyinde **eşitlik değil
>   `beyan ≥ defter`** diyor (V-44).
> - Görev detayında harcanan süre artık **defterden türetiliyor**; zaman kaydı
>   modalı `gercekSure`'ü **artırmıyor** (çift defter kalktı, L-08).
>
> **Sıradaki:** `GV.proje.sure()` · `GV.zaman.onayla()` (haftalık onay alttaki
> zaman kayıtlarını da onaylasın — bugün onaylamıyor) · proje kartındaki üç değer ·
> `harcananSure`'ün formdan kalkması.

</details>

<details><summary>Turun başındaki tam ölçüm</summary>

**DURUM (ölçüm anı): ⬜ yok — `harcananSure` elle yazılmış sayı, timesheet ile bağı YOK**

Ölçüm (canlı veri — 14 proje, 45 zaman kaydı):

| Proje | `harcananSure` (kayıtlı) | `tahminiSure` | Onaylı timelog | Tüm timelog | Billable (onaylı) |
|---|---:|---:|---:|---:|---:|
| PRJ-2026-001 | 1156 | 1240 | **37** | 112 | 37 |
| PRJ-2026-002 | 392 | 820 | **3** | 52 | 3 |
| PRJ-2026-003 | 1388 | 2100 | **8** | 38 | 8 |
| PRJ-2026-004 | 428 | 460 | **0** | 0 | 0 |
| PRJ-2026-005 | 224 | 600 | **5** | 17 | 5 |
| PRJ-2026-006 | 326 | 280 | **0** | 0 | 0 |
| PRJ-2026-007 | 26 | 420 | **0** | 3 | 0 |
| PRJ-2025-008 | 1352 | 1400 | **0** | 0 | 0 |
| PRJ-2024-011 | 962 | 940 | **0** | 0 | 0 |
| PRJ-2025-009 | 735 | 720 | **0** | 0 | 0 |
| PRJ-2025-010 | 889 | 820 | **0** | 0 | 0 |
| PRJ-2025-012 | 604 | 610 | **0** | 0 | 0 |
| PRJ-2026-008 | 352 | 340 | **0** | 0 | 0 |
| PRJ-2023-014 | 291 | 280 | **0** | 0 | 0 |

`DB.timelogs`: 45 kayıt · `onay` {Bekliyor 36, Onaylandı 9} · `faturalanabilir`
36/45 · `proje` dolu 36/45 · toplam 247 saat (222'si projeli).

**Toplam: kayıtlı 9.125 saat ↔ onaylı zaman kaydı 53 saat (%0,58).**
14 projenin **7'sinde** (arşivli olanların hepsi) tek bir zaman kaydı bile yok.
Sayı yazılmış, türetilmemiş — L-08'in tam ihlali.

> ⚠️ **İki onay ekseni birbirine bağlı değil.** `DB.timelogs[].onay` (satır onayı,
> `app-zaman.html:94`) ile `DB.timesheets[].durum` (haftalık onay,
> `app-zaman-onay.html:136`) **ayrı yürüyor**: haftalık timesheet onaylanınca
> altındaki zaman kayıtlarının `onay` alanı değişmiyor. Dolayısıyla "onaylanmış
> timesheet kayıtları" bugün iki farklı şey demek. R03 bunu da kapatmak zorunda,
> yoksa türetilen sayı hangi eksende olduğu belirsiz kalır.
> Ayrıca `DB.timesheets[].faturalanabilir` bir **saat sayısı**, `DB.timelogs[].faturalanabilir`
> bir **boolean** — aynı ad, iki eksen. Yeni türetmede bu tuzağa düşülmez.

**Karar — veri boşluğu nasıl kapanır (uydurmadan)**

Türetmeyi olduğu gibi açmak, 9 projeyi "0 saat harcanmış" göstermek olurdu; bu
doğru ama **eldeki gerçek kayıtları görmezden gelir**. Zaman kayıtları
`DB.tasks[].gercekSure` · `DB.projectModules[].efor` · `DB.sprints[].tamamlanan`
alanlarında **zaten yazılı**. Karar: `DB.timelogs` bu üç var olan kaynaktan
**türetilerek** genişletilir; her üretilen kaydın `aciklama` alanı kaynağını
(görev/modül kodu) yazar. Uydurma yok — var olan bir olayın zaman defterine
geçirilmesi var. Kaynağı olmayan hiçbir saat üretilmez; kaynağı olmayan projede
sayı **düşer ve öyle kalır**.

**Yapılacaklar**

- [x] `GV.zaman.onayla(timesheetKod)` — haftalık onay **altındaki zaman kayıtlarını
      da onaylasın**. Tek onay ekseni, `domain.js`'te (VB-06 sınıfı bir ayrışma bu)
- [x] `GV.proje.sure(kod)` → `{ planlanan, gerceklesen, faturalanabilir }`
      — `domain.js`'te tek yordam. `gerceklesen` = Σ `timelogs[onay==='Onaylandı']`,
      `faturalanabilir` = Σ onaylı **ve** `faturalanabilir:true`,
      `planlanan` = proje `tahminiSure` (yoksa Σ görev `tahminiSure`)
- [x] `DB.timelogs` var olan kayıtlardan türetilerek genişletilsin, her kaydın
      kaynağı `aciklama`'da yazılı olsun
- [x] `DB.projects[].harcananSure` **kaldırılsın** (türetilebilir sayaç saklanmaz).
      `app-proje-form.html:559-560`'daki iki elle girilen sayı alanı da kalkar;
      `:556-561` hint'i ("zaman kayıtları bu alanları otomatik güncellemez") artık
      doğru olmayacak
- [x] Proje kartında **üç değer**: Planlanan · Gerçekleşen · Faturalandırılabilir —
      mevcut `kpis[]` alanında (`app-proje.html:55`), **yeni kart açılmadan**
- [x] `app-proje-detay.html:568`'deki `faturalanabilirSaat` **tüm** zaman kayıtlarını
      topluyor; onaylı eksene çekilsin. `app-rapor-proje.html:702`'nin
      "onaylı/onaysız tüm girişleri toplar" açıklaması da düzelsin
- [x] `canon.js` **eksen 25**: "proje gerçekleşen süresi = onaylı zaman kayıtlarının
      toplamı" · "faturalandırılabilir ≤ gerçekleşen ≤ tüm" · "haftalık timesheet
      onaylıysa altındaki zaman kayıtları da onaylı" · "`toplam` = o haftanın
      zaman kayıtlarının toplamı"
- [x] `components.md`'ye türetme sözleşmesi

**Dokunulacak dosyalar:** `assets/js/domain.js` · `assets/data/work.js` ·
`assets/data/hr.js` · `app-proje.html` · `app-proje-detay.html` ·
`app-rapor-proje.html` · `assets/js/dashboard.js` · `tasks/qa/canon.js` ·
`tasks/components.md`

</details>

---

## R04 · Proje maliyetini otomatik hesapla · ✅ TAMAM

**KAPANDI (2026-08-07, 14. oturum)** — 9/9 alt madde. `gerceklesenMaliyet`
kaldırıldı; `GV.proje.maliyet` dört kalemi ayrı ayrı türetiyor. Kilit:
`canon.js` eksen **28**.

Ölçüm:

| Bulgu | Sayı |
|---|---|
| `DB.projects[].gerceklesenMaliyet` | 14/14 kayıtta **elle yazılı tek sayı** |
| `DB.employees[].saatlikUcret` | **1/16** (yalnız EMP-015, freelancer, 1450 ₺) |
| `DB.employees[].maas` | 15/16 dolu (EMP-015'te `maas:0`) |
| `DB.purchases[].proje` | **1/7** dolu |
| `DB.orders[].proje` | **alan yok** — gerçek para siparişte, projeye ulaşamıyor |
| Projeye bağlı gider koleksiyonu | **yok** — `vehicleExpenses` araca bağlı, proje ekseni yok |
| Dış kaynak maliyeti | **temsil edilmiyor** — EMP-015'in projeli tek zaman kaydı bile yok |
| Bugünkü tek kârlılık formülü | `sozlesmeTutari − gerceklesenMaliyet` (`app-rapor-finans.html:287`) |

Yani dokümanın istediği dört kalemin **hiçbirinin** hesaplanabilir kaynağı bugün
tam değil.

> ⚠️ **`maas` / `saatlikUcret` XOR sözleşmesi var.** `app-personel-form.html:146`
> `maas > 0` **XOR** `saatlikUcret > 0` kuralını uyguluyor; `saatlikUcret`
> anahtarı yalnız o eksende çalışanda bulunur (`components.md:409`) ve **BRÜT**tür.
> Yani `saatlikUcret`i 16/16 doldurmak **var olan bir sözleşmeyi kırardı.**
> Doğru çözüm ikinci bir eksen: `icMaliyetSaat` — *şirkete saatlik iç maliyet*.
> Sözleşmeli saat ücreti (`saatlikUcret`) ile iç maliyet farklı şeylerdir.

**Yapılacaklar**

- [x] `DB.employees[].icMaliyetSaat` alanı **16/16** — yazılı türetme:
      `maas > 0` ise `round(maas × işverenKatsayısı / aylıkSaat)`, `saatlikUcret > 0`
      ise `saatlikUcret` (dış kaynakta fatura edilen tutar = şirketin maliyetidir).
      `işverenKatsayısı` ve `aylıkSaat` `DB.company` altında **yazılı sabit** olur ki
      hesap sessizce değişmesin (VB-19 dersi). Mevcut XOR sözleşmesi **bozulmaz**.
- [x] `DB.purchases[].proje` bağı gerçekten proje için alınmış kayıtlarda doldurulsun
      (var olan `gerekce`/`butceKodu` alanından türetilir — `BTC-PRJ-002` zaten
      proje biçimli bir bütçe kodu taşıyor). `DB.orders`'a `proje` alanı **açılmaz**;
      sipariş → talep → proje zinciriyle çözülür (§9d yön kuralı)
- [x] `DB.projectExpenses` **açılmaz** — talimat "yeni finans modülü oluşturma"
      diyor. Diğer proje giderleri var olan `DB.purchases` üzerinden temsil edilir;
      dış kaynak maliyeti **çalışma tipi ≠ Kadrolu olan personelin onaylı zaman
      kayıtlarından** gelir (R16 o ekseni açıyor — iki madde birbirini besliyor)
- [x] `GV.proje.maliyet(kod)` → `{ personel, disKaynak, satinAlma, diger, toplam,
      gelir, brutKar, karlilikYuzde }` — `domain.js`'te tek yordam
- [x] `DB.projects[].gerceklesenMaliyet` **kaldırılsın**
- [x] Proje detayındaki **mevcut** Bütçe ve Maliyetler sekmeleri bu yedi değeri
      göstersin — yeni finans modülü/tab açılmaz. (İki sekme bugün **aynı iki
      sayıyı** iki farklı çerçeveyle basıyor; kırılım gelince ayrım anlam kazanır.)
- [x] `app-proje-detay.html:864` ve `:873` "türetilmiş / örtüşmeyebilir" uyarıları
      kalksın — artık türetme **gerçek** olacak
- [x] `canon.js` **eksen 26**: "proje personel maliyeti = Σ(onaylı saat ×
      `icMaliyetSaat`)" · "toplam = dört kalemin toplamı" · "brütKâr = gelir − toplam" ·
      "kârlılık% = brütKâr / gelir" · "projeli zaman kaydı olan her personelin
      `icMaliyetSaat`i var"
- [x] `finans` yetki ekseni korunur — maskeleme mevcut `GV` davranışıyla

> **Planın üç maddesi uygulamada BAŞKA türlü kapandı — gerekçeleriyle:**
>
> 1. **`icMaliyetSaat` alanı AÇILMADI.** İçeriği `maas × katsayı ÷ aylık saat`
>    formülünden tamamen türetilebilir, yani L-08'in "türetilebilir sayaç"
>    sınıfı. Aynı turda `harcananSure` ve `gerceklesenMaliyet` tam bu gerekçeyle
>    kaldırılırken yeni bir türetilebilir sayaç saklamak kendi kararımızla
>    çelişirdi. `GV.hr.icMaliyet()` türetiyor ve **formülü de döndürüyor**;
>    iki girdi `DB.company`'de yazılı sabit. XOR sözleşmesine dokunulmadı. → **V-46**
> 2. **`DB.purchases[].proje` dolduracak kayıt ÇIKMADI.** Yedi satın alma tek tek
>    okundu: yalnız biri proje kaynaklı (`BTC-PRJ-002`) ve **zaten doluydu**.
>    Kalan altısı donanım, ofis sarfı, lisans, monitör, araç — hiçbiri projeye ait
>    değil ve **hiçbiri zorlanarak bağlanmadı**. Plan maddesi borcu fazla tahmin
>    etmişti (L-28'in ters yönü). → **V-47**
> 3. **Dış kaynak kalemi 0 ₺ ve bu dürüst bir sıfır.** Eksen kuruldu
>    (`GV.hr.disKaynak`), hizmet sözleşmeli tek personelin **projeye bağlı zaman
>    kaydı yok**; başlamamış bir görevden saat türetmek uydurma olurdu (L-13).
>    Değer veri gelince dolar. → **V-47**
>
> Ayrıca yol boyunca çıkan ve kapatılan bir şey: **`GV.proje.maliyet` satın alma
> kalemini `DB.purchases`'tan okuyor ve o koleksiyon `ops.js`'te.** Dört ekran
> `ops.js`'i yüklemiyordu ve kalem **hata vermeden sessizce 0** kalıyordu.
> → **L-34** (L-12 · L-32'nin üçüncü ikizi; en sinsisi çünkü hata değil
> **eksik sayı** üretiyor). Yordamların veri bağımlılık tablosu artık
> `components.md` §6b'de yazılı.

**Dokunulacak dosyalar:** `assets/js/domain.js` · `assets/data/work.js` ·
`assets/data/hr.js` · `assets/data/org.js` · `assets/data/ops.js` ·
`app-proje-detay.html` · `app-rapor-proje.html` · `app-rapor-finans.html` ·
`tasks/qa/canon.js` · `tasks/components.md`

---

# FAZ 2 — OPERASYON

## R05 · Proje durumu ve proje fazını ayır · ✅ TAMAM

**KAPANDI (2026-08-07, 15. oturum)** — iki eksen ayrıldı, VB-20 kapandı.

Yapılanlar: `DB.projectStatuses` **5 → 7 değer** (doküman kümesi) ·
`DB.projectPhases`ten `Tamamlandı` **çıktı**, küme iki aileye açıldı
(`Analiz · Tasarım · Geliştirme · Test` + `Faz 1/2/3`) · yeni
`DB.moduleStatuses` — proje durum sözlüğünden çıkan üç kelime **modül
ekseninde yaşamayı sürdürüyor** (L-33: bir adı silmeden önce onu kullanan
her koleksiyon aranır; 15 modülün 15'i o kelimeleri taşıyor) · 12 kaydın
durumu taşındı (`Geliştirme → Aktif` ×4 · `Test → Kontrol / Test` ×1 ·
`Teslim → Tamamlandı` ×7 arşivli · `Teslim → Teslim Sürecinde` ×1) ·
7 kaydın `faz:'Tamamlandı'`sı **boşaltıldı**, uydurma değer yazılmadı (V-48) ·
`aktif` alanı proje kaydından **kaldırıldı**, arşiv tek eksen (V-49).

**Kök nedenden çözüm:** "bu proje devam ediyor mu?" cümlesi **yedi ekranda**
ayrı ayrı yazılıydı (`p.durum !== 'Teslim' && !p.arsiv`); sözlük değişince
yedisi birden **sessizce boş liste** üretirdi. Tanım `GV.proje.acik` ·
`bitti` · `kapali` · `arsivli` · `geciken` olarak `domain.js`'e alındı,
yedi ekran onu çağırıyor. Ton haritası, kanban kolonları, liste sekmeleri,
form doğrulamaları ve rapor süzgeci **sözlükten** besleniyor — elle yazılı
durum listesi kalmadı (`app-rapor-proje.html` kümeyi kayıtlardan türetiyordu,
o da sözlüğe bağlandı).

**Kilit:** `canon.js` **eksen 29** (yedi kontrol grubu) — altı olumsuz vakayla
sınandı. Sınama sırasında `canon.js`'in **veri kökünü sabit yolla tuttuğu**
ortaya çıktı: bozulmuş kopya hiç okunmuyordu, altı olumsuz vakanın altısı da
yanlışlıkla "TEMİZ" dönmüştü. Kök `qa-lib.repoRoot()`e bağlandı → **L-35**.

<details><summary>Turun başındaki tam ölçüm</summary>

**DURUM (ölçüm anı): 🟡 kısmen — iki eksen çakışıyor, kapanış turunda VB-20 olarak zaten kayıtlı**

Ölçüm (14 proje):

| Alan | Değerler | Dağılım |
|---|---|---|
| `durum` | Teslim · Geliştirme · Test · Planlama | Teslim 8 · Geliştirme 4 · Test 1 · Planlama 1 |
| `faz` | Faz 1 · **Tamamlandı** | Faz 1 **7** · Tamamlandı **7** |
| `DB.projectStatuses` | 5 değer — `Askıda` **0 kayıtta** | sözlük var (`work.js:33`) |
| `DB.projectPhases` | 4 değer — `Tamamlandı` **faz sözlüğünde** | sözlük var (`work.js:38`) |

İki ayrı kusur:

1. **`faz` alanında durum dolaşıyor.** 14 projenin **7'sinde** `faz:'Tamamlandı'`.
   Doküman bunu ismen yasaklıyor: *"Tamamlandı, proje fazı olarak kullanılmamalıdır."*
   `work.js:35-37`'deki yorum bu borcu zaten kabul ediyor ve VB-20'ye bağlıyor.
2. **`durum` sözlüğü faz kelimeleri taşıyor.** `Geliştirme` ve `Test` proje
   *durumu* değil, proje *fazıdır*. Dokümanın istediği durum kümesi:
   `Planlama · Aktif · Kontrol/Test · Teslim Sürecinde · Askıda · Tamamlandı ·
   İptal Edildi`.

**Yapılacaklar**

</details>

**Yapılacaklar**

- [x] `DB.projectStatuses` → 7 değer (doküman kümesi)
- [x] `DB.projectPhases` → `Tamamlandı` **çıkar**; faz kümesi `Analiz · Tasarım ·
      Geliştirme · Test` + `Faz 1/2/3` serbest ekseni
- [x] `faz:'Tamamlandı'` olan 7 kaydın fazı gerçek fazına, durumu `Tamamlandı`ya
      taşınsın — **fazı boş bırakıldı**: o 7 projenin ne modülü ne görevi ne
      sprinti var, gerçek fazları türetilebilir bir bilgi değil (V-48 · L-13)
- [x] `durum:'Geliştirme'|'Test'` olan 5 kayıt: durum `Aktif`/`Kontrol / Test`
      — **fazına dokunulmadı**: `Faz 1` beyan edilmiş gerçek bir değer ve durum
      kelimesinin faz ekseninde ezilmesine gerek yok (gerekçe V-48)
- [x] Ton haritası, süzgeç kümeleri, kanban kolonları, dashboard sayaçları yeni
      sözlükten beslensin — **hiçbir ekranda elle yazılı liste kalmasın**
- [x] `canon.js` **eksen 29**: "`faz` değeri `durum` sözlüğünden bir kelime
      taşımaz" (iki ekseni bir daha karıştırmayı imkânsız kılar) — eksen
      numarası 27/28 dolu olduğu için **29** oldu
- [x] VB-20'nin `aktif`/`arsiv` ikinci yarısı da aynı turda kapansın (V-49)

**Dokunulan dosyalar:** `assets/data/work.js` · `assets/js/domain.js` ·
`assets/js/ui.js` · `assets/js/dashboard.js` · `app-proje.html` ·
`app-proje-detay.html` · `app-proje-form.html` · `app-rapor-proje.html` ·
`app-rapor-finans.html` · `app-rapor-musteri.html` · `app-butce.html` ·
`app-panel-yonetici.html` · `app-musteri-form.html` ·
`app-musteri-yetkili-form.html` · `tasks/qa/canon.js` · `tasks/qa/dep.js` ·
`tasks/components.md` · `tasks/ui-debt.md` (VB-20 kapanışı)

## R06 · Milestone ve ödeme planını ayır

**DURUM: ⬜ yok — milestone ile taksit TEK kayıt; iki ekran aynı koleksiyonun iki görünümü**

Ölçüm (`DB.milestones`, 19 kayıt, 10 alan, hepsi 19/19 dolu):

| Alan | Ekseni | Not |
|---|---|---|
| `ad` · `tarih` · `durum` · `ilerleme` · `proje` | **milestone** | 5 alan |
| `taksit` · `odeme` · `odemeDurum` · `sozlesme` | **ödeme** | 4 alan |
| `sorumlu` · `aciklama` · `teslimat` | milestone — dokümanın istediği | **üçü de YOK** |
| `oran` (%) | ödeme | **yok** — yüzdeler yalnız `contracts.odemePlani` serbest metninde |
| `fatura` | ödeme | milestone'da yok; bağ ters yönde (`invoices.milestone` 15/17) |

- `app-proje-milestone.html:47` ve `app-odemeplani.html:51` **aynı `DB.milestones`
  koleksiyonunu** okuyor; ikisi de kodda "yeni koleksiyon açılmaz" diye yazıyor.
  Yani iki *ekran* zaten var — olmayan şey iki *kayıt türü*.
- `app-proje-detay.html`'de "Milestone" sekmesi 9 kolonun **4'ünde** ödeme kolonu
  basıyor ve altbilgide *taksit* sayıyor (`:288`); "Bütçe" sekmesi ise **aynı diziyi**
  "Ödeme Planı (taksitler)" başlığıyla ikinci kez basıyor (`:804`).
- Ödeme planının bütünlüğü `canon.js` **eksen 10**'da `Σ odeme = sözleşme neti`
  olarak korunuyor; `DB.deliveries[].milestone` bağı **eksen 13**'te.

**Karar — hangi ayrım yapılır**

Koleksiyonu ikiye bölmek 25+ tüketici ekranı, `domain.js:98` `senkronTaksit`'i ve
üç canon eksenini birden kırardı; talimat da "aynı özelliği iki yerde yeniden
kurma" diyor. **Ayrım kayıt düzeyinde değil, EKSEN düzeyinde yapılır:**
`DB.milestones` **ödeme planı taksiti** olarak kalır (bugün gerçekte odur),
milestone ekseni için `DB.projectMilestones` **ayrı ve küçük** bir koleksiyon açılır;
taksit isteğe bağlı olarak bir milestone'a bağlanır (`milestone` FK) — dokümanın
*"İstenirse ödeme kaydında İlgili Milestone seçilebilir"* cümlesinin birebir
karşılığı. Bağ **ödeme kaydında** durur, milestone'da ayna alan doğmaz (§9d).

**Yapılacaklar**

- [ ] `DB.projectMilestones` — alanlar: `kod · proje · baslik · tarih · sorumlu ·
      durum · aciklama · teslimat`. Kayıtlar **uydurulmaz**: var olan
      `DB.deliveries` (5) ve tamamlanmış `DB.milestones` adlarından türetilir,
      kaynağı `aciklama`'da yazılır
- [ ] `DB.milestones[].milestone` — opsiyonel FK, ödeme kaydında
- [ ] `DB.milestones` alan adları ödeme ekseninde netleşsin; `ad` alanı taksit
      adı olarak kalır
- [ ] `app-proje-detay.html`: "Milestone" sekmesi **gerçek milestone**'ları
      göstersin, ödeme kolonları "Bütçe" sekmesindeki ödeme planına kalsın —
      **yeni sekme açılmaz**, var olan iki sekmenin içeriği ayrışır
- [ ] `app-proje-milestone.html` proje milestone'unu, `app-odemeplani.html` taksiti
      okusun — iki ekran artık iki şey gösterir
- [ ] `canon.js` **eksen 28**: "ödeme kaydının `milestone` FK'sı çözülür ve aynı
      projeye aittir" · "milestone'da ayna ödeme alanı doğmamıştır"
- [ ] Eksen 10 ve 13 **repointe edilmez** — `DB.milestones` ödeme ekseninde kaldığı
      için ikisi de yerinde çalışmaya devam eder

---

## R07 · Proje kapanış akışı ekle

**DURUM: ⬜ yok — kapanış aksiyonu, kontrol listesi, hiçbiri yok**

Ölçüm:

- `app-proje-detay.html` **hiç mutasyon yapmıyor**: sayfadaki her aksiyon bir
  `<a href>`. Tek `<button>`'ları sekme düğmeleri. `GV.pageHead` **çağrılmıyor**;
  `.ph-actions` elle yazılmış (`:120-123`: Görevler · Milestone · Düzenle).
- Repoda proje kapanışı anlamında `kapanis`/`checklist` **0 sonuç**. `DB.checklists`
  (29 kayıt) **görev** alt maddeleridir, projeye ait değildir.

Sekiz kontrolün veri karşılığı:

| # | Kontrol | Kaynak | Veri durumu |
|---|---|---|---|
| 1 | Açık görev | `DB.tasks` (`proje`+`durum`) | ✅ `proje` 16/26 |
| 2 | Kontrolde görev | `DB.tasks.durum` | ⚠️ repoda **1 kayıt** — 13 projede hep 0 |
| 3 | Açık revizyon | `DB.changeRequests` (5, `proje` 5/5) + `app-proje-detay.html:68`'deki hazır `revizyonlar` | ✅ |
| 4 | Teslimatlar tamam | `DB.deliveries` (5, `proje` 5/5) | ⚠️ 14 projenin yalnız 5'inde teslim satırı var |
| 5 | Müşteri onayı | `DB.deliveries.musteriOnay` (5/5) | ✅ — `DB.approvals` **kullanılamaz**, 12 kaydın **0'ı** PRJ kodu taşıyor |
| 6 | Eksik doküman | `DB.documents` (`proje` **3/11**, `onay`) | ⚠️ zayıf — "hangi doküman zorunlu" tanımı **hiç yok** |
| 7 | Açık finansal işlem | `DB.invoices` (`proje` 15/17) + `DB.milestones.odemeDurum` | ✅ |
| 8 | Bakım başlayacak mı | `DB.supportPackages` | ❌ **`proje` alanı yok** → R08 |

**Yapılacaklar**

- [ ] `GV.proje.kapanisKontrol(kod)` → 8 maddelik sonuç dizisi
      (`{ anahtar, etiket, gecti, sayi, detayHref }`) — `domain.js`'te
- [ ] Kontrol 6 için **zorunlu doküman tanımı** açılır: `DB.company.zorunluProjeDokuman`
      (tür listesi). Tanım olmadan "eksik" ölçülemez — bugün eksikliğin kendisi
      ölçülemiyor
- [ ] `app-proje-detay.html` `GV.pageHead`'e geçsin (13 ekranın elle iskelet
      kopyalaması UID-15'te zaten borç); **Projeyi Kapat** aksiyonu `run:` ile eklensin
- [ ] Kapanış modalı `GV.confirm({ body })` + var olan `.gv-checklist` sınıfıyla
      kurulsun — **yeni bileşen yazılmaz**
- [ ] Geçmeyen madde kapanışı **engellemez**, uyarır; kullanıcı gerekçe yazarak
      kapatabilir (gerekçe `DB.activities`'e girer)
- [ ] Kapanış `durum:'Tamamlandı'` + `gercekBitis` + aktivite yazar; R05'in yeni
      durum sözlüğünü kullanır
- [ ] Demo hedefi: **PRJ-2026-004** (temiz-ish kapanış) ve **PRJ-2026-001**
      (3 açık görev · 1 kontrolde · 1 bekleyen doküman · 1 ödenmemiş fatura ·
      2 ödenmemiş taksit) — ikisi de gerçek kayıt, uydurma senaryo değil

---

## R08 · Proje kapanışından destek / bakıma geçiş

**DURUM: ⬜ yok — proje ile bakım paketi arasında HİÇBİR yönde bağ yok**

Ölçüm (`DB.supportPackages`, 7 kayıt, 14 alan):

| Alan | Fill |
|---|---|
| `musteri` · `ad` · `baslangic` · `bitis` · `aylikSaat` · `kullanilan` · `kalan` · `tutar` · `durum` · `yenileme` · `aktif` | 7/7 |
| `sozlesme` | **1/7** |
| `yenilemeTarihi` | 2/7 |
| `proje` | **alan yok** |

- Proje tarafında da `bakim`/`destekPaket` alanı **yok** (14 kaydın hiçbirinde).
- Tek dolaylı zincir `paket.sozlesme → contract.proje` **hiçe çıkıyor**: BKP-001'in
  sözleşmesi SZL-2026-022, onun `proje`si `null` (projesiz bakım sözleşmesi).
- **Bugün hiçbir projenin bakım paketi yok** — hiçbir alanla, hiçbir yolla.
- `DB.tickets.bakimPaketi` bir **etiket** (`Standart`/`Kurumsal`/`—`), kod değil.

**Yapılacaklar**

- [ ] `DB.supportPackages[].proje` — opsiyonel FK. Bağ **pakette** durur, projede
      ayna alan doğmaz (§9d)
- [ ] Kapanış modalının son adımı: *"Bu proje için bakım veya destek hizmeti
      başlatılacak mı?"* → `Hayır` · `Mevcut pakete bağla` (müşterinin paketleri
      listelenir) · `Yeni paket oluştur`
- [ ] "Yeni paket" seçilirse **yeni ekran açılmaz**: aynı modalda başlangıç tarihi +
      paket tipi + sözleşme ilişkisi alınır, kayıt `DB.supportPackages`'a yazılır,
      `GV.result` ile "Paketi aç" bağlantısı verilir
- [ ] Paket oluşumu projenin sözleşmesini devralsın (`contracts.proje` ters
      yönünden çözülür)
- [ ] `canon.js` **eksen 21** `BAGLAR` listesine `proje → bakım paketi` eklensin
      (L-22: en az bir kayıtta dolu olacak)

---

## R09 · Destek / ticket detayını geliştir

**DURUM: 🟡 kısmen — 12 alanın 7'si YOK, durum sözlüğü hiçbir `DB.*`'da tanımlı değil**

Ölçüm (`DB.tickets`, **7 kayıt**, 23 alan — şema 7/7 tekdüze):

| Doküman alanı | Durum | Alan | Fill |
|---|---|---|---|
| Talep Konusu | ✅ | `baslik` | 7/7 |
| Talep Açıklaması | ⬜ **yok** | — | — |
| Müşteri | ✅ | `musteri` | 7/7 |
| Proje | ✅ | `proje` | 6/7 |
| Kategori | ✅ | `kategori` | 7/7 |
| Öncelik | ✅ | `oncelik` | 7/7 |
| Talebin Geldiği Kanal | ⬜ **yok** | — | 0/7 |
| Çözüm Açıklaması | ⬜ **yok** | — | — |
| Çözüm Tarihi | ⬜ **yok** (yalnız `cozumSuresi` dakika, 3/7) | — | — |
| Çözen Personel | ⬜ **yok** (yalnız `sorumlu` = atanan) | — | — |
| Müşteri Onayı | ⬜ **yok** (`memnuniyet` **başka eksen**) | — | — |
| Kapanış Tarihi | ⬜ **yok** — ekranda `acilis + cozumSuresi` ile **türetiliyor** | — | — |

Ekran bunu zaten itiraf ediyor — `app-destek-detay.html:414-418`'de bir `GV.notice`:
*"Destek kaydında serbest metin açıklaması, geliş kanalı ve kapanış zamanı için
ayrı alan bulunmuyor."*

Durum sözlüğü:

| Bugün | Sayı | Hedef |
|---|---|---|
| Devam ediyor | 2 | → `Çalışılıyor` |
| Kapandı | 2 | → `Kapatıldı` |
| Müşteri bekleniyor | 1 | ✅ aynı |
| Çözüldü | 1 | ✅ aynı |
| Açık | 1 | → `Yeni` |
| — | 0 | `Atandı` **yok** |
| — | 0 | `Yeniden Açıldı` **yok** |

`DB.ticketStatuses` **yok**; liste 3 yerde elle yazılı (`app-destek.html:92`, `:101`,
`app-destek-form.html:214`) ve "açık talep" tanımı 6 ayrı yerde daha elle türetiliyor
(`shell.js:331` · `dashboard.js:196` · `app-musteri-detay.html:417,541` ·
`app-rapor-musteri.html:106` · `app-destek.html:30`).

SLA yapısı korunur: `sla` · `ilkYanit` · `mudahaleSuresi` · `cozumSuresi` · `slaDurum`
+ `DB.slaPolicies` (7) + `app-destek-sla.html` + detayın `sla` sekmesi.
**`cozumSuresi` SLA matematiğinin girdisidir — yeni alanlar ona dokunmaz.**

**Yapılacaklar**

- [ ] `DB.ticketStatuses` sözlüğü (7 değer) — elle yazılı 3 liste + 6 türetme oraya bağlansın
- [ ] `DB.ticketChannels` sözlüğü (7 değer) + `DB.tickets[].kanal` — 7/7 doldurulur;
      değer **uydurulmaz**, var olan `acan` (YTK kodu → portal) ve talebin niteliğinden
      türetilir, kaynağı aktiviteye yazılır
- [ ] `aciklama` (talep açıklaması) · `cozumAciklama` · `cozumTarihi` · `cozenPersonel` ·
      `musteriOnay` · `kapanisTarihi` alanları
- [ ] `cozumTarihi` ile `cozumSuresi` **çelişemez** — biri diğerinden türetilir,
      ikisi ayrı yazılmaz (L-08)
- [ ] `GV.badge` ton haritasına `Çalışılıyor` · `Kapatıldı` · `Yeniden Açıldı`
      eklensin (yoksa gri basar)
- [ ] Durum yeniden adlandırma **tüm** tüketicilerde aynı turda yapılsın
- [ ] `canon.js` **eksen 29**: "`cozumTarihi` dolu ⇒ `durum ∈ {Çözüldü, Kapatıldı}`" ·
      "`kapanisTarihi ≥ cozumTarihi ≥ acilis`" · "`kanal` sözlükten"

---

## R10 · Ticket'tan doğru akışı başlat

**DURUM: 🟡 kısmen — görev dönüşümü VAR ve çalışıyor; CR ve fırsat YOK**

Ölçüm:

| Dönüşüm | Bağ alanı | Dolu | Oluşturma aksiyonu |
|---|---|---|---|
| Ticket → **Görev** | `DB.tasks[].destek` | **1/26** | ✅ `Göreve dönüştür` (`app-destek-detay.html:412` → `donusturModal` `:295`) |
| Ticket → **Hata** | `DB.bugs[].destek` | **2/6** | ⬜ yok — yalnız listeleniyor |
| Ticket → **Değişiklik (CR)** | `DB.changeRequests[].destek` | **1/5** | ⬜ **yok** — yalnız listeleniyor (`:822`) |
| Ticket → **Fırsat** | — | **0** | ⬜ alan da yok, aksiyon da |

- Ticket kaydının **kendisinde** `gorev`/`cr`/`firsat` alanı yok ve olmamalı —
  bağ kaynak kayıtta durur (§9d), mevcut yön doğru.
- Fırsat koleksiyonu **`DB.leads`** (12 kayıt); ayrı `DB.opportunities` yok.
  `DB.leads`'te `destek` alanı yok.
- ⚠️ İki yanlış pozitif tuzağı: `DB.changeRequests[].talep` **başka eksendir**
  (talebi açan taraf), `DB.quotes[].destek` **8/8 dolu ama serbest metin**
  (bakım paketi cümlesi) — ikisi de bağ sanılmamalı.
- Dönüşümler sekmesi (`donusum`) zaten var ve üç koleksiyonu tarıyor (`:164`).

**Yapılacaklar**

- [ ] `Göreve dönüştür` butonu **İşleme Dönüştür** menüsüne dönüşsün — üç seçenek
      tek modalda; mevcut görev akışı **korunur**, ikinci bir yol açılmaz
- [ ] `Revizyon / CR oluştur` — `DB.changeRequests`'e yazar, `destek` bağını kurar.
      Ön dolgu: `proje ← t.proje` (null ise kullanıcı seçer) · `baslik ← t.baslik` ·
      `tarih ← DB.today` · `talep ← 'Müşteri'` · `sorumlu ← t.sorumlu` ·
      `durum ← 'Değerlendiriliyor'`. `etkiSure`/`etkiMaliyet` ticket'ta karşılığı
      olmadığı için **kullanıcıdan alınır** — uydurulmaz
- [ ] `Satış fırsatı oluştur` — `DB.leads`'e yazar + `DB.leads[].destek` bağı açılır.
      Ön dolgu müşteriden: `firma ← musteri.unvan` · `yetkili ← acan (YTK)` ·
      `sektor ← musteri.sektor` · `talepTarihi ← DB.today` ·
      `kaynak ← 'Destek talebi'` (**`DB.refTypes`'a yeni değer**) ·
      `asama ← ilk pipeline aşaması` · `sorumlu ← musteri.sorumlu`.
      `hizmet`/`puan`/`sicaklik`/`butce` kullanıcıdan alınır
- [ ] `Hataya dönüştür` **eklenmez** — doküman istemiyor ve bağ zaten okunuyor;
      "aynı özelliği iki yerde kurma" kuralı
- [ ] Dönüşümler sekmesi fırsatı da saysın
- [ ] `canon.js` eksen 21 `BAGLAR`'a `destek → fırsat` eklensin
- [ ] Modal `GV.modal` + sonuç `GV.result` ile — `donusturModal`'ın bugünkü kalıbı
      aynen sürdürülür

---

# FAZ 3 — TİCARİ VE MÜŞTERİ

## R11 · Proje kaynağını ekle

**DURUM: 🟡 yarısı hazır — `944a594` sözleşmeden proje başlatmayı kurmuş; `kaynak` alanı YOK**

Ölçüm:

- `app-proje-form.html`: 9 bölüm, **30 alan**, 17'si zorunlu. `kaynak` alanı **yok**.
- Commit `944a594` (2 dosya, +87/−5) zaten kurmuş:
  - `app-sozlesme-detay.html:206-215` — sözleşmenin projesi varsa `Projeyi aç`,
    yoksa `Projeyi başlat` → `app-proje-form.html?sozlesme=<kod>`. Ölü buton yok.
  - `app-proje-form.html:133` `?sozlesme=` okunuyor (düzenleme modunda bilinçli olarak yok sayılıyor)
  - Ön dolgu **5 alan**: `ad` (sözleşme adından " Sözleşmesi" eki atılarak) ·
    `musteri` · `baslangic` · `planlananBitis` · `sozlesmeTutari`
  - Üç bilgilendirme durumu (sözleşme yok / zaten projeli / uygun) `:409-437`
  - Kaydederken tek yönlü bağ: `kaynakSozlesme.proje = kod` (§9d), iki aktivite kaydı
- Formda **sözleşme seçici alan yok** (`key:'sozlesme'` → 0 sonuç). Sözleşme yalnız
  URL'den gelebiliyor; forma doğrudan girildiyse sözleşme bağlanamıyor.
- Projelerde `kaynak` alanı yok. `kaynak` müşteride (12/12) ve adayda (12/12) var
  ama o **satış kaynağı** ekseni (`DB.refTypes`, 17 değer) — proje kaynağı değil.

**Yapılacaklar**

- [ ] `DB.projectSources` sözlüğü: `Müşteri Sözleşmesi · İç Proje · Satış Öncesi / PoC ·
      Bakım / Destek · Diğer` (`DB.projectStatuses` kalıbıyla)
- [ ] `DB.projects[].kaynak` — 14/14 doldurulur, **uydurulmadan**: sözleşmesi olan
      6 proje → `Müşteri Sözleşmesi`; geri kalanı `sozlesmeTutari`/`musteri`
      ilişkisinden türetilir, kaynağı aktiviteye yazılır
- [ ] Forma `kaynak` alanı (Proje kimliği bölümüne, **birinci sıraya** — kaynak
      diğer alanların davranışını belirliyor)
- [ ] Forma **sözleşme seçici** alanı: `kaynak === 'Müşteri Sözleşmesi'` iken
      **zorunlu**, diğer durumlarda gizli. `?sozlesme=` geldiğinde seçili ve kilitli
- [ ] Sözleşme seçilince ön dolgu **mevcut yordamla** genişlesin: `tur` ←
      sözleşme adı → `DB.services` eşlemesi · `odemePlani` bilgi olarak gösterilsin
      (kopyalanmaz — taksitler zaten `DB.milestones`'ta)
- [ ] Manuel proje oluşturma **kaldırılmaz** — `İç Proje` seçildiğinde sözleşme
      sorulmaz, akış bugünküyle aynı kalır
- [ ] `canon.js` eksen: "`kaynak === 'Müşteri Sözleşmesi'` olan projenin
      `DB.contracts` içinde onu gösteren bir kaydı vardır" — VB-20'nin
      "sözleşmesiz sözleşme bedeli" bulgusunu da kapatır

---

## R12 · Sözleşme sorumlusu ekle

**DURUM: ⬜ yok — sözleşmede hiçbir kişi alanı yok; ekran bunu zaten yazıyor**

Ölçüm (`DB.contracts`, 7 kayıt, 19 alan + 2 kayıtta `yenilemeTarihi`):

- Kişi tipinde **tek alan yok**. `app-sozlesme-detay.html:320-332` bunu bir
  `GV.notice` ile itiraf ediyor: *"Sözleşme kaydı kendi sorumlusunu tutmuyor.
  Aşağıdaki kişiler müşteri kartından ve bağlı proje kaydından türetilmiştir."*
  ve dört kişiyi türetip **salt okunur** basıyor.
- Varsayılan adayları: `DB.customers[].sorumlu` **12/12** (EMP-002 ×7, EMP-014 ×5) ·
  `DB.projects[].pm` **14/14** ama **14'ünün 14'ü EMP-003** — tek değerli eksen.
- Sözleşme detayı `GV.pageHead` kullanıyor (`:218`), aksiyon listesi `:197-216`.
  Yenileme akışı (`yenilemeAkisi` `:177-195`) çalışan bir mutasyon örneği.

**Yapılacaklar**

- [ ] `DB.contracts[].sorumlu` — 7/7 doldurulur. Değer **uydurulmaz**: bugün
      ekranın türettiği sıra korunur — `customers.sorumlu` (her zaman var),
      proje varsa `projects.musteriSorumlu` tercih edilir
- [ ] Sözleşme formuna alan (varsayılan otomatik seçili, kullanıcı değiştirebilir)
- [ ] Detay üstbilgisinde meta satırına sorumlu eklensin (**yeni kart açılmaz**);
      `:320-332`'deki "sorumlu alanı yok" notice'ı **kalkar**, türetilen dört kişi
      "ilgili kişiler" olarak kalır
- [ ] Liste ekranına `sorumlu` kolonu + süzgeci (talimat: her listeye her süzgeci
      ekleme — burada sorumlu **anlamlı**, teknik departman süzgeci **eklenmez**)
- [ ] Yenileme/bitiş bildirimleri bu kişiye düşsün (`app-ayar-onay.html:345`
      bugün `satismudur` rolüne atıyor — sorumlu varken ona gitsin)
- [ ] `canon.js` eksen 24 (kişi kimliği KOD ile) yeni alanı da kapsasın

---

## R13 · Müşteri portalını geliştir

**DURUM: 🔴 kısmen — rol ve ekranlar var ama KAPSAM YOK; ölçülen altı sızıntı**

Ölçüm:

| Bulgu | Değer |
|---|---|
| Rol anahtarı | **`musteri`** (`musterikullanici` değil), `org.js:74` |
| Yetki satırı | `gor:'kendi'` · `ekle:'kendi'` · `finans:false` · `maas:false` · `log:false` · **`onay:true`** |
| Gördüğü bölüm | 4/15 — `panel · destek · dokuman · ayarlar` (`shell.js:221`) |
| Ulaşabildiği ekran | **18** |
| `scopeField` bildiren ekran | **6 / 143** — ulaşabildiği 18'in yalnız **1'i** (`app-destek.html`), o da `sorumlu` ekseninde |
| Oturumda müşteri kimliği | **yok** — `?role=musteri` ile giren `EMP-001`'e (şirket sahibi) düşüyor |
| Giriş ekranında müşteri personası | **yok** (`login.js:84`) |

**Ölçülen sızıntılar** — talimatın "kesinlikle gösterilmemeli" listesine karşı:

| # | Yasak | Durum | Kanıt |
|---|---|---|---|
| 1 | İç personel maliyetleri | ✅ temiz | `maas:false` maskesi çalışıyor, personel ekranları 403 |
| 2 | İç proje kârlılığı | ✅ temiz | `finans`/`rapor` bölümleri 403 |
| 3 | Personel timesheet detayları | 🔴 **sızıyor** | `app-panel-ozet.html:186-189` "Bugün kaydettiğim saat" — oturum EMP-001 olduğu için **şirket sahibinin** saatleri |
| 4 | İç görev yorumları | 🔴 **kısmen sızıyor** | Yorumlar 403, ama `app-ajanda.html:94-113` **26 görevin tamamını** sorumlu adı · proje · **başka müşterilerin adıyla** basıyor, hiçbir yetki kapısı yok |
| 5 | Yönetici notları | 🔴 **sızıyor** | `app-destek-detay.html:31` `?id=` ham okunuyor, sahiplik kontrolü yok → **herhangi bir** ticket'ın aktivite geçmişi · `app-panel-duyurular.html` iç duyurular |
| 6 | İç finansal bilgiler | 🔴 **yapısal sızıntı** | Tutarlar maskeli ama satırlar değil: `app-panel-onaylar.html:30` **12 onayın tamamı** (timesheet · izin · komisyon) · `app-destek-paket.html` **7 müşterinin** paketi · `app-ajanda.html:196,217` **17 faturanın** kodu+müşteri adı ve **7 sözleşmenin** yenileme tarihi |
| + | Ana sayfa | 🔴 **sızıyor** | `dashboard.js:688` `DB.tickets.slice(0,5)` — **beş farklı müşterinin** talebi, müşterinin karşılama ekranında |

**Tek cümlelik kök neden:** oturumda müşteri kimliği yok ve `destek`/`dokuman`/`panel`
bölümlerindeki hiçbir ekran `SCREEN_PERM`'de değil — açık her ekran koleksiyonunun
tamamını basıyor.

**Yapılacaklar**

- [ ] `DB.permMatrix.musteri.gor` → `'musteri'`, `rapor` → `'musteri'`
- [ ] `buildSession`'a **müşteri ekseni**: rol `musteri` ise kimlik bir
      `DB.contacts` kaydından kurulur (`{ contact, musteri, ad, eposta }`),
      `emp` **null** kalır. Personel gibi davranmayı bitirir.
- [ ] `login.js`'e müşteri personası (var olan `DB.contacts` kayıtlarından —
      uydurma kişi yok)
- [ ] `GV.perm.scope('gor')==='musteri'` iken `me.emp`'e bakan her yer düzeltilsin;
      `emp` null ise kişisel bloklar **basılmasın** (`app-panel-ozet` timesheet bloğu)
- [ ] Ulaşılan 18 ekrandan veri basanların hepsine `scopeField:{ musteri:'musteri' }`
      (`app-destek` · `app-dokuman` · `app-destek-paket` · `app-destek-memnuniyet`)
- [ ] `app-ajanda.html` · `app-panel-onaylar.html` · `app-panel-duyurular.html` ·
      `dashboard.js` `dashMusteri` — kapsam süzgeci **veya** `SCREEN_PERM` kapısı.
      Kapsamı olmayan bir ekran müşteriye açık bırakılmaz
- [ ] `app-destek-detay.html` kayıt sahipliği kontrolü: `?id=`'nin müşterisi
      oturumun müşterisi değilse 403 durumu
- [ ] `dashMusteri` (`dashboard.js:680-696`) sabit `1` değerleri **türetilsin**:
      aktif projelerim · bekleyen onaylarım · son teslimatlarım · açık taleplerim ·
      yaklaşan toplantılarım — beşi de kapsamlı
- [ ] `proje` bölümü müşteri rolüne **kapsamlı** açılsın (`SEC_BY_ROLE.musteri`);
      "Projelerim" dokümanın istediği tek yeni erişimdir ve **yeni ekran açmaz** —
      var olan `app-proje` / `app-proje-milestone` / `app-proje-teslim` kapsamlanır
- [ ] `finans` bölümü **açılmaz**; talimat "yetki verilmişse" diyor ve bugün o yetkiyi
      ifade eden bir eksen yok. → **V2'ye bağlı** (aşağıya bakınız)
- [ ] `canon.js` eksen 30: "müşteri rolünün ulaşabildiği her liste ekranı bir
      `scopeField.musteri` bildirir" — sızıntı bir daha sessizce doğmasın

**V2'ye bağlı kalan parça (tek madde):**

| Parça | Neden |
|---|---|
| **Müşteriye fatura/ödeme görünürlüğü** | "Yetki verilmişse" bir **kullanıcı bazlı yetki kaydı** ister; prototipte yetki rol düzeyinde ve `finans` tek bayrak. Rolü `finans:true` yapmak **tüm** müşterilere tüm finansı açardı. Uydurma çözüm üretilmez. |

**V2-03 bu turda KAPANIR** — gerekçesi ("backend") ölçümle yanlışlandı (G-2).

---

## R17 · Bakım paketini hizmet paketi / abonelik mantığına genişlet

**DURUM: 🟡 kısmen — 9 alanın 5'i tam, 1'i kısmi, 1'i seyrek, 2'si YOK; `tip` yok**

Ölçüm (`DB.supportPackages`, 7 kayıt, 14 alan):

| Doküman alanı | Durum | Fill |
|---|---|---|
| Müşteri | ✅ `musteri` | 7/7 |
| Hizmet | ⚠️ `ad` — **2 değer**, ikisi de "Bakım" (`Kurumsal Bakım` 4 · `Standart Bakım` 3) | 7/7 |
| Başlangıç | ✅ `baslangic` | 7/7 |
| Bitiş | ✅ `bitis` | 7/7 |
| Periyot | ⬜ **yok** — `donemAy()` ile `baslangic`/`bitis`'ten çalışma anında çıkarılıyor | — |
| Tutar | ✅ `tutar` (net) | 7/7 |
| Yenileme tarihi | ⚠️ `yenilemeTarihi` | **2/7** |
| Sorumlu | ⬜ **yok** — formun ipucu metni (`:549`) adını koyamadığı bir sorumlunun varlığını varsayıyor | — |
| Durum | ✅ `durum` (`Aktif` 6 · `Sona erdi` 1) | 7/7 |
| **Paket tipi** | ⬜ **yok** — dokümanın 10 tipinden hiçbiri | — |

- Repoda **abonelik/tekrarlayan gelir kavramı yok**: "abonelik" kelimesinin üç ayrı
  ve ilgisiz anlamı var (ön analiz bayrağı · demirbaş kategorisi · kendi SaaS paketimiz).
  `app-rapor-finans.html`'de "Tekrarlayan Gelir" **0 sonuç**.
- Tek tekrarlayan gelir hesabı `app-destek-paket.html:56` `yillikGelir(p)` —
  hesaplanıyor ama hiçbir rapora çıkmıyor (R20 ile aynı boşluk).
- Yenileme mekaniği `DB.contracts` ile **birebir aynı alan adlarını** kullanıyor
  (`ops.js:544` bunu bilerek yazmış) ama iki alt sistem veride **bağlı değil**
  (`sozlesme` 1/7).
- `app-destek-paket.html` `GV.list`'i **tam sözleşmeyle** kullanıyor
  (5 KPI · 5 sekme · 16 kolon · 7 süzgeç · 4 satır aksiyonu · 2 toplu işlem).

**Yapılacaklar**

- [ ] `DB.servicePackageTypes` sözlüğü — dokümanın 10 tipi. Mevcut 7 kayıt
      `Bakım` tipini alır (**gerçekleri budur**, uydurma tip atanmaz)
- [ ] `DB.supportPackages[].tip` · `.periyot` (`Aylık · 3 Aylık · 6 Aylık · Yıllık`,
      var olan `donemAy()` hesabından türetilir) · `.sorumlu` (müşteri sorumlusundan)
- [ ] `ad` alanı **hizmet adı** olarak kalır; tip ayrı eksende — ikisi tek alana
      sıkıştırılmaz (VB-20'nin hatası)
- [ ] Ekran adı / menü etiketi **değişmez** — talimat yeni modül istemiyor.
      Liste `tip` kolonu + süzgeci kazanır, sekmeler tipe göre gruplanır
- [ ] Sözleşme bağı güçlendirilsin: `sozlesme` 1/7 → gerçek sözleşmesi olan
      paketlerde doldurulur (müşteri + tarih kesişiminden türetilir, kaynağı yazılır)
- [ ] Yenileme akışı **yeniden kurulmaz** — bugünkü `yenile()` yordamı korunur;
      yalnız sözleşme yenilemesiyle ortak `domain.js` yordamına taşınır
      (iki alt sistem aynı işi iki yerde yapıyor — talimatın "aynı özelliği iki
      yerde kurma" kuralı bunu **birleştirmeyi** gerektiriyor)
- [ ] `canon.js` eksen: "`periyot` ile `baslangic`/`bitis` aralığı çelişmez"

---

# FAZ 4 — SADELEŞTİRME

## R14 · Pipeline görünümünü grupla

**DURUM: 🟡 kısmen — kanban 13 kolon, 5'i boş; ama gruplama fikri AYNI DOSYADA zaten var**

Ölçüm:

- `app-pipeline.html:141-151` — kanban `DB.pipelineStages`'in `sira <= 13` olanlarını
  kolon yapıyor: **13 kolon**, 12 aday için.
- Aday dağılımı: 13 kolonun **5'i boş** (Ön görüşme · Fiyatlandırma ·
  Teklif hazırlanıyor · Revize teklif · Sözleşme aşaması). Dolu olanlar:
  Yeni talep 2 · İlk iletişim 1 · İhtiyaç analizi 1 · Teknik değerlendirme 1 ·
  Ön analiz 1 · Teklif iletildi 1 · Müşteri değerlendirmesinde 1 · Kazanıldı 2.
- ✅ **`sira` aralığıyla gruplama kalıbı zaten var** — `app-pipeline.html:93-100`
  tablo sekmeleri: `erken` (`sira<=4`) · `analiz` (5–8) · `kapanis` (`>=9`).
  Kanban'a uygulanmamış, o kadar.
- Kanban ortak bileşende: `ui.js:882-899`. Kolonlar `cfg.kanban.columns`'tan,
  gruplama `String(r[groupBy]) === String(key)` ile — yani **ham alan değeri**.
- `DB.pipelineStages`'te `grup` alanı yok.

**Yapılacaklar**

- [ ] `DB.pipelineStages[].grup` alanı — `sira` bölüntüsü: 1–3 `Yeni / Kalifikasyon` ·
      4–6 `Analiz` · 7–9 `Teklif` · 10–11 `Pazarlık` · 12 `Sözleşme` · 13–15 `Sonuç`.
      **15 aşamanın hiçbiri silinmez** (talimat: "mevcut aşamaları kaldırma")
- [ ] `GV.list` kanban'ına `groupOf(row)` kancası — ortak katmanda, ~3 satır
      (`ui.js:887`). Bugünkü `groupBy` davranışı **değişmez**, yeni kanca opsiyonel
- [ ] `app-pipeline.html` kanban'ı **6 kolona** insin; kart üzerinde gerçek alt aşama
      rozet olarak görünmeye devam etsin
- [ ] Detay ve tablo görünümü **aynen kalsın** — alt aşama orada tam gösterilir
- [ ] Tablo sekmelerindeki 3'lü bölüntü yeni 6'lı grupla **çelişmesin**; tek
      kaynaktan (`grup` alanı) beslensin — iki yerde iki bölüntü yaşamaz

---

## R15 · Departman ve uzmanlık yapısını sadeleştir

**DURUM: ⬜ yok — 16 personel için 21 departman; 6'sı boş, 2'si çalışma tipi**

Ölçüm:

| Departman | Personel (gerçek) | Dokümandaki karşılığı |
|---|---:|---|
| DEP-01 Yönetim | 1 | Yönetim & Operasyon |
| DEP-02 Satış ve İş Geliştirme | 2 | Satış & Müşteri |
| DEP-03 Müşteri İlişkileri | **0** | Satış & Müşteri |
| DEP-04 İş Analizi | **0** | Proje / Ürün |
| DEP-05 Proje Yönetimi | 1 | Proje / Ürün |
| DEP-06 UI/UX Tasarım | 1 | Tasarım |
| DEP-07 Front-end Geliştirme | 2 | **Yazılım** · uzmanlık `Frontend` |
| DEP-08 Back-end Geliştirme | 1 | **Yazılım** · uzmanlık `Backend` |
| DEP-09 Mobil Uygulama Geliştirme | 1 | **Yazılım** · uzmanlık `Mobile` |
| DEP-10 Yapay Zekâ ve Veri | 1 | Yapay Zekâ & Data |
| DEP-11 Test ve Kalite | 1 | **Yazılım** · uzmanlık `QA` |
| DEP-12 DevOps ve Sistem Yönetimi | 1 | **Yazılım** · uzmanlık `DevOps` |
| DEP-13 Teknik Destek | 1 | Destek |
| DEP-14 İnsan Kaynakları | 1 | Finans / Kurumsal |
| DEP-15 Muhasebe ve Finans | 1 | Finans / Kurumsal |
| DEP-16 Satın Alma | **0** | Finans / Kurumsal |
| DEP-17 İdari İşler | **0** | Yönetim & Operasyon |
| DEP-18 Pazarlama | **0** | Satış & Müşteri |
| DEP-19 İçerik Üretimi | **0** (`aktif:false`) | Satış & Müşteri |
| DEP-20 Dış Kaynak Ekipler | **0** | ❌ departman değil — **çalışma tipi** (R16) |
| DEP-21 Freelancer ve Çözüm Ortakları | 1 | ❌ departman değil — **çalışma tipi** (R16) |

Beş departman aslında **uzmanlıktır** (DEP-07/08/09/11/12 → Yazılım),
iki departman aslında **çalışma tipidir** (DEP-20/21), altı departman **boştur**.

Personelde uzmanlık ekseni yok; en yakını `pozisyon` (serbest metin) ve
`yetkinlik` (dizi, teknoloji odaklı).

**Yapılacaklar**

- [ ] `DB.departments` **silinmez** (talimat: "mevcut departman verilerini silme").
      Her kayda `ustDepartman` alanı eklenir; 21 kayıt dokümandaki **8 ana
      departmana** bağlanır. Menü ve süzgeçler ana departmanı gösterir, detay
      alt kırılımı korur.
- [ ] `DB.specialities` sözlüğü açılır (Yazılım altı 6 · AI altı 5 · diğerleri)
- [ ] `DB.employees[].uzmanlik` alanı — mevcut `dep` + `pozisyon`'dan **türetilir**,
      uydurulmaz
- [ ] DEP-20 / DEP-21 departman olmaktan çıkar → R16'nın `calismaTipi` eksenine taşınır;
      EMP-015 gerçek departmanına (**DEP-06 Tasarım** — yöneticisi zaten EMP-004,
      pozisyonu "Freelance Grafik Tasarımcı") + `calismaTipi:'Freelancer'` olur
- [ ] `depAd` denormalize kopyası 16/16 kayıtta güncellenir; `DB.departments[].personel`
      sayacı da (`app-ayar-departman.html` zaten ona güvenmiyor, `kadro()` ile sayıyor)

> ✅ **İyi haber — hiçbir ekran departman ADI listesini elle yazmıyor.** 22 dropdown
> `DB.departments`'ten türetiyor. Kırılabilecek tek şey **5 sabit DEP kodu**:
> `app-arac-muayene.html:97` (`DEP-17`) · `app-izin-detay.html:56,58,411`
> (`DEP-14` + `d.ad === 'İnsan Kaynakları'` **ad üzerinden eşleşme**) ·
> `app-teklif-form.html:140` (`DEP-02`) · `app-istalebi-form.html:153` ·
> `assets/data/ops.js` `DB.vehicles[].dep`. Beşi de tek tek kontrol edilir.

**Dokunulacak dosyalar:** `assets/data/org.js` · `assets/data/hr.js` ·
`app-ayar-departman.html` · `app-personel.html` · `app-personel-detay.html` ·
`app-personel-form.html` · `app-kapasite.html` · `app-rapor-personel.html`

## R16 · Freelancer / dış kaynağı departman olarak kullanma

**DURUM: 🟡 kısmen — `calismaTuru` VAR ama başka ekseni anlatıyor**

Ölçüm (16 personel):

| Alan | Değerler | Dağılım |
|---|---|---|
| `calismaTuru` | Tam zamanlı · Proje bazlı · Yarı zamanlı | 14 · 1 · 1 |
| `sozlesme` | Belirsiz süreli · Belirli süreli · Hizmet sözleşmesi · Staj sözleşmesi | 13 · 1 · 1 · 1 |
| Freelancer/Dış kaynak departmanında | DEP-21: **1** · DEP-20: **0** | — |
| `DB.roles` | `freelancer` · `diskaynak` rolleri **var** (kademe 4) | 0 personelde |

`calismaTuru` **mesai eksenidir** (tam/yarı zamanlı), dokümanın istediği
**istihdam ilişkisi ekseni** değil. İkisi farklı: bir freelancer tam zamanlı da
çalışabilir. Var olan alanı yeniden anlamlandırmak, iki ekseni tek alana
sıkıştırmak olurdu — VB-20'nin tam olarak düştüğü hata.

**Yapılacaklar**

- [ ] `DB.workTypes` sözlüğü: `Kadrolu · Freelancer · Ajans · Danışman · Dış Kaynak`
- [ ] `DB.employees[].calismaTipi` alanı — **`calismaTuru` korunur**, yanına gelir.
      Değer var olan `sozlesme` + `dep` alanlarından türetilir
      (Hizmet sözleşmesi + DEP-21 → `Freelancer`; Staj sözleşmesi → `Kadrolu`;
      geri kalan 14 → `Kadrolu`)
- [ ] Personel listesinde süzgeç ve kolon olarak görünsün (**yeni ekran açılmaz**)
- [ ] R04'ün "dış kaynak maliyeti" kalemi bu eksenden beslensin
- [ ] R15 ile birlikte: DEP-20/21 çalışma tipine taşınınca departman olarak
      **silinmez**, `aktif:false` yapılır ve kayıtları taşınır

**Dokunulacak dosyalar:** `assets/data/hr.js` · `assets/data/org.js` ·
`app-personel.html` · `app-personel-detay.html` · `app-personel-form.html`

## R18 · Opsiyonel modül kullanımını oluştur

**DURUM: ⬜ yok — modül anahtarı hiçbir yerde yok; ama gizleme mekaniği HAZIR**

Ölçüm:

- `app-ayar-sirket.html` 5 sekme: Kimlik · Çalışma Düzeni · Tatil Günleri ·
  Finansal Varsayılanlar · Çoklu Şirket. **Modül anahtarı yok.**
- Repoda `aktifModul`/`modules` → **0 sonuç** (tek istisna
  `app-ayar-entegrasyon.html`'deki `moduller` dizisi, **entegrasyonun dokunduğu
  modülleri** anlatıyor — başka eksen).
- Menü: `shell.js:21-169` — **15 bölüm · 90 bağlantı · 13 alt başlık**.
- ✅ **Koşullu gizleme zaten çalışıyor:** 11 menü maddesi `roles:[…]` ile gizleniyor
  (`Perm.item`, `shell.js:285`, uygulandığı yer `:418`), her biri `SCREEN_PERM`'de
  de kapalı — yani doğrudan adres de engellenir. Kopyalanacak kalıp bu.
- Bağlanma noktası **tek yer**: `Perm.sec()` (`shell.js:280`) — rail (`:362`),
  menü (`:418`) ve 403 kapısı (`:554`) üçü de ondan geçiyor.

> ⚠️ **Modül ≠ bölüm.** Dokümanın 8 anahtarı 15 bölüme birebir oturmuyor ve
> **"Demirbaş" ile "Filo" AYNI bölüm** (`varlik`, 9 madde: 2 demirbaş + 7 filo,
> `seclbl:'Araç ve Filo'` ayracıyla `shell.js:104`). Yani eşleme bölüm düzeyinde
> değil, **madde düzeyinde etiketle** yapılır.

**Yapılacaklar**

- [ ] `DB.company.aktifModuller` — 8 anahtar (`satis · proje · destek · personel ·
      finans · satinalma · demirbas · filo`), varsayılan hepsi açık
- [ ] `SECTIONS` maddelerine `modul:'filo'` gibi etiket (yalnız gerekenlere).
      `varlik` bölümü: `app-arac-*` maddeleri `filo`, demirbaş/zimmet `demirbas`
- [ ] `Perm.sec` ve `Perm.item`'a modül testi — **tek yerde**, üç tüketici otomatik
- [ ] `guard()` de kapansın: kapalı modülün ekranı doğrudan adresle de açılmasın —
      **ama veri ve dosya yerinde kalır** (G-1 kararı)
- [ ] Bir bölümün tüm maddeleri gizlendiyse bölüm rail'den de düşsün
- [ ] `app-ayar-sirket.html`'e **yeni sekme açılmadan** "Çalışma Düzeni" sekmesine
      Aktif Modüller bloğu (mevcut switch kontrolüyle)
- [ ] `tasks/qa/gate.js` ve `links.js` kapalı modülü hata saymasın

---

## R19 · Araç sayfalarını detay tablarında sadeleştir

**DURUM: 🟢 neredeyse hazır — YEDİ alanın YEDİSİ zaten `app-arac-detay.html`'de tab**

Ölçüm — bu maddenin ölçümü beklentiyi tersine çevirdi:

| Alan | Merkezî liste | Form | **Araç detayında tab** | Sidebar maddesi |
|---|---|---|---|---|
| Muayene | ✅ | ✅ | ✅ tab 4 | ✅ |
| Sigorta | ✅ | ✅ | ✅ tab 5 (bölüm) | ✅ (ortak) |
| Kasko | ⚠️ sekme | ⚠️ ortak | ✅ tab 5 (bölüm) | ⚠️ ortak |
| Bakım | ✅ | ✅ | ✅ tab 3 | ✅ |
| Yakıt | ✅ | ✅ | ✅ tab 6 | ✅ |
| Ceza | ⚠️ sekme | ⚠️ ortak | ✅ tab 8 (bölüm) | ⚠️ ortak |
| Gider | ✅ | ✅ | ✅ tab 7 | ✅ |

`app-arac-detay.html` **10 sekme** taşıyor (`:205-216`) ve 31 filo kaydının
tamamını tek ekranda basıyor. Dokümanın istediği 7 sekmenin **6'sı zaten var**;
eksik olan tek şey **"Evraklar"** sekmesi. "Hareket Geçmişi" = mevcut
"Aktivite Geçmişi".

**Ölçek:** **4 araç** için 7 üst düzey menü maddesi, 7 liste ekranı, 7 form.
`app-arac-kaza.html` **3 kaydı** olan bir birleşimi sunuyor.

Ayrıca **Kasko ve Ceza zaten ayrı menü maddesi değil** — Sigorta ve Kaza içine
katlanmışlar. Geri kalanı katlamak için izlenecek örnek bu.

**Yapılacaklar**

- [ ] Sidebar'daki **6 filo alt maddesi** (Bakım · Muayene · Sigorta ve Kasko ·
      Yakıt · Giderler · Kaza ve Ceza) menüden kalksın; **Araçlar** kalır.
      Ekranlar **silinmez**, `BUILT`'te kalır, doğrudan adresle ve araç detayındaki
      "…ekranı" bağlantılarıyla erişilir (G-1)
- [ ] Araç detayına **Evraklar** sekmesi — yeni koleksiyon açılmadan: ruhsat/poliçe/
      muayene belgeleri `DB.documents`'tan `arac` bağı ile okunur
      (`DB.documents[].arac` alanı açılır, VB-15 kalıbı)
- [ ] Sigorta ve Muayene sekmeleri **birleştirilmez** — bugün ayrı ve doluları var;
      doküman "kullanılabilir" diyor, zorunlu kılmıyor. Birleştirmek çalışan bir
      ayrımı bozardı
- [ ] Merkezî listelerin üst bilgisine "araç detayından da erişilir" bağlantısı
- [ ] R18 ile birlikte: `filo` modülü kapalıysa **Araçlar** maddesi de gizlenir

---

## R20 · Raporları ana kategoriler altında grupla

**DURUM: 🟡 kısmen — kategori sayfalarının İÇİNDE gruplama VAR; ihlal yalnız `app-rapor.html`'de**

Ölçüm:

| Bulgu | Değer |
|---|---|
| Rapor ekranı | 8 (1 dizin + 7 kategori), toplam **8.758 satır** |
| `app-rapor.html` ilk açılış | `:380` — **7 kategori kartı + 99 rapor çipi, hepsi aynı anda** |
| Sidebar rapor maddesi | **8** (1 merkez + 7 kategori) |
| Kategori sayfası içi gruplama | ✅ **var** — her rapor `group` alanı taşıyor, `GV.report` `navHtml()` (`ui.js:2313-2323`) başlık basıyor |
| Aynı anda gösterilen rapor | ✅ **1** — `ui.js:2251` yalnız `?r=` veya ilkini açıyor |

Yani talimatın *"ilk açılışta bütün raporları aynı anda gösterme"* kuralı
**kategori sayfalarında zaten uygulanıyor**; ihlal eden tek ekran dizin sayfası.

⚠️ **Ölçüm bir borç daha ortaya çıkardı (VB-26'nın somut hâli):** `app-rapor.html`
kataloğu "99 rapor" diyor, yedi ekranda kurulu gerçek sayı **103**. `proje`
kategorisi katalogda **8** rapor sayıyor, ekranda **12** var ve **anahtarların
hiçbiri tutmuyor**; `finans`'ta 9 anahtar büyük/küçük harf farkıyla ayrışıyor.
İkisi de `deep:false` olduğu için kırıklık görünmüyor.

Dokümanın 6 kategorisi ↔ bugünkü 7 kategori **kesişiyor ama örtüşmüyor** —
bugünkü eksen *konu nesnesi* (Müşteri/Personel/Görev/Referans/Filo/Finans/Proje),
dokümanınki *iş işlevi* (Satış/Proje/İK/Finans/Destek/Sözleşmeler).

| Dokümanın istediği | Durum |
|---|---|
| ~11 rapor | ✅ var |
| Pipeline · Gider · Açık Ticket · SLA · Çözüm Süresi · Yaklaşan Bitişler | ⚠️ ekran/KPI olarak var, **rapor olarak yok** |
| Yenilemeler | ⚠️ var ama **yanlış kategoride** (`app-rapor-musteri` → "Satış ve Fırsat") |
| **Tekrarlayan Gelir** | ❌ **hiçbir biçimde yok** — veri hazır (`DB.supportPackages` 7 kayıt, `yillikGelir()` hesabı `app-destek-paket.html:56`) |

**Yapılacaklar**

- [ ] `app-rapor.html` ilk açılışta **kategori kartlarını kapalı** göstersin;
      çipler kategori açılınca gelsin. Arama kutusu **kalır** ve arama sonuçları
      açık gelir — kullanıcı fazla tıklamaya zorlanmaz
- [ ] Katalog ile kurulu raporlar **anahtar düzeyinde eşleşsin** — katalog artık
      ekranlardan **türetilsin**, elle yazılmasın (VB-26 kapanır, L-08)
- [ ] Kategori ekseni dokümanın 6 grubuna **etiketle** yaklaştırılsın: her rapora
      `isGrup` alanı (Satış · Proje · İnsan Kaynağı · Finans · Destek · Sözleşmeler)
      eklenir; dizin ekranı isterse iş işlevine göre de gruplayabilir.
      **7 kategori ekranı ve 8 sidebar maddesi olduğu gibi kalır** — talimat
      "yeni ana menü açma" ve "çalışan modülü kaldırma" diyor
- [ ] Eksik iki rapor **var olan ekranlara** eklensin, yeni ekran açılmadan:
      - `Tekrarlayan Gelir` → `app-rapor-finans.html`, grup *Nakit*
        (`DB.supportPackages` + `yillikGelir()`; R17'nin `periyot` alanı bunu besler)
      - `Sözleşme yaklaşan bitişler` → `app-rapor-finans.html`, yeni grup *Sözleşmeler*;
        `Yenileme fırsatları` raporu da oraya taşınır
- [ ] Destek raporları (`Açık Ticket · SLA · Çözüm Süresi`) → **`app-rapor-musteri.html`**
      içindeki mevcut `destek` raporu genişletilir; **`app-rapor-destek.html`
      AÇILMAZ** (yeni ana modül yasak, veri 7 kayıt)
- [ ] `filo` raporları R18'in `filo` modülüne bağlansın
