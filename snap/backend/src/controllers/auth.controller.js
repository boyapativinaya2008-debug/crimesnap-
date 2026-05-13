const User = require("../models/user.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.register = async (req, res) => {
  console.log("BODY RECEIVED:", req.body); // 👈 ADD THIS

  try {
    const { name, email, password } = req.body;

    const hashed = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashed
    });

    res.json(user);
  } catch (err) {
    console.log("ERROR:", err); // 👈 ADD THIS
    res.status(500).json(err);
  }
};
exports.login = async (req, res) => {
  console.log("🔥 LOGIN API CALLED");

  try {
    const { email, password } = req.body;

    console.log("EMAIL:", email);
    console.log("PASSWORD:", password);

    const user = await User.findOne({ email });
    console.log("USER:", user);

    if (!user) {
      console.log("❌ USER NOT FOUND");
      return res.status(400).json({ msg: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    console.log("MATCH:", isMatch);

    if (!isMatch) {
      console.log("❌ WRONG PASSWORD");
      return res.status(400).json({ msg: "Wrong password" });
    }

    console.log("✅ BEFORE TOKEN");

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET
    );
    console.log("TOKEN:", token);

    console.log("✅ TOKEN CREATED");

    return res.json({
      message: "Login success",
      token,
      user
    });

  } catch (err) {
    console.log("💥 ERROR:", err);
    console.log("REAL ERROR 👉", err);
    return res.status(500).json({ error: err.message });
  }
};
console.log("EXPORT TEST:", exports);
exports.getMe = async (req, res) => {

  try {

    const user = await User.findById(
      req.user.id
    ).select("-password");

    res.json(user);

  } catch (err) {

    console.log(err);

    res.status(500).json({
      error: err.message
    });
  }
};