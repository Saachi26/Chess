import "./index.css";
import Board from "./components/Board/Board";
import React from "react";

function App() {
  return (
    <div className="grid h-screen bg-bg_colour">
      <Board />
    </div>
  );
}

export default App;
