const Reservation = require("../models/Reservation");
const Room = require("../models/Room");
const Experience = require("../models/Experience");
const Rental = require("../models/Rental");

exports.createReservation = async (req, res) => {
    try {
        const { roomId, checkIn, checkOut, paymentMethod, guests, experienceIds, rentalIds } = req.body;

        let room = null;
        let totalPrice = 0;
        let start, end;

        // ✅ If Room is selected, validate and calculate room price
        if (roomId) {
            room = await Room.findById(roomId);
            if (!room) return res.status(404).json({ message: "Room not found" });

            start = new Date(checkIn);
            end = new Date(checkOut);

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
            totalPrice = nights * room.price;
        } else {
            // Standalone Booking (Experience / Rental) - Use current date if not provided
            start = checkIn ? new Date(checkIn) : new Date();
            end = checkOut ? new Date(checkOut) : new Date();
        }

        // Add Experience Prices
        let experienceData = [];
        if (experienceIds && Array.isArray(experienceIds) && experienceIds.length > 0) {
            // Expecting experienceIds to be array of strings or objects? 
            // URL params usually send strings "id1,id2". 
            // PaymentPage logic sends `experienceIds` as array of strings.
            // But we need DATES now. 
            // We need to change how data is sent from frontend first?
            // User request: "userta date eka select krnn denn".
            // So frontend will send array of objects? or we calculate here?
            // To keep it simple with existing PaymentPage structure:
            // I will update PaymentPage to send `experiences` array of objects [{id, date}] instead of just IDs.
            // checking req.body.experiences instead of experienceIds for the new structure.

            const experiencesPayload = req.body.experiences || []; // New standard
            // Fallback for old simple ID array
            const simpleIds = req.body.experienceIds || [];

            // If new payload used
            if (experiencesPayload.length > 0) {
                for (const item of experiencesPayload) {
                    const exp = await Experience.findById(item.id);
                    if (exp) {
                        totalPrice += exp.price;
                        experienceData.push({ experience: exp._id, date: item.date || new Date() });
                    }
                }
            } else if (simpleIds.length > 0) {
                const selectedExperiences = await Experience.find({ _id: { $in: simpleIds } });
                const experiencesTotal = selectedExperiences.reduce((sum, exp) => sum + exp.price, 0);
                totalPrice += experiencesTotal;
                experienceData = selectedExperiences.map(e => ({ experience: e._id, date: new Date() }));
            }
        }

        // Add Rental Prices
        let rentalData = [];
        const rentalsPayload = req.body.rentals || [];
        const simpleRentalIds = req.body.rentalIds || [];

        if (rentalsPayload.length > 0) {
            for (const item of rentalsPayload) {
                const rental = await Rental.findById(item.id);
                if (rental) {
                    const rStart = new Date(item.startDate);
                    const rEnd = new Date(item.endDate);
                    const diffTime = Math.abs(rEnd - rStart);
                    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // Include start day? Usually rentals are per 24h or calendar day. Let's say per day inclusive effectively or just diff. "dws gana". 
                    // If user picks 1st to 1st, is it 1 day? Yes.
                    const days = diffDays > 0 ? diffDays : 1;

                    totalPrice += (rental.price * days);
                    rentalData.push({
                        rental: rental._id,
                        startDate: rStart,
                        endDate: rEnd,
                        days: days
                    });
                }
            }
        } else if (simpleRentalIds.length > 0) {
            const selectedRentals = await Rental.find({ _id: { $in: simpleRentalIds } });
            const rentalsTotal = selectedRentals.reduce((sum, rental) => sum + rental.price, 0);
            totalPrice += rentalsTotal;
            rentalData = selectedRentals.map(r => ({ rental: r._id, startDate: new Date(), endDate: new Date(), days: 1 }));
        }

        // Generate unique reservation number
        const reservationNumber = `RES-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

        const reservation = await Reservation.create({
            reservationNumber,
            user: req.user._id,
            room: roomId || null,
            checkIn: start,
            checkOut: end,
            price: totalPrice,
            paymentMethod,
            guests: guests || 1,
            experiences: experienceData,
            rentals: rentalData,
            paymentReceipt: req.file ? `/uploads/${req.file.filename}` : null
        });

        res.status(201).json(reservation);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
};

exports.getAllReservations = async (req, res) => {
    try {
        const reservations = await Reservation.find({})
            .populate("user", "name email")
            .populate("room", "name roomNumber")
            .populate("rentals.rental")
            .populate("experiences.experience");
        res.json(reservations);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
};

exports.updateReservation = async (req, res) => {
    try {
        const updatedReservation = await Reservation.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        )
            .populate("user", "name email")
            .populate("room", "name roomNumber")
            .populate("rentals");

        if (!updatedReservation) return res.status(404).json({ message: "Reservation not found" });

        res.json(updatedReservation);
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
            .populate("experiences.experience")
            .populate("rentals.rental");
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
