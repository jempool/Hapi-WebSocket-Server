// message.controller.spec.ts

import Hapi from "@hapi/hapi";
import messageService from "../src/services/message.service.ts";
import messageController from "../src/controllers/message.controller.ts";
import { Message } from "../src/interfaces/message.interface.ts";

// Mock the messageService.
jest.mock("../src/services/message.service.ts", () => ({
  getAllMessages: jest.fn(),
}));

describe("Message Controller", () => {
  let server: Hapi.Server;

  beforeAll(async () => {
    server = Hapi.server();
    server.route({
      method: "GET",
      path: "/chat/history",
      handler: messageController.getAllMessages,
    });
  });

  it("should return all messages", async () => {
    // Define mock messages
    const mockMessages: Message[] = [
      { message: "Test Message 1", handle: "User 1" },
      { message: "Test Message 2", handle: "User 2" },
      // ... more mock messages
    ];

    // Set up the service mock to return the mock messages
    (messageService.getAllMessages as jest.Mock).mockResolvedValue(
      mockMessages
    );

    // Make a request to the route that should trigger getAllMessages
    const response = await server.inject({
      method: "GET",
      url: "/chat/history",
    });

    // Check the status code and returned messages
    expect(response.statusCode).toBe(200);
    expect(response.result).toEqual(mockMessages);
  });

  // Additional tests for error scenarios, empty arrays, etc. could be here.
});
