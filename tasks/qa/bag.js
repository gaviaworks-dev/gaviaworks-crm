/* bag.js — "§22 bağı EKRANDA görünüyor mu?" (VB-28 ekseni)
   canon.js bağın VERİDE yazılı olduğunu ölçer; bu script bağın kullanıcıya
   ULAŞTIĞINI ölçer. İkisi ayrı sorudur: 9. oturumda `leads.musteri` veride
   doluydu ama görev detayında sohbet kaynağı hiç basılmıyordu.
   Eski başlık: VB-28 doğrulaması — bağın EKRANDA göründüğünü ölçer.
   L-24 gereği her hüküm bir olumlu + bir olumsuz vakayla sınanır. */
const { chromium } = require('playwright');
const B = 'http://127.0.0.1:8791/';
const VAKA = [
  // [ekran, olumlu bekleneni İÇERMELİ, olumsuz vaka, o vakada İÇERMEMELİ]
  ['app-arac-detay.html?id=ARC-004',      'SIP-2025-006', 'app-arac-detay.html?id=ARC-002', 'SIP-2025-006'],
  ['app-arac-detay.html?id=ARC-004',      'SAT-2025-010', 'app-arac-detay.html?id=ARC-001', 'SAT-2025-010'],
  ['app-siparis-detay.html?id=SIP-2025-006','ARC-004',    'app-siparis-detay.html?id=SIP-2026-007','ARC-004'],
  ['app-gorev-detay.html?id=GRV-2026-126','DST-2026-118', 'app-gorev-detay.html?id=GRV-2026-102','DST-2026-118'],
  ['app-gorev-detay.html?id=GRV-2026-126','HTA-2026-074', 'app-gorev-detay.html?id=GRV-2026-102','HTA-2026-074'],
  ['app-gorev-detay.html?id=GRV-2026-101','#proje-vitalis','app-gorev-detay.html?id=GRV-2026-102','#proje-vitalis']
];
(async () => {
  const br = await chromium.launch(); const pg = await br.newPage();
  let bad = 0, n = 0, ekran = new Set(), kayit = 0;
  const oku = async (u) => {
    const sep = u.indexOf('?') === -1 ? '?' : '&';
    await pg.goto(B + u + sep + 'role=sahip', { waitUntil:'networkidle' });
    ekran.add(u.split('?')[0]);
    const kod = await pg.evaluate(() => (document.querySelector('.gv-rec-code')||{}).textContent||'');
    if (kod.trim()) kayit++;
    // sekmelerin tamamını aç ki gizli panel metni de okunsun
    await pg.evaluate(() => document.querySelectorAll('.gv-tab').forEach(b => b.click()));
    return (await pg.evaluate(() => document.body.innerText)) + '||' + (await pg.content());
  };
  for (const [olumluU, bekle, olumsuzU, beklemE] of VAKA) {
    const a = await oku(olumluU); n++;
    if (!a.includes(bekle)) { bad++; console.log('  ✘ OLUMLU  ' + olumluU + ' → "' + bekle + '" EKRANDA YOK'); }
    const b = await oku(olumsuzU); n++;
    if (b.includes(beklemE)) { bad++; console.log('  ✘ OLUMSUZ ' + olumsuzU + ' → "' + beklemE + '" olmamalıydı, VAR'); }
  }
  if (!n) { console.log('GEÇERSİZ — hiç vaka koşulmadı'); process.exit(2); }
  console.log('\n' + (bad ? 'ÇELİŞKİ — ' + bad + ' / ' + n : 'TEMİZ — ' + n + ' vaka') +
    ' · taranan ekran ' + ekran.size + ' · yüklenen kayıt ' + kayit + ' / ' + (VAKA.length * 2));
  await br.close(); process.exit(bad ? 1 : 0);
})();
