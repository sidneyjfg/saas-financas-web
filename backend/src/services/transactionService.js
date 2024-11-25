const transactionRepository = require('../repositories/transactionRepository');

class TransactionService {
  // Obtém o resumo mensal de transações
  async getMonthlyReport(userId) {
    return await transactionRepository.getMonthlySummary(userId);
  }

  // Obtém todas as transações de um usuário
  async getTransactions(userId) {
    return await transactionRepository.findAllByUser(userId);
  }

  // Cria uma nova transação
  async createTransaction(transactionData) {
    return await transactionRepository.create(transactionData);
  }

  // Atualiza uma transação existente
  async updateTransaction(id, transactionData) {
    return await transactionRepository.update(id, transactionData);
  }

  // Exclui uma transação
  async deleteTransaction(id) {
    return await transactionRepository.delete(id);
  }
  async getPremiumSummary(userId) {
    // Lógica para gerar resumo detalhado
    return await transactionRepository.getPremiumSummary(userId);
  }

  async exportToCSV(userId) {
    // Lógica para gerar CSV
    const transactions = await transactionRepository.findAllByUser(userId);
    let csv = "Date,Category,Type,Amount,Description\n";

    transactions.forEach((t) => {
      csv += `${t.date},${t.category.name},${t.type},${t.amount},${t.description || ""}\n`;
    });

    return csv;
  }
}

module.exports = new TransactionService();
