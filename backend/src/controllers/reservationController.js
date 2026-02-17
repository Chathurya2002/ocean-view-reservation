const Reservation = require("../models/Reservation");
const Room = require("../models/Room");
const Experience = require("../models/Experience");

exports.createReservation = async (req, res) => {
    try {
        const { roomId, checkIn, checkOut, paymentMethod, guests, experienceIds } = req.body;

        const room = await Room.findById(roomId);
        if (!room) return res.status(404).json({ message: "Room not found" });

        const start = new Date(checkIn);
        const end = new Date(checkOut);

        // 🛡️ Prevent Double Booking / Overlap
        const isBooked = await Reservation.findOne({
            room: roomId,
            status: { $ne: "CANCELLED" },
            checkIn: { $lt: end },
            checkOut: { $gt: start }
        });

        if (isBooked) {
            return res.status(400).json({ message: "This room is already reserved for the selected dates." });
        }

        // Calculate nights and base room price
        const diffTime = Math.abs(end - start);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        const nights = diffDays > 0 ? diffDays : 1;
        let totalPrice = nights * room.price;

        // Add Experience Prices
        let selectedExperiences = [];
        if (experienceIds && Array.isArray(experienceIds) && experienceIds.length > 0) {
            selectedExperiences = await Experience.find({ _id: { $in: experienceIds } });
            const experiencesTotal = selectedExperiences.reduce((sum, exp) => sum + exp.price, 0);
            totalPrice += experiencesTotal;
        }

        // Generate unique reservation number
        const reservationNumber = `RES-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

        const reservation = await Reservation.create({
            reservationNumber,
            user: req.user._id,
            room: roomId,
            checkIn: start,
            checkOut: end,
            price: totalPrice,
            paymentMethod,
            guests: guests || 1,
            experiences: experienceIds || [],
            paymentReceipt: req.file ? `/uploads/${req.file.filename}` : null
        });

        // 🚀 We no longer mark the room as globally unavailable.
        // Availability is determined dynamically by date range in roomController.

        res.status(201).json(reservation);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
};

exports.getAllReservations = async (req, res) => {
    try {
        const reservations = await Reservation.find({}).populate("user", "name email").populate("room", "name roomNumber");
        res.json(reservations);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
};

exports.getReservation = async (req, res) => {
    try {
        const reservation = await Reservation.findById(req.params.id)
            .populate("room", "name roomNumber price image type")
            .populate("user", "name email")
            .populate("experiences");
        if (!reservation) return res.status(404).json({ message: "Reservation not found" });
        res.json(reservation);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
};

exports.getMyReservations = async (req, res) => {
    try {
        const reservations = await Reservation.find({ user: req.user._id })
            .populate("room", "name roomNumber image type price")
            .sort({ createdAt: -1 });
        res.json(reservations);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
};

exports.deleteReservation = async (req, res) => {
    try {
        const reservation = await Reservation.findById(req.params.id);
        if (!reservation) return res.status(404).json({ message: "Reservation not found" });

        // We no longer manually toggle availability here.

        await Reservation.findByIdAndDelete(req.params.id);
        res.json({ message: "Reservation deleted and room status reset ✅" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
};
