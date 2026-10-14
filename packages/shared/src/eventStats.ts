import type { Gender, ReferenceRunner } from './types';
import { calculateTargetSeconds, beatsReference } from './calculateLeaderboard';

export interface EventStats {
  finishedCount: number;
  totalCount: number;
  beatsReferenceCount: number;
  beatsCutoffCount: number;
  closestMissSeconds: number | null;
  averagePaceSecondsPerKm: number | null;
  averageTimeSeconds: number | null;
}
interface FinishedResult {
  runnerId: string;
  resultSeconds: number;
  cutoffSeconds: number | null;
  runner: { age: number; gender: Gender };
}

const ROUTE_DISTANCE_KM = 5;

// Function that returns all the stats giving in the EventStats interface
export function calculateEventStats(
  results: FinishedResult[],
  totalCount: number,
  reference: ReferenceRunner,
): EventStats {
  // Group results by runnerId. Used for counting how many runners beat the reference and closest miss
  const resultsByRunner = new Map<string, FinishedResult[]>();
  for (const r of results) {
    const list = resultsByRunner.get(r.runnerId) ?? [];
    list.push(r);
    resultsByRunner.set(r.runnerId, list);
  }

  let beatsReferenceCount = 0;
  let beatsCutoffCount = 0;
  let closestMissSeconds: number | null = null;

  // Count how many runners beat the reference and find the closest miss
  for (const [runnerId, runnerResults] of resultsByRunner) {
    if (runnerId === reference.runnerId) continue;

    const { age, gender } = runnerResults[0]!.runner;

    // Calculate the target seconds for this runner based on their age and gender
    const targetSeconds = calculateTargetSeconds(
      age,
      gender,
      reference.resultSeconds,
      reference.age,
      reference.gender,
    );

    // Check if any of the runner's results beat the reference
    const wonDayOff = runnerResults.some((r) =>
      beatsReference(r.resultSeconds, targetSeconds),
    );

    // Update counts and closest miss
    if (wonDayOff) {
      beatsReferenceCount++;
    } else {
      // Find the best margin for this runner
      const bestMargin = Math.min(
        ...runnerResults.map((r) => r.resultSeconds - targetSeconds),
      );
      // Update closest miss if this is the best margin we've seen so far
      if (closestMissSeconds === null || bestMargin < closestMissSeconds) {
        closestMissSeconds = bestMargin;
      }
    }
  }

  // Count how many runners beat the cutoff
  for (const r of results) {
    if (r.cutoffSeconds != null && r.resultSeconds <= r.cutoffSeconds) {
      beatsCutoffCount++;
    }
  }

  const finishedCount = results.length;

  // Calculate average pace
  const averagePaceSecondsPerKm =
    finishedCount === 0
      ? null
      : results.reduce((sum, r) => sum + r.resultSeconds, 0) /
        (finishedCount * ROUTE_DISTANCE_KM);

  // Calculate average time
  const averageTimeSeconds =
    finishedCount === 0
      ? null
      : results.reduce((sum, r) => sum + r.resultSeconds, 0) / finishedCount;

  return {
    finishedCount,
    totalCount,
    beatsReferenceCount,
    beatsCutoffCount,
    closestMissSeconds,
    averagePaceSecondsPerKm,
    averageTimeSeconds,
  };
}
