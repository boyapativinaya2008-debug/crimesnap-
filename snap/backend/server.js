require("dotenv").config();

const express = require("express");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const dns = require("dns");
const http = require("http");

const { Server } = require("socket.io");
const { MongoClient, ObjectId } = require("mongodb");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

dns.setServers(["8.8.8.8", "8.8.4.4"]);

const app = express();
const server = http.createServer(app);

/* ================= SOCKET.IO ================= */
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

io.on("connection", (socket) => {
  console.log("⚡ User connected:", socket.id);

  socket.on("disconnect", () => {
    console.log("❌ User disconnected:", socket.id);
  });
});

/* ================= MIDDLEWARE ================= */
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));

/* ================= FILE UPLOAD ================= */
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) =>
    cb(null, Date.now() + path.extname(file.originalname)),
});

const upload = multer({ storage });

/* ================= DB ================= */
let db;

async function connectDB() {
  const client = new MongoClient(process.env.MONGO_DB_URI);
  await client.connect();
  db = client.db("civicapp");
  console.log("✅ MongoDB Connected");
}

/* ================= AUTH MIDDLEWARE ================= */
const protect = (req, res, next) => {
  const auth = req.headers.authorization;

  if (!auth?.startsWith("Bearer ")) {
    return res.status(401).json({ msg: "No token" });
  }

  try {
    req.user = jwt.verify(
      auth.split(" ")[1],
      process.env.JWT_SECRET || "secret123"
    );
    next();
  } catch {
    return res.status(401).json({ msg: "Invalid token" });
  }
};

const verifyAdmin = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ msg: "Admins only" });
  }
  next();
};

/* ================= AUTH ================= */

// REGISTER
app.post("/api/auth/register", async (req, res) => {
  const users = db.collection("users");

  const hash = await bcrypt.hash(req.body.password, 10);

  const result = await users.insertOne({
    name: req.body.name,
    email: req.body.email.toLowerCase(),
    password: hash,
    role: req.body.role === "admin" ? "admin" : "user",
    status: "Active",
    createdAt: new Date(),
  });

  res.json({ msg: "User created", id: result.insertedId });
});

// LOGIN
app.post("/api/auth/login", async (req, res) => {
  const users = db.collection("users");

  const user = await users.findOne({
    email: req.body.email.toLowerCase(),
  });

  if (!user) return res.status(400).json({ msg: "Invalid credentials" });

  const ok = await bcrypt.compare(req.body.password, user.password);
  if (!ok) return res.status(400).json({ msg: "Invalid credentials" });

  const token = jwt.sign(
    { id: user._id.toString(), role: user.role },
    process.env.JWT_SECRET || "secret123",
    { expiresIn: "7d" }
  );

  res.json({ token, user });
});

// PROFILE (FIXED 404 ISSUE)
app.get("/api/auth/me", protect, async (req, res) => {
  const user = await db.collection("users").findOne({
    _id: new ObjectId(req.user.id),
  });

  if (!user) return res.status(404).json({ msg: "User not found" });

  res.json({
    id: user._id.toString(),
    name: user.name,
    email: user.email,
    role: user.role,
    status: user.status,
  });
});

/* ================= USERS (ADMIN) ================= */

app.get("/api/admin/users", protect, verifyAdmin, async (req, res) => {
  const users = await db.collection("users").find().toArray();

  res.json(
    users.map((u) => ({
      id: u._id.toString(),
      name: u.name,
      email: u.email,
      role: u.role,
      status: u.status,
    }))
  );
});

app.put("/api/admin/users/block/:id", protect, verifyAdmin, async (req, res) => {
  await db.collection("users").updateOne(
    { _id: new ObjectId(req.params.id) },
    { $set: { status: "Blocked" } }
  );

  res.json({ msg: "Blocked" });
});

app.put("/api/admin/users/unblock/:id", protect, verifyAdmin, async (req, res) => {
  await db.collection("users").updateOne(
    { _id: new ObjectId(req.params.id) },
    { $set: { status: "Active" } }
  );

  res.json({ msg: "Unblocked" });
});

/* ================= OFFICERS ================= */

app.get("/api/admin/officers", protect, verifyAdmin, async (req, res) => {
  const data = await db.collection("officers").find().toArray();
  res.json(data);
});

/* ================= COMPLAINT CREATE ================= */

app.post(
  "/api/complaints",
  protect,
  upload.single("image"),
  async (req, res) => {
    const officers = await db
      .collection("officers")
      .find()
      .sort({ activeCases: 1 })
      .limit(1)
      .toArray();

    const best = officers[0];

    const complaints = db.collection("complaints");

    const result = await complaints.insertOne({
      userId: new ObjectId(req.user.id),
      title: req.body.title,
      description: req.body.description,
      category: req.body.category || "Others",
      location: req.body.location || "",
      image: req.file ? `/uploads/${req.file.filename}` : "",

      status: best ? "In Progress" : "Pending",

      assignedOfficer: best ? best.name : "Not Assigned",
      assignedOfficerId: best ? best._id.toString() : null,

      createdAt: new Date(),
    });

    if (best) {
      await db.collection("officers").updateOne(
        { _id: best._id },
        { $inc: { activeCases: 1 } }
      );
    }

    // 🔥 SOCKET EVENT
    io.emit("new-complaint", result);

    res.json({ msg: "Created", id: result.insertedId });
  }
);

/* ================= USER COMPLAINTS ================= */

app.get("/api/complaints/my", protect, async (req, res) => {
  const data = await db
    .collection("complaints")
    .find({ userId: new ObjectId(req.user.id) })
    .toArray();

  res.json(data);
});

/* ================= ADMIN COMPLAINTS ================= */

app.get("/api/admin/complaints", protect, verifyAdmin, async (req, res) => {
  const complaints = await db.collection("complaints").find().toArray();
  const users = await db.collection("users").find().toArray();

  const map = {};
  users.forEach((u) => (map[u._id.toString()] = u));

  res.json(
    complaints.map((c) => ({
      ...c,
      user: map[c.userId?.toString()] || null,
    }))
  );
});

/* ================= STATUS UPDATE (ONLY 3 STATES) ================= */

app.put(
  "/api/admin/update-status/:id",
  protect,
  verifyAdmin,
  async (req, res) => {
    const allowed = ["Pending", "In Progress", "Resolved"];

    if (!allowed.includes(req.body.status)) {
      return res.status(400).json({ msg: "Invalid status" });
    }

    const updated = await db.collection("complaints").updateOne(
      { _id: new ObjectId(req.params.id) },
      { $set: { status: req.body.status } }
    );

    io.emit("status-updated", {
      id: req.params.id,
      status: req.body.status,
    });

    res.json({ msg: "Updated" });
  }
);

/* ================= ASSIGN OFFICER ================= */

app.put("/api/admin/assign/:id", protect, verifyAdmin, async (req, res) => {
  const complaints = db.collection("complaints");
  const officers = db.collection("officers");

  const c = await complaints.findOne({
    _id: new ObjectId(req.params.id),
  });

  const newOfficer = await officers.findOne({
    name: req.body.assignedOfficer,
  });

  if (!c || !newOfficer) {
    return res.status(404).json({ msg: "Not found" });
  }

  if (c.assignedOfficerId) {
    await db.collection("officers").updateOne(
      { _id: new ObjectId(c.assignedOfficerId), activeCases: { $gt: 0 } },
      { $inc: { activeCases: -1 } }
    );
  }

  await complaints.updateOne(
    { _id: c._id },
    {
      $set: {
        assignedOfficer: newOfficer.name,
        assignedOfficerId: newOfficer._id.toString(),
        status: "In Progress",
      },
    }
  );

  await db.collection("officers").updateOne(
    { _id: newOfficer._id },
    { $inc: { activeCases: 1 } }
  );

  io.emit("complaint-assigned", {
    id: req.params.id,
    officer: newOfficer.name,
  });

  res.json({ msg: "Assigned successfully" });
});

/* ================= ROOT ================= */

app.get("/", (req, res) => {
  res.send("Civic App API Running 🚀");
});

/* ================= START SERVER ================= */

connectDB().then(() => {
  server.listen(process.env.PORT || 3000, () => {
    console.log("🚀 Server running with Socket.io");
  });
});