module.exports = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ error: "Authorization token is required" });
  }

  const [, token] = authHeader.split(" ");

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = {
      id: decoded.id,
      email: decoded.email,
      name: decoded.name,
      plan: decoded.plan, // Inclua o plano do usuário
    };
    return next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid token" });
  }
};
