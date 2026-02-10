const express = require("express");
const router = express.Router();
const { getAvailableRooms } = require("../controllers/roomController");

router.get("/available", getAvailableRooms);

module.exports = router;
