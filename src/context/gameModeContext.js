import { createContext, useState } from "react";
export const GameModeContext = createContext(null);
export const GameModeProvider = ({ children }) => {
  const [gameMode, setGameMode] = useState(false);
  return <GameModeContext.Provider value={{ gameMode, setGameMode }}>{children}</GameModeContext.Provider>;
};
