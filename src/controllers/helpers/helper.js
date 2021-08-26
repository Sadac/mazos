const sequelize = require("../../database/config");

const find = async (model, attributeName, attributeValue) => {
  const busqueda = await sequelize.query(
    `SELECT * FROM "${model}" WHERE "${attributeName}" = '${attributeValue}'`
  );
  return busqueda;
};
const deleteRegister = async (model, attributeName, attributeValue) => {
  const deleted = await sequelize.query(
    `DELETE FROM "${model}" WHERE "${attributeName}" = '${attributeValue}'`
  );
  return deleted;
};

module.exports = {
  find,
  deleteRegister,
};
