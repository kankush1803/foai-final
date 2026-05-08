import { useState } from 'react';

export default function AstronautList({ astronauts, count }) {
  const [expanded, setExpanded] = useState(false);

  // Group by craft
  const byCraft = astronauts.reduce((acc, a) => {
    acc[a.craft] = acc[a.craft] || [];
    acc[a.craft].push(a.name);
    return acc;
  }, {});

  return (
    <div className="glass-card p-5">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between"
        id="astronaut-toggle"
      >
        <h2 className="text-base font-bold text-slate-800 dark:text-white flex items-center gap-2">
          👨‍🚀 Astronauts in Space
          <span className="px-2 py-0.5 rounded-full bg-purple-100 dark:bg-purple-500/20 text-purple-700 dark:text-purple-400 text-xs font-bold">
            {count}
          </span>
        </h2>
        <span
          className={`text-slate-400 dark:text-neutral-400 transition-transform duration-200 ${expanded ? 'rotate-180' : ''}`}
        >
          ▾
        </span>
      </button>

      {expanded && (
        <div className="mt-4 space-y-3 animate-fade-in">
          {Object.entries(byCraft).map(([craft, names]) => (
            <div key={craft}>
              <div className="text-xs text-amber-700 dark:text-cyan-400 font-semibold mb-1.5 flex items-center gap-1.5">
                🚀 {craft}
              </div>
              <div className="flex flex-wrap gap-1.5">
                {names.map((name) => (
                  <span
                    key={name}
                    className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/5 text-xs text-slate-700 dark:text-neutral-300"
                  >
                    {name}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
