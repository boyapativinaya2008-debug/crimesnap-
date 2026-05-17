import mongoose from "mongoose";

const officerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
    },

    password: {
      type: String,
      required: true,
    },

    badgeNumber: {
      type: String,
      required: true,
      unique: true,
    },

    station: {
      type: String,
      required: true,
    },

    rank: {
      type: String,
      required: true,
    },

    // 🔥 AUTO WORKLOAD SYSTEM
    maxCapacity: {
      type: Number,
      default: 5,
    },

    activeCases: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Officer", officerSchema);