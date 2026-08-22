const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Product = require("./models/Product");

dotenv.config();


const products = [

  // ================= ELECTRONICS =================
  {
    name: "Wireless Headphones Pro",
    price: 2500,
    discountPrice: 2000,
    category: "Electronics",
    brand: "Sony",
    stock: 50,
    sku: "SONY-WH-001",
    description: "Premium wireless headphones with noise cancellation.",
    images: ["/uploads/headphone.jpg"],
    rating: 4.5,
    status: "active"
  },

  {
    name: "Bluetooth Earbuds",
    price: 1200,
    discountPrice: 1000,
    category: "Electronics",
    brand: "JBL",
    stock: 70,
    sku: "JBL-EB-002",
    description: "Compact earbuds with deep bass sound.",
    images: ["/uploads/earbuds.jpg"],
    rating: 4.2,
    status: "active"
  },

  // ================= MOBILE =================
  {
    name: "iPhone 18",
    price: 50000,
    discountPrice: 47000,
    category: "Mobile",
    brand: "Apple",
    stock: 20,
    sku: "IPH18-001",
    description: "Latest Apple smartphone.",
    images: ["/uploads/iphone.jpg"],
    rating: 4.8,
    status: "active"
  },

  {
    name: "Samsung Galaxy S25",
    price: 42000,
    discountPrice: 40000,
    category: "Mobile",
    brand: "Samsung",
    stock: 25,
    sku: "SAM-S25-002",
    description: "High-end Android smartphone.",
    images: ["/uploads/samsung.jpg"],
    rating: 4.6,
    status: "active"
  },

  // ================= COMPUTERS =================
  {
    name: "Gaming Laptop",
    price: 85000,
    discountPrice: 80000,
    category: "Computer",
    brand: "Dell",
    stock: 15,
    sku: "DELL-GAME-001",
    description: "High performance gaming laptop.",
    images: ["/uploads/laptop.jpg"],
    rating: 4.6,
    status: "active"
  },

  {
    name: "Mechanical Keyboard",
    price: 3000,
    discountPrice: 2500,
    category: "Computer",
    brand: "Logitech",
    stock: 40,
    sku: "LOG-KEY-002",
    description: "RGB mechanical keyboard for gaming.",
    images: ["/uploads/keyboard.jpg"],
    rating: 4.4,
    status: "active"
  },

  // ================= ACCESSORIES =================
  {
    name: "Smart Watch",
    price: 3500,
    discountPrice: 3000,
    category: "Accessories",
    brand: "Samsung",
    stock: 40,
    sku: "SAM-WATCH-001",
    description: "Smart watch with health tracking.",
    images: ["/uploads/watch.jpg"],
    rating: 4.3,
    status: "active"
  },

  {
    name: "Travel Backpack",
    price: 1800,
    discountPrice: 1500,
    category: "Accessories",
    brand: "Nike",
    stock: 60,
    sku: "NIKE-BAG-002",
    description: "Durable backpack for travel and daily use.",
    images: ["/uploads/bag.jpg"],
    rating: 4.2,
    status: "active"
  },

  // ================= FASHION =================
  {
    name: "Men Casual Shirt",
    price: 900,
    discountPrice: 750,
    category: "Fashion",
    brand: "Zara",
    stock: 80,
    sku: "ZARA-SHIRT-001",
    description: "Stylish casual shirt for men.",
    images: ["/uploads/shirt.jpg"],
    rating: 4.1,
    status: "active"
  },

  {
    name: "Running Shoes",
    price: 2200,
    discountPrice: 1900,
    category: "Fashion",
    brand: "Adidas",
    stock: 50,
    sku: "ADI-SHOE-002",
    description: "Comfortable running shoes.",
    images: ["/uploads/shoes.jpg"],
    rating: 4.5,
    status: "active"
  }

];


const seedProducts = async () => {

  try {

    await mongoose.connect(process.env.MONGO_URL);

    console.log("MongoDB connected");


    await Product.deleteMany();

    await Product.insertMany(products);


    console.log("Products inserted successfully");


    process.exit();


  } catch (error) {

    console.log(error);
    process.exit(1);

  }

};


seedProducts();