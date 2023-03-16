"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class menu extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
       // Define a one-to-many association with the `detail_transaksi` model
      this.hasMany(models.detail_transaksi, {
        foreignKey: "id_menu",
        as: "detail_transaksi",
      });
    }
  }
  menu.init(
    {
      id_menu: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      nama_menu: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: true,
          len: [1, 100] // Maximum length of 100 characters
        }
      },
      jenis: {
        type: DataTypes.ENUM("makanan", "minuman"),
        allowNull: false
      },
      deskripsi: DataTypes.TEXT,
      gambar: DataTypes.STRING,
      harga: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "menu",
      freezeTableName: true,
    }
  );
  return menu;
};
