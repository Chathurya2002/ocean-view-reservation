const express = require("express");
const router = express.Router();
const { register, login, getMe, updateProfile, upload, getAllUsers } = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware");

// ✅ (Optional) quick test routes
router.get("/ping", (req, res) => res.json({ ping: true }));
router.post("/debug", (req, res) =>
  res.json({ method: req.method, body: req.body })
);

// ✅ Auth routes
router.post("/register", register);
router.post("/login", login);
router.get("/me", protect, getMe);
router.put("/update-profile", protect, upload.single("idImage"), updateProfile);
router.get("/users", protect, require("../middleware/authMiddleware").admin, getAllUsers);

module.exports = router;
