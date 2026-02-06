import type { SVGProps } from 'react';

export function CloseIcon({ width, height }: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={width ?? '64'} height={height ?? '64'} viewBox="0 0 24 24">
      <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
            d="m18 18-6-6m0 0L6 6m6 6 6-6m-6 6-6 6"/>
    </svg>
  );
}