import { BgEffect } from "../bgEffect";
import { Game } from "./game";

export default function Home() {
  return (
    <>
      <BgEffect />
      <div className="absolute top-4 right-4 flex flex-row gap-4">
        <a href="/">
          <button className="py-2 px-4 rounded-2xl border-2 border-gray-400 dark:border-gray-600 bg-white dark:bg-black text-black dark:text-white">
            Home
          </button>
        </a>
        <a href="/blog">
          <button className="py-2 px-4 rounded-2xl border-2 border-gray-400 dark:border-gray-600 bg-white dark:bg-black text-black dark:text-white">
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
