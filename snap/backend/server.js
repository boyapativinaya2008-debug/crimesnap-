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

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

/* ───────────────── DNS ───────────────── */

dns.setServers([
  "8.8.8.8",
  "8.8.4.4",
]);

/* ───────────────── APP ───────────────── */

const app = express();

app.use(cors());

app.use(express.json());

app.use(
  "/uploads",
  express.static("uploads")
);

/* ───────────────── FILE UPLOAD ───────────────── */

const storage =
  multer.diskStorage({

    destination:
      (req, file, cb) => {

        cb(
          null,
          "uploads/"
        );
      },

    filename:
      (req, file, cb) => {

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
  multer({
    storage,
  });

/* ───────────────── DATABASE ───────────────── */

let db;

const connectDB =
  async () => {

    try {

      const client =
        new MongoClient(
          process.env
            .Mongo_DB_URI ||
          process.env
            .MONGO_DB_URI ||
          process.env
            .MONGO_URI
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

      console.log(
        "❌ DB Error:",
        err.message
      );

      process.exit(1);
    }
  };

/* ───────────────── AUTH MIDDLEWARE ───────────────── */

const protect = (
  req,
  res,
  next
) => {

  const authHeader =
    req.headers.authorization;

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

    const token =
      authHeader.split(
        " "
      )[1];

    const decoded =
      jwt.verify(
        token,
        process.env
          .JWT_SECRET ||
          "secret123"
      );

    req.user =
      decoded;

    next();

  } catch {

    res.status(401).json({
      msg:
        "Invalid or expired token.",
    });
  }
};

/* ───────────────── ADMIN MIDDLEWARE ───────────────── */

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
        agree,
        role,
        adminCode,
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

      if (!agree) {

        return res
          .status(400)
          .json({
            msg:
              "Accept terms & conditions",
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

      const requestedRole =
        role === "admin"
          ? "admin"
          : "user";

      // ADMIN CODE CHECK

      if (
        requestedRole ===
        "admin"
      ) {

        if (
          adminCode !==
          process.env
            .ADMIN_REGISTRATION_CODE
        ) {

          return res
            .status(403)
            .json({
              msg:
                "Invalid admin code",
            });
        }
      }

      // HASH PASSWORD

      const hashedPassword =
        await bcrypt.hash(
          password,
          10
        );

      const result =
        await users.insertOne({
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
        });

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

      if (
        !email ||
        !password
      ) {

        return res
          .status(400)
          .json({
            msg:
              "Email and password required",
          });
      }

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

      // BLOCK CHECK

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

      // PASSWORD CHECK

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

      // TOKEN

      const token =
        jwt.sign(
          {
            id:
              user._id.toString(),
            role:
              user.role,
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
          status:
            user.status,
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

/* ───────────────── GET USER ───────────────── */

app.get(
  "/api/auth/me",
  protect,
  async (req, res) => {

    try {

      const users =
        db.collection(
          "users"
        );

      const user =
        await users.findOne(
          {
            _id:
              new ObjectId(
                req.user.id
              ),
          },
          {
            projection: {
              password: 0,
            },
          }
        );

      res.status(200).json(
        user
      );

    } catch (err) {

      res.status(500).json({
        msg:
          err.message,
      });
    }
  }
);

/* ───────────────── GET ALL USERS ───────────────── */

app.get(
  "/api/users",
  protect,
  verifyAdmin,
  async (req, res) => {

    try {

      const users =
        await db
          .collection(
            "users"
          )
          .find(
            {},
            {
              projection: {
                password: 0,
              },
            }
          )
          .sort({
            createdAt: -1,
          })
          .toArray();

      res.status(200).json(
        users
      );

    } catch (err) {

      res.status(500).json({
        msg:
          err.message,
      });
    }
  }
);

/* ───────────────── DELETE USER ───────────────── */

app.delete(
  "/api/users/:id",
  protect,
  verifyAdmin,
  async (req, res) => {

    try {

      await db
        .collection(
          "users"
        )
        .deleteOne({
          _id:
            new ObjectId(
              req.params.id
            ),
        });

      res.status(200).json({
        msg:
          "User deleted successfully",
      });

    } catch (err) {

      res.status(500).json({
        msg:
          err.message,
      });
    }
  }
);

/* ───────────────── BLOCK USER ───────────────── */

app.put(
  "/api/admin/users/block/:id",
  protect,
  verifyAdmin,
  async (req, res) => {

    try {

      await db
        .collection(
          "users"
        )
        .updateOne(
          {
            _id:
              new ObjectId(
                req.params.id
              ),
          },
          {
            $set: {
              status:
                "Blocked",
            },
          }
        );

      res.status(200).json({
        msg:
          "User blocked successfully",
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

/* ───────────────── UNBLOCK USER ───────────────── */

app.put(
  "/api/admin/users/unblock/:id",
  protect,
  verifyAdmin,
  async (req, res) => {

    try {

      await db
        .collection(
          "users"
        )
        .updateOne(
          {
            _id:
              new ObjectId(
                req.params.id
              ),
          },
          {
            $set: {
              status:
                "Active",
            },
          }
        );

      res.status(200).json({
        msg:
          "User unblocked successfully",
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
  upload.single("image"),
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
        await complaints.insertOne({
          userId:
            new ObjectId(
              req.user.id
            ),

          title:
            req.body.title,

          description:
            req.body.description,

          category:
            req.body.category ||
            "Others",

          location:
            req.body.location ||
            "",

          image:
            imagePath,

          status:
            "Pending",

          createdAt:
            new Date(),
        });

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

/* ───────────────── OFFICERS ───────────────── */


 
/* ───────────────── MY COMPLAINTS ───────────────── */

app.get(
  "/api/complaints/my",
  protect,
  async (req, res) => {

    try {

      const complaints =
        await db
          .collection(
            "complaints"
          )
          .find({
            userId:
              new ObjectId(
                req.user.id
              ),
          })
          .sort({
            createdAt: -1,
          })
          .toArray();

      res.status(200).json(
        complaints
      );

    } catch (err) {

      res.status(500).json({
        msg:
          err.message,
      });
    }
  }
);

/* ───────────────── ADMIN ALL COMPLAINTS ───────────────── */

app.get(
  "/api/admin/complaints",
  protect,
  verifyAdmin,
  async (req, res) => {

    try {

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
          .sort({
            createdAt: -1,
          })
          .toArray();

      const result =
        await Promise.all(

          data.map(
            async (c) => {

              const user =
                await users.findOne({
                  _id:
                    c.userId,
                });

              return {
                ...c,

                user: {
                  _id:
                    user?._id,

                  name:
                    user?.name,

                  email:
                    user?.email,

                  status:
                    user?.status ||
                    "Active",
                },
              };
            }
          )
        );

      res.status(200).json(
        result
      );

    } catch (err) {

      res.status(500).json({
        msg:
          err.message,
      });
    }
  }
);
/* ───────────────── OFFICERS ROUTES ───────────────── */

/* GET ALL OFFICERS */

app.get(
  "/api/admin/officers",
  protect,
  verifyAdmin,
  async (req, res) => {

    try {

      const officers =
        await db
          .collection("officers")
          .find()
          .sort({ createdAt: -1 })
          .toArray();

      res.status(200).json(
        officers
      );

    } catch (err) {

      console.log(err);

      res.status(500).json({
        msg: "Failed to fetch officers",
      });
    }
  }
);

/* ADD OFFICER */

app.post(
  "/api/admin/officers",
  protect,
  verifyAdmin,
  async (req, res) => {

    try {

      const {
        name,
        email,
        phone,
        department,
        rank,
      } = req.body;

      if (
        !name ||
        !email ||
        !phone ||
        !department ||
        !rank
      ) {
        return res.status(400).json({
          msg: "All fields are required",
        });
      }

      const officers =
        db.collection("officers");

      const existing =
        await officers.findOne({
          email,
        });

      if (existing) {
        return res.status(400).json({
          msg: "Officer already exists",
        });
      }

      await officers.insertOne({
        name,
        email,
        phone,
        department,
        rank,
        createdAt: new Date(),
      });

      res.status(201).json({
        msg: "Officer added successfully",
      });

    } catch (err) {

      console.log(err);

      res.status(500).json({
        msg: "Server Error",
      });
    }
  }
);

/* DELETE OFFICER */

app.delete(
  "/api/admin/officers/:id",
  protect,
  verifyAdmin,
  async (req, res) => {

    try {

      await db
        .collection("officers")
        .deleteOne({
          _id: new ObjectId(
            req.params.id
          ),
        });

      res.status(200).json({
        msg: "Officer deleted",
      });

    } catch (err) {

      console.log(err);

      res.status(500).json({
        msg: "Delete failed",
      });
    }
  }
);

/* ───────────────── UPDATE STATUS ───────────────── */

app.put(
  "/api/admin/update-status/:id",
  protect,
  verifyAdmin,
  async (req, res) => {

    try {

      await db
        .collection(
          "complaints"
        )
        .updateOne(
          {
            _id:
              new ObjectId(
                req.params.id
              ),
          },
          {
            $set: {
              status:
                req.body.status,
            },
          }
        );

      res.status(200).json({
        msg:
          "Status updated",
      });

    } catch (err) {

      res.status(500).json({
        msg:
          err.message,
      });
    }
  }
);
/* ───────────────── LOCATIONS SYSTEM ───────────────── */

// GET ALL LOCATIONS

app.get(
  "/locations",
  protect,
  verifyAdmin,
  async (req, res) => {

    try {

      const locations =
        await db
          .collection("locations")
          .find()
          .sort({ createdAt: -1 })
          .toArray();

      res.json(locations);

    } catch (err) {

      console.log(err);

      res.status(500).json({
        msg: "Failed to fetch locations",
      });
    }
  }
);

// ADD LOCATION

app.post(
  "/locations",
  protect,
  verifyAdmin,
  async (req, res) => {

    try {

      const {
        area,
        city,
        state,
        pincode,
      } = req.body;

      if (
        !area ||
        !city
      ) {
        return res.status(400).json({
          msg: "Area and city required",
        });
      }

      const result =
        await db
          .collection("locations")
          .insertOne({
            area,
            city,
            state,
            pincode,
            createdAt:
              new Date(),
          });

      res.status(201).json({
        msg: "Location added",
        id: result.insertedId,
      });

    } catch (err) {

      console.log(err);

      res.status(500).json({
        msg: "Failed to add location",
      });
    }
  }
);

// DELETE LOCATION

app.delete(
  "/locations/:id",
  protect,
  verifyAdmin,
  async (req, res) => {

    try {

      await db
        .collection("locations")
        .deleteOne({
          _id: new ObjectId(
            req.params.id
          ),
        });

      res.json({
        msg: "Location deleted",
      });

    } catch (err) {

      console.log(err);

      res.status(500).json({
        msg: "Delete failed",
      });
    }
  }
);

/* ───────────────── ROOT ───────────────── */

app.get(
  "/",
  (req, res) => {

    res.send(
      "CivicSnap API running ✅"
    );
  }
);

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