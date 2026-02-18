const mongoose = require("mongoose");

const rentalSchema = new mongoose.Schema({
    name: { type: String, required: true }, // e.g., "Tuk Tuk", "Scooter"
    type: { type: String, enum: ["Vehicle", "Bicycle"], default: "Vehicle" },
    price: { type: Number, required: true }, // Per day or per booking (simplified to per booking for now based on request context, or per day usually)
    // Let's assume daily rate for rentals, consistency with rooms.
    // However, the prompt implies "rent krnn gnn puluwn vidiyta" which might mean simple add-on.
    // I will stick to a fixed price per rental addition for simplicity unless complex duration logic is needed, 
    // but usually rentals are per day. 
    // Given the room booking has check-in/out, it makes sense to charge per night or just a flat fee.
    // Experiences are flat fee. I will treat Rentals as flat fee add-on for this iteration to match Experiences, 
    // unless the user specifically asked for per-day logic which adds complexity.
    // "car van bycycle rent krnn gnn puluwn vidiyta ekath bill ekat add wen vidiyta" -> "add to bill"
    // I'll stick to flat fee for simplicity in V1, similar to Experiences.
    image: { type: String, required: true },
    description: { type: String },
    features: [{ type: String }], // e.g., "AC", "4 Seats"
}, { timestamps: true });

module.exports = mongoose.model("Rental", rentalSchema);
