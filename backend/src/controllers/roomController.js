const Room = require("../models/Room");

// GET /api/rooms/available
exports.getAvailableRooms = async (req, res) => {
  try {
    const { checkIn, checkOut, adults, roomType } = req.query;

    const start = new Date(checkIn);
    const end = new Date(checkOut);

    let filter = {
      capacity: { $gte: Number(adults || 1) },
    };

    if (roomType) filter.type = roomType;

    const rooms = await Room.find(filter);

    // remove booked rooms
    const available = rooms.filter((room) => {
      const conflict = room.bookings.some((b) => {
        return start < b.checkOut && end > b.checkIn;
      });

      return !conflict;
    });

    res.json(available);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
