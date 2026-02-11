import type { SVGProps } from 'react';
import { ICON_SIZE } from '../../constants.ts';

export function PlusIcon({ width = ICON_SIZE, height = ICON_SIZE }: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={width} height={height} viewBox="0 0 24 24">
      <path stroke="currenTColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 12h12m-6-6v12"/>
    </svg>
  );
}