const { ouvertes, aEtudier, DOMAINES, CYCLES } = require('./formations');

// Durées réellement proposées (hors modules de 3 mois), triées
const mois = [...new Set(ouvertes.filter(f => f.mois !== 3).map(f => f.mois))].sort((a, b) => a - b);

module.exports = {
  list: ouvertes,
  aEtudier,
  durees: [['all', 'Toutes'], ...mois.map(m => [String(m), `${m} mois`]), ['module', 'Modules de 3 mois']],
  domaines: [['all', 'Tous'], ...Object.entries(DOMAINES).filter(([k]) => ouvertes.some(f => f.dom === k))],
  cycles: [['all', 'Tous'], ...Object.entries(CYCLES).map(([k, c]) => [k, c.court])],
  // Bloc « Trois niveaux de formation » (exemples : une formation par domaine)
  niveaux: Object.entries(CYCLES).map(([k, c], i) => {
    const liste = ouvertes.filter(f => f.cycle === k);
    return { id: k, n: String(i + 1).padStart(2, '0'), ...c, nombre: liste.length, exemples: [...new Map(liste.slice().reverse().map(f => [f.dom, f.label])).values()].reverse().slice(0, 5) };
  })
};
