const express = require("express");
const router = express.Router();
const isAuth = require("../middlewares/isAuth");
const checkRole = require("../middlewares/checkRole");

router.get(
  "/judge/dashboard",
  isAuth,
  checkRole("JUDGE"),
  (req, res) => {
    res.render("judge/judgeDash");
  }
);

router.get(
  "/lawyer/dashboard",
  isAuth,
  checkRole("LAWYER"),
  (req, res) => {
    res.render("lawyer/lawyerDash");
  }
);

router.get(
  "/courtmaster/dashboard",
  isAuth,
  checkRole("COURTMASTER"),
  (req, res) => {
    res.render("cMaster/cMasterDash");
  }
);

module.exports = router;
