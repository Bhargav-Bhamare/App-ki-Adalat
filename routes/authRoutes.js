const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");

router.get("/login/lawyer", (req, res) => {
  res.render("auth/login-lawyer");
});

router.get("/login/courtmaster", (req, res) => {
  res.render("auth/login-courtmaster");
});

router.get("/login/judge", (req, res) => {
  res.render("auth/login-judge");
});


router.get("/signup", authController.getSignup);
router.post("/signup", authController.signup);

router.post("/logout", authController.logout);

module.exports = router;
