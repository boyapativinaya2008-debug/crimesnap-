const router = require("express").Router();
const multer = require("multer");

const auth = require("../middleware/auth.middleware");
const complaintController = require("../controllers/complaint.controller");


// ===============================
// MULTER CONFIG (FIXED)
// ===============================
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads");
  },

  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  }
});

const upload = multer({ storage });


// ===============================
// ROUTES
// ===============================

// CREATE COMPLAINT
router.post(
  "/",
  auth,
  upload.single("evidence"),
  complaintController.createComplaint
);


// GET ALL COMPLAINTS (ADMIN)
router.get(
  "/all",
  auth,
  complaintController.getAllComplaints
);


// GET MY COMPLAINTS (USER)
router.get(
  "/my",
  auth,
  complaintController.getMyComplaints
);


// ASSIGN COMPLAINT (ADMIN)
router.put(
  "/assign/:id",
  auth,
  complaintController.assignComplaint
);


// UPDATE STATUS (ADMIN)
router.put(
  "/status/:id",
  auth,
  complaintController.updateStatus
);


module.exports = router;