'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class menu_statistik extends Model {
    static associate(models) {
      menu_statistik.belongsTo(models.menu, {
        foreignKey: 'id_menu'
      });
      menu_statistik.hasMany(models.statistik_bulanan, {
        foreignKey: 'menu_statistik_id'
      });
      menu_statistik.hasMany(models.statistik_harian, {
        foreignKey: 'menu_statistik_id'
      });
    }
  };
  menu_statistik.init({
    yearlySalesTotal: DataTypes.FLOAT,
    yearlyTotalSoldUnits: DataTypes.INTEGER,
    year: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'menu_statistik',
  });

  class statistik_bulanan extends Model {
    static associate(models) {
      statistik_bulanan.belongsTo(models.menu_statistik, {
        foreignKey: 'menu_statistik_id'
      });
    }
  };
  statistik_bulanan.init({
    month: DataTypes.STRING,
    totalSales: DataTypes.FLOAT,
    totalUnits: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'statistik_bulanan',
  });

  class statistik_harian extends Model {
    static associate(models) {
      statistik_harian.belongsTo(models.menu_statistik, {
        foreignKey: 'menu_statistik_id'
      });
    }
  };
  statistik_harian.init({
    date: DataTypes.STRING,
    totalSales: DataTypes.FLOAT,
    totalUnits: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'statistik_harian',
  });

  return { menu_statistik, statistik_bulanan, statistik_harian };
};
