// backend/routes/categories.route.js

const express = require("express");

const router = express.Router();

const { ObjectId } = require("mongodb");

module.exports = (
  db,
  protect,
  adminOnly
) => {

  // GET ALL CATEGORIES
  router.get(
    "/",
    protect,
    adminOnly,
    async (req, res) => {

      try {

        const categories =
          await db
            .collection(
              "categories"
            )
            .find()
            .sort({
              createdAt: -1,
            })
            .toArray();

        res.status(200).json(
          categories
        );

      } catch (err) {

        res.status(500).json({
          msg: err.message,
        });
      }
    }
  );

  // GET SINGLE CATEGORY
  router.get(
    "/:id",
    protect,
    adminOnly,
    async (req, res) => {

      try {

        const category =
          await db
            .collection(
              "categories"
            )
            .findOne({
              _id:
                new ObjectId(
                  req.params.id
                ),
            });

        if (!category) {

          return res
            .status(404)
            .json({
              msg:
                "Category not found",
            });
        }

        res.status(200).json(
          category
        );

      } catch (err) {

        res.status(500).json({
          msg: err.message,
        });
      }
    }
  );

  // CREATE CATEGORY
  router.post(
    "/",
    protect,
    adminOnly,
    async (req, res) => {

      try {

        const { name } =
          req.body;

        if (!name) {

          return res
            .status(400)
            .json({
              msg:
                "Category name required",
            });
        }

        const exists =
          await db
            .collection(
              "categories"
            )
            .findOne({
              name,
            });

        if (exists) {

          return res
            .status(400)
            .json({
              msg:
                "Category already exists",
            });
        }

        const result =
          await db
            .collection(
              "categories"
            )
            .insertOne({
              name,
              createdAt:
                new Date(),
            });

        res.status(201).json({
          msg:
            "Category created successfully",
          id: result.insertedId,
        });

      } catch (err) {

        res.status(500).json({
          msg: err.message,
        });
      }
    }
  );

  // UPDATE CATEGORY
  router.put(
    "/:id",
    protect,
    adminOnly,
    async (req, res) => {

      try {

        const { name } =
          req.body;

        await db
          .collection(
            "categories"
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
                updatedAt:
                  new Date(),
              },
            }
          );

        res.status(200).json({
          msg:
            "Category updated successfully",
        });

      } catch (err) {

        res.status(500).json({
          msg: err.message,
        });
      }
    }
  );

  // DELETE CATEGORY
  router.delete(
    "/:id",
    protect,
    adminOnly,
    async (req, res) => {

      try {

        await db
          .collection(
            "categories"
          )
          .deleteOne({
            _id:
              new ObjectId(
                req.params.id
              ),
          });

        res.status(200).json({
          msg:
            "Category deleted successfully",
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