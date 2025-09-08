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


// app.post("/test", async (req, res) => {
//   const options = {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//       "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
//     },
//     body: JSON.stringify({
//       model: "gpt-4o-mini",
//       messages: [{
//         role: "user",
//         content: req.body.message
//       }],
//     }),
//   };

//   try {
//     const response = await fetch("https://api.openai.com/v1/chat/completions", options);
//     const data = await response.json();
//     // console.log(data.choices[0].message.content); //reply
//     res.json(data);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: "Something went wrong" });
//   }
// });




























// // Load environment variables
// dotenv.config();

// const client = new OpenAI({
//   apiKey: process.env.OPENAI_API_KEY,
// });

// const response = await client.chat.completions.create({
//   model: 'gpt-4o-mini',
//   messages: [
//     {
//       role: 'user',
//       content: 'Tell me a joke related to Computer Science'
//     }
//   ],
// });

// console.log(response.choices[0].message.content);