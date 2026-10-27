const { ouvertes } = require('./formations');

const bySlug = slug => ouvertes.find(f => f.slug === slug);

module.exports = {
  // Bannière d'accueil : une diapositive par métier mis en avant.
  // Photo plein écran, texte posé à gauche sur un dégradé : la personne doit
  // se trouver dans la moitié DROITE de la photo.
  // « fallback » : photo existante affichée en attendant la photo dédiée.
  slides: [
    {
      slot: 'hero-carrelage', formation: 'carrelage', label: 'Carrelage & BTP', tag: 'CARRELAGE · BTP',
      titre: ['Apprenez un métier.', 'Construisez votre avenir.'],
      texte: "Carrelage, plomberie, électricité, maçonnerie : les métiers du bâtiment recrutent, et ils s'ouvrent aussi aux femmes.",
      photo: 'Photo plein cadre — jeune femme carreleuse posant un carrelage, en tenue verte à col jaune-or',
      fallback: 'qui-hero', fallbackFocus: '72% 40%'
    },
    {
      slot: 'hero-couture', formation: 'couture-africaine', label: 'Couture africaine', tag: 'COUTURE AFRICAINE',
      titre: ['De vos ambitions', 'à votre métier.'],
      texte: 'Pagne, kaba, tenues de cérémonie : transformez votre créativité en un véritable atelier de couture.',
      photo: 'Photo plein cadre — couturière africaine dans son atelier, tissus wax en arrière-plan',
      fallback: 'parcours-hero', fallbackFocus: '80% 22%'
    },
    {
      slot: 'hero-esthetique', formation: 'esthetique', label: 'Esthétique & beauté', tag: 'ESTHÉTIQUE · COSMÉTIQUE',
      titre: ['Vos talents, vos compétences.', 'Votre avenir.'],
      texte: 'Soins, onglerie, maquillage, coiffure, cosmétique naturelle : des métiers de la beauté en pleine croissance.',
      photo: 'Photo plein cadre — esthéticienne réalisant un soin du visage en institut',
      fallback: 'f-coiffure', fallbackFocus: '50% 30%'
    },
    {
      slot: 'hero-comptabilite', formation: 'comptabilite', label: 'Comptabilité & gestion', tag: 'COMPTABILITÉ · GESTION',
      titre: ['Des compétences concrètes.', 'Un avenir professionnel.'],
      texte: 'Comptabilité, secrétariat, informatique : les métiers qui font tourner toutes les entreprises.',
      photo: 'Photo plein cadre — jeune comptable à son bureau, chemise verte à col jaune-or',
      fallback: 'f-comptabilite', fallbackFocus: '50% 28%'
    }
  ].map((s, i) => {
    const f = bySlug(s.formation);
    return {
      ...s,
      n: String(i + 1).padStart(2, '0'),
      url: f.url,
      meta: `${f.duree.toUpperCase()}${f.cqp ? ' · CQP' : ''}`
    };
  }),

  // Carrousel « Choisissez votre métier »
  filieres: ouvertes
};
