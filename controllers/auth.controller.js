const User = require("../models/users.mongo");
const { hashPassword, comparePasswords } = require("../utils/hashUtils");
const jwt = require("jsonwebtoken");

async function signup(req, res) {
  const { name, email, password, role } = req.body;

  try {
    const hashedPassword = await hashPassword(password);

    const user = new User({
      name,
      email,
      password: hashedPassword,
      role,
    });

    await user.save();

    const accessToken = jwt.sign(
      { userId: user._id, role },
      process.env.JWT_secret,
      {
        expiresIn: "1d",
      }
    );

    res.json({ email, accessToken });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
}

async function login(req, res) {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const isMatch = await comparePasswords(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const accessToken = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_secret,
      { expiresIn: "1d" }
    );

    res.json({ email, accessToken });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
}

module.exports = {
  signup,
  login,
};
