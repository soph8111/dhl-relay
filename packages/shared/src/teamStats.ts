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
  runners: Array<{ _id: string; resultSeconds: number | null }>;
}

export function buildTeamStandings(teams: TeamResult[]): TeamStanding[] {
  const withStats = teams
    .map((team) => {
      const finished = team.runners.filter((r) => r.resultSeconds != null);
      const totalSeconds = finished.reduce(
        (sum, r) => sum + (r.resultSeconds as number),
        0,
      );

      return {
        teamId: team._id,
        teamName: team.teamName,
        totalSeconds,
        finishedCount: finished.length,
        totalRunners: team.runners.length,
        isComplete: finished.length === team.runners.length,
      };
    })
    .filter((team) => team.finishedCount > 0);

  const complete = withStats
    .filter((t) => t.isComplete)
    .sort((a, b) => a.totalSeconds - b.totalSeconds);
  const incomplete = withStats
    .filter((t) => !t.isComplete)
    .sort((a, b) => b.finishedCount - a.finishedCount);

  // Complete teams always rank above incomplete ones - comparing a partial
  // sum to a full team's sum would be misleading, regardless of the numbers.
  return [...complete, ...incomplete];
}
