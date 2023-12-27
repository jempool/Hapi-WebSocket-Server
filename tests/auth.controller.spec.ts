import Hapi from "@hapi/hapi";
import mongoose, { Types } from "mongoose";
import bcrypt from "bcrypt";
import authController from "../src/controllers/auth.controller.ts";
import authServices from "../src/services/auth.service.ts";
import { User as UserType } from "../src/interfaces/user.interface.ts";

jest.mock("../src/services/auth.service.ts", () => ({
  getUserByEmail: jest.fn(),
  createUser: jest.fn(),
}));

jest.mock("jsonwebtoken", () => ({
  sign: jest.fn(() => "mocked_token"),
  verify: jest.fn(),
}));

jest.mock("bcrypt", () => ({
  genSaltSync: () => "some_salt",
  hashSync: () => "hashed_password",
  compareSync: () => true,
}));

interface MongooseUserDoc extends UserType {
  _id: Types.ObjectId;
}
const mockedUserId = new Types.ObjectId();

const mockedUser: MongooseUserDoc = {
  _id: mockedUserId,
  name: "Test User",
  email: "test@example.com",
  password: "hashed_password",
};

describe("Auth Controller", () => {
  let server: Hapi.Server;

  beforeAll(async () => {
    server = Hapi.server();
    server.route([
      { method: "POST", path: "/auth/signup", handler: authController.signup },
      { method: "POST", path: "/auth/login", handler: authController.login },
    ]);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("signup", () => {
    it("should create a new user and return tokens", async () => {
      const name = "Test User";
      const email = "test@example.com";
      const password = "password123";

      // Mock the service function to return null, indicating no existing user
      jest.spyOn(authServices, "getUserByEmail").mockResolvedValueOnce(null);

      // Mock the service function to simulate creating a new user
      jest
        .spyOn(authServices, "createUser")
        .mockResolvedValueOnce({ name, email, password } as any);

      const response = await server.inject({
        method: "POST",
        url: "/auth/signup",
        payload: { name, email, password },
      });

      expect(response.statusCode).toBe(200);
      expect(response.result).toHaveProperty("accessToken");
      expect(response.result).toHaveProperty("refreshToken");
      expect((response.result as any).user).toEqual({ name, email });
    });

    it("should return an error if a user with the provided email already exists", async () => {
      jest
        .spyOn(authServices, "getUserByEmail")
        .mockResolvedValueOnce(mockedUser as any);

      const response = await server.inject({
        method: "POST",
        url: "/auth/signup",
        payload: {
          name: mockedUser.name,
          email: mockedUser.email,
          password: mockedUser.password,
        },
      });

      expect(response.statusCode).toBe(400);
      expect(response.result).toHaveProperty("error", "Bad Request");
      expect(response.result).toHaveProperty(
        "message",
        `The email ${mockedUser.email} is already associated with an account`
      );
    });

    it("should return an error if the payload is missing required fields", async () => {
      const payload = { name: mockedUser.name }; // Missing email and password
      const response = await server.inject({
        method: "POST",
        url: "/auth/signup",
        payload,
      });

      expect(response.statusCode).toBe(400);
      expect(response.result).toHaveProperty("error", "Bad Request");
    });
  });

  describe("login", () => {
    // The failure test for login, the error test for missing payload
    it("should return an error if the payload is missing required fields", async () => {
      const incompletePayload = {}; // Empty payload, missing email and password

      const response = await server.inject({
        method: "POST",
        url: "/auth/login",
        payload: incompletePayload,
      });

      // expect(response.statusCode).toBe(400);
      expect(response.result).toHaveProperty(
        "message",
        "Incorrect email or password."
      );
    });

    // The success test for login
    it("should authenticate and return tokens if credentials are correct", async () => {
      const email = "user@example.com";
      const password = "correct_password";

      // Mock a found user
      const foundUser = {
        _id: new mongoose.Types.ObjectId(),
        name: "User",
        email: email,
        password: bcrypt.hashSync(password, bcrypt.genSaltSync()), // Mock hashed password
      };

      // Mock getUserByEmail to simulate finding the user
      jest
        .spyOn(authServices, "getUserByEmail")
        .mockResolvedValue(foundUser as any);

      const response = await server.inject({
        method: "POST",
        url: "/auth/login",
        payload: { email, password },
      });

      expect(response.statusCode).toBe(200);
      expect(response.result).toHaveProperty("accessToken");
      expect(response.result).toHaveProperty("refreshToken");
    });
  });
});
