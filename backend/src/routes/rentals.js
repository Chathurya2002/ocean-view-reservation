const express = require("express");
const router = express.Router();
const rentalController = require("../controllers/rentalController");

router.get("/", rentalController.getAllRentals);
router.post("/", rentalController.createRental); // Admin only in future
router.post("/seed", rentalController.seedRentals);

module.exports = router;
