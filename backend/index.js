require('dotenv').config(); // Carrega o .env
const express = require('express');
const cors = require("cors"); 
const db = require('./src/models'); // Importa a instância configurada do Sequelize
const userRoutes = require("./src/routes/userRoutes");
const categoryRoutes = require('./src/routes/categoryRoutes');
const transactionRoutes = require('./src/routes/transactionRoutes');
const premiumFeatureRoutes = require("./src/routes/premiumFeatureRoutes");
const goalsRoute = require("./src/routes/goalRoute");
const teamsRoutes = require("./src/routes/teamRoutes");

const app = express();
const PORT = process.env.PORT || 3000;

// Teste de conexão com o banco
(async () => {
  try {
    await db.sequelize.authenticate();
    console.log('Conexão com o banco de dados estabelecida com sucesso!');
  } catch (error) {
    console.error('Erro ao conectar ao banco de dados:', error);
  }
})();

app.use(
  cors({
    origin: "http://localhost:3000", // Permite apenas o frontend acessar
    methods: ["GET", "POST", "PUT", "DELETE"], // Métodos HTTP permitidos
    credentials: true, // Caso precise de cookies
  })
);
app.use(express.json());

// Rotas
app.get('/', (req, res) => {
  res.send('FinControl API');
});
app.use("/api/users", userRoutes);
app.use("/api/premium-feature", premiumFeatureRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/goals', goalsRoute);
app.use('/api/teams', teamsRoutes);

// Iniciar servidor apenas se não for ambiente de teste
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
    console.log("Log de teste - console.log está funcionando!");
  });
}

// Exporta o app para testes
module.exports = app;
