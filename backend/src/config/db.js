const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    // Support both env var names (some setups use MONGO_URI)
    const uri = process.env.MONGODB_URI || process.env.MONGO_URI;
    if (!uri) {
      throw new Error(
        "Missing Mongo connection string. Set MONGODB_URI or MONGO_URI in backend/.env"
      );
    }

    const conn = await mongoose.connect(uri);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

module.exports = connectDB;
