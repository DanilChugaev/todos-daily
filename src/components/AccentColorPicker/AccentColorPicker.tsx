import { useEffect, useState } from 'react';
import './accent-color-picker.pcss';

const ACCENT_COLOR_KEY = 'accent-color';

const ACCENT_COLORS = [
  { id: 'indigo', label: 'Индиго', value: '#4f46e5' },
  { id: 'blue', label: 'Синий', value: '#2563eb' },
  { id: 'emerald', label: 'Зелёный', value: '#059669' },
  { id: 'orange', label: 'Оранжевый', value: '#ea580c' },
  { id: 'rose', label: 'Розовый', value: '#e11d48' },
] as const;

type AccentColorId = typeof ACCENT_COLORS[number]['id'];

function getSavedAccentColor(): AccentColorId {
  const savedColor = localStorage.getItem(ACCENT_COLOR_KEY);
  return ACCENT_COLORS.some((color) => color.id === savedColor) ? savedColor as AccentColorId : 'indigo';
}

export function AccentColorPicker() {
  const [selected, setSelected] = useState<AccentColorId>(getSavedAccentColor);

  useEffect(() => {
    const color = ACCENT_COLORS.find((item) => item.id === selected)!;
    document.documentElement.style.setProperty('--accent-color', color.value);
    localStorage.setItem(ACCENT_COLOR_KEY, selected);
  }, [selected]);

  return (
    <fieldset className="accent-color-picker">
      <legend className="visually-hidden">Основной цвет интерфейса</legend>
      {ACCENT_COLORS.map((color) => (
        <label key={color.id} className="accent-color-picker__option" title={color.label}>
          <input
            type="radio"
            name="accent-color"
            value={color.id}
            checked={selected === color.id}
            onChange={() => setSelected(color.id)}
          />
          <span style={{ backgroundColor: color.value }} aria-hidden="true" />
          <span className="visually-hidden">{color.label}</span>
        </label>
      ))}
    </fieldset>
  );
}
