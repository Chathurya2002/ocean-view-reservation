const express = require("express");
const router = express.Router();
const { createReservation, getAllReservations, getReservation, deleteReservation, getMyReservations } = require("../controllers/reservationController");
const { protect, admin } = require("../middleware/authMiddleware");
const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/");
    },
    filename: (req, file, cb) => {
        cb(null, `receipt-${Date.now()}-${file.originalname}`);
    },
});

const upload = multer({
    storage,
    fileFilter: (req, file, cb) => {
        const filetypes = /jpeg|jpg|png|pdf/; // Allow PDF for receipts too
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = filetypes.test(file.mimetype);
        if (mimetype && extname) return cb(null, true);
        cb(new Error("Only images (jpeg, jpg, png) or PDF receipts allowed"));
    },
});

router.post("/", protect, upload.single("paymentReceipt"), createReservation);
router.get("/my", protect, getMyReservations);
router.get("/", protect, admin, getAllReservations);
router.get("/:id", protect, getReservation);
router.delete("/:id", protect, admin, deleteReservation);

module.exports = router;
