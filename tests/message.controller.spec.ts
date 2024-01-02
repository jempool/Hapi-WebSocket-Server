import Hapi from "@hapi/hapi";
import messageService from "../src/services/message.service.ts";
import messageController from "../src/controllers/message.controller.ts";
import { Message } from "../src/interfaces/message.interface.ts";

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
    const mockMessages: Message[] = [
      { message: "Test Message 1", handle: "User 1" },
      { message: "Test Message 2", handle: "User 2" },
    ];

    (messageService.getAllMessages as jest.Mock).mockResolvedValue(
      mockMessages
    );

    const response = await server.inject({
      method: "GET",
      url: "/chat/history",
    });

    expect(response.statusCode).toBe(200);
    expect(response.result).toEqual(mockMessages);
  });
});
