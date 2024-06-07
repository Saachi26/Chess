import React, { useState } from "react";
import Piece from "./Piece";
import { createPosition } from "../../helper";

const Pieces = () => {
  const [state, setState] = useState(createPosition());
  return (
    <div className="absolute w-full h-full">
      {state.map((r, rank) =>
        r.map((f, file) =>
          state[rank][file] ? (
            <Piece
              key={rank + "-" + file}
              rank={rank}
              file={file}
              piece={state[rank][file]}
            />
          ) : null
        )
      )}
    </div>
  );
};

export default Pieces;
