const Sequelize = require('sequelize');
const sequelize = require('../database/config');

const Tarjetas = sequelize.define(
  'Tarjetas',
  {
    id: {
      type: Sequelize.STRING,
      primaryKey: true,
    },
    mazoId: {
      type: Sequelize.STRING,
    },
    titulo: {
      type: Sequelize.STRING,
    },
    contenido: {
      type: Sequelize.STRING,
    },
    fechaCreacion: {
      type: Sequelize.DATE,
    },
  },
  {
    timestamps: false,
  },
);

module.exports = Tarjetas;
