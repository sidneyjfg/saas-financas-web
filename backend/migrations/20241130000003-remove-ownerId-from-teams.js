'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // Inserir owners na tabela teamMembers antes de remover ownerId
    await queryInterface.sequelize.query(`
      INSERT INTO teamMembers (teamId, userId, role, createdAt, updatedAt)
      SELECT id, ownerId, 'owner', NOW(), NOW() FROM teams;
    `);

    // Remover o campo ownerId
    await queryInterface.removeColumn('teams', 'ownerId');
  },

  async down(queryInterface, Sequelize) {
    // Recriar o campo ownerId
    await queryInterface.addColumn('teams', 'ownerId', {
      type: Sequelize.INTEGER,
      references: {
        model: 'users',
        key: 'id',
      },
      onDelete: 'CASCADE',
    });

    // Restaurar valores de ownerId com base nos registros de teamMembers
    await queryInterface.sequelize.query(`
      UPDATE teams t
      SET ownerId = (
        SELECT userId FROM teamMembers tm
        WHERE tm.teamId = t.id AND tm.role = 'owner'
        LIMIT 1
      )
    `);
  },
};
