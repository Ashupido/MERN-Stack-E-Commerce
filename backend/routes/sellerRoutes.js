const express = require("express");
const router = express.Router();

const Product = require("../models/Product");
const verifyToken = require("../middleware/authMiddleware");
const isSeller = require("../middleware/isSeller");

// =====================================
// GET SELLER'S PRODUCTS
// GET /api/seller/products
// =====================================
router.get("/products", verifyToken, isSeller, async (req, res) => {
  try {
    const { page = 1, limit = 10, search } = req.query;
    let filter = { seller: req.user.id };

    if (search) {
      filter.name = { $regex: search, $options: "i" };
    }

    const pageNum = Number(page);
    const limitNum = Number(limit);
    const skip = (pageNum - 1) * limitNum;

    const products = await Product.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum);

    const totalProducts = await Product.countDocuments(filter);

    res.json({
      totalProducts,
      currentPage: pageNum,
      totalPages: Math.ceil(totalProducts / limitNum) || 1,
      products,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Note: You would also add POST, PUT, and DELETE routes here for sellers to
// create, update, and delete their own products, ensuring each operation
// checks that `product.seller.toString() === req.user.id`.

module.exports = router;