const express = require("express");
const cors = require("cors");
require("dotenv").config();
console.log("SERVER.JS IS RUNNING ✅");

const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");

const app = express();

app.use(cors());
app.use(express.json());

connectDB();
console.log("Auth routes loaded ✅");

app.use("/api/auth", authRoutes);

app.get("/", (req, res) => {
  res.send("Backend working");
});

app.get("/api/auth/test", (req, res) => res.json({ ok: true }));

app.listen(process.env.PORT || 5000, () => {
  console.log("Server running on port 5000");
});
