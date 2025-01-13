require('dotenv').config(); // Carrega variáveis do .env
const express = require('express');
const cors = require("cors");
const http = require('http'); // Necessário para criar o servidor HTTP
const db = require('./src/models'); // Instância configurada do Sequelize
const userRoutes = require("./src/routes/userRoutes");
const categoryRoutes = require("./src/routes/categoryRoutes");
const transactionRoutes = require("./src/routes/transactionRoutes");
const premiumFeatureRoutes = require("./src/routes/premiumFeatureRoutes");
const goalsRoute = require("./src/routes/goalRoute");
const notificationRoutes = require("./src/routes/notificationRoutes");
const { initializeWebSocket } = require("./src/services/websocketService"); // WebSocket

const app = express();
const PORT = process.env.PORT || 3000;

// Criação do servidor HTTP
const server = http.createServer(app);

// Testa conexão com o banco de dados
(async () => {
  try {
    await db.sequelize.authenticate();
    console.log('✅ Conexão com o banco de dados estabelecida com sucesso!');
  } catch (error) {
    console.error('❌ Erro ao conectar ao banco de dados:', error);
  }
})();

// Configuração de CORS
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:3000", // Origem permitida
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

// Middleware para interpretar JSON
app.use(express.json());

// Rotas
app.get('/', (req, res) => {
  res.send('🚀 FinControl API está rodando!');
});
app.use("/api/users", userRoutes);
app.use("/api/premium-feature", premiumFeatureRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/goals', goalsRoute);
app.use('/api/notifications', notificationRoutes); // Rota para notificações

// Inicializa o WebSocket no servidor HTTP
initializeWebSocket(server);

// Inicia o servidor HTTP
server.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
});

// Exporta o app para testes
module.exports = app;
