const Lawyer = require("../model/lawyer.js");

module.exports.renderSignUp = (req,res) =>{
    res.render("auth/signup.ejs");
}

module.exports.registerLawyer = async (req, res, next) => {
  try {
    let { username, email, password, BarCouncilRegistrationNumber, mobile } = req.body;
    const newUser = new Lawyer({ email, BarCouncilRegistrationNumber, username, mobile });
    const registeredUser = await Lawyer.register(newUser, password);
      // Attempt to log the user in. If login fails, still redirect to dashboard
      // but record the error and notify via flash so UX is smooth for the judge/demo.
      req.login(registeredUser, (err) => {
        if (err) {
          console.error('Login after register failed:', err);
          req.flash("warning", "Registered successfully but automatic login failed. Please login manually.");
          return res.redirect("/login");
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

module.exports.login = async (req, res) => {
  try {
    // req.user is populated by passport after successful authentication
    const lawyer = await Lawyer.findById(req.user._id);
    
    if (!lawyer) {
      req.flash("error", "Lawyer account not found. Please sign up first.");
      return res.redirect("/signup");
    }

    // Check if lawyer account is still active and valid
    if (!lawyer.email || !lawyer.BarCouncilRegistrationNumber) {
      req.flash("error", "Incomplete lawyer profile. Please update your profile.");
      return res.redirect("/profile");
    }

    req.flash("success", `Logged in successfully as ${lawyer.username}`);
    res.redirect("/lawyerDashboard");
  } catch (err) {
    console.error('Login error:', err);
    req.flash("error", "An error occurred during login");
    res.redirect("/login");
  }
};

module.exports.logout = (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);
    req.flash("success", "Logged out successfully");
    res.redirect("/");
  });
};
