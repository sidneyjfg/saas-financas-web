const goalRepository = require('../repositories/goalRepository');

class GoalService {
  async listGoals(userId) {
    return await goalRepository.findAllByUser(userId);
  }

  async createGoal(goalData) {
    const { userId, name, targetAmount, deadline, categoryId } = goalData;

    // Verifica o plano do usuário
    const userPlan = goalData.plan; // Inclua o plano no objeto enviado para o service
    if (userPlan === 'Basic') {
        const userGoals = await goalRepository.findAllByUser(userId);
        if (userGoals.length >= 1) {
            throw new Error('Usuários do plano Basic podem criar apenas uma meta. Atualize seu plano para criar mais metas.');
        }
    }

    // Cria a meta
    return await goalRepository.create({ userId, name, targetAmount, deadline, categoryId });
}


  async updateGoal(id, goalData) {
    return await goalRepository.update(id, goalData);
  }

  async deleteGoal(id, userId) {
    return await goalRepository.delete(id, userId);
  }
}

module.exports = new GoalService();
