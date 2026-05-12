"use client"

import { useState, useEffect, useRef } from 'react';

const funFacts = [
  <>I used to <a href="https://osu.ppy.sh/users/10975777" target="_blank">play osu! tournaments.</a></>,
  <>My favourite colour has always been yellow.</>,
  <>I love <a href="https://www.puptheband.com/" target="_blank">PUP!</a></>,
  <>Mint-flavoured things and root beer do NOT taste like toothpaste! They taste pretty awesome.</>,
  <>I am currently learning bad Tamil by bothering my Sri Lankan friends.</>,
  <>I still have a baby tooth! Four of my adult teeth decided not to grow in.</>,
  <>I am a proud member of the University of Waterloo's <a href="https://uwcbc.uwaterloo.ca/index.html" target="_blank">Concert Band</a> and <a href="https://warriorsband.uwaterloo.ca/" target="_blank">Warriors Band.</a></>,
  <>My coding origins can be traced back to my <a href="http://www.khanacademy.org/profile/franklincool" target="_blank">Khan Academy account,</a> which I later managed to rack up over one million energy points on by doing calculus.</>,
  <>I am a Jerry Wang MATH 145 survivor. If you know, you know...</>,
  <>I've been to <a href="https://en.wikipedia.org/wiki/Hell,_Grand_Cayman" target="_blank">Hell.</a></>
];

function randint(max: number) {
  return Math.floor(Math.random() * max);
}

export function RandomFunFact() {
  const [randIndex, setRandIndex] = useState(0);
  const [factsSeen, setFactsSeen] = useState(new Set);
  let timeDisplayed = useRef(0);

  function setRandIndexFancy(now: number) {
    let newIndex = randint(funFacts.length);
    while (newIndex === randIndex) {
      newIndex = randint(funFacts.length);
    }
    setRandIndex(newIndex);
    
    timeDisplayed.current = now;

    const newFactsSeen = new Set(factsSeen);
    newFactsSeen.add(newIndex);
    setFactsSeen(newFactsSeen);
  }

  useEffect(() => {
    const cycleInterval = setInterval(() => {
      const now = Date.now();
      if (now - timeDisplayed.current > 5000) {
        setRandIndexFancy(now);
      }
    }, 100);

    return () => {
      clearInterval(cycleInterval);
    }
  }, [factsSeen]);

  function handleClick() {
    setRandIndexFancy(Date.now());
  }

  return (
    <div className="text-base text-center text-gray-600 dark:text-gray-400" onClick={handleClick}>
      {funFacts[randIndex]}
      {(factsSeen.size === funFacts.length) && (
        <div className="mt-4 text-gray-700 dark:text-gray-300">
          Wow! You've seen all my fun facts! Have a cookie 🍪 :)
        </div>
      )}
    </div>
  );
}