'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      // Um usuário pertence a um plano
      User.belongsTo(models.Plan, { foreignKey: 'planId', as: 'plan' });

      // Outras associações podem ser adicionadas aqui
    }
  }

  User.init(
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      planId: {
        type: DataTypes.INTEGER,
        references: {
          model: 'plans',
          key: 'id',
        },
      },
    },
    {
      sequelize,
      modelName: 'User',
      tableName: 'users',
    }
  );

  return User;
};