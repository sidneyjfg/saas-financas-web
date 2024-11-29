const express = require("express");
const userController = require("../controllers/userController");
const authenticate = require("../middlewares/authenticate");

const router = express.Router();

router.post("/register", userController.register);
router.post("/login", (req, res, next) => {
  console.log("Login route hit:", req.body); // Loga o corpo da requisição
  next();
}, userController.login);
router.get("/me", authenticate, userController.getCurrentUser);



module.exports = router;
