import type { SVGProps } from 'react';
import { ICON_SIZE } from '../../constants.ts';

export function GrabPlaceIcon({ width = ICON_SIZE, height = ICON_SIZE }: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={width} height={height} stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 16 16">
      <circle cx="5.5" cy="2.5" r=".75"/>
      <circle cx="5.5" cy="8" r=".75"/>
      <circle cx="5.5" cy="13.5" r=".75"/>
      <circle cx="10.496" cy="2.5" r=".75"/>
      <circle cx="10.496" cy="8" r=".75"/>
      <circle cx="10.496" cy="13.5" r=".75"/>
    </svg>
  );
}