const mongoose = require("mongoose");
require("dotenv").config();

async function testConnection() {
    console.log("Starting connection test...");
    try {
        const uri = process.env.MONGO_URI;
        console.log("URI found:", uri ? "YES" : "NO");
        if (!uri) throw new Error("No MONGO_URI in .env");

        await mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 });
        console.log("CONNECTION SUCCESSFUL!");
        process.exit(0);
    } catch (err) {
        console.error("CONNECTION FAILED:");
        console.error(err);
        process.exit(1);
    }
}

testConnection();
