const transactionRepository = require('../repositories/transactionRepository');
const goalRepository = require('../repositories/goalRepository');
const fs = require('fs');
const csv = require('csv-parser'); // Verifique se a biblioteca `csv-parser` está instalada.


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

    // Excluir uma transação
    async deleteTransaction(id, userId) {
        const transaction = await transactionRepository.findById(id);

        if (!transaction) {
            throw new Error('Transação não encontrada');
        }

        if (transaction.userId !== userId) {
            throw new Error('Usuário não autorizado a excluir esta transação');
        }

        await transactionRepository.delete(id, userId);

        // Atualizar progresso da meta, se aplicável
        if (transaction.categoryId) {
            await this.updateGoalProgress(transaction.categoryId);
        }
    }

    // Atualiza o progresso da meta associada à categoria
    async updateGoalProgress(categoryId) {
        // Obtém o total das transações por tipo para a categoria
        const totalIncome = await transactionRepository.getTotalByCategoryAndType(categoryId, 'income');
        const totalExpense = await transactionRepository.getTotalByCategoryAndType(categoryId, 'expense');

        // Busca a meta vinculada à categoria
        const goal = await goalRepository.findByCategory(categoryId);

        if (goal) {
            // Atualiza o progresso da meta (somando receitas e subtraindo despesas)
            goal.progress = totalIncome - totalExpense;
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

    async importTransactionsFromCSV(filePath, userId) {
        const transactions = [];
    
        // Ler e processar o CSV da Nubank
        await new Promise((resolve, reject) => {
          fs.createReadStream(filePath)
            .pipe(csv())
            .on("data", (row) => {
              if (row.date && row.title && row.amount) {
                transactions.push({
                  date: row.date,
                  type: parseFloat(row.amount) < 0 ? "expense" : "income", // Define tipo baseado no valor
                  category: "Nubank", // Categoria padrão para transações importadas
                  amount: Math.abs(parseFloat(row.amount)), // Remove o sinal negativo
                  description: row.title,
                  userId, // Associa ao usuário autenticado
                });
              }
            })
            .on("end", resolve)
            .on("error", reject);
        });
    
        // Processar transações
        for (const transaction of transactions) {
          let category = await transactionRepository.findCategoryByName(transaction.category);
    
          if (!category) {
            category = await transactionRepository.createCategory(transaction.category);
          }
    
          await transactionRepository.create({
            ...transaction,
            categoryId: category.id,
          });
        }
    
        return transactions.length; // Retorna o total de transações importadas
      }
}

module.exports = new TransactionService();
