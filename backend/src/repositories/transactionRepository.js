const { Transaction, Sequelize } = require('../models');

class TransactionRepository {
  // Busca todas as transações de um usuário
  async findAllByUser(userId) {
    console.log('findAllByUser called with userId:', userId);
    return await Transaction.findAll({
      where: { userId },
      include: [
        {
          model: Transaction.sequelize.models.Category,
          as: 'category',
          attributes: ['id', 'name'],
        },
      ],
      order: [['date', 'DESC']],
    });
  }

  // Busca o resumo mensal agrupado por mês e tipo
  async getMonthlySummary(userId) {
    console.log('getMonthlySummary called with userId:', userId);

    return await Transaction.findAll({
      where: { userId },
      attributes: [
        [Sequelize.fn('MONTH', Sequelize.col('date')), 'month'],
        [Sequelize.fn('YEAR', Sequelize.col('date')), 'year'],
        [Sequelize.fn('SUM', Sequelize.col('amount')), 'total'],
        'type',
      ],
      group: ['month', 'year', 'type'],
      order: [
        [Sequelize.fn('YEAR', Sequelize.col('date')), 'DESC'],
        [Sequelize.fn('MONTH', Sequelize.col('date')), 'ASC'],
      ],
    });
  }

  // Adiciona uma nova transação
  async create(transactionData) {
    return await Transaction.create(transactionData);
  }

  // Atualiza uma transação existente
  async update(id, transactionData) {
    return await Transaction.update(transactionData, {
      where: { id },
    });
  }

  // Exclui uma transação
  async delete(id) {
    return await Transaction.destroy({
      where: { id },
    });
  }
}

module.exports = new TransactionRepository();