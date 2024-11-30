const { Sequelize } = require('sequelize');
require('dotenv').config();

// Verificar se todas as variáveis de ambiente necessárias estão definidas
const requiredEnvVars = [
  'DB_DATABASE',
  'DB_USERNAME',
  'DB_PASSWORD',
  'DB_HOST',
  'DB_DIALECT',
];

requiredEnvVars.forEach((key) => {
  if (!process.env[key]) {
    console.error(`Erro: A variável de ambiente ${key} não está definida.`);
    process.exit(1); // Encerra o processo com erro
  }
});

// Inicializar o Sequelize
const sequelize = new Sequelize(
  process.env.DB_DATABASE,
  process.env.DB_USERNAME,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT,
    logging: false, // Desativa logs do Sequelize em produção (opcional)
    pool: {
      max: 5, // Número máximo de conexões no pool
      min: 0, // Número mínimo de conexões no pool
      acquire: 30000, // Tempo máximo, em ms, para tentar adquirir uma conexão
      idle: 10000, // Tempo máximo, em ms, que uma conexão pode ficar ociosa antes de ser liberada
    },
  }
);

// Testar conexão ao banco de dados
(async () => {
  try {
    await sequelize.authenticate();
    console.log('Conexão com o banco de dados foi estabelecida com sucesso.');
  } catch (error) {
    console.error('Erro ao conectar ao banco de dados:', error.message);
    process.exit(1); // Encerra o processo com erro
  }
})();

module.exports = sequelize;
