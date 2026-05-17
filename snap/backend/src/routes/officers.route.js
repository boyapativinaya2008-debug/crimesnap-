const express = require("express");
const { ObjectId } = require("mongodb");
const bcrypt = require("bcryptjs");

const router = express.Router();

module.exports = (db, protect, adminOnly) => {

  // =========================
  // GET ALL OFFICERS
  // =========================
  router.get("/", protect, adminOnly, async (req, res) => {
    try {
      const officers = await db
        .collection("officers")
        .find({})
        .sort({ createdAt: -1 })
        .toArray();

      // remove passwords before sending
      const safeOfficers = officers.map((o) => {
        delete o.password;
        return o;
      });

      res.json(safeOfficers);
    } catch (err) {
      console.error("Get officers error:", err);
      res.status(500).json({ message: "Failed to fetch officers" });
    }
  });

  // =========================
  // GET SINGLE OFFICER
  // =========================
  router.get("/:id", protect, adminOnly, async (req, res) => {
    try {
      const officer = await db
        .collection("officers")
        .findOne({ _id: new ObjectId(req.params.id) });

      if (!officer) {
        return res.status(404).json({ message: "Officer not found" });
      }

      delete officer.password;

      res.json(officer);
    } catch (err) {
      console.error("Get officer error:", err);
      res.status(500).json({ message: "Failed to fetch officer" });
    }
  });

  // =========================
  // CREATE OFFICER (FIXED FOR FRONTEND)
  // =========================
  router.post("/", protect, adminOnly, async (req, res) => {
    try {
      const {
        name,
        badgeNumber,
        rank,
        station,
        email,
        password,
        status,
      } = req.body;

      // validation
      if (!name || !badgeNumber || !rank || !email || !password) {
        return res.status(400).json({
          message: "All required fields must be filled",
        });
      }

      // duplicate check
      const existingOfficer = await db.collection("officers").findOne({
        $or: [{ email }, { badgeNumber }],
      });

      if (existingOfficer) {
        return res.status(400).json({
          message: "Officer already exists (email or badge number)",
        });
      }

      // hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      const newOfficer = {
        name,
        badgeNumber,
        rank,
        station: station || "",
        email,
        password: hashedPassword,
        status: status || "Active",
        createdAt: new Date(),
      };

      const result = await db
        .collection("officers")
        .insertOne(newOfficer);

      res.status(201).json({
        message: "Officer created successfully",
        officer: {
          _id: result.insertedId,
          name,
          badgeNumber,
          rank,
          station,
          email,
          status: status || "Active",
        },
      });
    } catch (err) {
      console.error("Create officer error:", err);
      res.status(500).json({ message: "Failed to create officer" });
    }
  });

  // =========================
  // UPDATE OFFICER
  // =========================
  router.put("/:id", protect, adminOnly, async (req, res) => {
    try {
      const {
        name,
        badgeNumber,
        rank,
        station,
        email,
        status,
      } = req.body;

      const result = await db.collection("officers").updateOne(
        { _id: new ObjectId(req.params.id) },
        {
          $set: {
            name,
            badgeNumber,
            rank,
            station,
            email,
            status,
            updatedAt: new Date(),
          },
        }
      );

      if (result.matchedCount === 0) {
        return res.status(404).json({ message: "Officer not found" });
      }

      res.json({ message: "Officer updated successfully" });
    } catch (err) {
      console.error("Update officer error:", err);
      res.status(500).json({ message: "Failed to update officer" });
    }
  });

  // =========================
  // DELETE OFFICER
  // =========================
  router.delete("/:id", protect, adminOnly, async (req, res) => {
    try {
      const result = await db.collection("officers").deleteOne({
        _id: new ObjectId(req.params.id),
      });

      if (result.deletedCount === 0) {
        return res.status(404).json({ message: "Officer not found" });
      }

      res.json({ message: "Officer deleted successfully" });
    } catch (err) {
      console.error("Delete officer error:", err);
      res.status(500).json({ message: "Failed to delete officer" });
    }
  });

  return router;
};