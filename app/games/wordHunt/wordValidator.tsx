"use client" // process word bank client-side for faster responsiveness

import words from "@/public/words.json"

const wordSet = new Set<string>(words as string[]);

export async function validateWord(word: string): Promise<boolean> {
  return wordSet.has(word.toLowerCase());
}
