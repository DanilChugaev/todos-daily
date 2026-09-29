import { useEffect, useState } from 'react';
import './theme-switcher.pcss';

type ThemeColorState = 'light' | 'dark';
type ThemeSwitcherState = ThemeColorState | 'system';

const COLOR_SCHEME_KEY = 'color-scheme';

const themeColorMapping: Record<ThemeColorState, string> = {
  light: '#f8fafc',
  dark: '#09090b',
};

const items: ThemeSwitcherState[] = ['light', 'system', 'dark'];

interface ThemeSwitcherProps {
  variant?: 'header' | 'menu';
}

export function ThemeSwitcher({ variant = 'header' }: ThemeSwitcherProps) {
  const [selected, setSelected] = useState<ThemeSwitcherState>(getSavedScheme() || 'system');

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const applyScheme = () => {
      const theme = selected === 'system'
        ? (mediaQuery.matches ? 'dark' : 'light')
        : selected;

      if (selected === 'system') {
        document.documentElement.removeAttribute('data-theme');
      } else {
        document.documentElement.dataset.theme = selected;
      }

      document.querySelector('meta[name="theme-color"]')?.setAttribute('content', themeColorMapping[theme]);
    };

    applyScheme();
    mediaQuery.addEventListener('change', applyScheme);

    return () => mediaQuery.removeEventListener('change', applyScheme);
  }, [selected]);

  function setScheme(scheme: ThemeSwitcherState) {
    setSelected(scheme);

    if (scheme === 'system') {
      clearScheme();
    } else {
      saveScheme(scheme);
    }
  }

  function getSavedScheme(): ThemeColorState | null {
    try {
      return localStorage.getItem(COLOR_SCHEME_KEY) as ThemeColorState | null;
    } catch (err) {
      console.error('LocalStorage get error:', err);
      return null;
    }
  }

  function saveScheme(scheme: ThemeSwitcherState) {
    try {
      localStorage.setItem(COLOR_SCHEME_KEY, scheme);
    } catch (err) {
      console.error('LocalStorage save error:', err);
    }
  }

  function clearScheme() {
    try {
      localStorage.removeItem(COLOR_SCHEME_KEY);
    } catch (err) {
      console.error('LocalStorage clear error:', err);
    }
  }

  return (
    <fieldset className={`theme-switcher theme-switcher--${variant}`}>
        <legend className="theme-switcher__legend">Тема</legend>
        {variant === 'menu' && <span className="theme-switcher__label">Тема</span>}

        {items.map(item => (
          <input
            key={item}
            className={`theme-switcher__radio theme-switcher__radio--${item}${selected === item ? ' theme-switcher__radio--selected' : ''}`}
            type="radio"
            name={`color-scheme-${variant}`}
            value={item}
            aria-label={{ light: 'Светлая тема', system: 'Системная тема', dark: 'Тёмная тема' }[item]}
            checked={selected === item}
            onChange={() => setScheme(item)}
          />
        ))}

        <div className="theme-switcher__status"></div>
    </fieldset>
  );
}
