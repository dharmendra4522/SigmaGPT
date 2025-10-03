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

app.use(express.json());
// app.use(cors());
app.use(cors({
    origin: [
        'http://localhost:5173', // Local development ke liye
        'https://sigma-gpt-three.vercel.app' // Aapka naya live frontend URL
    ],
    credentials: true,
}));
app.use(cookieParser());

app.use('/api/auth', authRoutes);
app.use('/api/chat', protectRoute, chatRoutes);

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected with database!");
  } catch (err) {
    console.log("Failed to connect with DB", err);
  }
};

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  connectDB();
});