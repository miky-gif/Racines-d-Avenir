const { ouvertes, aEtudier } = require('./formations');

module.exports = {
  list: ouvertes,
  aEtudier,
  durees: [['all', 'Toutes'], ['6', '6 mois'], ['9', '9 mois'], ['12', '12 mois'], ['module', 'Modules de 3 mois']],
  domaines: [['all', 'Tous'], ['mode', 'Couture & beauté'], ['btp', 'BTP & techniques'], ['numerique', 'Numérique & IA'], ['services', 'Services & gestion']],
  niveaux: [['all', 'Tous'], ['Sans diplôme', 'Sans diplôme'], ['CEP', 'CEP'], ['BEPC', 'BEPC'], ['Probatoire', 'Probatoire']]
};
