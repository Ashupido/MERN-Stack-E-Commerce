const express = require("express");
const router = express.Router();

const Order = require("../models/Order");
const Cart = require("../models/Cart");
const Product = require("../models/Product");

const verifyToken = require("../middleware/authMiddleware");
const isAdmin = require("../middleware/adminMiddleware");


// ===============================
// 🛒 CHECKOUT (USER)
// ===============================
router.post("/checkout", verifyToken, async (req, res) => {
  try {

    console.log("Checkout payload received:", req.body);

    const clientItems = req.body?.items || null;

    let cartItems = [];

    if (clientItems && clientItems.length > 0) {

      cartItems = clientItems.map(item => ({
        productId: item._id || item.product || item.productId,
        quantity: item.quantity
      }));

    } else {

      const cart = await Cart.findOne({
        user: req.user.id
      }).populate("items.product");


      if (!cart || cart.items.length === 0) {

        return res.status(400).json({
          message: "Cart is empty"
        });

      }


      cartItems = cart.items.map(item => ({
        productId: item.product._id,
        quantity: item.quantity
      }));

    }


    let total = 0;
    let orderItems = [];


    for (const item of cartItems) {

      const product =
        await Product.findById(item.productId);


      if (!product) {

        return res.status(404).json({
          message: "Product not found"
        });

      }


      if (product.stock < item.quantity) {

        return res.status(400).json({
          message: `${product.name} has only ${product.stock} items left`
        });

      }


      total += product.price * item.quantity;


      orderItems.push({

        product: product._id,
        name: product.name,
        price: product.price,
        quantity: item.quantity

      });

    }



    const order = new Order({

      user: req.user.id,

      items: orderItems,

      totalAmount: total,

      status: "pending",

      paymentStatus: "pending",

      paymentMethod: "chapa"

    });



    await order.save();



    res.json({

      message: "Order created. Proceed to payment",

      order

    });



  } catch (err) {

    res.status(500).json({
      error: err.message
    });

  }

});




// ===============================
// 📦 GET MY ORDERS (USER)
// KEEP BEFORE /:id
// ===============================

router.get(
  "/my-orders",
  verifyToken,
  async (req, res) => {

    try {


      const orders =
        await Order.find({
          user: req.user.id
        })
          .populate({

            path: "items.product",

            select: "name price images"

          })
          .sort({
            createdAt: -1
          });



      res.json(orders);



    } catch (err) {


      console.log("ORDER ERROR:", err);


      res.status(500).json({

        message: "Failed to get orders",

        error: err.message

      });


    }

  });




// ===============================
// 🚚 UPDATE ORDER TRACKING (ADMIN)
// ===============================

router.put(
  "/update-status/:id",
  verifyToken,
  isAdmin,
  async (req, res) => {

    try {


      const {
        status,
        trackingNumber,
        message
      } = req.body;



      const order =
        await Order.findById(req.params.id);



      if (!order) {

        return res.status(404).json({

          message: "Order not found"

        });

      }



      if (status) {

        order.status = status;

      }



      if (trackingNumber) {

        order.trackingNumber = trackingNumber;

      }



      order.trackingHistory.push({

        status,

        message:
          message || `Order ${status}`

      });



      await order.save();



      res.json({

        message: "Order tracking updated",

        order

      });



    } catch (err) {

      res.status(500).json({

        error: err.message

      });

    }

  });





// ===============================
// 🧑‍💼 GET ALL ORDERS (ADMIN)
// ===============================

router.get(
  "/all",
  verifyToken,
  isAdmin,
  async (req, res) => {

    try {


      const orders =
        await Order.find()
          .populate(
            "user",
            "email"
          )
          .sort({
            createdAt: -1
          });



      res.json(orders);



    } catch (err) {

      res.status(500).json({

        error: err.message

      });

    }

  });





// ===============================
// 🚚 CUSTOMER TRACKING
// ===============================

router.get(
  "/tracking/:id",
  verifyToken,
  async (req, res) => {

    try {


      const order =
        await Order.findOne({

          _id: req.params.id,

          user: req.user.id

        });



      if (!order) {

        return res.status(404).json({

          message: "Order not found"

        });

      }



      res.json({

        orderId: order._id,

        status: order.status,

        trackingNumber: order.trackingNumber,

        history: order.trackingHistory

      });



    } catch (err) {

      res.status(500).json({

        error: err.message

      });

    }

  });





// ===============================
// 🔍 GET SINGLE ORDER
// MUST ALWAYS BE LAST
// ===============================

router.get(
  "/:id",
  verifyToken,
  async (req, res) => {

    try {


      const order =
        await Order.findById(req.params.id)
          .populate(

            "items.product",

            "name price images"

          );



      if (!order) {

        return res.status(404).json({

          message: "Order not found"

        });

      }



      if (order.user.toString() !== req.user.id) {

        return res.status(403).json({

          message: "Unauthorized order access"

        });

      }



      res.json(order);



    } catch (err) {

      res.status(500).json({

        error: err.message

      });

    }

  });





module.exports = router;