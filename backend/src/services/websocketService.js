const { Server } = require("socket.io");

let io; // Instância do servidor socket.io
const clients = new Map(); // Mapeia os clientes conectados por ID de usuário

const initializeWebSocket = (server) => {
    io = new Server(server, {
        cors: {
            origin: "http://localhost:3000", // Configure conforme o seu ambiente
            methods: ["GET", "POST"],
        },
    });

    io.on("connection", (socket) => {
        const userId = socket.handshake.query["user-id"];
        console.log("Tipo e valor de userId na conexão:", typeof userId, userId);

        if (userId) {
            console.log(`🔗 Conexão estabelecida com o usuário: ${userId}`);

            // Substituir conexões duplicadas para o mesmo userId
            if (clients.has(userId)) {
                console.log(`⚠️ Conexão duplicada detectada para user-id: ${userId}. Substituindo...`);
                const oldSocket = clients.get(userId);
                if (oldSocket) {
                    oldSocket.disconnect(true); // Desconecta o socket antigo
                }
            }

            // Adicionar novo socket ao Map
            clients.set(userId, socket);
            console.log("Estado atual do Map após conexão:", Array.from(clients.keys()));

            // Evento de desconexão
            socket.on("disconnect", (reason) => {
                console.log(`🔒 Cliente desconectado. user-id: ${userId}, Motivo: ${reason}`);
                clients.delete(userId); // Remove o cliente desconectado
            });
        } else {
            console.warn("⚠️ Nenhum user-id encontrado na conexão. Desconectando...");
            socket.disconnect(); // Desconecta sockets sem user-id
        }
    });

};

// Função de broadcast para enviar mensagens
const broadcast = (targetUserId, type, message) => {
    console.log("Tentando enviar mensagem para usuário:", targetUserId);
    console.log("Tipo e valor de targetUserId:", typeof targetUserId, targetUserId);

    // Certifique-se de buscar como string
    const client = clients.get(String(targetUserId));
    console.log("Cliente encontrado no Map:", client);

    if (client) {
        if (client.connected) {
            console.log(`✅ Enviando mensagem para o cliente ${targetUserId}:`, message);
            client.emit("notification", { type, ...message });
        } else {
            console.error(`❌ Cliente ${targetUserId} está registrado, mas desconectado.`);
        }
    } else {
        console.error(`❌ Cliente ${targetUserId} não está registrado no Map.`);
    }
    console.log("Estado atual do Map de clientes:", Array.from(clients.keys()));
};


// Exporte as funções
module.exports = {
    initializeWebSocket,
    broadcast,
};
