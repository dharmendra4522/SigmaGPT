import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const signup = async (req, res) => {
    try {
        const { name, username, email, password } = req.body;
        if (!name || !username || !email || !password) {
            return res.status(400).json({ error: "Please fill all fields." });
        }
        const existingUser = await User.findOne({ $or: [{ username }, { email }] });
        if (existingUser) {
            return res.status(400).json({ error: "Username or email already exists." });
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const newUser = new User({ name, username, email, password: hashedPassword });
        await newUser.save();
        const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET, { expiresIn: '15d' });
        
        // Correct cookie settings for cross-domain deployment
        res.cookie("jwt", token, {
            httpOnly: true,
            maxAge: 15 * 24 * 60 * 60 * 1000,
            sameSite: "none", // Allows cookie to be sent from a different domain
            secure: true,      // Must be true when sameSite is "none"
        });
        
        res.status(201).json({ _id: newUser._id, name: newUser.name, username: newUser.username, email: newUser.email });
    } catch (error) {
        console.error("Error in signup controller:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

export const login = async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(400).json({ error: "Invalid username or password." });
        }
        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if (!isPasswordCorrect) {
            return res.status(400).json({ error: "Invalid username or password." });
        }
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '15d' });
        
        // Correct cookie settings for cross-domain deployment
        res.cookie("jwt", token, {
            httpOnly: true,
            maxAge: 15 * 24 * 60 * 60 * 1000,
            sameSite: "none", // Allows cookie to be sent from a different domain
            secure: true,      // Must be true when sameSite is "none"
        });

        res.status(200).json({ _id: user._id, name: user.name, username: user.username, email: user.email });
    } catch (error) {
        console.error("Error in login controller:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

export const logout = (req, res) => {
    try {
        // Clear the cookie with the same cross-domain settings
        res.cookie("jwt", "", { 
            httpOnly: true,
            expires: new Date(0),
            sameSite: "none",
            secure: true,
        });
        res.status(200).json({ message: "Logged out successfully" });
    } catch (error)
    {
        console.error("Error in logout controller:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

