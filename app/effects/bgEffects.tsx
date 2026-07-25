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
          className={`${effect} ${show ? "visible" : "invisible"} -z-50 fixed inset-0 m-auto w-screen h-screen border-2 border-black dark:border-white bg-radial from-[#00000000] to-[#FF0000]`}
        />
      )}
    </>
  );
}

export function LinesBgEffect({ game, size = 100, showButton = true }:
    { game: string, size?: number, showButton?: boolean }) {
  const [show, setShow] = useState<boolean>(true);

  const animateProperty: Record<string, string[]> = {
    "gauntle": [
      "animate-gauntle-bg-pulse",
      "animate-gauntle-bg-pulse-delay0.1s",
      "animate-gauntle-bg-pulse-delay0.2s",
      "animate-gauntle-bg-pulse-delay0.3s",
      "animate-gauntle-bg-pulse-delay0.4s",
      "animate-gauntle-bg-pulse-delay0.5s",
      "animate-gauntle-bg-pulse-delay0.6s",
      "animate-gauntle-bg-pulse-delay0.7s",
      "animate-gauntle-bg-pulse-delay0.8s",
      "animate-gauntle-bg-pulse-delay0.9s",
      "animate-gauntle-bg-pulse-delay1.0s",
      "animate-gauntle-bg-pulse-delay1.1s",
      "animate-gauntle-bg-pulse-delay1.2s",
      "animate-gauntle-bg-pulse-delay1.3s",
      "animate-gauntle-bg-pulse-delay1.4s",
      "animate-gauntle-bg-pulse-delay1.5s",
      "animate-gauntle-bg-pulse-delay1.6s",
      "animate-gauntle-bg-pulse-delay1.7s",
      "animate-gauntle-bg-pulse-delay1.8s",
      "animate-gauntle-bg-pulse-delay1.9s",
      "animate-gauntle-bg-pulse-delay2.0s",
      "animate-gauntle-bg-pulse-delay2.1s",
      "animate-gauntle-bg-pulse-delay2.2s",
      "animate-gauntle-bg-pulse-delay2.3s",
      "animate-gauntle-bg-pulse-delay2.4s",
      "animate-gauntle-bg-pulse-delay2.5s",
      "animate-gauntle-bg-pulse-delay2.6s",
      "animate-gauntle-bg-pulse-delay2.7s",
      "animate-gauntle-bg-pulse-delay2.8s",
      "animate-gauntle-bg-pulse-delay2.9s",
      "animate-gauntle-bg-pulse-delay3.0s",
      "animate-gauntle-bg-pulse-delay3.1s",
      "animate-gauntle-bg-pulse-delay3.2s",
      "animate-gauntle-bg-pulse-delay3.3s",
      "animate-gauntle-bg-pulse-delay3.4s",
      "animate-gauntle-bg-pulse-delay3.5s",
      "animate-gauntle-bg-pulse-delay3.6s",
      "animate-gauntle-bg-pulse-delay3.7s",
      "animate-gauntle-bg-pulse-delay3.8s",
      "animate-gauntle-bg-pulse-delay3.9s",
      "animate-gauntle-bg-pulse-delay4.0s",
      "animate-gauntle-bg-pulse-delay4.1s",
      "animate-gauntle-bg-pulse-delay4.2s",
      "animate-gauntle-bg-pulse-delay4.3s",
      "animate-gauntle-bg-pulse-delay4.4s",
      "animate-gauntle-bg-pulse-delay4.5s",
      "animate-gauntle-bg-pulse-delay4.6s",
      "animate-gauntle-bg-pulse-delay4.7s",
      "animate-gauntle-bg-pulse-delay4.8s",
      "animate-gauntle-bg-pulse-delay4.9s"
    ],
    "wordHunt": [
      "animate-wordHunt-bg-pulse",
      "animate-wordHunt-bg-pulse-delay1s",
      "animate-wordHunt-bg-pulse-delay2s",
      "animate-wordHunt-bg-pulse-delay3s",
      "animate-wordHunt-bg-pulse-delay4s",
      "animate-wordHunt-bg-pulse-delay5s",
      "animate-wordHunt-bg-pulse-delay6s",
      "animate-wordHunt-bg-pulse-delay7s",
      "animate-wordHunt-bg-pulse-delay8s",
      "animate-wordHunt-bg-pulse-delay9s",
      "animate-wordHunt-bg-pulse-delay10s",
      "animate-wordHunt-bg-pulse-delay11s",
      "animate-wordHunt-bg-pulse-delay12s",
      "animate-wordHunt-bg-pulse-delay13s",
      "animate-wordHunt-bg-pulse-delay14s",
      "animate-wordHunt-bg-pulse-delay15s",
      "animate-wordHunt-bg-pulse-delay16s",
      "animate-wordHunt-bg-pulse-delay17s",
      "animate-wordHunt-bg-pulse-delay18s",
      "animate-wordHunt-bg-pulse-delay19s",
      "animate-wordHunt-bg-pulse-delay20s",
      "animate-wordHunt-bg-pulse-delay21s",
      "animate-wordHunt-bg-pulse-delay22s",
      "animate-wordHunt-bg-pulse-delay23s",
      "animate-wordHunt-bg-pulse-delay24s",
      "animate-wordHunt-bg-pulse-delay25s",
      "animate-wordHunt-bg-pulse-delay26s",
      "animate-wordHunt-bg-pulse-delay27s",
      "animate-wordHunt-bg-pulse-delay28s",
      "animate-wordHunt-bg-pulse-delay29s",
      "animate-wordHunt-bg-pulse-delay30s",
      "animate-wordHunt-bg-pulse-delay31s",
      "animate-wordHunt-bg-pulse-delay32s",
      "animate-wordHunt-bg-pulse-delay33s",
      "animate-wordHunt-bg-pulse-delay34s",
      "animate-wordHunt-bg-pulse-delay35s",
      "animate-wordHunt-bg-pulse-delay36s",
      "animate-wordHunt-bg-pulse-delay37s",
      "animate-wordHunt-bg-pulse-delay38s",
      "animate-wordHunt-bg-pulse-delay39s",
      "animate-wordHunt-bg-pulse-delay40s",
      "animate-wordHunt-bg-pulse-delay41s",
      "animate-wordHunt-bg-pulse-delay42s",
      "animate-wordHunt-bg-pulse-delay43s",
      "animate-wordHunt-bg-pulse-delay44s",
      "animate-wordHunt-bg-pulse-delay45s",
      "animate-wordHunt-bg-pulse-delay46s",
      "animate-wordHunt-bg-pulse-delay47s",
      "animate-wordHunt-bg-pulse-delay48s",
      "animate-wordHunt-bg-pulse-delay49s",
      "animate-wordHunt-bg-pulse-delay50s",
      "animate-wordHunt-bg-pulse-delay51s",
      "animate-wordHunt-bg-pulse-delay52s",
      "animate-wordHunt-bg-pulse-delay53s",
      "animate-wordHunt-bg-pulse-delay54s",
      "animate-wordHunt-bg-pulse-delay55s",
      "animate-wordHunt-bg-pulse-delay56s",
      "animate-wordHunt-bg-pulse-delay57s",
      "animate-wordHunt-bg-pulse-delay58s",
      "animate-wordHunt-bg-pulse-delay59s"
    ]
  }

  const properties: Record<string, string[]> = {
    "color": [
      "bg-red-500",
      "bg-orange-500",
      "bg-amber-500",
      "bg-yellow-500",
      "bg-lime-500",
      "bg-green-500",
      "bg-emerald-500",
      "bg-teal-500",
      "bg-cyan-500",
      "bg-sky-500",
      "bg-blue-500",
      "bg-indigo-500",
      "bg-violet-500",
      "bg-purple-500",
      "bg-fuchsia-500",
      "bg-pink-500",
      "bg-rose-500"
      // "bg-linear-to-r from-red-500 to-cyan-500",
      // "bg-linear-to-r from-orange-500 to-sky-500",
      // "bg-linear-to-r from-amber-500 to-blue-500",
      // "bg-linear-to-r from-yellow-500 to-indigo-500",
      // "bg-linear-to-r from-lime-500 to-violet-500",
      // "bg-linear-to-r from-green-500 to-purple-500",
      // "bg-linear-to-r from-emerald-500 to-fuchsia-500",
      // "bg-linear-to-r from-teal-500 to-pink-500",
      // "bg-linear-to-r from-cyan-500 to-rose-500",
      // "bg-linear-to-r from-sky-500 to-red-500",
      // "bg-linear-to-r from-blue-500 to-orange-500",
      // "bg-linear-to-r from-indigo-500 to-amber-500",
      // "bg-linear-to-r from-violet-500 to-yellow-500",
      // "bg-linear-to-r from-purple-500 to-lime-500",
      // "bg-linear-to-r from-fuchsia-500 to-green-500",
      // "bg-linear-to-r from-pink-500 to-emerald-500",
      // "bg-linear-to-r from-rose-500 to-teal-500"
    ],
    "rotate": [
      "rotate-0",
      "rotate-10",
      "rotate-20",
      "rotate-30",
      "rotate-40",
      "rotate-50",
      "rotate-60",
      "rotate-70",
      "rotate-80",
      "rotate-90",
      "rotate-100",
      "rotate-110",
      "rotate-120",
      "rotate-130",
      "rotate-140",
      "rotate-150",
      "rotate-160",
      "rotate-170"
    ],
    "translate-x": [
      "-translate-x-180",
      "-translate-x-170",
      "-translate-x-160",
      "-translate-x-150",
      "-translate-x-140",
      "-translate-x-130",
      "-translate-x-120",
      "-translate-x-110",
      "-translate-x-100",
      "-translate-x-90",
      "-translate-x-80",
      "-translate-x-70",
      "-translate-x-60",
      "-translate-x-50",
      "-translate-x-40",
      "-translate-x-30",
      "-translate-x-20",
      "-translate-x-10",
      "translate-x-0",
      "translate-x-10",
      "translate-x-20",
      "translate-x-30",
      "translate-x-40",
      "translate-x-50",
      "translate-x-60",
      "translate-x-70",
      "translate-x-80",
      "translate-x-90",
      "translate-x-100",
      "translate-x-110",
      "translate-x-120",
      "translate-x-130",
      "translate-x-140",
      "translate-x-150",
      "translate-x-160",
      "translate-x-170"
    ],
    "translate-y": [
      "-translate-y-180",
      "-translate-y-170",
      "-translate-y-160",
      "-translate-y-150",
      "-translate-y-140",
      "-translate-y-130",
      "-translate-y-120",
      "-translate-y-110",
      "-translate-y-100",
      "-translate-y-90",
      "-translate-y-80",
      "-translate-y-70",
      "-translate-y-60",
      "-translate-y-50",
      "-translate-y-40",
      "-translate-y-30",
      "-translate-y-20",
      "-translate-y-10",
      "translate-y-0",
      "translate-y-10",
      "translate-y-20",
      "translate-y-30",
      "translate-y-40",
      "translate-y-50",
      "translate-y-60",
      "translate-y-70",
      "translate-y-80",
      "translate-y-90",
      "translate-y-100",
      "translate-y-110",
      "translate-y-120",
      "translate-y-130",
      "translate-y-140",
      "translate-y-150",
      "translate-y-160",
      "translate-y-170"
    ]
  };

  const [lines, setLines] = useState<Record<string, string>[]>([]);
  
  useEffect(() => {
    let newLines: Record<string, string>[] = [];
    for (let i = 0; i < size; ++i) {
      newLines.push({
        "animate": animateProperty[game][randint(animateProperty[game].length)],
        "color": properties["color"][randint(properties["color"].length)],
        "rotate": properties["rotate"][randint(properties["rotate"].length)],
        "translate-x": properties["translate-x"][randint(properties["translate-x"].length)],
        "translate-y": properties["translate-y"][randint(properties["translate-y"].length)]
      })
    }
    setLines(newLines);
  }, []);
  
  return (
    <>
      {showButton && (
        <button
          className="absolute top-4 left-4 py-2 px-4 rounded-2xl border-2 border-gray-400 dark:border-gray-600 bg-white dark:bg-black"
          onClick={() => setShow(!show)}
        >
          Turn {show ? "off" : "on"} background effect
        </button>
      )}
      <div className="-z-50 fixed inset-0 m-auto w-screen h-screen">
        {lines.map((line, idx) => 
          <div
            key={idx}
            className={`${show ? "visible" : "invisible"} ${line["animate"]} h-1 ${line["color"]} place-self-center w-screen scale-x-1000 ${line["rotate"]} ${line["translate-x"]} ${line["translate-y"]}`}
          />
        )}
      </div>
    </>
  );
}
