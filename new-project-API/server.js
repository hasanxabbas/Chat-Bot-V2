import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";
import mongoose from "mongoose";
import Chat from "./models/Chat.js";
import Conversation from "./models/Conversation.js";
import multer from "multer";
import fs from "fs";

dotenv.config();
console.log(process.env.GEMINI_API_KEY);


const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

const SYSTEM_PROMPT = `
You are a helpful AI assistant.

Rules:

- If the user sends a greeting like "hi", "hello", "hey", "good morning", or "good evening", reply naturally in one short sentence.

Example:
User: hello
Assistant: Hi! How can I help you today?

Do not introduce yourself unless the user asks who you are.

Do not mention "Study Buddy AI".

For academic questions, give well-structured, clear explanations in plain text.

Do not use Markdown.
`;

mongoose.connect(`mongodb://hasanabbas04:TEST1234567890@ac-bdleux8-shard-00-00.hgkzfsh.mongodb.net:27017,ac-bdleux8-shard-00-01.hgkzfsh.mongodb.net:27017,ac-bdleux8-shard-00-02.hgkzfsh.mongodb.net:27017/ChatApp?ssl=true&replicaSet=atlas-12wk3t-shard-0&authSource=admin&appName=Cluster0`, {}).then(() => {
console.log("Connected to MongoDB");
}).catch((error) => {
console.log("Error connecting to MongoDB", error);
});
const app = express();

app.use(cors());
app.use(express.json());
app.use("/uplaods",express.static("uploads"));

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
const upload = multer({ storage: storage });

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

app.post("/", upload.single("attachment"), async(req, res) => {
  //res.sen
  // d("Backend is running!");

  try{
    const file = req.file;
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
      conversationId: conversationId,
      attachment: file ? {
        filename: file.originalname,
        path: file.path,
        mimetype: file.mimetype
      } : null
    });
    let contents;
     if(file && file.mimetype.startsWith("image/")){
      const imageBuffer = fs.readFileSync(file.path);
      const imageBase64 = imageBuffer.toString("base64");
      contents = [
        {
          inlineData:{
            mimeType: file.mimetype,
            data: imageBase64,
          },
        },
        {
          text: Message || "User sent an image",
        },
      ];

    }
    else{
      contents = Message || "User sent a file. Explain what can be done with it.";
    }



    const Response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents,
      config: {
       systemInstruction: SYSTEM_PROMPT,
  },

    });

    const aiReply = Response.text;

    const botChat = await Chat.create({
      conversationId: conversationId,
      text: aiReply,
      sender: "bot"
    });
    const conversation = await Conversation.findById(conversationId);

if (conversation && conversation.title === "New Chat") {
    await Conversation.findByIdAndUpdate(
        conversationId,
        {
            title: Message.substring(0, 30),
        }
    );
}
    res.json({
      sender: "user",
      success: true,
      chat: botChat,
      Reply: aiReply
    });
  }
  catch(error){
    console.log("Code not working properly", error);
    res.status(500).json({
      success: false,
      error: "Server Error"
    });
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