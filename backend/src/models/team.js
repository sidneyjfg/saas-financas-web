'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Team extends Model {
    static associate(models) {
      // Um time pode ter muitos membros
      Team.hasMany(models.TeamMember, { foreignKey: 'teamId', as: 'members' });
    
      // Um time pode ter muitas metas
      Team.hasMany(models.TeamGoal, { foreignKey: 'teamId', as: 'goals' });
    
      // Um time pode ter muitas categorias
      Team.hasMany(models.TeamCategory, { foreignKey: 'teamId', as: 'categories' });
    }
    
  }

  Team.init(
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true, // Remove a dependência de "ownerId" para unicidade
        validate: {
          notEmpty: { msg: "O nome do time não pode ser vazio." },
          len: { args: [3, 50], msg: "O nome do time deve ter entre 3 e 50 caracteres." },
        },
      },
    },
    {
      sequelize,
      modelName: 'Team',
      tableName: 'teams',
    }
  );

  return Team;
};
