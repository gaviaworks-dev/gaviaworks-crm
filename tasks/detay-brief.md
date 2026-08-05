# Detay Ekranı Sözleşmesi — subagent brief

> Bu dosya her detay ekranı ajanının **ilk okuduğu** şeydir. Ekrana özel kapsam
> ajanın prompt'unda verilir; buradaki kurallar **istisnasız** geçerlidir.

## 0. Önce oku
1. **`app-sozlesme-detay.html`** — en güncel kalıp. `dl()` yardımcısı, para ekseni
   işleyişi, doğrulama `GV.notice` deseni ve boş durum kullanımı burada doğru hâliyle.
2. `app-teklif-detay.html` — iskelet + `GV.pageHead` kalıbı.
3. `tasks/components.md` — §3 detay ekranı · §5 badge · §6 bileşenler · §9 veri
   sözleşmeleri · §9b para konvansiyonu · §9c tedarikçi puan eksenleri.

## 1. İskelet
`<body>` içine **yalnız** `<div id="rec"></div>` koy.
`.gv-app` / rail / menü / divider / overlay / top / main markup'ını **ELLE YAZMA** —
`shell.js` `buildSkeleton()` kurar. Elle `.gv-app` yazarsan `GV.pageHead` sessizce
hiçbir şey yapmaz ve UID-01'in `aria-controls`'unu düşürürsün.

## 2. Etiket escape (ders L-14)
Yerel `dl(pairs)` yardımcında **`dt` escape EDİLMEZ** — etiketler sayfada yazılı
sabittir ve eksen işareti `<span class="u-faint">(KDV hariç)</span>` render edilmeli.
**`dd` escape'li kalır** (veri oradan gelir).

## 3. Mutasyon (ders L-15) — EN SIK YAPILAN HATA
Mock veri **bellekte** durur. Veriyi değiştiren aksiyon **asla** `location.reload()`
ile bitmez — reload script'leri baştan koşar ve değişikliği **siler**.
Doğrusu: `setTimeout(function(){ GV.refresh(); }, 700);`

**Dinleyici kuralı (ders L-16):** `GV.refresh()` mount düğümünü (`#rec`) taze kopyayla
değiştirir — `mount.addEventListener(...)` güvenlidir, dinleyici birikmez.
Ama **`document`e veya `window`a** dinleyici bağlayacaksan `addEventListener` yerine
**`GV.on(document, 'click', fn, 'benzersizAnahtar')`** kullan; aynı düğümde birden çok
dinleyicin varsa **her birine ayrı anahtar** ver, yoksa birbirlerini sökerler.

## 4. Yasaklar
- `assets/` altındaki hiçbir dosyaya dokunma. `tasks/` altına yazma.
- **Scratchpad'e ASLA yazma** (ders L-06, iki kez oldu). Kendi doğrulama script'in
  gerekiyorsa `/tmp/` altında **kendi adına özel bir alt dizin** aç ve işin bitince
  orada bırak. `qa.js` · `canon.js` · `links.js` · `gate.js` · `tabs.js` · `esc.js` ·
  `mut.js` · `dbref.js` isimleri **orkestratöre aittir**, bu adlarla dosya yazma.
- Commit atma, push etme, hiçbir git komutu çalıştırma.
- Sayfaya özel `<style>` bloğu. Gereken CSS yoksa **uydurma** — raporda bildir.
- `GV.detail()` ve `GV.gantt()` **YOK** — elle markup + `GV.tabs('#recTabs')`.
- Veri uydurma. Alan yoksa raporda "eksik veri alanı: …" bildir, ekranı onsuz kur.
- `href="#"` veya çalışmayan buton. Normal `href` yaz; olmayan hedefi shell otomatik
  `data-wip`'e çevirir.
- Yerel `GV.badge` ton haritası. Sözlükte olmayan değere `GV.badge(v,'is-warn')` gibi
  **açık ton** geç ve eksiği raporla.
- `DB.emp / empName / dep / depName / proj / projName / mod / modName / task` ortak
  katmanda **VAR** — yerel kopya yazma.
- `new Date()` ile bugünü alma — tarih referansı **`DB.today`**.
- Aynı sayfada ikinci `GV.list` örneği (bilinen kısıt UID-06) — sekme tabloları düz
  `.gv-tablewrap.is-mobilescroll > table.gtable`.
- İnşaat terminolojisi: **şantiye · taşeron · hakediş · saha** yasak. "hakediş" yerine
  **"taksit"** (finans) veya **"komisyon kazancı"** (referans).

## 5. Veri dosyası sahipliği (ders L-12 — okuduğun her koleksiyonu YÜKLE)
| dosya | koleksiyonlar |
|---|---|
| `org.js` | employees, departments, roles, permMatrix, emp, empName, dep, depName, roleName, today |
| `crm.js` | leads, customers, contacts, referrers, commissions, analyses, quotes, quoteItems, interactions, pipelineStages, refTypes, sectors, services, lostReasons |
| `work.js` | projects, projectModules, milestones, sprints, tasks, subtasks, taskDeps, deptRequests, bugs, tests, deliveries, changeRequests, approvals, activities, priorities, impacts, taskStatuses, taskTypes, taskTransitions, proj, projName, mod, modName, task |
| `ops.js` | assets, assignments, vehicles, maintenance, inspections, policies, fuelLogs, vehicleExpenses, accidents, fines, suppliers, purchases, purchaseApprovals, supplierQuotes, orders, tickets, supportPackages, slaPolicies, surveys, assetCategories |
| `hr.js` | leaves, leaveTypes, timelogs, timesheets, performance, trainings, capacity |
| `misc.js` | contracts, invoices, payments, meetings, decisions, documents, channels, messages, notifications, announcements, automations, integrations, logs, company |

## 6. Para ve maskeleme
- **Eksenler:** `contracts.tutar` NET · `.kdv` · `.toplam` BRÜT · `milestones.odeme` NET ·
  `invoices.tutar/vergi/toplam` net/KDV/brüt · `payments.tutar` **BRÜT** ·
  `purchases.tahminiMaliyet` NET · `supplierQuotes.fiyat` NET ·
  `orders.tutar/vergi/toplam` net/KDV/brüt · `suppliers.toplamTutar` NET ·
  `customers.toplamCiro` NET · `customers.bekleyenTahsilat` **BRÜT** · `quotes.toplam` BRÜT.
- **Her para etiketine ekseni yaz** ("(KDV hariç)" / "(KDV dahil)"). Net ve brüt
  **aynı kolonda karışmaz**. Oran bölerken net/net veya brüt/brüt böl.
- `GV.perm.can('finans')` yoksa tutarlar `<span class="cell-mask">••••••</span>`.
  **"₺0" gösterme** — maskeli göster (UID-11).
- Maaş/ücret `GV.perm.can('maas')` ile maskelenir.

## 7. Kayıt seçimi ve boş durum
`?id=<kod>` ile; id yoksa ilk kayıt; hatalıysa listeye dönüş aksiyonlu `GV.empty({...})`.
**Her boş sekmeye** `GV.empty({icon,title,desc})` bas — sekme asla boş kalmasın.

## 8. Ölü buton yasağı
Yetki veya durum koşulu sağlanmıyorsa buton **hiç basılmaz** (devre dışı bırakılmaz).
`GV.perm.can('ekle'|'duzenle'|'sil'|'onay'|'disaAktar'|'finans'|'maas')`.

## 9. Rapor (tam olarak üç başlık)
(a) üretilen dosya + satır sayısı
(b) eksik bileşen / eksik veri alanı listesi
(c) dikkat edilmesi gereken varsayımlar

Dosyayı yazdıktan sonra inline script'in parse edildiğini doğrula (syntax hatası bırakma).
