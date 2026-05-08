import SkeletonLoader from '../shared/SkeletonLoader';

export default function ISSStats({ currentPos, speed, location, positions, loading, error, onRefresh, autoRefresh }) {
  if (error) {
    return (
      <div className="glass-card p-5 text-center">
        <p className="text-red-500 text-sm mb-3">{error}</p>
        <button
          onClick={onRefresh}
          className="px-4 py-2 rounded-lg bg-red-50 dark:bg-red-500/20 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-500/30 transition-colors text-sm font-medium"
        >
          Retry
        </button>
      </div>
    );
  }

  if (loading && !currentPos) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="glass-card p-4">
            <SkeletonLoader className="h-3 w-20 mb-2" />
            <SkeletonLoader className="h-5 w-28" />
          </div>
        ))}
      </div>
    );
  }

  const stats = [
    {
      label: 'Latitude / Longitude',
      value: currentPos
        ? `${currentPos.latitude.toFixed(3)}, ${currentPos.longitude.toFixed(3)}`
        : '—',
    },
    {
      label: 'Speed',
      value: `${speed.toFixed(2)} km/h`,
    },
    {
      label: 'Nearest Place',
      value: location || 'Unknown',
    },
    {
      label: 'Tracked Positions',
      value: `${positions.length}`,
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {stats.map((s) => (
        <div
          key={s.label}
          className="glass-card p-4"
        >
          <div className="text-[11px] text-slate-500 dark:text-neutral-400 font-medium mb-1">
            {s.label}
          </div>
          <div className="text-sm sm:text-base font-bold text-slate-800 dark:text-white truncate">
            {s.value}
          </div>
        </div>
      ))}
    </div>
  );
}
