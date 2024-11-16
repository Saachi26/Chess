import Game from "./Game.js";
import { INIT_GAME, MOVE, GAME_OVER } from "./messages.js";
import { WebSocket } from "ws";

class GameManager {
  #games;
  #pendingUser;
  #users;

  constructor() {
    // Initialize private fields
    this.#games = [];
    this.#pendingUser = null;
    this.#users = [];
  }

  // Public methods for interaction
  addUser(socket) {
    console.log("New user connected");
    this.#users.push(socket);
    this.addHandler(socket);
  }

  removeUser(socket) {
    console.log("User disconnected");
    this.#users = this.#users.filter((user) => user !== socket);

    const game = this.#games.find(
      (game) => game.player1 === socket || game.player2 === socket
    );
    if (game) {
      console.log("Stopping game due to user disconnect");
      const otherPlayer = game.player1 === socket ? game.player2 : game.player1;
      otherPlayer.send(
        JSON.stringify({
          type: GAME_OVER,
          payload: { reason: "Opponent disconnected" },
        })
      );
      this.#games = this.#games.filter((g) => g !== game);
    }
  }

  addHandler(socket) {
    socket.on("message", (data) => {
      console.log("Message received from user:", data.toString());
      const message = JSON.parse(data.toString());

      if (message.type === INIT_GAME) {
        console.log("INIT_GAME message received");
        if (this.#pendingUser) {
          const game = new Game(this.#pendingUser, socket);
          this.#games.push(game);
          this.#pendingUser = null;
        } else {
          this.#pendingUser = socket;
          console.log("Waiting for another user to start a game");
        }
      }

      if (message.type === MOVE) {
        console.log("MOVE message received");
        const game = this.#games.find(
          (game) => game.player1 === socket || game.player2 === socket
        );
        if (game) {
          console.log("Making move in the game");
          game.makeMove(socket, message.payload.move);
        } else {
          console.error("No game found for the user");
        }
      }
    });

    socket.on("close", () => this.removeUser(socket));
    socket.on("error", (err) => console.error("WebSocket error:", err));
  }
}

export default GameManager;
