const transactionRepository = require('../repositories/transactionRepository');
const goalRepository = require('../repositories/goalRepository');

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
        const transaction = await transactionRepository.create(transactionData);

        // Atualizar progresso da meta, se aplicável
        if (transactionData.categoryId) {
            await this.updateGoalProgress(transactionData.categoryId);
        }

        return transaction;
    }

    // Atualiza uma transação existente
    async updateTransaction(id, transactionData) {
        const transaction = await transactionRepository.findById(id);

        if (!transaction) {
            throw new Error("Transação não encontrada");
        }

        await transactionRepository.update(id, transactionData);

        // Atualizar progresso da meta, se aplicável
        if (transactionData.categoryId) {
            await this.updateGoalProgress(transactionData.categoryId);
        }

        return transaction;
    }

    // Exclui uma transação
    async deleteTransaction(id, userId) {
        const transaction = await transactionRepository.findById(id);
    
        if (!transaction) {
            throw new Error('Transação não encontrada');
        }
    
        if (transaction.userId !== userId) {
            throw new Error('Usuário não autorizado a excluir esta transação');
        }
    
        return await transactionRepository.delete(id, userId);
    }
    

    // Atualiza o progresso da meta associada à categoria
    async updateGoalProgress(categoryId) {
        const total = await transactionRepository.getTotalByCategory(categoryId);
        const goal = await goalRepository.findByCategory(categoryId);

        if (goal) {
            goal.progress = total;
            await goal.save();
        }
    }

    async getPremiumSummary(userId) {
        return await transactionRepository.getPremiumSummary(userId);
    }

    async exportToCSV(userId) {
        const transactions = await transactionRepository.findAllByUser(userId);
        let csv = "Date,Category,Type,Amount,Description\n";

        transactions.forEach((t) => {
            csv += `${t.date},${t.category.name},${t.type},${t.amount},${t.description || ""}\n`;
        });

        return csv;
    }
}

module.exports = new TransactionService();
