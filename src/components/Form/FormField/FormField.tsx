import './form-field.pcss';
import type { ReactNode } from 'react';

interface FormFieldProps {
  id: string;
  label: string;
  className: string;
  children: ReactNode;
}

export function FormField({ id, label, className, children }: FormFieldProps) {
  return (
    <div className={`form-field ${className}`}>
      <label className="form-field__label" htmlFor={id}>{label}</label>

      {children}
    </div>
  );
}