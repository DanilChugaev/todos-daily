import './categories.pcss';
import { Button } from '../Button/Button.tsx';
import { useState } from 'react';
import { CategoriesEditorModal } from '../CategoriesEditorModal/CategoriesEditorModal.tsx';
import { EditIcon } from '../Icon/EditIcon.tsx';
import type { ICategory } from '../../types.ts';

interface CategoriesProps {
  selected: number;
  items: ICategory[];
  onSelect: (item: number) => void;
}

export function Categories({ selected, items, onSelect }: CategoriesProps) {
  const [selectedCategory, setSelectedCategory] = useState<number>(selected);
  const [modalOpen, setModalOpen] = useState(false);

  function getClassName(id: number) {
    return `categories__button ${selectedCategory === id ? 'categories__button--active' : ''}`;
  }

  function handleSelect(id: number) {
    setSelectedCategory(id);
    onSelect(id);
  }

  return (
    <>
      <div className="categories">
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

        <Button
          icon
          onClick={() => setModalOpen(true)}
        >
          <EditIcon width={20} height={20}/>
        </Button>
      </div>

      <CategoriesEditorModal
        selected={selectedCategory}
        isOpen={modalOpen}
        onSelected={handleSelect}
        onClose={() => setModalOpen(false)}
      />
    </>
  );
}