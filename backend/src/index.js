// src/index.js
const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const mongoose = require("mongoose");
const dns = require("dns");
const connectDB = require("./config/db");
const authRoutes = require("./routes/auth.routes");
dns.setServers(["8.8.8.8", "8.8.4.4"]);

dotenv.config();
connectDB();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
console.log(authRoutes)

app.listen(process.env.PORT || 5000, () => {
  console.log("Server running on port 5000");
});