export function WaveEffect({ text }: { text: string }) {
  const animations: string[] = [
    "animate-wave",
    "animate-wave-delay0.1s",
    "animate-wave-delay0.2s",
    "animate-wave-delay0.3s",
    "animate-wave-delay0.4s",
    "animate-wave-delay0.5s",
    "animate-wave-delay0.6s",
    "animate-wave-delay0.7s",
    "animate-wave-delay0.8s",
    "animate-wave-delay0.9s",
    "animate-wave-delay1.0s",
    "animate-wave-delay1.1s",
    "animate-wave-delay1.2s",
    "animate-wave-delay1.3s",
    "animate-wave-delay1.4s",
    "animate-wave-delay1.5s",
    "animate-wave-delay1.6s",
    "animate-wave-delay1.7s",
    "animate-wave-delay1.8s",
    "animate-wave-delay1.9s",
    "animate-wave-delay2.0s",
    "animate-wave-delay2.1s",
    "animate-wave-delay2.2s",
    "animate-wave-delay2.3s",
    "animate-wave-delay2.4s",
    "animate-wave-delay2.5s",
    "animate-wave-delay2.6s",
    "animate-wave-delay2.7s",
    "animate-wave-delay2.8s",
    "animate-wave-delay2.9s"
  ];

  const words = text.split(" ");
  let idx2 = 0;
  return words.map((word, idx1) => 
    <div
      key={idx1}
      className="inline-flex flex-wrap"
    >
      {word.split("").map(c =>
        <div
          key={idx2}
          className={`inline-block whitespace-pre-wrap ${animations[idx2++ % animations.length]}`}
        >
          {c}
        </div>
      )}
      {((idx1 !== words.length - 1) && (++idx2)) &&
        <>&nbsp;</>
      }
    </div>
  );
}

export function FunHighlight({ text }: { text: string }) {
  return (
    <b><span className="text-red-800 dark:text-red-200">
      <WaveEffect text={text} />
    </span></b>
  );
}
