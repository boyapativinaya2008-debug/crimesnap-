// backend/routes/locations.route.js

const express = require("express");

const router = express.Router();

const { ObjectId } = require("mongodb");

module.exports = (
  db,
  protect,
  adminOnly
) => {

  // GET ALL LOCATIONS
  router.get(
    "/",
    protect,
    adminOnly,
    async (req, res) => {

      try {

        const locations =
          await db
            .collection(
              "locations"
            )
            .find()
            .sort({
              createdAt: -1,
            })
            .toArray();

        res.status(200).json(
          locations
        );

      } catch (err) {

        res.status(500).json({
          msg: err.message,
        });
      }
    }
  );

  // GET SINGLE LOCATION
  router.get(
    "/:id",
    protect,
    adminOnly,
    async (req, res) => {

      try {

        const location =
          await db
            .collection(
              "locations"
            )
            .findOne({
              _id:
                new ObjectId(
                  req.params.id
                ),
            });

        if (!location) {

          return res
            .status(404)
            .json({
              msg:
                "Location not found",
            });
        }

        res.status(200).json(
          location
        );

      } catch (err) {

        res.status(500).json({
          msg: err.message,
        });
      }
    }
  );

  // CREATE LOCATION
  router.post(
    "/",
    protect,
    adminOnly,
    async (req, res) => {

      try {

        const {
          name,
          city,
          state,
          pincode,
        } = req.body;

        if (
          !name ||
          !city ||
          !state ||
          !pincode
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
              "locations"
            )
            .insertOne({
              name,
              city,
              state,
              pincode,
              createdAt:
                new Date(),
            });

        res.status(201).json({
          msg:
            "Location added successfully",
          id: result.insertedId,
        });

      } catch (err) {

        res.status(500).json({
          msg: err.message,
        });
      }
    }
  );

  // UPDATE LOCATION
  router.put(
    "/:id",
    protect,
    adminOnly,
    async (req, res) => {

      try {

        const {
          name,
          city,
          state,
          pincode,
        } = req.body;

        await db
          .collection(
            "locations"
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
                name,
                city,
                state,
                pincode,
                updatedAt:
                  new Date(),
              },
            }
          );

        res.status(200).json({
          msg:
            "Location updated successfully",
        });

      } catch (err) {

        res.status(500).json({
          msg: err.message,
        });
      }
    }
  );

  // DELETE LOCATION
  router.delete(
    "/:id",
    protect,
    adminOnly,
    async (req, res) => {

      try {

        await db
          .collection(
            "locations"
          )
          .deleteOne({
            _id:
              new ObjectId(
                req.params.id
              ),
          });

        res.status(200).json({
          msg:
            "Location deleted successfully",
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