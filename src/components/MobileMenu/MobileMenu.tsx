import { type ReactNode, useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import './mobile-menu.pcss';
import { Button } from '../Button/Button.tsx';
import { CloseIcon } from '../Icon/CloseIcon.tsx';
import { useOverlayHistory } from '../../hooks/useOverlayHistory.ts';

interface MobileMenuProps {
  children: ReactNode;
}

type DrawerPhase = 'closed' | 'opening' | 'open' | 'closing';

const getFocusableElements = (container: HTMLElement) => Array.from(container.querySelectorAll<HTMLElement>(
  'button:not(:disabled), input:not(:disabled), [href], select:not(:disabled), textarea:not(:disabled), [tabindex]:not([tabindex="-1"])',
));

export function MobileMenu({ children }: MobileMenuProps) {
  const triggerRef = useRef<HTMLButtonElement>(null);
  const drawerRef = useRef<HTMLElement>(null);
  const frameRef = useRef<number | null>(null);
  const closeTimerRef = useRef<number | null>(null);
  const [phase, setPhase] = useState<DrawerPhase>('closed');

  const clearScheduledWork = useCallback(() => {
    if (frameRef.current) cancelAnimationFrame(frameRef.current);
    if (closeTimerRef.current) window.clearTimeout(closeTimerRef.current);
    frameRef.current = null;
    closeTimerRef.current = null;
  }, []);

  const finishClose = useCallback(() => {
    clearScheduledWork();
    setPhase('closed');
    triggerRef.current?.focus();
  }, [clearScheduledWork]);

  const closeMenu = useCallback(() => {
    if (phase === 'closed' || phase === 'closing') return;
    setPhase('closing');
    closeTimerRef.current = window.setTimeout(finishClose, 280);
  }, [finishClose, phase]);

  function openMenu() {
    if (phase !== 'closed') {
      closeMenu();
      return;
    }

    setPhase('opening');
    frameRef.current = requestAnimationFrame(() => {
      frameRef.current = requestAnimationFrame(() => setPhase('open'));
    });
  }

  useOverlayHistory({
    isOpen: phase !== 'closed',
    onBack: () => {
      closeMenu();
      return false;
    },
  });

  useEffect(() => {
    if (phase === 'closed') return undefined;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const mediaQuery = window.matchMedia('(min-width: 641px)');
    const handleDesktop = () => {
      if (mediaQuery.matches) closeMenu();
    };

    mediaQuery.addEventListener('change', handleDesktop);
    return () => {
      document.body.style.overflow = previousOverflow;
      mediaQuery.removeEventListener('change', handleDesktop);
    };
  }, [closeMenu, phase]);

  useEffect(() => {
    if (phase !== 'open' || !drawerRef.current) return undefined;

    const focusTimer = window.setTimeout(() => getFocusableElements(drawerRef.current!)[0]?.focus(), 0);
    return () => window.clearTimeout(focusTimer);
  }, [phase]);

  useEffect(() => {
    if (phase === 'closed') return undefined;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        closeMenu();
        return;
      }

      if (event.key !== 'Tab' || !drawerRef.current) return;
      const focusableElements = getFocusableElements(drawerRef.current);
      if (!focusableElements.length) return;

      const first = focusableElements[0];
      const last = focusableElements.at(-1)!;
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [closeMenu, phase]);

  useEffect(() => clearScheduledWork, [clearScheduledWork]);

  return (
    <div className="mobile-menu">
      <button
        ref={triggerRef}
        className="mobile-menu__trigger"
        type="button"
        aria-label="Открыть меню"
        aria-expanded={phase !== 'closed'}
        aria-controls="mobile-settings-menu"
        onClick={openMenu}
      >
        <span />
        <span />
        <span />
      </button>

      {phase !== 'closed' && createPortal(
        <div className={`mobile-menu__layer mobile-menu__layer--${phase}`}>
          <div className="mobile-menu__backdrop" aria-hidden="true" onClick={phase === 'open' ? closeMenu : undefined} />
          <aside
            id="mobile-settings-menu"
            ref={drawerRef}
            className="mobile-menu__drawer"
            role="dialog"
            aria-modal="true"
            aria-labelledby="mobile-menu-title"
          >
            <div className="mobile-menu__header">
              <h2 id="mobile-menu-title">Оформление</h2>
              <Button icon ariaLabel="Закрыть меню" className="mobile-menu__close" onClick={closeMenu}>
                <CloseIcon width={22} height={22} />
              </Button>
            </div>
            <div className="mobile-menu__settings">{children}</div>
          </aside>
        </div>,
        document.body,
      )}
    </div>
  );
}
