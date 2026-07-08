"use client"

import { useState, useEffect } from "react";

function randint(max: number) {
  return Math.floor(Math.random() * max);
}

export function HomepageBgEffect({}) {
  const [show, setShow] = useState<boolean>(true);

  const effects: string[] = [
    "animate-homepage-bg-shrink",
    "animate-homepage-bg-shrink-delay1s hue-rotate-12",
    "animate-homepage-bg-shrink-delay2s hue-rotate-24",
    "animate-homepage-bg-shrink-delay3s hue-rotate-36",
    "animate-homepage-bg-shrink-delay4s hue-rotate-48",
    "animate-homepage-bg-shrink-delay5s hue-rotate-60",
    "animate-homepage-bg-shrink-delay6s hue-rotate-72",
    "animate-homepage-bg-shrink-delay7s hue-rotate-84",
    "animate-homepage-bg-shrink-delay8s hue-rotate-96",
    "animate-homepage-bg-shrink-delay9s hue-rotate-108",
    "animate-homepage-bg-shrink-delay10s hue-rotate-120",
    "animate-homepage-bg-shrink-delay11s hue-rotate-132",
    "animate-homepage-bg-shrink-delay12s hue-rotate-144",
    "animate-homepage-bg-shrink-delay13s hue-rotate-156",
    "animate-homepage-bg-shrink-delay14s hue-rotate-168",
    "animate-homepage-bg-shrink-delay15s hue-rotate-180",
    "animate-homepage-bg-shrink-delay16s hue-rotate-192",
    "animate-homepage-bg-shrink-delay17s hue-rotate-204",
    "animate-homepage-bg-shrink-delay18s hue-rotate-216",
    "animate-homepage-bg-shrink-delay19s hue-rotate-228",
    "animate-homepage-bg-shrink-delay20s hue-rotate-240",
    "animate-homepage-bg-shrink-delay21s hue-rotate-252",
    "animate-homepage-bg-shrink-delay22s hue-rotate-264",
    "animate-homepage-bg-shrink-delay23s hue-rotate-276",
    "animate-homepage-bg-shrink-delay24s hue-rotate-288",
    "animate-homepage-bg-shrink-delay25s hue-rotate-300",
    "animate-homepage-bg-shrink-delay26s hue-rotate-312",
    "animate-homepage-bg-shrink-delay27s hue-rotate-324",
    "animate-homepage-bg-shrink-delay28s hue-rotate-336",
    "animate-homepage-bg-shrink-delay29s hue-rotate-348"
  ];
  
  return (
    <>
      <button
        className="absolute top-4 left-4 py-2 px-4 rounded-2xl border-2 border-gray-400 dark:border-gray-600 bg-white dark:bg-black"
        onClick={() => setShow(!show)}
      >
        Turn {show ? "off" : "on"} background effect
      </button>
      {effects.map((effect, idx) =>
        <div
          key={idx}
          className={`${effect} ${show ? "visible" : "invisible"} -z-50 fixed left-0 right-0 top-0 bottom-0 m-auto w-screen h-screen border-2 border-black dark:border-white bg-radial from-[#00000000] to-[#FF0000]`}
        />
      )}
    </>
  );
}
