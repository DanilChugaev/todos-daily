import { type ReactNode, useCallback, useEffect, useId, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import './modal-dialog.pcss';
import { CloseIcon } from '../Icon/CloseIcon.tsx';
import { Button } from '../Button/Button.tsx';
import { ConfirmDialog } from '../ConfirmDialog/ConfirmDialog.tsx';
import { ANIMATION_MS } from '../../constants.ts';

interface ModalDialogProps {
  title: string;
  isOpen: boolean;
  children: ReactNode;
  onClose: () => void;
  onExited?: () => void;
  hasUnsavedChanges?: boolean;
}

type ModalPhase = 'closed' | 'opening' | 'open' | 'closing';

const getFocusableElements = (container: HTMLElement) => Array.from(container.querySelectorAll<HTMLElement>(
  'button:not(:disabled), [href], input:not(:disabled), select:not(:disabled), textarea:not(:disabled), [tabindex]:not([tabindex="-1"])',
));

export function ModalDialog({ title, isOpen, children, onClose, onExited, hasUnsavedChanges = false }: ModalDialogProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const layerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLElement | null>(null);
  const frameRef = useRef<number | null>(null);
  const nestedFrameRef = useRef<number | null>(null);
  const fallbackTimerRef = useRef<number | null>(null);
  const titleId = useId();
  const [phase, setPhase] = useState<ModalPhase>(isOpen ? 'opening' : 'closed');
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  const clearScheduledWork = useCallback(() => {
    if (frameRef.current) cancelAnimationFrame(frameRef.current);
    if (nestedFrameRef.current) cancelAnimationFrame(nestedFrameRef.current);
    if (fallbackTimerRef.current) window.clearTimeout(fallbackTimerRef.current);
    frameRef.current = null;
    nestedFrameRef.current = null;
    fallbackTimerRef.current = null;
  }, []);

  const completeExit = useCallback(() => {
    clearScheduledWork();
    setPhase('closed');
    setIsConfirmOpen(false);
    onExited?.();
    triggerRef.current?.focus();
  }, [clearScheduledWork, onExited]);

  const requestClose = useCallback(() => {
    if (hasUnsavedChanges) {
      setIsConfirmOpen(true);
      return;
    }

    onClose();
  }, [hasUnsavedChanges, onClose]);

  useEffect(() => {
    clearScheduledWork();

    if (isOpen) {
      if (phase === 'closed' || phase === 'closing') {
        triggerRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setPhase('opening');
      }

      return clearScheduledWork;
    }

    if (phase !== 'closed') {
      setPhase('closing');
      fallbackTimerRef.current = window.setTimeout(completeExit, ANIMATION_MS + 100);
    }

    return clearScheduledWork;
  }, [clearScheduledWork, completeExit, isOpen, phase]);

  useEffect(() => {
    if (phase !== 'opening') return undefined;

    frameRef.current = requestAnimationFrame(() => {
      nestedFrameRef.current = requestAnimationFrame(() => setPhase('open'));
    });

    return clearScheduledWork;
  }, [clearScheduledWork, phase]);

  useEffect(() => {
    if (phase === 'closed') return undefined;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [phase]);

  useEffect(() => {
    if (phase !== 'open' || !dialogRef.current) return undefined;

    const focusTimer = window.setTimeout(() => {
      const initialFocus = dialogRef.current?.querySelector<HTMLElement>('[data-modal-autofocus="true"]');
      const firstFocusable = getFocusableElements(dialogRef.current!)[0];
      (initialFocus ?? firstFocusable)?.focus();
    }, ANIMATION_MS + 50);

    return () => window.clearTimeout(focusTimer);
  }, [phase]);

  useEffect(() => {
    if (phase === 'closed' || !layerRef.current) return undefined;

    const viewport = window.visualViewport;
    const dialogElement = dialogRef.current;
    if (!dialogElement) return undefined;
    let scrollTimer: number | null = null;

    const keepFocusedElementVisible = () => {
      const activeElement = document.activeElement;
      if (!(activeElement instanceof HTMLElement) || !dialogElement.contains(activeElement)) return;

      activeElement.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    };

    const syncViewport = () => {
      const height = viewport?.height ?? window.innerHeight;
      const offsetTop = viewport?.offsetTop ?? 0;
      layerRef.current?.style.setProperty('--modal-viewport-height', `${height}px`);
      layerRef.current?.style.setProperty('--modal-viewport-offset', `${offsetTop}px`);

      if (scrollTimer) window.clearTimeout(scrollTimer);
      scrollTimer = window.setTimeout(keepFocusedElementVisible, 80);
    };

    const handleFocusIn = () => window.setTimeout(keepFocusedElementVisible, 0);

    syncViewport();
    viewport?.addEventListener('resize', syncViewport);
    viewport?.addEventListener('scroll', syncViewport);
    dialogElement.addEventListener('focusin', handleFocusIn);

    return () => {
      if (scrollTimer) window.clearTimeout(scrollTimer);
      viewport?.removeEventListener('resize', syncViewport);
      viewport?.removeEventListener('scroll', syncViewport);
      dialogElement.removeEventListener('focusin', handleFocusIn);
    };
  }, [phase]);

  useEffect(() => {
    if (phase === 'closed') return undefined;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        if (isConfirmOpen) setIsConfirmOpen(false);
        else requestClose();
        return;
      }

      if (event.key !== 'Tab' || !dialogRef.current) return;
      if (isConfirmOpen) return;
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
  }, [isConfirmOpen, phase, requestClose]);

  useEffect(() => clearScheduledWork, [clearScheduledWork]);

  function handleTransitionEnd(event: React.TransitionEvent<HTMLDivElement>) {
    if (event.target !== event.currentTarget || event.propertyName !== 'transform') return;
    if (phase === 'opening') setPhase('open');
    if (phase === 'closing') completeExit();
  }

  if (phase === 'closed') return null;

  return createPortal(
    <div ref={layerRef} className={`modal-layer modal-layer--${phase}`}>
      <div className="modal-dialog-backdrop" onClick={phase === 'open' ? requestClose : undefined} aria-hidden="true" />
      <div
        className="modal-dialog"
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        onTransitionEnd={handleTransitionEnd}
      >
        <div className="modal-dialog__header">
          <h2 id={titleId} className="modal-dialog__title">{title}</h2>
          <Button icon ariaLabel="Закрыть окно" className="modal-dialog__close-btn" onClick={requestClose}>
            <CloseIcon />
          </Button>
        </div>

        <div className="modal-dialog__content">{children}</div>

      </div>
      <ConfirmDialog
        isOpen={isConfirmOpen}
        title="Закрыть без сохранения?"
        description="Внесённые изменения будут потеряны."
        confirmLabel="Закрыть без сохранения"
        cancelLabel="Остаться"
        destructive
        onConfirm={onClose}
        onCancel={() => setIsConfirmOpen(false)}
      />
    </div>,
    document.body,
  );
}
