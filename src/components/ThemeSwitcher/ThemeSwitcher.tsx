import { useEffect, useState } from 'react';
import './theme-switcher.pcss';

type ThemeSwitcherState = 'light' | 'system' | 'dark';
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

const themeColorMapping: Record<'light' | 'dark', string> = {
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

  function getSavedScheme(): ThemeSwitcherState | null {
    return localStorage.getItem(COLOR_SCHEME_KEY) as ThemeSwitcherState | null;
  }

  function saveScheme(scheme: ThemeSwitcherState) {
    localStorage.setItem(COLOR_SCHEME_KEY, scheme);
  }

  function clearScheme() {
    localStorage.removeItem(COLOR_SCHEME_KEY);
  }

  function getThemeColorMapping() {
    return {
      light: themeColorMapping['light'],
      dark: themeColorMapping['dark'],
      system: matchMedia('(prefers-color-scheme: dark)').matches ? themeColorMapping['dark'] : themeColorMapping['light'],
    };
  }

  useEffect(() => {
    const lightLinkTag = document.getElementById('light-scheme');
    const darkLinkTag = document.getElementById('dark-scheme');
    const themeColorTag = document.getElementById('theme-color');

    lightLinkTag?.setAttribute('media', lightMediaMapping[selected]);
    darkLinkTag?.setAttribute('media', darkMediaMapping[selected]);
    themeColorTag?.setAttribute('content', getThemeColorMapping()[selected]);
  }, [selected]);

  return (
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
  );
}