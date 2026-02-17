const express = require("express");
const router = express.Router();
const Experience = require("../models/Experience");

// @desc    Get all experiences
// @route   GET /api/experiences
// @access  Public
router.get("/", async (req, res) => {
    try {
        const experiences = await Experience.find({ isAvailable: true });
        res.json(experiences);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
});

// @desc    Get single experience
// @route   GET /api/experiences/:id
// @access  Public
router.get("/:id", async (req, res) => {
    try {
        const experience = await Experience.findById(req.params.id);
        if (!experience) return res.status(404).json({ message: "Experience not found" });
        res.json(experience);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
});

module.exports = router;
