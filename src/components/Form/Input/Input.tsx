import { type ChangeEvent, useEffect, useRef } from 'react';
import './input.pcss';
import { FormField } from '../FormField/FormField.tsx';

interface InputProps {
  focus?: boolean;
  inverted?: boolean;
  id: string;
  label: string;
  type: string;
  value: string;
  placeholder: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
}

export function Input({
  focus,
  inverted,
  id,
  label,
  type,
  value,
  placeholder,
  onChange,
}: InputProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current && focus) {
      inputRef.current.focus();
    }
  }, [focus]);

  return (
    <FormField
      id={id}
      className="input-field"
      label={label}
    >
      <input
        ref={inputRef}
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