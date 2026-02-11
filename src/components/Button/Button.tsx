import type { ReactNode } from 'react';
import './button.pcss';

interface ButtonProps {
  inverted?: boolean,
  className?: string,
  children: ReactNode,
  onClick: () => void,
}

export function Button({
  inverted,
  className,
  children,
  onClick,
}: ButtonProps) {
  return (
    <button
      className={`button ${className ?? ''} ${inverted ? 'button--inverted' : ''}`}
      type="button"
      onClick={onClick}
    >
      {children}
    </button>
  );
}