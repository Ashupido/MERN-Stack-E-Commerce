const express = require("express");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const verifyToken = require("../middleware/authMiddleware");
const isAdmin = require("../middleware/adminMiddleware");

const router = express.Router();

// =====================================
// GET ALL USERS (with filtering, sorting, pagination)
// GET /api/admin/users
// =====================================
router.get("/", verifyToken, isAdmin, async (req, res) => {
  try {
    const { search, role, status, page = 1, limit = 10, sort } = req.query;

    let filter = {};

    // Search by name or email
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }

    // Filter by role
    if (role && role !== "all") {
      filter.role = role;
    }

    // Filter by status
    if (status && status !== "all") {
      filter.status = status;
    }

    const pageNum = Number(page) || 1;
    const limitNum = parseInt(limit, 10) || 10;
    const skip = (pageNum - 1) * limitNum;

    let sortOption = { createdAt: -1 }; // Default sort
    if (sort === "name_asc") sortOption = { name: 1 };
    if (sort === "name_desc") sortOption = { name: -1 };
    if (sort === "last_login") sortOption = { lastLogin: -1 };

    const users = await User.find(filter)
      .select("-password")
      .sort(sortOption)
      .skip(skip)
      .limit(limitNum);

    const totalUsers = await User.countDocuments(filter);

    res.json({
      totalUsers,
      currentPage: pageNum,
      totalPages: Math.ceil(totalUsers / limitNum) || 1,
      users,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// =====================================
// GET SINGLE USER
// GET /api/admin/users/:id
// =====================================
router.get("/:id", verifyToken, isAdmin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// =====================================
// CREATE USER
// POST /api/admin/users
// =====================================
router.post("/", verifyToken, isAdmin, async (req, res) => {
  try {
    const { name, email, password, role, status, phone, username } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User with this email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      username, // Optional
      phone,
      role: role || "user",
      status: status || "active",
    });

    const savedUser = await newUser.save();
    const userResponse = savedUser.toObject();
    delete userResponse.password;

    res.status(201).json(userResponse);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// =====================================
// UPDATE USER (includes role change)
// PUT /api/admin/users/:id
// =====================================
router.put("/:id", verifyToken, isAdmin, async (req, res) => {
  try {
    const { name, email, password, phone, role, status } = req.body;

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Prevent admin from changing their own role or status
    if (req.user.id === req.params.id && (role !== user.role || status !== user.status)) {
        return res.status(403).json({ message: "Admin cannot change their own role or status." });
    }

    user.name = name ?? user.name;
    user.email = email ?? user.email;
    user.phone = phone ?? user.phone;
    user.role = role ?? user.role;
    user.status = status ?? user.status;
    if (password) {
      user.password = await bcrypt.hash(password, 10);
    }

    await user.save();
    const updatedUser = user.toObject();
    delete updatedUser.password;

    res.json(updatedUser);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// =====================================
// DELETE USER
// DELETE /api/admin/users/:id
// =====================================
router.delete("/:id", verifyToken, isAdmin, async (req, res) => {
  try {
    const userToDelete = await User.findById(req.params.id);
    if (!userToDelete) {
      return res.status(404).json({ message: "User not found" });
    }

    // Prevent admin from deleting themselves
    if (req.user.id === req.params.id) {
      return res.status(400).json({ message: "You cannot delete your own admin account." });
    }

    // Prevent deleting the last admin account
    if (userToDelete.role === "admin") {
      const adminCount = await User.countDocuments({ role: "admin" });
      if (adminCount <= 1) {
        return res.status(400).json({ message: "Cannot delete the last admin account." });
      }
    }

    await User.findByIdAndDelete(req.params.id);

    res.json({ message: "User deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;