// Skeleton version of the USP item
const UspSkeleton = () => (
  <div
    className="flex flex-col items-center text-center animate-pulse"
    aria-label="Loading USP"
  >
    <div className="w-20 h-20 bg-elevated dark:bg-accent-primary rounded-full mb-6" />
    <div className="h-4 w-32 bg-elevated dark:bg-accent-primary rounded-full mb-2" />
    <div className="h-2 w-24 bg-elevated dark:bg-accent-primary rounded-full" />
  </div>
);

export default function UspSection({ ui }) {
  const uspData = ui?.usp || [];

  return (
    <section
      className="py-20 border-b border-light  bg-surface dark:bg-[#080808] overflow-hidden"
      aria-label="Key selling points"
    >
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-12">
        {uspData.length === 0 ? (
          <>
            <UspSkeleton />
            <UspSkeleton />
            <UspSkeleton />
          </>
        ) : (
          uspData.map((item, i) => (
            <article
              key={i}
              className="flex flex-col items-center text-center group"
              aria-label={item.title}
            >
              <div className="w-20 h-20 bg-surface-alt dark:bg-[#111] rounded-full flex items-center justify-center mb-6 shadow-inner group-hover:bg-elevated dark:group-hover:bg-elevated transition-colors duration-500">
                <span
                  className="text-3xl grayscale group-hover:grayscale-0 group-hover:scale-110 transition-transform duration-500"
                  role="img"
                  aria-label={item.title}
                >
                  {item.icon}
                </span>
              </div>
              <h2 className="text-sm font-black uppercase tracking-widest text-primary  mb-2 bg-gradient-to-r from-zinc-900 to-zinc-500 dark:from-white dark:to-zinc-500 bg-clip-text text-transparent">
                {item.title}
              </h2>
              <p className="text-[10px] font-bold text-muted uppercase tracking-tighter">
                {item.desc}
              </p>
            </article>
          ))
        )}
      </div>
    </section>
  );
}
