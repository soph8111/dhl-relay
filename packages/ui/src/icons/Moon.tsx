import * as React from 'react';
import type { SVGProps } from 'react';
const MoonIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={13}
    height={15}
    fill="none"
    {...props}
  >
    <path
      fill="#fff"
      fillRule="evenodd"
      d="M7.315 1.007c-1.36-.136-2.812.103-4.099.881C.058 3.798-.913 7.74.997 10.898c1.84 3.041 5.875 4.035 8.916 2.196 1.287-.778 2.267-1.93 2.708-3.315-2.363 1.508-5.554.723-6.945-1.71a5.164 5.164 0 0 1 1.64-7.062"
      clipRule="evenodd"
    />
  </svg>
);
export default MoonIcon;
