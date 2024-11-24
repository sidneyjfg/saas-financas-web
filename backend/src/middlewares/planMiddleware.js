module.exports = (requiredFeature) => {
  return (req, res, next) => {
    const userPlan = req.user.plan; // Supondo que o plano do usuário está disponível no req.user

    if (!userPlan.features.includes(requiredFeature)) {
      return res.status(403).json({ error: "Access denied: Plan does not support this feature" });
    }

    next();
  };
};
