# Pido Ecommerce Platform

A full-stack MERN ecommerce platform built with **React, Node.js, Express.js, and MongoDB**.
The platform provides a complete online shopping experience with customer features, secure authentication, product management, order processing, and Chapa payment integration.

---

# 🚀 Project Overview

Pido Ecommerce is a scalable ecommerce application designed for online product selling.

The system supports:

* Customer shopping experience
* Secure user authentication
* Product management
* Shopping cart
* Order management
* Online payment verification
* Admin dashboard
* Inventory management

The project follows a professional full-stack architecture separating:

```
Frontend
    |
    |
REST API
    |
    |
Backend
    |
    |
MongoDB Database
```

---

# ✨ Features

## 👤 Customer Features

### Authentication

* User registration
* User login
* JWT authentication
* Protected user routes
* User profile management

### Product Shopping

* Browse products
* Product details page
* Product search
* Category filtering
* Product sorting
* Product pagination
* Product image display

### Shopping Cart

* Add products to cart
* Update quantity
* Remove products
* Stock validation
* Cart persistence

### Checkout & Orders

* Create orders
* View order history
* Order status tracking
* Payment status tracking

### Payment

* Chapa payment gateway integration
* Transaction verification
* Payment callback handling
* Automatic order confirmation
* Cart clearing after successful payment

---

# 👨‍💼 Admin Features

## Admin Dashboard

Admin has a separate dashboard with management tools.

Features:

* Dashboard statistics
* Total users
* Total products
* Total orders
* Revenue tracking

## Product Management

Admin can:

* Create products
* Update products
* Delete products
* Upload product images
* Manage stock
* Manage categories
* Manage pricing

## Inventory Management

* Stock monitoring
* Low stock detection
* Out of stock products
* Inventory value calculation

## Order Management

Admin can:

* View customer orders
* Update order status
* Confirm payments
* Track order progress

## User Management

Admin can:

* View users
* Manage user roles
* Control access permissions

---

# 🛠 Technology Stack

## Frontend

| Technology   | Purpose                 |
| ------------ | ----------------------- |
| React        | User interface          |
| Vite         | Development environment |
| Tailwind CSS | Styling                 |
| Axios        | API communication       |
| React Router | Navigation              |
| Context API  | State management        |

---

## Backend

| Technology | Purpose            |
| ---------- | ------------------ |
| Node.js    | Runtime            |
| Express.js | API framework      |
| MongoDB    | Database           |
| Mongoose   | Database modeling  |
| JWT        | Authentication     |
| bcryptjs   | Password security  |
| Multer     | Image upload       |
| Chapa API  | Payment processing |

---

# 📂 Project Structure

```
Pido-Ecommerce

│
├── frontend
│
│   ├── src
│   │
│   ├── components
│   │   ├── common
│   │   ├── admin
│   │   └── products
│   │
│   ├── pages
│   │   ├── admin
│   │   ├── user
│   │   └── products
│   │
│   ├── services
│   │   ├── api.js
│   │   ├── authService.js
│   │   ├── productService.js
│   │   └── paymentService.js
│   │
│   └── App.jsx
│
│
├── backend
│
│   ├── config
│   │
│   ├── controllers
│   │
│   ├── models
│   │
│   ├── routes
│   │
│   ├── middleware
│   │
│   ├── services
│   │
│   ├── uploads
│   │
│   └── server.js
│
│
├── docs
│
├── .gitignore
│
└── README.md
```

---

# ⚙️ Installation Guide

## 1. Clone Repository

```bash
git clone https://github.com/Ashupido/pido-Ecommerce.git
```

Move into project:

```bash
cd pido-Ecommerce
```

---

# Backend Setup

Go to backend:

```bash
cd backend
```

Install packages:

```bash
npm install
```

Create `.env` file:

```env
PORT=5000

MONGO_URL=mongodb://127.0.0.1:27017/pido_ecommerce

JWT_SECRET=your_secret_key

CHAPA_SECRET_KEY=your_chapa_secret
```

Start backend:

Development:

```bash
npm run dev
```

Production:

```bash
npm start
```

Backend runs:

```
http://localhost:5000
```

---

# Frontend Setup

Go to frontend:

```bash
cd frontend
```

Install packages:

```bash
npm install
```

Create `.env`:

```env
VITE_API_URL=http://localhost:5000/api
```

Start frontend:

```bash
npm run dev
```

Frontend runs:

```
http://localhost:5173
```

---

# 🔐 Authentication Flow

User registration:

```
Frontend
   |
POST /api/auth/register
   |
Backend
   |
MongoDB
```

Login:

```
User Login

      |
      v

JWT Token Generated

      |
      v

Stored in Browser

      |
      v

Protected API Requests
```

---

# 📡 API Documentation

## Authentication

Register:

```
POST /api/auth/register
```

Login:

```
POST /api/auth/login
```

---

# Products

Get products:

```
GET /api/products
```

Create product:

```
POST /api/products
```

Admin only

Update product:

```
PUT /api/products/:id
```

Delete product:

```
DELETE /api/products/:id
```

---

# Cart

Add cart item:

```
POST /api/cart/add
```

Get cart:

```
GET /api/cart
```

Remove item:

```
DELETE /api/cart/:id
```

---

# Orders

Create order:

```
POST /api/orders
```

Get orders:

```
GET /api/orders
```

Update order:

```
PUT /api/orders/:id
```

---

# Payments

Initialize Chapa payment:

```
POST /api/payment/initialize
```

Verify payment:

```
GET /api/payment/verify/:tx_ref
```

---

# 🖼 Image Upload System

Product images are uploaded using Multer.

Flow:

```
Admin Upload Image

        |

Multer

        |

backend/uploads

        |

MongoDB stores:

/uploads/product-image.jpg

        |

Frontend displays:

http://localhost:5000/uploads/product-image.jpg
```

---

# 🔒 Security Features

Implemented:

* JWT authentication
* Password hashing
* Protected routes
* Admin role authorization
* Token validation
* Stock validation
* Payment verification

---

# 📦 Database Collections

MongoDB collections:

```
users

products

orders

carts

payments
```

---

# 🚀 Future Improvements

Planned features:

* Seller dashboard
* Product reviews
* Wishlist
* Email notifications
* Cloudinary image storage
* Advanced analytics
* Mobile application
* Multi-vendor marketplace

---

# Deployment

Recommended:

Frontend:

* Vercel
* Netlify

Backend:

* Render
* Railway

Database:

* MongoDB Atlas

---

# Developer

**Ashenafi Sentayehu**

Full Stack Web Developer

Skills:

* React
* Node.js
* Express
* MongoDB
* Full Stack Development

---

# License

This project is developed for learning and commercial improvement purposes.
