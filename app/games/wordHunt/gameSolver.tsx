"use client"

import words from "@/public/words.json"

export function solve(gridLength: number, letters: string[], calcScore: Function): string[] {
  // returns a list of all achievable words, reverse sorted by calcScore
  let answer: string[] = [];
  let answerSet: Set<string> = new Set<string>();

  function pushToAnswer(word: string) {
    answerSet.add(word);

    let lo = 0, hi = answer.length, mid;
    while (lo < hi) { // assuming reverse sorted list, returns first idx where elt > list[idx]
      mid = Math.floor((lo + hi) / 2);
      if (calcScore(answer[mid]) >= calcScore(word)) {
        lo = mid + 1;
      } else {
        hi = mid;
      }
    }
    answer.splice(lo, 0, word);
  }

  function checkWord(rawWord: string): string {
    // function to binary search word list and check for prefix/existence
    // returns "valid" if exists, "prefix" if it's a prefix to another word,
    // and "invalid" if n/a
    const word = rawWord.toLowerCase();
    const wordList: string[] = words as string[];
    let lo = 0, hi = wordList.length - 1, mid;
    while (lo < hi) { // lower_bound()
      mid = Math.floor((lo + hi) / 2);
      if (wordList[mid] < word) {
        lo = mid + 1;
      } else {
        hi = mid;
      }
    }
    if ((wordList[lo] === word) && (word.length >= 3)) {
      return "valid";
    } else if (wordList[lo].substring(0, word.length) === word) {
      return "prefix";
    }
    return "invalid";
  }

  function idxToCoords(idx: number): number[] {
    return [Math.floor(idx / gridLength), idx % gridLength];
  }

  function coordsToIdx(row: number, col: number): number {
    return row * gridLength + col;
  }

  function checkCoords(row: number, col: number): boolean {
    return (0 <= row) && (row < gridLength)
        && (0 <= col) && (col < gridLength);
  }

  let grid: string[][] = [];
  for (let idx = 0; idx < letters.length; idx += gridLength) {
    grid.concat(letters.slice(idx, idx + gridLength));
  }

  type Query = {
    "idx": number,
    "word": string,
    "visited": Set<number>
  };
  let queue: Query[] = [];
  for (let idx = 0; idx < gridLength * gridLength; ++idx) {
    queue.push({
      "idx": idx,
      "word": letters[idx],
      "visited": new Set<number>([idx])
    });
  }

  const rowVariants: number[] = [-1, -1, -1, 0, 1, 1, 1, 0];
  const colVariants: number[] = [-1, 0, 1, 1, 1, 0, -1, -1];

  while (queue.length) {
    const query = queue.shift()!;
    const word = query.word;
    const wordValidity: string = checkWord(word);
    if (wordValidity != "invalid") {
      if (wordValidity === "valid" && !answerSet.has(word)) {
        pushToAnswer(word);
      }
      const [queryRow, queryCol] = idxToCoords(query.idx);
      const visited = query.visited;
      for (let idx = 0; idx < rowVariants.length; ++idx) {
        const [row, col] = [queryRow + rowVariants[idx], queryCol + colVariants[idx]];
        if (checkCoords(row, col) && !visited.has(coordsToIdx(row, col))) {
          const newIdx = coordsToIdx(row, col);
          const newWord = word + letters[newIdx];
          const newVisited = visited.union(new Set<number>([newIdx]));
          queue.push({
            "idx": newIdx,
            "word": newWord,
            "visited": newVisited
          });
        }
      }
    }
  }

  return answer;
}
