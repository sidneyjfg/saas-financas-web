const goalRepository = require('../repositories/goalRepository');

class GoalService {
  async listGoals(userId) {
    return await goalRepository.findAllByUser(userId);
  }

  async createGoal(goalData) {
    return await goalRepository.create(goalData);
  }

  async updateGoal(id, goalData) {
    return await goalRepository.update(id, goalData);
  }

  async deleteGoal(id, userId) {
    return await goalRepository.delete(id, userId);
  }
}

module.exports = new GoalService();
