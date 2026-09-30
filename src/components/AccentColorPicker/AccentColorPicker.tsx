import { type PointerEvent, useEffect, useId, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
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

interface AccentColorPickerProps {
  variant?: 'header' | 'menu';
}

export function AccentColorPicker({ variant = 'header' }: AccentColorPickerProps) {
  const [selected, setSelected] = useState<AccentColorId>(getSavedAccentColor);
  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const triggerRef = useRef<HTMLButtonElement>(null);
  const paletteRef = useRef<HTMLDivElement>(null);
  const closeTimerRef = useRef<number | null>(null);
  const paletteId = useId();

  useEffect(() => {
    const color = ACCENT_COLORS.find((item) => item.id === selected)!;
    document.documentElement.style.setProperty('--accent-color', color.value);
    localStorage.setItem(ACCENT_COLOR_KEY, selected);
  }, [selected]);

  useEffect(() => {
    if (variant !== 'header' || !isOpen) return undefined;

    const handlePointerDown = (event: PointerEvent) => {
      if (!triggerRef.current?.contains(event.target as Node) && !paletteRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        setIsOpen(false);
        triggerRef.current?.focus();
      }
    };

    document.addEventListener('pointerdown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('pointerdown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, variant]);

  function openPalette() {
    if (variant !== 'header') return;
    if (closeTimerRef.current) window.clearTimeout(closeTimerRef.current);
    const rect = triggerRef.current?.getBoundingClientRect();
    if (rect) {
      const width = 248;
      setPosition({
        top: rect.bottom + 8,
        left: Math.max(8, Math.min(window.innerWidth - width - 8, rect.right - width)),
      });
    }
    setIsOpen(true);
  }

  function scheduleClose() {
    if (variant !== 'header') return;
    closeTimerRef.current = window.setTimeout(() => setIsOpen(false), 140);
  }

  function handlePointerEnter(event: PointerEvent<HTMLDivElement>) {
    if (event.pointerType === 'mouse') openPalette();
  }

  function handlePointerLeave(event: PointerEvent<HTMLDivElement>) {
    if (event.pointerType === 'mouse') scheduleClose();
  }

  function selectColor(colorId: AccentColorId) {
    setSelected(colorId);
    setIsOpen(false);
  }

  function renderOptions() {
    return ACCENT_COLORS.map((color) => (
      <button
        key={color.id}
        type="button"
        className={`accent-color-picker__option${selected === color.id ? ' accent-color-picker__option--selected' : ''}`}
        aria-label={`Выбрать акцентный цвет: ${color.label}`}
        aria-pressed={selected === color.id}
        onClick={() => selectColor(color.id)}
      >
        <span style={{ backgroundColor: color.value }} aria-hidden="true" />
        <span className="visually-hidden">{color.label}</span>
      </button>
    ));
  }

  if (variant === 'menu') {
    return (
      <fieldset className="accent-color-picker accent-color-picker--menu">
        <legend className="visually-hidden">Основной цвет интерфейса</legend>
        <span className="accent-color-picker__label">Акцентный цвет</span>
        {renderOptions()}
      </fieldset>
    );
  }

  const selectedColor = ACCENT_COLORS.find((color) => color.id === selected)!;

  return (
    <div className="accent-color-picker accent-color-picker--header" onPointerEnter={handlePointerEnter} onPointerLeave={handlePointerLeave}>
      <button
        ref={triggerRef}
        type="button"
        className="accent-color-picker__trigger"
        aria-label={`Акцентный цвет: ${selectedColor.label}. Открыть палитру`}
        aria-haspopup="dialog"
        aria-expanded={isOpen}
        aria-controls={paletteId}
        onClick={() => isOpen ? setIsOpen(false) : openPalette()}
      >
        <span style={{ backgroundColor: selectedColor.value }} aria-hidden="true" />
      </button>

      {isOpen && createPortal(
        <div
          id={paletteId}
          ref={paletteRef}
          className="accent-color-picker__palette"
          role="dialog"
          aria-label="Выбор акцентного цвета"
          style={{ top: position.top, left: position.left }}
          onPointerEnter={handlePointerEnter}
          onPointerLeave={handlePointerLeave}
        >
          <span className="accent-color-picker__label">Акцентный цвет</span>
          <div className="accent-color-picker__options">{renderOptions()}</div>
        </div>,
        document.body,
      )}
    </div>
  );
}
