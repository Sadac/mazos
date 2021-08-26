const Sequelize = require('sequelize');
const sequelize = require('../database/config');

const UsuarioMedallas = sequelize.define(
  'UsuarioMedallas',
  {
    usuarioId: {
      type: Sequelize.STRING,
      primaryKey: true,
    },
    medallaId: {
      type: Sequelize.STRING,
    },
    fechaCreacion: {
      type: Sequelize.DATE,
    },
  },
  { timestamps: false },
);

module.exports = UsuarioMedallas;
