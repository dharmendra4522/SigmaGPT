import Thread from '../models/Thread.js';
import { v4 as uuidv4 } from 'uuid';
// --- YEH ZAROORI IMPORT MISSING THA ---
import getOpenAPIResponseStream from '../utils/openai.js';
// ------------------------------------

// --- Function 1: Get all chats for a user ---
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

// --- Function 2: Get all messages for a specific chat ---
export const getChatMessagesById = async (req, res) => {
    try {
        const { id: threadId } = req.params;
        const userId = req.user._id;
        const chat = await Thread.findOne({ threadId, userId });
        if (!chat) {
            return res.status(404).json({ error: "Chat not found or you don't have permission." });
        }
        res.status(200).json(chat);
    } catch (error) {
        console.error("Error in getChatMessagesById:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

// --- Function 3: Start or continue a chat and stream the response ---
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

        res.setHeader('Content-Type', 'text/event-stream');
        res.setHeader('Cache-Control', 'no-cache');
        res.setHeader('Connection', 'keep-alive');
        res.flushHeaders();

        // --- YEH NAYI LINE HAI ---
        // Stream shuru hote hi frontend ko official threadId bhej do
        res.write(`data: ${JSON.stringify({ threadId: currentThread.threadId })}\n\n`);
        // -------------------------

        const openAIResponse = await getOpenAPIResponseStream(currentThread.messages);
        
        let fullResponse = "";
        for await (const chunk of openAIResponse.body) {
            const lines = chunk.toString().split('\n').filter(line => line.trim() !== '');

            for (const line of lines) {
                if (line.startsWith('data: ')) {
                    const data = line.substring(6);
                    if (data === '[DONE]') break;
                    
                    try {
                        const parsed = JSON.parse(data);
                        const content = parsed.choices[0]?.delta?.content || "";
                        if (content) {
                            fullResponse += content;
                            res.write(`data: ${JSON.stringify({ content })}\n\n`);
                        }
                    } catch (error) {
                        // Ignore errors
                    }
                }
            }
        }

        if (fullResponse) {
            currentThread.messages.push({ role: 'assistant', content: fullResponse });
            await currentThread.save();
        }
        
        res.write('data: [DONE]\n\n');
        res.end();

    } catch (error) {
        console.error("Error in startOrContinueChat streaming:", error);
        res.end(); 
    }
};

// --- Function 4: Delete a chat ---
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
};




// export const startOrContinueChat = async (req, res) => {
//     try {
//         const { message, threadId } = req.body;
//         const userId = req.user._id;
//         if (!message) {
//             return res.status(400).json({ error: "Message is required." });
//         }
//         let currentThread;
//         if (threadId) {
//             currentThread = await Thread.findOne({ threadId, userId });
//             if (!currentThread) {
//                  return res.status(404).json({ error: "Chat not found." });
//             }
//         } else {
//             currentThread = new Thread({
//                 userId,
//                 threadId: uuidv4(),
//                 title: message.substring(0, 30),
//                 messages: []
//             });
//         }
//         currentThread.messages.push({ role: 'user', content: message });
//         const aiResponseContent = await getOpenAPIResponse(currentThread.messages);
//         currentThread.messages.push({ role: 'assistant', content: aiResponseContent });
//         await currentThread.save();
//         res.status(200).json({ response: aiResponseContent, threadId: currentThread.threadId });
//     } catch (error) {
//         console.error("Error in startOrContinueChat:", error);
//         res.status(500).json({ error: "Internal Server Error" });
//     }
// };

// export const deleteChatById = async (req, res) => {
//     try {
//         const { id: threadId } = req.params;
//         const userId = req.user._id;
//         const result = await Thread.deleteOne({ threadId, userId });
//         if (result.deletedCount === 0) {
//             return res.status(404).json({ error: "Chat not found." });
//         }
//         res.status(200).json({ message: "Chat deleted successfully." });
//     } catch (error) {
//         console.error("Error in deleteChatById:", error);
//         res.status(500).json({ error: "Internal Server Error" });
//     }
// }