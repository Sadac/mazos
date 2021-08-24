const shortid = require('shortid');
const createError = require('http-errors');
const sequelize = require('../database/config');
const Usuarios = require('../models/userModel');

module.exports.createUser = async (req, res) => {
  try {
    const {
      nombre, apellido, email,
    } = req.body;
    if (!nombre) {
      throw createError(400, 'El nombre es obligatorio');
    }
    const id = shortid.generate();
    const today = new Date();
    const date = `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`;

    const user = await sequelize.query(`
   INSERT INTO "Usuarios" ("id","nombre","apellido","email","fechaCreacion") 
   VALUES 
   ('${id}','${nombre}','${apellido}','${email}','${date}')`);
    if (user[1] !== 1) {
      throw createError(500, 'Hubo un error creando al usuario');
    }
    res.status(201).send(`El usuario ${nombre} fue creado exitosamente`);
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
    const { nombre, apellido, email } = req.body;
    const user = await sequelize.query(
      `SELECT * FROM "Usuarios" WHERE "Usuarios"."id" = '${req.params.id}'`,
    );
    res.status(200).send({ user: user[0] });
  } catch (error) {
    console.log(error);
    res.status(error.status).send(error);
  }
};
