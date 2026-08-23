# Pido Ecommerce

Pido is a full-stack MERN ecommerce application with customer shopping, cart and checkout flows, Chapa payments, wishlists, product reviews, and separate Admin, Manager, and Seller areas.

## Stack

- Frontend: React 19, Vite, React Router, Tailwind CSS, Axios, Lucide React
- Backend: Node.js, Express, MongoDB, Mongoose, JWT, bcryptjs
- Services: Cloudinary for product images and Chapa for payments

## Features

### Customers

- Register and sign in with JWT authentication
- Browse, search, filter, and view products
- Add products to a cart and check out
- Pay through Chapa and view order history
- Add and remove wishlist products
- Update profile information and password
- Switch between ETB and USD in product details and wishlist
- Responsive desktop, tablet, and mobile navigation

### Staff

- Admin dashboard, product management, order management, user management, reports, and logs
- Manager dashboard with protected manager routes
- Seller dashboard and product management
- Role-based route protection for Admin, Manager, Seller, and Customer accounts

## Project Structure

```text
.
├── backend/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── seedProducts.js
│   ├── server.js
│   └── package.json
├── frontend/
│   ├── public/_redirects
│   ├── src/components/
│   ├── src/context/
│   ├── src/pages/
│   ├── src/routes/
│   ├── src/services/
│   ├── src/utils/
│   └── package.json
└── README.md
```

## Local Setup

### Backend

```bash
cd backend
npm install
npm run dev
```

The backend runs on `http://localhost:5000` unless `PORT` is configured.

Create `backend/.env` with:

```env
PORT=5000
MONGO_URL=mongodb://127.0.0.1:27017/pido_ecommerce
JWT_SECRET=replace_with_a_long_random_secret
CHAPA_SECRET_KEY=replace_with_your_chapa_secret
CHAPA_WEBHOOK_SECRET_HASH=replace_with_your_webhook_secret
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
FRONTEND_URL=http://localhost:5173
BACKEND_URL=http://localhost:5000
```

### Frontend

In a second terminal:

```bash
cd frontend
npm install
npm run dev
```

The frontend runs at `http://localhost:5173`.

Create `frontend/.env` with:

```env
VITE_API_URL=http://localhost:5000/api
```

## Production Configuration

The deployed frontend uses:

```env
VITE_API_URL=https://pido-backend.onrender.com/api
```

Configure these variables on the backend hosting service:

```env
MONGO_URL=your_mongodb_atlas_connection
JWT_SECRET=your_jwt_secret
CHAPA_SECRET_KEY=your_chapa_secret
CHAPA_WEBHOOK_SECRET_HASH=your_webhook_secret
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
FRONTEND_URL=https://pido-ecommerce.netlify.app
BACKEND_URL=https://pido-backend.onrender.com
```

Live application: <https://pido-ecommerce.netlify.app>

Backend health check: <https://pido-backend.onrender.com/api/health>

## Product Images

Product images are uploaded directly to Cloudinary through the backend. MongoDB stores the resulting Cloudinary HTTPS URL in the product `images` array. The application does not rely on the backend local filesystem for permanent product images.

Required upload field: `image`.

## Currency

ETB is the default customer-facing currency. USD conversion uses:

```text
1 USD = 161.92 ETB
USD amount = ETB amount / 161.92
```

The currency selector affects product detail and wishlist prices. Main product listings, cart, orders, and admin reports retain their base ETB display.

## Important Routes

Customer routes:

```text
/              Product listing
/products      Product listing
/product/:id   Product details
/cart          Cart
/checkout      Checkout
/wishlist      Protected wishlist
/orders        Protected order history
/profile       Protected profile
/login         Login
/register      Registration
```

Staff route areas:

```text
/admin/*
/manager/*
/seller/*
```

## API Areas

- `/api/auth` for registration and login
- `/api/products` for product browsing and management
- `/api/cart` for cart operations
- `/api/orders` for orders and checkout
- `/api/wishlist` for authenticated wishlist operations
- `/api/payment` for Chapa payment flows
- `/api/admin` for admin operations
- `/api/manager` and `/api/seller` for role-specific operations

## SPA Deployment

Netlify needs the file `frontend/public/_redirects` containing:

```text
/*    /index.html   200
```

This allows direct navigation and refreshes on React Router routes such as `/wishlist` and `/product/:id`.

## Validation

Build the frontend before deployment:

```bash
cd frontend
npm run build
```

Run the frontend lint check with:

```bash
npm run lint
```

## Security Notes

- Never commit `.env` files or production secrets.
- Passwords created through registration and the Admin user-management flow are bcrypt-hashed.
- Existing users created before password hashing was corrected must be assigned a new password by an administrator.
