import { PageCard, InnerCard } from "./cards"
import { RandomFunFact } from "./randomFunFact"
import { PageHeader } from "./header"

export default function Home() {
  return (
    <>
      <div className="m-16 mb-8 text-center text-pretty font-normal text-black dark:text-white animate-fade-in-length0.75s">
        <p className="text-7xl mb-4">Franklin Zhu</p>
        <p className="text-3xl animate-pulse">Software Engineering Student at the University of Waterloo</p>
      </div>
      <PageHeader />
      <div className="animate-fade-in-from-bottom-length0.75s-delay0.75s">
        <div className="m-16 mt-8">
          <div className="flex flex-col gap-8 place-content-center text-left">
            <PageCard
              color={"green"}
              title={"About Me"}
            >
              <p className="mt-3" />
              <p className="text-xl text-gray-800 dark:text-gray-200">
                Hello!
                My name is Franklin and I'm a first-year undergraduate student studying Software Engineering at the University of Waterloo.
                I'm extremely passionate about <b>math, coding, and problem solving as a whole,</b> and in my free time I love <b>playing and conducting music.</b>
                <span id="projects" />
              </p>
            </PageCard>
            <PageCard
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
                  <span id="experience" />
                </InnerCard>
              </>
            </PageCard>
            <PageCard
              className={"flex flex-col gap-6"}
              color={"orange"}
              title={"Experience"}
            >
              <InnerCard
                title={"Infosys"}
                tools={"Software Engineering Internship in Bangalore, Karnataka, India"}
                date={"Incoming Summer 2026"}
              >
                Excited to be integrating AI with the EdgeVerve team!
                <span id="contact" />
              </InnerCard>
            </PageCard>
            <PageCard
              className={"flex flex-col gap-6"}
              color={"yellow"}
              title={"Contact"}
            >
              <div className="grid grid-cols-4 gap-4 place-items-center">
                <a href="sms:4168228844" target="_blank">
                  <div className="p-2 hover:bg-gray-100 dark:hover:bg-gray-900">
                    <img src="./telephone-icon.webp" className="my-7 mx-10 size-20 dark:invert" />
                    <div className="m-4 text-xl text-center">
                      (416) 822-8844
                    </div>
                  </div>
                </a>
                <a href="mailto:franklinzhu0905@gmail.com" target="_blank">
                  <div className="p-2 hover:bg-gray-100 dark:hover:bg-gray-900">
                    <img src="./email-icon.png" className="my-7 mx-10 size-20 dark:invert" />
                    <div className="m-4 text-xl text-center">
                      franklinzhu0905@gmail.com
                    </div>
                  </div>
                </a>
                <a href="https://github.com/f47zhu" target="_blank">
                  <div className="p-2 hover:bg-gray-100 dark:hover:bg-gray-900">
                    <img src="./github-logo.svg" className="my-7 mx-10 size-20 dark:invert" />
                    <div className="m-4 text-xl text-center">
                      GitHub
                    </div>
                  </div>
                </a>
                <a href="https://www.linkedin.com/in/f47zhu" target="_blank">
                  <div className="p-2 hover:bg-gray-100 dark:hover:bg-gray-900">
                    <img src="./linkedin-logo.webp" className="my-7 mx-10 size-20" />
                    <div className="m-4 text-xl text-center">
                      LinkedIn
                    </div>
                  </div>
                </a>
              </div>
            </PageCard>
            <RandomFunFact />
          </div>
        </div>
      </div>
    </>
  );
}
