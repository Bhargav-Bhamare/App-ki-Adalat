require("dotenv").config();
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const Lawyer = require("./model/lawyer.js");
const lawyerRoutes = require("./routes/lawyerRoutes.js")

//Router Requirement
const dashboardRoutes = require("./routes/dashboardRoutes");
const lawyerRouter = require("./routes/lawyer.js");

const session = require("express-session");

//IMP Middlewares - MUST come before routes
app.engine("ejs",ejsMate);
app.set("view engine","ejs");
app.set("views", path.join(__dirname,"views"));
app.use(express.urlencoded({extended : true}));
app.use(express.json());
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname,"/public")));
app.use("/lawyer", lawyerRoutes);

//Establishing Connection
const connectDB = require("./config/db");
connectDB();


//Session Configuration
app.use(
  session({
    name: "judicial-session",
    secret: "hackathon-secret-key",
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 // 1 hour
    }
  })
);
app.use(flash());
//All related to Passport
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy({ usernameField: 'email' }, Lawyer.authenticate()));
passport.serializeUser(Lawyer.serializeUser());
passport.deserializeUser(Lawyer.deserializeUser());

//Flash Related
app.use((req,res,next) =>{
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
});

app.use("/",lawyerRouter);
app.use(dashboardRoutes);

app.get("/",(req,res)=> {
    res.render("landing.ejs");
});

app.get("/lawyerDashboard",(req,res) =>{
    res.render("lawyer/lawyerDash.ejs");
});

app.get("/judgeDashboard",(req,res) =>{
    res.render("judge/judgeDash.ejs");
});

app.get("/cMasterDashboard",(req,res) =>{
    res.render("cMaster/cMasterDash.ejs");
});

app.listen(8080,()=>{
    console.log("Listening to port Successfully!");
});