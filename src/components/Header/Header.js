import { useNavigate } from "react-router-dom";
import styles from "./Header.module.css";
import logo from "./images/logo.png";
import { useContext, useState } from "react";
import { GameModeContext } from "../../context/gameModeContext";

export const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isAuth, setIsAuth] = useState(false);
  const { inGame, setInGame, gamerData, setGamerData } = useContext(GameModeContext);

  const nav = useNavigate();
  const openMain = () => {
    nav("/");
  };

  const openLiderboard = () => {
    if (inGame) {
      if (window.confirm("Вы хотите прервать игру и перейти в Лидерборд?")) {
        setInGame(false);
        nav("/leaderboard");
      }
    } else if (window.location.href) {
      nav("/leaderboard");
    } else {
      return;
    }
  };

  const renameUser = e => {
    e.preventDefault();
    let newUserName = prompt("Введите новое имя");
    if (newUserName) {
      setGamerData({ ...gamerData, name: newUserName });
    }
  };

  const openUserInfo = () => {
    if (isAuth) {
      setIsOpen(!isOpen);
    } else {
      let userName = prompt("Введите имя");
      if (userName) {
        setGamerData({ ...gamerData, name: userName });
        setIsAuth(true);
      }
    }
  };
  return (
    <div className={styles.header}>
      <img className={styles.logo} src={logo} onClick={openMain} />
      <div className={styles.leaderboard} onClick={openLiderboard}>
        Лидерборд
      </div>
      <div>
        <p className={styles.user} onClick={openUserInfo}>
          {isAuth ? gamerData.name : "Войти"}
        </p>
        {isOpen && (
          <div className={styles.userInfo}>
            <p className={styles.userName}>{gamerData.name}</p>{" "}
            {/* <p className={styles.nightTheme}>
              Темный режим <input type="checkbox" name="checkbox" />
            </p> */}
            <p className={styles.rename} onClick={renameUser}>
              Изменить имя
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
