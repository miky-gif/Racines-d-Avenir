/**
 * Référencement (SEO) : balises <head>, données structurées, sitemap, robots.
 *
 * Utilisé par scripts/build.js. Les adresses absolues dépendent de l'URL du
 * site, choisie dans cet ordre :
 *   1. variable d'environnement SITE_URL (ex. https://www.racinesdavenir.org) ;
 *   2. domaine de production détecté par Vercel (VERCEL_PROJECT_PRODUCTION_URL) ;
 *   3. champ `url` de src/data/site.js.
 *
 * Les balises sont écrites en français avec des jetons remplacés par langue
 * dans writePage() :
 *   __URL()__            adresse absolue de la page courante, dans la langue courante
 *   __URL(page.html)__   adresse absolue d'une autre page, dans la langue courante
 *   __URLFR(…)__ / __URLEN(…)__  idem, dans une langue donnée
 *   __SITE__             racine du site (pour les images)
 *   __BASE_HREF__        dossier de la langue (page 404, servie à n'importe quelle adresse)
 */
'use strict';
const fs = require('fs');
const path = require('path');

const site = require('../src/data/site.js');

const SITE_URL = (process.env.SITE_URL
  || (process.env.VERCEL_PROJECT_PRODUCTION_URL && 'https://' + process.env.VERCEL_PROJECT_PRODUCTION_URL)
  || site.url).replace(/\/+$/, '');

// Adresse publique d'une page (Vercel « cleanUrls » : sans .html)
function absUrl(file, lang) {
  const prefix = lang === 'en' ? '/en' : '';
  if (file === 'index.html') return SITE_URL + (prefix || '/');
  return SITE_URL + prefix + '/' + file.replace(/\.html$/, '');
}

const esc = v => String(v).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

/* ------------------------------------------------------------------ */
/* Données structurées (schema.org, JSON-LD)                           */
/* ------------------------------------------------------------------ */

const ADRESSE = { '@type': 'PostalAddress', addressLocality: 'Yaoundé', addressCountry: 'CM' };

function organisation() {
  const sameAs = site.reseaux.map(r => r.url).filter(u => /^https?:/.test(u) && !/wa\.me/.test(u));
  return {
    '@type': 'EducationalOrganization',
    '@id': SITE_URL + '/#organisation',
    name: site.nom,
    ...(site.sigle ? { alternateName: site.sigle } : {}),
    description: site.statut,
    url: SITE_URL + '/',
    logo: SITE_URL + '/assets/img/logo-racines-davenir.png',
    image: SITE_URL + '/assets/photos/hero-carrelage.webp',
    telephone: site.telephone,
    email: site.email,
    address: ADRESSE,
    areaServed: 'CM',
    ...(sameAs.length ? { sameAs } : {})
  };
}

function cours(f) {
  return {
    '@type': 'Course',
    name: f.label,
    description: f.accroche,
    url: `__URL(${f.url})__`,
    image: `__SITE__/assets/photos/f-${f.slug}.webp`,
    inLanguage: 'fr',
    provider: { '@type': 'EducationalOrganization', name: site.nom, url: SITE_URL + '/' },
    educationalLevel: f.cycleLabel,
    coursePrerequisites: f.prerequis,
    timeRequired: `P${f.mois}M`,
    educationalCredentialAwarded: f.cqp ? 'Certificat de qualification professionnelle' : 'Attestation de fin de formation',
    hasCourseInstance: {
      '@type': 'CourseInstance',
      courseMode: 'Onsite',
      location: { '@type': 'Place', name: site.nom, address: ADRESSE }
    }
  };
}

const fil = etapes => ({
  '@type': 'BreadcrumbList',
  itemListElement: etapes.map(([name, file], i) => ({
    '@type': 'ListItem', position: i + 1, name, ...(file ? { item: `__URL(${file})__` } : {})
  }))
});

/** Blocs JSON-LD d'une page, selon son fichier et ses données. */
function jsonLd(file, data) {
  const blocs = [organisation()];
  if (file === 'index.html') {
    blocs.push({ '@type': 'WebSite', '@id': SITE_URL + '/#site', name: site.nom, url: '__URL(index.html)__', publisher: { '@id': SITE_URL + '/#organisation' } });
  }
  if (data.f) {
    blocs.push(cours(data.f));
    blocs.push(fil([['Accueil', 'index.html'], ['Nos formations', 'nos-formations.html'], [data.f.label]]));
  }
  if (file === 'nos-formations.html' && data.list) {
    blocs.push({
      '@type': 'ItemList',
      itemListElement: data.list.map((f, i) => ({ '@type': 'ListItem', position: i + 1, url: `__URL(${f.url})__` }))
    });
  }
  return `<script type="application/ld+json">${JSON.stringify({ '@context': 'https://schema.org', '@graph': blocs })}</script>`;
}

// Champs textuels des données structurées à traduire avec le dictionnaire
const LD_TEXT = ['name', 'description', 'educationalLevel', 'coursePrerequisites', 'educationalCredentialAwarded'];

/** Traduit les textes des blocs JSON-LD d'une page (dictionnaire FR → EN). */
function translateLd(html, dict, norm) {
  const tr = v => (typeof v === 'string' ? (dict[norm(v)] ?? v) : Array.isArray(v) ? v.map(tr) : v);
  const walk = o => {
    if (Array.isArray(o)) return o.map(walk);
    if (!o || typeof o !== 'object') return o;
    const out = {};
    for (const [k, v] of Object.entries(o)) {
      const texte = typeof v === 'string' || (Array.isArray(v) && v.every(s => typeof s === 'string'));
      out[k] = LD_TEXT.includes(k) && texte ? tr(v) : walk(v);
    }
    return out;
  };
  return html.replace(/(<script type="application\/ld\+json">)([\s\S]*?)(<\/script>)/g,
    (m, a, json, c) => a + JSON.stringify(walk(JSON.parse(json))).replace(/</g, '\\u003c') + c);
}

/* ------------------------------------------------------------------ */
/* Balises <head>                                                      */
/* ------------------------------------------------------------------ */

const PARTAGE_DIR = path.join(__dirname, '..', 'src', 'assets', 'partage');

/**
 * Balises de référencement d'une page (en français, avec jetons).
 * meta : { title, description, image?, noindex? } ; data : données de la page.
 */
function headTags(file, meta, data) {
  const slug = data.f ? data.f.slug : null;
  const share = slug && fs.existsSync(path.join(PARTAGE_DIR, slug + '.jpg')) ? slug : 'racines-davenir';
  const tags = meta.noindex
    ? ['<base href="__BASE_HREF__">', '<meta name="robots" content="noindex">']
    : [
      '<link rel="canonical" href="__URL()__">',
      '<link rel="alternate" hreflang="fr" href="__URLFR()__">',
      '<link rel="alternate" hreflang="en" href="__URLEN()__">',
      '<link rel="alternate" hreflang="x-default" href="__URLFR()__">'
    ];
  tags.push(
    `<meta property="og:type" content="website">`,
    `<meta property="og:site_name" content="${esc(site.nom)}">`,
    `<meta property="og:title" content="${esc(meta.title)}">`,
    `<meta property="og:description" content="${esc(meta.description)}">`,
    `<meta property="og:url" content="__URL()__">`,
    `<meta property="og:image" content="__SITE__/assets/partage/${share}__OGSUF__.jpg">`,
    `<meta property="og:image:width" content="1200">`,
    `<meta property="og:image:height" content="630">`,
    `<meta property="og:locale" content="__OG_LOCALE__">`,
    `<meta property="og:locale:alternate" content="__OG_LOCALE_ALT__">`,
    `<meta name="twitter:card" content="summary_large_image">`
  );
  if (!meta.noindex) tags.push(jsonLd(file, data));
  return tags.join('\n');
}

/** Jetons propres au référencement, pour une page et une langue. */
function replaceTokens(html, file, lang) {
  return html
    .replace(/__URL(FR|EN)?\(([^)]*)\)__/g, (m, l, f) => absUrl(f || file, l ? l.toLowerCase() : lang))
    .replace(/__SITE__/g, SITE_URL)
    .replace(/__BASE_HREF__/g, lang === 'en' ? '/en/' : '/')
    .replace(/__OGSUF__/g, lang === 'en' ? '-en' : '')
    .replace(/__OG_LOCALE__/g, lang === 'en' ? 'en_GB' : 'fr_FR')
    .replace(/__OG_LOCALE_ALT__/g, lang === 'en' ? 'fr_FR' : 'en_GB');
}

/* ------------------------------------------------------------------ */
/* sitemap.xml et robots.txt                                           */
/* ------------------------------------------------------------------ */

function writeSitemap(dist, files) {
  const today = new Date().toISOString().slice(0, 10);
  const entry = (file, lang) => `  <url>
    <loc>${absUrl(file, lang)}</loc>
    <lastmod>${today}</lastmod>
    <xhtml:link rel="alternate" hreflang="fr" href="${absUrl(file, 'fr')}"/>
    <xhtml:link rel="alternate" hreflang="en" href="${absUrl(file, 'en')}"/>
    <xhtml:link rel="alternate" hreflang="x-default" href="${absUrl(file, 'fr')}"/>
  </url>`;
  const urls = files.flatMap(f => [entry(f, 'fr'), entry(f, 'en')]);
  fs.writeFileSync(path.join(dist, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urls.join('\n')}
</urlset>
`);
  fs.writeFileSync(path.join(dist, 'robots.txt'), `User-agent: *
Allow: /

Sitemap: ${SITE_URL}/sitemap.xml
`);
}

module.exports = { SITE_URL, absUrl, headTags, replaceTokens, translateLd, writeSitemap };
