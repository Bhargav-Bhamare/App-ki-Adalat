const express = require("express");
const router = express.Router();
const Lawyer = require("../model/lawyer.js");
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");
const { saveRedirectUrl } = require("../middlewares.js");
const LawyerController = require("../controllers/lawyer.js");
const dashboardController = require("../controllers/dashboardController.js");

// Authentication routes - LAWYER ONLY
router
    .route("/signup")
    .get( LawyerController.renderSignUp )
    .post( wrapAsync(LawyerController.registerLawyer));

router
    .route("/login")
    .get( LawyerController.renderLogin )
    .post( saveRedirectUrl, passport.authenticate('local', {
        failureRedirect: '/login', failureFlash: true }), 
        LawyerController.login );

router.get("/logout", LawyerController.logout);

// Dashboard routes - Protected routes (require authentication)
router.get("/lawyerDashboard", (req, res) => {
    if (!req.user) {
        req.flash("error", "Please login first");
        return res.redirect("/login");
    }
    res.render("lawyer/lawyerDash");
});

// API endpoints for dashboard data
router.get("/api/dashboard-data", wrapAsync(dashboardController.getLawyerDashboardData));
router.get("/api/cases", wrapAsync(dashboardController.getLawyerCases));
router.get("/api/notifications", wrapAsync(dashboardController.getNotifications));
router.get("/api/defects", wrapAsync(dashboardController.getDefects));
router.get("/api/daily-cause-list", wrapAsync(dashboardController.getDailyCauseList));
router.get("/api/case-priority/:caseId", wrapAsync(dashboardController.getCasePriorityDetails));
router.post("/api/file-case", wrapAsync(dashboardController.fileNewCase));
router.post("/api/update-profile", wrapAsync(dashboardController.updateLawyerProfile));

// Court Master action endpoint (lightweight acknowledgement)
router.post('/api/case-action/:caseId', async (req, res) => {
    const caseId = req.params.caseId;
    const { action, extendMinutes } = req.body || {};
    // For now, just acknowledge. Future: persist action or re-run scheduler.
    res.json({ success: true, caseId, action: action || null, extendMinutes: extendMinutes || null });
});

module.exports = router;