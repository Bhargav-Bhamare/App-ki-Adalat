const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const authRoutes = require("./routes/authRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");

//IMP Middlewares
app.engine("ejs",ejsMate);
app.set("view engine","ejs");
app.set("views", path.join(__dirname,"views"));
app.use(express.urlencoded({extended : true}));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname,"/public")));


const session = require("express-session");
app.use(authRoutes);
app.use(dashboardRoutes);


//Establishing Connection
main()
.then(() => console.log("DataBase Connection Successful!"))
.catch(err => console.log(err));


async function main() {
  await mongoose.connect("mongodb://localhost:27017/NyaayDrishti");
};

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


app.get("/",(req,res)=> {
    res.render("landing.ejs");
});

app.get("/lawyerDashboard",(req,res) =>{
    res.render("lawyer/lawyerDash.ejs");
});

app.get("/judgeDashboard",(req,res) =>{
    res.render("judge/judgeDash.ejs");
});

app.get("/login",(req,res) =>{
    res.render("login.ejs");
});

app.get("/signup",(req,res) =>{
    res.render("signiup.ejs");
});

app.listen(8080,()=>{
    console.log("Listening to port Successfully!");
});