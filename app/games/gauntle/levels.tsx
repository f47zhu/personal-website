interface Level {
  "length": number,
  "desc": React.ReactNode[],
  "verifier": (word: string) => boolean
}

export function getLevels(): Level[] {
  return [
    {
      "length": 5,
      "desc": [<>Must contain the substring "UAR"</>],
      "verifier": (word: string) => word.includes("UAR")
    },
    {
      "length": 7,
      "desc": [<>Must not contain repeating letters</>],
      "verifier": (word: string) => (new Set(word)).size === word.length
    },
    {
      "length": 12,
      "desc": [<>Must be <i>exactly</i> 12 letters long</>],
      "verifier": (word: string) => word.length === 12
    },
    {
      "length": 6,
      "desc": [<>Must only consist of 3 unique letters</>],
      "verifier": (word: string) => (new Set(word)).size === 3
    },
    {
      "length": 10,
      "desc": [<>Must not contain repeating letters</>],
      "verifier": (word: string) => (new Set(word)).size === word.length
    },
    {
      "length": 10,
      "desc": [<>Must contain a letter that repeats 3 times throughout the word</>],
      "verifier": (word: string) => {
        for (let c = 65; c <= 90; ++c) {
          const pattern = new RegExp(String.fromCharCode(c), "g");
          if ((word.match(pattern) || []).length === 3) {
            return true;
          }
        }
        return false;
      }
    }
  ];
}