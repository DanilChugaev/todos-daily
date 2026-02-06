import { type ReactNode, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import './modalDialog.pcss';
import { CloseIcon } from '../Icon/CloseIcon.tsx';
import { Button } from '../Button/Button.tsx';
import { ICON_SIZE } from '../../constants.ts';

export function ModalDialog({ isOpen, children, onClose }: { isOpen: boolean, children: ReactNode, onClose: () => void }) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  const [isView, setView] = useState(false);

  useEffect(() => {
    if (isOpen) {
      dialogRef.current?.showModal();

      setTimeout(() => setView(true), 200);
    } else {
      setView(false);

      setTimeout(() => dialogRef.current?.close(), 200);
    }
  }, [isOpen]);

  return (
    <>
      {createPortal(
        (
          <dialog className={`modal-dialog ${isView ? 'modal-dialog--active' : ''}`} ref={dialogRef}>
            <Button className="modal-dialog__close-btn" onClick={onClose}>
              <CloseIcon width={ICON_SIZE} height={ICON_SIZE}/>
            </Button>

            {children}
          </dialog>
        ),
        document.body,
      )}
    </>
  );
}