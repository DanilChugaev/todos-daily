import './select.pcss';
import { FormField } from '../FormField/FormField.tsx';

interface SelectProps {
  id: string;
  label?: string;
  placeholder: string;
  value: number;
  options: {id: number; name: string}[];
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
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
      >
        <option value={0} disabled selected hidden>{placeholder}</option>
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