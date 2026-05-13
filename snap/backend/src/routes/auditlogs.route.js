// backend/routes/auditlogs.route.js

const express = require("express");

const router = express.Router();

module.exports = (
  db,
  protect,
  adminOnly
) => {

  // GET ALL AUDIT LOGS
  router.get(
    "/",
    protect,
    adminOnly,
    async (req, res) => {

      try {

        const logs =
          await db
            .collection(
              "auditlogs"
            )
            .find()
            .sort({
              createdAt: -1,
            })
            .toArray();

        res.status(200).json(
          logs
        );

      } catch (err) {

        res.status(500).json({
          msg: err.message,
        });
      }
    }
  );

  // CREATE AUDIT LOG
  router.post(
    "/",
    protect,
    adminOnly,
    async (req, res) => {

      try {

        const {
          user,
          action,
          module,
        } = req.body;

        if (
          !user ||
          !action ||
          !module
        ) {

          return res
            .status(400)
            .json({
              msg:
                "All fields are required",
            });
        }

        const result =
          await db
            .collection(
              "auditlogs"
            )
            .insertOne({
              user,
              action,
              module,
              createdAt:
                new Date(),
            });

        res.status(201).json({
          msg:
            "Audit log created successfully",
          id: result.insertedId,
        });

      } catch (err) {

        res.status(500).json({
          msg: err.message,
        });
      }
    }
  );

  return router;
};