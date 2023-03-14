"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class meja extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // Define a one-to-many association with the `transaksi` model
      this.hasMany(models.transaksi, {
        foreignKey: "id_meja",
        as: "transaksi",
      });
    }
  }
  meja.init(
    {
      id_meja: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      nomor_meja:{
        type: DataTypes.STRING,
        allowNull: false
      },
      status: DataTypes.ENUM("tersedia", "tidak_tersedia"),
    },
    {
      sequelize,
      modelName: "meja",
      freezeTableName: true,
    }
  );
  return meja;
};
