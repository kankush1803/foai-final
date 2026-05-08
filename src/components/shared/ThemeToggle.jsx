export default function ThemeToggle({ dark, toggle }) {
  return (
    <button
      onClick={toggle}
      className="relative w-14 h-7 rounded-full bg-neutral-700/50 dark:bg-neutral-600/50 border border-neutral-600/30 transition-all duration-300 hover:border-cyan-500/40 focus:outline-none focus:ring-2 focus:ring-cyan-500/30"
      aria-label="Toggle theme"
      id="theme-toggle"
    >
      <div
        className={`absolute top-0.5 w-6 h-6 rounded-full transition-all duration-300 flex items-center justify-center text-sm ${
          dark
            ? 'left-0.5 bg-indigo-500 shadow-lg shadow-indigo-500/30'
            : 'left-[calc(100%-1.625rem)] bg-amber-400 shadow-lg shadow-amber-400/30'
        }`}
      >
        {dark ? '🌙' : '☀️'}
      </div>
    </button>
  );
}
