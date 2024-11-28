"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("fileHashes", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      hash: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true, // Garante que não existam hashes duplicados
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false, // Não permite valores nulos
        references: {
          model: "users", // Nome da tabela de referência
          key: "id", // Chave na tabela de referência
        },
        onUpdate: "CASCADE", // Atualiza o userId automaticamente em mudanças
        onDelete: "CASCADE", // Remove o registro se o usuário for excluído
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn("NOW"),
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn("NOW"),
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("fileHashes");
  },
};
