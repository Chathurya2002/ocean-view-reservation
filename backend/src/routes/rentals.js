const express = require("express");
const router = express.Router();
const rentalController = require("../controllers/rentalController");

router.get("/", rentalController.getAllRentals);
router.post("/", rentalController.createRental); // Admin only in future
router.put("/:id", rentalController.updateRental);
router.delete("/:id", rentalController.deleteRental);
router.post("/seed", rentalController.seedRentals);

module.exports = router;
