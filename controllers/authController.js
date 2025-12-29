const bcrypt = require("bcrypt");
const users = require("../data/tempusers");
const redirectByRole = require("../utils/redirectByRole");

exports.getLogin = (req, res) => {
  res.render("auth/login");
};

exports.getSignup = (req, res) => {
  res.render("auth/signup");
};

exports.signup = async (req, res) => {
  const { name, email, password, role } = req.body;

  const existingUser = users.find(u => u.email === email);
  if (existingUser) {
    return res.render("auth/signup", { error: "User already exists" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  users.push({
    id: Date.now(),
    name,
    email,
    password: hashedPassword,
    role
  });

  res.redirect("/login");
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  const user = users.find(u => u.email === email);
  if (!user) {
    return res.render("auth/login", { error: "Invalid credentials" });
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.render("auth/login", { error: "Invalid credentials" });
  }

  req.session.user = {
    id: user.id,
    role: user.role
  };

  redirectByRole(user.role, res);
};

exports.logout = (req, res) => {
  req.session.destroy(() => {
    res.redirect("/login");
  });
};
