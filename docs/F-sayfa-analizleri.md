# F. Sayfa Analizleri — GaviaWorks CRM

> **Neyden türetildi:** 141 `app-*.html` ekranının tamamı tek tek okunarak; bölüm ve rol
> eşlemesi `assets/js/shell.js` → `SECTIONS` / `SEC_BY_ROLE` / `SCREEN_PERM`; bileşen
> sözleşmeleri `tasks/components.md`. Ölçüm 2026-08-05 (9. oturum).
> PROMPT.md §26-F'nin istediği 18 eksenin tamamı her ekranda aynı sırayla yazıldı.
>
> **Kapsam:** 141 / 141 ekran. Dört modül grubuna bölünüp paralel üretildi, tek dosyada
> birleştirildi; gruplar kesişimsizdir ve toplamları diskteki ekran envanterine birebir eşittir.
>
> **Uyarı — bu doküman bir DURUM TESPİTİdir, tasarım belgesi değildir.** "Boş durum tanımlı
> değil", "toplu işlemin `run`'ı yok" gibi satırlar ekranın bugünkü hâlini anlatır; düzeltmeleri
> `tasks/ui-debt.md` taşır.

## İçindekiler

| Bölüm | Kapsam | Ekran |
|---|---|---|
| 1 | Müşteri, satış ve ana panel | 30 |
| 2 | Proje, görev, destek ve sohbet | 32 |
| 3 | İnsan kaynakları, demirbaş ve filo, toplantı, doküman | 39 |
| 4 | Finans, satın alma, raporlar ve ayarlar | 40 |
| | **TOPLAM** | **141** |


---

## Bölüm 1 — Müşteri, Satış ve Ana Panel

*30 ekran.*

### `app-panel.html` — Ana Panel (Rol Bazlı Dashboard)

**Tip:** panel
**Bölüm:** `panel` · menü etiketi "Dashboard" (`SECTIONS.panel.menu[0]`, `screen:'panel'`)
**Amaç:** Oturum sahibinin rolüne göre değişen 7 varyantlı şirket panosunu tek ekranda basmak.
**Kullanıcılar:** tüm roller — `SEC_BY_ROLE`'daki 27 rolün 27'sinde `panel` bölümü var; ekran seviyesinde `SCREEN_PERM` kaydı yok.
**Veri kaynağı:** `assets/js/dashboard.js` üzerinden okunur: `DB.activities` · `DB.announcements` · `DB.approvals` · `DB.assets` · `DB.assignments` · `DB.capacity` · `DB.channels` · `DB.customers` · `DB.departments` · `DB.deptRequests` · `DB.documents` · `DB.employees` · `DB.inspections` · `DB.interactions` · `DB.leads` · `DB.leaves` · `DB.maintenance` · `DB.meetings` · `DB.milestones` · `DB.orders` · `DB.payments` · `DB.performance` · `DB.pipelineStages` · `DB.policies` · `DB.projects` · `DB.purchases` · `DB.quotes` · `DB.roles` · `DB.supplierQuotes` · `DB.suppliers` · `DB.tasks` · `DB.tickets` · `DB.timelogs` · `DB.trainings` · `DB.vehicles`
**Üst özet kartları:** `kpis[]` yok — `.kpi-grid > .kpi` markup'ı `dashboard.js`'in kendi `kpi()` yardımcısıyla basılır. Varyant başına KPI sayısı: `sahip` 16 · `satis` 12 · `pm` 12 · `personel` 12 · `ik` 12 · `satinalma` 12 · `musteri` 4. Varyant seçimi `DB.roles[].dash` alanından gelir, karşılığı yoksa `personel`e düşer.
**Sekmeler:** yok — sekmesiz pano.
**Arama:** yok.
**Filtreler:** yok.
**Tablo kolonları:** `columns[]` yok; kart içi tablolar `dashboard.js` `rows()/row()` yardımcılarıyla elle basılır. Kart başlıkları varyanta göre: Bekleyen Onaylar · Geciken Görevler · Son Hareketler · Yaklaşan Toplantılar · Riskli Müşteriler · Departman İş Yükü · Sonraki Aksiyonlar · Uzun Süredir İşlem Yapılmayan Fırsatlar · Pipeline Dağılımı · Bugünkü Görüşmeler · Proje Sağlık Durumu · Engellenen ve Kontrol Bekleyen İşler · Yaklaşan Milestone · Proje Riskleri · Bana Verilen Görevler · Bu Haftaki Zaman Kayıtlarım · Duyurular · Zimmetlerim · Onay Bekleyen İzin Talepleri · Personel Doluluk Oranları · Süresi Dolan Belgeler · Planlı Eğitimler · Onay Bekleyen Satın Alma Talepleri · Araç Uyarıları · Zimmet Bekleyen Ekipman · Lisans ve Garanti Takibi · Destek Kayıtlarım.
**Form alanları:** —
**Detay sekmeleri:** —
**İşlem butonları:** `GV.pageHead` **çağrılmıyor**; başlık `dashboard.js` `greeting()` içinde elle basılır ve `#gvGreeting` düğümünü değiştirir. İki aksiyon: "Günlük Özet" (`app-panel-ozet.html`) · "Görev Ver" (`app-gorev-form.html`). Kart başlıklarındaki "Tümü →" bağlantıları ilgili liste ekranına gider.
**Toplu işlemler:** yok.
**Bildirimler:** yok — ekran salt okunurdur, mutasyon yapmaz.
**Yetkilendirme:** ekran seviyesinde kapı yok. Rol ayrımı `DB.roles[].dash` üzerinden **içerik** seçimiyle yapılır; `GV.perm.can(...)` çağrısı bu ekranda hiç yok.
**Boş durum:** kart bazında `GV.empty(...)` — "Bekleyen onay yok" · "Geciken görev yok" · "Planlı toplantı yok" · "Riskli müşteri yok" · "Tıkanan fırsat yok" · "Engellenen iş yok" · "Kayıtlı risk yok" · "Açık göreviniz yok" · "Zaman kaydı yok" · "Zimmetli ekipman yok" · "Bekleyen izin talebi yok" · "Süresi dolan belge yok" · "Onay bekleyen talep yok" · "Araç uyarısı yok" · "Depoda bekleyen ekipman yok" · "Yaklaşan yenileme yok".
**Hata durumu:** var — `dashboard.js` içindeki `try/catch` `GV.errorState({title:'Panel yüklenemedi'})` basar, `[data-retry]` düğmesi `location.reload()` çalıştırır.
**Mobil görünüm:** `mobile(r)` yok. Kart içi tablolar `.gv-tablewrap` içinde; ≤760px'de bu sarmalayıcı gizlendiği için mobil karşılığı üretilmez.
**Kabul kriterleri:**
1. `DB.roles[].dash` değeri olan 7 varyantın her biri konsol hatasız açılmalı; tanımsız rolde `personel` varyantı basılmalı.
2. Açılışta 240 ms boyunca `GV.skeleton('row', 6)` iskeleti görünmeli, sonra içerik gelmeli.
3. `document.title` rol adıyla yeniden yazılmalı (`<rolAd> Paneli — GaviaWorks CRM`).
**Bulgular:** (a) `GV.dashboard` ölçülmüş 37 üyelik `GV.*` yüzeyinde **yok** — çünkü o ölçüm yalnız `ui.js` + `shell.js` taradı; ad gerçekten `assets/js/dashboard.js:706`'da tanımlı, yani yüzey 38 üyedir ve sözlükte bu üçüncü dosya eksik. (b) Ekran shell iskeletini **elle yazıyor** (`.gv-app` markup'ı sayfada), `buildSkeleton()` erken dönüyor; bu yüzden `GV.pageHead` bu sayfada hiç çalışmaz — UID-15 borcunun bir örneği. (c) `dashMusteri()` içinde "Aktif projem" ve "Bekleyen onayım" değerleri veriden türetilmeden `1` olarak sabit yazılı.

---

### `app-panel-ozet.html` — Günlük Özet

**Tip:** özel (kişisel gün panosu)
**Bölüm:** `panel` · menü etiketi "Günlük Özet" (`screen:'ozet'`, `seclbl:'Gündem'` grubu)
**Amaç:** Oturum sahibinin bugününü tek ekranda toplamak — ajanda, düşen işler, dikkat gerektirenler, onaylar, duyurular ve son hareketler.
**Kullanıcılar:** tüm roller. İçerik `GV.perm` ile daraltılır, ekran kapatılmaz.
**Veri kaynağı:** `DB.tasks` · `DB.meetings` · `DB.approvals` · `DB.notifications` · `DB.timelogs` · `DB.projects` · `DB.leaves` · `DB.invoices` · `DB.purchases` · `DB.tickets` · `DB.policies` · `DB.inspections` · `DB.vehicles` · `DB.customers` · `DB.leads` · `DB.announcements` · `DB.activities` · `DB.logs` · `DB.employees` (`DB.empName`) · `DB.today`
**Üst özet kartları:** 6 KPI (`.kpi-grid` elle basılır, `GV.list` config'i değil): Bugün terminli görevim · Geciken görevim · Bugünkü toplantım · Bekleyen onayım · Okunmamış bildirimim · Bugün kaydettiğim saat.
**Sekmeler:** yok.
**Arama:** yok.
**Filtreler:** yok — kapsam yetkiyle belirlenir (`GV.perm.scope('gor') === 'tum'` ise tüm şirket, değilse yalnız oturum sahibi).
**Tablo kolonları:** `columns[]` yok. Blok bazlı elle tablo: Bugünün Ajandası (saat · olay · tür · durum) · Bana Düşenler (görev · öncelik · termin · durum · ilerleme) · Dikkat Gerektirenler (tür · kayıt · değer · durum) · Onayımı Bekleyenler (konu · tutar · aciliyet · tarih) · Duyurular (başlık · öncelik · tarih).
**Form alanları:** —
**Detay sekmeleri:** —
**İşlem butonları:** `GV.pageHead` — "Tam takvim" (`app-ajanda.html`) · "Rol paneli" (`app-panel.html`). `rowActions[]` yok; satırlar doğrudan hedef kayda bağlanır.
**Toplu işlemler:** yok.
**Bildirimler:** `GV.notice` — sayfa başındaki selamlama kutusu (`tone:'warn'` geciken görev varsa, yoksa `info`), iki aksiyonlu ("Tam takvimi aç" · "Bildirim merkezi"). `GV.toast` / `GV.result` yok, ekran mutasyon yapmaz.
**Yetkilendirme:** `GV.perm.scope('gor')` (kapsam) · `GV.perm.can('onay')` (Onayımı Bekleyenler bloğu) · `GV.perm.can('finans')` (tutar) · `GV.perm.can('log')` (log satırları) · `GV.perm.can('personel')` (başkasının izni) · `GV.perm.sec('finans'|'satinalma'|'destek'|'varlik'|'musteri')` (Dikkat Gerektirenler kaynak seçimi) · `GV.perm.mask(null,'finans')` (tutar maskesi). Hiçbir kaynağa yetki yoksa "Dikkat Gerektirenler" kartı **hiç basılmaz**; onay yetkisi yoksa "Onayımı Bekleyenler" kartı basılmaz.
**Boş durum:** `GV.empty` beş blokta ayrı ayrı tanımlı — "Bugün için kayıt yok" (açıklamasında sıradaki 30 gün içindeki ilk olay yazılır) · "Bugüne düşen görev yok" · "Dikkat gerektiren kayıt yok" · "Bekleyen onayınız yok" · "Duyuru yok" · "Son iki günde hareket yok".
**Hata durumu:** `GV.errorState` **yok**.
**Mobil görünüm:** var — her satır aynı veriden hem `<tr>` hem `.gv-cardlist > .gv-mrow` olarak üretilir (`table()` yardımcısı ikisini birlikte basar).
**Kabul kriterleri:**
1. KPI değerleri `DB.today` eksenine göre hesaplanmalı; `new Date()` ile bugün alınmamalı.
2. Onay/finans/personel yetkisi olmayan rolde ilgili blok hiç basılmamalı (boş kart bırakılmamalı).
3. ≤760px'de her tablo `.gv-cardlist` karşılığıyla okunabilir kalmalı.
**Bulgular:** `GV.errorState` yok; ekran veri okurken hata alırsa sessizce boş kalır (aynı bölümdeki `app-panel-yonetici.html` `try/catch` + `errorState` kullanıyor, iki ekran arasında tutarsızlık var).

---

### `app-panel-onaylar.html` — Bekleyen Onaylar

**Tip:** liste
**Bölüm:** `panel` · menü etiketi "Bekleyen Onaylar" (`screen:'onaylar'`, `cnt:'onay'` rozeti)
**Amaç:** Tüm modüllerin onay kuyruğunu tek listede toplayıp onaylama/reddetme aksiyonlarını buradan yürütmek.
**Kullanıcılar:** tüm roller (bölüm herkese açık, ekran kısıtı yok). Onaylama aksiyonu `GV.perm.can('onay')` ile kapalı.
**Veri kaynağı:** `DB.approvals` (kaynak) · `DB.employees` · `DB.empName` · `DB.priorities`
**Üst özet kartları:** 4 KPI — Bekleyen onay (`durum==='Bekliyor'` sayısı) · Kritik aciliyet (bekleyen + `aciliyet==='Kritik'`) · Bekleyen tutar (bekleyenlerin Σ`tutar`, finans yetkisi yoksa 0) · En eski bekleyen (bekleyenlerin en büyük gün farkı).
**Sekmeler:** 7 — Bekleyenler (`durum==='Bekliyor'`) · Satın Alma (`tur==='Satın alma talebi'`) · İzin (`tur==='İzin talebi'`) · Teklif ve Analiz (`Teklif iç onayı`+`Ön analiz onayı`) · Görev ve Değişiklik (`Görev onayı`+`Değişiklik talebi`+`Timesheet onayı`) · Sonuçlananlar (`durum!=='Bekliyor'`) · Tümü.
**Arama:** `search.fields` = `kod` · `tur` · `kayit` · `baslik`. `search.extra` yok.
**Filtreler:** `tur` · multi · `DB.approvals`'tan tekilleştirilir | `durum` · select · sabit `['Bekliyor','Onaylandı','Reddedildi']` | `onaylayan` · select · `DB.employees` | `aciliyet` · multi · `DB.priorities` | `tarih` · daterange.
**Tablo kolonları:** Onay konusu (kilitli, %30) · Onay türü · Talep eden · Onaylayacak · Tutar · Aciliyet · Talep tarihi · Durum. Varsayılan gizli kolon yok.
**Form alanları:** —
**Detay sekmeleri:** —
**İşlem butonları:** `GV.pageHead` — "Onay Akışları" (`app-ayar-onay.html`) · "Bildirimler" (`app-panel-bildirimler.html`). `rowActions[]` 3: **Kayda git** (`x.link`) · **Onayla** (durum kontrolü + yetki kontrolü + `GV.confirm`, `durum='Onaylandı'`) · **Reddet** (`GV.modal` ile zorunlu ret gerekçesi, `durum='Reddedildi'`).
**Toplu işlemler:** `bulk[]` 2 — "Toplu onayla" · "Dışa aktar". **Yetki kapısı yok** (satır aksiyonundaki `GV.perm.can('onay')` kontrolü toplu işlemde tekrarlanmıyor).
**Bildirimler:** `GV.toast` — "Bu onay zaten sonuçlanmış." (`info`) · "Onaylama yetkiniz yok." (`danger`) · "`<kod>` onaylandı" (`ok`) · "Gerekçe zorunludur" (`danger`) · "`<kod>` reddedildi" (`ok`). `GV.confirm` onaylamada, `GV.modal` reddetmede.
**Yetkilendirme:** `GV.perm.can('finans')` sayfa açılışında bir kez okunur; tutar kolonu ve "Bekleyen tutar" KPI'ı maskelenir (`.cell-mask ••••`, `exportValue` boş döner). `GV.perm.can('onay')` onaylama aksiyonunda. 403 kapısı yok.
**Boş durum:** `GV.empty` — "Bekleyen onay yok" / "Onay kuyruğunuz temiz — sizi bekleyen işlem bulunmuyor." Aksiyon **yok**.
**Hata durumu:** `GV.errorState` yok.
**Mobil görünüm:** `mobile(x)` var — başlık + aciliyet, tür·kayıt satırı, durum rozeti + (yetki varsa) tutar.
**Kabul kriterleri:**
1. Finans yetkisi olmayan rolde tutar kolonu `••••` göstermeli ve dışa aktarımda boş çıkmalı.
2. Onay yetkisi olmayan rol "Onayla" tıklayınca kayıt **değişmemeli**, `danger` toast basılmalı.
3. Ret akışında gerekçe boşken modal kapanmamalı.
**Bulgular:** `bulk[]` içindeki "Toplu onayla" hiçbir yetki kontrolü taşımıyor — satır aksiyonundaki `can('onay')` kapısı burada yok (UID-13 sınıfı).

---

### `app-panel-bildirimler.html` — Bildirim Merkezi

**Tip:** liste
**Bölüm:** `panel` · menü etiketi "Bildirimler" (`screen:'bildirimler'`, `cnt:'bildirim'` rozeti)
**Amaç:** Sistemin ürettiği tüm bildirimleri listelemek, okundu/okunmadı durumunu yönetmek ve kayda gitmek.
**Kullanıcılar:** tüm roller.
**Veri kaynağı:** `DB.notifications` (kaynak) · `DB.employees` · `DB.empName` · `DB.today`
**Üst özet kartları:** 4 KPI — Okunmamış (`!okundu`) · Kritik uyarı (`tone==='danger'`) · Bugün (`tarih` günü `DB.today`) · Toplam bildirim.
**Sekmeler:** 7 — Okunmamış · Kritik (`tone==='danger'`) · Görev (`tur` içinde "görev") · Onay (`tur` içinde "onay") · Araç ve Filo (`tur` içinde muayene/sigorta/kasko/bakım) · Finans (`tur` içinde tahsilat/lisans) · Tümü.
**Arama:** `search.fields` = `kod` · `tur` · `baslik` · `ozet`. `extra` yok.
**Filtreler:** `tur` · multi · `DB.notifications`'tan tekilleştirilir | `kisi` · select · `DB.employees` | `tarih` · daterange.
**Tablo kolonları:** Bildirim (kilitli, %34; okunmamışsa "Yeni" rozeti) · Bildirim türü · İlgili kişi · Tarih · Durum. Gizli kolon yok.
**Form alanları:** —
**Detay sekmeleri:** —
**İşlem butonları:** `GV.pageHead` — "Bildirim Tercihleri" (`app-ayar-bildirim.html`) · "Tümünü Okundu İşaretle" (`id:'btnOku'`, `document` üzerinde delege dinleyici). `rowActions[]` 2: **Kayda git** (`x.link`) · **Okundu işaretle** (toggle).
**Toplu işlemler:** `bulk[]` 2 — "Okundu işaretle" · "Dışa aktar". Yetki kapısı yok (bu ekranda gerekmiyor, işlem yıkıcı değil).
**Bildirimler:** `GV.toast` — "Okundu işaretlendi" / "Okunmadı olarak işaretlendi" (1600 ms) · "Okunmamış bildirim yok" (`info`) · "`<n>` bildirim okundu işaretlendi" (`ok`). `GV.confirm` toplu işaretlemede.
**Yetkilendirme:** `GV.perm` çağrısı **yok** — alan maskeleme ve 403 kapısı yok.
**Boş durum:** `GV.empty` — "Bildirim yok" / "Bu görünümde gösterilecek bildirim bulunmuyor." Aksiyon yok.
**Hata durumu:** `GV.errorState` yok.
**Mobil görünüm:** `mobile(x)` var — başlık + "Yeni" rozeti, tür·tarih satırı, özet.
**Kabul kriterleri:**
1. Okundu toggle sonrası "Okunmamış" sekmesinin sayacı anında düşmeli.
2. "Tümünü Okundu İşaretle" onaydan sonra `list.refresh()` ile tabloyu yeniden çizmeli (`GV.refresh()` değil).
**Bulgular:** (a) "Tümünü okundu" dinleyicisi `document`'e `addEventListener` ile bağlanıyor; `GV.on(el,type,fn,key)` kullanılmıyor — `GV.refresh()` çağrılan bir akış eklenirse dinleyici birikir (ders L-16). (b) `columns[].okundu` render'ı okunmamış kayıt için `GV.badge('Yeni')` basıyor; "Yeni" ton sözlüğünde tanımlı değilse nötr düşer.

---

### `app-panel-duyurular.html` — Duyurular

**Tip:** liste
**Bölüm:** `panel` · menü etiketi "Duyurular" (`screen:'duyurular'`)
**Amaç:** Şirket ve departman duyurularını listelemek, sağ panelde okutmak, okuma durumunu izlemek ve yeni duyuru yayımlamak.
**Kullanıcılar:** tüm roller. "Yeni Duyuru" aksiyonu `GV.perm.can('ekle')`, arşivleme `GV.perm.can('duzenle')` ile kapılı.
**Veri kaynağı:** `DB.announcements` (kaynak) · `DB.employees` · `DB.empName` · `DB.emp` · `DB.departments` · `DB.depName` · `DB.today`
**Üst özet kartları:** 4 KPI — Toplam duyuru · Okunmamış (yayında + okunmamış) · Bu ay yayınlanan · Arşiv / süresi dolan.
**Sekmeler:** 5 — Okunmamış · Aktif (yayında) · Bana Yönelik (`dep` boş ya da oturum departmanı) · Arşiv (`aktif===false` veya süresi dolmuş) · Tümü.
**Arama:** `search.fields` = `kod` · `baslik` · `ozet` · `icerik`; `search.extra` = yayınlayan adı + hedef kitle metni + öncelik.
**Filtreler:** `yazan` · select · `DB.employees` | `dep` · multi · `[{value:'ALL',label:'Tüm şirket'}] + DB.departments` (özel `test`) | `oncelik` · multi · sabit dörtlü | `tarih` · daterange | `okundu` · select · Okundu/Okunmadı (özel `test`) | `durum` · select · Aktif/Süresi doldu/Arşivlendi (özel `test`).
**Tablo kolonları:** Duyuru (kilitli, %32) · Yayınlayan · Hedef kitle · Yayın tarihi · Geçerlilik · Öncelik · Durum · Okundu durumu. Gizli kolon yok. Görünümler: tablo + kart.
**Form alanları:** "Yeni Duyuru" modalındaki `GV.form` — **2 bölüm, 7 alan**: *Duyuru içeriği* (3 alan: `baslik`* · `ozet`* · `icerik`*), *Yayın ayarları* (4 alan: `dep` · `oncelik`* · `tarih`* · `bitis`, `bitis` için "yayın tarihinden önce olamaz" doğrulaması). Ayrıca modal içinde ayrı bir `GV.upload` (çoklu, 20 MB) ek dosya alanı.
**Detay sekmeleri:** —
**İşlem butonları:** `GV.pageHead` — "Bildirim Merkezi" · "Tümünü Okundu İşaretle" (`run`) · (yetki varsa) "Yeni Duyuru" (`run`). `rowActions[]`: **Duyuruyu aç** (`GV.drawer`, açılışta okundu işaretler) · **Okundu / okunmadı işaretle** · (yetki varsa) **Arşivle** (`GV.confirm`, `aktif=false`).
**Toplu işlemler:** `bulk[]` — "Okundu işaretle" (`run`) · (yetki varsa) "Arşivle" (`confirm` metinli, `tone:'danger'`) · "Dışa aktar". Arşivleme kapısı `canDuzenle` ile **liste kurulurken** uygulanır.
**Bildirimler:** `GV.toast` — okundu/okunmadı (1600 ms) · "`<n>` duyuru okundu işaretlendi" · "Okunmamış duyuru yok" (`info`) · "Duyuru arşivlendi" · "`<n>` duyuru arşivlendi" · "Duyuru yayınlandı · `<kod>`" · "`<kod>` kodlu duyuru bulunamadı" (`warn`, derin bağlantı hatalıysa). `GV.notice` drawer içinde okuma takibi kapsam notu. `GV.confirm` toplu okuma ve arşivlemede.
**Yetkilendirme:** `GV.perm.can('ekle')` · `GV.perm.can('duzenle')` · `GV.perm.can('disaAktar')` (çıktı anahtarı). 403 kapısı yok — yetkisiz rol listeyi görür, aksiyonlar hiç basılmaz.
**Boş durum:** `GV.empty` — "Bu görünümde duyuru yok" / okuma durumunun kişi bazında izlendiğini anlatan açıklama. Aksiyon yok.
**Hata durumu:** `GV.errorState` yok.
**Mobil görünüm:** `mobile(x)` var — başlık + "Yeni" rozeti, kod·hedef·tarih, özet, öncelik + durum rozetleri.
**Kabul kriterleri:**
1. `?id=DUY-...` adresiyle açılınca ilgili duyuru drawer'da açılmalı; kod hatalıysa uydurma kayıt basılmayıp `warn` toast çıkmalı.
2. Drawer açıldığı anda kayıt okundu sayılmalı ve liste sayaçları yenilenmeli.
3. Düzenleme yetkisi olmayan rolde "Arşivle" ne satır aksiyonunda ne toplu barda görünmeli.
**Bulgular:** (a) Okuma durumu veri modelinde yok; ekran `READ{}` sözlüğüyle **oturum belleğinde** tutuyor ve başlangıçta "14 günden eski = okundu" varsayımını uyguluyor — sayfa yenilenince kullanıcının işaretlemeleri kaybolur. (b) `export:!!GV.perm.can('disaAktar')` boolean geçiyor; `GV.list` sözleşmesi `export`'u **format dizisi** (`['xlsx','csv',...]`) olarak tanımlıyor.

---

### `app-panel-yonetici.html` — Yönetici Paneli

**Tip:** panel (rapor ağırlıklı)
**Bölüm:** `panel` · menü etiketi "Yönetici Paneli" (`screen:'yonetici'`, `seclbl:'Analiz'` grubu)
**Amaç:** Şirket sağlık tablosunu tek ekranda vermek — KPI şeridi, gelir eğilimi, karşılaştırma grafikleri, risk yoğunlaşması, personel yükü ve karar kuyruğu.
**Kullanıcılar:** `SECTIONS.panel.menu[].roles` ve `SCREEN_PERM.yonetici` → **sahip · genelmudur · sistem · operasyon**. Diğer roller menüde göremez; doğrudan URL ile gelirse ekran açılır ama uyarı basılıp içerik yetkiye göre kısılır.
**Veri kaynağı:** `DB.tasks` · `DB.projects` · `DB.leads` · `DB.tickets` · `DB.invoices` · `DB.payments` · `DB.orders` · `DB.capacity` · `DB.purchases` · `DB.quotes` · `DB.leaves` · `DB.timesheets` · `DB.approvals` · `DB.customers` · `DB.pipelineStages` · `DB.employees` (`DB.emp`, `DB.dep`, `DB.roleName`) · `DB.today`
**Üst özet kartları:** 8 KPI (dörtlü satırlara bölünür) — Faturalanan ciro · Tahsilat oranı · Açık pipeline değeri · Aktif proje sağlığı · Personel doluluğu (yalnız `personelRapor` yetkisi varsa) · Geciken iş oranı · Açık destek ve SLA riski · Nakit pozisyonu.
**Sekmeler:** yok — bloklar dikey akar.
**Arama:** yok.
**Filtreler:** yok.
**Tablo kolonları:** üç elle kurulmuş tablo. *Risk Yoğunlaşması — Müşteriler*: Müşteri · Risk skoru · Gecikmiş alacak · Memnuniyet · Sorumlu (ilk 5). *Gecikme Baskısı — Projeler*: Proje · İlerleme · Plan sapması · Geciken iş · Sağlık (ilk 5). *Yük Yoğunlaşması — Personel*: Personel · Departman · Doluluk · Planlanan/Kapasite · Açık iş · Geciken · İzin · Timesheet (ilk 5). *Karar Bekleyenler*: Karar konusu · Tür · Tutar · Talep eden · Onaylayan · Bekleme · Aciliyet.
**Form alanları:** —
**Detay sekmeleri:** —
**İşlem butonları:** `GV.pageHead` — "Günlük Panel" · "Rapor Merkezi" · "Bekleyen Onaylar". Kart başlıklarında "Tümü →" bağlantıları. Satır aksiyonu yok.
**Toplu işlemler:** yok.
**Bildirimler:** `GV.notice` üç koşullu uyarı — yönetim rolü dışı erişim (`warn`) · finans maskeleme (`neutral`) · personel bloğunun gizlendiği (`neutral`). `GV.toast` / `GV.result` yok.
**Yetkilendirme:** `GV.perm.can('finans')` → para KPI'ları ve para grafikleri **adet eksenine düşürülür**, tutarlar `.cell-mask` ile maskelenir. `GV.perm.can('personelRapor')` → "Personel doluluğu" KPI'ı ve "Yük Yoğunlaşması" bloğu hiç basılmaz. `GV.session.rol` ile yönetim rolü listesi ayrıca kontrol edilir. Sayfa seviyesinde 403 **yok** — kısıtlama içerik düzeyinde.
**Boş durum:** `GV.empty` — "Eğilim çizilemedi" (iki farklı ay yoksa) · "Risk yoğunlaşması yok" · "Aktif proje yok" · "Kapasite kaydı yok" · "Karar kuyruğu temiz".
**Hata durumu:** var — `build()` `try/catch` içinde; hata halinde `GV.errorState({title:'Yönetici paneli yüklenemedi'})` + `[data-retry]` → `location.reload()`.
**Mobil görünüm:** `mobile(r)` yok; tablolar `.gv-tablewrap.is-mobilescroll` ile mobilde yatay kaydırmayla okunur kalır.
**Kabul kriterleri:**
1. Finans yetkisi olmayan bir yönetim rolünde hiçbir tutar ekranda görünmemeli; grafiklerin ekseni adede düşmeli.
2. `personelRapor` yetkisi yoksa Personel bloğu ve ilgili KPI **hiç basılmamalı**.
3. Karar kuyruğu satın alma + teklif + izin + timesheet + `DB.approvals` artıklarını tekrarsız birleştirmeli (aynı `kayit` kodu iki kez düşmemeli).
**Bulgular:** Nakit pozisyonu (`tahsilEdilen − gidenSiparis`) veride yazılı bir eksen değil, ekranda **varsayım** olarak hesaplanıyor; kodda yorumla belirtilmiş ama ekranda kullanıcıya bu varsayım yazılmıyor.

---

### `app-ajanda.html` — Ajanda (Takvim)

**Tip:** özel (takvim)
**Bölüm:** `panel` · menü etiketi "Ajanda" (`screen:'ajanda'`). **Aynı dosya `toplanti` bölümünde "Takvim" adıyla ikinci kez menüde** (`screen:'takvim'`).
**Amaç:** Sekiz farklı kaynaktan gelen olayları ay/hafta/gün görünümünde tek takvimde toplamak.
**Kullanıcılar:** tüm roller (`panel` bölümü herkeste). Ekran kısıtı yok.
**Veri kaynağı:** `DB.meetings` · `DB.tasks` · `DB.milestones` · `DB.leaves` · `DB.inspections` · `DB.policies` · `DB.invoices` · `DB.contracts` · `DB.employees` · `DB.customers` · `DB.projects` · `DB.vehicles` · `DB.empName` · `DB.today`
**Üst özet kartları:** 4 KPI (`#ajandaKpi` düğümüne elle basılır) — Bu ay toplantı · Bu hafta terminli görev · Yaklaşan yenileme (araç + sözleşme, 60 gün) · Bu ay izinli personel günü.
**Sekmeler:** `tabs[]` yok; onun yerine `GV.chipbar` ile 8 kaynak çipi (aç/kapa): Toplantılar · Görev terminleri · Kilometre taşları · Personel izinleri · Araç yenilemeleri · Fatura vadeleri · Sözleşme yenilemeleri · Doğum günü ve yıldönümü. Her çipte dönemdeki olay sayısı yazar.
**Arama:** yok.
**Filtreler:** kaynak çipleri (URL'de `?k=` ile saklanır). Ayrıca görünüm `?v=ay|hafta|gun` ve odak tarih `?d=YYYY-MM-DD` URL'de tutulur (`history.replaceState`).
**Tablo kolonları:** yok — `.gv-cal` ızgarası (ay = 7×6 = 42 hücre, hafta = 7 hücre) ve gün görünümünde `GV.activity` timeline'ı.
**Form alanları:** —
**Detay sekmeleri:** —
**İşlem butonları:** `GV.pageHead` — "Toplantılar" (`app-toplanti.html`) · "Yazdır" (`window.print()`). Takvim içi kontroller: önceki/sonraki dönem · "Bugün" · üç görünüm anahtarı (`.viewswitch`) · "+N olay daha" (o güne geçer) · olay çipi (drawer açar). Drawer aksiyonları: "Günü aç" · "Kapat"; ayrıca kaynak ekranına giden birincil bağlantı.
**Toplu işlemler:** yok.
**Bildirimler:** `GV.toast` — kaynak çipi açılıp kapandığında "`<kaynak>` gizlendi / gösteriliyor" (`info`, 1600 ms). `GV.drawer` olay detayı için.
**Yetkilendirme:** `GV.perm.can('finans')` — taksit tutarı, poliçe primi, fatura tutar/vergi/toplam ve sözleşme tutarı `••••••` ile maskelenir. Kaynak bazlı bölüm yetkisi kontrolü **yok**: `varlik` ya da `finans` bölümüne erişimi olmayan rol de araç ve fatura olaylarını takvimde görür.
**Boş durum:** `GV.empty` — "Bu dönemde olay yok" / "Bu günde olay yok"; filtre yüzünden boşsa açıklama değişir ve aksiyon "Tüm kaynakları göster", değilse "Bugüne dön".
**Hata durumu:** `GV.errorState` yok.
**Mobil görünüm:** `mobile(r)` yok; `.gv-cal` ızgarası CSS ile daralır, gün görünümü `GV.activity` timeline'ı olduğu için mobilde tam okunur.
**Kabul kriterleri:**
1. Üç görünüm de URL'de saklanmalı; sayfa yenilendiğinde aynı dönem ve aynı kaynak filtresi geri gelmeli.
2. Çok günlü izin kaydı, `baslangic`–`bitis` aralığındaki her güne ayrı çip olarak düşmeli (120 gün koruma sınırı var).
3. Doğum günü ve iş yıldönümü olayları `DB.today` yılına göre ±1 yıl üretilmeli; 0. yıldönümü basılmamalı.
**Bulgular:** (a) Klavye kısayolu dinleyicisi `document.addEventListener('keydown', ...)` ile bağlanıyor — `GV.on(..., key)` kullanılmadığı için `GV.refresh()` çağrılan bir akış eklenirse dinleyici birikir (ders L-16). (b) Aynı dosya iki farklı menü kaydına hizmet ediyor (`panel/ajanda` ve `toplanti/takvim`); `data-screen="ajanda"` sabit olduğu için Toplantı bölümünden girildiğinde menüde "Takvim" satırı aktif işaretlenmez.

---

### `app-lead.html` — Müşteri Adayları

**Tip:** liste
**Bölüm:** `satis` · menü etiketi "Müşteri Adayları" (`screen:'lead'`, `cnt:'lead'` rozeti)
**Amaç:** Satış hunisine giren tüm müşteri adaylarını sıcaklık, aşama ve sonraki aksiyon ekseninde takip etmek.
**Kullanıcılar:** `satis` bölümüne erişimi olan 7 rol — sahip · genelmudur · sistem · operasyon · satismudur · satistemsilci · analist.
**Veri kaynağı:** `DB.leads` (kaynak) · `DB.pipelineStages` · `DB.employees` · `DB.empName` · `DB.services` · `DB.sectors` · `DB.refTypes`
**Üst özet kartları:** 4 KPI — Toplam aday · Açık fırsat (kapanmamış aşamalar) · Sıcak aday (`sicaklik==='Sıcak'` + açık) · Açık pipeline değeri (açıkların Σ`butce`, `moneyK`).
**Sekmeler:** 8 — Açık Adaylar · Yeni Talepler (`asama==='Yeni talep'`) · Sıcak · Aksiyonu Gecikenler (`sonrakiTarih` geçmiş + açık) · Kazanılanlar · Kaybedilenler · Beklemede · Tümü.
**Arama:** `search.fields` = `kod` · `firma` · `yetkili` · `hizmet` · `ozet` · `sektor` · `yonlendiren` · `etiketler`. `extra` yok.
**Filtreler:** `asama` · multi · `DB.pipelineStages` | `sorumlu` · select · `DB.employees` (satış rolleriyle daraltılmış) | `hizmet` · multi · `DB.services` | `sektor` · multi · `DB.sectors` | `kaynak` · select · `DB.refTypes` | `sicaklik` · select · sabit üçlü | `oncelik` · select · sabit dörtlü | `butce` · text (en az, özel `test`) | `talepTarihi` · daterange.
**Tablo kolonları:** Firma/Talep (kilitli, %25) · Yetkili · İlgilendiği hizmet · **Sektör (varsayılan gizli)** · Kaynak/Yönlendiren · Satış sorumlusu · Tahmini bütçe (KDV hariç) · **Lead puanı (gizli)** · Sıcaklık · **Öncelik (gizli)** · Sonraki aksiyon · **Son iletişim (gizli)** · Aşama. Görünümler: tablo + kart. `pageSize:10`.
**Form alanları:** —
**Detay sekmeleri:** —
**İşlem butonları:** Sayfa başlığı **elle yazılmış** (`GV.pageHead` çağrılmıyor): "Pipeline Görünümü" (`app-pipeline.html`) · "Yeni Müşteri Adayı" (`app-lead-form.html`). `rowActions[]` 3: **Detayı aç** · **Düzenle** · **Arşivle** (`GV.confirm`, `r.arsiv=true`).
**Toplu işlemler:** `bulk[]` 4 — Sorumlu ata · Aşama değiştir · Dışa aktar · Arşivle (`tone:'danger'`, `confirm:'{n} aday arşive taşınacak…'`). Yetki kapısı yok.
**Bildirimler:** `GV.toast` — "`<kod>` arşivlendi" (`ok`). `GV.confirm` arşivlemede.
**Yetkilendirme:** `GV.perm` çağrısı **yok** — bütçe alanı bu ekranda maskelenmiyor.
**Boş durum:** `GV.empty` — "Bu görünümde müşteri adayı yok" + birincil aksiyon "Yeni Müşteri Adayı".
**Hata durumu:** `GV.errorState` yok.
**Mobil görünüm:** `mobile(r)` var — firma + sıcaklık, kod·hizmet, yetkili + bütçe, aşama rozeti + sonraki aksiyon tarihi. Ayrıca `card(r)` kart görünümü.
**Kabul kriterleri:**
1. Filtre değişince sayfalama 1'e dönmeli; sayfa/filtre/sıralama URL'de korunmalı.
2. "Aksiyonu Gecikenler" sekmesi `DB.today` eksenine göre hesaplanmalı, satırlar `is-late` sınıfı almalı.
3. Gizli beş kolon, kolon yöneticisinden açıldığında `localStorage`'a yazılmalı.
**Bulgular:** (a) Ekran shell iskeletini elle yazıyor → `GV.pageHead` bu sayfada çalışmaz, başlık markup'ı tekrarlanmış (UID-15). (b) `GV.perm.can('finans')` kontrolü yok; aynı bölümdeki `app-referans.html` ve `app-komisyon.html` bütçe/ciro alanlarını maskelerken bu ekran `butce` alanını herkese açık gösteriyor — bölüm içinde eksen tutarsızlığı.

---

### `app-lead-detay.html` — Müşteri Adayı Detayı

**Tip:** detay
**Bölüm:** `satis` · menüde ayrı satır yok, şuradan bağlanır: `app-lead.html` satır aksiyonu, `app-pipeline.html` kanban kartı, `app-musteri-iletisim.html`, `app-referans-detay.html`, `app-onanaliz-detay.html`, `app-teklif-detay.html`.
**Amaç:** Bir müşteri adayının tüm ekseni — kimlik, aşama kuralları, görüşme geçmişi, ön analiz, teklif ve dönüşüm — tek kartta.
**Kullanıcılar:** `satis` bölümüne erişimi olan 7 rol.
**Veri kaynağı:** `DB.leads` · `DB.pipelineStages` · `DB.referrers` · `DB.customers` · `DB.contacts` · `DB.quotes` · `DB.quoteItems` · `DB.analyses` · `DB.interactions` · `DB.activities` · `DB.tasks` · `DB.employees` (`DB.emp`, `DB.empName`) · `DB.today`
**Üst özet kartları:** `kpis[]` yok. Sağ panelde 4 kart: **Özet** (12 satır: tahmini değer · kapanış olasılığı · ağırlıklı değer · beklenen kapanış · aşamada geçen gün · talepten bu yana · sonraki aksiyon · yönlendiren · lead puanı · sıcaklık · satış sorumlusu) · **Bağlı Müşteri** (varsa) · **Aşama** · **Son Hareket**.
**Sekmeler:** —
**Arama:** yok.
**Filtreler:** yok.
**Tablo kolonları:** —
**Form alanları:** —
**Detay sekmeleri:** 9 (`GV.tabs('#recTabs')`):
1. **Genel Bilgiler** — 5 bölüm `gv-dl`: Firma ve Yetkili (7 alan) · Talep (5) · Kaynak ve Sorumluluk (4) · Nitelik ve Aşama (7) · Sonuç ve Kayıt (5).
2. **İletişim Bilgileri** — aday kanalları · satış sorumlusu kartı · yönlendiren kaynağın 10 alanı · bağlı müşterinin yetkili tablosu.
3. **Aşama Geçmişi** — `GV.chain` ilerleme zinciri + mevcut aşamanın 11 alanı + 15 aşamalık kural matrisi (`.is-sticky1`). Terminal aşamada (`Kaybedildi`/`Beklemeye alındı`) üstte `GV.notice` uyarısı.
4. **İletişim Geçmişi** — görüşme tablosu (tarih · tür · görüşen · karşı taraf · konu-özet · sonuç), sayaç + "Tüm iletişim geçmişi" bağlantısı.
5. **Ön Analiz** — her analiz için 14 kimlik alanı + 12 özellik bayrağı + 5 liste alanı (kapsam içi/dışı, riskler, belirsiz, beklenen).
6. **Teklifler** — teklif özet tablosu (net/KDV/brüt üç kolon ayrı) + her teklif için ticari koşullar ve `DB.quoteItems` kalem dökümü.
7. **Görevler** — `GV.notice(info)` ile "görev bağı müşteri üzerinden kurulur" notu + aşamanın otomatik görevi + müşteriye bağlı görev tablosu.
8. **Dosyalar** — `GV.notice(neutral)` kapsam notu + `GV.upload` alanı (`#leadUpload`, 20 MB).
9. **Aktivite Geçmişi** — `GV.activity(acts)`.
**İşlem butonları:** `GV.pageHead` **çağrılmıyor** (elle iskelet); başlık aksiyonları `.ph-actions` içinde: "Pipeline'da Gör" · "Aşama Değiştir" (kapalı adayda basılmaz) · "Düzenle" · "Teklif Oluştur" · "Müşteri Kaydını Aç" / "Müşteriye Dönüştür" (aday zaten müşteriyse veya kaybedildiyse dönüştürme basılmaz).
**Toplu işlemler:** yok.
**Bildirimler:** `GV.modal` (Aşama Değiştir — yeni aşama + gerekçe) · `GV.toast` ("Aday zaten bu aşamada" `warn`, "`<kod>` aşaması … güncellendi" `ok`) · `GV.confirm` (Müşteriye dönüştür) · `GV.result` (`tone:'ok'`, "Aday müşteriye dönüştürüldü", iki aksiyon: müşteri listesine git / adayda kal).
**Yetkilendirme:** `GV.perm` çağrısı **yok** — bütçe, ağırlıklı değer ve müşteri cirosu maskelenmiyor; 403 kapısı yok.
**Boş durum:** `GV.empty` — kayıt bulunamadığında "Müşteri adayı bulunamadı" + listeye dönüş; ayrıca sekme içlerinde 6 ayrı boş durum ("Sorumlu atanmamış" · "Yönlendiren kaynak yok" · "Bağlı müşteri yetkilisi yok" · "Görüşme kaydı yok" · "Ön analiz yok" · "Teklif yok" · "Bağlı görev yok" · "Aşama tanımı bulunamadı").
**Hata durumu:** `GV.errorState` yok.
**Mobil görünüm:** `mobile(r)` yok; sekme içi tablolar `.gv-tablewrap` içinde, aşama kural matrisi `.is-sticky1` ile sabit ilk kolonlu.
**Kabul kriterleri:**
1. "Müşteriye Dönüştür" akışı `DB.customers`'a **gerçek kayıt** yazmalı (`MUS-YYYY-NNN`), `lead.musteri` bağını kurmalı ve iki aktivite satırı düşmeli.
2. Aşamaya giriş tarihi yalnız `DB.activities` üzerinden türetilmeli — leadde böyle bir alan olmadığı için uydurulmamalı.
3. Kapanmış (`Kazanıldı`/`Kaybedildi`) adayda "Aşama Değiştir" butonu hiç basılmamalı.
**Bulgular:** (a) Elle iskelet (UID-15) — `GV.pageHead` çalışmaz. (b) Ön Analiz sekmesinde "Tahmini iş gücü" **adam-gün** olarak etiketleniyor; `app-onanaliz-detay.html` aynı alanın biriminin veride yazılı olmadığını ölçüp "birim veride yazılı değil" diyor — iki ekran arasında eksen çelişkisi. (c) Ön analiz ve teklif bağlantıları detay ekranlarına değil liste ekranlarına gidiyor (`app-onanaliz.html`, `app-teklif.html`), oysa `app-onanaliz-detay.html` ve `app-teklif-detay.html` yayında.

---

### `app-lead-form.html` — Müşteri Adayı Formu

**Tip:** form
**Bölüm:** `satis` · menüde yok, şuradan bağlanır: `app-lead.html` ("Yeni Müşteri Adayı" + satır "Düzenle"), `app-pipeline.html` ("Yeni Fırsat"), `app-lead-detay.html` ("Düzenle").
**Amaç:** `DB.leads` kaydının 28 alanını tek formda toplamak; yeni kayıt ve düzenleme aynı ekranda.
**Kullanıcılar:** `satis` bölümüne erişimi olan 7 rol; ayrıca `GV.perm.can('ekle'|'duzenle')` kapısı.
**Veri kaynağı:** `DB.leads` · `DB.sectors` · `DB.services` · `DB.refTypes` · `DB.customers` · `DB.referrers` · `DB.pipelineStages` · `DB.priorities` · `DB.lostReasons` · `DB.employees` · `DB.quotes` · `DB.analyses` · `DB.interactions` · `DB.activities` · `DB.today`
**Üst özet kartları:** düzenleme modunda "Kayıt özeti" `gv-dl` kartı (7 satır: kayıt no · aşama · sıcaklık+öncelik · talep tarihi · satış sorumlusu · son değiştiren · kayıt durumu).
**Sekmeler:** yok.
**Arama:** yok.
**Filtreler:** yok.
**Tablo kolonları:** —
**Form alanları:** `GV.form({id:'lead'})` — **6 bölüm, 21 alan** (finans yetkisi varsa 21, yoksa 20):
- *Kimlik ve iletişim* — 6 alan: `firma`* · `yetkili`* · `tel` (tel/e-posta çapraz doğrulaması) · `eposta` · `sektor`* · `buyukluk`
- *İhtiyaç ve bütçe* — 2–3 alan: `hizmet`* · `butce` (yalnız `can('finans')`) · `ozet`*
- *Kaynak ve yönlendirme* — 3 alan: `talepTarihi`* (ileri tarih yasak) · `kaynak`* · `referans`
- *Satış süreci* — 7 alan: `asama`* · `sorumlu`* · `kapanisTahmini` (talep tarihinden önce olamaz; açık adayda geçmiş olamaz) · `oncelik`* · `sicaklik`* · `puan`* (0–100) · `musteri` (Kazanıldı'da zorunlu) · `kayipNedeni` (Kaybedildi'de zorunlu, aksi hâlde yasak)
- *İletişim takibi* — 3 alan: `sonIletisim` · `sonrakiAksiyon` · `sonrakiTarih` (çapraz doğrulamalı)
- *Etiketler ve notlar* — 3 alan: `etiketler` (virgüllü metin) · `notlar` · `aktif` (switch)
Zorunlular: firma · yetkili · sektör · hizmet · talep özeti · talep tarihi · müşteri kaynağı · satış aşaması · satış sorumlusu · öncelik · sıcaklık · lead puanı.
**Detay sekmeleri:** —
**İşlem butonları:** `GV.pageHead` — "Vazgeç" · "Kaydet"/"Değişiklikleri kaydet" (`run:kaydet`). Form altında ikinci kaydet düğmesi (`#btnKaydetAlt`). Düzenlemede "Detayı aç" ve `GV.notice` içinde "Detay ekranında incele".
**Toplu işlemler:** —
**Bildirimler:** `GV.notice` — yeni kayıtta "Kaydettiğinizde ne olacak" (`info`, üretilecek kod yazılı) · düzenlemede bağlı kayıt varsa `warn`, yoksa `neutral`. `GV.toast` — "Değişiklik yok…" (`info`) · "`<kod>` güncellendi · `<n>` alan" (`ok`) · "`<kod>` oluşturuldu" (`ok`). `GV.errorState` 403'te.
**Yetkilendirme:** `GV.perm.can('duzenle'|'ekle')` → form **hiç kurulmaz**, `GV.errorState` basılır ve "Tekrar dene" butonu gerçek aksiyonlarla değiştirilir. `GV.perm.can('finans')` → `butce` alanı forma basılmaz, kaydetmede mevcut değer korunur.
**Boş durum:** `GV.empty` — `?id=` hatalıysa "Kayıt bulunamadı" + listeye dönüş aksiyonu.
**Hata durumu:** `GV.errorState` var (403 kapısı).
**Mobil görünüm:** `GV.form` `cols` ızgarası ile; ekran özel mobil markup yazmıyor.
**Kabul kriterleri:**
1. Yetkisiz rolde `GV.form` hiç kurulmamalı; `GV.errorState`'in varsayılan "Tekrar dene" düğmesi ölü kontrol olarak kalmamalı.
2. Yeni kod dizi uzunluğundan değil, en yüksek mevcut `LEAD-YYYY-NNN` numarasından üretilmeli.
3. Düzenlemede yalnız **değişen** alanlar için `DB.activities` satırı yazılmalı; hiç değişmediyse `info` toast basılıp listeye dönülmeli.
4. `yonlendiren` alanı elle girilmemeli — `referans` seçiminden türetilmeli.
**Bulgular:** `etiketler` çoklu değer taşıyor ama `type:'text'` + virgülle ayırma ile kurulu; `GV.form`'da `tags`/`multiselect` tipi olmadığı için bu bir eksik bileşen izi (components.md §4 ile tutarlı, ama rapor edilmesi gerekiyor).

---

### `app-pipeline.html` — Satış Pipeline

**Tip:** liste (kanban öncelikli)
**Bölüm:** `satis` · menü etiketi "Satış Pipeline" (`screen:'pipeline'`)
**Amaç:** Açık fırsatları aşama kolonlarında görselleştirmek, ağırlıklı tahmin üretmek ve aşamada bekleme kuralını ihlal edenleri işaretlemek.
**Kullanıcılar:** `satis` bölümüne erişimi olan 7 rol.
**Veri kaynağı:** `DB.leads` (kaynak) · `DB.pipelineStages` · `DB.employees` · `DB.empName` · `DB.services` · `DB.activities` (aşama ilerletme yazımı)
**Üst özet kartları:** 4 KPI — Açık fırsat · Pipeline değeri (Σ`butce`) · Ağırlıklı tahmin (Σ `butce × olasilik/100`) · Kuralı aşan fırsat (`sonIletisim` gün farkı `stage.maxGun`'u geçenler).
**Sekmeler:** 6 — Açık Fırsatlar · Erken Aşama (`sira ≤ 4`) · Analiz ve Fiyat (`sira 5–8`) · Kapanışa Yakın (`sira ≥ 9`) · Kuralı Aşanlar · Tümü.
**Arama:** `search.fields` = `kod` · `firma` · `yetkili` · `hizmet` · `ozet`.
**Filtreler:** `asama` · multi · `DB.pipelineStages` | `sorumlu` · select · satış rolleriyle daraltılmış `DB.employees` | `hizmet` · multi · `DB.services` | `sicaklik` · select · sabit üçlü | `butce` · text (en az) | `kapanisTahmini` · daterange.
**Tablo kolonları:** Fırsat (kilitli, %26) · Aşama · Olasılık (`GV.progress`) · Fırsat değeri · Ağırlıklı değer · Sorumlu · Aşamada bekleme (kural karşılaştırmalı) · Tahmini kapanış. Gizli kolon yok. Görünümler: **kanban + tablo** (`kanban:{groupBy:'asama'}`, kolonlar `sira ≤ 13` aşamalar, özel `card(l)` üreticisi).
**Form alanları:** —
**Detay sekmeleri:** —
**İşlem butonları:** Sayfa başlığı elle yazılmış: "Aşama Kuralları" (`#btnKural` → `GV.modal`, 15 aşamanın 8 kolonlu kural matrisi) · "Yeni Fırsat" (`app-lead-form.html`). `rowActions[]` 2: **Fırsatı aç** · **Sonraki aşamaya taşıya** (`GV.confirm` + `DB.activities` satırı + `sonIletisim = DB.today`).
**Toplu işlemler:** `bulk[]` 2 — Sorumlu ata · Dışa aktar. Yetki kapısı yok.
**Bildirimler:** `GV.modal` (aşama kuralları) · `GV.toast` ("Bu fırsat kapanış aşamasında, ileri taşınamaz." `warn`; "`<kod>` → `<aşama>`" `ok`) · `GV.confirm` (aşama ilerletme; onay gerekiyorsa ve otomatik görev metni onay metnine yazılır).
**Yetkilendirme:** `GV.perm` çağrısı **yok** — fırsat değeri ve ağırlıklı değer maskelenmiyor.
**Boş durum:** `GV.empty` — "Bu görünümde fırsat yok" + "Yeni Fırsat" aksiyonu.
**Hata durumu:** `GV.errorState` yok.
**Mobil görünüm:** `mobile(l)` var — firma + `moneyK`, kod·hizmet, aşama rozeti + kapanış tarihi.
**Kabul kriterleri:**
1. Kanban kolonları `DB.pipelineStages`'in `sira ≤ 13` alt kümesinden üretilmeli; kapanış aşamaları kolonlaşmamalı.
2. "Sonraki aşamaya taşı" 13. sıradan sonrasında engellenmeli ve `warn` toast basmalı.
3. Ağırlıklı değer kolonu `butce × olasilik` çarpımından türetilmeli, veride hazır bir alandan okunmamalı.
**Bulgular:** Elle iskelet (UID-15) — `GV.pageHead` çalışmaz, başlık markup'ı sayfada tekrarlanmış.

---

### `app-referans.html` — Yönlendiren Kişiler

**Tip:** liste
**Bölüm:** `satis` · menü etiketi "Yönlendiren Kişiler" (`screen:'referans'`, `seclbl:'Referans'` grubu)
**Amaç:** Referans kaynaklarını (kişi ve dijital kanal) yönlendirme, dönüşüm, ciro ve komisyon ekseninde izlemek.
**Kullanıcılar:** `satis` bölümüne erişimi olan 7 rol.
**Veri kaynağı:** `DB.referrers` (kaynak) · `DB.refTypes` · `DB.employees` · `DB.empName`
**Üst özet kartları:** 4 KPI — Aktif yönlendiren · Toplam yönlendirme (Σ`yonlendirme`) · Referanslı ciro (Σ`ciro`, finans yetkisi yoksa 0) · Bekleyen komisyon (Σ`bekleyen`, `href:'app-komisyon.html'`).
**Sekmeler:** 7 — Aktif Kaynaklar · Kişi Referansları (9 türlük küme) · Dijital Kanallar (8 türlük küme) · Komisyonlu (`komisyonModeli !== 'Yok'`) · Ödeme Bekleyen (`bekleyen > 0`) · Pasif · Tümü.
**Arama:** `search.fields` = `kod` · `ad` · `firma` · `tur` · `pozisyon` · `not`.
**Filtreler:** `tur` · multi · `DB.refTypes` | `durum` · select · Aktif/Pasif | `sorumlu` · select · `DB.employees` | `komisyonModeli` · multi · sabit üçlü | `donusum` · text (en az %) | `sonYonlendirme` · daterange.
**Tablo kolonları:** Yönlendiren (kilitli, %22) · Referans türü · **Pozisyon (gizli)** · Şirket içi sorumlu · Yönlendirme · Kazanılan · **Kaybedilen (gizli)** · Dönüşüm oranı · Oluşturduğu ciro · **Komisyon modeli (gizli)** · Bekleyen kazanç · Son yönlendirme · Durum. Görünümler: tablo + kart. `pageSize:10`.
**Form alanları:** —
**Detay sekmeleri:** —
**İşlem butonları:** `GV.pageHead` — "Komisyon Kazançları" · "Yeni Yönlendiren". `rowActions[]` 3: **Kartı aç** (`app-referans-detay.html?id=`) · **Yönlendirdiği adaylar** (`app-lead.html?t=tumu&f_kaynak=<tür>`) · **Komisyonları** (`app-komisyon.html?f_referans=<kod>`).
**Toplu işlemler:** `bulk[]` 3 — Sorumlu ata · Dışa aktar · Pasife al (`tone:'danger'`, `confirm` metinli). Yetki kapısı yok.
**Bildirimler:** ekranın kendi bastığı `toast`/`notice`/`result` **yok**; toplu işlemin onayı `GV.list` içindeki `confirm` metniyle kuruluyor.
**Yetkilendirme:** `GV.perm.can('finans')` bir kez okunur; ciro, bekleyen kazanç, "Referanslı ciro" ve "Bekleyen komisyon" KPI'ları maskelenir (`.cell-mask`, `exportValue` boş). 403 kapısı yok.
**Boş durum:** `GV.empty` — "Bu görünümde yönlendiren yok" + "Yeni Yönlendiren" aksiyonu.
**Hata durumu:** `GV.errorState` yok.
**Mobil görünüm:** `mobile(r)` var — ad + tür etiketi, kod·firma, yönlendirme/kazanım sayıları, dönüşüm çubuğu. Ayrıca `card(r)`.
**Kabul kriterleri:**
1. Finans yetkisi olmayan rolde ciro ve bekleyen kazanç `••••` görünmeli; dışa aktarımda boş çıkmalı.
2. "Yönlendirdiği adaylar" aksiyonu `f_kaynak` filtresini URL'den okuyup lead listesinde uygulamalı.
**Bulgular:** "Yönlendirdiği adaylar" aksiyonu `f_kaynak=<tür>` ile filtre uyguluyor — bu **tür** eksenidir, yönlendiren kaydı ekseni değil; aynı türdeki başka kaynakların adayları da listeye düşer.

---

### `app-referans-detay.html` — Yönlendiren Detayı

**Tip:** detay
**Bölüm:** `satis` · menüde yok, şuradan bağlanır: `app-referans.html` satır aksiyonu, `app-komisyon-detay.html`, `app-komisyon-form.html`, `app-referans-form.html`.
**Amaç:** Bir referans kaynağının getirdiği adaylar, kazandırdığı müşteriler, komisyon kayıtları ve performansını tek kartta ölçmek; kart alanlarını kayıtlardan türetilenle karşılaştırmak.
**Kullanıcılar:** `satis` bölümüne erişimi olan 7 rol.
**Veri kaynağı:** `DB.referrers` · `DB.leads` · `DB.customers` · `DB.commissions` · `DB.activities` · `DB.refTypes` · `DB.employees` (`DB.emp`, `DB.empName`) · `DB.today`
**Üst özet kartları:** `kpis[]` yok. Sağ panelde 4 kart: **Özet** (8 satır) · **Komisyon** (7 satır, kart↔kayıt uyum satırı dahil) · **Devamlılık** (5 satır: ilk/son yönlendirme, aktif dönem, sessiz süre, canlılık) · **Son Hareket**.
**Sekmeler:** —
**Arama:** yok.
**Filtreler:** yok.
**Tablo kolonları:** —
**Form alanları:** —
**Detay sekmeleri:** 6 (`GV.tabs('#recTabs')`):
1. **Genel** — 6 bölüm: Yönlendiren Kimliği (9 alan, sözlük dışı tür uyarısı dahil) · İletişim ve Sahiplik (4) · Komisyon Koşulu (7) · Kart Üzerindeki Yönlendirme Sayaçları (7) · Not (1) · "Kartta Tutulmayan Alanlar" (`GV.notice`, üç alanın veri modelinde olmadığı açıkça yazılır).
2. **Yönlendirdiği Adaylar** — 9 kolonlu tablo (aday · firma · hizmet · aşama · sıcaklık · bütçe · talep tarihi · sonuç · sorumlu) + 7 satırlık özet. Kart sayacı ≠ tablo satır sayısı ise `GV.notice(neutral)` açıklama basar.
3. **Kazandırdığı Müşteriler** — 10 kolonlu tablo + 7 satırlık özet; kart `kazanilan` ≠ tablo sayısı ise ayrı `GV.notice`.
4. **Komisyonlar** — 9 kolonlu tablo (arşivli satır `.is-passive`, toplama **dahil**) + 9 satırlık özet. Kart↔kayıt farkı varsa `GV.notice(warn)`; kartta komisyon yazılı ama kaydı yoksa ikinci uyarı.
5. **Performans** — 3 bölüm: Dönüşüm Hunisi (7 satır, kart ve türetilen oran yan yana) · Getirdiği Değer (9 satır, efektif komisyon oranı dahil) · Devamlılık (8 satır, 60/120/240 gün canlılık eşiği).
6. **Aktivite Geçmişi** — `GV.activity(acts)` veya boş durum.
**İşlem butonları:** `GV.pageHead` — "Referans kaynakları" · "Komisyonlar" (`app-komisyon.html?f_referans=`) · "Referans raporu" (`app-rapor-referans.html`). Sekme içi bağlantılar: Aday listesi · Müşteri listesi · Komisyon listesi.
**Toplu işlemler:** yok.
**Bildirimler:** `GV.notice` — finans yetkisi yoksa "Tutarlar gizli" (`neutral`) · kart/kayıt sapmaları (`neutral`/`warn`) · performans sekmesinde ölçüm yöntemi notu. `GV.toast`/`GV.result` yok — ekran salt okunur.
**Yetkilendirme:** `GV.perm.can('finans')` → tüm para alanları `.cell-mask` ile maskelenir ve sekmelerin başına `GV.notice` uyarısı basılır. 403 kapısı yok.
**Boş durum:** `GV.empty` — kayıt yoksa "Yönlendiren bulunamadı" + listeye dönüş; sekmelerde "Bu kaynaktan gelen aday kaydı yok" · "Bu kaynaktan kazanılmış müşteri yok" · "Komisyon kaydı yok" (komisyon modeli "Yok" ise açıklama değişir) · "Bu yönlendirende kayıtlı hareket yok".
**Hata durumu:** `GV.errorState` yok.
**Mobil görünüm:** `mobile(r)` yok; tüm tablolar `.gv-tablewrap.is-mobilescroll`.
**Kabul kriterleri:**
1. `hakedis`/`odenen`/`bekleyen` üç değeri komisyon kayıtlarından **arşivliler dahil** türetilmeli; fark varsa ekranda sayısal olarak yazılmalı.
2. Kart sayacı ile listelenen kayıt sayısı farklıysa ekran fark nedenini açıklamalı, sayıyı düzeltmemeli.
3. Ekrandaki hiçbir etikette "hakediş" kelimesi geçmemeli (alan adı veride korunur, etiket "Komisyon kazancı"dır).
**Bulgular:** "Yönlendiren kaynak kaydı" ve komisyon satırındaki kod bağlantıları `app-komisyon.html?f_referans=` liste filtresine gidiyor; `app-komisyon-detay.html?id=` yayında olmasına rağmen tekil kazanç kartına doğrudan bağlantı verilmiyor.

---

### `app-referans-form.html` — Yönlendiren Kaydı

**Tip:** form
**Bölüm:** `satis` · menüde yok, şuradan bağlanır: `app-referans.html` ("Yeni Yönlendiren").
**Amaç:** PROMPT.md §9'daki 21 alanlık yönlendiren kartını kurmak; komisyon tutarlarını komisyon kayıtlarıyla zorunlu uyuma sokmak.
**Kullanıcılar:** `satis` bölümüne erişimi olan 7 rol + `GV.perm.can('ekle'|'duzenle')`.
**Veri kaynağı:** `DB.referrers` · `DB.refTypes` · `DB.leads` · `DB.customers` · `DB.commissions` · `DB.activities` · `DB.employees` (`DB.emp`, `DB.empName`) · `DB.today`
**Üst özet kartları:** düzenlemede "Kayıt Özeti" (6 satır) + finans yetkisi varsa "Komisyon Kazancı Kaynağı" kartı (4 satır: bağlı kayıt sayısı, toplam/ödenen/bekleyen beklenen değerler).
**Sekmeler:** yok.
**Arama:** yok.
**Filtreler:** yok.
**Tablo kolonları:** —
**Form alanları:** `GV.form({id:'referans'})` — finans yetkisi varsa **6 bölüm, 22 alan**; yoksa 5 bölüm, 16 alan:
- *Kimlik ve referans türü* — 4 alan: `ad`* · `tur`* (yalnız `DB.refTypes` sözlüğünden; sözlük dışı değer boşaltılır ve `danger` notice basılır) · `firma` · `pozisyon`
- *İletişim ve şirket içi sahiplik* — 3 alan: `tel` · `eposta` · `sorumlu`*
- *Yönlendirme performansı* — 5–6 alan: `yonlendirme`* · `kazanilan`* (yönlendirmeyi aşamaz) · `kaybedilen`* · `donusum` (iki sayaçtan hesaplanır, canlı senkron) · `sonYonlendirme` (sayaç varsa zorunlu, yoksa yasak) · `ciro` (yalnız finans)
- *Komisyon ve kazanç* (yalnız finans) — 6 alan: `komisyonModeli`* · `komisyonOrani` · `sabitBedel` · `hakedis` · `odenen` · `bekleyen` — **üçü de komisyon kayıtlarından türetilen değerle birebir eşleşmezse kaydetme engellenir**
- *Görüşme notları ve belgeler* — 2 alan: `not` · `belgeler` (`type:'file'`, kaydetmede `delete v.belgeler`)
- *Kayıt durumu* — 2 alan: `durum`* · `aktif` (switch, `durum` ile çapraz doğrulamalı)
**Detay sekmeleri:** —
**İşlem butonları:** `GV.pageHead` — "Vazgeç" · "Kaydet"/"Değişiklikleri kaydet". Form altında `#kaydetAlt`. Bağlam kartında "Yönlendiren kartını aç", uyarı içinde "Bağlı kayıtları gör" ve "Komisyon kayıtları".
**Toplu işlemler:** —
**Bildirimler:** `GV.notice` — sözlük dışı tür (`danger`) · bağlı kayıt var/yok (`warn`/`ok`) · komisyon kaynağı kilidi (`neutral`, `icon:'i-lock'`) · finans alanları yok (`neutral`) · yeni kayıt akış notu (`info`). `GV.toast` — "Değişiklik yok…" · "`<kod>` güncellendi · `<n>` alan" · "`<kod>` oluşturuldu". `GV.errorState` 403'te.
**Yetkilendirme:** `GV.perm.can('duzenle'|'ekle')` → form hiç kurulmaz (403 + gerçek aksiyonlarla değiştirilmiş buton grubu). `GV.perm.can('finans')` → 6 para alanı forma basılmaz; kaydetmede düzenlemede mevcut değer korunur, yeni kayıtta sıfırla açılır.
**Boş durum:** `GV.empty` — `?id=` hatalıysa "Kayıt bulunamadı" + listeye dönüş.
**Hata durumu:** `GV.errorState` var.
**Mobil görünüm:** `GV.form` `cols` ızgarası.
**Kabul kriterleri:**
1. `donusum` alanı `yonlendirme`/`kazanilan` girişleri değiştikçe canlı güncellenmeli ve doğrulamaya takılmamalı.
2. Sözlükte olmayan bir tür sessizce seçenek kümesine **eklenmemeli**; kullanıcı geçerli tür seçmeye zorlanmalı.
3. `hakedis = odenen + bekleyen` ve `hakedis = Σ komisyon.tutar` iki koşulu birlikte sağlanmadan kayıt kabul edilmemeli.
4. Yeni kod `REF-NNN` deseninde, en yüksek mevcut numaradan üretilmeli.
**Bulgular:** `belgeler` alanı forma basılıyor ama koleksiyonda karşılığı yok; kaydetmeden önce `delete v.belgeler` ile atılıyor — kullanıcı dosya yüklediğini sanır, hiçbir yere yazılmaz (hint metninde belirtilmiş).

---

### `app-komisyon.html` — Komisyon Kazançları

**Tip:** liste
**Bölüm:** `satis` · menü etiketi "Komisyon Kazançları" (`screen:'komisyon'`, `seclbl:'Referans'` grubu)
**Amaç:** Referans kaynaklı satışlardan doğan komisyon kazançlarını onay ve ödeme ekseninde takip etmek.
**Kullanıcılar:** `satis` bölümüne erişimi olan 7 rol. Onaylama `GV.perm.can('onay')` ile kapılı.
**Veri kaynağı:** `DB.commissions` (kaynak) · `DB.referrers` · `DB.customers` · `DB.today`
**Üst özet kartları:** 4 KPI — Toplam kazanç (Σ`tutar`) · Ödenen (`durum==='Ödendi'` Σ) · Onay bekleyen (`onay==='Bekliyor'` adet) · Ödeme bekleyen (ödenmemişlerin Σ). Para KPI'ları finans yetkisi yoksa 0.
**Sekmeler:** 5 — Açık Kazançlar (`durum!=='Ödendi'`) · Onay Bekleyen · Ödeme Bekleyen (`onay='Onaylandı'` + ödenmemiş) · Ödenenler · Tümü.
**Arama:** `search.fields` = `kod` · `kisi` · `firma` · `durum`.
**Filtreler:** `durum` · multi · sabit dörtlü | `onay` · select · sabit üçlü | `referans` · select · `DB.referrers` | `musteri` · select · `DB.customers` | `hakedisTarihi` · daterange.
**Tablo kolonları:** Kazanç (kilitli, %18) · Yönlendiren · Kazandırdığı müşteri · Ciro · Oran · Kazanç tutarı · Kazanç tarihi · Onay · **Ödeme tarihi (gizli)** · Durum. `pageSize:10`.
**Form alanları:** —
**Detay sekmeleri:** —
**İşlem butonları:** `GV.pageHead` — "Yönlendirenler" · "Yeni Kazanç" (`app-komisyon-form.html`). `rowActions[]` 3: **Kazancı aç** (`app-komisyon-detay.html?id=`) · **Onayla** (yetki + zaten onaylı kontrolü + `GV.confirm`; `onay='Onaylandı'`, `durum='Onaylandı'`) · **Ödendi işaretle** (önce onay şartı + `GV.confirm`; `durum='Ödendi'`, `odemeTarihi=DB.today`).
**Toplu işlemler:** `bulk[]` 2 — "Toplu onayla" · "Dışa aktar". **Yetki kapısı yok** (satır aksiyonundaki `can('onay')` tekrarlanmıyor).
**Bildirimler:** `GV.toast` — "Onaylama yetkiniz yok." (`danger`) · "Bu kazanç zaten onaylı." (`info`) · "`<kod>` onaylandı" (`ok`) · "Önce yönetici onayı alınmalı." (`warn`) · "Bu kazanç zaten ödenmiş." (`info`) · "`<kod>` ödendi olarak işaretlendi" (`ok`). `GV.confirm` iki aksiyonda da.
**Yetkilendirme:** `GV.perm.can('finans')` — ciro, kazanç tutarı ve dört KPI maskelenir. `GV.perm.can('onay')` — onaylama satır aksiyonunda.
**Boş durum:** `GV.empty` — "Bu görünümde kazanç yok" / "Kazanılan referanslı satışlar burada komisyon kazancına dönüşür." Aksiyon yok.
**Hata durumu:** `GV.errorState` yok.
**Mobil görünüm:** `mobile(x)` var — kod + tutar, kişi·firma, durum rozeti.
**Kabul kriterleri:**
1. "Ödendi işaretle" onaysız kayıtta çalışmamalı, `warn` toast basmalı.
2. Onay/ödeme sonrası yönlendiren kartındaki toplam/ödenen/bekleyen alanları **bu ekranda güncellenmiyor** — güncelleme yalnız `app-komisyon-detay.html` ve `app-komisyon-form.html`'de var; bu davranış bilinçli mi kontrol edilmeli.
3. Finans yetkisi olmayan rolde tüm tutarlar `••••` görünmeli.
**Bulgular:** Liste ekranındaki "Ödendi işaretle" aksiyonu `DB.referrers` kartını **senkronlamıyor**; aynı işlemi `app-komisyon-detay.html` `odeAkisi()` içinde `ref.odenen/bekleyen/hakedis` güncellemesiyle yapıyor. İki yol aynı mutasyonu farklı sonuçla bırakıyor — kart↔kayıt uyumu liste üzerinden bozulabilir.

---

### `app-komisyon-detay.html` — Komisyon Kazancı Detayı

**Tip:** detay
**Bölüm:** `satis` · menüde yok, şuradan bağlanır: `app-komisyon.html` satır aksiyonu ve `app-komisyon-detay.html` yönlendiren tablosu.
**Amaç:** Tek bir komisyon kazancının hesap zincirini, yönlendiren kartındaki payını, dayanak sözleşme adaylarını ve onay/ödeme akışını ölçülebilir biçimde göstermek.
**Kullanıcılar:** `satis` bölümüne erişimi olan 7 rol. Onaylama `can('onay')`, ödeme `can('finans')` ile kapılı.
**Veri kaynağı:** `DB.commissions` · `DB.referrers` · `DB.customers` · `DB.approvals` · `DB.activities` · `DB.contracts` · `DB.invoices` · `DB.payments` · `DB.empName` · `DB.today`
**Üst özet kartları:** `kpis[]` yok. Sağ panelde 4 kart: **Özet** (10 satır) · **Hesap** (7 satır, doğrulama satırı dahil) · **Yönlendiren** (7 satır, varsa) · **Onay ve Ödeme** (5 satır) · **Son Hareket**.
**Sekmeler:** —
**Arama:** yok.
**Filtreler:** yok.
**Tablo kolonları:** —
**Form alanları:** —
**Detay sekmeleri:** 6 (`GV.tabs('#recTabs')`):
1. **Genel** — 4 bölüm: Kazanç Kimliği (8 alan) · Kazanç Modeli ve Tutar (5, kart oranıyla uyum rozetli) · Tarihler ve Süreç (8, 30/60/90 gün ödeme bekleyiş eşiği) · "Kayıtta Tutulmayan Alanlar" (`GV.notice`: sözleşme/fatura/para birimi alanı yok).
2. **Hesaplama** — model bazlı 4 satırlık hesap tablosu (kalem · eksen · hesap · değer), sayaç satırı ve 11 satırlık özet. Dört ayrı uyuşmazlık uyarısı: hesap tutmuyor · kayıt oranı ≠ kart oranı · sabit bedel ≠ kart bedeli · model ≠ kart modeli.
3. **Yönlendiren** — kart bilgileri (6) · komisyon koşulu (10) · bu kazancın payı (7) + yönlendirenin tüm kazançlarının 9 kolonlu tablosu (arşivli satır soluk, toplama dahil) + 9 satırlık özet.
4. **Dayanak Sözleşme** — `GV.notice(warn)` "sözleşme bağı veride yazılı DEĞİL" + müşteri kartı (14 alan) + 9 kolonlu aday sözleşme tablosu ("ciro eşleşmesi" ipucu rozetiyle) + 8 satırlık özet + 9 kolonlu fatura tablosu + tahsilat özeti (brüt eksen notu ile).
5. **Onay ve Ödeme** — `GV.chain` üç adımlı zincir (Kazanç doğdu → Onay → Ödeme) + onay kaydının 11 alanı + ödeme durumunun 10 alanı + koşullu aksiyon butonları.
6. **Aktivite Geçmişi** — `GV.activity(acts)` veya boş durum.
**İşlem butonları:** `GV.pageHead` — "Komisyon listesi" · "Yönlendiren" · "Referans raporu". Sekme içi: **Onayla** (`#btnOnayla`, yalnız `canOnay && !onaylı && !reddedildi && kazanç doğmuş` ise basılır) · **Ödendi işaretle** (`#btnOde`, yalnız `canFinans && onaylı && !ödendi`). Koşul sağlanmıyorsa buton **hiç basılmaz**, yerine gerekçeli `GV.notice` yazılır.
**Toplu işlemler:** yok.
**Bildirimler:** `GV.confirm` (onay ve ödeme) · `GV.toast` ("`<kod>` onaylandı" / "`<kod>` ödendi olarak işaretlendi", `ok`) · `GV.notice` (arşiv notu, hesap uyuşmazlıkları, kart bütünlüğü bozuk, ödeme durumu gerekçesi, tahsilat brüt eksen notu). Mutasyon sonrası 700 ms gecikmeyle `GV.refresh()`.
**Yetkilendirme:** `GV.perm.can('finans')` (tüm para maskeleri + ödeme aksiyonu) · `GV.perm.can('onay')` (onay aksiyonu). 403 kapısı yok — yetkisiz rol kaydı maskeli görür.
**Boş durum:** `GV.empty` — "Komisyon kazancı bulunamadı" (listeye dönüş) · "Yönlendiren kaydı bulunamadı" · "Müşteri kaydı bulunamadı" · "Bu müşteride sözleşme kaydı yok" · "Bu müşteriye kesilmiş fatura yok" · "Bu komisyona ait onay kaydı yok" · "Bu komisyonda kayıtlı hareket yok".
**Hata durumu:** `GV.errorState` yok.
**Mobil görünüm:** `mobile(r)` yok; tablolar `.gv-tablewrap.is-mobilescroll`.
**Kabul kriterleri:**
1. Ödeme işaretlendiğinde `ref.odenen`, `ref.bekleyen` ve `ref.hakedis` birlikte güncellenmeli; `hakedis = odenen + bekleyen` her koşulda korunmalı.
2. Sözleşme bağı olmadığı ekranda açıkça yazılmalı; tutar eşleşmesi "ipucu" olarak etiketlenmeli, "bağ" denmemeli.
3. Sabit bedelli kazançta `ciro × oran` doğrulaması uygulanmamalı, yerine kart sabit bedeliyle karşılaştırma yapılmalı.
4. Arşivli komisyon kayıtları yönlendiren toplamına **dahil** edilmeli.
**Bulgular:** Onay kaydının tutar ekseni ekranda "(KDV hariç)" olarak etiketleniyor; `app-teklif-detay.html` aynı `DB.approvals[].tutar` alanını "Onaya konu tutar (KDV dahil)" diye etiketliyor. Aynı alan iki ekranda iki farklı eksende yazılı — components.md §9b'nin "bir alanda iki eksen yaşayamaz" kuralına aykırı.

---

### `app-komisyon-form.html` — Komisyon Kazancı Kaydı

**Tip:** form
**Bölüm:** `satis` · menüde yok, şuradan bağlanır: `app-komisyon.html` ("Yeni Kazanç").
**Amaç:** Komisyon kazancı oluşturmak/düzenlemek ve yönlendiren kartının üç para eksenini komisyon koleksiyonundan yeniden hesaplamak.
**Kullanıcılar:** `satis` bölümüne erişimi olan roller arasından **yalnız finans yetkisi olanlar** — ekranın tamamı finans eksenindedir.
**Veri kaynağı:** `DB.commissions` · `DB.referrers` · `DB.customers` · `DB.approvals` · `DB.activities` · `DB.contracts` · `DB.emp`/`DB.empName` · `DB.today`
**Üst özet kartları:** düzenlemede "Kayıt Özeti" (9 satır). Ayrıca ayrı bir "Hesap ve Kaydetmenin Etkisi" kartı — formdaki değerler değiştikçe canlı yeniden çizilir.
**Sekmeler:** yok.
**Arama:** yok.
**Filtreler:** yok.
**Tablo kolonları:** —
**Form alanları:** `GV.form({id:'komisyon'})` — **4 bölüm, 11 alan**:
- *Kazanç kimliği ve bağlar* — 2 alan: `referans`* (komisyon modeli "Yok" olan kaynak reddedilir) · `musteri`* (aynı müşteri+yönlendiren çifti için ikinci kazanç engellenir)
- *Komisyon modeli ve tutar* — 3 alan: `ciro` · `oran` (kart modeliyle çapraz doğrulama) · `tutar`* (`ciro × oran` ile uyuşmazsa beklenen değer yazılır)
- *Süreç: kazanç, onay ve ödeme* — 4 alan: `hakedisTarihi` · `odemeTarihi` · `onay`* · `durum`* — dördü birbirini doğrular, ölü kombinasyon kaydedilemez
- *Kayıt durumu* — 2 alan: `aktif` (switch) · `arsiv` (switch, yalnız ödenmiş kazanç arşivlenir)
`kisi` ve `firma` **form alanı değildir**; kaydetmede seçilen yönlendiren ve müşteri kartından türetilir.
**Detay sekmeleri:** —
**İşlem butonları:** `GV.pageHead` — "Vazgeç" · "Kaydet"/"Değişiklikleri kaydet". Form altında `#kaydetAlt`. Bağlam kartında "Kazanç kartını aç"; uyarılarda "Yönlendiren kartı", "Bu yönlendirenin kazançları", "Müşteri kartı".
**Toplu işlemler:** —
**Bildirimler:** `GV.notice` — yönlendiren kartını beslediği uyarısı (`warn`) · yönlendiren bulunamadı (`danger`) · müşteri kaynağı çakışması (`warn`) · onay kuyruğu kaydı (`info`) · arşiv notu (`neutral`) · yeni kayıt akış notu (`info`) · canlı etki panelinde oran/bedel/kaynak sapmaları (`warn`). `GV.toast` — kaydetme sonucu + yönlendiren kartının yeniden hesaplanan toplamı. `GV.errorState` iki ayrı 403 gerekçesiyle.
**Yetkilendirme:** **Sayfa seviyesinde 403 var.** Önce `GV.perm.can('finans')` — yoksa form hiç kurulmaz, "Bu ekran için finansal veri yetkisi gerekiyor" `errorState`'i basılır. Sonra `GV.perm.can('ekle'|'duzenle')` ikinci kapı. Her iki durumda `.gv-state-acts` içindeki "Tekrar dene" gerçek aksiyonlarla değiştirilir.
**Boş durum:** `GV.empty` — `?id=` hatalıysa "Komisyon kazancı bulunamadı" + listeye dönüş. Canlı etki panelinde yönlendiren seçilmemişse `GV.notice(neutral)` yönlendirici metin.
**Hata durumu:** `GV.errorState` var (iki gerekçe).
**Mobil görünüm:** `GV.form` `cols` ızgarası + `gv-summary` blokları.
**Kabul kriterleri:**
1. Kaydetmede `refSenkron()` yönlendiren kartının `hakedis`/`odenen`/`bekleyen` alanlarını **koleksiyondan** yeniden hesaplamalı; elle değer yazılmamalı.
2. Yönlendiren değiştirildiyse **eski kart da** yeniden hesaplanmalı ve iki karta ayrı aktivite satırı düşmeli.
3. Canlı etki paneli, kaydetmeden önceki ve sonraki kart değerlerini farkıyla göstermeli.
4. Durum ↔ onay kombinasyonları (Ödendi–Onaylandı, Onay bekliyor–Bekliyor, Bekliyor–"—") doğrulanmadan kayıt kabul edilmemeli.
**Bulgular:** Bu ekran yönlendiren kartını kaydetmede senkronluyor; `app-komisyon.html` listesindeki "Onayla"/"Ödendi işaretle" aksiyonları aynı senkronu yapmıyor. Aynı mutasyonun üç ekranda üç farklı yan etkisi var (`komisyon.html` hiç, `komisyon-detay.html` elle artırma, `komisyon-form.html` koleksiyondan yeniden hesap).

---

### `app-onanaliz.html` — Ön Analizler

**Tip:** liste
**Bölüm:** `satis` · menü etiketi "Ön Analizler" (`screen:'onanaliz'`, `seclbl:'Süreç'` grubu)
**Amaç:** Teklif öncesi hazırlanan kapsam/efor/maliyet analizlerini listelemek ve onay-teklif zincirine bağlamak.
**Kullanıcılar:** `satis` bölümüne erişimi olan 7 rol.
**Veri kaynağı:** `DB.analyses` (kaynak) · `DB.services` · `DB.employees` · `DB.empName`
**Üst özet kartları:** 4 KPI — Toplam ön analiz · Hazırlanan (`durum==='Hazırlanıyor'`) · Onay bekleyen · Tahmini iş gücü (Σ`isgucu`, "sa" soneki).
**Sekmeler:** 6 — Açık Analizler (`durum!=='Onaylandı'`) · Hazırlanıyor · Onay Bekleyen · Onaylananlar · Riskli (`riskler.length ≥ 2`) · Tümü.
**Arama:** `search.fields` = `kod` · `firma` · `hizmet` · `amac` · `hedefKullanici`.
**Filtreler:** `durum` · multi · sabit üçlü | `hizmet` · multi · `DB.services` | `hazirlayan` · select · `DB.employees` | `mobil` · select · özel `test` ("Sadece mobil içerenler") | `aiOzellik` · select · özel `test` | `maliyet` · text (en az) | `tarih` · daterange.
**Tablo kolonları:** Ön analiz (kilitli, %24) · Hizmet · Kapsam (ilk 4 özellik çipi + "+N") · Modül · **Rol (gizli)** · Tahmini ekip · İş gücü · Süre · Maliyet tahmini · Risk · Hazırlayan · Durum. Görünümler: tablo + kart. `pageSize:10`.
**Form alanları:** —
**Detay sekmeleri:** —
**İşlem butonları:** `GV.pageHead` — "Teklifler" · "Yeni Ön Analiz". `rowActions[]` 3: **Analizi aç** (`app-onanaliz-detay.html?id=`) · **Analiz çıktıları** (`GV.modal`, PROMPT.md §10'un 10 çıktısını kayıttan üretir) · **Teklife dönüştür** (`durum!=='Onaylandı'` ise `warn` toast; onaylıysa `GV.confirm`).
**Toplu işlemler:** `bulk[]` 2 — "Onaya gönder" · "Dışa aktar". Yetki kapısı yok.
**Bildirimler:** `GV.modal` (analiz çıktıları) · `GV.toast` ("Önce ön analizin onaylanması gerekiyor." `warn`; "Teklif taslağı oluşturuldu" `ok`) · `GV.confirm` (teklife dönüştür).
**Yetkilendirme:** `GV.perm` çağrısı **yok** — maliyet alanı bu ekranda maskelenmiyor.
**Boş durum:** `GV.empty` — "Bu görünümde ön analiz yok" + "Yeni Ön Analiz" aksiyonu.
**Hata durumu:** `GV.errorState` yok.
**Mobil görünüm:** `mobile(x)` var — firma + durum, kod·hizmet, modül/iş gücü, maliyet. Ayrıca `card(x)`.
**Kabul kriterleri:**
1. "Riskli" sekmesi `riskler` dizisinin uzunluğuna göre süzmeli, veride hazır bir "riskli" bayrağı aramamalı.
2. "Teklife dönüştür" onaylanmamış analizde `DB.quotes`'a **hiçbir şey yazmamalı**.
3. Kapsam kolonu 4 çipten sonrasını "+N özellik" olarak toplamalı, dışa aktarımda tam listeyi vermeli.
**Bulgular:** (a) `rowActions[].teklif` yalnız toast basıyor, gerçek teklif kaydı **yazmıyor**; aynı akış `app-onanaliz-detay.html`'de `DB.quotes.unshift(...)` ile gerçekten kayıt üretiyor. İki ekranda aynı adlı aksiyonun biri sahte. (b) `GV.perm.can('finans')` kontrolü yok; `app-onanaliz-detay.html` ve `app-onanaliz-form.html` aynı `maliyet` alanını maskeliyor/gizliyor.

---

### `app-onanaliz-detay.html` — Ön Analiz Detayı

**Tip:** detay
**Bölüm:** `satis` · menüde yok, şuradan bağlanır: `app-onanaliz.html` satır aksiyonu, `app-onanaliz-form.html`.
**Amaç:** Bir ön analizin 28 değerlendirme alanını, ölçülmüş para eksenini, üretilen teklifi ve satış sonucunu tek kartta göstermek.
**Kullanıcılar:** `satis` bölümüne erişimi olan 7 rol.
**Veri kaynağı:** `DB.analyses` · `DB.leads` · `DB.customers` · `DB.pipelineStages` · `DB.quotes` · `DB.approvals` · `DB.activities` · `DB.projects` · `DB.services` · `DB.empName` · `GV.session.emp` · `DB.today`
**Üst özet kartları:** `kpis[]` yok. Sağ panelde 4 kart: **Özet** (9 satır) · **Değerlendirme** (`GV.notice` + 7 satır) · **Satış Hattı** (varsa, 6 satır) · **Son Hareket**.
**Sekmeler:** —
**Arama:** yok.
**Filtreler:** yok.
**Tablo kolonları:** —
**Form alanları:** "Teklif oluştur" modalı `GV.form` **kullanmıyor** — elle `field` markup'ı: `#tklIndirim` (yalnız finans) · `#tklPlan` · `#tklGaranti` · `#tklDestek` (üçü de mevcut tekliflerden tekilleştirilmiş seçenekler).
**Detay sekmeleri:** 7 (`GV.tabs('#recTabs')`):
1. **Genel** — 8 bölüm: Analiz Kimliği (8) · Amaç ve Kullanıcılar (3) · Modül Yapısı (3) · Platform ve Özellikler (12 bayrak + entegrasyonlar) · Teknik ve Uyum (3) · Efor ve Bedel (4) · Kapsam/Risk/Beklentiler (5 liste) · Onay Kaydı (8 kolonlu tablo veya boş durum).
2. **Değerlendirme** — `GV.notice(warn)` "hazır skor alanı yok" + Ölçek Eksenleri tablosu (6 eksen, koleksiyon içi göreli çubuk) + Özellik Kapsamı (6 satır) + Risk ve Açık Uçlar (10 satır) + Müşteri Adayı Niteliği (8 satır).
3. **Kapsam ve Hizmet** — Hizmet Eşleşmesi (4) · Kapsam Sınırı (4) · Modüller ve Roller (5) · Platform Kapsamı (12 satırlık tablo) · Teknik Notlar (`GV.notice` + 7 satır) · Tahmini Efor (4).
4. **Maliyet ve Süre** — `GV.notice` ölçüm sonucu + Bedel (4) + **Eksen Ölçümü tablosu** (7 kolon: analiz · teklif · analiz bedeli · teklif ara toplamı · net · brüt · eşleşen eksen) + Süre ve İş Gücü (11 satır, adam-gün ve adam-saat iki okuma birlikte) + Bedelin diğer eksenlerle karşılaştırması (7 satır).
5. **Üretilen Teklif** — teklif kaydının 17 alanı + 8 satırlık tutar zinciri özeti + zincir doğrulaması; ayrıca aynı adaya bağlı **başka** tekliflerin 6 kolonlu tablosu.
6. **Sonuç ve Proje** — durum bazlı `GV.notice` (kazanıldı `ok` / kaybedildi `danger` / devam `info` / lead yok `warn`) + Satış Sonucu (8 alan) + müşteri üzerinden aday proje tablosu (8 kolon).
7. **Aktivite Geçmişi** — `GV.activity(acts)`.
**İşlem butonları:** `GV.pageHead` — "Ön analiz listesi" · (lead varsa) "Müşteri adayı" · teklif varsa "Üretilen teklif" (`app-teklif-detay.html?id=`), yoksa ve `can('ekle')` varsa "Teklif oluştur" (`run:teklifAkisi`). Sekme içi: "Teklif detayını aç" · "Teklif listesi" · "Proje listesi" · "Onay kuyruğunu aç".
**Toplu işlemler:** yok.
**Bildirimler:** `GV.modal` (teklif oluşturma, `size:'lg'`) · `GV.toast` ("İndirim negatif olamaz." / "İndirim, ara toplamdan küçük olmalı." `danger`; "`<kod>` taslak teklif olarak oluşturuldu" `ok`) · `GV.notice` (eksen ölçümü, skor alanı yok, teknoloji yığını yok, sonuç durumu). Mutasyondan 700 ms sonra `GV.refresh()`.
**Yetkilendirme:** `GV.perm.can('finans')` — tüm para alanları maskelenir, teklif modalında indirim alanı `GV.notice` ile kapatılır. `GV.perm.can('ekle')` — "Teklif oluştur" aksiyonu.
**Boş durum:** `GV.empty` — "Ön analiz bulunamadı" (listeye dönüş) · "Onay kaydı yok" · "Bağlı müşteri adayı yok" · "Ölçüm yapılamadı" · "Bu analizden teklif üretilmedi" · "Kaybedilen analizden proje doğmadı" / "Bu analizden doğan proje yok" · "Bu ön analizde kayıtlı hareket yok".
**Hata durumu:** `GV.errorState` yok.
**Mobil görünüm:** `mobile(r)` yok; tablolar `.gv-tablewrap.is-mobilescroll`.
**Kabul kriterleri:**
1. `maliyet` alanının ekseni her açılışta **ölçülmeli** (teklife dönmüş analizlerde ara toplam / net / brüt karşılaştırması) ve sonucu alan etiketine yazılmalı.
2. "Teklif oluştur" gerçekten `DB.quotes`'a kayıt yazmalı; KDV %20 ile net üzerinden hesaplanmalı ve `quote.analiz` bağı kurulmalı.
3. Analiz ile proje arasında veride yazılı bağ olmadığı ekranda açıkça yazılmalı; proje listesi "müşteri üzerinden aday" diye etiketlenmeli.
4. İş gücü birimi uydurulmamalı; adam-gün ve adam-saat iki okuma da sayıyla gösterilmeli.
**Bulgular:** `pGenel` içindeki teklif oluşturma zinciri KDV oranını `0.20` sabitiyle yazıyor; oran `DB` içinde bir sözlükten değil koddan geliyor — veri değişirse ekran sapar (modal metninde "sekiz teklifin tamamı bu oranı kullanıyor" diye gerekçelendirilmiş ama sabit yine kodda).

---

### `app-onanaliz-form.html` — Ön Analiz Kaydı

**Tip:** form
**Bölüm:** `satis` · menüde yok, şuradan bağlanır: `app-onanaliz.html` ("Yeni Ön Analiz"). Ayrıca `?lead=LEAD-...` parametresiyle ön doldurulabilir.
**Amaç:** PROMPT.md §10'un 28 değerlendirme alanını tek formda toplamak.
**Kullanıcılar:** `satis` bölümüne erişimi olan 7 rol + `GV.perm.can('ekle'|'duzenle')`.
**Veri kaynağı:** `DB.analyses` · `DB.leads` · `DB.customers` · `DB.services` · `DB.quotes` · `DB.pipelineStages` · `DB.activities` · `DB.employees` (`DB.emp`, `DB.empName`) · `DB.today`
**Üst özet kartları:** düzenlemede "Kayıt Özeti" (9 satır).
**Sekmeler:** yok.
**Arama:** yok.
**Filtreler:** yok.
**Tablo kolonları:** —
**Form alanları:** `GV.form({id:'onanaliz'})` — finans yetkisi varsa **9 bölüm, 34 alan**; yoksa 8 bölüm, 33 alan:
- *Analiz kimliği ve talep bağı* — 5 alan: `lead` · `firma`* (seçili adayın firmasıyla eşleşmeli) · `hizmet`* (yalnız `DB.services` kataloğundan) · `hazirlayan`* · `tarih`* (ileri tarih yasak)
- *Amaç ve kullanıcılar* — 3 alan: `amac`* · `hedefKullanici`* · `rolSayisi`*
- *Modül yapısı* — 2 alan: `anaModul`* · `altModul`* (ana modülden küçük olamaz)
- *Platform ve özellik eksenleri* — 11 checkbox: `web` · `mobil` · `yonetimPaneli` · `musteriPaneli` · `aiOzellik` · `odeme` · `abonelik` · `cokluDil` · `cokluSirket` · `raporlama` · `bildirim`
- *Entegrasyon, altyapı ve uyum* — 4 alan: `entegrasyon` (satır satır metin → dizi) · `sunucu`* · `guvenlik`* · `kvkk` (12. bayrak)
- *Efor ve zaman planı* — 4 alan: `ekip`* · `isgucu`* · `sure`* · `sureBirim`* (küme koleksiyondan türetilir)
- *Bedel* (yalnız finans) — 1 alan: `maliyet`* (etiketi ölçüm sonucuna göre değişir)
- *Kapsam sınırı* — 2 alan: `kapsamIci`* · `kapsamDisi`
- *Risk ve açık uçlar* — 3 alan: `riskler` · `belirsiz` · `beklenen`
- *Kayıt durumu* — 2 alan: `durum`* (Onaylandı için kapsam içi zorunlu) · `aktif` (switch; teklif doğmuşsa arşivlenemez)
**Detay sekmeleri:** —
**İşlem butonları:** `GV.pageHead` — "Vazgeç" · "Kaydet"/"Değişiklikleri kaydet". Form altında `#kaydetAlt`. Bağlam kartında "Ön analiz kartını aç"; uyarılarda "Üretilen teklifi aç" · "Müşteri adayını aç" · "Adayı aç".
**Toplu işlemler:** —
**Bildirimler:** `GV.notice` — katalog dışı hizmet (`danger`) · tekliften doğmuş uyarısı (`warn`) / teklif yok (`ok`) · bedel alanı yok (`neutral`) · yeni kayıt akış notu (`info`) · aday ön seçimi (`ok`) / adres parametresi bulunamadı (`warn`). `GV.toast` — kaydetme sonuçları. `GV.errorState` 403'te.
**Yetkilendirme:** `GV.perm.can('duzenle'|'ekle')` → form hiç kurulmaz. `GV.perm.can('finans')` → `maliyet` bölümü forma basılmaz; düzenlemede mevcut değer korunur, yeni kayıtta 0.
**Boş durum:** `GV.empty` — `?id=` hatalıysa "Ön analiz bulunamadı" + listeye dönüş.
**Hata durumu:** `GV.errorState` var.
**Mobil görünüm:** `GV.form` `cols` ızgarası.
**Kabul kriterleri:**
1. Aday seçilince firma alanı adayın firmasıyla, amaç boşsa adayın özetiyle otomatik dolmalı; kullanıcı yazdığı değer ezilmemeli.
2. Liste alanları (`entegrasyon`, `riskler`, `belirsiz`, `beklenen`, `kapsamIci`, `kapsamDisi`) satır satır metinden diziye çevrilmeli, boş satırlar atılmalı.
3. Katalogda olmayan hizmet sessizce seçenek kümesine eklenmemeli.
4. Teklife dönmüş analiz arşive alınamamalı.
**Bulgular:** Altı liste alanı `textarea` + satır bölme ile kuruluyor; `GV.form`'da dizi/çip tipi olmadığı için bu **eksik bileşen** izidir (kodda yorumla belirtilmiş).

---

### `app-teklif.html` — Teklifler

**Tip:** liste
**Bölüm:** `satis` · menü etiketi "Teklifler" (`screen:'teklif'`, `cnt:'teklif'` rozeti, `seclbl:'Süreç'` grubu)
**Amaç:** Tüm teklifleri durum, iç onay, geçerlilik ve başarı oranı ekseninde takip etmek.
**Kullanıcılar:** `satis` bölümüne erişimi olan 7 rol.
**Veri kaynağı:** `DB.quotes` (kaynak) · `DB.customers` · `DB.employees` · `DB.empName`
**Üst özet kartları:** 4 KPI — Açık teklif · Açık teklif değeri (Σ`toplam`, brüt) · Geçerliliği dolan · Teklif başarı oranı (kazanılan / (kazanılan+kaybedilen)).
**Sekmeler:** 8 — Açık Teklifler · Taslak · İç Onay Bekleyen · Müşteride (`İletildi`+`Müşteri değerlendirmesinde`) · Süresi Dolanlar · Kazanılanlar · Kaybedilenler · Tümü.
**Arama:** `search.fields` = `kod` · `firma` · `durum` · `odemePlani`.
**Filtreler:** `durum` · multi · 7 değerli sabit küme | `hazirlayan` · select · satış rolleriyle daraltılmış `DB.employees` | `icOnay` · select · sabit üçlü | `musteri` · select · `DB.customers` | `toplam` · text (en az) | `tarih` · daterange.
**Tablo kolonları:** Teklif (kilitli, %22) · Teklif tarihi · Geçerlilik · Hazırlayan · **Ara toplam (gizli)** · **İndirim (gizli)** · Toplam · **Teslim süresi (gizli)** · İç onay · **Müşteri onayı (gizli)** · Durum. Görünümler: tablo + kart. `pageSize:10`.
**Form alanları:** —
**Detay sekmeleri:** —
**İşlem butonları:** Sayfa başlığı elle yazılmış: "Ön Analizler" · "Yeni Teklif". `rowActions[]` 3: **Teklifi aç** (`app-teklif-detay.html?id=`) · **PDF çıktısı** (`GV.result`, `tone:'info'`, çıktının liste "Çıktı Al" akışını kullandığını yazar) · **Revize teklif oluştur** (`GV.confirm`; `versiyon+1`, `durum='Revize teklif'`, `icOnay='Bekliyor'`).
**Toplu işlemler:** `bulk[]` 3 — "İç onaya gönder" · "Dışa aktar" · "Arşivle" (`tone:'danger'`, `confirm` metinli). Yetki kapısı yok.
**Bildirimler:** `GV.result` (PDF çıktısı) · `GV.confirm` + `GV.toast` ("`<kod>` v`<n>` oluşturuldu", `ok`) revizyonda.
**Yetkilendirme:** `GV.perm` çağrısı **yok** — tutarlar bu ekranda maskelenmiyor.
**Boş durum:** `GV.empty` — "Bu görünümde teklif yok" + "Yeni Teklif" aksiyonu.
**Hata durumu:** `GV.errorState` yok.
**Mobil görünüm:** `mobile(q)` var — kod + durum, firma·versiyon, hazırlayan + geçerlilik, toplam. Ayrıca `card(q)`.
**Kabul kriterleri:**
1. "Süresi Dolanlar" sekmesi yalnız **açık** teklifleri kapsamalı; kazanılan/kaybedilen kayıt bu sekmeye düşmemeli.
2. Revizyon aksiyonu versiyonu artırıp iç onayı "Bekliyor"a çekmeli.
3. Başarı oranı sıfır bölme koruması içermeli (`Math.max(1, k+kb)`).
**Bulgular:** (a) Elle iskelet (UID-15). (b) `GV.perm.can('finans')` kontrolü yok — aynı satış bölümündeki `app-komisyon.html` ve `app-referans.html` tutarları maskelerken bu ekran teklif toplamlarını herkese açık gösteriyor.

---

### `app-teklif-detay.html` — Teklif Detayı

**Tip:** detay
**Bölüm:** `satis` · menüde yok, şuradan bağlanır: `app-teklif.html`, `app-onanaliz-detay.html`, `app-musteri-detay.html`, `app-teklif-form.html`.
**Amaç:** Bir teklifin kalem dökümü, tutar zinciri, versiyon bağlamı, sözleşme/proje çıktısı ve onay akışını tek kartta yönetmek.
**Kullanıcılar:** `satis` bölümüne erişimi olan 7 rol. İç onay `can('onay')`, müşteriye iletme `can('duzenle')`, revizyon `can('ekle')` ile kapılı.
**Veri kaynağı:** `DB.quotes` · `DB.quoteItems` · `DB.customers` · `DB.leads` · `DB.analyses` · `DB.contracts` · `DB.projects` (`DB.proj`) · `DB.approvals` · `DB.activities` · `DB.contacts` · `DB.empName` · `DB.today`
**Üst özet kartları:** `kpis[]` yok. Sağ panelde 4 kart: **Özet** (10 satır) · **Ticari Koşullar** (4) · **Satış Bağlamı** (varsa, 6 satır) · **Son Hareket**.
**Sekmeler:** —
**Arama:** yok.
**Filtreler:** yok.
**Tablo kolonları:** —
**Form alanları:** "Müşteriye ilet" modalında elle iki alan: `#iAlici` (zorunlu) · `#iNot`.
**Detay sekmeleri:** 7 (`GV.tabs('#recTabs')`, dönüş değeri `tabsApi` olarak saklanır):
1. **Genel** — 4 bölüm: Teklif Kimliği (6) · İlişkili Kayıtlar (5: lead, sıcaklık, analiz, sözleşme, proje) · Süreç ve Onay (7) · Ticari Koşullar (5).
2. **Kalemler** — 7 kolonlu kalem tablosu (`DB.quoteItems`, `sira` sıralı) + 5 satırlık tutar özeti. İki uyuşmazlık uyarısı: kalem sayısı ≠ `kalemSayisi`, kalem toplamı ≠ `araToplam`.
3. **Finans Özeti** — Tutar Zinciri (8) · Karşılaştırma (6: beyan bütçe farkı, ön analiz farkı, sözleşme bedeli) · Ödeme ve Teslim Koşulları (4) · Kalem Türüne Göre Dağılım (pay yüzdeli).
4. **Versiyonlar** — `GV.notice(neutral)` "revizyon geçmişi ayrı tutulmuyor" + güncel versiyon bilgisi + aynı fırsata/müşteriye bağlı tekliflerin 6 kolonlu tablosu.
5. **Sözleşme ve Proje** — sözleşmenin 11 alanı + projenin 7 alanı; projesiz sözleşmede `GV.notice(neutral)`.
6. **Onay Akışı** — `GV.chain` üç adım (Hazırlayan → İç onay → Müşteri onayı) + 7 satırlık dl + koşullu aksiyon butonları.
7. **Aktivite Geçmişi** — `GV.activity(acts)`.
**İşlem butonları:** `GV.pageHead` — "Teklif listesi" · "PDF çıktısı" (`tabsApi.activate('kalem', true)` + `window.print()`) · (yetki varsa) "Revize teklif oluştur". Sekme içi: **İç onayı ver** (`#btnIcOnay`, yalnız `icOnay==='Bekliyor' && can('onay')`) · **Müşteriye ilet** (`#btnIlet`, yalnız taslak/hazırlanıyor/revize + iç onay verilmiş + `can('duzenle')`).
**Toplu işlemler:** yok.
**Bildirimler:** `GV.toast` ("Yazdırma penceresinden PDF olarak kaydedebilirsiniz" `info` 4000 ms; "`<kod>` v`<n>` oluşturuldu"; "`<kod>` iç onayı verildi"; "Alıcı zorunludur" `danger`; "`<kod>` müşteriye iletildi") · `GV.confirm` (revizyon, iç onay) · `GV.modal` (müşteriye ilet) · `GV.notice` (finans maskesi, kalem uyuşmazlıkları, revizyon geçmişi kapsamı, projesiz sözleşme).
**Yetkilendirme:** `GV.perm.can('finans')` (tüm para alanları `.cell-mask`) · `can('onay')` · `can('duzenle')` · `can('ekle')`. 403 kapısı yok.
**Boş durum:** `GV.empty` — "Teklif bulunamadı" (listeye dönüş) · "Kalem listesi yok" · "Bağlı sözleşme yok".
**Hata durumu:** `GV.errorState` yok.
**Mobil görünüm:** `mobile(r)` yok; tablolar `.gv-tablewrap.is-mobilescroll`.
**Kabul kriterleri:**
1. `net = araToplam − indirim`, `vergi = net × vergiOran/100`, `toplam = net + vergi` zinciri ekranda etiketiyle birlikte gösterilmeli; net ve brüt aynı kolonda karışmamalı.
2. "PDF çıktısı" önce Kalemler sekmesini aktive etmeli, sonra yazdırma penceresini açmalı.
3. İç onayı olmayan teklifte "Müşteriye ilet" butonu hiç basılmamalı.
4. Kalem sayısı kartla uyuşmuyorsa uyarı basılmalı, sayı sessizce düzeltilmemeli.
**Bulgular:** "Onaya konu tutar" `DB.approvals[].tutar` alanını **"(KDV dahil)"** olarak etiketliyor; `app-komisyon-detay.html` aynı alanı "(KDV hariç)" diye etiketliyor. Bu alanın ekseni `components.md` §9b tablosunda tanımlı değil ve iki ekran çelişiyor.

---

### `app-teklif-form.html` — Teklif Kaydı

**Tip:** form
**Bölüm:** `satis` · menüde yok, şuradan bağlanır: `app-teklif.html` ("Yeni Teklif").
**Amaç:** PROMPT.md §10'un 25 teklif alanını kurmak; kalem dökümünü `DB.quoteItems`'a yazmak ve tutar zincirini formülden üretmek.
**Kullanıcılar:** `satis` bölümüne erişimi olan 7 rol + `GV.perm.can('ekle'|'duzenle')`.
**Veri kaynağı:** `DB.quotes` · `DB.quoteItems` · `DB.customers` · `DB.leads` · `DB.analyses` · `DB.services` · `DB.contracts` · `DB.activities` · `DB.employees` (`DB.emp`, `DB.empName`) · `DB.today`
**Üst özet kartları:** düzenlemede "Kayıt Özeti" (12 satır). Ayrı iki kart: **Teklif Kalemleri** (canlı düzenlenebilir tablo) ve **Tutar Zinciri** (canlı önizleme, 8 satır) — ikisi de yalnız finans yetkisiyle basılır.
**Sekmeler:** yok.
**Arama:** yok.
**Filtreler:** yok.
**Tablo kolonları:** Kalem tablosu 8 kolon — Sıra · Açıklama · Kalem türü · Miktar · Birim · Birim fiyat (KDV hariç) · Tutar (KDV hariç) · işlem sütunu (düzenle/sil). ≤760px için aynı veriden `.gv-cardlist > .gv-mrow` karşılığı da basılır.
**Form alanları:** `GV.form({id:'teklif'})` — finans yetkisi varsa **6 bölüm, 21 alan**; yoksa 5 bölüm, 17 alan:
- *Teklif kimliği ve müşteri* — 6 alan: `firma`* · `musteri` (müşteri ya da fırsattan biri zorunlu) · `lead` · `analiz` (fırsat uyumu doğrulanır) · `hazirlayan`* · `versiyon`*
- *Tarih ve geçerlilik* — 2 alan: `tarih`* · `gecerlilik`* (tarihten sonra olmalı)
- *Fiyatlandırma* (yalnız finans) — 4 alan: `araToplam`* (kalem listesi doluyken kalem toplamına eşit olmalı) · `indirim` · `vergiOran`* · `doviz`*
- *Ticari koşullar* — 4 alan: `odemePlani`* · `teslimSuresi`* · `garanti` · `destek`
- *Durum ve onaylar* — 4 alan: `durum`* · `icOnay`* (iletilmiş durumda "Onaylandı" olmalı) · `musteriOnay` (iletilmemişte yasak, kazanılanda zorunlu "Onaylandı") · `aktif` (switch)
- *Ekler* — 1 alan: `belgeler` (`type:'file'`, kaydetmede `delete v.belgeler`)
Kalem alanları form dışı: `GV.modal` içinde `#kSablon` (hizmet sözlüğünden doldur) · `#kAd`* · `#kTur`* · `#kBirim`* · `#kMiktar`* · `#kFiyat`* + canlı tutar önizlemesi.
**Detay sekmeleri:** —
**İşlem butonları:** `GV.pageHead` — "Vazgeç" · "Kaydet"/"Değişiklikleri kaydet". Sayfa altında `#kaydetAlt`. Kalem kartında "Kalem ekle" (üst ve alt), satır başına düzenle/sil ikonu. Bağlam kartında "Teklif kartını aç"; uyarılarda "Sözleşmeleri gör" · "Teklif kartından çıktı al".
**Toplu işlemler:** —
**Bildirimler:** `GV.notice` — tekliften sözleşme doğmuş (`warn`, tutar karşılaştırmalı) / sözleşme yok (`ok`) · kalem sayısı uyuşmazlığı (`warn`) · finans alanları yok (`neutral`) · PDF/e-imza kapsam dışı (`neutral`) · ara toplam ≠ kalem toplamı (`warn`) · kalem dökümü girilmedi (`neutral`). `GV.toast` — "Kalem eklendi/güncellendi/silindi" · "Kalem açıklaması zorunludur" · "Miktar sıfırdan büyük olmalıdır" · "Birim fiyat negatif olamaz" · kaydetme sonuçları. `GV.confirm` kalem silmede. `GV.errorState` 403'te.
**Yetkilendirme:** `GV.perm.can('duzenle'|'ekle')` → form hiç kurulmaz. `GV.perm.can('finans')` → Fiyatlandırma bölümü, kalem kartı ve tutar zinciri kartı **hiç basılmaz**; kaydetmede mevcut tutarlar ve kalem kayıtları olduğu gibi korunur.
**Boş durum:** `GV.empty` — `?id=` hatalıysa "Kayıt bulunamadı"; kalem listesi boşken "Kalem eklenmedi" + "İlk kalemi ekle" butonu.
**Hata durumu:** `GV.errorState` var.
**Mobil görünüm:** var — kalem tablosunun `.gv-cardlist` karşılığı aynı veriden üretilir (UID-14 gerekçesi kodda yazılı).
**Kabul kriterleri:**
1. Kalem eklenip silindikçe `araToplam` alanı kalem toplamından yeniden yazılmalı; iki eksen ayrışmamalı.
2. `vergi` ve `toplam` forma girilmemeli — `zincir()` formülünden üretilmeli.
3. Kaydetmede bu teklifin eski `DB.quoteItems` satırları sökülüp çalışma kopyası 1..N sıra numarasıyla yeniden basılmalı.
4. Finans yetkisi olmayan rolde ne kalem kartı ne tutar kartı DOM'a girmelidir.
**Bulgular:** Kalem türü ve birim sözlükleri veride **yok**; küme PROMPT.md §10'un fiyat kalemlerinden elle kurulup `DB.quoteItems`'ta geçen iki değerle (`Modül`, `Hizmet`) genişletilmiş. Kodda yorumla belirtilmiş ama iki sözlük hâlâ eksik.

---

### `app-musteri.html` — Müşteriler

**Tip:** liste
**Bölüm:** `musteri` · menü etiketi "Müşteriler" (`screen:'musteri'`)
**Amaç:** Müşteri portföyünü durum, risk, ciro ve bekleyen tahsilat ekseninde izlemek.
**Kullanıcılar:** `musteri` bölümüne erişimi olan 11 rol — sahip · genelmudur · sistem · operasyon · satismudur · satistemsilci · musteritems · analist · pm · destek · muhasebe.
**Veri kaynağı:** `DB.customers` (kaynak) · `DB.referrers` · `DB.sectors` · `DB.refTypes` · `DB.employees` · `DB.empName`
**Üst özet kartları:** 4 KPI — Toplam müşteri · Aktif müşteri · Riskli müşteri (`risk==='Yüksek'` veya `durum==='Riskli'`) · Bekleyen tahsilat (Σ`bekleyenTahsilat`, `href:'app-tahsilat.html'`).
**Sekmeler:** 5 — Tüm Müşteriler · Aktif Müşteriler · Potansiyel · Riskli Müşteriler · Pasif Müşteriler.
**Arama:** `search.fields` = `kod` · `unvan` · `kisa` · `sektor` · `adres` · `etiketler` · `sonrakiAksiyon`.
**Filtreler:** `durum` · multi · sabit dörtlü | `sektor` · multi · `DB.sectors` | `risk` · select · sabit üçlü | `sorumlu` · select · `DB.employees` | `kaynak` · multi · `DB.refTypes` | `buyukluk` · multi · sabit beşli | `bekleyenTahsilat` · select · özel `test` | `ilkKayit` · daterange.
**Tablo kolonları:** Firma (kilitli, %24) · **Sektör (gizli)** · **Firma büyüklüğü (gizli)** · Müşteri sorumlusu · **Kaynak (gizli)** · Proje · Toplam ciro · Bekleyen tahsilat · Memnuniyet · Son iletişim · **Sonraki aksiyon (gizli)** · **Risk (gizli)** · Durum. Görünümler: tablo + kart. `pageSize:10`.
**Form alanları:** —
**Detay sekmeleri:** —
**İşlem butonları:** Sayfa başlığı elle yazılmış: "İletişim Geçmişi" · "Yeni Müşteri". `rowActions[]` 3: **Müşteri kartını aç** · **Düzenle** (`app-musteri-form.html?id=`) · **Pasife al** (`GV.confirm`; `durum='Pasif'`, `aktif=false`).
**Toplu işlemler:** `bulk[]` 4 — Sorumlu ata · Etiket ekle · Dışa aktar · Pasife al (`tone:'danger'`, `confirm` metinli). Yetki kapısı yok.
**Bildirimler:** `GV.toast` — "`<kod>` pasife alındı" (`ok`). `GV.confirm` pasife almada.
**Yetkilendirme:** `GV.perm.can('finans')` — toplam ciro, bekleyen tahsilat ve "Bekleyen tahsilat" KPI'ı maskelenir (`.cell-mask ••••••`, `exportValue` boş). 403 kapısı yok.
**Boş durum:** `GV.empty` — "Bu görünümde müşteri yok" + "Yeni Müşteri" aksiyonu.
**Hata durumu:** `GV.errorState` yok.
**Mobil görünüm:** `mobile(c)` var — unvan + durum, kod·sektör, aktif proje + ciro, sorumlu + son iletişim. Ayrıca `card(c)`.
**Kabul kriterleri:**
1. Risk kolonu `GV.badge(v, tonSinifi)` ile açık ton geçmeli; risk eksen-belirsiz olduğu için TONE sözlüğüne bırakılmamalı (components.md §5).
2. Ciro "(KDV hariç)", bekleyen tahsilat "(KDV dahil)" ekseninde etiketlenmeli.
3. Finans yetkisi olmayan rolde iki para kolonu da maskelenmeli.
**Bulgular:** (a) Elle iskelet (UID-15). (b) Kolon etiketleri "Toplam ciro" ve "Bekleyen tahsilat" **eksen belirtmeden** yazılı; `app-musteri-detay.html` aynı iki alanı "(KDV hariç)" / "(KDV dahil)" diye etiketliyor. §9b'nin "para alanı yazılırken eksen etikette belirtilir" kuralı liste ekranında uygulanmamış.

---

### `app-musteri-detay.html` — Müşteri Detayı

**Tip:** detay
**Bölüm:** `musteri` · menüde yok, şuradan bağlanır: `app-musteri.html`, `app-lead-detay.html`, `app-komisyon.html`, `app-komisyon-detay.html`, `app-musteri-yetkili.html`, `app-musteri-iletisim.html`, `app-referans-detay.html`, `app-teklif-detay.html`.
**Amaç:** PROMPT.md §8.3'ün 15 sekmelik müşteri kartını kurmak — ilişkinin tüm eksenleri tek yerde.
**Kullanıcılar:** `musteri` bölümüne erişimi olan 11 rol.
**Veri kaynağı:** `DB.customers` · `DB.contacts` · `DB.interactions` · `DB.leads` · `DB.quotes` · `DB.contracts` · `DB.projects` · `DB.tasks` · `DB.meetings` · `DB.tickets` · `DB.supportPackages` · `DB.invoices` · `DB.payments` · `DB.documents` · `DB.surveys` · `DB.activities` · `DB.referrers` · `DB.empName` · `DB.today`
**Üst özet kartları:** `kpis[]` yok. Sağ panelde 4 kart: **Özet** (11 satır) · **Birincil Yetkili** (varsa) · **Bakım Paketi** (varsa, kullanım çubuğu ile) · **Son Hareket**.
**Sekmeler:** —
**Arama:** yok.
**Filtreler:** yok.
**Tablo kolonları:** —
**Form alanları:** "İletişim Kaydı Ekle" modalında elle 6 alan: `#iTur` (dört kanal) · `#iTarih` · `#iKontak` (müşterinin yetkilileri) · `#iKonu`* · `#iOzet`* · `#iSonuc`.
**Detay sekmeleri:** 15 (`GV.tabs('#recTabs')`):
1. **Genel Bilgiler** — 4 bölüm: Kimlik (8) · İletişim (5) · Ticari Bilgiler (6) · İlişki Yönetimi (10).
2. **Yetkililer** — 6 kolonlu tablo + sayaç + "Yetkili listesi" bağlantısı.
3. **İletişim Geçmişi** — 6 kolonlu tablo + "İletişim kaydı ekle" butonu (boş durumda da).
4. **Satış Fırsatları** — 6 kolonlu tablo + "Satış hunisi" bağlantısı.
5. **Teklifler** — 6 kolonlu tablo (genel toplam KDV dahil) + kazanılan sayacı.
6. **Sözleşmeler** — 6 kolonlu tablo (bedel KDV hariç + genel toplam KDV dahil ayrı kolonlar) + "Ödeme planı" bağlantısı.
7. **Projeler** — 7 kolonlu tablo (ilerleme çubuğu, sözleşme tutarı KDV hariç).
8. **Görevler** — 7 kolonlu tablo + açık görev sayacı.
9. **Toplantılar** — 7 kolonlu tablo + "Kararlar ve aksiyonlar" bağlantısı.
10. **Destek Talepleri** — üstte bakım paketi bloğu (9 alan) + 8 kolonlu talep tablosu (SLA ve SLA durumu ayrı kolon).
11. **Faturalar** — 7 kolonlu tablo + net/brüt ayrı sayaç.
12. **Tahsilatlar** — 7 kolonlu tablo (tutar KDV dahil) + bekleyen sayacı.
13. **Dosyalar** — 8 kolonlu doküman tablosu.
14. **Raporlar** — 4 rapor kartı (`.gv-rcard`) + finans yetkisi yoksa `GV.notice` kısıt notu.
15. **Aktivite Geçmişi** — `GV.activity(acts)`.
**İşlem butonları:** `GV.pageHead` **çağrılmıyor** (elle iskelet); `.ph-actions` içinde: "Destek Talebi" · "Teklif Oluştur" · "Düzenle" (`app-musteri-form.html?id=`). Sekme içi: "Yetkili listesi" · "Satış hunisi" · "Teklif listesi" · "Ödeme planı" · "Proje listesi" · "Görev listesi" · "Kararlar ve aksiyonlar" · "Bakım paketleri" · "Fatura listesi" · "Tahsilat listesi" · "Doküman merkezi" · "İletişim kaydı ekle".
**Toplu işlemler:** yok.
**Bildirimler:** `GV.modal` (iletişim kaydı) · `GV.toast` ("Konu zorunludur" / "Görüşme özeti zorunludur" `danger`; "İletişim kaydı eklendi" `ok`) · `GV.notice` (finans maskesi, kısıtlı rapor). Mutasyondan 700 ms sonra `GV.refresh()`.
**Yetkilendirme:** `GV.perm.can('finans')` — ciro, tahsilat, sözleşme, fatura ve teklif tutarları maskelenir; **sekmeler gizlenmez**. 403 kapısı yok.
**Boş durum:** `GV.empty` — kayıt yoksa "Müşteri bulunamadı" + listeye dönüş; 12 sekmede ayrı boş durum ("Yetkili kişi yok" · "İletişim kaydı yok" · "Satış fırsatı yok" · "Teklif yok" · "Sözleşme yok" · "Proje yok" · "Görev yok" · "Toplantı yok" · "Destek talebi yok" · "Fatura yok" · "Tahsilat kaydı yok" · "Dosya yok").
**Hata durumu:** `GV.errorState` yok.
**Mobil görünüm:** `mobile(r)` yok; sekme tabloları `.gv-tablewrap.is-mobilescroll`.
**Kabul kriterleri:**
1. İletişim kaydı eklendiğinde `c.sonIletisim` **türetilmeli** (kayıtların en yenisi), koşulsuz `DB.today` yazılmamalı (ders L-08).
2. Yeni `ILT-NNN` kodu dizi uzunluğundan değil en yüksek mevcut numaradan üretilmeli.
3. Net ve brüt eksenler aynı kolonda karışmamalı; her para kolonu etiketinde eksen yazılı olmalı.
4. Kanal seçenekleri liste ekranının filtresiyle birebir aynı dört değer olmalı — beşinci değer uydurulmamalı.
**Bulgular:** (a) Elle iskelet (UID-15) — `GV.pageHead` çalışmaz. (b) `?id=` verilmediğinde varsayılan olarak `'MUS-2024-002'` **sabit kodu** kullanılıyor; diğer detay ekranları koleksiyonun ilk kaydına düşüyor (`(DB.<koleksiyon>[0]||{}).kod` deseni), bu ekran tek kayda sabitlenmiş.

---

### `app-musteri-form.html` — Müşteri Kartı

**Tip:** form
**Bölüm:** `musteri` · menüde yok, şuradan bağlanır: `app-musteri.html` ("Yeni Müşteri" + satır "Düzenle"), `app-musteri-detay.html` ("Düzenle").
**Amaç:** Müşteri kartının elle girilen alanlarını toplamak; türetilen sayaçları forma **koymamak**.
**Kullanıcılar:** `musteri` bölümüne erişimi olan 11 rol + `GV.perm.can('ekle'|'duzenle')`.
**Veri kaynağı:** `DB.customers` · `DB.sectors` · `DB.services` · `DB.refTypes` · `DB.referrers` · `DB.projects` · `DB.payments` · `DB.surveys` · `DB.activities` · `DB.employees` (`DB.emp`, `DB.empName`) · `DB.today`
**Üst özet kartları:** düzenlemede "Kayıt Özeti" (6 satır) + "Türetilmiş Sayaçlar" kartı (3–5 satır: toplam proje · aktif proje · toplam ciro · bekleyen tahsilat · memnuniyet), üstünde `GV.notice(neutral, i-lock)` "bu değerler bu ekrandan düzenlenemez".
**Sekmeler:** yok.
**Arama:** yok.
**Filtreler:** yok.
**Tablo kolonları:** —
**Form alanları:** `GV.form({id:'musteri'})` — **7 bölüm, 20 sabit alan + `DB.services` uzunluğunda checkbox**:
- *Kimlik ve unvan* — 3 alan: `unvan`* · `kisa`* · `buyukluk`*
- *Vergi ve fatura bilgisi* — 2 alan: `vergiNo`* (10/11 hane doğrulaması) · `vergiDairesi`*
- *İletişim ve adres* — 4 alan: `tel`* · `eposta`* · `web` (protokolsüz zorunlu) · `adres`
- *Ticari ilişki* — 4 alan: `sektor`* · `sorumlu`* · `kaynak`* · `referans`
- *İlgilenilen hizmetler* — `DB.services` başına bir checkbox (`hzm0…hzmN`), kaydetmede `hizmetler` dizisine toplanır
- *Risk ve durum* — 4 alan: `durum`* · `risk`* · `aktif` (switch, `durum` ile çapraz) · `arsiv` (switch, yalnız Pasif'te)
- *Notlar ve takip* — 3 alan: `sonrakiAksiyon` · `sonrakiTarih` (karşılıklı zorunluluk) · `etiketler` (virgüllü metin)
**Detay sekmeleri:** —
**İşlem butonları:** `GV.pageHead` — "Vazgeç" · "Kaydet"/"Değişiklikleri kaydet". Form altında `#kaydetAlt`. Bağlam kartında "Müşteri kartını aç"; sayaç notunda "Projeler" · "Tahsilatlar" · "Memnuniyet anketleri".
**Toplu işlemler:** —
**Bildirimler:** `GV.notice` — bağlı açık iş var (`warn`) / yok (`ok`) · türetilmiş sayaç kilidi (`neutral`) · finans maskesi (`neutral`) · 403 durumunda "Kartı görüntüleyebilirsiniz" (`neutral`) · yeni kayıt akış notu (`info`). `GV.toast` — "`<kod>` güncellendi" · "`<kod>` oluşturuldu". `GV.errorState` 403'te.
**Yetkilendirme:** `GV.perm.can('duzenle'|'ekle')` → form hiç kurulmaz; 403 kartının altına ayrıca "Müşteri kartını aç" bağlantılı `GV.notice` basılır. `GV.perm.can('finans')` → türetilmiş sayaçlarda ciro ve tahsilat satırları hiç basılmaz.
**Boş durum:** `GV.empty` — `?id=` hatalıysa "Kayıt bulunamadı" + listeye dönüş.
**Hata durumu:** `GV.errorState` var.
**Mobil görünüm:** `GV.form` `cols` ızgarası.
**Kabul kriterleri:**
1. `toplamCiro` · `bekleyenTahsilat` · `aktifProje` · `projeSayisi` · `memnuniyet` forma **alan olarak konulmamalı**, salt okunur gösterilmeli (ders L-08).
2. Yeni kayıt `MUS-YYYY-NNN` deseninde en yüksek numaradan üretilmeli; `ilkKayit`/`sonIletisim` `DB.today` olmalı, beş sayaç sıfırdan başlamalı.
3. `arsiv` yalnız `durum==='Pasif'` iken işaretlenebilmeli.
**Bulgular:** Düzenleme modunda hiçbir alan değişmese bile `GV.toast('<kod> güncellendi','ok')` basılıyor — diğer beş formda ("lead", "referans", "komisyon", "onanaliz", "teklif") aynı durumda `info` tonlu "Değişiklik yok" mesajı var. Bu ekranda o dal yok.

---

### `app-musteri-yetkili.html` — Yetkili Kişiler

**Tip:** liste
**Bölüm:** `musteri` · menü etiketi "Yetkili Kişiler" (`screen:'yetkili'`)
**Amaç:** Tüm müşterilerin yetkili kişilerini tek listede toplamak; birincil kontak ve karar verici rollerini görünür kılmak.
**Kullanıcılar:** `musteri` bölümüne erişimi olan 11 rol.
**Veri kaynağı:** `DB.contacts` (kaynak) · `DB.customers`
**Üst özet kartları:** 4 KPI — Toplam yetkili · Birincil kontak · Karar verici · Pasif kayıt.
**Sekmeler:** 5 — Aktif Yetkililer · Birincil Kontaklar (`birincil && aktif`) · Karar Vericiler (`karar && aktif`) · Pasif · Tümü.
**Arama:** `search.fields` = `kod` · `ad` · `pozisyon` · `eposta` · `tel`. `extra` yok — **firma adıyla arama çalışmaz** (placeholder "…veya firma ara" diyor).
**Filtreler:** `musteri` · select · `DB.customers` (kısa ad) | `birincil` · select · özel `test` ("Sadece birincil") | `karar` · select · özel `test`.
**Tablo kolonları:** Yetkili (kilitli, %22) · Firma · Telefon · E-posta · Birincil · Karar verici · Durum. Gizli kolon yok. `pageSize:25`.
**Form alanları:** —
**Detay sekmeleri:** —
**İşlem butonları:** `GV.pageHead` — "Müşteriler" · "Yeni Yetkili" (`app-musteri-yetkili-form.html`). `rowActions[]` 2: **Firmayı aç** (`app-musteri-detay.html?id=`) · **E-posta gönder** (`mailto:`).
**Toplu işlemler:** `bulk[]` 1 — "Dışa aktar".
**Bildirimler:** yok — ekran salt okunur.
**Yetkilendirme:** `GV.perm` çağrısı yok.
**Boş durum:** `GV.empty` — "Bu görünümde yetkili yok" / "Müşteri kartlarına yetkili kişi ekleyerek iletişim geçmişini kişiye bağlayabilirsiniz." Aksiyon yok.
**Hata durumu:** `GV.errorState` yok.
**Mobil görünüm:** `mobile(x)` var — ad + birincil rozeti, pozisyon·firma kısa adı, telefon.
**Kabul kriterleri:**
1. Firma kolonu `DB.customers`'tan resolve edilmeli; sıralama ve dışa aktarım unvan üzerinden olmalı.
2. Pasif kayıtlar `rowClass:'is-passive'` ile soluk gösterilmeli.
**Bulgular:** (a) `search.placeholder` firmayla arama vaat ediyor ama `search.fields` içinde firma yok ve `search.extra` tanımlı değil — arama kutusu firmaya göre sonuç döndürmez. (b) Liste ekranında **düzenleme aksiyonu yok**; `app-musteri-yetkili-form.html?id=` düzenleme modunu destekliyor ama hiçbir ekrandan bu adrese bağlantı verilmiyor.

---

### `app-musteri-yetkili-form.html` — Yetkili Kişi Formu

**Tip:** form
**Bölüm:** `musteri` · menüde yok, şuradan bağlanır: `app-musteri-yetkili.html` ("Yeni Yetkili"). `?musteri=MUS-...` parametresiyle firma ön seçili gelir.
**Amaç:** `DB.contacts` kaydının 9 alanının 8'ini formda toplamak (kod otomatik) ve ad değişikliğinin adla bağlı kayıtlara yansımasını yönetmek.
**Kullanıcılar:** `musteri` bölümüne erişimi olan 11 rol + `GV.perm.can('ekle'|'duzenle')`.
**Veri kaynağı:** `DB.contacts` · `DB.customers` · `DB.tickets` · `DB.interactions` · `DB.projects` · `DB.quotes` · `DB.activities` · `DB.today`
**Üst özet kartları:** düzenlemede "Kayıt özeti" (9 satır: kayıt no · müşteri firma · pozisyon · iletişim · rol rozetleri · müşteri temsilcisi · firmadaki diğer yetkililer · kayıt durumu · son değiştiren).
**Sekmeler:** yok.
**Arama:** yok.
**Filtreler:** yok.
**Tablo kolonları:** —
**Form alanları:** `GV.form({id:'yetkili'})` — **3 bölüm, 8 alan**:
- *Bağlı müşteri* — 1 alan: `musteri`* (pasif firmalar da listelenir)
- *Kişi bilgileri* — 4 alan: `ad`* (tüm koleksiyonda **benzersiz** olmalı; destek ve iletişim kayıtları kişiyi adla eşleştirdiği için) · `pozisyon`* · `tel`* · `eposta`*
- *Rol ve durum* — 3 switch: `birincil` (firmada tek birincil kontak doğrulaması) · `karar` · `aktif`
**Detay sekmeleri:** —
**İşlem butonları:** `GV.pageHead` — "Vazgeç" · "Kaydet"/"Değişiklikleri kaydet". Form altında `#btnKaydetAlt`. Bağlam kartında "Firma kartını aç"; uyarılarda "Firma kartında incele" · "İletişim geçmişini aç".
**Toplu işlemler:** —
**Bildirimler:** `GV.notice` — firmanın açık kayıtları var (`warn`) / yok (`neutral`) · adla eşleşen kayıtlar (`warn`, `icon:'i-link'`) · birincil kontak uyarısı (`info`) · yeni kayıt akış notu (`info`). `GV.toast` — "Değişiklik yok…" (`info`) · "`<kod>` güncellendi · `<n>` alan" · "`<kod>` oluşturuldu". `GV.errorState` 403'te.
**Yetkilendirme:** `GV.perm.can('duzenle'|'ekle')` → form hiç kurulmaz; `.gv-state-acts` gerçek aksiyonlarla değiştirilir. Alan maskeleme yok (ekranda para alanı yok).
**Boş durum:** `GV.empty` — `?id=` hatalıysa "Kayıt bulunamadı" + listeye dönüş.
**Hata durumu:** `GV.errorState` var.
**Mobil görünüm:** `GV.form` `cols` ızgarası.
**Kabul kriterleri:**
1. Ad değiştiğinde ve firma **değişmediğinde** aynı firmadaki `DB.tickets[].acan` ve `DB.interactions[].kontak` alanları birlikte güncellenmeli, ayrıca bir aktivite satırı yazılmalı.
2. Firma da değiştiyse eski kayıtlara **dokunulmamalı** (eski firmaya ait oldukları için).
3. Bir firmada ikinci birincil kontak işaretlenememeli; hata mesajı mevcut birincil kontağı adıyla göstermeli.
4. Yeni kod `YTK-NNN` deseninde (koleksiyon yıl taşımaz), en yüksek numaradan üretilmeli.
**Bulgular:** Yetkili kaydı `DB.tickets` ve `DB.interactions`'a **kodla değil adla** bağlanıyor; ekran bu kırılganlığı benzersizlik doğrulaması + toplu ad güncellemesiyle yönetiyor ama veri modeli düzeyinde bu bir bağ eksikliğidir (components.md §9d'nin "bağ veride yazılı olur" kuralı bu ilişki için karşılanmıyor).

---

### `app-musteri-iletisim.html` — İletişim Geçmişi

**Tip:** liste
**Bölüm:** `musteri` · menü etiketi "İletişim Geçmişi" (`screen:'iletisim'`)
**Amaç:** Müşteri ve müşteri adaylarıyla yapılan tüm görüşmeleri tek kronolojik listede toplamak.
**Kullanıcılar:** `musteri` bölümüne erişimi olan 11 rol.
**Veri kaynağı:** `DB.interactions` (kaynak) · `DB.customers` · `DB.leads` · `DB.employees` · `DB.empName` · `DB.today`
**Üst özet kartları:** 4 KPI — Toplam görüşme · Bu ay (`tarih` ayı `DB.today` ayı) · Toplantı · Müşteri adayı görüşmesi (`!!lead`).
**Sekmeler:** 6 — Tüm Görüşmeler · Toplantılar · Telefon · E-posta · Mevcut Müşteri (`!!musteri`) · Müşteri Adayı (`!!lead`).
**Arama:** `search.fields` = `kod` · `konu` · `ozet` · `kontak` · `sonuc` · `tur`. `extra` yok — firma/aday adıyla arama çalışmaz.
**Filtreler:** `tur` · multi · sabit dört kanal | `kisi` · select · `DB.employees` | `musteri` · select · `DB.customers` | `tarih` · daterange. **`lead` ekseninde filtre yok.**
**Tablo kolonları:** Görüşme (kilitli, %26) · Kanal · Müşteri/Aday · Görüşülen kişi · Şirket içi · Sonuç · Tarih. Gizli kolon yok. `pageSize:25`.
**Form alanları:** —
**Detay sekmeleri:** —
**İşlem butonları:** `GV.pageHead` — "Müşteriler" · "Görüşme Kaydet" (`app-musteri-iletisim-form.html`). `rowActions[]` 1: **Görüşme özeti** (`GV.modal`, `size:'sm'`, üç alanlı `gv-dl`: özet · sonuç · şirket içi katılımcı).
**Toplu işlemler:** `bulk[]` 1 — "Dışa aktar".
**Bildirimler:** `GV.modal` (görüşme özeti). `toast`/`notice`/`result` yok.
**Yetkilendirme:** `GV.perm` çağrısı yok.
**Boş durum:** `GV.empty` — "Bu görünümde görüşme kaydı yok" / "Müşteriyle yapılan her görüşmeyi kaydedin — geçmiş tek yerde toplanır ve kaybolmaz." Aksiyon yok.
**Hata durumu:** `GV.errorState` yok.
**Mobil görünüm:** `mobile(x)` var — konu + kanal etiketi, taraf·görüşülen kişi, tarih, sonuç.
**Kabul kriterleri:**
1. Müşteri/Aday kolonu `musteri` varsa `app-musteri-detay.html`, `lead` varsa `app-lead-detay.html` adresine gitmeli; ikisi de yoksa "—" basmalı.
2. Sıralama varsayılan `tarih` azalan olmalı.
**Bulgular:** (a) Satır aksiyonunda **düzenleme yok**; `app-musteri-iletisim-form.html?id=` düzenleme modunu destekliyor ama hiçbir ekrandan bu adrese bağlantı verilmiyor. (b) `search.placeholder` "kişi" ile aramayı vaat ediyor ama firma/aday adı `fields` içinde değil ve `extra` tanımlı değil — `adOf()` yardımcısı yalnız kolon render'ında kullanılıyor.

---

### `app-musteri-iletisim-form.html` — Görüşme Kaydet

**Tip:** form
**Bölüm:** `musteri` · menüde yok, şuradan bağlanır: `app-musteri-iletisim.html` ("Görüşme Kaydet"). `?musteri=MUS-...` veya `?lead=LEAD-...` ile taraf ön seçili gelir.
**Amaç:** `DB.interactions` kaydının 9 alanını toplamak ve tarafın `sonIletisim` eksenini kayıtlardan yeniden hesaplamak.
**Kullanıcılar:** `musteri` bölümüne erişimi olan 11 rol + `GV.perm.can('ekle'|'duzenle')`.
**Veri kaynağı:** `DB.interactions` · `DB.customers` · `DB.leads` · `DB.contacts` · `DB.employees` · `DB.activities` · `DB.empName` · `DB.today`
**Üst özet kartları:** düzenlemede "Görüşme özeti" (7 satır: kayıt no · kanal · görüşülen taraf · görüşülen kişi · şirket içi katılımcı · görüşme zamanı · son değiştiren).
**Sekmeler:** yok.
**Arama:** yok.
**Filtreler:** yok.
**Tablo kolonları:** —
**Form alanları:** `GV.form({id:'iletisim'})` — **3 bölüm, 10 alan**:
- *Görüşülen taraf* — 3 alan: `musteri` (müşteri ya da adaydan biri zorunlu) · `lead` (ikisi birden seçilemez) · `kontak`* (seçenekler seçili tarafın yetkilileriyle **canlı daraltılır**)
- *Görüşme künyesi* — 4 alan: `tur`* · `kisi`* · `tarihGun`* (ileri tarih yasak; tarafın ilk kayıt/talep tarihinden önce olamaz) · `saat`* (15 dakikalık adımlarla üretilmiş select)
- *İçerik* — 3 alan: `konu`* · `ozet`* · `sonuc` (boşsa `'—'` sentinel'ine çevrilir)
**Detay sekmeleri:** —
**İşlem butonları:** `GV.pageHead` — "Vazgeç" · "Kaydet"/"Değişiklikleri kaydet". Form altında `#btnKaydetAlt`. Bağlam kartında "Kartı aç"; uyarıda "Kartı incele".
**Toplu işlemler:** —
**Bildirimler:** `GV.notice` — bu görüşme müşteri kartını besliyor (`warn`) / aynı tarafa ait diğer görüşmeler (`neutral`) · yeni kayıt akış notu (`info`). `GV.toast` — "Değişiklik yok…" · "`<kod>` güncellendi · `<n>` alan" · "`<kod>` oluşturuldu". `GV.errorState` 403'te.
**Yetkilendirme:** `GV.perm.can('duzenle'|'ekle')` → form hiç kurulmaz; 403 kartındaki "Tekrar dene" tek bir gerçek aksiyonla değiştirilir. Alan maskeleme yok.
**Boş durum:** `GV.empty` — `?id=` hatalıysa "Kayıt bulunamadı" + listeye dönüş.
**Hata durumu:** `GV.errorState` var.
**Mobil görünüm:** `GV.form` `cols` ızgarası.
**Kabul kriterleri:**
1. Taraf değiştiğinde "Görüşülen kişi" seçenekleri anında daralmalı; seçili değer yeni kümede yoksa boşalmalı, tek seçenek varsa otomatik seçilmeli.
2. `senkronSonIletisim()` müşteri/adayın `sonIletisim` alanını **kayıtların en yenisinden** hesaplamalı; taraf değiştiyse hem eski hem yeni taraf senkronlanmalı.
3. `tarih` alanı `tarihGun + 'T' + saat` olarak birleştirilmeli.
4. Bir görüşme hem müşteriye hem adaya bağlanamamalı.
**Bulgular:** `GV.form`'da `time` tipi olmadığı için görüşme saati 15 dakikalık adımlarla üretilmiş 57 seçenekli bir `select` ile kuruluyor — eksik bileşen izi (kodda yorumla belirtilmiş).


---

## Bölüm 2 — Proje, Görev, Destek ve Sohbet

*32 ekran.*

### `app-proje.html` — Projeler

**Tip:** liste
**Bölüm:** `SECTIONS.proje` (eyebrow "Teslimat", başlık "Proje Yönetimi") → menü etiketi **"Projeler"**, `screen:'proje'`
**Amaç:** Şirketin tüm müşteri projelerini tek listede toplayıp durum, sağlık, ilerleme, termin ve sözleşme bedeliyle izlemek.
**Kullanıcılar:** `SEC_BY_ROLE`'da `proje` bölümü olan 17 rol: `sahip · genelmudur · sistem · operasyon · depmudur · satismudur · analist · pm · takimlideri · tasarimci · frontend · backend · mobil · ai · qa · devops · destek`. Ekran seviyesinde `SCREEN_PERM` kısıtı yok.
**Veri kaynağı:** `DB.projects` (kaynak) · `DB.customers` · `DB.employees` · `DB.services` · `DB.priorities` · `DB.emp` · `DB.empName`
**Üst özet kartları:** `kpis[]` 4 adet — **Aktif proje** (durum ≠ Teslim ve arşivsiz) · **Geciken proje** (aktif + `planlananBitis` geçmiş) · **Riskli proje** (`saglik === 'Riskli'`) · **Toplam sözleşme** (aktif projelerin `sozlesmeTutari` toplamı, finans yetkisi yoksa 0 basar)
**Sekmeler:** `tabs[]` 8 adet — Aktif Projeler (aktif) · Planlama · Geliştirme · Test · Gecikenler · Riskli · Teslim Edilenler · Tümü (`filter:null`)
**Arama:** `search.fields` = `kod · ad · musteriAd · tur · teknoloji · faz`; `search.extra` **yok**
**Filtreler:** `durum` multi (5 sabit değer) · `saglik` select (İyi/Dikkat/Riskli) · `musteri` select (`DB.customers`) · `pm` select (`DB.employees` içinde `roller` içinde `pm` olanlar + `sahip`) · `tur` multi (`DB.services`) · `oncelik` select (`DB.priorities`) · `planlananBitis` daterange
**Tablo kolonları:** Proje (kilitli) · Müşteri · Proje yöneticisi · **Ekip** *(gizli)* · İlerleme · Planlanan bitiş · Sözleşme · **Bütçe kullanımı** *(gizli)* · **Süre kullanımı** *(gizli)* · Sağlık · Durum
**Form alanları:** —
**Detay sekmeleri:** —
**İşlem butonları:** Sayfa başlığı **elle yazılmış HTML**'dir, `GV.pageHead` çağrılmaz — iki bağlantı: "Milestone" (`app-proje-milestone.html`), "Yeni Proje" (`app-proje-form.html`). `rowActions[]` 3: Proje kartını aç · Projenin görevleri (`app-gorev.html?t=proje&f_proje=`) · Düzenle.
**Toplu işlemler:** `bulk[]` 3 — Proje yöneticisi ata · Dışa aktar · Arşivle (`confirm` metni var). **Üçünün de `run` yok**, yetki kapısı yok.
**Bildirimler:** Sayfanın kendi bastığı `GV.toast` / `GV.notice` / `GV.result` **yok**.
**Yetkilendirme:** `GV.perm.can('finans')` bir kez okunur; Sözleşme ve Bütçe kullanımı kolonları `••••••` ile maskelenir, `exportValue` boş döner, "Toplam sözleşme" KPI'ı 0 gösterir. 403 kapısı yok.
**Boş durum:** `emptyState` var — "Bu görünümde proje yok" + "Yeni Proje" aksiyonu.
**Hata durumu:** `GV.errorState` **yok**.
**Mobil görünüm:** `mobile(p)` kart üreticisi var (başlık + durum rozeti + kod/müşteri + ilerleme + PM/tarih). ≤760px'de tablo kart listesine döner.
**Kabul kriterleri:**
- Finans yetkisi olmayan rolde Sözleşme kolonu ve "Toplam sözleşme" KPI'ı hiçbir tutar sızdırmaz (çıktı dosyası dahil).
- `?t=geciken` ile açıldığında liste yalnız `planlananBitis` geçmiş ve `durum !== 'Teslim'` kayıtları gösterir.
- Kanban görünümü yalnız `Planlama · Geliştirme · Test · Teslim` kolonlarını üretir; `Askıda` durumu kanbanda düşer.
**Bulgular:** Shell iskeleti `<body>` içine **elle yazılmıştır** (`.gv-app` + `.gv-rail` + `.gv-menu` + `.gv-page-head`). `buildSkeleton()` `.gv-app` varsa erken döndüğü için `#gvPageHead` doğmaz — bu ekran components.md §3'te tarif edilen **UID-15** sınıfındadır. `bulk[]`'teki üç aksiyonun hiçbirinde `run` yok; "Arşivle" onay metni gösterse de veriyi değiştirmez.

---

### `app-proje-detay.html` — Proje Detayı

**Tip:** detay
**Bölüm:** `SECTIONS.proje`; menüde ayrı satırı yok, `body[data-screen="proje"]` ile **"Projeler"** satırını vurgular. Şuralardan bağlanır: `app-proje.html` (kolon + rowAction + kanban + kart + mobil), `app-proje-milestone.html`, `app-proje-sprint.html`, `app-proje-test.html`, `app-proje-hata.html`, `app-proje-degisiklik.html`, `app-proje-teslim.html`, `app-gorev-detay.html`, `app-sohbet.html`.
**Amaç:** Tek bir projenin künyesinden bütçesine, ekibinden kalite ve teslim zincirine kadar her şeyini 22 sekmede toplamak.
**Kullanıcılar:** `proje` bölümü olan 17 rol (bkz. `app-proje.html`).
**Veri kaynağı:** `DB.projects` · `DB.customers` · `DB.projectModules` · `DB.milestones` · `DB.sprints` · `DB.tasks` · `DB.timelogs` · `DB.meetings` · `DB.decisions` · `DB.documents` · `DB.tests` · `DB.bugs` · `DB.deliveries` · `DB.changeRequests` · `DB.invoices` · `DB.contracts` · `DB.activities` · `DB.taskStatuses` · `DB.priorities` · `DB.today` · `DB.emp` / `DB.empName` / `DB.modName` / `DB.task`
**Üst özet kartları:** `kpis[]` yok (liste bileşeni kullanılmıyor). "Raporlar" sekmesinde **elle kurulmuş** 4 KPI kartı var: Proje ilerlemesi · Bütçe kullanımı · Harcanan süre · Açık hata.
**Sekmeler:** — (liste değil)
**Arama:** yok
**Filtreler:** yok
**Tablo kolonları:** yok (sekme içi `.gtable` tabloları elle kurulur, `is-mobilescroll` ile yatay kaydırır)
**Form alanları:** —
**Detay sekmeleri:** `GV.tabs('#recTabs')` ile **22 sekme**:
1. **Genel Bakış** — proje künyesi, zaman/ilerleme, teknik envanter, riskler + kritik açık işler tablosu, müşteri onayları tablosu
2. **Proje Ekibi** — PM/teknik/müşteri sorumlusu + ekip + görev sorumluları + zaman kaydı girenlerden türetilen kişi listesi; pozisyon, projedeki rol, görev sayısı, harcanan saat, genel doluluk
3. **Modüller** — `DB.projectModules` (modül, sorumlu, durum, ilerleme, planlanan efor, kayıtlı görev)
4. **Milestone** — taksit sırası, tarih, durum, ilerleme, taksit tutarı (KDV hariç), ödeme durumu, fatura, teslim
5. **Sprintler** — aralık, durum, planlanan/tamamlanan saat, tamamlanma oranı, görev sayısı
6. **Görevler** — projenin tüm görevleri (tür, modül, sorumlu, öncelik, durum, termin, ilerleme, tahmini/gerçek)
7. **İş Yükü** — kişi bazlı atanmış/açık/geciken görev, açık iş tahmini, harcanan saat, projedeki payı + kapsam uyarısı `GV.notice`
8. **Takvim** — `DB.today` ayının 7×6 `.gv-cal` ızgarası; milestone, sprint sınırı, görev termini, toplantı, teslim olayları + renk açıklaması
9. **Gantt** — `.gv-gantt` markup'ı **elle** kurulur (proje + taksitler + sprintler); çubuk konumu inline `style`, bugün çizgisi `.gv-gantt-ms`
10. **Kanban** — projenin görevleri `DB.taskStatuses` kolonlarında, elle kurulmuş `.gv-kanban`
11. **Zaman Kayıtları** — `DB.timelogs` (tarih, personel, görev, açıklama, süre, faturalanabilir, onay)
12. **Toplantılar** — `DB.meetings` + `DB.decisions` (toplantı kararları ve aksiyonlar tablosu)
13. **Dosyalar** — `DB.documents` tablosu + `GV.upload({mount:'#prjUpload'})` yükleme alanı
14. **Revizyonlar** — `revizyon > 0` veya `yenidenAcilma > 0` olan görevler + toplam sayaç notu
15. **Değişiklik Talepleri** — `DB.changeRequests` (kapsam, süre/maliyet etkisi, karar, durum)
16. **Testler** — `DB.tests` (tür, sorumlu, senaryo/başarılı/başarısız, başarı oranı)
17. **Hatalar** — `DB.bugs` (modül, şiddet, öncelik, ortam, tekrarlanabilirlik, bulan, sorumlu, çözüm, bağlı görev)
18. **Teslimler** — `DB.deliveries` (bağlı taksit, teslim eden, müşteri onayı, onay tarihi, not)
19. **Bütçe** — sözleşme/bütçe künyesi + ödeme planı taksitleri + faturalar; yetkisizde `GV.notice(tone:'warn')`
20. **Maliyetler** — maliyet özeti + kişi bazlı ve modül bazlı **türetilmiş** emek maliyeti (ortalama saat maliyeti × saat) + türetme uyarısı
21. **Raporlar** — 4 KPI + `GV.chart.bar` / `donut` / `legend` ile 5 grafik (modül ilerlemesi, görev durum dağılımı, sprint yükü, hata şiddeti, bütçe-maliyet)
22. **Aktivite Geçmişi** — `GV.activity(acts)`; projeye **ve** projenin görevlerine yazılmış hareketler
**İşlem butonları:** `GV.pageHead` **çağrılmaz**; `.gv-rec-head > .ph-actions` elle basılır: "Görevler" (`app-gorev.html`) · "Milestone" (`app-proje-milestone.html`) · "Düzenle" (`app-proje-form.html?id=`). `rowActions[]` yok.
**Toplu işlemler:** yok
**Bildirimler:** `GV.upload` `onChange`'inde `GV.toast('… dosya … projesine eklenmek üzere hazır','ok',2200)`. `GV.notice` üç yerde: İş Yükü (kapsam uyarısı), Bütçe/Maliyetler (finans maskesi), Maliyetler (türetilmiş değer uyarısı), Revizyonlar (sayaç uyarısı).
**Yetkilendirme:** `GV.perm.can('finans')` → `para()` / `paraK()` tüm tutarları `••••••` yapar; Bütçe ve Maliyetler sekmelerinin başına kilit notu düşer; Raporlar sekmesindeki bütçe grafiği `GV.empty(icon:'i-lock')` ile değiştirilir. Alan maskeleme var, **403 kapısı yok**.
**Boş durum:** `?id=` bulunamazsa `GV.empty` "Proje bulunamadı" + "Proje listesine dön". Sekme içi 12 ayrı `GV.empty` (modül, milestone, sprint, görev, takvim, kanban, zaman, toplantı, doküman, revizyon, değişiklik, test, hata, teslim, aktivite).
**Hata durumu:** `GV.errorState` **yok**.
**Mobil görünüm:** `mobile()` üreticisi yok (liste bileşeni kullanılmıyor). Sekme içi tablolar `.gv-tablewrap.is-mobilescroll` ile ≤760px'de **yatay kaydırır**, kart listesine dönmez.
**Kabul kriterleri:**
- 22 sekmenin 22'si de tıklandığında konsol hatası vermeden ve boş panel bırakmadan içerik basmalı (`tabs.js` ölçümü).
- Finans yetkisi olmayan rolde Bütçe, Maliyetler, Raporlar ve sağ özet panelinde tek bir rakam görünmemeli.
- Gantt'taki "bugün" çizgisi `DB.today`'e oturmalı, `new Date()`'e değil.
**Bulgular:** Shell iskeleti elle yazılmış (**UID-15**), bu yüzden `GV.pageHead` kullanılamıyor ve sayfa başlığı `.gv-rec-head` içinde tekrar kurulmuş. Bütçe sekmesindeki "Sözleşme" ve Milestone sekmesindeki "Fatura" bağlantıları `app-sozlesme.html` / `app-fatura.html` köküne gider — kayıt kodu ile filtre (`?q=`) taşınmaz, kullanıcı listede kaydı elle bulur.

---

### `app-proje-form.html` — Proje Formu

**Tip:** form
**Bölüm:** `SECTIONS.proje` (`data-screen="proje"`); menüde yok, şuradan bağlanır: `app-proje.html` sayfa başlığı ("Yeni Proje"), `rowActions.duzenle`, boş durum aksiyonu, `app-proje-detay.html` "Düzenle".
**Amaç:** Yeni proje açmak veya var olan projenin künye, takvim, efor, bütçe, teknik envanter ve risk alanlarını düzenlemek.
**Kullanıcılar:** `proje` bölümü olan 17 rol; **ek olarak** yazma kapısı: yeni kayıtta `GV.perm.can('ekle')`, düzenlemede `GV.perm.can('duzenle')` — sağlanmazsa 403 basılır.
**Veri kaynağı:** `DB.projects` · `DB.customers` · `DB.employees` · `DB.services` · `DB.priorities` · `DB.contracts` · `DB.milestones` · `DB.deliveries` · `DB.projectModules` · `DB.tasks` · `DB.activities` · `DB.today`
**Üst özet kartları:** yok
**Sekmeler:** yok
**Arama:** yok
**Filtreler:** yok
**Tablo kolonları:** yok
**Form alanları:** `GV.form({ mount:'#formMount', id:'proje', record:formRec, sections })` — **9 bölüm** (biri koşullu):
- **Proje kimliği** — 5 alan; zorunlu: Proje adı, Müşteri, Proje türü, Faz, Öncelik
- **Sorumluluk** — 3 alan; üçü de zorunlu: Proje yöneticisi, Teknik sorumlu, Müşteri sorumlusu
- **Proje ekibi** — `DB.employees` üzerinden üretilen **checkbox grubu** (`EKIP_ON + e.kod`); `multiselect` tipi bileşende olmadığı için onay kutusu kullanılır
- **Takvim, durum ve ilerleme** — 6 alan; zorunlu: Başlangıç tarihi, Planlanan bitiş, Proje durumu, İlerleme oranı, Proje sağlık durumu (Gerçekleşen bitiş opsiyonel)
- **Efor** — 2 alan; zorunlu: Tahmini süre (saat)
- **Sözleşme ve bütçe** *(yalnız `canFinans`)* — 3 alan; zorunlu: Sözleşme bedeli (KDV hariç), Onaylı proje bütçesi (KDV hariç). Sözleşme bedeli, bağlı `DB.contracts` kaydının **net** `tutar`ıyla `validate` ile karşılaştırılır (§9b tek eksen kuralı)
- **Teknik envanter** — 7 alan; zorunlu: Sunucu ve barındırma, Kullanılan teknolojiler
- **Risk ve gecikme** — 2 alan; zorunlu yok
- **Kayıt durumu** — 2 alan (`aktif`, `arsiv` switch); zorunlu yok
**Detay sekmeleri:** —
**İşlem butonları:** `GV.pageHead({eyebrow:'Teslimat', title: düzenlemede `<kod> · Düzenle` / yenide `Yeni Proje`})`, aksiyonlar: **Vazgeç** (`app-proje.html`) · **Kaydet / Değişiklikleri kaydet** (`run:kaydet`). `rowActions` yok.
**Toplu işlemler:** yok
**Bildirimler:** `GV.toast` üç durumda — "Değişiklik yok — kayıt olduğu gibi bırakıldı" (`info`), "`<kod>` güncellendi · N alan" (`ok`), "`<kod>` oluşturuldu" (`ok`). `GV.notice` ile ön bilgi kutuları: müşteri ön seçimi, modül uyarısı, finans yetkisi yoksa "Finansal alanlar bu formda yok".
**Yetkilendirme:** `GV.perm.can('finans')` → "Sözleşme ve bütçe" bölümü **hiç basılmaz** (ölü alan yok) ve yerine `GV.notice(tone:'neutral', icon:'i-lock')` düşer. Yetki kapısı: `can` false ise `GV.errorState` ile **403 sayfası** basılır, aksiyonları "Projelere dön" olarak değiştirilir.
**Boş durum:** `?id=` hatalıysa `GV.empty` "Kayıt bulunamadı" + "Projelere dön".
**Hata durumu:** `GV.errorState` **var** — yetkisiz erişimde (403) kullanılır; kendi "Tekrar dene" butonu `.gv-state-acts` içinde listeye dönüş bağlantısıyla değiştirilir.
**Mobil görünüm:** `mobile()` yok; `GV.form` ızgarası `cols` değerleriyle dar ekranda tek kolona iner.
**Kabul kriterleri:**
- Finans yetkisi olmayan rolde "Sözleşme ve bütçe" bölümü DOM'da hiç bulunmamalı.
- Sözleşmesi olan bir projede `sozlesmeTutari` sözleşmenin netinden farklı girilirse form kaydetmeyi reddetmeli.
- `can` false olan rolde form mount'u hiç kurulmamalı, yerine 403 durumu basılmalı.

---

### `app-proje-milestone.html` — Milestone

**Tip:** liste
**Bölüm:** `SECTIONS.proje` → menü etiketi **"Milestone"**, `screen:'milestone'`
**Amaç:** Sözleşmelerin ödeme planı taksitlerini proje ekseninde listeleyip planlanan tarih, ilerleme, fatura ve ödeme durumunu tek yerden izlemek.
**Kullanıcılar:** `proje` bölümü olan 17 rol.
**Veri kaynağı:** `DB.milestones` (kaynak) · `DB.projects` · `DB.contracts` · `DB.invoices` · `DB.customers` · `DB.today`. Satırlar her render'da bu koleksiyonlardan **yeniden türetilir**; yeni koleksiyon açılmaz.
**Üst özet kartları:** `kpis[]` 4 — **Toplam milestone** (+ kaç projede / kaç sözleşmede meta'sı) · **Tamamlanan** (+ % teslim meta'sı) · **Geciken** (+ 45 gün içindeki yaklaşanlar meta'sı) · **Bekleyen taksit tutarı (KDV hariç)** (ödemesi bekleyen taksitlerin `odeme` toplamı)
**Sekmeler:** `tabs[]` 5 — Tümü · Yaklaşanlar (0–45 gün) · Gecikenler · Tamamlananlar · Faturası Kesilmemiş (tamamlanmış ama faturasız)
**Arama:** `search.fields` = `kod · ad · proje · projeAd · musteri · musteriAd · sozlesme · sozlesmeAd · fatura · durum · odemeDurum`; `search.extra` yok (türetilmiş metin zaten satırda)
**Filtreler:** `proje` select (`DB.projects`) · `musteri` select (`DB.customers`) · `durum` multi (4 sabit) · `odemeDurum` select (Ödendi/Bekliyor) · `tarih` daterange · `tutarAralik` select (4 kova, `test` fonksiyonlu) · `faturaVarmi` select (Faturalı/Faturasız, `test` fonksiyonlu)
**Tablo kolonları:** Milestone (kilitli) · Proje · Müşteri · Sözleşme · Taksit sırası · Planlanan tarih · Milestone durumu · İlerleme · Taksit tutarı (KDV hariç) · Fatura · Ödeme durumu · **Fatura toplamı (KDV dahil)** *(gizli)* · **Fatura vadesi** *(gizli)* · **Proje durumu** *(gizli)* · **Proje sağlığı** *(gizli)*
**Form alanları:** —
**Detay sekmeleri:** —
**İşlem butonları:** `GV.pageHead({eyebrow:'Projeler', title:'Milestone', sub:…})` aksiyonları: "Ödeme Planları" (`app-odemeplani.html`) · "Proje Listesi". `rowActions[]` 4 — Projeyi aç · Sözleşmeyi aç (`show: !!sozlesme`) · Faturayı aç (`show: !!fatura`) · Ödeme planında gör.
**Toplu işlemler:** `bulk[]` 2 — **Tamamlandı İşaretle** (`confirm` + `run`; içinde `canDuzen = GV.perm.can('duzenle')` kapısı, zaten tamamlanmışları atlar ve sayısını söyler) · Dışa aktar (`run` yok).
**Bildirimler:** `GV.toast` — toplu tamamlamada "N milestone tamamlandı olarak işaretlendi · M kayıt atlandı" (`ok`) / "Seçili kayıtların tamamı zaten tamamlanmış" (`warn`) / yetkisizde "Milestone güncelleme yetkiniz yok." (`danger`).
**Yetkilendirme:** `GV.perm.can('finans')` → tutar hücreleri `••••••`, `exportValue` boş, KPI 0; `GV.perm.can('duzenle')` → toplu tamamlama kapısı. 403 kapısı yok.
**Boş durum:** `emptyState` var — "Bu görünümde milestone yok" + "Proje Listesi" aksiyonu.
**Hata durumu:** `GV.errorState` **yok**.
**Mobil görünüm:** `mobile(x)` var (ad + tutar, kod/proje/taksit, durum + fatura rozeti + tarih).
**Kabul kriterleri:**
- Sözleşmesi ya da faturası olmayan satırda ilgili `rowAction` **hiç basılmamalı** (`show` sözleşmesi).
- "Taksit tutarı" kolonu ile "Fatura toplamı" kolonu asla aynı eksende gösterilmemeli: biri (KDV hariç), diğeri (KDV dahil) etiketli.
- Gecikme hesabı `DB.today`'e oturmalı; `F.days` dışında tarih kaynağı kullanılmamalı.

---

### `app-proje-sprint.html` — Sprintler

**Tip:** liste
**Bölüm:** `SECTIONS.proje` → menü etiketi **"Sprintler"**, `screen:'sprint'`
**Amaç:** Projelerin iki haftalık iş paketlerini planlanan/tamamlanan saat, süre durumu ve açık görev sayısıyla izlemek.
**Kullanıcılar:** `proje` bölümü olan 17 rol.
**Veri kaynağı:** `DB.sprints` (kaynak) · `DB.projects` · `DB.tasks` · `DB.today` · `DB.empName`
**Üst özet kartları:** `kpis[]` 4 — **Aktif sprint** (`Devam ediyor`, + toplam kayıt meta'sı) · **Toplam planlanan saat** · **Tamamlanan saat** · **Ortalama tamamlanma oranı** (+ saat bazında oran meta'sı)
**Sekmeler:** `tabs[]` 5 — Tümü · Devam Edenler · Planlananlar · Tamamlananlar · **Hedefin Altında Kalanlar** (kapanmış ve oran < %85)
**Arama:** `search.fields` = `kod · ad · proje · durum`; `search.extra` = projenin `ad` + `musteriAd`
**Filtreler:** `proje` select · `durum` multi (3 değer) · `baslangic` daterange · `bitis` daterange · `oranEsik` select (4 kova, `test`) · `pm` select (projelerden türetilen PM listesi, `test`)
**Tablo kolonları:** Sprint (kilitli) · Proje · **Sorumlu PM** *(gizli)* · Başlangıç · Bitiş · Kalan / geçen gün · Durum · Planlanan saat · Tamamlanan saat · **Kalan saat** *(gizli)* · Tamamlanma oranı · Görev sayısı · Açık görev
**Form alanları:** —
**Detay sekmeleri:** —
**İşlem butonları:** `GV.pageHead({eyebrow:'Teslimat', title:'Sprintler'})` aksiyonları: "Görev Listesi" · "Proje Listesi". `rowActions[]` 3 — Projeyi aç · Sprint görevlerini gör (`app-gorev.html?t=proje&f_sprint=`) · Sprint panosu (aynı hedef `v=kanban` ile).
**Toplu işlemler:** `bulk[]` 3 — **Sprinti Kapat** (`confirm` + `run`, `GV.perm.can('duzenle')` kapısı, yalnız devam edenleri kapatır) · **Arşivle** (`tone:'danger'`, `run`, aynı yetki kapısı, `aktif=false`) · Dışa aktar (`run` yok).
**Bildirimler:** `GV.toast` — "N sprint kapatıldı · M kayıt atlandı" / "Seçili kayıtların hiçbiri devam eden sprint değil" (`warn`) / "N sprint arşivlendi" (`ok`) / yetkisizde "Sprint güncelleme yetkiniz yok." · "Arşivleme yetkiniz yok." (`danger`).
**Yetkilendirme:** `GV.perm.can('duzenle')` iki toplu işlemde. Finans maskesi yok (ekranda para alanı yok). 403 kapısı yok.
**Boş durum:** `emptyState` var — "Bu görünümde sprint yok" + "Yeni Sprint" (`app-proje-sprint-form.html`).
**Hata durumu:** `GV.errorState` **yok**.
**Mobil görünüm:** `mobile(s)` var (kod + saat oranı, ad/proje, durum + açık görev etiketi + süre metni).
**Kabul kriterleri:**
- "Kalan / geçen gün" metni sprint durumuna göre dört farklı cümle üretmeli (planlandı / tamamlandı / süre aşıldı / kaldı) ve `DB.today` eksenine oturmalı.
- Sprint kodu hücresi ve "Açık görev" sayısı, aynı `f_sprint` filtresiyle görev listesine gitmeli.
**Bulgular:** Liste satırının birincil bağlantısı bir **sprint detay ekranına değil**, filtreli görev listesine gider — bu modülde sprint detay ekranı yoktur, sprint yalnız form ve liste olarak vardır.

---

### `app-proje-sprint-form.html` — Sprint Formu

**Tip:** form
**Bölüm:** `SECTIONS.proje` (`data-screen="sprint"`); menüde yok, şuradan bağlanır: `app-proje-sprint.html` boş durum aksiyonu.
**Amaç:** Yeni sprint açmak veya var olan sprintin projesini, takvimini, durumunu ve efor/kapsam sayılarını düzenlemek.
**Kullanıcılar:** `proje` bölümü olan 17 rol + yazma kapısı (`ekle` / `duzenle`).
**Veri kaynağı:** `DB.sprints` · `DB.projects` · `DB.tasks` · `DB.tests` · `DB.bugs` · `DB.employees` · `DB.activities` · `DB.today`
**Üst özet kartları:** yok
**Sekmeler:** yok
**Arama:** yok
**Filtreler:** yok
**Tablo kolonları:** yok
**Form alanları:** `GV.form({ mount:'#formMount', id:'sprint', … })` — **3 bölüm**:
- **Sprint kimliği** — 4 alan; zorunlu: Proje, Sprint adı, Sprint durumu (Kayıt durumu switch opsiyonel)
- **Takvim** — 2 alan; ikisi de zorunlu: Başlangıç tarihi, Bitiş tarihi (`validate` ile bitiş ≥ başlangıç ve proje takvimiyle karşılaştırma)
- **Efor ve kapsam** — 3 alan; üçü de zorunlu: Planlanan saat, Tamamlanan saat, Sprintin görev sayısı
**Detay sekmeleri:** —
**İşlem butonları:** `GV.pageHead({eyebrow:'Teslimat', title: `<kod> · Düzenle` / `Yeni Sprint`})`; aksiyonlar: Vazgeç (`app-proje-sprint.html`) · Kaydet / Değişiklikleri kaydet (`run:kaydet`).
**Toplu işlemler:** yok
**Bildirimler:** `GV.toast` kaydetmede (değişiklik yok / güncellendi / "`<kod>` oluşturuldu"). `GV.notice` ile: tarihlerin ölçüme göre ön doldurulduğu bilgisi, yeni sprintin bağlı kaydı olmadığı uyarısı, sprintin proje takvimi dışına taştığı uyarısı, aynı projedeki sprint çakışması.
**Yetkilendirme:** `can = duzenle ? GV.perm.can('duzenle') : GV.perm.can('ekle')`; false ise `GV.errorState` ile **403**. Alan maskeleme yok.
**Boş durum:** `GV.empty` "Kayıt bulunamadı" + "Sprintlere dön".
**Hata durumu:** `GV.errorState` **var** (403 kapısı).
**Mobil görünüm:** `mobile()` yok; `GV.form` ızgarası daralır.
**Kabul kriterleri:**
- Bitiş tarihi başlangıçtan önce girilirse form kaydetmemeli ve ilk hatalı alana odaklanmalı.
- Sprint aralığı seçili projenin planlanan takvimi dışına taşarsa uyarı `GV.notice` olarak basılmalı ama kayıt engellenmemeli.

---

### `app-proje-test.html` — Testler

**Tip:** liste
**Bölüm:** `SECTIONS.proje` → grup başlığı "Kalite" altında menü etiketi **"Testler"**, `screen:'test'`
**Amaç:** Proje test koşumlarını senaryo sayıları, başarı oranı ve projedeki açık hata yüküyle birlikte izlemek.
**Kullanıcılar:** `proje` bölümü olan 17 rol.
**Veri kaynağı:** `DB.tests` (kaynak) · `DB.projects` · `DB.bugs` · `DB.empName`
**Üst özet kartları:** `kpis[]` 4 — **Toplam test çalışması** · **Çalıştırılan senaryo** (Σ `senaryo`) · **Başarı oranı** (Σ başarılı / Σ senaryo) · **Başarısız senaryo** (Σ `basarisiz`)
**Sekmeler:** `tabs[]` 5 — Tümü · Devam Edenler · Planlananlar · Tamamlananlar · Başarısızlığı Olanlar
**Arama:** `search.fields` = `kod · ad · proje · tur · durum`; `search.extra` = proje adı + sorumlunun adı
**Filtreler:** `proje` select · `tur` multi (veriden türetilen test türleri) · `durum` multi (3 değer) · `sorumlu` select (veriden türetilen) · `tarih` daterange · `basarisizVar` select (Evet/Hayır, `test`)
**Tablo kolonları:** Test (kilitli) · Proje · Test türü · Senaryo · Başarılı · Başarısız · Başarı oranı · Sorumlu · Çalıştırma tarihi · Durum · Projedeki açık hata · **Proje durumu** *(gizli)*
**Form alanları:** —
**Detay sekmeleri:** —
**İşlem butonları:** `GV.pageHead({eyebrow:'Projeler', title:'Testler'})` aksiyonları: "Hatalar" · "Proje Listesi". `rowActions[]` 3 — Projeyi aç · Projenin hatalarını gör (`app-proje-hata.html?q=`) · Test görevlerini gör (`app-gorev.html?q=`).
**Toplu işlemler:** `bulk[]` 3 — **Tamamlandı İşaretle** (`confirm` + `run`, `duzenle` kapısı, yalnız "Devam ediyor" olanları çevirir) · Dışa aktar · **Arşivle** (`tone:'danger'`, `run`, `duzenle` kapısı).
**Bildirimler:** `GV.toast` — "N test koşumu tamamlandı · M kayıt atlandı" / "Seçili kayıtların hiçbiri devam eden bir koşum değil" (`warn`) / "N test koşumu arşivlendi" / yetkisizde "Test kaydını güncelleme yetkiniz yok." · "Arşivleme yetkiniz yok." (`danger`).
**Yetkilendirme:** `GV.perm.can('duzenle')` iki toplu işlemde. Finans maskesi yok. 403 kapısı yok.
**Boş durum:** `emptyState` var — "Bu görünümde test koşumu yok" + "Yeni Test Koşumu".
**Hata durumu:** `GV.errorState` **yok**.
**Mobil görünüm:** `mobile(t)` var (kod + oran, proje/test adı, durum + tür + başarısız rozeti + tarih).
**Kabul kriterleri:**
- Senaryosu 0 olan planlı koşumda başarı oranı hesaplanmamalı, "Henüz koşulmadı" yazmalı (sıfıra bölme yok).
- Satır vurgusu (`is-late`) yalnız başarı oranı %90'ın **altındaki** koşumlarda basılmalı, her başarısız senaryoda değil.
**Bulgular:** "Projedeki açık hata" kolonu koşumun kendi hatalarını değil **projenin** açık hatalarını sayar; kolon etiketi bunu doğru söylüyor ama aynı proje içindeki iki koşum satırında aynı sayı tekrar eder.

---

### `app-proje-test-detay.html` — Test Koşumu Detayı

**Tip:** detay
**Bölüm:** `SECTIONS.proje` (`data-screen="test"` → "Testler" satırı vurgulanır); menüde yok, şuradan bağlanır: `app-proje-test.html` kolon/kart/mobil bağlantıları, `app-proje-hata-form.html` "Koşumu aç" bildirimi.
**Amaç:** Tek bir test koşumunun sayısal sonucunu, kapsamını, açtığı hataları ve bağlandığı teslimi uçtan uca göstermek.
**Kullanıcılar:** `proje` bölümü olan 17 rol; "Koşumu tamamla" aksiyonu için `GV.perm.can('duzenle')`.
**Veri kaynağı:** `DB.tests` · `DB.projectModules` · `DB.sprints` · `DB.bugs` · `DB.deliveries` · `DB.milestones` · `DB.activities` · `DB.today` · `DB.proj` / `DB.emp` / `DB.empName` / `DB.modName`
**Üst özet kartları:** `kpis[]` yok; sağ panelde `.gv-summary` ile üç özet kartı (Özet · Açtığı Hatalar · Proje) + Son Hareket kartı.
**Sekmeler:** —
**Arama:** yok
**Filtreler:** yok
**Tablo kolonları:** yok (sekme içi `.gtable`)
**Form alanları:** —
**Detay sekmeleri:** `GV.tabs('#recTabs')` ile **6 sekme**:
1. **Genel** — `DB.tests`'in on bir alanının tamamı: koşum kimliği, kapsam ve sorumluluk, senaryo sayıları (+ "başarılı + başarısız = toplam" **sayım tutarlılığı** rozeti), tarih ve sprint bağı
2. **Senaryo Sonuçları** — senaryo bazlı dökümün veride **olmadığını** söyleyen `GV.notice(warn)` + toplamların kırılım tablosu + koşulmamışsa `GV.empty`
3. **Açılan Hatalar** — `DB.bugs[].test` yazılı bağıyla açılan hatalar; aynı projenin diğer hataları "Aynı proje" etiketiyle **bağlam** olarak listelenir; bağlı hata sayısı `basarisiz`i aşarsa `GV.notice(danger)`
4. **Kapsam** — `DB.tests[].moduller` dizisiyle kapsanan/kapsanmayan modüller, sprint bağı, proje kartından okunan test/canlı ortam ve teknoloji + projenin sprintleri bağlam tablosu
5. **İlgili Teslim** — `DB.deliveries[].test` yazılı bağı; teslimin taksit (`milestone`) bağı ve modül kapsamı; bağsızsa aynı projenin teslimleri bağlam olarak
6. **Aktivite Geçmişi** — koşumun hareketleri + projenin hareketleri (ayrı bölüm, "bağlam" etiketli)
**İşlem butonları:** `GV.pageHead({eyebrow:'Proje Yönetimi', title:'Test Koşumu Detayı', sub:…})`; aksiyonlar: "Test listesi" · "Hatalar" (`?q=<proje>`) · "Proje" (proje varsa). Panel içinde koşullu **"Koşumu tamamla"** butonu (`#btnTamamla`) — yalnız `yetkiDuzenle && !tamam` ise basılır; `mount.onclick` ataması ile bağlanır (dinleyici birikmez).
**Toplu işlemler:** yok
**Bildirimler:** `GV.toast('<kod> tamamlandı olarak işaretlendi','ok')`, doğrulama uyarıları ("Koşum tarihi bugünden ileri olamaz", "Toplam senaryo en az 1 olmalı", "Başarılı + başarısız toplamı senaryo sayısına eşit olmalı" — hepsi `warn`). `GV.notice` on ayrı yerde (bağ yazılı/yazılı değil, senaryo dökümü yok, yetki yok, sayım çelişkisi…).
**Yetkilendirme:** `GV.perm.can('duzenle')` — yetkisizde buton **hiç basılmaz** ve yerine `GV.notice(tone:'neutral', icon:'i-lock')` "Koşumu tamamlama yetkisi yok" düşer. Alan maskeleme yok, 403 kapısı yok.
**Boş durum:** `?id=` hatalıysa `GV.empty` "Test koşumu bulunamadı" + "Test listesine dön". Sekme içinde 4 ayrı `GV.empty`.
**Hata durumu:** `GV.errorState` **yok**.
**Mobil görünüm:** `mobile()` yok; sekme tabloları `.is-mobilescroll` ile yatay kaydırır.
**Kabul kriterleri:**
- Koşum tamamlanırken girilen senaryo sayıları `başarılı + başarısız = toplam` denklemini sağlamadan kayıt kabul edilmemeli.
- "Bu koşumdan" rozeti yalnız `DB.bugs[].test === t.kod` olan satırlarda basılmalı; diğerleri "Aynı proje" olmalı.
- `GV.refresh()` sonrası `#btnTamamla` dinleyicisi birikmemeli (`mount.onclick` ataması).
**Bulgular:** Sağ paneldeki "Açtığı Hatalar" kartında **eski bir satır kalmış**: `['Bağ alanı', '<span class="badge is-danger no-dot">Yok</span><span class="cell-sub">sayı bağ değil, adaydır</span>']`. Aynı ekranın gövdesi bağın `DB.bugs[].test` alanında **yazılı** olduğunu söylüyor; özet paneli bunu yalanlıyor — VB-08 öncesinden kalmış metin.

---

### `app-proje-test-form.html` — Test Koşumu Formu

**Tip:** form
**Bölüm:** `SECTIONS.proje` (`data-screen="test"`); menüde yok, şuradan bağlanır: `app-proje-test.html` boş durum aksiyonu.
**Amaç:** Yeni test koşumu açmak veya var olan koşumun kapsamını, takvimini ve senaryo sonuçlarını düzenlemek.
**Kullanıcılar:** `proje` bölümü olan 17 rol + yazma kapısı (`ekle` / `duzenle`).
**Veri kaynağı:** `DB.tests` · `DB.projects` · `DB.projectModules` · `DB.sprints` · `DB.bugs` · `DB.deliveries` · `DB.employees` · `DB.activities` · `DB.today` · `DB.proj` / `DB.projName` / `DB.modName`
**Üst özet kartları:** yok
**Sekmeler:** yok
**Arama:** yok
**Filtreler:** yok
**Tablo kolonları:** yok
**Form alanları:** `GV.form({ mount, id:'test', record, sections:bolumler(proje, tarih) })` — **5 bölüm**, proje seçimi değişince bölümler yeniden kurulur:
- **Koşum kimliği** — 5 alan; hepsi zorunlu: Test adı, Proje, Test türü, Koşan kişi, Koşum durumu
- **Takvim ve sprint** — 2 alan; zorunlu: Koşum tarihi. Sprint alanı, koşum tarihi bir sprint aralığına düşüyorsa `validate` ile **boş bırakılamaz**
- **Kapsam — taranan modüller** — seçili projenin modülleri kadar **checkbox** (`multiselect` bileşende olmadığı için); ilk alanın `validate`'i "en az bir modül işaretlenmeli" kuralını taşır (modül kırılımı olmayan projede bölüm boş kalır)
- **Senaryo sonuçları** — 3 alan; üçü de zorunlu: Toplam senaryo, Başarılı senaryo, Başarısız senaryo (toplam denkliği `validate` ile)
- **Kayıt durumu** — 1 alan (`aktif` switch)
**Detay sekmeleri:** —
**İşlem butonları:** `GV.pageHead({eyebrow:'Projeler', title: `<kod> · Düzenle` / `Yeni Test Koşumu`})`; aksiyonlar: Vazgeç (`app-proje-test.html`) · Kaydet / Değişiklikleri kaydet.
**Toplu işlemler:** yok
**Bildirimler:** `GV.toast` — proje değişince "…" uyarısı, kaydetmede "Değişiklik yok…" / "`<kod>` güncellendi · N alan" / "`<kod>` oluşturuldu". `GV.notice` ile hata listesi bağlantısı, proje ön seçimi ve sprint uyarısı.
**Yetkilendirme:** `can = duzenle ? can('duzenle') : can('ekle')`; false ise `GV.errorState` **403**.
**Boş durum:** `GV.empty` "Kayıt bulunamadı" + "Testlere dön".
**Hata durumu:** `GV.errorState` **var** (403).
**Mobil görünüm:** `mobile()` yok.
**Kabul kriterleri:**
- Proje değiştirildiğinde modül onay kutuları ve sprint seçenekleri yeni projeye göre yeniden kurulmalı, eski projeye ait seçim kalmamalı.
- Koşum tarihi bir sprint aralığına düşüyorsa sprint seçilmeden kayıt kabul edilmemeli.

---

### `app-proje-hata.html` — Hatalar

**Tip:** liste
**Bölüm:** `SECTIONS.proje` → "Kalite" grubunda menü etiketi **"Hatalar"**, `screen:'hata'`, sayaç `cnt:'hata'`
**Amaç:** Proje hata kayıtlarını şiddet, öncelik, açık kalma süresi ve göreve bağlanma durumuyla izlemek; bağsız hataları göreve dönüştürmek.
**Kullanıcılar:** `proje` bölümü olan 17 rol.
**Veri kaynağı:** `DB.bugs` (kaynak) · `DB.projects` · `DB.projectModules` · `DB.tasks` · `DB.priorities` · `DB.impacts` · `DB.today` · `DB.proj` / `DB.projName` / `DB.empName`
**Üst özet kartları:** `kpis[]` 4 — **Toplam hata kaydı** · **Açık hata** · **Kritik ve yüksek şiddet** (+ "N tanesi açık" meta'sı) · **Ortalama çözüm süresi** (kapanmış kayıtlardan gün cinsinden)
**Sekmeler:** `tabs[]` 6 — Tümü · Açık · Devam Edenler · Kapananlar · Kritik ve Yüksek · **Göreve Bağlanmamış**
**Arama:** `search.fields` = `kod · baslik · proje · modul · siddet · oncelik · durum · ortam · gorev`; `search.extra` = proje adı + modül adı + bulan ve sorumlunun adı
**Filtreler:** `proje` select · `modul` select (`DB.projectModules`, etiketinde proje adı da var) · `siddet` multi (veriden türetilip `DB.priorities` sırasına oturtulur) · `oncelik` multi · `durum` multi · `sorumlu` select · `bulan` select · `bulunma` daterange · `bagsiz` select (görev bağlantısı var/yok, `test`)
**Tablo kolonları:** Hata (kilitli) · Proje · Modül · Şiddet · Öncelik · Durum · Bulan · Sorumlu · Bulunma tarihi · Açık kalma / çözüm süresi · Ortam · Tekrarlanabilirlik · Bağlı görev · **Proje durumu** *(gizli)*
**Form alanları:** —
**Detay sekmeleri:** —
**İşlem butonları:** `GV.pageHead({eyebrow:'Projeler', title:'Hatalar'})` aksiyonları: "Testler" · "Proje Listesi". `rowActions[]` 4 — Projeyi aç · Bağlı görevi aç (`show: !!gorev`) · **Bu hatadan görev oluştur** (`show: bagsiz`, `GV.perm.can('ekle')` kapısı, `GV.confirm` sonrası `DB.tasks.push` + `b.gorev = kod`) · Projenin testlerini gör.
**Toplu işlemler:** `bulk[]` 3 — **Kapandı İşaretle** (`run`, `duzenle` kapısı, `cozum = DB.today` yazar) · Dışa aktar · **Arşivle** (`tone:'danger'`, `run`, `duzenle` kapısı).
**Bildirimler:** `GV.toast` — "`<GRV-kod>` oluşturuldu · `<HTA-kod>` bu göreve bağlandı" (`ok`), "N hata kapatıldı · M kayıt atlandı", "Seçili kayıtların hepsi zaten kapalı" (`warn`), "N hata kaydı arşivlendi", yetkisizde "Görev oluşturma yetkiniz yok." / "Hata kaydını güncelleme yetkiniz yok." / "Arşivleme yetkiniz yok." (`danger`). `GV.confirm` görev oluşturmadan önce.
**Yetkilendirme:** `GV.perm.can('ekle')` (görev üretimi) · `GV.perm.can('duzenle')` (kapatma, arşivleme). Alan maskeleme yok, 403 kapısı yok.
**Boş durum:** `emptyState` var — "Bu görünümde hata kaydı yok" + "Yeni Hata Kaydı".
**Hata durumu:** `GV.errorState` **yok**.
**Mobil görünüm:** `mobile(b)` var (başlık + şiddet, kod/proje, modül ve ortam satırı, durum + görevsiz rozeti + gün rozeti + tarih).
**Kabul kriterleri:**
- Hatadan üretilen görevin kodu dizi uzunluğundan değil, mevcut **en büyük** `GRV-yyyy-N` değerinden türetilmeli.
- Şiddet `Kritik` olan hatadan doğan görevin `etki` alanı `Çok yüksek` olmalı (iki eksen eşlemesi, §9).
- Bağ yalnız **tek yönde** yazılmalı: `b.gorev = kod`; görev kaydında `hata` ayna alanı doğmamalı.
- Satır vurgusu yalnız **açık ve Kritik** hatalarda basılmalı.

---

### `app-proje-hata-detay.html` — Hata Kaydı Detayı

**Tip:** detay
**Bölüm:** `SECTIONS.proje` (`data-screen="hata"`); menüde yok, şuradan bağlanır: `app-proje-hata.html` (kolon/kart/kanban/mobil), `app-proje-test-detay.html` hata tablosu, `app-gorev-form.html` "Hatayı aç" bildirimi.
**Amaç:** Tek bir hata kaydının kimliğini, yeniden üretim bilgisini, kaynak testini, ürettiği görevi, bağlı destek talebini ve durum geçişini tek yerde göstermek.
**Kullanıcılar:** `proje` bölümü olan 17 rol; aksiyonlar için `GV.perm.can('ekle')` (göreve dönüştür) ve `GV.perm.can('duzenle')` (çözüldü / yeniden aç).
**Veri kaynağı:** `DB.bugs` · `DB.projects` (`DB.proj`) · `DB.projectModules` (`DB.mod`) · `DB.customers` · `DB.tasks` (`DB.task`) · `DB.sprints` · `DB.tests` · `DB.tickets` · `DB.employees` · `DB.activities` · `DB.priorities` · `DB.impacts` · `DB.taskTypes` · `DB.today`
**Üst özet kartları:** `kpis[]` yok; sağ panelde `.gv-summary` özet kartları.
**Sekmeler:** —
**Arama:** yok
**Filtreler:** yok
**Tablo kolonları:** yok
**Form alanları:** —
**Detay sekmeleri:** `GV.tabs('#recTabs')` ile **7 sekme**:
1. **Genel** — `DB.bugs` alanlarının tamamı: hata kimliği (+ "şiddet ile öncelik aynı mı?" karşılaştırması), kapsam (proje/modül/sprint/müşteri), sorumluluk, tarih ve süre
2. **Yeniden Üretim** — adım / beklenen / gerçekleşen alanlarının **veride olmadığını** söyleyen `GV.notice(neutral)` + ortam ve tekrarlanabilirlik bilgisi
3. **Kaynak Test** — `DB.bugs[].test` yazılı bağı; bağsızsa aynı projenin koşumları **bağlam** olarak (tarihe göre sıralı, "bağ değildir" etiketiyle)
4. **Üretilen Görev** — `DB.bugs[].gorev` tek yönlü bağı; yoksa `GV.notice(info)` "Hata göreve dönüştürülebilir" + buton, yetkisizde `GV.notice(neutral, i-lock)`
5. **Bağlı Destek Talebi** — `DB.bugs[].destek` yazılı bağı; bağsızsa projenin talepleri (kategori `Hata` olanlar öne alınmış) bağlam listesi
6. **Durum Geçişi** — hatanın yaşam döngüsü (Açık · Devam ediyor · Kapandı) + duruma göre değişen `GV.notice` + **Çözüldü işaretle** / **Yeniden aç** butonları
7. **Aktivite Geçmişi** — hatanın hareketleri + bağlı görevin hareketleri (ayrı bölüm, "bağlam" etiketli)
**İşlem butonları:** `GV.pageHead({eyebrow:'Proje Yönetimi', title:'Hata Kaydı Detayı', sub:…})`; aksiyonlar: "Hata listesi" · "Proje" (varsa) · "Testler" (`?q=<proje>`) · **"Üretilen görevi aç"** (yalnız `b.gorev` varsa, `btn-acc`). Sekme içi: `#btnCozuldu`, `#btnYenidenAc`, `#btnDonustur` — hepsi yetki ve durum koşulu sağlanmazsa **hiç basılmaz**.
**Toplu işlemler:** yok
**Bildirimler:** `GV.toast` — "`<kod>` kapandı · çözüm `<tarih>`" (`ok`), "`<kod>` yeniden açıldı · durum …" (`warn`), doğrulama uyarıları ("Çözüm tarihi bulunma tarihinden önce olamaz", "Yeniden açma gerekçesi zorunlu — en az 10 karakter", "Görev başlığı boş bırakılamaz"). `GV.result(tone:'ok')` görev oluşturulduğunda ("Görevi aç" / "Hata kaydında kal"). `GV.notice` on beşten fazla yerde.
**Yetkilendirme:** `GV.perm.can('ekle')` · `GV.perm.can('duzenle')`; ölü buton yasağı uygulanmış — yetkisizde buton yerine kilit notu. Alan maskeleme yok, 403 kapısı yok.
**Boş durum:** `?id=` hatalıysa `GV.empty` "Hata kaydı bulunamadı" + "Hata listesine dön"; sekme içi boş durumlar.
**Hata durumu:** `GV.errorState` **yok**.
**Mobil görünüm:** `mobile()` yok; `.is-mobilescroll` tabloları.
**Kabul kriterleri:**
- Hata yeniden açıldığında `cozum` boşaltılmalı ve **kapanmış** bağlı görev "Revize bekliyor" durumuna çekilip `yenidenAcilma` bir artmalı.
- Göreve dönüştürmede `DB.tasks[].hata` ayna alanı **doğmamalı**; bağ yalnız `b.gorev`'de tutulmalı.
- Bağlı görevin sprinti hatanın sprintinden farklıysa ekran bu çelişkiyi açıkça yazmalı (`sprintCelisme`).
**Bulgular:** "Genel" sekmesindeki alan etiketi hâlâ `Sprint (hata kaydında alan yok)` diyor; oysa aynı dosyanın üst kısmı sprinti `DB.bugs[].sprint` **yazılı bağından** okuyor ve components.md §9d de bunu bağ olarak kayda geçirmiş. Etiket VB-08 öncesinden kalmış.

---

### `app-proje-hata-form.html` — Hata Kaydı Formu

**Tip:** form
**Bölüm:** `SECTIONS.proje` (`data-screen="hata"`); menüde yok, şuradan bağlanır: `app-proje-hata.html` boş durum aksiyonu.
**Amaç:** Yeni hata kaydı açmak veya var olan kaydın sınıflandırma, sorumluluk, tarih, teknik bağlam ve dört bağ alanını düzenlemek.
**Kullanıcılar:** `proje` bölümü olan 17 rol + yazma kapısı (`ekle` / `duzenle`).
**Veri kaynağı:** `DB.bugs` · `DB.projects` · `DB.projectModules` · `DB.tests` · `DB.sprints` · `DB.tickets` · `DB.tasks` · `DB.employees` · `DB.priorities` · `DB.impacts` · `DB.activities` · `DB.today`
**Üst özet kartları:** yok
**Sekmeler:** yok
**Arama:** yok
**Filtreler:** yok
**Tablo kolonları:** yok
**Form alanları:** `GV.form({ mount, id:'hata', record, sections })` — **7 bölüm**:
- **Hata kimliği** — 3 alan; zorunlu: Hata başlığı, Proje (Modül opsiyonel, seçenekleri projeden gelir)
- **Sınıflandırma** — 3 alan; üçü de zorunlu: Şiddet (`DB.priorities`), Öncelik (`DB.priorities`), Durum
- **Sorumluluk** — 2 alan; zorunlu: Bildiren (Atanan opsiyonel)
- **Tarihler** — 2 alan; zorunlu: Bulunma tarihi (Çözüm tarihi opsiyonel, `validate` ile bulunmadan önce olamaz)
- **Teknik bağlam** — 2 alan (Ortam, Tekrarlanabilirlik); zorunlu yok
- **Bağlar** — 4 alan, hiçbiri zorunlu değil: Kaynak test koşumu (`test`), Ele alındığı sprint (`sprint`), Hatayı doğuran destek talebi (`destek`), Düzeltme görevi (`gorev`). Seçenekler **yalnız aynı projenin** kayıtlarıyla sınırlıdır
- **Kayıt durumu** — 1 alan (`aktif` switch)
**Detay sekmeleri:** —
**İşlem butonları:** `GV.pageHead({eyebrow:'Teslimat', title: `<kod> · Düzenle` / `Yeni Hata Kaydı`})`; aksiyonlar: Vazgeç (`app-proje-hata.html`) · Kaydet / Değişiklikleri kaydet.
**Toplu işlemler:** yok
**Bildirimler:** `GV.toast('N bağ alanı temizlendi — seçilen kayıtlar yeni projeye ait değil','warn')` proje değişince; kaydetmede üç standart toast. `GV.notice` ile: hata listesi bağlantısı, test koşumu ön seçimi, proje ön seçimi.
**Yetkilendirme:** `can = duzenle ? can('duzenle') : can('ekle')`; false ise `GV.errorState` **403** ve aksiyon "Hata listesine dön" olur.
**Boş durum:** `GV.empty` "Kayıt bulunamadı" + "Hata listesi".
**Hata durumu:** `GV.errorState` **var** (403).
**Mobil görünüm:** `mobile()` yok.
**Kabul kriterleri:**
- Proje değiştirildiğinde modül, test, sprint, destek ve görev seçenekleri yeniden kurulmalı; yeni projeye ait olmayan seçimler **temizlenmeli** ve kullanıcıya kaç alanın düştüğü söylenmeli.
- Çözüm tarihi bulunma tarihinden önce girilirse kayıt kabul edilmemeli.

---

### `app-proje-degisiklik.html` — Değişiklik Talepleri

**Tip:** liste
**Bölüm:** `SECTIONS.proje` → "Kalite" grubunda menü etiketi **"Değişiklik Talepleri"**, `screen:'degisiklik'`
**Amaç:** Sözleşme kapsamını etkileyen talepleri bekleme süresi, kapsam kararı, süre ve maliyet etkisiyle izleyip onaya bağlamak.
**Kullanıcılar:** `proje` bölümü olan 17 rol.
**Veri kaynağı:** `DB.changeRequests` (kaynak) · `DB.projects` · `DB.contracts` · `DB.tasks` · `DB.today` · `DB.projName` / `DB.empName`
**Üst özet kartları:** `kpis[]` 4 — **Toplam değişiklik talebi** · **Onay bekleyen** · **Toplam süre etkisi** (Σ `etkiSure`, saat) · **Toplam maliyet etkisi (KDV hariç)** (Σ `etkiMaliyet`, finans yetkisi yoksa `••••••`)
**Sekmeler:** `tabs[]` 6 — Tümü · Değerlendirilenler · Onay Bekleyenler · Onaylananlar · Reddedilenler · **Kapsam Dışı** (`kapsamIci === false`)
**Arama:** `search.fields` = `kod · baslik · proje · talep · durum · karar`; `search.extra` = proje adı + sorumlunun adı
**Filtreler:** `proje` select · `durum` multi (4 değer) · `talep` select (veriden türetilen talep eden taraflar) · `kapsamIci` select (Kapsam içi/dışı, `test`) · `tarih` daterange · `maliyet` select (4 kova, `test`) · `sureEsik` select (8/16/40 saatten fazla, `test`)
**Tablo kolonları:** Talep (kilitli) · Proje · Talep eden taraf · Talep tarihi · Bekleme süresi · Durum · Kapsam · Süre etkisi (saat) · Maliyet etkisi (KDV hariç) · Karar · Sorumlu · Projenin sözleşmesi · **Projedeki açık görev** *(gizli)*
**Form alanları:** —
**Detay sekmeleri:** —
**İşlem butonları:** `GV.pageHead({eyebrow:'Projeler', title:'Değişiklik Talepleri'})` aksiyonları: "Teslimler" · "Proje Listesi". `rowActions[]` 4 — Projeyi aç · Sözleşmeyi aç (`show: !!szl(d)`) · **Talebi onayla** (`show: acik`, `GV.perm.can('onay')` kapısı, `GV.confirm` sonrası durumu ve kararı yazar) · **Ek teklif oluştur** (`show: kapsamIci === false && durum === 'Onaylandı'`, `GV.perm.can('ekle')` kapısı, `app-teklif.html`'e götürür).
**Toplu işlemler:** `bulk[]` 3 — **Onayla** (`run`, `onay` kapısı, yalnız karar bekleyenleri çevirir) · Dışa aktar · **Arşivle** (`tone:'danger'`, `run`, `duzenle` kapısı).
**Bildirimler:** `GV.toast` — "`<kod>` onaylandı" (`ok`), "N değişiklik talebi onaylandı · M kayıt atlandı", "Seçili kayıtların hiçbiri karar bekleyen talep değil" (`warn`), "N değişiklik talebi arşivlendi", yetkisizde "Değişiklik talebi onaylama yetkiniz yok." / "Teklif oluşturma yetkiniz yok." / "Arşivleme yetkiniz yok." (`danger`). `GV.confirm` iki satır aksiyonunda.
**Yetkilendirme:** `GV.perm.can('finans')` → maliyet hücresi ve KPI maskelenir, `exportValue` boş; `GV.perm.can('onay')` ve `GV.perm.can('ekle')` aksiyon kapıları. 403 kapısı yok.
**Boş durum:** `emptyState` var — "Bu görünümde değişiklik talebi yok" + "Yeni Değişiklik Talebi".
**Hata durumu:** `GV.errorState` **yok**.
**Mobil görünüm:** `mobile(d)` var (kod + süre etkisi, proje/başlık, maliyet etkisi satırı, durum + kapsam rozeti + tarih).
**Kabul kriterleri:**
- `etkiMaliyet === 0` olan satır "Maliyet etkisi yok" yazmalı, boş görünmemeli (0 bir değerdir).
- Satır vurgusu yalnız **7 günden uzun** süredir karara bağlanmamış açık taleplerde basılmalı.
- Finans yetkisi yoksa maliyet KPI'ı ve kolonu hiçbir rakam sızdırmamalı.

---

### `app-proje-degisiklik-detay.html` — Değişiklik Talebi Detayı

**Tip:** detay
**Bölüm:** `SECTIONS.proje` (`data-screen="degisiklik"`); menüde yok, şuradan bağlanır: `app-proje-degisiklik.html` kolon/kart/kanban/mobil bağlantıları.
**Amaç:** Bir kapsam değişikliği talebinin süre ve bedel etkisini projenin tabanına göre çözümleyip onay/red kararını işlemek.
**Kullanıcılar:** `proje` bölümü olan 17 rol; onay/red için `GV.perm.can('onay')`.
**Veri kaynağı:** `DB.changeRequests` · `DB.projects` (`DB.proj`) · `DB.customers` · `DB.contracts` · `DB.approvals` · `DB.projectModules` · `DB.milestones` · `DB.quotes` · `DB.tasks` · `DB.activities` · `DB.impacts` · `DB.today`
**Üst özet kartları:** `kpis[]` yok; sağ panelde `.gv-summary` özetleri.
**Sekmeler:** —
**Arama:** yok
**Filtreler:** yok
**Tablo kolonları:** yok
**Form alanları:** —
**Detay sekmeleri:** `GV.tabs('#recTabs')` ile **7 sekme**:
1. **Genel** — `DB.changeRequests`'in on iki alanının tamamı: talep kimliği, kapsam ve karar, etki özeti (+ **hesaplanan etki düzeyi**, kayıtta `etki` alanı olmadığı için süre ve bedel sapmalarının büyüğünden türetilir)
2. **Etki Analizi** — süre etkisi (SAAT ekseni, 8 sa/gün adam-gün dönüşümü) ve maliyet etkisi (NET) ayrı bölümlerde; "iç bütçe ayrı eksendir" uyarısı; talep ↔ modül/taksit bağı **olmadığı** için projenin tüm modülleri ve taksitleri "etkilenen seçimi türetilmemiştir" etiketiyle listelenir
3. **Onay Akışı** — `DB.approvals[].kayit` yazılı bağı; duruma göre değişen `GV.notice` + **Talebi onayla** / **Talebi reddet** butonları
4. **Ek Teklif** — talep ↔ teklif bağı **kayıtta yok**; müşterinin `DB.quotes` kayıtları yalnız **aday** olarak listelenir
5. **Üretilen Görevler** — görev ↔ değişiklik talebi bağı **kayıtta yok**; sekme bilinçli olarak boş (`uretilenGorev = []`) + uyarı `GV.notice(warn)` + `GV.empty`
6. **Sözleşme Etkisi** — NET → KDV → BRÜT açık hesabı (`yeniNet`, `yeniKdv`, `yeniBrut`, farklar); talep reddedildiyse / onaylandığı hâlde sözleşme güncellenmediyse ayrı uyarılar
7. **Aktivite Geçmişi** — `GV.activity(acts)` veya `GV.empty`
**İşlem butonları:** `GV.pageHead({eyebrow:'Proje Yönetimi', title:'Değişiklik Talebi Detayı', sub:…})`; aksiyonlar: "Değişiklik talepleri" · "Proje" (varsa) · "Sözleşme" (varsa, `app-sozlesme-detay.html?id=`) · **"Onayla"** (yalnız `canOnay && acik`, `btn-acc`, `run:onayModal`). Sekme içi `#btnOnayla` ve `#btnReddet` aynı koşulla basılır; `mount.onclick` ataması ile bağlanır.
**Toplu işlemler:** yok
**Bildirimler:** `GV.toast('<kod> onaylandı','ok')` / `GV.toast('<kod> reddedildi','warn')` / "Red gerekçesi zorunlu — en az 10 karakter" (`warn`). `GV.notice` on beşten fazla yerde (finans maskesi, bağ eksikliği, kapsam dışı bedel uyarısı, sözleşme güncellenmemiş uyarısı…).
**Yetkilendirme:** `GV.perm.can('finans')` → `para()` / `paraSade()` / `paraOran()` maskeler ve **paradan türeyen oran da maskelenir** (eksen sızmasın diye); `GV.perm.can('onay')` → onay/red butonları hiç basılmaz, yerine `GV.notice(neutral, i-lock)` "Onay yetkiniz yok". 403 kapısı yok.
**Boş durum:** `?id=` hatalıysa `GV.empty` "Değişiklik talebi bulunamadı" + listeye dönüş; sekme içinde 5 ayrı `GV.empty`.
**Hata durumu:** `GV.errorState` **yok**.
**Mobil görünüm:** `mobile()` yok; `.is-mobilescroll`.
**Kabul kriterleri:**
- Onay kararı hem `DB.changeRequests` kaydını hem varsa `DB.approvals` adımını güncellemeli ve iki ayrı aktivite satırı yazmalı.
- Süre etkisi hiçbir yerde gün cinsinden **veri** gibi gösterilmemeli; gün karşılığı hep "≈ N adam-gün (8 sa/gün)" biçiminde türetilmiş olarak yazılmalı.
- Finans yetkisi olmayan rolde sapma yüzdeleri de maskelenmeli.

---

### `app-proje-degisiklik-form.html` — Değişiklik Talebi Formu

**Tip:** form
**Bölüm:** `SECTIONS.proje` (`data-screen="degisiklik"`); menüde yok, şuradan bağlanır: `app-proje-degisiklik.html` boş durum aksiyonu.
**Amaç:** Kapsam değişikliği talebi açmak veya var olan talebin kapsam kararını, etkisini ve destek bağını düzenlemek.
**Kullanıcılar:** `proje` bölümü olan 17 rol + yazma kapısı (`ekle` / `duzenle`).
**Veri kaynağı:** `DB.changeRequests` · `DB.projects` (`DB.proj`, `DB.projName`) · `DB.contracts` · `DB.approvals` · `DB.tickets` · `DB.tasks` · `DB.employees` · `DB.impacts` · `DB.activities` · `DB.today`
**Üst özet kartları:** yok
**Sekmeler:** yok
**Arama:** yok
**Filtreler:** yok
**Tablo kolonları:** yok
**Form alanları:** `GV.form({ mount, id:'degisiklik', record, sections })` — **5 bölüm** (biri koşullu alanlı):
- **Talep kimliği** — 5 alan; hepsi zorunlu: Talep başlığı, Proje, Talep tarihi, Talebi açan taraf, Talep sorumlusu
- **Kapsam ve karar** — 3 alan; zorunlu: Kapsam değerlendirmesi (`radio`), Talep durumu (Karar `textarea` opsiyonel)
- **Etki** — 1–2 alan; zorunlu: Süre etkisi (saat). **Maliyet etkisi (KDV hariç)** alanı yalnız `canFinans` ise basılır
- **Bağ** — 1 alan: Talebi doğuran destek talebi (`destek`), yalnız aynı projenin talepleri
- **Kayıt durumu** — 1 alan (`aktif` switch)
**Detay sekmeleri:** —
**İşlem butonları:** `GV.pageHead({eyebrow:'Proje Yönetimi', title: `<kod> · Düzenle` / `Yeni Değişiklik Talebi`})`; aksiyonlar: Vazgeç · Kaydet / Değişiklikleri kaydet.
**Toplu işlemler:** yok
**Bildirimler:** `GV.toast('Destek bağı temizlendi — seçili talep yeni projeye ait değil','warn')`; kaydetmede üç standart toast. `GV.notice` — onay kuyruğu bağlantısı, proje ön seçimi, finans yetkisi yoksa "Maliyet etkisi alanı forma basılmadı".
**Yetkilendirme:** `GV.perm.can('finans')` → maliyet alanı **hiç basılmaz** + kilit notu; `can = duzenle ? can('duzenle') : can('ekle')` false ise `GV.errorState` **403**.
**Boş durum:** `GV.empty` "Kayıt bulunamadı" + "Değişiklik talepleri".
**Hata durumu:** `GV.errorState` **var** (403).
**Mobil görünüm:** `mobile()` yok.
**Kabul kriterleri:**
- Finans yetkisi olmayan rolde `etkiMaliyet` alanı DOM'da bulunmamalı ve kaydetme sırasında kaydın mevcut değeri korunmalı (sıfırlanmamalı).
- Proje değiştirilince destek bağı yeni projeye ait değilse temizlenmeli ve kullanıcıya söylenmeli.

---

### `app-proje-teslim.html` — Teslimler

**Tip:** liste
**Bölüm:** `SECTIONS.proje` → "Kalite" grubunda menü etiketi **"Teslimler"**, `screen:'teslim'`
**Amaç:** Proje teslimlerini tarih, gecikme, müşteri onayı ve karşılık geldiği taksit/fatura zinciriyle izlemek.
**Kullanıcılar:** `proje` bölümü olan 17 rol.
**Veri kaynağı:** `DB.deliveries` (kaynak) · `DB.projects` (`DB.proj`, `DB.projName`) · `DB.milestones` · `DB.invoices` · `DB.today` · `DB.empName`
**Üst özet kartları:** `kpis[]` 4 — **Toplam teslim** · **Müşteri onayı alınmış** · **Onay bekleyen** · **Geciken teslim**
**Sekmeler:** `tabs[]` 5 — Tümü · Planlananlar · Onaylananlar · Gecikenler · Müşteri Onayı Bekleyenler
**Arama:** `search.fields` = `kod · ad · proje · durum · not`; `search.extra` = proje adı + müşteri adı + teslim edenin adı + bağlı taksitin kodu ve adı
**Filtreler:** `proje` select · `musteri` select (tesliminin projesinden türetilen müşteri listesi, `test`) · `durum` multi (3 değer) · `musteriOnay` select (`test`) · `teslimEden` select (veriden türetilen) · `tarih` daterange · `gecikenVar` select (Evet/Hayır, `test`)
**Tablo kolonları:** Teslim (kilitli) · Proje · Müşteri · Teslim tarihi · Gecikme / kalan gün · Durum · Teslim eden · Müşteri onayı · Onay tarihi · Onaya kadar geçen gün · Karşılık gelen taksit (KDV hariç) · Teslim notu · **Taksit faturası** *(gizli)* · **Proje durumu** *(gizli)*
**Form alanları:** —
**Detay sekmeleri:** —
**İşlem butonları:** `GV.pageHead({eyebrow:'Projeler', title:'Teslimler'})` aksiyonları: "Milestone" · "Proje Listesi". `rowActions[]` 4 — Projeyi aç · Milestone'u aç (`show: !!taksitOf`) · **Müşteri onayını işaretle** (`show: onayBekler && GV.perm.can('onay')`, `GV.modal` içinde tarih alanı, `min` teslim tarihi) · Teslim notunu gör (`show: !!t.not`, `GV.modal`).
**Toplu işlemler:** `bulk[]` 3 — **Müşteri Onayı İşaretle** (`run`, `onay` kapısı, `onayTarihi = DB.today`) · Dışa aktar · **Arşivle** (`tone:'danger'`, `run`, `duzenle` kapısı).
**Bildirimler:** `GV.toast` — "`<kod>` için müşteri onayı işlendi" (`ok`), "N teslimin müşteri onayı işlendi · M kayıt atlandı", "Seçili kayıtların hiçbiri onay beklemiyor" (`warn`), "N teslim arşivlendi", yetkisizde "Müşteri onayını işaretleme yetkiniz yok." / "Arşivleme yetkiniz yok." (`danger`). `GV.modal` iki satır aksiyonunda.
**Yetkilendirme:** `GV.perm.can('finans')` → taksit tutarı `••••••`, `exportValue` boş; `GV.perm.can('onay')` (satır ve toplu onay) · `GV.perm.can('duzenle')` (arşivleme). 403 kapısı yok.
**Boş durum:** `emptyState` var — "Bu görünümde teslim kaydı yok" + "Yeni Teslim Kaydı".
**Hata durumu:** `GV.errorState` **yok**.
**Mobil görünüm:** `mobile(t)` var (kod + tarih, proje/ad, durum + müşteri onay rozeti + teslim eden).
**Kabul kriterleri:**
- Teslim ↔ taksit bağı yalnız `DB.deliveries[].milestone` alanından okunmalı; tarih yakınlığından türetilmemeli (L-13).
- Onay yetkisi olmayan rolde "Müşteri onayını işaretle" butonu **hiç basılmamalı** (`show` içinde yetki kontrolü var).
- Satır vurgusu yalnız gerçekten gecikmiş tesliminde basılmalı; onay bekleyen ama tarihi gelmemiş planlı teslim kırmızıya boyanmamalı.

---

### `app-proje-teslim-detay.html` — Teslim Detayı

**Tip:** detay
**Bölüm:** `SECTIONS.proje` (`data-screen="teslim"`); menüde yok, şuradan bağlanır: `app-proje-teslim.html` kolon/kart/mobil bağlantıları, `app-proje-test-detay.html` teslim tablosu.
**Amaç:** Bir teslimin kapsamını, kalite durumunu (kabul koşumu + açık hata), taksit-fatura-tahsilat zincirini ve müşteri onay akışını göstermek.
**Kullanıcılar:** `proje` bölümü olan 17 rol; onay/revizyon aksiyonları için `GV.perm.can('duzenle')`.
**Veri kaynağı:** `DB.deliveries` · `DB.projects` (`DB.proj`) · `DB.projectModules` · `DB.tests` · `DB.bugs` · `DB.milestones` · `DB.invoices` · `DB.payments` · `DB.contracts` · `DB.customers` · `DB.activities` · `DB.today` · `DB.modName` / `DB.empName`
**Üst özet kartları:** `kpis[]` yok; sağ panelde `.gv-summary` özetleri.
**Sekmeler:** —
**Arama:** yok
**Filtreler:** yok
**Tablo kolonları:** yok
**Form alanları:** —
**Detay sekmeleri:** `GV.tabs('#recTabs')` ile **6 sekme**:
1. **Genel** — teslim kimliği, teslim durumu ve tarihi, **ödeme planı bağı** (`milestone`), teslim notu (yoksa `GV.notice`), kapsam ve kalite özeti
2. **Kapsam** — `DB.deliveries[].moduller` dizisiyle kapsanan modüller; kabul koşumunun kapsamıyla **birebir aynı olmadığı** durumda uyarı; modül kaydı yoksa `GV.empty`
3. **Kalite** — teslim tarihine kadar koşmuş testler + teslim anında açık olan hatalar; duruma göre beş farklı `GV.notice` (kritik açık hata / açık hata / projede açık kritik / açık hata yoktu / hata yok)
4. **Taksit ve Fatura Zinciri** — taksit (NET) → fatura (net/KDV/brüt) → tahsilat (BRÜT) zinciri; dört ayrı tutarsızlık uyarısı: taksit bağı yok · taksit tutarı ≠ fatura neti · fatura kesilmemiş · aynı taksite birden fazla teslim bağlı
5. **Müşteri Onayı** — onay durumu, revizyon/teslim notu (ayrı revizyon notu alanı **yok**, bu açıkça yazılır), **Müşteri onayını işaretle** ve **Revizyon istendi işaretle** butonları
6. **Aktivite Geçmişi** — `GV.activity(acts)` veya `GV.empty`
**İşlem butonları:** `GV.pageHead({eyebrow:'Proje Yönetimi', title:'Teslim Detayı', sub:…})`; aksiyonlar: "Teslim listesi" · "Proje" (varsa) · "Ödeme planı" · **"Müşteri onayını işaretle"** (yalnız `onayBasilir`, `btn-acc`, `run:onayAkisi`). Sekme içi `#btnOnay` ve `#btnRevizyon` koşullu basılır.
**Toplu işlemler:** yok
**Bildirimler:** `GV.modal` iki akışta ("Müşteri Onayını İşaretle" / "Revizyon İstendi İşaretle"); modal içinde ikinci savunma hattı olarak `GV.perm.can('duzenle')` kontrolü ve yetkisizde `GV.toast('Bu kaydı düzenleme yetkiniz yok.','danger')`. `GV.notice` on beşten fazla yerde.
**Yetkilendirme:** `GV.perm.can('finans')` → zincirdeki tüm tutarlar maskelenir + `GV.notice(neutral, i-lock)` "Tutarlar gizli"; `GV.perm.can('duzenle')` → onay/revizyon butonları hiç basılmaz, yerine `GV.notice(neutral, i-lock)`. 403 kapısı yok.
**Boş durum:** `?id=` hatalıysa `GV.empty` "Teslim kaydı bulunamadı" + "Teslim listesi"; sekme içinde 4 ayrı `GV.empty`.
**Hata durumu:** `GV.errorState` **yok**.
**Mobil görünüm:** `mobile()` yok; `.is-mobilescroll`.
**Kabul kriterleri:**
- Zincir sekmesinde net (taksit `odeme`, fatura `tutar`), KDV (`vergi`) ve brüt (`toplam`, tahsilat) **ayrı kolonlarda** ve etiketli olmalı; aynı kolonda karışmamalı.
- Bir taksite birden fazla teslim bağlıysa ekran bunu uyarı olarak basmalı (`DB.deliveries[].milestone` tekil bağ kuralı).
- Kalite sekmesindeki "teslim anında açık hata" hesabı teslim tarihine göre yapılmalı, bugüne göre değil.

---

### `app-proje-teslim-form.html` — Teslim Formu

**Tip:** form
**Bölüm:** `SECTIONS.proje` (`data-screen="teslim"`); menüde yok, şuradan bağlanır: `app-proje-teslim.html` boş durum aksiyonu.
**Amaç:** Teslim kaydı açmak veya var olan teslimin durumunu, müşteri onayını, modül kapsamını ve taksit/koşum bağlarını düzenlemek.
**Kullanıcılar:** `proje` bölümü olan 17 rol + yazma kapısı (`ekle` / `duzenle`).
**Veri kaynağı:** `DB.deliveries` · `DB.projects` (`DB.proj`, `DB.projName`) · `DB.projectModules` (`DB.mod`, `DB.modName`) · `DB.milestones` · `DB.invoices` · `DB.contracts` · `DB.tests` · `DB.employees` · `DB.activities` · `DB.today`
**Üst özet kartları:** yok
**Sekmeler:** yok
**Arama:** yok
**Filtreler:** yok
**Tablo kolonları:** yok
**Form alanları:** `GV.form({ mount, id:'teslim', record, sections:bolumler(proje) })` — **6 bölüm**:
- **Teslim kimliği** — 3 alan; zorunlu: Teslim adı, Proje, Teslim tarihi
- **Durum ve müşteri onayı** — 3 alan; zorunlu: Teslim durumu, Müşteri onayı (Müşteri onay tarihi opsiyonel)
- **Sorumluluk ve not** — 2 alan; zorunlu: Teslim eden (Teslim notu `textarea` opsiyonel)
- **Kapsam — modüller** — seçili projenin modülleri kadar **checkbox**; hiçbiri işaretlenmezse kapsam proje ekseninde okunur (geçerli durum)
- **Bağlar** — 2 alan, ikisi de opsiyonel ama sıkı `validate`'li: **Karşılık gelen taksit** (aynı proje + bir taksite en fazla bir teslim) ve **Kabul test koşumu** (aynı proje + teslim onaylıysa koşum tamamlanmış olmalı)
- **Kayıt durumu** — 1 alan (`aktif` switch)
**Detay sekmeleri:** —
**İşlem butonları:** `GV.pageHead({eyebrow:'Proje Yönetimi', title: `<kod> · Düzenle` / `Yeni Teslim Kaydı`})`; aksiyonlar: Vazgeç · Kaydet / Değişiklikleri kaydet.
**Toplu işlemler:** yok
**Bildirimler:** `GV.toast('… seçimi temizlendi — yeni projeye ait değil','warn')`; kaydetmede üç standart toast. `GV.notice` — fatura bağlantısı, taksit ön seçimi, proje ön seçimi.
**Yetkilendirme:** `GV.perm.can('finans')` okunur (taksit tutar ipuçları için); `can = duzenle ? can('duzenle') : can('ekle')` false ise `GV.errorState` **403**.
**Boş durum:** `GV.empty` "Kayıt bulunamadı" + "Teslim listesi".
**Hata durumu:** `GV.errorState` **var** (403).
**Mobil görünüm:** `mobile()` yok.
**Kabul kriterleri:**
- Başka bir teslime zaten bağlı bir taksit seçilirse form kaydetmeyi reddetmeli ve hangi teslime bağlı olduğunu söylemeli.
- Teslim "Onaylandı" iken tamamlanmamış bir kabul koşumu seçilirse form kaydetmemeli.
- Proje değişince modül onay kutuları, taksit ve koşum seçenekleri yeniden kurulmalı; uymayan seçimler temizlenmeli.

---

### `app-gorev.html` — Görevler

**Tip:** liste
**Bölüm:** `SECTIONS.gorev` (eyebrow "İş Takibi", başlık "Görev ve İş Takibi"). Menüde **sekiz ayrı satır** aynı dosyayı gösterir: İş Havuzu (`?t=havuz`) · Bana Verilenler (`?t=bana`) · Verdiğim İşler (`?t=verdigim`) · Departman İşleri (`?t=departman`) · Onay Bekleyenler (`?t=onay`) · Kontrol Bekleyenler (`?t=kontrol`) · Gecikenler (`?t=geciken`) · Engellenenler (`?t=engel`). Ayrıca `SECTIONS.panel` içindeki **"Görevlerim"** (`app-gorev.html?t=bana`) de buraya gelir.
**Amaç:** Şirketin tüm görevlerini kişi, departman, proje ve durum eksenlerinde tek listede toplamak.
**Kullanıcılar:** `SEC_BY_ROLE`'da `gorev` bölümü olan **26 rol** — `musteri` dışındaki tüm roller.
**Veri kaynağı:** `DB.tasks` (kaynak) · `DB.projects` · `DB.customers` · `DB.departments` · `DB.employees` · `DB.sprints` · `DB.taskStatuses` · `DB.taskTypes` · `DB.priorities` · `DB.depName` / `DB.empName`
**Üst özet kartları:** `kpis[]` 4 — **Açık görev** · **Bana verilen** (`href` ile `?t=bana`) · **Geciken** (`href` `?t=geciken`) · **Havuzda bekleyen** (`href` `?t=havuz`)
**Sekmeler:** `tabs[]` **13 adet**, tamamı: İş Havuzu (`durum==='Havuzda'`) · Bana Verilenler (sorumlu ya da yardımcı ben + açık) · Verdiğim İşler (`veren` ya da `olusturan` ben) · Departman İşleri (`dep === myDep`) · Proje İşleri (`proje` dolu + açık) · Atama Bekleyenler (`durum==='Atama bekliyor'` ya da havuzda sorumlusuz) · Kabul Bekleyenler · Onay Bekleyenler · Kontrol Bekleyenler · Gecikenler (açık + termin geçmiş) · Engellenenler · Tamamlananlar · Arşivlenenler
**Arama:** `search.fields` = `kod · baslik · aciklama · proje · musteri · etiketler · tur`; `search.extra` **yok**
**Filtreler:** `durum` multi (`DB.taskStatuses`) · `tur` multi (`DB.taskTypes`) · `oncelik` multi (`DB.priorities`) · `sorumlu` select · `veren` select · `dep` multi (`DB.departments`) · `proje` select · `musteri` select · `sprint` select (`DB.sprints`) · `termin` daterange
**Tablo kolonları:** Görev (kilitli) · Proje / Müşteri · **Departman** *(gizli)* · Atayan → Sorumlu · Termin · Öncelik · **İlerleme** *(gizli)* · **Tahmini / Gerçek** *(gizli)* · **Revizyon** *(gizli)* · Durum
**Form alanları:** —
**Detay sekmeleri:** —
**İşlem butonları:** Sayfa başlığı **elle yazılmış HTML**'dir, `GV.pageHead` çağrılmaz — "Departman Talebi" (`app-istalebi.html`) ve "Görev Ver" (`app-gorev-form.html`). `rowActions[]` 3 — Detayı aç · Düzenle · **Üzerime al** (yalnız `Havuzda` durumunda çalışır, `GV.confirm` + sorumlu ataması).
**Toplu işlemler:** `bulk[]` 4 — Sorumlu ata · Öncelik değiştir · Dışa aktar · Arşivle (`confirm` metni var). **Dördünün de `run` yok**, yetki kapısı yok.
**Bildirimler:** `GV.toast('<kod> üzerinize alındı','ok')` ve "Bu görev havuzda değil, üzerinize alamazsınız." (`warn`). `GV.confirm` üzerine alma akışında.
**Yetkilendirme:** `GV.perm.can(...)` çağrısı **yok**. Kapsam, `GV.session.emp` ve `GV.session.dep` üzerinden sekme filtresiyle kurulur. Alan maskeleme ve 403 kapısı yok.
**Boş durum:** `emptyState` var — "Bu görünümde görev yok" + "Görev Ver".
**Hata durumu:** `GV.errorState` **yok**.
**Mobil görünüm:** `mobile(t)` var (başlık + öncelik, kod/tür, sorumlu ve tarih satırı, durum rozeti).
**Kabul kriterleri:**
- `?t=` parametresi `shell.js`'ten **önce** okunup `body[data-screen]`'e yazılmalı; sol menü vurgusu ile listenin aktif sekmesi aynı kalmalı. Parametresizse `havuz`.
- 13 sekmenin her biri kendi filtresini uygulamalı ve sayaçları veriden türetmeli.
- Kanban görünümü `DB.taskStatuses`'un tamamını değil, `kanban.columns`'taki 7 durumu basmalı.
**Bulgular:** Shell iskeleti elle yazılmış (**UID-15**) — `GV.pageHead` kullanılamıyor. Dört toplu işlemin hiçbirinde `run` yok; "Arşivle" onay metni gösterse de veriyi değiştirmez. Ayrıca menüdeki sekiz satır tek dosyayı gösterdiği için `SECTIONS.gorev`'de sekiz farklı `screen` anahtarı aynı ekrana düşer.

---

### `app-gorev-detay.html` — Görev Detayı

**Tip:** detay
**Bölüm:** `SECTIONS.gorev` (`data-screen="bana"` → "Bana Verilenler" satırı vurgulanır); menüde yok, şuradan bağlanır: `app-gorev.html`, `app-proje-detay.html`, `app-proje-hata.html` / `-detay`, `app-istalebi.html` / `-detay`, `app-sohbet.html`, `app-gorev-form.html`.
**Amaç:** Tek bir görevin tanımını, sorumluluk zincirini, kontrol listesini, bağımlılıklarını, zaman kayıtlarını ve onay akışını göstermek; durum/süre/onay aksiyonlarını yürütmek.
**Kullanıcılar:** `gorev` bölümü olan 26 rol (`musteri` hariç).
**Veri kaynağı:** `DB.tasks` · `DB.projects` · `DB.customers` · `DB.sprints` · `DB.projectModules` · `DB.subtasks` · `DB.taskDeps` · `DB.timelogs` · `DB.activities` · `DB.taskStatuses` · `DB.taskTransitions` · `DB.today` · `DB.emp` / `DB.empName` / `DB.depName`
**Üst özet kartları:** `kpis[]` yok; sağ panelde Özet · Proje · Son Hareket kartları.
**Sekmeler:** —
**Arama:** yok
**Filtreler:** yok
**Tablo kolonları:** yok
**Form alanları:** —
**Detay sekmeleri:** `GV.tabs('#recTabs')` ile **8 sekme**:
1. **Genel** — görev tanımı (açıklama, amaç, kabul kriterleri, beklenen/teslim edilen çıktı), sınıflandırma, sorumluluk (yedi kişi alanı), zaman ve efor, koşullu "Engel ve Riskler" bölümü
2. **Kontrol Listesi** — `DB.subtasks` onay kutuları; işaretlendikçe `t.ilerleme` ve ilerleme çubuğu **canlı** güncellenir
3. **Bağımlılıklar** — `DB.taskDeps` (iki yönlü okunur: `gorev` ya da `bagimli` bu görevse)
4. **Zaman Kayıtları** — `DB.timelogs` tablosu + toplam/tahmini sayacı + "Süre ekle" butonu
5. **Kontrol ve Onay** — `GV.chain` ile üç adımlı zincir (Sorumlu → Kontrol eden → Onaylayan) + revizyon sayaçları + **Onayla** / **Revize İste** butonları
6. **Dosyalar** — elle kurulmuş `.gv-upload` sürükle-bırak alanı ve `.gv-filelist`
7. **Yorumlar** — `.gv-comment` listesi + yorum formu (yorum koleksiyonu veride yok, ilk yorum görevin `amac` alanından üretilir)
8. **Aktivite Geçmişi** — `GV.activity(acts)`
**İşlem butonları:** `GV.pageHead` **çağrılmaz**; `.gv-rec-head > .ph-actions` elle basılır: **Durum Değiştir** (`#btnDurum`, `DB.taskTransitions` sözlüğünden izin verilen geçişler) · **Düzenle** (`app-gorev-form.html?id=`) · **Süre Ekle** (`#btnSure`). Sekme içinde `#btnSure2`, `#btnOnayla`, `#btnRevize`, `#btnYorum`.
**Toplu işlemler:** yok
**Bildirimler:** `GV.toast` — "`<kod>` durumu '…' olarak güncellendi", "N sa zaman kaydı eklendi", "Görev onaylandı", "Revizyon talebi gönderildi", "N / M madde tamamlandı", "Yorumunuz eklendi", "N dosya eklendi"; doğrulama uyarıları "Geçerli bir süre girin" · "Açıklama zorunludur" · "Revizyon notu zorunludur" · "Yorum boş olamaz" (`danger`). `GV.confirm` onaylamada, `GV.modal` durum/süre/revizyon akışlarında.
**Yetkilendirme:** `GV.perm.can(...)` çağrısı **yok**. Durum geçişi kısıtı `DB.taskTransitions` sözlüğünden gelir ve izin verilen roller yalnız **ipucu metni** olarak gösterilir, kapı olarak uygulanmaz. Alan maskeleme ve 403 kapısı yok.
**Boş durum:** `?id=` hatalıysa `GV.empty` "Görev bulunamadı" + "Görev listesine dön"; Kontrol Listesi, Bağımlılıklar ve Zaman Kayıtları sekmelerinde ayrı `GV.empty`.
**Hata durumu:** `GV.errorState` **yok**.
**Mobil görünüm:** `mobile()` yok; sekme tabloları `.gv-tablewrap` (bu ekranda `is-mobilescroll` **yok**, ≤760px'de tablo gizlenir ve mobil karşılığı üretilmez).
**Kabul kriterleri:**
- Durum değişikliği `DB.taskTransitions[t.durum].next` dışına çıkamamalı ve her değişiklik `DB.activities`'e eski→yeni değerle yazılmalı.
- Veri değiştiren her aksiyon `GV.refresh()` ile bitmeli; `location.reload()` kullanılmamalı (L-15).
- Kontrol listesi kutusu işaretlendiğinde ilerleme yüzdesi anında güncellenmeli.
**Bulgular:** Shell iskeleti elle yazılmış (**UID-15**). Sekme içi tablolar `.is-mobilescroll` taşımıyor — components.md §6'ya göre ≤760px'de `.gv-tablewrap` gizlenir, bu ekranda Zaman Kayıtları ve Bağımlılıklar sekmelerinin mobil karşılığı **üretilmemiş**. Zaman kaydı kodu `'ZMN-' + Math.floor(Math.random()*1e4)` ile rastgele üretiliyor; projedeki "en büyük numaradan +1" kuralına uymuyor.

---

### `app-gorev-form.html` — Görev Formu

**Tip:** form
**Bölüm:** `SECTIONS.gorev` (`data-screen`); menüde yok, şuradan bağlanır: `app-gorev.html` sayfa başlığı ("Görev Ver"), `rowActions.duzenle`, boş durum aksiyonu, `app-gorev-detay.html` "Düzenle".
**Amaç:** Görev açmak veya var olan görevin tanım, bağlam, sorumluluk, önceliklendirme, efor, kabul, engel ve durum alanlarını düzenlemek; alt görev ve bağımlılıklarını yönetmek.
**Kullanıcılar:** `gorev` bölümü olan 26 rol + yazma kapısı (`ekle` / `duzenle`).
**Veri kaynağı:** `DB.tasks` · `DB.subtasks` · `DB.taskDeps` · `DB.projects` · `DB.projectModules` · `DB.sprints` · `DB.customers` · `DB.departments` · `DB.employees` · `DB.tickets` · `DB.bugs` · `DB.taskTypes` · `DB.taskStatuses` · `DB.taskTransitions` · `DB.priorities` · `DB.impacts` · `DB.activities` · `DB.today`
**Üst özet kartları:** yok (üstte "Kayıt Özeti" kartı elle kurulur)
**Sekmeler:** yok
**Arama:** yok
**Filtreler:** yok
**Tablo kolonları:** yok (alt görev ve bağımlılık kartlarında `.gtable`)
**Form alanları:** `GV.form({ mount:'#formMount', id:'gorev', record:formRec, sections })` — **10 bölüm**:
- **Görev tanımı** — 5 alan; zorunlu: Görev başlığı, Görev türü, Ayrıntılı açıklama, Görev amacı (Etiketler opsiyonel)
- **Bağlam ve bağlar** — 6 alan; zorunlu: Sorumlu departman (Proje, Müşteri, Proje modülü, Sprint, Doğuran destek talebi opsiyonel)
- **Sorumluluk** — 4 alan; zorunlu: Görevi veren (Ana sorumlu, Kontrol eden, Onaylayan opsiyonel)
- **Yardımcı sorumlular** — çalışan sayısı kadar **checkbox** (çoklu seçim tipi bileşende yok)
- **İzleyiciler** — çalışan sayısı kadar **checkbox**
- **Önceliklendirme** — 3 alan; üçü de zorunlu: Öncelik, Etki seviyesi, Aciliyet (üç eksen ayrı ayrı seçilir, §5 eksen çakışması)
- **Zaman ve efor** — 6–7 alan; zorunlu: Termin tarihi, Tahmini süre. `canFinans` ise **Faturalandırılabilir süre** alanı 6. sıraya `splice` ile eklenir
- **Kabul ve çıktı** — 3 alan; zorunlu: Kabul kriterleri, Beklenen çıktı
- **Engel, gecikme ve tekrar** — 4 alan; zorunlu yok. "Tekrar sıklığı" yalnız tür `Tekrarlayan görev` ise zorunlu (`validate`)
- **Kayıt durumu** — 2 alan; zorunlu: Görev durumu (`DB.taskTransitions` geçiş kuralı `validate` ile uygulanır). `aktif` switch, gelen bağımlılık varsa arşivlemeyi engeller
**Detay sekmeleri:** —
**İşlem butonları:** `GV.pageHead({eyebrow:'İş Takibi', title: `<kod> · Düzenle` / `Yeni Görev`})`; aksiyonlar: Vazgeç (`app-gorev.html`) · **Kaydet / "Görevi oluştur"** (`run:kaydet`). Ayrıca form dışında iki kart: **Alt Görevler ve Kontrol Listesi** (`#altKart`, ekle/düzenle/sil) ve **Bağımlılıklar** (`#bagKart`, ekle/düzenle/sil), altta "Aktivite Geçmişi" kartı ve `#kaydetAlt` butonu.
**Toplu işlemler:** yok
**Bildirimler:** `GV.toast` — "Alt görev eklendi / güncellendi", "Bağımlılık eklendi / güncellendi", "Bağımlılık silindi", doğrulama uyarıları ("Alt görev başlığı zorunludur", "Karşı görev seçilmelidir", "İlişki türü seçilmelidir", "Görev kendine bağlanamaz", "Bu görevle aynı yönde bir bağımlılık zaten var"), kaydetmede üç standart toast. `GV.confirm` alt görev ve bağımlılık silmede (`tone:'danger'`). `GV.notice` — hata bağı bilgisi, proje/sprint ön seçimi, hatadan üretilen görev uyarısı.
**Yetkilendirme:** `GV.perm.can('finans')` → "Faturalandırılabilir süre" alanı **hiç basılmaz**; `can = duzenle ? can('duzenle') : can('ekle')` false ise `GV.errorState` **403** ve aksiyonlar "Görevlere dön" olur.
**Boş durum:** `GV.empty` "Kayıt bulunamadı" + "Görevlere dön"; alt görev ve bağımlılık kartlarında ayrı `GV.empty`.
**Hata durumu:** `GV.errorState` **var** (403).
**Mobil görünüm:** `mobile()` yok.
**Kabul kriterleri:**
- Durum değişikliği `DB.taskTransitions` sözlüğünde tanımlı olmayan bir hedefe gidemez; `validate` izin verilen geçişleri metinle söyler.
- Faturalandırılabilir süre, gerçekleşen süreyi aşamaz.
- Kendisine bağımlılık ve aynı yönde ikinci bağımlılık kaydı oluşturulamaz.
- Gelen bağımlılığı olan görev `aktif` kapatılarak arşive alınamaz.

---

### `app-istalebi.html` — Departmanlar Arası İş Talepleri

**Tip:** liste
**Bölüm:** `SECTIONS.gorev` → "İş Birliği" grubunda menü etiketi **"Departman Talepleri"**, `screen:'istalebi'`, sayaç `cnt:'istalebi'`
**Amaç:** Departmanların birbirine gönderdiği yapılandırılmış iş taleplerini akış, sorumlu, onay ve termin ekseninde izlemek.
**Kullanıcılar:** `gorev` bölümü olan 26 rol (`musteri` hariç).
**Veri kaynağı:** `DB.deptRequests` (kaynak) · `DB.departments` (`DB.dep`, `DB.depName`) · `DB.tasks` · `DB.priorities` · `DB.today` · `DB.empName`
**Üst özet kartları:** `kpis[]` 4 — **Açık talep** · **Bana gelen** (`sorumlu === me` + açık) · **Departmanıma gelen** (`talepEdilenDep === myDep` + açık, `tone:'purple'`) · **Geciken**
**Sekmeler:** `tabs[]` 8 — Açık Talepler · Bana Gelenler · Benim Taleplerim · Departmanıma Gelenler · Onay Bekleyenler (`onay === 'Bekliyor'`) · Gecikenler · Tamamlananlar · Tümü
**Arama:** `search.fields` = `kod · baslik · aciklama · tur · beklenenCikti`; `search.extra` **yok**
**Filtreler:** `durum` multi (3 değer) · `tur` multi (6 sabit talep türü) · `talepEdenDep` multi (`DB.departments`) · `talepEdilenDep` multi · `oncelik` multi (`DB.priorities`) · `termin` daterange
**Tablo kolonları:** Talep (kilitli) · Talep türü · Departman akışı · Talep eden · Sorumlu · **Beklenen çıktı** *(gizli)* · **Kabul kriteri** *(gizli)* · Öncelik · Termin · Onay · Durum
**Form alanları:** —
**Detay sekmeleri:** —
**İşlem butonları:** `GV.pageHead({eyebrow:'İş Takibi', title:'Departmanlar Arası İş Talepleri'})` aksiyonları: "Görevler" · "Yeni Talep" (`btn-acc`, `app-istalebi-form.html`). `rowActions[]` 3 — Talebi aç · **Talebi kabul et** (yalnız `Bekliyor` durumunda çalışır; sorumluyu `me` yapar, `onay='Onaylandı'`) · **Göreve dönüştür** (`GV.confirm` sonrası `DB.tasks.unshift` + `x.gorev = kod`, tek yönlü bağ).
**Toplu işlemler:** `bulk[]` 2 — Sorumlu ata · Dışa aktar. **İkisinin de `run` yok**, yetki kapısı yok.
**Bildirimler:** `GV.toast('<kod> kabul edildi','ok')` ve "Bu talep zaten işleme alınmış." (`info`). `GV.confirm` iki satır aksiyonunda. `GV.result(tone:'ok')` görev oluşturulduğunda ("Görevi aç" / "Kapat").
**Yetkilendirme:** `GV.perm.can(...)` çağrısı **yok**; kapsam `GV.session.emp` / `GV.session.dep` ile sekme filtresinden gelir. 403 kapısı yok.
**Boş durum:** `emptyState` var — "Bu görünümde talep yok" + "Yeni Talep".
**Hata durumu:** `GV.errorState` **yok**.
**Mobil görünüm:** `mobile(x)` var (başlık + öncelik, kod/tür, departman akışı, durum + termin).
**Kabul kriterleri:**
- Talepten üretilen görev kodu, mevcut **en büyük** `GRV-yyyy-N` değerinden türetilmeli (dizi uzunluğundan değil).
- Bağ yalnız talepte tutulmalı (`x.gorev`); görev kaydında ayna alan açılmamalı (§9d yön kuralı).
**Bulgular:** İki toplu işlemin de `run`'ı yok. "Göreve dönüştür" aksiyonu yetki kapısı taşımıyor — aynı işi yapan `app-istalebi-detay.html` `GV.perm.can('ekle')` ile kapatıyor, liste ekranı kapatmıyor.

---

### `app-istalebi-detay.html` — İş Talebi Detayı

**Tip:** detay
**Bölüm:** `SECTIONS.gorev` (`data-screen="istalebi"`); menüde yok, şuradan bağlanır: `app-istalebi.html` kolon/kart/kanban/mobil bağlantıları.
**Amaç:** Bir departmanlar arası iş talebinin kabul kararını, ürettiği görevi, hedef departmanın yükünü ve proje/müşteri bağlamını göstermek.
**Kullanıcılar:** `gorev` bölümü olan 26 rol; aksiyonlar için `GV.perm.can('onay')` (kabul/red) ve `GV.perm.can('ekle')` (göreve dönüştür).
**Veri kaynağı:** `DB.deptRequests` · `DB.departments` (`DB.dep`, `DB.depName`) · `DB.employees` · `DB.tasks` (`DB.task`) · `DB.projects` (`DB.proj`, `DB.projName`) · `DB.customers` · `DB.approvals` · `DB.activities` · `DB.priorities` · `DB.impacts` · `DB.taskTypes` · `DB.today`
**Üst özet kartları:** `kpis[]` yok; sağ panelde `.gv-summary` özetleri.
**Sekmeler:** —
**Arama:** yok
**Filtreler:** yok
**Tablo kolonları:** yok
**Form alanları:** —
**Detay sekmeleri:** `GV.tabs('#recTabs')` ile **6 sekme**:
1. **Genel** — talep kimliği, departman akışı, tarihler ve süre, kapsam ve beklenen çıktı; "kayıtta ayrı bir gerekçe alanı yok" notu
2. **Kabul Akışı** — duruma göre dört farklı `GV.notice` (reddedildi / karar bekliyor / kabul edildi ve tamamlandı / kabul edildi), kabul kararı künyesi, `DB.approvals` kuyruğu kaydı, **Talebi kabul et** / **Reddet** butonları
3. **Üretilen Görev** — `DB.deptRequests[].gorev` yazılı bağı; yoksa **Göreve dönüştür** butonu, varsa görev künyesi; "bağ yalnız yazılı alandan okunur" notu
4. **Hedef Departman Yükü** — hedef departmanın açık görevleri ve o departmana gelen diğer talepler; gecikmiş iş varsa `GV.notice(warn)`
5. **İlgili Proje** — bağlı proje künyesi ve talebin projedeki yeri; bağlı müşteri bölümü; proje yoksa `GV.empty`
6. **Aktivite Geçmişi** — `GV.activity(acts)` veya `GV.empty`
**İşlem butonları:** `GV.pageHead({eyebrow:'Görevler', title:'İş Talebi Detayı', sub:'<kaynak dep> → <hedef dep> · <başlık>'})`; aksiyonlar: "İş talebi listesi" · "Görev havuzu" · **"Üretilen görevi aç"** (yalnız bağ varsa, `btn-acc`). Sekme içi `#btnKabul`, `#btnRed`, `#btnDonustur` — yetki ve durum koşuluna göre basılır.
**Toplu işlemler:** yok
**Bildirimler:** `GV.modal` üç akışta (kabul / red / göreve dönüştür); `GV.result(tone:'ok')` görev oluşturulduğunda ("Görevi aç" / "Talepte kal"); `GV.notice` on beşten fazla yerde.
**Yetkilendirme:** `yetkiOnay = GV.perm.can('onay')` → kabul/red butonları yoksa `GV.notice(neutral, i-lock)` "Kabul kararı yetkisi yok"; `yetkiEkle = GV.perm.can('ekle')` → "Göreve dönüştür" butonu hiç basılmaz. 403 kapısı yok, alan maskeleme yok.
**Boş durum:** `?id=` hatalıysa `GV.empty` "İş talebi bulunamadı" + "İş talebi listesi"; sekme içinde 5 ayrı `GV.empty`.
**Hata durumu:** `GV.errorState` **yok**.
**Mobil görünüm:** `mobile()` yok; `.is-mobilescroll`.
**Kabul kriterleri:**
- Kabul kararı `durum`'u değil `onay` eksenini de güncellemeli ve varsa `DB.approvals` adımına yansımalı.
- Red kararı gerekçe olmadan kaydedilememeli.
- Bağ yalnız `r.gorev` alanında tutulmalı; hedef görevde ayna alan açılmamalı.

---

### `app-istalebi-form.html` — İş Talebi Formu

**Tip:** form
**Bölüm:** `SECTIONS.gorev` (`data-screen="istalebi"`); menüde yok, şuradan bağlanır: `app-istalebi.html` sayfa başlığı ve boş durum aksiyonu.
**Amaç:** Departmanlar arası iş talebi açmak veya var olan talebin akışını, kapsamını, tarihlerini ve kabul kararını düzenlemek.
**Kullanıcılar:** `gorev` bölümü olan 26 rol + yazma kapısı (`ekle` / `duzenle`); kabul kararı bölümü için ayrıca `GV.perm.can('onay')`.
**Veri kaynağı:** `DB.deptRequests` · `DB.departments` (`DB.dep`, `DB.depName`) · `DB.employees` · `DB.projects` (`DB.proj`, `DB.projName`) · `DB.customers` · `DB.tasks` (`DB.task`) · `DB.priorities` · `DB.impacts` · `DB.activities` · `DB.today`
**Üst özet kartları:** yok
**Sekmeler:** yok
**Arama:** yok
**Filtreler:** yok
**Tablo kolonları:** yok
**Form alanları:** `GV.form({ mount, id:'istalebi', record, sections })` — **5 sabit + 2 koşullu bölüm**:
- **Talep kimliği** — 4 alan; hepsi zorunlu: Talep konusu, Talep türü, Öncelik, Açıklama
- **Departman akışı** — 4 alan; kaynak departman, hedef departman, talep eden kişi, sorumlu (kişi seçenekleri seçilen departmana göre daralır)
- **Kapsam ve beklenen çıktı** — 4 alan; zorunlu: Beklenen çıktı, Kabul kriteri (Bağlı proje, Bağlı müşteri opsiyonel)
- **Tarihler** — 3 alan; zorunlu: Talep tarihi, İstenen termin (Tamamlanma tarihi opsiyonel)
- **İş durumu** — 2 alan; zorunlu: İş durumu (`aktif` switch opsiyonel)
- **Kabul kararı** *(yalnız `canOnay`)* — 3 alan: Kabul / onay durumu, Red tarihi, Red gerekçesi
- **Göreve dönüşüm bağı** *(koşullu)* — 1 alan: Üretilen görev
**Detay sekmeleri:** —
**İşlem butonları:** `GV.pageHead({eyebrow:'İş Takibi', title: `<kod> · Düzenle` / `Yeni İş Talebi`})`; aksiyonlar: Vazgeç · Kaydet / Değişiklikleri kaydet.
**Toplu işlemler:** yok
**Bildirimler:** `GV.toast('N alan temizlendi — seçim yeni kaynak/hedef departmanla uyumlu değil','warn')`; kaydetmede üç standart toast. `GV.notice` — iş talepleri bağlantısı, yetki yoksa "Kabul kararı alanları basılmadı".
**Yetkilendirme:** `GV.perm.can('onay')` → "Kabul kararı" bölümü hiç basılmaz + `GV.notice(neutral, i-lock)`; `can` false ise `GV.errorState` **403** ve aksiyon "Talep listesine dön".
**Boş durum:** `GV.empty` "Kayıt bulunamadı" + "İş talepleri".
**Hata durumu:** `GV.errorState` **var** (403).
**Mobil görünüm:** `mobile()` yok.
**Kabul kriterleri:**
- Kaynak veya hedef departman değiştiğinde o departmana ait olmayan kişi seçimleri temizlenmeli ve kaç alanın düştüğü söylenmeli.
- Onay yetkisi olmayan rolde "Kabul kararı" alanları DOM'da bulunmamalı.

---

### `app-destek.html` — Destek Talepleri

**Tip:** liste
**Bölüm:** `SECTIONS.destek` (eyebrow "Servis", başlık "Destek ve Bakım") → menü etiketi **"Destek Talepleri"**, `screen:'destek'`, sayaç `cnt:'destek'`
**Amaç:** Müşteri destek taleplerini kategori, öncelik, SLA durumu, müdahale süresi ve memnuniyetle tek listede izlemek.
**Kullanıcılar:** `SEC_BY_ROLE`'da `destek` bölümü olan **12 rol**: `sahip · genelmudur · sistem · operasyon · depmudur · musteritems · pm · takimlideri · qa · devops · destek · musteri`
**Veri kaynağı:** `DB.tickets` (kaynak) · `DB.customers` · `DB.employees` · `DB.priorities` · `DB.empName`
**Üst özet kartları:** `kpis[]` 4 — **Açık destek kaydı** · **SLA riski** (`slaDurum === 'Risk altında'`) · **Ortalama müdahale** (dk) · **Memnuniyet** (ortalama, 5 üzerinden)
**Sekmeler:** `tabs[]` 9 — Açık Kayıtlar · Yeni · Devam Eden · Müşteri Bekleniyor · SLA Riski · Hata Bildirimleri · Geliştirme Talepleri · Kapananlar · Tümü
**Arama:** `search.fields` = `kod · baslik · musteriAd · kategori · acan`; `search.extra` **yok**
**Filtreler:** `durum` multi (5 değer) · `kategori` multi (4 değer) · `oncelik` multi (`DB.priorities`) · `musteri` select · `sorumlu` select · `slaDurum` select (Zamanında / Risk altında) · `ucretli` select (`test` ile yalnız ücretli)
**Tablo kolonları:** Destek kaydı (kilitli) · Müşteri · **Kategori** *(gizli)* · Öncelik · **Etki** *(gizli)* · SLA · Müdahale · Sorumlu · **Harcanan** *(gizli)* · **Ücretlendirme** *(gizli)* · Memnuniyet · Açılış · Durum
**Form alanları:** —
**Detay sekmeleri:** —
**İşlem butonları:** `GV.pageHead({eyebrow:'Destek ve Bakım', title:'Destek Talepleri'})` aksiyonları: "SLA Takibi" · "Yeni Destek Kaydı" (`btn-acc`). `rowActions[]` 3 — Kaydı aç · **Dönüştür** (`GV.modal` içinde 5 seçenekli radyo: Görev / Hata kaydı / Geliştirme talebi / Değişiklik talebi / Ek teklif) · **Kaydı kapat** (`GV.confirm` sonrası `durum = 'Kapandı'`).
**Toplu işlemler:** `bulk[]` 2 — Sorumlu ata · Dışa aktar. **İkisinin de `run` yok**, yetki kapısı yok.
**Bildirimler:** `GV.toast('<kod> → <hedef> olarak oluşturuldu','ok')` ve "`<kod>` kapatıldı" (`ok`), "Bu kayıt zaten kapalı." (`info`). `GV.modal` dönüştürmede, `GV.confirm` kapatmada.
**Yetkilendirme:** `GV.perm.can(...)` çağrısı **yok**. Alan maskeleme ve 403 kapısı yok — `musteri` rolü de bu ekranı görebiliyor ve tüm müşterilerin taleplerini listeliyor.
**Boş durum:** `emptyState` var — "Bu görünümde destek kaydı yok" + "Yeni Destek Kaydı".
**Hata durumu:** `GV.errorState` **yok**.
**Mobil görünüm:** `mobile(x)` var (başlık + öncelik, kod/müşteri, SLA satırı, durum rozeti).
**Kabul kriterleri:**
- SLA kolonu hem etiketi (`x.sla`) hem durumu (`x.slaDurum`) taşımalı; çıktı dosyasında ikisi birlikte yazılmalı.
- Satır vurgusu yalnız **açık ve risk altındaki** kayıtlarda basılmalı.
**Bulgular:** "Dönüştür" aksiyonu yalnız `GV.toast` basıyor — gerçekten kayıt üretmiyor; aynı işi `app-destek-detay.html` `DB.tasks.unshift` ile gerçekten yapıyor. `SEC_BY_ROLE`'da `musteri` rolü bu bölümü görüyor ama ekranda müşteri kapsamı daraltması (yalnız kendi talepleri) **yok**.

---

### `app-destek-detay.html` — Destek Talebi Detayı

**Tip:** detay
**Bölüm:** `SECTIONS.destek` (`data-screen="destek"`); menüde yok, şuradan bağlanır: `app-destek.html` kolon/kart/kanban/mobil bağlantıları.
**Amaç:** Bir destek talebinin SLA hesabını, bağlı bakım paketini, memnuniyet anketini ve ürettiği kayıtları tek yerde göstermek.
**Kullanıcılar:** `destek` bölümü olan 12 rol; göreve dönüştürme için `GV.perm.can('ekle')`.
**Veri kaynağı:** `DB.tickets` · `DB.customers` · `DB.contacts` · `DB.projects` (`DB.proj`) · `DB.contracts` · `DB.slaPolicies` · `DB.supportPackages` · `DB.surveys` · `DB.tasks` · `DB.bugs` · `DB.changeRequests` · `DB.employees` · `DB.activities` · `DB.priorities` · `DB.impacts` · `DB.taskTypes` · `DB.today`
**Üst özet kartları:** `kpis[]` yok; sağ panelde `.gv-summary` özetleri.
**Sekmeler:** —
**Arama:** yok
**Filtreler:** yok
**Tablo kolonları:** yok
**Form alanları:** —
**Detay sekmeleri:** `GV.tabs('#recTabs')` ile **6 sekme**:
1. **Genel** — "talep gövdesi ayrı tutulmuyor" notu, talep kimliği, müşteri ve bağlam, zaman çizelgesi, SLA ve bakım, memnuniyet özeti
2. **SLA** — eşleşen `DB.slaPolicies` kaydı, ilk yanıt ekseni, çözüm ekseni ve **iki eksenin kötüsü**; kayıtlı `slaDurum` hesapla uyuşmazsa `GV.notice(warn)`; politika eşleşmezse `GV.empty`
3. **Bakım Paketi** — `DB.supportPackages` kaydı, kota kullanımı, yenileme ve sözleşme; kota değerleri uyuşmazsa uyarı; paket yoksa `GV.empty`
4. **Memnuniyet** — `DB.surveys` kaydı; anket puanı talep kartıyla eşleşmezse `GV.notice(warn)`; yanıt bekliyorsa ayrı not; anket yoksa `GV.empty`
5. **Dönüşümler** — `DB.tasks[].destek`, `DB.bugs[].destek`, `DB.changeRequests[].destek` yazılı bağlarından üretilen kayıtlar; hiçbiri yoksa `GV.empty` + "Göreve dönüştür" butonu; bağ varsa `GV.notice(tone:'ok')` "Bağ veride yazılı"
6. **Aktivite Geçmişi** — `GV.activity(acts)` veya `GV.empty`
**İşlem butonları:** `GV.pageHead({eyebrow:'Destek ve Bakım', title:'Destek Talebi Detayı', sub:'<kod> · <müşteri> · <kategori>'})`; aksiyonlar: "Destek listesi" · "SLA takibi" · **"Göreve dönüştür"** (yalnız `canEkle`, `btn-acc`, `run:donusturModal`). Sekme içi `#btnDonusturBos`.
**Toplu işlemler:** yok
**Bildirimler:** `GV.modal` "Talebi Göreve Dönüştür" (görev alanları + `GV.notice(info)` "Görev talebe `destek` alanıyla bağlanır"); `GV.result(tone:'ok')` "Görev oluşturuldu" ("Görevi aç" / "Dönüşümleri gör"); on beşten fazla `GV.notice`.
**Yetkilendirme:** `canFinans = GV.perm.can('finans')` → bakım paketi tutarları `••••••` + `GV.notice(neutral, i-lock)` "Tutarlar gizli"; `canEkle = GV.perm.can('ekle')` → dönüştürme butonu hiç basılmaz. 403 kapısı yok.
**Boş durum:** `?id=` hatalıysa `GV.empty` "Destek talebi bulunamadı" + "Destek listesi"; sekme içinde 5 ayrı `GV.empty`.
**Hata durumu:** `GV.errorState` **yok**.
**Mobil görünüm:** `mobile()` yok; `.is-mobilescroll`.
**Kabul kriterleri:**
- SLA sekmesi ilk yanıt ve çözüm eksenlerini **ayrı ayrı** gösterip genel durumu ikisinin kötüsünden türetmeli (§9 sözleşmesi).
- Bakım paketi kota aritmetiği `kullanilan + kalan = aylikSaat × dönem ayı` (gün düzeltmeli) formülüyle doğrulanmalı.
- Anket puanı ile `DB.tickets[].memnuniyet` farklıysa ekran bunu uyarı olarak basmalı.

---

### `app-destek-form.html` — Destek Kaydı Formu

**Tip:** form
**Bölüm:** `SECTIONS.destek` (`data-screen="destek"`); menüde yok, şuradan bağlanır: `app-destek.html` sayfa başlığı ve boş durum aksiyonu.
**Amaç:** Destek talebi açmak veya var olan talebin bağlam, SLA ekseni, zaman ve ücretlendirme alanlarını düzenlemek.
**Kullanıcılar:** `destek` bölümü olan 12 rol + yazma kapısı (`ekle` / `duzenle`).
**Veri kaynağı:** `DB.tickets` · `DB.customers` · `DB.contacts` · `DB.projects` (`DB.projName`) · `DB.slaPolicies` · `DB.supportPackages` · `DB.surveys` · `DB.tasks` · `DB.bugs` · `DB.changeRequests` · `DB.employees` · `DB.priorities` · `DB.impacts` · `DB.activities` · `DB.today`
**Üst özet kartları:** yok
**Sekmeler:** yok
**Arama:** yok
**Filtreler:** yok
**Tablo kolonları:** yok
**Form alanları:** `GV.form({ mount, id:'destek', record, sections })` — **4 bölüm**:
- **Talep sahibi ve bağlam** — 4 alan; zorunlu: Müşteri, Talebi açan yetkili, Destek sorumlusu (İlgili proje opsiyonel; proje ve yetkili seçenekleri müşteriden türetilir)
- **Talep içeriği ve SLA ekseni** — 4 alan; hepsi zorunlu: Talep başlığı, Talep kategorisi, Öncelik, Etki seviyesi. Kategori × öncelik eşleşmesi `DB.slaPolicies`'ten SLA etiketini üretir
- **Zaman ekseni** — 6 alan; zorunlu: Açılış tarihi, Açılış saati (İlk yanıt tarihi/saati, Çözüm süresi (dakika), Harcanan süre (saat) opsiyonel)
- **Durum ve ücretlendirme** — 3 alan; zorunlu: Talep durumu (Ücretlendirme `checkbox`, `aktif` switch opsiyonel)
**Detay sekmeleri:** —
**İşlem butonları:** `GV.pageHead({eyebrow:'Destek ve Bakım', title: `<kod> · Düzenle` / `Yeni Destek Kaydı`})`; aksiyonlar: Vazgeç (`app-destek.html`) · Kaydet / Değişiklikleri kaydet.
**Toplu işlemler:** yok
**Bildirimler:** `GV.toast('Seçilen kategori ve öncelik için SLA politikası yok — kayıt açılamaz','danger')`, "`<kod>` oluşturuldu · SLA `<etiket>`" (`ok`), "Değişiklik yok…" / "… güncellendi". `GV.notice` — SLA politikaları bağlantısı, müşteri ön seçimi, bakım paketi kotası ("Kota bu formdan değiştirilmez"), memnuniyet anketi bağlantısı.
**Yetkilendirme:** `GV.perm.can('finans')` okunur (ücretlendirme/kota bilgisi için); `can = duzenle ? can('duzenle') : can('ekle')` false ise `GV.errorState` **403** ve aksiyon "Destek listesine dön".
**Boş durum:** `GV.empty` "Kayıt bulunamadı" + "Destek listesine dön".
**Hata durumu:** `GV.errorState` **var** (403).
**Mobil görünüm:** `mobile()` yok.
**Kabul kriterleri:**
- Kategori × öncelik kombinasyonu `DB.slaPolicies`'te karşılık bulmuyorsa kayıt açılmamalı; SLA etiketi elle yazılamaz, politikadan türetilmeli.
- Müşteri değişince proje ve yetkili seçenekleri yeniden kurulmalı.
- Açılış saati serbest metin alanıdır (`type:'text'`); bileşende saat tipi olmadığı için `validate` ile biçim kontrolü yapılır.

---

### `app-destek-sla.html` — SLA Takibi

**Tip:** liste (SLA türetmesiyle zenginleştirilmiş)
**Bölüm:** `SECTIONS.destek` → menü etiketi **"SLA Takibi"**, `screen:'sla'`
**Amaç:** Destek taleplerinin ilk yanıt ve çözüm hedeflerine göre tüketim, kalan süre ve ihlal durumunu izlemek; eskalasyon başlatmak.
**Kullanıcılar:** `destek` bölümü olan 12 rol; eskalasyon ve atama için `GV.perm.can('duzenle')`.
**Veri kaynağı:** `DB.tickets` (kaynak) · `DB.slaPolicies` · `DB.customers` · `DB.employees` · `DB.priorities` · `DB.today` · `DB.empName`. SLA değerleri kaynak kayıt **değiştirilmeden** satır üstünde `S(x)` ile türetilir ve `_cache`'lenir.
**Üst özet kartları:** `kpis[]` **5** — Açık talep · SLA riski altında · İhlal edilen · İlk yanıt tutturma (%) · Ortalama ilk yanıt (dakika → "3 sa 12 dk" biçimlemesi)
**Sekmeler:** `tabs[]` 5 — Tümü · Risk Altında · İhlal Edildi · Zamanında · Kapananlar
**Arama:** `search.fields` = `kod · baslik · musteriAd · kategori · acan`; `search.extra` = sorumlunun adı
**Filtreler:** `kategori` multi (`DB.slaPolicies`'ten türetilen) · `oncelik` multi (`DB.priorities`) · `etki` multi (veride geçenler) · `slaDurum` select (3 değer, `test` ile türetilmiş duruma bakar) · `yanit` select (Tutturuldu / Aşıldı / Yanıt bekliyor, `test`) · `sorumlu` select · `musteri` select · `acilis` daterange
**Tablo kolonları:** Talep (kilitli) · Müşteri · Başlık · **Kategori** *(gizli)* · Öncelik · Etki · SLA hedefi · İlk yanıt · Çözüm / geçen süre · Kalan / aşım · **Hedef tüketimi** *(gizli)* · Sorumlu · SLA durumu · **Açılış** *(gizli)* · Talep durumu
**Form alanları:** —
**Detay sekmeleri:** —
**İşlem butonları:** `GV.pageHead({eyebrow:'Destek ve Bakım', title:'SLA Takibi', sub:…})` aksiyonları: **"SLA Politikaları"** (`run:politikaDrawer` — `GV.drawer` içinde kategori × öncelik matrisi, salt okunur) · "Destek Talepleri". `rowActions[]` — her zaman "Talebi aç"; `canDuzenle` ise ek olarak **Eskalasyon başlat** (`GV.confirm(tone:'danger')`, politikanın eskalasyon kuralını gösterir) ve **Sorumluyu değiştir** (`GV.modal` + select).
**Toplu işlemler:** `bulk[]` koşullu kurulur — `canDuzenle` ise **Seçilenleri eskale et** (`confirm` + `run`) ve **Sorumlu ata** (`run`, modal + `L.refresh()`); her rolde **Dışa aktar**.
**Bildirimler:** `GV.toast` — "`<kod>` eskalasyona alındı, sorumlu yöneticiye bildirim gönderildi" (`ok`), "N talep eskalasyona alındı · M kapalı talep atlandı", "Kapanmış talep için eskalasyon başlatılmaz." (`info`), "`<kod>` → `<kişi>` kişisine atandı" (`ok`), "N talep `<kişi>` kişisine atandı". `GV.notice(tone:'info')` sayfanın başında **"SLA hesap tabanı"** kutusu (`#slaNot`). `GV.drawer` politika panelinde.
**Yetkilendirme:** `canDuzenle = GV.perm.can('duzenle')` → eskalasyon ve atama aksiyonları ile ilgili toplu işlemler **hiç kurulmaz** (ölü buton yok). Finans maskesi yok, 403 kapısı yok.
**Boş durum:** `emptyState` var — "Bu görünümde SLA kaydı yok" + "Destek Taleplerine Git".
**Hata durumu:** `GV.errorState` **yok**.
**Mobil görünüm:** `mobile(x)` var (başlık + öncelik, kod/müşteri, hedef & ilk yanıt & belirleyen eksen satırı, SLA durumu + talep durumu + kalan/aşım).
**Kabul kriterleri:**
- Genel SLA durumu **iki eksenin kötüsü** olmalı: her eksende tüketim ≥ %100 ihlal, ≥ %75 risk, altı zamanında.
- Açık talepte geçen süre `DB.today` gününün **başlangıcına** göre takvim dakikası olarak ölçülmeli.
- Politika eşleşmeyen satır "Politika eşleşmedi" yazmalı, uydurma hedef göstermemeli.
**Bulgular:** Talep bağlantıları `app-destek-detay.html?id=` yerine `app-destek.html?q=<kod>` (filtreli liste) hedefine gider — bu bölümde detay ekranı olmasına rağmen SLA ekranı listeye döner. Ekranda `GV.notice` ile açıkça belirtildiği gibi çalışma saati kısıtı (mesai içi / 7-24) hesaba katılmaz, `calismaSaati` alanı yalnız gösterilir.

---

### `app-destek-paket.html` — Bakım Paketleri

**Tip:** liste
**Bölüm:** `SECTIONS.destek` → menü etiketi **"Bakım Paketleri"**, `screen:'paket'`
**Amaç:** Müşteri bakım sözleşmelerini saat kotası, tüketim oranı, dönem sonu ve yenileme durumuyla izlemek.
**Kullanıcılar:** `destek` bölümü olan 12 rol; yenileme ve işaretleme için `GV.perm.can('duzenle')`.
**Veri kaynağı:** `DB.supportPackages` (kaynak) · `DB.customers` · `DB.tickets`. Kaynak veri **değiştirilmez**, türetmeler satır üstünde yapılır.
**Üst özet kartları:** `kpis[]` **5** — Aktif bakım paketi · **Yıllık paket geliri** (dönem bedeli 12 aya normalize, meta'sıyla) · Kotası kritik (≥ %80) · Yenilemesi yaklaşan (60 gün) · Toplam kalan saat
**Sekmeler:** `tabs[]` 5 — Tümü · Aktif · Kota Kritik · Yenilemesi Yaklaşan · Süresi Dolmuş
**Arama:** `search.fields` = `kod · ad · musteri · sozlesme · durum`; `search.extra` = müşterinin `unvan` + `kisa` adı
**Filtreler:** `musteri` select · `ad` multi (veriden türetilen paket adları) · `durum` multi (veriden türetilen) · `bitis` daterange · `yenileme` select (Yenilenecek / İşaretsiz, `test`) · `sozlesmeBag` select (Sözleşmeye bağlı / Sözleşmesiz, `test`) · `tuketimEsik` select (4 eşik, `test`)
**Tablo kolonları:** Paket (kilitli) · Müşteri · Sözleşme · **Paket adı** *(gizli)* · Aylık saat · Toplam kota · Kullanılan · Kalan · Tüketim · **Açık talep** *(gizli)* · **Dönemde harcanan** *(gizli)* · Başlangıç · Bitiş · Kalan gün · Paket bedeli · **Saat başı bedel** *(gizli)* · **Yıllık gelir** *(gizli)* · Durum
**Form alanları:** —
**Detay sekmeleri:** —
**İşlem butonları:** `GV.pageHead({eyebrow:'Destek ve Bakım', title:'Bakım Paketleri', sub:…})` aksiyonları: "Destek Talepleri" · "Yeni Bakım Paketi" (`btn-acc`). `rowActions[]` 4 — Müşteriyi aç · Talepleri gör (`app-destek.html?t=tumu&f_musteri=`) · Sözleşmeyi aç (`href` sözleşmesizde `null` döner, `run` devreye girip müşterinin sözleşmelerine götürür) · **Paketi yenile** (`GV.confirm`, `duzenle` kapısı, dönemi bir yıl uzatır ve yenileme işaretini kapatır).
**Toplu işlemler:** `bulk[]` 2 — **Yenilemeye işaretle** (`confirm` + `run`, `duzenle` kapısı, zaten işaretlileri atlar) · Dışa aktar.
**Bildirimler:** `GV.toast` — "`<kod>` bir sözleşme kaydına bağlı değil — müşterinin sözleşmeleri açılıyor." (`info`), "`<kod>` bir yıl yenilendi" (`ok`), "N paket yenilemeye işaretlendi · M kayıt zaten işaretliydi", "Seçili paketlerin tamamı zaten yenilemeye işaretli" (`info`), yetkisizde "Bakım paketi güncelleme yetkiniz yok." (`danger`). `GV.confirm` yenilemede.
**Yetkilendirme:** `canFinans = GV.perm.can('finans')` → paket bedeli, saat başı bedel, yıllık gelir maskelenir ve KPI `••••••` gösterir; `GV.perm.can('duzenle')` yenileme ve işaretlemede. 403 kapısı yok.
**Boş durum:** `emptyState` var — "Bu görünümde bakım paketi yok" + "Destek Taleplerine Git".
**Hata durumu:** `GV.errorState` **yok**.
**Mobil görünüm:** `mobile(p)` var (müşteri + bedel, kod/paket adı, kalan-kota ve tüketim satırı, durum + yenileme rozeti + kalan süre).
**Kabul kriterleri:**
- Dönem ayı hesabı **gün düzeltmeli** olmalı: `(yılFarkı × 12) + ayFarkı + (bitişGünü >= başlangıçGünü ? 1 : 0)` — naif ay farkı 7 paketin 5'ini saptırır.
- Kota aritmetiği `kullanilan + kalan = aylikSaat × dönem ayı` denkliğini korumalı.
- Finans yetkisi olmayan rolde üç para kolonu ve "Yıllık paket geliri" KPI'ı hiçbir rakam sızdırmamalı.
**Bulgular:** "Sözleşmeyi aç" aksiyonunun yanındaki yorum "rowActions koşullu gizlemeyi desteklemiyor" diyor ve bu yüzden `href`+`run` çiftiyle bir kaçış kurulmuş. Oysa components.md §2'de `rowActions[].show(row)` sözleşmesi tanımlı ve aynı dosyada başka ekranlar (`app-proje-milestone.html`, `app-proje-teslim.html`) bunu kullanıyor — yorum eskimiş, aksiyon `show:function(p){ return !!p.sozlesme; }` ile sadeleştirilebilir.

---

### `app-destek-paket-form.html` — Bakım Paketi Formu

**Tip:** form
**Bölüm:** `SECTIONS.destek` (`data-screen="paket"`); menüde yok, şuradan bağlanır: `app-destek-paket.html` sayfa başlığı ("Yeni Bakım Paketi").
**Amaç:** Bakım paketi açmak veya var olan paketin dönem, saat kotası, bedel, yenileme ve sözleşme bağını düzenlemek.
**Kullanıcılar:** `destek` bölümü olan 12 rol + yazma kapısı (`ekle` / `duzenle`).
**Veri kaynağı:** `DB.supportPackages` · `DB.customers` · `DB.contracts` · `DB.tickets` · `DB.activities` · `DB.today`
**Üst özet kartları:** yok
**Sekmeler:** yok
**Arama:** yok
**Filtreler:** yok
**Tablo kolonları:** yok
**Form alanları:** `GV.form({ mount, id:'destekpaket', record, sections })` — **4 bölüm**:
- **Müşteri ve paket** — 3 alan; zorunlu: Müşteri, Paket adı (Bağlı sözleşme opsiyonel, seçenekleri müşteriye göre daralır)
- **Dönem ve saat kotası** — 4 alan; hepsi zorunlu: Dönem başlangıcı, Dönem bitişi, Aylık saat kotası (1–400), Paket durumu
- **Bedel, yenileme ve durum** — `canFinans` ise **Paket bedeli** (`money`, eksen etiketi ile) + Yenileme işareti (`switch`) + Yenileme tarihi
- **Kayıt durumu** — 1 alan (`aktif` switch)
**Detay sekmeleri:** —
**İşlem butonları:** `GV.pageHead({eyebrow:'Destek ve Bakım', title:<başlık>})`; aksiyonlar: Vazgeç (`app-destek-paket.html`) · Kaydet / Değişiklikleri kaydet (`run:kaydet`). Kaydetmeden önce `GV.confirm({tone:'warn', title:'Kaydetmeden önce onaylayın'})` çalışır.
**Toplu işlemler:** yok
**Bildirimler:** `GV.confirm` kaydetme öncesi; `GV.notice` ile **kota durumuna göre altı farklı uyarı** ("Kota henüz hesaplanamıyor" · "Kota dengesi bozuluyor" · "Kota yeniden hesaplanacak" · "Kota tükenmek üzere" · "Kota kritik eşikte" · "Kota aritmetiği tutarlı"), taleplerle karşılaştırma uyarıları ("Kalan saat taleplerle birebir aynı" / "…uyuşmuyor" / "Taleplerde tek bir kalan destek değeri yok") ve sözleşme uyarıları ("Paket bir sözleşmeye bağlı değil" · "Seçili sözleşme kaydı bulunamadı" · "Sözleşme başka müşteriye ait" · "Paket bedeli sözleşme tutarından farklı").
**Yetkilendirme:** `canYaz = duzenle ? can('duzenle') : can('ekle')` false ise `GV.errorState` **403** (sub: "Bu işlem için yetkiniz yok."); `canFinans = GV.perm.can('finans')` → "Paket bedeli" alanı hiç basılmaz.
**Boş durum:** `GV.empty` "Kayıt bulunamadı" + "Bakım paketlerine dön".
**Hata durumu:** `GV.errorState` **var** (403).
**Mobil görünüm:** `mobile()` yok.
**Kabul kriterleri:**
- Dönem veya aylık saat değiştiğinde kota aritmetiği (`kullanilan + kalan = aylikSaat × dönem ayı`) canlı yeniden hesaplanmalı ve tutarsızlık `GV.notice` ile söylenmeli.
- Seçilen sözleşme başka müşteriye aitse uyarı basılmalı.
- Paket bedeli bağlı sözleşmenin **net** tutarından farklıysa uyarı basılmalı (§9b: `BKP-001` = `SZL-2026-022.tutar`).

---

### `app-destek-memnuniyet.html` — Memnuniyet

**Tip:** liste + grafik paneli
**Bölüm:** `SECTIONS.destek` → menü etiketi **"Memnuniyet"**, `screen:'memnuniyet'`
**Amaç:** Müşteri memnuniyet anketlerini puan, tavsiye skoru (NPS), yanıt oranı ve düşük puanlı geri bildirim ekseninde izlemek; yeni anket göndermek.
**Kullanıcılar:** `destek` bölümü olan 12 rol.
**Veri kaynağı:** `DB.surveys` (kaynak) · `DB.customers` · `DB.contacts` · `DB.tickets` · `DB.today`
**Üst özet kartları:** `kpis[]` **5** — Ortalama puan (/5) · Tavsiye skoru (NPS, imzalı) · Yanıt oranı (%) · Yanıt bekleyen anket · 3 puan altı geri bildirim. Ayrıca liste **üstünde** `#grafik` alanında iki grafik kartı: **Puan dağılımı** (`GV.chart.bar`, 1–5 yıldız) ve **Tavsiye skoru kırılımı** (`GV.chart.donut` + `GV.chart.legend`, NPS sınıfları).
**Sekmeler:** `tabs[]` 5 — Tümü · Yanıtlandı · Yanıt Bekliyor · Düşük Puan (<3) · Destekleyiciler (tavsiye ≥ 9)
**Arama:** `search.fields` = `kod · tur · ilgili · kanal · yanitlayan · durum · yorum`; `search.extra` = müşterinin kısa adı
**Filtreler:** `musteri` select · `tur` multi (3 değer) · `kanal` multi (3 değer) · `durum` select (Yanıtlandı / Bekliyor) · `puanAralik` select (4 kova, `test`) · `tarih` daterange
**Tablo kolonları:** Anket (kilitli) · Müşteri (+ müşteri ortalaması alt satırı) · Tür · İlgili kayıt · Tarih · **Kanal** *(gizli)* · **Yanıtlayan** *(gizli)* · Puan · Tavsiye skoru · Durum · Yorum
**Form alanları:** —
**Detay sekmeleri:** —
**İşlem butonları:** `GV.pageHead({eyebrow:'Destek ve Bakım', title:'Memnuniyet', sub:…})` aksiyonları: "Destek Talepleri" · **"Anket Gönder"** (`btn-acc`, `run:anketGonder` → `GV.modal` içinde müşteri / yetkili (bağımlı select) / tür / kanal). `rowActions[]` 4 — **Yorumu oku** (`GV.drawer`) · Müşteriyi aç · İlgili kaydı aç (`href` null dönerse `run` bilgi toast'ı basar) · **Takip görevi aç** (yalnız 3 puan altı için, `GV.confirm`).
**Toplu işlemler:** `bulk[]` 2 — Hatırlatma gönder · Dışa aktar. **İkisinin de `run` yok**.
**Bildirimler:** `GV.toast` — "`ANK-…` · `<müşteri>` anketi gönderildi" (`ok`), "`<kod>` belirli bir kayda bağlı değil — dönemsel genel memnuniyet anketi." (`info`), "Anket henüz yanıtlanmadı; takip görevi için önce yanıt bekleniyor." (`info`), "`<kod>` puanı N / 5 — takip görevi yalnız 3 puan altı geri bildirimler için önerilir." (`info`), "`<müşteri>` için takip görevi açıldı" (`ok`). `GV.drawer` yorum panelinde, içinde `GV.notice(warn)` "Yanıt bekleniyor" ve `GV.notice(danger)` "Düşük puanlı geri bildirim". `GV.confirm(tone:'warn')` takip görevi açmada.
**Yetkilendirme:** `GV.perm.can(...)` çağrısı **yok**. Alan maskeleme ve 403 kapısı yok.
**Boş durum:** `emptyState` var — "Bu görünümde memnuniyet anketi yok" + `[data-anket]` butonu (`onRender` içinde `anketGonder`'e bağlanır).
**Hata durumu:** `GV.errorState` **yok**.
**Mobil görünüm:** `mobile(x)` var (müşteri + puan/durum, kod/tür, tarih ve tavsiye satırı, durum rozeti).
**Kabul kriterleri:**
- Yanıt bekleyen anketin `puan` ve `tavsiye` değerleri **hiçbir ortalamaya** girmemeli.
- Bir müşterinin yanıtlanmış anket ortalaması `DB.customers[].memnuniyet` ile birebir tutmalı (arşivli anketler dahil).
- NPS sınıflandırması 9-10 destekleyici · 7-8 nötr · 0-6 kötüleyici olmalı; grafik ve kolon aynı eşiği kullanmalı.
**Bulgular:** "Takip görevi aç" aksiyonu yalnız `GV.toast` basıyor, gerçek bir `DB.tasks` kaydı üretmiyor — aynı akış `app-destek-detay.html`'de gerçekten kayıt açıyor. Yeni anket kodu `('00' + (40 + DB.surveys.length)).slice(-3)` ile **dizi uzunluğundan** türetiliyor; projedeki "en büyük numaradan +1" kuralına aykırı ve silme/ekleme sonrası çakışabilir.

---

### `app-sohbet.html` — Sohbet

**Tip:** özel (sohbet arayüzü)
**Bölüm:** `SECTIONS.sohbet` (eyebrow "İletişim", başlık "Sohbet ve İş Birliği") → tek menü satırı **"Kanallar"**, `screen:'sohbet'`, sayaç `cnt:'mesaj'`
**Amaç:** Departman, proje ve birebir kanallarını tek akışta toplayıp mesajlaşmayı, dosya paylaşımını ve mesajdan göreve devri yürütmek.
**Kullanıcılar:** `SEC_BY_ROLE`'da `sohbet` bölümü olan **26 rol** — `musteri` dışındaki tüm roller.
**Veri kaynağı:** `DB.channels` · `DB.messages` · `DB.employees` (`DB.emp`, `DB.empName`) · `DB.departments` (`DB.depName`) · `DB.projects` · `DB.customers` · `DB.tasks` · `DB.taskTypes` · `DB.priorities` · `DB.activities` · `DB.today`
**Üst özet kartları:** `kpis[]` yok. Üstte `.gv-listhead` içinde kanal sayacı (`N kanal · M okunmamış mesaj`) var.
**Sekmeler:** `GV.list` sekmesi yok; yerine **6 filtre çipi** (`.chipbar`, `GV.chipbar(card)` ile taşınca oklu kaydırır): Tümü · Proje kanalları · Departman · Departmanlar arası · Birebir · Duyuru. Her çipte kanal sayacı basılır.
**Arama:** Kendi arama kutusu (`#ara`, 220 ms gecikmeli). Kapsam: kanal `ad` + `tur` + `sonMesajOzet` **ve** kanalın mesaj metinleri. `search.fields` / `search.extra` yok (bileşen kullanılmıyor).
**Filtreler:** Çip filtresi (yukarıdaki 6) + **Arşivlenenler** onay kutusu (`#arsiv`, `aktif` alanını ters çevirir). `filters[]` yok.
**Tablo kolonları:** yok
**Form alanları:** —
**Detay sekmeleri:** —
**İşlem butonları:** `GV.pageHead({eyebrow:'İş Birliği', title:'Sohbet', sub:…})` aksiyonları: "İş Talepleri" (`app-istalebi.html`) · **"Yeni Kanal"** (`btn-acc`, `id:'btnKanal'` → `GV.modal`). Kanal başlığında: **Dosya paylaş** (`#btnDosya`), **Sessize al / Sessizi kaldır** (`#btnSessiz`), **Kanal bilgisi** (`#btnBilgi` → `GV.drawer`), mobilde **geri** (`#btnGeri`). Mesaj başına üç aksiyon: **Görev oluştur** · **Yanıtla** (alıntılayarak) · **Tepki ekle** (8 emoji). Alt barda **Gönder** (`#btnGonder`, Enter ile de çalışır).
**Toplu işlemler:** yok
**Bildirimler:** `GV.toast` — "Mesaj gönderildi" (`ok`, 1600 ms), "Mesaj boş olamaz" (`danger`), "`<kanal>` sessize alındı / bildirimleri yeniden açıldı", "Tepki eklendi" · "`<emoji>` tepkisi eklendi", "`<kişi>` mesajı alıntılandı", "`<kod>` görevi oluşturuldu ve `<kişi>` kişisine atandı" (`ok`, 4000 ms), "Görev başlığı zorunludur" · "Termin tarihi zorunludur" · "Termin geçmiş bir tarih olamaz" (`danger`), "N dosya `<kanal>` kanalında paylaşıldı", "En az bir dosya seçin" (`danger`), "Kanal adı zorunludur" · "Bu isimde bir kanal zaten var" (`danger`), "`<ad>` kanalı oluşturuldu". `GV.drawer` kanal bilgisinde, `GV.modal` görev/dosya/yeni kanal akışlarında, `GV.empty` kanal ve mesaj boşluklarında.
**Yetkilendirme:** `GV.perm.can(...)` çağrısı **yok**. Kanal görünürlüğü rol yerine `aktif` bayrağı ve çip filtresiyle belirlenir; alan maskeleme ve 403 kapısı yok.
**Boş durum:** İki ayrı `GV.empty` — "Kanal bulunamadı" (+ "Filtreyi temizle" butonu) ve "Kanal seçilmedi" / "Eşleşen mesaj yok" / "Kanalda henüz mesaj yok".
**Hata durumu:** `GV.errorState` **yok**.
**Mobil görünüm:** `mobile()` üreticisi yok (liste bileşeni kullanılmıyor). ≤900px'de `matchMedia` ile `body.chat-list-open` sınıfı kanal listesini açar; kanal seçilince kapanır, `#btnGeri` ile geri açılır. Kırılım değişince `mq.addEventListener('change', …)` durumu yeniden ayarlar.
**Kabul kriterleri:**
- Durum (`k` seçili kanal, `f` çip, `q` arama) `history.replaceState` ile URL'de tutulmalı; sayfa yenilenince aynı kanal açılmalı.
- Mesajdan üretilen görev kaynağına bağlı kalmalı (`m.gorev = kod`) ve kanala otomatik durum mesajı düşmeli.
- Yeni mesaj saati `DB.today` eksenine oturmalı, `new Date()` saatine değil.
- ≤900px'de kanal listesi ile mesaj akışı aynı anda görünmemeli.
**Bulgular:** Kanal kaydı üye **listesi** değil üye **sayısı** tutuyor; üyeler ilişkili proje/departman kayıtlarından türetiliyor ve türetilemeyen fark ekranda dürüstçe yazılıyor ("Kanal kaydında N üye görünüyor; M üye … türetilemedi"). Yeni kanal ve yeni mesaj kodları `Math.max(...)+1` ile doğru üretiliyor, ancak `DB.channels` boşsa `Math.max.apply(null, [])` `-Infinity` döner — mock veri dolu olduğu için bugün tetiklenmiyor.


---

## Bölüm 3 — İnsan Kaynakları, Demirbaş ve Filo, Toplantı, Doküman

*39 ekran.*

### `app-personel.html` — Personel

**Tip:** liste
**Bölüm:** `SECTIONS.personel` (`İnsan Kaynakları` / `Personel ve İK`) → menü etiketi **Personel**
**Amaç:** Şirketin tüm personel kayıtlarını doluluk, açık görev ve izin bakiyesiyle birlikte tek listede yönetmek.
**Kullanıcılar:** `SEC_BY_ROLE`'da `personel` bölümü olan 9 rol — `sahip` · `genelmudur` · `sistem` · `operasyon` · `depmudur` · `pm` · `takimlideri` · `ik` · `idari`. Ekran seviyesinde ek kısıt yok (`SCREEN_PERM`'de kaydı yok).
**Veri kaynağı:** `DB.employees` (kaynak) · `DB.capacity` · `DB.tasks` · `DB.leaves` · `DB.departments` · `DB.roles` · `DB.roleName`
**Üst özet kartları:** `kpis[]` 4 adet — **Aktif personel** (`aktif === true` sayısı) · **Ortalama doluluk** (`DB.capacity` doluluk ortalaması, %) · **Aşırı yüklü** (doluluk ≥ 95) · **Bekleyen izin talebi** (`DB.leaves` durum `Onay bekliyor`, `app-izin.html`'e bağlı).
**Sekmeler:** `tabs[]` 6 adet — `aktif` Aktif Personel (aktif ve rolü freelancer/diskaynak değil) · `tamzam` Tam Zamanlı (`calismaTuru`) · `dis` Dış Kaynak (rol freelancer/diskaynak/stajyer) · `yuklu` Aşırı Yüklü (doluluk ≥ 95) · `musait` Müsait (0 < doluluk < 75) · `tumu` Tümü.
**Arama:** `search.fields` = `kod · ad · pozisyon · depAd · eposta · yetkinlik · teknoloji`. `search.extra` yok.
**Filtreler:** `dep` multi (`DB.departments`) · `rol` multi (`DB.roles`) · `calismaTuru` select (3 sabit değer) · `sozlesme` select (4 sabit değer) · `doluluk` text + `test` (en az %) · `girisTarihi` daterange.
**Tablo kolonları:** Personel · Departman · Sistem rolü · **Çalışma türü (varsayılan gizli)** · İşe giriş · Doluluk · Açık görev · İzin bakiyesi · **Maaş (varsayılan gizli)** · **Lokasyon (varsayılan gizli)** · Durum.
**Form alanları:** —
**Detay sekmeleri:** —
**İşlem butonları:** Sayfa başlığı **statik HTML** olarak yazılmış (`GV.pageHead` çağrılmıyor): "Kapasite" (`app-kapasite.html`) + "Yeni Personel" (`app-personel-form.html`). `rowActions[]` 3 adet — **Personel kartını aç** (detay) · **Görevleri** (`app-gorev.html?t=tumu&f_sorumlu=`) · **İzinleri** (`app-izin.html?f_personel=`).
**Toplu işlemler:** `bulk[]` 2 adet — **Departman değiştir** · **Dışa aktar**. İkisinde de yetki kapısı yok.
**Bildirimler:** Ekranın kendi bastığı `GV.toast` / `GV.notice` / `GV.result` **yok** — tüm satır aksiyonları salt bağlantı.
**Yetkilendirme:** `GV.perm.can('maas')` → maaş kolonu; yetkisizde hücre `cell-mask` ile `••••••` basılır ve `exportValue` boş döner. 403 kapısı yok (liste salt-okunur).
**Boş durum:** `GV.empty` — "Bu görünümde personel yok" + açıklama. **Aksiyon tanımlı değil** (bu bir bulgudur).
**Hata durumu:** `GV.errorState` yok.
**Mobil görünüm:** `mobile(e)` var (avatar + ad + pozisyon + departman + açık görev + doluluk çubuğu); ayrıca `card(e)` ile kart görünümü. `views:['table','card']`.
**Kabul kriterleri:**
- 6 sekmenin her birinde sayaç `DB.employees` üzerinden hesaplanır; sekme değişince sayfalama 1'e döner.
- `maas` yetkisi olmayan rolde hem kolon hücresi hem Excel çıktısı maskelidir.
- Doluluk ≥ %95 olan satır `is-late` sınıfını alır; `yuklu` sekmesinin sayısı KPI "Aşırı yüklü" ile birebir aynıdır.
**Bulgular:** (a) Ekran **elle yazılmış shell iskeleti** kullanıyor ve `#gvPageHead` düğümü yok → `GV.pageHead` bu sayfada hiç çalışmaz, başlık ve aksiyonlar statik markup (components.md §3 "UID-15" sınıfı borç). (b) `emptyState.action` yok. (c) `bulk[]` kalemlerinde yetki kapısı yok.

---

### `app-personel-detay.html` — Personel Kartı

**Tip:** detay (11 sekme)
**Bölüm:** `SECTIONS.personel` — menüde yok, şuradan bağlanır: `app-personel.html` satır aksiyonu / kolon bağlantısı, `app-kapasite.html`, `app-izin-detay.html`, `app-zimmet.html`, `app-performans.html`.
**Amaç:** Bir personelin özlük, görev, proje, zaman, izin, kapasite, performans, eğitim ve zimmet ekseninin tamamını tek kayıtta toplamak.
**Kullanıcılar:** `personel` bölümüne erişimi olan 9 rol (`sahip` · `genelmudur` · `sistem` · `operasyon` · `depmudur` · `pm` · `takimlideri` · `ik` · `idari`).
**Veri kaynağı:** `DB.employees` · `DB.departments` · `DB.roles` · `DB.tasks` · `DB.projects` · `DB.timelogs` · `DB.timesheets` · `DB.leaves` · `DB.capacity` · `DB.performance` · `DB.trainings` · `DB.assignments` · `DB.assets` · `DB.vehicles` · `DB.activities`
**Üst özet kartları:** `kpis[]` yok (detay ekranı). Yerine sağ sütunda dört kart: **Özet** (10 satır), **Kapasite**, **Aktif Projeler**, **Son Hareket**.
**Sekmeler:** `GV.tabs('#recTabs')` — 11 sekme: `genel` · `gorev` · `proje` · `zaman` · `timesheet` · `izin` · `kapasite` · `performans` · `egitim` · `zimmet` · `aktivite`.
**Arama:** yok
**Filtreler:** yok
**Tablo kolonları:** Sekme içi tablolar (kolon yönetimi yok, `GV.list` kullanılmıyor).
**Form alanları:** —
**Detay sekmeleri:**
1. **Genel** — Kimlik (8 alan), Unvan ve Organizasyon (7), Çalışma ve Özlük (7, ücret dahil), İletişim (3), Yetkinlik ve Uzmanlık (4).
2. **Görevler** — sorumlu + yardımcı olduğu görevler; rol · proje · durum · öncelik · termin · ilerleme; sayaç + "Görev listesinde aç".
3. **Projeler** — ekip/pm/teknikSorumlu/musteriSorumlu bağı ya da görev üzerinden; roller çipi, sağlık, görev adedi, ilerleme.
4. **Zaman Kayıtları** — `DB.timelogs`; tarih, proje, görev, süre, faturalanabilirlik, onay; alt sayaçta toplam · faturalanabilir · oran.
5. **Timesheet** — `DB.timesheets`; hafta, dönem, toplam, faturalanabilir, eksik/fazla, onaylayan, durum.
6. **İzinler** — bakiye özeti (4 satır) + izin tablosu + varsa "Vekâlet Ettiği İzinler" ikinci tablosu.
7. **Kapasite** — `DB.capacity` kaydı: haftalık kapasite, planlanan, boşta, izin, doluluk, değerlendirme rozeti + "Yükün Kaynağı" açık görev tablosu.
8. **Performans** — `DB.performance` dönem tablosu + son tamamlanan dönemin 10 satırlık yetkinlik dökümü.
9. **Eğitim & Yetkinlik** — yetkinlik profili + `DB.trainings` katılım tablosu (maliyet finans yetkisine tabi).
10. **Zimmetler** — `DB.assignments` + ayrıca "Tahsisli Araçlar" tablosu (`DB.vehicles` ana/yedek sürücü).
11. **Aktivite Geçmişi** — `GV.activity(acts)`.
**İşlem butonları:** `GV.pageHead` — "Personel listesi" · "Kapasite planı" · (yalnız `can('ekle')`) **"Görev ata"** → modal, gerçekten `DB.tasks` ve `DB.activities`'e yazar. `rowActions` yok.
**Toplu işlemler:** yok
**Bildirimler:** `GV.toast('<kod> görevi <ad> kişisine atandı','ok')` görev atama sonrası · `GV.toast` doğrulama hatalarında (`danger`) · `GV.notice` üç yerde: ücret maskesi (`neutral`), eğitim maliyeti maskesi (`neutral`), aşırı yük uyarısı (`warn`, doluluk ≥ 95). `GV.result` kullanılmıyor.
**Yetkilendirme:** `GV.perm.can('maas')` → "Aylık brüt maaş" / "Saatlik ücret" alanı maskelenir + `GV.notice` ile gerekçe yazılır. `GV.perm.can('finans')` → eğitim maliyeti sütunu maskelenir. `GV.perm.can('ekle')` → "Görev ata" aksiyonu hiç basılmaz. 403 kapısı yok.
**Boş durum:** `?id=` bulunamazsa `GV.empty` + "Personel listesine dön". Ayrıca **her sekmede ayrı** `GV.empty` (görev, proje, zaman, timesheet, izin, kapasite, performans, eğitim, zimmet).
**Hata durumu:** `GV.errorState` yok.
**Mobil görünüm:** `mobile(r)` üreticisi yok (liste değil). Tablolar `.gv-tablewrap.is-mobilescroll` ile ≤760px'de yatay kaydırılır.
**Kabul kriterleri:**
- 11 sekmenin 11'i de veriden gerçek içerik ya da kendi boş durumunu basar; hiçbiri boş panel bırakmaz.
- Kıdem `DB.today` üzerinden hesaplanır (`new Date()` kullanılmaz).
- Görev atama sonrası `GV.refresh()` çağrılır, `location.reload()` yoktur (ders L-15).
**Bulgular:** Ekran elle shell markup'ı yazıyor ama `<div id="gvPageHead"></div>` düğümünü kendisi koyduğu için `GV.pageHead` çalışıyor — ad tek `<h1>`'de tutulmuş, kayıt başlığı yalnız kod + rozet taşıyor (çift `<h1>` bilinçli olarak engellenmiş).

---

### `app-personel-form.html` — Yeni / Düzenle Personel

**Tip:** form
**Bölüm:** `SECTIONS.personel` — menüde yok, şuradan bağlanır: `app-personel.html` "Yeni Personel" aksiyonu.
**Amaç:** Personel künyesini (kimlik, organizasyon, özlük, ücret, iletişim, yetkinlik) tek formda açmak ya da düzeltmek.
**Kullanıcılar:** `personel` bölümü olan 9 rol; ek olarak **iki eksenli yetki kapısı** — `can('ekle')`/`can('duzenle')` **ve** `can('personel')`.
**Veri kaynağı:** `DB.employees` · `DB.departments` · `DB.roles` · `DB.tasks` · `DB.activities` · `DB.leaves` · `DB.capacity` · `DB.performance` · `DB.trainings` · `DB.assignments` · `DB.vehicles`
**Üst özet kartları:** yok — yerine düzenleme modunda **Kayıt Özeti** kartı (16 satır) ve yeni kayıtta bilgi `GV.notice`'ı.
**Sekmeler:** yok
**Arama:** yok
**Filtreler:** yok
**Tablo kolonları:** —
**Form alanları:** `GV.form` `sections[]` 7 bölüm / **24 alan** (ücret yetkisiyle), 15 zorunlu:
- **Kimlik** — 6 alan; zorunlu: Ad soyad, Baş harfler, Doğum tarihi, Öğrenim, Çalışma lokasyonu.
- **Organizasyon** — 5 alan (`rolEkle` yardımcı alan, veriye yazılmaz); zorunlu: Unvan/pozisyon, Departman, Birincil sistem rolü.
- **Çalışma ve özlük** — 4 alan; dördü de zorunlu.
- **Ücret** *(yalnız `can('maas')`)* — 2 alan (Aylık maaş brüt, Saatlik ücret brüt); zorunlu yok, çapraz doğrulama ikisinden yalnız birinin dolmasını ister.
- **İletişim** — 3 alan; zorunlu: E-posta, Telefon.
- **Yetkinlik ve uzmanlık** — 3 alan; zorunlu: Yetkinlikler.
- **Kayıt durumu** — 1 alan (`switch`).
**Detay sekmeleri:** —
**İşlem butonları:** `GV.pageHead` — "Vazgeç" (`app-personel.html`) + "Kaydet"/"Değişiklikleri kaydet" (`run:kaydet`). Form altında ikinci **`#kaydetAlt`** butonu aynı yordamı çağırır. `rowActions` yok.
**Toplu işlemler:** yok
**Bildirimler:** `GV.toast` — rol ekleme/kaldırma (`ok`/`info`), "En az bir yetkinlik girilmelidir" (`danger`), "Değişiklik yok" (`info`), "`EMP-0xx` güncellendi · N alan" / "oluşturuldu" (`ok`). `GV.notice` — ücret alanlarının neden basılmadığı (`neutral`), form kapsamı (`info`), ilişkili kayıt uyarısı (`warn`/`info`), yeni kayıt akışı (`info`). `GV.result` yok.
**Yetkilendirme:** `can('duzenle')`/`can('ekle')` **ve** `can('personel')` → ikisinden biri yoksa `GV.errorState` ile **403 durumu** basılır ve `GV.form` **hiç kurulmaz**; `errorState`'in "Tekrar dene" butonu gerçek bağlantılarla değiştirilir. `can('maas')` → Ücret bölümü forma hiç basılmaz; kaydederken `maas`/`saatlikUcret` anahtarları okunmaz, mevcut değere dokunulmaz.
**Boş durum:** `?id=` var ama kayıt yoksa `GV.empty` + "Personel listesine dön".
**Hata durumu:** `GV.errorState` **var** (403 kapısı).
**Mobil görünüm:** `mobile(r)` yok; `GV.form` `cols` ızgarası ≤760px'de tek sütuna iner.
**Kabul kriterleri:**
- Yetkisiz rolde form DOM'a hiç girmez (403 kartı tek başına kalır).
- Ad soyad değişince baş harfler kendiliğinden güncellenir; kullanıcı elle yazdıysa üzerine yazılmaz.
- Yönetici zinciri kendine dönemez (`zincirDongusu`), e-posta ve telefon tekildir.
- Kaydetme sonrası yalnız **değişen** alanlar için `DB.activities` satırı yazılır.
**Bulgular:** `GV.form`'da `multiselect`/`tags` tipi olmadığı için "Tanımlı diğer roller" alanı `select` + elle kurulan `.achip` çip listesiyle çözülmüş; yetkinlik/teknoloji/sertifika ise virgüllü metin. Eksik bileşen ekranda açıkça yazılı.

---

### `app-izin.html` — İzin Yönetimi

**Tip:** liste
**Bölüm:** `SECTIONS.personel` → menü etiketi **İzinler** (`cnt:'izin'` rozeti)
**Amaç:** İzin taleplerini onay durumu, çakışma ve bakiye ekseniyle listelemek ve satırdan onaylayıp reddetmek.
**Kullanıcılar:** `personel` bölümü olan 9 rol.
**Veri kaynağı:** `DB.leaves` (kaynak) · `DB.employees` · `DB.leaveTypes` · `DB.today` · `DB.emp` / `DB.empName`
**Üst özet kartları:** `kpis[]` 4 — **Onay bekleyen** · **Onaylanan (bu ay)** (`baslangic` ayı = `DB.today` ayı) · **Toplam izinli gün** (onaylıların `gun` toplamı) · **Çakışma uyarısı** (`cakisma` bayrağı).
**Sekmeler:** `tabs[]` 6 — `bekleyen` Onay Bekleyenler · `benim` İzinlerim (`personel === GV.session.emp`) · `onayim` Onayımı Bekleyenler · `onayli` Onaylananlar · `red` Reddedilenler · `tumu` Tümü.
**Arama:** `search.fields` = `kod · tur · gerekce · durum`. `search.extra` yok — **personel adı aramada taranmıyor** (bulgu).
**Filtreler:** `durum` multi (3 değer) · `tur` multi (`DB.leaveTypes`) · `personel` select · `onaylayan` select · `baslangic` daterange.
**Tablo kolonları:** Personel · İzin türü · Başlangıç · Bitiş · Gün · Kalan bakiye · Vekil personel · **Gerekçe (varsayılan gizli)** · Çakışma · **Onaylayan (varsayılan gizli)** · Durum.
**Form alanları:** —
**Detay sekmeleri:** —
**İşlem butonları:** `GV.pageHead` — "Departman Takvimi" (`app-ajanda.html`) + "İzin Talebi Oluştur" (`app-izin-form.html`). `rowActions[]` 2 — **Onayla** (`GV.confirm`, bakiye düşümü detay ekranıyla aynı clamp'li yordam) · **Reddet** (`GV.modal`, ret gerekçesi zorunlu).
**Toplu işlemler:** `bulk[]` 2 — **Toplu onayla** · **Dışa aktar**. Yetki kapısı yok.
**Bildirimler:** `GV.toast` — "Bu talep zaten sonuçlanmış." (`info`), "İzin onaylama yetkiniz yok." (`danger`), "`IZN-…` onaylandı" (`ok`), "Ret gerekçesi zorunludur" (`danger`), "`IZN-…` reddedildi" (`ok`). `GV.confirm` onay öncesi (çakışma varsa `danger` tonu). `GV.notice` / `GV.result` yok.
**Yetkilendirme:** Satır aksiyonu içinde `GV.perm.can('onay')` denetimi (yetkisizde toast ile reddedilir). Alan maskeleme yok (`maas`/`finans` alanı ekranda yok). 403 kapısı yok.
**Boş durum:** `GV.empty` — "Bu görünümde izin talebi yok" + **aksiyon: "İzin Talebi"** bağlantısı.
**Hata durumu:** `GV.errorState` yok.
**Mobil görünüm:** `mobile(x)` var — ad + durum rozeti, tür · gün, tarih aralığı.
**Kabul kriterleri:**
- "Onayla" aksiyonu yalnız `Onay bekliyor` kaydı değiştirir; bakiye eksiye inmez (`Math.min(bakiye, gun)`).
- Ret gerekçesi boşken modal kapanmaz (`return false`).
- `cakisma` bayraklı satır `is-late` sınıfını alır ve KPI "Çakışma uyarısı" ile aynı kümeyi sayar.
**Bulgular:** (a) `rowActions`'ta `show(row)` kullanılmıyor — zaten sonuçlanmış talepte "Onayla"/"Reddet" butonları yine basılıp toast'la reddediliyor; components.md §2 sözleşmesi bu durumda aksiyonun **hiç basılmamasını** söylüyor. (b) Yetki denetimi `run` içinde, aksiyon görünürlüğünde değil. (c) Arama personel adını taramıyor.

---

### `app-izin-detay.html` — İzin Talebi Detayı

**Tip:** detay (6 sekme)
**Bölüm:** `SECTIONS.personel` — menüde yok, şuradan bağlanır: `app-izin.html` (kolon bağlantısı yok, `?id=` ile), `app-izin-detay` içi çapraz bağlantılar, `app-izin-form.html` 403 kartı.
**Amaç:** Tek izin talebinin onay zincirini, bakiye etkisini, departman çakışmasını ve devredilecek işlerini birlikte göstermek.
**Kullanıcılar:** `personel` bölümü olan 9 rol.
**Veri kaynağı:** `DB.leaves` · `DB.employees` · `DB.departments` · `DB.leaveTypes` · `DB.capacity` · `DB.approvals` · `DB.activities` · `DB.tasks` · `DB.projName`
**Üst özet kartları:** yok — sağ sütunda 4 kart: **Özet** (10 satır) · **Onay** (6 satır) · **Kontroller** (6 satır) · **Son Hareket**.
**Sekmeler:** `GV.tabs('#recTabs')` — 6 sekme.
**Arama:** yok
**Filtreler:** yok
**Tablo kolonları:** Sekme içi tablolar.
**Form alanları:** —
**Detay sekmeleri:**
1. **Genel** — Talep Kimliği (6), Tarih ve Süre (7, takvim günü ↔ kayıt günü karşılaştırması dahil), Gerekçe ve Vekâlet (4), Onay Bilgisi (5).
2. **Onay Akışı** — `GV.chain(adimlar)` üç adım: Talep → Yönetici onayı (`DB.approvals` varsa kod/aciliyet ile) → İK kaydı ("Kayıt yok", makam DEP-14 yöneticisinden türetildi). Alt tarafta 13 satırlık künye + `can('onay')` ise **Onayla / Reddet** butonları.
3. **İzin Bakiyesi** — yıllık hak **türetilir** (kalan + onaylı yıllık kullanım), kullanılan/bekleyen/kalan/oran; personelin tüm izin tablosu; kapasite kartı karşılaştırması.
4. **Çakışma Kontrolü** — departman içi çakışan izinler (ortak gün hesabı), departman personelinin bu aralıktaki durumu matrisi, şirket geneli çakışma tablosu.
5. **Vekil ve Devredilen İşler** — vekil kartı (9 satır) + izin aralığına termini düşen açık görevler + gecikmiş açık görevler + 6 satırlık özet.
6. **Aktivite Geçmişi** — `GV.activity(acts)`.
**İşlem butonları:** `GV.pageHead` — "İzin listesi" · "Personel kartı" · "Kapasite". Sekme içi `#btnOnayla` / `#btnReddet` (yalnız `can('onay')` ve `Onay bekliyor` iken basılır).
**Toplu işlemler:** yok
**Bildirimler:** `GV.confirm` onayda (çakışma ya da bakiye yetersizse `danger`) · `GV.modal` rette (gerekçe zorunlu, `.is-invalid` + odak) · `GV.toast` "`IZN-…` onaylandı / reddedildi" (`ok`) · `GV.notice` **9 farklı yerde**: gün/takvim uyuşmazlığı, izin türü sözlükte yok, onay kuyruğu kaydı yok, onay yetkisi yok, bakiye yetersiz, onay öncesi çakışma, yıllık hak türetimi, kapasite çelişkisi, çakışma bayrağı uyuşmazlığı, vekil izinli, vekil farklı departmanda. `GV.result` yok.
**Yetkilendirme:** `GV.perm.can('onay')` → onay/ret butonları ve akışları. Alan maskeleme yok. 403 kapısı yok (görüntüleme herkese açık, karar yetkiye bağlı).
**Boş durum:** `?id=` bulunamazsa `GV.empty` + "İzin listesine dön"; ayrıca sekme içi boş durumlar (çakışma yok, devredilecek görev yok, vekil atanmamış, aktivite yok).
**Hata durumu:** `GV.errorState` yok.
**Mobil görünüm:** `mobile(r)` yok; tablolar `.gv-tablewrap.is-mobilescroll`.
**Kabul kriterleri:**
- Çakışma ölçütü `app-izin-form.html` ile **birebir aynı** yordamdır (uç günler dahil kesişim, reddedilenler sayılmaz).
- Yıllık hak alanı veride olmadığı için türetilir ve bu ekranda açıkça "türetildi" diye etiketlenir.
- Onay sonrası `GV.refresh()` çağrılır, `location.reload()` yoktur.
**Bulgular:** Kayıt başlığında `<h1>` var ve `GV.pageHead` da `<h1>` basıyor → sayfada **iki `<h1>`**. Aynı kalıp `app-arac-detay`, `app-demirbas-detay`, `app-toplanti-detay`, `app-dokuman-detay`'da da var; yalnız `app-personel-detay` bunu bilerek engellemiş.

---

### `app-izin-form.html` — Yeni / Düzenle İzin Talebi

**Tip:** form
**Bölüm:** `SECTIONS.personel` — menüde yok, şuradan bağlanır: `app-izin.html` sayfa başlığı ve boş durum aksiyonu.
**Amaç:** İzin talebini personel, tür, tarih aralığı, vekâlet ve onay makamıyla açmak; karar alanlarını yetkiliye düzelttirmek.
**Kullanıcılar:** `personel` bölümü olan 9 rol; yazma için `can('ekle')`/`can('duzenle')`.
**Veri kaynağı:** `DB.leaves` · `DB.leaveTypes` · `DB.employees` · `DB.departments` · `DB.capacity` · `DB.activities` · `DB.today`
**Üst özet kartları:** yok — sağ sütunda üç canlı kart: **Kontroller** (`GV.notice` yığını), **İzin Bakiyesi** (9 satır, türetilen), **Tarih ve Kapasite** (9 satır).
**Sekmeler:** yok
**Arama:** yok
**Filtreler:** yok
**Tablo kolonları:** —
**Form alanları:** `GV.form` `sections[]` 5 bölüm / **14 alan** (onay yetkisiyle), 8 zorunlu:
- **Talep sahibi ve izin türü** — 3 alan; üçü de zorunlu (Personel, İzin türü, Gerekçe).
- **Tarih ve süre** — 4 alan; dördü de zorunlu (Başlangıç, Bitiş, Gün sayısı, Talep tarihi).
- **Vekâlet** — 2 alan (Vekil personel, Proje takvimi çakışma işareti `switch`); zorunlu yok.
- **Onay makamı ve karar** — Onay makamı (zorunlu) + *yalnız `can('onay')`* Talep durumu (zorunlu), Karar tarihi, Ret gerekçesi.
- **Kayıt durumu** — 1 alan (`switch`).
**Detay sekmeleri:** —
**İşlem butonları:** `GV.pageHead` — "İzin listesi" (`btn-line`) + "Kaydet"/"Değişiklikleri kaydet" (`run:kaydet`); form altında `#kaydetAlt`.
**Toplu işlemler:** yok
**Bildirimler:** `GV.toast` — "Vekil temizlendi …" (`warn`), "Değişiklik yok" (`info`), "… güncellendi · N alan · departmanda N çakışan izin var" (`warn`), "… oluşturuldu · bakiyeden N gün düşüldü" (`ok`). `GV.notice` — bağlam notu, onay kararı alanlarının basılmadığı, ve sağ sütunda **7 canlı kontrol** (kendi izniyle çakışma `danger`, departman çakışması `warn`/`ok`/`neutral`, vekil izinli `danger`, bakiye yetersiz `warn`, gün/takvim uyuşmazlığı `warn`). `GV.result` yok.
**Yetkilendirme:** `can('ekle')`/`can('duzenle')` → yoksa `GV.errorState` ile **403** ve `GV.form` hiç kurulmaz. `can('onay')` → Talep durumu / Karar tarihi / Ret gerekçesi alanları forma **hiç basılmaz**; kayıt "Onay bekliyor" ile doğar.
**Boş durum:** `?id=` var ama kayıt yoksa `GV.empty` + "İzin listesine dön".
**Hata durumu:** `GV.errorState` **var** (403).
**Mobil görünüm:** `mobile(r)` yok; `gv-grid-aside` ızgarası ≤980px'de tek sütuna iner.
**Kabul kriterleri:**
- Aynı kişinin çakışan izni varsa kayıt **engellenir** (alan doğrulaması), departman çakışması ise yalnız uyarır.
- Gün sayısı tarihlerden hesaplanır; elle değiştirilirse hesap ezilmez; yalnız "Saatlik izin" türünde takvim gününden küçük olabilir.
- "Onaylandı"ya geçen yıllık izin bakiyeden clamp'li düşer ve `DB.activities`'e ayrı satır yazar.
**Bulgular:** yok

---

### `app-zaman.html` — Zaman Kayıtları

**Tip:** liste
**Bölüm:** `SECTIONS.personel` → menü etiketi **Zaman Kayıtları** (grup başlığı `Zaman`)
**Amaç:** Görev ve proje bazlı süre girişlerini faturalandırma ve onay ekseniyle listelemek.
**Kullanıcılar:** `personel` bölümü olan 9 rol.
**Veri kaynağı:** `DB.timelogs` (kaynak) · `DB.employees` · `DB.tasks` · `DB.projects` · `DB.customers` · `DB.today`
**Üst özet kartları:** `kpis[]` 4 — **Toplam süre** · **Faturalandırılabilir** · **Faturalanamayan** · **Onay bekleyen**.
**Sekmeler:** `tabs[]` 5 — `benim` Kayıtlarım · `bekleyen` Onay Bekleyenler · `faturali` Faturalandırılabilir · `ic` İç İşler · `tumu` Tümü.
**Arama:** `search.fields` = `kod · aciklama · gorev · proje · musteri`. `search.extra` yok.
**Filtreler:** `personel` select · `proje` select · `musteri` select · `onay` select (Bekliyor/Onaylandı) · `tarih` daterange.
**Tablo kolonları:** Tarih · Personel · Açıklama · Görev · Proje · Süre · Faturalandırma · Onay. Varsayılan gizli kolon yok.
**Form alanları:** — (modal içinde elle kurulmuş 5 alanlı hızlı giriş: Tarih, Süre, Görev, Açıklama, Faturalandırılabilir)
**Detay sekmeleri:** —
**İşlem butonları:** `GV.pageHead` — "Timesheet Onayı" (`app-zaman-onay.html`) + **"Süre Ekle"** (`id:'btnEkle'`, `GV.modal` açar ve `DB.timelogs`'a gerçekten yazar). `rowActions[]` 1 — **Onayla** (`onay = 'Onaylandı'`).
**Toplu işlemler:** `bulk[]` 2 — **Toplu onayla** · **Dışa aktar**. Yetki kapısı yok.
**Bildirimler:** `GV.toast` — "Bu kayıt zaten onaylı." (`info`), "Zaman kaydı onaylama yetkiniz yok." (`danger`), "`4 sa` onaylandı" (`ok`), "Geçerli bir süre girin" / "Açıklama zorunludur" (`danger`), "`Ns` kaydedildi" (`ok`). `GV.notice` / `GV.result` yok.
**Yetkilendirme:** `GV.perm.can('onay')` satır aksiyonu içinde. Alan maskeleme yok. 403 kapısı yok.
**Boş durum:** `GV.empty` — "Bu görünümde zaman kaydı yok" + açıklama. **Aksiyon tanımlı değil** (bulgu).
**Hata durumu:** `GV.errorState` yok.
**Mobil görünüm:** `mobile(x)` var — açıklama + süre, tarih · personel, onay rozeti.
**Kabul kriterleri:**
- "Süre Ekle" modalı doğrulamayı geçmeden kapanmaz ve gerçek kayıt üretir (`ZMN-…`).
- KPI'lardaki dört toplam görünen filtre kümesinden hesaplanır (`calc(a)`).
- `onay === 'Onaylandı'` kayıtta "Onayla" aksiyonu veriyi değiştirmez.
**Bulgular:** (a) "Süre Ekle" modalındaki görev seçimi `DB.tasks.slice(0,20)` ile **20 kayda kırpılmış** — 21. görev seçilemiyor. (b) `rowActions.onayla`'da `show(row)` yok. (c) `emptyState.action` yok.

---

### `app-zaman-onay.html` — Timesheet Onayı

**Tip:** liste (onay kuyruğu)
**Bölüm:** `SECTIONS.personel` → menü etiketi **Timesheet Onayı**
**Amaç:** Haftalık timesheet'leri kırılımıyla birlikte onaylamak ya da gerekçeli iade etmek.
**Kullanıcılar:** `personel` bölümü olan 9 rol; görüş kapsamı `GV.perm.scope('gor')` ile daralır (`kendi` kapsamındaki rol yalnız kendi kayıtlarını görür).
**Veri kaynağı:** `DB.timesheets` (kaynak) · `DB.timelogs` · `DB.employees` · `DB.departments` · `DB.projects` · `DB.tasks` · `DB.today`
**Üst özet kartları:** `kpis[]` 5 — **Onay bekleyen** · **Onaylanan** · **Bekleyen toplam mesai** · **Ortalama faturalanabilir oran** · **Eksik mesai bildiren personel**.
**Sekmeler:** `tabs[]` 5 — `tumu` · `bekleyen` Onay Bekliyor · `onayli` Onaylandı · `eksik` Eksik Mesai · `fazla` Fazla Mesai.
**Arama:** `search.fields` = `kod · hafta · durum · personel`; `search.extra` = personel adı + departman adı + onaylayan adı.
**Filtreler:** `personel` select (yalnız timesheet'i olanlar) · `departman` multi + `test` · `hafta` select · `durum` multi (3 değer) · `onaylayan` select · `oranEsik` text + `test` · `mesai` select (4 sapma seçeneği) + `test`.
**Tablo kolonları:** Timesheet · Personel · Departman · **Hafta (varsayılan gizli)** · Dönem · Toplam · Faturalanabilir · Faturalanabilir oran · Eksik · Fazla · Bekleme · Onaylayan · Durum.
**Form alanları:** —
**Detay sekmeleri:** — (drawer içinde haftalık kırılım: özet `dl` + zaman kaydı satırları + gün bazlı toplam)
**İşlem butonları:** `GV.pageHead` — "Zaman Kayıtları". `rowActions[]` — **Kırılımı gör** (`GV.drawer`) · *(yalnız `can('onay')`)* **Onayla** · **İade et** · **Personeli aç**.
**Toplu işlemler:** `bulk[]` — *(yalnız `can('onay')`)* **Seçilenleri onayla** (`confirm` metni ile) · **Seçilenleri iade et** (`tone:'danger'`) · her rolde **Çıktı al**. Yetki kapısı **var** (dizi koşullu kurulur).
**Bildirimler:** `GV.notice` — kapsam uyarısı (`kendi` kapsamı `info`, onay yetkisi yok `warn`), drawer içinde iade gerekçesi (`warn`) ve satır kırılımı uyuşmazlığı (`warn`). `GV.confirm` onayda (eksik/fazla/uyuşmazlık varsa `danger`). `GV.modal` iade gerekçesi (zorunlu). `GV.toast` — "`TMS-…` onaylandı · N sa" (`ok`), "N onaylandı · M kayıt zaten onaylıydı" (`ok`/`warn`), "Seçili kayıtlarda onay bekleyen timesheet yok." (`warn`), "İade gerekçesi zorunludur" (`danger`). `GV.result` yok.
**Yetkilendirme:** `GV.perm.can('onay')` → onay/iade satır aksiyonları ve toplu işlemleri **hiç basılmaz**. `GV.perm.scope('gor') === 'kendi'` → kaynak `DB.timesheets.filter(gorulur)` ile daraltılır ve `GV.notice` ile açıklanır. 403 kapısı yok.
**Boş durum:** `GV.empty` — "Bu görünümde timesheet yok" + **aksiyon: "Zaman Kayıtları"**.
**Hata durumu:** `GV.errorState` yok.
**Mobil görünüm:** `mobile(t)` var; ayrıca `card(t)` (`views:['table','card']`).
**Kabul kriterleri:**
- `kendi` kapsamlı rolde listede yalnız oturum sahibinin kayıtları çıkar ve bu ekranda yazılı olarak bildirilir.
- Kırılım drawer'ı `DB.timelogs`'tan gerçek satırları çeker; timesheet toplamı ile satır toplamı ayrışıyorsa `GV.notice` ile fark yazılır.
- Toplu onayda zaten onaylı kayıtlar atlanır ve atlanan sayısı toast'ta bildirilir.
**Bulgular:** yok

---

### `app-kapasite.html` — Kapasite ve İş Yükü

**Tip:** liste (rapor niteliğinde)
**Bölüm:** `SECTIONS.personel` → menü etiketi **Kapasite**
**Amaç:** Haftalık kapasite, planlanan yük, doluluk ve açık görev dağılımını ekip düzeyinde göstermek.
**Kullanıcılar:** `personel` bölümü olan 9 rol.
**Veri kaynağı:** `DB.capacity` (kaynak) · `DB.employees` · `DB.departments` · `DB.tasks` · `DB.today`
**Üst özet kartları:** `kpis[]` 4 — **Ortalama doluluk** · **Aşırı yüklü** · **Müsait kapasite** (Σ max(0, kapasite − planlanan)) · **İzinli saat** (Σ `izin`, gün olarak biçimlenir).
**Sekmeler:** `tabs[]` 5 — `tumu` Tüm Ekip · `kritik` Aşırı Yüklü (≥95) · `yogun` Yoğun (85–94) · `musait` Müsait (<75) · `izinli` İzin Planlı.
**Arama:** `search.fields` = `personel` (yalnız kod). `search.extra` yok — **personel adı aramada taranmıyor** (bulgu).
**Filtreler:** `dep` multi + `test` (personel kartından departman) · `doluluk` text + `test` (en az %).
**Tablo kolonları:** Personel · Departman · Haftalık kapasite · Planlanan · Müsait · Doluluk oranı · Açık görev · Geciken · Planlı izin. Varsayılan gizli kolon yok.
**Form alanları:** —
**Detay sekmeleri:** —
**İşlem butonları:** `GV.pageHead` — "Personel" (`app-personel.html`) + "Timesheet Onayı" (`app-zaman-onay.html`). `rowActions[]` 2 — **Görevleri** (`app-gorev.html?t=tumu&f_sorumlu=`) · **Personel kartı** (`app-personel-detay.html?id=`).
**Toplu işlemler:** `bulk[]` **yok**.
**Bildirimler:** ekranın bastığı `GV.toast` / `GV.notice` / `GV.result` **yok** (mutasyon üretmeyen salt-okunur ekran).
**Yetkilendirme:** `GV.perm.can(...)` çağrısı **yok**; alan maskeleme yok; 403 kapısı yok.
**Boş durum:** `GV.empty` — "Kapasite verisi yok" + açıklama. **Aksiyon tanımlı değil** (bulgu).
**Hata durumu:** `GV.errorState` yok.
**Mobil görünüm:** `mobile(c)` var — ad + %doluluk, departman, ilerleme çubuğu, planlanan/kapasite + açık görev.
**Kabul kriterleri:**
- `key:'personel'` olduğu için satır tekilliği personel kodundan gelir.
- "Geciken" kolonu `F.days(termin) < 0` olan açık görevleri sayar ve `DB.today` eksenini kullanır.
- `archive:false` — arşiv/pasif toggle bu ekranda kapalıdır.
**Bulgular:** (a) Arama yalnız `personel` kodunu tarıyor; `search.extra` ile ad eklenmemiş. (b) `bulk[]` ve `views` tanımlı değil — yalnız tablo görünümü var. (c) `emptyState.action` yok.

---

### `app-performans.html` — Performans Yönetimi

**Tip:** liste
**Bölüm:** `SECTIONS.personel` → menü etiketi **Performans** (grup başlığı `Gelişim`)
**Amaç:** Çeyrek dönem performans değerlendirmelerini puan, oran ve eğitim ihtiyacı ekseniyle listelemek.
**Kullanıcılar:** `personel` bölümü olan 9 rol.
**Veri kaynağı:** `DB.performance` (kaynak) · `DB.employees` · `DB.empName`
**Üst özet kartları:** `kpis[]` 4 — **Değerlendirme** (adet) · **Açık dönem** · **Ortalama puan** (üç değerlendirmenin ortalaması, "/ 5") · **Zamanında teslim** (%).
**Sekmeler:** `tabs[]` 4 — `tamam` Tamamlananlar · `acik` Açık Dönemler · `gelisim` Eğitim İhtiyacı Olanlar · `tumu` Tümü.
**Arama:** `search.fields` = `kod · donem · gelisimPlani · durum`. `search.extra` yok — **personel adı taranmıyor** (bulgu).
**Filtreler:** `donem` multi (2026-Q1…Q4 sabit) · `personel` select · `durum` select (Açık/Tamamlandı).
**Tablo kolonları:** Personel · Dönem · Öz değerlendirme · Yönetici · **Proje yöneticisi (varsayılan gizli)** · Zamanında teslim · Revizyon oranı · **Görev (varsayılan gizli)** · Kalite · Eğitim ihtiyacı · Durum.
**Form alanları:** —
**Detay sekmeleri:** —
**İşlem butonları:** `GV.pageHead` — "Eğitim ve Yetkinlik" + "Yeni Değerlendirme" (`app-performans-form.html`). `rowActions[]` 2 — **Değerlendirme detayı** (`GV.modal`, 14 satırlık tablo; "Açık" dönemde toast ile reddediliyor) · **Personel kartı**.
**Toplu işlemler:** `bulk[]` 1 — **Dışa aktar**. Yetki kapısı yok.
**Bildirimler:** `GV.toast('Bu dönem henüz doldurulmadı.','info')` · `GV.modal` değerlendirme dökümü (alt notu: "Bu veriler karar desteğidir; sistem otomatik karar vermez"). `GV.notice` / `GV.result` yok.
**Yetkilendirme:** `GV.perm.can(...)` çağrısı **yok**. Alan maskeleme yok — **puanlar her role açık** (bulgu adayı). 403 kapısı yok.
**Boş durum:** `GV.empty` — "Bu görünümde değerlendirme yok" + açıklama. **Aksiyon tanımlı değil**.
**Hata durumu:** `GV.errorState` yok.
**Mobil görünüm:** `mobile(x)` var — ad + dönem çipi, yönetici puanı, durum rozeti.
**Kabul kriterleri:**
- `durum` kolonu ham değeri değil sözlük karşılığını basar (`Açık → Bekliyor`), filtre ise ham değeri kullanır.
- "Değerlendirme detayı" modalı yalnız tamamlanmış dönemde içerik gösterir.
**Bulgular:** (a) `rowActions.detay`'da `show(row)` yok — açık dönemde de buton basılıyor. (b) `emptyState.action` yok. (c) Performans puanları için alan maskeleme yok; `app-performans-form.html` ise yönetici/PM puanını `can('onay')` ile kapatıyor — liste ile form arasında yetki ekseni ayrışıyor.

---

### `app-performans-form.html` — Yeni / Düzenle Performans Değerlendirmesi

**Tip:** form
**Bölüm:** `SECTIONS.personel` — menüde yok, şuradan bağlanır: `app-performans.html` "Yeni Değerlendirme".
**Amaç:** Bir personelin çeyrek dönem değerlendirmesini puan, oran, eğitim ihtiyacı ve gelişim planıyla kaydetmek.
**Kullanıcılar:** `personel` bölümü olan 9 rol; yazma için `can('ekle')`/`can('duzenle')`, karar alanları için ayrıca `can('onay')`.
**Veri kaynağı:** `DB.performance` · `DB.employees` · `DB.departments` · `DB.trainings` · `DB.tasks` · `DB.activities` · `DB.today`
**Üst özet kartları:** yok — dört canlı kart: **Türetilen Puanlar**, **Görev Ekseni Karşılaştırması**, **Gelişim ve Eğitim Bağlamı**, düzenlemede ayrıca **Kayıt Özeti** (17 satır).
**Sekmeler:** yok
**Arama:** yok
**Filtreler:** yok
**Tablo kolonları:** —
**Form alanları:** `GV.form` `sections[]` 6 bölüm — sabit **16 alan** + veriden türeyen eğitim konusu onay kutuları; 3 zorunlu:
- **Değerlendirilen personel ve dönem** — Personel* , Değerlendirme dönemi* , *(yalnız `can('onay')`)* Değerlendirme durumu*.
- **Değerlendirme puanları** — Öz değerlendirme, Görev kalite sonucu + *(yalnız `can('onay')`)* Yönetici değerlendirmesi, Proje yöneticisi değerlendirmesi.
- **Yetkinlik puanları** — 5 alan (Problem çözme, Teknik gelişim, Ekip çalışması, Departmanlar arası iletişim, Müşteri geri bildirimi).
- **Dönem çıktıları — görev ekseni** — Tamamlanan görev sayısı, Zamanında teslim oranı (`percent`), Revizyon oranı (`percent`).
- **Eğitim ihtiyacı ve gelişim planı** — `DB.performance[].egitimIhtiyaci`'ndan türeyen `checkbox` grubu + "Listede olmayan eğitim ihtiyaçları" + Gelişim planı (`textarea`).
- **Kayıt durumu** — 1 alan (`switch`).
**Detay sekmeleri:** —
**İşlem butonları:** `GV.pageHead` — "Vazgeç" (`app-performans.html`) + "Kaydet"/"Değişiklikleri kaydet" (`run:kaydet`); form altında `#kaydetAlt`.
**Toplu işlemler:** yok
**Bildirimler:** `GV.notice` — "Bu ekran karar desteğidir, otomatik karar üretmez" (`warn`), "Ücret ekseni bu forma girmez" (`neutral`), kapsam notu (`neutral`), bağlı kayıt notu (`info`/`neutral`), genel puan hesabı (`neutral`), görev ekseni ölçümü (`info`). `GV.toast` kaydetme akışında. `GV.result` yok.
**Yetkilendirme:** `can('ekle')`/`can('duzenle')` → yoksa `GV.errorState` ile **403** ve form hiç kurulmaz. `can('onay')` → dönemi kapatan **Değerlendirme durumu** ve karara bağlayan **Yönetici / Proje yöneticisi puanı** alanları forma hiç basılmaz; düzenleme modunda kayıttaki değerlerine de dokunulmaz.
**Boş durum:** `?id=` var ama kayıt yoksa `GV.empty` + "Performans listesine dön".
**Hata durumu:** `GV.errorState` **var** (403).
**Mobil görünüm:** `mobile(r)` yok; kart yığını ≤760px'de tek sütun.
**Kabul kriterleri:**
- Puan ölçeği **varsayılmaz, veriden ölçülür** (`DB.performance` içindeki en büyük puan → 0–5).
- Bir personelin bir dönemde yalnız bir değerlendirmesi olur (`ayniDonemKaydi` çift yönlü doğrular).
- Gelecek dönem için değerlendirme açılamaz (`donem > BU_DONEM` reddedilir).
- Genel puan ve yetkinlik ortalaması elle girilmez; puanlar değiştikçe canlı kartta yeniden hesaplanır.
**Bulgular:** Görev sayısı / zamanında teslim / revizyon oranı `DB.tasks`'tan **türetilemiyor** (görevde çeyrek ekseni yok, tamamlanma tarihi 25 görevin 4'ünde dolu) — ekran bunu ölçüp yazıyor ve alanları elle girdiriyor; ölçülen kesit yalnız karşılaştırma kartında gösteriliyor.

---

### `app-egitim.html` — Eğitim ve Yetkinlik

**Tip:** liste + özel kırılım matrisi
**Bölüm:** `SECTIONS.personel` → menü etiketi **Eğitim ve Yetkinlik**
**Amaç:** Planlanan ve tamamlanan eğitimleri katılımcı, süre ve maliyet ekseniyle yönetmek; eğitim × personel kırılımını göstermek.
**Kullanıcılar:** `personel` bölümü olan 9 rol.
**Veri kaynağı:** `DB.trainings` (kaynak) · `DB.employees` · `DB.departments` · `DB.emp` / `DB.empName` / `DB.dep` / `DB.roleName` · `DB.today`
**Üst özet kartları:** `kpis[]` 6 — **Toplam eğitim** · **Tamamlanan** · **Planlanan** · **Toplam eğitim saati** (meta: kişi·saat) · **Toplam eğitim maliyeti** (finans yetkisine tabi) · **Eğitim alan personel** (meta: katılım kaydı sayısı).
**Sekmeler:** `tabs[]` 5 — `tumu` · `plan` Planlandı · `tamam` Tamamlandı · `buyil` Bu Yıl · `ucretsiz` Ücretsiz (`maliyet === 0`).
**Arama:** `search.fields` = `kod · ad · tur · saglayici · durum`; **`search.extra`** = katılımcıların ad + departman adı birleşimi.
**Filtreler:** `durum` select · `kisi` select (yalnız katılımcısı olan personel) + `test` · `dep` multi (yalnız katılımcısı olan departman) + `test` · `baslangic` daterange · `tur` multi (veriden türetilen tür kümesi) · *(yalnız `can('finans')`)* `maliyetAralik` select + `test` (4 aralık).
**Tablo kolonları:** Eğitim kodu · Eğitim · Tür · **Sağlayıcı (varsayılan gizli)** · Katılımcılar · Başlangıç · Bitiş · Süre · **Kişi·saat (varsayılan gizli)** · Kişi başı maliyet · Toplam maliyet · **Sertifika (varsayılan gizli)** · Durum.
**Form alanları:** —
**Detay sekmeleri:** —
**İşlem butonları:** `GV.pageHead` — "Performans" + "Personel". `rowActions[]` — **Katılımcıları gör** (`GV.drawer`: özet + katılımcı kartları + iki bağlantı) · *(yalnız `can('duzenle')`, `show(t)` ile zaten tamamlanmış kayıtta hiç basılmaz)* **Tamamlandı işaretle**.
**Toplu işlemler:** `bulk[]` — *(yalnız `can('duzenle')`)* **Tamamlandı işaretle** (`confirm:'Seçili {n} eğitim…'`, zaten tamam olanları atlar) · her rolde **Çıktı al**. Yetki kapısı **var**.
**Bildirimler:** `GV.confirm` tamamlama öncesi (`warn`) · `GV.toast` "`EGT-…` tamamlandı olarak işaretlendi" (`ok`), toplu işlemde "N eğitim tamamlandı işaretlendi · M kayıt zaten tamamdı, atlandı" (`ok`/`info`) · `GV.drawer` katılımcı paneli. `GV.notice` / `GV.result` yok.
**Yetkilendirme:** `GV.perm.can('finans')` → kişi başı ve toplam maliyet hücreleri, KPI biçimlendirmesi ve **maliyet aralığı filtresi** maskelenir/hiç kurulmaz. `GV.perm.can('duzenle')` → tamamlama satır aksiyonu ve toplu işlemi hiç basılmaz. 403 kapısı yok.
**Boş durum:** `GV.empty` liste için ("Bu görünümde eğitim kaydı yok"); kırılım için ayrı `GV.empty` ("Katılım kaydı yok"). Liste boş durumunda **aksiyon yok**.
**Hata durumu:** `GV.errorState` yok.
**Mobil görünüm:** `mobile(t)` var; `card(t)` var (`views:['table','card']`). Kırılım matrisi `.gv-tablewrap.is-sticky1` + ≤760px için `.gv-cardlist` karşılığı **üretiliyor** (components.md §6 kuralına uygun).
**Kabul kriterleri:**
- Katılım kırılımı `DB.trainings[].katilimci` dizisinden türetilir; ikinci bir veri kümesi tanımlanmaz.
- Kişi başı maliyet = `maliyet / katılımcı sayısı`, yuvarlanır; finans yetkisi yoksa hiç üretilmez.
- Durum değişince hem liste hem kırılım tazelenir (`tazele()`).
**Bulgular:** `emptyState.action` yok.

---

### `app-demirbas.html` — Demirbaşlar

**Tip:** liste
**Bölüm:** `SECTIONS.varlik` (`Envanter` / `Demirbaş ve Filo`) → menü etiketi **Demirbaşlar**
**Amaç:** Donanım, yazılım lisansı ve abonelik envanterini zimmet, garanti ve değer ekseniyle yönetmek.
**Kullanıcılar:** `SEC_BY_ROLE`'da `varlik` bölümü olan 9 rol — `sahip` · `genelmudur` · `sistem` · `operasyon` · `devops` · `ik` · `muhasebe` · `satinalma` · `idari`.
**Veri kaynağı:** `DB.assets` (kaynak) · `DB.assetCategories` · `DB.assignments` · `DB.employees` · `DB.departments` · `DB.suppliers` · `DB.today`
**Üst özet kartları:** `kpis[]` 4 — **Toplam demirbaş** · **Zimmetli** · **Depoda bekleyen** · **Toplam değer** (finans yetkisi yoksa 0).
**Sekmeler:** `tabs[]` 7 — `aktif` · `zimmetli` · `depo` Depoda · `lisans` Lisans ve Abonelik · `garanti` Garantisi Bitenler (≤90 gün) · `hurda` Hurda / Pasif · `tumu`.
**Arama:** `search.fields` = `kod · marka · model · seri · barkod · kategori · ozellik`. `search.extra` yok.
**Filtreler:** `kategori` multi (`DB.assetCategories`) · `durum` multi (6 değer) · `dep` multi · `zimmetli` select · `tedarikci` select (`DB.suppliers`) · `alisTarihi` daterange.
**Tablo kolonları:** Demirbaş · Kategori · **Seri numarası (varsayılan gizli)** · Zimmetli personel · Departman · **Lokasyon (varsayılan gizli)** · **Satın alma (varsayılan gizli)** · Alış fiyatı · Garanti bitişi · Durum.
**Form alanları:** — (modal içinde elle kurulmuş 3 alanlı zimmetleme: Personel, Teslim tarihi, Tutanak oluştur)
**Detay sekmeleri:** —
**İşlem butonları:** `GV.pageHead` — "Zimmetler" + "Yeni Demirbaş" (`app-demirbas-form.html`). `rowActions[]` 3 — **Kartı aç** · **Zimmetle** (`GV.modal`; `DB.assignments`'a gerçek tutanak yazar) · **İade al** (`GV.confirm`; tutanağı kapatır, kartı depoya alır).
**Toplu işlemler:** `bulk[]` 3 — **Departman değiştir** · **Dışa aktar** · **Hurdaya ayır** (`tone:'danger'`, `confirm` metni var). Yetki kapısı yok.
**Bildirimler:** `GV.toast` — "Bu demirbaş zaten … üzerinde." (`info`), "`DMB-…` → `<ad>` zimmetlendi" (`ok`), "Bu demirbaş zimmetli değil." (`info`), "`DMB-…` iade alındı" (`ok`). `GV.confirm` iade öncesi. `GV.notice` / `GV.result` yok.
**Yetkilendirme:** `GV.perm.can('finans')` → alış fiyatı hücresi `cell-mask`, KPI "Toplam değer" sıfırlanır, kart görünümünde tutar hiç basılmaz. 403 kapısı yok.
**Boş durum:** `GV.empty` — "Bu görünümde demirbaş yok" + açıklama. **Aksiyon tanımlı değil**.
**Hata durumu:** `GV.errorState` yok.
**Mobil görünüm:** `mobile(x)` var; `card(x)` var (`views:['table','card']`).
**Kabul kriterleri:**
- Zimmetleme hem `DB.assets` kartını hem `DB.assignments` tutanağını günceller; iade ikisini birlikte kapatır.
- Garanti bitişine ≤30 gün kalan satır `is-late` sınıfını alır.
- Finans yetkisi olmayan rolde alış fiyatı hem ekranda hem çıktıda maskelidir.
**Bulgular:** (a) `rowActions` "Zimmetle" / "İade al" aksiyonlarında `show(row)` yok — uygun olmayan satırda da basılıp toast'la reddediliyor. (b) `bulk[]`'te yetki kapısı yok; "Hurdaya ayır" yıkıcı işlemi her role açık. (c) `emptyState.action` yok.

---

### `app-demirbas-detay.html` — Demirbaş Kartı

**Tip:** detay (6 sekme)
**Bölüm:** `SECTIONS.varlik` — menüde yok, şuradan bağlanır: `app-demirbas.html` kolon/satır bağlantısı, `app-zimmet.html`, `app-zimmet-form.html` 403 kartı.
**Amaç:** Bir demirbaşın kimliğini, zimmet geçmişini, garanti/lisans dönemini ve satın alma bağını tek kayıtta toplamak.
**Kullanıcılar:** `varlik` bölümü olan 9 rol.
**Veri kaynağı:** `DB.assets` · `DB.assignments` · `DB.suppliers` · `DB.orders` · `DB.purchases` · `DB.maintenance` · `DB.employees` · `DB.departments` · `DB.activities` · `DB.today`
**Üst özet kartları:** yok — sağ sütunda dört kart: **Özet** (10 satır) · **Takvim ve Süre** (4 satır) · **Tedarik** (5 satır) · **Son Hareket**.
**Sekmeler:** `GV.tabs('#recTabs')` — 6 sekme.
**Arama:** yok
**Filtreler:** yok
**Tablo kolonları:** Sekme içi tablolar.
**Form alanları:** — (modal içinde elle kurulmuş 3 alanlı zimmetleme)
**Detay sekmeleri:**
1. **Genel** — canonical doğrulama `GV.notice` yığını (4 çelişki kuralı) + Demirbaş Kimliği (10), Satın Alma ve Tedarik (7), Garanti/Lisans Bilgileri (5), Konum ve Sorumluluk (6).
2. **Zimmet Geçmişi** — imza bekleyen tutanak uyarısı + güncel zimmet `dl` + tam tutanak tablosu (kullanım günü hesaplı).
3. **Garanti ve Lisans** — 60/30/15/7 gün ve "süresi doldu" eşiklerine göre altı ayrı `GV.notice` dalı + 12 satırlık künye + lisansta "Yenileme Penceresi" bölümü.
4. **Satın Alma** — para ekseni notu (`info`), sipariş bağı notu (`ok` bağ varsa / `info` yoksa), kayıttaki satın alma bilgisi, bu demirbaşın siparişi, tedarikçinin tüm siparişleri tablosu (net/KDV/brüt ayrı kolon).
5. **Bakım ve Onarım** — `DB.maintenance` yalnız `arac` alanı taşıdığı için filtre bugünkü veride **her zaman boş döner**; ekran bunu `GV.notice` ile açıkça yazıyor.
6. **Aktivite Geçmişi** — `GV.activity(acts)`.
**İşlem butonları:** `GV.pageHead` — "Demirbaş listesi" · "Zimmetler" · *(yalnız `can('duzenle')` ve aktif kayıt)* **"İade Al"** (durum Zimmetli ise) ya da **"Zimmetle"**.
**Toplu işlemler:** yok
**Bildirimler:** `GV.notice` — canonical doğrulama (4 kural: tutanaksız zimmetli, personel eşleşmiyor, tarih eşleşmiyor, kapatılmamış tutanak), imza bekleyen tutanak (`warn`), finans maskesi (`neutral`), lisans dönemi notu (`neutral`), para ekseni (`info`), sipariş bağı (`ok`/`info`), bakım kapsamı (`neutral`). `GV.confirm` iade öncesi. `GV.toast` zimmetleme/iade sonrası (`ok`). `GV.result` yok.
**Yetkilendirme:** `GV.perm.can('finans')` → alış fiyatı, sipariş net/KDV/brüt, bakım maliyeti maskelenir + gerekçe `GV.notice`'ı. `GV.perm.can('duzenle')` → zimmetle/iade aksiyonları hiç basılmaz. 403 kapısı yok.
**Boş durum:** `?id=` bulunamazsa `GV.empty` + "Demirbaş listesine dön"; sekme içi boş durumlar (aktif zimmet yok, tutanak yok, sipariş bağı yok, tedarikçi siparişi yok, bakım kaydı yok, aktivite yok).
**Hata durumu:** `GV.errorState` yok.
**Mobil görünüm:** `mobile(r)` yok; tablolar `.gv-tablewrap.is-mobilescroll`.
**Kabul kriterleri:**
- `DB.assets[].alisFiyati` **NET** olarak etiketlenir ("KDV hariç") ve sipariş tablosunda net/brüt ayrı kolonlarda durur (components.md §9b).
- Sipariş bağı yalnız `DB.assets[].siparis` alanından okunur; tedarikçi eşleşmesi "bağ değildir" diye etiketlenir (ders L-13).
- Kart ↔ tutanak çelişkisi 4 kuralla denetlenir ve çelişki bulunursa Genel sekmesinin başında yazılır.
**Bulgular:** Kayıt başlığındaki `<h1>` + `GV.pageHead`'in `<h1>`'i → sayfada iki `<h1>`.

---

### `app-demirbas-form.html` — Yeni / Düzenle Demirbaş

**Tip:** form
**Bölüm:** `SECTIONS.varlik` — menüde yok, şuradan bağlanır: `app-demirbas.html` "Yeni Demirbaş".
**Amaç:** Demirbaş künyesini kimlik, satın alma, garanti/lisans ve konum ekseniyle açmak ya da düzeltmek.
**Kullanıcılar:** `varlik` bölümü olan 9 rol; yazma için `can('ekle')`/`can('duzenle')`.
**Veri kaynağı:** `DB.assets` · `DB.assetCategories` · `DB.suppliers` · `DB.orders` · `DB.purchases` · `DB.assignments` · `DB.employees` · `DB.departments` · `DB.vehicles` · `DB.activities` · `DB.today`
**Üst özet kartları:** yok — canlı **sipariş özeti** kartı + düzenlemede Kayıt Özeti.
**Sekmeler:** yok
**Arama:** yok
**Filtreler:** yok
**Tablo kolonları:** —
**Form alanları:** `GV.form` `sections[]` 5 bölüm / **20 alan** (finans yetkisiyle), 12 zorunlu:
- **Demirbaş kimliği** — 7 alan; zorunlu: Kategori, Marka, Model, Seri numarası, Barkod, Teknik özellik.
- **Satın alma ve tedarik** — 4 alan; zorunlu: Satın alma tarihi, *(finans)* Satın alma tutarı (KDV hariç), Tedarikçi. Bağlı sipariş opsiyonel.
- **Garanti ve lisans dönemi** — 2 alan (Garanti/lisans başlangıcı, bitişi); zorunlu yok.
- **Konum, sorumluluk ve durum** — 6 alan; zorunlu: Lokasyon, Sorumlu departman, Demirbaş durumu.
- **Kayıt durumu** — 1 alan (`switch`).
**Detay sekmeleri:** —
**İşlem butonları:** `GV.pageHead` — "Vazgeç" (`app-demirbas.html`) + "Kaydet"/"Değişiklikleri kaydet"; form altında `#kaydetAlt`.
**Toplu işlemler:** yok
**Bildirimler:** `GV.notice` — form kapsamı (kart dışı bölümler), bağlı kayıt notu, yeni kayıt akışı, sipariş özeti (bağ yoksa `info`). `GV.toast` kaydetme akışında. `GV.result` yok.
**Yetkilendirme:** `can('ekle')`/`can('duzenle')` → yoksa `GV.errorState` ile **403**, form hiç kurulmaz. `can('finans')` → "Satın alma tutarı" alanı forma **hiç basılmaz**.
**Boş durum:** `?id=` var ama kayıt yoksa `GV.empty` + "Demirbaş listesine dön".
**Hata durumu:** `GV.errorState` **var** (403).
**Mobil görünüm:** `mobile(r)` yok.
**Kabul kriterleri:**
- Seri numarası ve barkod envanterde tekildir; barkod biçimi `GW-DMB-0000` doğrulanır.
- Bağlı sipariş yalnız "Teslim alındı" durumundaki siparişten seçilebilir ve tedarikçisi demirbaşınkiyle aynı olmalıdır.
- Aynı siparişe bağlı demirbaşların Σ `alisFiyati` siparişin **netini** aşamaz (canonical eksen 15).
- Durum "Zimmetli" ise zimmetli personel ve zimmet tarihi zorunlu; zimmetli demirbaş arşivlenemez.
**Bulgular:** yok

---

### `app-zimmet.html` — Zimmetler

**Tip:** liste
**Bölüm:** `SECTIONS.varlik` → menü etiketi **Zimmetler**
**Amaç:** Demirbaş teslim tutanaklarını imza, iade ve hasar ekseniyle takip etmek.
**Kullanıcılar:** `varlik` bölümü olan 9 rol.
**Veri kaynağı:** `DB.assignments` (kaynak) · `DB.assets` · `DB.employees` · `DB.emp` / `DB.empName` · `DB.today`
**Üst özet kartları:** `kpis[]` 4 — **Aktif zimmet** · **İmza bekleyen** (`personelOnay === 'Bekliyor'`) · **İade edilen** · **Hasar kaydı**.
**Sekmeler:** `tabs[]` 5 — `aktif` · `imza` İmza Bekleyenler · `iade` İade Edilenler · `hasar` Hasarlı İadeler · `tumu`.
**Arama:** `search.fields` = `kod · demirbas · personel · durum · hasar`. `search.extra` yok — **demirbaş marka/model ve personel adı aramada taranmıyor** (bulgu).
**Filtreler:** `durum` select (Aktif / İade edildi) · `personel` select · `personelOnay` select · `teslimTarihi` daterange.
**Tablo kolonları:** Demirbaş · Kategori · Personel · Teslim tarihi · İade tarihi · Tutanak · Personel onayı · Hasar / eksik · Durum. Varsayılan gizli kolon yok.
**Form alanları:** —
**Detay sekmeleri:** —
**İşlem butonları:** `GV.pageHead` — "Demirbaşlar" + "Yeni Zimmet" (`app-zimmet-form.html`). `rowActions[]` 2 — **Teslim tutanağı** (`GV.modal`, 8 satırlık `gv-dl` + "Yazdır" aksiyonu `window.print()`) · **Personel onayını al** (`GV.confirm` → `personelOnay = 'Onaylandı'`).
**Toplu işlemler:** `bulk[]` 1 — **Dışa aktar**. Yetki kapısı yok.
**Bildirimler:** `GV.toast` — "Bu tutanak zaten imzalanmış." (`info`), "Tutanak onaylandı" (`ok`). `GV.confirm` onay öncesi. `GV.modal` tutanak önizlemesi. `GV.notice` / `GV.result` yok.
**Yetkilendirme:** `GV.perm.can(...)` çağrısı **yok** — tutanak onayı her role açık (bulgu). Alan maskeleme yok. 403 kapısı yok.
**Boş durum:** `GV.empty` — "Bu görünümde zimmet kaydı yok" + açıklama. **Aksiyon tanımlı değil**.
**Hata durumu:** `GV.errorState` yok.
**Mobil görünüm:** `mobile(x)` var — marka+model + durum, kod · personel, teslim tarihi.
**Kabul kriterleri:**
- `personelOnay === 'Bekliyor'` olan satır `is-late` sınıfını alır ve KPI "İmza bekleyen" ile aynı kümeyi sayar.
- Tutanak modalı demirbaş kartından seri numarası ve personel kartından departman çözer.
**Bulgular:** (a) Tutanak dosyası bağlantısı `data-wip="Zimmet tutanağı"` — hedef ekran yok. (b) Onay aksiyonunda hiçbir `GV.perm.can` kapısı yok; `app-demirbas-detay.html` aynı işlemi `can('duzenle')`'ye bağlıyor → iki ekran arasında yetki ekseni ayrışıyor. (c) `emptyState.action` yok.

---

### `app-zimmet-form.html` — Yeni / Düzenle Zimmet

**Tip:** form
**Bölüm:** `SECTIONS.varlik` — menüde yok, şuradan bağlanır: `app-zimmet.html` "Yeni Zimmet"; `?demirbas=DMB-…` ile ön doldurma destekli.
**Amaç:** Demirbaş teslim tutanağını personel, tarih, dijital onay ve iade ekseniyle tek kayıtta tutmak.
**Kullanıcılar:** `varlik` bölümü olan 9 rol; yazma için `can('ekle')`/`can('duzenle')`.
**Veri kaynağı:** `DB.assignments` · `DB.assets` · `DB.vehicles` · `DB.employees` · `DB.activities` · `DB.today`
**Üst özet kartları:** yok — canlı **"demirbaş kartına ne yazılacak"** özeti (`#dmbOzet`).
**Sekmeler:** yok
**Arama:** yok
**Filtreler:** yok
**Tablo kolonları:** —
**Form alanları:** `GV.form` `sections[]` 5 bölüm / **9 alan**, 5 zorunlu:
- **Zimmetlenen demirbaş** — 1 alan (Demirbaş*); açık tutanağı olan, hurda ve arşiv kayıtlar seçeneklerden elenir.
- **Teslim** — 2 alan; ikisi de zorunlu (Zimmetlenen personel, Teslim tarihi).
- **Dijital onay** — 2 alan (Personel onayı*, Onay tarihi).
- **İade** — 3 alan (Zimmet durumu*, İade tarihi, Hasar / eksik ekipman notu).
- **Kayıt durumu** — 1 alan (`switch`).
**Detay sekmeleri:** —
**İşlem butonları:** `GV.pageHead` — "Vazgeç" (`app-zimmet.html`) + "Kaydet"/"Değişiklikleri kaydet"; form altında `#kaydetAlt`.
**Toplu işlemler:** yok
**Bildirimler:** `GV.notice` (bağlam ve kapsam notları) · `GV.toast` (kaydetme akışı). `GV.result` yok.
**Yetkilendirme:** `can('ekle')`/`can('duzenle')` → yoksa `GV.errorState` ile **403**, form hiç kurulmaz. `can('finans')` → demirbaşın alış bedeli (NET) özet kartında maskelenir; forma zaten para alanı basılmaz.
**Boş durum:** `?id=` var ama kayıt yoksa `GV.empty` + "Zimmet listesine dön".
**Hata durumu:** `GV.errorState` **var** (403).
**Mobil görünüm:** `mobile(r)` yok.
**Kabul kriterleri:**
- Bir demirbaşın aynı anda tek aktif zimmeti olur; düzenlenen kaydın kendisi kısıttan hariç tutulur.
- Onay tarihi yalnız "Onaylandı" durumunda, iade tarihi yalnız "İade edildi" durumunda yazılır.
- Hasar notu yalnız iade kontrolünde doldurulur; aktif zimmette reddedilir.
- Aktif zimmet arşivlenemez.
**Bulgular:** yok

---

### `app-arac.html` — Araçlar ve Filo

**Tip:** liste
**Bölüm:** `SECTIONS.varlik` → menü etiketi **Araçlar** (grup başlığı `Araç ve Filo`)
**Amaç:** Filodaki araçları mülkiyet, kullanım, kilometre, bakım/muayene/sigorta yenilemesi ve gider ekseniyle listelemek.
**Kullanıcılar:** `varlik` bölümü olan 9 rol.
**Veri kaynağı:** `DB.vehicles` (kaynak) · `DB.policies` · `DB.inspections` · `DB.vehicleExpenses` · `DB.employees` · `DB.empName`
**Üst özet kartları:** `kpis[]` 4 — **Toplam araç** · **Serviste** · **Yaklaşan yenileme** (trafik sigortası ya da muayene `kalanGun ≤ 60`) · **Toplam gider** (finans yetkisi yoksa 0).
**Sekmeler:** `tabs[]` 7 — `aktif` Tüm Araçlar · `tahsisli` Personele Tahsisli · `ortak` Ortak Kullanım · `kiralik` Kiralık · `serviste` · `uyari` Yenileme Uyarısı · `tumu`.
**Arama:** `search.fields` = `kod · plaka · marka · model · sasi · motorNo · tip`. `search.extra` yok — placeholder "sürücü ara" diyor ama **sürücü adı taranmıyor** (bulgu).
**Filtreler:** `tip` multi · `yakit` multi · `mulkiyet` multi · `kullanim` multi · `anaSurucu` select · `durum` select.
**Tablo kolonları:** Araç · Tip / yakıt · Mülkiyet · Kullanım · Güncel km · Sonraki bakım · Muayene · **Trafik sigortası (varsayılan gizli)** · **Kasko (varsayılan gizli)** · Toplam gider · Durum.
**Form alanları:** — (modal içinde 1 alanlı kilometre güncelleme)
**Detay sekmeleri:** —
**İşlem butonları:** `GV.pageHead` — "Bakım" (`app-arac-bakim.html`) + "Yeni Araç" (`app-arac-form.html`). `rowActions[]` 3 — **Araç kartını aç** · **Bakım kayıtları** (`app-arac-bakim.html?f_arac=`) · **Kilometre güncelle** (`GV.modal`; geri gitmeyi reddeder, bakım eşiği aşılırsa `warn` toast).
**Toplu işlemler:** `bulk[]` 2 — **Sürücü ata** · **Dışa aktar**. Yetki kapısı yok.
**Bildirimler:** `GV.toast` — "Yeni kilometre mevcut değerden küçük olamaz" (`danger`), "Bakım kilometresi aşıldı — bakım planlaması gerekiyor" (`warn`, 5 sn), "Kilometre güncellendi" (`ok`). `GV.notice` / `GV.result` yok.
**Yetkilendirme:** `GV.perm.can('finans')` → "Toplam gider" kolonu ve KPI maskelenir. Kiralık aracın aylık kirası ise "Mülkiyet" kolonunda **maskesiz** basılıyor (bulgu). 403 kapısı yok.
**Boş durum:** `GV.empty` — "Bu görünümde araç yok" + açıklama. **Aksiyon tanımlı değil**.
**Hata durumu:** `GV.errorState` yok.
**Mobil görünüm:** `mobile(x)` var; `card(x)` var (`views:['table','card']`).
**Kabul kriterleri:**
- Trafik sigortası ya da muayenesi ≤30 gün kalan araç `is-late` sınıfını alır; ≤60 gün "Yenileme Uyarısı" sekmesine düşer.
- Kilometre yalnız artabilir; bakım kilometresi aşıldığında ayrı bir uyarı basılır.
**Bulgular:** `mulkiyet` kolonunun alt satırında `F.money(x.aylikKira)` **finans yetkisi denetlenmeden** basılıyor — aynı ekranın "Toplam gider" kolonu maskeliyken kira tutarı açık kalıyor.

---

### `app-arac-detay.html` — Araç Kartı

**Tip:** detay (10 sekme)
**Bölüm:** `SECTIONS.varlik` — menüde yok, şuradan bağlanır: `app-arac.html` ve **altı filo listesinin tamamı** (`bakim` · `muayene` · `sigorta` · `yakit` · `gider` · `kaza`) satır aksiyonlarından.
**Amaç:** Bir aracın kimliğini, tahsisini, bakım/muayene/poliçe/yakıt/gider/kaza geçmişini ve toplam maliyetini tek kayıtta toplamak.
**Kullanıcılar:** `varlik` bölümü olan 9 rol.
**Veri kaynağı:** `DB.vehicles` · `DB.assignments` · `DB.maintenance` · `DB.inspections` · `DB.policies` · `DB.fuelLogs` · `DB.vehicleExpenses` · `DB.accidents` · `DB.fines` · `DB.activities` · `DB.employees` · `DB.departments`
**Üst özet kartları:** `kpis[]` yok; **Maliyet Özeti** sekmesinde 4 elle kurulmuş KPI kartı (Toplam kayıtlı maliyet, Aylık ortalama, Yıllık projeksiyon, Kilometre başına maliyet). Sağ sütunda üç kart: **Özet** (10 satır) · **Yenileme Takvimi** · **Son Hareket**.
**Sekmeler:** `GV.tabs('#recTabs')` — **10 sekme**: `genel` · `zimmet` · `bakim` · `muayene` · `sigorta` (Sigorta ve Kasko) · `yakit` · `gider` (Giderler) · `kaza` (Kaza ve Ceza) · `maliyet` (Maliyet Özeti) · `aktivite` (Aktivite Geçmişi).
**Arama:** yok
**Filtreler:** yok
**Tablo kolonları:** Sekme içi tablolar.
**Form alanları:** — (modal içinde elle kurulmuş 5 alanlı bakım kaydı: Bakım türü, Planlanan tarih, Bakım km, Servis, Yapılacak işlemler)
**Detay sekmeleri:**
1. **Genel** — Araç Kimliği (8), Teknik Bilgiler (5), Mülkiyet ve Edinim (4 + kiralıkta 6 ek satır), Kullanım ve Sorumluluk (6), Kilometre ve Bakım (5).
2. **Zimmet** — güncel tahsis `dl` + `DB.assignments` tutanak tablosu (araç için `arac` ya da `demirbas` alanıyla yakalanır).
3. **Bakım** — açık bakım uyarısı (`GV.notice`, kalan güne göre ton) + bakım tablosu (9 kolon) + toplam.
4. **Muayene** — geçerlilik uyarısı + muayene tablosu (9 kolon, kalan gün rozetli).
5. **Sigorta ve Kasko** — 60 gün eşiğinde poliçe uyarıları + trafik/kasko ayrı tablolar + kasko teminat detayı (6 satır) + trafik teminatı (3 satır).
6. **Yakıt** — tüketim özeti (6 satır; ortalama tüketim tam depo yöntemiyle en az iki dolumdan) + dolum tablosu (8 kolon).
7. **Giderler** — gider tablosu (6 kolon) + toplam.
8. **Kaza ve Ceza** — kaza tablosu (11 kolon) + ceza tablosu (8 kolon) + ödenmemiş ceza toplamı.
9. **Maliyet Özeti** — hesap yöntemi `GV.notice`'ı, 4 KPI, maliyet kırılımı tablosu (kalem · kaynak koleksiyon · kayıt · tutar · pay), Dönem ve Esaslar (6 satır).
10. **Aktivite Geçmişi** — `GV.activity(acts)`.
**İşlem butonları:** `GV.pageHead` — "Araç Listesi" + *(yalnız `can('ekle')`)* **"Bakım Kaydı Ekle"** (`GV.modal`, `DB.maintenance` ve `DB.activities`'e gerçekten yazar; aracın `sonrakiBakim*` alanlarını da günceller). Bakım sekmesinin boş durumunda ikinci `#btnBakim2` butonu aynı modalı açar (`GV.on(document,…,'bakim')` tekil anahtarla).
**Toplu işlemler:** yok
**Bildirimler:** `GV.notice` — finans maskesi (`neutral`), açık bakım (kalan güne göre `danger`/`warn`/`info`/`ok`), muayene geçerliliği, poliçe bitişi (trafik ve kasko ayrı ayrı), maliyet hesabı açıklaması. `GV.toast` — "Servis adı zorunludur" / "Planlanan tarih zorunludur" / "Bakım kilometresi güncel kilometreden küçük olamaz" (`danger`), "`BKM-…` bakım kaydı oluşturuldu" (`ok`). `GV.result` yok.
**Yetkilendirme:** `GV.perm.can('finans')` → bakım maliyeti, poliçe primi, kasko bedeli, yakıt tutarı/birim fiyatı, gider tutarı, onarım maliyeti, ceza tutarı ve **tüm maliyet KPI'ları** maskelenir + gerekçe `GV.notice`'ı. `GV.perm.can('ekle')` → bakım ekleme aksiyonu hiç basılmaz. 403 kapısı yok.
**Boş durum:** `?id=` bulunamazsa `GV.empty` + "Araç listesine dön"; sekme içi boş durumlar (zimmet tutanağı yok, bakım kaydı yok, muayene kaydı yok, trafik/kasko poliçesi yok, yakıt kaydı yok, gider kaydı yok, kaza kaydı yok, ceza kaydı yok, aktivite yok).
**Hata durumu:** `GV.errorState` yok.
**Mobil görünüm:** `mobile(r)` yok; tablolar `.gv-tablewrap.is-mobilescroll`.
**Kabul kriterleri:**
- Toplam maliyet **çift sayım yapmaz**: `DB.vehicleExpenses`'taki Yakıt/Bakım/Sigorta/Kasko kalemleri kendi koleksiyonlarından sayıldığı için "diğer" toplamına girmez.
- Filo para ekseni **BRÜT**tür (`maintenance.maliyet` · `policies.prim` · `vehicleExpenses.tutar` · `fuelLogs.tutar`) ve ekranda "ödenen tutar" olarak okunur (components.md §9b).
- Dönem başlangıcı kiralıkta `sozlesmeBas`, satın alınanda `alisTarihi`'dir; aylık ortalama bu dönemden bölünür.
- Ödenmemiş cezalar toplama katılmaz, ayrıca uyarı satırı olarak yazılır.
**Bulgular:** (a) Maliyet KPI'ları `.kpi-grid` içinde **`.kpi`** sınıfıyla elle kuruluyor — components.md §6 sözlüğü `.kpi-grid > .kpi-card` diyor; sınıf adı sözlükle uyuşmuyor. (b) Kayıt başlığındaki `<h1>` + `GV.pageHead`'in `<h1>`'i → iki `<h1>`.

---

### `app-arac-form.html` — Yeni / Düzenle Araç

**Tip:** form
**Bölüm:** `SECTIONS.varlik` — menüde yok, şuradan bağlanır: `app-arac.html` "Yeni Araç".
**Amaç:** Araç künyesini kimlik, mülkiyet/kiralama, tahsis ve bakım planı ekseniyle açmak ya da düzeltmek.
**Kullanıcılar:** `varlik` bölümü olan 9 rol; yazma için `can('ekle')`/`can('duzenle')`.
**Veri kaynağı:** `DB.vehicles` · `DB.maintenance` · `DB.inspections` · `DB.policies` · `DB.fuelLogs` · `DB.vehicleExpenses` · `DB.accidents` · `DB.fines` · `DB.assignments` · `DB.employees` · `DB.departments` · `DB.projects` · `DB.activities` · `DB.today`
**Üst özet kartları:** yok — canlı **mülkiyet özeti** (`#mulkOzet`) ve bakım/kilometre özeti kartları.
**Sekmeler:** yok
**Arama:** yok
**Filtreler:** yok
**Tablo kolonları:** —
**Form alanları:** `GV.form` `sections[]` 5 bölüm / **33 alan** (finans yetkisiyle), 14 zorunlu:
- **Araç kimliği** — 11 alan; zorunlu: Plaka, Marka, Model, Model yılı, Araç tipi, Renk, Yakıt türü, Vites, Motor numarası, Şasi numarası (VIN). Motor hacmi koşullu (elektrikte boş).
- **Mülkiyet, satın alma ve kiralama** — 10 alan (Mülkiyet türü*, Satın alma tarihi, *(finans)* Satın alma bedeli, Satıcı, Kiralama firması, Sözleşme başlangıcı, Sözleşme bitişi, *(finans)* Aylık kira, Yıllık km sınırı, *(finans)* Depozito); zorunlu: Mülkiyet türü + mülkiyete göre koşullu zorunluluklar.
- **Kullanım ve tahsis** — 5 alan; zorunlu: Kullanım şekli, Sorumlu departman.
- **Durum, kilometre ve bakım planı** — 6 alan; zorunlu: Araç durumu, Güncel kilometre.
- **Kayıt durumu** — 1 alan (`switch`).
**Detay sekmeleri:** —
**İşlem butonları:** `GV.pageHead` — "Vazgeç" (`app-arac.html`) + "Kaydet"/"Değişiklikleri kaydet"; form altında `#kaydetAlt`.
**Toplu işlemler:** yok
**Bildirimler:** `GV.notice` (kapsam, bağlı kayıt, yeni kayıt akışı, canlı mülkiyet ve bakım uyarıları) · `GV.toast` (kaydetme akışı) · `GV.confirm` (bakım kilometresi aşılmışsa kaydetmeden önce sorulur). `GV.result` yok.
**Yetkilendirme:** `can('ekle')`/`can('duzenle')` → yoksa `GV.errorState` ile **403**, form hiç kurulmaz. `can('finans')` → Satın alma bedeli, Aylık kira ve Depozito alanları forma **hiç basılmaz**.
**Boş durum:** `?id=` var ama kayıt yoksa `GV.empty` + "Araç listesine dön".
**Hata durumu:** `GV.errorState` **var** (403).
**Mobil görünüm:** `mobile(r)` yok.
**Kabul kriterleri:**
- Plaka biçimi `06 GW 1907` kalıbıyla, VIN 17 karakter ve I/O/Q harfsiz doğrulanır; üçü de filoda tekildir.
- Mülkiyet türü hangi alan grubunun dolacağını belirler; ters gruptaki alan doldurulursa hata döner.
- Kilometre geri alınamaz (`guncelKm < kayit.guncelKm` reddedilir); son bakım km ≤ güncel km, sonraki bakım km > son bakım km.
- Filo para alanları **BRÜT** ("KDV dahil") olarak etiketlenir.
**Bulgular:** yok

---

### `app-arac-bakim.html` — Araç Bakım Takibi

**Tip:** liste
**Bölüm:** `SECTIONS.varlik` → menü etiketi **Bakım** (`cnt:'bakim'` rozeti)
**Amaç:** Planlı ve gerçekleşmiş araç bakımlarını tarih + kilometre eşiğine göre takip etmek.
**Kullanıcılar:** `varlik` bölümü olan 9 rol.
**Veri kaynağı:** `DB.maintenance` (kaynak) · `DB.vehicles` · `DB.vehicleExpenses` (tamamlamada gider üretir)
**Üst özet kartları:** `kpis[]` 4 — **Planlı bakım** · **Yaklaşan** · **Serviste** · **Bakım maliyeti** (finans yetkisi yoksa 0).
**Sekmeler:** `tabs[]` 5 — `acik` Açık Bakımlar (`durum !== 'Tamam'`) · `yaklasan` · `serviste` · `tamam` Tamamlananlar · `tumu`.
**Arama:** `search.fields` = `kod · tur · servis · durum · islemler`. `search.extra` yok — **plaka aramada taranmıyor** (bulgu; ortak `aracCol` yalnız render eder).
**Filtreler:** `arac` multi (`DB.vehicles`, ortak `aracFilter`) · `durum` multi (5 değer) · `tur` multi (4 değer) · `planTarihi` daterange.
**Tablo kolonları:** Araç · Bakım türü · Yapılacak işlemler · Planlanan tarih · Bakım km · Servis · Maliyet · Durum. Varsayılan gizli kolon yok.
**Form alanları:** — (modal içinde 2 alanlı tamamlama: Gerçekleşen tarih, Maliyet)
**Detay sekmeleri:** —
**İşlem butonları:** `GV.pageHead` — "Araçlar" + "Bakım Planla" (`app-arac-bakim-form.html`). `rowActions[]` 2 — **Aracı aç** · **Bakımı tamamla** (`GV.modal`; `durum = 'Tamam'` yapar ve `DB.vehicleExpenses`'a **gerçek gider kaydı** üretir).
**Toplu işlemler:** `bulk[]` 1 — **Dışa aktar**. Yetki kapısı yok.
**Bildirimler:** `GV.toast` — "Bu bakım zaten tamamlanmış." (`info`), "Bakım tamamlandı ve gider kaydı oluşturuldu" (`ok`). `GV.notice` / `GV.result` yok.
**Yetkilendirme:** `GV.perm.can('finans')` → maliyet kolonu ve KPI maskelenir. Tamamlama aksiyonunda yetki kapısı **yok** (bulgu). 403 kapısı yok.
**Boş durum:** `GV.empty` — "Bu görünümde bakım kaydı yok". **Aksiyon tanımlı değil**.
**Hata durumu:** `GV.errorState` yok.
**Mobil görünüm:** `mobile(x)` var — plaka + durum, tür · servis, planlanan tarih.
**Kabul kriterleri:**
- Tamamlama aynı işlemde hem bakım kaydını hem `AGD-…` gider kaydını üretir ve iki tutar aynıdır (filo BRÜT ekseni).
- `kalanGun < 0` ve durumu `Tamam` olmayan satır `is-late` sınıfını alır.
**Bulgular:** (a) `rowActions.tamam`'da `show(row)` yok. (b) Tamamlama, finans yetkisi olmayan role de maliyet girdiriyor — modal alanı `can('finans')` ile kapatılmamış; `app-arac-bakim-form.html` aynı alanı kapatıyor. (c) `emptyState.action` yok.

---

### `app-arac-bakim-form.html` — Yeni / Düzenle Bakım Kaydı

**Tip:** form
**Bölüm:** `SECTIONS.varlik` — menüde yok, şuradan bağlanır: `app-arac-bakim.html` "Bakım Planla".
**Amaç:** Araç bakımını tür, servis, plan tarihi/kilometresi, işlem kalemleri ve maliyetle kaydetmek.
**Kullanıcılar:** `varlik` bölümü olan 9 rol; yazma için `can('ekle')`/`can('duzenle')`.
**Veri kaynağı:** `DB.maintenance` · `DB.vehicles` · `DB.activities` · `DB.today`
**Üst özet kartları:** yok — canlı plan/kilometre ve maliyet özet kartları.
**Sekmeler:** yok
**Arama:** yok
**Filtreler:** yok
**Tablo kolonları:** —
**Form alanları:** `GV.form` `sections[]` 5 bölüm — sabit **9 alan** + işlem kataloğu onay kutuları; 6 zorunlu:
- **Araç ve bakım kimliği** — 4 alan; dördü de zorunlu (Araç, Bakım türü, Servis, Bakım durumu).
- **Plan ve gerçekleşme** — 3 alan; zorunlu: Planlanan tarih, Bakım kilometresi. Gerçekleşen tarih koşullu.
- **Yapılacak işlemler** — veriden türeyen `checkbox` kataloğu + "Katalog dışı işlemler" metni; grup kuralı "en az bir işlem".
- **Maliyet** *(yalnız `can('finans')`)* — 1 alan (Bakım maliyeti, KDV dahil).
- **Kayıt durumu** — 1 alan (`switch`).
**Detay sekmeleri:** —
**İşlem butonları:** `GV.pageHead` — "Vazgeç" (`app-arac-bakim.html`) + "Kaydet"/"Değişiklikleri kaydet"; form altında `#kaydetAlt`.
**Toplu işlemler:** yok
**Bildirimler:** `GV.notice` (kapsam, bağlam, canlı plan uyarıları) · `GV.toast` (kaydetme akışı). `GV.result` yok.
**Yetkilendirme:** `can('ekle')`/`can('duzenle')` → **403** (`GV.errorState`), form hiç kurulmaz. `can('finans')` → "Maliyet" bölümü forma **hiç basılmaz**.
**Boş durum:** `?id=` var ama kayıt yoksa `GV.empty` + araç bakım listesine dönüş.
**Hata durumu:** `GV.errorState` **var** (403).
**Mobil görünüm:** `mobile(r)` yok.
**Kabul kriterleri:**
- Gerçekleşmiş bakımın kilometresi aracın güncel kilometresini aşamaz.
- Kilometre sayacı geri gitmez: aynı aracın önceki bakımının altına inemez, sonraki bakımının üstüne çıkamaz.
- "Tamam" durumu gerçekleşen tarih ve (finans yetkisiyle) maliyet ister; "Planlandı" durumunda maliyet > 0 reddedilir.
**Bulgular:** yok

---

### `app-arac-muayene.html` — Araç Muayene Takibi

**Tip:** liste
**Bölüm:** `SECTIONS.varlik` → menü etiketi **Muayene**
**Amaç:** Araç muayene geçerliliklerini kademeli uyarı eşikleriyle takip etmek ve randevu görevi üretmek.
**Kullanıcılar:** `varlik` bölümü olan 9 rol.
**Veri kaynağı:** `DB.inspections` (kaynak) · `DB.vehicles` · `DB.tasks` · `DB.activities` · `DB.today`
**Üst özet kartları:** `kpis[]` 4 — **Takip edilen araç** · **60 gün içinde** · **30 gün içinde** · **Süresi dolan** (`kalanGun < 0`).
**Sekmeler:** `tabs[]` 5 — `tumu` Tüm Araçlar · `y60` 60 Gün İçinde · `y30` 30 Gün İçinde · `dolan` Süresi Dolanlar · `kusur` Kusurlu Geçenler.
**Arama:** `search.fields` = `kod · istasyon · sonuc · kusur`. `search.extra` yok — plaka taranmıyor.
**Filtreler:** `arac` multi · `sonuc` select (Geçti / Kaldı) · `sonrakiTarih` daterange.
**Tablo kolonları:** Araç · Son muayene · Geçerlilik · Sonraki muayene · Sonuç · Kusur bilgisi · Muayene istasyonu · Durum. Varsayılan gizli kolon yok.
**Form alanları:** —
**Detay sekmeleri:** —
**İşlem butonları:** `GV.pageHead` — "Araçlar" + "Muayene Kaydet" (`app-arac-muayene-form.html`). `rowActions[]` 2 — **Aracı aç** · **Randevu görevi oluştur** (`GV.confirm` → `DB.tasks`'a gerçek `GRV-…` görevi + `DB.activities` satırı; kod en yüksek numaradan +1).
**Toplu işlemler:** `bulk[]` 1 — **Dışa aktar**. Yetki kapısı yok.
**Bildirimler:** `GV.confirm` görev oluşturmadan önce · `GV.toast('<GRV-…> görevi oluşturuldu ve iş havuzuna düştü','ok')`. `GV.notice` / `GV.result` yok.
**Yetkilendirme:** `canFinans = GV.perm.can('finans')` okunuyor ama **hiçbir kolonda kullanılmıyor** (ölü değişken — bulgu). 403 kapısı yok.
**Boş durum:** `GV.empty` — "Muayene kaydı yok". **Aksiyon tanımlı değil**.
**Hata durumu:** `GV.errorState` yok.
**Mobil görünüm:** `mobile(x)` var — plaka + türetilmiş durum rozeti + sonraki muayene tarihi.
**Kabul kriterleri:**
- Sonuç ekseni **ham** basılır (`Geçti` / `Kaldı`); onay ekseninin kelimelerine çevrilmez (arama ve filtre aynı değeri kullanır).
- Randevu görevi gerçekten `DB.tasks`'a yazılır; toast tek başına "işlem oldu" demez (ders L-15).
- `kalanGun ≤ 30` olan satır `is-late` sınıfını alır.
**Bulgular:** "Durum" kolonunun `render`'ı `kalanGun`'dan türetiliyor (`Gecikti`/`Yaklaşıyor`/`Planlandı`) ama `exportValue` ham `x.durum` alanını veriyor → **ekranda görünen değer ile Excel çıktısı ayrışabilir**.

---

### `app-arac-muayene-form.html` — Yeni / Düzenle Muayene Kaydı

**Tip:** form
**Bölüm:** `SECTIONS.varlik` — menüde yok, şuradan bağlanır: `app-arac-muayene.html` "Muayene Kaydet".
**Amaç:** Muayene kaydını istasyon, tarih, sonuç, kusur ve geçerlilik ekseniyle tutmak.
**Kullanıcılar:** `varlik` bölümü olan 9 rol; yazma için `can('ekle')`/`can('duzenle')`.
**Veri kaynağı:** `DB.inspections` · `DB.vehicles` · `DB.activities` · `DB.today`
**Üst özet kartları:** yok — canlı geçerlilik/eşik özet kartları.
**Sekmeler:** yok
**Arama:** yok
**Filtreler:** yok
**Tablo kolonları:** —
**Form alanları:** `GV.form` `sections[]` 4 bölüm / **9 alan** (finans yetkisiyle), 5 zorunlu:
- **Muayene kimliği** — Araç*, Muayene istasyonu*, Muayene tarihi*, *(finans)* Muayene ücreti (KDV dahil).
- **Sonuç ve kusur** — Muayene sonucu* (`radio`), Kusur bilgisi (`textarea`).
- **Geçerlilik ve sonraki muayene** — Geçerlilik bitişi (sonuç "Geçti" ise zorunlu), Sonraki muayene tarihi*.
- **Kayıt durumu** — 1 alan (`switch`).
**Detay sekmeleri:** —
**İşlem butonları:** `GV.pageHead` — "Vazgeç" (`app-arac-muayene.html`) + "Kaydet"/"Değişiklikleri kaydet"; form altında `#kaydetAlt`.
**Toplu işlemler:** yok
**Bildirimler:** `GV.notice` (kapsam ve bağlam) · `GV.toast` (kaydetme akışı). `GV.result` yok.
**Yetkilendirme:** `can('ekle')`/`can('duzenle')` → **403**, form hiç kurulmaz. `can('finans')` → "Muayene ücreti" alanı forma **hiç basılmaz**.
**Boş durum:** `?id=` var ama kayıt yoksa `GV.empty`.
**Hata durumu:** `GV.errorState` **var** (403).
**Mobil görünüm:** `mobile(r)` yok.
**Kabul kriterleri:**
- Muayene tarihi ileri tarihli olamaz ve aracın filoya giriş tarihinden (satın alma / kiralama başlangıcı) önce olamaz.
- Aynı araca aynı gün ikinci muayene kaydı açılamaz.
- Geçerlilik bitişi ve sonraki muayene tarihi muayene tarihinden sonra olmalıdır.
**Bulgular:** "Muayene ücreti" alanı veride hiçbir kayıtta dolu değil — ekran bunu ölçüp yazıyor; alan kayda yeni eklenen bir eksen.

---

### `app-arac-sigorta.html` — Sigorta ve Kasko

**Tip:** liste
**Bölüm:** `SECTIONS.varlik` → menü etiketi **Sigorta ve Kasko** (`cnt:'police'` rozeti)
**Amaç:** Trafik sigortası ve kasko poliçelerini bitiş, prim, yenileme ve ödeme ekseniyle takip etmek.
**Kullanıcılar:** `varlik` bölümü olan 9 rol.
**Veri kaynağı:** `DB.policies` (kaynak) · `DB.vehicles`
**Üst özet kartları:** `kpis[]` 4 — **Aktif poliçe** · **60 gün içinde** · **30 gün içinde** · **Yıllık prim** (finans yetkisi yoksa 0).
**Sekmeler:** `tabs[]` 6 — `tumu` · `trafik` Trafik Sigortası · `kasko` · `y60` · `y30` · `yenileme` Yenileme Bekleyen.
**Arama:** `search.fields` = `kod · police · sirket · acente · tur`. `search.extra` yok — plaka taranmıyor.
**Filtreler:** `arac` multi · `tur` multi (2 değer) · `sirket` multi (4 sabit değer) · `yenileme` select (3 değer) · `bitis` daterange.
**Tablo kolonları:** Araç · Poliçe türü · Sigorta şirketi · Poliçe no · **Başlangıç (varsayılan gizli)** · Bitiş tarihi · Prim · **Kasko bedeli (varsayılan gizli)** · **Teminat (varsayılan gizli)** · **Hasarsızlık (varsayılan gizli)** · Yenileme · Ödeme.
**Form alanları:** —
**Detay sekmeleri:** —
**İşlem butonları:** `GV.pageHead` — "Araçlar" + "Poliçe Ekle" (`app-arac-sigorta-form.html`). `rowActions[]` 2 — **Aracı aç** · **Yenileme başlat** (`kalanGun > 60` ise toast ile reddedilir; `GV.confirm` sonrası `yenileme = 'Teklif alındı'`).
**Toplu işlemler:** `bulk[]` 1 — **Dışa aktar**. Yetki kapısı yok.
**Bildirimler:** `GV.toast` — "Yenileme süreci bitişe 60 gün kala başlatılır." (`info`), "Yenileme süreci başlatıldı" (`ok`). `GV.confirm` yenileme öncesi. `GV.notice` / `GV.result` yok.
**Yetkilendirme:** `GV.perm.can('finans')` → prim kolonu ve KPI maskelenir. **Kasko bedeli kolonu maskelenmez** (bulgu). 403 kapısı yok.
**Boş durum:** `GV.empty` — "Poliçe kaydı yok". **Aksiyon tanımlı değil**.
**Hata durumu:** `GV.errorState` yok.
**Mobil görünüm:** `mobile(x)` var — plaka + tür rozeti, şirket · poliçe no, bitiş tarihi.
**Kabul kriterleri:**
- `kalanGun ≤ 30` olan poliçe satırı `is-late` sınıfını alır.
- Prim boşsa "Sözleşmeye dahil" çipi basılır (kiralama sözleşmesine dahil poliçe ekseni).
**Bulgular:** (a) `kaskoBedeli` kolonu `F.money` ile **finans yetkisi denetlenmeden** basılıyor; aynı satırdaki prim maskeliyken kasko bedeli açık kalıyor. (b) `yenileme` kolonu üç değerli sözlüğü ikiye indiriyor: `'Bekliyor'` dışındaki her değer "Teklif alındı" olarak basılıyor. (c) `emptyState.action` yok.

---

### `app-arac-sigorta-form.html` — Yeni / Düzenle Poliçe

**Tip:** form
**Bölüm:** `SECTIONS.varlik` — menüde yok, şuradan bağlanır: `app-arac-sigorta.html` "Poliçe Ekle".
**Amaç:** Trafik sigortası ya da kasko poliçesini araç, dönem, teminat, prim, yenileme ve ödeme ekseniyle kaydetmek.
**Kullanıcılar:** `varlik` bölümü olan 9 rol; yazma için `can('ekle')`/`can('duzenle')`.
**Veri kaynağı:** `DB.policies` · `DB.vehicles` · `DB.activities` · `DB.today`
**Üst özet kartları:** yok — canlı dönem/yenileme özet kartları.
**Sekmeler:** yok
**Arama:** yok
**Filtreler:** yok
**Tablo kolonları:** —
**Form alanları:** `GV.form` `sections[]` 5 bölüm / **12 alan** (finans yetkisiyle), 10 zorunlu:
- **Poliçe kimliği** — 5 alan; beşi de zorunlu (Araç, Poliçe türü `radio`, Sigorta şirketi, Acente, Poliçe numarası).
- **Dönem** — 2 alan; ikisi de zorunlu (Başlangıç, Bitiş).
- **Teminat ve prim** — Teminat kapsamı* + *(finans)* Prim (KDV dahil).
- **Yenileme ve ödeme** — 2 alan; ikisi de zorunlu (Yenileme durumu, Prim ödemesi).
- **Kayıt durumu** — 1 alan (`switch`).
**Detay sekmeleri:** —
**İşlem butonları:** `GV.pageHead` — "Vazgeç" (`app-arac-sigorta.html`) + "Kaydet"/"Değişiklikleri kaydet"; form altında `#kaydetAlt`.
**Toplu işlemler:** yok
**Bildirimler:** `GV.notice` (kapsam, çakışma ve yenileme penceresi uyarıları) · `GV.toast` (kaydetme akışı). `GV.result` yok.
**Yetkilendirme:** `can('ekle')`/`can('duzenle')` → **403**, form hiç kurulmaz. `can('finans')` → "Prim" alanı forma **hiç basılmaz**; "Prim ödemesi" alanının ipucu metni de yetkiye göre değişir.
**Boş durum:** `?id=` var ama kayıt yoksa `GV.empty`.
**Hata durumu:** `GV.errorState` **var** (403).
**Mobil görünüm:** `mobile(r)` yok.
**Kabul kriterleri:**
- Aynı araç + aynı tür için dönemi kesişen ikinci poliçe açılamaz (`cakisan()` dört alanda birden doğrular).
- Poliçe numarası kayıtlar arasında tekildir.
- Poliçe dönemi 30 günden kısa, 1830 günden uzun olamaz.
- Bitişe 60 günden fazla varken yenileme durumu "—" dışında bir değer alamaz.
**Bulgular:** yok

---

### `app-arac-yakit.html` — Yakıt ve Şarj Kayıtları

**Tip:** liste
**Bölüm:** `SECTIONS.varlik` → menü etiketi **Yakıt**
**Amaç:** Dolum defterini litre, birim fiyat, tutar ve kilometre ekseniyle tutmak.
**Kullanıcılar:** `varlik` bölümü olan 9 rol.
**Veri kaynağı:** `DB.fuelLogs` (kaynak) · `DB.vehicles` · `DB.employees` · `DB.today`
**Üst özet kartları:** `kpis[]` 4 — **Toplam tutar** (finans yetkisi yoksa 0) · **Toplam litre** · **Ortalama birim fiyat** · **Kayıt sayısı**.
**Sekmeler:** `tabs[]` 3 — `tumu` Tüm Kayıtlar · `ay` Bu Ay (`DB.today` ayı) · `onceki` Geçen Ay (**sabit `'2026-07'`** — bulgu).
**Arama:** `search.fields` = `kod · istasyon · arac · surucu`. `search.extra` yok — plaka ve sürücü **adı** taranmıyor (kod taranıyor).
**Filtreler:** `arac` multi · `surucu` select · `tarih` daterange.
**Tablo kolonları:** Tarih · Araç · İstasyon · Litre · Birim fiyat · Tutar · Kilometre · Sürücü. Varsayılan gizli kolon yok.
**Form alanları:** —
**Detay sekmeleri:** —
**İşlem butonları:** `GV.pageHead` — "Araç Giderleri" (`app-arac-gider.html`) + "Yakıt Kaydı Ekle" (`app-arac-yakit-form.html`). `rowActions[]` 1 — **Aracı aç**.
**Toplu işlemler:** `bulk[]` 1 — **Dışa aktar**. Yetki kapısı yok.
**Bildirimler:** ekranın bastığı `GV.toast` / `GV.notice` / `GV.result` **yok** (mutasyon üretmez).
**Yetkilendirme:** `GV.perm.can('finans')` → Tutar kolonu ve "Toplam tutar" KPI maskelenir. **Birim fiyat kolonu maskelenmez** (bulgu — litre × birim fiyat tutarı geri verir). 403 kapısı yok.
**Boş durum:** `GV.empty` — "Yakıt kaydı yok". **Aksiyon tanımlı değil**.
**Hata durumu:** `GV.errorState` yok.
**Mobil görünüm:** `mobile(x)` var — plaka + tutar, tarih · istasyon, litre + km.
**Kabul kriterleri:**
- Toplam litre ve ortalama birim fiyat görünen filtre kümesinden hesaplanır.
- `views` tanımlı değil — yalnız tablo görünümü vardır.
**Bulgular:** (a) "Geçen Ay" sekmesi `'2026-07'` sabitiyle yazılmış, `DB.today`'den türetilmiyor. (b) Birim fiyat maskesiz basıldığı için maskelenen tutar litreyle çarpılarak geri hesaplanabilir.

---

### `app-arac-yakit-form.html` — Yeni / Düzenle Yakıt Kaydı

**Tip:** form
**Bölüm:** `SECTIONS.varlik` — menüde yok, şuradan bağlanır: `app-arac-yakit.html` "Yakıt Kaydı Ekle".
**Amaç:** Dolum kaydını araç, tarih, istasyon, sürücü, litre, birim fiyat ve sayaç ekseniyle tutmak; tutarı türetmek.
**Kullanıcılar:** `varlik` bölümü olan 9 rol; yazma için `can('ekle')`/`can('duzenle')`.
**Veri kaynağı:** `DB.fuelLogs` · `DB.vehicles` · `DB.employees` · `DB.activities` · `DB.today`
**Üst özet kartları:** yok — canlı tutar/tüketim türev kartları.
**Sekmeler:** yok
**Arama:** yok
**Filtreler:** yok
**Tablo kolonları:** —
**Form alanları:** `GV.form` `sections[]` 3 bölüm / **8 alan** (finans yetkisiyle), 7 zorunlu:
- **Dolum kaydı** — 4 alan; dördü de zorunlu (Araç, Dolum tarihi, İstasyon, Sürücü).
- **Dolum ve tutar** — Alınan yakıt (litre)*, *(finans)* Birim fiyat* (`currency:'₺/L'`), Dolum anındaki sayaç (km)*.
- **Kayıt durumu** — 1 alan (`switch`).
**Detay sekmeleri:** —
**İşlem butonları:** `GV.pageHead` — "Vazgeç" (`app-arac-yakit.html`) + "Kaydet"/"Değişiklikleri kaydet"; form altında `#kaydetAlt`.
**Toplu işlemler:** yok
**Bildirimler:** `GV.notice` (kapsam, sayaç ve tüketim uyarıları) · `GV.toast` (kaydetme akışı) · `GV.confirm` (sürücü aracın ana/yedek sürücüsü değilse kaydetmeden önce sorulur). `GV.result` yok.
**Yetkilendirme:** `can('ekle')`/`can('duzenle')` → **403**, form hiç kurulmaz. `can('finans')` → "Birim fiyat" alanı forma **hiç basılmaz** (ve tutar da türetilemez).
**Boş durum:** `?id=` var ama kayıt yoksa `GV.empty`.
**Hata durumu:** `GV.errorState` **var** (403).
**Mobil görünüm:** `mobile(r)` yok.
**Kabul kriterleri:**
- **Tutar forma elle girilmez** — litre × birim fiyat olarak türetilir ve tam liraya yuvarlanır (ders L-08).
- Sayaç geri gitmez: aynı aracın önceki dolumunun altına inemez, sonraki dolumunun ve araç kaydındaki güncel kilometrenin üstüne çıkamaz.
- Dolum tarihi aracın filoya giriş / kiralama sözleşmesi başlangıcından önce olamaz.
**Bulgular:** yok

---

### `app-arac-gider.html` — Araç Giderleri

**Tip:** liste
**Bölüm:** `SECTIONS.varlik` → menü etiketi **Giderler**
**Amaç:** Filo gider defterini kalem türü, tarih ve tutar ekseniyle tutmak; kilometre başına maliyeti göstermek.
**Kullanıcılar:** `varlik` bölümü olan 9 rol.
**Veri kaynağı:** `DB.vehicleExpenses` (kaynak) · `DB.vehicles` · `DB.today`
**Üst özet kartları:** `kpis[]` 4 — **Toplam gider** · **Bu ay** · **En yüksek kalem** (tür adı döner, sayı değil) · **Ortalama km maliyeti** (₺/km).
**Sekmeler:** `tabs[]` 7 — `tumu` · `yakit` · `bakim` Bakım ve Onarım · `sigorta` Sigorta ve Vergi · `yol` Yol ve Otopark · `ceza` · `kira` Kira ve Kredi.
**Arama:** `search.fields` = `kod · tur · aciklama · belge`. `search.extra` yok — plaka taranmıyor.
**Filtreler:** `arac` multi · `tur` multi (18 kalemlik `GIDER` kümesi) · `tutar` text + `test` (en az) · `tarih` daterange.
**Tablo kolonları:** Tarih · Araç · Gider türü · Açıklama · Belge no · Tutar. Varsayılan gizli kolon yok.
**Form alanları:** —
**Detay sekmeleri:** —
**İşlem butonları:** `GV.pageHead` — "Yakıt" + "Gider Ekle" (`app-arac-gider-form.html`). `rowActions[]` 1 — **Aracı aç**.
**Toplu işlemler:** `bulk[]` 1 — **Dışa aktar**. Yetki kapısı yok.
**Bildirimler:** ekranın bastığı `GV.toast` / `GV.notice` / `GV.result` **yok**.
**Yetkilendirme:** `GV.perm.can('finans')` → Tutar kolonu ve "Toplam gider" / "Bu ay" KPI'ları maskelenir. Tutar filtresi ise **maskeli değere rağmen açık kalıyor** (bulgu). 403 kapısı yok.
**Boş durum:** `GV.empty` — "Gider kaydı yok". **Aksiyon tanımlı değil**.
**Hata durumu:** `GV.errorState` yok.
**Mobil görünüm:** `mobile(x)` var — tür + tutar, plaka · tarih, açıklama.
**Kabul kriterleri:**
- Yedi sekmenin filtreleri 18 kalemlik gider türü kümesini örter.
- Filo tutarları **BRÜT** (KDV dahil) eksendedir ve kaynak kaydın tutarını birebir taşır (components.md §9b).
**Bulgular:** (a) `tutar` filtresi finans yetkisiyle kapatılmıyor — `app-egitim.html` aynı sınıf filtreyi `can('finans')` ile kapatıyor, iki ekran ayrışıyor. (b) "En yüksek kalem" KPI'ı sayı yerine metin döndürüyor (`format:function(v){ return v; }`). (c) `emptyState.action` yok.

---

### `app-arac-gider-form.html` — Yeni / Düzenle Gider Kalemi

**Tip:** form
**Bölüm:** `SECTIONS.varlik` — menüde yok, şuradan bağlanır: `app-arac-gider.html` "Gider Ekle".
**Amaç:** Filo gider kalemini araç, tür, tarih, açıklama, tutar ve belge numarasıyla kaydetmek.
**Kullanıcılar:** `varlik` bölümü olan 9 rol; yazma için `can('ekle')`/`can('duzenle')`.
**Veri kaynağı:** `DB.vehicleExpenses` · `DB.vehicles` · `DB.activities` · `DB.today`
**Üst özet kartları:** yok — canlı gider özeti kartları.
**Sekmeler:** yok
**Arama:** yok
**Filtreler:** yok
**Tablo kolonları:** —
**Form alanları:** `GV.form` `sections[]` 3 bölüm / **7 alan** (finans yetkisiyle), 5 zorunlu:
- **Gider kalemi** — 4 alan; dördü de zorunlu (Araç, Gider türü, Gider tarihi, Açıklama).
- **Tutar ve belge** — *(finans)* Tutar* (KDV dahil) + Belge no.
- **Kayıt durumu** — 1 alan (`switch`).
**Detay sekmeleri:** —
**İşlem butonları:** `GV.pageHead` — "Vazgeç" (`app-arac-gider.html`) + "Kaydet"/"Değişiklikleri kaydet"; form altında `#kaydetAlt`.
**Toplu işlemler:** yok
**Bildirimler:** `GV.notice` (kapsam + tutar ekseni) · `GV.toast` (kaydetme akışı). `GV.result` yok.
**Yetkilendirme:** `can('ekle')`/`can('duzenle')` → **403**, form hiç kurulmaz. `can('finans')` → "Tutar" alanı forma **hiç basılmaz**; bölüm açıklaması bunu yazar ve yalnız belge numarası düzenlenir.
**Boş durum:** `?id=` var ama kayıt yoksa `GV.empty`.
**Hata durumu:** `GV.errorState` **var** (403).
**Mobil görünüm:** `mobile(r)` yok.
**Kabul kriterleri:**
- Gider tarihi ileri tarihli olamaz.
- Açıklama 3–120 karakter arasındadır.
- Tutar tam lira yazılır, sıfırdan büyüktür; eksen BRÜT'tür ve kaynak kaydın tutarını net'e çevirmez.
**Bulgular:** yok

---

### `app-arac-kaza.html` — Kaza, Hasar ve Trafik Cezaları

**Tip:** liste (iki koleksiyonun birleşik görünümü)
**Bölüm:** `SECTIONS.varlik` → menü etiketi **Kaza ve Ceza**
**Amaç:** Kaza/hasar dosyaları ile trafik cezalarını tek listede, kusur ve ödeme ekseniyle izlemek.
**Kullanıcılar:** `varlik` bölümü olan 9 rol.
**Veri kaynağı:** `DB.accidents` + `DB.fines` (`birlesik()` ile tek diziye map'lenir) · `DB.vehicles` · `DB.employees`
**Üst özet kartları:** `kpis[]` 4 — **Toplam kayıt** · **Kaza** · **Trafik cezası** · **Ödenmemiş ceza** (tutar toplamı, finans yetkisi yoksa 0).
**Sekmeler:** `tabs[]` 5 — `tumu` · `kaza` Kaza ve Hasar · `ceza` Trafik Cezaları · `odenmemis` Ödenmemiş · `kapali` Kapananlar (`Kapandı` + `Ödendi`).
**Arama:** `search.fields` = `kod · aciklama · konum · durum · kayitTuru`. `search.extra` yok — plaka ve sürücü adı taranmıyor.
**Filtreler:** `arac` multi · `kayitTuru` select (Kaza / Trafik cezası) · `surucu` select · `durum` multi (3 değer) · `tarih` daterange.
**Tablo kolonları:** Kayıt · Kayıt türü · Araç · Tarih · Sürücü · **Konum (varsayılan gizli)** · Kusur oranı · Tutar · Belge · Durum.
**Form alanları:** —
**Detay sekmeleri:** —
**İşlem butonları:** `GV.pageHead` — "Araçlar" + "Kayıt Ekle" (`app-arac-kaza-form.html`). `rowActions[]` 2 — **Aracı aç** · **Ödendi işaretle** (yalnız trafik cezasında anlamlı; `GV.confirm` sonrası `DB.fines` kaydını günceller).
**Toplu işlemler:** `bulk[]` 1 — **Dışa aktar**. Yetki kapısı yok.
**Bildirimler:** `GV.toast` — "Bu işlem yalnız trafik cezaları için geçerli." (`info`), "Bu ceza zaten ödenmiş." (`info`), "`CEZ-…` ödendi olarak işaretlendi" (`ok`). `GV.confirm` ödeme öncesi. `GV.notice` / `GV.result` yok.
**Yetkilendirme:** `GV.perm.can('finans')` → Tutar kolonu ve "Ödenmemiş ceza" KPI'ı maskelenir. Ancak `GV.confirm` metni maskesiz `F.money(x.tutar)` yazıyor (bulgu). 403 kapısı yok.
**Boş durum:** `GV.empty` — "Kaza veya ceza kaydı yok". **Aksiyon tanımlı değil**.
**Hata durumu:** `GV.errorState` yok.
**Mobil görünüm:** `mobile(x)` var — açıklama + tür rozeti, plaka · tarih, durum + tutar.
**Kabul kriterleri:**
- Birleşik kaynak `kod` ile tekilleşir (`KZA-` ve `CEZ-` önekleri çakışmaz).
- `Ödenmedi` satırı `is-late` sınıfını alır ve KPI ile aynı kümeyi sayar.
- Ödeme aksiyonu görünen (map'lenmiş) nesneyi değil, kaynak `DB.fines` kaydını günceller.
**Bulgular:** (a) "Ödendi işaretle" aksiyonu `show(row)` kullanmıyor — kaza satırında da basılıp toast'la reddediliyor. (b) `GV.confirm` metnindeki tutar finans yetkisi denetlenmeden basılıyor. (c) Belge bağlantısı `data-wip="Belge önizleme"` — hedef ekran yok. (d) `emptyState.action` yok.

---

### `app-arac-kaza-form.html` — Yeni / Düzenle Kaza veya Ceza Kaydı

**Tip:** form (tür seçimine göre iki ayrı alan kümesi)
**Bölüm:** `SECTIONS.varlik` — menüde yok, şuradan bağlanır: `app-arac-kaza.html` "Kayıt Ekle"; `?arac=ARC-…` ve `?tur=kaza|ceza` ile ön doldurma destekli.
**Amaç:** Kaza/hasar dosyası ya da trafik cezasını doğru koleksiyona, kendi alan kümesiyle yazmak.
**Kullanıcılar:** `varlik` bölümü olan 9 rol; yazma için `can('ekle')`/`can('duzenle')`.
**Veri kaynağı:** `DB.accidents` · `DB.fines` · `DB.vehicles` · `DB.policies` · `DB.vehicleExpenses` · `DB.employees` · `DB.activities` · `DB.today`
**Üst özet kartları:** yok — iki canlı kart: **Kayıt Tutarlılığı** (`#tutarlilikOzet`) ve **Aracın Filo Geçmişi** (`#baglarOzet`).
**Sekmeler:** yok
**Arama:** yok
**Filtreler:** yok
**Tablo kolonları:** —
**Form alanları:** `GV.form` **tür değişince yeniden kurulur** (aynı `id:'kazaceza'` ile — `beforeunload` dinleyicisi birikmez):
- **Kayıt türü** *(yalnız yeni kayıtta)* — 1 alan (`radio`: Kaza ve hasar / Trafik cezası)*.
- **Kaza kolu** (`DB.accidents`, `KZA-` öneki) — *Kaza ve hasar bilgileri* 6 alan (Araç*, Olay tarihi*, Olay yeri*, Araç sürücüsü*, Karşı araç plakası, Kusur oranı* `percent`) · *Tutanak, ekspertiz ve sigorta* 3 alan (Kaza tutanağı, Ekspertiz durumu*, Sigorta dosya numarası) · *Onarım ve süreç durumu* 4 alan (Onarım servisi, *(finans)* Onarım maliyeti, Kayıt durumu (süreç)*, Olay açıklaması*) · *Kayıt durumu* 1 alan. → **15 alan, 9 zorunlu**.
- **Ceza kolu** (`DB.fines`, `CEZ-` öneki) — *Trafik cezası bilgileri* 4 alan (Araç*, Ceza tarihi*, Araç sürücüsü*, Ceza türü*) · *Tutar, vade ve ödeme durumu* 4 alan (*(finans)* Ceza tutarı*, Son ödeme tarihi*, Ödeme durumu*, Ceza tebligatı) · *Kayıt durumu* 1 alan. → **10 alan, 8 zorunlu**.
**Detay sekmeleri:** —
**İşlem butonları:** `GV.pageHead` — "Vazgeç" (`app-arac-kaza.html`) + "Kaydet"/"Değişiklikleri kaydet"; form altında `#kaydetAlt`. `pageHead` tür değişince yeniden yazılır.
**Toplu işlemler:** yok
**Bildirimler:** `GV.notice` — kapsam notu (`neutral`; kaza↔ceza ayrımı, sigorta dosyasının poliçe bağı olmadığı, gider defterine bağ olmadığı), düzenlemede tür kilidi (`info`), yeni kayıt akışı (`info`), adresteki aracın bulunamadığı (`warn`), araç ön doldurma (`neutral`). `GV.toast` (kaydetme akışı) · `GV.confirm` (sürücü aracın sürücüsü değilse, ekspertiz yapılmadan kayıt kapatılıyorsa). `GV.result` yok.
**Yetkilendirme:** `can('ekle')`/`can('duzenle')` → **403**, form hiç kurulmaz. `can('finans')` → "Onarım maliyeti" (kaza) ve "Ceza tutarı" (ceza) alanları forma **hiç basılmaz**; Kayıt Özeti kartındaki tutar satırı da hiç üretilmez.
**Boş durum:** `?id=` var ama kayıt yoksa `GV.empty` + kaza/ceza listesine dönüş.
**Hata durumu:** `GV.errorState` **var** (403).
**Mobil görünüm:** `mobile(r)` yok.
**Kabul kriterleri:**
- Kaza ve ceza alanları **tek forma karıştırılmaz**; tür değişince küme yeniden kurulur ve ortak alanlar (araç, tarih, sürücü) korunur.
- Düzenleme modunda tür **değiştirilemez** — kod öneki koleksiyonu belirler.
- Kod, seçilen türün kendi sayacından en yüksek numaradan +1 ile üretilir.
- Kusur %0 kaza için onarım maliyeti 0 yazılır ve listede "Sigortadan karşılandı" olarak görünür.
**Bulgular:** yok

---

### `app-toplanti.html` — Toplantılar

**Tip:** liste
**Bölüm:** `SECTIONS.toplanti` (`Ajanda` / `Toplantı ve Ajanda`) → menü etiketi **Toplantılar**
**Amaç:** İç ve müşteri toplantılarını tür, katılımcı, gündem ve karar ekseniyle yönetmek.
**Kullanıcılar:** `SEC_BY_ROLE`'da `toplanti` bölümü olan **23 rol** — `freelancer` · `diskaynak` · `stajyer` · `musteri` **hariç** tüm roller.
**Veri kaynağı:** `DB.meetings` (kaynak) · `DB.decisions` · `DB.employees` · `DB.customers` · `DB.projects` · `DB.tasks` · `DB.today`
**Üst özet kartları:** `kpis[]` 4 — **Planlı toplantı** · **Bu hafta** (0–7 gün) · **Katıldığım** (`katilimci` içinde oturum sahibi) · **Açık aksiyon** (`DB.decisions` durum ≠ Tamamlandı, `app-toplanti-karar.html`'e bağlı).
**Sekmeler:** `tabs[]` 6 — `planli` · `benim` Katıldıklarım · `musteri` Müşteri Toplantıları · `ic` İç Toplantılar · `gecmis` Tamamlananlar · `tumu`.
**Arama:** `search.fields` = `kod · ad · tur · yer · gundem`. `search.extra` yok — katılımcı adı taranmıyor.
**Filtreler:** `tur` multi (6 değer) · `durum` select (3 değer) · `musteri` select · `proje` select · `tarih` daterange.
**Tablo kolonları:** Toplantı · Toplantı türü · Tarih ve saat · Katılımcılar (avatar yığını) · **Dış katılımcı (varsayılan gizli)** · Gündem · Durum.
**Form alanları:** — (modal içinde 1 alanlı karar seçimi)
**Detay sekmeleri:** —
**İşlem butonları:** `GV.pageHead` — "Kararlar ve Aksiyonlar" + "Toplantı Planla" (`app-toplanti-form.html`). `rowActions[]` 3 — **Toplantıyı aç** · **Notlar ve kararlar** (`GV.modal`: gündem + not + karar tablosu) · **Karardan görev oluştur** (`GV.modal` → `DB.tasks`'a gerçek görev, `d.gorev` doldurulur, `GV.result` ile sonuç).
**Toplu işlemler:** `bulk[]` 1 — **Dışa aktar**. Yetki kapısı yok.
**Bildirimler:** `GV.toast('Bu toplantıda göreve dönüştürülecek karar yok.','info')` · `GV.modal` iki aksiyonda · **`GV.result`** ("Görev oluşturuldu" + "Görevi aç" / "Kapat"). `GV.notice` yok.
**Yetkilendirme:** `GV.perm.can(...)` çağrısı **yok** — karardan görev üretme her role açık (bulgu; `app-toplanti-karar.html` aynı işlemi `can('ekle')`'ye bağlıyor). Alan maskeleme yok. 403 kapısı yok.
**Boş durum:** `GV.empty` — "Bu görünümde toplantı yok" + **aksiyon: "Toplantı Planla"**.
**Hata durumu:** `GV.errorState` yok.
**Mobil görünüm:** `mobile(x)` var; `card(x)` var (`views:['table','card']`).
**Kabul kriterleri:**
- Karardan üretilen görev `DB.tasks`'a yazılır ve kararın `gorev` alanı doldurulur (tek yönlü bağ, ayna alan açılmaz).
- Görev kodu `DB.tasks` içindeki en yüksek `GRV-2026-xxx` + 1 ile üretilir.
- Zaten görevi olan kararlar "Karardan görev oluştur" seçeneğinde listelenmez.
**Bulgular:** Yetki kapısı yok — aynı işlem `app-toplanti-karar.html`'de `can('ekle')` gerektiriyor, bu ekranda gerektirmiyor.

---

### `app-toplanti-detay.html` — Toplantı Detayı

**Tip:** detay (7 sekme)
**Bölüm:** `SECTIONS.toplanti` — menüde yok, şuradan bağlanır: `app-toplanti.html` kolon/satır bağlantısı.
**Amaç:** Bir toplantının kimliği, gündemi, katılımcıları, kararları, notu ve aktivite geçmişini tek kayıtta toplamak.
**Kullanıcılar:** `toplanti` bölümü olan 23 rol.
**Veri kaynağı:** `DB.meetings` · `DB.decisions` · `DB.tasks` · `DB.customers` · `DB.projects` · `DB.employees` · `DB.documents` · `DB.taskTypes` · `DB.priorities` · `DB.activities` · `DB.today`
**Üst özet kartları:** yok — sağ sütunda beş kart: **Özet** (12 satır) · **Karar Durumu** (varsa) · **Gündem** (varsa) · **Katılımcılar** · **Son Hareket**.
**Sekmeler:** `GV.tabs('#recTabs')` — 7 sekme.
**Arama:** yok
**Filtreler:** yok
**Tablo kolonları:** Sekme içi tablolar.
**Form alanları:** — (modal içinde 5 alanlı karardan görev üretme: Görev başlığı, Görev türü, Öncelik, Atanan, Termin)
**Detay sekmeleri:**
1. **Genel** — Toplantı Kimliği (6), Zaman ve Yer (6, bitiş saati süreden hesaplanır), Bağlam (3), Katılım ve Çıktı (5).
2. **Gündem** — gündem maddesi tablosu (sıra + madde) + kapsam `GV.notice`'ı ("madde başına sorumlu/süre/sonuç alanı yok").
3. **Katılımcılar** — iç katılımcı tablosu (personel · pozisyon · departman · sorumlu olduğu karar sayısı) + dış katılımcı tablosu; kapsam notu ("katılım durumu tutulmuyor").
4. **Kararlar ve Aksiyonlar** — karar tablosu (7 kolon; kalan gün rozeti) + satır içi **"Göreve dönüştür"** butonu (yalnız `can('ekle')` ve görevi olmayan kararda) + termini geçmiş karar uyarısı.
5. **Notlar** — toplantı notu + not künyesi (5 satır) ya da boş durum.
6. **Dosyalar** — `DB.documents`'ta toplantı bağı olmadığı için **her zaman boş durum**; ekran bunu açıkça yazar ve doküman merkezine yönlendirir.
7. **Aktivite Geçmişi** — `GV.activity(A)`.
**İşlem butonları:** `GV.pageHead` — "Toplantı listesi" · "Kararlar ve aksiyonlar" · "Takvimde gör" (`app-ajanda.html`). Sekme içi `[data-krr]` butonları.
**Toplu işlemler:** yok
**Bildirimler:** `GV.modal` karardan görev üretme · **`GV.result`** ("Görev oluşturuldu" + "Görevi aç") · `GV.toast('Görev başlığı boş bırakılamaz','warn')` · `GV.notice` — gündem kapsamı, katılım durumu, karar/görev bağı (`info`), termini geçmiş karar (`warn`).
**Yetkilendirme:** `GV.perm.can('ekle')` → satır içi "Göreve dönüştür" butonu hiç basılmaz. Alan maskeleme yok. 403 kapısı yok.
**Boş durum:** `?id=` bulunamazsa `GV.empty` + "Toplantı listesine dön"; sekme içi boş durumlar (gündem, katılımcı, karar, not, dosya, aktivite).
**Hata durumu:** `GV.errorState` yok.
**Mobil görünüm:** `mobile(r)` yok; tablolar `.gv-tablewrap.is-mobilescroll`.
**Kabul kriterleri:**
- Karardan görev üretimi `app-toplanti-karar.html` ile **aynı yordamdır** ve toplantı kaydına `DB.activities` satırı düşer.
- Sayfa `render()` fonksiyonuyla yeniden çizilir; `GV.tabs` her çizimde yeniden bağlanır.
- Veride olmayan alanlar (düzenleyen, not yazarı, katılım durumu) "kayıtta yok" diye yazılır, uydurulmaz.
**Bulgular:** Kayıt başlığındaki `<h1>` + `GV.pageHead`'in `<h1>`'i → iki `<h1>`.

---

### `app-toplanti-form.html` — Yeni / Düzenle Toplantı

**Tip:** form
**Bölüm:** `SECTIONS.toplanti` — menüde yok, şuradan bağlanır: `app-toplanti.html` "Toplantı Planla" ve boş durum aksiyonu.
**Amaç:** Toplantıyı başlık, tür, zaman, yer, bağlam, katılımcı, gündem ve notla planlamak ya da düzeltmek.
**Kullanıcılar:** `toplanti` bölümü olan 23 rol; yazma için `can('ekle')`/`can('duzenle')`.
**Veri kaynağı:** `DB.meetings` · `DB.decisions` · `DB.employees` · `DB.departments` · `DB.customers` · `DB.projects` · `DB.activities` · `DB.today`
**Üst özet kartları:** yok — canlı **plan** ve **karar** özet blokları.
**Sekmeler:** yok
**Arama:** yok
**Filtreler:** yok
**Tablo kolonları:** —
**Form alanları:** `GV.form` `sections[]` 6 bölüm — sabit **12 alan** + personel başına onay kutusu (`DB.employees.length`); 8 zorunlu:
- **Toplantı kimliği** — 3 alan; üçü de zorunlu (Toplantı başlığı, Toplantı türü, Toplantı durumu).
- **Zaman ve yer** — 4 alan; dördü de zorunlu (Tarih, Başlangıç saati `select` yarım saatlik ızgara, Süre dakika, Yer / platform).
- **Bağlam** — 2 alan (Müşteri, Proje); türe göre koşullu zorunluluk.
- **Katılımcılar** — personel başına `checkbox` + "Dış katılımcılar" (`textarea`, her satır bir kişi). Grup kuralı ("en az bir katılımcı") ilk kutuya bağlanmış.
- **Gündem ve not** — Gündem maddeleri* (`textarea`, her satır bir madde) + Toplantı notu (tamamlanmış toplantıda zorunlu).
- **Kayıt durumu** — 1 alan (`switch`).
**Detay sekmeleri:** —
**İşlem butonları:** `GV.pageHead` — "Vazgeç" (`app-toplanti.html`) + "Kaydet"/"Değişiklikleri kaydet"; form altında `#kaydetAlt`.
**Toplu işlemler:** yok
**Bildirimler:** `GV.notice` (kapsam, bağlı karar uyarısı, canlı plan uyarıları) · `GV.toast` (kaydetme akışı). `GV.result` yok.
**Yetkilendirme:** `can('ekle')`/`can('duzenle')` → **403** (`GV.errorState`), form hiç kurulmaz. Alan bazlı maskeleme yok (para alanı yok).
**Boş durum:** `?id=` var ama kayıt yoksa `GV.empty` + "Toplantı listesine dön".
**Hata durumu:** `GV.errorState` **var** (403).
**Mobil görünüm:** `mobile(r)` yok.
**Kabul kriterleri:**
- Aynı gün aynı başlıkla ikinci toplantı açılamaz.
- Planlı toplantı geçmiş güne, tamamlanmış toplantı gelecek güne konulamaz.
- Bağlı kararı olan toplantının durumu "Tamamlandı" dışına çıkarılamaz; açık kararı olan toplantı arşivlenemez.
- Proje seçilirse projenin müşterisi ile müşteri alanı tutmalıdır (bağ veriden okunur, tahmin edilmez).
- Süre 15–480 dk ve beş dakikanın katıdır; gündem en fazla 15 madde, madde başına 80 karakter.
**Bulgular:** `GV.form`'da `multiselect` tipi olmadığı için katılımcılar **personel başına ayrı `checkbox`** olarak kuruluyor; kadro büyüdükçe form uzar. Eksik bileşen ekranda açıkça yazılı.

---

### `app-toplanti-karar.html` — Kararlar ve Aksiyonlar

**Tip:** liste
**Bölüm:** `SECTIONS.toplanti` → menü etiketi **Kararlar ve Aksiyonlar**
**Amaç:** Toplantı kararlarını sorumlu, termin ve göreve dönüşüm ekseniyle takip etmek; tek işlemle göreve dönüştürmek.
**Kullanıcılar:** `toplanti` bölümü olan 23 rol.
**Veri kaynağı:** `DB.decisions` (kaynak) · `DB.meetings` · `DB.tasks` · `DB.customers` · `DB.projects` · `DB.employees` · `DB.taskTypes` · `DB.priorities` · `DB.today`
**Üst özet kartları:** `kpis[]` 5 — **Toplam karar** · **Açık karar** · **Gecikmiş karar** · **Göreve dönüştürülmüş** (meta: dönüşüm oranı %) · **Bu hafta terminlenen**.
**Sekmeler:** `tabs[]` 5 — `tumu` · `acik` Açık · `geciken` Gecikmiş · `tamam` Tamamlandı · `gorevsiz` Göreve dönüşmemiş.
**Arama:** `search.fields` = `kod · karar · toplanti · durum · gorev`; **`search.extra`** = toplantı adı + türü + sorumlu adı + müşteri/proje bağlamı + görev başlığı.
**Filtreler:** `toplanti` select (yalnız kararı olan toplantılar) · `toplantiTuru` multi + `test` · `sorumlu` select (yalnız kararı olan kişiler) · `durum` multi (4 değer) · `termin` daterange · `gorevDurumu` select + `test` (var / yok).
**Tablo kolonları:** Karar kodu · Karar · Toplantı · Toplantı tarihi · Sorumlu · Termin · Kalan gün · Durum · Bağlı görev · Müşteri / proje · **Toplantı türü (varsayılan gizli)**.
**Form alanları:** — (modal içinde 5 alanlı görev üretme + 1 alanlı durum değiştirme)
**Detay sekmeleri:** —
**İşlem butonları:** `GV.pageHead` — "Toplantı Listesi" + "Görev Listesi". `rowActions[]` — **Toplantıyı aç** · **Kararı görüntüle** (`GV.drawer`: karar künyesi, gündem, not, aynı toplantının diğer kararları, üç bağlantı) · *(yalnız `can('ekle')`)* **Göreve dönüştür / Görevi aç** (`href` varsa göreve gider, yoksa `run` modalı açar) · *(yalnız `can('duzenle')`)* **Durumu değiştir**.
**Toplu işlemler:** `bulk[]` — *(yalnız `can('ekle')`)* **Göreve dönüştür** (zaten bağlı olanları atlar, `GV.result` ile özet) · *(yalnız `can('duzenle')`)* **Durum ata** (`GV.modal`) · her rolde **Çıktı al**. Yetki kapısı **var**.
**Bildirimler:** `GV.confirm` toplu dönüştürmede · `GV.modal` görev üretme ve durum atama · **`GV.result`** ("Görev oluşturuldu" / "Görevler oluşturuldu" + "Görev listesini aç") · `GV.toast` — "Görev başlığı boş bırakılamaz" (`warn`), "Durum değişmedi" (`info`), "`KRR-…` durumu … olarak güncellendi" (`ok`), "Seçili kararların hepsi zaten bir göreve bağlı." (`info`) · `GV.notice` modal içinde ("Karar ile görev bağlı kalır" `info`, "Termin geçmiş" `warn`) · `GV.drawer` karar detayı.
**Yetkilendirme:** `GV.perm.can('ekle')` → göreve dönüştürme satır aksiyonu ve toplu işlemi hiç basılmaz. `GV.perm.can('duzenle')` → durum değiştirme satır aksiyonu ve toplu işlemi hiç basılmaz. Alan maskeleme yok. 403 kapısı yok.
**Boş durum:** `GV.empty` — "Bu görünümde karar yok" + **aksiyon: "Toplantı Listesi"**.
**Hata durumu:** `GV.errorState` yok.
**Mobil görünüm:** `mobile(d)` var; `card(d)` var (`views:['table','card']`).
**Kabul kriterleri:**
- Kaynak veri **değiştirilmez**: toplantı adı, sorumlu adı ve görev başlığı kod üzerinden çözülür.
- Termini geçmiş açık karar "gecikmiş" sayılır ama kayıttaki `durum` alanına **dokunulmaz**.
- Toplu dönüştürmede kodlar sırayla üretildiği için çakışma oluşmaz.
- `href` fonksiyonu falsy dönerse aksiyon buton olarak basılır ve `run` çalışır (components.md §2 sözleşmesi).
**Bulgular:** yok

---

### `app-dokuman.html` — Doküman Merkezi

**Tip:** liste
**Bölüm:** `SECTIONS.dokuman` (`Arşiv` / `Doküman Yönetimi`) → menü etiketi **Doküman Merkezi**
**Amaç:** Sözleşme, teklif, teknik doküman ve belgeleri klasör, versiyon, gizlilik ve onay ekseniyle yönetmek.
**Kullanıcılar:** `SEC_BY_ROLE`'da `dokuman` bölümü **27 rolün tamamında** var (dış roller `freelancer` · `diskaynak` · `stajyer` · `musteri` dahil).
**Veri kaynağı:** `DB.documents` (kaynak) · `DB.employees` · `DB.customers` · `DB.today`
**Üst özet kartları:** `kpis[]` 4 — **Toplam doküman** · **Onay bekleyen** · **Süresi yaklaşan** (`kalanGun ≤ 30`, `app-dokuman-sure.html`'e bağlı) · **Gizli doküman**.
**Sekmeler:** `tabs[]` 7 — `tumu` · `sozlesme` Sözleşme ve Teklif · `proje` Proje Dokümanları · `personel` Personel ve Zimmet · `filo` Araç ve Poliçe · `onay` Onay Bekleyenler · `sure` Süresi Yaklaşanlar.
**Arama:** `search.fields` = `kod · ad · klasor · tur · format`. `search.extra` yok — yükleyen adı ve müşteri taranmıyor (`app-dokuman-sure.html` bunu `extra` ile ekliyor — tutarsızlık).
**Filtreler:** `tur` multi (16 kalemlik `TUR` kümesi) · `gizlilik` multi (3 değer) · `onay` select · `yukleyen` select · `musteri` select · `tarih` daterange.
**Tablo kolonları:** Doküman · Tür · Versiyon · Yükleyen · Yükleme tarihi · Son kullanma · Gizlilik · Dijital onay. Varsayılan gizli kolon yok.
**Form alanları:** — (modal içinde 5 alanlı yükleme: Doküman adı, Tür, Gizlilik, Son kullanma, dosya seçici)
**Detay sekmeleri:** —
**İşlem butonları:** `GV.pageHead` — "Süresi Dolanlar" + **"Doküman Yükle"** (`id:'btnYukle'`, `GV.modal`; `DB.documents`'a gerçek kayıt yazar). `rowActions[]` 2 — **Ön izleme** (`GV.modal`, 8 satırlık künye + "İndir") · **Dijital onay ver** (`GV.confirm` → `onay = 'Onaylandı'`).
**Toplu işlemler:** `bulk[]` 2 — **Klasör değiştir** · **Dışa aktar**. Yetki kapısı yok.
**Bildirimler:** `GV.toast` — "Bu doküman zaten onaylı." (`info`), "Doküman onaylandı" (`ok`), "Doküman adı zorunludur" (`danger`), "Doküman yüklendi" (`ok`), "İndirme başlatıldı (prototip)" (`info`). `GV.confirm` onay öncesi. `GV.notice` / `GV.result` yok.
**Yetkilendirme:** `GV.perm.can(...)` çağrısı **yok** — gizli ve kişisel veri dokümanlarının **adı bu ekranda maskesiz basılıyor** (bulgu; `app-dokuman-sure.html` ve `app-dokuman-detay.html` aynı kayıtları `can('log')` ile maskeliyor). 403 kapısı yok.
**Boş durum:** `GV.empty` — "Bu görünümde doküman yok". **Aksiyon tanımlı değil**.
**Hata durumu:** `GV.errorState` yok.
**Mobil görünüm:** `mobile(x)` var; `card(x)` var (`views:['table','card']`).
**Kabul kriterleri:**
- Yedi sekme 16 doküman türünün tamamını kategorize eder.
- `kalanGun ≤ 15` olan satır `is-late` sınıfını alır.
- Yükleme modalı doküman adı boşken kapanmaz ve gerçek `DOK-…` kaydı üretir.
**Bulgular:** (a) **Gizlilik maskesi yok** — aynı projede iki ekran (`app-dokuman-sure`, `app-dokuman-detay`) doküman adını `can('log')` ile maskelerken bu ekran maskelemiyor. (b) Yükleme modalı `GV.upload` bileşenini kullanmıyor; sürükle-bırak markup'ı elle kurulup `setTimeout(…, 60)` ile bağlanıyor (aynı dosyanın "yeni versiyon" akışı `app-dokuman-sure.html`'de `GV.upload` kullanıyor). (c) `emptyState.action` yok.

---

### `app-dokuman-detay.html` — Doküman Detayı

**Tip:** detay (7 sekme)
**Bölüm:** `SECTIONS.dokuman` — menüde yok, şuradan bağlanır: `app-dokuman.html` kolon bağlantısı ve kardeş doküman tabloları.
**Amaç:** Bir dokümanın kimliğini, versiyonunu, süre/yenileme durumunu, erişim ve gizlilik kurallarını ve bağlı kayıtlarını göstermek.
**Kullanıcılar:** `dokuman` bölümü olan **27 rolün tamamı**; içerik erişimi gizlilik seviyesine göre daralır.
**Veri kaynağı:** `DB.documents` · `DB.customers` · `DB.projects` · `DB.contracts` · `DB.quotes` · `DB.employees` · `DB.roles` · `DB.permMatrix` · `DB.activities` · `DB.today`
**Üst özet kartları:** yok — sağ sütunda dört kart: **Özet** (12 satır) · **Bağlı Kayıt** (5 satır) · **Erişim** (5 satır) · **Son Hareket**.
**Sekmeler:** `GV.tabs('#recTabs')` — 7 sekme.
**Arama:** yok
**Filtreler:** yok
**Tablo kolonları:** Sekme içi tablolar.
**Form alanları:** — (modal içinde 3 alanlı yeni versiyon: Son kullanma tarihi, `GV.upload` dosya alanı, Versiyon notu)
**Detay sekmeleri:**
1. **Genel** — maske uyarısı (varsa) + Doküman Kimliği (5), Dosya Bilgisi (5), Süre ve Geçerlilik (4), Gizlilik ve Onay (3), Bağlı Kayıtlar (4; sözleşme ve teklif "türetildi" etiketiyle).
2. **Versiyon Geçmişi** — veride ayrı versiyon koleksiyonu olmadığı için tek satırlık tablo + iki `GV.notice` (geçmiş tutulmuyor `neutral`; v1…v(n−1) kaydı yok `warn`).
3. **Süre ve Yenileme** — 60/30/15/7 gün ve "süresi doldu" eşiklerine göre altı `GV.notice` dalı + 11 satırlık künye + "Yenilenen nüshayı yükle" aksiyonu; süresiz dokümanda ayrı boş durum.
4. **Erişim ve Gizlilik** — gizlilik seviyesi künyesi (7 satır) + "Bu Dokümana Doğrudan Bağlı Kişiler" tablosu (kaynak alanıyla) + **rol bazlı erişim matrisi** (`DB.permMatrix`'ten 7 kolon: rol, kademe, görüntüleme kapsamı, bu dokümanın içeriği, dışa aktarma, onay, denetim).
5. **Bağlı Kayıtlar** — türetme notu + müşteri/proje/sözleşme/teklif künyesi (9 satır) + aynı bağa sahip kardeş doküman tablosu (9 kolon).
6. **Onay Akışı** — onay zinciri veride olmadığı için `GV.chain` **basılmaz**; künye (6 satır, üçü boş) + boş durum + `can('onay')` ise "Dijital onay ver" butonu.
7. **Aktivite Geçmişi** — `GV.activity(acts)`.
**İşlem butonları:** `GV.pageHead` — "Doküman merkezi" · "Süresi dolanlar" · *(yalnız `can('onay')` ve onay `Bekliyor`)* "Dijital onay ver" · *(yalnız `can('disaAktar')` ve maskesiz)* **"İndir"**. Sekme içi `#btnVersiyon` / `#btnVersiyonSure` / `#btnOnay`.
**Toplu işlemler:** yok
**Bildirimler:** `GV.notice` — içerik maskeli (`warn`), versiyon geçmişi tutulmuyor (`neutral`), ara sürüm kaydı yok (`warn`), süre eşikleri (6 ton dalı), süresiz doküman (`neutral`), erişim listesi türetimi (`neutral`), sözleşme/teklif bağı türetimi (`neutral`), onay zinciri yok (`neutral`). `GV.confirm` onayda · `GV.modal` + `GV.upload` yeni versiyonda · `GV.toast` ("statik prototipte gerçek dosya barındırılmıyor" `info`, "`DOK-…` onaylandı" `ok`, "v(n) yüklendi" `ok`, doğrulama hataları `danger`). `GV.result` yok.
**Yetkilendirme:** `GV.perm.can('log')` → **gizlilik maskesi**: `Gizli` ve `Kişisel veri` dokümanlarında doküman **adı** maskelenir (kod, tür, klasör, tarih açık kalır); modal/toast metinlerinde kayıt kendi koduyla anılır. `GV.perm.can('disaAktar')` → "İndir" aksiyonu hiç basılmaz. `GV.perm.can('onay')` → onay aksiyonu ve butonu hiç basılmaz. `GV.perm.can('duzenle')` → versiyon yükleme aksiyonları hiç basılmaz. `GV.perm.role()` erişim matrisinde oturumun satırını işaretler. 403 kapısı yok.
**Boş durum:** `?id=` bulunamazsa `GV.empty` + "Doküman merkezine dön"; sekme içi boş durumlar (süre takibi yok, bağlı kayıt yok, kardeş doküman yok, onay adımı yok, aktivite yok).
**Hata durumu:** `GV.errorState` yok.
**Mobil görünüm:** `mobile(r)` yok; tablolar `.gv-tablewrap.is-mobilescroll`.
**Kabul kriterleri:**
- Maskeleme kuralı `app-dokuman-sure.html` ile **birebir aynıdır** (aynı eşik, aynı yetki, aynı maske metni).
- Sözleşme ve teklif bağı veride yazılı değildir; proje/müşteri üzerinden türetilir ve **"türetildi" diye etiketlenir**; birden çok aday varsa bağ kurulmaz.
- Rol erişim matrisi `DB.permMatrix` karşılığı olan roller üzerinden kurulur; sayaç ve tablo aynı kümeyi kullanır.
**Bulgular:** (a) Kayıt başlığındaki `<h1>` + `GV.pageHead`'in `<h1>`'i → iki `<h1>`. (b) `versiyon` sekmesinin sayacı `cnt:1` sabittir, `d.versiyon` değerini yansıtmaz.

---

### `app-dokuman-sure.html` — Süresi Dolanlar

**Tip:** liste
**Bölüm:** `SECTIONS.dokuman` → menü etiketi **Süresi Dolanlar** (`cnt:'dokuman'` rozeti)
**Amaç:** Son kullanma tarihi tanımlı dokümanların yenileme takibini yapmak.
**Kullanıcılar:** `dokuman` bölümü olan **27 rolün tamamı**; içerik erişimi gizlilik seviyesine göre daralır.
**Veri kaynağı:** `DB.documents` (yalnız `sonKullanma != null` olanlar) · `DB.customers` · `DB.projects` · `DB.employees` · `DB.today`
**Üst özet kartları:** `kpis[]` 5 — **Süresi dolmuş** · **30 günden az kalan** · **90 günden az kalan** · **Süre takipli doküman** · **Onayı bekleyen**.
**Sekmeler:** `tabs[]` 4 — `tumu` · `doldu` Süresi Doldu · `yaklasan` Yaklaşıyor (≤30 gün) · `gecerli` Geçerli (>30 gün).
**Arama:** `search.fields` = `kod · ad · klasor · tur · format`; **`search.extra`** = yükleyen adı + müşteri kısa adı + proje adı.
**Filtreler:** `tur` multi (16 kalem) · `klasor` multi (kapsamdan türetilir) · `musteri` select · `gizlilik` multi (3 değer) · `onay` select · `sonKullanma` daterange.
**Tablo kolonları:** Doküman kodu · Doküman adı · Tür · **Klasör (varsayılan gizli)** · Müşteri / proje · **Format ve boyut (varsayılan gizli)** · **Versiyon (varsayılan gizli)** · Yükleyen · **Yüklenme tarihi (varsayılan gizli)** · Son kullanma · Kalan gün · Süre durumu · Gizlilik · Onay durumu.
**Form alanları:** — (modal içinde 3 alanlı yeni versiyon: Yeni son kullanma tarihi, `GV.upload` dosya alanı, Versiyon notu)
**Detay sekmeleri:** —
**İşlem butonları:** `GV.pageHead` — "Doküman Merkezi". `rowActions[]` 4 — **Doküman merkezinde aç** · **Müşteriyi aç** (`href` null dönerse `run` ile bilgi toast'ı) · **Yenileme hatırlatması gönder** (`GV.confirm`) · **Yeni versiyon yükle** (`GV.modal` + `GV.upload`; versiyon, son kullanma ve kalan gün gerçekten güncellenir).
**Toplu işlemler:** `bulk[]` 2 — **Hatırlatma gönder** (`confirm` metni var; kişi sayısı hesaplanır) · **Dışa aktar**. Yetki kapısı yok.
**Bildirimler:** `GV.notice` — kapsam notu (`info`; süre takipli N doküman, toplam M kayıt, sol menü rozetiyle aynı koşul). `GV.confirm` hatırlatma öncesi (süresi dolmuşsa `danger`). `GV.modal` + `GV.upload` yeni versiyonda. `GV.toast` — "Hatırlatma … kişisine gönderildi" (`ok`), "N doküman için M kişiye hatırlatma gönderildi" (`ok`), "Yeni versiyon için dosya seçmelisiniz" / "Son kullanma tarihi bugünden ileri olmalıdır" (`danger`), "v(n) yüklendi · yeni son kullanma …" (`ok`), "… bir müşteriye bağlı değil; şirket içi doküman." (`info`). `GV.result` yok.
**Yetkilendirme:** `GV.perm.can('log')` → **gizlilik maskesi**: `Gizli` ve `Kişisel veri` dokümanlarında doküman **adı** maskelenir; sıralama, çıktı ve modal metinleri maskeli değeri (kod) kullanır. Diğer yetki kapısı yok.
**Boş durum:** `GV.empty` — "Bu görünümde süre takipli doküman yok" + uzun açıklama. **Aksiyon tanımlı değil**.
**Hata durumu:** `GV.errorState` yok.
**Mobil görünüm:** `mobile(x)` var; `card(x)` var (`views:['table','card']`).
**Kabul kriterleri:**
- Kaynak **yalnız** `sonKullanma != null` dokümanlardır ve bu kapsam ekranda `GV.notice` ile yazılıdır.
- "Yaklaşıyor" sekmesi ile sol menüdeki `dokuman` sayacı **birebir aynı koşulu** (≤30 gün) kullanır.
- Yeni versiyon yüklemek `versiyon`, `sonKullanma`, `kalanGun` ve `tarih` alanlarını birlikte günceller.
- Maskeli kayıt sıralamada ve Excel çıktısında da maskeli değeri taşır.
**Bulgular:** `emptyState.action` yok.

---


---

## Bölüm 4 — Finans, Satın Alma, Raporlar ve Ayarlar

*40 ekran.*

### `app-sozlesme.html` — Sözleşmeler

**Tip:** liste
**Bölüm:** `SECTIONS.finans` → "Sözleşmeler" (`data-screen="sozlesme"`)
**Amaç:** Müşteri sözleşmelerini bedel, süre, yenileme ve gecikme ekseninde tek listede izlemek.
**Kullanıcılar:** `SEC_BY_ROLE`'da `finans` bölümü olan 8 rol — sahip · genelmudur · sistem · operasyon · satismudur · pm · muhasebe · satinalma. Ekran seviyesinde `SCREEN_PERM` kısıtı yok.
**Veri kaynağı:** `DB.contracts` (kaynak) · `DB.customers` (filtre seçenekleri)
**Üst özet kartları:** 5 KPI — Toplam bedel (KDV hariç, Σ `tutar`) · Genel toplam (KDV dahil, Σ `toplam`) · Aktif sözleşme (durum=Aktif) · Yenilemesi yaklaşan (90 gün) · Süresi geçmiş / gecikmiş. İlk iki kart `canFinans` yoksa 0 basar.
**Sekmeler:** `tabs[]` 6 — Aktif (`durum==='Aktif'`) · Yenilenecek (`yenileme===true`) · Yenilemesi Yaklaşan (0–90 gün) · Tamamlanan · Gecikti (durum Gecikti ya da bitiş geçmiş) · Tümü.
**Arama:** `search.fields` = `kod, ad, musteriAd, musteri, teklif, proje, durum`. `search.extra` yok.
**Filtreler:** 6 — `durum` (multi: Aktif/Tamamlandı/Gecikti) · `musteri` (select, `DB.customers` kısa adı) · `yenileme` (select Evet/Hayır + `test`) · `bitis` (daterange) · `tutarAralik` (select, 4 bant `TUTAR_ARALIK`) · `projeBag` (select: Projeye bağlı / Projesiz).
**Tablo kolonları:** 13 — Sözleşme · Müşteri · Teklif · Proje · Sözleşme bedeli (KDV hariç) · **KDV** *(varsayılan gizli)* · Genel toplam (KDV dahil) · İmza tarihi · Başlangıç · Bitiş · **Ödeme planı** *(gizli)* · **Garanti** *(gizli)* · Yenileme · Durum. Görünümler: `table`, `card`; `pageSize:10`.
**Form alanları:** —
**Detay sekmeleri:** —
**İşlem butonları:** `GV.pageHead` → "Faturalar" (app-fatura.html) · "Yeni Sözleşme" (form). `rowActions[]` 3 — Sözleşmeyi aç · Faturaları gör (`app-fatura.html?sozlesme=`) · **Yenile** (bitişi 1 yıl uzatır, durumu Aktif yapar; `can('duzenle')` ve `yenileme` şartı).
**Toplu işlemler:** `bulk[]` 3 — Toplu Yenile (`can('duzenle')` kapısı, yenilemeye kapalı kayıtları atlar) · Arşivle (`can('duzenle')`, `aktif=false`) · Dışa aktar (kapısız).
**Bildirimler:** `GV.confirm` + `GV.toast` — yenileme onayı/sonucu, yetkisizde `danger` toast, yenilemeye kapalı kayıtta `warn` toast, toplu yenilemede "n sözleşme yenilendi · k kayıt atlandı".
**Yetkilendirme:** `GV.perm.can('finans')` → `tutar/kdv/toplam` kolonları ve ilk iki KPI `••••••` ile maskelenir, `exportValue` boş döner. `GV.perm.can('duzenle')` → yenileme/arşivleme kapısı. Sayfa seviyesi 403 yok (shell bölüm kapısı yeterli).
**Boş durum:** `emptyState` — "Bu görünümde sözleşme yok" + "Yeni Sözleşme" aksiyonu.
**Hata durumu:** `GV.errorState` yok.
**Mobil görünüm:** `mobile(r)` var — kod + tutar, müşteri·ad, durum + "Yenilenecek" rozeti + kalan süre. `card(r)` de tanımlı.
**Kabul kriterleri:**
- `canFinans` kapalı bir rolde 3 para kolonu ve 2 para KPI'ı maskeli; xlsx çıktısında bu kolonlar boş.
- "Yenile" satır aksiyonu yalnız `yenileme===true` kayıtlarda iş yapar; diğerinde `warn` toast basar, veri değişmez.
- Filtre değişince sayfa 1'e döner ve `?t=`/`?f_*` URL'de kalır.

**Bulgular:** `bulk[]` içindeki "Dışa aktar" kaleminin `run`'ı yoktur — `GV.list` içi `doExport` çalışır, ancak yetki kapısı (diğer iki kalemdeki `can('duzenle')` gibi) yoktur; `disaAktar` ekseni bu ekranda hiç okunmuyor.

---

### `app-sozlesme-detay.html` — Sözleşme Detayı

**Tip:** detay
**Bölüm:** menüde yok, şuradan bağlanır: `app-sozlesme.html` (kod hücresi + "Sözleşmeyi aç"), `app-fatura-detay.html`, `app-tahsilat-detay.html`, `app-sozlesme-form.html`.
**Amaç:** Bir sözleşmenin bedel/taksit/fatura/tahsilat zincirini ve yenileme penceresini tek kartta göstermek.
**Kullanıcılar:** `finans` bölümü olan 8 rol.
**Veri kaynağı:** `DB.contracts` · `DB.customers` · `DB.quotes` · `DB.projects` (`DB.proj`) · `DB.milestones` · `DB.invoices` · `DB.payments` · `DB.deliveries` · `DB.activities`
**Üst özet kartları:** yok (KPI şeridi yerine sağ panelde 4 özet kartı: Özet · Faturalama ve Tahsilat · Sözleşme Koşulları · Son Hareket).
**Sekmeler:** `GV.tabs('#recTabs')` 7 — Genel · Ödeme Planı (taksit sayacı) · Faturalar · Tahsilatlar · Proje ve Teslimler · Yenileme · Aktivite Geçmişi.
**Arama:** yok
**Filtreler:** yok
**Tablo kolonları:** sekme içi tablolar — Ödeme Planı 8 kolon (Taksit · Taksit adı · Planlanan tarih · Taksit tutarı KDV hariç · Taksit durumu · Ödeme durumu · İlerleme · Fatura); Faturalar 9 kolon (net/KDV/brüt ayrı); Tahsilatlar 9 kolon (tutar KDV dahil); Teslimler 9 kolon.
**Form alanları:** —
**Detay sekmeleri:**
- **Genel** — 5 bölüm: Sözleşme Kimliği (6 alan) · Bedel ve Vergi (5) · Süre ve Tarihler (7) · Ticari Koşullar (3) · İlgili Kişiler (4, hepsi müşteri/proje kartından türetilmiş; `GV.notice` ile "sözleşme kartında sorumlu alanı yok" denir).
- **Ödeme Planı** — taksit tablosu + Σ taksit = sözleşme neti doğrulaması + taksit sırası 1..N boşluk kontrolü + özet listesi.
- **Faturalar** — net/KDV/brüt kolonları, faturalanma oranı (net/net).
- **Tahsilatlar** — brüt eksen uyarısı, gecikme günü, kalan alacak, tahsilat oranı (brüt/brüt).
- **Proje ve Teslimler** — proje kartı özeti + `sozlesmeTutari === c.tutar` uyum rozeti + teslim tablosu (taksit bağı `deliveries[].milestone`'dan).
- **Yenileme** — 60/30/15/7 gün eşik notu, "Sözleşmeyi bir yıl yenile" butonu.
- **Aktivite Geçmişi** — `GV.activity(acts)`.
**İşlem butonları:** `GV.pageHead` → "Sözleşme listesi" · "Ödeme planı" · koşullu **"Yenile"** (`can('duzenle')` && `yenileme===true` && durum≠İptal). Yenileme sekmesinde ikinci bir "Sözleşmeyi bir yıl yenile" butonu aynı akışı çağırır.
**Toplu işlemler:** yok
**Bildirimler:** `GV.confirm` (yenileme onayı) → `GV.toast('… bir yıl yenilendi','ok')` → `GV.refresh()`; `DB.activities`'e satır düşer. `GV.notice` çok sayıda: finans maskesi, taksit toplamı uyuşmazlığı, taksit sırası boşluğu, projeli sözleşmede boş taksit seti, brüt eksen notu, sorumlu alanı yokluğu.
**Yetkilendirme:** `GV.perm.can('finans')` → tüm para alanları `••••••`, üstte `tone:'neutral'` maske notu. `GV.perm.can('duzenle')` → yenileme aksiyonu hiç basılmaz (devre dışı buton bırakılmaz). 403 kapısı yok.
**Boş durum:** `GV.empty` 7 kez — kayıt bulunamadı (`?id=` hatalı) · taksit yok · fatura yok · tahsilat yok · projesiz sözleşme · teslim yok · aktivite yok. Hepsinde geri dönüş aksiyonu var.
**Hata durumu:** `GV.errorState` yok.
**Mobil görünüm:** `mobile(r)` yok (liste bileşeni kullanılmıyor); sekme içi tablolar `.gv-tablewrap.is-mobilescroll` ile yatay kaydırılır.
**Kabul kriterleri:**
- Σ `milestones.odeme` ≠ `contract.tutar` olduğunda Ödeme Planı sekmesinde `warn` `GV.notice` + "Fark var" rozeti çıkar.
- `canFinans` kapalı rolde 4 sekmedeki hiçbir tutar okunamaz; kayıt sayıları görünmeye devam eder.
- 7 sekmenin 7'si de tıklandığında dolu panel basar (`tabs.js` ölçütü).

**Bulgular:** Faturalar ve Tahsilatlar sekmesindeki satır bağlantıları `app-fatura.html` / `app-tahsilat.html` **listesine** gider, `?id=` ile detaya değil — aynı ekranın "Sözleşme ve Taksit" tablosunda ise `app-fatura-detay.html?id=` kullanılıyor. İki farklı bağlantı ekseni aynı dosyada.

---

### `app-sozlesme-form.html` — Yeni / Düzenle Sözleşme

**Tip:** form
**Bölüm:** menüde yok, şuradan bağlanır: `app-sozlesme.html` "Yeni Sözleşme" + boş durum aksiyonu.
**Amaç:** Sözleşme kaydını net bedel ekseninde açmak/güncellemek ve ödeme planı dengesini ölçmek.
**Kullanıcılar:** `finans` bölümü olan 8 rolden **`can('finans')` ve (`ekle`/`duzenle`) olanlar**; ikisi de yoksa sayfa 403 basar.
**Veri kaynağı:** `DB.contracts` · `DB.customers` · `DB.quotes` · `DB.projects` (`DB.proj`) · `DB.milestones` · `DB.invoices` · `DB.activities` · `DB.today`
**Üst özet kartları:** yok — yerine 4 kart: Kayıt Özeti (düzenlemede 16 satır) · Para Zinciri (canlı) · Ödeme Planı Dengesi (canlı) · kapsam notu.
**Sekmeler:** yok
**Arama:** yok
**Filtreler:** yok
**Tablo kolonları:** —
**Form alanları:** `GV.form` `sections[]` **6 bölüm / 15 alan**:
1. *Sözleşme kimliği ve taraflar* (4) — Sözleşme adı★, Müşteri★, Bağlı teklif, Bağlı proje
2. *Bedel ve vergi* (3) — Sözleşme bedeli (KDV hariç)★, KDV oranı★, Para birimi★
3. *Süre ve tarihler* (3) — İmza tarihi★, Başlangıç★, Bitiş★
4. *Yenileme koşulu* (2) — Yenileme koşulu (switch), Yenileme tarihi
5. *Ticari koşullar* (2) — Ödeme planı (metin)★, Garanti süresi
6. *Durum* (2) — Sözleşme durumu★, Kayıt durumu (switch)
   Zorunlu: 9 alan. Çapraz `validate`: müşteri↔proje↔teklif tutarlılığı, teklif tek sözleşmeye bağlanır, imza≤başlangıç<bitiş, yenileme tarihi zorunluluğu, bitişi geçmiş sözleşme "Aktif" kalamaz, yürürlükteki sözleşme arşivlenemez.
**Detay sekmeleri:** —
**İşlem butonları:** `GV.pageHead` → "Vazgeç" · "Kaydet / Değişiklikleri kaydet"; kart altında ikinci "Kaydet" (`#kaydetAlt`). Kaydetme `form.submit()` → KDV zinciri hesaplanır (`kdv`, `toplam` **hesaplanır, girilmez**) → değişen alan başına `DB.activities` satırı.
**Toplu işlemler:** yok
**Bildirimler:** `GV.toast` (oluşturuldu / n alan güncellendi / değişiklik yok / kaydedilmedi) · `GV.confirm` "Bağlı kayıtlarla denge bozulacak" (taksit toplamı, faturalanan net, proje `sozlesmeTutari` farkında) · `GV.notice` 8+ (teklif→sözleşme brüt kayması kanaryası, ödeme planı dengesi, taksitsiz sözleşme, e-imza kapsam dışı).
**Yetkilendirme:** **Sayfa seviyesi 403**: `!can('finans') || !canYaz` ise `GV.errorState` basılır ve `GV.form` **hiç kurulmaz**; `errorState`'in "Tekrar dene" butonu gerçek aksiyonlarla değiştirilir. Alan maskeleme yok (ya hepsi ya hiç).
**Boş durum:** `GV.empty` 1 — `?id=` var ama kayıt yok.
**Hata durumu:** `GV.errorState` **var** (403 gövdesi).
**Mobil görünüm:** `mobile(r)` yok; `GV.form` ızgarası `cols` ile daralır.
**Kabul kriterleri:**
- KDV oranı ve net bedel değiştikçe Para Zinciri kartı anlık günceller; `kdv`/`toplam` alanları formda **girilemez**.
- Teklifin brüt toplamı net alana yazılırsa `danger` tonlu canlı uyarı çıkar.
- Taksit toplamı ≠ yeni bedel ise kaydetmeden önce `GV.confirm` gelir; "Vazgeç"te `form.setDirty(true)` geri konur.

**Bulgular:** Ölçüm satırları (`brutEsit`, `netEsit`) sayfa açılışında tüm `DB.contracts` üzerinde çalışır; VB-19 düzeltmesi sonrası `brutEsit === 0` beklenir — bu blok artık hiç görünmeyen bir kanaryadır ve kaldırılmadığı için ölü kod riski taşır.

---

### `app-fatura.html` — Faturalar

**Tip:** liste
**Bölüm:** `SECTIONS.finans` → "Faturalar"
**Amaç:** Kesilen faturaları vade, gecikme ve tahsilat durumu ekseninde izlemek.
**Kullanıcılar:** `finans` bölümü olan 8 rol.
**Veri kaynağı:** `DB.invoices` · `DB.customers` · `DB.contracts` (filtre)
**Üst özet kartları:** 4 KPI — Toplam faturalanan (Σ `toplam`, meta: fatura adedi) · Tahsil edilen (durum=Ödendi) · Bekleyen tahsilat (durum=Ödenmedi, meta: 15 gün içinde vadeli) · Geciken tutar (meta: vadesi geçen adedi). Hepsi `canFinans` yoksa 0.
**Sekmeler:** 5 — Açık Faturalar (durum≠Ödendi) · Vadesi Yaklaşan (0–15 gün) · Gecikenler · Ödenenler · Tümü.
**Arama:** `fields` = `kod, musteriAd, musteri, sozlesme, proje, durum`. `extra` yok.
**Filtreler:** 5 — `durum` (multi: Ödendi/Ödenmedi/Gecikti) · `musteri` (select) · `sozlesme` (select, `DB.contracts`) · `tarih` (daterange) · `vade` (daterange).
**Tablo kolonları:** 11 — Fatura · Müşteri · Sözleşme · Proje · Fatura tarihi · Vade · **Matrah** *(gizli)* · **KDV** *(gizli)* · Genel toplam · **Ödeme tarihi** *(gizli)* · Durum. `pageSize:10`, tek görünüm (tablo).
**Form alanları:** —
**Detay sekmeleri:** —
**İşlem butonları:** `pageHead` → "Tahsilatlar" · "Yeni Fatura". `rowActions[]` 3 — Faturayı aç · Tahsilat kaydı (`app-tahsilat.html?fatura=`) · **Ödendi işaretle** (`canFinans` kapısı; `durum='Ödendi'`, `odemeTarihi=DB.today`).
**Toplu işlemler:** 2 — Hatırlatma gönder (yalnız `confirm` metni, `run` yok) · Dışa aktar. **Yetki kapısı yok.**
**Bildirimler:** `GV.confirm` + `GV.toast` (ödendi işaretleme); yetkisizde "Finansal işlem yetkiniz yok" `danger`; zaten ödenmişte `info`.
**Yetkilendirme:** `can('finans')` → Matrah/KDV/Genel toplam kolonları ve 4 KPI maskeli; "Ödendi işaretle" aynı yetkiye bağlı. 403 yok.
**Boş durum:** `emptyState` — "Bu görünümde fatura yok" + "Yeni Fatura".
**Hata durumu:** yok.
**Mobil görünüm:** `mobile(r)` var — kod + toplam (maskeli), müşteri · vade, durum + gecikme rozeti.
**Kabul kriterleri:**
- "Gecikenler" sekmesi `DB.today` eksenli hesaplanır; `new Date()` kullanılmaz.
- `canFinans` kapalı rolde mobil kartta da tutar `••••••` basar.
- Ödendi işaretleme sonrası `refresh()` çağrılır, sayfa yenilenmez (veri kaybı olmaz).

**Bulgular:** "Hatırlatma gönder" toplu işleminin `run`'ı yok — onay verildikten sonra hiçbir şey olmaz ve kullanıcıya geri bildirim de gitmez (sessiz aksiyon). `app-tahsilat.html`'deki aynı adlı toplu işlemin `run`'ı vardır.

---

### `app-fatura-detay.html` — Fatura Detayı

**Tip:** detay
**Bölüm:** menüde yok, şuradan bağlanır: `app-fatura.html`, `app-tahsilat-detay.html`, `app-fatura-form.html`, `app-sozlesme-detay.html` (taksit tablosu).
**Amaç:** Bir faturanın net→KDV→brüt zincirini, taksit karşılığını ve tahsilat dengesini doğrulamalı göstermek.
**Kullanıcılar:** `finans` bölümü olan 8 rol.
**Veri kaynağı:** `DB.invoices` · `DB.customers` · `DB.contracts` · `DB.projects` (`DB.proj`) · `DB.milestones` · `DB.payments` · `DB.activities`
**Üst özet kartları:** yok — sağ panelde 4 kart: Özet · Tutar ve Tahsilat · **Doğrulama** (net+KDV=brüt · taksit=fatura neti · plan toplamı) · Son Hareket.
**Sekmeler:** `GV.tabs` 6 — Genel · Tutar Dökümü · Tahsilatlar · Sözleşme ve Taksit · Proje · Aktivite Geçmişi.
**Arama:** yok
**Filtreler:** yok
**Tablo kolonları:** Tutar Dökümü 4 kolon (Kalem · Eksen · Hesap · Tutar, 3 satır); Tahsilatlar 7 kolon; Sözleşme taksit tablosu 7 kolon.
**Form alanları:** —
**Detay sekmeleri:**
- **Genel** — Fatura Kimliği (7) · Tutar ve Vergi (6, KDV oranı `vergi/tutar`'dan **hesaplanır**) · Tarihler (7) · İlgili Kişiler (4, türetilmiş) · "Kayıtta Tutulmayan Alanlar" notu (seri/sıra no, e-fatura UUID, kalem kırılımı, para birimi yok).
- **Tutar Dökümü** — iki eksen notu + net/KDV/brüt satır tablosu + 10 satırlık özet + tutarsızlık uyarıları.
- **Tahsilatlar** — brüt eksen notu, gecikme, kalan alacak, tahsilat oranı.
- **Sözleşme ve Taksit** — sözleşme kartı (11 alan) + faturanın taksiti (10 alan) + sözleşmenin tüm taksit seti (bu fatura satırı `is-selected`).
- **Proje** — 14 alan; faturanın proje sözleşme tutarındaki payı.
- **Aktivite Geçmişi**.
**İşlem butonları:** `pageHead` → "Fatura listesi" · "Tahsilatlar" · koşullu **"Ödendi işaretle"** (`can('duzenle')` && ödenmemiş). Aksiyon sonrası buton DOM'dan silinir ve `draw()` yeniden çizer.
**Toplu işlemler:** yok
**Bildirimler:** `GV.confirm` + `GV.toast`; `GV.notice` — finans maskesi, "tutar zinciri tutmuyor", "taksit tutarı fatura netiyle eşleşmiyor", iki para ekseni notu, sözleşmesiz/taksitsiz fatura notu, kapsam notu.
**Yetkilendirme:** `can('finans')` → tüm tutarlar maskeli + üstte maske notu; `can('duzenle')` → "Ödendi işaretle". 403 yok.
**Boş durum:** `GV.empty` 5 — kayıt yok · tahsilat yok · sözleşmesiz+taksitsiz · projesiz · aktivite yok.
**Hata durumu:** yok.
**Mobil görünüm:** `mobile(r)` yok; tablolar `is-mobilescroll`.
**Kabul kriterleri:**
- `tutar + vergi !== toplam` olan bir kayıtta hem Tutar Dökümü sekmesinde `warn` notice hem sağ panelde "Fark var" rozeti çıkar.
- Fatura kaydında `doviz` alanı olmadığı için para birimi bağlı sözleşmeden okunur; sözleşmesizde ₺ varsayıldığı **ekranda yazılıdır**.
- Ödendi işaretlemesi `DB.activities`'e eski→yeni değerle satır düşürür.

---

### `app-fatura-form.html` — Yeni / Düzenle Fatura

**Tip:** form
**Bölüm:** menüde yok, şuradan bağlanır: `app-fatura.html`, `app-tahsilat.html` (pageHead "Yeni Fatura"), `app-sozlesme.html` boş durumu.
**Amaç:** Faturayı net matrah ekseninde kesmek ve taksit/tahsilat dengesini kaydetmeden önce ölçmek.
**Kullanıcılar:** `finans` bölümü olan 8 rolden `can('finans')` **ve** `ekle`/`duzenle` olanlar.
**Veri kaynağı:** `DB.invoices` · `DB.customers` · `DB.contracts` · `DB.milestones` · `DB.projects` · `DB.payments` · `DB.activities` · `DB.today`
**Üst özet kartları:** yok — 4 canlı kart: Fatura Bilgileri · Para Zinciri · Sözleşme ve Ödeme Planı · Tahsilat Dengesi.
**Sekmeler:** yok
**Arama:** yok
**Filtreler:** yok
**Tablo kolonları:** —
**Form alanları:** `GV.form` **4 bölüm / 10 alan**:
1. *Müşteri ve bağlar* (4) — Müşteri★, Bağlı sözleşme, Bağlı taksit (ödeme planı), Bağlı proje
2. *Tutar ve vergi* (2) — Fatura net tutarı (KDV hariç · matrah)★, KDV oranı★
3. *Tarihler* (3) — Düzenleme tarihi★, Vade tarihi★, Ödeme tarihi
4. *Durum* (2) — Fatura durumu★, Kayıt durumu (switch)
   Zorunlu: 6. Çapraz `validate`: müşteri↔sözleşme↔proje↔taksit tutarlılığı, bir taksite en fazla bir fatura, fatura neti = taksit `odeme`, düzenleme≤vade, "Ödendi" ise ödeme tarihi zorunlu, vadesi geçmiş fatura "Ödenmedi" kalamaz, tahsil edilmemiş fatura arşivlenemez.
**Detay sekmeleri:** —
**İşlem butonları:** `pageHead` → "Vazgeç" · "Kaydet"; kart altında `#kaydetAlt`. `vergi` ve `toplam` **hesaplanır**; `kdvOran` forma yardımcı alandır, **kayda yazılmaz** (koleksiyonda yok).
**Toplu işlemler:** yok
**Bildirimler:** `GV.toast` · `GV.confirm` ("Bağlı kayıtlar bu formdan güncellenmiyor") · `GV.notice` (bir taksite birden fazla fatura uyarısı, taksitsiz sözleşme, tahsilat kaydı doğmaz, kalem/e-fatura kapsam notu).
**Yetkilendirme:** **Sayfa 403** — `!canFinans || !canYaz` → `GV.errorState` + form hiç kurulmaz; "Tekrar dene" butonu gerçek bağlantılarla değiştirilir.
**Boş durum:** `GV.empty` 1 — `?id=` var, kayıt yok.
**Hata durumu:** `GV.errorState` **var**.
**Mobil görünüm:** yok.
**Kabul kriterleri:**
- Taksit seçim listesinde **faturası kesilmiş taksitler hiç görünmez**; seçilen taksitin tutarı ≠ girilen net ise alan bazlı hata mesajı çıkar.
- KDV oranı alanı kaydedilen nesnede yer almaz; yalnız `vergi` ve `toplam` yazılır.
- `canFinans` kapalı rolde form DOM'a hiç basılmaz (ölü kontrol yok).

---

### `app-tahsilat.html` — Tahsilatlar

**Tip:** liste
**Bölüm:** `SECTIONS.finans` → "Tahsilatlar" (`cnt:'tahsilat'` sayacı, `tone:'danger'`)
**Amaç:** Açık ve gecikmiş alacakları vade/gecikme kademesi ve son aksiyon ekseninde takip etmek.
**Kullanıcılar:** `finans` bölümü olan 8 rol.
**Veri kaynağı:** `DB.payments` · `DB.customers` · `DB.employees` (`DB.emp`)
**Üst özet kartları:** 4 KPI — Bekleyen tahsilat (Σ durum≠Ödendi) · Geciken tutar (durum=Gecikti) · Geciken kayıt (adet) · Ortalama gecikme (gün, `gecikmeGun>0` olanların ortalaması).
**Sekmeler:** 5 — Gecikenler (`gecikmeGun>0`) · Vadesi Yaklaşan (15 gün) · Bekleyenler (durum=Bekliyor) · Tahsil Edilenler · Tümü.
**Arama:** `fields` = `kod, fatura, musteriAd, durum, sonAksiyon`.
**Filtreler:** 6 — `durum` (multi) · `musteri` (select) · `sorumlu` (select, `DB.employees`) · `vade` (daterange) · `gecikmeAralik` (select: 1–15 / 16–30 / 30+ gün, `test`) · `sonAksiyonTarihi` (daterange).
**Tablo kolonları:** 9 — Tahsilat · Fatura · Müşteri · Tutar · Vade · Gecikme · Sorumlu · Son aksiyon · **Son aksiyon tarihi** *(gizli)* · Durum. `pageSize:10`.
**Form alanları:** —
**Detay sekmeleri:** —
**İşlem butonları:** `pageHead` → "Faturalar" · "Sözleşmeler" · "Yeni Fatura". `rowActions[]` 3 — Tahsilatı aç · **Hatırlatma gönder** (`sonAksiyon`/`sonAksiyonTarihi` günceller; yetki kapısı yok) · **Tahsil edildi işaretle** (`canFinans` kapısı; durum=Ödendi, `gecikmeGun=0`).
**Toplu işlemler:** 2 — Toplu hatırlatma (`run` var; ödenmiş kayıtları atlar) · Dışa aktar. Yetki kapısı yok.
**Bildirimler:** `GV.confirm` + `GV.toast`; "Bu tahsilat zaten kapandı" `info`, "Finans kaydı güncelleme yetkiniz yok" `danger`.
**Yetkilendirme:** `can('finans')` → Tutar kolonu ve ilk iki KPI maskeli, "Tahsil edildi" aksiyonu kapalı. Hatırlatma aksiyonu **yetkisiz rollere de açık**. 403 yok.
**Boş durum:** `emptyState` — "Bu görünümde tahsilat yok" (aksiyon **yok**, çünkü tahsilat kaydı fatura kesilerek doğar).
**Hata durumu:** yok.
**Mobil görünüm:** `mobile(r)` var — kod + tutar, müşteri · fatura, durum + gecikme etiketi + vade hücresi.
**Kabul kriterleri:**
- Gecikme > 30 gün olan satır `is-late` sınıfı alır.
- "Tahsil edildi" sonrası kayıt "Gecikenler" sekmesinden düşer, `gecikmeGun` sıfırlanır.
- `canFinans` kapalı rolde tutar kolonu ve mobil kart tutarı `••••••`.

**Bulgular:** "Hatırlatma gönder" hem satır aksiyonunda hem toplu işlemde yetki kapısı taşımıyor; `app-fatura.html`'de aynı işlem yalnızca `confirm` metniyle var ve hiç çalışmıyor — üç ekranda üç farklı davranış.

---

### `app-tahsilat-detay.html` — Tahsilat Detayı

**Tip:** detay
**Bölüm:** menüde yok, şuradan bağlanır: `app-tahsilat.html` (kod hücresi + "Tahsilatı aç"), aynı ekranın "Müşterinin Diğer Tahsilatları" sekmesi.
**Amaç:** Tek bir tahsilat kaydını fatura brütü, taksit neti ve gecikme kademesi ekseninde doğrulamalı göstermek.
**Kullanıcılar:** `finans` bölümü olan 8 rol.
**Veri kaynağı:** `DB.payments` · `DB.invoices` · `DB.customers` · `DB.contracts` · `DB.milestones` · `DB.projects` (`DB.proj`) · `DB.activities`
**Üst özet kartları:** yok — sağ panelde 4 kart: Özet (12 satır) · Gecikme Takibi · **Doğrulama** (tahsilat=fatura brütü · taksit=fatura neti · gecikme=bugün−vade · müşteri kartı bekleyen tahsilat) · Son Hareket.
**Sekmeler:** `GV.tabs` 6 — Genel · Fatura · Sözleşme ve Taksit · Gecikme Takibi · Müşterinin Diğer Tahsilatları · Aktivite Geçmişi.
**Arama:** yok
**Filtreler:** yok
**Tablo kolonları:** Fatura sekmesi 4 kolon (Kalem · Eksen · Hesap · Tutar); taksit seti 7 kolon (Taksit · Adı · Tarih · Tutar KDV hariç · Ödeme durumu · Fatura · Tahsilat); gecikme kademesi tablosu 4 kolon; diğer açık tahsilatlar 7 kolon.
**Form alanları:** —
**Detay sekmeleri:**
- **Genel** — Tahsilat Kimliği (6) · Tutar (4) · Vade ve Gecikme (6, kayıtta yazılı gecikme ile `DB.today`'den hesaplanan gecikme **ayrı satırlarda** ve uyum rozeti) · Takip Aksiyonu (3) · "Kayıtta Tutulmayan Alanlar" notu (ödeme yöntemi, banka, dekont, kısmi tahsilat, para birimi yok).
- **Fatura** — net/KDV/brüt zinciri + tahsilat = fatura brütü doğrulaması.
- **Sözleşme ve Taksit** — sözleşme (11 alan) + taksit (11 alan) + tüm taksit seti.
- **Gecikme Takibi** — 0 / 1–15 / 16–30 / 30+ kademe tablosu ("Bu kademede" / "Geçildi" / "Henüz değil") + kademe gereği metni + "Hatırlatma gönder" butonu.
- **Müşterinin Diğer Tahsilatları** — bu kayıt hariç açık kayıtlar + müşteri açık alacak özeti + müşteri kartı `bekleyenTahsilat` karşılaştırması + risk rozeti.
- **Aktivite Geçmişi**.
**İşlem butonları:** `pageHead` → "Tahsilat listesi" · "Faturalar" · koşullu **"Tahsil edildi işaretle"** (`can('duzenle')` && ödenmemiş). Gecikme sekmesinde `#btnHatirlat` "Hatırlatma gönder" (`can('duzenle')` && açık kayıt).
**Toplu işlemler:** yok
**Bildirimler:** `GV.confirm` → `GV.toast` → `DB.activities` satırı → `GV.refresh()` (700 ms sonra). `GV.notice`: finans maskesi, tahsilat≠fatura brütü, taksit≠fatura neti, gecikme kademesi durumu, brüt eksen notu, kayıt kapsamı, bağlı fatura bulunamadı.
**Yetkilendirme:** `can('finans')` → tüm tutarlar maskeli; `can('duzenle')` → iki aksiyon. 403 yok.
**Boş durum:** `GV.empty` 5 — kayıt yok · fatura kartı yok · sözleşmesiz+taksitsiz · başka açık tahsilat yok · aktivite yok.
**Hata durumu:** yok.
**Mobil görünüm:** yok; tablolar `is-mobilescroll`.
**Kabul kriterleri:**
- Kayıtta yazılı `gecikmeGun` ile `DB.today`'den hesaplanan gecikme farklıysa `warn` notice çıkar ve **büyük olan** ekranda esas alınır.
- Müşteri kartı `bekleyenTahsilat` ≠ açık tahsilat toplamı ise Doğrulama kartında "Fark var" basar.
- 6 sekmenin 6'sı da dolu panel basar.

---

### `app-odemeplani.html` — Ödeme Planları

**Tip:** liste (türetilmiş kaynak)
**Bölüm:** `SECTIONS.finans` → "Ödeme Planları"
**Amaç:** Sözleşme taksitlerinin milestone → fatura → tahsilat zincirini tek ekranda izlemek ve faturası kesilmemiş taksitleri görünür kılmak.
**Kullanıcılar:** `finans` bölümü olan 8 rol.
**Veri kaynağı:** `DB.milestones` (satır kaynağı) · `DB.projects` · `DB.contracts` · `DB.invoices` (okur **ve yazar**) · `DB.payments` · `DB.customers` · `DB.today`
**Üst özet kartları:** 5 KPI — Toplam plan tutarı (KDV hariç, meta: taksit adedi + sözleşmeye bağlı adedi) · Faturalanmış · Tahsil edilmiş · **Faturalanmayı bekleyen** (tamamlanmış ama faturasız taksitler) · Geciken taksit.
**Sekmeler:** 6 — Tümü · Bekleyen (`odemeDurum≠Ödendi`) · Faturalandı · Tahsil Edildi · Geciken · **Faturası Kesilmemiş**.
**Arama:** `fields` = `kod, ad, proje, projeAd, musteriAd, sozlesme, odemePlani, fatura, tahsilat, durum, odemeDurum`.
**Filtreler:** 8 — `proje` · `musteri` · `sozlesme` (select) · `durum` (multi: Tamamlandı/Yaklaşıyor/Gecikti/Planlandı) · `odemeDurum` (multi) · `faturaDurumu` (select + `test`) · `tarih` (daterange) · `tutarAralik` (4 bant).
**Tablo kolonları:** 16 — Taksit · Taksit adı · Proje · Müşteri · Sözleşme · **Ödeme planı** *(gizli)* · Planlanan tarih · Taksit (n/N) · Taksit tutarı (KDV hariç) · Milestone durumu · İlerleme · Fatura · **Fatura toplamı (KDV dahil)** *(gizli)* · **Fatura vadesi** *(gizli)* · Tahsilat · Gecikme · **Ödeme durumu** *(gizli)*. Görünümler `table`,`card`; `archive:false`; `pageSize:10`.
**Form alanları:** —
**Detay sekmeleri:** —
**İşlem butonları:** `pageHead` → "Faturalar" · "Tahsilatlar" · "Sözleşmeler". `rowActions[]` 4 — Projeyi aç · Faturayı aç (`show: !!fatura`) · Tahsilatı aç (`show: !!tahsilat`) · **Fatura kes** (`show: canFinans && can('ekle') && !fatura`; `DB.invoices`'a yeni kayıt push eder, kod `FTR-YYYY-NNN`, KDV %20, vade +30 gün).
**Toplu işlemler:** `bulk` yalnız `canFinans` ise `[Dışa aktar]`, değilse `null` (bar hiç basılmaz).
**Bildirimler:** `GV.confirm` (fatura kesme onayı, matrah/KDV/toplam/vade metniyle) → `GV.toast('FTR-… kesildi …','ok')` → `refresh()`.
**Yetkilendirme:** `can('finans')` → tüm tutarlar `••••••` (`title` ile "yetkiniz yok"), KPI'lar 0; `canKes = canFinans && can('ekle')` → Fatura kes aksiyonu. 403 yok.
**Boş durum:** `emptyState` — "Bu görünümde taksit yok" + "Sözleşmeler" aksiyonu.
**Hata durumu:** yok.
**Mobil görünüm:** `mobile(r)` var (taksit adı + tutar, kod · müşteri, durum + fatura/faturasız rozeti + gecikme); `card(r)` de var.
**Kabul kriterleri:**
- Zincirin eksik halkası olan satırda ilgili satır aksiyonu **hiç basılmaz** (`show(row)`), devre dışı buton kalmaz.
- "Fatura kes" sonrası satır aynı turda "Faturalandı" durumuna geçer (kaynak her `refresh`'te yeniden türetilir).
- Yeni fatura kodu dizi uzunluğundan değil, mevcut en yüksek `FTR-` sırasından üretilir.

**Bulgular:** Satır içi bağlantılar detay ekranı yerine **liste + arama** biçiminde kurulmuş (`app-fatura.html?t=tumu&q=FTR-…`), oysa `app-fatura-detay.html?id=` yayında. Aynı zincirin diğer ekranları detaya bağlanıyor.

---

### `app-butce.html` — Proje Bütçe ve Maliyet

**Tip:** liste + grafik
**Bölüm:** `SECTIONS.finans` → "Proje Bütçe ve Maliyet"
**Amaç:** Proje bazında sözleşme bedeli, onaylı bütçe, gerçekleşen maliyet ve süre sapmasını karşılaştırmak.
**Kullanıcılar:** `finans` bölümü olan 8 rol.
**Veri kaynağı:** `DB.projects` (kaynak) · `DB.invoices` · `DB.payments` · `DB.customers` · `DB.services` (filtre)
**Üst özet kartları:** 4 KPI — Toplam sözleşme bedeli · Toplam onaylı bütçe · Gerçekleşen maliyet · Bütçesi aşan proje. Üçü `mask()` ile `••••••` olur.
**Sekmeler:** 5 — Aktif Projeler (durum≠Teslim && !arsiv) · Bütçe Aşımı · Riskli (`saglik==='Riskli'`) · Tamamlanan · Tümü.
**Arama:** `fields` = `kod, ad, musteriAd, tur, durum, saglik, faz`.
**Filtreler:** 6 — `durum` (multi, 5 değer) · `saglik` (multi: İyi/Dikkat/Riskli) · `musteri` (select) · `butceAsimi` (select + `test`) · `kullanimAralik` (select: <%50 / %50–85 / %85–100 / >%100) · `tur` (multi, `DB.services`) · `baslangic` (daterange).
**Tablo kolonları:** 14 — Proje · Müşteri · Sözleşme bedeli · Onaylı bütçe · Gerçekleşen maliyet · Kalan bütçe · Bütçe kullanımı (progress) · **Tahmini/harcanan süre** *(gizli)* · Süre sapması · **Faturalanan** *(gizli)* · **Tahsil edilen** *(gizli)* · İlerleme · Sağlık · Durum. `defaultSort:'kullanim'` desc.
**Form alanları:** —
**Detay sekmeleri:** —
**İşlem butonları:** `pageHead` → "Projeler" · "Faturalar" · "Sözleşmeler". `rowActions[]` 3 — Proje kartını aç · Projenin faturaları · **Maliyet detayı** (`GV.modal` `size:'lg'`, 15 satırlık `gv-summary`; `canFinans` yoksa `danger` toast).
**Toplu işlemler:** 3 — Bütçe revizyonu iste · Proje yöneticisini uyar · Dışa aktar. **Yetki kapısı yok**, ikisi de yalnız toast basar.
**Bildirimler:** `GV.toast` (revizyon talebi, uyarı gönderimi, maliyet detayı yetkisizliği) · `GV.modal` (maliyet detayı) · `GV.empty` (finans yetkisi yoksa grafik alanında `i-lock` boş durumu).
**Yetkilendirme:** `can('finans')` → 6 para kolonu + kalan bütçe + kullanım oranı + 4 KPI maskeli; **grafik bloğu hiç çizilmez**, yerine `GV.empty` ile "Finansal grafikler gizli" basılır. 403 yok.
**Boş durum:** `emptyState` — "Bu görünümde bütçe kaydı yok" + "Projelere git"; ayrıca grafik alanının kilitli boş durumu.
**Hata durumu:** yok.
**Mobil görünüm:** `mobile(r)` var (maliyet maskeli, kullanım progress'i, sağlık + bütçe aşımı rozeti); `card(r)` de var.
**Kabul kriterleri:**
- `GV.chart.bar` + `GV.chart.donut` + `GV.chart.legend` yalnız `canFinans` açıkken basılır.
- Bütçesi aşan proje satırı `is-late`, kullanım oranı >%100'de progress tonu `danger`.
- "Maliyet detayı" modalı `.page-main` dışına basılır (stacking context kuralı).

---

### `app-satinalma.html` — Satın Alma Talepleri

**Tip:** liste
**Bölüm:** `SECTIONS.satinalma` → "Talepler" (`cnt:'satinalma'`); aynı ekran `?t=onay` ile "Onay Bekleyenler" menü kalemini de karşılar.
**Amaç:** Satın alma taleplerini onay ilerlemesi, öncelik ve ihtiyaç tarihi ekseninde izlemek.
**Kullanıcılar:** `SEC_BY_ROLE`'da `satinalma` bölümü olan 7 rol — sahip · genelmudur · sistem · operasyon · muhasebe · satinalma · idari.
**Veri kaynağı:** `DB.purchases` · `DB.purchaseApprovals` · `DB.departments` · `DB.employees` · `DB.assetCategories` · `DB.priorities`
**Üst özet kartları:** 4 KPI — Açık talep · Onay bekleyen · Bekleyen tutar (Σ `tahminiMaliyet`, onay bekleyenler) · Bu yıl satın alma (teslim alınanlar). Son ikisi `canFinans` yoksa 0.
**Sekmeler:** 6 — Açık Talepler · Taslak · Onay Bekleyenler · Sipariş Verilenler · Teslim Alınanlar · Tümü.
**Arama:** `fields` = `kod, urun, kategori, aciklama, gerekce, butceKodu`.
**Filtreler:** 7 — `durum` (multi, 5 değer) · `kategori` (multi, `DB.assetCategories`) · `dep` (multi, `DB.departments`) · `talepEden` (select) · `oncelik` (multi, `DB.priorities`) · `tahminiMaliyet` (text, "en az" testi) · `ihtiyacTarihi` (daterange).
**Tablo kolonları:** 10 — Talep · Kategori · Talep eden · Miktar · Tahmini maliyet · **Bütçe kodu** *(gizli)* · **Gerekçe** *(gizli)* · Öncelik · İhtiyaç tarihi · Onay ilerlemesi (progress + n/N) · Durum. Görünümler `table`,`kanban` (`groupBy:'durum'`, 4 kolon, özel kart).
**Form alanları:** —
**Detay sekmeleri:** —
**İşlem butonları:** `pageHead` → "Siparişler" · "Yeni Talep". `rowActions[]` 3 — Talebi aç · **Onay zinciri** (`GV.modal` + `GV.chain`, `DB.purchaseApprovals`'tan) · **Onayla** (`can('onay')` kapısı; bekleyen adımı Onaylandı yapar, `onayAdim++`, tamamlanınca durum "Sipariş verildi").
**Toplu işlemler:** 2 — Toplu onayla (`run` **yok**) · Dışa aktar. Yetki kapısı yok.
**Bildirimler:** `GV.confirm` + `GV.toast` (onay adımı / tüm onaylar tamam) · `GV.modal` (onay zinciri; zincir yoksa açıklayıcı metin).
**Yetkilendirme:** `can('finans')` → Tahmini maliyet kolonu, kanban kartındaki tutar, mobil tutar ve 2 KPI maskeli. `can('onay')` → Onayla aksiyonu. 403 yok.
**Boş durum:** `emptyState` — "Bu görünümde satın alma talebi yok" + "Yeni Talep".
**Hata durumu:** yok.
**Mobil görünüm:** `mobile(r)` var (ürün + öncelik, kod · kategori, talep eden + tutar, durum rozeti).
**Kabul kriterleri:**
- `?t=onay` adresi "Onay Bekleyenler" sekmesini açar ve menüdeki `salmaonay` kalemi aktif görünür.
- Onayla aksiyonu `DB.purchaseApprovals` içindeki ilk "Bekliyor" adımı gerçekten günceller.
- İhtiyaç tarihi geçmiş açık talep satırı `is-late`.

**Bulgular:** "Toplu onayla" toplu işleminin `run`'ı yok — seçim yapılıp tıklandığında hiçbir onay ilerlemez ve geri bildirim de verilmez.

---

### `app-satinalma-detay.html` — Satın Alma Talebi Detayı

**Tip:** detay
**Bölüm:** menüde yok, şuradan bağlanır: `app-satinalma.html`, `app-siparis-detay.html`, `app-tedarikci-detay.html`, `app-satinalma-teklif.html`.
**Amaç:** Talebin onay zincirini, toplanan teklifleri, doğan siparişi ve teslimatı tek kartta göstermek.
**Kullanıcılar:** `satinalma` bölümü olan 7 rol.
**Veri kaynağı:** `DB.purchases` · `DB.purchaseApprovals` · `DB.supplierQuotes` · `DB.suppliers` · `DB.orders` · `DB.approvals` · `DB.projects` (`DB.proj`) · `DB.activities` · `DB.employees` (`DB.empName`) · `DB.departments` (`DB.depName`)
**Üst özet kartları:** yok — sağ panelde 4 kart: Özet (10 satır) · Tedarik Kararı · Onay Zinciri · Son Hareket.
**Sekmeler:** `GV.tabs` 6 — Genel · Onay Akışı · Toplanan Teklifler · Sipariş · Teslimat · Aktivite Geçmişi.
**Arama:** yok
**Filtreler:** yok
**Tablo kolonları:** Teklif tablosu 9 kolon (Tedarikçi · Fiyat KDV hariç · Teslim süresi · Garanti · Ödeme koşulu · Teknik uygunluk · **Teklif puanı** · **Tedarikçi genel puanı** · Tercih) — §9c gereği iki puan **ayrı kolonda**. Sipariş tablosu 8 kolon (net/KDV/brüt ayrı).
**Form alanları:** —
**Detay sekmeleri:**
- **Genel** — Talep Kimliği (8) · Talep Sahibi ve Bütçe (4) · Zaman, Öncelik ve Durum (6) · Gerekçe (1) · Tedarik Özeti (4).
- **Onay Akışı** — eşik notu + `GV.chain(adimlar)` + 9 satırlık döküm + yetkisizde "Onay yetkiniz yok" notu.
- **Toplanan Teklifler** — karar özeti (`en düşük seçildi/seçilmedi`, teknik uygunluk notu) + tablo + iki puan ekseni açıklaması.
- **Sipariş** — sipariş tablosu + her sipariş için 13 alanlık döküm (talep tahminiyle fark dahil).
- **Teslimat** — sipariş başına 10 alan + "teslimat kalem dökümü tutulmuyor" notu.
- **Aktivite Geçmişi**.
**İşlem butonları:** `pageHead` → "Talep listesi" · "Teklif karşılaştır" (`?q=<kod>`) · koşullu **"Onayla"** (`can('onay')` && `durum==='Onay bekliyor'` && `onayAdim<onayToplam`).
**Toplu işlemler:** yok
**Bildirimler:** `GV.confirm` + `GV.toast` → `DB.activities` → `GV.refresh()`. `GV.notice`: finans maskesi, onay eşiği açıklaması (`actions` ile ayarlar ekranına bağlanır), tercih durumu, onay yetkisi yok, teslimat kapsamı.
**Yetkilendirme:** `can('finans')` → tüm tutarlar `••••••` + maske notu; `can('onay')` → onay aksiyonu ve yetki notu. 403 yok.
**Boş durum:** `GV.empty` 6 — kayıt yok · onay adımı yok · teklif yok · sipariş yok · teslimat yok · aktivite yok.
**Hata durumu:** yok.
**Mobil görünüm:** yok; tablolar `is-mobilescroll`.
**Kabul kriterleri:**
- "Teklif puanı" ve "Tedarikçi genel puanı" hiçbir yerde aynı hücrede gösterilmez (§9c).
- En düşük teklif seçilmediyse fark tutarı ve yüzdesi + gerekçe `warn` notice'ta yazılır.
- Onay sonrası `onayAdim` hem talep kartında hem zincir görselinde artar.

---

### `app-satinalma-form.html` — Yeni / Düzenle Satın Alma Talebi

**Tip:** form
**Bölüm:** menüde yok, şuradan bağlanır: `app-satinalma.html` (pageHead + boş durum).
**Amaç:** Talep kaydını açmak ve tutar/kategori/proje bağına göre doğacak onay zincirini önizlemek.
**Kullanıcılar:** `satinalma` bölümü olan 7 rolden `can('ekle')` (yeni) / `can('duzenle')` (düzenleme) olanlar.
**Veri kaynağı:** `DB.purchases` · `DB.purchaseApprovals` · `DB.employees` (`DB.emp`) · `DB.departments` (`DB.dep`) · `DB.projects` · `DB.assetCategories` · `DB.priorities` · `DB.permMatrix` · `DB.supplierQuotes` · `DB.orders` · `DB.activities` · `localStorage['gv.onayakis']`
**Üst özet kartları:** yok — Kayıt Bağlamı kartı (düzenlemede 5 satır) + Onay Zinciri Önizlemesi kartı.
**Sekmeler:** yok
**Arama:** yok
**Filtreler:** yok
**Tablo kolonları:** —
**Form alanları:** `GV.form` **4 bölüm / 14 alan**:
1. *Talep bilgisi* (5) — Ürün veya hizmet★, Kategori★, Açıklama★, Teknik özellikler, Miktar★
2. *Bütçe ve gerekçe* (5) — Tahmini maliyet (KDV hariç)★, Bütçe kodu★, Öncelik★, İhtiyaç tarihi★, Talep gerekçesi (textarea)★
3. *Yönlendirme* (3) — Talep eden★, Departman★, İlgili proje
4. *Ek dosya* (1) — Talebe eklenecek dosyalar (`type:'file'`, `multiple`)
   Zorunlu: 10. `onayAdim`/`onayToplam` **forma alan olarak girmez**; eşiklerden hesaplanır.
**Detay sekmeleri:** —
**İşlem butonları:** `pageHead` → "Vazgeç" · "Talebi kaydet / Değişiklikleri kaydet". Kaydetmede yeni kayıt `durum:'Taslak'`, `onayAdim:0`, `onayToplam` = doğrulanmış eşiklerden hesaplanan adım sayısı.
**Toplu işlemler:** yok
**Bildirimler:** `GV.toast` (taslak oluşturuldu + adım sayısı / n alan güncellendi / değişiklik yok) · `GV.notice` (taslak notu, bağlı teklif-sipariş uyarısı, dosya alanı veri modelinde yok, zincir doğrulanamadı `danger`, zincir hesaplanmıştır `ok`) · `GV.chain` (canlı önizleme) · `GV.empty` (tutar girilmeden zincir hesaplanmaz).
**Yetkilendirme:** **Sayfa 403** — `!can('ekle'/'duzenle')` → `GV.errorState` + form kurulmaz ("Tekrar dene" butonu silinir). **Yaşam döngüsü kapısı**: `durum !== 'Taslak'` olan kayıt salt okunur; `warn` notice + Talep Özeti kartı + "Talep detayına git" aksiyonu basılır, form kurulmaz. Ayarlar bağlantısı `GV.perm.sec('ayarlar')` yoksa hiç basılmaz.
**Boş durum:** `GV.empty` 2 — kayıt bulunamadı · tutar girilmeden zincir önizlemesi.
**Hata durumu:** `GV.errorState` **var** (403).
**Mobil görünüm:** yok.
**Kabul kriterleri:**
- Eşik tablosu `DB.purchases.onayToplam` ve `DB.purchaseApprovals` makam sırasıyla doğrulanamazsa önizleme **hiç basılmaz**, yerine `danger` notice çıkar.
- Tutar/kategori/proje/talep eden alanları değiştikçe zincir anlık yeniden çizilir.
- Onay zincirine girmiş talep formdan değiştirilemez (403 değil, yaşam döngüsü kısıtı olarak anlatılır).

**Bulgular:** Onay eşik tablosu (`VARSAYILAN_ADIM`) **hiçbir DB koleksiyonunda tutulmuyor**; `app-ayar-onay.html` ile birebir aynı liste iki dosyada ayrı ayrı yazılı ve senkron kalması `localStorage['gv.onayakis']` üzerinden umuluyor.

---

### `app-satinalma-teklif.html` — Teklif Toplama ve Karşılaştırma

**Tip:** liste + karşılaştırma paneli
**Bölüm:** `SECTIONS.satinalma` → "Teklif Toplama" (`data-screen="salmateklif"`)
**Amaç:** Taleplere gelen tedarikçi tekliflerini yan yana karşılaştırmak ve tercih kaydetmek.
**Kullanıcılar:** `satinalma` bölümü olan 7 rol; tercih değiştirme yalnız `can('onay')`.
**Veri kaynağı:** `DB.purchases` (satır kaynağı) · `DB.supplierQuotes` (okur **ve yazar**) · `DB.suppliers` · `DB.orders` · `DB.projects` · `DB.departments` · `DB.employees` · `DB.priorities`
**Üst özet kartları:** 5 KPI — Teklif bekleyen talep · Toplanan teklif · Ortalama teklif/talep · Tercih bekleyen talep · **En düşük dışı tercih** (meta: toplam fazla ödeme, `canFinans` yoksa uyarı metni).
**Sekmeler:** 5 — Tümü · Teklif Toplanıyor · Tercih Yapıldı · Tercih Bekliyor · Teknik Uygunsuz Teklifli.
**Arama:** `fields` = `kod, urun, kategori, aciklama, gerekce, butceKodu`; **`search.extra`** = talep eden adı + departman adı + teklif veren tedarikçi ünvanları + gerekçeleri.
**Filtreler:** 6 sabit + `canFinans` ise 2 ek = 8 — `dep` (multi) · `talepEden` (select) · `tedarikci` (select + `test`) · `durum` (multi) · `teknikUygun` (select + `test`) · `oncelik` (multi) · *(finans)* `fiyatMin` · `fiyatMax`.
**Tablo kolonları:** 12 — Talep · Departman · Talep eden · Teklif (adet + teknik uygunsuz alt satırı) · En düşük fiyat · Tercih edilen tedarikçi · Fiyat farkı · **Kategori** *(gizli)* · **Öncelik** *(gizli)* · **İhtiyaç tarihi** *(gizli)* · **Proje** *(gizli)* · **Bütçe kodu** *(gizli)* · Durum. Görünümler `table`,`card`.
**Form alanları:** —
**Detay sekmeleri:** —
**İşlem butonları:** `pageHead` → "Satın Alma Talepleri" · "Tedarikçiler". `rowActions[]` 2 — **Teklifleri karşılaştır** (`GV.drawer`, kriterler satır / teklifler kolon, `.is-sticky1` matris) · Talep listesinde aç. Kart/mobil görünümde `data-cmp` butonu aynı drawer'ı açar (olay delegasyonuyla).
**Toplu işlemler:** 1 — Dışa aktar. Yetki kapısı yok.
**Bildirimler:** `GV.drawer` içinde `GV.notice` (en düşük seçildi/seçilmedi, tercih yapılmadı, seçim kapalı, seçim yetkiniz yok) · `GV.toast` tercih seçildiğinde ("… seçildi — önceki tercih kaldırıldı") · sayfa başında `#uyari` alanında **canonical doğrulama**: bir talepte birden çok `tercih` varsa `danger` notice.
**Yetkilendirme:** `can('finans')` → fiyat hücreleri `••••••`, 2 fiyat filtresi hiç eklenmez, KPI meta metni değişir. `can('onay')` → drawer'daki "Bu tedarikçiyi seç" satırı basılır; yoksa açıklayıcı notice. Talep durumu `Sipariş verildi/Teslim alındı/İptal` ise seçim **kilitli**. 403 yok.
**Boş durum:** `emptyState` — "Bu görünümde karşılaştırılacak talep yok" + "Satın Alma Talepleri"; ayrıca drawer içinde teklifsiz talep için `GV.empty`.
**Hata durumu:** yok.
**Mobil görünüm:** `mobile(r)` var; karşılaştırma matrisi `.gv-tablewrap.is-sticky1.is-mobilescroll`.
**Kabul kriterleri:**
- Tercih değiştirildiğinde aynı talebin **diğer tüm** tekliflerinin `tercih` alanı `false` yapılır (tek tercih kuralı).
- Karşılaştırma matrisinde "Teklif puanı" ve "Tedarikçi genel puanı" ayrı satırlardır.
- Kilitli talepte "Bu tedarikçiyi seç" butonu hiç basılmaz.

---

### `app-siparis.html` — Siparişler ve Teslimat

**Tip:** liste
**Bölüm:** `SECTIONS.satinalma` → "Siparişler"
**Amaç:** Verilen siparişleri teslim tarihi, teslim kontrolü ve tutar ekseninde izlemek.
**Kullanıcılar:** `satinalma` bölümü olan 7 rol.
**Veri kaynağı:** `DB.orders` · `DB.suppliers` · `DB.purchases`
**Üst özet kartları:** 4 KPI — Açık sipariş · Geciken teslimat (durum=Sipariş verildi && teslim tarihi geçmiş) · Teslim alınan · Toplam tutar (Σ `toplam`, `canFinans` yoksa 0).
**Sekmeler:** 4 — Açık Siparişler · Geciken Teslimat · Teslim Alınanlar · Tümü.
**Arama:** `fields` = `kod, talep, tedarikci, fatura, irsaliye`.
**Filtreler:** 3 — `durum` (multi: Sipariş verildi/Teslim alındı/İptal) · `tedarikci` (select, `DB.suppliers`) · `teslimTarihi` (daterange).
**Tablo kolonları:** 10 — Sipariş · Tedarikçi · Kaynak talep · Sipariş tarihi · Teslim tarihi · **Tutar** *(gizli)* · Toplam (KDV dahil) · Fatura · **İrsaliye** *(gizli)* · Teslim kontrolü · Durum. `pageSize:25`, tek görünüm.
**Form alanları:** —
**Detay sekmeleri:** —
**İşlem butonları:** `pageHead` → "Talepler" · "Yeni Sipariş". `rowActions[]` 2 — Siparişi aç · **Teslim al** (`GV.modal`: Tam/Eksik/İade radyosu + fatura no + irsaliye no; "İade"de durum `İptal`, diğerinde `Teslim alındı`; kaynak talebin durumu da eşitlenir).
**Toplu işlemler:** 1 — Dışa aktar.
**Bildirimler:** `GV.modal` (Teslim Alma Kontrolü) · `GV.toast` ("… teslim alındı ve envantere aktarıldı" / "zaten teslim alınmış" `info`).
**Yetkilendirme:** `can('finans')` → Tutar ve Toplam kolonları, mobil tutar ve Toplam KPI maskeli. **Teslim alma aksiyonunda yetki kapısı yok.** 403 yok.
**Boş durum:** `emptyState` — "Bu görünümde sipariş yok" (aksiyon yok).
**Hata durumu:** yok.
**Mobil görünüm:** `mobile(r)` var (kod + durum, tedarikçi, teslim tarihi + tutar).
**Kabul kriterleri:**
- Araç kategorisindeki kalemde modal metni "filo modülüne aktarılır", diğerlerinde "demirbaş envanterine aktarılır" der.
- Geciken teslimat satırı `is-late`.
- Teslim alma sonrası kaynak talep de "Teslim alındı" olur.

**Bulgular:** `Teslim al` aksiyonu `can('duzenle')` kapısı taşımıyor — aynı işlem `app-siparis-detay.html`'de `canDuzenle` şartına bağlı. İki ekran arasında yetki ekseni tutarsız. Ayrıca `teslimKontrol` kolonu `Tam` değerini rozet olarak **"Tamam"** diye basıyor, `app-tedarikci-detay.html` de aynı çeviriyi yapıyor, ancak `app-siparis-detay.html` ham değeri (`Tam`) gösteriyor.

---

### `app-siparis-detay.html` — Sipariş Detayı

**Tip:** detay
**Bölüm:** menüde yok, şuradan bağlanır: `app-siparis.html`, `app-tedarikci-detay.html`, `app-satinalma-detay.html`.
**Amaç:** Siparişi kaynak talep, teklif karşılaştırması, onay zinciri, teslimat ve demirbaş aktarımı ekseninde göstermek.
**Kullanıcılar:** `satinalma` bölümü olan 7 rol.
**Veri kaynağı:** `DB.orders` · `DB.suppliers` · `DB.purchases` · `DB.supplierQuotes` · `DB.purchaseApprovals` · `DB.assets` · `DB.activities` · `DB.projects` (`DB.projName`) · `DB.departments` (`DB.depName`)
**Üst özet kartları:** yok — sağ panelde 5 kart: Özet (12 satır) · Teslimat Durumu · Kaynak Talep *(varsa)* · Tedarik Kararı · Son Hareket.
**Sekmeler:** `GV.tabs` 7 — Genel · Kaynak Talep · Teklif Karşılaştırması · Onay Zinciri · Teslimat · **Demirbaşa Aktarım** · Aktivite Geçmişi.
**Arama:** yok
**Filtreler:** yok
**Tablo kolonları:** Teklif tablosu 9 kolon (iki puan ayrı) · Demirbaş tablosu 9 kolon (Demirbaş · Kategori · Marka/model · Seri no · Alış tarihi · Alış fiyatı · Lokasyon · Zimmetli · Durum) · Tedarikçi eşleşmeli bağlam tablosu 6 kolon.
**Form alanları:** —
**Detay sekmeleri:**
- **Genel** — Sipariş Kimliği (4) · Tutar ve Vergi (7, `net+KDV=brüt` doğrulaması + talep tahminiyle net/net fark) · Tarihler ve Teslimat (8, "teslim tarihi çift anlamlıdır" notu) · Tedarikçi Kartı (8).
- **Kaynak Talep** — sapma notu (`ok`/`warn`) + talep kartı (16 alan) + net/net tutar karşılaştırması (6 satır).
- **Teklif Karşılaştırması** — siparişin tedarikçisi teklif listesinde mi notu + tablo + 10 satırlık özet + iki puan ekseni açıklaması.
- **Onay Zinciri** — "zincir kaynak talebe aittir" notu + `GV.chain` + 6 satırlık döküm.
- **Teslimat** — durum notu (iptal/teslim alındı/gecikti/yaklaşıyor/bekleniyor) + 13 alan + kalem dökümü yok notu + koşullu buton.
- **Demirbaşa Aktarım** — `DB.assets[].siparis` bağı (VB-07); bağ yoksa `GV.empty` + **ayrıca** yalnız tedarikçi eşleşmesiyle bulunan demirbaşlar "bu sipariş bağı değildir" etiketiyle ayrı tabloda.
- **Aktivite Geçmişi** — siparişin hareketleri + kaynak talebin hareketleri ayrı bölümde.
**İşlem butonları:** `pageHead` → "Sipariş listesi" · koşullu "Talep detayı" · koşullu "Tedarikçi" · koşullu **"Teslim alındı işaretle"** (`can('duzenle')` && teslim alınmamış && iptal değil). Teslimat sekmesinde `#btnTeslim` aynı akış.
**Toplu işlemler:** yok
**Bildirimler:** `GV.confirm` → `GV.toast` → `DB.activities` (hem sipariş hem talep için) → `GV.refresh()`. `GV.notice` çok sayıda: finans maskesi, teslim tarihi çift anlamlılığı, tutar sapması, teklif farkı, tedarikçi teklif listesinde yok, onay zinciri kaynağı, teslim alma yetkisi yok, kalem dökümü yok, demirbaş bağı yok.
**Yetkilendirme:** `can('finans')` → tüm tutarlar maskeli + maske notu; `can('duzenle')` → teslim alma. 403 yok.
**Boş durum:** `GV.empty` 6 — kayıt yok · kaynak talep yok · teklif yok · onay adımı yok · demirbaş yok · aktivite yok.
**Hata durumu:** yok.
**Mobil görünüm:** yok.
**Kabul kriterleri:**
- `teslimTarihi` etiketi durum'a göre "Planlanan"/"Gerçekleşen" olarak değişir ve niteliği rozetle yazılır.
- Demirbaş bağı yalnız `DB.assets[].siparis` alanından okunur; tedarikçi eşleşmesi **bağ olarak sunulmaz**.
- Teslim alma sonrası kaynak talebin durumu da eşitlenir ve iki ayrı aktivite satırı düşer.

---

### `app-siparis-form.html` — Yeni / Düzenle Sipariş

**Tip:** form
**Bölüm:** menüde yok, şuradan bağlanır: `app-siparis.html` "Yeni Sipariş".
**Amaç:** Onaylanmış talepten sipariş açmak; tutarı talep tahmini ve tedarikçi teklifiyle karşılaştırmak.
**Kullanıcılar:** `satinalma` bölümü olan 7 rolden `can('ekle')`/`can('duzenle')` olanlar.
**Veri kaynağı:** `DB.orders` · `DB.purchases` · `DB.suppliers` · `DB.supplierQuotes` · `DB.assets` · `DB.activities` · `DB.today`
**Üst özet kartları:** yok — canlı karşılaştırma ve demirbaş etkisi blokları.
**Sekmeler:** yok
**Arama:** yok
**Filtreler:** yok
**Tablo kolonları:** —
**Form alanları:** `GV.form` **4 bölüm (finans yetkisi varsa 5) / 8–11 alan**:
1. *Kaynak talep ve tedarikçi* (2) — Kaynak satın alma talebi★, Tedarikçi★
2. *Bedel ve vergi* (3) — **yalnız `can('finans')` varsa basılır** — Sipariş tutarı (KDV hariç)★, KDV oranı (hesap için)★, Para birimi★
3. *Tarihler* (2) — Sipariş tarihi★, Teslim tarihi★
4. *Durum, teslimat ve belgeler* (4) — Sipariş durumu★, Teslim kontrolü, Fatura no, İrsaliye no
5. *Kayıt durumu* (1) — Kayıt durumu (switch)
   `validate`: bir talepten tek sipariş; pasif tedarikçiye sipariş açılmaz; teknik uygun olmayan teklife sipariş verilmez; sipariş≤teslim; gerçekleşen teslim geleceğe yazılamaz; "Teslim alındı"da teslim kontrolü zorunlu, "Sipariş verildi"de yazılamaz; açık sipariş arşivlenemez.
**Detay sekmeleri:** —
**İşlem butonları:** `pageHead` → "Vazgeç" · "Kaydet"; kart altında `#kaydetAlt`. `vergi`/`toplam` hesaplanır; `kdvOran` kayda **yazılmaz** (sipariş kaydında oran alanı yok, düzenlemede geri hesaplanır).
**Toplu işlemler:** yok
**Bildirimler:** `GV.toast` · `GV.confirm` ("Bağlı kayıtlarla denge bozulacak") · `GV.notice` ~14: tutar alanları gizli, adresteki talep bulunamadı, talebin siparişi zaten var, form talepten ön dolduruldu, girilen tutar teklifin brüt karşılığına eşit (`danger`), sipariş neti talep tahminiyle birebir, tedarikçinin teklifi yok, tercih başka tedarikçide, demirbaş doğmamış/doğacak, talep durumu eşitlenecek, iptalde talep durumu değiştirilmez, kalem/iade kapsam notu.
**Yetkilendirme:** **Sayfa 403** — `!canYaz` → `GV.errorState` + form kurulmaz. **Alan seviyesi**: `can('finans')` yoksa "Bedel ve vergi" bölümü forma **hiç eklenmez** (maskeli alan bırakılmaz) ve üstte açıklayıcı not basılır.
**Boş durum:** `GV.empty` 1 — kayıt bulunamadı.
**Hata durumu:** `GV.errorState` **var**.
**Mobil görünüm:** yok.
**Kabul kriterleri:**
- Talep listesinde **siparişi olan talepler görünmez**; seçilirse `validate` hata verir.
- `canFinans` kapalı rolde form 8 alanla kurulur ve tutar hiç sorulmaz.
- Kaydetmede kaynak talebin durumu sipariş durumuna göre eşitlenir; "İptal"de eşitleme yapılmaz.

---

### `app-tedarikci.html` — Tedarikçiler

**Tip:** liste
**Bölüm:** `SECTIONS.satinalma` → "Tedarikçiler"
**Amaç:** Tedarikçi portföyünü kategori, iş hacmi ve genel puan ekseninde listelemek.
**Kullanıcılar:** `satinalma` bölümü olan 7 rol.
**Veri kaynağı:** `DB.suppliers`
**Üst özet kartları:** 4 KPI — Aktif tedarikçi · Toplam sipariş (Σ `siparisSayisi`) · Toplam hacim (Σ `toplamTutar`, `canFinans` yoksa 0) · Ortalama genel puan (`x / 5`).
**Sekmeler:** 5 — Aktif Tedarikçiler · Donanım · Yazılım ve Bulut · Diğer · Tümü.
**Arama:** `fields` = `kod, unvan, kategori, yetkili, vergiNo, adres`.
**Filtreler:** 4 — `kategori` (multi, 5 sabit değer) · `durum` (select Aktif/Pasif) · `odemeVadesi` (multi: Peşin/30 gün/60 gün/Aylık) · `puan` (text, "en az" testi).
**Tablo kolonları:** 9 — Tedarikçi · Kategori · Yetkili · **E-posta** *(gizli)* · **Vergi no** *(gizli)* · Sipariş · Toplam hacim · Ödeme vadesi · **Tedarikçi genel puanı** · Durum. `pageSize:25`, görünümler `table`,`card`.
**Form alanları:** —
**Detay sekmeleri:** —
**İşlem butonları:** `pageHead` → "Siparişler" · "Yeni Tedarikçi". `rowActions[]` 3 — Tedarikçiyi aç · Siparişleri (`app-siparis.html?f_tedarikci=`) · E-posta gönder (`mailto:`).
**Toplu işlemler:** 1 — Dışa aktar.
**Bildirimler:** yok (bu ekran mutasyon yapmaz).
**Yetkilendirme:** `can('finans')` → Toplam hacim kolonu, kart tutarı ve Toplam hacim KPI'ı maskeli. 403 yok.
**Boş durum:** `emptyState` — "Bu görünümde tedarikçi yok"; açıklamada §9c'nin iki puan ekseni ayrımı yazılıdır.
**Hata durumu:** yok.
**Mobil görünüm:** `mobile(r)` var (ünvan + puan rozeti, kategori · sipariş sayısı); `card(r)` de var.
**Kabul kriterleri:**
- Kolon başlığı **"Tedarikçi genel puanı"**dır; teklif puanı bu ekranda hiç görünmez (§9c).
- Puan rozeti tonu 4,5 / 4,0 / 3,5 eşiklerine göre `ok/info/warn/danger` olur.
- "Diğer" sekmesi üç ana kategorinin dışında kalan tüm kayıtları kalansız toplar.

---

### `app-tedarikci-detay.html` — Tedarikçi Detayı

**Tip:** detay
**Bölüm:** menüde yok, şuradan bağlanır: `app-tedarikci.html`, `app-siparis.html`, `app-siparis-detay.html`.
**Amaç:** Tedarikçinin teklif karnesini, sipariş geçmişini ve türetilen teslim performansını göstermek.
**Kullanıcılar:** `satinalma` bölümü olan 7 rol.
**Veri kaynağı:** `DB.suppliers` · `DB.supplierQuotes` · `DB.orders` · `DB.purchases` · `DB.activities`
**Üst özet kartları:** yok — sağ panelde 5 kart: Özet · Yetkili ve İletişim · Teklif Karnesi · Teslim Performansı · Son Hareket.
**Sekmeler:** `GV.tabs` 5 — Genel · Verdiği Teklifler · Siparişler · **Performans** · Aktivite Geçmişi.
**Arama:** yok
**Filtreler:** yok
**Tablo kolonları:** Teklifler 8 kolon (Talep · Teklif fiyatı KDV hariç · Teslim süresi · Garanti · Ödeme koşulu · Teknik uygunluk · **Teklif puanı** · Tercih edildi mi). Siparişler 9 kolon (net/KDV/brüt ayrı). Performans içinde "Sipariş Bazında Teslim Zamanlaması" 8 kolon.
**Form alanları:** —
**Detay sekmeleri:**
- **Genel** — Tedarikçi Kimliği (7) · İletişim (3) · Ticari Koşullar ve İş Hacmi (5) · Değerlendirme (4, iki puan ekseni notuyla).
- **Verdiği Teklifler** — kazanma oranı notu + tablo + 8 satırlık özet.
- **Siparişler** — kapsam notu (kart `siparisSayisi` ↔ sistemdeki kayıt sayısı) + tablo + 8 satırlık özet.
- **Performans** — puan ekseni notu + kapsam notu + Tedarikçi Puanı (4 alan, puan bandı) + Siparişlerden Türetilen Ölçüler (8: zamanında teslim oranı, tam teslim oranı, ortalama teslim süresi…) + sipariş bazında zamanlama tablosu + **"Türetilemeyen performans ölçüleri"** notu.
- **Aktivite Geçmişi**.
**İşlem butonları:** `pageHead` → "Tedarikçi listesi" · "Siparişler" (`?f_tedarikci=`) · "Teklif karşılaştırma". Mutasyon aksiyonu **yok**.
**Toplu işlemler:** yok
**Bildirimler:** `GV.notice` — finans maskesi, kapsam uyarısı (`ok`/`warn`), eksik ölçü listesi, iki puan ekseni, teklif kazanma oranı, türetilecek sipariş kaydı yok. `GV.toast` yok.
**Yetkilendirme:** `can('finans')` → tüm tutarlar maskeli + maske notu. Düzenleme aksiyonu olmadığı için yazma kapısı yok. 403 yok.
**Boş durum:** `GV.empty` 4 — kayıt yok · teklif yok · sipariş yok · aktivite yok.
**Hata durumu:** yok.
**Mobil görünüm:** yok.
**Kabul kriterleri:**
- Zamanında teslim oranı **kaynak talebin `ihtiyacTarihi`ne** göre ölçülür ve bu ölçüt ekranda yazılıdır (taahhüt tarihi veride yok).
- "Tedarikçi genel puanı" ile "Ortalama teklif puanı" ayrı satırlarda; aradaki fark "karşılaştırma değil, iki ayrı ölçü" notuyla verilir.
- Kart `siparisSayisi` > sistemdeki kayıt sayısı ise `warn` kapsam notu basılır.

**Bulgular:** Sipariş tablosundaki bağlantılar `app-siparis.html?q=` (liste + arama) biçiminde; aynı dosyanın "kaynak talep" bağlantısı ise `app-satinalma-detay.html?id=` ile detaya gidiyor. İki farklı hedef ekseni bir tabloda yan yana duruyor.

---

### `app-tedarikci-form.html` — Yeni / Düzenle Tedarikçi

**Tip:** form
**Bölüm:** menüde yok, şuradan bağlanır: `app-tedarikci.html` "Yeni Tedarikçi".
**Amaç:** Tedarikçi kartını kimlik, iletişim, ticari koşul ve genel puan ekseninde yönetmek.
**Kullanıcılar:** `satinalma` bölümü olan 7 rolden `can('ekle')`/`can('duzenle')` olanlar.
**Veri kaynağı:** `DB.suppliers` · `DB.supplierQuotes` · `DB.orders` · `DB.activities` · `DB.today`
**Üst özet kartları:** yok — 3 canlı kart: Tedarikçi Bilgileri · **Puan Eksenleri** · **Ömür Boyu İş Hacmi**.
**Sekmeler:** yok
**Arama:** yok
**Filtreler:** yok
**Tablo kolonları:** —
**Form alanları:** `GV.form` **5 bölüm / 12 alan**:
1. *Tedarikçi kimliği* (4) — Ünvan★, Tedarik kategorisi★, Vergi numarası, Adres
2. *İletişim* (3) — Yetkili kişi, Telefon, E-posta★
3. *Ticari koşullar* (2) — Ödeme vadesi★, Ömür boyu sipariş sayısı★
4. *Değerlendirme* (1) — Tedarikçi genel puanı★
5. *Durum* (2) — Tedarikçi durumu★, Kayıt durumu (switch)
   Zorunlu: 6. `validate`: mükerrer ünvan / vergi no / e-posta; vergi no 10–11 hane; puan tek ondalık, 0–5; ömür boyu sipariş sayısı sistemdeki kayıt sayısından küçük olamaz; aktif tedarikçi arşivlenemez.
   **`toplamTutar` forma konmaz** — sipariş kayıtlarından türetilir (L-08).
**Detay sekmeleri:** —
**İşlem butonları:** `pageHead` → "Vazgeç" · "Kaydet"; kart altında `#kaydetAlt`. Yeni kod `TDR-NNN` (yıl bölümü yok).
**Toplu işlemler:** yok
**Bildirimler:** `GV.toast` · `GV.confirm` ("Kaydetmeden önce onaylayın" — açık sipariş, teklif geçmişi, sipariş sayacı ya da puan değişiminde) · `GV.notice`: iki puan ekseni, bağlı kayıtlar var, hacim sıfır başlar, kart hacmi > sipariş kayıtları (`warn`), birebir (`ok`), sipariş kayıtları kartı aşıyor (`danger`), banka/sözleşme belgeleri kapsam dışı.
**Yetkilendirme:** **Sayfa 403** — `!canYaz` → `GV.errorState` + form kurulmaz. **Alan seviyesi**: `can('finans')` yoksa İş Hacmi kartında **tutar hiç basılmaz**, yerine "İş hacmi tutarları rolünüze kapalı" notu + yalnız adet özetleri gösterilir.
**Boş durum:** `GV.empty` 1 — kayıt bulunamadı.
**Hata durumu:** `GV.errorState` **var**.
**Mobil görünüm:** yok.
**Kabul kriterleri:**
- Puan alanı değiştikçe Puan Eksenleri kartındaki band ve "iki eksen farkı" satırı anlık günceller.
- `toplamTutar` hiçbir koşulda formdan yazılmaz; düzenlemede kart değeri olduğu gibi korunur.
- `can('finans')` kapalı rolde İş Hacmi kartında hiçbir tutar (maskeli bile) basılmaz.

---

### `app-rapor.html` — Rapor Merkezi

**Tip:** özel (katalog / arama)
**Bölüm:** `SECTIONS.rapor` → "Rapor Merkezi"
**Amaç:** Yedi rapor kategorisini, içindeki raporları ve kayıtlı rapor kısayollarını tek yerden aratmak.
**Kullanıcılar:** `SEC_BY_ROLE`'da `rapor` bölümü olan 11 rol — sahip · genelmudur · sistem · operasyon · depmudur · satismudur · pm · takimlideri · ik · muhasebe · satinalma.
**Veri kaynağı:** `DB.today` · `DB.roleName` (rapor listeleri **kodda gömülü `CATS` kataloğudur**, DB koleksiyonu değildir) · `localStorage['gv.rp.<sid>']`
**Üst özet kartları:** 4 KPI (elle basılan `.kpi-grid`) — Tanımlı rapor (`TOTAL`) · Erişebildiğiniz rapor · Kayıtlı rapor · Açık kategori (`n / 7`, meta: oturum rolü).
**Sekmeler:** `tabs[]` yok — yerine 7 kategori kartı: Müşteri (14) · Personel (13) · Görev (19) · Referans (10) · Filo (19) · Satış ve Finans (16) · Proje (**katalogda 8**). Her kart raporları `.tag` çipleri olarak listeler.
**Arama:** ekranın kendi arama kutusu `#rpQ` — Türkçe normalleştirilmiş (`İ/I/ş/ğ/ü/ö/ç`) kategori adı + rapor adı üzerinde çalışır, eşleşmeyen çipleri `display:none` yapar, sayaçları günceller.
**Filtreler:** yok (yalnız arama + "Aramayı temizle").
**Tablo kolonları:** Kayıtlı raporlar tablosu 4 kolon — Kayıt adı · Kategori · Saklanan filtreler (çip) · İşlem (sil).
**Form alanları:** —
**Detay sekmeleri:** —
**İşlem butonları:** `pageHead` → "Kayıtlı raporlar" (`#rpJump`, sayfa içi kaydırma) · "Ana Panel". Kart altında "Kategoriyi aç"; kilitli kategoride bunun yerine "Kategori kilitli" metni.
**Toplu işlemler:** yok
**Bildirimler:** `GV.confirm` (kayıtlı rapor silme, `tone:'danger'`) → `GV.toast('… silindi','ok')`.
**Yetkilendirme:** kategori bazlı `GV.perm.can(c.perm)` — `musteriRapor` (müşteri, referans) · `personelRapor` (personel) · `finans` (satış ve finans); görev, filo, proje kategorilerinde `perm:null`. Kilitli kategoride rapor çipleri **bağlantısız `<span>`** olur, gerekçeli metin basılır. 403 sayfa kapısı yok (shell bölüm kapısı yeterli).
**Boş durum:** `GV.empty` 2 — kayıtlı rapor yok (aksiyon: Görev raporlarını aç) · aramada eşleşme yok (aksiyon: Aramayı temizle).
**Hata durumu:** yok.
**Mobil görünüm:** `mobile(r)` yok; kategori kartları `.gv-grid-3` ile daralır.
**Kabul kriterleri:**
- Kilitli kategorinin rapor çipleri tıklanabilir olmamalı ve kilit gerekçesi yetki eksenine göre değişmeli.
- Kayıtlı rapor bağlantısı `?r=<rapor>&rf_<filtre>=<değer>` biçiminde üretilmeli.
- Arama "tahsilat", "kapasite", "muayene" gibi kelimelerde ilgili kategoriyi ve rapor sayısını doğru raporlamalı.

**Bulgular (kritik):** Katalog, ekranların gerçek `reports[]` tanımlarıyla **iki yerde uyuşmuyor**:
1. **Proje kategorisi** katalogda **8 rapor** (`genel, durum, sprint, milestone, butce, kaynak, gecikme, risk`), gerçekte `app-rapor-proje.html` **12 rapor** taşıyor ve anahtarların yalnız 3'ü (`butce`, `sprint`, `milestone`, `kaynak`) örtüşüyor. `TOTAL` bu yüzden **99** hesaplanıyor, gerçek toplam **103**.
2. **Satış ve Finans** kategorisinde anahtarlar farklı yazılmış (`leadKaynak` ↔ `leadkaynak`, `teklifBasari` ↔ `teklif`, `satisSuresi` ↔ `satissure`, `tahminGelir` ↔ `tahminigelir`, `butce` ↔ `projebutce`, `maliyet` ↔ `projemaliyet`, `musteriKar` ↔ `musterikar`, `hizmetKar` ↔ `hizmetkar`, `aylikGelir` ↔ `aylikgelir`).
Her iki kategori `deep:false` olduğu için çip bağlantısı `?r=` taşımıyor ve hata **ekranda görünmüyor**; ancak kayıtlı rapor geri yüklemesinde (`reportLabel`) yanlış etiket üretme riski var.

---

### `app-rapor-musteri.html` — Müşteri Raporları

**Tip:** rapor (`GV.report`)
**Bölüm:** `SECTIONS.rapor` → "Müşteri Raporları" (`data-screen="rapormusteri"`)
**Amaç:** Müşteri portföyünün iletişim, satış, teslim, destek ve finans eksenlerini 14 raporda okumak.
**Kullanıcılar:** `rapor` bölümü olan 11 rol; rapor merkezinden gelen kilit `musteriRapor` eksenine bağlıdır (bu ekranda ayrıca 403 basılmaz).
**Veri kaynağı:** `DB.customers` · `DB.contracts` · `DB.invoices` · `DB.payments` · `DB.projects` · `DB.tasks` · `DB.tickets` · `DB.supportPackages` · `DB.quotes` · `DB.leads` · `DB.interactions` · `DB.meetings` · `DB.changeRequests` · `DB.pipelineStages` · `DB.today`
**Üst özet kartları:** her raporun kendi `kpis[]`'i — **ortak desen 4 kart**: adet (kayıt sayısı) + durum kırılımı + bir para toplamı (`format:kMoney`) + bir risk/uyarı sayacı. Para kartları `canFinans` yoksa maskelenir.
**Sekmeler:** `reports[]` **14 rapor**, 4 grup:
- *Genel* — `genel` Müşteri genel raporu
- *Müşteri İlişkileri* — `iletisim` İletişim raporu · `memnuniyet` Memnuniyet raporu · `risk` Risk raporu
- *Satış ve Fırsat* — `teklif` Teklif raporu · `donusum` Satış dönüşüm raporu · `capraz` Çapraz satış fırsatları · `yenileme` Yenileme fırsatları
- *Teslim ve Destek* — `proje` Proje raporu · `destek` Destek raporu
- *Finans* — `finans` Finans raporu · `tahsilat` Tahsilat raporu · `karlilik` Kârlılık raporu · `ltv` Müşteri yaşam boyu değeri
**Arama:** her raporun `table.search` bloğu ayrı — örn. `genel`: `kod, unvan, kisa, sektor, sorumluAd`.
**Filtreler:** ekran düzeyinde ortak `filters[]` **5** — `tarih` (date, "Başlangıç tarihi") · `musteri` (select) · `proje` (select) · `durum` (select, müşteri durumu) · `sorumlu` (select). URL: `?r=<rapor>&rf_<filtre>=<değer>`.
**Tablo kolonları:** rapor başına ayrı `table.columns`; **ortak desen**: ilk kolon `locked` müşteri hücresi (`custCell`, unvan + kod), ardından `moneyCol(...)` ile üretilen para kolonları (alt satırda adet/marj bilgisi), sonra sayaç kolonları (`scoreCell`), en sonda tarih/rozet kolonları. `genel` raporu **16 kolon** ile en geniş olanı. Aykırı olanlar: `donusum` ve `capraz` raporları müşteri yerine aşama/hizmet kırılımı satırı üretir.
**Form alanları:** —
**Detay sekmeleri:** —
**İşlem butonları:** `pageHead` → "Müşteriler" · "Tahsilat Takibi". Ayrıca `GV.report` filtre şeridi: **Filtreleri temizle · Kayıtlı raporlar · Raporu kaydet**.
**Toplu işlemler:** rapor tablolarında `bulk` yok; `export` `canExp` ile açılır.
**Bildirimler:** `GV.toast` (rapor kaydetme/silme, `GV.report` iskeletinden).
**Yetkilendirme:** `GV.perm.can('finans')` → para kolonları ve para KPI'ları maskelenir; `GV.perm.can('disaAktar')` → `table.export` açılır/kapanır. 403 kapısı yok.
**Boş durum:** her raporun `table.emptyState`'i var (**14/14**) — "Bu filtrede … yok" + filtre değiştirme önerisi.
**Hata durumu:** `GV.errorState` yok.
**Mobil görünüm:** `mobile(r)` **14/14 raporda tanımlı** — bu ekran mobil kapsamı tam olan üç rapor ekranından biri.
**Kabul kriterleri:**
- 14 raporun 14'ünde de tablo, KPI ve grafik birlikte basılır; boş filtrede `emptyState` görünür.
- `?r=karlilik&rf_musteri=MUS-00x` adresi doğrudan o raporu seçili ve filtreli açar.
- `canFinans` kapalı rolde `moneyCol` üretimi maskeli değer basar, çıktıya girmez.

---

### `app-rapor-personel.html` — Personel Raporları

**Tip:** rapor (`GV.report`)
**Bölüm:** `SECTIONS.rapor` → "Personel Raporları" (`raporpersonel`)
**Amaç:** İş yükü, kapasite, zaman, performans, özlük ve varlık eksenlerinde 13 rapor.
**Kullanıcılar:** `rapor` bölümü olan 11 rol; ekranda ayrıca `GV.perm.can('personelRapor')` okunur.
**Veri kaynağı:** `DB.employees` (`DB.emp`) · `DB.departments` · `DB.tasks` · `DB.projects` · `DB.timelogs` · `DB.timesheets` · `DB.capacity` · `DB.performance` · `DB.trainings` · `DB.leaves` · `DB.assignments` · `DB.assets` · `DB.vehicles` · `DB.fuelLogs` · `DB.accidents` · `DB.fines` · `DB.today`
**Üst özet kartları:** rapor başına 4 KPI — **ortak desen**: personel adedi + bir oran (doluluk / tamamlama / katılım) + bir saat toplamı (`F.hours`) + bir uyarı sayacı (eksik, aşım, geciken).
**Sekmeler:** `reports[]` **13 rapor**, 6 grup:
- *Genel* — `genel` Personel genel raporu
- *Görev ve Katkı* — `gorev` Görev raporu · `isyuku` İş yükü raporu · `katki` Proje katkı raporu
- *Zaman ve Kapasite* — `zaman` Zaman raporu · `kapasite` Kapasite raporu · `mesai` Fazla mesai raporu · `eksik` Eksik çalışma raporu
- *Performans ve Gelişim* — `performans` Performans raporu · `egitim` Eğitim raporu
- *Özlük* — `izin` İzin raporu
- *Varlık ve Filo* — `zimmet` Zimmet raporu · `arac` Araç kullanım raporu
**Arama:** rapor başına `table.search`; ortak alanlar `kod, ad, depAd, pozisyon`.
**Filtreler:** ortak **5** — `tarih` (date) · `dep` (select) · `personel` (select) · `proje` (select) · `durum` (select).
**Tablo kolonları:** ortak desen: ilk kolon `locked` personel hücresi (ad + pozisyon/departman), ardından saat kolonları (`F.hours`), oran kolonları (`GV.progress`), en sonda rozet. **Aykırı olan:** `performans` raporunda puan kolonları, `izin` raporunda gün bakiyesi, `arac` raporunda km/yakıt kolonları; `zimmet` raporunda satır personel değil demirbaş eksenli.
**Form alanları:** —
**Detay sekmeleri:** —
**İşlem butonları:** `pageHead` → "Personel" · "Kapasite" · "Performans". `GV.report` şeridi: Filtreleri temizle · Kayıtlı raporlar · Raporu kaydet.
**Toplu işlemler:** yok.
**Bildirimler:** `GV.toast` (rapor kaydet/sil).
**Yetkilendirme:** dört eksen okunur — `can('personelRapor')` (ekranın ana ekseni) · `can('maas')` (ücret/maliyet kolonları) · `can('finans')` (para toplamları) · `GV.perm.scope('gor')` (görünen personel kümesi: `tum` / `departman` / `kendi`). 403 sayfa kapısı yok.
**Boş durum:** `table.emptyState` **13/13** + ayrıca 1 `GV.empty` (kapsam dışı durum).
**Hata durumu:** yok.
**Mobil görünüm:** `mobile(r)` **13/13 raporda tanımlı** — kapsamı tam.
**Kabul kriterleri:**
- `scope('gor')` `kendi` olan rolde tablo yalnız oturum sahibinin satırını getirir.
- `can('maas')` kapalı rolde ücret ve maliyet kolonları maskeli, çıktıya girmez.
- 13 raporun 13'ünde mobil kart görünümü aynı veri kaynağından üretilir.

---

### `app-rapor-gorev.html` — Görev Raporları

**Tip:** rapor (`GV.report`)
**Bölüm:** `SECTIONS.rapor` → "Görev Raporları" (`raporgorev`)
**Amaç:** Görev akışının tüm durumlarını, kırılımlarını ve verimlilik oranlarını 19 raporda okumak.
**Kullanıcılar:** `rapor` bölümü olan 11 rol; **bu ekranda hiçbir `GV.perm.can(...)` çağrısı yoktur** (rapor merkezinde de `perm:null`).
**Veri kaynağı:** `DB.tasks` · `DB.taskDeps` · `DB.taskStatuses` · `DB.deptRequests` · `DB.decisions` · `DB.meetings` · `DB.messages` · `DB.channels` · `DB.projects` · `DB.customers` · `DB.departments` (`DB.dep`,`DB.depName`) · `DB.employees` (`DB.empName`) · `DB.today`
**Üst özet kartları:** rapor başına 3–4 KPI — **ortak desen**: görev adedi + oran (%) + ortalama gün/saat + bir uyarı sayacı. Para ekseni **yok** (bu ekranda hiç tutar gösterilmez).
**Sekmeler:** `reports[]` **19 rapor**, 4 grup:
- *Durum* (8) — `acik` Açık görevler · `geciken` Geciken görevler · `engellenen` Engellenen görevler · `atanmamis` Atanmamış görevler · `kabul` Kabul bekleyen görevler · `kontrol` Kontrol bekleyen görevler · `revize` Revizedeki görevler · `tamamlanan` Tamamlanan görevler
- *Dağılım* (3) — `departman` Departman bazlı görevler · `projeBazli` Proje bazlı görevler · `musteriBazli` Müşteri bazlı görevler
- *Verimlilik* (5) — `sure` Tahmini ve gerçekleşen süre · `zamaninda` Zamanında tamamlama oranı · `revizyonOrani` Revizyon oranı · `yenidenAcilma` Yeniden açılma oranı · `kalite` Görev kalite sonuçları
- *Kaynak* (3) — `talep` Departmanlar arası talepler · `sohbet` Sohbetten oluşan görevler · `toplanti` Toplantıdan oluşan görevler
**Arama:** rapor başına `table.search`; ortak alanlar `kod, baslik, durum`.
**Filtreler:** ortak **6** — `tarih` (date, "Tarihten itibaren") · `dep` · `personel` · `proje` · `musteri` · `durum` (hepsi select).
**Tablo kolonları:** ortak desen: `kod` + başlık (`locked`) · sorumlu (`GV.user`) · departman/proje · öncelik (`GV.pri`) · termin (`GV.dateCell`) · durum (`GV.badge`). *Dağılım* grubundaki 3 rapor satır ekseni olarak görevi değil departman/proje/müşteriyi kullanır ve adet+oran kolonları taşır; *Verimlilik* grubunda tahmini/gerçek saat ve yüzde kolonları öne çıkar.
**Form alanları:** —
**Detay sekmeleri:** —
**İşlem butonları:** `pageHead` → "Görev Listesi" · "Departman Talepleri". `GV.report` şeridi standart.
**Toplu işlemler:** yok.
**Bildirimler:** `GV.toast` (rapor kaydet/sil).
**Yetkilendirme:** yok — ekran hiçbir yetki ekseni okumuyor, alan maskeleme yok, 403 yok.
**Boş durum:** `table.emptyState` **20 kez** tanımlı (19 rapor + bir raporun ikinci tablosu).
**Hata durumu:** yok.
**Mobil görünüm:** `mobile(r)` yalnız **3 raporda** tanımlı.
**Kabul kriterleri:**
- "Açık" / "Geciken" tanımı `app-gorev.html` ile birebir aynı olmalı (`Tamamlandı/İptal edildi/Arşivlendi` dışı, termin < `DB.today`).
- `sohbet` ve `toplanti` raporları görev ile kaynak arasındaki **veride yazılı** bağı kullanmalı, tarih yakınlığı kullanmamalı.
- Filtre değişince seçili rapor korunur, sayfalama 1'e döner.

**Bulgular:** 19 raporun **16'sında `mobile(r)` yok** — ≤760px'de `.gv-tablewrap` gizlendiği için bu raporlar mobilde **boş** kalır. Ekran ayrıca hiçbir yetki ekseni okumaz; `disaAktar` kapısı da yoktur, yani dışa aktarma yetkisi olmayan rol de rapor çıktısı alabilir.

---

### `app-rapor-referans.html` — Referans Raporları

**Tip:** rapor (`GV.report`)
**Bölüm:** `SECTIONS.rapor` → "Referans Raporları" (`raporreferans`)
**Amaç:** Yönlendiren kişi ve kanal performansını, referans dönüşümünü, ciro/kâr ve komisyon takibini 10 raporda okumak.
**Kullanıcılar:** `rapor` bölümü olan 11 rol; ekranda `GV.perm.can('musteriRapor')` okunur.
**Veri kaynağı:** `DB.referrers` · `DB.commissions` · `DB.leads` · `DB.customers` · `DB.contracts` · `DB.invoices` · `DB.payments` · `DB.projects` · `DB.employees` (`DB.empName`) · `DB.today`
**Üst özet kartları:** rapor başına 4 KPI — **ortak desen**: yönlendiren/aday adedi + dönüşüm oranı (%) + bir NET para toplamı (ciro/kâr/komisyon) + bekleyen sayacı.
**Sekmeler:** `reports[]` **10 rapor**, 3 grup:
- *Kaynak ve Dönüşüm* (3) — `kaynaklar` Referans kaynakları · `performans` Yönlendiren kişi performansı · `donusum` Referans dönüşüm oranı
- *Finans* (4) — `ciro` Referansla oluşan ciro · `kar` Referansla oluşan kâr · `odenen` Ödenen komisyonlar · `bekleyen` Bekleyen komisyonlar
- *Kırılım* (3) — `personel` Personel referansları · `musteriRef` Müşteri referansları · `devamlilik` Referans kaynaklı müşteri devamlılığı
**Arama:** rapor başına `table.search`; ortak alanlar `kod, ad, tur, firma`.
**Filtreler:** ortak **5** — `tarih` (date) · `referans` (select, yönlendiren kişi) · `musteri` (select) · `tur` (select, referans türü) · `durum` (select, kaynak durumu).
**Tablo kolonları:** ortak desen: yönlendiren hücresi (`locked`, ad + tür) · yönlendirme/kazanılan adetleri · dönüşüm oranı (`GV.progress`) · **NET** para kolonları (`ciro`, `hakedis`, `odenen`, `bekleyen`) · durum rozeti. *Kırılım* grubunda satır ekseni müşteri ya da personel olur; `devamlilik` raporunda süre/yenileme kolonları öne çıkar.
**Form alanları:** —
**Detay sekmeleri:** —
**İşlem butonları:** `pageHead` → "Yönlendirenler" · "Komisyon Kazançları" · "Müşteri Adayları". `GV.report` şeridi standart.
**Toplu işlemler:** yok.
**Bildirimler:** `GV.toast` (rapor kaydet/sil).
**Yetkilendirme:** `can('finans')` → ciro/kâr/komisyon kolonları maskeli; `can('musteriRapor')` → ekranın ana ekseni. 403 yok.
**Boş durum:** `table.emptyState` **10/10** + 1 `GV.empty`.
**Hata durumu:** yok.
**Mobil görünüm:** `mobile(r)` yalnız **1 raporda** tanımlı.
**Kabul kriterleri:**
- Komisyon toplamları `DB.commissions`'tan türetilir; `DB.referrers[].hakedis` doğrulama çapası olarak kullanılır (§9b).
- Tüm para kolonları **NET** ekseninde ve etikette bu yazılı.
- `canFinans` kapalı rolde 4 finans raporu tablo satırlarını gösterir, tutarları maskeler.

**Bulgular:** 10 raporun **9'unda `mobile(r)` yok** — mobilde bu raporlar boş kalır.

---

### `app-rapor-filo.html` — Filo Raporları

**Tip:** rapor (`GV.report`)
**Bölüm:** `SECTIONS.rapor` → "Filo Raporları" (`raporfilo`)
**Amaç:** Araç envanterini, yenileme takvimini, maliyeti, kullanımı ve olayları 19 raporda okumak.
**Kullanıcılar:** `rapor` bölümü olan 11 rol; rapor merkezinde `perm:null`, ekranda yalnız `can('finans')` okunur.
**Veri kaynağı:** `DB.vehicles` · `DB.maintenance` · `DB.inspections` · `DB.policies` · `DB.fuelLogs` · `DB.vehicleExpenses` · `DB.accidents` · `DB.fines` · `DB.employees` (`DB.emp`,`DB.empName`) · `DB.departments` (`DB.dep`,`DB.depName`) · `DB.projects` · `DB.today`
**Üst özet kartları:** rapor başına 4 KPI — **ortak desen**: araç adedi + kalan gün / geciken sayacı + bir **BRÜT (KDV dahil)** para toplamı + bir oran. Maliyet raporlarında ek olarak birim maliyet (₺/km, ₺/L) kartı.
**Sekmeler:** `reports[]` **19 rapor**, 6 grup:
- *Envanter* (4) — `aktif` Aktif araçlar · `tahsisli` Personele tahsisli araçlar · `ortak` Ortak kullanım araçları · `serviste` Servisteki araçlar
- *Yenileme* (5) — `bakimYaklasan` Bakımı yaklaşan · `bakimGeciken` Bakımı geciken · `muayene` Muayenesi yaklaşan · `sigorta` Sigortası yaklaşan · `kasko` Kaskosu yaklaşan
- *Maliyet* (3) — `yakit` Yakıt tüketimi · `gider` Araç giderleri · `kmMaliyet` Kilometre başına maliyet
- *Kullanım* (3) — `personelKullanim` Personel bazlı kullanım · `depKullanim` Departman bazlı kullanım · `projeKullanim` Proje bazlı kullanım
- *Olay* (2) — `kaza` Kaza ve hasar · `ceza` Trafik cezaları
- *Mülkiyet* (2) — `kiralama` Kiralama sözleşmeleri · `sahiplik` Satın alma ve kiralama karşılaştırması
**Arama:** rapor başına `table.search`; ortak alanlar `plaka, marka, model, kod`.
**Filtreler:** ortak **6** — `tarih` (date) · `arac` (select) · `personel` (select, "Sürücü / personel") · `dep` (select) · `proje` (select) · `durum` (select).
**Tablo kolonları:** ortak desen: plaka hücresi (`locked`, plaka + marka/model) · tahsisli personel (`GV.user`) · km · tarih kolonları (`GV.dateCell` + kalan gün) · **BRÜT** tutar kolonları · durum rozeti. *Kullanım* grubunda satır ekseni personel/departman/proje olur (araç değil); `sahiplik` raporu satın alma ↔ kiralama karşılaştırma satırları üretir; `kmMaliyet` raporunda ₺/km türetilmiş kolonu vardır.
**Form alanları:** —
**Detay sekmeleri:** —
**İşlem butonları:** `pageHead` → "Araçlar" · "Bakım" · "Araç Giderleri". `GV.report` şeridi standart.
**Toplu işlemler:** yok.
**Bildirimler:** `GV.toast` (rapor kaydet/sil).
**Yetkilendirme:** yalnız `GV.perm.can('finans')` → maliyet, gider, prim ve ceza tutarları maskeli. `disaAktar` kapısı yok. 403 yok.
**Boş durum:** `table.emptyState` **21 kez** (19 rapor + 2 ek tablo).
**Hata durumu:** yok.
**Mobil görünüm:** `mobile(r)` yalnız **4 raporda** tanımlı.
**Kabul kriterleri:**
- Yenileme grubundaki 5 raporun eşikleri `DB.today` üzerinden ölçülür (60/30/15/7 gün deseni).
- Filo tarafındaki tüm tutarlar **BRÜT (KDV dahil)** eksenindedir ve etikette "(KDV dahil)" yazar (§9b).
- 19 raporun 19'unda da tablo + KPI + grafik birlikte basılır.

**Bulgular:** 19 raporun **15'inde `mobile(r)` yok**; ayrıca ekran `disaAktar` yetkisini hiç okumaz — `export` her rolde açık.

---

### `app-rapor-finans.html` — Satış ve Finans Raporları

**Tip:** rapor (`GV.report`)
**Bölüm:** `SECTIONS.rapor` → "Satış ve Finans" (`raporfinans`)
**Amaç:** Lead kaynağından nakit akışına kadar satış hunisi, temsilci performansı, proje finansı ve tahsilatı 16 raporda okumak.
**Kullanıcılar:** `rapor` bölümü olan 11 rol; rapor merkezinde kategori kilidi **`finans`** eksenine bağlı.
**Veri kaynağı:** `DB.leads` · `DB.quotes` · `DB.pipelineStages` · `DB.customers` · `DB.contracts` · `DB.projects` · `DB.milestones` · `DB.invoices` · `DB.payments` · `DB.employees` (`DB.emp`,`DB.empName`) · `DB.roleName` · `DB.today`
**Üst özet kartları:** rapor başına 4 KPI — **ortak desen**: adet + dönüşüm/başarı oranı (%) + bir para toplamı + bir gecikme/risk sayacı. *Nakit* grubunda ek olarak "bu ay / önümüzdeki 30 gün" projeksiyon kartı.
**Sekmeler:** `reports[]` **16 rapor**, 4 grup:
- *Satış Hunisi* (6) — `leadkaynak` Lead kaynakları · `donusum` Satış dönüşüm oranı · `teklif` Teklif başarı oranı · `kazanilan` Kazanılan satışlar · `kaybedilen` Kaybedilen satışlar · `tahminigelir` Tahmini satış geliri
- *Performans* (2) — `temsilci` Satış temsilcisi performansı · `satissure` Ortalama satış süresi
- *Proje Finansı* (4) — `projebutce` Proje bütçeleri · `projemaliyet` Proje maliyetleri · `musterikar` Müşteri kârlılığı · `hizmetkar` Hizmet kârlılığı
- *Nakit* (4) — `tahsilat` Tahsilatlar · `geciken` Geciken ödemeler · `aylikgelir` Aylık gelir tahmini · `nakit` Nakit akış tahmini
**Arama:** rapor başına `table.search`; ortak alanlar `kod, firma/musteriAd, durum`.
**Filtreler:** ortak **5** — `tarih` (date) · `musteri` (select) · `proje` (select) · `temsilci` (select, "Satış temsilcisi / sorumlu") · `durum` (select).
**Tablo kolonları:** ortak desen: kayıt hücresi (`locked`) · müşteri/temsilci · **net** ve **brüt** tutarları **ayrı kolonlarda** (aynı kolonda karışmaz) · oran kolonu (`GV.progress`) · tarih/vade (`GV.dateCell`) · durum rozeti. Aykırı olanlar: `leadkaynak` ve `donusum` kaynak/aşama kırılımı satırı üretir; `aylikgelir` ve `nakit` ay ekseninde satır üretir (kayıt ekseninde değil); `hizmetkar` satırı hizmet türüdür.
**Form alanları:** —
**Detay sekmeleri:** —
**İşlem butonları:** `pageHead` → "Teklifler" · "Faturalar" · "Tahsilatlar". `GV.report` şeridi standart.
**Toplu işlemler:** yok.
**Bildirimler:** `GV.toast` (rapor kaydet/sil).
**Yetkilendirme:** `can('finans')` → tüm para kolonları ve KPI'ları maskeli; `can('disaAktar')` → `table.export`. 403 sayfa kapısı yok — kilit rapor merkezinde uygulanıyor.
**Boş durum:** `table.emptyState` **17 kez** (16 rapor + 1 ek tablo) + 1 `GV.empty`.
**Hata durumu:** yok.
**Mobil görünüm:** `mobile(r)` **16/16 raporda tanımlı** — kapsamı tam.
**Kabul kriterleri:**
- Tahsilat raporlarında tutar **BRÜT**, proje finansı raporlarında **NET**; etiketlerde eksen yazılı (§9b).
- `canFinans` kapalı rolde ekran açılır ama hiçbir tutar okunmaz; adetler görünmeye devam eder.
- 16 raporun 16'sında mobil kart görünümü aynı veri kaynağından üretilir.

**Bulgular:** Ekranın rapor anahtarları `app-rapor.html` kataloğundakilerle **birebir tutmuyor** (9 anahtar farklı yazılmış) — ayrıntı `app-rapor.html` bulgularında.

---

### `app-rapor-proje.html` — Proje Raporları

**Tip:** rapor (`GV.report`)
**Bölüm:** `SECTIONS.rapor` → "Proje Raporları" (`raporproje`)
**Amaç:** Proje portföyünün sağlık, ilerleme, sapma, planlama, kalite, teslim ve kaynak eksenlerini 12 raporda okumak.
**Kullanıcılar:** `rapor` bölümü olan 11 rol; rapor merkezinde `perm:null`.
**Veri kaynağı:** `DB.projects` · `DB.projectModules` · `DB.milestones` · `DB.sprints` · `DB.tests` · `DB.bugs` · `DB.deliveries` · `DB.changeRequests` · `DB.tasks` · `DB.timelogs` · `DB.capacity` · `DB.invoices` · `DB.customers` · `DB.employees` (`DB.emp`,`DB.empName`) · `DB.today`
**Üst özet kartları:** rapor başına 4 KPI — **ortak desen**: proje adedi + ortalama ilerleme/sağlık dağılımı + bir sapma oranı (% bütçe ya da % süre) + bir risk sayacı. *Sapma* grubunda para kartları `canFinans`'a bağlı.
**Sekmeler:** `reports[]` **12 rapor** (plan 8 diyordu — ölçülen 12), 6 grup:
- *Proje Durumu* (3) — `saglik` Proje sağlığı · `ilerleme` Proje ilerlemesi · `modul` Modül ilerlemesi
- *Sapma* (2) — `butce` Bütçe sapması · `sure` Süre ve termin sapması
- *Planlama* (2) — `milestone` Milestone durumu · `sprint` Sprint hızı (velocity)
- *Kalite* (2) — `test` Test sonuçları · `hata` Hata durumu
- *Teslim ve Değişiklik* (2) — `teslim` Teslim performansı · `degisiklik` Değişiklik talepleri
- *Kaynak* (1) — `kaynak` Kaynak ve iş yükü
**Arama:** rapor başına `table.search`; ortak alanlar `kod, ad, musteriAd, durum`.
**Filtreler:** ortak **5** — `tarih` (date) · `proje` (select) · `musteri` (select) · `pm` (select, proje yöneticisi) · `durum` (select, proje durumu).
**Tablo kolonları:** ortak desen: proje hücresi (`locked`, ad + kod/müşteri) · PM (`GV.user`) · ilerleme (`GV.progress`) · tarih aralığı · sağlık ve durum rozetleri. Aykırı olanlar: `modul` satırı modül, `sprint` satırı sprint (velocity/kapasite kolonlarıyla), `test` ve `hata` satırları koşum/hata kaydı, `milestone` satırı taksit, `kaynak` satırı personel.
**Form alanları:** —
**Detay sekmeleri:** —
**İşlem butonları:** `pageHead` → "Projeler" · "Bütçe ve Maliyet" · "Görevler" · "Faturalar". `GV.report` şeridi standart.
**Toplu işlemler:** yok.
**Bildirimler:** `GV.toast` (rapor kaydet/sil).
**Yetkilendirme:** `can('finans')` → bütçe/maliyet/fatura kolonları maskeli; `GV.perm.scope('gor')` → görünen proje kümesi (`tum` / `proje` / `kendi`). 403 yok.
**Boş durum:** `table.emptyState` **13 kez** (12 rapor + 1 ek tablo).
**Hata durumu:** yok.
**Mobil görünüm:** `mobile(r)` **8 raporda** tanımlı, 4'ünde yok.
**Kabul kriterleri:**
- Bütçe sapması `DB.projects.butce` (NET) ile `gerceklesenMaliyet` (NET) arasında ölçülür; sözleşme bedeliyle karıştırılmaz.
- `scope('gor')` `proje` olan rolde yalnız kendi projelerinin satırı gelir.
- `sprint` raporundaki velocity `DB.sprints` üzerinden okunur, görev sayısından türetilmez.

**Bulgular:** Rapor sayısı **12**'dir; hem `tasks/plan.md` hem `app-rapor.html` kataloğu **8** yazar ve katalogdaki anahtarların çoğu bu ekranda **yoktur** (`genel`, `durum`, `gecikme`, `risk`). Ayrıca 12 raporun 4'ünde `mobile(r)` eksik.

---

### `app-ayar-sirket.html` — Şirket Bilgileri

**Tip:** özel (sekmeli ayar ekranı)
**Bölüm:** `SECTIONS.ayarlar` → "Şirket Bilgileri" (`data-screen="sirket"`)
**Amaç:** Şirket kimliği, çalışma düzeni, tatil takvimi, finansal varsayılanlar ve çoklu şirket tanımını yönetmek.
**Kullanıcılar:** `SCREEN_PERM.sirket` = **sahip · genelmudur · sistem** (menü kalemi de aynı `roles` listesiyle kısıtlı). Bu üç rol dışında shell 403 basar, script hiç çalışmaz.
**Veri kaynağı:** `DB.company` (canonical) · `DB.invoices` (KDV oranı ve vade **ölçülerek** türetilir) · `DB.contracts` (para birimi) · `DB.capacity` + `DB.timesheets` (haftalık kapasite) · `DB.employees` · `DB.departments` · `DB.logs` (yazar) · `DB.today` · `localStorage['gv.sirket']`
**Üst özet kartları:** yok — sekme içi `gv-summary` özetleri (haftalık süre özeti, biçim önizlemesi, tenant özeti).
**Sekmeler:** `GV.tabs` **5** — Kimlik · Çalışma Düzeni · Tatil Günleri (sayaç: tatil adedi) · Finansal Varsayılanlar · Çoklu Şirket (sayaç: tenant adedi).
**Arama:** yok
**Filtreler:** yok
**Tablo kolonları:** Tatil Günleri sekmesinde tatil tablosu (tarih · ad · tür · süre · sil); Çoklu Şirket sekmesinde tenant tablosu (kod · ad/unvan · paket · kullanıcı · durum · aksiyon).
**Form alanları:** **üç ayrı `GV.form`**:
- `#skKimlikForm` — 2 bölüm / 10 alan: *Kimlik bilgileri* (7: Şirket adı★, Ticaret unvanı★, Vergi dairesi★, Vergi numarası★, Ticaret sicil no, MERSİS no, Merkez adresi★) · *İletişim* (3: Telefon★, Kurumsal e-posta★, Web sitesi)
- `#skCalismaForm` — 2 bölüm / 6 alan: *Mesai saatleri* (5: Mesai başlangıcı★, Mesai bitişi★, Öğle arası★, Günlük standart çalışma★, Yıllık izin hakkı★) · *Fazla mesai kuralı* (1: Fazla mesai karşılığı★). Çalışma **günleri** formda değil, `#skGunler` içindeki checkbox grubundadır.
- `#skFinansForm` — 3 bölüm / 6 alan: *Para birimi ve vergi* (3: Varsayılan para birimi★, KDV oranı★, Fatura vade süresi★) · *Ödeme koşulu* (1: metin★) · *Tarih ve sayı biçimi* (2★)
**Detay sekmeleri:** —
**İşlem butonları:** `pageHead` → "Departmanlar" · "Kullanıcılar". Sekme altlarında: Kimlik → Geri al / Kaydet · Çalışma Düzeni → Varsayılana dön / Kaydet · Tatil → "Tatil günü ekle" (`GV.modal`, 4 alan) / satır sil / takvimi sıfırla · Çoklu Şirket → "Yeni şirket ekle" (`GV.modal`, 4 alan) / aktif şirketi değiştir / şirket tanımını sil. `GV.upload` ile logo alanı.
**Toplu işlemler:** yok
**Bildirimler:** `GV.toast` (n alan güncellendi, değişen alan yok, depolama kapalı uyarısı) · `GV.confirm` (çalışma düzenini sıfırla, tatil sil, takvim sıfırla, aktif şirketi değiştir, şirket sil) · `GV.modal` (tatil ekle, şirket ekle) · `GV.notice` (logo veri modelinde yok, ticaret sicil/MERSİS veride yok, haftalık kapasite veriden okunur, yıllık izin veride yok, tatil listesi varsayım, varsayılan yalnız yeni kayıtlara uygulanır, tek şirket tanımlı, salt okunur görünüm).
**Yetkilendirme:** ekran kapısı `SCREEN_PERM` (shell). İçeride `GV.perm.can('duzenle')` → yoksa `SALT_OKUNUR` notu + `kilitle()` ile tüm `input/select/textarea/button` devre dışı bırakılır (sekme butonları hariç). Alan maskeleme yok. Değişiklikler `DB.company`'ye **yalnız canonical alanlarda** işlenir; diğerleri `localStorage`'da kalır ve bu ekranda yazılıdır.
**Boş durum:** `GV.empty` 1 — "Tanımlı tatil günü yok".
**Hata durumu:** `GV.errorState` yok (403 shell'de basılır).
**Mobil görünüm:** `mobile(r)` yok (liste bileşeni kullanılmıyor); tablolar `.gv-tablewrap` içinde.
**Kabul kriterleri:**
- KDV oranı, vade ve para birimi varsayılanları uydurulmaz; `DB.invoices`/`DB.contracts` üzerinde **mod** alınarak hesaplanır ve ipucunda "kayıtlardaki gerçek oran" olarak yazılır.
- `can('duzenle')` kapalı rolde 5 sekmenin tamamı görüntülenir, hiçbir kontrol tıklanamaz.
- Kimlik kaydında yalnız `KIMLIK_CANONICAL` alanları `DB.company`'ye işlenir; ticaret sicil ve MERSİS `DB`'ye yazılmaz.

**Bulgular:** Tatil takvimi (19 gün) ve tenant listesi **hiçbir DB koleksiyonunda yok**; ekran bunu `GV.notice` ile açıkça söylüyor ama veriyi `localStorage`'da tutuyor — dolayısıyla `dbref.js` denetimine girmiyor.

---

### `app-ayar-departman.html` — Departmanlar

**Tip:** liste + organizasyon şeması
**Bölüm:** `SECTIONS.ayarlar` → "Departmanlar" (`departmanlar`)
**Amaç:** Departmanları kadro, bağlı roller, iş yükü ve doluluk ekseninde yönetmek; organizasyon şemasını göstermek.
**Kullanıcılar:** `SCREEN_PERM.departmanlar` = **sahip · genelmudur · sistem · operasyon · ik**.
**Veri kaynağı:** `DB.departments` (kaynak) · `DB.employees` · `DB.tasks` · `DB.capacity` · `DB.roles` · `DB.company` · `DB.logs` (yazar) · `DB.today`
**Üst özet kartları:** 4 KPI — Toplam departman (meta: aktif/pasif) · Kadrolu departman (meta: kadrosuz adedi) · Toplam personel (meta: en kalabalık kadro) · Ortalama doluluk (`F.pct`, meta: %85 üzeri departman sayısı).
**Sekmeler:** `tabs[]` 6 — Tümü · Kadrolu · Kadrosuz · Yüksek Doluluk (≥%85) · Geciken İşi Olan · Pasif.
**Arama:** `fields` = `kod, ad, kisa`; **`search.extra`** = yönetici adı + pozisyonu + bağlı rol adları + kadro adları.
**Filtreler:** 6 — `yonetici` (select, veriden türetilmiş) · `kadro` (select, 4 bant `KADRO_ARALIK`) · `doluluk` (select, 5 bant `DOLULUK_ARALIK`) · `durum` (select) · `rol` (multi, `DB.roles`) · `is` (select: açık işi var / geciken işi var / açık iş yok).
**Tablo kolonları:** 11 — Departman · Yönetici · Kadro (+bağlı personel) · Bağlı roller · Açık görev · Geciken · Doluluk (progress) · **Haftalık kapasite** *(gizli)* · **Kısa ad** *(gizli)* · **Bağlı personel** *(gizli)* · Durum (rozet + switch). `pageSize:15`, görünümler `table`,`card`, `archive:false`.
**Form alanları:** —
**Detay sekmeleri:** —
**İşlem butonları:** `pageHead` → "Şemayı gizle/göster" (toggle) · "Personel Listesi" · "Kullanıcılar". `rowActions[]` 3–4 — Departman detayı (`GV.drawer`, kadro kartları + bağlı personel + açık işler) · Personelini gör · İş yükünü gör · *(yetkiliyse)* Pasife al / Aktifleştir.
**Toplu işlemler:** `canEdit` ise 2 — Pasife al (`tone:'danger'`, kadrosu/açık işi olanı **atlar**) · Aktifleştir. Yetkisizde `bulk:null`.
**Bildirimler:** `GV.confirm` (durum değişimi) · `GV.toast` ("pasife alınamaz — n kadrolu personel ve k açık iş bağlı" `danger`, toplu işlemde "bloke" ve "değişmeyen" sayıları) · `GV.notice` (salt okunur uyarısı, "kadro, iş yükü ve doluluk veriden türetilir" + çelişki sayısı).
**Yetkilendirme:** ekran kapısı `SCREEN_PERM`. İçeride `canEdit = can('duzenle') && GV.perm.matrix().sil === 'tum'` → yalnız sahip/genelmudur/sistem. Yetkisizde satır aksiyonları ve toplu işlemler basılmaz, switch `disabled`. `can('disaAktar')` → `export`.
**Boş durum:** `emptyState` — "Bu görünümde departman yok".
**Hata durumu:** yok.
**Mobil görünüm:** `mobile(r)` var (ad + durum, yönetici/kadro/açık iş/doluluk meta, roller + geciken rozeti + switch + aksiyon butonları); `card(r)` de var.
**Kabul kriterleri:**
- `DB.departments[].personel` sayacı **kullanılmaz**; kadro `DB.employees[].dep`'ten sayılır ve çelişki adedi notice'ta yazılır.
- Kadrosu ya da açık işi olan departman pasife alınamaz — hem satır aksiyonunda hem toplu işlemde engellenir.
- Organizasyon şeması üç kademe basar: yönetici → bağlı departmanlar → kadro.

---

### `app-ayar-kullanici.html` — Kullanıcılar

**Tip:** liste
**Bölüm:** `SECTIONS.ayarlar` → "Kullanıcılar" (`kullanicilar`)
**Amaç:** Aynı `DB.employees` kaydını **sistem erişimi** ekseninden yönetmek: rol, kapsam, oturum durumu, hesap aktifliği.
**Kullanıcılar:** `SCREEN_PERM.kullanicilar` = **sahip · genelmudur · sistem**.
**Veri kaynağı:** `DB.employees` (`DB.emp`) · `DB.roles` · `DB.permMatrix` · `DB.departments` · `DB.logs` (okur ve yazar) · `GV.shell.railOrder` / `.sections` / `.secByRole`
**Üst özet kartları:** 4 KPI — Toplam kullanıcı (meta: tanımlı rol sayısı) · Aktif kullanıcı (meta: log kaydı olan) · **Yönetici yetkili** (`sil==='tum' || log===true`) · Pasif hesap (meta: hiç etkinliği olmayan aktif hesap).
**Sekmeler:** 5 — Aktif · Pasif · Yönetici Yetkili · Sınırlı Erişim (`gor==='kendi'`) · Tümü.
**Arama:** `fields` = `kod, ad, eposta, depAd, pozisyon, rol`.
**Filtreler:** 6 — `rol` (select, `DB.roles`) · `dep` (select) · `kapsam` (select, 5 seviye + `test`) · `durum` (select aktif/pasif) · `yonetici` (select evet/hayır) · `oturum` (select, 6 durum).
**Tablo kolonları:** 11 — Kullanıcı · E-posta · Departman · Sistem rolü (kademe tonlu rozet) · Erişim kapsamı · Yönetici yetkisi · Son etkinlik · Oturum durumu · **Tanımlı rol** *(gizli)* · **Hesap açılışı** *(gizli)* · **Lokasyon** *(gizli)* · Durum (rozet + switch). `pageSize:25`, görünümler `table`,`card`, `archive:false`.
**Form alanları:** —
**Detay sekmeleri:** —
**İşlem butonları:** `pageHead` → "Yetki Matrisi" · "Personel Listesi". `rowActions[]` 2–3 — *(yetkiliyse)* **Rol değiştir** (`GV.modal`, kademe `optgroup`'lu select + canlı 12 satırlık yetki önizlemesi) · **Yetkilerini gör** (`GV.drawer`: kullanıcı özeti + `DB.permMatrix` satırı + eriştiği/erişemediği bölümler) · *(yetkiliyse)* Pasife al / Aktifleştir. Kart ve mobil görünümde `data-uact` butonları olay delegasyonuyla bağlanır.
**Toplu işlemler:** `canEdit` ise 2 — Pasife al (`tone:'danger'`) · Aktifleştir. Kendi hesabı işlemin **dışında** tutulur.
**Bildirimler:** `GV.toast` ("Kendi sistem rolünüzü bu ekrandan değiştiremezsiniz" `danger`, "Kendi hesabınızın erişimini kapatamazsınız" `danger`, "Kendi hesabınız toplu işlemin dışında bırakıldı" `warn`, rol değişimi) · `GV.confirm` (aktif/pasif) · `GV.notice` (salt okunur, "oturum ve etkinlik bilgisi log kayıtlarından türetilir").
**Yetkilendirme:** ekran kapısı `SCREEN_PERM`; içeride `canEdit = can('duzenle') && permMatrix[rol].sil === 'tum'`. **Alan maskeleme yok — İK/KVKK alanları (maaş, TCKN, doğum) bu ekranda hiç gösterilmez** (kapsam kararı). Her değişiklik `DB.logs`'a eski→yeni değerle yazılır.
**Boş durum:** `emptyState` — "Bu görünümde kullanıcı yok".
**Hata durumu:** yok.
**Mobil görünüm:** `mobile(r)` var (avatar + ad/e-posta + durum, rol/kapsam/departman/etkinlik meta, oturum rozeti + switch + aksiyon butonları); `card(r)` de var.
**Kabul kriterleri:**
- Oturum sahibinin kendi rolü ve kendi erişimi bu ekrandan değiştirilemez.
- Rol değiştir modalında seçim değiştikçe yeni rolün 12 yetki satırı ve erişilen bölüm sayısı anlık güncellenir.
- Her rol/durum değişikliği `DB.logs`'a satır düşürür.

**Bulgular:** `DB.logs`'ta "giriş yaptı" tipinde kayıt olmadığı için "Son etkinlik" en son **işlem** tarihidir; ekran bunu kolon adında ve notice'ta açıkça söylüyor. İki adımlı doğrulama veri modelinde yok, gösterilmiyor.

---

### `app-ayar-rol.html` — Roller

**Tip:** liste
**Bölüm:** `SECTIONS.ayarlar` → "Roller" (`roller`)
**Amaç:** "Rol ne yapabiliyor" eksenini göstermek: yetki satırı, gördüğü bölümler, taşıyan kullanıcı sayısı.
**Kullanıcılar:** `SCREEN_PERM.roller` = **sahip · genelmudur · sistem**.
**Veri kaynağı:** `DB.roles` (kaynak, `key:'key'`) · `DB.permMatrix` (yazar) · `DB.employees` · `DB.logs` (yazar) · `GV.shell.railOrder` / `.sections` / `.secByRole` (yazar)
**Üst özet kartları:** 4 KPI — Tanımlı rol (meta: grup + kademe sayısı) · Kullanıcısı olan rol (meta: toplam rol ataması) · **Boşta duran rol** (meta: adları) · **Yönetici yetkili rol** (meta: kaç kullanıcı taşıyor).
**Sekmeler:** `tabs[]` 7 — 6 fonksiyonel grup (Yönetim · Satış · Teslimat · Destek · Operasyon · Dış) + Tümü. Gruplar **veriden türetilir** (kademe + `dash` + gördüğü bölümler), `DB.roles`'ta grup alanı yoktur.
**Arama:** `fields` = `key, ad`; **`search.extra`** = grup adı + kademe adı + panel varyantı + görüntüleme kapsamı + rolü taşıyan kullanıcı adları.
**Filtreler:** 10 — `kademe` (multi) · `grup` (select) · `gor` (select, 5 seviye) · `sil` (select) · `onay` · `finans` · `maas` · `log` · `atama` (kullanıcısı var mı) · `yonetici` (hepsi select + `test`).
**Tablo kolonları:** 14 — Rol · Grup / kademe · Kullanıcı (toplam + birincil) · Erişim kapsamı · Ekle/Düzenle/Sil (üç ikonlu etiket) · Onay yetkisi · Finans yetkisi · Maaş / Log · Gördüğü bölüm (progress) · **Raporlama kapsamı** *(gizli)* · **Personel verisi kapsamı** *(gizli)* · **Dışa aktarma** *(gizli)* · **Panel varyantı** *(gizli)* · **Yönetici yetkisi** *(gizli)*. `pageSize:25`, görünümler `table`,`card`, `archive:false`.
**Form alanları:** —
**Detay sekmeleri:** —
**İşlem butonları:** `pageHead` → "Yetki Matrisi" · "Kullanıcılar". `rowActions[]` 2–3 — **Rol detayı** (`GV.drawer`: 7 satırlık özet + 11 satırlık yetki matrisi + gördüğü/göremediği bölümler + roldeki kullanıcılar) · *(yetkiliyse)* **Rolü kopyala** (`GV.modal`: yeni ad + kademe + kopyalanacak yetkiler önizlemesi) · Kullanıcılarını gör (`app-ayar-kullanici.html?f_rol=`).
**Toplu işlemler:** yok
**Bildirimler:** `GV.toast` (kopyalandı · ad çakışması `danger` · en az 3 karakter `danger` · yetkisiz `danger`) · `GV.modal` (kopyalama) · `GV.notice` (salt okunur, "gruplar veriden türetilir").
**Yetkilendirme:** ekran kapısı `SCREEN_PERM`; içeride `canEdit = can('duzenle') && sil === 'tum'`. `can('disaAktar')` → `export`. Kopyalama `DB.roles`'a kayıt, `DB.permMatrix`'e **derin kopya**, `SEC_BY_ROLE`'a bölüm listesi yazar ve `DB.logs`'a satır düşürür.
**Boş durum:** `emptyState` — "Bu görünümde rol yok".
**Hata durumu:** yok.
**Mobil görünüm:** `mobile(r)` var (rol + grup rozeti, kullanıcı/kapsam/bölüm/kademe meta, onay-finans-maaş-log rozetleri, aksiyon butonları); `card(r)` de var.
**Kabul kriterleri:**
- `key:'key'` kullanılır — `DB.roles` kayıtlarında `kod` alanı yoktur, satır kimliği `key`tir.
- Kullanıcısı olmayan rol satırı `is-passive` ve "Boşta duran rol" KPI'ında sayılır.
- Kopyalanan rol hiçbir kullanıcıya atanmadan doğar; yeni `key` çakışmaya karşı sayı ekiyle benzersizleştirilir.

---

### `app-ayar-yetki.html` — Yetki Matrisi

**Tip:** özel (rol seçimli matris)
**Bölüm:** `SECTIONS.ayarlar` → "Yetki Matrisi" (`yetki`)
**Amaç:** Rol × bölüm × yetki ekseni matrisini düzenlemek, alan maskelemesini ve 403 etkisini önizlemek.
**Kullanıcılar:** `SCREEN_PERM.yetki` = **sahip · genelmudur · sistem**.
**Veri kaynağı:** `DB.permMatrix` (okur ve yazar) · `DB.roles` · `DB.employees` · `DB.customers` · `DB.projects` · `DB.invoices` · `DB.logs` (yazar) · `GV.shell.sections` / `.railOrder` / `.secByRole`
**Üst özet kartları:** 4 KPI (elle basılan `.kpi-grid`) — Açık yetki (`n / total`, bölüm × eksen) · Erişilebilen bölüm (`n / 15`) · Görüntüleme kapsamı · Onaylama yetkisi.
**Sekmeler:** yok — sol tarafta `.gv-rp-nav` içinde **kademeye göre gruplanmış rol listesi** (Yönetim / Orta / Uzman / Dış), seçim `?rol=` ile URL'de tutulur.
**Arama:** yok
**Filtreler:** yok — yerine `SCOPE_AXES` **6 kapsam seçicisi**: Görüntüleme · Ekleme · Düzenleme · Silme · Raporlama · Personel verisi kapsamı (her biri 5 seviyeli select).
**Tablo kolonları:** ana matris **15 bölüm × 19 yetki ekseni** — Görüntüleme · Listeleme · Kayıt detayı · Ekleme · Düzenleme · Silme · Arşivleme · Pasife alma · Onaylama · Reddetme · Görev atama · Dosya yükleme · Dosya indirme · Finansal bilgi · Maaş bilgisi · Personel raporu · Müşteri raporu · Dışa aktarma · Log erişimi. Anlamsız hücreler `—` basar (`ax.secs` kısıtı). Ayrıca **Alan Bazlı Maskeleme** tablosu 5 kolon × **12 hassas alan** (maaş, doğum, acil kişi, ciro, bekleyen tahsilat, vergi no, bütçe, sözleşme tutarı, fatura tutarı, log, personel raporu, müşteri raporu).
**Form alanları:** —
**Detay sekmeleri:** —
**İşlem butonları:** `pageHead` → "Varsayılana dön" (`#btnSifirla`) · "Değişiklikleri kaydet" (`#btnKaydet`); kart altında aynı iki buton (`data-act`).
**Toplu işlemler:** yok
**Bildirimler:** `GV.toast` (her hücre değişiminde "rol · bölüm — eksen açıldı/kapatıldı", kapsam değişiminde eski→yeni) · `GV.confirm` (kaydet, `tone:'danger'` varsayılana dön) · kayıt sonrası `DB.logs`'a satır.
**Yetkilendirme:** ekran kapısı `SCREEN_PERM`; içeride `editable = can('log') || rol ∈ {sahip, sistem}`. Yetkisizde tüm anahtarlar `disabled`, üstte açıklayıcı blok, kaydet/sıfırla butonları `disabled`. **Alan maskeleme burada simüle edilir**: `roleMask(rol, deger, eksen)` ile seçili rolün `finans`/`maas`/`log`/`personel*` eksenleri gerçek değerleri `••••••` yapar.
**Boş durum:** `GV.empty` yok — matris her rolde doludur (bu bir bulgu değil, tasarım gereği).
**Hata durumu:** yok.
**Mobil görünüm:** `mobile(r)` yok; ≤760px'de `.gv-tablewrap.is-sticky1` gizlenir ve **aynı veriden üretilen `.gv-cardlist`** devreye girer (her bölüm bir kart, eksenler etiketli switch olarak).
**Kabul kriterleri:**
- Tablo ve mobil kart listesindeki **ikiz** anahtarlar birbirini eşitler; satır sayacı (`n / total`) her iki görünümde de tazelenir.
- Kapsam değiştirildiğinde türetilen matris hücreleri yeniden hesaplanır (menü gizleme değil, kapsam etkisi).
- "Varsayılana dön" sayfa açılışındaki `SNAP` kopyasını geri yükler.

**Bulgular:** Bu ekran `DB.permMatrix`'i **kalıcı olmayan** biçimde değiştirir (sayfa yenilendiğinde kaybolur) ve alt bilgide bunu yazar; ancak `GV.perm.can()` aynı nesneyi okuduğu için oturum içinde **diğer ekranların davranışını da anında değiştirir** — kayıt "kaydet" denmeden de etkilidir.

---

### `app-ayar-onay.html` — Onay Akışları

**Tip:** özel (akış seçimli kural editörü)
**Bölüm:** `SECTIONS.ayarlar` → "Onay Akışları" (`onayakis`)
**Amaç:** Yedi modülün onay zincirini (makam, koşul, eşik, SLA, vekil) tanımlamak ve canlı etkisini ölçmek.
**Kullanıcılar:** `SCREEN_PERM.onayakis` = **sahip · genelmudur · sistem · operasyon**.
**Veri kaynağı:** `DB.purchases` · `DB.purchaseApprovals` · `DB.leaves` · `DB.leaveTypes` · `DB.timesheets` · `DB.timelogs` · `DB.quotes` · `DB.changeRequests` · `DB.tasks` · `DB.taskTypes` · `DB.contracts` · `DB.projects` · `DB.employees` (`DB.emp`,`DB.empName`) · `DB.departments` (`DB.dep`) · `DB.roles` · `DB.permMatrix` · `DB.roleName` · `DB.logs` (yazar) · `DB.today` · `localStorage['gv.onayakis']`
**Üst özet kartları:** akış başına 3 KPI — Zincirin en uzun hâli (bekleyen kayıtlarda en fazla n adım) · Bu akışta onay bekleyen kayıt (kaynak koleksiyon adıyla) · SLA süresi aşılmış kayıt (ortalama adım SLA'sıyla).
**Sekmeler:** sol `.gv-rp-nav` — **7 akış**, 4 grup:
- *Mali onaylar* — `satinalma` Satın Alma Talebi (6 makam) · `sozlesme` Sözleşme Onayı
- *İnsan kaynakları* — `izin` İzin Talebi (3 makam) · `timesheet` Zaman Kaydı (Timesheet)
- *Satış* — `teklif` Teklif İç Onayı
- *Teslimat* — `degisiklik` Değişiklik Talebi · `gorevkontrol` Görev Kontrolü
**Arama:** yok
**Filtreler:** yok — koşul tipleri `KOSUL` sözlüğünde: `hep` · `tutar` · `projetutar` · `sure` · `proje` · `kategori`.
**Tablo kolonları:** adım tablosu — sıra · makam (rol) · koşul + eşik · SLA (gün) · atlanabilir mi · vekil kuralı · aksiyonlar (düzenle/sil); bekleyen kayıt tablosu — kayıt · başlık · talep eden · tarih · tutar/süre · bulunduğu adım · SLA durumu.
**Form alanları:** `GV.form` kullanılmaz — adım ekleme/düzenleme `GV.modal` içinde elle kurulan alanlarla yapılır (rol seçimi, koşul tipi, eşik, SLA, atlanabilirlik, vekil metni).
**Detay sekmeleri:** —
**İşlem butonları:** `pageHead` → "Onay Kuyruğu" · "Yetki Matrisi" · *(yetkiliyse)* **"Adım ekle"**. Akış içinde: adım sil (`GV.confirm`, `tone:'danger'`), varsayılana dön (`GV.confirm`), adım ekle (`GV.modal size:'lg'`).
**Toplu işlemler:** yok
**Bildirimler:** `GV.notice` — salt okunur uyarısı, "adımda kişi değil makam tutulur", "satın alma eşikleri mevcut veriyle uyuşmuyor" (`warn`), "kayıttaki adım sayacı zinciriyle tutmuyor" (`warn`). `GV.toast` + `DB.logs` her değişiklikte. `GV.chain` ile zincir görselleştirmesi.
**Yetkilendirme:** ekran kapısı `SCREEN_PERM`; içeride `canEdit = can('duzenle') && permMatrix[rol].sil === 'tum'` → yalnız sahip/genelmudur/sistem düzenler, operasyon salt okunur görür. Ayrıca her makam için **`onaylayabilir(rol)`** kontrolü: yetki matrisinde `onay` kapalıysa ya da o rolü taşıyan kullanıcı yoksa adım "sorunlu" işaretlenir.
**Boş durum:** `GV.empty` 2 — "Bu akışta hiç onay adımı yok" · "Bu akışta bekleyen kayıt yok".
**Hata durumu:** yok.
**Mobil görünüm:** `mobile(r)` yok; adım ve bekleyen kayıt tabloları `.gv-tablewrap` içinde.
**Kabul kriterleri:**
- Adımda **rol** tutulur; kişi çalışma anında çözülür (departman yöneticisi `employees[].yonetici`'den, proje yöneticisi `projects[].pm`'den).
- Canlı etki önizlemesi tahmin değil: gerçek bekleyen kayıtlar adımlardan geçirilerek hesaplanır.
- Eşikler değiştirildiğinde veriyle uyum farkı anında `warn` notice olarak görünür.

**Bulgular:** Akış tanımı (`AKIS`) **hiçbir DB koleksiyonunda tutulmuyor**; aynı satın alma eşik tablosu `app-satinalma-form.html` içinde **ikinci kez** yazılı. İki dosya `localStorage['gv.onayakis']` üzerinden senkron kalmaya çalışıyor; anahtar silinirse iki dosya farklı varsayılanlara düşebilir.

---

### `app-ayar-bildirim.html` — Bildirim Tercihleri

**Tip:** özel (tip × kanal matrisi)
**Bölüm:** `SECTIONS.ayarlar` → "Bildirim Tercihleri" (`bildirimtercih`)
**Amaç:** 31 bildirim tipinin 7 kanal üzerinden hangisinin açık olacağını, sessiz saatleri ve özet sıklığını yönetmek.
**Kullanıcılar:** `SCREEN_PERM`'de **yok** → `ayarlar` bölümü olan **tüm 27 rol** (herkes kendi tercihini yönetir).
**Veri kaynağı:** `DB.notificationChannels` (kanal listesi) · `DB.integrations` (WhatsApp/Slack/Teams bağlılığı) · `DB.notifications` (son 7 gün önizlemesi) · `DB.logs` · `DB.roleName` · `DB.today` · `localStorage['gv.notifpref']`
**Üst özet kartları:** 4 KPI — Son 7 günde oluşan olay (`DB.today` eksenli) · Bu ayarlarla size ulaşacak bildirim · Sessiz saate denk gelip ertelenen · Açık tip × kanal hücresi (`n / total`).
**Sekmeler:** `tabs[]` yok — **8 grup** başlığı altında matris satırları: Satış (6 tip) · Projeler (3) · Görevler (6) · İnsan Kaynakları (2) · Satın Alma (4) · Araç ve Filo (7) · Finans (2) · Destek (1). Toplam **31 tip**.
**Arama:** yok
**Filtreler:** yok
**Tablo kolonları:** matris — **Bildirim tipi** + **7 kanal** (Sistem içi · E-posta · Mobil bildirim · SMS · WhatsApp · Slack · Microsoft Teams) + satır aksiyonu (`COLS = 9`). Her satırda ayrıca "kritik" işareti (sessiz saati delen tipler).
**Form alanları:** `GV.form` kullanılmaz; ayarlar elle kurulan kontrollerdir: sessiz saat (açık/kapalı switch + başlangıç/bitiş saati + hafta sonu switch'i), özet sıklığı (Anlık / Günlük özet / Haftalık özet), özet saati, haftalık özet günü.
**Detay sekmeleri:** —
**İşlem butonları:** `pageHead` → "Bildirim Merkezi" · "Varsayılana dön" (`#btnSifirla`) · "Tercihleri kaydet" (`#btnKaydet`).
**Toplu işlemler:** yok (grup ve kolon başlığından toplu aç/kapat kontrolleri var).
**Bildirimler:** `GV.confirm` (kaydet · `tone:'danger'` varsayılana dön) · `GV.toast` sonuç. Ayrıca **canlı önizleme** bloğu: son 7 günün gerçek `DB.notifications` kayıtları bu ayarlardan geçirilerek kanal başına gönderim / ertelenen / ulaşan sayısı hesaplanır.
**Yetkilendirme:** ekran kapısı yok (herkes girer). `GV.perm.can('duzenle')` yalnız "başkasının tercihini yönetme" ekseni için okunur. Bağlantısı kopuk kanal (`DB.integrations` durumu ≠ "Bağlı") için hücreler kapalı sayılır ve kayıtlı tercih bile uygulanmaz.
**Boş durum:** `GV.empty` **tanımlı değil** — *bulgudur* (bkz. aşağı).
**Hata durumu:** yok.
**Mobil görünüm:** `mobile(r)` yok; matris `.gv-tablewrap` içinde.
**Kabul kriterleri:**
- 31 tipin 31'i `DB.notifications.tur` değerleriyle eşlenebilmeli; eşlenmeyen tür önizlemede ayrıca raporlanır (`res.eslenmeyen`).
- Sessiz saat gece yarısını aşan aralıkta (19:00→08:30) doğru çalışmalı.
- "Kritik" işaretli tip sessiz saatte de anlık iletilmeli.
**Bulgular:** Ekranda `GV.empty` ve `GV.errorState` hiç yok; ayrıca ≤760px'de matris `.gv-tablewrap` gizlendiği için **mobilde tip × kanal tablosu görünmez** ve karşılığı olan `.gv-cardlist` üretilmemiş (`app-ayar-yetki.html` bunu yapıyor, bu ekran yapmıyor). 31 tipin yalnız 12'sinin `tur` eşlemesi dolu — kalan 19 tip önizlemede hiç sayılmıyor.

---

### `app-ayar-otomasyon.html` — Otomasyon Kuralları

**Tip:** liste
**Bölüm:** `SECTIONS.ayarlar` → "Otomasyonlar" (`otomasyon`)
**Amaç:** 22 otomasyon kuralını kategori, tetikleyici türü ve hedef kanal ekseninde yönetmek; kuru çalıştırmayla etkisini ölçmek.
**Kullanıcılar:** `SCREEN_PERM.otomasyon` = **sahip · genelmudur · sistem · operasyon**.
**Veri kaynağı:** `DB.automations` (kaynak) · `DB.notificationChannels` · kuru çalıştırma hedefleri: `DB.tasks` · `DB.taskDeps` · `DB.capacity` · `DB.decisions` · `DB.tickets` · `DB.quotes` · `DB.leads` · `DB.maintenance` · `DB.inspections` · `DB.policies` · `DB.invoices` · `DB.timesheets` · `DB.assets` · `DB.assignments` · `DB.today`
**Üst özet kartları:** 4 KPI — Tanımlı kural · Aktif kural · Pasif kural · **Aktif kuralların eşlediği kayıt** (kuru çalıştırma toplamı).
**Sekmeler:** 9 — Tümü · Görev · Satış · Finans · Destek · Filo · İK · Varlık · Yönetim. Kategori **kural kodundan** türetilir (`KAT` haritası), `DB.automations`'ta kategori alanı yoktur.
**Arama:** `fields` = `kod, ad, tetikleyici, islem, kullanici, kanal, fayda`.
**Filtreler:** 5 — `kategori` (multi + `test`) · `tur` (select: Olay tabanlı / Zaman eşikli / Oran eşikli / Zamanlanmış) · `kanal` (multi, `DB.notificationChannels`) · `durum` (select Aktif/Pasif) · `kullanici` (select, hedef rol listesi veriden türetilmiş).
**Tablo kolonları:** 11 — Kural · Tetikleyici (+tür) · Koşul · İşlem · Bildirim kanalları · Hedef · Kategori · Son çalışma · **Beklenen fayda** *(gizli)* · Durum · **Aç / Kapat** (switch, `exportable:false`). `pageSize:10`, `archive:false`.
**Form alanları:** —
**Detay sekmeleri:** —
**İşlem butonları:** `pageHead` → "Bildirim Tercihleri" · **"Tümünü Dene"** (`GV.modal size:'lg'` — aktif kuralların bugünkü veriyle eşlediği kayıt sayıları). `rowActions[]` 3 — **Kural detayı** (`GV.drawer`: 4 adımlı `GV.chain` zinciri + 9 satırlık döküm + kuru çalıştırma hedefi) · Kuralı aç/kapat (`canEdit` kapısı + `GV.confirm`) · **Şimdi çalıştır (deneme)** (`GV.confirm` → eşleşen kayıt sayısı toast'u).
**Toplu işlemler:** `canEdit` ise 2 — Seçilenleri aç · Seçilenleri kapat (`tone:'danger'`). Yetkisizde `bulk:null`.
**Bildirimler:** `GV.toast` (kural açıldı/kapatıldı, kuru çalıştırma sonucu, yetkisiz `danger`) · `GV.confirm` · `GV.modal` · `GV.drawer`.
**Yetkilendirme:** ekran kapısı `SCREEN_PERM`; içeride `canEdit = can('duzenle')` → switch'ler `disabled`, toplu işlemler yok, üstte "Salt okunur görünüm" bloğu. Kuru çalıştırma **yetkisiz rolde de** açık (veri değiştirmez).
**Boş durum:** `emptyState` — "Bu görünümde otomasyon kuralı yok".
**Hata durumu:** yok.
**Mobil görünüm:** `mobile(r)` var (kural adı + switch, kod/kategori/tür, tetikleyici, durum + kanal etiketleri).
**Kabul kriterleri:**
- Kategori, tetikleyici türü, koşul ve son çalışma alanları veride **yoktur**; kuralın kendi metninden türetilir ve bu ekranda yazılıdır.
- Kuru çalıştırma hiçbir kaydı değiştirmez, yalnız eşleşen kayıt sayısını gösterir; sayılamayan kuralda gerekçe metni basılır.
- 22 kuralın 20'sinde sayım hedefi tanımlı; `OTO-010`, `OTO-019`, `OTO-020` için "sayılamıyor" gerekçesi yazılır.

---

### `app-ayar-entegrasyon.html` — Entegrasyonlar

**Tip:** liste
**Bölüm:** `SECTIONS.ayarlar` → "Entegrasyonlar" (`entegrasyon`)
**Amaç:** Dış sistem bağlantılarını, veri yönünü, senkron sıklığını ve API anahtarı durumunu yönetmek.
**Kullanıcılar:** `SCREEN_PERM.entegrasyon` = **sahip · genelmudur · sistem · devops**.
**Veri kaynağı:** `DB.integrations` (kaynak; sağlayıcı, veri yönü, modüller, sorumlu, sıklık, uç nokta, anahtar durumu ve son senkron **sayfa açılışında türetilip kaydın üzerine yazılır**) · `DB.employees` (`DB.emp`) · `DB.today`
**Üst özet kartları:** 4 KPI — Tanımlı entegrasyon · Bağlı · Bağlı değil · Planlandı.
**Sekmeler:** 8 — Tümü · Muhasebe · Kaynak Kod · İletişim · Doküman / E-imza · Takvim · Yapay Zekâ · Bağlı Olanlar.
**Arama:** `fields` = `kod, ad, saglayici, kategori, durum, aciklama, veriYonu, moduller`.
**Filtreler:** 6 — `kategori` (multi, veriden) · `durum` (multi: Bağlı/Bağlı değil/Planlandı) · `veriYonu` (select: Gelen/Giden/Çift yönlü) · `moduller` (multi, veriden) · `sorumlu` (select) · `senkronSikligi` (select, 6 değer).
**Tablo kolonları:** 11 — Entegrasyon (ad + sağlayıcı + kod) · Kategori · Bağlantı durumu · Kullanan modüller · Veri yönü · Son senkron · **Senkron sıklığı** *(gizli)* · Teknik sorumlu · **API anahtarı** (her zaman `••••••••`, `exportable:false`) · **Açıklama** *(gizli)* · Aktif / Pasif (switch). `pageSize:10`, `archive:false`.
**Form alanları:** `GV.form` kullanılmaz — ayar drawer'ında elle kurulan 5 alan: Uç nokta (URL, `https://` zorunlu) · API anahtarı (`type="password"` + göster/gizle) · Veri yönü · Senkron sıklığı · Hata bildirimi alacak kişi.
**Detay sekmeleri:** —
**İşlem butonları:** `pageHead` → "Bildirim Tercihleri" · "Otomasyon Kuralları". `rowActions[]` 1–3 — *(yetkiliyse)* **Bağlantıyı test et** · **Ayarları düzenle / görüntüle** (`GV.drawer`) · *(yetkiliyse)* **Bağlantıyı kes** (`cls:'is-danger'`, uç nokta + anahtar silinir, sıklık "Manuel" olur).
**Toplu işlemler:** `canEdit` ise 2 — Seçilenleri test et (bağlı+aktif olmayanları atlar) · Seçilenleri pasife al (`tone:'danger'`).
**Bildirimler:** `GV.notice` (API anahtarları arayüzde açık gösterilmez `warn`; salt okunur uyarısı) · `GV.confirm` (test, bağlantıyı kes) · `GV.toast` (senkron zamanı güncellendi, bağlantı kesildi, uç nokta https olmalı `danger`, yetkisiz `danger`).
**Yetkilendirme:** ekran kapısı `SCREEN_PERM`; içeride `canEdit = can('log') || rol ∈ {sahip, sistem}` → **devops rolü ekranı görür ama düzenleyemez**. `can('disaAktar')` → `export`. **API anahtarının kendisi hiçbir zaman tutulmaz** — yalnız "tanımlı mı" bilgisi (`apiAnahtar` boolean) saklanır ve kolon `exportable:false`.
**Boş durum:** `emptyState` — "Bu görünümde entegrasyon yok".
**Hata durumu:** yok.
**Mobil görünüm:** `mobile(r)` var (ad + switch, kod/sağlayıcı/kategori, veri yönü/son senkron/anahtar durumu, durum + modül etiketleri).
**Kabul kriterleri:**
- API anahtarı listede, drawer'da ve çıktıda **hiçbir koşulda** açık gösterilmez.
- Uç nokta ve anahtar birlikte tanımlıysa kayıt otomatik "Bağlı" olur; biri silinirse "Bağlı değil"e döner.
- `devops` rolünde tüm aksiyonlar basılmaz, switch'ler `disabled`.

**Bulgular:** Sağlayıcı, veri yönü, kullanan modüller, sorumlu, sıklık, uç nokta ve son senkron alanları `DB.integrations`'ta **yok**; ekran bunları `META` tablosundan türetip **kaydın üzerine yazıyor**. Bu, aynı koleksiyonu okuyan başka bir ekranın (ör. `app-ayar-bildirim.html`) bu türetilmiş alanları görmesine yol açar — türetme veriyi kalıcı kirletiyor.

---

### `app-ayar-log.html` — Log Kayıtları

**Tip:** liste
**Bölüm:** `SECTIONS.ayarlar` → "Log Kayıtları" (`log`)
**Amaç:** Kim · ne zaman · hangi kayıtta · hangi alanı · hangi değerden hangi değere değiştirdi bilgisini salt okunur göstermek.
**Kullanıcılar:** `SCREEN_PERM.log` = **sahip · genelmudur · sistem · operasyon · devops**; ayrıca ekran içinde `GV.perm.can('log')` kapısı vardır.
**Veri kaynağı:** `DB.logs` (kaynak) · `DB.employees` (`DB.emp`) · `DB.roleName` · `DB.today`
**Üst özet kartları:** 4 KPI — Toplam log kaydı (meta: en eski kayıt) · Bugünkü işlem · **En çok işlem yapan kullanıcı** (tepe değeri paylaşan birden çok kullanıcı varsa "Eşit dağılım" yazar) · Hassas alan erişimi.
**Sekmeler:** 7 — Tümü · Ekleme · Düzenleme · Silme · Onay · Giriş / Çıkış · Hassas erişim. İşlem türü `islem` metnindeki fiilden türetilir (`DB.logs`'ta tür alanı yok).
**Arama:** `fields` = `kod, islem, kayit, modul, ip, eski, yeni`.
**Filtreler:** 6 — `kisi` (select, aktif personel) · `tur` (multi + `test`) · `modul` (multi, veriden) · `tarih` (daterange) · `kayit` (text, kod içerir) · `ip` (text, içerir).
**Tablo kolonları:** 10 — Zaman damgası · Kullanıcı (+rol) · İşlem türü (tonlu rozet) · İşlem · Modül · Etkilenen kayıt (yayındaysa bağlantılı) · Alan · Eski → Yeni değer · **IP adresi** *(gizli)* · **Oturum / cihaz** *(gizli)*. `pageSize:25`, `archive:false`.
**Form alanları:** —
**Detay sekmeleri:** —
**İşlem butonları:** `pageHead` → "Yetki Matrisi" · "Otomasyon Kuralları". `rowActions[]` 1 — **Kaydın tam detayı** (`GV.drawer`: 13 satırlık döküm + `GV.activity` ile değer karşılaştırması + aynı kullanıcının son 5 hareketi + "Etkilenen kaydı aç" aksiyonu, yalnız `GV.isBuilt(href)` ise).
**Toplu işlemler:** **yok** — bilinçli: log satırı düzenlenemez, silinemez, arşivlenemez.
**Bildirimler:** `GV.notice` 2 — yetkisizde "Log kayıtlarına erişim yetkiniz yok" (`warn`, iki aksiyonlu) ve her zaman "Log kayıtları değiştirilemez" (`neutral`, append-only açıklaması).
**Yetkilendirme:** **Yetki kapısı**: `can('log')` yoksa liste **hiç kurulmaz**, veri kaynağına dokunulmaz; `GV.empty` ile "Liste yüklenmedi" basılır ve `return` edilir. `can('maas')` → "Hassas erişim" satırlarının eski/yeni değeri `••••••` maskelenir (drawer'da da). `can('disaAktar')` → `export`.
**Boş durum:** `GV.empty` 1 (yetkisiz durumu) + `emptyState` (filtre boşsa).
**Hata durumu:** yok.
**Mobil görünüm:** `mobile(r)` var (zaman + tür rozeti, kod/modül/kayıt, kullanıcı/alan, değer karşılaştırması).
**Kabul kriterleri:**
- `can('log')` kapalı rolde **hiçbir log verisi ekrana gelmez** (filtre, sayfalama, çıktı dahil).
- Hassas erişim satırında `can('maas')` yoksa değer kolonu ve drawer karşılaştırması maskelenir.
- Ekranda düzenleme/silme aksiyonu bulunmaz.

**Bulgular:** İşlem türü, etkilenen alan ve oturum kaynağı `DB.logs`'ta **yok**; kayıt metninden ve IP bloğundan türetiliyor. Cihaz/oturum kimliği hiç yok ve bu ekranda "Prototip veri setinde tutulmuyor" olarak yazılı.

---

### `app-ayar-arsiv.html` — Arşiv

**Tip:** liste (türetilmiş kaynak)
**Bölüm:** `SECTIONS.ayarlar` → "Arşiv" (`arsiv`)
**Amaç:** Modüllerde arşivlenen ya da pasife alınan kayıtları tek listede toplamak, geri almak ve kalıcı silmek.
**Kullanıcılar:** `SCREEN_PERM.arsiv` = **sahip · genelmudur · sistem · operasyon**.
**Veri kaynağı:** **ayrı bir arşiv koleksiyonu yok** — 9 kaynak koleksiyondan türetilir: `DB.customers` · `DB.contacts` · `DB.referrers` · `DB.quotes` · `DB.commissions` · `DB.projects` · `DB.tasks` · `DB.assets` · `DB.departments`; ayrıca `DB.employees` (`DB.emp`), `DB.dep`, `DB.logs` (yazar), `DB.today`.
**Üst özet kartları:** 4 KPI — Toplam arşivlenen kayıt (meta: modül sayısı + arşivli/pasif kırılımı) · Bu yıl arşivlenen (meta: bu ay) · **Geri alınabilir kayıt** (saklama 365 gün) · **Kalıcı silme bekleyen** (meta: en eskisi n gündür arşivde).
**Sekmeler:** dinamik — "Tümü" + veride bulunan modüller (`Müşteri · Satış · Proje · Görev · Varlık · Ayarlar` sırasıyla).
**Arama:** `fields` = `kod, baslik, modul, tur, bilgi, arsivDurum`; **`search.extra`** = arşivleyen adı + kaynak koleksiyon adı + geri alınabilirlik metni.
**Filtreler:** 6 — `modul` (multi) · `tur` (multi) · `arsivTarihi` (daterange) · `arsivleyen` (select) · `geri` (select: Geri alınabilir / Saklama süresi doldu) · `arsivDurum` (select: `arsiv:true` / `aktif:false`).
**Tablo kolonları:** 9 — Kayıt (kod + başlık) · Modül · Kayıt türü · Arşivlenme tarihi (+ n gün önce) · Arşivleyen (+ "kaydın sorumlusu" alt satırı) · Durum · Geri alınabilir mi (+ kalan gün) · **Kayıt özeti** *(gizli)* · **Kaynak koleksiyon** *(gizli)*. `key:'id'` (koleksiyon+kod), `pageSize:25`, `archive:false` (ekranın tamamı zaten arşiv eksenidir).
**Form alanları:** —
**Detay sekmeleri:** —
**İşlem butonları:** `rowActions[]` 1–3 — *(yetkiliyse)* **Arşivden geri al** (`GV.confirm` + değişecek alanların eski→yeni tablosu) · **Kaydı görüntüle** (`GV.drawer`: arşiv bilgileri 9 satır + kaynak kaydın **tüm alanları** `LBL` sözlüğüyle) · *(yetkiliyse)* **Kalıcı sil** (`cls:'is-danger'`). `pageHead` → "Log Kayıtları" · "Departmanlar".
**Toplu işlemler:** `canEdit` ise 1 — Arşivden geri al (`confirm` metniyle, alan sayısını raporlar).
**Bildirimler:** `GV.notice` 2 üst uyarı (kalıcı silme geri alınamaz `warn`; arşiv listesi türetilmiş görünümdür `neutral`) · `GV.confirm` (geri alma; kalıcı silme 1. onay) · **`GV.modal` ikinci onay** — kullanıcı kayıt kodunu **birebir yazmadan** silinmez · `GV.toast` sonuçlar · her işlem `DB.logs`'a satır.
**Yetkilendirme:** ekran kapısı `SCREEN_PERM`. İçeride `canEdit = can('duzenle')` (geri alma) · `canDel = can('sil') && rol ∈ {sahip, sistem}` (kalıcı silme; yoksa aksiyon **hiç basılmaz** ve üst uyarıda gerekçe yazılır) · `canExp = can('disaAktar')`.
**Boş durum:** `emptyState` — "Bu görünümde arşiv kaydı yok".
**Hata durumu:** yok.
**Mobil görünüm:** `mobile(r)` var (başlık + durum, kod/modül/tür, tarih + arşivleyen, özet + geri alınabilirlik rozeti).
**Kabul kriterleri:**
- Kalıcı silme iki aşamalıdır ve ikinci aşamada kayıt kodu yazılmadan buton iş yapmaz.
- Geri alma yalnız gerçekten var olan işaretleri değiştirir (`arsiv`, `aktif`, `durum`) ve her alan için ayrı log satırı yazar.
- Arşivlenme tarihi ve arşivleyen kullanıcı **veride yok**; hangi alandan türetildiği her satırın detayında yazılıdır.

**Bulgular:** `bagliKayitSayisi()` tüm `DB` koleksiyonlarını tarayarak referans sayar — kalıcı silmede bu sayı gösteriliyor ama **bağlı kayıtlar silinmiyor**; ekran bunu açıkça yazıyor (ilişkisel bütünlük sunucu tarafında).

---

### `app-ayar-profil.html` — Profilim

**Tip:** özel (sekmeli kendi kaydı ekranı)
**Bölüm:** `SECTIONS.ayarlar` → "Profilim" (`profil`)
**Amaç:** Kullanıcının kendi iletişim bilgilerini, güvenlik ayarlarını, oturum geçmişini, tercihlerini ve yetkilerini yönetmek.
**Kullanıcılar:** `SCREEN_PERM`'de **yok** → `ayarlar` bölümü olan **tüm 27 rol**; yetki kapısı bilinçli olarak yoktur (herkes kendi profilini görür).
**Veri kaynağı:** `DB.employees` (`DB.emp`, **yazar**) · `DB.permMatrix` · `DB.roleName` · `DB.logs` (okur ve yazar) · `DB.today` · `GV.session` · `GV.shell.railOrder` / `.sections` · `localStorage['gv.profil']`
**Üst özet kartları:** yok — sekme içi `gv-summary` blokları.
**Sekmeler:** `GV.tabs('#pfTabs')` **5** — Genel Bilgiler · Güvenlik · Oturumlar ve Cihazlar (sayaç: kendi log kaydı adedi) · Tercihler · Yetkilerim.
**Arama:** yok
**Filtreler:** yok
**Tablo kolonları:** Oturumlar sekmesinde log tablosu 5 kolon — Tarih · İşlem (+eski→yeni) · Kayıt · Modül · Kaynak IP.
**Form alanları:** **üç ayrı `GV.form`**:
- `#pfForm` — *İletişim bilgilerim* (3 alan): Ad soyad★ (ad+soyad birlikte `validate`), Kurumsal e-posta★, Telefon★
- `#pfSifre` — *Şifre değiştir* (3 alan): Mevcut şifre★, Yeni şifre★ (≥8 karakter), Yeni şifre tekrar★ (eşitlik `validate`); alanlar sonradan `type="password"`e çevrilir
- `#pfTercihForm` — *Görünüm ve bölge* (6 alan): Arayüz dili, Tema, Tarih biçimi, Saat dilimi, **Varsayılan açılış ekranı** (yalnız rolün eriştiği ve yayında olan ekranlar), Sayfa başına kayıt
  Ayrıca `GV.upload` ile profil fotoğrafı alanı ve İki adımlı doğrulama switch'i.
**Detay sekmeleri:**
- **Genel Bilgiler** — fotoğraf alanı + iletişim formu + **Kurum bilgileri** (10 satır, salt okunur: kod, departman, pozisyon, oturum rolü, tanımlı roller, işe giriş, yönetici, çalışma türü, sözleşme türü, lokasyon).
- **Güvenlik** — şifre formu + iki adımlı doğrulama + "son şifre değişikliği veride yok" notu.
- **Oturumlar ve Cihazlar** — "Bu oturum" özeti (6 satır, `GV.session`'dan) + kendi log tablosu + "Diğer oturumları kapat".
- **Tercihler** — tercih formu + saklama yeri notu + bildirim tercihleri bağlantısı.
- **Yetkilerim** — `DB.permMatrix[rol]` satırı (9) + **hassas alanlar** (`GV.perm.mask('Görünür', eksen)` ile 4 satır) + eriştiği/erişemediği bölümler.
**İşlem butonları:** `pageHead` → "Bildirim Tercihleri" · "Zaman Kayıtlarım". Sekme altlarında: Genel → Geri al / Bilgilerimi kaydet · Güvenlik → Şifreyi değiştir · Oturum → *(log yetkisi varsa)* Log kayıtları / Diğer oturumları kapat · Tercihler → Açılış ekranını aç / Varsayılana dön / Tercihleri kaydet · Yetkilerim → *(log yetkisi varsa)* Yetki matrisinde aç.
**Toplu işlemler:** yok
**Bildirimler:** `GV.toast` (n alan güncellendi + log kaydı, değişen alan yok, şifre doğrulaması başarılı ama kaydedilmedi `warn`, iki adımlı doğrulama açıldı/kapatıldı, tercihler kaydedildi/kaydedilemedi `danger`, oturumlar kapatıldı) · `GV.confirm` (diğer oturumları kapat `danger`, tercihleri sıfırla `warn`) · `GV.notice` (fotoğraf veri modelinde yok, şifre saklanmaz, cihaz/oturum koleksiyonu yok `warn`, rol/departman buradan değiştirilemez `warn`, tercihler tarayıcıda saklanır, bildirim tercihleri ayrı ekranda, yetkiler salt okunur).
**Yetkilendirme:** ekran kapısı yok. İçeride `GV.perm.can('log')` → "Log kayıtları" ve "Yetki matrisinde aç" bağlantıları basılır/basılmaz. `GV.perm.mask(...)` ile hassas alan eksenleri kendi rolünde gösterilir. Rol, departman ve pozisyon **bu formdan değiştirilemez** ve gerekçesi ekranda yazılıdır.
**Boş durum:** `GV.empty` 2 — profil kaydı bulunamadı (oturum kodu personel kaydıyla eşleşmiyor) · "Bu hesapta sistem etkinliği yok".
**Hata durumu:** yok.
**Mobil görünüm:** `mobile(r)` yok; log tablosu `.gv-tablewrap.is-mobilescroll`, formlar `cols` ile daralır.
**Kabul kriterleri:**
- Ad soyad kaydedildiğinde baş harfler (`ini`) yeniden üretilir ve `GV.shell.setSession()` ile üst bardaki persona çipi tazelenir.
- "Varsayılan açılış ekranı" listesinde yalnız `GV.perm.sec(k)` açık ve `GV.isBuilt(href)` doğru olan ekranlar bulunur.
- Şifre değişikliği hiçbir yere yazılmaz ama `DB.logs`'a "Şifre değiştirme talebi" satırı düşer.

**Bulgular:** Profil formu `GV.form`'a `id` **vermiyor** (aynı sayfada üç form var); `beforeunload` anahtarı `cfg.id`'den geldiği için üç formun kaydedilmemiş-değişiklik uyarısı aynı anahtarı paylaşıyor olabilir — `components.md` §4 "aynı sayfada iki form varsa `id` şart" kuralına aykırı.
