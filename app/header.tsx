export function PageHeader() {
  return <>
    <span id={"about"} />
    <header className="z-50 h-15 sticky top-0 border-b-2 grid grid-cols-5 overflow-hidden place-items-center text-xl tracking-[2] font-extrabold bg-white dark:bg-black">
        <a href="./resume" target="_blank">
          <div className="px-[5vw] py-[2vh] text-center text-indigo-700 dark:text-indigo-300 hover:bg-gray-400 dark:hover:bg-gray-600">
            Resume
          </div>
        </a>
        <a href="#about">
          <div className="px-[5vw] py-[2vh] text-center text-green-700 dark:text-green-300 hover:bg-gray-400 dark:hover:bg-gray-600">
            About Me
          </div>
        </a>
        <a href="#projects">
          <div className="px-[5vw] py-[2vh] text-center text-red-700 dark:text-red-300 hover:bg-gray-400 dark:hover:bg-gray-600">
            Projects
          </div>
        </a>
        <a href="#experience">
          <div className="px-[5vw] py-[2vh] text-center text-orange-700 dark:text-orange-300 hover:bg-gray-400 dark:hover:bg-gray-600">
            Experience
          </div>
        </a>
        <a href="#contact">
          <div className="px-[5vw] py-[2vh] text-centerext-yellow-700 dark:text-yellow-300 hover:bg-gray-400 dark:hover:bg-gray-600">
            Contact
          </div>
        </a>
    </header>
  </>;
}

// to-do: outsource header spam to a function