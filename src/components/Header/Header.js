import { useNavigate } from "react-router-dom";
import styles from "./Header.module.css";

export const Header = () => {
  const nav = useNavigate();
  const openLiderboard = () => {
    nav("/leaderboard");
  };
  return (
    <div className={styles.header}>
      <div>LOgo</div>
      <div onClick={openLiderboard}>Лидерборд</div>
      <div>User</div>
    </div>
  );
};
