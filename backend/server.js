import mongoose from 'mongoose';
import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import authRoutes from './routes/auth.route.js';
import userRoutes from './routes/user.route.js';
import productRoutes from './routes/products.route.js';
import paymentRoutes from './routes/payments.route.js';
import orderRoutes from './routes/orders.routes.js';
import cors from 'cors';


dotenv.config();

const app = express();

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
}));


if (process.env.NODE_ENV !== "PRODUCTION") {
  dotenv.config();
}

process.on("uncaughtException", (err) => {
  console.log(`Error: ${err.message}`);
  console.log(`shutting down the server for handling uncaught exception`);
});


mongoose.connect(process.env.MONGO)
  .then(() => console.log('Connected to MongoDB!'))
  .catch((err) => {
    console.log('MongoDB connection error:', err);
    process.exit(1);
  });


app.use(express.json());
app.use(cookieParser());

app.use('/test', (req, res) => {
  res.send('Server is running accurately.');
})

app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/order', orderRoutes);

const server = app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});

process.on("unhandledRejection", (err) => {
  console.log(`Shutting down the server for ${err.message}`);
  console.log(`shutting down the server for unhandle promise rejection`);

  server.close(() => {
    process.exit(1);
  });
});