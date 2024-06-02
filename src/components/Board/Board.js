import React from "react";
import { getCharacter } from "../../helper";
import Ranks from "./Ranks";
import Files from "./Files";
import Pieces from "../Pieces/Pieces";

const Board = () => {
  const getClassName = (i, j) => {
    return (i + j) % 2 === 0 ? "bg-light_tile" : "bg-dark_tile";
  };

  const ranks = Array(8)
    .fill()
    .map((_, i) => 8 - i);
  const files = Array(8)
    .fill()
    .map((_, i) => i + 1);

  return (
    <div className="h-screen flex items-center justify-center bg-bg_colour">
      <div className="relative">
        <Ranks ranks={ranks} />
        <div className="TILES grid grid-cols-8 gap-0 relative w-[800px] h-[800px]">
          {ranks.map((rank, i) =>
            files.map((file, j) => (
              <div
                key={`${rank}${getCharacter(file)}`}
                className={`w-[100px] h-[100px] flex items-center justify-center border ${getClassName(
                  9 - i,
                  j
                )}`}
              ></div>
            ))
          )}
          <Pieces />
        </div>
        <Files files={files} />
      </div>
    </div>
  );
};

export default Board;
