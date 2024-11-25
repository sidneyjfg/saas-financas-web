const express = require('express');
const categoryController = require('../controllers/categoryController');
const authenticate = require('../middlewares/authenticate'); // Middleware de autenticação
const planMiddleware = require('../middlewares/planMiddleware');

const router = express.Router();
router.use(authenticate); // Garante que todas as rotas de categoria sejam autenticadas

router.post('/', categoryController.create);
router.get('/premium', planMiddleware("Premium"), categoryController.listPremium); // Listar categorias Premium
router.get('/basic', planMiddleware("Basic"), categoryController.listBasic); // Listar categorias Básicas
router.put('/:id', categoryController.update);
router.delete('/:id', categoryController.delete);

module.exports = router;
