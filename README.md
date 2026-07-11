# GearUp Backend API

A production-ready RESTful backend API for **GearUp**, a sports and outdoor equipment rental platform. The system supports customer, provider, and admin roles with secure authentication, rental management, Stripe payment integration, reviews, and role-based authorization.

## 🌐 Live API

**Production URL**

https://gearup-backend-sage.vercel.app/

---

## 🚀 Features

- JWT Authentication (Access & Refresh Token)
- Cookie & Bearer Token Authentication
- Role-based Authorization
- Customer, Provider & Admin Roles
- Category Management
- Gear Management
- Rental Order Management
- Stripe Checkout Integration
- Stripe Webhook Payment Verification
- Payment History
- Review System
- Global Error Handling
- Zod Request Validation
- Prisma ORM
- PostgreSQL Database (Neon)
- Production Deployment on Vercel

---

## 🛠 Tech Stack

- Node.js
- Express.js
- TypeScript
- Prisma ORM
- PostgreSQL (Neon)
- Stripe
- JWT
- Zod
- Cookie Parser
- CORS
- Vercel

---

## 📂 Project Structure

```
src
│
├── config
├── errors
├── lib
├── middleware
├── modules
│   ├── admin
│   ├── auth
│   ├── category
│   ├── gear
│   ├── payment
│   ├── provider
│   ├── rental
│   └── review
│
├── utils
├── app.ts
└── server.ts
```

---

## ⚙️ Installation

Clone the repository

```bash
git clone <repository-url>
```

Move into the project

```bash
cd gearup-backend
```

Install dependencies

```bash
npm install
```

Create a `.env` file.

Example:

```env
DATABASE_URL=

PORT=5000

APP_URL=http://localhost:3000

JWT_ACCESS_SECRET=
JWT_REFRESH_SECRET=

JWT_ACCESS_EXPIRES_IN=1d
JWT_REFRESH_EXPIRES_IN=7d

BCRYPT_SALT_ROUNDS=10

STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=

ADMIN_EMAIL=
ADMIN_PASSWORD=
```

Generate Prisma Client

```bash
npx prisma generate
```

Run migrations

```bash
npx prisma migrate dev
```

Run the development server

```bash
npm run dev
```

Build

```bash
npm run build
```

Start production server

```bash
npm start
```

---

## 🔑 Authentication

Most protected routes require one of:

```
Authorization: Bearer <access_token>
```

or

```
Cookie:
accessToken=<token>
```

---

## 👥 User Roles

- CUSTOMER
- PROVIDER
- ADMIN

---

## 📌 Main API Modules

### Authentication

- Register
- Login
- Refresh Token
- Get Profile

### Category

- Create Category
- Get Categories
- Update Category
- Delete Category

### Gear

- Create Gear
- Get All Gear
- Get Single Gear
- Update Gear
- Delete Gear

### Rentals

- Create Rental
- Get My Rentals
- Get Single Rental

### Provider

- Get Provider Orders
- Update Rental Status

### Payments

- Create Stripe Checkout Session
- Stripe Webhook
- Confirm Payment
- Payment History
- Payment Details

### Reviews

- Create Review

### Admin

- Dashboard
- User Management
- Rental Management

---

## 💳 Payment Flow

1. Customer creates a rental.
2. Rental status becomes:

```
PLACED
```

3. Customer creates a Stripe Checkout Session.
4. Payment is completed.
5. Stripe Webhook verifies payment.
6. Rental updates automatically:

```
Payment Status:
PAID

Rental Status:
CONFIRMED
```

---

## 📦 Rental Status

```
PLACED
CONFIRMED
PICKED_UP
RETURNED
CANCELLED
```

---

## 💰 Payment Status

```
PENDING
PAID
FAILED
```

---

## 🔗 Deployment

Production

https://gearup-backend-sage.vercel.app/

---

## 📮 API Testing

The API can be tested using:

- Postman
- Thunder Client
- Insomnia

---

## 👨‍💻 Author

**Zayed Utsho**

Email:
zayedutsho@gmail.com

GitHub:
https://github.com/zayedutsho

LinkedIn:
https://linkedin.com/in/zayedutsho
