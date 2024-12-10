'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class TeamCategory extends Model {
    static associate(models) {
      // Uma categoria pertence a um time
      TeamCategory.belongsTo(models.Team, { foreignKey: 'teamId', as: 'team' });

      // Uma categoria é criada por um usuário
      TeamCategory.belongsTo(models.User, { foreignKey: 'createdBy', as: 'creator' });
    }
  }

  TeamCategory.init(
    {
      teamId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'teams',
          key: 'id',
        },
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: { msg: "O nome da categoria não pode ser vazio." },
          len: { args: [3, 50], msg: "O nome da categoria deve ter entre 3 e 50 caracteres." },
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
      modelName: 'TeamCategory',
      tableName: 'teamCategories',
    }
  );

  return TeamCategory;
};
