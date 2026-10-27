// Informations générales de l'institut, utilisées sur toutes les pages.
// ⚠️ Les valeurs marquées « À CONFIRMER » sont provisoires : voir
// docs/validation-client.md.
module.exports = {
  nom: "Racines d'Avenir",
  statut: 'Institut de formation professionnelle',
  // Sigle officiel (ex. « NIFP ») — laisser vide tant qu'il n'est pas validé.
  sigle: '', // À CONFIRMER

  // Coordonnées — À CONFIRMER
  telephone: '+237 6 12 34 56 78',
  telephoneLien: '+237612345678',
  whatsapp: '237612345678', // format international sans « + » ni espaces
  whatsappMessage: "Bonjour Racines d'Avenir, je souhaite des informations sur vos formations.",
  email: 'contact@racinesdavenir.org',
  web: 'www.racinesdavenir.org',
  ville: 'Yaoundé, Cameroun',
  adresse: 'Yaoundé, Cameroun', // adresse précise (quartier, repère) — À CONFIRMER
  carte: 'Yaoundé, Cameroun', // recherche Google Maps pour la carte

  // Horaires d'ouverture — À CONFIRMER
  horaires: [
    ['Lundi – jeudi', '8 h – 17 h'],
    ['Vendredi', '8 h – 16 h'],
    ['Samedi', '8 h – 13 h'],
    ['Dimanche', 'Fermé']
  ],

  // Réseaux sociaux — remplacer « # » par les vraies adresses (À CONFIRMER)
  reseaux: [
    { nom: 'WhatsApp', icone: 'WhatsApp', url: '' }, // rempli automatiquement depuis le numéro WhatsApp
    { nom: 'Facebook', icone: 'Facebook', url: '#' },
    { nom: 'Instagram', icone: 'Instagram', url: '#' },
    { nom: 'YouTube', icone: 'Youtube', url: '#' },
    { nom: 'LinkedIn', icone: 'Linkedin', url: '#' }
  ],

  rentree: 'janvier 2027' // À CONFIRMER
};

const s = module.exports;
s.whatsappLien = `https://wa.me/${s.whatsapp}?text=${encodeURIComponent(s.whatsappMessage)}`;
s.reseaux.forEach(r => { if (r.icone === 'WhatsApp') r.url = s.whatsappLien; });
s.nomComplet = s.sigle ? `${s.nom} — ${s.statut} (${s.sigle})` : `${s.nom} — ${s.statut}`;
