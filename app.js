const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");

//IMP Middlewares
app.set("view engine","ejs");
app.set("views", path.join(__dirname,"views"));
app.use(express.urlencoded({extended : true}));
app.use(methodOverride("_method"));
// app.engine("ejs",ejsMate);
app.use(express.static(path.join(__dirname,"/public")));


//Establishing Connection
main()
.then(() => console.log("DataBase Connection Successful!"))
.catch(err => console.log(err));


async function main() {
  await mongoose.connect("mongodb://localhost:27017/NyaayDrishti");
};


app.get("/",(req,res)=> {
    res.render("landing.ejs");
});

app.get("/lawyerDashboard",(req,res) =>{
    res.render("lawyer/lawyerDash.ejs");
});


app.listen(8080,()=>{
    console.log("Listening to port Successfully!");
});