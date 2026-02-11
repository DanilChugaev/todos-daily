import type { ChangeEvent } from 'react';
import './textarea.pcss';
import { FormField } from '../FormField/FormField.tsx';


interface TextareaProps {
  inverted?: boolean;
  id: string;
  label: string;
  value: string;
  placeholder: string;
  onChange: (event: ChangeEvent<HTMLTextAreaElement>) => void;
}

export function Textarea({
  inverted,
  id,
  label,
  value,
  placeholder,
  onChange,
}: TextareaProps) {
  return (
    <FormField
      id={id}
      className="textarea-field"
      label={label}
    >
      <textarea
        id={id}
        className={`textarea-field__textarea ${inverted ? 'textarea-field__textarea--inverted' : ''}`}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
      />
    </FormField>
  );
}