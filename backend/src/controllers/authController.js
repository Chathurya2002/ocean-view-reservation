const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const makeToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

// ✅ REGISTER
exports.register = async (req, res) => {
  try {
    const { name, email, password, confirmPassword, role, address } = req.body;

    if (!name || !email || !password || !confirmPassword) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(password, salt);

    // Default to 'user' if role not provided or invalid
    const userRole = role === "admin" ? "admin" : "user";

    const user = await User.create({ name, email, password: hashed, role: userRole, address });

    const token = makeToken(user._id);

    return res.status(201).json({
      message: "Registered successfully",
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
    });
  } catch (err) {
    console.log("REGISTER ERROR:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

// ✅ LOGIN
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email & password are required" });
    }

    const user = await User.findOne({ email });
    console.log("LOGIN ATTEMPT - Email:", email);
    if (!user) {
      console.log("LOGIN FAILED - User not found");
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    console.log("LOGIN - Password Match:", isMatch);
    if (!isMatch) {
      console.log("LOGIN FAILED - Password mismatch");
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = makeToken(user._id);

    return res.json({
      message: "Login successful",
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
    });
  } catch (err) {
    console.log("LOGIN ERROR:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

// ✅ GET ME
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ UPDATE PROFILE
exports.updateProfile = async (req, res) => {
  try {
    const { whatsapp, contactNumber, idNumber, address } = req.body;
    const updates = { whatsapp, contactNumber, idNumber, address };

    if (req.file) {
      updates.idImage = `/uploads/${req.file.filename}`;
    }

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { $set: updates },
      { new: true }
    ).select("-password");

    res.json({
      message: "Profile updated successfully! ✅",
      user
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ MULTER CONFIG
const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

exports.upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);
    if (mimetype && extname) return cb(null, true);
    cb(new Error("Images only (jpeg, jpg, png)"));
  },
});

// ✅ GET ALL USERS (Admin only)
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}).select("-password");
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
