const Room = require("../models/Room");
const Reservation = require("../models/Reservation");

exports.getAvailableRooms = async (req, res) => {
    try {
        const { checkIn, checkOut, roomType } = req.query;

        // Base query for rooms
        let query = { isAvailable: true };
        if (roomType) {
            query.type = roomType.toUpperCase();
        }

        // 1. Find all rooms that match the criteria
        let rooms = await Room.find(query);

        // 2. If dates are provided, filter out booked rooms
        if (checkIn && checkOut) {
            const start = new Date(checkIn);
            const end = new Date(checkOut);

            // Find reservations that overlap with the requested dates
            // Exclude cancelled reservations
            const overlappingReservations = await Reservation.find({
                checkIn: { $lt: end },
                checkOut: { $gt: start },
                status: { $ne: "CANCELLED" }
            }).select("room");

            const bookedRoomIds = overlappingReservations.map(res => res.room.toString());

            // Filter out rooms that are in the bookedRoomIds list
            rooms = rooms.filter(room => !bookedRoomIds.includes(room._id.toString()));
        }

        // Check if we need to seed (only if collection is empty)
        const totalRooms = await Room.countDocuments({});

        if (totalRooms === 0) {
            console.log("Seeding initial room data as collection is empty... 🔄");

            const initialRooms = [
                { roomNumber: "101", name: "Standard Coastal Room", type: "STANDARD", price: 22500, desc: "A cozy room with essential amenities and partial garden view.", image: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=60" },
                { roomNumber: "102", name: "Ocean Breeze Single", type: "STANDARD", price: 24000, desc: "Perfect for solo travelers looking for comfort and proximity to the shore.", image: "https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=1200&q=60" },
                { roomNumber: "103", name: "Palm View Standard", type: "STANDARD", price: 23800, desc: "Relax with views of the swaying palm trees in this comfortable space.", image: "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1200&q=60" },
                { roomNumber: "104", name: "Garden Retreat", type: "STANDARD", price: 21200, desc: "Quiet and peaceful, overlooking the lush resort gardens.", image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=60" },
                { roomNumber: "201", name: "Sunset Deluxe King", type: "DELUXE", price: 33500, desc: "Premium king bed with a balcony perfectly positioned for sunsets.", image: "https://images.unsplash.com/photo-1445019980597-93fa8acb246c?auto=format&fit=crop&w=1200&q=60" },
                { roomNumber: "202", name: "Coral Reef Deluxe", type: "DELUXE", price: 34200, desc: "Spacious deluxe room with marine-inspired decor and sea views.", image: "https://images.unsplash.com/photo-1591088398332-8a77d399ef84?auto=format&fit=crop&w=1200&q=60" },
                { roomNumber: "203", name: "Azure Bay Deluxe", type: "DELUXE", price: 35000, desc: "Wake up to panoramic views of the blue bay from your private terrace.", image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=1200&q=60" },
                { roomNumber: "204", name: "Horizon Deluxe Twin", type: "DELUXE", price: 33800, desc: "Two comfortable twin beds, ideal for friends or family.", image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=60" },
                { roomNumber: "301", name: "Family Coastal Suite", type: "SUITE", price: 52000, desc: "Large suite with two bedrooms and a common living area for families.", image: "https://images.unsplash.com/photo-1501117716987-c8e1ecb210c2?auto=format&fit=crop&w=1200&q=60" },
                { roomNumber: "302", name: "Pearl Executive Suite", type: "SUITE", price: 45000, desc: "Elegant business-friendly suite with high-speed internet and workspace.", image: "https://images.unsplash.com/photo-1584132967334-10e028bd69f7?auto=format&fit=crop&w=1200&q=60" },
                { roomNumber: "303", name: "Moonlight Penthouse", type: "SUITE", price: 58000, desc: "Top-floor penthouse with stargazing skylights and private Jacuzzi.", image: "https://images.unsplash.com/photo-1578683010236-d716f9a3f244?auto=format&fit=crop&w=1200&q=60" },
                { roomNumber: "304", name: "Anchor Suite", type: "SUITE", price: 51000, desc: "Nautical-themed suite with direct beach access.", image: "https://images.unsplash.com/photo-1495365200479-c4ed1d392743?auto=format&fit=crop&w=1200&q=60" },
                { roomNumber: "401", name: "The Presidential Haven", type: "PRESIDENTIAL", price: 85000, desc: "Unmatched luxury with 3 bedrooms, private pool, and 24/7 butler.", image: "https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=1200&q=60" },
                { roomNumber: "402", name: "Royal Ocean Palace", type: "PRESIDENTIAL", price: 125000, desc: "Our most exclusive offering, featuring 360-degree ocean views and a helipad.", image: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=60" },
                { roomNumber: "403", name: "Ambassador Villa", type: "PRESIDENTIAL", price: 72000, desc: "Private standalone villa with its own garden and infinity pool.", image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=60" },
            ];

            await Room.insertMany(initialRooms);
            rooms = await Room.find(query); // Refresh
        }

        res.json(rooms);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
};

exports.getAllRooms = async (req, res) => {
    try {
        const totalRooms = await Room.countDocuments({});

        // Only seed if database is completely empty to preserve IDs
        if (totalRooms === 0) {
            console.log("Admin Panel: Database empty, seeding initial rooms... 🔄");

            const initialRooms = [
                { roomNumber: "101", name: "Standard Coastal Room", type: "STANDARD", price: 22500, desc: "A cozy room with essential amenities and partial garden view.", image: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=60" },
                { roomNumber: "102", name: "Ocean Breeze Single", type: "STANDARD", price: 24000, desc: "Perfect for solo travelers looking for comfort and proximity to the shore.", image: "https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=1200&q=60" },
                { roomNumber: "103", name: "Palm View Standard", type: "STANDARD", price: 23800, desc: "Relax with views of the swaying palm trees in this comfortable space.", image: "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1200&q=60" },
                { roomNumber: "104", name: "Garden Retreat", type: "STANDARD", price: 21200, desc: "Quiet and peaceful, overlooking the lush resort gardens.", image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=60" },
                { roomNumber: "201", name: "Sunset Deluxe King", type: "DELUXE", price: 33500, desc: "Premium king bed with a balcony perfectly positioned for sunsets.", image: "https://images.unsplash.com/photo-1445019980597-93fa8acb246c?auto=format&fit=crop&w=1200&q=60" },
                { roomNumber: "202", name: "Coral Reef Deluxe", type: "DELUXE", price: 34200, desc: "Spacious deluxe room with marine-inspired decor and sea views.", image: "https://images.unsplash.com/photo-1591088398332-8a77d399ef84?auto=format&fit=crop&w=1200&q=60" },
                { roomNumber: "203", name: "Azure Bay Deluxe", type: "DELUXE", price: 35000, desc: "Wake up to panoramic views of the blue bay from your private terrace.", image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=1200&q=60" },
                { roomNumber: "204", name: "Horizon Deluxe Twin", type: "DELUXE", price: 33800, desc: "Two comfortable twin beds, ideal for friends or family.", image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=60" },
                { roomNumber: "301", name: "Family Coastal Suite", type: "SUITE", price: 52000, desc: "Large suite with two bedrooms and a common living area for families.", image: "https://images.unsplash.com/photo-1501117716987-c8e1ecb210c2?auto=format&fit=crop&w=1200&q=60" },
                { roomNumber: "302", name: "Pearl Executive Suite", type: "SUITE", price: 45000, desc: "Elegant business-friendly suite with high-speed internet and workspace.", image: "https://images.unsplash.com/photo-1584132967334-10e028bd69f7?auto=format&fit=crop&w=1200&q=60" },
                { roomNumber: "303", name: "Moonlight Penthouse", type: "SUITE", price: 58000, desc: "Top-floor penthouse with stargazing skylights and private Jacuzzi.", image: "https://images.unsplash.com/photo-1578683010236-d716f9a3f244?auto=format&fit=crop&w=1200&q=60" },
                { roomNumber: "304", name: "Anchor Suite", type: "SUITE", price: 51000, desc: "Nautical-themed suite with direct beach access.", image: "https://images.unsplash.com/photo-1495365200479-c4ed1d392743?auto=format&fit=crop&w=1200&q=60" },
                { roomNumber: "401", name: "The Presidential Haven", type: "PRESIDENTIAL", price: 85000, desc: "Unmatched luxury with 3 bedrooms, private pool, and 24/7 butler.", image: "https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=1200&q=60" },
                { roomNumber: "402", name: "Royal Ocean Palace", type: "PRESIDENTIAL", price: 125000, desc: "Our most exclusive offering, featuring 360-degree ocean views and a helipad.", image: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=60" },
                { roomNumber: "403", name: "Ambassador Villa", type: "PRESIDENTIAL", price: 72000, desc: "Private standalone villa with its own garden and infinity pool.", image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=60" },
            ];

            await Room.insertMany(initialRooms);
        }

        const rooms = await Room.find({}).lean();

        // dynamic status check: Mark as occupied if reserved for TODAY
        const now = new Date();
        const startOfToday = new Date(now);
        startOfToday.setHours(0, 0, 0, 0);

        const endOfToday = new Date(now);
        endOfToday.setHours(23, 59, 59, 999);

        // Find any reservation that overlaps with ANY part of today
        const activeReservations = await Reservation.find({
            status: { $ne: "CANCELLED" },
            $or: [
                { checkIn: { $lte: endOfToday }, checkOut: { $gte: startOfToday } }
            ]
        }).select("room");

        console.log(`[Admin] Found ${activeReservations.length} potential overlaps for today.`);

        const occupiedRoomIds = activeReservations
            .filter(res => res.room)
            .map(res => res.room.toString());

        const roomsWithStatus = rooms.map(room => {
            const isCurrentlyBooked = occupiedRoomIds.includes(room._id.toString());
            return {
                ...room,
                // A room is "Available" only if it's marked available in DB AND doesn't have a reservation for today
                isAvailable: room.isAvailable && !isCurrentlyBooked
            };
        });

        res.json(roomsWithStatus);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
};

exports.getRoomById = async (req, res) => {
    try {
        const room = await Room.findById(req.params.id);
        if (!room) return res.status(404).json({ message: "Room not found" });
        res.json(room);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
};

exports.createRoom = async (req, res) => {
    try {
        const { roomNumber, name, type, price, desc, image } = req.body;
        if (!roomNumber || !name || !type || !price) {
            return res.status(400).json({ message: "Room Number, Name, type, and price are required" });
        }
        const room = await Room.create({ roomNumber, name, type, price, desc, image });
        res.status(201).json(room);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
};

exports.resyncRooms = async (req, res) => {
    try {
        // 1. Reset all rooms to available first
        await Room.updateMany({}, { isAvailable: true });

        // 2. Find all non-cancelled reservations
        const activeReservations = await Reservation.find({ status: { $ne: "CANCELLED" } });

        // 3. Mark rooms with active reservations as unavailable
        const roomIdsToMark = activeReservations.map(r => r.room).filter(id => id);
        await Room.updateMany({ _id: { $in: roomIdsToMark } }, { isAvailable: false });

        res.json({ message: "Room availability synchronized with reservations! ✅" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Resync failed" });
    }
};
