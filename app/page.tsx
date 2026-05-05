import Image from "next/image";

export default function Home() {

  function PageCard({ id = "", className = "", color, title, children }:
      { id?: string, className?: string, color: string, title: string, children: React.ReactNode }) {
    const colorVariants: Record<string, string> = {
      bordergreen: "border-green-700 dark:border-green-300 ",
      borderred: "border-red-700 dark:border-red-300 ",
      textgreen: "text-green-800 dark:text-green-200",
      textred: "text-red-800 dark:text-red-200"
    };
    return (
      <div id={id} className={`border-4 p-6 ${colorVariants["border" + color]} ${className}`}>
        <p className={`text-4xl ${colorVariants["text" + color]}`}>{title}</p>
        {children}
      </div>
    );
  }

  function InnerCard({ title, link = "", tools, description, funFact = "" }:
      { title: string, link: string, tools: string, description: string, funFact?: string | React.ReactNode }) {
    return (
      <div className="border-2 p-4 border-gray-900 dark:border-gray-100">
        <span className="text-2xl"><a href={link} target="_blank">{title}</a></span>
        <span className="ml-4 text-lg text-gray-500 dark:text-gray-400">{tools}</span>
        <p className="mb-2" />
        <p className="text-lg text-gray-800 dark:text-gray-200">
          {description}
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
          <a href="#projects"><span className="text-red-700 dark:text-red-300">Projects</span></a>
          <span className="ml-6" />
          <a href="./resume" target="_blank"><span className="text-yellow-700 dark:text-yellow-300">Resume</span></a>
          <span className="ml-6" />
          <a href="https://github.com/f47zhu" target="_blank"><span className="text-green-700 dark:text-green-300">GitHub</span></a>
          <span className="ml-6" />
          <a href="https://www.linkedin.com/in/f47zhu" target="_blank"><span className="text-blue-700 dark:text-blue-300">LinkedIn</span></a>
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
              description={`
                An AI app that verbally supports dementia patients through confusions by recognizing facial distress and generating appropriate responses, built for DeltaHacks 12.
                Implemented AI chat by integrating Gemini with MongoDB, creating personalized responses.
              `}
              funFact={
                <>
                  If you're wondering where my commits are, my laptop broke at the start of the hackathon!
                  I committed on <a href="https://www.jeffhqiu.com/" target="_blank">Jeff Qiu's</a> account for this one.
                </>
              }
            />
            <InnerCard
              title={"NEXUS"}
              link={"https://github.com/r05200/ctrlhackdel"}
              tools={"JavaScript, Node.js, React, CSS"}
              description={`
                An educational AI web app that generates, visualizes, and organizes skill trees, built for CTRL+HACK+DEL 2.0.
                Developed user interface using React, making it responsive, aesthetic, and easy-to-use.
                Implemented backend logic, ensuring robust and functional output.
              `}
            />
            <InnerCard
              title={"Chess AI"}
              link={"https://github.com/sphealmeon/my-chesshacks-bot"}
              tools={"Python, NumPy, PyTorch"}
              description={`
                An AI chess bot powered by adaptive moment estimation and mean squared error loss, built for ChessHacks.
                Trained the PyTorch neural network by creating an algorithm to calculate weights, refining bot performance.
              `}
            />
          </>
        </PageCard>
      </div>
    </div>
  );
}
