'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class TeamMember extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     */
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
        type: DataTypes.ENUM('owner', 'member'),
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'TeamMember',
      tableName: 'teamMembers', // Define explicitamente o nome da tabela
    }
  );

  return TeamMember;
};
