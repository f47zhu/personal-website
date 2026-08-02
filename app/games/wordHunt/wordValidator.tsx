"use server"

import { readFileSync } from "fs";

const wordSet = new Set(
  readFileSync("./public/words.txt", "utf-8")
  .split("\n")
  .map((word: string) => word.trim())
);

export async function validateWord(word: string): Promise<boolean> {
  return wordSet.has(word.toLowerCase());
}
