const bcrypt = require("bcrypt");

async function hashPassword(password) {
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  return hashedPassword;
}

async function comparePasswords(password, hashedPassword) {
  return await bcrypt.compare(password, hashedPassword);
}

module.exports = {
  hashPassword,
  comparePasswords,
};
