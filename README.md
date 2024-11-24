
# Plataforma de Controle Financeiro e Planejamento de Metas

## Descrição do Projeto

A **Plataforma de Controle Financeiro e Planejamento de Metas** é uma aplicação online que permite a gestão financeira e o planejamento de metas, voltada para indivíduos, freelancers e pequenas empresas. Com foco na simplicidade e eficiência, o sistema oferece funcionalidades essenciais para organizar despesas, receitas e alcançar objetivos financeiros.

O projeto segue os princípios **SOLID**, garantindo escalabilidade, manutenção simplificada e organização modular do código.

---

## Funcionalidades

- **Cadastro de Receitas e Despesas**: Registro manual ou importação automatizada.
- **Relatórios Financeiros**: Gráficos interativos e exportação em PDF/Excel.
- **Planejamento de Metas**: Criação e monitoramento de objetivos financeiros.
- **Orçamento Mensal**: Controle de gastos por categoria com alertas.
- **Gestão de Dívidas e Parcelamentos**: Simulações e notificações automáticas.
- **Conexão com Contas Bancárias (Premium)**: Importação de transações.
- **Multiusuário (Premium)**: Perfis colaborativos para equipes e famílias.

---

## Modelo de Receita

- **Plano Freemium**:
  - Gratuito: Acesso a funcionalidades básicas (1 meta, relatórios simples).
  - Premium: Planos mensais/anuais com recursos avançados:
    - Conexão com contas bancárias.
    - Relatórios detalhados e exportação.
    - Perfis multiusuário e colaboração.

- **Parcerias**:
  - Monetização por comissões em serviços financeiros, como investimentos e seguros.

---

## Estrutura do Projeto

O projeto é dividido em frontend, backend e banco de dados, com separação clara de responsabilidades.

```
/saas-financas
├── /frontend
│   ├── /src
│   │   ├── /components    # Componentes reutilizáveis
│   │   ├── /pages         # Páginas principais
│   │   ├── /hooks         # Hooks personalizados
│   │   ├── /contexts      # Contextos globais
│   │   ├── /services      # Integração com APIs do backend
│   │   └── App.js        # Ponto de entrada do React
│   └── package.json       # Configurações do frontend
├── /backend
|   ├── /src
│   |    ├── /config             # Configurações globais (ex.: banco de dados, JWT, etc.)
│   |    │   ├── db.js           # Configuração do banco de dados com Sequelize
│   |    │   └── config.js       # Configurações diversas (ex.: JWT_SECRET)
│   |    ├── /controllers        # Controladores (recebem requisições HTTP)
│   |    │   ├── userController.js
│   |    │   ├── transactionController.js
│   |    │   └── ...outros
│   |    ├── /services           # Regras de negócios
│   |    │   ├── userService.js
│   |    │   ├── transactionService.js
│   |    │   └── ...outros
│   |    ├── /models             # Modelos do Sequelize (definições de tabelas)
│   |    │   ├── index.js        # Inicialização dos modelos do Sequelize
│   |    │   ├── user.js         # Modelo de usuário
│   |    │   ├── plan.js         # Modelo de plano
│   |    │   └── ...outros
│   |    ├── /repositories       # Acesso ao banco de dados (ORM)
│   |    │   ├── userRepository.js
│   |    │   ├── transactionRepository.js
│   |    │   └── ...outros
│   |    ├── /middlewares        # Middlewares globais (ex.: autenticação)
│   |    │   ├── authMiddleware.js
│   |    │   └── ...outros
│   |    ├── /routes             # Definição das rotas da API
│   |    │   ├── userRoutes.js
│   |    │   ├── transactionRoutes.js
│   |    │   └── ...outros
│   |    ├── /utils              # Funções auxiliares (ex.: validações, formatações)
│   |    │   ├── jwtUtils.js
│   |    │   ├── passwordUtils.js
│   |    │   └── ...outros
│   └── index.js           # Inicialização do servidor Express
├── /migrations             # Scripts de migração do banco de dados
│   ├── 20241124-create-users.js
│   ├── 20241124-create-plans.js
│   └── ...outros
├── /seeders                # Seeds (dados iniciais para popular o banco)
│   ├── 20241124-initial-plans.js
│   └── ...outros
├── package.json            # Configurações do Node.js (dependências e scripts)
└── README.md               # Documentação do backend
├── /database
│   ├── migrations         # Scripts de migração
│   └── seeders            # Dados iniciais para teste
└── README.md              # Documentação do projeto
```

---

## Tecnologias Utilizadas

### **Frontend**
- **Framework:** React.js
- **Gerenciamento de Estado:** Context API
- **Estilização:** Tailwind CSS
- **Gráficos:** Chart.js para relatórios interativos
- **Autenticação:** Firebase Authentication

### **Backend**
- **Framework:** Node.js com Express
- **Arquitetura:** SOLID
- **ORM:** Sequelize
- **Autenticação:** JWT (JSON Web Tokens)
- **Integrações:** APIs bancárias para importação de transações

### **Banco de Dados**
- **Banco Relacional:** MySQL
- **Estrutura Inicial**:
  - **Users**: Cadastro de usuários
  - **Transactions**: Registro de receitas/despesas
  - **Goals**: Planejamento de metas
  - **Budgets**: Controle de orçamento mensal

---

## Como Executar o Projeto

### **Pré-requisitos**
- Node.js >= 16.0
- MySQL
- NPM

### **Passos**

1. Clone o repositório:
   ```bash
   git clone https://github.com/seu-repositorio.git
   ```

2. Configure as variáveis de ambiente:
   - No diretório `/backend`, crie um arquivo `.env` com o seguinte conteúdo:
     ```
     DATABASE_URL=mysql://username:password@localhost:3306/controle_financeiro
     JWT_SECRET=sua-chave-secreta
     ```

3. Instale as dependências:
   ```bash
   cd frontend && npm install
   cd ../backend && npm install
   ```

4. Execute o banco de dados:
   ```bash
   docker-compose up -d
   ```

5. Inicie o backend:
   ```bash
   cd backend && npm dev
   ```

6. Inicie o frontend:
   ```bash
   cd frontend && npm start
   ```

---

## Roadmap

### **Fase 1: MVP**
- Cadastro de receitas e despesas
- Relatórios financeiros básicos
- Planejamento de metas simples

### **Fase 2: Funcionalidades Avançadas**
- Planejamento orçamentário
- Exportação de relatórios
- Integração com contas bancárias

### **Fase 3: Premium**
- Multiusuário
- Relatórios detalhados
- Colaboração em equipe

---

## Contribuindo

Contribuições são bem-vindas!  
Siga as diretrizes no arquivo `CONTRIBUTING.md`.

---

## Licença

Este projeto está licenciado sob a licença MIT. Consulte o arquivo `LICENSE` para mais informações.
