import { Link } from "react-router-dom";
import styles from "./SelectLevelPage.module.css";
import { GameModeContext } from "../../context/gameModeContext";
import { useContext } from "react";
import { Header } from "../../components/Header/Header";

export function SelectLevelPage() {
  const { gameMode, setGameMode, gamerData, setGamerData } = useContext(GameModeContext);

  const onGameMode = () => {
    setGamerData({ ...gamerData, achievements: [] });
    setGameMode(!gameMode);
  };
  return (
    <>
      <Header />
      <div className={styles.container}>
        <div className={styles.modal}>
          <h1 className={styles.title}>Выбери сложность</h1>
          <ul className={styles.levels}>
            <li className={styles.level}>
              <Link className={styles.levelLink} to="/game/3">
                1
              </Link>
            </li>
            <li className={styles.level}>
              <Link className={styles.levelLink} to="/game/6">
                2
              </Link>
            </li>
            <li className={styles.level}>
              <Link className={styles.levelLink} to="/game/9">
                3
              </Link>
            </li>
          </ul>
          <div className={styles.gameMode}>
            <p>Сложный режим</p>{" "}
            <input type="checkbox" name="checkbox" defaultChecked={gameMode} onClick={onGameMode} />
          </div>
        </div>
      </div>
    </>
  );
}
