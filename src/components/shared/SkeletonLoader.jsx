export default function SkeletonLoader({ className = '', count = 1 }) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className={`animate-pulse rounded-xl bg-neutral-700/30 ${className}`}
        />
      ))}
    </>
  );
}
