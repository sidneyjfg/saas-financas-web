const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class TeamTransaction extends Model {
    static associate(models) {
      // Relacionamento com a tabela Teams
      TeamTransaction.belongsTo(models.Team, { foreignKey: 'teamId', as: 'team' });
      // Relacionamento com a tabela Users
      TeamTransaction.belongsTo(models.User, { foreignKey: 'createdBy', as: 'user' });
    }
  }

  TeamTransaction.init(
    {
      teamId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'teams',
          key: 'id',
        },
      },
      description: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      amount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      type: {
        type: DataTypes.ENUM('income', 'expense'),
        allowNull: false,
      },
      date: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      createdBy: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id',
        },
      },
      createdAt: DataTypes.DATE,
      updatedAt: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: 'TeamTransaction',
      tableName: 'teamTransactions',
    }
  );

  return TeamTransaction;
};
