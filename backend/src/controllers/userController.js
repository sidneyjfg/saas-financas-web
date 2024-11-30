const userService = require("../services/userService.js");

class UserController {
  async register(req, res) {
    const { name, email, password, planId } = req.body;

    // Validação dos campos obrigatórios
    if (!name || !email || !password || !planId) {
      return res.status(422).json({ error: "All fields are required" });
    }
    // Certifique-se de que o planId é um número
    if (typeof planId !== "number") {
      return res.status(400).json({ error: "planId must be a number" });
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
  
    if (!email || !password) {
      return res.status(422).json({ error: "Email and password are required" });
    }
  
    try {
      const result = await userService.login({ email, password });
 
      return res.status(200).json({
        token: result.token, // Certifique-se de que o token está aqui
        plan: result.user.plan, // Certifique-se de que o plano está aqui
      });
    } catch (error) {
      console.error("Login failed:", error.message);
      return res.status(400).json({ error: "Invalid email or password" });
    }
  }
  
  async getCurrentUser (req, res) {
    const user = req.user; // O middleware 'authenticate' adiciona o usuário à requisição
    if (user) {
      res.status(200).json({
        email: user.email,
        role: user.role,
        name: user.name,
      });
    } else {
      res.status(401).json({ error: "Usuário não autenticado" });
    }
  };
}

module.exports = new UserController();
