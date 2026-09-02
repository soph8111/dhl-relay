export const getTotalRunnersCountQuery = /* groq */ `
  count(*[_type == "runner"])
`;

export const getFinishedResultsQuery = /* groq */ `
  *[_type == "result" && year == $year && defined(result)]{
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
