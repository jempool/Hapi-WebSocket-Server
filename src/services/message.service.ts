import { Message } from "../models/message.model.ts";

export default {
  getAllMessages: async function () {
    return await Message.find();
  },

  addMessage: async function (message) {
    const newMessage = new Message({ ...message });
    return await newMessage.save();
  },
};
