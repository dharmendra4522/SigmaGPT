import Thread from '../models/Thread.js';
import { v4 as uuidv4 } from 'uuid';
import getOpenAPIResponse from '../utils/openai.js';

export const getAllUserChats = async (req, res) => {
    try {
        const userId = req.user._id;
        const chats = await Thread.find({ userId }).select("title threadId").sort({ createdAt: -1 });
        res.status(200).json(chats);
    } catch (error) {
        console.error("Error in getAllUserChats:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

// export const getChatMessagesById = async (req, res) => {
//     try {
//         const { id: threadId } = req.params;
//         const userId = req.user._id;
//         const chat = await Thread.findOne({ threadId, userId });
//         if (!chat) {
//             return res.status(404).json({ error: "Chat not found or you don't have permission." });
//         }
//         res.status(200).json(chat);
//     } catch (error) {
//         console.error("Error in getChatMessagesById:", error);
//         res.status(500).json({ error: "Internal Server Error" });
//     }
// };

export const getChatMessagesById = async (req, res) => {
    console.log("--- 1. GET CHAT BY ID function hit! ---");
    try {
        const { id: threadId } = req.params;
        const userId = req.user._id;
        console.log(`--- 2. Fetching single chat with threadId: ${threadId} for userId: ${userId}`);

        const chat = await Thread.findOne({ threadId, userId });

        if (!chat) {
            console.log("--- 3. Chat not found in DB. Sending 404 response.");
            return res.status(404).json({ error: "Chat not found or you don't have permission." });
        }

        console.log("--- 3. Found chat in DB:", chat.threadId);
        console.log("--- 4. Preparing to send response...");

        res.status(200).json(chat);

        console.log("--- 5. SUCCESS: Response sent from getChatMessagesById! ---");

    } catch (error) {
        console.error("!!!!!!!!!! ERROR in getChatMessagesById !!!!!!!!!!", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

export const startOrContinueChat = async (req, res) => {
    try {
        const { message, threadId } = req.body;
        const userId = req.user._id;
        if (!message) {
            return res.status(400).json({ error: "Message is required." });
        }
        let currentThread;
        if (threadId) {
            currentThread = await Thread.findOne({ threadId, userId });
            if (!currentThread) {
                 return res.status(404).json({ error: "Chat not found." });
            }
        } else {
            currentThread = new Thread({
                userId,
                threadId: uuidv4(),
                title: message.substring(0, 30),
                messages: []
            });
        }
        currentThread.messages.push({ role: 'user', content: message });
        const aiResponseContent = await getOpenAPIResponse(currentThread.messages);
        currentThread.messages.push({ role: 'assistant', content: aiResponseContent });
        await currentThread.save();
        res.status(200).json({ response: aiResponseContent, threadId: currentThread.threadId });
    } catch (error) {
        console.error("Error in startOrContinueChat:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

export const deleteChatById = async (req, res) => {
    try {
        const { id: threadId } = req.params;
        const userId = req.user._id;
        const result = await Thread.deleteOne({ threadId, userId });
        if (result.deletedCount === 0) {
            return res.status(404).json({ error: "Chat not found." });
        }
        res.status(200).json({ message: "Chat deleted successfully." });
    } catch (error) {
        console.error("Error in deleteChatById:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}