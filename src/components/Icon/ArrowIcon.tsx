import type { SVGProps } from 'react';
import { ICON_SIZE } from '../../constants.ts';

export function ArrowIcon({ width = ICON_SIZE, height = ICON_SIZE, className }: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} width={width} height={height} viewBox="0 0 24 24">
      <path fill="currentColor" d="M5.707 9.71a1 1 0 0 0 0 1.415l4.892 4.887a2 2 0 0 0 2.828 0l4.89-4.89a1 1 0 1 0-1.414-1.415l-4.185 4.186a1 1 0 0 1-1.415 0L7.121 9.71a1 1 0 0 0-1.414 0"/>
    </svg>
  );
}