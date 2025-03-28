import styles from "./EndGameModal.module.css";

import { Button } from "../Button/Button";

import deadImageUrl from "./images/dead.png";
import celebrationImageUrl from "./images/celebration.png";
import { useNavigate } from "react-router-dom";
import { useContext, useEffect } from "react";
import { GameModeContext } from "../../context/gameModeContext";
import { postLeaderboard } from "../../api";

export function EndGameModal({ isWon, gameDurationSeconds, gameDurationMinutes, onClick, time }) {
  const nav = useNavigate();
  const { gamerData, setGamerData } = useContext(GameModeContext);

  useEffect(() => {
    setGamerData({ ...gamerData, time: time });
  }, []);

  const addToLeaderboard = () => {
    postLeaderboard(gamerData)
      .then(res => {
        nav("/leaderboard");
      })
      .catch(err => {
        console.log(err);
      });
  };

  const title = isWon ? "Вы победили!" : "Вы проиграли!";

  const imgSrc = isWon ? celebrationImageUrl : deadImageUrl;

  const imgAlt = isWon ? "celebration emodji" : "dead emodji";

  return (
    <div className={styles.modal}>
      <img className={styles.image} src={imgSrc} alt={imgAlt} />
      <h2 className={styles.title}>{title}</h2>
      <p className={styles.description}>Затраченное время:</p>
      <div className={styles.time}>
        {gameDurationMinutes.toString().padStart("2", "0")}:{gameDurationSeconds.toString().padStart("2", "0")}
      </div>
      {isWon ? (
        <button className={styles.addToLeaderboard} onClick={addToLeaderboard}>
          Добавить в лидерборд
        </button>
      ) : (
        ""
      )}
      <Button onClick={onClick}>Начать сначала</Button>
    </div>
  );
}
