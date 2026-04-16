import type { SVGProps } from 'react';
import { ICON_SIZE } from '../../constants.ts';

export interface PriorityIconProps extends SVGProps<SVGSVGElement> {
  title: string;
}

export function PriorityIcon({
  width = ICON_SIZE,
  height = ICON_SIZE,
  fill = 'currentColor',
  className = '',
  title = '',
}: PriorityIconProps) {
  return (
    <span className={className} title={title} style={{
      width,
      height,
      backgroundColor: fill,
      borderRadius: '50%',
    }}></span>
  );
}