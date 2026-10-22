#!/usr/bin/env node
/**
 * Générateur du site statique Racines d'Avenir.
 *
 *   node scripts/build.js            → construit le site dans dist/
 *
 * Les pages (src/pages/*.html) reprennent le balisage de la maquette.
 * Le générateur :
 *   - déroule les blocs <sc-for> / <sc-if> et les expressions {{ … }}
 *     à partir des données de src/data/<page>.js ;
 *   - remplace <dc-import name="Header|Footer|Icon"> par l'en-tête, le pied
 *     de page ou l'icône SVG (Lucide, tracé bicolore comme la maquette) ;
 *   - remplace <image-slot> par la photo trouvée dans src/assets/photos/
 *     (nommée d'après l'id de l'emplacement) ou par un emplacement vide ;
 *   - convertit les attributs style-hover / style-focus en classes CSS ;
 *   - enveloppe le tout dans le gabarit HTML commun.
 */
'use strict';
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const SRC = path.join(ROOT, 'src');
const DIST = path.join(ROOT, 'dist');
const lucide = require('./vendor/lucide.min.js');

/* ------------------------------------------------------------------ */
/* Utilitaires                                                         */
/* ------------------------------------------------------------------ */

const escapeHtml = v => String(v)
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

function evaluate(expr, ctx) {
  try {
    // eslint-disable-next-line no-new-func
    return new Function('ctx', `with (ctx) { return (${expr}); }`)(ctx);
  } catch (err) {
    throw new Error(`Expression invalide {{ ${expr} }} : ${err.message}`);
  }
}

function parseAttrs(str) {
  const attrs = {};
  const re = /([\w:.-]+)(?:\s*=\s*"([^"]*)")?/g;
  let m;
  while ((m = re.exec(str))) attrs[m[1]] = m[2] === undefined ? true : m[2];
  return attrs;
}

function serializeAttrs(attrs) {
  return Object.entries(attrs)
    .filter(([, v]) => v !== false && v !== undefined && v !== null)
    .map(([k, v]) => (v === true ? ` ${k}` : ` ${k}="${v}"`))
    .join('');
}

/* ------------------------------------------------------------------ */
/* Moteur de gabarits (sous-ensemble de la syntaxe de la maquette)     */
/* ------------------------------------------------------------------ */

function findBlockEnd(html, tag, from) {
  const open = new RegExp(`<${tag}[\\s>]`, 'g');
  const close = `</${tag}>`;
  let depth = 1;
  let pos = from;
  while (depth > 0) {
    const c = html.indexOf(close, pos);
    if (c < 0) throw new Error(`<${tag}> non fermé`);
    open.lastIndex = pos;
    const o = open.exec(html);
    if (o && o.index < c) { depth++; pos = o.index + tag.length + 1; continue; }
    depth--;
    pos = c + close.length;
    if (depth === 0) return c;
  }
  return -1;
}

function interpolate(html, ctx) {
  // Attributs : booléens → attribut nu / supprimé (sauf aria-*, gardés en texte)
  html = html.replace(/\s([\w:-]+)="\{\{\s*([^}]*?)\s*\}\}"/g, (m, name, expr) => {
    const v = evaluate(expr, ctx);
    if (typeof v === 'boolean' && !name.startsWith('aria-')) return v ? ` ${name}` : '';
    return ` ${name}="${escapeHtml(v)}"`;
  });
  return html.replace(/\{\{\s*([^}]*?)\s*\}\}/g, (m, expr) => escapeHtml(evaluate(expr, ctx)));
}

function renderTemplate(html, ctx) {
  const re = /<(sc-for|sc-if)\b([^>]*)>/;
  let out = '';
  let rest = html;
  for (;;) {
    const m = re.exec(rest);
    if (!m) return out + interpolate(rest, ctx);
    out += interpolate(rest.slice(0, m.index), ctx);
    const tag = m[1];
    const attrs = parseAttrs(m[2]);
    const innerStart = m.index + m[0].length;
    const end = findBlockEnd(rest, tag, innerStart);
    const inner = rest.slice(innerStart, end);
    const expr = s => s.replace(/^\{\{\s*|\s*\}\}$/g, '');
    if (tag === 'sc-for') {
      const list = evaluate(expr(attrs.list), ctx) || [];
      list.forEach((item, i) => {
        out += renderTemplate(inner, Object.assign(Object.create(ctx), { [attrs.as]: item, $index: i }));
      });
    } else if (evaluate(expr(attrs.value), ctx)) {
      out += renderTemplate(inner, ctx);
    }
    rest = rest.slice(end + tag.length + 3);
  }
}

/* ------------------------------------------------------------------ */
/* Composants                                                          */
/* ------------------------------------------------------------------ */

function icon(attrs) {
  const name = attrs.icon || 'Sprout';
  let node = lucide.icons[name];
  if (!node) throw new Error(`Icône Lucide inconnue : ${name}`);
  if (node[0] === 'svg') node = node[2];
  const size = attrs.size || 28;
  const stroke = attrs.stroke || '#0F4D35';
  const accent = attrs.accent || '#F2B134';
  const sw = attrs.sw || 1.6;
  // Comme dans la maquette : le dernier tracé prend la couleur d'accent.
  const kids = node.map(([tag, a], i, all) => {
    const { key, ...rest } = a || {};
    const color = all.length > 1 && i === all.length - 1 ? accent : stroke;
    return `<${tag}${serializeAttrs({ ...rest, stroke: color })}/>`;
  }).join('');
  const cls = 'i i-' + name.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();
  return `<svg class="${cls}" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${stroke}" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round" style="display: block; flex-shrink: 0;" aria-hidden="true" focusable="false">${kids}</svg>`;
}

const PHOTO_DIR = path.join(SRC, 'assets', 'photos');
const PHOTO_EXT = ['.webp', '.avif', '.jpg', '.jpeg', '.png'];
const PHOTO_FOCUS = require(path.join(SRC, 'data', 'photos.js'));
const missingPhotos = new Set();
const SLOT_ICON = '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="m21 15-5-5L5 21"/></svg>';

function imageSlot(attrs) {
  const id = attrs.id;
  const caption = attrs.placeholder || '';
  const alt = caption.replace(/^(Photo plein cadre|Photo|Portrait)\s*—\s*/, '').replace(/^Logo$/, 'Logo partenaire');
  const shape = attrs.shape === 'circle' ? ' img-slot--circle' : '';
  const ext = PHOTO_EXT.find(e => fs.existsSync(path.join(PHOTO_DIR, id + e)));
  if (ext) {
    const eager = /hero|une/.test(id);
    const fit = attrs.fit === 'contain' ? ' img-slot--contain' : '';
    const focus = PHOTO_FOCUS[id] ? ` style="object-position: ${PHOTO_FOCUS[id]};"` : '';
    return `<div class="img-slot img-slot--filled${shape}${fit}"><div class="img-slot__frame"><img src="assets/photos/${id}${ext}" alt="${escapeHtml(alt)}"${eager ? ' fetchpriority="high"' : ' loading="lazy"'} decoding="async"${focus}></div></div>`;
  }
  missingPhotos.add(`${id}  —  ${caption}`);
  return `<div class="img-slot${shape}" role="img" aria-label="${escapeHtml(alt)}"><div class="img-slot__frame"></div><div class="img-slot__empty" aria-hidden="true">${SLOT_ICON}<div class="img-slot__cap">${escapeHtml(caption)}</div></div><div class="img-slot__ring"></div></div>`;
}

/* ------------------------------------------------------------------ */
/* Pseudo-états (style-hover / style-focus → classes)                  */
/* ------------------------------------------------------------------ */

const pseudoRules = new Map();
function pseudoClass(pseudo, css) {
  const key = pseudo + '|' + css;
  if (!pseudoRules.has(key)) {
    const cls = `${pseudo === 'hover' ? 'h' : 'f'}${pseudoRules.size + 1}`;
    const decls = css.split(';').map(d => d.trim()).filter(Boolean).map(d => d + ' !important').join('; ');
    pseudoRules.set(key, { cls, rule: `.${cls}:${pseudo} { ${decls}; }` });
  }
  return pseudoRules.get(key).cls;
}

function rewriteTags(html) {
  return html.replace(/<([a-z][\w-]*)(\s[^<>]*?)?(\/?)>/g, (m, tag, attrStr = '', selfClose) => {
    if (!/style-hover|style-focus|sc-camel-view-box|hint-|data-screen-label/.test(attrStr)) return m;
    const attrs = parseAttrs(attrStr);
    const classes = attrs.class ? attrs.class.split(/\s+/) : [];
    for (const pseudo of ['hover', 'focus']) {
      const k = 'style-' + pseudo;
      if (attrs[k]) { classes.push(pseudoClass(pseudo, attrs[k])); delete attrs[k]; }
    }
    if (attrs['sc-camel-view-box']) { attrs.viewBox = attrs['sc-camel-view-box']; delete attrs['sc-camel-view-box']; }
    for (const k of Object.keys(attrs)) if (k.startsWith('hint-') || k === 'data-screen-label') delete attrs[k];
    if (classes.length) {
      delete attrs.class;
      return `<${tag} class="${classes.join(' ')}"${serializeAttrs(attrs)}${selfClose}>`;
    }
    return `<${tag}${serializeAttrs(attrs)}${selfClose}>`;
  });
}

/* ------------------------------------------------------------------ */
/* Pages                                                               */
/* ------------------------------------------------------------------ */

const NAV = [
  ['accueil', 'Accueil', 'Accueil', 'index.html'],
  ['qui', 'Qui sommes-nous', 'Qui sommes-nous', 'qui-sommes-nous.html'],
  ['formations', 'Nos formations', 'Nos formations', 'nos-formations.html'],
  ['parcours', "Le parcours vers l'emploi", 'Parcours', 'parcours.html'],
  ['partenaires', 'Entreprises & partenaires', 'Entreprises', 'partenaires.html'],
  ['actualites', 'Actualités', 'Actualités', 'actualites.html'],
  ['contact', 'Contact', 'Contact', 'contact.html']
];

function readPartial(name) {
  return fs.readFileSync(path.join(SRC, 'partials', name + '.html'), 'utf8');
}

function renderComponents(html, ctx) {
  return html.replace(/<dc-import\b([^>]*)><\/dc-import>/g, (m, attrStr) => {
    const attrs = parseAttrs(attrStr);
    switch (attrs.name) {
      case 'Icon': return icon(attrs);
      case 'Header': {
        const active = attrs.active || 'accueil';
        const nav = NAV.map(([k, label, short, href], i) => ({
          label, short, href, n: String(i + 1).padStart(2, '0'), active: k === active
        }));
        return renderComponents(renderTemplate(readPartial('header'), { ...ctx, nav }), ctx);
      }
      case 'Footer': return renderComponents(renderTemplate(readPartial('footer'), ctx), ctx);
      default: throw new Error(`Composant inconnu : ${attrs.name}`);
    }
  });
}

function renderPage(file) {
  const slug = path.basename(file, '.html');
  let src = fs.readFileSync(file, 'utf8');
  const meta = {};
  src = src.replace(/^<!--([\s\S]*?)-->\s*/, (m, body) => {
    for (const line of body.split('\n')) {
      const mm = line.match(/^\s*([\w-]+):\s*(.*?)\s*$/);
      if (mm) meta[mm[1]] = mm[2];
    }
    return '';
  });
  const dataFile = path.join(SRC, 'data', slug + '.js');
  const data = fs.existsSync(dataFile) ? require(dataFile) : {};

  let html = renderTemplate(src, data);
  html = renderComponents(html, data);
  html = html.replace(/<image-slot\b([^>]*)><\/image-slot>/g, (m, a) => imageSlot(parseAttrs(a)));
  html = html.replace(/<(\/?)sc-raw-select\b/g, '<$1select').replace(/<\/input>/g, '');
  html = rewriteTags(html);

  const layout = fs.readFileSync(path.join(SRC, 'partials', 'layout.html'), 'utf8');
  return layout
    .replace('{{ title }}', () => escapeHtml(meta.title || "Racines d'Avenir"))
    .replace('{{ description }}', () => escapeHtml(meta.description || ''))
    .replace('{{ body }}', () => html.trim());
}

function copyDir(from, to) {
  fs.mkdirSync(to, { recursive: true });
  for (const entry of fs.readdirSync(from, { withFileTypes: true })) {
    if (entry.name.startsWith('.') || entry.name === 'LISEZMOI.md') continue;
    const s = path.join(from, entry.name), d = path.join(to, entry.name);
    if (entry.isDirectory()) copyDir(s, d); else fs.copyFileSync(s, d);
  }
}

function build() {
  fs.rmSync(DIST, { recursive: true, force: true });
  fs.mkdirSync(DIST, { recursive: true });
  copyDir(path.join(SRC, 'assets'), path.join(DIST, 'assets'));

  const pagesDir = path.join(SRC, 'pages');
  const pages = fs.readdirSync(pagesDir).filter(f => f.endsWith('.html'));
  for (const f of pages) {
    fs.writeFileSync(path.join(DIST, f), renderPage(path.join(pagesDir, f)));
  }

  const states = [...pseudoRules.values()].map(r => r.rule).join('\n');
  fs.writeFileSync(path.join(DIST, 'assets', 'css', 'states.css'),
    '/* Généré par scripts/build.js à partir des attributs style-hover / style-focus. */\n' + states + '\n');

  console.log(`✔ ${pages.length} pages générées dans dist/`);
  if (missingPhotos.size) {
    console.log(`ℹ ${missingPhotos.size} emplacements photo sans image (à déposer dans src/assets/photos/) :`);
    for (const p of [...missingPhotos].sort()) console.log('   · ' + p);
  }
}

build();
