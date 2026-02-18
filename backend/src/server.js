const express = require("express");
const cors = require("cors");
require("dotenv").config();
console.log("SERVER.JS IS RUNNING ✅");

const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const path = require("path");

const app = express();

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

console.log("Auth routes loaded ✅");
app.use("/api/auth", authRoutes);
app.use("/api/rooms", require("./routes/roomRoutes"));
app.use("/api/experiences", require("./routes/experienceRoutes"));
app.use("/api/reservations", require("./routes/reservationRoutes"));
app.use("/api/rentals", require("./routes/rentals"));

app.get("/", (req, res) => {
  res.send("Backend working");
});

app.get("/api/auth/test", (req, res) => res.json({ ok: true }));


const start = async () => {
  await connectDB();
  const port = process.env.PORT || 5000;
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
};

start();
