import { RUNNER_FRAGMENT } from '../fragments/runnerFragment';

// Get the results for a given year
export const getResultsQuery = /* groq */ `
  *[_type == "result" && team->year == $year && defined(result)]{
    "resultSeconds": result,
    runner->{
      ${RUNNER_FRAGMENT}
    }
  }
`;

// Get unfinished result for a given runner and team
export const getPendingResultQuery = /* groq */ `
  *[_type == "result" && runner._ref == $runnerId && team._ref == $teamId && !defined(result)][0]{
    _id,
    cutoff
  }
`;
