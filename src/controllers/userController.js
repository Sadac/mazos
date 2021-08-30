const shortid = require('shortid');
const createError = require('http-errors');
const sequelize = require('../database/config');
const Usuarios = require('../models/userModel');
const Mazos = require('../models/MazosModel');
const { find, deleteRegister } = require('./helpers/helper');

module.exports.createUser = async (req, res) => {
  try {
    const { nombre, apellido, email } = req.body;
    if (!nombre || !apellido || !email) {
      throw createError(400, 'El NOMBRE, APELLIDO e EMAIL son obligatorios');
    }

    // validamos que el email sea unico
    const userExist = await find('Usuarios', 'email', email);
    if (userExist[1].rowCount !== 0) {
      throw createError(404, 'El usuario ya existe, intenta con otro email');
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
      throw createError(500, 'Hubo un error creando al usuario');
    }
    res
      .status(201)
      .send({ msg: `El usuario ${nombre} fue creado exitosamente` });
  } catch (error) {
    res.status(error.status).send(error);
  }
};

module.exports.getUsers = async (req, res) => {
  try {
    const users = await sequelize.query('SELECT * FROM "Usuarios"');
    res.status(200).send(users[0]);
  } catch (error) {
    res.status(error.status).send(error);
  }
};

module.exports.getUserDetails = async (req, res) => {
  try {
    const medallas = [];
    const user = await Usuarios.findAll({
      where: {
        id: req.params.id,
      },
      include: [
        {
          model: Mazos,
        },
      ],
    });
    const usuarioMedallas = await find(
      'UsuarioMedallas',
      'usuarioId',
      req.params.id,
    );

    for (let i = 0; i < usuarioMedallas[0].length; i += 1) {
      // eslint-disable-next-line
      const medalla = await find(
        'Medallas',
        'id',
        usuarioMedallas[0][i].medallaId,
      );
      medallas.push(medalla[0]);
    }
    user[0].dataValues.medallas = medallas;

    res.status(200).send(user);
  } catch (error) {
    res.status(error.status).send(error);
  }
};

module.exports.updateUser = async (req, res) => {
  try {
    let { nombre, apellido, email } = req.body;
    if (!nombre && !apellido && !email) {
      throw createError(400, 'Puedes actualizar nombre, apellido y/o email');
    }
    const user = await find('Usuarios', 'id', req.params.id);
    if (user[1].rowCount === 0) {
      throw createError(404, 'El usuario no existe');
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
      `UPDATE "Usuarios" SET "nombre"='${nombre}',"apellido"='${apellido}' 
      WHERE "id" = '${req.params.id}'`,
    );
    const userUpdated = await find('Usuarios', 'id', req.params.id);
    res.status(200).send({ 'Usuario modificado:': userUpdated[0] });
  } catch (error) {
    res.status(error.status).send(error);
  }
};

module.exports.deleteUser = async (req, res) => {
  try {
    const user = await find('Usuarios', 'id', req.params.id);
    if (user[1].rowCount === 0) {
      throw createError(404, 'El usuario no existe');
    }
    await deleteRegister('Usuarios', 'id', req.params.id);
    res.status(200).send({ 'Usuario eliminado:': user[0] });
  } catch (error) {
    res.status(error.status).send(error);
  }
};

module.exports.addMedal = async (req, res) => {
  const { email, nombre } = req.body;
  try {
    if (!email || !nombre) {
      throw createError(
        400,
        'EMAIL del usuario y NOMBRE de la medalla son obligatorios',
      );
    }
    // Obtenemos el usuario
    const user = await find('Usuarios', 'email', email);
    if (user[1].rowCount === 0) {
      throw createError(404, 'El usuario no existe');
    }
    const usuarioId = user[0][0].id;

    // Obtenemos la medalla
    const medalla = await find('Medallas', 'nombre', nombre);
    if (medalla[1].rowCount === 0) {
      throw createError(404, 'La medalla no existe, intenta con otro nombre');
    }
    const medallaId = medalla[0][0].id;

    // validamos si el usuario ya tiene la medalla
    const medallaGanada = await sequelize.query(
      `SELECT * FROM "UsuarioMedallas" WHERE
      "usuarioId" = '${usuarioId}' and "medallaId" = '${medallaId}'`,
    );
    if (medallaGanada[1].rowCount > 0) {
      throw createError(400, 'El usuario ya tiene ganada esta medalla.');
    }
    // Obtenemos la fechaCreacion
    const today = new Date();
    const date = `${today.getFullYear()}-${
      today.getMonth() + 1
    }-${today.getDate()}`;

    const usuarioMedalla = await sequelize.query(`
    INSERT INTO "UsuarioMedallas" ("usuarioId","medallaId","fechaCreacion") 
    VALUES 
    ('${usuarioId}','${medallaId}','${date}')`);
    if (usuarioMedalla[1] !== 1) {
      throw createError(500, 'Hubo un error creando al usuario');
    }

    res.status(200).send({
      'Medalla ganada': `El usuario ${user[0][0].nombre}
      ha ganado la medalla ${medalla[0][0].nombre}`,
    });
  } catch (error) {
    res.status(error.status).send(error);
  }
};

module.exports.deleteMedal = async (req, res) => {
  const { usuarioId, medallaId } = req.body;

  try {
    if (!usuarioId || !medallaId) {
      throw createError(400, 'USUARIOID y MEDALLAID son obligatorios');
    }
    // validamos que el usuario tenga la medalla ganada
    const medallaGanada = await sequelize.query(
      `SELECT * FROM "UsuarioMedallas" WHERE
      "usuarioId" = '${usuarioId}' and "medallaId" = '${medallaId}'`,
    );
    if (medallaGanada[1].rowCount === 0) {
      throw createError(
        400,
        'No se puede eliminar porque el usuario no tiene la medalla ganada.',
      );
    }

    await sequelize.query(`
    DELETE FROM "UsuarioMedallas"
    WHERE "usuarioId" = '${usuarioId}' and "medallaId" = '${medallaId}'
    `);

    res.status(200).send({ message: 'El usuario a perdido la medalla exitosamente.' });
  } catch (error) {
    res.status(error.status).send(error);
  }
};
