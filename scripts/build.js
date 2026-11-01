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

// Icônes de marque absentes de Lucide (tracé plein)
const BRAND_ICONS = {
  WhatsApp: 'M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z'
};

function icon(attrs) {
  const name = attrs.icon || 'Sprout';
  if (BRAND_ICONS[name]) {
    const size = attrs.size || 28;
    return `<svg class="i i-${name.toLowerCase()}" width="${size}" height="${size}" viewBox="0 0 24 24" fill="${attrs.fill || attrs.stroke || '#0F4D35'}" style="display: block; flex-shrink: 0;" aria-hidden="true" focusable="false"><path d="${BRAND_ICONS[name]}"/></svg>`;
  }
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

/* Logo : pousse à deux feuilles, bourgeon or et racines */
function logo(attrs) {
  // Arbre du logo officiel (logo.png), en vert foncé ou en crème (variant="light")
  const light = attrs.variant === 'light';
  const h = Number(attrs.size || 42);
  const w = Math.round(h * 132 / 161);
  return `<img class="logo-mark" src="assets/img/logo-arbre${light ? '-clair' : ''}.png" alt="" width="${w}" height="${h}" style="display: block; flex-shrink: 0; width: ${w}px; height: ${h}px;">`;
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
  const findExt = name => PHOTO_EXT.find(e => fs.existsSync(path.join(PHOTO_DIR, name + e)));
  // Photo dédiée, sinon photo provisoire (attribut fallback) en attendant
  let file = id, ext = findExt(id), focusValue = PHOTO_FOCUS[id];
  if (!ext && attrs.fallback && (ext = findExt(attrs.fallback))) {
    file = attrs.fallback;
    focusValue = attrs['fallback-focus'] || PHOTO_FOCUS[attrs.fallback];
    if (![...missingPhotos].some(p => p.startsWith(id + ' '))) missingPhotos.add(`${id}  —  ${caption}  (photo provisoire : ${attrs.fallback})`);
  }
  if (ext) {
    const priority = attrs.priority || (/hero|une/.test(id) ? 'high' : 'lazy');
    const loading = priority === 'high' ? ' fetchpriority="high"' : priority === 'lazy' ? ' loading="lazy"' : '';
    const fit = attrs.fit === 'contain' ? ' img-slot--contain' : '';
    const focus = focusValue ? ` style="object-position: ${focusValue};"` : '';
    return `<div class="img-slot img-slot--filled${shape}${fit}"><div class="img-slot__frame"><img src="assets/photos/${file}${ext}" alt="${escapeHtml(alt)}"${loading} decoding="async"${focus}></div></div>`;
  }
  if (![...missingPhotos].some(p => p.startsWith(id + " "))) missingPhotos.add(`${id}  —  ${caption}`);
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
      case 'Logo': return logo(attrs);
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

// Données communes à toutes les pages (et aux en-tête / pied de page)
const GLOBALS = {
  site: require(path.join(SRC, 'data', 'site.js')),
  catalogue: require(path.join(SRC, 'data', 'formations.js'))
};

// Remplace les {{ … }} d'un texte brut (titre, description), sans échappement
const fillText = (str, ctx) => String(str).replace(/\{\{\s*([^}]*?)\s*\}\}/g, (m, e) => evaluate(e, ctx));

function renderPage(file, pageData, outFile) {
  let src = fs.readFileSync(file, 'utf8');
  const meta = {};
  src = src.replace(/^<!--([\s\S]*?)-->\s*/, (m, body) => {
    for (const line of body.split('\n')) {
      const mm = line.match(/^\s*([\w-]+):\s*(.*?)\s*$/);
      if (mm) meta[mm[1]] = mm[2];
    }
    return '';
  });
  const data = { ...GLOBALS, ...pageData };
  meta.title = fillText(meta.title || '', data);
  meta.description = fillText(meta.description || '', data);

  let html = renderTemplate(src, data);
  html = renderComponents(html, data);
  html = html.replace(/<image-slot\b([^>]*)><\/image-slot>/g, (m, a) => imageSlot(parseAttrs(a)));
  html = html.replace(/<(\/?)sc-raw-select\b/g, '<$1select').replace(/<\/input>/g, '');
  html = rewriteTags(html);

  const layout = fs.readFileSync(path.join(SRC, 'partials', 'layout.html'), 'utf8');
  return layout
    .replace('{{ title }}', () => escapeHtml(meta.title || "Racines d'Avenir"))
    .replace('{{ description }}', () => escapeHtml(meta.description || ''))
    .replace('{{ seo }}', () => seo.headTags(outFile, meta, data))
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

/* ------------------------------------------------------------------ */
/* Langues : chaque page est écrite en français puis traduite          */
/* (dictionnaire src/i18n/en.json) dans dist/en/                       */
/* ------------------------------------------------------------------ */

const i18n = require('./i18n.js');
const seo = require('./seo.js');
const LANGS = { en: require(path.join(SRC, 'i18n', 'en.json')) };
const WHATSAPP_EN = "Hello Racines d'Avenir, I would like some information about your programmes.";
const missingI18n = new Map();

function writePage(file, html) {
  for (const lang of ['fr', 'en']) {
    const isEn = lang === 'en';
    let out = html;
    if (isEn) {
      const missing = new Set();
      out = i18n.translate(out, LANGS.en, missing)
        .replace(/(src|href)="assets\//g, '$1="../assets/')
        .replace(/(https:\/\/wa\.me\/\d+\?text=)[^"]*/g, '$1' + encodeURIComponent(WHATSAPP_EN));
      out = seo.translateLd(out, LANGS.en, i18n.norm);
      missing.forEach(t => { if (!missingI18n.has(t)) missingI18n.set(t, file); });
    }
    const other = isEn ? '../' + file : 'en/' + file;
    const tokens = {
      __LANG__: lang,
      __HREF_FR__: isEn ? '../' + file : file,
      __HREF_EN__: isEn ? file : 'en/' + file,
      __CUR_FR__: isEn ? 'false' : 'true',
      __CUR_EN__: isEn ? 'true' : 'false',
      __CUR_FLAG__: isEn ? 'flag-en' : 'flag-fr',
      __CUR_CODE__: isEn ? 'EN' : 'FR',
      __NAME_FR__: 'Français',
      __NAME_EN__: 'English',
      __LANG_LABEL__: isEn ? 'Language: English. Choose language' : 'Langue : français. Choisir la langue',
      __OTHER_HREF__: other,
      __OTHER_LANG__: isEn ? 'fr' : 'en',
      __OTHER_CODE__: isEn ? 'FR' : 'EN',
      __OTHER_FLAG__: isEn ? 'flag-fr' : 'flag-en',
      __OTHER_LABEL__: isEn ? 'Version française' : 'English version'
    };
    out = seo.replaceTokens(out, file, lang);
    out = out.replace(/__[A-Z_]+__/g, t => (t in tokens ? tokens[t] : t));
    const dest = path.join(DIST, isEn ? 'en' : '', file);
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    fs.writeFileSync(dest, out);
  }
}

function build() {
  fs.rmSync(DIST, { recursive: true, force: true });
  fs.mkdirSync(DIST, { recursive: true });
  copyDir(path.join(SRC, 'assets'), path.join(DIST, 'assets'));

  const pagesDir = path.join(SRC, 'pages');
  const dataFor = name => {
    const file = path.join(SRC, 'data', name + '.js');
    return fs.existsSync(file) ? require(file) : {};
  };
  let count = 0;
  const indexables = [];
  for (const f of fs.readdirSync(pagesDir).filter(n => n.endsWith('.html'))) {
    const name = path.basename(f, '.html');
    if (name.startsWith('_')) {
      // Gabarit : une page générée par entrée de $pages (src/data/_<nom>.js)
      for (const page of dataFor(name).$pages || []) {
        writePage(page.file, renderPage(path.join(pagesDir, f), page.data, page.file));
        indexables.push(page.file);
        count++;
      }
    } else {
      writePage(f, renderPage(path.join(pagesDir, f), dataFor(name), f));
      if (name !== '404') indexables.push(f);
      count++;
    }
  }

  seo.writeSitemap(DIST, indexables);

  const states = [...pseudoRules.values()].map(r => r.rule).join('\n');
  fs.writeFileSync(path.join(DIST, 'assets', 'css', 'states.css'),
    '/* Généré par scripts/build.js à partir des attributs style-hover / style-focus. */\n' + states + '\n');

  console.log(`✔ ${count} pages générées dans dist/ (français) et dist/en/ (anglais)`);
  console.log(`✔ sitemap.xml et robots.txt — adresse du site : ${seo.SITE_URL}`);
  if (missingI18n.size) {
    console.log(`ℹ ${missingI18n.size} textes sans traduction anglaise (à ajouter dans src/i18n/en.json) :`);
    for (const [t, file] of missingI18n) console.log(`   · ${JSON.stringify(t)}  (${file})`);
  }
  if (missingPhotos.size) {
    console.log(`ℹ ${missingPhotos.size} emplacements photo sans image (à déposer dans src/assets/photos/) :`);
    for (const p of [...missingPhotos].sort()) console.log('   · ' + p);
  }
}

build();
