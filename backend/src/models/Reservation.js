const mongoose = require("mongoose");

const reservationSchema = new mongoose.Schema({
    reservationNumber: { type: String, required: true, unique: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    room: { type: mongoose.Schema.Types.ObjectId, ref: "Room", required: false },
    checkIn: { type: Date, required: true },
    checkOut: { type: Date, required: true },
    price: { type: Number, required: true }, // Total price
    paymentMethod: { type: String, enum: ["CARD", "CASH", "BANK"], default: "CARD" },
    paymentReceipt: { type: String },
    status: { type: String, enum: ["PENDING", "CONFIRMED", "CANCELLED"], default: "CONFIRMED" },
    guests: { type: Number, default: 1 },
    experiences: [{
        experience: { type: mongoose.Schema.Types.ObjectId, ref: "Experience" },
        date: { type: Date }
    }],
    rentals: [{
        rental: { type: mongoose.Schema.Types.ObjectId, ref: "Rental" },
        startDate: { type: Date },
        endDate: { type: Date },
        days: { type: Number }
    }],
    driverDetails: {
        name: { type: String },
        contact: { type: String },
        vehicleNo: { type: String },
        status: { type: String, enum: ["PENDING", "ASSIGNED"], default: "PENDING" }
    }
}, { timestamps: true });

module.exports = mongoose.model("Reservation", reservationSchema);
