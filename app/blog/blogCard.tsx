export function BlogCard({ title, link, desc, date }:
    { title: string, link: string, desc: React.ReactNode, date: string }) {
  return (
    <div className="flex flex-col gap-6 p-12 bg-gray-100 dark:bg-gray-900">
      <div className="font-serif text-lg text-gray-700 dark:text-gray-300">{date}</div>
      <a
        className="text-3xl font-serif text-black dark:text-white underline"
        href={link}
      >
        {title}
      </a>
      <div className="text-xl">{desc}</div>
    </div>
  )
}