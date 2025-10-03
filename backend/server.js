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
    'https://sigma-gpt-three.vercel.app' // Your live frontend URL
];

app.use(cors({
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);
        if (allowedOrigins.indexOf(origin) === -1) {
            const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
            return callback(new Error(msg), false);
        }
        return callback(null, true);
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
    // We don't log the full error here in production for security
    console.log("Failed to connect with DB");
  }
};

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  connectDB();
});