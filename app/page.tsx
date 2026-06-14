import { PageCard, InnerCard } from "./cards";
import { RandomFunFact } from "./randomFunFact";
import { PageHeader } from "./header";
import { WaveEffect, FunHighlight } from "./waveEffect";
import { CircleCarousel } from "./circleCarousel";
import { PopUp } from "./popUp";
import { BgEffect } from "./bgEffect";
import { AboutDetails, ProjectDetails } from "./cardDetails";

export default function Home() {
  return (
    <>
      <span className="animate-fade-in-length0.375s-delay0.75s"><BgEffect /></span>
      <div className="mx-[15%] mt-20 mb-12 text-center text-pretty font-normal text-black dark:text-white">
        <div className="text-7xl mb-4 text-red-800 dark:text-red-200 animate-fade-in-length0.75s">
          <WaveEffect text="Franklin Zhu" />
        </div>
        <div className="text-3xl text-red-800 dark:text-red-200 brightness-85 animate-fade-in-length0.75s-delay0.375s">
          <WaveEffect text="Software Engineering Student at the University of Waterloo" />
        </div>
      </div>
      <div className="absolute top-4 right-4 flex flex-row gap-4">
        <a href="/gauntle">
          <button className="py-2 px-4 rounded-2xl border-2 border-gray-400 dark:border-gray-600 bg-white dark:bg-black">
            <FunHighlight text="Games" />
          </button>
        </a>
        <a href="/blog">
          <button className="py-2 px-4 rounded-2xl border-2 border-gray-400 dark:border-gray-600 bg-white dark:bg-black text-black dark:text-white">
            Blog
          </button>
        </a>
      </div>
      <PageHeader />
      <div className="mx-[15%] max-w-250 my-10 place-self-center flex flex-col gap-10 place-content-center text-left animate-fade-in-from-bottom-length0.375s-delay0.75s">
        <PageCard
          color={"green"}
          title={"About Me"}
          subtitle={<AboutDetails />}
          animation={"fromLeft"}
        >
          <div className="flex flex-row mt-3 text-xl text-gray-800 dark:text-gray-200">
            <div>
              Hello!
              My name is Franklin (he/him) and I'm a first-year undergraduate student studying Software Engineering at the University of Waterloo.
              I'm extremely passionate about <FunHighlight text="math, coding, and problem solving as a whole," /> and in my free time
              I love <FunHighlight text="playing and conducting music." />
              <span id="projects" />
            </div>
            <div className="hidden md:block z-10 relative float-right top-5 left-10 -m-20 -ml-4 -mb-50 flex-none size-75">
              <CircleCarousel
                isPopUps={true}
                images={[
                  <PopUp
                    key={0}
                    clickable={
                      <img loading="lazy"
                        className="rounded-full size-75 object-cover object-[60%] border-2 border-green-700 dark:border-green-300"
                        src={"/selfies/me-conducting.webp"} alt="Me conducting a band"
                      />
                    }
                    caption={
                      <>
                        Me conducting the <a href="https://uwcbc.uwaterloo.ca/index.html" target="_blank">UW Concert Band</a> at
                        their <a href="https://www.youtube.com/watch?v=6mtwLXmYHcU&t=2162s" target="_blank">Winter 2026 concert.</a>
                      </>
                    }
                  >
                    <img loading="lazy"
                      className="object-scale-down min-w-0 min-h-0 rounded-t-2xl"
                      src={"/selfies/me-conducting.webp"} alt="Me conducting a band"
                    />
                  </PopUp>,
                  <PopUp
                    key={1}
                    clickable={
                      <img loading="lazy"
                        className="rounded-full size-75 object-cover object-left border-2 border-green-700 dark:border-green-300"
                        src={"/selfies/me-playing-the-flute.webp"} alt="Me playing the flute"
                      />
                    }
                    caption={
                      <>
                        Me playing the flute in the <a href="https://uwcbc.uwaterloo.ca/index.html" target="_blank">UW Concert Band</a> Flute Quartet
                        during their <a href="https://www.youtube.com/watch?v=6mtwLXmYHcU&t=1714s" target="_blank">Winter 2026 concert.</a>
                      </>
                    }
                  >
                    <img loading="lazy"
                      className="object-scale-down min-h-0 rounded-t-2xl"
                      src={"/selfies/me-playing-the-flute.webp"} alt="Me playing the flute"
                    />
                  </PopUp>,
                  <PopUp
                    key={2}
                    clickable={
                      <img loading="lazy"
                        className="rounded-full size-75 object-cover object-[60%] border-2 border-green-700 dark:border-green-300"
                        src={"/selfies/me-ziplining.webp"} alt="Me ziplining over a river"
                      />
                    }
                    caption={
                      <>
                        Me ziplining upside-down over a river in Whistler, BC.
                      </>
                    }
                  >
                    <img loading="lazy"
                      className="object-scale-down min-h-0 rounded-t-2xl"
                      src={"/selfies/me-ziplining.webp"} alt="Me ziplining over a river"
                    />
                  </PopUp>,
                  <PopUp
                    key={3}
                    clickable={
                      <img loading="lazy"
                        className="rounded-full size-75 object-cover object-[60%_0%] border-2 border-green-700 dark:border-green-300"
                        src={"/selfies/me-with-a-bear.webp"} alt="Me posing with a bear statue"
                      />
                    }
                    caption={
                      <>
                        Me posing with a bear statue in Whistler, BC.
                      </>
                    }
                  >
                    <img loading="lazy"
                      className="object-scale-down min-w-0 min-h-0 rounded-t-2xl"
                      src={"/selfies/me-with-a-bear.webp"} alt="Me posing with a bear statue"
                    />
                  </PopUp>
                ]}
              />
            </div>
          </div>
        </PageCard>
        <PageCard
          className={"flex flex-col gap-6"}
          color={"red"}
          title={"Projects"}
          subtitle={
            <ProjectDetails />
          }
          animation={"fromRight"}
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
              An AI app that verbally supports dementia patients through confusions by recognizing facial distress and generating appropriate responses,
              built for <i>DeltaHacks 12.</i> Implemented AI chat by <b>integrating Gemini with MongoDB,</b> creating personalized responses.
            </InnerCard>
            <InnerCard
              title={"NEXUS"}
              link={"https://github.com/r05200/ctrlhackdel"}
              tools={"Node.js, React, CSS"}
            >
              An educational AI web app that generates, visualizes, and organizes skill trees, built for <i>CTRL+HACK+DEL 2.0.</i> Developed
              user interface <b>using React,</b> making it responsive, aesthetic, and easy-to-use.
              Implemented backend logic, ensuring robust and functional output.
            </InnerCard>
            <InnerCard
              title={"Chess AI"}
              link={"https://github.com/sphealmeon/my-chesshacks-bot"}
              tools={"Python, NumPy, PyTorch"}
            >
              An AI chess bot powered by adaptive moment estimation and mean squared error loss, built
              for <i>ChessHacks.</i> <b>Trained the PyTorch neural network</b> by creating an algorithm to calculate weights, refining bot performance.
              <span id="experience" />
            </InnerCard>
          </>
        </PageCard>
        <PageCard
          className={"flex flex-col gap-6"}
          color={"orange"}
          title={"Experience"}
          animation={"fromLeft"}
        >
          <InnerCard
            title={"Infosys"}
            link={"https://en.wikipedia.org/wiki/Infosys"}
            tools={"AI Integration Intern"}
            date={"Bangalore, Karnataka ⋅ Incoming Summer 2026"}
          >
            Excited to be integrating AI with the EdgeVerve team!
            <span id="contact" />
          </InnerCard>
        </PageCard>
        <PageCard
          color={"yellow"}
          title={"Contact"}
          animation={"fromRight"}
        >
          <div className="grid grid-rows-2 grid-cols-2 md:grid-rows-none md:grid-cols-4 mt-3 -mb-4 gap-8 place-items-center">
            <a href="sms:4168228844" target="_blank">
              <button className="flex flex-col place-items-center p-2 rounded-2xl hover:bg-gray-100 dark:hover:bg-gray-900">
                <img loading="lazy" src="./telephone-icon.webp" className="m-4 size-[50%] dark:invert" />
                <div className="m-4 text-lg text-center">
                  (416) 822-8844
                </div>
              </button>
            </a>
            <a href="mailto:franklinzhu0905@gmail.com" target="_blank">
              <button className="flex flex-col place-items-center p-2 rounded-2xl hover:bg-gray-100 dark:hover:bg-gray-900">
                <img loading="lazy" src="./email-icon.webp" className="m-4 size-[30%] place-self-center dark:invert" />
                <div className="m-4 text-lg text-center">
                  franklinzhu0905@gmail.com
                </div>
              </button>
            </a>
            <a href="https://github.com/f47zhu" target="_blank">
              <button className="flex flex-col place-items-center p-2 rounded-2xl hover:bg-gray-100 dark:hover:bg-gray-900">
                <img loading="lazy" src="./github-logo.svg" className="m-4 size-[50%] dark:invert" />
                <div className="m-4 text-lg text-center">
                  GitHub
                </div>
              </button>
            </a>
            <a href="https://www.linkedin.com/in/f47zhu" target="_blank">
              <button className="flex flex-col place-items-center p-2 rounded-2xl hover:bg-gray-100 dark:hover:bg-gray-900">
                <img loading="lazy" src="./linkedin-logo.webp" className="m-4 size-[50%]" />
                <div className="m-4 text-lg text-center">
                  LinkedIn
                </div>
              </button>
            </a>
          </div>
        </PageCard>
        <RandomFunFact />
      </div>
    </>
  );
}
