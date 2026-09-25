import { type ChangeEvent, type KeyboardEvent, useEffect, useRef } from 'react';
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
  min?: string;
  size?: 'small' | 'normal';
  ariaLabel?: string;
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
  min,
  size = 'normal',
  ariaLabel,
  onChange,
  onEnter,
}: InputProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  function handleEnter(event: KeyboardEvent<HTMLInputElement>) {
    if (onEnter && event.key === 'Enter') {
      onEnter();
    }
  }

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
        className={`input-field__input input-field__input--${size} ${inverted ? 'input-field__input--inverted' : ''}`}
        type={type}
        value={value}
        onChange={onChange}
        onKeyDown={handleEnter}
        placeholder={placeholder}
        min={min}
        aria-label={ariaLabel}
      />
    </FormField>
  );
}
