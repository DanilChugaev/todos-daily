import './header.pcss';
import { Logo } from '../Logo/Logo.tsx';

export function Header() {
  return (
    <header className="header">
      <Logo />
    </header>
  );
}