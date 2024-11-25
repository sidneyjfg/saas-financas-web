const express = require("express");
const userController = require("../controllers/userController");

const router = express.Router();

router.post("/register", userController.register);
router.post("/login", (req, res, next) => {
    console.log("Login route hit:", req.body); // Loga o corpo da requisição
    next();
  }, userController.login);
  

module.exports = router;
