const express = require('express');
const multer = require('multer');

const path = require("path");
const transactionController = require('../controllers/transactionController');
const authenticate = require("../middlewares/authenticate");
const planMiddleware = require("../middlewares/planMiddleware");
const router = express.Router();
// Configuração de upload
const upload = multer({ dest: path.join(__dirname, "../uploads") });



// Criar transação
router.post('/', authenticate, transactionController.create);

// Atualizar transação
router.put('/update-categories', authenticate, transactionController.updateCategories);
router.put('/:id', authenticate, transactionController.update);
router.delete('/batch-delete', authenticate, transactionController.batchDeleteTransactions);

// Excluir transação
router.delete('/:id', authenticate, transactionController.delete);

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

// Rotas
router.post(
  "/import",
  upload.single("file"),
  authenticate,
  planMiddleware("Premium"), // Restringe para usuários Premium
  transactionController.importCSV
);

router.delete('/delete-all/:id', authenticate, planMiddleware('Premium'), transactionController.deleteAllTransactions);


module.exports = router;
