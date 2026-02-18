const express = require("express");
const router = express.Router();
const Experience = require("../models/Experience");
const { protect, admin } = require("../middleware/authMiddleware");

// @route   GET /api/experiences
// @desc    Get all experiences
// @access  Public
router.get("/", async (req, res) => {
    try {
        const experiences = await Experience.find({ isAvailable: true });
        res.json(experiences);
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
});

// @route   GET /api/experiences/:id
// @desc    Get single experience
// @access  Public
router.get("/:id", async (req, res) => {
    try {
        const experience = await Experience.findById(req.params.id);
        if (!experience) return res.status(404).json({ message: "Experience not found" });
        res.json(experience);
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
});

// @route   POST /api/experiences
// @desc    Create new experience (Admin only)
// @access  Private/Admin
router.post("/", protect, admin, async (req, res) => {
    try {
        const { name, category, price, duration, desc, includes, notes, image } = req.body;

        if (!name || !category || !price || !duration || !desc || !image) {
            return res.status(400).json({ message: "Please provide all required fields" });
        }

        const experience = await Experience.create({
            name,
            category,
            price,
            duration,
            desc,
            includes: includes || [],
            notes: notes || "",
            image,
            isAvailable: true
        });

        res.status(201).json(experience);
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
});

// @route   PUT /api/experiences/:id
// @desc    Update experience (Admin only)
// @access  Private/Admin
router.put("/:id", protect, admin, async (req, res) => {
    try {
        const experience = await Experience.findById(req.params.id);
        if (!experience) return res.status(404).json({ message: "Experience not found" });

        const { name, category, price, duration, desc, includes, notes, image, isAvailable } = req.body;

        experience.name = name || experience.name;
        experience.category = category || experience.category;
        experience.price = price || experience.price;
        experience.duration = duration || experience.duration;
        experience.desc = desc || experience.desc;
        experience.includes = includes || experience.includes;
        experience.notes = notes !== undefined ? notes : experience.notes;
        experience.image = image || experience.image;
        experience.isAvailable = isAvailable !== undefined ? isAvailable : experience.isAvailable;

        await experience.save();
        res.json(experience);
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
});

// @route   DELETE /api/experiences/:id
// @desc    Delete experience (Admin only)
// @access  Private/Admin
router.delete("/:id", protect, admin, async (req, res) => {
    try {
        const experience = await Experience.findById(req.params.id);
        if (!experience) return res.status(404).json({ message: "Experience not found" });

        await experience.deleteOne();
        res.json({ message: "Experience deleted successfully" });
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
});

module.exports = router;
