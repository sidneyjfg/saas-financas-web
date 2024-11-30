const { Transaction, Category, Sequelize } = require('../models');

class TransactionRepository {
  // Busca todas as transações de um usuário
  async findAllByUser(userId) {
    return await Transaction.findAll({
      where: { userId },
      include: [
        {
          model: Category,
          as: 'category',
          attributes: ['id', 'name', 'color', 'keywords'], // Inclua 'keywords'
        },
      ],
      order: [['date', 'DESC']],
    });
  }

  async findCategoryByName(name) {
    return await Category.findOne({ where: { name } });
  }

  async createCategory(name) {
    return await Category.create({ name });
  }

  async findById(id) {
    return await Transaction.findByPk(id, {
      include: [
        {
          model: Category,
          as: 'category',
          attributes: ['id', 'name', 'color', 'keywords'],
        },
      ],
    });
  }
  // Busca o resumo mensal agrupado por mês e tipo
  async getMonthlySummary(userId) {

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
        [Sequelize.col('category.color'), 'categoryColor'],     // Cor da categoria
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
  async getTotalByCategoryAndType(userId, categoryId, type) {
    if (!userId || !categoryId || !type) {
      throw new Error("Parâmetros inválidos para obter o total por categoria e tipo.");
    }

    const result = await Transaction.findAll({
      where: {
        userId, // Certifique-se de filtrar pelo usuário
        categoryId,
        type,
      },
      attributes: [[Sequelize.fn('SUM', Sequelize.col('amount')), 'total']],
    });

    return result[0]?.dataValues?.total || 0;
  }



  async create(transactionData) {
    if (!transactionData.userId) {
      throw new Error("Usuário não autenticado ao criar transação.");
    }
    return await Transaction.create(transactionData);
  }

  // Atualizar uma transação existente
  async update(id, data, userId) {
    if (!userId) {
      throw new Error("userId é necessário para atualizar uma transação");
    }
    return await Transaction.update(data, {
      where: { id, userId },
    });
  }

  // Excluir uma transação
  async delete(id, userId) {
    return await Transaction.destroy({
      where: { id, userId },
    });
  }
  async bulkCreate(transactions) {
    return await Transaction.bulkCreate(transactions);
  }
  async deleteAllByUser(userId) {
    try {
      await Transaction.destroy({ where: { userId } });
    } catch (error) {
      console.error("Erro ao excluir transações no repositório: ", error);
      throw error;
    }
  }

  async batchDelete(ids) {
    try {
        if (!Array.isArray(ids)) {
            throw new Error("IDs fornecidos não são um array.");
        }

        // Confirma que os IDs estão sendo processados corretamente
        await Transaction.destroy({
            where: {
                id: ids, // Certifique-se de que está lidando com um array
            },
        });
    } catch (error) {
        console.error("Erro no repository ao excluir transações:", error.message);
        throw error;
    }
}


}

module.exports = new TransactionRepository();
