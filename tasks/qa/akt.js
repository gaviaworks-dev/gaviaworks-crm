/* akt.js — "Detay ekranının Aktivite Geçmişi sekmesi gerçekten DOLU mu?" (UID-16)
 *
 * `canon.js` eksen 22 veriyi ölçer: koleksiyonun en az bir kaydında aktivite var mı.
 * Bu script ikinci yarısını ölçer: o kayıt AÇILDIĞINDA sekme timeline basıyor mu.
 * İkisi ayrı sorudur — 11. oturumda 26 detay ekranının 22'sinde sekme her kayıtta
 * `GV.empty` "Henüz hareket yok" basıyordu ve hiçbir eksen bunu görmüyordu.
 *
 * Ölçüm: hedef `?id=` ile açılır (L-19 — kaydın gerçekten yüklendiği doğrulanır),
 * "Aktivite" sekmesi tıklanır, `.gv-tl-item` sayılır. Sıfır ise İHLAL.
 * Sekmesi olmayan ekran ihlal DEĞİLDİR, ayrı sayaçta raporlanır (L-26).
 *
 * Kullanım: node akt.js ["a.html?id=X,b.html?id=Y"] [rol]
 */
const { chromium } = require('playwright');
const L = require('./qa-lib');

(async () => {
  const arg  = process.argv[2] || '';
  const role = process.argv[3] || 'sahip';
  const hedefler = L.expand(arg, 'detail').filter(t => /-detay\.html/.test(t));

  /* L-27: düzeneğini kuramayan araç susmaz, DURUR. */
  if (!hedefler.length) {
    console.log('GEÇERSİZ — hedef listesi boş. Önce `node rec.js` koş (L-19).');
    process.exit(2);
  }

  const br = await chromium.launch();
  const pg = await br.newPage();
  const konsol = [];
  pg.on('console', m => { if (m.type() === 'error') konsol.push(m.text()); });
  pg.on('pageerror', e => konsol.push(String(e)));

  let ihlal = 0, sekmesiz = 0, kayitYok = 0, toplamOlay = 0;
  const satirlar = [];

  for (const t of hedefler) {
    konsol.length = 0;
    const sep = t.indexOf('?') === -1 ? '?' : '&';
    await pg.goto(L.BASE + t + sep + 'role=' + role, { waitUntil: 'networkidle' });

    const rc = await L.recCheck(pg, t);
    if (rc.need && !rc.ok) {
      kayitYok++;
      satirlar.push(['✘', t, 'KAYIT YÜKLENMEDİ — ' + rc.why]);
      continue;
    }

    const r = await pg.evaluate(() => {
      const tablar = [...document.querySelectorAll('.gv-tab')];
      const t = tablar.filter(b => /aktivite/i.test(b.textContent || ''))[0];
      if (!t) return { sekme: false, n: 0 };
      t.click();
      const panel = document.querySelector('.gv-tabpanel.is-on, .gv-tabpanel:not([hidden])');
      const kok = panel || document;
      return {
        sekme: true,
        n: kok.querySelectorAll('.gv-tl-item').length,
        bos: !!kok.querySelector('.gv-empty')
      };
    });

    if (!r.sekme) {
      sekmesiz++;
      satirlar.push(['·', t, 'aktivite sekmesi yok — ihlal sayılmadı']);
    } else if (!r.n) {
      ihlal++;
      satirlar.push(['✘', t, 'sekme AÇILDI ama 0 hareket' + (r.bos ? ' (boş durum basıldı)' : '')]);
    } else {
      toplamOlay += r.n;
      satirlar.push(['✔', t, r.n + ' hareket']);
    }
    if (konsol.length) {
      ihlal++;
      satirlar.push(['✘', t, 'konsol hatası: ' + konsol[0].slice(0, 120)]);
    }
  }

  await br.close();
  satirlar.forEach(([s, t, m]) => console.log('  ' + s + ' ' + t.padEnd(46) + m));
  console.log('\ntaranan ekran ' + hedefler.length + ' · yüklenen kayıt ' +
              (hedefler.length - kayitYok) + ' · ölçülen hareket ' + toplamOlay +
              ' · aktivite sekmesi olmayan ' + sekmesiz);
  console.log(ihlal === 0
    ? 'TEMİZ — her detay ekranının aktivite sekmesi dolu'
    : 'İHLAL — ' + ihlal + ' ekranın aktivite sekmesi boş');
  process.exit(ihlal ? 1 : 0);
})();
