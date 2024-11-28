'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class FileHashes extends Model {
    static associate(models) {
      // Este modelo pode ter associações no futuro, se necessário.
    }
  }

  FileHashes.init(
    {
      hash: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true, // Garante que não existam hashes duplicados
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
