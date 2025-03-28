import { createContext, useState } from "react";
export const GameModeContext = createContext(null);
export const GameModeProvider = ({ children }) => {
  const [gameMode, setGameMode] = useState(false);
  const [inGame, setInGame] = useState(false);
  const [gamerData, setGamerData] = useState({
    name: "Пользователь",
    time: 0,
    achievements: [2],
  });
  return (
    <GameModeContext.Provider value={{ gameMode, setGameMode, inGame, setInGame, gamerData, setGamerData }}>
      {children}
    </GameModeContext.Provider>
  );
};
