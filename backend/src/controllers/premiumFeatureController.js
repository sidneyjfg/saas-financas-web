class PremiumFeatureController {
  async accessFeature(req, res) {
    try {
      const { plan } = req.user; // Supondo que o middleware `authenticate` adiciona `user` ao `req`
      if (!plan) {
        return res
          .status(403)
          .json({ error: "Access denied: Plan does not support this feature" });
      }

      return res
        .status(200)
        .json({ message: "Access granted to premium feature", user: req.user });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }
}

module.exports = new PremiumFeatureController();
