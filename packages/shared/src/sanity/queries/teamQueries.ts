export const getTeamStandingsQuery = /* groq */ `
  *[_type == "team"]{
    _id,
    teamName,
    "runners": runners[]->{
      _id,
      "resultSeconds": *[_type == "result" && references(^._id) && year == $year][0].result
    }
  }
`;
