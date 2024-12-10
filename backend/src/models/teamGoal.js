'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class TeamGoal extends Model {
    static associate(models) {
      // Um objetivo pertence a um time
      TeamGoal.belongsTo(models.Team, { foreignKey: 'teamId', as: 'team' });

      // Um objetivo é criado por um usuário
      TeamGoal.belongsTo(models.User, { foreignKey: 'createdBy', as: 'creator' });
    }
  }

  TeamGoal.init(
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
        validate: {
          notEmpty: { msg: "A descrição da meta não pode ser vazia." },
        },
      },
      status: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'pending', // Valor padrão
        validate: {
          isIn: [['pending', 'completed', 'canceled']], // Validação em nível de modelo
        },
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
      modelName: 'TeamGoal',
      tableName: 'teamGoals',
    }
  );

  return TeamGoal;
};
