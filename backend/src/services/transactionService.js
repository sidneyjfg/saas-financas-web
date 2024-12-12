const transactionRepository = require('../repositories/transactionRepository');
const categoryRepository = require('../repositories/categoryRepository');
const goalRepository = require('../repositories/goalRepository');
const hashFileRepository = require('../repositories/hashFileRepository');
const { FileHashes } = require('../models');
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
        try {


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

        // Verifica ou cria categoria padrão "Nubank"
        let nubankCategory = categories.find((cat) => cat.name === "Nubank");
        if (!nubankCategory) {
            nubankCategory = await categoryRepository.create({
                name: "Nubank",
                color: "#8A2BE2",
                userId,
                keywords: [], // Inicializa como um array vazio
            });
            categories.push(nubankCategory);
        }

        // Processar CSV
        await new Promise((resolve, reject) => {
            fs.createReadStream(filePath)
                .pipe(csv())
                .on("data", (row) => {
                    try {
                        if (row.date && row.amount && row.title) {
                            const amount = parseFloat(row.amount);

                            // Define o tipo da transação baseado no valor
                            const type = amount < 0 ? "income" : "expense";

                            // Encontra a categoria correspondente ou usa "Nubank"
                            const matchedCategory = categories.find((category) => {
                                const keywords = Array.isArray(category.keywords)
                                    ? category.keywords
                                    : []; // Garante que keywords é um array
                                return keywords.some((keyword) =>
                                    row.title.toLowerCase().includes(keyword.toLowerCase())
                                );
                            });

                            transactions.push({
                                date: new Date(row.date),
                                type,
                                categoryId: matchedCategory ? matchedCategory.id : nubankCategory.id,
                                amount: Math.abs(amount), // Sempre salva como valor positivo
                                description: row.title,
                                userId,
                            });
                        }
                    } catch (err) {
                        console.error("Erro ao processar linha do CSV:", row, err.message);
                    }
                })
                .on("end", resolve)
                .on("error", reject);
        });

        if (transactions.length > 0) {
            await transactionRepository.bulkCreate(transactions);
        }
        return transactions.length;
    }


    async updateCategories(userId) {
        const transactions = await transactionRepository.findAllByUser(userId);
        console.log("Transações encontradas: ", transactions);
    
        const categories = await categoryRepository.findAllPremiumByUser(userId);
        console.log("Categorias encontradas (antes da conversão): ", categories);
    
        // Converte e limpa as keywords de cada categoria
        const parsedCategories = categories.map((category) => ({
            ...category,
            keywords: JSON.parse(category.keywords[0]).map((keyword) => keyword.trim()), // Extrai o conteúdo real das keywords
        }));
    
        console.log("Categorias encontradas (após conversão): ", parsedCategories);
    
        let updatedCount = 0;
    
        for (const transaction of transactions) {
            // Verifica se há correspondência entre a descrição da transação e as keywords
            const matchedCategory = parsedCategories.find((category) => {
                return category.keywords.some((keyword) =>
                    transaction.description.toLowerCase().includes(keyword.toLowerCase())
                );
            });
    
            if (matchedCategory) {
                console.log(
                    `Transação "${transaction.description}" correspondeu à categoria "${matchedCategory.name}".`
                );
    
                // Atualiza a categoria da transação somente se for diferente
                if (transaction.categoryId !== matchedCategory.id) {
                    console.log(
                        `Atualizando transação ${transaction.id} para a categoria ${matchedCategory.id}`
                    );
    
                    await transactionRepository.update(
                        transaction.id,
                        { categoryId: matchedCategory.id },
                        userId
                    );
                    updatedCount++;
                }
            }
        }
    
        console.log(`Total de transações atualizadas: ${updatedCount}`);
        return updatedCount;
    }
    


    async checkFileHash(hash) {
        const existingFile = await FileHashes.findOne({ where: { hash } });
        return !!existingFile;
    }
    async saveFileHash(hash, userId) {
        if (!userId) {
            throw new Error("Usuário não autenticado ao salvar o hash do arquivo.");
        }
        return await FileHashes.create({ hash, userId });
    }
    async deleteAllTransactions(userId) {
        try {
            // Exclui todas as transações relacionadas ao userId
            await transactionRepository.deleteAllByUser(userId);

            // Exclui o hash associado ao userId 
            await hashFileRepository.deleteAllByUserId(userId);
        } catch (error) {
            console.error("Erro no serviço ao excluir transações e hash: ", error);
            throw error; // Relança o erro para o controlador
        }
    }
    async batchDeleteTransactions(ids) {
        try {
            await transactionRepository.batchDelete(ids);
        } catch (error) {
            console.error("Erro no service ao excluir transações:", error.message);
            throw new Error("Erro ao excluir transações.");
        }
    }

}

module.exports = new TransactionService();
