const Complaint = require("../models/complaint.model");


// ===============================
// CREATE COMPLAINT
// ===============================
exports.createComplaint = async (req, res) => {

  try {

    console.log("BODY:", req.body);
    console.log("FILE:", req.file);
    console.log("USER:", req.user);

    // 🔴 AUTH CHECK
    if (!req.user) {
      return res.status(401).json({
        message: "Unauthorized - token missing"
      });
    }

    // 🔴 FIELD VALIDATION (important)
    if (
      !req.body.title ||
      !req.body.category ||
      !req.body.location ||
      !req.body.description
    ) {
      return res.status(400).json({
        message: "All fields are required"
      });
    }

    const complaint = await Complaint.create({
      title: req.body.title,
      category: req.body.category,
      location: req.body.location,
      description: req.body.description,

      // file safe handling
      evidence: req.file ? req.file.filename : "",

      createdBy: req.user.id
    });

    return res.status(201).json({
      message: "Complaint created successfully",
      complaint
    });

  } catch (err) {

    console.log("🔥 CREATE ERROR:", err);

    return res.status(500).json({
      error: err.message
    });
  }
};


// ===============================
// GET ALL COMPLAINTS
// ===============================
exports.getAllComplaints = async (req, res) => {

  try {

    const data = await Complaint.find()

      .populate("createdBy", "name email")
      .populate("assignedTo", "name email")
      .sort({ createdAt: -1 });

    res.json(data);

  } catch (err) {

    console.log("GET ALL ERROR:", err);

    res.status(500).json({
      error: err.message
    });
  }
};


// ===============================
// GET MY COMPLAINTS
// ===============================
exports.getMyComplaints = async (req, res) => {

  try {

    if (!req.user) {
      return res.status(401).json({
        message: "Unauthorized"
      });
    }

    const data = await Complaint.find({
      createdBy: req.user.id
    }).sort({ createdAt: -1 });

    res.json(data);

  } catch (err) {

    console.log("GET MY ERROR:", err);

    res.status(500).json({
      error: err.message
    });
  }
};


// ===============================
// ASSIGN COMPLAINT
// ===============================
exports.assignComplaint = async (req, res) => {

  try {

    const updated = await Complaint.findByIdAndUpdate(

      req.params.id,

      {
        assignedTo: req.body.assignedTo
      },

      { new: true }

    );

    res.json(updated);

  } catch (err) {

    console.log("ASSIGN ERROR:", err);

    res.status(500).json({
      error: err.message
    });
  }
};


// ===============================
// UPDATE STATUS
// ===============================
exports.updateStatus = async (req, res) => {

  try {

    const updated = await Complaint.findByIdAndUpdate(

      req.params.id,

      {
        status: req.body.status
      },

      { new: true }

    );

    res.json(updated);

  } catch (err) {

    console.log("STATUS ERROR:", err);

    res.status(500).json({
      error: err.message
    });
  }
};