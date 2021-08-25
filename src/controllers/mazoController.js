const shortid = require('shortid');
const createError = require('http-errors');
const sequelize = require('../database/config');

module.exports.createMazo = async (req, res) => {
  const { nombre, descripcion, completado } = req.body;
  try {
    if (!nombre && !descripcion && !completado) {
      throw createError(
        400,
        'Debes colocar el NOMBRE, DESCRIPCION y COMPLETADO',
      );
    }
    const id = shortid.generate();
    const today = new Date();
    const date = `${today.getFullYear()}-${
      today.getMonth() + 1
    }-${today.getDate()}`;

    const usuarioId = 'Cxfc5_Iyl';

    const mazo = await sequelize.query(`
    INSERT INTO "Mazos" ("id","usuarioId","nombre","descripcion",
    "completado","fechaCreacion") VALUES
     ('${id}','${usuarioId}','${nombre}','${descripcion}','${completado}','${date}')`);
    if (mazo[1] !== 1) {
      throw createError(400, 'No se pudo crear el Mazo');
    }
    res.status(200).send({ msg: 'its work' });
  } catch (error) {
    console.log(error);
    res.status(error.status).send(error);
  }
};

module.exports.getMazos = async (req, res) => {
  try {
    const mazos = await sequelize.query('SELECT * FROM "Mazos"');
    res.send({ Mazos: mazos[0] });
  } catch (error) {
    console.log(error);
    res.status(error.status).send(error);
  }
};

module.exports.updateMazos = async (req, res) => {
  try {
    let { nombre, descripcion, completado } = req.body;
    if (!nombre && !descripcion && !completado) {
      throw new createError(400, 'Por favor colocar los datos a actualiar');
    }

    const mazo = await sequelize.query(
      `SELECT * FROM "Mazos" WHERE "id" = '${req.params.id}'`,
    );
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
    res.status(200).send(mazoUpdated[0]);
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
