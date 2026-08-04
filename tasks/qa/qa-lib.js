/* qa-lib.js — tarama script'lerinin ORTAK doğrulama katmanı (ders L-17).
 *
 * İki iş yapar:
 *   1. expand(arg)  — hedef listesini üretir. Argüman verilmezse `rec.js`'in
 *      doğruladığı `qa-targets.json` okunur; böylece detay/form ekranı asla
 *      `?id=` olmadan taranmaz.
 *   2. recCheck(page, target) — hedef `?id=` taşıyorsa kaydın GERÇEKTEN
 *      yüklendiğini ölçer. Yüklenmediyse tarama o ekran için GEÇERSİZDİR;
 *      "TEMİZ" demek yerine hata sayılır.
 *
 * Kural (L-17): bir aracın "temiz" demesi doğru şeyi ölçtüğü anlamına gelmez.
 */
const fs = require('fs');
const path = require('path');

const TARGETS = path.join(__dirname, 'qa-targets.json');

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

module.exports = { expand, recCheck, idOf, loadTargets };
