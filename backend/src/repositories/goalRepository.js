const { Goal, Category } = require('../models');

class GoalRepository {
  async findAllByUser(userId) {
    return await Goal.findAll({
      where: { userId },
      include: [
        {
          model: Category,
          as: 'category',
          attributes: ['id', 'name'], // Traga apenas o necessário
        },
      ],
      order: [['deadline', 'ASC']],
    });
  }
  
  async findByCategory(userId, categoryId) {
    if (!userId || !categoryId) {
        throw new Error("Usuário ou categoria inválidos para buscar meta.");
    }

    return await Goal.findOne({
        where: { userId, categoryId }, // Certifique-se de que o userId está no escopo
    });
}


  async create(goalData) {
    return await Goal.create(goalData);
  }

  async update(id, goalData) {
    return await Goal.update(goalData, {
      where: { id, userId: goalData.userId },
    });
  }

  async delete(id, userId) {
    return await Goal.destroy({
      where: { id, userId },
    });
  }
}

module.exports = new GoalRepository();
