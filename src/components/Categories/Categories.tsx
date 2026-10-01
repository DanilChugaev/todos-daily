import './categories.pcss';
import { Button } from '../Button/Button.tsx';
import { useEffect, useState } from 'react';
import { CategoriesEditorModal } from '../CategoriesEditorModal/CategoriesEditorModal.tsx';
import { EditIcon } from '../Icon/EditIcon.tsx';
import type { ICategory } from '../../types.ts';
import type { TaskFilterId } from '../../utils/tasks.ts';

interface CategoriesProps {
  selected: TaskFilterId;
  items: ICategory[];
  todayActiveCount: number;
  overdueActiveCount: number;
  onSelect: (item: TaskFilterId) => void;
}

export function Categories({ selected, items, todayActiveCount, overdueActiveCount, onSelect }: CategoriesProps) {
  const [modalOpen, setModalOpen] = useState(false);

  function getClassName(id: TaskFilterId) {
    return `categories__button ${selected === id ? 'categories__button--active' : ''}`;
  }

  function handleSelect(id: TaskFilterId) {
    onSelect(id);
  }

  useEffect(() => {
    if (typeof selected === 'number' && selected !== 0 && !items.some((category) => category.id === selected)) {
      onSelect(0);
    }
    if (selected === 'overdue' && overdueActiveCount === 0) {
      onSelect('today');
    }
  }, [items, onSelect, overdueActiveCount, selected]);

  return (
    <div className="categories">
      <div className="categories__container">
        <Button
          className={getClassName('today')}
          onClick={() => handleSelect('today')}
        >
          Сегодня{todayActiveCount > 0 ? ` · ${todayActiveCount}` : ''}
        </Button>

        {overdueActiveCount > 0 && (
          <Button
            className={getClassName('overdue')}
            onClick={() => handleSelect('overdue')}
          >
            Просрочено · {overdueActiveCount}
          </Button>
        )}

        <Button
          className={getClassName(0)}
          onClick={() => handleSelect(0)}
        >
          Все
        </Button>

        {items.map(category => {

          return (
            <Button
              key={category.id}
              className={getClassName(category.id)}
              onClick={() => handleSelect(category.id)}
            >
              {category.name}
            </Button>
          );
        })}
      </div>

      <Button
        className="categories__edit"
        icon
        ariaLabel="Редактировать категории"
        onClick={() => setModalOpen(true)}
      >
        <EditIcon width={20} height={20}/>
      </Button>

      <CategoriesEditorModal
        selected={typeof selected === 'number' ? selected : 0}
        isOpen={modalOpen}
        onSelected={handleSelect}
        onClose={() => setModalOpen(false)}
      />
    </div>
  );
}
