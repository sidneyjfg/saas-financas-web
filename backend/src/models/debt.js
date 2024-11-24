'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Debt extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     */
    static associate(models) {
      // Uma dívida pertence a um usuário
      Debt.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });
    }
  }

  Debt.init(
    {
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id',
        },
      },
      description: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      totalAmount: {
        type: DataTypes.DECIMAL,
        allowNull: false,
      },
      remainingAmount: {
        type: DataTypes.DECIMAL,
        allowNull: false,
      },
      installments: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      nextDueDate: {
        type: DataTypes.DATE,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: 'Debt',
      tableName: 'debts', // Define explicitamente o nome da tabela
    }
  );

  return Debt;
};
