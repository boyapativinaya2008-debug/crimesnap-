require("dotenv").config();

const express = require("express");
const cors = require("cors");
const dns = require("dns");
const multer = require("multer");
const path = require("path");

const {
  MongoClient,
  ObjectId,
} = require("mongodb");

const bcrypt =
  require("bcryptjs");

const jwt =
  require("jsonwebtoken");

dns.setServers([
  "8.8.8.8",
  "8.8.4.4",
]);

const app = express();

/* ───────────────── MIDDLEWARE ───────────────── */

app.use(cors());

app.use(express.json());

app.use(
  "/uploads",
  express.static("uploads")
);

/* ───────────────── FILE UPLOAD ───────────────── */

const storage =
  multer.diskStorage({

    destination: (
      req,
      file,
      cb
    ) => {

      cb(
        null,
        "uploads/"
      );
    },

    filename: (
      req,
      file,
      cb
    ) => {

      cb(
        null,
        Date.now() +
          path.extname(
            file.originalname
          )
      );
    },
  });

const upload =
  multer({ storage });

/* ───────────────── DB ───────────────── */

let db;

const connectDB =
  async () => {

    try {

      const client =
        new MongoClient(
          process.env
            .MONGO_DB_URI
        );

      await client.connect();

      db =
        client.db(
          "civicapp"
        );

      console.log(
        "✅ MongoDB Connected"
      );

    } catch (err) {

      console.log(err);

      process.exit(1);
    }
  };

/* ───────────────── AUTH ───────────────── */

const protect = (
  req,
  res,
  next
) => {

  const authHeader =
    req.headers
      .authorization;

  if (
    !authHeader ||
    !authHeader.startsWith(
      "Bearer "
    )
  ) {

    return res
      .status(401)
      .json({
        msg:
          "No token. Access denied.",
      });
  }

  try {

    const decoded =
      jwt.verify(
        authHeader.split(
          " "
        )[1],
        process.env
          .JWT_SECRET ||
          "secret123"
      );

    req.user = decoded;

    next();

  } catch {

    res.status(401).json({
      msg:
        "Invalid or expired token.",
    });
  }
};

/* ───────────────── ADMIN ───────────────── */

const verifyAdmin = (
  req,
  res,
  next
) => {

  if (
    req.user?.role !==
    "admin"
  ) {

    return res
      .status(403)
      .json({
        msg:
          "Admins only.",
      });
  }

  next();
};

/* ───────────────── REGISTER ───────────────── */

app.post(
  "/api/auth/register",
  async (req, res) => {

    try {

      const {
        name,
        email,
        phone,
        password,
        confirmPassword,
        role,
      } = req.body;

      if (
        !name ||
        !email ||
        !password ||
        !confirmPassword
      ) {

        return res
          .status(400)
          .json({
            msg:
              "All required fields must be filled",
          });
      }

      if (
        password !==
        confirmPassword
      ) {

        return res
          .status(400)
          .json({
            msg:
              "Passwords do not match",
          });
      }

      const users =
        db.collection(
          "users"
        );

      const existing =
        await users.findOne({
          email:
            email.toLowerCase(),
        });

      if (existing) {

        return res
          .status(400)
          .json({
            msg:
              "Email already registered",
          });
      }

      const hashedPassword =
        await bcrypt.hash(
          password,
          10
        );

      const requestedRole =
        role === "admin"
          ? "admin"
          : "user";

      const result =
        await users.insertOne(
          {
            name,

            email:
              email.toLowerCase(),

            phone:
              phone || "",

            password:
              hashedPassword,

            role:
              requestedRole,

            status:
              "Active",

            createdAt:
              new Date(),
          }
        );

      res.status(201).json({
        msg:
          "Account created successfully",

        user: {
          id:
            result.insertedId,

          name,

          email:
            email.toLowerCase(),

          role:
            requestedRole,
        },
      });

    } catch (err) {

      console.log(err);

      res.status(500).json({
        msg:
          "Server Error",
      });
    }
  }
);

/* ───────────────── LOGIN ───────────────── */

app.post(
  "/api/auth/login",
  async (req, res) => {

    try {

      const {
        email,
        password,
        role,
      } = req.body;

      const users =
        db.collection(
          "users"
        );

      const user =
        await users.findOne({
          email:
            email.toLowerCase(),
        });

      if (!user) {

        return res
          .status(401)
          .json({
            msg:
              "Invalid email or password",
          });
      }

      if (
        user.status ===
        "Blocked"
      ) {

        return res
          .status(403)
          .json({
            msg:
              "Account is blocked by admin",
          });
      }

      const requestedRole =
        role === "admin"
          ? "admin"
          : "user";

      if (
        user.role !==
        requestedRole
      ) {

        return res
          .status(403)
          .json({
            msg:
              `No ${requestedRole} account found`,
          });
      }

      const isMatch =
        await bcrypt.compare(
          password,
          user.password
        );

      if (!isMatch) {

        return res
          .status(401)
          .json({
            msg:
              "Invalid email or password",
          });
      }

      const token =
        jwt.sign(
          {
            id:
              user._id.toString(),

            role:
              user.role,

            name:
              user.name,
          },

          process.env
            .JWT_SECRET ||
            "secret123",

          {
            expiresIn:
              "7d",
          }
        );

      res.status(200).json({
        msg:
          "Login successful",

        token,

        user: {
          id:
            user._id,

          name:
            user.name,

          email:
            user.email,

          role:
            user.role,
        },
      });

    } catch (err) {

      console.log(err);

      res.status(500).json({
        msg:
          "Server Error",
      });
    }
  }
);

/* ───────────────── CREATE COMPLAINT ───────────────── */

app.post(
  "/api/complaints",
  protect,
  upload.single(
    "image"
  ),
  async (req, res) => {

    try {

      const complaints =
        db.collection(
          "complaints"
        );

      const imagePath =
        req.file
          ? `/uploads/${req.file.filename}`
          : "";

      const result =
        await complaints.insertOne(
          {
            userId:
              new ObjectId(
                req.user.id
              ),

            title:
              req.body.title,

            description:
              req.body
                .description,

            category:
              req.body
                .category ||
              "Others",

            location:
              req.body
                .location ||
              "",

            image:
              imagePath,

            status:
              "Pending",

            // ✅ OFFICER

            assignedOfficer:
              "Not Assigned",

            createdAt:
              new Date(),
          }
        );

      res.status(201).json({
        msg:
          "Complaint submitted",

        id:
          result.insertedId,
      });

    } catch (err) {

      res.status(500).json({
        msg:
          err.message,
      });
    }
  }
);

/* ───────────────── MY COMPLAINTS ───────────────── */

app.get(
  "/api/complaints/my",
  protect,
  async (req, res) => {

    const complaints =
      db.collection(
        "complaints"
      );

    const data =
      await complaints

        .find({
          userId:
            new ObjectId(
              req.user.id
            ),
        })

        .sort({
          createdAt:
            -1,
        })

        .toArray();

    res.json(data);
  }
);

/* ───────────────── ADMIN COMPLAINTS ───────────────── */

app.get(
  "/api/admin/complaints",
  protect,
  verifyAdmin,
  async (req, res) => {

    const complaints =
      db.collection(
        "complaints"
      );

    const users =
      db.collection(
        "users"
      );

    const data =
      await complaints
        .find()
        .toArray();

    const result =
      await Promise.all(

        data.map(
          async (c) => {

            const user =
              await users.findOne(
                {
                  _id:
                    c.userId,
                }
              );

            return {
              ...c,

              user: {
                _id:
                  user?._id,

                name:
                  user?.name,

                email:
                  user?.email,
              },
            };
          }
        )
      );

    res.json(result);
  }
);

/* ───────────────── UPDATE STATUS ───────────────── */

app.put(
  "/api/admin/update-status/:id",
  protect,
  verifyAdmin,
  async (req, res) => {

    const complaints =
      db.collection(
        "complaints"
      );

    await complaints.updateOne(
      {
        _id:
          new ObjectId(
            req.params.id
          ),
      },

      {
        $set: {
          status:
            req.body
              .status,
        },
      }
    );

    res.json({
      msg:
        "Status updated",
    });
  }
);

/* ───────────────── GET OFFICERS ───────────────── */

app.get(
  "/api/admin/officers",
  protect,
  verifyAdmin,
  async (req, res) => {

    try {

      const officers =
        db.collection(
          "officers"
        );

      const data =
        await officers
          .find()
          .toArray();

      res.json(data);

    } catch (err) {

      console.log(err);

      res.status(500).json({
        msg:
          "Server Error",
      });
    }
  }
);

/* ───────────────── ADD OFFICER ───────────────── */

app.post(
  "/api/admin/officers",
  protect,
  verifyAdmin,
  async (req, res) => {

    try {

      const officers =
        db.collection(
          "officers"
        );

      const result =
        await officers.insertOne(
          req.body
        );

      res.status(201).json({
        _id:
          result.insertedId,

        ...req.body,
      });

    } catch (err) {

      console.log(err);

      res.status(500).json({
        msg:
          "Server Error",
      });
    }
  }
);

/* ───────────────── DELETE OFFICER ───────────────── */

app.delete(
  "/api/admin/officers/:id",
  protect,
  verifyAdmin,
  async (req, res) => {

    try {

      const officers =
        db.collection(
          "officers"
        );

      await officers.deleteOne(
        {
          _id:
            new ObjectId(
              req.params.id
            ),
        }
      );

      res.json({
        msg:
          "Officer deleted successfully",
      });

    } catch (err) {

      console.log(err);

      res.status(500).json({
        msg:
          "Server Error",
      });
    }
  }
);

/* ───────────────── ASSIGN OFFICER ───────────────── */
/* ───────────────── ASSIGN OFFICER ───────────────── */

app.put(
  "/api/admin/assign/:id",
  protect,
  verifyAdmin,
  async (req, res) => {

    try {

      const complaints =
        db.collection("complaints");

      await complaints.updateOne(
        {
          _id: new ObjectId(
            req.params.id
          ),
        },
        {
          $set: {
            assignedOfficer:
              req.body.assignedOfficer,
          },
        }
      );

      res.json({
        msg: "Officer assigned successfully",
      });

    } catch (err) {

      console.log(err);

      res.status(500).json({
        msg: "Server Error",
      });
    }
  }
);

/* ───────────────── OFFICER LOGIN ───────────────── */

app.post(
  "/api/officer/login",
  async (req, res) => {

    try {

      const {
        email,
        password,
      } = req.body;

      const officers =
        db.collection(
          "officers"
        );

      const officer =
        await officers.findOne(
          { email }
        );

      if (!officer) {

        return res
          .status(401)
          .json({
            msg:
              "Invalid email or password",
          });
      }

      if (
        password !==
        officer.password
      ) {

        return res
          .status(401)
          .json({
            msg:
              "Invalid email or password",
          });
      }

      const token =
        jwt.sign(
          {
            id:
              officer._id.toString(),

            role:
              "officer",

            name:
              officer.name,
          },

          process.env
            .JWT_SECRET ||
            "secret123",

          {
            expiresIn:
              "7d",
          }
        );

      res.json({
        msg:
          "Officer login successful",

        token,

        officer,
      });

    } catch (err) {

      res.status(500).json({
        msg:
          err.message,
      });
    }
  }
);

/* ───────────────── OFFICER COMPLAINTS ───────────────── */

app.get(
  "/api/officer/complaints",
  protect,
  async (req, res) => {

    const complaints =
      db.collection(
        "complaints"
      );

    const data =
      await complaints

        .find({
          assignedOfficer:
            req.user.name,
        })

        .toArray();

    res.json(data);
  }
);

/* ───────────────── ROOT ───────────────── */

app.get("/", (req, res) => {

  res.send(
    "CivicSnap API running ✅"
  );
});

/* ───────────────── SERVER ───────────────── */

connectDB().then(() => {

  app.listen(
    process.env.PORT ||
      3000,

    () => {

      console.log(
        "🚀 Server running"
      );
    }
  );
});