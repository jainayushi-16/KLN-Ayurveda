# KLN Ayurveda Backend API

Production-ready modular RESTful API server built with **Node.js**, **Express.js**, **PostgreSQL**, and **Prisma ORM** supporting all KLN Ayurveda e-commerce frontend features.

## Architecture

```
backend/
├── prisma/
│   ├── schema.prisma (22 Models, Enums, Indexes, Cascade Deletes)
│   └── seed.js (Admin User, Products, Categories, FAQs seed)
├── src/
│   ├── config/ (env, prisma, logger, cloudinary, nodemailer)
│   ├── middleware/ (auth, role, error, validate, rateLimiter, upload)
│   ├── modules/ (13 Modular Services: auth, users, products, categories, cart, wishlist, orders, reviews, blogs, contact, newsletter, faqs, admin)
│   ├── routes/ (v1.js central API router)
│   ├── utils/ (apiResponse, apiError, jwt, password, asyncHandler)
│   ├── app.js
│   └── server.js
└── postman_collection.json
```

## Modular Architecture Standard

Every module inside `src/modules/<module-name>/` strictly implements:
- `controller.js` - HTTP Request / Response handling
- `service.js` - Business logic
- `repository.js` - Database data access using Prisma Client
- `routes.js` - Express Endpoint mapping
- `validation.js` - Zod Request Validation schemas
- `dto.js` - Data Transfer Objects for clean JSON formatting

## Setup & Running Locally

1. **Install Dependencies**:
   ```bash
   cd backend
   npm install
   ```

2. **Configure Environment Variables**:
   Copy `.env.example` to `.env` and set your PostgreSQL credentials:
   ```bash
   cp .env.example .env
   ```

3. **Prisma DB Migration & Seed**:
   ```bash
   npm run prisma:generate
   npm run prisma:migrate
   npm run prisma:seed
   ```

4. **Start Development Server**:
   ```bash
   npm run dev
   ```
   The API will start at `http://localhost:5000/api/v1`.

## API Endpoints Overview

- `POST /api/v1/auth/register` - User Registration
- `POST /api/v1/auth/login` - User Login (returns JWT Access & HTTP-only Refresh cookie)
- `GET /api/v1/products` - Filtered, Paginated, Sorted Product List
- `GET /api/v1/products/:id` - Detailed Product Info & Reviews
- `GET /api/v1/cart` - User Shopping Cart & Order Breakdown
- `POST /api/v1/cart/items` - Add Item to Cart
- `GET /api/v1/wishlist` - User Wishlist
- `POST /api/v1/orders` - Checkout & Place Order
- `GET /api/v1/orders/track/:orderNumber` - Order Status Tracking
- `POST /api/v1/contact` - Submit Contact Form
- `POST /api/v1/newsletter/subscribe` - Newsletter Subscription
- `GET /api/v1/admin/dashboard` - Admin Dashboard Stats (Admin role required)

## Response Standard

Every response follows the unified contract:
```json
{
  "success": true,
  "message": "Operation successful",
  "data": { ... },
  "pagination": null,
  "errors": null
}
```
