const mongoose = require("mongoose");
const dotenv = require("dotenv");
const User = require("../models/User");

// Load env vars
dotenv.config({ path: "../../.env" });

const checkAdmin = async () => {
    try {
        const uri = process.env.MONGO_URI;
        await mongoose.connect(uri);
        console.log("Connected to DB");

        const users = await User.find({ role: "admin" });
        console.log("Admins found:", users.length);
        users.forEach(u => console.log(`- ${u.email} (${u.role})`));

        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

checkAdmin();
