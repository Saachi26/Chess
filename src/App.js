import "./index.css";
import Board from "./components/Board/Board";
import React, { useReducer } from "react";
import AppContext from "./context/Context";
import { initGameState } from "./constants";
import { reducer } from "./reducer/reducer";
function App() {
  const [appState, dispatch] = useReducer(reducer, initGameState);
  const providerState = {
    appState,
    dispatch,
  };

  return (
    <AppContext.Provider value={{ providerState }}>
      <div className="grid h-screen bg-bg_colour">
        <Board />
      </div>
    </AppContext.Provider>
  );
}

export default App;
