const shortid = require('shortid');
const createError = require('http-errors');
const sequelize = require('../database/config');

module.exports.createUser = async (req, res) => {
  try {
    const { nombre, apellido, email } = req.body;
    if (!nombre) {
      throw createError(400, 'El nombre es obligatorio');
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
    console.log(error);
    res.status(error.status).send(error);
  }
};

module.exports.getUsers = async (req, res) => {
  try {
    const users = await sequelize.query('SELECT * FROM "Usuarios"');
    res.send({ users: users[0] });
  } catch (error) {
    console.log(error);
    res.status(error.status).send(error);
  }
};

module.exports.updateUser = async (req, res) => {
  try {
    let { nombre, apellido, email } = req.body;
    if (nombre === undefined && apellido === undefined && email === undefined) {
      throw createError(400, 'Puedes actualizar nombre, apellido y/o email');
    }
    const user = await sequelize.query(
      `SELECT * FROM "Usuarios" WHERE "id" = '${req.params.id}'`,
    );
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
      `UPDATE "Usuarios" SET "nombre"='${nombre}',"apellido"='${apellido}',
      "email"='${email}' WHERE "id" = '${req.params.id}'`,
    );
    const userUpdated = await sequelize.query(
      `SELECT * FROM "Usuarios" WHERE "id" = '${req.params.id}'`,
    );
    res.status(200).send(userUpdated[0]);
  } catch (error) {
    console.log(error);
    res.status(error.status).send(error);
  }
};

module.exports.deleteUser = async (req, res) => {
  try {
    const user = await sequelize.query(
      `SELECT * FROM "Usuarios" WHERE "id" = '${req.params.id}'`,
    );
    if (user[1].rowCount === 0) {
      throw createError(404, 'El usuario no existe');
    }
    await sequelize.query(
      `DELETE FROM "Usuarios" WHERE "id" = '${req.params.id}'`,
    );

    res.status(200).send({ 'Usuario eliminado:': user[0] });
  } catch (error) {
    res.status(error.status).send(error);
  }
};
