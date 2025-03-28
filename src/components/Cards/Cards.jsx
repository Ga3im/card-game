import { shuffle } from "lodash";
import { useContext, useEffect, useState } from "react";
import { generateDeck } from "../../utils/cards";
import styles from "./Cards.module.css";
import { EndGameModal } from "../../components/EndGameModal/EndGameModal";
import { Button } from "../../components/Button/Button";
import { Card } from "../../components/Card/Card";
import { GameModeContext } from "../../context/gameModeContext";
import { useNavigate } from "react-router-dom";

// Игра закончилась
const STATUS_LOST = "STATUS_LOST";
const STATUS_WON = "STATUS_WON";
// Идет игра: карты закрыты, игрок может их открыть
const STATUS_IN_PROGRESS = "STATUS_IN_PROGRESS";
// Начало игры: игрок видит все карты в течении нескольких секунд
const STATUS_PREVIEW = "STATUS_PREVIEW";

let diffInSecconds;

function getTimerValue(startDate, endDate) {
  if (!startDate && !endDate) {
    return {
      minutes: 0,
      seconds: 0,
    };
  }

  if (endDate === null) {
    endDate = new Date();
  }

  diffInSecconds = Math.floor((endDate.getTime() - startDate.getTime()) / 1000);
  const minutes = Math.floor(diffInSecconds / 60);
  const seconds = diffInSecconds % 60;
  return {
    minutes,
    seconds,
  };
}

/**
 * Основной компонент игры, внутри него находится вся игровая механика и логика.
 * pairsCount - сколько пар будет в игре
 * previewSeconds - сколько секунд пользователь будет видеть все карты открытыми до начала игры
 */
let superGame1 = 3; // количество подсказки 1 суперсилы
let superGame2 = 3; // количество подсказки 2 суперсилы

export function Cards({ pairsCount = 3 }) {
  const { gameMode, setInGame, setGamerData, gamerData } = useContext(GameModeContext);
  let timerToStart = 5; // Таймер старта
  let attempts = gameMode ? 1 : 3; // Количество попыток
  const nav = useNavigate();
  const [previewSeconds, setPreviewSeconds] = useState(timerToStart);
  const [attempt, setAttempt] = useState(attempts);
  const [disableFirstHint, setDisableFirstHint] = useState(false);
  const [disableSecondHint, setDisableSecondHint] = useState(false);
  // В cards лежит игровое поле - массив карт и их состояние открыта\закрыта
  const [cards, setCards] = useState([]);
  const [openedCards, setOpenedCards] = useState([]);
  // Текущий статус игры
  const [status, setStatus] = useState(STATUS_PREVIEW);
  const [countOpenAllCards, setCountOpenAllCards] = useState(superGame1);
  const [countOpenTwoCards, setCountOpenTwoCards] = useState(superGame2);
  // Дата начала игры
  const [gameStartDate, setGameStartDate] = useState(null);
  // Дата конца игры
  const [gameEndDate, setGameEndDate] = useState(null);
  // Стейт для таймера, высчитывается в setInteval на основе gameStartDate и gameEndDate
  const [timer, setTimer] = useState({
    seconds: 0,
    minutes: 0,
  });
  const [gameSet, setGameSet] = useState(false);

  useEffect(() => {
    setInGame(true);
  }, []);

  const backToMain = () => {
    nav("/");
  };

  function finishGame(status = STATUS_LOST) {
    setGameEndDate(new Date());
    setStatus(status);
  }
  function startGame() {
    const startDate = new Date();
    setGameEndDate(null);
    setGameStartDate(startDate);
    setTimer(getTimerValue(startDate, null));
    setStatus(STATUS_IN_PROGRESS);
  }
  function resetGame() {
    setAttempt(attempts);
    setCountOpenAllCards(superGame1);
    setCountOpenTwoCards(superGame2);
    setPreviewSeconds(timerToStart);
    setGameStartDate(null);
    setGameEndDate(null);
    setTimer(getTimerValue(null, null));
    setStatus(STATUS_PREVIEW);
  }

  /**
   * Обработка основного действия в игре - открытие карты.
   * После открытия карты игра может пепереходит в следующие состояния
   * - "Игрок выиграл", если на поле открыты все карты
   * - "Игрок проиграл", если на поле есть две открытые карты без пары
   * - "Игра продолжается", если не случилось первых двух условий
   */
  const openCard = clickedCard => {
    // Если карта уже открыта, то ничего не делаем
    if (clickedCard.open) {
      return;
    }
    // Игровое поле после открытия кликнутой карты
    const nextCards = cards.map(card => {
      if (card.id !== clickedCard.id) {
        return card;
      }

      return {
        ...card,
        open: true,
      };
    });
    setCards(nextCards);

    const isPlayerWon = nextCards.every(card => card.open);

    // Победа - все карты на поле открыты
    if (isPlayerWon) {
      finishGame(STATUS_WON);
      return;
    }
    // Открытые карты на игровом поле
    const openCards = nextCards.filter(card => card.open);
    setOpenedCards(openCards);
    // Ищем открытые карты, у которых нет пары среди других открытых
    const openCardsWithoutPair = openCards.filter(card => {
      const sameCards = openCards.filter(openCard => card.suit === openCard.suit && card.rank === openCard.rank);

      if (sameCards.length < 2) {
        return true;
      }
      return false;
    });
    const playerLost = openCardsWithoutPair.length >= 2;

    if (playerLost) {
      setAttempt(attempt - 1);
      setTimeout(() => {
        openCardsWithoutPair[openCardsWithoutPair.length - 1].open = false;
      }, 500);

      if (attempt === 1) {
        setTimeout(() => {
          finishGame(STATUS_LOST);
        }, 500);
        return;
      }
    }
  };

  const isGameEnded = status === STATUS_LOST || status === STATUS_WON;
  // откртыие всех карт на 5 сек
  const openAllCards = () => {
    setDisableFirstHint(true);
    setGamerData({ ...gamerData, achievements: [] });
    setCountOpenAllCards(countOpenAllCards - 1);
    if (countOpenAllCards > 0) {
      cards.map(card => {
        card.open = true;
      });
      setTimeout(() => {
        cards.filter(card => {
          card.open = false;
          openedCards.filter(openedCard => {
            if (openedCard.open === card.open && card.suit === openedCard.suit && openedCard.rank === card.rank) {
              card.open = true;
            }
          });
        });
        setDisableFirstHint(false);
      }, 5000);
    }
  };

  //открывает случайную пару
  const openTwoCards = () => {
    setGamerData({ ...gamerData, achievements: [] });
    if (countOpenTwoCards > 0) {
      setDisableSecondHint(true);
      const randomCard = cards[Math.floor(Math.random() * cards.length)];

      if (!randomCard.open) {
        setCountOpenTwoCards(countOpenTwoCards - 1);
        randomCard.open = true;
        const open = cards.filter(card => {
          if (card.suit === randomCard.suit && card.rank === randomCard.rank) {
            return (card.open = true);
          }
        });
        setOpenedCards(open);
      }
      const isPlayerWon = cards.every(card => card.open);
      if (isPlayerWon) {
        finishGame(STATUS_WON);
      }
      setDisableSecondHint(false);
    }
  };

  // Игровой цикл
  useEffect(() => {
    // В статусах кроме превью доп логики не требуется
    if (status !== STATUS_PREVIEW) {
      return;
    }

    // В статусе превью мы
    if (pairsCount > 36) {
      alert("Столько пар сделать невозможно");
      return;
    }

    setCards(() => {
      return shuffle(generateDeck(pairsCount, 10));
    });
  }, [status, pairsCount]);

  // таймер начала
  useEffect(() => {
    let timer = setTimeout(() => {
      setPreviewSeconds(previewSeconds - 1);
    }, 1000);
    if (previewSeconds < 1) {
      clearTimeout(timer);
      startGame();
      setGameSet(true);
    }
  }, [previewSeconds]);

  // Обновляем значение таймера в интервале
  useEffect(() => {
    const intervalId = setInterval(() => {
      setTimer(getTimerValue(gameStartDate, gameEndDate));
    }, 300);
    return () => {
      clearInterval(intervalId);
    };
  }, [gameStartDate, gameEndDate]);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.timer}>
          {status === STATUS_PREVIEW ? (
            <div>
              <p className={styles.previewText}>Запоминайте пары!</p>
              <p className={styles.previewDescription}>Игра начнется через {previewSeconds} секунд</p>
            </div>
          ) : (
            <>
              <div className={styles.timerValue}>
                <div className={styles.timerDescription}>min</div>
                <div>{timer.minutes.toString().padStart("2", "0")}</div>
              </div>
              :
              <div className={styles.timerValue}>
                <div className={styles.timerDescription}>sec</div>
                <div>{timer.seconds.toString().padStart("2", "0")}</div>
              </div>
            </>
          )}
        </div>
        {status === STATUS_IN_PROGRESS ? <Button onClick={resetGame}>Начать заново</Button> : null}
        <button className={styles.backButton} onClick={backToMain}>
          Назад
        </button>
      </div>
      {gameSet && (
        <div className={styles.info}>
          <p className={styles.attemt}>Количество попыток: {attempt}</p>
          <div className={styles.hints}>
            <div>
              <button disabled={disableFirstHint} onClick={openAllCards} className={styles.buttunHint}></button>
              <p className={styles.count}>{countOpenAllCards > 0 ? countOpenAllCards : 0}</p>
            </div>
            <div>
              <button disabled={disableSecondHint} onClick={openTwoCards} className={styles.buttunHintTwo}></button>
              <p className={styles.count}>{countOpenTwoCards > 0 ? countOpenTwoCards : 0}</p>
            </div>
          </div>
        </div>
      )}
      <div className={styles.cards}>
        {cards.map(card => (
          <Card
            key={card.id}
            onClick={() => openCard(card)}
            open={status !== STATUS_IN_PROGRESS ? true : card.open}
            suit={card.suit}
            rank={card.rank}
          />
        ))}
      </div>

      {isGameEnded ? (
        <div className={styles.modalContainer}>
          <EndGameModal
            isWon={status === STATUS_WON}
            time={diffInSecconds}
            gameDurationSeconds={timer.seconds}
            gameDurationMinutes={timer.minutes}
            onClick={resetGame}
          />
        </div>
      ) : null}
    </div>
  );
}
