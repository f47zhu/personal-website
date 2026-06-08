"use client"

import { useState } from "react";
import { createPortal } from 'react-dom';

export function PopUp({ children, clickable, caption = undefined, color = "gray" }
    : { children: React.ReactNode, clickable: React.ReactNode, caption?: React.ReactNode, color?: string }) {
  const [isActive, setIsActive] = useState<boolean>(false);

  const themeVariants: Record<string, string> = {
    green: "divide-green-700 dark:divide-green-300 border-green-700 dark:border-green-300 bg-[#DFFFDF] dark:bg-[#002000]",
    red: "divide-red-700 dark:divide-red-300 border-red-700 dark:border-red-300 bg-[#FFDFDF] dark:bg-[#200000]",
    yellow: "divide-yellow-700 dark:divide-yellow-300 border-yellow-700 dark:border-yellow-300 bg-[#FFFFDF] dark:bg-[#202000]",
    orange: "divide-orange-700 dark:divide-orange-300 border-orange-700 dark:border-orange-300 bg-[#FFEFDF] dark:bg-[#201000]",
    gray: "divide-gray-400 dark:divide-gray-600 border-gray-400 dark:border-gray-600 bg-white dark:bg-black"
  };

  return (
    <>
      <div className="hover:cursor-pointer" onClick={() => setIsActive(true)}>{clickable}</div>
      {(isActive) && createPortal(
        <div className={`${isActive && "animate-fade-in-length0.125s"} z-50 fixed w-screen h-screen place-self-center place-content-center bg-[#00000080]`} onClick={() => setIsActive(false)}>
          <div className={`${isActive && "animate-pop-in-length0.125s"} flex flex-col place-self-center place-items-center gap-4 w-fit max-w-187.5 max-h-[75%] mx-[15%]`}>
            <div className={`flex flex-col rounded-2xl divide-y-2 min-w-0 min-h-0 border-2 ${themeVariants[color]}`} onClick={e => e.stopPropagation()}>
              <>{children}</>
              {(caption !== undefined) && (
                <div className="p-4 rounded-b-2xl text-base text-center bg-white dark:bg-black">
                  {caption}
                </div>
              )}
            </div>
            <button className="py-2 px-4 text-base rounded-full border-2 border-gray-400 dark:border-gray-600 bg-white dark:bg-black">
              Back
            </button>
          </div>
        </div>, document.body
      )}
    </>
  );
}
