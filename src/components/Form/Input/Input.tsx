import type { ChangeEvent } from 'react';
import './input.pcss';
import { FormField } from '../FormField/FormField.tsx';

interface InputProps {
  inverted?: boolean;
  id: string;
  label: string;
  type: string;
  value: string;
  placeholder: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
}

export function Input({
  inverted,
  id,
  label,
  type,
  value,
  placeholder,
  onChange,
}: InputProps) {
  return (
    <FormField
      id={id}
      className="input-field"
      label={label}
    >
      <input
        id={id}
        className={`input-field__input ${inverted ? 'input-field__input--inverted' : ''}`}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
      />
    </FormField>
  );
}