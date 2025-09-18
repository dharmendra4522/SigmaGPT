import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    username: { 
        type: String, 
        required: true, 
        unique: true,
        index: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        index: true
    },
    password: { type: String, required: true }
    
}, { timestamps: true }); // <-- Yeh add karna recommended hai

export default mongoose.model('User', userSchema);