import { type ReactNode, useEffect, useId, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Button } from '../Button/Button.tsx';
import { DocIcon } from '../Icon/DocIcon.tsx';
import './desktop-settings-menu.pcss';

interface DesktopSettingsMenuProps {
  children: ReactNode;
}

export function DesktopSettingsMenu({ children }: DesktopSettingsMenuProps) {
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const menuId = useId();
  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });

  function openMenu() {
    const rect = triggerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const width = 300;
    setPosition({
      top: rect.bottom + 8,
      left: Math.max(8, Math.min(window.innerWidth - width - 8, rect.right - width)),
    });
    setIsOpen(true);
  }

  function closeMenu() {
    setIsOpen(false);
    triggerRef.current?.focus();
  }

  useEffect(() => {
    if (!isOpen) return undefined;

    const handlePointerDown = (event: PointerEvent) => {
      if (!triggerRef.current?.contains(event.target as Node) && !menuRef.current?.contains(event.target as Node)) closeMenu();
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        closeMenu();
      }
    };

    document.addEventListener('pointerdown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('pointerdown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  return (
    <div className="desktop-settings-menu">
      <Button
        ref={triggerRef}
        icon
        ariaLabel="Открыть настройки"
        aria-haspopup="dialog"
        aria-expanded={isOpen}
        aria-controls={menuId}
        onClick={() => isOpen ? closeMenu() : openMenu()}
      >
        <DocIcon width={20} height={20} />
      </Button>

      {isOpen && createPortal(
        <div
          id={menuId}
          ref={menuRef}
          className="desktop-settings-menu__popup"
          role="dialog"
          aria-label="Настройки приложения"
          style={{ top: position.top, left: position.left }}
        >
          {children}
        </div>,
        document.body,
      )}
    </div>
  );
}
