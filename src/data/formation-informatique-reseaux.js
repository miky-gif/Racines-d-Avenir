module.exports = {
  modules: [
    ["Bases de l'informatique et bureautique", '4 SEMAINES', ["Matériel, composants et systèmes d'exploitation", 'Traitement de texte, tableur, messagerie', 'Organisation et gestion des fichiers']],
    ['Maintenance matérielle', '4 SEMAINES', ['Diagnostic de pannes courantes', "Montage et démontage d'un poste", 'Installation de logiciels et de pilotes']],
    ['Réseaux locaux', '5 SEMAINES', ['Câblage, sertissage et tests', 'Adressage IP et partage de ressources', "Configuration d'un routeur et d'un réseau Wi-Fi"]],
    ['Sécurité et sauvegarde', '3 SEMAINES', ['Antivirus, pare-feu et mises à jour', 'Stratégies de sauvegarde', 'Bonnes pratiques pour les utilisateurs']],
    ['Stage et projet professionnel', '8 SEMAINES', ['Stage en entreprise partenaire', 'CV, lettre et préparation aux entretiens', "Initiation à la création d'activité"]]
  ].map(([title, weeks, items], i) => ({
    num: String(i + 1).padStart(2, '0'),
    title, weeks, items,
    open: i === 0 // le premier module est ouvert par défaut
  }))
};
