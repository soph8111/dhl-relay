import type { SVGProps } from 'react';
const CloseIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={50}
    height={50}
    fill="none"
    viewBox="0 0 50 50"
    {...props}
  >
    <path
      fill="currentColor"
      d="M25 50c13.807 0 25-11.193 25-25S38.807 0 25 0 0 11.193 0 25s11.193 25 25 25m9.575-33.102L26.473 25l8.102 8.103-1.473 1.473L25 26.473l-8.102 8.102-1.473-1.473L23.527 25l-8.103-8.102 1.474-1.473L25 23.527l8.102-8.102z"
    />
  </svg>
);
export default CloseIcon;
