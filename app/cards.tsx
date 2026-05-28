"use client"

import { useInView } from "react-intersection-observer";

export function PageCard({ className = "", color, title, subtitle = undefined, children, animation = "fromLeft" }:
    { className?: string, color: string, title: string, subtitle?: React.ReactNode, children: React.ReactNode, animation?: string }) {
  const [ref, inView] = useInView({
    threshold: 0,
    initialInView: true // This is to make cards visible when bfcache is used.
    // bfcache still breaks animations, but it's the best I'll do for now
  });
  
  const colorVariants: Record<string, string> = {
    bordergreen: "border-green-700 dark:border-green-300",
    textgreen: "text-green-800 dark:text-green-200",
    bggreen: "bg-[#DFFFDF] dark:bg-[#002000]",
    borderred: "border-red-700 dark:border-red-300",
    textred: "text-red-800 dark:text-red-200",
    bgred: "bg-[#FFDFDF] dark:bg-[#200000]",
    borderyellow: "border-yellow-700 dark:border-yellow-300",
    textyellow: "text-yellow-800 dark:text-yellow-200",
    bgyellow: "bg-[#FFFFDF] dark:bg-[#202000]",
    borderorange: "border-orange-700 dark:border-orange-300",
    textorange: "text-orange-800 dark:text-orange-200",
    bgorange: "bg-[#FFEFDF] dark:bg-[#201000]"
  };
  const animationVariants: Record<string, string> = {
    fromLeft: "animate-fade-in-from-left-length0.5s",
    fromRight: "animate-fade-in-from-right-length0.5s",
  };

  return (
    <div ref={ref} className={`${inView ? animationVariants[animation] : "invisible"} p-8 border-2 rounded-2xl ${colorVariants["border" + color]} ${colorVariants["bg" + color]} ${className}`}>
      <div className={`text-4xl font-[575] ${colorVariants["text" + color]}`}>
        {title}
        {(subtitle !== undefined) && (
          <div className="inline-block ml-5.5 text-xl">
            {subtitle}
          </div>
        )}
      </div>
      {children}
    </div>
  );
}

export function InnerCard({ title, link = "", tools = "", date = "", funFact = "", children }:
    { title: string, link?: string, tools?: string, date?: string, funFact?: string | React.ReactNode, children: React.ReactNode }) {
  return (
    <div className="border-2 rounded-2xl p-6 bg-white dark:bg-black border-gray-400 dark:border-gray-600">
      <span className="text-2xl font-medium">
        {link !== "" ? (<a href={link} target="_blank">{title}</a>) : (title)}
      </span>
      {tools !== "" && (
        <span className="ml-4 text-lg text-gray-600 dark:text-gray-400">{tools}</span>
      )}
      {date !== "" && (
        <span className="float-right text-base text-gray-700 dark:text-gray-300"><i>{date}</i></span>
      )}
      <p className="mb-2" />
      <div className="text-lg text-gray-800 dark:text-gray-200">
        {children}
        {funFact !== "" && (
          <>
            <br />
            <span className="text-xs">{funFact}</span>
          </>
        )}
      </div>
    </div>
  );
}
