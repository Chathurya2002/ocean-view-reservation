const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const uri = process.env.MONGO_URI;

    if (!uri) {
      console.log("❌ MONGO_URI is missing in .env");
      process.exit(1);
    }

    await mongoose.connect(uri);
    console.log("MongoDB Connected ✅");
  } catch (error) {
    console.error("MongoDB connection error ❌", error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
