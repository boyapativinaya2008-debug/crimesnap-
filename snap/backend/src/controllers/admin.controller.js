import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import User from "../models/User.js";
import Complaint from "../models/Complaint.js";
import Officer from "../models/Officer.js";
import Location from "../models/Location.js";

/* ================= ADMIN LOGIN ================= */

export const adminLogin =
  async (req, res) => {

    try {

      const {
        email,
        password,
      } = req.body;

      // CHECK ADMIN EXISTS

      const admin =
        await User.findOne({
          email,
        });

      if (
        !admin ||
        admin.role !==
          "admin"
      ) {
        return res
          .status(400)
          .json({
            message:
              "Admin not found",
          });
      }

      // CHECK BLOCKED

      if (
        admin.status ===
        "Blocked"
      ) {
        return res
          .status(403)
          .json({
            message:
              "Your account is blocked by super admin",
          });
      }

      // CHECK PASSWORD

      const isMatch =
        await bcrypt.compare(
          password,
          admin.password
        );

      if (!isMatch) {
        return res
          .status(400)
          .json({
            message:
              "Wrong password",
          });
      }

      // TOKEN

      const token =
        jwt.sign(
          {
            id: admin._id,
            role:
              admin.role,
          },
          process.env
            .JWT_SECRET,
          {
            expiresIn:
              "7d",
          }
        );

      res.status(200).json({
        token,
        user: {
          _id: admin._id,
          name: admin.name,
          email:
            admin.email,
          role:
            admin.role,
        },
      });

    } catch (error) {

      console.log(error);

      res.status(500).json({
        message:
          "Server Error",
      });
    }
  };

/* ================= GET USERS ================= */

export const getAllUsers =
  async (req, res) => {

    try {

      const users =
        await User.find({
          role: "user",
        }).select(
          "-password"
        );

      res.status(200).json(
        users
      );

    } catch (error) {

      console.log(error);

      res.status(500).json({
        message:
          "Server Error",
      });
    }
  };

/* ================= DELETE USER ================= */

export const deleteUser =
  async (req, res) => {

    try {

      const user =
        await User.findByIdAndDelete(
          req.params.id
        );

      if (!user) {

        return res
          .status(404)
          .json({
            message:
              "User not found",
          });
      }

      res.status(200).json({
        message:
          "User deleted successfully",
      });

    } catch (error) {

      console.log(error);

      res.status(500).json({
        message:
          "Server Error",
      });
    }
  };

/* ================= BLOCK USER ================= */

export const blockUser =
  async (req, res) => {

    try {

      const user =
        await User.findByIdAndUpdate(
          req.params.id,
          {
            status:
              "Blocked",
          },
          { new: true }
        ).select(
          "-password"
        );

      if (!user) {

        return res
          .status(404)
          .json({
            message:
              "User not found",
          });
      }

      res.status(200).json({
        message:
          "User blocked successfully",
        user,
      });

    } catch (error) {

      console.log(error);

      res.status(500).json({
        message:
          "Server Error",
      });
    }
  };

/* ================= UNBLOCK USER ================= */

export const unblockUser =
  async (req, res) => {

    try {

      const user =
        await User.findByIdAndUpdate(
          req.params.id,
          {
            status:
              "Active",
          },
          { new: true }
        ).select(
          "-password"
        );

      if (!user) {

        return res
          .status(404)
          .json({
            message:
              "User not found",
          });
      }

      res.status(200).json({
        message:
          "User unblocked successfully",
        user,
      });

    } catch (error) {

      console.log(error);

      res.status(500).json({
        message:
          "Server Error",
      });
    }
  };

/* ================= GET COMPLAINTS ================= */

export const getAllComplaints =
  async (req, res) => {

    try {

      const complaints =
        await Complaint.find()
          .populate(
            "user",
            "name email"
          )
          .sort({
            createdAt:
              -1,
          });

      res.status(200).json(
        complaints
      );

    } catch (error) {

      console.log(error);

      res.status(500).json({
        message:
          "Server Error",
      });
    }
  };

/* ================= UPDATE STATUS ================= */

export const updateComplaintStatus =
  async (req, res) => {

    try {

      const { status } =
        req.body;

      const complaint =
        await Complaint.findByIdAndUpdate(
          req.params.id,
          { status },
          { new: true }
        );

      if (!complaint) {

        return res
          .status(404)
          .json({
            message:
              "Complaint not found",
          });
      }

      res.status(200).json({
        message:
          "Status updated successfully",
        complaint,
      });

    } catch (error) {

      console.log(error);

      res.status(500).json({
        message:
          "Server Error",
      });
    }
  };

/* ================= ASSIGN OFFICER ================= */

export const assignOfficer =
  async (req, res) => {

    try {

      const {
        assignedOfficer,
      } = req.body;

      const complaint =
        await Complaint.findByIdAndUpdate(
          req.params.id,
          {
            assignedOfficer,
          },
          { new: true }
        );

      if (!complaint) {

        return res
          .status(404)
          .json({
            message:
              "Complaint not found",
          });
      }

      res.status(200).json({
        message:
          "Officer assigned successfully",
        complaint,
      });

    } catch (error) {

      console.log(error);

      res.status(500).json({
        message:
          "Server Error",
      });
    }
  };

/* ================= OFFICERS ================= */

export const getAllOfficers =
  async (req, res) => {

    try {

      const officers =
        await Officer.find();

      res.json(officers);

    } catch (error) {

      res.status(500).json({
        message:
          error.message,
      });
    }
  };

export const addOfficer =
  async (req, res) => {

    try {

      const officer =
        await Officer.create(
          req.body
        );

      res.status(201).json(
        officer
      );

    } catch (error) {

      res.status(500).json({
        message:
          error.message,
      });
    }
  };

export const deleteOfficer =
  async (req, res) => {

    try {

      await Officer.findByIdAndDelete(
        req.params.id
      );

      res.json({
        message:
          "Officer deleted successfully",
      });

    } catch (error) {

      res.status(500).json({
        message:
          error.message,
      });
    }
  };

/* ================= LOCATIONS ================= */

export const getLocations =
  async (req, res) => {

    try {

      const locations =
        await Location.find();

      res.json(
        locations
      );

    } catch (error) {

      res.status(500).json({
        message:
          error.message,
      });
    }
  };

export const addLocation =
  async (req, res) => {

    try {

      const location =
        await Location.create(
          req.body
        );

      res.status(201).json(
        location
      );

    } catch (error) {

      res.status(500).json({
        message:
          error.message,
      });
    }
  };