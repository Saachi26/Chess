import "./Board.css";
import { useState } from "react";
import { MOVE } from "../../Pages/Game";

export const Board = ({ chess, board, socket, setBoard }) => {
  const [from, setFrom] = useState(null);
  const ranks = Array(8)
    .fill()
    .map((_, i) => 8 - i); // 8 to 1 for ranks
  const files = Array(8)
    .fill()
    .map((_, i) => String.fromCharCode(97 + i)); // 'a' to 'h' for files

  return (
    <div className="text-white-200">
      {/* Ranks and the Board */}
      <div className="flex">
        {/* Ranks (on the left side) */}
        <div className="flex flex-col justify-between items-center">
          {ranks.map((rank, i) => (
            <div
              key={i}
              className="w-16 h-16 flex items-center justify-center text-white"
            >
              {rank}
            </div>
          ))}
        </div>

        {/* Board */}
        <div className="flex flex-col">
          {board.map((row, i) => (
            <div key={i} className="flex">
              {row.map((square, j) => {
                const squareRepresentation = files[j] + (8 - i); // e.g. 'a1', 'b2', etc.

                return (
                  <div
                    onClick={() => {
                      if (!from) {
                        setFrom(squareRepresentation);
                      } else {
                        socket.send(
                          JSON.stringify({
                            type: MOVE,
                            payload: {
                              move: {
                                from,
                                to: squareRepresentation,
                              },
                            },
                          })
                        );
                        setFrom(null);
                        chess.move({
                          from,
                          to: squareRepresentation,
                        });
                        setBoard(chess.board());
                        console.log({ from, to: squareRepresentation });
                      }
                    }}
                    key={j}
                    className={`w-16 h-16 ${
                      (i + j) % 2 === 0 ? "bg-light_tile" : "bg-dark_tile"
                    }`}
                  >
                    <div className="w-full justify-center flex h-full">
                      <div className="h-full justify-center flex flex-col">
                        {square ? (
                          <img
                            className="w-16"
                            src={`/assets/${
                              square?.color === "b"
                                ? square?.type
                                : `${square?.type?.toUpperCase()}`
                            }.png`}
                            alt={`${
                              square?.color === "b"
                                ? square?.type
                                : square?.type.toUpperCase()
                            } piece`}
                          />
                        ) : null}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Files Row (letters a-h) */}
      <div className="flex justify-center ml-16 mt-2">
        {files.map((file, index) => (
          <div key={index} className="w-16 text-center text-white">
            {file}
          </div>
        ))}
      </div>
    </div>
  );
};
