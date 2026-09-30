import { useEffect, useId, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Button } from '../Button/Button.tsx';
import './confirm-dialog.pcss';
import { useOverlayHistory } from '../../hooks/useOverlayHistory.ts';

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  description: string;
  confirmLabel: string;
  cancelLabel?: string;
  hideCancel?: boolean;
  destructive?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmDialog({
  isOpen,
  title,
  description,
  confirmLabel,
  cancelLabel = 'Отмена',
  hideCancel = false,
  destructive = false,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  const cancelRef = useRef<HTMLButtonElement>(null);
  const triggerRef = useRef<HTMLElement | null>(null);
  const titleId = useId();

  useOverlayHistory({
    isOpen,
    onBack: () => {
      onCancel();
      return false;
    },
  });

  useEffect(() => {
    if (!isOpen) return undefined;

    triggerRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const focusTimer = window.setTimeout(() => cancelRef.current?.focus(), 0);
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        onCancel();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      window.clearTimeout(focusTimer);
      document.removeEventListener('keydown', handleKeyDown);
      triggerRef.current?.focus();
    };
  }, [isOpen, onCancel]);

  if (!isOpen) return null;

  return createPortal(
    <div className="confirm-dialog" role="presentation">
      <div className="confirm-dialog__backdrop" onClick={onCancel} aria-hidden="true" />
      <section className="confirm-dialog__card" role="alertdialog" aria-modal="true" aria-labelledby={titleId}>
        <h3 id={titleId}>{title}</h3>
        <p>{description}</p>
        <div className="confirm-dialog__actions">
          {!hideCancel && <Button ref={cancelRef} inverted onClick={onCancel}>{cancelLabel}</Button>}
          <Button color={destructive ? 'red' : undefined} onClick={onConfirm}>{confirmLabel}</Button>
        </div>
      </section>
    </div>,
    document.body,
  );
}
