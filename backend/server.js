const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");

console.log("Starting server...");

// Load environment variables
dotenv.config();

const app = express();

/* =========================================================
   CORS
   ========================================================= */

// Temporary: allow all origins while deploying/testing.
// After your frontend is deployed, we can restrict this
// to your live frontend URL.
app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

/* =========================================================
   BODY PARSING
   ========================================================= */

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* =========================================================
   STATIC FILES
   ========================================================= */

// Serve uploaded images
app.use(
  "/uploads",
  express.static(path.join(__dirname, "uploads"))
);

/* =========================================================
   DATABASE
   ========================================================= */

const MONGO_URL =
  process.env.MONGO_URL ||
  "mongodb://127.0.0.1:27017/testdb";

mongoose
  .connect(MONGO_URL)
  .then(() => {
    console.log("MongoDB connected");
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err.message);
  });

/* =========================================================
   ROUTES
   ========================================================= */

// Authentication
const authRoutes = require("./routes/authRoutes");

// Users
const userRoutes = require("./routes/userRoutes");

// Products
const productRoutes = require("./routes/productRoutes");

// Cart
const cartRoutes = require("./routes/cartRoutes");

// Orders
const orderRoutes = require("./routes/orderRoutes");

// Payment
const paymentRoutes = require("./routes/paymentRoutes");

// Admin
const adminDashboardRoutes = require("./routes/adminDashboardRoutes");
const adminRoutes = require("./routes/adminRoutes");
const adminUserRoutes = require("./routes/adminUserRoutes");

// Manager
const managerRoutes = require("./routes/managerRoutes");

// Seller
const sellerRoutes = require("./routes/sellerRoutes");

// Reviews
const reviewRoutes = require("./routes/reviewRoutes");

// Wishlist
const wishlistRoutes = require("./routes/wishlistRoutes");

// Addresses
const addressRoutes = require("./routes/addressRoutes");

/* =========================================================
   API ROUTES
   ========================================================= */

app.use("/api/auth", authRoutes);

app.use("/api/users", userRoutes);

app.use("/api/products", productRoutes);

app.use("/api/cart", cartRoutes);

app.use("/api/orders", orderRoutes);

app.use("/api/payment", paymentRoutes);

app.use(
  "/api/admin/dashboard",
  adminDashboardRoutes
);

app.use(
  "/api/admin/users",
  adminUserRoutes
);

app.use(
  "/api/manager",
  managerRoutes
);

app.use(
  "/api/seller",
  sellerRoutes
);

app.use(
  "/api/reviews",
  reviewRoutes
);

app.use(
  "/api/wishlist",
  wishlistRoutes
);

app.use(
  "/api/addresses",
  addressRoutes
);

app.use(
  "/api/admin",
  adminRoutes
);

/* =========================================================
   HEALTH / TEST ROUTES
   ========================================================= */

// Root route
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Pido E-commerce API is running...",
    environment: process.env.NODE_ENV || "development",
  });
});

// Health check
app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Backend is healthy",
    database:
      mongoose.connection.readyState === 1
        ? "connected"
        : "disconnected",
    timestamp: new Date().toISOString(),
  });
});

/* =========================================================
   404 HANDLER
   ========================================================= */

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`,
  });
});

/* =========================================================
   GLOBAL ERROR HANDLER
   ========================================================= */

app.use((err, req, res, next) => {
  console.error("Server Error:", err);

  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal server error",
  });
});

/* =========================================================
   SERVER
   ========================================================= */

const PORT = process.env.PORT || 5000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || "development"}`);
});