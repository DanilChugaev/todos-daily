import type { ReactNode } from 'react';
import './button.pcss';

export function Button({
  className,
  children,
  onClick,
}: {
  className: string,
  children: ReactNode,
  onClick: () => void,
}) {
  return (
    <button
      className={`button ${className}`}
      type="button"
      onClick={onClick}
    >
      {children}
    </button>
  );
}