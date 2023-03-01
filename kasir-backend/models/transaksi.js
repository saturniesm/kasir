"use strict";
const { Model, Sequelize } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class transaksi extends Model {
    static associate(models) {
      // define association here
      this.belongsTo(models.user);
      this.belongsTo(models.meja);
      this.hasMany(models.detail_transaksi, {
        foreignKey: "id_transaksi",
        as: "detail_transaksi",
      });
    }
  }
  transaksi.init(
    {
      id_transaksi: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      tgl_transaksi: DataTypes.DATE,
      id_user: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "user",
          key: "id_user",
        },
      },
      id_meja: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "meja",
          key: "id_meja",
        },
      },
      nama_pelanggan: DataTypes.STRING,
      status: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "transaksi",
      freezeTableName: true,
    }
  );
  return transaksi;
};
