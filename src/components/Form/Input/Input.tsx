import type { ChangeEvent } from 'react';
import './input.pcss';
import { FormField } from '../FormField/FormField.tsx';

interface InputProps {
  id: string;
  label: string;
  type: string;
  value: string;
  placeholder: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
}

export function Input({ id, label, type, value, placeholder, onChange }: InputProps) {
  return (
    <FormField id={id} className="input-field" label={label}>
      <input
        id={id}
        className="input-field__input"
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
      />
    </FormField>
  );
}