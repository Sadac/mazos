const Sequelize = require("sequelize");
const sequelize = require("../database/config");
const Tarjetas = require("./tarjetasModels");

const Mazos = sequelize.define(
  "Mazos",
  {
    id: {
      type: Sequelize.STRING,
      primaryKey: true,
    },
    usuarioId: {
      type: Sequelize.STRING,
    },
    nombre: {
      type: Sequelize.STRING,
    },
    descripcion: {
      type: Sequelize.STRING,
    },
    completado: {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
    },
    fechaCreacion: {
      type: Sequelize.DATE,
    },
  },
  {
    timestamps: false,
  }
);

Mazos.hasMany(Tarjetas, {
  foreignKey: "mazoId",
  sourceKey: "id",
});

Tarjetas.belongsTo(Mazos, {
  foreignKey: "mazoId",
  sourceKey: "id",
});

module.exports = Mazos;
