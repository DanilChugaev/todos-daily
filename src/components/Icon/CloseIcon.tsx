import type { SVGProps } from 'react';
import { ICON_SIZE } from '../../constants.ts';

export function CloseIcon({ width = ICON_SIZE, height = ICON_SIZE }: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={width} height={height} viewBox="0 0 24 24">
      <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
            d="m18 18-6-6m0 0L6 6m6 6 6-6m-6 6-6 6"/>
    </svg>
  );
}