"use strict";

import Hapi from "@hapi/hapi";
import mongoose from "mongoose";
import HapiAuthJwt2 from "hapi-auth-jwt2";

import { PORT, DATABASE_URL, DATABASE_NAME } from "./utils/constants.ts";
import socketIOPlugin from "./webSockets/websockets.ts";
import messagesRoutePlugin from "./routes/message.route.ts";
import authRoutePlugin from "./routes/auth.route.ts";
import topicRoutesPlugin from "./routes/topic.route.ts";

const init = async () => {
  const server = Hapi.server({
    port: PORT,
    host: "localhost",
    routes: { cors: true },
  });

  // WebSockets
  await server.register(socketIOPlugin);

  // Auth Strategy
  await server.register(HapiAuthJwt2);
  server.auth.strategy("jwt", "jwt", {
    key: process.env.JWT_SECRET,
    validate: async function (decoded, request, h) {
      return { isValid: !!decoded };
    },
    verifyOptions: { algorithms: ["HS256"] },
  });

  // Routes
  await server.register(messagesRoutePlugin);
  await server.register(authRoutePlugin);
  await server.register(topicRoutesPlugin);

  // Connect to DB and start server
  await mongoose.connect(`${DATABASE_URL}/${DATABASE_NAME}`);
  await server.start();
  console.log("Server running on %s", server.info.uri);
};

process.on("unhandledRejection", (err) => {
  console.log(err);
  process.exit(1);
});

init();
