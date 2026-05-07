const mongoose = require("mongoose");

const dbConnect = async () => {
    try {
        await mongoose.connect(process.env.Mongo_DB_URI);
        console.log("Connected to MongoDB");
    } catch (err) {
        console.log("MongoDB Error:", err);
    }
};

module.exports = dbConnect;