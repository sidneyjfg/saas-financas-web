'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class TeamMember extends Model {
    static associate(models) {
      // Um membro pertence a um time
      TeamMember.belongsTo(models.Team, { foreignKey: 'teamId', as: 'team' });

      // Um membro é um usuário
      TeamMember.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });
    }
  }

  TeamMember.init(
    {
      teamId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'teams',
          key: 'id',
        },
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id',
        },
      },
      role: {
        type: DataTypes.ENUM('owner', 'admin', 'member'),
        allowNull: false,
        validate: {
          isIn: {
            args: [['owner', 'admin', 'member']],
            msg: "O papel deve ser 'owner', 'admin' ou 'member'.",
          },
        },
      },
    },
    {
      sequelize,
      modelName: 'TeamMember',
      tableName: 'teamMembers',
      indexes: [
        {
          unique: true,
          fields: ['teamId', 'userId'],
        },
      ],
    }
  );

  return TeamMember;
};
