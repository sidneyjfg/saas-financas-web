const transactionRepository = require('../repositories/transactionRepository');
const categoryRepository = require('../repositories/categoryRepository');
const goalRepository = require('../repositories/goalRepository');
const fs = require('fs');
const csv = require('csv-parser'); // Verifique se a biblioteca `csv-parser` está instalada.
const { use } = require('../routes/transactionRoutes');


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
        try {
            console.log("Transação sendo criada: ", transactionData);

            // Verificar se userId está presente
            if (!transactionData.userId) {
                throw new Error("Usuário não autenticado.");
            }

            // Verificar existência de categoria associada ao usuário
            const category = await categoryRepository.findCategoryByIdAndUser(
                transactionData.categoryId,
                transactionData.userId
            );
            if (!category) {
                throw new Error("Categoria inválida para o usuário.");
            }

            const transaction = await transactionRepository.create(transactionData);
            console.log("Transação criada com sucesso: ", transaction);

            // Atualizar progresso da meta, se aplicável
            if (transactionData.categoryId) {
                await this.updateGoalProgress(transactionData.userId, transactionData.categoryId);
            }


            return transaction;
        } catch (error) {
            console.error("Erro ao criar transação:", error.message);
            throw error;
        }
    }

    // Atualiza uma transação unica
    async updateTransaction(id, transactionData) {
        if (!Number.isInteger(transactionData.categoryId)) {
            throw new Error("categoryId deve ser um número válido.");
        }
    
        console.log("Dados recebidos no serviço para atualização:", transactionData);
    
        const transaction = await transactionRepository.findById(id);
    
        if (!transaction) {
            throw new Error("Transação não encontrada");
        }
    
        await transactionRepository.update(id, transactionData, transactionData.userId);
    
        // Atualizar progresso da meta, se aplicável
        if (transactionData.categoryId) {
            await this.updateGoalProgress(transactionData.userId, transactionData.categoryId);
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
        console.log(id, " e ", userId);
        await transactionRepository.delete(id, userId);

        // Atualizar progresso da meta, se aplicável
        if (transaction.categoryId) {
            await this.updateGoalProgress(transaction.categoryId);
        }
    }

    // Atualiza o progresso da meta associada à categoria
    async updateGoalProgress(userId, categoryId) {
        if (!userId || !categoryId) {
            throw new Error("Usuário ou categoria inválidos para atualizar progresso da meta.");
        }
    
        // Obtém o total das transações por tipo para a categoria
        const totalIncome = await transactionRepository.getTotalByCategoryAndType(userId, categoryId, 'income');
        const totalExpense = await transactionRepository.getTotalByCategoryAndType(userId, categoryId, 'expense');
    
        // Busca a meta vinculada à categoria
        const goal = await goalRepository.findByCategory(userId, categoryId); // Passar userId aqui
    
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
                            // Corrige o erro no `split`, garantindo que `category.keywords` seja string
                            const keywords =
                                typeof category.keywords === "string"
                                    ? category.keywords.split(",")
                                    : [];
                            return keywords.some((keyword) =>
                                row.title.toLowerCase().includes(keyword.toLowerCase())
                            );
                        });

                        // Determinar o tipo de transação
                        const transactionType =
                            row.title.toLowerCase() === "pagamento recebido"
                                ? "income"
                                : "expense";

                        transactions.push({
                            date: new Date(row.date),
                            type: transactionType, // Define como despesa ou receita
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

    async updateCategories(userId) {
        console.log("Toma o userID: ", userId);

        const transactions = await transactionRepository.findAllByUser(userId);
        const categories = await categoryRepository.findAllPremiumByUser(userId);

        console.log("Transações encontradas: ", transactions);
        console.log("Categorias encontradas: ", categories);

        let updatedCount = 0;

        for (const transaction of transactions) {
            const matchedCategory = categories.find((category) => {
                // Certifique-se de que `keywords` é um array
                return category.keywords.some((keyword) =>
                    transaction.description.toLowerCase().includes(keyword.toLowerCase())
                );
            });

            if (matchedCategory && transaction.categoryId !== matchedCategory.id) {
                await transactionRepository.update(
                    transaction.id,
                    { categoryId: matchedCategory.id },
                    userId // Passe o userId aqui
                );
                updatedCount++;
            }
        }

        console.log("Categorias atualizadas: ", updatedCount);
        return updatedCount;
    }

}

module.exports = new TransactionService();
