# Etapa 1: Build do React
FROM node:18 AS builder

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install

COPY . .

# Adiciona a variável de ambiente para ser usada no build
ARG REACT_APP_API_URL
ENV REACT_APP_API_URL=${REACT_APP_API_URL}

# Gera o build de produção
RUN npm run build

# Etapa 2: Servir o build com Nginx
FROM nginx:alpine

# Remove a configuração padrão do Nginx
RUN rm /etc/nginx/conf.d/default.conf

# Adiciona a configuração personalizada do Nginx
COPY nginx.conf /etc/nginx/conf.d

# Copia os arquivos do build para o Nginx
COPY --from=builder /usr/src/app/build /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
