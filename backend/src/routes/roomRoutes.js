const express = require("express");
const router = express.Router();
const { getAvailableRooms, createRoom, getRoomById, getAllRooms, resyncRooms } = require("../controllers/roomController");
const { protect, admin } = require("../middleware/authMiddleware");

router.get("/available", getAvailableRooms);
router.get("/", protect, admin, getAllRooms);
router.get("/:id", getRoomById);
router.post("/", protect, admin, createRoom);
router.post("/resync", protect, admin, resyncRooms);

module.exports = router;
