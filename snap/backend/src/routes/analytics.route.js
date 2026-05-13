// backend/routes/analytics.route.js

const express = require("express");

const router = express.Router();

module.exports = (
  db,
  protect,
  adminOnly
) => {

  // GET ANALYTICS
  router.get(
    "/",
    protect,
    adminOnly,
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

        const departments =
          db.collection(
            "departments"
          );

        const officers =
          db.collection(
            "officers"
          );

        const totalComplaints =
          await complaints.countDocuments();

        const resolvedComplaints =
          await complaints.countDocuments({
            status:
              "Resolved",
          });

        const pendingComplaints =
          await complaints.countDocuments({
            status:
              "Pending",
          });

        const totalUsers =
          await users.countDocuments();

        const totalDepartments =
          await departments.countDocuments();

        const totalOfficers =
          await officers.countDocuments();

        res.status(200).json({
          totalComplaints,
          resolvedComplaints,
          pendingComplaints,
          totalUsers,
          totalDepartments,
          totalOfficers,
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
