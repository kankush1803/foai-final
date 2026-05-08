export default function Header({ dark, toggleTheme }) {
  return (
    <header className="px-4 sm:px-6 lg:px-8 py-5 border-b border-black/5 dark:border-white/5 bg-white/60 dark:bg-neutral-900/60 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-amber-700 dark:text-cyan-400 mb-1">
            Mission Control Dashboard
          </p>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-800 dark:text-white">
            Real-Time ISS and News Intelligence
          </h1>
        </div>
        <button
          onClick={toggleTheme}
          className="px-4 py-2 rounded-full border border-slate-300 dark:border-neutral-600 text-sm font-medium text-slate-700 dark:text-neutral-300 hover:bg-slate-100 dark:hover:bg-neutral-800 transition-colors"
          id="theme-toggle"
        >
          {dark ? '☀️ Switch to Light' : '🌙 Switch to Dark'}
        </button>
      </div>
    </header>
  );
}
