const express = require("express");
const Product = require("../models/Product");
const fs = require("fs");
const path = require("path");

const upload = require("../middleware/uploadMiddleware");
const verifyToken = require("../middleware/authMiddleware");
const isAdmin = require("../middleware/adminMiddleware");

const router = express.Router();


// CREATE PRODUCT (ADMIN ONLY)
router.post(
  "/",
  verifyToken,
  isAdmin,
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
        sku
      } = req.body;

      // Ensure required fields are present
      if (!name || !price || !description || !category) {
        return res.status(400).json({ error: "Missing required product fields" });
      }

      // Convert numeric fields; treat empty strings as undefined
      const parsedPrice = Number(price);
      const parsedDiscount = discountPrice ? Number(discountPrice) : undefined;
      const parsedStock = stock !== undefined && stock !== "" ? Number(stock) : undefined;

      // Create a new product. If an image file is uploaded, store its filename; otherwise, start with an empty images array.
      const product = new Product({
        name,
        price: parsedPrice,
        discountPrice: parsedDiscount,
        description,
        category,
        brand,
        stock: parsedStock,
        sku,
        images: req.file
          ? [`/uploads/${req.file.filename}`]
          : [],
        // Associate the product with the logged-in user (seller or admin)
        seller: req.user.id,
        createdBy: req.user.id
      });

      await product.save();
      res.status(201).json(product); // Return the created product directly with 201 status
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);


// GET PRODUCTS WITH SEARCH + CATEGORY + PAGINATION
router.get("/", async (req, res) => {

  try {

    const { search, category, page, limit, sort } = req.query; // Remove defaults here


    let filter = {};


    // Search
    if (search) {

      filter.$or = [
        {
          name: {
            $regex: search,
            $options: "i"
          }
        },
        {
          description: {
            $regex: search,
            $options: "i"
          }
        }
      ];

    }


    // Category filter
    if (category) {

      filter.category = category;

    }


    // Pagination calculation
    // Parse page and limit, providing defaults if they are not supplied.
    const pageNum = Number(page) || 1;
    const limitNum = parseInt(limit, 10) || 10;
    const skip = (pageNum - 1) * limitNum;


    let sortOption = {};


    // Price low to high
    if (sort === "price_asc") {

      sortOption.price = 1;

    }


    // Price high to low
    else if (sort === "price_desc") {

      sortOption.price = -1;

    }


    // Newest products first
    else if (sort === "newest") {

      sortOption.createdAt = -1;

    }


    const products = await Product.find(filter)
      .sort(sortOption)
      .skip(skip)
      .limit(limitNum);
    const totalProducts = await Product.countDocuments(filter);


    res.json({

      totalProducts,

      currentPage: pageNum,

      totalPages: Math.ceil(totalProducts / limitNum) || 1, // Ensure totalPages is at least 1

      products

    });


  } catch (err) {

    res.status(500).json({
      error: err.message
    });

  }

});


// GET SINGLE PRODUCT BY ID
router.get("/:id", async (req, res) => {

  try {

    const product = await Product.findById(req.params.id);


    if (!product) {

      return res.status(404).json({
        error: "Product not found"
      });

    }


    res.json(product);

  } catch (err) {

    if (err.kind === 'ObjectId') {

      return res.status(404).json({
        error: "Product not found"
      });

    }


    res.status(500).json({
      error: err.message
    });

  }

});
// UPDATE PRODUCT (ADMIN ONLY)
router.put("/:id", verifyToken, isAdmin, upload.single("image"), async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const oldImage = product.images?.[0];

    // Build update payload with proper type handling
    const updateData = {};
    const fields = ["name", "price", "discountPrice", "description", "category", "brand", "stock", "sku"];
    fields.forEach((field) => {
      if (req.body[field] !== undefined && req.body[field] !== "") {
        if (["price", "discountPrice", "stock"].includes(field)) {
          updateData[field] = Number(req.body[field]);
        } else {
          updateData[field] = req.body[field];
        }
      }
    });

    // If a new image file is provided, replace the existing image and delete the old file.
    // If no image is uploaded, the existing images array remains unchanged.
    if (req.file) {
      updateData.images = [
        `/uploads/${req.file.filename}`
      ];
      if (oldImage) {
        const oldImagePath = path.join(__dirname, "../uploads", oldImage);
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }
    }

    const updatedProduct = await Product.findByIdAndUpdate(req.params.id, updateData, { new: true });
    res.json(updatedProduct); // Return the updated product directly
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
// DELETE PRODUCT (ADMIN ONLY)
// DELETE PRODUCT (ADMIN ONLY)
router.delete("/:id", verifyToken, isAdmin, async (req, res) => {

  try {

    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        message: "Product not found"
      });
    }


    // Delete image file
    if (product.images && product.images.length > 0) {
      const imagePath = path.join(__dirname, "..", product.images[0]);

      console.log("Deleting image:", imagePath);


      if (fs.existsSync(imagePath)) {

        fs.unlinkSync(imagePath);

        console.log("Image deleted successfully");

      } else {

        console.log("Image not found in uploads folder");

      }

    }


    // Delete product from database
    await Product.findByIdAndDelete(req.params.id);


    res.json({
      message: "Product and image deleted successfully"
    });


  } catch (err) {

    res.status(500).json({
      error: err.message
    });

  }

});

module.exports = router;