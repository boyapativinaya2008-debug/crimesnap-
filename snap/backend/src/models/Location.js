const mongoose = require("mongoose");

const locationSchema = new mongoose.Schema(
  {
    stationName: {
      type: String,
      required: true,
    },

    area: {
      type: String,
      required: true,
    },

    city: {
      type: String,
      required: true,
    },

    district: {
      type: String,
      required: true,
    },

    state: {
      type: String,
      default: "Andhra Pradesh",
    },

    pincode: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Location", locationSchema);