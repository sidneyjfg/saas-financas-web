const express = require('express');
const notificationController = require('../controllers/notificationController');
const authenticate = require("../middlewares/authenticate");
const planMiddleware = require("../middlewares/planMiddleware");

const router = express.Router();

// Obter todas as notificações do usuário (somente para Premium)
router.get(
  '/',
  authenticate, // Verifica autenticação
  planMiddleware("Premium"), // Restringe a usuários Premium
  notificationController.getNotifications
);

// Marcar uma notificação como lida
router.put(
  '/:id/read',
  authenticate, // Verifica autenticação
  planMiddleware("Premium"), // Restringe a usuários Premium
  notificationController.markAsRead
);

// Marcar todas as notificações como lidas
router.put(
  '/read-all',
  authenticate, // Verifica autenticação
  planMiddleware("Premium"), // Restringe a usuários Premium
  notificationController.markAllAsRead
);

// Deletar uma notificação
router.delete(
  '/:id',
  authenticate, // Verifica autenticação
  planMiddleware("Premium"), // Restringe a usuários Premium
  notificationController.deleteNotification
);

// Deletar todas as notificações
router.delete(
  '/delete-all',
  authenticate, // Verifica autenticação
  planMiddleware("Premium"), // Restringe a usuários Premium
  notificationController.deleteAllNotifications
);

// Criar notificação (somente para usuários Premium)
router.post(
  "/",
  authenticate,
  planMiddleware("Premium"),
  notificationController.createNotification
);
module.exports = router;
