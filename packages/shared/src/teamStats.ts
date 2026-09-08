export interface TeamStanding {
  teamId: string;
  teamName: string;
  totalSeconds: number;
  finishedCount: number;
  isComplete: boolean;
  totalRunners: number;
}

interface TeamResult {
  _id: string;
  teamName: string;
  runnerIds: string[];
}
interface RunnerResult {
  runnerId: string;
  teamId: string;
  resultSeconds: number;
}

interface TeamResult {
  _id: string;
  teamName: string;
  runnerIds: string[];
}

interface RunnerResult {
  runnerId: string;
  teamId: string;
  resultSeconds: number;
}

export function buildTeamStandings(
  teams: TeamResult[],
  results: RunnerResult[],
): TeamStanding[] {
  const withStats = teams
    .map((team) => {
      // Only match results that belong to THIS specific team, not just any
      // result the runner happens to have (relevant now that one runner
      // can have a separate result per team they're on).
      const teamResults = results.filter(
        (r) => r.teamId === team._id && team.runnerIds.includes(r.runnerId),
      );

      const totalSeconds = teamResults.reduce(
        (sum, r) => sum + r.resultSeconds,
        0,
      );

      return {
        teamId: team._id,
        teamName: team.teamName,
        totalSeconds,
        finishedCount: teamResults.length,
        totalRunners: team.runnerIds.length,
        isComplete: teamResults.length === team.runnerIds.length,
      };
    })
    .filter((team) => team.finishedCount > 0);

  const complete = withStats
    .filter((t) => t.isComplete)
    .sort((a, b) => a.totalSeconds - b.totalSeconds);
  const incomplete = withStats
    .filter((t) => !t.isComplete)
    .sort((a, b) => b.finishedCount - a.finishedCount);

  return [...complete, ...incomplete];
}
