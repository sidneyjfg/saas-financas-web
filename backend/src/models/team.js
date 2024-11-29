'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Team extends Model {
    static associate(models) {
      // Um time pode ter muitos membros
      Team.hasMany(models.TeamMember, {
        foreignKey: 'teamId',
        as: 'members',
      });

      // Um time pertence a um dono (usuário)
      Team.belongsTo(models.User, { foreignKey: 'ownerId', as: 'owner' });
    }
  }

  Team.init(
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: "uniqueTeamPerOwner",
        validate: {
          notEmpty: { msg: "O nome do time não pode ser vazio." },
          len: { args: [3, 50], msg: "O nome do time deve ter entre 3 e 50 caracteres." },
        },
      },
      ownerId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id',
        },
      },
    },
    {
      sequelize,
      modelName: 'Team',
      tableName: 'teams',
      indexes: [
        {
          unique: true,
          fields: ['name', 'ownerId'],
        },
      ],
    }
  );

  return Team;
};
