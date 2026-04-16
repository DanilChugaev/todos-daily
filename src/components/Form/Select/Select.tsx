import './select.pcss';
import { FormField } from '../FormField/FormField.tsx';
import type { ISelect } from '../../../types.ts';

interface SelectProps {
  id: string;
  label?: string;
  placeholder: string;
  value: number;
  options: ISelect<any>[];
  onChange: (value: number) => void;
}

export function Select({ id, label, placeholder, value, options, onChange }: SelectProps) {
  return (
    <FormField
      id={id}
      className="textarea-field"
      label={label}
    >
      <select
        id={id}
        className={`select${value ? ' select--selected' : ''}`}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
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
    </FormField>
  );
}