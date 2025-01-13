'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Notification extends Model {
    static associate(models) {
      // Uma notificação pertence a um usuário
      Notification.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });
    }
  }

  Notification.init(
    {
      userId: {
        type: DataTypes.INTEGER,
        references: {
          model: 'users',
          key: 'id',
        },
        allowNull: false, // Cada notificação deve estar associada a um usuário
      },
      message: {
        type: DataTypes.STRING,
        allowNull: false, // Mensagem da notificação é obrigatória
      },
      type: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'info', // Tipo da notificação (info, alert, goal, etc.)
      },
      isRead: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false, // Inicia como "não lida"
      },
    },
    {
      sequelize,
      modelName: 'Notification',
      tableName: 'notifications',
      timestamps: true, // Cria os campos createdAt e updatedAt automaticamente
    }
  );

  return Notification;
};