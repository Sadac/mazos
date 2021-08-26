const shortid = require("shortid");
const createError = require("http-errors");
const sequelize = require("../database/config");
const Usuarios = require("../models/userModel");
const Mazos = require("../models/MazosModel");
const Medallas = require("../models/medallasModel");
const { find, deleteRegister } = require("./helpers/helper");

module.exports.createUser = async (req, res) => {
  try {
    const { nombre, apellido, email } = req.body;
    if (!nombre || !apellido || !email) {
      throw createError(400, "El NOMBRE, APELLIDO e EMAIL son obligatorios");
    }

    // validamos que el email sea unico
    const userExist = await find("Usuarios", "email", email);
    if (userExist[1].rowCount !== 0) {
      throw createError(404, "El usuario ya existe, intenta con otro email");
    }

    const id = shortid.generate();
    const today = new Date();
    const date = `${today.getFullYear()}-${
      today.getMonth() + 1
    }-${today.getDate()}`;

    const user = await sequelize.query(`
   INSERT INTO "Usuarios" ("id","nombre","apellido","email","fechaCreacion") 
   VALUES 
   ('${id}','${nombre}','${apellido}','${email}','${date}')`);
    if (user[1] !== 1) {
      throw createError(500, "Hubo un error creando al usuario");
    }
    res
      .status(201)
      .send({ msg: `El usuario ${nombre} fue creado exitosamente` });
  } catch (error) {
    console.log(error);
    res.status(error.status).send(error);
  }
};

module.exports.getUsers = async (req, res) => {
  try {
    const users = await Usuarios.findAll({
      include: [
        {
          model: Mazos,
        },
      ],
    });

    res.status(200).send(users);
  } catch (error) {
    console.log(error);
    res.status(error.status).send(error);
  }
};

module.exports.updateUser = async (req, res) => {
  try {
    let { nombre, apellido, email } = req.body;
    if (nombre === undefined && apellido === undefined && email === undefined) {
      throw createError(400, "Puedes actualizar nombre, apellido y/o email");
    }
    const user = await find("Usuarios", "id", req.params.id);
    if (user[1].rowCount === 0) {
      throw createError(404, "El usuario no existe");
    }

    if (!nombre) {
      nombre = user[0][0].nombre;
    }
    if (!apellido) {
      apellido = user[0][0].apellido;
    }
    if (!email) {
      email = user[0][0].email;
    }

    await sequelize.query(
      `UPDATE "Usuarios" SET "nombre"='${nombre}',"apellido"='${apellido}',
      "email"='${email}' WHERE "id" = '${req.params.id}'`
    );
    const userUpdated = await find("Usuarios", "id", req.params.id);
    res.status(200).send({ "Usuario modificado:": userUpdated[0] });
  } catch (error) {
    console.log(error);
    res.status(error.status).send(error);
  }
};

module.exports.deleteUser = async (req, res) => {
  try {
    const user = await find("Usuarios", "id", req.params.id);
    if (user[1].rowCount === 0) {
      throw createError(404, "El usuario no existe");
    }
    await deleteRegister("Usuarios", "id", req.params.id);
    res.status(200).send({ "Usuario eliminado:": user[0] });
  } catch (error) {
    console.log(error);
    res.status(error.status).send(error);
  }
};

module.exports.addMedal = async (req, res) => {
  const { email, nombre } = req.body;
  try {
    // Obtenemos el usuario
    const user = await sequelize.query(
      `SELECT * FROM "Usuarios" WHERE "email" = '${email}'`
    );
    if (user[1].rowCount === 0) {
      throw createError(404, "El usuario no existe");
    }
    const usuarioId = user[0][0].id;

    // Obtenemos la medalla
    const medalla = await sequelize.query(
      `SELECT * FROM "Medallas" WHERE nombre='${nombre}'`
    );
    if (medalla[1].rowCount === 0) {
      throw createError(404, "La medalla no existe, intenta con otro nombre");
    }
    const medallaId = medalla[0][0].id;

    const today = new Date();
    const date = `${today.getFullYear()}-${
      today.getMonth() + 1
    }-${today.getDate()}`;

    const usuarioMedalla = await sequelize.query(`
    INSERT INTO "UsuarioMedallas" ("usuarioId","medallaId","fechaCreacion") 
    VALUES 
    ('${usuarioId}','${medallaId}','${date}')`);
    if (usuarioMedalla[1] !== 1) {
      throw createError(500, "Hubo un error creando al usuario");
    }

    res.send({
      "Medalla ganada": `El usuario ${user[0][0].nombre} ha ganado la medalla ${medalla[0][0].nombre}`,
    });
  } catch (error) {
    console.log(error);
    res.status(error.status).send(error);
  }
};
