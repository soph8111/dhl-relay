import { RUNNER_FRAGMENT } from '../fragments/runnerFragment';

export const getReferenceRunnerQuery = /* groq */ `
  *[_type == "runner" && isReferenceRunner == true][0]{
    _id,
    firstName,
    alias,
    age,
    gender,
    "resultSeconds": *[_type == "result" && references(^._id) && team->year == $year][0].result
  }
`;

export const getResultsQuery = /* groq */ `
  *[_type == "result" && team->year == $year && defined(result)]{
    "resultSeconds": result,
    runner->{
      ${RUNNER_FRAGMENT}
    }
  }
`;

export const getPendingResultQuery = /* groq */ `
  *[_type == "result" && runner._ref == $runnerId && team._ref == $teamId && !defined(result)][0]{
    _id,
    cutoff
  }
`;
