import { RUNNER_FRAGMENT } from '../fragments/runnerFragment';

// Get all teams for a given year
export const getTeamsForYearQuery = /* groq */ `
  *[_type == "team" && year == $year]{
    _id,
    teamName
  }
`;

// Get all runners for a given team
export const getTeamRunnersQuery = /* groq */ `
  *[_type == "team" && _id == $teamId][0]{
    "runners": runners[]->{
      ${RUNNER_FRAGMENT},
      "resultCount": count(*[
        _type == "result" &&
        runner._ref == ^._id &&
        team._ref == $teamId &&
        defined(result)
      ])
    }
  }.runners
`;

// Get the team and results for a given year
export const getTeamStandingsQuery = /* groq */ `
  {
    "teams": *[_type == "team" && year == $year]{
      _id,
      teamName,
      "runnerIds": runners[]._ref
    },
    "results": *[_type == "result" && team->year == $year && defined(result)]{
      "runnerId": runner._ref,
      "teamId": team._ref,
      "resultSeconds": result
    }
  }
`;
