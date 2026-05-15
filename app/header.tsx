function HeaderElement( {link, title, color}: {link: string, title: string, color: string} ) {
  const colorVariants: Record<string, string> = {
    textindigo: "text-indigo-700 dark:text-indigo-300",
    textgreen: "text-green-700 dark:text-green-300",
    textred: "text-red-700 dark:text-red-300",
    textorange: "text-orange-700 dark:text-orange-300",
    textyellow: "text-yellow-700 dark:text-yellow-300"
  };
  return (
    <a href={link} target={(link[0] !== '#') ? "_blank" : ""}>
      <div className={`px-[5vw] py-[2vh] text-center hover:bg-gray-100 dark:hover:bg-gray-900 ${colorVariants["text" + color]}`}>
        {title}
      </div>
    </a>
  );
}

export function PageHeader() {
  return (
    <>
      <span id={"about"} />
      <header className="z-50 h-15 sticky top-0 border-b-2 grid grid-cols-5 overflow-hidden place-items-center text-xl tracking-[2] font-extrabold bg-white dark:bg-black animate-fade-in-length0.75s-delay0.75s">
          <HeaderElement link="./resume" title="Resume" color="indigo" />
          <HeaderElement link="#about" title="About Me" color="green" />
          <HeaderElement link="#projects" title="Projects" color="red" />
          <HeaderElement link="#experience" title="Experience" color="orange" />
          <HeaderElement link="#contact" title="Contact" color="yellow" />
      </header>
    </>
  );
}
