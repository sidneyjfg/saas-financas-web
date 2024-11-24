const bcrypt = require("bcryptjs");
const { generateToken } = require("../utils/jwt");
const userRepository = require("../repositories/userRepository");
const planRepository = require("../repositories/planRepository");

class UserService {
  async register({ name, email, password, planId }) {
    const plan = await planRepository.findById(planId);
    if (!plan) {
      throw new Error("Invalid plan selected");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await userRepository.create({
      name,
      email,
      password: hashedPassword,
      planId,
    });

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      plan: {
        id: plan.id,
        name: plan.name,
        features: plan.features,
      },
    };
  }

  async login({ email, password }) {
    // Validação de campos obrigatórios
    if (!email || !password) {
      throw new Error("Email and password are required");
    }

    // Buscar o usuário pelo e-mail
    const user = await userRepository.findByEmail(email);
    if (!user) {
      throw new Error("Invalid email or password");
    }

    // Comparar a senha
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new Error("Invalid email or password");
    }

    // Gerar o token JWT usando o utilitário
    const token = generateToken(
      { id: user.id, email: user.email, name: user.name },
      "1h"
    );

    return {
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    };
  }
}

module.exports = new UserService();
