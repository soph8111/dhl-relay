import { keepBestPerRunner } from './personalBest';
import type { Runner, Gender, ReferenceRunner } from './types';

// LeaderboardEntry represents a single entry in the leaderboard, containing information about the runner, their result, and how they compare to the reference runner
export interface LeaderboardEntry {
  runner: Runner; // The runner's information
  isReference: boolean; // Whether this runner is the reference runner
  resultSeconds: number; // The runner's actual result in seconds
  targetSeconds: number; // The maximal time a runner can use
  comparedResultSeconds: number; // The runner's result calculated to make it directly comparable to the reference's result
  marginSeconds: number; // The difference between the runner's result and the target time (positive if the runner is slower than the target, negative if faster)
  beatsReference: boolean; // Whether the runner beats the reference
}

// Runners under 27 are treated as 27 (assumed peak running age)
export function ageCorrected(age: number): number {
  return Math.max(age, 27);
}

// The gender factor is used to adjust the target time based on the runner's gender
function genderFactor(gender: Gender): number | null {
  if (gender === 'female') return 1.165;
  if (gender === 'male') return 1;
  return null;
}

// Calculate the target time in seconds for a runner based on their age and gender (maximal time a runner can use)
export function calculateTargetSeconds(
  runnerAge: number,
  runnerGender: Gender,
  referenceResultSeconds: number,
  referenceAge: number,
  referenceGender: Gender,
): number {
  const diff = (ageCorrected(runnerAge) - ageCorrected(referenceAge)) * 9;

  const runnerFactor = genderFactor(runnerGender);
  const referenceFactor = genderFactor(referenceGender);

  if (runnerFactor === null || referenceFactor === null) {
    return Math.round(referenceResultSeconds + diff);
  }

  const normalizedReferenceSeconds = referenceResultSeconds / referenceFactor;

  return Math.round((normalizedReferenceSeconds + diff) * runnerFactor);
}

// Check if the runner beats the reference
export function beatsReference(
  resultSeconds: number,
  targetSeconds: number,
): boolean {
  return resultSeconds <= targetSeconds;
}

export function calculateRunnerResult(
  runner: Pick<Runner, 'age' | 'gender'>,
  resultSeconds: number,
  reference: Pick<ReferenceRunner, 'age' | 'gender' | 'resultSeconds'>,
) {
  const targetSeconds = calculateTargetSeconds(
    runner.age,
    runner.gender,
    reference.resultSeconds,
    reference.age,
    reference.gender,
  );

  const marginSeconds = resultSeconds - targetSeconds;

  return {
    targetSeconds,
    marginSeconds,
    comparedResultSeconds: reference.resultSeconds + marginSeconds,
    beatsReference: beatsReference(resultSeconds, targetSeconds),
  };
}

export function buildLeaderboard(
  results: Array<{
    runner: Runner;
    resultSeconds: number;
  }>,
  reference: ReferenceRunner,
): LeaderboardEntry[] {
  const bestResults = keepBestPerRunner(
    results,
    (r) => r.runner._id,
    (r) => r.resultSeconds,
  );

  return bestResults
    .map(({ runner, resultSeconds }) => {
      const calculated = calculateRunnerResult(
        runner,
        resultSeconds,
        reference,
      );

      return {
        runner,
        resultSeconds,
        isReference: runner._id === reference.runnerId,
        ...calculated,
      };
    })
    .sort((a, b) => a.resultSeconds - b.resultSeconds);
}
