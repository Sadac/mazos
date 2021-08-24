const Sequelize = require('sequelize');
const sequelize = require('../database/config');
const MazosModel = require('./MazosModel');

const Usuarios = sequelize.define('Usuarios', {
  id: {
    type: Sequelize.STRING,
    primaryKey: true,
  },
  nombre: {
    type: Sequelize.STRING,
  },
  apellido: {
    type: Sequelize.STRING,
  },
  email: {
    type: Sequelize.STRING,
  },
  fechaCreacion: {
    type: Sequelize.DATE,
  },
},
{ timestamps: false });

Usuarios.hasMany(MazosModel, {
  foreignKey: 'usuarioId',
  sourceKey: 'id',
});

MazosModel.belongsTo(Usuarios, {
  foreignKey: 'usuarioId',
  sourceKey: 'id',
});

module.exports = Usuarios;
