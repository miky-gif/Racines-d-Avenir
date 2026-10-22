// Les 10 filières du centre. Partagé par l'accueil et le catalogue.
//   dom : numérique & gestion (num), santé & bien-être (sante),
//         commerce & services (com), BTP & technique (btp)
//   niv : niveau d'entrée minimum
module.exports = [
  { label: 'Informatique et réseaux', icon: 'Monitor', dom: 'num', mois: 6, niv: 'BEPC' },
  { label: 'Comptabilité et gestion financière', icon: 'Calculator', dom: 'num', mois: 6, niv: 'Probatoire' },
  { label: 'Santé', icon: 'Stethoscope', dom: 'sante', mois: 9, niv: 'BEPC' },
  { label: 'Commerce', icon: 'Store', dom: 'com', mois: 3, niv: 'CEP' },
  { label: 'Administration', icon: 'FolderOpen', dom: 'num', mois: 4, niv: 'BEPC' },
  { label: 'Esthétique', icon: 'Scissors', dom: 'sante', mois: 4, niv: 'Sans diplôme' },
  { label: 'Restauration', icon: 'ChefHat', dom: 'com', mois: 3, niv: 'Sans diplôme' },
  { label: 'Maçonnerie', icon: 'BrickWall', dom: 'btp', mois: 3, niv: 'Sans diplôme' },
  { label: 'Mécanique', icon: 'Wrench', dom: 'btp', mois: 6, niv: 'CEP' },
  { label: 'Menuiserie et services', icon: 'Hammer', dom: 'btp', mois: 4, niv: 'Sans diplôme' }
].map((f, i) => ({ ...f, n: String(i + 1).padStart(2, '0') }));
