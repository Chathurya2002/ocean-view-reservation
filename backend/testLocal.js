const mongoose = require("mongoose");

async function testLocal() {
    console.log("Testing LOCAL MongoDB connection...");
    const uri = "mongodb://localhost:27017/ocean-view-resort";
    try {
        await mongoose.connect(uri, { serverSelectionTimeoutMS: 2000 });
        console.log("LOCAL CONNECTION SUCCESSFUL!");
        process.exit(0);
    } catch (err) {
        console.error("LOCAL CONNECTION FAILED:");
        console.error(err);
        process.exit(1);
    }
}

testLocal();
