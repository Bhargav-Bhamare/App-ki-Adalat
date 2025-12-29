module.exports = (role, res) => {
  const r = role.toUpperCase();

  if (r === "LAWYER") return res.redirect("/lawyer/dashboard");
  if (r === "JUDGE") return res.redirect("/judge/dashboard");
  if (r === "COURTMASTER") return res.redirect("/courtmaster/dashboard");

  return res.redirect("/login");
};
