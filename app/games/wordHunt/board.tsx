"use client"

import { FunHighlight } from "@/app/effects/waveEffect";
import { useState, useEffect, useRef, type MouseEvent } from "react";
import { createPortal } from "react-dom";

function randint(max: number) {
  return Math.floor(Math.random() * max);
}

export function Board({ size, guessedWordsRef, scoreRef, guessedWordsDefnsRef, calcScore, setScreen,
      resetGame }:
    { size: number, guessedWordsRef: React.RefObject<string[]>, scoreRef: React.RefObject<number>,
      guessedWordsDefnsRef: React.RefObject<Map<string, Object>>, calcScore: Function,
      setScreen: Function, resetGame: Function }) {
  interface Line {
    x: number,
    y: number,
    length: number,
    angle: number,
    weight: number
  }
  
  const [boardLetters, setBoardLetters] = useState<string[]>([]);

  const letterElementsRef = useRef<HTMLElement[]>([]);
  const [letterIdxs, setLetterIdxs] = useState<number[]>([]);
  const [mouseDown, setMouseDown] = useState<boolean>(false);
  const [mousePos, setMousePos] = useState<number[]>([0, 0]);
  const [lines, setLines] = useState<Line[]>([]);

  const [guess, setGuess] = useState<string>("");
  const [guessedWords, setGuessedWords] = useState<string[]>([]);
  const [score, setScore] = useState<number>(0);

  const [exitConfirm, setExitConfirm] = useState<boolean>(false);

  const startTime = useRef<number>(0);
  const [timeElapsed, setTimeElapsed] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const promisesRef = useRef<Promise<any>[]>([]);
  const loadingWordsRef = useRef<string[]>([]);
  
  const gameTimeRef = useRef<number>(60000);
  
  const coinsRef = useRef<number>(0);
  const [coins, setCoins] = useState<number>(0);

  const [shuffleBoardPrice, setShuffleBoardPrice] = useState<number>(2);
  const [animateShuffleBoard, setAnimateShuffleBoard] = useState<number>(-1);
  const [shuffleBoardSuccess, setShuffleBoardSuccess] = useState<boolean>(false);
  
  const [doubleScorePrice, setDoubleScorePrice] = useState<number>(3);
  const [animateDoubleScoreFail, setAnimateDoubleScoreFail] = useState<number>(-1);
  const [doubleScoreEndTime, setDoubleScoreEndTime] = useState<number>(0);
  const [doubleScoreActive, setDoubleScoreActive] = useState<boolean>(false);
  const bonusScoreRef = useRef<number>(0);
  const [bonusScore, setBonusScore] = useState<number>(0);

  const [addTimePrice, setAddTimePrice] = useState<number>(5);
  const [animateAddTime, setAnimateAddTime] = useState<number>(-1);
  const [addTimeSuccess, setAddTimeSuccess] = useState<boolean>(false);

  const probabilities: number[] = [
    0, 1202, 2112, 2924, 3692, 4423, 5118, 5746, 6348, 6940, 7372, 7770, 8058, 8329, 8590, 8820, 9031, 9240, 9443, 9625, 9774, 9885, 9954, 9971, 9982, 9989
  ];
  const probabilityLetters: string[] = [
    "E", "T", "A", "O", "I", "N", "S", "R", "H", "D", "L", "U", "C", "M", "F", "Y", "W", "G", "P", "B", "V", "K", "X", "Q", "J", "Z"
  ];

  function updateLines(letterElements: HTMLElement[]): void {
    const lineWeight = 10;

    let newLines: Line[] = [];
    for (let idx = 1; idx < letterElements.length; ++idx) {
      const [startRect, endRect]: DOMRect[] = [
        letterElements[idx - 1].getBoundingClientRect(),
        letterElements[idx].getBoundingClientRect()
      ];
      
      const [startCenterX, startCenterY]: number[] = [
        startRect["left"] + (startRect["width"] / 2) - (lineWeight / 2),
        startRect["top"] + (startRect["height"] / 2) - (lineWeight / 2)
      ];
      const [endCenterX, endCenterY]: number[] = [
        endRect["left"] + (endRect["width"] / 2) - (lineWeight / 2),
        endRect["top"] + (endRect["height"] / 2) - (lineWeight / 2)
      ];

      const lineLength = lineWeight +
          Math.sqrt((endCenterX - startCenterX) ** 2 + (endCenterY - startCenterY) ** 2);
      const lineAngle = Math.atan2(endCenterY - startCenterY, endCenterX - startCenterX);

      newLines.push({
        x: startCenterX,
        y: startCenterY,
        length: lineLength,
        angle: lineAngle,
        weight: lineWeight
      })
    };

    // manually calculate last letter to mouse pos
    if (letterElements.length > 0) {
      const startRect = letterElements[letterElements.length - 1].getBoundingClientRect();
      const [startCenterX, startCenterY]: number[] = [
        startRect["left"] + (startRect["width"] / 2) - (lineWeight / 2),
        startRect["top"] + (startRect["height"] / 2) - (lineWeight / 2)
      ];
      const [endCenterX, endCenterY]: number[] = [mousePos[0], mousePos[1]];

      const lineLength = lineWeight +
          Math.sqrt((endCenterX - startCenterX) ** 2 + (endCenterY - startCenterY) ** 2);
      const lineAngle = Math.atan2(endCenterY - startCenterY, endCenterX - startCenterX);

      newLines.push({
        x: startCenterX,
        y: startCenterY,
        length: lineLength,
        angle: lineAngle,
        weight: lineWeight
      })
    }

    setLines(newLines);
  }

  function verifyWord(word: string): boolean { // DOES NOT VERIFY IF IT'S A REAL WORD
    return (word.length >= 3) && !guessedWordsRef.current.includes(word);
  }

  function calcCoins(word: string): number {
    return (word.length >= 4) ? word.length - 3 : 0;
  }

  function pushToGuessedWordsDefns(word: string, responseJson: string): void {
    const primaryDefn = JSON.parse(responseJson)[0];
    guessedWordsDefnsRef.current.set(word, primaryDefn);
  }

  function pushToGuessedWords(word: string): boolean {
    let lo = 0, hi = guessedWordsRef.current.length, mid;
    while (lo < hi) { // upper_bound()
      mid = Math.floor((lo + hi) / 2);
      if (calcScore(word) <= calcScore(guessedWordsRef.current[mid])) {
        lo = mid + 1;
      } else {
        hi = mid;
      }
    }
    if (!guessedWordsRef.current.includes(word)) {
      guessedWordsRef.current.splice(lo, 0, word);
      setGuessedWords(guessedWordsRef.current);
      return true;
    }
    return false;
  }

  async function submitGuess(word: string, bonus: boolean): Promise<void> {
    loadingWordsRef.current.push(word);

    if (verifyWord(word)) {
      const wordResponse = await fetch("https://api.dictionaryapi.dev/api/v2/entries/en/" + word);
      if (wordResponse.ok && pushToGuessedWords(word)) {
        scoreRef.current += calcScore(word);
        setScore(scoreRef.current);
        if (bonus) {
          bonusScoreRef.current += calcScore(word);
          setBonusScore(bonusScoreRef.current);
        }
        coinsRef.current += calcCoins(word);
        setCoins(coinsRef.current);
        pushToGuessedWordsDefns(word, await wordResponse.text());
      }
    }

    loadingWordsRef.current.splice(loadingWordsRef.current.findIndex((elt) => (elt === word)), 1);
  }

  function randomLetter(): string {
    const target = 10000 * Math.random();
    let lo = 0, hi = probabilities.length, mid;
    while (lo < hi) { // lower_bound()
      mid = Math.ceil((lo + hi) / 2);
      if (probabilities[mid] > target) {
        hi = mid - 1;
      } else {
        lo = mid;
      }
    }

    return probabilityLetters[lo];
  }
  
  useEffect(() => { // letter distribution
    let newLetters: string[] = [];
    for (let i = 0; i < size * size; ++i) {
      newLetters.push(randomLetter());
    }
    setBoardLetters(newLetters);
  }, []);

  function idxToCoords(idx: number): number[] {
    return [Math.floor(idx / size), idx % size];
  }

  function verifyIdx(idx: number): boolean {
    if (letterIdxs.length === 0) {
      return true; // this is the first letter selected
    }
    const lastIdx = letterIdxs[letterIdxs.length - 1];
    if (lastIdx === idx) {
      return false; // prevent double adding
    }
    const [lastIdxCoords, idxCoords] = [idxToCoords(lastIdx), idxToCoords(idx)];
    return (
      Math.abs(lastIdxCoords[0] - idxCoords[0]) <= 1 &&
      Math.abs(lastIdxCoords[1] - idxCoords[1]) <= 1 // this is around the last letter
    );
  }

  function handleInput(e: MouseEvent<HTMLElement>, idx: number, letter: string, click: boolean = false): void {
    if (
      !(!click && letterIdxs.length === 0) && // prevent dragging onto first letter
      (mouseDown || click) && verifyIdx(idx) // detect mouse input, prevent weird jumps
    ) {
      if (!letterIdxs.includes(idx)) { // new letter, not backtracking
        letterElementsRef.current.push(e.currentTarget);
        setLetterIdxs(letterIdxs.concat(idx));
        setGuess(guess + letter);
        updateLines(letterElementsRef.current);
      } else if (idx === letterIdxs[letterIdxs.length - 2]) {
        letterElementsRef.current.pop();
        setLetterIdxs(letterIdxs.toSpliced(letterIdxs.length - 1, 1));
        setGuess(guess.substring(0, guess.length - 1));
        updateLines(letterElementsRef.current);
      }
    }
  }

  useEffect(() => {
    startTime.current = Date.now();
  }, []);

  useEffect(() => { // game timer
    const gameTimer = setTimeout(async () => {
      if (timeElapsed > doubleScoreEndTime) {
        setDoubleScoreActive(false);
      }
      if (timeElapsed > gameTimeRef.current) {
        setLoading(true);
        await Promise.all(promisesRef.current);
        promisesRef.current = [];
        setLoading(false);
        setScreen("results");
      }
      setTimeElapsed(Date.now() - startTime.current);
    }, 100);

    return () => clearInterval(gameTimer);
  }, [timeElapsed, doubleScoreEndTime]);

  const shuffleBoard = (cost: number) => { // fisher-yates shuffle
    if (coinsRef.current >= cost) {
      let newLetters: string[] = boardLetters;
      for (let idx = newLetters.length - 1; idx > 0; --idx) {
        const randomIdx = randint(idx + 1);
        [newLetters[idx], newLetters[randomIdx]] = [newLetters[randomIdx], newLetters[idx]];
      }
      setBoardLetters(newLetters);

      coinsRef.current -= cost;
      setCoins(coinsRef.current);

      setShuffleBoardSuccess(true);
      setShuffleBoardPrice(shuffleBoardPrice + 1);
    } else {
      setShuffleBoardSuccess(false);
    }

    setAnimateShuffleBoard((animateShuffleBoard + 1) % 2);
  }

  const setDoubleScore = (time: number, cost: number) => {
    if (coinsRef.current >= cost) {
      setDoubleScoreEndTime(timeElapsed + time);
      setDoubleScoreActive(true);
      
      coinsRef.current -= cost;
      setCoins(coinsRef.current);

      setDoubleScorePrice(doubleScorePrice + 1);
    } else {
      setAnimateDoubleScoreFail((animateDoubleScoreFail + 1) % 2);
    }
  }

  const addTime = (time: number, cost: number) => {
    if (coinsRef.current >= cost) {
      gameTimeRef.current += time;

      coinsRef.current -= cost;
      setCoins(coinsRef.current);

      setAddTimeSuccess(true);
      setAddTimePrice(addTimePrice + 1);
    } else {
      setAddTimeSuccess(false);
    }

    setAnimateAddTime((animateAddTime + 1) % 2);
  }

  const parentVariants: Record<number, string> = {
    4: "grid-cols-4 gap-5", // to-do: make these in terms of vmin instead
    5: "grid-cols-5 gap-4",
    6: "grid-cols-6 gap-3"
  };
  const tileVariants: Record<number, string> = {
    4: "size-[12.5vmin] text-[5vmin]",
    5: "size-[11vmin] text-[4.5vmin]",
    6: "size-[9.5vmin] text-[4vmin]"
  };
  const hitboxVariants: Record<number, string> = {
    4: "size-[11vmin]",
    5: "size-[9.5vmin]",
    6: "size-[8vmin]"
  };

  const handleMouseDown = () => setMouseDown(true);
  const handleMouseUp = () => {
    setMouseDown(false);
    promisesRef.current.push(submitGuess(guess, doubleScoreActive));
    setLines([]);
    letterElementsRef.current = [];
    setLetterIdxs([]);
    setGuess("");
  }
  const handleMouseMove = (e: MouseEvent) => {
    setMousePos([e.clientX, e.clientY]);
    updateLines(letterElementsRef.current);
  }

  return (
    <>
      {createPortal(
        <div className="animate-wave absolute inset-0 pointer-events-none">
          {lines.map((line, idx) =>
            <div
              key={idx}
              style={{
                position: "absolute",
                left: `${line.x}px`,
                top: `${line.y}px`,
                width: `${line.length}px`,
                height: `${line.weight}px`,
                transform: `rotate(${line.angle}rad)`,
                transformOrigin: `${line.weight / 2}px ${line.weight / 2}px`,
                backgroundColor: "red",
                opacity: 0.5,
                borderRadius: "calc(infinity * 1px)"
              }}
            />
          )}
        </div>,
        document.body
      )}
      <div
        className="select-none relative flex flex-col gap-4 p-8 rounded-2xl border-2 border-gray-400 dark:border-gray-600 bg-white dark:bg-black"
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseMove={(e) => handleMouseMove(e)}
        onMouseLeave={handleMouseUp}
      >
        {loading && (
          <div className="z-100 absolute inset-0 m-auto flex flex-col gap-6 place-content-center place-items-center bg-[#00000080]">
            <div className="relative">
              <div className="animate-spin-length2s relative size-[15vmin] rounded-full bg-conic from-[#00000000] to-black dark:to-white" />
            </div>
            <div className="text-center text-3xl">
              Time's up!
            </div>
          </div>
        )}
        <button
          className="absolute -top-11 left-0 py-1.25 px-2.5 text-sm border-2 rounded-2xl border-gray-400 dark:border-gray-600 bg-white dark:bg-black"
          onClick={() => setExitConfirm(true)}
        >
          Back
        </button>
        {exitConfirm && (
          <>
            {createPortal(
              <div
                className="animate-fade-in-length0.125s z-50 fixed w-screen h-screen bg-[#00000080]"
                onClick={() => setExitConfirm(false)}
              >
                <div
                  className="animate-pop-in-length0.125s absolute inset-0 m-auto w-75 h-50 p-8 flex flex-col gap-4 rounded-2xl border-2 border-gray-400 dark:border-gray-600 bg-white dark:bg-black"
                  onClick={e => e.stopPropagation()}
                >
                  <h1 className="text-center text-xl">
                    <b>Confirm exit</b>
                  </h1>
                  <p className="text-sm">
                    Are you sure you want to exit? <span className="text-red-700 dark:text-red-300">Your progress will not be saved!</span>
                  </p>
                  <div className="flex flex-row gap-8 place-self-center">
                    <button
                      className="py-1.5 px-3 border-2 rounded-2xl border-gray-400 dark:border-gray-600 text-red-700 dark:text-red-300"
                      onClick={() => {
                        setExitConfirm(false);
                        resetGame();
                      }}
                    >
                      Exit
                    </button>
                    <button
                      className="py-1.5 px-3 border-2 rounded-2xl border-gray-400 dark:border-gray-600"
                      onClick={() => setExitConfirm(false)}
                    >
                      Never mind
                    </button>
                  </div>
                </div>
              </div>, document.body
            )}
          </>
        )}
        <div className={`${parentVariants[size]} grid place-self-center`}>
          {boardLetters.map((letter, idx) =>
            <button
              key={idx}
              className={`${tileVariants[size]} place-items-center text-center rounded-2xl border-2 border-gray-400 dark:border-gray-600 bg-gray-200 dark:bg-gray-800`}
              onMouseDown={(e) => handleInput(e, idx, letter, true)}
            >
              <div
                className={`${hitboxVariants[size]} place-content-center rounded-2xl`}
                onMouseEnter={(e) => handleInput(e, idx, letter)}>
                <b>{letter}</b>
              </div>
            </button>
          )}
          <div className={`absolute top-0 bottom-0 my-auto left-[-30vmin] w-[30vmin] h-[60vmin] flex flex-col gap-2.5 p-5 border-2 rounded-2xl rounded-r-none border-gray-400 dark:border-gray-600 bg-black text-center`}>
            <h1 className="wrap-break-word text-lg flex-2 place-content-center">
              {guess === "" ? <span className="opacity-50">Guess goes here...</span>
                  : (doubleScoreActive ? <FunHighlight text={guess} /> : <b>{guess}</b>)}
            </h1>
            <div className="overflow-hidden flex-6 flex flex-col gap-2.5">
              <h2>
                Words achieved:
              </h2>
              <hr />
              <div className="flex flex-col gap-0 overflow-y-auto">
                {loadingWordsRef.current.map((word, idx) =>
                  <div
                    key={idx}
                    className="animate-pulse brightness-75 text-center"
                  >
                    Verifying <b>{word}</b>...
                  </div>
                )}
                {guessedWords.map((word, idx) => (
                  <div
                    key={idx}
                    className="flex flex-row"
                  >
                    <span className="grow">{word}</span>
                    <span>{calcScore(word)}</span>
                  </div>
                ))}
              </div>
            </div>
            <h1 className="flex-1">
              Total score: <b>{score + bonusScore}</b>
              {bonusScore !== 0 && (
                <div className="text-[10px]">
                  (including <b>{bonusScore}</b> bonus points)
                </div>
              )}
            </h1>
          </div>
          <div className={`absolute top-0 bottom-0 my-auto right-[-30vmin] w-[30vmin] h-[60vmin] flex flex-col gap-2.5 p-5 border-2 rounded-2xl rounded-l-none border-gray-400 dark:border-gray-600 bg-black text-center`}>
            <div className="flex-2 flex flex-col gap-2 wrap-break-word place-content-center">
              <h1 className="text-lg">
                Time left: {
                  doubleScoreActive ? (
                    <FunHighlight text={String(Math.ceil((gameTimeRef.current - timeElapsed) / 1000))} />
                  ) : (
                    <span className={
                        `${(gameTimeRef.current - timeElapsed <= gameTimeRef.current / 6) ? "text-red-300" :
                          ((gameTimeRef.current - timeElapsed <= gameTimeRef.current / 2) ? "text-yellow-300" :
                          "text-green-300")}`}>
                      <b>{Math.ceil((gameTimeRef.current - timeElapsed) / 1000)}</b>
                    </span>
                  )
                }<br />
              </h1>
              <h3>
                Total coins: <b>{coins}</b>
              </h3>
            </div>
            <div className="flex-7 flex flex-col gap-2.5">
              <h2>
                Powerups:
              </h2>
              <hr />
              <div className="flex flex-col gap-2">
                <button
                  className="overflow-hidden relative p-2 border-2 rounded-2xl border-gray-400 dark:border-gray-600"
                  onClick={() => shuffleBoard(shuffleBoardPrice)}
                >
                  <div
                    key={animateShuffleBoard}
                    className={`${(animateShuffleBoard !== -1) ? "animate-flash" : "hidden"} absolute inset-0 m-auto h-full opacity-50
                        ${shuffleBoardSuccess ? "bg-green-500" : "bg-red-500"}`}
                  />
                  <div>
                    Shuffle board <span
                    className={`${(coins < shuffleBoardPrice) ? "text-red-700 dark:text-red-300" : ""} self-center`}>
                      ({shuffleBoardPrice} coins)
                    </span>
                  </div>
                </button>
                <button
                  id={"doubleScoreButton"}
                  className={`overflow-hidden relative p-2 border-2 rounded-2xl border-gray-400 dark:border-gray-600`}
                  onClick={() => setDoubleScore(10000, doubleScorePrice)}
                >
                  <div
                    className={`${doubleScoreEndTime < timeElapsed ? "hidden" : "block"} animate-wave absolute inset-0 m-auto h-full bg-green-500 opacity-50`}
                    style={{
                      width: (doubleScoreEndTime - timeElapsed) / 10000
                       * (document.getElementById("doubleScoreButton") ? 
                          document.getElementById("doubleScoreButton")!.getBoundingClientRect().width
                          : 0)
                    }}
                  />
                  <div
                    key={animateDoubleScoreFail}
                    className={`${(animateDoubleScoreFail !== -1) ? "animate-flash" : "hidden"} absolute inset-0 m-auto h-full opacity-50
                        bg-red-500`}
                  />
                  <div>
                    x2 score for 10 secs <span
                    className={`${(coins < doubleScorePrice) ? "text-red-700 dark:text-red-300" : ""} self-center`}>
                      ({doubleScorePrice} coins)
                    </span>
                  </div>
                </button>
                <button
                  className="overflow-hidden relative p-2 border-2 rounded-2xl border-gray-400 dark:border-gray-600"
                  onClick={() => addTime(10000, addTimePrice)}
                >
                  <div
                    key={animateAddTime}
                    className={`${(animateAddTime !== -1) ? "animate-flash" : "hidden"} absolute inset-0 m-auto h-full opacity-50
                        ${addTimeSuccess ? "bg-green-500" : "bg-red-500"}`}
                  />
                  <div>
                    +10 secs <span
                    className={`${(coins < addTimePrice) ? "text-red-700 dark:text-red-300" : ""} self-center`}>
                      ({addTimePrice} coins)
                    </span>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
