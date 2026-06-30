import mongoose from "mongoose";


const chatSchema = new mongoose.Schema({
  conversationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Conversation",
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
  attachment: {
    filename: String,
    path: String,
    mimetype: String
  },
  sender: {
    type: String,
    enum: ["user", "bot"],
    required: true,

  },

},
{timestamps: true,}
);


export default mongoose.model("Chat", chatSchema);