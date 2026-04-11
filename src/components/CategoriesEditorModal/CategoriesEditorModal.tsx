import './categories-editor-modal.pcss';
import { ModalDialog } from '../ModalDialog/ModalDialog.tsx';
import { useCategories } from '../../hooks/useCategories.ts';
import { Input } from '../Form/Input/Input.tsx';
import { Button } from '../Button/Button.tsx';
import { PlusIcon } from '../Icon/PlusIcon.tsx';
import { TrashIcon } from '../Icon/TrashIcon.tsx';

interface CategoriesEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CategoriesEditorModal({
  isOpen,
  onClose,
}: CategoriesEditorModalProps) {
  const { categories, addCategory, updateCategory, deleteCategory } = useCategories();

  function handleUpdateCategory(id: number, name: string) {
    updateCategory(id, name);
  }

  async function handleDelete(id: number) {
    if (!id) return;

    const confirmed = window.confirm('Точно удалить Категорию?\n\nЭто действие нельзя отменить.');

    if (confirmed) {
      // todo: при удалении категорий у задач с этой категорией очищать категорию
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

          <Button icon onClick={() => handleDelete(item.id)}>
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