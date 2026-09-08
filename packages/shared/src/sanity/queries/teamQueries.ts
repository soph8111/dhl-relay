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
