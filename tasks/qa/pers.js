/* pers.js — "Kişi alanı ekranda AD gösteriyor mu, KOD değil?" (VB-12 · VB-13)
 *
 * `canon.js` eksen 24 veride kodun yazılı olduğunu ölçer. Bu script ikinci yarısını
 * ölçer: kod ekrana **sızıyor mu**. Çevrimden sonraki en olası regresyon budur —
 * veri doğru, ama bir ekran `esc(t.acan)` yazmaya devam ediyorsa kullanıcı
 * "YTK-012" görür ve hiçbir konsol hatası oluşmaz (L-14 sınıfı: konsol temiz ≠
 * ekran doğru).
 *
 * Her vaka İKİ yönlüdür (L-24): beklenen AD ekranda **olmalı**, yasak KOD
 * ekranda **olmamalı**. Yalnız birini ölçmek yeterli değildir — ad hiç
 * basılmasa da kod yoktur, ölçüm sahte yeşil verir.
 *
 * Kullanım: node pers.js [rol]
 */
const { chromium } = require('playwright');
const L = require('./qa-lib');

/* KODUN NEREDE GÖRÜNMESİ MEŞRU: bu projede her kayıt kendi kodunu ikincil
 * etiket olarak gösterir (`.cell-code` · `.cell-sub` · `.gv-rec-code`). Bir
 * yetkilinin kartında "İşletme Sahibi · YTK-012" yazması sızıntı DEĞİLDİR.
 * İhlal, kodun **adın yerine** geçmesidir: birincil ad konumunda (`.cell-main`,
 * `.gv-tl-who`) ya da sınıfsız bir hücrede (`td`/`dd`) tek başına durması.
 * İlk koşumda bu ayrım yoktu ve araç iki meşru gösterimi ihlal saydı (L-26).
 *
 * [hedef, ekranda OLMASI gereken ad, o ekrandaki kod, not] */
const VAKA = [
  ['app-destek.html',                        'Yusuf Balaban',   'YTK-012', 'liste: talebi açan yetkili'],
  ['app-destek-sla.html',                    'Gülay Şen',       'YTK-008', 'SLA listesi: talebi açan'],
  ['app-destek-detay.html?id=DST-2026-118',  'Yusuf Balaban',   'YTK-012', 'detay: talebi açan'],
  ['app-musteri-iletisim.html',              'Hakan Demirtaş',  'YTK-001', 'iletişim listesi: muhatap'],
  ['app-musteri-detay.html?id=MUS-2024-001', 'Hakan Demirtaş',  'YTK-001', 'müşteri detayı: iletişim sekmesi'],
  ['app-lead-detay.html?id=LEAD-2026-004',   'Tuğçe Aslan',     'YTK-0',   'aday yetkilisi — kontak null, ad adaydan okunur'],
  ['app-gorev-detay.html?id=GRV-2026-101',   'Onur Şahin',      'EMP-008', 'aktivite timeline: kişi'],
  ['app-arac-detay.html?id=ARC-001',         'Kerem Aydın',     'EMP-001', 'araç aktivitesi + ana sürücü'],
  ['app-referans-detay.html?id=REF-001',     'Hakan Demirtaş',  'YTK-001', 'yönlendiren ≡ yetkili (VB-13)']
];

(async () => {
  const role = process.argv[2] || 'sahip';
  if (!VAKA.length) { console.log('GEÇERSİZ — vaka listesi boş'); process.exit(2); }

  const br = await chromium.launch();
  const pg = await br.newPage();
  let bad = 0, n = 0, kayit = 0;
  const ekran = new Set();

  for (const [t, ad, kod, not] of VAKA) {
    const sep = t.indexOf('?') === -1 ? '?' : '&';
    await pg.goto(L.BASE + t + sep + 'role=' + role, { waitUntil: 'networkidle' });
    ekran.add(t.split('?')[0]);

    const rc = await L.recCheck(pg, t);
    if (rc.need && !rc.ok) { bad++; console.log('  ✘ ' + t + ' KAYIT YÜKLENMEDİ — ' + rc.why); continue; }
    if (rc.need) kayit++;

    /* Sekmelerin tamamı açılır. AMA `innerText` yalnız GÖRÜNEN metni verir ve
       tıklamadan sonra tek bir panel açık kalır — ilk koşumda bu, ekranda var olan
       bir adı "yok" gösterdi. Bu yüzden gövde klonlanır, `<script>` düğümleri
       atılır (sayfa kaynağında YTK-001 gibi kodlar geçiyor, sahte ihlal olurdu)
       ve `textContent` okunur: gizli panellerdeki sızıntı da yakalanır. */
    await pg.evaluate(() => document.querySelectorAll('.gv-tab').forEach(b => b.click()));
    const txt = await pg.evaluate(() => {
      const k = document.body.cloneNode(true);
      k.querySelectorAll('script, style, template').forEach(e => e.remove());
      return k.textContent || '';
    });

    /* Kod, ADIN YERİNE geçmiş mi? Yalnız birincil ad konumları taranır. */
    const sizinti = await pg.evaluate(k => {
      const out = [];
      document.querySelectorAll('.cell-main, .gv-tl-who, td, dd').forEach(e => {
        if (e.children.length) return;                       /* yalnız yaprak düğüm */
        const t = (e.textContent || '').trim();
        if (t.indexOf(k) === -1) return;
        const c = e.className || '';
        if (/cell-code|cell-sub|gv-rec-code/.test(c)) return; /* meşru ikincil etiket */
        out.push((c || e.tagName.toLowerCase()) + ' :: ' + t.slice(0, 60));
      });
      return out;
    }, kod);

    n += 2;
    if (txt.indexOf(ad) === -1) {
      bad++; console.log('  ✘ ' + t.padEnd(42) + '"' + ad + '" EKRANDA YOK — ' + not);
    }
    if (sizinti.length) {
      bad++; console.log('  ✘ ' + t.padEnd(42) + 'KOD ADIN YERİNDE: ' + sizinti[0]);
    }
    if (txt.indexOf(ad) !== -1 && !sizinti.length) {
      console.log('  ✔ ' + t.padEnd(42) + ad + ' · kod adın yerine geçmiyor');
    }
  }

  await br.close();
  console.log('\ntaranan ekran ' + ekran.size + ' · vaka ' + n + ' · yüklenen kayıt ' + kayit +
              ' / ' + VAKA.filter(v => v[0].indexOf('?id=') !== -1).length);
  console.log(bad === 0
    ? 'TEMİZ — kişi alanları ad gösteriyor, kod sızmıyor'
    : 'İHLAL — ' + bad + ' / ' + n + ' ölçüm başarısız');
  process.exit(bad ? 1 : 0);
})();
