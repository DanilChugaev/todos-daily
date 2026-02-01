import './header.pcss';
import { Logo } from '../Logo/Logo.tsx';
import { ThemeSwitcher } from '../ThemeSwitcher/ThemeSwitcher.tsx';

export function Header() {
  return (
    <header className="header">
      <Logo />

      <ThemeSwitcher />
    </header>
  );
}