import mongoose from "mongoose";

const MessageSchema = new mongoose.Schema({
    role: {
        type: String,
        enum: ["user", "assistant"],
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    createdAt: { // Iska naam 'createdAt' aacha hai
        type: Date,
        default: Date.now,
    },
});

const ThreadSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    threadId: {
        type: String,
        required: true,
        unique: true,
    },
    title: {
        type: String,
        default: "New Chat",
    },
    messages: [MessageSchema],
    
    // Yahan se manual 'createdAt' field hata diya gaya hai

}, { timestamps: true }); // Yeh option apne aap createdAt aur updatedAt bana dega

export default mongoose.model("Thread", ThreadSchema);