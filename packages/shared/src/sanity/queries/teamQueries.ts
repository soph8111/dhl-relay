// Teams a given runner is a member of, for the current year - used in runner-app's team dropdown when starting a run
export const getTeamsForYearQuery = /* groq */ `
  *[_type == "team" && year == $year]{
    _id,
    teamName
  }
`;

// Members of a specific team, for the "choose runner" dropdown that appears once a team is selected.
export const getTeamRunnersQuery = /* groq */ `
  *[_type == "team" && _id == $teamId][0].runners[]->{
    _id,
    firstName,
    lastName,
    alias
  }
`;

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
