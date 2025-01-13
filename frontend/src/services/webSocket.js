import { io } from "socket.io-client";

const SOCKET_URL = process.env.REACT_APP_SOCKET_URL || "http://localhost:5000";

let socket;

export const initializeSocket = (user) => {
  if (!user?.id) {
    console.warn("⚠️ Usuário inválido ou ID ausente. WebSocket não inicializado.");
    return;
  }

  if (!socket || socket.disconnected) {
    console.log("🔌 Tentando inicializar WebSocket para usuário:", user.id);
    try {
      
      socket = io(SOCKET_URL, {
        query: { "user-id": user.id },
        transports: ["websocket"],
        withCredentials: true,
      });

      // Eventos de conexão
      socket.on("connect", () => {
        console.log("✅ Conectado ao WebSocket com ID:", socket.id);
      });

      socket.on("connect_error", (error) => {
        console.error("❌ Erro ao conectar ao WebSocket:", error.message);
      });

      socket.on("disconnect", (reason) => {
        console.log("❌ WebSocket desconectado. Motivo:", reason);
      });

      // Evento para notificações
      socket.on("notification", (notification) => {
        console.log("📨 Notificação recebida:", notification);
      });
    } catch (error) {
      console.error("❌ Erro ao inicializar WebSocket:", error);
    }
  } else {
    console.log("🔌 WebSocket já inicializado.");
  }
};

export const getSocket = () => socket;
