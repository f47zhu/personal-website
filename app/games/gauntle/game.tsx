"use client"

import { useState, useEffect, useRef } from "react"
import { createPortal } from "react-dom";

import { FunHighlight } from "../../effects/waveEffect";

export function Game() {
  const [gameState, setGameState] = useState<string>("intro");
  const [userInput, setUserInput] = useState<string>("");
  const [tryAgain, setTryAgain] = useState<string>("");
  const [currentLevelList, setCurrentLevelList] = useState<number>(0);
  const [currentLevelIdx, setCurrentLevelIdx] = useState<number>(0);
  const [currentLevel, setCurrentLevel] = useState<number>(0);
  const [exitConfirm, setExitConfirm] = useState<boolean>(false);
  const startTime = useRef<number>(0);
  const usedWords = useRef<Set<string>>(new Set<string>);

  const levelLists = [
    [0, 1, 5, 2, 3, 4]
  ];

  const levels = [
    {"length": 5, "desc": [<>Must contain the substring "UAR"</>], "verifier": (word: string) => word.includes("UAR")},
    {"length": 7, "desc": [<>Must not contain repeating letters</>], "verifier": (word: string) => (new Set(word)).size === word.length},
    {"length": 12, "desc": [<>Must be <i>exactly</i> 12 letters long</>], "verifier": (word: string) => word.length === 12},
    {"length": 6, "desc": [<>Must only consist of 3 unique letters</>], "verifier": (word: string) => (new Set(word)).size === 3},
    {"length": 10, "desc": [<>Must not contain repeating letters</>], "verifier": (word: string) => (new Set(word)).size === word.length},
    {"length": 10, "desc": [<>Must contain a letter that repeats 3 times throughout the word</>], "verifier": (word: string) => {
      for (let c = 65; c <= 90; ++c) {
        const pattern = new RegExp(String.fromCharCode(c), "g");
        if ((word.match(pattern) || []).length === 3) {
          return true;
        }
      }
      return false;
    }}
  ];

  useEffect(() => {
    setUserInput("");
    setCurrentLevel(levelLists[currentLevelList][currentLevelIdx]);
  }, [currentLevelIdx]);

  useEffect(() => {
    if (gameState === "gameplay") {
      setCurrentLevelIdx(0);
      startTime.current = Date.now();
      usedWords.current = new Set<string>();
    }
  }, [gameState]);

  async function verifyWord(word: string): Promise<boolean> {
    return fetch("https://api.dictionaryapi.dev/api/v2/entries/en/" + word).then((response) => response.ok);
  }

  async function handleSubmission(): Promise<void> {
    if (userInput === "") {
      setTryAgain("Please enter a word!");
    } else if (userInput.length < levels[currentLevel]["length"]) {
      setTryAgain(`Word is shorter than ${levels[currentLevel]["length"]} letters!`);
    } else if (!(await verifyWord(userInput))) {
      setTryAgain("Word is not a valid English word!");
    } else if (!levels[currentLevel]["verifier"](userInput)) {
      setTryAgain("Word does not satisfy the given requirements!");
    } else if (usedWords.current.has(userInput)) {
      setTryAgain("Word has already been used before!");
    } else {
      setTryAgain("");
      usedWords.current.add(userInput);
      if (currentLevelIdx < 5) {
        setCurrentLevelIdx(currentLevelIdx + 1);
      } else {
        setGameState("results");
      }
    }
  }

  function formatTime(seconds: number): string {
    const hours = Math.floor(seconds / 3600);
    seconds %= 3600;
    const minutes = Math.floor(seconds / 60);
    seconds = Math.round((seconds % 60) * 10) / 10;
    return (hours !== 0 ? `${hours}:` : "")
         + (hours !== 0 ? `${String(minutes).padStart(2, "0")}:` : `${minutes}:`)
         + String(seconds).padStart(4, "0");
  }

  const screens: Record<string, React.ReactNode> = {
    "intro":
      <div className="flex flex-col gap-4 p-8 rounded-2xl border-2 border-gray-400 dark:border-gray-600 bg-white dark:bg-black">
        <h1 className="text-center text-4xl">
          <FunHighlight text="GAUNTLE" />
        </h1>
        <div className="flex flex-col gap-2">
          <h1 className="text-xl">
            Ready to enter the <FunHighlight text="GAUNTLE" />?
          </h1>
          <ul className="list-disc list-inside">
            <li>There will be 6 prompts that you must each answer with a valid English word.</li>
            <li>Each prompt will offer different restrictions to your word.</li>
            <li>You cannot use the same word twice.</li>
            <li>Complete all 6 as fast as you can for bragging rights :)</li>
          </ul>
        </div>
        <button
          className="w-25 place-self-center border-2 rounded-2xl py-1 px-2 border-gray-400 dark:border-gray-600"
          onClick={() => setGameState("gameplay")}
        >
          I'm ready!
        </button>
      </div>,
    "gameplay":
      <div
        className="relative flex flex-col gap-4 p-8 rounded-2xl border-2 border-gray-400 dark:border-gray-600 bg-white dark:bg-black"
        onKeyDown={e => {if (e.key === "Enter") handleSubmission();}}
      >
        <button
          className="absolute top-4 left-4 py-1.25 px-2.5 text-sm border-2 rounded-2xl border-gray-400 dark:border-gray-600"
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
                      onClick={() => {setExitConfirm(false); setGameState("intro");}}
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
        <h1 className="text-center text-4xl">
          <FunHighlight text="GAUNTLE" />
        </h1>
        <div className="flex flex-col gap-2">
          <p>
            <b>Word must be at least {levels[currentLevel]["length"]} letters long.</b>
          </p>
          <ul className="list-disc list-inside">
            {levels[currentLevel]["desc"].map(
              (text: React.ReactNode, idx: number) => <li key={idx}>{text}</li>
            )}
          </ul>
        </div>
        <label className="flex flex-row justify-between gap-2">
          <span className="self-center">Answer: </span>
          <div className="grow flex flex-row divide-x-2 divide-gray-400 dark:divide-gray-600">
            <span className="w-10 py-1 pl-1.25 pr-0.75 self-center text-center rounded-l-2xl border-l-2 border-y-2 border-gray-400 dark:border-gray-600 text-black dark:text-white">
              {userInput.length}
            </span>
            <input 
              className="w-full border-r-2 border-y-2 rounded-r-2xl py-0.5 px-1.5 border-gray-400 dark:border-gray-600"
              name="answer" value={userInput}
              onChange={e => {setTryAgain(""); setUserInput(e.target.value.toUpperCase().slice(0, 45));}}
            />
          </div>
          <button
            className="border-2 rounded-2xl py-1.25 px-2.5 text-sm border-gray-400 dark:border-gray-600"
            name="answer" onClick={handleSubmission}
          >
            Submit
          </button>
        </label>
        {(tryAgain !== "") && <div className="text-red-500">{tryAgain}</div>}
      </div>,
    "results":
      <div className="flex flex-col gap-4 p-8 rounded-2xl border-2 border-gray-400 dark:border-gray-600 bg-white dark:bg-black">
        <h1 className="text-center text-4xl">
          <FunHighlight text="GAUNTLE" />
        </h1>
        <div className="text-xl -mb-2">
          Congratulations!
        </div>
        <div>
          You completed today's <FunHighlight text="GAUNTLE" /> in <b>{formatTime((Date.now() - startTime.current) / 1000)}!</b>
        </div>
        <button
          className="w-30 place-self-center border-2 rounded-2xl py-0.5 px-1.5 border-gray-400 dark:border-gray-600"
          name="back" onClick={() => setGameState("intro")}
        >
          Back to start
        </button>
      </div>
  };

  return screens[gameState];
}
