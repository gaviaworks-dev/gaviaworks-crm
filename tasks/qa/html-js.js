#!/usr/bin/env node
/* html-js.js — HTML İÇİNDEKİ INLINE SCRIPT SÖZDİZİMİ EKSENİ (ders L-37)
 *
 * Neden var: `node --check` bir HTML dosyasını okumaz. L-37'de bir yorum
 * satırındaki `SAT-*` deseni (`*` + `/`) blok yorumunu erken kapattı, sayfa
 * `SyntaxError` ile tamamen çöktü — ve belirti "boş sayfa" değil, oturum
 * yokken gösterilen NORMAL GİRİŞ EKRANI olduğu için gözden kaçtı.
 * Bu eksen inline `<script>` bloklarını çıkarıp tek tek ayrıştırır.
 *
 * L-39 gereği `--selftest` bozulmuş kopyada koşar: hüküm gerçekten bulgu
 * üretmeden temiz koşum geçerli sayılmaz. Selftest tam L-37'nin desenini
 * kurar (`*` + `/` içeren bir yorum), yani eksen kendi doğuş sebebini yakalar.
 */
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const { repoRoot, allScreens } = require('./qa-lib');

const ROOT = repoRoot();

function bloklar(src) {
  const out = [];
  const re = /<script(?![^>]*\ssrc=)[^>]*>([\s\S]*?)<\/script>/gi;
  let m;
  while ((m = re.exec(src))) {
    /* satır numarası — bulgu dosyanın neresinde olduğunu söylemeli */
    const satir = src.slice(0, m.index).split('\n').length;
    out.push({ js: m[1], satir });
  }
  return out;
}

function tara(root, dosyalar) {
  const bulgular = [];
  let blokSayi = 0, dosyaSayi = 0;
  for (const f of dosyalar) {
    const p = path.join(root, f);
    if (!fs.existsSync(p)) continue;
    dosyaSayi++;
    for (const b of bloklar(fs.readFileSync(p, 'utf8'))) {
      blokSayi++;
      try { new vm.Script(b.js, { filename: f }); }
      catch (e) { bulgular.push({ f, satir: b.satir, msg: e.message.split('\n')[0] }); }
    }
  }
  if (!blokSayi) throw new Error('html-js: 0 inline script bloğu ölçüldü — düzenek kurulamadı (L-27)');
  return { bulgular, blokSayi, dosyaSayi };
}

function selftest() {
  const os = require('os');
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'gv-htmljs-'));
  /* L-37'nin birebir deseni: yorum içindeki yıldız+bölü blok yorumunu kapatır. */
  const yildiz = String.fromCharCode(42), boluc = String.fromCharCode(47);
  const bozuk = '<body><script>\n' +
    boluc + yildiz + ' kaynak kayda (SAT-' + yildiz + boluc + 'IZN-) hiç dokunmuyor ' + yildiz + boluc + '\n' +
    'var a = 1;\n</' + 'script></body>';
  fs.writeFileSync(path.join(tmp, 'app-bozuk.html'), bozuk);
  const saglam = '<body><script>\nvar a = 1;\n</' + 'script></body>';
  fs.writeFileSync(path.join(tmp, 'app-saglam.html'), saglam);

  const r = tara(tmp, ['app-bozuk.html', 'app-saglam.html']);
  const bozukYakalandi = r.bulgular.some(b => b.f === 'app-bozuk.html');
  const saglamTemiz = !r.bulgular.some(b => b.f === 'app-saglam.html');
  fs.rmSync(tmp, { recursive: true, force: true });

  console.log('SELFTEST — L-37 deseni kurulmuş bozuk kopya:');
  console.log('  ' + (bozukYakalandi ? '✔' : '✘') + ' bozuk dosyada bulgu üretildi');
  console.log('  ' + (saglamTemiz ? '✔' : '✘') + ' sağlam dosya temiz geçti');
  if (!bozukYakalandi || !saglamTemiz) { console.log('\nSELFTEST KALDI'); process.exit(2); }
  console.log('\nSELFTEST GEÇTİ — olumlu ve olumsuz vaka ayrıştı');
}

if (process.argv.indexOf('--selftest') !== -1) { selftest(); process.exit(0); }

const hedef = allScreens().concat(['index.html']).filter(f => fs.existsSync(path.join(ROOT, f)));
const r = tara(ROOT, hedef);
console.log('inline script sözdizimi — ölçülen dosya: ' + r.dosyaSayi + ' · blok: ' + r.blokSayi);
if (!r.bulgular.length) { console.log('\nTEMİZ — ' + r.blokSayi + ' bloğun tamamı ayrıştı'); process.exit(0); }
for (const b of r.bulgular) console.log('  · ' + b.f + ':' + b.satir + ' — ' + b.msg);
console.log('\nEKSİK — ' + r.bulgular.length + ' blok ayrıştırılamadı');
process.exit(1);
