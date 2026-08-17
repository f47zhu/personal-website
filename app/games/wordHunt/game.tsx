"use client"

import { useState, useRef, ChangeEvent, useEffect } from "react";

import { useSearchParams } from "next/navigation";

import { FunHighlight } from "../../effects/waveEffect";
import { CustomHr } from "../../customHr";
import { Board } from "./board";
import { PopUp } from "@/app/popUp";
import { solve } from "./gameSolver";
import { validateWord } from "../wordValidator";

interface Solution {
  "word": string,
  "visited": Set<number>
}

interface Stats {
  "score": number,
  "bonusScore": number,
  "wordsGuessed": string[],
  "lettersUsed": string[][],
  "solutions": Solution[][],
  "shuffleBoardCount": number,
  "doubleScoreCount": number,
  "addTimeCount": number,
  "coinsEarned": number,
  "coinsUsed": number
}

type queryParamStats = Omit<Stats, ("solutions" | "shuffleBoardCount")>;

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

function calcCoins(word: string): number {
  return (word.length >= 4) ? word.length - 3 : 0;
}

function DefinitionCard({ word, wordsGuessedDefnsRef }:
      { word: string, wordsGuessedDefnsRef: React.RefObject<Map<string, any>> }) {
  const [wordInfo, setWordInfo] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const WORD_NOT_FOUND: number = -1;


  async function fetchWordInfo(): Promise<void> {
    setLoading(true);
    
    if (!wordsGuessedDefnsRef.current.has(word)) {
      const response: Response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
      if (response.ok) {
        const primaryDefn: any = JSON.parse(await response.text())[0];
        wordsGuessedDefnsRef.current.set(word, primaryDefn);
      } else {
        wordsGuessedDefnsRef.current.set(word, WORD_NOT_FOUND);
      }
    }
    setWordInfo(wordsGuessedDefnsRef.current.get(word));

    setLoading(false);
  }

  return (
    <div onClick={fetchWordInfo}>
      <PopUp
        clickable={
          <button className="p-4 rounded-2xl text-sm bg-gray-200 dark:bg-gray-800">
            {word}
            <div className="text-[10px]">{calcScore(word)} pts.</div>
          </button>
        }
      >
        <div className={`${!loading ? "w-[50vw]" : ""} relative flex flex-col gap-6 h-max-[50vh] p-8 overflow-y-auto`}>
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

function MoreStats({ gridLength, statsRef, opponent, opponentStatsRef, initialGameTime }:
      { gridLength: number, statsRef: React.RefObject<Stats>, opponent: (string | null),
        opponentStatsRef: React.RefObject<Stats | null>, initialGameTime: number }) {
  const [permutationIdx, setPermutationIdx] = useState<number>(0);
  const [currentWordIdx, setCurrentWordIdx] = useState<number>(-1);
  const [currentWordVisited, setCurrentWordVisited] = useState<Set<number>>(new Set<number>([-1]));

  const gridVariants: Record<number, string> = {
    4: "grid-cols-4",
    5: "grid-cols-5",
    6: "grid-cols-6"
  };
  const maxHeightVariants: Record<number, string> = {
    4: "max-h-40",
    5: "max-h-50",
    6: "max-h-60"
  };
  const shuffled: boolean = (statsRef.current["lettersUsed"].length > 1);


  function calcMaxStats(): Record<string, number> {
    let allUniqueWords = new Set<string>();
    let totals: Record<string, number> = {
      "rawScore": 0,
      "coins": 0
    };
    for (const solutionList of statsRef.current["solutions"]) {
      for (const solution of solutionList) {
        if (!allUniqueWords.has(solution.word)) {
          allUniqueWords.add(solution.word);
          totals["rawScore"] += calcScore(solution.word);
          totals["coins"] += calcCoins(solution.word);
        }
      }
    }
    return totals;
  }

  const movePermutationIdx = (idxChange: number): void => {
    const length = statsRef.current["lettersUsed"].length;
    idxChange = (idxChange % length) + length;
    setPermutationIdx((permutationIdx + idxChange) % length);
  }

  const setCurrentWord = (idx: number, visited: Set<number>): void => {
    setCurrentWordIdx(idx);
    setCurrentWordVisited(visited);
  }

  const deselectCurrentWord = (): void => {
    setCurrentWordIdx(-1);
    setCurrentWordVisited(new Set<number>([-1]));
  }

  return (
    <PopUp
      clickable={
        <button className="p-4 border-2 rounded-2xl border-gray-400 dark:border-gray-600">
          More stats
        </button>
      }
    >
      <div
        className="flex flex-col gap-6 w-[50vw] h-max-[50vh] p-8 text-center overflow-y-auto"
        onClick={deselectCurrentWord}
      >
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
                  {statsRef.current["lettersUsed"][permutationIdx].map((letter: string, idx: number) => {
                    const deselect: boolean = !currentWordVisited.has(-1) && !currentWordVisited.has(idx);
                    return (
                      <span
                        key={idx}
                        className={`${deselect ? "opacity-50" : "bg-gray-100 dark:bg-gray-900"} m-1 p-2`}
                      >
                        {letter}
                      </span>
                    );
                  })}
                </div>
              </div>
              <div>
                <div>
                  <div className="mb-1 flex flex-col gap-0.5">
                    <h1>
                      All {statsRef.current["solutions"][permutationIdx].length} possible words
                    </h1>
                    <p className="text-xs text-gray-700 dark:text-gray-300">
                      (click a word to view its tiles!)
                    </p>
                  </div>
                  <CustomHr className="mb-4" />
                </div>
                <div className={`${maxHeightVariants[gridLength]} flex flex-col overflow-y-auto`}>
                  {statsRef.current["solutions"][permutationIdx].map((soln: Solution, idx: number) => {
                    const deselect: boolean = (currentWordIdx !== -1) && (currentWordIdx !== idx);
                    return (
                      <button
                        key={idx}
                        className={deselect ? "opacity-50" : 
                            ((currentWordIdx !== -1) ? "bg-gray-100 dark:bg-gray-900" : "")}
                        onClick={(e) => {
                          e.stopPropagation();
                          setCurrentWord(idx, soln.visited);
                        }}
                      >
                        <div className="flex flex-row text-sm">
                          {statsRef.current["wordsGuessed"].includes(soln.word) ? (
                            <>
                              <span className="grow text-base"><b>{soln.word}</b></span>
                              <span className="text-base"><b>{calcScore(soln.word)}</b></span>
                            </>
                          ) : (opponent && opponentStatsRef.current!["wordsGuessed"].includes(soln.word)) ? (
                            <>
                              <span className="grow"><i>{soln.word}</i></span>
                              <span><i>{calcScore(soln.word)}</i></span>
                            </>
                          ) : (
                            <>
                              <span className="grow">{soln.word}</span>
                              <span>{calcScore(soln.word)}</span>
                            </>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-3 place-content-center items-center text-lg">
          <div className="flex flex-col gap-1">
            <div>Raw score</div>
            <CustomHr className="self-stretch mb-1" />
            <div className="flex flex-col gap-1">
              <div className="flex flex-row gap-2 place-content-center">
                {statsRef.current["score"]}
                {opponent && (
                  <span className="self-center text-sm text-gray-700 dark:text-gray-300">
                    (vs. {opponentStatsRef.current!["score"]})
                  </span>
                )}
              </div>
              <div className="text-[10px]">
                {((statsRef.current["score"] / calcMaxStats()["rawScore"]) * 100).toPrecision(4)}% of
                the max raw score ({calcMaxStats()["rawScore"]})
                {opponent && (
                  <div className="text-gray-700 dark:text-gray-300">
                    (vs. {((opponentStatsRef.current!["score"] / calcMaxStats()["rawScore"]) * 100).toPrecision(4)}%)
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <div>Bonus score</div>
            <CustomHr className="self-stretch mb-1" />
            <div className="flex flex-row gap-2 place-content-center">
              {statsRef.current["bonusScore"]}
              {opponent && (
                <span className="self-center text-sm text-gray-700 dark:text-gray-300">
                  (vs. {opponentStatsRef.current!["bonusScore"]})
                </span>
              )}
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <div>Total score</div>
            <CustomHr className="self-stretch mb-1" />
            <div className="flex flex-row gap-2 place-content-center">
              <FunHighlight text={(statsRef.current["score"] + statsRef.current["bonusScore"]).toString()} />
              {opponent && (
                <span className="self-center text-sm text-gray-700 dark:text-gray-300">
                  <b>(vs. {opponentStatsRef.current!["score"] + opponentStatsRef.current!["bonusScore"]})</b>
                </span>
              )}
            </div>
          </div>
        </div>
        <div className="grid grid-cols-3 place-content-center items-center text-lg">
          <div className="flex flex-col gap-1">
            <div>Coins used</div>
            <CustomHr className="self-stretch mb-1" />
            <div className="flex flex-row gap-2 place-content-center">
              {statsRef.current["coinsUsed"]}
              {opponent && (
                <span className="self-center text-sm text-gray-700 dark:text-gray-300">
                  (vs. {opponentStatsRef.current!["coinsUsed"]})
                </span>
              )}
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <div>
              Coins left over
              <div className="text-[10px]">(and converted to points)</div>
            </div>
            <CustomHr className="self-stretch mb-1" />
            <div className="flex flex-row gap-2 place-content-center">
              {statsRef.current["coinsEarned"] - statsRef.current["coinsUsed"]}
              {opponent && (
                <span className="self-center text-sm text-gray-700 dark:text-gray-300">
                  (vs. {opponentStatsRef.current!["coinsEarned"] - opponentStatsRef.current!["coinsUsed"]})
                </span>
              )}
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <div>Total coins earned</div>
            <CustomHr className="self-stretch mb-1" />
            <div>
              <div className="flex flex-row gap-2 place-content-center">
                <FunHighlight text={statsRef.current["coinsEarned"].toString()} />
                {opponent && (
                  <span className="self-center text-sm text-gray-700 dark:text-gray-300">
                    <b>(vs. {opponentStatsRef.current!["coinsEarned"]})</b>
                  </span>
                )}
              </div>
              <div className="pt-1 text-[10px]">
                {((statsRef.current["coinsEarned"] / calcMaxStats()["coins"]) * 100).toPrecision(4)}% of
                the max coins ({calcMaxStats()["coins"]})
                {opponent && (
                  <div className="text-gray-700 dark:text-gray-300">
                    (vs. {((opponentStatsRef.current!["coinsEarned"] / calcMaxStats()["coins"]) * 100).toPrecision(4)}%)
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-4 place-content-center items-center">
          <div className="flex flex-col gap-1">
            <div>Board shuffles</div>
            <CustomHr className="self-stretch mb-1" />
            <div className="flex flex-row gap-2 place-content-center">
              {statsRef.current["shuffleBoardCount"]}
              {opponent && (
                <span className="self-center text-sm text-gray-700 dark:text-gray-300">
                  (vs. {opponentStatsRef.current!["shuffleBoardCount"]})
                </span>
              )}
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <div>Score doublers</div>
            <CustomHr className="self-stretch mb-1" />
            <div className="flex flex-row gap-2 place-content-center">
              {statsRef.current["doubleScoreCount"]}
              {opponent && (
                <span className="self-center text-sm text-gray-700 dark:text-gray-300">
                  (vs. {opponentStatsRef.current!["doubleScoreCount"]})
                </span>
              )}
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <div>10 sec extensions</div>
            <CustomHr className="self-stretch mb-1" />
            <div>
              <div className="flex flex-row gap-2 place-content-center">
                {statsRef.current["addTimeCount"]}
                {opponent && (
                  <span className="self-center text-sm text-gray-700 dark:text-gray-300">
                    (vs. {opponentStatsRef.current!["addTimeCount"]})
                  </span>
                )}
              </div>
              {(statsRef.current["addTimeCount"] > 0) && (
                <div className="mt-1 text-[10px]">
                  (Total game time: {initialGameTime + 10 * statsRef.current["addTimeCount"]}s)
                  {opponent && (
                  <div className="text-gray-700 dark:text-gray-300">
                    (vs. {initialGameTime + 10 * opponentStatsRef.current!["addTimeCount"]}s)
                  </div>
                )}
                </div>
              )}
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <div>Total powerups used</div>
            <CustomHr className="self-stretch mb-1" />
            <div className="flex flex-row gap-2 place-content-center">
              <FunHighlight text={(
                statsRef.current["shuffleBoardCount"]
                + statsRef.current["doubleScoreCount"]
                + statsRef.current["addTimeCount"]
              ).toString()} />
              {opponent && (
                <span className="self-center text-sm text-gray-700 dark:text-gray-300">
                  <b>(vs. {
                    opponentStatsRef.current!["shuffleBoardCount"]
                    + opponentStatsRef.current!["doubleScoreCount"]
                    + opponentStatsRef.current!["addTimeCount"]
                  })</b>
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </PopUp>
  );
}

export function Game() {
  const [screen, setScreen] = useState<string>("intro");
  const [gridLength, setGridLength] = useState<number>(0);
  const wordsGuessedDefnsRef = useRef<Map<string, any>>(new Map<string, Object>());
  const statsRef = useRef<Stats>({
    "score": 0,
    "bonusScore": 0,
    "wordsGuessed": [],
    "lettersUsed": [],
    "solutions": [],
    "shuffleBoardCount": 0,
    "doubleScoreCount": 0,
    "addTimeCount": 0,
    "coinsEarned": 0,
    "coinsUsed": 0
  });

  const DEFAULT_USERNAME = "";
  const MAX_USERNAME_LENGTH: number = 45;

  const searchParams = useSearchParams();
  const [username, setUsername] = useState<string>(DEFAULT_USERNAME); // only word chars
  const [tryAgain, setTryAgain] = useState<string>("");
  const [animateCopyText, setAnimateCopyText] = useState<number>(-1);

  const INITIAL_GAME_TIME: number = 60;
  const statsProperties: (keyof queryParamStats)[] = [
    "score",
    "bonusScore",
    "wordsGuessed",
    "lettersUsed",
    // "solutions",
    // "shuffleBoardCount",
    "doubleScoreCount",
    "addTimeCount",
    "coinsEarned",
    "coinsUsed"
  ];
  const ARRAY_STAT_DELIMITER: string = "!";
  const QUERY_PARAMS_STATS_DELIMITER: string = "*";


  const handleUsernameChange = (e: ChangeEvent<HTMLInputElement, HTMLInputElement>) => {
    const newUsername: string = e.target.value.slice(0, MAX_USERNAME_LENGTH);
    setUsername(
      /[^\w]/i.test(newUsername) ? newUsername.substring(0, newUsername.length - 1) : newUsername
    );
  }

  function vigenere(word: string, key: string, offset: number): string { // encodes/decodes
    let ans = "";
    for (let idx = 0; idx < word.length; ++idx) {
      const localOffset = key.charCodeAt((idx + offset) % key.length)!;
      ans += String.fromCharCode(word.charCodeAt(idx) ^ localOffset);
    }
    return ans;
  }

  function statToString(stat: keyof queryParamStats): string {
    if (stat === "lettersUsed") {
      return statsRef.current[stat]
          .map((letterList: string[]) => letterList.join(""))
          .join(ARRAY_STAT_DELIMITER);
    } else if (stat === "wordsGuessed") {
      return statsRef.current[stat].join(ARRAY_STAT_DELIMITER);
    }
    return statsRef.current[stat].toString();
  }

  function verifyStats(stats: Stats): boolean {
    return Object.keys(stats).every((key) => {
      if (key === "lettersUsed") {
        if (stats[key].length === 0) { // must be at least one letterList
          return false;
        }
        const gridArea = stats[key][0].length;
        if (Math.abs(Math.sqrt(gridArea) - Math.round(Math.sqrt(gridArea))) > 0.01 // gridLength must be an integer
            || Math.round(Math.sqrt(gridArea)) < 4 || Math.round(Math.sqrt(gridArea)) > 6) { // gridLength must be 4, 5, or 6
          // console.log("not a valid grid length", stats[key]);
          return false;
        }
        for (const letterList of stats[key]) {
          if (/[^A-Z]/.test(letterList.join("")) // must only be capital letters
              || letterList.length !== gridArea) { // must have the same number of letters
            // console.log("not all capitals or same grid area", letterList);
            return false;
          }
        }
        return true;
      } else if (key === "wordsGuessed") {
        for (const word of stats[key]) {
          // console.log("checking word", word);
          // console.log("verdict", (!/[^A-Z]/.test(word) && validateWord(word)));
          if (/[^A-Z]/.test(word) // must only be capital letters
              || !validateWord(word)) { // must be a real word
            return false;
          }
        }
        return true;
      } else if (key === "solutions") { // generated by my code anyway, so should be fine to assume true
        // for (const solutionList of stats[key]) {
        //   for (const solution of solutionList) {
        //     console.log("checking word", solution.word);
        //     console.log("verdict", (!/[^A-Z]/.test(solution.word) && validateWord(solution.word)));
        //     if (/[^A-Z]/.test(solution.word) // must only be capital letters
        //         || !validateWord(solution.word)) { // must be a real word
        //       return false;
        //     }
        //   }
        // }
        return true;
      }
      // console.log("checking this stat", key);
      // console.log("verdict", Number.isInteger(stats[key as keyof queryParamStats])
          // && (stats[key as keyof queryParamStats] as number >= 0));
      return Number.isInteger(stats[key as keyof queryParamStats])
          && (stats[key as keyof queryParamStats] as number >= 0);
    });
  }

  function statsToQueryParams(): string {
    if (/[^\w]/i.test(username)) {
      return "";
    }

    let ans = `?u=${username}&s=`;

    // ans receives lettersUsed=ABC...,XYZ...{QUERY_PARAMS_STATS_DELIMITER}doubleScoreCount=5,etc.
    for (let idx = 0; idx < statsProperties.length; ++idx) {
      const property: keyof queryParamStats = statsProperties[idx];
      const unencoded = `${property}=${statToString(property)}`
      // console.log("encoding this", unencoded);
      ans += Buffer.from(vigenere(unencoded, username, idx), "utf-8")
          .toString("base64").replace(/\+/g, "-").replace(/\//g, "_")
          + ((idx !== statsProperties.length - 1) ? QUERY_PARAMS_STATS_DELIMITER : "");
      // console.log("ans is now", ans);
    }

    return ans;
  }

  function queryParamsToStats(): (Stats | null) {
    const [opponentUsername, rawString] = [searchParams.get("u"), searchParams.get("s")];
    if (!opponentUsername || !rawString) {
      return null;
    }
    const encodedQueries: string[] = rawString
        .split(QUERY_PARAMS_STATS_DELIMITER)
        .map((unicodeString: string) =>
          Buffer.from(unicodeString.replace(/-/g, "+").replace(/_/g, "/"), "base64").toString("utf-8")
        );
    let decodedQueries: string[] = [];
    for (let idx = 0; idx < statsProperties.length; ++idx) {
      decodedQueries.push(vigenere(encodedQueries[idx], opponentUsername, idx));
    }
    
    let ans: Stats = {
      "score": 0,
      "bonusScore": 0,
      "wordsGuessed": [],
      "lettersUsed": [],
      "solutions": [],
      "shuffleBoardCount": 0,
      "doubleScoreCount": 0,
      "addTimeCount": 0,
      "coinsEarned": 0,
      "coinsUsed": 0
    };
    for (const query of decodedQueries) {
      const kvPoint = query.indexOf("=");
      const [key, value] = [
        query.substring(0, kvPoint) as keyof queryParamStats,
        query.substring(kvPoint + 1)
      ];
      if (key === "lettersUsed") {
        ans[key] = value.split(ARRAY_STAT_DELIMITER).map((letterList) => letterList.split(""));
      } else if (key === "wordsGuessed") {
        ans[key] = (value.split(ARRAY_STAT_DELIMITER)[0] !== "") ? value.split(ARRAY_STAT_DELIMITER) : [];
      } else {
        ans[key] = +value;
      }
    }

    // handle solutions and shuffleBoardCount now
    for (const permutation of ans["lettersUsed"]) {
      ans["solutions"].push(solve(Math.round(Math.sqrt(permutation.length)), permutation, calcScore));
    }
    ans["shuffleBoardCount"] = ans["lettersUsed"].length - 1;

    // console.log("decoded queries", decodedQueries);
    // console.log("ans", ans);
    return ans;
  }

  const opponentStatsRef = useRef<Stats | null>(queryParamsToStats());
  const opponent: (string | null) = searchParams.get("u");

  useEffect(() => {
    if (opponentStatsRef.current && !verifyStats(opponentStatsRef.current)) {
      setScreen("opponentError");
    }
  }, []);

  function copyShareableText(): void {
    if (username === "") {
      setTryAgain("Please enter a username!");
      return;
    }

    const text = `franklinzhu.me's Word Hunt ${gridLength}x${gridLength}\n`
        + `🎯 Score: ${statsRef.current["score"] + statsRef.current["bonusScore"]}\n`
        + `⚡ Powerups used: ${
            statsRef.current["shuffleBoardCount"]
            + statsRef.current["doubleScoreCount"]
            + statsRef.current["addTimeCount"]
          }\n`
        + `🔠 Words found: ${statsRef.current["wordsGuessed"].length}\n`
        + `⭐ Best word: ${
            (statsRef.current["wordsGuessed"].length > 0) ? (
              `${statsRef.current["wordsGuessed"][0]} (${calcScore(statsRef.current["wordsGuessed"][0])} pts.)`
            ) : (
              "Couldn't find any :("
            )
          }\n`
        + `Think you can beat me? `
        + `https://franklinzhu.me/games/wordHunt${statsToQueryParams()}`

    navigator.clipboard.writeText(text);
    setAnimateCopyText((animateCopyText + 1) % 2);
  }

  function winVerdictMessage(): Record<string, string> {
    if (!opponent) {
      return {};
    }
    
    let ans = {
      "title": "",
      "tiny": ""
    };
    const [totalScore, opponentTotalScore] = [
      statsRef.current["score"] + statsRef.current["bonusScore"],
      opponentStatsRef.current!["score"] + opponentStatsRef.current!["bonusScore"]
    ]
    if (totalScore > opponentTotalScore) {
      ans["title"] = "You win!";
      ans["tiny"] = `(You won by ${totalScore - opponentTotalScore} pts!)`;
    } else if (totalScore === opponentTotalScore) {
      ans["title"] = "Draw!";
      ans["tiny"] = `(You drew, what a coincidence!)`;
    } else {
      ans["title"] = "Better luck next time!";
      ans["tiny"] = `(You lost by ${opponentTotalScore - totalScore} pts.)`
    }
    return ans;
  }

  function getBestWord(): string {
    let ans = "";
    for (const solution of statsRef.current["solutions"]) {
      if ((solution.length > 0) && (calcScore(solution[0].word) > calcScore(ans))) {
        ans = solution[0].word;
      }
    }
    return ans;
  }

  function resetGame(): void {
    statsRef.current["wordsGuessed"] = [];
    statsRef.current["score"] = 0;
    statsRef.current["bonusScore"] = 0;
    wordsGuessedDefnsRef.current.clear();
    statsRef.current = {
      "score": 0,
      "bonusScore": 0,
      "wordsGuessed": [],
      "lettersUsed": [],
      "solutions": [],
      "shuffleBoardCount": 0,
      "doubleScoreCount": 0,
      "addTimeCount": 0,
      "coinsEarned": 0,
      "coinsUsed": 0
    };
    setScreen("intro");
  }

  const screens: Record<string, React.ReactNode> = {
    "intro":
      <div className="max-w-[75vw] max-h-[75vh] overflow-y-auto flex flex-col gap-4 p-8 rounded-2xl border-2 border-gray-400 dark:border-gray-600 bg-white dark:bg-black">
        <h1 className="text-center text-4xl">
          <FunHighlight text="Word Hunt" />
        </h1>
        <div className="flex flex-col gap-2">
          <h2 className="text-xl text-center">
            Inspired by the classic GamePigeon game!
          </h2>
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
          <b>
            {!opponent ? (
              "Choose your grid size:"
            ) : (
              <>
                <FunHighlight text={opponent!} /> challenged you to a {
                  Math.round(Math.sqrt(opponentStatsRef.current!.lettersUsed[0].length))
                }x{
                  Math.round(Math.sqrt(opponentStatsRef.current!.lettersUsed[0].length))
                } game!
              </>
            )}
          </b>
        </h3>
        {!opponent ? (
          <div className="flex flex-row gap-5 place-self-center">
            <button
              className="w-25 place-self-center border-2 rounded-2xl py-2 px-4 border-gray-400 dark:border-gray-600"
              onClick={() => {
                setGridLength(4);
                setScreen("gameplay")
              }}
            >
              4x4
            </button>
            <button
              className="w-25 place-self-center border-2 rounded-2xl py-2 px-4 border-gray-400 dark:border-gray-600"
              onClick={() => {
                setGridLength(5);
                setScreen("gameplay")
              }}
            >
              5x5
            </button>
            <button
              className="w-25 place-self-center border-2 rounded-2xl py-2 px-4 border-gray-400 dark:border-gray-600"
              onClick={() => {
                setGridLength(6);
                setScreen("gameplay");
              }}
            >
              6x6
            </button>
          </div>
        ) : (
          <button
            className="w-25 place-self-center border-2 rounded-2xl py-2 px-4 border-gray-400 dark:border-gray-600"
            onClick={() => {
              setGridLength(Math.round(Math.sqrt(opponentStatsRef.current!.lettersUsed[0].length)));
              setScreen("gameplay");
            }}
          >
            Let's go!
          </button>
        )}
      </div>,
    "gameplay":
      <Board
        gridLength={gridLength}
        initialGameTime={INITIAL_GAME_TIME}
        statsRef={statsRef}
        calcScore={calcScore}
        calcCoins={calcCoins}
        setScreen={setScreen}
        resetGame={resetGame}
        opponentStatsRef={opponentStatsRef}
      />,
    "results":
      <div className="max-w-[50vw] max-h-[75vh] overflow-y-auto flex flex-col gap-4 p-8 rounded-2xl border-2 border-gray-400 dark:border-gray-600 bg-white dark:bg-black">
        <h1 className="text-center text-4xl">
          {opponent ? (
            <FunHighlight text={winVerdictMessage()["title"]} />
          ) : (
            <FunHighlight text="Results" />
          )}
        </h1>
        <div className="flex flex-col gap-1 text-center">
          <div className="flex flex-row gap-8 place-content-center">
            <div>
              <h1 className="text-xl">
                <b>Total score: </b>
                {(statsRef.current["score"] + statsRef.current["bonusScore"] > 0) ? (
                  <FunHighlight text={(statsRef.current["score"] + statsRef.current["bonusScore"]).toString()} />
                ) : (
                  "0 :("
                )}
              </h1>
              <span className="text-sm">(Grid size: {gridLength}x{gridLength})</span>
            </div>
            {opponent && (
              <div>
                <h1 className="text-xl">
                  <b>{opponent!}'s total score: </b>
                  {(opponentStatsRef.current!["score"] + opponentStatsRef.current!["bonusScore"] > 0) ? (
                    <FunHighlight text={(opponentStatsRef.current!["score"] + opponentStatsRef.current!["bonusScore"]).toString()} />
                  ) : (
                    "0 :("
                  )}
                </h1>
                <span className="text-sm">{winVerdictMessage()["tiny"]}</span>
              </div>
            )}
          </div>
        </div>
        <CustomHr />
        <div className="flex flex-row gap-6 justify-center">
          <div className="flex flex-col gap-0.5 justify-center text-right text-lg">
            {(statsRef.current["wordsGuessed"].length > 0) ? (
              <>
                <h3>
                  {statsRef.current["wordsGuessed"].length} word
                      {statsRef.current["wordsGuessed"].length > 1 ? "s" : ""} achieved:
                </h3>
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  (click a word to view its definition!)
                </p>
              </>
            ) : (!opponent || (opponent && (opponentStatsRef.current!["wordsGuessed"].length > 0))) ? (
              <div className="text-center">
                No words achieved?? You can do better!
              </div>
            ) : (
              <div className="text-center">
                None of you achieved any words??
                <div className="text-sm text-gray-700 dark:text-gray-300">
                  No offense, but maybe you two should try a <a href="/games">different game...</a>
                </div>
              </div>
            )}
          </div>
          {(statsRef.current["wordsGuessed"].length > 0) && (
            <div className="flex flex-row gap-4 place-items-center">
              <div className="flex flex-col gap-2 text-center">
                {opponent ? `Your word${statsRef.current["wordsGuessed"].length > 1 ? "s" : ""}` : ""}
                <div className={`${opponent ? "max-h-22" : "max-h-30"} flex flex-row flex-wrap gap-x-4 gap-y-3 justify-center place-items-center overflow-y-auto`}>
                  {statsRef.current["wordsGuessed"].map((word, idx) =>
                    <DefinitionCard
                      key={idx}
                      word={word}
                      wordsGuessedDefnsRef={wordsGuessedDefnsRef}
                    />
                  )}
                </div>
              </div>
              {opponent && (
                <div className="flex flex-col gap-2 text-center">
                  {opponentStatsRef.current!["wordsGuessed"].length > 0 ? (
                    <>
                      {opponent!}'s {opponentStatsRef.current!["wordsGuessed"].length} word
                          {opponentStatsRef.current!["wordsGuessed"].length > 1 ? "s" : ""}
                      <div className="max-h-22 flex flex-row flex-wrap gap-x-4 gap-y-3 justify-center place-items-center overflow-y-auto">
                        {opponentStatsRef.current!["wordsGuessed"].map((word, idx) =>
                          <DefinitionCard
                            key={idx}
                            word={word}
                            wordsGuessedDefnsRef={wordsGuessedDefnsRef}
                          />
                        )}
                      </div>
                    </>
                  ) : (
                    <div className="justify-self-center">
                      {opponent} achieved 0 words. They could learn a thing or two from you!
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
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
          <PopUp
            clickable={
              <button
                className="relative p-4 border-2 rounded-2xl border-gray-400 dark:border-gray-600"
                onClick={() => {
                  setTryAgain("");
                  setUsername(DEFAULT_USERNAME);
                  setAnimateCopyText(-1);
                }}
              >
                Share results
              </button>
            }
          >
            <div className="flex flex-col gap-4 p-8 place-items-center text-center">
              <div className="flex flex-col">
                <h1 className="text-lg">Enter your username:</h1>
                <div className="text-[10px] text-gray-700 dark:text-gray-300">
                  (Must be composed of letters, numbers, and underscores)
                </div>
              </div>
              <input 
                className="w-full border-2 rounded-full px-4 py-2 border-gray-400 dark:border-gray-600"
                name="answer" value={username}
                onChange={(e) => {
                  setTryAgain("");
                  handleUsernameChange(e);
                }}
              />
              <button
                className="relative px-4 py-2 border-2 rounded-full border-gray-400 dark:border-gray-600"
                onClick={copyShareableText}
              >
                Share!
                <div
                  key={animateCopyText}
                  className={`${(animateCopyText !== -1) ? "animate-copy-text" : "hidden"} absolute inset-0 m-auto h-full place-content-center rounded-full bg-green-300 dark:bg-green-700`}
                >
                  Copied!
                </div>
              </button>
              {(tryAgain !== "") && (
                <span className="text-red-500">{tryAgain}</span>
              )}
            </div>
          </PopUp>
          {opponent ? (
            <a href="https://franklinzhu.me/games/wordHunt">
              <button
                className="p-4 border-2 rounded-2xl border-gray-400 dark:border-gray-600 text-black dark:text-white"
                onClick={resetGame}
              >
                <b>{statsRef.current["score"] > 0 ? "Play again!" : "Oops...play again!"}</b>
              </button>
            </a>
          ) : (
            <button
              className="p-4 border-2 rounded-2xl border-gray-400 dark:border-gray-600"
              onClick={resetGame}
            >
              <b>{statsRef.current["score"] > 0 ? "Play again!" : "Oops...play again!"}</b>
            </button>
          )}
          <MoreStats
            gridLength={gridLength}
            statsRef={statsRef}
            opponent={opponent}
            opponentStatsRef={opponentStatsRef}
            initialGameTime={INITIAL_GAME_TIME}
          />
        </div>
      </div>,
    "opponentError":
      <div className="max-w-[75vw] max-h-[75vh] overflow-y-auto flex flex-col gap-4 p-8 place-items-center rounded-2xl border-2 border-gray-400 dark:border-gray-600 bg-white dark:bg-black">
        <h1 className="text-xl text-center">
          <b>Uh oh!</b>
        </h1>
        <div className="flex flex-col gap-2">
          <p className="text-center">
            It seems your challenge link is corrupted.
          </p>
          <p className="text-center">
            Ask your opponent for a new one, or play a new game?
          </p>
        </div>
        <a href="https://franklinzhu.me/games/wordHunt">
          <button
            className="p-4 border-2 rounded-2xl border-gray-400 dark:border-gray-600 text-black dark:text-white"
            onClick={resetGame}
          >
            New game!
          </button>
        </a>
      </div>
  };

  return screens[screen];
}
