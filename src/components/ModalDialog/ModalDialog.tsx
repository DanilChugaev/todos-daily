import { type ReactNode, useCallback, useEffect, useId, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import './modal-dialog.pcss';
import { CloseIcon } from '../Icon/CloseIcon.tsx';
import { Button } from '../Button/Button.tsx';
import { ANIMATION_MS } from '../../constants.ts';

interface ModalDialogProps {
  title: string;
  isOpen: boolean;
  children: ReactNode;
  onClose: () => void;
  hasUnsavedChanges?: boolean;
}

const getFocusableElements = (container: HTMLElement) => {
  return Array.from(container.querySelectorAll<HTMLElement>(
    'button:not(:disabled), [href], input:not(:disabled), select:not(:disabled), textarea:not(:disabled), [tabindex]:not([tabindex="-1"])',
  ));
};

export function ModalDialog({ title, isOpen, children, onClose, hasUnsavedChanges = false }: ModalDialogProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLElement | null>(null);
  const closeTimerRef = useRef<number | null>(null);
  const titleId = useId();
  const [isVisible, setIsVisible] = useState(isOpen);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  const finishClose = useCallback(() => {
    setIsAnimating(false);
    closeTimerRef.current = window.setTimeout(() => {
      setIsVisible(false);
      setIsConfirmOpen(false);
      onClose();
      triggerRef.current?.focus();
    }, ANIMATION_MS);
  }, [onClose]);

  const requestClose = useCallback(() => {
    if (hasUnsavedChanges) {
      setIsConfirmOpen(true);
      return;
    }

    finishClose();
  }, [finishClose, hasUnsavedChanges]);

  useEffect(() => {
    if (isOpen) {
      triggerRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsVisible(true);
      const animationFrame = requestAnimationFrame(() => setIsAnimating(true));
      return () => cancelAnimationFrame(animationFrame);
    }

    setIsAnimating(false);
    setIsConfirmOpen(false);
    return undefined;
  }, [isOpen]);

  useEffect(() => {
    if (!isVisible) return undefined;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const focusTimer = window.setTimeout(() => {
      const firstFocusable = dialogRef.current && getFocusableElements(dialogRef.current)[0];
      firstFocusable?.focus();
    }, 0);

    return () => {
      window.clearTimeout(focusTimer);
      document.body.style.overflow = previousOverflow;
    };
  }, [isVisible]);

  useEffect(() => {
    if (!isVisible) return undefined;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        if (isConfirmOpen) setIsConfirmOpen(false);
        else requestClose();
      }

      if (event.key !== 'Tab' || !dialogRef.current) return;
      const focusableElements = getFocusableElements(dialogRef.current);
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
  }, [isConfirmOpen, isVisible, requestClose]);

  useEffect(() => () => {
    if (closeTimerRef.current) window.clearTimeout(closeTimerRef.current);
  }, []);

  if (!isVisible) return null;

  return createPortal(
    <div className={`modal-layer ${isAnimating ? 'modal-layer--active' : ''}`}>
      <div className="modal-dialog-backdrop" onClick={requestClose} aria-hidden="true" />
      <div
        className="modal-dialog"
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
      >
        <div className="modal-dialog__header">
          <h2 id={titleId} className="modal-dialog__title">{title}</h2>
          <Button icon ariaLabel="Закрыть окно" className="modal-dialog__close-btn" onClick={requestClose}>
            <CloseIcon />
          </Button>
        </div>

        <div className="modal-dialog__content">{children}</div>

        {isConfirmOpen && (
          <div className="modal-dialog__confirm" role="alertdialog" aria-modal="true" aria-labelledby={`${titleId}-confirm`}>
            <div className="modal-dialog__confirm-card">
              <h3 id={`${titleId}-confirm`}>Закрыть без сохранения?</h3>
              <p>Внесённые изменения будут потеряны.</p>
              <div className="modal-dialog__confirm-actions">
                <Button inverted onClick={() => setIsConfirmOpen(false)}>Остаться</Button>
                <Button color="red" onClick={finishClose}>Закрыть без сохранения</Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>,
    document.body,
  );
}
