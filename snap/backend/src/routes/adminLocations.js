const express = require("express");
const { ObjectId } = require("mongodb");

module.exports = (db) => {
  const router = express.Router();

  /* ================= GET ALL ================= */
  router.get("/", async (req, res) => {
    try {
      const data = await db.collection("locations").find().toArray();
      res.json(data);
    } catch (err) {
      res.status(500).json({ msg: err.message });
    }
  });

  /* ================= CREATE ================= */
  router.post("/", async (req, res) => {
    try {
      const result = await db.collection("locations").insertOne({
        stationName: req.body.stationName,
        area: req.body.area,
        city: req.body.city,
        district: req.body.district,
        state: req.body.state,
        pincode: req.body.pincode,
        createdAt: new Date(),
      });

      res.json({ msg: "Location added", id: result.insertedId });
    } catch (err) {
      res.status(500).json({ msg: err.message });
    }
  });

  /* ================= UPDATE ================= */
  router.put("/:id", async (req, res) => {
    try {
      await db.collection("locations").updateOne(
        { _id: new ObjectId(req.params.id) },
        {
          $set: {
            stationName: req.body.stationName,
            area: req.body.area,
            city: req.body.city,
            district: req.body.district,
            state: req.body.state,
            pincode: req.body.pincode,
          },
        }
      );

      res.json({ msg: "Location updated" });
    } catch (err) {
      res.status(500).json({ msg: err.message });
    }
  });

  /* ================= DELETE ================= */
  router.delete("/:id", async (req, res) => {
    try {
      await db.collection("locations").deleteOne({
        _id: new ObjectId(req.params.id),
      });

      res.json({ msg: "Location deleted" });
    } catch (err) {
      res.status(500).json({ msg: err.message });
    }
  });

  return router;
};