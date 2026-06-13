import { PopUp } from "./popUp";
import { InnerCard } from "./cards";
import { FunHighlight } from "./waveEffect";

export function AboutDetails() {
  return (
    <PopUp
      clickable={<button className="relative -top-2 -mb-2 py-2 px-4 text-lg rounded-full border-2 border-gray-400 dark:border-gray-600 bg-white dark:bg-black">see more</button>}
      color={"green"}
    >
      <div className="p-8 overflow-y-scroll overscroll-contain place-self-center flex flex-col gap-6">
        <p className="-mb-2 text-4xl text-green-800 dark:text-green-200">About Me</p>
        <div className="text-xl">
          I also love <FunHighlight text="photography!" /> Here are a few of my photos (click to expand!):
          <div className="my-6 grid grid-rows-4 grid-cols-2 gap-6 place-items-center">
            <PopUp
              clickable={
                <img loading="lazy" className="rounded-2xl border-2 border-green-700 dark:border-green-300" src="/gallery/fuji-flower.jpg" alt="Flower with Mt. Fuji in the background" />
              }
              caption={
                <>Flower with Mt. Fuji in the background. Very satisfying shot all around. 2024/09/04</>
              }
            >
              <img loading="lazy" className="object-scale-down min-w-0 min-h-0 rounded-t-2xl" src="/gallery/fuji-flower.jpg" alt="Flower with Mt. Fuji in the background" />
            </PopUp>
            <PopUp
              clickable={
                <img loading="lazy" className="rounded-2xl border-2 border-green-500" src="/gallery/shanghai.jpg" alt="Shanghai cityline" />
              }
              caption={
                <>Shanghai cityline. I swam through a crowd to get this shot and I'm pretty happy with how clean it turned out! 2024/08/25</>
              }
            >
              <img loading="lazy" className="object-scale-down min-w-0 min-h-0 rounded-t-2xl" src="/gallery/shanghai.jpg" alt="Shanghai cityline" />
            </PopUp>
            <PopUp
              clickable={
                <img loading="lazy" className="rounded-2xl border-2 border-green-500" src="/gallery/sunset-house.jpg" alt="Sunset over a house" />
              }
              caption={
                <>
                  Sunset over a house. It took me a couple crops to arrive at this one. I love the way that the trees' figures contrast against the sky;
                  it's an aesthetic that I return to in many of my shots. 2025/05/02
                </>
              }
            >
              <img loading="lazy" className="object-scale-down min-w-0 min-h-0 rounded-t-2xl" src="/gallery/sunset-house.jpg" alt="Sunset over a house" />
            </PopUp>
            <PopUp
              clickable={
                <img loading="lazy" className="rounded-2xl border-2 border-green-700 dark:border-green-300" src="/gallery/golden-hour.jpg" alt="Golden hour in downtown Toronto" />
              }
              caption={
                <>Golden hour in downtown Toronto. The photo turned out much better than I thought. 2024/10/12</>
              }
            >
              <img loading="lazy" className="object-scale-down min-w-0 min-h-0 rounded-t-2xl" src="/gallery/golden-hour.jpg" alt="Golden hour in downtown Toronto" />
            </PopUp>
            <PopUp
              clickable={
                <img loading="lazy" className="rounded-2xl border-2 border-green-700 dark:border-green-300" src="/gallery/flame-dancer.jpg" alt="Performer dancing with fire" />
              }
              caption={
                <>Performer dancing with fire at Canada's Wonderland. Very, very happy with the timing of this shot. 2024/11/01</>
              }
            >
              <img loading="lazy" className="object-scale-down min-w-0 min-h-0 rounded-t-2xl" src="/gallery/flame-dancer.jpg" alt="Performer dancing with fire" />
            </PopUp>
            <PopUp
              clickable={
                <img loading="lazy" className="rounded-2xl border-2 border-green-500" src="/gallery/bike.jpg" alt="Bike on trail" />
              }
              caption={
                <>My bike on the Lower Don Trail. Taken during a bike ride with a friend. 2025/07/02</>
              }
            >
              <img loading="lazy" className="object-scale-down min-w-0 min-h-0 rounded-t-2xl" src="/gallery/bike.jpg" alt="Bike on trail" />
            </PopUp>
            <PopUp
              clickable={
                <img loading="lazy" className="rounded-2xl border-2 border-green-500" src="/gallery/eerie.jpg" alt="Dark night with approaching car in distance" />
              }
              caption={
                <>Dark night with a car approaching in the distance. This photo gives me an eerie feeling that I absolutely dig. 2024/05/12</>
              }
            >
              <img loading="lazy" className="object-scale-down min-w-0 min-h-0 rounded-t-2xl" src="/gallery/eerie.jpg" alt="Dark night with approaching car in distance" />
            </PopUp>
            <PopUp
              clickable={
                <img loading="lazy" className="rounded-2xl border-2 border-green-700 dark:border-green-300" src="/gallery/experimental.jpg" alt="Experimental photo with light streaks" />
              }
              caption={
                <>Experimental long-exposure photo. Shot near the base of the CN Tower. 2024/06/30</>
              }
            >
              <img loading="lazy" className="object-scale-down min-w-0 min-h-0 rounded-t-2xl" src="/gallery/experimental.jpg" alt="Experimental photo with light streaks" />
            </PopUp>            
          </div>
          You can find more of my photos on Instagram if you know me personally and follow me there :)
          <br />
          <span className="text-base">I also enjoy listening to PUP, King Gizzard and the Lizard Wizard, glass beach, and Yorushika.</span>
        </div>
      </div>
    </PopUp>
  );
}

export function ProjectDetails() {
  return (
    <PopUp
      clickable={<button className="relative -top-2 -mb-2 py-2 px-4 text-lg rounded-full border-2 border-gray-400 dark:border-gray-600 bg-white dark:bg-black">see more</button>}
      color={"red"}
    >
      <div className="p-8 overflow-y-scroll overscroll-contain place-self-center flex flex-col gap-6">
        <p className="text-4xl text-red-800 dark:text-red-200">Projects</p>
        <InnerCard
          title={"Personal Website"}
          link={"https://github.com/f47zhu/personal-website"}
          tools={"Next.js, React, Tailwind CSS"}
          funFact={
            <>
              I am developing this site without vibe coding to fully familiarize myself with React/Tailwind CSS!
            </>
          }
        >
          The website you're viewing right now! Designed interactive components <b>using React state and interval logic,</b> creating randomized
          fun facts, pausable image carousels, and more. Created animations <b>using Tailwind CSS <FunHighlight text="animation" /> properties,</b> making
          the site lightweight, responsive, and aesthetic.
        </InnerCard>
        <InnerCard
          title={"Coode"}
          link={"https://github.com/f47zhu/conhacks"}
          tools={"Flask, MongoDB, Gemini"}
          funFact={
            <>
              This was my first solo hackathon build.
            </>
          }
        >
          A tongue-in-cheek web app that lets coders practice problems while flirting with other users, built for <i>ConHacks 2026.</i> <b>Created
          user login/chats</b> and compatibility matching using MongoDB and Gemini, allowing users to code together and view their compatibilities.
        </InnerCard>
        <InnerCard
          title={"Seasick"}
          link={"https://devpost.com/software/seasick"}
          tools={"Autodesk Inventor 2026, Canva"}
          funFact={
            <>
              This was my first time using CAD software.
            </>
          }
        >
          A board game designed for <i>MDL CAD Designathon 2026.</i> Designed board game parts with <b>Autodesk Inventor 2026</b> and ideated the game concept.
        </InnerCard>
      </div>
    </PopUp>
  );
}
