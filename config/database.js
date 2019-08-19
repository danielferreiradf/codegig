const Sequelize = require("sequelize");

module.exports = new Sequelize("codegig", "postgres", "password", {
  host: "localhost",
  dialect: "postgres"
});
