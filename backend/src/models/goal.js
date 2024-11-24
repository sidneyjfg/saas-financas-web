'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Goal extends Model {
    static associate(models) {
      // Um objetivo pertence a um usuário
      Goal.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });
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
