# Setup Guide

## Prerequisites
- Node.js (v14 or higher)
- MongoDB (local installation or MongoDB Atlas account)
- npm or yarn

## Installation Steps

### 1. Install Dependencies

From the root directory:
```bash
npm install
```

For frontend:
```bash
cd frontend
npm install
cd ..
```

### 2. Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# MongoDB Connection String
MONGO=mongodb://localhost:27017/multi-vendor

# JWT Secret Key (generate a secure random string for production)
JWT_SECRET_KEY=your-super-secret-jwt-key-change-this-in-production

# Stripe Secret Key (get from Stripe dashboard)
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key_here

# Node Environment
NODE_ENV=development
```

**Important Notes:**
- Replace `MONGO` with your actual MongoDB connection string
  - Local: `mongodb://localhost:27017/multi-vendor`
  - Atlas: `mongodb+srv://username:password@cluster.mongodb.net/database`
- Generate a secure `JWT_SECRET_KEY` for production (use: `openssl rand -base64 32`)
- Get your `STRIPE_SECRET_KEY` from https://dashboard.stripe.com/apikeys

### 3. Running the Application

#### Backend Server
From the root directory:
```bash
npm run dev
```
This will start the backend server on `http://localhost:3000` with nodemon (auto-restart on changes).

Or use:
```bash
npm start
```
This runs the server without nodemon.

#### Frontend
Open a new terminal and run:
```bash
cd frontend
npm run dev
```
This will start the frontend on `http://localhost:5173` (Vite default port).

### 4. Verify Installation

- Backend: Visit `http://localhost:3000/test` - should return "Server is running accurately."
- Frontend: Visit `http://localhost:5173` - should show the application

## Troubleshooting

### Backend Issues

1. **MongoDB Connection Error**
   - Ensure MongoDB is running locally, or
   - Verify your MongoDB Atlas connection string is correct
   - Check that the `MONGO` variable in `.env` is set correctly

2. **Port Already in Use**
   - Change the port in `backend/server.js` (line 54) if port 3000 is occupied

3. **Nodemon Not Working**
   - Ensure nodemon is installed: `npm install nodemon`
   - Check `nodemon.json` configuration

### Frontend Issues

1. **Port Conflicts**
   - Vite will automatically use the next available port if 5173 is taken

2. **Dependencies Not Found**
   - Run `npm install` in the `frontend` directory

## Project Structure

```
Multi-Vender-Project/
├── backend/          # Backend server code
│   ├── controllers/  # Route controllers
│   ├── model/       # Database models
│   ├── routes/      # API routes
│   ├── utils/       # Utility functions
│   └── server.js    # Main server file
├── frontend/         # React frontend
├── socket/           # Socket.io server
└── .env              # Environment variables (create this)
```

## API Endpoints

- `GET /test` - Test endpoint
- `POST /api/auth/*` - Authentication routes
- `GET /api/user/*` - User routes
- `GET /api/products/*` - Product routes
- `POST /api/payment/*` - Payment routes
- `GET /api/order/*` - Order routes

