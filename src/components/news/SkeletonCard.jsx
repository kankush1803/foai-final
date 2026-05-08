export default function SkeletonCard() {
  return (
    <div className="glass-card p-3 flex gap-3 items-center animate-pulse">
      <div className="w-14 h-14 rounded-lg bg-slate-200 dark:bg-neutral-700/30 flex-shrink-0" />
      <div className="flex-1 space-y-2">
        <div className="h-3 bg-slate-200 dark:bg-neutral-700/30 rounded w-24" />
        <div className="h-4 bg-slate-200 dark:bg-neutral-700/30 rounded w-full" />
        <div className="h-3 bg-slate-200 dark:bg-neutral-700/30 rounded w-3/4" />
      </div>
    </div>
  );
}
