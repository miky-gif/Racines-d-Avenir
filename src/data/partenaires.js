module.exports = {
  // « Stages » est présélectionné, comme dans la maquette
  types: ['Stages', 'Emplois', 'Formation', 'Expertise', 'Soutien'].map(label => ({ label, on: label === 'Stages' }))
};
