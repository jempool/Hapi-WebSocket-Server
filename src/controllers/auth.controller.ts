"use strict";

import dotenv from "dotenv";
dotenv.config();
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import Boom from "@hapi/boom";

import authServices from "../services/auth.service.ts";
import {
  ACCESS_TOKEN_EXPIRES_IN,
  REFRESH_TOKEN_EXPIRES_IN,
  BCRYPT_SALT_ROUNDS,
} from "../utils/constants.ts";
import { User } from "../interfaces/user.interface.ts";

export default {
  signup: async (request, h) => {
    try {
      const { name, email, password }: User = request.payload;
      if (await authServices.getUserByEmail(email)) {
        throw Boom.badRequest(
          `The email ${email} is already associated with an account`
        );
      } else {
        const newUser = await createUser({ name, email, password });
        const user = { name: newUser.name, email: newUser.email };
        const tokens = generateTokens(user);
        return { user, ...tokens };
      }
    } catch (err) {
      throw Boom.badRequest(err.message);
    }
  },

  login: async (request, h) => {
    try {
      const { email, password }: User = request.payload;
      const existingUser = await verifyUser(email, password);
      const user = { name: existingUser.name, email: existingUser.email };
      const tokens = generateTokens(user);
      return { user, ...tokens };
    } catch (err) {
      throw Boom.badRequest(err.message);
    }
  },

  refresh: async (request, h) => {
    const { refreshToken, email } = request.payload;
    if (refreshToken && email) {
      const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET) as {
        user: { name: string; email: string };
      };
      if (decoded.user.email !== email) {
        throw Boom.unauthorized("Invalid token, try login again.");
      }
      const user = { name: decoded.user.name, email: decoded.user.email };
      const tokens = generateTokens(user);
      return { user, ...tokens };
    }
  },
};

const verifyUser = async (email: string, password: string) => {
  const existingUser = await authServices.getUserByEmail(email);
  if (!existingUser || !bcrypt.compareSync(password, existingUser.password)) {
    throw new Error(`Incorrect email or password.`);
  }
  return existingUser;
};

const createUser = async (user) => {
  const salt = bcrypt.genSaltSync(BCRYPT_SALT_ROUNDS);
  const hash = bcrypt.hashSync(user.password, salt);
  user.password = hash;
  return await authServices.createUser(user);
};

const generateTokens = (user: { name: string; email: string }) => {
  const accessToken = jwt.sign({ user }, process.env.JWT_SECRET, {
    expiresIn: ACCESS_TOKEN_EXPIRES_IN,
  });
  const refreshToken = jwt.sign({ user }, process.env.JWT_SECRET, {
    expiresIn: REFRESH_TOKEN_EXPIRES_IN,
  });
  return { accessToken, refreshToken };
};
