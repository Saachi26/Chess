import React from "react";
import "./Pieces.css";

const Piece = ({ rank, file, piece }) => {
  const pieceStyle = {
    top: `${(7 - rank) * 100}px`, // Adjusting rank for correct positioning from bottom
    left: `${file * 100}px`,
  };

  const handleDragStart = (e) => {
    e.stopPropagation(); // Prevent dragging the background
    const pieceData = { rank, file, piece };
    e.dataTransfer.setData("application/json", JSON.stringify(pieceData));
  };

  return (
    <div
      className={`piece ${piece}`}
      style={pieceStyle}
      draggable={true}
      onDragStart={handleDragStart} // Attach the drag start event handler
    />
  );
};

export default Piece;
