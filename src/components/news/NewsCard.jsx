export default function NewsCard({ article }) {
  const {
    title,
    source,
    publishedAt,
    urlToImage,
    description,
    url,
  } = article;

  const formattedDate = publishedAt
    ? new Date(publishedAt).toLocaleDateString('en-US', {
        month: '2-digit',
        day: '2-digit',
        year: 'numeric',
      }) +
      ', ' +
      new Date(publishedAt).toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      })
    : '';

  return (
    <article className="glass-card p-3 flex gap-3 items-start group hover:shadow-md transition-all duration-200">
      {/* Thumbnail */}
      {urlToImage && (
        <div className="flex-shrink-0 w-14 h-14 sm:w-16 sm:h-16 rounded-lg overflow-hidden bg-slate-100 dark:bg-neutral-800">
          <img
            src={urlToImage}
            alt=""
            className="w-full h-full object-cover"
            loading="lazy"
            onError={(e) => { e.target.style.display = 'none'; }}
          />
        </div>
      )}

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-0.5">
              {source?.name && (
                <span className="text-[11px] font-bold uppercase tracking-wider text-amber-700 dark:text-cyan-400">
                  {source.name}
                </span>
              )}
              {formattedDate && (
                <span className="text-[11px] text-slate-400 dark:text-neutral-500">
                  {formattedDate}
                </span>
              )}
            </div>
            <h3 className="text-sm font-semibold text-slate-800 dark:text-neutral-200 line-clamp-2 leading-snug">
              {title}
            </h3>
            {description && (
              <p className="text-xs text-slate-500 dark:text-neutral-400 line-clamp-2 mt-1 leading-relaxed">
                {description}
              </p>
            )}
          </div>
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center bg-red-50 dark:bg-red-500/10 text-red-500 hover:bg-red-100 dark:hover:bg-red-500/20 transition-colors text-xs"
            title="Read article"
          >
            ↗
          </a>
        </div>
      </div>
    </article>
  );
}
