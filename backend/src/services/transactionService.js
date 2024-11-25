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
}

module.exports = new TransactionService();
