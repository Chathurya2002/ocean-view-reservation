const mongoose = require('mongoose');
require('dotenv').config();
const Offer = require('./src/models/Offer');

mongoose.connect(process.env.MONGODB_URI || process.env.MONGO_URI)
    .then(async () => {
        // Check if an offer already exists first
        const existing = await Offer.findOne({ discountCode: "SUMMER26" });
        if (existing) {
            console.log("Offer already exists!");
            process.exit(0);
        }
        const myOffer = new Offer({
            title: "Summer Splash 2026!",
            description: "Get 20% off all Deluxe and Presidential rooms this Summer. Book now before August 31st.",
            discountCode: "SUMMER26",
            isActive: true
        });
        await myOffer.save();
        console.log("Active offer created successfully!");
        process.exit(0);
    })
    .catch(err => {
        console.error(err);
        process.exit(1);
    });
