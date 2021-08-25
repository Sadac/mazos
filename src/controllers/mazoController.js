const shortid = require('shortid');
const createError = require('http-errors');
const sequelize = require('../database/config');
const Mazos = require('../models/MazosModel');
const Tarjetas = require('../models/tarjetasModels');

module.exports.createMazo = async (req, res) => {
  const {
    nombre, descripcion, email,
  } = req.body;
  let { completado } = req.body;
  try {
    if (!nombre || !descripcion || !email) {
      throw createError(
        400,
        'Debes colocar el NOMBRE, DESCRIPCION e EMAIL del usuario',
      );
    }

    // validamos que el nombre del mazo no exista
    const mazoExist = await sequelize.query(
      `SELECT * FROM "Mazos" WHERE "nombre" = '${nombre}'`,
    );
    if (mazoExist[1].rowCount !== 0) {
      throw createError(400, 'El mazo ya existe, intenta con otro nombre');
    }

    // Obtenemos el usuario al cual pertenecera el mazo
    const user = await sequelize.query(
      `SELECT * FROM "Usuarios" WHERE "email" = '${email}'`,
    );
    if (user[1].rowCount === 0) {
      throw createError(404, 'El usuario no existe, intenta con otro email');
    }

    const usuarioId = user[0][0].id;
    const id = shortid.generate();
    const today = new Date();
    const date = `${today.getFullYear()}-${
      today.getMonth() + 1
    }-${today.getDate()}`;
    if (completado === undefined) {
      completado = false;
    }
    const mazo = await sequelize.query(`
    INSERT INTO "Mazos" ("id","usuarioId","nombre","descripcion",
    "completado","fechaCreacion") VALUES
     ('${id}','${usuarioId}','${nombre}','${descripcion}','${completado}','${date}')`);
    if (mazo[1] !== 1) {
      throw createError(400, 'No se pudo crear el Mazo');
    }
    res.status(200).send({ msg: `El mazo ${nombre} fue creado exitosamente` });
  } catch (error) {
    console.log(error);
    res.status(error.status).send(error);
  }
};

module.exports.getMazos = async (req, res) => {
  try {
    const mazos = await Mazos.findAll({
      include: [{ model: Tarjetas }],
    });
    res.status(200).send(mazos);
  } catch (error) {
    console.log(error);
    res.status(error.status).send(error);
  }
};

module.exports.updateMazos = async (req, res) => {
  try {
    let { nombre, descripcion, completado } = req.body;
    if (!nombre && !descripcion && !completado) {
      throw createError(400, 'Puedes actualizar nombre, descripcion y/o completado');
    }

    const mazo = await sequelize.query(
      `SELECT * FROM "Mazos" WHERE "id" = '${req.params.id}'`,
    );
    if (mazo[1].rowCount === 0) {
      throw createError(404, 'El mazo no existe');
    }
    if (!nombre) {
      nombre = mazo[0][0].nombre;
    }
    if (!descripcion) {
      descripcion = mazo[0][0].descripcion;
    }
    if (!completado) {
      completado = mazo[0][0].completado;
    }

    await sequelize.query(
      `UPDATE "Mazos" SET "nombre"='${nombre}',"descripcion"='${descripcion}',
        "completado"='${completado}' WHERE "id" = '${req.params.id}'`,
    );

    const mazoUpdated = await sequelize.query(
      `SELECT * FROM "Mazos" WHERE "id" = '${req.params.id}'`,
    );
    res.status(200).send({ 'Mazo modificado': mazoUpdated[0] });
  } catch (error) {
    console.log(error);
    res.status(error.status).send(error);
  }
};

module.exports.deleteMazo = async (req, res) => {
  try {
    const mazo = await sequelize.query(
      `SELECT * FROM "Mazos" WHERE "id" = '${req.params.id}'`,
    );
    if (mazo[1].rowCount === 0) {
      throw createError(404, 'El mazo no existe');
    }
    await sequelize.query(
      `DELETE FROM "Mazos" WHERE "id" = '${req.params.id}'`,
    );

    res.status(200).send({ 'Mazo eliminado:': mazo[0] });
  } catch (error) {
    res.status(error.status).send(error);
  }
};
