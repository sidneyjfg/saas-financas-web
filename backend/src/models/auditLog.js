'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class AuditLog extends Model {
    static associate(models) {
      AuditLog.belongsTo(models.Team, { foreignKey: 'teamId', as: 'team' });
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
        get() {
          const rawValue = this.getDataValue('details');
          return rawValue ? JSON.parse(rawValue) : null;
        },
        set(value) {
          this.setDataValue('details', JSON.stringify(value));
        },
      },
    },
    {
      sequelize,
      modelName: 'AuditLog',
      tableName: 'auditLogs',
      timestamps: true, // Ativa `createdAt` e `updatedAt`
    }
  );

  return AuditLog;
};
