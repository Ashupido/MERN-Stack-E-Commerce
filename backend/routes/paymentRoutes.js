const express = require("express");
const axios = require("axios");

const Order = require("../models/Order");
const Cart = require("../models/Cart");
const Product = require("../models/Product");

const verifyToken = require("../middleware/authMiddleware");

const router = express.Router();


// =====================================
// PROCESS SUCCESSFUL PAYMENT
// =====================================
const processSuccessfulPayment = async (order, paymentData) => {

  // Prevent duplicate processing
  if (order.paymentStatus === "paid") {
    return order;
  }


  // Reduce stock
  for (const item of order.items) {

    const updatedProduct = await Product.findOneAndUpdate(
      {
        _id: item.product,
        stock: { $gte: item.quantity }
      },
      {
        $inc: {
          stock: -item.quantity,
          soldCount: item.quantity
        }
      },
      {
        new: true
      }
    );


    if (!updatedProduct) {
      throw new Error(
        "Product stock is not available"
      );
    }
  }


  // Update order
  order.paymentStatus = "paid";
  order.status = "confirmed";
  order.transactionId = paymentData.reference;


  await order.save();


  // Clear cart
  await Cart.findOneAndDelete({
    user: order.user
  });


  return order;
};




// =====================================
// INITIALIZE CHAPA PAYMENT
// =====================================

router.post(
  "/initialize",
  verifyToken,
  async (req, res) => {

    try {


      console.log("PAYMENT BODY:", req.body);
      console.log("USER:", req.user);



      const { orderId } = req.body;


      if (!orderId) {

        return res.status(400).json({
          message: "Order ID required"
        });

      }



      const order = await Order.findById(orderId);



      if (!order) {

        return res.status(404).json({
          message: "Order not found"
        });

      }




      // check ownership

      if (
        order.user.toString() !== req.user.id
      ) {

        return res.status(403).json({
          message: "You cannot pay this order"
        });

      }




      if (order.totalAmount <= 0) {

        return res.status(400).json({
          message: "Invalid amount"
        });

      }




      const tx_ref =
        `order-${order._id}`;



      const chapaResponse =
        await axios.post(

          "https://api.chapa.co/v1/transaction/initialize",

          {

            amount:
              order.totalAmount,


            currency: "ETB",


            email:
              req.user.email || "customer@gmail.com",


            first_name:
              "Customer",


            last_name:
              "User",


            tx_ref,


            callback_url:
              `${process.env.BACKEND_URL}/api/payment/webhook`,


            return_url:
              `${process.env.FRONTEND_URL}/payment-success?tx_ref=${tx_ref}`

          },


          {

            headers: {

              Authorization:
                `Bearer ${process.env.CHAPA_SECRET_KEY.trim()}`,

              "Content-Type":
                "application/json"

            }

          }


        );



      console.log(
        "CHAPA RESPONSE:",
        chapaResponse.data
      );



      res.json({

        success: true,

        checkout_url:
          chapaResponse.data.data.checkout_url,


        tx_ref

      });




    } catch (error) {


      console.log(
        "PAYMENT INITIALIZE ERROR:",
        error.response?.data ||
        error.message
      );



      res.status(500).json({

        message:
          "Payment initialization failed",

        error:
          error.response?.data ||
          error.message

      });


    }


  });




// =====================================
// CHAPA WEBHOOK
// =====================================


router.post(
  "/webhook",
  async (req, res) => {


    try {


      console.log(
        "CHAPA WEBHOOK:",
        req.body
      );



      const tx_ref =
        req.body.tx_ref;



      if (!tx_ref) {

        return res.sendStatus(400);

      }




      const response =
        await axios.get(

          `https://api.chapa.co/v1/transaction/verify/${tx_ref}`,

          {

            headers: {

              Authorization:
                `Bearer ${process.env.CHAPA_SECRET_KEY.trim()}`

            }

          }

        );



      const paymentData =
        response.data.data;



      if (
        paymentData.status === "success"
      ) {


        const orderId =
          tx_ref.replace(
            "order-",
            ""
          );



        const order =
          await Order.findById(orderId);



        if (!order) {

          return res.sendStatus(404);

        }



        await processSuccessfulPayment(
          order,
          paymentData
        );



      }



      res.sendStatus(200);



    } catch (error) {


      console.log(
        "WEBHOOK ERROR:",
        error.message
      );


      res.sendStatus(500);


    }


  });




// =====================================
// VERIFY PAYMENT MANUALLY
// =====================================


router.get(
  "/verify/:tx_ref",
  verifyToken,
  async (req, res) => {


    try {


      const tx_ref =
        req.params.tx_ref;



      const response =
        await axios.get(

          `https://api.chapa.co/v1/transaction/verify/${tx_ref}`,

          {

            headers: {

              Authorization:
                `Bearer ${process.env.CHAPA_SECRET_KEY.trim()}`

            }

          }

        );



      const paymentData =
        response.data.data;



      if (
        paymentData.status !== "success"
      ) {

        return res.json({

          message: "Payment not completed",

          status:
            paymentData.status

        });

      }



      const orderId =
        tx_ref.replace(
          "order-",
          ""
        );



      const order =
        await Order.findById(orderId);



      if (!order) {

        return res.status(404).json({

          message: "Order not found"

        });

      }



      const updatedOrder =
        await processSuccessfulPayment(
          order,
          paymentData
        );



      res.json({

        message:
          "Payment verified successfully",

        order:
          updatedOrder

      });




    } catch (error) {


      res.status(500).json({

        message: "Verification failed",

        error:
          error.response?.data ||
          error.message

      });


    }


  });



module.exports = router;