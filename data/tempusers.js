const bcrypt = require("bcrypt");

const users = [
  {
    id: 1,
    name: "Demo Judge",
    email: "judge@court.com",
    password: bcrypt.hashSync("judge123", 10),
    role: "JUDGE"
  },
  {
    id: 2,
    name: "Court Master",
    email: "courtmaster@court.com",
    password: bcrypt.hashSync("court123", 10),
    role: "COURTMASTER"
  }
];

module.exports = users;
