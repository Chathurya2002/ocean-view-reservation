const Rental = require("../models/Rental");

exports.getAllRentals = async (req, res) => {
    try {
        const rentals = await Rental.find({});
        res.json(rentals);
    } catch (err) {
        res.status(500).json({ message: "Server Error" });
    }
};

exports.createRental = async (req, res) => {
    try {
        const newRental = new Rental(req.body);
        const savedRental = await newRental.save();
        res.status(201).json(savedRental);
    } catch (err) {
        res.status(500).json({ message: "Server Error" });
    }
};

exports.updateRental = async (req, res) => {
    try {
        const updatedRental = await Rental.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updatedRental);
    } catch (err) {
        res.status(500).json({ message: "Server Error" });
    }
};

exports.deleteRental = async (req, res) => {
    try {
        await Rental.findByIdAndDelete(req.params.id);
        res.json({ message: "Rental Deleted" });
    } catch (err) {
        res.status(500).json({ message: "Server Error" });
    }
};

// Seed function to initialize some data if needed
exports.seedRentals = async (req, res) => {
    try {
        await Rental.deleteMany({});
        const rentals = [
            {
                name: "Tuk Tuk Listing",
                type: "Vehicle",
                price: 2500,
                image: "https://images.unsplash.com/photo-1626246430268-0524bb6b694b?auto=format&fit=crop&w=800&q=60",
                description: "Experience the authentic Sri Lankan travel style with a self-drive Tuk Tuk.",
                features: ["3 Passengers", "Manual Gear", "Open Air"]
            },
            {
                name: "Scooter / Motorbike",
                type: "Vehicle",
                price: 1500,
                image: "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=800&q=60",
                description: "Zip around Galle and Hikkaduwa freely on a scooter.",
                features: ["2 Passengers", "Automatic", "Helmets Included"]
            },
            {
                name: "Luxury Car (Sedan)",
                type: "Vehicle",
                price: 8000,
                image: "https://images.unsplash.com/photo-1503376763036-066120622c74?auto=format&fit=crop&w=800&q=60",
                description: "Comfortable air-conditioned sedan for your day trips.",
                features: ["4 Passengers", "Air Conditioned", "Driver Optional"]
            },
            {
                name: "Premium Van",
                type: "Vehicle",
                price: 12000,
                image: "https://images.unsplash.com/photo-1565043666747-69f6645db940?auto=format&fit=crop&w=800&q=60",
                description: "Spacious van for family trips and airport transfers.",
                features: ["7-9 Passengers", "Air Conditioned", "Large Luggage Space"]
            },
            {
                name: "Mountain Bicycle",
                type: "Bicycle",
                price: 500,
                image: "https://images.unsplash.com/photo-1532298229144-0ec0c57515c7?auto=format&fit=crop&w=800&q=60",
                description: "Eco-friendly way to explore the nearby beaches.",
                features: ["1 Passenger", "Gears", "Lock Included"]
            }
        ];
        await Rental.insertMany(rentals);
        res.json({ message: "Rentals Seeded Successfully" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
