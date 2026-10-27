module.exports = {
  // Formes d'engagement (une ancre par engagement, utilisée depuis l'accueil)
  engagements: [
    {
      id: 'stagiaires', icon: 'Briefcase', titre: 'Accueillir des stagiaires',
      texte: "Chaque formation comprend un stage de deux à quatre mois en entreprise. En accueillant un stagiaire, vous découvrez un futur collaborateur déjà formé aux gestes de votre métier, encadré par un tuteur de votre équipe et suivi par un formateur de l'institut. Nous préparons le stage avec vous : missions, durée, objectifs et évaluation."
    },
    {
      id: 'emplois', icon: 'Handshake', titre: 'Recruter nos apprenants',
      texte: "Vous cherchez un carreleur, une coiffeuse, un électricien ou une aide-comptable ? Transmettez-nous vos offres d'emploi : nous vous présentons des profils formés et motivés, correspondant à vos besoins. Nous restons en contact avec vous pendant les premières semaines pour faciliter l'intégration."
    },
    {
      id: 'formations', icon: 'Lightbulb', titre: 'Contribuer aux formations',
      texte: "Vos professionnels peuvent intervenir comme formateurs ou membres de jury, animer une démonstration en atelier ou accueillir une visite d'entreprise. Vous pouvez aussi participer à l'actualisation des programmes, ou mettre à disposition du matériel et des consommables. Ces contributions rapprochent la formation des réalités du terrain."
    },
    {
      id: 'entrepreneurs', icon: 'Rocket', titre: 'Soutenir les jeunes entrepreneurs',
      texte: "Beaucoup d'apprenants veulent créer leur atelier, leur salon ou leur petite entreprise. L'institut les aide à construire leur projet : étude simple du marché, calcul de l'investissement de départ, recherche des premiers clients. Comme partenaire, vous pouvez parrainer un projet, devenir mentor, confier des travaux en sous-traitance ou faciliter l'accès à l'équipement et au microcrédit."
    },
    {
      id: 'fondation-don', icon: 'Gift', titre: 'Appuyer la Fondation', or: true,
      texte: "La Fondation lève les obstacles financiers qui empêchent des jeunes motivés de se former : frais de formation, outillage, transport. Vos dons, en argent ou en matériel, financent des bourses et des kits de démarrage remis aux apprenants à la fin de leur parcours."
    }
  ],

  fondation: {
    mission: "Permettre à des jeunes motivés, quels que soient leurs moyens, d'apprendre un métier et de démarrer leur vie professionnelle.",
    objectifs: ['Financer des bourses de formation', "Équiper les ateliers de l'institut", 'Fournir des kits de démarrage aux jeunes entrepreneurs', "Favoriser l'accès des femmes aux métiers techniques"],
    actions: ['Bourses attribuées selon la situation sociale et la motivation', "Remise de kits d'outillage en fin de formation", 'Collecte de dons en argent et en matériel', 'Mentorat par des professionnels bénévoles']
  },

  // Pastilles du formulaire (« Stages » présélectionné)
  types: ['Stages', 'Recrutement', 'Formation', 'Entrepreneuriat', 'Fondation'].map(label => ({ label, on: label === 'Stages' }))
};
