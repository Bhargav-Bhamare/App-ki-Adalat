const express = require("express");
const router = express.Router();
const caseController = require("../controllers/caseController");
const isAuth = require("../middlewares/isauth");
const checkRole = require("../middlewares/checkrole");

router.post(
  "/cases",
  isAuth,                 // authentication
  checkRole("LAWYER"),    // authorization
  caseController.fileCase
);
module.exports = router;
