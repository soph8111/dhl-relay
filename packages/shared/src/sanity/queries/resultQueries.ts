import { RUNNER_FRAGMENT } from '../fragments/runnerFragment';

// Query for fetching the reference runner and look up their result for the given year - resultSeconds is null if they haven't finished yet
export const getReferenceRunnerQuery = /* groq */ `
  *[_type == "runner" && isReferenceRunner == true][0]{
    _id,
    age,
    gender,
    "resultSeconds": *[_type == "result" && references(^._id) && year == $year][0].result
  }
`;

// Query for fetching all results for a given year, including the runner details
export const getResultsQuery = /* groq */ `
  *[_type == "result" && year == $year && defined(result)]{
    "resultSeconds": result,
    runner->{
      ${RUNNER_FRAGMENT}
    }
  }
`;
