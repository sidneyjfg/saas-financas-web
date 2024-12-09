require('dotenv').config(); // Importa variáveis de ambiente do .env

module.exports = {
  development: {
    username: process.env.DB_USERNAME || 'finUser',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_DATABASE || 'fincontrol',
    host: process.env.DB_HOST || '127.0.0.1',
    port: process.env.DB_PORT || 3306,
    dialect: process.env.DB_DIALECT || 'mysql',
    logging: console.log, // Ativa logs para o ambiente de desenvolvimento
  },
  test: {
    username: process.env.DB_USERNAME || 'finUser',
    password: process.env.DB_PASSWORD || 'Fg01032003!',
    database: process.env.DB_DATABASE || 'fincontrol_test',
    host: process.env.DB_HOST || '127.0.0.1',
    port: process.env.DB_PORT || 3306,
    dialect: process.env.DB_DIALECT || 'mysql',
    logging: false, // Desativa logs para o ambiente de teste
  },
  production: {
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: process.env.DB_DIALECT || 'mysql',
    logging: false, // Desativa logs para produção
  },
};
