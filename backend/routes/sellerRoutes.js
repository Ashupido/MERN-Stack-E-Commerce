const express = require("express");
const router = express.Router();
const cloudinary = require("cloudinary").v2;

const Product = require("../models/Product");
const Order = require("../models/Order");
const verifyToken = require("../middleware/authMiddleware");
const isSeller = require("../middleware/isSeller");
const upload = require("../middleware/uploadMiddleware");

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

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

// =====================================
// CREATE PRODUCT (SELLER)
// POST /api/seller/products
// =====================================
router.post(
  "/products",
  verifyToken,
  isSeller,
  upload.single("image"),
  async (req, res) => {
    try {
      const {
        name,
        price,
        discountPrice,
        description,
        category,
        brand,
        stock,
        sku,
      } = req.body;

      // Required fields
      if (!name || !price || !description || !category) {
        return res.status(400).json({
          error: "Missing required product fields: name, price, description, and category are required",
        });
      }

      // Convert numeric fields
      const parsedPrice = Number(price);

      const parsedDiscount =
        discountPrice !== undefined &&
        discountPrice !== ""
          ? Number(discountPrice)
          : undefined;

      const parsedStock =
        stock !== undefined && stock !== ""
          ? Number(stock)
          : undefined;

      // Handle image upload
      if (!req.file) {
        return res.status(400).json({
          error: "Product image is required",
        });
      }

      const imageUrl =
        req.file?.path || req.file?.secure_url || req.file?.url;

      if (!imageUrl) {
        return res.status(400).json({
          error: "Image upload failed: Cloudinary URL not found",
        });
      }

      const product = new Product({
        name,
        price: parsedPrice,
        discountPrice: parsedDiscount,
        description,
        category,
        brand,
        stock: parsedStock,
        sku,
        images: [imageUrl],
        seller: req.user.id,
        createdBy: req.user.id,
      });

      await product.save();

      res.status(201).json(product);
    } catch (err) {
      console.error("CREATE PRODUCT ERROR:", err);

      res.status(500).json({
        error: err.message,
      });
    }
  }
);

// =====================================
// UPDATE PRODUCT (SELLER)
// PUT /api/seller/products/:id
// =====================================
router.put("/products/:id", verifyToken, isSeller, upload.single("image"), async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    // Verify ownership
    if (product.seller.toString() !== req.user.id) {
      return res.status(403).json({ error: "You can only update your own products" });
    }

    // Build update object
    const updateData = {};
    const fields = ["name", "price", "discountPrice", "description", "category", "brand", "stock", "sku", "status"];

    fields.forEach((field) => {
      if (req.body[field] !== undefined && req.body[field] !== "") {
        if (["price", "discountPrice", "stock"].includes(field)) {
          updateData[field] = Number(req.body[field]);
        } else {
          updateData[field] = req.body[field];
        }
      }
    });

    // Handle new image upload
    if (req.file) {
      const newImageUrl = req.file.secure_url || req.file.path;
      updateData.images = [newImageUrl];
    }

    const updatedProduct = await Product.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    });

    res.json({ message: "Product updated successfully", product: updatedProduct });
  } catch (err) {
    console.error("UPDATE PRODUCT ERROR (SELLER):", err);
    res.status(500).json({ error: err.message });
  }
});

// =====================================
// DELETE PRODUCT (SELLER)
// DELETE /api/seller/products/:id
// =====================================
router.delete("/products/:id", verifyToken, isSeller, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    // Verify ownership
    if (product.seller.toString() !== req.user.id) {
      return res.status(403).json({ error: "You can only delete your own products" });
    }

    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: "Product deleted successfully" });
  } catch (err) {
    console.error("DELETE PRODUCT ERROR (SELLER):", err);
    res.status(500).json({ error: err.message });
  }
});

// =====================================
// GET SELLER'S ORDERS
// GET /api/seller/orders
// =====================================
router.get("/orders", verifyToken, isSeller, async (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query;

    // Find all products belonging to this seller
    const sellerProducts = await Product.find({ seller: req.user.id }).select('_id');
    const productIds = sellerProducts.map(p => p._id);

    // Build filter for orders containing seller's products
    let filter = {
      'items.product': { $in: productIds }
    };

    if (status && status !== "all") {
      filter.status = status;
    }

    const pageNum = Number(page);
    const limitNum = Number(limit);
    const skip = (pageNum - 1) * limitNum;

    const orders = await Order.find(filter)
      .populate("user", "name email")
      .populate("items.product", "name price images")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum);

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
// GET SELLER PROFILE/SETTINGS
// GET /api/seller/settings
// =====================================
router.get("/settings", verifyToken, isSeller, async (req, res) => {
  try {
    const User = require("../models/User");
    const user = await User.findById(req.user.id).select("-password -passwordResetTokenHash -passwordResetExpiresAt");
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json({ user });
  } catch (err) {
    console.error("GET SELLER SETTINGS ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});

// =====================================
// UPDATE SELLER PROFILE/SETTINGS
// PUT /api/seller/settings
// =====================================
router.put("/settings", verifyToken, isSeller, async (req, res) => {
  try {
    const User = require("../models/User");
    const { name, phone, address, email } = req.body;

    const updateData = {};
    if (name !== undefined) updateData.name = name;
    if (phone !== undefined) updateData.phone = phone;
    if (address !== undefined) updateData.address = address;
    if (email !== undefined) updateData.email = email;

    const user = await User.findByIdAndUpdate(req.user.id, updateData, {
      new: true,
      runValidators: true,
    }).select("-password -passwordResetTokenHash -passwordResetExpiresAt");

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({ message: "Settings updated successfully", user });
  } catch (err) {
    console.error("UPDATE SELLER SETTINGS ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;