const mongoose = require("mongoose");

const offerSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    discountCode: { type: String, required: false }, // e.g. "SUMMER24", optional
    isActive: { type: Boolean, default: true },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Offer", offerSchema);
