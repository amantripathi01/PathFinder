import React from "react";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import PathFindingVisualizer from "./PathFindingVisualizer/PathFindingVisualizer";
function App() {
  return (
    <div className="App">
      <PathFindingVisualizer></PathFindingVisualizer>
    </div>
  );
}

export default App;
