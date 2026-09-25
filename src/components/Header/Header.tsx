import './header.pcss';
import { Logo } from '../Logo/Logo.tsx';
import { ThemeSwitcher } from '../ThemeSwitcher/ThemeSwitcher.tsx';
import { AccentColorPicker } from '../AccentColorPicker/AccentColorPicker.tsx';

export function Header() {
  return (
    <header className="header">
      <Logo />
      <div className="header__controls">
        <AccentColorPicker />
        <ThemeSwitcher />
      </div>
    </header>
  );
}
