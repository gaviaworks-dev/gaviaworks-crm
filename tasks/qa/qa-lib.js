/* qa-lib.js — tarama script'lerinin ORTAK doğrulama katmanı (dersler L-17 · L-19 · L-24).
 *
 * Üç iş yapar:
 *   1. expand(arg)  — hedef listesini üretir. Argüman verilmezse `rec.js`'in
 *      doğruladığı `qa-targets.json` okunur; böylece detay/form ekranı asla
 *      `?id=` olmadan taranmaz.
 *   2. allScreens() / fullTargets(arg) — **TÜM ekranların** listesi. Tek doğru
 *      kaynak `shell.js` → `BUILT` dizisidir. Boş dönerse **hata fırlatır**.
 *      Yol `repoRoot()`'tan gelir; script'ler artık kendi ROOT'unu sabitlemez.
 *   3. recCheck(page, target) — hedef `?id=` taşıyorsa kaydın GERÇEKTEN
 *      yüklendiğini ölçer. Yüklenmediyse tarama o ekran için GEÇERSİZDİR;
 *      "TEMİZ" demek yerine hata sayılır.
 *
 * Kural (L-17): bir aracın "temiz" demesi doğru şeyi ölçtüğü anlamına gelmez.
 *
 * ⚠️ **L-24 — HEDEF LİSTESİ ELLE ÜRETİLMEZ.** `act.js` ilk koşumunda ekran
 * listesini iki kez yanlış kaynaktan aldı: önce `__dirname`'den repo yolu
 * türeterek (script scratchpad'ten koşuyor → boş liste), sonra HTTP kökünü
 * dizin listesi sanarak (repoda `index.html` var → giriş ekranı döndü).
 * İkisinde de araç **hata vermedi**, sessizce 62 ekran tarayıp "TEMİZ" dedi —
 * L-17/L-19 sınıfının üçüncü tekrarı. Bu yüzden hedef üretimi artık **yalnız
 * burada** yapılır; hiçbir script kendi listesini kurmaz.
 */
const fs = require('fs');
const path = require('path');

const TARGETS = path.join(__dirname, 'qa-targets.json');
const BASE = 'http://127.0.0.1:8791/';

function loadTargets() {
  if (!fs.existsSync(TARGETS)) return [];
  try { return JSON.parse(fs.readFileSync(TARGETS, 'utf8')); } catch (e) { return []; }
}

/* arg: "a.html,b.html?id=X" ya da boş.
   mode: 'detail' → yalnız detay hedefleri · 'all' → detay + form hedefleri */
function expand(arg, mode) {
  if (arg && arg.trim()) return arg.split(',').map(s => s.trim()).filter(Boolean);
  const t = loadTargets();
  return t.filter(x => mode === 'all' ? true : !x.form).map(x => x.target);
}

/* Repo kökü — TEK yerde. Dört script bunu ayrı ayrı sabitlemişti (dbref · esc ·
 * gate · links); kopya sayısı kadar sessizce yanlış yola bakma riski vardı.
 * `GV_REPO` ortam değişkeniyle geçersiz kılınabilir. Bulamazsa HATA FIRLATIR. */
function repoRoot() {
  const cands = [process.env.GV_REPO, '/Users/gaviaworks/Developer/Projects/gaviaworks-crm'];
  for (const c of cands) {
    if (c && fs.existsSync(path.join(c, 'assets/js/shell.js'))) return c;
  }
  throw new Error('qa-lib: repo kökü bulunamadı — GV_REPO ortam değişkenini ver');
}

/* TÜM ekranlar — tek doğru kaynak `shell.js` → `BUILT` dizisi.
 * `index.html` listede yoktur (uygulama ekranı değil, giriş ekranı).
 * Boş dönerse HATA FIRLATIR — sessizce kısa liste döndürmek yasak (L-24). */
function allScreens() {
  const src = fs.readFileSync(path.join(repoRoot(), 'assets/js/shell.js'), 'utf8');
  const blk = src.match(/var BUILT\s*=\s*\[([\s\S]*?)\]/);
  if (!blk) throw new Error('qa-lib: shell.js içinde BUILT dizisi bulunamadı');
  const files = [...blk[1].matchAll(/'(app-[\w-]+\.html)'/g)].map(m => m[1]);
  if (!files.length) throw new Error('qa-lib: BUILT boş döndü — hedef listesi üretilemedi');
  return [...new Set(files)].sort();
}

/* Diskteki ekranlar. YALNIZ `links.js` kullanır: onun işi zaten BUILT ile diski
 * KARŞILAŞTIRMAKTIR (kayıtsız ekran · hayalet kayıt). Başka script disk listesine
 * bakmaz — BUILT tek hedef kaynağıdır. */
function onDiskScreens() {
  return fs.readdirSync(repoRoot()).filter(f => /^app-.*\.html$/.test(f)).sort();
}

/* Tam kapsam hedefi: her ekran bir kez, detay/form olanlar `?id=` ile.
 * `qa-targets.json`'daki doğrulanmış hedef önceliklidir (L-19). */
function fullTargets(arg) {
  if (arg && arg.trim()) return arg.split(',').map(s => s.trim()).filter(Boolean);
  const out = [], seen = new Set();
  for (const t of loadTargets()) {
    const f = t.target.split('?')[0];
    if (!seen.has(f)) { seen.add(f); out.push(t.target); }
  }
  for (const f of allScreens()) if (!seen.has(f)) { seen.add(f); out.push(f); }
  return out;
}

function idOf(target) {
  const m = /[?&]id=([^&]+)/.exec(target);
  return m ? decodeURIComponent(m[1]) : null;
}

/* Kayıt yüklendi mi? → { need:boolean, ok:boolean, why:string } */
async function recCheck(page, target) {
  const kod = idOf(target);
  if (!kod) return { need: false, ok: true, why: 'id yok' };
  const isForm = /-form\.html/.test(target);
  const r = await page.evaluate(([kod, isForm]) => {
    const txt = (document.body.innerText || '');
    if (/bulunamad/i.test(txt)) return { ok: false, why: '"kayıt bulunamadı" durumu ölçüldü' };
    if (isForm) {
      const head = document.querySelector('.gv-page-head h1');
      const filled = [...document.querySelectorAll('#formMount input, #formMount select, #formMount textarea, .gv-form input, .gv-form select, .gv-form textarea')]
        .filter(el => el.value && String(el.value).trim().length).length;
      if (!head || head.textContent.indexOf(kod) === -1) return { ok: false, why: 'form başlığı kodu taşımıyor' };
      if (!filled) return { ok: false, why: 'form alanları boş' };
      return { ok: true, why: filled + ' dolu alan' };
    }
    const rc = document.querySelector('.gv-rec-code');
    if (!rc) return { ok: false, why: '.gv-rec-code yok' };
    return rc.textContent.indexOf(kod) !== -1
      ? { ok: true, why: rc.textContent.trim() }
      : { ok: false, why: '.gv-rec-code=' + rc.textContent.trim() };
  }, [kod, isForm]);
  return { need: true, ok: r.ok, why: r.why };
}

module.exports = { expand, recCheck, idOf, loadTargets,
                   repoRoot, allScreens, onDiskScreens, fullTargets, BASE };
