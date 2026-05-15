export function PageCard({ className = "", color, title, children }:
    { className?: string, color: string, title: string, children: React.ReactNode }) {
  const colorVariants: Record<string, string> = {
    bordergreen: "border-green-700 dark:border-green-300",
    textgreen: "text-green-800 dark:text-green-200",
    bggreen: "bg-[#FFDFFF] dark:bg-[#002000]",
    borderred: "border-red-700 dark:border-red-300",
    textred: "text-red-800 dark:text-red-200",
    bgred: "bg-[#DFFFFF] dark:bg-[#200000]",
    borderyellow: "border-yellow-700 dark:border-yellow-300",
    textyellow: "text-yellow-800 dark:text-yellow-200",
    bgyellow: "bg-[#DFDFFF] dark:bg-[#202000]",
    borderorange: "border-orange-700 dark:border-orange-300",
    textorange: "text-orange-800 dark:text-orange-200",
    bgorange: "bg-[#DFEFFF] dark:bg-[#201000]"
  };
  return (
    <div className={`border-4 p-6 ${colorVariants["border" + color]} ${colorVariants["bg" + color]} ${className}`}>
      <p className={`text-4xl font-[575] ${colorVariants["text" + color]}`}>{title}</p>
      {children}
    </div>
  );
}

export function InnerCard({ title, link = "", tools = "", date = "", funFact = "", children }:
    { title: string, link?: string, tools?: string, date?: string, funFact?: string | React.ReactNode, children: React.ReactNode }) {
  return (
    <div className="border-2 p-4 bg-white dark:bg-black border-gray-900 dark:border-gray-100">
      <span className="text-2xl font-medium">
        {link !== "" ? (<a href={link} target="_blank">{title}</a>) : (title)}
      </span>
      {tools !== "" && (
        <span className="ml-4 text-lg text-gray-600 dark:text-gray-400">{tools}</span>
      )}
      {date !== "" && (
        <span className="float-right text-xl text-gray-700 dark:text-gray-300"><i>{date}</i></span>
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
