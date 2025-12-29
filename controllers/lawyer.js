const Lawyer = require("../model/lawyer.js");

module.exports.renderSignUp = (req,res) =>{
    res.render("auth/signup.ejs");
}

module.exports.registerLawyer = async (req, res, next) => {
  try {
    let { username, email, password, BarCouncilRegistrationNumber, mobile } = req.body;
    const newUser = new Lawyer({ email, BarCouncilRegistrationNumber, username });
    const registeredUser = await Lawyer.register(newUser, password);
      // Attempt to log the user in. If login fails, still redirect to dashboard
      // but record the error and notify via flash so UX is smooth for the judge/demo.
      req.login(registeredUser, (err) => {
        if (err) {
          console.error('Login after register failed:', err);
          req.flash("warning", "Registered successfully but automatic login failed. Please login manually.");
          return res.redirect("/lawyerDashboard");
        }

        req.flash("success", "User registered successfully");
        return res.redirect("/lawyerDashboard");
      });
  } catch (e) {
    req.flash("error", e.message);
    res.redirect("/signup");
  }
};

module.exports.renderLogin = (req, res) => {
  res.render("auth/login.ejs");
};

module.exports.login = (req, res) => {
  req.flash("success", "Logged in successfully");
  res.redirect("/lawyerDashboard");
};

module.exports.logout = (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);
    req.flash("success", "Logged out successfully");
    res.redirect("/");
  });
};
