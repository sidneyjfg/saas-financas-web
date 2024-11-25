const express = require('express');
const transactionController = require('../controllers/transactionController');
const authenticate = require("../middlewares/authenticate");
const planMiddleware = require("../middlewares/planMiddleware");
const router = express.Router();

// Relatórios mensais básicos (acessível por usuários Básicos e Premium)
router.get(
  '/monthly',
  authenticate,
  planMiddleware("Basic"), // Permite usuários Básicos e Premium
  transactionController.getMonthlyReport
);

// Listagem de transações (acessível por usuários Básicos e Premium)
router.get(
  '/',
  authenticate,
  planMiddleware("Basic"), // Permite usuários Básicos e Premium
  transactionController.getTransactions
);

// Relatórios avançados (somente para usuários Premium)
router.get(
  "/premium/summary",
  authenticate, // Verifica autenticação
  planMiddleware("Premium"), // Permite apenas usuários Premium
  transactionController.getPremiumSummary // Executa o controlador
);

router.get(
  "/premium/export",
  authenticate, // Verifica autenticação
  planMiddleware("Premium"), // Permite apenas usuários Premium
  transactionController.exportTransactions // Controlador para exportar relatórios
);

router.get(
  "/basic/export",
  authenticate,
  planMiddleware("Basic"),
  transactionController.exportTransactions // Exporta transações para CSV
);


module.exports = router;
