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
  
  async findByCategory(categoryId) {
    return await Goal.findOne({
      where: { categoryId },
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
