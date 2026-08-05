"use client"

import { useState, useEffect, useRef, type MouseEvent } from "react";
import { createPortal } from "react-dom";

import { FunHighlight } from "@/app/effects/waveEffect";
import { validateWord } from "./wordValidator";
import { solve } from "./gameSolver";

function randint(max: number) {
  return Math.floor(Math.random() * max);
}

interface Solution {
  "word": string,
  "visited": Set<number>
}

interface Stats {
  "lettersUsed": string[][],
  "solutions": Solution[][],
  "shuffleBoardCount": number,
  "doubleScoreCount": number,
  "addTimeCount": number,
  "coinsEarned": number,
  "coinsUsed": number
}

interface Line {
  x: number,
  y: number,
  length: number,
  angle: number,
  weight: number
}

export function Board({ gridLength, initialGameTime, guessedWordsRef, scoreRef, bonusScoreRef,
      coinsRef, statsRef, calcScore, calcCoins, setScreen, resetGame }:
    { gridLength: number, initialGameTime: number, guessedWordsRef: React.RefObject<string[]>,
      scoreRef: React.RefObject<number>, bonusScoreRef: React.RefObject<number>,
      coinsRef: React.RefObject<number>, statsRef: React.RefObject<Stats>, calcScore: Function,
      calcCoins: Function, setScreen: Function, resetGame: Function }) {
  const [boardLetters, setBoardLetters] = useState<string[]>([]);

  const letterElementsRef = useRef<HTMLElement[]>([]);
  const [letterIdxs, setLetterIdxs] = useState<number[]>([]);
  const [mouseDown, setMouseDown] = useState<boolean>(false);
  const [mousePos, setMousePos] = useState<number[]>([0, 0]);
  const [lines, setLines] = useState<Line[]>([]);

  const [guess, setGuess] = useState<string>("");
  const guessedStringsRef = useRef<Map<string, Promise<boolean>>>(new Map<string, Promise<boolean>>());
  const [guessColor, setGuessColor] = useState<string>("");

  const [guessedWords, setGuessedWords] = useState<string[]>(guessedWordsRef.current);
  const [score, setScore] = useState<number>(scoreRef.current);
  const [coins, setCoins] = useState<number>(coinsRef.current);

  const [exitConfirm, setExitConfirm] = useState<boolean>(false);

  const startTime = useRef<number>(0);
  const [timeElapsed, setTimeElapsed] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const promisesRef = useRef<Promise<any>[]>([]);
  
  const gameTimeRef = useRef<number>(initialGameTime * 1000);
  const gameTimerDivRef = useRef<HTMLDivElement>(null);
  const doubleScoreTimerDivRef = useRef<HTMLDivElement>(null);

  const [shuffleBoardPrice, setShuffleBoardPrice] = useState<number>(2);
  const [animateShuffleBoard, setAnimateShuffleBoard] = useState<number>(-1);
  const [shuffleBoardSuccess, setShuffleBoardSuccess] = useState<boolean>(false);
  
  const [doubleScorePrice, setDoubleScorePrice] = useState<number>(3);
  const [animateDoubleScoreFail, setAnimateDoubleScoreFail] = useState<number>(-1);
  const [doubleScoreStartTime, setDoubleScoreStartTime] = useState<number>(0);
  const [doubleScoreEndTime, setDoubleScoreEndTime] = useState<number>(0);
  const [doubleScoreActive, setDoubleScoreActive] = useState<boolean>(false);
  const [bonusScore, setBonusScore] = useState<number>(0);

  const [addTimePrice, setAddTimePrice] = useState<number>(5);
  const [animateAddTime, setAnimateAddTime] = useState<number>(-1);
  const [addTimeSuccess, setAddTimeSuccess] = useState<boolean>(false);

  const COIN_VALUE = 200;

  const probabilities: number[] = [
    0, 1202, 2112, 2924, 3692, 4423, 5118, 5746, 6348, 6940, 7372, 7770, 8058, 8329, 8590, 8820, 9031, 9240, 9443, 9625, 9774, 9885, 9954, 9971, 9982, 9989
  ];
  const probabilityLetters: string[] = [
    "E", "T", "A", "O", "I", "N", "S", "R", "H", "D", "L", "U", "C", "M", "F", "Y", "W", "G", "P", "B", "V", "K", "X", "Q", "J", "Z"
  ];

  useEffect(() => { // letter distribution
    statsRef.current["lettersUsed"] = [];

    let newLetters: string[] = [];
    let letterFrequency: Record<string, number> = {};
    for (let i = 0; i < gridLength * gridLength; ++i) {
      let letter = randomLetter();
      while ((letter in letterFrequency) && (letterFrequency[letter] >= gridLength)) {
        letter = randomLetter();
      }
      if (letter in letterFrequency) {
        ++letterFrequency[letter];
      } else {
        letterFrequency[letter] = 1;
      }

      newLetters.push(letter);
    }

    setBoardLetters(newLetters);
    
    statsRef.current["lettersUsed"].push(newLetters);
    statsRef.current["solutions"].push(solve(gridLength, newLetters, calcScore)); // will break on strict mode
  }, []);

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
        handleMouseUp();
        await Promise.all(promisesRef.current); // wait for words to process
        promisesRef.current = [];
        bonusScoreRef.current += coinsRef.current * COIN_VALUE; // convert unused coins
        setLoading(false);
        
        setScreen("results");
      }
      setTimeElapsed(Date.now() - startTime.current);
    }, 100);

    return () => clearInterval(gameTimer);
  }, [timeElapsed, doubleScoreEndTime]);

  function randomLetter(): string {
    const target = 10000 * Math.random();
    let lo = 0, hi = probabilities.length - 1, mid;
    while (lo < hi) { // upper_bound()
      mid = Math.ceil((lo + hi) / 2);
      if (probabilities[mid] > target) {
        hi = mid - 1;
      } else {
        lo = mid;
      }
    }

    return probabilityLetters[lo];
  }

  function updateLines(): void {
    const LINE_WEIGHT = 10;

    let newLines: Line[] = [];
    for (let idx = 1; idx < letterElementsRef.current.length; ++idx) {
      const [startRect, endRect]: DOMRect[] = [
        letterElementsRef.current[idx - 1].getBoundingClientRect(),
        letterElementsRef.current[idx].getBoundingClientRect()
      ];
      
      const [startCenterX, startCenterY]: number[] = [
        startRect["left"] + (startRect["width"] / 2) - (LINE_WEIGHT / 2),
        startRect["top"] + (startRect["height"] / 2) - (LINE_WEIGHT / 2)
      ];
      const [endCenterX, endCenterY]: number[] = [
        endRect["left"] + (endRect["width"] / 2) - (LINE_WEIGHT / 2),
        endRect["top"] + (endRect["height"] / 2) - (LINE_WEIGHT / 2)
      ];

      const lineLength = LINE_WEIGHT +
          Math.sqrt((endCenterX - startCenterX) ** 2 + (endCenterY - startCenterY) ** 2);
      const lineAngle = Math.atan2(endCenterY - startCenterY, endCenterX - startCenterX);

      newLines.push({
        x: startCenterX,
        y: startCenterY,
        length: lineLength,
        angle: lineAngle,
        weight: LINE_WEIGHT
      })
    };

    // manually calculate last letter to mouse pos
    if (letterElementsRef.current.length > 0) {
      const startRect = letterElementsRef.current[letterElementsRef.current.length - 1].getBoundingClientRect();
      const [startCenterX, startCenterY]: number[] = [
        startRect["left"] + (startRect["width"] / 2) - (LINE_WEIGHT / 2),
        startRect["top"] + (startRect["height"] / 2) - (LINE_WEIGHT / 2)
      ];
      const [endCenterX, endCenterY]: number[] = [mousePos[0], mousePos[1]];

      const lineLength = LINE_WEIGHT +
          Math.sqrt((endCenterX - startCenterX) ** 2 + (endCenterY - startCenterY) ** 2);
      const lineAngle = Math.atan2(endCenterY - startCenterY, endCenterX - startCenterX);

      newLines.push({
        x: startCenterX,
        y: startCenterY,
        length: lineLength,
        angle: lineAngle,
        weight: LINE_WEIGHT
      })
    }

    setLines(newLines);
  }

  async function updateGuessColor(guess: string): Promise<void> {
    const colorVariants: Record<string, string> = {
      "invalid": "bg-gray-300 dark:bg-gray-700",
      "guessed": "bg-yellow-100 dark:bg-yellow-950",
      "valid": "bg-green-200 dark:bg-green-900"
    };

    if (guess.length >= 3) {
      let verdict = "invalid";
      if (await guessedStringsRef.current.get(guess)) {
        verdict = guessedWordsRef.current.includes(guess) ? "guessed" : "valid";
      }
      setGuessColor(colorVariants[verdict]);
    } else {
      setGuessColor(colorVariants["invalid"]);
    }
  }

  function calcTimerDivClipPath(divRef: React.RefObject<HTMLDivElement | null>, progressRatio: number): string {
    if (divRef.current) {
      const rect = divRef.current.getBoundingClientRect();
      const [centerX, centerY] = [(rect.width / 2), (rect.height / 2)];
      const radius = Math.sqrt((rect.width / 2) ** 2 + (rect.height / 2) ** 2);
      const endAngle = Math.min(1, progressRatio) * 2 * Math.PI;
      const [endX, endY] = [centerX + radius * Math.sin(endAngle), centerY - radius * Math.cos(endAngle)];
      const largeArcFlag = (endAngle < Math.PI) ? 1 : 0;
      return `path("M ${centerX},${centerY} v -${radius} A ${radius} ${radius} 0 ${largeArcFlag} 0 ${endX},${endY} Z")`;
    }
    return "";
  }

  function pushToGuessedWords(word: string): boolean {
    let lo = 0, hi = guessedWordsRef.current.length, mid;
    while (lo < hi) { // assuming reverse sorted list, returns first idx where elt > list[idx]
      mid = Math.floor((lo + hi) / 2);
      if (calcScore(guessedWordsRef.current[mid]) >= calcScore(word)) {
        lo = mid + 1;
      } else {
        hi = mid;
      }
    }
    if (!guessedWordsRef.current.includes(word)) { // avoid race condition
      guessedWordsRef.current.splice(lo, 0, word);
      setGuessedWords(guessedWordsRef.current);
      return true;
    }
    return false;
  }

  async function submitGuess(word: string, bonus: boolean): Promise<void> {
    if (word.length >= 3) {
      const valid = await guessedStringsRef.current.get(word);
      if (valid && !guessedWordsRef.current.includes(word) && pushToGuessedWords(word)) {
        scoreRef.current += calcScore(word);
        setScore(scoreRef.current);
        if (bonus) {
          bonusScoreRef.current += calcScore(word);
          setBonusScore(bonusScoreRef.current);
        }
        coinsRef.current += calcCoins(word);
        setCoins(coinsRef.current);
        statsRef.current["coinsEarned"] += calcCoins(word);
      }
    }
  }

  async function checkGuess(word: string): Promise<void> {
    if (word.length >= 3 && !guessedStringsRef.current.has(word)) {
      guessedStringsRef.current.set(word, validateWord(word));
    }
  }

  function idxToCoords(idx: number): number[] {
    return [Math.floor(idx / gridLength), idx % gridLength];
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
      let newGuess = guess;
      if (!letterIdxs.includes(idx)) { // new letter, not backtracking
        letterElementsRef.current.push(e.currentTarget);
        setLetterIdxs(letterIdxs.concat(idx));
        newGuess = guess + letter;
      } else if (idx === letterIdxs[letterIdxs.length - 2]) { // backtracking
        letterElementsRef.current.pop();
        setLetterIdxs(letterIdxs.toSpliced(letterIdxs.length - 1, 1));
        newGuess = guess.substring(0, guess.length - 1);
      }
      setGuess(newGuess);
      checkGuess(newGuess);
      updateLines();
      updateGuessColor(newGuess);
    }
  }

  const shuffleBoard = (cost: number) => { // fisher-yates shuffle
    if (coinsRef.current >= cost) {
      let newLetters: string[] = [...boardLetters];
      for (let idx = newLetters.length - 1; idx > 0; --idx) {
        const randomIdx = randint(idx + 1);
        [newLetters[idx], newLetters[randomIdx]] = [newLetters[randomIdx], newLetters[idx]];
      }
      setBoardLetters(newLetters);

      statsRef.current["lettersUsed"].push(newLetters);
      statsRef.current["solutions"].push(solve(gridLength, newLetters, calcScore));

      coinsRef.current -= cost;
      setCoins(coinsRef.current);

      setShuffleBoardSuccess(true);
      setShuffleBoardPrice(shuffleBoardPrice + 1);
      statsRef.current["shuffleBoardCount"] += 1;
      statsRef.current["coinsUsed"] += cost;
    } else {
      setShuffleBoardSuccess(false);
    }

    setAnimateShuffleBoard((animateShuffleBoard + 1) % 2);
  }

  const setDoubleScore = (time: number, cost: number) => {
    if (coinsRef.current >= cost) {
      setDoubleScoreStartTime(timeElapsed);
      setDoubleScoreEndTime(timeElapsed + time);
      setDoubleScoreActive(true);
      
      coinsRef.current -= cost;
      setCoins(coinsRef.current);

      setDoubleScorePrice(doubleScorePrice + 1);
      statsRef.current["doubleScoreCount"] += 1;
      statsRef.current["coinsUsed"] += cost;
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
      statsRef.current["addTimeCount"] += 1;
      statsRef.current["coinsUsed"] += cost;
    } else {
      setAddTimeSuccess(false);
    }

    setAnimateAddTime((animateAddTime + 1) % 2);
  }

  const parentVariants: Record<number, string> = {
    4: "grid-cols-4 gap-[3vmin]",
    5: "grid-cols-5 gap-[2.5vmin]",
    6: "grid-cols-6 gap-[2vmin]"
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
    updateLines();
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
        className="-z-20 select-none relative flex flex-col gap-4 p-2 rounded-2xl border-2 border-gray-400 dark:border-gray-600 bg-[#FFFFFF80] dark:bg-[#00000080]"
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseMove={(e) => handleMouseMove(e)}
        onMouseLeave={handleMouseUp}
      >
        <div
          className="-z-10 select-none absolute inset-0 m-auto rounded-2xl bg-green-700 dark:bg-green-300"
          ref={gameTimerDivRef}
          style={{
            filter: `hue-rotate(-${(timeElapsed / gameTimeRef.current) * 180}deg)`,
            clipPath: calcTimerDivClipPath(gameTimerDivRef, timeElapsed / gameTimeRef.current)
          }}
        />
        {doubleScoreActive && (
          <div
            className="-z-9 select-none absolute inset-1 m-auto rounded-xl bg-black dark:bg-white"
            ref={doubleScoreTimerDivRef}
            style={{
              clipPath: calcTimerDivClipPath(doubleScoreTimerDivRef, (timeElapsed - doubleScoreStartTime) / (doubleScoreEndTime - doubleScoreStartTime))
            }}
          />
        )}
        {loading && (
          <div className="z-100 absolute inset-0 m-auto flex flex-col gap-6 place-content-center place-items-center rounded-2xl bg-[#00000080]">
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
        <div className={`${parentVariants[gridLength]} p-6 rounded-lg grid place-self-center bg-white dark:bg-black`}>
          {boardLetters.map((letter, idx) =>
            <button
              key={idx}
              className={`${tileVariants[gridLength]} place-items-center text-center rounded-2xl border-2 border-gray-400 dark:border-gray-600
                  ${letterIdxs.includes(idx) ? guessColor : "bg-gray-200 dark:bg-gray-800"}`}
              onMouseDown={(e) => handleInput(e, idx, letter, true)}
            >
              <div
                className={`${hitboxVariants[gridLength]} ${doubleScoreActive ? "animate-wave" : ""} place-content-center rounded-2xl`}
                onMouseEnter={(e) => handleInput(e, idx, letter)}
              >
                <b>{letter}</b>
              </div>
            </button>
          )}
          <div className={`absolute top-0 bottom-0 my-auto left-[-30vmin] w-[30vmin] h-[60vmin] flex flex-col gap-2.5 p-5 border-2 rounded-2xl rounded-r-none border-gray-400 dark:border-gray-600 bg-white dark:bg-black text-center`}>
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
          <div className={`absolute top-0 bottom-0 my-auto right-[-30vmin] w-[30vmin] h-[60vmin] flex flex-col gap-2.5 p-5 border-2 rounded-2xl rounded-l-none border-gray-400 dark:border-gray-600 bg-white dark:bg-black text-center`}>
            {loading && (
              <div className="z-100 absolute inset-0 m-auto rounded-2xl bg-[#00000080]" />
            )}
            <div className="flex-2 flex flex-col gap-2 wrap-break-word place-content-center">
              <h1 className="text-lg">
                Time left: <span
                  className="text-green-700 dark:text-green-300"
                  style={{
                    filter: `hue-rotate(-${(timeElapsed / gameTimeRef.current) * 180}deg)`
                  }}
                >
                  <b>{Math.ceil((gameTimeRef.current - timeElapsed) / 1000)}</b>
                </span>
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
