import './categories-editor-modal.pcss';
import { ModalDialog } from '../ModalDialog/ModalDialog.tsx';
import { useCategories } from '../../hooks/useCategories.ts';
import { Input } from '../Form/Input/Input.tsx';
import { Button } from '../Button/Button.tsx';
import { PlusIcon } from '../Icon/PlusIcon.tsx';
import { TrashIcon } from '../Icon/TrashIcon.tsx';
import type { ICategory } from '../../utils/db/db.ts';
import { useTasks } from '../../hooks/useTasks.ts';

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
  const { categories, addCategory, updateCategory, deleteCategory } = useCategories();
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

  // todo: добавить перемещение категорий (тянуть за иконку перед инпутом)

  return (
    <ModalDialog
      title="Редактировать категории"
      isOpen={isOpen}
      onClose={handleBeforeClose}
    >
      {categories.map(item => (
        <div key={item.id} className="categories-container">
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