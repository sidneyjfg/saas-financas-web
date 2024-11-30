'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class AuditLog extends Model {
    static associate(models) {
      // Relacionamento com a tabela Teams
      AuditLog.belongsTo(models.Team, { foreignKey: 'teamId', as: 'team' });

      // Relacionamento com a tabela Users
      AuditLog.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });
    }
  }

  AuditLog.init(
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
      action: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      details: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      sequelize,
      modelName: 'AuditLog',
      tableName: 'auditLogs',
    }
  );

  return AuditLog;
};
