const Sequelize = require('sequelize');
const sequelize = require('../database/config');
const UsuariosMedallas = require('./usuariosMedallasModel');

const Medallas = sequelize.define('Medallas', {
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
{ timestamps: false });

Medallas.hasMany(UsuariosMedallas, {
  foreignKey: 'medallaId',
  sourceKey: 'id',
});

UsuariosMedallas.belongsTo(Medallas, {
  foreignKey: 'medallaId',
  sourceKey: 'id',
});

module.exports = Medallas;
