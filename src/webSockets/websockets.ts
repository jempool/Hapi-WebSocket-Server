"use strict";

import { Server } from "socket.io";

// import dbService from "../services/message.service.ts";
import {
  WEBSOCKETS_CHAT_EVENT,
  WEBSOCKETS_TYPING_EVENT,
} from "./../utils/constants.js";

const socketIOPlugin = {
  name: "socket.io-plugin",
  version: "1.0.0",
  register: async function (server, options) {
    const io = new Server(server.listener, {
      cors: {
        origin: "*",
        methods: ["GET", "POST"],
      },
    });

    io.on("connection", (socket) => {
      console.log(`${new Date()} - New connection ${socket.id}`);

      // Listening for chat event
      socket.on(WEBSOCKETS_CHAT_EVENT, function (data) {
        //   dbService.addMessage(data);
        io.sockets.emit(WEBSOCKETS_CHAT_EVENT, data);
      });

      // Listening for typing event
      socket.on(WEBSOCKETS_TYPING_EVENT, function (data) {
        io.sockets.emit(WEBSOCKETS_TYPING_EVENT, data);
        socket.broadcast.emit(WEBSOCKETS_TYPING_EVENT, data);
      });

      socket.on("error", (error) => {
        console.error("Socket error:", error);
      });
    });
  },
};

export default socketIOPlugin;
