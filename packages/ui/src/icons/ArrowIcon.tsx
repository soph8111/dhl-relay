import * as React from 'react';
import type { SVGProps } from 'react';
const ArrowIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={21}
    height={21}
    fill="none"
    viewBox="0 0 21 21"
    {...props}
  >
    <g clipPath="url(#ArrowIcon_svg__a)">
      <path
        fill="white"
        d="M.533 10.836c0 5.612 4.55 10.161 10.161 10.161 5.612 0 10.162-4.549 10.162-10.16 0-5.613-4.55-10.162-10.162-10.162C5.084.675.534 5.225.534 10.836"
      />
      <path
        fill="black"
        d="m10.692 15.11.855-.852-2.853-2.826 6.364-.06v-1.2l-6.364.059 2.853-2.88-.855-.835-4.296 4.337z"
      />
    </g>
    <defs>
      <clipPath id="ArrowIcon_svg__a">
        <path fill="currentColor" d="M21 0v21H0V0z" />
      </clipPath>
    </defs>
  </svg>
);
export default ArrowIcon;
