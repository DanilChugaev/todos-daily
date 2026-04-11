import { useState, useCallback } from 'react';
import './categories-editor-modal.pcss';
import { ModalDialog } from '../ModalDialog/ModalDialog.tsx';
import { useCategories } from '../../hooks/useCategories.ts';
import { Input } from '../Form/Input/Input.tsx';
import { Button } from '../Button/Button.tsx';
import { PlusIcon } from '../Icon/PlusIcon.tsx';
import { TrashIcon } from '../Icon/TrashIcon.tsx';
import type { ICategory } from '../../utils/db/db.ts';
import { useTasks } from '../../hooks/useTasks.ts';
import { GrabPlaceIcon } from '../Icon/GrabPlaceIcon.tsx';

interface CategoriesEditorModalProps {
  selected: number;
  isOpen: boolean;
  onClose: () => void;
  onSelected: (value: number) => void;
}

export function CategoriesEditorModal({
  selected,
  isOpen,
  onClose,
  onSelected,
}: CategoriesEditorModalProps) {
  const [draggedId, setDraggedId] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  const { categories, addCategory, updateCategory, deleteCategory, bulkUpdateCategories } = useCategories();
  const { reassignCategory } = useTasks();

  function handleUpdateCategory(id: number, name: string) {
    updateCategory(id, name);
  }

  async function handleDelete({ id, name }: ICategory) {
    if (!id) return;

    const confirmed = window.confirm(`Точно удалить категорию "${name}"?\nУ всех задач в этой категории будут убраны категории.\n\nЭто действие нельзя отменить.`);

    if (confirmed) {
      if (selected === id) {
        onSelected(0);
      }

      await reassignCategory(id, 0);
      // todo: для категорий добавить orderId для порядка
      await deleteCategory(id);
    }
  }

  function handleBeforeClose() {
    onClose();
  }

  const handleDragStart = useCallback((e: React.DragEvent, id: number) => {
    setDraggedId(id);
    e.dataTransfer.effectAllowed = 'move';
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent, index: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverIndex(index);
  }, []);

  const handleDragLeave = useCallback(() => {
    setDragOverIndex(null);
  }, []);

  const handleDrop = useCallback(async (e: React.DragEvent, targetIndex: number) => {
    e.preventDefault();
    setDragOverIndex(null);
    if (draggedId === null) return;

    const draggedIndex = categories.findIndex(c => c.id === draggedId);

    if (draggedIndex === -1 || draggedIndex === targetIndex) {
      setDraggedId(null);
      return;
    }

    const newOrder = [...categories];
    const [draggedItem] = newOrder.splice(draggedIndex, 1);
    newOrder.splice(targetIndex, 0, draggedItem);

    // Присваиваем новые индексы как orderId
    const updatedCategories = newOrder.map((category, i) => ({ ...category, orderId: i }));

    await bulkUpdateCategories(updatedCategories);

    setDraggedId(null);
  }, [draggedId, categories, bulkUpdateCategories]);

  return (
    <ModalDialog
      title="Редактировать категории"
      isOpen={isOpen}
      onClose={handleBeforeClose}
    >
      {categories.map((item, index) => (
        <div key={item.id}
             onDragOver={(e) => handleDragOver(e, index)}
             onDragLeave={handleDragLeave}
             onDrop={(e) => handleDrop(e, index)}
             className={`categories-container ${
               item.id === draggedId ? 'categories-container--dragging' : ''
             } ${
               dragOverIndex === index ? 'categories-container--dragover' : ''
             }`}
        >
          <div
            draggable
            onDragStart={(e) => handleDragStart(e, item.id)}
            className="categories-container__grab"
          >
            <GrabPlaceIcon width={14} height={14}/>
          </div>

          <Input
            id="task-name"
            type="text"
            value={item.name}
            onChange={(e) => handleUpdateCategory(item.id, e.target.value)}
          />

          <Button icon onClick={() => handleDelete(item)}>
            <TrashIcon/>
          </Button>
        </div>
      ))}

      <Button onClick={() => addCategory('')}>
        <PlusIcon/>

        Добавить
      </Button>
    </ModalDialog>
  );
}