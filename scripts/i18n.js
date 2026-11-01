/**
 * Traduction des pages générées (français → autre langue).
 *
 * Chaque texte visible et chaque attribut lisible (alt, title, aria-label,
 * placeholder, description…) est recherché tel quel dans le dictionnaire
 * src/i18n/<langue>.js. Les textes absents restent en français et sont
 * signalés à la fin de la génération.
 */
'use strict';

// Attributs dont la valeur est lue par les visiteurs ou les lecteurs d'écran
const ATTRS = ['alt', 'title', 'aria-label', 'placeholder', 'data-singular', 'data-plural', 'aria-roledescription'];

// Textes qui ne se traduisent pas (marque, chiffres, coordonnées…)
const SKIP = /^[\d\s.,:;·/+×%–—-]*$|^[\w.+-]+@[\w.-]+$|^(https?:|www\.)|^\+?\d[\d\s]+$/;

const norm = s => s.replace(/\s+/g, ' ').trim();
const decode = s => s.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'");
const encode = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const encodeAttr = s => encode(s).replace(/"/g, '&quot;');

function translatable(text) {
  // Les jetons __XXX__ sont remplacés après la traduction (sélecteur de langue)
  return /\p{L}/u.test(text) && !SKIP.test(text) && !/^__[A-Z_]+__$/.test(text);
}

/** Applique `fn(texte) → traduction | undefined` à tous les textes de la page. */
function mapStrings(html, fn) {
  const out = [];
  // Découpe en balises / textes, en laissant intacts scripts, styles et SVG
  const re = /<(script|style|svg)\b[\s\S]*?<\/\1>|<!--[\s\S]*?-->|<[^>]+>|[^<]+/gi;
  let m;
  while ((m = re.exec(html))) {
    const part = m[0];
    if (part[0] !== '<') {
      const text = norm(decode(part));
      if (!text || !translatable(text)) { out.push(part); continue; }
      const t = fn(text);
      if (t === undefined) { out.push(part); continue; }
      const lead = part.match(/^\s*/)[0], trail = part.match(/\s*$/)[0];
      out.push(lead + encode(t) + trail);
    } else if (/^<(script|style|svg|!--)/i.test(part)) {
      out.push(part);
    } else {
      out.push(part.replace(/\s([\w-]+)="([^"]*)"/g, (full, name, value) => {
        const isMeta = name === 'content' && /name="description"|property="og:(title|description)"/.test(part);
        if (!ATTRS.includes(name) && !isMeta) return full;
        const text = norm(decode(value));
        if (!text || !translatable(text)) return full;
        const t = fn(text);
        return t === undefined ? full : ` ${name}="${encodeAttr(t)}"`;
      }));
    }
  }
  return out.join('');
}

function collect(html) {
  const found = new Set();
  mapStrings(html, t => { found.add(t); return undefined; });
  return found;
}

function translate(html, dict, missing) {
  return mapStrings(html, text => {
    if (Object.prototype.hasOwnProperty.call(dict, text)) return dict[text];
    missing.add(text);
    return undefined;
  });
}

module.exports = { collect, translate, norm };
