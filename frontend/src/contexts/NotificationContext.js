import api from "../services/api";
import { createContext, useContext, useEffect, useState } from "react";
import { getSocket } from "../services/webSocket";

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]); // Todas as notificações
  const [unreadNotifications, setUnreadNotifications] = useState([]); // Apenas não lidas

  // Função para buscar notificações do backend
  const fetchNotifications = async () => {
    try {
      const response = await api.get("/notifications", { withCredentials: true });
      const allNotifications = response.data;
      console.log("Recebi",allNotifications);
      setNotifications(allNotifications);

      // Filtrar notificações não lidas
      const unread = allNotifications.filter((notification) => !notification.isRead);
      setUnreadNotifications(unread);
    } catch (error) {
      console.error("Erro ao buscar notificações:", error);
    }
  };

  // Configurar WebSocket e buscar notificações ao inicializar
  useEffect(() => {
    fetchNotifications(); // Buscar notificações do backend

    const socket = getSocket();
    if (socket) {
      socket.on("notification", (notification) => {
        console.log("📨 Notificação recebida no contexto:", notification);

        // Adicionar a nova notificação ao estado
        setNotifications((prev) => [notification, ...prev]);

        // Adicionar à lista de não lidas
        setUnreadNotifications((prev) => [notification, ...prev]);
      });

      return () => {
        console.log("🛑 Removendo listener de notificações.");
        socket.off("notification");
      };
    }
  }, []);

  return (
    <NotificationContext.Provider value={{ notifications, unreadNotifications, fetchNotifications }}>
      {children}
    </NotificationContext.Provider>
  );
  
};

export const useNotifications = () => useContext(NotificationContext);
