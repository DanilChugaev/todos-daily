import './categories.pcss';
import { Button } from '../Button/Button.tsx';
import { useEffect, useState } from 'react';
import { CategoriesEditorModal } from '../CategoriesEditorModal/CategoriesEditorModal.tsx';
import { EditIcon } from '../Icon/EditIcon.tsx';
import type { ICategory } from '../../types.ts';

interface CategoriesProps {
  selected: number;
  items: ICategory[];
  onSelect: (item: number) => void;
}

export function Categories({ selected, items, onSelect }: CategoriesProps) {
  const [modalOpen, setModalOpen] = useState(false);

  function getClassName(id: number) {
    return `categories__button ${selected === id ? 'categories__button--active' : ''}`;
  }

  function handleSelect(id: number) {
    onSelect(id);
  }

  useEffect(() => {
    if (selected !== 0 && !items.some((category) => category.id === selected)) {
      onSelect(0);
    }
  }, [items, onSelect, selected]);

  return (
    <div className="categories">
      <div className="categories__container">
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
        onClick={() => setModalOpen(true)}
      >
        <EditIcon width={20} height={20}/>
      </Button>

      <CategoriesEditorModal
        selected={selected}
        isOpen={modalOpen}
        onSelected={handleSelect}
        onClose={() => setModalOpen(false)}
      />
    </div>
  );
}
