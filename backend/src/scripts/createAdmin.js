const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const dotenv = require("dotenv");
const User = require("../models/User");

// Load env vars
dotenv.config({ path: "../../.env" });

const createAdmin = async () => {
    try {
        const uri = process.env.MONGO_URI;
        if (!uri) throw new Error("MONGO_URI not found");

        await mongoose.connect(uri);
        console.log("Connected to DB");

        const email = "admin@oceanview.com";
        const password = "admin123";
        const name = "Admin User";

        const existing = await User.findOne({ email });
        if (existing) {
            console.log("Admin already exists");
            process.exit(0);
        }

        const salt = await bcrypt.genSalt(10);
        const hashed = await bcrypt.hash(password, salt);

        await User.create({
            name,
            email,
            password: hashed,
            role: "admin",
        });

        console.log(`Admin created: ${email} / ${password}`);
        process.exit(0);
    } catch (err) {
        console.error("ERROR CREATING ADMIN:", err);
        console.error(err.message);
        process.exit(1);
    }
};

createAdmin();
