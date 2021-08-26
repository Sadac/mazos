const Sequelize = require('sequelize');
const sequelize = require('../database/config');
const Mazos = require('./MazosModel');
const UsuarioMedallas = require('./usuariosMedallasModel');

const Usuarios = sequelize.define(
  'Usuarios',
  {
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
  { timestamps: false },
);

Usuarios.hasMany(Mazos, {
  foreignKey: 'usuarioId',
  sourceKey: 'id',
});

Mazos.belongsTo(Usuarios, {
  foreignKey: 'usuarioId',
  sourceKey: 'id',
});

Usuarios.hasMany(UsuarioMedallas, {
  foreignKey: 'usuarioId',
  sourceKey: 'id',
});

UsuarioMedallas.belongsTo(Usuarios, {
  foreignKey: 'usuarioId',
  sourceKey: 'id',
});
module.exports = Usuarios;
