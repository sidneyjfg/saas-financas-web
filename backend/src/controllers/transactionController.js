const transactionService = require('../services/transactionService');
const hashFileService = require('../services/hashFileService');
const fs = require("fs");
const crypto = require("crypto");


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
    const userId = req.user?.id; // Certifique-se de que userId está definido
    const { date, type, amount, description, categoryId } = req.body;

    if (!date || !type || !amount || !categoryId) {
      return res.status(400).json({ error: "Data, tipo, valor e categoria são obrigatórios." });
    }

    try {
      console.log("Usuário autenticado:", userId); // Log para verificar se userId está presente

      const transaction = await transactionService.createTransaction({
        date,
        type,
        amount,
        description,
        categoryId,
        userId, // Passar userId explicitamente
      });

      return res.status(201).json(transaction);
    } catch (error) {
      console.error("Erro ao criar transação:", error.message);
      return res.status(500).json({ error: "Erro ao criar transação." });
    }
  }

  // Atualizar transação
  async update(req, res) {
    const userId = req.user.id;
    const { id } = req.params;
    const { date, type, amount, description, categoryId } = req.body;

    // Valide o `categoryId` no controller
    if (!Number.isInteger(categoryId)) {
      return res.status(400).json({ error: "ID da categoria inválido." });
    }

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
    const userId = req.user?.id;
    const { id } = req.params;

    try {
      await transactionService.deleteTransaction(id, userId);
      return res.status(200).json({ message: 'Transação excluída com sucesso.' });
    } catch (error) {
      console.log("OI");
      console.error('Erro ao excluir transação:', error.message);
      return res.status(500).json({ error: 'Erro ao excluir transação.' });
    }
  }

  async importCSV(req, res) {
    const filePath = req.file.path;

    try {
      const fileBuffer = fs.readFileSync(filePath);
      const fileHash = crypto.createHash("sha256").update(fileBuffer).digest("hex");

      const isDuplicate = await transactionService.checkFileHash(fileHash);
      if (isDuplicate) {
        fs.unlinkSync(filePath);
        return res.status(400).json({ error: "Este arquivo já foi importado anteriormente." });
      }

      await transactionService.saveFileHash(fileHash, req.user.id);
      const totalTransactions = await transactionService.importTransactionsFromCSV(filePath, req.user.id);

      fs.unlinkSync(filePath);
      return res.status(200).json({ message: `${totalTransactions} transações importadas com sucesso!` });
    } catch (error) {
      console.error("Erro ao importar CSV:", error);
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
      return res.status(500).json({ error: "Erro ao importar CSV." });
    }
  }

  // Controller de Transações
  async deleteAllTransactions(req, res) {
    const { id } = req.params; // Captura o ID do usuário dos parâmetros da URL

    if (!id) {
      return res.status(400).json({ error: "O ID do usuário é obrigatório." });
    }

    try {

      // Exclui as transações e o hash associado
      await transactionService.deleteAllTransactions(id);

      return res.status(200).json({ message: "Transações e hash associados foram excluídos com sucesso." });
    } catch (error) {
      console.error("Erro ao excluir transações e hash:", error);
      return res.status(500).json({ error: "Erro ao excluir transações e hash." });
    }
  }

}

module.exports = new TransactionController();
