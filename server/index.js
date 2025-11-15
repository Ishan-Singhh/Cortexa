import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import jobRoutes from './routes/jobRoutes.js';
import { clerkMiddleware , requireAuth} from '@clerk/express'

// Load environment variables
dotenv.config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(clerkMiddleware())

// API Routes
app.use('/', jobRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Main Backend Server is running on port ${PORT}`);
});