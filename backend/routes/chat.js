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


router.post("/chat", async(req, res) =>{
    const {threadId, messages} = req.body;

    if(!threadId || !messages){
        res.status(404).json({error:"missing required fields"});
    }
    try{
        let thread = await Thread.findOne({threadId});
        if(!thread){
            //create a new thread in DB
            const newThread = new Thread({
                threadId,
                title: messages,
                messages: [{role: "user", content: messages}]
            });
            await newThread.save();
            thread = newThread;
        } else{
            thread.messages.push({role: "user", content: messages});
        }


        const assistantReply = await getOpenAIAPIResponse(messages);

        thread.messages.push({role: "assistant", content: assistantReply});

        await thread.save();
        res.json({reply: assistantReply});


    } catch(err){
        console.log(err);
        res.status(500).json({error: "something went worng"});
    }
});



export default router;
