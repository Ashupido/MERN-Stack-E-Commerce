const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const User = require("../models/User");
const Product = require("../models/Product");
const Order = require("../models/Order");
const AdminLog = require("../models/AdminLog");

const verifyToken = require("../middleware/authMiddleware");
const isAdmin = require("../middleware/adminMiddleware");

// Helper function to record admin activity log
const logAdminAction = async (req, action, activity, details = "", targetId = "") => {
  try {
    const adminUser = await User.findById(req.user.id).select("email name");
    await AdminLog.create({
      admin: req.user.id,
      adminEmail: adminUser ? adminUser.email : (req.user.email || "admin"),
      actorRole: "admin",
      action,
      activity,
      details,
      targetId: String(targetId),
    });
  } catch (err) {
    console.error("Failed to write admin log:", err.message);
  }
};

// =====================================
// GET DASHBOARD SUMMARY
// GET /api/admin/dashboard or GET /api/admin/dashboard/summary
// =====================================
const getDashboardSummary = async (req, res) => {
  try {
    // KPI Stats
    const totalUsers = await User.countDocuments();
    const activeSellers = await User.countDocuments({ role: 'seller', status: 'active' });
    const totalProducts = await Product.countDocuments();
    const totalOrders = await Order.countDocuments();

    const revenueResult = await Order.aggregate([
      { $match: { paymentStatus: "paid" } },
      { $group: { _id: null, total: { $sum: "$totalAmount" } } }
    ]);
    const totalRevenue = revenueResult.length > 0 ? revenueResult[0].total : 0;

    // Chart Data: Order Status Distribution
    const orderStatusDistribution = await Order.aggregate([
      { $group: { _id: '$status', value: { $sum: 1 } } },
      { $project: { name: '$_id', value: '$value' } }
    ]);

    // Chart Data: Monthly Sales
    const monthlySales = await Order.aggregate([
      { $match: { paymentStatus: "paid" } },
      {
        $group: {
          _id: { $month: "$createdAt" },
          revenue: { $sum: "$totalAmount" }
        }
      },
      { $sort: { "_id": 1 } },
      {
        $project: {
          name: { $arrayElemAt: [["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"], { $subtract: ["$_id", 1] }] },
          revenue: "$revenue"
        }
      }
    ]);

    // Table Data: Recent Orders
    const recentOrders = await Order.find().sort({ createdAt: -1 }).limit(5).populate('user', 'name');

    res.json({
      totalUsers,
      activeSellers,
      totalRevenue,
      totalOrders,
      orderStatusDistribution,
      monthlySales,
      recentOrders,
      totalProducts,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

router.get("/dashboard", verifyToken, isAdmin, getDashboardSummary);
router.get("/dashboard/summary", verifyToken, isAdmin, getDashboardSummary);
router.get("/", verifyToken, isAdmin, getDashboardSummary);

// =====================================
// ORDER MANAGEMENT
// GET /api/admin/orders
// =====================================
router.get("/orders", verifyToken, isAdmin, async (req, res) => {
  try {
    const { status, search, page = 1, limit = 10, sort } = req.query;
    let filter = {};

    // Filter by status
    if (status && status !== "all") {
      filter.status = status;
    }

    // Search by Order ID or User Email/Name
    if (search) {
      // To search by user name/email, we need to find users first
      const usersMatchingSearch = await User.find({
        $or: [
          { name: { $regex: search, $options: "i" } },
          { email: { $regex: search, $options: "i" } },
        ],
      }).select('_id');

      const userIds = usersMatchingSearch.map(user => user._id);

      // Combine search by order ID and user ID
      filter.$or = [
        { _id: mongoose.Types.ObjectId.isValid(search) ? search : null }, // Search by Order ID
        { user: { $in: userIds } }, // Search by User ID
      ];
      // Remove null from $or if search is not a valid ObjectId to prevent matching all orders
      if (!mongoose.Types.ObjectId.isValid(search)) {
        filter.$or = [{ user: { $in: userIds } }];
      }
    }

    const pageNum = Number(page) || 1;
    const limitNum = parseInt(limit, 10) || 10;
    const skip = (pageNum - 1) * limitNum;

    let sortOption = { createdAt: -1 };
    if (sort === "total_asc") sortOption = { totalAmount: 1 };
    if (sort === "total_desc") sortOption = { totalAmount: -1 };

    const orders = await Order.find(filter)
      .populate("user", "name email")
      .sort(sortOption)
      .skip(skip)
      .limit(limitNum);

    const totalOrders = await Order.countDocuments(filter);

    res.json({ totalOrders, currentPage: pageNum, totalPages: Math.ceil(totalOrders / limitNum) || 1, orders });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// =====================================
// UPDATE ORDER STATUS
// PUT /api/admin/orders/:id/status
// =====================================
router.put("/orders/:id/status", verifyToken, isAdmin, async (req, res) => {
  try {
    const { status } = req.body;
    const allowedStatus = ["pending", "confirmed", "shipped", "delivered", "cancelled"];

    if (!allowedStatus.includes(status)) {
      return res.status(400).json({ message: "Invalid order status" });
    }

    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    const oldStatus = order.status;
    order.status = status;
    
    if (order.trackingHistory) {
      order.trackingHistory.push({
        status: status,
        message: `Order status updated to ${status} by admin`
      });
    }

    await order.save();

    await logAdminAction(
      req,
      "Updated Order Status",
      `Updated order status from ${oldStatus} to ${status}`,
      `Order ID: ${order._id}`,
      order._id
    );

    const updatedOrder = await Order.findById(order._id).populate("user", "name email");

    res.json({
      message: "Order status updated successfully",
      order: updatedOrder,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// =====================================
// ADMIN LOGS
// GET /api/admin/logs
// =====================================
router.get("/logs", verifyToken, isAdmin, async (req, res) => {
  try {
    const { level, search, page = 1, limit = 15 } = req.query;
    let filter = {};

    // Filter by log level
    if (level && level !== "all") {
      filter.level = level;
    }

    // Search by action, details, or admin email
    if (search) {
      const searchFilter = {
        $or: [
        { action: { $regex: search, $options: "i" } },
        { details: { $regex: search, $options: "i" } },
        { adminEmail: { $regex: search, $options: "i" } },
        ]
      };
      if (filter.level) {
        filter = { $and: [filter, searchFilter] };
      } else {
        filter = searchFilter;
      }
    }

    const pageNum = Number(page) || 1;
    const limitNum = parseInt(limit, 10) || 15;
    const skip = (pageNum - 1) * limitNum;

    const logs = await AdminLog.find(filter)
      .populate("admin", "name email")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum);

    const totalLogs = await AdminLog.countDocuments(filter);

    res.json({ totalLogs, currentPage: pageNum, totalPages: Math.ceil(totalLogs / limitNum) || 1, logs });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
