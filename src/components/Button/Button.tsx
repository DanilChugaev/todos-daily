import type { ReactNode } from 'react';
import './button.pcss';

interface ButtonProps {
  inverted?: boolean;
  icon?: boolean;
  className?: string;
  size?: 'small' | 'normal';
  transparent?: boolean;
  children: ReactNode;
  onClick: () => void;
}

export function Button({
  inverted,
  icon,
  className,
  size,
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