import NewsCard from './NewsCard';
import SkeletonCard from './SkeletonCard';

export default function NewsSection({
  categories,
  activeCategory,
  setActiveCategory,
  articles,
  searchQuery,
  setSearchQuery,
  sortBy,
  setSortBy,
  loading,
  errors,
  refreshCategory,
}) {
  const error = errors[activeCategory];

  return (
    <div className="space-y-4">
      {/* Header row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <h2 className="text-lg font-bold text-slate-800 dark:text-white">
          Breaking News
        </h2>
        <div className="flex items-center gap-2">
          <button
            onClick={() => refreshCategory(activeCategory)}
            className="px-4 py-1.5 rounded-lg border border-slate-300 dark:border-neutral-600 text-sm font-medium text-slate-600 dark:text-neutral-300 hover:bg-slate-50 dark:hover:bg-neutral-800 transition-colors"
            id="news-refresh-btn"
          >
            Refresh
          </button>
        </div>
      </div>

      {/* Search + Sort */}
      <div className="flex flex-col sm:flex-row gap-2">
        <input
          type="text"
          placeholder="Search title, source, author..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-1 px-4 py-2 rounded-lg bg-white dark:bg-white/5 border border-slate-200 dark:border-white/5 text-sm text-slate-800 dark:text-neutral-200 placeholder-slate-400 dark:placeholder-neutral-500 focus:outline-none focus:border-amber-500/50 dark:focus:border-cyan-500/30 transition-colors"
          id="news-search"
        />
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="px-3 py-2 rounded-lg bg-white dark:bg-white/5 border border-slate-200 dark:border-white/5 text-sm text-slate-600 dark:text-neutral-300 focus:outline-none focus:border-amber-500/50 dark:focus:border-cyan-500/30 appearance-none cursor-pointer min-w-[140px]"
          id="news-sort"
        >
          <option value="date">Sort by Date</option>
          <option value="source">Sort by Source</option>
        </select>
      </div>

      {/* Category tabs */}
      <div className="flex flex-wrap gap-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-medium capitalize transition-all duration-200 ${
              activeCategory === cat
                ? 'bg-amber-700 dark:bg-cyan-500/20 text-white dark:text-cyan-400 shadow-sm'
                : 'bg-white dark:bg-white/5 text-slate-500 dark:text-neutral-400 border border-slate-200 dark:border-white/5 hover:bg-slate-50 dark:hover:bg-white/10 hover:text-slate-700 dark:hover:text-neutral-300'
            }`}
            id={`news-tab-${cat}`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Error state */}
      {error && (
        <div className="glass-card p-6 text-center">
          <p className="text-red-500 text-sm mb-3">⚠️ {error}</p>
          <button
            onClick={() => refreshCategory(activeCategory)}
            className="px-4 py-2 rounded-lg bg-red-50 dark:bg-red-500/20 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-500/30 transition-colors text-sm font-medium"
          >
            Retry
          </button>
        </div>
      )}

      {/* Article list */}
      {!error && (
        <div className="space-y-2">
          {loading
            ? Array.from({ length: 5 }).map((_, i) => <SkeletonCard key={i} />)
            : articles.length > 0
              ? articles.map((article, i) => (
                  <NewsCard key={`${article.title}-${i}`} article={article} />
                ))
              : (
                  <div className="text-center py-8 text-slate-400 dark:text-neutral-500 text-sm">
                    No articles found.
                  </div>
                )}
        </div>
      )}
    </div>
  );
}
