'use strict';
const TABLE_NAME = 'menu_statistik';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable(TABLE_NAME, {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      id_menu: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'menu',
          key: 'id_menu'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      yearlySalesTotal: {
        type: Sequelize.FLOAT
      },
      yearlyTotalSoldUnits: {
        type: Sequelize.INTEGER
      },
      year: {
        type: Sequelize.INTEGER
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable(TABLE_NAME);
  }
};
