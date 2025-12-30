module.exports = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !req.user.role) {
      return res.status(403).render("common/unauthorized");
    }

    const userRole = req.user.role.toUpperCase();
    
    if (!allowedRoles.map(r => r.toUpperCase()).includes(userRole)) {
      return res.status(403).render("common/unauthorized");
    }

    next();
  };
};