const transactionRepository = require('../repositories/transactionRepository');
const categoryRepository = require('../repositories/categoryRepository');
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
        const categories = await categoryRepository.findAllPremiumByUser(userId);

        // Verifica se a categoria Nubank já existe ou cria
        console.log("cheguei");
        let nubankCategory = categories.find((cat) => cat.name === "Nubank");
        if (!nubankCategory) {
            nubankCategory = await categoryRepository.create({
                name: "Nubank",
                color: "#8A2BE2", // Cor roxa
                userId,
            });
        }

        // Ler e processar o CSV
        await new Promise((resolve, reject) => {
            fs.createReadStream(filePath)
                .pipe(csv())
                .on("data", (row) => {
                    if (row.date && row.amount && row.title) {
                        // Determinar a categoria com base nas palavras-chave
                        const matchedCategory = categories.find((category) => {
                            const keywords = category.keywords ? category.keywords.split(",") : [];
                            return keywords.some((keyword) =>
                                row.title.toLowerCase().includes(keyword.toLowerCase())
                            );
                        });

                        transactions.push({
                            date: new Date(row.date),
                            type: parseFloat(row.amount) > 0 ? "income" : "expense",
                            categoryId: matchedCategory ? matchedCategory.id : nubankCategory.id,
                            amount: Math.abs(parseFloat(row.amount)),
                            description: row.title,
                            userId,
                        });
                    }
                })
                .on("end", resolve)
                .on("error", reject);
        });

        // Inserir as transações no banco
        for (const transaction of transactions) {
            await transactionRepository.create(transaction);
        }

        return transactions.length;
    }
}

module.exports = new TransactionService();
