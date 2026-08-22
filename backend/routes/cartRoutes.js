const express = require("express");

const Cart = require("../models/Cart");
const Product = require("../models/Product");
const verifyToken = require("../middleware/authMiddleware");

const router = express.Router();

// =====================================
// ➕ ADD PRODUCT TO CART
// =====================================
router.post("/add", verifyToken, async (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body;

    // ✅ Validate quantity
    if (!productId || quantity <= 0) {
      return res.status(400).json({
        message: "Invalid product or quantity"
      });
    }

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({
        message: "Product not found"
      });
    }

    if (product.stock === 0) {
      return res.status(400).json({
        message: `${product.name} is out of stock`
      });
    }

    let cart = await Cart.findOne({ user: req.user.id });

    if (!cart) {
      cart = new Cart({
        user: req.user.id,
        items: []
      });
    }

    const existingItem = cart.items.find(
      item => item.product.toString() === productId
    );

    if (existingItem) {
      const newQuantity = existingItem.quantity + quantity;

      // 🚨 STOCK VALIDATION
      if (newQuantity > product.stock) {
        return res.status(400).json({
          message: `${product.name} has only ${product.stock} items left`
        });
      }

      existingItem.quantity = newQuantity;

    } else {

      // 🚨 STOCK VALIDATION
      if (quantity > product.stock) {
        return res.status(400).json({
          message: `${product.name} has only ${product.stock} items left`
        });
      }

      cart.items.push({
        product: productId,
        quantity
      });
    }

    await cart.save();
    await cart.populate("items.product");

    res.json({
      message: "Product added to cart",
      cart
    });

  } catch (err) {
    res.status(500).json({
      error: err.message
    });
  }
});

// =====================================
// 📦 GET USER CART
// =====================================
router.get("/", verifyToken, async (req, res) => {
  try {
    const cart = await Cart.findOne({
      user: req.user.id
    }).populate("items.product");

    if (!cart) {
      return res.json({ items: [] });
    }

    res.json(cart);

  } catch (err) {
    res.status(500).json({
      error: err.message
    });
  }
});

// =====================================
// 🔄 UPDATE CART ITEM
// =====================================
router.put("/update", verifyToken, async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    // ✅ Validate
    if (!productId || quantity < 0) {
      return res.status(400).json({
        message: "Invalid product or quantity"
      });
    }

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({
        message: "Product not found"
      });
    }

    const cart = await Cart.findOne({ user: req.user.id });

    if (!cart) {
      return res.status(404).json({
        message: "Cart not found"
      });
    }

    const itemIndex = cart.items.findIndex(
      item => item.product.toString() === productId
    );

    if (itemIndex === -1) {
      return res.status(404).json({
        message: "Product not in cart"
      });
    }

    // ❌ Remove item if quantity = 0
    if (quantity === 0) {
      cart.items.splice(itemIndex, 1);
    } else {

      // 🚨 STOCK VALIDATION
      if (quantity > product.stock) {
        return res.status(400).json({
          message: `${product.name} has only ${product.stock} items left`
        });
      }

      cart.items[itemIndex].quantity = quantity;
    }

    await cart.save();
    await cart.populate("items.product");

    res.json({
      message: "Cart updated",
      cart
    });

  } catch (err) {
    res.status(500).json({
      error: err.message
    });
  }
});

// =====================================
// ❌ REMOVE ITEM FROM CART
// =====================================
router.delete("/remove/:productId", verifyToken, async (req, res) => {
  try {
    const { productId } = req.params;

    const cart = await Cart.findOne({ user: req.user.id });

    if (!cart) {
      return res.status(404).json({
        message: "Cart not found"
      });
    }

    cart.items = cart.items.filter(
      item => item.product.toString() !== productId
    );

    await cart.save();
    await cart.populate("items.product");

    res.json({
      message: "Item removed from cart",
      cart
    });

  } catch (err) {
    res.status(500).json({
      error: err.message
    });
  }
});

// =====================================
// 🧹 CLEAR CART
// =====================================
router.delete("/clear", verifyToken, async (req, res) => {
  try {
    await Cart.findOneAndDelete({ user: req.user.id });

    res.json({
      message: "Cart cleared"
    });

  } catch (err) {
    res.status(500).json({
      error: err.message
    });
  }
});

module.exports = router;