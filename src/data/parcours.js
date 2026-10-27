module.exports = {
  steps: [
    { id: 'former', num: '01', title: 'FORMER', icon: 'GraduationCap', text: 'Apprendre un métier en six mois à un an, par la pratique en atelier, avec des formateurs issus du métier.', tags: ['Ateliers pratiques', 'Petits groupes', 'Formateurs du métier'], slot: 'parcours-1', photo: 'Photo — formateur et apprenants en atelier' },
    { id: 'accompagner', num: '02', title: 'ACCOMPAGNER', icon: 'Users', text: "Stage en entreprise, tutorat et appui personnalisé pour préparer l'emploi ou la création d'activité.", tags: ['Stage en entreprise', 'Tutorat', 'CV & entretiens'], slot: 'parcours-2', photo: 'Photo — stagiaire et tuteur en entreprise' },
    { id: 'transformer', num: '03', title: 'TRANSFORMER', icon: 'Sprout', text: "Décrocher un emploi ou créer son activité : atelier de couture, salon de coiffure, entreprise du bâtiment.", tags: ['Mise en relation', 'Appui à la création', 'Suivi après la sortie'], slot: 'parcours-3', photo: 'Photo — ancienne apprenante dans son propre atelier de couture' }
  ].map((s, i) => ({ ...s, textLeft: i % 2 === 0 })),

  // Accompagnement concret (section #accompagnement)
  accompagnement: [
    { icon: 'ClipboardList', titre: 'Orientation', texte: "Un test d'orientation et un entretien à l'entrée pour choisir la formation adaptée à son niveau et à son projet." },
    { icon: 'UserCheck', titre: 'Formateur référent', texte: 'Un formateur suit chaque apprenant pendant toute la formation et fait régulièrement le point sur ses progrès.' },
    { icon: 'Briefcase', titre: 'Stage encadré', texte: "Un stage dans une entreprise partenaire, avec un tuteur sur place et des visites de suivi de l'institut." },
    { icon: 'FileText', titre: "Préparation à l'emploi", texte: 'Ateliers CV, simulations d’entretien et mise en relation avec les entreprises qui recrutent.' },
    { icon: 'Rocket', titre: 'Appui à la création', texte: "Étude du projet, calcul de l'investissement de départ, recherche des premiers clients et orientation vers les solutions de financement." },
    { icon: 'CalendarCheck', titre: 'Suivi après la sortie', texte: "Nous gardons le contact avec les anciens apprenants pour les épauler pendant leurs premiers mois d'activité." }
  ],

  // Parcours types (exemples illustratifs)
  trajectoires: [
    {
      icon: 'Shirt', metier: 'Couture africaine', but: 'Ouvrir son atelier de couture', fond: '#0F4D35',
      etapes: [['Mois 1 à 9', 'Formation en atelier : patronage, coupe, confection'], ['Mois 10 à 12', 'Stage chez un couturier partenaire'], ['Après', 'Première machine, premières clientes, commandes sur WhatsApp']]
    },
    {
      icon: 'Scissors', metier: 'Coiffure', but: 'Lancer son salon de coiffure', fond: '#4E7F68',
      etapes: [['Mois 1 à 6', 'Formation : tresses, tissages, soins'], ['Mois 7 à 9', 'Stage dans un salon de Yaoundé'], ['Après', 'Prestations à domicile, puis ouverture de son salon']]
    },
    {
      icon: 'Zap', metier: 'Électricité du bâtiment', but: 'Rejoindre une entreprise', fond: '#253A30',
      etapes: [['Mois 1 à 9', 'Formation : installations, tableaux, solaire'], ['Mois 10 à 12', 'Stage dans une entreprise du bâtiment'], ['Après', "Embauche dans l'entreprise de stage"]]
    }
  ],

  // ⚠️ Témoignages d'illustration : à remplacer par de vrais témoignages
  temoignages: [
    { name: 'Aïcha N.', meta: 'COUTURE AFRICAINE · 2025', quote: "« Pendant mon stage, j'ai appris à gérer les commandes. Aujourd'hui, j'ai ma propre machine et mes clientes viennent de tout le quartier. »", slot: 'temoin-1' },
    { name: 'Brice T.', meta: 'ÉLECTRICITÉ DU BÂTIMENT · 2024', quote: "« J'ai appris sur de vraies installations. L'entreprise où j'ai fait mon stage m'a embauché à la fin de la formation. »", slot: 'temoin-2' },
    { name: 'Mireille E.', meta: 'COIFFURE · 2025', quote: "« J'ai commencé par coiffer à domicile. Avec l'appui de l'institut, j'ai ouvert mon petit salon un an après ma formation. »", slot: 'temoin-3' }
  ]
};
