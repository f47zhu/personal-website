"use client"

import { useEffect, useState, useRef } from "react";

export function CircleCarousel({ isPopUps = false, images }:
    { isPopUps?: boolean, images: React.ReactNode[] }) {
  let timeDisplayed = useRef<number>(0);
  const [curIndex, setCurIndex] = useState<number>(0);

  let timePaused = useRef<number>(0);
  const [paused, setPaused] = useState<boolean>(false);

  function changeCurIndex(indexChange: number) {
    indexChange = (indexChange % images.length) + images.length;
    timeDisplayed.current = Date.now();
    setCurIndex((curIndex + indexChange) % images.length);
  }

  useEffect(() => {
    const cycleInterval = setInterval(() => {
      if (!paused && (Date.now() - timeDisplayed.current > 5000)) {
        changeCurIndex(1);
      }
    });

    return () => {
      clearInterval(cycleInterval);
    }
  }, [curIndex, paused]);

  function togglePause() {
    if (!paused) {
      timePaused.current = Date.now();
      setPaused(true);
    } else {
      timeDisplayed.current += Date.now() - timePaused.current;
      setPaused(false);
    }
  }

  return (
    <div className="relative group" onClick={() => {if (isPopUps) {togglePause();}}}>
      <div
        className="z-20 flex flex-row absolute bottom-1/12 m-auto left-0 right-0 place-content-center opacity-0 group-hover:opacity-100 transition ease-in-out" onClick={e => e.stopPropagation()}>
        <button className="py-2 pl-6 pr-4 font-extrabold whitespace-nowrap bg-linear-to-r from-[#00000000] to-[#FFFFFF80] dark:to-[#00000080] to-25%" onClick={() => changeCurIndex(-1)}>←</button>
        <p className="p-2 place-content-center text-sm tracking-[4] bg-[#FFFFFF80] dark:bg-[#00000080]">
          {"○".repeat(curIndex)}●{"○".repeat(images.length - 1 - curIndex)}
        </p>
        <button className="py-2 pl-4 pr-6 font-extrabold whitespace-nowrap bg-linear-to-l from-[#00000000] to-[#FFFFFF80] dark:to-[#00000080] to-25%" onClick={() => changeCurIndex(1)}>→</button>
      </div>
      {images[curIndex]}
    </div>
  );
}
