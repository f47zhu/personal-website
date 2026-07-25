"use client"

import { FunHighlight } from "@/app/effects/waveEffect";

import { useState, useEffect } from "react";

export default function Home() {
  const [farter, setFarter] = useState<boolean>(false);

  useEffect(() => {
    const fartInterval = setInterval(() => {
      setFarter(!farter);
    }, 2500);

    return () => clearInterval(fartInterval);
  }, [farter]);

  return (
    <>
      <a className="text-black dark:text-white" href="/blog">
        <button className="absolute top-4 left-4 py-2 px-4 rounded-2xl border-2 border-gray-400 dark:border-gray-600 bg-white dark:bg-black">
          Back to blog
        </button>
      </a>
      <div className="absolute top-4 right-4 flex flex-row gap-4">
        <a href="/">
          <button className="py-2 px-4 rounded-2xl border-2 border-gray-400 dark:border-gray-600 bg-white dark:bg-black text-black dark:text-white">
            Home
          </button>
        </a>
        <a href="/games">
          <button className="py-2 px-4 rounded-2xl border-2 border-gray-400 dark:border-gray-600 bg-white dark:bg-black">
            <FunHighlight text="Games" />
          </button>
        </a>
      </div>
      <div className="animate-fade-in-length0.25s my-20 mx-[15%] max-w-250 flex flex-col gap-5">
        <div className="flex flex-col gap-5">
          <h1 className="font-serif text-5xl">
            On getting into UW Software Engineering
          </h1>
          <h3 className="font-serif text-gray-700 dark:text-gray-300 text-3xl">
            My personal advice for UW SE applicants
          </h3>
          <p className="-mt-2.5 mb-2.5 font-serif text-gray-600 dark:text-gray-400 text-2xl">
            June 10, 2026
          </p>
        </div>
        <hr />
        <div className="flex flex-col gap-2.5 text-lg">
          <div className="flex flex-col gap-2.5 my-2.5 font-serif text-2xl place-self-center">
            <p className="text-gray-800 dark:text-gray-200 italic">
              "You're either a smart fella, or a fart smella"
            </p>
            <p className="text-gray-700 dark:text-gray-300 text-end">
              - Unknown
            </p>
          </div>
          <p>
            I applied to Software Engineering as a Hail Mary. I genuinely did not think I was going to get accepted,
            but here I am, faking it until I make it. A fart smella among smart fellas, so to speak.
          </p>
          <p>
            <i>How did I even get in?</i> For the most part, I still don't know. However, I've figured the least I can do
            is to compile what I <i>do</i> know here, in case it helps future applicants. Enjoy my SUBJECTIVE observations
            as an SE '30 below, and hopefully I don't accidentally sabotage your application.
          </p>
          <h2 className="my-2.5 font-serif text-4xl text-gray-900 dark:text-gray-100">
            Things my classmates have in common
          </h2>
          <p>
            <b>At least a 97% <a
              href="https://uwaterloo.ca/future-students/start-here/understanding-admission-requirements#admission-average"
              target="_blank"
            >engineering top 6 average.</a></b> There are a number of people with Governor General's Bronze Medals.
          </p>
          <p>
            <b>Ambitious extracurriculars.</b> Everyone I know exhibited tons of leadership in high school, whether it was
            being in their student council, being a valedictorian, or being a president/executive of multiple club(s).
            Many also did leadership beyond their high schools; I know a number of people who have already worked tech
            internships/performed undergraduate research as high school students (which is frankly crazy to me).
            From what I know, every university's engineering faculty loves leadership, so this goes beyond UW SE.
          </p>
          <h2 className="my-2.5 font-serif text-4xl text-gray-900 dark:text-gray-100">
            Advice from personal experience
          </h2>
          <p>
            <b>If you are applying to U of T, rank every U of T program at the top on OUAC.</b> Waterloo does NOT care
            where you rank them on OUAC, but for some reason, <a
              href="https://www.reddit.com/r/OntarioGrade12s/comments/1o033z5/does_it_matter_how_i_rank_my_choices_on_ouac/"
              target="_blank"
            >U of T does.</a> This isn't technically UW SE admissions advice, but it's worth mentioning just in case
            anyone doesn't know.
          </p>
          <p>
            <b>Revise your AIF.</b> It's the most important English assignment you'll ever have to write (probably).
            I personally had 9 people proofread mine, including people who got into UW Engineering.
          </p>
          <p>
            <b>Be genuine and passionate in your AIF responses.</b> In my opinion, it's the best way to stand out
            without seeming performative (and it's definitely what the admissions officers prefer reading).
          </p>
          <p>
            <b>Practice the video interview.</b> Video calling my friends to practice the video interview helped me a ton,
            along with recording takes of myself (even if they were cringe to watch). Memorizing key points instead of a
            script also helped me sound natural and passionate.
          </p>
          <h2 className="my-2.5 font-serif text-4xl text-gray-900 dark:text-gray-100">
            Closing thoughts
          </h2>
          <p>
            <b><u>JUST APPLY!</u></b> If this article scared you, that wasn't the intention. I'm pretty sure half the people
            in my cohort have impostor syndrome from what I've seen, and I'm definitely not the only one who didn't think
            I'd get into SE. Please do not reject yourself; I know of multiple people who probably would've gotten in had
            they not scared themselves out of applying. Throw the Hail Mary like I did.
          </p>
          <p>
            And with that, I wish you the best of luck with your application. See you on campus, {farter ? "fart smella!" : "smart fella!"}
          </p>
        </div>
      </div>
    </>
  );
}
