const mongoose = require("mongoose");

const complaintSchema =
  new mongoose.Schema({

    title: {
      type: String,
      required: true
    },

    category: {
      type: String,
      required: true
    },

    location: {
      type: String,
      required: true
    },

    description: {
      type: String,
      required: true
    },

    evidence: {
      type: String
    },

    status: {
      type: String,
      default: "Pending"
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },

    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    }

  },
  {
    timestamps: true
  });

module.exports = mongoose.model(
  "Complaint",
  complaintSchema
);