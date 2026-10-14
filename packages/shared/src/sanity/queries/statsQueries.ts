// Count all runners for a given year
export const getTotalRunnersCountQuery = /* groq */ `
  count(*[_type == "team" && year == $year].runners[])
`;

// Get all finished results for a given year
export const getFinishedResultsQuery = /* groq */ `
  *[_type == "result" && team->year == $year && defined(result)]{
    "resultSeconds": result,
    "cutoffSeconds": cutoff,
    "runnerId": runner._ref,
    runner->{
      _id,
      age,
      gender
    }
  }
`;
