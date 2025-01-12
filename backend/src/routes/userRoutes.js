const express = require("express");
const userController = require("../controllers/userController");
const authenticate = require("../middlewares/authenticate");

const router = express.Router();

router.post("/register", userController.register);
router.post("/login", (req, res, next) => {
  next();
}, userController.login);


module.exports = router;
