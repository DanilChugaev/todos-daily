import { type ReactNode, useCallback, useEffect, useRef, useState } from 'react';
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
  const [isShowModal, setIsShowModal] = useState(false);

  const handleClose = useCallback((onCloseFn: () => void)=> {
    setIsAnimating(false);

    setTimeout(() => {
      onCloseFn();

      setIsShowModal(false);
    }, ANIMATION_MS);
  }, []);

  useEffect(() => {
    if (isOpen) {
       
      setIsShowModal(true);

      setTimeout(() => {
        dialogRef.current?.showModal();

        setIsAnimating(true);
      }, 0);
    } else {
      handleClose(() => dialogRef.current?.close());
    }

    return () => {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      const dialog = dialogRef.current;

      if (dialog?.open) {
        handleClose(() => dialog.close());
      }
    };
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

  return (
    <>
      {isShowModal && (createPortal(
        <dialog
          className={`modal-dialog ${isAnimating ? 'modal-dialog--active' : ''}`}
          ref={dialogRef}
        >
          <div className="modal-dialog__header">
            <div className="modal-dialog__title">{title}</div>

            <Button className="modal-dialog__close-btn" onClick={() => handleClose(onClose)}>
              <CloseIcon />
            </Button>
          </div>

          <div className="modal-dialog__content">{children}</div>
        </dialog>,
        document.body,
      ))}
    </>
  );
}