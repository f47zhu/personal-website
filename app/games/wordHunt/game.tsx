"use client"

import { useState, useRef } from "react"

import { FunHighlight } from "../../effects/waveEffect";
import { CustomHr } from "../../customHr";
import { Board } from "./board";
import { PopUp } from "@/app/popUp";

type Stats = {
  "lettersUsed": string[][],
  "solutions": string[][],
  "shuffleBoardCount": number,
  "doubleScoreCount": number,
  "addTimeCount": number,
  "coinsEarned": number,
  "coinsUsed": number
}

const INITIAL_GAME_TIME: number = 60;
const probabilityMap: Record<string, number> = {
  "E": 0.1202,
  "T": 0.0910,
  "A": 0.0812,
  "O": 0.0768,
  "I": 0.0731,
  "N": 0.0695,
  "S": 0.0628,
  "R": 0.0602,
  "H": 0.0592,
  "D": 0.0432,
  "L": 0.0398,
  "U": 0.0288,
  "C": 0.0271,
  "M": 0.0261,
  "F": 0.0230,
  "Y": 0.0211,
  "W": 0.0209,
  "G": 0.0203,
  "P": 0.0182,
  "B": 0.0149,
  "V": 0.0111,
  "K": 0.0069,
  "X": 0.0017,
  "Q": 0.0011,
  "J": 0.0010,
  "Z": 0.0007
};

function calcScore(word: string): number {
  const scoreNum = 100;
  let total = 0;
  for (const letter of word) {
    total += scoreNum * (1 - (probabilityMap[letter] * 4));
  }
  total *= Math.exp(word.length / 5);
  return Math.round(total);
}

function DefinitionCard({ word, guessedWordsDefnsRef }:
      { word: string, guessedWordsDefnsRef: React.RefObject<Map<string, any>> }) {
  const [wordInfo, setWordInfo] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const WORD_NOT_FOUND: number = -1;


  async function fetchWordInfo(): Promise<void> {
    setLoading(true);
    
    if (!guessedWordsDefnsRef.current.has(word)) {
      const response: Response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
      if (response.ok) {
        const primaryDefn: any = JSON.parse(await response.text())[0];
        guessedWordsDefnsRef.current.set(word, primaryDefn);
      } else {
        guessedWordsDefnsRef.current.set(word, WORD_NOT_FOUND);
      }
    }
    setWordInfo(guessedWordsDefnsRef.current.get(word));

    setLoading(false);
  }

  return (
    <div onClick={fetchWordInfo}>
      <PopUp
        clickable={
          <button className="p-4 rounded-2xl bg-gray-200 dark:bg-gray-800">
            {word}
            <div className="text-[10px]">{calcScore(word)} pts.</div>
          </button>
        }
      >
        <div className="relative flex flex-col gap-6 w-[50vw] h-max-[50vh] p-8 overflow-y-auto">
          {loading ? (
            <>
              <div className="place-self-center animate-spin-length2s relative size-[15vmin] rounded-full bg-conic from-[#00000000] to-black dark:to-white" />
              <div className="text-center text-xl">
                Loading definition...
              </div>
            </>
          ) : (wordInfo === WORD_NOT_FOUND) ? (
            <div className="flex flex-col gap-4 text-center">
              <div className="text-3xl">
                Definition not found!
              </div>
              <div className="flex flex-col gap-3">
                <div>
                  The <a href="https://dictionaryapi.dev/" target="_blank">
                    free dictionary API
                  </a> that I'm using seems to disagree with the <a href="https://github.com/dwyl/english-words" target="_blank">
                    free word bank
                  </a> that I'm using over the existence of the word <b>{word}.</b>
                </div>
                <div className="text-xs">
                  Perhaps you can find a definition for this niche word in some corner of the internet!
                </div>
              </div>
            </div>
          ) : (
            <>
              <div className="flex flex-row text-3xl">
                <span className="ml-1 grow">
                  <b>{word}</b>
                </span>
                <span className="text-gray-500">
                  {wordInfo.phonetic}
                </span>
              </div>
              <div className="flex flex-col gap-4">
                {wordInfo.meanings.map((meaning: any, idx: number) =>
                  <div
                    key={idx}
                    className="flex flex-col gap-3 p-4.5 border-2 rounded-2xl border-gray-300 dark:border-gray-700"
                  >
                    <div className="text-lg">
                      As a{/^[aeiou]/i.test(meaning.partOfSpeech) && "n"} <i>{meaning.partOfSpeech}:</i>
                    </div>
                    <div className="flex flex-col gap-2">
                      {meaning.definitions.map((defn: any, idx: number) =>
                        <div
                          key={idx}
                          className="flex flex-col gap-1"
                        >
                          <div className="text-sm">
                            {idx + 1}: {defn.definition}
                          </div>
                          {defn.example && (
                            <div className="flex flex-row gap-2">
                              <div className="w-0.5 h-auto bg-gray-500" />
                              <div className="mt-1 text-[10px] text-gray-700 dark:text-gray-300">
                                {defn.example}
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </PopUp>
    </div>
  );
}

function MoreStats({ gridLength, scoreRef, bonusScoreRef, guessedWordsRef, statsRef }:
      { gridLength: number, scoreRef: React.RefObject<number>, bonusScoreRef: React.RefObject<number>,
        guessedWordsRef: React.RefObject<string[]>, statsRef: React.RefObject<Stats> }) {
  const [permutationIdx, setPermutationIdx] = useState<number>(0);
  // console.log("morestats render, permutationIdx:", permutationIdx);
  // console.log("lettersUsed at idx" + permutationIdx, statsRef.current["lettersUsed"]?.[permutationIdx]);

  const gridVariants: Record<number, string> = {
    4: "grid-cols-4",
    5: "grid-cols-5",
    6: "grid-cols-6"
  };
  const maxHeightVariants: Record<number, string> = {
    4: "max-h-47",
    5: "max-h-61",
    6: "max-h-67"
  };
  const shuffled: boolean = (statsRef.current["lettersUsed"].length > 1);


  function movePermutationIdx(idxChange: number) {
    const length = statsRef.current["lettersUsed"].length;
    idxChange = (idxChange % length) + length;
    setPermutationIdx((permutationIdx + idxChange) % length);
  }

  return (
    <PopUp
      clickable={
        <button className="p-4 border-2 rounded-2xl border-gray-400 dark:border-gray-600">
          More stats
        </button>
      }
    >
      <div className="flex flex-col gap-6 w-[50vw] h-max-[50vh] p-8 text-center overflow-y-auto">
        <h1 className="text-3xl">
          <b>More stats</b>
        </h1>
        <div className="flex flex-col place-items-center">
          <div className="flex flex-col gap-4 place-items-center p-4 rounded-2xl bg-gray-200 dark:bg-gray-800">
            <div className="flex flex-row gap-6 place-items-center">
              {shuffled && (
                <button
                  className="text-center text-2xl py-1 px-4 border-2 rounded-full border-gray-400 dark:border-gray-600"
                  onClick={() => movePermutationIdx(-1)}
                >
                  <div className="rotate-y-180">➔</div>
                </button>
              )}
              <div className="flex flex-col">
                <div className={`${shuffled ? "text-xl" : "text-2xl"}`}>Board stats</div>
                {shuffled && (
                  <div className="text-sm">
                    Permutation {permutationIdx + 1}/{statsRef.current["lettersUsed"].length}
                  </div>
                )}
              </div>
              {shuffled && (
                <button
                  className="text-center text-2xl py-1 px-4 border-2 rounded-full border-gray-400 dark:border-gray-600"
                  onClick={() => movePermutationIdx(1)}
                >
                  ➔
                </button>
              )}
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <div className="mb-1">Letters used</div>
                <CustomHr className="mb-2" />
                <div className={`${gridVariants[gridLength]} grid place-self-center place-items-center`}>
                  {statsRef.current["lettersUsed"][permutationIdx].map((letter: string, idx: number) =>
                    <span
                      key={idx}
                      className="inline-flex m-1 p-2 bg-gray-100 dark:bg-gray-900"
                    >
                      {letter}
                    </span>
                  )}
                </div>
              </div>
              <div>
                <div className="mb-1">All {statsRef.current["solutions"][permutationIdx].length} possible words</div>
                <CustomHr className="mb-4" />
                <div className={`${maxHeightVariants[gridLength]} overflow-y-auto`}>
                  {statsRef.current["solutions"][permutationIdx].map((word: string, idx: number) =>
                    <div
                      key={idx}
                      className="flex flex-row text-sm"
                    >
                      {guessedWordsRef.current.includes(word) ? (
                        <>
                          <span className="grow text-base"><b>{word}</b></span>
                          <span className="text-base"><b>{calcScore(word)}</b></span>
                        </>
                      ) : (
                        <>
                          <span className="grow">{word}</span>
                          <span>{calcScore(word)}</span>
                        </>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-3 items-end">
          <div className="text-lg mb-1">Raw score</div>
          <div className="text-lg mb-1">Bonus score</div>
          <div className="text-lg mb-1">Total score</div>
          <CustomHr className="mb-2" />
          <CustomHr className="mb-2" />
          <CustomHr className="mb-2" />
          <div className="text-lg">{scoreRef.current}</div>
          <div className="text-lg">{bonusScoreRef.current}</div>
          <div className="text-lg"><FunHighlight text={String(scoreRef.current + bonusScoreRef.current)} /></div>
        </div>
        <div className="grid grid-cols-3 items-end">
          <div className="text-lg mb-1">Coins used</div>
          <div className="text-lg mb-1">
            Coins left over
            <div className="text-[10px]">(and converted to points)</div>
          </div>
          <div className="text-lg mb-1">Total coins earned</div>
          <CustomHr className="mb-2" />
          <CustomHr className="mb-2" />
          <CustomHr className="mb-2" />
          <div className="text-lg">{statsRef.current["coinsUsed"]}</div>
          <div className="text-lg">{statsRef.current["coinsEarned"] - statsRef.current["coinsUsed"]}</div>
          <div className="text-lg"><FunHighlight text={String(statsRef.current["coinsEarned"])} /></div>
        </div>
        <div className="grid grid-cols-4 items-end">
          <div className="mb-1">Board shuffles</div>
          <div className="mb-1">Score doublers</div>
          <div className="mb-1">10 sec extensions</div>
          <div className="mb-1">Total powerups used</div>
          <CustomHr className="mb-2" />
          <CustomHr className="mb-2" />
          <CustomHr className="mb-2" />
          <CustomHr className="mb-2" />
          <div className="text-lg self-start">{statsRef.current["shuffleBoardCount"]}</div>
          <div className="text-lg self-start">{statsRef.current["doubleScoreCount"]}</div>
          <div className="text-lg self-start">
            {statsRef.current["addTimeCount"]}
            {(statsRef.current["addTimeCount"] > 0) && (
              <div className="pt-1 text-[10px]">
                (Total game time: {INITIAL_GAME_TIME + 10 * statsRef.current["addTimeCount"]}s)
              </div>
            )}
          </div>
          <div className="text-lg self-start"><FunHighlight text={String(
            statsRef.current["shuffleBoardCount"]
            + statsRef.current["doubleScoreCount"]
            + statsRef.current["addTimeCount"]
          )} /></div>
        </div>
      </div>
    </PopUp>
  );
}

export function Game() {
  const [screen, setScreen] = useState<string>("intro");
  const [gridLength, setGridLength] = useState<number>(0);
  const guessedWordsRef = useRef<string[]>([]); // to let state "collect" all async func calls
  const scoreRef = useRef<number>(0);
  const bonusScoreRef = useRef<number>(0);
  const guessedWordsDefnsRef = useRef<Map<string, any>>(new Map<string, Object>());
  const statsRef = useRef<Stats>({
    "lettersUsed": [],
    "solutions": [],
    "shuffleBoardCount": 0,
    "doubleScoreCount": 0,
    "addTimeCount": 0,
    "coinsEarned": 0,
    "coinsUsed": 0
  });
  const [animateCopyText, setAnimateCopyText] = useState<number>(-1);


  function copyShareableText(): void {
    const text = `franklinzhu.me's Word Hunt ${gridLength}x${gridLength}\n`
        + `🎯 Score: ${scoreRef.current + bonusScoreRef.current}\n`
        + `⚡ Powerups used: ${
            statsRef.current["shuffleBoardCount"]
            + statsRef.current["doubleScoreCount"]
            + statsRef.current["addTimeCount"]
          }\n`
        + `🔠 Words found: ${guessedWordsRef.current.length}\n`
        + `⭐ Best word: ${
            (guessedWordsRef.current.length > 0) ? (
              `${guessedWordsRef.current[0]} (${calcScore(guessedWordsRef.current[0])} pts.)`
            ) : (
              "Couldn't find any :("
            )
          }\n`
        + `➡️ https://franklinzhu.me/games/wordHunt`

    navigator.clipboard.writeText(text);
    setAnimateCopyText((animateCopyText + 1) % 2);
  }

  function getBestWord(): string {
    let ans = "";
    for (const solution of statsRef.current["solutions"]) {
      if ((solution.length > 0) && (calcScore(solution[0]) > calcScore(ans))) {
        ans = solution[0];
      }
    }
    return ans;
  }

  function resetGame(): void {
    guessedWordsRef.current = [];
    scoreRef.current = 0;
    bonusScoreRef.current = 0;
    guessedWordsDefnsRef.current.clear();
    statsRef.current = {
      "lettersUsed": [],
      "solutions": [],
      "shuffleBoardCount": 0,
      "doubleScoreCount": 0,
      "addTimeCount": 0,
      "coinsEarned": 0,
      "coinsUsed": 0
    };
    setAnimateCopyText(-1);
    setScreen("intro");
  }

  const screens: Record<string, React.ReactNode> = {
    "intro":
      <div className="max-w-[75vw] max-h-[75vh] overflow-y-auto flex flex-col gap-4 p-8 rounded-2xl border-2 border-gray-400 dark:border-gray-600 bg-white dark:bg-black">
        <h1 className="text-center text-4xl">
          <FunHighlight text="Word Hunt" />
        </h1>
        <div className="flex flex-col gap-2">
          <h1 className="text-xl text-center">
            Inspired by the classic GamePigeon game!
          </h1>
          <ul className="list-disc list-inside">
            <li>For the next <b>{INITIAL_GAME_TIME} seconds,</b> a grid of letters will be displayed.</li>
            <li><b>Click and drag paths through this grid</b> to spell words.</li>
            <li><b>Words must be at least 3 letters long,</b> and the longer the word, the more points you get.</li>
              <li className="text-sm indent-6 my-1">The rarer the letters, the more score as well!</li>
            <li>For every extra letter past the first 3, you earn a coin; <b>use coins to buy powerups!</b></li>
              <li className="text-sm indent-6 my-1">Unused coins will be converted to points, 200 points each.</li>
            <li>Score some high scores for bragging rights :)</li>
          </ul>
        </div>
        <h3 className="text-lg place-self-center">
          <b>Choose your grid size:</b>
        </h3>
        <div className="flex flex-row gap-5 place-self-center">
          <button
            className="w-25 place-self-center border-2 rounded-2xl py-1 px-2 border-gray-400 dark:border-gray-600"
            onClick={() => {
              setGridLength(4);
              setScreen("gameplay")
            }}
          >
            4x4
          </button>
          <button
            className="w-25 place-self-center border-2 rounded-2xl py-1 px-2 border-gray-400 dark:border-gray-600"
            onClick={() => {
              setGridLength(5);
              setScreen("gameplay")
            }}
          >
            5x5
          </button>
          <button
            className="w-25 place-self-center border-2 rounded-2xl py-1 px-2 border-gray-400 dark:border-gray-600"
            onClick={() => {
              setGridLength(6);
              setScreen("gameplay");
            }}
          >
            6x6
          </button>
        </div>
      </div>,
    "gameplay":
      <Board
        gridLength={gridLength}
        initialGameTime={INITIAL_GAME_TIME}
        guessedWordsRef={guessedWordsRef}
        scoreRef={scoreRef}
        bonusScoreRef={bonusScoreRef}
        statsRef={statsRef}
        calcScore={calcScore}
        setScreen={setScreen}
        resetGame={resetGame}
      />,
    "results":
      <div className="max-w-[75vw] max-h-[75vh] overflow-y-auto flex flex-col gap-4 p-8 rounded-2xl border-2 border-gray-400 dark:border-gray-600 bg-white dark:bg-black">
        <h1 className="text-center text-4xl">
          <FunHighlight text="Results" />
        </h1>
        <div className="flex flex-col gap-1 text-center">
          <h1 className="text-xl">
            <b>Total score: </b>
            {(scoreRef.current + bonusScoreRef.current > 0) ? (
              <FunHighlight text={String(scoreRef.current + bonusScoreRef.current)} />
            ) : (
              "0 :("
            )}
          </h1>
          <span className="text-sm">(Grid size: {gridLength}x{gridLength})</span>
        </div>
        <CustomHr />
        <div className="flex flex-col gap-0.5 text-center text-lg">
          {(guessedWordsRef.current.length > 0) ? (
            <>
              <h3>
                {guessedWordsRef.current.length} words achieved:
              </h3>
              <p className="text-sm text-gray-700 dark:text-gray-300">
                (click a word to view its definition!)
              </p>
            </>
          ) : (
            <>
              No words achieved?? You can do better!
            </>
          )}
        </div>
        {(guessedWordsRef.current.length > 0) && (
          <div className="max-h-[inherit] grid grid-cols-4 gap-4 place-items-center overflow-y-auto">
            {guessedWordsRef.current.map((word, idx) =>
              <DefinitionCard
                key={idx}
                word={word}
                guessedWordsDefnsRef={guessedWordsDefnsRef}
              />
            )}
          </div>
        )}
        <div className="text-lg text-center">
          Best possible word: {statsRef.current["solutions"].length ? (
            <>
              <b>{getBestWord()}</b> ({calcScore(getBestWord())} pts.)
            </>
          ) : (
            "None..? Wow, unlucky!"
          )}
        </div>
        <div className="mt-2 flex flex-row gap-6 place-content-center">
          <button
            className="relative p-4 border-2 rounded-2xl border-gray-400 dark:border-gray-600"
            onClick={copyShareableText}
          >
            Share results
            <div
              key={animateCopyText}
              className={`${(animateCopyText !== -1) ? "animate-copy-text" : "hidden"} absolute inset-0 m-auto h-full place-content-center rounded-2xl opacity-50 bg-green-300 dark:bg-green-700`}
            >
              Copied!
            </div>
          </button>
          <button
            className="p-4 border-2 rounded-2xl border-gray-400 dark:border-gray-600"
            onClick={resetGame}
          >
            <b>{scoreRef.current > 0 ? "Play again!" : "Oops...play again!"}</b>
          </button>
          <MoreStats
            gridLength={gridLength}
            scoreRef={scoreRef}
            bonusScoreRef={bonusScoreRef}
            guessedWordsRef={guessedWordsRef}
            statsRef={statsRef}
          />
        </div>
      </div>
  };

  return screens[screen];
}
