import { type ChangeEvent, useCallback, useEffect, useRef } from 'react';
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
  onEnter: () => void;
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
  onEnter,
}: InputProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleEnter = useCallback((event: KeyboardEvent) => {
    if (event.key === 'Enter') {
      onEnter();
    }
  }, [onEnter]);

  useEffect(() => {
    if (inputRef.current && focus) {
      inputRef.current.focus();
    }
  }, [focus]);

  useEffect(() => {
    document.addEventListener('keydown', handleEnter, false);

    return () => document.removeEventListener('keydown', handleEnter, false);
  }, [handleEnter]);

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