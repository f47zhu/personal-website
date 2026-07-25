import { FunHighlight } from "../effects/waveEffect";
import { LinesBgEffect } from "../effects/bgEffects";

function GameCard({ title, link, bg }: { title: string, link: string, bg: React.ReactNode }) {
  return (
    <button className="relative flex flex-col h-50 grow p-4 place-content-center overflow-hidden border-[2.5] rounded-2xl">
      <a href={link}>
        <div className="brightness-50">
          {bg}
        </div>
        <h1 className="absolute right-4 bottom-4 text-4xl text-black dark:text-white">
          {title}
        </h1>
      </a>
    </button>
  );
}

export default function Home() {
  return (
    <>
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
      <div className="animate-fade-in-length0.25s my-20 mx-[15%] max-w-250 flex flex-col gap-10">
        <div className="flex flex-row gap-5 text-2xl items-center">
          <a
            href="/"
            className="text-black dark:text-white"
          >
            franklinzhu.me
          </a>
          <div>
            /
          </div>
          <div>
            <FunHighlight text="games" />
          </div>
        </div>
        <hr />
        <div className="grid grid-cols-3 gap-10">
          <GameCard
            title="Word Hunt"
            link="/games/wordHunt"
            bg={
              <LinesBgEffect
                game="wordHunt"
                showButton={false}
              />
            }
          />
          <GameCard
            title="GAUNTLE"
            link="/games/gauntle"
            bg={
              <LinesBgEffect
                game="gauntle"
                showButton={false}
              />
            }
          />
        </div>
      </div>
    </>
  );
}
