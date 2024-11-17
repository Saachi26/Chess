import { useState } from "react";
import "./output.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Homepage } from "./Pages/Homepage.jsx";
import Game from "./Pages/Game.jsx";

function App() {
  return (
    <div className=" App h-screen bg-slate-950">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/game" element={<Game />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
