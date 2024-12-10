'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('teamCategories', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      teamId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'teams', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      createdBy: {
        type: Sequelize.INTEGER,
        allowNull: true, // Altere para permitir NULL
        references: { model: 'users', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('teamCategories');
  },
};
