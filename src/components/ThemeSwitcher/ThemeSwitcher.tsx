import { useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import './theme-switcher.pcss';

type ThemeColorState = 'light' | 'dark';
type ThemeSwitcherState = ThemeColorState | 'system';
type SchemeMediaAttribute = '(prefers-color-scheme: light)' | '(prefers-color-scheme: dark)' | 'not all' | 'all';

const COLOR_SCHEME_KEY = 'color-scheme';

const lightMediaMapping: Record<ThemeSwitcherState, SchemeMediaAttribute> = {
  light: 'all',
  dark: 'not all',
  system: '(prefers-color-scheme: light)',
};
const darkMediaMapping: Record<ThemeSwitcherState, SchemeMediaAttribute> = {
  light: 'not all',
  dark: 'all',
  system: '(prefers-color-scheme: dark)',
};
const themeColorMapping: Record<ThemeColorState, string> = {
  light: '#f8fafc',
  dark: '#09090b',
};

const items: ThemeSwitcherState[] = ['light', 'system', 'dark'];

export function ThemeSwitcher() {
  const [selected, setSelected] = useState<ThemeSwitcherState>(getSavedScheme() || 'system');

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

  const themeColors = useMemo(() => ({
    light: themeColorMapping.light,
    dark: themeColorMapping.dark,
    system: matchMedia('(prefers-color-scheme: dark)').matches ? themeColorMapping.dark : themeColorMapping.light,
  }), []);

  return (
    <>
      {createPortal(
        (
          <>
            <link rel="stylesheet" href={`${import.meta.env.BASE_URL}src/styles/theme/light.css`}
                  media={lightMediaMapping[selected]}/>
            <link rel="stylesheet" href={`${import.meta.env.BASE_URL}src/styles/theme/dark.css`}
                  media={darkMediaMapping[selected]}/>
            <meta name="theme-color" content={themeColors[selected]}/>
          </>
        ),
        document.head,
      )}

      <fieldset className="theme-switcher">
        <legend className="theme-switcher__legend">Scheme</legend>

        {items.map(item => (
          <input
            key={item}
            className={`theme-switcher__radio theme-switcher__radio--${item}`}
            type="radio"
            name="color-scheme"
            value={item}
            aria-label={item}
            checked={selected === item}
            onChange={() => setScheme(item)}
          />
        ))}

        <div className="theme-switcher__status"></div>
      </fieldset>
    </>
  );
}