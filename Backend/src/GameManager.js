import Game from "./Game.js";
import { INIT_GAME, MOVE, GAME_OVER } from "./messages.js";
import { WebSocket } from "ws";

class GameManager {
  #games;
  #pendingUser;
  #users;

  constructor() {
    this.#games = [];
    this.#pendingUser = null;
    this.#users = [];
  }

  // Add user to the game manager
  addUser(socket) {
    console.log("New user connected");
    this.#users.push(socket);
    this.addHandler(socket);
  }

  // Remove user when they disconnect
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

  // Handle WebSocket events for a connected user
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

          // Determine the player's color
          const playerColor = game.player1 === socket ? "w" : "b";

          // Get the piece at the source position of the move
          const sourceSquare = message.payload.move.from;
          const piece = game.board.get(sourceSquare); // Assuming game.board.get() returns the piece at the square

          if (!piece) {
            console.error("No piece at the specified source square");
            return;
          }

          // Ensure the piece's color matches the player's color
          if (piece.color !== playerColor) {
            console.error("Player attempted to move opponent's piece!");
            socket.send(
              JSON.stringify({
                type: "ERROR",
                payload: { message: "You cannot move your opponent's piece!" },
              })
            );
            return;
          }

          // Make the move if it's valid
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
