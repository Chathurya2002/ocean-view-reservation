const express = require("express");
const router = express.Router();
const Offer = require("../models/Offer");
const { protect, admin } = require("../middleware/authMiddleware");

// GET all offers (Admin)
router.get("/", protect, admin, async (req, res) => {
    try {
        const offers = await Offer.find().sort({ createdAt: -1 });
        res.json(offers);
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
});

// GET active offers (Public, for user home page)
router.get("/active", async (req, res) => {
    try {
        const offers = await Offer.find({ isActive: true }).sort({ createdAt: -1 });
        res.json(offers);
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
});

// POST to create a new offer (Admin)
router.post("/", protect, admin, async (req, res) => {
    try {
        const { title, description, discountCode, isActive } = req.body;
        const offer = new Offer({ title, description, discountCode, isActive });
        await offer.save();
        res.status(201).json(offer);
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
});

// PUT to update an offer (Admin)
router.put("/:id", protect, admin, async (req, res) => {
    try {
        const offer = await Offer.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!offer) return res.status(404).json({ message: "Offer not found" });
        res.json(offer);
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
});

// DELETE an offer (Admin)
router.delete("/:id", protect, admin, async (req, res) => {
    try {
        const offer = await Offer.findByIdAndDelete(req.params.id);
        if (!offer) return res.status(404).json({ message: "Offer not found" });
        res.json({ message: "Offer deleted" });
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
});

module.exports = router;
