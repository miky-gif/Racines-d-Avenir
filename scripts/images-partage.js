#!/usr/bin/env node
/**
 * Génère les images de partage (Open Graph, 1200 × 630) affichées quand un
 * lien du site est partagé sur WhatsApp, Facebook, LinkedIn…
 *
 *   node scripts/images-partage.js
 *
 * - Sortie : src/assets/partage/<nom>.jpg (français) et <nom>-en.jpg (anglais)
 *   · racines-davenir : image générale (accueil et autres pages)
 *   · <slug>          : une image par formation (photo, nom, durée, niveau)
 * - Rendu  : via Microsoft Edge (ou Chrome) en mode headless — aucune
 *            dépendance à installer.
 *
 * À relancer après un changement de photo, de nom ou de durée de formation.
 */
'use strict';
const fs = require('fs');
const os = require('os');
const path = require('path');
const { spawn } = require('child_process');

const ROOT = path.resolve(__dirname, '..');
const ASSETS = path.join(ROOT, 'src', 'assets');
const OUT = path.join(ASSETS, 'partage');
const BROWSERS = [
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
  'C:/Program Files/Microsoft/Edge/Application/msedge.exe',
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  '/usr/bin/google-chrome', '/usr/bin/chromium',
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
];
const sleep = ms => new Promise(r => setTimeout(r, ms));
const fileUrl = p => 'file:///' + p.replace(/\\/g, '/').split('/').map(encodeURIComponent).join('/').replace(/^([A-Za-z])%3A/, '$1:');
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;');

const site = require(path.join(ROOT, 'src', 'data', 'site.js'));
const { ouvertes } = require(path.join(ROOT, 'src', 'data', 'formations.js'));
const EN = require(path.join(ROOT, 'src', 'i18n', 'en.json'));

const TEXTES = {
  fr: { statut: site.statut, lieu: 'Yaoundé · Préinscription gratuite', titre: ['Apprenez un métier.', 'Construisez votre avenir.'],
    sous: `${ouvertes.length} formations professionnelles, du BEPC au Bac+`, mois: n => (n === 3 ? 'Module de 3 mois' : `${n} mois`) },
  en: { statut: EN[site.statut] || site.statut, lieu: 'Yaoundé · Free pre-registration', titre: ['Learn a trade.', 'Build your future.'],
    sous: `${ouvertes.length} vocational programmes, from BEPC to Bac+`, mois: n => (n === 3 ? '3-month module' : `${n} months`) }
};

// Gabarit : photo en arche à droite, texte sur fond vert à gauche
const CSS = `
*{margin:0;box-sizing:border-box}
body{width:1200px;height:630px;overflow:hidden;background:#0F4D35;font-family:Poppins,sans-serif;color:#FFFDF7;position:relative}
.deco{position:absolute;right:-90px;top:-90px;width:300px;height:300px;background:#F2B134;border-radius:0 100% 0 100%}
.photo{position:absolute;right:56px;top:56px;bottom:0;width:440px;border-radius:220px 220px 0 0;overflow:hidden;background:#CFDCCF}
.photo img{width:100%;height:100%;object-fit:cover}
.txt{position:absolute;left:64px;top:56px;bottom:56px;width:600px;display:flex;flex-direction:column}
.brand{display:flex;align-items:center;gap:16px}
.brand img{height:64px}
.brand b{display:block;font-size:24px;font-weight:700;letter-spacing:.04em}
.brand small{display:block;font-size:12px;font-weight:600;letter-spacing:.14em;color:#B9D3C2;text-transform:uppercase;margin-top:2px}
.main{margin-top:auto;margin-bottom:auto}
.kicker{font-size:16px;font-weight:600;letter-spacing:.18em;text-transform:uppercase;color:#F2B134;margin-bottom:14px}
h1{font-size:58px;line-height:1.05;font-weight:700;letter-spacing:-.02em}
h1 span{display:block;font-weight:200;color:#F2B134}
h1.long{font-size:46px}
.chips{display:flex;flex-wrap:wrap;gap:10px;margin-top:26px}
.chips span{padding:9px 18px;border-radius:999px;background:rgba(255,253,247,.12);font-size:18px;font-weight:600}
.chips span:first-child{background:#F2B134;color:#0F4D35}
.lieu{font-size:18px;font-weight:500;color:#DCE8DF}`;

function page(o) {
  return `<div class="deco"></div>
<div class="photo"><img src="${fileUrl(path.join(ASSETS, 'photos', o.photo))}" style="object-position:${o.focus || '50% 30%'}"></div>
<div class="txt">
  <div class="brand"><img src="${fileUrl(path.join(ASSETS, 'img', 'logo-arbre-clair.png'))}"><div><b>${esc(site.nom.toUpperCase())}</b><small>${esc(o.statut)}</small></div></div>
  <div class="main">
    ${o.kicker ? `<p class="kicker">${esc(o.kicker)}</p>` : ''}
    <h1 class="${o.titre[0].length + (o.titre[1] || '').length > 34 ? 'long' : ''}">${esc(o.titre[0])}${o.titre[1] ? `<span>${esc(o.titre[1])}</span>` : ''}</h1>
    <div class="chips">${o.chips.map(c => `<span>${esc(c)}</span>`).join('')}</div>
  </div>
  <p class="lieu">${esc(o.lieu)}</p>
</div>`;
}

function rendus() {
  const list = [];
  for (const lang of ['fr', 'en']) {
    const t = TEXTES[lang], sfx = lang === 'en' ? '-en' : '';
    const tr = s => (lang === 'en' ? EN[s] || s : s);
    list.push({ file: 'racines-davenir' + sfx, photo: 'hero-carrelage.webp', focus: '62% 40%', statut: t.statut, lieu: t.lieu,
      titre: t.titre, chips: [t.sous] });
    for (const f of ouvertes) {
      const label = tr(f.label);
      list.push({ file: f.slug + sfx, photo: `f-${f.slug}.webp`, statut: t.statut, lieu: t.lieu,
        kicker: tr(f.domaine), titre: [label], chips: [t.mois(f.mois), tr(f.cycleLabel), ...(f.cqp ? ['CQP'] : [])] });
    }
  }
  return list;
}

async function main() {
  const browser = BROWSERS.find(b => fs.existsSync(b));
  if (!browser) throw new Error('Edge ou Chrome introuvable.');
  fs.mkdirSync(OUT, { recursive: true });

  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'ra-partage-'));
  const tpl = path.join(tmp, 'partage.html');
  fs.writeFileSync(tpl, `<!doctype html><html><head><meta charset="utf-8"><link rel="stylesheet" href="${fileUrl(path.join(ASSETS, 'css', 'fonts.css'))}"><style>${CSS}</style></head><body></body></html>`);

  const port = 9400 + Math.floor(Math.random() * 400);
  const profile = path.join(tmp, 'profil');
  const proc = spawn(browser, ['--headless=new', '--disable-gpu', '--hide-scrollbars', '--allow-file-access-from-files',
    `--remote-debugging-port=${port}`, `--user-data-dir=${profile}`, 'about:blank'], { stdio: 'ignore' });

  try {
    let targets = [];
    for (let i = 0; i < 100 && !targets.some(t => t.type === 'page'); i++) {
      try { targets = await (await fetch(`http://127.0.0.1:${port}/json`)).json(); } catch (e) { await sleep(200); }
    }
    const ws = new WebSocket(targets.find(t => t.type === 'page').webSocketDebuggerUrl);
    await new Promise(r => ws.addEventListener('open', r));
    let id = 0;
    const pending = {};
    ws.addEventListener('message', ev => {
      const m = JSON.parse(ev.data);
      if (m.id && pending[m.id]) { pending[m.id](m); delete pending[m.id]; }
    });
    const send = (method, params = {}) => new Promise(r => { const i = ++id; pending[i] = r; ws.send(JSON.stringify({ id: i, method, params })); });
    await send('Emulation.setDeviceMetricsOverride', { width: 1200, height: 630, deviceScaleFactor: 1, mobile: false });
    await send('Page.navigate', { url: fileUrl(tpl) });
    await sleep(800);

    let total = 0;
    for (const o of rendus()) {
      if (!fs.existsSync(path.join(ASSETS, 'photos', o.photo))) { console.log(`… ${o.file}.jpg ignorée (photo ${o.photo} absente)`); continue; }
      await send('Runtime.evaluate', {
        awaitPromise: true,
        expression: `(async () => { document.body.innerHTML = ${JSON.stringify(page(o))};
          await Promise.all([...document.images].map(i => i.decode().catch(() => {}))); await document.fonts.ready; })()`
      });
      const r = await send('Page.captureScreenshot', { format: 'jpeg', quality: 82, clip: { x: 0, y: 0, width: 1200, height: 630, scale: 1 } });
      const buf = Buffer.from(r.result.data, 'base64');
      fs.writeFileSync(path.join(OUT, o.file + '.jpg'), buf);
      total += buf.length;
      console.log(`✔ ${o.file}.jpg  ${(buf.length / 1024).toFixed(0)} Ko`);
    }
    console.log(`\nPoids total : ${(total / 1048576).toFixed(1)} Mo`);
    ws.close();
  } finally {
    proc.kill();
    await sleep(500);
    try { fs.rmSync(tmp, { recursive: true, force: true }); } catch (e) { /* profil verrouillé */ }
  }
}

main().catch(err => { console.error('✖', err.message); process.exit(1); });
