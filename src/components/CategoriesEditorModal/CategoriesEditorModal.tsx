import { useState, useCallback } from 'react';
import './categories-editor-modal.pcss';
import { ModalDialog } from '../ModalDialog/ModalDialog.tsx';
import { useCategories } from '../../hooks/useCategories.ts';
import { Input } from '../Form/Input/Input.tsx';
import { Button } from '../Button/Button.tsx';
import { PlusIcon } from '../Icon/PlusIcon.tsx';
import { TrashIcon } from '../Icon/TrashIcon.tsx';
import { useTasks } from '../../hooks/useTasks.ts';
import { GrabPlaceIcon } from '../Icon/GrabPlaceIcon.tsx';
import type { ICategory } from '../../types.ts';
import { ConfirmDialog } from '../ConfirmDialog/ConfirmDialog.tsx';

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
  const [categoryToDelete, setCategoryToDelete] = useState<ICategory | null>(null);

  const { categories, addCategory, updateCategory, deleteCategory, bulkUpdateCategories } = useCategories();
  const { reassignCategory } = useTasks();

  function handleUpdateCategory(id: number, name: string) {
    updateCategory(id, name);
  }

  function handleDelete(category: ICategory) {
    setCategoryToDelete(category);
  }

  async function confirmDeleteCategory() {
    if (!categoryToDelete) return;

    if (selected === categoryToDelete.id) {
      onSelected(0);
    }

    await reassignCategory(categoryToDelete.id, 0);
    await deleteCategory(categoryToDelete.id);
    setCategoryToDelete(null);
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

  const handleAddCategory = () => {
    addCategory('');
  };

  return (
    <>
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

      <Button onClick={handleAddCategory}>
        <PlusIcon/>

        Добавить
      </Button>
      </ModalDialog>
      <ConfirmDialog
        isOpen={categoryToDelete !== null}
        title="Удалить категорию?"
        description={`Задачи из категории «${categoryToDelete?.name ?? ''}» останутся без категории. Это действие нельзя отменить.`}
        confirmLabel="Удалить"
        destructive
        onConfirm={confirmDeleteCategory}
        onCancel={() => setCategoryToDelete(null)}
      />
    </>
  );
}
