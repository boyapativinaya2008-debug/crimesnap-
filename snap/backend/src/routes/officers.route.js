// backend/routes/officers.route.js

const express = require("express");
const { ObjectId } = require("mongodb");

const router = express.Router();

module.exports = (db, protect, adminOnly) => {

  // =========================
  // GET ALL OFFICERS
  // =========================
  router.get(
    "/",
    protect,
    adminOnly,
    async (req, res) => {
      try {

        const officers =
          await db
            .collection("officers")
            .find({})
            .sort({ createdAt: -1 })
            .toArray();

        res.json(officers);

      } catch (err) {

        console.error(
          "Get officers error:",
          err
        );

        res.status(500).json({
          message:
            "Failed to fetch officers",
        });
      }
    }
  );

  // =========================
  // GET SINGLE OFFICER
  // =========================
  router.get(
    "/:id",
    protect,
    adminOnly,
    async (req, res) => {
      try {

        const officer =
          await db
            .collection("officers")
            .findOne({
              _id: new ObjectId(
                req.params.id
              ),
            });

        if (!officer) {
          return res
            .status(404)
            .json({
              message:
                "Officer not found",
            });
        }

        res.json(officer);

      } catch (err) {

        console.error(
          "Get officer error:",
          err
        );

        res.status(500).json({
          message:
            "Failed to fetch officer",
        });
      }
    }
  );

  // =========================
  // CREATE OFFICER
  // =========================
  router.post(
    "/",
    protect,
    adminOnly,
    async (req, res) => {
      try {

        const {
          name,
          badgeNo,
          rank,
          station,
          phone,
          email,
        } = req.body;

        // Validation
        if (
          !name ||
          !badgeNo ||
          !rank
        ) {
          return res
            .status(400)
            .json({
              message:
                "Name, Badge No, and Rank are required",
            });
        }

        // Check duplicate badge
        const existingOfficer =
          await db
            .collection("officers")
            .findOne({
              badgeNo,
            });

        if (existingOfficer) {
          return res
            .status(400)
            .json({
              message:
                "Badge number already exists",
            });
        }

        const newOfficer = {
          name,
          badgeNo,
          rank,
          station: station || "",
          phone: phone || "",
          email: email || "",
          createdAt: new Date(),
        };

        const result =
          await db
            .collection("officers")
            .insertOne(
              newOfficer
            );

        res.status(201).json({
          message:
            "Officer created successfully",
          officerId:
            result.insertedId,
        });

      } catch (err) {

        console.error(
          "Create officer error:",
          err
        );

        res.status(500).json({
          message:
            "Failed to create officer",
        });
      }
    }
  );

  // =========================
  // UPDATE OFFICER
  // =========================
  router.put(
    "/:id",
    protect,
    adminOnly,
    async (req, res) => {
      try {

        const {
          name,
          badgeNo,
          rank,
          station,
          phone,
          email,
        } = req.body;

        const result =
          await db
            .collection("officers")
            .updateOne(
              {
                _id:
                  new ObjectId(
                    req.params.id
                  ),
              },
              {
                $set: {
                  name,
                  badgeNo,
                  rank,
                  station,
                  phone,
                  email,
                  updatedAt:
                    new Date(),
                },
              }
            );

        if (
          result.matchedCount === 0
        ) {
          return res
            .status(404)
            .json({
              message:
                "Officer not found",
            });
        }

        res.json({
          message:
            "Officer updated successfully",
        });

      } catch (err) {

        console.error(
          "Update officer error:",
          err
        );

        res.status(500).json({
          message:
            "Failed to update officer",
        });
      }
    }
  );

  // =========================
  // DELETE OFFICER
  // =========================
  router.delete(
    "/:id",
    protect,
    adminOnly,
    async (req, res) => {
      try {

        const result =
          await db
            .collection("officers")
            .deleteOne({
              _id:
                new ObjectId(
                  req.params.id
                ),
            });

        if (
          result.deletedCount === 0
        ) {
          return res
            .status(404)
            .json({
              message:
                "Officer not found",
            });
        }

        res.json({
          message:
            "Officer deleted successfully",
        });

      } catch (err) {

        console.error(
          "Delete officer error:",
          err
        );

        res.status(500).json({
          message:
            "Failed to delete officer",
        });
      }
    }
  );

  return router;
};