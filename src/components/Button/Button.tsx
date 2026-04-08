import type { ReactNode } from 'react';
import './button.pcss';

interface ButtonProps {
  inverted?: boolean;
  icon?: boolean;
  className?: string;
  size?: 'small' | 'normal';
  color?: 'red';
  transparent?: boolean;
  children: ReactNode;
  onClick: () => void;
}

export function Button({
  inverted,
  icon,
  className,
  size,
  color,
  transparent,
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

  if (size) {
    classNames.push(`button--${size}`);
  }

  if (color) {
    classNames.push(`button--${color}`);
  }

  if (transparent) {
    classNames.push('button--transparent');
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