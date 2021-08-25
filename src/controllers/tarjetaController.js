const shortid = require('shortid');
const createError = require('http-errors');
const sequelize = require('../database/config');

module.exports.createTarjeta = async (req, res) => {
  const { titulo, contenido, mazo } = req.body;
  try {
    if (!titulo || !contenido || !mazo) {
      throw createError(400, 'El TITULO, CONTENIDO y MAZO son obligatorios');
    }
    // validamos que el titulo de la tarjeta sea unico
    const tarjetaExist = await sequelize.query(
      `SELECT * FROM "Tarjetas" WHERE "titulo" = '${titulo}'`,
    );
    if (tarjetaExist[1].rowCount !== 0) {
      throw createError(404, 'La tarjeta ya existe, intenta con otro titulo');
    }

    const id = shortid.generate();
    const today = new Date();
    const date = `${today.getFullYear()}-${
      today.getMonth() + 1
    }-${today.getDate()}`;

    const mazoObject = await sequelize.query(
      `SELECT * FROM "Mazos" WHERE "nombre" = '${mazo}'`,
    );
    if (mazoObject[1].rowCount === 0) {
      throw createError(404, 'El mazo no existe');
    }
    const mazoId = mazoObject[0][0].id;

    const tarjeta = await sequelize.query(
      `INSERT INTO "Tarjetas" ("id","mazoId","titulo","contenido","fechaCreacion")
      VALUES('${id}','${mazoId}','${titulo}','${contenido}','${date}')`,
    );
    if (tarjeta[1] !== 1) {
      throw createError(400, 'No se pudo crear la Tarjeta');
    }
    res
      .status(200)
      .send({ msg: `La tarjeta ${titulo} se ha creado exitosamente ` });
  } catch (error) {
    console.log(error);
    res.status(error.status).send(error);
  }
};

module.exports.getTarjetas = async (req, res) => {
  try {
    const tarjetas = await sequelize.query('SELECT * FROM "Tarjetas"');
    res.send({ Tarjetas: tarjetas[0] });
  } catch (error) {
    console.log(error);
    res.status(error.status).send(error);
  }
};

module.exports.updateTarjetas = async (req, res) => {
  try {
    let { titulo, contenido } = req.body;
    if (!titulo && !contenido) {
      throw createError(400, 'Puedes actualizar titulo y/o contenido');
    }

    const tarjeta = await sequelize.query(
      `SELECT * FROM "Tarjetas" WHERE "id" = '${req.params.id}'`,
    );
    if (tarjeta[1].rowCount === 0) {
      throw createError(404, 'La tarjeta no existe');
    }

    if (!titulo) {
      titulo = tarjeta[0][0].titulo;
    }
    if (!contenido) {
      contenido = tarjeta[0][0].contenido;
    }

    await sequelize.query(
      `UPDATE "Tarjetas" SET "titulo"='${titulo}',"contenido"='${contenido}'
           WHERE "id" = '${req.params.id}'`,
    );

    const tarjetaUpdated = await sequelize.query(
      `SELECT * FROM "Tarjetas" WHERE "id" = '${req.params.id}'`,
    );
    res.status(200).send({ 'Tarjeta modificada': tarjetaUpdated[0] });
  } catch (error) {
    console.log(error);
    res.status(error.status).send(error);
  }
};

module.exports.deleteTarjeta = async (req, res) => {
  try {
    const tarjeta = await sequelize.query(
      `SELECT * FROM "Tarjetas" WHERE "id" = '${req.params.id}'`,
    );
    if (tarjeta[1].rowCount === 0) {
      throw createError(404, 'La tarjeta no existe');
    }
    await sequelize.query(
      `DELETE FROM "Tarjetas" WHERE "id" = '${req.params.id}'`,
    );

    res.status(200).send({ 'Tarjeta eliminada:': tarjeta[0] });
  } catch (error) {
    res.status(error.status).send(error);
  }
};
