import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
  role: {
    type: String,
    enum: ["user", "assistant"],
    required: true,
  },
  content: {
    type: String,
    default: "",
  },
  attachment: {
    filename: String,
    path: String,
    mimetype: String,
  },
}, { _id: true });

const conversationSchema = new mongoose.Schema({
  title: {
    type: String,
    default: "New Chat",
  },
  messages: [messageSchema],
}, {
  timestamps: true,
});

export default mongoose.model("Conversation", conversationSchema);