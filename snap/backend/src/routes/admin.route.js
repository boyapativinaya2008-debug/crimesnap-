import express from "express";

import {
  adminLogin,
  getAllUsers,
  deleteUser,
  getAllComplaints,
  updateComplaintStatus,
  blockUser,
  unblockUser
} from "../controllers/adminController.js";

import { verifyAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

/* ================= ADMIN LOGIN ================= */

router.post("/login", adminLogin);

/* ================= USERS ================= */

router.get("/users", verifyAdmin, getAllUsers);

router.delete("/users/:id", verifyAdmin, deleteUser);

// 🔥 BLOCK / UNBLOCK ROUTES (ADDED)
router.put("/users/block/:id", verifyAdmin, blockUser);

router.put("/users/unblock/:id", verifyAdmin, unblockUser);

/* ================= COMPLAINTS ================= */

router.get("/complaints", verifyAdmin, getAllComplaints);

/* ================= UPDATE STATUS ================= */

router.put("/update-status/:id", verifyAdmin, updateComplaintStatus);

export default router;