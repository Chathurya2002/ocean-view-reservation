const mongoose = require("mongoose");
require("dotenv").config();

async function testAtlas() {
    console.log("Testing ATLAS MongoDB connection...");
    const uri = process.env.MONGO_URI;
    console.log("URI:", uri.replace(/:([^:@]{1,})@/, ":****@")); // Mask password
    try {
        await mongoose.connect(uri, { serverSelectionTimeoutMS: 10000 });
        console.log("ATLAS CONNECTION SUCCESSFUL! ✅");
        process.exit(0);
    } catch (err) {
        console.error("ATLAS CONNECTION FAILED: ❌");
        console.error(err);
        process.exit(1);
    }
}

testAtlas();
