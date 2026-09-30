import { useEffect, useId, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Button } from '../Button/Button.tsx';
import { CopyIcon } from '../Icon/CopyIcon.tsx';
import { TrashIcon } from '../Icon/TrashIcon.tsx';
import { StartIcon } from '../Icon/StartIcon.tsx';
import { TaskStatus, type ITask } from '../../types.ts';
import './task-actions-menu.pcss';
import { useOverlayHistory } from '../../hooks/useOverlayHistory.ts';

interface TaskActionsMenuProps {
  task: ITask;
  onStart: (task: ITask) => Promise<void>;
  onDuplicate: (task: ITask) => void | Promise<void>;
  onDelete: (task: ITask) => void;
}

export function TaskActionsMenu({ task, onStart, onDuplicate, onDelete }: TaskActionsMenuProps) {
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const menuId = useId();
  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });

  function openMenu() {
    const rect = triggerRef.current?.getBoundingClientRect();
    if (!rect) return;

    const menuWidth = 190;
    const opensUpward = window.innerHeight - rect.bottom < 160;
    setPosition({
      top: opensUpward ? Math.max(8, rect.top - 152) : rect.bottom + 6,
      left: Math.max(8, Math.min(window.innerWidth - menuWidth - 8, rect.right - menuWidth)),
    });
    setIsOpen(true);
  }

  function closeMenu() {
    setIsOpen(false);
    triggerRef.current?.focus();
  }

  useOverlayHistory({
    isOpen,
    onBack: () => {
      closeMenu();
      return false;
    },
  });

  useEffect(() => {
    if (!isOpen) return undefined;

    const handlePointerDown = (event: PointerEvent) => {
      if (!menuRef.current?.contains(event.target as Node) && !triggerRef.current?.contains(event.target as Node)) closeMenu();
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

  async function handleStart() {
    closeMenu();
    await onStart(task);
  }

  async function handleDuplicate() {
    closeMenu();
    await onDuplicate(task);
  }

  function handleDelete() {
    closeMenu();
    onDelete(task);
  }

  return (
    <div className="task-actions-menu" onClick={(event) => event.stopPropagation()}>
      <Button
        ref={triggerRef}
        icon
        ariaLabel="Действия с задачей"
        aria-haspopup="menu"
        aria-expanded={isOpen}
        aria-controls={menuId}
        onClick={() => isOpen ? closeMenu() : openMenu()}
      >
        <span className="task-actions-menu__dots" aria-hidden="true"><i /><i /><i /></span>
      </Button>

      {isOpen && createPortal(
        <div
          id={menuId}
          ref={menuRef}
          className="task-actions-menu__popup"
          role="menu"
          style={{ top: position.top, left: position.left }}
        >
          {task.status === TaskStatus.NEW && (
            <button type="button" role="menuitem" onClick={handleStart}><StartIcon width={18} height={18} />Взять в работу</button>
          )}
          <button type="button" role="menuitem" onClick={handleDuplicate}><CopyIcon width={18} height={18} />Дублировать</button>
          <button type="button" role="menuitem" className="task-actions-menu__delete" onClick={handleDelete}><TrashIcon width={18} height={18} />Удалить</button>
        </div>,
        document.body,
      )}
    </div>
  );
}
