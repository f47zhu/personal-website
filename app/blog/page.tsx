import { FunHighlight } from "../waveEffect";
import { BlogCard } from "./blogCard";

export default function Home() {
  return (
    <>
      <div className="absolute top-4 right-4 flex flex-row gap-4">
        <a href="/">
          <button className="py-2 px-4 rounded-2xl border-2 border-gray-400 dark:border-gray-600 bg-white dark:bg-black text-black dark:text-white">
            Home
          </button>
        </a>
        <a href="/gauntle">
          <button className="py-2 px-4 rounded-2xl border-2 border-gray-400 dark:border-gray-600 bg-white dark:bg-black">
            <FunHighlight text="Games" />
          </button>
        </a>
      </div>
      <div className="animate-fade-in-length0.25s my-20 mx-[15%] max-w-250 flex flex-col gap-10">
        <div className="flex flex-row gap-20 items-center">
          <div className="grow">
            <h3 className="text-2xl text-gray-700 dark:text-gray-300 align-top">Franklin Zhu's</h3>
            <h1 className="animate-stretch-r text-7xl">Blog</h1>
          </div>
          <div className="font-serif text-3xl text-end grow-0">
            <p className="text-gray-600 dark:text-gray-400 italic">"Having a blog is performative"</p>
            <p className="text-gray-500">- Anonymous friend</p>
          </div>
        </div>
        <div className="max-w-350 h-[2] bg-linear-to-r from-[#CBD5E000] via-gray-600 to-[#CBD5E000] dark:from-[#71809600] dark:via-gray-400 dark:to-[#71809600]" />
        <BlogCard
          title={"On getting into UW Software Engineering"}
          link={"/blog/seAdmission"}
          desc={<>My personal advice for UW SE applicants.</>}
          date={"2026-06-10"}
        />
      </div>
    </>
  );
}
