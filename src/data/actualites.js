// ⚠️ Articles d'exemple issus de la maquette : à remplacer par de vraies actualités.
module.exports = {
  cats: ['Tout', 'Événements', 'Partenariats', 'Réussites'],
  articles: [
    { cat: 'Réussites', date: '02.10.2026', title: 'La promotion 2026 reçoit ses attestations', excerpt: "Les apprenants de la promotion 2026 ont été félicités en présence de leurs familles et des entreprises d'accueil.", photo: 'Photo — remise des attestations' },
    { cat: 'Partenariats', date: '18.09.2026', title: "Un atelier d'électricité entièrement équipé", excerpt: "Grâce au soutien de nos partenaires, les apprenants s'exercent désormais sur des tableaux électriques et des kits solaires récents.", photo: "Photo — nouvel atelier d'électricité" },
    { cat: 'Événements', date: '05.09.2026', title: 'Portes ouvertes : venez essayer nos ateliers', excerpt: 'Une journée pour découvrir les métiers, rencontrer les formateurs et poser vos questions.', photo: 'Photo — visiteurs en atelier' },
    { cat: 'Réussites', date: '22.08.2026', title: "De l'atelier de couture à sa propre entreprise", excerpt: 'Deux ans après sa formation, Grâce emploie trois couturières dans son atelier de Nkolbisson.', photo: 'Photo — ancienne apprenante dans son atelier de couture' },
    { cat: 'Événements', date: '10.07.2026', title: 'Forum emploi : les entreprises à la rencontre des apprenants', excerpt: "Entretiens, conseils CV et offres de stage : retour sur une matinée bien remplie.", photo: 'Photo — forum emploi' },
    { cat: 'Partenariats', date: '28.06.2026', title: 'Bourses de la Fondation : des jeunes accompagnés', excerpt: 'Frais de formation, outillage et transport pris en charge pour les apprenants les plus motivés.', photo: 'Photo — boursiers de la Fondation' }
  ].map((a, i) => ({ ...a, slot: 'actu-' + (i + 1) }))
};
