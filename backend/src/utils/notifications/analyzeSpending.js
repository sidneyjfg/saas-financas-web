const { Notification } = require("../models");

const analyzeSpending = async (userId) => {
  const transactions = await getTransactionsByUser(userId); // Consulta as transações do usuário
  const totalIncome = transactions.reduce((sum, t) => sum + (t.type === "income" ? t.amount : 0), 0);

  const categorySpending = {};
  transactions.forEach((t) => {
    if (t.type === "expense") {
      categorySpending[t.category] = (categorySpending[t.category] || 0) + t.amount;
    }
  });

  // Verificar se alguma categoria ultrapassa o limite (exemplo: 60% da renda total)
  const notifications = [];
  for (const [category, amount] of Object.entries(categorySpending)) {
    const percentage = (amount / totalIncome) * 100;
    if (percentage > 60) {
      notifications.push({
        userId,
        category,
        message: `Você gastou ${percentage.toFixed(1)}% da sua renda com ${category}.`,
      });
    }
  }

  return notifications;
};
