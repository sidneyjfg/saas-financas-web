'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Category extends Model {
    static associate(models) {
      // Uma categoria pertence a um usuário
      Category.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });
    }
  }

  Category.init(
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      color: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      userId: {
        type: DataTypes.INTEGER,
        references: {
          model: 'users',
          key: 'id',
        },
        allowNull: false,
      },
      keywords: {
        type: DataTypes.JSON, // Define o tipo de dados como JSON
        allowNull: true,
        defaultValue: [], // Valor padrão como array vazio
        get() {
          // Retorna o array diretamente ou um array vazio caso seja null
          return this.getDataValue('keywords') || [];
        },
        set(value) {
          // Garante que keywords seja armazenado como um array no banco
          this.setDataValue('keywords', Array.isArray(value) ? value : []);
        },
      },
    },
    {
      sequelize,
      modelName: 'Category',
      tableName: 'categories',
    }
  );

  return Category;
};
