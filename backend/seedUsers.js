const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("./src/models/User");
require("dotenv").config();

async function seedUsers() {
    try {
        const uri = process.env.MONGO_URI;
        await mongoose.connect(uri);
        console.log("Connected to seed users...");

        // Clear existing users if any (optional, but good for clean start)
        // await User.deleteMany({});

        const salt = await bcrypt.genSalt(10);
        const hashedAdminPassword = await bcrypt.hash("admin123", salt);
        const hashedUserPassword = await bcrypt.hash("user123", salt);

        const users = [
            {
                name: "Admin User",
                email: "admin@oceanview.lk",
                password: hashedAdminPassword,
                role: "admin"
            },
            {
                name: "Test Guest",
                email: "guest@example.com",
                password: hashedUserPassword,
                role: "user"
            }
        ];

        for (const u of users) {
            const exists = await User.findOne({ email: u.email });
            if (!exists) {
                await User.create(u);
                console.log(`Created user: ${u.email}`);
            } else {
                console.log(`User already exists: ${u.email}`);
            }
        }

        console.log("User seeding complete! ✅");
        process.exit(0);
    } catch (err) {
        console.error("Seeding error:", err);
        process.exit(1);
    }
}

seedUsers();
