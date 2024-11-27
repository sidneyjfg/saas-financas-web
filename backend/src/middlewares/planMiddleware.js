module.exports = (requiredPlan) => {
  return (req, res, next) => {
    console.log("Plano: ",req.user.plan);
    console.log("Required Plano: ",requiredPlan);
    const userPlan = req.user.plan; // O plano do usuário já está no middleware authenticate
    if (userPlan !== requiredPlan && requiredPlan !== "Basic") {
      return res.status(403).json({ error: `Esta funcionalidade está disponível apenas para usuários do plano ${requiredPlan}. Atualize seu plano para acessar`});
    }
    next();
  };
};
