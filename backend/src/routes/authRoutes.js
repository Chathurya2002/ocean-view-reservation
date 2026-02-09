const express = require("express");
const router = express.Router();

const { register, login } = require("../controllers/authController");

// ✅ (Optional) quick test routes
router.get("/ping", (req, res) => res.json({ ping: true }));
router.post("/debug", (req, res) =>
  res.json({ method: req.method, body: req.body })
);

// ✅ Auth routes
router.post("/register", register);
router.post("/login", login);

module.exports = router;
