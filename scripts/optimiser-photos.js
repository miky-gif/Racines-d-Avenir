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
  // Bannière d'accueil (paysage, personne dans la moitié droite)
  'hero-carrelage': 'Smiling Tiler Laying Floor Tiles.png',
  'hero-couture': 'Creative Sewing Studio with Colorful Fabrics.png',
  'hero-esthetique': 'Relaxing Spa Facial Treatment.png',
  'hero-comptabilite': 'Étudiante en comptabilité au travail.png',

  // Photos plein cadre du haut des autres pages (format paysage)
  'qui-hero': 'Formation pratique en électrotechnique.png',
  'form-hero': 'Atelier de formation aux métiers d’avenir.png',
  'parcours-hero': 'Atelier de couture inspirant et coloré.png',
  'part-hero': 'Poignée de main au garage automobile.png',
  'actu-une': 'Atelier de formation aux métiers d’avenir.png',

  // Formations : une photo verticale par formation (f-<slug>)
  'f-carrelage': 'Artisane posant du carrelage mural.png',
  'f-plomberie': 'Plombier concentré sous l’évier.png',
  'f-electricite': 'Électricienne inspectant un tableau électrique.png',
  'f-maconnerie': 'Maçon bâtissant un mur en briques.png',
  'f-menuiserie-metallique': 'Artisan soudant une grille décorative.png',
  'f-couture-africaine': 'Mesure en atelier de couture афricain.png',
  'f-coiffure': 'Artiste des tresses au salon.png',
  'f-esthetique': 'Manucure soignée au salon.png',
  'f-cosmetique': 'Fabrication artisanale de crème naturelle.png',
  'f-maintenance-informatique': 'Technicien informatique en pleine réparation.png',
  'f-developpement-web': 'Jeune développeur dans un espace moderne.png',
  'f-numerique-ia': 'Espace de travail organisé au bureau.png',
  'f-comptabilite': 'Étudiante en comptabilité au travail.png',
  'f-secretariat-bureautique': 'Professionnelle au téléphone au bureau.png',
  'f-restauration': 'Cheffe africaine dressant un plat traditionnel.png',
  'f-sante': 'Contrôle de tension en clinique africaine.png',

  // Accueil, Qui sommes-nous, Parcours
  'accueil-qui': 'Électricienne inspectant un tableau électrique.png',
  'qui-equipe': 'Équipe professionnelle diversifiée en plein air.png',
  'parcours-1': 'Atelier de formation aux métiers d’avenir.png',
  'parcours-2': 'Formation pratique en mécanique automobile.png',
  'parcours-3': 'Créations africaines au cœur de l’atelier.png',

  // Actualités
  'actu-1': 'Célébration des jeunes diplômés en vert.png',
  'actu-2': 'Électricienne inspectant un tableau électrique.png',
  'actu-3': 'Démonstration mécanique en atelier professionnel.png',
  'actu-4': 'Creative Sewing Studio with Colorful Fabrics.png',
  'actu-5': 'Poignée de main au garage automobile.png',
  'actu-6': 'Remise de boîtes à outils pour l’avenir.png'
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

  // Une source nommée comme l'emplacement (ex. hero-couture.png) est prise
  // automatiquement, sans avoir à compléter la table.
  for (const file of fs.readdirSync(SOURCES)) {
    const m = file.match(/^([a-z0-9-]+)\.(png|jpe?g|webp)$/i);
    if (m) AFFECTATIONS[m[1].toLowerCase()] = file;
  }

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
    // Supprime les anciennes photos qui ne correspondent plus à aucun emplacement
    for (const old of fs.readdirSync(OUT).filter(n => n.endsWith('.webp') && !AFFECTATIONS[n.slice(0, -5)])) {
      fs.unlinkSync(path.join(OUT, old));
      console.log('✖ supprimée : ' + old);
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
