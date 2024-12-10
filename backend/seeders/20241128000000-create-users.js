'use strict';

const bcrypt = require('bcrypt'); // Biblioteca para hashing de senhas

module.exports = {
  async up(queryInterface, Sequelize) {
    const hashedPassword = await bcrypt.hash('1234', 10); // Hash para a senha 1234

    await queryInterface.bulkInsert('users', [
      {
        name: 'Basic',
        email: 'basic@example.com',
        password: hashedPassword,
        planId: 1, // Substitua por um ID válido da tabela 'plans'
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Premium',
        email: 'premium@example.com',
        password: hashedPassword,
        planId: 2, // Substitua por um ID válido da tabela 'plans'
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Premium 2',
        email: 'premium2@example.com',
        password: hashedPassword,
        planId: 2, // Substitua por um ID válido da tabela 'plans'
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('users', {
      email: { [Sequelize.Op.in]: ['basic@example.com', 'premium@example.com'] },
    });
  },
};
