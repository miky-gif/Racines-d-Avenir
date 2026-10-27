// Données du gabarit src/pages/_formation.html : une page par formation ouverte.
const { ouvertes, DOMAINES } = require('./formations');
const site = require('./site');

module.exports = {
  $pages: ouvertes.map(f => ({
    file: f.url,
    data: {
      f: {
        ...f,
        whatsapp: `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(`Bonjour, je souhaite des informations sur la formation « ${f.label} ».`)}`,
        certification: f.cqp ? 'CQP' : 'Attestation',
        certificationDetail: f.cqp ? 'Certificat de qualification professionnelle' : 'Attestation de fin de formation',
        dureeDetail: f.stage ? `dont ${f.stage} mois de stage en entreprise` : 'module intensif, compatible avec une activité',
        programme: f.modules.map(([title, weeks, items], i) => ({
          num: String(i + 1).padStart(2, '0'), title, weeks, items, open: i === 0
        }))
      },
      domaine: DOMAINES[f.dom],
      autres: ouvertes.filter(o => o.dom === f.dom && o.slug !== f.slug)
    }
  }))
};
