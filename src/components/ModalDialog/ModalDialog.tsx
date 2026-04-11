import { type ReactNode, useCallback, useEffect, useRef, useState } from 'react';
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
}

export function ModalDialog({
  title,
  isOpen,
  children,
  onClose,
}: ModalDialogProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isShowModal, setIsShowModal] = useState(false);

  const handleClose = useCallback((onCloseFn: () => void) => {
    setIsAnimating(false);

    setTimeout(() => {
      onCloseFn();

      setIsShowModal(false);
    }, ANIMATION_MS);
  }, []);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        setIsShowModal(true);
      }, 0);

      setTimeout(() => {
        setIsAnimating(true);
      }, 10);
    } else {
      setTimeout(() => {
        handleClose(() => {});
      }, 0);
    }
  }, [isOpen, handleClose]);

  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleClose(onClose);
      }
    };

    document.addEventListener('keydown', handleEscape, false);

    return () => document.removeEventListener('keydown', handleEscape, false);
  }, [isOpen, onClose, handleClose]);

  // todo заменить dialog на обычный div
  return (
    <>
      {isShowModal && (createPortal(
        <>
          <div
            className={`modal-dialog ${isAnimating ? 'modal-dialog--active' : ''}`}
            ref={dialogRef}
          >
            <div className="modal-dialog__header">
              <div className="modal-dialog__title">{title}</div>

              <Button icon className="modal-dialog__close-btn" onClick={() => handleClose(onClose)}>
                <CloseIcon />
              </Button>
            </div>

            <div className="modal-dialog__content">{children}</div>
          </div>
          <div className="modal-dialog-backdrop" onClick={() => handleClose(onClose)}></div>
        </>,
        document.body,
      ))}
    </>
  );
}