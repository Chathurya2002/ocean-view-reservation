const mongoose = require("mongoose");

const roomSchema = new mongoose.Schema({
  name: String, // "Standard Room 101"
  type: String, // STANDARD | DELUXE | SUITE
  price: Number,
  capacity: Number,
  image: String,

  bookings: [
    {
      checkIn: Date,
      checkOut: Date,
    },
  ],
});

module.exports = mongoose.model("Room", roomSchema);
