require("dotenv").config();
const express = require("express");
const cors = require("cors");
const dns = require("dns");
const multer = require("multer");
const path = require("path");
const { MongoClient, ObjectId } = require("mongodb");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

dns.setServers(["8.8.8.8", "8.8.4.4"]);

const app = express();

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) =>
    cb(null, Date.now() + path.extname(file.originalname)),
});
const upload = multer({ storage });

let db;

const connectDB = async () => {
  const uri = process.env.Mongo_DB_URI || process.env.MONGO_URI;
  if (!uri) {
    console.error("❌ No MongoDB URI found in .env");
    process.exit(1);
  }
  try {
    const client = new MongoClient(uri);
    await client.connect();
    db = client.db("civicapp"); // ✅ database name explicitly set
    console.log("✅ Connected to MongoDB Atlas - civicapp");
  } catch (err) {
    console.error("❌ MongoDB Error:", err.message);
    process.exit(1);
  }
};

const protect = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer "))
    return res.status(401).json({ msg: "No token. Access denied." });
  try {
    const decoded = jwt.verify(
      authHeader.split(" ")[1],
      process.env.JWT_SECRET || "secret123"
    );
    req.user = decoded;
    next();
  } catch {
    res.status(401).json({ msg: "Invalid or expired token." });
  }
};

const adminOnly = (req, res, next) => {
  if (req.user?.role !== "admin")
    return res.status(403).json({ msg: "Admins only." });
  next();
};

// ── REGISTER ──────────────────────────────────────────────────────────────────
app.post("/api/auth/register", async (req, res) => {
  try {
    const { name, email, phone, password, confirmPassword, agree, role, adminCode } = req.body;

    if (!name || !email || !password || !confirmPassword)
      return res.status(400).json({ msg: "All required fields must be filled" });
    if (password !== confirmPassword)
      return res.status(400).json({ msg: "Passwords do not match" });
    if (password.length < 8)
      return res.status(400).json({ msg: "Password must be at least 8 characters" });
    if (!agree)
      return res.status(400).json({ msg: "You must accept the terms and conditions" });

    const requestedRole = role === "admin" ? "admin" : "user";
    if (requestedRole === "admin") {
      const validCode = process.env.ADMIN_REGISTRATION_CODE || "CIVIC_ADMIN_2024";
      if (!adminCode || adminCode !== validCode)
        return res.status(403).json({ msg: "Invalid admin registration code" });
    }

    const users = db.collection("users");
    const existing = await users.findOne({ email: email.toLowerCase() });
    if (existing)
      return res.status(400).json({ msg: "Email already registered" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await users.insertOne({
      name,
      email: email.toLowerCase(),
      phone: phone || "",
      password: hashedPassword,
      role: requestedRole,
      createdAt: new Date(),
    });

    res.status(201).json({
      msg: "Account created successfully",
      user: { id: result.insertedId, name, email: email.toLowerCase(), role: requestedRole },
    });
  } catch (err) {
    console.error("Register error:", err.message);
    res.status(500).json({ msg: "Server error. Please try again." });
  }
});

// ── LOGIN ─────────────────────────────────────────────────────────────────────
app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password, role } = req.body;
    if (!email || !password)
      return res.status(400).json({ msg: "Email and password are required" });

    const users = db.collection("users");
    const user = await users.findOne({ email: email.toLowerCase() });
    if (!user)
      return res.status(401).json({ msg: "Invalid email or password" });

    const requestedRole = role === "admin" ? "admin" : "user";
    if (user.role !== requestedRole)
      return res.status(403).json({ msg: `No ${requestedRole} account found with this email.` });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(401).json({ msg: "Invalid email or password" });

    const token = jwt.sign(
      { id: user._id.toString(), role: user.role },
      process.env.JWT_SECRET || "secret123",
      { expiresIn: "7d" }
    );

    res.status(200).json({
      msg: "Login successful",
      token,
      user: { id: user._id, name: user.name, email: user.email, phone: user.phone, role: user.role },
    });
  } catch (err) {
    console.error("Login error:", err.message);
    res.status(500).json({ msg: "Server error. Please try again." });
  }
});

// ── GET ME ────────────────────────────────────────────────────────────────────
app.get("/api/auth/me", protect, async (req, res) => {
  try {
    const users = db.collection("users");
    const user = await users.findOne(
      { _id: new ObjectId(req.user.id) },
      { projection: { password: 0 } }
    );
    if (!user) return res.status(404).json({ msg: "User not found" });
    res.status(200).json({ user });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

// ── SUBMIT COMPLAINT ──────────────────────────────────────────────────────────
app.post("/api/complaints", protect, upload.single("image"), async (req, res) => {
  try {
    const { description, category, location } = req.body;
    if (!description)
      return res.status(400).json({ msg: "Description is required" });

    const imagePath = req.file ? `/uploads/${req.file.filename}` : "";
    const complaints = db.collection("complaints");
    const result = await complaints.insertOne({
      userId: new ObjectId(req.user.id),
      description,
      category: category || "Others",
      location: location || "",
      image: imagePath,
      status: "Pending",
      createdAt: new Date(),
    });

    res.status(201).json({ msg: "✅ Complaint submitted successfully!", id: result.insertedId });
  } catch (err) {
    console.error("Complaint error:", err.message);
    res.status(500).json({ msg: "Failed to submit complaint" });
  }
});

// ── MY COMPLAINTS ─────────────────────────────────────────────────────────────
app.get("/api/complaints/my", protect, async (req, res) => {
  try {
    const complaints = db.collection("complaints");
    const list = await complaints
      .find({ userId: new ObjectId(req.user.id) })
      .sort({ createdAt: -1 })
      .toArray();
    res.status(200).json({ complaints: list });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

// ── ALL COMPLAINTS (admin) ────────────────────────────────────────────────────
app.get("/api/complaints", protect, adminOnly, async (req, res) => {
  try {
    const complaints = db.collection("complaints");
    const list = await complaints.find().sort({ createdAt: -1 }).toArray();
    res.status(200).json({ complaints: list });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

// ── UPDATE STATUS (admin) ─────────────────────────────────────────────────────
app.patch("/api/complaints/:id/status", protect, adminOnly, async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ["Pending", "In Progress", "Resolved"];
    if (!validStatuses.includes(status))
      return res.status(400).json({ msg: "Invalid status value" });

    const complaints = db.collection("complaints");
    await complaints.updateOne(
      { _id: new ObjectId(req.params.id) },
      { $set: { status, updatedAt: new Date() } }
    );
    res.status(200).json({ msg: "Status updated successfully" });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

// ── ADMIN STATS ───────────────────────────────────────────────────────────────
app.get("/api/admin/stats", protect, adminOnly, async (req, res) => {
  try {
    const complaints = db.collection("complaints");
    const total      = await complaints.countDocuments();
    const resolved   = await complaints.countDocuments({ status: "Resolved" });
    const inProgress = await complaints.countDocuments({ status: "In Progress" });
    const pending    = await complaints.countDocuments({ status: "Pending" });
    res.status(200).json({ total, resolved, inProgress, pending });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

app.get("/", (req, res) => res.send("CivicSnap API running ✅"));

connectDB().then(() => {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
});
