const goalService = require('../services/goalService');

class GoalController {
  async list(req, res) {
    const userId = req.user.id;
    try {
      const goals = await goalService.listGoals(userId);
      return res.status(200).json(goals);
    } catch (error) {
      console.error('Erro ao listar metas:', error.message);
      return res.status(500).json({ error: 'Erro ao listar metas.' });
    }
  }

  async create(req, res) {
    const userId = req.user.id;
    const userPlan = req.user.plan; // Verifica o plano do usuário
    const { name, targetAmount, deadline, categoryId } = req.body;

    if (!name || !targetAmount) {
        return res.status(400).json({ error: 'Nome e valor alvo são obrigatórios.' });
    }

    try {
        // Validação do limite de metas para o plano Basic
        if (userPlan === 'Basic') {
            const userGoals = await goalService.listGoals(userId);
            if (userGoals.length >= 1) {
                return res.status(403).json({ error: 'Usuários do plano Basic podem criar apenas uma meta. Atualize seu plano para criar mais metas.' });
            }
        }

        const goal = await goalService.createGoal({
          userId,
          name,
          targetAmount,
          deadline,
          categoryId,
          plan: req.user.plan, // Inclui o plano no serviço
      });
      
        return res.status(201).json(goal);
    } catch (error) {
        console.error('Erro ao criar meta:', error.message);
        return res.status(500).json({ error: 'Erro ao criar meta.' });
    }
}


  async update(req, res) {
    const userId = req.user.id;
    const { id } = req.params;
    const { name, targetAmount, progress, deadline, categoryId } = req.body;

    try {
      const goal = await goalService.updateGoal(id, { userId, name, targetAmount, progress, deadline, categoryId });
      return res.status(200).json(goal);
    } catch (error) {
      console.error('Erro ao atualizar meta:', error.message);
      return res.status(500).json({ error: 'Erro ao atualizar meta.' });
    }
  }

  async delete(req, res) {
    const userId = req.user.id;
    const { id } = req.params;

    try {
      await goalService.deleteGoal(id, userId);
      return res.status(200).json({ message: 'Meta excluída com sucesso.' });
    } catch (error) {
      console.error('Erro ao excluir meta:', error.message);
      return res.status(500).json({ error: 'Erro ao excluir meta.' });
    }
  }
}

module.exports = new GoalController();
