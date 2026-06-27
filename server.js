import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";
import mongoose from "mongoose";
import Chat from "./models/Chat.js";
import Conversation from "./models/Conversation.js";

dotenv.config();
console.log(process.env.GEMINI_API_KEY);


const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

const SYSTEM_PROMPT = `
You are Study Buddy AI.

Strict Instructions:

- Do NOT use Markdown.
- Do NOT use '#', '##', '###', '**', '*', '_', or backticks.
- Do NOT use Markdown tables.
- Give clean, professional, plain-text responses.
- Always follow this format:

TITLE

1. Introduction

2. Main Points
   • Point 1
   • Point 2
   • Point 3

3. Example (if required)

4. Summary

The output should look like a textbook answer, not Markdown.
`;

mongoose.connect(`mongodb://hasanabbas04:TEST1234567890@ac-bdleux8-shard-00-00.hgkzfsh.mongodb.net:27017,ac-bdleux8-shard-00-01.hgkzfsh.mongodb.net:27017,ac-bdleux8-shard-00-02.hgkzfsh.mongodb.net:27017/ChatApp?ssl=true&replicaSet=atlas-12wk3t-shard-0&authSource=admin&appName=Cluster0`, {}).then(() => {
console.log("Connected to MongoDB");
}).catch((error) => {
console.log("Error connecting to MongoDB", error);
});
const app = express();

app.use(cors());
app.use(express.json());

//Code for new chat creation
app.post("/conversations", async (req, res) => {
  try {
    const conversation = await Conversation.create({title: "New Chat"});
    res.json({
      success: true,
      conversation: conversation
    });
  } catch (error) {
    console.log("Error creating conversation", error);
    res.status(500).json({
      success: false,
      error: "Server Error"
    });
  }
});

app.get("/conversations", async (req, res) => {
  try {
    const conversations = await Conversation.find().sort({createdAt: -1});
    res.json({
      success: true,
      conversations: conversations
    });
  } catch (error) {
    console.log("Error fetching conversations", error);
    res.status(500).json({
      success: false,
      error: "Server Error"
    });
  }
});

app.get("/conversations/:id/chats", async (req, res) => {
  try {
    const { id } = req.params;
    const chats = await Chat.find({ conversationId: id }).sort({ createdAt: 1 });
    res.json({
      success: true,
      chats: chats
    });
  } catch (error) {
    console.log("Error fetching chats", error);
    res.status(500).json({
      success: false,
      error: "Server Error"
    });
  }
});

app.post("/",async(req, res) => {
  //res.sen
  // d("Backend is running!");
  try{
    const {Message, conversationId} = req.body;
    if(!Message || !conversationId){
      return res.status(400).json({
        success: false,
        error: "Message is required"
      });
    }
    const userChat = await Chat.create({
      text: Message,
      sender: "user",
      conversationId: conversationId
    });
    const Response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: Message,
      config: {
       systemInstruction: SYSTEM_PROMPT,
  },
    });
    const botChat = await Chat.create({
      conversationId: conversationId,
      text: Response.text,
      sender: "bot"
    });
    await Conversation.findByIdAndUpdate(conversationId, { title: Message.slice(0, 20) + "..." });
    res.json({
      success: true,
      chat: botChat,
      Reply: Response.text
    });
  }
  catch(error){
    console.log("Code not working properly", error);
    res.status(500).json({
      success:false,
      error: "Server Error"});
  }
});

app.get("/chats", async(req,res)=>{
  try{
    const chats = await Chat.find().sort({createdAt:1});
    res.json({
      success: true,
      chats: chats
    });
  }
  catch(error){
    console.log("Error fetching chats", error);
    res.status(500).json({
      success: false,
      error: "Server Error"
    });
  }
});

app.listen(process.env.PORT,()=>{console.log(`Server running on port ${process.env.PORT}`)});