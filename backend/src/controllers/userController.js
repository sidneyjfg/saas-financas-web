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
        token: result.token,
        user: result.user, // Certifique-se de que `result.user.plan` está correto
      });

    } catch (error) {
      console.error("Login failed:", error.message);
      return res.status(400).json({ error: "Invalid email or password" });
    }
  }


}

module.exports = new UserController();
