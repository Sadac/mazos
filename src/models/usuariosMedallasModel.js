const Sequelize = require('sequelize');
const sequelize = require('../database/config');

const UsuariosMedallas = sequelize.define('UsuariosMedallas', {
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
{ timestamps: false });


module.exports = UsuariosMedallas;
