import "../input.css";
import { Board } from "../components/Board/Board.js";
import { reducer } from "../reducer/reducer";
import { useEffect, useState, useReducer } from "react";
import { initGameState } from "../constants";
import AppContext from "../contexts/Context";
import { useSocket } from "../hooks/useSocket";
import MovesList from "../components/MovesList.js";
import { Chess } from "chess.js";

export const INIT_GAME = "init_game";
export const MOVE = "move";
export const GAME_OVER = "game_over";
export const INVALID_MOVE = "invalid_move";
export const ERROR = "error";

const Game = () => {
  const [appState, dispatch] = useReducer(reducer, initGameState);
  const socket = useSocket();
  const [chess, setChess] = useState(new Chess());
  const [board, setBoard] = useState(chess.board());
  const [started, setStarted] = useState(false);
  const [currentPlayer, setCurrentPlayer] = useState("player1");
  const providerState = {
    appState,
    dispatch,
  };

  useEffect(() => {
    if (!socket) {
      return;
    }

    const handleMessage = (event) => {
      try {
        const message = JSON.parse(event.data);

        switch (message.type) {
          case INIT_GAME:
            console.log("Game initialized");
            const newChess = new Chess();
            setChess(newChess);
            setBoard(newChess.board());
            setStarted(true);
            break;

          case MOVE:
            const { move, fen } = message.payload;
            const updatedChess = new Chess(fen); // Sync board state
            setChess(updatedChess);
            setBoard(updatedChess.board());
            console.log(
              `Move received from backend: ${move.from} to ${move.to}`
            );
            break;

          case INVALID_MOVE:
            alert(message.payload.message); // Notify the user
            console.warn("Invalid move attempted");
            break;

          case ERROR:
            alert(message.payload.message); // Notify the user about errors
            console.error(
              "Error received from backend:",
              message.payload.message
            );
            break;

          case GAME_OVER:
            console.log("Game over");
            setStarted(false);
            alert("The game is over!");
            break;

          default:
            console.warn(`Unknown message type: ${message.type}`);
            break;
        }
      } catch (error) {
        console.error("Error processing socket message:", error);
        alert(
          "An error occurred while processing the game state. Please try again."
        );
      }
    };

    socket.addEventListener("message", handleMessage);

    socket.onerror = (error) => {
      console.error("WebSocket Error: ", error);
      alert(
        "There was an error with the connection. Please check your network."
      );
    };

    socket.onclose = () => {
      console.warn("Socket connection closed unexpectedly.");
      alert("The connection to the game has been lost.");
    };

    return () => {
      // Cleanup socket listeners
      socket.removeEventListener("message", handleMessage);
    };
  }, [socket]);

  const handleMove = (from, to) => {
    const move = { from, to };

    // Validate the move locally
    const result = chess.move(move, { sloppy: true }); // Sloppy mode allows for algebraic notation

    if (result) {
      // Send the valid move to the backend
      socket.send(
        JSON.stringify({
          type: MOVE,
          payload: { move },
        })
      );
      console.log(`Move sent to backend: ${from} to ${to}`);
    } else {
      // Notify the user of an invalid move
      alert("Invalid move! Please try again.");
      console.warn("Invalid move attempted");
    }

    // Revert the board state for invalid moves
    setChess(new Chess(chess.fen())); // Reset the state to the last valid position
  };

  return (
    <AppContext.Provider value={providerState}>
      <div className="flex justify-center w-auto">
        <div className="flex flex-col md:flex-row gap-4 w-full">
          {/* Chess Board */}
          <div className="flex-1 flex justify-center">
            <Board
              chess={chess}
              setBoard={setBoard}
              socket={socket}
              board={board}
              currentPlayer={currentPlayer}
              handleMove={handleMove} // Pass handleMove to Board
            />
          </div>

          {/* Control Panel */}
          <div className="flex-1 flex justify-center flex-col w-80 ">
            {!started && (
              <button
                className="flex px-16 py-5 ml-36 rounded-full text-lg text-White leading-[90%] mx-auto"
                onClick={() => {
                  socket.send(
                    JSON.stringify({
                      type: INIT_GAME,
                    })
                  );
                }}
              >
                Play
              </button>
            )}
            <MovesList />
          </div>
        </div>
      </div>
    </AppContext.Provider>
  );
};

export default Game;
