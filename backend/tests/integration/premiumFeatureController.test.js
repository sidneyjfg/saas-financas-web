const request = require("supertest");
const app = require("../../index"); // Certifique-se de importar o app configurado
const db = require("../../src/models");
const { generateToken } = require("../../src/utils/jwt");

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
        features: JSON.stringify(["dashboard", "reports", "team_management"]),
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

describe("Premium Feature Controller", () => {
  test("Access granted to premium feature", async () => {
    const user = {
      id: 1,
      name: "Premium User",
      email: "premium@example.com",
      plan: { name: "Premium", features: ["team_management"] },
    };
    const token = generateToken(user);

    const res = await request(app)
      .post("/api/premium-feature")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("message", "Access granted to premium feature");
    expect(res.body.user.plan).toHaveProperty("name", "Premium");
  });

  test("Access denied for basic plan", async () => {
    const user = {
      id: 2,
      name: "Basic User",
      email: "basic@example.com",
      plan: { name: "Basic", features: [] },
    };
    const token = generateToken(user);

    const res = await request(app)
      .post("/api/premium-feature")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(403);
    expect(res.body).toHaveProperty("error", "Access denied: Plan does not support this feature");
  });
});
