const mongoose = require("mongoose");

const experienceSchema = new mongoose.Schema({
    name: { type: String, required: true },
    category: {
        type: String,
        required: true,
        enum: ["CULTURAL", "ADVENTURE", "NATURE", "WATER_ACTIVITY", "WELLNESS", "FOOD_EXPERIENCE", "TRANSPORT"]
    },
    price: { type: Number, required: true },
    duration: { type: String, required: true },
    desc: { type: String, required: true },
    includes: [{ type: String }],
    notes: { type: String },
    image: { type: String, required: true },
    isAvailable: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model("Experience", experienceSchema);
