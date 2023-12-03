"use strict";

import Hapi from "@hapi/hapi";
import mongoose from "mongoose";

import { PORT, DATABASE_URL, DATABASE_NAME } from "./utils/constants.ts";
import socketIOPlugin from "./webSockets/websockets.ts";
import myPlugin from "./routes/message.route.ts";

const init = async () => {
  const server = Hapi.server({
    port: PORT,
    host: "localhost",
  });

  // WebSockets
  await server.register(socketIOPlugin);

  await server.register(myPlugin);

  await mongoose.connect(`${DATABASE_URL}/${DATABASE_NAME}`);
  await server.start();
  console.log("Server running on %s", server.info.uri);
};

process.on("unhandledRejection", (err) => {
  console.log(err);
  process.exit(1);
});

init();
