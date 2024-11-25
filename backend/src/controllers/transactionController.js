const transactionService = require('../services/transactionService');

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
      console.error('Error fetching transactions:', error.message);
      return res.status(500).json({ error: 'Error fetching transactions' });
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
      const exportFile = await transactionService.exportToCSV(userId);
      res.setHeader("Content-Disposition", "attachment; filename=transactions.csv");
      res.setHeader("Content-Type", "text/csv");
      return res.status(200).send(exportFile);
    } catch (error) {
      console.error('Error exporting transactions:', error.message);
      return res.status(500).json({ error: 'Error exporting transactions' });
    }
  }
}

module.exports = new TransactionController();
