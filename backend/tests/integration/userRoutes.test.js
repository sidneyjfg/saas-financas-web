const request = require('supertest');
const app = require('../../index'); // Certifique-se de importar do caminho correto
const db = require('../../src/models');

beforeAll(async () => {
  console.log('Iniciando sincronização do banco...');
  try {
    await db.sequelize.sync({ force: true }); // Limpa e sincroniza o banco
    console.log('Sincronização bem-sucedida.');

    // Inserir planos no banco
    await db.Plan.bulkCreate([
      {
        name: "Basic",
        price: 0,
        features: JSON.stringify(["dashboard", "reports"]),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Premium",
        price: 29.99,
        features: JSON.stringify(["dashboard", "reports", "notifications"]),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
    console.log('Seed inserido com sucesso.');
  } catch (error) {
    console.error('Erro durante o beforeAll:', error);
  }
});


afterAll(async () => {
  await db.sequelize.close(); // Fecha a conexão com o banco após os testes
});

describe('User Routes', () => {
  test("POST /api/users/register - should register a new user", async () => {
    const res = await request(app)
      .post("/api/users/register")
      .send({
        name: "Test User",
        email: "test@example.com",
        password: "123456",
        planId: 1, // Certifique-se de que esse ID está no banco
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.user).toHaveProperty("email", "test@example.com");
  });

  test('POST /api/users/login - should login with valid credentials', async () => {
    const res = await request(app)
      .post('/api/users/login')
      .send({
        email: 'test@example.com', // Mesmo e-mail do registro
        password: '123456', // Mesmo senha do registro
      });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('token');
  });

  test('POST /api/users/login - should fail with invalid credentials', async () => {
    const res = await request(app)
      .post('/api/users/login')
      .send({
        email: 'test@example.com',
        password: 'wrongpassword',
      });

    expect(res.statusCode).toBe(400);
    expect(res.body.error).toBe('Invalid email or password');
  });
});
