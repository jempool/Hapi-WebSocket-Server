import messageService from "../services/message.service.ts";
import { Message } from "../interfaces/message.interface.ts";

export default {
  getAllMessages: async () => {
    const messages: Message[] = await messageService.getAllMessages();
    return messages;
  },
};
