"use strict";
const { Model, Sequelize } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class detail_transaksi extends Model {

    static associate(models) {
      this.belongsTo(models.transaksi, {
        foreignKey: "id_transaksi",
        onDelete: "CASCADE", 
      });
      this.belongsTo(models.menu, {
        foreignKey: "id_menu",
        onDelete: "CASCADE",
      });
    }
  }
  detail_transaksi.init(
    {
      id_detail_transaksi: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      id_transaksi: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "transaksi",
          key: "id_transaksi",
        },
        onDelete: "CASCADE",
      },
      id_menu: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "menu",
          key: "id_menu",
        },
        onDelete: "CASCADE",
      },
      qty: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "detail_transaksi",
      freezeTableName: true,
    }
  );
  return detail_transaksi;
};
