import type { SVGProps } from 'react';
import { ICON_SIZE } from '../../constants.ts';

export function StartIcon({ width = ICON_SIZE, height = ICON_SIZE }: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={width} height={height} fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" viewBox="0 0 24 24" aria-hidden="true">
      <path d="m9 6 7 6-7 6V6Z" />
    </svg>
  );
}
