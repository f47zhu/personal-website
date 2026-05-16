const animations = [
  "animate-wave-length3s",
  "animate-wave-length3s-delay0.1s",
  "animate-wave-length3s-delay0.2s",
  "animate-wave-length3s-delay0.3s",
  "animate-wave-length3s-delay0.4s",
  "animate-wave-length3s-delay0.5s",
  "animate-wave-length3s-delay0.6s",
  "animate-wave-length3s-delay0.7s",
  "animate-wave-length3s-delay0.8s",
  "animate-wave-length3s-delay0.9s",
  "animate-wave-length3s-delay1.0s",
  "animate-wave-length3s-delay1.1s",
  "animate-wave-length3s-delay1.2s",
  "animate-wave-length3s-delay1.3s",
  "animate-wave-length3s-delay1.4s",
  "animate-wave-length3s-delay1.5s",
  "animate-wave-length3s-delay1.6s",
  "animate-wave-length3s-delay1.7s",
  "animate-wave-length3s-delay1.8s",
  "animate-wave-length3s-delay1.9s",
  "animate-wave-length3s-delay2.0s",
  "animate-wave-length3s-delay2.1s",
  "animate-wave-length3s-delay2.2s",
  "animate-wave-length3s-delay2.3s",
  "animate-wave-length3s-delay2.4s",
  "animate-wave-length3s-delay2.5s",
  "animate-wave-length3s-delay2.6s",
  "animate-wave-length3s-delay2.7s",
  "animate-wave-length3s-delay2.8s",
  "animate-wave-length3s-delay2.9s"
];

export function WaveEffect({ text }: { text: string }) {
  const words = text.split(" ");
  let idx2 = 0;
  return words.map((word, idx1) =>
    <span key={idx1}>
      {(idx1 !== 0 && ++idx2) && <div className="inline-flex flex-wrap">&nbsp;</div>}
      <div className="inline-flex flex-wrap">
        {word.split("").map(c =>
          <div key={idx2} className={`inline-block whitespace-pre-wrap ${animations[idx2++ % animations.length]}`}>{c}</div>
        )}
      </div>
    </span>
  );
}

export function FunHighlight({ text }: { text: string }) {
  return (
    <b><span className="text-red-800 dark:text-red-200"><WaveEffect text={text} /></span></b>
  );
}