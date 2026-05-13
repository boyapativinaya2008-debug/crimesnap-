// backend/routes/settings.route.js

const express = require("express");

const router = express.Router();

module.exports = (
  db,
  protect,
  adminOnly
) => {

  // GET SETTINGS
  router.get(
    "/",
    protect,
    adminOnly,
    async (req, res) => {

      try {

        const settings =
          await db
            .collection(
              "settings"
            )
            .findOne({});

        res.status(200).json(
          settings || {}
        );

      } catch (err) {

        res.status(500).json({
          msg: err.message,
        });
      }
    }
  );

  // UPDATE SETTINGS
  router.post(
    "/",
    protect,
    adminOnly,
    async (req, res) => {

      try {

        const {
          appName,
          supportEmail,
          contactNumber,
          address,
        } = req.body;

        await db
          .collection(
            "settings"
          )
          .updateOne(
            {},
            {
              $set: {
                appName,
                supportEmail,
                contactNumber,
                address,
                updatedAt:
                  new Date(),
              },
            },
            {
              upsert: true,
            }
          );

        res.status(200).json({
          msg:
            "Settings updated successfully",
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