'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Budget extends Model {
    static associate(models) {
      // Um orçamento pertence a um usuário
      Budget.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });

      // Um orçamento pertence a uma categoria
      Budget.belongsTo(models.Category, { foreignKey: 'categoryId', as: 'category' });
    }
  }

  Budget.init(
    {
      userId: {
        type: DataTypes.INTEGER,
        references: {
          model: 'users',
          key: 'id',
        },
      },
      categoryId: {
        type: DataTypes.INTEGER,
        references: {
          model: 'categories',
          key: 'id',
        },
      },
      limitAmount: {
        type: DataTypes.DECIMAL,
        allowNull: false,
      },
      spentAmount: {
        type: DataTypes.DECIMAL,
        allowNull: true,
      },
      month: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      year: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'Budget',
      tableName: 'budgets',
    }
  );

  return Budget;
};
