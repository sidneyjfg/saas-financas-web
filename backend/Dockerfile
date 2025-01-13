# Dockerfile - Backend
FROM node:18

# Define o diretório de trabalho no container
WORKDIR /usr/src/app

# Copia os arquivos de dependências
COPY package*.json ./

# Instala as dependências
RUN npm install

# Copia o script wait-for-it
ADD https://raw.githubusercontent.com/vishnubob/wait-for-it/master/wait-for-it.sh /usr/bin/wait-for-it
RUN chmod +x /usr/bin/wait-for-it

# Copia o restante do código para o container
COPY . .

# Expõe a porta que o backend utiliza
EXPOSE 5000

# Comando para iniciar o servidor
CMD ["sh", "-c", "wait-for-it db:3306 -- npx sequelize-cli db:migrate && npm start"]
