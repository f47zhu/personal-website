export function HomeButton() {
  return (
    <a href="/">
      <button className="fixed left-[50%] translate-x-[-50%] py-2 px-4 bottom-10 rounded-full border-2 border-gray-400 dark:border-gray-600 bg-white dark:bg-black text-black dark:text-white">
        Back to Home
      </button>
    </a>
  );
}