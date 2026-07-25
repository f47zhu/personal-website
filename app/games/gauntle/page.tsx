import { FunHighlight } from "@/app/effects/waveEffect";
import { LinesBgEffect } from "../../effects/bgEffects";
import { Game } from "./game";

export default function Home() {
  return (
    <>
      <span className="animate-fade-in-length0.375s">
        <LinesBgEffect game="gauntle" />
      </span>
      <a
        href="/games"
        className="text-black dark:text-white"
      >
        <button className="absolute top-17 left-4 py-2 px-4 rounded-2xl border-2 border-gray-400 dark:border-gray-600 bg-white dark:bg-black">
          Back to <FunHighlight text="games" />
        </button>
      </a>
      <div className="absolute top-4 right-4 flex flex-row gap-4">
        <a
          href="/"
          className="text-black dark:text-white"
        >
          <button className="py-2 px-4 rounded-2xl border-2 border-gray-400 dark:border-gray-600 bg-white dark:bg-black">
            Home
          </button>
        </a>
        <a
          href="/blog"
          className="text-black dark:text-white"
        >
          <button className="py-2 px-4 rounded-2xl border-2 border-gray-400 dark:border-gray-600 bg-white dark:bg-black">
            Blog
          </button>
        </a>
      </div>
      <div className="flex h-screen">
        <div className="m-auto animate-fade-in-length0.375s">
          <Game />
        </div>
      </div>
    </>
  );
}
