module.exports = (req, res, next) => {
  if (!req.session.user) {
    return res.redirect("/login");
  }

  // 🔹 Attach user for controllers
  req.user = req.session.user;

  next();
};
