# SaaS Finanças - Plataforma de Controle Financeiro e Planejamento de Metas

## **Descrição do Projeto**

O **SaaS Finanças** é uma aplicação web para controle financeiro e planejamento de metas. Criado para usuários individuais, freelancers e pequenas empresas, o sistema facilita o gerenciamento de receitas, despesas, orçamentos e objetivos financeiros.  

O projeto segue as boas práticas de desenvolvimento, como a arquitetura **SOLID**, promovendo código modular, organizado e fácil de escalar.

---

## **Funcionalidades**

### **Plano Gratuito**
- Registro de receitas e despesas manualmente.
- Relatórios financeiros simples.
- Planejamento de 1 meta financeira.
- Controle básico de orçamento mensal.

### **Plano Premium**
- Conexão com contas bancárias para importação de transações.
- Relatórios detalhados com gráficos interativos e exportação em PDF/Excel.
- Gestão colaborativa multiusuário (famílias/equipes).
- Controle avançado de dívidas e parcelamentos.
- Alerta e notificações automáticas sobre metas e orçamentos.

---

## **Tecnologias Utilizadas**

### **Frontend**
- **Framework:** React.js
- **Estilização:** Tailwind CSS
- **Roteamento:** React Router
- **Estado Global:** Context API e Hooks personalizados
- **Gráficos:** Chart.js
- **Interações com Backend:** Axios

### **Backend**
- **Framework:** Node.js com Express
- **Autenticação:** JWT (JSON Web Tokens)
- **ORM:** Sequelize
- **Estrutura e Design de Código:** Arquitetura SOLID e organização modular
- **Middleware:** Validação de planos e autenticação

### **Banco de Dados**
- **Banco Relacional:** MySQL
- **Estrutura**:
  - `Users`: Gerenciamento de usuários.
  - `Plans`: Planos de assinatura (Gratuito e Premium).
  - `Transactions`: Gerenciamento de receitas e despesas.
  - `Goals`: Planejamento de metas financeiras.
  - `Budgets`: Controle de orçamento mensal por categoria.
  - `Debts`: Gerenciamento de dívidas e parcelamentos.

---

## **Estrutura do Projeto**

O projeto foi organizado em duas pastas principais: **frontend** e **backend**, cada uma seguindo uma estrutura modular e de fácil manutenção.

### **Estrutura Geral**

```plaintext
/saas-financas
├── /frontend       # Interface do usuário
│   ├── /src
│   │   ├── /components    # Componentes reutilizáveis (ex.: Navbar)
│   │   ├── /pages         # Páginas do aplicativo
│   │   ├── /hooks         # Hooks personalizados
│   │   ├── /contexts      # Contextos globais (ex.: autenticação)
│   │   ├── /services      # Serviços para comunicação com backend (ex.: authService.js)
│   │   ├── App.js         # Arquivo principal do React
│   │   └── index.js       # Ponto de entrada do React
│   └── public             # Arquivos estáticos (ex.: index.html)
│   └── package.json       # Dependências do frontend
├── /backend
│   ├── /src
│   │   ├── /config             # Configurações do banco e JWT
│   │   ├── /controllers        # Controladores (userController.js, etc.)
│   │   ├── /middlewares        # Middlewares (autenticação, validação de planos)
│   │   ├── /models             # Modelos Sequelize
│   │   ├── /repositories       # Acesso ao banco (planRepository.js, etc.)
│   │   ├── /routes             # Rotas da API
│   │   ├── /services           # Regras de negócio (userService.js, etc.)
│   │   ├── /utils              # Funções auxiliares (ex.: JWT, validações)
│   │   └── index.js            # Inicialização do servidor
│   ├── /migrations             # Scripts para criação do banco
│   ├── /seeders                # Dados iniciais para o banco (ex.: planos)
│   └── package.json            # Dependências do backend
```

---

## **Configuração e Execução**

### **Pré-requisitos**
- Node.js >= 16
- MySQL
- Docker (opcional)

### **Passos para Configuração**

1. **Clone o Repositório**
   ```bash
   git clone https://github.com/seu-usuario/saas-financas.git
   cd saas-financas
   ```

2. **Configuração do Backend**
   - Crie um arquivo `.env` na pasta `/backend`:
     ```
     DB_USERNAME=seu_usuario
     DB_PASSWORD=sua_senha
     DB_DATABASE=saas_financas
     DB_HOST=localhost
     JWT_SECRET=sua_chave_secreta
     ```

3. **Configuração do Frontend**
   - Crie um arquivo `.env` na pasta `/frontend`:
     ```
     REACT_APP_API_URL=http://localhost:5000/api
     ```

4. **Instale as Dependências**
   ```bash
   cd frontend && npm install
   cd ../backend && npm install
   ```

5. **Configure o Banco de Dados**
   ```bash
   cd backend
   npx sequelize-cli db:migrate
   npx sequelize-cli db:seed:all
   ```

6. **Execute o Projeto**
   - **Backend**:
     ```bash
     cd backend && npm start
     ```
   - **Frontend**:
     ```bash
     cd frontend && npm start
     ```

---

## **Roadmap**

### **Versão Atual**
- Cadastro de usuários com plano básico e premium.
- Autenticação e controle de acesso via JWT.
- Registro de transações financeiras.

### **Próximas Funcionalidades**
1. Relatórios avançados com exportação em PDF/Excel.
2. Integração com APIs bancárias.
3. Multiusuário para colaboração em equipes e famílias.
4. Alerta automático de orçamento e vencimento de dívidas.

---

## **Contribuições**

Contribuições são bem-vindas!  
Abra uma issue ou envie um pull request para melhorar o projeto.

---

## **Licença**

Este projeto está licenciado sob a licença MIT. Consulte o arquivo `LICENSE` para mais informações.
