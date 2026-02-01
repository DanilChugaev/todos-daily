import './theme-switcher.pcss';
import { useState } from 'react';

type ThemeSwitcherState = 'light' | 'system' | 'dark';

export function ThemeSwitcher() {
  const [selected, setSelected] = useState<ThemeSwitcherState>('system');

  return (
    <fieldset className="theme-switcher">
      <legend className="theme-switcher__legend">Scheme</legend>

      <input
        className="theme-switcher__radio theme-switcher__radio--light"
        type="radio"
        name="color-scheme"
        value="light"
        aria-label="Light"
        checked={selected === 'light'}
        onClick={() => setSelected('light')}
      />

      <input
        className="theme-switcher__radio theme-switcher__radio--system"
        type="radio"
        name="color-scheme"
        value="system"
        aria-label="System"
        checked={selected === 'system'}
        onClick={() => setSelected('system')}
      />

      <input
        className="theme-switcher__radio theme-switcher__radio--dark"
        type="radio"
        name="color-scheme"
        value="dark"
        aria-label="Dark"
        checked={selected === 'dark'}
        onClick={() => setSelected('dark')}
      />

      <div className="theme-switcher__status"></div>
    </fieldset>
  );
}