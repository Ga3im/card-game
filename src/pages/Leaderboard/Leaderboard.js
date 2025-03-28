import { useContext, useEffect, useState } from "react";
import { Header } from "../../components/Header/Header";
import { getLeaderboard } from "../../api";
import styles from "./Leaderboard.module.css";
import { GameModeContext } from "../../context/gameModeContext";
import hardMode from "./img/hardMode.png";
import activeHardMode from "./img/activeHardMode.png";
import superMode from "./img/withSuper.png";
import activeSuperMode from "./img/activeWithSuper.png";

export const Leaderboard = () => {
  const [leaders, setLeaders] = useState([]);
  const { setInGame } = useContext(GameModeContext);

  const formateDate = date => {
    let minutes = Math.floor(date / 60);
    let seconds = date % 60;
    return `${minutes}:${seconds < 10 ? "0" + seconds : seconds}`;
  };

  useEffect(() => {
    setInGame(false);
    getLeaderboard()
      .then(res => {
        setLeaders(res.leaders);
      })
      .catch(error => console.log(error));
  }, []);

  leaders.sort(function (a, b) {
    return a.time - b.time;
  });

  return (
    <>
      <Header />
      <div className={styles.list}>
        <div className={styles.item}>
          <p className={styles.position}>Позиция</p>
          <p className={styles.user}>Пользователь</p>
          <p className={styles.achivements}>Достижение</p>
          <p className={styles.time}>Время</p>
        </div>
        {leaders.map((i, index) => {
          return (
            <div className={styles.item} key={i.id}>
              <p className={styles.position}>{index + 1}</p>
              <p className={styles.user}>{i.name}</p>
              <div className={styles.achivements}>
                {i.achievements.includes(1) ? (
                  <img className={styles.achivement} src={activeHardMode} />
                ) : (
                  <img className={styles.achivement} src={hardMode} />
                )}
                {i.achievements.includes(2) ? (
                  <img className={styles.superMode} src={activeSuperMode} />
                ) : (
                  <img className={styles.achivement} src={superMode} />
                )}
              </div>
              <p className={styles.time}>{formateDate(i.time)}</p>
            </div>
          );
        })}
      </div>
    </>
  );
};
