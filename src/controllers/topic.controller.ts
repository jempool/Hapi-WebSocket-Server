import topicService from "../services/topic.service.ts";
import { Topic } from "../interfaces/topic.interface.ts";

export default {
  getTodaysTopic: async () => {
    const topic: Topic = await topicService.getTodaysTopic();
    return topic;
  },
};
