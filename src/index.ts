"use strict";

import Hapi from "@hapi/hapi";

import { PORT, DATABASE_URL, DATABASE_NAME } from "./utils/constants.ts";
import socketIOPlugin from "./webSockets/websockets.ts";

const init = async () => {
  const server = Hapi.server({
    port: PORT,
    host: "localhost",
  });

  // WebSockets
  await server.register(socketIOPlugin);

  server.route({
    method: "GET",
    path: "/",
    handler: (request, h) => {
      return "Hello World!";
    },
  });

  await server.start();
  console.log("Server running on %s", server.info.uri);
};

process.on("unhandledRejection", (err) => {
  console.log(err);
  process.exit(1);
});

init();
