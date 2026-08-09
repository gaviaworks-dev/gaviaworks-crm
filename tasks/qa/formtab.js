/* formtab.js — FORM SEKME KABUĞU EKSENİ (şartname [3.1.4] · [3.1.6] · [3.1.12] · [3.2.1])
 *
 * `tabs.js` DETAY ekranlarının sekmelerini tıklıyor. Bu eksen FORM motorunun
 * (`GV.form` · `cfg.tabs`) sözleşmesini ölçer — ikisi ayrı markup üretiyor:
 *   detayda `GV.tabs(sel)` sayfanın kendi yazdığı şeride bağlanır,
 *   formda motor şeridi kendi basar (`[data-ftab]`).
 *
 * Ölçülen altı hüküm:
 *   T1  panel sayısı = sekme sayısı
 *   T2  her panelde en az bir `.gv-form-sec` var (boş sekme = ölü kontrol)
 *   T3  hiçbir `.gv-form-sec` panellerin DIŞINDA kalmamış
 *       ⚠️ bu hüküm gerçek bir kusuru yakalamak için var: sekmesiz bölüm
 *       güvenlik ağı ilk yazımında `html.replace('</div>', …)` ile kurulmuştu
 *       ve bölümü hata özeti kutusunun İÇİNE basıyordu (kural yazılıydı ama
 *       hiç çalışmamıştı — ders L-31'in sınıfı). Eksen olmadan görünmezdi.
 *   T4  tam bir sekme `aria-selected="true"`, gerisi false
 *   T5  seçili sekme `tabindex=0`, diğerleri -1; her sekmenin `aria-controls`u
 *       gerçek bir panele işaret ediyor
 *   T6  her sekme tıklanınca tam bir panel görünür kalıyor; ArrowRight seçimi
 *       bir sonrakine taşıyor ([3.2.1] klavye erişilebilirliği)
 *
 * Sekme kurmamış form BULGU DEĞİLDİR (ADR-18: 4 bölümden azına sekme kurulmaz)
 * ama AYRI SAYAÇTA raporlanır — sessizce yeşile yazılmaz (ders L-26).
 *
 * Kullanım: node tasks/qa/formtab.js ["a.html,b.html"] [rol]
 * Sunucu:   python3 -m http.server 8791 --bind 127.0.0.1
 */
const { chromium } = require('playwright');
const LIB = require('./qa-lib');
/* Kaynak adres ENV'den geçersiz kılınabilir (ders L-35: script neye baktığını
   içine gömmez). L-39 selftest'i bozulmuş bir KOPYAYI ayrı portta sunup bu
   ekseni ona koşturur; repo değişmeden hükümlerin bulgu ürettiği kanıtlanır.
   `GV_REPO` ile birlikte kullanılır ki hedef listesi de kopyadan gelsin. */
const BASE = process.env.GV_BASE || LIB.BASE;

/* Hedefler: her form ekranı hem YENİ KAYIT (id'siz) hem DÜZENLEME (id'li)
   yolunda ölçülür — sekme kümesi yetkiye ve moda göre değişebiliyor. */
function hedefler(arg) {
  if (arg && arg.trim()) return arg.split(',').map(s => s.trim()).filter(Boolean);
  const formlar = LIB.allScreens().filter(f => /-form\.html$/.test(f));
  const dogrulanmis = {};
  for (const t of LIB.loadTargets()) {
    const dosya = t.target.split('?')[0];
    if (/-form\.html$/.test(dosya) && !dogrulanmis[dosya]) dogrulanmis[dosya] = t.target;
  }
  const out = [];
  for (const f of formlar) {
    out.push(f);                                   /* yeni kayıt yolu */
    if (dogrulanmis[f]) out.push(dogrulanmis[f]);  /* düzenleme yolu (L-19: kod veriden) */
  }
  return out;
}

(async () => {
  const files = hedefler(process.argv[2]);
  const role = (process.argv[3] || 'sahip').trim();
  if (!files.length) throw new Error('formtab: hedef listesi boş — düzenek kurulamadı (L-27)');

  const browser = await chromium.launch();
  const bulgular = [];
  let sekmeli = 0, duz = 0, kapali = 0, panelToplam = 0, tiklama = 0;

  for (const f of files) {
    const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    const page = await ctx.newPage();
    const konsol = [];
    page.on('pageerror', e => konsol.push('pageerror: ' + e.message));
    await page.goto(BASE + f + (f.indexOf('?') === -1 ? '?' : '&') + 'role=' + role, { waitUntil: 'networkidle' });
    await page.waitForTimeout(250);

    const durum = await page.evaluate(() => {
      const yetkisiz = /yetkiniz yok|erişemez/i.test((document.querySelector('.gv-page') || {}).textContent || '');
      const tabs = [...document.querySelectorAll('[data-ftab]')];
      if (!tabs.length) return { yetkisiz, sekmeli: false, bolum: document.querySelectorAll('.gv-form-sec').length };
      const paneller = [...document.querySelectorAll('.gv-tabpanel')];
      const panelIci = paneller.reduce((n, p) => n + p.querySelectorAll('.gv-form-sec').length, 0);
      return {
        yetkisiz, sekmeli: true,
        tabN: tabs.length,
        panelN: paneller.length,
        bosPanel: paneller.filter(p => !p.querySelectorAll('.gv-form-sec').length).map(p => p.id),
        disariKalan: document.querySelectorAll('.gv-form-sec').length - panelIci,
        secili: tabs.filter(t => t.getAttribute('aria-selected') === 'true').length,
        tabindexHata: tabs.filter(t => (t.getAttribute('aria-selected') === 'true') !== (t.tabIndex === 0)).length,
        kirikKontrol: tabs.filter(t => !document.getElementById(t.getAttribute('aria-controls') || '')).length,
        etiketler: tabs.map(t => (t.textContent || '').trim())
      };
    });

    const etiket = f + ' [' + role + ']';
    if (durum.yetkisiz) { kapali++; console.log('403  ' + etiket); await ctx.close(); continue; }

    if (!durum.sekmeli) {
      duz++;
      console.log('düz  ' + etiket + ' — ' + durum.bolum + ' bölüm, sekme kurulmamış (ADR-18)');
      await ctx.close();
      continue;
    }

    sekmeli++;
    panelToplam += durum.panelN;
    const b = m => bulgular.push({ f: etiket, m });

    if (durum.tabN !== durum.panelN) b('T1 panel sayısı sekme sayısına eşit değil: ' + durum.tabN + ' sekme / ' + durum.panelN + ' panel');
    if (durum.bosPanel.length) b('T2 boş panel: ' + durum.bosPanel.join(' · '));
    if (durum.disariKalan > 0) b('T3 ' + durum.disariKalan + ' bölüm panellerin DIŞINDA kaldı');
    if (durum.secili !== 1) b('T4 aria-selected=true sayısı ' + durum.secili + ' (1 olmalı)');
    if (durum.tabindexHata) b('T5 ' + durum.tabindexHata + ' sekmede tabindex seçili durumla uyuşmuyor');
    if (durum.kirikKontrol) b('T5 ' + durum.kirikKontrol + ' sekmenin aria-controls hedefi yok');

    /* T6 — her sekme tıklanır, tam bir panel açık kalmalı */
    const tabs = await page.$$('[data-ftab]');
    for (let i = 0; i < tabs.length; i++) {
      try { await tabs[i].click({ timeout: 2000 }); } catch (e) { b('T6 sekme ' + i + ' tıklanamadı: ' + e.message); continue; }
      await page.waitForTimeout(90);
      tiklama++;
      const acik = await page.evaluate(() => [...document.querySelectorAll('.gv-tabpanel')].filter(p => !p.hidden).length);
      if (acik !== 1) b('T6 sekme ' + i + ' sonrası açık panel sayısı ' + acik);
    }
    /* T6b — klavye ([3.2.1]) */
    if (tabs.length > 1) {
      await tabs[0].click(); await page.waitForTimeout(80);
      await page.keyboard.press('ArrowRight'); await page.waitForTimeout(120);
      const ikinci = await page.evaluate(() =>
        [...document.querySelectorAll('[data-ftab]')].findIndex(t => t.getAttribute('aria-selected') === 'true'));
      if (ikinci !== 1) b('T6 ArrowRight seçimi 1. sekmeye taşımadı (bulunan: ' + ikinci + ')');
    }

    if (konsol.length) b('konsol: ' + konsol[0]);

    const kendi = bulgular.filter(x => x.f === etiket);
    if (kendi.length) { console.log('HATA ' + etiket + ' — ' + durum.tabN + ' sekme'); kendi.forEach(x => console.log('   ' + x.m)); }
    else console.log('ok   ' + etiket + ' — ' + durum.tabN + ' sekme: ' + durum.etiketler.join(' · '));
    await ctx.close();
  }
  await browser.close();

  console.log('\nhedef: ' + files.length + ' · sekmeli form: ' + sekmeli + ' · düz form: ' + duz +
              ' · yetki kapalı: ' + kapali + ' · ölçülen panel: ' + panelToplam + ' · sekme tıklaması: ' + tiklama);
  if (!sekmeli && !duz) { console.log('GEÇERSİZ — hiçbir form ölçülemedi'); process.exit(2); }
  if (bulgular.length) { console.log('EKSİK — ' + bulgular.length + ' bulgu'); process.exit(1); }
  console.log('TEMİZ — ' + sekmeli + ' sekmeli formun sözleşmesi tam, ' + tiklama + ' tıklama hatasız');
})();
