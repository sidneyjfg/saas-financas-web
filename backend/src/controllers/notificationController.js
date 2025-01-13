const { Notification } = require('../models');
const { broadcast } = require("../services/websocketService"); // Certifique-se de importar o broadcast

class NotificationController {
  // Obter todas as notificações do usuário
  async getNotifications(req, res) {
    try {
      const userId = req.user.id; // Obtém o ID do usuário autenticado
      const notifications = await Notification.findAll({
        where: { userId },
        order: [['createdAt', 'DESC']],
      });
      
      return res.status(200).json(notifications);
    } catch (error) {
      console.error('Erro ao buscar notificações:', error);
      return res.status(500).json({ error: 'Erro ao buscar notificações' });
    }
  }

  // Marcar uma notificação como lida
  async markAsRead(req, res) {
    try {
      const userId = req.user.id;
      const notificationId = req.params.id;

      const notification = await Notification.findOne({
        where: { id: notificationId, userId },
      });

      if (!notification) {
        return res.status(404).json({ error: 'Notificação não encontrada' });
      }

      notification.isRead = true;
      await notification.save();

      return res.status(200).json({ message: 'Notificação marcada como lida' });
    } catch (error) {
      console.error('Erro ao marcar notificação como lida:', error);
      return res.status(500).json({ error: 'Erro ao marcar notificação como lida' });
    }
  }

  // Marcar todas as notificações como lidas
  async markAllAsRead(req, res) {
    try {
      const userId = req.user.id;

      await Notification.update(
        { isRead: true },
        { where: { userId, isRead: false } }
      );

      return res.status(200).json({ message: 'Todas as notificações foram marcadas como lidas' });
    } catch (error) {
      console.error('Erro ao marcar todas as notificações como lidas:', error);
      return res.status(500).json({ error: 'Erro ao marcar todas as notificações como lidas' });
    }
  }

  // Deletar uma notificação
  async deleteNotification(req, res) {
    try {
      const userId = req.user.id;
      const notificationId = req.params.id;

      const deleted = await Notification.destroy({
        where: { id: notificationId, userId },
      });

      if (!deleted) {
        return res.status(404).json({ error: 'Notificação não encontrada' });
      }

      return res.status(200).json({ message: 'Notificação deletada com sucesso' });
    } catch (error) {
      console.error('Erro ao deletar notificação:', error);
      return res.status(500).json({ error: 'Erro ao deletar notificação' });
    }
  }

  // Deletar todas as notificações
  async deleteAllNotifications(req, res) {
    try {
      const userId = req.user.id;

      await Notification.destroy({ where: { userId } });

      return res.status(200).json({ message: 'Todas as notificações foram deletadas com sucesso' });
    } catch (error) {
      console.error('Erro ao deletar todas as notificações:', error);
      return res.status(500).json({ error: 'Erro ao deletar todas as notificações' });
    }
  }
  // Criar notificação
  async createNotification(req, res) {
    try {
      const { message, userId, type } = req.body;

      if (!message || !userId || !type) {
        return res.status(400).json({ error: "Todos os campos são obrigatórios" });
      }

      const notification = await Notification.create({
        message,
        userId,
        type,
        isRead: false, // Padrão como não lida
      });
      console.log(userId);
      // Envia a notificação para o WebSocket em tempo real
      broadcast(userId, "notification", notification);

      return res.status(201).json({
        message: "Notificação criada com sucesso",
        notification,
      });
    } catch (error) {
      console.error("Erro ao criar notificação:", error);
      return res.status(500).json({ error: "Erro ao criar notificação" });
    }
  }

}

module.exports = new NotificationController();