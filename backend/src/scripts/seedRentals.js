const mongoose = require("mongoose");
const dotenv = require("dotenv");
const path = require("path");
const Rental = require("../models/Rental");
const connectDB = require("../config/db");

dotenv.config({ path: path.join(__dirname, "../../.env") });

const seedRentals = async () => {
    try {
        await connectDB();
        console.log("Database connected for seeding...");

        // Clear existing rentals
        await Rental.deleteMany({});
        console.log("Cleared existing rentals.");

        const rentals = [
            {
                name: "Tuk Tuk (Three Wheeler)",
                type: "Vehicle",
                price: 3500,
                image: "https://images.unsplash.com/photo-1600609842388-3e4b7ea2fb4c?auto=format&fit=crop&w=800&q=60",
                description: "Experience the authentic Sri Lankan way of travel. Perfect for short trips around Galle and Hikkaduwa.",
                features: ["3 Passengers", "Open Air", "Driver Included"]
            },
            {
                name: "Scooter Rental",
                type: "Vehicle",
                price: 2000,
                image: "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=800&q=60",
                description: "Freedom to explore at your own pace. Ideal for solo travelers or couples.",
                features: ["2 Helmets", "Automatic", "Fuel Efficient"]
            },
            {
                name: "Luxury Sedan (Car)",
                type: "Vehicle",
                price: 9000,
                image: "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=800&q=60",
                description: "Travel in comfort with air conditioning and ample luggage space.",
                features: ["4 Passengers", "AC", "Driver Option"]
            },
            {
                name: "Family Van (KDH)",
                type: "Vehicle",
                price: 14000,
                image: "https://images.unsplash.com/photo-1532581140115-3e355d1ed1de?auto=format&fit=crop&w=800&q=60",
                description: "Spacious van for group excursions and airport transfers.",
                features: ["9 Passengers", "AC", "High Roof"]
            },
            {
                name: "Mountain Bicycle",
                type: "Bicycle",
                price: 800,
                image: "https://images.unsplash.com/photo-1485965120184-e224f7a1a77e?auto=format&fit=crop&w=800&q=60",
                description: "Eco-friendly way to see the village life and rice paddies.",
                features: ["Gear System", "Helmet", "Water Bottle Holder"]
            }
        ];

        await Rental.insertMany(rentals);
        console.log("Rentals seeded successfully!");
        process.exit();
    } catch (err) {
        console.error("Seeding failed:", err);
        process.exit(1);
    }
};

seedRentals();
