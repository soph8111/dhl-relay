import type { Gender } from './types';
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

interface ReferenceInfo {
  runnerId: string;
  age: number;
  gender: Gender;
  resultSeconds: number;
}

const ROUTE_DISTANCE_KM = 5;

export function calculateEventStats(
  results: FinishedResult[],
  totalCount: number,
  reference: ReferenceInfo,
): EventStats {
  const finishedCount = results.length;

  let beatsReferenceCount = 0;
  let beatsCutoffCount = 0;
  let closestMissSeconds: number | null = null;

  for (const { runnerId, resultSeconds, cutoffSeconds, runner } of results) {
    if (cutoffSeconds != null && resultSeconds <= cutoffSeconds) {
      beatsCutoffCount++;
    }

    // The reference runner can't meaningfully "beat" themselves - skip the
    // rest of this iteration for their own row.
    if (runnerId === reference.runnerId) continue;

    const targetSeconds = calculateTargetSeconds(
      runner.age,
      runner.gender,
      reference.resultSeconds,
      reference.age,
      reference.gender,
    );

    if (beatsReference(resultSeconds, targetSeconds)) {
      beatsReferenceCount++;
    } else {
      const margin = resultSeconds - targetSeconds;
      if (closestMissSeconds === null || margin < closestMissSeconds) {
        closestMissSeconds = margin;
      }
    }
  }

  const averagePaceSecondsPerKm =
    finishedCount === 0
      ? null
      : results.reduce((sum, r) => sum + r.resultSeconds, 0) /
        (finishedCount * ROUTE_DISTANCE_KM);

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
