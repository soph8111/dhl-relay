import { RUNNER_FRAGMENT } from '../fragments/runnerFragment';

export const getRunnersQuery = `
  *[_type == "runner"]{
    ${RUNNER_FRAGMENT}
  }
`;
