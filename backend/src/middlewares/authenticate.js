const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    console.error("Authorization header is missing.");
    return res.status(401).json({ error: "Authorization token is required" });
  }

  const [, token] = authHeader.split(" ");

  if (!token) {
    console.error("Token is missing in the Authorization header.");
    return res.status(401).json({ error: "Token is required" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Decoded token:", decoded);

    req.user = {
      id: decoded.id,
      email: decoded.email,
      name: decoded.name,
      plan: decoded.plan, // Inclua o plano do usuário no objeto req.user
    };

    return next();
  } catch (err) {
    console.error("Token validation failed:", err.message);

    // Diferencia erros de token inválido ou expirado
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({ error: "Token expired" });
    } else if (err.name === "JsonWebTokenError") {
      return res.status(401).json({ error: "Invalid token" });
    }

    // Outros erros genéricos
    return res.status(401).json({ error: "Failed to authenticate token" });
  }
};
