const mongoose = require("mongoose");
const Room = require("./src/models/Room");
const Reservation = require("./src/models/Reservation");
require("dotenv").config();

const check = async () => {
    await mongoose.connect(process.env.MONGO_URI || "mongodb://localhost:27017/ocean-view");
    const roomCount = await Room.countDocuments({});
    const resCount = await Reservation.countDocuments({});
    const unavailableRooms = await Room.find({ isAvailable: false });
    const reservations = await Reservation.find({}).populate("room");

    console.log("--- DB CHECK ---");
    console.log("Total Rooms:", roomCount);
    console.log("Total Reservations:", resCount);
    console.log("Unavailable Rooms (DB Flag):", unavailableRooms.length);

    reservations.forEach(r => {
        console.log(`Reservation: ${r.reservationNumber}, Room: ${r.room?.roomNumber}, Status: ${r.status}, Dates: ${r.checkIn.toISOString()} to ${r.checkOut.toISOString()}`);
    });

    process.exit();
};

check();
