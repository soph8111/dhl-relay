import { keepBestPerRunner } from './personalBest';
import type { Runner, Gender } from './types';

export interface LeaderboardEntry {
  runner: Runner;
  isReference: boolean;
  resultSeconds: number;
  targetSeconds: number;
  comparedResultSeconds: number;
  marginSeconds: number;
  beatsReference: boolean;
}

// Runners under 27 are treated as 27 (assumed peak running age)
export function ageCorrected(age: number): number {
  return Math.max(age, 27);
}

function genderFactor(gender: Gender): number | null {
  if (gender === 'female') return 1.165;
  if (gender === 'male') return 1;
  return null;
}

// Core formula: how fast a runner needs to finish to "beat" the reference, given both their ages and genders
// Age difference adds/subtracts 9 seconds per year
// Gender scales the result by 1.165 (male/female only)
// The reference's own time is normalized to a male-equivalent baseline first, so the formula works regardless of the reference's gender

// Calculate the target time in seconds for a runner based on their age and gender
export function calculateTargetSeconds(
  runnerAge: number,
  runnerGender: Gender,
  referenceActualSeconds: number,
  referenceAge: number,
  referenceGender: Gender,
): number {
  const diff = (ageCorrected(runnerAge) - ageCorrected(referenceAge)) * 9;

  const runnerFactor = genderFactor(runnerGender);
  const referenceFactor = genderFactor(referenceGender);

  if (runnerFactor === null || referenceFactor === null) {
    return Math.round(referenceActualSeconds + diff);
  }

  const normalizedReferenceSeconds = referenceActualSeconds / referenceFactor;

  return Math.round((normalizedReferenceSeconds + diff) * runnerFactor);
}

//
export function comparedResultSeconds(
  actualSeconds: number,
  targetSeconds: number,
  referenceActualSeconds: number,
): number {
  return referenceActualSeconds + (actualSeconds - targetSeconds);
}

// Check if the runner beats the reference
export function beatsReference(
  actualSeconds: number,
  targetSeconds: number,
): boolean {
  return actualSeconds <= targetSeconds;
}

interface ReferenceRunnerInfo {
  _id: string;
  age: number;
  gender: Gender;
  resultSeconds: number;
}

export function calculateRunnerResult(
  runner: Pick<Runner, 'age' | 'gender'>,
  resultSeconds: number,
  reference: Pick<ReferenceRunnerInfo, 'age' | 'gender' | 'resultSeconds'>,
) {
  const targetSeconds = calculateTargetSeconds(
    runner.age,
    runner.gender,
    reference.resultSeconds,
    reference.age,
    reference.gender,
  );

  return {
    targetSeconds,
    comparedResultSeconds: comparedResultSeconds(
      resultSeconds,
      targetSeconds,
      reference.resultSeconds,
    ),
    marginSeconds: resultSeconds - targetSeconds,
    beatsReference: beatsReference(resultSeconds, targetSeconds),
  };
}

export function buildLeaderboard(
  results: Array<{
    runner: Runner;
    resultSeconds: number;
    isReference: boolean;
  }>,
  reference: ReferenceRunnerInfo,
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
        isReference: runner._id === reference._id,
        ...calculated,
      };
    })
    .sort((a, b) => a.resultSeconds - b.resultSeconds);
}
