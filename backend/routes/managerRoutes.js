const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const Order = require("../models/Order");
const Product = require("../models/Product");
const User = require("../models/User");
const verifyToken = require("../middleware/authMiddleware");
const isManager = require("../middleware/managerMiddleware");
const logActivity = require("../utils/activityLogger");


// =====================================
// GET MANAGER DASHBOARD SUMMARY
// GET /api/manager/dashboard/summary
// =====================================
router.get("/dashboard/summary", verifyToken, isManager, async (req, res) => {
  try {
    const totalOrders = await Order.countDocuments();
    const pendingOrders = await Order.countDocuments({ status: "pending" });

    const revenueResult = await Order.aggregate([
      { $match: { paymentStatus: "paid" } },
      { $group: { _id: null, total: { $sum: "$totalAmount" } } },
    ]);
    const totalRevenue = revenueResult.length > 0 ? revenueResult[0].total : 0;

    // Example data for charts - in a real app, this would be a more complex query
    const salesPerMonth = [
      { name: 'Jan', sales: 4000 }, { name: 'Feb', sales: 3000 },
      { name: 'Mar', sales: 5000 }, { name: 'Apr', sales: 4500 },
      { name: 'May', sales: 6000 }, { name: 'Jun', sales: 8200 },
    ];

    const orderStatusDistribution = await Order.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } },
      { $project: { name: '$_id', value: '$count' } }
    ]);

    res.json({
      totalOrders,
      pendingOrders,
      totalRevenue,
      salesPerMonth,
      orderStatusDistribution,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// =====================================
// GET ORDERS (for Manager)
// GET /api/manager/orders
// =====================================
router.get("/orders", verifyToken, isManager, async (req, res) => {
  try {
    const { status, search, page = 1, limit = 10 } = req.query;
    let filter = {};

    if (status && status !== "all") {
      filter.status = status;
    }

    if (search) {
      const usersMatchingSearch = await mongoose.model('User').find({
        $or: [
          { name: { $regex: search, $options: "i" } },
          { email: { $regex: search, $options: "i" } },
        ],
      }).select('_id');

      const userIds = usersMatchingSearch.map(user => user._id);

      filter.$or = [
        { _id: mongoose.Types.ObjectId.isValid(search) ? search : null },
        { user: { $in: userIds } },
      ].filter(Boolean);
    }

    const pageNum = Number(page);
    const limitNum = Number(limit);
    const skip = (pageNum - 1) * limitNum;

    const orders = await Order.find(filter).populate("user", "name email").sort({ createdAt: -1 }).skip(skip).limit(limitNum);
    const totalOrders = await Order.countDocuments(filter);

    res.json({
      totalOrders,
      currentPage: pageNum,
      totalPages: Math.ceil(totalOrders / limitNum) || 1,
      orders,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// =====================================
// GET USERS (read-only for Manager)
// GET /api/manager/users
// =====================================
router.get("/users", verifyToken, isManager, async (req, res) => {
  try {
    const { search, role, status, page = 1, limit = 10 } = req.query;
    const filter = {};

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }
    if (role && role !== "all") filter.role = role;
    if (status && status !== "all") filter.status = status;

    const pageNum = Number(page) || 1;
    const limitNum = parseInt(limit, 10) || 10;
    const skip = (pageNum - 1) * limitNum;
    const users = await User.find(filter)
      .select("-password")
      .sort({ createdAt: -1 })
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
// UPDATE PRODUCT STOCK (MANAGER)
// PUT /api/manager/products/:id/stock
// =====================================
router.put("/products/:id/stock", verifyToken, isManager, async (req, res) => {
  try {
    const { stock } = req.body;

    if (stock === undefined || Number(stock) < 0) {
      return res.status(400).json({ message: "Invalid stock quantity provided." });
    }

    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    product.stock = Number(stock);
    await product.save();

    await logActivity(req, "Updated Product Stock", `Updated stock for ${product.name}`, `Stock: ${product.stock}`, product._id);

    res.json({ message: "Product stock updated successfully", product });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// =====================================
// UPDATE ORDER STATUS (MANAGER) - Re-using admin logic but with manager access
// PUT /api/manager/orders/:id/status
// =====================================
router.put("/orders/:id/status", verifyToken, isManager, async (req, res) => {
    try {
      const { status } = req.body;
      const allowedStatus = ["pending", "confirmed", "shipped", "delivered", "cancelled"];

      if (!allowedStatus.includes(status)) {
        return res.status(400).json({ message: "Invalid order status" });
      }

      const order = await Order.findByIdAndUpdate(
        req.params.id,
        { status },
        { new: true }
      ).populate("user", "name email");

      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }

      await logActivity(req, "Updated Order Status", `Updated order status to ${status}`, `Order ID: ${order._id}`, order._id);

      res.json({ message: "Order status updated successfully", order });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
});

module.exports = router;