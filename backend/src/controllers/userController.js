const userService = require("../services/userService");

class UserController {
  async register(req, res) {
    const { name, email, password, planId } = req.body;

    // Validação dos campos obrigatórios
    if (!name || !email || !password || !planId) {
      return res.status(422).json({ error: "All fields are required" });
    }
    // Certifique-se de que o planId é um número
    if (typeof planId !== "number") {
      return res.status(400).json({ error: "Invalid plan ID" });
    }
    try {
      const user = await userService.register({ name, email, password, planId });
      return res.status(201).json({ message: "User registered successfully", user });
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }

  async login(req, res) {
    const { email, password } = req.body;

    // Validação dos campos obrigatórios
    if (!email || !password) {
      return res.status(422).json({ error: "Email and password are required" });
    }

    try {
      const token = await userService.login({ email, password });
      return res.status(200).json({ message: "Login successful", token });
    } catch (error) {
      // Mensagem genérica para evitar exposição de detalhes
      return res.status(400).json({ error: "Invalid email or password" });
    }
  }
}

module.exports = new UserController();
