const shortid = require('shortid');
const createError = require('http-errors');
const sequelize = require('../database/config');
const { find, deleteRegister } = require('./helpers/helper');

module.exports.createMedalla = async (req, res) => {
  const { nombre, descripcion, puntos } = req.body;
  try {
    if (!nombre || !descripcion || !puntos) {
      throw createError(
        400,
        'El NOMBRE, DESCRIPCION, y PUNTOS son obligatorios',
      );
    }

    // validamos que no hayan dos medallas con el mismo nombre
    const medallaExist = await find('Medallas', 'nombre', nombre);
    if (medallaExist[1].rowCount !== 0) {
      throw createError(404, 'La Medalla ya existe, intenta con otro nombre');
    }

    // obtenemos el ID y la fecha de Creacion
    const id = shortid.generate();
    const today = new Date();
    const date = `${today.getFullYear()}-${
      today.getMonth() + 1
    }-${today.getDate()}`;

    // Creamos la medalla
    const medalla = await sequelize.query(
      `INSERT INTO "Medallas" ("id","nombre","descripcion","puntos","fechaCreacion")
      VALUES('${id}','${nombre}','${descripcion}','${puntos}','${date}')`,
    );
    if (medalla[1] !== 1) {
      throw createError(400, 'No se pudo crear la Medalla');
    }
    res
      .status(200)
      .send({ msg: `La Medalla ${nombre} se ha creado exitosamente ` });
  } catch (error) {
    res.status(error.status).send(error);
  }
};

module.exports.getMedallas = async (req, res) => {
  try {
    const medallas = await sequelize.query('SELECT * FROM "Medallas"');
    res.send({ Medallas: medallas[0] });
  } catch (error) {
    res.status(error.status).send(error);
  }
};

module.exports.updateMedallas = async (req, res) => {
  try {
    let { nombre, descripcion, puntos } = req.body;
    if (!nombre && !descripcion && !puntos) {
      throw createError(400, 'Por favor colocar NOMBRE, DESCRIPCION y/o PUNTOS');
    }

    const medalla = await find('Medallas', 'id', req.params.id);
    if (medalla[1].rowCount === 0) {
      throw createError(404, 'La Medalla no existe');
    }

    if (!nombre) {
      nombre = medalla[0][0].nombre;
    }
    if (!descripcion) {
      descripcion = medalla[0][0].descripcion;
    }
    if (!puntos) {
      puntos = medalla[0][0].puntos;
    }

    await sequelize.query(
      `UPDATE "Medallas" SET "nombre"='${nombre}',"descripcion"='${descripcion}',
      "puntos"='${puntos}' WHERE "id" = '${req.params.id}'`,
    );

    const medallaUpdated = await find('Medallas', 'id', req.params.id);
    res.status(200).send({ 'Medalla Actualizada': medallaUpdated[0] });
  } catch (error) {
    res.status(error.status).send(error);
  }
};

module.exports.deleteMedalla = async (req, res) => {
  try {
    const medalla = await find('Medallas', 'id', req.params.id);
    if (medalla[1].rowCount === 0) {
      throw createError(404, 'La Medalla no existe');
    }
    await deleteRegister('Medallas', 'id', req.params.id);
    res.status(200).send({ 'Medalla eliminada:': medalla[0] });
  } catch (error) {
    res.status(error.status).send(error);
  }
};
