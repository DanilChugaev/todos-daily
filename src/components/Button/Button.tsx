import type { ReactNode } from 'react';
import './button.pcss';

interface ButtonProps {
  inverted?: boolean,
  icon?: boolean,
  className?: string,
  children: ReactNode,
  onClick: () => void,
}

export function Button({
  inverted,
  icon,
  className,
  children,
  onClick,
}: ButtonProps) {
  const classNames = ['button'];

  if (className) {
    classNames.push(className);
  }

  if (inverted) {
    classNames.push('button--inverted');
  }

  if (icon) {
    classNames.push('button--icon');
  }

  return (
    <button
      className={classNames.join(' ')}
      type="button"
      onClick={onClick}
    >
      {children}
    </button>
  );
}