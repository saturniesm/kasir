'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('statistik_bulanan', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      month: {
        type: Sequelize.STRING
      },
      totalSales: {
        type: Sequelize.FLOAT
      },
      totalUnits: {
        type: Sequelize.INTEGER
      },
      productStatId: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: 'menu_statistik',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
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
    await queryInterface.dropTable('statistik_bulanan');
  }
};
