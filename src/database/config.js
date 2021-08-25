const { Sequelize } = require("sequelize");

const sequelize = new Sequelize({
  database: process.env.DATABASE,
  username: "euusowygeveqew",
  password: process.env.PASSWORD,
  host: process.env.HOST,
  port: process.env.DB_PORT,
  dialect: "postgres",
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  },
});
sequelize
  .authenticate()
  .then(() => {
    console.log("Connection has been established successfully.");
  })
  .catch((err) => console.log(err));

module.exports = sequelize;
