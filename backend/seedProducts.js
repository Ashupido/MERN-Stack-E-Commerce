require("dotenv").config();

const mongoose = require("mongoose");
const Product = require("./models/Product");

const MONGO_URL = process.env.MONGO_URL;

// =========================================================
// PUT YOUR REAL SELLER _id HERE
// MUST BE THE _id FROM MONGODB ATLAS
// Example: "68a123456789012345678901"
// =========================================================
const SELLER_ID = "PUT_YOUR_REAL_24_CHARACTER_SELLER_ID_HERE";

// =========================================================
// PRODUCTS
// Keep your existing 100 products array here.
// =========================================================

const products = [
  // =========================================================
  // YOUR EXISTING 100 PRODUCTS
  // =========================================================

  // Electronics
  {
    name: "Wireless Bluetooth Speaker",
    price: 2500,
    description:
      "Portable Bluetooth speaker with clear sound and strong battery life.",
    category: "Electronics",
    brand: "JBL",
    stock: 25,
    sku: "ELEC-001",
  },

  {
    name: "Wireless Headphones",
    price: 3200,
    description:
      "Comfortable wireless headphones with noise reduction.",
    category: "Electronics",
    brand: "Sony",
    stock: 20,
    sku: "ELEC-002",
  },

  // ---------------------------------------------------------
  // KEEP THE REST OF YOUR PRODUCTS HERE
  // ---------------------------------------------------------
];

async function seedProducts() {
  try {
    console.log("========================================");
    console.log("Connecting to MongoDB...");
    console.log("========================================");

    // -------------------------------------------------------
    // CHECK SELLER ID
    // -------------------------------------------------------

    if (!SELLER_ID || SELLER_ID === "PUT_YOUR_REAL_24_CHARACTER_SELLER_ID_HERE") {
      throw new Error(
        "Please put your real seller MongoDB _id in SELLER_ID."
      );
    }

    // -------------------------------------------------------
    // CHECK OBJECT ID FORMAT
    // -------------------------------------------------------

    if (!mongoose.Types.ObjectId.isValid(SELLER_ID)) {
      throw new Error(
        `Invalid SELLER_ID: ${SELLER_ID}\n` +
        "MongoDB ObjectId must normally contain 24 hexadecimal characters."
      );
    }

    // -------------------------------------------------------
    // CONNECT
    // -------------------------------------------------------

    await mongoose.connect(MONGO_URL);

    console.log("MongoDB connected");

    console.log("========================================");
    console.log("SELLER ID");
    console.log("========================================");
    console.log(SELLER_ID);
    console.log("========================================");

    // -------------------------------------------------------
    // CONVERT STRING TO OBJECTID
    // -------------------------------------------------------

    const sellerObjectId = new mongoose.Types.ObjectId(SELLER_ID);

    // -------------------------------------------------------
    // DELETE OLD PRODUCTS
    // -------------------------------------------------------

    await Product.deleteMany({});

    console.log("Old products removed");

    // -------------------------------------------------------
    // ADD SELLER TO EVERY PRODUCT
    // -------------------------------------------------------

    const productsWithDefaults = products.map((product) => ({
      ...product,

      // IMPORTANT
      // Every product belongs to this seller.
      seller: sellerObjectId,

      // No images
      images: [],

      // Default fields
      status: "active",
      averageRating: 0,
      soldCount: 0,
      ratings: [],

      // No discount
      discountPrice: undefined,
    }));

    // -------------------------------------------------------
    // VALIDATE PRODUCTS
    // -------------------------------------------------------

    if (productsWithDefaults.length === 0) {
      throw new Error("No products found in the products array.");
    }

    // -------------------------------------------------------
    // VALIDATE PRICES
    // -------------------------------------------------------

    const invalidPrices = productsWithDefaults.filter(
      (product) =>
        typeof product.price !== "number" ||
        product.price <= 0 ||
        product.price > 50000
    );

    if (invalidPrices.length > 0) {
      console.error("Invalid products:");

      invalidPrices.forEach((product) => {
        console.error(
          `${product.sku} - ${product.name} - ${product.price} ETB`
        );
      });

      throw new Error(
        "Some products have invalid prices. Maximum price is 50,000 ETB."
      );
    }

    // -------------------------------------------------------
    // VALIDATE SELLER FIELD
    // -------------------------------------------------------

    const productsWithoutSeller = productsWithDefaults.filter(
      (product) => !product.seller
    );

    if (productsWithoutSeller.length > 0) {
      throw new Error(
        `${productsWithoutSeller.length} products do not have a seller.`
      );
    }

    // -------------------------------------------------------
    // INSERT
    // -------------------------------------------------------

    console.log("Inserting products...");

    const insertedProducts = await Product.insertMany(
      productsWithDefaults
    );

    // -------------------------------------------------------
    // RESULTS
    // -------------------------------------------------------

    console.log("========================================");
    console.log("SEED COMPLETED SUCCESSFULLY");
    console.log("========================================");

    console.log(
      `Products inserted: ${insertedProducts.length}`
    );

    console.log(
      `Seller ID: ${SELLER_ID}`
    );

    console.log("Images: None");

    console.log("Maximum price: 50,000 ETB");

    // -------------------------------------------------------
    // CATEGORY SUMMARY
    // -------------------------------------------------------

    const categoryCounts = {};

    insertedProducts.forEach((product) => {
      if (!categoryCounts[product.category]) {
        categoryCounts[product.category] = 0;
      }

      categoryCounts[product.category]++;
    });

    console.log("========================================");
    console.log("CATEGORY SUMMARY");
    console.log("========================================");

    Object.entries(categoryCounts).forEach(
      ([category, count]) => {
        console.log(`${category}: ${count}`);
      }
    );

    console.log("========================================");

    // -------------------------------------------------------
    // PRICE SUMMARY
    // -------------------------------------------------------

    const prices = insertedProducts.map(
      (product) => product.price
    );

    const maximumPrice = Math.max(...prices);
    const minimumPrice = Math.min(...prices);

    console.log(
      "Minimum price:",
      minimumPrice.toLocaleString(),
      "ETB"
    );

    console.log(
      "Maximum price:",
      maximumPrice.toLocaleString(),
      "ETB"
    );

    // -------------------------------------------------------
    // DISCONNECT
    // -------------------------------------------------------

    await mongoose.disconnect();

    console.log("MongoDB connection closed");
    console.log("========================================");

    process.exit(0);
  } catch (error) {
    console.error("========================================");
    console.error("SEED ERROR:");
    console.error(error.message);
    console.error("========================================");

    try {
      await mongoose.disconnect();
    } catch (disconnectError) {
      console.error(
        "Disconnect error:",
        disconnectError.message
      );
    }

    process.exit(1);
  }
}

seedProducts();