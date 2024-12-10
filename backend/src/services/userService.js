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
    const user = await userRepository.findByEmail(email);
    if (!user) {
      throw new Error("Invalid email or password");
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new Error("Invalid email or password");
    }

    const plan = await planRepository.findById(user.planId);
    if (!plan) {
      throw new Error("User plan not found");
    }

    const token = generateToken(
      { id: user.id, email: user.email, name: user.name, plan: plan.name, teamId:user.teamId },
      "1h"
    );

    return {
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        plan: plan.name,
        teamId: user.teamId,
      },
    };
  }
}

module.exports = new UserService();
