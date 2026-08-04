/* rec.js — TARAMA HEDEFİ ÜRETİCİSİ (ders L-17'nin kalıcı çözümü).
 *
 * NEDEN VAR: Detay ve form ekranı `?id=KOD` olmadan açılırsa ya "kayıt bulunamadı"
 * boş durumunu ya da (bazı ekranlarda) sessizce ilk kaydı basar. Her iki durumda da
 * tarama script'i "TEMİZ" der — ama ölçtüğü şey ekranın gerçek hâli değildir.
 * 5. oturumda 25 detay ekranı bu şekilde "geçmiş" sayılmıştı.
 *
 * NE YAPAR: Her detay/form ekranı için veriden GERÇEK bir kayıt kodu seçer,
 * o kodla ekranı açar ve kaydın GERÇEKTEN yüklendiğini doğrular
 * (`.gv-rec-code` metni = kod). Doğrulanan hedefleri `qa-targets.json`'a yazar;
 * tabs.js / esc.js / mut.js / listen.js bu dosyayı okur.
 *
 * Kullanım: node rec.js [rol]        (varsayılan sahip)
 */
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');
const BASE = 'http://127.0.0.1:8791/';

/* ekran → kaydın okunduğu koleksiyon (ekran kaynağından çıkarıldı, tahmin değil) */
const MAP = {
  'app-arac-detay.html': 'vehicles',
  'app-demirbas-detay.html': 'assets',
  'app-destek-detay.html': 'tickets',
  'app-dokuman-detay.html': 'documents',
  'app-fatura-detay.html': 'invoices',
  'app-gorev-detay.html': 'tasks',
  'app-istalebi-detay.html': 'deptRequests',
  'app-izin-detay.html': 'leaves',
  'app-komisyon-detay.html': 'commissions',
  'app-lead-detay.html': 'leads',
  'app-musteri-detay.html': 'customers',
  'app-onanaliz-detay.html': 'analyses',
  'app-personel-detay.html': 'employees',
  'app-proje-degisiklik-detay.html': 'changeRequests',
  'app-proje-detay.html': 'projects',
  'app-proje-hata-detay.html': 'bugs',
  'app-proje-teslim-detay.html': 'deliveries',
  'app-proje-test-detay.html': 'tests',
  'app-referans-detay.html': 'referrers',
  'app-satinalma-detay.html': 'purchases',
  'app-siparis-detay.html': 'orders',
  'app-sozlesme-detay.html': 'contracts',
  'app-tahsilat-detay.html': 'payments',
  'app-tedarikci-detay.html': 'suppliers',
  'app-teklif-detay.html': 'quotes',
  'app-toplanti-detay.html': 'meetings',
  /* form ekranları — düzenleme modu aynı doğrulamadan geçer */
  'app-lead-form.html': 'leads',
  'app-musteri-form.html': 'customers',
  'app-satinalma-form.html': 'purchases',
  'app-musteri-yetkili-form.html': 'contacts',
  'app-musteri-iletisim-form.html': 'interactions',
  'app-referans-form.html': 'referrers',
  'app-komisyon-form.html': 'commissions',
  'app-onanaliz-form.html': 'analyses',
  'app-teklif-form.html': 'quotes',
  'app-proje-form.html': 'projects',
  'app-gorev-form.html': 'tasks',
  'app-destek-form.html': 'tickets',
  'app-proje-sprint-form.html': 'sprints',
  'app-proje-test-form.html': 'tests',
  'app-proje-hata-form.html': 'bugs',
  'app-proje-teslim-form.html': 'deliveries',
  'app-proje-degisiklik-form.html': 'changeRequests',
  'app-istalebi-form.html': 'deptRequests',
};

/* Kaydın GERÇEKTEN yüklendiğinin ölçütü.
   Detay: `.gv-rec-code` metni kodu taşır. Form (düzenleme): başlık kodu taşır
   ve en az bir doldurulmuş alan vardır. İkisinde de "bulunamadı" metni olamaz. */
async function loaded(page, kod, isForm) {
  return await page.evaluate(([kod, isForm]) => {
    const txt = (document.body.innerText || '');
    if (/bulunamad/i.test(txt)) return { ok: false, why: 'kayıt bulunamadı durumu' };
    const rc = document.querySelector('.gv-rec-code');
    if (!isForm) {
      if (!rc) return { ok: false, why: '.gv-rec-code yok' };
      return rc.textContent.indexOf(kod) !== -1
        ? { ok: true, why: '.gv-rec-code=' + rc.textContent.trim() }
        : { ok: false, why: '.gv-rec-code=' + rc.textContent.trim() + ' ≠ ' + kod };
    }
    const head = document.querySelector('.gv-page-head h1');
    const filled = [...document.querySelectorAll('.gv-form input, .gv-form select, .gv-form textarea, #formMount input, #formMount select, #formMount textarea')]
      .filter(el => el.value && String(el.value).trim().length).length;
    if (!head || head.textContent.indexOf(kod) === -1) return { ok: false, why: 'başlık kodu taşımıyor' };
    if (!filled) return { ok: false, why: 'form alanları boş — kayıt yüklenmemiş' };
    return { ok: true, why: 'başlık + ' + filled + ' dolu alan' };
  }, [kod, isForm]);
}

(async () => {
  const role = process.argv[2] || 'sahip';
  const browser = await chromium.launch();
  const out = [];
  let zero = 0;

  for (const [file, coll] of Object.entries(MAP)) {
    const isForm = /-form\.html$/.test(file);
    const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    const page = await ctx.newPage();
    await page.goto(BASE + file + '?role=' + role, { waitUntil: 'networkidle' });
    await page.waitForTimeout(200);

    const cands = await page.evaluate((c) => {
      const arr = (window.DB || {})[c] || [];
      return arr.slice(0, 8).map(r => r.kod).filter(Boolean);
    }, coll);

    if (!cands.length) {
      console.log('HATA ' + file.padEnd(34) + ' DB.' + coll + ' boş ya da yüklenmemiş');
      zero++; await ctx.close(); continue;
    }

    let hit = null, why = '';
    for (const kod of cands) {
      await page.goto(BASE + file + '?id=' + encodeURIComponent(kod) + '&role=' + role, { waitUntil: 'networkidle' });
      await page.waitForTimeout(220);
      const r = await loaded(page, kod, isForm);
      if (r.ok) { hit = kod; why = r.why; break; }
      why = r.why;
    }

    if (hit) {
      out.push({ file, coll, kod: hit, target: file + '?id=' + encodeURIComponent(hit), form: isForm });
      console.log('ok   ' + file.padEnd(34) + hit.padEnd(18) + '(' + cands.length + ' aday · ' + why + ')');
    } else {
      zero++;
      console.log('HATA ' + file.padEnd(34) + 'hiçbir aday yüklenmedi — son sebep: ' + why);
    }
    await ctx.close();
  }
  await browser.close();

  fs.writeFileSync(path.join(__dirname, 'qa-targets.json'), JSON.stringify(out, null, 2));
  console.log('\n' + out.length + ' hedef doğrulandı / ' + Object.keys(MAP).length + ' ekran · qa-targets.json yazıldı');
  console.log(zero ? 'SORUN — ' + zero + ' ekranda kayıt yüklenemedi (tarama geçersiz sayılır)'
                   : 'TEMİZ — her ekran gerçek bir kayıtla açıldı');
  process.exit(zero ? 1 : 0);
})();
