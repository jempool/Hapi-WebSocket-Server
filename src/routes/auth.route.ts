"use strict";

import authController from "../controllers/auth.controller.ts";

const authRoutesPlugin = {
  name: "authRoutesPlugin",
  version: "1.0.0",
  register: async function (server, options) {
    server.route([
      {
        method: "POST",
        path: "/auth/signup",
        handler: authController.signup,
      },
      {
        method: "POST",
        path: "/auth/login",
        handler: authController.login,
      },
      {
        method: "POST",
        path: "/auth/refresh",
        handler: authController.refresh,
      },
    ]);
  },
};

export default authRoutesPlugin;
