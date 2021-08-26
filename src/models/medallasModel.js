const Sequelize = require('sequelize');
const sequelize = require('../database/config');
const UsuarioMedallas = require('./usuariosMedallasModel');

const Medallas = sequelize.define(
  'Medallas',
  {
    id: {
      type: Sequelize.STRING,
      primaryKey: true,
    },
    nombre: {
      type: Sequelize.STRING,
    },
    descripcion: {
      type: Sequelize.STRING,
    },
    puntos: {
      type: Sequelize.INTEGER,
    },
    fechaCreacion: {
      type: Sequelize.DATE,
    },
  },
  { timestamps: false },
);

Medallas.hasMany(UsuarioMedallas, {
  foreignKey: 'medallaId',
  sourceKey: 'id',
});

UsuarioMedallas.belongsTo(Medallas, {
  foreignKey: 'medallaId',
  sourceKey: 'id',
});

module.exports = Medallas;
