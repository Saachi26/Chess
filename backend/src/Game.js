import { Chess } from "chess.js";
import { INIT_GAME, MOVE, GAME_OVER } from "./messages.js";

class Game {
  constructor(player1, player2) {
    this.player1 = player1;
    this.player2 = player2;
    this.board = new Chess();
    this.startTime = new Date();
    this.moveCount = 0;

    console.log("New game created between two players");

    // Debugging WebSocket ready states
    console.log("Player 1 ready state:", this.player1.readyState); // 1 means open
    console.log("Player 2 ready state:", this.player2.readyState); // 1 means open

    try {
      this.player1.send(
        JSON.stringify({
          type: INIT_GAME,
          payload: {
            color: "white",
          },
        })
      );
      console.log("INIT_GAME sent to Player 1");
    } catch (err) {
      console.error("Error sending INIT_GAME to Player 1:", err);
    }

    try {
      this.player2.send(
        JSON.stringify({
          type: INIT_GAME,
          payload: {
            color: "black",
          },
        })
      );
      console.log("INIT_GAME sent to Player 2");
    } catch (err) {
      console.error("Error sending INIT_GAME to Player 2:", err);
    }

    // Adding error and close listeners
    this.player1.on("error", (error) => {
      console.error("Player 1 WebSocket error:", error);
    });

    this.player2.on("error", (error) => {
      console.error("Player 2 WebSocket error:", error);
    });

    this.player1.on("close", () => {
      console.log("Player 1 WebSocket connection closed");
    });

    this.player2.on("close", () => {
      console.log("Player 2 WebSocket connection closed");
    });
  }

  makeMove(socket, move) {
    console.log("Attempting to make move:", move);

    if (this.moveCount % 2 === 0 && socket !== this.player1) {
      console.log("Not Player 1's turn");
      return;
    }
    if (this.moveCount % 2 === 1 && socket !== this.player2) {
      console.log("Not Player 2's turn");
      return;
    }

    try {
      this.board.move(move);
      console.log("Move made successfully:", move);
    } catch (e) {
      console.error("Invalid move:", e.message);
      return;
    }

    if (this.board.isGameOver()) {
      console.log("Game over detected");
      const winner = this.board.turn() === "w" ? "black" : "white";
      this.player1.send(
        JSON.stringify({
          type: GAME_OVER,
          payload: { winner },
        })
      );
      this.player2.send(
        JSON.stringify({
          type: GAME_OVER,
          payload: { winner },
        })
      );
      return;
    }

    const otherPlayer = this.moveCount % 2 === 0 ? this.player2 : this.player1;
    otherPlayer.send(
      JSON.stringify({
        type: MOVE,
        payload: move,
      })
    );
    console.log("Move sent to the other player");

    this.moveCount++;
  }
}

export default Game;
