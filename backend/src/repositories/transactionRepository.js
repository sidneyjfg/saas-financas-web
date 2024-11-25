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
        [Sequelize.col('category.name'), 'categoryName'], // Nome da categoria
        [Sequelize.fn('SUM', Sequelize.col('amount')), 'total'],
        'type', // Tipo de transação (income/expense)
      ],
      include: [
        {
          model: Transaction.sequelize.models.Category,
          as: 'category',
          attributes: [], // Apenas para o JOIN
        },
      ],
      group: ['month', 'year', 'type', 'category.name'],
      order: [
        [Sequelize.fn('YEAR', Sequelize.col('date')), 'DESC'],
        [Sequelize.fn('MONTH', Sequelize.col('date')), 'ASC'],
      ],
    });
  }

  async getPremiumSummary(userId) {
    return await Transaction.findAll({
      where: { userId },
      attributes: [
        [Sequelize.fn('MONTH', Sequelize.col('date')), 'month'], // Mês da transação
        [Sequelize.fn('YEAR', Sequelize.col('date')), 'year'],   // Ano da transação
        'type',                                                 // Tipo (income/expense)
        [Sequelize.col('category.id'), 'categoryId'],           // ID da categoria
        [Sequelize.col('category.name'), 'categoryName'],       // Nome da categoria
        'description',                                          // Descrição da transação
        [Sequelize.fn('SUM', Sequelize.col('amount')), 'total'], // Soma dos valores
      ],
      include: [
        {
          model: Transaction.sequelize.models.Category,
          as: 'category',
          attributes: [], // Necessário apenas para JOIN
        },
      ],
      group: ['year', 'month', 'type', 'category.id', 'category.name', 'description'], // Agrupamento detalhado
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
