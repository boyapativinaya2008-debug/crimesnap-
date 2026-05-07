// src/controllers/auth.controller.js
const User = require("../models/user.model");
const bcrypt = require("bcryptjs");

const register = async (req, res) => {
  try {
    const { name, email, phone, password, confirmPassword, agree } = req.body;

    // 🔹 1. Required fields
    if (!name || !email || !password || !confirmPassword) {
      return res.status(400).json({ msg: "All required fields must be filled" });
    }

    // 🔹 2. Password match
    if (password !== confirmPassword) {
      return res.status(400).json({ msg: "Passwords do not match" });
    }

    // 🔹 3. Password length
    if (password.length < 8) {
      return res.status(400).json({ msg: "Password must be at least 8 characters" });
    }

    // 🔹 4. Terms checkbox
    if (!agree) {
      return res.status(400).json({ msg: "You must accept terms and conditions" });
    }

    // 🔹 5. Check existing user
    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(400).json({ msg: "Email already registered" });
    }

    // 🔹 6. Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 🔹 7. Create user
    const user = await User.create({
      name,
      email,
      phone,
      password: hashedPassword
    });

    // 🔹 8. Response (no password)
    res.status(201).json({
      msg: "Account created successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone
      }
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { register };