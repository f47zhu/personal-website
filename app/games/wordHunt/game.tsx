"use client"

import { useState, useRef } from "react"

import { FunHighlight } from "../../effects/waveEffect";
import { Board } from "./board";
import { PopUp } from "@/app/popUp";

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

function DefinitionCard({ word, wordInfo }: { word: string, wordInfo: any }) {
  return (
    <PopUp
      clickable={
        <button className="p-4 rounded-2xl bg-gray-200 dark:bg-gray-800">
          {word}
          <div className="text-[10px]">{calcScore(word)} pts.</div>
        </button>
      }
    >
      <div className="flex flex-col gap-6 w-[75vmin] h-[50vmin] p-6">
        <div className="flex flex-row text-3xl">
          <span className="ml-1 grow">
            <b>{word}</b>
          </span>
          <span className="text-gray-500">
            {wordInfo.phonetic}
          </span>
        </div>
        <div className="flex flex-col gap-4 overflow-y-auto">
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
      </div>
    </PopUp>
  );
}

export function Game() {
  const [screen, setScreen] = useState<string>("intro");
  const [gridSize, setGridSize] = useState<number>(0);
  const guessedWordsRef = useRef<string[]>([]); // to let state "collect" all async func calls
  const scoreRef = useRef<number>(0);
  const guessedWordsDefnsRef = useRef<Map<string, any>>(new Map<string, Object>());

  function resetGame(): void {
    guessedWordsRef.current = [];
    scoreRef.current = 0;
    guessedWordsDefnsRef.current.clear();
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
            <li>For the next <b>60 seconds,</b> a grid of letters will be displayed.</li>
            <li><b>Click and drag paths through this grid</b> to spell words.</li>
            <li><b>Words must be at least 3 letters long,</b> and the longer the word, the more points you get.</li>
            <li className="text-sm indent-6 my-1">The rarer the letters, the more score as well!</li>
            <li>For every extra letter past the first 3, you earn a coin; <b>use coins to buy powerups!</b></li>
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
              setGridSize(4);
              setScreen("gameplay")
            }}
          >
            4x4
          </button>
          <button
            className="w-25 place-self-center border-2 rounded-2xl py-1 px-2 border-gray-400 dark:border-gray-600"
            onClick={() => {
              setGridSize(5);
              setScreen("gameplay")
            }}
          >
            5x5
          </button>
          <button
            className="w-25 place-self-center border-2 rounded-2xl py-1 px-2 border-gray-400 dark:border-gray-600"
            onClick={() => {
              setGridSize(6);
              setScreen("gameplay");
            }}
          >
            6x6
          </button>
        </div>
      </div>,
    "gameplay":
      <Board
        size={gridSize}
        guessedWordsRef={guessedWordsRef}
        scoreRef={scoreRef}
        guessedWordsDefnsRef={guessedWordsDefnsRef}
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
            {scoreRef.current > 0 ? <FunHighlight text={String(scoreRef.current)} />
                : "0 :("}
          </h1>
          <span className="text-sm">(Grid size: {gridSize}x{gridSize})</span>
        </div>
        <hr />
        <div className="flex flex-col gap-0.5 text-center">
          {scoreRef.current > 0 ? (
            <>
              <h3 className="text-lg">
                Words achieved:
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
        <div className="max-h-[inherit] grid grid-cols-3 gap-4 place-items-center overflow-y-auto">
          {guessedWordsRef.current.map((word, idx) =>
            <DefinitionCard
              key={idx}
              word={word}
              wordInfo={guessedWordsDefnsRef.current.get(word)}
            />
          )}
        </div>
        <div className="mt-2 flex flex-row place-content-center">
          <button
            className="p-4 border-2 rounded-2xl border-gray-400 dark:border-gray-600"
            onClick={resetGame}
          >
            {scoreRef.current > 0 ? "Play again!" : "Oops...play again!"}
          </button>
        </div>
      </div>
  };

  return screens[screen];
}
