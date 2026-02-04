import type { SVGProps } from 'react';

export function PlusIcon({ width, height }: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={width ?? '64'} height={height ?? '64'} viewBox="0 0 24 24">
      <path stroke="currenTColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 12h12m-6-6v12"/>
    </svg>
  );
}