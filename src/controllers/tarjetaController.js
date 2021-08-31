const shortid = require("shortid");
const createError = require("http-errors");
const sequelize = require("../database/config");
const { find, deleteRegister } = require("./helpers/helper");
const Tarjetas = require("../models/tarjetasModels");
const Mazos = require("../models/MazosModel");

module.exports.createTarjeta = async (req, res) => {
  const { titulo, contenido, mazo } = req.body;
  try {
    if (!titulo || !contenido || !mazo) {
      throw createError(
        400,
        "El TITULO, CONTENIDO y MAZO (nombre) son obligatorios"
      );
    }
    // validamos que el titulo de la tarjeta sea unico
    const tarjetaExist = await find("Tarjetas", "titulo", titulo);
    if (tarjetaExist[1].rowCount !== 0) {
      throw createError(404, "La tarjeta ya existe, intenta con otro titulo");
    }

    const id = shortid.generate();
    const today = new Date();
    const date = `${today.getFullYear()}-${
      today.getMonth() + 1
    }-${today.getDate()}`;

    const mazoObject = await find("Mazos", "nombre", mazo);
    if (mazoObject[1].rowCount === 0) {
      throw createError(404, "El mazo no existe");
    }
    const mazoId = mazoObject[0][0].id;

    const tarjeta = await sequelize.query(
      `INSERT INTO "Tarjetas" ("id","mazoId","titulo","contenido","fechaCreacion")
      VALUES('${id}','${mazoId}','${titulo}','${contenido}','${date}')`
    );
    if (tarjeta[1] !== 1) {
      throw createError(400, "No se pudo crear la Tarjeta");
    }
    res
      .status(200)
      .send({ msg: `La tarjeta ${titulo} se ha creado exitosamente ` });
  } catch (error) {
    res.status(error.status).send(error);
  }
};

module.exports.getTarjetas = async (req, res) => {
  try {
    const tarjetas = await Tarjetas.findAll({
      include: [
        {
          model: Mazos,
          attributes: ["nombre"],
        },
      ],
    });
    const response = tarjetas.map((tarjeta) => ({
      id: tarjeta.id,
      mazoId: tarjeta.mazoId,
      titulo: tarjeta.titulo,
      contenido: tarjeta.contenido,
      fechaCreacion: tarjeta.fechaCreacion,
      Mazo: tarjeta.Mazo.nombre,
    }));
    res.status(200).send(response);
  } catch (error) {
    console.log(error);
    res.status(error.status).send(error);
  }
};

module.exports.updateTarjetas = async (req, res) => {
  try {
    let { titulo, contenido } = req.body;
    if (!titulo && !contenido) {
      throw createError(400, "Puedes actualizar titulo y/o contenido");
    }

    const tarjeta = await find("Tarjetas", "id", req.params.id);
    if (tarjeta[1].rowCount === 0) {
      throw createError(404, "La tarjeta no existe");
    }

    if (!titulo) {
      titulo = tarjeta[0][0].titulo;
    }
    if (!contenido) {
      contenido = tarjeta[0][0].contenido;
    }

    await sequelize.query(
      `UPDATE "Tarjetas" SET "titulo"='${titulo}',"contenido"='${contenido}'
           WHERE "id" = '${req.params.id}'`
    );

    const tarjetaUpdated = await find("Tarjetas", "id", req.params.id);
    res.status(200).send({ "Tarjeta modificada": tarjetaUpdated[0] });
  } catch (error) {
    res.status(error.status).send(error);
  }
};

module.exports.deleteTarjeta = async (req, res) => {
  try {
    const tarjeta = await find("Tarjetas", "id", req.params.id);
    if (tarjeta[1].rowCount === 0) {
      throw createError(404, "La tarjeta no existe");
    }
    await deleteRegister("Tarjetas", "id", req.params.id);
    res.status(200).send({ "Tarjeta eliminada:": tarjeta[0] });
  } catch (error) {
    res.status(error.status).send(error);
  }
};
