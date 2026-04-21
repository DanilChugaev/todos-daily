import './checkbox.pcss';
import { memo, type MouseEventHandler } from 'react';
import { ICON_SIZE } from '../../constants.ts';
import { CheckboxIcon } from '../Icon/CheckboxIcon.tsx';

interface CheckboxProps {
  id: string;
  label?: string;
  checked?: boolean;
  className?: string;
  width?: string | number;
  height?: string | number;
  onChange?: (checked: boolean) => void;
}

interface CheckboxChangeEvent extends React.SyntheticEvent<HTMLInputElement> {
  target: HTMLInputElement;
}

const handleClick: MouseEventHandler<HTMLLabelElement> = (e) => e.stopPropagation();

export const Checkbox = memo(({
  id,
  label,
  checked,
  className,
  width = ICON_SIZE,
  height = ICON_SIZE,
  onChange,
}: CheckboxProps) => {
  const handleChange = (e: CheckboxChangeEvent) => onChange && onChange(e.target.checked);

  return (
    <label
      htmlFor={id}
      className={`checkbox ${className}`}
      onClick={handleClick}
    >
      <input
        className="checkbox__checkbox"
        type="checkbox"
        id={id}
        checked={checked}
        onChange={handleChange}
      />

      <CheckboxIcon
        className="checkbox__icon"
        width={width}
        height={height}
        checked={checked}
      />

      {label && <span>{label}</span>}
    </label>
  );
});

Checkbox.displayName = 'Checkbox';