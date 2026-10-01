import './header.pcss';
import { Logo } from '../Logo/Logo.tsx';
import { ThemeSwitcher } from '../ThemeSwitcher/ThemeSwitcher.tsx';
import { AccentColorPicker } from '../AccentColorPicker/AccentColorPicker.tsx';
import { MobileMenu } from '../MobileMenu/MobileMenu.tsx';
import { DataManagement } from '../DataManagement/DataManagement.tsx';
import { DesktopSettingsMenu } from '../DesktopSettingsMenu/DesktopSettingsMenu.tsx';

export function Header() {
  return (
    <header className="header">
      <Logo />
      <div className="header__controls header__controls--desktop">
        <AccentColorPicker />
        <ThemeSwitcher />
        <DesktopSettingsMenu>
          <DataManagement />
        </DesktopSettingsMenu>
      </div>
      <MobileMenu>
        <ThemeSwitcher variant="menu" />
        <AccentColorPicker variant="menu" />
        <DataManagement />
      </MobileMenu>
    </header>
  );
}
