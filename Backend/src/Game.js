import { Chess } from "chess.js";
import { INIT_GAME, MOVE, GAME_OVER, INVALID_MOVE, ERROR } from "./messages.js";

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

    // Notify players about the game start
    this.initializePlayers();
    this.setupConnectionListeners();
  }

  // Initialize both players with color and game start info
  initializePlayers() {
    try {
      this.player1.send(
        JSON.stringify({
          type: INIT_GAME,
          payload: { color: "white", fen: this.board.fen() }, // Send the initial FEN state
        })
      );
      console.log("INIT_GAME sent to Player 1");
    } catch (err) {
      console.log("Error sending INIT_GAME to Player 1:", err);
    }

    try {
      this.player2.send(
        JSON.stringify({
          type: INIT_GAME,
          payload: { color: "black", fen: this.board.fen() }, // Send the initial FEN state
        })
      );
      console.log("INIT_GAME sent to Player 2");
    } catch (err) {
      console.log("Error sending INIT_GAME to Player 2:", err);
    }
  }

  // Set up WebSocket error and close listeners for both players
  setupConnectionListeners() {
    this.player1.on("error", (error) =>
      console.log("Player 1 WebSocket error:", error)
    );
    this.player2.on("error", (error) =>
      console.log("Player 2 WebSocket error:", error)
    );
    this.player1.on("close", () =>
      console.log("Player 1 WebSocket connection closed")
    );
    this.player2.on("close", () =>
      console.log("Player 2 WebSocket connection closed")
    );
  }

  // Handle move attempts
  makeMove(socket, move) {
    console.log(`Received move: ${JSON.stringify(move)} from player`);

    // Validate if the player is allowed to make the move
    if (this.moveCount % 2 === 0 && socket !== this.player1) {
      console.log("Not Player 1's turn");
      socket.send(
        JSON.stringify({
          type: INVALID_MOVE,
          payload: { message: "It's not your turn!" },
        })
      );
      return;
    }

    if (this.moveCount % 2 === 1 && socket !== this.player2) {
      console.log("Not Player 2's turn");
      socket.send(
        JSON.stringify({
          type: INVALID_MOVE,
          payload: { message: "It's not your turn!" },
        })
      );
      return;
    }

    // Attempt the move and catch errors if invalid
    let result;
    try {
      result = this.board.move(move);
      if (!result) {
        console.log("Invalid move:", move);
        socket.send(
          JSON.stringify({
            type: INVALID_MOVE,
            payload: { message: "This is an invalid move! Please try again." },
          })
        );
        return;
      }
    } catch (err) {
      console.log("Error processing move:", err.message);
      socket.send(
        JSON.stringify({
          type: INVALID_MOVE,
          payload: { message: "Invalid move! Please try again." },
        })
      );
      return;
    }

    console.log("Move made successfully:", move);

    // Notify both players about the move with updated board state
    const updatedFEN = this.board.fen();
    const moveMessage = JSON.stringify({
      type: MOVE,
      payload: {
        move,
        fen: updatedFEN,
      },
    });

    this.player1.send(moveMessage);
    this.player2.send(moveMessage);

    // Check if the game is over
    if (this.board.isGameOver()) {
      console.log("Game over detected");
      const winner = this.board.turn() === "w" ? "black" : "white";
      const gameOverMessage = JSON.stringify({
        type: GAME_OVER,
        payload: { winner },
      });

      this.player1.send(gameOverMessage);
      this.player2.send(gameOverMessage);
      return;
    }

    // Increment the move count for the next turn
    this.moveCount++;
  }
}

export default Game;
