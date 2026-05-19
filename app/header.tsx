import { PopUp } from "./popUp";

function HeaderElement( {link, title, color}: {link?: string, title: string, color: string} ) {
  const colorVariants: Record<string, string> = {
    textindigo: "text-indigo-700 dark:text-indigo-300",
    textgreen: "text-green-700 dark:text-green-300",
    textred: "text-red-700 dark:text-red-300",
    textorange: "text-orange-700 dark:text-orange-300",
    textyellow: "text-yellow-700 dark:text-yellow-300"
  };
  return (
    (link) ? (
      <a href={link} target={(link[0] !== '#') ? "_blank" : ""}>
        <div className={`px-[2vw] py-[2vh] text-center truncate hover:bg-gray-100 dark:hover:bg-gray-900 ${colorVariants["text" + color]}`}>
          {title}
        </div>
      </a>
    ) : (
      <div className={`px-[2vw] py-[2vh] text-center truncate hover:bg-gray-100 dark:hover:bg-gray-900 hover:brightness-150 hover:scale-105 transition-transform ease-in-out ${colorVariants["text" + color]}`}>
        {title}
      </div>
    )
  );
}

export function PageHeader() {
  return (
    <>
      <span id={"about"} />
      <div className="z-20 sticky top-0 animate-fade-in-length0.375s-delay0.75s">
        <div className="max-w-350 h-15 grid grid-cols-5 md:grid-cols-7 place-self-center place-items-center overflow-hidden text-xl tracking-[2] font-extrabold bg-linear-to-r from-[#FFFFFFBF] via-white to-[#FFFFFFBF] dark:from-[#000000BF] dark:via-black dark:to-[#000000BF]">
          <div className="hidden md:block" />
          <PopUp
            content={
              <iframe src="./Franklin_Zhu_Resume.pdf" className="h-[75vh] w-[50vw]" title="My resume" />
            }
            caption={
              <a href="./resume" target="_blank">Open in new tab</a>
            }
          >
            <HeaderElement title="Resume" color="indigo" />
          </PopUp>
          <HeaderElement link="#about" title="About Me" color="green" />
          <HeaderElement link="#projects" title="Projects" color="red" />
          <HeaderElement link="#experience" title="Experience" color="orange" />
          <HeaderElement link="#contact" title="Contact" color="yellow" />
          <div className="hidden md:block" />
        </div>
        <div className="max-w-350 h-[2] left-0 right-0 mx-auto bg-linear-to-r from-[#CBD5E000] via-gray-600 to-[#CBD5E000] dark:from-[#71809600] dark:via-gray-400 dark:to-[#71809600]" />
      </div>
    </>
  );
}
