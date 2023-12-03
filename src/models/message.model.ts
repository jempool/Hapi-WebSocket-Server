import mongoose from "mongoose";

const MessageSchema = new mongoose.Schema({
  message: {
    type: String,
    required: true,
  },
  handle: {
    type: String,
    required: true,
  },
});

const Message = mongoose.model("Message", MessageSchema);

export { Message };
