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

  const resultsByRunner = new Map<string, FinishedResult[]>();
  for (const r of results) {
    const list = resultsByRunner.get(r.runnerId) ?? [];
    list.push(r);
    resultsByRunner.set(r.runnerId, list);
  }

  let beatsReferenceCount = 0;
  let beatsCutoffCount = 0;
  let closestMissSeconds: number | null = null;

  for (const [runnerId, runnerResults] of resultsByRunner) {
    for (const r of runnerResults) {
      if (r.cutoffSeconds != null && r.resultSeconds <= r.cutoffSeconds) {
        beatsCutoffCount++;
      }
    }

    if (runnerId === reference.runnerId) continue;

    const { age, gender } = runnerResults[0]!.runner;
    const targetSeconds = calculateTargetSeconds(
      age,
      gender,
      reference.resultSeconds,
      reference.age,
      reference.gender,
    );

    const wonDayOff = runnerResults.some((r) =>
      beatsReference(r.resultSeconds, targetSeconds),
    );

    if (wonDayOff) {
      beatsReferenceCount++;
    } else {
      const bestMargin = Math.min(
        ...runnerResults.map((r) => r.resultSeconds - targetSeconds),
      );
      if (closestMissSeconds === null || bestMargin < closestMissSeconds) {
        closestMissSeconds = bestMargin;
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
