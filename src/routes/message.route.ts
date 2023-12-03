"use strict";

import messageController from "../controllers/message.controller.ts";

const messageRoutesPlugin = {
  name: "messageRoutesPlugin",
  version: "1.0.0",
  register: async function (server, options) {
    server.route({
      method: "GET",
      path: "/chat/history",
      handler: messageController.getAllMessages,
    });
  },
};

export default messageRoutesPlugin;
