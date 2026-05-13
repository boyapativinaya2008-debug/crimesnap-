// backend/routes/announcements.route.js

const express = require("express");

const router = express.Router();

const { ObjectId } = require("mongodb");

module.exports = (
  db,
  protect,
  adminOnly
) => {

  // GET ALL ANNOUNCEMENTS
  router.get(
    "/",
    protect,
    adminOnly,
    async (req, res) => {

      try {

        const announcements =
          await db
            .collection(
              "announcements"
            )
            .find()
            .sort({
              createdAt: -1,
            })
            .toArray();

        res.status(200).json(
          announcements
        );

      } catch (err) {

        res.status(500).json({
          msg: err.message,
        });
      }
    }
  );

  // GET SINGLE ANNOUNCEMENT
  router.get(
    "/:id",
    protect,
    adminOnly,
    async (req, res) => {

      try {

        const announcement =
          await db
            .collection(
              "announcements"
            )
            .findOne({
              _id:
                new ObjectId(
                  req.params.id
                ),
            });

        if (!announcement) {

          return res
            .status(404)
            .json({
              msg:
                "Announcement not found",
            });
        }

        res.status(200).json(
          announcement
        );

      } catch (err) {

        res.status(500).json({
          msg: err.message,
        });
      }
    }
  );

  // CREATE ANNOUNCEMENT
  router.post(
    "/",
    protect,
    adminOnly,
    async (req, res) => {

      try {

        const {
          title,
          message,
        } = req.body;

        if (
          !title ||
          !message
        ) {

          return res
            .status(400)
            .json({
              msg:
                "Title and message are required",
            });
        }

        const result =
          await db
            .collection(
              "announcements"
            )
            .insertOne({
              title,
              message,
              createdAt:
                new Date(),
            });

        res.status(201).json({
          msg:
            "Announcement published successfully",
          id: result.insertedId,
        });

      } catch (err) {

        res.status(500).json({
          msg: err.message,
        });
      }
    }
  );

  // UPDATE ANNOUNCEMENT
  router.put(
    "/:id",
    protect,
    adminOnly,
    async (req, res) => {

      try {

        const {
          title,
          message,
        } = req.body;

        await db
          .collection(
            "announcements"
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
                title,
                message,
                updatedAt:
                  new Date(),
              },
            }
          );

        res.status(200).json({
          msg:
            "Announcement updated successfully",
        });

      } catch (err) {

        res.status(500).json({
          msg: err.message,
        });
      }
    }
  );

  // DELETE ANNOUNCEMENT
  router.delete(
    "/:id",
    protect,
    adminOnly,
    async (req, res) => {

      try {

        await db
          .collection(
            "announcements"
          )
          .deleteOne({
            _id:
              new ObjectId(
                req.params.id
              ),
          });

        res.status(200).json({
          msg:
            "Announcement deleted successfully",
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