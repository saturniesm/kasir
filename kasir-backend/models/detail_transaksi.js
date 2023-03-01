"use strict";
const { Model, Sequelize } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class detail_transaksi extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.transaksi);
      this.belongsTo(models.menu);
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
      },
      id_menu: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "menu",
          key: "id_menu",
        },
      },
      harga: {
        type: Sequelize.STRING,
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
