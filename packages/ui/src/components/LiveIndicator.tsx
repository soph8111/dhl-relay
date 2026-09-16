export function LiveIndicator() {
  return (
    <div className="flex items-center gap-2 justify-end mb-2">
      <span className="relative flex h-2.5 w-2.5">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red opacity-75"></span>
        <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-red"></span>
      </span>
      <span className="text-surface-content text-sm font-medium">Live</span>
    </div>
  );
}
