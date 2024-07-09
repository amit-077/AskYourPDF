import mongoose from "mongoose";

const chatSchema = new mongoose.Schema({
  pdfURL: {
    type: String,
    required: true,
  },
  chat: {
    type: Array,
    default: [],
  },
  chatUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
    required: true,
  },
  collectionName: {
    type: String,
    required: true,
  },
});

const Chat = mongoose.models?.chats || mongoose.model("chats", chatSchema);

export default Chat;
