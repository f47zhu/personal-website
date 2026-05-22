"use client"

import { useState } from "react";
import { createPortal } from 'react-dom';

export function PopUp({ children, content, caption = undefined }: { children: React.ReactNode, content: React.ReactNode, caption?: React.ReactNode }) {
  const [isActive, setIsActive] = useState<boolean>(false);

  return (
    <>
      <div className="hover:cursor-pointer" onClick={() => setIsActive(true)}>{children}</div>
      {(isActive) && createPortal(
        <div className="z-50 flex flex-col fixed w-screen h-screen place-items-center justify-center gap-4 bg-[#00000080]" onClick={() => setIsActive(false)}>
          <div className="flex flex-col rounded-2xl divide-y-2 divide-gray-400 dark:divide-gray-600 border-2 border-gray-400 dark:border-gray-600" onClick={e => e.stopPropagation()}>
            <>{content}</>
            {(caption !== undefined) && (
              <div className="p-4 rounded-b-2xl text-base text-center bg-white dark:bg-black">
                {caption}
              </div>
            )}
          </div>
          <button className="py-2 px-4 text-base rounded-full border-2 border-gray-400 dark:border-gray-600 bg-white dark:bg-black">
            Back
          </button>
        </div>, document.body
      )}
    </>
  );
}
