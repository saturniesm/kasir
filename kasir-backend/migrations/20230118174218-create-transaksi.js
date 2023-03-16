"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("transaksi", {
      id_transaksi: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      tgl_transaksi: {
        type: Sequelize.DATE,
        allowNull: false,
        validate: {
          notEmpty: true,
        }
      },
      id_user: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "user",
          key: "id_user",
          onDelete: "CASCADE",
        },
      },
      id_meja: {
        type: Sequelize.INTEGER,
        references: {
          model: "meja",
          key: "id_meja",
          onDelete: "CASCADE",
        },
      },
      nama_pelanggan: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
          notEmpty: true,
        }
      },
      status: {
        type: Sequelize.ENUM("belum_bayar", "lunas"),
        allowNull: false,
        validate: {
          notEmpty: true,
        }
      },
      total: {
        type: Sequelize.INTEGER,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("transaksi");
  },
};
