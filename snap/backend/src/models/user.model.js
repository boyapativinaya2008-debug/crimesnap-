const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },

    email: { type: String, required: true, unique: true },

    password: { type: String, required: true },

    // 🔥 ADD THIS (IMPORTANT)
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },

    // 🔥 ADD THIS (BLOCK FEATURE)
    status: {
      type: String,
      enum: ["Active", "Blocked"],
      default: "Active",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);