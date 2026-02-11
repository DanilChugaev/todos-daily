import { type ReactNode, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import './modalDialog.pcss';
import { CloseIcon } from '../Icon/CloseIcon.tsx';
import { Button } from '../Button/Button.tsx';
import { ANIMATION_MS } from '../../constants.ts';

interface ModalDialogProps {
  title: string;
  isOpen: boolean;
  children: ReactNode;
  onClose: () => void;
}

export function ModalDialog({
  title,
  isOpen,
  children,
  onClose,
}: ModalDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const dialog = dialogRef.current;

    if (!dialog) return;

    if (isOpen) {
      dialog.showModal();

      setIsAnimating(true);
    } else {
      setIsAnimating(false);

      setTimeout(() => {
        dialog.close();
      }, ANIMATION_MS);
    }

    return () => {
      if (dialog.open) {
        setTimeout(() => {
          dialog.close();
        }, ANIMATION_MS);
      }
    };
  }, [isOpen]);

  // if (!isOpen && !isAnimating) return null;

  return createPortal(
    <dialog
      className={`modal-dialog ${isAnimating ? 'modal-dialog--active' : ''}`}
      ref={dialogRef}
    >
      <div className="modal-dialog__header">
        <div className="modal-dialog__title">{title}</div>

        <Button className="modal-dialog__close-btn" onClick={onClose}>
          <CloseIcon />
        </Button>
      </div>

      <div className="modal-dialog__content">{children}</div>
    </dialog>,
    document.body,
  );
}