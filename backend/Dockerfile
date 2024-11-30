# Dockerfile - Backend
FROM node:18

# Define o diretório de trabalho no container
WORKDIR /usr/src/app

# Copia os arquivos de dependências
COPY package*.json ./

# Instala as dependências
RUN npm install

# Copia o restante do código para o container
COPY . .

# Expõe a porta que o backend utiliza
EXPOSE 5000

# Comando para iniciar o servidor, executa a migração/criação do banco
CMD ["sh", "-c", "npx sequelize-cli db:migrate && npx sequelize-cli db:seed && npm start"]