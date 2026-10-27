// Catalogue des formations de l'institut.
//
// ⚠️ Durées, niveaux d'entrée, CQP et programmes sont des PROPOSITIONS à
// faire valider par les responsables pédagogiques (docs/validation-client.md).
//
// Champs :
//   slug        identifiant (page formation-<slug>.html, photo f-<slug>)
//   dom         domaine : btp | mode | services | numerique
//   mois        durée totale, stage compris (3 = module de perfectionnement)
//   stage       durée du stage en mois
//   niv         niveau d'entrée minimum
//   cqp         true si la formation prépare au Certificat de qualification professionnelle
//   statut      'prioritaire' (ouverte) ou 'etude' (à l'étude)
//   modules     [intitulé, durée, [contenus]]

const DOMAINES = {
  btp: 'BTP & techniques',
  mode: 'Couture & beauté',
  services: 'Services & gestion',
  numerique: 'Numérique & IA'
};

const FORMATIONS = [
  /* ---------------------------------------------------------------- */
  /* Couture & beauté                                                  */
  /* ---------------------------------------------------------------- */
  {
    slug: 'esthetique', label: 'Esthétique et soins du corps', titre: ['Esthétique', 'et soins du corps.'],
    icon: 'Sparkles', dom: 'mode', mois: 9, stage: 3, niv: 'BEPC', cqp: true,
    accroche: 'Soins du visage et du corps, épilation, onglerie, maquillage.',
    metier: "L'esthéticien(ne) réalise soins du visage et du corps, épilations, manucures, pédicures et maquillages. Il ou elle conseille chaque client selon son type de peau et contribue à son bien-être, dans un secteur de la beauté en pleine croissance.",
    objectifs: ['Analyser la peau et proposer un soin adapté', 'Réaliser soins du visage, du corps et épilations', 'Pratiquer manucure, pédicure et pose d’ongles', 'Réaliser maquillages de jour et de cérémonie'],
    competences: ['Anatomie et analyse de peau', 'Soins du visage et massages', 'Techniques d’épilation', 'Manucure, pédicure et onglerie', 'Maquillage', 'Hygiène, accueil et conseil'],
    activites: ['Soins en institut de beauté ou spa', 'Onglerie et beauté des mains', 'Maquillage pour mariages et événements', 'Conseil et vente de produits'],
    equipements: ['Tables et cabines de soins', 'Vapozone et loupe', 'Matériel d’épilation', 'Postes de manucure', 'Mallettes de maquillage', 'Stérilisateur'],
    modules: [
      ['Hygiène, anatomie et analyse de peau', '5 SEMAINES', ['Règles d’hygiène et de stérilisation', 'Anatomie de la peau', 'Diagnostic et fiche client']],
      ['Soins du visage et du corps', '8 SEMAINES', ['Nettoyage de peau et masques', 'Gommages et enveloppements', 'Techniques de massage']],
      ['Épilation, mains et pieds', '7 SEMAINES', ['Épilation à la cire', 'Manucure et pédicure', 'Pose et entretien d’ongles']],
      ['Maquillage et relation client', '6 SEMAINES', ['Maquillage de jour et de cérémonie', 'Accueil et conseil', 'Vente de produits']],
      ['Stage en institut', '13 SEMAINES', ['Stage dans un institut ou un spa partenaire', 'Suivi par un tuteur', 'Bilan et préparation à l’emploi']]
    ],
    debouches: ['Esthéticien(ne) en institut ou spa', 'Technicien(ne) en soins esthétiques', 'Prothésiste ongulaire', 'Maquilleur(se) événementiel'],
    entreprendre: "Cabine à domicile, onglerie, maquillage pour les mariages : l'esthétique offre plusieurs façons de lancer son activité avec un investissement progressif. L'institut accompagne les apprenants dans le choix de leurs premières prestations, de leur matériel et de leurs tarifs.",
    numerique: "Réservation en ligne, réseaux sociaux pour montrer ses réalisations, applications d'analyse de peau : le numérique aide l'esthéticienne à se démarquer et à remplir son agenda.",
    prerequis: ['BEPC ou niveau équivalent', '16 ans minimum', 'Sens du contact et de l’hygiène', 'Entretien de motivation']
  },
  {
    slug: 'coiffure', label: 'Coiffure et coiffures africaines', titre: ['Coiffure', 'et coiffures africaines.'],
    icon: 'Scissors', dom: 'mode', mois: 9, stage: 3, niv: 'Sans diplôme', cqp: true,
    accroche: 'Tresses, nattes, tissages, locks, coupes et soins capillaires.',
    metier: "Le coiffeur ou la coiffeuse réalise coupes, tresses, nattes, tissages, défrisages et soins capillaires. La coiffure africaine — tresses, locks, coiffures protectrices — est un savoir-faire recherché, sur le continent comme dans la diaspora.",
    objectifs: ['Diagnostiquer le cuir chevelu et le type de cheveux', 'Réaliser tresses, nattes, tissages et locks', 'Effectuer soins, défrisages et colorations en sécurité', 'Accueillir, conseiller et fidéliser la clientèle'],
    competences: ['Hygiène et diagnostic capillaire', 'Tresses et nattes collées', 'Tissages et perruques', 'Coupes homme et femme', 'Soins, défrisage et coloration', 'Accueil et vente de produits'],
    activites: ['Coiffure en salon', 'Prestations à domicile et pour les événements', 'Pose de perruques et de tissages', 'Conseil et vente de produits capillaires'],
    equipements: ['Postes de coiffage', 'Bacs à shampoing', 'Sèche-cheveux et casques', 'Tondeuses et ciseaux', 'Têtes d’entraînement', 'Produits professionnels'],
    modules: [
      ['Hygiène, diagnostic et soins', '5 SEMAINES', ['Hygiène du salon et des outils', 'Diagnostic du cheveu et du cuir chevelu', 'Shampoings et soins']],
      ['Tresses, nattes et locks', '8 SEMAINES', ['Tresses et nattes collées', 'Coiffures protectrices', 'Création et entretien des locks']],
      ['Tissages, perruques et coupes', '7 SEMAINES', ['Tissages et poses de perruques', 'Coupes femme et homme', 'Coiffages et brushing']],
      ['Défrisage, coloration et gestion du salon', '6 SEMAINES', ['Défrisage et coloration en sécurité', 'Accueil et fidélisation', 'Gestion des produits et des stocks']],
      ['Stage en salon', '13 SEMAINES', ['Stage dans un salon partenaire', 'Suivi par un tuteur', 'Bilan et préparation à l’emploi']]
    ],
    debouches: ['Coiffeur(se) en salon', 'Tresseuse spécialisée', 'Coiffeur(se) à domicile ou événementiel', 'Gérant(e) de salon'],
    entreprendre: "Beaucoup de coiffeuses démarrent à domicile avant d'ouvrir leur salon. L'institut les aide à construire leur offre de prestations, à gérer leurs stocks de produits et à préparer, étape par étape, l'ouverture de leur propre salon.",
    numerique: "Prise de rendez-vous par WhatsApp, vidéos de réalisations sur Instagram ou TikTok, fichier clientes : le numérique remplit l'agenda du salon.",
    prerequis: ['Savoir lire et compter', '15 ans minimum', 'Sens du contact', 'Entretien de motivation']
  },
  {
    slug: 'couture-africaine', label: 'Couture africaine et confection', titre: ['Couture africaine', 'et confection.'],
    icon: 'Shirt', dom: 'mode', mois: 12, stage: 3, niv: 'Sans diplôme', cqp: true,
    accroche: 'Tenues en pagne, kabas, boubous, robes de cérémonie, sur mesure.',
    metier: "Le couturier ou la couturière crée et confectionne des vêtements sur mesure et en série : tenues en pagne, boubous, kabas, robes de cérémonie, uniformes. Entre tradition et tendances, ce métier valorise le savoir-faire africain et permet de développer sa propre marque.",
    objectifs: ['Prendre les mesures et réaliser un patron', 'Couper et assembler les principaux modèles', 'Confectionner des tenues traditionnelles et modernes', 'Gérer les commandes et la relation avec les clients'],
    competences: ['Prise de mesures et patronage', 'Coupe du pagne, du wax et des tissus fins', 'Montage, finitions et broderies simples', 'Retouches et ajustements', 'Création de collections', 'Calcul du prix de revient'],
    activites: ['Confection sur mesure pour les particuliers', 'Tenues de cérémonie et de mariage', 'Uniformes d’écoles et d’entreprises', 'Création et vente de collections'],
    equipements: ['Machines à coudre plates', 'Surjeteuse', 'Fer à repasser professionnel', 'Mannequins et règles de patronage', 'Ciseaux de coupe', 'Matériel de broderie'],
    modules: [
      ['Bases : machines, points et tissus', '6 SEMAINES', ['Prise en main des machines', 'Points, coutures et finitions', 'Connaissance des tissus et du pagne']],
      ['Mesures et patronage', '8 SEMAINES', ['Prise de mesures', 'Tracé de patrons de base', 'Gradation et adaptation']],
      ['Confection de modèles traditionnels', '10 SEMAINES', ['Kabas et boubous', 'Ensembles en pagne', 'Broderies et ornements']],
      ['Modèles modernes et tenues de cérémonie', '10 SEMAINES', ['Robes et ensembles', 'Chemises et pantalons', 'Tenues de cérémonie']],
      ['Création de collection et gestion d’atelier', '5 SEMAINES', ['Concevoir une petite collection', 'Prix de revient et commandes', 'Présenter ses créations']],
      ['Stage en atelier', '13 SEMAINES', ['Stage dans un atelier partenaire', 'Suivi par un tuteur', 'Bilan et préparation à l’emploi']]
    ],
    debouches: ['Couturier(ère) en atelier', 'Confectionneur(se) en unité de production', 'Retoucheur(se)', 'Créateur(trice) de mode'],
    entreprendre: "Ouvrir son atelier de couture est l'un des projets les plus accessibles : une machine, un espace et un premier réseau de clientes suffisent pour démarrer. L'institut accompagne les apprenants pour équiper leur atelier, fixer leurs prix et faire connaître leurs créations.",
    numerique: "Photos des modèles sur Instagram et WhatsApp, catalogue en ligne, commandes à distance, inspiration et patrons numériques : le numérique est devenu la vitrine du couturier.",
    prerequis: ['Savoir lire et compter', '15 ans minimum', 'Goût pour la création', 'Entretien de motivation']
  },
  {
    slug: 'cosmetique', label: 'Cosmétique naturelle', titre: ['Cosmétique', 'naturelle.'],
    icon: 'FlaskConical', dom: 'mode', mois: 6, stage: 2, niv: 'BEPC', cqp: false,
    accroche: 'Savons, crèmes, huiles et beurres à partir des ressources locales.',
    metier: "Le technicien en cosmétique formule et fabrique savons, crèmes, huiles, beurres et produits capillaires en valorisant les ressources locales : karité, coco, moringa, avocat. Il veille à la qualité, à l'hygiène et à la bonne conservation de ses produits.",
    objectifs: ['Connaître les matières premières locales et leurs propriétés', 'Formuler et fabriquer savons, crèmes et huiles', 'Respecter les règles d’hygiène, de dosage et de conservation', 'Conditionner, étiqueter et vendre ses produits'],
    competences: ['Saponification à froid et à chaud', 'Émulsions : crèmes et laits', 'Huiles, beurres et soins capillaires', 'Bonnes pratiques de fabrication', 'Conditionnement et étiquetage', 'Calcul du coût de revient'],
    activites: ['Fabrication artisanale de cosmétiques', 'Production pour salons et instituts', 'Vente sur les marchés et en ligne', 'Création d’une gamme sous sa propre marque'],
    equipements: ['Balances de précision', 'Mixeurs et thermomètres', 'Moules et contenants', 'Matières premières végétales', 'Blouses, gants et charlottes', 'Matériel d’étiquetage'],
    modules: [
      ['Matières premières et sécurité', '4 SEMAINES', ['Huiles, beurres et actifs locaux', 'Règles d’hygiène et de sécurité', 'Dosages et pesées']],
      ['Savons et soins lavants', '5 SEMAINES', ['Saponification à froid', 'Savons liquides et gels', 'Séchage et conservation']],
      ['Crèmes, huiles et soins capillaires', '5 SEMAINES', ['Émulsions', 'Huiles et beurres corporels', 'Soins pour les cheveux']],
      ['Qualité, conditionnement et vente', '3 SEMAINES', ['Conditionnement et étiquetage', 'Prix de revient', 'Points de vente et vente en ligne']],
      ['Stage ou projet de gamme', '9 SEMAINES', ['Stage en unité de fabrication ou création de sa gamme', 'Suivi par un tuteur', 'Bilan et préparation à l’emploi']]
    ],
    debouches: ['Préparateur(trice) en unité de fabrication cosmétique', 'Agent de production', 'Conseiller(ère) beauté', 'Entrepreneur(e) en cosmétique naturelle'],
    entreprendre: "La cosmétique naturelle permet de lancer une petite production à domicile, puis de développer sa propre marque. L'institut accompagne les apprenants sur la qualité, l'étiquetage et la recherche de points de vente.",
    numerique: "Boutique en ligne, réseaux sociaux, gestion des stocks sur smartphone : le numérique permet de vendre bien au-delà de son quartier.",
    prerequis: ['BEPC ou niveau équivalent', '16 ans minimum', 'Rigueur et sens de l’hygiène', 'Entretien de motivation']
  },

  /* ---------------------------------------------------------------- */
  /* BTP & techniques                                                  */
  /* ---------------------------------------------------------------- */
  {
    slug: 'carrelage', label: 'Carrelage et revêtements', titre: ['Carrelage', 'et revêtements.'],
    icon: 'Grid3x3', dom: 'btp', mois: 6, stage: 2, niv: 'Sans diplôme', cqp: true,
    accroche: 'Pose de sols et murs, faïence, salles de bains, terrasses.',
    metier: "Le carreleur pose et entretient les revêtements de sols et de murs : carreaux, faïence, mosaïque, dalles extérieures. Métier de finition très demandé dans la construction comme dans la rénovation, il exige précision, sens du détail et goût du travail bien fait.",
    objectifs: ['Préparer et mettre à niveau un support (chape, ragréage)', 'Poser carrelage et faïence au sol et au mur', 'Réaliser découpes, joints et finitions', 'Estimer les quantités et chiffrer un petit chantier'],
    competences: ['Lecture de plans et calepinage', 'Préparation des mortiers et colles', 'Pose droite, en diagonale et décorative', 'Découpe à la carrelette et à la disqueuse', 'Étanchéité des pièces humides', 'Sécurité et organisation du chantier'],
    activites: ['Pose de sols et murs dans les logements neufs', 'Rénovation de salles de bains et de cuisines', 'Pose de dalles extérieures et de terrasses', 'Devis et métrés pour les particuliers'],
    equipements: ['Carrelette et disqueuse', 'Niveau laser et règles', 'Peignes à colle et maillets', 'Croisillons et cales', 'Malaxeur', 'Équipements de protection individuelle'],
    modules: [
      ['Supports, matériaux et outillage', '4 SEMAINES', ['Types de carreaux et de colles', 'Préparation des supports', 'Outillage et sécurité']],
      ['Pose au sol', '6 SEMAINES', ['Calepinage et implantation', 'Pose droite et en diagonale', 'Joints et nettoyage']],
      ['Murs, faïence et pièces humides', '5 SEMAINES', ['Pose de faïence', 'Étanchéité sous carrelage', 'Douches et plans de travail']],
      ['Découpes, finitions et décor', '3 SEMAINES', ['Découpes complexes', 'Plinthes et nez de marche', 'Frises et mosaïques']],
      ['Stage en entreprise', '8 SEMAINES', ['Stage sur chantier avec une entreprise partenaire', 'Suivi par un tuteur', 'Bilan et préparation à l’emploi']]
    ],
    debouches: ['Carreleur en entreprise du BTP', 'Ouvrier qualifié en finitions', 'Chef d’équipe carrelage (avec expérience)', 'Poseur indépendant'],
    entreprendre: "Avec un outillage de départ modeste, le carreleur peut rapidement travailler à son compte auprès des particuliers et des petites entreprises du bâtiment. L'institut l'aide à établir ses premiers devis, à constituer son réseau de clients et à s'associer à d'autres artisans.",
    numerique: "Applications de calepinage, calcul des quantités sur tableur, photos avant/après partagées sur WhatsApp et Facebook : les outils numériques aident le carreleur à préparer ses chantiers et à trouver des clients.",
    prerequis: ['Savoir lire, écrire et compter', '16 ans minimum', 'Bonne condition physique', 'Entretien de motivation']
  },
  {
    slug: 'plomberie', label: 'Plomberie sanitaire', titre: ['Plomberie', 'sanitaire.'],
    icon: 'Droplets', dom: 'btp', mois: 9, stage: 3, niv: 'CEP', cqp: true,
    accroche: 'Réseaux d’eau, sanitaires, chauffe-eau, dépannage.',
    metier: "Le plombier installe, raccorde et répare les réseaux d'eau et les équipements sanitaires : canalisations, robinetterie, chauffe-eau, évacuations. Indispensable sur chaque chantier comme pour les dépannages du quotidien, c'est un métier où la demande ne faiblit pas.",
    objectifs: ['Lire un plan et tracer un réseau d’alimentation et d’évacuation', 'Façonner et assembler des tuyauteries PVC, PPR, cuivre et multicouche', 'Poser et raccorder les appareils sanitaires', 'Diagnostiquer et réparer fuites et pannes courantes'],
    competences: ['Dimensionnement simple d’un réseau', 'Coupe, cintrage, soudure et collage des tubes', 'Pose de lavabos, WC, douches et éviers', 'Installation de chauffe-eau et de pompes', 'Recherche de fuites', 'Règles d’hygiène et de sécurité'],
    activites: ['Installation sanitaire dans les constructions neuves', 'Dépannage chez les particuliers', 'Entretien des réseaux d’immeubles et d’entreprises', 'Raccordement de réservoirs et de surpresseurs'],
    equipements: ['Coupe-tubes et cintreuse', 'Poste à souder PPR', 'Clés à molette et à griffe', 'Pompe d’épreuve', 'Niveau et mètre', 'Équipements de protection individuelle'],
    modules: [
      ['Lecture de plans et matériaux', '5 SEMAINES', ['Plans et symboles', 'Tubes et raccords', 'Outillage et sécurité']],
      ['Réseaux d’alimentation en eau', '8 SEMAINES', ['Tracé et pose des réseaux', 'Soudure PPR et collage PVC', 'Essais de pression']],
      ['Évacuations et assainissement', '6 SEMAINES', ['Pentes et diamètres', 'Évacuations des eaux usées', 'Regards et fosses']],
      ['Appareils sanitaires, chauffe-eau et dépannage', '7 SEMAINES', ['Pose des appareils sanitaires', 'Chauffe-eau et pompes', 'Recherche et réparation de fuites']],
      ['Stage en entreprise', '13 SEMAINES', ['Stage sur chantier avec une entreprise partenaire', 'Suivi par un tuteur', 'Bilan et préparation à l’emploi']]
    ],
    debouches: ['Plombier sanitaire en entreprise du BTP', 'Agent de maintenance (hôtels, hôpitaux, immeubles)', 'Installateur de chauffe-eau et de pompes', 'Plombier dépanneur indépendant'],
    entreprendre: "Le dépannage à domicile permet de démarrer seul avec une caisse à outils et un téléphone. L'institut accompagne les jeunes plombiers pour fixer leurs tarifs, se faire connaître dans leur quartier et répondre en équipe à des chantiers plus importants.",
    numerique: "Catalogues de fournisseurs en ligne, devis sur smartphone, prise de rendez-vous par WhatsApp : le plombier qui maîtrise ces outils gagne du temps et fidélise sa clientèle.",
    prerequis: ['CEP ou niveau équivalent', '16 ans minimum', 'Goût pour le travail manuel', 'Entretien de motivation']
  },
  {
    slug: 'electricite', label: 'Électricité du bâtiment', titre: ['Électricité', 'du bâtiment.'],
    icon: 'Zap', dom: 'btp', mois: 12, stage: 3, niv: 'BEPC', cqp: true,
    accroche: 'Installations domestiques, tableaux, dépannage, solaire.',
    metier: "L'électricien du bâtiment réalise les installations électriques des logements, commerces et bureaux : tableaux, circuits, prises, éclairage, mise à la terre. Il intervient aussi en dépannage et, de plus en plus, sur l'installation de panneaux solaires.",
    objectifs: ['Lire et interpréter un schéma électrique', 'Réaliser une installation domestique conforme aux normes', 'Câbler et raccorder un tableau de distribution', 'Diagnostiquer une panne et intervenir en sécurité'],
    competences: ['Notions d’électricité : tension, intensité, puissance', 'Tirage de câbles, encastrement et goulottes', 'Câblage des circuits d’éclairage et de prises', 'Protections : disjoncteurs, différentiels, terre', 'Initiation au solaire photovoltaïque', 'Prévention des risques électriques'],
    activites: ['Installation électrique de logements neufs', 'Rénovation et mise en conformité', 'Dépannage chez les particuliers et les commerces', 'Pose de kits solaires et d’onduleurs'],
    equipements: ['Multimètre et testeur de tension', 'Pinces à dénuder et à sertir', 'Perceuse et rainureuse', 'Tableaux et appareillages de formation', 'Kit solaire pédagogique', 'Équipements de protection individuelle'],
    modules: [
      ['Bases de l’électricité et sécurité', '6 SEMAINES', ['Grandeurs électriques', 'Risques électriques et prévention', 'Outillage et mesures']],
      ['Schémas et installations domestiques', '10 SEMAINES', ['Lecture de schémas', 'Circuits d’éclairage et de prises', 'Encastrement et goulottes']],
      ['Tableaux, protections et mise à la terre', '8 SEMAINES', ['Câblage d’un tableau', 'Disjoncteurs et différentiels', 'Mise à la terre']],
      ['Dépannage et initiation au solaire', '8 SEMAINES', ['Méthode de diagnostic', 'Panneaux, batteries et onduleurs', 'Dimensionnement d’un kit solaire']],
      ['Projet de fin de formation', '7 SEMAINES', ['Installation complète d’un local', 'Chiffrage et dossier technique', 'Présentation devant un jury']],
      ['Stage en entreprise', '13 SEMAINES', ['Stage avec une entreprise partenaire', 'Suivi par un tuteur', 'Bilan et préparation à l’emploi']]
    ],
    debouches: ['Électricien(ne) du bâtiment', 'Électricien(ne) de maintenance (industrie, hôtellerie)', 'Installateur(trice) de systèmes solaires', 'Électricien(ne) indépendant(e)'],
    entreprendre: "Installations neuves, dépannages, kits solaires : l'électricien dispose de plusieurs sources de revenus pour lancer sa propre activité. L'institut l'aide à monter son offre, à sécuriser ses premiers chantiers et à se rapprocher des fournisseurs de matériel.",
    numerique: "Logiciels de schémas électriques, applications de dimensionnement solaire, domotique : le numérique ouvre à l'électricien des chantiers plus techniques et mieux rémunérés.",
    prerequis: ['BEPC ou niveau équivalent', '17 ans minimum', 'Aptitude au travail en hauteur', 'Test d’orientation et entretien']
  },
  {
    slug: 'maconnerie', label: 'Maçonnerie', titre: ['Maçonnerie', 'et béton armé.'],
    icon: 'BrickWall', dom: 'btp', mois: 9, stage: 3, niv: 'Sans diplôme', cqp: true,
    accroche: 'Fondations, murs, béton armé, enduits.',
    metier: "Le maçon construit les fondations, les murs, les poteaux et les dalles des bâtiments. Premier métier du chantier, il transforme un plan en ouvrage solide et durable, de la maison individuelle aux bâtiments collectifs.",
    objectifs: ['Implanter un ouvrage et lire un plan', 'Réaliser fondations et murs en parpaings ou en briques', 'Coffrer, ferrailler et couler poteaux, chaînages et dalles', 'Réaliser enduits et finitions'],
    competences: ['Dosage des bétons et des mortiers', 'Montage de murs d’aplomb et alignés', 'Coffrage et ferraillage', 'Coulage et vibration du béton', 'Enduits intérieurs et extérieurs', 'Sécurité sur chantier'],
    activites: ['Construction de maisons individuelles', 'Extensions et rénovations', 'Ouvrages en béton armé', 'Clôtures et travaux d’assainissement'],
    equipements: ['Truelles, niveaux et fils à plomb', 'Bétonnière', 'Coffrages et étais', 'Outils de ferraillage', 'Brouettes et échafaudages', 'Équipements de protection individuelle'],
    modules: [
      ['Lecture de plans, implantation et matériaux', '5 SEMAINES', ['Plans et cotes', 'Implantation d’un ouvrage', 'Ciments, agrégats et dosages']],
      ['Fondations et murs', '8 SEMAINES', ['Fouilles et semelles', 'Murs en parpaings et en briques', 'Ouvertures et linteaux']],
      ['Béton armé : coffrage et ferraillage', '8 SEMAINES', ['Coffrage des poteaux et poutres', 'Façonnage des armatures', 'Coulage des dalles']],
      ['Enduits et finitions', '5 SEMAINES', ['Enduits intérieurs et extérieurs', 'Chapes', 'Reprises et réparations']],
      ['Stage en entreprise', '13 SEMAINES', ['Stage sur chantier avec une entreprise partenaire', 'Suivi par un tuteur', 'Bilan et préparation à l’emploi']]
    ],
    debouches: ['Maçon en entreprise du BTP', 'Coffreur-boiseur', 'Chef d’équipe maçonnerie (avec expérience)', 'Tâcheron indépendant'],
    entreprendre: "Beaucoup de maçons travaillent comme tâcherons et prennent en charge des chantiers complets avec leur propre équipe. L'institut les prépare à chiffrer un ouvrage, à encadrer une équipe et à tenir les délais pour gagner la confiance des clients.",
    numerique: "Calcul de métrés sur tableur, plans consultés sur tablette, suivi de chantier en photos : le numérique aide le maçon à mieux chiffrer et à rassurer ses clients.",
    prerequis: ['Savoir lire et compter', '16 ans minimum', 'Bonne condition physique', 'Entretien de motivation']
  },
  {
    slug: 'menuiserie-metallique', label: 'Menuiserie métallique', titre: ['Menuiserie', 'métallique.'],
    icon: 'Flame', dom: 'btp', mois: 12, stage: 3, niv: 'CEP', cqp: true,
    accroche: 'Portails, grilles, escaliers, soudure à l’arc.',
    metier: "Le menuisier métallique fabrique et pose portails, grilles de protection, portes, escaliers, garde-corps et charpentes légères en acier. Il allie travail d'atelier — découpe, soudure, assemblage — et pose sur chantier.",
    objectifs: ['Lire un plan de fabrication et relever des cotes', 'Découper, plier et assembler des profilés acier', 'Souder à l’arc en toute sécurité', 'Traiter, peindre et poser les ouvrages'],
    competences: ['Traçage et débit des profilés', 'Soudure à l’arc électrique', 'Perçage, meulage et ajustage', 'Fabrication de portails, grilles et portes', 'Protection anticorrosion et peinture', 'Pose et scellement sur chantier'],
    activites: ['Fabrication de portails et de grilles de sécurité', 'Escaliers, garde-corps et rambardes', 'Charpentes et abris métalliques', 'Réparation et entretien d’ouvrages'],
    equipements: ['Poste à souder à l’arc', 'Meuleuse et tronçonneuse', 'Perceuse à colonne', 'Étau et établi', 'Outils de traçage', 'Masque, gants et équipements de protection'],
    modules: [
      ['Sécurité, dessin et traçage', '6 SEMAINES', ['Sécurité à l’atelier', 'Lecture de plans', 'Traçage et prise de cotes']],
      ['Découpe, perçage et assemblage', '8 SEMAINES', ['Débit des profilés', 'Perçage et meulage', 'Assemblages mécaniques']],
      ['Soudure à l’arc', '10 SEMAINES', ['Réglages du poste', 'Positions de soudage', 'Contrôle des soudures']],
      ['Fabrication d’ouvrages', '10 SEMAINES', ['Portails et grilles', 'Portes et escaliers', 'Garde-corps']],
      ['Finitions et pose', '5 SEMAINES', ['Traitement anticorrosion et peinture', 'Pose et scellement', 'Chiffrage d’un ouvrage']],
      ['Stage en entreprise', '13 SEMAINES', ['Stage en atelier partenaire', 'Suivi par un tuteur', 'Bilan et préparation à l’emploi']]
    ],
    debouches: ['Menuisier métallique / soudeur en atelier', 'Soudeur en entreprise de construction métallique', 'Poseur d’ouvrages métalliques', 'Artisan métallier indépendant'],
    entreprendre: "Un atelier de soudure de quartier répond à une demande permanente de portails, de grilles et de réparations. L'institut aide les apprenants à évaluer l'investissement de départ, à trouver un local et à présenter leurs réalisations.",
    numerique: "Plans réalisés sur logiciel, catalogue de modèles partagé sur les réseaux sociaux, calcul des coûts sur tableur : autant d'atouts pour vendre ses ouvrages.",
    prerequis: ['CEP ou niveau équivalent', '17 ans minimum', 'Aptitude au travail physique', 'Entretien de motivation']
  },
  {
    slug: 'menuiserie-aluminium', label: 'Menuiserie aluminium', titre: ['Menuiserie', 'aluminium et vitrerie.'],
    icon: 'AppWindow', dom: 'btp', mois: 9, stage: 3, niv: 'BEPC', cqp: true,
    accroche: 'Fenêtres, baies vitrées, portes et cloisons en aluminium.',
    metier: "Le menuisier aluminium fabrique et installe fenêtres, baies vitrées, portes, cloisons et devantures en aluminium et en verre. Très présent dans les immeubles, bureaux et commerces modernes, ce métier demande précision et sens de la finition.",
    objectifs: ['Relever les mesures et lire une fiche de fabrication', 'Débiter et usiner les profilés aluminium', 'Assembler les châssis et poser le vitrage', 'Poser et régler les menuiseries sur chantier'],
    competences: ['Prise de cotes et calcul de débit', 'Coupe d’onglet et usinage', 'Assemblage des coulissants et des ouvrants', 'Pose de vitrage et joints d’étanchéité', 'Pose, calage et réglage', 'Relation client et devis simple'],
    activites: ['Fenêtres et baies coulissantes', 'Portes vitrées et devantures de magasin', 'Cloisons de bureaux', 'Vitrines et moustiquaires'],
    equipements: ['Scie à onglet pour aluminium', 'Poinçonneuse et perceuse', 'Visseuse et riveteuse', 'Ventouses de vitrier', 'Mastics et joints', 'Équipements de protection individuelle'],
    modules: [
      ['Matériaux, mesures et sécurité', '5 SEMAINES', ['Profilés et accessoires', 'Prise de cotes', 'Sécurité à l’atelier']],
      ['Débit et usinage des profilés', '7 SEMAINES', ['Feuilles de débit', 'Coupe d’onglet', 'Usinage et perçage']],
      ['Assemblage des châssis et vitrage', '8 SEMAINES', ['Coulissants', 'Ouvrants à la française', 'Pose du vitrage']],
      ['Pose et réglages sur chantier', '6 SEMAINES', ['Pose et calage', 'Étanchéité', 'Réglages et finitions']],
      ['Stage en entreprise', '13 SEMAINES', ['Stage en atelier partenaire', 'Suivi par un tuteur', 'Bilan et préparation à l’emploi']]
    ],
    debouches: ['Menuisier aluminium en atelier', 'Poseur de menuiseries et de vitrages', 'Agent technique en entreprise de second œuvre', 'Artisan indépendant'],
    entreprendre: "Avec un petit atelier et une scie adaptée, le menuisier aluminium peut répondre aux commandes des particuliers et des commerces. L'institut l'accompagne pour choisir ses fournisseurs de profilés et construire ses premiers devis.",
    numerique: "Logiciels de débit et d'optimisation des coupes, devis numériques, visuels 3D pour présenter les modèles : des outils qui réduisent les pertes et rassurent les clients.",
    prerequis: ['BEPC ou niveau équivalent', '17 ans minimum', 'Précision et soin', 'Entretien de motivation']
  },

  /* ---------------------------------------------------------------- */
  /* Numérique & IA                                                    */
  /* ---------------------------------------------------------------- */
  {
    slug: 'maintenance-informatique', label: 'Maintenance informatique et réseaux', titre: ['Maintenance informatique', 'et réseaux.'],
    icon: 'Monitor', dom: 'numerique', mois: 12, stage: 3, niv: 'BEPC', cqp: false,
    accroche: 'Dépannage, systèmes, réseaux, sécurité et support.',
    metier: "Le technicien informatique installe, configure et dépanne ordinateurs, imprimantes et réseaux. Il assiste les utilisateurs, sécurise les postes et veille au bon fonctionnement du parc informatique d'une entreprise.",
    objectifs: ['Diagnostiquer et réparer un ordinateur ou un périphérique', 'Installer et configurer systèmes, logiciels et pilotes', 'Câbler et mettre en service un réseau local filaire et Wi-Fi', 'Sécuriser les postes et organiser les sauvegardes'],
    competences: ['Architecture et composants d’un ordinateur', 'Systèmes Windows et Linux', 'Réseaux locaux, adressage IP et Wi-Fi', 'Sécurité, antivirus et sauvegardes', 'Support aux utilisateurs', 'Outils d’IA pour le diagnostic et la documentation'],
    activites: ['Maintenance d’un parc informatique', 'Installation de réseaux', 'Support et assistance aux utilisateurs', 'Réparation d’ordinateurs et de smartphones'],
    equipements: ['Postes de travail et pièces détachées', 'Baies de brassage et commutateurs', 'Pinces à sertir et testeurs', 'Routeurs et points d’accès Wi-Fi', 'Kits de démontage', 'Logiciels de diagnostic'],
    modules: [
      ['Bases de l’informatique et bureautique', '6 SEMAINES', ['Matériel, composants et systèmes d’exploitation', 'Traitement de texte, tableur, messagerie', 'Organisation et gestion des fichiers']],
      ['Maintenance matérielle', '8 SEMAINES', ['Diagnostic des pannes courantes', 'Montage et démontage d’un poste', 'Imprimantes et périphériques']],
      ['Systèmes et logiciels', '7 SEMAINES', ['Installation de Windows et Linux', 'Pilotes et logiciels', 'Comptes et droits utilisateurs']],
      ['Réseaux locaux', '10 SEMAINES', ['Câblage, sertissage et tests', 'Adressage IP et partage de ressources', 'Configuration d’un routeur et d’un réseau Wi-Fi']],
      ['Sécurité, sauvegarde et support', '8 SEMAINES', ['Antivirus, pare-feu et mises à jour', 'Stratégies de sauvegarde', 'Assistance utilisateurs et outils d’IA']],
      ['Stage en entreprise', '13 SEMAINES', ['Stage en entreprise partenaire', 'Suivi par un tuteur', 'Bilan et préparation à l’emploi']]
    ],
    debouches: ['Technicien(ne) de maintenance informatique', 'Technicien(ne) réseau, administrateur(trice) réseaux junior', 'Agent de support utilisateurs', 'Réparateur(trice) informatique indépendant(e)'],
    entreprendre: "Atelier de dépannage, maintenance sous contrat pour les PME, installation de réseaux : le technicien informatique peut démarrer seul. L'institut l'aide à formaliser ses offres de maintenance et à trouver ses premiers clients.",
    numerique: "Les assistants d'IA aident à diagnostiquer une panne, à rédiger une procédure ou à automatiser des tâches : le technicien apprend à s'en servir efficacement, sans négliger la sécurité des données.",
    prerequis: ['BEPC ou niveau équivalent', '16 ans minimum', 'Curiosité pour la technologie', 'Test d’orientation et entretien']
  },
  {
    slug: 'developpement-web', label: 'Développement web et mobile', titre: ['Développement', 'web et mobile.'],
    icon: 'CodeXml', dom: 'numerique', mois: 12, stage: 3, niv: 'Probatoire', cqp: false,
    accroche: 'Sites, boutiques en ligne, applications, avec l’IA comme assistant.',
    metier: "Le développeur web conçoit et réalise sites internet, boutiques en ligne et applications. Il traduit les besoins d'un client en solution numérique, de l'interface à la mise en ligne.",
    objectifs: ['Concevoir et intégrer des pages web adaptées au mobile', 'Programmer en JavaScript et utiliser une base de données', 'Réaliser un site ou une application complète', 'Utiliser l’IA comme assistant de programmation, avec esprit critique'],
    competences: ['HTML, CSS et design responsive', 'JavaScript', 'Développement serveur et bases de données', 'WordPress et sites vitrines', 'Git et travail en équipe', 'Assistants d’IA pour coder et tester'],
    activites: ['Création de sites vitrines et de boutiques en ligne', 'Applications web pour les entreprises', 'Maintenance et mise à jour de sites', 'Intégration des paiements mobiles'],
    equipements: ['Ordinateurs de développement', 'Éditeur de code', 'Navigateurs et outils de test', 'Serveurs d’hébergement de formation', 'Smartphones de test', 'Connexion Internet'],
    modules: [
      ['Algorithmique et bases du web', '8 SEMAINES', ['Logique de programmation', 'Fonctionnement d’Internet', 'Outils du développeur']],
      ['HTML, CSS et design responsive', '8 SEMAINES', ['Structure d’une page', 'Mise en forme et mise en page', 'Adaptation au mobile']],
      ['JavaScript et interactivité', '9 SEMAINES', ['Bases du langage', 'Interactions et formulaires', 'Appels à des services en ligne']],
      ['Serveur, bases de données et CMS', '8 SEMAINES', ['Bases de données', 'Programmation côté serveur', 'WordPress']],
      ['Projet professionnel avec l’IA', '6 SEMAINES', ['Cahier des charges', 'Développement assisté par IA', 'Mise en ligne et présentation']],
      ['Stage en entreprise', '13 SEMAINES', ['Stage en entreprise ou agence partenaire', 'Suivi par un tuteur', 'Bilan et préparation à l’emploi']]
    ],
    debouches: ['Développeur(se) web junior', 'Intégrateur(trice) web', 'Développeur(se) WordPress', 'Freelance en création de sites'],
    entreprendre: "Commerces, artisans et associations ont tous besoin d'être visibles en ligne. Le développeur peut travailler en freelance, pour des clients locaux comme à l'international. L'institut l'aide à constituer son portfolio et à trouver ses premières missions.",
    numerique: "Les assistants d'IA écrivent du code, mais il faut savoir le comprendre, le vérifier et l'adapter : c'est précisément ce que la formation enseigne.",
    prerequis: ['Probatoire ou niveau équivalent', '17 ans minimum', 'Logique et persévérance', 'Test d’orientation et entretien']
  },
  {
    slug: 'numerique-ia', label: 'Compétences numériques et IA', titre: ['Compétences numériques', 'et intelligence artificielle.'],
    icon: 'BrainCircuit', dom: 'numerique', mois: 3, stage: 0, niv: 'BEPC', cqp: false, module: true,
    accroche: 'Module de perfectionnement ouvert à tous les métiers.',
    metier: "Ce module de perfectionnement apprend à utiliser les outils numériques et l'intelligence artificielle dans son métier : communiquer, vendre, s'organiser et produire des documents professionnels. Il s'adresse aux apprenants de l'institut comme aux professionnels en activité.",
    objectifs: ['Maîtriser les outils bureautiques et collaboratifs essentiels', 'Promouvoir une activité sur les réseaux sociaux et WhatsApp Business', 'Utiliser les assistants d’IA pour rédiger, traduire, créer des visuels et s’organiser', 'Comprendre les limites de l’IA : erreurs, confidentialité, droits'],
    competences: ['Bureautique et stockage en ligne', 'WhatsApp Business et réseaux sociaux', 'Création de visuels simples', 'Rédaction et traduction assistées par IA', 'Paiements mobiles et outils de gestion', 'Sécurité et usage responsable de l’IA'],
    activites: ['Communication numérique d’une petite entreprise', 'Animation des réseaux sociaux', 'Assistance administrative numérique', 'Création de contenus pour les artisans'],
    equipements: ['Salle informatique', 'Smartphones', 'Suite bureautique en ligne', 'Outils d’IA générative', 'Logiciels de création graphique', 'Connexion Internet'],
    modules: [
      ['Bureautique et outils collaboratifs', '3 SEMAINES', ['Documents, tableurs et présentations', 'Stockage et partage en ligne', 'Messagerie professionnelle']],
      ['Communication et vente en ligne', '4 SEMAINES', ['WhatsApp Business', 'Réseaux sociaux et visuels', 'Paiements mobiles']],
      ['Intelligence artificielle au quotidien', '4 SEMAINES', ['Rédiger, résumer et traduire avec l’IA', 'Créer des images et des supports', 'Limites, erreurs et confidentialité']],
      ['Projet appliqué à son métier', '2 SEMAINES', ['Plan de communication de son activité', 'Outils choisis et mis en place', 'Présentation finale']]
    ],
    debouches: ['Assistant(e) numérique', 'Community manager junior', 'Agent de communication digitale', 'Compétence complémentaire pour tous les métiers'],
    entreprendre: "Accompagner les artisans et les commerçants dans leur communication en ligne est une activité à part entière. Et pour ceux qui exercent déjà un métier, ces compétences permettent de mieux vendre et de gagner du temps.",
    numerique: "Ce module résume notre conviction : l'IA ne remplace pas le savoir-faire, elle le complète. Bien utilisée, elle aide chaque professionnel à gagner du temps et à trouver de nouveaux clients.",
    prerequis: ['BEPC ou niveau équivalent', 'Ouvert aux apprenants et aux professionnels', 'Savoir utiliser un smartphone', 'Entretien d’orientation']
  },

  /* ---------------------------------------------------------------- */
  /* Services & gestion                                                */
  /* ---------------------------------------------------------------- */
  {
    slug: 'comptabilite', label: 'Comptabilité et gestion', titre: ['Comptabilité', 'et gestion.'],
    icon: 'Calculator', dom: 'services', mois: 12, stage: 3, niv: 'Probatoire', cqp: false,
    accroche: 'Comptabilité OHADA, paie, trésorerie, logiciels.',
    metier: "L'aide-comptable enregistre les opérations de l'entreprise, prépare les déclarations courantes et suit la trésorerie. Il travaille avec le référentiel comptable SYSCOHADA et les logiciels de gestion.",
    objectifs: ['Maîtriser les principes de la comptabilité SYSCOHADA', 'Enregistrer factures, achats, ventes et opérations de banque', 'Préparer la paie et les déclarations courantes', 'Utiliser un logiciel de comptabilité et le tableur'],
    competences: ['Plan comptable SYSCOHADA', 'Saisie et lettrage des comptes', 'Rapprochements bancaires', 'Paie et déclarations courantes', 'Tableur et logiciel comptable', 'Tableaux de bord de gestion'],
    activites: ['Tenue de la comptabilité d’une PME', 'Gestion de la caisse et de la trésorerie', 'Préparation de la paie', 'Suivi des clients et des fournisseurs'],
    equipements: ['Salle informatique', 'Logiciel de comptabilité', 'Tableur', 'Calculatrices', 'Documents comptables d’entraînement', 'Imprimantes'],
    modules: [
      ['Principes comptables et SYSCOHADA', '8 SEMAINES', ['Bilan et compte de résultat', 'Plan comptable', 'Pièces justificatives']],
      ['Opérations courantes et trésorerie', '9 SEMAINES', ['Achats et ventes', 'Banque et caisse', 'Rapprochements bancaires']],
      ['Paie et déclarations', '8 SEMAINES', ['Bulletins de paie', 'Déclarations sociales', 'Déclarations fiscales courantes']],
      ['Logiciels comptables et tableur', '8 SEMAINES', ['Saisie sur logiciel', 'Tableur appliqué à la gestion', 'Outils d’IA pour classer et analyser']],
      ['Gestion et tableaux de bord', '6 SEMAINES', ['Coûts et marges', 'Budget prévisionnel', 'Tableaux de bord']],
      ['Stage en entreprise', '13 SEMAINES', ['Stage en entreprise ou cabinet partenaire', 'Suivi par un tuteur', 'Bilan et préparation à l’emploi']]
    ],
    debouches: ['Aide-comptable', 'Assistant(e) comptable', 'Caissier(ère), gestionnaire de trésorerie', 'Agent de saisie comptable'],
    entreprendre: "Les petits commerces et les artisans ont besoin d'aide pour tenir leurs comptes : l'aide-comptable peut proposer la tenue de comptabilité et le suivi de gestion à plusieurs clients. L'institut l'aide à définir son offre et ses tarifs.",
    numerique: "Logiciels comptables, tableurs, paiements mobiles et outils d'IA pour classer les pièces : la comptabilité est devenue un métier du numérique.",
    prerequis: ['Probatoire ou niveau équivalent', '17 ans minimum', 'Rigueur et aisance avec les chiffres', 'Test d’orientation et entretien']
  },
  {
    slug: 'secretariat-bureautique', label: 'Secrétariat bureautique', titre: ['Secrétariat', 'bureautique.'],
    icon: 'FolderOpen', dom: 'services', mois: 9, stage: 3, niv: 'BEPC', cqp: false,
    accroche: 'Accueil, courrier, bureautique, organisation, archivage.',
    metier: "Le ou la secrétaire bureautique assure l'accueil, la gestion du courrier, la rédaction de documents, l'organisation des agendas et le classement. Pilier de l'organisation d'une structure, il maîtrise parfaitement les outils bureautiques.",
    objectifs: ['Accueillir, renseigner et orienter visiteurs et appelants', 'Rédiger et mettre en forme courriers et documents', 'Organiser agendas, réunions et déplacements', 'Classer et archiver l’information papier et numérique'],
    competences: ['Traitement de texte et tableur', 'Expression écrite professionnelle', 'Accueil physique et téléphonique', 'Gestion du courrier et de l’archivage', 'Messagerie et agenda partagé', 'Outils d’IA pour rédiger et résumer'],
    activites: ['Secrétariat en entreprise ou en administration', 'Accueil et standard', 'Assistance de direction', 'Saisie et gestion documentaire'],
    equipements: ['Salle informatique', 'Suite bureautique', 'Imprimante et scanner', 'Standard téléphonique', 'Matériel de classement et d’archivage', 'Connexion Internet'],
    modules: [
      ['Communication écrite et orale', '6 SEMAINES', ['Orthographe et rédaction', 'Courriers et comptes rendus', 'Accueil téléphonique']],
      ['Bureautique', '8 SEMAINES', ['Traitement de texte', 'Tableur', 'Présentations']],
      ['Accueil, courrier et agenda', '6 SEMAINES', ['Accueil des visiteurs', 'Circuit du courrier', 'Organisation de réunions']],
      ['Classement, archivage et outils numériques', '6 SEMAINES', ['Classement et archivage', 'Agenda et messagerie partagés', 'Assistants d’IA de rédaction']],
      ['Stage en entreprise', '13 SEMAINES', ['Stage en entreprise ou administration partenaire', 'Suivi par un tuteur', 'Bilan et préparation à l’emploi']]
    ],
    debouches: ['Secrétaire bureautique', 'Agent d’accueil', 'Assistant(e) administratif(ve)', 'Opérateur(trice) de saisie'],
    entreprendre: "Un centre de services bureautiques — saisie, impression, mise en forme de documents, démarches en ligne — peut démarrer avec un ordinateur et une imprimante. L'institut aide à monter ce type de projet.",
    numerique: "Agendas partagés, archivage numérique et assistants d'IA pour rédiger et résumer : la secrétaire qui maîtrise ces outils devient indispensable.",
    prerequis: ['BEPC ou niveau équivalent', '16 ans minimum', 'Bonne expression en français', 'Entretien de motivation']
  },
  {
    slug: 'restauration', label: 'Restauration et cuisine', titre: ['Restauration', 'et cuisine.'],
    icon: 'ChefHat', dom: 'services', mois: 9, stage: 3, niv: 'Sans diplôme', cqp: true,
    accroche: 'Cuisine camerounaise, africaine et internationale, traiteur.',
    metier: "Le cuisinier prépare des plats de la cuisine camerounaise, africaine et internationale, du restaurant au service traiteur. Il maîtrise les techniques de base, l'hygiène alimentaire et l'organisation d'une cuisine professionnelle.",
    objectifs: ['Appliquer les règles d’hygiène et de sécurité alimentaire', 'Maîtriser les techniques culinaires de base', 'Préparer des menus locaux et internationaux', 'Organiser la production et maîtriser les coûts'],
    competences: ['Hygiène et conservation des aliments', 'Découpes et cuissons', 'Sauces, plats traditionnels et pâtisserie de base', 'Dressage et service', 'Gestion des stocks et fiches techniques', 'Calcul du coût d’un plat'],
    activites: ['Cuisine en restaurant ou en hôtel', 'Service traiteur pour les événements', 'Restauration collective', 'Restauration rapide et vente à emporter'],
    equipements: ['Cuisine pédagogique équipée', 'Fours et plaques de cuisson', 'Batterie de cuisine', 'Couteaux professionnels', 'Réfrigérateurs et chambre froide', 'Tenues de cuisine'],
    modules: [
      ['Hygiène, sécurité et organisation', '4 SEMAINES', ['Règles d’hygiène alimentaire', 'Organisation d’une cuisine', 'Conservation des aliments']],
      ['Techniques culinaires de base', '8 SEMAINES', ['Découpes', 'Cuissons', 'Sauces de base']],
      ['Cuisine camerounaise et africaine', '7 SEMAINES', ['Plats traditionnels', 'Valorisation des produits locaux', 'Cuisine de fête']],
      ['Cuisine internationale, pâtisserie et service', '7 SEMAINES', ['Plats internationaux', 'Pâtisserie de base', 'Dressage et service']],
      ['Stage en restaurant', '13 SEMAINES', ['Stage en restaurant ou hôtel partenaire', 'Suivi par un tuteur', 'Bilan et préparation à l’emploi']]
    ],
    debouches: ['Cuisinier(ère) en restaurant ou en hôtel', 'Commis de cuisine', 'Agent de restauration collective', 'Traiteur indépendant'],
    entreprendre: "Service traiteur, restaurant de quartier, plats à emporter : la restauration offre des débouchés immédiats. L'institut accompagne les apprenants pour bâtir leur carte, calculer leurs prix et respecter les règles d'hygiène.",
    numerique: "Commandes par WhatsApp, livraison via les applications, photos des plats sur les réseaux sociaux : le numérique fait vendre.",
    prerequis: ['Savoir lire et compter', '16 ans minimum', 'Goût pour la cuisine', 'Entretien de motivation']
  },
  {
    slug: 'sante', label: 'Santé : aide-soignant(e)', titre: ['Santé :', 'aide-soignant(e).'],
    icon: 'Stethoscope', dom: 'services', mois: 12, stage: 4, niv: 'BEPC', cqp: false,
    accroche: 'Soins d’hygiène et de confort, accompagnement des patients.',
    metier: "L'aide-soignant(e) accompagne les patients dans les gestes de la vie quotidienne, participe aux soins d'hygiène et de confort et assiste l'équipe infirmière. Il ou elle exerce en hôpital, en clinique ou à domicile.",
    objectifs: ['Assurer l’hygiène et le confort du patient', 'Observer et transmettre les informations à l’équipe soignante', 'Mesurer les paramètres vitaux', 'Appliquer les règles de prévention des infections'],
    competences: ['Soins d’hygiène et de confort', 'Prise des paramètres vitaux', 'Aide à la mobilité et à l’alimentation', 'Prévention des infections', 'Premiers secours', 'Communication avec le patient et sa famille'],
    activites: ['Soins en service hospitalier', 'Accompagnement des personnes âgées', 'Soins à domicile', 'Accueil en centre de santé'],
    equipements: ['Salle de soins pédagogique', 'Mannequins de simulation', 'Tensiomètres et thermomètres', 'Lits médicalisés', 'Matériel d’hygiène', 'Tenues professionnelles'],
    modules: [
      ['Anatomie, hygiène et prévention', '8 SEMAINES', ['Notions d’anatomie', 'Hygiène hospitalière', 'Prévention des infections']],
      ['Soins d’hygiène et de confort', '10 SEMAINES', ['Toilette et confort', 'Installation et mobilisation', 'Aide aux repas']],
      ['Observation, paramètres vitaux et premiers secours', '9 SEMAINES', ['Paramètres vitaux', 'Transmissions', 'Gestes de premiers secours']],
      ['Accompagnement et communication', '8 SEMAINES', ['Relation avec le patient', 'Personnes âgées et dépendantes', 'Travail en équipe soignante']],
      ['Stages en structures de santé', '17 SEMAINES', ['Stages en hôpital, clinique ou centre de santé', 'Suivi par un tuteur', 'Bilan et préparation à l’emploi']]
    ],
    debouches: ['Aide-soignant(e) en hôpital ou en clinique', 'Auxiliaire de vie', 'Garde-malade à domicile', 'Agent en centre de santé'],
    entreprendre: "Les services d'aide à domicile pour les personnes âgées et malades se développent. Avec l'expérience, l'aide-soignant(e) peut proposer ses services ou créer une structure d'accompagnement, dans le respect de la réglementation.",
    numerique: "Dossiers patients informatisés, téléconsultation, applications de suivi : les métiers de la santé utilisent de plus en plus le numérique.",
    prerequis: ['BEPC ou niveau équivalent', '18 ans minimum', 'Certificat médical d’aptitude', 'Entretien de motivation']
  },

  /* ---------------------------------------------------------------- */
  /* À l'étude                                                         */
  /* ---------------------------------------------------------------- */
  {
    slug: 'mecanique-automobile', label: 'Mécanique automobile', icon: 'Wrench', dom: 'btp', mois: 12, niv: 'BEPC',
    statut: 'etude',
    accroche: 'Ouverture prévue lorsque l’atelier sera équipé et les formateurs recrutés.'
  }
];

FORMATIONS.forEach(f => {
  f.statut = f.statut || 'prioritaire';
  f.domaine = DOMAINES[f.dom];
  f.url = `formation-${f.slug}.html`;
  f.photo = 'f-' + f.slug;
  f.duree = f.mois === 3 ? 'Module de 3 mois' : `${f.mois} mois`;
  f.meta = (f.mois === 3 ? '3 MOIS · MODULE' : `${f.mois} MOIS`) + (f.cqp ? ' · CQP' : '');
  // Filtre « durée » du catalogue
  f.dureeFiltre = f.mois === 3 ? 'module' : String(f.mois);
});

module.exports = {
  DOMAINES,
  toutes: FORMATIONS,
  ouvertes: FORMATIONS.filter(f => f.statut === 'prioritaire'),
  aEtudier: FORMATIONS.filter(f => f.statut === 'etude')
};
