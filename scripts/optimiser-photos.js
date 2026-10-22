#!/usr/bin/env node
/**
 * Convertit les photos sources (PNG/JPG lourds) en WebP optimisés, nommés
 * d'après l'emplacement qu'elles remplissent sur le site.
 *
 *   node scripts/optimiser-photos.js
 *
 * - Sources  : images-originales/  (à garder, hors de dist/)
 * - Sortie   : src/assets/photos/<emplacement>.webp
 * - Encodage : via Microsoft Edge (ou Chrome) en mode headless — aucune
 *              dépendance à installer.
 *
 * Pour changer une affectation, modifiez la table AFFECTATIONS ci-dessous
 * puis relancez ce script et `npm run build`.
 */
'use strict';
const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

const ROOT = path.resolve(__dirname, '..');
const SOURCES = path.join(ROOT, 'images-originales');
const OUT = path.join(ROOT, 'src', 'assets', 'photos');
const QUALITY = 0.8;
const MAX_HERO = 1920;   // largeur max des photos plein cadre
const MAX_OTHER = 1100;  // plus grand côté des autres photos

// emplacement → fichier source
const AFFECTATIONS = {
  // Photos plein cadre du haut de page
  'accueil-hero': 'Mécanicienne camerounaise au garage.png',
  'qui-hero': 'Formation pratique en électrotechnique.png',
  'form-hero': 'Apprentissage du bois en atelier.png',
  'parcours-hero': 'Boutique artisanale chaleureuse et accueillante.png',
  'part-hero': 'Poignée de main au garage automobile.png',
  'actu-une': 'Accueil chaleureux au centre de formation.png',

  // Accueil
  'accueil-qui': 'Démonstration mécanique en atelier professionnel.png',
  'rail-1': 'Focused Technician Repairing an Open Desktop PC.png',
  'rail-2': 'Focused Student Balancing Books and Numbers.png',
  'rail-3': 'Infirmier manipulant un stéthoscope.png',
  'rail-4': 'Sourire et service en boutique.png',
  'rail-5': 'Classement chaleureux au bureau.png',
  'rail-6': 'Tressage de cheveux au salon.png',
  'rail-7': 'Chef en pleine création culinaire.png',
  'rail-8': 'Maçon souriant construisant un mur en briques.png',
  'rail-9': 'Jeune mécanicien réparant un moteurensor.png',
  'rail-10': 'Apprenti menuisier assemblant une chaise.png',

  // Nos formations
  'fil-1': 'Technicien crimpant un câble Ethernet.png',
  'fil-2': 'Comptabilité sur bureau professionnel.png',
  'fil-3': 'Infirmier manipulant un stéthoscope.png',
  'fil-4': 'Transaction chaleureuse au comptoir du magasin.png',
  'fil-5': 'Espace de travail organisé au bureau.png',
  'fil-6': 'Tressage de cheveux au salon.png',
  'fil-7': 'Chef en pleine création culinaire.png',
  'fil-8': 'Maçon posant des briques rouges.png',
  'fil-9': 'Mécanicien réparant un moteur automobile.png',
  'fil-10': 'Ponçage artisanal d’une planche en bois.png',

  // Qui sommes-nous
  'qui-equipe': 'Équipe souriante devant le centre de formation.png',

  // Parcours
  'parcours-1': 'Formation pratique en électrotechnique.png',
  'parcours-2': 'Formation pratique en mécanique automobile.png',
  'parcours-3': 'Échange chaleureux au garage automobile.png',

  // Actualités
  'actu-2': 'Mécanicienne camerounaise au garage.png',
  'actu-3': 'Formation pratique en électrotechnique.png',
  'actu-4': 'Apprentissage du bois en atelier.png',
  'actu-5': 'Poignée de main au garage automobile.png'
};

const BROWSERS = [
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
  'C:/Program Files/Microsoft/Edge/Application/msedge.exe',
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/usr/bin/google-chrome',
  '/usr/bin/chromium'
];

const sleep = ms => new Promise(r => setTimeout(r, ms));

async function main() {
  const browser = BROWSERS.find(b => fs.existsSync(b));
  if (!browser) throw new Error('Edge ou Chrome introuvable.');
  fs.mkdirSync(OUT, { recursive: true });

  const missing = Object.values(AFFECTATIONS).filter(f => !fs.existsSync(path.join(SOURCES, f)));
  if (missing.length) throw new Error('Sources manquantes :\n  ' + [...new Set(missing)].join('\n  '));

  const port = 9400 + Math.floor(Math.random() * 400);
  const profile = fs.mkdtempSync(path.join(require('os').tmpdir(), 'ra-photos-'));
  const proc = spawn(browser, ['--headless=new', '--disable-gpu', `--remote-debugging-port=${port}`, `--user-data-dir=${profile}`, 'about:blank'], { stdio: 'ignore' });

  try {
    let targets = [];
    for (let i = 0; i < 60 && !targets.some(t => t.type === 'page'); i++) {
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
    const evaluate = expression => new Promise((resolve, reject) => {
      const i = ++id;
      pending[i] = m => (m.result && m.result.exceptionDetails ? reject(new Error(m.result.exceptionDetails.text)) : resolve(m.result.result.value));
      ws.send(JSON.stringify({ id: i, method: 'Runtime.evaluate', params: { expression, awaitPromise: true, returnByValue: true } }));
    });

    let before = 0, after = 0;
    for (const [slot, file] of Object.entries(AFFECTATIONS)) {
      const buf = fs.readFileSync(path.join(SOURCES, file));
      const mime = /\.jpe?g$/i.test(file) ? 'image/jpeg' : 'image/png';
      const max = /hero|une/.test(slot) ? MAX_HERO : MAX_OTHER;
      const isHero = /hero|une/.test(slot);
      const b64 = await evaluate(`(async () => {
        const img = new Image();
        img.src = 'data:${mime};base64,${buf.toString('base64')}';
        await img.decode();
        const ratio = ${isHero} ? Math.min(1, ${max} / img.naturalWidth) : Math.min(1, ${max} / Math.max(img.naturalWidth, img.naturalHeight));
        const c = document.createElement('canvas');
        c.width = Math.round(img.naturalWidth * ratio);
        c.height = Math.round(img.naturalHeight * ratio);
        const ctx = c.getContext('2d');
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0, c.width, c.height);
        return c.toDataURL('image/webp', ${QUALITY}).split(',')[1];
      })()`);
      const out = Buffer.from(b64, 'base64');
      fs.writeFileSync(path.join(OUT, slot + '.webp'), out);
      before += buf.length; after += out.length;
      console.log(`✔ ${slot}.webp  ${(out.length / 1024).toFixed(0)} Ko  ← ${file}`);
    }
    console.log(`\nPoids total : ${(before / 1048576).toFixed(1)} Mo → ${(after / 1048576).toFixed(1)} Mo`);
    ws.close();
  } finally {
    proc.kill();
    await sleep(500);
    try { fs.rmSync(profile, { recursive: true, force: true }); } catch (e) { /* profil verrouillé */ }
  }
}

main().catch(err => { console.error('✖', err.message); process.exit(1); });
