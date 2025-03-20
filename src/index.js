import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { RouterProvider } from "react-router-dom";
import { router } from "./router";
import { GameModeProvider } from "./context/gameModeContext";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <GameModeProvider>
      <RouterProvider router={router}></RouterProvider>
    </GameModeProvider>
  </React.StrictMode>,
);
