import { WebSocketServer } from "ws"; // Use WebSocketServer for server
import GameManager from "./GameManager.js";

// Create a WebSocket server
const wss = new WebSocketServer({ port: 8080 });

const gameManager = new GameManager();
console.log("Server started on port 8080");

wss.on("connection", function connection(ws) {
  console.log("New WebSocket connection established");
  gameManager.addUser(ws);

  ws.on("close", () => {
    console.log("WebSocket connection closed");
    gameManager.removeUser(ws);
  });

  ws.on("error", (err) => {
    console.error("WebSocket error:", err);
  });
});
