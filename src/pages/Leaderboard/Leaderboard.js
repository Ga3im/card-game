import { useEffect, useState } from "react";
import { Header } from "../../components/Header/Header";
import { getLeaderboard } from "../../api";
import styles from "./Leaderboard.module.css";

export const Leaderboard = () => {
  const [leaders, setLeaders] = useState([]);
  useEffect(() => {
    getLeaderboard()
      .then(res => {
        setLeaders(res.leaders);
      })
      .catch(error => console.log(error));
  }, []);

  return (
    <>
      <Header />
      <div className={styles.list}>
        {leaders.map((i, index) => {
          return (
            <div className={styles.item} key={i.id}>
              <p>{index + 1}</p>
              <p>{i.name}</p>
              <p>{i.time}</p>
            </div>
          );
        })}
      </div>
    </>
  );
};
