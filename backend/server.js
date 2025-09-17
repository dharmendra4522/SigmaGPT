import express from "express";
import cors from "cors";
import fetch from "node-fetch"; // agar Node <18 hai
import dotenv from "dotenv";
import mongoose from "mongoose";
import chatRoutes from "./routes/chat.js"

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;

app.use(express.json());
app.use(cors());

app.use("/api", chatRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  connectDB();
});


const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("connected with database!");

  } catch (err) {
    console.log("Failed to connect with DB", err);
  }
}

