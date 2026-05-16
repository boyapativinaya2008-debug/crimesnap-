import mongoose from "mongoose";

const officerSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  badgeNumber: String,
  station: String,
  rank: String,
  status: String,
});

export default mongoose.model("Officer", officerSchema);