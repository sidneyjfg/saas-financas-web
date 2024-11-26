const express = require('express');
const goalController = require('../controllers/goalController');
const authenticate = require("../middlewares/authenticate");
const router = express.Router();

// Listar metas do usuário
router.get('/', authenticate, goalController.list);

// Criar meta
router.post('/', authenticate, goalController.create);

// Atualizar meta
router.put('/:id', authenticate, goalController.update);

// Excluir meta
router.delete('/:id', authenticate, goalController.delete);

module.exports = router;
