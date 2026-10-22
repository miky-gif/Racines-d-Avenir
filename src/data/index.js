const FILIERES = require('./filieres');

module.exports = {
  filieres: FILIERES.map((f, i) => ({
    ...f,
    slot: 'rail-' + (i + 1),
    photo: 'Photo — atelier ' + f.label.toLowerCase()
  }))
};
