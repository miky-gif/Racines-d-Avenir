const FILIERES = require('./filieres');

module.exports = {
  list: FILIERES.map((f, i) => ({
    ...f,
    slot: 'fil-' + (i + 1),
    photo: 'Photo — ' + f.label.toLowerCase(),
    meta: f.mois + ' MOIS · ' + f.niv.toUpperCase()
  })),
  durees: [['all', 'Toutes'], ['court', '3 mois ou moins'], ['moyen', '4 à 6 mois'], ['long', 'Plus de 6 mois']],
  domaines: [['all', 'Tous'], ['num', 'Numérique & gestion'], ['sante', 'Santé & bien-être'], ['com', 'Commerce & services'], ['btp', 'BTP & technique']],
  niveaux: [['all', 'Tous'], ['Sans diplôme', 'Sans diplôme'], ['CEP', 'CEP'], ['BEPC', 'BEPC'], ['Probatoire', 'Probatoire']]
};
