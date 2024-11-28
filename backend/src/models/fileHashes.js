'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class FileHashes extends Model {
    static associate(models) {
      // Associa o FileHashes com o User
      FileHashes.belongsTo(models.User, {
        foreignKey: 'userId',
        as: 'user',
        onDelete: 'CASCADE', // Exclui os hashes se o usuário for excluído
      });
    }
  }

  FileHashes.init(
    {
      hash: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true, // Garante que não existam hashes duplicados
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false, // Um hash deve estar associado a um usuário
      },
    },
    {
      sequelize,
      modelName: 'FileHashes',
      tableName: 'fileHashes',
    }
  );

  return FileHashes;
};
