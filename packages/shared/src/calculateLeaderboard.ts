import type { Runner, Gender } from './types';

export interface LeaderboardEntry {
  runner: Runner;
  resultSeconds: number;
  targetSeconds: number;
  comparedResultSeconds: number;
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
  // Age difference in seconds (9 sec/year), positive if runner is older
  const diff = (ageCorrected(runnerAge) - ageCorrected(referenceAge)) * 9;

  const runnerFactor = genderFactor(runnerGender);
  const referenceFactor = genderFactor(referenceGender);

  // If either runner or reference is not male/female skip gender entirely - only compare time and age
  if (runnerFactor === null || referenceFactor === null) {
    return referenceActualSeconds + diff;
  }

  // Look at the reference's own gender: divide by 1 if male and by 1.165 if female, to get a neutral baseline time
  const normalizedReferenceSeconds = referenceActualSeconds / referenceFactor;

  // Add the age difference, then look at the runner's own gender: multiply by 1 if male and by 1.165 if female
  return (normalizedReferenceSeconds + diff) * runnerFactor;
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
  age: number;
  gender: Gender;
  resultSeconds: number;
}

export function buildLeaderboard(
  results: Array<{ runner: Runner; resultSeconds: number }>,
  reference: ReferenceRunnerInfo,
): LeaderboardEntry[] {
  return results
    .map(({ runner, resultSeconds }) => {
      const targetSeconds = calculateTargetSeconds(
        runner.age,
        runner.gender,
        reference.resultSeconds,
        reference.age,
        reference.gender,
      );

      return {
        runner,
        resultSeconds,
        targetSeconds,
        comparedResultSeconds: comparedResultSeconds(
          resultSeconds,
          targetSeconds,
          reference.resultSeconds,
        ),
        beatsReference: beatsReference(resultSeconds, targetSeconds),
      };
    })
    .sort((a, b) => a.resultSeconds - b.resultSeconds);
}
