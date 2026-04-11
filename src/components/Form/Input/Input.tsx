import { type ChangeEvent, useCallback, useEffect, useRef } from 'react';
import './input.pcss';
import { FormField } from '../FormField/FormField.tsx';

interface InputProps {
  focus?: boolean;
  inverted?: boolean;
  id: string;
  label?: string;
  type: string;
  value: string;
  placeholder?: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onEnter?: () => void;
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
    if (onEnter && event.key === 'Enter') {
      onEnter();
    }
  }, [onEnter]);

  useEffect(() => {
    if (inputRef.current && focus) {
      inputRef.current.focus();
    }
  }, [focus]);

  useEffect(() => {
    if (onEnter) {
      inputRef.current?.addEventListener('keydown', handleEnter, false);

      // eslint-disable-next-line react-hooks/exhaustive-deps
      return () => inputRef.current?.removeEventListener('keydown', handleEnter, false);
    }
  }, [handleEnter, onEnter]);

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