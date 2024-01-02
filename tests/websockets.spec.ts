import Hapi from "@hapi/hapi";
import { io as Client } from "socket.io-client";
import socketIOPlugin from "../src/webSockets/websockets";
import {
  WEBSOCKETS_CHAT_EVENT,
  WEBSOCKETS_TYPING_EVENT,
} from "../src/utils/constants";

jest.mock("../src/services/message.service.ts");

describe("WebSockets Chat Events", () => {
  let server: Hapi.Server;
  let clientSocket;
  let serverAddr;

  beforeAll(async () => {
    server = Hapi.server({
      port: 0,
      host: "localhost",
    });

    // Register the socket.io plugin
    await server.register(socketIOPlugin);

    // Start the Hapi server
    await server.start();
    serverAddr = server.info.uri;
  });

  beforeEach((done) => {
    clientSocket = Client(serverAddr, {
      path: "/socket.io",
      transports: ["websocket"],
    });

    clientSocket.on("connect", done);

    clientSocket.on("connect_error", done);
  });

  afterEach(() => {
    if (clientSocket?.connected) {
      clientSocket.disconnect();
    }
  });

  afterAll(async () => {
    await server.stop();
  });

  it("should handle chat event", (done) => {
    const mockData = { message: "hello", handle: "user1" };

    clientSocket.on(WEBSOCKETS_CHAT_EVENT, (data) => {
      try {
        expect(data).toMatchObject(mockData);
        done();
      } catch (error) {
        done(error);
      }
    });

    clientSocket.emit(WEBSOCKETS_CHAT_EVENT, mockData);
  }, 30000);

  it("should handle typing event", (done) => {
    const mockData = { typing: true, handle: "user1" };

    clientSocket.on(WEBSOCKETS_TYPING_EVENT, (data) => {
      try {
        expect(data).toMatchObject(mockData);
        done();
      } catch (error) {
        done(error);
      }
    });

    clientSocket.emit(WEBSOCKETS_TYPING_EVENT, mockData);
  }, 30000);
});
