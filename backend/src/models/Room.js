const mongoose = require("mongoose");

const roomSchema = new mongoose.Schema({
    roomNumber: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    type: { type: String, required: true, enum: ["STANDARD", "DELUXE", "SUITE", "PRESIDENTIAL"] },
    price: { type: Number, required: true },
    desc: { type: String },
    image: { type: String },
    isAvailable: { type: Boolean, default: true },
});

module.exports = mongoose.model("Room", roomSchema);
