const Sequelize = require("sequelize");
require("dotenv").config();
const path = require("path");



const env = process.env.NODE_ENV;
const configPath = path.join(__dirname, "config", "config.json");
const config = require(configPath)[env];

const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  config
);

module.exports = sequelize;
