module.exports = {
  cats: ['Tout', 'Rentrées', 'Événements', 'Partenariats', 'Réussites'],
  articles: [
    { cat: 'Réussites', date: '02.10.2026', title: 'La promotion 2026 reçoit ses attestations', excerpt: "Cent quarante apprenants ont été félicités en présence de leurs familles et des entreprises d'accueil.", photo: 'Photo — remise des attestations' },
    { cat: 'Partenariats', date: '18.09.2026', title: 'Un atelier mécanique entièrement rééquipé', excerpt: 'Grâce au soutien de nos partenaires, les apprenants travaillent désormais sur des moteurs récents.', photo: 'Photo — nouvel atelier mécanique' },
    { cat: 'Événements', date: '05.09.2026', title: 'Portes ouvertes : venez essayer nos ateliers', excerpt: 'Une journée pour découvrir les métiers, rencontrer les formateurs et poser vos questions.', photo: 'Photo — visiteurs en atelier' },
    { cat: 'Réussites', date: '22.08.2026', title: "De l'atelier menuiserie à sa propre entreprise", excerpt: 'Deux ans après sa formation, Paul emploie trois personnes dans son atelier de Nkolbisson.', photo: 'Photo — ancien apprenant dans son atelier' },
    { cat: 'Événements', date: '10.07.2026', title: 'Forum emploi : 25 entreprises à la rencontre des apprenants', excerpt: 'Entretiens, conseils CV et offres de stage : retour sur une matinée bien remplie.', photo: 'Photo — forum emploi' },
    { cat: 'Partenariats', date: '28.06.2026', title: 'Bourses de la Fondation : 40 jeunes accompagnés', excerpt: 'Frais de formation, outillage et transport pris en charge pour les apprenants les plus motivés.', photo: 'Photo — boursiers de la Fondation' }
  ].map((a, i) => ({ ...a, slot: 'actu-' + (i + 1) }))
};
