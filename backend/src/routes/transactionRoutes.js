const express = require('express');
const transactionController = require('../controllers/transactionController');
const authenticate = require("../middlewares/authenticate");

console.log('TransactionController:', transactionController);
console.log('getMonthlyReport:', transactionController.getMonthlyReport);
console.log('getTransactions:', transactionController.getTransactions);

const router = express.Router();

router.get('/monthly', authenticate, transactionController.getMonthlyReport);
router.get('/transactions', authenticate, transactionController.getTransactions);

module.exports = router;
