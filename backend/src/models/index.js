'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
require('dotenv').config(); // Carrega as variáveis do .env
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const db = {};

// Configuração do Sequelize com variáveis de ambiente
const sequelize = new Sequelize(
  process.env.DB_DATABASE, // Nome do banco
  process.env.DB_USERNAME, // Usuário
  process.env.DB_PASSWORD, // Senha
  {
    host: process.env.DB_HOST,   // Host do banco
    dialect: process.env.DB_DIALECT || 'mysql', // Dialeto do banco
    define: {
      freezeTableName: true, // Evita que o Sequelize pluralize os nomes
    },
    logging: env === 'development' ? console.log : false, // Log apenas no ambiente de desenvolvimento
  }
  
);

// Carrega todos os modelos na pasta /models
fs.readdirSync(__dirname)
  .filter((file) => {
    return (
      file.indexOf('.') !== 0 &&
      file !== basename &&
      file.slice(-3) === '.js' &&
      file.indexOf('.test.js') === -1
    );
  })
  .forEach((file) => {
    const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
    db[model.name] = model;
  });

// Configura associações entre modelos, se existirem
Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize; // Exporta a instância do Sequelize
db.Sequelize = Sequelize; // Exporta o construtor do Sequelize

module.exports = db;
