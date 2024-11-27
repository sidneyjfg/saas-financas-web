const transactionService = require('../services/transactionService');
const fs = require("fs");

class TransactionController {
  // Relatório mensal básico
  async getMonthlyReport(req, res) {
    const userId = req.user.id;

    try {
      const transactions = await transactionService.getMonthlyReport(userId);
      return res.status(200).json(transactions);
    } catch (error) {
      console.error('Error fetching monthly report:', error.message);
      return res.status(500).json({ error: 'Error generating report' });
    }
  }

  // Listagem de transações básicas
  async getTransactions(req, res) {
    const userId = req.user.id;

    try {
      const transactions = await transactionService.getTransactions(userId);
      return res.status(200).json(transactions);
    } catch (error) {
      console.error('Erro ao listar transações:', error.message);
      return res.status(500).json({ error: 'Erro ao listar transações.' });
    }
  }

  // Relatório avançado (Premium)
  async getPremiumSummary(req, res) {
    const userId = req.user.id;

    try {
      const summary = await transactionService.getPremiumSummary(userId);
      return res.status(200).json(summary);
    } catch (error) {
      console.error('Error fetching premium summary:', error.message);
      return res.status(500).json({ error: 'Error generating premium summary' });
    }
  }

  // Exportação de dados (Premium)
  async exportTransactions(req, res) {
    const userId = req.user.id;

    try {
      const exportFile = await transactionService.exportToCSV(userId); // Função no serviço
      res.setHeader("Content-Disposition", "attachment; filename=basic_transactions.csv");
      res.setHeader("Content-Type", "text/csv");
      return res.status(200).send(exportFile);
    } catch (error) {
      console.error('Error exporting basic transactions:', error.message);
      return res.status(500).json({ error: 'Error exporting transactions' });
    }
  }
  async create(req, res) {
    const userId = req.user.id;
    const { date, type, amount, description, categoryId } = req.body;

    if (!date || !type || !amount) {
      return res.status(400).json({ error: 'Data, tipo e valor são obrigatórios.' });
    }

    try {
      const transaction = await transactionService.createTransaction({
        date,
        type,
        amount,
        description,
        categoryId,
        userId,
      });
      return res.status(201).json(transaction);
    } catch (error) {
      console.error('Erro ao criar transação:', error.message);
      return res.status(500).json({ error: 'Erro ao criar transação.' });
    }
  }

  // Atualizar transação
  async update(req, res) {
    const userId = req.user.id;
    const { id } = req.params;
    const { date, type, amount, description, categoryId } = req.body;

    try {
      const transaction = await transactionService.updateTransaction(id, {
        date,
        type,
        amount,
        description,
        categoryId,
        userId,
      });
      return res.status(200).json(transaction);
    } catch (error) {
      console.error('Erro ao atualizar transação:', error.message);
      return res.status(500).json({ error: 'Erro ao atualizar transação.' });
    }
  }

  async updateCategories(req, res) {
    console.log("Estou aqui");
    const userId = req.user?.id; // Certifique-se de que req.user existe
    if (!userId) {
      return res.status(400).json({ error: "userId não encontrado na requisição" });
    }
    try {
      const updatedCount = await transactionService.updateCategories(userId);
      return res
        .status(200)
        .json({ message: `${updatedCount} transações foram atualizadas.` });
    } catch (error) {
      console.error("Erro ao atualizar categorias:", error.message);
      return res.status(500).json({ error: "Erro ao atualizar categorias." });
    }
  }

  // Excluir transação
  async delete(req, res) {
    const userId = req.user.id;
    const { id } = req.params;

    try {
      await transactionService.deleteTransaction(id, userId);
      return res.status(200).json({ message: 'Transação excluída com sucesso.' });
    } catch (error) {
      console.error('Erro ao excluir transação:', error.message);
      return res.status(500).json({ error: 'Erro ao excluir transação.' });
    }
  }

  async importCSV(req, res) {
    const filePath = req.file.path;

    try {
      console.log("Arquivo recebido com sucesso!");
      const totalTransactions = await transactionService.importTransactionsFromCSV(
        filePath,
        req.user.id // Passa o ID do usuário autenticado
      );

      // Remove o arquivo após processar
      fs.unlinkSync(filePath);

      return res.status(200).json({
        message: `${totalTransactions} transações importadas com sucesso!`,
      });
    } catch (error) {
      console.error("Erro ao importar CSV:", error);
      return res.status(500).json({ error: "Erro ao importar CSV." });
    }
  }

}

module.exports = new TransactionController();
