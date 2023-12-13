"use strict";

import topicController from "../controllers/topic.controller.ts";

const topicRoutesPlugin = {
  name: "topicRoutesPlugin",
  version: "1.0.0",
  register: async function (server, options) {
    server.route({
      method: "GET",
      path: "/topics/today",
      handler: topicController.getTodaysTopic,
      options: {
        auth: "jwt",
      },
    });
  },
};

export default topicRoutesPlugin;
