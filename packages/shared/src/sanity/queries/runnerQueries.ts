import { RUNNER_FRAGMENT } from '../fragments/runnerFragment';

// Get all runners
export const getRunnersQuery = `
  *[_type == "runner"]{
    ${RUNNER_FRAGMENT}
  }
`;

// Get the reference runner for a given year
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
