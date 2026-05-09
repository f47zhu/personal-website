import Image from "next/image";

// to-do: change jumps to headers, maybe outsource some sections to separate react files (next commit)

export default function Home() {

  function PageCard({ id = "", className = "", color, title, children }:
      { id?: string, className?: string, color: string, title: string, children: React.ReactNode }) {
    const colorVariants: Record<string, string> = {
      bordergreen: "border-green-700 dark:border-green-300",
      textgreen: "text-green-800 dark:text-green-200",
      borderred: "border-red-700 dark:border-red-300",
      textred: "text-red-800 dark:text-red-200",
      borderyellow: "border-yellow-700 dark:border-yellow-300",
      textyellow: "text-yellow-800 dark:text-yellow-200"
    };
    return (
      <div id={id} className={`border-4 p-6 ${colorVariants["border" + color]} ${className}`}>
        <p className={`text-4xl ${colorVariants["text" + color]}`}>{title}</p>
        {children}
      </div>
    );
  }

  function InnerCard({ title, link = "", tools = "", date = "", funFact = "", children }:
      { title: string, link?: string, tools?: string, date?: string, funFact?: string | React.ReactNode, children: React.ReactNode }) {
    return (
      <div className="border-2 p-4 border-gray-900 dark:border-gray-100">
        <span className="text-2xl">
          {link !== "" ? (<a href={link} target="_blank">{title}</a>) : (title)}
        </span>
        {tools !== "" && (
          <span className="ml-4 text-lg text-gray-500 dark:text-gray-400">{tools}</span>
        )}
        {date !== "" && (
          <span className="float-right text-2xl"><i>{date}</i></span>
        )}
        <p className="mb-2" />
        <p className="text-lg text-gray-800 dark:text-gray-200">
          {children}
          {funFact !== "" && (
            <>
              <br />
              <span className="text-xs">{funFact}</span>
            </>
          )}
        </p>
      </div>
    );
  }

  return (
    <div className="m-16 text-center font-medium text-black dark:text-white">
      <p className="text-7xl">Franklin Zhu</p>
      <p className="my-4" />
      <p className="text-3xl animate-pulse">Software Engineering Student at the University of Waterloo</p>
      <div className="text-xl m-4 text-medium font-medium">
        <p className="tracking-[2]">
          <a href="./resume" target="_blank"><span className="text-indigo-700 dark:text-indigo-300">Resume</span></a>
          <span className="ml-6" />
          <a href="#projects"><span className="text-red-700 dark:text-red-300">Projects</span></a>
          <span className="ml-6" />
          <a href="#contact"><span className="text-yellow-700 dark:text-yellow-300">Contact</span></a>
        </p>
      </div>
      <p className="my-12" />
      <hr />
      <p className="my-12" />
      <div className="flex flex-col gap-8 place-content-center text-left">
        <PageCard
          color={"green"}
          title={"About Me"}
        >
          <p className="mt-3" />
          <p className="text-xl text-gray-800 dark:text-gray-200">
            Hello!
            My name is Franklin and I'm a first-year undergraduate student studying Software Engineering at the University of Waterloo.
            I'm extremely passionate about math, coding, and problem solving as a whole, and in my free time I love playing and conducting music.
          </p>
        </PageCard>
        <PageCard
          id={"projects"}
          className={"flex flex-col gap-6"}
          color={"red"}
          title={"Projects"}
        >
          <>
            <InnerCard
              title={"EverCare"}
              link={"https://github.com/ShreyShingala/EverCare"}
              tools={"Python, MongoDB, Gemini"}
              funFact={
                <>
                  If you're wondering where my commits are, my laptop broke at the start of the hackathon!
                  I committed on <a href="https://www.jeffhqiu.com/" target="_blank">Jeff Qiu's</a> account for this one.
                </>
              }
            >
              An AI app that verbally supports dementia patients through confusions by recognizing facial distress and generating appropriate responses, built for <i>DeltaHacks 12.</i>
              &nbsp;Implemented AI chat by <b>integrating Gemini with MongoDB,</b> creating personalized responses.
            </InnerCard>
            <InnerCard
              title={"NEXUS"}
              link={"https://github.com/r05200/ctrlhackdel"}
              tools={"JavaScript, Node.js, React, CSS"}
            >
              An educational AI web app that generates, visualizes, and organizes skill trees, built for <i>CTRL+HACK+DEL 2.0.</i>
              &nbsp;Developed user interface <b>using React,</b> making it responsive, aesthetic, and easy-to-use.
              Implemented backend logic, ensuring robust and functional output.
            </InnerCard>
            <InnerCard
              title={"Chess AI"}
              link={"https://github.com/sphealmeon/my-chesshacks-bot"}
              tools={"Python, NumPy, PyTorch"}
            >
              An AI chess bot powered by adaptive moment estimation and mean squared error loss, built for <i>ChessHacks.</i>
              &nbsp;<b>Trained the PyTorch neural network</b> by creating an algorithm to calculate weights, refining bot performance.
            </InnerCard>
          </>
        </PageCard>
        <PageCard
          id={"contact"}
          className={"flex flex-col gap-6"}
          color={"yellow"}
          title={"Contact"}
        >
          <div className="grid grid-cols-4 gap-4 place-items-center">
            <a href="sms:4168228844" target="_blank">
              <div className="p-2 hover:bg-yellow-200 hover:dark:bg-gray-800">
                <img src="./telephone-icon.webp" className="my-7 mx-10 size-20 dark:invert" />
                <div className="m-4 text-xl text-center">
                  (416) 822-8844
                </div>
              </div>
            </a>
            <a href="mailto:franklinzhu0905@gmail.com" target="_blank">
              <div className="p-2 hover:bg-yellow-200 hover:dark:bg-gray-800">
                <img src="./email-icon.png" className="my-7 mx-10 size-20 dark:invert" />
                <div className="m-4 text-xl text-center">
                  franklinzhu0905@gmail.com
                </div>
              </div>
            </a>
            <a href="https://github.com/f47zhu" target="_blank">
              <div className="p-2 hover:bg-yellow-200 hover:dark:bg-gray-800">
                <img src="./github-logo.svg" className="my-7 mx-10 size-20 dark:invert" />
                <div className="m-4 text-xl text-center">
                  GitHub
                </div>
              </div>
            </a>
            <a href="https://www.linkedin.com/in/f47zhu" target="_blank">
              <div className="p-2 hover:bg-yellow-200 hover:dark:bg-gray-800">
                <img src="./linkedin-logo.webp" className="my-7 mx-10 size-20" />
                <div className="m-4 text-xl text-center">
                  LinkedIn
                </div>
              </div>
            </a>
          </div>
        </PageCard>
      </div>
    </div>
  );
}
