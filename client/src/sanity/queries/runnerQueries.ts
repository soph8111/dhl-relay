import { RUNNER_FRAGMENT } from '../fragements/runnerFragment';

export const getRunnersQuery = `
  *[_type == "runner"]{
    ${RUNNER_FRAGMENT}
  }
`;
