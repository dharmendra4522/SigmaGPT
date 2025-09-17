import express from "express";
import Thread from "../models/Thread.js"; // ✅ include extension
import { error } from "console";
import getOpenAIAPIResponse from "../utils/openai.js"


const router = express.Router();

// test route
router.post("/test", async (req, res) => {
  try {
    const thread = new Thread({
      threadId: "abc",
      title: "Testing New Thread2"
    });

    const response = await thread.save();
    res.send(response);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to save in DB" });
  }
});


//Get all threads
router.get("/thread", async(req, res) =>{
    try {
        const threads = await Thread.find({}).sort({updatedAt:-1})
        res.json(threads);
    } catch (error) {
        console.log(err);
        res.status(500).json({error:"Failed to save in thread"});
    }
});


router.get("/thread/:threadId", async(req, res) =>{
    const {threadId} = req.params;

    try {
        const thread = await Thread.findOne({threadId});
        if(!thread){
            res.status(404).json({error: "Thread Not found"});
        }

        res.json(thread.messages);
    } catch (error) {
        console.log(error);
        res.status(500).json({error: "Faild to fatch chat"})
    }
})


router.delete("/thread/:threadId", async(req, res) =>{
    const {threadId} = req.params;

    try {
        const deleteThread = await Thread.findOneAndDelete({threadId});
        if(!deleteThread){
            res.status(404).json({error: "Thread Not found"});
        }

        res.status(404).json({success: "Thread deleted successfully"});
    } catch (error) {
        console.log(error);
        res.status(500).json({error: "Faild to fatch chat"})
    }
});


router.post("/chat", async (req, res) => {
    const { threadId, message } = req.body; // Use 'message' instead of 'messages'

    if (!threadId || !message) {
        return res.status(400).json({ error: "missing required fields" }); // Use 400 for bad request
    }
    try {
        let thread = await Thread.findOne({ threadId });
        if (!thread) {
            // Create a new thread in DB
            thread = new Thread({
                threadId,
                title: message, // Use the first message as the title
                messages: [{ role: "user", content: message }]
            });
        } else {
            thread.messages.push({ role: "user", content: message });
        }

        const assistantReply = await getOpenAIAPIResponse(message);

        thread.messages.push({ role: "assistant", content: assistantReply });

        await thread.save();
        return res.json({ reply: assistantReply });

    } catch (err) {
        console.log(err);
        return res.status(500).json({ error: "something went wrong" });
    }
});



// // Dummy POST route for testing
// router.post('/chat', (req, res) => {
//   const { message, threadId } = req.body;
//   if (!message || !threadId) {
//     return res.status(400).json({ error: 'missing required fields' });
//   }

//   // Example: Save to DB (pseudo code)
//   // const thread = await Thread.create({
//     return res.status(400).json({ error: 'missing required fields' });
//   }/   messages: [{ role: "user", content: message }]
//   // });
//   // Example: Save to DB (pseudo code)
//   // const thread = await Thread.create({
//   //   threadId,ly: `You said: ${message}`, threadId });
//   //   messages: [{ role: "user", content: message }]
//   // });
export default router;//   // For now, just send a dummy response//   res.json({ reply: `You said: ${message}`, threadId });// });export default router;