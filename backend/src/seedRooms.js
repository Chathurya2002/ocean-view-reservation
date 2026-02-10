const mongoose = require("mongoose");
const dotenv = require("dotenv");
const path = require("path");

dotenv.config({ path: path.join(__dirname, "../.env") }); 

const Room = require("./models/Room"); 

const rooms = [
  {
    name: "Standard Room",
    type: "STANDARD",
    price: 8500,
    capacity: 2,
    image:
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=60",
    isAvailable: true,
  },
  {
    name: "Deluxe Room",
    type: "DELUXE",
    price: 12500,
    capacity: 3,
    image:
      "https://images.unsplash.com/photo-1501117716987-c8e1ecb210f5?auto=format&fit=crop&w=1200&q=60",
    isAvailable: true,
  },
  {
    name: "Suite Room",
    type: "SUITE",
    price: 18500,
    capacity: 4,
    image:
      "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=60",
    isAvailable: true,
  },
];

async function seed() {
  try {
    const uri = process.env.MONGO_URI;
    if (!uri) throw new Error("MONGO_URI is missing in .env");
    
console.log("URI:", process.env.MONGO_URI);

    await mongoose.connect(uri);
    console.log("MongoDB connected for seeding ✅");

    await Room.deleteMany();
    await Room.insertMany(rooms);

    console.log("Rooms seeded ✅");
    process.exit(0);
  } catch (err) {
    console.error("Seeding error ❌", err.message);
    process.exit(1);
  }
}

seed();
