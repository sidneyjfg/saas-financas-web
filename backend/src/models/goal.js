'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Goal extends Model {
    static associate(models) {
      // Um objetivo pertence a um usuário
      Goal.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });

      // Um objetivo pode estar vinculado a uma categoria
      Goal.belongsTo(models.Category, { foreignKey: 'categoryId', as: 'category' });
    }
  }

  Goal.init(
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
        allowNull: true, // Categoria é opcional
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      targetAmount: {
        type: DataTypes.DECIMAL,
        allowNull: false,
      },
      progress: {
        type: DataTypes.DECIMAL,
        allowNull: true,
        defaultValue: 0,
      },
      deadline: {
        type: DataTypes.DATE,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: 'Goal',
      tableName: 'goals',
    }
  );

  return Goal;
};
