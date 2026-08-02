export function CustomHr({ className = "" }: { className?: string }) {
  return <div className={`${className} max-w-350 h-0.5 shrink-0 bg-linear-to-r from-[#00000000] via-gray-600 dark:via-gray-400 to-[#00000000]`} />;
}
