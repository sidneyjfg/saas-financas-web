const transactionService = require('../services/transactionService');

class TransactionController {
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
}

module.exports = new TransactionController();
