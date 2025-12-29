const express = require("express");
const router = express.Router();
const Lawyer = require("../model/lawyer.js");
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");

const LawyerController = require("../controllers/lawyer.js");

router
    .route("/signup")
    .get( LawyerController.renderSignUp )
    .post( wrapAsync(LawyerController.registerLawyer));

router
    .route("/login")
    .get( LawyerController.renderLogin )
    .post( passport.authenticate('local', { failureRedirect: '/login', failureFlash: true }), LawyerController.login );

router.post("/logout", LawyerController.logout);

module.exports = router;