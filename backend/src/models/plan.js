'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Plan extends Model {
    static associate(models) {
      // Um plano pode ter muitos usuários
      Plan.hasMany(models.User, { foreignKey: 'planId', as: 'users' });
    }
  }

  Plan.init(
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      price: {
        type: DataTypes.DECIMAL,
        allowNull: false,
      },
      features: {
        type: DataTypes.JSON, // Armazena funcionalidades do plano
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'Plan',
      tableName: 'plans',
    }
  );

  return Plan;
};
