"use client"

import { useState } from "react";

export function BgEffect({}) {
  const [show, setShow] = useState<boolean>(true);

  const effects: string[] = [
    "animate-bg-pulse",
    "animate-bg-pulse-delay1s hue-rotate-12",
    "animate-bg-pulse-delay2s hue-rotate-24",
    "animate-bg-pulse-delay3s hue-rotate-36",
    "animate-bg-pulse-delay4s hue-rotate-48",
    "animate-bg-pulse-delay5s hue-rotate-60",
    "animate-bg-pulse-delay6s hue-rotate-72",
    "animate-bg-pulse-delay7s hue-rotate-84",
    "animate-bg-pulse-delay8s hue-rotate-96",
    "animate-bg-pulse-delay9s hue-rotate-108",
    "animate-bg-pulse-delay10s hue-rotate-120",
    "animate-bg-pulse-delay11s hue-rotate-132",
    "animate-bg-pulse-delay12s hue-rotate-144",
    "animate-bg-pulse-delay13s hue-rotate-156",
    "animate-bg-pulse-delay14s hue-rotate-168",
    "animate-bg-pulse-delay15s hue-rotate-180",
    "animate-bg-pulse-delay16s hue-rotate-192",
    "animate-bg-pulse-delay17s hue-rotate-204",
    "animate-bg-pulse-delay18s hue-rotate-216",
    "animate-bg-pulse-delay19s hue-rotate-228",
    "animate-bg-pulse-delay20s hue-rotate-240",
    "animate-bg-pulse-delay21s hue-rotate-252",
    "animate-bg-pulse-delay22s hue-rotate-264",
    "animate-bg-pulse-delay23s hue-rotate-276",
    "animate-bg-pulse-delay24s hue-rotate-288",
    "animate-bg-pulse-delay25s hue-rotate-300",
    "animate-bg-pulse-delay26s hue-rotate-312",
    "animate-bg-pulse-delay27s hue-rotate-324",
    "animate-bg-pulse-delay28s hue-rotate-336",
    "animate-bg-pulse-delay29s hue-rotate-348"
  ];


  
  return (
    <>
      <button className="absolute top-4 left-4 py-2 px-4 rounded-2xl border-2 border-gray-400 dark:border-gray-600 bg-white dark:bg-black" onClick={() => setShow(!show)}>
        Turn {show ? "off" : "on"} background effect
      </button>
      {effects.map((effect, idx) =>
        <div key={idx} className={`${effect} ${show ? "visible" : "invisible"} -z-50 fixed left-0 right-0 top-0 bottom-0 m-auto w-screen h-screen border-2 border-black dark:border-white bg-radial from-[#00000000] via-[#00000000] via-25% to-[#FF0000]`} />
      )}
    </>
  );
}