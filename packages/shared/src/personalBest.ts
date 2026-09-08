// Reduces a list of results to only each runner's single best (lowest) resultSeconds entry - used for leaderboard and event-wide stats, but NOT for team standings, where every individual run should still count.
export function keepBestPerRunner<T>(
  items: T[],
  getRunnerId: (item: T) => string,
  getSeconds: (item: T) => number,
): T[] {
  const bestByRunner = new Map<string, T>();

  for (const item of items) {
    const runnerId = getRunnerId(item);
    const existing = bestByRunner.get(runnerId);

    if (!existing || getSeconds(item) < getSeconds(existing)) {
      bestByRunner.set(runnerId, item);
    }
  }

  return Array.from(bestByRunner.values());
}
