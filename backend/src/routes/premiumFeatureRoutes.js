const express = require("express");
const router = express.Router();
const premiumFeatureController = require("../controllers/premiumFeatureController");
const authenticate = require("../middlewares/authenticate");

// Define a rota e associa ao controlador
router.post("/", authenticate, premiumFeatureController.accessFeature);

module.exports = router;
