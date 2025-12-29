const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");

router.get("/login", authController.getLogin);
router.post("/login", authController.login);

router.get("/signup", authController.getSignup);
router.post("/signup", authController.signup);

router.post("/logout", authController.logout);

module.exports = router;
