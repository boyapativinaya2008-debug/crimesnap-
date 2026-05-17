const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    console.log("ENV CHECK:", process.env.MONGO_URI);

    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI is missing in .env");
    }

    await mongoose.connect(process.env.MONGO_URI);

    console.log("✅ MongoDB Connected");
  } catch (err) {
    console.log("❌ MongoDB Error:", err.message);
    process.exit(1);
  }
};

module.exports = connectDB;