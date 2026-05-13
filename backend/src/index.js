const express = require("express");

const dotenv = require("dotenv");

const cors = require("cors");

const dns = require("dns");

const path = require("path");

const connectDB = require("./config/db");

const authRoutes = require(
  "./routes/auth.routes"
);

const complaintRoutes = require(
  "./routes/complaint.route"
);


// DNS FIX
dns.setServers([
  "8.8.8.8",
  "8.8.4.4"
]);

dotenv.config();

connectDB();

const app = express();


// MIDDLEWARE
app.use(cors());

app.use(express.json());


// STATIC FOLDER
app.use(
  "/uploads",
  express.static(
    path.join(__dirname, "uploads")
  )
);


// TEST ROUTE
app.get("/", (req, res) => {

  res.send("Backend Running ✅");

});


// AUTH ROUTES
app.use(
  "/api/auth",
  authRoutes
);


// COMPLAINT ROUTES
app.use(
  "/api/complaints",
  complaintRoutes
);


// SERVER
const PORT =
  process.env.PORT || 5000;

app.listen(PORT, () => {

  console.log(
    `Server running on port ${PORT}`
  );

});