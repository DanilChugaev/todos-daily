import './select.pcss';
import { FormField } from '../FormField/FormField.tsx';
import type { ISelect } from '../../../types.ts';
import { ArrowIcon } from '../../Icon/ArrowIcon.tsx';

interface SelectProps<T extends string | number = number> {
  id: string;
  label?: string;
  placeholder: string;
  value: T;
  options: ISelect<T>[];
  onChange: (value: T) => void;
  size?: 'small' | 'normal';
  ariaLabel?: string;
}

export function Select<T extends string | number = number>({ id, label, placeholder, value, options, onChange, size = 'normal', ariaLabel }: SelectProps<T>) {
  return (
    <FormField
      id={id}
      className="select-field"
      label={label}
    >
      <select
        id={id}
        className={`select select--${size}${value ? ' select--selected' : ''}`}
        value={value}
        onChange={(e) => onChange((typeof value === 'number' ? Number(e.target.value) : e.target.value) as T)}
        aria-label={ariaLabel}
      >
        <option value={0} disabled hidden>{placeholder}</option>
        {
          options.map((option) => (
            <option key={option.id} value={option.id}>
              {option.name}
            </option>
          ))
        }
      </select>

      <ArrowIcon width="12px" height="12px" className="select-field__icon" />
    </FormField>
  );
}
