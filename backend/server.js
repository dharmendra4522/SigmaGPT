import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cookieParser from 'cookie-parser';

import authRoutes from './routes/auth.js';
import chatRoutes from "./routes/chat.js";
import protectRoute from './middleware/protectRoute.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;

// --- CORS Configuration ---
const allowedOrigins = [
    'http://localhost:5173', // For local development
    'https://sigma-gpt-three.vercel.app', // Your main Vercel URL
    'https://sigma-cd1vr1694-dharmendra4522s-projects.vercel.app' // The specific deployment URL from the error
];

app.use(cors({
    origin: function (origin, callback) {
        // Allow requests with no origin (like Postman) or from our allowed list
        if (!origin || allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
}));
// -------------------------

app.use(express.json());
app.use(cookieParser());

app.use('/api/auth', authRoutes);
app.use('/api/chat', protectRoute, chatRoutes);

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected with database!");
  } catch (err) {
    console.log("Failed to connect with DB");
  }
};

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  connectDB();
});