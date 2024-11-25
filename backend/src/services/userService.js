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

    console.log("Password provided for registration:", password); // Log da senha recebida

    const hashedPassword = await bcrypt.hash(password, 10);
    console.log("Generated hashed password:", hashedPassword); // Log do hash gerado

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
    console.log("Password provided for login:", password); // Log da senha fornecida

    const user = await userRepository.findByEmail(email);
    if (!user) {
      throw new Error("Invalid email or password");
    }

    console.log("Stored hashed password from database:", user.password); // Log do hash armazenado

    const isPasswordValid = await bcrypt.compare(password, user.password);
    console.log("Password validation result:", isPasswordValid); // Log do resultado da comparação

    if (!isPasswordValid) {
      throw new Error("Invalid email or password");
    }

    const plan = await planRepository.findById(user.planId);
    console.log("Plan found for user:", plan);

    if (!plan) {
      throw new Error("User plan not found");
    }

    const token = generateToken(
      { id: user.id, email: user.email, name: user.name, plan: plan.name },
      "1h"
    );

    return {
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        plan: plan.name,
      },
    };
  }
}

module.exports = new UserService();
