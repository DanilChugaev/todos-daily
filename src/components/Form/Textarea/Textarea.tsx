import { type ChangeEvent, useEffect, useRef } from 'react';
import './textarea.pcss';
import { FormField } from '../FormField/FormField.tsx';

interface TextareaProps {
  inverted?: boolean;
  id: string;
  label?: string;
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
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Функция для корректировки высоты
  const adjustHeight = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      // Сбрасываем высоту, чтобы scrollHeight пересчитался корректно при удалении текста
      textarea.style.height = 'auto';
      // Устанавливаем высоту равную высоте контента
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  };

  // Вызываем adjustHeight при изменении значения (например, если значение пришло извне)
  useEffect(() => {
    adjustHeight();
  }, [value]);

  const handleChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    // Сначала вызываем оригинальный onChange из пропсов
    onChange(event);
    // Затем корректируем высоту
    adjustHeight();
  };

  return (
    <FormField
      id={id}
      className="textarea-field"
      label={label}
    >
      <textarea
        ref={textareaRef}
        id={id}
        className={`textarea-field__textarea ${inverted ? 'textarea-field__textarea--inverted' : ''}`}
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
      />
    </FormField>
  );
}