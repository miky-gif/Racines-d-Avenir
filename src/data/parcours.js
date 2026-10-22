module.exports = {
  steps: [
    { num: '01', title: 'FORMER', icon: 'GraduationCap', text: 'Acquérir un métier grâce à des formations courtes, pratiques et professionnalisantes.', tags: ['Ateliers pratiques', 'Petits groupes', 'Formateurs du métier'], slot: 'parcours-1', photo: 'Photo — atelier de formation' },
    { num: '02', title: 'ACCOMPAGNER', icon: 'Users', text: "Stages, mentorat et appui personnalisé vers l'emploi ou la création d'activité.", tags: ['Stage en entreprise', 'Mentorat', 'CV & entretiens'], slot: 'parcours-2', photo: 'Photo — stagiaire et tuteur en entreprise' },
    { num: '03', title: 'TRANSFORMER', icon: 'Sprout', text: "Accéder à l'emploi ou développer une activité économique durable.", tags: ['Mise en relation', 'Appui à la création', 'Suivi à 6 mois'], slot: 'parcours-3', photo: 'Photo — ancien apprenant dans son activité' }
  ].map((s, i) => ({ ...s, textLeft: i % 2 === 0 })),
  temoignages: [
    { name: 'Aïcha N.', meta: 'INFORMATIQUE ET RÉSEAUX · 2025', quote: "« Après mon stage, l'entreprise m'a gardée. Aujourd'hui, je m'occupe de la maintenance informatique de trois agences. »", slot: 'temoin-1' },
    { name: 'Brice T.', meta: 'MÉCANIQUE · 2024', quote: "« J'ai appris en atelier, sur de vrais moteurs. Un an plus tard, j'ouvrais mon propre garage avec l'appui de mon mentor. »", slot: 'temoin-2' },
    { name: 'Mireille E.', meta: 'RESTAURATION · 2025', quote: "« Le mentorat m'a donné confiance. Mon service traiteur emploie aujourd'hui deux anciennes de ma promotion. »", slot: 'temoin-3' }
  ]
};
